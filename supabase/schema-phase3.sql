-- ============================================================
--  EcoWeave — Database Schema (Phase 3: Products + Admin Panel)
--
--  schema.sql ke BAAD chalana hai. Ek hi baar chalana hai, lekin
--  dobara chal bhi jaye to kuch toota nahi — sab kuch
--  "if not exists" / "on conflict do nothing" hai.
--
--  Server pe:
--    sudo docker exec -i supabase-db psql -U postgres -d postgres \
--      < supabase/schema-phase3.sql
-- ============================================================


-- ------------------------------------------------------------
--  1. PRODUCTS
--
--  Ab tak ye lib/products.ts mein hardcoded the. Wahan se yahan
--  laane ka matlab: admin panel se add/edit ho payenge.
--
--  price_in_paise — paisa HAMESHA integer mein. "₹3,999" jaisi
--  string se total jodna ya tax lagana possible nahi hai, aur
--  floating point mein paisa rakhna to aur bhi bura hai
--  (0.1 + 0.2 kabhi 0.3 nahi hota).
-- ------------------------------------------------------------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),

  -- URL aur seed dono ke liye. Purane hardcoded ids yahi ban gaye
  -- hain, taaki koi bhi purana link ya bookmark toote nahi.
  slug            text not null unique,

  category        text not null check (category in ('rugs', 'shower', 'table')),
  name            text not null,
  description     text not null default '',
  price_in_paise  integer not null check (price_in_paise >= 0),
  unit            text not null default '',
  icon            text not null default '',

  -- Draft mein rakhne ke liye. Admin product bana kar photo
  -- upload kare, tab tak customer ko na dikhe.
  is_published    boolean not null default true,

  -- Shop mein kis order mein dikhe. Chhota number pehle.
  sort_order      integer not null default 0,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- ------------------------------------------------------------
--  2. PRODUCT IMAGES
--
--  Ek product ki jitni chahe utni photos. Alag table isliye —
--  products table mein img1, img2, img3... columns banana ek
--  aisi galti hai jiski limit hamesha ek kam padti hai.
--
--  `path` do tarah ka ho sakta hai, aur lib/products.ts ka
--  imageUrl() dono sambhalta hai:
--
--    "/images/product-rug-sage.jpg"  -> repo ki public/ folder
--                                       (purane 15 products)
--    "abc123/photo.jpg"              -> Supabase Storage bucket
--                                       (admin ke naye uploads)
--
--  Isi wajah se purani 15 products ko seed karte waqt koi photo
--  upload nahi karni padi.
-- ------------------------------------------------------------
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products on delete cascade,
  path        text not null,
  alt         text not null default '',

  -- Sabse chhote sort_order wali photo hi shop ke card pe dikhti
  -- hai. Alag "is_primary" column nahi rakha — do jagah sach
  -- rakhne se ek din dono alag ho jate hain, aur phir do photos
  -- khud ko main batati hain.
  sort_order  integer not null default 0,

  created_at  timestamptz not null default now()
);

create index if not exists idx_products_category
  on public.products (category, sort_order, created_at);

create index if not exists idx_product_images_product
  on public.product_images (product_id, sort_order);


-- ------------------------------------------------------------
--  3. updated_at apne aap
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
--  Shop bina login ke khulti hai, isliye published products
--  sabko dikhne chahiye — logged out visitor ko bhi.
--  Draft products sirf admin ko.
-- ------------------------------------------------------------
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;


-- ---- PRODUCTS ----

drop policy if exists "public: read published products" on public.products;
create policy "public: read published products" on public.products
  for select using (is_published or public.is_admin());

-- `for all` = insert + update + delete + select, chaaron.
-- with check bhi zaroori hai: uske bina admin ek row insert kar
-- sakta hai aur phir bhi wo policy ke bahar ho sakti hai.
drop policy if exists "admin: write products" on public.products;
create policy "admin: write products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());


-- ---- PRODUCT IMAGES ----

-- Photo utni hi chhupi rehni chahiye jitna uska product. Warna
-- draft product ki photos ka URL bahar padha ja sakta hai.
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
--  5. STORAGE BUCKET (admin ke uploads ke liye)
--
--  public = true matlab photo ka URL bina login ke khulta hai.
--  Shop ki photos ke liye yahi chahiye. "Public" sirf PADHNE ke
--  liye hai — daalna aur mitana neeche wali policies se bandha
--  hai, aur wo sirf admin ko allow karti hain.
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
--  schema.sql ka prevent_role_escalation() sirf itna dekhta hai
--  ki badalne wala admin hai ya nahi. Ek admin khud ko customer
--  bana le to wo bhi "admin ne kiya hai" hai — aur agar wo
--  akhri admin tha, to ab koi bhi admin nahi bana sakta, kyunki
--  admin banane ke liye admin hona zaroori hai.
--
--  Ye us akhri darwaze ko band hone se rokta hai.
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
        'Ye akhri admin hai. Pehle kisi aur ko admin banao, phir ise badlo.';
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
--  Email `auth.users` mein hai, `profiles` mein nahi. `auth` schema
--  API se bahar hai (aur usse bahar hi rehna chahiye), isliye admin
--  panel ko email dikhane ke liye ye function chahiye.
--
--  `security definer` matlab ye function RLS ke bahar chalta hai —
--  yahi iski taakat hai aur yahi iska khatra. Isliye andar `where
--  public.is_admin()` hai: ye nahi hota, to koi bhi logged-in user
--  isko call karke saari email nikaal leta. Function ke bahar policy
--  laga kar nahi roka ja sakta, kyunki definer functions policies
--  ko hi bypass karte hain.
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
--  8. SEED — abhi wale 15 products
--
--  Ye wahi products hain jo lib/products.ts mein hardcoded the.
--  Inke bina shop DB pe switch karte hi khaali ho jati.
--
--  slug purani `id` hi rakhi hai, aur photo ka path repo ki
--  public/images/ hi — kuch upload karne ki zaroorat nahi.
--
--  on conflict do nothing: dobara chala do to duplicate nahi
--  banenge, aur aapke apne edits upar se overwrite nahi honge.
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
--  Chalne ke baad check karo:
--
--    select category, count(*) from public.products group by category;
--      -> rugs 5, shower 5, table 5
--
--    select count(*) from public.product_images;
--      -> 15
-- ============================================================
