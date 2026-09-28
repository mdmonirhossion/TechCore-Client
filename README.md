# 🛒 TechCore Bangladesh - Open Source Full-Stack E-Commerce & Tech Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TechCore Bangladesh is a production-grade, open-source computer & gadget e-commerce storefront built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and dynamic **SEO & Analytics integration**. Designed specifically for high-volume tech retailers, computer builders, and electronics shops in South Asia.

---

## 🚀 Key Features

* **⚡ App Router & Server Components**: Built on Next.js 16 App Router featuring Incremental Static Regeneration (ISR), dynamic metadata API, and fast server-side rendering.
* **📦 Tech Category Navigation**:
  * **MegaMenu**: Multi-level hover flyout for laptops, desktop PCs, components, monitors, and accessories.
  * **Featured Categories**: 8-column responsive grid layout.
  * **Featured Products**: 5-column responsive grid layout with instant cart addition.
  * **Product Details**: Multi-image gallery, Cash Discount vs. 0% EMI radio selector, stepper quantity control, specifications table, and "Buy Now" instant checkout redirect.
* **🔧 Interactive Computer Tools**:
  * **Custom PC Builder (`/pc-builder`)**: Interactive component slot picker, live power consumption estimation (`Watts`), recommended PSU calculator, quotation printing, and shareable build links.
  * **Product Comparison Matrix (`/compare`)**: Compare up to 4 items side-by-side with a "Highlight Differences" toggle.
* **🛡️ Customer Service & Warranty Portals**:
  * **Warranty Checker (`/warranty`)**: Lookup product warranty coverage and status by Serial Number or Invoice ID.
  * **Order Tracking (`/track-order`)**: Delivery pipeline tracker with courier partner integration (Steadfast, Paperfly, RedX).
  * **Service Centers (`/service-center`)**: Official RMA hubs and store outlets across Bangladesh.
* **🎯 SEO & Analytics**:
  * Dynamic `sitemap.xml` & `robots.txt`.
  * OpenGraph tags, Twitter Card metadata, and canonical links.
  * Rich JSON-LD schemas (`BreadcrumbList`, `Product`, `Organization`, `Article`).
  * GTM & GA4 e-commerce tracking (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`).

---

## 🛠 Project Architecture

```text
TechCore-Client/
├── src/
│   ├── app/                    # Next.js App Router Page Routes
│   │   ├── [...category]/      # Dynamic 1-4 level category filter & sorting
│   │   ├── product/[slug]/     # Product details page with ISR & JSON-LD
│   │   ├── cart/               # Shopping cart & coupon discount manager
│   │   ├── checkout/           # Shipping & payment gateway checkout
│   │   ├── pc-builder/         # Custom PC building tool with wattage calculator
│   │   ├── compare/            # Side-by-side product comparison matrix
│   │   ├── warranty/           # Serial number & invoice warranty checker
│   │   ├── track-order/        # Delivery pipeline tracking portal
│   │   ├── service-center/     # Official RMA hubs & branch store locations
│   │   ├── login/ & account/   # Customer authentication & profile portal
│   │   ├── sitemap.js          # Dynamic XML sitemap generator
│   │   ├── robots.js           # Dynamic robots.txt generator
│   │   └── layout.js           # Root layout with ShopProvider & Navbar
│   ├── components/             # Reusable UI Components
│   │   ├── Navbar.jsx          # Header navigation bar & live search
│   │   ├── MegaMenu.jsx        # Category flyout menu
│   │   ├── ProductCard.jsx     # Responsive product card
│   │   ├── HeroCarousel.jsx    # Promo carousel banner
│   │   ├── Footer.jsx          # Multi-column footer
│   │   └── FloatingActions.jsx # Sticky actions (Cart, Compare, Scroll to Top)
│   ├── context/
│   │   └── ShopContext.js      # Global Cart, Wishlist, Compare & Auth Provider
│   └── lib/
│       └── analytics.js        # GTM & GA4 event trackers
├── public/                     # Static media assets
├── next.config.mjs             # Next.js config & remote image patterns
└── package.json                # Project dependencies & scripts
```

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Backend API Base URL (Express + MongoDB server)
NEXT_PUBLIC_API_URL=https://techcore-server.vercel.app

# Canonical Site URL
NEXT_PUBLIC_SITE_URL=https://techcorebd.com

# Optional: Google Tag Manager ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## 💻 Local Development & Installation

```bash
# Clone the repository
git clone https://github.com/mdmonirhossion/TechCore-Client.git
cd TechCore-Client

# Install dependencies
npm install

# Start local development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 🏗️ Production Build & Vercel Deployment

```bash
# Test production build locally
npm run build

# Start production server locally
npm start
```

### Deploying on Vercel:
1. Import repository `mdmonirhossion/TechCore-Client` into [Vercel](https://vercel.com).
2. Leave **Root Directory** as default (`./`).
3. Set Environment Variable: `NEXT_PUBLIC_API_URL=https://techcore-server.vercel.app`.
4. Click **Deploy**.

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/mdmonirhossion/TechCore-Client/issues).

Distributed under the **MIT License**. See `LICENSE` for details.
