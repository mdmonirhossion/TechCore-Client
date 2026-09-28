import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Mail, ChevronRight, Navigation } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'TechCore Store Outlets & Locations in Bangladesh | Multiplan, IDB, Uttara',
    description: 'Find physical TechCore computer shop outlets in Dhaka (Multiplan Center Elephant Road, IDB Bhaban Agargaon, Uttara) and Chittagong with store contact numbers and map directions.'
  };
}

const OUTLETS = [
  {
    id: 'multiplan',
    title: 'Multiplan Center Branch (Head Office)',
    city: 'Dhaka',
    address: 'Level 4, Shop #408 & 409, Multiplan Center, New Elephant Road, Dhaka-1205',
    phone: '01700-000000',
    hours: '10:00 AM - 8:00 PM (Weekly Closed: Tuesday)',
    mapUrl: 'https://maps.google.com/maps?q=Multiplan+Center+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed'
  },
  {
    id: 'idb',
    title: 'IDB Bhaban Branch',
    city: 'Dhaka',
    address: 'BCS Computer City, IDB Bhaban, Level 2, Shop #214, Agargaon, Dhaka-1207',
    phone: '01700-000001',
    hours: '10:00 AM - 8:00 PM (Weekly Closed: Sunday)',
    mapUrl: 'https://maps.google.com/maps?q=IDB+Bhaban+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed'
  },
  {
    id: 'uttara',
    title: 'Uttara Branch',
    city: 'Dhaka',
    address: 'Sector 7, Sonargaon Janapath Road, House 12, Level 3, Uttara, Dhaka-1230',
    phone: '01700-000002',
    hours: '10:00 AM - 8:00 PM (Weekly Closed: Wednesday)',
    mapUrl: 'https://maps.google.com/maps?q=Uttara+Sector+7+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed'
  },
  {
    id: 'ctg',
    title: 'Chittagong Agrabad Branch',
    city: 'Chittagong',
    address: 'Lucky Plaza, Level 3, Shop #305, Agrabad C/A, Chittagong',
    phone: '01700-000003',
    hours: '10:00 AM - 8:00 PM (Weekly Closed: Friday)',
    mapUrl: 'https://maps.google.com/maps?q=Agrabad+Chittagong&t=&z=15&ie=UTF8&iwloc=&output=embed'
  }
];

export default function OutletsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">Store Outlets & Locations</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-[#0e1726] text-white p-8 md:p-12 rounded-3xl shadow-xl space-y-3">
        <span className="bg-blue-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
          <MapPin size={14} /> Physical Stores
        </span>
        <h1 className="text-3xl font-black text-white">
          TechCore Store Outlets & Locations
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-xl">
          Visit your nearest TechCore store to experience custom gaming PC builds, touch laptops in person, and get instant technical advice from hardware experts.
        </p>
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OUTLETS.map(outlet => (
          <div key={outlet.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md">
                  {outlet.city} Branch
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock size={12} /> {outlet.hours}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">{outlet.title}</h2>
              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <span>{outlet.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600 shrink-0" />
                  <span>Phone: {outlet.phone}</span>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="w-full h-44 rounded-xl overflow-hidden border">
              <iframe
                title={outlet.title}
                src={outlet.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
