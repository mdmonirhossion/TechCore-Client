import { Inter } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://techcorebd.com'),
  title: {
    default: "TechCore | Leading Tech & Computer Shop in Bangladesh",
    template: "%s | TechCore Bangladesh"
  },
  description: "Buy Laptops, Gaming PCs, Graphics Cards, Processors, Monitors, and Computer Accessories at Best Price in Bangladesh with Warranty and Fast Home Delivery.",
  keywords: [
    "TechCore", "Computer Shop Bangladesh", "Gaming PC Price BD", "Laptop Price in BD",
    "Graphics Card BD", "Intel Processor", "Ryzen Processor", "Monitor Price BD", "PC Builder BD"
  ],
  authors: [{ name: "TechCore BD" }],
  creator: "TechCore Bangladesh",
  publisher: "TechCore Bangladesh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://techcorebd.com",
    siteName: "TechCore BD",
    title: "TechCore | Leading Tech & Computer Shop in Bangladesh",
    description: "Buy Laptops, Gaming PCs, Computer Components & Accessories at the best price in BD.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "TechCore Bangladesh Storefront",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechCore | Leading Tech & Computer Shop in BD",
    description: "Best Computer & Electronics Shop in Bangladesh.",
    images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#f2f4f8] text-[#081621] font-sans">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <ShopProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingActions />
        </ShopProvider>
      </body>
    </html>
  );
}
