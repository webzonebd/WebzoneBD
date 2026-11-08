import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Globe, Star, Sparkles, 
  ArrowRight, RefreshCw, Layers, Check, Zap,
  Database, Cpu, Cloud, CheckCircle2, ChevronRight, 
  ShieldCheck, Server, Activity, ArrowUpRight, X
} from 'lucide-react';
import { Language, Currency, Product } from '../types';

interface DomainSearchProps {
  language: Language;
  theme: string;
  currency: Currency;
  addToCart: (product: Product) => void;
  setCurrentPage: (page: string) => void;
  currencySettings?: any;
  showCategories?: boolean;
}

// Domain prices in USD for cross-multiplication with active currency rates
const domainExtensionsPrices: Record<string, number> = {
  '.com': 10.99,
  '.net': 14.99,
  '.org': 13.99,
  '.info': 9.99,
  '.biz': 11.99,
  '.co': 19.99,
  '.ai': 59.99,
  '.dev': 14.99,
  '.com.bd': 10.25, // equivalent of ~1200 BDT
  '.bd': 12.80    // equivalent of ~1500 BDT
};

const suggestedPrefixes = ['get', 'the', 'go', 'try', 'join', 'app'];
const suggestedSuffixes = ['hub', 'cloud', 'labs', 'tech', 'online', 'store', 'sys', 'partner'];

export default function DomainSearch({ 
  language, 
  currency, 
  addToCart, 
  setCurrentPage,
  currencySettings,
  showCategories = true
}: DomainSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExt, setSelectedExt] = useState('.com');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedName, setSearchedName] = useState('');
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  
  // Results structures
  const [primaryResult, setPrimaryResult] = useState<{
    domain: string;
    isAvailable: boolean;
    isPremium: boolean;
    priceUSD: number;
    reason?: string;
  } | null>(null);
  
  const [recommendations, setRecommendations] = useState<Array<{
    domain: string;
    isAvailable: boolean;
    isPremium: boolean;
    priceUSD: number;
  }>>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Localization translator object
  const translations = {
    en: {
      title: "Find Your Perfect Domain Name",
      mainHeading: "Search and Register Your Dream Domain Instantly",
      subHeading: "Secure your online identity with fast domain registration services. Search thousands of available domain names and launch your business online today.",
      placeholder: "Enter your domain name (e.g. mybusiness)",
      btnSearch: "Check Availability",
      btnSearching: "Checking Node...",
      popularExt: "Popular Extensions",
      startingFrom: "Starting from",
      year: "year",
      benefitsTitle: "Why register with WebzoneBD?",
      benefit1: "Instant Domain Search",
      benefit2: "Secure Registration",
      benefit3: "DNS Management",
      benefit4: "Domain Transfer Support",
      benefit5: "Free Technical Support",
      benefit6: "Domain Privacy Protection",
      ctaRegister: "Register Domain",
      ctaHosting: "View Hosting Plans",
      available: "Domain is Available!",
      taken: "Already Registered / Taken",
      premium: "Premium Domain Match",
      addToCartBtn: "Add to Cart & Sandbox Register",
      addedBtn: "Added to Cart!",
      suggestionsHeader: "Alternative Extensions & Premium Recommendations",
      extensionTitle: "Extension Pricing",
      resultsFor: "Domain availability check for:",
      invalidMsg: "Please enter a valid domain name with alphanumeric characters.",
      pricingNote: "* Prices are billed annually and exclude applicable regional taxes."
    },
    bn: {
      title: "ডোমেন রেজিস্ট্রেশন ও অনুসন্ধান",
      mainHeading: "আপনার পছন্দের ডোমেনটি এখনই সার্চ ও রেজিস্টার করুন",
      subHeading: "সহজ এবং নিরাপদ ডোমেন রেজিস্ট্রেশন সেবার মাধ্যমে আপনার অনলাইন পরিচয় গড়ে করুন। এখনই হাজার হাজার ডোমেন থেকে আপনার ব্র্যান্ড সিলেক্ট করুন।",
      placeholder: "ডোমেনের নাম লিখুন (যেমন: mybusiness)",
      btnSearch: "ডোমেন চেক করুন",
      btnSearching: "যাচাই করা হচ্ছে...",
      popularExt: "জনপ্রিয় ডোমেন এক্সটেনশন",
      startingFrom: "শুরু মাত্র",
      year: "বছর",
      benefitsTitle: "কেন ওয়েবজোনবিডি থেকে ডোমেন নিবেন?",
      benefit1: "ইনস্ট্যান্ট ডোমেন সার্চ",
      benefit2: "১০০% নিরাপদ রেজিস্ট্রেশন",
      benefit3: "ফ্রি ডিএনএস কন্ট্রোল প্যানেল",
      benefit4: "সহজ ডোমেন ট্রান্সফার সুবিধা",
      benefit5: "২৪/৭ লাইভ টেকনিক্যাল সাপোর্ট",
      benefit6: "ডোমেন প্রাইভেসী প্রটেকশন",
      ctaRegister: "ডোমেন বুকিং",
      ctaHosting: "হোস্টিং সার্ভিস সমূহ",
      available: "ডোমেনটি খালি আছে!",
      taken: "ইতিমধ্যে নিবন্ধিত / খালি নেই",
      premium: "প্রিমিয়াম ডোমেন ক্যাটাগরি",
      addToCartBtn: "কার্টে যোগ করুন এবং রেজিস্টার",
      addedBtn: "কার্টে যুক্ত হয়েছে!",
      suggestionsHeader: "বিকল্প এক্সটেনশন ও প্রিমিয়াম সাজেশনসমূহ",
      extensionTitle: "ডোমেন মূল্য তালিকা",
      resultsFor: "ডোমেন অনুসন্ধান ফলাফল:",
      invalidMsg: "দয়া করে শুধুমাত্র ইংরেজি অক্ষর এবং সংখ্যা দিন।",
      pricingNote: "* প্রতি বছর পুনরায় নবায়ন করতে হবে। অতিরিক্ত ট্যাক্স প্রযোজ্য হতে পারে।"
    },
    ar: {
      title: "ابحث عن نطاقك المثالي فوراً",
      mainHeading: "ابحث وسجل نطاق أحلامك الخاص بالمشروع فوراً",
      subHeading: "قم بتأمين هويتك الرقمية مع خدمات تسجيل النطاقات السريعة المعتمدة. ابحث في آلاف النطاقات المتاحة واطلق نشاطك التجاري الرقمي اليوم.",
      placeholder: "أدخل اسم النطاق المراد البحث عنه (مثال: mybusiness)",
      btnSearch: "تحقق من الإتاحة",
      btnSearching: "جاري فحص الخادم...",
      popularExt: "النطاقات الأكثر شعبية",
      startingFrom: "يبدأ من",
      year: "سنوياً",
      benefitsTitle: "لماذا تسجل نطاقك عبر ويب زون بي دي؟",
      benefit1: "بحث فوري ودقيق للنطاقات",
      benefit2: "تسجيل فوري معتمد وآمن 100٪",
      benefit3: "لوحة تحكم كاملة في الـ DNS",
      benefit4: "دعم نقل النطاق السريع مجاناً",
      benefit5: "دعم فني برمجى متواصل 24/7",
      benefit6: "إخفاء وحماية بيانات المالك مجاناً",
      ctaRegister: "تسجيل النطاق",
      ctaHosting: "عرض خطط الاستضافة العالية",
      available: "النطاق متاح للتسجيل فوراً!",
      taken: "هذا النطاق محجوز بالفعل",
      premium: "عرض نطاق متميز (Premium)",
      addToCartBtn: "أضف للسلة والاشتراك",
      addedBtn: "تمت الإضافة للسلة!",
      suggestionsHeader: "الامتدادات البديلة واقتراحات النطاقات المتميزة",
      extensionTitle: "أسعار الامتدادات",
      resultsFor: "نتائج فحص إتاحة النطاق:",
      invalidMsg: "يرجى إدخال اسم نطاق صحيح يحتوي على أحرف وأرقام فقط.",
      pricingNote: "* يتم الفوترة بشكل سنوي ولا تشمل الضرائب المحلية الإضافية."
    }
  };

  const currentTrans = translations[language] || translations.en;

  // Formatting price aligned with parent currency strategy
  const formatValue = (usdPrice: number, ext?: string) => {
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
    const converted = usdPrice * rate;

    switch (cur) {
      case 'BDT':
        if (ext === '.com.bd') return '৳ 1,200';
        if (ext === '.bd') return '৳ 1,500';
        return `৳ ${Math.round(converted).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${converted.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${converted.toFixed(2)}`;
    }
  };

  // Focus and scroll helper for core Register CTA
  const handleScrollToSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // -----------------------------------------------------
  // REAL-TIME PREDICTIVE DOMAIN SEARCH LOGIC
  // -----------------------------------------------------
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);
  const domainSearchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (domainSearchDropdownRef.current && !domainSearchDropdownRef.current.contains(e.target as Node)) {
        setShowDomainSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const predictiveDomainSuggestions = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    if (!raw) return [];

    let namePart = raw;
    let extFilter = "";
    const dotIndex = raw.indexOf(".");
    if (dotIndex !== -1) {
      namePart = raw.substring(0, dotIndex).replace(/[^a-z0-9\-]/g, "");
      extFilter = raw.substring(dotIndex);
    } else {
      namePart = raw.replace(/[^a-z0-9\-]/g, "");
    }

    if (!namePart) return [];

    const TLD_TAGS: Record<string, { tag: string; tagBn: string; badge?: string; isHot?: boolean }> = {
      '.com': { tag: 'Global Business Standard', tagBn: 'গ্লোবাল বিজনেস স্ট্যান্ডার্ড', badge: 'Popular', isHot: true },
      '.net': { tag: 'Network & High-Speed Tech', tagBn: 'হাই-স্পিড টেক ও নেটওয়ার্ক', badge: 'Fast' },
      '.org': { tag: 'Community & Trust Organization', tagBn: 'অর্গানাইজেশন ও ট্রাস্ট' },
      '.com.bd': { tag: 'Official Bangladesh Commercial', tagBn: 'অফিসিয়াল বিডি কমার্শিয়াল', badge: 'BD Local' },
      '.bd': { tag: 'Official Bangladesh Identity', tagBn: 'অফিসিয়াল বিডি ডোমেন', badge: 'BD Gov/Biz' },
      '.ai': { tag: 'Artificial Intelligence & Tech', tagBn: 'এআই ও টেক ইনোভেশন', badge: 'AI Hot', isHot: true },
      '.dev': { tag: 'Developers & Software Engineers', tagBn: 'ডেভেলপার ও সফটওয়্যার' },
      '.co': { tag: 'Company & Global Ventures', tagBn: 'গ্লোবাল কোম্পানি ও স্টার্টআপ' },
      '.info': { tag: 'Information & Knowledge Portals', tagBn: 'ইনফরমেশন পোর্টাল' },
      '.biz': { tag: 'Small Business & Commerce', tagBn: 'বিজনেস ও কমার্স' },
    };

    const list: Array<{
      fullDomain: string;
      namePart: string;
      ext: string;
      tag: string;
      tagBn: string;
      badge?: string;
      isHot?: boolean;
      priceUSD: number;
    }> = [];

    Object.entries(domainExtensionsPrices).forEach(([ext, price]) => {
      if (!extFilter || ext.startsWith(extFilter)) {
        const meta = TLD_TAGS[ext] || { tag: 'Top-Level Domain', tagBn: 'টপ লেভেল ডোমেন' };
        list.push({
          fullDomain: `${namePart}${ext}`,
          namePart,
          ext,
          tag: meta.tag,
          tagBn: meta.tagBn,
          badge: meta.badge,
          isHot: meta.isHot,
          priceUSD: price,
        });
      }
    });

    if (namePart.length >= 3 && !extFilter) {
      ['get', 'the', 'go'].forEach(prefix => {
        const full = `${prefix}${namePart}.com`;
        if (!list.some(item => item.fullDomain === full)) {
          list.push({
            fullDomain: full,
            namePart: `${prefix}${namePart}`,
            ext: '.com',
            tag: 'Smart Brand Alternative',
            tagBn: 'স্মার্ট ব্র্যান্ড অল্টারনেটিভ',
            badge: 'Idea',
            isHot: false,
            priceUSD: domainExtensionsPrices['.com'] || 10.99,
          });
        }
      });
    }

    return list.slice(0, 6);
  }, [searchQuery]);

  const selectPredictiveDomain = (domain: string, ext: string) => {
    const dotIndex = domain.indexOf('.');
    const cleanName = dotIndex !== -1 ? domain.substring(0, dotIndex) : domain;
    setSearchQuery(cleanName);
    setSelectedExt(ext);
    setShowDomainSuggestions(false);
    
    setTimeout(() => {
      handleCheckAvailability();
    }, 50);
  };

  // Check Domain availability using real-time node resolve with mock fallback
  const handleCheckAvailability = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Normalize input
    let cleanVal = searchQuery.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!cleanVal) return;

    setIsSearching(true);
    setHasSearched(false);

    let domainName = cleanVal;
    let extensionUsed = selectedExt;

    const extMatch = cleanVal.match(/(\.[a-z]{2,3}(\.[a-z]{2})?)$/);
    if (extMatch) {
       extensionUsed = extMatch[1];
       domainName = cleanVal.substring(0, cleanVal.length - extensionUsed.length);
    }

    // Safeguard domain length
    if (domainName.replace(/[^a-z0-9-]/g, '') === '') {
      setIsSearching(false);
      return;
    }

    const fullDomainName = `${domainName}${extensionUsed}`;
    setSearchedName(fullDomainName);

    try {
      const response = await fetch("/api/check-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: fullDomainName }),
      });
      const data = await response.json();
      
      const isTaken = !data.isAvailable;
      const isPremium = domainName.length <= 4 && !isTaken;
      const baseExtPrice = domainExtensionsPrices[extensionUsed] || 12.99;
      const finalPrice = isPremium ? baseExtPrice * 8.5 : baseExtPrice;

      setPrimaryResult({
        domain: fullDomainName,
        isAvailable: !isTaken,
        isPremium,
        priceUSD: finalPrice
      });
    } catch {
      // Seed deterministic fallback logic
      const takenDomainsList = [
        'google', 'facebook', 'youtube', 'github', 'microsoft', 'netflix', 'amazon', 
        'twitter', 'instagram', 'linkedin', 'webzone', 'webzonebd', 'pro', 'agency', 'saudi'
      ];
      const isTaken = takenDomainsList.includes(domainName) || domainName.length < 3;
      const isPremium = domainName.length <= 4 && !isTaken;
      const baseExtPrice = domainExtensionsPrices[extensionUsed] || 12.99;
      const finalPrice = isPremium ? baseExtPrice * 8.5 : baseExtPrice;

      setPrimaryResult({
        domain: fullDomainName,
        isAvailable: !isTaken,
        isPremium,
        priceUSD: finalPrice
      });
    }

    // Generate related alternative recommendations
    const generatedRecs: Array<{
      domain: string;
      isAvailable: boolean;
      isPremium: boolean;
      priceUSD: number;
    }> = [];
    
    // Alternative extensions checker
    const alternativeExts = ['.net', '.org', '.ai', '.dev', '.com.bd', '.co'].filter(e => e !== extensionUsed);
    
    for (const ext of alternativeExts.slice(0, 3)) {
      const altDomain = `${domainName}${ext}`;
      let altAvailable = true;
      try {
        const altResponse = await fetch("/api/check-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: altDomain }),
        });
        const altData = await altResponse.json();
        altAvailable = altData.isAvailable;
      } catch {
        const takenDomainsList = ['google', 'facebook', 'youtube', 'github', 'webzone'];
        altAvailable = !takenDomainsList.includes(domainName);
      }

      generatedRecs.push({
        domain: altDomain,
        isAvailable: altAvailable,
        isPremium: false,
        priceUSD: domainExtensionsPrices[ext] || 15.00
      });
    }

    // Prefix/Suffix recommendations
    suggestedPrefixes.slice(0, 2).forEach(prefix => {
      generatedRecs.push({
        domain: `${prefix}${domainName}${extensionUsed}`,
        isAvailable: true,
        isPremium: true,
        priceUSD: (domainExtensionsPrices[extensionUsed] || 12.99) * 1.5
      });
    });

    suggestedSuffixes.slice(0, 2).forEach(suffix => {
      generatedRecs.push({
        domain: `${domainName}${suffix}${extensionUsed}`,
        isAvailable: true,
        isPremium: false,
        priceUSD: domainExtensionsPrices[extensionUsed] || 12.99
      });
    });

    setRecommendations(generatedRecs);
    setIsSearching(false);
    setHasSearched(true);
  };

  // Convert Domain purchase to Shopping Cart Product
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleRegisterDomainItem = (domain: string, priceUSD: number) => {
    // Generate valid WHMCS redirection link with exact sld and tld parameters
    const clean = domain.trim().toLowerCase();
    const index = clean.indexOf('.');
    let sld = clean;
    let tld = '.com';
    if (index !== -1) {
      sld = clean.substring(0, index);
      tld = clean.substring(index);
    }
    const whmcsUrl = `https://host.webzonebd.com/cart.php?a=add&domain=register&sld=${sld}&tld=${tld}`;

    setAddedItems(prev => ({ ...prev, [domain]: true }));
    
    setTimeout(() => {
      window.location.href = whmcsUrl;
    }, 600);
  };

  return (
    <section 
      id="homepage-domain-registration" 
      className="relative w-full overflow-hidden bg-slate-900 border-y border-slate-800 pt-8 pb-5 text-white"
    >
      {/* Absolute Decorative Floating Elements */}
      <div className="absolute top-10 left-10 pointer-events-none opacity-20 animate-pulse" style={{ animationDuration: '5s' }}>
        <div className="w-64 h-64 rounded-full bg-blue-500 blur-[80px]"></div>
      </div>
      <div className="absolute bottom-10 right-10 pointer-events-none opacity-20">
        <div className="w-80 h-80 rounded-full bg-cyan-500 blur-[100px]"></div>
      </div>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Badge & Intro titles */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-xs text-cyan-400 font-mono tracking-wider uppercase" style={{ animationDuration: '2s' }}>
            <Globe className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{currentTrans.title}</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            {currentTrans.mainHeading}
          </h2>
 
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <button 
              onClick={() => setCurrentPage('domain')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>{currentTrans.ctaRegister}</span>
              <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
            </button>
            <button 
              onClick={() => setCurrentPage('hosting')}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700/60 transition-all duration-300"
            >
              {currentTrans.ctaHosting}
            </button>
          </div>
        </div>
 
        {/* LARGE Glassmorphic Domain Search Box */}
        <div ref={domainSearchDropdownRef} className="max-w-3xl lg:max-w-4xl mx-auto mb-4 relative">
          <div className="relative p-1.5 sm:p-2.5 md:p-3 bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/80 focus-within:border-blue-500 dark:focus-within:border-cyan-500/50 shadow-xl dark:shadow-2xl focus-within:shadow-blue-500/10 transition-all duration-300">
            <form onSubmit={handleCheckAvailability} className="flex flex-col sm:flex-row items-stretch gap-1.5 md:gap-2">
              
              {/* Domain Input & Extension selector grouped on a single line for mobile & desktop */}
              <div className="flex-1 flex items-center min-w-0 bg-transparent">
                <div className="relative flex-1 flex items-center min-w-0">
                  <Search className="absolute left-3.5 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={currentTrans.placeholder}
                    value={searchQuery}
                    onFocus={() => setShowDomainSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setShowDomainSuggestions(false);
                    }}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDomainSuggestions(true);
                    }}
                    className="w-full bg-transparent pl-10 sm:pl-12 md:pl-13 pr-8 sm:pr-9 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Selector Extension dropdown chip */}
                <div className="relative flex items-center px-2 sm:px-3 border-l border-slate-200 dark:border-slate-800 my-1 py-1 shrink-0">
                  <select
                    value={selectedExt}
                    onChange={(e) => setSelectedExt(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm md:text-base font-black text-blue-600 dark:text-cyan-400 cursor-pointer pr-3 sm:pr-4 pl-1 sm:pl-2 focus:outline-none uppercase"
                  >
                    {Object.keys(domainExtensionsPrices).map((ext) => (
                      <option key={ext} value={ext} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans text-xs sm:text-sm">
                        {ext}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action trigger Button */}
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-black text-xs sm:text-sm md:text-base rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer shrink-0"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{currentTrans.btnSearching}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-white fill-white" />
                    <span>{currentTrans.btnSearch}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Real-time Predictive Domain Dropdown */}
          {showDomainSuggestions && searchQuery.trim().length > 0 && (
            <div
              id="domain-search-predictive-dropdown"
              className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-200 text-left"
            >
              {/* Header */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 via-cyan-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:via-cyan-950/30 dark:to-indigo-950/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-extrabold uppercase font-mono tracking-wider text-slate-200">
                    {language === 'bn' 
                      ? `প্রেডিক্টিভ ডোমেন সাজেশন্স (${predictiveDomainSuggestions.length}টি)` 
                      : `Predictive Domain Suggestions (${predictiveDomainSuggestions.length})`}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                  ESC to close
                </span>
              </div>

              {/* Suggestions List */}
              {predictiveDomainSuggestions.length > 0 ? (
                <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
                  {predictiveDomainSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectPredictiveDomain(item.fullDomain, item.ext)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-400 font-mono transition truncate">
                              {item.fullDomain}
                            </span>
                            <span className="text-[9px] uppercase font-mono font-extrabold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                              {item.ext}
                            </span>
                            {item.isHot && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                                HOT 🔥
                              </span>
                            )}
                            {item.badge && !item.isHot && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {language === 'bn' ? item.tagBn : item.tag}
                          </p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          {formatValue(item.priceUSD, item.ext)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectPredictiveDomain(item.fullDomain, item.ext);
                          }}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[10.5px] font-bold rounded-lg shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          <Search className="w-3 h-3" />
                          <span>{language === 'bn' ? 'চেক করুন' : 'Check'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  {language === 'bn' ? 'ডোমেন নামটি টাইপ করুন' : 'Type a domain name to see suggestions'}
                </div>
              )}
            </div>
          )}

          {/* Quick interactive Domain extensions toggle row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 overflow-x-auto pb-1.5">
            {['.com', '.net', '.org', '.com.bd', '.bd', '.ai'].map((ext) => (
              <motion.button
                key={ext}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.88, y: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 15 }}
                onClick={() => {
                  setSelectedExt(ext);
                  // Auto lookup if searchQuery is present
                  if (searchQuery.trim()) {
                    setSearchQuery(prev => {
                      const splitDot = prev.indexOf('.');
                      const nameOnly = splitDot !== -1 ? prev.substring(0, splitDot) : prev;
                      return `${nameOnly}${ext}`;
                    });
                  }
                }}
                className={`px-3 py-1 font-bold text-[11px] rounded-lg border transition-all cursor-pointer ${
                  selectedExt === ext 
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/5' 
                    : 'bg-slate-950/35 border-slate-800/70 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {ext}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Real-time Domain Checking Interactive Results container */}
        {(isSearching || hasSearched) && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="domain-search-wrapper max-w-3xl mx-auto mb-12 p-1 bg-gradient-to-r from-blue-800/10 via-cyan-800/10 to-indigo-800/10 border border-slate-800/80 rounded-3xl"
          >
            <div className="bg-slate-950/90 rounded-[22px] p-6 space-y-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 border-b border-slate-900 pb-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{currentTrans.resultsFor} <strong className="text-white text-sm font-mono">{searchedName || searchQuery}</strong></span>
              </div>

              {isSearching ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
                  <p className="text-xs text-slate-400 animate-pulse font-mono tracking-wider">{currentTrans.btnSearching}</p>
                </div>
              ) : primaryResult ? (
                <motion.div
                  className="space-y-6"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {/* Primary result layout */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } }
                    }}
                    className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                      primaryResult.isAvailable 
                        ? 'bg-emerald-500/5 border border-emerald-500/20' 
                        : 'bg-rose-500/5 border border-rose-500/20'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-black text-white font-mono tracking-tight">{primaryResult.domain}</span>
                        {primaryResult.isPremium && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-black tracking-wider uppercase text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>PREMIUM</span>
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          primaryResult.isAvailable 
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                            : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                        }`}>
                          {primaryResult.isAvailable ? currentTrans.available : currentTrans.taken}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-md">
                        {primaryResult.isAvailable 
                          ? `Claim your verified address on the virtual workspace. Features complete standard DNSSEC security protocols.`
                          : `Sorry! This address configuration is reserved or owned already. Inspect related domain name recommendations below.`
                        }
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-slate-900 pt-2.5 md:pt-0">
                      {primaryResult.isAvailable && (
                        <div className="text-right flex flex-col md:items-end">
                          <span className="text-xl font-extrabold text-cyan-400">{formatValue(primaryResult.priceUSD, Math.max(0, primaryResult.domain.indexOf('.')) !== -1 ? primaryResult.domain.substring(primaryResult.domain.indexOf('.')) : undefined)}</span>
                          <span className="text-[10px] text-slate-500 font-mono">/ {currentTrans.year}</span>
                        </div>
                      )}

                      {primaryResult.isAvailable ? (
                        <button
                          type="button"
                          onClick={() => handleRegisterDomainItem(primaryResult.domain, primaryResult.priceUSD)}
                          className={`px-4 py-2 font-bold text-xs rounded-xl transition ${
                            addedItems[primaryResult.domain]
                              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                              : 'bg-white text-slate-950 hover:bg-slate-100'
                          }`}
                        >
                          {addedItems[primaryResult.domain] ? currentTrans.addedBtn : currentTrans.addToCartBtn}
                        </button>
                      ) : (
                        <a
                          href="https://wa.me/966570511931"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition"
                        >
                          Inquire WHOIS Details
                        </a>
                      )}
                    </div>
                  </motion.div>

                  {/* Recommendation alternative outputs */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1, transition: { staggerChildren: 0.08 } }
                    }}
                    className="space-y-3"
                  >
                    <h4 className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>{currentTrans.suggestionsHeader}</span>
                    </h4>

                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                      }}
                    >
                      {recommendations.map((rec) => (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 12, scale: 0.96 },
                            show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
                          }}
                          key={rec.domain}
                          className="p-3 bg-slate-950 border border-slate-905 rounded-xl flex items-center justify-between gap-2 hover:border-slate-800 transition"
                        >
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-200 font-mono">{rec.domain}</span>
                            {rec.isPremium && (
                              <span className="ml-1.5 px-1 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-cyan-400">
                                PRO
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">{formatValue(rec.priceUSD, rec.domain.substring(rec.domain.indexOf('.')))}</span>
                            <button
                              type="button"
                              onClick={() => handleRegisterDomainItem(rec.domain, rec.priceUSD)}
                              className={`p-1.5 rounded-lg transition ${
                                addedItems[rec.domain]
                                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                  : 'bg-slate-900 text-slate-300 hover:text-white'
                              }`}
                              title={currentTrans.addToCartBtn}
                            >
                              {addedItems[rec.domain] ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Zap className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        )}

        {/* ================================= AUTOMATED SLIDING HOSTING CATEGORIES ================================= */}
        {showCategories && (() => {
          const getHostingFormattedPrice = (usdPrice: number) => {
            const formatted = formatValue(usdPrice);
            const suffix = language === 'bn' ? '/মাস' : language === 'ar' ? '/شهرياً' : '/mo';
            return `${formatted}${suffix}`;
          };

          const handleHostingCategorySelect = (categoryId: string) => {
            localStorage.setItem('webzone_target_hosting_tab', categoryId);
            setCurrentPage('hosting');
            setTimeout(() => {
              const targetEl = document.getElementById('redesigned-packages') || document.getElementById('redesigned-categories');
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
              }
            }, 120);
          };

          const hostingCategoriesList = [
            {
              id: 'bdix',
              title: language === 'bn' ? 'শেয়ার্ড বিডিআইএক্স হোস্টিং' : language === 'ar' ? 'استضافة BDIX المشتركة' : 'Shared BDIX Hosting',
              tagline: language === 'bn' ? '৫ms লোকাল লেটেন্সি' : language === 'ar' ? 'استجابة فائقة 5ms' : 'Sub-5ms Local Ping',
              desc: language === 'bn' 
                ? 'বিডিআইএক্স ক্যাশিং ও ১০০% NVMe স্টোরেজ সহ বাংলাদেশে সর্বোচ্চ গতির ওয়েব হোস্টিং আর্কিটেকচার।' 
                : language === 'ar' 
                ? 'استضافة محسنة لنطاق BDIX تقدم سرعة استجابة فائقة تقل عن 5 ملّي ثانية مع أقراص NVMe فائقة السرعة.' 
                : 'BDIX-optimized NVMe hosting delivering blazing-fast sub-5ms rendering speeds in Bangladesh.',
              priceUsd: 0.99,
              badgeText: language === 'bn' ? 'বিডিআইএক্স অপ্টিমাইজড ⚡' : language === 'ar' ? 'تحسين BDIX ⚡' : '5ms BDIX ⚡',
              badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
              color: 'from-sky-400 via-blue-500 to-indigo-600',
              glowColor: 'bg-sky-500',
              borderGlow: 'hover:border-sky-400/50 hover:shadow-sky-500/15',
              icon: Database,
              specs: language === 'bn' 
                ? ['৫ মিলি-সেকেন্ড বিডিআইএক্স লেটেন্সি', 'ফ্রি cPanel ও লাইটস্পিড ক্যাশ', '১০০% এন্টারপ্রাইজ NVMe SSD ড্রাইভ']
                : language === 'ar'
                ? ['استجابة محلية سريعة < 5ms', 'لوحة cPanel وخادم LiteSpeed', 'أقراص NVMe SSD فائقة الأداء']
                : ['Sub-5ms Ultra-Fast Local Ping', 'Free cPanel & LiteSpeed Cache', '100% Enterprise NVMe SSDs'],
              pillHighlight: language === 'bn' ? '৯৯.৯% আপটাইম গ্যারান্টি' : language === 'ar' ? 'ضمان استقرار 99.9%' : '99.9% Uptime SLA'
            },
            {
              id: 'cloud',
              title: language === 'bn' ? 'হাই-স্পিড ক্লাউড হোস্টিং' : language === 'ar' ? 'الاستضافة السحابية المتقدمة' : 'High-Speed Cloud Hosting',
              tagline: language === 'bn' ? 'অটো ফেইলওভার SAN' : language === 'ar' ? 'بنية سحابية ذاتية' : 'Auto-Failover SAN',
              desc: language === 'bn' 
                ? 'রিডানড্যান্ট ক্লাউড ক্লাস্টার, অটো-স্কেলিং ও ইমিউনিফাই ৩৬০ অ্যান্টি-DDoS হাই-প্রোটেকশন।' 
                : language === 'ar' 
                ? 'بنية تحتية سحابية عالية التوافر مع توسع تلقائي وحماية Imunify360 المتقدمة ضد الهجمات.' 
                : 'High-availability multi-node cloud clusters with auto-healing SAN and Imunify360 shield.',
              priceUsd: 4.99,
              badgeText: language === 'bn' ? 'অটো-হিলিং ক্লাউড ☁️' : language === 'ar' ? 'بنية سحابية ☁️' : 'Auto-Heal ☁️',
              badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
              color: 'from-cyan-400 via-teal-500 to-blue-600',
              glowColor: 'bg-cyan-500',
              borderGlow: 'hover:border-cyan-400/50 hover:shadow-cyan-500/15',
              icon: Cloud,
              specs: language === 'bn'
                ? ['রিডানড্যান্ট Ceph SAN স্টোরেজ', 'ফ্রি ওয়াইল্ডকার্ড SSL ও DDoS শিল্ড', 'শূন্য ডাউনটাইম অটো-রিউটিং']
                : language === 'ar'
                ? ['تخزين سحابي موزع Ceph SAN', 'شهادات أمان SSL وحماية DDoS', 'إعادة توجيه فورية بدون توقف']
                : ['Redundant Ceph SAN Storage', 'Free Wildcard SSL & DDoS Shield', 'Zero-Downtime Auto Routing'],
              pillHighlight: language === 'bn' ? 'লাইটস্পিড LSCache ইঞ্জিন' : language === 'ar' ? 'محرك تسريع LiteSpeed' : 'LiteSpeed LSCache Engine'
            },
            {
              id: 'vps',
              title: language === 'bn' ? 'ম্যানেজড ক্লাউড ভিপিএস' : language === 'ar' ? 'سيرفرات VPS المدارة' : 'Managed Cloud VPS',
              tagline: language === 'bn' ? 'ফুল রুট অ্যাক্সেস' : language === 'ar' ? 'تحكم كامل بالخادم' : 'Dedicated Core',
              desc: language === 'bn' 
                ? 'সার্ভার-গ্রেড ডেডিকেটেড সিপিইউ ও র‍্যাম, ডেডিকেটেড স্ট্যাটিক IPv4 ও সম্পূর্ণ রুট SSH অ্যাক্সেস।' 
                : language === 'ar' 
                ? 'خوادم عالية الأداء مع معالجات مخصصة وبيئة نظام تشغيل مستقلة بالكامل وعناوين IP خاصة.' 
                : 'High-performance nodes with dedicated server-grade CPUs, root access, and static IPv4.',
              priceUsd: 14.99,
              badgeText: language === 'bn' ? 'ডেডিকেটেড কোর 🚀' : language === 'ar' ? 'موارد مخصصة 🚀' : 'Dedicated Core 🚀',
              badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
              color: 'from-blue-600 via-indigo-600 to-purple-600',
              glowColor: 'bg-purple-500',
              borderGlow: 'hover:border-purple-400/50 hover:shadow-purple-500/15',
              icon: Cpu,
              specs: language === 'bn'
                ? ['ডেডিকেটেড স্ট্যাটিক IPv4 অ্যাড্রেস', 'ফুল রুট অ্যাডমিন SSH কন্ট্রোল', 'কেভিএম ভার্চুয়ালাইজেশন ও ১Gbps পোর্ট']
                : language === 'ar'
                ? ['عنوان IPv4 مخصص ومستقل', 'تحكم كامل بصلاحية Root SSH', 'افتراضية KVM ومنفذ 1Gbps']
                : ['Dedicated Static IPv4 Address', 'Full Root SSH Administrator Control', 'KVM Virtualization & 1Gbps Port'],
              pillHighlight: language === 'bn' ? '১Gbps আপলিঙ্ক ব্যাকবোন' : language === 'ar' ? 'منفذ شبكة فائق 1Gbps' : '1Gbps Uplink Backbone'
            },
            {
              id: 'reseller',
              title: language === 'bn' ? 'রিসেলার হোস্টিং ব্যবসা' : language === 'ar' ? 'استضافة الموزعين الاحترافية' : 'Reseller Hosting Agency',
              tagline: language === 'bn' ? 'WHM মাস্টার প্যানেল' : language === 'ar' ? 'لوحة تحكم WHM' : 'WHM Master Admin',
              desc: language === 'bn' 
                ? 'কাস্টম ব্র্যান্ডেড নেমসার্ভার ও মাস্টার WHM কন্ট্রোল সহ আপনার হোয়াইট-লেবেল এজেন্সি শুরু করুন।' 
                : language === 'ar' 
                ? 'ابدأ أعمالك التجارية الخاصة مع خوادم أسماء مخصصة ولوحة تحكم WHM كاملة وإدارة عملاء.' 
                : 'Start your white-label business with custom name servers, master WHM control, and billing.',
              priceUsd: 11.99,
              badgeText: language === 'bn' ? 'হোয়াইট-লেবেল 👥' : language === 'ar' ? 'علامة تجارية مخصصة 👥' : 'White-Label 👥',
              badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
              color: 'from-emerald-400 via-teal-500 to-cyan-500',
              glowColor: 'bg-emerald-500',
              borderGlow: 'hover:border-emerald-400/50 hover:shadow-emerald-500/15',
              icon: Layers,
              specs: language === 'bn'
                ? ['১০০% হোয়াইট-লেবেল প্রাইভেট DNS', 'মাস্টার WHM ও cPanel অ্যাকাউন্ট', 'ফ্রি ক্লায়েন্ট ডেটাবেজ মাইগ্রেশন']
                : language === 'ar'
                ? ['خوادم أسماء DNS بهويتك الخاصة', 'لوحة تحكم رئيسية WHM وحسابات cPanel', 'نقل بيانات العملاء مجاناً']
                : ['100% White-Label Private DNS', 'Master WHM Admin & cPanel Engine', 'Free Automated Website Migration'],
              pillHighlight: language === 'bn' ? 'আনলিমিটেড cPanel অ্যাকাউন্ট' : language === 'ar' ? 'حسابات cPanel غير محدودة' : 'Unlimited cPanel Accounts'
            }
          ];

          // Quadruple items to make the horizontal scroll ticker perfectly seamless on any viewport width
          const duplicatedCategories = [
            ...hostingCategoriesList,
            ...hostingCategoriesList,
            ...hostingCategoriesList,
            ...hostingCategoriesList
          ];

          return (
            <div className="mt-14 pt-10 border-t border-slate-800/60 relative">
              {/* Top Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-8 space-y-2.5 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{language === 'bn' ? 'নেক্সট-জেন সার্ভার আর্কিটেকচার' : language === 'ar' ? 'بنية خوادم الجيل القادم' : 'Next-Gen Server Architecture'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight flex items-center justify-center gap-2.5">
                  <span>
                    {language === 'bn' ? 'বিশেষায়িত হোস্টিং ক্যাটাগরি' : language === 'ar' ? 'فئات الاستضافة السحابية المخصصة' : 'Tailored Hosting Categories'}
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {language === 'bn' 
                    ? 'আপনার ইউনিক ট্রাফিক স্কেল এবং প্রয়োজনীয়তার জন্য বিশেষভাবে ডিজাইন করা প্রিমিয়াম কম্পিউটিং আর্কিটেকচার।' 
                    : language === 'ar' 
                    ? 'اختر البنية الحسابية المصممة لخصائص حركة المرور الفريدة لمتجرك أو موقعك الالكتروني مع سرعة فائقة.' 
                    : 'Choose the computing architectures designed for your unique traffic scales, workload needs, and growth.'}
                </p>

                {/* Quick Category Jump Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {hostingCategoriesList.map((cat) => (
                    <button
                      key={`jump-${cat.id}`}
                      type="button"
                      onClick={() => handleHostingCategorySelect(cat.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-sm group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
                      <span>{cat.title}</span>
                      <span className="text-[10.5px] font-mono text-cyan-400 font-bold ml-1">{getHostingFormattedPrice(cat.priceUsd)}</span>
                    </button>
                  ))}
                </div>

                {/* Hover Pause Status Indicator */}
                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <span className={`w-2 h-2 rounded-full ${isMarqueePaused ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-ping'}`} />
                  <span>
                    {isMarqueePaused 
                      ? (language === 'bn' ? '⏸️ পজ করা আছে — কার্ডে ক্লিক করে সরাসরি প্যাকেজে যান' : language === 'ar' ? '⏸️ متوقف مؤقتاً — انقر على أي بطاقة لعرض الباقة' : '⏸️ Paused — Click any card to configure plan')
                      : (language === 'bn' ? 'কার্ডে মাউস রেখে স্পেক্স দেখুন ও পজ করুন' : language === 'ar' ? 'مرر المؤشر للإيقاف المؤقت واستعراض المواصفات' : 'Hover over any card to pause and inspect technical specs')}
                  </span>
                </div>
              </div>

              {/* Seamless Marquee Outer Container */}
              <div 
                className="relative w-full overflow-hidden py-4 select-none"
                onMouseEnter={() => setIsMarqueePaused(true)}
                onMouseLeave={() => setIsMarqueePaused(false)}
                onTouchStart={() => setIsMarqueePaused(true)}
                onTouchEnd={() => setIsMarqueePaused(false)}
              >
                {/* Visual Edge Blur Vignettes */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />

                {/* Inline Style Sheet for Smooth CSS Keyframes Marquee */}
                <style>{`
                  @keyframes tailoredMarqueeAnim {
                    0% {
                      transform: translate3d(-50%, 0, 0);
                    }
                    100% {
                      transform: translate3d(0%, 0, 0);
                    }
                  }
                  .tailored-marquee-track {
                    animation: tailoredMarqueeAnim 40s linear infinite;
                    will-change: transform;
                  }
                  .tailored-marquee-track:hover {
                    animation-play-state: paused;
                  }
                `}</style>

                <div 
                  className="flex gap-6 w-max tailored-marquee-track"
                  style={{
                    animationPlayState: isMarqueePaused ? 'paused' : 'running'
                  }}
                >
                  {duplicatedCategories.map((card, idx) => {
                    const IconComponent = card.icon;

                    return (
                      <div
                        key={`${card.id}-${idx}`}
                        onClick={() => handleHostingCategorySelect(card.id)}
                        className={`w-[320px] sm:w-[350px] p-6 sm:p-7 rounded-[28px] bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95 border border-slate-800/80 ${card.borderGlow} shadow-[0_16px_40px_-15px_rgba(0,0,0,0.7)] hover:shadow-2xl transition-all duration-300 cursor-pointer group shrink-0 relative overflow-hidden flex flex-col justify-between backdrop-blur-xl hover:-translate-y-1`}
                      >
                        {/* Top specular accent bar */}
                        <div className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${card.color} opacity-70 group-hover:opacity-100 group-hover:h-[3px] transition-all duration-300`} />

                        {/* Ambient radial color bloom */}
                        <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-2xl group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 pointer-events-none`} />

                        <div>
                          {/* Top row: Icon + Spec Badge */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center w-12 h-12 shadow-lg shadow-black/40 shrink-0 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300`}>
                                <IconComponent className="w-6 h-6 stroke-[2.2]" />
                              </div>
                              <div>
                                <h4 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300 transition-colors leading-tight">
                                  {card.title}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded-md font-bold">
                                    <Activity className="w-2.5 h-2.5 text-cyan-400" />
                                    {card.tagline}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Floating Top-Right Spec Badge */}
                            <span className={`shrink-0 inline-flex items-center text-[9.5px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border shadow-sm ${card.badgeColor}`}>
                              {card.badgeText}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-[11.5px] sm:text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed min-h-[44px] mb-4 transition-colors">
                            {card.desc}
                          </p>

                          {/* 3 Tech Architecture Bullets */}
                          <div className="space-y-1.5 mb-4">
                            {card.specs.map((spec, sIdx) => (
                              <div 
                                key={sIdx}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-300 group-hover:border-slate-700/80 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate font-medium">{spec}</span>
                              </div>
                            ))}
                          </div>

                          {/* Performance SLA Tag */}
                          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-950/20 border border-cyan-800/20 mb-4">
                            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              {card.pillHighlight}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 font-bold">
                              {language === 'bn' ? 'তাত্ক্ষণিক অ্যাক্টিভেশন' : language === 'ar' ? 'تفعيل فوري' : 'Instant Provision'}
                            </span>
                          </div>
                        </div>

                        {/* Card Bottom: Dynamic Price + CTA Button */}
                        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] font-mono uppercase font-bold text-slate-500 block leading-none mb-1">
                              {language === 'bn' ? 'শুরু মাত্র' : language === 'ar' ? 'يبدأ من' : 'Starting from'}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-base sm:text-lg font-black text-white group-hover:text-cyan-400 transition-colors font-sans tracking-tight">
                                {getHostingFormattedPrice(card.priceUsd)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHostingCategorySelect(card.id);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-slate-800/90 group-hover:bg-gradient-to-r ${card.color} border border-slate-700/80 group-hover:border-transparent shadow-sm group-hover:shadow-md transition-all duration-300 cursor-pointer`}
                          >
                            <span>{language === 'bn' ? 'প্যাকেজ দেখুন' : language === 'ar' ? 'عرض الباقات' : 'Explore Plans'}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
