import React, { useState, useEffect } from 'react';
import { 
  Globe, Mail, Phone, MapPin, Send, ExternalLink, ShieldCheck, Newspaper, 
  Briefcase, Store, Server, Users, Lock, FileText, RefreshCcw, Terminal, 
  Flame, Smartphone, ChevronRight, MessageSquare, Shield, CheckCircle,
  Facebook, Linkedin, Youtube, ArrowRight, Sparkles, Check
} from 'lucide-react';
import { Language, Theme, UserSession } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FooterProps {
  language: Language;
  theme: Theme;
  setCurrentPage: (page: string) => void;
  triggerToast: (msg: string) => void;
  onLoginClick?: (view?: 'login' | 'register', role?: 'customer' | 'affiliate') => void;
  user?: UserSession | null;
  setUser?: (user: UserSession | null) => void;
  isAdmin?: boolean;
  setIsAdmin?: (isAdmin: boolean) => void;
}

export default function Footer({ 
  language, 
  theme, 
  setCurrentPage, 
  triggerToast,
  onLoginClick,
  user,
  setUser,
  isAdmin,
  setIsAdmin
}: FooterProps) {
  const [showFooterAdminLogin, setShowFooterAdminLogin] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerPassword, setFooterPassword] = useState('');

  const [visitorCountry, setVisitorCountry] = useState<'AUTO' | 'BD' | 'SA'>('AUTO');
  const [detectedCountry, setDetectedCountry] = useState<'BD' | 'SA'>('BD');

  useEffect(() => {
    // Attempt automatic IP country detection
    fetch('https://freeipapi.com/api/json')
      .then(res => res.json())
      .then(data => {
        if (data && data.countryCode) {
          const code = data.countryCode.toUpperCase();
          if (code === 'SA') {
            setDetectedCountry('SA');
          } else {
            setDetectedCountry('BD');
          }
        }
      })
      .catch(err => {
        console.warn("Geolocation API fallback activated:", err);
        // Fallback checks (locale/timezone/language)
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz && (tz.includes('Riyadh') || tz.includes('Asia/Riyadh') || tz.includes('Kuwait') || tz.includes('Saudi') || tz.includes('Mecca'))) {
            setDetectedCountry('SA');
          } else if (language === 'ar') {
            setDetectedCountry('SA');
          } else {
            setDetectedCountry('BD');
          }
        } catch (e) {
          setDetectedCountry('BD');
        }
      });
  }, [language]);

  const paymentGateways = [
    {
      name: 'bKash',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E2125B] flex items-center justify-center text-white text-[6px] sm:text-[8px] shadow-sm shadow-[#E2125B]/30 animate-pulse font-bold">৳</span>
          <span className="text-[#E2125B] tracking-tight text-[8px] sm:text-[10px]">bKash</span>
        </div>
      ),
      badge: language === 'bn' ? 'বিকাশ পেমেন্ট' : language === 'ar' ? 'بوابة بكاش' : 'bKash Instant'
    },
    {
      name: 'Nagad',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-[#EA4335] to-[#FBBC05] flex items-center justify-center text-white text-[5.5px] sm:text-[7px] shadow-sm font-bold">৳</span>
          <span className="bg-gradient-to-r from-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent tracking-tight text-[8px] sm:text-[10px]">nagad</span>
        </div>
      ),
      badge: language === 'bn' ? 'নগদ পেমেন্ট' : language === 'ar' ? 'بوابة نقد' : 'Nagad Instant'
    },
    {
      name: 'Roket',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#8C3B91] flex items-center justify-center text-white text-[6px] sm:text-[8px] shadow-sm shadow-[#8C3B91]/30 font-bold">৳</span>
          <span className="text-[#8C3B91] tracking-tight text-[8px] sm:text-[10px]">Rocket</span>
        </div>
      ),
      badge: language === 'bn' ? 'রকেট ওয়ালেট' : language === 'ar' ? 'محفظة روكيت' : 'Rocket DBBL'
    },
    {
      name: 'Bangla QR',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-neutral-800 dark:bg-neutral-950 rounded border border-emerald-500/30">
            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-emerald-400 rounded-sm"></div>
            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-sm"></div>
            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-emerald-400 rounded-sm"></div>
            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-emerald-400 rounded-sm"></div>
          </div>
          <span className="text-emerald-400 tracking-tight text-[8px] sm:text-[10px]">Bangla QR</span>
        </div>
      ),
      badge: language === 'bn' ? 'বাংলা কিউআর' : language === 'ar' ? 'رمز الاستجابة' : 'Unified QR'
    },
    {
      name: 'Cellfin',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-[#0284C7] to-[#0D9488] flex items-center justify-center text-white text-[6.5px] sm:text-[8px] shadow-sm font-bold">c</span>
          <span className="text-[#0284C7] dark:text-[#38BDF8] tracking-tight text-[8px] sm:text-[10px] font-black">cellfin</span>
        </div>
      ),
      badge: language === 'bn' ? 'সেলফিন ওয়ালেট' : language === 'ar' ? 'محفظة سيلفين' : 'Cellfin Wallet'
    },
    {
      name: 'IBBL Bank',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#059669] flex items-center justify-center text-white text-[5.5px] sm:text-[7px] shadow-sm shadow-emerald-500/20 font-bold">i</span>
          <span className="text-[#059669] dark:text-[#34D399] tracking-tight text-[8px] sm:text-[10px]">IBBL</span>
        </div>
      ),
      badge: language === 'bn' ? 'ইসলামী ব্যাংক' : language === 'ar' ? 'بنك إسلامي' : 'IBBL NetBanking'
    },
    {
      name: 'STC Pay',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#4F008C] flex items-center justify-center text-white text-[5.5px] sm:text-[7px] shadow-sm font-bold">stc</span>
          <span className="text-[#4F008C] dark:text-[#A855F7] tracking-tight text-[8px] sm:text-[10px]">pay</span>
        </div>
      ),
      badge: language === 'bn' ? 'এসটিসি পে' : language === 'ar' ? 'إس تي سي باي' : 'STC Pay'
    },
    {
      name: 'STC Bank',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-[#4F008C] to-[#0D9488] flex items-center justify-center text-white text-[5.5px] sm:text-[7px] shadow-sm font-bold">stc</span>
          <span className="text-[#0D9488] tracking-tight text-[8px] sm:text-[10px]">Bank</span>
        </div>
      ),
      badge: language === 'bn' ? 'এসটিসি ব্যাংক' : language === 'ar' ? 'بنك إس تي سي' : 'STC Bank'
    },
    {
      name: 'Al Rajhi Bank',
      logo: (
        <div className="flex items-center gap-1 sm:gap-1.5 font-sans font-black">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#006A4E] flex items-center justify-center text-[#FFD700] text-[5.5px] sm:text-[7px] shadow-sm font-extrabold font-sans">ar</span>
          <span className="text-[#005B94] dark:text-[#38BDF8] tracking-tight text-[8px] sm:text-[10px]">Rajhi</span>
        </div>
      ),
      badge: language === 'bn' ? 'আল রাজি ব্যাংক' : language === 'ar' ? 'مصرف الراجحي' : 'Al Rajhi Bank'
    }
  ];
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value;
    if (email) {
      triggerToast(language === 'bn' ? "ওয়েবজোনবিডি নিউজলেটারে সাবস্ক্রাইব করার জন্য ধন্যবাদ!" : language === 'ar' ? "شكراً لكونك جزءاً من مجتمعنا الإخباري الرقمي!" : "Thank you for joining WebzoneBD newsletters!");
      e.currentTarget.reset();
    }
  };

  const t = {
    en: {
      aboutTitle: "WebzoneBD IT Agency",
      aboutDesc: "Starting a new business or growing an existing one? WebzoneBD IT Agency provides complete IT and digital services including website development, eCommerce, software solutions, branding, SEO, digital marketing, hosting, and technical support to help your business grow faster and smarter.",
      quickTitle: "Quick Navigation",
      hostingTitle: "Hosting & Cloud",
      solutionsTitle: "Digital Solutions",
      legalTitle: "Contract Terms",
      newsTitle: "Digital Weekly Newsletter",
      newsDesc: "Get coupon alerts and PHP scripts updates.",
      newsBannerTitle: "Stay Ahead in Tech & Cloud Hosting",
      newsBannerDesc: "Subscribe to receive monthly promo codes, new script releases, and expert IT tips directly to your mailbox.",
      newsBannerBadge: "EXCLUSIVE COMMUNITY HUB",
      newsTrust: "100% Privacy Protected · Zero Spam Guarantee · 1-Click Unsubscribe",
      placeholder: "Enter your business email address...",
      subscribe: "Subscribe",
      rights: "© 2026 WebzoneBD IT Agency. All Rights Reserved. Trusted on Cloud Run.",
      officeDhaka: "Mirpur DOHS, Dhaka-1216, Bangladesh",
      officeRiyadh: "Olaya Street, Riyadh, Saudi Arabia",
      liveStatus: "Cloud Infrastructure: 100% Operational (14ms)"
    },
    bn: {
      aboutTitle: "ওয়েবজোনবিডি আইটি এজেন্সি",
      aboutDesc: "নতুন ব্যবসা শুরু করছেন বা চলমান ব্যবসা বাড়াতে চান? ওয়েবজোনবিডি আইটি এজেন্সি দিচ্ছে ওয়েবসাইট ডেভেলপমেন্ট, ই-কমার্স, সফটওয়্যার সলিউশন, ব্র্যান্ডিং, এসইও, ডিজিটাল মার্কেটিং, হোস্টিং এবং টেকনিক্যাল সাপোর্ট সহ সম্পূর্ণ আইটি ও ডিজিটাল সেবা, যা আপনার ব্যবসাকে দ্রুত এবং স্মার্টভাবে এগিয়ে নিতে সাহায্য করবে।",
      quickTitle: "সহজ লিংকসমূহ",
      hostingTitle: "হোস্টিং ও ক্লাউড",
      solutionsTitle: "ডিজিটাল সলিউশনস",
      legalTitle: "শর্তাবলী ও পলিসি",
      newsTitle: "উপযোগী নিউজলেটার",
      newsDesc: "নতুন স্ক্রিপ্ট এর রিলিজ এবং কুপন অফারগুলো ইমেইল এর মাধ্যমে ফ্রিতে পান।",
      newsBannerTitle: "প্রযুক্তি ও ক্লাউড হোস্টিংয়ে এগিয়ে থাকুন",
      newsBannerDesc: "সাপ্তাহিক স্পেশাল ডিসকাউন্ট কুপন, নতুন স্ক্রিপ্ট রিলিজ ও ক্লাউড টিপস সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।",
      newsBannerBadge: "এক্সক্লুসিভ কমিউনিটি হাব",
      newsTrust: "১০০% প্রাইভেসি সুরক্ষিত · কোনো স্প্যাম পাঠানো হবে না · যেকোনো সময় আনসাবস্ক্রাইবযোগ্য",
      placeholder: "আপনার অফিসিয়াল ইমেইল লিখুন...",
      subscribe: "সাবস্ক্রাইব করুন",
      rights: "© ২০২৬ ওয়েবজোনবিডি আইটি এজেন্সি। সর্বস্বত্ব সংরক্ষিত।",
      officeDhaka: "মিরপুর ডিওএইচএস, ঢাকা-১২১৬, বাংলাদেশ",
      officeRiyadh: "ওলাইয়া স্ট্রিট, রিয়াদ, সৌদি আরব",
      liveStatus: "ক্লাউড নেটওয়ার্ক: ১০০% সক্রিয় ও দ্রুততম (১৪ms)"
    },
    ar: {
      aboutTitle: "وكالة ويب زون بي دي لتقنية المعلومات",
      aboutDesc: "هل تبدأ مشروعاً جديداً أم تطور مشروعاً قائماً؟ تقدم وكالة ويب زون بي دي لتقنية المعلومات خدمات رقمية وتكنولوجية متكاملة تشمل تطوير المواقع، التجارة الإلكترونية، البرمجيات، الهوية البصرية، السيو، التسويق الرقمي، الاستضافة والدعم الفني لمساعدتك على النمو بشكل أسرع وأذكى.",
      quickTitle: "روابط التنقل السريعة",
      hostingTitle: "الاستضافة والسحاب",
      solutionsTitle: "الحلول الرقمية",
      legalTitle: "الخصوصية والترخيص",
      newsTitle: "النشرة البريدية الرقمية",
      newsDesc: "احصل على بوابات الخصم والتحديثات البرمجية الفورية.",
      newsBannerTitle: "ابق في صدارة التكنولوجيا والاستضافة السحابية",
      newsBannerDesc: "اشترك للحصول على تنبيهات الخصم وإصدارات الاسكربتات الجديدة مباشرة إلى بريدك الإلكتروني.",
      newsBannerBadge: "مجتمع المطورين والشركات",
      newsTrust: "حماية الخصوصية 100% · لا توجد رسائل عشوائية · إلغاء الاشتراك بنقرة واحدة",
      placeholder: "أدخل بريدك الإلكتروني التجاري...",
      subscribe: "اشتراك مجاني",
      rights: "© 2026 WebzoneBD IT Agency. All Rights Reserved. Trusted on Cloud Run.",
      officeDhaka: "ميربور، دكا-1216، بنغلاديش",
      officeRiyadh: "شارع العليا، الرياض، المملكة العربية السعودية",
      liveStatus: "البنية التحتية السحابية: جاهزة 100% (14 مللي ثانية)"
    }
  }[language];

  return (
    <footer className="bg-neutral-900 text-neutral-400 py-6 sm:py-12 lg:py-16 border-t border-neutral-800" id="agency-footer">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP-ONLY: Premium Pre-Footer Newsletter & Community Banner ("fild") */}
        <div className="hidden lg:flex items-center justify-between p-6 xl:p-8 mb-12 rounded-3xl bg-gradient-to-r from-neutral-950 via-[#0B1120] to-neutral-950 border border-neutral-800/90 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{t.newsBannerBadge}</span>
            </div>
            <h3 className="text-xl xl:text-2xl font-black text-white tracking-tight">
              {t.newsBannerTitle}
            </h3>
            <p className="text-xs xl:text-sm text-neutral-400 leading-relaxed">
              {t.newsBannerDesc}
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> 100% Privacy
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" /> No Spam
              </span>
              <span>•</span>
              <span className="text-neutral-400">
                Instant Unsubscribe
              </span>
            </div>
          </div>

          {/* Desktop Newsletter Input Field */}
          <div className="relative z-10 w-full max-w-md xl:max-w-lg">
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-xl transition-all">
              <div className="flex-1 flex items-center pl-3">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="email"
                  required
                  name="email"
                  placeholder={t.placeholder}
                  className="w-full bg-transparent border-0 px-3 py-2.5 text-xs xl:text-sm text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 xl:px-6 py-2.5 xl:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-blue-500/25 active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <span>{t.subscribe}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* DESKTOP-ONLY: Comprehensive 5-Column Enterprise Layout */}
        <div className="hidden lg:grid grid-cols-5 gap-8 xl:gap-10 pb-10 text-left">
          {/* Column 1: WebzoneBD IT Agency Brand & Identity */}
          <div className="space-y-4">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer select-none"
              onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }}
            >
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl text-white shadow-md shadow-blue-500/20">
                <Globe className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  WebzoneBD
                </span>
                <span className="text-[8px] uppercase tracking-widest font-mono text-neutral-400 font-bold">
                  IT Agency
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400">
              {t.aboutDesc}
            </p>
            
            {/* Corporate Address & Contact Details */}
            <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{t.officeDhaka}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{t.officeRiyadh}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="https://wa.me/966570511931" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition font-mono">
                  +966 570511931 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <a href="mailto:info@webzonebd.com" className="hover:text-cyan-400 transition font-mono">
                  info@webzonebd.com
                </a>
              </div>
            </div>

            {/* Social Network Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-800/80 hover:bg-blue-600 text-neutral-400 hover:text-white transition-all shadow-xs" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-800/80 hover:bg-blue-500 text-neutral-400 hover:text-white transition-all shadow-xs" aria-label="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-800/80 hover:bg-rose-600 text-neutral-400 hover:text-white transition-all shadow-xs" aria-label="YouTube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Web Hosting & Cloud Servers */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-black uppercase font-mono tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.hostingTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {[
                { label: language === 'bn' ? "BDIX লো-লেটেন্সি হোস্টিং" : "BDIX Turbo Hosting", onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "টার্বো ক্লাউড VPS সার্ভার" : "NVMe Turbo Cloud VPS", onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "ডেডিকেটেড এন্টারপ্রাইজ সার্ভার" : "Dedicated Cloud Servers", onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "রিসেলার cPanel হোস্টিং" : "Reseller WHM Hosting", onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "ওয়ার্ডপ্রেস স্পিড বুস্টার" : "WordPress Optimized Turbo", onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "ফ্রি SSL ও ডেইলি ব্যাকআপ" : "Free SSL & Daily Cloud Backup", onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } }
              ].map((item, i) => (
                <li key={i}>
                  <button onClick={item.onClick} className="hover:text-cyan-400 transition flex items-center gap-1.5 cursor-pointer text-neutral-300 group">
                    <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 text-cyan-400 transition" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Domains & Software Solutions */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-black uppercase font-mono tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.solutionsTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {[
                { label: language === 'bn' ? "ডোমেন সার্চ ও রেজিস্ট্রেশন" : "Domain Search (.COM / .BD)", onClick: () => { setCurrentPage('domain'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "কাস্টম ওয়েব অ্যাপ্লিকেশন" : "Custom Web Application", onClick: () => { setCurrentPage('services'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "ই-কমার্স অনলাইন স্টোর" : "E-Commerce Multi-Vendor Store", onClick: () => { setCurrentPage('services'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "মোবাইল অ্যাপ ডেভেলপমেন্ট" : "Mobile Apps (Android & iOS)", onClick: () => { setCurrentPage('services'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "নিউজ পোর্টাল CMS স্ক্রিপ্ট" : "Online News Portal CMS", onClick: () => { setCurrentPage('marketplace'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "ক্লাউড POS ও ইনভেন্টরি ERP" : "Cloud POS & Inventory ERP", onClick: () => { setCurrentPage('services'); window.scrollTo(0, 0); } }
              ].map((item, i) => (
                <li key={i}>
                  <button onClick={item.onClick} className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer text-neutral-300 group">
                    <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 text-emerald-400 transition" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Client Portal & Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-black uppercase font-mono tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-pink-400" />
              <span>{t.quickTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {[
                { label: language === 'bn' ? "🔥 মেগা কম্বো অফার্স" : "🔥 Combo Offers Festival", icon: <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />, onClick: () => { setCurrentPage('offers'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "ডিজিটাল স্টোর ও স্ক্রিপ্ট" : "Digital Store Scripts", icon: <Store className="w-3.5 h-3.5 text-pink-400" />, onClick: () => { setCurrentPage('marketplace'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "সার্ভিসেস তালিকা" : "All Services Catalog", icon: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />, onClick: () => { setCurrentPage('services'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "ব্লগ ও প্রযুক্তি খবর" : "Tech Blog & Updates", icon: <Newspaper className="w-3.5 h-3.5 text-blue-400" />, onClick: () => { setCurrentPage('blog'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "অ্যাফিলিয়েট প্রোগ্রাম (১৫%)" : "Affiliate Program (15%)", icon: <Users className="w-3.5 h-3.5 text-amber-500" />, onClick: () => { setCurrentPage('affiliate'); window.scrollTo(0, 0); } },
                { label: language === 'bn' ? "কাস্টমার ড্যাশবোর্ড" : "Client Portal Dashboard", icon: <Users className="w-3.5 h-3.5 text-cyan-400" />, onClick: () => { setCurrentPage('dashboard'); window.scrollTo(0, 0); } }
              ].map((item, i) => (
                <li key={i}>
                  <button onClick={item.onClick} className="hover:text-cyan-400 transition flex items-center gap-2 cursor-pointer text-neutral-300 group">
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Support, Legal & Enterprise Security */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-black uppercase font-mono tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>{t.legalTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={() => { setCurrentPage('contact'); window.scrollTo(0, 0); }} className="hover:text-cyan-400 transition flex items-center gap-2 cursor-pointer text-neutral-300">
                  <Mail className="w-3.5 h-3.5 text-violet-400" />
                  <span>{language === 'bn' ? "২৪/৭ সরাসরি যোগাযোগ" : "24/7 Contact Desk"}</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('privacy'); window.scrollTo(0, 0); }} className="hover:text-cyan-400 transition flex items-center gap-2 cursor-pointer text-neutral-300">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>{language === 'bn' ? "প্রাইভেসি পলিসি লাইসেন্স" : "Privacy & Data Policy"}</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('privacy'); window.scrollTo(0, 0); }} className="hover:text-cyan-400 transition flex items-center gap-2 cursor-pointer text-neutral-300">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>{language === 'bn' ? "টার্মস ও কন্ডিশনস" : "Terms & Conditions"}</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('refund'); window.scrollTo(0, 0); }} className="hover:text-pink-400 transition flex items-center gap-2 cursor-pointer text-neutral-300">
                  <RefreshCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'bn' ? "১০০% রিফান্ড পলিসি" : "Refund & Cancellation"}</span>
                </button>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowFooterAdminLogin(!showFooterAdminLogin)}
                  className={`text-[10px] font-mono flex items-center gap-1.5 cursor-pointer transition select-none outline-none text-left p-1.5 rounded-lg border ${
                    showFooterAdminLogin 
                      ? "text-cyan-400 font-bold bg-cyan-950/40 border-cyan-500/40 shadow-inner" 
                      : "text-neutral-400 hover:text-white border-neutral-800 bg-neutral-950/50"
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 text-blue-400 shrink-0 ${showFooterAdminLogin ? "animate-pulse" : ""}`} />
                  <span>{language === 'bn' ? 'ম্যালওয়্যার-স্ক্যানড অ্যাডমিন পোর্টাল' : 'Malware-Scan Verified cPanel'}</span>
                </button>

                <AnimatePresence>
                  {showFooterAdminLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 text-left space-y-2.5 font-sans w-full shadow-2xl"
                    >
                      {isAdmin ? (
                        <div className="space-y-2 text-xs">
                          <p className="text-[10px] text-emerald-400 font-bold block leading-relaxed">
                            ✓ Currently authenticated as Super Admin Root session.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (setUser) setUser(null);
                              if (setIsAdmin) setIsAdmin(false);
                              triggerToast("Super Admin session closed.");
                              setShowFooterAdminLogin(false);
                            }}
                            className="w-full text-center py-1.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-[10px] font-bold rounded-lg transition"
                          >
                            Close Admin Mode
                          </button>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!footerEmail || !footerPassword) {
                              triggerToast("All admin login options required.");
                              return;
                            }
                            const formattedEmail = footerEmail.trim().toLowerCase();
                            if ((formattedEmail === 'admin@webzonebd.com' || formattedEmail === 'webzonebd@yahoo.com') && footerPassword === 'admin123') {
                              const adminUserSession = {
                                id: formattedEmail === 'webzonebd@yahoo.com' ? 'usr-webzonebd-admin' : 'usr-admin',
                                name: formattedEmail === 'webzonebd@yahoo.com' ? 'WebzoneBD Admin Office' : 'Super Admin Manager',
                                username: formattedEmail === 'webzonebd@yahoo.com' ? 'webzonebd' : 'admin_root',
                                email: formattedEmail,
                                phone: formattedEmail === 'webzonebd@yahoo.com' ? '+8801864000123' : '+8801799887766',
                                role: 'admin',
                                isVerified: true,
                                createdAt: '2026-06-10',
                                status: 'active',
                                wishlistedProductIds: []
                              } as any;
                              if (setUser) setUser(adminUserSession);
                              if (setIsAdmin) setIsAdmin(true);
                              triggerToast(language === 'bn' ? "স্বাগতম! আপনি অ্যাডমিন প্যানেলে সফলভাবে প্রবেশ করেছেন।" : "Welcome back, Chief Architect! Authorized WebzoneBD Super Admin session.");
                              setCurrentPage('dashboard');
                              setShowFooterAdminLogin(false);
                            } else {
                              triggerToast("❌ Handshake failed: Incorrect credentials.");
                            }
                          }}
                          className="space-y-2 text-neutral-300"
                        >
                          <span className="text-[9px] uppercase font-mono tracking-widest font-black text-neutral-400 block pb-1 border-b border-neutral-800">WHMCS cPanel Access</span>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase block">User ID</label>
                            <input
                              type="email"
                              required
                              value={footerEmail}
                              onChange={(e) => setFooterEmail(e.target.value)}
                              placeholder="webzonebd@yahoo.com"
                              className="w-full bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-[11px] text-white rounded focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase block">PIN Key</label>
                            <input
                              type="password"
                              required
                              value={footerPassword}
                              onChange={(e) => setFooterPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-[11px] text-white rounded focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                          >
                            Login WHMCS
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>
        </div>

        {/* MOBILE-ONLY: Compact Original Layout (Untouched for Mobile Mode) */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Globe className="h-6 w-6 text-blue-500 stroke-[2.5]" />
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                WebzoneBD IT Agency
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-400">
              {t.aboutDesc}
            </p>
          </div>

          {/* Nav links */}
          <div className="space-y-4">
            <h4 className="text-white text-xs sm:text-sm font-extrabold uppercase font-mono tracking-wider">
              {t.quickTitle}
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm font-semibold">
              {[
                { 
                  label: language === 'bn' ? "🔥 মেগা কম্বো অফার্স" : language === 'ar' ? "🔥 عروض الكومبو المتميزة" : "🔥 Combo Offers Festival", 
                  icon: <Flame className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-110 transition duration-300 animate-pulse" />,
                  onClick: () => { setCurrentPage('offers'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "ব্লগ ও খবর" : language === 'ar' ? "المدونات والأخبار" : "Blog", 
                  icon: <Newspaper className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('blog'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "সার্ভিসেস" : language === 'ar' ? "الخدمات" : "Services", 
                  icon: <Briefcase className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('services'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "ডিজিটাল স্টোর" : language === 'ar' ? "المتجر الرقمي" : "Digital Store", 
                  icon: <Store className="w-4 h-4 text-pink-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('marketplace'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "হাই-স্পিড হোস্টিং" : language === 'ar' ? "الاستضافة السريعة" : "Hosting Services", 
                  icon: <Server className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "ডোমেন রেজিস্ট্রেশন" : language === 'ar' ? "تسجيل النطاقات" : "Domain Registration", 
                  icon: <Globe className="w-4 h-4 text-blue-500 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('domain'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "অ্যাফিলিয়েট প্রোগ্রাম" : language === 'ar' ? "برنامج الشركاء" : "Affiliate Program", 
                  icon: <Users className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('affiliate'); window.scrollTo(0, 0); } 
                }
              ].map((lnk, i) => (
                <li key={i}>
                  <button
                    onClick={lnk.onClick}
                    className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                  >
                    {lnk.icon}
                    <span>{lnk.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-white text-xs sm:text-sm font-extrabold uppercase font-mono tracking-wider">
              {t.legalTitle}
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm font-semibold">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                >
                  <Mail className="w-4 h-4 text-violet-400 shrink-0 group-hover:scale-110 transition duration-300" />
                  <span>{language === 'bn' ? "যোগাযোগ করুন" : language === 'ar' ? "اتصل بنا" : "Contact"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('privacy');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                >
                  <Lock className="w-4 h-4 text-teal-400 shrink-0 group-hover:scale-110 transition duration-300" />
                  <span>{language === 'bn' ? "প্রাইভেসি পলিসি লাইসেন্স" : language === 'ar' ? "سياسة الخصوصية" : "Privacy Policy"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('privacy');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                >
                  <FileText className="w-4 h-4 text-stone-400 shrink-0 group-hover:scale-110 transition duration-300" />
                  <span>{language === 'bn' ? "ডকুমেন্টেশন ও সেবা সুরক্ষাবলয়" : language === 'ar' ? "ترخيص الاستعمال والخدمات" : "Terms & Conditions"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('refund');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-pink-400 text-slate-300 transition flex items-center gap-2.5 cursor-pointer text-left font-semibold"
                >
                  <RefreshCcw className="w-4 h-4 text-rose-450 shrink-0 group-hover:rotate-45 transition duration-300" />
                  <span>{language === 'bn' ? "রিফান্ড পলিসি" : language === 'ar' ? "سياسة الاسترجاع" : "Refund Policy"}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Newsletter Form */}
          <div className="space-y-4">
            <h4 className="text-white text-xs sm:text-sm font-extrabold uppercase font-mono tracking-wider">
              {t.newsTitle}
            </h4>
            <p className="text-xs text-neutral-400">
              {t.newsDesc}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                name="email"
                placeholder={t.placeholder}
                className="flex-1 h-8 sm:h-10 rounded-lg border bg-neutral-800 border-neutral-700 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 h-8 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold rounded-lg transition shrink-0"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Trusted Payment Gateways Marquee Section */}
        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>
                  {language === 'bn' ? 'বিশ্বস্ত পেমেন্ট গেটওয়ে সমূহ' : language === 'ar' ? 'بوابات دفع موثوقة وآمنة' : 'Trusted Payment Gateways'}
                </span>
              </h4>
              <p className="text-xs text-neutral-500">
                {language === 'bn' ? 'নিরাপদ ও স্বয়ংক্রিয় ইনস্ট্যান্ট ডেলিভারি সুরক্ষিত চ্যানেল' : language === 'ar' ? 'دفع وتفعيل تلقائي آمن وفوري ومؤمن تماماً' : 'Secure, end-to-end encrypted instant billing network'}
              </p>
            </div>

            {/* Location Selector Capsule Pill Switcher (Smart preview & compliance) */}
            <div className="flex items-center gap-1 bg-neutral-950/65 p-1.5 rounded-xl border border-neutral-800/80 self-start sm:self-center">
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-neutral-500 px-1.5">
                {language === 'bn' ? 'অবস্থান:' : language === 'ar' ? 'الموقع:' : 'Region:'}
              </span>
              <button
                type="button"
                onClick={() => setVisitorCountry('AUTO')}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                  visitorCountry === 'AUTO'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                Auto ({detectedCountry === 'SA' ? '🇸🇦 SA' : '🇧🇩 BD'})
              </button>
              <button
                type="button"
                onClick={() => setVisitorCountry('BD')}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                  visitorCountry === 'BD'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                🇧🇩 BD
              </button>
              <button
                type="button"
                onClick={() => setVisitorCountry('SA')}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                  visitorCountry === 'SA'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                🇸🇦 SA
              </button>
            </div>
          </div>

          {/* Marquee Outer Container with horizontal overflow hidden */}
          {(() => {
            const activeCountry = visitorCountry === 'AUTO' ? detectedCountry : visitorCountry;
            const filteredGateways = paymentGateways.filter(gateway => {
              if (activeCountry === 'SA') {
                return ['STC Pay', 'STC Bank', 'Al Rajhi Bank'].includes(gateway.name);
              } else {
                return ['bKash', 'Nagad', 'Rocket', 'Bangla QR', 'cellfin', 'IBBL'].includes(gateway.name) || ['bKash', 'Nagad', 'Roket', 'Bangla QR', 'Cellfin', 'IBBL Bank'].includes(gateway.name);
              }
            });

            return (
              <div className="relative w-full overflow-hidden py-3 select-none">
                {/* Smooth Edge Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

                <motion.div 
                  className="flex gap-4 w-max"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{
                    ease: "linear",
                    duration: filteredGateways.length <= 3 ? 12 : 25,
                    repeat: Infinity,
                  }}
                >
                  {/* Quadruple the list for a perfectly seamless infinite loop */}
                  {[...filteredGateways, ...filteredGateways, ...filteredGateways, ...filteredGateways].map((gateway, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 sm:gap-4 px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-neutral-950/45 border border-neutral-800/80 shadow-md backdrop-blur-md min-w-[170px] sm:min-w-[220px] hover:border-neutral-700 transition-colors duration-300 group animate-once"
                    >
                      <div className="flex-1 flex items-center justify-start scale-[1.5] origin-left">
                        {gateway.logo}
                      </div>
                      <div className="h-5 sm:h-6 w-px bg-neutral-800" />
                      <span className="text-[8px] sm:text-[10px] font-mono tracking-wide text-neutral-400 uppercase group-hover:text-white transition-colors duration-300">
                        {gateway.badge}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            );
          })()}
        </div>

        {/* Lower row - 50% smaller padding on mobile */}
        <div className="mt-6 sm:mt-12 pt-4 sm:pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-neutral-500">
          <p>{t.rights}</p>
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <button onClick={() => { setCurrentPage('privacy'); window.scrollTo(0, 0); }} className="hover:text-cyan-400 transition cursor-pointer">
              {language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy'}
            </button>
            <span>•</span>
            <button onClick={() => { setCurrentPage('privacy'); window.scrollTo(0, 0); }} className="hover:text-cyan-400 transition cursor-pointer">
              {language === 'bn' ? 'শর্তাবলী' : 'Terms'}
            </button>
            <span>•</span>
            <button onClick={() => { setCurrentPage('refund'); window.scrollTo(0, 0); }} className="hover:text-cyan-400 transition cursor-pointer">
              {language === 'bn' ? 'রিফান্ড পলিসি' : 'Refund'}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.liveStatus}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
