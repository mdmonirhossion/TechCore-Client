export const CATEGORY_TREE = [
  {
    id: 'desktop',
    name: 'Desktop',
    title: 'Desktop',
    slug: 'desktop',
    fullPath: 'desktop',
    icon: 'Monitor',
    children: [
      { name: 'AI PC', title: 'AI PC', slug: 'ai-pc', fullPath: 'desktop/ai-pc', children: [] },
      { name: 'Desktop Offer', title: 'Desktop Offer', slug: 'desktop-offer', fullPath: 'desktop/desktop-offer', children: [] },
      { name: 'Star PC', title: 'Star PC', slug: 'star-pc', fullPath: 'desktop/star-pc', children: [] },
      { name: 'Gaming PC', title: 'Gaming PC', slug: 'gaming-pc', fullPath: 'desktop/gaming-pc', children: [
        { name: 'Intel Gaming PC', title: 'Intel Gaming PC', slug: 'intel-gaming-pc', fullPath: 'desktop/gaming-pc/intel-gaming-pc', children: [] },
        { name: 'AMD Gaming PC', title: 'AMD Gaming PC', slug: 'amd-gaming-pc', fullPath: 'desktop/gaming-pc/amd-gaming-pc', children: [] }
      ] },
      {
        name: 'Brand PC',
        title: 'Brand PC',
        slug: 'brand-pc',
        fullPath: 'desktop/brand-pc',
        children: [
          { name: 'Acer', title: 'Acer', slug: 'acer', fullPath: 'desktop/brand-pc/acer', brand: 'Acer', children: [] },
          { name: 'ASUS', title: 'ASUS', slug: 'asus', fullPath: 'desktop/brand-pc/asus', brand: 'ASUS', children: [] },
          { name: 'Dell', title: 'Dell', slug: 'dell', fullPath: 'desktop/brand-pc/dell', brand: 'Dell', children: [] },
          { name: 'HP', title: 'HP', slug: 'hp', fullPath: 'desktop/brand-pc/hp', brand: 'HP', children: [] },
          { name: 'Lenovo', title: 'Lenovo', slug: 'lenovo', fullPath: 'desktop/brand-pc/lenovo', brand: 'Lenovo', children: [] },
          { name: 'MSI', title: 'MSI', slug: 'msi', fullPath: 'desktop/brand-pc/msi', brand: 'MSI', children: [] },
          { name: 'Gigabyte', title: 'Gigabyte', slug: 'gigabyte', fullPath: 'desktop/brand-pc/gigabyte', brand: 'Gigabyte', children: [] }
        ]
      },
      { name: 'All-in-One PC', title: 'All-in-One PC', slug: 'all-in-one-pc', fullPath: 'desktop/all-in-one-pc', children: [] },
      { name: 'Portable Mini PC', title: 'Portable Mini PC', slug: 'portable-mini-pc', fullPath: 'desktop/portable-mini-pc', children: [] },
      { name: 'Apple Mac Mini', title: 'Apple Mac Mini', slug: 'apple-mac-mini', fullPath: 'desktop/apple-mac-mini', children: [] },
      { name: 'Apple iMac', title: 'Apple iMac', slug: 'apple-imac', fullPath: 'desktop/apple-imac', children: [] },
      { name: 'Apple Mac Studio', title: 'Apple Mac Studio', slug: 'apple-mac-studio', fullPath: 'desktop/apple-mac-studio', children: [] },
      { name: 'Apple Mac Pro', title: 'Apple Mac Pro', slug: 'apple-mac-pro', fullPath: 'desktop/apple-mac-pro', children: [] }
    ]
  },
  {
    id: 'laptop',
    name: 'Laptop',
    title: 'Laptop',
    slug: 'laptop',
    icon: 'Laptop',
    fullPath: 'laptop',
    children: [
      {
        id: 'gaming-laptop',
        name: 'Gaming Laptop',
        title: 'Gaming Laptop',
        slug: 'gaming-laptop',
        fullPath: 'laptop/gaming-laptop',
        children: [
          { name: 'ASUS ROG / TUF Gaming', title: 'ASUS ROG / TUF Gaming', slug: 'asus', fullPath: 'laptop/gaming-laptop/asus', brand: 'ASUS', children: [] },
          { name: 'Lenovo Legion / LOQ', title: 'Lenovo Legion / LOQ', slug: 'lenovo', fullPath: 'laptop/gaming-laptop/lenovo', brand: 'LENOVO', children: [] },
          { name: 'MSI Gaming Series', title: 'MSI Gaming Series', slug: 'msi', fullPath: 'laptop/gaming-laptop/msi', brand: 'MSI', children: [] },
          { name: 'HP Victus / OMEN', title: 'HP Victus / OMEN', slug: 'hp', fullPath: 'laptop/gaming-laptop/hp', brand: 'HP', children: [] }
        ]
      },
      {
        id: 'ultrabook',
        name: 'Ultrabook & Premium',
        title: 'Ultrabook & Premium',
        slug: 'ultrabook',
        fullPath: 'laptop/ultrabook',
        children: [
          { name: 'Apple MacBook Pro & Air', title: 'Apple MacBook Pro & Air', slug: 'apple', fullPath: 'laptop/ultrabook/apple', brand: 'APPLE', children: [] },
          { name: 'Dell XPS & Inspiron', title: 'Dell XPS & Inspiron', slug: 'dell', fullPath: 'laptop/ultrabook/dell', brand: 'DELL', children: [] },
          { name: 'HP Spectre & Envy', title: 'HP Spectre & Envy', slug: 'hp', fullPath: 'laptop/ultrabook/hp', brand: 'HP', children: [] }
        ]
      },
      { name: 'Business Laptop', title: 'Business Laptop', slug: 'business-laptop', fullPath: 'laptop/business-laptop', children: [] },
      { name: 'Student & Budget Laptop', title: 'Student & Budget Laptop', slug: 'budget-laptop', fullPath: 'laptop/budget-laptop', children: [] }
    ]
  },
  {
    id: 'component',
    name: 'Component',
    title: 'Component',
    slug: 'component',
    fullPath: 'component',
    icon: 'Cpu',
    children: [
      { name: 'Casing', title: 'Casing', slug: 'casing', fullPath: 'component/casing', children: [
        { name: 'Gaming Casing', title: 'Gaming Casing', slug: 'gaming-casing', fullPath: 'component/casing/gaming-casing', children: [] },
        { name: 'Mid Tower Casing', title: 'Mid Tower Casing', slug: 'mid-tower-casing', fullPath: 'component/casing/mid-tower-casing', children: [] }
      ] },
      { name: 'Casing Cooler', title: 'Casing Cooler', slug: 'casing-cooler', fullPath: 'component/casing-cooler', children: [] },
      { name: 'CPU Cooler', title: 'CPU Cooler', slug: 'cpu-cooler', fullPath: 'component/cpu-cooler', children: [
        { name: 'Air Cooler', title: 'Air Cooler', slug: 'air-cooler', fullPath: 'component/cpu-cooler/air-cooler', children: [] },
        { name: 'Liquid AIO Cooler', title: 'Liquid AIO Cooler', slug: 'liquid-cooler', fullPath: 'component/cpu-cooler/liquid-cooler', children: [] }
      ] },
      {
        id: 'graphics-card',
        name: 'Graphics Card',
        title: 'Graphics Card',
        slug: 'graphics-card',
        fullPath: 'component/graphics-card',
        children: [
          { name: 'ASUS', title: 'ASUS', slug: 'asus', fullPath: 'component/graphics-card/asus', brand: 'ASUS', children: [] },
          { name: 'GIGABYTE', title: 'GIGABYTE', slug: 'gigabyte', fullPath: 'component/graphics-card/gigabyte', brand: 'GIGABYTE', children: [] },
          { name: 'Manli', title: 'Manli', slug: 'manli', fullPath: 'component/graphics-card/manli', brand: 'MANLI', children: [] },
          { name: 'MSI', title: 'MSI', slug: 'msi', fullPath: 'component/graphics-card/msi', brand: 'MSI', children: [] },
          { name: 'PowerColor', title: 'PowerColor', slug: 'powercolor', fullPath: 'component/graphics-card/powercolor', brand: 'POWERCOLOR', children: [] },
          { name: 'XFX', title: 'XFX', slug: 'xfx', fullPath: 'component/graphics-card/xfx', brand: 'XFX', children: [] },
          { name: 'NVIDIA RTX 40 Series', title: 'NVIDIA RTX 40 Series', slug: 'rtx-40', fullPath: 'component/graphics-card/rtx-40', children: [] },
          { name: 'NVIDIA RTX 30 Series', title: 'NVIDIA RTX 30 Series', slug: 'rtx-30', fullPath: 'component/graphics-card/rtx-30', children: [] },
          { name: 'AMD Radeon RX 7000 Series', title: 'AMD Radeon RX 7000 Series', slug: 'rx-7000', fullPath: 'component/graphics-card/rx-7000', children: [] }
        ]
      },
      {
        id: 'motherboard',
        name: 'Motherboard',
        title: 'Motherboard',
        slug: 'motherboard',
        fullPath: 'component/motherboard',
        children: [
          { name: 'Intel Motherboards (LGA1700)', title: 'Intel Motherboards (LGA1700)', slug: 'intel', fullPath: 'component/motherboard/intel', brand: 'ASUS', children: [] },
          { name: 'AMD Motherboards (AM5/AM4)', title: 'AMD Motherboards (AM5/AM4)', slug: 'amd', fullPath: 'component/motherboard/amd', brand: 'GIGABYTE', children: [] }
        ]
      },
      { name: 'Pen Drive', title: 'Pen Drive', slug: 'pen-drive', fullPath: 'component/pen-drive', children: [] },
      {
        id: 'psu',
        name: 'Power Supply',
        title: 'Power Supply',
        slug: 'power-supply',
        fullPath: 'component/power-supply',
        children: [
          { name: '80 PLUS Gold PSU', title: '80 PLUS Gold PSU', slug: 'gold', fullPath: 'component/power-supply/gold', brand: 'CORSAIR', children: [] },
          { name: '80 PLUS Bronze PSU', title: '80 PLUS Bronze PSU', slug: 'bronze', fullPath: 'component/power-supply/bronze', brand: 'CORSAIR', children: [] }
        ]
      },
      {
        id: 'processor',
        name: 'Processor',
        title: 'Processor',
        slug: 'processor',
        fullPath: 'component/processor',
        children: [
          { name: 'Intel Processors', title: 'Intel Processors', slug: 'intel', fullPath: 'component/processor/intel', brand: 'INTEL', children: [] },
          { name: 'AMD Ryzen Processors', title: 'AMD Ryzen Processors', slug: 'amd', fullPath: 'component/processor/amd', brand: 'AMD', children: [] },
          { name: 'Server CPU', title: 'Server CPU', slug: 'server', fullPath: 'component/processor/server', brand: 'INTEL', children: [] }
        ]
      },
      {
        id: 'ram',
        name: 'RAM (Memory)',
        title: 'RAM (Memory)',
        slug: 'ram',
        fullPath: 'component/ram',
        children: [
          { name: 'Desktop DDR5 RAM', title: 'Desktop DDR5 RAM', slug: 'ddr5', fullPath: 'component/ram/ddr5', brand: 'CORSAIR', children: [] },
          { name: 'Desktop DDR4 RAM', title: 'Desktop DDR4 RAM', slug: 'ddr4', fullPath: 'component/ram/ddr4', brand: 'KINGSTON', children: [] },
          { name: 'Laptop RAM', title: 'Laptop RAM', slug: 'laptop-ram', fullPath: 'component/ram/laptop-ram', brand: 'KINGSTON', children: [] }
        ]
      },
      {
        id: 'storage',
        name: 'SSD / Storage',
        title: 'SSD / Storage',
        slug: 'storage',
        fullPath: 'component/storage',
        children: [
          { name: 'M.2 NVMe PCIe 4.0 SSD', title: 'M.2 NVMe PCIe 4.0 SSD', slug: 'nvme-ssd', fullPath: 'component/storage/nvme-ssd', brand: 'SAMSUNG', children: [] },
          { name: 'SATA 2.5 Inch SSD', title: 'SATA 2.5 Inch SSD', slug: 'sata-ssd', fullPath: 'component/storage/sata-ssd', brand: 'KINGSTON', children: [] },
          { name: 'Desktop Hard Drive', title: 'Desktop Hard Drive', slug: 'hdd', fullPath: 'component/storage/hdd', brand: 'WD', children: [] }
        ]
      }
    ]
  },
  {
    id: 'monitor',
    name: 'Monitor',
    title: 'Monitor',
    slug: 'monitor',
    fullPath: 'monitor',
    icon: 'Monitor',
    children: [
      {
        id: 'gaming-monitor',
        name: 'Gaming Monitor',
        title: 'Gaming Monitor',
        slug: 'gaming-monitor',
        fullPath: 'monitor/gaming-monitor',
        children: [
          { name: '100Hz - 165Hz Gaming Monitors', title: '100Hz - 165Hz Gaming Monitors', slug: '165hz', fullPath: 'monitor/gaming-monitor/165hz', brand: 'ASUS', children: [] },
          { name: '240Hz+ Esports Monitors', title: '240Hz+ Esports Monitors', slug: '240hz', fullPath: 'monitor/gaming-monitor/240hz', brand: 'MSI', children: [] }
        ]
      },
      {
        id: '4k-monitor',
        name: '4K & Professional Monitor',
        title: '4K & Professional Monitor',
        slug: '4k-monitor',
        fullPath: 'monitor/4k-monitor',
        children: [
          { name: '4K UHD Color Accurate IPS', title: '4K UHD Color Accurate IPS', slug: 'uhd', fullPath: 'monitor/4k-monitor/uhd', brand: 'MSI', children: [] },
          { name: 'Curved Ultrawide Monitors', title: 'Curved Ultrawide Monitors', slug: 'ultrawide', fullPath: 'monitor/4k-monitor/ultrawide', brand: 'SAMSUNG', children: [] }
        ]
      },
      { name: 'Curved Monitor', title: 'Curved Monitor', slug: 'curved-monitor', fullPath: 'monitor/curved-monitor', children: [] },
      { name: 'OLED Monitor', title: 'OLED Monitor', slug: 'oled-monitor', fullPath: 'monitor/oled-monitor', children: [] }
    ]
  },
  {
    id: 'ups',
    name: 'UPS',
    title: 'UPS',
    slug: 'ups',
    fullPath: 'ups',
    icon: 'Zap',
    children: [
      { name: 'Online UPS', title: 'Online UPS', slug: 'online-ups', fullPath: 'ups/online-ups', children: [] },
      { name: 'Offline UPS', title: 'Offline UPS', slug: 'offline-ups', fullPath: 'ups/offline-ups', children: [] }
    ]
  },
  {
    id: 'office-equipment',
    name: 'Office Equipment',
    title: 'Office Equipment',
    slug: 'office-equipment',
    fullPath: 'office-equipment',
    icon: 'Printer',
    children: [
      { name: 'Laser Printer', title: 'Laser Printer', slug: 'laser-printer', fullPath: 'office-equipment/laser-printer', children: [] },
      { name: 'Inkjet Printer', title: 'Inkjet Printer', slug: 'inkjet-printer', fullPath: 'office-equipment/inkjet-printer', children: [] },
      { name: 'Scanner', title: 'Scanner', slug: 'scanner', fullPath: 'office-equipment/scanner', children: [] },
      { name: 'Projector', title: 'Projector', slug: 'projector', fullPath: 'office-equipment/projector', children: [] },
      { name: 'Photocopier', title: 'Photocopier', slug: 'photocopier', fullPath: 'office-equipment/photocopier', children: [] }
    ]
  },
  {
    id: 'mobile-accessories',
    name: 'Mobile Accessories',
    title: 'Mobile Accessories',
    slug: 'mobile-accessories',
    fullPath: 'mobile-accessories',
    icon: 'Smartphone',
    children: [
      { name: 'Smartwatch', title: 'Smartwatch', slug: 'smartwatch', fullPath: 'mobile-accessories/smartwatch', children: [] },
      { name: 'Earbuds & Audio', title: 'Earbuds & Audio', slug: 'earbuds', fullPath: 'mobile-accessories/earbuds', children: [] },
      { name: 'Power Bank', title: 'Power Bank', slug: 'power-bank', fullPath: 'mobile-accessories/power-bank', children: [] }
    ]
  },
  {
    id: 'ac',
    name: 'AC',
    title: 'AC',
    slug: 'ac',
    fullPath: 'ac',
    icon: 'Wind',
    children: [
      { name: '1.0 Ton Inverter AC', title: '1.0 Ton Inverter AC', slug: '1-ton-inverter', fullPath: 'ac/1-ton-inverter', children: [] },
      { name: '1.5 Ton Inverter AC', title: '1.5 Ton Inverter AC', slug: '1-5-ton-inverter', fullPath: 'ac/1-5-ton-inverter', children: [] },
      { name: '2.0 Ton Inverter AC', title: '2.0 Ton Inverter AC', slug: '2-ton-inverter', fullPath: 'ac/2-ton-inverter', children: [] }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    title: 'Security',
    slug: 'security',
    fullPath: 'security',
    icon: 'Camera',
    children: [
      { name: 'CC Camera', title: 'CC Camera', slug: 'cc-camera', fullPath: 'security/cc-camera', children: [] },
      { name: 'IP Camera', title: 'IP Camera', slug: 'ip-camera', fullPath: 'security/ip-camera', children: [] },
      { name: 'DVR & NVR', title: 'DVR & NVR', slug: 'dvr-nvr', fullPath: 'security/dvr-nvr', children: [] }
    ]
  },
  {
    id: 'networking',
    name: 'Networking',
    title: 'Networking',
    slug: 'networking',
    fullPath: 'networking',
    icon: 'Wifi',
    children: [
      { name: 'Router', title: 'Router', slug: 'router', fullPath: 'networking/router', children: [] },
      { name: 'Mesh Wi-Fi', title: 'Mesh Wi-Fi', slug: 'mesh-wifi', fullPath: 'networking/mesh-wifi', children: [] },
      { name: 'Switch', title: 'Switch', slug: 'switch', fullPath: 'networking/switch', children: [] },
      { name: 'Access Point', title: 'Access Point', slug: 'access-point', fullPath: 'networking/access-point', children: [] }
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    title: 'Accessories',
    slug: 'accessories',
    fullPath: 'accessories',
    icon: 'Headphones',
    children: [
      { name: 'Keyboard', title: 'Keyboard', slug: 'keyboard', fullPath: 'accessories/keyboard', children: [] },
      { name: 'Mouse', title: 'Mouse', slug: 'mouse', fullPath: 'accessories/mouse', children: [] },
      { name: 'Headphone', title: 'Headphone', slug: 'headphone', fullPath: 'accessories/headphone', children: [] },
      { name: 'Mouse Pad', title: 'Mouse Pad', slug: 'mouse-pad', fullPath: 'accessories/mouse-pad', children: [] }
    ]
  },
  {
    id: 'server-storage',
    name: 'Server & Storage',
    title: 'Server & Storage',
    slug: 'server-storage',
    fullPath: 'server-storage',
    icon: 'Server',
    children: [
      { name: 'Rack Server', title: 'Rack Server', slug: 'rack-server', fullPath: 'server-storage/rack-server', children: [] },
      { name: 'NAS Storage', title: 'NAS Storage', slug: 'nas-storage', fullPath: 'server-storage/nas-storage', children: [] }
    ]
  },
  {
    id: 'gadget',
    name: 'Gadget',
    title: 'Gadget',
    slug: 'gadget',
    fullPath: 'gadget',
    icon: 'Watch',
    children: [
      { name: 'Smart Band', title: 'Smart Band', slug: 'smart-band', fullPath: 'gadget/smart-band', children: [] },
      { name: 'Gimbal', title: 'Gimbal', slug: 'gimbal', fullPath: 'gadget/gimbal', children: [] },
      { name: 'Action Camera', title: 'Action Camera', slug: 'action-camera', fullPath: 'gadget/action-camera', children: [] }
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    title: 'Gaming',
    slug: 'gaming',
    fullPath: 'gaming',
    icon: 'Gamepad2',
    children: [
      { name: 'Gaming Chair', title: 'Gaming Chair', slug: 'gaming-chair', fullPath: 'gaming/gaming-chair', children: [] },
      { name: 'Gaming Desk', title: 'Gaming Desk', slug: 'gaming-desk', fullPath: 'gaming/gaming-desk', children: [] },
      { name: 'Gamepad / Controller', title: 'Gamepad / Controller', slug: 'gamepad', fullPath: 'gaming/gamepad', children: [] }
    ]
  },
  {
    id: 'tv',
    name: 'TV',
    title: 'TV',
    slug: 'tv',
    fullPath: 'tv',
    icon: 'Tv',
    children: [
      { name: 'Smart Android TV', title: 'Smart Android TV', slug: 'smart-android-tv', fullPath: 'tv/smart-android-tv', children: [] },
      { name: '4K UHD TV', title: '4K UHD TV', slug: '4k-uhd-tv', fullPath: 'tv/4k-uhd-tv', children: [] },
      { name: 'OLED TV', title: 'OLED TV', slug: 'oled-tv', fullPath: 'tv/oled-tv', children: [] }
    ]
  },
  {
    id: 'appliance',
    name: 'Appliance',
    title: 'Appliance',
    slug: 'appliance',
    fullPath: 'appliance',
    icon: 'Box',
    children: [
      { name: 'Air Purifier', title: 'Air Purifier', slug: 'air-purifier', fullPath: 'appliance/air-purifier', children: [] },
      { name: 'Microwave Oven', title: 'Microwave Oven', slug: 'microwave-oven', fullPath: 'appliance/microwave-oven', children: [] },
      { name: 'Vacuum Cleaner', title: 'Vacuum Cleaner', slug: 'vacuum-cleaner', fullPath: 'appliance/vacuum-cleaner', children: [] }
    ]
  }
];

export const MOCK_BLOGS = [
  {
    id: 'blog-101',
    title: 'Top 10 Best Gaming Laptops in Bangladesh 2026',
    slug: 'top-10-best-gaming-laptops-in-bangladesh-2026',
    date: 'September 25, 2026',
    author: 'TechCore Hardware Team',
    category: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop',
    excerpt: 'Looking for the ultimate gaming laptop with RTX 4060 or 4070 GPU in BD? Read our expert testing results and official warranty comparison guide.',
    content: `
      <h2>Finding the Perfect Gaming Laptop in BD</h2>
      <p>Choosing a high-performance gaming laptop in Bangladesh requires balancing thermal dissipation, GPU Wattage (TGP), display panel color accuracy, and official manufacturer warranty coverage. In 2026, the NVIDIA GeForce RTX 4060 8GB GDDR6 remains the sweet spot for 1080p and 1440p gaming at ultra settings.</p>
    `
  }
];
