# TechCore Bangladesh - Next.js (App Router) Storefront

This directory (`/web`) contains the modern, production-grade Next.js (App Router) storefront for **TechCore Bangladesh**, built with React 19, Tailwind CSS v4, Lucide React icons, and dynamic SEO capabilities.

---

## 🌟 Key Features

* **App Router Architecture**: 100% Next.js App Router with Server Components, Client State Providers, and Incremental Static Regeneration (ISR).
* **Bangladeshi Tech E-Commerce Experience**:
  * **MegaMenu**: Multi-tier hover flyout for laptops, desktop PCs, components, monitors, and accessories.
  * **Featured Category**: 8-column responsive row layout.
  * **Featured Products**: 5-column responsive row layout with instant cart actions.
  * **Product Details**: Multi-image gallery, Cash vs. 0% EMI radio selector, stepper quantity control, key features strip, specification matrix, and instant "Buy Now" checkout redirect.
* **Interactive Tools**:
  * **Custom PC Builder (`/pc-builder`)**: Interactive slot picker, live wattage calculation, recommended PSU calculation, print quotation, and one-click share link copy.
  * **Product Comparison (`/compare`)**: Side-by-side spec matrix comparison with "Highlight Differences" toggle.
  * **Official Warranty Checker (`/warranty`)**: Lookup product warranty status by Serial Number or Invoice ID.
  * **Real-time Order Tracker (`/track-order`)**: Delivery pipeline tracker with courier partner tracking numbers.
  * **Service Centers (`/service-center`)**: Official RMA hubs and store outlets across Bangladesh.
* **SEO Foundation**:
  * Dynamic `sitemap.xml` & `robots.txt`.
  * OpenGraph, Twitter Cards, and canonical URLs.
  * `BreadcrumbList`, `Product`, `Organization`, and `Article` JSON-LD structured data.
* **Analytics & E-Commerce Tracking**: Google Tag Manager & GA4 e-commerce events (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`).

---

## 🚀 Environment Variables

Create a `.env.local` file in `/web`:

```env
NEXT_PUBLIC_API_URL=https://techcore-server.vercel.app
NEXT_PUBLIC_SITE_URL=https://techcorebd.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## 🛠 Local Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build

# Start production server
npm start
```

---

## 🌐 Vercel Deployment Guide

1. Import this repository into Vercel.
2. Set **Root Directory** to `web` (or deploy from root with output settings).
3. Add `NEXT_PUBLIC_API_URL=https://techcore-server.vercel.app` in Vercel Environment Variables.
4. Deploy!
