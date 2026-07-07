import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Smartphone, Globe, Database, ShieldCheck, FileText, Plus,
  Sliders, Trash2, Edit3, Check, RefreshCw, X, Download, Info, CheckCircle, Bell, Search, AlertCircle, ShieldAlert
} from 'lucide-react';

interface PaymentSettingsViewProps {
  theme: 'light' | 'dark';
  language: 'en' | 'bn' | 'ar';
  orders: any[];
  currencyRates: { BDT: number; SAR: number; USD: number; [key: string]: number };
  setCurrencyRates: (rates: any) => void;
  verificationSettings: { verificationMode: 'manual' | 'auto'; txnIdRequired: boolean; screenshotRequired: boolean };
  setVerificationSettings: (settings: any) => void;
  paymentNotifs: { email: boolean; sms: boolean; whatsapp: boolean; telegram: boolean };
  setPaymentNotifs: (notifs: any) => void;
  bdMethods: any;
  setBdMethods: (methods: any) => void;
  saMethods: any;
  setSaMethods: (methods: any) => void;
  intlMethods: any;
  setIntlMethods: (methods: any) => void;
  customMethods: any[];
  setCustomMethods: (methods: any[]) => void;
  logAdminAction: (action: string) => void;
  getOrderSerialResolved: (orderId: string) => string;
  triggerToast: (msg: string) => void;
  updateOrderStatus?: (id: string, status: 'completed' | 'failed' | 'refunded') => void;
}

export default function PaymentSettingsView({
  theme,
  language,
  orders,
  currencyRates,
  setCurrencyRates,
  verificationSettings,
  setVerificationSettings,
  paymentNotifs,
  setPaymentNotifs,
  bdMethods,
  setBdMethods,
  saMethods,
  setSaMethods,
  intlMethods,
  setIntlMethods,
  customMethods,
  setCustomMethods,
  logAdminAction,
  getOrderSerialResolved,
  triggerToast,
  updateOrderStatus
}: PaymentSettingsViewProps) {
  const isDark = theme === 'dark';

  // State definitions inside view container
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'bd' | 'sa' | 'intl' | 'verification' | 'history'>('overview');
  
  // Custom Payment Method Form States
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodCountry, setNewMethodCountry] = useState('Bangladesh');
  const [newMethodType, setNewMethodType] = useState('Mobile Money');
  const [newMethodLogo, setNewMethodLogo] = useState('');
  const [newMethodQr, setNewMethodQr] = useState('');
  const [newMethodInstructions, setNewMethodInstructions] = useState('');

  // Payment Verification Modal / Progress States
  const [selectedVerifyOrder, setSelectedVerifyOrder] = useState<any>(null);
  const [verifyingProgress, setVerifyingProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatusMsg, setVerificationStatusMsg] = useState('');
  const [verifyActionType, setVerifyActionType] = useState<'approve' | 'reject' | 'refund'>('approve');

  // Transaction History Search & Filter States
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('all');
  const [txMethodFilter, setTxMethodFilter] = useState('all');

  const panelBg = isDark ? 'bg-[#1E293B]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const labelStyle = `text-[10px] uppercase font-mono block mb-1 font-bold ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`;
  const inputStyle = `w-full text-xs px-3 py-2 rounded outline-none leading-relaxed font-mono transition border ${
    isDark
      ? 'bg-neutral-950/80 border-neutral-800 text-white focus:border-purple-500'
      : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-purple-600 focus:bg-white'
  }`;

  // Compute Real Stats from orders prop
  const totalTransactions = orders.length;
  const todayStr = '2026-06-25'; // Simulated standard anchor date
  const todayPayments = orders.filter(o => o.date === todayStr || o.date?.includes(todayStr)).length;
  const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;
  const successfulPayments = orders.filter(o => o.paymentStatus === 'completed').length;
  const failedPayments = orders.filter(o => o.paymentStatus === 'failed' || o.paymentStatus === 'refunded').length;
  
  const totalRevenueUsd = orders
    .filter(o => o.paymentStatus === 'completed')
    .reduce((sum, o) => sum + (o.price || 0), 0);

  const rateBDT = currencyRates.BDT || 118.5;
  const rateSAR = currencyRates.SAR || 3.75;

  // Trigger status update simulation with beautiful visual progress bar
  const handleSimulatedVerification = (orderId: string, action: 'approve' | 'reject' | 'refund') => {
    setVerifyActionType(action);
    setIsVerifying(true);
    setVerifyingProgress(0);
    setVerificationStatusMsg("⚙️ Initializing merchant secure handshake token...");

    const steps = [
      { progress: 15, msg: "🔒 Validating transaction reference ID hash matches..." },
      { progress: 35, msg: "⚡ Querying cellular mobile money gateway database ledger..." },
      { progress: 55, msg: "📡 Authorizing secure digital signature verification keys..." },
      { progress: 80, msg: "💰 Simulating direct bank fund clearance & reconciliation..." },
      { progress: 100, msg: "🎉 Transaction verified! Releasing product download credentials..." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setVerifyingProgress(steps[currentStep].progress);
        setVerificationStatusMsg(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const nextStatus = action === 'approve' ? 'completed' : action === 'reject' ? 'failed' : 'refunded';
          if (updateOrderStatus) {
            updateOrderStatus(orderId, nextStatus);
          }
          setIsVerifying(false);
          setSelectedVerifyOrder(null);
          triggerToast(`✅ Payment status synchronized! Cleared Order ID: #${orderId} state to ${nextStatus.toUpperCase()}`);
          logAdminAction(`Manually audited and verified payment receipt for Order Reference: #${orderId} to status: ${nextStatus.toUpperCase()}`);
        }, 600);
      }
    }, 850);
  };

  return (
    <div className="space-y-6 text-left" id="payment-settings-view-root">
      
      {/* Upper Navigation Ribbon Bar with Solid Horizontal Lines */}
      <div className="flex flex-wrap gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-0 font-sans overflow-x-auto mb-6">
        {[
          { id: 'overview', label: '📊 Dashboard & Rate', icon: DollarSign },
          { id: 'bd', label: '🇧🇩 Bangladesh Methods', icon: Smartphone },
          { id: 'sa', label: '🇸🇦 Saudi Arabia Methods', icon: Globe },
          { id: 'intl', label: '🌐 International Gateways', icon: Database },
          { id: 'verification', label: `🛡️ Verification Hub (${pendingPayments})`, icon: ShieldCheck },
          { id: 'history', label: '📜 Transaction Ledgers', icon: FileText }
        ].map(tb => {
          const Icon = tb.icon;
          const isActive = activeSubTab === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              onClick={() => setActiveSubTab(tb.id as any)}
              className={`flex items-center gap-1.5 px-2 pb-3 text-xs font-bold transition-all duration-200 cursor-pointer border-b-2 -mb-[2px] ${
                isActive
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-extrabold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tb.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & GENERAL CURRENCY CONFIGURATIONS */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* STATS AREA */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-white uppercase font-mono text-purple-400">
              Real-Time Gateway Performance Matrix
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-2xl border ${panelBg} flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform`}>
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">Total Transactions</span>
                <div className="text-left">
                  <span className="text-xl font-black text-white font-mono">{totalTransactions}</span>
                  <p className="text-[9px] text-emerald-400 mt-1">Live active ledger items</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${panelBg} flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform`}>
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">Today's Payments</span>
                <div className="text-left">
                  <span className="text-xl font-black text-purple-400 font-mono">{todayPayments}</span>
                  <p className="text-[9px] text-neutral-400 mt-1">Date: {todayStr}</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${panelBg} flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform`}>
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">Successful Payments</span>
                <div className="text-left">
                  <span className="text-xl font-black text-emerald-400 font-mono">{successfulPayments}</span>
                  <p className="text-[9px] text-emerald-400">Approved checkouts</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${panelBg} flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform`}>
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">Pending Payments</span>
                <div className="text-left">
                  <span className="text-xl font-black text-amber-500 font-mono">{pendingPayments}</span>
                  <p className="text-[9px] text-amber-400">Awaiting verification</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${panelBg} flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform`}>
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">Failed Payments</span>
                <div className="text-left">
                  <span className="text-xl font-black text-rose-500 font-mono">{failedPayments}</span>
                  <p className="text-[9px] text-rose-400">Rejected / refunded links</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${panelBg} flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform bg-gradient-to-br from-purple-950/20 to-purple-850/5`}>
                <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider block font-bold">Total Revenue</span>
                <div className="text-left">
                  <span className="text-lg font-black text-white font-mono">
                    ${totalRevenueUsd.toLocaleString()}
                  </span>
                  <div className="text-[8px] text-purple-300 mt-1">
                    ৳{(totalRevenueUsd * rateBDT).toLocaleString(undefined, {maximumFractionDigits: 0})} BDT / 
                    ر.س{(totalRevenueUsd * rateSAR).toLocaleString(undefined, {maximumFractionDigits: 0})} SAR
                  </div>
                </div>
              </div>
            </div>

            {/* INLINE ADD CUSTOM METHOD FORM */}
            <div className={`p-6 rounded-2xl border ${panelBg} space-y-4`}>
              <div className="border-b border-white/[0.05] pb-2">
                <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-purple-500" />
                  Add New Custom Payment Method
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Define custom local gateways, micro-wallets or special regional bank targets instantly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="text-[9px] uppercase font-mono block mb-1 text-neutral-400">Payment Gateway Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Upay, bKash Personal, Alinma Bank"
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-3 py-2 rounded focus:border-purple-500 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono block mb-1 text-neutral-400">Operated Country</label>
                  <select
                    value={newMethodCountry}
                    onChange={(e) => setNewMethodCountry(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-3 py-2 rounded focus:border-purple-500 text-white outline-none font-sans"
                  >
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
                    <option value="International">International 🌐</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono block mb-1 text-neutral-400">Gateway Structure Class</label>
                  <select
                    value={newMethodType}
                    onChange={(e) => setNewMethodType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-3 py-2 rounded focus:border-purple-500 text-white outline-none font-sans"
                  >
                    <option value="Mobile Money">Mobile Money API</option>
                    <option value="E-Wallet">Electronic Wallet</option>
                    <option value="Bank Transfer">Bank Wire Transfer</option>
                    <option value="Direct Checkout">Direct Card checkout</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono block mb-1 text-neutral-400">Logo Icon Path (Simulated Link)</label>
                  <input
                    type="text"
                    placeholder="e.g. https://domain.com/logo.png"
                    value={newMethodLogo}
                    onChange={(e) => setNewMethodLogo(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-3 py-2 rounded focus:border-purple-500 text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2 font-sans font-medium text-left">
                  <label className="text-[9px] uppercase font-mono block mb-1 text-neutral-400 font-bold text-neutral-300">QR Code Image Link</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or leave blank for auto"
                    value={newMethodQr}
                    onChange={(e) => setNewMethodQr(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-3 py-2 rounded focus:border-purple-500 text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2 font-sans font-medium text-left">
                  <label className="text-[9px] uppercase font-mono block mb-1 text-neutral-400">Step-by-step Client Deposit Instructions</label>
                  <textarea
                    rows={2}
                    placeholder="Include transfer limits, targets, references keywords etc."
                    value={newMethodInstructions}
                    onChange={(e) => setNewMethodInstructions(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-3 py-2 rounded focus:border-purple-500 text-white outline-none leading-relaxed"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!newMethodName || !newMethodInstructions) {
                    triggerToast("Please input custom gateway title and user instructions! ⚠️");
                    return;
                  }
                  const created = {
                    id: `custom-gate-${Date.now()}`,
                    name: newMethodName,
                    country: newMethodCountry,
                    type: newMethodType,
                    logo: newMethodLogo || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=60',
                    qrCode: newMethodQr || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300',
                    instructions: newMethodInstructions,
                    enabled: true,
                    createdAt: new Date().toLocaleDateString()
                  };
                  setCustomMethods([...customMethods, created]);
                  triggerToast(`Custom gateway "${newMethodName}" registered successfully! 🚀`);
                  // Reset fields
                  setNewMethodName('');
                  setNewMethodInstructions('');
                  setNewMethodLogo('');
                  setNewMethodQr('');
                  // Switch to target view
                  if (newMethodCountry === 'Bangladesh') setActiveSubTab('bd');
                  else if (newMethodCountry === 'Saudi Arabia') setActiveSubTab('sa');
                  else setActiveSubTab('intl');
                }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all duration-200 border-none font-mono tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Save and Register Gateway Method
              </button>
            </div>

          </div>

          {/* RIGHT SIDEBAR: CURRENCY MAPPING & CHANNELS */}
          <div className="space-y-6">
            
            {/* 1. CURRENCY MATRIX */}
            <div className={`p-5 rounded-2xl border ${panelBg} space-y-4`}>
              <div className="border-b border-white/[0.05] pb-2 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-purple-400">
                  Currency & Exchange Matrices
                </h4>
                <Globe className="w-4 h-4 text-purple-500" />
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="text-left">
                  <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Base Currency Index (Anchor)</label>
                  <div className="px-3 py-2 rounded bg-neutral-950/60 border border-neutral-900 text-stone-300 font-bold flex justify-between items-center text-left">
                    <span>USD - United States Dollar</span>
                    <span className="font-mono text-[10px] text-green-400 bg-green-950/40 px-2 py-0.5 rounded font-black">1.00 USD</span>
                  </div>
                </div>

                <div className="text-left">
                  <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">BDT Exchange rate (Per $1 USD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={currencyRates.BDT}
                      onChange={(e) => setCurrencyRates({...currencyRates, BDT: parseFloat(e.target.value) || 1 })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded focus:border-purple-500 text-white outline-none pl-10 font-mono"
                    />
                    <span className="absolute left-3 top-2 text-neutral-500 font-bold">BDT</span>
                  </div>
                </div>

                <div className="text-left">
                  <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">SAR Exchange rate (Per $1 USD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={currencyRates.SAR}
                      onChange={(e) => setCurrencyRates({...currencyRates, SAR: parseFloat(e.target.value) || 1 })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded focus:border-purple-500 text-white outline-none pl-10 font-mono"
                    />
                    <span className="absolute left-3 top-2 text-neutral-500 font-bold">SAR</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-950/15 rounded border border-purple-900/30 text-[10px] leading-relaxed text-neutral-400 text-left">
                  💡 <strong>Pricing Resolution Engine:</strong> Order prices defined in USD will be computed automatically into BDT or SAR on checkout frames using these live values.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('webzone_currency_rates', JSON.stringify(currencyRates));
                    triggerToast("Global currency exchange guidelines modified successfully! ৳💵");
                  }}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-white/[0.08] hover:border-white/[0.15] text-[10px] uppercase font-mono text-white transition duration-200 cursor-pointer"
                >
                  Confirm Rate Modifications
                </button>
              </div>
            </div>

            {/* 2. DISPATCH ROUTERS */}
            <div className={`p-5 rounded-2xl border ${panelBg} space-y-4`}>
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-2 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-purple-400">
                  Payment Notification Dispatches
                </h4>
                <Bell className="w-4 h-4 text-purple-500 animate-pulse" />
              </div>

              <div className="space-y-4 text-xs font-sans text-left">
                {[
                  { key: 'email', label: 'Email Alerts Dispatcher', desc: 'Secure invoices as PDFs', color: 'bg-indigo-500' },
                  { key: 'sms', label: 'Mobile SMS Gateway API', desc: 'Send direct cellular codes', color: 'bg-green-500' },
                  { key: 'whatsapp', label: 'WhatsApp Sandbox Trigger', desc: 'Alert immediate client handles', color: 'bg-emerald-500' },
                  { key: 'telegram', label: 'Telegram Channel Webhooks', desc: 'Transmit terminal audit logs', color: 'bg-cyan-500' }
                ].map(notif => (
                  <div key={notif.key} className="flex justify-between items-start gap-4 p-2 pb-3 border-b border-neutral-100 dark:border-neutral-800/50 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-stone-200 block text-[11px]">{notif.label}</span>
                      <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block">{notif.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!(paymentNotifs as any)[notif.key]}
                        onChange={(e) => setPaymentNotifs({...paymentNotifs, [notif.key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-gray-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('webzone_payment_notifs', JSON.stringify(paymentNotifs));
                    triggerToast("Notification routers configured cleanly! 🔔");
                  }}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 border border-white/[0.08] text-[10px] uppercase font-mono text-white text-center block cursor-pointer hover:bg-neutral-850"
                >
                  Update Dispatch Channels
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: BANGLADESH METHODS */}
      {activeSubTab === 'bd' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm tracking-tight text-white uppercase font-mono text-purple-400">
              Bangladesh Mobile Wallets & Transfers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. bKash Card */}
            {bdMethods.bkash && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs shadow-md">bk</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">bKash Active Gateway</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Mobile Money / Merchants</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!bdMethods.bkash.enabled}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          bkash: { ...bdMethods.bkash, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Account Version Type</label>
                      <select
                        value={bdMethods.bkash.type}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          bkash: { ...bdMethods.bkash, type: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white text-[11px] font-mono"
                      >
                        <option value="merchant">Merchant Wallet</option>
                        <option value="personal">Personal Account</option>
                        <option value="agent">Agent Cashout Panel</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Wallet Phone Index</label>
                      <input
                        type="text"
                        value={bdMethods.bkash.number}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          bkash: { ...bdMethods.bkash, number: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white text-[11px] font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">API Gateway Secure credentials</label>
                      <input
                        type="password"
                        value={bdMethods.bkash.apiKey}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          bkash: { ...bdMethods.bkash, apiKey: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-neutral-300 text-[11px] font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Client Deposit Guide Instructions</label>
                      <textarea
                        rows={2}
                        value={bdMethods.bkash.instructions}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          bkash: { ...bdMethods.bkash, instructions: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-stone-200 text-[11px] focus:border-purple-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_bd_methods', JSON.stringify(bdMethods));
                      triggerToast("bKash gateway credentials reconciled successfully! 🇧🇩");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] hover:border-white/[0.15] text-[10px] uppercase font-mono font-bold text-white transition hover:bg-neutral-850"
                  >
                    Confirm & Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBdMethods({...bdMethods, bkash: { ...bdMethods.bkash, number: '', apiKey: '' }});
                      triggerToast("bKash configuration flushed clean 🧹");
                    }}
                    className="px-2.5 py-1.5 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-[10px] uppercase font-mono text-red-400 hover:text-red-300 transition"
                  >
                    Delete keys
                  </button>
                </div>
              </div>
            )}

            {/* 2. Nagad Card */}
            {bdMethods.nagad && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#F57C00] text-white flex items-center justify-center font-bold text-xs shadow-md">ng</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">Nagad Active Gateway</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Mobile Money / Personal</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!bdMethods.nagad.enabled}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          nagad: { ...bdMethods.nagad, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Account Version Type</label>
                      <select
                        value={bdMethods.nagad.type}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          nagad: { ...bdMethods.nagad, type: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white text-[11px] font-mono"
                      >
                        <option value="personal">Personal Account</option>
                        <option value="merchant">Merchant Wallet</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Wallet Phone Index</label>
                      <input
                        type="text"
                        value={bdMethods.nagad.number}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          nagad: { ...bdMethods.nagad, number: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white text-[11px] font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">API Gateway Token Credentials</label>
                      <input
                        type="password"
                        value={bdMethods.nagad.apiKey || ''}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          nagad: { ...bdMethods.nagad, apiKey: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-neutral-300 text-[11px] font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Client Deposit Guide Instructions</label>
                      <textarea
                        rows={2}
                        value={bdMethods.nagad.instructions}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          nagad: { ...bdMethods.nagad, instructions: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-stone-200 text-[11px] focus:border-purple-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_bd_methods', JSON.stringify(bdMethods));
                      triggerToast("Nagad gateway credentials saved successfully! 🇧🇩");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] hover:border-white/[0.15] text-[10px] uppercase font-mono font-bold text-white transition hover:bg-neutral-850"
                  >
                    Confirm & Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBdMethods({...bdMethods, nagad: { ...bdMethods.nagad, number: '', apiKey: '' }});
                      triggerToast("Nagad fields resetted.");
                    }}
                    className="px-2.5 py-1.5 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-[10px] uppercase font-mono text-red-400 hover:text-red-300 transition"
                  >
                    Delete keys
                  </button>
                </div>
              </div>
            )}

            {/* 3. Rocket Card */}
            {bdMethods.rocket && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#8C1B8C] text-white flex items-center justify-center font-bold text-xs shadow-md font-serif">R</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">DBBL Rocket Gateway</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Mobile Money / 12-Digit Wallet</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!bdMethods.rocket.enabled}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          rocket: { ...bdMethods.rocket, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Wallet Phone Index (12 Digits)</label>
                      <input
                        type="text"
                        value={bdMethods.rocket.number || ''}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          rocket: { ...bdMethods.rocket, number: e.target.value }
                        })}
                        className="w-full col-span-2 bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white text-[11px] font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Display instructions</label>
                      <textarea
                        rows={2}
                        value={bdMethods.rocket.instructions}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          rocket: { ...bdMethods.rocket, instructions: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-stone-200 text-[11px] focus:border-purple-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_bd_methods', JSON.stringify(bdMethods));
                      triggerToast("Rocket configuration saved! 🇧🇩");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] text-[10px] uppercase font-mono text-white transition hover:bg-neutral-850 font-bold"
                  >
                    Confirm & Update
                  </button>
                </div>
              </div>
            )}

            {/* 4. CellFin Card */}
            {bdMethods.cellfin && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#01579B] text-white flex items-center justify-center font-bold text-xs shadow-md">CF</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">Islami Bank CellFin Wallet</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">E-Wallet / Instant clearing</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!bdMethods.cellfin.enabled}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          cellfin: { ...bdMethods.cellfin, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">CellFin Account Number</label>
                      <input
                        type="text"
                        value={bdMethods.cellfin.number || ''}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          cellfin: { ...bdMethods.cellfin, number: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white text-[11px] font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold">Display instructions</label>
                      <textarea
                        rows={2}
                        value={bdMethods.cellfin.instructions}
                        onChange={(e) => setBdMethods({
                          ...bdMethods,
                          cellfin: { ...bdMethods.cellfin, instructions: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-stone-200 text-[11px] focus:border-purple-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_bd_methods', JSON.stringify(bdMethods));
                      triggerToast("CellFin configuration saved successfully!");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] text-[10px] uppercase font-mono text-white transition hover:bg-neutral-850 font-bold"
                  >
                    Confirm & Update
                  </button>
                </div>
              </div>
            )}

            {/* 5. Islami Bank Transfer Card */}
            {bdMethods.islamiBank && (
              <div className={`col-span-1 md:col-span-2 p-5 rounded-2xl border ${panelBg} space-y-4 text-left`}>
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#1B5E20] text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shadow-md">IB</div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{bdMethods.islamiBank.bankName || "Islami Bank Bangladesh PLC"}</h4>
                      <span className="text-[9px] font-mono text-neutral-400 uppercase">Direct Bank Settlement Wire Transfer</span>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!bdMethods.islamiBank.enabled}
                      onChange={(e) => setBdMethods({
                        ...bdMethods,
                        islamiBank: { ...bdMethods.islamiBank, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans font-medium">
                  <div>
                    <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Official Bank Name</label>
                    <input
                      type="text"
                      value={bdMethods.islamiBank.bankName}
                      onChange={(e) => setBdMethods({
                        ...bdMethods,
                        islamiBank: { ...bdMethods.islamiBank, bankName: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Account Name Title</label>
                    <input
                      type="text"
                      value={bdMethods.islamiBank.accountName}
                      onChange={(e) => setBdMethods({
                        ...bdMethods,
                        islamiBank: { ...bdMethods.islamiBank, accountName: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Account Number</label>
                    <input
                      type="text"
                      value={bdMethods.islamiBank.accountNumber}
                      onChange={(e) => setBdMethods({
                        ...bdMethods,
                        islamiBank: { ...bdMethods.islamiBank, accountNumber: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">IBAN Number</label>
                    <input
                      type="text"
                      value={bdMethods.islamiBank.iban}
                      onChange={(e) => setBdMethods({
                        ...bdMethods,
                        islamiBank: { ...bdMethods.islamiBank, iban: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">SWIFT BIC Code</label>
                    <input
                      type="text"
                      value={bdMethods.islamiBank.swift}
                      onChange={(e) => setBdMethods({
                        ...bdMethods,
                        islamiBank: { ...bdMethods.islamiBank, swift: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400 font-bold text-neutral-300">QR Code Link</label>
                    <input
                      type="text"
                      value={bdMethods.islamiBank.qrCode || ''}
                      onChange={(e) => setBdMethods({
                        ...bdMethods,
                        islamiBank: { ...bdMethods.islamiBank, qrCode: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_bd_methods', JSON.stringify(bdMethods));
                      triggerToast("Islami Bank Swift details successfully compiled! ৳🏦");
                    }}
                    className="px-4 py-1.5 rounded bg-neutral-900 hover:bg-neutral-850 border border-white/[0.08] hover:border-white/[0.15] text-[10px] uppercase font-mono font-bold text-white transition cursor-pointer"
                  >
                    Confirm Bank Coordinates
                  </button>
                </div>
              </div>
            )}

            {/* CUSTOM REGISTERED METHODS FOR BANGLADESH */}
            {customMethods.filter(m => m.country === 'Bangladesh').map((item) => (
              <div key={item.id} className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">
                        {item.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">{item.type}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCustomMethods(customMethods.filter(m => m.id !== item.id));
                        triggerToast(`Deleted custom gateway "${item.name}"`);
                      }}
                      className="p-1 rounded bg-red-950/20 border border-red-500/20 text-red-500 hover:bg-red-950/40 cursor-pointer"
                      title="Prune Custom Method"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans">{item.instructions}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* TAB 3: SAUDI ARABIA METHODS */}
      {activeSubTab === 'sa' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-bold text-sm tracking-tight text-white uppercase font-mono text-purple-400">
            Saudi Arabia Wallets & Transfers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* STC Pay */}
            {saMethods.stcPay && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#4A154B] text-white flex items-center justify-center font-bold text-xs shadow-md">st</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">STC Pay Gateway</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">Saudi Arabia E-Wallet</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!saMethods.stcPay.enabled}
                        onChange={(e) => setSaMethods({
                          ...saMethods,
                          stcPay: { ...saMethods.stcPay, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs font-sans text-left font-medium">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Corporate Wallet Number</label>
                      <input
                        type="text"
                        value={saMethods.stcPay.walletNumber}
                        onChange={(e) => setSaMethods({
                          ...saMethods,
                          stcPay: { ...saMethods.stcPay, walletNumber: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Display instructions</label>
                      <textarea
                        rows={2}
                        value={saMethods.stcPay.instructions}
                        onChange={(e) => setSaMethods({
                          ...saMethods,
                          stcPay: { ...saMethods.stcPay, instructions: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-stone-200 text-[11px] focus:border-purple-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_sa_methods', JSON.stringify(saMethods));
                      triggerToast("STC Pay parameters synchronized successfully! 🇸🇦");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] text-[10px] uppercase font-mono font-bold text-white transition hover:bg-neutral-850"
                  >
                    Confirm & Update
                  </button>
                </div>
              </div>
            )}

            {/* Al Rajhi Bank */}
            {saMethods.alRajhi && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#005CA9] text-white flex items-center justify-center font-bold text-xs shadow-md font-sans">AR</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">Al Rajhi Corporate Bank</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">National Wire Transfers</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!saMethods.alRajhi.enabled}
                        onChange={(e) => setSaMethods({
                          ...saMethods,
                          alRajhi: { ...saMethods.alRajhi, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-left font-medium">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Account Title</label>
                      <input
                        type="text"
                        value={saMethods.alRajhi.accountName}
                        onChange={(e) => setSaMethods({
                          ...saMethods,
                          alRajhi: { ...saMethods.alRajhi, accountName: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Account Number</label>
                      <input
                        type="text"
                        value={saMethods.alRajhi.accountNumber}
                        onChange={(e) => setSaMethods({
                          ...saMethods,
                          alRajhi: { ...saMethods.alRajhi, accountNumber: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">IBAN Code Number</label>
                      <input
                        type="text"
                        value={saMethods.alRajhi.iban}
                        onChange={(e) => setSaMethods({
                          ...saMethods,
                          alRajhi: { ...saMethods.alRajhi, iban: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_sa_methods', JSON.stringify(saMethods));
                      triggerToast("Al Rajhi parameters synchronized successfully! 🇸🇦");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] text-[10px] uppercase font-mono font-bold text-white transition hover:bg-neutral-850"
                  >
                    Confirm & Update
                  </button>
                </div>
              </div>
            )}

            {/* CUSTOM REGISTERED METHODS FOR SAUDI ARABIA */}
            {customMethods.filter(m => m.country === 'Saudi Arabia').map((item) => (
              <div key={item.id} className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-md animate-pulse">
                        {item.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">{item.type}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCustomMethods(customMethods.filter(m => m.id !== item.id));
                        triggerToast(`Deleted custom gateway "${item.name}"`);
                      }}
                      className="p-1 rounded bg-red-950/20 border border-red-500/20 text-red-500 hover:bg-red-950/40 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans">{item.instructions}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* TAB 4: INTERNATIONAL METHODS */}
      {activeSubTab === 'intl' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-bold text-sm tracking-tight text-white uppercase font-mono text-purple-400">
            Global/International Gateways
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PayPal */}
            {intlMethods.paypal && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#003087] text-white flex items-center justify-center font-bold text-xs shadow-md font-mono">P</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">PayPal Interactive Gateway</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">International USD/EUR Card Checkout</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!intlMethods.paypal.enabled}
                        onChange={(e) => setIntlMethods({
                          ...intlMethods,
                          paypal: { ...intlMethods.paypal, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs font-sans text-left font-medium">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Merchant Account Email Handle</label>
                      <input
                        type="text"
                        value={intlMethods.paypal.email}
                        onChange={(e) => setIntlMethods({
                          ...intlMethods,
                          paypal: { ...intlMethods.paypal, email: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Sandbox Client Client ID</label>
                      <input
                        type="text"
                        value={intlMethods.paypal.clientId}
                        onChange={(e) => setIntlMethods({
                          ...intlMethods,
                          paypal: { ...intlMethods.paypal, clientId: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-neutral-400 font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_intl_methods', JSON.stringify(intlMethods));
                      triggerToast("PayPal keys compiled successfully! 🌐");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] text-[10px] uppercase font-mono font-bold text-white transition hover:bg-neutral-850"
                  >
                    Confirm & Update
                  </button>
                </div>
              </div>
            )}

            {/* HSBC Wire Transfer */}
            {intlMethods.bankTransfer && (
              <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-neutral-800 text-stone-300 border border-white/[0.2] flex items-center justify-center font-bold text-xs shadow-md">HS</div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">HSBC Global Wire Transfer</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">International Clearing Services</span>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!intlMethods.bankTransfer.enabled}
                        onChange={(e) => setIntlMethods({
                          ...intlMethods,
                          bankTransfer: { ...intlMethods.bankTransfer, enabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-left font-medium">
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Account Holder Title</label>
                      <input
                        type="text"
                        value={intlMethods.bankTransfer.accountHolder}
                        onChange={(e) => setIntlMethods({
                          ...intlMethods,
                          bankTransfer: { ...intlMethods.bankTransfer, accountHolder: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">Account Number Index</label>
                      <input
                        type="text"
                        value={intlMethods.bankTransfer.accountNumber}
                        onChange={(e) => setIntlMethods({
                          ...intlMethods,
                          bankTransfer: { ...intlMethods.bankTransfer, accountNumber: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[9px] uppercase font-mono block mb-1 text-slate-400">IBAN Coordinates Code</label>
                      <input
                        type="text"
                        value={intlMethods.bankTransfer.iban}
                        onChange={(e) => setIntlMethods({
                          ...intlMethods,
                          bankTransfer: { ...intlMethods.bankTransfer, iban: e.target.value }
                        })}
                        className="w-full bg-neutral-950 border border-neutral-850 p-1.5 rounded text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('webzone_intl_methods', JSON.stringify(intlMethods));
                      triggerToast("HSBC transfer specifications updated! 🌐");
                    }}
                    className="flex-1 py-1.5 rounded bg-neutral-900 border border-white/[0.08] text-[10px] uppercase font-mono font-bold text-white transition hover:bg-neutral-850"
                  >
                    Confirm & Update
                  </button>
                </div>
              </div>
            )}

            {/* CUSTOM REGISTERED METHODS FOR INTERNATIONAL */}
            {customMethods.filter(m => m.country === 'International').map((item) => (
              <div key={item.id} className={`p-5 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between text-left`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#0D9488] text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">
                        {item.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase">{item.type}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCustomMethods(customMethods.filter(m => m.id !== item.id));
                        triggerToast(`Deleted custom gateway "${item.name}"`);
                      }}
                      className="p-1 rounded bg-red-950/20 border border-red-500/20 text-red-500 hover:bg-red-950/40 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans">{item.instructions}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* TAB 5: MANUAL VERIFICATION HUB */}
      {activeSubTab === 'verification' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="manual-verification-hub-tab">
          
          {/* DIRECTIVES */}
          <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 text-left`}>
            <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-purple-400 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-purple-500" />
              Global Validation Directives
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
              <div className="p-3 rounded bg-neutral-950/40 border border-white/[0.02] flex justify-between items-start gap-3">
                <div>
                  <span className="font-bold text-stone-200 block text-[11px]">Verification Protocol</span>
                  <p className="text-[9px] text-neutral-400 mt-1">Manual security review vs Auto API checkouts.</p>
                </div>
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="verifyProtocol"
                      checked={verificationSettings.verificationMode === 'manual'}
                      onChange={() => setVerificationSettings({...verificationSettings, verificationMode: 'manual'})}
                      className="accent-purple-500"
                    />
                    <span className="text-[10px] uppercase font-mono text-neutral-300">Manual</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="verifyProtocol"
                      checked={verificationSettings.verificationMode === 'auto'}
                      onChange={() => setVerificationSettings({...verificationSettings, verificationMode: 'auto'})}
                      className="accent-purple-500"
                    />
                    <span className="text-[10px] uppercase font-mono text-neutral-300 font-bold">Auto</span>
                  </label>
                </div>
              </div>

              <div className="p-3 rounded bg-neutral-950/40 border border-white/[0.02] flex justify-between items-start gap-3">
                <div>
                  <span className="font-bold text-stone-200 block text-[11px]">Txn ID Mandate</span>
                  <p className="text-[9px] text-neutral-400 mt-1">Require gateway transaction reference hashes on checkout.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={!!verificationSettings.txnIdRequired}
                    onChange={(e) => setVerificationSettings({...verificationSettings, txnIdRequired: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                </label>
              </div>

              <div className="p-3 rounded bg-neutral-950/40 border border-white/[0.02] flex justify-between items-start gap-3">
                <div>
                  <span className="font-bold text-stone-200 block text-[11px]">Screenshot Upload</span>
                  <p className="text-[9px] text-neutral-400 mt-1">Enable deposit receipt screenshot attachments standard.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={!!verificationSettings.screenshotRequired}
                    onChange={(e) => setVerificationSettings({...verificationSettings, screenshotRequired: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                </label>
              </div>
            </div>
          </div>

          {/* QUEUE */}
          <div className={`p-5 rounded-2xl border ${panelBg} space-y-4 text-left`}>
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
              <div>
                <h4 className="font-extrabold text-xs uppercase font-mono tracking-wider text-purple-400">
                  Awaiting Action Settlement Queue
                </h4>
                <p className="text-[9px] text-neutral-400 mt-0.5 font-sans">Below client deposit orders are pending audit verification verification.</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#F59E0B]/10 text-amber-500 font-mono text-[9px] font-bold">
                {orders.filter(o => o.paymentStatus === 'pending').length} Payments Blocked
              </span>
            </div>

            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[9px] font-mono uppercase text-neutral-400">
                    <th className="py-2.5 px-2">Order Ref ID</th>
                    <th className="px-2">Customer Client</th>
                    <th className="px-2">Gateway Specified</th>
                    <th className="px-2">Reference Txn ID</th>
                    <th className="px-2">Value Amount</th>
                    <th className="text-right px-2">Action Handler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {orders.filter(o => o.paymentStatus === 'pending').length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500 font-mono text-[10px]">
                        ✔ Great Job! All client payments have been verified and processed.
                      </td>
                    </tr>
                  ) : (
                    orders.filter(o => o.paymentStatus === 'pending').map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.01]">
                        <td className="py-3 px-2 font-bold font-mono text-purple-400">#{ord.id}</td>
                        <td className="font-sans font-medium text-stone-200 px-2">
                          {ord.customerName || ord.guestName || "Anonymous Checkout"}
                          <span className="block text-[9px] text-neutral-400 font-mono leading-none mt-0.5">{ord.customerEmail || ord.guestEmail}</span>
                        </td>
                        <td className="font-semibold text-neutral-300 px-2">{ord.paymentMethod || "bKash Live Webhook"}</td>
                        <td className="font-mono text-[10px] text-yellow-500 px-2">{ord.transactionId || "Awaiting attachment..."}</td>
                        <td className="font-mono font-bold text-white px-2">${ord.price}</td>
                        <td className="text-right px-2">
                          <button
                            type="button"
                            onClick={() => setSelectedVerifyOrder(ord)}
                            className="px-2 py-1 text-[9px] font-black uppercase font-mono rounded bg-amber-500 text-neutral-950 hover:bg-amber-400 transition hover:scale-105 cursor-pointer inline-flex items-center gap-1 border-none"
                          >
                            <ShieldCheck className="w-3 h-3" /> Verify Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: TRANSACTION HISTORY & SHEET LEDGERS */}
      {activeSubTab === 'history' && (() => {
        const filteredTx = orders.filter(ord => {
          const name = (ord.customerName || ord.guestName || '').toLowerCase();
          const email = (ord.customerEmail || ord.guestEmail || '').toLowerCase();
          const txn = (ord.transactionId || '').toLowerCase();
          const ordId = ord.id.toLowerCase();
          const searchMat = txSearchQuery.toLowerCase().trim();

          const matchesSearch = !searchMat || 
            name.includes(searchMat) || 
            email.includes(searchMat) || 
            ordId.includes(searchMat) || 
            txn.includes(searchMat);

          const matchesStatus = txStatusFilter === 'all' || ord.paymentStatus === txStatusFilter;
          
          const methodLower = (ord.paymentMethod || '').toLowerCase();
          const matchesMethod = txMethodFilter === 'all' || 
            (txMethodFilter === 'bkash' && methodLower.includes('bkash')) ||
            (txMethodFilter === 'nagad' && methodLower.includes('nagad')) ||
            (txMethodFilter === 'paypal' && methodLower.includes('paypal')) ||
            (txMethodFilter === 'rocket' && methodLower.includes('rocket')) ||
            (txMethodFilter === 'stripe' && methodLower.includes('stripe')) ||
            (txMethodFilter === 'bank' && methodLower.includes('bank'));

          return matchesSearch && matchesStatus && matchesMethod;
        });

        const handleExportCSV = (dataList: typeof filteredTx) => {
          const headers = "Order ID,Product/Service,Customer/Guest Name,Email,Date,Payment Method,Payment Status,Price,Transaction ID\n";
          const rows = dataList.map(ord => {
            const name = ord.customerName || ord.guestName || 'N/A';
            const email = ord.customerEmail || ord.guestEmail || 'N/A';
            return `${ord.id},"${ord.itemTitle}","${name}","${email}","${ord.date}","${ord.paymentMethod}","${ord.paymentStatus}",$${ord.price},"${ord.transactionId || ''}"`;
          }).join("\n");
          const blob = new Blob([headers + rows], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `transactions_export_${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          triggerToast("🎉 System Ledger sheet successfully compiled! Triggered CSV download sequence.");
          logAdminAction(`Exported payment gateway transaction spreadsheets in CSV format (${dataList.length} rows)`);
        };

        const handleExportExcel = (dataList: typeof filteredTx) => {
          // Simulated Excel format (Tab separated text)
          const headers = "Order ID\tProduct/Service\tCustomer/Guest Name\tEmail\tDate\tPayment Method\tPayment Status\tPrice\tTransaction ID\n";
          const rows = dataList.map(ord => {
            const name = ord.customerName || ord.guestName || 'N/A';
            const email = ord.customerEmail || ord.guestEmail || 'N/A';
            return `${ord.id}\t${ord.itemTitle}\t${name}\t${email}\t${ord.date}\t${ord.paymentMethod}\t${ord.paymentStatus}\t$${ord.price}\t${ord.transactionId || ''}`;
          }).join("\n");
          const blob = new Blob([headers + rows], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `transactions_export_${Date.now()}.xls`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          triggerToast("🎉 System Ledger sheet successfully compiled! Triggered XLS/Excel spreadsheet download.");
          logAdminAction(`Exported payment gateway transaction spreadsheets in XLS/Excel format (${dataList.length} rows)`);
        };

        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/[0.05] pb-2 text-left">
              <h3 className="font-bold text-sm tracking-tight text-white uppercase font-mono text-purple-400">
                System Wide Transaction Archives
              </h3>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportCSV(filteredTx)}
                  className="px-2.5 py-1 rounded bg-[#0284C7] hover:bg-[#0369a1] text-white text-[10px] font-bold uppercase font-mono flex items-center gap-1 cursor-pointer border-none"
                >
                  <Download className="w-3 h-3" /> Export CSV Sheet
                </button>
                <button
                  type="button"
                  onClick={() => handleExportExcel(filteredTx)}
                  className="px-2.5 py-1 rounded bg-[#16A34A] hover:bg-[#15803d] text-white text-[10px] font-bold uppercase font-mono flex items-center gap-1 cursor-pointer border-none"
                >
                  <FileText className="w-3 h-3" /> Export Excel Form
                </button>
              </div>
            </div>

            {/* FILTER PANEL */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-900/40 p-4 rounded-xl border border-white/[0.03]">
              <div className="sm:col-span-2 relative">
                <Search className="absolute left-3 top-2.5 text-neutral-500 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Query reference ID, txn hash, or client email index..."
                  value={txSearchQuery}
                  onChange={(e) => setTxSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950/80 border border-neutral-800 rounded pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="w-full bg-neutral-950/80 border border-neutral-800 rounded p-1.5 text-xs text-neutral-300 outline-none font-sans"
                >
                  <option value="all">Any Settlement Status</option>
                  <option value="completed">Completed / Dispatched</option>
                  <option value="pending">Awaiting Auditing</option>
                  <option value="failed">Failed / Rejected</option>
                  <option value="refunded">Refunded Balance</option>
                </select>
              </div>

              <div>
                <select
                  value={txMethodFilter}
                  onChange={(e) => setTxMethodFilter(e.target.value)}
                  className="w-full bg-neutral-950/80 border border-neutral-800 rounded p-1.5 text-xs text-neutral-300 outline-none font-sans"
                >
                  <option value="all">Any Gateway Channel</option>
                  <option value="bkash">bKash Mobile Wallets</option>
                  <option value="nagad">Nagad Mobile money</option>
                  <option value="rocket">Rocket DBBL</option>
                  <option value="paypal">PayPal Gateways</option>
                  <option value="stripe">Stripe international</option>
                  <option value="bank">Direct bank transfers</option>
                </select>
              </div>
            </div>

            {/* LEDGER GRID TABLE */}
            <div className={`p-4 rounded-2xl border ${panelBg} text-left`}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[11px] font-sans">
                  <thead>
                    <tr className="border-b border-white/[0.05] text-[9px] font-mono text-neutral-400 uppercase text-left py-2">
                      <th className="py-2.5">Date Stamp</th>
                      <th>Ref Order ID</th>
                      <th>Client Customer</th>
                      <th>Gateway Method</th>
                      <th>Live Txn ID</th>
                      <th>RatePrice</th>
                      <th>Status Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {filteredTx.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-neutral-500 font-mono text-[10px]">
                          ❌ No archival match found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTx.map((txItem) => (
                        <tr key={txItem.id} className="hover:bg-white/[0.01]">
                          <td className="py-3 px-1 font-mono text-[10px] text-neutral-400">{txItem.date || "2026-06-25"}</td>
                          <td className="font-bold text-purple-400">#{txItem.id}</td>
                          <td className="font-sans">
                            <span className="font-bold text-stone-200 block">{txItem.customerName || txItem.guestName || "Anonymous User"}</span>
                            <span className="block text-[9px] text-neutral-400 font-mono leading-none mt-0.5">{txItem.customerEmail || txItem.guestEmail}</span>
                          </td>
                          <td className="text-neutral-300 font-semibold">{txItem.paymentMethod || "SSL Secure checkout"}</td>
                          <td className="font-mono text-[10px]">
                            {txItem.transactionId ? (
                              <span className="text-green-500 bg-green-950/10 border border-green-500/20 px-1.5 py-0.5 rounded text-[9px]">{txItem.transactionId}</span>
                            ) : (
                              <span className="text-neutral-500 italic">No reference hash</span>
                            )}
                          </td>
                          <td className="font-bold font-mono text-white text-[12px]">${txItem.price}</td>
                          <td>
                            {txItem.paymentStatus === 'completed' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[8px] uppercase tracking-wider font-extrabold font-mono">Completed</span>
                            )}
                            {txItem.paymentStatus === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-500 border border-amber-500/30 text-[8px] uppercase tracking-wider font-extrabold font-mono">Pending</span>
                            )}
                            {txItem.paymentStatus === 'failed' && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-500 border border-rose-500/30 text-[8px] uppercase tracking-wider font-extrabold font-mono">Failed</span>
                            )}
                            {txItem.paymentStatus === 'refunded' && (
                              <span className="px-2 py-0.5 rounded-full bg-neutral-850 text-neutral-400 border border-neutral-700 text-[8px] uppercase tracking-wider font-extrabold font-mono">Refunded</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] text-neutral-400">
              <span>Showing {filteredTx.length} records matching search matrices</span>
              <span className="uppercase text-purple-400">Audit Vault sync is active</span>
            </div>
          </div>
        );
      })()}

      {/* VERIFICATION DIALOG MODAL WITH DETAILED VISUAL PROGRESS BAR FOR MANUAL VERIFICATION STATUS UPDATES (RULE 6) */}
      {selectedVerifyOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
          <div className={`w-full max-w-lg rounded-3xl border overflow-hidden shadow-2xl flex flex-col ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
            
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-transparent border-neutral-800 text-left">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-purple-400 font-extrabold uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                  Manual Audit Inspector
                </span>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Verify Order #{selectedVerifyOrder.id}
                </h3>
              </div>
              <button 
                onClick={() => !isVerifying && setSelectedVerifyOrder(null)}
                disabled={isVerifying}
                className="p-2 rounded-xl transition hover:bg-neutral-800 text-neutral-400 hover:text-white border-none cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-left font-sans text-xs">
              
              <div className="grid grid-cols-2 gap-3 bg-neutral-950/40 p-4 rounded-xl border border-white/[0.02]">
                <div>
                  <span className="block text-[9px] uppercase font-mono text-neutral-500">Customer Name</span>
                  <span className="text-white font-bold text-[11px] block mt-0.5">
                    {selectedVerifyOrder.customerName || selectedVerifyOrder.guestName || "Anonymous Checkout"}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-mono text-neutral-500">Client Email</span>
                  <span className="text-neutral-300 font-mono text-[10px] block mt-0.5 leading-none">
                    {selectedVerifyOrder.customerEmail || selectedVerifyOrder.guestEmail}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-mono text-neutral-500">Charged Amount</span>
                  <span className="text-emerald-400 font-bold font-mono text-[12px] block mt-0.5">
                    ${selectedVerifyOrder.price} USD
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-mono text-neutral-500">Payment Gateway</span>
                  <span className="text-neutral-300 font-semibold block mt-0.5">
                    {selectedVerifyOrder.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded font-mono text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Transaction ID Hash:</span>
                  <span className="text-yellow-500 font-bold">{selectedVerifyOrder.transactionId || "None/Blank"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status Code:</span>
                  <span className="text-amber-500 font-bold">Awaiting Settlement</span>
                </div>
              </div>

              {/* VISUAL LOADING STATE & PROGRESS BAR FOR MANUAL AUDIT STATUS SETTLE (RULE 6) */}
              {isVerifying ? (
                <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-900/30 space-y-3 animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="text-purple-400 font-bold uppercase tracking-wide">Applying Ledger Settlement</span>
                    <span className="text-purple-400 font-black">{verifyingProgress}%</span>
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-white/[0.04] p-[1px]">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 h-full rounded-full transition-all duration-300 shadow shadow-purple-500/20"
                      style={{ width: `${verifyingProgress}%` }}
                    />
                  </div>

                  <p className="text-[10px] font-mono text-neutral-300 text-center select-none italic">
                    {verificationStatusMsg}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="block text-[10px] uppercase font-mono text-neutral-400 text-center mb-1">Audit Actions Options</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulatedVerification(selectedVerifyOrder.id, 'approve')}
                      className="py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border-none shadow transition"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Order
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulatedVerification(selectedVerifyOrder.id, 'reject')}
                      className="py-2.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border-none shadow transition"
                    >
                      <X className="w-4 h-4" /> Fail Order
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSimulatedVerification(selectedVerifyOrder.id, 'refund')}
                    className="w-full py-2 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs font-mono font-bold uppercase rounded cursor-pointer border border-white/[0.04] transition mt-1"
                  >
                    Flag as Refunded Balance
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
