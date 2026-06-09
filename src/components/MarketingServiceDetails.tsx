import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Check, Sparkles, MessageSquare, PhoneCall, 
  ArrowRight, ShieldCheck, Gift, Award, TrendingUp, Users, CheckCircle, 
  X, AlertCircle, Send, Globe, Play, HelpCircle, Layers, Heart, Smartphone
} from 'lucide-react';
import { Language, Theme, Order, Currency } from '../types';

interface MarketingServiceDetailsProps {
  language: Language;
  theme: Theme;
  currency: Currency;
  currencySettings: any;
  onBack: () => void;
  addSimulatedServiceOrder: (order: Order) => void;
  triggerToast: (msg: string) => void;
}

export default function MarketingServiceDetails({
  language,
  theme,
  currency,
  currencySettings,
  onBack,
  addSimulatedServiceOrder,
  triggerToast
}: MarketingServiceDetailsProps) {
  
  // Custom states
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'pro' | 'business'>('pro');
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [orderPackageTier, setOrderPackageTier] = useState<'basic' | 'pro' | 'business'>('pro');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessType: '',
    platformNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exchange rates logic consistent with the app's rates
  const getExchangeRates = () => {
    const bdtRate = currencySettings?.rates?.BDT ?? 118.5;
    const sarRate = currencySettings?.rates?.SAR ?? 3.75;
    return { bdtRate, sarRate };
  };

  const { bdtRate, sarRate } = getExchangeRates();

  // Convert prices dynamically (৳5,000, ৳8,000, ৳12,000 base in BDT)
  const getPackagePrice = (bdtPrice: number) => {
    if (currency === 'BDT') {
      return `৳ ${bdtPrice.toLocaleString()}`;
    } else if (currency === 'SAR') {
      const sarVal = ((bdtPrice / bdtRate) * sarRate).toFixed(0);
      return `﷼ ${Number(sarVal).toLocaleString()}`;
    } else {
      const usdVal = (bdtPrice / bdtRate).toFixed(1);
      return `$ ${Number(usdVal).toLocaleString()}`;
    }
  };

  // Translations object supporting English, Bengali, and Arabic
  const t = {
    en: {
      allServices: "All Services",
      verifiedSMM: "Premium Marketing Service",
      mainTitle: "Digital & Social Media Marketing (SMM)",
      subtitle: "Build a powerful online presence and attract more customers through professional social media setup, branding, content creation, and promotional marketing services.",
      badgeProfessional: "⭐ Professional Service",
      badgePlatforms: "📱 5 Social Platforms",
      badgeSolutions: "🚀 Business Growth Solutions",
      badgeConsultation: "💬 Free Consultation",
      orderService: "Order Service Now",
      whatsAppNow: "WhatsApp Inquiry",
      getFreeConsultation: "Get Free Consultation",
      platformsTitle: "Social Platforms Included",
      platformsSubtitle: "We setup and professionally optimize your business presence across all top networks.",
      pricingTitle: "Premium Marketing Packages",
      pricingSubtitle: "Pick the best suited advertising and identity tier to match your marketing budget.",
      popularBadge: "Popular",
      bestValueBadge: "Best Value",
      deliveryTime: "Delivery Time",
      featuresTitle: "Why Choose This Service?",
      whyChooseSubtitle: "Our high-impact SMM setups guarantee business acceleration and conversions.",
      workProcessTitle: "Our Work Process",
      workProcessSubtitle: "How we guide your business profiles from initial planning to live targeted audiences.",
      bonusTitle: "Exclusive Free Bonus Pack",
      bonusSubtitle: "Receive these premium add-ons for 100% free with any core package choice.",
      readyCtaTitle: "Ready To Grow Your Business Online?",
      readyCtaSubtitle: "Launch your business professionally across the most popular social media platforms and build a strong digital presence today.",
      whatsappConsultation: "WhatsApp Support",
      consultationModalTitle: "Free Marketing Consultation Support",
      consultationModalSubtitle: "Tell us about your business goals. Our chief campaign manager will call you shortly on WhatsApp.",
      fullName: "Full Name",
      phoneNumber: "Phone/WhatsApp Number",
      emailAddress: "Email Address",
      businessTypeLabel: "Your Business Sector",
      additionalNotes: "Additional Platform Notes / Goals",
      closeBtn: "Close",
      submitRequest: "Submit Inquiry Room",
      submitting: "Registering Inquiry...",
      orderConfirmTitle: "Confirm SMM Package Order",
      confirmOrderBtn: "Place Order Now",
      oneTimeSetup: "Professional Setup Package Includes Lifetime Ownership and Complete Access.",
      basicPack: "Basic Package",
      proPack: "Pro Package",
      businessPack: "Business Package"
    },
    bn: {
      allServices: "সকল সার্ভিস",
      verifiedSMM: "স্পেশাল মার্কেটিং গাইড",
      mainTitle: "Digital & Social Media Marketing (SMM)",
      subtitle: "ইন্টারনেটের দুনিয়ায় আপনার ব্যবসাকে বড় করতে এবং লোকাল কাস্টমার বৃদ্ধি করতে ফেসবুক, ইনস্টাগ্রাম, ইউটিউব ও টিকটক সহ ৫টি সামাজিক মাধ্যমে প্রফেশনাল পেজ সেটআপ, ব্যানার ব্যান্ডিং ও ক্যাম্পেইন সার্ভিস।",
      badgeProfessional: "⭐ প্রফেশনাল সার্ভিস",
      badgePlatforms: "📱 ৫টি সোশ্যাল মিডিয়া",
      badgeSolutions: "🚀 বিজনেস গ্রোথ সমাধান",
      badgeConsultation: "💬 ফ্রি কনসাল্টেশন",
      orderService: "সার্ভিস অর্ডার করুন",
      whatsAppNow: "হোয়াটসঅ্যাপ করুন",
      getFreeConsultation: "ফ্রি পরামর্শ নিন",
      platformsTitle: "একসাথে ৫টি সোশ্যাল মিডিয়া সেটআপ",
      platformsSubtitle: "গ্লোবাল স্ট্যান্ডার্ড মেনে অত্যন্ত আকর্ষণীয় ডিজাইনে ৫টি প্রধান সোশ্যাল মিডিয়া একাউন্ট অপ্টিমাইজেশন।",
      pricingTitle: "বাজেট ফ্রেন্ডলি মার্কেটিং প্যাকেজ",
      pricingSubtitle: "আপনার ব্যবসার আকার ও বাজেট অনুযায়ী সঠিক প্ল্যানটি নির্বাচন করুন।",
      popularBadge: "জনপ্রিয় প্যাক",
      bestValueBadge: "সেরা ভ্যালু",
      deliveryTime: "ডেলিভারি সময়সীমা",
      featuresTitle: "কেন এই সার্ভিসটি বেছে নিবেন?",
      whyChooseSubtitle: "আপনার অনলাইন উপস্থিতি এবং গ্রাহকের বিশ্বাসযোগ্যতা বাড়াতে আমাদের সলিউশন সেরা।",
      workProcessTitle: "আমাদের কাজের ধাপসমূহ",
      workProcessSubtitle: "রিকোয়ারমেন্টস সংগ্রহ থেকে শুরু করে সফল প্রোমোশন প্রচার করার ধারাবাহিক প্রসেস সমূহ।",
      bonusTitle: "একদম ফ্রি স্পেশাল বোনাস প্যাক",
      bonusSubtitle: "যেকোনো প্যাকেজ অর্ডারের সাথে সম্পূর্ণ ফ্রিতে পাচ্ছেন নিচের বিশেষ সুবিধাসমূহ।",
      readyCtaTitle: "সোশ্যাল মিডিয়ায় ব্যবসা বাড়াতে প্রস্তুত?",
      readyCtaSubtitle: "সোশ্যাল মিডিয়ার শক্তিশালী শক্তিকে কাজে লাগিয়ে আজই আপনার ব্যবসায়ের প্রসার এবং নির্ভরযোগ্যতা বহুগুণ বৃদ্ধি করুন।",
      whatsappConsultation: "হোয়াটসঅ্যাপ সাপোর্ট",
      consultationModalTitle: "ফ্রি ডিজিটাল মার্কেটিং কনসাল্টেশন",
      consultationModalSubtitle: "আপনার ব্যবসায়ের প্রকৃতি এবং চাহিদা বলুন। আমাদের প্রধান ক্যাম্পেইন ম্যানেজার খুব দ্রুত হোয়াটসঅ্যাপে যোগাযোগ করবেন।",
      fullName: "আপনার নাম",
      phoneNumber: "মোবাইল/হোয়াটসঅ্যাপ নাম্বার",
      emailAddress: "ইমেইল এড্রেস",
      businessTypeLabel: "আপনার ক্যাটাগরি বা ব্যবসার ধরণ",
      additionalNotes: "বিশেষ কোনো চাহিদা বা মতামত",
      closeBtn: "বন্ধ করুন",
      submitRequest: "অনুরোধ জমা দিন",
      submitting: "প্রক্রিয়াধীন রয়েছে...",
      orderConfirmTitle: "প্যাকেজ অর্ডার কনফার্ম করুন",
      confirmOrderBtn: "আজই অর্ডার সাবমিট করুন",
      oneTimeSetup: "প্রফেশনাল সেটআপ সার্ভিসের সম্পূর্ণ ও লাইফটাইম অ্যাক্সেস সিকিউর কোড সহ দেওয়া হবে।",
      basicPack: "বেসিক প্যাকেজ",
      proPack: "প্রো প্যাকেজ",
      businessPack: "বিজনেস প্যাকেজ"
    },
    ar: {
      allServices: "كافة الخدمات",
      verifiedSMM: "خدمة تسويق تفاعلية ممتازة",
      mainTitle: "التسويق الرقمي وإدارة السوشال ميديا (SMM)",
      subtitle: "ابنِ حضوراً تفاعلياً قوياً وجاذباً لوصول علامتك للمشترين عبر تجهيز 5 هويات تجارية احترافية على منصات التواصل الكبرى مع باقات السيو والترويج الفعال.",
      badgeProfessional: "⭐ خدمة بمعايير احترافية",
      badgePlatforms: "📱 5 شبكات تواصل",
      badgeSolutions: "🚀 حلول نمو المبيعات",
      badgeConsultation: "💬 استشارة مجانية بالكامل",
      orderService: "اطلب الخدمة وباشر فوراً",
      whatsAppNow: "تواصل عبر الواتساب",
      getFreeConsultation: "احصل على استشارة مجانية",
      platformsTitle: "الشبكات الخمس المشمولة في البناء",
      platformsSubtitle: "نؤسس ملفاتك وقنواتك بخيارات ربط تلقائي وأكواد سيو ترفع نسبة ظهورك للمشترين.",
      pricingTitle: "باقات الأسعار والترويج الحصرية",
      pricingSubtitle: "اختر المستوى الترويجي الذي يطابق أهداف شركتك لرفع نسبة التحويل بكفاءة.",
      popularBadge: "الأكثر طلباً",
      bestValueBadge: "القيمة الأفضل",
      deliveryTime: "مدة التنفيذ والتسليم",
      featuresTitle: "لماذا تختار ويب زون بي دي؟",
      whyChooseSubtitle: "نهتم بضبط أصغر التفاصيل الفنية لبناء علامات تصمد وتربح أمام المنافسين.",
      workProcessTitle: "خطوات وجدول تتبع المشروع",
      workProcessSubtitle: "منذ الجلسة الاستشارية الأولى وحتى انطلاق حملاتك الموجهة للمستهدفين.",
      bonusTitle: "الهدايا والباقات الإضافية مجاناً",
      bonusSubtitle: "مزايا فنية قيمتها تتجاوز 1500 ريال ستحصل عليها بالكامل دون أي رسوم.",
      readyCtaTitle: "هل تريد مضاعفة مبيعاتك عبر الإنترنت اليوم؟",
      readyCtaSubtitle: "سخر الإمكانيات الجبارة للمنصات الرقمية لإنشاء قناة مبيعات أوتوماتيكية تنمي أرباح متجرك بلا انقطاع.",
      whatsappConsultation: "قسم الدعم الفني المباشر",
      consultationModalTitle: "طلب جلسة استشارية تسويقية مجانية",
      consultationModalSubtitle: "اكتب تفاصيل نشاطك التجاري ليقوم مستشار الحملات المعتمد لدينا بدراسة مشروعك والاتصال بك عبر واتساب المتابعة.",
      fullName: "الاسم الكريم",
      phoneNumber: "رقم الجوال / الواتساب",
      emailAddress: "صندوق البريد الإلكتروني",
      businessTypeLabel: "تخصص النشاط أو المتجر الخاص بك",
      additionalNotes: "أهداف إضافية تود التركيز عليها",
      closeBtn: "إلغاء",
      submitRequest: "تأكيد طلب جلسة العمل",
      submitting: "جاري حفظ طلب الاستشارة الفورية...",
      orderConfirmTitle: "تأكيد اختيار الباقة الخاصة بك",
      confirmOrderBtn: "أكمل الطلب الآن وباشر الاستفادة",
      oneTimeSetup: "هذه باقة رسم تدفع لمرة واحدة وتشمل كامل الصلاحيات لملفات الهوية والمصادر مدى الحياة.",
      basicPack: "الباقة الأساسية",
      proPack: "الباقة المتقدمة",
      businessPack: "الباقة الشاملة للاستثمار"
    }
  }[language];

  // Platforms content details
  const platforms = [
    { name: "Facebook Business Page", desc: "Premium page configuration, WhatsApp call to action button, cover design and interactive story layout setup.", logo: "FB" },
    { name: "X (Twitter) Profile", desc: "SEO-optimized professional handle, standard company description copywriting and corporate header layout setup.", logo: "X" },
    { name: "Instagram Business Profile", desc: "Smart layout grid structure, customized bio mapping, links placement and aesthetic visual catalog.", logo: "IG" },
    { name: "YouTube Channel Setup", desc: "Corporate channel optimization, custom keywords layout, high resolution banner aesthetics and watermark configuration.", logo: "YT" },
    { name: "TikTok Business Center", desc: "TikTok Ads Manager connector, bio landing, optimized hashtag structures and video feed presentation configuration.", logo: "TT" }
  ];

  // Why choose details points
  const whyChoosePoints = [
    { title: "Professional Branding", desc: "Every graphic banner and icon is engineered visually by certified agency illustrators for high credibility." },
    { title: "Increased Online Visibility", desc: "Cross-platform interlinking ensures maximum indexing and ranking on both search engines and maps." },
    { title: "Better Customer Engagement", desc: "Configured micro-interactions, automatic messages, and call routing convert simple visits into orders." },
    { title: "Social Media Growth", desc: "Continuous organic target setups and hashtag algorithms position you dynamically in search results." },
    { title: "Marketing Ready Profiles", desc: "Pre-installed Meta Pixels & tracking APIs prepare your profiles to run immediate booster budgets safely." },
    { title: "Business Promotion Support", desc: "Get direct 1-on-1 strategy handbooks helping you configure cost-effective ads to scale monthly sales." }
  ];

  // Work stages
  const workStages = [
    { step: "Step 01", title: "Requirement Collection", desc: "We sit down to understand your products, target demographics and branding preferences." },
    { step: "Step 02", title: "Business Analysis", desc: "Our specialists research local competitors and benchmark effective SMM visual styles." },
    { step: "Step 03", title: "Profile Setup", desc: "We register, verify, secure, and configure full layout metrics across the social profiles." },
    { step: "Step 04", title: "Branding Design", desc: "Expert placement of matching logos, cover artwork, and consistent company colors." },
    { step: "Step 05", title: "Content Creation", desc: "We draft premium copy posts, optimized bio highlights, and set up message scripts." },
    { step: "Step 06", title: "Delivery & Support", desc: "Complete credential handovers + priority consultation guide to launch campaigns." }
  ];

  // Free high quality bonus list
  const freeBonusList = [
    { title: "Business Description Writing", desc: "Engaging corporate narrative written by certified native scriptwriters.", val: "$45 Value" },
    { title: "Social Media Optimization", desc: "Complete target tagging and category calibration to rank you higher in feeds.", val: "$60 Value" },
    { title: "Profile Branding Recommendations", desc: "Full tailored visual recommendations document to maintain pristine content.", val: "$50 Value" },
    { title: "Contact Integration Setup", desc: "Direct wiring of your sales team's WhatsApp, phone lines, and physical address routes.", val: "$40 Value" }
  ];

  // Action methods
  const handleOpenConsultation = () => {
    setShowConsultForm(true);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      triggerToast(language === 'bn' ? 'দয়া করে আপনার নাম এবং মোবাইল নম্বরটি পূরণ করুন।' : language === 'ar' ? 'يرجى ملء الاسم ورقم الجوال لتأكيد استشارتك.' : 'Kindly provide your name and phone number to request a consultation.');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      triggerToast(language === 'bn' 
        ? '🎉 আপনার ফ্রি কনসাল্টেশন রিকোয়েস্ট জমা হয়েছে! খুব শীঘ্রই আমাদের ক্যাম্পেইন টিম আপনার সাথে যোগাযোগ করবে।' 
        : language === 'ar'
        ? '🎉 تم استلام معلومات تخصصك التسويقية بنجاح! وسيقوم خبير الإعلانات بالرد عليك فوراً.' 
        : '🎉 Consultation Request Saved! Our chief campaign manager will reach out via WhatsApp shortly.');
      setIsSubmitting(false);
      setShowConsultForm(false);
      setFormData({ name: '', phone: '', email: '', businessType: '', platformNotes: '' });
    }, 1500);
  };

  const selectPackageAndConfirm = (tier: 'basic' | 'pro' | 'business') => {
    setOrderPackageTier(tier);
    setShowOrderConfirm(true);
  };

  const handleOrderPlace = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      let bdtPrice = 8000;
      let titleName = t.proPack;
      if (orderPackageTier === 'basic') {
        bdtPrice = 5000;
        titleName = t.basicPack;
      } else if (orderPackageTier === 'business') {
        bdtPrice = 12000;
        titleName = t.businessPack;
      }

      // Base US price for central DB representation
      const usdEquivalent = bdtPrice / bdtRate;

      const smmOrder: Order = {
        id: "ord-smm-" + Math.floor(100000 + Math.random() * 900000),
        serviceId: "srv-marketing",
        itemTitle: `Digital & Social Media Marketing (SMM) [${titleName}]`,
        price: usdEquivalent,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: `Automated Checkout System (${currency})`,
        paymentStatus: 'completed'
      };

      addSimulatedServiceOrder(smmOrder);
      triggerToast(language === 'bn' 
        ? '🎉 সফলভাবে ডিজিটাল ও সোশ্যাল মিডিয়া মার্কেটিং সার্ভিসটি অর্ডার করা হয়েছে! ট্র্যাকিং ড্যাশবোর্ড সক্রিয় করা হয়েছে।' 
        : language === 'ar'
        ? '🎉 مبروك! تم تسجيل واختيار باقة التسويق الرقمي بنجاح، ستجد لوحة المتابعة جاهزة في حسابك.' 
        : '🎉 SMM Service Package has been ordered successfully! Real-time workflow setup tracker active in your customer cabinet.');
      
      setIsSubmitting(false);
      setShowOrderConfirm(false);
    }, 1600);
  };

  const handleWhatsAppConsult = () => {
    const waText = encodeURIComponent(`Hi WebzoneBD! I am interested in ordering your "Digital & Social Media Marketing (SMM)" premium service. Can we discuss?`);
    window.open(`https://wa.me/966570511931?text=${waText}`, '_blank');
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#F8FAFC] min-h-screen py-8 md:py-12 transition-colors duration-300 font-sans leading-relaxed" id="smm-premium-root">
      
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#3B82F6]/5 via-[#EC4899]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-[450px] h-[450px] bg-gradient-to-br from-[#06B6D4]/5 via-[#8B5CF6]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Superior Breadcrumb Header with Hover Effects */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-md p-4 rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm"
        >
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-black transition-all cursor-pointer shadow-tiny"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.allServices}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shrink-0" />
            <span className="text-[11px] font-mono font-black uppercase text-green-600 dark:text-cyan-400 tracking-wider">
              ● PRO AGENCY DESIGN LIVE
            </span>
          </div>
        </motion.div>

        {/* HERO SECTION - Premium Marketing Focus with responsive split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-md animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>{t.verifiedSMM}</span>
            </div>

            <h1 className="text-3xl sm:text-4.5xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none bg-gradient-to-r from-[#2563EB] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              {t.mainTitle}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans font-medium">
              {t.subtitle}
            </p>

            {/* Display Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#E2E8F0]/30 dark:bg-[#1E293B]/35 p-4 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80">
              <div className="py-2.5 px-3 bg-white dark:bg-[#0F172A] rounded-2xl flex flex-col justify-center items-center text-center shadow-tiny hover:-translate-y-1 transition duration-200">
                <span className="text-xl sm:text-2xl mb-1">⭐</span>
                <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-tight">{t.badgeProfessional}</span>
              </div>
              <div className="py-2.5 px-3 bg-white dark:bg-[#0F172A] rounded-2xl flex flex-col justify-center items-center text-center shadow-tiny hover:-translate-y-1 transition duration-200">
                <span className="text-xl sm:text-2xl mb-1">📱</span>
                <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-tight">{t.badgePlatforms}</span>
              </div>
              <div className="py-2.5 px-3 bg-white dark:bg-[#0F172A] rounded-2xl flex flex-col justify-center items-center text-center shadow-tiny hover:-translate-y-1 transition duration-200">
                <span className="text-xl sm:text-2xl mb-1">🚀</span>
                <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-tight">{t.badgeSolutions}</span>
              </div>
              <div className="py-2.5 px-3 bg-white dark:bg-[#0F172A] rounded-2xl flex flex-col justify-center items-center text-center shadow-tiny hover:-translate-y-1 transition duration-200">
                <span className="text-xl sm:text-2xl mb-1">💬</span>
                <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-tight">{t.badgeConsultation}</span>
              </div>
            </div>

            {/* CTA Buttons row */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  const pricingElem = document.getElementById('smm-pricing-section');
                  if (pricingElem) pricingElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 text-sm font-black text-white hover:scale-[1.03] active:scale-95 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-2xl shadow-lg transition-transform duration-200 cursor-pointer flex items-center gap-2"
              >
                <span>{t.orderService}</span>
                <ArrowRight className="w-4 h-4 font-black" />
              </button>

              <button
                onClick={handleWhatsAppConsult}
                className="px-6 py-4 text-sm font-black border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-2xl transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>{t.whatsAppNow}</span>
              </button>

              <button
                onClick={handleOpenConsultation}
                className="px-6 py-4 text-sm font-bold bg-white dark:bg-[#0F172A] hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-[#E2E8F0] dark:border-[#1E293B] text-neutral-700 dark:text-neutral-350 rounded-2xl transition duration-200 cursor-pointer"
              >
                {t.getFreeConsultation}
              </button>
            </div>
          </motion.div>

          {/* Right Hero Cover Illustration with absolute glass stats cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] group bg-[#020617]">
              {/* Image banner overlaying social networks */}
              <img 
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80" 
                alt="Social Media Marketing Cover" 
                className="w-full h-[320px] sm:h-[400px] object-cover opacity-85 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
              
              {/* Decorative dynamic badge */}
              <div className="absolute bottom-6 left-6 text-white text-left max-w-sm space-y-1">
                <p className="text-xl font-black tracking-tight flex items-center gap-1.5 text-cyan-400">
                  <TrendingUp className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span>Campaign Performance</span>
                </p>
                <p className="text-xs text-slate-300 font-medium">99.8% customer delivery rate backed by our continuous growth campaign monitoring setup.</p>
              </div>
            </div>

            {/* floating feedback stats 1 */}
            <div className="absolute top-10 -left-6 bg-white/95 dark:bg-[#0F172A]/95 p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-lg flex items-center gap-3 animate-bounce">
              <span className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-450 rounded-xl">
                📈
              </span>
              <div className="text-left">
                <p className="text-xs font-black text-slate-400 leading-none">ROAS TARGET</p>
                <p className="text-sm font-black text-neutral-900 dark:text-white mt-0.5">350% Average</p>
              </div>
            </div>

            {/* floating feedback stats 2 */}
            <div className="absolute -bottom-4 right-10 bg-white/95 dark:bg-[#0F172A]/95 p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left">
                <p className="text-xs font-black text-neutral-800 dark:text-white leading-none">12.5K Reach</p>
                <p className="text-[10px] text-slate-400 font-medium">Assigned organic traffic</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* SOCIAL PLATFORMS INCLUDED BRAG COMPONENT */}
        <div className="mb-24 text-center space-y-8" id="smm-networks-included">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight text-neutral-900 dark:text-white">
              {t.platformsTitle}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-450 font-medium font-sans">
              {t.platformsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {platforms.map((plat, idx) => (
              <motion.div
                key={plat.name}
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] text-left space-y-4 hover:shadow-xl transition-all relative overflow-hidden group shadow-sm"
              >
                {/* Visual Accent bar depending on logos */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                  plat.logo === 'FB' ? 'from-blue-600 to-sky-500' :
                  plat.logo === 'X' ? 'from-slate-900 to-neutral-700' :
                  plat.logo === 'IG' ? 'from-[#833AB4] via-[#FD1D1D] to-[#F56040]' :
                  plat.logo === 'YT' ? 'from-red-600 to-rose-600' :
                  'from-neutral-900 via-[#EC4899] to-[#00F2FE]'
                }`} />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black py-1 px-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl text-neutral-600 dark:text-neutral-300">
                    {plat.logo} Network
                  </span>
                  
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xs">
                    ✓
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  {plat.name}
                </h4>

                <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed font-sans">
                  {plat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PRICING PACKAGES (3-Tiers Table Layout) */}
        <div className="mb-24 select-none scroll-mt-20" id="smm-pricing-section">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="px-3.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-[#2563EB]/10 text-[#2563EB] dark:text-cyan-400 rounded-lg">
              📊 UNBEATABLE PRICES
            </span>
            <h2 className="text-2xl sm:text-3.5xl md:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              {t.pricingTitle}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-450 max-w-2xl mx-auto font-sans">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* PACKAGE 01: BASIC */}
            <motion.div 
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-[#0F172A] rounded-[32px] border ${selectedPackage === 'basic' ? 'border-[#2563EB] shadow-lg' : 'border-[#E2E8F0] dark:border-[#1E293B] shadow-sm'} p-6 sm:p-8 text-left space-y-6 relative overflow-hidden transition-all duration-300`}
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-black text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-0.5 rounded-md">
                  Package 01
                </span>
                <h3 className="text-xl font-black font-display text-neutral-900 dark:text-white">
                  {t.basicPack}
                </h3>
              </div>

              <div className="py-4 border-y border-neutral-100 dark:border-neutral-900 flex justify-between items-baseline gap-2">
                <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-500 dark:text-emerald-400">
                  {getPackagePrice(5000)}
                </p>
                <span className="text-[11px] font-medium text-slate-400">/ One-time Pay</span>
              </div>

              {/* Delivery info */}
              <div className="flex justify-between items-center text-xs p-3 bg-neutral-100/60 dark:bg-neutral-900/60 rounded-xl">
                <span className="text-neutral-500 font-semibold">{t.deliveryTime}:</span>
                <span className="px-2 py-0.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-md font-bold">1 - 3 Days</span>
              </div>

              <div className="space-y-3.5 font-sans min-h-[300px]">
                <p className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider">
                  Features Included:
                </p>
                
                {[
                  "Facebook Setup", "X (Twitter) Setup", "Instagram Setup", 
                  "YouTube Setup", "TikTok Setup", "Business Profile Optimization", 
                  "Contact Information Setup", "Professional Account Configuration"
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => selectPackageAndConfirm('basic')}
                className="w-full py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-neutral-800 dark:text-neutral-200 font-black text-xs rounded-xl tracking-wider transition cursor-pointer text-center block uppercase"
              >
                Order Now
              </button>
            </motion.div>

            {/* PACKAGE 02: PRO (POPULAR) */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-[#0F172A] rounded-[32px] border-2 border-blue-500 dark:border-cyan-400 shadow-xl p-6 sm:p-8 text-left space-y-6 relative overflow-hidden transition-all duration-300"
            >
              {/* Popular glow header ribbon */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-full blur-3xl opacity-20 -mr-12 -mt-12 pointer-events-none"></div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono font-black text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-0.5 rounded-md">
                    Package 02
                  </span>
                  <h3 className="text-xl font-black font-display text-neutral-900 dark:text-white">
                    {t.proPack}
                  </h3>
                </div>

                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-[9px] uppercase tracking-widest rounded-lg animate-pulse">
                  ⭐ {t.popularBadge}
                </span>
              </div>

              <div className="py-4 border-y border-neutral-100 dark:border-neutral-900 flex justify-between items-baseline gap-2">
                <p className="text-3xl sm:text-4xl font-black font-mono text-blue-600 dark:text-cyan-400">
                  {getPackagePrice(8000)}
                </p>
                <span className="text-[11px] font-medium text-slate-400">/ One-time Pay</span>
              </div>

              {/* Delivery info */}
              <div className="flex justify-between items-center text-xs p-3 bg-neutral-100/60 dark:bg-neutral-900/60 rounded-xl">
                <span className="text-neutral-500 font-semibold">{t.deliveryTime}:</span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md font-bold">3 - 5 Days</span>
              </div>

              <div className="space-y-3.5 font-sans min-h-[300px]">
                <p className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider">
                  Features Included:
                </p>
                
                {[
                  "Everything in Basic Plan",
                  "Professional Logo Design",
                  "Premium Banner Branding Art",
                  "Brand Identity Style Guide",
                  "3-5 Professional Business Posts",
                  "Social Media Optimization"
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-bold">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => selectPackageAndConfirm('pro')}
                className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:scale-[1.01] hover:shadow-md text-white font-black text-xs rounded-xl tracking-wider transition cursor-pointer text-center block uppercase"
              >
                Order Now
              </button>
            </motion.div>

            {/* PACKAGE 03: BUSINESS */}
            <motion.div 
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-[#0F172A] rounded-[32px] border ${selectedPackage === 'business' ? 'border-[#2563EB] shadow-lg' : 'border-[#E2E8F0] dark:border-[#1E293B] shadow-sm'} p-6 sm:p-8 text-left space-y-6 relative overflow-hidden transition-all duration-300`}
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono font-black text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-0.5 rounded-md">
                    Package 03
                  </span>
                  <h3 className="text-xl font-black font-display text-neutral-900 dark:text-white">
                    {t.businessPack}
                  </h3>
                </div>

                <span className="px-3 py-1 bg-green-500/10 text-green-500 font-black text-[9px] uppercase tracking-widest rounded-lg">
                  👑 {t.bestValueBadge}
                </span>
              </div>

              <div className="py-4 border-y border-neutral-100 dark:border-neutral-900 flex justify-between items-baseline gap-2">
                <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-500 dark:text-emerald-400">
                  {getPackagePrice(12000)}
                </p>
                <span className="text-[11px] font-medium text-slate-400">/ One-time Pay</span>
              </div>

              {/* Delivery info */}
              <div className="flex justify-between items-center text-xs p-3 bg-neutral-100/60 dark:bg-neutral-900/60 rounded-xl">
                <span className="text-neutral-500 font-semibold">{t.deliveryTime}:</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-bold">5 - 7 Days</span>
              </div>

              <div className="space-y-3.5 font-sans min-h-[300px]">
                <p className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider">
                  Features Included:
                </p>
                
                {[
                  "Everything in Pro Package",
                  "Facebook Boost Campaign Setup",
                  "1 Target Boosted Post",
                  "5 Days Target Promotion Active",
                  "Custom Audience Targeting",
                  "Business Promotion Strategy",
                  "1-on-1 Marketing Consultation"
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => selectPackageAndConfirm('business')}
                className="w-full py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-neutral-800 dark:text-neutral-200 font-black text-xs rounded-xl tracking-wider transition cursor-pointer text-center block uppercase"
              >
                Order Now
              </button>
            </motion.div>

          </div>
        </div>

        {/* WHY CHOOSE THIS SERVICE COMPONENT */}
        <div className="mb-24 py-12 bg-white dark:bg-[#0F172A] rounded-[40px] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm text-left px-6 sm:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-84 h-84 bg-[#06B6D4]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="px-2.5 py-1 text-[9px] font-mono font-black bg-rose-500/10 text-rose-500 rounded uppercase tracking-wider">
              ✓ VERIFIED BENEFITS
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-neutral-900 dark:text-white leading-tight">
              {t.featuresTitle}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-450 font-sans font-medium">
              {t.whyChooseSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChoosePoints.map((point) => (
              <div key={point.title} className="space-y-2 p-5 bg-[#F8FAFC] dark:bg-[#020617]/40 rounded-3xl border border-neutral-150/60 dark:border-neutral-900 hover:-translate-y-1 transition duration-200">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-extrabold text-sm">
                  ✓
                </div>
                <h4 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  {point.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed font-sans">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* WORK PROCESS STEPS TIMELINE */}
        <div className="mb-24 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight text-neutral-900 dark:text-white">
              {t.workProcessTitle}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-450 font-sans font-medium">
              {t.workProcessSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative" id="smm-timeline">
            {workStages.map((stage, idx) => (
              <div key={stage.step} className="bg-white dark:bg-[#0F172A] p-5 rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] text-left space-y-3 hover:border-blue-500/50 transition-colors shadow-tiny relative">
                <span className="text-[10px] font-mono font-black text-slate-400 block tracking-wider">
                  {stage.step}
                </span>
                
                <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white leading-tight">
                  {stage.title}
                </h4>
                
                <p className="text-[11px] text-neutral-500 dark:text-slate-400 leading-relaxed font-sans">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FREE BONUS PACK */}
        <div className="mb-24 text-center space-y-10" id="smm-bonus-packs">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-2xl">🎁</span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-neutral-900 dark:text-white">
              {t.bonusTitle}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-450 font-sans">
              {t.bonusSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeBonusList.map((bon) => (
              <div key={bon.title} className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 dark:from-amber-450/5 dark:to-yellow-450/5 p-6 rounded-3xl border border-amber-500/20 text-left space-y-4 hover:from-amber-500/10 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🎁</span>
                  <span className="px-2 py-0.5 bg-amber-500/25 text-amber-600 dark:text-amber-450 rounded text-[9px] font-black uppercase font-mono tracking-wider">
                    {bon.val}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-amber-700 dark:text-amber-500">
                  {bon.title}
                </h4>

                <p className="text-xs text-neutral-600 dark:text-slate-300 leading-relaxed font-sans font-medium">
                  {bon.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM INFLUENTER CALL TO ACTION WALL */}
        <div className="p-8 sm:p-14 rounded-[40px] bg-gradient-to-r from-slate-900 via-neutral-950 to-slate-900 border border-neutral-800 text-left relative overflow-hidden shadow-2xl" id="smm-cta-closure">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#2563EB]/10 via-[#8B5CF6]/15 to-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="px-3.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider block w-fit">
              Let's Accelerate Now
            </span>

            <h3 className="text-2xl sm:text-3.5xl md:text-4.5xl font-black text-white leading-tight font-display">
              {t.readyCtaTitle}
            </h3>

            <p className="text-xs sm:text-base text-neutral-400 leading-relaxed max-w-xl font-medium">
              {t.readyCtaSubtitle}
            </p>

            <div className="pt-6 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const pricingElem = document.getElementById('smm-pricing-section');
                  if (pricingElem) pricingElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:scale-[1.03] active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg transition-transform cursor-pointer"
              >
                {t.orderService}
              </button>

              <button
                onClick={handleOpenConsultation}
                className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-black text-xs uppercase rounded-2xl transition duration-200 cursor-pointer"
              >
                {t.getFreeConsultation}
              </button>

              <button
                onClick={handleWhatsAppConsult}
                className="px-6 py-4 bg-transparent hover:bg-white/5 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-extrabold text-xs uppercase rounded-2xl flex items-center gap-1.5 transition duration-200 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.whatsappConsultation}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* LEAD CONSULTATION MODAL DRAWER popup */}
      <AnimatePresence>
        {showConsultForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop lock */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConsultForm(false)}
              className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white dark:bg-[#0F172A] w-full max-w-lg rounded-3xl border border-neutral-200 dark:border-neutral-850 p-6 sm:p-8 relative z-10 shadow-2xl space-y-6 text-left"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left max-w-[85%]">
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span>{t.consultationModalTitle}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 font-medium leading-normal">
                    {t.consultationModalSubtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConsultForm(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div className="space-y-1 block">
                  <label className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Robin Chowdhury"
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest">{t.phoneNumber} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. +880 1712-XXXXXX"
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest">{t.emailAddress}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. info@business.com"
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest">{t.businessTypeLabel}</label>
                  <input
                    type="text"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. E-Commerce, Restaurant, Agency"
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest">{t.additionalNotes}</label>
                  <textarea
                    rows={2}
                    value={formData.platformNotes}
                    onChange={(e) => setFormData({ ...formData, platformNotes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="I want help to set up target audience ads on FB..."
                  />
                </div>

                <div className="pt-2 flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowConsultForm(false)}
                    className="flex-1 py-3 border border-neutral-250 hover:bg-slate-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-350 font-black rounded-xl transition cursor-pointer text-center"
                  >
                    {t.closeBtn}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 text-white font-black rounded-xl tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? t.submitting : t.submitRequest}</span>
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* QUICK SIMULATED ORDER CHECKOUT MODAL POPUP */}
      <AnimatePresence>
        {showOrderConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderConfirm(false)}
              className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0F172A] w-full max-w-md rounded-[32px] border border-neutral-200 dark:border-neutral-850 p-6 sm:p-8 relative z-10 shadow-2xl space-y-6 text-left"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <span>{t.orderConfirmTitle}</span>
                </h3>
                <p className="text-xs text-neutral-400 font-sans">
                  {t.oneTimeSetup}
                </p>
              </div>

              {/* Order bill item card */}
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-neutral-200/50 dark:border-neutral-800 space-y-3.5 text-xs text-neutral-500">
                <div className="flex justify-between">
                  <span className="font-semibold">Selected Service:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">Digital & SMM Setup</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Package Variant:</span>
                  <span className="font-mono px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded font-black uppercase">
                    {orderPackageTier === 'basic' ? t.basicPack : orderPackageTier === 'pro' ? t.proPack : t.businessPack}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">Total Price:</span>
                  <span className="text-xl font-black font-mono text-emerald-500 dark:text-emerald-400">
                    {orderPackageTier === 'basic' ? getPackagePrice(5000) : orderPackageTier === 'pro' ? getPackagePrice(8000) : getPackagePrice(12000)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShowOrderConfirm(false)}
                  className="flex-1 py-3.5 border border-neutral-250 hover:bg-slate-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-350 font-black rounded-xl transition cursor-pointer text-center"
                >
                  {t.closeBtn}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleOrderPlace}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.01] hover:shadow-md text-white font-black rounded-xl tracking-wide transition cursor-pointer text-center uppercase"
                >
                  {isSubmitting ? t.submitting : t.confirmOrderBtn}
                </button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
