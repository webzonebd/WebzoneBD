import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  Globe, Search, TrendingUp, Server, ShieldCheck, 
  HelpCircle, Sparkles, Send, Award, PhoneCall,
  Flame, Star, Gift, Check, CheckCircle2, CheckCircle, Filter,
  Sliders, DollarSign, Calendar, Clock, X, Heart,
  ShoppingCart, MessageSquare, Plus, Minus, ArrowRight,
  ThumbsUp, ChevronRight, ChevronDown, Loader2, Edit, Trash2,
  Palette, Video, Camera, QrCode, Upload, MessageCircle,
  Code2, Laptop, Smartphone, Database, Cloud, Cpu, Zap, Rocket,
  Layers, Bot, Workflow, Binary, MapPin, Activity, Terminal, BookOpen, Briefcase
} from 'lucide-react';
import { Language, Theme, Order, Currency, UserSession } from '../types';
import Package from './Package';
import GoogleBusinessService from './GoogleBusinessService';
import DigitalWebDevelopment from './DigitalWebDevelopment';
import MarketingServiceDetails from './MarketingServiceDetails';
import ServiceDetails from './ServiceDetails';
import ServiceCard3D from './ServiceCard3D';
import ServicesHeroBgAnimation from './ServicesHeroBgAnimation';
import { 
  catalogServicesData, 
  fixedPackagesData, 
  featuredPackagesData, 
  recommendedServicesMap,
  CatalogService,
  FixedPackage,
  FeaturedPackage
} from './ServicesData';
import { COMPANY_CATEGORIES, CompanyCategoryItem } from '../data/companyCategories';

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
  { id: 'digital-marketing', label: 'Digital Marketing', bn: 'ডিজিটাল মার্কেটিং', ar: 'التسويق الرقمي', icon: TrendingUp },
  { id: 'wordpress-services', label: 'WordPress Services', bn: 'ওয়ার্ডপ্রেস সার্ভিসেস', ar: 'خدمات ووردبريس', icon: Globe },
  { id: 'whmcs-solutions', label: 'WHMCS Solutions', bn: 'WHMCS সলিউশনস', ar: 'حلول WHMCS', icon: Sliders },
  { id: 'mobile-app-development', label: 'Mobile App Development', bn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট', ar: 'تطوير تطبيقات الجوال', icon: ShieldCheck },
  { id: 'business-software', label: 'Business Software', bn: 'বিজনেস সফটওয়্যার', ar: 'برمجيات الأعمال', icon: CheckCircle2 },
  { id: 'custom-development', label: 'Custom Development', bn: 'কাস্টম ডেভেলপমেন্ট', ar: 'التطوير المخصص', icon: CheckCircle },
  { id: 'graphic-design', label: 'Graphic Design', bn: 'গ্রাফিক ডিজাইন', ar: 'التصميم الجرافيكي', icon: Heart }
];

export const CUSTOM_ADDON_MODULES = [
  { 
    id: 'payment_gateway', 
    label: 'Payment Gateway (bKash/Nagad/Cards)', 
    bn: 'বিকাশ/নগদ পেমেন্ট গেটওয়ে', 
    ar: 'بوابة دفع إلكتروني (بكاش/نقد/بطاقات)',
    icon: DollarSign, 
    price: '$40', 
    priceNum: 40,
    badge: 'Automated Checkout',
    badgeBn: 'স্বয়ংক্রিয় পেমেন্ট',
    badgeAr: 'دفع آلي وتلقائي',
    usage: 'Instant automated checkout supporting bKash, Nagad, Rocket, cards & SSLCommerz with real-time transaction verification.',
    usageBn: 'বিকাশ, নগদ, রকেট ও কার্ডের মাধ্যমে ইনস্ট্যান্ট অটোমেটেড চেকআউট ও ইনস্ট্যান্ট পেমেন্ট ভেরিফিকেশন সুবিধা দেয়।',
    usageAr: 'يتيح الدفع الإلكتروني الفوري والتلقائي عبر المحافظ الرقمية والبطاقات الائتمانية مع إشعارات تحقق فورية.',
    benefits: ['bKash & Nagad Direct Merchant API', 'Automated instant payment invoice & SMS', 'Zero manual ledger verification required'],
    benefitsBn: ['বিকাশ ও নগদ মার্চেন্ট এপিআই', 'অটোমেটেড এসএমএস ও রসিদ তৈরি', 'কোনো ম্যানুয়াল ভেরিফিকেশনের প্রয়োজন নেই'],
    benefitsAr: ['دعم بوابات الدفع المعتمدة', 'تأكيد فوري بالرسائل والبريد', 'معالجة آلية بدون تدخل يدوي']
  },
  { 
    id: 'admin_panel', 
    label: 'Dynamic Admin Management CMS', 
    bn: 'ডাইনামিক অ্যাডমিন প্যানেল', 
    ar: 'لوحة تحكم إدارية CMS متقدمة',
    icon: Layers, 
    price: '$50', 
    priceNum: 50,
    badge: 'Full CMS Control',
    badgeBn: 'সম্পূর্ণ ব্যাক-অফিস কন্ট্রোল',
    badgeAr: 'تحكم إداري كامل',
    usage: 'Centralized admin dashboard to manage products, customer orders, live sales analytics, media uploads, and role permissions.',
    usageBn: 'প্রোডাক্ট, কাস্টমার অর্ডার ট্র্যাকিং, সেলস অ্যানালিটিক্স, কন্টেন্ট ও রোল-বেসড এক্সেস পরিচালনার সম্পূর্ণ ব্যাক-অফিস ড্যাশবোর্ড।',
    usageAr: 'لوحة تحكم مركزية لإدارة المنتجات والطلبات وتتبع المخزون والتحليلات وإدارة صلاحيات المستخدمين بسهولة.',
    benefits: ['Intuitive visual back-office dashboard', 'Export orders & leads to CSV/Excel', 'Role-based access (Admin, Staff, Editor)'],
    benefitsBn: ['সহজ ভিজ্যুয়াল ড্যাশবোর্ড', 'এক্সেল ও সিএসভি ডাটা এক্সপোর্ট', 'অ্যাডমিন ও স্টাফ রোল পারমিশন'],
    benefitsAr: ['واجهة بصرية سهلة الاستخدام', 'تصدير البيانات إلى Excel', 'تحديد صلاحيات المشرفين والموظفين']
  },
  { 
    id: 'multi_language', 
    label: 'Multi-Language (Bangla + English)', 
    bn: 'মাল্টি-ল্যাঙ্গুয়েজ সাপোর্ট', 
    ar: 'دعم متعدد اللغات والاتجاهات',
    icon: Globe, 
    price: '$35', 
    priceNum: 35,
    badge: 'Bilingual / RTL Ready',
    badgeBn: 'বহুভাষিক ও লোকাল কারেন্সি',
    badgeAr: 'تعدد لغات وRTL',
    usage: 'One-click instant language switching (Bangla, English & Arabic) with complete RTL adaptation and dynamic currency conversion.',
    usageBn: 'বাংলা, ইংরেজি ও আরবি ভাষার ওয়ান-ক্লিক সুইচিং, ফুল আরটিএল (RTL) লেআউট সাপোর্ট এবং লোকাল কারেন্সি ডিসপ্লে সুবিধা।',
    usageAr: 'تبديل فوري بنقرة واحدة بين اللغات مع ضبط اتجاهات النصوص RTL والعملات المحلية لجميع الأسواق.',
    benefits: ['Auto-detect visitor language & locale', 'SEO-optimized localized page slugs', 'Smooth animated UI layout transition'],
    benefitsBn: ['ভিজিটরের ভাষা অটো-ডিটেকশন', 'এসইও ফ্রেন্ডলি মাল্টিপল ইউআরএল', 'স্মুথ ও রেসপনসিভ লেআউট ট্রানজিশন'],
    benefitsAr: ['اكتشاف تلقائي للغة الزائر', 'روابط متوافقة مع محركات البحث', 'انتقال سلس بين الواجهات']
  },
  { 
    id: 'seo_setup', 
    label: 'Google Speed & Technical SEO Audit', 
    bn: 'টেকনিক্যাল এসইও ও স্পিড অপ্টিমাইজেশন', 
    ar: 'تحسين محركات البحث والسرعة الخارقة',
    icon: TrendingUp, 
    price: '$30', 
    priceNum: 30,
    badge: '90+ Lighthouse Score',
    badgeBn: 'গুগল সার্চ র‍্যাংকিং',
    badgeAr: 'أداء فائق 90+',
    usage: 'Technical search optimization including Google Search Console setup, XML sitemaps, JSON-LD Schema markup, and 90+ Core Web Vitals.',
    usageBn: 'গুগল সার্চ কনসোল সেটআপ, সাইটম্যাপ, স্কিমা রিচ স্নিপেট মার্কআপ এবং ৯০+ লাইটহাউস স্পিড স্কোর নিশ্চিতকরণের টেকনিক্যাল অপ্টিমাইজেশন।',
    usageAr: 'تهيئة شاملة لمحركات البحث تشمل خرائط XML وبيانات JSON-LD وتحسين نقاط Google Core Web Vitals لـ 90+.',
    benefits: ['Social preview cards (OpenGraph & Twitter)', 'Google rich snippet & FAQ schema markup', 'Mobile Core Web Vitals guaranteed pass'],
    benefitsBn: ['সোশ্যাল মিডিয়া ওপেনগ্রাফ প্রিভিউ', 'গুগল রিচ স্নিপেট প্রিভিউ সুবিধা', 'মোবাইল স্পিড অপ্টিমাইজেশন'],
    benefitsAr: ['معاينات غنية في شبكات التواصل', 'ظهور مميز في نتائج بحث جوجل', 'تحسين فائق لتصفح الجوال']
  },
  { 
    id: 'cloud_hosting', 
    label: '1-Year High Speed Cloud Hosting', 
    bn: '১-বছর সুপারফাস্ট ক্লাউড হোস্টিং', 
    ar: 'استضافة سحابية فائقة السرعة لسنة',
    icon: Cloud, 
    price: '$45', 
    priceNum: 45,
    badge: '99.9% Uptime Guarantee',
    badgeBn: 'সুপারফাস্ট NVMe SSD',
    badgeAr: 'ضمان تشغيل 99.9%',
    usage: 'Enterprise NVMe SSD cloud hosting with global Cloudflare CDN caching, free lifetime SSL encryption, DDoS mitigation, and automated daily backups.',
    usageBn: '১ বছরের জন্য আল্ট্রাফাস্ট NVMe SSD ক্লাউড হোস্টিং, ফ্রি গ্লোবাল CDN, লাইফটাইম ফ্রি SSL সার্টিফিকেট এবং স্বয়ংক্রিয় ক্লাউড ব্যাকআপ।',
    usageAr: 'استضافة سحابية NVMe SSD فائقة السرعة مع شبكة CDN عالمية وشهادة SSL مجانية ونسخ احتياطي يومي آمن.',
    benefits: ['Free Wildcard SSL Certificate', 'Automated nightly backups & 1-click restore', 'Fully managed cloud infrastructure support'],
    benefitsBn: ['ফ্রি ওয়াইল্ডকার্ড SSL সার্টিফিকেট', 'প্রতি রাতের স্বয়ংক্রিয় ব্যাকআপ ও রিস্টোর', 'সম্পূর্ণ ম্যানেজড ক্লাউড সাপোর্ট'],
    benefitsAr: ['شهادة حماية SSL مجانية', 'نسخ احتياطي واستعادة بضغطة زر', 'إدارة سحابية شاملة بدون عناء']
  },
  { 
    id: 'custom_api', 
    label: 'Custom REST API / Webhook Integration', 
    bn: 'কাস্টম এপিআই ও ওয়েবহুক সিস্টেম', 
    ar: 'واجهات برمجة وتكامل ويب هوك مخصص',
    icon: Code2, 
    price: '$60', 
    priceNum: 60,
    badge: 'Enterprise Automation',
    badgeBn: 'এপিআই ও ওয়েবহুক',
    badgeAr: 'أتمتة المؤسسات',
    usage: 'Secure RESTful endpoints & real-time webhook triggers to synchronize live customer leads, inventory, and transactions with external ERP, CRM, or POS tools.',
    usageBn: 'ERP, CRM, কুরিয়ার সার্ভিস অথবা অ্যাকাউন্টিং সফটওয়্যারের সাথে রিয়েল-টাইম ডাটা সিঙ্ক করার জন্য সিকিউরড REST এপিআই ও লাইভ ওয়েবহুক সিস্টেম।',
    usageAr: 'واجهات برمجية RESTful ونقاط ويب هوك آمنة لربط ومزامنة الطلبات والعملاء والمخزون مع أنظمة ERP والـ CRM والبرامج المحاسبية.',
    benefits: ['Seamless courier & ERP webhook sync', 'Bearer token & API key authorization', 'Real-time JSON request/response telemetry'],
    benefitsBn: ['কুরিয়ার ও ইনভেন্টরি অটো-সিঙ্ক সুবিধা', 'সুরক্ষিত API কী ও টোকেন অথেনটিকেশন', 'রিয়েল-টাইম ডাটা ট্রান্সফার'],
    benefitsAr: ['ربط مع شركات الشحن والمخازن', 'حماية مشددة بمفاتيح API والتوكن', 'مزامنة فورية لبيانات JSON']
  }
];

export const tailoredCategoriesList = [
  {
    id: 'website-development',
    title: 'Website & Web App Development',
    titleBn: 'ওয়েবসাইট ও ওয়েব অ্যাপ ডেভেলপমেন্ট',
    titleAr: 'تطوير المواقع وتطبيقات الويب المتقدمة',
    desc: 'Custom high-speed corporate websites, SaaS platforms, and responsive web portals built for performance and scale.',
    descBn: 'কাস্টম হাই-স্পিড কর্পোরেট ওয়েবসাইট, স্টার্টআপ পোর্টাল এবং আধুনিক রেসপনসিভ ওয়েব অ্যাপ্লিকেশন।',
    descAr: 'مواقع شركات فائقة السرعة، منصات سحابية SaaS، وبوابات ويب متجاوبة قابلة للتوسع.',
    icon: Globe,
    count: '14+ Services',
    countBn: '১৪+ সার্ভিস',
    badge: 'Popular',
    badgeBn: 'জনপ্রিয়',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20',
    tags: ['React', 'Next.js', 'Laravel', 'Tailwind'],
    gradient: 'from-blue-500/10 via-sky-500/5 to-transparent',
    borderHover: 'hover:border-blue-500/60 dark:hover:border-cyan-400/60',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400',
    startingPrice: '$49',
    startingPriceBn: '৫,০০০ ৳'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Stores & Payment Gateways',
    titleBn: 'ই-কমার্স অনলাইন শপ ও পেমেন্ট গেটওয়ে',
    titleAr: 'المتاجر الإلكترونية وبوابات الدفع الإلكتروني',
    desc: 'Automated bKash/Nagad/SSLCommerz checkout stores with inventory sync, SMS order tracking, and invoice builder.',
    descBn: 'স্বয়ংক্রিয় বিকাশ, নগদ ও কার্ড পেমেন্ট গেটওয়ে সহ ফুল-ফিচার্ড দ্রুতগতির অনলাইন স্টোর।',
    descAr: 'متاجر إلكترونية عالية التحويل مع تكامل كامل لبوابات الدفع وإدارة الطلبات والمخازن.',
    icon: ShoppingCart,
    count: '8+ Services',
    countBn: '৮+ সার্ভিস',
    badge: 'Top Selling',
    badgeBn: 'টপ সেলিং',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    tags: ['bKash / Nagad', 'WooCommerce', 'Auto Invoice', 'POS Sync'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    borderHover: 'hover:border-emerald-500/60 dark:hover:border-emerald-400/60',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    startingPrice: '$99',
    startingPriceBn: '১০,০০০ ৳'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing & Growth Ads Suite',
    titleBn: 'ডিজিটাল মার্কেটিং ও অ্যাডস ক্যাম্পেইন',
    titleAr: 'التسويق الرقمي وإعلانات النمو التفاعلية',
    desc: 'Targeted Facebook/Meta ads, Google PPC, YouTube promotional campaigns, and high-conversion sales funnels.',
    descBn: 'টার্গেটেড ফেসবুক ও মেটা অ্যাডস, গুগল পিপিসি, ইউটিউব প্রোমোশন ও হাই-কনভার্সন ব্র্যান্ডিং।',
    descAr: 'إعلانات ميتا المستهدفة، حملات جوجل الممولة، وإعلانات نمو قنوات يوتيوب والمبيعات.',
    icon: TrendingUp,
    count: '12+ Services',
    countBn: '১২+ সার্ভিস',
    badge: 'High ROI',
    badgeBn: 'হাই আরওআই',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    tags: ['Meta Ads', 'Google Ads', 'Funnel Setup', 'Pixel Tracking'],
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    borderHover: 'hover:border-purple-500/60 dark:hover:border-purple-400/60',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    startingPrice: '$39',
    startingPriceBn: '৩,৫০০ ৳'
  },
  {
    id: 'google-business',
    title: 'Google Business Profile & Map Ranking',
    titleBn: 'গুগল মাই বিজনেস ও ম্যাপ র্যাংকিং',
    titleAr: 'تهيئة وتوثيق نشاط جوجل التجاري والخرائط',
    desc: 'Instant verification, Google Maps #1 rank optimization, local citations, and 5-star customer review loops.',
    descBn: 'ভেরিফাইড গুগল বিজনেস প্রোফাইল, গুগল ম্যাপে শীর্ষ স্থান এবং কাস্টমার রিভিউ জেনারেশন।',
    descAr: 'توثيق حسابات جوجل للأعمال، صدارة نتائج الخرائط، وتجميع تقييمات العملاء الموثوقة.',
    icon: Search,
    count: '6+ Services',
    countBn: '৬+ সার্ভিস',
    badge: 'Verified',
    badgeBn: 'ভেরিফাইড',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    tags: ['Map Top Rank', 'GMB Verification', 'Local SEO', 'Review Cards'],
    gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    borderHover: 'hover:border-amber-500/60 dark:hover:border-amber-400/60',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    startingPrice: '$29',
    startingPriceBn: '২,৫০০ ৳'
  },
  {
    id: 'business-software',
    title: 'POS, ERP & Business Management Software',
    titleBn: 'পিওএস, ইআরপি ও বিজনেস সফটওয়্যার',
    titleAr: 'أنظمة نقاط البيع والبرمجيات الإدارية ERP',
    desc: 'Cloud-based retail POS, inventory control, school management ERP, and automated corporate billing systems.',
    descBn: 'দোকান ও সুপারশপের জন্য পিওএস, ইনভেন্টরি, স্কুল ম্যানেজমেন্ট ও ক্লাউড ইআরপি সফটওয়্যার।',
    descAr: 'أنظمة مبيعات POS، إدارة المخازن، إدارة المدارس والمحاسبة السحابية المتطورة.',
    icon: CheckCircle2,
    count: '10+ Services',
    countBn: '১০+ সার্ভিস',
    badge: 'Enterprise',
    badgeBn: 'এন্টারপ্রাইজ',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    tags: ['Barcode Scanner', 'Cloud Database', 'Auto Reports', 'User Roles'],
    gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
    borderHover: 'hover:border-indigo-500/60 dark:hover:border-indigo-400/60',
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    startingPrice: '$119',
    startingPriceBn: '১২,০০০ ৳'
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development (Android & iOS)',
    titleBn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট (Android & iOS)',
    titleAr: 'تطوير تطبيقات الجوال للأندرويد والآيفون',
    desc: 'High-performance Flutter & React Native native-grade mobile applications with Firebase and store launch.',
    descBn: 'ফ্লাটার ও রিয়্যাক্ট নেটিভ দিয়ে দ্রুতগতির প্রিমিয়াম অ্যান্ড্রয়েড এবং আইওএস মোবাইল অ্যাপ।',
    descAr: 'تطبيقات جوال سريعة بتقنية فلاتر ورياكت نيتيف مع لوحات تحكم وإشعارات ذكية.',
    icon: ShieldCheck,
    count: '5+ Services',
    countBn: '৫+ সার্ভিস',
    badge: 'Cross Platform',
    badgeBn: 'ক্রস প্ল্যাটফর্ম',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
    tags: ['Flutter', 'React Native', 'Play Store', 'App Store'],
    gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
    borderHover: 'hover:border-cyan-500/60 dark:hover:border-cyan-400/60',
    iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    startingPrice: '$249',
    startingPriceBn: '২৫,০০০ ৳'
  },
  {
    id: 'graphic-design',
    title: 'Branding, Logo & UI/UX Graphic Design',
    titleBn: 'লোগো, ব্র্যান্ডিং ও গ্রাফিক ডিজাইন',
    titleAr: 'الهوية البصرية وتصميم الشعارات والواجهات',
    desc: 'Iconic vector logos, brand typography guides, high-converting social media banners, and motion reels.',
    descBn: 'প্রফেশনাল ভেক্টর লোগো, ব্র্যান্ড আইডেন্টিটি, সোশ্যাল ব্যানার ও আধুনিক মোশন গ্রাফিক্স।',
    descAr: 'تصميم شعارات وهوية متكاملة، لافتات إعلانية وفيديوهات موشن جرافيكس مبتكرة.',
    icon: Palette,
    count: '8+ Services',
    countBn: '৮+ সার্ভিস',
    badge: 'Creative',
    badgeBn: 'ক্রিয়েটিভ',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    tags: ['Vector Logo', 'Brand Guide', 'Social Kit', 'Motion Reels'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    borderHover: 'hover:border-rose-500/60 dark:hover:border-rose-400/60',
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    startingPrice: '$25',
    startingPriceBn: '২,০০০ ৳'
  },
  {
    id: 'whmcs-solutions',
    title: 'WHMCS & Cloud Server Hosting Setup',
    titleBn: 'WHMCS ও সার্ভার হোস্টিং সলিউশন',
    titleAr: 'حلول WHMCS وإدارة خوادم الاستضافة السحابية',
    desc: 'Automated hosting billing module setup, cPanel/WHM server configuration, and hardened security.',
    descBn: 'অটোমেটেড ডোমেইন-হোস্টিং বিলিং পোর্টাল, সার্ভার কনফিগারেশন ও ক্লাউড সিকিউরিটি সেটআপ।',
    descAr: 'أتمتة فواتير الاستضافة WHMCS، تكوين خوادم cPanel/WHM وحماية السيرفرات السحابية.',
    icon: Sliders,
    count: '6+ Services',
    countBn: '৬+ সার্ভিস',
    badge: 'Automation',
    badgeBn: 'অটোমেশন',
    badgeColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
    tags: ['WHMCS Setup', 'cPanel / WHM', 'bKash Gateway', 'Server Security'],
    gradient: 'from-violet-500/10 via-indigo-500/5 to-transparent',
    borderHover: 'hover:border-violet-500/60 dark:hover:border-violet-400/60',
    iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    startingPrice: '$49',
    startingPriceBn: '৪,৫০০ ৳'
  }
];

interface ServicesProps {
  user?: UserSession | null;
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
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const serviceRequirementsPrices: { [key: string]: number } = {
  "Web Share Hosting - Starter Plan": 0.99,
  "Web Share Hosting - Business Plan": 1.99,
  "Web Share Hosting - Professional Plan": 2.99,
  "VPS Hosting - Starter Plan": 14.99,
  "VPS Hosting - Business Plan": 29.99,
  "VPS Hosting - Professional Plan": 49.99,
  "Reseller Hosting - 10 GB NVMe": 8.99,
  "Reseller Hosting - 30 GB NVMe": 17.99,
  "Reseller Hosting - 50 GB NVMe": 24.99,
  "Domain Registration": 9.99,
  "Landing page Website Build": 49.00,
  "Professional Business Website": 149.00,
  "Normal Ecommerce Website": 199.00,
  "Blog and News Portal Build": 119.00,
  "Personal & Agency Portfolio Website": 99.00,
  "Custom SaaS & Web Application": 269.00,
  "Facebook Marketing": 79.00,
  "YouTube Marketing": 99.00,
  "Social media Profile Banding": 39.00,
  "Google Business Profile Setup": 29.00,
  "POS Solution": 119.00,
  "School Management Solution": 249.00,
  "Logo and Banner Design": 25.00,
  "YouTube / TikTok Intro video": 35.00
};

const serviceRequirementsList = [
  // --- HOSTING CATEGORIES & SUB-CATEGORIES ---
  // 1. Shared Hosting
  {
    id: "Web Share Hosting - Starter Plan",
    label: "Shared Hosting - Starter Plan ($0.99/mo)",
    labelBn: "শেয়ার্ড হোস্টিং - স্টার্টার প্ল্যান ($0.99/মাস)",
    labelAr: "الاستضافة المشتركة - الخطة الأساسية ($0.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "Shared Hosting",
    subCategoryBn: "শেয়ার্ড হোস্টিং",
    subCategoryAr: "الاستضافة المشتركة",
    icon: Server,
    desc: "Host 1 Website & Unlimited Subdomains • 2GB NVMe SSD Storage • Unlimited Bandwidth • 10 Mailbox Accounts • cPanel & LiteSpeed Web Server",
    descBn: "১টি ওয়েবসাইট এবং আনলিমিটেড সাবডোমেইন • ২ জিবি এনভিএমই স্টোরেজ • আনলিমিটেড ব্যান্ডউইথ • ১০টি ইমেইল • সিপ্যানেল ও লাইটস্পীড",
    descAr: "موقع ويب واحد ونطاقات فرعية غير محدودة • مساحة ٢ جيجابايت NVMe SSD • معدل نقل بيانات مفتوح • لوحة تحكم cPanel"
  },
  {
    id: "Web Share Hosting - Business Plan",
    label: "Shared Hosting - Business Plan ($1.99/mo)",
    labelBn: "শেয়ার্ড হোস্টিং - বিজনেস প্ল্যান ($1.99/মাস)",
    labelAr: "الاستضافة المشتركة - خطة الأعمال ($1.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "Shared Hosting",
    subCategoryBn: "শেয়ার্ড হোস্টিং",
    subCategoryAr: "الاستضافة المشتركة",
    icon: Server,
    desc: "Host 1 Website & Unlimited Subdomains • 5GB NVMe SSD Storage • Unlimited Bandwidth • 30 Enterprise Email Boxes • Daily Remote Backup",
    descBn: "১টি ওয়েবসাইট এবং আনলিমিটেড সাবডোমেইন • ৫ জিবি এনভিএমই স্টোরেজ • আনলিমিটেড ব্যান্ডউইথ • ৩০টি ইমেইল • দৈনিক ক্লাউড ব্যাকআপ",
    descAr: "موقع ويب واحد ونطاقات فرعية غير محدودة • مساحة ٥ جيجابايت NVMe • ترافيك غير محدود • نسخ احتياطي يومي آمن"
  },
  {
    id: "Web Share Hosting - Professional Plan",
    label: "Shared Hosting - Professional Plan ($2.99/mo)",
    labelBn: "শেয়ার্ড হোস্টিং - প্রফেশনাল প্ল্যান ($2.99/মাস)",
    labelAr: "الاستضافة المشتركة - خطة المحترفين ($2.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "Shared Hosting",
    subCategoryBn: "শেয়ার্ড হোস্টিং",
    subCategoryAr: "الاستضافة المشتركة",
    icon: Server,
    desc: "Host 1 Website & Unlimited Subdomains • 10GB Premium NVMe Storage • Unlimited Bandwidth • Unlimited Emails • Priority 24/7 Support",
    descBn: "১টি ওয়েবসাইট এবং আনলিমিটেড সাবডোমেইন • ১০ জিবি এনভিএমই স্টোরেজ • আনলিমিটেড ব্যান্ডউইথ • আনলিমিটেড ইমেইল • সার্বক্ষণিক ভিআইপি সাপোর্ট",
    descAr: "موقع ويب واحد ونطاقات فرعية غير محدودة • مساحة ١٠ جيجابايت بريميوم • حسابات بريد غير محدودة • دعم كبار العملاء"
  },

  // 2. VPS Hosting
  {
    id: "VPS Hosting - Starter Plan",
    label: "VPS Hosting - Starter Plan ($14.99/mo)",
    labelBn: "ভিপিএস হোস্টিং - স্টার্টার প্ল্যান ($14.99/মাস)",
    labelAr: "خادم افتراضي خاص VPS - الخطة الأساسية ($14.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "VPS Hosting",
    subCategoryBn: "ভিপিএস হোস্টিং",
    subCategoryAr: "استضافة VPS",
    icon: Sliders,
    desc: "1 Core Dedicated AMD EPYC CPU • 2GB Dedicated DDR4 RAM • 50GB Enterprise NVMe Storage • 1TB Bandwidth • 1 Dedicated IP",
    descBn: "১ কোর ডেডিকেটেড এএমডি প্রসেসর • ২ জিবি র‍্যাম • ৫০ জিবি এন্টারপ্রাইজ এনভিএমই স্টোরেজ • ১টি ডেডিকেটেড আইপি",
    descAr: "معالج فوري ١ Core AMD EPYC • ذاكرة ٢ جيجابايت DDR4 • مساحة ٥٠ جيجابايت Enterprise NVMe"
  },
  {
    id: "VPS Hosting - Business Plan",
    label: "VPS Hosting - Business Plan ($29.99/mo)",
    labelBn: "ভিপিএস হোস্টিং - বিজনেস প্ল্যান ($29.99/মাস)",
    labelAr: "خادم افتراضي خاص VPS - خطة الأعمال ($29.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "VPS Hosting",
    subCategoryBn: "ভিপিএস হোস্টিং",
    subCategoryAr: "استضافة VPS",
    icon: Sliders,
    desc: "2 Cores Dedicated AMD EPYC CPU • 4GB Dedicated DDR4 RAM • 100GB Enterprise NVMe Storage • 2TB Bandwidth • 2 Dedicated IPs",
    descBn: "২ কোর ডেডিকেটেড এএমডি প্রসেসর • ৪ জিবি র‍্যাম • ১০০ জিবি এন্টারপ্রাইজ এনভিএমই স্টোরেজ • ২টি ডেডিকেটেড আইপি",
    descAr: "معالج فائق ٢ Cores AMD EPYC • ذاكرة ٤ جيجابايت RAM • مساحة ١٠٠ جيجابايت NVMe SSD • عنوانين IP"
  },
  {
    id: "VPS Hosting - Professional Plan",
    label: "VPS Hosting - Professional Plan ($49.99/mo)",
    labelBn: "ভিপিএস হোস্টিং - প্রফেশনাল প্ল্যান ($49.99/মাস)",
    labelAr: "خادم افتراضي خاص VPS - خطة المحترفين ($49.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "VPS Hosting",
    subCategoryBn: "ভিপিএস হোস্টিং",
    subCategoryAr: "استضافة VPS",
    icon: Sliders,
    desc: "4 Cores Dedicated AMD EPYC CPU • 8GB Dedicated DDR4 RAM • 200GB Enterprise NVMe Storage • 4TB Bandwidth • 3 Dedicated IPs",
    descBn: "৪ কোর ডেডিকেটেড এএমডি প্রসেসর • ৮ জিবি র‍্যাম • ২০০ জিবি এন্টারপ্রাইজ এনভিএমই স্টোরেজ • ৩টি ডেডিকেটেড আইপি",
    descAr: "معالج فائق ٤ Cores AMD EPYC • ذاكرة ٨ جيجابايت RAM • مساحة ٢٠٠ جيجابايت NVMe SSD • ثلاث عناوين IP"
  },

  // 3. Reseller Hosting
  {
    id: "Reseller Hosting - 10 GB NVMe",
    label: "Reseller Hosting - 10 GB NVMe ($8.99/mo)",
    labelBn: "রিসেলার হোস্টিং - ১০ জিবি এনভিএমই ($8.99/মাস)",
    labelAr: "استضافة الموزعين - ١٠ جيجابايت NVMe ($8.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "Reseller Hosting",
    subCategoryBn: "রিসেলার হোস্টিং",
    subCategoryAr: "استضافة الموزعين",
    icon: Award,
    desc: "10GB NVMe SSD Storage • 10 cPanel Accounts Managed • Free WHM & SSL • White-Label Nameservers",
    descBn: "১০ জিবি এনভিএমই স্টোরেজ • ১০টি সিপ্যানেল অ্যাকাউন্ট • ফ্রি ডব্লিউএইচএম ও এসএসএল • হোয়াইট লেবেল",
    descAr: "مساحة ١٠ جيجابايت NVMe SSD • إدارة حسابات ١٠ cPanel • لوحة WHM مجانية • خوادم أسماء مخصصة"
  },
  {
    id: "Reseller Hosting - 30 GB NVMe",
    label: "Reseller Hosting - 30 GB NVMe ($17.99/mo)",
    labelBn: "রিসেলার হোস্টিং - ৩০ জিবি এনভিএমই ($17.99/মাস)",
    labelAr: "استضافة الموزعين - ٣٠ جيجابايت NVMe ($17.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "Reseller Hosting",
    subCategoryBn: "রিসেলার হোস্টিং",
    subCategoryAr: "استضافة الموزعين",
    icon: Award,
    desc: "30GB NVMe SSD Storage • 25-30 cPanel Accounts • Dedicated Resource Pool • LiteSpeed Web Server • WHM Admin",
    descBn: "৩০ জিবি এনভিএমই স্টোরেজ • ২৫-৩০টি সিপ্যানেল অ্যাকাউন্ট • ডেডিকেটেড রিসোর্স • লাইটস্পিড ওয়েব সার্ভার",
    descAr: "مساحة ٣٠ جيجابايت NVMe SSD • حسابات ٢٥-٣٠ cPanel • لوحة WHM مجانية • خوادم أسماء ذاتية مخصصة"
  },
  {
    id: "Reseller Hosting - 50 GB NVMe",
    label: "Reseller Hosting - 50 GB NVMe ($24.99/mo)",
    labelBn: "রিসেলার হোস্টিং - ৫০ জিবি এনভিএমই ($24.99/মাস)",
    labelAr: "استضافة الموزعين - ٥٠ جيجابايت NVMe ($24.99/شهرياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "Reseller Hosting",
    subCategoryBn: "রিসেলার হোস্টিং",
    subCategoryAr: "استضافة الموزعين",
    icon: Award,
    desc: "50GB Enterprise NVMe SSD Storage • 40-50 cPanel Accounts Allowed • Uncapped Ultra-Bandwidth • 24/7 Expert Support",
    descBn: "৫০ জিবি এন্টারপ্রাইজ এনভিএমই স্টোরেজ • ৪০-৫০টি সিপ্যানেল অ্যাকাউন্ট • আনলিমিটেড আল্ট্রা ব্যান্ডউইথ",
    descAr: "مساحة ٥٠ جيجابايت NVMe SSD • حسابات ٤٠-٥٠ cPanel • باندويث غير محدود • دعم فني هندسي بريميوم"
  },

  // 4. Domains & Others
  {
    id: "Domain Registration",
    label: "Domain Registration Services (Starts $9.99/yr)",
    labelBn: "ডোমেইন রেজিস্ট্রেশন সার্ভিস (শুরু $9.99/বছর)",
    labelAr: "حجز وتسجيل النطاقات العالمية والمحلية (يبدأ من $9.99/سنوياً)",
    category: "Hosting & Domains",
    categoryBn: "হোস্টিং ও ডোমেইন",
    categoryAr: "الاستضافة والنطاقات",
    subCategory: "Domain Services",
    subCategoryBn: "ডোমেইন সার্ভিস",
    subCategoryAr: "خدمات النطاقات",
    icon: Globe,
    desc: "Global TLD registration (.com: $9.99, .net: $11.99, .org: $12.99, .bd: $12.80, .com.bd: $10.25) with DNS management & privacy shield.",
    descBn: "ডিএনএস কন্ট্রোলসহ গ্লোবাল ডোমেইন রেজিস্ট্রেশন (.com, .net, .org, .xyz, .bd, .com.bd)।",
    descAr: "تسجيل النطاقات العالمية بمختلف الامتدادات مع إدارة كاملة لسجلات الحجز وحماية الخصوصية."
  },

  // --- WEBSITE DEVELOPMENT CATEGORY ---
  {
    id: "Landing page Website Build",
    label: "Landing page Website Build",
    labelBn: "ল্যান্ডিং পেজ ওয়েবসাইট তৈরি",
    labelAr: "بناء صفحات الهبوط التسويقية",
    category: "Website Development",
    categoryBn: "ওয়েবসাইট তৈরি",
    categoryAr: "تطوير المواقع والمنصات",
    icon: Sparkles,
    desc: "High-converting ultra-fast custom single-page sales funnel.",
    descBn: "অাধিক বিক্রয় উপযোগী অতি দ্রুত কাস্টম সিঙ্গেল পেজ সেলস ফানেল।",
    descAr: "صفحة هبوط تسويقية مخصصة فائقة السرعة وعالية التحويل."
  },
  {
    id: "Professional Business Website",
    label: "Professional Business Website",
    labelBn: "প্রফেশনাল বিজনেস ওয়েবসাইট",
    labelAr: "موقع ويب احترافي للشركات",
    category: "Website Development",
    categoryBn: "ওয়েবসাইট তৈরি",
    categoryAr: "تطوير المواقع والمنصات",
    icon: ShieldCheck,
    desc: "Corporate profile sites, secure portfolios, and brand showcases.",
    descBn: "কর্পোরেট প্রোফাইল সাইট, নিরাপদ পোর্টফোলিও এবং ব্র্যান্ড শোকেস।",
    descAr: "موقع تعريفي احترافي للشركات والمؤسسات مع معرض أعمال آمن."
  },
  {
    id: "Normal Ecommerce Website",
    label: "Normal Ecommerce Website",
    labelBn: "সাধারণ ই-কমার্স ওয়েবসাইট",
    labelAr: "متجر إلكتروني قياسي",
    category: "Website Development",
    categoryBn: "ওয়েবসাইট তৈরি",
    categoryAr: "تطوير المواقع والمنصات",
    icon: ShoppingCart,
    desc: "Standard digital store for retail brands with localized checkout options.",
    descBn: "রিটেল ব্র্যান্ডের জন্য লোকাল পেমেন্ট গেটওয়ে সহ সাধারণ ই-কমার্স ওয়েবসাইট।",
    descAr: "متجر إلكتروني متكامل للعلامات التجارية مع بوابات دفع محلية متكاملة."
  },
  {
    id: "Blog and News Portal Build",
    label: "Blog and News Portal Build",
    labelBn: "ব্লগ ও নিউজ পোর্টাল ডেভেলপমেন্ট",
    labelAr: "بناء وتطوير بوابات الأخبار والمدونات",
    category: "Website Development",
    categoryBn: "ওয়েবসাইট তৈরি",
    categoryAr: "تطوير المواقع والمنصات",
    icon: BookOpen,
    desc: "High-traffic content publishing platform, breaking news ticker & category-based media management.",
    descBn: "হাই-ট্রাফিক কনটেন্ট পাবলিশিং প্ল্যাটফর্ম, ব্রেকিং নিউজ এবং ক্যাটাগরিভিত্তিক মিডিয়া ম্যানেজমেন্ট।",
    descAr: "منصة نشر محتوى سريعة فائقة الأداء مع شريط الأخبار العاجلة وإدارة الوسائط المتقدمة."
  },
  {
    id: "Personal & Agency Portfolio Website",
    label: "Personal & Agency Portfolio Website",
    labelBn: "পার্সোনাল ও এজেন্সি পোর্টফোলিও ওয়েবসাইট",
    labelAr: "موقع معرض أعمال شخصي وللوكالات",
    category: "Website Development",
    categoryBn: "ওয়েবসাইট তৈরি",
    categoryAr: "تطوير المواقع والمنصات",
    icon: Briefcase,
    desc: "High-end visual showcase for freelancers, creatives, and digital agencies.",
    descBn: "ফ্রিল্যান্সার, ক্রিয়েটিভ এবং ডিজিটাল এজেন্সির জন্য আকর্ষণীয় পোর্টফোলিও ওয়েবসাইট।",
    descAr: "معرض أعمال رقمي جذاب ومميز للمستقلين والمصممين والوكالات الرقمية."
  },
  {
    id: "Custom SaaS & Web Application",
    label: "Custom SaaS & Web Application",
    labelBn: "কাস্টম সাস ও ওয়েব অ্যাপ্লিকেশন",
    labelAr: "تطبيق ويب وساس سحابي مخصص",
    category: "Website Development",
    categoryBn: "ওয়েবসাইট তৈরি",
    categoryAr: "تطوير المواقع والمنصات",
    icon: Code2,
    desc: "Scalable cloud dashboard, multi-tenant portal, authentication, custom API & database workflows.",
    descBn: "স্কেলেবল ক্লাউড ড্যাশবোর্ড, মাল্টি-টেন্যান্ট পোর্টাল, অথেনটিকেশন এবং কাস্টম ডাটাবেস সিস্টেম।",
    descAr: "لوحة تحكم سحابية قابلة للتطوير، بوابات متعددة المستخدمين، وسير عمل برمجي وقواعد بيانات مخصصة."
  },
  {
    id: "Facebook Marketing",
    label: "Facebook Marketing",
    labelBn: "ফেসবুক মার্কেটিং",
    labelAr: "التسويق عبر فيسبوك",
    category: "Digital Marketing",
    categoryBn: "ডিজিটাল মার্কেটিং",
    categoryAr: "التسويق الرقمي والنمو",
    icon: TrendingUp,
    desc: "Targeted meta campaigns, pixel setups, custom lookalike audience scaling.",
    descBn: "টার্গেটেড মেটা ক্যাম্পেইন, পিক্সেল সেটআপ এবং কাস্টম অডিয়েন্স স্কেলিং।",
    descAr: "حملات إعلانية مستهدفة عبر ميتا، إعداد بكسل فيسبوك، وتوسيع نطاق الجماهير المشابهة."
  },
  {
    id: "YouTube Marketing",
    label: "YouTube Marketing",
    labelBn: "ইউটিউব মার্কেটিং",
    labelAr: "التسويق عبر يوتيوب",
    category: "Digital Marketing",
    categoryBn: "ডিজিটাল মার্কেটিং",
    categoryAr: "التسويق الرقمي والنمو",
    icon: PhoneCall,
    desc: "Video SEO optimizations, pre-roll campaigns, channel growth loops.",
    descBn: "ভিডিও এসইও অপ্টিমাইজেশন, প্রি-রোল ক্যাম্পেইন এবং চ্যানেল গ্রোথ সリューション।",
    descAr: "تحسين محركات البحث للفيديو، حملات إعلانات ما قبل التشغيل، وحلقات نمو القنوات."
  },
  {
    id: "Social media Profile Banding",
    label: "Social media Profile Banding",
    labelBn: "সোশ্যাল মিডিয়া প্রোফাইল ব্র্যান্ডিং",
    labelAr: "هوية الملفات الاجتماعية الاحترافية",
    category: "Digital Marketing",
    categoryBn: "ডিজিটাল মার্কেটিং",
    categoryAr: "التسويق الرقمي والنمو",
    icon: Heart,
    desc: "Stunning cohesive templates, logos, and cover assets for social profiles.",
    descBn: "সোশ্যাল প্রোফাইলের জন্য চমৎকার লোগো, কভার এবং ব্রান্ডিং অ্যাসেট।",
    descAr: "قوالب تصميم وشعارات وأغلفة احترافية متناسقة للملفات الاجتماعية المختلفة."
  },
  {
    id: "Google Business Profile Setup",
    label: "Google Business Profile Setup",
    labelBn: "গুগল বিজনেস প্রোফাইল সেটআপ",
    labelAr: "تأسيس وتنشيط حساب جوجل للأعمال",
    category: "Digital Marketing",
    categoryBn: "ডিজিটাল মার্কেটিং",
    categoryAr: "التسويق الرقمي والنمو",
    icon: Search,
    desc: "Map indexing, local citation optimization, reviews generation workflow.",
    descBn: "গুগল ম্যাপ ইনডেক্সিং, লোকাল সাইটেশন অপ্টিমাইজেশন এবং রিভিউ জেনারেটর।",
    descAr: "فهرسة الخرائط، تحسين الاستشهادات المحلية، وتهيئة مراجعات العملاء المحلية."
  },
  {
    id: "POS Solution",
    label: "POS Solution",
    labelBn: "পিওএস সলিউশন",
    labelAr: "نظام نقاط البيع وإدارة المخازن",
    category: "Software Solutions",
    categoryBn: "সফটওয়্যার সলিউশন",
    categoryAr: "البرمجيات الإدارية والحلول",
    icon: Sliders,
    desc: "Real-time stock tracking, barcoding, daily registers, and profit auditing.",
    descBn: "রিয়েল-টাইম স্টক ট্র্যাকিং, বারকোড স্ক্যানিং এবং দৈনিক হিসাব নিকাশ।",
    descAr: "تتبع المخزون في الوقت الفعلي، طباعة وتوليد الباركود، والتقارير المالية اليومية."
  },
  {
    id: "School Management Solution",
    label: "School Management Solution",
    labelBn: "স্কুল ম্যানেজমেন্ট সলিউশন",
    labelAr: "نظام إدارة المدارس والمؤسسات التعليمية",
    category: "Software Solutions",
    categoryBn: "সফটওয়্যার সリューション",
    categoryAr: "البرمجيات الإدارية والحلول",
    icon: CheckCircle2,
    desc: "Student databases, automated attendance logs, fees collect portals, dynamic grading.",
    descBn: "শিক্ষার্থী ডাটাবেস, স্বয়ংক্রিয় উপস্থিতি ট্র্যাকিং এবং ফি কালেকশন পোর্টাল।",
    descAr: "قاعدة بيانات الطلاب، سجل حضور ذكي، بوابة دفع الرسوم، ونظام الدرجات الديناميكي."
  },
  {
    id: "Logo and Banner Design",
    label: "Logo and Banner Design",
    labelBn: "লোগো এবং ব্যানার ডিজাইন",
    labelAr: "تصميم الشعارات واللافتات الإعلانية",
    category: "Graphic Design",
    categoryBn: "গ্রাফিক ডিজাইন",
    categoryAr: "التصميم الجرافيكي",
    icon: Palette,
    desc: "Professional custom logo, brand identity guidelines, and high-conversion web & print banner designs.",
    descBn: "প্রফেশনাল কাস্টম লোগো, ব্র্যান্ড আইডেন্টিটি গাইডলাইন এবং আকর্ষণীয় ওয়েব ও প্রিন্ট ব্যানার ডিজাইন।",
    descAr: "تصميم شعارات مخصصة واحترافية، وإرشادات الهوية البصرية، وتصميم اللافتات الإعلانية المطبوعة والرقمية."
  },
  {
    id: "YouTube / TikTok Intro video",
    label: "YouTube / TikTok Intro video",
    labelBn: "ইউটিউব / টিকটক ইন্ট্রো ভিডিও",
    labelAr: "فيديوهات مقدمة يوتيوب وتيك توك",
    category: "Digital Marketing",
    categoryBn: "ডিজিটাল মার্কেটিং",
    categoryAr: "التسويق الرقمي والنمو",
    icon: Video,
    desc: "Stunning high-impact intro videos, motion graphics, and reels tailored for YouTube & TikTok growth.",
    descBn: "ইউটিউব এবং টিকটক চ্যানেলের জন্য প্রিমিয়াম ইন্ট্রো ভিডিও, মোশন গ্রাফিক্স এবং আকর্ষণীয় রিলস ও শর্টস তৈরি।",
    descAr: "فيديوهات مقدمة مذهلة ومؤثرة، ورسوم متحركة (Motion Graphics)، ومقاطع قصيرة مصممة لنمو قنواتك."
  }
];

export const budgetOptions = [
  { 
    value: "Start 2k to 10k Min", 
    label: "Start 2k to 10k Min",
    labelBn: "স্টার্ট ২,০০০ টাকা - ১০,০০০ টাকা (Min)",
    badge: "Start",
    badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    description: "Ideal for small or simple projects",
    descriptionBn: "ছোট বা সাধারণ প্রজেক্টের জন্য উপযুক্ত"
  },
  { 
    value: "Pro 10k to 20k", 
    label: "Pro 10k to 20k",
    labelBn: "প্রো ১০,০০০ টাকা - ২০,০০০ টাকা",
    badge: "Pro",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    description: "Standard business website / portal",
    descriptionBn: "স্ট্যান্ডার্ড বিজনেস ওয়েবসাইট বা পোর্টাল"
  },
  { 
    value: "Business 20k to 50k Above", 
    label: "Business 20k to 50k Above",
    labelBn: "বিজনেস ২০,০০০ টাকা - ৫০,০০০ টাকা+",
    badge: "Business",
    badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    description: "Custom software & high-end solutions",
    descriptionBn: "কাস্টম সফটওয়্যার এবং হাই-এন্ড সলিউশন"
  }
];

export const parseBudgetToNumeric = (budgetStr: string): number => {
  if (!budgetStr) return 250;
  if (budgetStr.includes("Start")) return 5000;
  if (budgetStr.includes("Pro")) return 15000;
  if (budgetStr.includes("Business")) return 35000;
  const num = parseFloat(budgetStr);
  return isNaN(num) ? 250 : num;
};

export default function Services({ 
  user,
  language, 
  theme, 
  addSimulatedServiceOrder, 
  triggerToast,
  setCurrentPage,
  currency,
  currencySettings,
  isHomePage = false,
  addToCart,
  setCartOpen,
  wishlist = [],
  toggleWishlist
}: ServicesProps) {
  // Local catalog services state with localStorage persistence
  const [catalogServices, setCatalogServices] = useState<CatalogService[]>(() => {
    const cached = localStorage.getItem('webzone_services_catalog');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const merged = [...parsed];
        catalogServicesData.forEach(defaultSvc => {
          if (!merged.some(s => s.id === defaultSvc.id)) {
            merged.push(defaultSvc);
          }
        });
        return merged;
      } catch (e) {}
    }
    return catalogServicesData;
  });

  useEffect(() => {
    localStorage.setItem('webzone_services_catalog', JSON.stringify(catalogServices));
    const targetId = localStorage.getItem('webzone_target_service_details_id');
    if (targetId && catalogServices.length > 0) {
      const found = catalogServices.find(s => s.id === targetId);
      if (found) {
        setSelectedService(found);
      }
    }
  }, [catalogServices]);

  const [recentlyAddedWishlistId, setRecentlyAddedWishlistId] = useState<string | null>(null);

  // Session user check & admin detection with live synchronization
  const [sessionUser, setSessionUser] = useState<any>(() => {
    const userStr = localStorage.getItem('webzone_session_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {}
    }
    return null;
  });

  useEffect(() => {
    const syncUser = () => {
      const userStr = localStorage.getItem('webzone_session_user');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          // Only trigger state updates if value changed
          setSessionUser((prev: any) => {
            if (JSON.stringify(prev) !== userStr) {
              return parsed;
            }
            return prev;
          });
          return;
        } catch (e) {}
      }
      setSessionUser(null);
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    const interval = setInterval(syncUser, 1000); // 1-second dynamic poll for live sandbox role testing updates
    return () => {
      window.removeEventListener('storage', syncUser);
      clearInterval(interval);
    };
  }, []);

  const [openAdminPanel, setOpenAdminPanel] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<CatalogService | null>(null);
  const [openServiceActionId, setOpenServiceActionId] = useState<string | null>(null);

  const isAdmin = sessionUser && (sessionUser.role === 'super_admin' || sessionUser.role === 'admin');

  // Dynamic Categories Sync with localStorage 'webzone_store_categories'
  const [categoriesList, setCategoriesList] = useState<any[]>(() => {
    return horizontalCategories;
  });

  useEffect(() => {
    const storeCatsStr = localStorage.getItem('webzone_store_categories');
    if (storeCatsStr) {
      try {
        const storeCats = JSON.parse(storeCatsStr);
        if (Array.isArray(storeCats) && storeCats.length > 0) {
          const merged = [...horizontalCategories];
          storeCats.forEach((sc: any) => {
            const exists = merged.some(m => m.id === sc.id);
            if (!exists) {
              merged.push({
                id: sc.id,
                label: sc.name || sc.label,
                bn: sc.nameBn || sc.bn || sc.name,
                ar: sc.nameAr || sc.ar || sc.name,
                icon: Globe
              });
            } else {
              const idx = merged.findIndex(m => m.id === sc.id);
              merged[idx] = {
                ...merged[idx],
                label: sc.name || merged[idx].label,
                bn: sc.nameBn || merged[idx].bn || sc.bn,
                ar: sc.nameAr || merged[idx].ar || sc.ar
              };
            }
          });
          setCategoriesList(merged);
        }
      } catch (e) {
        console.error("Local categories sync error:", e);
      }
    }
  }, [openAdminPanel]);

  // Form State
  const initialFormState = {
    title: '',
    titleBn: '',
    titleAr: '',
    category: 'website-development',
    categoryBn: 'ওয়েবসাইট ডেভেলপমেন্ট',
    categoryAr: 'تطوير المواقع',
    startingPrice: 199,
    starterPrice: 150,
    businessPrice: 199,
    enterprisePrice: 399,
    projectBudgetCategory: '100-500' as const,
    deliveryDays: 7,
    deliveryTimelineCategory: '7-days' as const,
    serviceLevel: 'Business' as const,
    serviceLevelBn: 'বিজনেস',
    serviceLevelAr: 'أعمال',
    rating: 4.9,
    projectsCompleted: 24,
    technologies: '',
    thumbnail: '',
    image: '',
    shortDescription: '',
    shortDescriptionBn: '',
    shortDescriptionAr: '',
    fullDescription: '',
    fullDescriptionBn: '',
    fullDescriptionAr: '',
    features: '',
    featuresBn: '',
    featuresAr: '',
    views: 120,
    likes: 45
  };

  const [serviceForm, setServiceForm] = useState(initialFormState);
  const [newFeatureText, setNewFeatureText] = useState('');

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.shortDescription) {
      triggerToast(language === 'bn' ? "দয়া করে শিরোনাম এবং সংক্ষিপ্ত বিবরণ প্রদান করুন!" : "Please provide a title and short description!");
      return;
    }

    const techArray = serviceForm.technologies ? serviceForm.technologies.split(',').map(s => s.trim()).filter(Boolean) : ['React', 'TailwindCSS'];
    const featuresArray = serviceForm.features ? serviceForm.features.split(',').map(s => s.trim()).filter(Boolean) : ['Custom Layout design', 'Fast Page Load Speed'];
    const featuresBnArray = featuresArray;
    const featuresArArray = serviceForm.featuresAr ? serviceForm.featuresAr.split(',').map(s => s.trim()).filter(Boolean) : ['لوحات تحكم تفاعلية', 'تحميل سريع'];

    // Auto localized category based on mapping using live categoriesList
    const catObj = categoriesList.find(c => c.id === serviceForm.category);
    const resolvedCatBn = catObj ? catObj.bn : serviceForm.categoryBn;
    const resolvedCatAr = catObj ? catObj.ar : serviceForm.categoryAr;

    const resolvedLvlBn = serviceForm.serviceLevel === 'Starter' ? 'স্টার্টার' : serviceForm.serviceLevel === 'Business' ? 'বিজনেস' : 'এন্টারপ্রাইজ';
    const resolvedLvlAr = serviceForm.serviceLevel === 'Starter' ? 'مبتدئ' : serviceForm.serviceLevel === 'Business' ? 'أعمال' : 'مؤسسات';

    const defaultImg = serviceForm.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

    if (editingService) {
      const updated = catalogServices.map(srv => srv.id === editingService.id ? {
        ...srv,
        title: serviceForm.title,
        titleBn: serviceForm.title,
        titleAr: serviceForm.titleAr || serviceForm.title,
        category: serviceForm.category,
        categoryBn: resolvedCatBn,
        categoryAr: resolvedCatAr,
        projectBudgetCategory: serviceForm.projectBudgetCategory,
        deliveryDays: Number(serviceForm.deliveryDays) || 7,
        deliveryTimelineCategory: serviceForm.deliveryTimelineCategory,
        serviceLevel: serviceForm.serviceLevel,
        serviceLevelBn: resolvedLvlBn,
        serviceLevelAr: resolvedLvlAr,
        startingPrice: Number(serviceForm.startingPrice) || 199,
        starterPrice: Number(serviceForm.starterPrice) || Math.round((Number(serviceForm.startingPrice) || 199) * 0.8),
        businessPrice: Number(serviceForm.businessPrice) || Number(serviceForm.startingPrice) || 199,
        enterprisePrice: Number(serviceForm.enterprisePrice) || Math.round((Number(serviceForm.startingPrice) || 199) * 2.1),
        rating: Number(serviceForm.rating) || 4.9,
        projectsCompleted: Number(serviceForm.projectsCompleted) || 24,
        technologies: techArray,
        thumbnail: defaultImg,
        image: defaultImg,
        shortDescription: serviceForm.shortDescription,
        shortDescriptionBn: serviceForm.shortDescription,
        shortDescriptionAr: serviceForm.shortDescriptionAr || serviceForm.shortDescription,
        fullDescription: serviceForm.fullDescription || serviceForm.shortDescription,
        fullDescriptionBn: serviceForm.fullDescription || serviceForm.shortDescription,
        fullDescriptionAr: serviceForm.fullDescriptionAr || serviceForm.shortDescriptionAr || serviceForm.shortDescription,
        features: featuresArray,
        featuresBn: featuresBnArray,
        featuresAr: featuresArArray,
        views: Number(serviceForm.views) || srv.views || 100,
        likes: Number(serviceForm.likes) || srv.likes || 35
      } as CatalogService : srv);

      setCatalogServices(updated);
      setEditingService(null);
      triggerToast(language === 'bn' ? "✅ কাস্টম সার্ভিস সফলভাবে আপডেট করা হয়েছে!" : "✅ Custom Service updated successfully!");
    } else {
      const newId = `srv-cms-${Date.now()}`;
      const newSrv: CatalogService = {
        id: newId,
        title: serviceForm.title,
        titleBn: serviceForm.title,
        titleAr: serviceForm.titleAr || serviceForm.title,
        iconName: 'Globe',
        category: serviceForm.category,
        categoryBn: resolvedCatBn,
        categoryAr: resolvedCatAr,
        projectBudgetCategory: serviceForm.projectBudgetCategory,
        deliveryDays: Number(serviceForm.deliveryDays) || 7,
        deliveryTimelineCategory: serviceForm.deliveryTimelineCategory,
        serviceLevel: serviceForm.serviceLevel,
        serviceLevelBn: resolvedLvlBn,
        serviceLevelAr: resolvedLvlAr,
        startingPrice: Number(serviceForm.startingPrice) || 199,
        starterPrice: Number(serviceForm.starterPrice) || Math.round((Number(serviceForm.startingPrice) || 199) * 0.8),
        businessPrice: Number(serviceForm.businessPrice) || Number(serviceForm.startingPrice) || 199,
        enterprisePrice: Number(serviceForm.enterprisePrice) || Math.round((Number(serviceForm.startingPrice) || 199) * 2.1),
        rating: Number(serviceForm.rating) || 4.9,
        projectsCompleted: Number(serviceForm.projectsCompleted) || 24,
        technologies: techArray,
        thumbnail: defaultImg,
        image: defaultImg,
        shortDescription: serviceForm.shortDescription,
        shortDescriptionBn: serviceForm.shortDescription,
        shortDescriptionAr: serviceForm.shortDescriptionAr || serviceForm.shortDescription,
        fullDescription: serviceForm.fullDescription || serviceForm.shortDescription,
        fullDescriptionBn: serviceForm.fullDescription || serviceForm.shortDescription,
        fullDescriptionAr: serviceForm.fullDescriptionAr || serviceForm.shortDescriptionAr || serviceForm.shortDescription,
        features: featuresArray,
        featuresBn: featuresBnArray,
        featuresAr: featuresArArray,
        views: Number(serviceForm.views) || Math.floor(Math.random() * 150) + 50,
        likes: Number(serviceForm.likes) || Math.floor(Math.random() * 40) + 12
      };

      setCatalogServices([newSrv, ...catalogServices]);
      triggerToast(language === 'bn' ? "✅ নতুন কাস্টম সার্ভিস যোগ করা হয়েছে!" : "✅ New Custom Service added successfully!");
    }

    setServiceForm(initialFormState);
  };

  const handleEditServiceClick = (srv: CatalogService) => {
    setEditingService(srv);
    setServiceForm({
      title: srv.title,
      titleBn: srv.titleBn || '',
      titleAr: srv.titleAr || '',
      category: srv.category,
      categoryBn: srv.categoryBn || '',
      categoryAr: srv.categoryAr || '',
      startingPrice: srv.startingPrice,
      starterPrice: srv.starterPrice || Math.round(srv.startingPrice * 0.8),
      businessPrice: srv.businessPrice || srv.startingPrice || 199,
      enterprisePrice: srv.enterprisePrice || Math.round(srv.startingPrice * 2.1),
      projectBudgetCategory: srv.projectBudgetCategory || '100-500',
      deliveryDays: srv.deliveryDays || 7,
      deliveryTimelineCategory: srv.deliveryTimelineCategory || '7-days',
      serviceLevel: srv.serviceLevel || 'Business',
      serviceLevelBn: srv.serviceLevelBn || '',
      serviceLevelAr: srv.serviceLevelAr || '',
      rating: srv.rating || 4.9,
      projectsCompleted: srv.projectsCompleted || 24,
      technologies: srv.technologies ? srv.technologies.join(', ') : '',
      thumbnail: srv.thumbnail || '',
      image: srv.image || '',
      shortDescription: srv.shortDescription || '',
      shortDescriptionBn: srv.shortDescriptionBn || '',
      shortDescriptionAr: srv.shortDescriptionAr || '',
      fullDescription: srv.fullDescription || '',
      fullDescriptionBn: srv.fullDescriptionBn || '',
      fullDescriptionAr: srv.fullDescriptionAr || '',
      features: srv.features ? srv.features.join(', ') : '',
      featuresBn: srv.featuresBn ? srv.featuresBn.join(', ') : '',
      featuresAr: srv.featuresAr ? srv.featuresAr.join(', ') : '',
      views: srv.views || 120,
      likes: srv.likes || 45
    });
    // Scroll form into view
    const element = document.getElementById('admin-cms-control-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm(language === 'bn' ? "আপনি কি নিশ্চিত যে আপনি এই সার্ভিসটি ডিলিট করতে চান?" : "Are you sure you want to delete this service?")) {
      setCatalogServices(catalogServices.filter(s => s.id !== id));
      triggerToast(language === 'bn' ? "🗑️ সার্ভিসটি ডিলিট করা হয়েছে!" : "🗑️ Service deleted successfully!");
    }
  };


  // Navigation tabs state
  const [activeTab, setActiveTab ] = useState<'all-services' | 'custom-services' | 'fixed-packages' | 'google-business' | 'growth-package' | 'digital-web-dev'>(
    isHomePage ? 'digital-web-dev' : 'all-services'
  );
  
  // Custom Services filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Interactive Custom Project Estimator in All Custom Services
  const [customEstCategory, setCustomEstCategory] = useState<'website' | 'ecommerce' | 'blog' | 'portfolio' | 'custom_app' | 'pos'>('website');
  const [customEstCompanyCategory, setCustomEstCompanyCategory] = useState<string>('Startup');
  const [isEstCompanyCategoryOpen, setIsEstCompanyCategoryOpen] = useState<boolean>(false);
  const [estCompanyCategorySearch, setEstCompanyCategorySearch] = useState<string>('');
  const [companyCategoryError, setCompanyCategoryError] = useState<boolean>(false);
  const estCompanyCategoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (estCompanyCategoryDropdownRef.current && !estCompanyCategoryDropdownRef.current.contains(event.target as Node)) {
        setIsEstCompanyCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [customEstScale, setCustomEstScale] = useState<'starter' | 'business' | 'enterprise'>('business');
  const [customEstPages, setCustomEstPages] = useState<number>(5);
  const [customEstTimelineDays, setCustomEstTimelineDays] = useState<number>(14);
  const [customEstFeatures, setCustomEstFeatures] = useState<string[]>(['payment_gateway', 'admin_panel', 'mobile_friendly']);
  const [highlightedEstStep, setHighlightedEstStep] = useState<string | null>(null);

  // Estimator Service Requirements states (matching WhatsApp Order Modal's design & behavior)
  const [estReqSearch, setEstReqSearch] = useState<string>('');
  const [estSelectedReqCategory, setEstSelectedReqCategory] = useState<string>('all');
  const [estSelectedReqsByCategory, setEstSelectedReqsByCategory] = useState<{[category: string]: string}>({
    "Website Development": "Professional Business Website"
  });

  const getTimelineTierInfo = (days: number) => {
    if (days <= 9) {
      return {
        tier: 'fast',
        multiplier: 1.15,
        labelEn: '🚀 Fast Track Sprint',
        labelBn: '🚀 ফাস্ট ট্র্যাক স্প্রিন্ট',
        tag: '7-9 Days (Accelerated)',
        surchargePct: '+15%',
        descEn: '+15% Accelerated Delivery Surcharge',
        descBn: '+১৫% দ্রুত ডেলিভারি ফি',
        badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 ring-1 ring-amber-500/20'
      };
    } else if (days <= 18) {
      return {
        tier: 'standard',
        multiplier: 1.00,
        labelEn: '🛡️ Standard Regular Pace',
        labelBn: '🛡️ স্ট্যান্ডার্ড ডেলিভারি পেস',
        tag: '10-18 Days (Standard)',
        surchargePct: '0%',
        descEn: 'Standard Regular Delivery (Optimal Balanced Cadence)',
        descBn: 'স্ট্যান্ডার্ড বেসলাইন ডেলিভারি (নরমাল অপটিমাল শিডিউল)',
        badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 ring-1 ring-emerald-500/20'
      };
    } else {
      return {
        tier: 'flexible',
        multiplier: 0.95,
        labelEn: '🌿 Flexible Extended Pace',
        labelBn: '🌿 ফ্লেক্সিবল রিল্যাক্সড পেস',
        tag: '19-30 Days (Flexible)',
        surchargePct: '-5%',
        descEn: '-5% Budget Saver Discount (Relaxed Timeline)',
        descBn: '-৫% বাজেট সেভার ডিসকাউন্ট (রিল্যাক্সড শিডিউল)',
        badgeColor: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30 ring-1 ring-teal-500/20'
      };
    }
  };

  const handleSelectCompanyCategory = (catItem: CompanyCategoryItem) => {
    setCustomEstCompanyCategory(catItem.name);
    setOrderCompanyCategory(catItem.name);
    setIsEstCompanyCategoryOpen(false);
    setCompanyCategoryError(false);
    setEstCompanyCategorySearch('');
    // Suggest recommended features if applicable
    if (catItem.recommendedFeatures && catItem.recommendedFeatures.length > 0) {
      setCustomEstFeatures(prev => Array.from(new Set([...prev, ...catItem.recommendedFeatures])));
    }

    // Auto-scroll and smooth transition to focus the UI on the next required input field (Project Domain)
    setTimeout(() => {
      const nextStepElem = document.getElementById('custom-est-step-domain');
      if (nextStepElem) {
        nextStepElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setHighlightedEstStep('domain');
        const firstBtn = nextStepElem.querySelector('button');
        if (firstBtn) {
          (firstBtn as HTMLElement).focus({ preventScroll: true });
        }
        setTimeout(() => {
          setHighlightedEstStep(null);
        }, 2200);
      }
    }, 120);
  };

  const getCustomEstimatedPrice = () => {
    // 1. Calculate price from chosen service requirements in estimator if any
    const chosenReqsPrice = (Object.values(estSelectedReqsByCategory) as string[]).reduce((sum: number, itemId: string) => {
      return sum + (serviceRequirementsPrices[itemId] || 0);
    }, 0);

    let basePrice = chosenReqsPrice > 0 ? chosenReqsPrice : 99;
    if (chosenReqsPrice === 0) {
      if (customEstCategory === 'website') basePrice = 149;
      else if (customEstCategory === 'ecommerce') basePrice = 199;
      else if (customEstCategory === 'blog') basePrice = 119;
      else if (customEstCategory === 'portfolio') basePrice = 99;
      else if (customEstCategory === 'custom_app') basePrice = 269;
      else if (customEstCategory === 'pos') basePrice = 249;
    }

    // Apply industry company category multiplier
    const matchedCategory = COMPANY_CATEGORIES.find(c => c.name === customEstCompanyCategory || c.nameBn === customEstCompanyCategory || c.id === customEstCompanyCategory);
    if (matchedCategory) {
      basePrice *= matchedCategory.multiplier;
    }

    if (customEstScale === 'starter') basePrice *= 0.8;
    else if (customEstScale === 'enterprise') basePrice *= 1.8;

    basePrice += Math.max(0, customEstPages - 3) * 15;

    if (customEstFeatures.includes('payment_gateway')) basePrice += 40;
    if (customEstFeatures.includes('admin_panel')) basePrice += 50;
    if (customEstFeatures.includes('multi_language')) basePrice += 35;
    if (customEstFeatures.includes('seo_setup')) basePrice += 30;
    if (customEstFeatures.includes('cloud_hosting')) basePrice += 45;
    if (customEstFeatures.includes('custom_api')) basePrice += 60;

    const timelineInfo = getTimelineTierInfo(customEstTimelineDays);
    basePrice *= timelineInfo.multiplier;

    return Math.round(basePrice);
  };

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
    'under-100': { en: "Under 1,000 to 5,000 BDT", bn: "Under 1,000 থেকে 5,000 টাকা" },
    '100-500': { en: "5,000 to 10,000 BDT", bn: "৫,০০০ থেকে ১০,০০০ টাকা" },
    '500-1000': { en: "10,000 to 30,000 BDT", bn: "১০,০০০ থেকে ৩০,০০০ টাকা" },
    '1000-plus': { en: "30,000 to 50,000 BDT or more", bn: "৩০,০০০ থেকে ৫০,০০০ টাকা থেকে বেশি" }
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
      localStorage.removeItem('webzone_target_service_details_id');
      return;
    }
    setSelectedService(srv);
    localStorage.setItem('webzone_target_service_details_id', srv.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Quick View Modal
  const [quickViewService, setQuickViewService] = useState<CatalogService | null>(null);

  // Unified WhatsApp Order & Inquiry System Modal States
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRedirectingToWhatsApp, setIsRedirectingToWhatsApp] = useState(false);
  const [isBudgetDropdownOpen, setIsBudgetDropdownOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successInquiryId, setSuccessInquiryId] = useState('');
  const [successServiceName, setSuccessServiceName] = useState('');
  const [successPackageName, setSuccessPackageName] = useState('');
  const [successRequirements, setSuccessRequirements] = useState<string[]>([]);
  const [successCustomerName, setSuccessCustomerName] = useState('');
  const [successBudget, setSuccessBudget] = useState('');
  const [successWaMessage, setSuccessWaMessage] = useState('');
  const [successRequirementsPrice, setSuccessRequirementsPrice] = useState(0);
  const [orderServiceName, setOrderServiceName] = useState('');
  const [orderPackageName, setOrderPackageName] = useState('Standard');
  const [orderServiceRequirement, setOrderServiceRequirement] = useState('');
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderMobileNumber, setOrderMobileNumber] = useState('');
  const [orderWhatsAppNumber, setOrderWhatsAppNumber] = useState('');
  const [orderEmailAddress, setOrderEmailAddress] = useState('');
  const [orderCompanyName, setOrderCompanyName] = useState('');
  const [orderCompanyCategory, setOrderCompanyCategory] = useState<string>('Startup');
  const [isOrderCompanyCategoryOpen, setIsOrderCompanyCategoryOpen] = useState<boolean>(false);
  const [orderCompanyCategorySearch, setOrderCompanyCategorySearch] = useState<string>('');
  const orderCompanyCategoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orderCompanyCategoryDropdownRef.current && !orderCompanyCategoryDropdownRef.current.contains(event.target as Node)) {
        setIsOrderCompanyCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [orderBudget, setOrderBudget] = useState('');
  const [orderProjectDetails, setOrderProjectDetails] = useState('');
  const [orderIsWhatsAppRedirect, setOrderIsWhatsAppRedirect] = useState(true);
  const [orderAdvancePercent, setOrderAdvancePercent] = useState<number>(30); // 30, 50, or 100
  const [orderAddonModules, setOrderAddonModules] = useState<string[]>([]);
  const [activeAddonTooltip, setActiveAddonTooltip] = useState<string | null>(null);
  const [activeEstimatorAddonTooltip, setActiveEstimatorAddonTooltip] = useState<string | null>(null);
  
  // Dispatch custom events when order modal opens or closes, so other widgets can hide/show
  useEffect(() => {
    if (isOrderModalOpen) {
      window.dispatchEvent(new CustomEvent('whatsapp_order_modal_opened'));
    } else {
      setActiveAddonTooltip(null);
      window.dispatchEvent(new CustomEvent('whatsapp_order_modal_closed'));
    }
    return () => {
      window.dispatchEvent(new CustomEvent('whatsapp_order_modal_closed'));
    };
  }, [isOrderModalOpen]);
  
  // Track if any popup/modal is active on the page to hide elements
  const [isAnyPopupActive, setIsAnyPopupActive] = useState(false);

  useEffect(() => {
    const checkPopups = () => {
      const hasCart = document.getElementById('shopping-cart-slideover-panel');
      const hasOrderModal = document.getElementById('wbd-whatsapp-order-modal');
      const hasAuth = document.getElementById('auth-popup-container');
      const hasSuccess = document.getElementById('congratulations-success-popup');
      
      setIsAnyPopupActive(!!(hasCart || hasOrderModal || hasAuth || hasSuccess || isOrderModalOpen));
    };

    checkPopups();

    window.addEventListener('wbd_popup_changed', checkPopups);
    window.addEventListener('whatsapp_order_modal_opened', checkPopups);
    window.addEventListener('whatsapp_order_modal_closed', checkPopups);
    
    const interval = setInterval(checkPopups, 300);

    return () => {
      window.removeEventListener('wbd_popup_changed', checkPopups);
      window.removeEventListener('whatsapp_order_modal_opened', checkPopups);
      window.removeEventListener('whatsapp_order_modal_closed', checkPopups);
      clearInterval(interval);
    };
  }, [isOrderModalOpen]);

  const [requirementSearch, setRequirementSearch] = useState('');
  const [selectedReqCategory, setSelectedReqCategory] = useState('all');
  const [selectedReqsByCategory, setSelectedReqsByCategory] = useState<{[category: string]: string}>({});

  useEffect(() => {
    const selectedItems = Object.entries(selectedReqsByCategory)
      .filter(([_, itemId]) => itemId !== '')
      .map(([category, itemId]) => {
        const item = serviceRequirementsList.find(r => r.id === itemId);
        if (item) {
          const localizedLabel = language === 'bn' ? item.labelBn : language === 'ar' ? item.labelAr : item.label;
          return `${category}: ${localizedLabel}`;
        }
        return null;
      })
      .filter(Boolean) as string[];

    const addonNames = orderAddonModules.map(addonId => {
      const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
      return item ? (language === 'bn' ? item.bn : item.label) : addonId;
    });

    const combined = [...selectedItems];
    if (addonNames.length > 0) {
      combined.push(`${language === 'bn' ? 'কাস্টম অ্যাডঅন' : 'Custom Addons'}: ${addonNames.join(', ')}`);
    }

    setOrderServiceRequirement(combined.join(' | '));
  }, [selectedReqsByCategory, orderAddonModules, language]);

  // Custom project specification form state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [whatsappRipples, setWhatsappRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Pre-computes automated real-time preview of the WhatsApp message content
  const getWhatsAppPreviewMessage = () => {
    const formattedRequirements = orderServiceRequirement
      ? orderServiceRequirement.split(' | ').map(req => `  - ${req}`).join('\n')
      : 'N/A';

    const totalChosenReqsPriceUsd = (Object.values(selectedReqsByCategory) as string[]).reduce((sum: number, itemId: string) => {
      return sum + (serviceRequirementsPrices[itemId] || 0);
    }, 0);

    const totalAddonsPriceUsd = orderAddonModules.reduce((sum: number, addonId: string) => {
      const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
      return sum + (item ? item.priceNum : 0);
    }, 0);

    const hasSelectedItems = (Object.keys(selectedReqsByCategory).length > 0 && totalChosenReqsPriceUsd > 0) || totalAddonsPriceUsd > 0;
    const basePrice = hasSelectedItems ? (totalChosenReqsPriceUsd + totalAddonsPriceUsd) : 0;

    const formattedAddons = orderAddonModules.length > 0
      ? orderAddonModules.map(addonId => {
          const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
          return item ? `  - ${item.label} (${item.price})` : '';
        }).filter(Boolean).join('\n')
      : (language === 'bn' ? 'কোনো অ্যাডঅন নেই' : 'None');

    const formatAmount = (usdValue: number) => {
      if (currency === 'BDT') {
        return `৳${Math.round(usdValue * 115).toLocaleString()}`;
      } else if (currency === 'SAR') {
        return `${Math.round(usdValue * 3.75).toLocaleString()} SAR`;
      } else {
        return `$${usdValue.toLocaleString()}`;
      }
    };

    const totalReqsCostString = formatAmount(basePrice);
    const advancePayableString = formatAmount(Math.round((basePrice * orderAdvancePercent) / 100));

    return `New Service Inquiry\n\n` +
      `• Service Name: ${orderServiceName || 'N/A'}\n` +
      `• Package: ${orderPackageName || 'Standard'}\n` +
      `• Selected Requirements:\n${formattedRequirements}\n` +
      `• Custom Addon Modules:\n${formattedAddons}\n` +
      `• Total Price: ${totalReqsCostString}\n` +
      `• Escrow Advance: ${orderAdvancePercent}%\n` +
      `• Advance Payable: ${advancePayableString}\n` +
      `• Customer Name: ${orderCustomerName || 'N/A'}\n` +
      `• Mobile Number: ${orderMobileNumber || 'N/A'}\n` +
      `• WhatsApp Number: ${orderWhatsAppNumber || orderMobileNumber || 'N/A'}\n` +
      `• Email Address: ${orderEmailAddress || 'N/A'}\n` +
      `• Company Name: ${orderCompanyName || 'N/A'}\n` +
      `• Company Category: ${orderCompanyCategory || customEstCompanyCategory || 'N/A'}\n` +
      `• Budget: ${orderBudget || 'N/A'}\n` +
      `• Project Details: ${orderProjectDetails || 'N/A'}`;
  };

  const handleWhatsappClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Coordinate-based ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setWhatsappRipples((prev) => [...prev, newRipple]);
    
    // Original WhatsApp/Inquiry modal click behavior
    handleOpenOrderModal('General Service / Custom Solution', 'Standard', true);
  };

  const handleWhatsappRippleEnd = (id: number) => {
    setWhatsappRipples((prev) => prev.filter((r) => r.id !== id));
  };
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [quoteBudgetRange, setQuoteBudgetRange] = useState('500-1000');

  // Global window event listener to trigger WhatsApp Order Modal from other components (like bottom mobile menu)
  useEffect(() => {
    const handleOpenModalEvent = () => {
      handleOpenOrderModal('General Service / Custom Solution', 'Standard', true);
    };
    window.addEventListener('open_whatsapp_order_modal', handleOpenModalEvent);
    return () => {
      window.removeEventListener('open_whatsapp_order_modal', handleOpenModalEvent);
    };
  }, []);

  // Autofill order modal forms if the user is authenticated (Customer login website a login kora thakle -automatically Real data full name, phone number, and email address, company name filup hobe)
  useEffect(() => {
    if (user) {
      if (isOrderModalOpen) {
        if (user.name) setOrderCustomerName(user.name);
        if (user.phone) {
          setOrderMobileNumber(user.phone);
          if (!orderWhatsAppNumber) {
            setOrderWhatsAppNumber(user.phone);
          }
        }
        if (user.email) setOrderEmailAddress(user.email);
        if (user.companyName) setOrderCompanyName(user.companyName);
      }
      if (isQuoteModalOpen) {
        if (user.name) setQuoteName(user.name);
        if (user.phone) setQuotePhone(user.phone);
        if (user.email) setQuoteEmail(user.email);
      }
    }
  }, [isOrderModalOpen, isQuoteModalOpen, user]);

  const handleOrderModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderServiceName || !orderCustomerName || !orderMobileNumber || !orderServiceRequirement) {
      triggerToast(language === 'bn' ? 'অনুগ্রহ করে সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন!' : 'Please fill all required fields!');
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const cleanDate = timestamp.split('T')[0];
      const inquirySeq = Math.floor(100000 + Math.random() * 900000);
      const inquiryId = `INQ-${inquirySeq}`;
      const orderId = `ORD-${inquirySeq}`;
      const leadId = `LD-${inquirySeq}`;
      const whatsappLeadId = `WAL-${inquirySeq}`;

      // 1. Prepare Inquiry payload
      const inquiryPayload = {
        id: inquiryId,
        serviceName: orderServiceName,
        packageName: orderPackageName || 'Standard',
        serviceRequirement: orderServiceRequirement,
        addonModules: orderAddonModules,
        customerName: orderCustomerName,
        mobileNumber: orderMobileNumber,
        whatsappNumber: orderWhatsAppNumber || orderMobileNumber,
        emailAddress: orderEmailAddress || '',
        companyName: orderCompanyName || '',
        companyCategory: orderCompanyCategory || customEstCompanyCategory || 'Startup',
        budget: orderBudget || '',
        projectDetails: orderProjectDetails || '',
        advancePercent: orderAdvancePercent,
        createdAt: timestamp,
        status: 'New Lead'
      };

      // 2. Prepare Order payload
      const orderPayload = {
        id: orderId,
        serviceName: orderServiceName,
        packageName: orderPackageName || 'Standard',
        serviceRequirement: orderServiceRequirement,
        addonModules: orderAddonModules,
        customerName: orderCustomerName,
        mobileNumber: orderMobileNumber,
        companyName: orderCompanyName || '',
        companyCategory: orderCompanyCategory || customEstCompanyCategory || 'Startup',
        advancePercent: orderAdvancePercent,
        createdAt: timestamp
      };

      // 3. Prepare Service Lead payload
      const leadPayload = {
        id: leadId,
        name: orderCustomerName,
        phone: orderMobileNumber,
        email: orderEmailAddress || '',
        createdAt: timestamp
      };

      // 4. Prepare WhatsApp Lead payload
      const whatsappLeadPayload = {
        id: whatsappLeadId,
        name: orderCustomerName,
        phone: orderMobileNumber,
        whatsapp: orderWhatsAppNumber || orderMobileNumber,
        createdAt: timestamp
      };

      // Write to Firestore resiliently
      try {
        await Promise.allSettled([
          setDoc(doc(db, 'service_inquiries', inquiryId), inquiryPayload),
          setDoc(doc(db, 'service_orders', orderId), orderPayload),
          setDoc(doc(db, 'service_leads', leadId), leadPayload),
          setDoc(doc(db, 'whatsapp_leads', whatsappLeadId), whatsappLeadPayload)
        ]);
      } catch (fireErr) {
        console.info('Firestore inquiry/order sync in local resilient mode:', fireErr);
      }

      // Save to Admin WhatsApp Service Orders List and Contacts in localStorage
      try {
        const existingWaOrdersLocal = localStorage.getItem('wa_service_orders');
        let waOrdersList = [];
        if (existingWaOrdersLocal) {
          try {
            waOrdersList = JSON.parse(existingWaOrdersLocal);
          } catch (e) {
            waOrdersList = [];
          }
        } else {
          waOrdersList = [
            {
              id: 'WSO-9201',
              customerName: 'Imran Hasan',
              whatsappNumber: '+8801712345678',
              serviceName: 'E-commerce Website Design',
              price: 450,
              status: 'processing',
              date: '2026-07-08',
              customFields: [
                { label: 'Business Domain', value: 'bengalmart.com' },
                { label: 'Color Preference', value: 'Midnight Blue & Gold' },
                { label: 'Features Required', value: 'Bkash Payment Gateway, SMS Notifications' }
              ]
            },
            {
              id: 'WSO-8392',
              customerName: 'Sajid Rahman',
              whatsappNumber: '+8801811223344',
              serviceName: 'SEO Optimization Pack',
              price: 150,
              status: 'pending',
              date: '2026-07-09',
              customFields: [
                { label: 'Target Keywords', value: 'software development bd, tech firm dhaka' },
                { label: 'Competitor URL', value: 'https://competitor.bd' }
              ]
            },
            {
              id: 'WSO-7462',
              customerName: 'Anika Tabassum',
              whatsappNumber: '+8801912998877',
              serviceName: 'Social Media Management',
              price: 280,
              status: 'completed',
              date: '2026-07-05',
              customFields: [
                { label: 'Page Handle', value: '@anika_boutique_bd' },
                { label: 'Post Frequency', value: '3 times a week' }
              ]
            }
          ];
        }

        // Calculate total chosen requirements and addon modules price
        const totalChosenReqsPriceUsd = (Object.values(selectedReqsByCategory) as string[]).reduce((sum: number, itemId: string) => {
          return sum + (serviceRequirementsPrices[itemId] || 0);
        }, 0);

        const totalAddonsPriceUsd = orderAddonModules.reduce((sum: number, addonId: string) => {
          const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
          return sum + (item ? item.priceNum : 0);
        }, 0);

        const hasSelectedItems = (Object.keys(selectedReqsByCategory).length > 0 && totalChosenReqsPriceUsd > 0) || totalAddonsPriceUsd > 0;
        const finalCalculatedPriceUsd = hasSelectedItems ? (totalChosenReqsPriceUsd + totalAddonsPriceUsd) : 0;

        const newWaOrder = {
          id: `WSO-${inquirySeq}`,
          customerName: orderCustomerName,
          whatsappNumber: orderWhatsAppNumber || orderMobileNumber,
          serviceName: `${orderServiceName} (${orderPackageName || 'Standard'})`,
          price: finalCalculatedPriceUsd,
          status: 'pending',
          date: cleanDate,
          customFields: [
            { label: 'Requirement', value: orderServiceRequirement || 'N/A' },
            { label: 'Escrow Advance', value: `${orderAdvancePercent}%` },
            { label: 'Company Category', value: orderCompanyCategory || customEstCompanyCategory || 'Startup' },
            { label: 'Company Name', value: orderCompanyName || 'N/A' },
            { label: 'Project Details', value: orderProjectDetails || 'N/A' },
            { label: 'Email Address', value: orderEmailAddress || 'N/A' }
          ]
        };

        waOrdersList.unshift(newWaOrder);
        localStorage.setItem('wa_service_orders', JSON.stringify(waOrdersList));
        window.dispatchEvent(new Event('wa_orders_updated'));

        // Save to customer contacts as well
        const existingContactsLocal = localStorage.getItem('wa_customer_contacts');
        let waContactsList = [];
        if (existingContactsLocal) {
          try {
            waContactsList = JSON.parse(existingContactsLocal);
          } catch (e) {
            waContactsList = [];
          }
        } else {
          waContactsList = [
            { id: 'C-01', name: 'Imran Hasan', whatsappNumber: '+8801712345678', isVerified: true, status: 'active', group: 'VIP Customers', email: 'imran@webzone.com' },
            { id: 'C-02', name: 'Sajid Rahman', whatsappNumber: '+8801811223344', isVerified: true, status: 'active', group: 'Regular', email: 'sajid@gmail.com' },
            { id: 'C-03', name: 'Anika Tabassum', whatsappNumber: '+8801912998877', isVerified: false, status: 'active', group: 'Regular', email: 'anika@boutique.com' },
            { id: 'C-04', name: 'Sabbir Ahmed', whatsappNumber: '+8801511224455', isVerified: true, status: 'inactive', group: 'Corporate Clients', email: 'sabbir@agency.com' },
            { id: 'C-05', name: 'Rakibul Islam', whatsappNumber: '+8801711223344', isVerified: false, status: 'active', group: 'Regular', email: 'rakib@gmail.com' },
            { id: 'C-06', name: 'Zeeshan Karim', whatsappNumber: '+8801311122233', isVerified: true, status: 'active', group: 'Corporate Clients', email: 'zeeshan@holding.com' }
          ];
        }

        const targetContactNumber = orderWhatsAppNumber || orderMobileNumber;
        if (!waContactsList.some((c: any) => c.whatsappNumber === targetContactNumber)) {
          waContactsList.unshift({
            id: `C-${inquirySeq.toString().slice(-2)}`,
            name: orderCustomerName,
            whatsappNumber: targetContactNumber,
            isVerified: true,
            status: 'active',
            group: 'Regular',
            email: orderEmailAddress || ''
          });
          localStorage.setItem('wa_customer_contacts', JSON.stringify(waContactsList));
        }

        // Dispatch storage event so active Admin panel tabs sync in real time!
        window.dispatchEvent(new Event('storage'));
      } catch (storageError) {
        console.error("Local storage sync error", storageError);
      }

      // Calculate total chosen requirements and addon modules price
      const totalChosenReqsPriceUsd = (Object.values(selectedReqsByCategory) as string[]).reduce((sum: number, itemId: string) => {
        return sum + (serviceRequirementsPrices[itemId] || 0);
      }, 0);

      const totalAddonsPriceUsd = orderAddonModules.reduce((sum: number, addonId: string) => {
        const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
        return sum + (item ? item.priceNum : 0);
      }, 0);

      const hasSelectedItems = (Object.keys(selectedReqsByCategory).length > 0 && totalChosenReqsPriceUsd > 0) || totalAddonsPriceUsd > 0;
      const finalCalculatedPriceUsd = hasSelectedItems ? (totalChosenReqsPriceUsd + totalAddonsPriceUsd) : 0;

      // Add to simulated orders/leads
      addSimulatedServiceOrder({
        id: orderId,
        serviceId: selectedService?.id || 'custom',
        itemTitle: `${orderServiceName} - ${orderPackageName} (WhatsApp Lead)`,
        price: finalCalculatedPriceUsd,
        date: cleanDate,
        paymentMethod: "WhatsApp Order Direct",
        paymentStatus: 'pending',
        customerName: orderCustomerName,
        customerPhone: orderMobileNumber,
        customerEmail: orderEmailAddress,
        companyName: orderCompanyName,
        companyCategory: orderCompanyCategory || customEstCompanyCategory || 'Startup'
      });

      // Show Toast Notification
      triggerToast(language === 'bn'
        ? `অর্ডারটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে! (Inquiry ID: ${inquiryId})`
        : `Order successfully saved to Firestore! (Inquiry ID: ${inquiryId})`);

      // Generate automatic WhatsApp message template
      const formattedRequirements = orderServiceRequirement
        ? orderServiceRequirement.split(' | ').map(req => `  - ${req}`).join('\n')
        : 'N/A';

      const formattedAddons = orderAddonModules.length > 0
        ? orderAddonModules.map(addonId => {
            const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
            return item ? `  - ${item.label} (${item.price})` : '';
          }).filter(Boolean).join('\n')
        : (language === 'bn' ? 'কোনো অ্যাডঅন নেই' : 'None');

      const totalReqsCostString = formatPrice(finalCalculatedPriceUsd);
      const advancePayableString = formatPrice(Math.round((finalCalculatedPriceUsd * orderAdvancePercent) / 100));

      const waMessage = `New Service Inquiry\n\n` +
        `• Service Name: ${orderServiceName}\n` +
        `• Package: ${orderPackageName || 'Standard'}\n` +
        `• Selected Requirements:\n${formattedRequirements}\n` +
        `• Custom Addon Modules:\n${formattedAddons}\n` +
        `• Total Project Price: ${totalReqsCostString}\n` +
        `• Escrow Advance: ${orderAdvancePercent}%\n` +
        `• Advance Payable: ${advancePayableString}\n` +
        `• Customer Name: ${orderCustomerName}\n` +
        `• Mobile Number: ${orderMobileNumber}\n` +
        `• WhatsApp Number: ${orderWhatsAppNumber || orderMobileNumber}\n` +
        `• Email Address: ${orderEmailAddress || 'N/A'}\n` +
        `• Company Name: ${orderCompanyName || 'N/A'}\n` +
        `• Company Category: ${orderCompanyCategory || customEstCompanyCategory || 'N/A'}\n` +
        `• Budget: ${orderBudget || 'N/A'}\n` +
        `• Project Details: ${orderProjectDetails || 'N/A'}`;

      // Open Success Congratulations Popup
      setSuccessInquiryId(inquiryId);
      setSuccessServiceName(orderServiceName);
      setSuccessPackageName(orderPackageName || 'Standard');
      setSuccessRequirements(orderServiceRequirement ? orderServiceRequirement.split(' | ') : []);
      setSuccessCustomerName(orderCustomerName);
      setSuccessBudget(orderBudget || 'N/A');
      setSuccessWaMessage(waMessage);
      setSuccessRequirementsPrice(finalCalculatedPriceUsd);

      setIsOrderModalOpen(false); // Close the input modal
      setIsSuccessPopupOpen(true); // Open the congratulations success modal

      // Clear states after submission
      setOrderServiceRequirement('');
      setSelectedReqsByCategory({});
      setOrderAddonModules([]);
      setOrderCustomerName('');
      setOrderMobileNumber('');
      setOrderWhatsAppNumber('');
      setOrderEmailAddress('');
      setOrderCompanyName('');
      setOrderBudget('');
      setOrderProjectDetails('');
    } catch (error) {
      console.error("Firestore saving error", error);
      triggerToast(`Error saving inquiry: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleOpenOrderModal = (
    serviceName: string, 
    packageName: string = 'Standard', 
    isWhatsApp: boolean = true,
    explicitCategory?: string,
    explicitRequirement?: string,
    explicitAddons?: string[]
  ) => {
    setOrderServiceName(serviceName);
    setOrderPackageName(packageName);
    setOrderIsWhatsAppRedirect(isWhatsApp);
    if (explicitAddons !== undefined) {
      setOrderAddonModules(explicitAddons);
    } else {
      setOrderAddonModules([]);
    }
    
    // If explicitCategory provided, set the category tab inside the modal
    if (explicitCategory) {
      setSelectedReqCategory(explicitCategory);
    } else {
      setSelectedReqCategory('all');
    }

    // Only pre-populate requirement if explicitRequirement was strictly provided (e.g. from configured cost estimator)
    // When no services products or custom addons are selected, Total Project Price stays at 0 until user selects
    if (explicitRequirement) {
      setOrderServiceRequirement(explicitRequirement);
      const matchedItem = serviceRequirementsList.find(item => 
        item.id.toLowerCase().includes(explicitRequirement.toLowerCase()) ||
        item.label.toLowerCase().includes(explicitRequirement.toLowerCase()) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(explicitRequirement.toLowerCase()))
      );
      if (matchedItem) {
        setSelectedReqsByCategory({ [matchedItem.category]: matchedItem.id });
        if (!explicitCategory) {
          setSelectedReqCategory(matchedItem.category);
        }
      } else {
        setSelectedReqsByCategory({});
      }
    } else {
      // Clean slate: Total Project Price remains 0 until services products or addons are selected
      setOrderServiceRequirement('');
      setSelectedReqsByCategory({});
    }
    
    setIsOrderModalOpen(true);
  };

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
        const matched = catalogServices.find(s => s.id === target);
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
        if (updated === 'catalog' || updated === 'all' || updated === 'all-services') {
          setActiveTab('all-services');
        } else if (updated === 'custom-services' || updated === 'custom') {
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

  const renderPrice = (usdAmount: number, className = "") => {
    return (
      <motion.span
        key={currency}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`inline-block ${className}`}
      >
        {formatPrice(usdAmount)}
      </motion.span>
    );
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
  const filteredCatalogServices = catalogServices.filter(srv => {
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
        const matches = srv.category === "custom-development" || srv.category === "business-software" || srv.category === "whmcs-solutions" || srv.category === "mobile-app-development";
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
    handleOpenOrderModal(pkg.name, pkg.tier.toUpperCase(), true);
  };

  return (
    <section className={`${selectedService ? 'pt-1 pb-8 md:pt-1.5 md:pb-14' : 'pt-4 pb-8 md:pt-7 md:pb-14'} max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 ${selectedService ? 'space-y-4' : 'space-y-6'}`}>
      
      {/* 1. HOME PAGE SERVICES SECTION (Top Cards + Tailored Categories ONLY) */}
      {!selectedService && isHomePage && (
        <div className="space-y-10 sm:space-y-14 animate-in fade-in duration-300">
          {/* Header */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black font-mono tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/20 uppercase shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{language === 'bn' ? 'ওয়েবজোনবিডি প্রিমিয়াম সার্ভিস ইকোসিস্টেম' : language === 'ar' ? 'منظومة خدمات وحلول ويب زون المتقدمة' : 'WebzoneBD Premium Service Ecosystem'}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight font-display">
              {language === 'bn' ? 'আমাদের প্রিমিয়াম সার্ভিস ও বিশেষায়িত ক্যাটাগরি' : language === 'ar' ? 'خدماتنا المميزة وفئاتنا المتخصصة' : 'Top Services & Tailored Categories'}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {language === 'bn' 
                ? 'আপনার ব্যবসার প্রয়োজনে দ্রুত শুরু করতে নিচের জনপ্রিয় সার্ভিস বা বিশেষায়িত ক্যাটাগরি থেকে পছন্দের সেবাটি নির্বাচন করুন।' 
                : language === 'ar'
                  ? 'اختر الخدمة المناسبة لعملك من الفئات المتخصصة أدناه للبدء السريع في رحلة التحول الرقمي.'
                  : 'Select a fast-launch solution below or explore our tailored digital categories engineered for modern business scale.'}
            </p>
          </div>

          {/* Top Fast Launch Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-7xl mx-auto text-left">
            {/* Card 1: Custom Project Cost Estimator */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="relative group overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 border-2 border-emerald-500/50 dark:bg-slate-900/95 dark:hover:bg-slate-850 dark:border-emerald-500/60 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/25 flex flex-col justify-between text-left transition-all duration-300"
            >
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent pointer-events-none z-10" />

              <div 
                onClick={() => {
                  localStorage.setItem('webzone_target_services_tab', 'custom-services');
                  setActiveTab('custom-services');
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => {
                    document.getElementById('custom-estimator-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-emerald-400/40 animate-ping opacity-60 pointer-events-none" />
                  <div className="relative p-2.5 sm:p-3 bg-emerald-500 group-hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Sliders className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                      {language === 'bn' ? "কাস্টম কস্ট এস্টিমেটর" : "Custom Cost Estimator"}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      {language === 'bn' ? "লাইভ" : "LIVE"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-600 dark:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                    {language === 'bn' ? "লাইভ বাজেট ক্যালকুলেটর" : "Instant budget & project specs"}
                  </p>
                </div>
              </div>

              {/* Direct 'Book Service' Button */}
              <div className="mt-3 pt-2.5 border-t border-emerald-500/20 dark:border-emerald-500/20 flex items-center justify-between w-full">
                <button
                  type="button"
                  id="home-top-card-book-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenOrderModal(
                      language === 'bn' ? "কাস্টম প্রজেক্ট ও সফটওয়্যার ডেভেলপমেন্ট" : "Custom Software & Web Development",
                      "Custom Scope",
                      true,
                      "Software Solutions",
                      "Custom SaaS & Web Application"
                    );
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'bn' ? 'বুক সার্ভিস' : 'Book Service'}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 2: Digital Web Development */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="relative group overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-white/90 hover:bg-blue-50/40 border-2 border-neutral-200/90 dark:bg-slate-900/95 dark:hover:bg-blue-950/30 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-cyan-400 shadow-lg shadow-neutral-200/50 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/20 flex flex-col justify-between text-left transition-all duration-300"
            >
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-blue-400/20 dark:via-cyan-400/15 to-transparent pointer-events-none z-10" />

              <div 
                onClick={() => {
                  localStorage.setItem('webzone_target_services_tab', 'digital-web-dev');
                  setActiveTab('digital-web-dev');
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-blue-400/30 animate-pulse opacity-50 pointer-events-none" />
                  <div className="relative p-2.5 sm:p-3 bg-blue-500/15 group-hover:bg-blue-600 rounded-xl text-blue-600 dark:text-cyan-400 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:rotate-12">
                    <Globe className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 truncate">
                      {language === 'bn' ? "ডিজিটাল ওয়েব ডেভেলপমেন্ট" : "Digital Web Development"}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-blue-500/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30 inline-flex items-center gap-1 shrink-0">
                      {language === 'bn' ? "জনপ্রিয়" : "POPULAR"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'bn' ? "স্টার্টআপ ও কর্পোরেট ব্যবসার জন্য ওয়েব অ্যাপ" : "Premium startup & corporate web apps"}
                  </p>
                </div>
              </div>

              {/* Direct 'Book Service' Button */}
              <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/70 flex items-center justify-between w-full">
                <button
                  type="button"
                  id="home-top-card-book-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenOrderModal(
                      language === 'bn' ? "ডিজিটাল ওয়েব ডেভেলপমেন্ট" : "Digital Web Development",
                      "Standard Web Package",
                      true,
                      "Website Development",
                      "Professional Business Website"
                    );
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'bn' ? 'বুক সার্ভিস' : 'Book Service'}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 3: Google Business Setup */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="relative group overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-white/90 hover:bg-amber-50/40 border-2 border-neutral-200/90 dark:bg-slate-900/95 dark:hover:bg-amber-950/30 dark:border-neutral-800 hover:border-amber-500 dark:hover:border-amber-400 shadow-lg shadow-neutral-200/50 dark:shadow-none hover:shadow-xl hover:shadow-amber-500/20 flex flex-col justify-between text-left transition-all duration-300"
            >
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-amber-400/20 dark:via-amber-400/15 to-transparent pointer-events-none z-10" />

              <div 
                onClick={() => {
                  localStorage.setItem('webzone_target_services_tab', 'google-business');
                  setActiveTab('google-business');
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-amber-400/30 animate-pulse opacity-50 pointer-events-none" />
                  <div className="relative p-2.5 sm:p-3 bg-amber-500/15 group-hover:bg-amber-500 rounded-xl text-amber-600 dark:text-amber-400 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                    <CheckCircle className="w-4 h-4 sm:w-5 h-5" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                      {language === 'bn' ? "গুগল বিজনেস সেটআপ" : "Google Business Setup"}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 inline-flex items-center gap-1 shrink-0">
                      ⭐ {language === 'bn' ? "ভেরিফাইড" : "VERIFIED"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'bn' ? "ভেরিফাইড গুগল বিজনেস ও ম্যাপ সেটআপ" : "Verified Google Business profile & map"}
                  </p>
                </div>
              </div>

              {/* Direct 'Book Service' Button */}
              <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/70 flex items-center justify-between w-full">
                <button
                  type="button"
                  id="home-top-card-book-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenOrderModal(
                      language === 'bn' ? "গুগল বিজনেস প্রোফাইল সেটআপ" : "Google Business Setup",
                      "Verified Setup",
                      true,
                      "Digital Marketing",
                      "Google Business Profile Setup"
                    );
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'bn' ? 'বুক সার্ভিস' : 'Book Service'}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 4: Business Growth Packages */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="relative group overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-white/90 hover:bg-purple-50/40 border-2 border-neutral-200/90 dark:bg-slate-900/95 dark:hover:bg-purple-950/30 dark:border-neutral-800 hover:border-purple-500 dark:hover:border-purple-400 shadow-lg shadow-neutral-200/50 dark:shadow-none hover:shadow-xl hover:shadow-purple-500/20 flex flex-col justify-between text-left transition-all duration-300"
            >
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-purple-400/20 dark:via-purple-400/15 to-transparent pointer-events-none z-10" />

              <div 
                onClick={() => {
                  localStorage.setItem('webzone_target_services_tab', 'growth-package');
                  setActiveTab('growth-package');
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-purple-400/30 animate-pulse opacity-50 pointer-events-none" />
                  <div className="relative p-2.5 sm:p-3 bg-purple-500/15 group-hover:bg-purple-600 rounded-xl text-purple-600 dark:text-purple-400 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:-rotate-6">
                    <TrendingUp className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                      {language === 'bn' ? "বিজনেস গ্রোথ প্যাকেজস" : "Business Growth Packages"}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 inline-flex items-center gap-1 shrink-0">
                      🚀 {language === 'bn' ? "গ্রোথ" : "BOOST"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'bn' ? "ব্যবসা দ্রুত বৃদ্ধি করার আল্টিমেট প্যাকেজ" : "Full-suite digital growth & marketing"}
                  </p>
                </div>
              </div>

              {/* Direct 'Book Service' Button */}
              <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/70 flex items-center justify-between w-full">
                <button
                  type="button"
                  id="home-top-card-book-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenOrderModal(
                      language === 'bn' ? "বিজনেস গ্রোথ মার্কেটিং প্যাকেজ" : "Business Growth Packages",
                      "Growth Boost",
                      true,
                      "Digital Marketing",
                      "Facebook Marketing"
                    );
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'bn' ? 'বুক সার্ভিস' : 'Book Service'}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* TAILORED CATEGORIES SECTION */}
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-neutral-200/80 dark:border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-ping inline-block" />
                  <h3 className="text-lg sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                    {language === 'bn' ? 'টেইলর্ড ও বিশেষায়িত সার্ভিস ক্যাটাগরি' : language === 'ar' ? 'الفئات المصممة خصيصاً لاحتياجاتك' : 'Tailored Service Categories'}
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
                  {language === 'bn' 
                    ? 'আপনার প্রজেক্টের নির্দিষ্ট ক্যাটাগরিতে ক্লিক করে পূর্ণাঙ্গ সার্ভিস তালিকা ও প্যাকেজ দেখুন।' 
                    : 'Click any tailored domain below to explore deep service packages, pricing, and specs.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 cursor-pointer group"
              >
                <span>{language === 'bn' ? 'সব ক্যাটাগরি ব্রাউজ করুন' : 'Browse All Categories'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Grid of Tailored Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {tailoredCategoriesList.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'google-business') {
                        localStorage.setItem('webzone_target_services_tab', 'google-business');
                        setActiveTab('google-business');
                      } else {
                        localStorage.setItem('webzone_target_services_tab', 'catalog');
                        setActiveTab('custom-services');
                        setActiveCategoryFilter(cat.id);
                      }
                      setCurrentPage('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative group rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-b ${cat.gradient} bg-white dark:bg-slate-900/90 border border-neutral-200/90 dark:border-slate-800 ${cat.borderHover} transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-2xl cursor-pointer flex flex-col justify-between text-left`}
                  >
                    <div>
                      {/* Top Row: Icon & Pill Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className={`p-3 rounded-2xl ${cat.iconBg} group-hover:scale-110 transition-transform`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${cat.badgeColor}`}>
                          {language === 'bn' ? cat.badgeBn : cat.badge}
                        </span>
                      </div>

                      {/* Category Title & Count */}
                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                            {language === 'bn' ? cat.titleBn : language === 'ar' ? cat.titleAr : cat.title}
                          </h4>
                        </div>
                        <span className="inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {language === 'bn' ? cat.countBn : cat.count}
                        </span>
                        <p className="text-xs text-neutral-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                          {language === 'bn' ? cat.descBn : language === 'ar' ? cat.descAr : cat.desc}
                        </p>
                      </div>

                      {/* Tech & Feature Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3.5">
                        {cat.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-200/60 dark:border-slate-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-5 mt-4 border-t border-neutral-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-400 dark:text-slate-400 block uppercase font-bold tracking-wider">
                          {language === 'bn' ? 'শুরু মাত্র' : 'Starting at'}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">
                          {language === 'bn' ? cat.startingPriceBn : cat.startingPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenOrderModal(cat.title, 'Standard', true);
                          }}
                          title="WhatsApp Inquiry"
                          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 group-hover:bg-blue-600 dark:bg-white/10 dark:group-hover:bg-cyan-500 text-white dark:text-white dark:group-hover:text-neutral-950 text-xs font-bold transition-all">
                          <span>{language === 'bn' ? 'দেখুন' : 'Explore'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Explorer CTA Banner */}
          <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white overflow-hidden shadow-2xl text-left">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/15 backdrop-blur-md uppercase tracking-wider text-cyan-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কাস্টম রিকোয়ারমেন্টস ও কনসালটেশন' : 'Enterprise Consultation & Full Catalog'}</span>
                </span>
                <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                  {language === 'bn' 
                    ? 'আপনার প্রজেক্টের জন্য বিশেষায়িত ডিজিটাল সলিউশন খুঁজছেন?' 
                    : 'Looking for a Bespoke Custom Architecture or Deep Package?'}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
                  {language === 'bn'
                    ? 'আমাদের ৫০+ প্রিমিয়াম সার্ভিস ক্যাটালগ ও ফিক্সড প্রাইস প্যাকেজ ব্রাউজ করুন অথবা সরাসরি হোয়াটসঅ্যাপে কথা বলুন।'
                    : 'Explore all 50+ custom services, fixed-price gig matrices, and technical architectures in our dedicated services portal.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setCurrentPage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white hover:bg-cyan-50 text-neutral-900 rounded-xl text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2 group"
                >
                  <span>{language === 'bn' ? 'পূর্ণাঙ্গ সার্ভিস পেজ দেখুন' : 'Explore Full Services Catalog'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleOpenOrderModal('General Consultation', 'Standard', true)}
                  className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'WhatsApp Chat'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SERVICES PAGE HERO SECTION (Ultra-Premium Modern Tech Hero with Futuristic Dynamic Visual Architecture) */}
      {!selectedService && !isHomePage && (
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative max-w-[1360px] mx-auto rounded-3xl bg-white/80 dark:bg-slate-950/85 backdrop-blur-2xl text-neutral-900 border border-neutral-200/90 dark:border-cyan-500/25 p-6 sm:p-10 md:p-14 overflow-hidden shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.1)] group"
        >
          {/* Animated Hero Top Edge Traveling Shimmer Beam */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] overflow-hidden pointer-events-none z-20">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 dark:via-cyan-300 to-transparent animate-hero-top-beam blur-[0.5px]" />
          </div>

          {/* Futuristic Cyber Corner Accents with pulsing neon glow */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/80 rounded-tl-3xl pointer-events-none z-10 animate-pulse" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500/80 rounded-tr-3xl pointer-events-none z-10 animate-pulse" style={{ animationDelay: '0.6s' }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/80 rounded-bl-3xl pointer-events-none z-10 animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500/80 rounded-br-3xl pointer-events-none z-10 animate-pulse" style={{ animationDelay: '1.8s' }} />

          {/* Service-Themed Animated Background Layer */}
          <ServicesHeroBgAnimation language={language as 'en' | 'bn' | 'ar'} />
          
          <div className="relative z-10 max-w-6xl text-center mx-auto space-y-6 sm:space-y-7 pt-4 sm:pt-6">
            {/* Eyebrow Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black font-mono tracking-wider text-indigo-700 bg-indigo-100/80 border border-indigo-300/70 dark:text-cyan-300 dark:bg-cyan-950/60 dark:border-cyan-500/40 uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
              <span>{language === 'bn' ? 'ওয়েবজোনবিডি এন্টারপ্রাইজ সার্ভিসেস ও ক্লাউড আর্কিটেকচার ২০২৬' : 'WebzoneBD Enterprise IT Services & Cloud Architecture 2026'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />
            </span>
            
            {/* Display Headline */}
            <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15] text-neutral-900 dark:text-white">
              {language === 'bn' 
                ? "আপনার ব্যবসাকে দিন নতুন গতি ও আধুনিক ডিজিটাল সক্ষমতা"
                : "Empowering Your Business with Enterprise-Grade Digital Services"}
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans">
              {language === 'bn'
                ? "কাস্টম সফটওয়্যার, হাই-স্পিড ওয়েবসাইট, ভেরিফাইড গুগল বিজনেস সেটআপ এবং আল্টিমেট গ্রোথ প্যাকেজ—আপনার স্বপ্নের প্রজেক্ট তৈরি করুন সহজে।"
                : "Choose a custom enterprise engineering project, launch rapid business setups, or purchase fixed-price packages for guaranteed results."}
            </p>

            {/* Trust Metrics Pill Strip (Interactive Animated Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-4xl mx-auto pt-1 text-left">
              <motion.div 
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-neutral-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-cyan-500/50 transition-all cursor-default group/trust"
              >
                <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover/trust:scale-125 group-hover/trust:rotate-6">🏆</span>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>500+ Projects</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-slate-400 font-mono">99.8% Success Rate</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-neutral-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all cursor-default group/trust"
              >
                <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover/trust:scale-125 group-hover/trust:-rotate-6">⚡</span>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>3-7 Days Delivery</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-slate-400 font-mono">Agile Sprints & SLA</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-neutral-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all cursor-default group/trust"
              >
                <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover/trust:scale-125 group-hover/trust:rotate-6">🛡️</span>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>100% Code Quality</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-slate-400 font-mono">Zero-Defect Standard</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-neutral-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all cursor-default group/trust"
              >
                <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover/trust:scale-125 group-hover/trust:-rotate-6">💬</span>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>24/7 VIP Support</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-slate-400 font-mono">Direct WhatsApp Link</div>
                </div>
              </motion.div>
            </div>

            {/* Live Interactive Search Box with Trending Pills */}
            <div className="max-w-[920px] mx-auto pt-2 space-y-3">
              <div className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-neutral-300/90 dark:border-cyan-500/30 p-2 sm:p-2.5 flex items-center shadow-xl focus-within:border-cyan-500 dark:focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 dark:focus-within:ring-cyan-400/30 transition-all">
                <Search className="w-5 h-5 text-neutral-400 dark:text-cyan-400 ml-2.5 sm:ml-3 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' 
                    ? "সফটওয়্যার, এসইও, লারাভেল, হোস্টিং, ওয়ার্ডপ্রেস, মেটা অ্যাডস বা ই-কমার্স খুঁজুন..." 
                    : "Search web development, SEO, Laravel, cloud hosting, marketing, POS software..."}
                  className="w-full bg-transparent border-0 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-400 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 focus:outline-none focus:ring-0 font-sans"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Trending Quick Search Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px]">
                <span className="text-neutral-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] mr-1 font-mono">
                  {language === 'bn' ? 'জনপ্রিয়:' : 'Trending:'}
                </span>
                {[
                  { label: '🌐 Web Development', query: 'Web' },
                  { label: '🛒 E-Commerce Store', query: 'Ecommerce' },
                  { label: '📍 Google Maps', query: 'Google' },
                  { label: '📈 Meta Ads', query: 'Marketing' },
                  { label: '💻 POS Software', query: 'Software' },
                  { label: '🎨 Graphic Design', query: 'Design' },
                  { label: '☁️ WHMCS', query: 'WHMCS' }
                ].map((chip, chipIdx) => (
                  <button
                    key={chipIdx}
                    type="button"
                    onClick={() => setSearchQuery(chip.query)}
                    className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-neutral-200/90 dark:border-cyan-500/20 text-neutral-700 dark:text-slate-200 font-semibold cursor-pointer transition-all hover:scale-105 shadow-xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fast Launch Route Buttons (Top Cards for Services Page with Dynamic Animated Effects) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-6xl mx-auto pt-4 text-left">
              {/* Card 1: Custom Project Cost Estimator */}
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                onClick={() => {
                  setActiveTab('custom-services');
                  setTimeout(() => {
                    document.getElementById('custom-estimator-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="relative group overflow-hidden p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 border-2 border-emerald-500/50 dark:bg-slate-900/95 dark:hover:bg-slate-850 dark:border-emerald-500/60 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/25 flex flex-col justify-between text-left transition-all duration-300 cursor-pointer select-none"
              >
                {/* Top Accent Gradient Border Beam */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />
                
                {/* Diagonal Light Sheen Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent pointer-events-none z-10" />

                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/40 animate-ping opacity-60 pointer-events-none" />
                    <div className="relative p-2.5 sm:p-3 bg-emerald-500 group-hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Sliders className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {language === 'bn' ? "কাস্টম প্রজেক্ট কস্ট এস্টিমেটর" : "Custom Project Cost Estimator"}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        {language === 'bn' ? "লাইভ" : "LIVE"}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-neutral-600 dark:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                      {language === 'bn' ? "লাইভ বাজেট হিসাব ও রিকোয়ারমেন্ট পাঠান" : "Calculate instant budget & send specs"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-emerald-500/20 dark:border-emerald-500/20 flex items-center justify-between w-full text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <span>{language === 'bn' ? 'এস্টিমেটর দেখুন' : 'Explore Estimator'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              {/* Card 2: Digital Web Development */}
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                onClick={() => {
                  setActiveTab('digital-web-dev');
                  setTimeout(() => {
                    document.getElementById('services-tabs-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`relative group overflow-hidden p-4 sm:p-4.5 rounded-2xl shadow-lg flex flex-col justify-between text-left transition-all duration-300 cursor-pointer select-none ${
                  activeTab === 'digital-web-dev'
                    ? 'bg-blue-500/15 border-2 border-blue-500/90 dark:bg-blue-950/50 dark:border-blue-500 shadow-blue-500/20'
                    : 'bg-white/90 hover:bg-blue-50/40 border-2 border-neutral-200/90 dark:bg-slate-900/95 dark:hover:bg-blue-950/30 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-cyan-400 shadow-neutral-200/50 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/20'
                }`}
              >
                {/* Top Accent Gradient Border Beam */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Diagonal Light Sheen Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-blue-400/20 dark:via-cyan-400/15 to-transparent pointer-events-none z-10" />

                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <span className="absolute inset-0 rounded-xl bg-blue-400/30 animate-pulse opacity-50 pointer-events-none" />
                    <div className="relative p-2.5 sm:p-3 bg-blue-500/15 group-hover:bg-blue-600 rounded-xl text-blue-600 dark:text-cyan-400 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:rotate-12">
                      <Globe className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 truncate">
                        {language === 'bn' ? "ডিজিটাল ওয়েব ডেভেলপমেন্ট" : "Digital Web Development"}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-blue-500/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30 inline-flex items-center gap-1 shrink-0">
                        {language === 'bn' ? "জনপ্রিয়" : "POPULAR"}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {language === 'bn' ? "স্টার্টআপ ও কর্পোরেট ওয়েব অ্যাপ" : "Premium startup & corporate web apps"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/70 flex items-center justify-between w-full text-blue-600 dark:text-cyan-400 text-xs font-bold">
                  <span>{language === 'bn' ? 'প্যাকেজসমূহ দেখুন' : 'Explore Packages'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              {/* Card 3: Google Business Setup */}
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                onClick={() => {
                  setActiveTab('google-business');
                  setTimeout(() => {
                    document.getElementById('services-tabs-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`relative group overflow-hidden p-4 sm:p-4.5 rounded-2xl shadow-lg flex flex-col justify-between text-left transition-all duration-300 cursor-pointer select-none ${
                  activeTab === 'google-business'
                    ? 'bg-amber-500/15 border-2 border-amber-500/90 dark:bg-amber-950/50 dark:border-amber-500 shadow-amber-500/20'
                    : 'bg-white/90 hover:bg-amber-50/40 border-2 border-neutral-200/90 dark:bg-slate-900/95 dark:hover:bg-amber-950/30 dark:border-neutral-800 hover:border-amber-500 dark:hover:border-amber-400 shadow-neutral-200/50 dark:shadow-none hover:shadow-xl hover:shadow-amber-500/20'
                }`}
              >
                {/* Top Accent Gradient Border Beam */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Diagonal Light Sheen Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-amber-400/20 dark:via-amber-400/15 to-transparent pointer-events-none z-10" />

                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <span className="absolute inset-0 rounded-xl bg-amber-400/30 animate-pulse opacity-50 pointer-events-none" />
                    <div className="relative p-2.5 sm:p-3 bg-amber-500/15 group-hover:bg-amber-500 rounded-xl text-amber-600 dark:text-amber-400 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                      <CheckCircle className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                        {language === 'bn' ? "গুগল বিজনেস সেটআপ" : "Google Business Setup"}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 inline-flex items-center gap-1 shrink-0">
                        ⭐ {language === 'bn' ? "ভেরিফাইড" : "VERIFIED"}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {language === 'bn' ? "ভেরিফাইড গুগল বিজনেস ও ম্যাপ" : "Verified Google Business profile map"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/70 flex items-center justify-between w-full text-amber-600 dark:text-amber-400 text-xs font-bold">
                  <span>{language === 'bn' ? 'সেটআপ দেখুন' : 'Explore Setup'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              {/* Card 4: Business Growth Packages */}
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                onClick={() => {
                  setActiveTab('growth-package');
                  setTimeout(() => {
                    document.getElementById('services-tabs-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`relative group overflow-hidden p-4 sm:p-4.5 rounded-2xl shadow-lg flex flex-col justify-between text-left transition-all duration-300 cursor-pointer select-none ${
                  activeTab === 'growth-package'
                    ? 'bg-purple-500/15 border-2 border-purple-500/90 dark:bg-purple-950/50 dark:border-purple-500 shadow-purple-500/20'
                    : 'bg-white/90 hover:bg-purple-50/40 border-2 border-neutral-200/90 dark:bg-slate-900/95 dark:hover:bg-purple-950/30 dark:border-neutral-800 hover:border-purple-500 dark:hover:border-purple-400 shadow-neutral-200/50 dark:shadow-none hover:shadow-xl hover:shadow-purple-500/20'
                }`}
              >
                {/* Top Accent Gradient Border Beam */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Diagonal Light Sheen Shimmer Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-purple-400/20 dark:via-purple-400/15 to-transparent pointer-events-none z-10" />

                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <span className="absolute inset-0 rounded-xl bg-purple-400/30 animate-pulse opacity-50 pointer-events-none" />
                    <div className="relative p-2.5 sm:p-3 bg-purple-500/15 group-hover:bg-purple-600 rounded-xl text-purple-600 dark:text-purple-400 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:-rotate-6">
                      <TrendingUp className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                        {language === 'bn' ? "বিজনেস গ্রোথ প্যাকেজস" : "Business Growth Packages"}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 inline-flex items-center gap-1 shrink-0">
                        🚀 {language === 'bn' ? "গ্রোথ" : "BOOST"}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {language === 'bn' ? "ব্যবসা বৃদ্ধির মার্কেটিং প্যাকেজ" : "Full-suite digital optimization & growth"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/70 flex items-center justify-between w-full text-purple-600 dark:text-purple-400 text-xs font-bold">
                  <span>{language === 'bn' ? 'গ্রোথ প্ল্যান দেখুন' : 'Explore Plans'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Anchor point to snap view */}
      <div id="services-tabs-anchor" />

      {/* 🛠️ SERVICES ADMIN CONTROL SWITCH */}
      {!selectedService && isAdmin && (
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-end gap-2 text-left">
          <button
            onClick={() => {
              setOpenAdminPanel(prev => !prev);
            }}
            className="px-4.5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-650/20 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
            id="services-admin-trigger-btn"
          >
            <Sliders className="w-4 h-4 animate-spin-slow" />
            <span>{language === 'bn' ? 'সার্ভিস এডমিন প্যানেল 🛠️' : 'Services Admin Mode 🛠️'}</span>
          </button>
        </div>
      )}

      {/* 🛠️ SERVICES ADMIN PANEL CONTAINER */}
      {!selectedService && isAdmin && openAdminPanel && (
        <div
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
          id="admin-cms-control-panel"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border-2 border-indigo-500/20 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-slate-800 pb-4 text-left">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-450 flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  <span>{language === 'bn' ? 'ওয়েবজোনবিডি সার্ভিস সিএমএস প্যানেল' : 'WebzoneBD Services CMS Terminal'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dynamic Content Management System (CMS) connected to Services Database</p>
              </div>
              <button
                onClick={() => setOpenAdminPanel(false)}
                className="p-1 px-3 bg-slate-100 dark:bg-slate-800 text-slate-705 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-500 hover:text-white transition"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close Workspace'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Side */}
              <div className="lg:col-span-5 p-5 bg-neutral-50 dark:bg-slate-900/40 rounded-2xl border border-slate-205 dark:border-slate-800/80 space-y-4">
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider text-left">
                  {editingService ? (language === 'bn' ? "সার্ভিস এডিট করুন" : "Edit Service Details") : (language === 'bn' ? "নতুন সার্ভিস আপলোড" : "Create New Custom Service")}
                </h4>

                <form onSubmit={handleSaveService} className="space-y-4 text-xs text-left">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-655 dark:text-slate-400 block">Service Title *</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.title}
                      onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                      placeholder="e.g. AI Integration Core"
                      className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-655 dark:text-slate-400 block">Category ID</label>
                      <select
                        value={serviceForm.category}
                        onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-semibold"
                      >
                        {categoriesList.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{language === 'bn' ? c.bn || c.label : c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-655 dark:text-slate-400 block">Service Level</label>
                      <select
                        value={serviceForm.serviceLevel}
                        onChange={e => setServiceForm({ ...serviceForm, serviceLevel: e.target.value as any })}
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-semibold"
                      >
                        <option value="Starter">Starter</option>
                        <option value="Business">Business</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-650 dark:text-slate-400 block flex items-center justify-between">
                        <span>Starting Price</span>
                        <span className="text-[9px] text-zinc-400">USD $ / BDT ৳</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-900/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800/80">
                        <div className="relative">
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">$</span>
                          <input
                            type="number"
                            min="5"
                            value={serviceForm.startingPrice}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setServiceForm({ 
                                ...serviceForm, 
                                startingPrice: val,
                                starterPrice: Math.round(val * 0.8),
                                businessPrice: val,
                                enterprisePrice: Math.round(val * 2.1)
                              });
                            }}
                            className="w-full pl-4 pr-1 py-1 rounded bg-white dark:bg-neutral-950 text-slate-850 dark:text-white font-mono text-[10px] font-bold text-center focus:outline-none"
                            placeholder="USD"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-500">৳</span>
                          <input
                            type="number"
                            min="5"
                            value={Math.round(serviceForm.startingPrice * 115)}
                            onChange={e => {
                              const bdt = Number(e.target.value);
                              const val = Math.round(bdt / 115);
                              setServiceForm({ 
                                ...serviceForm, 
                                startingPrice: val,
                                starterPrice: Math.round(val * 0.8),
                                businessPrice: val,
                                enterprisePrice: Math.round(val * 2.1)
                              });
                            }}
                            className="w-full pl-4 pr-1 py-1 rounded bg-white dark:bg-neutral-950 text-slate-855 dark:text-white font-mono text-[10px] font-bold text-center focus:outline-none"
                            placeholder="BDT"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-655 dark:text-slate-400 block">Delivery Days</label>
                      <input
                        type="number"
                        min="1"
                        value={serviceForm.deliveryDays}
                        onChange={e => setServiceForm({ ...serviceForm, deliveryDays: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-655 dark:text-slate-400 block">Budget Segment (টাকা/৳)</label>
                      <select
                        value={serviceForm.projectBudgetCategory}
                        onChange={e => setServiceForm({ ...serviceForm, projectBudgetCategory: e.target.value as any })}
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white font-medium"
                      >
                        <option value="under-100">Under 1,000 থেকে 5,000 টাকা</option>
                        <option value="100-500">5,000 থেকে 10,000 টাকা</option>
                        <option value="500-1000">10,000 থেকে 30,000 টাকা</option>
                        <option value="1000-plus">30,000 থেকে 50,000 টাকা থেকে বেশি</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing 3 Custom Levels */}
                  <div className="p-3 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-xl space-y-2">
                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider block">Service Level pricing packages setup (USD & BDT Synced):</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-[9px] text-slate-655 dark:text-slate-400 block text-center">Starter Price</label>
                        <div className="grid grid-cols-1 gap-1">
                          <div className="relative">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              min="5"
                              value={serviceForm.starterPrice}
                              onChange={e => setServiceForm({ ...serviceForm, starterPrice: Number(e.target.value) })}
                              className="w-full pl-4 pr-1 py-1 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white text-center text-xs font-bold"
                              placeholder="USD"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-500">৳</span>
                            <input
                              type="number"
                              min="1"
                              value={Math.round((serviceForm.starterPrice || 0) * 115)}
                              onChange={e => {
                                const bdt = Number(e.target.value);
                                setServiceForm({ ...serviceForm, starterPrice: Math.round(bdt / 115) });
                              }}
                              className="w-full pl-4 pr-1 py-1 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white text-center text-xs font-bold font-mono"
                              placeholder="BDT"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[9px] text-slate-655 dark:text-slate-400 block text-center">Business Price</label>
                        <div className="grid grid-cols-1 gap-1">
                          <div className="relative">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              min="5"
                              value={serviceForm.businessPrice}
                              onChange={e => setServiceForm({ ...serviceForm, businessPrice: Number(e.target.value) })}
                              className="w-full pl-4 pr-1 py-1 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white text-center text-xs font-bold"
                              placeholder="USD"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-500">৳</span>
                            <input
                              type="number"
                              min="1"
                              value={Math.round((serviceForm.businessPrice || 0) * 115)}
                              onChange={e => {
                                const bdt = Number(e.target.value);
                                setServiceForm({ ...serviceForm, businessPrice: Math.round(bdt / 115) });
                              }}
                              className="w-full pl-4 pr-1 py-1 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white text-center text-xs font-bold font-mono"
                              placeholder="BDT"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[9px] text-slate-655 dark:text-slate-400 block text-center">Enterprise Price</label>
                        <div className="grid grid-cols-1 gap-1">
                          <div className="relative">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              min="5"
                              value={serviceForm.enterprisePrice}
                              onChange={e => setServiceForm({ ...serviceForm, enterprisePrice: Number(e.target.value) })}
                              className="w-full pl-4 pr-1 py-1 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white text-center text-xs font-bold"
                              placeholder="USD"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-500">৳</span>
                            <input
                              type="number"
                              min="1"
                              value={Math.round((serviceForm.enterprisePrice || 0) * 115)}
                              onChange={e => {
                                const bdt = Number(e.target.value);
                                setServiceForm({ ...serviceForm, enterprisePrice: Math.round(bdt / 115) });
                              }}
                              className="w-full pl-4 pr-1 py-1 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white text-center text-xs font-bold font-mono"
                              placeholder="BDT"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-655 dark:text-slate-400 block">Timeline Category</label>
                      <select
                        value={serviceForm.deliveryTimelineCategory}
                        onChange={e => setServiceForm({ ...serviceForm, deliveryTimelineCategory: e.target.value as any })}
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white font-medium"
                      >
                        <option value="3-days">3 Days</option>
                        <option value="7-days">7 Days</option>
                        <option value="14-days">14 Days</option>
                        <option value="30-days">30 Days</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-655 dark:text-slate-400 block">Projects Completed</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceForm.projectsCompleted}
                        onChange={e => setServiceForm({ ...serviceForm, projectsCompleted: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Image URL & File Upload Option */}
                  <div className="space-y-1 bg-slate-100/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/40 dark:border-slate-850/40">
                    <label className="font-bold text-slate-655 dark:text-slate-400 block flex items-center justify-between">
                      <span>Thumbnail Image URL</span>
                    </label>
                    <input
                      type="text"
                      value={serviceForm.thumbnail}
                      onChange={e => setServiceForm({ ...serviceForm, thumbnail: e.target.value, image: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/photo-1541462608141-2f58c7344276"
                      className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-mono"
                    />
                    <div className="mt-2 text-center border-2 border-dashed border-indigo-500/35 hover:border-indigo-500 transition rounded-xl p-3 bg-white/50 dark:bg-[#060811] relative cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              setServiceForm(prev => ({ ...prev, thumbnail: result, image: result }));
                              triggerToast(language === 'bn' ? "📸 থাম্বনেইল ইমেজ আপলোড করা হয়েছে!" : "📸 Thumbnail Image uploaded successfully!");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="text-center md:flex md:items-center md:justify-center md:gap-2">
                        <span className="text-[11px] font-black text-indigo-600 dark:text-[#3B82F6] flex items-center justify-center gap-1.5 group-hover:scale-102 transition-transform">
                          📤 {language === 'bn' ? 'ডিভাইস থেকে ইমেজ আপলোড করুন' : 'Or Upload file directly'}
                        </span>
                        <p className="text-[9px] text-slate-400 hidden md:block">PNG, JPG, WEBP formats</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-655 dark:text-slate-400 block">Technologies used (Comma separated)</label>
                    <input
                      type="text"
                      value={serviceForm.technologies}
                      onChange={e => setServiceForm({ ...serviceForm, technologies: e.target.value })}
                      placeholder="e.g. React, Laravel, TypeScript, Docker"
                      className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-655 dark:text-slate-400 block">Short Description *</label>
                    <textarea
                      required
                      value={serviceForm.shortDescription}
                      onChange={e => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white h-20 resize-none font-sans font-medium"
                      placeholder="Get top-tier web applications..."
                    />
                  </div>

                  {/* Dynamic Features Included List builder */}
                  <div className="space-y-2 p-3 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-xl">
                    <label className="font-bold text-slate-655 dark:text-slate-400 block uppercase tracking-wider text-[10px]">
                      Features Included / কার্যাবলী ও সুবিধাসমূহ
                    </label>
                    
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {serviceForm.features ? (
                        serviceForm.features.split(',').map(f => f.trim()).filter(Boolean).map((feat, index, arr) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                          >
                            <span className="font-medium text-[11px] flex items-center gap-2 text-slate-705 dark:text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {feat}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = arr.filter((_, i) => i !== index);
                                setServiceForm({ ...serviceForm, features: updated.join(', ') });
                              }}
                              className="text-red-500 hover:text-red-750 transition px-1.5 py-0.5 text-[10px] hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer"
                              title="Delete feature"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 italic p-2 text-center bg-slate-100/30 dark:bg-slate-950/10 rounded-lg">
                          No features added yet. Type a feature below and click Add.
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1.5 border-t border-slate-200/40 dark:border-slate-800/40">
                      <input
                        type="text"
                        value={newFeatureText}
                        onChange={e => setNewFeatureText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newFeatureText.trim()) {
                              const current = serviceForm.features ? serviceForm.features.split(',').map(f => f.trim()).filter(Boolean) : [];
                              if (!current.includes(newFeatureText.trim())) {
                                const updated = [...current, newFeatureText.trim()];
                                setServiceForm({ ...serviceForm, features: updated.join(', ') });
                              }
                              setNewFeatureText('');
                            }
                          }
                        }}
                        placeholder="e.g. 1 Year Premium Hosting Support"
                        className="flex-1 px-3 py-2 text-xs rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFeatureText.trim()) {
                            const current = serviceForm.features ? serviceForm.features.split(',').map(f => f.trim()).filter(Boolean) : [];
                            if (!current.includes(newFeatureText.trim())) {
                              const updated = [...current, newFeatureText.trim()];
                              setServiceForm({ ...serviceForm, features: updated.join(', ') });
                            }
                            setNewFeatureText('');
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer transition active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Simulated Views & Likes Custom Input Fields for detailed testing */}
                  <div className="grid grid-cols-2 gap-2.5 p-2.5 bg-neutral-100/60 dark:bg-slate-950/40 rounded-xl border border-slate-205 dark:border-slate-800/80">
                    <div className="space-y-1 text-center">
                      <label className="font-bold text-[9px] text-slate-500 uppercase block">👁️ Counter Views</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceForm.views}
                        onChange={e => setServiceForm({ ...serviceForm, views: Number(e.target.value) })}
                        className="w-full p-1.5 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-center font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="font-bold text-[9px] text-slate-500 uppercase block">👍 Counter Likes</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceForm.likes}
                        onChange={e => setServiceForm({ ...serviceForm, likes: Number(e.target.value) })}
                        className="w-full p-1.5 bg-white dark:bg-neutral-950 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-center font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-700 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black transition cursor-pointer text-center text-xs tracking-wider uppercase active:scale-97 shadow-md"
                    >
                      {editingService ? (language === 'bn' ? 'সংরক্ষণ করুন' : 'Update Service') : (language === 'bn' ? 'সার্ভিস আপলোড করুন' : 'Publish Service')}
                    </button>
                    {editingService && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingService(null);
                          setServiceForm(initialFormState);
                        }}
                        className="px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-705 text-slate-800 dark:text-slate-200 rounded-xl font-bold transition cursor-pointer active:scale-97 text-xs"
                      >
                        {language === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Data Table Side (High contrast professional table looking like Blog page Core Catalog Overview) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-left font-mono">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    {language === 'bn' ? `এক্টিভ ডাটাবেজ সার্ভিসেস লগ - ${catalogServices.length}টি` : `Active Database Services Logs - ${catalogServices.length} Items`}
                  </h4>
                  <span className="text-[9px] text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2.5 py-1 rounded-full font-bold">
                    CONNECTED TO CMS
                  </span>
                </div>

                <div className="border border-slate-200 dark:border-slate-800/85 rounded-2xl overflow-hidden max-h-[720px] overflow-y-auto bg-white dark:bg-[#080B13] shadow-md">
                  {/* Desktop Table View */}
                  <table className="hidden md:table w-full text-xs text-left text-neutral-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-400 font-extrabold sticky top-0 z-10">
                      <tr>
                        <th className="p-4 w-16">Cover Photo</th>
                        <th className="p-4">Title & Language Mapping</th>
                        <th className="p-4 w-28">Actions</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 w-28 text-center">Views/Likes</th>
                        <th className="p-4 w-24">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {catalogServices.map(srv => {
                        const iconImage = srv.thumbnail || srv.image || 'https://images.unsplash.com/photo-1541462608141-2f58c7344276';
                        return (
                          <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                            {/* Cover photo */}
                            <td className="p-4">
                              <img 
                                src={iconImage} 
                                alt="thumb" 
                                className="w-12 h-9 object-cover rounded-lg border border-slate-250 dark:border-slate-800/80 shrink-0" 
                                referrerPolicy="no-referrer" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=120';
                                }}
                              />
                            </td>

                            {/* Title & Language Mapping */}
                            <td className="p-4 space-y-1">
                              <div className="font-extrabold text-slate-900 dark:text-[#E2E8F0] line-clamp-1 max-w-[220px]">
                                {srv.title}
                              </div>
                              {srv.titleBn && (
                                <div className="text-[10px] font-sans text-slate-455 dark:text-slate-400 flex items-center gap-1">
                                  <span>🇧🇩</span>
                                  <span className="truncate max-w-[200px]">{srv.titleBn}</span>
                                </div>
                              )}
                              {srv.titleAr && (
                                <div className="text-[10px] font-sans text-slate-455 dark:text-slate-400 flex items-center gap-1">
                                  <span>🇸🇦</span>
                                  <span className="truncate max-w-[200px] font-medium">{srv.titleAr}</span>
                                </div>
                              )}
                              <div className="text-[9px] font-mono text-zinc-400 dark:text-slate-550 pt-0.5">
                                ID: <span className="text-indigo-500 font-bold">{srv.id}</span>
                              </div>
                            </td>

                            {/* Actions Dropdown system */}
                            <td className="p-4 relative">
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenServiceActionId(openServiceActionId === srv.id ? null : srv.id);
                                  }}
                                  className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-750 dark:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-750/60 transition text-[11px] font-bold"
                                >
                                  <span>Actions</span>
                                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                </button>

                                {openServiceActionId === srv.id && (
                                  <>
                                    {/* Overlay to catch click away */}
                                    <div 
                                      className="fixed inset-0 z-20" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenServiceActionId(null);
                                      }}
                                    />
                                    <div className="absolute left-0 mt-1.5 w-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-30 overflow-hidden py-1 backdrop-blur-md">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditServiceClick(srv);
                                          setOpenServiceActionId(null);
                                        }}
                                        className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-slate-705 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5"
                                      >
                                        <Edit className="w-3 h-3 text-indigo-500" />
                                        <span>Edit</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteService(srv.id);
                                          setOpenServiceActionId(null);
                                        }}
                                        className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800/50"
                                      >
                                        <Trash2 className="w-3 h-3 text-rose-500" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* Category with beautiful badge */}
                            <td className="p-4">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 dark:bg-cyan-500/10 text-blue-650 dark:text-cyan-400 text-[10px] font-mono font-bold border border-blue-500/15 dark:border-cyan-500/15 uppercase">
                                {srv.category}
                              </span>
                            </td>

                            {/* Views and Likes */}
                            <td className="p-4 font-mono text-[10px] space-y-0.5 text-center">
                              <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 font-extrabold">
                                <span>👁️</span> <span>{srv.views || 142}</span>
                              </div>
                              <div className="flex items-center justify-center gap-1 text-zinc-400 dark:text-slate-550">
                                <span>👍</span> <span>{srv.likes || 48}</span>
                              </div>
                            </td>

                            {/* Price formatted with active dynamic country conversion */}
                            <td className="p-4 font-mono font-black text-emerald-650 dark:text-emerald-400 text-sm">
                              {renderPrice(srv.startingPrice)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Mobile Grid/List View */}
                  <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
                    {catalogServices.map(srv => {
                      const iconImage = srv.thumbnail || srv.image || 'https://images.unsplash.com/photo-1541462608141-2f58c7344276';
                      return (
                        <div key={srv.id} className="p-4 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                          {/* Card Header: Cover image + Category + Price */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={iconImage} 
                                alt="thumb" 
                                className="w-14 h-10 object-cover rounded-lg border border-slate-250 dark:border-slate-800/80 shrink-0" 
                                referrerPolicy="no-referrer" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=120';
                                }}
                              />
                              <div className="space-y-0.5 text-left">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/10 dark:bg-cyan-500/10 text-blue-650 dark:text-cyan-400 text-[9px] font-mono font-bold border border-blue-500/15 dark:border-cyan-500/15 uppercase">
                                  {srv.category}
                                </span>
                                <div className="text-[9px] font-mono text-zinc-400 dark:text-slate-550">
                                  ID: <span className="text-indigo-500 font-bold">{srv.id}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-mono font-black text-emerald-650 dark:text-emerald-400 text-xs">
                                {renderPrice(srv.startingPrice)}
                              </div>
                            </div>
                          </div>

                          {/* Card Content: Title & Language Mappings */}
                          <div className="space-y-1 text-left">
                            <div className="font-extrabold text-slate-900 dark:text-[#E2E8F0] text-xs">
                              {srv.title}
                            </div>
                            {srv.titleBn && (
                              <div className="text-[10px] font-sans text-slate-455 dark:text-slate-400 flex items-center gap-1">
                                <span>🇧🇩</span>
                                <span className="truncate max-w-[240px]">{srv.titleBn}</span>
                              </div>
                            )}
                            {srv.titleAr && (
                              <div className="text-[10px] font-sans text-slate-455 dark:text-slate-400 flex items-center gap-1">
                                <span>🇸🇦</span>
                                <span className="truncate max-w-[240px] font-medium">{srv.titleAr}</span>
                              </div>
                            )}
                          </div>

                          {/* Card Footer: Stats & Actions Dropdown */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/50">
                            {/* Views/Likes */}
                            <div className="flex items-center gap-3 font-mono text-[10px]">
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                👁️ {srv.views || 142}
                              </span>
                              <span className="flex items-center gap-1 text-zinc-400 dark:text-slate-550">
                                👍 {srv.likes || 48}
                              </span>
                            </div>

                            {/* Dropdown System for Mobile */}
                            <div className="relative inline-block text-left">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenServiceActionId(openServiceActionId === srv.id ? null : srv.id);
                                }}
                                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-750 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-250 dark:border-slate-750/60 transition text-[10px] font-bold cursor-pointer"
                              >
                                <span>Actions</span>
                                <ChevronDown className="w-3 h-3 opacity-60" />
                              </button>

                              {openServiceActionId === srv.id && (
                                <>
                                  {/* Overlay */}
                                  <div 
                                    className="fixed inset-0 z-20" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenServiceActionId(null);
                                    }}
                                  />
                                  <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-30 overflow-hidden py-1 backdrop-blur-md">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditServiceClick(srv);
                                        setOpenServiceActionId(null);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-slate-705 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3 text-indigo-500" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteService(srv.id);
                                        setOpenServiceActionId(null);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800/50 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3 text-rose-500" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SERVICES TAB SELECTION & CATALOG SECTION (Shown only on Services page) */}
      {!selectedService && !isHomePage ? (
        <div className="space-y-5">
          
          {/* Subpage menu tabs navigation (Horizontal, Full-Wide layout with custom UI gradients) */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 mb-4">
            <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-2 sm:gap-3 p-2 bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/5 w-full overflow-x-auto scrollbar-none select-none shadow-xl shadow-neutral-100/40 dark:shadow-none">
              {[
                ...(!isHomePage ? [
                  { id: 'all-services', label: 'All Services', bn: 'সব সার্ভিসেস ক্যাটালগ', emoji: '🌐' },
                  { id: 'custom-services', label: 'All Custom Services', bn: 'সব কাস্টম সার্ভিসেস', emoji: '✨' }
                ] : []),
                { id: 'digital-web-dev', label: 'Digital Web Development', bn: 'ডিজিটাল ওয়েব ডেভেলপমেন্ট', emoji: '💻' },
                { id: 'google-business', label: 'Google Business Setup', bn: 'গুগল মাই বিজনেস সেটআপ', emoji: '📍' },
                { id: 'growth-package', label: 'Business Growth Packages', bn: 'বিজনেস গ্রোথ প্যাকেজস', emoji: '📈' }
              ].map(tabItem => {
                const isActive = activeTab === tabItem.id;
                
                // Set custom UI gradients matching each service type perfectly
                let activeGradientClass = '';
                if (tabItem.id === 'all-services') {
                  activeGradientClass = 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-blue-500/20';
                } else if (tabItem.id === 'custom-services') {
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
                    <span>{language === 'bn' ? tabItem.bn : language === 'ar' ? (tabItem as any).ar || tabItem.label : tabItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* TAB 1: ALL SERVICES CATALOG (COMPLETE MARKETPLACE WITH HORIZONTAL FILTERS & 3D CARDS) */}
          {(activeTab === 'all-services' || (isHomePage && activeTab === 'custom-services')) && (
            <div className="space-y-8 text-left">

              {/* HOMEPAGE SERVICE CATEGORY FILTER BAR */}
              {isHomePage && (
                <div id="homepage-service-filter-bar" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 bg-neutral-50/50 dark:bg-slate-900/30 rounded-2xl border border-neutral-200/50 dark:border-slate-800/50 max-w-5xl mx-auto mb-3">
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
                  const isWa = (cat as any).isWhatsAppAction;
                  
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        if (isWa) {
                          handleOpenOrderModal('General Service / Custom Solution', 'Standard', true);
                          return;
                        }
                        setActiveCategoryFilter(cat.id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
                        isWa
                          ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/20 animate-pulse'
                          : isActive
                            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-500/10'
                            : 'bg-neutral-50 dark:bg-slate-950/65 text-neutral-600 dark:text-slate-350 hover:bg-neutral-100 dark:hover:bg-slate-900 border border-neutral-200/80 dark:border-slate-800'
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isWa ? 'text-white animate-pulse' : isActive ? 'text-white' : 'text-neutral-405'}`} />
                      <span>{localizedLabel}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* SERVICE CARDS LISTING BLOCK */}
              <div className="space-y-6">
                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-6"
                >
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
                      // Dynamically calculate special label and popular status
                      const getSpecialLabel = (item: CatalogService) => {
                        if (item.projectsCompleted >= 300) {
                          return { text: language === 'bn' ? "🏆 বেস্ট সেলার" : "🏆 Best Seller", color: "bg-amber-500 text-white" };
                        }
                        if (item.projectsCompleted >= 100 || item.rating >= 4.9) {
                          return { 
                            text: language === 'bn' ? "🔥 জনপ্রিয়" : "🔥 Popular", 
                            color: "bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black hover:scale-105 transition-transform" 
                          };
                        }
                        if (item.rating >= 5.0 && item.projectsCompleted >= 40) {
                          return { text: language === 'bn' ? "✨ ফিচার্ড" : "✨ Featured", color: "bg-blue-600 text-white" };
                        }
                        if (item.projectsCompleted <= 80) {
                          return { text: language === 'bn' ? "⚡ নতুন সার্ভিস" : "⚡ New Service", color: "bg-emerald-600 text-white" };
                        }
                        return null;
                      };
                      const sLabel = getSpecialLabel(srv);
                      const isHighDemand = srv.projectsCompleted >= 100 || srv.rating >= 4.9;

                      return (
                        <motion.div 
                          layout
                          key={srv.id}
                          variants={{
                            hidden: { opacity: 0, y: 30, scale: 0.95 },
                            show: { 
                              opacity: 1, 
                              y: 0, 
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 24
                              }
                            }
                          }}
                          className="h-full"
                        >
                          <ServiceCard3D isHighDemand={isHighDemand}>
                            {/* Image Box */}
                          <div className="relative h-52 overflow-hidden bg-slate-950 shrink-0">
                            <motion.img 
                              src={srv.thumbnail || srv.image} 
                              alt={srv.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.15 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              referrerPolicy="no-referrer"
                            />
                            {/* Dark gradient blur over image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

                            {/* Wishlist Heart Button with subtle pulse feedback */}
                            {toggleWishlist && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const isAdding = !wishlist.includes(srv.id);
                                  if (isAdding) {
                                    setRecentlyAddedWishlistId(srv.id);
                                    setTimeout(() => {
                                      setRecentlyAddedWishlistId((prev) => (prev === srv.id ? null : prev));
                                    }, 850);
                                  }
                                  toggleWishlist(srv.id);
                                }}
                                className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md border shadow-md transition-all duration-150 cursor-pointer z-25 active:scale-90 ${
                                  wishlist.includes(srv.id)
                                    ? 'bg-rose-50/95 border-rose-200 text-rose-500 dark:bg-rose-950/90 dark:border-rose-900/60'
                                    : 'bg-white/95 dark:bg-[#020617]/90 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:scale-110'
                                }`}
                                title={wishlist.includes(srv.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                aria-label={wishlist.includes(srv.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                              >
                                {/* Subtle Expanding Ripple Ring on Addition */}
                                {recentlyAddedWishlistId === srv.id && (
                                  <span 
                                    aria-hidden="true" 
                                    className="absolute inset-0 rounded-full bg-rose-500/35 animate-heart-ring pointer-events-none" 
                                  />
                                )}
                                <Heart 
                                  className={`w-3.5 h-3.5 fill-current transition-colors duration-200 ${
                                    recentlyAddedWishlistId === srv.id 
                                      ? 'animate-heart-pulse drop-shadow-[0_0_6px_rgba(244,63,94,0.7)]' 
                                      : ''
                                  }`} 
                                />
                              </button>
                            )}

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
                              <Star className="w-3 h-3 fill-white text-white group-hover:rotate-[360deg] transition-transform duration-1000" />
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

                              <div className="relative group/title-container pb-1">
                                <h3 
                                  onClick={() => handleSelectService(srv)}
                                  className="cursor-pointer text-[18px] sm:text-[21px] font-black leading-snug transition-all duration-350 text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-blue-950 to-indigo-950 dark:from-amber-200 dark:via-yellow-300 dark:to-amber-400 group-hover:from-blue-650 group-hover:via-indigo-650 group-hover:to-cyan-550 dark:group-hover:from-yellow-300 dark:group-hover:via-amber-450 dark:group-hover:to-rose-450"
                                >
                                  {language === 'bn' ? srv.titleBn : language === 'ar' ? srv.titleAr : srv.title}
                                </h3>
                                {/* Premium animated visual accent bar under title */}
                                <div className="mt-2.5 h-[3.5px] w-20 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-amber-400 dark:to-amber-500 rounded-full group-hover:w-full group-hover:from-blue-600 group-hover:via-rose-500 group-hover:to-amber-450 transition-all duration-500 ease-out" />
                              </div>

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
                                  <motion.li 
                                    key={idx} 
                                    whileHover={{ x: 6, color: "#3b82f6" }}
                                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                    className="flex items-start gap-1.5 text-[11px] text-neutral-700 dark:text-slate-300 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{feat}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>

                            {/* Technologies tag line */}
                            <div className="flex flex-wrap gap-1 pt-1 h-12 overflow-hidden items-start">
                              {srv.technologies.slice(0, 4).map(tech => (
                                <motion.span 
                                  key={tech} 
                                  whileHover={{ 
                                    scale: 1.15, 
                                    y: -2,
                                    backgroundColor: "rgba(99, 102, 241, 0.15)",
                                    borderColor: "rgba(99, 102, 241, 0.4)",
                                    color: "#6366f1"
                                  }}
                                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                                  className="bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-350 font-mono text-[9px] px-2 py-0.5 rounded border border-neutral-200/30 dark:border-slate-700/30 transition-all duration-350 cursor-default"
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </div>

                            {/* Stats Line with Clock and Work Progress */}
                            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                              {/* Premium Delivery Block */}
                              <motion.div 
                                whileHover={{ scale: 1.05, y: -2, borderColor: "#3b82f6" }}
                                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                className="relative group/field flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-slate-50 to-neutral-50/50 dark:from-slate-900/50 dark:to-slate-800/20 border border-slate-200/50 dark:border-slate-800/40 overflow-hidden hover:shadow-xs transition-all duration-300 cursor-default"
                              >
                                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 group-hover/field:scale-110 transition-transform">
                                  <Clock className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{language === 'bn' ? 'ডেলিভারি:' : 'Delivered'}</span>
                                  <span className="block text-[11px] font-extrabold text-neutral-800 dark:text-slate-200 truncate leading-tight">
                                    {language === 'bn' ? `${srv.deliveryDays} দিন` : `${srv.deliveryDays} Days`}
                                  </span>
                                </div>
                              </motion.div>

                              {/* Premium Level Block */}
                              <motion.div 
                                whileHover={{ scale: 1.05, y: -2, borderColor: "#6366f1" }}
                                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                className="relative group/field flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-slate-50 to-neutral-50/50 dark:from-slate-900/50 dark:to-slate-800/20 border border-slate-200/50 dark:border-slate-800/40 overflow-hidden hover:shadow-xs transition-all duration-300 cursor-default"
                              >
                                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 group-hover/field:scale-110 transition-transform">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{language === 'bn' ? 'লেভেল:' : 'Expertise'}</span>
                                  <span className="block text-[11px] font-extrabold text-neutral-800 dark:text-slate-200 truncate leading-tight">
                                    {language === 'bn' ? srv.serviceLevelBn : srv.serviceLevel}
                                  </span>
                                </div>
                              </motion.div>
                            </div>

                            {/* Price Label Area with Elegant Gradient Field & Star icon */}
                            <div className="relative overflow-hidden flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 flex-wrap sm:flex-nowrap gap-2">
                              <motion.div 
                                whileHover={{ scale: 1.04, rotate: -0.5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                className="flex-1 min-w-[130px] rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-500/10 dark:via-yellow-500/5 dark:to-transparent p-2.5 border-l-4 border-l-amber-500 dark:border-l-amber-400 border-y border-r border-amber-100/50 dark:border-amber-900/10 shadow-xs cursor-default"
                              >
                                <span className="text-[9px] font-black tracking-widest uppercase text-amber-600 dark:text-amber-450 flex items-center gap-1.5 mb-1 leading-none">
                                  <span>{language === 'bn' ? 'শুরু মাত্র' : 'STARTING AT'}</span>
                                  <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                  </span>
                                </span>
                                <span className="text-2xl sm:text-[26px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-yellow-300 dark:via-amber-400 dark:to-orange-400 font-mono tracking-tight drop-shadow-sm leading-none">
                                  {renderPrice(srv.startingPrice)}
                                </span>
                              </motion.div>

                              <div className="shrink-0 flex flex-col items-end justify-center">
                                <motion.span 
                                  whileHover={{ scale: 1.1, rotate: 1 }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 dark:from-yellow-400 dark:to-amber-500 text-[9px] font-black text-white uppercase tracking-widest shadow-md hover:shadow-lg transition-all cursor-default"
                                >
                                  <span>🚀 BEST VALUE</span>
                                </motion.span>
                              </div>
                            </div>
                          </div>

                          {/* Footer Actions Panel */}
                          <div className="p-4 bg-neutral-50 dark:bg-slate-950/40 border-t border-neutral-150 dark:border-slate-800/60 space-y-2 mt-auto">
                            <div className="flex gap-2">
                              {/* View Details */}
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleSelectService(srv)}
                                className="flex-1 py-2.5 bg-neutral-200/60 hover:bg-neutral-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-neutral-850 dark:text-slate-200 text-[11px] font-bold rounded-xl transition-all duration-200 text-center cursor-pointer flex items-center justify-center gap-1 border border-neutral-300/40 dark:border-slate-700 focus:outline-none"
                              >
                                <span>{language === 'bn' ? 'বিস্তারিত তথ্য' : 'View Details'}</span>
                              </motion.button>

                              {/* Get Quote */}
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                  setSelectedService(srv);
                                  handleOpenOrderModal(srv.title, 'Standard', false);
                                }}
                                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 dark:bg-slate-900/65 dark:hover:bg-slate-900 text-white text-[11px] font-bold rounded-xl transition-all duration-200 border border-neutral-700 hover:border-neutral-600 flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
                              >
                                <span>📋 {language === 'bn' ? 'কোটেশন রিকোয়েস্ট' : 'Request Quotation'}</span>
                              </motion.button>
                            </div>

                            {/* Order Now button (Premium conversion-focused) */}
                            <motion.button
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedService(srv);
                                handleOpenOrderModal(srv.title, 'Standard', true);
                              }}
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
                            >
                              <MessageSquare className="w-4 h-4 text-white/90 group-hover:animate-bounce" />
                              <span>🟢 {language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'Order via WhatsApp'}</span>
                            </motion.button>
                          </div>
                          </ServiceCard3D>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>

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

          {/* TAB: ALL CUSTOM SERVICES (BESPOKE SOLUTIONS, 2-FIELD CATEGORY CARDS & INTERACTIVE ESTIMATOR) */}
          {activeTab === 'custom-services' && !isHomePage && (
            <div className="space-y-10 text-left">
              
              {/* HERO & BESPOKE SOLUTIONS BANNER */}
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden shadow-2xl border border-indigo-500/30">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>{language === 'bn' ? 'বেস্পোক ও এন্টারপ্রাইজ ডেভেলপমেন্ট' : 'Bespoke Custom Software Architecture'}</span>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                      {language === 'bn' ? 'আপনার নির্দিষ্ট চাহিদামতো কাস্টম সার্ভিস তৈরি করুন' : 'Build Custom Tailored Digital Solutions'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {language === 'bn' 
                        ? 'আপনার ব্যবসার ইউনিক মডেলের জন্য কাস্টম ওয়েব অ্যাপ্লিকেশন, পিওএস, মোবাইল অ্যাপ ও ডেডিকেটেড ক্লাউড ইনফ্রাস্ট্রাকচার।' 
                        : 'Engineered from scratch to fit your exact business workflows, integrations, payment gateways, and custom logic.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                    <button
                      onClick={() => handleOpenOrderModal('Bespoke Custom Architecture Project', 'Enterprise Custom', true)}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-550 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition transform hover:scale-102"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{language === 'bn' ? 'কাস্টম রিকোয়ারমেন্ট পাঠান' : 'Direct WhatsApp Inquiry'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2-FIELD CATEGORY CARDS SECTION */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-neutral-200/80 dark:border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      {language === 'bn' ? 'টেইলর্ড ও বিশেষায়িত ৮টি সার্ভিস ক্যাটাগরি' : '8 Tailored Custom Service Domains'}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
                      {language === 'bn' 
                        ? 'মোবাইল ও ডেস্কটপ উভয়ের জন্যই অপ্টিমাইজড ২-ফিল্ড মডার্ন ক্যাটাগরি গ্রিড।' 
                        : 'Explore specialized domains with starting rates, tech tags, and instant WhatsApp consultation.'}
                    </p>
                  </div>
                </div>

                {/* 2-Column Mobile / 4-Column Desktop Modern Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {tailoredCategoriesList.map((cat) => {
                    const IconComp = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          if (cat.id === 'google-business') {
                            setActiveTab('google-business');
                          } else {
                            setActiveCategoryFilter(cat.id);
                            setActiveTab('all-services');
                          }
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`relative group rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-b ${cat.gradient} bg-white dark:bg-slate-900/90 border border-neutral-200/90 dark:border-slate-800 ${cat.borderHover} transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-2xl cursor-pointer flex flex-col justify-between text-left`}
                      >
                        <div>
                          {/* Top Row: Icon & Badge */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className={`p-3 rounded-2xl ${cat.iconBg} group-hover:scale-110 transition-transform`}>
                              <IconComp className="w-6 h-6" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${cat.badgeColor}`}>
                              {language === 'bn' ? cat.badgeBn : cat.badge}
                            </span>
                          </div>

                          {/* Category Title & Count */}
                          <div className="space-y-1.5">
                            <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {language === 'bn' ? cat.titleBn : language === 'ar' ? cat.titleAr : cat.title}
                            </h4>
                            <span className="inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                              {language === 'bn' ? cat.countBn : cat.count}
                            </span>
                            <p className="text-xs text-neutral-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                              {language === 'bn' ? cat.descBn : language === 'ar' ? cat.descAr : cat.desc}
                            </p>
                          </div>

                          {/* Tech Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-3.5">
                            {cat.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-200/60 dark:border-slate-700/60"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Action Strip */}
                        <div className="pt-5 mt-4 border-t border-neutral-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-neutral-400 dark:text-slate-400 block uppercase font-bold tracking-wider">
                              {language === 'bn' ? 'শুরু মাত্র' : 'Starting at'}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">
                              {language === 'bn' ? cat.startingPriceBn : cat.startingPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenOrderModal(cat.title, 'Standard', true);
                              }}
                              title="WhatsApp Inquiry"
                              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white transition-all cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 group-hover:bg-emerald-600 dark:bg-white/10 dark:group-hover:bg-emerald-500 text-white dark:text-white text-xs font-bold transition-all">
                              <span>{language === 'bn' ? 'সার্ভিসেস' : 'Explore'}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* INTERACTIVE CUSTOM PROJECT SCOPE & COST ESTIMATOR */}
              <div id="custom-estimator-section" className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900/90 border border-neutral-200/90 dark:border-slate-800 shadow-xl space-y-6 scroll-mt-24">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-emerald-500" />
                      <h4 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
                        {language === 'bn' ? '⚡ কাস্টম প্রজেক্ট কস্ট এস্টিমেটর' : '⚡ Custom Project Cost Estimator'}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-slate-400">
                      {language === 'bn' 
                        ? 'আপনার প্রজেক্টের রিকোয়ারমেন্ট সিলেক্ট করুন এবং লাইভ বাজেট হিসাব করে হোয়াটসঅ্যাপে পাঠান।' 
                        : 'Configure your custom requirements in real-time and send instant project brief to our engineers.'}
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>{language === 'bn' ? '২৫% অ্যাডভান্সে বুকিং সুবিধা' : '25% Advance Booking Available'}</span>
                  </div>
                </div>

                {/* Company Category (Searchable Dropdown with SaaS UI) */}
                <div className="space-y-2.5" ref={estCompanyCategoryDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-500 font-black">✦</span>
                      <span>{language === 'bn' ? 'কোম্পানি ক্যাটাগরি (Company Category)' : 'Company Category'}</span>
                      <span className="text-rose-500 font-black text-sm">*</span>
                    </label>
                    {customEstCompanyCategory && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>{customEstCompanyCategory}</span>
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEstCompanyCategoryOpen(!isEstCompanyCategoryOpen);
                        setCompanyCategoryError(false);
                      }}
                      className={`w-full min-h-[52px] px-4 py-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                        companyCategoryError 
                          ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300'
                          : isEstCompanyCategoryOpen
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white'
                            : 'border-neutral-200/90 dark:border-slate-700 bg-neutral-50/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-neutral-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        {(() => {
                          const matched = COMPANY_CATEGORIES.find(c => c.name === customEstCompanyCategory || c.nameBn === customEstCompanyCategory || c.id === customEstCompanyCategory);
                          if (matched) {
                            const MatchedIcon = matched.icon;
                            return (
                              <div className="flex items-center gap-2.5 truncate">
                                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                  <MatchedIcon className="w-4 h-4" />
                                </span>
                                <div className="truncate">
                                  <div className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                                    <span>{language === 'bn' ? matched.nameBn : matched.name}</span>
                                    {matched.badge && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        {matched.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-neutral-500 dark:text-slate-400 truncate">
                                    {language === 'bn' ? matched.descriptionBn : matched.description}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <span className="text-xs sm:text-sm text-neutral-400 dark:text-slate-500 font-medium">
                              {language === 'bn' ? 'আপনার কোম্পানি ক্যাটাগরি বেছে নিন (Select Your Company Category)' : 'Select Your Company Category'}
                            </span>
                          );
                        })()}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {customEstCompanyCategory && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomEstCompanyCategory('');
                            }}
                            title="Clear selection"
                            className="p-1 hover:bg-neutral-200 dark:hover:bg-slate-700 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-slate-200 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isEstCompanyCategoryOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                      </div>
                    </button>

                    {/* Searchable Dropdown Popup Menu */}
                    <AnimatePresence>
                      {isEstCompanyCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                        >
                          {/* Search Input Bar */}
                          <div className="p-3 border-b border-neutral-100 dark:border-slate-800 bg-neutral-50/70 dark:bg-slate-800/50 flex items-center gap-2">
                            <Search className="w-4 h-4 text-emerald-500 shrink-0" />
                            <input
                              type="text"
                              value={estCompanyCategorySearch}
                              onChange={(e) => setEstCompanyCategorySearch(e.target.value)}
                              placeholder={language === 'bn' ? 'ক্যাটাগরি খুঁজুন (যেমন: Startup, E-commerce, NGO)...' : 'Search company category (e.g. Startup, Retail, SME)...'}
                              className="w-full bg-transparent text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none"
                              autoFocus
                            />
                            {estCompanyCategorySearch && (
                              <button
                                type="button"
                                onClick={() => setEstCompanyCategorySearch('')}
                                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-slate-300"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Options List */}
                          <div className="max-h-64 sm:max-h-72 overflow-y-auto p-2 space-y-1 divide-y divide-neutral-100/60 dark:divide-slate-800/60">
                            {(() => {
                              const query = estCompanyCategorySearch.toLowerCase().trim();
                              const filtered = COMPANY_CATEGORIES.filter(cat => 
                                !query || 
                                cat.name.toLowerCase().includes(query) || 
                                cat.nameBn.toLowerCase().includes(query) || 
                                cat.description.toLowerCase().includes(query) ||
                                cat.descriptionBn.toLowerCase().includes(query) ||
                                (cat.badge && cat.badge.toLowerCase().includes(query))
                              );

                              if (filtered.length === 0) {
                                return (
                                  <div className="py-8 text-center space-y-2">
                                    <HelpCircle className="w-8 h-8 mx-auto text-neutral-300 dark:text-slate-600" />
                                    <p className="text-xs text-neutral-500 dark:text-slate-400 font-medium">
                                      {language === 'bn' ? 'কোনো ক্যাটাগরি পাওয়া যায়নি।' : 'No matching company categories found.'}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const otherCat = COMPANY_CATEGORIES.find(c => c.id === 'other') || {
                                          id: 'other',
                                          name: 'Other',
                                          nameBn: 'অন্যান্য (Other)',
                                          icon: HelpCircle,
                                          description: 'Custom industry requirements and bespoke solutions',
                                          descriptionBn: 'কাস্টম ইন্ডাস্ট্রি রিকোয়ারমেন্ট ও সমাধান',
                                          badge: 'Custom',
                                          recommendedFeatures: ['custom_api', 'admin_panel']
                                        };
                                        handleSelectCompanyCategory(otherCat as CompanyCategoryItem);
                                      }}
                                      className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                                    >
                                      {language === 'bn' ? 'অন্যান্য (Other) নির্বাচন করুন' : 'Select "Other" category'}
                                    </button>
                                  </div>
                                );
                              }

                              return filtered.map((catItem) => {
                                const isSelected = customEstCompanyCategory === catItem.name || customEstCompanyCategory === catItem.nameBn || customEstCompanyCategory === catItem.id;
                                const CatIcon = catItem.icon;
                                return (
                                  <button
                                    key={catItem.id}
                                    type="button"
                                    onClick={() => handleSelectCompanyCategory(catItem)}
                                    className={`w-full p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                                      isSelected
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-black'
                                        : 'hover:bg-neutral-100/80 dark:hover:bg-slate-800/80 text-neutral-700 dark:text-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <span className="p-1.5 rounded-lg bg-neutral-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                                        <CatIcon className="w-4 h-4" />
                                      </span>
                                      <div className="min-w-0 truncate">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs sm:text-sm font-bold truncate">
                                            {language === 'bn' ? catItem.nameBn : catItem.name}
                                          </span>
                                          {catItem.badge && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                              {catItem.badge}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-neutral-400 dark:text-slate-500 truncate font-normal">
                                          {language === 'bn' ? catItem.descriptionBn : catItem.description}
                                        </p>
                                      </div>
                                    </div>

                                    {isSelected ? (
                                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      </div>
                                    ) : (
                                      <div className="text-[10px] font-bold text-neutral-400 opacity-0 group-hover:opacity-100 shrink-0">
                                        Select
                                      </div>
                                    )}
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Validation Error Message */}
                  {companyCategoryError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-rose-500 flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'অনুগ্রহ করে আপনার কোম্পানি ক্যাটাগরি নির্বাচন করুন।' : 'Please select your company category to continue.'}</span>
                    </motion.p>
                  )}

                  {/* Smart Category Recommendation & Insight Box */}
                  {customEstCompanyCategory && (() => {
                    const matchedCat = COMPANY_CATEGORIES.find(c => c.name === customEstCompanyCategory || c.nameBn === customEstCompanyCategory || c.id === customEstCompanyCategory);
                    if (!matchedCat) return null;
                    return (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 text-xs text-neutral-700 dark:text-slate-300 flex items-start gap-3"
                      >
                        <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                            <span>{language === 'bn' ? `💡 ${matchedCat.nameBn} স্পেশাল রিকমেন্ডেশন:` : `💡 Tailored for ${matchedCat.name}:`}</span>
                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Optimized Stack
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-slate-400 leading-relaxed">
                            {language === 'bn' 
                              ? `আপনার ${matchedCat.nameBn} এর জন্য উপযোগী মডিউল ও আর্কিটেকচার স্বয়ংক্রিয়ভাবে ক্যালকুলেটরে অপ্টিমাইজ করা হয়েছে।` 
                              : `Architecture and recommended addons have been automatically pre-calibrated for ${matchedCat.name} growth.`}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>

                {/* Step 1: Category Selection (Project Domain & Service Architecture - Modern Premium UI) */}
                <div
                  id="custom-est-step-domain"
                  tabIndex={-1}
                  className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 transition-all duration-500 outline-none ${
                    highlightedEstStep === 'domain'
                      ? 'ring-2 ring-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-2xl shadow-emerald-500/20 scale-[1.006]'
                      : 'bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#080E1A] border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-slate-900/5 dark:shadow-black/40'
                  }`}
                >
                  {/* Subtle Ambient Decorative Light */}
                  <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/30 shrink-0">
                          1
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{language === 'bn' ? 'প্রজেক্ট ডোমেন ও সার্ভিস রিকোয়ারমেন্টস' : 'Project Domain & Service Architecture'}</span>
                              <span className="text-rose-500 text-sm font-bold">*</span>
                            </h3>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {language === 'bn' ? 'কোর আর্কিটেকচার' : 'Core Architecture'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {language === 'bn'
                              ? 'প্রতিটি ক্যাটাগরি থেকে ১টি করে রিকোয়ারমেন্ট বেছে নিন। ক্লিক করে পুনরায় আনসিলেক্ট করতে পারবেন।'
                              : 'Select 1 requirement from each category. Click any selected service to toggle.'}
                          </p>
                        </div>
                      </div>

                      {/* Right Status Capsule */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {Object.keys(estSelectedReqsByCategory).length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>
                                {Object.keys(estSelectedReqsByCategory).length} {language === 'bn' ? 'টি অ্যাক্টিভ' : 'Active'}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setEstSelectedReqsByCategory({})}
                              className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title={language === 'bn' ? 'সব রিকোয়ারমেন্ট মুছুন' : 'Clear all selections'}
                            >
                              {language === 'bn' ? 'রিসেট' : 'Clear All'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                            {language === 'bn' ? 'কোনো সার্ভিস নির্বাচন করা হয়নি' : 'No service selected yet'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Filter & Search Toolbar */}
                    <div className="space-y-3">
                      {/* Search Bar with Results Pill */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          value={estReqSearch}
                          onChange={(e) => setEstReqSearch(e.target.value)}
                          placeholder={
                            language === 'bn' ? 'সার্ভিস, ডোমেন বা রিকোয়ারমেন্ট খুঁজুন...' :
                            language === 'ar' ? 'ابحث عن متطلب أو خدمة مخصصة...' :
                            'Search services, packages or requirements...'
                          }
                          className="w-full h-11 sm:h-12 pl-11 pr-24 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          {estReqSearch && (
                            <button
                              type="button"
                              onClick={() => setEstReqSearch('')}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 hidden sm:inline">
                            {serviceRequirementsList.filter(item => {
                              const matchCategory = estSelectedReqCategory === 'all' || item.category === estSelectedReqCategory;
                              const searchLower = estReqSearch.toLowerCase();
                              const matchSearch = !estReqSearch ||
                                item.label.toLowerCase().includes(searchLower) ||
                                item.labelBn.toLowerCase().includes(searchLower) ||
                                item.labelAr.toLowerCase().includes(searchLower) ||
                                item.desc.toLowerCase().includes(searchLower) ||
                                item.descBn.toLowerCase().includes(searchLower) ||
                                item.descAr.toLowerCase().includes(searchLower);
                              return matchCategory && matchSearch;
                            }).length} {language === 'bn' ? 'টি সার্ভিস' : 'Items'}
                          </span>
                        </div>
                      </div>

                      {/* Category Segmented Navigation Pills */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {(() => {
                          const reqCategoryLabels: { [key: string]: { [lang: string]: string } } = {
                            'all': { en: "All Categories", bn: "সব ক্যাটাগরি", ar: "جميع الفئات" },
                            'Hosting & Domains': { en: "Hosting & Domains", bn: "হোস্টিং ও ডোমেইন", ar: "الاستضافة والنطاقات" },
                            'Website Development': { en: "Website Development", bn: "ওয়েবসাইট তৈরি", ar: "تطوير المواقع والمنصات" },
                            'Digital Marketing': { en: "Digital Marketing", bn: "ডিজিটাল মার্কেটিং", ar: "التسويق الرقمي والنمو" },
                            'Software Solutions': { en: "Software Solutions", bn: "সফটওয়্যার সলিউশন", ar: "البرمجيات الإدارية والحلول" },
                            'Graphic Design': { en: "Graphic Design", bn: "গ্রাফিক ডিজাইন", ar: "التصميم الجرافيكي" }
                          };

                          return ['all', 'Hosting & Domains', 'Website Development', 'Digital Marketing', 'Software Solutions', 'Graphic Design'].map((cat) => {
                            const isCatActive = estSelectedReqCategory === cat;
                            const label = reqCategoryLabels[cat]?.[language] || cat;
                            const hasSelection = cat !== 'all' && !!estSelectedReqsByCategory[cat];

                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setEstSelectedReqCategory(cat)}
                                className={`relative px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                                  isCatActive
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80'
                                }`}
                              >
                                {cat === 'all' && <Sparkles className="w-3.5 h-3.5" />}
                                {cat === 'Hosting & Domains' && <Server className="w-3.5 h-3.5" />}
                                {cat === 'Website Development' && <Globe className="w-3.5 h-3.5" />}
                                {cat === 'Digital Marketing' && <TrendingUp className="w-3.5 h-3.5" />}
                                {cat === 'Software Solutions' && <Sliders className="w-3.5 h-3.5" />}
                                {cat === 'Graphic Design' && <Palette className="w-3.5 h-3.5" />}
                                <span>{label}</span>

                                {hasSelection && (
                                  <span className={`w-2 h-2 rounded-full ${isCatActive ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Modern Responsive Service Cards Grid Container */}
                    <div className="relative">
                      <div className="max-h-[440px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/40 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                          {(() => {
                            const filtered = serviceRequirementsList.filter(item => {
                              const matchCategory = estSelectedReqCategory === 'all' || item.category === estSelectedReqCategory;
                              const searchLower = estReqSearch.toLowerCase();
                              const matchSearch = !estReqSearch ||
                                item.label.toLowerCase().includes(searchLower) ||
                                item.labelBn.toLowerCase().includes(searchLower) ||
                                item.labelAr.toLowerCase().includes(searchLower) ||
                                item.desc.toLowerCase().includes(searchLower) ||
                                item.descBn.toLowerCase().includes(searchLower) ||
                                item.descAr.toLowerCase().includes(searchLower);
                              return matchCategory && matchSearch;
                            });

                            if (filtered.length === 0) {
                              return (
                                <div className="col-span-full py-12 text-center flex flex-col items-center justify-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                  <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-400">
                                    <Search className="w-6 h-6 animate-pulse text-emerald-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                                      {language === 'bn' ? "কোনো সার্ভিস রিকোয়ারমেন্ট পাওয়া যায়নি" : language === 'ar' ? "لم يتم العثور على أي متطلب للخدمة" : "No matching services found"}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                      {language === 'bn' ? "অন্য কীওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার রিসেট করুন" : "Try different keywords or clear the category filter"}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => { setEstReqSearch(''); setEstSelectedReqCategory('all'); }}
                                    className="px-3.5 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/20 transition-all cursor-pointer"
                                  >
                                    {language === 'bn' ? "ফিল্টার রিসেট করুন" : language === 'ar' ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                                  </button>
                                </div>
                              );
                            }

                            return filtered.map((item) => {
                              const isSelected = estSelectedReqsByCategory[item.category] === item.id;
                              const ItemIcon = item.icon || Sparkles;

                              const localizedLabel = language === 'bn' ? item.labelBn : language === 'ar' ? item.labelAr : item.label;
                              const localizedDesc = language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc;
                              const localizedCategory = language === 'bn' ? item.categoryBn : language === 'ar' ? item.categoryAr : item.category;
                              const itemPriceUsd = serviceRequirementsPrices[item.id] || 0;

                              // Bespoke Category Icon Theming
                              let catTheme = {
                                iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
                                badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                              };
                              if (item.category === 'Hosting & Domains') {
                                catTheme = {
                                  iconBg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/20',
                                  badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
                                };
                              } else if (item.category === 'Digital Marketing') {
                                catTheme = {
                                  iconBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20',
                                  badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                };
                              } else if (item.category === 'Software Solutions') {
                                catTheme = {
                                  iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                                  badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                };
                              } else if (item.category === 'Graphic Design') {
                                catTheme = {
                                  iconBg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20',
                                  badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                };
                              }

                              return (
                                <motion.div
                                  key={item.id}
                                  whileHover={{ y: -2, scale: 1.008 }}
                                  whileTap={{ scale: 0.992 }}
                                  onClick={() => {
                                    setEstSelectedReqsByCategory(prev => {
                                      const updated = { ...prev };
                                      if (updated[item.category] === item.id) {
                                        delete updated[item.category];
                                      } else {
                                        updated[item.category] = item.id;
                                      }
                                      return updated;
                                    });

                                    // Automatically map domain category type
                                    if (item.id.includes('Ecommerce')) setCustomEstCategory('ecommerce');
                                    else if (item.id.includes('Blog') || item.id.includes('News')) setCustomEstCategory('blog');
                                    else if (item.id.includes('Portfolio')) setCustomEstCategory('portfolio');
                                    else if (item.id.includes('POS') || item.id.includes('School')) setCustomEstCategory('pos');
                                    else if (item.id.includes('Custom SaaS') || item.id.includes('Application')) setCustomEstCategory('custom_app');
                                    else if (item.category === 'Website Development') setCustomEstCategory('website');
                                  }}
                                  className={`group relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                                    isSelected
                                      ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 dark:from-[#062c22]/50 dark:via-[#0F172A] dark:to-[#042018]/50 border-emerald-500 dark:border-emerald-400 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/25'
                                      : 'bg-white/80 dark:bg-[#0E1626]/80 backdrop-blur-md border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-400/80 dark:hover:border-emerald-500/60 shadow-sm hover:shadow-md'
                                  }`}
                                >
                                  {/* Top Edge Ambient Highlight on Selected */}
                                  {isSelected && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
                                  )}

                                  <div className="space-y-2.5">
                                    {/* Card Header Row */}
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3 min-w-0">
                                        <div className={`p-2.5 rounded-xl shrink-0 border transition-all duration-300 group-hover:scale-105 shadow-sm ${catTheme.iconBg}`}>
                                          <ItemIcon className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${catTheme.badgeBg}`}>
                                              {localizedCategory}
                                            </span>
                                            {itemPriceUsd > 0 && (
                                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                                {renderPrice(itemPriceUsd)}
                                              </span>
                                            )}
                                          </div>
                                          <h4 className={`text-xs sm:text-sm font-bold tracking-tight leading-snug transition-colors ${
                                            isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                          }`}>
                                            {localizedLabel}
                                          </h4>
                                        </div>
                                      </div>

                                      {/* Custom Status Checkmark Circle */}
                                      <div className="shrink-0 self-start pt-0.5">
                                        {isSelected ? (
                                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/40 scale-105 transition-all">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          </div>
                                        ) : (
                                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 group-hover:border-emerald-400 transition-colors flex items-center justify-center" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal line-clamp-2">
                                      {localizedDesc}
                                    </p>
                                  </div>

                                  {/* Card Footer */}
                                  <div className="pt-2.5 mt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[10px]">
                                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                                      {item.category}
                                    </span>
                                    {isSelected ? (
                                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                        <span>{language === 'bn' ? 'নির্বাচিত' : 'Configured'}</span>
                                      </span>
                                    ) : (
                                      <span className="font-semibold text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {language === 'bn' ? 'যুক্ত করতে ক্লিক করুন →' : 'Click to select →'}
                                      </span>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Selected Architecture Stack Dock */}
                    <AnimatePresence>
                      {Object.keys(estSelectedReqsByCategory).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.98 }}
                          className="p-4 sm:p-4.5 bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-xl border border-emerald-500/30 dark:border-emerald-500/25 rounded-2xl shadow-lg shadow-emerald-500/5 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Sparkles className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                {language === 'bn' ? 'নির্বাচিত সার্ভিস আর্কিটেকচার' : 'Configured Service Architecture'}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                                {Object.keys(estSelectedReqsByCategory).length} / 5
                              </span>
                            </div>

                            {/* Cumulative Base Price */}
                            {(() => {
                              const totalBase = (Object.values(estSelectedReqsByCategory) as string[]).reduce((sum: number, itemId: string) => {
                                return sum + (serviceRequirementsPrices[itemId] || 0);
                              }, 0);

                              return totalBase > 0 ? (
                                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <span>{language === 'bn' ? 'মোট বেস ইনভেস্টমেন্ট:' : 'Total Base Value:'}</span>
                                  <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                                    {renderPrice(totalBase)}
                                  </span>
                                </div>
                              ) : null;
                            })()}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {Object.entries(estSelectedReqsByCategory).map(([category, itemId]) => {
                              const item = serviceRequirementsList.find(r => r.id === itemId);
                              if (!item) return null;
                              const label = language === 'bn' ? item.labelBn : language === 'ar' ? item.labelAr : item.label;
                              const ItemIcon = item.icon || Sparkles;
                              const itemIdStr = itemId as string;
                              const itemPriceUsd = serviceRequirementsPrices[itemIdStr] || 0;

                              let pillColor = "border-indigo-500/20 bg-indigo-500/5 text-indigo-700 dark:text-indigo-300";
                              if (category === 'Hosting & Domains') pillColor = "border-sky-500/20 bg-sky-500/5 text-sky-700 dark:text-sky-300";
                              else if (category === 'Digital Marketing') pillColor = "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-300";
                              else if (category === 'Software Solutions') pillColor = "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300";
                              else if (category === 'Graphic Design') pillColor = "border-purple-500/20 bg-purple-500/5 text-purple-700 dark:text-purple-300";

                              return (
                                <motion.div
                                  key={category}
                                  layout
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.9, opacity: 0 }}
                                  whileHover={{ scale: 1.02 }}
                                  className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl shadow-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm transition-all ${pillColor}`}
                                >
                                  <div className="p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40">
                                    <ItemIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex flex-col text-left leading-none">
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                      {category}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-0.5 max-w-[180px] sm:max-w-xs truncate flex items-center gap-1">
                                      {label} {itemPriceUsd > 0 && <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">({renderPrice(itemPriceUsd)})</span>}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setEstSelectedReqsByCategory(prev => {
                                      const updated = { ...prev };
                                      delete updated[category];
                                      return updated;
                                    })}
                                    className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer ml-1 transition-colors"
                                    title={language === 'bn' ? 'মুছে ফেলুন' : 'Remove item'}
                                  >
                                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Step 2: Scale & Pages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
                  <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-neutral-50/60 dark:bg-slate-900/40 border border-neutral-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-[11px]">
                          2
                        </div>
                        <label className="text-xs sm:text-sm font-black tracking-wide text-neutral-800 dark:text-slate-100">
                          {language === 'bn' ? 'প্রজেক্টের স্কেল / আকার:' : 'Project Scale & Complexity:'}
                        </label>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {customEstScale === 'starter' ? 'Lite' : customEstScale === 'enterprise' ? 'High-Scale' : 'Standard'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'starter', label: 'Starter', bn: 'স্টার্টার', sub: '0.8x (-20%)', icon: Sparkles },
                        { id: 'business', label: 'Business', bn: 'বিজনেস', sub: '1.0x (Standard)', icon: Rocket },
                        { id: 'enterprise', label: 'Enterprise', bn: 'এন্টারপ্রাইজ', sub: '1.8x (+80%)', icon: ShieldCheck }
                      ].map(sc => {
                        const ScIcon = sc.icon;
                        const isSelected = customEstScale === sc.id;
                        return (
                          <button
                            key={sc.id}
                            type="button"
                            onClick={() => setCustomEstScale(sc.id as any)}
                            className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-1 ring-blue-400 -translate-y-0.5'
                                : 'bg-white dark:bg-slate-800/80 border-neutral-200/90 dark:border-slate-700 text-neutral-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30'
                            }`}
                          >
                            <ScIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                            <span className="text-xs font-black">{language === 'bn' ? sc.bn : sc.label}</span>
                            <span className={`text-[9px] font-mono font-medium ${isSelected ? 'text-blue-100' : 'text-neutral-400 dark:text-slate-500'}`}>
                              {sc.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-neutral-50/60 dark:bg-slate-900/40 border border-neutral-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-[11px]">
                          3
                        </div>
                        <label className="text-xs sm:text-sm font-black tracking-wide text-neutral-800 dark:text-slate-100">
                          {language === 'bn' ? 'পেইজ / স্ক্রিন সংখ্যা:' : 'Total Pages / Screens:'}
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                          {customEstPages} {language === 'bn' ? 'টি পেইজ' : 'Pages'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setCustomEstPages(Math.max(1, customEstPages - 1))}
                        disabled={customEstPages <= 1}
                        className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 relative flex items-center">
                        <input
                          type="range"
                          min={1}
                          max={20}
                          value={customEstPages}
                          onChange={(e) => setCustomEstPages(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer h-2 bg-neutral-200 dark:bg-slate-700 rounded-lg"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setCustomEstPages(Math.min(20, customEstPages + 1))}
                        disabled={customEstPages >= 20}
                        className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-semibold text-neutral-400 dark:text-slate-500 px-1">
                      <span>1 Page (Landing)</span>
                      <span>3 Pages (Included)</span>
                      <span>20 Pages (Complex)</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Project Completion Timeline (Range Slider with Dynamic Priority Surcharge) */}
                <div className="space-y-4 pt-2 rounded-2xl bg-neutral-50/60 dark:bg-slate-900/40 p-4 sm:p-5 border border-neutral-200/80 dark:border-slate-800 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-[11px]">
                          4
                        </div>
                        <label className="text-xs sm:text-sm font-black tracking-wide text-neutral-800 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{language === 'bn' ? 'প্রজেক্ট ডেলিভারি টাইমলাইন:' : 'Project Delivery Timeline:'}</span>
                          <span className="text-rose-500 font-black text-sm">*</span>
                        </label>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-slate-400">
                        {language === 'bn'
                          ? 'জরুরি বা দ্রুত ডেলিভারির ক্ষেত্রে প্রায়োরিটি স্প্রিন্ট টিম কাজ করবে।'
                          : 'Choose your desired launch schedule. Accelerated VIP sprints adjust pricing accordingly.'}
                      </p>
                    </div>

                    {/* Dynamic Timeline Pill */}
                    {(() => {
                      const tInfo = getTimelineTierInfo(customEstTimelineDays);
                      return (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black shrink-0 shadow-sm ${tInfo.badgeColor}`}>
                          <span>{language === 'bn' ? tInfo.labelBn : tInfo.labelEn}</span>
                          <span className="px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono text-xs">
                            {customEstTimelineDays} {language === 'bn' ? 'দিন' : 'Days'}
                          </span>
                          <span className="font-extrabold text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                            {tInfo.surchargePct === '0%' ? (language === 'bn' ? 'বেস রেট' : 'Base Rate') : tInfo.surchargePct}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Range Slider Container */}
                  <div className="space-y-2 pt-1">
                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min={7}
                        max={30}
                        step={1}
                        value={customEstTimelineDays}
                        onChange={(e) => setCustomEstTimelineDays(Number(e.target.value))}
                        className="w-full cursor-pointer h-2.5 bg-neutral-200 dark:bg-slate-700 rounded-lg appearance-none accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>

                    {/* Timeline Markers */}
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 dark:text-slate-500 px-0.5">
                      <span className="text-amber-500 dark:text-amber-400 flex items-center gap-0.5">
                        <Zap className="w-3 h-3" /> 7-9 Days (VIP Sprint +15%)
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> 10-18 Days (Standard 0%)
                      </span>
                      <span className="text-teal-600 dark:text-teal-400">
                        19-30 Days (Saver -5%)
                      </span>
                    </div>
                  </div>

                  {/* Quick-Preset Shortcuts */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-1 border-t border-neutral-200/50 dark:border-slate-800/60">
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-slate-400 shrink-0 mr-1">
                      {language === 'bn' ? 'কুইক শিডিউল:' : 'Quick Presets:'}
                    </span>
                    {[
                      { days: 7, label: '7 Days (Fast Track)', bn: '৭ দিন (ফাস্ট ট্র্যাক)', surge: '+15%' },
                      { days: 14, label: '14 Days (Standard)', bn: '১৪ দিন (স্ট্যান্ডার্ড)', surge: '0%' },
                      { days: 21, label: '21 Days (Flexible)', bn: '২১ দিন (ফ্লেক্সিবল)', surge: '-5%' },
                      { days: 30, label: '30 Days (Economy)', bn: '৩০ দিন (সাশ্রয়ী)', surge: '-5%' }
                    ].map((preset) => {
                      const isSelected = customEstTimelineDays === preset.days;
                      return (
                        <button
                          key={preset.days}
                          type="button"
                          onClick={() => setCustomEstTimelineDays(preset.days)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-500'
                              : 'bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-neutral-200/80 dark:border-slate-700'
                          }`}
                        >
                          <span>{language === 'bn' ? preset.bn : preset.label}</span>
                          {preset.surge !== '0%' && (
                            <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                              preset.surge.startsWith('+') ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300' : 'bg-teal-500/20 text-teal-600 dark:text-teal-300'
                            }`}>
                              {preset.surge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 4: Add-on Features */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-[11px]">
                        5
                      </div>
                      <label className="text-xs sm:text-sm font-black tracking-wide text-neutral-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{language === 'bn' ? 'অতিরিক্ত ফিচার ও মডিউল বেছে নিন:' : 'Select Custom Addon Modules:'}</span>
                      </label>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                      {customEstFeatures.length} {language === 'bn' ? 'টি ফিচার সিলেক্টেড' : 'Selected'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                    {CUSTOM_ADDON_MODULES.map((fObj, idx) => {
                      const isChecked = customEstFeatures.includes(fObj.id);
                      const AddonIcon = fObj.icon;
                      const isTooltipActive = activeEstimatorAddonTooltip === fObj.id;

                      // Localized texts
                      const localizedName = language === 'bn' ? fObj.bn : (language === 'ar' && fObj.ar ? fObj.ar : fObj.label);
                      const localizedBadge = language === 'bn' ? fObj.badgeBn : (language === 'ar' && fObj.badgeAr ? fObj.badgeAr : fObj.badge);
                      const localizedUsage = language === 'bn' ? fObj.usageBn : (language === 'ar' && fObj.usageAr ? fObj.usageAr : fObj.usage);
                      const localizedBenefits = language === 'bn' ? fObj.benefitsBn : (language === 'ar' && fObj.benefitsAr ? fObj.benefitsAr : fObj.benefits);

                      const alignClasses = 
                        idx % 3 === 0
                          ? 'lg:left-0 lg:right-auto lg:translate-x-0 sm:left-0 sm:right-auto sm:translate-x-0'
                          : idx % 3 === 2
                          ? 'lg:right-0 lg:left-auto lg:translate-x-0 sm:right-0 sm:left-auto sm:translate-x-0'
                          : 'lg:left-1/2 lg:-translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2';

                      const arrowClasses = 
                        idx % 3 === 0
                          ? 'lg:left-8 sm:left-8'
                          : idx % 3 === 2
                          ? 'lg:right-8 sm:right-8'
                          : 'lg:left-1/2 lg:-translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2';

                      return (
                        <div
                          key={fObj.id}
                          className={`relative group/estaddon ${isTooltipActive ? 'z-40' : 'hover:z-30'}`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setCustomEstFeatures(prev =>
                                prev.includes(fObj.id) ? prev.filter(x => x !== fObj.id) : [...prev, fObj.id]
                              );
                            }}
                            className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left text-xs font-bold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                              isChecked
                                ? 'bg-white dark:bg-slate-800 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20 -translate-y-0.5'
                                : 'bg-white dark:bg-slate-800/80 border-neutral-200/90 dark:border-slate-700 text-neutral-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-violet-50/10 hover:-translate-y-0.5'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-xl transition-colors shrink-0 ${
                                isChecked
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'bg-neutral-100 dark:bg-slate-700/80 text-neutral-500 dark:text-slate-400 group-hover/estaddon:bg-violet-500/10 group-hover/estaddon:text-violet-500'
                              }`}>
                                <AddonIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="truncate block leading-tight text-[11px] sm:text-xs text-slate-800 dark:text-slate-100">{localizedName}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] sm:text-[10px] text-neutral-400 font-normal">Optional Addon</span>
                                  {/* Info trigger badge */}
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveEstimatorAddonTooltip(prev => prev === fObj.id ? null : fObj.id);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.stopPropagation();
                                        setActiveEstimatorAddonTooltip(prev => prev === fObj.id ? null : fObj.id);
                                      }
                                    }}
                                    className={`inline-flex items-center justify-center p-0.5 rounded-full transition-all cursor-pointer ${
                                      isTooltipActive 
                                        ? 'bg-violet-500 text-white shadow-sm' 
                                        : 'text-violet-500 dark:text-violet-400 hover:bg-violet-500/15'
                                    }`}
                                    title={language === 'bn' ? 'ব্যবহারের বিবরণ দেখতে ক্লিক করুন' : 'Click or hover to view usage explanation'}
                                  >
                                    <HelpCircle className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">{fObj.price}</span>
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-emerald-500 text-white' : 'border border-neutral-300 dark:border-slate-600 bg-neutral-50 dark:bg-slate-800'
                              }`}>
                                {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                              </div>
                            </div>
                          </button>

                          {/* 🌟 WebzoneBD Signature Gradient Glassmorphic Hover Tooltip */}
                          <div
                            role="tooltip"
                            className={`absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 sm:translate-x-0 w-[calc(100vw-3.5rem)] max-w-[310px] sm:max-w-[325px] p-3.5 rounded-2xl bg-slate-950/95 dark:bg-[#070C18]/95 backdrop-blur-2xl border border-violet-500/40 dark:border-violet-500/50 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(124,58,237,0.22)] text-left transition-all duration-200 ease-out z-50 ${alignClasses} ${
                              isTooltipActive
                                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                                : 'opacity-0 scale-95 translate-y-2 pointer-events-none invisible group-hover/estaddon:opacity-100 group-hover/estaddon:scale-100 group-hover/estaddon:translate-y-0 group-hover/estaddon:pointer-events-auto group-hover/estaddon:visible'
                            }`}
                          >
                            {/* WebzoneBD Multi-Gradient Top Shimmer Accent Bar */}
                            <div className="absolute top-0 left-3 right-3 h-[2.5px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-full" />
                            
                            {/* Subtle Radial Ambient Glow Orb */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-violet-500/20 rounded-full blur-xl pointer-events-none" />

                            {/* Header Section */}
                            <div className="flex items-start justify-between gap-2 relative z-10">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shrink-0 shadow-sm shadow-violet-500/30">
                                  <AddonIcon className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-white truncate tracking-tight">
                                    {localizedName}
                                  </h5>
                                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                    {localizedBadge}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg shadow-sm">
                                  {fObj.price}
                                </span>
                                {isTooltipActive && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveEstimatorAddonTooltip(null);
                                    }}
                                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Close"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Glass Divider */}
                            <div className="my-2.5 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                            {/* Brief Usage Explanation */}
                            <div className="relative z-10 space-y-2">
                              <div className="flex items-start gap-1.5">
                                <Sparkles className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-relaxed text-slate-200 font-medium">
                                  {localizedUsage}
                                </p>
                              </div>

                              {/* Key Capabilities Checklist */}
                              <div className="pt-1 space-y-1">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                  {language === 'bn' ? 'মূল সুবিধাসমূহ:' : 'Key Capabilities:'}
                                </span>
                                {localizedBenefits.map((benefit: string, bIdx: number) => (
                                  <div key={bIdx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span className="truncate">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Footer with WebzoneBD Badge & State */}
                            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] relative z-10">
                              <span className="text-violet-300/90 font-medium flex items-center gap-1">
                                <Layers className="w-2.5 h-2.5 text-violet-400" />
                                WebzoneBD Addon
                              </span>
                              <span className={`font-semibold ${isChecked ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {isChecked 
                                  ? (language === 'bn' ? '✓ সিলেক্টেড' : '✓ Selected') 
                                  : (language === 'bn' ? 'যুক্ত করতে ক্লিক করুন' : 'Click card to select')
                                }
                              </span>
                            </div>

                            {/* Bottom Arrow Notch */}
                            <div 
                              className={`absolute -bottom-1.5 w-3 h-3 rotate-45 bg-slate-950/95 dark:bg-[#070C18]/95 border-r border-b border-violet-500/40 dark:border-violet-500/50 ${arrowClasses}`} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DYNAMIC COST BREAKDOWN SUMMARY CARD (BASE COST VS. OPTIONAL ADD-ONS) */}
                {(() => {
                  const domainPrices: Record<string, { label: string; bn: string; base: number }> = {
                    website: { label: 'Business Website', bn: 'বিজনেস ওয়েবসাইট', base: 149 },
                    ecommerce: { label: 'E-Commerce Store', bn: 'ই-কমার্স অনলাইন শপ', base: 199 },
                    blog: { label: 'Blog & News Portal', bn: 'ব্লগ ও নিউজ পোর্টাল', base: 119 },
                    portfolio: { label: 'Portfolio & Personal', bn: 'পোর্টফোলিও ওয়েবসাইট', base: 99 },
                    custom_app: { label: 'Custom Web Application', bn: 'কাস্টম ওয়েব অ্যাপ্লিকেশন', base: 269 },
                    pos: { label: 'POS / ERP System', bn: 'পিওএস ও ইনভেন্টরি সিস্টেম', base: 249 }
                  };

                  const currentDomain = domainPrices[customEstCategory] || { label: 'Custom Web Solution', bn: 'কাস্টম সলিউশন', base: 99 };
                  const matchedCat = COMPANY_CATEGORIES.find(c => c.name === customEstCompanyCategory || c.nameBn === customEstCompanyCategory || c.id === customEstCompanyCategory);
                  const catMultiplier = matchedCat?.multiplier || 1.0;
                  const scaleMultiplier = customEstScale === 'starter' ? 0.8 : customEstScale === 'enterprise' ? 1.8 : 1.0;
                  
                  // Base Platform Subtotal before timeline
                  const platformBaseCost = Math.round(currentDomain.base * catMultiplier * scaleMultiplier);
                  const extraPagesCount = Math.max(0, customEstPages - 3);
                  const pagesCost = extraPagesCount * 15;
                  const totalBaseCost = platformBaseCost + pagesCost;

                  // Addon Modules Breakdown
                  const allAddons = CUSTOM_ADDON_MODULES.map(a => ({ id: a.id, label: a.label, bn: a.bn, price: a.priceNum }));

                  const selectedAddonsList = allAddons.filter(a => customEstFeatures.includes(a.id));
                  const totalAddonsCost = selectedAddonsList.reduce((sum, a) => sum + a.price, 0);

                  const grandTotal = getCustomEstimatedPrice();
                  const advanceBooking = Math.round(grandTotal * 0.25);
                  const milestoneBalance = grandTotal - advanceBooking;

                  const timelineInfo = getTimelineTierInfo(customEstTimelineDays);

                  const basePercentage = grandTotal > 0 ? Math.min(100, Math.round((totalBaseCost / grandTotal) * 100)) : 70;
                  const addonPercentage = 100 - basePercentage;

                  return (
                    <div className="rounded-2xl border border-neutral-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-neutral-200/40 dark:shadow-slate-950/60 overflow-hidden text-left transition-all">
                      {/* Breakdown Card Header */}
                      <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-slate-800 bg-gradient-to-r from-neutral-50 via-emerald-500/5 to-teal-500/10 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white">
                                {language === 'bn' ? '📊 খরচের বিস্তারিত হিসাব (Cost Breakdown)' : '📊 Cost Breakdown & Investment Summary'}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Live Audit
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-slate-400">
                              {language === 'bn' 
                                ? 'বেস প্ল্যাটফর্ম আর্কিটেকচার, ডেলিভারি শিডিউল ও ঐচ্ছিক অ্যাড-অন ফিচারের স্বচ্ছ বিবরণী।' 
                                : 'Transparent analysis of base platform engineering, delivery cadence & optional modules.'}
                            </p>
                          </div>
                        </div>

                        {/* Ratio Pill */}
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                          <div className="text-right hidden sm:block">
                            <div className="text-[10px] font-mono uppercase text-neutral-400">Ratio</div>
                            <div className="text-xs font-bold text-neutral-700 dark:text-slate-200">{basePercentage}% Base / {addonPercentage}% Addons</div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Ratio Proportion Bar */}
                      <div className="w-full bg-neutral-100 dark:bg-slate-800 h-1.5 flex overflow-hidden">
                        <div 
                          style={{ width: `${basePercentage}%` }} 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500" 
                          title={`Base Platform: ${basePercentage}%`}
                        />
                        <div 
                          style={{ width: `${addonPercentage}%` }} 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500" 
                          title={`Addon Modules: ${addonPercentage}%`}
                        />
                      </div>

                      {/* Two Column Table / List Breakdown */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100 dark:divide-slate-800">
                        {/* COLUMN 1: BASE SCOPE & INFRASTRUCTURE */}
                        <div className="p-4 sm:p-5 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span>{language === 'bn' ? '১. বেস প্ল্যাটফর্ম ও শিডিউল' : '1. Base Platform & Schedule'}</span>
                            </span>
                            <span className="text-xs font-extrabold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {renderPrice(totalBaseCost)}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs divide-y divide-neutral-100/80 dark:divide-slate-800/60">
                            {/* Domain Base */}
                            <div className="pt-1.5 flex items-center justify-between gap-2 text-neutral-700 dark:text-slate-300">
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-400 font-mono text-[11px]">•</span>
                                <span className="font-medium truncate">{language === 'bn' ? currentDomain.bn : currentDomain.label} ({language === 'bn' ? 'বেস সেটআপ' : 'Core Setup'})</span>
                              </div>
                              <span className="font-semibold text-neutral-900 dark:text-white shrink-0 font-mono">{renderPrice(currentDomain.base)}</span>
                            </div>

                            {/* Industry Multiplier */}
                            <div className="pt-1.5 flex items-center justify-between gap-2 text-neutral-700 dark:text-slate-300">
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-400 font-mono text-[11px]">•</span>
                                <span className="font-medium truncate">
                                  {language === 'bn' ? 'ইন্ডাস্ট্রি স্কেল:' : 'Industry Profile:'} {matchedCat ? (language === 'bn' ? matchedCat.nameBn : matchedCat.name) : 'Standard'}
                                </span>
                              </div>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 font-mono">
                                {catMultiplier}x {catMultiplier === 1 ? 'Scale' : catMultiplier > 1 ? `(+${Math.round((catMultiplier - 1) * 100)}%)` : `(${Math.round((catMultiplier - 1) * 100)}%)`}
                              </span>
                            </div>

                            {/* Project Tier */}
                            <div className="pt-1.5 flex items-center justify-between gap-2 text-neutral-700 dark:text-slate-300">
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-400 font-mono text-[11px]">•</span>
                                <span className="font-medium truncate">
                                  {language === 'bn' ? 'প্রজেক্ট স্কেল স্কেলিং:' : 'Project Tier Scale:'} <strong className="capitalize">{customEstScale}</strong>
                                </span>
                              </div>
                              <span className="font-semibold text-neutral-900 dark:text-white shrink-0 font-mono">
                                {customEstScale === 'starter' ? '0.8x (-20%)' : customEstScale === 'enterprise' ? '1.8x (+80%)' : '1.0x (Standard)'}
                              </span>
                            </div>

                            {/* Page Volume */}
                            <div className="pt-1.5 flex items-center justify-between gap-2 text-neutral-700 dark:text-slate-300">
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-400 font-mono text-[11px]">•</span>
                                <span className="font-medium truncate">
                                  {customEstPages} {language === 'bn' ? 'টি পেইজ (৩টি অন্তর্ভুক্ত + ' + extraPagesCount + 'টি অতিরিক্ত)' : `Pages (3 Incl. + ${extraPagesCount} Extra @ $15)`}
                                </span>
                              </div>
                              <span className="font-semibold text-neutral-900 dark:text-white shrink-0 font-mono">
                                {extraPagesCount > 0 ? `+${renderPrice(pagesCost)}` : (language === 'bn' ? 'অন্তর্ভুক্ত' : 'Included')}
                              </span>
                            </div>

                            {/* Delivery Timeline Schedule */}
                            <div className="pt-1.5 flex items-center justify-between gap-2 text-neutral-700 dark:text-slate-300">
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-400 font-mono text-[11px]">•</span>
                                <span className="font-medium truncate">
                                  {language === 'bn' ? 'ডেলিভারি শিডিউল:' : 'Delivery Timeline:'} {customEstTimelineDays} {language === 'bn' ? 'দিন' : 'Days'} ({language === 'bn' ? timelineInfo.labelBn : timelineInfo.labelEn})
                                </span>
                              </div>
                              <span className={`font-semibold shrink-0 font-mono ${
                                timelineInfo.multiplier > 1 
                                  ? 'text-rose-600 dark:text-rose-400' 
                                  : timelineInfo.multiplier < 1 
                                    ? 'text-teal-600 dark:text-teal-400' 
                                    : 'text-neutral-900 dark:text-white'
                              }`}>
                                {timelineInfo.multiplier === 1.0 
                                  ? (language === 'bn' ? 'স্ট্যান্ডার্ড (০%)' : 'Standard (0%)') 
                                  : `${timelineInfo.surchargePct} (${timelineInfo.multiplier}x)`
                                }
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-neutral-500 dark:text-slate-400 border-t border-neutral-100 dark:border-slate-800">
                            <span>{language === 'bn' ? 'বেস সাবটোটাল:' : 'Base Architecture Subtotal:'}</span>
                            <span className="text-neutral-900 dark:text-white font-mono font-black">{renderPrice(totalBaseCost)}</span>
                          </div>
                        </div>

                        {/* COLUMN 2: OPTIONAL ADD-ON MODULES */}
                        <div className="p-4 sm:p-5 space-y-3.5 bg-neutral-50/40 dark:bg-slate-900/40">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                              <span>{language === 'bn' ? '২. অতিরিক্ত সিলেক্টেড অ্যাড-অন' : '2. Optional Selected Addons'}</span>
                            </span>
                            <span className="text-xs font-extrabold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {renderPrice(totalAddonsCost)}
                            </span>
                          </div>

                          {selectedAddonsList.length === 0 ? (
                            <div className="py-6 text-center space-y-1">
                              <Sparkles className="w-5 h-5 mx-auto text-neutral-300 dark:text-slate-600" />
                              <p className="text-xs text-neutral-400 dark:text-slate-500 font-medium">
                                {language === 'bn' ? 'কোনো অতিরিক্ত অ্যাড-অন সিলেক্ট করা হয়নি।' : 'No optional addons selected (Base scope only).'}
                              </p>
                              <p className="text-[10px] text-neutral-400 dark:text-slate-500">
                                {language === 'bn' ? 'প্রয়োজন অনুযায়ী উপরের মডিউলগুলো টিক দিয়ে যুক্ত করতে পারেন।' : 'You can select addons from step 4 above anytime.'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 text-xs divide-y divide-neutral-100/80 dark:divide-slate-800/60 max-h-48 overflow-y-auto pr-1">
                              {selectedAddonsList.map((addonItem) => (
                                <div key={addonItem.id} className="pt-1.5 flex items-center justify-between gap-2 text-neutral-700 dark:text-slate-300">
                                  <div className="flex items-center gap-2 truncate">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span className="font-medium truncate">{language === 'bn' ? addonItem.bn : addonItem.label}</span>
                                  </div>
                                  <span className="font-semibold text-teal-600 dark:text-teal-400 shrink-0 font-mono">
                                    +{renderPrice(addonItem.price)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-neutral-500 dark:text-slate-400 border-t border-neutral-100 dark:border-slate-800">
                            <span>{language === 'bn' ? 'অ্যাড-অন সাবটোটাল:' : 'Addon Modules Subtotal:'}</span>
                            <span className="text-neutral-900 dark:text-white font-mono font-black">{renderPrice(totalAddonsCost)}</span>
                          </div>
                        </div>
                      </div>

                      {/* SUMMARY FOOTER STRIP */}
                      <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-t border-neutral-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-neutral-600 dark:text-slate-300 flex items-center gap-1">
                            <span>🛡️ Escrow Milestone:</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold">
                            25% Booking ({renderPrice(advanceBooking)})
                          </span>
                          <span className="text-neutral-400">+</span>
                          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 font-extrabold">
                            75% On Delivery ({renderPrice(milestoneBalance)})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-500 dark:text-slate-400">Total Investment:</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            {renderPrice(grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Step 5: Summary & Instant Quote Dispatch */}
                <div className="pt-6 border-t border-neutral-200/90 dark:border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 bg-gradient-to-br from-neutral-50 via-white to-emerald-50/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/20 p-5 sm:p-6 rounded-3xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {language === 'bn' ? 'প্রজেক্ট ইনভেস্টমেন্ট হিসাব' : 'Estimated Investment Summary'}
                      </span>
                    </div>
                    
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-mono tracking-tight">
                        {renderPrice(getCustomEstimatedPrice())}
                      </div>
                      <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                        🛡️ {language === 'bn' ? '২৫% বুকিং:' : '25% Advance:'} {renderPrice(Math.round(getCustomEstimatedPrice() * 0.25))}
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-neutral-500 dark:text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{language === 'bn' ? 'কোনো গোপন বা অতিরিক্ত চার্জ নেই • ১০০% মাইলস্টোন নিরাপদ' : 'Zero hidden charges • 100% milestone protected workflow'}</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!customEstCompanyCategory) {
                          setCompanyCategoryError(true);
                          triggerToast(language === 'bn' ? 'অনুগ্রহ করে কোম্পানি ক্যাটাগরি নির্বাচন করুন!' : 'Please select your Company Category!');
                          const el = document.getElementById('custom-estimator-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          return;
                        }
                        const calculatedPrice = getCustomEstimatedPrice();
                        const timelineInfo = getTimelineTierInfo(customEstTimelineDays);
                        setOrderCompanyCategory(customEstCompanyCategory);
                        if (Object.keys(estSelectedReqsByCategory).length > 0) {
                          setSelectedReqsByCategory(estSelectedReqsByCategory);
                        }
                        handleOpenOrderModal(`Custom ${customEstCategory.toUpperCase()} Project`, 'Custom Scope', true, undefined, undefined, customEstFeatures);
                      }}
                      className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে রিকোয়ারমেন্ট ও কোট পাঠান' : 'Send Scope & Quote via WhatsApp'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
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
                    <motion.div 
                      key={fpObj.id}
                      whileHover={{ 
                        scale: 1.03, 
                        y: -6,
                        boxShadow: "0 25px 50px rgba(139,92,246,0.2)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="rounded-2xl p-[1px] bg-gradient-to-br from-slate-800 to-slate-900/40 hover:from-purple-500 hover:via-amber-400 hover:to-rose-500 transition-all duration-350 overflow-hidden flex flex-col justify-between text-left relative group shadow-lg"
                    >
                      <div className="bg-slate-950 text-white rounded-[15px] p-5 w-full h-full flex flex-col justify-between relative">
                      
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
                            {renderPrice(fpObj.price)}
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
                              paymentMethod: "WhatsApp Order Direct",
                              paymentStatus: 'completed'
                            });
                            triggerToast(language === 'bn' 
                              ? `"${fpObj.titleBn}" অর্ডার প্রসেস হচ্ছে... আপনাকে WhatsApp-এ রিডাইরেক্ট করা হচ্ছে।` 
                              : `Processing WhatsApp order for "${fpObj.title}"... Redirecting now.`);
                            setTimeout(() => {
                              window.open(`https://wa.me/966570511931?text=${encodeURIComponent(`Assalamu Alaikum WebzoneBD, I would like to order the featured package: "${fpObj.title}" (Price: $${fpObj.price}). Please guide me with the details.`)}`, '_blank');
                            }, 800);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-[10px] font-black rounded-lg hover:opacity-95 active:scale-95 text-white flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 inline" />
                          <span>{language === 'bn' ? 'WhatsApp-এ অর্ডার' : 'Order via WhatsApp'}</span>
                        </button>
                      </div>
                    </div>
                   </motion.div>
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
                      <span className="text-slate-400 text-[9px] uppercase font-bold block flex items-center gap-1">Max Budget: {renderPrice(pkgMaxPrice)}</span>
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
                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
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
                        <motion.div 
                          key={pkg.id}
                          variants={{
                            hidden: { opacity: 0, y: 30, scale: 0.95 },
                            show: { 
                              opacity: 1, 
                              y: 0, 
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 24
                              }
                            }
                          }}
                          whileHover={{ 
                            y: -6,
                            scale: 1.012,
                            boxShadow: "0 20px 40px rgba(139,92,246,0.15)"
                          }}
                          className={`group relative rounded-2xl p-[1px] bg-gradient-to-br from-neutral-200 to-neutral-300/40 dark:from-slate-800 dark:to-slate-900/40 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 dark:hover:from-purple-500 dark:hover:via-pink-500 dark:hover:to-indigo-500 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm text-left h-full`}
                        >
                          <div className="bg-white dark:bg-slate-900 rounded-[15px] overflow-hidden flex flex-col justify-between h-full w-full">
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
                              {renderPrice(pkg.price)}
                            </p>

                            {/* Features list checklist */}
                            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                              {(language === 'bn' ? pkg.featuresBn : pkg.features).map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[10px]">
                                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 stroke-[3] group-hover:scale-110 transition-transform" />
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
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
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
                              className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-[9px] font-mono font-black rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
                            >
                              View Details
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleQuickBookPackage(pkg)}
                              className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[10px] font-black rounded-lg hover:opacity-95 shadow transition-all duration-200 flex items-center justify-center gap-1 focus:outline-none cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-white/90" />
                              <span>{language === 'bn' ? 'WhatsApp-এ অর্ডার' : 'Order via WhatsApp'}</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })
                  )}
                </motion.div>
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

          {/* Subtle elegant horizontal line separator above the section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-slate-800 to-transparent w-full" />
          </div>

          {/* ================= KEY TECHNOLOGIES VISUAL SECTION ================= */}
          <section className="max-w-7xl mx-auto pt-4 pb-0 space-y-4 overflow-hidden" id="tech-leverage-services">
            
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes servicesMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes servicesMarqueeReverse {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
              }
              .services-animate-marquee {
                animation: servicesMarquee 38s linear infinite;
              }
              .services-animate-marquee-reverse {
                animation: servicesMarqueeReverse 38s linear infinite;
              }
              .services-marquee-hover-pause:hover .services-animate-marquee,
              .services-marquee-hover-pause:hover .services-animate-marquee-reverse {
                animation-play-state: paused;
              }
            ` }} />

            <div className="text-center space-y-2 px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                {language === 'bn' ? 'আমরা যে প্রযুক্তিসমূহ ব্যবহার করি' : language === 'ar' ? 'ترسانتنا من اللغات والتقنيات البرمجية' : 'Technologies We Leverage'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
                {language === 'bn' 
                  ? 'আমরা সুরক্ষিত, হালকা এবং অত্যন্ত স্কেলেবল প্ল্যাটফর্ম তৈরি করতে আধুনিক এবং অত্যন্ত দক্ষ প্রযুক্তি ম্যাট্রিক্স ব্যবহার করি।' 
                  : language === 'ar' 
                    ? 'نحن نوظف مصفوفات تكنولوجية حديثة وعالية الكفاءة لبناء منصات آمنة وخفيفة الوزن وفائقة القابلية للتوسع.' 
                    : 'We employ modern, highly efficient technology matrices to compile secure, lightweight, and super scalable platforms.'}
              </p>
            </div>

            {/* Sliding Marquees */}
            <div className="space-y-5 services-marquee-hover-pause relative py-4">
              {/* Left and Right Edge Fade Gradients for visual perfection */}
              <div className="absolute inset-y-0 left-0 w-12 sm:w-36 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 sm:w-36 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

              {/* Row 1: Sliding Left */}
              <div className="overflow-hidden flex w-full relative">
                <div className="flex gap-4 services-animate-marquee whitespace-nowrap min-w-max">
                  {/* First set of badges */}
                  {[
                    { name: "Laravel", icon: "⚙️", bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200/60 dark:border-red-900/30", text: "text-red-600 dark:text-red-400" },
                    { name: "PHP", icon: "🐘", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200/60 dark:border-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
                    { name: "HTML & CSS", icon: "🎨", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200/60 dark:border-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
                    { name: "WordPress", icon: "📝", bg: "bg-cyan-50 dark:bg-cyan-950/20", border: "border-cyan-200/60 dark:border-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" },
                    { name: "WooCommerce", icon: "🛍️", bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200/60 dark:border-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
                    { name: "React", icon: "⚛️", bg: "bg-sky-50 dark:bg-sky-950/20", border: "border-sky-200/60 dark:border-sky-900/30", text: "text-sky-600 dark:text-sky-400" }
                  ].map((tech, idx) => (
                    <div 
                      key={`r1-1-${idx}`}
                      className={`px-5 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-default ${tech.bg} ${tech.border} flex items-center gap-2.5 text-xs font-black ${tech.text} shadow-xs hover:shadow-md`}
                    >
                      <span className="text-base">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                  {/* Duplicated set for infinite gapless flow */}
                  {[
                    { name: "Laravel", icon: "⚙️", bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200/60 dark:border-red-900/30", text: "text-red-600 dark:text-red-400" },
                    { name: "PHP", icon: "🐘", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200/60 dark:border-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
                    { name: "HTML & CSS", icon: "🎨", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200/60 dark:border-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
                    { name: "WordPress", icon: "📝", bg: "bg-cyan-50 dark:bg-cyan-950/20", border: "border-cyan-200/60 dark:border-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" },
                    { name: "WooCommerce", icon: "🛍️", bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200/60 dark:border-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
                    { name: "React", icon: "⚛️", bg: "bg-sky-50 dark:bg-sky-950/20", border: "border-sky-200/60 dark:border-sky-900/30", text: "text-sky-600 dark:text-sky-400" }
                  ].map((tech, idx) => (
                    <div 
                      key={`r1-2-${idx}`}
                      className={`px-5 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-default ${tech.bg} ${tech.border} flex items-center gap-2.5 text-xs font-black ${tech.text} shadow-xs hover:shadow-md`}
                    >
                      <span className="text-base">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2: Sliding Right */}
              <div className="overflow-hidden flex w-full relative">
                <div className="flex gap-4 services-animate-marquee-reverse whitespace-nowrap min-w-max">
                  {/* First set of badges */}
                  {[
                    { name: "Next.js", icon: "▲", bg: "bg-neutral-50 dark:bg-neutral-900/30", border: "border-neutral-200/60 dark:border-neutral-800", text: "text-black dark:text-white" },
                    { name: "MySQL", icon: "🛢️", bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200/60 dark:border-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
                    { name: "Cloud Hosting", icon: "☁️", bg: "bg-indigo-50 dark:bg-indigo-950/20", border: "border-indigo-200/60 dark:border-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
                    { name: "Google Ads", icon: "📈", bg: "bg-yellow-50 dark:bg-yellow-950/20", border: "border-yellow-200/60 dark:border-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
                    { name: "Meta Ads", icon: "🎯", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200/60 dark:border-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
                    { name: "SEO Optimization", icon: "🔍", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200/60 dark:border-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" }
                  ].map((tech, idx) => (
                    <div 
                      key={`r2-1-${idx}`}
                      className={`px-5 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-default ${tech.bg} ${tech.border} flex items-center gap-2.5 text-xs font-black ${tech.text} shadow-xs hover:shadow-md`}
                    >
                      <span className="text-base">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                  {/* Duplicated set for infinite gapless flow */}
                  {[
                    { name: "Next.js", icon: "▲", bg: "bg-neutral-50 dark:bg-neutral-900/30", border: "border-neutral-200/60 dark:border-neutral-800", text: "text-black dark:text-white" },
                    { name: "MySQL", icon: "🛢️", bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200/60 dark:border-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
                    { name: "Cloud Hosting", icon: "☁️", bg: "bg-indigo-50 dark:bg-indigo-950/20", border: "border-indigo-200/60 dark:border-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
                    { name: "Google Ads", icon: "📈", bg: "bg-yellow-50 dark:bg-yellow-950/20", border: "border-yellow-200/60 dark:border-yellow-400/30", text: "text-yellow-600 dark:text-yellow-400" },
                    { name: "Meta Ads", icon: "🎯", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200/60 dark:border-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
                    { name: "SEO Optimization", icon: "🔍", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200/60 dark:border-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" }
                  ].map((tech, idx) => (
                    <div 
                      key={`r2-2-${idx}`}
                      className={`px-5 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-default ${tech.bg} ${tech.border} flex items-center gap-2.5 text-xs font-black ${tech.text} shadow-xs hover:shadow-md`}
                    >
                      <span className="text-base">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>
        </div>
      ) : selectedService ? (
        /* 3. SERVICE DETAIL PAGE (Renders ServiceDetails matching Digital Store / ProductDetails with advance payment option, gallery carousel, features, pricing, etc.) */
        <ServiceDetails
          service={selectedService}
          language={language}
          theme={theme}
          currency={currency}
          onBack={() => handleSelectService(null)}
          onNavigateToService={(srvId) => {
            const matched = catalogServices.find(s => s.id === srvId);
            if (matched) handleSelectService(matched);
          }}
          allServices={catalogServices}
          addSimulatedServiceOrder={addSimulatedServiceOrder}
          triggerToast={triggerToast}
          addToCart={addToCart}
          setCartOpen={setCartOpen}
          onOrderWhatsApp={(serviceName, packageName) => handleOpenOrderModal(serviceName, packageName, true)}
          onRequestQuotation={(serviceName, packageName) => handleOpenOrderModal(serviceName, packageName, false)}
        />
      ) : null}

      {false && (
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
                    {renderPrice(selectedService.startingPrice)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      addSimulatedServiceOrder({
                        id: "ord-det-buy-" + Date.now(),
                        serviceId: selectedService.id,
                        itemTitle: `${selectedService.title} (Detail Order)`,
                        price: selectedService.startingPrice,
                        date: new Date().toISOString().split('T')[0],
                        paymentMethod: "WhatsApp Order Direct",
                        paymentStatus: 'completed'
                      });
                      triggerToast(language === 'bn' ? `"${selectedService.titleBn || selectedService.title}" অর্ডার প্রসেস হচ্ছে... আপনাকে WhatsApp-এ রিডাইরেক্ট করা হচ্ছে।` : `Processing WhatsApp order for "${selectedService.title}"... Redirecting now.`);
                      setTimeout(() => {
                        window.open(`https://wa.me/966570511931?text=${encodeURIComponent(`Assalamu Alaikum WebzoneBD, I would like to order the service: "${selectedService.title}" (Price: $${selectedService.startingPrice}). Please help me proceed.`)}`, '_blank');
                      }, 800);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg active:scale-95 transition flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 inline" />
                    <span>{language === 'bn' ? 'WhatsApp-এ অর্ডার দিন' : 'Order via WhatsApp'}</span>
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
                    const recSrv = catalogServices.find(s => s.id === recId);
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
                          <span className="text-[10px] text-emerald-505 dark:text-emerald-400 font-mono font-bold">{renderPrice(recSrv.startingPrice)}</span>
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
                      {renderPrice(estimatedCost)}
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
          <div className="lg:hidden fixed bottom-[68px] md:bottom-0 left-4 right-4 md:left-0 md:right-0 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 md:border-0 md:border-t p-3 rounded-2xl md:rounded-none z-40 flex gap-2 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
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
                  itemTitle: `${selectedService.title} Mobile Order (WhatsApp)`,
                  price: selectedService.startingPrice,
                  date: new Date().toISOString().split('T')[0],
                  paymentMethod: "WhatsApp Order Direct",
                  paymentStatus: 'completed'
                });
                triggerToast(language === 'bn' ? `"${selectedService.titleBn || selectedService.title}" অর্ডার প্রসেস হচ্ছে... আপনাকে WhatsApp-এ রিডাইরেক্ট করা হচ্ছে।` : `Processing WhatsApp order for "${selectedService.title}"... Redirecting now.`);
                setTimeout(() => {
                  window.open(`https://wa.me/966570511931?text=${encodeURIComponent(`Assalamu Alaikum WebzoneBD, I would like to order the service: "${selectedService.title}" (Mobile Order - Price: $${selectedService.startingPrice}). Please guide me with the details.`)}`, '_blank');
                }, 800);
              }}
              className="flex-1 py-3 bg-emerald-650 bg-emerald-600 text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'WhatsApp অর্ডার' : 'Order via WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}



      {/* QUICK VIEW POPUP MODAL */}
      {quickViewService && (
        <div id="wbd-quickview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
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
                    {renderPrice(quickViewService.startingPrice)}
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
        <div id="wbd-quote-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-xs">
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
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="under-100">Under 1,000 থেকে 5,000 টাকা</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="100-500">5,000 থেকে 10,000 টাকা</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="500-1000">10,000 থেকে 30,000 টাকা</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="1000-plus">30,000 থেকে 50,000 টাকা থেকে বেশি</option>
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

      {/* 🟢 FLOATING ACTION BUTTON FOR WHATSAPP ASSISTANCE WITH PREMIUM GLASSMORPHISM */}
      {!isAnyPopupActive && (
        <div 
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] flex items-center gap-2 font-sans pointer-events-none"
          id="wbd-whatsapp-assistance-widget"
        >
          <div className="pointer-events-auto flex items-center gap-2 group">
            {/* Tooltip sliding to the left */}
            <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden sm:block">
              <div className="bg-white/95 dark:bg-slate-950/95 text-slate-800 dark:text-slate-100 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-slate-200/50 dark:border-slate-800/80 whitespace-nowrap backdrop-blur-md">
                {language === 'bn' ? 'সরাসরি সাহায্য পান 💬' : 'Custom Assistance 💬'}
              </div>
            </div>

            {/* Premium Glassmorphism Container */}
            <div className="relative p-[4px] rounded-full bg-white/20 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_15px_35px_rgba(16,185,129,0.3)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
              <motion.button
                type="button"
                onClick={handleWhatsappClick}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.93 }}
                className="relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-white overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 select-none shadow-inner"
                id="whatsapp-floating-action-button"
                aria-label="Contact via WhatsApp"
              >
                {/* Custom Ripple Wave Effects */}
                <AnimatePresence>
                  {whatsappRipples.map((ripple) => (
                    <motion.span
                      key={ripple.id}
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      onAnimationComplete={() => handleWhatsappRippleEnd(ripple.id)}
                      style={{
                        position: 'absolute',
                        top: ripple.y,
                        left: ripple.x,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        width: '30px',
                        height: '30px',
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    />
                  ))}
                </AnimatePresence>

                {/* Pulsing ring animation in background */}
                <span className="absolute inset-0 rounded-full bg-emerald-400/30 opacity-10 animate-ping pointer-events-none" />

                {/* Rotating Dynamic Icon */}
                <svg 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-5.5 h-5.5 sm:w-7 sm:h-7 relative z-10 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.858-4.37 9.862-9.743.002-2.602-1.01-5.05-2.85-6.892-1.84-1.842-4.29-2.853-6.894-2.854-5.441 0-9.863 4.37-9.867 9.745-.001 1.737.478 3.435 1.388 4.947l-.971 3.548 3.65-.951zm11.332-6.53c-.31-.156-1.834-.905-2.119-1.008-.285-.104-.493-.156-.701.156-.208.312-.806.104-1.008.156-.202.052-.405-.026-.715-.182-1.309-.64-2.18-1.554-2.521-2.144-.31-.53-.033-.817.234-1.05.241-.21.528-.613.593-.78.065-.166.033-.31-.016-.415-.049-.104-.493-1.196-.677-1.636-.179-.434-.378-.37-.521-.37-.134-.002-.288-.002-.442-.002-.154 0-.405.057-.617.285-.21.228-.802.784-.802 1.91 0 1.127.817 2.217.93 2.373.113.156 1.611 2.459 3.902 3.447.545.235.97.375 1.301.48.547.174 1.045.15 1.439.091.44-.066 1.353-.552 1.543-1.059.19-.506.19-.94.133-1.008-.057-.068-.208-.104-.519-.26z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 UNIFIED PREMIUM GLASSMORPHIC SERVICE ORDER & INQUIRY MODAL */}
      {isOrderModalOpen && (
        <div id="wbd-whatsapp-order-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0F172A] rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#E2E8F0]/30 dark:border-white/10 text-left"
          >
            {/* Top Branding Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

            <>
              {/* Modal Header */}
                <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0">
                        {orderIsWhatsAppRedirect ? (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.858-4.37 9.862-9.743.002-2.602-1.01-5.05-2.85-6.892-1.84-1.842-4.29-2.853-6.894-2.854-5.441 0-9.863 4.37-9.867 9.745-.001 1.737.478 3.435 1.388 4.947l-.971 3.548 3.65-.951zm11.332-6.53c-.31-.156-1.834-.905-2.119-1.008-.285-.104-.493-.156-.701.156-.208.312-.806.104-1.008.156-.202.052-.405-.026-.715-.182-1.309-.64-2.18-1.554-2.521-2.144-.31-.53-.033-.817.234-1.05.241-.21.528-.613.593-.78.065-.166.033-.31-.016-.415-.049-.104-.493-1.196-.677-1.636-.179-.434-.378-.37-.521-.37-.134-.002-.288-.002-.442-.002-.154 0-.405.057-.617.285-.21.228-.802.784-.802 1.91 0 1.127.817 2.217.93 2.373.113.156 1.611 2.459 3.902 3.447.545.235.97.375 1.301.48.547.174 1.045.15 1.439.091.44-.066 1.353-.552 1.543-1.059.19-.506.19-.94.133-1.008-.057-.068-.208-.104-.519-.26z" />
                          </svg>
                        ) : (
                          <Sparkles className="w-4 h-4 text-violet-500" />
                        )}
                      </span>
                      <span>
                        {orderIsWhatsAppRedirect 
                          ? (language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার ফর্ম' : 'WhatsApp Order Form') 
                          : (language === 'bn' ? 'কোটেশন রিকোয়েস্ট ফর্ম' : 'Request Quotation Form')
                        }
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                      {orderIsWhatsAppRedirect 
                        ? (language === 'bn' ? 'Submit Your Project Requirements' : 'Submit Your Project Requirements') 
                        : (language === 'bn' ? 'আপনার কোটেশন রিকোয়েস্টটি ডাটাবেজে সংরক্ষিত করে আমাদের প্রতিনিধি যোগাযোগ করবেন' : 'Your inquiry will be logged securely for immediate review.')
                      }
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsOrderModalOpen(false)} 
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleOrderModalSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-500/20">
                  
                  {/* Row 1: Service Name & Service Package */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input 
                        type="text" 
                        required 
                        id="order_service_name"
                        value={orderServiceName}
                        onChange={(e) => setOrderServiceName(e.target.value)}
                        placeholder=" "
                        className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                      />
                      <label 
                        htmlFor="order_service_name"
                        className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                      >
                        Service Name <span className="text-rose-500">*</span>
                      </label>
                    </div>

                    <div className="relative group">
                      <input 
                        type="text" 
                        id="order_package_name"
                        value={orderPackageName}
                        onChange={(e) => setOrderPackageName(e.target.value)}
                        placeholder=" "
                        className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                      />
                      <label 
                        htmlFor="order_package_name"
                        className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                      >
                        Service Package
                      </label>
                    </div>
                  </div>

                  {/* Service Requirement Premium Interactive Selector (Required) */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] uppercase font-mono font-black tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
                        <span>{language === 'bn' ? "সার্ভিস রিকোয়ারমেন্টস" : language === 'ar' ? "متطلبات الخدمة المخصصة" : "Service Requirements"}</span>
                        <span className="text-rose-500 text-sm font-bold">*</span>
                      </label>
                      {Object.keys(selectedReqsByCategory).length > 0 && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {language === 'bn' 
                            ? `${Object.keys(selectedReqsByCategory).length}টি ক্যাটাগরি নির্বাচিত` 
                            : `${Object.keys(selectedReqsByCategory).length} Category Selected`}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {language === 'bn' 
                        ? "আপনি চাইলে প্রতিটি ক্যাটাগরি থেকে ১টি করে রিকোয়ারমেন্ট সিলেক্ট করতে পারবেন এবং পুনরায় ক্লিক করে আনসিলেক্ট করতে পারবেন।"
                        : "You can select 1 requirement from each category. Tap on a selected item again to deselect."
                      }
                    </p>

                    {/* Search & Filter Controls Group */}
                    <div className="p-3.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-3">
                      {/* Search Bar Input */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input 
                          type="text"
                          value={requirementSearch}
                          onChange={(e) => setRequirementSearch(e.target.value)}
                          placeholder={
                            language === 'bn' ? "রিকোয়ারমেন্ট বা সার্ভিস খুঁজুন..." : 
                            language === 'ar' ? "ابحث عن متطلب أو خدمة مخصصة..." : 
                            "Search for requirements or custom packages..."
                          }
                          className="w-full h-11 pl-11 pr-10 bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all duration-300"
                        />
                        {requirementSearch && (
                          <button 
                            type="button" 
                            onClick={() => setRequirementSearch('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full cursor-pointer transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Category Navigation Horizontal Tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {(() => {
                          const reqCategoryLabels: { [key: string]: { [lang: string]: string } } = {
                            'all': { en: "All", bn: "সব", ar: "الكل" },
                            'Hosting & Domains': { en: "Hosting & Domains", bn: "হোস্টিং ও ডোমেইন", ar: "الاستضافة والنطاقات" },
                            'Website Development': { en: "Website Development", bn: "ওয়েবসাইট তৈরি", ar: "تطوير المواقع والمنصات" },
                            'Digital Marketing': { en: "Digital Marketing", bn: "ডিজিটাল মার্কেটিং", ar: "التسويق الرقمي والنمو" },
                            'Software Solutions': { en: "Software Solutions", bn: "সফটওয়্যার সলিউশন", ar: "البرمجيات الإدارية والحلول" },
                            'Graphic Design': { en: "Graphic Design", bn: "গ্রাফিক ডিজাইন", ar: "التصميم الجرافيكي" }
                          };
                          return ['all', 'Hosting & Domains', 'Website Development', 'Digital Marketing', 'Software Solutions', 'Graphic Design'].map((cat) => {
                            const isCatActive = selectedReqCategory === cat;
                            const label = reqCategoryLabels[cat]?.[language] || cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedReqCategory(cat)}
                                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer whitespace-nowrap transition-all duration-300 flex items-center gap-1 ${
                                  isCatActive 
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/15 scale-102' 
                                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/20 dark:border-slate-800/20'
                                }`}
                              >
                                {cat === 'all' && <Sparkles className="w-3 h-3" />}
                                {cat === 'Hosting & Domains' && <Server className="w-3 h-3" />}
                                {cat === 'Website Development' && <Globe className="w-3 h-3" />}
                                {cat === 'Digital Marketing' && <TrendingUp className="w-3 h-3" />}
                                {cat === 'Software Solutions' && <Sliders className="w-3 h-3" />}
                                {cat === 'Graphic Design' && <Palette className="w-3 h-3" />}
                                <span>{label}</span>
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Interactive List Options Container */}
                    <div className="relative">
                      <div className={`max-h-72 overflow-y-auto space-y-2.5 p-2 bg-slate-50 dark:bg-[#111827]/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl scrollbar-thin scrollbar-thumb-violet-500/20 hover:scrollbar-thumb-violet-500/40 transition-colors ${
                        !orderServiceRequirement ? 'ring-1 ring-rose-500/20' : ''
                      }`}>
                        {(() => {
                          const filtered = serviceRequirementsList.filter(item => {
                            const matchCategory = selectedReqCategory === 'all' || item.category === selectedReqCategory;
                            
                            const searchLower = requirementSearch.toLowerCase();
                            const matchSearch = !requirementSearch || 
                              item.label.toLowerCase().includes(searchLower) ||
                              item.labelBn.toLowerCase().includes(searchLower) ||
                              item.labelAr.toLowerCase().includes(searchLower) ||
                              item.desc.toLowerCase().includes(searchLower) ||
                              item.descBn.toLowerCase().includes(searchLower) ||
                              item.descAr.toLowerCase().includes(searchLower);

                            return matchCategory && matchSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
                                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400">
                                  <Search className="w-6 h-6 animate-pulse" />
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                  {language === 'bn' ? "কোনো সার্ভিস রিকোয়ারমেন্ট পাওয়া যায়নি।" : language === 'ar' ? "لم يتم العثور على أي متطلب للخدمة." : "No service requirements found."}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => { setRequirementSearch(''); setSelectedReqCategory('all'); }}
                                  className="text-[10px] text-violet-500 font-bold hover:underline"
                                >
                                  {language === 'bn' ? "ফিল্টার রিসেট করুন" : language === 'ar' ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                                </button>
                              </div>
                            );
                          }

                          return filtered.map((item) => {
                            const isSelected = selectedReqsByCategory[item.category] === item.id;
                            const ItemIcon = item.icon;
                            
                            const localizedLabel = language === 'bn' ? item.labelBn : language === 'ar' ? item.labelAr : item.label;
                            const localizedDesc = language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc;
                            const localizedCategory = language === 'bn' ? item.categoryBn : language === 'ar' ? item.categoryAr : item.category;
                            const itemPriceUsd = serviceRequirementsPrices[item.id] || 0;

                            // Color schemas per category
                            let catColors = "bg-violet-500/10 text-violet-500 dark:bg-violet-500/20";
                            if (item.category === 'Hosting & Domains') catColors = "bg-sky-500/10 text-sky-500 dark:bg-sky-500/20";
                            if (item.category === 'Website Development') catColors = "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20";
                            if (item.category === 'Digital Marketing') catColors = "bg-pink-500/10 text-pink-500 dark:bg-pink-500/20";
                            if (item.category === 'Software Solutions') catColors = "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20";

                            return (
                              <motion.div
                                key={item.id}
                                whileHover={{ y: -2, scale: 1.01 }}
                                whileTap={{ scale: 0.995 }}
                                onClick={() => {
                                  setSelectedReqsByCategory(prev => {
                                    const updated = { ...prev };
                                    if (updated[item.category] === item.id) {
                                      delete updated[item.category];
                                    } else {
                                      updated[item.category] = item.id;
                                    }
                                    return updated;
                                  });
                                }}
                                className={`group p-4 border rounded-[16px] flex items-start gap-3.5 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                  isSelected 
                                    ? 'bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 dark:from-violet-500/10 dark:to-fuchsia-500/5 border-violet-500 shadow-md ring-2 ring-violet-500/18' 
                                    : 'bg-white/60 dark:bg-[#0F172A]/60 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 hover:border-violet-400 dark:hover:border-violet-600 shadow-sm'
                                }`}
                              >
                                {/* Subtle background glow for selected card */}
                                {isSelected && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/5 via-[#A855F7]/5 to-[#EC4899]/5 animate-pulse" />
                                )}

                                {/* Left Icon */}
                                <div className={`p-3 rounded-2xl shrink-0 transition-all duration-300 group-hover:scale-105 shadow-inner ${catColors}`}>
                                  <ItemIcon className="w-5 h-5" />
                                </div>

                                {/* Content details */}
                                <div className="flex-1 min-w-0 space-y-1 text-left relative z-10">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                                      isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-slate-800 dark:text-slate-200'
                                    }`}>
                                      {localizedLabel}
                                    </h4>
                                    <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/20">
                                      {localizedCategory}
                                    </span>
                                    {itemPriceUsd > 0 && (
                                      <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-violet-500/5 px-2 py-0.5 rounded-full border border-violet-500/10">
                                        {renderPrice(itemPriceUsd)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                                    {localizedDesc}
                                  </p>
                                </div>

                                {/* Selection checkmark or empty circle */}
                                <div className="shrink-0 flex items-center justify-center self-center relative z-10">
                                  {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.35)] scale-110 transition-all duration-300">
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 transition-all duration-300 flex items-center justify-center" />
                                  )}
                                </div>
                              </motion.div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Selected Summary Badge List with consolidated Custom Addon Modules & Advance Payment Option */}
                    <div className="p-4 sm:p-5 bg-gradient-to-br from-white/70 to-white/30 dark:from-[#0F172A]/70 dark:to-[#0F172A]/30 backdrop-blur-[24px] border border-white/20 dark:border-white/10 rounded-[24px] space-y-4 shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Requirements Badges (if any chosen) */}
                      {Object.keys(selectedReqsByCategory).length > 0 && (
                        <div className="space-y-3 pb-3 border-b border-slate-200/40 dark:border-slate-800/40">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white">
                                <Sparkles className="w-3.5 h-3.5" />
                              </span>
                              <span>{language === 'bn' ? "আপনার নির্বাচিত রিকোয়ারমেন্টস" : "Your Chosen Requirements"}</span>
                            </div>
                            <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                              {Object.keys(selectedReqsByCategory).length} {language === 'bn' ? 'টি নির্বাচিত' : 'Selected'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {Object.entries(selectedReqsByCategory).map(([category, itemId]) => {
                              const item = serviceRequirementsList.find(r => r.id === itemId);
                              if (!item) return null;
                              const label = language === 'bn' ? item.labelBn : language === 'ar' ? item.labelAr : item.label;
                              const ItemIcon = item.icon || Sparkles;
                              const itemIdStr = itemId as string;
                              const itemPriceUsd = serviceRequirementsPrices[itemIdStr] || 0;
                              
                              // Category specific badge color theme
                              let themeClasses = "border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400";
                              if (category === 'Hosting & Domains') themeClasses = "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400";
                              if (category === 'Website Development') themeClasses = "border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400";
                              if (category === 'Digital Marketing') themeClasses = "border-pink-500/20 bg-pink-500/5 text-pink-600 dark:text-pink-400";
                              if (category === 'Software Solutions') themeClasses = "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400";

                              return (
                                <motion.div 
                                  key={category}
                                  layout
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.9, opacity: 0 }}
                                  whileHover={{ scale: 1.02, y: -1 }}
                                  className={`flex items-center gap-2 border px-3 py-1.5 rounded-[14px] shadow-sm bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-sm hover:shadow-md transition-all duration-300 ${themeClasses}`}
                                >
                                  {/* Mini visual icon for the specific requirement category */}
                                  <div className="p-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30">
                                    <ItemIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex flex-col text-left leading-none">
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{category}</span>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5 max-w-[180px] sm:max-w-xs truncate flex items-center gap-1">
                                      {label} {itemPriceUsd > 0 && <span>({renderPrice(itemPriceUsd)})</span>}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedReqsByCategory(prev => {
                                      const updated = { ...prev };
                                      delete updated[category];
                                      return updated;
                                    })}
                                    className="p-1 rounded-full text-slate-400 hover:text-[#EF4444] hover:bg-rose-500/10 cursor-pointer ml-1.5 transition-all duration-300"
                                  >
                                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Select Custom Addon Modules: (Placed above Advance Payment Option, matching Custom Project Cost Estimator) */}
                      <div className="space-y-3 pt-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-[11px]">
                              <Layers className="w-3.5 h-3.5" />
                            </div>
                            <label className="text-xs sm:text-sm font-black tracking-wide text-neutral-800 dark:text-slate-100 flex items-center gap-1.5">
                              <span>{language === 'bn' ? 'অতিরিক্ত ফিচার ও মডিউল বেছে নিন:' : 'Select Custom Addon Modules:'}</span>
                            </label>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                            {orderAddonModules.length} {language === 'bn' ? 'টি ফিচার সিলেক্টেড' : 'Selected'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                          {CUSTOM_ADDON_MODULES.map((fObj, idx) => {
                            const isChecked = orderAddonModules.includes(fObj.id);
                            const AddonIcon = fObj.icon;
                            const isTooltipActive = activeAddonTooltip === fObj.id;

                            // Localized texts
                            const localizedName = language === 'bn' ? fObj.bn : (language === 'ar' && fObj.ar ? fObj.ar : fObj.label);
                            const localizedBadge = language === 'bn' ? fObj.badgeBn : (language === 'ar' && fObj.badgeAr ? fObj.badgeAr : fObj.badge);
                            const localizedUsage = language === 'bn' ? fObj.usageBn : (language === 'ar' && fObj.usageAr ? fObj.usageAr : fObj.usage);
                            const localizedBenefits = language === 'bn' ? fObj.benefitsBn : (language === 'ar' && fObj.benefitsAr ? fObj.benefitsAr : fObj.benefits);

                            // Alignment classes to prevent tooltip overflow
                            // lg: 3 columns, sm: 2 columns
                            const alignClasses = 
                              idx % 3 === 0
                                ? 'lg:left-0 lg:right-auto lg:translate-x-0 sm:left-0 sm:right-auto sm:translate-x-0'
                                : idx % 3 === 2
                                ? 'lg:right-0 lg:left-auto lg:translate-x-0 sm:right-0 sm:left-auto sm:translate-x-0'
                                : 'lg:left-1/2 lg:-translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2';

                            const arrowClasses = 
                              idx % 3 === 0
                                ? 'lg:left-8 sm:left-8'
                                : idx % 3 === 2
                                ? 'lg:right-8 sm:right-8'
                                : 'lg:left-1/2 lg:-translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2';

                            return (
                              <div 
                                key={fObj.id} 
                                className={`relative group/addon ${isTooltipActive ? 'z-40' : 'hover:z-30'}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOrderAddonModules(prev =>
                                      prev.includes(fObj.id) ? prev.filter(x => x !== fObj.id) : [...prev, fObj.id]
                                    );
                                  }}
                                  className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left text-xs font-bold transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer ${
                                    isChecked
                                      ? 'bg-white dark:bg-slate-800 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20 -translate-y-0.5'
                                      : 'bg-white/80 dark:bg-slate-800/60 border-neutral-200/90 dark:border-slate-700 text-neutral-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-violet-50/10 hover:-translate-y-0.5'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`p-1.5 sm:p-2 rounded-xl transition-colors shrink-0 ${
                                      isChecked
                                        ? 'bg-emerald-500 text-white shadow-sm'
                                        : 'bg-neutral-100 dark:bg-slate-700/80 text-neutral-500 dark:text-slate-400 group-hover/addon:bg-violet-500/10 group-hover/addon:text-violet-500'
                                    }`}>
                                      <AddonIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="truncate block leading-tight text-[11px] sm:text-xs text-slate-800 dark:text-slate-100">{localizedName}</span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[9px] text-neutral-400 dark:text-slate-400 font-normal">Optional Addon</span>
                                        {/* Info trigger badge */}
                                        <span 
                                          role="button"
                                          tabIndex={0}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAddonTooltip(prev => prev === fObj.id ? null : fObj.id);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                              e.stopPropagation();
                                              setActiveAddonTooltip(prev => prev === fObj.id ? null : fObj.id);
                                            }
                                          }}
                                          className={`inline-flex items-center justify-center p-0.5 rounded-full transition-all cursor-pointer ${
                                            isTooltipActive 
                                              ? 'bg-violet-500 text-white shadow-sm' 
                                              : 'text-violet-500 dark:text-violet-400 hover:bg-violet-500/15'
                                          }`}
                                          title={language === 'bn' ? 'ব্যবহারের বিবরণ দেখতে ক্লিক করুন' : 'Click or hover to view usage explanation'}
                                        >
                                          <HelpCircle className="w-3 h-3" />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                    <span className="text-[11px] sm:text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                                      {renderPrice(fObj.priceNum)}
                                    </span>
                                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-lg flex items-center justify-center transition-colors ${
                                      isChecked ? 'bg-emerald-500 text-white' : 'border border-neutral-300 dark:border-slate-600 bg-neutral-50 dark:bg-slate-800'
                                    }`}>
                                      {isChecked ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> : null}
                                    </div>
                                  </div>
                                </button>

                                {/* 🌟 WebzoneBD Signature Gradient Glassmorphic Hover Tooltip */}
                                <div
                                  role="tooltip"
                                  className={`absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 sm:translate-x-0 w-[calc(100vw-3.5rem)] max-w-[310px] sm:max-w-[325px] p-3.5 rounded-2xl bg-slate-950/95 dark:bg-[#070C18]/95 backdrop-blur-2xl border border-violet-500/40 dark:border-violet-500/50 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(124,58,237,0.22)] text-left transition-all duration-200 ease-out z-50 ${alignClasses} ${
                                    isTooltipActive
                                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                                      : 'opacity-0 scale-95 translate-y-2 pointer-events-none invisible group-hover/addon:opacity-100 group-hover/addon:scale-100 group-hover/addon:translate-y-0 group-hover/addon:pointer-events-auto group-hover/addon:visible'
                                  }`}
                                >
                                  {/* WebzoneBD Multi-Gradient Top Shimmer Accent Bar */}
                                  <div className="absolute top-0 left-3 right-3 h-[2.5px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-full" />
                                  
                                  {/* Subtle Radial Ambient Glow Orb */}
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-violet-500/20 rounded-full blur-xl pointer-events-none" />

                                  {/* Header Section */}
                                  <div className="flex items-start justify-between gap-2 relative z-10">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shrink-0 shadow-sm shadow-violet-500/30">
                                        <AddonIcon className="w-3.5 h-3.5 text-white" />
                                      </div>
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-bold text-white truncate tracking-tight">
                                          {localizedName}
                                        </h5>
                                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                          {localizedBadge}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg shadow-sm">
                                        {renderPrice(fObj.priceNum)}
                                      </span>
                                      {/* Mobile Dismiss Button */}
                                      {isTooltipActive && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAddonTooltip(null);
                                          }}
                                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                          title="Close"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Glass Divider */}
                                  <div className="my-2.5 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                                  {/* Brief Usage Explanation */}
                                  <div className="relative z-10 space-y-2">
                                    <div className="flex items-start gap-1.5">
                                      <Sparkles className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                                      <p className="text-[11px] leading-relaxed text-slate-200 font-medium">
                                        {localizedUsage}
                                      </p>
                                    </div>

                                    {/* Key Capabilities Checklist */}
                                    <div className="pt-1 space-y-1">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                        {language === 'bn' ? 'মূল সুবিধাসমূহ:' : 'Key Capabilities:'}
                                      </span>
                                      {localizedBenefits.map((benefit: string, bIdx: number) => (
                                        <div key={bIdx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                          <span className="truncate">{benefit}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Footer with WebzoneBD Badge & State */}
                                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] relative z-10">
                                    <span className="text-violet-300/90 font-medium flex items-center gap-1">
                                      <Layers className="w-2.5 h-2.5 text-violet-400" />
                                      WebzoneBD Addon
                                    </span>
                                    <span className={`font-semibold ${isChecked ? 'text-emerald-400' : 'text-slate-400'}`}>
                                      {isChecked 
                                        ? (language === 'bn' ? '✓ সিলেক্টেড' : '✓ Selected') 
                                        : (language === 'bn' ? 'যুক্ত করতে ক্লিক করুন' : 'Click card to select')
                                      }
                                    </span>
                                  </div>

                                  {/* Bottom Arrow Notch with matching glass border */}
                                  <div 
                                    className={`absolute -bottom-1.5 w-3 h-3 rotate-45 bg-slate-950/95 dark:bg-[#070C18]/95 border-r border-b border-violet-500/40 dark:border-violet-500/50 ${arrowClasses}`} 
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Advance Payment Option (Escrow Advance) sub-section */}
                      <div className="pt-3.5 border-t border-slate-200/40 dark:border-slate-800/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs sm:text-sm font-bold text-[#475569] dark:text-[#CBD5E1] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                            {language === 'bn' ? 'অগ্রিম পেমেন্ট অপশন (Escrow Advance):' : 'Advance Payment Option (Escrow Advance):'}
                          </label>
                          <span className="text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                            {language === 'bn' ? 'নিরাপদ গেটওয়ে' : 'Escrow Secured'}
                          </span>
                        </div>

                        {/* Segmented Controller Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { percent: 30, label: '30% Advance', labelBn: '৩০% অগ্রিম' },
                            { percent: 50, label: '50% Advance', labelBn: '৫০% অগ্রিম' },
                            { percent: 100, label: '100% Full Pay', labelBn: '১০০% ফুল পে' }
                          ].map((opt) => {
                            const isSelected = orderAdvancePercent === opt.percent;
                            return (
                              <button
                                key={opt.percent}
                                type="button"
                                onClick={() => setOrderAdvancePercent(opt.percent)}
                                className={`py-2.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white border-transparent shadow-[0_4px_15px_rgba(124,58,237,0.25)] scale-[1.02]'
                                    : 'bg-[#F8FAFC]/50 dark:bg-[#111827]/40 border-[#E2E8F0] dark:border-[#374151] text-slate-700 dark:text-slate-300 hover:border-violet-500/50'
                                }`}
                              >
                                <span>{language === 'bn' ? opt.labelBn : opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Consolidated Total Price and Advance Payable section */}
                      <div className="pt-3.5 border-t border-slate-200/40 dark:border-slate-800/40 space-y-3">
                        {/* 1. Total Price Display */}
                        <div className="flex flex-row items-center justify-between gap-2.5">
                          <span className="text-[11px] sm:text-xs font-bold text-[#475569] dark:text-[#CBD5E1] whitespace-nowrap shrink-0">
                            {language === 'bn' ? "মোট প্রজেক্ট মূল্য:" : language === 'ar' ? "سعر المشروع الإجمالي:" : "Total Project Price:"}
                          </span>
                          <div className="flex items-center gap-1.5 justify-end shrink-0">
                            {(() => {
                              const totalReqsUsd = (Object.values(selectedReqsByCategory) as string[]).reduce((sum: number, itemId: string) => {
                                return sum + (serviceRequirementsPrices[itemId] || 0);
                              }, 0);
                              const totalAddonsUsd = orderAddonModules.reduce((sum: number, addonId: string) => {
                                const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
                                return sum + (item ? item.priceNum : 0);
                              }, 0);
                              const hasSelectedItems = (Object.keys(selectedReqsByCategory).length > 0 && totalReqsUsd > 0) || totalAddonsUsd > 0;
                              const basePrice = hasSelectedItems ? (totalReqsUsd + totalAddonsUsd) : 0;
                              const totalBdt = Math.round(basePrice * 115);
                              const totalSar = Math.round(basePrice * 3.75);

                              return (
                                <AnimatePresence mode="wait">
                                  {currency === 'BDT' && (
                                    <motion.div
                                      key="BDT"
                                      initial={{ opacity: 0, y: 4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{ duration: 0.25 }}
                                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10 shadow-sm shrink-0"
                                    >
                                      <span className="text-[9px] font-extrabold text-[#475569] dark:text-[#CBD5E1]">🇧🇩 BDT</span>
                                      <span className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] whitespace-nowrap">
                                        ৳{totalBdt.toLocaleString()}
                                      </span>
                                    </motion.div>
                                  )}
                                  {currency === 'SAR' && (
                                    <motion.div
                                      key="SAR"
                                      initial={{ opacity: 0, y: 4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{ duration: 0.25 }}
                                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 shadow-sm shrink-0"
                                    >
                                      <span className="text-[9px] font-extrabold text-[#475569] dark:text-[#CBD5E1]">🇸🇦 SAR</span>
                                      <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                        {totalSar.toLocaleString()} {language === 'bn' ? 'রিয়াল' : language === 'ar' ? 'ريال' : 'SAR'}
                                      </span>
                                    </motion.div>
                                  )}
                                  {currency !== 'BDT' && currency !== 'SAR' && (
                                    <motion.div
                                      key="USD"
                                      initial={{ opacity: 0, y: 4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{ duration: 0.25 }}
                                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 shadow-sm shrink-0"
                                    >
                                      <span className="text-[9px] font-extrabold text-[#475569] dark:text-[#CBD5E1]">🌐 USD</span>
                                      <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                        ${basePrice.toLocaleString()}
                                      </span>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              );
                            })()}
                          </div>
                        </div>

                        {/* 2. Calculated Advance Payable */}
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/20 dark:border-slate-800/20 font-semibold bg-violet-500/5 dark:bg-violet-500/10 p-3 rounded-xl border border-violet-500/10 shadow-inner">
                          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                            {language === 'bn' ? 'পরিশোধযোগ্য অগ্রিম (Advance Payable):' : 'Advance Payable Amount:'}
                          </span>
                          <span className="font-extrabold text-[#7C3AED] dark:text-[#A855F7] text-sm sm:text-base flex items-center gap-1">
                            {(() => {
                              const totalReqsUsd = (Object.values(selectedReqsByCategory) as string[]).reduce((sum: number, itemId: string) => {
                                return sum + (serviceRequirementsPrices[itemId] || 0);
                              }, 0);
                              const totalAddonsUsd = orderAddonModules.reduce((sum: number, addonId: string) => {
                                const item = CUSTOM_ADDON_MODULES.find(m => m.id === addonId);
                                return sum + (item ? item.priceNum : 0);
                              }, 0);
                              const hasSelectedItems = (Object.keys(selectedReqsByCategory).length > 0 && totalReqsUsd > 0) || totalAddonsUsd > 0;
                              const basePrice = hasSelectedItems ? (totalReqsUsd + totalAddonsUsd) : 0;
                              
                              const calculatedAdvance = Math.round((basePrice * orderAdvancePercent) / 100);
                              if (currency === 'BDT') {
                                return `৳${Math.round(calculatedAdvance * 115).toLocaleString()}`;
                              } else if (currency === 'SAR') {
                                return `${Math.round(calculatedAdvance * 3.75).toLocaleString()} SAR`;
                              } else {
                                return `$${calculatedAdvance.toLocaleString()}`;
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Customer Name (Required) */}
                  <div className="relative group">
                    <input 
                      type="text" 
                      required 
                      id="order_customer_name"
                      value={orderCustomerName}
                      onChange={(e) => setOrderCustomerName(e.target.value)}
                      placeholder=" "
                      className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                    />
                    <label 
                      htmlFor="order_customer_name"
                      className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                    >
                      Customer Name <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  {/* Row 3: Mobile Number & WhatsApp Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input 
                        type="tel" 
                        required 
                        id="order_mobile_number"
                        value={orderMobileNumber}
                        onChange={(e) => setOrderMobileNumber(e.target.value)}
                        placeholder=" "
                        className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                      />
                      <label 
                        htmlFor="order_mobile_number"
                        className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                      >
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                    </div>

                    <div className="relative group">
                      <input 
                        type="tel" 
                        id="order_whatsapp_number"
                        value={orderWhatsAppNumber}
                        onChange={(e) => setOrderWhatsAppNumber(e.target.value)}
                        placeholder=" "
                        className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                      />
                      <label 
                        htmlFor="order_whatsapp_number"
                        className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                      >
                        WhatsApp Number (Optional)
                      </label>
                    </div>
                  </div>

                  {/* Row 4: Email Address & Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input 
                        type="email" 
                        id="order_email"
                        value={orderEmailAddress}
                        onChange={(e) => setOrderEmailAddress(e.target.value)}
                        placeholder=" "
                        className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                      />
                      <label 
                        htmlFor="order_email"
                        className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                      >
                        Email Address (Optional)
                      </label>
                    </div>

                    <div className="relative group">
                      <input 
                        type="text" 
                        id="order_company_name"
                        value={orderCompanyName}
                        onChange={(e) => setOrderCompanyName(e.target.value)}
                        placeholder=" "
                        className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                      />
                      <label 
                        htmlFor="order_company_name"
                        className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                      >
                        Company Name (Optional)
                      </label>
                    </div>
                  </div>

                  {/* Row 4.5: Company Category Dropdown */}
                  <div className="relative" ref={orderCompanyCategoryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsOrderCompanyCategoryOpen(!isOrderCompanyCategoryOpen)}
                      className={`relative w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border rounded-[14px] px-4 pt-5 pb-1.5 text-left text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white focus:outline-none transition-all duration-300 flex items-center justify-between group hover:border-violet-500/50 ${
                        isOrderCompanyCategoryOpen 
                          ? 'border-violet-500 ring-4 ring-violet-500/18 bg-white dark:bg-slate-950 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                          : 'border-[#E2E8F0] dark:border-[#374151]'
                      }`}
                    >
                      <span className="truncate pr-4 block flex items-center gap-2">
                        {(() => {
                          const matched = COMPANY_CATEGORIES.find(c => c.name === orderCompanyCategory || c.nameBn === orderCompanyCategory || c.id === orderCompanyCategory);
                          if (matched) {
                            const MatchedIcon = matched.icon;
                            return (
                              <span className="flex items-center gap-2">
                                <MatchedIcon className="w-4 h-4 text-violet-500 shrink-0" />
                                <span>{language === 'bn' ? matched.nameBn : matched.name}</span>
                              </span>
                            );
                          }
                          return orderCompanyCategory || 'Select Company Category';
                        })()}
                      </span>
                      <label className="absolute left-4 top-[8px] text-[10px] sm:text-[11px] font-bold text-violet-600 dark:text-violet-400 pointer-events-none uppercase tracking-wider">
                        Company Category
                      </label>
                      <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0 ${isOrderCompanyCategoryOpen ? 'rotate-180 text-violet-500' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isOrderCompanyCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 left-0 right-0 top-[60px] bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] shadow-2xl overflow-hidden"
                        >
                          <div className="p-2.5 border-b border-neutral-100 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900/50 flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                            <input
                              type="text"
                              value={orderCompanyCategorySearch}
                              onChange={(e) => setOrderCompanyCategorySearch(e.target.value)}
                              placeholder="Search category..."
                              className="w-full bg-transparent text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
                              autoFocus
                            />
                          </div>

                          <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                            {COMPANY_CATEGORIES
                              .filter(c => !orderCompanyCategorySearch || c.name.toLowerCase().includes(orderCompanyCategorySearch.toLowerCase()) || c.nameBn.toLowerCase().includes(orderCompanyCategorySearch.toLowerCase()))
                              .map(catItem => {
                                const isSel = orderCompanyCategory === catItem.name;
                                const ItemIcon = catItem.icon;
                                return (
                                  <button
                                    key={catItem.id}
                                    type="button"
                                    onClick={() => {
                                      setOrderCompanyCategory(catItem.name);
                                      setCustomEstCompanyCategory(catItem.name);
                                      setIsOrderCompanyCategoryOpen(false);
                                      setOrderCompanyCategorySearch('');
                                    }}
                                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                      isSel 
                                        ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold' 
                                        : 'hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-700 dark:text-slate-200'
                                    }`}
                                  >
                                    <span className="flex items-center gap-2 truncate">
                                      <ItemIcon className="w-4 h-4 text-violet-500 shrink-0" />
                                      <span className="truncate">{language === 'bn' ? catItem.nameBn : catItem.name}</span>
                                    </span>
                                    {isSel && <Check className="w-3.5 h-3.5 text-violet-500 shrink-0" />}
                                  </button>
                                );
                              })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Row 5: Budget (Dropdown) */}
                  <div className="relative" id="order-budget-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setIsBudgetDropdownOpen(!isBudgetDropdownOpen)}
                      className={`relative w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border rounded-[14px] px-4 pt-5 pb-1.5 text-left text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white focus:outline-none transition-all duration-300 flex items-center justify-between group hover:border-violet-500/50 ${
                        isBudgetDropdownOpen 
                          ? 'border-violet-500 ring-4 ring-violet-500/18 bg-white dark:bg-slate-950 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                          : 'border-[#E2E8F0] dark:border-[#374151]'
                      }`}
                    >
                      <span className="truncate pr-4 block">
                        {orderBudget ? (
                          (() => {
                            const selectedOpt = budgetOptions.find(opt => opt.value === orderBudget);
                            if (selectedOpt) {
                              return language === 'bn' ? selectedOpt.labelBn : selectedOpt.label;
                            }
                            return orderBudget;
                          })()
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">
                            {language === 'bn' ? "বাজেট সিলেক্ট করুন (ঐচ্ছিক)" : "Select Expected Budget (Optional)"}
                          </span>
                        )}
                      </span>
                      
                      <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-transform duration-300 ${isBudgetDropdownOpen ? 'rotate-180 text-violet-500' : ''}`} />

                      <span 
                        className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold ${
                          orderBudget || isBudgetDropdownOpen
                            ? 'top-[6px] text-[10px] sm:text-xs text-violet-600 dark:text-violet-400'
                            : 'top-1/2 -translate-y-1/2 text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1]'
                        }`}
                      >
                        {language === 'bn' ? "প্রত্যাশিত বাজেট" : "Select Your Expected Budget"}
                      </span>
                    </button>

                    {/* Dropdown Options List */}
                    <AnimatePresence>
                      {isBudgetDropdownOpen && (
                        <>
                          {/* Invisible Clickable Overlay to close */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsBudgetDropdownOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 mt-2 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-[20px] border border-slate-200/60 dark:border-slate-800/60 rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2 space-y-1 overflow-hidden"
                          >
                            {budgetOptions.map((opt) => {
                              const isSelected = orderBudget === opt.value;
                              const labelText = language === 'bn' ? opt.labelBn : opt.label;
                              const descText = language === 'bn' ? opt.descriptionBn : opt.description;
                              
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setOrderBudget(opt.value);
                                    setIsBudgetDropdownOpen(false);
                                  }}
                                  className={`w-full text-left p-3 rounded-[12px] flex items-center justify-between transition-all duration-200 cursor-pointer ${
                                    isSelected 
                                      ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold border border-violet-500/20' 
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  <div className="flex flex-col text-left space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs sm:text-sm font-bold">{labelText}</span>
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-extrabold ${opt.badgeColor}`}>
                                        {opt.badge}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{descText}</span>
                                  </div>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-violet-500 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>



                  {/* Row 6: Project Details (Optional) */}
                  <div className="relative group">
                    <textarea 
                      id="order_project_details"
                      value={orderProjectDetails}
                      onChange={(e) => setOrderProjectDetails(e.target.value)}
                      placeholder=" "
                      className="peer w-full min-h-[140px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-6 pb-2.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300 resize-y scrollbar-thin scrollbar-thumb-violet-500/20"
                    />
                    <label 
                      htmlFor="order_project_details"
                      className="absolute left-4 top-[14px] peer-focus:top-[12px] peer-[:not(:placeholder-shown)]:top-[12px] scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                    >
                      Project Details / Requirements (Optional)
                    </label>
                  </div>

                  {/* 🟢 Automated Live WhatsApp Message Preview */}
                  {orderIsWhatsAppRedirect && (
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/5 space-y-2 text-left animate-in fade-in duration-300">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {language === 'bn' ? 'হোয়াটসঅ্যাপ মেসেজ প্রিভিউ' : 'WhatsApp Message Preview'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                        {language === 'bn' 
                          ? 'আপনার প্রদানকৃত তথ্য অনুযায়ী এই মেসেজটি স্বয়ংক্রিয়ভাবে তৈরি হবে এবং হোয়াটসঅ্যাপে পাঠানো হবে:' 
                          : 'Verify your order template. This formatted message is generated automatically in real-time:'}
                      </p>
                      <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap select-all leading-relaxed max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20">
                        {getWhatsAppPreviewMessage()}
                      </div>
                    </div>
                  )}

                  {/* Action Submit Button */}
                  <button 
                    type="submit"
                    className={`w-full h-[54px] text-white text-sm font-semibold rounded-[14px] shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-2.5 cursor-pointer hover:scale-102 active:scale-98 ${
                      orderIsWhatsAppRedirect 
                        ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 shadow-emerald-500/25 hover:shadow-emerald-500/35" 
                        : "bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] shadow-violet-500/25 hover:shadow-violet-500/35"
                    }`}
                  >
                    {orderIsWhatsAppRedirect ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.858-4.37 9.862-9.743.002-2.602-1.01-5.05-2.85-6.892-1.84-1.842-4.29-2.853-6.894-2.854-5.441 0-9.863 4.37-9.867 9.745-.001 1.737.478 3.435 1.388 4.947l-.971 3.548 3.65-.951zm11.332-6.53c-.31-.156-1.834-.905-2.119-1.008-.285-.104-.493-.156-.701.156-.208.312-.806.104-1.008.156-.202.052-.405-.026-.715-.182-1.309-.64-2.18-1.554-2.521-2.144-.31-.53-.033-.817.234-1.05.241-.21.528-.613.593-.78.065-.166.033-.31-.016-.415-.049-.104-.493-1.196-.677-1.636-.179-.434-.378-.37-.521-.37-.134-.002-.288-.002-.442-.002-.154 0-.405.057-.617.285-.21.228-.802.784-.802 1.91 0 1.127.817 2.217.93 2.373.113.156 1.611 2.459 3.902 3.447.545.235.97.375 1.301.48.547.174 1.045.15 1.439.091.44-.066 1.353-.552 1.543-1.059.19-.506.19-.94.133-1.008-.057-.068-.208-.104-.519-.26z" />
                      </svg>
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                    <span>
                      {orderIsWhatsAppRedirect 
                        ? (language === 'bn' ? 'অর্ডার সম্পন্ন করুন (হোয়াটসঅ্যাপ)' : 'Complete Order on WhatsApp') 
                        : (language === 'bn' ? 'কোটেশন রিকোয়েস্ট সাবমিট করুন' : 'Submit Quotation Request')
                      }
                    </span>
                  </button>
                </form>
              </>
            </motion.div>
          </div>
        )}

      {/* 🎉 PREMIUM SAAS-GRADE CONGRATULATIONS SUCCESS POPUP */}
      {isSuccessPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0F172A] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/10 dark:border-white/5 text-left p-6 sm:p-8 space-y-6"
            id="congratulations-success-popup"
          >
            {/* Top Premium Color Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

            {/* Glowing Success Header (Congratulations on left, tick on right) */}
            <div className="flex items-center justify-between gap-4 pt-2 pb-2 relative overflow-visible border-b border-slate-100 dark:border-slate-800/40">
              <div className="space-y-1 text-left">
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
                  {language === 'bn' ? 'অভিনন্দন! আপনার অর্ডার সফল হয়েছে' : 'Congratulations! Order Logged'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'আপনার রিকোয়ারমেন্টস ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে।' : 'Your requirements have been securely logged in our database.'}
                </p>
              </div>

              <div className="relative shrink-0">
                {/* Expanding Ripple Rings */}
                <motion.div 
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1.8], opacity: [0.5, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-full"
                />
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg animate-pulse" />

                <motion.div 
                  initial={{ scale: 0, rotate: -60 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                  className="relative w-12 h-12 rounded-full bg-[#DCFCE7] border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center shadow-[0_4px_12px_rgba(34,197,94,0.15)]"
                >
                  <Check className="w-6 h-6 stroke-[3.5]" />
                </motion.div>
              </div>
            </div>

            {/* Premium Details Brief Card */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-[18px] p-5 space-y-3.5 shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
                <span>INQUIRY ID:</span>
                <span className="text-violet-600 dark:text-violet-400 font-extrabold">{successInquiryId}</span>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex justify-between items-start text-xs sm:text-sm">
                  <span className="font-semibold text-[#475569] dark:text-[#CBD5E1]">{language === 'bn' ? 'সেবার নাম:' : 'Service Name:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-right max-w-[200px] truncate">{successServiceName}</span>
                </div>
                
                <div className="flex justify-between items-start text-xs sm:text-sm">
                  <span className="font-semibold text-[#475569] dark:text-[#CBD5E1]">{language === 'bn' ? 'প্যাকেজ:' : 'Package:'}</span>
                  <span className="font-extrabold text-pink-500">{successPackageName}</span>
                </div>

                {successBudget && successBudget !== 'N/A' && (
                  <div className="flex justify-between items-start text-xs sm:text-sm">
                    <span className="font-semibold text-[#475569] dark:text-[#CBD5E1]">{language === 'bn' ? 'বাজেট:' : 'Expected Budget:'}</span>
                    <span className="font-extrabold text-emerald-500">{successBudget}</span>
                  </div>
                )}

                {successRequirementsPrice > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-xs sm:text-sm gap-1.5 pt-1">
                    <span className="font-semibold text-[#475569] dark:text-[#CBD5E1] shrink-0">{language === 'bn' ? 'রিকোয়ারমেন্টস মোট মূল্য:' : language === 'ar' ? 'سعر المتطلبات الإجمالي:' : 'Requirements Total Price:'}</span>
                    <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end text-right">
                      <AnimatePresence mode="wait">
                        {currency === 'BDT' && (
                          <motion.span
                            key="success-BDT"
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -2 }}
                            transition={{ duration: 0.25 }}
                            className="font-black text-[#7C3AED] dark:text-violet-400"
                          >
                            ৳{Math.round(successRequirementsPrice * 115).toLocaleString()} BDT
                          </motion.span>
                        )}
                        {currency === 'SAR' && (
                          <motion.span
                            key="success-SAR"
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -2 }}
                            transition={{ duration: 0.25 }}
                            className="font-black text-emerald-600 dark:text-emerald-400"
                          >
                            SAR {Math.round(successRequirementsPrice * 3.75).toLocaleString()}
                          </motion.span>
                        )}
                        {currency !== 'BDT' && currency !== 'SAR' && (
                          <motion.span
                            key="success-USD"
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -2 }}
                            transition={{ duration: 0.25 }}
                            className="font-black text-blue-600 dark:text-blue-400"
                          >
                            ${successRequirementsPrice.toLocaleString()} USD
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {successRequirements.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 space-y-1.5">
                    <span className="text-xs font-bold text-[#475569] dark:text-[#CBD5E1] block uppercase tracking-wider">{language === 'bn' ? 'নির্বাচিত রিকোয়ারমেন্টস:' : 'Selected Requirements:'}</span>
                    <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                      {successRequirements.map((req, i) => {
                        const parts = req.split(': ');
                        const cat = parts[0] || '';
                        const lbl = parts[1] || req;
                        return (
                          <div key={i} className="text-[10px] font-semibold bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-[10px] flex items-center gap-1">
                            <span className="font-bold uppercase opacity-70 text-[8px]">{cat}:</span>
                            <span className="text-slate-700 dark:text-slate-200">{lbl}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description note about WhatsApp Option */}
            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-[14px] flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 animate-bounce" />
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'bn' 
                  ? "আপনার রিকোয়ারমেন্টসটি অফিশিয়াল হোয়াটসঅ্যাপ নাম্বারে শেয়ার করে দ্রুত আলোচনা শুরু করুন।"
                  : "Share your requirements to our official WhatsApp support and start discussion instantly."
                }
              </p>
            </div>

            {/* Action buttons with custom premium states */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                type="button"
                onClick={() => {
                  window.open(`https://wa.me/966570511931?text=${encodeURIComponent(successWaMessage)}`, '_blank');
                  setIsSuccessPopupOpen(false);
                }}
                className="flex-[2] h-[76px] text-white text-base sm:text-lg font-extrabold rounded-[16px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-[size:200%_auto] flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_15px_35px_rgba(124,58,237,0.35)]"
                animate={{
                  boxShadow: [
                    "0 12px 30px rgba(124, 58, 237, 0.35)",
                    "0 18px 45px rgba(236, 72, 153, 0.5)",
                    "0 12px 30px rgba(124, 58, 237, 0.35)"
                  ],
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 22px 50px rgba(168, 85, 247, 0.6)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-6 h-6 text-white stroke-[2.5] animate-pulse" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Proceed to WhatsApp'}</span>
              </motion.button>

              <button
                type="button"
                onClick={() => setIsSuccessPopupOpen(false)}
                className="flex-1 h-[76px] px-6 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-[16px] text-sm font-semibold transition-all duration-300 cursor-pointer"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
