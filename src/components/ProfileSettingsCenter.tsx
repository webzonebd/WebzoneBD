import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Laptop, CreditCard, Bell, ExternalLink, Database, Palette,
  CheckCircle2, Smartphone, ShieldCheck, Check, Settings
} from 'lucide-react';

// Import our modularized sub-tabs
import BasicInfoTab from './profile/BasicInfoTab';
import AccountSecurityTab from './profile/AccountSecurityTab';
import LoginSessionsTab from './profile/LoginSessionsTab';
import BillingInformationTab from './profile/BillingInformationTab';
import NotificationSettingsTab from './profile/NotificationSettingsTab';
import SocialAccountsTab from './profile/SocialAccountsTab';
import DataPrivacyTab from './profile/DataPrivacyTab';
import AppearancePreferencesTab from './profile/AppearancePreferencesTab';

interface ProfileSettingsCenterProps {
  language: 'en' | 'bn' | 'ar';
  user: any;
  ordersCount: number;
  ticketsCount: number;
  walletBalance: number;
  formatPrice: (usd: number) => string;
  triggerToast: (msg: string) => void;
  onUpdateUser: (updatedUser: any) => void;
  onAddActivityLog: (log: string) => void;
  setLanguage?: (lang: 'en' | 'bn' | 'ar') => void;
  setTheme?: (theme: 'light' | 'dark') => void;
  theme?: 'light' | 'dark';
  initialActiveTab?: 'basic' | 'security' | 'sessions' | 'billing' | 'noti' | 'social' | 'privacy' | 'appearance';
}

export default function ProfileSettingsCenter({
  language,
  user,
  ordersCount,
  ticketsCount,
  walletBalance,
  formatPrice,
  triggerToast,
  onUpdateUser,
  onAddActivityLog,
  setLanguage,
  setTheme,
  theme = 'light',
  initialActiveTab
}: ProfileSettingsCenterProps) {
  
  // Sub-navigation active state
  const [activeTab, setActiveTab] = useState<'basic' | 'security' | 'sessions' | 'billing' | 'noti' | 'social' | 'privacy' | 'appearance'>('basic');

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  // SUB MENU 1: Basic info state handlers
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [fullName, setFullName] = useState(user?.name || 'Imran Hasan');
  const [username, setUsername] = useState(user?.username || 'imran_hasan88');
  const [email, setEmail] = useState(user?.email || 'imranh7905@gmail.com');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '+8801700112233');
  const [whatsAppNumber, setWhatsAppNumber] = useState(user?.phone || '+8801864000005');
  const [country, setCountry] = useState(user?.country || 'Bangladesh');
  const [city, setCity] = useState(user?.billingCity || 'Dhaka');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Dhaka (GMT+6)');
  const [selectedLang, setSelectedLang] = useState(user?.selectedLang || 'English');

  // SUB MENU 2: Security credentials state handlers
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showCurPass, setShowCurPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [tfaEnabled, setTfaEnabled] = useState(user?.tfaEnabled || false);
  const [emailOtpEnabled, setEmailOtpEnabled] = useState(user?.emailOtpEnabled ?? true);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(user?.googleAuthEnabled ?? false);
  const [whatsappOtpEnabled, setWhatsappOtpEnabled] = useState(user?.whatsappOtpEnabled ?? false);

  // SUB MENU 3: Login Sessions details state handlers
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chroma Device Pro 16', browser: 'Chrome 125.0', os: 'Windows 11', ip: '103.84.148.29', country: 'Bangladesh', loginDate: 'June 02, 2026', loginTime: '12:04 PM', isCurrent: true },
    { id: '2', device: 'Apple iPhone 15 Pro Max', browser: 'Safari Mobile', os: 'iOS 17.4', ip: '103.84.148.33', country: 'Bangladesh', loginDate: 'June 01, 2026', loginTime: '08:44 P_M', isCurrent: false },
    { id: '3', device: 'MacBook Pro M3 Core', browser: 'Brave Browser', os: 'macOS Sonoma', ip: '192.168.1.1', country: 'United States', loginDate: 'May 28, 2026', loginTime: '09:12 AM', isCurrent: false }
  ]);

  // SUB MENU 4: Billing Addresses state handlers
  const [companyName, setCompanyName] = useState(user?.companyName || 'Webzone BD Solution');
  const [billingName, setBillingName] = useState(user?.billingName || user?.name || 'Imran Hasan');
  const [taxNumber, setTaxNumber] = useState(user?.taxId || 'VAT-882959122');
  const [addressLine1, setAddressLine1] = useState(user?.billingStreet || 'Road 4, Block F, Banani');
  const [addressLine2, setAddressLine2] = useState(user?.addressLine2 || 'Flat 4B, Skyview Tower');
  const [billingCity, setBillingCity] = useState(user?.billingCity || 'Dhaka');
  const [billingState, setBillingState] = useState(user?.billingState || 'Dhaka Division');
  const [billingPostal, setBillingPostal] = useState(user?.billingPostal || '1213');
  const [billingCountry, setBillingCountry] = useState(user?.billingCountry || 'Bangladesh');

  // SUB MENU 5: Notifications state handlers
  const [prefEmail, setPrefEmail] = useState(user?.prefEmail ?? true);
  const [prefOrder, setPrefOrder] = useState(user?.prefOrder ?? true);
  const [prefInvoice, setPrefInvoice] = useState(user?.prefInvoice ?? true);
  const [prefAffiliate, setPrefAffiliate] = useState(user?.prefAffiliate ?? true);
  const [prefTicket, setPrefTicket] = useState(user?.prefTicket ?? true);
  const [prefMarketing, setPrefMarketing] = useState(user?.prefMarketing ?? false);
  const [prefPromos, setPrefPromos] = useState(user?.prefPromos ?? false);
  const [prefWhatsApp, setPrefWhatsApp] = useState(user?.prefWhatsApp ?? true);

  // SUB MENU 6: Social link state handlers
  const [socialGoogle, setSocialGoogle] = useState(user?.googleConnected ?? true);
  const [socialFacebook, setSocialFacebook] = useState(user?.facebookConnected ?? false);
  const [socialGithub, setSocialGithub] = useState(user?.githubConnected ?? false);
  const [socialLinkedin, setSocialLinkedin] = useState(user?.linkedinConnected ?? false);

  // Form Submitter / Synchronizer
  const handleSaveAllChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      triggerToast("⚠️ Custom Validation Error: Full Name field is blank!");
      return;
    }

    // Passwords rotation block validating
    if (curPass || newPass || confPass) {
      if (!curPass) {
        triggerToast("⚠️ Password rotation error: Current Password is required.");
        return;
      }
      if (newPass.length < 6) {
        triggerToast("⚠️ Password rotation error: New Password is too short! (Minimum 6 characters)");
        return;
      }
      if (newPass !== confPass) {
        triggerToast("⚠️ Password rotation error: Dual password confirmation values do not match!");
        return;
      }
      onAddActivityLog("Rotated current account validation key credentials.");
      setCurPass('');
      setNewPass('');
      setConfPass('');
      triggerToast("🔑 Password key credentials rotated successfully!");
    }

    if (user) {
      const updatedUser = {
        ...user,
        name: fullName,
        username: username,
        email: email,
        phone: whatsAppNumber,
        avatar: profileAvatar,
        country: country,
        timezone: timezone,
        selectedLang: selectedLang,
        companyName: companyName,
        billingName: billingName,
        taxId: taxNumber,
        billingStreet: addressLine1,
        addressLine2: addressLine2,
        billingCity: billingCity,
        billingState: billingState,
        billingCountry: billingCountry,
        billingPostal: billingPostal,
        tfaEnabled: tfaEnabled,
        emailOtpEnabled: emailOtpEnabled,
        googleAuthEnabled: googleAuthEnabled,
        whatsappOtpEnabled: whatsappOtpEnabled,
        prefEmail: prefEmail,
        prefOrder: prefOrder,
        prefInvoice: prefInvoice,
        prefAffiliate: prefAffiliate,
        prefTicket: prefTicket,
        prefMarketing: prefMarketing,
        prefPromos: prefPromos,
        prefWhatsApp: prefWhatsApp,
        googleConnected: socialGoogle,
        facebookConnected: socialFacebook,
        githubConnected: socialGithub,
        linkedinConnected: socialLinkedin
      };
      onUpdateUser(updatedUser);
      onAddActivityLog("Updated customer account configurations profile settings.");
      triggerToast("⚙️ Account configurations synchronized and saved safely!");
    }
  };

  // Logout other devices handler
  const handleLogoutOtherDevices = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    onAddActivityLog("Terminated other active device tokens.");
    triggerToast("🛡️ Logged out other devices! All auxiliary session keys revoked.");
  };

  // Logout all devices handler
  const handleLogoutAllDevices = () => {
    triggerToast("🔒 Severing authorization nodes... Termitaining current browser session.");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ================= PROFILE HEADER SECTION ================= */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800/80 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Subtle geometric glassmorphic blur backgrounds */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-indigo-500/10 to-violet-500/2 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-48 bg-gradient-to-r from-emerald-500/10 to-cyan-500/2 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 border-b border-slate-100 dark:border-slate-800/60 pb-6 relative">
          
          {/* Main User Display photo */}
          <div className="relative group">
            <div className="absolute inset-x-0 inset-y-0 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 blur-lg opacity-40 group-hover:opacity-75 transition-all duration-300 pointer-events-none" />
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400">
              <div className="rounded-full bg-white dark:bg-[#1E293B] p-0.5">
                {profileAvatar ? (
                  <img 
                    src={profileAvatar} 
                    alt="Customer Avatar" 
                    className="w-24 h-24 rounded-full object-cover transition-transform duration-300 group-hover:scale-105 border border-slate-100 dark:border-slate-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-650 to-violet-750 text-white flex items-center justify-center font-black text-3xl uppercase tracking-tight select-none">
                    {fullName.slice(0, 2)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Verifications badge overlay */}
            <span className="absolute bottom-1 right-1 bg-emerald-555 border-2 border-white dark:border-[#1E293B] p-1.5 rounded-full text-white shadow-md bg-emerald-500" title="Email & Mobile Verified">
              <Check className="w-3.5 h-3.5 text-white font-black" />
            </span>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-2.5">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{fullName}</h2>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-md tracking-wider uppercase">
                @{username}
              </span>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-400 max-w-xl">
              Professional IT services buyer and digital agency catalog manager. Master account connected to commercial digital assets since June 2024.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 font-mono text-[9px]">
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Email Verified
              </span>
              <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-lg border border-sky-505/20 font-bold flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-sky-500" />
                Phone Verified
              </span>
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 font-black">
                Affiliate Level 2 (Active)
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-[9px]">
                Member Since: Jun 2024
              </span>
              <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-505/20 font-bold font-mono">
                ID: CUST-WZ-882959
              </span>
            </div>
          </div>

          {/* SLA Badge */}
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20 rounded-2xl text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 self-center lg:self-start leading-relaxed uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Pro Lockout Safetyer</span>
          </div>

        </div>

        {/* ================= QUICK STATS CARDS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
          
          <div className="bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/20 transition-all duration-300 text-center lg:text-left">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">Total Orders</span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono">{ordersCount}</p>
            <span className="text-[8px] text-emerald-500 font-bold block mt-0.5">Instant keys ready</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/20 transition-all duration-300 text-center lg:text-left">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">Active Projects</span>
            <p className="text-xl font-black text-indigo-605 dark:text-indigo-400 mt-1 font-mono">1 Active</p>
            <span className="text-[8px] text-slate-400 block mt-0.5">SLA milestone: 80%</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/20 transition-all duration-300 text-center lg:text-left">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">Downloads</span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono">5 items</p>
            <span className="text-[8px] text-indigo-400 font-bold block mt-0.5">All updates verified</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-505/20 transition-all duration-300 text-center lg:text-left">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">Wallet Balance</span>
            <p className="text-xl font-black text-emerald-500 mt-1 font-mono">{formatPrice(walletBalance)}</p>
            <span className="text-[8px] text-slate-400 block mt-0.5">SSL Secured Node</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-510/20 transition-all duration-300 text-center lg:text-left">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">Affiliate Earnings</span>
            <p className="text-xl font-black text-amber-500 mt-1 font-mono">$240.00</p>
            <span className="text-[8px] text-amber-500 font-bold block mt-0.5">Withdraw available</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/20 transition-all duration-300 text-center lg:text-left">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">Support Tickets</span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono">{ticketsCount}</p>
            <span className="text-[8px] text-slate-455 block mt-0.5">Response SLA: 10m</span>
          </div>

        </div>

      </div>

      {/* ================= SMART HORIZONTAL NAVIGATION MENU ================= */}
      <div className="bg-white/80 dark:bg-[#1E293B]/85 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-3xl p-2.5 shadow-lg relative overflow-hidden">
        {/* Decorative subtle background accents */}
        <div className="absolute top-0 right-0 w-32 h-6 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-0.5 px-0.5">
          {[
            { id: 'basic', label: 'Basic Info', labelBn: 'মৌলিক তথ্য', icon: User, badge: null },
            { id: 'security', label: 'Security', labelBn: 'নিরাপত্তা', icon: Lock, badge: 'High' },
            { id: 'sessions', label: 'Sessions', labelBn: 'সেশনসমূহ', icon: Laptop, badge: 'Active' },
            { id: 'billing', label: 'Billing', labelBn: 'বিলিং', icon: CreditCard, badge: null },
            { id: 'noti', label: 'Notifications', labelBn: 'নোটিফিকেশন', icon: Bell, badge: 'SLA' },
            { id: 'social', label: 'Social Accounts', labelBn: 'সামাজিক অ্যাকাউন্ট', icon: ExternalLink, badge: null },
            { id: 'privacy', label: 'Data & Privacy', labelBn: 'গোপনীয়তা', icon: Database, badge: 'Updated' },
            { id: 'appearance', label: 'Appearance', labelBn: 'থিম ও ভাষা', icon: Palette, badge: null }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer select-none relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? 'rotate-3 scale-110' : 'opacity-80 group-hover:scale-105'}`} />
                <span>{language === 'bn' ? item.labelBn : item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-lg tracking-wider font-mono ${
                    isActive 
                      ? 'bg-white/20 text-white border border-white/10' 
                      : item.badge === 'High' 
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20' 
                        : item.badge === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-405 border border-emerald-500/25'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Panel renderer */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        <form onSubmit={handleSaveAllChanges} className="space-y-6">
          <div key={activeTab} className="space-y-6 animate-in fade-in duration-300">

            {activeTab === 'basic' && (
            <BasicInfoTab 
              fullName={fullName} setFullName={setFullName}
              username={username} setUsername={setUsername}
              email={email} setEmail={setEmail}
              mobileNumber={mobileNumber} setMobileNumber={setMobileNumber}
              whatsAppNumber={whatsAppNumber} setWhatsAppNumber={setWhatsAppNumber}
              country={country} setCountry={setCountry}
              city={city} setCity={setCity}
              timezone={timezone} setTimezone={setTimezone}
              selectedLang={selectedLang} setSelectedLang={setSelectedLang}
              profileAvatar={profileAvatar} setProfileAvatar={setProfileAvatar}
              triggerToast={triggerToast}
              language={language}
            />
          )}

          {activeTab === 'security' && (
            <AccountSecurityTab 
              curPass={curPass} setCurPass={setCurPass}
              newPass={newPass} setNewPass={setNewPass}
              confPass={confPass} setConfPass={setConfPass}
              showCurPass={showCurPass} setShowCurPass={setShowCurPass}
              showNewPass={showNewPass} setShowNewPass={setShowNewPass}
              showConfPass={showConfPass} setShowConfPass={setShowConfPass}
              tfaEnabled={tfaEnabled} setTfaEnabled={setTfaEnabled}
              emailOtpEnabled={emailOtpEnabled} setEmailOtpEnabled={setEmailOtpEnabled}
              googleAuthEnabled={googleAuthEnabled} setGoogleAuthEnabled={setGoogleAuthEnabled}
              whatsappOtpEnabled={whatsappOtpEnabled} setWhatsappOtpEnabled={setWhatsappOtpEnabled}
              triggerToast={triggerToast}
              onAddActivityLog={onAddActivityLog}
            />
          )}

          {activeTab === 'sessions' && (
            <LoginSessionsTab 
              sessions={sessions} setSessions={setSessions}
              triggerToast={triggerToast}
              onAddActivityLog={onAddActivityLog}
              handleLogoutOtherDevices={handleLogoutOtherDevices}
              handleLogoutAllDevices={handleLogoutAllDevices}
            />
          )}

          {activeTab === 'billing' && (
            <BillingInformationTab 
              companyName={companyName} setCompanyName={setCompanyName}
              billingName={billingName} setBillingName={setBillingName}
              taxNumber={taxNumber} setTaxNumber={setTaxNumber}
              addressLine1={addressLine1} setAddressLine1={setAddressLine1}
              addressLine2={addressLine2} setAddressLine2={setAddressLine2}
              billingCity={billingCity} setBillingCity={setBillingCity}
              billingState={billingState} setBillingState={setBillingState}
              billingPostal={billingPostal} setBillingPostal={setBillingPostal}
              billingCountry={billingCountry} setBillingCountry={setBillingCountry}
            />
          )}

          {activeTab === 'noti' && (
            <NotificationSettingsTab 
              prefEmail={prefEmail} setPrefEmail={setPrefEmail}
              prefOrder={prefOrder} setPrefOrder={setPrefOrder}
              prefInvoice={prefInvoice} setPrefInvoice={setPrefInvoice}
              prefAffiliate={prefAffiliate} setPrefAffiliate={setPrefAffiliate}
              prefTicket={prefTicket} setPrefTicket={setPrefTicket}
              prefMarketing={prefMarketing} setPrefMarketing={setPrefMarketing}
              prefPromos={prefPromos} setPrefPromos={setPrefPromos}
              prefWhatsApp={prefWhatsApp} setPrefWhatsApp={setPrefWhatsApp}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'social' && (
            <SocialAccountsTab 
              socialGoogle={socialGoogle} setSocialGoogle={setSocialGoogle}
              socialFacebook={socialFacebook} setSocialFacebook={setSocialFacebook}
              socialGithub={socialGithub} setSocialGithub={setSocialGithub}
              socialLinkedin={socialLinkedin} setSocialLinkedin={setSocialLinkedin}
              triggerToast={triggerToast}
              onAddActivityLog={onAddActivityLog}
            />
          )}

          {activeTab === 'privacy' && (
            <DataPrivacyTab 
              triggerToast={triggerToast}
              onAddActivityLog={onAddActivityLog}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearancePreferencesTab 
              theme={theme} setTheme={setTheme || (() => {})}
              language={language} setLanguage={setLanguage || (() => {})}
              triggerToast={triggerToast}
            />
          )}

          {/* Global Save Controls */}
          {(activeTab === 'basic' || activeTab === 'billing' || activeTab === 'noti' || activeTab === 'security' || activeTab === 'social') && (
            <div className="pt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-left">
              <p className="text-[10px] text-slate-400 italic">
                🔒 Protected with SHA-256 cloud container algorithms
              </p>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-xs rounded-xl cursor-pointer hover:brightness-110 shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-wide"
              >
                Save Changes 💾
              </button>
            </div>
          )}

          </div>
        </form>

      </div>

    </div>
  );
}
