import React from 'react';
import { CreditCard, CheckCircle2, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: '0% EMI Facility & Terms in Bangladesh | TechCore',
  description: 'Enjoy 0% EMI payment facility up to 36 months across 30+ leading commercial banks in Bangladesh at TechCore.',
};

const bankList = [
  'City Bank (Amex / Visa / Mastercard)', 'BRAC Bank', 'Eastern Bank PLC (EBL)',
  'Standard Chartered Bank', 'Dutch-Bangla Bank (DBBL)', 'Prime Bank',
  'Mutual Trust Bank (MTB)', 'United Commercial Bank (UCB)', 'LankaBangla Finance',
  'Dhaka Bank', 'NCC Bank', 'Standard Bank'
];

export default function EMIPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-[#081621] text-white p-8 rounded-2xl text-center space-y-3 shadow-xl">
        <div className="w-16 h-16 bg-[#3749bb] text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
          <CreditCard className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black">0% Interest EMI Facility</h1>
        <p className="text-xs text-gray-300 max-w-xl mx-auto">
          Buy your dream laptop, gaming desktop or monitor today with 0% interest EMI options up to 36 months using credit cards from 30+ partner banks in Bangladesh.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-black text-[#081621]">Supported EMI Partner Banks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {bankList.map((bank, idx) => (
            <div key={idx} className="p-3 bg-gray-50 border rounded-xl flex items-center space-x-2 text-xs font-bold text-gray-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{bank}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-black text-[#081621] flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2 text-[#ef4a23]" /> Important EMI Terms & Conditions
        </h2>
        <ul className="space-y-2 text-xs text-gray-600 list-disc pl-5 leading-relaxed">
          <li>EMI facility is applicable on purchase values of ৳5,000 or above.</li>
          <li>Available tenures range from 3, 6, 9, 12, 18, 24 up to 36 months depending on bank policies.</li>
          <li>EMI processing requires a valid credit card from one of our partner banks.</li>
          <li>Cash discount price or special campaign prices may not be eligible for 0% EMI (regular price applies).</li>
        </ul>
      </div>
    </div>
  );
}
