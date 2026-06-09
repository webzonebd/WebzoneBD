import React, { useState } from 'react';
import { 
  Check, Gift, Clock, Users, Award, 
  Sparkles, PhoneCall, ShoppingBag, 
  MapPin, CheckCircle2, Star, Percent, MessageSquare
} from 'lucide-react';
import { Language, Theme, Order, Currency } from '../types';

interface GoogleBusinessServiceProps {
  language: Language;
  theme: Theme;
  currency: Currency;
  currencySettings: any;
  addSimulatedServiceOrder: (order: Order) => void;
  triggerToast: (msg: string) => void;
  setCurrentPage: (page: string) => void;
}

export default function GoogleBusinessService({
  language,
  theme,
  currency,
  currencySettings,
  addSimulatedServiceOrder,
  triggerToast,
  setCurrentPage
}: GoogleBusinessServiceProps) {

  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  // Dynamic pricing calculation based on central exchange rates saved in database
  const getPricingData = () => {
    const bdtRate = currencySettings?.rates?.BDT ?? 118.5;
    const sarRate = currencySettings?.rates?.SAR ?? 3.75;

    if (currency === 'BDT') {
      return {
        regular: "৳4,000",
        offer: "৳2,000",
        save: "৳2,000",
        usdPrice: 2000 / bdtRate
      };
    } else if (currency === 'SAR') {
      // Base calculated off BDT 2000
      const regSar = (4000 / bdtRate * sarRate).toFixed(2);
      const offSar = (2000 / bdtRate * sarRate).toFixed(2);
      const savSar = (2000 / bdtRate * sarRate).toFixed(2);
      return {
        regular: `﷼ ${regSar}`,
        offer: `﷼ ${offSar}`,
        save: `﷼ ${savSar}`,
        usdPrice: 2000 / bdtRate
      };
    } else {
      // USD
      const regUsd = (4000 / bdtRate).toFixed(2);
      const offUsd = (2000 / bdtRate).toFixed(2);
      const savUsd = (2000 / bdtRate).toFixed(2);
      return {
        regular: `$ ${regUsd}`,
        offer: `$ ${offUsd}`,
        save: `$ ${savUsd}`,
        usdPrice: 2000 / bdtRate
      };
    }
  };

  const pricing = getPricingData();

  // Translations
  const t = {
    en: {
      category: "Digital Marketing Services",
      title: "Google Business Profile Setup Service",
      badge: "🔥 ONE-TIME SETUP SERVICE",
      subtitle: "Get your business professionally listed on Google and increase your local visibility, customer trust, and online presence.",
      includesTitle: "Service Includes",
      bonusTitle: "Free Bonus Pack",
      benefitsTitle: "Business Growth Benefits",
      whoIsThisForTitle: "Who Is This For?",
      whyChooseTitle: "Why Choose WebzoneBD IT Solution",
      deliveryTitle: "Expected Delivery Time",
      deliveryValue: "1 - 3 Business Days",
      pricingTitle: "Exclusive Launch Offer",
      regularPriceLabel: "Regular Price:",
      offerPriceLabel: "Special Target Offer:",
      youSaveLabel: "You Save:",
      oneTimePay: "One-Time Payment",
      ctaTitle: "Ready To Get Found On Google?",
      ctaSubtitle: "Let us professionally set up and optimize your Google Business Profile to attract endless local buyers immediately.",
      btnGetStarted: "Get Started Now",
      btnOrder: "Order Service",
      btnWhatsApp: "WhatsApp Consultation",
      successMsg: "🎉 Your Google Business Setup target service has been successfully ordered! Verification tracker launched in customer dashboard."
    },
    bn: {
      category: "ডিজিটাল মার্কেটিং সার্ভিস",
      title: "Google Business Profile Setup Service",
      badge: "🔥 এককালীন সেটআপ সার্ভিস",
      subtitle: "আপনার ব্যবসাকে গুগলে প্রফেশনালভাবে তালিকাভুক্ত করুন এবং আপনার লোকাল কাস্টমার বৃদ্ধি, অনলাইন ট্রাস্ট এবং আউটরিচ বাড়ান।",
      includesTitle: "সার্ভিসের বিশেষ সুবিধাসমূহ",
      bonusTitle: "ফ্রি স্পেশাল বোনাস",
      benefitsTitle: "ব্যবসার প্রবৃদ্ধি এবং সুবিধাসমূহ",
      whoIsThisForTitle: "সার্ভিসটি কাদের জন্য?",
      whyChooseTitle: "কেন বেছে নেবেন ওয়েবজোনবিডি আইটি সলিউশন?",
      deliveryTitle: "ডেলিভারি সময়সীমা",
      deliveryValue: "১ - ৩ কর্মদিবস",
      pricingTitle: "এক্সক্লুসিভ অফার প্রাইজ",
      regularPriceLabel: "নিয়মিত মূল্য:",
      offerPriceLabel: "হট অফার মূল্য:",
      youSaveLabel: "আপনার মোট সাশ্রয়:",
      oneTimePay: "এককালীন পেমেন্ট",
      ctaTitle: "গুগল এ বিজনেস র‍্যাংক করতে প্রস্তুত?",
      ctaSubtitle: "আসুন আপনার গুগল বিজনেস প্রোফাইলটি প্রফেশনালভাবে সাজিয়ে দেব, যাতে কাস্টমাররা আপনাকে গুগল ম্যাপে সহজেই খুঁজে পায়।",
      btnGetStarted: "এখনই শুরু করুন",
      btnOrder: "সার্ভিসটি অর্ডার করুন",
      btnWhatsApp: "হোয়াটসঅ্যাপ কনসালটেশন",
      successMsg: "🎉 সফলভাবে গুগল বিজনেস ডিজাইন ও ভেরিফিকেশন সার্ভিসটি অর্ডার করেছেন! ড্যাশবোর্ডে ট্র্যাক করুন।"
    },
    ar: {
      category: "خدمات التسويق الرقمي والسيو",
      title: "خدمة إعداد ملف تعريف جوجل التجاري (Map)",
      badge: "🔥 خدمة تدفع لمرة واحدة فقط",
      subtitle: "احصل على إدراج احترافي لشركتك على محرك بحث وخرائط جوجل لمضاعفة العملاء المحليين وزيادة الثقة بحضور رسمي مميز.",
      includesTitle: "ما تشتمل عليه الخدمة",
      bonusTitle: "هدايا وباقات مجانية إضافية",
      benefitsTitle: "الفوائد التقنية ونمو الأعمال",
      whoIsThisForTitle: "من هي هذه الخدمة مخصصة له؟",
      whyChooseTitle: "لماذا تختار ويب زون بي دي للحلول البرمجية؟",
      deliveryTitle: "المدة الزمنية المتوقعة للتسليم",
      deliveryValue: "1 - 3 أيام عمل",
      pricingTitle: "تفاصيل العرض السعري الحصري",
      regularPriceLabel: "السعر الأصلي:",
      offerPriceLabel: "السعر الحصري الحالي:",
      youSaveLabel: "القيمة الإجمالية الموفرة:",
      oneTimePay: "رسم يدفع مرة واحدة فقط",
      ctaTitle: "هل تريد تعتلي نتائج خرائط جوجل؟",
      ctaSubtitle: "دع مهندسينا يضبطون ملف شركتك وموقعك الجغرافي وخيارات السيو لضمان ظهور مبيعاتك للمستخدمين القريبين منك بسهولة.",
      btnGetStarted: "ابدأ التجهيز الآن",
      btnOrder: "اطلب الخدمة وباشر الآن",
      btnWhatsApp: "استشارة مجانية عبر الواتساب",
      successMsg: "🎉 تمت عملية طلب خدمة إعداد ملف جوجل التجاري بنجاح! تم تشغيل لوحة المتابعة بدقة في حسابك الخاص."
    }
  }[language];

  const handleOrderSubmit = () => {
    setIsLoadingOrder(true);
    setTimeout(() => {
      const orderItem: Order = {
        id: "ord-sim-gb-" + Math.floor(Math.random() * 100000),
        serviceId: "srv-google-business-setup",
        itemTitle: "Google Business Profile Setup & Local SEO Pack",
        price: pricing.usdPrice, // Evaluated baseline in USD context for order persistence
        date: new Date().toISOString().split('T')[0],
        paymentMethod: `Multi-Currency checkout system via ${currency}`,
        paymentStatus: 'completed'
      };

      addSimulatedServiceOrder(orderItem);
      triggerToast(t.successMsg);
      setIsLoadingOrder(false);
      setCurrentPage('dashboard');
    }, 1200);
  };

  const handleConsultation = () => {
    const waLink = "https://wa.me/966570511931?text=Hi%20WebzoneBD,%20I%20want%20to%20order%20the%20Google%20Business%20Profile%20Setup%20Service.";
    window.open(waLink, '_blank');
  };

  const serviceIncludes = [
    "Google Business Profile Creation",
    "Business Information Setup",
    "Business Category Optimization",
    "Contact Information Setup",
    "Service Area Configuration",
    "Working Hours Configuration",
    "Business Description Writing",
    "Google Maps Integration",
    "Website Linking",
    "WhatsApp & Phone Setup",
    "Business Verification Guidance",
    "Profile Optimization"
  ];

  const freeBonuses = [
    "Professional Business Description",
    "Basic SEO Optimization",
    "Google Maps Setup",
    "Profile Completion Review"
  ];

  const benefits = [
    "Appear on Google Search",
    "Appear on Google Maps",
    "Increase Local Customers",
    "Improve Online Trust",
    "Professional Business Presence",
    "Better Search Visibility"
  ];

  const whoIsThisFor = [
    "Local Businesses",
    "Restaurants",
    "Retail Shops",
    "Ecommerce Businesses",
    "Service Providers",
    "Startups",
    "Corporate Companies"
  ];

  const whyChoose = [
    "Experienced Team",
    "Fast Delivery",
    "Professional Setup",
    "Affordable Pricing",
    "Dedicated Support"
  ];

  return (
    <div className="py-2" id="google-business-card-root">
      {/* Upper Category and Header with Google color accent bars */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="flex justify-center items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#4285F4]"></span>
          <span className="w-3 h-3 rounded-full bg-[#EA4335]"></span>
          <span className="w-3 h-3 rounded-full bg-[#FBBC05]"></span>
          <span className="w-3 h-3 rounded-full bg-[#34A853]"></span>
          <span className="text-xs font-mono font-black uppercase text-neutral-450 dark:text-neutral-500 tracking-wider ml-2">
            {t.category}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display text-neutral-900 dark:text-white leading-tight">
          {t.title}
        </h2>
        
        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black tracking-widest uppercase rounded-lg">
          <Percent className="w-3.5 h-3.5" />
          <span>{t.badge}</span>
        </div>
      </div>

      {/* Main Glassmorphic Grid Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* Left Side: Deliverables, Bonuses & target audience (8 Columns) */}
        <div className="lg:col-span-8 space-y-8 text-left">
          
          {/* Deliverables Section with Premium Checkboxes */}
          <div className="bg-white dark:bg-[#070b13]/60 rounded-3xl border border-neutral-200/50 dark:border-neutral-850 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
            {/* Soft Google blue aesthetic light inside */}
            <div className="absolute top-0 left-0 w-2 h-full bg-[#4285F4]"></div>
            
            <h3 className="text-lg font-black text-neutral-950 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#4285F4]" />
              <span>{t.includesTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {serviceIncludes.map((inc, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl hover:bg-[#4285F4]/5 transition-colors border border-neutral-100 dark:border-neutral-900">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="text-xs text-neutral-700 dark:text-neutral-200 font-semibold font-sans">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bonuses & Growth Benefits Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 🎁 Free Bonus Segment Card */}
            <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 hover:from-amber-500/10 hover:to-yellow-500/10 bg-white dark:bg-[#070b13]/60 rounded-3xl border border-amber-500/20 p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FBBC05]"></div>
              
              <h3 className="text-base font-black text-amber-600 dark:text-amber-450 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <span>{t.bonusTitle}</span>
              </h3>

              <div className="space-y-3">
                {freeBonuses.map((bon, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 py-1 border-b border-amber-500/5">
                    <span className="text-lg">🎁</span>
                    <span className="font-bold">{bon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ✓ Growth Benefits Segment Card */}
            <div className="bg-gradient-to-br from-[#34A853]/5 to-[#34A853]/10 bg-white dark:bg-[#070b13]/60 rounded-3xl border border-[#34A853]/20 p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#34A853]"></div>
              
              <h3 className="text-base font-black text-[#34A853] mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#34A853] fill-current" />
                <span>{t.benefitsTitle}</span>
              </h3>

              <div className="space-y-3">
                {benefits.map((ben, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-750 dark:text-neutral-250 font-sans">
                    <span className="w-4 h-4 rounded-full bg-[#34A853]/10 text-[#34A853] flex items-center justify-center font-extrabold text-[10px]">✓</span>
                    <span className="font-semibold">{ben}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Who Is This For & Why choose WebzoneBD Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Who is this for */}
            <div className="bg-white dark:bg-[#070b13]/60 rounded-3xl border border-neutral-200/50 dark:border-neutral-850 p-6">
              <h3 className="text-base font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4285F4]" />
                <span>{t.whoIsThisForTitle}</span>
              </h3>
              <div className="space-y-2.5">
                {whoIsThisFor.map((target, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-650 dark:text-neutral-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]"></span>
                    <span className="font-medium">{target}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why WebzoneBD */}
            <div className="bg-white dark:bg-[#070b13]/60 rounded-3xl border border-neutral-200/50 dark:border-neutral-850 p-6">
              <h3 className="text-base font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <span>{t.whyChooseTitle}</span>
              </h3>
              <div className="space-y-2.5">
                {whyChoose.map((why, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-650 dark:text-neutral-300">
                    <span className="h-4 w-4 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded text-[8px] font-black">✓</span>
                    <span className="font-medium">{why}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Pricing Highlight Box & Action Buttons (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Price Tag Interactive Card */}
          <div className="relative rounded-3xl bg-neutral-950 text-white border border-neutral-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
            
            {/* Absolute decorative gradient mesh */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-rose-500 rounded-full blur-3xl opacity-20 -mr-12 -mt-12 pointer-events-none"></div>

            <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-lg text-slate-950 font-black text-[9px] uppercase tracking-widest mb-4">
              🔥 SPECIAL SEOPRICE OFFER
            </span>

            <h4 className="text-xs text-neutral-400 font-mono uppercase tracking-wider mb-2">
              {t.pricingTitle}
            </h4>

            {/* Regular Strike-through */}
            <div className="flex justify-between items-center py-2 border-b border-neutral-900">
              <span className="text-xs text-neutral-400 font-sans">{t.regularPriceLabel}</span>
              <span className="text-lg font-mono font-bold line-through text-neutral-500">
                {pricing.regular}
              </span>
            </div>

            {/* Offer Highlight */}
            <div className="py-4 space-y-1">
              <span className="text-[10px] uppercase font-mono font-black text-rose-500 tracking-widest flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current" /> {t.offerPriceLabel}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
                  {pricing.offer}
                </span>
                <span className="text-[11px] font-bold text-neutral-400">/{t.oneTimePay}</span>
              </div>
            </div>

            {/* Saved value info */}
            <div className="p-3 bg-neutral-900 rounded-xl flex items-center justify-between text-xs border border-neutral-800/60 mb-6">
              <span className="text-neutral-400 font-semibold">{t.youSaveLabel}</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-black font-mono">
                {pricing.save} (50% Off)
              </span>
            </div>

            {/* Expected delivery metrics */}
            <div className="space-y-2 border-t border-neutral-900 pt-4 mb-6 text-left">
              <span className="text-[10px] uppercase text-neutral-500 font-mono tracking-wider block">
                {t.deliveryTitle}:
              </span>
              <p className="text-xs font-black text-neutral-350 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{t.deliveryValue}</span>
              </p>
            </div>

            {/* CTA order button */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isLoadingOrder}
                onClick={handleOrderSubmit}
                className="w-full py-3.5 bg-gradient-to-r from-[#4285F4] to-[#34A853] hover:from-[#3574de] hover:to-[#2c8f47] disabled:opacity-50 text-white font-extrabold text-xs tracking-wide rounded-xl shadow-lg hover:shadow-[#4285F4]/10 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 animate-bounce" />
                <span>{isLoadingOrder ? 'Processing Checkout Securely...' : t.btnOrder}</span>
              </button>

              <button
                type="button"
                onClick={handleConsultation}
                className="w-full py-3 bg-transparent hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-black text-xs rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.btnWhatsApp}</span>
              </button>
            </div>

          </div>

          {/* Google trust card banner mockup */}
          <div className="bg-gradient-to-tr from-[#1E293B] to-[#0F172A] p-6 rounded-3xl border border-neutral-800 text-left space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#4285F4] font-black">
              Google Maps & Search Integrated
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-semibold">
              Customers looking for services in your area will view your maps dashboard, phone, photos, ratings, and address route, immediately encouraging local clicks and orders.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-300">
                ★ 5.0 High Trust Rate
              </span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-300">
                🗺️ Local SEO Compliant
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Big lower CTA closure banner with background blur glow */}
      <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-r from-slate-900 via-neutral-950 to-slate-900 border border-neutral-800 text-left relative overflow-hidden" id="google-bp-lower-cta">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#4285F4]/10 via-[#EA4335]/15 to-[#FBBC05]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
            Ready To Get Found On Google?
          </span>
          
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            {t.ctaTitle}
          </h3>
          
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl font-serif">
            {t.ctaSubtitle}
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleOrderSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs rounded-xl hover:shadow-lg transition duration-200 cursor-pointer"
            >
              {t.btnGetStarted}
            </button>
            
            <button
              type="button"
              onClick={handleConsultation}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 hover:text-emerald-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition duration-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.btnWhatsApp}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
