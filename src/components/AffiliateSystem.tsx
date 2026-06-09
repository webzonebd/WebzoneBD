import React, { useState } from 'react';
import { 
  Percent, Coins, Users, Target, TrendingUp, Wallet, ShieldCheck, 
  Check, ArrowRight, Share2, Facebook, MessageCircle, Send, Mail, Link, Award, Phone, HelpCircle
} from 'lucide-react';
import { Language, Theme, UserSession } from '../types';

interface AffiliateSystemProps {
  language: Language;
  theme: Theme;
  user: UserSession | null;
  onLoginClick: (view?: 'login' | 'register') => void;
  triggerToast: (msg: string) => void;
}

export default function AffiliateSystem({
  language,
  theme,
  user,
  onLoginClick,
  triggerToast
}: AffiliateSystemProps) {
  // Simulator Calculator States
  const [estClicks, setEstClicks] = useState(1200);
  const [estConversions, setEstConversions] = useState(30);
  const [estAvgValue, setEstAvgValue] = useState(65); // $65 USD average sale
  
  // Custom QR Code Text simulation state
  const [qrCampaignText, setQrCampaignText] = useState('hosting_campaign');
  const [qrGenerated, setQrGenerated] = useState(false);

  // Calculate simulated monthly payouts
  const calculatedCommissions = Math.round(estConversions * estAvgValue * 0.15 * 100) / 100;
  const bdtCommissions = Math.round(calculatedCommissions * 118.5);
  const sarCommissions = Math.round(calculatedCommissions * 3.75);

  const handleShareClick = (platform: string) => {
    const shareText = `🚀 Promote WebzoneBD IT Solution products & earn high commissions! Register your Affiliate Partner Account and generate up to 40% payouts: `;
    const dummyUrl = `${window.location.origin}/?ref=AFF_PARTNER`;
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + dummyUrl)}`, '_blank');
      triggerToast("📱 Forwarding promotional link to WhatsApp!");
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dummyUrl)}`, '_blank');
      triggerToast("👥 Opened Facebook share screen!");
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(dummyUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
      triggerToast("✈️ Forwarding promotional link to Telegram!");
    } else {
      navigator.clipboard.writeText(shareText + dummyUrl);
      triggerToast("📋 Copied custom referral copypasta to clipboard!");
    }
  };

  const bgCard = theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200/60 shadow-sm';
  const textTitle = theme === 'dark' ? 'text-neutral-50' : 'text-neutral-900';
  const textSub = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600';

  const t = {
    en: {
      heroHeading: "Empower Your Digital Growth with WebzoneBD Partnership",
      heroSub: "Earn up to 40% commissions by promoting Bangladesh and Saudi Arabia's leading custom IT systems, cPanel ready solutions, secure scripts, and fast hosting packages. Accessible to anyone.",
      ctaJoin: "Become a Growth Partner",
      ctaLogin: "Log in to Your Dashboard",
      calculatingTitle: "Estimate Your Potential Earnings",
      payoutPeriod: "Monthly Estimated Commission",
      benefitTitle: "Why Partner with WebzoneBD IT Solution?",
      benefit1: "No Caps on Payouts",
      benefit1Desc: "The more customers you refer, the more passive income you earn. No bounds on your monthly payouts.",
      benefit2: "30-90 Day Cookies Lifespan",
      benefit2Desc: "Track potential customers' click events inside a robust tracking window. Overrides on completion.",
      benefit3: "Instant Payout Transfers",
      benefit3Desc: "Release cash via bKash, Bank Wires, PayPal, or Wise with a low withdraw limit.",
      rulesHeader: "Standardized Commission Rates Structure",
      successHeader: "Read Real Partners' Success Chronicles",
      faqHeader: "Affiliate Partnership Protocol FAQs"
    },
    bn: {
      heroHeading: "ওয়েবজোনবিডি টিমের সাথে আয় করুন সর্বোচ্চ ২০%-৪০% কমিশন!",
      heroSub: "আমাদের হাই-কনভার্টিং ডোমেন হোস্টিং, কাস্টম পিএইচপি স্ক্রিপ্ট, স্কুল ম্যানেজমেন্ট সিস্টেম ও কাস্টম সফটওয়্যার প্রোমোট করে ঘরে বসেই ঘরে তুলুন নিশ্চিত আয়। যে কেউই ফ্রিতে যুক্ত হতে পারেন।",
      ctaJoin: "পার্টনারশিপে যোগ দিন",
      ctaLogin: "আপনার ড্যাশবোর্ডে লগইন করুন",
      calculatingTitle: "আজই আপনার সম্ভাব্য আয় হিসাব করুন",
      payoutPeriod: "আনুমানিক মাসিক কমিশন আয়",
      benefitTitle: "কেন সবাই ওয়েবজোনবিডি অ্যাফিলিয়েট পার্টনারশিপ বেশি পছন্দ করে?",
      benefit1: "সর্বোচ্চ আয়ের সুযোগ",
      benefit1Desc: "কোন ধরণের আয়ের সীমা ছাড়াই আনলিমিটেড আয়ের সুযোগ। যত বেশি রেফার করবেন তত আর্নিং।",
      benefit2: "৩০-৯০ দিনের দীর্ঘ কুকি মেয়াদ",
      benefit2Desc: "কুকি ট্র্যাকিংয়ের মাধ্যমে দীর্ঘ সময় রেফারেল সেশন ট্র্যাকিং করার সুবিধা প্রদান করি।",
      benefit3: "দ্রুততম পেমেন্ট সিস্টেম",
      benefit3Desc: "বিকাশ, নগদ, রকেট বা ব্যাংক সুইফট ওয়ারের মাধ্যমে ১,০০০৳ হলেই সাথে সাথে টাকা তুলুন।",
      rulesHeader: "ধাপভিত্তিক কমিশন আয়ের চমৎকার তালিকা",
      successHeader: "আমাদের সফল পার্টনারদের অভিজ্ঞতা ও অর্জন",
      faqHeader: "পার্টনারদের মনে আসা সাধারণ কিছু প্রশ্নাবলি ও উত্তর"
    },
    ar: {
      heroHeading: "ضاعف دخلك السلبي مع برنامج التسويق لـ ويب زون بي دي",
      heroSub: "احصل على عمولات تصل إلى 40% بترويج أفضل الحلول البرمجية، أنظمة إدارة المدارس، البرمجيات المخصصة، واستضافات المواقع السريعة. التسجيل متاح للجميع مجاناً.",
      ctaJoin: "سجل الآن كشريك نمو",
      ctaLogin: "تسجيل الدخول للوحة التحكم",
      calculatingTitle: "احسب أرباحك وعمولتك المتوقعة",
      payoutPeriod: "العمولة الشهرية المقدرة",
      benefitTitle: "ما الذي يميز برنامج شركاء ويب زون بي دي؟",
      benefit1: "أرباح غير محدودة",
      benefit1Desc: "لا يوجد سقف لأرباحك المحتملة. كلما زاد عدد عملائك المحالين، تضاعفت مواردك المالية.",
      benefit2: "ملفات تعريف ارتكازية (30-90 يوم)",
      benefit2Desc: "تتبع سليم للمشتريات حتى بعد فترات زمنية طويلة من الضغط على رابط الإحالة.",
      benefit3: "خيارات سحب سهلة وسريعة",
      benefit3Desc: "اسحب أرباحك عبر حسابك البنكي، أو بايبال، أو وايز فور وصولها للحد الأدنى البسيط.",
      rulesHeader: "هيكل نسب عمولات الشركاء المعتمد",
      successHeader: "قصص نجاح ملهمة من شركائنا الماليين",
      faqHeader: "الأسئلة الشائعة حول شروط وأسس الانضمام والعمل"
    }
  };

  const currentT = t[language] || t.en;

  const commissionTiers = [
    { cat: "Hosting Services", rate: "20% - 40% Commission", item: "VPS, Linux Shared Hosting, Dedicated Nodes" },
    { cat: "POS & School Management Softwares", rate: "20% Commission", item: "Enterprise Desktop, Academic cPanel Scripts" },
    { cat: "Web Development Services", rate: "15% Commission", item: "PHP Custom CMS/eCommerce Projects" },
    { cat: "Digital Marketing & SEO Packages", rate: "15% Commission", item: "Organic Optimization Auditing Campaigns" },
    { cat: "Digital Store Sources", rate: "10% Commission", item: "Zip theme files, elementor assets, HTML cards" },
  ];

  const successStories = [
    {
      name: "Rashed Ahmed",
      location: "Dhaka, Bangladesh",
      earned: "৳1,42,500 BDT Paid",
      comment: "WebzoneBD scripts practically sell themselves. Their POS software has been highly requested by brick-and-mortar grocery stores around Dhaka, generating amazing commissions for my blog.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Mubarak Al-Dosari",
      location: "Riyadh, Saudi Arabia",
      earned: "SAR 5,420 Paid",
      comment: "Outstanding responsive support! My Arabic audience trusted their supercharged fast hosting, rendering 30-Day conversion rewards on every single invoice.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const faqs = [
    {
      q: "How does the tracking cookie work?",
      a: "When a visitor clicks your referral link, WebzoneBD saves a sticky cookie on their browser for up to 90 Days. If they complete any order within this period, it gets registered to your account."
    },
    {
      q: "What are the minimum withdrawal thresholds?",
      a: "The minimum payout limits are exceptionally low: 1,000 BDT for Bangladeshi Mobile wallets (bKash/Nagad), 50 SAR for Middle East Bank Transfers, and 20 USD for PayPal/Wise globally."
    },
    {
      q: "Can I self-refer to register discounts for my own orders?",
      a: "Strictly forbidden. self-referral and matching IP/cookies stuffing are blocked by our server audit systems. Self-referrals will lead to commissions being reversed immediately."
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16" id="affiliate-platform-parent">
      
      {/* 1. HERO HEADER AREA */}
      <div className="text-center space-y-6 max-w-4xl mx-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 text-pink-500 rounded-full text-[10px] font-extrabold uppercase tracking-widest animate-pulse font-mono">
          <Award className="w-3.5 h-3.5" />
          <span>Active Partner Referral Program</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent pb-1">
          {currentT.heroHeading}
        </h1>
        
        <p className="text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl mx-auto">
          {currentT.heroSub}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <button
              onClick={() => onLoginClick()}
              className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-xs font-extrabold tracking-wider text-white uppercase rounded-xl transition-all shadow-md shadow-pink-550/10 cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentT.ctaLogin}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onLoginClick('register')}
                className="px-6 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 hover:opacity-95 text-xs font-extrabold tracking-wider text-white uppercase rounded-xl transition-all shadow-md shadow-pink-550/10 cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentT.ctaJoin}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onLoginClick('login')}
                className="px-6 py-3.5 bg-slate-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 rounded-xl hover:bg-slate-200 dark:hover:bg-neutral-800/80 transition cursor-pointer"
              >
                {language === 'bn' ? 'লগইন করুন' : language === 'ar' ? 'سجل دخول' : 'Sign In Now'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC EARNINGS CALCULATOR */}
      <div className={`border p-6 sm:p-8 rounded-3xl ${bgCard} max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center`}>
        <div className="md:col-span-7 space-y-6 text-left">
          <div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
              {currentT.calculatingTitle}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
              Slide parameters to represent estimated traffic conversion and product costs to compute your monthly passive profits.
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Slider 1: Traffic Visits */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-400 font-sans">Monthly Unique Visitors</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{estClicks.toLocaleString()} Users</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={estClicks}
                onChange={(e) => {
                  setEstClicks(Number(e.target.value));
                  // Auto-scale conversions loosely with scale
                  setEstConversions(Math.max(1, Math.round(Number(e.target.value) * 0.025)));
                }}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Input Slider 2: Conversions */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-400 font-sans">Referred Conversions (2.5% CR)</span>
                <span className="font-mono font-bold text-pink-500">{estConversions} Customers</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={estConversions}
                onChange={(e) => setEstConversions(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Input Slider 3: Cost sales */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-400 font-sans">Average Order Cart Value</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">${estAvgValue} USD</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={estAvgValue}
                onChange={(e) => setEstAvgValue(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Calculated Board summary */}
        <div className="md:col-span-5 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-indigo-500/10 p-6 rounded-2xl border border-pink-500/15 flex flex-col justify-between h-full space-y-4">
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-pink-500">
              {currentT.payoutPeriod}
            </span>
            <div className="mt-2 space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-sans text-neutral-900 dark:text-white font-mono">
                ${calculatedCommissions.toLocaleString()} <span className="text-[10px] text-neutral-400 font-bold">USD</span>
              </p>
              
              <div className="pt-2 border-t border-pink-500/15 space-y-0.5 text-[11px] font-bold text-neutral-500 dark:text-neutral-300 font-mono">
                <div className="flex justify-between">
                  <span>৳ BDT Payout:</span>
                  <span className="text-cyan-500">৳{bdtCommissions.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span>﷼ SAR Payout:</span>
                  <span className="text-purple-400">﷼{sarCommissions.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-left text-[10px] text-neutral-450 leading-relaxed font-sans mt-2">
            *Calculation assumes a standard baseline commission of <b>15%</b>. Actual rates range from 10% up to 40% based on referred hosting and software types.
          </div>
        </div>
      </div>

      {/* 3. PROMOTIONAL QUICK-SHARER & PROMOTIONAL GENERATORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Share box */}
        <div className={`p-6 rounded-2xl border ${bgCard} text-left flex flex-col justify-between space-y-4`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-indigo-500" />
              <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white uppercase font-mono tracking-wider">Promotional Banners & Quick Share</h4>
            </div>
            <p className="text-xs text-neutral-450 leading-relaxed">
              Earn commissions by directly sharing pre-configured WebzoneBD promotional descriptions with your colleagues, networks, or digital channels.
            </p>
          </div>

          <div className="bg-slate-500/5 p-4 rounded-xl space-y-3">
            <p className="text-xs italic text-neutral-500 dark:text-neutral-300 font-sans border-l-2 border-pink-500 pl-3">
              "Need secure, cPanel ready solutions or lightningfast servers? Check out WebzoneBD IT Solution! They deliver fully malwarechecked scripts and robust local responsive database setups: high performance guaranteed!"
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => handleShareClick('whatsapp')}
                className="px-3 py-2 bg-[#25D366] hover:opacity-90 text-white rounded-lg flex items-center gap-1.5 text-[10px] font-extrabold uppercase transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleShareClick('facebook')}
                className="px-3 py-2 bg-[#1877F2] hover:opacity-90 text-white rounded-lg flex items-center gap-1.5 text-[10px] font-extrabold uppercase transition cursor-pointer"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleShareClick('telegram')}
                className="px-3 py-2 bg-[#0088cc] hover:opacity-90 text-white rounded-lg flex items-center gap-1.5 text-[10px] font-extrabold uppercase transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>
              <button
                onClick={() => handleShareClick('clipboard')}
                className="px-3 py-2 bg-neutral-200 dark:bg-slate-800 text-neutral-800 dark:text-neutral-200 hover:opacity-90 rounded-lg flex items-center gap-1.5 text-[10px] font-extrabold uppercase transition cursor-pointer"
              >
                <Link className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* QR Code generator box */}
        <div className={`p-6 rounded-2xl border ${bgCard} text-left flex flex-col justify-between space-y-4`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-5 h-5 text-pink-500" />
              <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white uppercase font-mono tracking-wider">Instant QR Promotion Tool</h4>
            </div>
            <p className="text-xs text-neutral-450 leading-relaxed">
              Generate a unique print-ready high-density QR code card. Affiliates can print these for physical marketing campaigns or incorporate them into local store checkouts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-500/5 p-4 rounded-xl">
            {/* Left QR Display simulation */}
            <div className="w-24 h-24 bg-white p-2 border border-neutral-200 rounded-lg flex flex-col justify-center items-center shrink-0">
              {qrGenerated ? (
                <div className="space-y-0.5 text-center flex flex-col justify-center items-center">
                  {/* Mock beautiful SVG QR Code bar matrix */}
                  <svg className="w-16 h-16 text-slate-900" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                    <rect x="10" y="10" width="5" height="5" fill="white" />
                    <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                    <rect x="85" y="5" width="5" height="5" fill="white" />
                    <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                    <rect x="40" y="40" width="10" height="10" fill="currentColor" />
                    <rect x="55" y="20" width="12" height="12" fill="currentColor" />
                    <rect x="25" y="65" width="20" height="7" fill="currentColor" />
                    <rect x="75" y="65" width="20" height="15" fill="currentColor" />
                  </svg>
                  <span className="text-[7.5px] font-bold font-mono text-cyan-400">camp={qrCampaignText}</span>
                </div>
              ) : (
                <span className="text-[9px] text-center text-neutral-400 italic">No QR Code active</span>
              )}
            </div>

            {/* Suffix setter */}
            <div className="space-y-2 text-xs w-full">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-neutral-400">CAMPAIGN TRACKER IDENTIFIER</label>
                <input
                  type="text"
                  value={qrCampaignText}
                  onChange={(e) => setQrCampaignText(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="e.g. flyers_dhaka"
                  className="w-full bg-white dark:bg-neutral-950 p-2 rounded border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setQrGenerated(true);
                  triggerToast("🎨 Generated high-density campaign QR code card!");
                }}
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:opacity-90 font-extrabold text-[10px] uppercase rounded-lg transition text-center cursor-pointer"
              >
                Recompile Printable QR Suffix
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. KEY CORE SPEC BENEFITS GRID */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl font-black text-center text-neutral-900 dark:text-white">
          {currentT.benefitTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border text-left space-y-2.5 ${bgCard} hover:border-pink-500/25 transition duration-200`}>
            <span className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl inline-block">
              <Coins className="w-5 h-5" />
            </span>
            <h4 className="text-xs font-bold font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{currentT.benefit1}</h4>
            <p className="text-xs text-neutral-450 leading-relaxed font-sans">{currentT.benefit1Desc}</p>
          </div>

          <div className={`p-6 rounded-2xl border text-left space-y-2.5 ${bgCard} hover:border-indigo-500/25 transition duration-200`}>
            <span className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl inline-block">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h4 className="text-xs font-bold font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{currentT.benefit2}</h4>
            <p className="text-xs text-neutral-450 leading-relaxed font-sans">{currentT.benefit2Desc}</p>
          </div>

          <div className={`p-6 rounded-2xl border text-left space-y-2.5 ${bgCard} hover:border-emerald-500/25 transition duration-200`}>
            <span className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl inline-block">
              <Wallet className="w-5 h-5" />
            </span>
            <h4 className="text-xs font-bold font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{currentT.benefit3}</h4>
            <p className="text-xs text-neutral-450 leading-relaxed font-sans">{currentT.benefit3Desc}</p>
          </div>
        </div>
      </div>

      {/* 5. DETAILED STANDARDIZED COMMISSION RATES TABLE */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl font-black text-center text-neutral-900 dark:text-white">
          {currentT.rulesHeader}
        </h3>

        <div className={`border rounded-2xl overflow-hidden max-w-4xl mx-auto ${bgCard}`}>
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-pink-500/5 font-mono text-[9px] uppercase tracking-wider text-slate-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="p-4">Products / Digital Services Offered</th>
                <th className="p-4">Reference Items Included</th>
                <th className="p-4 text-right">Commission Rate % Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-905 text-neutral-700 dark:text-neutral-300">
              {commissionTiers.map((tier, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition">
                  <td className="p-4 font-extrabold whitespace-nowrap">{tier.cat}</td>
                  <td className="p-4">{tier.item}</td>
                  <td className="p-4 text-right font-black text-pink-500 font-mono text-xs whitespace-nowrap">{tier.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. REAL SUCCESS STORIES */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl font-black text-center text-neutral-900 dark:text-white">
          {currentT.successHeader}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {successStories.map((story, i) => (
            <div key={i} className={`p-6 border rounded-3xl text-left flex flex-col justify-between space-y-4 ${bgCard}`}>
              <p className="text-xs text-neutral-600 dark:text-neutral-330 leading-relaxed font-serif italic">
                "{story.comment}"
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img src={story.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white">{story.name}</h4>
                  <p className="text-[10px] text-neutral-400 font-mono">{story.location}</p>
                </div>
                <span className="ml-auto px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 font-black font-mono text-[10px] rounded-lg">
                  {story.earned}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. PROTOCOL WORKFLOW FAQS ACCORDION */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-black text-center text-neutral-900 dark:text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <span>{currentT.faqHeader}</span>
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`p-4 border rounded-xl text-left space-y-2 ${bgCard}`}>
              <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wide font-sans flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-neutral-450 leading-relaxed pl-3 font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Final bottom CTA */}
      <div className="p-8 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-indigo-500/10 border border-pink-500/15 rounded-3xl text-center space-y-4 max-w-4xl mx-auto">
        <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
          {language === 'bn' ? 'আজই ওয়েবজোনবিডি অ্যাফিলিয়েট নেটওয়ার্কে জয়েন করুন!' : language === 'ar' ? 'ابدأ كسب أرباحك وعمولاتك اليوم!' : 'Join WebzoneBD Growth Network Today!'}
        </h3>
        <p className="text-xs text-neutral-450 max-w-xl mx-auto leading-normal">
          Becoming an affiliate partner takes less than 2 minutes. Enter your WhatsApp number, choose a payout account preference, and start promoting immediately.
        </p>
        <button
          onClick={() => onLoginClick('register')}
          className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 shadow transition cursor-pointer"
        >
          Sign Up Free as Affiliate Now
        </button>
      </div>

    </div>
  );
}
