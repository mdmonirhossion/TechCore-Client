import React from 'react';

const pageContents = {
  'about-us': {
    title: 'About TechCore Bangladesh',
    content: 'TechCore is one of the premier computer and technology retailers in Bangladesh, specializing in high-performance gaming desktop PCs, laptops, computer components, and official accessories. Established with the vision to provide 100% authentic tech products at competitive prices.'
  },
  'terms': {
    title: 'Terms & Conditions',
    content: 'Welcome to TechCore Bangladesh. By using our website or placing an order, you agree to comply with our terms of service, payment policies, and warranty guidelines.'
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: 'At TechCore Bangladesh, we respect your privacy. We store user data securely and use it solely for processing orders, managing warranty requests, and providing customer support.'
  },
  'refund-policy': {
    title: 'Return & Refund Policy',
    content: 'Products can be returned or exchanged within 7 days of purchase if delivered damaged, defective, or incorrect. Products must be in original packaging with unbroken serial tags.'
  }
};

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  const page = pageContents[slug] || { title: slug.replace(/-/g, ' ').toUpperCase() };
  return {
    title: `${page.title} | TechCore Bangladesh`,
  };
}

export default async function StaticPage({ params }) {
  const slug = (await params).slug;
  const page = pageContents[slug] || {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    content: 'Page details and terms content.'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621]">{page.title}</h1>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-xs text-gray-700 leading-relaxed">
        <p>{page.content}</p>
      </div>
    </div>
  );
}
