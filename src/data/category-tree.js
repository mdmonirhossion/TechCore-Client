export const CATEGORY_TREE = [
  {
    id: 'component',
    title: 'Component',
    slug: 'component',
    icon: 'Cpu',
    children: [
      {
        id: 'processor',
        title: 'Processor / CPU',
        slug: 'component/processor',
        children: [
          { title: 'Intel Processors', slug: 'component/processor/intel', brand: 'INTEL' },
          { title: 'AMD Ryzen Processors', slug: 'component/processor/amd', brand: 'AMD' },
          { title: 'Server CPU', slug: 'component/processor/server', brand: 'INTEL' }
        ]
      },
      {
        id: 'graphics-card',
        title: 'Graphics Card',
        slug: 'component/graphics-card',
        children: [
          { title: 'NVIDIA RTX 40 Series', slug: 'component/graphics-card/rtx-40', brand: 'ASUS' },
          { title: 'NVIDIA RTX 30 Series', slug: 'component/graphics-card/rtx-30', brand: 'MSI' },
          { title: 'AMD Radeon RX 7000 Series', slug: 'component/graphics-card/rx-7000', brand: 'GIGABYTE' },
          { title: 'PowerColor Series', slug: 'component/graphics-card/powercolor', brand: 'POWERCOLOR' },
          { title: 'Manli Series', slug: 'component/graphics-card/manli', brand: 'MANLI' }
        ]
      },
      {
        id: 'motherboard',
        title: 'Motherboard',
        slug: 'component/motherboard',
        children: [
          { title: 'Intel Motherboards (LGA1700)', slug: 'component/motherboard/intel', brand: 'ASUS' },
          { title: 'AMD Motherboards (AM5/AM4)', slug: 'component/motherboard/amd', brand: 'GIGABYTE' }
        ]
      },
      {
        id: 'ram',
        title: 'Memory (RAM)',
        slug: 'component/ram',
        children: [
          { title: 'Desktop DDR5 RAM', slug: 'component/ram/ddr5', brand: 'CORSAIR' },
          { title: 'Desktop DDR4 RAM', slug: 'component/ram/ddr4', brand: 'KINGSTON' },
          { title: 'Laptop RAM', slug: 'component/ram/laptop-ram', brand: 'KINGSTON' }
        ]
      },
      {
        id: 'storage',
        title: 'Storage (SSD / HDD)',
        slug: 'component/storage',
        children: [
          { title: 'M.2 NVMe PCIe 4.0 SSD', slug: 'component/storage/nvme-ssd', brand: 'SAMSUNG' },
          { title: 'SATA 2.5 Inch SSD', slug: 'component/storage/sata-ssd', brand: 'KINGSTON' },
          { title: 'Desktop Hard Drive', slug: 'component/storage/hdd', brand: 'WD' }
        ]
      },
      {
        id: 'psu',
        title: 'Power Supply Unit (PSU)',
        slug: 'component/psu',
        children: [
          { title: '80 PLUS Gold PSU', slug: 'component/psu/gold', brand: 'CORSAIR' },
          { title: '80 PLUS Bronze PSU', slug: 'component/psu/bronze', brand: 'CORSAIR' }
        ]
      }
    ]
  },
  {
    id: 'laptop',
    title: 'Laptop & Notebook',
    slug: 'laptop',
    icon: 'Laptop',
    children: [
      {
        id: 'gaming-laptop',
        title: 'Gaming Laptop',
        slug: 'laptop/gaming-laptop',
        children: [
          { title: 'ASUS ROG / TUF Gaming', slug: 'laptop/gaming-laptop/asus', brand: 'ASUS' },
          { title: 'Lenovo Legion / LOQ', slug: 'laptop/gaming-laptop/lenovo', brand: 'LENOVO' },
          { title: 'MSI Gaming Series', slug: 'laptop/gaming-laptop/msi', brand: 'MSI' },
          { title: 'HP Victus / OMEN', slug: 'laptop/gaming-laptop/hp', brand: 'HP' }
        ]
      },
      {
        id: 'ultrabook',
        title: 'Ultrabook & Premium',
        slug: 'laptop/ultrabook',
        children: [
          { title: 'Apple MacBook Pro & Air', slug: 'laptop/ultrabook/apple', brand: 'APPLE' },
          { title: 'Dell XPS & Inspiron', slug: 'laptop/ultrabook/dell', brand: 'DELL' },
          { title: 'HP Spectre & Envy', slug: 'laptop/ultrabook/hp', brand: 'HP' }
        ]
      }
    ]
  },
  {
    id: 'monitor',
    title: 'Monitor',
    slug: 'monitor',
    icon: 'Monitor',
    children: [
      {
        id: 'gaming-monitor',
        title: 'Gaming Monitor',
        slug: 'monitor/gaming-monitor',
        children: [
          { title: '100Hz - 165Hz Gaming Monitors', slug: 'monitor/gaming-monitor/165hz', brand: 'ASUS' },
          { title: '240Hz+ Esports Monitors', slug: 'monitor/gaming-monitor/240hz', brand: 'MSI' }
        ]
      },
      {
        id: '4k-monitor',
        title: '4K & Professional Monitor',
        slug: 'monitor/4k-monitor',
        children: [
          { title: '4K UHD Color Accurate IPS', slug: 'monitor/4k-monitor/uhd', brand: 'MSI' },
          { title: 'Curved Ultrawide Monitors', slug: 'monitor/4k-monitor/ultrawide', brand: 'SAMSUNG' }
        ]
      }
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
      <h3>1. ASUS TUF Gaming A15 FA507NUR</h3>
      <p>Powered by the AMD Ryzen 7 7435HS processor and 140W TGP RTX 4050/4060, the ASUS TUF A15 delivers incredible frame rates with a durable military-grade chassis and 144Hz IPS display panel.</p>
      <h3>2. Lenovo Legion Slim 5 16IRH8</h3>
      <p>For gamers who also do 4K video editing or 3D rendering, the Legion Slim 5 features a stunning 16" WQXGA 2.5K 165Hz 100% sRGB display with Coldfront 5.0 thermal cooling.</p>
    `
  },
  {
    id: 'blog-102',
    title: 'Intel Core i7-14700K vs AMD Ryzen 7 7800X3D: Ultimate Gaming CPU Guide',
    slug: 'intel-i7-14700k-vs-amd-ryzen-7-7800x3d-guide',
    date: 'September 18, 2026',
    author: 'Tanvir Hasan, Lead Architect',
    category: 'CPU Comparison',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop',
    excerpt: 'Which flagship desktop processor should you buy for your custom PC build? We benchmark gaming FPS, power consumption, and thermal performance.',
    content: `
      <h2>Intel 14th Gen vs AMD AM5 Platform</h2>
      <p>Building an extreme desktop PC presents a key choice: Intel's hybrid 20-core architecture or AMD's revolutionary 96MB 3D V-Cache technology.</p>
      <h3>Gaming FPS Performance</h3>
      <p>The AMD Ryzen 7 7800X3D leads in competitive esports titles like CS2, Valorant, and Cyberpunk 2077 due to its ultra-large L3 cache buffer. However, the Intel Core i7-14700K dominates in multi-threaded productivity tasks like Premiere Pro and Blender.</p>
    `
  }
];
