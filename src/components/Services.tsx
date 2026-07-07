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
  ThumbsUp, ChevronRight, ChevronDown, Loader2, Edit, Trash2
} from 'lucide-react';
import { Language, Theme, Order, Currency, UserSession } from '../types';
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
  { id: 'digital-marketing', label: 'Digital Marketing', bn: 'ডিজিটাল মার্কেটিং', ar: 'التসويق الرقمي', icon: TrendingUp },
  { id: 'wordpress-services', label: 'WordPress Services', bn: 'ওয়ার্ডপ্রেস সার্ভিসেস', ar: 'خدمات ووردبريس', icon: Globe },
  { id: 'whmcs-solutions', label: 'WHMCS Solutions', bn: 'WHMCS সলিউশনস', ar: 'حلول WHMCS', icon: Sliders },
  { id: 'mobile-app-development', label: 'Mobile App Development', bn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট', ar: 'تطوير تطبيقات الجوال', icon: ShieldCheck },
  { id: 'business-software', label: 'Business Software', bn: 'বিজনেস সফটওয়্যার', ar: 'برمجيات الأعمال', icon: CheckCircle2 },
  { id: 'custom-development', label: 'Custom Development', bn: 'কাস্টম ডেভেলপমেন্ট', ar: 'التطوير المخصص', icon: CheckCircle },
  { id: 'graphic-design', label: 'Graphic Design', bn: 'গ্রাফিক ডিজাইন', ar: 'التصميم الجرافيكي', icon: Heart }
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
  }
];

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
  }, [catalogServices]);

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
  const [activeTab, setActiveTab ] = useState<'custom-services' | 'fixed-packages' | 'google-business' | 'growth-package' | 'digital-web-dev'>(
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

  // Unified WhatsApp Order & Inquiry System Modal States
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRedirectingToWhatsApp, setIsRedirectingToWhatsApp] = useState(false);
  const [orderServiceName, setOrderServiceName] = useState('');
  const [orderPackageName, setOrderPackageName] = useState('Standard');
  const [orderServiceRequirement, setOrderServiceRequirement] = useState('');
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderMobileNumber, setOrderMobileNumber] = useState('');
  const [orderWhatsAppNumber, setOrderWhatsAppNumber] = useState('');
  const [orderEmailAddress, setOrderEmailAddress] = useState('');
  const [orderCompanyName, setOrderCompanyName] = useState('');
  const [orderBudget, setOrderBudget] = useState('');
  const [orderProjectDetails, setOrderProjectDetails] = useState('');
  const [orderIsWhatsAppRedirect, setOrderIsWhatsAppRedirect] = useState(true);
  const [requirementSearch, setRequirementSearch] = useState('');
  const [selectedReqCategory, setSelectedReqCategory] = useState('all');

  // Custom project specification form state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [quoteBudgetRange, setQuoteBudgetRange] = useState('500-1000');

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
        customerName: orderCustomerName,
        mobileNumber: orderMobileNumber,
        whatsappNumber: orderWhatsAppNumber || orderMobileNumber,
        emailAddress: orderEmailAddress || '',
        companyName: orderCompanyName || '',
        budget: orderBudget || '',
        projectDetails: orderProjectDetails || '',
        createdAt: timestamp,
        status: 'New Lead'
      };

      // 2. Prepare Order payload
      const orderPayload = {
        id: orderId,
        serviceName: orderServiceName,
        packageName: orderPackageName || 'Standard',
        serviceRequirement: orderServiceRequirement,
        customerName: orderCustomerName,
        mobileNumber: orderMobileNumber,
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

      // Write to Firestore!
      await setDoc(doc(db, 'service_inquiries', inquiryId), inquiryPayload);
      await setDoc(doc(db, 'service_orders', orderId), orderPayload);
      await setDoc(doc(db, 'service_leads', leadId), leadPayload);
      await setDoc(doc(db, 'whatsapp_leads', whatsappLeadId), whatsappLeadPayload);

      // Add to simulated orders/leads
      addSimulatedServiceOrder({
        id: orderId,
        serviceId: selectedService?.id || 'custom',
        itemTitle: `${orderServiceName} - ${orderPackageName} (WhatsApp Lead)`,
        price: parseFloat(orderBudget) || selectedService?.startingPrice || 250,
        date: cleanDate,
        paymentMethod: "WhatsApp Order Direct",
        paymentStatus: 'pending'
      });

      // Show Toast Notification
      triggerToast(language === 'bn'
        ? `অর্ডারটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে! (Inquiry ID: ${inquiryId})`
        : `Order successfully saved to Firestore! (Inquiry ID: ${inquiryId})`);

      // Redirect if requested with pre-redirect loading spinner experience
      if (orderIsWhatsAppRedirect) {
        setIsRedirectingToWhatsApp(true);

        // Generate automatic WhatsApp message template
        const waMessage = `New Service Inquiry\n\n` +
          `• Service Name: ${orderServiceName}\n` +
          `• Package: ${orderPackageName || 'Standard'}\n` +
          `• Requirement: ${orderServiceRequirement}\n` +
          `• Customer Name: ${orderCustomerName}\n` +
          `• Mobile Number: ${orderMobileNumber}\n` +
          `• WhatsApp Number: ${orderWhatsAppNumber || orderMobileNumber}\n` +
          `• Email Address: ${orderEmailAddress || 'N/A'}\n` +
          `• Company Name: ${orderCompanyName || 'N/A'}\n` +
          `• Budget: ${orderBudget || 'N/A'}\n` +
          `• Project Details: ${orderProjectDetails || 'N/A'}`;

        setTimeout(() => {
          window.open(`https://wa.me/966570511931?text=${encodeURIComponent(waMessage)}`, '_blank');

          // Clear states after redirect
          setOrderServiceRequirement('');
          setOrderCustomerName('');
          setOrderMobileNumber('');
          setOrderWhatsAppNumber('');
          setOrderEmailAddress('');
          setOrderCompanyName('');
          setOrderBudget('');
          setOrderProjectDetails('');
          
          setIsRedirectingToWhatsApp(false);
          setIsOrderModalOpen(false);
        }, 2500); // Premium 2.5 second delay for high fidelity loading feeling
      } else {
        // Simple inquiry submission - clear states and close immediately
        setOrderServiceRequirement('');
        setOrderCustomerName('');
        setOrderMobileNumber('');
        setOrderWhatsAppNumber('');
        setOrderEmailAddress('');
        setOrderCompanyName('');
        setOrderBudget('');
        setOrderProjectDetails('');
        setIsOrderModalOpen(false);
      }
    } catch (error) {
      console.error("Firestore saving error", error);
      triggerToast(`Error saving inquiry: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleOpenOrderModal = (serviceName: string, packageName: string = 'Standard', isWhatsApp: boolean = true) => {
    setOrderServiceName(serviceName);
    setOrderPackageName(packageName);
    setOrderIsWhatsAppRedirect(isWhatsApp);
    
    // Auto-detect service requirement based on serviceName
    let defaultRequirement = "";
    if (serviceName) {
      const lowerSrv = serviceName.toLowerCase();
      if (lowerSrv.includes("reseller")) {
        defaultRequirement = "Reseller Hosting";
      } else if (lowerSrv.includes("share") || lowerSrv.includes("hosting") || lowerSrv.includes("cpanel")) {
        defaultRequirement = "Web Share Hosting";
      } else if (lowerSrv.includes("domain")) {
        defaultRequirement = "Domain Registration";
      } else if (lowerSrv.includes("landing")) {
        defaultRequirement = "Landing page Website Build";
      } else if (lowerSrv.includes("portal") || lowerSrv.includes("blog") || lowerSrv.includes("news")) {
        defaultRequirement = "News Portal / Blog Website";
      } else if (lowerSrv.includes("growth")) {
        defaultRequirement = "Business Growth Package";
      } else if (lowerSrv.includes("ecommerce") || lowerSrv.includes("e-commerce") || lowerSrv.includes("shop")) {
        if (lowerSrv.includes("gateway") || lowerSrv.includes("payment")) {
          defaultRequirement = "Business Ecommerce+Payment Gateway";
        } else {
          defaultRequirement = "Normal Ecommerce Website";
        }
      } else if (lowerSrv.includes("pos")) {
        defaultRequirement = "POS Solution";
      } else if (lowerSrv.includes("school")) {
        defaultRequirement = "School Management Solution";
      } else if (lowerSrv.includes("facebook") || lowerSrv.includes("fb")) {
        defaultRequirement = "Facebook Marketing";
      } else if (lowerSrv.includes("youtube") || lowerSrv.includes("yt")) {
        defaultRequirement = "YouTube Marketing";
      } else if (lowerSrv.includes("branding") || lowerSrv.includes("profile branding") || lowerSrv.includes("social")) {
        defaultRequirement = "Social media Profile Banding";
      } else if (lowerSrv.includes("google business") || lowerSrv.includes("gmb")) {
        defaultRequirement = "Google Business Profile Setup";
      } else if (lowerSrv.includes("business") || lowerSrv.includes("corporate")) {
        defaultRequirement = "Professional Business Website";
      }
    }
    setOrderServiceRequirement(defaultRequirement);
    
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
            
            <h1 className="text-[15px] xs:text-lg sm:text-3xl md:text-5xl font-extrabold tracking-tight font-display leading-[1.1] text-neutral-900 dark:text-white whitespace-nowrap">
              {language === 'bn' 
                ? "আমাদের প্রিমিয়াম সার্ভিস প্যাকেজগুলো এক্সপ্লোর করুন"
                : "Explore Our Premium Services Packages"}
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {language === 'bn'
                ? "আপনার ব্যবসার গতি বাড়াতে কাস্টম প্রজেক্ট শুরু করুন অথবা ফিক্সড প্রাইজে আমাদের ফাইবার ও হোস্টিংগার স্টাইল রেডি-টু-ইউজ প্যাকেজ কিনুন!"
                : "Choose a Custom Project or Instantly Purchase Fixed-Price Packages for Your Business."}
            </p>



            {/* Fast Launch Route Buttons (Exactly 3 Column Selection Cards for categories) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto pt-2 text-left">
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
                              {formatPrice(srv.startingPrice)}
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
                                {formatPrice(srv.startingPrice)}
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

      {/* 2. SERVICES TAB SELECTION SECTION */}
      {!selectedService && (
        <div className="space-y-5">
          
          {/* Subpage menu tabs navigation (Horizontal, Full-Wide layout with custom UI gradients) */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 mb-4">
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
                  
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-500/10'
                          : 'bg-neutral-50 dark:bg-slate-950/65 text-neutral-600 dark:text-slate-350 hover:bg-neutral-100 dark:hover:bg-slate-900 border border-neutral-200/80 dark:border-slate-800'
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-405'}`} />
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
                          className="group relative flex flex-col justify-between h-full rounded-[24px] overflow-hidden p-[1.5px] transition-shadow duration-300 hover:shadow-[0_25px_50px_rgba(99,102,241,0.25)] dark:hover:shadow-[0_25px_50px_rgba(6,182,212,0.18)]"
                          whileHover={{ 
                            scale: 1.03, 
                            y: -8 
                          }}
                        >
                          {/* Premium Ambient Gradient Border */}
                          <span className={`absolute inset-0 rounded-[24px] bg-gradient-to-r ${
                            isHighDemand 
                              ? 'from-pink-500 via-rose-500 to-amber-400' 
                              : 'from-blue-500 via-indigo-500 to-cyan-400'
                          } opacity-60 dark:opacity-40 group-hover:opacity-100 transition-all duration-500`} />
                          
                          {/* Pulsing light glow behind the card on hover */}
                          <span className={`absolute -inset-1 rounded-[28px] bg-gradient-to-r ${
                            isHighDemand
                              ? 'from-pink-600 via-rose-600 to-amber-500'
                              : 'from-blue-600 via-indigo-600 to-cyan-400'
                          } opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500`} />
                          
                          {/* Main card background container to mask the inner 1.5px border spacing */}
                          <div className="relative z-10 flex flex-col justify-between h-full w-full bg-white dark:bg-[#0B0F19] rounded-[23px] overflow-hidden">
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

                            {/* Wishlist Heart Button */}
                            {toggleWishlist && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(srv.id);
                                }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.8 }}
                                animate={{
                                  scale: wishlist.includes(srv.id) ? [1, 1.3, 0.9, 1.1, 1] : 1
                                }}
                                transition={{ duration: 0.45 }}
                                className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md border shadow-md transition cursor-pointer z-25 ${
                                  wishlist.includes(srv.id)
                                    ? 'bg-rose-50/90 border-rose-200 text-rose-500 dark:bg-rose-950/80 dark:border-rose-900/60'
                                    : 'bg-white/95 dark:bg-[#020617]/90 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500'
                                }`}
                              >
                                <Heart className="w-3.5 h-3.5 fill-current" />
                              </motion.button>
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
                                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-neutral-700 dark:text-slate-300">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                    <span className="line-clamp-1">{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Technologies tag line */}
                            <div className="flex flex-wrap gap-1 pt-1 h-12 overflow-hidden items-start">
                              {srv.technologies.slice(0, 4).map(tech => (
                                <span key={tech} className="bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-350 font-mono text-[9px] px-2 py-0.5 rounded border border-neutral-200/30 dark:border-slate-700/30 group-hover:bg-indigo-50/50 dark:group-hover:bg-slate-800/80 transition-colors duration-350">
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {/* Stats Line with Clock and Work Progress */}
                            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                              {/* Premium Delivery Block */}
                              <div className="relative group/field flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-slate-50 to-neutral-50/50 dark:from-slate-900/50 dark:to-slate-800/20 border border-slate-200/50 dark:border-slate-800/40 overflow-hidden hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-xs transition-all duration-300">
                                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 group-hover/field:scale-110 transition-transform">
                                  <Clock className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{language === 'bn' ? 'ডেলিভারি:' : 'Delivered'}</span>
                                  <span className="block text-[11px] font-extrabold text-neutral-800 dark:text-slate-200 truncate leading-tight">
                                    {language === 'bn' ? `${srv.deliveryDays} দিন` : `${srv.deliveryDays} Days`}
                                  </span>
                                </div>
                              </div>

                              {/* Premium Level Block */}
                              <div className="relative group/field flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-slate-50 to-neutral-50/50 dark:from-slate-900/50 dark:to-slate-800/20 border border-slate-200/50 dark:border-slate-800/40 overflow-hidden hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-xs transition-all duration-300">
                                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 group-hover/field:scale-110 transition-transform">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{language === 'bn' ? 'লেভেল:' : 'Expertise'}</span>
                                  <span className="block text-[11px] font-extrabold text-neutral-800 dark:text-slate-200 truncate leading-tight">
                                    {language === 'bn' ? srv.serviceLevelBn : srv.serviceLevel}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Price Label Area with Elegant Gradient Field & Star icon */}
                            <div className="relative overflow-hidden flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 flex-wrap sm:flex-nowrap gap-2">
                              <div className="flex-1 min-w-[130px] rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-500/10 dark:via-yellow-500/5 dark:to-transparent p-2.5 border-l-4 border-l-amber-500 dark:border-l-amber-400 border-y border-r border-amber-100/50 dark:border-amber-900/10 shadow-xs">
                                <span className="text-[9px] font-black tracking-widest uppercase text-amber-600 dark:text-amber-450 flex items-center gap-1.5 mb-1 leading-none">
                                  <span>{language === 'bn' ? 'শুরু মাত্র' : 'STARTING AT'}</span>
                                  <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                  </span>
                                </span>
                                <span className="text-2xl sm:text-[26px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-yellow-300 dark:via-amber-400 dark:to-orange-400 font-mono tracking-tight drop-shadow-sm leading-none">
                                  {formatPrice(srv.startingPrice)}
                                </span>
                              </div>

                              <div className="shrink-0 flex flex-col items-end justify-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 dark:from-yellow-400 dark:to-amber-500 text-[9px] font-black text-white uppercase tracking-widest shadow-md hover:shadow-lg transition-transform hover:scale-105">
                                  <span>🚀 BEST VALUE</span>
                                </span>
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
                        </div>
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
                      className="rounded-2xl p-[1px] bg-gradient-to-br from-slate-800 to-slate-900/40 hover:from-purple-500 hover:via-amber-400 hover:to-rose-500 transition-all duration-350 overflow-hidden flex flex-col justify-between text-left relative group hover:-translate-y-1 shadow-lg"
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
                              {formatPrice(pkg.price)}
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
        </div>
      )}

      {/* 3. SERVICE DETAIL PAGE/VIEW (DEEP-LINKED / DIRECT-ROUTED COMPREHENSIVE VIEW) */}
      {!isHomePage && selectedService && (
        <ServiceDetails
          service={selectedService}
          language={language}
          theme={theme}
          currency={currency}
          onBack={() => setSelectedService(null)}
          onNavigateToService={(srvId) => {
            const matched = catalogServices.find(s => s.id === srvId);
            if (matched) setSelectedService(matched);
          }}
          allServices={catalogServices}
          addSimulatedServiceOrder={addSimulatedServiceOrder}
          triggerToast={triggerToast}
          addToCart={addToCart}
          setCartOpen={setCartOpen}
          onOrderWhatsApp={(serviceName, packageName) => handleOpenOrderModal(serviceName, packageName, true)}
          onRequestQuotation={(serviceName, packageName) => handleOpenOrderModal(serviceName, packageName, false)}
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

      {/* 🟢 FLOATING ACTION BUTTON FOR WHATSAPP ASSISTANCE */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleOpenOrderModal('General Service / Custom Solution', 'Standard', true)}
          className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-lg shadow-emerald-500/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 overflow-hidden group"
          id="whatsapp-floating-action-button"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
          <MessageSquare className="w-7 h-7 relative z-10 text-white group-hover:rotate-12 transition-transform duration-300" />
        </motion.button>
        {/* Hover label tool-tip styled beautifully */}
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold py-1 px-3 rounded-lg border border-slate-800 shadow-md">
          {language === 'bn' ? 'সরাসরি সাহায্য পান 💬' : 'Custom Assistance 💬'}
        </div>
      </div>

      {/* 📋 UNIFIED PREMIUM GLASSMORPHIC SERVICE ORDER & INQUIRY MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0F172A] rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#E2E8F0]/30 dark:border-white/10 text-left"
          >
            {/* Top Branding Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

            {isRedirectingToWhatsApp ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 my-12">
                <div className="relative flex items-center justify-center">
                  {/* Glowing pulsing background */}
                  <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                  
                  {/* Rotating Outer Ring */}
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-850 border-t-emerald-500 animate-spin flex items-center justify-center" />
                  
                  {/* Inner WhatsApp/Message Icon */}
                  <div className="absolute flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-emerald-500 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে যুক্ত করা হচ্ছে...' : 'Connecting to WhatsApp...'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    {language === 'bn' 
                      ? 'আপনার গুরুত্বপূর্ণ তথ্যটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে। এখন সরাসরি আলোচনা করতে নিয়ে যাওয়া হচ্ছে।' 
                      : 'Your order has been recorded securely in Firestore. Redirecting you to chat with WebzoneBD Support.'}
                  </p>
                </div>

                {/* Micro progress bar */}
                <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mx-auto">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.3, ease: "easeInOut" }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="p-1.5 bg-violet-500/10 text-violet-500 rounded-lg">
                        {orderIsWhatsAppRedirect ? <MessageSquare className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
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
                        ? (language === 'bn' ? 'অর্ডারটি সরাসরি ডাটাবেজে সংরক্ষিত হয়ে হোয়াটসঅ্যাপে রিডাইরেক্ট হবে' : 'Your order details will be saved to Firestore and sent to WhatsApp.') 
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
                      {orderServiceRequirement && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {language === 'bn' ? "নির্বাচিত" : language === 'ar' ? "تم التحديد" : "Selected"}
                        </span>
                      )}
                    </div>

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
                            'Software Solutions': { en: "Software Solutions", bn: "সফটওয়্যার সলিউশন", ar: "البرمجيات الإدارية والحلول" }
                          };
                          return ['all', 'Hosting & Domains', 'Website Development', 'Digital Marketing', 'Software Solutions'].map((cat) => {
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
                            const isSelected = orderServiceRequirement === item.id;
                            const ItemIcon = item.icon;
                            
                            const localizedLabel = language === 'bn' ? item.labelBn : language === 'ar' ? item.labelAr : item.label;
                            const localizedDesc = language === 'bn' ? item.descBn : language === 'ar' ? item.descAr : item.desc;
                            const localizedCategory = language === 'bn' ? item.categoryBn : language === 'ar' ? item.categoryAr : item.category;

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
                                onClick={() => setOrderServiceRequirement(item.id)}
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

                  {/* Row 5: Budget (Optional) */}
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="order_budget"
                      value={orderBudget}
                      onChange={(e) => setOrderBudget(e.target.value)}
                      placeholder=" "
                      className="peer w-full h-[56px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] px-4 pt-5 pb-1.5 text-xs sm:text-sm font-medium text-[#0F172A] dark:text-white placeholder-transparent focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-violet-500 transition-all duration-300"
                    />
                    <label 
                      htmlFor="order_budget"
                      className="absolute left-4 top-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[12px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:translate-y-0 scale-100 peer-focus:scale-85 peer-[:not(:placeholder-shown)]:scale-85 origin-left text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] transition-all duration-300 pointer-events-none"
                    >
                      Expected Budget (Optional)
                    </label>
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

                  {/* Action Submit Button */}
                  <button 
                    type="submit"
                    className="w-full h-[54px] text-white text-sm font-semibold rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] shadow-[0_12px_30px_rgba(124,58,237,0.35)] hover:scale-102 hover:shadow-[0_15px_35px_rgba(124,58,237,0.45)] active:scale-98 transition-all duration-300 text-center flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {orderIsWhatsAppRedirect ? <MessageSquare className="w-5 h-5 text-white" /> : <Send className="w-5 h-5 text-white" />}
                    <span>
                      {orderIsWhatsAppRedirect 
                        ? (language === 'bn' ? 'অর্ডার সম্পন্ন করুন (হোয়াটসঅ্যাপ)' : 'Complete Order on WhatsApp') 
                        : (language === 'bn' ? 'কোটেশন রিকোয়েস্ট সাবমিট করুন' : 'Submit Quotation Request')
                      }
                    </span>
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
