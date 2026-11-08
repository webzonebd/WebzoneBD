import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Grid, 
  ShoppingBag, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  Server, 
  Globe, 
  FileText, 
  MessageSquare, 
  PhoneCall, 
  LogIn, 
  LogOut, 
  Layers, 
  Sparkles, 
  Briefcase, 
  Handshake, 
  BookOpen, 
  Wallet, 
  Sun, 
  Moon, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  ArrowUpRight, 
  Check,
  Headphones,
  Zap,
  Tag,
  CreditCard,
  Settings
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
  theme?: 'light' | 'dark';
  onToggleTheme?: (newTheme?: 'light' | 'dark', e?: React.MouseEvent) => void;
  onChangeLanguage?: (lang: 'en' | 'bn' | 'ar') => void;
  onLogout?: () => void;
}

const translations = {
  en: {
    home: "Apps",
    hosting: "Hosting",
    services: "Services",
    store: "Store",
    cart: "Cart",
    menu: "Menu",
    menuTitle: "Menu",
    menuSubtitle: "WebzoneBD Galaxy Hub",
    myAppsAndServices: "My Apps & Services",
    cloudHosting: "Cloud & cPanel Hosting",
    cloudHostingDesc: "High-speed NVMe SSD web servers & cPanel",
    webDev: "Web & Software Development",
    webDevDesc: "Full-stack apps, portals & APIs",
    digitalStore: "Software & Script Store",
    digitalStoreDesc: "Security-verified scripts with fast downloads",
    domainSearch: "Domain Registration",
    domainSearchDesc: "Instant DNS configuration & TLD registration",
    solutions: "Enterprise Solutions",
    solutionsDesc: "High-load architectures & custom digital systems",
    supportAndHelp: "Customer Care & Support",
    whatsappChat: "WhatsApp Live Engineer",
    whatsappChatDesc: "Instant direct chat with technical team",
    openTicket: "Support Ticket Helpdesk",
    openTicketDesc: "24/7 technical incident tracking & tickets",
    requestQuote: "Request Project Quote",
    requestQuoteDesc: "Submit custom requirements for 24h budget estimate",
    faq: "Knowledge Base & FAQ",
    faqDesc: "Instant answers for setup, billing & licenses",
    exclusivePrograms: "Exclusive Programs",
    affiliateProgram: "Affiliate Partnership",
    affiliateDesc: "Earn high recurring commission on referrals",
    techBlog: "Tech Insights & Blog",
    techBlogDesc: "Articles on web frameworks, DevOps & trends",
    portfolio: "Client Case Studies",
    portfolioDesc: "Tour our verified production deliveries",
    preferences: "Preferences & Display",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    signInTitle: "Sign in to WebzoneBD",
    signInDesc: "Manage cloud servers, downloads, invoices & licenses",
    signInBtn: "Sign In / Register",
    dashboardBtn: "Manage Account",
    signOut: "Sign Out",
    wallet: "Wallet",
    orders: "My Orders",
    tickets: "Tickets",
    cartItems: "In Cart",
    addFunds: "Add Funds",
    activeStatus: "Active Member",
    toastQuote: "Opening custom project quote request form.",
    toastTicket: "Opening customer support ticket helpdesk.",
    toastPortfolio: "Navigating to WebzoneBD Premium Portfolios.",
    toastAffiliates: "Navigating to WebzoneBD Affiliates Partnership Program.",
    toastBlog: "Navigating to our latest tech & development blog posts.",
    toastSolutions: "Navigating to WebzoneBD Premium Digital Solutions.",
    badgeNew: "NEW",
    badgeFast: "NVMe",
    badgeLive: "LIVE"
  },
  bn: {
    home: "হোম",
    hosting: "হোস্টিং",
    services: "সার্ভিস",
    store: "স্টোর",
    cart: "কার্ট",
    menu: "মেনু",
    menuTitle: "মেনু",
    menuSubtitle: "ওয়েবজোনবিডি গ্যালাক্সি হাব",
    myAppsAndServices: "আমার অ্যাপস ও সার্ভিস",
    cloudHosting: "ক্লাউড ও সিপ্যানেল হোস্টিং",
    cloudHostingDesc: "উচ্চগতির এনভিএমই এসএসডি ওয়েব সার্ভার",
    webDev: "ওয়েব ও কাস্টম সফটওয়্যার",
    webDevDesc: "ফুলস্ট্যাক পোর্টাল, সাইট ও ব্যাকএন্ড সিস্টেম",
    digitalStore: "সফটওয়্যার ও স্ক্রিপ্ট স্টোর",
    digitalStoreDesc: "যাচাইকৃত প্রিমিয়াম কোড ও তাত্ক্ষণিক ডাউনলোড",
    domainSearch: "ডোমেন রেজিস্ট্রেশন",
    domainSearchDesc: "ইনস্ট্যান্ট ডিএনএস সেটআপ ও সুরক্ষা",
    solutions: "এন্টারপ্রাইজ ডিজিটাল সলিউশন",
    solutionsDesc: "বৃহৎ প্রজেক্টের আধুনিক ক্লাউড আর্কিটেকচার",
    supportAndHelp: "গ্রাহক সেবা ও সহায়তা",
    whatsappChat: "হোয়াটসঅ্যাপ সরাসরি সাপোর্ট",
    whatsappChatDesc: "ইঞ্জিনিয়ারদের সাথে সরাসরি কথা বলুন",
    openTicket: "২৪/৭ সাপোর্ট টিকেট পোর্টাল",
    openTicketDesc: "টেকনিক্যাল হেল্প ও রিকোয়েস্ট ট্র্যাকিং",
    requestQuote: "কাস্টম প্রজেক্ট কোটেশন",
    requestQuoteDesc: "প্রয়োজনীয়তা জানিয়ে ২৪ ঘণ্টার মধ্যে বাজেট জানুন",
    faq: "সাধারণ প্রশ্নাবলী (FAQ)",
    faqDesc: "পেমেন্ট, সেটআপ ও লাইসেন্সের দ্রুত সমাধান",
    exclusivePrograms: "বিশেষ প্রোগ্রাম ও মিডিয়া",
    affiliateProgram: "অ্যাফিলিয়েট পার্টনারশিপ",
    affiliateDesc: "রেফার করে আকর্ষণীয় কমিশন উপার্জন করুন",
    techBlog: "টেক ব্লগ ও আপডেট",
    techBlogDesc: "ওয়েব ট্রেন্ড, সাইবার সিকিউরিটি ও ডেভেলপার গাইড",
    portfolio: "সফল ক্লায়েন্ট প্রজেক্ট",
    portfolioDesc: "আমাদের সফল প্রজেক্ট ও লাইভ কেস স্টাডিজ",
    preferences: "সেটিংস ও ডিসপ্লে",
    darkMode: "ডার্ক মোড",
    lightMode: "লাইট মোড",
    language: "ভাষা",
    signInTitle: "ওয়েবজোনবিডিতে লগইন করুন",
    signInDesc: "আপনার সার্ভিস, লাইসেন্স ও অর্ডার দেখতে লগইন করুন",
    signInBtn: "লগইন / রেজিস্টার",
    dashboardBtn: "অ্যাকাউন্ট ড্যাশবোর্ড",
    signOut: "সাইন আউট",
    wallet: "ওয়ালেট",
    orders: "অর্ডার",
    tickets: "টিকেট",
    cartItems: "কার্টে",
    addFunds: "ফান্ড যোগ",
    activeStatus: "সক্রিয় সদস্য",
    toastQuote: "কাস্টম প্রজেক্ট কোটেশন ফর্ম ওপেন করা হচ্ছে।",
    toastTicket: "গ্রাহক সহায়তা টিকেট হেল্পডেস্ক ওপেন করা হচ্ছে।",
    toastPortfolio: "ওয়েবজোনবিডি প্রিমিয়াম পোর্টফোলিওতে পাঠানো হচ্ছে।",
    toastAffiliates: "অ্যাফিলিয়েট পার্টনারশিপ প্রোগ্রামে পাঠানো হচ্ছে।",
    toastBlog: "আমাদের সর্বশেষ ব্লগ পোস্টে পাঠানো হচ্ছে।",
    toastSolutions: "ওয়েবজোনবিডি প্রিমিয়াম ডিজিটাল সলিউশনস পেজে পাঠানো হচ্ছে।",
    badgeNew: "নতুন",
    badgeFast: "NVMe",
    badgeLive: "লাইভ"
  },
  ar: {
    home: "الرئيسية",
    hosting: "استضافة",
    services: "الخدمات",
    store: "المتجر",
    cart: "السلة",
    menu: "القائمة",
    menuTitle: "القائمة",
    menuSubtitle: "مركز خدمات ويب زون بي دي",
    myAppsAndServices: "خدماتي وتطبيقاتي",
    cloudHosting: "الاستضافة السحابية و cPanel",
    cloudHostingDesc: "خوادم فائقة السرعة مع أقراص NVMe SSD",
    webDev: "تطوير وبرمجة المواقع",
    webDevDesc: "تطبيقات ويب متكاملة وأنظمة مخصصة وحلول API",
    digitalStore: "متجر البرمجيات والسكربتات",
    digitalStoreDesc: "سكربتات برمجية مفحوصة برابط تحميل مباشر",
    domainSearch: "تسجيل وحجز النطاقات",
    domainSearchDesc: "إعداد فوري لـ DNS وحماية متقدمة للنطاق",
    solutions: "حلول الشركات والمؤسسات",
    solutionsDesc: "بنية تحتية سحابية متقدمة للأعمال الكبرى",
    supportAndHelp: "خدمة العملاء والدعم الفني",
    whatsappChat: "محادثة فورية مع المهندس واتساب",
    whatsappChatDesc: "تواصل مباشر عبر واتساب مع فريق الدعم",
    openTicket: "نظام تذاكر الدعم الفني",
    openTicketDesc: "متابعة الاستفسارات والبلاغات الفنية 24/7",
    requestQuote: "طلب عرض سعر مخصص",
    requestQuoteDesc: "أرسل متطلبات مشروعك للحصول على تسعيرة خلال 24 ساعة",
    faq: "الأسئلة الشائعة والمساعدة",
    faqDesc: "إجابات فورية عن الفواتير والاشتراكات والترخيص",
    exclusivePrograms: "البرامج الحصرية",
    affiliateProgram: "برنامج الشركاء والعمولة",
    affiliateDesc: "اربح عمولات دورية مجزية من الإحالات",
    techBlog: "المدونة التكنولوجية",
    techBlogDesc: "أحدث المقالات التقنية وتطوير البرمجيات",
    portfolio: "معرض الأعمال ومشاريع العملاء",
    portfolioDesc: "اطلع على النماذج والمشروعات المنفذة",
    preferences: "الإعدادات والمظهر",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    language: "اللغة",
    signInTitle: "تسجيل الدخول إلى ويب زون بي دي",
    signInDesc: "الوصول إلى لوحة التحكم وخوادمك والمنتجات الرقمية",
    signInBtn: "تسجيل الدخول / حساب جديد",
    dashboardBtn: "لوحة التحكم",
    signOut: "تسجيل الخروج",
    wallet: "المحفظة",
    orders: "طلباتي",
    tickets: "التذاكر",
    cartItems: "في السلة",
    addFunds: "إضافة رصيد",
    activeStatus: "عضو نشط",
    toastQuote: "جاري فتح نموذج طلب عرض السعر المخصص للأنشطة.",
    toastTicket: "جاري فتح نظام تذاكر الدعم الفني وخدمة العملاء.",
    toastPortfolio: "جاري الانتقال لمعرض أعمال ويب زون بي دي الرقمي.",
    toastAffiliates: "جاري الانتقال إلى برنامج الشركاء في التسويق بالعمولة.",
    toastBlog: "جاري الانتقال لمدونة مقالات تطوير البرمجيات والتقنية.",
    toastSolutions: "جاري الانتقال لصفحة الحلول الرقمية المتميزة.",
    badgeNew: "جديد",
    badgeFast: "سريع",
    badgeLive: "مباشر"
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
  cartCount = 0,
  theme = 'dark',
  onToggleTheme,
  onChangeLanguage,
  onLogout
}: BottomNavigationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const t = translations[language] || translations.en;
  const isRtl = language === 'ar';

  // Prevent background body scroll when Galaxy Store Menu Drawer is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  // Samsung Galaxy Store Signature 6-Tab Navigation Layout (with dedicated Hosting)
  const galaxyNavTabs = [
    { 
      id: 'home', 
      label: t.home, 
      icon: Home,
      pageTarget: 'home'
    },
    { 
      id: 'hosting', 
      label: t.hosting, 
      icon: Server,
      pageTarget: 'hosting'
    },
    { 
      id: 'services', 
      label: t.services, 
      icon: Grid,
      pageTarget: 'services'
    },
    { 
      id: 'marketplace', 
      label: t.store, 
      icon: ShoppingBag,
      pageTarget: 'marketplace'
    },
    { 
      id: 'cart', 
      label: t.cart, 
      icon: ShoppingCart,
      pageTarget: 'cart',
      badgeCount: cartCount
    },
    { 
      id: 'menu', 
      label: t.menu, 
      icon: Menu,
      isMenuTrigger: true
    }
  ];

  const handleTabClick = (tab: typeof galaxyNavTabs[0]) => {
    // Soft tactile feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(8); } catch {}
    }

    if (tab.isMenuTrigger) {
      setIsSheetOpen(prev => !prev);
      return;
    }

    if (isSheetOpen) {
      setIsSheetOpen(false);
    }

    onNavigate(tab.pageTarget || tab.id);
  };

  const handleNavigateFromMenu = (page: string, toastMessage?: string) => {
    setIsSheetOpen(false);
    onNavigate(page);
    if (toastMessage) {
      triggerToast(toastMessage);
    }
  };

  const handleWhatsAppAction = () => {
    setIsSheetOpen(false);
    window.open('https://wa.me/966570511931?text=Hello%20WebzoneBD%20Support%2C%20I%20need%20assistance.', '_blank');
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SAMSUNG GALAXY STORE ONE UI DOCKED BOTTOM NAVIGATION BAR (Compact -35%) */}
      {/* ========================================================================= */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden select-none"
        id="galaxy-store-bottom-bar"
      >
        {/* Ambient Glassmorphism Glow Underlay */}
        <div className="absolute -top-4 inset-x-8 h-6 bg-gradient-to-r from-blue-500/15 via-indigo-500/20 to-cyan-400/15 dark:from-blue-600/20 dark:via-indigo-500/25 dark:to-cyan-400/20 blur-xl pointer-events-none rounded-full" />

        {/* Galaxy Store One UI Docked Container: Precision Profile (-6% height) with Ultra Glassmorphism */}
        <div 
          className="relative w-full bg-white/75 dark:bg-[#070e1e]/75 backdrop-blur-2xl border-t border-white/80 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[0_-6px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-colors duration-300"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2px)'
          }}
        >
          {/* Top Glass Specular Highlight Beam */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 dark:via-cyan-300/40 to-transparent pointer-events-none" />

          {/* 6 Equal Tab Grid with balanced spacing (-6% compact height) */}
          <div className="grid grid-cols-6 items-center px-1.5 pt-0.5 pb-0.5 max-w-md mx-auto relative">
            {galaxyNavTabs.map((tab) => {
              const IconComponent = tab.icon;

              // Determine active state
              let isActive = false;
              if (tab.isMenuTrigger) {
                isActive = isSheetOpen;
              } else if (tab.id === 'cart') {
                isActive = cartOpen && !isSheetOpen;
              } else if (tab.id === 'hosting') {
                isActive = currentPage === 'hosting' && !isSheetOpen;
              } else if (tab.id === 'marketplace') {
                isActive = (currentPage === 'marketplace' || currentPage === 'store') && !isSheetOpen;
              } else if (tab.id === 'services') {
                isActive = (currentPage === 'services' || currentPage === 'domain-search' || currentPage === 'solutions') && !isSheetOpen;
              } else if (tab.id === 'home') {
                isActive = currentPage === 'home' && !isSheetOpen;
              }

              return (
                <button
                  key={tab.id}
                  id={tab.id === 'cart' ? 'nav-item-cart' : `galaxy-nav-tab-${tab.id}`}
                  onClick={() => handleTabClick(tab)}
                  className="relative flex flex-col items-center justify-center py-0 px-0.5 group cursor-pointer focus:outline-none w-full"
                  style={{ minHeight: '35.7px' }}
                >
                  {/* Cart compatibility alias id */}
                  {tab.id === 'cart' && (
                    <span id="mobile-bottom-cart-btn" className="hidden pointer-events-none" aria-hidden="true" />
                  )}

                  {/* Top active specular line tracking the selected tab (Clean solid blue, no gradient) */}
                  {isActive && (
                    <motion.div
                      layoutId="galaxyStoreActiveTopGlow"
                      initial={{ opacity: 0, scaleX: 0.3 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.3 }}
                      className="absolute -top-[3px] w-5 h-[2px] rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]"
                      transition={{
                        type: 'spring',
                        stiffness: 480,
                        damping: 34,
                        mass: 0.65
                      }}
                    />
                  )}

                  {/* Animated Selection Container with Full-Capsule Active Bubble enclosing Icon + Text */}
                  <motion.div
                    animate={
                      isActive 
                        ? { y: -2, scale: 1.02 } 
                        : { y: 0, scale: 1 }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 460,
                      damping: 28,
                      mass: 0.65
                    }}
                    className="relative flex flex-col items-center justify-center w-full px-1 py-0.5 rounded-xl"
                  >
                    {/* Samsung Galaxy Store Glassmorphic Active Pill with premium scale-up and fade transition */}
                    {isActive && (
                      <motion.div
                        layoutId="galaxyStoreActiveGlassPill"
                        initial={{ opacity: 0, scale: 0.84 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.84 }}
                        className="absolute inset-0 rounded-xl bg-blue-600/15 dark:bg-blue-500/25 backdrop-blur-md border border-blue-500/35 dark:border-blue-400/40 shadow-[0_2px_10px_rgba(37,99,235,0.2),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_14px_rgba(59,130,246,0.3),inset_0_1px_2px_rgba(255,255,255,0.18)] -z-10 pointer-events-none"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 28,
                          mass: 0.58
                        }}
                      />
                    )}

                    {/* Icon container with modern kinetic physics */}
                    <motion.div
                      animate={
                        isActive 
                          ? { scale: 1.12, y: -0.5, opacity: 1 } 
                          : { scale: 1, y: 0, opacity: 0.78 }
                      }
                      whileTap={{ scale: 0.82 }}
                      transition={{
                        type: 'spring',
                        stiffness: 480,
                        damping: 25
                      }}
                      className={`relative flex items-center justify-center transition-colors duration-200 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    >
                      <IconComponent 
                        className={`w-[16px] h-[16px] transition-transform duration-200 ${
                          isActive ? 'stroke-[2.3]' : 'stroke-[1.7]'
                        }`}
                      />

                      {/* Galaxy Store Notification Badge for Cart */}
                      {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-2 min-w-[13px] h-[13px] px-0.5 bg-red-600 text-white font-mono text-[7.5px] font-black rounded-full flex items-center justify-center shadow-xs border-[1.5px] border-white dark:border-[#0B1020]"
                        >
                          {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                        </motion.span>
                      )}

                      {/* Menu active dot indicator */}
                      {tab.isMenuTrigger && isSheetOpen && (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 ring-1 ring-white dark:ring-[#0B1020]" />
                      )}
                    </motion.div>

                    {/* One UI Label with premium scale-up & fade transition - INSIDE the active bubble */}
                    <motion.span 
                      initial={false}
                      animate={
                        isActive 
                          ? { scale: 1.06, opacity: 1, y: 0 } 
                          : { scale: 0.92, opacity: 0.72, y: 0 }
                      }
                      transition={{ 
                        type: 'spring', 
                        stiffness: 440, 
                        damping: 25, 
                        mass: 0.5 
                      }}
                      className={`text-[9px] sm:text-[9.5px] tracking-tight mt-0.5 transition-colors duration-200 truncate max-w-[54px] text-center leading-tight ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400 font-extrabold' 
                          : 'text-slate-500 dark:text-slate-400 font-medium'
                      }`}
                    >
                      {tab.label}
                    </motion.span>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. SAMSUNG GALAXY STORE ONE UI MENU DRAWER / BOTTOM SHEET                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSheetOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Backdrop Blur Overlay with Galaxy Store smooth fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsSheetOpen(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
              id="galaxy-store-menu-backdrop"
            />

            {/* Galaxy Store One UI Sheet Container with Ultra Frosted Glassmorphism */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-h-[88vh] bg-neutral-50/90 dark:bg-[#070e1e]/92 backdrop-blur-3xl rounded-t-[32px] border-t border-white/80 dark:border-white/10 shadow-[0_-12px_45px_rgba(0,0,0,0.35)] dark:shadow-[0_-12px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-left"
              id="galaxy-store-menu-drawer"
            >
              {/* Galaxy Store One UI Top Grab Handle Bar */}
              <div 
                onClick={() => setIsSheetOpen(false)}
                className="w-full flex justify-center pt-3 pb-1 cursor-pointer"
              >
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors" />
              </div>

              {/* One UI Header Section with Top Quick Actions */}
              <div className="px-6 pt-2 pb-4 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-[#0B1020]/70 backdrop-blur-md">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{t.menuTitle}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      One UI
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {t.menuSubtitle}
                  </p>
                </div>

                {/* Top Quick Utility Buttons */}
                <div className="flex items-center gap-2">
                  {/* Theme Toggle Button */}
                  {onToggleTheme && (
                    <button
                      type="button"
                      onClick={(e) => onToggleTheme(theme === 'dark' ? 'light' : 'dark', e)}
                      title={theme === 'dark' ? t.lightMode : t.darkMode}
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                      ) : (
                        <Moon className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  )}

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsSheetOpen(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Galaxy Store Content Body */}
              <div 
                className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
              >
                {/* ------------------------------------------------------------- */}
                {/* ONE UI PROFILE / ACCOUNT CARD (Galaxy Store Signature Header) */}
                {/* ------------------------------------------------------------- */}
                <div className="p-4.5 rounded-3xl bg-white dark:bg-[#11172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  {user ? (
                    <div className="space-y-3.5">
                      {/* User Header Details */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#11172A]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                {user.name || user.email?.split('@')[0]}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {user.role === 'admin' ? 'Admin' : t.activeStatus}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate max-w-[210px] mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Sign Out Trigger */}
                        {onLogout && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsSheetOpen(false);
                              onLogout();
                            }}
                            title={t.signOut}
                            className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Galaxy Store Quick Stats Chips */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.setItem('webzone_dashboard_active_tab', 'my-wallet');
                            handleNavigateFromMenu('dashboard');
                          }}
                          className="p-2 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 transition cursor-pointer"
                        >
                          <span className="text-[10px] font-bold text-slate-400 block">{t.wallet}</span>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                            <Wallet className="w-3 h-3" />
                            <span>${user.walletBalance ?? 0}</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            localStorage.setItem('webzone_dashboard_active_tab', 'orders');
                            handleNavigateFromMenu('dashboard');
                          }}
                          className="p-2 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 transition cursor-pointer"
                        >
                          <span className="text-[10px] font-bold text-slate-400 block">{t.orders}</span>
                          <span className="text-xs font-black text-blue-600 dark:text-blue-400 mt-0.5 flex items-center justify-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavigateFromMenu('cart')}
                          className="p-2 rounded-2xl bg-purple-500/5 hover:bg-purple-500/10 dark:bg-purple-500/10 border border-purple-500/20 transition cursor-pointer"
                        >
                          <span className="text-[10px] font-bold text-slate-400 block">{t.cartItems}</span>
                          <span className="text-xs font-black text-purple-600 dark:text-purple-400 mt-0.5 flex items-center justify-center gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            <span>{cartCount}</span>
                          </span>
                        </button>
                      </div>

                      {/* Manage Account Full Pill Button */}
                      <button
                        type="button"
                        onClick={() => handleNavigateFromMenu('dashboard')}
                        className="w-full py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{t.dashboardBtn}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                      </button>
                    </div>
                  ) : (
                    /* Guest View: Galaxy Store Style Prominent Sign In Banner */
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                          <LogIn className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {t.signInTitle}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {t.signInDesc}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSheetOpen(false);
                          onLoginClick('login');
                        }}
                        className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <span>{t.signInBtn}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SECTION 1: MY APPS & SERVICES (Samsung Galaxy Store Apps)     */}
                {/* ------------------------------------------------------------- */}
                <div className="space-y-2">
                  <div className="px-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                      {t.myAppsAndServices}
                    </span>
                    <span className="text-[10px] font-bold text-blue-500">5 Products</span>
                  </div>

                  <div className="rounded-3xl bg-white dark:bg-[#11172A] border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
                    {/* Item 1: Cloud Hosting */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('hosting')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {t.cloudHosting}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
                              {t.badgeFast}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.cloudHostingDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* Item 2: Web & Software Dev */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('services')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.webDev}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.webDevDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* Item 3: Digital Marketplace */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('marketplace')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {t.digitalStore}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono">
                              {t.badgeNew}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.digitalStoreDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* Item 4: Domain Search */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('domain-search')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.domainSearch}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.domainSearchDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* Item 5: Enterprise Solutions */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('solutions', t.toastSolutions)}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.solutions}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.solutionsDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SECTION 2: CUSTOMER CARE & SUPPORT (Galaxy Store Support)     */}
                {/* ------------------------------------------------------------- */}
                <div className="space-y-2">
                  <div className="px-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                      {t.supportAndHelp}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t.badgeLive}</span>
                    </span>
                  </div>

                  <div className="rounded-3xl bg-white dark:bg-[#11172A] border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
                    {/* WhatsApp Live Chat */}
                    <button
                      type="button"
                      onClick={handleWhatsAppAction}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform animate-pulse">
                          <PhoneCall className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {t.whatsappChat}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono">
                              24/7
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.whatsappChatDesc}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0" />
                    </button>

                    {/* Support Ticket */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('contact', t.toastTicket)}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.openTicket}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.openTicketDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* Request Quote */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('contact', t.toastQuote)}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.requestQuote}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.requestQuoteDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* FAQ */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('faq')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.faq}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.faqDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-800 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SECTION 3: EXCLUSIVE PROGRAMS & MEDIA                         */}
                {/* ------------------------------------------------------------- */}
                <div className="space-y-2">
                  <div className="px-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                      {t.exclusivePrograms}
                    </span>
                  </div>

                  <div className="rounded-3xl bg-white dark:bg-[#11172A] border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
                    {/* Affiliate Program */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('affiliate', t.toastAffiliates)}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Handshake className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.affiliateProgram}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.affiliateDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* Tech Blog */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('blog', t.toastBlog)}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.techBlog}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.techBlogDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    {/* Portfolio */}
                    <button
                      type="button"
                      onClick={() => handleNavigateFromMenu('portfolio', t.toastPortfolio)}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {t.portfolio}
                          </span>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {t.portfolioDesc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SECTION 4: PREFERENCES & SETTINGS (One UI Device Controls)    */}
                {/* ------------------------------------------------------------- */}
                <div className="space-y-2">
                  <div className="px-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                      {t.preferences}
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white dark:bg-[#11172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3.5">
                    {/* Language Switcher */}
                    {onChangeLanguage && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span>{t.language}</span>
                        </div>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-[11px] font-bold">
                          {(['en', 'bn', 'ar'] as const).map((lang) => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => onChangeLanguage(lang)}
                              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                                language === lang
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {lang === 'en' ? 'EN' : lang === 'bn' ? 'বাং' : 'عربي'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dark Mode Toggle */}
                    {onToggleTheme && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                          {theme === 'dark' ? (
                            <Moon className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-500" />
                          )}
                          <span>{theme === 'dark' ? t.darkMode : t.lightMode}</span>
                        </div>

                        {/* One UI Switch */}
                        <button
                          type="button"
                          onClick={(e) => onToggleTheme(theme === 'dark' ? 'light' : 'dark', e)}
                          className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 flex items-center cursor-pointer ${
                            theme === 'dark' ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="w-4.5 h-4.5 rounded-full bg-white shadow-sm flex items-center justify-center"
                          >
                            {theme === 'dark' ? (
                              <Moon className="w-2.5 h-2.5 text-blue-600" />
                            ) : (
                              <Sun className="w-2.5 h-2.5 text-amber-500" />
                            )}
                          </motion.div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Galaxy Store Branding Card */}
                <div className="p-4 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>WebzoneBD Galaxy Experience</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    Official Mobile Hub • Saudi Arabia & Dhaka Cloud Infrastructure
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
