export const shop = {
  name: "Delta Computers",
  tagline: "Technology Providers",
  address: "Main Bazar, Golden Town, near Wireless Gate, Karachi",
  whatsapp: "923012783495",
  contacts: [
    { name: "Ali Rao", phone: "0301-2783495" },
    { name: "Ali Rao", phone: "0340-9751886" },
    { name: "Anwar", phone: "0308-2741694" },
  ],
};

export const categories = [
  { name: "Laptops", slug: "laptops", icon: "laptop", image: "photo-1496181133206-80ce9b88a853" },
  { name: "Desktop PCs", slug: "desktop-pcs", icon: "monitor", image: "photo-1587202372775-e229f172b9d7" },
  { name: "Accessories", slug: "accessories", icon: "headphones", image: "photo-1505740420928-5e560c06d30e" },
  { name: "Components", slug: "components", icon: "cpu", image: "photo-1591799264318-7e6ef8ddb7ea" },
  { name: "Networking", slug: "networking", icon: "router", image: "photo-1558494949-ef010cbdcc31" },
];

const image = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const products = [
  { id: "p-01", name: "HP ProBook 450 G10", slug: "hp-probook-450-g10", category: "laptops", brand: "HP", condition: "New", price: 189000, discount: 179000, stock: 5, featured: true, isNew: true, image: image("photo-1496181133206-80ce9b88a853"), specs: { CPU: "Core i5 13th Gen", RAM: "16GB", Storage: "512GB SSD", Screen: "15.6” FHD" } },
  { id: "p-02", name: "Dell Latitude 5420", slug: "dell-latitude-5420", category: "laptops", brand: "Dell", condition: "Refurbished", price: 119000, discount: 109000, stock: 3, featured: true, isNew: false, image: image("photo-1588872657578-7efd1f1555ed"), specs: { CPU: "Core i5 11th Gen", RAM: "16GB", Storage: "256GB SSD", Screen: "14” FHD" } },
  { id: "p-03", name: "Lenovo ThinkPad E14", slug: "lenovo-thinkpad-e14", category: "laptops", brand: "Lenovo", condition: "New", price: 168000, stock: 7, featured: false, isNew: true, image: image("photo-1588872657578-7efd1f1555ed"), specs: { CPU: "Core i5 12th Gen", RAM: "8GB", Storage: "512GB SSD", Screen: "14” FHD" } },
  { id: "p-04", name: "ASUS VivoBook 15", slug: "asus-vivobook-15", category: "laptops", brand: "Asus", condition: "New", price: 154000, discount: 149000, stock: 4, featured: true, isNew: true, image: image("photo-1496181133206-80ce9b88a853"), specs: { CPU: "Core i5 12th Gen", RAM: "8GB", Storage: "512GB SSD", Screen: "15.6” FHD" } },
  { id: "p-05", name: "Acer Aspire 5", slug: "acer-aspire-5", category: "laptops", brand: "Acer", condition: "New", price: 139000, stock: 2, featured: false, isNew: true, image: image("photo-1588872657578-7efd1f1555ed"), specs: { CPU: "Core i5 12th Gen", RAM: "8GB", Storage: "512GB SSD", Screen: "15.6” FHD" } },
  { id: "p-06", name: "HP EliteBook 840 G7", slug: "hp-elitebook-840-g7", category: "laptops", brand: "HP", condition: "Used", price: 89000, stock: 1, featured: false, isNew: false, image: image("photo-1496181133206-80ce9b88a853"), specs: { CPU: "Core i5 10th Gen", RAM: "8GB", Storage: "256GB SSD", Screen: "14” FHD" } },
  { id: "p-07", name: "Delta Creator Desktop", slug: "delta-creator-desktop", category: "desktop-pcs", brand: "Generic", condition: "New", price: 245000, discount: 235000, stock: 2, featured: true, isNew: true, image: image("photo-1587202372775-e229f172b9d7"), specs: { CPU: "Ryzen 5 5600", RAM: "16GB", Storage: "1TB NVMe", GPU: "RTX 4060" } },
  { id: "p-08", name: "Office Desktop Core i5", slug: "office-desktop-core-i5", category: "desktop-pcs", brand: "Generic", condition: "New", price: 125000, stock: 6, featured: false, isNew: true, image: image("photo-1587202372775-e229f172b9d7"), specs: { CPU: "Core i5 10th Gen", RAM: "8GB", Storage: "256GB SSD", GPU: "Integrated" } },
  { id: "p-09", name: "Compact Home PC", slug: "compact-home-pc", category: "desktop-pcs", brand: "Dell", condition: "Refurbished", price: 72000, stock: 0, featured: false, isNew: false, image: image("photo-1587202372775-e229f172b9d7"), specs: { CPU: "Core i5 8th Gen", RAM: "8GB", Storage: "256GB SSD", GPU: "Integrated" } },
  { id: "p-10", name: "Wireless Precision Mouse", slug: "wireless-precision-mouse", category: "accessories", brand: "Logitech", condition: "New", price: 4500, discount: 3990, stock: 14, featured: false, isNew: true, image: image("photo-1527814050087-3793815479db"), specs: { Type: "Wireless", Connection: "USB receiver", Warranty: "1 year" } },
  { id: "p-11", name: "Mechanical Keyboard", slug: "mechanical-keyboard", category: "accessories", brand: "Generic", condition: "New", price: 8500, stock: 8, featured: true, isNew: true, image: image("photo-1587829741301-dc798b83add3"), specs: { Type: "Mechanical", Layout: "Full size", Lighting: "RGB" } },
  { id: "p-12", name: "Studio Headset", slug: "studio-headset", category: "accessories", brand: "Generic", condition: "New", price: 6200, stock: 12, featured: false, isNew: true, image: image("photo-1505740420928-5e560c06d30e"), specs: { Type: "Over-ear", Connection: "3.5mm", Microphone: "Built-in" } },
  { id: "p-13", name: "DDR4 16GB Memory", slug: "ddr4-16gb-memory", category: "components", brand: "Kingston", condition: "New", price: 11500, stock: 10, featured: true, isNew: true, image: image("photo-1591799264318-7e6ef8ddb7ea"), specs: { Type: "DDR4", Capacity: "16GB", Speed: "3200MHz" } },
  { id: "p-14", name: "1TB NVMe SSD", slug: "1tb-nvme-ssd", category: "components", brand: "Kingston", condition: "New", price: 22500, stock: 5, featured: false, isNew: true, image: image("photo-1597872200969-2b65d56bd16b"), specs: { Type: "NVMe M.2", Capacity: "1TB", Interface: "PCIe 4.0" } },
  { id: "p-15", name: "TP-Link Archer AX23", slug: "tp-link-archer-ax23", category: "networking", brand: "TP-Link", condition: "New", price: 18900, discount: 17500, stock: 4, featured: true, isNew: true, image: image("photo-1558494949-ef010cbdcc31"), specs: { Standard: "Wi-Fi 6", Speed: "AX1800", Coverage: "Whole home" } },
];

export const brands = [...new Set(products.map((product) => product.brand))].sort();
