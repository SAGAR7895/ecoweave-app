-- ============================================================
--  EcoWeave — Database Schema (Phase 3: Products + Admin Panel)
--
--  Run after schema.sql. Meant to be run once, but running it again
--  breaks nothing — every statement is "if not exists" or
--  "on conflict do nothing".
--
--  On the server:
--    sudo docker exec -i supabase-db psql -U postgres -d postgres \
--      -v ON_ERROR_STOP=1 --single-transaction < supabase/schema-phase3.sql
-- ============================================================


-- ------------------------------------------------------------
--  1. PRODUCTS
--
--  These were hardcoded in lib/products.ts until now. Moving them
--  here is what makes them editable from the admin panel.
--
--  price_in_paise — money is ALWAYS an integer. You cannot add up a
--  total, apply tax or issue a refund from a string like "₹3,999",
--  and keeping money in a float is worse still (0.1 + 0.2 never
--  quite makes 0.3).
-- ------------------------------------------------------------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),

  -- Used by the seed and available for URLs later. The old hardcoded
  -- ids became these, so no existing link or bookmark breaks.
  slug            text not null unique,

  category        text not null check (category in ('rugs', 'shower', 'table')),
  name            text not null,
  description     text not null default '',
  price_in_paise  integer not null check (price_in_paise >= 0),
  unit            text not null default '',
  icon            text not null default '',

  -- For keeping something as a draft: the admin creates the product
  -- and uploads photos without a customer seeing a half-built page.
  is_published    boolean not null default true,

  -- Position in the shop. Lower numbers come first.
  sort_order      integer not null default 0,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- ------------------------------------------------------------
--  2. PRODUCT IMAGES
--
--  As many photos per product as wanted. A separate table because
--  img1, img2, img3… columns is the kind of mistake whose limit is
--  always one short of what is needed.
--
--  `path` comes in two forms, and imageUrl() in lib/products.ts
--  handles both:
--
--    "/images/product-rug-sage.jpg"  the repo's public/ folder
--                                    (the original fifteen)
--    "abc123/photo.jpg"              the Supabase Storage bucket
--                                    (everything uploaded since)
--
--  That is why seeding the original fifteen required no uploads.
-- ------------------------------------------------------------
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products on delete cascade,
  path        text not null,
  alt         text not null default '',

  -- The lowest sort_order is the photo the shop card shows. There is
  -- deliberately no separate is_primary column: two places holding
  -- the same truth eventually disagree, and then two photos both
  -- claim to be the main one.
  sort_order  integer not null default 0,

  created_at  timestamptz not null default now()
);

create index if not exists idx_products_category
  on public.products (category, sort_order, created_at);

create index if not exists idx_product_images_product
  on public.product_images (product_id, sort_order);


-- ------------------------------------------------------------
--  3. updated_at, kept current automatically
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();


-- ------------------------------------------------------------
--  4. ROW LEVEL SECURITY
--
--  The shop is open without logging in, so published products have
--  to be readable by everyone, signed out included. Drafts by admins
--  only.
-- ------------------------------------------------------------
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;


-- ---- PRODUCTS ----

drop policy if exists "public: read published products" on public.products;
create policy "public: read published products" on public.products
  for select using (is_published or public.is_admin());

-- `for all` covers insert, update, delete and select. The with check
-- matters as much as the using: without it an admin could insert a
-- row that then falls outside the policy.
drop policy if exists "admin: write products" on public.products;
create policy "admin: write products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());


-- ---- PRODUCT IMAGES ----

-- A photo must stay exactly as hidden as its product. Otherwise the
-- URL of a draft product's photo can be read from outside.
drop policy if exists "public: read images of visible products" on public.product_images;
create policy "public: read images of visible products" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.is_published or public.is_admin())
    )
  );

drop policy if exists "admin: write product images" on public.product_images;
create policy "admin: write product images" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());


-- ------------------------------------------------------------
--  5. STORAGE BUCKET (for admin uploads)
--
--  public = true means a photo's URL opens without a login, which is
--  what a shop needs. "Public" is about READING only — putting files
--  in and taking them out is governed by the policies below, and
--  those allow admins and nobody else.
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "admin: upload product images" on storage.objects;
create policy "admin: upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin: replace product images" on storage.objects;
create policy "admin: replace product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin: delete product images" on storage.objects;
create policy "admin: delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());


-- ------------------------------------------------------------
--  6. LAST ADMIN PROTECTION
--
--  prevent_role_escalation() in schema.sql only asks whether the
--  person making the change is an admin. An admin turning themselves
--  into a customer passes that test — and if they were the last
--  admin, nobody can ever appoint another one, because appointing an
--  admin requires being one.
--
--  This stops that last door closing.
-- ------------------------------------------------------------
create or replace function public.prevent_last_admin_demotion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role = 'admin' and new.role is distinct from 'admin' then
    if (select count(*) from public.profiles where role = 'admin') <= 1 then
      raise exception
        'This is the only admin left. Make someone else an admin first.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_last_admin on public.profiles;
create trigger protect_last_admin
  before update on public.profiles
  for each row execute function public.prevent_last_admin_demotion();


-- ------------------------------------------------------------
--  7. ADMIN USER LIST
--
--  Email lives in auth.users, not in profiles. The auth schema is
--  not exposed through the API — and should not be — so the admin
--  panel needs this function to show an address.
--
--  `security definer` means it runs outside RLS. That is both its
--  purpose and its danger, which is why `where public.is_admin()` is
--  inside it: without that line any signed-in user could call it and
--  read every email address on the site. A policy on the outside
--  cannot help, because definer functions are exactly what bypasses
--  policies.
-- ------------------------------------------------------------
create or replace function public.admin_list_users()
returns table (
  id                uuid,
  email             text,
  full_name         text,
  phone             text,
  role              text,
  created_at        timestamptz,
  last_sign_in_at   timestamptz,
  email_confirmed   boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    u.email::text,
    p.full_name,
    p.phone,
    p.role,
    p.created_at,
    u.last_sign_in_at,
    (u.email_confirmed_at is not null)
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.is_admin()
  order by p.created_at desc;
$$;


-- ------------------------------------------------------------
--  8. SEED — the original fifteen products
--
--  The same products that were hardcoded in lib/products.ts. Without
--  them the shop would have gone empty the moment it started reading
--  from the database.
--
--  The slug is the old `id`, and the photo path is the repo's own
--  public/images/ — so nothing needed uploading.
--
--  on conflict do nothing: run it twice and no duplicates appear,
--  and nothing you have edited since gets overwritten.
-- ------------------------------------------------------------
with seed(slug, category, name, description, price_in_paise, unit, icon, sort_order, img) as (
  values
    ('rug-darri-geometric', 'rugs', 'Darri Geometric — Handloom',
     'Hand-woven cotton darri in geometric pattern. Pit-loom woven by Shakil Ahamad, Panipat.',
     399900, '4×6 ft', '🏠', 1, '/images/product-rug-darri-geometric.jpg'),
    ('rug-durrie-natural-stripe', 'rugs', 'Durrie Natural Stripe',
     'Flat-weave durrie in natural undyed cotton. Woven by Mohammed Iqbal, Panipat cluster.',
     279900, '3×5 ft', '🏠', 2, '/images/product-rug-durrie-natural.jpg'),
    ('rug-block-print-indigo', 'rugs', 'Block Print Handloom — Indigo',
     'Handloom base with Sanganer indigo block print border. Jahangir Alam & Tauhid Alam collaboration.',
     449900, '4×6 ft', '🏠', 3, '/images/product-rug-indigo.jpg'),
    ('rug-carpet-terracotta', 'rugs', 'Carpet Weave — Terracotta',
     'Hand-knotted carpet weave in warm terracotta tones. Md Munna Mustak, Panipat — 20 years of craft.',
     599900, '4×6 ft', '🏠', 4, '/images/product-rug-terracotta.jpg'),
    ('rug-handloom-sage', 'rugs', 'Handloom Solid — Sage',
     'Dense handloom flat-weave in muted sage. Woven by Prem Chand, Rajiv Colony, Panipat.',
     329900, '3×5 ft', '🏠', 5, '/images/product-rug-sage.jpg'),

    ('shower-botanical-block', 'shower', 'Botanical Block Print',
     'Sanganer block-print botanical motifs on CiCLO® base. Tauhid Alam, Sanganer Jaipur.',
     229900, 'Single', '🚿', 1, '/images/product-shower-botanical.jpg'),
    ('shower-indigo-stripe', 'shower', 'Indigo Stripe — Handloom',
     'Crisp woven indigo & white stripes. Quick-dry CiCLO® polyester. Panipat woven.',
     189900, 'Single', '🚿', 2, '/images/product-shower-indigo-stripe.jpg'),
    ('shower-natural-waffle', 'shower', 'Natural Waffle Weave',
     'Classic waffle texture in natural ivory. Water-resistant CiCLO® polyester weave.',
     169900, 'Single', '🚿', 3, '/images/product-shower-waffle.jpg'),
    ('shower-jaipur-floral', 'shower', 'Jaipur Floral Print',
     'Traditional Jaipur floral block-print in fuchsia & sage. Sunita Devi, Sanganer.',
     269900, 'Single', '🚿', 4, '/images/product-shower-jaipur-floral.jpg'),
    ('shower-geometric-mosaic', 'shower', 'Geometric Mosaic',
     'Bold geometric tile-print in earthy terracotta tones. CiCLO® certified throughout.',
     209900, 'Single', '🚿', 5, '/images/product-shower-geometric.jpg'),

    ('table-ivory-runner', 'table', 'Ivory Table Runner — Handloom',
     'Clean ivory runner with subtle woven border. 14×72 inches. Prem Chand, Panipat.',
     89900, 'Single', '🍽️', 1, '/images/product-table-ivory-runner.jpg'),
    ('table-jaipur-tablecloth', 'table', 'Jaipur Block Print Tablecloth',
     'Hand block-printed in traditional Jaipur motifs by Jahangir Alam. 60×90 inches.',
     219900, 'Single', '🍽️', 2, '/images/product-table-jaipur-print.jpg'),
    ('table-terracotta-placemats', 'table', 'Terracotta Placemats — Set 4',
     'Warm terracotta with Sanganer block-print border. Tauhid Alam. 13×18 inches each.',
     109900, 'Set/4', '🍽️', 3, '/images/product-table-terracotta-mats.jpg'),
    ('table-sage-napkins', 'table', 'Sage Green Napkins — Set 6',
     'Warm sage dinner napkins with hemstitched edges. Woven by Tufar Ali, Panipat.',
     119900, 'Set/6', '🍽️', 4, '/images/product-table-sage-napkins.jpg'),
    ('table-natural-placemats', 'table', 'Natural Woven Placemats — Set 6',
     'Textured natural weave placemats. 13×18 inches each. CiCLO® certified polyester.',
     149900, 'Set/6', '🍽️', 5, '/images/product-table-natural-mats.jpg')
),
inserted as (
  insert into public.products
    (slug, category, name, description, price_in_paise, unit, icon, sort_order)
  select slug, category, name, description, price_in_paise, unit, icon, sort_order
  from seed
  on conflict (slug) do nothing
  returning id, slug
)
insert into public.product_images (product_id, path, alt, sort_order)
select i.id, s.img, s.name, 0
from inserted i
join seed s on s.slug = i.slug;


-- ============================================================
--  Afterwards, check:
--
--    select category, count(*) from public.products group by category;
--      -> rugs 5, shower 5, table 5
--
--    select count(*) from public.product_images;
--      -> 15
-- ============================================================
