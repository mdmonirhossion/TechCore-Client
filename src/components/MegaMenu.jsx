"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Cpu, 
  Laptop, 
  Monitor, 
  HardDrive, 
  Headphones, 
  Wifi, 
  Layers, 
  Gamepad2, 
  ShieldCheck 
} from 'lucide-react';

export const categoriesData = [
  {
    id: 'component',
    title: 'Component',
    slug: 'component',
    icon: Cpu,
    subcategories: [
      {
        title: 'Processor / CPU',
        slug: 'component/processor',
        items: ['Intel Processors', 'AMD Ryzen Processors', 'Processor Cooler']
      },
      {
        title: 'Graphics Card',
        slug: 'component/graphics-card',
        items: ['NVIDIA RTX 40 Series', 'NVIDIA RTX 30 Series', 'AMD Radeon Series']
      },
      {
        title: 'Motherboard',
        slug: 'component/motherboard',
        items: ['Intel Motherboards', 'AMD Motherboards']
      },
      {
        title: 'Memory (RAM)',
        slug: 'component/ram',
        items: ['Desktop RAM', 'Laptop RAM', 'DDR5 RAM', 'DDR4 RAM']
      },
      {
        title: 'Storage',
        slug: 'component/storage',
        items: ['M.2 NVMe SSD', 'SATA 2.5 Inch SSD', 'Desktop Hard Drive', 'Portable HDD']
      },
      {
        title: 'Power Supply & Casing',
        slug: 'component/psu-casing',
        items: ['Power Supply Unit (PSU)', 'Gaming PC Casing', 'Casing Fans']
      }
    ]
  },
  {
    id: 'desktop',
    title: 'Desktop',
    slug: 'desktop',
    icon: HardDrive,
    subcategories: [
      {
        title: 'Gaming PC',
        slug: 'desktop/gaming-pc',
        items: ['Intel Gaming PC', 'AMD Gaming PC', 'Budget Gaming PC', 'High-End Gaming Rig']
      },
      {
        title: 'Brand PC',
        slug: 'desktop/brand-pc',
        items: ['HP Brand PC', 'Dell Brand PC', 'Lenovo Desktop', 'ASUS PC']
      },
      {
        title: 'All-in-One PC',
        slug: 'desktop/all-in-one-pc',
        items: ['Apple iMac', 'HP All-in-One', 'Dell Inspiron AIO']
      },
      {
        title: 'Portable Mini PC',
        slug: 'desktop/mini-pc',
        items: ['Intel NUC', 'ASUS Mini PC', 'Apple Mac Mini']
      }
    ]
  },
  {
    id: 'laptop',
    title: 'Laptop',
    slug: 'laptop',
    icon: Laptop,
    subcategories: [
      {
        title: 'Gaming Laptop',
        slug: 'laptop/gaming-laptop',
        items: ['ASUS ROG / TUF', 'Lenovo Legion / LOQ', 'MSI Gaming', 'Acer Predator']
      },
      {
        title: 'Ultrabook & Premium',
        slug: 'laptop/ultrabook',
        items: ['Apple MacBook Pro', 'Apple MacBook Air', 'Dell XPS', 'HP Spectre / Envy']
      },
      {
        title: 'Budget & Student',
        slug: 'laptop/budget-laptop',
        items: ['Core i3 Laptops', 'Ryzen 3 Laptops', 'Student Special']
      }
    ]
  },
  {
    id: 'monitor',
    title: 'Monitor',
    slug: 'monitor',
    icon: Monitor,
    subcategories: [
      {
        title: 'Gaming Monitor',
        slug: 'monitor/gaming-monitor',
        items: ['144Hz / 165Hz Monitors', '240Hz Gaming Monitors', 'OLED Gaming Monitors']
      },
      {
        title: 'Professional & 4K',
        slug: 'monitor/4k-monitor',
        items: ['4K UHD Monitors', 'IPS Color Accurate', 'Ultrawide Monitors']
      }
    ]
  },
  {
    id: 'accessories',
    title: 'Accessories',
    slug: 'accessories',
    icon: Headphones,
    subcategories: [
      {
        title: 'Keyboard & Mouse',
        slug: 'accessories/keyboard-mouse',
        items: ['Mechanical Keyboards', 'Wireless Keyboards', 'Gaming Mouse', 'Ergonomic Mouse']
      },
      {
        title: 'Audio & Headset',
        slug: 'accessories/audio',
        items: ['Gaming Headset', 'Studio Headphones', 'Bluetooth Speakers', 'Microphones']
      },
      {
        title: 'Gaming Chairs & Desk',
        slug: 'accessories/gaming-furniture',
        items: ['Gaming Chair', 'Height Adjustable Desk']
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking',
    slug: 'networking',
    icon: Wifi,
    subcategories: [
      {
        title: 'Routers & Wi-Fi',
        slug: 'networking/router',
        items: ['Wi-Fi 6 Routers', 'Mesh Wi-Fi Systems', 'Gaming Routers']
      },
      {
        title: 'Network Accessories',
        slug: 'networking/accessories',
        items: ['Network Switches', 'Ethernet Cables', 'Wi-Fi Adapters']
      }
    ]
  },
  {
    id: 'software',
    title: 'Software',
    slug: 'software',
    icon: ShieldCheck,
    subcategories: [
      {
        title: 'Operating System & Security',
        slug: 'software/os-security',
        items: ['Windows 11 Home / Pro', 'Kaspersky Antivirus', 'Bitdefender Total Security']
      }
    ]
  }
];

export default function MegaMenu({ isOpen, onClose }) {
  const [activeCat, setActiveCat] = useState(categoriesData[0]);

  return (
    <div className="relative bg-[#081621] text-white border-t border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 py-1 text-sm font-medium overflow-x-auto scrollbar-none">
          {categoriesData.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                className="group relative inline-block text-left"
                onMouseEnter={() => setActiveCat(cat)}
              >
                <Link
                  href={`/${cat.slug}`}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-md hover:bg-[#3749bb] transition-colors whitespace-nowrap text-gray-200 hover:text-white"
                >
                  <Icon className="w-4 h-4 text-[#ef4a23] group-hover:text-white" />
                  <span>{cat.title}</span>
                </Link>

                {/* Dropdown Flyout */}
                <div className="hidden group-hover:block fixed left-0 right-0 top-[110px] w-full bg-white text-gray-800 shadow-2xl z-50 border-t-2 border-[#3749bb]">
                  <div className="max-w-7xl mx-auto p-6 grid grid-cols-4 gap-6">
                    {cat.subcategories.map((sub, idx) => (
                      <div key={idx} className="space-y-2">
                        <Link 
                          href={`/${sub.slug}`}
                          className="font-bold text-sm text-[#081621] hover:text-[#3749bb] flex items-center group/title border-b pb-1"
                        >
                          <span>{sub.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover/title:opacity-100 transition-opacity text-[#ef4a23]" />
                        </Link>
                        <ul className="space-y-1 text-xs text-gray-600">
                          {sub.items.map((item, itemIdx) => {
                            const itemSlug = `${sub.slug}?filter=${encodeURIComponent(item.toLowerCase().replace(/\s+/g, '-'))}`;
                            return (
                              <li key={itemIdx}>
                                <Link 
                                  href={`/${itemSlug}`} 
                                  className="hover:text-[#ef4a23] hover:underline block py-0.5"
                                >
                                  {item}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
