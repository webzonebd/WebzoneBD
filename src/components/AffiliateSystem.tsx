import React, { useState, useEffect, useCallback } from 'react';
import { 
  Percent, Coins, Users, Target, TrendingUp, Wallet, ShieldCheck, 
  Check, ArrowRight, Share2, Facebook, MessageCircle, Send, Mail, Link, Award, Phone, HelpCircle,
  Zap, Settings, Sliders, Bell, RefreshCw, AlertTriangle, CheckCircle2, Clock, DollarSign, Activity,
  Play, ShieldAlert, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { Language, Theme, UserSession } from '../types';

interface SystemSettings {
  payoutThreshold: number; // in USD
  autoTriggerEnabled: boolean;
  payoutGateway: string;
  autoNotification: boolean;
}

interface AffiliateAccount {
  id: string;
  name: string;
  email: string;
  code: string;
  balance: number;
  totalEarned: number;
  referrals: number;
  payoutMethod: string;
  payoutDetails: string;
  status: 'active' | 'flagged_for_payout' | 'payout_processing' | 'paid_out';
  flaggedAt?: string;
  triggerReason?: string;
}

interface TriggerAuditLog {
  id: string;
  timestamp: string;
  type: 'AUTOTRIGGER' | 'SETTINGS' | 'COMMISSION' | 'PAYOUT' | 'MANUAL_SCAN';
  message: string;
  accountName?: string;
  amount?: number;
}

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

  // Automated Payout Trigger & System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    payoutThreshold: 50, // Default $50 USD threshold
    autoTriggerEnabled: true,
    payoutGateway: 'bKash / Nagad / Bank Wire',
    autoNotification: true,
  });

  const [affiliateAccounts, setAffiliateAccounts] = useState<AffiliateAccount[]>([
    {
      id: 'aff-user',
      name: user ? user.name : 'Your Partner Account',
      email: user ? user.email : 'partner@webzonebd.com',
      code: 'MY_PARTNER_88',
      balance: 85.00, // Exceeds $50 threshold initially
      totalEarned: 420.00,
      referrals: 29,
      payoutMethod: 'bKash Wallet',
      payoutDetails: '01711-000000 (Personal)',
      status: 'active',
    },
    {
      id: 'aff-01',
      name: 'Rashed Ahmed',
      email: 'rashed.dhaka@gmail.com',
      code: 'RASHED_DHAKA',
      balance: 120.00,
      totalEarned: 890.00,
      referrals: 52,
      payoutMethod: 'bKash Personal',
      payoutDetails: '01812-998877',
      status: 'active',
    },
    {
      id: 'aff-02',
      name: 'Mubarak Al-Dosari',
      email: 'mubarak@dosari-saudi.sa',
      code: 'MUBARAK_SA',
      balance: 42.50,
      totalEarned: 1450.00,
      referrals: 88,
      payoutMethod: 'Bank Wire (Saudi Fransi)',
      payoutDetails: 'SA8920100000001234567890',
      status: 'active',
    },
    {
      id: 'aff-03',
      name: 'Tanvir Hossain',
      email: 'tanvir@itbd.net',
      code: 'TANVIR_DEV',
      balance: 65.00,
      totalEarned: 320.00,
      referrals: 19,
      payoutMethod: 'Nagad Wallet',
      payoutDetails: '01922-334455',
      status: 'active',
    },
    {
      id: 'aff-04',
      name: 'Elena Rostova',
      email: 'elena@digitalaff.org',
      code: 'ELENA_GLOBAL',
      balance: 28.00,
      totalEarned: 610.00,
      referrals: 24,
      payoutMethod: 'PayPal / Wise',
      payoutDetails: 'elena@paypal.me',
      status: 'active',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<TriggerAuditLog[]>([
    {
      id: 'log-init',
      timestamp: new Date().toLocaleTimeString(),
      type: 'SETTINGS',
      message: '⚙️ System Settings initialized: Payout Threshold set to $50.00 USD. Automated trigger monitoring ONLINE.',
    }
  ]);

  const [accountFilter, setAccountFilter] = useState<'all' | 'flagged' | 'active' | 'paid'>('all');

  // Automated Trigger Evaluation Engine
  const runAutomatedTrigger = useCallback((
    accountsToEvaluate: AffiliateAccount[],
    threshold: number,
    enabled: boolean
  ) => {
    if (!enabled) return;

    let flaggedCount = 0;
    const newLogs: TriggerAuditLog[] = [];

    const updated = accountsToEvaluate.map((acc) => {
      // Check if account balance exceeds or meets defined threshold and is currently active
      if (acc.status === 'active' && acc.balance >= threshold) {
        flaggedCount++;
        const timeNow = new Date().toLocaleTimeString();
        const reason = `Automated Trigger: Balance ($${acc.balance.toFixed(2)}) exceeded system threshold ($${threshold.toFixed(2)})`;

        newLogs.push({
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: timeNow,
          type: 'AUTOTRIGGER',
          message: `⚡ AUTOMATED TRIGGER FLAGGED: Account [${acc.name}] (${acc.code}) with balance $${acc.balance.toFixed(2)} crossed threshold $${threshold.toFixed(2)}. FLAGGED FOR PAYOUT!`,
          accountName: acc.name,
          amount: acc.balance,
        });

        triggerToast(`⚡ Automated Trigger: Account ${acc.name} ($${acc.balance.toFixed(2)}) exceeded threshold ($${threshold.toFixed(2)}) & was FLAGGED FOR PAYOUT!`);

        return {
          ...acc,
          status: 'flagged_for_payout' as const,
          flaggedAt: new Date().toLocaleString(),
          triggerReason: reason,
        };
      }
      return acc;
    });

    if (flaggedCount > 0) {
      setAffiliateAccounts(updated);
      setAuditLogs(prev => [...newLogs, ...prev].slice(0, 40));
    }
  }, [triggerToast]);

  // Automated Trigger useEffect: evaluates balance threshold whenever settings or accounts update
  useEffect(() => {
    if (systemSettings.autoTriggerEnabled) {
      runAutomatedTrigger(affiliateAccounts, systemSettings.payoutThreshold, systemSettings.autoTriggerEnabled);
    }
  }, [systemSettings.payoutThreshold, systemSettings.autoTriggerEnabled, affiliateAccounts, runAutomatedTrigger]);

  const handleThresholdChange = (newThreshold: number) => {
    setSystemSettings(prev => ({ ...prev, payoutThreshold: newThreshold }));
    const timeNow = new Date().toLocaleTimeString();
    setAuditLogs(l => [{
      id: `log-${Date.now()}`,
      timestamp: timeNow,
      type: 'SETTINGS',
      message: `⚙️ SYSTEM SETTINGS UPDATED: Payout threshold modified to $${newThreshold.toFixed(2)} USD (৳${Math.round(newThreshold * 118.5)} BDT).`,
    }, ...l].slice(0, 40));
    triggerToast(`⚙️ System Settings: Updated payout threshold to $${newThreshold.toFixed(2)} USD`);
  };

  const handleSimulateCommissionAdd = (id: string, amount: number) => {
    setAffiliateAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const newBal = Math.round((acc.balance + amount) * 100) / 100;
        const timeNow = new Date().toLocaleTimeString();
        setAuditLogs(l => [{
          id: `log-${Date.now()}`,
          timestamp: timeNow,
          type: 'COMMISSION',
          message: `💰 Commission +$${amount.toFixed(2)} added to [${acc.name}]. New Balance: $${newBal.toFixed(2)} USD`,
          accountName: acc.name,
          amount: newBal,
        }, ...l].slice(0, 40));

        // Re-activate if paid_out so trigger evaluates
        const newStatus = acc.status === 'paid_out' ? 'active' : acc.status;
        return { ...acc, balance: newBal, status: newStatus };
      }
      return acc;
    }));
    triggerToast(`💰 Added +$${amount.toFixed(2)} referral commission!`);
  };

  const handleProcessPayout = (id: string) => {
    setAffiliateAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const paidAmount = acc.balance;
        const timeNow = new Date().toLocaleTimeString();
        setAuditLogs(l => [{
          id: `log-${Date.now()}`,
          timestamp: timeNow,
          type: 'PAYOUT',
          message: `💸 PAYOUT SETTLED: $${paidAmount.toFixed(2)} transferred to ${acc.name} via ${acc.payoutMethod} (${acc.payoutDetails}).`,
          accountName: acc.name,
          amount: paidAmount,
        }, ...l].slice(0, 40));

        triggerToast(`💸 Settled payout transfer of $${paidAmount.toFixed(2)} for ${acc.name}!`);

        return {
          ...acc,
          totalEarned: Math.round((acc.totalEarned + paidAmount) * 100) / 100,
          balance: 0,
          status: 'paid_out',
          triggerReason: undefined,
          flaggedAt: undefined,
        };
      }
      return acc;
    }));
  };

  const handleManualScan = () => {
    const timeNow = new Date().toLocaleTimeString();
    setAuditLogs(l => [{
      id: `log-${Date.now()}`,
      timestamp: timeNow,
      type: 'MANUAL_SCAN',
      message: `🔍 Manual trigger scan initiated across ${affiliateAccounts.length} accounts with threshold $${systemSettings.payoutThreshold.toFixed(2)}.`,
    }, ...l].slice(0, 40));

    runAutomatedTrigger(affiliateAccounts, systemSettings.payoutThreshold, true);
    triggerToast(`🔍 Completed manual payout trigger scan across all accounts!`);
  };

  const handleResetAccounts = () => {
    setAffiliateAccounts([
      {
        id: 'aff-user',
        name: user ? user.name : 'Your Partner Account',
        email: user ? user.email : 'partner@webzonebd.com',
        code: 'MY_PARTNER_88',
        balance: 85.00,
        totalEarned: 420.00,
        referrals: 29,
        payoutMethod: 'bKash Wallet',
        payoutDetails: '01711-000000',
        status: 'active',
      },
      {
        id: 'aff-01',
        name: 'Rashed Ahmed',
        email: 'rashed.dhaka@gmail.com',
        code: 'RASHED_DHAKA',
        balance: 120.00,
        totalEarned: 890.00,
        referrals: 52,
        payoutMethod: 'bKash Personal',
        payoutDetails: '01812-998877',
        status: 'active',
      },
      {
        id: 'aff-02',
        name: 'Mubarak Al-Dosari',
        email: 'mubarak@dosari-saudi.sa',
        code: 'MUBARAK_SA',
        balance: 42.50,
        totalEarned: 1450.00,
        referrals: 88,
        payoutMethod: 'Bank Wire (Saudi Fransi)',
        payoutDetails: 'SA8920100000001234567890',
        status: 'active',
      },
      {
        id: 'aff-03',
        name: 'Tanvir Hossain',
        email: 'tanvir@itbd.net',
        code: 'TANVIR_DEV',
        balance: 65.00,
        totalEarned: 320.00,
        referrals: 19,
        payoutMethod: 'Nagad Wallet',
        payoutDetails: '01922-334455',
        status: 'active',
      },
      {
        id: 'aff-04',
        name: 'Elena Rostova',
        email: 'elena@digitalaff.org',
        code: 'ELENA_GLOBAL',
        balance: 28.00,
        totalEarned: 610.00,
        referrals: 24,
        payoutMethod: 'PayPal / Wise',
        payoutDetails: 'elena@paypal.me',
        status: 'active',
      },
    ]);
    triggerToast("🔄 Reset demo affiliate accounts & balances!");
  };

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

      {/* 2.5 AUTOMATED PAYOUT TRIGGER & SYSTEM SETTINGS ENGINE */}
      <div className={`border p-6 sm:p-8 rounded-3xl ${bgCard} max-w-5xl mx-auto space-y-8`}>
        {/* Header Title & System Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider">
              <Zap className="w-3.5 h-3.5 text-purple-500 animate-bounce" />
              <span>System Settings Automated Payout Trigger</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'অটোমেটেড পেআউট ট্রিগার ও সিস্টেম সেটিংস' : language === 'ar' ? 'المشغل التلقائي للسحب وإعدادات النظام' : 'Automated Payout Trigger Engine'}</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl">
              {language === 'bn' 
                ? 'সিস্টেম সেটিংসে সেটককৃত নির্দিষ্ট ব্যালেন্স থ্রেশহোল্ড অতিক্রম করলেই অ্যাফিলিয়েট অ্যাকাউন্টগুলো স্বয়ংক্রিয়ভাবে পেআউটের জন্য ফ্ল্যাগ হয়।'
                : language === 'ar'
                ? 'نظام التتبع الذكي الذي يقوم بتحديد حسابات التسويق بالعمولة تلقائياً فور تجاوز رصيدها الحد الأدنى المحدد في إعدادات النظام.'
                : 'Automated trigger monitors affiliate balances in real time and flags accounts for payout settlements once earnings cross the system threshold.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleManualScan}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Execute Manual Trigger Check"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Run Trigger Scan</span>
            </button>
            <button
              onClick={handleResetAccounts}
              className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold transition cursor-pointer"
              title="Reset Demo Balances"
            >
              Reset Demo
            </button>
          </div>
        </div>

        {/* System Settings & Threshold Config Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-indigo-500/5 p-5 sm:p-6 rounded-2xl border border-purple-500/15">
          {/* Left Column: Threshold Slider & Presets */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase font-mono tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-500" />
                <span>System Settings: Payout Balance Threshold</span>
              </label>
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono font-black text-xs rounded-lg border border-purple-500/30">
                ${systemSettings.payoutThreshold.toFixed(2)} USD
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={systemSettings.payoutThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono font-bold">
                <span>Min: $10.00</span>
                <span>৳{Math.round(systemSettings.payoutThreshold * 118.5)} BDT</span>
                <span>﷼{Math.round(systemSettings.payoutThreshold * 3.75)} SAR</span>
                <span>Max: $300.00</span>
              </div>
            </div>

            {/* Quick Threshold Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Presets:</span>
              {[25, 50, 75, 100, 150, 200].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleThresholdChange(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    systemSettings.payoutThreshold === preset
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-purple-400'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Automated Trigger System Controls */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3 bg-white/60 dark:bg-neutral-900/60 p-4 rounded-xl border border-purple-500/10">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">Auto-Trigger Status</span>
              </div>
              <button
                onClick={() => {
                  const updated = !systemSettings.autoTriggerEnabled;
                  setSystemSettings(s => ({ ...s, autoTriggerEnabled: updated }));
                  triggerToast(updated ? '⚡ Auto-Trigger Engine ENABLED' : '⏸️ Auto-Trigger Engine PAUSED');
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-black font-mono tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  systemSettings.autoTriggerEnabled
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${systemSettings.autoTriggerEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{systemSettings.autoTriggerEnabled ? 'ONLINE ACTIVE' : 'PAUSED'}</span>
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Flagged Accounts:</span>
                <span className="font-mono font-black text-rose-500">
                  {affiliateAccounts.filter(a => a.status === 'flagged_for_payout').length} Accounts
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Total Flagged Payout Volume:</span>
                <span className="font-mono font-black text-purple-600 dark:text-purple-400">
                  ${affiliateAccounts.filter(a => a.status === 'flagged_for_payout').reduce((s, a) => s + a.balance, 0).toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-neutral-400 leading-tight border-t border-neutral-200/50 dark:border-neutral-800">
              ⚡ When an account balance crosses ${systemSettings.payoutThreshold.toFixed(2)}, the automated trigger instantly flags it for payout settlement.
            </div>
          </div>
        </div>

        {/* Affiliate Accounts & Threshold Trigger Ledger */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Affiliate Accounts & Payout Threshold Progress</span>
            </h3>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] font-bold">
              <button
                onClick={() => setAccountFilter('all')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  accountFilter === 'all'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                All ({affiliateAccounts.length})
              </button>
              <button
                onClick={() => setAccountFilter('flagged')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  accountFilter === 'flagged'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-rose-500 hover:text-rose-600'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Flagged ({affiliateAccounts.filter(a => a.status === 'flagged_for_payout').length})</span>
              </button>
              <button
                onClick={() => setAccountFilter('active')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  accountFilter === 'active'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setAccountFilter('paid')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  accountFilter === 'paid'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Paid
              </button>
            </div>
          </div>

          {/* Accounts Ledger Table */}
          <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-neutral-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-neutral-100/70 dark:bg-neutral-900 font-mono text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="p-3.5">Affiliate Partner</th>
                    <th className="p-3.5">Current Balance</th>
                    <th className="p-3.5 min-w-[180px]">Threshold Progress</th>
                    <th className="p-3.5">Payout Method</th>
                    <th className="p-3.5">Automated Status</th>
                    <th className="p-3.5 text-right">Actions / Testing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
                  {affiliateAccounts
                    .filter(acc => {
                      if (accountFilter === 'flagged') return acc.status === 'flagged_for_payout';
                      if (accountFilter === 'active') return acc.status === 'active';
                      if (accountFilter === 'paid') return acc.status === 'paid_out';
                      return true;
                    })
                    .map((acc) => {
                      const isFlagged = acc.status === 'flagged_for_payout';
                      const isExceeded = acc.balance >= systemSettings.payoutThreshold;
                      const progressPct = Math.min(200, Math.round((acc.balance / systemSettings.payoutThreshold) * 100));

                      return (
                        <tr 
                          key={acc.id} 
                          className={`transition ${
                            isFlagged 
                              ? 'bg-rose-500/10 dark:bg-rose-950/20 hover:bg-rose-500/15' 
                              : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40'
                          }`}
                        >
                          {/* Account Info */}
                          <td className="p-3.5">
                            <div className="font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5">
                              <span>{acc.name}</span>
                              {acc.id === 'aff-user' && (
                                <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[9px] font-mono rounded">You</span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              {acc.email} • <span className="text-purple-500 font-bold">{acc.code}</span>
                            </div>
                          </td>

                          {/* Balance */}
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="font-mono font-black text-sm text-neutral-900 dark:text-white">
                              ${acc.balance.toFixed(2)} <span className="text-[9px] font-bold text-neutral-400">USD</span>
                            </div>
                            <div className="text-[10px] font-mono text-neutral-400">
                              ৳{Math.round(acc.balance * 118.5).toLocaleString()} BDT
                            </div>
                          </td>

                          {/* Progress Bar toward System Threshold */}
                          <td className="p-3.5">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                                <span className={isExceeded ? 'text-rose-500' : 'text-neutral-400'}>
                                  {progressPct}% of threshold (${systemSettings.payoutThreshold})
                                </span>
                                {isExceeded && (
                                  <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded text-[8px] font-black uppercase tracking-wider animate-pulse">
                                    EXCEEDED
                                  </span>
                                )}
                              </div>
                              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 rounded-full ${
                                    isFlagged || isExceeded
                                      ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500'
                                      : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                  }`}
                                  style={{ width: `${Math.min(100, progressPct)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Payout Method */}
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                              {acc.payoutMethod}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-400">
                              {acc.payoutDetails}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="p-3.5 whitespace-nowrap">
                            {isFlagged ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase font-mono rounded-xl animate-pulse">
                                <Zap className="w-3 h-3 text-rose-500" />
                                <span>FLAGGED FOR PAYOUT</span>
                              </div>
                            ) : acc.status === 'paid_out' ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono rounded-xl">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>SETTLED & PAID</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[10px] font-bold font-mono rounded-xl">
                                <Clock className="w-3 h-3" />
                                <span>Active (Monitoring)</span>
                              </div>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {isFlagged ? (
                                <button
                                  onClick={() => handleProcessPayout(acc.id)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                  <Wallet className="w-3 h-3" />
                                  <span>Process Payout</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSimulateCommissionAdd(acc.id, 25)}
                                  className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-[10px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                                  title="Add $25 commission to test trigger threshold crossing"
                                >
                                  <span>+$25 Sale</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Real-Time Automated Trigger Console / Terminal Audit Log */}
        <div className="space-y-3 bg-neutral-950 text-neutral-100 p-4 sm:p-5 rounded-2xl border border-neutral-800 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-neutral-200 tracking-wider uppercase">
                Automated Trigger Live Audit Log Terminal
              </span>
            </div>
            <button
              onClick={() => setAuditLogs([])}
              className="text-[10px] text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
            >
              Clear Terminal
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed pr-2">
            {auditLogs.length === 0 ? (
              <p className="text-neutral-600 italic text-[10px]">No recent trigger events recorded.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 border-b border-neutral-900/80 pb-1">
                  <span className="text-neutral-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`shrink-0 font-bold px-1 rounded text-[9px] ${
                    log.type === 'AUTOTRIGGER'
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                      : log.type === 'PAYOUT'
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : log.type === 'COMMISSION'
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {log.type}
                  </span>
                  <span className={log.type === 'AUTOTRIGGER' ? 'text-rose-300 font-bold' : 'text-neutral-300'}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
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
