import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, 
  ExternalLink, Sparkles, ShieldCheck, Facebook,
  ClipboardList
} from 'lucide-react';
import { Language } from '../types';

// High-fidelity Custom SVG Brand Icons
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.634 1.974 14.161.95 11.531.95c-5.44 0-9.866 4.372-9.87 9.802 0 1.974.521 3.9 1.508 5.592l-.993 3.624 3.738-.973zm10.748-7.234c-.29-.145-1.716-.845-1.982-.94-.265-.097-.457-.145-.65.145-.19.29-.738.94-.905 1.133-.166.19-.332.215-.622.07-1.113-.557-1.907-1.02-2.67-2.333-.186-.316.186-.294.532-.98.093-.19.047-.356-.023-.5-.07-.145-.65-1.564-.89-2.143-.233-.562-.49-.485-.674-.495-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.716-.7 1.961-1.374.244-.673.244-1.25.17-1.372-.074-.122-.27-.195-.56-.34z" />
  </svg>
);

const TelegramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.59-3.27 3.61-1.5 4.36-1.76 4.85-1.77.11 0 .35.03.5.15.13.1.17.24.18.34.02.08.03.22.02.35z" />
  </svg>
);

const MessengerIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.31 2 2 6.04 2 11c0 2.82 1.41 5.34 3.61 6.94.19.14.3.36.3.59l-.02 1.83c0 .32.32.55.61.43l2.05-.82c.16-.06.35-.06.51-.01 1 .28 2.06.43 3.14.43 5.69 0 10-4.04 10-9s-4.31-9-10-9zm1.09 11.23l-2.05-2.19-4 2.19 4.4-4.68 2.05 2.19 4-2.19-4.4 4.68z" />
  </svg>
);

interface LiveChatWidgetProps {
  language: Language;
  currentPage?: string;
}

export default function LiveChatWidget({ language, currentPage }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isAnyPopupActive, setIsAnyPopupActive] = useState(false);

  React.useEffect(() => {
    const checkPopups = () => {
      const hasCart = document.getElementById('shopping-cart-slideover-panel');
      const hasOrderModal = document.getElementById('wbd-whatsapp-order-modal');
      const hasAuth = document.getElementById('auth-popup-container');
      const hasSuccess = document.getElementById('congratulations-success-popup');
      
      setIsAnyPopupActive(!!(hasCart || hasOrderModal || hasAuth || hasSuccess));
    };

    checkPopups();

    window.addEventListener('wbd_popup_changed', checkPopups);
    window.addEventListener('whatsapp_order_modal_opened', checkPopups);
    window.addEventListener('whatsapp_order_modal_closed', checkPopups);
    
    const interval = setInterval(checkPopups, 300);

    return () => {
      window.removeEventListener('wbd_popup_changed', checkPopups);
      window.removeEventListener('whatsapp_order_modal_opened', checkPopups);
      window.removeEventListener('whatsapp_order_modal_closed', checkPopups);
      clearInterval(interval);
    };
  }, []);

  if (isAnyPopupActive) {
    return null;
  }

  // Localized high-conversion text values requested by user
  const textDict = {
    en: {
      headerTitle: "WebzoneBD Live Support",
      headerSubtitle: "Online Support & Core Engineering",
      onlineStatus: "Agent Available (Replying in 2 mins)",
      introText: "Assalamu Alaikum! 👋\nNeed a Website, eCommerce store,\nWeb Portal, Hosting, or Digital Marketing? We're Ready to Help.",
      placeholder: "Type a quick message...",
      btnWhatsApp: "WhatsApp",
      btnTelegram: "Telegram",
      btnFacebook: "Messenger",
      directPhone: "Direct Saudi Line: +966 57 051 1931",
      quickSupport: "Riyadh & BD Tech Node Integration Ready",
      quickQueriesTitle: "⚡ Quick Inquiries:",
      tooltipChat: "WebzoneBD Chatbot",
      tooltipWhatsApp: "WhatsApp Live Support",
      tooltipTelegram: "Secure Telegram Support",
      tooltipMessenger: "FB Page Messenger",
      liveChatLabel: "Live Chat",
      whatsappOrderForm: "WhatsApp Order Form"
    },
    bn: {
      headerTitle: "ওয়েবজোনবিডি লাইভ সাপোর্ট",
      headerSubtitle: "অনলাইন সাপোর্ট ও কোর ইঞ্জিনিয়ারিং",
      onlineStatus: "সহায়তা কর্মী অনলাইনে আছে (২ মিনিট প্রতিক্রিয়া)",
      introText: "আসসালামু আলাইকুম! 👋\nএকটি ওয়েবসাইট, ই-কমার্স স্টোর, ওয়েব পোর্টাল, হোস্টিং অথবা ডিজিটাল মার্কেটিং প্রয়োজন? আমরা আপনাকে সাহায্য করতে প্রস্তুত।",
      placeholder: "আপনার বার্তাটি লিখুন...",
      btnWhatsApp: "হোয়াটসঅ্যাপ",
      btnTelegram: "টেলিগ্রাম",
      btnFacebook: "মেসেঞ্জার",
      directPhone: "সৌদি ডিরেক্ট হেল্পলাইন: +966 57 051 1931",
      quickSupport: "রিয়াদ ও বিডি টেকনিক্যাল নোড প্রস্তুত",
      quickQueriesTitle: "⚡ দ্রুত অনুসন্ধান:",
      tooltipChat: "ওয়েবজোনবিডি চ্যাটবট",
      tooltipWhatsApp: "হোয়াটসঅ্যাপ লাইভ চ্যাট",
      tooltipTelegram: "টেলিগ্রাম সিকিউর সাপোর্ট",
      tooltipMessenger: "ফেসবুক পেজ মেসেঞ্জার",
      liveChatLabel: "লাইভ চ্যাট",
      whatsappOrderForm: "হোয়াটসঅ্যাপ অর্ডার ফর্ম"
    },
    ar: {
      headerTitle: "الدعم المباشر WebzoneBD",
      headerSubtitle: "الدعم عبر الإنترنت والهندسة الأساسية",
      onlineStatus: "العميل متصل (رد خلال دقيقتين)",
      introText: "السلام عليكم! 👋\nهل تحتاج إلى موقع إلكتروني، متجر إلكتروني، بوابة ويب، استضافة، أو تسويق رقمي؟ نحن جاهزون لمساعدتك.",
      placeholder: "اكتب رسالة سريعة لبدء المحادثة...",
      btnWhatsApp: "واتساب",
      btnTelegram: "تلغرام",
      btnFacebook: "ماسينجر",
      directPhone: "خط السعودية المباشر: +966 57 051 1931",
      quickSupport: "تكامل تقني احترافي جاهز للخدمة",
      quickQueriesTitle: "⚡ استفسارات سريعة:",
      tooltipChat: "مساعد الذكاء الاصطناعي",
      tooltipWhatsApp: "الدعم المباشر عبر الواتساب",
      tooltipTelegram: "الدعم المباشر عبر التلغرام",
      tooltipMessenger: "محادثة فيسبوك ماسنجر",
      liveChatLabel: "المحادثة المباشرة",
      whatsappOrderForm: "نموذج طلب واتساب"
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
    },
    {
      id: "meeting",
      icon: "📅",
      label: language === 'bn' ? "মিটিং বুকিং" : language === 'ar' ? "حجز موعد" : "Book a Meeting",
      text: language === 'bn'
        ? "আসসালামু আলাইকুম, আমি আমার প্রজেক্ট বা আইটি প্রয়োজনীয়তা নিয়ে আলোচনা করার জন্য মিটিং বুক করতে চাই।"
        : language === 'ar'
        ? "السلام عليكم، أود حجز موعد لمناقشة متطلبات مشروعي التقني."
        : "Hello WebzoneBD, I would like to book a consultation meeting to discuss my IT project requirements."
    }
  ];

  const handleStartWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    <div className="fixed bottom-16 md:bottom-6 left-4 md:left-6 z-50 flex flex-col items-start gap-2.5 font-sans" id="live-chat-floating-root">
      
      {/* Expanded Glassmorphic Chat Window - Apple MacBook macOS Style Window Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.15, 
              y: 40,
              x: -15,
              transformOrigin: "bottom left",
              filter: "blur(8px)"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: 0,
              transformOrigin: "bottom left",
              filter: "blur(0px)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.15, 
              y: 40,
              x: -15,
              transformOrigin: "bottom left",
              filter: "blur(8px)"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 380, 
              damping: 26, 
              mass: 0.85 
            }}
            className="w-[292px] sm:w-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-left will-change-transform"
          >
            {/* Window Header with brand gradients, macOS style traffic lights and clear contrast */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 text-white relative border-b border-white/10">
              {/* macOS style traffic light dots */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-2.5 h-2.5 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
                    title="Close"
                    aria-label="Close"
                  />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-80" />
                </div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-white/60 font-semibold">
                  macOS Window View
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="relative shrink-0">
                  {/* Custom SVG Logo replicating the WebzoneBD branding */}
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center border border-white/30 shadow-md bg-slate-950">
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
                      <circle cx="50" cy="50" r="48" fill="#0b0f19" stroke="url(#wbd-outer-grad)" strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="43" fill="#070a13" stroke="#1e293b" strokeWidth="1" />
                      <circle cx="50" cy="50" r="36" fill="none" stroke="#0f172a" strokeWidth="3.5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                      <path d="M 24,50 A 26 26 0 1 0 76 50" fill="none" stroke="#1e40af" strokeWidth="0.75" opacity="0.5" />
                      <path d="M 28,50 A 22 22 0 1 1 72 50" fill="none" stroke="#059669" strokeWidth="0.5" opacity="0.4" />
                      <circle cx="28" cy="35" r="1.5" fill="#22d3ee" />
                      <circle cx="72" cy="65" r="1.5" fill="#34d399" />
                      <circle cx="44" cy="74" r="1" fill="#3b82f6" />
                      <circle cx="60" cy="27" r="1.2" fill="#10b981" />
                      <path id="wbd-text-top-path" d="M 18,50 A 32 32 0 0 1 82,50" fill="none" stroke="none" />
                      <path id="wbd-text-bottom-path" d="M 82,50 A 32 32 0 0 1 18,50" fill="none" stroke="none" />
                      <text fontSize="6" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4" fill="#ffffff" textAnchor="middle">
                        <textPath href="#wbd-text-top-path" startOffset="50%">WEBZONEBD</textPath>
                      </text>
                      <text fontSize="5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4" fill="#94a3b8" textAnchor="middle">
                        <textPath href="#wbd-text-bottom-path" startOffset="50%">IT SOLUTION</textPath>
                      </text>
                      <polygon points="12,50 14,51.5 13.5,49.5 15,48.5 13,48.5" fill="#38bdf8" />
                      <polygon points="88,50 90,51.5 89.5,49.5 91,48.5 89,48.5" fill="#34d399" />
                      <g>
                        <path d="M 24,38 L 30,38 L 35,51 L 40,38 L 47,38 L 42,55 L 35,55 L 30,44 L 28,52 L 24,52 Z" fill="url(#wbd-blue-grad)" />
                        <path d="M 45,38 L 67,38 L 50,55 L 67,55 L 65,60 L 41,60 L 41,55 L 56,43 L 45,43 Z" fill="url(#wbd-green-grad)" />
                      </g>
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-indigo-900 animate-pulse" />
                </div>
                
                <div>
                  <h4 className="font-extrabold text-[12px] sm:text-[14px] tracking-tight flex items-center gap-1 text-white">
                    <span>{currentText.headerTitle}</span>
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-white/85 font-medium leading-none mt-0.5">{currentText.headerSubtitle}</p>
                </div>
              </div>

              {/* Live Signal Pulse Ribbon */}
              <div className="mt-3 flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 dark:text-emerald-400 text-[8.5px] sm:text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md w-max">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{currentText.onlineStatus}</span>
              </div>
            </div>

            {/* Window Body */}
            <div className="p-4 sm:p-5 space-y-4">
              <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed font-sans whitespace-pre-line bg-slate-50 dark:bg-slate-900/55 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                {currentText.introText}
              </p>

              {/* Interactive Quick-Reply Chips */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <span>{currentText.quickQueriesTitle}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickRepliesList.map((q) => (
                    <motion.button
                      key={q.id}
                      whileHover={{ scale: 1.025 }}
                      whileTap={{ scale: 0.975 }}
                      onClick={() => setTypedMessage(q.text)}
                      type="button"
                      className={`text-[9.5px] sm:text-[10.5px] px-2.5 py-2 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 font-bold w-full ${
                        typedMessage === q.text
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-700 dark:text-cyan-400 shadow-sm font-extrabold"
                          : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/55 dark:hover:bg-slate-850/70 border-slate-200/80 dark:border-slate-800/60 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-[12px]">{q.icon}</span>
                      <span className="truncate">{q.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Dynamic Dispatch input form */}
              <form onSubmit={handleStartWhatsApp} className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="relative">
                  <input 
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder={currentText.placeholder}
                    className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-[10.5px] sm:text-xs border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl pr-9 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2.5 top-2.5 text-blue-500 dark:text-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Direct Quick Connection Channels - PREMIUM HORIZONTAL LAYOUT */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStartWhatsApp()}
                    type="button"
                    className="p-1.5 sm:p-2 rounded-xl border border-emerald-500/15 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all duration-300 flex flex-col items-center justify-center gap-1 text-center cursor-pointer shadow-sm shadow-emerald-500/5 group"
                  >
                    <div className="p-1.5 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold tracking-tight">{currentText.btnWhatsApp}</span>
                  </motion.button>

                  {/* Telegram */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTelegramClick}
                    type="button"
                    className="p-1.5 sm:p-2 rounded-xl border border-sky-500/15 bg-sky-500/5 hover:bg-sky-500/10 text-sky-600 dark:text-sky-400 transition-all duration-300 flex flex-col items-center justify-center gap-1 text-center cursor-pointer shadow-sm shadow-sky-500/5 group"
                  >
                    <div className="p-1.5 rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/10 group-hover:scale-105 transition-transform duration-300">
                      <TelegramIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold tracking-tight">{currentText.btnTelegram}</span>
                  </motion.button>

                  {/* Facebook Messenger */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFacebookClick}
                    type="button"
                    className="p-1.5 sm:p-2 rounded-xl border border-blue-500/15 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all duration-300 flex flex-col items-center justify-center gap-1 text-center cursor-pointer shadow-sm shadow-blue-500/5 group"
                  >
                    <div className="p-1.5 rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
                      <MessengerIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold tracking-tight">{currentText.btnFacebook}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Window Footer */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/70 text-center text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 space-y-1.5 font-mono">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:+8801864000005"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-950/65 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-cyan-400 rounded-xl py-2 px-1.5 border border-slate-200 dark:border-slate-800/40 transition-all hover:scale-[1.02] shadow-sm font-extrabold cursor-pointer text-left"
                  title="Call BD Support Line"
                >
                  <span className="text-[18px] shrink-0">🇧🇩</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[7.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans leading-none font-bold">Direct Call</span>
                    <span className="text-[9.5px] font-mono leading-none mt-1.5 font-extrabold text-slate-700 dark:text-slate-300">0186 400 0005</span>
                  </div>
                </a>
                <a
                  href="tel:+966570511931"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-950/65 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-cyan-400 rounded-xl py-2 px-1.5 border border-slate-200 dark:border-slate-800/40 transition-all hover:scale-[1.02] shadow-sm font-extrabold cursor-pointer text-left"
                  title="Call Saudi Support Line"
                >
                  <span className="text-[18px] shrink-0">🇸🇦</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[7.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans leading-none font-bold">Direct Call</span>
                    <span className="text-[9.5px] font-mono leading-none mt-1.5 font-extrabold text-slate-700 dark:text-slate-300">057 051 1931</span>
                  </div>
                </a>
              </div>
              <p className="opacity-90 font-sans mt-1.5">{currentText.quickSupport}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Horizontal Controller Bar & Dock System */}
      <div className="flex items-center gap-2" id="live-chat-horizontal-dock-container">
        
        {/* Main Launcher Icon */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onMouseEnter={() => setHoveredButton('chat')}
          onMouseLeave={() => setHoveredButton(null)}
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

        {/* Small live pulse tag next to dock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md select-none">
          <span className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse shrink-0" />
          <span className="text-[10px] font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 font-sans uppercase">
            {currentText.liveChatLabel}
          </span>
        </div>

      </div>

    </div>
  );
}
