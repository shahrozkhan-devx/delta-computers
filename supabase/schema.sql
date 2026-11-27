create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_condition') then
    create type public.product_condition as enum ('new', 'used', 'refurbished');
  end if;
  if not exists (select 1 from pg_type where typname = 'stock_status') then
    create type public.stock_status as enum ('in_stock', 'out_of_stock', 'on_order');
  end if;
end
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  brand_id uuid references public.brands(id) on delete set null,
  condition public.product_condition not null default 'new',
  price numeric(12,2) not null check (price >= 0),
  discount_price numeric(12,2) check (discount_price is null or (discount_price >= 0 and discount_price <= price)),
  stock_qty integer not null default 0 check (stock_qty >= 0),
  stock_status public.stock_status not null default 'in_stock',
  short_desc text,
  description text,
  specs jsonb not null default '{}'::jsonb,
  warranty text,
  thumbnail_url text,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default true,
  is_active boolean not null default true,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  name text not null check (length(name) between 2 and 100),
  phone text not null check (length(phone) between 7 and 30),
  message text check (message is null or length(message) <= 2000),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_brand on public.products(brand_id);
create index if not exists idx_products_active on public.products(is_active, created_at desc);
create index if not exists idx_products_featured on public.products(is_featured) where is_featured;
create index if not exists idx_products_specs on public.products using gin(specs);
create index if not exists idx_product_images_product on public.product_images(product_id, sort_order);
create index if not exists idx_inquiries_created on public.inquiries(created_at desc);

drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "admin_users select self" on public.admin_users;
create policy "admin_users select self" on public.admin_users for select using (user_id = auth.uid());

drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (is_active or public.is_admin());
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "brands public read" on public.brands;
create policy "brands public read" on public.brands for select using (true);
drop policy if exists "brands admin write" on public.brands;
create policy "brands admin write" on public.brands for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (is_active or public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "product_images public read" on public.product_images;
create policy "product_images public read" on public.product_images for select using (true);
drop policy if exists "product_images admin write" on public.product_images;
create policy "product_images admin write" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert" on public.inquiries for insert with check (
  status = 'new'
  and length(name) between 2 and 100
  and length(phone) between 7 and 30
  and (message is null or length(message) <= 2000)
  and (product_id is null or exists (select 1 from public.products where id = product_id and is_active))
);
drop policy if exists "inquiries admin read" on public.inquiries;
create policy "inquiries admin read" on public.inquiries for select using (public.is_admin());
drop policy if exists "inquiries admin update" on public.inquiries;
create policy "inquiries admin update" on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "inquiries admin delete" on public.inquiries;
create policy "inquiries admin delete" on public.inquiries for delete using (public.is_admin());

drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings for select using (true);
drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "product-images admin insert" on storage.objects;
create policy "product-images admin insert" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product-images admin update" on storage.objects;
create policy "product-images admin update" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product-images admin delete" on storage.objects;
create policy "product-images admin delete" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
