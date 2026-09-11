import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Globe, Star, Sparkles, 
  ArrowRight, RefreshCw, Layers, Check, Zap,
  Database, Cpu
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
        <div className="max-w-3xl mx-auto mb-4">
          <div className="relative p-1.5 sm:p-2 bg-slate-950/60 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-800/80 focus-within:border-cyan-500/50 shadow-2xl focus-within:shadow-cyan-500/10 transition-all duration-500">
            <form onSubmit={handleCheckAvailability} className="flex flex-col sm:flex-row items-stretch gap-1.5">
              
              {/* Domain Input & Extension selector grouped on a single line for mobile & desktop */}
              <div className="flex-1 flex items-center min-w-0 bg-transparent">
                <div className="relative flex-1 flex items-center min-w-0">
                  <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={currentTrans.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent pl-10 sm:pl-11 pr-2 sm:pr-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Selector Extension dropdown chip */}
                <div className="relative flex items-center px-1.5 sm:px-2 border-l border-slate-800/85 my-1 py-0.5 shrink-0">
                  <select
                    value={selectedExt}
                    onChange={(e) => setSelectedExt(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-bold text-cyan-400 cursor-pointer pr-3 sm:pr-4 pl-1 sm:pl-2 focus:outline-none uppercase"
                  >
                    {Object.keys(domainExtensionsPrices).map((ext) => (
                      <option key={ext} value={ext} className="bg-slate-900 text-white font-sans text-xs">
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
                className="px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]"
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
        {showCategories && (
          <div className="mt-12 pt-8 border-t border-slate-800/50">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  {language === 'bn' ? 'বিশেষায়িত হোস্টিং ক্যাটাগরি' : language === 'ar' ? 'فئات الاستضافة السحابية' : 'Tailored Hosting Categories'}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                {language === 'bn' 
                  ? 'আপনার ইউনিক ট্রাফিক স্কেল এবং প্রয়োজনীয়তার জন্য ডিজাইন করা কম্পিউটিং আর্কিটেকচারগুলো বেছে নিন।' 
                  : language === 'ar' 
                  ? 'اختر البنية الحسابية المصممة لخصائص حركة المرور الفريدة لمتجرك أو موقعك الالكتروني.' 
                  : 'Choose the computing architectures designed for your unique traffic scales and requirements.'}
              </p>
            </div>

            {/* Marquee Outer Container with horizontal overflow hidden */}
            <div className="relative w-full overflow-hidden py-4 select-none">
              {/* Smooth Edge Fades */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

              {/* Framer Motion Infinite Loop Container */}
              {/* Since we want to move from left to right (scrolling right), we animate x: ['-50%', '0%'] */}
              <motion.div 
                className="flex gap-6 w-max"
                animate={{ x: ['-50%', '0%'] }}
                transition={{
                  ease: "linear",
                  duration: 25,
                  repeat: Infinity,
                }}
              >
                {/* Double or triple the cards to ensure seamless infinite scroll */}
                {[
                  {
                    id: 'bdix',
                    title: language === 'bn' ? 'শেয়ার্ড বিডিআইএক্স হোস্টিং' : language === 'ar' ? 'استضافة BDIX المشتركة' : 'Shared BDIX Hosting',
                    desc: language === 'bn' 
                      ? 'বিডিআইএক্স-অপ্টিমাইজড হোস্টিং যা বাংলাদেশে ৫ মিলি-সেকেন্ডের কম লেটেন্সি দেয়।' 
                      : language === 'ar' 
                      ? 'استضافة محسنة لنطاق BDIX تقدم سرعة استجابة فائقة تقل عن 5 ملّي ثانية.' 
                      : 'BDIX-optimized hosting delivering sub-5ms rendering speeds in Bangladesh.',
                    price: language === 'bn' ? '৳১২০/মাস' : language === 'ar' ? '$0.99/شهرياً' : '$0.99/mo',
                    icon: Database
                  },
                  {
                    id: 'vps',
                    title: language === 'bn' ? 'ম্যানেজড ভিপিএস হোস্টিং' : language === 'ar' ? 'خوادم VPS المدارة' : 'Managed VPS Hosting',
                    desc: language === 'bn' 
                      ? 'ডেডিকেটেড সার্ভার-গ্রেড সিপিইউ এবং ওএস এনভায়রনমেন্ট সহ হাই-পারফরম্যান্স নোড।' 
                      : language === 'ar' 
                      ? 'خوادم عالية الأداء مع معالجات مخصصة وبيئة نظام تشغيل مستقلة بالكامل.' 
                      : 'High-performance nodes with dedicated server-grade CPUs and OS environments.',
                    price: language === 'bn' ? '৳১৮০০/মাস' : language === 'ar' ? '$14.99/شهرياً' : '$14.99/mo',
                    icon: Cpu
                  },
                  {
                    id: 'reseller',
                    title: language === 'bn' ? 'রিসেলার হোস্টিং' : language === 'ar' ? 'استضافة الموزعين' : 'Reseller Hosting',
                    desc: language === 'bn' 
                      ? 'কাস্টম নেম সার্ভার এবং WHM কন্ট্রোল সহ আপনার হোয়াইট-লেবেল ব্যবসা শুরু করুন।' 
                      : language === 'ar' 
                      ? 'ابدأ أعمالك التجارية الخاصة مع خوادم أسماء مخصصة ولوحة تحكم WHM كاملة.' 
                      : 'Start your white-label business with custom name servers and WHM control.',
                    price: language === 'bn' ? '৳১৪৫০/মাস' : language === 'ar' ? '$11.99/شهرياً' : '$11.99/mo',
                    icon: Layers
                  }
                ].concat([
                  {
                    id: 'bdix',
                    title: language === 'bn' ? 'শেয়ার্ড বিডিআইএক্স হোস্টিং' : language === 'ar' ? 'استضافة BDIX المشتركة' : 'Shared BDIX Hosting',
                    desc: language === 'bn' 
                      ? 'বিডিআইএক্স-অপ্টিমাইজড হোস্টিং যা বাংলাদেশে ৫ মিলি-সেকেন্ডের কম লেটেন্সি দেয়।' 
                      : language === 'ar' 
                      ? 'استضافة محسنة لنطاق BDIX تقدم سرعة استجابة فائقة تقل عن 5 ملّي ثانية.' 
                      : 'BDIX-optimized hosting delivering sub-5ms rendering speeds in Bangladesh.',
                    price: language === 'bn' ? '৳১২০/মাস' : language === 'ar' ? '$0.99/شهرياً' : '$0.99/mo',
                    icon: Database
                  },
                  {
                    id: 'vps',
                    title: language === 'bn' ? 'ম্যানেজড ভিপিএস হোস্টিং' : language === 'ar' ? 'خوادم VPS المدارة' : 'Managed VPS Hosting',
                    desc: language === 'bn' 
                      ? 'ডেডিকেটেড সার্ভার-গ্রেড সিপিইউ এবং ওএস এনভায়রনমেন্ট সহ হাই-পারফরম্যান্স নোড।' 
                      : language === 'ar' 
                      ? 'خوادم عالية الأداء مع معالجات مخصصة وبيئة نظام تشغيل مستقلة بالكامل.' 
                      : 'High-performance nodes with dedicated server-grade CPUs and OS environments.',
                    price: language === 'bn' ? '৳১৮০০/মাস' : language === 'ar' ? '$14.99/شهرياً' : '$14.99/mo',
                    icon: Cpu
                  },
                  {
                    id: 'reseller',
                    title: language === 'bn' ? 'রিসেলার হোস্টিং' : language === 'ar' ? 'استضافة الموزعين' : 'Reseller Hosting',
                    desc: language === 'bn' 
                      ? 'কাস্টম নেম সার্ভার এবং WHM কন্ট্রোল সহ আপনার হোয়াইট-লেবেল ব্যবসা শুরু করুন।' 
                      : language === 'ar' 
                      ? 'ابدأ أعمالك التجارية الخاصة مع خوادم أسماء مخصصة ولوحة تحكم WHM كاملة.' 
                      : 'Start your white-label business with custom name servers and WHM control.',
                    price: language === 'bn' ? '৳১৪৫০/মাস' : language === 'ar' ? '$11.99/شهرياً' : '$11.99/mo',
                    icon: Layers
                  }
                ]).concat([
                  {
                    id: 'bdix',
                    title: language === 'bn' ? 'শেয়ার্ড বিডিআইএক্স হোস্টিং' : language === 'ar' ? 'استضافة BDIX المشتركة' : 'Shared BDIX Hosting',
                    desc: language === 'bn' 
                      ? 'বিডিআইএক্স-অপ্টিমাইজড হোস্টিং যা বাংলাদেশে ৫ মিলি-সেকেন্ডের কম লেটেন্সি দেয়।' 
                      : language === 'ar' 
                      ? 'استضافة محسنة لنطاق BDIX تقدم سرعة استجابة فائقة تقل عن 5 ملّي ثانية.' 
                      : 'BDIX-optimized hosting delivering sub-5ms rendering speeds in Bangladesh.',
                    price: language === 'bn' ? '৳১২০/মাস' : language === 'ar' ? '$0.99/شهرياً' : '$0.99/mo',
                    icon: Database
                  },
                  {
                    id: 'vps',
                    title: language === 'bn' ? 'ম্যানেজড ভিপিএস হোস্টিং' : language === 'ar' ? 'خوادم VPS المدارة' : 'Managed VPS Hosting',
                    desc: language === 'bn' 
                      ? 'ডেডিকেটেড সার্ভার-গ্রেড সিপিইউ এবং ওএস এনভায়রনমেন্ট সহ হাই-পারফরম্যান্স নোড।' 
                      : language === 'ar' 
                      ? 'خوادم عالية الأداء مع معالجات مخصصة وبيئة نظام تشغيل مستقلة بالكامل.' 
                      : 'High-performance nodes with dedicated server-grade CPUs and OS environments.',
                    price: language === 'bn' ? '৳১৮০০/মাস' : language === 'ar' ? '$14.99/شهرياً' : '$14.99/mo',
                    icon: Cpu
                  },
                  {
                    id: 'reseller',
                    title: language === 'bn' ? 'রিসেলার হোস্টিং' : language === 'ar' ? 'استضافة الموزعين' : 'Reseller Hosting',
                    desc: language === 'bn' 
                      ? 'কাস্টম নেম সার্ভার এবং WHM কন্ট্রোল সহ আপনার হোয়াইট-লেবেল ব্যবসা শুরু করুন।' 
                      : language === 'ar' 
                      ? 'ابدأ أعمالك التجارية الخاصة مع خوادم أسماء مخصصة ولوحة تحكم WHM كاملة.' 
                      : 'Start your white-label business with custom name servers and WHM control.',
                    price: language === 'bn' ? '৳১৪৫০/মাস' : language === 'ar' ? '$11.99/شهرياً' : '$11.99/mo',
                    icon: Layers
                  }
                ]).map((card, idx) => {
                  const IconComponent = card.icon;
                  const catColor = card.id === 'bdix' 
                    ? 'from-sky-400 to-blue-600' 
                    : card.id === 'vps' 
                    ? 'from-[#2563EB] to-[#8B5CF6]' 
                    : 'from-emerald-400 to-cyan-500';
                  
                  const catBadge = card.id === 'bdix'
                    ? (language === 'bn' ? "বিডিআইএক্স অপ্টিমাইজড ⚡" : language === 'ar' ? "تحسين BDIX ⚡" : "BDIX Optimized ⚡")
                    : card.id === 'vps'
                    ? (language === 'bn' ? "ডেডিকেটেড কোর 🚀" : language === 'ar' ? "أنوية مخصصة 🚀" : "Dedicated Core 🚀")
                    : (language === 'bn' ? "হোয়াইট-লেবেল 👥" : language === 'ar' ? "علامة تجارية مخصصة 👥" : "White-Label 👥");

                  const subBadge = card.id === 'bdix' ? 'BDIX Network' : card.id === 'vps' ? 'Root Access' : 'WHM Panel';

                  return (
                    <div
                      key={`${card.id}-${idx}`}
                      onClick={() => {
                        setCurrentPage('hosting');
                        setTimeout(() => {
                          const el = document.getElementById('redesigned-categories');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="w-[280px] sm:w-[320px] p-5 sm:p-6 bg-slate-950/80 hover:bg-slate-900 rounded-3xl border border-slate-800/60 hover:border-cyan-500/30 transition-all duration-300 shadow-xl cursor-pointer group shrink-0 relative overflow-hidden flex flex-col justify-between"
                    >
                      {/* Visual glow accent */}
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${catColor} opacity-10 blur-xl pointer-events-none group-hover:opacity-35 transition duration-500`} />
                      
                      {/* Top Floating Mini Badge */}
                      <span className="absolute top-3.5 right-3.5 text-slate-400 group-hover:text-cyan-300 font-mono font-bold text-[8px] uppercase tracking-wider bg-slate-900/60 border border-slate-800/80 px-2 py-0.5 rounded-full transition duration-300">
                        {catBadge}
                      </span>

                      <div className="space-y-4">
                        {/* Icon beside title */}
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${catColor} text-white flex items-center justify-center w-10 h-10 shadow-md shrink-0 transition duration-300 group-hover:scale-105`}>
                            <IconComponent className="w-5 h-5 stroke-[2]" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition duration-300">
                              {card.title}
                            </h4>
                            <span className="inline-block text-[8.5px] font-mono uppercase bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-md font-bold mt-0.5">
                              {subBadge}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed min-h-[44px]">
                          {card.desc}
                        </p>
                      </div>

                      {/* Bottom Pricing Indicator */}
                      <div className="mt-4 pt-3.5 border-t border-slate-900 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold font-mono block leading-none mb-1">
                            {language === 'bn' ? 'শুরু মাত্র' : language === 'ar' ? 'يبدأ من' : 'Starting from'}
                          </span>
                          <span className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-400 transition duration-300 font-sans">
                            {card.price}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-black text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                          {language === 'bn' ? 'হোস্টিং দেখুন' : language === 'ar' ? 'عرض الاستضافة' : 'View Hosting'} →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
