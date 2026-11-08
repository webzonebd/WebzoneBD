import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, Shield, Terminal, MessageSquare, ArrowRight, Sparkles, Award, Star, CheckCircle, Mic, MicOff } from 'lucide-react';
import { Language, Theme } from '../types';

interface HeroProps {
  language: Language;
  theme?: Theme;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function Hero({ language, theme = 'dark', searchTerm, setSearchTerm, setCurrentPage, triggerToast }: HeroProps) {
  const [activeClientsCount, setActiveClientsCount] = useState(880);
  
  // Canvas particle reference for cyber background animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic text animation states
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const animatedOffers = [
    { en: 'Domain Registration', bn: 'ডোমেন রেজিস্ট্রেশন', ar: 'تسجيل النطاق' },
    { en: 'Share & Cloud Hosting', bn: 'শেয়ার ও ক্লাউড হোস্টিং', ar: 'استضافة مشتركة وسحابية' },
    { en: 'Reseller Hosting', bn: 'রিসেলার হোস্টিং', ar: 'استضافة الموزعين' },
    { en: 'Business Website', bn: 'বিজনেস ওয়েবসাইট', ar: 'موقع أعمال تجاري' },
    { en: 'Blog & News Portal', bn: 'ব্লগ ও নিউজ পোর্টাল', ar: 'مدونة وبوابة إخبارية' },
    { en: 'eCommerce Website', bn: 'ই-কমার্স ওয়েবসাইট', ar: 'متجر إلكتروني متكامل' },
    { en: 'Digital Marketing', bn: 'ডিজিটাল মার্কেটিং', ar: 'التسويق الرقمي' }
  ];

  useEffect(() => {
    const textTimer = setInterval(() => {
      setAnimatedIndex((prev) => (prev + 1) % animatedOffers.length);
    }, 2500);
    return () => clearInterval(textTimer);
  }, [animatedOffers.length]);

  // Real-time micro statistics simulation for active sessions
  useEffect(() => {
    const valInterval = setInterval(() => {
      setActiveClientsCount(prev => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 4000);
    return () => clearInterval(valInterval);
  }, []);

  // Canvas background particle & network lines animation (Modern Hosting-style)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particlesCount = 48;
    const isLightMode = theme === 'light';
    
    const lightColors = [
      'rgba(147, 51, 234, ', // Violet
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(99, 102, 241, ',  // Indigo
      'rgba(236, 72, 153, '   // Pink
    ];

    const darkColors = [
      'rgba(168, 85, 247, ', // Purple
      'rgba(56, 189, 248, ', // Sky
      'rgba(99, 102, 241, ', // Indigo
      'rgba(244, 114, 182, ' // Pink
    ];

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      colorBase: string;
    }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.5 + 1,
        alpha: isLightMode ? Math.random() * 0.6 + 0.3 : Math.random() * 0.55 + 0.25,
        colorBase: isLightMode 
          ? lightColors[i % lightColors.length] 
          : darkColors[i % darkColors.length]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle network grid lines
      ctx.strokeStyle = isLightMode ? 'rgba(99, 102, 241, 0.08)' : 'rgba(109, 40, 217, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 38;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.colorBase}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle glowing links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.strokeStyle = isLightMode 
              ? `rgba(99, 102, 241, ${0.22 * (1 - dist / 115)})` 
              : `rgba(139, 92, 246, ${0.20 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const t = {
    en: {
      tag: "Smart Digital Agency",
      titleStart: "Your Digital Growth Partner,",
      titleSpan: "✨ WebzoneBD iT Services ✨",
      tagline: "How can we help you build and grow your business online, Our Team is Ready to assist you.",
      searchPlaceholder: "Search themes, PHP scripts, plugins and templates...",
      btnPrimary: "Explore Digital Store",
      btnSecondary: "Request Consultation"
    },
    bn: {
      tag: "স্মার্ট ডিজিটাল এজেন্সি",
      titleStart: "আপনার ডিজিটাল পার্টনার,",
      titleSpan: "✨ ওয়েবজোনবিডি আইটি সার্ভিসেস ✨",
      tagline: "অনলাইনে আপনার ব্যবসা তৈরি এবং বৃদ্ধি করতে আমরা কীভাবে সাহায্য করতে পারি, আমাদের টিম আপনাকে সহায়তা করতে প্রস্তুত।",
      searchPlaceholder: "সার্চ করুন পিএইচপি স্ক্রিপ্ট, ওয়ার্ডপ্রেস থিম বা হোস্টিং প্যাকেজ...",
      btnPrimary: "ডিজিটাল স্টোর অন্বেষণ করুন",
      btnSecondary: "ফ্রি কাস্টম কনসালটেশন"
    },
    ar: {
      tag: "وكالة رقمية ذكية",
      titleStart: "شريكك في النمو الرقمي،",
      titleSpan: "✨ ويب زون بي دي لخدمات تقنية المعلومات ✨",
      tagline: "كيف يمكننا مساعدتك في بناء وتطوير أعمالك التجارية عبر الإنترنت، فريقنا جاهز دائماً لمساعدتك.",
      searchPlaceholder: "ابحث عن خوادم، سكربتات لارافيل وتطبيقات ووردبريس المعتمدة...",
      btnPrimary: "زيارة المتجر الرقمي",
      btnSecondary: "طلب استشارة هندسية"
    }
  }[language] || {
    tag: "Smart Digital Agency",
    titleStart: "Your Digital Growth Partner,",
    titleSpan: "✨ WebzoneBD iT Services ✨",
    tagline: "How can we help you build and grow your business online, Our Team is Ready to assist you.",
    searchPlaceholder: "Search PHP scripts, WordPress themes, Blogger templates...",
    btnPrimary: "Explore Digital Store",
    btnSecondary: "Free Agency Custom Consultation"
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

  // Enhanced Framer-Motion Staggered Entrance Animation Variants for Hero
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.08
      }
    }
  };

  // Badge entrance variant (Subtle scale & slide)
  const badgeVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // H1 Main Title entrance variant (Modern blur reveal + smooth upward translation)
  const h1Variants = {
    hidden: { opacity: 0, y: 32, filter: 'blur(8px)', scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // H2 Subheading / Dynamic Showcase & Tagline entrance variant
  const h2Variants = {
    hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Search Bar entrance variant
  const searchVariants = {
    hidden: { opacity: 0, y: 22, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // CTA Buttons Container with inner stagger
  const ctaContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
        delayChildren: 0.04
      }
    }
  };

  // Individual CTA Button variant (with responsive spring physics)
  const ctaButtonVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.93 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 15,
        mass: 0.8
      }
    }
  };

  // Trust badges footer entrance variant
  const trustBadgesVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const isLight = theme === 'light';

  return (
    <section 
      className={`relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-12 transition-colors duration-500 border-b ${
        isLight 
          ? 'bg-gradient-to-br from-slate-50 via-purple-50/80 to-cyan-50/70 text-slate-900 border-purple-200/80' 
          : 'bg-[#0F172A] text-slate-100 border-violet-900/40'
      }`} 
      id="hero-showcase"
    >
      {/* Canvas background particle & mesh layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Light Color Animation Effects Background (Glowing Orbs & Radial Beam) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 25, 0],
          y: [0, -20, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className={`absolute top-1/4 left-[-10%] w-[520px] h-[520px] rounded-full pointer-events-none z-0 ${
          isLight 
            ? 'bg-gradient-to-r from-purple-300/60 via-indigo-200/50 to-cyan-300/50 blur-[120px]' 
            : 'bg-gradient-to-r from-[#6D28D9]/30 to-[#8B5CF6]/20 blur-[130px]'
        }`} 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 25, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className={`absolute bottom-[-10%] right-[-5%] w-[620px] h-[620px] rounded-full pointer-events-none z-0 ${
          isLight 
            ? 'bg-gradient-to-r from-pink-300/50 via-rose-200/40 to-purple-300/50 blur-[130px]' 
            : 'bg-gradient-to-r from-[#A855F7]/25 to-[#6D28D9]/25 blur-[140px]'
        }`} 
      />
      <motion.div 
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className={`absolute top-[-5%] right-[25%] w-[450px] h-[450px] rounded-full pointer-events-none z-0 ${
          isLight 
            ? 'bg-gradient-to-r from-cyan-300/50 via-teal-200/40 to-blue-300/40 blur-[110px]' 
            : 'bg-gradient-to-r from-[#06B6D4]/20 to-[#3B82F6]/20 blur-[120px]'
        }`} 
      />

      {/* Ambient Radial Light Beam & Tech Grid Lines */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isLight 
          ? 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent' 
          : 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent'
      }`} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60 z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <motion.div 
          className="text-center space-y-5 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trust endorsement premium badge */}
          <motion.div 
            variants={badgeVariants}
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

          {/* Heading H1 - Enterprise-level typography with staggered entrance animation */}
          <motion.h1 
            variants={h1Variants}
            className="text-center font-display leading-[1.25] tracking-tight"
          >
            <span className="block text-[19px] xs:text-[23px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-black text-[#0f172a] dark:text-white whitespace-nowrap sm:whitespace-normal">
              {t.titleStart}
            </span>
            <span className="block mt-2.5 text-[24px] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[74px] font-black tracking-tight animate-glow-text shine-overlay py-2 select-none">
              {t.titleSpan}
            </span>
          </motion.h1>

          {/* Heading H2 - Dynamic Rotating Services and Agency Tagline with staggered entrance animation */}
          <motion.h2
            variants={h2Variants}
            className="space-y-4 max-w-3xl mx-auto"
          >
            {/* Animated services list */}
            <div className="relative w-full h-[1.5em] overflow-hidden flex items-center justify-center -mt-1 -mb-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={animatedIndex}
                  initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] drop-shadow-sm select-none"
                >
                  {language === 'bn' ? animatedOffers[animatedIndex].bn : language === 'ar' ? animatedOffers[animatedIndex].ar : animatedOffers[animatedIndex].en}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Subtitle description tagline */}
            <p className="text-sm sm:text-base md:text-[18px] text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-[1.8] font-sans font-normal">
              {t.tagline}
            </p>
          </motion.h2>

          {/* Search bar - Premium glassy SaaS input component */}
          <motion.div variants={searchVariants} className="relative max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto w-full z-20">
            <div 
              className="mt-4 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-1.5 md:p-2.5 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 border border-slate-200/90 dark:border-slate-800 flex items-center gap-2"
            >
              <div className="flex-1 flex items-center pl-3 md:pl-4">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm md:text-base font-medium px-2 py-2 md:py-2.5 text-[#0f172a] dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0"
                />

                {/* Desktop Enter Shortcut Affordance */}
                <span className="hidden md:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mr-2 select-none border border-slate-200/60 dark:border-slate-700/60">
                  Enter ↵
                </span>
                
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
                className="px-5 md:px-7 py-2.5 md:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs md:text-sm font-black rounded-xl md:rounded-2xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 shrink-0"
              >
                <span>{language === 'bn' ? "খুঁজুন" : language === 'ar' ? "بحث بالمتجر" : "Search"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Listening floating HUD under input */}
            {isListening && (
              <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-1 fade-in duration-200 z-30">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
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
          </motion.div>

          {/* Staggered CTA Action Buttons */}
          <motion.div 
            variants={ctaContainerVariants}
            className="pt-4 flex flex-row justify-center items-center gap-3.5 max-w-md mx-auto px-1"
          >
            <motion.button
              variants={ctaButtonVariants}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentPage('marketplace')}
              className="w-1/2 sm:w-auto px-4 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-550 dark:from-blue-600 dark:to-cyan-550 text-white font-extrabold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] cursor-pointer text-center truncate"
            >
              {t.btnPrimary}
            </motion.button>
            <motion.button
              variants={ctaButtonVariants}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentPage('contact')}
              className="w-1/2 sm:w-auto px-4 sm:px-8 py-3.5 sm:py-4 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-[#0f172a] dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-extrabold text-xs sm:text-sm rounded-full transition-all duration-200 cursor-pointer hover:border-slate-350 dark:hover:border-slate-705 shadow-sm text-center truncate"
            >
              {t.btnSecondary}
            </motion.button>
          </motion.div>

          {/* Real Trust Badges */}
          <motion.div 
            variants={trustBadgesVariants}
            className="pt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[11px] font-mono uppercase tracking-wider text-slate-550 dark:text-slate-400 font-bold"
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
              <Award className="w-4 h-4 text-violet-500" />
              <span>VERIFIED CODES BY DEVELOPERS</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
