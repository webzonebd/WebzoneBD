import React, { useState, useEffect } from 'react';
import { 
  Server, Shield, Cpu, HardDrive, Database, Zap, Sparkles, 
  Check, ArrowRight, Phone, MessageSquare, ExternalLink, HelpCircle, 
  Globe, Terminal, Award, BadgeAlert, Layers, Activity, Lock, Search, 
  Star, RefreshCw, Layers as LayersIcon, CheckCircle, Info, HelpCircle as HelpIcon,
  ChevronDown, PhoneCall, CheckCircle2, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme, Currency, Product } from '../types';
import VpsPerformanceChart from './VpsPerformanceChart';

interface HostingProps {
  language: Language;
  theme: Theme;
  currency: Currency;
  currencySettings?: any;
  addToCart?: (product: Product) => void;
}

export default function Hosting({ 
  language, 
  theme, 
  currency, 
  currencySettings, 
  addToCart 
}: HostingProps) {
  
  // Active category tab for filtering Packages
  const [activeTab, setActiveTab] = useState<'bdix' | 'vps' | 'reseller'>('bdix');

  const selectTab = (tab: 'bdix' | 'vps' | 'reseller') => {
    setActiveTab(tab);
    localStorage.setItem('webzone_target_hosting_tab', tab);
  };

  useEffect(() => {
    const handleStorage = () => {
      const target = localStorage.getItem('webzone_target_hosting_tab');
      if (target === 'bdix' || target === 'vps' || target === 'reseller') {
        setActiveTab(target);
      }
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 150);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);
  
  // Billing cycle state: monthly | yearly
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // FAQ Accordion active indices state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Domain search state inside the redesigned page
  const [domainQuery, setDomainQuery] = useState('');
  const [selectedExt, setSelectedExt] = useState('.com');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedName, setSearchedName] = useState('');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  
  const [domainResult, setDomainResult] = useState<{
    domain: string;
    isAvailable: boolean;
    isPremium: boolean;
    priceUSD: number;
  } | null>(null);

  const isRtl = language === 'ar';

  const bdtPrices: Record<string, number> = {
    'bdix-starter': 100,
    'bdix-business': 200,
    'bdix-professional': 350,
    'vps-starter': 1750,
    'vps-business': 3505,
    'vps-professional': 5925,
    'reseller-10g': 1400,
    'reseller-20g': 2340,
    'reseller-50g': 4680,
  };

  // Currency rates & precise formatting
  const formatPriceVal = (value: number) => {
    let cur = currency;
    if (currencySettings) {
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
        cur = firstEnabled || 'USD';
      }
    }
    switch (cur) {
      case 'BDT':
        return `৳ ${Math.round(value).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${value.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${value.toFixed(2)}`;
    }
  };

  const getMonthlyPrice = (pkgId: string) => {
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

    const bdtBase = bdtPrices[pkgId] || 100;
    const bdtRate = rates.BDT ?? 118.5;
    const targetRate = rates[cur] ?? 1.0;

    // Convert from BDT Base currency dynamically
    const priceInUSD = bdtBase / bdtRate;
    return priceInUSD * targetRate;
  };

  const formatPeriod = () => {
    if (language === 'bn') return '/মাস';
    if (language === 'ar') return '/شهرياً';
    return '/mo';
  };

  // Redesign translation dict
  const t = {
    en: {
      heroTitle: "Premium Web Hosting Solutions",
      heroSubtitle: "Fast, secure, and reliable hosting services for businesses, ecommerce stores, blogs, and enterprise applications.",
      getStarted: "Get Started",
      comparePlans: "Compare Plans",
      whatsappSupport: "WhatsApp Support",
      
      domainTitle: "Find Your Perfect Domain Name",
      domainPlaceholder: "Search your perfect domain...",
      registerDomain: "Register Domain",
      transferDomain: "Transfer Domain",
      viewPricing: "View Pricing",
      available: "Domain is Available!",
      taken: "Already Registered / Taken",
      
      categoriesHeading: "Tailored Hosting Categories",
      categoriesSub: "Choose the computing architectures designed for your unique traffic scales and requirements.",
      sharedTitle: "Shared BDIX Hosting",
      sharedDesc: "BDIX-optimized hosting delivering sub-5ms rendering speeds in Bangladesh.",
      vpsTitle: "Managed VPS Hosting",
      vpsDesc: "High-performance nodes with dedicated server-grade CPUs and OS environments.",
      resellerTitle: "Reseller Hosting",
      resellerDesc: "Start your white-label business with custom name servers and WHM control.",
      explorePlans: "Explore Packages",
      from: "Starting at",

      packagesHeading: "Flexible Hosting Plans",
      packagesSub: "Save 20% on any plan when choosing annual billing cycles. Automated setup in minutes.",
      hourlyBillingMsg: "Secure cPanel with fast LiteSpeed server and malware screening shields.",
      save20: "Yearly (Save 20%)",
      monthly: "Monthly Only",
      totalSavings: "Total Savings:",
      originalYearly: "Original Cost:",
      discountedYearly: "Annual Bill:",
      orderButton: "Order Package",
      contactSales: "Contact Sales",
      perfectFor: "Ideal for:",

      featsTitle: "State-of-the-Art Architecture",
      featsSub: "Our servers are built with top-tier hardware configurations and direct connectivity switches.",
      feat1: "LiteSpeed Web Server",
      feat1Desc: "Supercharged page caching resulting in 20x faster page rendering speeds.",
      feat2: "Free SSL Certificate",
      feat2Desc: "Automated standard Let's Encrypt Wildcard SSL encryption keys.",
      feat3: "SSD Storage",
      feat3Desc: "High-density enterprise SSD NVMe storage with fast write operations.",
      feat4: "Daily Backup",
      feat4Desc: "Automated off-site cloud replication for continuous data protection.",
      feat5: "cPanel Control Panel",
      feat5Desc: "Industry-standard administration panel featuring 1-click script installers.",
      feat6: "BDIX Connectivity",
      feat6Desc: "Direct local network routes providing low-ping response speeds.",
      feat7: "99.9% Uptime",
      feat7Desc: "Backed by enterprise-grade SLA guarantees and automated link failover.",
      feat8: "24/7 Support",
      feat8Desc: "Continuous expert troubleshooting via Tickets, WhatsApp and Phone.",

      compHeading: "Plan Comparison Matrix",
      compSub: "Evaluate technical specifications across our premium hosting tier lines side by side.",
      compStorage: "SSD Storage Capacity",
      compBandwidth: "Monthly Bandwidth Limit",
      compSSL: "SSL Protection Type",
      compEmails: "Professional Email Addresses",
      compDatabases: "MySQL Database Limits",
      compSupport: "Support Clearances",
      compBackups: "Backup Schedules",
      compUptime: "Uptime Reliability Rate",

      reviewsHeading: "Trusted by Modern Agencies",
      reviewsSub: "Read success stories from businesses and development agencies leveraging our hosting services.",
      r1Author: "Arman Chowdhury",
      r1Role: "Systems Tech Lead, Dhaka Agency",
      r1Text: "The BDIX speeds are absolutely incredible. Our local client portfolios load instantly in less than 2 seconds. Exceptional server consistency!",
      r2Author: "Siddique Al-Ghamdi",
      r2Role: "Technical Director, Saudi AgriGroup",
      r2Text: "The customer support at WebzoneBD is unmatched. We migrated our heavy CRM database without single second of downtime. Highly recommended!",
      r3Author: "Masud Zaman",
      r3Role: "Founder of ShopBD Hub",
      r3Text: "Using the reseller package to manage 45+ WordPress stores. The WHM custom branding and LiteSpeed cache engine are incredible assets.",

      faqHeading: "Common Questions & Answers",
      faqSub: "Get answers to key server configurations, website migrations, and domain registration.",
      f1Q: "What is BDIX Hosting?",
      f1A: "BDIX hosting utilizes direct connections with the Bangladesh Internet Exchange (BDIX). This provides extremely low latency (under 5ms) and fast rendering for visitors inside Bangladesh.",
      f2Q: "How do I migrate my website?",
      f2A: "Our server administrators handle website migration completely free! We migrate all file databases, configurations, and emails with zero downtime guaranteed.",
      f3Q: "Do you provide backups?",
      f3A: "Yes! All packages receive automated weekly backups. Business and Professional tiers include automatic daily cloud backups with instant recovery tools inside cPanel.",
      f4Q: "Can I upgrade later?",
      f4A: "Absolutely. You can seamlessly scale computing power, NVMe storage space, or server resources directly from your client panel at any time without data loss.",
      f5Q: "What support do you provide?",
      f5A: "We provide 24/7 support. You can reach out directly via live web tickets, WhatsApp support chats, or by contacting our specialized systems administrators.",

      needHelp: "Need Help Selecting a Custom Hosting Matrix?",
      needHelpSub: "Get custom recommendation tailored to your framework profiles, website traffic, and compute requirements.",
      orderHosting: "Order Hosting",
    },
    bn: {
      heroTitle: "প্রিমিয়াম ওয়েব হোস্টিং সলিউশন",
      heroSubtitle: "ব্যবসা, ই-কমার্স স্টোর, ব্লগ এবং করপোরেট অ্যাপ্লিকেশনের জন্য অত্যন্ত দ্রুত, নিরাপদ এবং নির্ভরযোগ্য হোস্টিং সেবা।",
      getStarted: "শুরু করুন",
      comparePlans: "প্ল্যানসমূহ তুলনা করুন",
      whatsappSupport: "হোয়াটসঅ্যাপ সাপোর্ট",

      domainTitle: "আপনার পছন্দের ডোমেন সংরক্ষণ করুন",
      domainPlaceholder: "আপনার পছন্দের ডোমেনটি খুঁজুন...",
      registerDomain: "ডোমেন বুকিং",
      transferDomain: "ডোমেন ট্রান্সফার",
      viewPricing: "মূল্য তালিকা",
      available: "ডোমেনটি খালি আছে!",
      taken: "ইতিমধ্যে নিবন্ধিত / খালি নেই",

      categoriesHeading: "বিশেষায়িত হোস্টিং ক্যাটাগরি",
      categoriesSub: "আপনার ট্রাফিক লোড এবং সফটওয়্যারের পরিধি অনুযায়ী নিখুঁত কম্পিউটিং ক্যাটাগরি বেছে নিন।",
      sharedTitle: "শেয়ার্ড বিডিআইএক্স হোস্টিং",
      sharedDesc: "বাংলাদেশী গ্রাহকদের জন্য ৫ মিলি-সেকেন্ডের নিচে দ্রুত পেজ লোড সমন্বিত বিডিআইএক্স হোস্টিং।",
      vpsTitle: "ম্যানেজড ভিপিএস হোস্টিং",
      vpsDesc: "ডেডিকেটেড প্রসেসর এবং আল্ট্রা-স্পিড রিসোর্স সমৃদ্ধ উচ্চ ক্ষমতাসম্পন্ন ভার্চুয়াল সার্ভার।",
      resellerTitle: "রিসেলার হোস্টিং",
      resellerDesc: "WHM কন্ট্রোল এবং কাস্টম নেমসার্ভার দিয়ে নিজস্ব ব্র্যান্ড নামে হোস্টিং ব্যবসা শুরু করুন।",
      explorePlans: "প্যাকেজসমূহ দেখুন",
      from: "শুরু মাত্র",

      packagesHeading: "হোস্টিং প্যাকেজসমূহ",
      packagesSub: "বার্ষিক বিলিং চক্রে ২০% পর্যন্ত সাশ্রয় উপভোগ করুন। মাত্র কয়েক মিনিটে অটোমেটেড সেটআপ।",
      hourlyBillingMsg: "ফাস্ট লাইটস্পিড এবং ম্যালওয়্যার শিল্ড সুরক্ষাসহ সিপ্যানেল প্যানেল সুবিধা।",
      save20: "বার্ষিক পেমেন্ট (২০% ছাড়)",
      monthly: "শুধুমাত্র মাসিক পেমেন্ট",
      totalSavings: "মোট সাশ্রয়:",
      originalYearly: "সাধারণ মূল্য:",
      discountedYearly: "বার্ষিক মূল্য:",
      orderButton: "অর্ডার করুন",
      contactSales: "সেন্স টিম",
      perfectFor: "আদর্শ ব্যবহার ক্ষেত্র:",

      featsTitle: "সেরা মানের আধুনিক হোস্টিং ফিচার",
      featsSub: "আমাদের প্রতিটি নোড এন্টারপ্রাইজ হার্ডওয়্যার এবং কাস্টম স্পিড অপ্টিমাইজেশন দ্বারা পরিচালিত।",
      feat1: "লাইটস্পিড ওয়েব সার্ভার",
      feat1Desc: "উন্নত ক্যাশিং প্রযুক্তিসম্পন্ন যা সাধারণ সার্ভার অপেক্ষা ২০ গুণ পর্যন্ত দ্রুত পেজ লোড দেয়।",
      feat2: "ফ্রি এসএসএল সার্টিফিকেট",
      feat2Desc: "লেটস এনক্রিপ্ট ওয়াইল্ডকার্ড এসএসএল যা আপনার ওয়েবসাইটকে রাখে সুরক্ষিত।",
      feat3: "এসএসডি স্টোরেজ",
      feat3Desc: "দ্রুততম রিড/রাইট স্পিডের জন্য হাই-ডেন্সিটি এন্টারপ্রাইজ এসএসডি এনভিএমই ড্রাইভ।",
      feat4: "দৈনিক ব্যাকআপ",
      feat4Desc: "ডাটা সুরক্ষায় প্রতিদিন স্বয়ংক্রিয় অফ-সাইট ক্লাউড ব্যাকআপ সিস্টেম।",
      feat5: "সিপ্যানেল কন্ট্রোল প্যানেল",
      feat5Desc: "১-ক্লিক স্ক্রিপ্ট ইন্সটলার সংবলিত বিশ্বমানের সহজতম কন্ট্রোল প্যানেল।",
      feat6: "বিডিআইএক্স কানেক্টিভিটি",
      feat6Desc: "স্থানীয় ইন্টারনেট এক্সচেঞ্জের সাথে সংযোগ যা বাংলাদেশে লেটেন্সি কমিয়ে স্পিড বাড়ায়।",
      feat7: "৯৯.৯% আপটাইম",
      feat7Desc: "উন্নত এন্টারপ্রাইজ এসএলএ গ্যারান্টি এবং নিরবচ্ছিন্ন ফেইলওভার পাওয়ার সুবিধা।",
      feat8: "২৪/৭ টেকনিক্যাল সাপোর্ট",
      feat8Desc: "অভিজ্ঞ সার্ভার বিশেষজ্ঞদের থেকে টিকিট, হোয়াটসঅ্যাপ এবং সরাসরি ফোনে দিনরাত সাহায্য।",

      compHeading: "ফিচার তুলনা তালিকা",
      compSub: "আমাদের আকর্ষণীয় হোস্টিং প্ল্যানগুলোর মধ্যকার কারিগরি পার্থক্যসমূহ বিস্তারিত তুলনা করে দেখুন।",
      compStorage: "এসএসডি স্টোরেজ সীমা",
      compBandwidth: "মাসিক ব্যান্ডউইথ লিমিট",
      compSSL: "এসএসএল প্রটেকশন",
      compEmails: "প্রফেশনাল ইমেইল আইডি",
      compDatabases: "মাইএসকিউএল ডাটাবেস সীমা",
      compSupport: "টেকনিক্যাল সাপোর্ট টাইপ",
      compBackups: "ডাটা ব্যাকআপ পরিকল্পনা",
      compUptime: "আপটাইম গ্যারান্টি রেট",

      reviewsHeading: "আমাদের গ্রাহকদের ইতিবাচক মতামত",
      reviewsSub: "আইটি এজেন্সি এবং করপোরেট প্রতিষ্ঠানসমূহের সফলতার সত্য কাহিনী ও প্রশংসাসমূহ জানুন।",
      r1Author: "আরমান চৌধুরী",
      r1Role: "সিস্টেম টেক লিড, ঢাকা এজেন্সি",
      r1Text: "বিডিআইএক্স কানেক্টিভিটি অসাধারণ। আমাদের গ্রাহকদের পোর্টফোলিও ওয়েবসাইটগুলো কোনো বাফারিং ছাড়াই লোড হয়। ধন্যবাদ ওয়েবজোনবিডি!",
      r2Author: "সিদ্দিক আল-গামদি",
      r2Role: "প্রযুক্তিগত পরিচালক, সৌদি অ্যাগ্রিগ্রুপ",
      r2Text: "তাদের সাপোর্ট অত্যন্ত আন্তরিক ও পেশাদার। কোডিং ম্যাপের ডাউনটাইম ছাড়াই অত্যন্ত সহজে ও নিরাপদে ডাটাবেস হোস্টিংয়ে মাইগ্রেশন সম্পন্ন হয়েছে।",
      r3Author: "মাসুদ জামান",
      r3Role: "শপবিডি হাবের প্রতিষ্ঠাতা",
      r3Text: "আমি ৪৫টিরও বেশি ওয়ার্ডপ্রেস ওয়েবসাইট দেখাশোনায় রিসেলার প্ল্যানটি বেছে নিয়েছি। হোয়াইট লেবেল নেমসার্ভার এবং লাইটস্পিড স্পিড ক্যাশ অসাধারণ কাজ করে।",

      faqHeading: "সাধারণ জিজ্ঞাসা ও উত্তর",
      faqSub: "কনফিগারেশন, মাইগ্রেশন এবং ডোমেন বুকিং সম্পর্কিত প্রয়োজনীয় নির্দেশনাবলী নিচে তুলে ধরা হলো।",
      f1Q: "বিডিআইএক্স হোস্টিং কী?",
      f1A: "বিডিআইএক্স হোস্টিং হলো বাংলাদেশি গ্রাহকদের জন্য অপ্টিমাইজড হোস্টিং, যা সরাসরি লোকাল ইন্টারনেট এক্সচেঞ্জের মাধ্যমে ৫ মিলি-সেকেন্ডের নিচে ওয়েবসাইট লোড করতে পারে।",
      f2Q: "আপনারা কি ফ্রি ওয়েবসাইট ট্রান্সফার করে দেন?",
      f2A: "হ্যাঁ! আমাদের কারিগরি বিশেষজ্ঞরা সম্পূর্ণ ডাউনটাইম ও ডাটা হারানোর ঝুঁকি ছাড়াই আপনার আগের সার্ভার থেকে সমস্ত ডাটা আমাদের ড্রাইভে ফ্রিতে ট্রান্সফার করে দেয়।",
      f3Q: "আপনারা কি নিয়মিত ব্যাকআপ রাখেন?",
      f3A: "হ্যাঁ! প্রতিটি অ্যাকাউন্টে সাপ্তাহিক রিমোট ব্যাকআপ রাখা হয়। এছাড়া বিজনেস ও প্রফেশনাল প্ল্যানে রয়েছে দৈনিক ক্লাউড ব্যাকআপ এবং সিপ্যানেল থেকে দ্রুত রিস্টোর সুবিধা।",
      f4Q: "পরবর্তীতে কি প্ল্যান আপগ্রেড করা যাবে?",
      f4A: "অবশ্যই। আপনার ট্রাফিক বাড়লে আপনি যেকোনো সময় কোনো ফাইল নষ্ট হওয়া ছাড়াই গ্রাহক ড্যাশবোর্ড থেকে তাৎক্ষণিক আপনার হোস্টিং প্ল্যান আপগ্রেড করতে পারবেন।",
      f5Q: "আপনারা কী ধরনের সাপোর্ট দিয়ে থাকেন?",
      f5A: "আমারা টিকিট ড্যাশবোর্ড, সার্বক্ষণিক হোয়াটসঅ্যাপ গ্রুপ এবং সরাসরি মোবাইল কলের মাধ্যমে ২৪ ঘণ্টা সার্বক্ষণিক বিশেষজ্ঞ টেক সাপোর্ট দিয়ে থাকি।",

      needHelp: "হোস্টিং প্ল্যান নির্বাচনে ফ্রি পরামর্শ প্রয়োজন?",
      needHelpSub: "আপনার ওয়েবসাইটের ট্রাফিক এবং ব্যবহৃত ফ্রেমওয়ার্ক ডাইনামিক্স অনুযায়ী সঠিক হোস্টিং সিলেক্ট করতে বিশেষজ্ঞ পরামর্শ নিন ফ্রিতে।",
      orderHosting: "হোস্টিং অর্ডার করুন",
    },
    ar: {
      heroTitle: "حلول استضافة المواقع الفاخرة",
      heroSubtitle: "خدمات استضافة سريعة وآمنة وموثوقة بالكامل للشركات، والمتاجر الإلكترونية، والمدونات، وتطبيقات الأعمال الكبرى.",
      getStarted: "ابدأ الآن",
      comparePlans: "مقارنة الخطط",
      whatsappSupport: "الدعم عبر واتساب",

      domainTitle: "ابحث عن نطاقك المثالي فوراً",
      domainPlaceholder: "ابحث عن اسم نطاقك المثالي...",
      registerDomain: "تسجيل النطاق",
      transferDomain: "نقل النطاق",
      viewPricing: "عرض الأسعار",
      available: "النطاق متاح للحجز فوراً!",
      taken: "هذا النطاق محجوز بالفعل",

      categoriesHeading: "فئات الاستضافة السحابية",
      categoriesSub: "اختر الحل المناسب لحجم حركة المرور لمشروعك ومواصفات قواعد البيانات المطلوبة.",
      sharedTitle: "استضافة BDIX المشتركة",
      sharedDesc: "استضافة فائقة السرعة BDIX تضمن تصفح يقل عن 5 مللي ثانية للمستخدمين والزوار بمرونة تامة.",
      vpsTitle: "خوادم VPS المدارة",
      vpsDesc: "خوادم افتراضية خاصة قوية توفر معالجات وموارد مخصصة بالكامل لتشغيل التطبيقات والبرمجيات الكبرى.",
      resellerTitle: "استضافة الموزعين Reseller",
      resellerDesc: "ابدأ نشاطك واستضف عملاءك تحت هويتك التجارية وعناوين خوادمك المخصصة كلياً.",
      explorePlans: "عرض الباقات",
      from: "يبدأ سِعر من",

      packagesHeading: "خطط الاستضافة المرنة",
      packagesSub: "وفر ٢٠٪ من قيمة أي باقة تختارها عند الفوترة والدفع السنوي المسبق. تفعيل تلقائي متكامل بدقائق.",
      hourlyBillingMsg: "لوحة تحكم cPanel مألوفة تدعم مسرعات LiteSpeed وحماية جدران الإطفاء ومكافحة الم malware.",
      save20: "الدفع السنوي (وفر ٢٠٪)",
      monthly: "الدفع الشهري فقط",
      totalSavings: "مجموع التوفير الفعلي:",
      originalYearly: "التكلفة السنوية المعتادة:",
      discountedYearly: "الفاتورة السنوية المخفضة:",
      orderButton: "اطلب الآن",
      contactSales: "تواصل بالمبيعات",
      perfectFor: "مثالي لـ:",

      featsTitle: "بنية تحتية هندسية رائدة",
      featsSub: "جميع الخوادم لدينا مزودة بمكونات عتاد متكاملة وحزم تسريع سحابية ذكية تضمن تفوقك الرقمي.",
      feat1: "خادم الويب السريع LiteSpeed",
      feat1Desc: "مسرعات كاش ذكية توفر تصفح وتحميل أسرع بـ ٢٠ ضعفاً مقارنة بالسيرفرات المعتادة.",
      feat2: "شهادة أمان SSL مجانية",
      feat2Desc: "تشفير وحماية لكافة اتصالات زوار موقعك بشهادات Let's Encrypt آمنة.",
      feat3: "أقراص تخزين SSD NVMe",
      feat3Desc: "وحدات تخزين صلبة فائقة لضمان تلبية عمليات الاستعلام المعقدة عن البيانات كاستم بلمح البصر.",
      feat4: "النسخ الاحتياطي اليومي",
      feat4Desc: "حفظ وأرشفة ملفاتك وقواعد البيانات يومياً على خوادم سحابية خارجية لتأمين استقرار أعمالك.",
      feat5: "لوحة تحكم cPanel الشهيرة",
      feat5Desc: "إدارة كاملة لبريدك والملفات وقواعد البيانات وتثبيت السكريبتات بضغطة واحدة وبمرونة ممتازة.",
      feat6: "ارتباط ومسرع BDIX السريع",
      feat6Desc: "ربط فوري يمنح المستخدمين والزوار سرعات معالجة منخفضة اللاتنسي للغاية.",
      feat7: "معدل استقرار Uptime 99.9٪",
      feat7Desc: "عنصر تشغيل ومراقبة حيوي على مدار دقات الساعة مع ضمانات SLAs عتاد متكامل.",
      feat8: "دعم فني متخصص 24/7",
      feat8Desc: "توفر دائم لكبار خبراء السيرفرات وأنظمة التشغيل للمساعدة عبر تذاكر الدعم والواتساب والهاتف.",

      compHeading: "جدول المقارنة الفني للأداء",
      compSub: "جدول مقارنة شامل للخصائص التقنية والعتاد لتحديد الخيار الأمثل لبرمجياتك.",
      compStorage: "سعة المساحة SSD NVMe",
      compBandwidth: "ترافيك نقل البيانات شهرياً",
      compSSL: "نوع شهادة الأمان SSL",
      compEmails: "حسابات البريد المهني للموقع",
      compDatabases: "قواعد بيانات MySQL المسموحة",
      compSupport: "أولويات الدعم الفني للموقع",
      compBackups: "جدولة وأرشفة النسخ الاحتياطي",
      compUptime: "معدل استقرار الخادم المضمون",

      reviewsHeading: "ثقة مطلقة من المطورين والشركات",
      reviewsSub: "قصص نجاح وآراء كتبها عملاؤنا ممن وثقوا بنا لإطلاق وتثبيت خوادم تطبيقاتهم.",
      r1Author: "عمران شوذري",
      r1Role: "رئيس المطورين، وكالة دكا ديجيتال",
      r1Text: "اتصال BDIX مذهل بكل ما تحمله الكلمة من معنى. تفتح مواقع عملائنا وتعمل دون تفكير أو تأخير. استقرار ممتاز للخادم!",
      r2Author: "صديق الغامدي",
      r2Role: "المدير التقني، المجموعة الزراعية السعودية",
      r2Text: "الدعم الفني في ويب زون لا يعلى عليه. قمنا بنقل ومزامنة قواعد بيانات نظام إداري ضخم دون ثانية واحدة من التوقف. رائعون جداً!",
      r3Author: "مسعود زمان",
      r3Role: "مؤسس بوابات ومتجر ShopBD",
      r3Text: "اخترت الباقة ريسيلر لإدارة ما يزيد عن ٤٥ متجراً للووردبريس. لوحة WHM وعناوين الخوادم الخاصة تمنح علامتي استقرار واحترافية عالية.",

      faqHeading: "الأسئلة الشائعة والإجابات",
      faqSub: "تفاصيل متكاملة وإجابات حول نقل المواقع واستقرار الاستضافة وحجز النطاقات.",
      f1Q: "ما هي استضافة BDIX؟",
      f1A: "هي استضافة تتصل مباشرة بنقطة تبادل الإنترنت المحلية، مما يوفر استجابة فائقة السرعة تقل عن ٥ ملي ثانية للمستخدمين والزوار المحليين.",
      f2Q: "كيف يتم نقل موقعي الإلكتروني؟",
      f2A: "فريق النقل المتخصص لدينا يقوم بنقل موقعك بالكامل وملفاته والبرمجيات مجاناً وبضمان عدم توقف الموقع لثانية واحدة.",
      f3Q: "هل الاستضافة تشمل نسخاً احتياطياً؟",
      f3A: "نعم! جميع الباقات تتضمن نسخ احتياطي أسبوعي على خوادم خارجية، وتشمل خطط الأعمال حزم نسخ احتياطي يومي واستعادة فورية بضغطة زر.",
      f4Q: "هل يمكنني ترقية الباقة لاحقاً؟",
      f4A: "طبعاً! يمكنك ترقية وتوسيع موارد المعالج أو سعة الذاكرة والقرص السحابي في أي وقت وبشكل فوري وتلقائي ومن واجهة لوحتك مباشرة.",
      f5Q: "ما هي قنوات الدعم المتوفرة لديكم؟",
      f5A: "نوفر قنوات دعم هندسي متواجدة على مدار دقات الساعة تشمل نظام التذاكر البرمجية الفوري باللوحة، دعم الواتساب السريع، والاتصال المباشر.",

      needHelp: "هل تحتاج مساعدة لاختيار الخطة الأنسب؟",
      needHelpSub: "تواصل مع مستشاري الخوادم لتصميم وتهيئة بنية تحتية مخصصة تناسب حركة زوارك والبيئة البرمجية.",
      orderHosting: "اطلب الاستضافة فوراً",
    }
  };

  const currentTrans = t[language] || t.en;

  // Domain price definitions
  const domainExtensionsPrices: Record<string, number> = {
    '.com': 10.99,
    '.net': 14.99,
    '.org': 13.99,
    '.co': 19.99,
    '.com.bd': 10.25, // equivalent to BDT 1,200
    '.bd': 12.80     // equivalent to BDT 1,500
  };

  const packagesList = {
    bdix: [
      {
        id: "bdix-starter",
        name: "Starter Plan",
        nameBn: "স্টার্টার প্ল্যান",
        nameAr: "الخطة الأساسية Starter",
        price: 0.99,
        storage: "2GB NVMe SSD",
        badge: null,
        features: [
          language === 'bn' ? "১টি ওয়েবসাইট হোস্ট করার সুবিধা" : language === 'ar' ? "موقع ويب واحد مخصص" : "Host 1 Website",
          language === 'bn' ? "২ জিবি ফাস্ট এসএসডি স্টোরেজ" : language === 'ar' ? "مساحة ٢ جيجابايت فائقة NVMe" : "2GB NVMe SSD Storage",
          language === 'bn' ? "unlimited ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل بيانات وباندويث مفتوح" : "Unlimited Bandwidth",
          language === 'bn' ? "১০টি ইমেইল এড্রেস" : language === 'ar' ? "١٠ حسابات بريد مخصصة" : "10 Mailbox Accounts",
          language === 'bn' ? "৫টি মাইএসকিউএল ডাটাবেস" : language === 'ar' ? "٥ قواعد بيانات MySQL مخصصة" : "5 MySQL Databases",
          language === 'bn' ? "ফ্রি আনলিমিটেড SSL শীল্ড" : language === 'ar' ? "شهادة أمان SSL مجانية" : "Free SSL Certificates",
          language === 'bn' ? "লাইটস্পীড ওয়েব ক্যাশিং" : language === 'ar' ? "مسرعات الويب LiteSpeed" : "LiteSpeed Web Server",
          language === 'bn' ? "পেশাদার সিপ্যানেল সফটওয়্যার" : language === 'ar' ? "لوحة تحكم cPanel المتكاملة" : "cPanel Control Panels"
        ],
        perfectFor: [
          language === 'bn' ? "ব্যক্তিগত বা পোর্টফোলিও ওয়েবসাইট" : language === 'ar' ? "مناسب للمواقع الشخصية والمدونات" : "Personal Websites",
          language === 'bn' ? "পণ্য বিক্রির ল্যান্ডিং পেজ" : language === 'ar' ? "صفحات البيع والهبوط السريعة" : "Landing Pages"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/share-hosting"
      },
      {
        id: "bdix-business",
        name: "Business Plan",
        nameBn: "বিজনেস প্ল্যান",
        nameAr: "الخطة الاحترافية للشركات Business",
        price: 1.99,
        storage: "5GB NVMe SSD",
        badge: language === 'bn' ? "সবচেয়ে জনপ্রিয়" : language === 'ar' ? "الأكثر اختياراً" : "Most Popular",
        features: [
          language === 'bn' ? "৩টি ওয়েবসাইট হোস্ট করার সুবিধা" : language === 'ar' ? "استضافة حتى ٣ مواقع مستقلة" : "Host up to 3 Websites",
          language === 'bn' ? "৫ জিবি আল্ট্রা ফাস্ট স্টোরেজ" : language === 'ar' ? "مساحة ٥ جيجابايت NVMe SSD" : "5GB NVMe SSD Storage",
          language === 'bn' ? "unlimited হাই-স্পিড ব্যান্ডউইথ" : language === 'ar' ? "ترافيك وباندويث غير محدود" : "Unlimited Bandwidth",
          language === 'bn' ? "৩০টি প্রফেশনাল মেইলবক্স" : language === 'ar' ? "٣٠ بريداً إلكترونياً رسمياً" : "30 Enterprise Email Boxes",
          language === 'bn' ? "১৫টি ডাটাবেস ডাটাপয়েন্ট" : language === 'ar' ? "١٥ قاعدة بيانات مخصصة" : "15 Databases Integration",
          language === 'bn' ? "ফ্রি লাইফটাইম ওয়াইল্ডকার্ড SSL" : language === 'ar' ? "شهادات أمان Let's Encrypt مجاناً" : "Lifetime Free Wildcard SSL",
          language === 'bn' ? "লাইটস্পীড ও সিপ্যানেল" : language === 'ar' ? "تثبيت فوري بضغطة واحدة" : "LiteSpeed Caching & cPanel",
          language === 'bn' ? "ডেইলি রিমোট ক্লাউড ব্যাকআপ" : language === 'ar' ? "نسخ احتياطي يومي آمن على كلاود" : "Daily Remote Cloud Backup"
        ],
        perfectFor: [
          language === 'bn' ? "পেশাদার করপোরেট ও বিজনেস সাইট" : language === 'ar' ? "المواقع التعريفية ومواقع الشركات" : "Business Websites",
          language === 'bn' ? "মাঝারি ব্লগ ও কন্টেন্ট পাবলিশার" : language === 'ar' ? "المدونات التفاعلية ومواقع المتاجر" : "Dynamic Blogs & Corporate"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/share-hosting"
      },
      {
        id: "bdix-professional",
        name: "Professional Plan",
        nameBn: "প্রফেশনাল প্ল্যান",
        nameAr: "باقة النخبة والمتاجر Professional",
        price: 2.99,
        storage: "10GB NVMe SSD",
        badge: language === 'bn' ? "সেরা পছন্দ" : language === 'ar' ? "أفضل قيمة" : "Best Value",
        features: [
          language === 'bn' ? "১০টি ওয়েবসাইট হোস্ট সুবিধা" : language === 'ar' ? "استضافة حتى ١٠ مواقع مستقلة" : "Host up to 10 Websites",
          language === 'bn' ? "১০ জিবি সুপারস্টোরেজ NVMe" : language === 'ar' ? "أقراص تخزين ١٠ جيجابايت NVMe SSD" : "10GB Premium NVMe Storage",
          language === 'bn' ? "unlimited রিয়েলটাইম ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل ترافيك وباندويث فائق" : "Unlimited Bandwidth",
          language === 'bn' ? "unlimited মেইলবক্স অ্যাড্রেস" : language === 'ar' ? "حسابات بريد إلكتروني غير محدودة" : "Unlimited Email Accounts",
          language === 'bn' ? "unlimited মাইএসকিউএল ডাটাবেস" : language === 'ar' ? "قواعد بيانات وأدوات غير محدودة" : "Unlimited MySQL Databases",
          language === 'bn' ? "ফ্রি ওয়াইল্ডকার্ড এসএসএল সার্টিফিকেট" : language === 'ar' ? "شهادات أمان وبادلوك لكل المواقع" : "Free Wildcard SSL Access",
          language === 'bn' ? "১০০% অপ্টিমাইজড গুগল এডসেন্স" : language === 'ar' ? "باقة مهيئة لخدمات جوجل أدسنس والمتاجر" : "Google AdSense & SEO Optimized",
          language === 'bn' ? "সার্বক্ষণিক অগ্রাধিকার ভিত্তিক বিশেষ সাপোর্ট" : language === 'ar' ? "دعم فني هندسي بريميوم ذو أولوية" : "Priority 24/7 VIP Support"
        ],
        perfectFor: [
          language === 'bn' ? "পূর্ণ মাত্রার ই-কমার্স বা শপ ওয়েবসাইট" : language === 'ar' ? "المتاجر الإلكترونية المتكاملة السريعة" : "Ecommerce Gateway Stores",
          language === 'bn' ? "অধিক ভিজিটর সমৃদ্ধ নিউজ পোর্টাল" : language === 'ar' ? "بوابات الأخبار والمنصات الكبرى" : "High Traffic Portals"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/share-hosting"
      }
    ],
    vps: [
      {
        id: "vps-starter",
        name: "VPS Starter Plan",
        nameBn: "ভিপিএস স্টার্টার প্ল্যান",
        nameAr: "خادم VPS المبتدئ السحابي",
        price: 14.99,
        storage: "50GB Enterprise NVMe SSD",
        badge: null,
        features: [
          language === 'bn' ? "১ কোর ডেডিকেটেড হাই-পারফরম্যান্স প্রসেসর" : language === 'ar' ? "معالج فوري ١ Core AMD EPYC" : "1 Core Dedicated AMD EPYC",
          language === 'bn' ? "২ জিবি ডেডিকেটেড র্যাম" : language === 'ar' ? "٢ جيجابايت ذاكرة عشوائية عالية الرام" : "2GB Dedicated DDR4 RAM",
          language === 'bn' ? "৫০ জিবি এন্টারপ্রাইজ NVMe এসএসডি" : language === 'ar' ? "٥٠ جيجابايت أقراص تخزين Enterprise" : "50GB Enterprise NVMe Storage",
          language === 'bn' ? "১ টেরাবাইট হাই-রুট ব্যান্ডউইথ" : language === 'ar' ? "باندويث ترافيك كامل ١ تيرابايت شهرياً" : "1TB Monthly Safe Bandwidth",
          language === 'bn' ? "১টি ইউনিক ডেডিকেটেড আইপি অ্যাড্রেস" : language === 'ar' ? "عنوان بروتوكول معزول ١ Dedicated IP" : "1 Unique Dedicated IPv4",
          language === 'bn' ? "১০০% রুট এক্সেস এবং ওপেন কনসোল" : language === 'ar' ? "صلاحيات جذر كاملة Root Access" : "Full OS Root Administrator SSH Access",
          language === 'bn' ? "উবুন্টু/ডেবিয়ান/সেন্টওএস রিমোট ওএস" : language === 'ar' ? "توافق كامل مع أنظمة لينكس المختلفة" : "OS installation (Ubuntu, Debian, CentOS)",
          language === 'bn' ? "২৪/৭ বিশেষ ম্যানেজড সার্ভার মনিটরিং" : language === 'ar' ? "مراقبة وإدارة الخادم بالكامل" : "Managed Server Node Setup Support"
        ],
        perfectFor: [
          language === 'bn' ? "ভারী বা জটিল কাস্টম ওয়েব অ্যাপ্লিকেশন" : language === 'ar' ? "تطبيقات الويب والأنظمة البرمجية كاستم" : "Custom Web Applications",
          language === 'bn' ? "পরীক্ষামূলক সার্ভার ডেভেলপমেন্ট নোড" : language === 'ar' ? "بيئات اختبار الأكواد وتطوير النظم" : "Testing & Dev Environments"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/vps"
      },
      {
        id: "vps-business",
        name: "VPS Business Plan",
        nameBn: "ভিপিএস বিজনেস প্ল্যান",
        nameAr: "خادم الأعمال السحابية VPS العالي",
        price: 29.99,
        storage: "100GB Enterprise NVMe SSD",
        badge: language === 'bn' ? "সবচেয়ে জনপ্রিয়" : language === 'ar' ? "الأكثر اختياراً" : "Most Popular",
        features: [
          language === 'bn' ? "২ কোর শক্তিশালী ডেডিকেটেড প্রসেসর" : language === 'ar' ? "معالج فائق ٢ Cores AMD EPYC" : "2 Cores Dedicated AMD EPYC",
          language === 'bn' ? "৪ জিবি দ্রুতগতির ডেডিকেটেড র্যাম" : language === 'ar' ? "٤ جيجابايت ذاكرة عشوائية عالية RAM" : "4GB Dedicated DDR4 RAM",
          language === 'bn' ? "১০০ জিবি আল্ট্রা-স্পিড এন্টারপ্রাইজ NVMe" : language === 'ar' ? "مساحة ضخمة ١٠٠ جيجابايت NVMe" : "100GB Enterprise NVMe SSD",
          language === 'bn' ? "২ টেরাবাইট ফাস্ট মান্থলি ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل ترافيك شهري ضخم ٢ تيرابايت" : "2TB Monthly Bandwidth Scale",
          language === 'bn' ? "২টি সম্পূর্ণ ইউনিক ডেডিকেটেড আইপি" : language === 'ar' ? "عنوانين بروتوكول معزولين ٢ IPs" : "2 Dedicated IPv4 Allocations",
          language === 'bn' ? "রুট এক্সেস, ওপেন পোর্টস ও ডাটা শিল্ড" : language === 'ar' ? "صلاحيات جذر كاملة وجدران إطفاء نيم" : "Full OS Root Access & Firewall Configs",
          language === 'bn' ? "ফ্রি সাইবার প্যানেল / হেষ্টিয়া কন্ট্রোল প্যানেল" : language === 'ar' ? "تثبيت لوحات فري CyberPanel/Hestia" : "Free Web Control Panels Pre-installed",
          language === 'bn' ? "নিরাপদ ভার্চুয়ালাইজেশন KVM আর্কিটেকচার" : language === 'ar' ? "أنظمة عزل فائقة ببيئة KVM الافتراضية" : "Secure Virtualization (KVM Hypervisor)"
        ],
        perfectFor: [
          language === 'bn' ? "উচ্চ ভিজিটর সমৃদ্ধ বাণিজ্যিক স্টোর" : language === 'ar' ? "متاجر التجارة الإلكترونية عالية النشاط" : "High-Density E-commerce Stores",
          language === 'bn' ? "কর্পোরেট ইআরপি এবং সিআরএম সফটওয়্যার" : language === 'ar' ? "أنظمة إدارة الأعمال المركزية POS & CRM" : "Database & SaaS API engines"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/vps"
      },
      {
        id: "vps-professional",
        name: "VPS Pro Plan",
        nameBn: "ভিপিএস প্রো প্ল্যান",
        nameAr: "خادم المحترفين السحابي VPS Pro",
        price: 49.99,
        storage: "200GB Enterprise NVMe SSD",
        badge: language === 'bn' ? "সর্বোচ্চ ক্ষমতা" : language === 'ar' ? "الأداء الأقصى" : "Maximum Power",
        features: [
          language === 'bn' ? "৪ কোর শক্তিশালী ডেডিকেটেড প্রসেসর" : language === 'ar' ? "معالج فائق ٤ Cores AMD EPYC" : "4 Cores Dedicated AMD EPYC",
          language === 'bn' ? "৮ জিবি দ্রুতগতির ডেডিকেটেড র্যাম" : language === 'ar' ? "٨ جيجابايت ذاكرة عشوائية عالية RAM" : "8GB Dedicated DDR4 RAM",
          language === 'bn' ? "২০০ জিবি আল্ট্রা-স্পিড এন্টারপ্রাইজ NVMe" : language === 'ar' ? "مساحة ضخمة ٢٠٠ جيجابايت NVMe" : "200GB Enterprise NVMe SSD",
          language === 'bn' ? "৪ টেরাবাইট ফাস্ট মান্থলি ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل ترافيك شهري ضخم ٤ تيرابايت" : "4TB Monthly Bandwidth Scale",
          language === 'bn' ? "৩টি সম্পূর্ণ ইউনিক ডেডিকেটেড আইপি" : language === 'ar' ? "ثلاث عناوين بروتوكول معزولة ٣ IPs" : "3 Dedicated IPv4 Allocations",
          language === 'bn' ? "রুট এক্সেস, ওপেন পোর্টস ও ডাটা শিল্ড" : language === 'ar' ? "صلاحيات جذر كاملة وجدران إطفاء نيم" : "Full OS Root Access & Firewall Configs",
          language === 'bn' ? "ফ্রি সাইপার প্যানেল বা সিপ্যানেল সফটওয়্যার" : language === 'ar' ? "لوحات حرة مع إمكانية تثبيت لوحة تحكم" : "Free Web Control Panels Pre-installed",
          language === 'bn' ? "নিরাপদ ভার্চুয়ালাইজেশন KVM আর্কিটেকচার" : language === 'ar' ? "أنظمة عزل فائقة ببيئة KVM الافتراضية" : "Secure Virtualization (KVM Hypervisor)"
        ],
        perfectFor: [
          language === 'bn' ? "বৃহৎ নিউজ পোর্টাল এবং মিডিয়া সাইট" : language === 'ar' ? "بوابات الأخبار الكبرى والشبكات التفاعلية" : "High Traffic Portals & Network Hubs",
          language === 'bn' ? "হাই-ডিমান্ড কাস্টম SaaS ব্যাকএন্ড ইঞ্জিন" : language === 'ar' ? "محركات الأكواد ومواقع الخدمات البرمجية SaaS" : "SaaS Applications & heavy SQL engines"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/vps"
      }
    ],
    reseller: [
      {
        id: "reseller-10g",
        name: "Reseller 10GB",
        nameBn: "রিসেলার ১০ জিবি প্ল্যান",
        nameAr: "موزع المبتدئين الروتيني 10GB",
        price: 11.99,
        storage: "10GB NVMe SSD",
        badge: null,
        features: [
          language === 'bn' ? "১০ জিবি সুপারস্টোরেজ NVMe ড্রাইভ" : language === 'ar' ? "مساحة ١٠ جيجابايت NVMe SSD للأداء" : "10GB Pure NVMe SSD Storage",
          language === 'bn' ? "১০টি সম্পূর্ণ পৃথক সিপ্যানেল একাউন্ট তৈরি" : language === 'ar' ? "إنشاء وإدارة ١٠ حسابات cPanel مخصصة" : "Host up to 10 WHM/cPanel Accounts",
          language === 'bn' ? "১০০% নিজস্ব ব্র্যান্ডিং (হোয়াইট-লেবেল)" : language === 'ar' ? "هوية مخصصة بيضاء بالكامل White-Label" : "100% White-Label (Custom Name Servers)",
          language === 'bn' ? "ফাইল স্থানান্তরের জন্য আনলিমিটেড ব্যান্ডউইথ" : language === 'ar' ? "باندويث ترافيك مرن غير محدود" : "Unlimited Monthly Bandwidth",
          language === 'bn' ? "ফ্রি আনলিমিটেড এসএসএল সব ডোমেনে" : language === 'ar' ? "شهادات أمان مجانية لجميع عملائك بموقعك" : "Free SSL Certificates for Users",
          language === 'bn' ? "ডাইনামিক ডব্লিউএইচএম (WHM) এডমিন কন্ট্রোল" : language === 'ar' ? "لوحة تحكم إدارية مركزية WHM للموزع" : "Full Access to WHM Reseller Admin Panel",
          language === 'bn' ? "১-ক্লিক সফটাকুলাস স্ক্রিপ্ট ইন্সটলার" : language === 'ar' ? "تثبيت وتركيب فوري ومبسط للأكواد" : "Softaculous installer for clients",
          language === 'bn' ? "রিয়েলটাইম ইমিউনিফাই৩৬০ ফায়ারওয়াল" : language === 'ar' ? "حماية مضادة للمالوير والهاكينج Imunify360" : "Enterprise Malware Shield Isolation"
        ],
        perfectFor: [
          language === 'bn' ? "ক্ষুদ্র ওয়েব এজেন্সি বা আইটি প্রতিষ্ঠান" : language === 'ar' ? "وكالات الويب الصغيرة والاستوديوهات الرقمية" : "Aspiring Web Hosting Brands",
          language === 'bn' ? "অল্প কিছু ক্লায়েন্ট সাইট নিরাপদ রাখার কাজে" : language === 'ar' ? "المصممين الراغبين بإدارة مواقع عملائهم مكعب" : "Custom Multi-site Hubs"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/reseller-hosting"
      },
      {
        id: "reseller-20g",
        name: "Reseller 20GB",
        nameBn: "রিসেলার ২০ জিবি প্ল্যান",
        nameAr: "موزع الاستضافة المتقدم 20GB",
        price: 19.99,
        storage: "20GB NVMe SSD",
        badge: language === 'bn' ? "সবচেয়ে জনপ্রিয়" : language === 'ar' ? "الأكثر اختياراً" : "Most Popular",
        features: [
          language === 'bn' ? "২০ জিবি সুপারস্টোরেজ NVMe ড্রাইভ" : language === 'ar' ? "مساحة ٢٠ جيجابايت NVMe SSD سريعة" : "20GB Pure NVMe SSD Storage",
          language === 'bn' ? "২০টি সম্পূর্ণ পৃথক সিপ্যানেল একাউন্ট" : language === 'ar' ? "صلاحية إنشاء ٢٠ حساب cPanel منفصل" : "Host up to 20 WHM/cPanel Accounts",
          language === 'bn' ? "হোয়াইট-লেবেল (WHM ও কাস্টম নেমসার্ভার)" : language === 'ar' ? "نيم سيرفرات وهامش تحكّم باسم شركتك" : "100% White-Label with Custom Name Servers",
          language === 'bn' ? " can ব্যান্ডউইথ পুল" : language === 'ar' ? "سِعات ترافيك غير محدودة طوال الشهر" : "Unlimited Monthly Bandwidth Pool",
          language === 'bn' ? "কাস্টমারদের জন্য ফ্রি লাইটস্পীড ক্যাশ" : language === 'ar' ? "مسرعات أداء لايت سبيد لعملاء خطتك" : "Free LiteSpeed Web Cache integration",
          language === 'bn' ? "সম্পূর্ণ ই-মেইল এবং ডাটাবেস স্বাধীনতা" : language === 'ar' ? "حسابات بريد مهنية غير محدودة لأعمالك" : "Unlimited Databases & Email pools",
          language === 'bn' ? "২টি পৃথক অফসাইট ব্যাকআপ নোড" : language === 'ar' ? "نسخ احتياطي مركزي دوري للعملاء والموزع" : "Automated off-site backup safeguards",
          language === 'bn' ? "রিয়েলটাইম ইমিউনিফাই৩৬০ ফায়ারওয়াল" : language === 'ar' ? "حماية كبرى ضد ثغرات وحقن البيانات" : "Imunify360 Live Firewall isolation"
        ],
        perfectFor: [
          language === 'bn' ? "মাঝারি আইটি কনসালটেন্সি ও এজেন্সি" : language === 'ar' ? "شركات الخدمات البرمجية والتسويق المتوسطة" : "Growing IT & Web Solutions Teams",
          language === 'bn' ? "পেশাদার ফ্রিল্যান্সার বা ওয়েব ডেভেলপার" : language === 'ar' ? "المطورين والفرلانسرز ذوي المحافظ الكبيرة" : "Modern Freelancers & Agencies"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/reseller-hosting"
      },
      {
        id: "reseller-50g",
        name: "Reseller 50GB",
        nameBn: "রিসেলার ৫০ জিবি প্ল্যান",
        nameAr: "باقة موزع النخبة الضخم 50GB",
        price: 39.99,
        storage: "50GB NVMe SSD",
        badge: language === 'bn' ? "সেরা পছন্দ" : language === 'ar' ? "أفضل قيمة" : "Best Value",
        features: [
          language === 'bn' ? "৫০ জিবি এন্টারপ্রাইজ NVMe স্টোরেজ" : language === 'ar' ? "سعة هائلة ٥٠ جيجابايت NVMe SSD مطورة" : "50GB Enterprise NVMe SSD Storage",
          language === 'bn' ? "৫০টি স্বাধীন সিপ্যানেল একাউন্ট" : language === 'ar' ? "إمكانية إنشاء وإدارة ٥٠ حساب cPanel مستقل" : "Host up to 50 WHM/cPanel Accounts",
          language === 'bn' ? "কাস্টম নেমসার্ভার ও হোয়াইট লেবেল" : language === 'ar' ? "نيم سيرفرات مخصصة تامة بدون شعارنا" : "100% White-Label with Dedicated Controls",
          language === 'bn' ? "প্রিমিয়াম হাই-স্পিড ব্যান্ডউইথ পুল" : language === 'ar' ? "باقات ترافيك غير محدودة وفائقة الضخامة" : "Uncapped Monthly Bandwidth Capacity",
          language === 'bn' ? "ক্লায়েন্টদের ফ্রি রিলেভেন্ট কুপন স্কিমস" : language === 'ar' ? "لوحة WHM مركزية مع مزايا الشركاء" : "WHM Core administration with reseller benefits",
          language === 'bn' ? "আনলিমিটেড ডাটাবেস ও ইমেইল" : language === 'ar' ? "أنظمة بريد آمنة ومسرعات تصفح لعملائك" : "Unlimited Mailboxes, Databases & Subdomains",
          language === 'bn' ? "উচ্চতর ক্ষমতার এন্টারপ্রাইজ ডাটা শিল্ড" : language === 'ar' ? "حماية كبرى ضد ثغرات SQL ومكافحة مخرجات DDoS" : "Active DDoS mitigation & Malware filtering pool",
          language === 'bn' ? "২৪/৭ সরাসরি হোয়াটসঅ্যাপ ও সার্ভার রুট সাপোর্ট" : language === 'ar' ? "دعم أولوي مباشر لكادر مهندسي السيرفرات لدينا" : "VIP Server Route Management Support"
        ],
        perfectFor: [
          language === 'bn' ? "প্রতিষ্ঠিত কাস্টম সফটওয়্যার কোম্পানি" : language === 'ar' ? "شركات البرمجة الرائدة لتوزيع الخطط لمشاريعها" : "Full-Scale Software & IT Companies",
          language === 'bn' ? "বৃহৎ ফ্রিল্যান্সিং টিম বা ডেভেলপমেন্ট গুরু" : language === 'ar' ? "المشروعات الناشئة بتبسيط كلي للتكاليف تامة" : "Professional Hosting Resellers"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/reseller-hosting"
      }
    ]
  };

  const handleSupportInquiry = (msgType: 'sales' | 'whatsapp') => {
    const defaultMsg = language === 'bn' 
      ? 'আসসালামু আলাইকুম WebzoneBD, আমি আপনাদের কাস্টম হোস্টিং সার্ভিস সম্পর্কে জানতে এবং পরামর্শ নিতে আগ্রহী।' 
      : language === 'ar' 
      ? 'السلام عليكم ويب زون، أود الحصول على مشورة بخصوص خطط الاستضافة المخصصة لمشروعي.' 
      : 'Hello WebzoneBD, I need a custom recommendation choosing the right hosting plan for my business application.';
    
    if (msgType === 'sales') {
      window.open(`https://host.webzonebd.com/contact.php?text=${encodeURIComponent(defaultMsg)}`, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://wa.me/966570511931?text=${encodeURIComponent(defaultMsg)}`, '_blank', 'noopener,noreferrer');
    }
  };

   const handleExternalNav = (url: string) => {
    const divider = url.includes('?') ? '&' : '?';
    const finalUrl = `${url}${divider}currency=${currency}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  // Perform a simulated domain lookup inside Hosting page
  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanVal = domainQuery.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!cleanVal) return;

    setIsSearching(true);
    setHasSearched(false);

    setTimeout(() => {
      let domainName = cleanVal;
      let extensionUsed = selectedExt;

      const extMatch = cleanVal.match(/(\.[a-z]{2,3}(\.[a-z]{2})?)$/);
      if (extMatch) {
         extensionUsed = extMatch[1];
         domainName = cleanVal.substring(0, cleanVal.length - extensionUsed.length);
      }

      if (domainName.replace(/[^a-z0-9-]/g, '') === '') {
        setIsSearching(false);
        return;
      }

      setSearchedName(`${domainName}${extensionUsed}`);

      const takenDomainsList = [
        'google', 'facebook', 'youtube', 'github', 'microsoft', 'netflix', 'amazon', 
        'webzone', 'webzonebd', 'saudi', 'it', 'solution', 'hosting', 'bd'
      ];

      const isTaken = takenDomainsList.includes(domainName) || domainName.length < 3;
      const isPremium = domainName.length <= 4 && !isTaken;

      const baseExtPrice = domainExtensionsPrices[extensionUsed] || 11.99;
      const finalPrice = isPremium ? baseExtPrice * 8.5 : baseExtPrice;

      setDomainResult({
        domain: `${domainName}${extensionUsed}`,
        isAvailable: !isTaken,
        isPremium,
        priceUSD: finalPrice
      });

      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  // Add search domain directly to cart
  const handleRegisterDomainItem = (domain: string, priceUSD: number) => {
    if (!addToCart) return;

    const virtualProduct: Product = {
      id: `domain-registration-${domain.replace(/\./g, '-')}-${Date.now()}`,
      name: `Domain: ${domain} (1 Year Registration)`,
      nameBn: `ডোমেন: ${domain} (১ বছরের রেজিস্ট্রেশন)`,
      nameAr: `النطاق: ${domain} (حجز لمدة سنة واحدة)`,
      category: 'source',
      price: Math.round(priceUSD),
      discountPrice: Math.round(priceUSD),
      rating: 5.0,
      reviewsCount: 1,
      description: `Domain name registration for ${domain} featuring premium secure DNS protection and WHOIS Privacy control.`,
      descriptionBn: `${domain} ডোমেন ক্রয়ের জন্য প্রিমিয়াম সিকিউর ডিএনএস কন্ট্রোল ও হু-ইজ প্রাইভেসি সেবা।`,
      descriptionAr: `تأمين تسجيل نطاق ${domain} شامل لوحة تحكم كاملة بالنطاق والـ DNS وحماية الخصوصية المطلقة.`,
      features: [
        "Instant DNS Propagation",
        "Free WHOIS privacy shielding",
        "2 DNSSEC signatures included",
        "No hidden setup charges"
      ],
      featuresBn: [
        "তাত্ক্ষণিক ডিএনএস অ্যাক্টিভেশন",
        "সম্পূর্ণ ফ্রি হু-ইজ প্রাইভেসি শিল্ড",
        "২ টি ডিএনএস-এসইসি সিকিউরিটি",
        "কোন গোপন চার্জ নেই"
      ],
      featuresAr: [
        "بث فوري كامل للـ DNS وسجلات الخادم",
        "إخفاء هوية وبيانات مالك النطاق مجاناً",
        "تأمين خوادم النطاق بخاصية DNSSEC",
        "لا توجد رسوم خفية أو مصاريف إضافية"
      ],
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
      demoUrl: "#",
      downloadUrl: "#",
      tags: ["Domain", "Registry"],
      views: 12
    };

    addToCart(virtualProduct);
    setAddedItems(prev => ({ ...prev, [domain]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [domain]: false }));
    }, 3000);
  };

  // Scroll to comparison structure
  const handleScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className="bg-[#F8FAFC] dark:bg-[#020617] text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300 font-sans overflow-hidden" 
      dir={isRtl ? 'rtl' : 'ltr'}
      id="redesigned-hosting-site-page"
    >
      
      {/* ================================= HERO SECTION ================================= */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-[#E0F2FE]/50 via-white to-[#F8FAFC] dark:from-[#0B1528] dark:via-[#020617] dark:to-[#020617]">
        {/* Animated Background Gradients & Floating shapes */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-550/20 blur-[100px] pointer-events-none animate-pulse duration-[8s]" />
        <div className="absolute bottom-1/5 right-1/12 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/20 blur-[110px] pointer-events-none animate-pulse duration-[10s]" />
        
        {/* Floating geometric particles */}
        <div className="absolute top-20 right-1/4 w-4 h-4 rounded-full bg-blue-500/30 dark:bg-cyan-500/30 animate-bounce duration-[4s]" />
        <div className="absolute bottom-24 left-1/5 w-6 h-6 rounded-md bg-purple-500/20 dark:bg-purple-500/30 rotate-45 animate-spin duration-[12s]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-[#0EA5E9] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-cyan-400 font-mono">
              WebzoneBD IT Solutions Node-Uptime SLA Guarantee
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] bg-clip-text text-transparent">
              {currentTrans.heroTitle}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            {currentTrans.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <button
              onClick={() => handleScrollToId('redesigned-categories')}
              className="px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1D4ED8] hover:to-[#7C3AED] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] cursor-pointer flex items-center gap-2 ring-2 ring-white/10"
            >
              <Zap className="w-4 h-4 fill-current text-white animate-pulse" />
              <span>{currentTrans.getStarted}</span>
            </button>
            
            <button
              onClick={() => handleScrollToId('redesigned-comparison-table')}
              className="px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 font-extrabold text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-purple-500" />
              <span>{currentTrans.comparePlans}</span>
            </button>

            <button
              onClick={() => handleSupportInquiry('whatsapp')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>{currentTrans.whatsappSupport}</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* ================================= DOMAIN SEARCH SECTION ================================= */}
      <section className="relative -mt-16 md:-mt-24 mb-20 max-w-5xl mx-auto px-4 z-20">
        <div className="bg-white/80 dark:bg-[#0F172A]/85 backdrop-blur-3xl p-6 md:p-8 rounded-[32px] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl shadow-slate-900/10">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2 font-display">
              <Globe className="w-5 h-5 text-emerald-500 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="bg-gradient-to-r from-[#10B981] to-[#06B6D4] bg-clip-text text-transparent">
                {currentTrans.domainTitle}
              </span>
            </h3>
            
            {/* Quick Actions row */}
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              <button 
                onClick={() => setDomainQuery('mybusiness')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 underline decoration-dotted"
              >
                ✓ {currentTrans.registerDomain}
              </button>
              <span className="text-slate-300 dark:text-slate-700 select-none">|</span>
              <button 
                onClick={() => handleSupportInquiry('sales')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 underline decoration-dotted"
              >
                ✓ {currentTrans.transferDomain}
              </button>
              <span className="text-slate-300 dark:text-slate-700 select-none">|</span>
              <button 
                onClick={() => handleScrollToId('redesigned-comparison-table')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 underline decoration-dotted font-bold"
              >
                ★ {currentTrans.viewPricing}
              </button>
            </div>
          </div>

          <form onSubmit={handleCheckAvailability} className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1 flex items-center bg-slate-100 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 focus-within:border-cyan-500/50 transition">
              <Search className="text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={currentTrans.domainPlaceholder}
                value={domainQuery}
                onChange={(e) => setDomainQuery(e.target.value)}
                className="w-full bg-transparent pl-3 pr-2 py-4 text-slate-900 dark:text-white placeholder-slate-500 text-sm focus:outline-none"
              />
              
              {/* Quick extensions dropdown directly in search bar */}
              <select
                value={selectedExt}
                onChange={(e) => setSelectedExt(e.target.value)}
                className="bg-transparent text-xs font-bold text-blue-600 dark:text-cyan-400 cursor-pointer pr-2 pl-2 focus:outline-none uppercase border-l border-slate-200 dark:border-slate-850"
              >
                {Object.keys(domainExtensionsPrices).map((ext) => (
                  <option key={ext} value={ext} className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white font-sans text-xs">
                    {ext}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSearching || !domainQuery.trim()}
              className="px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#06B6D4] hover:from-[#059669] hover:to-[#0891B2] disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-2xl transition duration-300 shrink-0 shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01]"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-white fill-white" />}
              <span>{isSearching ? "..." : (language === 'bn' ? 'অনুসন্ধান' : language === 'ar' ? 'البحث الفوري' : 'Check Availability')}</span>
            </button>
          </form>

          {/* Quick Extensions cards/caps */}
          <div className="flex flex-wrap gap-2.5 justify-center items-center mt-5">
            {Object.keys(domainExtensionsPrices).map((ext) => (
              <button
                key={ext}
                type="button"
                onClick={() => {
                  setSelectedExt(ext);
                  if (domainQuery.trim()) {
                    setDomainQuery(prev => {
                      const splitDot = prev.indexOf('.');
                      const name = splitDot !== -1 ? prev.substring(0, splitDot) : prev;
                      return `${name}${ext}`;
                    });
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition border cursor-pointer ${
                  selectedExt === ext 
                    ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{ext}</span>
                <span className="text-[10px] text-slate-400 font-mono ml-1">
                  ({ext === '.com.bd' ? (language === 'bn' ? '৳১২০০' : '$10.25') : (ext === '.bd' ? (language === 'bn' ? '৳১৫০০' : '$12.80') : `$${domainExtensionsPrices[ext]}`)})
                </span>
              </button>
            ))}
          </div>

          {/* Result visual state */}
          <AnimatePresence>
            {hasSearched && domainResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#020617]/50 border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono tracking-tight text-slate-900 dark:text-white">{domainResult.domain}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      domainResult.isAvailable 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
                    }`}>
                      {domainResult.isAvailable ? currentTrans.available : currentTrans.taken}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {domainResult.isAvailable 
                      ? "This domain name is safe and unreserved. Secure it instantly to build your direct business!" 
                      : "Oops! This domain configuration is already owned. Search for alternative domain prefixes/suffixes above."
                    }
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200/50 dark:border-slate-800">
                  {domainResult.isAvailable && (
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-500 block leading-tight">
                        {(() => {
                          let baseBDT = domainResult.priceUSD * 118.5; 
                          if (domainResult.domain.endsWith('.com.bd')) {
                            baseBDT = 1200;
                          } else if (domainResult.domain.endsWith('.bd')) {
                            baseBDT = 1500;
                          } else if (domainResult.domain.endsWith('.com')) {
                            baseBDT = 1400;
                          }
                          const r = currencySettings?.rates || { USD: 1.0, BDT: 118.5, SAR: 3.75 };
                          const targetRate = r[currency] ?? 1.0;
                          const bdtRate = r.BDT ?? 118.5;
                          const dynamicVal = (baseBDT / bdtRate) * targetRate;
                          return formatPriceVal(dynamicVal);
                        })()}
                      </span>
                      <span className="text-[10px] text-slate-400 block tracking-wider font-mono">/ {language === 'bn' ? 'বছর' : language === 'ar' ? 'سنة' : 'year'}</span>
                    </div>
                  )}

                  {domainResult.isAvailable ? (
                    <button
                      onClick={() => handleRegisterDomainItem(domainResult.domain, domainResult.priceUSD)}
                      className={`px-5 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                        addedItems[domainResult.domain] 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-[#2563EB] hover:bg-blue-600 text-white'
                      }`}
                    >
                      {addedItems[domainResult.domain] ? "✓ Added!" : "Add to Cart"}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleSupportInquiry('sales')}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      WHOIS Inquiry
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ================================= HOSTING CATEGORIES ================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="redesigned-categories">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            {currentTrans.categoriesHeading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {currentTrans.categoriesSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 'bdix',
              title: currentTrans.sharedTitle,
              desc: currentTrans.sharedDesc,
              price: 0.99,
              icon: Database,
              color: 'from-sky-400 to-blue-600',
              accent: 'border-blue-500/20 shadow-blue-500/10'
            },
            {
              id: 'vps',
              title: currentTrans.vpsTitle,
              desc: currentTrans.vpsDesc,
              price: 14.99,
              icon: Cpu,
              color: 'from-[#2563EB] to-[#8B5CF6]',
              accent: 'border-purple-500/20 shadow-purple-500/10'
            },
            {
              id: 'reseller',
              title: currentTrans.resellerTitle,
              desc: currentTrans.resellerDesc,
              price: 11.99,
              icon: Layers,
              color: 'from-emerald-400 to-cyan-500',
              accent: 'border-emerald-500/20 shadow-emerald-500/10'
            }
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  selectTab(cat.id as any);
                  handleScrollToId('redesigned-packages');
                }}
                className={`p-8 bg-white dark:bg-[#0F172A] rounded-3xl border transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? `border-blue-500 dark:border-cyan-400 shadow-2xl ${cat.accent}` 
                    : 'border-slate-200/50 dark:border-slate-800/40 shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 shadow-slate-950/5'
                }`}
              >
                {/* Visual glow accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-10 blur-xl pointer-events-none group-hover:opacity-30 transition`} />
                
                <div className={`p-4 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center w-14 h-14 shadow-lg mb-6`}>
                  <Icon className="w-7 h-7 stroke-[2]" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 font-display">
                  {cat.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {cat.desc}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <span className="text-xxs sm:text-xs text-slate-400 uppercase font-mono block leading-none mb-1">
                      {currentTrans.from}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {(() => {
                        const baseVal = cat.id === 'bdix' 
                          ? getMonthlyPrice('bdix-starter') 
                          : cat.id === 'vps' 
                          ? getMonthlyPrice('vps-starter') 
                          : getMonthlyPrice('reseller-10g');
                        return formatPriceVal(baseVal);
                      })()}
                    </span>
                    <span className="text-xxs text-slate-510 dark:text-slate-400 font-bold ml-1">
                      {formatPeriod()}
                    </span>
                  </div>

                  <button className="px-4 py-2 rounded-xl text-xxs font-black text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] shadow transition duration-300 inline-flex items-center gap-1">
                    <span>{currentTrans.explorePlans}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================= HOSTING PACKAGES ================================= */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/20 border-y border-slate-200/30 dark:border-slate-900/40" id="redesigned-packages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black font-mono bg-blue-500/10 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-400 uppercase tracking-widest mb-3">
              <Server className="w-3 h-3 fill-current" />
              <span>Premium Hosting Node Server Tiers</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              {currentTrans.packagesHeading}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-300">
              {currentTrans.packagesSub}
            </p>
          </div>

          {/* Tab Selector & Billing Period switches */}
          <div className="flex flex-col items-center gap-6 mb-16 select-none">
            
            <div className="p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-center gap-1 shadow-md">
              {[
                { id: 'bdix', label: language === 'bn' ? 'বিডিআইএক্স হোস্টিং' : language === 'ar' ? 'استضافة BDIX' : 'Shared BDIX' },
                { id: 'vps', label: language === 'bn' ? 'ভিপিএস সার্ভার' : language === 'ar' ? 'خوادم VPS' : 'VPS Hosting' },
                { id: 'reseller', label: language === 'bn' ? 'রিসেলার হোস্টিং' : language === 'ar' ? 'استضافة الموزعين' : 'Reseller Hosting' },
              ].map((categoryTab) => (
                <button
                  key={categoryTab.id}
                  onClick={() => selectTab(categoryTab.id as any)}
                  className={`px-4 py-2 font-black text-xs rounded-xl cursor-pointer transition ${
                    activeTab === categoryTab.id 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  {categoryTab.label}
                </button>
              ))}
            </div>

            {/* Billing toggler with 20% discount reminder */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'monthly' 
                    ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white font-extrabold' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                  billingCycle === 'monthly' ? 'border-blue-650 bg-blue-650' : 'border-slate-400'
                }`}>
                  {billingCycle === 'monthly' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span>{currentTrans.monthly}</span>
              </button>

              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
                  billingCycle === 'yearly' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-extrabold shadow' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                  billingCycle === 'yearly' ? 'border-white bg-white' : 'border-slate-400'
                }`}>
                  {billingCycle === 'yearly' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </span>
                <span>{currentTrans.save20}</span>
                
                {/* Bubble badge */}
                <span className="absolute -top-3 -right-3 bg-red-500 text-white font-mono font-black text-[8px] px-1.5 py-0.5 rounded-full animate-bounce">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Cards dynamic listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch max-w-6xl mx-auto">
            {packagesList[activeTab].map((pkg) => {
              const basePrice = getMonthlyPrice(pkg.id);
              const originalYearly = basePrice * 12;
              const discountedYearly = originalYearly * 0.8;
              const savingsAmount = originalYearly * 0.2;
              const discountedMonthly = basePrice * 0.8;

              const displayPrice = billingCycle === 'yearly' ? discountedMonthly : basePrice;

              return (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A] border transition-all duration-300 transform hover:-translate-y-2 ${
                    pkg.badge 
                      ? 'border-blue-500 dark:border-cyan-400 shadow-2xl ring-2 ring-blue-500/20' 
                      : 'border-slate-200/50 dark:border-slate-800 shadow-md shadow-slate-900/5'
                  }`}
                >
                  {/* Floating Badge */}
                  {pkg.badge && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-mono font-black text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow animate-pulse">
                      {pkg.badge}
                    </span>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] text-white flex items-center justify-center shadow-lg">
                        {activeTab === 'bdix' ? <Database className="w-5 h-5" /> : activeTab === 'vps' ? <Cpu className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                          {language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name}
                        </h3>
                        <span className="inline-block text-[10px] font-mono uppercase bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 px-2.5 py-0.5 rounded-md font-bold mt-1">
                          {pkg.storage}
                        </span>
                      </div>
                    </div>

                    {/* Pricing view */}
                    <div className="py-4 border-y border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] dark:text-cyan-400">
                          {formatPriceVal(displayPrice)}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {formatPeriod()}
                        </span>
                      </div>

                      {/* Display equivalent prices in other supported currencies */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-[10.5px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40 font-mono">
                        <span className="font-sans font-medium text-slate-400 text-[10px] uppercase tracking-wider">or:</span>
                        {currency !== 'BDT' && (
                          <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
                            🇧🇩 ৳{Math.round(((bdtPrices[pkg.id] || 100) * (billingCycle === 'yearly' ? 0.8 : 1.0)))}
                          </span>
                        )}
                        {currency !== 'BDT' && currency !== 'SAR' && <span className="text-slate-350 dark:text-slate-700">|</span>}
                        {currency !== 'SAR' && (
                          <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
                            🇸🇦 ﷼{(((bdtPrices[pkg.id] || 100) * (billingCycle === 'yearly' ? 0.8 : 1.0)) / (currencySettings?.rates?.BDT ?? 118.5) * (currencySettings?.rates?.SAR ?? 3.75)).toFixed(2)}
                          </span>
                        )}
                        {currency !== 'USD' && (currency === 'BDT' || currency === 'SAR') && <span className="text-slate-350 dark:text-slate-700">|</span>}
                        {currency !== 'USD' && (
                          <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
                            🇺🇸 ${(((bdtPrices[pkg.id] || 100) * (billingCycle === 'yearly' ? 0.8 : 1.0)) / (currencySettings?.rates?.BDT ?? 118.5) * 1.0).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {billingCycle === 'yearly' ? (
                        <div className="mt-3.5 space-y-1 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10 font-mono text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 text-left">
                          <div className="flex justify-between items-center">
                            <span>{currentTrans.originalYearly}</span>
                            <span className="line-through">{formatPriceVal(originalYearly)}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold text-[#10B981]">
                            <span>{currentTrans.discountedYearly}</span>
                            <span>{formatPriceVal(discountedYearly)}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">
                            <span>{currentTrans.totalSavings}</span>
                            <span>{formatPriceVal(savingsAmount)}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-bold mt-2 font-mono">
                          ⚡ Save up to 20% on yearly plans. Billed {formatPriceVal(originalYearly)} annually.
                        </p>
                      )}
                    </div>

                    {/* VPS Performance Chart integration */}
                    {activeTab === 'vps' && (
                      <VpsPerformanceChart />
                    )}

                    {/* Perfect for bullet points */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-xl text-left border border-slate-200/40 dark:border-slate-800/50">
                      <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                        {currentTrans.perfectFor}
                      </span>
                      <ul className="space-y-1">
                        {pkg.perfectFor.map((p, idx) => (
                          <li key={idx} className="text-[11px] font-bold text-slate-650 dark:text-slate-350 leading-snug flex items-start gap-1">
                            <span className="text-emerald-500">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Core Features bullets */}
                    <div className="space-y-2 text-left">
                      {pkg.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Pricing action CTAs */}
                  <div className="mt-8 space-y-2.5">
                    <button
                      onClick={() => handleExternalNav(pkg.url)}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.01]"
                    >
                      <span>{currentTrans.orderButton}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSupportInquiry('sales')}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 text-[11px] font-extrabold rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3 text-blue-500" />
                      <span>{currentTrans.contactSales}</span>
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================================= HOSTING FEATURES SECTION ================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-black bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400 uppercase tracking-widest mb-3">
            ✓ WebzoneBD Standard Features
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            {currentTrans.featsTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentTrans.featsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: currentTrans.feat1, desc: currentTrans.feat1Desc, icon: Zap, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
            { title: currentTrans.feat2, desc: currentTrans.feat2Desc, icon: Lock, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
            { title: currentTrans.feat3, desc: currentTrans.feat3Desc, icon: HardDrive, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
            { title: currentTrans.feat4, desc: currentTrans.feat4Desc, icon: Database, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
            { title: currentTrans.feat5, desc: currentTrans.feat5Desc, icon: Server, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
            { title: currentTrans.feat6, desc: currentTrans.feat6Desc, icon: Activity, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
            { title: currentTrans.feat7, desc: currentTrans.feat7Desc, icon: Shield, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
            { title: currentTrans.feat8, desc: currentTrans.feat8Desc, icon: Phone, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition duration-300 text-left"
              >
                <div className={`p-3 rounded-xl ${item.color} border inline-block mb-4`}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 font-display">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================= PACKAGE COMPARISON TABLE ================================= */}
      <section className="py-24 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950/20 dark:via-slate-900/10 dark:to-slate-950/30 border-y border-slate-200/50 dark:border-slate-900" id="redesigned-comparison-table">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-600 dark:text-indigo-400 font-extrabold mb-4 uppercase tracking-widest font-mono"
            >
              <Award className="w-3.5 h-3.5 animate-pulse" />
              {language === 'bn' ? 'ফিচার মেট্রিক্স' : language === 'ar' ? 'مقارنة الخصائص' : 'Spec Matrix'}
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4 font-display">
              {currentTrans.compHeading}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              {currentTrans.compSub}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xl">
            {/* Ambient glowing shapes behind the comparison table to make it premium */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="overflow-x-auto">
              <table className="w-full text-start font-sans border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-7 px-6 bg-slate-50/50 dark:bg-slate-900/20 text-start text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                      {language === 'bn' ? 'ফিচার বা কারিগরি স্পেক' : language === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
                    </td>
                    
                    {/* Starter Header Card */}
                    <td className="py-7 px-6 min-w-[200px] text-center border-l border-slate-100 dark:border-slate-800/60">
                      <div className="relative rounded-2xl p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                          <Server className="w-12 h-12" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">
                          {activeTab === 'bdix' ? (language === 'bn' ? 'বেসিক প্ল্যান' : language === 'ar' ? 'البداية الاقتصادية' : 'Entry Tier') : activeTab === 'vps' ? (language === 'bn' ? 'ভার্চুয়াল নোড' : 'Cloud Server') : (language === 'bn' ? 'রিসেলার ১' : 'Reseller Basic')}
                        </span>
                        <h4 className="text-lg font-black tracking-tight">
                          {(() => {
                            const pkg = packagesList[activeTab][0];
                            return language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name;
                          })()}
                        </h4>
                      </div>
                    </td>

                    {/* Business Header Card */}
                    <td className="py-7 px-6 min-w-[220px] text-center border-l border-slate-100 dark:border-slate-800/60 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-black text-white uppercase tracking-widest shadow-md flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : language === 'ar' ? 'الأكثر اختياراً' : 'Most Popular'}
                      </div>
                      <div className="relative rounded-2xl p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl overflow-hidden group border border-indigo-400/40">
                        <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:scale-125 transition-transform duration-500">
                          <Cpu className="w-12 h-12" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">
                          {language === 'bn' ? 'সেরা ভ্যালু' : language === 'ar' ? 'القيمة الأفضل' : 'Best Value'}
                        </span>
                        <h4 className="text-lg font-black tracking-tight">
                          {(() => {
                            const pkg = packagesList[activeTab][1];
                            return language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name;
                          })()}
                        </h4>
                      </div>
                    </td>

                    {/* Professional Header Card */}
                    <td className="py-7 px-6 min-w-[200px] text-center border-l border-slate-100 dark:border-slate-800/60 font-sans">
                      <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#06B6D4] to-[#10B981] text-white shadow-lg overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                          <Award className="w-12 h-12" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">
                          {language === 'bn' ? 'সবচেয়ে শক্তিশালী' : language === 'ar' ? 'الأداة الأقوى' : 'Maximum Power'}
                        </span>
                        <h4 className="text-lg font-black tracking-tight">
                          {(() => {
                            const pkg = packagesList[activeTab][2];
                            return language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name;
                          })()}
                        </h4>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  
                  {/* Dynamic Price Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group bg-emerald-500/5">
                    <td className="py-5 px-6 font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-650 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-250">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-black text-slate-900 dark:text-white">{language === 'bn' ? 'স্ট্যান্ডার্ড প্রাইসিং' : language === 'ar' ? 'السعر العادل' : 'Active Plan Price'}</span>
                        <span className="block text-[8.5px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{language === 'bn' ? 'স্বয়ংক্রিয় রূপান্তর' : language === 'ar' ? 'تحويل تلقائي' : 'Auto Real-time Rate'}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-100 dark:border-slate-800/40 text-emerald-600 dark:text-emerald-450 font-extrabold font-mono text-base">
                      {formatPriceVal(getMonthlyPrice(packagesList[activeTab][0].id))}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-100 dark:border-slate-800/40 text-emerald-600 dark:text-emerald-450 font-extrabold font-mono text-base bg-indigo-50/30 dark:bg-indigo-950/30">
                      {formatPriceVal(getMonthlyPrice(packagesList[activeTab][1].id))}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-100 dark:border-slate-800/40 text-emerald-600 dark:text-emerald-450 font-extrabold font-mono text-base">
                      {formatPriceVal(getMonthlyPrice(packagesList[activeTab][2].id))}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </td>
                  </tr>

                  {/* Storage Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-250">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compStorage}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-800 dark:text-slate-100 font-mono">{packagesList[activeTab][0].storage}</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20">{packagesList[activeTab][1].storage}</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-800 dark:text-slate-100 font-mono">{packagesList[activeTab][2].storage}</td>
                  </tr>

                  {/* Bandwidth Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-250">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compBandwidth}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      {activeTab === 'bdix' ? 'Unlimited BDIX Block' : activeTab === 'vps' ? '1TB Transfer Pool' : 'Unlimited Bandwidth'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold bg-indigo-50/20 dark:bg-indigo-950/20">
                      {activeTab === 'bdix' ? 'Unlimited High-Speed' : activeTab === 'vps' ? '2TB Transfer Pool' : 'Unlimited Pool'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      {activeTab === 'bdix' ? 'Unlimited Priority Node' : activeTab === 'vps' ? '4TB Transfer Pool' : 'Unlimited Enterprise'}
                    </td>
                  </tr>

                  {/* SSL Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-650 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-250">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span>{activeTab === 'vps' ? 'OS Web Terminal' : currentTrans.compSSL}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'vps' ? 'Free OS Console' : 'Free AutoSSL'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 bg-indigo-50/20 dark:bg-indigo-950/20 font-mono font-extrabold text-xs">
                      {activeTab === 'vps' ? 'CyberPanel Prebuilt' : 'Free Wildcard Lifetime'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'vps' ? 'Free Pre-installed' : 'Free Wildcard Lifetime'}
                    </td>
                  </tr>

                  {/* Mailbox Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-250">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span>{activeTab === 'bdix' ? currentTrans.compEmails : activeTab === 'vps' ? 'Processor Compute Cores' : 'WHM accounts limit'}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'bdix' ? '10 Inbox Accounts' : activeTab === 'vps' ? '1 Dedicated AMD EPYC Core' : 'Host up to 10 WHM'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20 text-xs">
                      {activeTab === 'bdix' ? '30 Inbox Accounts' : activeTab === 'vps' ? '2 Dedicated AMD EPYC Cores' : 'Host up to 20 WHM'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                      {activeTab === 'bdix' ? 'Unlimited Inbox Accounts' : activeTab === 'vps' ? '4 Dedicated AMD EPYC Cores' : 'Host up to 50 WHM Accounts'}
                    </td>
                  </tr>

                  {/* Database Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-250">
                        <Database className="w-4 h-4" />
                      </div>
                      <span>{activeTab === 'bdix' ? currentTrans.compDatabases : activeTab === 'vps' ? 'RAM Allocation (DDR4)' : 'Subdomains / Addon Domain'}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'bdix' ? '5 MySQL DBs' : activeTab === 'vps' ? '2 GB ECC RAM' : 'Unlimited'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20 text-xs">
                      {activeTab === 'bdix' ? '15 MySQL DBs' : activeTab === 'vps' ? '4 GB ECC RAM' : 'Unlimited'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                      {activeTab === 'bdix' ? 'Unlimited DBs' : activeTab === 'vps' ? '8 GB ECC RAM' : 'Unlimited'}
                    </td>
                  </tr>

                  {/* Support Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-250">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compSupport}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">24/7 Standard Tickets</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold bg-indigo-50/20 dark:bg-indigo-950/20">24/7 Priority Support</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-cyan-400 dark:to-teal-300">
                      24/7 VIP Admin Access
                    </td>
                  </tr>

                  {/* Backup Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-250">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compBackups}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">Weekly Remote Nodes</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold bg-indigo-50/20 dark:bg-indigo-950/20">Daily Cloud Backup</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">Daily Cloud + Auto-Restore</td>
                  </tr>

                  {/* Uptime Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-250">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compUptime}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono">99.9% SLA</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20">99.9% SLA</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">99.9% High Availability</td>
                  </tr>

                  {/* Pricing / Call to Action Row inside bottom of comparison table to maximize conversions */}
                  <tr className="bg-slate-50/30 dark:bg-slate-900/10">
                    <td className="py-6 px-6 font-bold text-slate-950 dark:text-white">
                      <div className="text-xs text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">{language === 'bn' ? 'তাত্ক্ষণিক অ্যাকশন' : 'Action Hub'}</div>
                      <div className="text-sm font-black">{language === 'bn' ? 'হোস্টিং শুরু করুন' : 'Provision Instantly'}</div>
                    </td>
                    <td className="py-6 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      <a 
                        href="https://host.webzonebd.com/index.php?rp=/store/share-hosting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 w-full max-w-[150px] py-2 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition duration-200"
                      >
                        {language === 'bn' ? 'অর্ডার করুন' : language === 'ar' ? 'طلب الآن' : 'Order Starter'}
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                    <td className="py-6 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 bg-indigo-50/25 dark:bg-indigo-950/25">
                      <a 
                        href="https://host.webzonebd.com/index.php?rp=/store/share-hosting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full max-w-[150px] py-2.5 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-600/20"
                      >
                        {language === 'bn' ? 'জনপ্রিয় প্ল্যান' : language === 'ar' ? 'طلب الأكثر شعبية' : 'Order Business'}
                        <Sparkles className="w-3" />
                      </a>
                    </td>
                    <td className="py-6 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      <a 
                        href="https://host.webzonebd.com/index.php?rp=/store/share-hosting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 w-full max-w-[150px] py-2 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition duration-200"
                      >
                        {language === 'bn' ? 'প্রফেশনাল' : language === 'ar' ? 'طلب النخبة' : 'Order Pro'}
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ================================= CUSTOMER TESTIMONIALS ================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            {currentTrans.reviewsHeading}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentTrans.reviewsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              author: currentTrans.r1Author,
              role: currentTrans.r1Role,
              text: currentTrans.r1Text,
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            },
            {
              author: currentTrans.r2Author,
              role: currentTrans.r2Role,
              text: currentTrans.r2Text,
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
            },
            {
              author: currentTrans.r3Author,
              role: currentTrans.r3Role,
              text: currentTrans.r3Text,
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 bg-white dark:bg-[#0F172A] border border-slate-200/50 dark:border-slate-800 rounded-3xl flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-lg text-left"
            >
              <div>
                <div className="flex gap-1 text-amber-500 mb-4 justify-start">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-amber-450" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed font-serif mb-6">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.author}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================= FAQ SECTION ================================= */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              {currentTrans.faqHeading}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {currentTrans.faqSub}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: currentTrans.f1Q, a: currentTrans.f1A },
              { q: currentTrans.f2Q, a: currentTrans.f2A },
              { q: currentTrans.f3Q, a: currentTrans.f3A },
              { q: currentTrans.f4Q, a: currentTrans.f4A },
              { q: currentTrans.f5Q, a: currentTrans.f5A }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/50 dark:border-slate-800 p-1 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-4.5 px-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpIcon className="w-4 h-4 text-blue-550 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xxs sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================================= CONTACT CTA SECTION ================================= */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white p-8 md:p-14 text-center border border-slate-800">
          {/* Ambient overlays */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-650/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex justify-center p-4 bg-white/10 rounded-2xl backdrop-blur mb-6 border border-white/10">
            <HelpCircle className="w-8 h-8 text-cyan-400" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 font-display">
            {currentTrans.needHelp}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            {currentTrans.needHelpSub}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => handleScrollToId('redesigned-packages')}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-2 transition duration-300 scale-[1.01]"
            >
              <Award className="w-4 h-4 text-white fill-current animate-pulse" />
              <span>{currentTrans.orderHosting}</span>
            </button>

            <button 
              onClick={() => handleSupportInquiry('sales')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 transition duration-300"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>{currentTrans.contactSales}</span>
            </button>

            <button 
              onClick={() => handleSupportInquiry('whatsapp')}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 transition duration-300"
            >
              <Phone className="w-4 h-4" />
              <span>{currentTrans.whatsappSupport}</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
