import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Percent, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, 
  Sparkles, Zap, MessageSquare, Timer, ShoppingCart, HelpCircle, 
  Award, RefreshCw, Star, ArrowUpRight, Flame, Layers, Terminal
} from 'lucide-react';
import { Currency, Language } from '../types';

interface OffersPageProps {
  language: Language;
  theme: 'light' | 'dark';
  currency: Currency;
  currencySettings?: {
    rates?: { BDT: number; SAR: number; USD: number };
    defaultCurrency?: Currency;
    enabled?: Record<Currency, boolean>;
  };
  triggerToast: (msg: string) => void;
  addToCart?: (item: any) => void;
  setCartOpen?: (open: boolean) => void;
}

export default function OffersPage({
  language,
  theme,
  currency,
  currencySettings,
  triggerToast,
  addToCart,
  setCartOpen
}: OffersPageProps) {
  // Live Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 42, seconds: 19 });
  const [currencyRate, setCurrencyRate] = useState({ BDT: 118.5, SAR: 3.75, USD: 1 });
  const [activeTab, setActiveTab] = useState<'all' | 'combos' | 'websites' | 'hosting' | 'domains'>('all');
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  
  // Dynamic text animation states
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const animatedOffers = [
    { en: 'Domain Registration', bn: 'ডোমেন রেজিস্ট্রেশন', ar: 'تسجيل النطاق' },
    { en: 'Share & Cloud Hosting', bn: 'শেয়ার ও ক্লাউড হোস্ٹنگ', ar: 'استضافة مشتركة وسحابية' },
    { en: 'Reseller Hosting', bn: 'রিসেলার হোস্টিং', ar: 'استضافة الموزعين' },
    { en: 'Business Website', bn: 'বিজনেস ওয়েবসাইট', ar: 'موقع أعمال تجاري' },
    { en: 'Blog & News Portal', bn: 'ব্লগ ও নিউজ পোর্টাল', ar: 'مدونة وبوابة إخبارية' },
    { en: 'eCommerce Website', bn: 'ই-কমার্স ওয়েবসাইট', ar: 'متجر إلكتروني متكامل' }
  ];

  useEffect(() => {
    const textTimer = setInterval(() => {
      setAnimatedIndex((prev) => (prev + 1) % animatedOffers.length);
    }, 2500);
    return () => clearInterval(textTimer);
  }, [animatedOffers.length]);
  
  // Quick Order/Inquiry form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [comparisonMetric, setComparisonMetric] = useState<'storage' | 'support' | 'domain' | 'price'>('price');

  // Load custom rates if provided
  useEffect(() => {
    if (currencySettings?.rates) {
      setCurrencyRate(currencySettings.rates);
    }
  }, [currencySettings]);

  // Countdown clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          // Reset to 3 days to keep the sales element active
          return { days: 3, hours: 11, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Exit intent popup trigger (triggers when mouse leaves window)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50 && !localStorage.getItem('wb_offers_exit_popup_seen')) {
        setShowExitPopup(true);
        localStorage.setItem('wb_offers_exit_popup_seen', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Schema Markup injection
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SpecialAnnouncement",
      "name": "WebzoneBD IT Mega Combo Offers Festival",
      "description": "Exclusive limited-time web development combos, NVMe hosting packages, and premium domains setup in BDT, USD and SAR.",
      "category": "Technology Deals",
      "announcementLocation": {
        "@type": "LocalBusiness",
        "name": "WebzoneBD IT Agency",
        "url": "https://webzonebd.com"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Pricing conversion helper
  const formatPrice = (bdtPrice: number) => {
    const activeCurrency = currency || 'BDT';
    // BDT base to USD base: (bdt / BDT_rate)
    const usdEquivalent = bdtPrice / (currencyRate.BDT || 118.5);
    
    if (activeCurrency === 'USD') {
      return `$${usdEquivalent.toFixed(0)}`;
    } else if (activeCurrency === 'SAR') {
      const sarPrice = usdEquivalent * (currencyRate.SAR || 3.75);
      return `${sarPrice.toFixed(0)} SAR`;
    } else {
      return `৳${bdtPrice.toLocaleString('en-US')}`;
    }
  };

  // Pricing regular conversion helper
  const getDiscountPercentage = (reg: number, offer: number) => {
    const diff = reg - offer;
    return Math.round((diff / reg) * 100);
  };

  // WhatsApp template redirection logic
  const handleWhatsAppOrder = (item: any) => {
    const itemTitle = item.title;
    const itemPrice = formatPrice(item.price);
    const message = encodeURIComponent(
      `Hello WebzoneBD! I want to claim the Special Combo Offer:\n\n` +
      `🔥 Package Name: ${itemTitle}\n` +
      `💳 Special Price: ${itemPrice}\n` +
      `🌐 Client Location: ${currency === 'SAR' ? 'Saudi Arabia' : currency === 'USD' ? 'Global' : 'Bangladesh'}\n\n` +
      `Please register my campaign offer and consult me shortly.`
    );
    window.open(`https://wa.me/966570511931?text=${message}`, '_blank');
    triggerToast(language === 'bn' ? 'আপনাকে হোয়াটসঅ্যাপে রিডাইরেক্ট করা হচ্ছে...' : 'Redirecting you to WhatsApp Support...');
  };

  // Direct checkout handler (if cart support is provided)
  const handleDirectOrder = (item: any) => {
    if (addToCart) {
      // Structure standard cart item payload
      addToCart({
        id: `offer-${item.id}`,
        title: `${item.title} (Promo Combo)`,
        price: item.price,
        originalPrice: item.regularPrice,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200',
        type: 'package',
        category: 'Combo Offer',
        shortDetails: `${item.title} Bundle: ${item.features ? item.features.join(', ') : 'Exclusive discounts.'}`
      });
      triggerToast(language === 'bn' ? 'অফারটি কার্টে যোগ করা হয়েছে!' : 'Special promo package successfully added to your cart!');
      if (setCartOpen) setCartOpen(true);
    } else {
      setSelectedPackage(item);
    }
  };

  // On-Site Form submit handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      triggerToast(language === 'bn' ? 'দয়া করে নাম এবং ফোন নম্বর প্রদান করুন।' : 'Please enter your name and phone number to claim.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      triggerToast(language === 'bn' ? 'অভিনন্দন! আপনার অফারটি বুক করা হয়েছে। আমাদের প্রতিনিধি ২৪ ঘন্টার মধ্যে যোগাযোগ করবেন।' : 'Congratulations! Your premium offer is booked. An executive will reach out to you shortly.');
      
      // Open WhatsApp after success for instant validation
      const itemTitle = selectedPackage?.title || 'Mega Discount Campaign';
      const itemPrice = selectedPackage ? formatPrice(selectedPackage.price) : 'Any Bundle';
      const message = encodeURIComponent(
        `[WEBSITE BOOKING] Hello WebzoneBD!\n\n` +
        `I just booked an offer from your festival:\n` +
        `👤 Name: ${clientName}\n` +
        `📞 Phone: ${clientPhone}\n` +
        `✉️ Email: ${clientEmail || 'N/A'}\n` +
        `🔥 Package: ${itemTitle} (${itemPrice})\n` +
        `📝 Notes: ${orderNotes || 'None'}\n\n` +
        `Please confirm my booking slots.`
      );
      window.open(`https://wa.me/966570511931?text=${message}`, '_blank');
      
      // Reset form & modal
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setOrderNotes('');
      setSelectedPackage(null);
    }, 1200);
  };

  // Section 1: Domain Deals
  const domainOffers = [
    { id: 'dom-com', title: '.com Domain', reg: 1500, offer: 999, suffix: '/year', ext: 'com', popular: true },
    { id: 'dom-net', title: '.net Domain', reg: 1800, offer: 1299, suffix: '/year', ext: 'net', popular: false },
    { id: 'dom-org', title: '.org Domain', reg: 1800, offer: 1299, suffix: '/year', ext: 'org', popular: false },
    { id: 'dom-xyz', title: '.xyz Domain', reg: 1200, offer: 699, suffix: '/year', ext: 'xyz', popular: false },
  ];

  // Section 2: Hosting Deals
  const hostingOffers = [
    { id: 'host-start', title: 'Starter Hosting', reg: 1999, offer: 999, features: ['2GB NVMe SSD Storage', 'Free SSL Security Certificate', '5 Professional Emails', 'Weekly Cloud Backup Support'] },
    { id: 'host-biz', title: 'Business Hosting', reg: 5999, offer: 2999, popular: true, features: ['5GB NVMe SSD Storage', 'Unlimited Business Emails', 'Free SSL & Cloudflare integration', 'Daily Dynamic Backup Secure'] },
    { id: 'host-prem', title: 'Premium Hosting', reg: 9999, offer: 4999, features: ['10GB Premium NVMe SSD', 'Priority 24/7 Support SLA', 'Free SSL Setup & Migration', 'Daily Cloud Backup & Shield'] },
  ];

  // Section 3: Business Websites
  const websiteOffers = [
    { id: 'web-startup', title: 'Startup Website', reg: 12000, offer: 5990, features: ['Up to 5 Pages custom layout', 'Mobile Responsive Framework', 'Secure Contact Form & Leads', 'Basic On-page SEO Metadata'] },
    { id: 'web-pro', title: 'Professional Business Website', reg: 28000, offer: 14990, popular: true, features: ['Up to 15 Premium Pages', 'Dynamic Admin Control Panel', 'Advanced Features Integration', 'Bespoke Premium UI & Layouts', 'WordPress Control Panel Access'] },
    { id: 'web-corp', title: 'Corporate Website', reg: 60000, offer: 29990, features: ['Unlimited Pages Dynamic Layout', 'Advanced Enterprise Admin Panel', 'Multi-Language Support Module', 'Stellar Modern Brand UI', 'WordPress/Laravel Custom Framework'] },
  ];

  // Section 4: Ecommerce
  const ecommerceOffers = [
    { id: 'eco-startup', title: 'Startup Ecommerce', reg: 20000, offer: 9990, features: ['Premium Product Management', 'Responsive Inventory & Orders', 'Customer Checkout Dashboard', 'Bkash/Nagad/Cards Gateway Integration', 'Automatic Order Tracking Updates'] },
    { id: 'eco-biz', title: 'Business Ecommerce', reg: 40000, offer: 19990, popular: true, features: ['Advanced Inventory Management', 'Multi-payment secure gateways', 'Customer Account Center', 'In-depth sales reporting module', 'Automatic PDF invoice generator'] },
    { id: 'eco-ent', title: 'Enterprise Ecommerce', reg: 80000, offer: 39990, features: ['High performance headless framework', 'Multi-vendor marketplace compatibility', 'Integrated CRM tools', 'Unlimited products scale', 'Intl stripe/paypal multi-currency'] },
  ];

  // Section 5: News Portal
  const newsOffers = [
    { id: 'news-wp', title: 'WordPress News Portal', reg: 12000, offer: 5990, bestseller: true, features: ['Unlimited News Posts & Categories', 'Category Management & Archive', 'Multi-level Reporter Access CMS', 'Full Mobile-Friendly Premium Theme', 'Google Adsense monetization ready'] }
  ];

  // Section 6: Corporate Portals
  const portalOffers = [
    { id: 'port-services', title: 'Services / Products eWebsite', reg: 30000, offer: 14990, features: ['Full service inquiry cart layout', 'Stripe & local payment gateways', 'Beautiful client testimonials portal', 'Automated email notification triggers'] },
    { id: 'port-corp', title: 'Company Portal', reg: 50000, offer: 24990, features: ['Secure client management panel', 'Dynamic quote builder wizard', 'Custom database integrations', 'High speed React optimized dashboard'] },
    { id: 'port-custom', title: 'Custom Web Portal', reg: 0, offer: 0, custom: true, features: ['Tailored bespoke enterprise apps', 'Cloud native robust architectures', 'Custom Laravel, Node, React APIs', 'Highly secure isolated databases'] },
  ];

  // Section 7: Mega Combo Packages
  const megaCombos = [
    { id: 'combo-launch', title: 'Business Launch Combo', reg: 19990, offer: 9990, features: ['.com Domain Name Included', 'High Speed NVMe SSD Hosting', 'Full Standard Business Website', 'Local Payment Gateway Setup'] },
    { id: 'combo-growth', title: 'Ecommerce Growth Combo', reg: 39990, offer: 19990, recommended: true, features: ['Domain registration included', 'High Performance Web Hosting', 'Complete Premium Ecommerce Website', 'Secure Payment Gateway Gateway', 'Full Basic SEO Optimization Pack'] },
  ];

  // FAQs
  const faqItems = [
    { q: 'How long are the offers valid?', a: 'These promotional offers are part of our Limited-Time Festival and are guaranteed for the next 48 hours only. Lock in your special price now to save!' },
    { q: 'What payment methods are available?', a: 'We support Bkash, Nagad, Rocket, Bank Transfer in Bangladesh; Al Rajhi Bank & STC Pay in Saudi Arabia; and PayPal or Card payments internationally.' },
    { q: 'Is technical support included?', a: 'Yes, absolutely! Every package includes premium lifetime technical support, active malware monitoring, and free hosting backups.' },
    { q: 'Can I upgrade my package later?', a: 'Yes! You can upgrade your hosting, domain extensions, or website features seamlessly at any time in the future.' },
    { q: 'Do I get full admin panel control?', a: 'Yes, you get full administrative credentials to your website panel (WordPress, Laravel dashboard, or hosting account panel) upon delivery.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 font-sans selection:bg-[#7C3AED] selection:text-white pb-16">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-center py-2.5 px-4 text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-md relative z-40 animate-pulse">
        <span>🔥 Limited Time Mega Combo Sale – Save Up to 50% Today</span>
        <span className="hidden sm:inline bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px]">Active</span>
      </div>

      {/* STICKY COUNTDOWN SUB-BAR ON DESKTOP */}
      <div className="sticky top-[73px] z-30 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 px-4 py-2.5 shadow-sm hidden md:flex items-center justify-between max-w-7xl mx-auto rounded-b-2xl">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-extrabold tracking-tight dark:text-slate-200">
            {language === 'bn' ? 'অফার শেষ হতে আর মাত্র:' : 'Campaign Offer Ends In:'}
          </span>
        </div>
        
        {/* Compact Timer Grid */}
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded text-xs font-black">
            <span>{timeLeft.days}</span><span className="text-[10px] opacity-70">d</span>
          </div>
          <span className="dark:text-slate-400 text-slate-400">:</span>
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded text-xs font-black">
            <span>{timeLeft.hours}</span><span className="text-[10px] opacity-70">h</span>
          </div>
          <span className="dark:text-slate-400 text-slate-400">:</span>
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded text-xs font-black">
            <span>{timeLeft.minutes}</span><span className="text-[10px] opacity-70">m</span>
          </div>
          <span className="dark:text-slate-400 text-slate-400">:</span>
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded text-xs font-black animate-pulse">
            <span>{timeLeft.seconds}</span><span className="text-[10px] opacity-70">s</span>
          </div>
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('mega-combos-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-3.5 py-1 rounded-lg text-[11px] font-black tracking-tight hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm shadow-violet-500/20"
        >
          {language === 'bn' ? 'অফার পান' : 'Claim Festival Offer'}
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent">
        
        {/* Background decorative grid */}
        <div className="absolute top-0 left-0 right-0 h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/25 text-[11px] font-bold tracking-wider uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EC4899] animate-spin" />
            <span>🎉 Special Mega Deal Campaign</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-6 flex flex-col items-center justify-center gap-3"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] shrink-0">
              🚀 {language === 'bn' ? 'মেগা কম্বো অফার' : language === 'ar' ? 'عروض الكومبو المتميزة' : 'Mega Combo Offer'}
            </span>
            <div className="relative w-full h-[1.3em] overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={animatedIndex}
                  initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#3B82F6]"
                >
                  {language === 'bn' ? animatedOffers[animatedIndex].bn : language === 'ar' ? animatedOffers[animatedIndex].ar : animatedOffers[animatedIndex].en}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Limited-Time Offer – Save Up to 50% on Domains, Hosting, Ecommerce, Business Websites, News Portals, and Blogs. Elevate your business today with our expert developers.
          </motion.p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto mb-10 text-left font-semibold">
            {[
              '✅ Free Domain (Selected)',
              '✅ Free SSL Certificate',
              '✅ Free Business Email',
              '✅ Free Website Setup',
              '✅ Free Basic SEO Setup'
            ].map((b, i) => (
              <div 
                key={i} 
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 shadow-xs flex items-center justify-center text-center text-[10.5px] sm:text-[11.5px] dark:text-slate-200 text-slate-700 font-bold"
              >
                {b}
              </div>
            ))}
          </div>

          {/* Large Countdown Timer Block */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-[24px] p-6 max-w-lg mx-auto shadow-xl shadow-indigo-500/5 mb-10">
            <div className="text-[10px] uppercase tracking-wider text-rose-500 font-extrabold mb-4 flex items-center justify-center gap-1.5 animate-pulse">
              <Timer className="w-4 h-4" />
              <span>Flash Sale Expiration Countdown</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 font-mono mb-4 text-center">
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                  {timeLeft.days}
                </span>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Days</p>
              </div>
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                  {timeLeft.hours}
                </span>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Hours</p>
              </div>
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                  {timeLeft.minutes}
                </span>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Mins</p>
              </div>
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#A855F7]">
                  {timeLeft.seconds}
                </span>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Secs</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">
              *All promotional campaign deals will roll back to normal commercial pricing once timer expires.
            </p>
          </div>

          {/* Quick Hero Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('mega-combos-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl text-xs font-black tracking-wide text-white bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-102 transition-all shadow-[0_12px_30px_rgba(124,58,237,0.35)] cursor-pointer flex items-center gap-2"
            >
              <span>🛒 Browse Combos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('all-offers-panel');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-xl text-xs font-black tracking-wide text-slate-700 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>🎁 Claim Special Offer</span>
            </button>
            <button
              onClick={() => handleWhatsAppOrder({ title: 'Mega Custom Deal Inquiry', price: 9990 })}
              className="px-6 py-4 rounded-xl text-xs font-black tracking-wide text-white bg-[#25D366] hover:bg-[#128C7E] transition-all shadow-[0_12px_30px_rgba(37,211,102,0.15)] cursor-pointer flex items-center gap-2"
            >
              <span>💬 WhatsApp Order</span>
            </button>
          </div>

        </div>
      </div>

      {/* FILTER TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-center overflow-x-auto pb-3 gap-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
          {[
            { id: 'all', label: 'All Promotions' },
            { id: 'combos', label: '⭐ Mega Combos' },
            { id: 'websites', label: '🖥️ Website Packages' },
            { id: 'hosting', label: '⚡ Cloud Hosting' },
            { id: 'domains', label: '🌐 Domain Extensions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-black tracking-tight shrink-0 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-violet-500/10'
                  : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER DYNAMIC PROMOTIONS GRIDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16" id="all-offers-panel">
        
        {/* SECTION 7: MEGA COMBO OFFERS */}
        {(activeTab === 'all' || activeTab === 'combos') && (
          <div className="space-y-6 scroll-mt-24" id="mega-combos-section">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-[#A855F7] bg-[#A855F7]/10 px-2.5 py-1 rounded-full">
                🔥 Hot Deal Bundles
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2.5 dark:text-white">
                Mega Combo Offers
              </h2>
              <p className="text-slate-505 text-xs sm:text-sm dark:text-slate-400 mt-1 max-w-2xl">
                Get everything you need to establish a highly professional online presence in one extremely affordable package.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {megaCombos.map(pkg => (
                <div 
                  key={pkg.id} 
                  className={`rounded-[24px] bg-white dark:bg-[#0F172A] border relative overflow-hidden transition-all duration-300 shadow-md group ${
                    pkg.recommended 
                      ? 'border-[#7C3AED]/50 ring-2 ring-[#7C3AED]/20 shadow-violet-500/10' 
                      : 'border-slate-200/60 dark:border-white/8 hover:border-violet-500/30'
                  }`}
                  style={{ backdropFilter: 'blur(20px)' }}
                >
                  {pkg.recommended && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#7C3AED] to-[#EC4899] text-white text-[9px] uppercase font-black tracking-wider py-1.5 px-4 rounded-bl-xl shadow-sm z-10 animate-pulse">
                      ⭐ Recommended Package
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {pkg.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        Ultimate Fast Track Bundle
                      </p>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-3">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price calculation block */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black line-through block">
                          {formatPrice(pkg.reg)}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-violet-600 to-[#EC4899] bg-clip-text text-transparent">
                            {formatPrice(pkg.offer)}
                          </span>
                        </div>
                      </div>

                      {/* Promo dynamic badge */}
                      <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg">
                        🔥 Save {getDiscountPercentage(pkg.reg, pkg.offer)}% OFF
                      </span>
                    </div>

                    {/* Buttons CTA */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleDirectOrder(pkg)}
                        className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black text-xs rounded-xl hover:scale-102 transition shadow-md shadow-violet-500/10 cursor-pointer"
                      >
                        ⚡ Order Now
                      </button>
                      <button
                        onClick={() => handleWhatsAppOrder(pkg)}
                        className="w-full py-3 bg-[#25D366]/10 hover:bg-[#25D366]/15 border border-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>💬 WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 1: DOMAIN REGISTRATION OFFERS */}
        {(activeTab === 'all' || activeTab === 'domains') && (
          <div className="space-y-6 scroll-mt-24">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                🌐 Address Registration
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2.5 dark:text-white">
                Domain Registration Offers
              </h2>
              <p className="text-slate-505 text-xs sm:text-sm dark:text-slate-400 mt-1 max-w-2xl">
                Get your custom corporate domain extensions at extreme discount prices. All domain names come loaded with free premium management perks.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {domainOffers.map(dom => (
                <div 
                  key={dom.id} 
                  className={`p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-200/60 dark:border-white/8 transition-all duration-300 hover:scale-102 shadow-sm text-center relative overflow-hidden group`}
                >
                  <span className="absolute top-0 left-0 bg-emerald-500/10 text-emerald-600 text-[8px] uppercase font-bold py-1 px-3 rounded-br-lg">
                    🎁 Free DNS Mgmt
                  </span>

                  <div className="space-y-4 pt-3">
                    <span className="text-xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-400">
                      .{dom.ext}
                    </span>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 line-through leading-none font-bold">
                        {formatPrice(dom.reg)}
                      </p>
                      <p className="text-2xl font-black text-slate-950 dark:text-white leading-none">
                        {formatPrice(dom.offer)}
                      </p>
                      <span className="text-[9px] text-slate-400 font-bold block">{dom.suffix}</span>
                    </div>

                    <span className="inline-block bg-rose-500/10 text-rose-500 text-[8.5px] font-extrabold px-2 py-0.5 rounded-full">
                      🔥 Save {getDiscountPercentage(dom.reg, dom.offer)}%
                    </span>

                    <button 
                      onClick={() => handleDirectOrder({ id: dom.id, title: dom.title, price: dom.offer, regularPrice: dom.reg })}
                      className="w-full py-2 bg-slate-50 hover:bg-violet-500 hover:text-white dark:bg-slate-950/40 dark:hover:bg-violet-600 text-slate-700 dark:text-slate-300 rounded-xl text-[10.5px] font-black tracking-wide transition cursor-pointer"
                    >
                      🛒 Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: WEB HOSTING OFFERS */}
        {(activeTab === 'all' || activeTab === 'hosting') && (
          <div className="space-y-6 scroll-mt-24">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">
                ⚡ Ultra Fast NVMe SSD
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2.5 dark:text-white">
                Web Hosting Offers
              </h2>
              <p className="text-slate-505 text-xs sm:text-sm dark:text-slate-400 mt-1 max-w-2xl">
                Deploy your applications on our cloud infrastructure optimized with premium LiteSpeed engines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {hostingOffers.map(host => (
                <div 
                  key={host.id} 
                  className={`rounded-[24px] bg-white dark:bg-[#0F172A] border p-6 flex flex-col justify-between relative transition-all duration-300 hover:scale-102 shadow-sm ${
                    host.popular 
                      ? 'border-[#7C3AED]/40 shadow-md shadow-indigo-500/5 ring-1 ring-violet-500/10' 
                      : 'border-slate-200/60 dark:border-white/8'
                  }`}
                >
                  {host.popular && (
                    <span className="absolute top-0 right-0 bg-gradient-to-l from-violet-600 to-[#EC4899] text-white text-[8px] uppercase font-black tracking-widest py-1 px-3 rounded-bl-xl animate-pulse">
                      🔥 Most Popular
                    </span>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {host.title}
                      </h3>
                      <p className="text-[10.5px] text-slate-400 font-bold uppercase tracking-widest">NVMe SSD Cloud</p>
                    </div>

                    <ul className="space-y-2.5">
                      {host.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 line-through font-bold block">{formatPrice(host.reg)}</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(host.offer)}</span>
                        <span className="text-[9px] text-slate-400 block font-bold">/ year renewal</span>
                      </div>
                      <span className="bg-rose-500/10 text-rose-500 text-[8.5px] font-black px-2 py-0.5 rounded-full">
                        -{getDiscountPercentage(host.reg, host.offer)}% OFF
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDirectOrder({ id: host.id, title: host.title, price: host.offer, regularPrice: host.reg })}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl hover:scale-102 transition cursor-pointer"
                    >
                      ⚡ Buy Hosting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: BUSINESS WEBSITE PACKAGES */}
        {(activeTab === 'all' || activeTab === 'websites') && (
          <div className="space-y-6 scroll-mt-24">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full">
                🖥️ Responsive Design Custom
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2.5 dark:text-white">
                Business Website Packages
              </h2>
              <p className="text-slate-505 text-xs sm:text-sm dark:text-slate-400 mt-1 max-w-2xl">
                Bespoke layouts optimized perfectly for corporations, startups, portfolios, and commercial entities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {websiteOffers.map(web => (
                <div 
                  key={web.id} 
                  className={`rounded-[24px] bg-white dark:bg-[#0F172A] border p-6 flex flex-col justify-between relative transition-all duration-300 hover:scale-102 shadow-sm ${
                    web.popular 
                      ? 'border-[#7C3AED]/40 shadow-md shadow-indigo-500/5 ring-1 ring-violet-500/10' 
                      : 'border-slate-200/60 dark:border-white/8'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {web.title}
                      </h3>
                      <p className="text-[10.5px] text-slate-400 font-bold uppercase tracking-widest">Business Portal</p>
                    </div>

                    <ul className="space-y-2.5">
                      {web.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 line-through font-bold block">{formatPrice(web.reg)}</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(web.offer)}</span>
                        <span className="text-[9px] text-slate-400 block font-bold">One-time payment</span>
                      </div>
                      <span className="bg-rose-500/10 text-rose-500 text-[8.5px] font-black px-2 py-0.5 rounded-full">
                        -{getDiscountPercentage(web.reg, web.offer)}% OFF
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDirectOrder({ id: web.id, title: web.title, price: web.offer, regularPrice: web.reg })}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl hover:scale-102 transition cursor-pointer"
                    >
                      🖥️ Setup Website
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: ECOMMERCE WEBSITE OFFERS */}
        {(activeTab === 'all' || activeTab === 'websites') && (
          <div className="space-y-6 scroll-mt-24">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full">
                🛒 Sales & Products Ready
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2.5 dark:text-white">
                Ecommerce Website Offers
              </h2>
              <p className="text-slate-505 text-xs sm:text-sm dark:text-slate-400 mt-1 max-w-2xl">
                Ready to sell platforms with integrated local payment gateways, customer order flows, inventory counters, and tracking templates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {ecommerceOffers.map(eco => (
                <div 
                  key={eco.id} 
                  className={`rounded-[24px] bg-white dark:bg-[#0F172A] border p-6 flex flex-col justify-between relative transition-all duration-300 hover:scale-102 shadow-sm ${
                    eco.popular 
                      ? 'border-[#7C3AED]/40 shadow-md shadow-indigo-500/5 ring-1 ring-violet-500/10' 
                      : 'border-slate-200/60 dark:border-white/8'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {eco.title}
                      </h3>
                      <p className="text-[10.5px] text-slate-400 font-bold uppercase tracking-widest">E-Store Core</p>
                    </div>

                    <ul className="space-y-2.5">
                      {eco.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 line-through font-bold block">{formatPrice(eco.reg)}</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(eco.offer)}</span>
                        <span className="text-[9px] text-slate-400 block font-bold">Full Ownership Setup</span>
                      </div>
                      <span className="bg-rose-500/10 text-rose-500 text-[8.5px] font-black px-2 py-0.5 rounded-full">
                        -{getDiscountPercentage(eco.reg, eco.offer)}% OFF
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDirectOrder({ id: eco.id, title: eco.title, price: eco.offer, regularPrice: eco.reg })}
                      className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs rounded-xl hover:scale-102 transition cursor-pointer"
                    >
                      🛒 Order E-Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: NEWS PORTAL OFFER */}
        {(activeTab === 'all' || activeTab === 'websites') && (
          <div className="space-y-6 scroll-mt-24">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">
                🔥 WordPress Fast Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2.5 dark:text-white">
                News Portal Offer
              </h2>
            </div>

            <div className="grid grid-cols-1 max-w-2xl mx-auto">
              {newsOffers.map(news => (
                <div 
                  key={news.id} 
                  className="rounded-[24px] bg-gradient-to-br from-white to-orange-50/20 dark:from-[#0F172A] dark:to-orange-950/5 border border-orange-500/30 p-6 flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.01] shadow-md shadow-orange-500/5"
                >
                  <span className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white text-[8px] uppercase font-black tracking-wider py-1.5 px-4 rounded-bl-xl shadow-sm z-10 animate-bounce">
                    🔥 Best Seller Badge
                  </span>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {news.title}
                      </h3>
                      <p className="text-[10.5px] text-orange-500 font-bold uppercase tracking-widest">Monetization Ready Platform</p>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {news.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-end gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 line-through font-bold block">{formatPrice(news.reg)}</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(news.offer)}</span>
                      </div>
                      <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2.5 py-0.5 rounded-lg">
                        Save {getDiscountPercentage(news.reg, news.offer)}% OFF
                      </span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleDirectOrder({ id: news.id, title: news.title, price: news.offer, regularPrice: news.reg })}
                        className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs rounded-xl hover:scale-102 transition cursor-pointer"
                      >
                        🗞️ Launch Portal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: ECOMMERCE DEVELOPMENT */}
        {(activeTab === 'all' || activeTab === 'websites') && (
          <div className="space-y-6 scroll-mt-24">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono font-black text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full">
                🚀 Dynamic Enterprise Systems
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2.5 dark:text-white">
                Ecommerce & Custom Portal Development
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {portalOffers.map(port => (
                <div 
                  key={port.id} 
                  className="rounded-[24px] bg-white dark:bg-[#0F172A] border border-slate-200/60 dark:border-white/8 p-6 flex flex-col justify-between relative transition-all duration-300 hover:scale-102 shadow-sm"
                >
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {port.title}
                      </h3>
                      <p className="text-[10.5px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Architecture</p>
                    </div>

                    <ul className="space-y-2.5">
                      {port.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 space-y-4">
                    {port.custom ? (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Custom Quote Required</p>
                        <button 
                          onClick={() => handleWhatsAppOrder({ title: 'Bespoke Custom Portal Quote', price: 29990 })}
                          className="w-full py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white font-black text-xs rounded-xl hover:scale-102 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          💬 Get Instant Quote
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-end justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 line-through font-bold block">{formatPrice(port.reg)}</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(port.offer)}</span>
                          </div>
                          <span className="bg-rose-500/10 text-rose-500 text-[8.5px] font-black px-2 py-0.5 rounded-full">
                            -{getDiscountPercentage(port.reg, port.offer)}% OFF
                          </span>
                        </div>

                        <button 
                          onClick={() => handleDirectOrder({ id: port.id, title: port.title, price: port.offer, regularPrice: port.reg })}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black text-xs rounded-xl hover:scale-102 transition cursor-pointer"
                        >
                          💻 Setup Portal
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SECTION 8: WHY CHOOSE WEBZONEBD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12 bg-white/40 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-900 rounded-3xl">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-widest uppercase font-mono font-black text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
            🏆 Industry Grade SLA
          </span>
          <h2 className="text-3xl font-black tracking-tight mt-3 dark:text-white">
            Why Choose WebZoneBD
          </h2>
          <p className="text-slate-505 text-xs sm:text-sm dark:text-slate-400 mt-1 max-w-2xl mx-auto">
            We are your ultimate digital growth partner, delivering high quality custom software solutions in Bangladesh & Saudi Arabia.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: 'Mobile Responsive', text: 'All packages render perfectly across mobile devices and tablets.', icon: '📱' },
            { title: 'Fast Loading', text: 'Optimized speed with LiteSpeed and SSD caching architectures.', icon: '⚡' },
            { title: 'Free SSL Security', text: 'Free SSL certificate standard to ensure safe client connections.', icon: '🔒' },
            { title: 'Modern UI Design', text: 'Premium, conversion-focused layout inspired by Stripe and Vercel.', icon: '🎨' },
            { title: 'Admin Control Panel', text: 'Full CMS dashboard to update text and media elements easily.', icon: '⚙️' },
            { title: 'WhatsApp Support', text: 'Instant support channel to resolve IT operations leads promptly.', icon: '💬' },
            { title: 'Lifetime Tech Support', text: 'We offer support to guarantee 100% active operational uptime.', icon: '🛠️' },
            { title: 'BD & SA Support Local', text: 'On-site local support across Bangladesh & Saudi Arabia regions.', icon: '🇧🇩 🇸🇦' },
          ].map((feat, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/50 dark:border-white/5 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <span className="text-2xl block mb-3">{feat.icon}</span>
              <h4 className="text-xs sm:text-sm font-black dark:text-white text-slate-900 mb-1">{feat.title}</h4>
              <p className="text-[10.5px] leading-relaxed text-slate-400 font-medium">{feat.text}</p>
            </div>
          ))}
        </div>
      </div>



      {/* SECTION 9: CUSTOMER REVIEWS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <span className="text-[10px] tracking-widest uppercase font-mono font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
            ⭐ Client Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3 dark:text-white">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sajid Al Rahman', role: 'Founder, DeshMart', text: 'Purchased the Ecommerce Growth Combo. WebzoneBD handled Bkash/Nagad automatic payments. Incredible conversion rates!', stars: 5 },
            { name: 'Al-Anazi Khalid', role: 'MD, Riyadh Traders', text: 'Highly impressed by their local Saudi support module. Fast delivery, beautiful responsive designs.', stars: 5 },
            { name: 'Dr. Sabrina Haque', role: 'CEO, MedLife Solutions', text: 'Superb support SLA. The professional company portal was delivered with 100% full admin control access.', stars: 5 }
          ].map((test, i) => (
            <div 
              key={i} 
              className="p-6 rounded-[24px] bg-white dark:bg-[#0F172A] border border-slate-200/50 dark:border-white/5 shadow-sm space-y-4 text-left relative"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: test.stars }).map((_, sIdx) => (
                  <Star key={sIdx} className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 italic font-semibold leading-relaxed">
                "{test.text}"
              </p>
              <div>
                <h4 className="text-xs font-black dark:text-white text-slate-900 leading-none">{test.name}</h4>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">{test.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 10: FREQUENTLY ASKED QUESTIONS */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-[10px] tracking-widest uppercase font-mono font-black text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
            ❓ FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const [open, setOpen] = useState(idx === 0);
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full p-5 text-left font-extrabold text-xs sm:text-sm flex items-center justify-between gap-4 dark:text-white text-slate-950 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronRight className={`w-4 h-4 text-violet-500 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 11: FINAL CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent border border-violet-500/20 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <span className="inline-block bg-rose-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full animate-bounce">
              ⏳ Slots are limited!
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none dark:text-white">
              🔥 Offer Ends Soon!
            </h2>
            <p className="text-slate-505 text-xs sm:text-sm dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              Claim Your Discount Before Time Runs Out. Book with confidence.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  const el = document.getElementById('mega-combos-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl text-xs font-black tracking-wide text-white bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-102 transition shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                🛒 Order Now
              </button>
              <button
                onClick={() => handleWhatsAppOrder({ title: 'Standard Combo Package Inquiry', price: 9990 })}
                className="px-6 py-3.5 rounded-xl text-xs font-black tracking-wide text-white bg-[#25D366] hover:bg-[#128C7E] hover:scale-102 transition shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <span>💬 WhatsApp Order</span>
              </button>
              <button
                onClick={() => handleWhatsAppOrder({ title: 'Free Campaign Consultation', price: 0 })}
                className="px-6 py-3.5 rounded-xl text-xs font-black tracking-wide text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition shadow-sm"
              >
                Get Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ORDER/CLAIM FORM OVERLAY */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#0F172A] border border-slate-200/50 dark:border-white/10 rounded-[20px] p-6 max-w-md w-full shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              {/* Modal close icon */}
              <button 
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-violet-500 uppercase font-mono font-black tracking-widest bg-violet-500/10 px-2 py-0.5 rounded">
                    Booking Campaign
                  </span>
                  <h3 className="text-xl font-black mt-2 dark:text-white">
                    Claim {selectedPackage.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold mt-1">
                    Locked Promo Price: <span className="text-[#EC4899] font-black">{formatPrice(selectedPackage.price)}</span>
                  </p>
                </div>

                {/* Form Elements with Floating Labels & Custom UI Requirements */}
                <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
                  
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold tracking-tight dark:text-slate-300 text-slate-600 block">
                      YOUR FULL NAME <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full h-14 px-4 rounded-[14px] font-semibold text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/15 transition-all outline-none text-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold tracking-tight dark:text-slate-300 text-slate-600 block">
                      WHATSAPP MOBILE NUMBER <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +8801700000000"
                      required
                      className="w-full h-14 px-4 rounded-[14px] font-semibold text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/15 transition-all outline-none text-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold tracking-tight dark:text-slate-300 text-slate-600 block">
                      EMAIL ADDRESS (OPTIONAL)
                    </label>
                    <input 
                      type="email" 
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. contact@domain.com"
                      className="w-full h-14 px-4 rounded-[14px] font-semibold text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/15 transition-all outline-none text-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Notes Area */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold tracking-tight dark:text-slate-300 text-slate-600 block">
                      SPECIAL INSTRUCTIONS / DESIGN REQUIREMENTS
                    </label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Describe specific website pages, branding or hosting details..."
                      rows={3}
                      className="w-full p-4 rounded-[14px] font-semibold text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/15 transition-all outline-none resize-none text-slate-950 dark:text-white"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[54px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-black tracking-wide text-xs hover:scale-102 transition shadow-lg shadow-violet-500/25 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>🚀 Claim Offer & Confirm via WhatsApp</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleWhatsAppOrder(selectedPackage)}
                      className="w-full py-3 bg-[#25D366] text-white font-black text-xs rounded-xl hover:bg-[#128C7E] transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>💬 Direct WhatsApp Order</span>
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXIT INTENT PROMO POPUP */}
      <AnimatePresence>
        {showExitPopup && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] text-white border border-violet-500/30 rounded-[24px] p-8 max-w-md w-full shadow-2xl relative text-center"
            >
              <button 
                onClick={() => setShowExitPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer text-xs"
              >
                ✕
              </button>

              <div className="space-y-6">
                <span className="text-[10px] bg-rose-500 text-white font-black uppercase px-3 py-1 rounded-full inline-block animate-bounce">
                  Wait! Special Gift Inside 🎁
                </span>

                <h3 className="text-2xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-[#A855F7] to-[#EC4899]">
                  Claim Extra 5% Direct Discount!
                </h3>
                <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                  Apply Coupon <span className="bg-white/15 px-2.5 py-1 rounded text-white font-mono font-black text-xs">MEGAFEST5</span> on checkout to save an additional 5% off on all business packages!
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowExitPopup(false);
                      triggerToast('MEGAFEST5 Coupon code copied! Apply during checkout.');
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-black text-xs rounded-xl hover:scale-102 transition cursor-pointer"
                  >
                    Copy Coupon Code
                  </button>
                  <button
                    onClick={() => {
                      setShowExitPopup(false);
                      handleWhatsAppOrder({ title: 'Special Extra 5% Coupon Inquiry', price: 9490 });
                    }}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-white font-black text-xs rounded-xl transition cursor-pointer"
                  >
                    Chat with Expert
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
