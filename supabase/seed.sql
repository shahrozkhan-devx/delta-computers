insert into public.categories (name, slug, sort_order) values
  ('Laptops', 'laptops', 1),
  ('Desktop PCs', 'desktop-pcs', 2),
  ('Accessories', 'accessories', 3),
  ('Components', 'components', 4),
  ('Networking', 'networking', 5)
on conflict (slug) do nothing;

insert into public.brands (name, slug) values
  ('HP', 'hp'), ('Dell', 'dell'), ('Lenovo', 'lenovo'), ('Asus', 'asus'),
  ('Acer', 'acer'), ('Apple', 'apple'), ('TP-Link', 'tp-link'), ('Kingston', 'kingston'),
  ('Logitech', 'logitech'), ('Generic', 'generic')
on conflict (slug) do nothing;

insert into public.site_settings (key, value) values (
  'shop',
  jsonb_build_object(
    'name', 'Delta Computers',
    'tagline', 'Technology Providers',
    'address', 'Main Bazar, Golden Town, near Wireless Gate, Karachi',
    'contacts', jsonb_build_array(
      jsonb_build_object('name', 'Ali Rao', 'phone', '0301-2783495'),
      jsonb_build_object('name', 'Ali Rao', 'phone', '0340-9751886'),
      jsonb_build_object('name', 'Anwar', 'phone', '0308-2741694')
    ),
    'whatsapp', '923012783495'
  )
) on conflict (key) do nothing;

with demo(name, slug, category, brand, condition, price, discount, stock, featured, image, specs) as (
  values
    ('HP ProBook 450 G10','hp-probook-450-g10','laptops','HP','new',189000,179000,5,true,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85','{"cpu":"Core i5 13th Gen","ram":"16GB","storage":"512GB SSD","screen":"15.6 FHD"}'::jsonb),
    ('Dell Latitude 5420','dell-latitude-5420','laptops','Dell','refurbished',119000,109000,3,true,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85','{"cpu":"Core i5 11th Gen","ram":"16GB","storage":"256GB SSD","screen":"14 FHD"}'::jsonb),
    ('Lenovo ThinkPad E14','lenovo-thinkpad-e14','laptops','Lenovo','new',168000,null,7,false,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85','{"cpu":"Core i5 12th Gen","ram":"8GB","storage":"512GB SSD"}'::jsonb),
    ('ASUS VivoBook 15','asus-vivobook-15','laptops','Asus','new',154000,149000,4,true,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85','{"cpu":"Core i5 12th Gen","ram":"8GB","storage":"512GB SSD"}'::jsonb),
    ('Delta Creator Desktop','delta-creator-desktop','desktop-pcs','Generic','new',245000,235000,2,true,'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85','{"cpu":"Ryzen 5 5600","ram":"16GB","storage":"1TB NVMe","gpu":"RTX 4060"}'::jsonb),
    ('Office Desktop Core i5','office-desktop-core-i5','desktop-pcs','Generic','new',125000,null,6,false,'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85','{"cpu":"Core i5 10th Gen","ram":"8GB","storage":"256GB SSD"}'::jsonb),
    ('Wireless Precision Mouse','wireless-precision-mouse','accessories','Logitech','new',4500,3990,14,false,'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85','{"type":"Wireless","connection":"USB receiver","warranty":"1 year"}'::jsonb),
    ('Mechanical Keyboard','mechanical-keyboard','accessories','Generic','new',8500,null,8,true,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85','{"type":"Mechanical","layout":"Full size","lighting":"RGB"}'::jsonb),
    ('DDR4 16GB Memory','ddr4-16gb-memory','components','Kingston','new',11500,null,10,true,'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=85','{"type":"DDR4","capacity":"16GB","speed":"3200MHz"}'::jsonb),
    ('1TB NVMe SSD','1tb-nvme-ssd','components','Kingston','new',22500,null,5,false,'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85','{"type":"NVMe M.2","capacity":"1TB","interface":"PCIe 4.0"}'::jsonb),
    ('TP-Link Archer AX23','tp-link-archer-ax23','networking','TP-Link','new',18900,17500,4,true,'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85','{"standard":"Wi-Fi 6","speed":"AX1800"}'::jsonb)
)
insert into public.products (
  name, slug, category_id, brand_id, condition, price, discount_price, stock_qty,
  stock_status, is_featured, is_new_arrival, is_active, thumbnail_url, specs, short_desc
)
select d.name, d.slug, c.id, b.id, d.condition::public.product_condition, d.price, d.discount, d.stock,
  case when d.stock > 0 then 'in_stock'::public.stock_status else 'out_of_stock'::public.stock_status end,
  d.featured, true, true, d.image, d.specs, 'Demo listing — please confirm availability with the shop.'
from demo d
join public.categories c on c.slug = d.category
left join public.brands b on b.name = d.brand
on conflict (slug) do nothing;

-- Create an admin account in Supabase Authentication first, then run:
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'admin@yourdomain.com';
