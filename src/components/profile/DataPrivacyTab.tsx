import React, { useState } from 'react';
import { Database, Download, FileText, AlertCircle, Trash2, Key, Check } from 'lucide-react';

interface DataPrivacyTabProps {
  triggerToast: (msg: string) => void;
  onAddActivityLog: (log: string) => void;
}

export default function DataPrivacyTab({
  triggerToast,
  onAddActivityLog
}: DataPrivacyTabProps) {
  // Privacy States initialized from persistent storage
  const [cookieNecessary, setCookieNecessary] = useState(true); // read-only check
  const [cookieFunctional, setCookieFunctional] = useState(() => {
    return localStorage.getItem('webzone_cookie_functional') !== 'false';
  });
  const [cookieAnalytics, setCookieAnalytics] = useState(() => {
    return localStorage.getItem('webzone_cookie_analytics') === 'true';
  });
  const [marketingConsent, setMarketingConsent] = useState(() => {
    return localStorage.getItem('webzone_marketing_consent') === 'true';
  });
  const [dataSharingConsent, setDataSharingConsent] = useState(() => {
    return localStorage.getItem('webzone_datasharing_consent') === 'true';
  });

  // Track state updates to auto-save to localStorage
  const isMounted = React.useRef(false);
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    localStorage.setItem('webzone_cookie_functional', String(cookieFunctional));
    localStorage.setItem('webzone_cookie_analytics', String(cookieAnalytics));
    localStorage.setItem('webzone_marketing_consent', String(marketingConsent));
    localStorage.setItem('webzone_datasharing_consent', String(dataSharingConsent));
    onAddActivityLog("Updated GDPR cookies parameters and privacy consents.");
    triggerToast("✨ GDPR options updated and saved securely!");
  }, [cookieFunctional, cookieAnalytics, marketingConsent, dataSharingConsent]);

  // Download tool simulated downloader
  const triggerDownloadSimulated = (filename: string, reportType: string) => {
    triggerToast(`⏳ Compiling data indexes... Preparing ${reportType}.`);
    setTimeout(() => {
      // Create mockup file blob downloader
      const element = document.createElement("a");
      const file = new Blob([
        `WebzoneBD IT Solution - Secure Legal Data Export Archive\n`,
        `Report Type: ${reportType}\n`,
        `Generated At: ${new Date().toISOString()}\n`,
        `Authoritative Status: CERTIFIED AUDIT-COMPLIANT BY SYSTEM VAULT SECTOR\n`,
        `======================================================================\n`,
        `All downloaded source code files, purchased licenses, active server cPanel domains, `,
        `and affiliate balances are locked in this client package digest successfully.\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      triggerToast(`📥 Completed download: ${filename} (processed locally).`);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-505" />
          <span>🛡️ GDPR Customer Data & Privacy Command Center</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
          Export your purchased digital codes catalog, set cookie consents, or request absolute storage purges.
        </p>
      </div>

      {/* Feature Downloaders */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <p className="text-xs font-black text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
          <Download className="w-4 h-4 text-indigo-505" />
          <span>Export Encapsulated Marketplace Information Packets:</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold font-sans">
          
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-slate-900 dark:text-white">Account JSON Activity logs</p>
              <p className="text-[10px] text-slate-400 font-normal">Security access listings and logs.</p>
            </div>
            <button
              type="button"
              onClick={() => triggerDownloadSimulated('marketplace_activity_logs.json', 'Account Session History JSON')}
              className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 hover:scale-105 rounded-xl cursor-pointer transition shrink-0"
              title="Download Activity Logs"
            >
              <Download className="w-4.5 h-4.5 text-indigo-500" />
            </button>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-slate-900 dark:text-white">Purchase History PDF checklist</p>
              <p className="text-[10px] text-slate-400 font-normal">License codes and download keys.</p>
            </div>
            <button
              type="button"
              onClick={() => triggerDownloadSimulated('purchase_history_checklist.txt', 'Purchase History Manifest')}
              className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 hover:scale-105 rounded-xl cursor-pointer transition shrink-0"
              title="Download Purchases"
            >
              <Download className="w-4.5 h-4.5 text-indigo-505" />
            </button>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-slate-900 dark:text-white">Invoices balance ledger</p>
              <p className="text-[10px] text-slate-405 font-normal">Tax, VAT, and payments histories.</p>
            </div>
            <button
              type="button"
              onClick={() => triggerDownloadSimulated('tax_invoice_archive_ledger.txt', 'Transactions & Tax Ledger')}
              className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 hover:scale-105 rounded-xl cursor-pointer transition shrink-0"
              title="Download Invoices ledger"
            >
              <Download className="w-4.5 h-4.5 text-indigo-505" />
            </button>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-slate-900 dark:text-white">Affiliate Commission reports</p>
              <p className="text-[10px] text-slate-400 font-normal">Payout tracking and balance records.</p>
            </div>
            <button
              type="button"
              onClick={() => triggerDownloadSimulated('affiliate_campaigns_ledgers.txt', 'Campaign Commission Ledger')}
              className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 hover:scale-105 rounded-xl cursor-pointer transition shrink-0"
              title="Download Affiliate stats"
            >
              <Download className="w-4.5 h-4.5 text-indigo-505" />
            </button>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl flex items-center justify-between gap-3 sm:col-span-2">
            <div>
              <p className="text-slate-905 dark:text-white">Support Ticket History tickets</p>
              <p className="text-[10px] text-slate-400 font-normal">Resolutions, tech chats, and staff responses ledger.</p>
            </div>
            <button
              type="button"
              onClick={() => triggerDownloadSimulated('support_tickets_chat_logs.txt', 'Support Tickets History')}
              className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 hover:scale-105 rounded-xl cursor-pointer transition shrink-0"
              title="Download ticket history logs"
            >
              <Download className="w-4.5 h-4.5 text-indigo-505" />
            </button>
          </div>

        </div>

        <button
          type="button"
          onClick={() => {
            triggerToast("📨 Access Request mapped: Your physical ZIP package compile has been registered under legal audit workflows.");
          }}
          className="w-full text-center py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-600/5 hover:bg-indigo-650/10 text-indigo-600 dark:text-indigo-400 text-xs font-black transition cursor-pointer"
        >
          Request Comprehensive Regulatory Data Export (formal Legal Format) 📝
        </button>
      </div>

      {/* Privacy Controls (Cookie preferences, target marketing) */}
      <div className="p-5 bg-slate-50 dark:bg-[#111827]/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <p className="text-xs font-black text-slate-805 dark:text-white">🍪 Global Privacy & Cookie Parameters</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-relaxed font-sans">
            Customize third-party analytical cookies, tracking pixels, and storage behaviors below under GDPR regulations.
          </p>
        </div>

        <div className="space-y-2.5 text-xs font-semibold font-sans">
          
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-800 dark:text-gray-200">Necessary Core Cookies</p>
              <p className="text-[9px] text-slate-400 font-normal">Required for holding secure token sessions on Cloud Run. Unavoidable.</p>
            </div>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-450 px-2 py-1 rounded text-[9px] uppercase font-bold font-mono">
              Always Hooked
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-800 dark:text-gray-200">Functional State Cookies</p>
              <p className="text-[9px] text-slate-400 font-normal">Retain system states, currency, and language selections locally.</p>
            </div>
            <button
              type="button"
              onClick={() => setCookieFunctional(!cookieFunctional)}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${cookieFunctional ? 'bg-indigo-605 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-805 dark:text-gray-250">Analytical Traffic Cookies</p>
              <p className="text-[9px] text-slate-400 font-normal">Transmit anonymous statistics to improve script load speed performance.</p>
            </div>
            <button
              type="button"
              onClick={() => setCookieAnalytics(!cookieAnalytics)}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${cookieAnalytics ? 'bg-indigo-605 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-805 dark:text-gray-250">Marketing Consent & Targeted Offers</p>
              <p className="text-[9px] text-slate-450 font-normal">Deliver contextual recommendations mapped on script downloads.</p>
            </div>
            <button
              type="button"
              onClick={() => setMarketingConsent(!marketingConsent)}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${marketingConsent ? 'bg-indigo-650 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-805 dark:text-gray-250">Data Sharing Preferences</p>
              <p className="text-[9px] text-slate-450 font-normal">Allow sharing anonymous product ratings under international developer forums.</p>
            </div>
            <button
              type="button"
              onClick={() => setDataSharingConsent(!dataSharingConsent)}
              className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${dataSharingConsent ? 'bg-indigo-650 justify-end' : 'bg-neutral-300 dark:bg-slate-700 justify-start'}`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
            </button>
          </div>

        </div>
      </div>

      {/* Danger Zone (closures, freezes, purges) */}
      <div className="p-5 border border-red-500/25 bg-red-500/5 rounded-3xl space-y-4 font-sans">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-505 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-black text-red-500 uppercase tracking-widest font-mono">DANGER EXTREME ZONE ACTIONS</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              These processes are destructive. Temporary freezes pause active cPanel domain maps, whereas permanently deleting will purge all downloadable license directories from system caches forever.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1.5 text-xs text-center">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("⚠️ Freeze account? Mapped script domains will transition to temporary lock categories. Proceed?")) {
                onAddActivityLog("Requested user account temporary deactivation freeze.");
                triggerToast("🔒 Account suspended! You can contact platform staff to reactivate.");
              }
            }}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-505/20 text-red-550 text-[10px] font-black rounded-xl uppercase transition cursor-pointer"
          >
            Freeze Account
          </button>

          <button
            type="button"
            onClick={() => {
              const confirmString = window.prompt(
                "⚠️ EXTREME DESTRUCTIVE ACTION! This permanently deletes all hosting balances, product licenses, and support chat histories from our servers. To confirm, type 'DELETE_PERMANENTLY' in the prompt below:"
              );
              if (confirmString === 'DELETE_PERMANENTLY') {
                onAddActivityLog("Triggered complete client data purging sequence.");
                triggerToast("⚡ Deleting your account records tree... Redirecting.");
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              } else if (confirmString) {
                triggerToast("❌ Purge cancel loop: Confirmation keyword didn't match.");
              }
            }}
            className="px-4 py-2 bg-red-550 text-white hover:brightness-110 text-[10px] font-black rounded-xl uppercase transition cursor-pointer"
          >
            Delete Workspace Vault Account
          </button>
        </div>
      </div>

    </div>
  );
}
