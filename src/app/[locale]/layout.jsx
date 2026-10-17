import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { ShopProvider } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getCategoryTree } from "@/lib/categories";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://techcorebd.com'),
    title: {
      default: isBn
        ? "টেককোর | বাংলাদেশের সেরা টেক ও কম্পিউটার শপ"
        : "TechCore | Leading Tech & Computer Shop in Bangladesh",
      template: isBn ? "%s | টেককোর বাংলাদেশ" : "%s | TechCore Bangladesh"
    },
    description: isBn
      ? "ওয়ারেন্টি ও দ্রুত হোম ডেলিভারিসহ সেরা মূল্যে ল্যাপটপ, গেমিং পিসি, গ্রাফিক্স কার্ড, প্রসেসর ও মনিটর কিনুন।"
      : "Buy Laptops, Gaming PCs, Graphics Cards, Processors, Monitors, and Computer Accessories at Best Price in Bangladesh with Warranty and Fast Home Delivery.",
    keywords: [
      "TechCore", "Computer Shop Bangladesh", "Gaming PC Price BD", "Laptop Price in BD",
      "Graphics Card BD", "Intel Processor", "Ryzen Processor", "Monitor Price BD", "PC Builder BD"
    ],
    authors: [{ name: "TechCore BD" }],
    creator: "TechCore Bangladesh",
    publisher: "TechCore Bangladesh",
    openGraph: {
      type: "website",
      locale: isBn ? "bn_BD" : "en_BD",
      url: `https://techcorebd.com/${locale}`,
      siteName: "TechCore BD",
      title: isBn
        ? "টেককোর | বাংলাদেশের সেরা টেক ও কম্পিউটার শপ"
        : "TechCore | Leading Tech & Computer Shop in Bangladesh",
      description: isBn
        ? "সেরা মূল্যে ল্যাপটপ, গেমিং পিসি, কম্পিউটার কম্পোনেন্টস ও এক্সেসরিজ কিনুন।"
        : "Buy Laptops, Gaming PCs, Computer Components & Accessories at the best price in BD.",
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
      title: isBn ? "টেককোর | বাংলাদেশের সেরা টেক ও কম্পিউটার শপ" : "TechCore | Leading Tech & Computer Shop in BD",
      description: isBn ? "সেরা মূল্যে কম্পিউটার ও ইলেকট্রনিক্স শপ।" : "Best Computer & Electronics Shop in Bangladesh.",
      images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop"],
    },
    alternates: {
      canonical: `https://techcorebd.com/${locale}`,
      languages: {
        'en': 'https://techcorebd.com/en',
        'bn': 'https://techcorebd.com/bn',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const categoryTree = await getCategoryTree();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Automatic Extension Attribute Cleaner to eliminate bis_skin_checked hydration mismatch */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try{
                var o=new MutationObserver(function(m){
                  for(var i=0;i<m.length;i++){
                    var r=m[i];
                    if(r.type==='attributes'&&r.attributeName==='bis_skin_checked'&&r.target){
                      r.target.removeAttribute('bis_skin_checked');
                    }
                  }
                });
                o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});
              }catch(e){}
            })();`,
          }}
        />
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
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ShopProvider>
            <Navbar categoryTree={categoryTree} />
            <main className="w-full flex-grow flex flex-col">{children}</main>
            <Footer />
            <FloatingActions />
          </ShopProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
