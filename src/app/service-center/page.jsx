import React from 'react';
import { Wrench, MapPin, Phone, Clock, Mail, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Official Service Center & RMA Hubs in Bangladesh | TechCore',
  description: 'Locate TechCore authorized computer service centers and official RMA hubs in Dhaka, Chattogram, Sylhet, Rajshahi and Khulna.',
};

const serviceCenters = [
  {
    city: 'Dhaka',
    name: 'Central Service Center & RMA Hub',
    address: 'Level 6, Multiplan Center, New Elephant Road, Dhaka 1205',
    phone: '+880 1700-000099',
    hours: '10:00 AM - 7:00 PM (Saturday - Thursday)',
    email: 'rma.multiplan@techcorebd.com',
    brandsCovered: ['ASUS', 'MSI', 'Intel', 'AMD', 'Corsair', 'Gigabyte']
  },
  {
    city: 'Dhaka',
    name: 'IDB Service Reception Point',
    address: 'Shop #32, Level 2, BCS Computer City, IDB Bhaban, Dhaka',
    phone: '+880 1700-000098',
    hours: '10:30 AM - 7:30 PM (Saturday - Thursday)',
    email: 'rma.idb@techcorebd.com',
    brandsCovered: ['ASUS', 'HP', 'Lenovo', 'Dell']
  },
  {
    city: 'Chattogram',
    name: 'Chattogram RMA Point',
    address: 'Level 3, Akhtaruzzaman Center, Agrabad C/A, Chattogram',
    phone: '+880 1700-000097',
    hours: '10:00 AM - 7:00 PM (Saturday - Thursday)',
    email: 'rma.ctg@techcorebd.com',
    brandsCovered: ['All Official Brands']
  }
];

export default function ServiceCenterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-[#081621] text-white p-8 rounded-2xl text-center space-y-3 shadow-xl">
        <div className="w-16 h-16 bg-[#3749bb] text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black">Authorized Service & RMA Centers</h1>
        <p className="text-xs text-gray-300 max-w-xl mx-auto">
          Experience seamless replacement warranty service, desktop diagnostic repairs, and hardware upgrades at our authorized service hubs in Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceCenters.map((center, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-extrabold text-[#3749bb] bg-blue-50 px-2.5 py-1 rounded-md">
                {center.city}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-green-50 px-2 py-0.5 rounded">
                Official RMA
              </span>
            </div>

            <h2 className="font-extrabold text-base text-[#081621]">{center.name}</h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#ef4a23] flex-shrink-0 mt-0.5" />
                <span>{center.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#3749bb] flex-shrink-0" />
                <span className="font-semibold text-gray-900">{center.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{center.hours}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>{center.email}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <span className="text-[11px] font-bold text-gray-700 block mb-1">Supported Brands:</span>
              <div className="flex flex-wrap gap-1">
                {center.brandsCovered.map((b, bIdx) => (
                  <span key={bIdx} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
