import React, { useState } from 'react';
import { 
  CheckCircle2, Sparkles, Phone, MessageSquare, 
  Flame, Star, Gift, ArrowRight, Award, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme } from '../types';

interface PackageProps {
  language: Language;
  theme: Theme;
}

export default function Package({ language, theme }: PackageProps) {
  const [consultationModal, setConsultationModal] = useState(false);
  const [selectedPackageForForm, setSelectedPackageForForm] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    notes: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Localization matrix
  const t = {
    en: {
      sectionTitle: "Business Growth Packages",
      sectionSubtitle: "Launch and grow your business online with our complete business setup, branding, website, and marketing solutions.",
      pkgFeaturesTitle: "Premium Business Features",
      perfectFor: "Perfect For",
      includedServices: "Included Setup & Services",
      bonusHeading: "FREE BONUS GIFTS",
      regularPrice: "Regular Price",
      offerPrice: "Special Offer Price",
      saveText: "Display Savings",
      getPkgBtn: "Get This Package",
      waBtn: "WhatsApp Consultation",
      successMsg: "Assalamu Alaikum! Your business growth requirements have been submitted. Our executive will WhatsApp you shortly with your customized setup blueprint.",
      formTitle: "Activate Your Growth Package Plan",
      formSub: "Establish your brand and business professionally online today.",
      fieldName: "Your Full Name",
      fieldPhone: "WhatsApp / Contact Phone",
      fieldEmail: "Business Email Address",
      fieldBusiness: "Your Business/Brand Name",
      fieldNotes: "Special requests or specific goals for your business setup",
      submitBtn: "Activate & Confirm Plan",
      ctaTitle: "Ready To Grow Your Business?",
      ctaSubtitle: "Start your digital journey with WebzoneBD IT Solution and establish your business professionally online.",
      ctaGetStarted: "Get Started Today",
      ctaFreeConsult: "Request Free Consultation",
      ctaWaNow: "WhatsApp Now"
    },
    bn: {
      sectionTitle: "বিজনেস গ্রোথ প্যাকেজ",
      sectionSubtitle: "আমাদের কমপ্লিট বিজনেস সেটআপ, ব্র্যান্ডিং, ওয়েবসাইট এবং মার্কেটিং সলিউশনের মাধ্যমে আপনার ব্যবসা অনলাইনে শুরু করুন এবং বৃদ্ধি করুন।",
      pkgFeaturesTitle: "বিশেষ বিজনেস ফিচারসমূহ",
      perfectFor: "যাদের জন্য প্রযোজ্য",
      includedServices: "অন্তর্ভুক্ত সেটআপ ও সার্ভিসসমূহ",
      bonusHeading: "সম্পূর্ণ ফ্রি বোনাস গিফটস",
      regularPrice: "নিয়মিত মূল্য",
      offerPrice: "স্পেশাল অফার প্রাইস",
      saveText: "সঞ্চয় করুন",
      getPkgBtn: "এই প্যাকেজটি নিন",
      waBtn: "হোয়াটসঅ্যাপ কনসালটেশন",
      successMsg: "আসসালামু আলাইকুম! আপনার বিজনেস গ্রোথ প্যাকেজের অনুরোধ জমা হয়েছে। আমাদের রিপ্রেজেন্টেটিভ খুব শীঘ্রই হোয়াটসঅ্যাপে আপনার সাথে যোগাযোগ করবেন।",
      formTitle: "আপনার গ্রোথ প্যাকেজ প্ল্যান চালু করুন",
      formSub: "আজই পেশাদার উপায়ে অনলাইনে আপনার ব্র্যান্ড এবং ব্যবসা প্রতিষ্ঠা করুন।",
      fieldName: "আপনার সম্পূর্ণ নাম",
      fieldPhone: "হোয়াটসঅ্যাপ / মোবাইল নম্বর",
      fieldEmail: "ব্যবসায়িক ইমেইল ঠিকানা",
      fieldBusiness: "আপনার ব্যবসা বা ব্র্যান্ডের নাম",
      fieldNotes: "আপনার ব্যবসা বা প্রজেক্ট সম্পর্কিত বিশেষ কোনো চাহিদা",
      submitBtn: "প্যাকেজ অর্ডার কনফার্ম করুন",
      ctaTitle: "আপনার ব্যবসা বৃদ্ধি করতে প্রস্তুত?",
      ctaSubtitle: "ওয়েবজোনবিডি আইটি সলিউশন-এর সাথে আপনার ডিজিটাল যাত্রা শুরু করুন এবং অনলাইনে আপনার ব্র্যান্ড ও ব্যবসা গড়ে তুলুন।",
      ctaGetStarted: "আজই শুরু করুন",
      ctaFreeConsult: "ফ্রি কনসালটেশন রিকোয়েস্ট",
      ctaWaNow: "হোয়াটসঅ্যাপ চ্যাট করুন"
    },
    ar: {
      sectionTitle: "باقات نمو الأعمال",
      sectionSubtitle: "ابدأ وطوّر عملك التجاري عبر الإنترنت من خلال حلولنا المتكاملة لتأسيس الأعمال والهوية البصرية والمواقع والتسويق الإلكتروني.",
      pkgFeaturesTitle: "ميزات الأعمال المتميزة",
      perfectFor: "مثالي لـ",
      includedServices: "الخدمات والتأسيسات المشمولة",
      bonusHeading: "الهدايا والمكافآت المجانية",
      regularPrice: "السعر الأصلي",
      offerPrice: "سعر العرض الخاص",
      saveText: "مجموع الوفورات",
      getPkgBtn: "احصل على هذه الباقة",
      waBtn: "استشارة عبر الواتساب",
      successMsg: "وعليكم السلام ورحمة الله وبركاته! تم استلام طلب باقة نمو الأعمال بنجاح. سيتواصل معك أحد مطورينا عبر الواتساب قريباً لمناقشة التفاصيل فنية.",
      formTitle: "تفعيل خطة نمو أعمالك المخصصة",
      formSub: "أسس هويتك التجارية ومشروعك على الإنترنت بشكل احترافي ومتكامل اليوم.",
      fieldName: "الاسم الكامل الكريم",
      fieldPhone: "رقم الجوال / الواتساب النشط",
      fieldEmail: "البريد الإلكتروني للعمل",
      fieldBusiness: "اسم شركتك أو مشروعك الجديد",
      fieldNotes: "ملاحظاتك وشروطك المحددة لبناء وتجهيز نظام أعمالك",
      submitBtn: "تأكيد وتفعيل الباقة الآن",
      ctaTitle: "هل تريد البدء في تطوير أعمالك؟",
      ctaSubtitle: "ابدأ رحلتك الرقمية الآن مع ويب زون لتكنولوجيا المعلومات وأسس مشروعك التجاري بقوة على الإنترنت.",
      ctaGetStarted: "ابدا الآن اليوم",
      ctaFreeConsult: "طلب استشارة فنية مجانية",
      ctaWaNow: "تواصل عبر الواتساب"
    }
  }[language];

  const sharedFeatures = [
    { en: "Business Setup", bn: "অনলাইন বিজনেস সেটআপ", ar: "تأسيس وترخيص الأعمال" },
    { en: "Website Development", bn: "রেসপনসিভ ওয়েবসাইট তৈরি", ar: "تطوير وبرمجة المواقع" },
    { en: "Social Media Setup", bn: "সোশ্যাল মিডিয়া পেজ সেটআপ", ar: "إعداد حسابات السوشيال ميديا" },
    { en: "Branding", bn: "প্রফেশনাল ব্র্যান্ডিং ডিজাইন", ar: "الهوية البصرية والعلامة" },
    { en: "Marketing Materials", bn: "সোশ্যাল মার্কেটিং গ্রাফিক্স", ar: "عناصر ومواد التسويق الرقمي" },
    { en: "Business Growth Support", bn: "বিজনেস গ্রোথ সাপোর্ট সার্ভিস", ar: "دعم مخصص واستشارات النمو" },
    { en: "Mobile Friendly", bn: "মোবাইল ও ট্যাব ফ্রেন্ডলি", ar: "متوافق كلياً مع الهواتف" },
    { en: "Fast Delivery", bn: "সবচেয়ে দ্রুত সময়ের ডেলিভারি", ar: "تسليم سريع والتزام تام" }
  ];

  const packagesData = [
    {
      id: "pkg-bd",
      name: {
        en: "Bangladesh Business Growth Package",
        bn: "বাংলাদেশ বিজনেস গ্রোথ প্যাকেজ",
        ar: "الباقة الذهبية لنمو أعمال بنجلاديش"
      },
      isPopular: true,
      badge: "🔥 50% OFF",
      perfectFor: {
        en: "Small Businesses, Entrepreneurs, Online Shops, Local Brands",
        bn: "ক্ষুদ্র ব্যবসা, নতুন উদ্যোক্তা, অনলাইন শপ এবং লোকাল ব্র্যান্ড",
        ar: "المشاريع الناشئة والشركات الصغيرة ومتاجر التجزئة والعلامات التجارية المحلية"
      },
      currency: "৳",
      regularPrice: "30,000",
      offerPrice: "15,000",
      savings: "Save ৳15,000",
      savingsBn: "সঞ্চয় ৳১৫,০০০",
      savingsAr: "وفر 15,000 تاكا",
      whatsappNumber: "+8801864000005",
      includedServices: [
        { en: "Google Business Profile Setup", bn: "গুগল বিজনেস প্রোফাইল সেটআপ ও ভেরিফাই", ar: "إعداد وتفعيل الملف التجاري جوجل بماب" },
        { en: "Professional Ecommerce Website", bn: "প্রফেশনাল ই-কমার্স ওয়েবসাইট (বিকাশ/নগদ অটো পেমেন্টসহ)", ar: "موقع ويب تجاري متكامل للدفع والشحن" },
        { en: "Facebook Business Page Setup", bn: "ফেসবুক বিজনেস পেজ প্রফেশনাল সেটআপ", ar: "تجهيز صفحة فيسبوك للأعمال بالشعار والأزرار" },
        { en: "Instagram Business Account Setup", bn: "ইনস্টাগ্রাম প্রফেশনال বিজনেস সেটআপ", ar: "إعداد وتوثيق حساب إنستقرام التجاري الكامل" },
        { en: "TikTok Business Account Setup", bn: "টিকটক ক্রিয়েটর ও বিজনেস অ্যাকাউন্ট সেটআপ", ar: "إنشاء وتكوين حساب تيكتوك للأعمال الاحترافي" },
        { en: "Business WhatsApp Setup", bn: "বিজনেস হোয়াটসঅ্যাপ ও অটো-রিপ্লাই সেটআপ", ar: "ربط رقم واتساب للأعمال ورسائل الترحيب التلقائية" },
        { en: "Professional Business Email Setup", bn: "প্রফেশনাল বিজনেস ইমেইল ক্রিয়েট (যেমন: mail@yourbrand.com)", ar: "إنشاء وتفعيل البريد الإلكتروني المهني لشركتك" }
      ],
      freeBonus: [
        { en: "Professional Cover Design", bn: "সব প্ল্যাটফর্মের কভার ফটো ডিজাইন", ar: "تصميم غلاف احترافي موحد للمنصات" },
        { en: "2 Custom Social Media Posters", bn: "২টি কাস্টম সোশ্যাল মিডিয়া পোস্টার", ar: "تصميم ملصقين تفاعليين للسوشيال بوستس" },
        { en: "Business Promotion Animation Video", bn: "১টি আকর্ষণীয় বিজনেস প্রমোশন অ্যানিমেশন ভিডিও", ar: "فيديو أنيميشن ترويجي قصير لمشروعك" },
        { en: "Basic SEO Setup", bn: "বেসিক সার্চ ইঞ্জিন অপটিমাইজেশন (SEO)", ar: "تهيئة أولية لمحركات البحث والأرشفة" }
      ]
    },
    {
      id: "pkg-sa",
      name: {
        en: "Saudi Arabia Business Growth Package",
        bn: "সৌদি আরব বিজনেস গ্রোথ প্যাকেজ",
        ar: "باقة نمو الأعمال المتكاملة بالمملكة العربية السعودية"
      },
      isPopular: false,
      badge: "🔥 50% OFF",
      perfectFor: {
        en: "Saudi Businesses, Restaurants, Shops, Ecommerce Stores, Service Providers",
        bn: "সৌদি ব্যবসা, রেস্টুরেন্ট, সুপারশপ, ই-কমার্স স্টোর এবং যেকোনো সার্ভিস প্রোভাইডার",
        ar: "الشركات السعودية، المطاعم، المقاهي، المتاجر الإلكترونية، ومزودي الخدمات التجارية والمهنية"
      },
      currency: "SAR",
      regularPrice: "3,000",
      offerPrice: "1,499",
      savings: "Save 1,501 SAR",
      savingsBn: "সঞ্চয় ১,৫০১ SAR",
      savingsAr: "وفر 1,501 ريال سعودي",
      whatsappNumber: "+966570511931",
      includedServices: [
        { en: "Google Business Profile Setup", bn: "গুগল বিজনেস প্রোফাইল ম্যাপ ও রিভিউ সেটআপ", ar: "تأسيس موقعك على خرائط جوجل والحصول على موافقة سريعة" },
        { en: "Haraj Account Setup", bn: "সৌদি জনপ্রিয় 'হারাজ' (Haraj) অ্যাকাউন্ট সেটআপ", ar: "تجهيز حسابك وتوثيقه على منصة حراج السعودية الشهيرة" },
        { en: "Professional Ecommerce Website", bn: "প্রফেশনাল আর্ট ই-কমার্স ওয়েবসাইট (Salla / Shopify / Custom)", ar: "موقع مجر إلكتروني متكامل يدعم تمارا، مدي و سداد" },
        { en: "Facebook Business Page Setup", bn: "ফেসবুক মেটা বিজনেস সুইট পেজ সেটআপ", ar: "تهيئة صفحة فيسبوك والربط مع إنستقرام ميتا بزنس" },
        { en: "Instagram Business Account Setup", bn: "ইনস্টাগ্রাম বিজনেস হাইলাইটস ও বায়ো অপটিমাইজেশন", ar: "تصميم وتنظيم واجهة انستقرام وسطور الهايلايت" },
        { en: "TikTok Business Account Setup", bn: "টিকটক বিজনেস অ্যাকাউন্ট ও ভিডিও আপলোড গাইড", ar: "تجهيز قناة تيكتوك وعمل روابط الموقع الإلكتروني به" },
        { en: "Snapchat Business Account Setup", bn: "স্ন্যাপচ্যাট বিজনেস ম্যানেজার ও অ্যাড অ্যাকাউন্ট সেটআপ", ar: "إنشاء حساب سنابشات للأعمال وتفعيل لوحة الإعلانات" }
      ],
      freeBonus: [
        { en: "Professional Cover Design For All Platforms", bn: "সব সোশ্যাল প্ল্যাটফর্মের জন্য ইউনিক কভার ডিজাইন", ar: "تصميم كفرات وبنرات احترافية تناسب مقاسات كل منصة" },
        { en: "2 Professional Social Media Posts Per Platform", bn: "সোশ্যাল প্ল্যাটফর্মগুলোর জন্য ২টি করে ডিজাইন পোস্ট", ar: "منشورين ترويجيين مصممين لمشروعك لمختلف المنصات" },
        { en: "Marketing Animation Video", bn: "১টি আকর্ষণীয় মোশন প্রমোশনাল অ্যানিমেশন ভিডিও", ar: "فيديو تسويقي موشن جرافيك عالي الجودة للبراند" },
        { en: "Basic SEO Setup", bn: "গুগল সার্চ ও রেঙ্কিং বেসিক এসইও (SEO)", ar: "تهيئة كود وبرمجة الموقع لسرعة الأرشفة بالبحث" }
      ]
    }
  ];

  const handleOpenForm = (pkgName: string) => {
    setSelectedPackageForForm(pkgName);
    setFormData(prev => ({ ...prev, notes: `Interested in activating: ${pkgName}` }));
    setConsultationModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setConsultationModal(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        businessName: '',
        notes: ''
      });
    }, 4500);
  };

  const handleWhatsAppChat = (whatsappNum: string, pkgName: string) => {
    const defaultGreetings = language === 'bn' 
      ? `আসসালামু আলাইকুম WebzoneBD, আমি আপনার '${pkgName}' প্যাকেজটি সম্পর্কে জানতে এবং এটি বুক করতে চাচ্ছি।`
      : language === 'ar'
      ? `السلام عليكم ويب زون، أود الاستفسار وطلب '${pkgName}' لمشروعي التجاري.`
      : `Assalamu Alaikum WebzoneBD, I am highly interested in ordering the '${pkgName}' for my business growth.`;
    
    window.open(`https://wa.me/${whatsappNum.replace('+', '')}?text=${encodeURIComponent(defaultGreetings)}`, '_blank', 'noreferrer,noopener');
  };

  const isRtl = language === 'ar';

  return (
    <div className="py-8 md:py-16 text-left" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Dynamic Glow Background Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Subtitle blocks */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 px-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black font-mono uppercase tracking-widest bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/10">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>{t.sectionTitle}</span>
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-display tracking-tight text-neutral-900 dark:text-white leading-tight">
          {t.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-neutral-500 dark:text-slate-400 leading-relaxed font-sans">
          {t.sectionSubtitle}
        </p>
      </div>

      {/* 2 Featured Packages Section Layout: Premium SaaS Cards using Glassmorphism Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-[1360px] mx-auto px-4 mb-20">
        {packagesData.map((pkg) => {
          const transPackageName = language === 'bn' ? pkg.name.bn : language === 'ar' ? pkg.name.ar : pkg.name.en;
          const transPerfectFor = language === 'bn' ? pkg.perfectFor.bn : language === 'ar' ? pkg.perfectFor.ar : pkg.perfectFor.en;
          const transSavings = language === 'bn' ? pkg.savingsBn : language === 'ar' ? pkg.savingsAr : pkg.savings;

          return (
            <div 
              key={pkg.id}
              className={`relative rounded-[24px] p-[1.5px] bg-gradient-to-br transition-all duration-300 hover:shadow-[0_30px_60px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_30px_60px_rgba(6,182,212,0.08)] hover:-translate-y-2 overflow-hidden flex flex-col justify-between ${
                pkg.isPopular 
                  ? 'from-blue-650 via-indigo-600 to-cyan-450 shadow-xl shadow-blue-500/15' 
                  : 'from-neutral-200 to-neutral-300/40 dark:from-slate-805 dark:to-slate-900/40 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-450 dark:hover:from-blue-500 dark:hover:via-indigo-500 dark:hover:to-cyan-450'
              }`}
            >
              <div className="bg-white dark:bg-[#0f172a] rounded-[22px] overflow-hidden flex flex-col justify-between h-full w-full">
              {/* Popular Package Ribbon overlay */}
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 overflow-hidden w-32 h-32 pointer-events-none z-10">
                  <div className="absolute top-5 -right-9 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[9px] font-black font-mono py-1 px-10 text-center uppercase tracking-wider rotate-45 shadow-sm">
                    BEST VALUE
                  </div>
                </div>
              )}

              {/* Decorative Card Header Ambient Light */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-transparent" />

              {/* Card Body Content */}
              <div className="p-8 sm:p-10 lg:p-12 space-y-8 flex-1">
                {/* Upper Badge & Name Block */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black bg-rose-500 text-white rounded-lg uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{pkg.badge}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
                      {pkg.id === 'pkg-bd' ? 'Bangladesh Division' : 'GCC / Saudi Division'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight font-display bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text">
                    {transPackageName}
                  </h3>

                  <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 p-4.5 rounded-xl">
                    <p className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-blue-600 dark:text-cyan-400 mb-1">
                      {t.perfectFor}:
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                      {transPerfectFor}
                    </p>
                  </div>
                </div>

                {/* Premium Smart Pricing Block inside a beautiful high-tech glass card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-50 to-neutral-100/50 dark:from-slate-900/60 dark:to-[#0f172a] border border-neutral-150 dark:border-slate-850/80 text-left relative overflow-hidden group/price shadow-md">
                  {/* Subtle dynamic radial glow matching the package status */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pkg.isPopular ? 'from-cyan-500/10' : 'from-indigo-500/10'} to-transparent rounded-full blur-xl pointer-events-none`} />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-black tracking-widest text-neutral-400 dark:text-slate-500 block">
                        {t.regularPrice}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold line-through text-neutral-450 dark:text-slate-600 font-mono">
                          {pkg.currency} {pkg.regularPrice}
                        </span>
                        <span className="text-[9.5px] font-black text-rose-600 dark:text-rose-450 bg-rose-50 dark:bg-rose-500/10 border border-rose-200/40 dark:border-none px-2.5 py-0.5 rounded-full uppercase">
                          50% {language === 'bn' ? 'ছাড়' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right space-y-1">
                      <span className="text-[10px] uppercase font-mono font-black tracking-widest text-emerald-600 dark:text-emerald-400 flex sm:justify-end items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-amber-500" />
                        <span>{t.offerPrice}</span>
                      </span>
                      
                      <div className="flex items-baseline gap-1 sm:justify-end">
                        <span className="text-3.5xl sm:text-4xl font-extrabold font-mono bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
                          {pkg.currency} {pkg.offerPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Savings pill with gradient border styling at the bottom of the price box */}
                  <div className="mt-4 pt-4 border-t border-dashed border-neutral-200 dark:border-slate-850 flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/8 dark:bg-emerald-500/12 border border-emerald-500/10 dark:border-emerald-500/25 shadow-sm">
                      <Gift className="w-4 h-4 text-emerald-500 animate-bounce" />
                      <span>{transSavings}</span>
                    </div>

                    <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">
                      {language === 'bn' ? '⚡ ইনস্ট্যান্ট এক্টিভেশন' : '⚡ Instant Activation'}
                    </span>
                  </div>
                </div>

                {/* Included setup and business services */}
                <div className="space-y-4 text-left">
                  <p className="text-xs uppercase font-mono font-black tracking-widest text-[#475569] dark:text-[#cbd5e1] flex items-center gap-1.5 border-b border-neutral-100 dark:border-slate-800 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{t.includedServices}</span>
                  </p>

                  <div className="space-y-3.5 pt-1">
                    {pkg.includedServices.map((service, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed">
                        <span className="mt-0.5 w-4.5 h-4.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-450 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span className="text-slate-700 dark:text-slate-350 font-sans font-medium">
                          {language === 'bn' ? service.bn : language === 'ar' ? service.ar : service.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FREE BONUS GIFTS block section */}
                <div className="p-6 sm:p-8 rounded-[20px] bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 dark:border-amber-500/15 space-y-4 text-left shadow-xs">
                  <p className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest font-mono flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-500 animate-bounce" />
                    <span>{t.bonusHeading}</span>
                  </p>

                  <div className="space-y-3 text-xs sm:text-[13px]">
                    {pkg.freeBonus.map((bonus, index) => (
                      <div key={index} className="flex items-start gap-2 text-slate-755 dark:text-slate-300 font-sans leading-relaxed">
                        <span className="text-amber-500 font-bold shrink-0">✔</span>
                        <span>{language === 'bn' ? bonus.bn : language === 'ar' ? bonus.ar : bonus.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons footer for custom cards */}
              <div className="p-8 sm:p-10 bg-slate-50/50 dark:bg-[#020617]/40 border-t border-slate-100 dark:border-slate-805/80 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleOpenForm(transPackageName)}
                  className="w-full sm:w-1/2 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.getPkgBtn}</span>
                </button>

                <button
                  onClick={() => handleWhatsAppChat(pkg.whatsappNumber, transPackageName)}
                  className="w-full sm:w-1/2 py-4 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500/90 dark:hover:bg-emerald-505 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.waBtn}</span>
                </button>
              </div>
             </div>
            </div>
          );
        })}
      </div>

      {/* Package Shared Features Comparison Table Checklist */}
      <div className="max-w-4xl mx-auto px-4 mb-20 bg-white/40 dark:bg-neutral-900/10 border border-neutral-200/50 dark:border-neutral-850 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-sm font-mono font-black text-center text-neutral-400 uppercase tracking-widest mb-6 border-b border-dashed border-slate-200 dark:border-slate-800 pb-4">
          🛡️ {t.pkgFeaturesTitle}
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sharedFeatures.map((feat, i) => (
            <div key={i} className="flex items-center gap-2.5 p-3 bg-neutral-50/60 dark:bg-neutral-950/40 rounded-xl border border-neutral-100 dark:border-neutral-900/60 transition duration-150 hover:border-blue-500/20">
              <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 truncate">
                {language === 'bn' ? feat.bn : language === 'ar' ? feat.ar : feat.en}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Premium CTA SECTION explicitly designed */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white p-8 md:p-14 text-center border border-neutral-800 max-w-5xl mx-auto px-4 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 mb-2">
            <Award className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white mb-2 leading-tight">
            {t.ctaTitle}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-sans font-medium">
            {t.ctaSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => handleOpenForm("WebzoneBD Corporate Growth Package")}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-bounce" />
              <span>{t.ctaGetStarted}</span>
            </button>

            <button
              onClick={() => handleOpenForm("Free Custom Tech Evaluation Consultation")}
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.ctaFreeConsult}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleWhatsAppChat("+966570511931", "Complete IT Enterprise Consultation")}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Phone className="w-4 h-4 fill-white shrink-0" />
              <span>{t.ctaWaNow}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Consultation Form Popup modal */}
      <AnimatePresence>
        {consultationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConsultationModal(false)}
              className="absolute inset-0 bg-neutral-950/75 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col z-10"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-500 absolute top-0 left-0" />

              <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/60 mb-4">
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white">
                    {t.formTitle}
                  </h3>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5">
                    {t.formSub}
                  </p>
                </div>
                <button
                  onClick={() => setConsultationModal(false)}
                  className="p-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-xs font-mono font-bold text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                     <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h4 className="text-base font-black text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'সফলভাবে সাবমিট হয়েছে!' : language === 'ar' ? 'تم البدء بنجاح!' : 'Submission Successful!'}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans max-w-sm">
                    {t.successMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 pl-1">
                  {selectedPackageForForm && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/15 text-blue-605 dark:text-cyan-400 text-xs font-bold text-center animate-pulse">
                      ⚡ Active Request Plan: {selectedPackageForForm}
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-mono">
                      {t.fieldName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Imran Hasan"
                      className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-mono">
                        {t.fieldPhone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="e.g. +8801864000005"
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-mono">
                        {t.fieldEmail}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="e.g. business@example.com"
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-mono">
                      {t.fieldBusiness}
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleFormChange}
                      placeholder="e.g. Webzone Brand Shop"
                      className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-neutral-50/50 dark:bg-neutral-950/30 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-mono">
                      {t.fieldNotes}
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleFormChange}
                      placeholder="What is your product category or business goals?"
                      className="w-full text-xs font-sans px-3 py-2 border rounded-xl bg-neutral-50/50 dark:bg-neutral-[#243c5a]/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 proxy-input"
                    />
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationModal(false)}
                      className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                    >
                      {t.submitBtn}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
