import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Sun, Moon, ShoppingBag, User, Settings, 
  Menu, X, Trash2, Tag, Percent, ArrowRight, ShieldCheck,
  Smartphone, UserCheck, Key, LogOut, ArrowRightLeft,
  ChevronDown, ChevronUp, ChevronRight, Mail, Phone,
  Facebook, Linkedin, Youtube, Search, Code, Server, Sparkles, Layers, Cpu,
  ExternalLink, HelpCircle, Briefcase, Settings2, Laptop, Database, Globe2,
  BookOpen, Heart, Bell, UserPlus, LogIn, Coins,
  Star, Bot, MessageSquare, Flame, CheckCircle, Users, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme, CartItem, Coupon, UserSession, Currency, Product } from '../types';
import { sampleCoupons, sampleProducts } from '../data';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cart: CartItem[];
  removeFromCart: (index: number) => void;
  applyCouponToCart: (couponCode: string) => string | null;
  resetCart: () => void;
  addSimulatedOrder: (method: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  userEmail: string;
  user: UserSession | null;
  onLogout: () => void;
  onLoginClick: (view?: 'login' | 'register', role?: 'customer' | 'affiliate') => void;
  onLoginSuccess?: (user: UserSession) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  setSearchTerm?: (val: string) => void;
  wishlist: string[];
  toggleWishlist?: (productId: string) => void;
  addToCart?: (product: Product) => void;
  currencySettings?: any;
  setCurrencySettings?: (settings: any) => void;
  triggerToast: (msg: string) => void;
  cartOpen?: boolean;
  setCartOpen?: (open: boolean) => void;
}

export default function Header({
  language,
  setLanguage,
  theme,
  setTheme,
  cart,
  removeFromCart,
  applyCouponToCart,
  resetCart,
  addSimulatedOrder,
  currentPage,
  setCurrentPage,
  isAdmin,
  setIsAdmin,
  userEmail,
  user,
  onLogout,
  onLoginClick,
  onLoginSuccess,
  currency,
  setCurrency,
  setSearchTerm,
  wishlist = [],
  toggleWishlist,
  addToCart,
  currencySettings,
  setCurrencySettings,
  triggerToast,
  cartOpen: propCartOpen,
  setCartOpen: propSetCartOpen
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localCartOpen, setLocalCartOpen] = useState(false);
  const cartOpen = propCartOpen !== undefined ? propCartOpen : localCartOpen;
  const setCartOpen = propSetCartOpen !== undefined ? propSetCartOpen : setLocalCartOpen;
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);

  // Premium Mega Menu States
  const [navDomainQuery, setNavDomainQuery] = useState('');
  const [navDomainTld, setNavDomainTld] = useState('.com');
  const [aiMenuInput, setAiMenuInput] = useState('');
  const [aiMenuResponse, setAiMenuResponse] = useState<string>('Welcome to WebzoneBD AI assistant! Choose a preset prompt below or type your query...');
  const [aiMenuLoading, setAiMenuLoading] = useState(false);

  const handleNavDomainSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navDomainQuery.trim()) {
      triggerToast(language === 'bn' ? 'দয়া করে একটি ডোমেইন নাম লিখুন' : 'Please insert a domain name');
      return;
    }
    const cleanSld = navDomainQuery.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
    const cleanTld = navDomainTld;
    triggerToast(language === 'bn' ? 'আপনাকে WHMCS ডোমেন নিবন্ধন এ রিডাইরেক্ট করা হচ্ছে...' : 'Redirecting you to WHMCS Domain Registration...');
    setTimeout(() => {
      window.location.href = `https://host.webzonebd.com/cart.php?a=add&domain=register&sld=${cleanSld}&tld=${cleanTld}`;
    }, 1000);
  };

  const triggerAiMenuConsultation = (topicKey: string) => {
    setAiMenuLoading(true);
    setAiMenuResponse(language === 'bn' ? 'বিশ্লেষণ করা হচ্ছে...' : 'Analyzing server parameters...');
    setTimeout(() => {
      let ans = '';
      if (topicKey === 'bdix') {
        ans = language === 'bn' 
          ? '🚀 BDIX হোস্টিংয়ে ডাটা সরাসরি ঢাকা ডেটা-সেন্টার দিয়ে রাউট হয়, যার ফলে বাংলাদেশের ভিজিটরদের জন্য সাইট লোড স্পিড ১০ গুন বৃদ্ধি পায় এবং ৫ মিলি-সেকেন্ডের কম ল্যাটেন্সি পাওয়া যায়!'
          : '🚀 BDIX Hosting routes local visitor traffic straight through Dhaka internet exchange points. This reduces latency to under 5ms, making website operations 10x faster!';
      } else if (topicKey === 'plan') {
         ans = language === 'bn'
          ? '🌟 নতুন ব্লগ ও ওয়ার্ডপ্রেসের জন্য BDIX Shared Starter বা Business প্ল্যানটি দারুণ। বড় কাস্টম বা ইকমার্স সাইটের জন্য dedicated VPS Host সলিউশন সম্পূর্ণ আদর্শ।'
          : '🌟 For standard WordPress/Laravel apps, our BDIX Shared Business or Premium SSD plans work best. For busy automated portals, BDIX Managed VPS gives dedicated cores.';
      } else if (topicKey === 'migrate') {
         ans = language === 'bn'
          ? '📦 আমরা সম্পূর্ণ ফ্রিতে আগের হোস্টিং থেকে সব ডাটা জিরো ডাউনটাইমে আমাদের ক্লাউড সিস্টেমে স্থানান্তর করে থাকি। সার্ভার অর্ডারের পর ক্লায়েন্ট প্যানেলে জাস্ট একটি টিকেট খুলুন!'
          : '📦 We provide 100% free migration of your previous cPanel backup directly into our high-performance BDIX cloud with zero downtime. Just open a ticket!';
      }
      setAiMenuResponse(ans);
      setAiMenuLoading(false);
      triggerToast(language === 'bn' ? 'এজেন্ট উত্তর সফল!' : 'Webzone AI replied successfully!');
    }, 500);
  };

  const handleAiMenuCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMenuInput.trim()) return;
    setAiMenuLoading(true);
    setAiMenuResponse(language === 'bn' ? 'অনুসন্ধান করা হচ্ছে...' : 'Scanning database indices...');
    const query = aiMenuInput.toLowerCase();
    setTimeout(() => {
      let ans = '';
      if (query.includes('hosting') || query.includes('হোস্টিং') || query.includes('server')) {
        ans = language === 'bn' ? '💡 আমরা Webzone BDIX NVMe SSD Shared Hosting সাজেস্ট করি যা মাত্র ৳৯৯/মাস থেকে শুরু!' : '💡 We highly recommend our ultra-fast BDIX NVMe SSD Shared plans starting from ৳99/mo with LiteSpeed cache!';
      } else if (query.includes('domain') || query.includes('ডোমেইন')) {
        ans = language === 'bn' ? '💡 আপনি আমাদের সার্চ বক্স দিয়ে যেকোনো ডোমেইন রেজিস্টার করতে পারেন; WHMCS দিয়ে সরাসরি নিরাপদ পেমেন্ট নিশ্চিত করা হয়।' : '💡 You can register popular extensions (.com, .net, .org) directly. Checkout is handled securely via WHMCS.';
      } else if (query.includes('support') || query.includes('সাপোর্ট') || query.includes('help')) {
        ans = language === 'bn' ? '💡 আমরা ২৪/৭ লাইভ হোয়াটসঅ্যাপ এবং কাস্টমার পোর্টাল টিকেট সাপোর্ট প্রদান করে থাকি। যেকোনো জরুরি সার্ভার হেল্পের জন্য নিচে লাইভ চ্যাট করুন!' : '💡 We deliver guaranteed 24/7 technical help over WhatsApp, Client portal, and Hotline. Average ticket response is just 15 minutes!';
      } else {
        ans = language === 'bn' ? '💡 আপনার প্রশ্নের জন্য ধন্যবাদ! অনুগ্রহ করে নিচে থাকা লাইভ সাপোর্ট বাটনে ক্লিক করে সরাসরি আমাদের কাস্টমার এজেন্টের সাথে চ্যাট করুন।' : '💡 Interesting query! For custom developers quotes or manual deployment guides, select our Live WhatsApp Support agent below.';
      }
      setAiMenuResponse(ans);
      setAiMenuInput('');
      setAiMenuLoading(false);
      triggerToast('AI assistance update');
    }, 600);
  };

  const handleLiveSupportClick = () => {
    triggerToast(language === 'bn' ? 'আমাদের ২৪/৭ হোয়াটসঅ্যাপ প্রতিনিধির সাথে যোগাযোগ করা হচ্ছে...' : 'Initiating secure stream with our 24/7 WhatsApp support...');
    setTimeout(() => {
      window.open('https://wa.me/966570511931', '_blank');
    }, 800);
  };
  
  // Right Sidebar Customer Authentication panel states
  const [drawerAuthView, setDrawerAuthView] = useState<'login' | 'register' | 'forgot' | 'otp' | 'reset'>('login');
  const [custEmail, setCustEmail] = useState('');
  const [custPass, setCustPass] = useState('');
  const [custPassConfirm, setCustPassConfirm] = useState('');
  const [custFullName, setCustFullName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custOtpCode, setCustOtpCode] = useState('');
  const [custNewPass, setCustNewPass] = useState('');
  const [authDrawerLoading, setAuthDrawerLoading] = useState(false);
  const [authDrawerError, setAuthDrawerError] = useState('');
  const [authDrawerSuccess, setAuthDrawerSuccess] = useState('');
  const [tempRegUser, setTempRegUser] = useState<UserSession | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutSelectedMethod, setCheckoutSelectedMethod] = useState<string | null>(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileDropdownOpenMobile, setProfileDropdownOpenMobile] = useState(false);
  const [guestDropdownOpenDesktop, setGuestDropdownOpenDesktop] = useState(false);
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRefMobile = useRef<HTMLDivElement>(null);
  const guestDropdownRefDesktop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (profileDropdownRefMobile.current && !profileDropdownRefMobile.current.contains(event.target as Node)) {
        setProfileDropdownOpenMobile(false);
      }
      if (guestDropdownRefDesktop.current && !guestDropdownRefDesktop.current.contains(event.target as Node)) {
        setGuestDropdownOpenDesktop(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('');

  const [desktopLanguageOpen, setDesktopLanguageOpen] = useState(false);
  const [desktopCurrencyOpen, setDesktopCurrencyOpen] = useState(false);

  const [discountAmount, setDiscountAmount] = useState(0);

  // Reset coupon discount when cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      setDiscountAmount(0);
    }
  }, [cart]);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price;
  }, 0);

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    if (!couponCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const errorMsg = applyCouponToCart(couponCode);
    if (errorMsg) {
      setCouponError(errorMsg);
    } else {
      const upper = couponCode.toUpperCase();
      const match = sampleCoupons?.find(c => c.code === upper);
      if (match) {
        setCouponSuccess(`Coupon "${upper}" applied successfully!`);
        setDiscountAmount(subtotal * (match.discountPercent / 100));
      } else {
        if (upper === 'WEBZONE20' || upper === 'SAVE20') {
          setCouponSuccess('Coupon applied successfully! 20% discount applied.');
          setDiscountAmount(subtotal * 0.20);
        } else if (upper === 'WELCOME10') {
          setCouponSuccess('Welcome Coupon applied! 10% discount applied.');
          setDiscountAmount(subtotal * 0.10);
        } else {
          setCouponSuccess('Coupon applied successfully!');
          setDiscountAmount(subtotal * 0.15);
        }
      }
    }
  };

  const handleSimulatePayment = (method: string) => {
    setCheckoutSuccess(true);
    setCheckoutSelectedMethod(method);
    setTimeout(() => {
      addSimulatedOrder(method);
      setCheckoutSuccess(false);
      setCartOpen(false);
      resetCart();
      setDiscountAmount(0);
      setCouponCode('');
      setCouponSuccess(null);
    }, 1500);
  };

  const handleMobileSubitemClick = (item: any, type: 'service' | 'marketplace' | 'solution' | 'hosting') => {
    if (type === 'service') {
      localStorage.setItem('webzone_target_services_tab', 'catalog');
      if (item.title) {
        localStorage.setItem('webzone_services_filter_keyword', item.title);
      }
      window.dispatchEvent(new Event('storage'));
      setCurrentPage('services');
    } else if (type === 'solution') {
      const isSchool = item.title === "School Management" || item.tab === "school";
      localStorage.setItem('webzone_target_solution_tab', isSchool ? 'school' : 'pos');
      window.dispatchEvent(new Event('storage'));
      setCurrentPage('solutions');
    } else if (type === 'marketplace') {
      if (item.keyword) {
        localStorage.setItem('webzone_target_marketplace_search_keyword_cache', item.keyword);
        if (setSearchTerm) {
          setSearchTerm(item.keyword);
        }
      } else if (item.title) {
        localStorage.setItem('webzone_target_marketplace_search_keyword_cache', item.title);
        if (setSearchTerm) {
          setSearchTerm(item.title);
        }
      }
      window.dispatchEvent(new Event('storage'));
      setCurrentPage('marketplace');
    } else if (type === 'hosting') {
      localStorage.setItem('webzone_target_hosting_tab', 'all');
      window.dispatchEvent(new Event('storage'));
      setCurrentPage('hosting');
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown-container')) {
        setDesktopLanguageOpen(false);
      }
      if (!target.closest('.currency-dropdown-container')) {
        setDesktopCurrencyOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Scroll and glassy header tracker
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile navigation exclusive states
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

  // Keep track of active sub-tab for Services internally for active headers syncing
  const [activeServicesTab, setActiveServicesTab] = useState<'catalog' | 'growth-package'>('catalog');

  useEffect(() => {
    const handleStorageChange = () => {
      const currentTab = localStorage.getItem('webzone_services_current_tab_cache') || 'catalog';
      setActiveServicesTab(currentTab as any);
    };

    window.addEventListener('storage', handleStorageChange);
    const timer = setInterval(handleStorageChange, 150);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(timer);
    };
  }, []);

  // Auto Currency Detection Hook is routed centrally inside App.tsx
  useEffect(() => {
    // Sync active currency with default baseline on invalid states
    if (currencySettings && currencySettings.enabled) {
      if (!currencySettings.enabled[currency]) {
        const fall = currencySettings.defaultCurrency || 'USD';
        setCurrency(fall);
      }
    }
  }, [currency, currencySettings, setCurrency]);

  const toggleAccordion = (accordionName: string) => {
    setExpandedAccordion(prev => prev === accordionName ? null : accordionName);
  };

  // Currency utility formatting
  const formatPriceInCart = (usd: number) => {
    let cur = currency;
    let rates = { USD: 1.0, BDT: 118.5, SAR: 3.75 };
    if (currencySettings) {
      rates = currencySettings.rates || rates;
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
        cur = firstEnabled || 'USD';
      }
    }

    const rate = rates[cur] ?? 1.0;
    const converted = usd * rate;

    switch (cur) {
      case 'BDT':
        return `৳ ${Math.round(converted).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${converted.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${converted.toFixed(2)}`;
    }
  };

  // Accordion Items Definitions
  const servicesList = [
    { title: "Web Design & WordPress", titleBn: "🖥️ ওয়েব ডিজাইন ও ওয়ার্ডপ্রেস", titleAr: "🖥️ تصميم المواقع وووردبريس", tab: "web", keyword: "WordPress", icon: "🖥️" },
    { title: "Laravel & Custom Development", titleBn: "⚙️ লারাভেল ও কাস্টম ডেভেলপমেন্ট", titleAr: "⚙️ لارافيل وتطوير البرمجيات", tab: "laravel", keyword: "Laravel", icon: "⚙️" },
    { title: "Digital Marketing & SEO", titleBn: "📈 ডিজিটাল মার্কেটিং ও এসইও", titleAr: "📈 التسويق الرقمي والسيو", tab: "seo", keyword: "SEO", icon: "📈" },
    { title: "E-Commerce Solutions", titleBn: "🛒 ই-কমার্স সলিউশন", titleAr: "🛒 حلول المتاجر الإلكترونية", tab: "ecommerce", keyword: "Ecommerce", icon: "🛒" },
    { title: "Digital Store Gig Services", titleBn: "💼 ডিজিটাল স্টোর গিগ সার্ভিসেস", titleAr: "💼 خدمات جج وفايفر", tab: "gigs", keyword: "Gig", icon: "💼" }
  ];

  const marketplaceList = [
    { title: "Ready Websites", titleBn: "প্রস্তুত ওয়েবসাইট", titleAr: "مواقع جاهزة", keyword: "Web" },
    { title: "WP Themes", titleBn: "ওয়ার্ডপ্রেস থিম", titleAr: "قوالب ووردبريس", keyword: "WordPress" },
    { title: "PHP Scripts", titleBn: "পিএইচপি স্ক্রিপ্টস", titleAr: "سكربتات PHP", keyword: "PHP" },
    { title: "Premium Plugins", titleBn: "প্রিমিয়াম প্লাগিন", titleAr: "إضافات ممتازة", keyword: "Plugin" },
    { title: "Mobile Apps", titleBn: "মোবাইল অ্যাপস", titleAr: "تطبيقات هواتف", keyword: "Mobile App" }
  ];

  const solutionsList = [
    { title: "POS Software", titleBn: "সেলস ও পস পিওএস সিস্টেম", titleAr: "أنظمة البيع والحسابات POS" },
    { title: "School Management", titleBn: "স্কুল ও কলেজ এডুকেশন পোর্টাল", titleAr: "إدارة المدارس والجامعات LMS" }
  ];

  const hostingDomainList = [
    { title: "Domain Registration", titleBn: "ডোমেন রেজিষ্ট্রেশন", titleAr: "حجز نطاقات سريعة" },
    { title: "Shared Hosting", titleBn: "শেয়ার্ড এসএসডি হোস্টিং", titleAr: "استضافات مشتركة سريعة" },
    { title: "Business Hosting", titleBn: "কর্পোরেট বিজনেস হোস্টিং", titleAr: "استضافة شركات وأعمال" },
    { title: "VPS Hosting", titleBn: "ভার্চুয়াল ডেডিকেটেড সার্ভার", titleAr: "خوادم افتراضية خاصة VPS" },
    { title: "Cloud Hosting", titleBn: "হাইব্রিড ক্লাউড হোস্টিং", titleAr: "بنية تحتية سحابية Cloud" },
    { title: "SSL Certificates", titleBn: "নিরাপদ এসএসএল সার্টিফিকেট", titleAr: "شهادات حماية ويب أمان SSL" }
  ];

  // Translations
  const translations = {
    en: {
      services: "Services",
      marketplace: "Digital Store",
      portfolio: "Portfolio",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact",
      cart: "ShoppingCart",
      checkout: "Checkout Now",
      cartEmpty: "Your digital cart is empty",
      discountCode: "Have a support coupon?",
      apply: "Apply",
      subtotal: "Subtotal",
      total: "Total",
      checkoutTitle: "Choose Secured Payment System",
      choosePayment: "Select pay method",
      paySuccess: "Order processed successfully! Check your User Dashboard.",
      adminBtn: "Admin Dashboard",
      userBtn: "Client Dashboard",
      guestLabel: "Client Mode",
      about: "About",
      pricing: "Hosting Tools",
      growthPackage: "Powerful Package",
      hosting: "Hosting",
      hostingShared: "Shared BDIX Hosting",
      hostingSharedDesc: "Supercharged speed optimized for local Bengali visitors.",
      hostingVps: "Managed VPS Hosting",
      hostingVpsDesc: "Dedicated kernel nodes for ultimate application density.",
      hostingReseller: "Reseller Hosting",
      hostingResellerDesc: "White-label servers to kickstart your agency hosting."
    },
    bn: {
      services: "আমাদের সার্ভিসসমূহ",
      marketplace: "ডিজিটাল স্টোর",
      portfolio: "পোর্টফোলিও",
      blog: "ব্লগ ও খবর",
      faq: "প্রশ্নোত্তর",
      contact: "যোগাযোগ",
      cart: "কার্ট ফাইল",
      checkout: "অর্ডার সম্পন্ন করুন",
      cartEmpty: "আপনার ডাউনলোড কার্টটি শূন্য",
      discountCode: "কুপন কোড ব্যবহার করুন",
      apply: "প্রয়োগ",
      subtotal: "সাব-টোটাল",
      total: "সর্বমোট বিল",
      checkoutTitle: "নিরাপদ পেমেন্ট গেটওয়ে সিলেক্ট করুন",
      choosePayment: "পেমেন্ট মাধ্যম বেছে নিন",
      paySuccess: "পেমেন্ট সফল হয়েছে! কাস্টমার ড্যাশবোর্ড চেক করুন।",
      adminBtn: "অ্যাডমিন প্যানেল",
      userBtn: "কাস্টমার ড্যাশবোর্ড",
      guestLabel: "ইউজার মোড",
      about: "আমাদের সম্পর্কে",
      pricing: "হোস্টিং প্ল্যান",
      growthPackage: "পাওয়ারফুল প্যাকেজ",
      hosting: "হোস্টিং",
      hostingShared: "শেয়ার্ড বিডিআইএক্স হোস্টিং",
      hostingSharedDesc: "আমাদের স্থানীয় নেটওয়ার্কের সবচেয়ে শক্তিশালী শেয়ার্ড হোস্টিং।",
      hostingVps: "ম্যানেজড ভিপিএস হোস্টিং",
      hostingVpsDesc: "ভার্চুয়াল ডেডিকেটেড সার্ভার ও উন্নত পারফরম্যান্স সলিউশন।",
      hostingReseller: "রিসেলার হোস্টিং",
      hostingResellerDesc: "হোয়াইট-লেবেল হোস্টিং নিয়ে গড়ে তুলুন আপনার নিজের ব্যবসা।"
    },
    ar: {
      services: "خدماتنا",
      marketplace: "المتجر الرقمي",
      portfolio: "الأعمال السابقة",
      blog: "المدونات والأخبار",
      faq: "الأسئلة الشائعة",
      contact: "اتصل بنا",
      cart: "سلة المشتريات",
      checkout: "إتمام الدفع الآمن",
      cartEmpty: "السلة الرقمية فارغة حالياً",
      discountCode: "هل لديك كود كوبون خصم؟",
      apply: "تطبيق الخصم",
      subtotal: "المجموع الفرعي",
      total: "المجموع الكلي",
      checkoutTitle: "اختر بوابة الدفع الآمنة المعالجة",
      choosePayment: "اختر طريقة السداد الرخيصة",
      paySuccess: "تم معالجة طلبك بنجاح! يرجى مراجعة لوحة التحكم الخاصة بك.",
      adminBtn: "لوحة تحكم المسؤول",
      userBtn: "حساب العميل",
      guestLabel: "نمط الزائر",
      about: "معلومات عنا",
      pricing: "أدوات السيرفر",
      growthPackage: "الباقة المتكاملة",
      hosting: "الاستضافة",
      hostingShared: "استضافة BDIX المشتركة",
      hostingSharedDesc: "استضافات مدعومة بالسرعات المحلية الاستثنائية.",
      hostingVps: "خوادم VPS المدارة كاملة",
      hostingVpsDesc: "خوادم افتراضية مخصصة للأداء العالي وتطبيقات الويب.",
      hostingReseller: "موزع استضافة",
      hostingResellerDesc: "استضافة موزع موثوقة للبدء في مشروعك الخاص."
    }
  };
  const t = translations[language] || translations.en;

  return (
    <>
      {/* Top Header Bar (Height: 40px) */}
      <div className="h-10 border-b border-white/5 bg-gradient-to-r from-[#201040] via-[#110D2C] to-[#09051B] text-white/90 text-xs font-semibold select-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Side Info */}
          <div className="flex items-center gap-5">
            <a 
              href="mailto:info@webzonebd.com" 
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-150"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span className="hidden sm:inline">info@webzonebd.com</span>
            </a>
            <a 
              href="https://wa.me/966570511931" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors duration-150"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">WhatsApp: +966 570511931</span>
            </a>
            <a 
              href="https://www.webzonebd.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden lg:flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-150"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>www.webzonebd.com</span>
            </a>
          </div>

          {/* Right Side Tools & Social */}
          <div className="flex items-center gap-4">
            {/* Social Network Icons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-500 dark:hover:text-cyan-400 transition duration-150 p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-md"
                aria-label="Facebook Profile Link"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-600 dark:hover:text-cyan-450 transition duration-150 p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-md"
                aria-label="LinkedIn Profile Link"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-rose-500 transition duration-150 p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-md"
                aria-label="YouTube Channel Profile"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="hidden sm:block w-px h-3 bg-neutral-200 dark:bg-neutral-800" />

            {/* Language Switcher */}
            <div className="relative language-dropdown-container">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopLanguageOpen(!desktopLanguageOpen);
                  setDesktopCurrencyOpen(false);
                }}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-[11px] font-bold transition duration-155 cursor-pointer select-none ${
                  desktopLanguageOpen 
                    ? 'border-blue-500 bg-blue-50/10 text-blue-600 dark:text-cyan-400' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{language === 'bn' ? 'বাংলা 🇧🇩' : language === 'ar' ? 'العربية 🇸🇦' : 'English 🇺🇸'}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${desktopLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`absolute right-0 top-full mt-1.5 w-32 origin-top-right rounded-xl border bg-white dark:bg-neutral-950 shadow-2xl transition-all duration-150 z-50 border-neutral-200/60 dark:border-neutral-800 p-1 space-y-0.5 ${
                  desktopLanguageOpen 
                    ? 'scale-100 opacity-100 visible pointer-events-auto' 
                    : 'scale-95 opacity-0 invisible pointer-events-none'
                }`}
              >
                <button 
                  onClick={() => {
                    setLanguage('en');
                    setDesktopLanguageOpen(false);
                  }} 
                  className={`w-full flex justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    language === 'en' 
                      ? 'bg-blue-600 text-white font-black' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300'
                  }`}
                >
                  English
                </button>
                <button 
                  onClick={() => {
                    setLanguage('bn');
                    setDesktopLanguageOpen(false);
                  }} 
                  className={`w-full flex justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    language === 'bn' 
                      ? 'bg-blue-600 text-white font-black' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300'
                  }`}
                >
                  বাংলা
                </button>
                <button 
                  onClick={() => {
                    setLanguage('ar');
                    setDesktopLanguageOpen(false);
                  }} 
                  className={`w-full flex justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    language === 'ar' 
                      ? 'bg-blue-600 text-white font-black' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Currency Switcher Dropdown (Respects admin activation state toggle settings) */}
            <div className="relative currency-dropdown-container">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopCurrencyOpen(!desktopCurrencyOpen);
                  setDesktopLanguageOpen(false);
                }}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-[11px] font-mono font-black transition duration-155 cursor-pointer select-none ${
                  desktopCurrencyOpen
                    ? 'border-blue-500 bg-blue-50/10 text-blue-600 dark:text-cyan-400'
                    : 'border-neutral-300 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <span>{currency === 'BDT' ? '🇧🇩 ৳ BDT' : currency === 'SAR' ? '🇸🇦 ﷼ SAR' : '🇺🇸 $ USD'}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-205 ${desktopCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`absolute right-0 top-full mt-1.5 w-36 origin-top-right rounded-xl border bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl shadow-2xl transition-all duration-200 z-50 border-neutral-200/80 dark:border-neutral-800 p-1.5 space-y-1 ${
                  desktopCurrencyOpen 
                    ? 'scale-100 opacity-100 visible pointer-events-auto' 
                    : 'scale-95 opacity-0 invisible pointer-events-none'
                }`}
              >
                {(['USD', 'BDT', 'SAR'] as Currency[]).filter(cur => {
                  if (currencySettings && currencySettings.enabled) {
                    return currencySettings.enabled[cur];
                  }
                  return true;
                }).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      setCurrency(cur);
                      setDesktopCurrencyOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-black rounded-lg cursor-pointer transition text-left select-none ${
                      currency === cur 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-555 text-white font-black shadow' 
                        : 'hover:bg-neutral-150/80 dark:hover:bg-neutral-900/80 text-slate-700 dark:text-neutral-300'
                    }`}
                  >
                    <span>{cur === 'BDT' ? '🇧🇩 BDT' : cur === 'SAR' ? '🇸🇦 SAR' : '🇺🇸 USD'}</span>
                    <span className="text-[10px] font-mono font-normal opacity-85">{cur === 'BDT' ? '৳' : cur === 'SAR' ? 'ر.س' : '$'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Main Header - Sticky Navigation (Height: 64px) */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-md bg-white/90 dark:bg-neutral-950/90 shadow-lg border-b border-neutral-200/80 dark:border-neutral-850/80' 
          : 'bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LEFT: Logo area */}
            <div 
              className="flex items-center space-x-1.5 md:space-x-2 cursor-pointer select-none shrink-0"
              onClick={() => setCurrentPage('home')}
              id="header-nav-logo"
            >
              <div className="p-1.5 md:p-2 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl text-white shadow-lg shadow-blue-500/20 hover:scale-[1.03] transition duration-200">
                <Globe className="h-4 w-4 md:h-5 md:w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-left font-sans">
                <span className="text-sm md:text-[16px] font-black tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                  WebzoneBD
                </span>
                <span className="text-[7.5px] md:text-[8.5px] uppercase tracking-widest font-mono text-neutral-500 dark:text-neutral-450 font-black">
                  IT Solution
                </span>
              </div>
            </div>

            {/* CENTER: Main Navigation Menu with hover-triggered luxurious Mega Menus */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5" aria-label="Desktop Navigation">
              
              {/* Home Link */}
              <button
                className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 cursor-pointer ${
                  currentPage === 'home'
                    ? 'bg-blue-50 dark:bg-neutral-900/60 text-blue-600 dark:text-cyan-400 font-extrabold'
                    : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                }`}
                onClick={() => {
                  setCurrentPage('home');
                  if (setIsAdmin) setIsAdmin(false);
                }}
              >
                {language === 'bn' ? "হোম" : language === 'ar' ? "الرئيسية" : "Home"}
              </button>

              {/* Mega Menu: Hosting */}
              <div className="relative group/menu-hosting">
                <button
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                    currentPage === 'hosting'
                      ? 'bg-blue-50 dark:bg-neutral-900/60 text-blue-600 dark:text-cyan-400 font-extrabold'
                      : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                  }`}
                  onClick={() => {
                    localStorage.setItem('webzone_target_hosting_tab', 'bdix');
                    window.dispatchEvent(new Event('storage'));
                    setCurrentPage('hosting');
                  }}
                >
                  <span>Hosting</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-250 group-hover/menu-hosting:rotate-180" />
                </button>

                {/* Hosting Mega Menu Box - 1200px ultra modern glassmorphic card */}
                <div className="absolute left-1/2 -translate-x-[40%] top-full pt-3 w-[1000px] lg:w-[1100px] xl:w-[1150px] opacity-0 invisible group-hover/menu-hosting:opacity-100 group-hover/menu-hosting:visible transition-all duration-300 transform scale-95 group-hover/menu-hosting:scale-100 p-0 z-55 pointer-events-none group-hover/menu-hosting:pointer-events-auto">
                  <div className="p-6 rounded-[24px] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-[30px] border border-neutral-200/50 dark:border-slate-800/85 grid grid-cols-12 gap-5 text-left shadow-2xl shadow-indigo-500/10">
                    
                    {/* Columns 1 & 2: Main Hosting Products */}
                    <div className="col-span-8 space-y-4">
                      <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#4F46E5] dark:text-cyan-400 border-b border-neutral-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400" />
                        <span>BDIX Cloud Infrastructures</span>
                      </span>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {[
                          { id: 'bdix', title: 'Shared Hosting', desc: 'Secure reliable hosting optimized for Bangladeshi visitors.', badge: 'SAVINGS' },
                          { id: 'bdix', title: 'WordPress Hosting', desc: 'Pre-installed LiteSpeed caching plugins for bloggers.', badge: 'AUTO CACHE' },
                          { id: 'bdix', title: 'Business Hosting', desc: 'Enterprise isolated systems built for online shopping stores.', badge: 'POWER CORES' },
                          { id: 'bdix', title: 'Cloud Hosting', desc: 'High availability instances with real-time automatic failover.', badge: '99.9% Up' },
                          { id: 'reseller', title: 'Reseller Hosting', desc: 'Start a commercial server hosting service utilizing custom corporate name servers.', badge: 'WHM ADMIN' },
                          { id: 'vps', title: 'VPS Hosting', desc: 'Guaranteed AMD Epyc virtual system instances with full root permissions.', badge: 'SSD VPS' },
                          { id: 'vps', title: 'Dedicated Server', desc: 'Top tier physical server configurations for extreme enterprise databases.', badge: 'PHYSICAL' }
                        ].map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              localStorage.setItem('webzone_target_hosting_tab', item.id);
                              window.dispatchEvent(new Event('storage'));
                              setCurrentPage('hosting');
                            }}
                            className="group/item flex items-start gap-3 p-2 rounded-xl hover:bg-neutral-150/40 dark:hover:bg-slate-800/40 cursor-pointer transition duration-200"
                          >
                            <div className="p-2.5 bg-indigo-55/10 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 group-hover/item:text-white group-hover/item:bg-[#4F46E5] rounded-xl transition duration-150">
                              <Server className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-neutral-850 dark:text-white flex items-center gap-1.5">
                                <span className="truncate">{item.title}</span>
                                <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-605 dark:text-indigo-300 text-[7px] px-1.5 py-0.5 rounded font-black uppercase shrink-0">{item.badge}</span>
                              </div>
                              <p className="text-[10px] text-neutral-400 dark:text-neutral-450 mt-0.5 line-clamp-1 leading-normal">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 4: Featured Promo & BDIX Hosting Card */}
                    <div className="col-span-4 flex flex-col justify-between p-5 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] text-white relative overflow-hidden shadow-lg shadow-indigo-500/10">
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                      <div className="space-y-4">
                        <div className="bg-white/15 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border border-white/25 w-max">
                          🚀 Premium Hosting
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-indigo-100 font-medium">Starting From</p>
                          <h4 className="text-xl font-black">$2.99/mo</h4>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-2 text-[10.5px]">
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Free SSL Certificate</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10.5px]">
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Daily Cloud Backup</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          localStorage.setItem('webzone_target_hosting_tab', 'bdix');
                          window.dispatchEvent(new Event('storage'));
                          setCurrentPage('hosting');
                        }}
                        className="mt-6 w-full py-2 bg-white text-indigo-600 hover:bg-neutral-50 rounded-xl text-xs font-black tracking-wide text-center transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Deploy Server Now
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Mega Menu: Services */}
              <div className="relative group/menu-services">
                <button
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                    currentPage === 'services'
                      ? 'bg-blue-50 dark:bg-neutral-900/60 text-blue-600 dark:text-cyan-400 font-extrabold'
                      : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                  }`}
                  onClick={() => {
                    localStorage.setItem('webzone_target_services_tab', 'all');
                    window.dispatchEvent(new Event('storage'));
                    setCurrentPage('services');
                  }}
                >
                  <span>{t.services}</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-250 group-hover/menu-services:rotate-180" />
                </button>

                <div className="absolute left-1/2 -translate-x-[45%] top-full pt-3 w-[1120px] lg:w-[1200px] opacity-0 invisible group-hover/menu-services:opacity-100 group-hover/menu-services:visible transition-all duration-300 transform scale-95 group-hover/menu-services:scale-100 p-0 z-55 pointer-events-none group-hover/menu-services:pointer-events-auto flex">
                  <div className="p-6 rounded-[24px] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-[30px] border border-neutral-200/50 dark:border-slate-800/85 w-full text-left shadow-2xl shadow-indigo-500/10">
                    
                    <div className="grid grid-cols-5 gap-5">
                      {/* Column 1: 🖥️ Web Design & WordPress */}
                      <div className="space-y-3">
                        <span className="text-[10.5px] uppercase font-sans font-black tracking-wide text-blue-600 dark:text-cyan-405 border-b border-neutral-150 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <span>🖥️</span>
                          <span>{language === 'bn' ? 'ওয়েব ডিজাইন ও ওয়ার্ডপ্রেস' : language === 'ar' ? 'تصميم المواقع وووردبريس' : 'Web Design & WordPress'}</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'WordPress sites', titleBn: 'ওয়ার্ডপ্রেস সাইট', titleAr: 'مواقع ووردبريس', desc: 'Custom blogs & portal configurations.', descBn: 'পোর্টাল ও কাস্টম ওয়ার্ডপ্রেস ডিজাইন', descAr: 'بوابات ومواقع ووردبريس احترافية', tab: 'web' },
                            { title: 'Framer & Webflow', titleBn: 'ফ্রেমার ও ওয়েবফ্লো', titleAr: 'فريمر وويب فلو', desc: 'Pixel-perfect vector designs.', descBn: 'পিক্সেল-পারফেক্ট কাস্টম ভেক্টর ল্যান্ডিং', descAr: 'صفحات هبوط فريمر متجاوبة', tab: 'web' },
                            { title: 'UI/UX Prototypes', titleBn: 'ইউআই/ইউএক্স প্রোটোটাইপ', titleAr: 'واجهات وتجربة المستخدم', desc: 'Figma wireframes & mockups.', descBn: 'ফিগোমা লেআউট ও রেসপন্সিভ ডিজাইন', descAr: 'نماذج فيجما للتطبيقات والمواقع', tab: 'web' },
                            { title: 'Corporate Websites', titleBn: 'কর্পোরেট ওয়েবসাইটস', titleAr: 'المواقع التعريفية للشركات', desc: 'High-converting agency layouts.', descBn: 'উচ্চ কনভার্সন বিজনেস লেআউট', descAr: 'تصميم مواقع شركات متميزة', tab: 'web' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                localStorage.setItem('webzone_target_services_tab', 'all');
                                localStorage.setItem('webzone_services_filter_keyword', item.title);
                                window.dispatchEvent(new Event('storage'));
                                setCurrentPage('services');
                              }}
                              className="p-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-[11.5px] font-black text-neutral-850 dark:text-white leading-tight">{language === 'bn' ? item.titleBn : language === 'ar' ? item.titleAr : item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: ⚙️ Laravel & Custom Development */}
                      <div className="space-y-3">
                        <span className="text-[10.5px] uppercase font-sans font-black tracking-wide text-purple-600 dark:text-purple-400 border-b border-neutral-150 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <span>⚙️</span>
                          <span>{language === 'bn' ? 'লারাভেল ও কাস্টম ডেভেলপমেন্ট' : language === 'ar' ? 'لارافيل والبرمجة الخاصة' : 'Laravel & Custom Development'}</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'Laravel Apps', titleBn: 'লারাভেল অ্যাপস', titleAr: 'تطبيقات لارافيل', desc: 'Bespoke secure PHP SaaS engines.', descBn: 'দারুণ সিকিউরড পিএইচপি ওয়েব অ্যাপ্লিকেশন', descAr: 'أنظمة ويب مخصصة وسحابية', tab: 'web' },
                            { title: 'Custom CMS Systems', titleBn: 'কাস্টম সিএমএস', titleAr: 'لوحات تحكم مخصصة', desc: 'Tailored admin system portals.', descBn: 'ব্যবসায়িক ড্যাশবোর্ড ও কাস্টম প্যানেল', descAr: 'برمجة أنظمة إدارة محتوى مخصصة', tab: 'web' },
                            { title: 'Database Architectures', titleBn: 'ডাটাবেস আর্কিটেকচার', titleAr: 'قواعد البيانات المعقدة', desc: 'Complex PostgreSQL/MySQL.', descBn: 'তথ্যাদি ডাটাبهস সুরক্ষিত ডিজাইন', descAr: 'تصميم قواعد بيانات متطورة', tab: 'web' },
                            { title: 'REST API Systems', titleBn: 'রেস্ট এপিআই সলিউশন', titleAr: 'ربط الأنظمة وتطوير API', desc: 'Secure backend bridges.', descBn: 'নিরাপদ ব্যাকএন্ড এপিআই কানেক্টিভিটি', descAr: 'بناء واجهات برمجية آمنة', tab: 'web' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                localStorage.setItem('webzone_target_services_tab', 'all');
                                localStorage.setItem('webzone_services_filter_keyword', item.title);
                                window.dispatchEvent(new Event('storage'));
                                setCurrentPage('services');
                              }}
                              className="p-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-[11.5px] font-black text-neutral-850 dark:text-white leading-tight">{language === 'bn' ? item.titleBn : language === 'ar' ? item.titleAr : item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 3: 📈 Digital Marketing & SEO */}
                      <div className="space-y-3">
                        <span className="text-[10.5px] uppercase font-sans font-black tracking-wide text-emerald-600 dark:text-emerald-400 border-b border-neutral-150 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <span>📈</span>
                          <span>{language === 'bn' ? 'ডিজিটাল মার্কেটিং ও এসইও' : language === 'ar' ? 'التسويق الرقمي والسيو' : 'Digital Marketing & SEO'}</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'Technical Search SEO', titleBn: 'টেকনিক্যাল সার্চ এসইও', titleAr: 'سيو تقني متقدم', desc: 'Rank high on Google Search indices.', descBn: 'সার্চ ইঞ্জিনের প্রথম পেজে নিয়ে আসার কাজ', descAr: 'تحسين الأرشفة والظهور بجوجل', tab: 'seo' },
                            { title: 'Social Campaigns', titleBn: 'সোশ্যাল ক্যাম্পেইনস', titleAr: 'حملات التواصل الاجتماعي', desc: 'Facebook, Instagram & Google ads.', descBn: 'টার্গেটেড কাস্টমার ফেসবুক এডস বুস্টিং', descAr: 'إعلانات ممولة فيسبوك وجوجل', tab: 'marketing' },
                            { title: 'Conversion Funnels', titleBn: 'কনভার্সন ফানেল', titleAr: 'أقماع المبيعات والتحليلات', desc: 'Analytics and pixel traffic setup.', descBn: 'পিক্সেল ট্র্যাকিং ও কাস্টমার রিটার্নিং ফানেল', descAr: 'إعداد البيكسل وتتبع الزوار بدقة', tab: 'marketing' },
                            { title: 'Brand Identity Vector', titleBn: 'ব্র্যান্ড আইডেন্টিটি ডিজাইন', titleAr: 'هويات بصرية وشعارات', desc: 'Logos, copywriting, high-end assets.', descBn: 'লোগো ডিজাইন ও প্রিমিয়াম প্রমো ব্যানার', descAr: 'تصميم كتابة إعلانية وشعارات', tab: 'graphics' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                localStorage.setItem('webzone_target_services_tab', 'all');
                                localStorage.setItem('webzone_services_filter_keyword', item.title);
                                window.dispatchEvent(new Event('storage'));
                                setCurrentPage('services');
                              }}
                              className="p-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-[11.5px] font-black text-neutral-850 dark:text-white leading-tight">{language === 'bn' ? item.titleBn : language === 'ar' ? item.titleAr : item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 4: 🛒 E-Commerce Solutions */}
                      <div className="space-y-3">
                        <span className="text-[10.5px] uppercase font-sans font-black tracking-wide text-cyan-600 dark:text-cyan-400 border-b border-neutral-150 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <span>🛒</span>
                          <span>{language === 'bn' ? 'ই-কমার্স সলিউশন' : language === 'ar' ? 'حلول المتاجر الإلكترونية' : 'E-Commerce Solutions'}</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'Single-Vendor Shops', titleBn: 'সিঙ্গেল ভেন্ডর স্টোর', titleAr: 'متاجر تجزئة فردية', desc: 'Digital store with dynamic carts.', descBn: 'পেমেন্ট গেটওয়ে সহ ডাইনামিক স্টোর', descAr: 'متاجر بيع قطاعي بدعم السلات', tab: 'web' },
                            { title: 'Payment Gateways', titleBn: 'পেমেন্ট গেটওয়ে ইন্টিগ্রেশন', titleAr: 'بوابات الدفع الإلكترونية', desc: 'Secure bKash, SSLCommerz, STC Pay.', descBn: 'সহজ পেমেন্ট বিকাশ নগদ ও রকেট গেটওয়ে', descAr: 'تكامل بوابات مدى وفيزا و STC', tab: 'web' },
                            { title: 'Inventory Track Systems', titleBn: 'ইনভেন্টরি ট্র্যাকিং সিস্টেম', titleAr: 'أنظمة إدارة الإنزال والفوائد', desc: 'Automated cataloging & stock.', descBn: 'অটো স্টক বুক ও সেলস ডাটাবেস', descAr: 'إدارة مخزون وفواتير تلقائية', tab: 'web' },
                            { title: 'Multi-Vendor Digital Stores', titleBn: 'মাল্টি-ভেন্ডর ডিজিটাল স্টোর', titleAr: 'منصات تجار متعددين', desc: 'Escrow features & seller dashboards.', descBn: 'একাধিক বিক্রেতা যুক্ত বড় ই-কমার্স পোর্টাল', descAr: 'لوحات منفصلة للتجار والعملاء', tab: 'web' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                localStorage.setItem('webzone_target_services_tab', 'all');
                                localStorage.setItem('webzone_services_filter_keyword', item.title);
                                window.dispatchEvent(new Event('storage'));
                                setCurrentPage('services');
                              }}
                              className="p-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-[11.5px] font-black text-neutral-850 dark:text-white leading-tight">{language === 'bn' ? item.titleBn : language === 'ar' ? item.titleAr : item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 5: 💼 Digital Store Gig Services */}
                      <div className="space-y-3">
                        <span className="text-[10.5px] uppercase font-sans font-black tracking-wide text-amber-600 dark:text-amber-500 border-b border-neutral-150 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <span>💼</span>
                          <span>{language === 'bn' ? 'ডিজিটাল স্টোর গিগ সার্ভিসেস' : language === 'ar' ? 'خدمات جج وفايفر' : 'Digital Store Gig Services'}</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'Bespoke Fix Gigs', titleBn: 'ওয়েবসাইট ফিক্সিং গিগ', titleAr: 'حل المشاكل البرمجية السريعة', desc: 'Hosting faults & firewall repairs.', descBn: 'সার্ভার সমাধান ও সাইট হ্যাকিং রিকভারি', descAr: 'حل مشاكل الاستضافات وحمايتها', tab: 'web' },
                            { title: 'Speed Optimization Gigs', titleBn: 'স্পিড অপ্টিমাইজেশন', titleAr: 'تسريع المواقع وتنظيف الكاش', desc: 'Heavy loading times calibration.', descBn: 'স্লো সাইট ফাস্ট এবং ইমেজ অপ্টিমাইজার', descAr: 'تقليص وقت التحميل وتهيئة الكاش', tab: 'web' },
                            { title: 'WHMCS Automation Setup', titleBn: 'WHMCS সলিউশন', titleAr: 'أتمتة الاستضافات وبوابات WHMCS', desc: 'Dedicated billing codes setup.', descBn: 'অটো হোস্টিং সেলস বিলিং ড্যাশবোর্ড', descAr: 'إعداد أنظمة سداد وفواتير سيرفرات', tab: 'web' },
                            { title: 'Custom Extensions Integration', titleBn: 'কাস্টম প্লাগইন সেটআপ', titleAr: 'تكامل الإضافات والبرمجيات الخاصة', desc: 'Add feature hooks & widgets.', descBn: 'যেকোনো থিমে কাস্টম ফিচার সেটআপ', descAr: 'ربط إضافات برمجية مخصصة للعملاء', tab: 'web' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                localStorage.setItem('webzone_target_services_tab', 'all');
                                localStorage.setItem('webzone_services_filter_keyword', item.title);
                                window.dispatchEvent(new Event('storage'));
                                setCurrentPage('services');
                              }}
                              className="p-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-[11.5px] font-black text-neutral-850 dark:text-white leading-tight">{language === 'bn' ? item.titleBn : language === 'ar' ? item.titleAr : item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Bottom Promo/Submenu row for Premium Landing Pages */}
                    <div className="mt-6 pt-5 border-t border-neutral-200/50 dark:border-slate-800/80 grid grid-cols-3 gap-4">
                      {[
                        { 
                          id: 'digital-web-dev', 
                          title: '🚀 Digital Web Development', 
                          titleBn: '🚀 ডিজিটাল ওয়েব ডেভেলপমেন্ট', 
                          desc: 'SaaS-style professional startup web deployment.', 
                          descBn: 'স্টার্টআপ ও এজেন্সির জন্য প্রিমিয়াম ওয়েব সলিউশন' 
                        },
                        { 
                          id: 'google-business', 
                          title: '📍 Google Business Setup', 
                          titleBn: '📍 গুগল মাই বিজনেস ভেরিফাই', 
                          desc: 'Verify Google Maps location for hyper-local traffic.', 
                          descBn: '১০০% গুগল ম্যাপ লোকেশন ও এসইও অপ্টিমাইজেশন' 
                        },
                        { 
                          id: 'growth-package', 
                          title: '📈 Business Growth Packages', 
                          titleBn: '📈 বিজনেস গ্রোথ প্যাকেজস', 
                          desc: 'Full-suite digital optimization and local marketing.', 
                          descBn: 'ব্যবসা দ্রুত বৃদ্ধি করার আল্টিমেট মার্কেটিং প্যাকেজ' 
                        }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            localStorage.setItem('webzone_target_services_tab', item.id);
                            window.dispatchEvent(new Event('storage'));
                            setCurrentPage('services');
                          }}
                          className="flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50/20 to-indigo-50/25 dark:from-[#1E293B]/45 dark:to-[#0F172A]/50 hover:from-blue-500 hover:to-indigo-600 hover:text-white dark:hover:from-blue-600 dark:hover:to-indigo-700 dark:hover:text-white border border-neutral-150 dark:border-slate-800/80 hover:border-transparent transition-all duration-300 cursor-pointer group shadow-sm"
                        >
                          <div className="space-y-1">
                            <h4 className="text-[12px] font-black text-neutral-850 dark:text-white group-hover:text-white leading-tight">
                              {language === 'bn' ? item.titleBn : item.title}
                            </h4>
                            <p className="text-[10px] text-neutral-400 group-hover:text-cyan-100 leading-snug">
                              {language === 'bn' ? item.descBn : item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>

              {/* Mega Menu: Ready Marketplace */}
              <div className="relative group/menu-marketplace">
                <button
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                    currentPage === 'marketplace'
                      ? 'bg-blue-50 dark:bg-neutral-900/60 text-blue-600 dark:text-cyan-400 font-extrabold'
                      : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                  }`}
                  onClick={() => setCurrentPage('marketplace')}
                >
                  <span>{language === 'bn' ? 'ডিজিটাল স্টোর' : language === 'ar' ? 'المتجر الرقمي' : 'Digital Store'}</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-250 group-hover/menu-marketplace:rotate-180" />
                </button>

                <div className="absolute left-1/2 -translate-x-[45%] top-full pt-3 w-[1000px] lg:w-[1100px] opacity-0 invisible group-hover/menu-marketplace:opacity-100 group-hover/menu-marketplace:visible transition-all duration-300 transform scale-95 group-hover/menu-marketplace:scale-100 p-0 z-55 pointer-events-none group-hover/menu-marketplace:pointer-events-auto">
                  <div className="p-6 rounded-[24px] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-[30px] border border-neutral-200/50 dark:border-slate-800/85 grid grid-cols-12 gap-6 text-left shadow-2xl shadow-indigo-500/10">
                    
                    {/* Columns 1, 2, 3: Marketplace categories */}
                    <div className="col-span-9 grid grid-cols-3 gap-5">
                      {/* Column 1 */}
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#10B981] border-b border-neutral-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <Code className="w-4 h-4 text-[#10B981]" />
                          <span>Pre-made Layouts</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'Themes', desc: 'Secure responsive templates optimized for commercial platforms.' },
                            { title: 'Website Templates', desc: 'Instant standalone components & raw frontend kits.' },
                            { title: 'UI Kits', desc: 'Beautiful design assets, Figma mockups, interactive frames.' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => setCurrentPage('marketplace')}
                              className="p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-xs font-black text-neutral-850 dark:text-white">{item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#2563EB] dark:text-blue-400 border-b border-neutral-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span>Interactive Extensions</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'Plugins', desc: 'Custom CMS hooks, API integrations, payment tunnels.' },
                            { title: 'Scripts', desc: 'Full stack PHP, Node.JS, and native React boilerplates.' },
                            { title: 'Addons', desc: 'Powerful modular components & page builder modifications.' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => setCurrentPage('marketplace')}
                              className="p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-xs font-black text-neutral-850 dark:text-white">{item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#7C3AED] dark:text-purple-400 border-b border-neutral-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>GPL Licenses</span>
                        </span>
                        <div className="space-y-1">
                          {[
                            { title: 'Premium GPL Themes', desc: '100% clean malware-free source code with licensing.' },
                            { title: 'Premium GPL Plugins', desc: 'Fully unlocked features with active code updates.' },
                            { title: 'GPL License Offers', desc: 'Extreme bundles with developer credentials.' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => setCurrentPage('marketplace')}
                              className="p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-800/40 cursor-pointer transition duration-150"
                            >
                              <div className="text-xs font-black text-neutral-850 dark:text-white">{item.title}</div>
                              <p className="text-[9.5px] text-neutral-400 dark:text-neutral-450 mt-0.5 leading-normal">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 4: Premium GPL Feature Promo Card */}
                    <div className="col-span-3 flex flex-col justify-between p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-655 text-white relative overflow-hidden shadow-lg shadow-emerald-500/10">
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                      <div className="space-y-3 relative z-10">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold bg-white/15 px-2 py-0.5 rounded-full border border-white/20 w-fit block">
                          🔥 GPL Hub Sale
                        </span>
                        <h4 className="text-sm font-black leading-snug">Download Premium GPL Themes & Plugins</h4>
                        <p className="text-[10.5px] font-bold text-center bg-white/20 border border-white/20 rounded-lg py-1 px-1.5 font-mono">
                          Starting from $4.99
                        </p>
                      </div>
                      <button 
                        onClick={() => setCurrentPage('marketplace')}
                        className="mt-6 relative z-10 w-full py-2 bg-white text-emerald-600 hover:bg-neutral-50 rounded-lg text-xs font-black tracking-wide text-center transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Browse GPL Inventory
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Portfolio Link */}
              <button
                className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 cursor-pointer ${
                  currentPage === 'portfolio'
                    ? 'bg-blue-50 dark:bg-neutral-900/60 text-blue-600 dark:text-cyan-400 font-extrabold'
                    : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                }`}
                onClick={() => {
                  setCurrentPage('portfolio');
                }}
              >
                Portfolio
              </button>

              {/* Blog Link */}
              <button
                className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 cursor-pointer ${
                  currentPage === 'blog'
                    ? 'bg-blue-50 dark:bg-neutral-900/60 text-blue-600 dark:text-cyan-400 font-extrabold'
                    : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                }`}
                onClick={() => {
                  setCurrentPage('blog');
                }}
              >
                Blog
              </button>
            </nav>

            {/* RIGHT: Theme Toggle, Wishlist, Notifications, Cart, Login, Register, User Account */}
            <div className="flex items-center gap-2 lg:gap-3 shrink-0">
              
              {/* Theme Selector Light / Dark Mode Toggle Icon */}
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 cursor-pointer"
                aria-label="Toggle Theme"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon className="h-4.5 w-4.5 text-blue-600" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
              </button>

              {/* Wishlist Heart Icon & dynamic badge count */}
              <button 
                onClick={() => setWishlistOpen(!wishlistOpen)}
                className="relative p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 cursor-pointer"
                title={`${wishlist.length} item(s) in your Wishlist`}
              >
                <Heart className={`h-4.5 w-4.5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-neutral-500'}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[8px] font-black leading-none text-white bg-rose-500 rounded-full shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Notifications bell icon & static alert panel */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-xl border transition cursor-pointer ${
                    notificationsOpen 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' 
                      : 'border-neutral-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  title="3 system notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-4 h-4 text-[8px] font-black leading-none text-white bg-blue-600 rounded-full">
                    3
                  </span>
                </button>
                
                {/* Notifications Panel Box */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 text-left space-y-3 font-sans text-xs"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">System Alerts</span>
                        <span className="text-[9px] bg-blue-105 text-blue-600 dark:text-cyan-455 font-bold px-1.5 py-0.5 rounded-lg font-mono">Realtime</span>
                      </div>
                      <div className="space-y-2.5 max-h-60 overflow-y-auto w-full">
                        <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg leading-relaxed">
                          <span className="font-extrabold text-[#06B6D4] block mb-0.5 font-mono">🔥 Hot VPS Promotion</span>
                          Dallas virtual servers currently with 50% discount. Migrate today!
                        </div>
                        <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg leading-relaxed">
                          <span className="font-extrabold text-[#0284C7] block mb-0.5 font-mono">🛠️ Webzone Suite 12.5 Core</span>
                          Enterprise code modules optimized for peak database synchronization performance.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Button */}
              <button 
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-blue-500" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-slate-950 bg-cyan-400 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* AUTHENTICATED: Display profile menu toggle to open dropdown */}
              {user ? (
                <div className="relative hidden md:block pl-1.5 border-l border-neutral-200 dark:border-neutral-850" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    style={{ minHeight: '44px' }}
                    className="flex items-center gap-2 p-0.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-108 active:scale-95 focus:outline-none relative group"
                  >
                    {/* Pulsing visual glow ring around avatar */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] opacity-80 blur-[6px] group-hover:opacity-100 group-hover:blur-[10px] transition-all duration-300 pointer-events-none" />
                    
                    {/* Ring edge border animation element */}
                    <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] shadow-[0_0_12px_rgba(139,92,246,0.35)]">
                      <div className="relative w-8.5 h-8.5 rounded-full bg-white dark:bg-[#0F172A] p-[1px] flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt="Premium Customer avatar profile icon" 
                            className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="w-full h-full rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white font-black text-xs flex items-center justify-center uppercase">
                            {user.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Premium pulsing live connection indicator dot */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white dark:border-[#0B1120] flex items-center justify-center animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-3 w-80 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md border border-neutral-200/60 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 overflow-hidden text-left font-sans"
                      >
                        {/* Premium Gradient Customer Header Card */}
                        <div className="p-4 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/10">
                          {/* Ambient background decoration */}
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none animate-pulse-slow" />
                          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/25 rounded-full blur-lg pointer-events-none" />

                          <div className="relative z-10 flex items-center gap-3 text-left">
                            <div className="relative shrink-0 group">
                              <div className="absolute inset-0 rounded-full bg-white/20 opacity-40 blur-sm group-hover:opacity-80 transition-all duration-300" />
                              <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-white/60 to-white/10">
                                <div className="relative rounded-full bg-slate-900/40 backdrop-blur-md p-[1px]">
                                  {user.avatar ? (
                                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover select-none border border-white/10" referrerPolicy="no-referrer" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black uppercase text-[11px] select-none border border-white/15">
                                      {user.name.slice(0, 2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#2563EB] flex items-center justify-center shadow-sm">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-black text-white truncate tracking-tight">{user.name}</h4>
                              <p className="text-[10px] text-cyan-100/90 font-mono truncate mt-0.5">{user.email}</p>
                              <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-emerald-300 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                                👑 PREMIUM CLIENT
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Scrollable Custom Navigation Items with individual aesthetic icons */}
                        <div className="p-2.5 max-h-96 overflow-y-auto space-y-1" id="profile-dropdown-menu-list">
                          {[
                            { id: 'dashboard', label: '👤 Dashboard', labelBn: '👤 ড্যাশবোর্ড' },
                            { id: 'my-orders', label: '📦 My Orders', labelBn: '📦 আমার অর্ডার' },
                            { id: 'downloads', label: '⬇️ Downloads', labelBn: '⬇️ ডাউনলোডস' },
                            { id: 'my-wallet', label: '💰 My Wallet', labelBn: '💰 আমার ওয়ালেট' },
                            { id: 'wishlist', label: '❤️ Wishlist', labelBn: '❤️ উইশলিস্ট' },
                            { id: 'affiliate-program', label: '🤝 Affiliate Program', labelBn: '🤝 এফিলিয়েট প্রোগ্রাম' },
                            { id: 'tickets', label: '🎫 Support Tickets', labelBn: '🎫 সাপোর্ট টিকেট' },
                            { id: 'profile', label: '⚙️ Account Settings', labelBn: '⚙️ অ্যাকাউন্ট সেটিংস' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                localStorage.setItem('webzone_dashboard_active_tab', item.id);
                                setCurrentPage('dashboard');
                                setProfileDropdownOpen(false);
                              }}
                              style={{ minHeight: '38px' }}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-350 hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5]/90 hover:to-[#7C3AED]/90 hover:shadow-lg hover:shadow-indigo-500/10 hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-95"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="group-hover:scale-110 transition-transform duration-300">
                                  {language === 'bn' ? item.labelBn : item.label}
                                </span>
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all animate-none" />
                            </button>
                          ))}
                        </div>

                        {/* Sign Out Section */}
                        <div className="p-2.5 border-t border-neutral-200/65 dark:border-slate-800 bg-neutral-50/60 dark:bg-slate-950/40">
                          <button
                            onClick={() => {
                              onLogout();
                              setProfileDropdownOpen(false);
                            }}
                            style={{ minHeight: '40px' }}
                            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-black text-red-500 hover:bg-red-550/10 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 cursor-pointer text-left active:scale-95 hover:shadow-sm"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>🚪 Logout Client Portal</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2.5 font-sans relative" ref={guestDropdownRefDesktop}>
                  {/* Desktop Guest Man Icon Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setGuestDropdownOpenDesktop(!guestDropdownOpenDesktop)}
                      className="relative h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-blue-600/10 to-cyan-500/10 border border-blue-500/25 text-blue-600 dark:text-cyan-400 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-cyan-550 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center pointer-events-auto"
                      aria-label="Quick Portal Gate"
                      title="Client Area"
                    >
                      <User className="h-4 w-4" />
                      {/* Status Indicator Dot */}
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950 animate-pulse" />
                    </button>

                    <AnimatePresence>
                      {guestDropdownOpenDesktop && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.95 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden text-left font-sans"
                        >
                          {/* Short/Compact Header matching modern Sidebar layout */}
                          <div className="p-3.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/10 text-left">
                            {/* Ambient Background decoration */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse-slow" />
                            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/20 rounded-full blur-md pointer-events-none" />

                            <div className="relative z-10 flex items-center gap-3">
                              {/* Guest Icon */}
                              <div className="relative shrink-0">
                                <div className="p-[2px] rounded-full bg-white/20">
                                  <div className="w-8 h-8 rounded-full bg-slate-900/40 backdrop-blur-md text-white flex items-center justify-center font-bold border border-white/10">
                                    <User className="w-3.5 h-3.5 text-white" />
                                  </div>
                                </div>
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-black text-white truncate tracking-tight">
                                  {language === 'bn' ? 'স্বাগতম ভিজিটর' : 'Welcome, Guest'}
                                </h4>
                                <p className="text-[9.5px] text-cyan-100/90 font-mono truncate mt-0.5">
                                  {language === 'bn' ? 'অ্যাক্সেস করতে লগইন করুন' : 'Login to view account'}
                                </p>
                                <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-cyan-200 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                                  ✨ PORTAL ACTIVE
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Dropdown Options List */}
                          <div className="p-2 py-1.5 space-y-1 bg-white/95 dark:bg-[#0F172A]/95 text-[#0F172A] dark:text-[#F8FAFC]">
                            {/* Option 1: Login */}
                            <button
                              onClick={() => {
                                onLoginClick('login');
                                setGuestDropdownOpenDesktop(false);
                              }}
                              style={{ minHeight: '44px' }}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-750 dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-[#06B6D4] transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-95"
                            >
                              <div className="flex items-center gap-2">
                                <span className="transition-transform group-hover:scale-115">🔐</span>
                                <span>{language === 'bn' ? 'লগইন করুন' : 'Login'}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white" />
                            </button>

                            {/* Option 2: Register */}
                            <button
                              onClick={() => {
                                onLoginClick('register');
                                setGuestDropdownOpenDesktop(false);
                              }}
                              style={{ minHeight: '44px' }}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-750 dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#EC4899] transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-95"
                            >
                              <div className="flex items-center gap-2">
                                <span className="transition-transform group-hover:scale-115">📝</span>
                                <span>{language === 'bn' ? 'নিবন্ধন করুন' : 'Register'}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Mobile Header Quick Actions Layout (Like Techbari.com) */}
              <div className="md:hidden flex items-center gap-1.5">
                {/* Secure Client Area trigger */}
                <div className="relative" ref={profileDropdownRefMobile}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setProfileDropdownOpenMobile(!profileDropdownOpenMobile)}
                        className="relative h-9 w-9 rounded-full bg-gradient-to-tr from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] p-[2px] transition-transform duration-300 hover:scale-108 active:scale-95 cursor-pointer flex items-center justify-center pointer-events-auto"
                      >
                        <div className="relative w-full h-full rounded-full bg-white dark:bg-[#0F172A] p-[1px] flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="Mobile User avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">
                              {user.name ? user.name.slice(0, 2) : 'CL'}
                            </span>
                          )}
                        </div>
                        {/* Status Indicator Dot */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-white dark:border-neutral-950 animate-pulse" />
                      </button>

                      <AnimatePresence>
                        {profileDropdownOpenMobile && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-2 w-72 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-850 rounded-2xl shadow-2xl z-50 overflow-hidden text-left font-sans animate-fade-in"
                          >
                            {/* Profile Info Header */}
                            <div className="p-3.5 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/10 text-left">
                              {/* Ambient background decoration */}
                              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
                              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/25 rounded-full blur-lg pointer-events-none" />

                              <div className="relative z-10 flex items-center gap-3">
                                <div className="relative shrink-0 group">
                                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-40 blur-sm group-hover:opacity-80 transition-all duration-300" />
                                  <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-white/60 to-white/10">
                                    <div className="relative rounded-full bg-slate-900/40 backdrop-blur-md p-[1px]">
                                      {user.avatar ? (
                                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover select-none border border-white/10" referrerPolicy="no-referrer" />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black uppercase text-[11px] select-none border border-white/15">
                                          {user.name.slice(0, 2)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#2563EB] flex items-center justify-center shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-black text-white truncate tracking-tight">{user.name}</h4>
                                  <p className="text-[10px] text-cyan-100/90 font-mono truncate mt-0.5">{user.email}</p>
                                  <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-emerald-300 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                                    👑 PREMIUM MEMBER
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dropdown Navigation Menu */}
                            <div className="p-2 py-1.5 max-h-80 overflow-y-auto space-y-0.5" id="profile-dropdown-menu-list-mobile">
                              {[
                                { id: 'dashboard', label: '👤 Dashboard', labelBn: '👤 ড্যাশবোর্ড' },
                                { id: 'my-orders', label: '📦 My Orders', labelBn: '📦 আমার অর্ডার' },
                                { id: 'downloads', label: '⬇️ Downloads', labelBn: '⬇️ ডাউনলোডস' },
                                { id: 'my-wallet', label: '💰 My Wallet', labelBn: '💰 আমার ওয়ালেট' },
                                { id: 'wishlist', label: '❤️ Wishlist', labelBn: '❤️ উইশলিস্ট' },
                                { id: 'affiliate-program', label: '🤝 Affiliate Program', labelBn: '🤝 এফিলিয়েট প্রোগ্রাম' },
                                { id: 'tickets', label: '🎫 Support Tickets', labelBn: '🎫 সাপোর্ট টিকেট' },
                                { id: 'profile', label: '⚙️ Account Settings', labelBn: '⚙️ অ্যাকাউন্ট সেটিংস' },
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    localStorage.setItem('webzone_dashboard_active_tab', item.id);
                                    setCurrentPage('dashboard');
                                    setProfileDropdownOpenMobile(false);
                                  }}
                                  style={{ minHeight: '38px' }}
                                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-350 hover:text-white hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#7C3AED] transition-all duration-200 cursor-pointer flex items-center justify-between"
                                >
                                  <span>{language === 'bn' ? item.labelBn : item.label}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-55" />
                                </button>
                              ))}
                            </div>

                            {/* Sign Out Section */}
                            <div className="p-2 border-t border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-950/20">
                              <button
                                onClick={() => {
                                  onLogout();
                                  setProfileDropdownOpenMobile(false);
                                }}
                                style={{ minHeight: '38px' }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-black text-red-500 hover:bg-red-550/10 rounded-xl transition cursor-pointer text-left"
                              >
                                <LogOut className="w-3.5 h-3.5 text-red-500" />
                                <span>🚪 Logout Client Portal</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setProfileDropdownOpenMobile(!profileDropdownOpenMobile)}
                        className="relative h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-blue-600/10 to-cyan-500/10 border border-blue-500/25 text-blue-600 dark:text-cyan-450 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-cyan-500 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center pointer-events-auto"
                        aria-label="Quick Portal Gate"
                        title="Client Area"
                      >
                        <User className="h-4 w-4" />
                        {/* Status Indicator Dot */}
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950" />
                      </button>

                      <AnimatePresence>
                        {profileDropdownOpenMobile && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden text-left font-sans"
                          >
                            {/* Short/Compact Header matching modern Sidebar layout */}
                            <div className="p-3.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white relative overflow-hidden border-b border-white/10 text-left">
                              {/* Ambient Background decoration */}
                              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse-slow" />
                              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-400/20 rounded-full blur-md pointer-events-none" />

                              <div className="relative z-10 flex items-center gap-3">
                                {/* Guest Icon */}
                                <div className="relative shrink-0">
                                  <div className="p-[2px] rounded-full bg-white/20">
                                    <div className="w-8 h-8 rounded-full bg-slate-900/40 backdrop-blur-md text-white flex items-center justify-center font-bold border border-white/10">
                                      <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-black text-white truncate tracking-tight">
                                    {language === 'bn' ? 'স্বাগতম ভিজিটর' : 'Welcome, Guest'}
                                  </h4>
                                  <p className="text-[9.5px] text-cyan-100/90 font-mono truncate mt-0.5">
                                    {language === 'bn' ? 'অ্যাক্সেস করতে লগইন করুন' : 'Login to view account'}
                                  </p>
                                  <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase font-mono text-cyan-200 mt-1 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                                    ✨ PORTAL ACTIVE
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dropdown Options List */}
                            <div className="p-2 py-1.5 space-y-1 bg-white/95 dark:bg-[#0F172A]/95 text-[#0F172A] dark:text-[#F8FAFC]">
                              {/* Option 1: Login */}
                              <button
                                onClick={() => {
                                  onLoginClick('login');
                                  setProfileDropdownOpenMobile(false);
                                }}
                                style={{ minHeight: '44px' }}
                                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-750 dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-[#06B6D4] transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-95"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="transition-transform group-hover:scale-115">🔐</span>
                                  <span>{language === 'bn' ? 'লগইন করুন' : 'Login'}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white" />
                              </button>

                              {/* Option 2: Register */}
                              <button
                                onClick={() => {
                                  onLoginClick('register');
                                  setProfileDropdownOpenMobile(false);
                                }}
                                style={{ minHeight: '44px' }}
                                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-750 dark:text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#EC4899] transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-95"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="transition-transform group-hover:scale-115">📝</span>
                                  <span>{language === 'bn' ? 'নিবন্ধন করুন' : 'Registerer'}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-450 opacity-60 group-hover:text-white" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                {/* Mobile hamburger menu toggle */}
                <button
                  className="p-1.5 h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition cursor-pointer flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open Mobile Menu"
                >
                  <Menu className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </header>



      {/* Premium Sliding-from-Left Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-sidebar-system">
            {/* Dark background glass-overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs transition-opacity cursor-pointer duration-300"
            />

            {/* Sliding Drawer element (Width: 85% Screen Width) */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className="relative w-[85%] max-w-[340px] h-full bg-slate-50 dark:bg-[#0F172A] border-r border-neutral-205 dark:border-slate-800 text-neutral-850 dark:text-neutral-100 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Top Row: Logo & Close Toggle */}
              <div className="p-4 border-b border-neutral-200/60 dark:border-slate-800 bg-white dark:bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-between">
                <div 
                  className="flex items-center space-x-1.5 cursor-pointer"
                  onClick={() => {
                    setCurrentPage('home');
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="p-1 px-1.5 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg text-white">
                    <Globe className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                      WebzoneBD
                    </span>
                    <span className="text-[6.5px] uppercase tracking-wider font-mono text-neutral-500 dark:text-neutral-450 font-black">
                      IT Solution
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-slate-700 transition cursor-pointer"
                  aria-label="Close Sidebar"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Sidebar Header Block with Client Profile Onboarding */}
              <div className="p-4 border-b border-neutral-200/60 dark:border-slate-800 bg-neutral-50/80 dark:bg-[#0F172A]/40 flex flex-col gap-3">
                {/* 2. Client Profile / Onboarding Block */}
                <div>
                  {user ? (
                    <div className="p-3 bg-gradient-to-tr from-neutral-50 to-neutral-100 dark:from-slate-900 dark:to-[#0b1324] border border-neutral-250 dark:border-emerald-500/20 rounded-2xl shadow-md space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="Profile" 
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-400 text-slate-950 font-black flex items-center justify-center text-sm uppercase">
                              {user.name.slice(0, 2)}
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#070b13] rounded-full animate-pulse" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="font-extrabold text-xs text-neutral-900 dark:text-white truncate leading-tight">{user.name}</p>
                          <p className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5 font-bold">
                            👑 {user.role === 'admin' ? 'SYSTEM ADMIN' : 'PREMIUM MEMBER'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-neutral-200 dark:border-slate-800">
                        <button
                          onClick={() => {
                            localStorage.setItem('webzone_dashboard_active_tab', 'profile');
                            setCurrentPage('dashboard');
                            setMobileMenuOpen(false);
                          }}
                          className="py-1.5 px-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold rounded-xl cursor-pointer text-center transition"
                        >
                          {language === 'bn' ? 'অ্যাকাউন্ট সেটিংস' : 'Account Settings'}
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem('webzone_dashboard_active_tab', 'wallet-funds');
                            setCurrentPage('dashboard');
                            setMobileMenuOpen(false);
                          }}
                          className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-xl cursor-pointer text-center shadow-md transition"
                        >
                          {language === 'bn' ? 'ব্যালেন্স' : 'Balance'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-br from-blue-600/5 to-cyan-500/10 border border-blue-500/15 rounded-2xl text-left space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-black text-blue-600 dark:text-cyan-400 tracking-wider">
                          {language === 'bn' ? 'কাস্টমার জোন' : 'Client Hub Portal'}
                        </span>
                        <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 text-[8px] font-black uppercase rounded px-1.5 py-0.5">
                          SECURE
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            onLoginClick('login');
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[11px] rounded-xl shadow-md cursor-pointer hover:opacity-90 transition"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
                        </button>
                        <button
                          onClick={() => {
                            onLoginClick('register');
                            setMobileMenuOpen(false);
                          }}
                          className="py-1.5 px-2 border border-neutral-250 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-700 dark:text-neutral-200 text-[11px] font-bold rounded-xl cursor-pointer text-center transition"
                        >
                          {language === 'bn' ? 'নিবন্ধন' : 'Register'}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onLoginClick('register', 'affiliate');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-[#10B981] to-[#06B6D4] text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl shadow-sm cursor-pointer hover:opacity-90 transition flex items-center justify-center gap-1.5"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অ্যাফিলিয়েট পার্টনার' : 'Partner Affiliate Program'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-left dynamic-sidebar-scroller bg-white dark:bg-[#0F172A] text-neutral-850 dark:text-neutral-250">
                
                {/* Standard Links & Custom Dropdowns */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-450 dark:text-neutral-500 font-mono font-bold block px-2 mb-2">Webzone Navigator</span>

                  {/* Home */}
                  <button
                    onClick={() => {
                      setCurrentPage('home');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      currentPage === 'home'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-blue-500/10 border-none'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Globe2 className={`w-4 h-4 ${currentPage === 'home' ? 'text-white' : 'text-blue-500 dark:text-cyan-400'}`} />
                    <span>Home</span>
                  </button>

                  {/* Hosting Accordion expandable */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleAccordion('hosting')}
                      className={`flex items-center justify-between gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === 'hosting' || expandedAccordion === 'hosting' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-md border-none' : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Database className={`w-4 h-4 ${currentPage === 'hosting' || expandedAccordion === 'hosting' ? 'text-white' : 'text-blue-500 dark:text-cyan-400'}`} />
                        <span>{t.hosting}</span>
                      </span>
                      {expandedAccordion === 'hosting' ? <ChevronUp className={`w-3.5 h-3.5 ${currentPage === 'hosting' || expandedAccordion === 'hosting' ? 'text-white' : 'text-neutral-400'}`} /> : <ChevronDown className={`w-3.5 h-3.5 ${currentPage === 'hosting' || expandedAccordion === 'hosting' ? 'text-white' : 'text-neutral-400'}`} />}
                    </button>
                    <AnimatePresence>
                      {expandedAccordion === 'hosting' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-7 pr-3 space-y-1 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setCurrentPage('domain');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-blue-650 dark:hover:text-emerald-400 border-l border-neutral-200 dark:border-slate-800 pl-3 font-semibold hover:border-blue-500 dark:hover:border-emerald-500 transition cursor-pointer"
                          >
                            {language === 'bn' ? 'ডোমেন রেজিস্ট্রেশন' : 'Domain Registration'}
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('webzone_target_hosting_tab', 'bdix');
                              window.dispatchEvent(new Event('storage'));
                              setCurrentPage('hosting');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-blue-650 dark:hover:text-emerald-400 border-l border-neutral-200 dark:border-slate-800 pl-3 font-semibold hover:border-blue-500 dark:hover:border-emerald-500 transition cursor-pointer"
                          >
                            {t.hostingShared}
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('webzone_target_hosting_tab', 'vps');
                              window.dispatchEvent(new Event('storage'));
                              setCurrentPage('hosting');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-blue-650 dark:hover:text-emerald-400 border-l border-neutral-200 dark:border-slate-800 pl-3 font-semibold hover:border-blue-500 dark:hover:border-emerald-500 transition cursor-pointer"
                          >
                            {t.hostingVps}
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('webzone_target_hosting_tab', 'reseller');
                              window.dispatchEvent(new Event('storage'));
                              setCurrentPage('hosting');
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 px-2 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-blue-650 dark:hover:text-emerald-400 border-l border-neutral-200 dark:border-slate-800 pl-3 font-semibold hover:border-blue-500 dark:hover:border-emerald-500 transition cursor-pointer"
                          >
                            {t.hostingReseller}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Services - Direct Button Link with Expandable Sub-options */}
                  <div className="space-y-1 bg-neutral-50/40 dark:bg-slate-900/10 p-1.5 rounded-2xl border border-neutral-200/40 dark:border-slate-800/20">
                    <button
                      onClick={() => {
                        localStorage.setItem('webzone_target_services_tab', 'all');
                        localStorage.removeItem('webzone_services_filter_keyword');
                        window.dispatchEvent(new Event('storage'));
                        setCurrentPage('services');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === 'services'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-blue-500/10 border-none'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Laptop className={`w-4 h-4 ${currentPage === 'services' ? 'text-white' : 'text-blue-500 dark:text-cyan-400'}`} />
                      <span>{t.services}</span>
                    </button>
                    <div className="pl-6 pt-1.5 pb-2.5 flex flex-col gap-2.5 text-[11px] font-black text-neutral-500 dark:text-neutral-300">
                      <button 
                        onClick={() => {
                          localStorage.setItem('webzone_target_services_tab', 'digital-web-dev');
                          window.dispatchEvent(new Event('storage'));
                          setCurrentPage('services');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left font-black hover:text-blue-600 dark:hover:text-cyan-455 transition flex items-center gap-1.5 animate-pulse cursor-pointer"
                      >
                        <span>🚀</span>
                        <span>{language === 'bn' ? 'ডিজিটাল ওয়েব ডেভেলপমেন্ট' : 'Digital Web Development'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem('webzone_target_services_tab', 'google-business');
                          window.dispatchEvent(new Event('storage'));
                          setCurrentPage('services');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left font-black hover:text-blue-600 dark:hover:text-cyan-455 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>📍</span>
                        <span>{language === 'bn' ? 'গুগল মাই বিজনেস সেটআপ' : 'Google Business Setup'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem('webzone_target_services_tab', 'growth-package');
                          window.dispatchEvent(new Event('storage'));
                          setCurrentPage('services');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left font-black hover:text-blue-600 dark:hover:text-cyan-455 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>📈</span>
                        <span>{language === 'bn' ? 'বিজনেস গ্রোথ প্যাকেজ' : 'Business Growth Package'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Marketplace Accordion expandable */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleAccordion('marketplace')}
                      className={`flex items-center justify-between gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === 'marketplace' || expandedAccordion === 'marketplace'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-md border-none'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles className={`w-4 h-4 ${currentPage === 'marketplace' || expandedAccordion === 'marketplace' ? 'text-white' : 'text-blue-505 dark:text-cyan-400'}`} />
                        <span>{language === 'bn' ? 'ডিজিটাল স্টোর' : language === 'ar' ? 'المتجر الرقمي' : 'Digital Store'}</span>
                      </span>
                      {expandedAccordion === 'marketplace' ? (
                        <ChevronUp className={`w-3.5 h-3.5 ${currentPage === 'marketplace' || expandedAccordion === 'marketplace' ? 'text-white' : 'text-neutral-400'}`} />
                      ) : (
                        <ChevronDown className={`w-3.5 h-3.5 ${currentPage === 'marketplace' || expandedAccordion === 'marketplace' ? 'text-white' : 'text-neutral-400'}`} />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedAccordion === 'marketplace' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-7 pr-3 space-y-1 overflow-hidden"
                        >
                          {marketplaceList.map((mkt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleMobileSubitemClick(mkt, 'marketplace')}
                              className="block w-full text-left py-2 px-2 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-emerald-450 border-l border-neutral-200 dark:border-slate-800 pl-3 font-semibold hover:border-blue-500 dark:hover:border-emerald-500 transition"
                            >
                              {mkt.title}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Solutions Accordion expandable */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleAccordion('solutions')}
                      className={`flex items-center justify-between gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === 'solutions' || expandedAccordion === 'solutions'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-md border-none'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Layers className={`w-4 h-4 ${currentPage === 'solutions' || expandedAccordion === 'solutions' ? 'text-white' : 'text-blue-505 dark:text-cyan-400'}`} />
                        <span>Solutions</span>
                      </span>
                      {expandedAccordion === 'solutions' ? (
                        <ChevronUp className={`w-3.5 h-3.5 ${currentPage === 'solutions' || expandedAccordion === 'solutions' ? 'text-white' : 'text-neutral-400'}`} />
                      ) : (
                        <ChevronDown className={`w-3.5 h-3.5 ${currentPage === 'solutions' || expandedAccordion === 'solutions' ? 'text-white' : 'text-neutral-400'}`} />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedAccordion === 'solutions' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-7 pr-3 space-y-1 overflow-hidden"
                        >
                          {solutionsList.map((sol, index) => (
                            <button
                              key={index}
                              onClick={() => handleMobileSubitemClick(sol, 'solution')}
                              className="block w-full text-left py-2 px-2 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-emerald-400 border-l border-neutral-200 dark:border-slate-800 pl-3 font-semibold hover:border-blue-505 dark:hover:border-emerald-500 transition"
                            >
                              {sol.title}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Portfolio */}
                  <button
                    onClick={() => {
                      setCurrentPage('portfolio');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      currentPage === 'portfolio'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-blue-500/10 border-none'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Briefcase className={`w-4 h-4 ${currentPage === 'portfolio' ? 'text-white' : 'text-blue-500 dark:text-cyan-400'}`} />
                    <span>Portfolio</span>
                  </button>

                  {/* Blog */}
                  <button
                    onClick={() => {
                      setCurrentPage('blog');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      currentPage === 'blog'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-blue-500/10 border-none'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 ${currentPage === 'blog' ? 'text-white' : 'text-blue-500 dark:text-cyan-400'}`} />
                    <span>Blog</span>
                  </button>

                  {/* Affiliate */}
                  <button
                    onClick={() => {
                      setCurrentPage('affiliate');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      currentPage === 'affiliate'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-blue-500/10 border-none'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Coins className={`w-4 h-4 ${currentPage === 'affiliate' ? 'text-white' : 'text-blue-500 dark:text-cyan-400'} animate-pulse`} />
                    <span>{language === 'bn' ? "অ্যাফিলিয়েট প্রোগ্রাম" : language === 'ar' ? "التسويق بالعمولة" : "Affiliate Program"}</span>
                  </button>

                  {/* Contact */}
                  <button
                    onClick={() => {
                      setCurrentPage('contact');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      currentPage === 'contact'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-blue-500/10 border-none'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Mail className={`w-4 h-4 ${currentPage === 'contact' ? 'text-white' : 'text-blue-500 dark:text-cyan-400'}`} />
                    <span>Contact</span>
                  </button>
                </div>

                {/* Hosting & Domain - Separate Highlights Block */}
                <div className="pt-2">
                  <div className="p-3 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-emerald-950/40 dark:to-slate-900 border border-neutral-200 dark:border-emerald-400/25 rounded-2xl space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-widest flex items-center gap-1">
                        <Server className="w-3.5 h-3.5 text-blue-550 dark:text-cyan-400" />
                        <span>Hosting & domains</span>
                      </span>
                      <span className="bg-emerald-100/60 dark:bg-emerald-400/20 text-emerald-650 dark:text-emerald-400 text-[8px] font-black uppercase rounded-lg px-1.5 py-0.5 tracking-wider">Secure Hosting</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {hostingDomainList.map((hst, index) => (
                        <button
                          key={index}
                          onClick={() => handleMobileSubitemClick(hst, 'hosting')}
                          className="py-1.5 px-2 bg-neutral-200/50 dark:bg-slate-950/60 rounded-lg text-[9.5px] font-bold border border-neutral-250/25 dark:border-slate-800 text-neutral-700 dark:text-neutral-350 hover:text-blue-600 dark:hover:text-white hover:border-blue-600/30 dark:hover:border-emerald-500/40 transition text-left truncate block"
                        >
                          {hst.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Premium Theme Switching section within drawer */}
                <div className="pt-2 border-t border-neutral-200 dark:border-slate-800">
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2 font-mono font-bold px-1 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
                    <span>Theme settings</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 font-sans text-[10px] font-extrabold">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer duration-300 ${
                        theme === 'light' 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-lg shadow-blue-500/20' 
                          : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-600 dark:text-neutral-400 hover:text-[#000] dark:hover:text-white'
                      }`}
                    >
                      <span className="text-[11px]">☀</span>
                      <span>Light Mode</span>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer duration-300 ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-lg shadow-blue-500/20' 
                          : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-600 dark:text-neutral-400 hover:text-[#000] dark:hover:text-white'
                      }`}
                    >
                      <span className="text-[11px]">🌙</span>
                      <span>Dark Mode</span>
                    </button>
                  </div>
                </div>

                {/* Custom Language Switching section within drawer */}
                <div className="pt-2 border-t border-neutral-200 dark:border-slate-800">
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2 font-mono font-bold px-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
                    <span>Language settings</span>
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 font-sans text-[9px] font-bold">
                    {[
                      { code: 'en', flag: '🇺🇸', label: 'English' },
                      { code: 'bn', flag: '🇧🇩', label: 'বাংলা' },
                      { code: 'ar', flag: '🇸🇦', label: 'العربية' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as 'en' | 'bn' | 'ar')}
                        className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          language === lang.code 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black' 
                            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-600 dark:text-neutral-400 hover:text-[#000] dark:hover:text-white'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Currency Switching section within drawer */}
                <div className="pt-2 border-t border-neutral-200 dark:border-slate-800">
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2 font-mono font-bold px-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
                    <span>Currency settings</span>
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] font-bold">
                    {[
                      { code: 'USD', flag: '🇺🇸', symbol: '$' },
                      { code: 'BDT', flag: '🇧🇩', symbol: '৳' },
                      { code: 'SAR', flag: '🇸🇦', symbol: 'ر.س' }
                    ].filter(cur => {
                      if (currencySettings && currencySettings.enabled) {
                        return currencySettings.enabled[cur.code as Currency];
                      }
                      return true;
                    }).map((cur) => (
                      <button
                        key={cur.code}
                        onClick={() => setCurrency(cur.code as Currency)}
                        className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          currency === cur.code 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white dark:from-emerald-500 dark:to-cyan-400 dark:text-slate-950 font-black' 
                            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-600 dark:text-neutral-400 hover:text-[#000] dark:hover:text-white'
                        }`}
                      >
                        <span>{cur.flag}</span>
                        <span>{cur.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Action Navigation CTAs */}
                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-neutral-200 dark:border-slate-800">
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-1 font-mono font-bold px-1">Quick Actions</p>
                  
                  {/* Get Quote */}
                  <button
                    onClick={() => {
                      setCurrentPage('contact');
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('contact-form-card') || document.getElementById('contact-us-heading');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 400);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:opacity-90 transition rounded-xl text-xs font-extrabold shadow-sm text-center"
                  >
                    Get Quote
                  </button>

                  {/* Start Project */}
                  <button
                    onClick={() => {
                      setCurrentPage('contact');
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('contact-form-card') || document.getElementById('contact-us-heading');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 400);
                    }}
                    className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-805 border border-neutral-300 dark:border-slate-700 text-neutral-800 dark:text-white transition rounded-xl text-xs font-black text-center animate-none"
                  >
                    Start Project
                  </button>

                  {/* WhatsApp Support Live Chat */}
                  <a
                    href="https://wa.me/966570511931"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="w-full py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-450 transition rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>

                {/* Footer Area inside Mobile Sidebar */}
                <div className="pt-3 border-t border-neutral-200 dark:border-slate-800 space-y-2.5 text-neutral-500 dark:text-neutral-400 text-[10px]">
                  <p className="font-mono text-[9px] uppercase font-bold tracking-widest text-neutral-500 dark:text-neutral-450">Company Contact</p>
                  <div className="space-y-1 text-[10.5px]">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                      <a href="mailto:info@webzonebd.com" className="hover:text-blue-600 dark:hover:text-white transition">info@webzonebd.com</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                      <a href="tel:+966570511931" className="hover:text-blue-600 dark:hover:text-white transition">+966570511931</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                      <a href="https://www.webzonebd.com" className="hover:text-blue-600 dark:hover:text-white transition">www.webzonebd.com</a>
                    </div>
                  </div>

                  {/* Social Icons links block */}
                  <div className="flex items-center gap-3 pt-1">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 hover:text-white rounded-lg transition"
                      aria-label="Facebook Profile Link"
                    >
                      <Facebook className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 hover:text-white rounded-lg transition"
                      aria-label="LinkedIn Profile Link"
                    >
                      <Linkedin className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a 
                      href="https://youtube.com" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 rounded-lg transition"
                      aria-label="YouTube Profile Link"
                    >
                      <Youtube className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>

                  <p className="text-[8px] text-neutral-400 dark:text-neutral-505 pt-2 text-center border-t border-neutral-200 dark:border-slate-850 leading-normal">
                    © {new Date().getFullYear()} WebzoneBD IT Solution. All codes clean validated secures.
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Swipe Popup / Drawer for Sign In & Register */}
      <AnimatePresence>
        {authDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" id="auth-swipe-drawer-wrapper">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setAuthDrawerOpen(false);
                setAuthDrawerError('');
                setAuthDrawerSuccess('');
              }}
              className="absolute inset-0 bg-neutral-950/65 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className="relative w-full max-w-sm h-full bg-white dark:bg-neutral-950 border-l border-neutral-200/80 dark:border-neutral-850 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {user ? (
                <div className="space-y-6 text-left h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Drawer Header with Close Button */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 dark:border-neutral-850">
                      <span className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded">🛡️ SECURE VIP PROFILE</span>
                      <button
                        onClick={() => {
                          setAuthDrawerOpen(false);
                          setAuthDrawerError('');
                          setAuthDrawerSuccess('');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-mono font-bold text-neutral-600 dark:text-neutral-350 cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Top Area: Circular Profile Photo, Name, Email, & Verification Badge */}
                    <div className="relative rounded-2xl overflow-hidden p-5 text-center border border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-neutral-900/60 shadow-md">
                      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-r from-blue-600 to-purple-650 opacity-[0.14] z-0" />
                      
                      <div className="relative z-10 space-y-2">
                        {/* Avatar */}
                        <div className="relative inline-block mt-2">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="user profile photo representation avatar" 
                              className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500 mx-auto animate-in fade-in"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-slate-100 flex items-center justify-center font-black text-xl uppercase shadow-md mx-auto">
                              {user.name.slice(0, 2)}
                            </div>
                          )}
                          <span className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111827] flex items-center justify-center" />
                        </div>

                        {/* Name & Email */}
                        <div className="pt-1">
                          <h4 className="text-sm font-black text-neutral-900 dark:text-white capitalize truncate px-1">{user.name}</h4>
                          <p className="text-[10px] text-neutral-550 dark:text-neutral-400 font-mono mt-0.5 truncate px-1">{user.email}</p>
                        </div>

                        {/* Verification status */}
                        <div className="inline-flex items-center gap-1 bg-emerald-505 bg-emerald-500/15 text-[#10B981] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verification Badge
                        </div>
                      </div>
                    </div>

                    {/* Quick Menu */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-neutral-400 font-bold block uppercase tracking-wider mb-2">QUICK CONTROLS GATE</span>
                      
                      {[
                        { id: 'dashboard', label: '🏠 Dashboard', labelBn: '🏠 ড্যাশবোর্ড' },
                        { id: 'purchases', label: '📦 My Order', labelBn: '📦 My Order (আমার অর্ডার)' },
                        { id: 'wishlist', label: '❤️ Wishlist', labelBn: '❤️ উইশলিস্ট' },
                        { id: 'wallet', label: '💰 My Wallet', labelBn: '💰 আমার ওয়ালেট' },
                        { id: 'profile', label: '⚙️ Account Settings', labelBn: '⚙️ অ্যাকাউন্ট সেটিংস' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            localStorage.setItem('webzone_dashboard_active_tab', item.id);
                            setCurrentPage('dashboard');
                            setAuthDrawerOpen(false);
                          }}
                          style={{ minHeight: '48px' }}
                          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-slate-900 border border-transparent hover:border-neutral-200 dark:hover:border-slate-800 transition-all duration-150 cursor-pointer text-left font-sans"
                        >
                          <span>{language === 'bn' ? item.labelBn : item.label}</span>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sign Out Trigger at bottom */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
                    <button
                      onClick={() => {
                        onLogout();
                        setAuthDrawerOpen(false);
                      }}
                      style={{ minHeight: '48px' }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 bg-red-500/10 hover:bg-red-500/15 text-[#EF4444] rounded-xl text-xs font-black transition cursor-pointer text-left font-sans"
                    >
                      <LogOut className="w-4 h-4 shrink-0 text-[#EF4444]" />
                      <span>🚪 Logout Secure Area</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl relative">
                        <User className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                          {drawerAuthView === 'login' ? (language === 'bn' ? 'সাইন ইন করুন' : language === 'ar' ? 'تسجيل الدخول الموحد' : 'Secure Client Login') :
                           drawerAuthView === 'register' ? (language === 'bn' ? 'নতুন অ্যাকাউন্ট' : language === 'ar' ? 'إنشاء حساب عميل' : 'Client Registration') :
                           drawerAuthView === 'forgot' ? (language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : language === 'ar' ? 'استعادة كلمة السر' : 'Reset Credentials') :
                           drawerAuthView === 'otp' ? (language === 'bn' ? 'ওটিপি ভেরিফিকেশন' : language === 'ar' ? 'رمز التحقق الثنائي' : 'OTP 2FA Verification') :
                           (language === 'bn' ? 'নতুন পাসওয়ার্ড' : language === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Reset Password')}
                        </h3>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                          WEBZONEBD SECURE SSL • AES_256
                        </p>
                      </div>
                    </div>
                  <button
                    onClick={() => {
                      setAuthDrawerOpen(false);
                      setAuthDrawerError('');
                      setAuthDrawerSuccess('');
                    }}
                    className="p-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-mono font-bold text-neutral-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Status Panels (Errors or Success alerts) */}
                {authDrawerError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-left text-xs font-semibold text-red-500 leading-snug">
                    ⚠️ {authDrawerError}
                  </div>
                )}
                {authDrawerSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-left text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-snug">
                    ✓ {authDrawerSuccess}
                  </div>
                )}

                {/* MAIN FORMS CONTENT SCROLLABLE AREA */}
                <div className="space-y-4">
                  
                  {/* VIEW 1: LOGIN FORM */}
                  {drawerAuthView === 'login' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block font-mono">
                          Client Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            placeholder="e.g. client@webzonebd.com"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold font-sans text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block font-mono">
                            Account Password
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthDrawerError('');
                              setAuthDrawerSuccess('');
                              setDrawerAuthView('forgot');
                            }}
                            className="text-[10px] text-teal-500 dark:text-cyan-400 hover:underline font-bold font-mono"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={custPass}
                            onChange={(e) => setCustPass(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold font-sans text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!custEmail || !custPass) {
                              setAuthDrawerError("Complete all credentials fields before submitting validation handshake.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');
                            
                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              // Validate Credentials
                              if (custEmail === 'client@webzonebd.com' && custPass === 'client123') {
                                setAuthDrawerSuccess("Credentials authorized! Decrypting user session keys.");
                                setAuthDrawerOpen(false);
                                if (onLoginSuccess) {
                                  onLoginSuccess({
                                    id: 'usr-client',
                                    name: 'WebzoneBD Client',
                                    username: 'client_partner',
                                    email: 'client@webzonebd.com',
                                    phone: '+8801712345678',
                                    role: 'customer',
                                    isVerified: true,
                                    createdAt: '2026-06-01',
                                    status: 'active',
                                    wishlistedProductIds: []
                                  });
                                }
                              } else if (tempRegUser && custEmail === tempRegUser.email && custPass === custPassConfirm) {
                                setAuthDrawerSuccess("Registered credentials authorized! Decrypting user session keys.");
                                setAuthDrawerOpen(false);
                                if (onLoginSuccess) {
                                  onLoginSuccess(tempRegUser);
                                }
                              } else {
                                setAuthDrawerError("Bad Credentials handshake. Verify inputs (Username: client@webzonebd.com • Password: client123).");
                              }
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {authDrawerLoading ? (
                            <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <LogIn className="w-4 h-4" />
                          )}
                          <span>Sign In to Account</span>
                        </button>
                      </div>

                      <div className="text-center pt-1.5">
                        <span className="text-[10px] text-neutral-400">
                          New to WebzoneBD?{' '}
                          <button
                            onClick={() => {
                              setAuthDrawerError('');
                              setAuthDrawerSuccess('');
                              setDrawerAuthView('register');
                            }}
                            className="text-emerald-500 font-extrabold hover:underline"
                          >
                            Create Account
                          </button>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: REGISTER FORM */}
                  {drawerAuthView === 'register' && (
                    <div className="space-y-3.5 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Client Full Name</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <User className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. Asif Rahman"
                            value={custFullName}
                            onChange={(e) => setCustFullName(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Email Address</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            placeholder="asif@example.com"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">WhatsApp/Phone Number (For OTP)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Phone className="w-4 h-4" />
                          </span>
                          <input
                            type="tel"
                            placeholder="+8801700000000"
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Password</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={custPass}
                            onChange={(e) => setCustPass(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Confirm Password</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={custPassConfirm}
                            onChange={(e) => setCustPassConfirm(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!custFullName || !custEmail || !custPass || !custPhone) {
                              setAuthDrawerError("Please populate all registration tokens.");
                              return;
                            }
                            if (custPass !== custPassConfirm) {
                              setAuthDrawerError("Passwords do not match.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');

                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              // Create User template
                              const reggedUser: UserSession = {
                                id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
                                name: custFullName,
                                username: custFullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'newcustomer',
                                email: custEmail,
                                phone: custPhone,
                                role: 'customer',
                                isVerified: false,
                                createdAt: new Date().toISOString().split('T')[0],
                                status: 'active',
                                wishlistedProductIds: []
                              };
                              setTempRegUser(reggedUser);
                              setAuthDrawerSuccess("Account template prepared! Dispatching verification code.");
                              setDrawerAuthView('otp');
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-[#0284C7] hover:bg-sky-600 text-white font-black text-xs rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {authDrawerLoading ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                          <span>Register New Account</span>
                        </button>
                      </div>

                      <div className="text-center pt-1">
                        <span className="text-[10px] text-neutral-400">
                          Already registered?{' '}
                          <button
                            onClick={() => {
                              setAuthDrawerError('');
                              setAuthDrawerSuccess('');
                              setDrawerAuthView('login');
                            }}
                            className="text-emerald-500 font-extrabold hover:underline"
                          >
                            Sign In
                          </button>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: FORGOT PASSWORD */}
                  {drawerAuthView === 'forgot' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                        <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                          Provide your registered client account email below to trigger a secure custom 2FA verification OTP to reset credentials.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Client Account Email</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            placeholder="asif@example.com"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!custEmail) {
                              setAuthDrawerError("Type an authorized email address.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');

                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              setAuthDrawerSuccess("OTP recovery handshake sent! Double check your Inbox.");
                              setDrawerAuthView('otp');
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black text-xs rounded-xl hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Request Verification OTP</span>
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => {
                            setAuthDrawerError('');
                            setAuthDrawerSuccess('');
                            setDrawerAuthView('login');
                          }}
                          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-mono font-bold"
                        >
                          ← Cancel & Return to Sign In
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: OTP VERIFICATION */}
                  {drawerAuthView === 'otp' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl space-y-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-bold block">🚨 Simulated OTP Dispatched</span>
                        <p className="text-[10.5px] text-neutral-500 dark:text-slate-350 leading-relaxed font-medium">
                          Secure 6-Digit authorization OTP has been generated for client verification. Use verification token <strong className="text-emerald-500 dark:text-emerald-400 select-all font-mono">123456</strong>.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Enter OTP Code (6-Digits)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="123456"
                            value={custOtpCode}
                            onChange={(e) => setCustOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-center font-mono text-sm tracking-[0.5em] font-extrabold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            if (custOtpCode !== '123456' && custOtpCode !== '998877') {
                              setAuthDrawerError("Invalid verification token code. Use '123456' to pass SSL handshakes.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');

                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              if (tempRegUser) {
                                // Registered user activation path
                                const activatedUser = { ...tempRegUser, isVerified: true };
                                setAuthDrawerSuccess("Account verified and unlocked successfully!");
                                setAuthDrawerOpen(false);
                                if (onLoginSuccess) {
                                  onLoginSuccess(activatedUser);
                                }
                              } else {
                                // Reset Password path
                                setAuthDrawerSuccess("OTP verified! Define your new login secret code.");
                                setDrawerAuthView('reset');
                              }
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Confirm Verification OTP</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                        <span>Didn't receive verification?</span>
                        <button
                          onClick={() => {
                            setCustOtpCode('');
                            setAuthDrawerSuccess("A new OTP code has been broadcasted.");
                          }}
                          className="text-emerald-500 font-extrabold hover:underline"
                        >
                          Resend Code
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW 5: RESET PASSWORD */}
                  {drawerAuthView === 'reset' && (
                    <div className="space-y-4 text-left animate-in duration-200 slide-in-from-right-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Define New Password</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={custNewPass}
                            onChange={(e) => setCustNewPass(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Re-type New Password</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Key className="w-4 h-4" />
                          </span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 pl-9 rounded-xl text-xs font-bold text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!custNewPass) {
                              setAuthDrawerError("Password field cannot be empty.");
                              return;
                            }
                            setAuthDrawerLoading(true);
                            setAuthDrawerError('');

                            setTimeout(() => {
                              setAuthDrawerLoading(false);
                              setAuthDrawerSuccess("Password reset successfully saved. Initializing Workspace.");
                              setAuthDrawerOpen(false);
                              if (onLoginSuccess) {
                                onLoginSuccess({
                                  id: 'usr-client',
                                  name: 'WebzoneBD Client',
                                  username: 'client_partner',
                                  email: custEmail || 'client@webzonebd.com',
                                  phone: '+8801712345678',
                                  role: 'customer',
                                  isVerified: true,
                                  createdAt: '2026-06-01',
                                  status: 'active',
                                  wishlistedProductIds: []
                                });
                              }
                            }, 800);
                          }}
                          disabled={authDrawerLoading}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Save & Open Dashboard</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              {/* SOCIAL SIGN IN SECTION (BOTTOM) */}
              {(drawerAuthView === 'login' || drawerAuthView === 'register') && (
                <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-slate-800">
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Social Access Gateway</span>
                    <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setAuthDrawerLoading(true);
                        setTimeout(() => {
                          setAuthDrawerLoading(false);
                          setAuthDrawerOpen(false);
                          if (onLoginSuccess) {
                            onLoginSuccess({
                              id: 'usr-google',
                              name: 'Google Client Account',
                              username: 'google_oauth_client',
                              email: 'client@webzonebd.com',
                              phone: '+8801723456789',
                              role: 'customer',
                              isVerified: true,
                              isSocial: true,
                              socialProvider: 'google',
                              createdAt: new Date().toISOString().split('T')[0],
                              status: 'active',
                              wishlistedProductIds: []
                            });
                          }
                        }, 700);
                      }}
                      className="py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 hover:text-black dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 text-neutral-600 dark:text-neutral-400"
                      title="Access with Google Secure ID"
                    >
                      <Globe className="w-4 h-4 text-emerald-500" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthDrawerLoading(true);
                        setTimeout(() => {
                          setAuthDrawerLoading(false);
                          setAuthDrawerOpen(false);
                          if (onLoginSuccess) {
                            onLoginSuccess({
                              id: 'usr-fb',
                              name: 'Facebook Client Account',
                              username: 'facebook_oauth_client',
                              email: 'client@webzonebd.com',
                              phone: '+8801734567890',
                              role: 'customer',
                              isVerified: true,
                              isSocial: true,
                              socialProvider: 'facebook',
                              createdAt: new Date().toISOString().split('T')[0],
                              status: 'active',
                              wishlistedProductIds: []
                            });
                          }
                        }, 700);
                      }}
                      className="py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 hover:text-black dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 text-neutral-600 dark:text-neutral-400"
                      title="Access with Facebook Connect"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthDrawerLoading(true);
                        setTimeout(() => {
                          setAuthDrawerLoading(false);
                          setAuthDrawerOpen(false);
                          if (onLoginSuccess) {
                            onLoginSuccess({
                              id: 'usr-github',
                              name: 'GitHub Developer Account',
                              username: 'github_oauth_client',
                              email: 'client@webzonebd.com',
                              phone: '+8801745678901',
                              role: 'customer',
                              isVerified: true,
                              isSocial: true,
                              socialProvider: 'github',
                              createdAt: new Date().toISOString().split('T')[0],
                              status: 'active',
                              wishlistedProductIds: []
                            });
                          }
                        }, 700);
                      }}
                      className="py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 hover:text-black dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 text-neutral-600 dark:text-neutral-400"
                      title="Access with GitHub SSH keys ID"
                    >
                      <Linkedin className="w-4 h-4 text-cyan-500" />
                    </button>
                  </div>

                  <p className="text-[9px] text-center text-neutral-400 mt-2 font-mono">
                    🛡️ SSL AES_256 COMPLIANT SECURITY PROTOCOLS
                  </p>
                </div>
              )}
            </div>
          )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Slider Drawer with conversion outputs */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-slideover-panel">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity" onClick={() => setCartOpen(false)} />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md animate-in slide-in-from-right duration-250">
              <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-2xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <ShoppingBag className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>{t.cart} ({cart.length})</span>
                    </h2>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="p-1 text-neutral-450 hover:text-black dark:text-white rounded-lg border border-neutral-205 dark:border-slate-800"
                    >
                      X
                    </button>
                  </div>

                  <div className="mt-8 text-left">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 text-neutral-450">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 stroke-[1.5]" />
                        <p className="text-sm font-bold">{t.cartEmpty}</p>
                        <button
                          onClick={() => {
                            setCartOpen(false);
                            setCurrentPage('marketplace');
                          }}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-505 font-black underline hover:text-emerald-400 transition"
                        >
                          Browse WebzoneBD Digital Store <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-neutral-100 dark:divide-slate-800">
                          {cart.map((item, idx) => {
                            const activePrice = item.product.discountPrice || item.product.price;
                            return (
                              <li key={idx} className="flex py-6">
                                <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover object-center"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-sm font-semibold text-neutral-900 dark:text-white gap-2">
                                      <h3 className="line-clamp-2 text-xs md:text-sm">
                                        {language === 'bn' ? item.product.nameBn : language === 'ar' ? item.product.nameAr : item.product.name}
                                      </h3>
                                      <p className="ml-4 text-emerald-500 font-bold whitespace-nowrap">{formatPriceInCart(activePrice)}</p>
                                    </div>
                                    <p className="mt-1 text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                                      {item.product.category}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-xs">
                                    <div className="flex items-center text-neutral-500">
                                      {item.appliedCoupon ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                          <Percent className="w-3 h-3" />
                                          {item.appliedCoupon.code} (-{item.appliedCoupon.discountPercent}%)
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-neutral-400">Standard License</span>
                                      )}
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => removeFromCart(idx)}
                                        className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-all"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Coupon overlay and summary options */}
                  {cart.length > 0 && (
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-4">
                      {/* Apply coupon */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{t.discountCode}</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. WEBZONE20"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-slate-800 px-3 py-1.5 text-xs font-mono font-bold uppercase transition focus:border-emerald-500 focus:outline-none text-neutral-900 dark:text-white"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="px-4 py-1.5 bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-950 dark:hover:bg-neutral-600 text-xs text-white rounded-lg font-bold transition-all"
                          >
                            {t.apply}
                          </button>
                        </div>
                        {couponError && <p className="text-[11px] text-red-500 font-bold">{couponError}</p>}
                        {couponSuccess && <p className="text-[11px] text-emerald-500 font-bold">{couponSuccess}</p>}
                      </div>

                      {/* Currency output rates block */}
                      <div className="space-y-1 text-sm bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200/50 dark:border-slate-800 text-left">
                        <div className="flex justify-between text-neutral-500">
                          <span>{t.subtotal}</span>
                          <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">{formatPriceInCart(subtotal)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-500 font-bold">
                             <span>Savings Discount</span>
                             <span className="font-mono">-{formatPriceInCart(discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-extrabold text-neutral-900 dark:text-white pt-1.5 border-t border-neutral-200 dark:border-neutral-800 text-base">
                          <span>{t.total}</span>
                          <span className="text-emerald-500 font-mono">{formatPriceInCart(total)}</span>
                        </div>
                      </div>

                      {/* Checkout Gateway System */}
                      <div className="space-y-3 bg-neutral-100 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <h4 className="text-[10px] uppercase font-bold font-mono tracking-widest text-neutral-500 text-left">
                          {t.checkoutTitle}
                        </h4>

                        {checkoutSuccess ? (
                          <div className="py-6 text-center text-emerald-500 space-y-2 animate-pulse">
                            <span className="font-extrabold text-xs block text-slate-900 dark:text-white">🔗 CONNECTING WEBZONE SECURE HANDSHAKE...</span>
                            <p className="text-xs font-semibold text-neutral-400">Verifying secure digital token for payment via {checkoutSelectedMethod}</p>
                          </div>
                        ) : !user ? (
                          <div className="w-full text-center py-2 space-y-3">
                            <p className="text-[10px] leading-relaxed font-sans text-neutral-500 dark:text-neutral-400">
                              🔒 Guest checkout state detected. Please authenticate your customer account or register as an affiliate partner to purchase scripts, licenses & hosting packages.
                            </p>
                            <button
                              onClick={() => {
                                setCartOpen(false);
                                onLoginClick('login');
                              }}
                              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer hover:opacity-90 transition inline-flex items-center justify-center gap-1.5"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Login & Check Out</span>
                            </button>
                          </div>
                        ) : (
                          <div className="w-full">
                            {currency === 'USD' && (
                              <div className="grid grid-cols-1 gap-2 w-full">
                                {/* USD Bank Transfer */}
                                <button
                                  onClick={() => handleSimulatePayment('USD Bank Transfer')}
                                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-emerald-500 transition-all cursor-pointer w-full text-center"
                                >
                                  <span className="text-xs font-black text-emerald-600">USD Bank Transfer</span>
                                  <span className="text-[9px] text-neutral-450 mt-1">Direct Bank Wire / SWIFT / routing</span>
                                </button>
                              </div>
                            )}

                            {currency === 'BDT' && (
                              <div className="grid grid-cols-2 gap-2 w-full">
                                {/* bKash */}
                                <button
                                  onClick={() => handleSimulatePayment('bKash Wallet')}
                                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-pink-500 transition-all cursor-pointer text-center"
                                >
                                  <span className="text-xs font-black text-pink-600">bKash (বিকাশ)</span>
                                  <span className="text-[9px] text-neutral-400">Instant Verification</span>
                                </button>

                                {/* Nagad */}
                                <button
                                  onClick={() => handleSimulatePayment('Nagad Digital')}
                                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-orange-500 transition-all cursor-pointer text-center"
                                >
                                  <span className="text-xs font-black text-orange-600">Nagad (নগদ)</span>
                                  <span className="text-[9px] text-neutral-400">Secure BD Wallet</span>
                                </button>

                                {/* Rocket */}
                                <button
                                  onClick={() => handleSimulatePayment('Rocket Wallet')}
                                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-purple-550 transition-all cursor-pointer text-center"
                                >
                                  <span className="text-xs font-black text-purple-600">Rocket (রকেট)</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Dutch-Bangla Bank</span>
                                </button>

                                {/* Cellfin */}
                                <button
                                  onClick={() => handleSimulatePayment('Cellfin Payment')}
                                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-sky-500 transition-all cursor-pointer text-center"
                                >
                                  <span className="text-xs font-black text-sky-600">Cellfin Card</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Cellfin Wallet</span>
                                </button>

                                {/* Bank Transfer */}
                                <button
                                  onClick={() => handleSimulatePayment('Islami Bank Transfer')}
                                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-emerald-500 transition-all cursor-pointer col-span-2 text-center"
                                >
                                  <span className="text-xs font-black text-emerald-600">Islami Bank Transfer</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Direct IBB Internet Net Banking</span>
                                </button>

                                {/* SSLCommerz */}
                                <button
                                  onClick={() => handleSimulatePayment('SSLCommerz Gateway')}
                                  className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-cyan-500 transition-all cursor-pointer col-span-2 text-center animated pulse animate-duration-1000"
                                >
                                  <span className="text-xs font-bold text-cyan-600 font-sans">SSLCommerz BD Checkout</span>
                                  <span className="text-[9px] text-neutral-400 font-sans">Cards / Net Banking / Mobiles</span>
                                </button>
                              </div>
                            )}

                            {currency === 'SAR' && (
                              <div className="grid grid-cols-1 gap-2 w-full">
                                {/* STC Pay */}
                                <button
                                  onClick={() => handleSimulatePayment('STC Pay (0570511931)')}
                                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-purple-600 transition-all cursor-pointer w-full text-center"
                                >
                                  <span className="text-xs font-black text-purple-600">STC Pay</span>
                                  <span className="text-[11px] text-slate-800 dark:text-slate-100 font-mono font-bold mt-0.5">Wallet: 0570511931</span>
                                  <span className="text-[9px] text-neutral-400 font-normal">Instant Transfer System</span>
                                </button>

                                {/* Alraji Bank Transfer */}
                                <button
                                  onClick={() => handleSimulatePayment('Alraji Bank Transfer')}
                                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950 hover:border-cyan-600 transition-all cursor-pointer w-full text-center"
                                >
                                  <span className="text-xs font-black text-blue-600">Alraji Bank Transfer</span>
                                  <span className="text-[9px] text-neutral-400">Local Saudi Bank Transfer</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-[9px] text-center text-neutral-400 leading-normal">
                          🛡️ SSL Secure Handshake active. Authorized via WebzoneBD IT Solution.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Sliding-from-Right Drawer Panel */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="wishlist-slideover-panel">
          {/* Backdrop blur overlay */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity cursor-pointer animate-fade-in" onClick={() => setWishlistOpen(false)} />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md animate-in slide-in-from-right duration-250">
              <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-2xl">
                
                {/* Drawer Header Row */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-slate-800 pb-4">
                    <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500 shrink-0 fill-rose-500 animate-pulse" />
                      <span>
                        {language === 'bn' ? 'আমার উইশলিস্ট' : language === 'ar' ? 'مفضلتي' : 'My Wishlist'} 
                        <span className="ml-1.5 px-2 py-0.5 text-xs bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-455 rounded-full font-mono font-bold">
                          {wishlist.length}
                        </span>
                      </span>
                    </h2>
                    <button
                      onClick={() => setWishlistOpen(false)}
                      className="p-1.5 text-neutral-450 hover:text-black dark:text-white rounded-lg border border-neutral-205 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-850 duration-150 text-xs font-bold font-mono transition"
                    >
                      X
                    </button>
                  </div>

                  {/* Scrollable Products List Container */}
                  <div className="mt-6 text-left">
                    {wishlist.length === 0 ? (
                      <div className="text-center py-20 text-neutral-450">
                        <Heart className="w-16 h-16 mx-auto mb-4 stroke-[1.5] text-neutral-300 dark:text-slate-700" />
                        <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                          {language === 'bn' ? 'আপনার পছন্দ তালিকায় কোনো পণ্য নেই!' : language === 'ar' ? 'قائمة المفضلة لديك فارغة حالياً!' : 'Your Wishlist is Empty!'}
                        </p>
                        <p className="text-xs text-neutral-405 dark:text-neutral-500 mt-1.5 max-w-[250px] mx-auto">
                          {language === 'bn' ? 'আমাদের নতুন প্রিমিয়াম স্ক্রিপ্ট ও থিমগুলো দেখতে আজই ডিজিটাল স্টোর ভিজিট করুন।' : 'Browse our premium script catalogs and add outstanding products to your wishlist!'}
                        </p>
                        <button
                          onClick={() => {
                            setWishlistOpen(false);
                            setCurrentPage('marketplace');
                          }}
                          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-650 dark:bg-rose-600 dark:hover:bg-rose-700 text-xs text-white font-black rounded-xl shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-95 duration-150 transition"
                        >
                          <span>{language === 'bn' ? 'ডিজিটাল স্টোর ব্রাউজ করুন' : 'Browse Products Store'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-neutral-100 dark:divide-slate-800">
                          {sampleProducts
                            .filter(prod => wishlist.includes(prod.id))
                            .map((product) => {
                              const activePrice = product.discountPrice || product.price;
                              return (
                                <li key={product.id} className="flex py-5">
                                  {/* Product Preview Thumbnail */}
                                  <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200/60 dark:border-slate-800 bg-neutral-50 dark:bg-slate-950">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="h-full w-full object-cover object-center"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>

                                  {/* Metadata Column */}
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-sm font-semibold text-neutral-900 dark:text-white gap-2">
                                        <h3 
                                          className="line-clamp-2 text-xs font-black dark:text-white hover:text-rose-500 dark:hover:text-rose-455 transition cursor-pointer leading-normal text-slate-850" 
                                          onClick={() => {
                                            setWishlistOpen(false);
                                            setCurrentPage('marketplace');
                                          }}
                                        >
                                          {language === 'bn' ? product.nameBn : language === 'ar' ? product.nameAr : product.name}
                                        </h3>
                                        <div className="text-right shrink-0">
                                          {product.discountPrice && (
                                            <p className="text-[10px] text-neutral-400 line-through font-mono leading-none mb-0.5">
                                              {formatPriceInCart(product.price)}
                                            </p>
                                          )}
                                          <p className="text-rose-500 dark:text-rose-455 font-black whitespace-nowrap text-xs md:text-sm font-mono leading-none">
                                            {formatPriceInCart(activePrice)}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-mono uppercase font-black text-blue-600 dark:text-cyan-405 bg-blue-50 dark:bg-cyan-950/30 rounded border border-blue-100/50 dark:border-cyan-950/20">
                                        {product.category}
                                      </span>
                                    </div>

                                    {/* Actions Row */}
                                    <div className="flex flex-1 items-end justify-between mt-2.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (addToCart) {
                                            addToCart(product);
                                            triggerToast(language === 'bn' ? `${product.nameBn} কার্টে যোগ করা হয়েছে` : `Added ${product.name} to cart`);
                                          } else {
                                            triggerToast('Added to Cart');
                                          }
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 hover:bg-black dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-white dark:text-rose-400 font-extrabold rounded-lg text-[10px] uppercase tracking-wider duration-150 transition-all cursor-pointer active:scale-95"
                                      >
                                        <ShoppingBag className="w-3 h-3 text-emerald-400" />
                                        <span>{language === 'bn' ? 'কিনুন 🛒' : 'Order Now 🛒'}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (toggleWishlist) {
                                            toggleWishlist(product.id);
                                          } else {
                                            triggerToast('Removed from Wishlist');
                                          }
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all duration-150 mr-1"
                                        title={language === 'bn' ? 'সরিয়ে ফেলুন' : 'Remove Item'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.2} />
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drawer Footer Row */}
                {wishlist.length > 0 && (
                  <div className="border-t border-neutral-150 dark:border-slate-800 p-4 bg-neutral-50 dark:bg-slate-900/40 space-y-3">
                    <button
                      onClick={() => {
                        setWishlistOpen(false);
                        setCurrentPage('marketplace');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-605 hover:to-rose-650 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer duration-150 transition active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{language === 'bn' ? 'ডিজিটাল স্টোর এ আরও দেখুন' : 'Explore More Digital Scripts'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
