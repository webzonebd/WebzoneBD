import React from 'react';
import { CreditCard, FileText, CheckCircle2, Shield } from 'lucide-react';

interface BillingInformationTabProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  billingName: string;
  setBillingName: (val: string) => void;
  taxNumber: string;
  setTaxNumber: (val: string) => void;
  addressLine1: string;
  setAddressLine1: (val: string) => void;
  addressLine2: string;
  setAddressLine2: (val: string) => void;
  billingCity: string;
  setBillingCity: (val: string) => void;
  billingState: string;
  setBillingState: (val: string) => void;
  billingPostal: string;
  setBillingPostal: (val: string) => void;
  billingCountry: string;
  setBillingCountry: (val: string) => void;
}

export default function BillingInformationTab({
  companyName,
  setCompanyName,
  billingName,
  setBillingName,
  taxNumber,
  setTaxNumber,
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  billingCity,
  setBillingCity,
  billingState,
  setBillingState,
  billingPostal,
  setBillingPostal,
  billingCountry,
  setBillingCountry
}: BillingInformationTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-505" />
          <span>🧾 Billing Records & VAT Information</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Provide company identification metadata to generate automated commercial tax receipts.
        </p>
      </div>

      {/* Used For Context Section (Stripe style) */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/20 dark:from-slate-900/40 dark:to-indigo-950/5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
        <p className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-505" />
          <span>How this metadata is utilized:</span>
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px] leading-relaxed">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-1">
            <p className="font-extrabold text-slate-800 dark:text-gray-200 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> Invoice Generation
            </p>
            <p className="text-slate-400 text-[10px]">
              Inserts verified billing names, company titles, and postal indices instantly on checkout receipt PDFs.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-1">
            <p className="font-extrabold text-slate-800 dark:text-gray-200 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> Billing Records & Auditing
            </p>
            <p className="text-slate-400 text-[10px]">
              Establishes historical payment trails for accounting compliance during platform audits.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-1">
            <p className="font-extrabold text-slate-800 dark:text-gray-200 flex items-center gap-1">
              <span className="text-emerald-500">✓</span> Purchase History Asset Trailing
            </p>
            <p className="text-slate-400 text-[10px]">
              Links downloaded source code files with verified physical user locations under standard license provisions.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-1">
            <p className="font-extrabold text-[#0D9488] dark:text-[#2DD4BF] flex items-center gap-1">
              <span className="text-emerald-500">✓</span> VAT & National Tax Reporting
            </p>
            <p className="text-slate-405 text-[10px]">
              Calculates local tax indexes, VAT brackets, and compliance requirements automatically on payments.
            </p>
          </div>
        </div>
      </div>

      {/* Input controls layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">B2B Company Name</label>
          <input 
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Webzone BD Solution"
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Legal Billing Full Name</label>
          <input 
            type="text"
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Tax / VAT ID Number</label>
          <input 
            type="text"
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value)}
            placeholder="VAT-882959122"
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Address Line 1</label>
          <input 
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="Street address or block"
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Address Line 2 (Optional)</label>
          <input 
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Suite, apartment, or flat number"
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">City</label>
          <input 
            type="text"
            value={billingCity}
            onChange={(e) => setBillingCity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">State / Division</label>
          <input 
            type="text"
            value={billingState}
            onChange={(e) => setBillingState(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Postal / ZIP Code</label>
          <input 
            type="text"
            value={billingPostal}
            onChange={(e) => setBillingPostal(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 dark:text-slate-400">Country Preference</label>
          <input 
            type="text"
            value={billingCountry}
            onChange={(e) => setBillingCountry(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-xl text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

    </div>
  );
}
