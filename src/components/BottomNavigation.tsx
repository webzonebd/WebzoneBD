import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Grid, 
  ShoppingBag, 
  MessageCircle, 
  User, 
  Plus, 
  X, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  PhoneCall, 
  LogIn,
  Layers,
  Sparkles,
  Server,
  ShoppingCart,
  Handshake,
  BookOpen,
  Wallet
} from 'lucide-react';

interface BottomNavigationProps {
  language: 'en' | 'bn' | 'ar';
  currentPage: string;
  onNavigate: (page: string) => void;
  onLoginClick: (view?: 'login' | 'register') => void;
  user: any;
  triggerToast: (msg: string) => void;
  cartOpen?: boolean;
  cartCount?: number;
}

const translations = {
  en: {
    home: "Home",
    hosting: "Hosting",
    services: "Services",
    store: "Store",
    support: "Support",
    cart: "Cart",
    account: "Account",
    quickAccess: "Quick Access",
    orderService: "Order Service",
    requestQuote: "Request Quote",
    openTicket: "Open Ticket",
    contactWhatsapp: "Contact WhatsApp",
    viewPortfolio: "View Portfolio",
    clientLogin: "Client Login",
    loginDesc: "Access your dashboard instantly",
    alreadyLoggedIn: "Already authorized as {name}.",
    quickTitle: "Quick Access",
    quickDesc: "Instantly launch project orders, premium quotes, and live support.",
    toastQuote: "Opening custom project quote request form.",
    toastTicket: "Opening customer support ticket helpdesk.",
    toastPortfolio: "Navigating to WebzoneBD Premium Portfolios.",
    activeUser: "Active",
    affiliates: "Affiliates Program",
    blog: "Our Tech Blog",
    toastAffiliates: "Navigating to WebzoneBD Affiliates Partnership Program.",
    toastBlog: "Navigating to our latest tech & development blog posts.",
    solutions: "Our Solutions",
    toastSolutions: "Navigating to WebzoneBD Premium Digital Solutions.",
    addWalletFunds: "Add Wallet Funds",
    depositAutomated: "Deposit automated (Instant BKash/Nagad/Card)"
  },
  bn: {
    home: "হোম",
    hosting: "হোস্টিং",
    services: "সার্ভিস",
    store: "স্টোর",
    support: "সাপোর্ট",
    cart: "কার্ট",
    account: "অ্যাকাউন্ট",
    quickAccess: "কুইক অ্যাক্সেস",
    orderService: "সার্ভিস অর্ডার করুন",
    requestQuote: "কোটেশনের অনুরোধ",
    openTicket: "টিকেট ওপেন করুন",
    contactWhatsapp: "হোয়াটসঅ্যাপ সাপোর্ট",
    viewPortfolio: "পোর্টফোলিও দেখুন",
    clientLogin: "ক্লায়েন্ট লগইন",
    loginDesc: "আপনার ড্যাশবোর্ড দ্রুত অ্যাক্সেস করুন",
    alreadyLoggedIn: "ইতিমধ্যে {name} হিসাবে লগইন আছেন।",
    quickTitle: "কুইক অ্যাক্সেস মেনু",
    quickDesc: "সহজে নতুন সার্ভিস অর্ডার করুন, কোটেশন নিন অথবা টেকনিক্যাল টিম সাপোর্ট চালু করুন।",
    toastQuote: "কাস্টম প্রজেক্ট কোটেশন ফর্ম ওপেন করা হচ্ছে।",
    toastTicket: "গ্রাহক সহায়তা টিকেট হেল্পডেস্ক ওপেন করা হচ্ছে।",
    toastPortfolio: "ওয়েবজোনবিডি প্রিমিয়াম পোর্টফোলিওতে পাঠানো হচ্ছে।",
    activeUser: "সক্রিয়",
    affiliates: "অ্যাফিলিয়েট প্রোগ্রাম",
    blog: "আমাদের ব্লগ",
    toastAffiliates: "অ্যাফিলিয়েট পার্টনারশিপ প্রোগ্রামে পাঠানো হচ্ছে।",
    toastBlog: "আমাদের সর্বশেষ ব্লগ পোস্টে পাঠানো হচ্ছে।",
    solutions: "আমাদের সলিউশনস",
    toastSolutions: "ওয়েবজোনবিডি প্রিমিয়াম ডিজিটাল সলিউশনস পেজে পাঠানো হচ্ছে।",
    addWalletFunds: "ওয়ালেট ফান্ড যোগ করুন",
    depositAutomated: "অটোমেটেড ইনস্ট্যান্ট ডিপোজিট (বিকাশ/নগদ/কার্ড)"
  },
  ar: {
    home: "الرئيسية",
    hosting: "الاستضافة",
    services: "الخدمات",
    store: "المتجر",
    support: "الدعم",
    cart: "السلة",
    account: "حسابي",
    quickAccess: "وصول سريع",
    orderService: "طلب خدمة",
    requestQuote: "طلب عرض سعر",
    openTicket: "فتح تذكرة دعم",
    contactWhatsapp: "تواصل عبر واتساب",
    viewPortfolio: "معرض الأعمال",
    clientLogin: "دخول العملاء",
    loginDesc: "تسجيل الدخول إلى لوحة التحكم",
    alreadyLoggedIn: "أنت مسجل الدخول بالفعل باسم {name}.",
    quickTitle: "الوصول السريع",
    quickDesc: "اطلب الخدمات فوراً، واحصل على عروض أسعار ودعم فني مباشر.",
    toastQuote: "جاري فتح نموذج طلب عرض السعر المخصص للأنشطة.",
    toastTicket: "جاري فتح نظام تذاكر الدعم الفني وخدمة العملاء.",
    toastPortfolio: "جاري الانتقال لمعرض أعمال ويب زون بي دي الرقمي.",
    activeUser: "مؤهل",
    affiliates: "برنامج التسويق بالعمولة",
    blog: "المدونة التقنية",
    toastAffiliates: "جاري الانتقال إلى برنامج الشركاء في التسويق بالعمولة.",
    toastBlog: "جاري الانتقال لمدونة مقالات تطوير البرمجيات والتقنية.",
    solutions: "حلولنا الرقمية",
    toastSolutions: "جاري الانتقال لصفحة الحلول الرقمية المتميزة.",
    addWalletFunds: "شحن رصيد المحفظة",
    depositAutomated: "إيداع تلقائي فوري (بكاش/نقد/بطاقة)"
  }
};

export default function BottomNavigation({
  language,
  currentPage,
  onNavigate,
  onLoginClick,
  user,
  triggerToast,
  cartOpen = false,
  cartCount = 0
}: BottomNavigationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar';

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'hosting', label: t.hosting, icon: Server },
    { id: 'services', label: t.services, icon: Grid },
    { id: 'marketplace', label: t.store, icon: ShoppingBag },
    { id: 'cart', label: t.cart, icon: ShoppingCart },
    { id: 'dashboard', label: t.account, icon: User }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
  };

  const handleQuickAction = (action: string) => {
    setIsSheetOpen(false);
    
    switch (action) {
      case 'order-service':
        onNavigate('services');
        break;
      case 'solutions':
        onNavigate('solutions');
        triggerToast(t.toastSolutions);
        break;
      case 'request-quote':
        onNavigate('contact');
        triggerToast(t.toastQuote);
        break;
      case 'open-ticket':
        onNavigate('contact');
        triggerToast(t.toastTicket);
        break;
      case 'contact-whatsapp':
        window.open('https://wa.me/966570511931', '_blank');
        break;
      case 'view-portfolio':
        onNavigate('portfolio');
        triggerToast(t.toastPortfolio);
        break;
      case 'affiliates':
        onNavigate('affiliate');
        triggerToast(t.toastAffiliates);
        break;
      case 'blog':
        onNavigate('blog');
        triggerToast(t.toastBlog);
        break;
      case 'client-login':
        if (user) {
          triggerToast(t.alreadyLoggedIn.replace('{name}', user.name || user.email || 'Client'));
          onNavigate('dashboard');
        } else {
          onLoginClick('login');
        }
        break;
      case 'add-wallet-funds':
        if (user) {
          localStorage.setItem('webzone_dashboard_active_tab', 'my-wallet');
          onNavigate('dashboard');
        } else {
          onLoginClick('login');
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* 1. Dynamic gradients for active bottom navigation icons (Light/Dark themes) */}
      <svg className="absolute w-0 h-0 pointer-events-none" width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="bottom-nav-active-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bottom-nav-gradient-start, #6366f1)" />
            <stop offset="100%" stopColor="var(--bottom-nav-gradient-end, #06b6d4)" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        :root {
          --bottom-nav-gradient-start: #4f46e5; /* indigo-600 */
          --bottom-nav-gradient-end: #06b6d4; /* cyan-500 */
        }
        .dark {
          --bottom-nav-gradient-start: #818cf8; /* indigo-400 */
          --bottom-nav-gradient-end: #22d3ee; /* cyan-400 */
        }
        .active-icon-glow {
          filter: drop-shadow(0 2px 6px rgba(79, 70, 229, 0.45));
        }
        .dark .active-icon-glow {
          filter: drop-shadow(0 2px 8px rgba(34, 211, 238, 0.55));
        }
      `}</style>

      {/* 1. floating Center Quick Access Button */}
      <div 
        className="fixed bottom-10.5 left-1/2 -translate-x-1/2 z-40 md:hidden flex flex-col items-center pointer-events-none"
        id="quick-access-fab-container"
      >
        <button
          onClick={() => setIsSheetOpen(true)}
          className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-violet-605 to-indigo-605 active:scale-95 hover:scale-105 text-white font-extrabold text-[10px] rounded-full shadow-md shadow-indigo-600/30 border border-violet-500/25 cursor-pointer animate-pulse transition-all"
          id="quick-access-fab"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
          </span>
          <Plus className="w-3 h-3" />
          <span>{t.quickAccess}</span>
        </button>
      </div>

      {/* 2. Premium Fixed Glassmorphism Bottom Navigation Bar */}
      <motion.div 
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="fixed bottom-0.5 left-4 right-4 z-40 mx-auto max-w-sm md:hidden font-sans"
        id="telegram-bottom-nav-outer"
      >
        <div 
          className="relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/40 dark:border-slate-800/60 rounded-xl p-[1.5px] flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
          id="telegram-bottom-nav-inner"
        >
          {navItems.map((item) => {
            const IconComponent = item.icon;
            // Handle both exact match or if current page is inside subcategories
            const isActive = currentPage === item.id || 
              (item.id === 'cart' && cartOpen) ||
              (item.id === 'marketplace' && currentPage === 'store') ||
              (item.id === 'dashboard' && currentPage === 'admin');

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className="relative py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-w-[44px] hover:bg-slate-100/30 dark:hover:bg-slate-900/10"
              >
                {/* Active Backdrop pill */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavBackdrop"
                    className="absolute inset-[1px] bg-gradient-to-b from-indigo-500/5 to-cyan-500/5 dark:from-indigo-400/10 dark:to-cyan-400/10 rounded-xl border border-indigo-500/10 dark:border-cyan-400/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}

                {/* Icon Wrapper */}
                <div 
                  className={`relative p-0.5 rounded-md flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'scale-110 active-icon-glow' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <IconComponent 
                    className="w-3.5 h-3.5 stroke-[2.5]" 
                    stroke={isActive ? "url(#bottom-nav-active-grad)" : "currentColor"}
                  />
                  {item.id === 'cart' && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-mono text-[9px] font-black min-w-[15px] h-3.5 px-1 rounded-full flex items-center justify-center border border-white dark:border-slate-950 shadow-sm animate-bounce">
                      {cartCount}
                    </span>
                  )}
                  {/* Active point indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 animate-pulse" />
                  )}
                </div>

                {/* Item label */}
                <span 
                  className={`text-[8.5px] tracking-tight transition-colors duration-250 mt-0.5 leading-none ${
                    isActive 
                      ? 'text-indigo-600 dark:text-cyan-400 font-black' 
                      : 'text-slate-400 dark:text-slate-500 font-semibold'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 3. Bottom Sheet / Modal Quick Access Overlay Menu */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 md:hidden"
              id="quick-access-backdrop"
            />

            {/* Bottom Sheet Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 rounded-t-[32px] shadow-2xl z-50 md:hidden overflow-y-auto font-sans"
              id="quick-access-sheet"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Sleek top dragging handle notch */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              {/* Header block with elegant Premium Gradient bg */}
              <div className="px-6 py-5 flex items-start justify-between bg-gradient-to-r from-[#F5F3FF] via-[#EEF2FF] to-[#ECFEFF] dark:from-[#1E1B4B]/35 dark:via-[#0F172A]/90 dark:to-[#083344]/35 border-b border-violet-100/40 dark:border-slate-800/80 animate-in fade-in duration-300">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </span>
                    <h3 className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-indigo-700 to-cyan-600 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-400">
                      {t.quickTitle}
                    </h3>
                  </div>
                  <p className="text-[11px] font-medium text-slate-505 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                    {t.quickDesc}
                  </p>
                </div>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className="p-1.5 rounded-full bg-white/80 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer shadow-sm transition-all border border-slate-100 dark:border-slate-705"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Options Grid Layout */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Add Wallet Funds - visible after user login */}
                  {user && (
                    <button
                      onClick={() => handleQuickAction('add-wallet-funds')}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/15 hover:to-orange-500/15 border border-amber-500/30 transition-all text-left w-full cursor-pointer group col-span-1 sm:col-span-2 animate-in slide-in-from-bottom duration-300"
                    >
                      <div className="p-3 bg-amber-500/15 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform animate-pulse flex items-center justify-center">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-amber-700 dark:text-amber-400">
                          {t.addWalletFunds} 💰
                        </h4>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                          {t.depositAutomated}
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Option 2: Request Quote */}
                  <button
                    onClick={() => handleQuickAction('request-quote')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850/80 border border-slate-150 dark:border-slate-800/80 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {t.requestQuote}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {language === 'bn' ? 'বাজেট ও রিকোয়ারমেন্ট সাবমিট করুন' : language === 'ar' ? 'طلب تسعيرة دقيقة لمشروعك' : 'Submit custom project requirements'}
                      </p>
                    </div>
                  </button>

                  {/* Option 3: Open Ticket */}
                  <button
                    onClick={() => handleQuickAction('open-ticket')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850/80 border border-slate-150 dark:border-slate-800/80 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {t.openTicket}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {language === 'bn' ? '২৪/৭ ক্লায়েন্ট সাপোর্ট টিকিট পোর্টাল' : language === 'ar' ? 'نظام التذاكر لحل الإشكالات' : '24/7 client helpdesk portal'}
                      </p>
                    </div>
                  </button>

                  {/* Option 4: Contact WhatsApp */}
                  <button
                    onClick={() => handleQuickAction('contact-whatsapp')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10 border border-emerald-500/20 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform animate-pulse">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {t.contactWhatsapp}
                      </h4>
                      <p className="text-[10.5px] text-emerald-500/70 mt-0.5">
                        {language === 'bn' ? 'আমাদের কল সেন্টারে চমৎকার আলাপন' : language === 'ar' ? 'محادثة فورية مع المهندسين' : 'Direct line with technical engineers'}
                      </p>
                    </div>
                  </button>

                  {/* Option 4.5: Solution Page */}
                  <button
                    onClick={() => handleQuickAction('solutions')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850/80 border border-slate-150 dark:border-slate-800/80 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-550 group-hover:scale-110 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {t.solutions}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {language === 'bn' ? 'আমাদের প্রিমিয়াম ডিজিটাল সমাধানসমূহ' : language === 'ar' ? 'حلولنا التقنية والبرمجية المتكاملة' : 'Our custom industrial and enterprise models'}
                      </p>
                    </div>
                  </button>

                  {/* Option 5: View Portfolio */}
                  <button
                    onClick={() => handleQuickAction('view-portfolio')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850/80 border border-slate-150 dark:border-slate-800/80 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {t.viewPortfolio}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {language === 'bn' ? 'আমাদের সেরা প্রজেক্ট গ্যালারি' : language === 'ar' ? 'حافظة المشروعات التي نفذناها' : 'Check out our past production cases'}
                      </p>
                    </div>
                  </button>

                  {/* Option 6: Affiliate Program */}
                  <button
                    onClick={() => handleQuickAction('affiliates')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-650 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Handshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                        {t.affiliates}
                      </h4>
                      <p className="text-[10.5px] text-indigo-500/70 mt-0.5">
                        {language === 'bn' ? 'আমাদের পার্টনার হয়ে কমিশন আয় করুন' : language === 'ar' ? 'اربح عمولات كشريك رسمي معنا' : 'Earn high commissions as an affiliate'}
                      </p>
                    </div>
                  </button>

                  {/* Option 7: Our Blog */}
                  <button
                    onClick={() => handleQuickAction('blog')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850/80 border border-slate-150 dark:border-slate-800/80 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {t.blog}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {language === 'bn' ? 'প্রযুক্তি ও ওয়েবজোনবিডি খবর জানুন' : language === 'ar' ? 'آخر تحديثات التكنولوجيا والمقالات' : 'Latest tech trends and marketplace articles'}
                      </p>
                    </div>
                  </button>

                  {/* Option 8: Client Login */}
                  <button
                    onClick={() => handleQuickAction('client-login')}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/20 transition-all text-left w-full cursor-pointer group"
                  >
                    <div className="p-3 bg-violet-500/10 rounded-xl text-violet-650 dark:text-violet-400 group-hover:scale-110 transition-transform">
                      {user ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {user ? user.name || user.email : t.clientLogin}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {user ? `${t.activeUser} ID: ${user.id?.slice(-6)?.toUpperCase() || 'CLIENT'}` : t.loginDesc}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Additional brand info bottom note */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 text-[10px] text-center leading-relaxed font-mono">
                  ✨ WebzoneBD Core Solutions Hub • Saudi Arabia & Dhaka Tech Support 👨‍💻
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
