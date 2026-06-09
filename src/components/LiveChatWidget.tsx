import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, PhoneCall, X, Send, 
  ExternalLink, Sparkles, ShieldCheck, Facebook
} from 'lucide-react';
import { Language } from '../types';

interface LiveChatWidgetProps {
  language: Language;
}

export default function LiveChatWidget({ language }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');

  // Localized high-conversion text values requested by user
  const textDict = {
    en: {
      headerTitle: "WebzoneBD Live Support",
      headerSubtitle: "Online Support & Core Engineering",
      onlineStatus: "Agent Available (Replying in 2 mins)",
      introText: "Assalamu Alaikum! 👋\nNeed a Website, eCommerce store,\nWeb Portal, Hosting, or Digital Marketing? We're Ready to Help.",
      placeholder: "Type a quick message...",
      btnWhatsApp: "Fast WhatsApp Support",
      btnTelegram: "Secure Telegram Support",
      btnFacebook: "Facebook Messenger Support",
      directPhone: "Direct Saudi Line: +966 57 051 1931",
      quickSupport: "Riyadh & BD Tech Node Integration Ready",
      quickQueriesTitle: "⚡ Quick Inquiries:",
    },
    bn: {
      headerTitle: "ওয়েবজোনবিডি লাইভ সাপোর্ট",
      headerSubtitle: "অনলাইন সাপোর্ট ও কোর ইঞ্জিনিয়ারিং",
      onlineStatus: "সহায়তা কর্মী অনলাইনে আছে (২ মিনিট প্রতিক্রিয়া)",
      introText: "আসসালামু আলাইকুম! 👋\nএকটি ওয়েবসাইট, ই-কমার্স স্টোর, ওয়েব পোর্টাল, হোস্টিং অথবা ডিজিটাল মার্কেটিং প্রয়োজন? আমরা আপনাকে সাহায্য করতে প্রস্তুত।",
      placeholder: "আপনার বার্তাটি লিখুন...",
      btnWhatsApp: "হোয়াটসঅ্যাপ লাইভ চ্যাট",
      btnTelegram: "নিরাপদ টেলিগ্রাম চ্যাট",
      btnFacebook: "ফেসবুক মেসেঞ্জার চ্যাট",
      directPhone: "সৌদি ডিরেক্ট হেল্পলাইন: +966 57 051 1931",
      quickSupport: "রিয়াদ ও বিডি টেকনিক্যাল নোড প্রস্তুত",
      quickQueriesTitle: "⚡ দ্রুত অনুসন্ধান:",
    },
    ar: {
      headerTitle: "الدعم المباشر WebzoneBD",
      headerSubtitle: "الدعم عبر الإنترنت والهندسة الأساسية",
      onlineStatus: "العميل متصل (رد خلال دقيقتين)",
      introText: "السلام عليكم! 👋\nهل تحتاج إلى موقع إلكتروني، متجر إلكتروني، بوابة ويب، استضافة، أو تسويق رقمي؟ نحن جاهزون لمساعدتك.",
      placeholder: "اكتب رسالة سريعة لبدء المحادثة...",
      btnWhatsApp: "تواصل سريع عبر واتساب",
      btnTelegram: "تواصل آمن عبر تلغرام",
      btnFacebook: "محادثة فيسبوك ماسنجر",
      directPhone: "خط السعودية المباشر: +966 57 051 1931",
      quickSupport: "تكامل تقني احترافي جاهز للخدمة",
      quickQueriesTitle: "⚡ استفسارات سريعة:",
    }
  };

  const currentText = textDict[language] || textDict.en;

  const quickRepliesList = [
    {
      id: "status",
      icon: "📦",
      label: language === 'bn' ? "অর্ডার স্ট্যাটাস" : language === 'ar' ? "حالة الطلب" : "Check Order Status",
      text: language === 'bn' 
        ? "আসসালামু আলাইকুম, আমি আমার অর্ডারের ডোমেন ও হোস্টিং অ্যাকটিভেশন স্ট্যাটাস পরীক্ষা করতে চাই।" 
        : language === 'ar'
        ? "مرحباً، أود التحقق من حالة طلبي وتفعيل تفاصيل النطاق والاستضافة الخاصة بي."
        : "Hello, I want to check my order and domain/hosting activation status."
    }
  ];

  const handleStartWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = encodeURIComponent(
      typedMessage.trim() || "Assalamu Alaikum WebzoneBD, I would like to inquire about your premium IT solutions and custom system scripts."
    );
    window.open(`https://wa.me/966570511931?text=${cleanMsg}`, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramClick = () => {
    window.open(`https://t.me/webzonebdit`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookClick = () => {
    window.open(`https://www.facebook.com/Webzonebd`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-center gap-2 font-sans" id="live-chat-floating-root">
      {/* Floating Toggle Button with Glowing Effect - Mobile compact layout */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className={`h-11 w-11 sm:h-14 sm:w-14 rounded-full text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative ${
          isOpen 
            ? 'bg-neutral-800 dark:bg-slate-900 border border-neutral-700/50 dark:border-slate-800' 
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-blue-500/25 dark:shadow-cyan-400/10'
        }`}
        title="WebzoneBD Tech Helpdesk"
        aria-label="Toggle Live Assist"
      >
        {/* Double animated rings around the button */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping opacity-75" />
            <span className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-pulse" />
          </>
        )}
        
        {isOpen ? (
          <X className="w-4 h-4 sm:w-6 sm:h-6 rotate-0 transition-transform duration-300" />
        ) : (
          <div className="flex items-center justify-center relative">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="h-2 w-2 rounded-full bg-emerald-400 border border-white absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </motion.button>

      {/* Brand Label with WebzoneBD Logo underneath, clickable to toggle - hidden on mobile viewports */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex flex-col items-center select-none cursor-pointer opacity-90 hover:opacity-100 transition-all duration-200"
      >
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
          {/* Miniature live signal pulse indicator */}
          <span className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse shrink-0" />
          <span className="text-[10px] font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 font-sans uppercase">
            WebzoneBD
          </span>
        </div>
      </div>

      {/* Floating Glassmorphic Chat Window - Expanded to w-[260px] (20% bigger than 216px) on mobile, w-[360px] on desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="absolute bottom-18 sm:bottom-28 left-0 w-[265px] sm:w-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-950 backdrop-blur-xl text-left"
          >
            {/* Window Header with brand gradients and clear contrast */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 text-white relative border-b border-white/10">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="relative shrink-0">
                  {/* Dynamic Custom-sculpted SVG Logo replicating the uploaded WebzoneBD branding */}
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center border border-white/30 shadow-md">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="wbd-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="wbd-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <linearGradient id="wbd-outer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f8fafc" />
                          <stop offset="50%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                      </defs>
                      {/* Dark futuristic metal circle medallion base */}
                      <circle cx="50" cy="50" r="48" fill="#0b0f19" stroke="url(#wbd-outer-grad)" strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="43" fill="#070a13" stroke="#1e293b" strokeWidth="1" />
                      
                      {/* Circuit elements & tracks */}
                      <circle cx="50" cy="50" r="36" fill="none" stroke="#0f172a" strokeWidth="3.5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                      <path d="M 24,50 A 26 26 0 1 0 76 50" fill="none" stroke="#1e40af" strokeWidth="0.75" opacity="0.5" />
                      <path d="M 28,50 A 22 22 0 1 1 72 50" fill="none" stroke="#059669" strokeWidth="0.5" opacity="0.4" />
                      
                      {/* Glowing circuit nodes */}
                      <circle cx="28" cy="35" r="1.5" fill="#22d3ee" className="animate-pulse" />
                      <circle cx="72" cy="65" r="1.5" fill="#34d399" className="animate-pulse" />
                      <circle cx="44" cy="74" r="1" fill="#3b82f6" />
                      <circle cx="60" cy="27" r="1.2" fill="#10b981" />
                      
                      {/* Text paths */}
                      <path id="wbd-text-top-path" d="M 18,50 A 32 32 0 0 1 82,50" fill="none" stroke="none" />
                      <path id="wbd-text-bottom-path" d="M 82,50 A 32 32 0 0 1 18,50" fill="none" stroke="none" />
                      
                      {/* Brand curved labels */}
                      <text fontSize="6" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4" fill="#ffffff" textAnchor="middle">
                        <textPath href="#wbd-text-top-path" startOffset="50%">WEBZONEBD</textPath>
                      </text>
                      <text fontSize="5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4" fill="#94a3b8" textAnchor="middle">
                        <textPath href="#wbd-text-bottom-path" startOffset="50%">IT SOLUTION</textPath>
                      </text>
                      
                      {/* Tiny stars separating the texts */}
                      <polygon points="12,50 14,51.5 13.5,49.5 15,48.5 13,48.5" fill="#38bdf8" />
                      <polygon points="88,50 90,51.5 89.5,49.5 91,48.5 89,48.5" fill="#34d399" />
                      
                      {/* Masterfully placed futuristic "WZ" letters */}
                      <g>
                        {/* W */}
                        <path d="M 24,38 L 30,38 L 35,51 L 40,38 L 47,38 L 42,55 L 35,55 L 30,44 L 28,52 L 24,52 Z" fill="url(#wbd-blue-grad)" />
                        {/* Z */}
                        <path d="M 45,38 L 67,38 L 50,55 L 67,55 L 65,60 L 41,60 L 41,55 L 56,43 L 45,43 Z" fill="url(#wbd-green-grad)" />
                      </g>
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-emerald-400 border border-indigo-900 animate-pulse" />
                </div>
                
                <div>
                  <h4 className="font-extrabold text-[12px] sm:text-[14px] tracking-tight flex items-center gap-1 text-white">
                    <span>{currentText.headerTitle}</span>
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-white/85 font-medium leading-none mt-0.5">{currentText.headerSubtitle}</p>
                </div>
              </div>

              {/* Live Signal Verified Ribbon */}
              <div className="mt-3 flex items-center gap-1 sm:gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 dark:text-emerald-400 text-[8.5px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md w-max">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>{currentText.onlineStatus}</span>
              </div>
            </div>

            {/* Window Body - Perfect contrast in dark/light mode, with line break support */}
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed font-sans whitespace-pre-line bg-slate-50 dark:bg-slate-900/55 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                {currentText.introText}
              </p>

              {/* Direct Quick Connection Channels */}
              <div className="space-y-1.5 sm:space-y-2">
                {/* Instant WhatsApp Support Node */}
                <motion.button
                  whileHover={{ scale: 1.015, y: -0.5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartWhatsApp}
                  className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] sm:text-xs rounded-xl transition duration-200 shadow-md shadow-emerald-600/10 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">💬</span>
                    <span>{currentText.btnWhatsApp}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </motion.button>

                {/* Instant Telegram Tunnel Support */}
                <motion.button
                  whileHover={{ scale: 1.015, y: -0.5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTelegramClick}
                  className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-[10px] sm:text-xs rounded-xl transition duration-200 shadow-md shadow-sky-600/10 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✈️</span>
                    <span>{currentText.btnTelegram}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </motion.button>

                {/* Instant Facebook Messenger Node */}
                <motion.button
                  whileHover={{ scale: 1.015, y: -0.5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFacebookClick}
                  className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] sm:text-xs rounded-xl transition duration-200 shadow-md shadow-blue-600/10 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Facebook className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>{currentText.btnFacebook}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </motion.button>
              </div>

              {/* Interactive Quick-Reply Chips */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <span>{currentText.quickQueriesTitle}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickRepliesList.map((q) => (
                    <motion.button
                      key={q.id}
                      whileHover={{ scale: 1.025 }}
                      whileTap={{ scale: 0.975 }}
                      onClick={() => setTypedMessage(q.text)}
                      type="button"
                      className={`text-[9.5px] sm:text-[11px] px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer flex items-center gap-1 font-semibold ${
                        typedMessage === q.text
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-700 dark:text-cyan-400 shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/55 dark:hover:bg-slate-850/70 border-slate-200/80 dark:border-slate-800/60 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{q.icon}</span>
                      <span>{q.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Dynamic Dispatch text input */}
              <form onSubmit={handleStartWhatsApp} className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="relative">
                  <input 
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder={currentText.placeholder}
                    className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-[10.5px] sm:text-xs border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl pr-9 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2.5 top-2.5 text-blue-500 dark:text-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Window Footer with solved Light & Dark mode text colors */}
            <div className="px-4 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/70 text-center text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5 font-mono">
              <p className="font-extrabold flex items-center justify-center gap-1.5 text-slate-800 dark:text-cyan-400 bg-white dark:bg-slate-950/65 rounded-lg py-1 border border-slate-200 dark:border-slate-800/40">
                <PhoneCall className="w-2.5 h-2.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                <span>{currentText.directPhone}</span>
              </p>
              <p className="opacity-90 font-sans mt-1">{currentText.quickSupport}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
