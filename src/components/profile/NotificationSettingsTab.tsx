import React, { useState } from 'react';
import { Bell, ShieldAlert, Zap, Clock, CalendarRange } from 'lucide-react';

interface NotificationSettingsTabProps {
  prefEmail: boolean;
  setPrefEmail: (val: boolean) => void;
  prefOrder: boolean;
  setPrefOrder: (val: boolean) => void;
  prefInvoice: boolean;
  setPrefInvoice: (val: boolean) => void;
  prefAffiliate: boolean;
  setPrefAffiliate: (val: boolean) => void;
  prefTicket: boolean;
  setPrefTicket: (val: boolean) => void;
  prefMarketing: boolean;
  setPrefMarketing: (val: boolean) => void;
  prefPromos: boolean;
  setPrefPromos: (val: boolean) => void;
  prefWhatsApp: boolean;
  setPrefWhatsApp: (val: boolean) => void;
  triggerToast: (msg: string) => void;
}

export default function NotificationSettingsTab({
  prefEmail,
  setPrefEmail,
  prefOrder,
  setPrefOrder,
  prefInvoice,
  setPrefInvoice,
  prefAffiliate,
  setPrefAffiliate,
  prefTicket,
  setPrefTicket,
  prefMarketing,
  setPrefMarketing,
  prefPromos,
  setPrefPromos,
  prefWhatsApp,
  setPrefWhatsApp,
  triggerToast
}: NotificationSettingsTabProps) {
  // New States: Security Alerts & Notification Frequency
  const [prefSecurity, setPrefSecurity] = useState(true);
  const [notiFrequency, setNotiFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-505" />
          <span>🔔 Notifications Channels & Preferences</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Engage preferred notification systems to deliver purchase catalogs, billing due notices, and system alerts.
        </p>
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">Email Notifications</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Direct master alerts to your main email register.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefEmail(!prefEmail)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefEmail ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">Order Notifications</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Push automated scripts and codes on checkouts.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefOrder(!prefOrder)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefOrder ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">Invoice Notifications</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Send PDF copies on successfully realized transactions.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefInvoice(!prefInvoice)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefInvoice ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">Affiliate Notifications</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Warn instantly when commission referrers click.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefAffiliate(!prefAffiliate)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefAffiliate ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">Ticket Notifications</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Send alert notifications on ticket closures.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefTicket(!prefTicket)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefTicket ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">Marketing Emails</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Receive occasional newsletters with code releases.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefMarketing(!prefMarketing)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefMarketing ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">Promotional Offers</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Unlock discount keys up to 50% for standard modules.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefPromos(!prefPromos)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefPromos ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[#0F172A] dark:text-[#F8FAFC]">WhatsApp Notifications</p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Bells WhatsApp on critical catalog expirations.</p>
          </div>
          <button
            type="button"
            onClick={() => setPrefWhatsApp(!prefWhatsApp)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefWhatsApp ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-start justify-between gap-3 sm:col-span-2">
          <div className="space-y-0.5">
            <p className="text-red-650 dark:text-red-400 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Security Notifications</span>
            </p>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
              Bells instantaneously on remote passwords changes, dual verification triggers, and de-authorized device sessions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPrefSecurity(!prefSecurity)}
            className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${prefSecurity ? 'bg-indigo-600 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

      </div>

      {/* Notification Frequency controls */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-205/65 dark:border-slate-800/80 space-y-4">
        <div>
          <p className="text-xs font-black text-slate-800 dark:text-white">📅 Alert Pipeline frequency</p>
          <p className="text-[10px] text-slate-405 mt-0.5 dark:text-slate-400 font-medium">Control the intervals and quantity of systemic mail dispatches.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button
            type="button"
            onClick={() => {
              setNotiFrequency('instant');
              triggerToast("⚡ Notification pipeline frequency mapped: INSTANT alerts.");
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${notiFrequency === 'instant' ? 'bg-white dark:bg-slate-900 border-indigo-650 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5' : 'bg-white dark:bg-slate-900/60 hover:bg-slate-100 border-slate-200 dark:border-slate-800'}`}
          >
            <Zap className={`w-4 h-4 mt-0.5 shrink-0 ${notiFrequency === 'instant' ? 'text-indigo-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs font-black">Instant Alerts</p>
              <p className="text-[9px] text-slate-405 mt-0.5 leading-tight font-normal">Push notification logs within seconds of events.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setNotiFrequency('daily');
              triggerToast("📅 Notification pipeline frequency mapped: DAILY summaries.");
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${notiFrequency === 'daily' ? 'bg-white dark:bg-slate-900 border-indigo-650 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5' : 'bg-white dark:bg-slate-900/60 hover:bg-slate-100 border-slate-200 dark:border-slate-800'}`}
          >
            <Clock className={`w-4 h-4 mt-0.5 shrink-0 ${notiFrequency === 'daily' ? 'text-indigo-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs font-black">Daily Summary</p>
              <p className="text-[9px] text-slate-455 mt-0.5 leading-tight font-normal">Compress all events into a single digest dispatch at 00:00 UTC.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setNotiFrequency('weekly');
              triggerToast("🗓️ Notification pipeline frequency mapped: WEEKLY summaries.");
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${notiFrequency === 'weekly' ? 'bg-white dark:bg-slate-900 border-indigo-650 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5' : 'bg-white dark:bg-slate-900/60 hover:bg-slate-100 border-slate-200 dark:border-slate-800'}`}
          >
            <CalendarRange className={`w-4 h-4 mt-0.5 shrink-0 ${notiFrequency === 'weekly' ? 'text-indigo-505' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs font-black">Weekly Summary</p>
              <p className="text-[9px] text-slate-455 mt-0.5 leading-tight font-normal">One concise catalog summarizing weekly invoices and payouts every Monday.</p>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}
