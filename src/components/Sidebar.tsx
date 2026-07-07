import React, { useState } from 'react';
import { 
  ShieldCheck, LogOut, ChevronRight, ChevronLeft, Menu, X, HelpCircle, Bell, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Currency, UserSession, Theme } from '../types';

export interface SubMenuItem {
  id: string;
  label: string;
  labelBn: string;
}

export interface MenuItem {
  id: string;
  label: string;
  labelBn: string;
  subMenus?: SubMenuItem[];
}

interface SidebarProps {
  language: Language;
  user: UserSession | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedMenu: string | null;
  setExpandedMenu: (menuId: string | null) => void;
  walletBalance: number;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  triggerToast: (msg: string) => void;
  formatPrice: (price: number) => string;
  onLogout: () => void;
  onAddActivityLog: (log: string) => void;
  clientMenus: MenuItem[];
  canAccessVendor: boolean;
  canAccessStaff: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}

export default function Sidebar({
  language,
  user,
  activeTab,
  setActiveTab,
  expandedMenu,
  setExpandedMenu,
  walletBalance,
  currency,
  setCurrency,
  triggerToast,
  formatPrice,
  onLogout,
  onAddActivityLog,
  clientMenus,
  canAccessVendor,
  canAccessStaff,
  isCollapsed,
  setIsCollapsed,
  theme = 'light',
  setTheme
}: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sync profile details
  const profileName = user?.name || 'Guest User';
  const profileEmail = user?.email || 'guest@webzonebd.com';
  const profileAvatar = user?.avatar || '';

  const getLocalizedText = (english: string, bengali: string): string => {
    if (language === 'bn') return bengali || english;
    if (language === 'ar') {
      const arMap: Record<string, string> = {
        '🏠 Dashboard': '🏠 لوحة التحكم',
        '📦 My Orders': '📦 طلباتي المفتوحة',
        '⬇️ Download Center': '⬇️ مركز التحميل',
        '❤️ Saved Wishlist': '❤️ قائمة المفضلة',
        '🧾 Billing & Invoices': '🧾 الفواتير والدفع',
        '🤝 Affiliate Program': '🤝 نظام التسويق بالعمولة',
        '⚙️ Account Settings': '⚙️ إعدادات الحساب',
        'Click to expand submenus': 'انقر لتوسيع القوائم الفرعية',
        'Profile Settings': 'إعدادات الحساب',
        'Loading Profile Settings...': 'جاري تحميل إعدادات الملف الشخصي...',
        'Loading Wallet Balance...': 'جاري تحميل رصيد المحفظة...',
        'Balance 💰': 'الرصيد 💰',
        'Overall VIP': 'كبار الشخصيات VIP',
        'Portal Home': 'الرئيسية',
        'Log Out': 'تسجيل الخروج',
        'Are you sure you want to log out?': 'هل أنت متأكد من تسجيل الخروج؟'
      };
      return arMap[english] || arMap[bengali] || english;
    }
    return english;
  };

  // Parse emojis and clean labels
  const getMenuVisuals = (label: string) => {
    const emojiRegex = /^\p{Emoji}/u;
    const match = label.match(emojiRegex);
    if (match) {
      const emoji = match[0];
      const cleanLabel = label.replace(emoji, '').trim();
      return { emoji, cleanLabel };
    }
    return { emoji: '🎯', cleanLabel: label };
  };

  const handleParentMenuClick = (menu: MenuItem, isOnMobile = false) => {
    const hasSub = !!menu.subMenus && menu.subMenus.length > 0;
    const isExpanded = expandedMenu === menu.id;

    if (isCollapsed && !isOnMobile) {
      // Auto expand sidebar for absolute clarity
      setIsCollapsed(false);
      setExpandedMenu(menu.id);
      if (hasSub && menu.subMenus) {
        // Just expand, don't auto-navigate if it has a sub-menu!
      } else {
        setActiveTab(menu.id);
      }
      onAddActivityLog(`Expanded sidebar and selected root: ${menu.label}`);
      return;
    }

    if (hasSub && menu.subMenus) {
      // Toggle expanded state without updating the active tab immediately
      setExpandedMenu(isExpanded ? null : menu.id);
      onAddActivityLog(`Toggled submenu list for parent: ${menu.label}`);
    } else {
      setExpandedMenu(menu.id);
      setActiveTab(menu.id);
      if (isOnMobile) {
        setMobileMenuOpen(false);
      }
      onAddActivityLog(`Selected navigation root: ${menu.label}`);
    }
  };

  // Helper inside loop
  const evaluateParentActive = (menu: MenuItem) => {
    return activeTab === menu.id || (menu.subMenus?.some(s => s.id === activeTab)) || false;
  };

  const renderDashboardMenuContents = (isOnMobile = false) => {
    const isRealCollapsed = isCollapsed && !isOnMobile;
    return (
      <div className="space-y-6">
        {/* Top User Profile Card Component */}
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] text-white transition-all duration-350 shadow-lg dark:shadow-[0_8px_32px_rgba(37,99,235,0.15)] border border-white/10 ${
          isRealCollapsed ? 'p-2' : 'p-4'
        }`}>
          {/* Subtle Ambient Glossy Background Orbs designed for pristine Light/Dark UX */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none animate-pulse-slow" />
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-cyan-400/20 rounded-full blur-lg pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-3">
            {/* Top Row: Avatar + Name Details horizontally when expanded */}
            <div className={`flex ${isRealCollapsed ? 'flex-col items-center gap-1.5' : 'items-center gap-3.5'}`}>
              
              {/* Profile Photo */}
              <div className="relative inline-block group cursor-pointer shrink-0">
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-40 blur-sm group-hover:opacity-80 transition-all duration-300" />
                
                <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-white/60 to-white/10">
                  <div className="relative rounded-full bg-slate-900/40 backdrop-blur-md p-[1px]">
                    {profileAvatar ? (
                      <img 
                        src={profileAvatar} 
                        alt="Profile avatar" 
                        className="w-10 h-10 rounded-full object-cover select-none border border-white/10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black uppercase text-[11px] select-none border border-white/15">
                        {profileName.slice(0, 2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification indicator active dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#414bf2] flex items-center justify-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </span>

                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-950 text-white text-xs font-bold font-sans rounded-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 shadow-xl pointer-events-none whitespace-nowrap z-50 border border-slate-800">
                    <p className="font-extrabold">{profileName}</p>
                    <p className="text-[10px] text-cyan-205 font-mono mt-0.5">{profileEmail}</p>
                  </div>
                )}
              </div>

              {/* Account text parameters when expanded */}
              {!isCollapsed && (
                <div className="text-left min-w-0 flex-1">
                  <h4 className="text-xs font-black text-white truncate tracking-tight">
                    {profileName}
                  </h4>
                  <p className="text-[10px] text-cyan-100/80 font-mono truncate mt-0.5">
                    {profileEmail}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-emerald-300 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                    👑 OVERALL VIP
                  </div>
                </div>
              )}
            </div>
            {!isRealCollapsed && (
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    triggerToast(language === 'bn' ? 'প্রোফাইল সেটিংস লোড করা হচ্ছে...' : language === 'ar' ? 'جاري تحميل إعدادات الملف الشخصي...' : 'Loading Profile Settings...');
                    onAddActivityLog('Navigated to Profile Settings via shortcuts');
                    if (isOnMobile) setMobileMenuOpen(false);
                  }}
                  className="py-2 px-1 bg-white/10 hover:bg-white/20 text-white text-[9.5px] font-black rounded-xl cursor-pointer text-center transition duration-200 truncate border border-white/10 shadow-inner"
                  title="Profile Settings"
                >
                  {getLocalizedText('Profile Settings', 'প্রোফাইল সেটিংস')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('wallet-funds');
                    triggerToast(language === 'bn' ? 'ওয়ালেট ব্যালেন্স পৃষ্ঠা...' : language === 'ar' ? 'جاري تحميل رصيد المحفظة...' : 'Loading Wallet Balance...');
                    onAddActivityLog('Navigated to Wallet via shortcut Balance link');
                    if (isOnMobile) setMobileMenuOpen(false);
                  }}
                  className="py-2 px-1 bg-white hover:bg-neutral-50 text-[#2563EB] text-[9.5px] font-black rounded-xl cursor-pointer text-center shadow-md hover:shadow-lg transition duration-200 truncate"
                  title={`Balance: ${formatPrice(walletBalance)}`}
                >
                  {getLocalizedText('Balance 💰', 'ব্যালেন্স 💰')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation Sidebar Menu list Fields */}
        <div className="space-y-2.5 font-sans">
          {clientMenus.map((menu) => {
            const hasSub = !!menu.subMenus && menu.subMenus.length > 0;
            const isExpanded = expandedMenu === menu.id;
            const isParentActive = evaluateParentActive(menu);
            const { emoji, cleanLabel } = getMenuVisuals(getLocalizedText(menu.label, menu.labelBn));

            return (
              <div key={menu.id} className="relative group/menu mb-1.5">
                <button
                  type="button"
                  onClick={() => handleParentMenuClick(menu, isOnMobile)}
                  style={{ minHeight: '48px' }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-all duration-300 rounded-2xl relative overflow-hidden active:scale-95 cursor-pointer border ${
                    isParentActive
                      ? isOnMobile
                        ? 'text-indigo-700 dark:text-cyan-400 font-extrabold bg-gradient-to-r from-indigo-500/12 via-indigo-500/5 to-transparent dark:from-cyan-500/12 dark:to-transparent border-l-4 border-l-indigo-600 dark:border-l-cyan-400 border-y-indigo-200/55 border-r-indigo-100/40 dark:border-y-cyan-500/15 dark:border-r-slate-800/20 shadow-[0_4px_16px_rgba(99,102,241,0.06)]'
                        : 'text-indigo-650 dark:text-cyan-400 font-extrabold border-transparent shadow-[0_4px_12px_rgba(99,102,241,0.06)] active-menu-glow'
                      : isOnMobile
                        ? 'text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/15 border-slate-200/50 dark:border-slate-800/40 hover:bg-slate-100/55 dark:hover:bg-slate-800/30 hover:border-indigo-100 dark:hover:border-slate-700 shadow-xs'
                        : 'text-slate-600 dark:text-slate-350 hover:text-indigo-500 dark:hover:text-cyan-400 border-transparent'
                  }`}
                >
                  {/* Left vibrant indicator bar on active parent menu */}
                  {isParentActive && !isOnMobile && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[3.5px] rounded-r-md bg-gradient-to-b from-indigo-650 to-indigo-500 dark:from-cyan-400 dark:to-teal-400 z-20" />
                  )}

                  {/* Active Glow/Border on Main Menu (Desktop-only to avoid duplicate layered borders on mobile) */}
                  {isParentActive && !isOnMobile && (
                    <div className="absolute inset-x-0 bottom-0 top-0 rounded-xl p-[1px] bg-gradient-to-r from-[#2563EB]/45 to-[#7C3AED]/45 dark:from-[#6366F1]/55 dark:to-[#8B5CF6]/55 -z-10 animate-pulse">
                      <div className="w-full h-full bg-[#FFFFFF] dark:bg-[#1E293B] rounded-[11px]" />
                    </div>
                  )}

                  {/* Gradient Fill Animation on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/5 to-[#7C3AED]/5 opacity-0 group-hover/menu:opacity-100 transition-opacity duration-300 -z-10" />

                  <span className={`flex items-center gap-3.5 z-10 transition-transform duration-300 ${
                    isRealCollapsed ? 'justify-center w-full' : 'group-hover/menu:translate-x-0.5'
                  }`}>
                    {isOnMobile ? (
                      <span className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all duration-300 font-sans select-none shrink-0 ${
                        isParentActive 
                          ? 'bg-indigo-600/10 dark:bg-cyan-400/10 text-indigo-700 dark:text-cyan-400 ring-4 ring-indigo-50 dark:ring-cyan-500/5 border border-indigo-200 dark:border-cyan-500/25' 
                          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-205 dark:border-slate-700 shadow-xs group-hover/menu:bg-white dark:group-hover/menu:bg-slate-700'
                      }`}>
                        {emoji}
                      </span>
                    ) : (
                      <span className="scale-110 inline-block font-sans select-none animate-none" title={isRealCollapsed ? cleanLabel : ''}>
                        {emoji}
                      </span>
                    )}
                    
                    {!isRealCollapsed && (
                      <span className={`scale-100 inline-block select-none font-sans ml-0.5 text-left truncate transition-all duration-300 ${
                        isParentActive
                          ? 'text-indigo-650 dark:text-cyan-400 font-extrabold shadow-none'
                          : 'font-semibold text-slate-700 dark:text-slate-250'
                      }`}>
                        {cleanLabel}
                      </span>
                    )}
                  </span>

                  {/* Arrow turning down smoothly if expanded inside expanded mode */}
                  {!isRealCollapsed && hasSub && (
                    <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 z-10 text-slate-400 ${
                      isExpanded ? 'rotate-90 text-indigo-650 dark:text-cyan-400 scale-110 font-bold' : ''
                    }`} />
                  )}

                  {/* Floating tooltip inline on collapsed mode */}
                  {isRealCollapsed && (
                    <div className="absolute left-full ml-3 px-3.5 py-1.5 bg-slate-950 text-white text-xs font-bold font-sans rounded-xl opacity-0 scale-90 group-hover/menu:opacity-100 group-hover/menu:scale-100 transition-all duration-200 shadow-xl pointer-events-none whitespace-nowrap z-50 border border-slate-800">
                      {getLocalizedText(menu.label, menu.labelBn)}
                      {hasSub && (
                        <span className="block text-[9.5px] text-[#818CF8] font-mono font-medium mt-0.5 uppercase tracking-wider">
                          {getLocalizedText('Click to expand submenus', 'সাবমেনু উপলব্ধ')}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-menu block (hardware-accelerated, 250ms-350ms duration) */}
                {!isRealCollapsed && hasSub && menu.subMenus && (
                  <div
                    style={{
                      maxHeight: isExpanded ? `${menu.subMenus.length * 44}px` : '0px',
                      transitionProperty: 'max-height, opacity, padding, margin',
                      transitionDuration: '300ms',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    className={`overflow-hidden opacity-0 ${
                      isExpanded 
                        ? isOnMobile
                          ? 'opacity-100 mt-2 mb-3.5 pl-4 ml-5.5 border-l-2 border-dashed border-slate-250 dark:border-slate-700 space-y-2'
                          : 'opacity-100 mt-1 mb-2 pl-3 ml-2 border-l border-neutral-200 dark:border-slate-800 space-y-1'
                        : ''
                    }`}
                  >
                    {menu.subMenus.map((sub) => {
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          style={{ minHeight: '36px' }}
                          onClick={() => {
                            setActiveTab(sub.id);
                            onAddActivityLog(`Routed to sub-module: ${sub.label}`);
                            if (isOnMobile) {
                              setMobileMenuOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer text-left ${
                            isSubActive
                              ? isOnMobile
                                ? 'text-indigo-705 dark:text-cyan-400 font-black bg-gradient-to-r from-indigo-50/70 to-indigo-50/15 dark:from-cyan-950/20 dark:to-transparent border-l-2 border-l-indigo-600 dark:border-l-cyan-400 pl-4 shadow-xs'
                                : 'text-indigo-650 dark:text-cyan-400 active-child-menu-glow font-extrabold shadow-sm bg-indigo-50/50 dark:bg-slate-800/40'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-lg'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full transition-transform duration-205 ${
                            isSubActive 
                              ? 'bg-indigo-600 dark:bg-cyan-400 scale-125 ring-4 ring-indigo-100 dark:ring-cyan-500/15' 
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`} />
                          <span className="truncate">{getLocalizedText(sub.label, sub.labelBn)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Modern Premium Gradient Log Out Button */}
          <div className="pt-2.5 border-t border-neutral-200 dark:border-slate-800/60 relative group/logout w-full">
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
              }}
              style={{ minHeight: '40px' }}
              className={`w-full flex items-center ${isRealCollapsed ? 'justify-center p-1.5' : 'justify-center gap-2 px-4 py-2.5'} text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 active:scale-95 rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-indigo-500/20 text-center relative`}
            >
              <LogOut className="w-4 h-4 text-white shrink-0 animate-pulse" />
              {!isRealCollapsed && (
                <span>{language === 'bn' ? 'লগআউট করুন 🚪' : 'Logout Portal 🚪'}</span>
              )}
            </button>

            {isRealCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3.5 py-1.5 bg-neutral-950 text-white text-xs font-black font-sans rounded-xl opacity-0 scale-90 group-hover/logout:opacity-100 group-hover/logout:scale-100 transition-all duration-200 shadow-xl pointer-events-none whitespace-nowrap z-50 border border-slate-800">
                {language === 'bn' ? '🚪 লগআউট (Logout)' : '🚪 Logout Customer Portal'}
              </div>
            )}
          </div>
        </div>

        {/* Currency Switcher & Footer Utilities */}
        <div className="pt-4 border-t border-neutral-100 dark:border-slate-800 space-y-2">
          {!isCollapsed ? (
            <>
              <span className="text-[9.5px] text-neutral-400 font-mono block text-center font-extrabold uppercase tracking-wide">CURRENCY SYNC</span>
              <div className="grid grid-cols-3 gap-1 shadow-sm rounded-lg p-0.5 bg-[#F8FAFC] dark:bg-[#111827] text-[10px] font-bold">
                {(['USD', 'BDT', 'SAR'] as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      setCurrency(cur);
                      triggerToast(`Currency synced view switch: ${cur}`);
                    }}
                    className={`py-1 rounded-md transition duration-200 cursor-pointer ${
                      currency === cur
                        ? 'bg-gradient-to-r from-blue-600 to-purple-650 bg-blue-600 text-white font-black shadow-md'
                        : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="group relative flex justify-center py-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-black text-[10px]">
                {currency}
              </div>
              
              {/* Collapsed view absolute hover context for currency switcher */}
              <div className="absolute left-full ml-3 p-2 bg-slate-950 text-white text-xs font-bold font-sans rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 shadow-xl pointer-events-none group-hover:pointer-events-auto z-50 border border-slate-800 space-y-1.5 w-28">
                <span className="block text-[8px] text-neutral-400 font-mono font-extrabold uppercase text-center">SWITCH CURRENCY</span>
                <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded bg-slate-900">
                  {(['USD', 'BDT', 'SAR'] as Currency[]).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur);
                        triggerToast(`Synced currency: ${cur}`);
                      }}
                      className={`py-1 text-[9px] rounded text-center transition cursor-pointer font-bold ${
                        currency === cur ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR VIEW: Beautifully collapsible side rail */}
      <div className={`hidden lg:block relative bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[rgba(255,255,255,0.08)] rounded-3xl p-5 shadow-xl transition-all duration-300 ${
        isCollapsed ? 'col-span-1 w-20' : 'col-span-3 w-full'
      }`}>
        {/* Persistent Double-Chevron Collapse/Expand trigger button positioned on absolute border */}
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            triggerToast(isCollapsed ? 'Sidebar expanded' : 'Sidebar collapsed to minimalist rail');
          }}
          className="absolute -right-3.5 top-14 w-7 h-7 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-800 hover:border-indigo-500 dark:hover:border-cyan-400 rounded-full flex items-center justify-center shadow-md hover:shadow-lg text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 z-40 transition-transform active:scale-90 cursor-pointer"
          style={{ minWidth: '28px', minHeight: '28px' }}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {renderDashboardMenuContents(false)}
      </div>

      {/* 2. MOBILE QUICK SELECT BAR & STICKY OVERLAY DRAWER COMPONENT */}
      <div className="block lg:hidden w-full space-y-4">
        {/* Compact Responsive Mobile Top Menu Strip */}
        <div className="w-full flex items-center justify-between bg-white dark:bg-[#1E293B] py-2.5 px-4 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            {/* Sync trigger button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 sm:p-2.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-650 dark:text-cyan-400 rounded-xl border border-indigo-100/30 dark:border-indigo-900/15 focus:outline-none transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center group"
              title="Toggle sidebar drawer"
            >
              {/* Premium Asymmetrical Interactive Mini Hamburger Indicator */}
              <div className="flex flex-col gap-1 w-5 h-5 justify-center items-center">
                <span className="w-5 h-0.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-cyan-400 dark:via-teal-300 dark:to-cyan-400 rounded-full transition-all duration-300 group-hover:w-3.5" />
                <span className="w-3.5 h-0.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 dark:from-cyan-300 dark:via-teal-300 dark:to-cyan-400 rounded-full transition-all duration-300 mr-auto group-hover:w-5" />
                <span className="w-4.5 h-0.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-cyan-400 dark:via-teal-300 dark:to-cyan-400 rounded-full transition-all duration-300 mr-auto" />
              </div>
            </button>
            
            <div className="text-left">
              <span className="text-[9px] text-[#94A3B8] font-mono uppercase block font-bold tracking-wide">PORTAL NAVIGATION</span>
              <span className="text-xs font-black text-neutral-800 dark:text-slate-200 capitalize">
                {language === 'bn' ? 'কনসোল মেনু' : 'Console Operations'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-md border border-[#14B8A6]/20 font-mono">
              {formatPrice(walletBalance)}
            </span>
            <button
              onClick={() => {
                setActiveTab('notifications');
                setExpandedMenu('notifications');
                triggerToast(language === 'bn' ? 'নোটিফিকেশন সেন্টার 🔔...' : 'Opening Notification Center 🔔...');
              }}
              className="relative p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-550 dark:text-rose-450 border border-rose-500/20 rounded-full transition-all focus:outline-none cursor-pointer flex items-center justify-center scale-95 group"
              title={language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notification Center'}
            >
              <Bell className="w-4 h-4 text-rose-500 animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#1E293B] animate-pulse" />
            </button>
          </div>
        </div>

        {/* Backdrop + Mobile Sheet Drawer Portal using Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backing frosted overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 cursor-pointer"
              />

              {/* Slide-out Panel Layer menu */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 210 }}
                className="fixed top-0 bottom-0 left-0 w-[300px] sm:w-[335px] bg-white/95 dark:bg-[#0F172A]/98 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 text-neutral-850 dark:text-neutral-100 shadow-2xl p-5 overflow-y-auto z-50 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header Drawer Banner */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gradient-to-tr from-indigo-600 to-[#06B6D4] rounded-lg text-white">
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs md:text-sm tracking-tight uppercase">
                        WebzoneBD Member
                      </span>
                    </div>

                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Render list content with active state mapping closures */}
                  <div className="space-y-4">
                    {renderDashboardMenuContents(true)}
                  </div>
                </div>

                {/* Secure Theme Switcher and Signature Block */}
                <div className="mt-8 space-y-4">
                  {/* Premium Theme Switching section within member drawer */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 font-mono font-black px-1 flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 animate-pulse" />
                      <span>Theme Settings</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-sans text-[10.5px] font-black">
                      <button 
                        type="button"
                        onClick={() => {
                          if (setTheme) {
                            setTheme('light');
                            triggerToast('🔆 Light Theme Mode Active');
                          }
                        }}
                        className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer duration-300 border ${
                          theme === 'light' 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-lg shadow-blue-500/10' 
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850'
                        }`}
                      >
                        <span className="text-xs">☀</span>
                        <span>Light Mode</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (setTheme) {
                            setTheme('dark');
                            triggerToast('🌙 Dark Theme Mode Active');
                          }
                        }}
                        className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer duration-300 border ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-lg shadow-blue-500/15' 
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850'
                        }`}
                      >
                        <span className="text-xs">🌙</span>
                        <span>Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 text-center">
                    <p className="text-[9px] text-slate-400 dark:text-neutral-500 font-mono tracking-tight uppercase">WebzoneBD Client Consolidation v3.1</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto font-sans">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-neutral-900 dark:text-white shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Red accent strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-650 via-rose-500 to-orange-500" />
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-1.5 flex-1 w-full text-left">
                <h4 className="text-sm font-black tracking-tight uppercase font-sans text-red-600 dark:text-red-400">
                  {language === 'bn' ? 'লগআউট নিশ্চিত করুন?' : 'Confirm Logout?'}
                </h4>
                <p className="text-xs opacity-75 leading-relaxed font-sans mt-1">
                  {language === 'bn' 
                    ? 'আপনি কি নিশ্চিত যে আপনি মেম্বার প্যানেল থেকে লগআউট করতে চান?' 
                    : 'Are you sure you want to log out from WebzoneBD Customer Area?'
                  }
                </p>
                <span className="text-[10px] text-red-500 font-semibold block bg-red-500/5 px-2 py-1 rounded border border-red-500/10 mt-2 font-mono">
                  🚨 {language === 'bn' ? 'এটি আপনার সুরক্ষিত সেশন বন্ধ করে দেবে।' : 'This will terminate your secure portal session.'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {language === 'bn' ? 'না, প্যানেলে থাকুন' : 'No, Stay'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="px-4 py-1.5 text-xs font-black bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-lg shadow-red-500/20 hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                {language === 'bn' ? 'হ্যাঁ, লগআউট' : 'Yes, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
