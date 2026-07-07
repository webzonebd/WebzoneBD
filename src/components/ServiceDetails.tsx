import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Star, Phone, Check, Send, Sparkles, MessageSquare, 
  Layers, Clock, ShieldCheck, Mail, Globe, CheckCircle2, Award, 
  HelpCircle, ChevronDown, ChevronUp, FileText, ShoppingBag, Info, 
  User, Database, Terminal, CheckCircle, ChevronRight, Play, Paperclip, AlertCircle
} from 'lucide-react';
import { Service, Language, Theme, Order, Currency } from '../types';

interface ServiceDetailsProps {
  service: any; // CatalogService type
  language: Language;
  theme: Theme;
  currency: Currency;
  onBack: () => void;
  onNavigateToService: (srvId: string) => void;
  allServices: any[];
  addSimulatedServiceOrder: (order: Order) => void;
  triggerToast: (msg: string) => void;
  addToCart?: (product: any) => void;
  setCartOpen?: (open: boolean) => void;
  onOrderWhatsApp?: (serviceName: string, packageName?: string) => void;
  onRequestQuotation?: (serviceName: string, packageName?: string) => void;
}

export default function ServiceDetails({
  service,
  language,
  theme,
  currency,
  onBack,
  onNavigateToService,
  allServices,
  addSimulatedServiceOrder,
  triggerToast,
  addToCart,
  setCartOpen,
  onOrderWhatsApp,
  onRequestQuotation
}: ServiceDetailsProps) {
  const isDark = theme === 'dark';
  const [activePackageTab, setActivePackageTab] = useState<'starter' | 'professional' | 'business'>('professional');
  const [advancePercent, setAdvancePercent] = useState<30 | 50 | 100>(100);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [currentTimelineStep, setCurrentTimelineStep] = useState<number>(0);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'customer' | 'admin';
    name: string;
    text: string;
    time: string;
    avatar?: string;
    attachment?: { name: string; type: 'image' | 'pdf' | 'doc' | 'audio'; preview?: string; duration?: string };
  }>>([
    {
      id: 'msg-1',
      sender: 'admin',
      name: 'Imran (WebzoneBD Lead)',
      text: 'Welcome to your real-time project workspace. I have received your requirements and assigned our senior UX researcher and fullstack developer to your scope.',
      time: '12:30 PM',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'msg-2',
      sender: 'customer',
      name: 'Client',
      text: 'Thanks! I want to make sure we use React 19, tailwind for styling, and have a fully optimized admin dashboard.',
      time: '12:32 PM'
    },
    {
      id: 'msg-3',
      sender: 'admin',
      name: 'Sajib (Senior Dev)',
      text: 'Absolutely! Our standard stack is built on Vite + React 19 with custom atomic state containment. Take a look at the preliminary sitemap draft attached below.',
      time: '12:35 PM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      attachment: {
        name: 'Technical_Sitemap_Architecture_v1.pdf',
        type: 'pdf'
      }
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  
  // Audio Play State Simulation
  const [voicePlaying, setVoicePlaying] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [service.id]);

  const pricingTiers = {
    starter: {
      name: language === 'bn' ? 'স্টার্টার প্যাক' : 'Starter MVP',
      price: service.starterPrice || Math.round(service.startingPrice * 0.8),
      delivery: '3-5 Days',
      support: '30 Days Priority Support',
      revisions: '5 Rounds Revisions',
      features: [
        'Essential UX Page Layout',
        'Fully Responsive Mobile-First Design',
        'Standard Performance Caching',
        'Contact Form Integration',
        'Basic SEO Meta Tag Setup'
      ]
    },
    professional: {
      name: language === 'bn' ? 'প্রফেশনাল প্যাক' : 'Professional Growth',
      price: service.businessPrice || service.professionalPrice || Math.round(service.startingPrice * 1.2),
      delivery: '7-10 Days',
      support: '180 Days VIP Support',
      revisions: 'Unlimited Revisions',
      features: [
        'Premium Custom Creative Layouts',
        'Optimized Content cluster / SEO Ready',
        'Full Admin Control Dashboard Panel',
        'WhatsApp & SMS Alert Triggers',
        'Speed optimization score 90+ (Lighthouse)',
        '1 Year Safe NVMe Web Hosting'
      ]
    },
    business: {
      name: language === 'bn' ? 'বিজনেস প্যাক' : 'Enterprise Scale SaaS',
      price: service.enterprisePrice || Math.round(service.startingPrice * 2.1),
      delivery: '14-20 Days',
      support: '365 Days Dev SLA Line Support',
      revisions: 'Lifetime Custom Revisions',
      features: [
        'Custom Web App Built From Scratch',
        'Multiple payment gateways (bKash/SSL/Stripe)',
        'Full Database Schema Backups',
        'API proxy routes integration',
        'Lighthouse Speed score 98+ Guaranteed',
        'Android WebApp Wrapper APK included'
      ]
    }
  };

  const getFormatPrice = (val: number) => {
    const rate = currency === 'BDT' ? 115 : currency === 'SAR' ? 3.75 : 1;
    const symbol = currency === 'BDT' ? '৳' : currency === 'SAR' ? 'SAR ' : '$';
    return `${symbol}${Math.round(val * rate).toLocaleString()}`;
  };

  const overviewFeatures = [
    { id: 'perf', title: 'Fast Performance', icon: <Sparkles className="w-5 h-5 text-[#00E5FF]" />, desc: 'Page load times below 1.2 seconds with server-side compression & optimized state engine.' },
    { id: 'resp', title: 'Mobile Responsive', icon: <Layers className="w-5 h-5 text-[#3B82F6]" />, desc: 'Fluid layout adjustments with touch target compliance for all current smartphones.' },
    { id: 'seo', title: 'SEO Optimized', icon: <Award className="w-5 h-5 text-[#7C3AED]" />, desc: 'Valid semantic HTML tags, Google Search Console pre-indexing, mapping schemas, and speed boosts.' },
    { id: 'sec', title: 'Secure & Reliable', icon: <ShieldCheck className="w-5 h-5 text-[#EC4899]" />, desc: 'Hardened against custom SQL injection, Cross-Site Scripting (XSS), and automated crawlers.' }
  ];

  const timelineSteps = [
    { title: 'Requirements Collection', desc: 'Detailed consultation to aggregate targeted brand guidelines & scope specs.' },
    { title: 'Planning & Analysis', desc: 'Defining database architectures, route indices, and framework layout blueprints.' },
    { title: 'UI/UX Design', desc: 'Crafting pixel-perfect interactive high-fidelity Figma styles with color guides.' },
    { title: 'Development', desc: 'Active secure backend and frontend assembly utilizing React 19 + Fast Modules.' },
    { title: 'Internal Testing', desc: 'Rigorous isolated unit script reviews, responsiveness validation, and broken link scans.' },
    { title: 'Quality Assurance', desc: 'Lighthouse speed threshold audits, cross-browser caching validation, security checks.' },
    { title: 'Client Review', desc: 'Deploying to staging server for dynamic customer feedback and visual tweaks.' },
    { title: 'Final Delivery', desc: 'Packaging all GPL codebase, source vector SVG assets, or production cloud push.' },
    { title: 'Project Completion', desc: '100% complete handover with step-by-step custom admin video training guides.' }
  ];

  const devPhases = [
    {
      title: 'Phase 1: Design Prototype & Architecture Design',
      status: 'Passed Client Review',
      progress: 100,
      team: 'Fahmida Akhter (Senior UX Designer), Sajib Ahmed (Fullstack Architect)',
      notes: 'Final designs for desktop, tablet, and mobile layouts are fully approved by client. Wireframes completed.',
      qa: 'Lighthouse target layout score: 100%. Contrast ratios verify WCAG compliance guidelines.',
      files: ['Figma_UX_Prototype_Approved.fig', 'Database_Schema_Architecture.pdf']
    },
    {
      title: 'Phase 2: Core Development & Integration Routing',
      status: 'Active Coding Sprint',
      progress: 75,
      team: 'Rashedul Islam (Lead React developer), Imran Hasan (System Engineer)',
      notes: 'Frontend is fully static completed. Backend database connections & API proxy controllers are being integrated now.',
      qa: 'React performance logs: Zero unhandled re-renders. Unit testing passes: 34 out of 34 cases green.',
      files: ['Staging_Alpha_Build_Logs.txt']
    },
    {
      title: 'Phase 3: Quality Audits & Search Engine Readiness',
      status: 'Scheduled',
      progress: 0,
      team: 'Zayed Al-Harbi (QA Auditor), Arif Alom (SEO Specialist)',
      notes: 'SSL handshakes, custom caching indexes, robot configurations, sitemaps validation, and schema markup deployments will start once code freeze completes.',
      qa: 'Pending code freeze milestone completion.',
      files: []
    }
  ];

  const activityTimeline = [
    { text: 'Project Initiated & Portal Provisioned', status: 'done', date: 'June 01, 2026' },
    { text: 'Secured Payment Confirmed through SSL', status: 'done', date: 'June 02, 2026' },
    { text: 'Onboarding Consultation Call Completed', status: 'done', date: 'June 03, 2026' },
    { text: 'Aesthetic Figma Mockups Approved by Client', status: 'done', date: 'June 05, 2026' },
    { text: 'Development Server Active at Staging Hub', status: 'active', date: 'June 06, 2026 (Today)' },
    { text: 'Final Delivery & Handover Milestone', status: 'pending', date: 'June 10, 2026' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      id: "msg-" + Date.now(),
      sender: 'customer' as const,
      name: 'You (Client)',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Simulated reply from lead after 1.5s
    setTimeout(() => {
      const reply = {
        id: "msg-" + (Date.now() + 1),
        sender: 'admin' as const,
        name: 'Imran (WebzoneBD Lead)',
        text: 'Received! Let me relay this adjustment specs immediately to Rashedul from our development wing. We will update the staging draft by tonight.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };
      setChatMessages(prev => [...prev, reply]);
      triggerToast("WebzoneBD Support Agent is replying...");
    }, 1500);
  };

  const handleOrderSubmit = () => {
    const selectedTier = pricingTiers[activePackageTab];
    const calculatedAdvance = Math.round(selectedTier.price * (advancePercent / 100));
    const calculatedDue = selectedTier.price - calculatedAdvance;
    
    // 1. Log simulated database order for audit registry
    const orderDetails: Order = {
      id: 'ord-wb-' + Math.floor(100000 + Math.random() * 900000),
      serviceId: service.id,
      itemTitle: `${service.title} (${selectedTier.name})`,
      price: selectedTier.price,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Instant Secure Check',
      paymentStatus: 'pending',
      advancePercent: advancePercent,
      advanceAmount: calculatedAdvance,
      dueAmount: calculatedDue
    };
    addSimulatedServiceOrder(orderDetails);

    // 2. Add as client item to real shopping cart
    if (addToCart) {
      const packageProductRepresentation = {
        id: `srv-${service.id}-${activePackageTab}`,
        name: `${service.title} (${selectedTier.name})`,
        nameBn: `${service.titleBn || service.title} (${selectedTier.name})`,
        nameAr: `${service.titleAr || service.title} (${selectedTier.name})`,
        category: 'source',
        price: selectedTier.price,
        discountPrice: undefined,
        rating: service.rating || 5.0,
        reviewsCount: service.projectsCompleted || 100,
        description: service.shortDescription,
        descriptionBn: service.shortDescriptionBn || service.shortDescription,
        descriptionAr: service.shortDescriptionAr || service.shortDescription,
        features: selectedTier.features,
        featuresBn: selectedTier.features,
        featuresAr: selectedTier.features,
        image: service.image,
        demoUrl: 'https://demo.webzonebd.com',
        downloadUrl: 'https://webzonebd.com',
        tags: [service.category || 'Service'],
        views: 100,
        advancePercent: advancePercent,
        advanceAmount: calculatedAdvance,
        dueAmount: calculatedDue
      };

      addToCart(packageProductRepresentation);

      // 3. Open ShoppingCart tray immediately
      if (setCartOpen) {
        setCartOpen(true);
      }
    } else {
      triggerToast(language === 'bn' 
        ? 'আপনার অর্ডার তৈরি করা হয়েছে! কাস্টমার টিম এখনই হোয়াটসঅ্যাপে যোগাযোগ করবে।' 
        : 'Order request created successfully! Our deployment manager is checking specs.');
    }
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName || !consultPhone) {
      triggerToast('Please provide your name and contact mobile.');
      return;
    }
    triggerToast('Appointment scheduled! An agent will call you within 15 minutes.');
    setIsConsultationModalOpen(false);
    setConsultName('');
    setConsultPhone('');
  };

  return (
    <div className={`relative min-h-screen pb-20 select-none overflow-hidden font-sans transition-colors duration-300 ${isDark ? 'bg-[#020617] text-white' : 'bg-slate-50 text-neutral-800'}`}>
      {/* 1. ANIMATED GRADIENT MESH BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-radial from-[#7C3AED]/25 via-transparent to-transparent blur-3xl opacity-60 animate-pulse duration-[10s]" />
        <div className="absolute -right-[20%] top-[10%] w-[70%] h-[70%] rounded-full bg-radial from-[#00E5FF]/20 via-transparent to-transparent blur-3xl opacity-50" />
        <div className="absolute left-[10%] bottom-[10%] w-[60%] h-[60%] rounded-full bg-radial from-[#EC4899]/15 via-transparent to-transparent blur-3xl opacity-40 animate-pulse duration-[8s]" />
        
        {/* Floating Neon Particles Grid */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-cyan-400"
              style={{
                top: `${(i * 11) % 100}%`,
                left: `${(i * 19) % 100}%`,
                boxShadow: '0 0 8px #00E5FF',
                animation: `float 8s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1.5">
        {/* Breadcrumb Navigation Area */}
        <div className={`flex items-center justify-between mb-8 text-xs font-mono select-none backdrop-blur-md border p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-900/40 border-slate-800/40' : 'bg-white border-slate-200 shadow-xs'}`}>
          <button 
            onClick={onBack}
            className={`group flex items-center gap-1.5 hover:underline cursor-pointer font-bold transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-650'}`}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{language === 'bn' ? 'সকল সার্ভিস' : 'All Services'}</span>
          </button>
          <span className={`${isDark ? 'text-slate-505' : 'text-neutral-400'} hidden sm:inline`}>/</span>
          <span className={`${isDark ? 'text-slate-300' : 'text-neutral-700'} font-extrabold truncate max-w-xs`}>{service.title}</span>
          <span className="bg-[#00E5FF]/10 text-[#00E5FF] font-black px-2 py-0.5 rounded text-[9px] tracking-wider uppercase border border-[#00E5FF]/15">
            SaaS Pro Details
          </span>
        </div>

        {/* CONTAINER GRID: Dynamic Left Content Frame (Col 8) & Sticky Desktop Sidebar on Right (Col 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA CONTAINER (8 Columns max width) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* ========================================= HERO SECTION ========================================= */}
            <div className={`relative rounded-3xl overflow-hidden border p-6 md:p-10 text-left backdrop-blur-xl shadow-2xl transition-all ${isDark ? 'border-white/10 bg-slate-950/40' : 'border-neutral-200 bg-white shadow-sm'}`}>
              <div className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xs" style={{ backgroundImage: `url(${service.image})` }} />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/15 blur-xl rounded-full pointer-events-none" />
              
              <div className="relative z-10 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-[9px] font-black font-mono uppercase rounded-full tracking-wider shadow-[0_0_10px_rgba(236,72,153,0.3)] text-white">
                    {service.category || 'IT SERVICE'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                    <span>{service.rating || '4.9'} Verified (120+ Audits)</span>
                  </span>
                </div>

                <h1 className={`text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight font-display transition-colors ${isDark ? 'bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent' : 'text-slate-900'}`}>
                  {language === 'bn' ? service.titleBn : service.title}
                </h1>

                <p className={`text-sm sm:text-base leading-relaxed max-w-2xl transition-colors ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                  {language === 'bn' ? service.shortDescriptionBn : service.shortDescription}
                </p>

                {service.fullDescription && (
                  <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl border-l-2 pl-3 transition-colors ${isDark ? 'text-slate-400 border-slate-700/60' : 'text-slate-500 border-slate-300'}`}>
                    {language === 'bn' ? service.fullDescriptionBn : service.fullDescription}
                  </p>
                )}

                {/* Verified Techbari Source Info Board */}
                {service.id === 'srv-freelance-marketplace' && (
                  <div className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${isDark ? 'bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-indigo-50/50 border-indigo-200 shadow-xs'}`}>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <Globe className="w-5 h-5 animate-pulse" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500 font-mono">Verified Techbari® Script Asset</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Licensed under 100% GPL for Unlimited Domains usage</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                      {language === 'bn'
                        ? "এই প্রিমিয়াম পিএইচপি স্ক্রিপ্টটি বিখ্যাত টেকবাড়ি (Techbari) থেকে সোর্সকৃত এবং সম্পূর্ণ ভেরিফাইড ব্র্যান্ড লাইসেন্স সম্বলিত। চমৎকার এই সিস্টেমটি দিয়ে আপনি নিজের বা বায়ারের জন্য একটি পরিপূর্ণ ফ্রিল্যান্সিং সার্ভিসেস ডেক্স দাঁড় করাতে পারবেন।"
                        : "This premium multi-vendor freelancer platform script aligns exactly with the master-class Techbari product structures. Features include live project bidding milestones, local wallet integrations, instant microjob gig sales, and full admin dashboard oversight."
                      }
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <a
                        href="https://techbari.com/product/freelance-marketplace-php-script-download"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-lg transition-all hover:scale-[1.02] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Download Original Script Source (Techbari)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Performance stats row inside Hero */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className={`p-3 rounded-2xl border space-y-0.5 transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-neutral-150'}`}>
                    <span className={`text-[9px] font-mono block tracking-wider uppercase transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-500'}`}>Starting Price</span>
                    <span className={`text-base font-black font-mono transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>{getFormatPrice(service.startingPrice)}</span>
                  </div>
                  <div className={`p-3 rounded-2xl border space-y-0.5 transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-neutral-150'}`}>
                    <span className={`text-[9px] font-mono block tracking-wider uppercase transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-500'}`}>Average SLA Delivery</span>
                    <span className={`text-base font-black font-mono transition-colors ${isDark ? 'text-[#3B82F6]' : 'text-indigo-600'}`}>{service.deliveryDays || '7'} Days</span>
                  </div>
                  <div className={`p-3 rounded-2xl border space-y-0.5 col-span-2 sm:col-span-1 transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-neutral-150'}`}>
                    <span className={`text-[9px] font-mono block tracking-wider uppercase transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-500'}`}>Completed Orders</span>
                    <span className={`text-base font-black font-mono transition-colors ${isDark ? 'text-[#EC4899]' : 'text-pink-600'}`}>{service.projectsCompleted || '350'}+</span>
                  </div>
                </div>

                {/* Hero Gradient Conversion CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <a 
                    href="https://wa.me/966570511931?text=Hello%20WebzoneBD%2C%20I%20need%20details%20on%20your%20services."
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 py-3 px-5 rounded-xl border transition-colors text-xs font-black flex items-center justify-center gap-1.5 ${isDark ? 'border-white/10 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Consultation</span>
                  </a>

                  <button 
                    onClick={() => setIsConsultationModalOpen(true)}
                    className={`flex-1 py-3 px-5 rounded-xl border border-dashed transition-all text-xs font-black cursor-pointer ${isDark ? 'border-[#00E5FF]/45 bg-[#00E5FF]/5 hover:bg-[#00E5FF]/10 text-[#00E5FF]' : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-650'}`}
                  >
                    📞 Free Consultation Call
                  </button>
                </div>
              </div>
            </div>



            {/* ========================================= TECHBARI STYLED SYSTEM DATA SHEET (DETAILED SPECS TABLE) ========================================= */}
            <div className={`p-5 md:p-6 rounded-3xl border text-left space-y-4 transition-colors ${isDark ? 'bg-slate-950/40 border-slate-800/80 shadow-xs' : 'bg-white border-neutral-200'}`}>
              <div>
                <h4 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>{language === 'bn' ? 'সিস্টেম স্পেসিফিকেশন ও সামঞ্জস্যতা' : 'TECHNICAL SPECS & COMPATIBILITY SHEET'}</h4>
                <h3 className={`text-base font-black mt-0.5 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{language === 'bn' ? 'স্ক্রিপ্ট ও সার্ভিস ফাইলের বিবরণ' : 'Detailed Codebase Core Characteristics'}</h3>
                <p className={`text-[11px] mt-1 transition-colors ${isDark ? 'text-slate-450' : 'text-slate-405'}`}>
                  {language === 'bn' ? 'ওয়েব জোন বিডি এর মাধ্যমে আপনার সার্ভিসটি অত্যন্ত হালকা ও অত্যন্ত দ্রুতগতির করার প্রযুক্তিগত সমাধান এখানে দেখুন।' : 'Review the modular architecture benchmark parameters designed for enterprise performance.'}
                </p>
              </div>

              <div className={`border rounded-2xl overflow-hidden text-xs mt-3 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                {[
                  { 
                    k: language === 'bn' ? 'ব্যাকএন্ড ফ্রেমওয়ার্ক' : 'Server Engine', 
                    v: service.id === 'srv-freelance-marketplace' ? 'PHP 8.2+ Object Oriented Engine' : 'NodeJS Express compiled with Bun' 
                  },
                  { 
                    k: language === 'bn' ? 'ফ্রন্টএন্ড লাইব্রেরি' : 'UI Stack', 
                    v: service.id === 'srv-freelance-marketplace' ? 'Bootstrap 5, jQuery, Tailwind CSS utility layers' : 'React 19 & Tailwind CSS v4' 
                  },
                  { 
                    k: language === 'bn' ? 'ডেটাবেজ ও ওআরএম' : 'Database Client', 
                    v: service.id === 'srv-freelance-marketplace' ? 'MySQL 8 / relational query builder indexes' : 'PostgreSQL or SQLite configured with Drizzle Kit' 
                  },
                  { k: language === 'bn' ? 'লাইসেন্স ক্যাটাগরি' : 'License Status', v: 'GPL 100% Open Source (Self-Owned Unlimited Resell)' },
                  { 
                    k: language === 'bn' ? 'ইন্সটলেশন সিস্টেম' : 'Setup Script', 
                    v: service.id === 'srv-freelance-marketplace' ? 'cPanel server auto-install file setup configuration' : 'cPanel Git Integration Auto-Deploy script included' 
                  },
                  { k: language === 'bn' ? 'নিরাপত্তা ও এসইও' : 'Core Audits', v: 'SQL Injection Proof, CSRF guards, Schema.org pre-indexed' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`grid grid-cols-5 p-3 px-4 transition-colors border-b last:border-0 ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/20' : 'bg-slate-50/50') : ''} ${isDark ? 'border-slate-800/40' : 'border-slate-200'}`}
                  >
                    <span className="col-span-2 font-bold text-[10.5px] text-slate-400 tracking-wide font-mono uppercase">{item.k}</span>
                    <span className={`col-span-3 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================= SERVICE OVERVIEW (SaaS GLASS CARDS) ========================================= */}
            <div className="space-y-4 text-left">
              <h3 className={`text-lg md:text-xl font-bold flex items-center gap-1.5 transition-colors ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-[#00E5FF]' : 'text-cyan-600'}`} />
                <span>Service Blueprint & Performance Metrics</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {overviewFeatures.map((o) => (
                  <div 
                    key={o.id} 
                    className={`p-5 rounded-2xl border transition-all hover:scale-101 duration-300 group shadow-sm text-left relative ${isDark ? 'bg-slate-900/40 border-slate-800/60 hover:border-[#00E5FF]/30' : 'bg-white border-neutral-200 hover:border-blue-500/30'}`}
                  >
                    <div className="absolute -top-1.5 -right-1.5 w-16 h-16 bg-gradient-to-tr from-transparent to-white/5 opacity-0 group-hover:opacity-100 rounded-tr-2xl transition animate-pulse" />
                    <div className={`p-2.5 rounded-xl inline-block mb-3 border transition-colors ${isDark ? 'bg-slate-800/60 border-slate-700/30 group-hover:shadow-[0_0_12px_rgba(0,229,255,0.2)]' : 'bg-slate-50 border-neutral-150'}`}>
                      {o.icon}
                    </div>
                    <h4 className={`font-extrabold text-sm transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>
                      {o.title}
                    </h4>
                    <p className={`text-[11px] leading-relaxed mt-1 transition-colors ${isDark ? 'text-slate-450' : 'text-neutral-600'}`}>{o.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================= PREMIUM CHECKLIST SECTION ========================================= */}
            <div className={`p-6 rounded-2xl border text-left space-y-4 transition-colors ${isDark ? 'bg-slate-950/50 border-slate-800/80 shadow-2xl' : 'bg-white border-neutral-200 shadow-sm'}`}>
              <div>
                <h4 className={`text-sm font-mono font-bold uppercase tracking-widest ${isDark ? 'text-[#EC4899]' : 'text-pink-600'}`}>Included Baseline Specifications</h4>
                <h3 className={`text-base sm:text-lg font-black mt-0.5 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>What is Bundled with this Service?</h3>
                <p className={`text-[10.5px] transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-4`}>
                  Every service specification is customized for premium quality standard workflows.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {[
                    'Full Server / Environment Configuration & setup support',
                    '100% Unique custom premium layouts with beautiful UX',
                    'Optimized Mobile responsive structure for modern screens',
                    'Baseline on-page SEO keywords indexing mapping',
                    'Social Media communication widget embeds (WhatsApp)',
                    'Modular lightweight compiled codebases in clean packages',
                    'Step-by-step user dashboard walkthrough training videos'
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-start gap-2 p-2.5 rounded-xl border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800/40' : 'bg-slate-50 border-slate-100'}`}>
                      <Check className="w-4 h-4 text-emerald-500 font-black mt-0.5 shrink-0" />
                      <span className={`font-medium font-sans leading-normal transition-colors ${isDark ? 'text-slate-350' : 'text-neutral-700'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================= PRICING PLANS COMPACT BOXES ========================================= */}
            <div className="space-y-6 text-left">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 transition-colors ${isDark ? 'border-slate-800' : 'border-neutral-200'}`}>
                <div>
                  <h3 className={`text-lg md:text-xl font-bold flex items-center gap-1.5 transition-colors ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    <Layers className={`w-5 h-5 ${isDark ? 'text-[#7C3AED]' : 'text-violet-600'}`} />
                    <span>Select Pricing Packages</span>
                  </h3>
                  <p className={`text-[11px] font-sans transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-500'}`}>Pick the perfect delivery container customized for your business tier scope.</p>
                </div>

                <div className={`flex p-1 border rounded-xl transition-all ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-neutral-200 shadow-inner'}`}>
                  {['starter', 'professional', 'business'].map((tierKey) => (
                    <button
                      key={tierKey}
                      onClick={() => setActivePackageTab(tierKey as any)}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${activePackageTab === tierKey ? 'bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white shadow-xs' : `${isDark ? 'text-slate-400 hover:text-white' : 'text-neutral-550 hover:text-neutral-900'}`}`}
                    >
                      {tierKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single Detailed Pricing Card */}
              <div className={`p-6 rounded-2xl backdrop-blur-md border relative overflow-hidden text-left space-y-4 transition-all ${isDark ? 'bg-slate-900/30 border-[#3B82F6]/20' : 'bg-white border-neutral-200 shadow-md'}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-transparent to-cyan-500/10 rounded-tr-2xl pointer-events-none" />
                
                <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b transition-colors ${isDark ? 'border-slate-805' : 'border-neutral-150'}`}>
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 text-[#00E5FF] text-[9px] font-bold tracking-wider font-mono uppercase rounded-md border border-[#00E5FF]/20">
                      🎁 Standard escrow verified
                    </span>
                    <h4 className={`text-xl font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{pricingTiers[activePackageTab].name}</h4>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] uppercase font-mono tracking-widest block transition-colors ${isDark ? 'text-slate-400' : 'text-slate-505'}`}>Estimated Cost</span>
                    <span className={`text-2.5xl font-black font-mono transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>{getFormatPrice(pricingTiers[activePackageTab].price)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
                  <div className={`flex items-center gap-1.5 p-2 rounded-xl border transition-colors ${isDark ? 'bg-slate-900/60 border-slate-800/40 text-slate-300' : 'bg-slate-50 border-neutral-200 text-neutral-650'}`}>
                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                    <span>SLA Delivery: {pricingTiers[activePackageTab].delivery}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-2 rounded-xl border transition-colors ${isDark ? 'bg-slate-900/60 border-slate-800/40 text-slate-300' : 'bg-slate-50 border-neutral-200 text-neutral-650'}`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>{pricingTiers[activePackageTab].support}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-2 rounded-xl border transition-colors ${isDark ? 'bg-slate-900/60 border-slate-800/40 text-slate-300' : 'bg-slate-50 border-neutral-200 text-neutral-650'}`}>
                    <Award className="w-3.5 h-3.5 text-purple-500" />
                    <span>{pricingTiers[activePackageTab].revisions}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <span className={`text-[9.5px] font-bold font-mono tracking-wider block uppercase transition-colors ${isDark ? 'text-slate-400' : 'text-slate-505'}`}>Features Included:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {pricingTiers[activePackageTab].features.map((feat, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-xs transition-colors ${isDark ? 'text-slate-350' : 'text-neutral-600'}`}>
                        <Check className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 💳 Advance Payment Options */}
                <div className={`p-4 rounded-xl border space-y-3 transition-all ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-neutral-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-sans transition-colors ${isDark ? 'text-slate-200' : 'text-neutral-700'}`}>
                      {language === 'bn' ? 'অ্যাডভান্স পেমেন্ট অপশন' : 'Advance Payment Option'}
                    </span>
                    <span className="text-[10px] text-pink-500 font-mono font-bold">
                      {language === 'bn' ? 'অগ্রিম পেমেন্ট নির্বাচন করুন' : 'Select escrow advance'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[30, 50, 100].map((percent) => {
                      const isActive = advancePercent === percent;
                      return (
                        <button
                          key={percent}
                          type="button"
                          onClick={() => setAdvancePercent(percent as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer hover:scale-[1.02] ${
                            isActive
                              ? 'border-transparent bg-gradient-to-r from-[#7C3AED]/10 via-[#A855F7]/10 to-[#EC4899]/10 text-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.15)] ring-1 ring-[#7C3AED]/40'
                              : isDark
                              ? 'border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-305'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                              isActive 
                                ? 'border-[#7C3AED] bg-gradient-to-r from-[#7C3AED] to-[#EC4899]' 
                                : isDark ? 'border-slate-750' : 'border-slate-300'
                            }`}>
                              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-black font-mono">{percent}%</span>
                          </div>
                          <span className="text-[10px] font-bold">
                            {percent === 100 
                              ? (language === 'bn' ? 'ফুল পেমেন্ট' : 'Full Pay') 
                              : (language === 'bn' ? 'অ্যাডভান্স' : 'Advance')
                            }
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className={`pt-2.5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-medium ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-neutral-600'}`}>
                    <div>
                      {language === 'bn' ? (
                        <span>
                          অগ্রিম প্রদেয় ({advancePercent}%): <strong className="text-emerald-500 font-mono font-black">{getFormatPrice(Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))}</strong>
                        </span>
                      ) : (
                        <span>
                          Advance Payable ({advancePercent}%): <strong className="text-emerald-500 font-mono font-black">{getFormatPrice(Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))}</strong>
                        </span>
                      )}
                    </div>
                    {advancePercent < 100 && (
                      <div className="font-mono text-[10px]">
                        {language === 'bn' ? (
                          <span>বকেয়া (Due): <span className="text-amber-500 font-extrabold">{getFormatPrice(pricingTiers[activePackageTab].price - Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))}</span></span>
                        ) : (
                          <span>Due Remaining: <span className="text-amber-500 font-extrabold">{getFormatPrice(pricingTiers[activePackageTab].price - Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))}</span></span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleOrderSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] hover:opacity-95 text-xs text-white md:text-slate-950 font-black rounded-xl text-center active:scale-95 transition cursor-pointer"
                  >
                    🚀 {advancePercent < 100 
                      ? (language === 'bn' ? `অর্ডার করুন • অগ্রিম ${advancePercent}% (${getFormatPrice(Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))})` : `Order Now • Advance ${advancePercent}% (${getFormatPrice(Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))})`)
                      : (language === 'bn' ? `অর্ডার করুন (${getFormatPrice(pricingTiers[activePackageTab].price)})` : `Order Now (${getFormatPrice(pricingTiers[activePackageTab].price)})`)}
                  </button>

                  <a 
                    href={`https://wa.me/966570511931?text=Hello%20WebzoneBD%2C%2520I%2520am%2520interested%2520in%2520the%2520${service.title}%2520-${pricingTiers[activePackageTab].name}%252520package.`}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 py-3 border text-xs font-extrabold rounded-xl text-center flex items-center justify-center gap-1 transition-all ${isDark ? 'border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-white' : 'border-neutral-200 bg-slate-50 hover:bg-slate-100 text-slate-800'}`}
                  >
                    <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>Initiate WhatsApp Workspace Discuss</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ========================================= DEVELOPMENT PROCESS (9-STEP INTERACTIVE) ========================================= */}
            <div className={`p-6 rounded-2xl border text-left space-y-6 transition-colors ${isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-white border-neutral-200 shadow-xs'}`}>
              <div className="space-y-1">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? 'text-[#00E5FF]' : 'text-blue-650'}`}>Quality Assurance Timelines</span>
                <h3 className={`text-base sm:text-lg font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Interactive Deployment Roadmap</h3>
                <p className={`text-[10.5px] transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-550'}`}>Click any of our 9 development milestones below to preview its specific technical objectives and team checklist.</p>
              </div>

              {/* Progress Track line */}
              <div className="relative pt-2 pb-1">
                <div className="absolute top-5 left-2 right-2 h-1.5 bg-slate-850 rounded-full z-0" />
                <div 
                  className="absolute top-5 left-2 h-1.5 bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] rounded-full z-0 transition-all duration-500"
                  style={{ width: `${(currentTimelineStep / 8) * 100}%` }}
                />

                <div className="relative flex justify-between z-10">
                  {timelineSteps.map((step, idx) => {
                    const isPassed = idx <= currentTimelineStep;
                    const isActive = idx === currentTimelineStep;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentTimelineStep(idx)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all cursor-pointer ${isActive ? 'bg-[#00E5FF] text-slate-950 scale-115 ring-4 ring-cyan-500/25 shadow-[0_0_12px_#00E5FF]' : isPassed ? 'bg-gradient-to-tr from-[#3B82F6] to-[#7C3AED] text-white' : `${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-neutral-600'}`}`}
                        title={step.title}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step info Box */}
              <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 duration-300 transition-colors ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-neutral-150'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cyan-400/10 text-cyan-500 rounded-md border border-cyan-400/20">Stage 0{currentTimelineStep + 1}</span>
                  <h4 className={`font-black text-sm transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{timelineSteps[currentTimelineStep].title}</h4>
                </div>
                <p className={`text-xs font-sans leading-relaxed transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-650'}`}>{timelineSteps[currentTimelineStep].desc}</p>
                <div className="flex gap-2 items-center text-[10px] text-emerald-500 font-mono mt-3 uppercase font-bold tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                  <span>SLA Audit verification active for current stage</span>
                </div>
              </div>
            </div>

            {/* ========================================= STATS COUNTERS ========================================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { count: '100+', label: 'Projects Handed Over', color: 'text-[#00E5FF]' },
                { count: '500+', label: 'Satisfied Global Clients', color: 'text-[#3B82F6]' },
                { count: '24/7', label: 'WhatsApp Live Communication', color: 'text-[#7C3AED]' },
                { count: '99%', label: 'Positive Feedback Rating', color: 'text-[#EC4899]' }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border relative group transition-colors ${isDark ? 'bg-slate-900/30 border-slate-800/60' : 'bg-white border-neutral-200 shadow-xs'}`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/1 right-0 top-0 opacity-0 group-hover:opacity-100 transition" />
                  <p className={`text-xl sm:text-2.5xl font-black font-display font-mono ${stat.color} tracking-tight`}>{stat.count}</p>
                  <p className={`text-[9.5px] uppercase font-mono font-bold tracking-widest mt-1 transition-colors ${isDark ? 'text-slate-420' : 'text-slate-505'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* ========================================= CUSTOMER REVIEWS ========================================= */}
            <div className="space-y-4 text-left">
              <h3 className={`text-lg md:text-xl font-bold flex items-center gap-1.5 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 stroke-none" />
                <span>What Clients Say about this Service</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Ashraful Islam',
                    company: 'Inception Retail BD',
                    text: 'The support throughout our web development process has been extraordinary. Their interactive sandbox staging is a lifesaver. Performance values jumped instantly.',
                    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                  },
                  {
                    name: 'Khalid Bin Mansoor',
                    company: 'Riyadh Growth Agency',
                    text: 'WebzoneBD IT delivers standard-grade coding benchmarks under extreme deadlines. Our custom ERP system deployment ran correctly without any bugs on launch afternoon.',
                    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
                  }
                ].map((rev, i) => (
                  <div key={i} className={`p-5 rounded-2xl backdrop-blur-md border space-y-3 relative transition-all ${isDark ? 'bg-slate-900/40 border-slate-805 shadow-2xl' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, iStar) => <Star key={iStar} className="w-3 h-3 fill-amber-500 stroke-none" />)}
                    </div>
                    <p className={`text-[11px] leading-relaxed italic transition-colors ${isDark ? 'text-slate-350' : 'text-neutral-650'}`}>"{rev.text}"</p>
                    <div className={`flex items-center gap-2.5 pt-1.5 border-t transition-colors ${isDark ? 'border-slate-800/40' : 'border-neutral-150'}`}>
                      <img src={rev.img} alt="review avatar" className="w-8 h-8 rounded-full object-cover border border-slate-750 shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <p className={`text-[11px] font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{rev.name}</p>
                        <span className={`text-[9.5px] font-mono block leading-none transition-colors ${isDark ? 'text-slate-500' : 'text-slate-505'}`}>{rev.company}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================= FAQ SECTION ========================================= */}
            <div className={`p-6 rounded-2xl border text-left space-y-5 transition-colors ${isDark ? 'bg-slate-950/40 border-slate-805' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-base sm:text-lg font-black flex items-center gap-1.5 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <HelpCircle className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-605'}`} />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-2.5">
                {[
                  { q: 'How long does the average delivery sequence take?', a: 'Standard Starter MVP layouts take 3 to 5 days, while complex custom web portal integrations usually run between 7 and 14 business days.' },
                  { q: 'Can I request visual code revisions or tweaks?', a: 'Absolutely! Our standard professional tiers authorize unlimited revisions until the preliminary mockups completely satisfy your visual specifications.' },
                  { q: 'Is high-performance web hosting and SSL secure included?', a: 'Yes! Selected Professional and Business models include 1 full year of fast non-volatile SSD cloud hosting alongside automatic SSL renewals.' },
                  { q: 'Do you configure full admin dashboard codes?', a: 'Yes, we design straightforward dashboards providing customer control nodes enabling product uploads or sitemap editing without coding knowledge.' }
                ].map((faq, i) => {
                  const isOpen = openFaqIdx === i;
                  return (
                    <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${isDark ? 'border-slate-800 bg-slate-900/10' : 'border-neutral-200 bg-slate-50'}`}>
                      <button
                        onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                        className={`w-full p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-900/30' : 'hover:bg-slate-100/50'}`}
                      >
                        <span className={`text-xs font-bold pr-2 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#00E5FF] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      
                      {isOpen && (
                        <div className={`p-3.5 border-t text-xs leading-relaxed font-sans transition-colors ${isDark ? 'bg-slate-950/40 border-slate-805 text-slate-400' : 'bg-slate-100/50 border-neutral-200 text-neutral-600'}`}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================= RELATED SERVICES ========================================= */}
            <div className="space-y-4 text-left">
              <h3 className={`text-base sm:text-lg font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Cross-Connected Digital Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allServices.filter(s => s.id !== service.id).slice(0, 4).map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => {
                      onNavigateToService(s.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`p-3 border rounded-xl cursor-pointer flex items-center justify-between gap-3 transition group ${isDark ? 'bg-slate-900/40 hover:bg-slate-920 border-slate-800' : 'bg-white hover:bg-slate-50 border-neutral-200 shadow-xs'}`}
                  >
                    <div className="min-w-0">
                      <p className={`text-xs font-black transition group-hover:text-blue-600 ${isDark ? 'text-white hover:text-[#00E5FF]' : 'text-slate-800'}`}>{s.title}</p>
                      <p className={`text-[10px] font-mono mt-0.5 transition-colors ${isDark ? 'text-slate-500' : 'text-neutral-500'}`}>EST. Baseline {getFormatPrice(s.startingPrice)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================= FINAL CTA SECTION ========================================= */}
            <div className={`p-8 rounded-3xl text-center space-y-4 relative overflow-hidden shadow-2xl transition-all ${isDark ? 'bg-gradient-to-tr from-[#7C3AED]/25 via-slate-900/30 to-[#00E5FF]/10 border-slate-800' : 'bg-white border-neutral-205 shadow-sm'}`}>
              <div className="absolute inset-0 bg-[#00E5FF]/5 opacity-30 mix-blend-color-dodge blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-xl mx-auto space-y-3.5">
                <h2 className={`text-xl sm:text-2.5xl font-extrabold tracking-tight font-display transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Ready to Start Your Digital Project?
                </h2>
                <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>
                  Let's engineer your custom digital solution with pristine structural security and high conversion indexes with WebzoneBD IT Solution.
                </p>

                <div className="pt-2 flex flex-wrap gap-2.5 justify-center">
                  <button 
                    onClick={handleOrderSubmit}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] hover:opacity-95 text-xs text-white md:text-slate-950 font-black rounded-lg active:scale-95 transition cursor-pointer"
                  >
                    🚀 Order Now
                  </button>

                  <a 
                    href="https://wa.me/966570511931?text=Hello%20WebzoneBD%2C%20I%20am%20ready%20to%20commence%20my%20service."
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Live Consultation</span>
                  </a>

                  <button 
                    onClick={onBack}
                    className={`px-6 py-2.5 border rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${isDark ? 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300' : 'border-neutral-250 bg-white hover:bg-neutral-50 text-neutral-800'}`}
                  >
                    Explore More Services
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================= STICKY ORDER DESKTOP SIDEBAR (4 Columns width) ========================================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">

            {/* PRICING CONTROL CARD */}
            <div className={`p-5 md:p-6 rounded-3xl border relative overflow-hidden backdrop-blur-md shadow-2xl transition-all text-left ${isDark ? 'bg-slate-950/60 border-slate-800/90 shadow-[#00E5FF]/5' : 'bg-white border-neutral-200'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-transparent to-cyan-500/10 rounded-tr-3xl pointer-events-none" />
              
              {/* Product Badge */}
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-800/80">
                <span className="px-2 py-0.5 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 text-[9px] font-black uppercase font-mono tracking-widest rounded">
                  🎁 SCRIPT LICENSING
                </span>
                <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ 5.0 (98 reviews)
                </span>
              </div>

              {/* Package selector tabs inside sidebar */}
              <div className={`grid grid-cols-3 p-1 border rounded-2xl text-[10px] font-black uppercase tracking-wider mt-4 transition-all ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-100 border-neutral-200 shadow-inner'}`}>
                {(['starter', 'professional', 'business'] as const).map((tierKey) => (
                  <button
                    key={tierKey}
                    onClick={() => setActivePackageTab(tierKey)}
                    className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${activePackageTab === tierKey ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md font-extrabold' : `${isDark ? 'text-slate-400 hover:text-white' : 'text-neutral-500 hover:text-slate-800'}`}`}
                  >
                    {tierKey === 'starter' ? 'Starter' : tierKey === 'professional' ? 'Pro' : 'SaaS v4'}
                  </button>
                ))}
              </div>

              {/* Price section */}
              <div className="py-5 space-y-1 text-left">
                <span className="text-[9.5px] uppercase font-mono text-slate-500 block tracking-widest">{language === 'bn' ? 'অর্ডার এস্টিমেটেড প্রাইস' : 'Estimated Pricing Cost'}</span>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black font-mono tracking-tight transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-650'}`}>
                    {getFormatPrice(pricingTiers[activePackageTab].price)}
                  </span>
                  {activePackageTab === 'professional' && (
                    <span className="text-slate-500 line-through text-xs font-mono">
                      {getFormatPrice(Math.round(pricingTiers[activePackageTab].price * 1.4))}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-emerald-500 font-mono font-semibold flex items-center gap-1">
                  ❇️ {language === 'bn' ? '৮৫% সাশ্রয়ী মূল্যে লাইভ সোর্স কোড' : '85% cheaper than dev agencies'}
                </p>
              </div>

              {/* Delivery specifications in Sidebar */}
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2.5 mb-4 transition-colors ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-neutral-150'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10.5px]">SLA DELIVERY:</span>
                  <span className={`font-black ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>{pricingTiers[activePackageTab].delivery}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/20 pt-2">
                  <span className="text-slate-400 text-[10.5px]">REVISIONS:</span>
                  <span className="text-slate-300 font-black">{pricingTiers[activePackageTab].revisions}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/25 pt-2 border-dashed">
                  <span className="text-slate-400 text-[10.5px]">SUPPORT TERM:</span>
                  <span className="text-[#EC4899] font-black">{pricingTiers[activePackageTab].support}</span>
                </div>
              </div>

              {/* Packaging features checklist */}
              <div className="space-y-3 pb-5 border-b border-slate-800/15">
                <span className="text-[9.5px] font-black font-mono text-slate-500 block uppercase tracking-wider">{language === 'bn' ? 'প্যাকেজে অন্তর্ভুক্ত ফিচার সমূহ:' : 'Core Bundle Checklist:'}</span>
                <div className="space-y-2 text-xs">
                  {pricingTiers[activePackageTab].features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span className={`leading-snug transition-colors ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct order checkouts */}
              <div className="pt-5 space-y-2.5">
                <button 
                  onClick={() => {
                    if (onOrderWhatsApp) {
                      onOrderWhatsApp(service.title, pricingTiers[activePackageTab].name);
                    } else {
                      handleOrderSubmit();
                    }
                  }}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition-all text-center border border-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>🟢 {language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'Order via WhatsApp'}</span>
                </button>

                <button 
                  onClick={() => {
                    if (onRequestQuotation) {
                      onRequestQuotation(service.title, pricingTiers[activePackageTab].name);
                    } else {
                      setIsConsultationModalOpen(true);
                    }
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-black text-xs uppercase tracking-wide rounded-xl active:scale-95 transition hover:shadow-lg shadow-blue-500/10 cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>📋 {language === 'bn' ? 'কোটেশন রিকোয়েস্ট' : 'Request Quotation'}</span>
                </button>

                <button 
                  onClick={() => setIsConsultationModalOpen(true)}
                  className={`w-full py-2.5 px-4 rounded-xl border border-dashed text-[11px] font-bold tracking-wide transition-all cursor-pointer text-center ${isDark ? 'border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400' : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700'}`}
                >
                  📞 Request Free 15-Min Callback Call
                </button>
              </div>

              {/* Trust labels inside purchase box */}
              <div className="pt-4 flex justify-center items-center gap-4 text-[9px] font-mono text-slate-500 uppercase border-t border-slate-800/40 mt-4">
                <span className="flex items-center gap-1">🛡️ SSL SECURE</span>
                <span className="text-slate-805">|</span>
                <span className="flex items-center gap-1">❇️ GPL CODE</span>
              </div>
            </div>

            {/* SECURED CLIENT CERTIFICATION STATS */}
            <div className={`p-4 rounded-xl border text-left space-y-2.5 transition-all ${isDark ? 'bg-slate-900/20 shadow-xl border-slate-800/80' : 'bg-emerald-50/70 border-emerald-150'}`}>
              <div className="flex gap-2 items-start text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div className="space-y-0.5 text-left">
                  <p className={`font-extrabold text-[11.5px] transition-colors ${isDark ? 'text-white' : 'text-emerald-950'}`}>Zero Initial Funding Risk</p>
                  <p className={`text-[10.5px] leading-normal transition-colors ${isDark ? 'text-slate-400' : 'text-emerald-800'}`}>WebzoneBD operates on milestones. Settle subsequent funding tiers only once preliminary wireframes meet approved requirements.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================= DYNAMIC CONSULTATION SCHEDULER POPUP MODAL ========================================= */}
      <AnimatePresence>
        {isConsultationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-left"
            >
              <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-805">
                <span className="text-xs font-mono font-black text-[#00E5FF] tracking-wider uppercase">📞 Priority Call Callback</span>
                <button 
                  onClick={() => setIsConsultationModalOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConsultSubmit} className="p-5 space-y-4 text-xs text-left">
                <p className="text-slate-400 leading-normal">
                  Provide your name and contact phone or WhatsApp configuration below. A WebzoneBD Lead Business Architect will contact you directly within 15 minutes.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g., Imran Hasan"
                    className="w-full bg-slate-950 text-xs border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    placeholder="e.g., +8801864000005"
                    className="w-full bg-slate-950 text-xs border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 font-extrabold text-[#020617] uppercase rounded-xl transition cursor-pointer text-xs"
                >
                  🚀 Register Callback Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
        #chat-stream::-webkit-scrollbar {
          width: 4px;
        }
        #chat-stream::-webkit-scrollbar-track {
          background: transparent;
        }
        #chat-stream::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
