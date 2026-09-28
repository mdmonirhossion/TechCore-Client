import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export const metadata = {
  title: 'Branch & Store Outlets in Bangladesh | TechCore',
  description: 'Find TechCore computer shop outlets in Dhaka (Multiplan, IDB, Uttara, Dhanmondi), Chattogram, Rajshahi, Sylhet and Khulna.',
};

const outlets = [
  {
    city: 'Dhaka',
    name: 'Multiplan Branch (Headquarters)',
    address: 'Shop #408-410, Level 4, Multiplan Center, New Elephant Road, Dhaka 1205',
    phone: '+880 1700-000001',
    hours: '10:00 AM - 8:00 PM (Weekly Off: Tuesday)',
    email: 'multiplan@techcorebd.com'
  },
  {
    city: 'Dhaka',
    name: 'IDB Bhaban Branch',
    address: 'Shop #24, Ground Floor, BCS Computer City, IDB Bhaban, Agargaon, Dhaka',
    phone: '+880 1700-000002',
    hours: '10:00 AM - 8:00 PM (Weekly Off: Sunday)',
    email: 'idb@techcorebd.com'
  },
  {
    city: 'Dhaka',
    name: 'Uttara Branch',
    address: 'Level 3, Zamzam Tower, Sector 13, Uttara, Dhaka 1230',
    phone: '+880 1700-000003',
    hours: '10:00 AM - 8:00 PM (Weekly Off: Wednesday)',
    email: 'uttara@techcorebd.com'
  },
  {
    city: 'Chattogram',
    name: 'Agrabad Branch',
    address: 'Level 2, Akhtaruzzaman Center, Agrabad C/A, Chattogram',
    phone: '+880 1700-000004',
    hours: '10:00 AM - 8:00 PM (Weekly Off: Friday)',
    email: 'ctg@techcorebd.com'
  },
  {
    city: 'Sylhet',
    name: 'Zindabazar Branch',
    address: 'Level 3, Al-Hamra Shopping City, Zindabazar, Sylhet',
    phone: '+880 1700-000005',
    hours: '10:00 AM - 8:00 PM (Weekly Off: Friday)',
    email: 'sylhet@techcorebd.com'
  }
];

export default function OutletsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#ef4a23] bg-orange-50 px-3 py-1 rounded-full uppercase">
          Physical Stores
        </span>
        <h1 className="text-3xl font-black text-[#081621]">Our Outlets & Branches</h1>
        <p className="text-xs text-gray-500">
          Visit any of our physical stores across Bangladesh for hands-on experience, warranty service and expert advice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outlets.map((outlet, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-extrabold text-[#3749bb] bg-blue-50 px-2.5 py-1 rounded-md">
                {outlet.city}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-green-50 px-2 py-0.5 rounded">
                Open Store
              </span>
            </div>

            <h2 className="font-extrabold text-base text-[#081621]">{outlet.name}</h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#ef4a23] flex-shrink-0 mt-0.5" />
                <span>{outlet.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#3749bb] flex-shrink-0" />
                <span className="font-semibold text-gray-900">{outlet.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{outlet.hours}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>{outlet.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
