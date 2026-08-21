-- ============================================================
--  EcoWeave — Database Schema (Phase 2: Auth + Artisan Join)
--  Supabase Dashboard > SQL Editor mein ye poora file paste
--  karke "Run" dabao. Ek hi baar chalana hai.
-- ============================================================


-- ------------------------------------------------------------
--  1. PROFILES
--  Supabase ka apna `auth.users` table password/email sambhalta
--  hai. Usme hum apni fields nahi daal sakte, isliye ye alag
--  table banate hain jo auth.users se juda hota hai.
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer'
              check (role in ('customer', 'artisan', 'admin')),
  created_at  timestamptz not null default now()
);


-- ------------------------------------------------------------
--  2. ARTISAN APPLICATIONS
--  "Join Platform" form ka data yahan aayega.
--  status = pending -> admin approve/reject karega
-- ------------------------------------------------------------
create table if not exists public.artisan_applications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,
  full_name         text not null,
  phone             text not null,
  cluster           text not null check (cluster in ('Panipat', 'Jaipur', 'Other')),
  craft_type        text not null,
  loom_count        int  check (loom_count >= 0),
  experience_years  int  check (experience_years >= 0),
  message           text,
  status            text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now(),

  -- Ek user sirf ek hi application de sakta hai
  unique (user_id)
);


-- ------------------------------------------------------------
--  3. HELPER: is_admin()
--  RLS policy ke andar seedha profiles table check karenge to
--  infinite recursion ho jayega (policy khud profiles pe hai).
--  `security definer` RLS ko bypass karta hai, isliye safe hai.
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ------------------------------------------------------------
--  4. AUTO-CREATE PROFILE ON SIGNUP
--  Jab bhi koi signup karega, auth.users mein row banegi.
--  Ye trigger uske saath profiles row bhi bana dega.
--
--  SECURITY: role yahan hamesha 'customer' hi set hota hai.
--  User apne signup data se khud ko 'admin' nahi bana sakta.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ------------------------------------------------------------
--  5. ROW LEVEL SECURITY (RLS)
--  Ye ON karna ZAROORI hai. Iske bina koi bhi logged-in user
--  dusre ka pura data padh sakta hai.
-- ------------------------------------------------------------
alter table public.profiles              enable row level security;
alter table public.artisan_applications  enable row level security;


-- ---- PROFILES policies ----

-- Apni profile padh sakte ho
drop policy if exists "own profile: select" on public.profiles;
create policy "own profile: select" on public.profiles
  for select using (auth.uid() = id);

-- Apni profile update kar sakte ho (role chhodkar - neeche dekho)
drop policy if exists "own profile: update" on public.profiles;
create policy "own profile: update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Admin sab profiles dekh sakta hai
drop policy if exists "admin: read all profiles" on public.profiles;
create policy "admin: read all profiles" on public.profiles
  for select using (public.is_admin());

-- Admin kisi ki bhi profile update kar sakta hai (role badalne ke liye)
drop policy if exists "admin: update all profiles" on public.profiles;
create policy "admin: update all profiles" on public.profiles
  for update using (public.is_admin());


-- ---- ARTISAN APPLICATIONS policies ----

-- Apni application submit kar sakte ho
drop policy if exists "own application: insert" on public.artisan_applications;
create policy "own application: insert" on public.artisan_applications
  for insert with check (auth.uid() = user_id);

-- Apni application ka status dekh sakte ho
drop policy if exists "own application: select" on public.artisan_applications;
create policy "own application: select" on public.artisan_applications
  for select using (auth.uid() = user_id);

-- Admin sabhi applications dekh sakta hai
drop policy if exists "admin: read all applications" on public.artisan_applications;
create policy "admin: read all applications" on public.artisan_applications
  for select using (public.is_admin());

-- Admin approve/reject kar sakta hai
drop policy if exists "admin: update applications" on public.artisan_applications;
create policy "admin: update applications" on public.artisan_applications
  for update using (public.is_admin());


-- ------------------------------------------------------------
--  6. ROLE PROTECTION
--  Upar wali "own profile: update" policy user ko apni profile
--  update karne deti hai — lekin usse wo apna role 'admin' bhi
--  kar sakta tha. Ye trigger use rokta hai.
-- ------------------------------------------------------------
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Agar role badla ja raha hai aur badalne wala admin nahi hai
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Aap apna role khud nahi badal sakte';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role on public.profiles;
create trigger protect_role
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();


-- ------------------------------------------------------------
--  7. APPROVAL -> ROLE SYNC
--  Jab admin application approve kare, user ka role apne aap
--  'artisan' ho jaye. Ek hi jagah sach rahe.
-- ------------------------------------------------------------
create or replace function public.sync_artisan_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    update public.profiles set role = 'artisan' where id = new.user_id;
    new.reviewed_at := now();
  elsif new.status = 'rejected' and old.status is distinct from 'rejected' then
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_application_reviewed on public.artisan_applications;
create trigger on_application_reviewed
  before update on public.artisan_applications
  for each row execute function public.sync_artisan_role();


-- ------------------------------------------------------------
--  8. INDEXES (speed ke liye - data badhne pe kaam aayenge)
-- ------------------------------------------------------------
create index if not exists idx_applications_status
  on public.artisan_applications (status, created_at desc);

create index if not exists idx_profiles_role
  on public.profiles (role);


-- ============================================================
--  KHUD KO ADMIN BANANE KE LIYE:
--  Pehle website pe normal signup karo, phir ye chalao
--  (apna email daalkar):
--
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users
--                where email = 'tumhara@email.com');
-- ============================================================
