export const categoryTreeData = [
  {
    id: 'desktop',
    name: 'Desktop',
    slug: 'desktop',
    children: [
      {
        id: 'ai-pc',
        name: 'AI PC',
        slug: 'ai-pc',
        children: ['ASUS', 'MSI', 'Lenovo', 'HP']
      },
      {
        id: 'desktop-offer',
        name: 'Desktop Offer',
        slug: 'desktop-offer',
        children: ['Budget PC', 'Flash Deal']
      },
      {
        id: 'star-pc',
        name: 'Star PC',
        slug: 'star-pc',
        children: ['Intel Core i3', 'Intel Core i5', 'Ryzen 5']
      },
      {
        id: 'gaming-pc',
        name: 'Gaming PC',
        slug: 'gaming-pc',
        children: ['Intel Gaming PC', 'AMD Ryzen Gaming PC', 'RTX 4060 PC', 'RTX 4070 PC']
      },
      {
        id: 'brand-pc',
        name: 'Brand PC',
        slug: 'brand-pc',
        children: ['Dell', 'HP', 'Lenovo', 'Acer', 'ASUS']
      },
      {
        id: 'all-in-one-pc',
        name: 'All-in-One PC',
        slug: 'all-in-one-pc',
        children: ['Dell', 'HP', 'ASUS', 'LENOVO', 'Walton', 'Teclast', 'AOC', 'Value-Top', 'Smart']
      },
      {
        id: 'mini-pc',
        name: 'Portable Mini PC',
        slug: 'mini-pc',
        children: ['ASUS Mini', 'Intel NUC', 'Gigabyte Brix']
      },
      {
        id: 'apple-mac-mini',
        name: 'Apple Mac Mini',
        slug: 'apple-mac-mini',
        children: ['M2 Mac Mini', 'M2 Pro Mac Mini', 'M3 Mac Mini']
      },
      {
        id: 'apple-imac',
        name: 'Apple iMac',
        slug: 'apple-imac',
        children: ['iMac 24 inch M3', 'iMac Retina']
      },
      {
        id: 'apple-mac-studio',
        name: 'Apple Mac Studio',
        slug: 'apple-mac-studio',
        children: ['M2 Max', 'M2 Ultra']
      },
      {
        id: 'apple-mac-pro',
        name: 'Apple Mac Pro',
        slug: 'apple-mac-pro',
        children: ['Rack Mount', 'Tower']
      }
    ]
  },
  {
    id: 'laptop',
    name: 'Laptop',
    slug: 'laptop',
    children: [
      {
        id: 'all-laptop',
        name: 'All Laptops',
        slug: 'all-laptop',
        children: ['ASUS', 'Acer', 'Dell', 'HP', 'Lenovo', 'MSI']
      },
      {
        id: 'gaming-laptop',
        name: 'Gaming Laptop',
        slug: 'gaming-laptop',
        children: ['ASUS ROG Strix', 'Lenovo Legion', 'Acer Nitro', 'MSI Katana', 'HP Victus']
      },
      {
        id: 'premium-ultrabook',
        name: 'Premium Ultrabook',
        slug: 'premium-ultrabook',
        children: ['ZenBook', 'XPS', 'Spectre', 'Yoga']
      },
      {
        id: 'macbook',
        name: 'Apple MacBook',
        slug: 'macbook',
        children: ['MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 14"', 'MacBook Pro 16"']
      }
    ]
  },
  {
    id: 'component',
    name: 'Component',
    slug: 'component',
    children: [
      {
        id: 'processor',
        name: 'Processor / CPU',
        slug: 'processor',
        children: ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9']
      },
      {
        id: 'gpu',
        name: 'Graphics Card (GPU)',
        slug: 'gpu',
        children: ['NVIDIA RTX 4060', 'NVIDIA RTX 4070', 'NVIDIA RTX 4080', 'AMD Radeon RX 7600', 'AMD Radeon RX 7800 XT']
      },
      {
        id: 'motherboard',
        name: 'Motherboard',
        slug: 'motherboard',
        children: ['Intel B760', 'Intel Z790', 'AMD B650', 'AMD X670', 'ASUS', 'Gigabyte', 'MSI']
      },
      {
        id: 'ram',
        name: 'RAM (Desktop & Laptop)',
        slug: 'ram',
        children: ['DDR4 8GB', 'DDR4 16GB', 'DDR5 16GB', 'DDR5 32GB', 'Corsair', 'G.Skill', 'Team']
      },
      {
        id: 'storage',
        name: 'SSD & Hard Disk',
        slug: 'storage',
        children: ['NVMe M.2 SSD 512GB', 'NVMe M.2 SSD 1TB', 'NVMe M.2 SSD 2TB', 'SATA SSD', 'Internal Hard Drive']
      },
      {
        id: 'casing',
        name: 'PC Casing & Cooler',
        slug: 'casing',
        children: ['Antec', 'Corsair', 'Cooler Master', 'Thermalright AIO Liquid Cooler']
      }
    ]
  },
  {
    id: 'monitor',
    name: 'Monitor',
    slug: 'monitor',
    children: [
      {
        id: 'gaming-monitor',
        name: 'Gaming Monitor',
        slug: 'gaming-monitor',
        children: ['144Hz Monitor', '180Hz Monitor', '240Hz Monitor', 'OLED Gaming Display']
      },
      {
        id: '4k-monitor',
        name: '4K & Curved Monitor',
        slug: '4k-monitor',
        children: ['ASUS', 'LG UltraGear', 'Samsung Odyssey', 'BenQ Pro']
      },
      {
        id: 'budget-monitor',
        name: 'Budget & Office Monitor',
        slug: 'budget-monitor',
        children: ['22 Inch Monitor', '24 Inch Monitor', '27 Inch IPS Display']
      }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    slug: 'power',
    children: [
      {
        id: 'psu',
        name: 'Power Supply (PSU)',
        slug: 'psu',
        children: ['550W 80+ Bronze', '650W 80+ Bronze', '750W 80+ Gold', '850W 80+ Gold']
      },
      {
        id: 'ups',
        name: 'Offline & Online UPS',
        slug: 'ups',
        children: ['650VA UPS', '1200VA UPS', '2000VA UPS', 'Online Industrial UPS']
      }
    ]
  },
  {
    id: 'phone',
    name: 'Phone',
    slug: 'phone',
    children: [
      {
        id: 'smartphone',
        name: 'Smartphone',
        slug: 'smartphone',
        children: ['Apple iPhone', 'Samsung Galaxy', 'Xiaomi / Poco', 'Realme', 'Google Pixel']
      }
    ]
  },
  {
    id: 'tablet',
    name: 'Tablet',
    slug: 'tablet',
    children: [
      {
        id: 'ipad',
        name: 'Apple iPad & Android Tab',
        slug: 'tablet',
        children: ['iPad Air', 'iPad Pro', 'Galaxy Tab', 'Xiaomi Pad']
      }
    ]
  },
  {
    id: 'office',
    name: 'Office Equipment',
    slug: 'office',
    children: [
      {
        id: 'printer',
        name: 'Printer & Scanner',
        slug: 'printer',
        children: ['Epson EcoTank', 'HP Laserjet', 'Canon Inkjet', 'Barcode Scanner']
      },
      {
        id: 'projector',
        name: 'Projector & Screen',
        slug: 'projector',
        children: ['Epson Projector', 'BenQ Business', 'Portable LED Mini Projector']
      }
    ]
  },
  {
    id: 'camera',
    name: 'Camera',
    slug: 'camera',
    children: [
      {
        id: 'dslr',
        name: 'DSLR & Mirrorless',
        slug: 'camera',
        children: ['Canon EOS', 'Sony Alpha', 'Nikon Z', 'Fujifilm']
      },
      {
        id: 'action-cam',
        name: 'Action Cam & Drone',
        slug: 'camera',
        children: ['GoPro Hero', 'DJI Osmo', 'Insta360']
      }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    slug: 'security',
    children: [
      {
        id: 'cc-camera',
        name: 'CC Camera & NVR',
        slug: 'security',
        children: ['Hikvision', 'Dahua', 'Imou Wireless Cam', 'TPS High Security']
      }
    ]
  },
  {
    id: 'networking',
    name: 'Networking',
    slug: 'networking',
    children: [
      {
        id: 'router',
        name: 'WiFi Router & Mesh',
        slug: 'router',
        children: ['TP-Link Archer', 'Asus Gaming Router', 'Mercusys', 'Netgear', 'WiFi 6 Router']
      },
      {
        id: 'switch',
        name: 'Network Switch & Cable',
        slug: 'switch',
        children: ['8 Port Switch', '16 Port PoE Switch', 'Cat6 Cable', 'RJ45 Connectors']
      }
    ]
  },
  {
    id: 'software',
    name: 'Software',
    slug: 'software',
    children: [
      {
        id: 'os-antivirus',
        name: 'Windows & Antivirus',
        slug: 'software',
        children: ['Windows 11 Pro', 'Kaspersky Total Security', 'Bitdefender', 'Microsoft 365']
      }
    ]
  },
  {
    id: 'server',
    name: 'Server & Storage',
    slug: 'server',
    children: [
      {
        id: 'rack-server',
        name: 'Rack Server & NAS',
        slug: 'server',
        children: ['Dell PowerEdge', 'HP ProLiant', 'Synology NAS']
      }
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    children: [
      {
        id: 'keyboard-mouse',
        name: 'Keyboard & Mouse',
        slug: 'accessories',
        children: ['Logitech Wireless', 'Razer Gaming', 'Fantech', 'A4Tech']
      }
    ]
  },
  {
    id: 'gadget',
    name: 'Gadget',
    slug: 'gadget',
    children: [
      {
        id: 'smartwatch-earbuds',
        name: 'Smart Watch & Earbuds',
        slug: 'gadget',
        children: ['Apple Watch', 'Galaxy Watch', 'Haylou', 'Realme Buds', 'Anker Soundcore']
      }
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    slug: 'gaming',
    children: [
      {
        id: 'console',
        name: 'Gaming Console & Chair',
        slug: 'gaming',
        children: ['Sony PlayStation 5', 'Xbox Series X', 'Fantech Gaming Chair']
      }
    ]
  },
  {
    id: 'tv',
    name: 'TV',
    slug: 'tv',
    children: [
      {
        id: 'smart-tv',
        name: 'Smart TV & Google TV',
        slug: 'tv',
        children: ['Haier 43" 4K', 'Sony Bravia', 'Samsung QLED', 'LG OLED', 'Xiaomi TV']
      }
    ]
  },
  {
    id: 'appliance',
    name: 'Appliance',
    slug: 'appliance',
    children: [
      {
        id: 'home-appliance',
        name: 'AC & Home Appliance',
        slug: 'appliance',
        children: ['Gree Inverter AC', 'Air Fryer', 'Washing Machine', 'Refrigerator']
      }
    ]
  }
];
