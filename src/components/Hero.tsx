import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Globe, Shield, Terminal, MessageSquare, ArrowRight, Sparkles, Award, Star, CheckCircle, Mic, MicOff } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  language: Language;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function Hero({ language, searchTerm, setSearchTerm, setCurrentPage, triggerToast }: HeroProps) {
  const [activeClientsCount, setActiveClientsCount] = useState(880);
  
  // Real-time micro statistics simulation for active sessions
  useEffect(() => {
    const valInterval = setInterval(() => {
      setActiveClientsCount(prev => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 4000);
    return () => clearInterval(valInterval);
  }, []);

  const t = {
    en: {
      tag: "Smart Digital Agency",
      titleStart: "Your Digital Growth Partner,",
      titleSpan: "✨ WebzoneBD IT Solution ✨",
      tagline: "How can we help you build and grow your business online. You need a website, eCommerce store, Web Portal, Digital Marketing, Hosting, or technical support, our team is ready to assist you.",
      searchPlaceholder: "Search themes, PHP scripts, plugins and templates...",
      btnPrimary: "Explore Digital Store",
      btnSecondary: "Request Consultation",
      statScripts: "Premium Script Products Sell",
      statDelivered: "Enterprise Deployments",
      statSupport: "Support Satisfaction",
      uptime: "Guaranteed Uptime SLA"
    },
    bn: {
      tag: "স্মার্ট ডিজিটাল এজেন্সি",
      titleStart: "আপনার ডিজিটাল পার্টনার,",
      titleSpan: "✨ ওয়েবজোনবিডি আইটি সলিউশন ✨",
      tagline: "অনলাইনে আপনার ব্যবসা তৈরি এবং বৃদ্ধি করতে আমরা কীভাবে সাহায্য করতে পারি। আপনার যদি একটি ওয়েবসাইট, ই-কমার্স স্টোর, ওয়েব পোর্টাল, ডিজিটাল মার্কেটিং, হোস্টিং অথবা টেকনিক্যাল সাপোর্টের প্রয়োজন হয়, আমাদের টিম আপনার পাশে আছে।",
      searchPlaceholder: "সার্চ করুন পিএইচপি স্ক্রিপ্ট, ওয়ার্ডপ্রেস থিম বা হোস্টিং প্যাকেজ...",
      btnPrimary: "ডিজিটাল স্টোর অন্বেষণ করুন",
      btnSecondary: "ফ্রি কাস্টম কনসালটেশন",
      statScripts: "প্রিমিয়াম স্ক্রিপ্ট প্রোডাক্ট সেল",
      statDelivered: "এন্টারপ্রাইজ ডেপ্লয়মেন্টস",
      statSupport: "সাপোর্ট সন্তুষ্টি রেটিং",
      uptime: "জিবি ইউপিটাইম এসএলএ"
    },
    ar: {
      tag: "وكالة رقمية ذكية",
      titleStart: "شريكك في النمو الرقمي،",
      titleSpan: "✨ ويب زون بي دي لتقنية المعلومات ✨",
      tagline: "كيف يمكننا مساعدتك في بناء وتطوير أعمالك التجارية عبر الإنترنت. سواء كنت بحاجة إلى موقع ويب، متجر إلكتروني، بوابة ويب، تسويق رقمي، استضافة، أو دعم فني، فإن فريقنا جاهز دائماً لمساعدتك.",
      searchPlaceholder: "ابحث عن خوادم، سكربتات لارافيل وتطبيقات ووردبريس المعتمدة...",
      btnPrimary: "زيارة المتجر الرقمي",
      btnSecondary: "طلب استشارة هندسية",
      statScripts: "سكربتات برمجية ممتازة للبيع",
      statDelivered: "تسليم المشاريع للمؤسسات",
      statSupport: "مستوى تقييم الدعم",
      uptime: "جاهزية الخوادم المستمرة"
    }
  }[language] || {
    tag: "Smart Digital Agency",
    titleStart: "Your Digital Growth Partner,",
    titleSpan: "✨ WebzoneBD IT Solution ✨",
    tagline: "How can we help you build and grow your business online. You need a website, eCommerce store, Web Portal, Digital Marketing, Hosting, or technical support, our team is ready to assist you.",
    searchPlaceholder: "Search PHP scripts, WordPress themes, Blogger templates...",
    btnPrimary: "Explore Digital Store",
    btnSecondary: "Free Agency Custom Consultation",
    statScripts: "Premium Script Products Sell",
    statDelivered: "Enterprise Deployments",
    statSupport: "Support Rating",
    uptime: "Uptime SLA"
  };

  // Voice Search Web Speech API state
  const [isListening, setIsListening] = useState<boolean>(false);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg = language === 'bn' ? "আপনার ব্রাউজার ভয়েস সার্চ সমর্থন করে না।" : language === 'ar' ? "متصفحك لا يدعم البحث الصوتي." : "Your browser does not support Web Speech voice search.";
      if (triggerToast) triggerToast(`⚠️ ${msg}`);
      else alert(msg);
      return;
    }

    try {
      if (isListening) {
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech session dynamic feedback:", event?.error || event);
        setIsListening(false);
        const errType = event.error || '';
        if (errType === 'not-allowed') {
          const msg = language === 'bn'
            ? "মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি অথবা আইফ্রেম সিকিউরিটি পলিসি দ্বারা এটি অবরুদ্ধ করা হয়েছে। অনুগ্রহ করে অ্যাপটি নতুন ট্যাবে (New Tab) ওপেন করুন।"
            : "Microphone permission is denied or restricted by iframe security. Please open the application in a new tab to use voice search.";
          if (triggerToast) triggerToast(`🛑 ${msg}`);
          else console.warn(msg);
        } else if (errType === 'no-speech') {
          // Speech recognition timed out or heard nothing
        } else if (errType) {
          const msg = language === 'bn'
            ? `ভয়েস রিকগনিশন ত্রুটি: ${errType}`
            : `Speech recognition error encountered: ${errType}`;
          if (triggerToast) triggerToast(`⚠️ ${msg}`);
          else console.warn(msg);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const textResult = event.results[0][0].transcript;
        if (textResult) {
          const cleanedText = textResult.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
          setSearchTerm(cleanedText);
          // Redirect to digital store search with slight delay to show transcribed text
          setTimeout(() => {
            setCurrentPage('marketplace');
          }, 800);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage('marketplace');
    }
  };

  // Modern Staggered Animation configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-18 lg:pb-14 bg-slate-50 dark:bg-[#020617] transition-all duration-300" id="hero-showcase">
      
      {/* Dynamic Ambient Glow Layers & Rotating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-10 left-[15%] w-[450px] h-[450px] rounded-full bg-blue-500/15 dark:bg-blue-600/10 blur-[120px] animate-pulse-slow font-sans" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[550px] rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-[140px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[5%] left-[30%] w-[380px] h-[385px] rounded-full bg-violet-500/10 dark:bg-violet-650/5 blur-[110px]" />
      </div>

      {/* Floating Glassmorphic Auxiliary Info Cards */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden xl:block">
        {/* Metric Shape Left */}
        <motion.div 
          animate={{
            y: [0, -14, 0],
            x: [0, 8, 0],
            rotate: [0, 1.5, -1.5, 0],
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-36 left-[6%] bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xl shadow-slate-900/5 flex items-center gap-3.5 w-60 text-left"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div className="font-sans">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">ACTIVE DEPLOYMENTS</p>
            <p className="text-xs font-extrabold text-[#0f172a] dark:text-slate-100">{activeClientsCount} System Pipelines Live</p>
          </div>
        </motion.div>

        {/* Feature Shape Right */}
        <motion.div 
          animate={{
            y: [0, 16, 0],
            x: [0, -10, 0],
            rotate: [0, -1, 1, 0],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-36 right-[6%] bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xl shadow-slate-900/5 flex items-center gap-3.5 w-64 text-left"
        >
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-xl shrink-0 shadow-md shadow-blue-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="font-sans">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">MARKET DELIVERY</p>
            <p className="text-xs font-extrabold text-[#0f172a] dark:text-slate-100">Decentralized ZIP Hook v3.6</p>
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <motion.div 
          className="text-center space-y-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trust endorsement premium badge with requested features:
              1. Animation: Gradient Shift 6s ease infinite (animate-gradient-shift)
              2. Text Glow Effect (text-glow-premium)
              3. Glassmorphism Highlight (glass-highlight-premium)
              4. Smooth Fade-In Up (elementVariants has springing opacity and translating y)
          */}
          <motion.div 
            variants={elementVariants}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-highlight-premium text-xs font-bold font-sans hover:scale-[1.03] transition-all duration-300 select-none text-left shadow-lg overflow-hidden relative"
          >
            {/* Background animated gradient shift overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-400/25 to-indigo-500/10 opacity-70 animate-gradient-shift pointer-events-none" />
            
            <span className="flex h-2.5 w-2.5 relative z-10 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-cyan-400"></span>
            </span>
            <span className="relative z-10 text-semibold tracking-wide text-blue-700 dark:text-cyan-300 text-[12px] sm:text-[13px] uppercase text-glow-premium font-display font-black">
              {t.tag}
            </span>
          </motion.div>

          {/* Heading - Enterprise-level, 1.1 line-height, Plus Jakarta Sans font-display */}
          <motion.h1 
            variants={elementVariants}
            className="text-center font-display leading-[1.25] tracking-tight"
          >
            <span className="block text-[19px] xs:text-[23px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-black text-[#0f172a] dark:text-white whitespace-nowrap sm:whitespace-normal">
              {t.titleStart}
            </span>
            <span className="block mt-2.5 text-[24px] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[74px] font-black tracking-tight animate-glow-text shine-overlay py-2 select-none">
              {t.titleSpan}
            </span>
          </motion.h1>

          {/* Intro description - line height 1.8, perfectly weighted for high readability */}
          <motion.p 
            variants={elementVariants}
            className="text-sm sm:text-base md:text-[18px] text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-[1.8] font-sans"
          >
            {t.tagline}
          </motion.p>

          {/* Search bar - Premium glassy SaaS input component */}
          <div className="relative max-w-xl mx-auto w-full z-20">
            <motion.div 
              variants={elementVariants}
              className="mt-4 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
            >
              <div className="flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium px-2 py-2 pr-12 text-[#0f172a] dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-550 focus:ring-0"
                />
                
                {/* Voice search microphone trigger */}
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={`p-2 rounded-xl transition-all mr-1 duration-205 cursor-pointer flex items-center justify-center relative ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                      : 'text-slate-400 hover:text-blue-500 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                  title="Voice Search"
                >
                  {isListening ? (
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <Mic className="w-4 h-4 relative text-white" />
                    </span>
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
              <button
                onClick={() => setCurrentPage('marketplace')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-extrabold rounded-xl transition-all duration-305 flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-[1.02]"
              >
                <span>{language === 'bn' ? "খুঁজুন" : language === 'ar' ? "بحث بالمتجر" : "Search"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Listening floating HUD under input */}
            {isListening && (
              <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-1 fade-in duration-200 z-30">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span>
                    {language === 'bn' ? "আমি শুনছি... বলুন।" : language === 'ar' ? "أنا أستمع... تحدث الآن." : "Listening... speak now."}
                  </span>
                </div>
                {/* Visual Audio waves */}
                <div className="flex items-center justify-end gap-1 flex-1">
                  <span className="w-[3px] h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></span>
                  <span className="w-[3px] h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }}></span>
                  <span className="w-[3px] h-4 bg-white/90 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }}></span>
                  <span className="w-[3px] h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '450ms', animationDuration: '0.6s' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Action calls (Redesigned buttons with gradients, full-rounded, glow, and micro-interactions) */}
          <motion.div 
            variants={elementVariants}
            className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto"
          >
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-550 dark:from-blue-600 dark:to-cyan-550 hover:scale-[1.03] active:scale-95 text-white font-extrabold text-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] cursor-pointer"
            >
              {t.btnPrimary}
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-[#0f172a] dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-extrabold text-sm rounded-full transition-all duration-200 cursor-pointer hover:border-slate-350 dark:hover:border-slate-705 shadow-sm hover:scale-[1.02]"
            >
              {t.btnSecondary}
            </button>
          </motion.div>

          {/* Real Trust Badges - visually appealing validation badges */}
          <motion.div 
            variants={elementVariants}
            className="pt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[11px] font-mono uppercase tracking-wider text-slate-550 dark:text-slate-400 font-bold"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>MALWARE-FREE SECURE CODES</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>INSTANT DIGITAL VAULT ACCESS</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-505 text-violet-500" />
              <span>VERIFIED CODES BY DEVELOPERS</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Redesigned Bento-metrics section */}
        <motion.div 
          className="mt-12 sm:mt-18 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" 
          id="hero-metrics-bento"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={elementVariants}
            className="bg-white dark:bg-slate-900 bg-opacity-100 dark:bg-[#0f172a] p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-4 hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 text-left"
          >
            <div className="p-2 sm:p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <Terminal className="w-4.5 h-4.5 sm:w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black font-sans text-slate-900 dark:text-white leading-none">125+</p>
              <p className="text-[8.5px] sm:text-[10px] md:text-[11px] text-slate-550 dark:text-slate-400 font-extrabold font-sans uppercase tracking-wider leading-snug mt-0.5 sm:mt-1">{t.statScripts}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={elementVariants}
            className="bg-white dark:bg-slate-900 bg-opacity-100 dark:bg-[#0f172a] p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-4 hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 text-left"
          >
            <div className="p-2 sm:p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <Globe className="w-4.5 h-4.5 sm:w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black font-sans text-slate-900 dark:text-white leading-none">460+</p>
              <p className="text-[8.5px] sm:text-[10px] md:text-[11px] text-slate-550 dark:text-slate-400 font-extrabold font-sans uppercase tracking-wider leading-snug mt-0.5 sm:mt-1">{t.statDelivered}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={elementVariants}
            className="bg-white dark:bg-slate-900 bg-opacity-100 dark:bg-[#0f172a] p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-4 hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 text-left"
          >
            <div className="p-2 sm:p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <Star className="w-4.5 h-4.5 sm:w-6 h-6 text-emerald-500 fill-emerald-500/40" />
            </div>
            <div>
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black font-sans text-slate-900 dark:text-white leading-none">4.96/5</p>
              <p className="text-[8.5px] sm:text-[10px] md:text-[11px] text-slate-550 dark:text-slate-400 font-extrabold font-sans uppercase tracking-wider leading-snug mt-0.5 sm:mt-1">{t.statSupport}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={elementVariants}
            className="bg-white dark:bg-slate-900 bg-opacity-100 dark:bg-[#0f172a] p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 sm:gap-4 hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 text-left"
          >
            <div className="p-2 sm:p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <CheckCircle className="w-4.5 h-4.5 sm:w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black font-sans text-slate-900 dark:text-white leading-none">99.99%</p>
              <p className="text-[8.5px] sm:text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 font-extrabold font-sans uppercase tracking-wider leading-snug mt-0.5 sm:mt-1">{t.uptime}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
