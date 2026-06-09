import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Search, TrendingUp, Server, ShieldCheck, 
  HelpCircle, Sparkles, Send, Award, PhoneCall,
  Flame, Star, Gift, Check, CheckCircle2, CheckCircle, Filter,
  Sliders, DollarSign, Calendar, Clock, X, Heart,
  ShoppingCart, MessageSquare, Plus, Minus, ArrowRight,
  ThumbsUp, ChevronRight, ChevronDown
} from 'lucide-react';
import { Language, Theme, Order, Currency } from '../types';
import Package from './Package';
import GoogleBusinessService from './GoogleBusinessService';
import DigitalWebDevelopment from './DigitalWebDevelopment';
import MarketingServiceDetails from './MarketingServiceDetails';
import ServiceDetails from './ServiceDetails';
import { 
  catalogServicesData, 
  fixedPackagesData, 
  featuredPackagesData, 
  recommendedServicesMap,
  CatalogService,
  FixedPackage,
  FeaturedPackage
} from './ServicesData';

const homeFiltersList = [
  { id: 'all', label: 'All', labelBn: 'সব সার্ভিস', labelAr: 'جميع الخدمات', icon: Sparkles },
  { id: 'Web Development', label: 'Web Development', labelBn: 'ওয়েব ডেভেলপমেন্ট', labelAr: 'تطوير المواقع', icon: Globe },
  { id: 'Digital Marketing', label: 'Digital Marketing', labelBn: 'ডিজিটাল মার্কেটিং', labelAr: 'التسويق الرقمي', icon: TrendingUp },
  { id: 'Custom Scripting', label: 'Custom Scripting', labelBn: 'কাস্টম স্ক্রিপ্টিং', labelAr: 'البرمجة الخاصة', icon: Server }
];

const horizontalCategories = [
  { id: 'all', label: 'All Services', bn: 'সব সার্ভিস', ar: 'جميع الخدمات', icon: Sparkles },
  { id: 'website-development', label: 'Website Development', bn: 'ওয়েবসাইট ডেভেলপমেন্ট', ar: 'تطوير المواقع', icon: Globe },
  { id: 'ecommerce', label: 'E-Commerce', bn: 'ই-কমার্স', ar: 'التجارة الإلكترونية', icon: ShoppingCart },
  { id: 'news-portal', label: 'News Portal', bn: 'নিউজ পোর্টাল', ar: 'بوابة إخبارية', icon: MessageSquare },
  { id: 'school-management', label: 'School Management', bn: 'স্কুল ম্যানেজমেন্ট', ar: 'إدارة المدارس', icon: Award },
  { id: 'hosting-services', label: 'Hosting Services', bn: 'হোস্টিং সার্ভিসেস', ar: 'خدمات الاستضافة', icon: Server },
  { id: 'digital-marketing', label: 'Digital Marketing', bn: 'ডিজিটাল মার্কেটিং', ar: 'التسويق الرقمي', icon: TrendingUp },
  { id: 'wordpress-services', label: 'WordPress Services', bn: 'ওয়ার্ডপ্রেস সার্ভিসেস', ar: 'خدمات ووردبريس', icon: Globe },
  { id: 'whmcs-solutions', label: 'WHMCS Solutions', bn: 'WHMCS সলিউশনস', ar: 'حلول WHMCS', icon: Sliders },
  { id: 'mobile-app-development', label: 'Mobile App Development', bn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট', ar: 'تطوير تطبيقات الجوال', icon: ShieldCheck },
  { id: 'business-software', label: 'Business Software', bn: 'বিজনেস সফটওয়্যার', ar: 'برمجيات الأعمال', icon: CheckCircle2 },
  { id: 'custom-development', label: 'Custom Development', bn: 'কাস্টম ডেভেলপমেন্ট', ar: 'التطوير المخصص', icon: CheckCircle },
  { id: 'graphic-design', label: 'Graphic Design', bn: 'গ্রাফিক ডিজাইন', ar: 'التصميم الجرافيكي', icon: Heart }
];

interface ServicesProps {
  language: Language;
  theme: Theme;
  addSimulatedServiceOrder: (order: Order) => void;
  triggerToast: (msg: string) => void;
  setCurrentPage: (page: string) => void;
  currency: Currency;
  currencySettings: any;
  isHomePage?: boolean;
  addToCart?: (product: any) => void;
  setCartOpen?: (open: boolean) => void;
}

export default function Services({ 
  language, 
  theme, 
  addSimulatedServiceOrder, 
  triggerToast,
  setCurrentPage,
  currency,
  currencySettings,
  isHomePage = false,
  addToCart,
  setCartOpen
}: ServicesProps) {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'custom-services' | 'fixed-packages' | 'google-business' | 'growth-package' | 'digital-web-dev'>(
    isHomePage ? 'digital-web-dev' : 'custom-services'
  );
  
  // Custom Services filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategoryFilter, searchQuery]);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [selectedTimelines, setSelectedTimelines] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  
  // Homepage Service Category filter state
  const [homeSelectedType, setHomeSelectedType] = useState<string>('all');

  // Active dropdown state for modern custom horizontal filter bar
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'budget' | 'timeline' | 'level' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const catNames: { [key: string]: { en: string, bn: string } } = {
    "Web Design & WordPress": { en: "Web Design & WordPress", bn: "ওয়েব ডিজাইন ও ওয়ার্ডপ্রেস" },
    "Laravel & Custom Development": { en: "Laravel & Custom Development", bn: "লারাভেল ও কাস্টম ডেভেলপমেন্ট" },
    "Digital Marketing & SEO": { en: "Digital Marketing & SEO", bn: "ডিজিটাল মার্কেটিং ও এসইও" },
    "E-Commerce Solutions": { en: "E-Commerce Solutions", bn: "ই-কমার্স সলিউশনস" },
    "Digital Store Gig Services": { en: "Digital Store Gig Services", bn: "ডিজিটাল স্টোর গিগ সার্ভিস" }
  };

  const budNames: { [key: string]: { en: string, bn: string } } = {
    'under-100': { en: "Under $100", bn: "$100 এর নিচে" },
    '100-500': { en: "$100 - $500", bn: "$100 - $500" },
    '500-1000': { en: "$500 - $1000", bn: "$500 - $1000" },
    '1000-plus': { en: "$1000+", bn: "$1000 এর বেশি" }
  };

  const timeNames: { [key: string]: { en: string, bn: string } } = {
    '3-days': { en: "3 Days", bn: "৩ দিন" },
    '7-days': { en: "7 Days", bn: "৭ দিন" },
    '14-days': { en: "14 Days", bn: "১৪ দিন" },
    '30-days': { en: "30 Days", bn: "৩০ দিন" },
    'custom': { en: "Custom Timeline", bn: "কাস্টম সময়" }
  };

  const lvlNames: { [key: string]: { en: string, bn: string } } = {
    'Starter': { en: 'Starter', bn: 'স্টার্টার' },
    'Business': { en: 'Business', bn: 'বিজনেস' },
    'Enterprise': { en: 'Enterprise', bn: 'এন্টারপ্রাইজ' }
  };

  const getCategoryLabel = () => {
    if (selectedCategories.length === 0) return language === 'bn' ? 'ক্যাটাগরি' : 'Categories';
    if (selectedCategories.length === 1) {
      const match = catNames[selectedCategories[0]];
      return language === 'bn' ? match?.bn : match?.en;
    }
    return `${selectedCategories.length} ${language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}`;
  };

  const getBudgetLabel = () => {
    if (selectedBudgets.length === 0) return language === 'bn' ? 'বাজেট' : 'Budget';
    if (selectedBudgets.length === 1) {
      const match = budNames[selectedBudgets[0]];
      return language === 'bn' ? match?.bn : match?.en;
    }
    return `${selectedBudgets.length} ${language === 'bn' ? 'বাজেট' : 'Budgets'}`;
  };

  const getTimelineLabel = () => {
    if (selectedTimelines.length === 0) return language === 'bn' ? 'সময়সীমা' : 'Timeline';
    if (selectedTimelines.length === 1) {
      const match = timeNames[selectedTimelines[0]];
      return language === 'bn' ? match?.bn : match?.en;
    }
    return `${selectedTimelines.length} ${language === 'bn' ? 'সময়সীমা' : 'Timelines'}`;
  };

  const getLevelLabel = () => {
    if (selectedLevels.length === 0) return language === 'bn' ? 'সার্ভিস লেভেল' : 'Service Level';
    if (selectedLevels.length === 1) {
      const match = lvlNames[selectedLevels[0]];
      return language === 'bn' ? match?.bn : match?.en;
    }
    return `${selectedLevels.length} ${language === 'bn' ? 'লেভেল' : 'Levels'}`;
  };

  // Fixed Packages filtering states
  const [pkgSelectedCategory, setPkgSelectedCategory] = useState<string>('all');
  const [pkgMaxPrice, setPkgMaxPrice] = useState<number>(600);
  const [pkgMaxDelivery, setPkgMaxDelivery] = useState<number>(30);
  const [pkgMinRating, setPkgMinRating] = useState<number>(0);
  const [pkgSortBy, setPkgSortBy] = useState<'all' | 'best-selling' | 'price-low' | 'price-high'>('all');

  // Interactive details screen state
  const [selectedService, setSelectedService] = useState<CatalogService | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'overview' | 'features' | 'portfolio' | 'packages' | 'reviews' | 'faq'>('overview');
  
  const handleSelectService = (srv: CatalogService | null) => {
    if (!srv) {
      setSelectedService(null);
      return;
    }
    if (isHomePage) {
      localStorage.setItem('webzone_target_service_details_id', srv.id);
      setCurrentPage('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedService(srv);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Quick View Modal
  const [quickViewService, setQuickViewService] = useState<CatalogService | null>(null);

  // Custom project specification form state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [quoteBudgetRange, setQuoteBudgetRange] = useState('500-1000');

  // Multi-step custom cost estimator inside detail page
  const [estimatorPagesCount, setEstimatorPagesCount] = useState<number>(5);
  const [estimatorNeedsSEO, setEstimatorNeedsSEO] = useState<boolean>(true);
  const [estimatorNeedsAuth, setEstimatorNeedsAuth] = useState<boolean>(false);
  const [estimatorSpeedAudit, setEstimatorSpeedAudit] = useState<boolean>(true);
  const [estimatedCost, setEstimatedCost] = useState<number>(250);

  // Deep Link & tab integration
  useEffect(() => {
    if (isHomePage) return;
    const checkServiceDetailsUpdate = () => {
      const target = localStorage.getItem('webzone_target_service_details_id');
      if (target) {
        if (target === 'srv-marketing') {
          // Direct to marketing sub page
          localStorage.removeItem('webzone_target_service_details_id');
          setActiveTab('custom-services');
          return;
        }
        const matched = catalogServicesData.find(s => s.id === target);
        if (matched) {
          setSelectedService(matched);
          localStorage.removeItem('webzone_target_service_details_id');
        }
      }
    };

    checkServiceDetailsUpdate();
    window.addEventListener('storage', checkServiceDetailsUpdate);
    const detailTimer = setInterval(checkServiceDetailsUpdate, 150);

    return () => {
      window.removeEventListener('storage', checkServiceDetailsUpdate);
      clearInterval(detailTimer);
    };
  }, [isHomePage]);

  useEffect(() => {
    const checkTabUpdate = () => {
      const updated = localStorage.getItem('webzone_target_services_tab') as any;
      if (updated) {
        if (updated === 'catalog' || updated === 'all') {
          setActiveTab('custom-services');
        } else if (updated === 'google-business') {
          setActiveTab('google-business');
        } else if (updated === 'growth-package') {
          setActiveTab('growth-package');
        } else if (updated === 'digital-web-dev') {
          setActiveTab('digital-web-dev');
        }
        localStorage.removeItem('webzone_target_services_tab');
      }
    };

    checkTabUpdate();
    window.addEventListener('storage', checkTabUpdate);
    const timer = setInterval(checkTabUpdate, 150);

    return () => {
      window.removeEventListener('storage', checkTabUpdate);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('webzone_services_current_tab_cache', activeTab);
    window.dispatchEvent(new Event('storage'));
  }, [activeTab]);

  // Live recalculation for Project Cost Estimator
  useEffect(() => {
    if (!selectedService) return;
    let base = selectedService.startingPrice;
    base += (estimatorPagesCount - 1) * 20; 
    if (estimatorNeedsSEO) base += 49;
    if (estimatorNeedsAuth) base += 99;
    if (estimatorSpeedAudit) base += 39;
    setEstimatedCost(base);
  }, [selectedService, estimatorPagesCount, estimatorNeedsSEO, estimatorNeedsAuth, estimatorSpeedAudit]);

  // Conversion helpers based on locale currency settings
  const formatPrice = (usdAmount: number) => {
    const rate = currency === 'BDT' ? 115 : currency === 'SAR' ? 3.75 : 1;
    const symbol = currency === 'BDT' ? '৳' : currency === 'SAR' ? 'SAR ' : '$';
    return `${symbol}${Math.round(usdAmount * rate).toLocaleString()}`;
  };

  // Filter Categories Toggles
  const handleToggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleToggleBudget = (bud: string) => {
    setSelectedBudgets(prev => 
      prev.includes(bud) ? prev.filter(b => b !== bud) : [...prev, bud]
    );
  };

  const handleToggleTimeline = (time: string) => {
    setSelectedTimelines(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleToggleLevel = (lvl: string) => {
    setSelectedLevels(prev => 
      prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]
    );
  };

  // Filter Custom Services list live
  const filteredCatalogServices = catalogServicesData.filter(srv => {
    // Search Box Match (Search websites, SEO, Laravel, hosting, SMM...)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const txtToSearch = `${srv.title} ${srv.titleBn} ${srv.titleAr} ${srv.shortDescription} ${srv.technologies.join(' ')}`.toLowerCase();
      if (!txtToSearch.includes(q)) return false;
    }

    // Horizontal Scroll Category Bar Match
    if (activeCategoryFilter !== 'all') {
      if (srv.category !== activeCategoryFilter) return false;
    }

    // Category Sidebar Match
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(srv.category)) return false;
    }

    // Budget Match
    if (selectedBudgets.length > 0) {
      if (!selectedBudgets.includes(srv.projectBudgetCategory)) return false;
    }

    // Delivery Days Range Match
    if (selectedTimelines.length > 0) {
      if (!selectedTimelines.includes(srv.deliveryTimelineCategory)) return false;
    }

    // Service Levels Match
    if (selectedLevels.length > 0) {
      if (!selectedLevels.includes(srv.serviceLevel)) return false;
    }

    // Homepage specific filter type selector matches matching new kebab-case keys
    if (isHomePage && homeSelectedType !== 'all') {
      if (homeSelectedType === 'Web Development') {
        const matches = srv.category === "website-development" || srv.category === "ecommerce" || srv.category === "news-portal" || srv.category === "school-management" || srv.category === "wordpress-services";
        if (!matches) return false;
      } else if (homeSelectedType === 'Digital Marketing') {
        const matches = srv.category === "digital-marketing" || srv.category === "graphic-design";
        if (!matches) return false;
      } else if (homeSelectedType === 'Custom Scripting') {
        const matches = srv.category === "custom-development" || srv.category === "business-software" || srv.category === "whmcs-solutions" || srv.category === "mobile-app-development" || srv.category === "hosting-services";
        if (!matches) return false;
      }
    }

    return true;
  });

  // Filter Fixed Packages live
  const filteredFixedPackages = fixedPackagesData.filter(pkg => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const txtToSearch = `${pkg.name} ${pkg.nameBn} ${pkg.nameAr} ${pkg.shortDescription}`.toLowerCase();
      if (!txtToSearch.includes(q)) return false;
    }

    if (pkgSelectedCategory !== 'all') {
      if (pkg.category !== pkgSelectedCategory) return false;
    }

    if (pkg.price > pkgMaxPrice) return false;
    if (pkg.deliveryDays > pkgMaxDelivery) return false;

    return true;
  }).sort((a, b) => {
    if (pkgSortBy === 'price-low') return a.price - b.price;
    if (pkgSortBy === 'price-high') return b.price - a.price;
    // 'best-selling' pattern, dummy sort
    if (pkgSortBy === 'best-selling') return b.revisions - a.revisions;
    return 0;
  });

  // Submit Inquiry/Inquire on Custom service
  const handleCustomQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quotePhone) {
      triggerToast(language === 'bn' ? "দয়া করে আপনার নাম ও মোবাইল নাম্বার দিন!" : "Please provide your name and phone number!");
      return;
    }

    // Capture simulated client service order record
    const simulatedOrderId = "ord-spec-" + Date.now();
    addSimulatedServiceOrder({
      id: simulatedOrderId,
      itemTitle: selectedService ? `${selectedService.title} Spec Quote` : "Bespoke System Integration Requirements",
      price: selectedService ? estimatedCost : 500,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "Custom Service Quote Engine",
      paymentStatus: 'pending'
    });

    triggerToast(language === 'bn' 
      ? "আপনার গিগ স্পেক রিকোয়েস্ট সফলভাবে সাবমিট হয়েছে! আমাদের আইটি ম্যানেজার শীঘ্রই যোগাযোগ করবেন।" 
      : "Your system specs submitted successfully! An IT operations lead will consult you via WhatsApp shortly.");
    
    // Reset states
    setQuoteName('');
    setQuotePhone('');
    setQuoteEmail('');
    setQuoteDesc('');
    setIsQuoteModalOpen(false);
  };

  const handleQuickBookPackage = (pkg: FixedPackage) => {
    addSimulatedServiceOrder({
      id: "ord-fixed-" + Date.now(),
      serviceId: pkg.id,
      itemTitle: `${pkg.name} (${pkg.tier.toUpperCase()} Ready Package)`,
      price: pkg.price,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "Fiverr SSL Checkout Sync",
      paymentStatus: 'pending'
    });
    triggerToast(language === 'bn'
      ? `${pkg.nameBn} কার্টে যোগ হয়েছে! সম্পূর্ণ বিলিং ভেরিফিকেশন ৫-১০ মিনিটে সম্পন্ন হবে।`
      : `${pkg.name} added to cart. Re-routing checkout gateway with security parameters.`);
  };

  return (
    <section className={`${selectedService ? 'pt-1 pb-8 md:pt-1.5 md:pb-14' : 'py-8 md:py-14'} max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 ${selectedService ? 'space-y-4' : 'space-y-12'}`}>
      
      {/* 1. HERO SECTION WITH SEARCH & PRIMARY ACTION */}
      {!selectedService && (
        <div className="relative max-w-[1360px] mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-white text-neutral-900 border border-neutral-200/80 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 dark:text-white dark:border-neutral-800 p-5 sm:p-10 md:p-16 overflow-hidden shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-cover bg-center opacity-[0.03] dark:opacity-10 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80')]" />
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-indigo-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 max-w-6xl text-center mx-auto space-y-6">
            <span className="inline-flex items-center gap-1 px-2 py-1 sm:gap-1.5 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-black font-mono tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/20 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{language === 'bn' ? 'ওয়েবজোনবিডি সার্ভিস অপ্টিমাইজেশন ২০২৬' : 'WebzoneBD Premium Hybrid Services Catalog'}</span>
            </span>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight font-display leading-[1.1] text-neutral-900 dark:text-white">
              {language === 'bn' 
                ? "আমাদের সকল আইটি ও কাস্টম সফটওয়্যার রেডি সリューション এক নজরে"
                : "Our All Services & Ready-to-Order Packages in One Place"}
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {language === 'bn'
                ? "আপনার ব্যবসার গতি বাড়াতে কাস্টম প্রজেক্ট শুরু করুন অথবা ফিক্সড প্রাইজে আমাদের ফাইবার ও হোস্টিংগার স্টাইল রেডি-টু-ইউজ প্যাকেজ কিনুন!"
                : "Choose a Custom Project or Instantly Purchase Fixed-Price Packages for Your Business."}
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2">
              <a 
                href="#services-tabs-anchor"
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-500 text-[10px] sm:text-xs font-black rounded-xl cursor-pointer shadow-lg transform transition active:scale-95 flex items-center gap-1.5 text-white"
              >
                <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{language === 'bn' ? 'সার্ভিস ব্রাউজ করুন' : 'Browse Services'}</span>
              </a>

              <button 
                onClick={() => {
                  setSelectedService(null);
                  setIsQuoteModalOpen(true);
                }}
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-750 text-[10px] sm:text-xs font-black rounded-xl cursor-pointer transform transition active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'bn' ? 'কাস্টম কোটেশন রিকোয়েস্ট' : 'Request Custom Quote'}</span>
              </button>

              <a 
                href="https://wa.me/966570511931"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-black rounded-xl cursor-pointer shadow-md transform transition active:scale-95 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপ করুন' : 'Contact via WhatsApp'}</span>
              </a>
            </div>

            {/* Fast Launch Route Buttons (Exactly 3 Column Selection Cards for categories) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto pt-4 text-left">
              <button
                onClick={() => {
                  setActiveTab('digital-web-dev');
                  setTimeout(() => {
                    const anchor = document.getElementById('services-tabs-anchor');
                    if (anchor) {
                      anchor.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="relative group overflow-hidden p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 dark:bg-neutral-950 dark:hover:bg-neutral-900 dark:border-neutral-800 transition-all duration-200 cursor-pointer shadow-md dark:shadow-lg active:scale-98 flex items-center gap-3 sm:gap-4 text-left"
              >
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                  <Globe className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                    {language === 'bn' ? "ডিজিটাল ওয়েব ডেভেলপমেন্ট" : "Digital Web Development"}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'bn' ? "স্টার্টআপ ও এজেন্সির জন্য প্রিমিয়াম ওয়েব সলিউশন" : "Premium startup & corporate web apps"}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('google-business');
                  setTimeout(() => {
                    const anchor = document.getElementById('services-tabs-anchor');
                    if (anchor) {
                      anchor.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className={`relative group overflow-hidden p-3.5 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer shadow-md dark:shadow-lg active:scale-98 flex items-center gap-3 sm:gap-4 text-left ${
                  activeTab === 'google-business'
                    ? 'bg-amber-500/10 border-amber-500/80 dark:bg-amber-950/40 dark:border-amber-500'
                    : 'bg-white/80 hover:bg-white border border-neutral-200/80 dark:bg-neutral-950 dark:hover:bg-slate-900 dark:border-neutral-800'
                }`}
              >
                <div className="p-2 sm:p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <CheckCircle className="w-4 h-4 sm:w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {language === 'bn' ? "গুগল বিজনেস সেটআপ" : "Google Business Setup"}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'bn' ? "গুগল ম্যাপস ভেরিফিকেশন ও লোকাল অপ্টিমাইজেশন" : "Verified Google Business profile map setup"}
                  </p>
                </div>
              </button>

              {/* Card 3: Business Growth Packages */}
              <button
                onClick={() => {
                  setActiveTab('growth-package');
                  setTimeout(() => {
                    const anchor = document.getElementById('services-tabs-anchor');
                    if (anchor) {
                      anchor.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className={`relative group overflow-hidden p-3.5 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer shadow-md dark:shadow-lg active:scale-98 flex items-center gap-3 sm:gap-4 text-left ${
                  activeTab === 'growth-package'
                    ? 'bg-purple-500/10 border-purple-500/80 dark:bg-purple-950/40 dark:border-purple-500'
                    : 'bg-white/80 hover:bg-white border border-neutral-200/80 dark:bg-neutral-950 dark:hover:bg-slate-900 dark:border-neutral-800'
                }`}
              >
                <div className="p-2 sm:p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-purple-650 dark:group-hover:text-purple-400">
                    {language === 'bn' ? "বিজনেস গ্রোথ প্যাকেজস" : "Business Growth Packages"}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'bn' ? "ব্যবসা দ্রুত বৃদ্ধি করার আল্টিমেট মার্কেটিং প্যাকেজ" : "Full-suite digital optimization and marketing"}
                  </p>
                </div>
              </button>
            </div>

            {/* Live Interactive Search Box */}
            {!isHomePage && (
              <div className="max-w-[920px] mx-auto pt-6">
                <div className="relative rounded-xl sm:rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-neutral-300 dark:border-white/15 p-1.5 sm:p-2 flex items-center shadow-md focus-within:border-blue-600 dark:focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-blue-600 dark:focus-within:ring-cyan-400 transition-all">
                  <Search className="w-4.5 h-4.5 sm:w-5 h-5 text-neutral-400 dark:text-slate-400 ml-2.5 sm:ml-3" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'bn' 
                      ? "সফটওয়্যার, এসইও, লারাভেল, হোস্টিং, ওয়ার্ডপ্রেস বা ফেসবুক মার্কেটিং খুঁজুন..." 
                      : "Search websites, SEO, Laravel, hosting, marketing services..."}
                    className="w-full bg-transparent border-0 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-400 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 focus:outline-none focus:ring-0"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-neutral-400 hover:text-neutral-600 dark:text-slate-400 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anchor point to snap view */}
      <div id="services-tabs-anchor" />

      {/* 2. SERVICES TAB SELECTION SECTION */}
      {!selectedService && (
        <div className="space-y-10">
          
          {/* Subpage menu tabs navigation (Horizontal, Full-Wide layout with custom UI gradients) */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 mb-8">
            <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-2 sm:gap-3 p-2 bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/5 w-full overflow-x-auto scrollbar-none select-none shadow-xl shadow-neutral-100/40 dark:shadow-none">
              {[
                ...(!isHomePage ? [{ id: 'custom-services', label: 'All Custom Services', bn: 'সব কাস্টম সার্ভিস ক্যাটালগ', emoji: '🗂️' }] : []),
                { id: 'digital-web-dev', label: 'Digital Web Development', bn: 'ডিজিটাল ওয়েব ডেভেলপমেন্ট', emoji: '💻' },
                { id: 'google-business', label: 'Google Business Setup', bn: 'গুগল মাই বিজনেস সেটআপ', emoji: '📍' },
                { id: 'growth-package', label: 'Business Growth Packages', bn: 'বিজনেস গ্রোথ প্যাকেজস', emoji: '📈' }
              ].map(tabItem => {
                const isActive = activeTab === tabItem.id;
                
                // Set custom UI gradients matching each service type perfectly
                let activeGradientClass = '';
                if (tabItem.id === 'custom-services') {
                  activeGradientClass = 'bg-gradient-to-r from-emerald-550 via-teal-550 to-emerald-500 text-white shadow-xl shadow-emerald-550/20';
                } else if (tabItem.id === 'digital-web-dev') {
                  activeGradientClass = 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-blue-500/20';
                } else if (tabItem.id === 'google-business') {
                  activeGradientClass = 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-xl shadow-amber-500/20';
                } else if (tabItem.id === 'growth-package') {
                  activeGradientClass = 'bg-gradient-to-r from-purple-600 via-fuchsia-650 to-indigo-600 text-white shadow-xl shadow-purple-500/20';
                }

                return (
                  <button
                    key={tabItem.id}
                    onClick={() => {
                      setActiveTab(tabItem.id as any);
                      setTimeout(() => {
                        document.getElementById('services-tabs-anchor')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer shrink-0 ${
                      isActive 
                        ? `${activeGradientClass} scale-102 border-0` 
                        : 'bg-white/40 dark:bg-slate-900/30 text-neutral-600 dark:text-slate-350 hover:bg-white/90 dark:hover:bg-slate-900/80 hover:text-neutral-900 dark:hover:text-white border-0 hover:shadow-md'
                    }`}
                  >
                    <span>{tabItem.emoji}</span>
                    <span>{language === 'bn' ? tabItem.bn : tabItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {activeTab === 'custom-services' && (
            <div className="space-y-8 text-left">

              {/* HOMEPAGE SERVICE CATEGORY FILTER BAR */}
              {isHomePage && (
                <div id="homepage-service-filter-bar" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 bg-neutral-50/50 dark:bg-slate-900/30 rounded-2xl border border-neutral-200/50 dark:border-slate-800/50 max-w-5xl mx-auto mb-6">
                  {homeFiltersList.map((filter) => {
                    const IconComp = filter.icon;
                    const isActive = homeSelectedType === filter.id;
                    const labelText = language === 'bn' 
                      ? filter.labelBn 
                      : language === 'ar' 
                      ? filter.labelAr 
                      : filter.label;
                    
                    return (
                      <button
                        key={filter.id}
                        id={`filter-btn-${filter.id.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setHomeSelectedType(filter.id)}
                        className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 scale-102 border border-transparent' 
                            : 'bg-white/80 dark:bg-slate-950/80 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-900 border border-neutral-200 dark:border-slate-850 hover:border-neutral-300'
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isActive ? 'rotate-12 scale-110' : 'group-hover:scale-110'}`} />
                        <span>{labelText}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* FIVERR STYLE HORIZONTAL SCROLLING CATEGORY NAVIGATION - STICKY UNDER MAIN STICKY HEADER */}
              <div className="sticky top-[64px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-y border-neutral-200/80 dark:border-slate-800/80 py-3 -mx-4 px-4 overflow-x-auto scrollbar-none flex items-center gap-3 select-none shadow-sm dark:shadow-slate-950/25 transition-all duration-300">
                {horizontalCategories.map((cat) => {
                  const IconComponent = cat.icon;
                  const isActive = activeCategoryFilter === cat.id;
                  const localizedLabel = language === 'bn' ? cat.bn : language === 'ar' ? cat.ar : cat.label;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-500/10'
                          : 'bg-neutral-50 dark:bg-slate-950/65 text-neutral-600 dark:text-slate-350 hover:bg-neutral-100 dark:hover:bg-slate-900 border border-neutral-200/80 dark:border-slate-800'
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                      <span>{localizedLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* SERVICE CARDS LISTING BLOCK */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-6">
                  {filteredCatalogServices.length === 0 ? (
                    <div className="col-span-full text-center py-16 p-8 rounded-3xl bg-neutral-900/5 dark:bg-slate-950/20 border border-dashed border-neutral-300 dark:border-slate-800">
                      <HelpCircle className="w-12 h-12 text-blue-500 mx-auto animate-bounce" style={{ animationDuration: '3s' }} />
                      <p className="mt-4 text-sm font-bold text-neutral-600 dark:text-slate-350 font-sans">
                        {language === 'bn' ? 'অনুরূপ কোনো কাস্টম সার্ভিস খুঁজে পাওয়া যায়নি।' : 'No matching Custom Services found with active filters.'}
                      </p>
                      <button
                        onClick={() => {
                          setActiveCategoryFilter('all');
                          setSearchQuery('');
                        }}
                        className="mt-4 px-4 py-2 bg-neutral-100 dark:bg-slate-850 hover:bg-neutral-200 dark:hover:bg-slate-800 text-xs text-blue-600 dark:text-cyan-400 font-extrabold rounded-xl border border-neutral-350 dark:border-slate-800 cursor-pointer"
                      >
                        {language === 'bn' ? 'ফিল্টার পরিষ্কার করুন' : 'Clear Filters to View All'}
                      </button>
                    </div>
                  ) : (
                    filteredCatalogServices.slice(0, visibleCount).map(srv => {
                      // Dynamically calculate special label
                      const getSpecialLabel = (item: CatalogService) => {
                        if (item.projectsCompleted >= 300) return { text: language === 'bn' ? "বেস্ট সেলার" : "Best Seller", color: "bg-amber-500 text-white" };
                        if (item.projectsCompleted >= 150) return { text: language === 'bn' ? "জনপ্রিয়" : "Popular", color: "bg-rose-500 text-white" };
                        if (item.rating >= 5.0 && item.projectsCompleted >= 40) return { text: language === 'bn' ? "ফিচার্ড" : "Featured", color: "bg-blue-600 text-white animate-pulse" };
                        if (item.projectsCompleted <= 80) return { text: language === 'bn' ? "নতুন সার্ভিস" : "New Service", color: "bg-emerald-600 text-white" };
                        return null;
                      };
                      const sLabel = getSpecialLabel(srv);

                      return (
                        <div 
                          key={srv.id}
                          className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-neutral-250 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.18)] dark:hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.28)] hover:border-blue-500/60 hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col justify-between"
                        >
                          {/* Image Box */}
                          <div className="relative h-52 overflow-hidden bg-slate-950 shrink-0">
                            <img 
                              src={srv.thumbnail || srv.image} 
                              alt={srv.title}
                              loading="lazy"
                              className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                            />
                            {/* Dark gradient blur over image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

                            {/* Special Label */}
                            {sLabel && (
                              <div className="absolute top-3 right-3 z-10">
                                <span className={`px-2.5 py-1 text-[9px] font-black tracking-wider rounded-md uppercase shadow-md ${sLabel.color}`}>
                                  {sLabel.text}
                                </span>
                              </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute bottom-3 left-3 z-10">
                              <span className="px-2.5 py-0.5 bg-neutral-900/80 backdrop-blur-md text-white border border-white/10 text-[9px] font-mono rounded tracking-wider uppercase font-bold">
                                {language === 'bn' ? srv.categoryBn : srv.category}
                              </span>
                            </div>

                            {/* Rating badge */}
                            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              <Star className="w-3 h-3 fill-white text-white" />
                              <span>{srv.rating}</span>
                            </div>

                            {/* Simple inline hover peek button */}
                            <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10 pointer-events-none">
                              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-neutral-900 text-[10px] font-black rounded-lg shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                {language === 'bn' ? 'বিস্তারিত দেখুন 👁️' : 'Click for Details 👁️'}
                              </span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono">
                                <span>WebzoneBD IT</span>
                                <span className="flex items-center gap-1 text-slate-550">
                                  <span>{srv.projectsCompleted}+ {language === 'bn' ? 'প্রজেক্ট' : 'done'}</span>
                                </span>
                              </div>

                              <h3 
                                onClick={() => handleSelectService(srv)}
                                className="cursor-pointer text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 transition-colors line-clamp-1 leading-tight h-6"
                              >
                                {language === 'bn' ? srv.titleBn : language === 'ar' ? srv.titleAr : srv.title}
                              </h3>

                              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-8 md:h-10">
                                {language === 'bn' ? srv.shortDescriptionBn : srv.shortDescription}
                              </p>
                            </div>

                            {/* Key Features Included Section */}
                            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                              <span className="text-[9px] font-black text-neutral-400 dark:text-slate-550 uppercase tracking-wider block mb-1.5">
                                {language === 'bn' ? 'সার্ভিস সুবিধাসমূহ:' : 'Key Deliverables:'}
                              </span>
                              <ul className="space-y-1 min-h-[64px]">
                                {(language === 'bn' ? srv.featuresBn : srv.features).slice(0, 3).map((feat, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-neutral-700 dark:text-slate-300">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Technologies tag line */}
                            <div className="flex flex-wrap gap-1 pt-1 h-12 overflow-hidden items-start">
                              {srv.technologies.slice(0, 4).map(tech => (
                                <span key={tech} className="bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-350 font-mono text-[9px] px-2 py-0.5 rounded border border-neutral-200/30 dark:border-slate-700/30">
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {/* Stats Line with Clock and Work Progress */}
                            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-t border-slate-100 dark:border-slate-800/80 pt-3 text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-neutral-400 dark:text-slate-550" />
                                <div>
                                  <span className="block text-[8px] uppercase tracking-wide leading-none">{language === 'bn' ? 'ডেলিভারি:' : 'Delivery:'}</span>
                                  <span className="font-extrabold text-neutral-700 dark:text-slate-200">
                                    {language === 'bn' ? `${srv.deliveryDays} দিন` : `${srv.deliveryDays} Days`}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-neutral-400 dark:text-slate-550" />
                                <div>
                                  <span className="block text-[8px] uppercase tracking-wide leading-none">{language === 'bn' ? 'পদ্ধতি:' : 'Level:'}</span>
                                  <span className="font-extrabold text-neutral-700 dark:text-slate-200 font-sans">
                                    {language === 'bn' ? srv.serviceLevelBn : srv.serviceLevel}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Price Label Area */}
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                              <div>
                                <span className="text-[9px] font-bold text-slate-405 uppercase tracking-widest block leading-none">{language === 'bn' ? 'শুরু মাত্র' : 'STARTING AT'}</span>
                                <span className="text-xl font-black text-blue-600 dark:text-cyan-400 font-mono">
                                  {formatPrice(srv.startingPrice)}
                                </span>
                              </div>

                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 dark:bg-slate-800 text-[9px] font-bold text-blue-600 dark:text-cyan-300 uppercase leading-none border border-blue-100 dark:border-slate-705 font-mono">
                                SLA Guarantee
                              </span>
                            </div>
                          </div>

                          {/* Footer Actions Panel */}
                          <div className="p-4 bg-neutral-50 dark:bg-slate-950/40 border-t border-neutral-150 dark:border-slate-800/60 space-y-2 mt-auto">
                            <div className="flex gap-2">
                              {/* View Details */}
                              <button
                                onClick={() => handleSelectService(srv)}
                                className="flex-1 py-2.5 bg-neutral-200/60 hover:bg-neutral-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-neutral-850 dark:text-slate-200 text-[11px] font-bold rounded-xl transition-all duration-200 text-center cursor-pointer flex items-center justify-center gap-1 border border-neutral-300/40 dark:border-slate-700"
                              >
                                <span>{language === 'bn' ? 'বিস্তারিত তথ্য' : 'View Details'}</span>
                              </button>

                              {/* Get Quote */}
                              <button
                                onClick={() => {
                                  setSelectedService(srv);
                                  setIsQuoteModalOpen(true);
                                }}
                                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 dark:bg-slate-900/65 dark:hover:bg-slate-900 text-white text-[11px] font-bold rounded-xl transition-all duration-200 border border-neutral-700 hover:border-neutral-600 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>{language === 'bn' ? 'কোটেশন রিকোয়েস্ট' : 'Get Quote'}</span>
                              </button>
                            </div>

                            {/* Order Now button (Premium conversion-focused) */}
                            <button
                              onClick={() => {
                                addSimulatedServiceOrder({
                                  id: "ord-fiverr-" + Date.now(),
                                  serviceId: srv.id,
                                  itemTitle: `${srv.title} (Instant Direct Order)`,
                                  price: srv.startingPrice,
                                  date: new Date().toISOString().split('T')[0],
                                  paymentMethod: "Fiverr SSL Checkout Sync",
                                  paymentStatus: 'pending'
                                });
                                triggerToast(language === 'bn' 
                                  ? `"${srv.titleBn}" অর্ডার রিকোয়েস্ট প্লেসড! ২৫ মিনিটে ডেভ দল আপনার সাথে যুক্ত হবে।`
                                  : `Order Placed for ${srv.title}! Our team will connect with you shortly.`);
                              }}
                              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>{language === 'bn' ? 'অর্ডার দিন' : 'Order Now'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* BOTTOM PAGINATION: AJAX LOAD MORE CONTROL */}
                {visibleCount < filteredCatalogServices.length && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 6)}
                      className="group px-6 py-3 bg-white dark:bg-slate-900 border border-neutral-250 dark:border-slate-800 text-neutral-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <span>{language === 'bn' ? 'আরোও সার্ভিস লোড করুন' : 'Load More Services'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FIXED-PRICE PACKAGES (FIVERR STYLE MARKETPLACE WITH HIGHLIGHTED HERO CARDS) */}
          {activeTab === 'fixed-packages' && (
            <div className="space-y-12">
              
              {/* Featured 3 Highlighted Packages Block on top */}
              <div className="space-y-4">
                <div className="text-left border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white">
                    {language === 'bn' ? "🔥 কুইক লঞ্চ বেস্ট সেলিং ৩টি রেডি সার্ভিস" : "🔥 Recommended Fast-Launch Packages"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? "কোনো হিডেন শর্ত ছাড়াই সাশ্রয়ী মূল্যে ইন্সট্যান্ট অর্ডার করে আজই কাজ সম্পন্ন করিয়ে নিন।" : "Launch instantly with zero complexity. Discounted tiers fully verified by our engineering QA."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPackagesData.map(fpObj => (
                    <div 
                      key={fpObj.id}
                      className="rounded-2xl bg-slate-950 text-white border border-slate-800 p-5 overflow-hidden flex flex-col justify-between text-left relative group hover:-translate-y-1 duration-300 shadow-lg"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-amber-400 to-rose-500" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-rose-500 rounded text-[9px] font-mono font-black tracking-widest text-white uppercase">
                            {fpObj.discountPercent}% OFF SAVE
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {fpObj.totalOrders}+ orders
                          </span>
                        </div>

                        <div className="relative h-28 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                          <img 
                            src={fpObj.image} 
                            alt={fpObj.title}
                            className="w-full h-full object-cover group-hover:scale-105 duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition">
                            {language === 'bn' ? fpObj.titleBn : fpObj.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">
                            {language === 'bn' ? fpObj.descriptionBn : fpObj.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block leading-none">FLAT PRICE</span>
                          <span className="text-lg font-black text-emerald-400 font-mono leading-none">
                            {formatPrice(fpObj.price)}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            // Find and add simulated order
                            addSimulatedServiceOrder({
                              id: "ord-featured-" + Date.now(),
                              itemTitle: language === 'bn' ? fpObj.titleBn : fpObj.title,
                              price: fpObj.price,
                              date: new Date().toISOString().split('T')[0],
                              paymentMethod: "Fiverr SSL Checkout Sync",
                              paymentStatus: 'pending'
                            });
                            triggerToast(language === 'bn' ? `${fpObj.titleBn} বুকড হয়েছে!` : `${fpObj.title} added to checkout.`);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-black rounded-lg hover:opacity-90 active:scale-95 text-white"
                        >
                          {language === 'bn' ? 'অনলাইন ক্রয় 🛒' : 'Order Now 🛒'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Fiverr Style Marketplace Listings Section */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Horizontal Quick Filters Control Header */}
                <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between text-xs text-left">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-black font-mono text-[10px] uppercase text-neutral-400 tracking-wider flex items-center gap-1.5 shrink-0">
                      <Sliders className="w-4 h-4 text-purple-600" />
                      <span>{language === 'bn' ? 'ডিজিটাল স্টোর ক্যাটাগরি:' : 'Fiverr Category:'}</span>
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {[
                        { key: 'all', val: 'All Gigs', bn: 'সব রেডি গিগ' },
                        { key: 'websites', val: 'Websites', bn: 'ওয়েবসাইট' },
                        { key: 'seo', val: 'SEO Services', bn: 'এসইও সার্ভিস' }
                      ].map(cat => (
                        <button
                          key={cat.key}
                          onClick={() => setPkgSelectedCategory(cat.key)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition font-mono uppercase ${
                            pkgSelectedCategory === cat.key
                              ? 'bg-purple-600 text-white shadow'
                              : 'bg-white dark:bg-slate-850 text-slate-705 dark:text-slate-350 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          {language === 'bn' ? cat.bn : cat.val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing slider & deliver range limits */}
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="space-y-1 font-mono text-[10px]">
                      <span className="text-slate-400 text-[9px] uppercase font-bold block">Max Budget: {formatPrice(pkgMaxPrice)}</span>
                      <input 
                        type="range" 
                        min="30" 
                        max="1000" 
                        value={pkgMaxPrice} 
                        onChange={(e) => setPkgMaxPrice(parseInt(e.target.value))} 
                        className="h-1 bg-neutral-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    <div className="space-y-1 font-mono text-[10px]">
                      <span className="text-slate-400 text-[9px] uppercase font-bold block">Delivery: {pkgMaxDelivery} Days</span>
                      <input 
                        type="range" 
                        min="2" 
                        max="30" 
                        value={pkgMaxDelivery} 
                        onChange={(e) => setPkgMaxDelivery(parseInt(e.target.value))} 
                        className="h-1 bg-neutral-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    <div className="space-y-1 font-mono text-[10px]">
                      <span className="text-slate-400 text-[9px] uppercase font-bold block">Sort By</span>
                      <select 
                        value={pkgSortBy}
                        onChange={(e: any) => setPkgSortBy(e.target.value)}
                        className="bg-white dark:bg-slate-850 text-[10px] rounded border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-600 font-bold dark:text-slate-200"
                      >
                        <option value="all">Default Gigs</option>
                        <option value="best-selling">Best Selling</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Fiverr-Style Package Card Grid */}
                <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFixedPackages.length === 0 ? (
                    <div className="col-span-3 text-center py-12 p-6 rounded-2xl bg-neutral-50 dark:bg-slate-900 border border-dashed border-neutral-300 dark:border-slate-800">
                      <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
                      <p className="mt-2 text-xs font-bold text-neutral-500 dark:text-slate-400">
                        {language === 'bn' ? 'অনুরূপ কোনো রেডি গিগ খুঁজে পাওয়া যায়নি।' : 'No matching Fiverr Gigs available.'}
                      </p>
                    </div>
                  ) : (
                    filteredFixedPackages.map(pkg => {
                      const tierHeaderColors = {
                        basic: { ring: "border-purple-600/35", headerBg: "bg-purple-900/10 text-purple-705 dark:text-purple-300", badgeColor: "bg-purple-500 text-white", label: "🟣 Basic Package" },
                        standard: { ring: "border-amber-500/35", headerBg: "bg-amber-500/10 text-amber-705 dark:text-amber-300", badgeColor: "bg-amber-500 text-white", label: "🟡 Standard Package" },
                        premium: { ring: "border-rose-600/35", headerBg: "bg-rose-900/10 text-rose-705 dark:text-rose-300", badgeColor: "bg-rose-500 text-white", label: "🔴 Premium Package" }
                      };
                      const tierData = tierHeaderColors[pkg.tier] || tierHeaderColors.basic;

                      return (
                        <div 
                          key={pkg.id}
                          className={`rounded-2xl bg-white dark:bg-slate-900 border ${tierData.ring} hover:border-purple-500 hover:shadow-xl duration-300 flex flex-col justify-between overflow-hidden shadow-sm text-left`}
                        >
                          <div className={`p-4 ${tierData.headerBg} flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-800`}>
                            <span className="text-xs font-black uppercase tracking-wider font-mono flex items-center gap-1">
                              <span>{tierData.label}</span>
                            </span>
                            {pkg.badge && (
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${tierData.badgeColor}`}>
                                {language === 'bn' ? pkg.badgeBn : pkg.badge}
                              </span>
                            )}
                          </div>

                          <div className="p-6 space-y-4 flex-1">
                            <div className="space-y-1">
                              <h4 className="text-base font-extrabold text-neutral-900 dark:text-white leading-normal">
                                {language === 'bn' ? pkg.nameBn : pkg.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                                {language === 'bn' ? pkg.shortDescriptionBn : pkg.shortDescription}
                              </p>
                            </div>

                            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                              {formatPrice(pkg.price)}
                            </p>

                            {/* Features list checklist */}
                            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                              {(language === 'bn' ? pkg.featuresBn : pkg.features).map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[10px]">
                                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                                  <span className="text-slate-707 dark:text-slate-300 font-bold">{feat}</span>
                                </div>
                              ))}
                            </div>

                            {/* Service and operational specifications */}
                            <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                              <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded text-center">
                                <span className="block opacity-75">{language === 'bn' ? 'ডেলিভারি' : 'Delivery'}</span>
                                <span className="font-extrabold text-neutral-800 dark:text-slate-200">{pkg.deliveryDays} Days</span>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded text-center">
                                <span className="block opacity-75">{language === 'bn' ? 'রিভিশন' : 'Revisions'}</span>
                                <span className="font-extrabold text-neutral-800 dark:text-slate-200">{pkg.revisions} Total</span>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded text-center">
                                <span className="block opacity-75">{language === 'bn' ? 'সাপোর্ট' : 'Support'}</span>
                                <span className="font-extrabold text-neutral-800 dark:text-slate-200">{pkg.supportDays} Days</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/65 flex gap-2">
                            <button
                              onClick={() => {
                                // Simulate detail popup
                                setQuickViewService(null);
                                addSimulatedServiceOrder({
                                  id: "ord-pkg-" + Date.now(),
                                  itemTitle: `${pkg.name} (${pkg.tier.toUpperCase()}) Details Check`,
                                  price: pkg.price,
                                  date: new Date().toISOString().split('T')[0],
                                  paymentMethod: "Fiverr SSL Checkout Sync",
                                  paymentStatus: 'pending'
                                });
                                triggerToast(language === 'bn' ? `ডকুমেন্টেশন রিকোয়েস্ট সফল!` : `Spec request logged!`);
                              }}
                              className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[9px] font-mono font-black rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              View Details
                            </button>

                            <button
                              onClick={() => handleQuickBookPackage(pkg)}
                              className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black rounded-lg hover:opacity-95 shadow transform transition active:scale-95 flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'অনলাইন ক্রয়' : 'Order Now'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GMB MAPS TAB RE-BIND (PRESERVES PREVIOUS SETUP SEAMLESSLY) */}
          {activeTab === 'google-business' && (
            <div className="animate-in fade-in duration-300">
              <GoogleBusinessService
                language={language}
                theme={theme}
                currency={currency}
                currencySettings={currencySettings}
                addSimulatedServiceOrder={addSimulatedServiceOrder}
                triggerToast={triggerToast}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}

          {/* TAB 4: GROWTH PACKAGE REGISTRY CO-EXIST */}
          {activeTab === 'growth-package' && (
            <div className="animate-in fade-in duration-300">
              <Package language={language} theme={theme} />
            </div>
          )}

          {/* TAB 5: ULTRA PREMIUM DIGITAL WEB DEVELOPMENT */}
          {activeTab === 'digital-web-dev' && (
            <div className="animate-in fade-in duration-300">
              <DigitalWebDevelopment
                language={language}
                theme={theme}
                currency={currency}
                addSimulatedServiceOrder={addSimulatedServiceOrder}
                triggerToast={triggerToast}
                addToCart={addToCart}
                setCartOpen={setCartOpen}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. SERVICE DETAIL PAGE/VIEW (DEEP-LINKED / DIRECT-ROUTED COMPREHENSIVE VIEW) */}
      {!isHomePage && selectedService && (
        <ServiceDetails
          service={selectedService}
          language={language}
          theme={theme}
          onBack={() => setSelectedService(null)}
          onNavigateToService={(srvId) => {
            const matched = catalogServicesData.find(s => s.id === srvId);
            if (matched) setSelectedService(matched);
          }}
          allServices={catalogServicesData}
          addSimulatedServiceOrder={addSimulatedServiceOrder}
          triggerToast={triggerToast}
          addToCart={addToCart}
          setCartOpen={setCartOpen}
        />
      )}

      {false && selectedService && (
        <div className="space-y-8 animate-in fade-in duration-300 text-left">
          {/* Back Action Header bar */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-slate-805 pb-4">
            <button
              onClick={() => setSelectedService(null)}
              className="flex items-center gap-1 text-slate-500 hover:text-neutral-900 dark:hover:text-white font-mono text-xs font-bold cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>{language === 'bn' ? 'সার্ভিস ক্যাটালগে ফিরে যান' : 'Back to Services Catalog'}</span>
            </button>

            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-extrabold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
              Current ID: {selectedService.id}
            </span>
          </div>

          {/* Detail Hero Section */}
          <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-6 md:p-10 border border-slate-850">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${selectedService.thumbnail})` }} />
            
            <div className="relative z-10 max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-600 text-[9px] font-mono font-black uppercase rounded tracking-wider">
                  {selectedService.category}
                </span>

                <span className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedService.rating} Rating</span>
                </span>

                <span className="text-xs text-slate-350 font-mono bg-slate-800/80 px-2 py-0.5 rounded">
                  {selectedService.projectsCompleted}+ completed orders
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display">
                {language === 'bn' ? selectedService.titleBn : selectedService.title}
              </h2>

              <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
                {language === 'bn' ? selectedService.shortDescriptionBn : selectedService.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 pt-3 items-center">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 block tracking-widest leading-none">Starting from</span>
                  <span className="text-2xl font-black font-mono text-emerald-400 leading-none">
                    {formatPrice(selectedService.startingPrice)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      addSimulatedServiceOrder({
                        id: "ord-det-buy-" + Date.now(),
                        serviceId: selectedService.id,
                        itemTitle: selectedService.title,
                        price: selectedService.startingPrice,
                        date: new Date().toISOString().split('T')[0],
                        paymentMethod: "Direct Detail Instant Verification",
                        paymentStatus: 'pending'
                      });
                      triggerToast(language === 'bn' ? "ইনস্ট্যান্ট বুকিং শুরু হয়েছে!" : "Instant booking processed!");
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-lg active:scale-95 transition"
                  >
                    Order Now 🛒
                  </button>

                  <button 
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-black rounded-lg active:scale-95 transition border border-neutral-700"
                  >
                    Request Quote ✉️
                  </button>

                  <a 
                    href="https://wa.me/966570511931" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg active:scale-95 transition flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>WhatsApp Consultation</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout containing Tab Panels & Sticky Right Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: 8 Col Tabs and Navigation content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {[
                  { key: 'overview', val: 'Overview' },
                  { key: 'features', val: 'Features' },
                  { key: 'portfolio', val: 'Portfolio Case Study' },
                  { key: 'packages', val: 'Packages' },
                  { key: 'reviews', val: 'Reviews' },
                  { key: 'faq', val: 'FAQ' }
                ].map(dTab => (
                  <button
                    key={dTab.key}
                    onClick={() => setDetailActiveTab(dTab.key as any)}
                    className={`flex-1 min-w-[110px] py-2 rounded-lg text-[10px] font-bold uppercase transition font-mono ${
                      detailActiveTab === dTab.key
                        ? 'bg-neutral-900 text-white dark:bg-slate-800 dark:text-cyan-400'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    {dTab.val}
                  </button>
                ))}
              </div>

              {/* Tab Outputs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-xs space-y-4">
                {detailActiveTab === 'overview' && (
                  <div className="space-y-4 leading-relaxed">
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Service Infrastructure Architect Overview</h4>
                    <p className="text-slate-600 dark:text-slate-350">
                      {language === 'bn' ? selectedService.fullDescriptionBn : selectedService.fullDescription}
                    </p>
                    <p className="text-slate-400">
                      This service integrates complete container orchestration, robust security sandboxing, and SSL auditing to prevent vulnerabilities. Every deployment code compiles perfectly under manual review and matches modern standard optimization speeds.
                    </p>
                  </div>
                )}

                {detailActiveTab === 'features' && (
                  <div className="space-y-4 text-left">
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Included Features & SLA Commitments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {(language === 'bn' ? selectedService.featuresBn : selectedService.features).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-bold text-slate-705 dark:text-slate-300">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailActiveTab === 'portfolio' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Recent Project Case Study</h4>
                    <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                      WebzoneBD recently completed a massive deployment for <strong>Imran Corp</strong> incorporating beautiful UI screens and modular React frontends on Laravel. The project resulted in a 45% increase in conversion rates, a page load speed audit score of 98 (Google Lighthouse metrics), and zero down-time. Original source archives compiled smoothly and digital assets were made readily downloadable.
                    </p>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                        alt="Portfolio Demo Case"
                        className="w-full h-48 object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {detailActiveTab === 'packages' && (
                  <div className="space-y-4">
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Tier Specifications</h4>
                    <p className="text-slate-500">
                      Standard pricing includes initial environment configs, dynamic landing structures and free consultation support. If specialized database migrations or API proxy routes are required, request a quote to get detailed pricing parameters under standard SLA formats.
                    </p>
                  </div>
                )}

                {detailActiveTab === 'reviews' && (
                  <div className="space-y-4">
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Customer Reviews Highlights</h4>
                    <div className="space-y-3 font-sans">
                      {[
                        { author: "Arif Alom", rating: 5, date: "June 01, 2026", text: "Exceptional quality. Our organic traffic and bKash orders doubled in just 2 weeks. High recommended!" },
                        { author: "Zayed Al-Harbi", rating: 5, date: "May 25, 2026", text: "Certified services. Fast WhatsApp responses and extremely secure databases. 5 stars." }
                      ].map((rev, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-neutral-55 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1.5 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">{rev.author}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />)}
                          </div>
                          <p className="text-slate-500 leading-normal">{rev.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailActiveTab === 'faq' && (
                  <div className="space-y-3 font-sans text-left">
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white pb-1">Frequently Asked Questions</h4>
                    {[
                      { q: "Is the source code fully provided?", a: "Yes, you receive the full GPL code in a clean ZIP file upon completion." },
                      { q: "Do you offer post-delivery technical support?", a: "Every standard tier includes 30 days to 180 days of free technical maintenance support and updates." },
                      { q: "Is hosting setup and site backup included?", a: "Our web design packages include 1 year of high-speed NVMe hosting and daily cloud backups." }
                    ].map((faq, idx) => (
                      <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <span className="text-cyan-400 font-mono">Q.</span>
                          <span>{faq.q}</span>
                        </p>
                        <p className="text-slate-500 mt-1 pl-4">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RECOMMENDED SERVICES ENGINE - INTERACTIVE CAROUSEL OR LIST */}
              <div className="space-y-3">
                <h4 className="text-xs font-black font-mono uppercase tracking-widest text-slate-400">
                  ⚡ Customers who viewed this service also viewed
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(recommendedServicesMap[selectedService.id] || ["srv-seo-custom", "srv-marketplace-custom"]).map(recId => {
                    const recSrv = catalogServicesData.find(s => s.id === recId);
                    if (!recSrv) return null;

                    return (
                      <div 
                        key={recId}
                        onClick={() => setSelectedService(recSrv)}
                        className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 cursor-pointer flex gap-3 transition"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={recSrv.thumbnail} alt={recSrv.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="text-left space-y-0.5">
                          <h5 className="font-bold text-[11px] text-slate-800 dark:text-slate-100 line-clamp-1">{recSrv.title}</h5>
                          <span className="text-[10px] text-emerald-505 dark:text-emerald-400 font-mono font-bold">{formatPrice(recSrv.startingPrice)}</span>
                          <p className="text-[9px] text-neutral-400 line-clamp-1">{recSrv.shortDescription}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar on desktop: Project Cost Estimator, Quick Quote Request, WhatsApp Call Back */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Project Cost Estimator widget */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 p-5 rounded-2xl space-y-4 text-left shadow-md">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-[9px] font-black font-mono text-blue-600 dark:text-cyan-400 rounded-md tracking-wider uppercase">
                  ⚡ Live Cost Estimator
                </span>
                <h4 className="font-black text-sm text-neutral-900 dark:text-white">Calculate Deployment Cost</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Customize operational requirements to estimate final delivery parameters live.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-slate-500">
                      <span>Total Dynamic Pages ({estimatorPagesCount})</span>
                      <span className="font-black text-slate-805 dark:text-white">{estimatorPagesCount} custom page</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEstimatorPagesCount(prev => Math.max(1, prev - 1))}
                        className="p-1 px-2.5 bg-neutral-100 dark:bg-slate-800 text-slate-600 dark:text-slate-100 rounded text-xs hover:bg-neutral-200 cursor-pointer font-black"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs w-8 text-center text-slate-705 dark:text-white font-black">{estimatorPagesCount}</span>
                      <button 
                        onClick={() => setEstimatorPagesCount(prev => Math.min(25, prev + 1))}
                        className="p-1 px-2.5 bg-neutral-100 dark:bg-slate-800 text-slate-600 dark:text-slate-100 rounded text-xs hover:bg-neutral-200 cursor-pointer font-black"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] text-slate-600 dark:text-slate-350 select-none">
                      <input 
                        type="checkbox" 
                        checked={estimatorNeedsSEO}
                        onChange={() => setEstimatorNeedsSEO(!estimatorNeedsSEO)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 dark:bg-slate-850"
                      />
                      <span>On-Page SEO Configuration (+$49)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] text-slate-600 dark:text-slate-350 select-none">
                      <input 
                        type="checkbox" 
                        checked={estimatorNeedsAuth}
                        onChange={() => setEstimatorNeedsAuth(!estimatorNeedsAuth)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 dark:bg-slate-850"
                      />
                      <span>Auth Engine Shield Setup (+$99)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] text-slate-600 dark:text-slate-350 select-none">
                      <input 
                        type="checkbox" 
                        checked={estimatorSpeedAudit}
                        onChange={() => setEstimatorSpeedAudit(!estimatorSpeedAudit)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 dark:bg-slate-850"
                      />
                      <span>Google Speed Optimization Audit (+$39)</span>
                    </label>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center text-left">
                    <span className="font-mono text-[11px] text-slate-400 font-extrabold uppercase uppercase">Estimated Cost</span>
                    <span className="text-xl font-mono font-black text-blue-600 dark:text-cyan-400">
                      {formatPrice(estimatedCost)}
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      addSimulatedServiceOrder({
                        id: "ord-est-" + Date.now(),
                        serviceId: selectedService.id,
                        itemTitle: `${selectedService.title} live Estimated Option`,
                        price: estimatedCost,
                        date: new Date().toISOString().split('T')[0],
                        paymentMethod: "Cost Estimator Cart Sync",
                        paymentStatus: 'pending'
                      });
                      triggerToast(language === 'bn' ? "হিসাবকৃত কনফিগারেশন যোগ হয়েছে!" : "Estimated selection loaded to cart successfully!");
                    }}
                    className="w-full py-2.5 bg-[#2563EB] text-white text-[10px] font-black rounded-lg cursor-pointer hover:bg-opacity-95 shadow transition"
                  >
                    Load Design to Cart
                  </button>
                </div>
              </div>

              {/* Quick Quote Form inside Sidebar */}
              <div className="bg-neutral-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 text-left">
                <h4 className="font-black text-sm text-neutral-805 dark:text-white">Quick Quote Inquiry</h4>
                <p className="text-[10px] text-slate-500">Provide details for dedicated developer consultation.</p>
                
                <form onSubmit={handleCustomQuoteSubmit} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    required 
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-[11px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="WhatsApp phone number" 
                    required 
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-[11px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <textarea 
                    placeholder="Bespoke project objectives..." 
                    rows={2}
                    value={quoteDesc}
                    onChange={(e) => setQuoteDesc(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-[11px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    type="submit" 
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white text-[10px] font-black rounded cursor-pointer transition-all"
                  >
                    Submit Quick Inquiry
                  </button>
                </form>
              </div>

              {/* Call Back Request WhatsApp trigger */}
              <button 
                onClick={() => {
                  window.open("https://wa.me/966570511931?text=Salaam%20WebzoneBD,%20I%20would%20like%20to%20request%20a%20technical%20call%20back%20session.", "_blank");
                }}
                className="w-full py-3 bg-emerald-55 bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow hover:opacity-95 text-center transition"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Request WhatsApp Call Back</span>
              </button>
            </div>
          </div>

          {/* 4. MOBILE EXPERIENCE BOTTOM STICKY ACTIONS */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 p-3 z-50 flex gap-2 backdrop-blur-md">
            <a 
              href="https://wa.me/966570511931"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 bg-emerald-65 bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button 
              onClick={() => {
                setIsQuoteModalOpen(true);
              }}
              className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-705 dark:text-slate-100 text-xs font-black rounded-xl"
            >
              Request Quote
            </button>

            <button 
              onClick={() => {
                addSimulatedServiceOrder({
                  id: "ord-mob-instant-" + Date.now(),
                  serviceId: selectedService.id,
                  itemTitle: `${selectedService.title} Mobile Order`,
                  price: selectedService.startingPrice,
                  date: new Date().toISOString().split('T')[0],
                  paymentMethod: "Mobile Direct SSL Click",
                  paymentStatus: 'pending'
                });
                triggerToast(language === 'bn' ? "মোবাইল ক্রয় সম্পন্ন হয়েছে!" : "Mobile order processed!");
              }}
              className="flex-1 py-3 bg-blue-600 text-white font-black text-xs rounded-xl shadow"
            >
              Order Now 🛒
            </button>
          </div>
        </div>
      )}

      {/* 5. TRUST & CONVERSION STATISTICS MODULE */}
      {!selectedService && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center font-display shadow-sm">
          {[
            { stat: "500+", subtitle: "Completed Projects", bn: "৫০০+ সম্পন্ন কাজ" },
            { stat: "1000+", subtitle: "Happy Clients", bn: "১০০০+ খুশি গ্রাহক" },
            { stat: "4.9/5.0", subtitle: "Average Rating", bn: "৪.৯ গড় রেটিং" },
            { stat: "24/7", subtitle: "Technical Support", bn: "২৪/৭ লাইভ সাপোর্ট" },
            { stat: "50+", subtitle: "Digital Services", bn: "৫০+ ডিজিটাল সার্ভিস" }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-xl md:text-3xl font-black text-blue-600 dark:text-cyan-400 font-mono tracking-tight">{item.stat}</p>
              <p className="text-[10px] font-extrabold uppercase font-sans tracking-widest text-slate-705 dark:text-slate-400">
                {language === 'bn' ? item.bn : item.subtitle}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* QUICK VIEW POPUP MODAL */}
      {quickViewService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200 text-left">
            <div className="p-4 bg-slate-100 dark:bg-slate-950 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Specification Audit Preview</span>
              <button 
                onClick={() => setQuickViewService(null)} 
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                {language === 'bn' ? quickViewService.titleBn : quickViewService.title}
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                {language === 'bn' ? quickViewService.fullDescriptionBn : quickViewService.fullDescription}
              </p>

              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block pb-1">Starting Price</span>
                  <span className="font-extrabold text-blue-600 dark:text-cyan-300 text-sm">
                    {formatPrice(quickViewService.startingPrice)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block pb-1">Service Level</span>
                  <span className="font-bold text-neutral-700 dark:text-slate-200">
                    {language === 'bn' ? quickViewService.serviceLevelBn : quickViewService.serviceLevel}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Core Deliverables Checklist:</span>
                <div className="space-y-1 text-xs">
                  {(language === 'bn' ? quickViewService.featuresBn : quickViewService.features).map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-600 dark:text-slate-350">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  handleSelectService(quickViewService);
                  setQuickViewService(null);
                }}
                className="w-full py-2.5 bg-blue-600 text-white text-xs font-black rounded-lg hover:bg-blue-500"
              >
                {language === 'bn' ? 'বিস্তারিত দেখতে যান' : 'Go See Full Tier Details'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CUSTOM QUOTE ENGINE MODAL */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200 text-left">
            <div className="p-4 bg-slate-100 dark:bg-slate-950 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Enterprise Inbound Specifications Intake</span>
              <button 
                onClick={() => setIsQuoteModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomQuoteSubmit} className="p-6 space-y-4">
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Your Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="e.g. Arif Alom"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">WhatsApp / Contact Phone</label>
                <input 
                  type="text" 
                  required 
                  value={quotePhone}
                  onChange={(e) => setQuotePhone(e.target.value)}
                  placeholder="e.g. +8801864000005"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Email Address (Optional)</label>
                <input 
                  type="email" 
                  value={quoteEmail}
                  onChange={(e) => setQuoteEmail(e.target.value)}
                  placeholder="e.g. sales@yourdomain.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Target Range Estimate</label>
                <select 
                  value={quoteBudgetRange}
                  onChange={(e) => setQuoteBudgetRange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="under-100">Under $100</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="100-500">$100 - $500</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="500-1000">$500 - $1000</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="1000-plus">$1100+</option>
                </select>
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Project Requirements Brief</label>
                <textarea 
                  rows={3}
                  value={quoteDesc}
                  onChange={(e) => setQuoteDesc(e.target.value)}
                  placeholder="Briefly describe what kind of portals or systems you need built..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-lg shadow cursor-pointer transition transform active:scale-95 text-center flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Order Specifications</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
