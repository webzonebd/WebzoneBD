import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, Flame, TrendingUp, Sparkles, Send, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface PromotionalOfferSystemProps {
  language: Language;
  triggerToast: (msg: string) => void;
  setCurrentPage: (page: string) => void;
  isAdmin?: boolean;
}

export default function PromotionalOfferSystem({
  language,
  triggerToast,
  setCurrentPage,
  isAdmin = false,
}: PromotionalOfferSystemProps) {
  // Modal visibility states
  const [showNewsletter, setShowNewsletter] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);

  // Floating notifications visibility
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [activeNotifyIndex, setActiveNotifyIndex] = useState<number>(0);

  // Keep tracking timer and event listeners
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollingRef = useRef<boolean>(false);

  // Helper check: Is pop-up allowed to show (once per visitor / 7 days cooldown)
  const isPopupAllowed = (): boolean => {
    if (isAdmin) return false;
    const isSubscribed = localStorage.getItem('webzone_newsletter_subscribed');
    if (isSubscribed === 'true') return false;

    const closedAt = localStorage.getItem('webzone_newsletter_closed_at');
    if (closedAt) {
      const parsedTime = parseInt(closedAt, 10);
      const cooldownMs = 7 * 24 * 60 * 60 * 1000; // 7 days
      if (Date.now() - parsedTime < cooldownMs) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (isAdmin) {
      setShowNewsletter(false);
      setShowNotification(false);
      return;
    }

    // ----------------------------------------------------
    // POPUP TRIGGER 1: 10 Seconds Inactivity Detection
    // ----------------------------------------------------
    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Check permissions and states first
      if (!isPopupAllowed() || showNewsletter || subscribed) return;

      inactivityTimerRef.current = setTimeout(() => {
        // Trigger popup if conditions are met
        if (isPopupAllowed()) {
          setShowNewsletter(true);
        }
      }, 10000); // 10 seconds of user inactivity
    };

    // User activity events to check inactivity
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Start initial timer
    resetInactivityTimer();

    // ----------------------------------------------------
    // POPUP TRIGGER 2: user scrolls 50% of page
    // ----------------------------------------------------
    const handleScroll = () => {
      if (scrollingRef.current || !isPopupAllowed() || showNewsletter || subscribed) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;

      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= 50) {
        scrollingRef.current = true;
        if (isPopupAllowed()) {
          setShowNewsletter(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ----------------------------------------------------
    // OFFER NOTIFICATION CARDS: Bottom Right Corner
    // ----------------------------------------------------
    // Show 5 seconds after page loads
    const loadNotificationTimer = setTimeout(() => {
      // Toggle banner
      setShowNotification(true);
      // Alternate notice content inside the mini cards
      setActiveNotifyIndex(0);
    }, 5000);

    // Auto-hide after 15 seconds (Total 20s from page load)
    const hideNotificationTimer = setTimeout(() => {
      setShowNotification(false);
    }, 20000);

    // Rotation cycle between notification cards inside the 15-second visible window
    const rotateInterval = setInterval(() => {
      setActiveNotifyIndex((prev) => (prev === 0 ? 1 : 0));
    }, 7500);

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(loadNotificationTimer);
      clearTimeout(hideNotificationTimer);
      clearInterval(rotateInterval);
    };
  }, [showNewsletter, subscribed, isAdmin]);

  // Handle closing popup
  const handleCloseNewsletter = () => {
    setShowNewsletter(false);
    localStorage.setItem('webzone_newsletter_closed_at', Date.now().toString());
  };

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      triggerToast(language === 'bn' ? 'অনুগ্রহ করে একটি ইমেল ঠিকানা প্রদান করুন।' : 'Please specify a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem('webzone_newsletter_subscribed', 'true');
      localStorage.setItem('webzone_newsletter_subscribed_email', email);
      if (name) {
        localStorage.setItem('webzone_newsletter_subscribed_name', name);
      }
      setIsSubmitting(false);
      setSubscribed(true);
      triggerToast(
        language === 'bn'
          ? 'ধন্যবাদ! আপনার সাবস্ক্রিপশন সফল হয়েছে। 🚀'
          : 'Awesome! You are successfully subscribed to our business insights! 🚀'
      );

      // Dismiss after 2 seconds
      setTimeout(() => {
        setShowNewsletter(false);
      }, 2000);
    }, 1200);
  };

  // Custom action router helper for smooth transitions
  const handleRedirectAndScroll = (tab: 'google-business' | 'growth-package') => {
    localStorage.setItem('webzone_target_services_tab', tab);
    setCurrentPage('services');

    triggerToast(
      language === 'bn'
        ? 'ডিজিটাল সার্ভিস পোর্টালে ডাইরেক্ট করা হচ্ছে...'
        : 'Directing you safely to digital service suite...'
    );

    // Close components
    setShowNewsletter(false);
    setShowNotification(false);

    // Smooth scroll to services area
    setTimeout(() => {
      const element = document.getElementById('services-main-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  // Mini notification data definition
  const notificationOffers = [
    {
      badge: language === 'bn' ? '🔥 সীমিত অফার' : '🔥 Limited Time Offer',
      title: language === 'bn' ? 'গুগল বিজনেস সেটআপ সার্ভিস' : 'Google Business Setup',
      desc: language === 'bn' ? 'গুগলে আপনার লোকাল কাস্টমার বৃদ্ধি করুন।' : 'Boost your local presence on Google.',
      btn: language === 'bn' ? 'অফার দেখুন' : 'View Offer',
      target: 'google-business' as const,
    },
    {
      badge: language === 'bn' ? '🚀 গ্রোথ প্যাকেজ' : '🚀 Business Growth Package',
      title: language === 'bn' ? 'বিজনেস গ্রোথ সার্ভিস' : 'Business Growth Package',
      desc: language === 'bn' ? 'স্টার্টআপ এবং নতুনের জন্য ওয়েবসাইট প্লাস ব্র্যান্ডিং।' : 'Everything your startup needs to grow online.',
      btn: language === 'bn' ? 'প্যাকেজ দেখুন' : 'Explore Package',
      target: 'growth-package' as const,
    },
  ];

  const activeNotice = notificationOffers[activeNotifyIndex];

  return (
    <>
      <AnimatePresence>
        {/* ========================================================= */}
        {/* PREMIUM GLASSMORPHISM NEWSLETTER MODAL INTERFACE          */}
        {/* ========================================================= */}
        {showNewsletter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            {/* Background animated overlay bubbles */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '3s' }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-2xl bg-slate-900/40 dark:bg-slate-950/65 backdrop-blur-xl rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-white/10 dark:border-cyan-500/25 max-h-[90vh] overflow-y-auto overflow-x-hidden"
              style={{
                boxShadow: '0 0 40px rgba(6, 182, 212, 0.15)',
              }}
            >
              {/* Neon Glow top-line indicator */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-t-3xl" />

              {/* Close Button */}
              <button
                onClick={handleCloseNewsletter}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition duration-200 cursor-pointer"
                title={language === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 pt-3 text-left">
                {/* Header Text */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 tracking-wider">
                      {language === 'bn' ? 'গ্যারান্টিড গ্রোথ 🚀' : 'GROWTH GUARANTEED 🚀'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3.5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                    {language === 'bn' ? '🚀 আপনার ব্যবসা দ্রুত বাড়ান' : '🚀 Grow Your Business Faster'}
                  </h2>
                  <p className="text-sm dark:text-slate-350 text-slate-100 font-sans leading-relaxed">
                    {language === 'bn'
                      ? 'আমাদের এক্সক্লুসিভ অফার, ব্যবসার বৃদ্ধি সংক্রান্ত টিপস, গুগল বিজনেস প্রোফাইল সেটআপ এবং লোকাল এসইও সলিউশন সবার আগে সরাসরি পেয়ে যান আপনার ইনবক্সে।'
                      : 'Get exclusive offers, business growth tips, Google Business Profile setup services, local SEO solutions, and special discounts delivered directly to your inbox.'}
                  </p>
                </div>

                {/* OFFER CARDS SECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Offer Card 1: Google Business Setup */}
                  <div 
                    onClick={() => handleRedirectAndScroll('google-business')}
                    className="group bg-white/5 dark:bg-slate-900/50 hover:bg-white/10 border border-white/10 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div>
                      <span className="text-xl mb-1.5 block">📍</span>
                      <h4 className="font-extrabold text-sm text-cyan-300 group-hover:text-cyan-200 flex items-center gap-1">
                        {language === 'bn' ? 'গুগল বিনজেস সেটআপ' : 'Google Business Setup'}
                      </h4>
                      <p className="text-xs text-slate-300 dark:text-slate-400 mt-1 leading-normal font-sans">
                        {language === 'bn'
                          ? 'গুগল সার্চ ও ম্যাপে আসার পাশাপাশি লোকাল ভিজিবিলিটি অনেক বাড়ান।'
                          : 'Improve your local visibility and appear on Google Search & Maps.'}
                      </p>
                    </div>
                    <button className="mt-3 text-[11px] font-black uppercase text-cyan-400 group-hover:underline flex items-center gap-1 text-left">
                      {language === 'bn' ? 'আরও জানুন' : 'Learn More'} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Offer Card 2: Business Growth Package */}
                  <div 
                    onClick={() => handleRedirectAndScroll('growth-package')}
                    className="group bg-white/5 dark:bg-slate-900/50 hover:bg-white/10 border border-white/10 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div>
                      <span className="text-xl mb-1.5 block">📈</span>
                      <h4 className="font-extrabold text-sm text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                        {language === 'bn' ? 'বিজনেস গ্রোথ প্যাকেজ' : 'Business Growth Package'}
                      </h4>
                      <p className="text-xs text-slate-300 dark:text-slate-400 mt-1 leading-normal font-sans">
                        {language === 'bn'
                          ? 'স্টার্টআপ এবং নতুন উদ্যোক্তাদের জন্য প্রিমিয়াম ওয়েবসাইট এবং ডিজিটাল মার্কেটিং।'
                          : 'Website, SEO, Branding & Digital Marketing solutions for startups and growing businesses.'}
                      </p>
                    </div>
                    <button className="mt-3 text-[11px] font-black uppercase text-emerald-400 group-hover:underline flex items-center gap-1 text-left">
                      {language === 'bn' ? 'প্যাকেজ দেখুন' : 'View Package'} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* SUBSCRIPTION FORM BLOCK */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
                  {subscribed ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center py-4 space-y-2 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center">
                        <Check className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <h4 className="font-extrabold text-lg">
                        {language === 'bn' ? 'সাবস্ক্রিপশন সফল!' : 'Subscription Successful!'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {language === 'bn' ? 'আপনি সফলভাবে সাবস্ক্রাইব করেছেন।' : 'Thank you for choosing to grow your business with us.'}
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Name Field */}
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1 font-mono">
                            {language === 'bn' ? 'আপনার নাম' : 'Name'}
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={language === 'bn' ? 'যেমন: সাকিব হোসেন' : 'e.g., John Doe'}
                            className="w-full px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-sm text-white placeholder-slate-500 font-sans transition"
                          />
                        </div>

                        {/* Email Field */}
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1 font-mono">
                            {language === 'bn' ? 'ইমেল অ্যাড্রেস *' : 'Email Address *'}
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={language === 'bn' ? 'যেমন: query@yourbrand.com' : 'e.g., query@yourbrand.com'}
                            className="w-full px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 text-sm text-white placeholder-slate-500 font-sans transition"
                          />
                        </div>
                      </div>

                      {/* Modal Footer Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleCloseNewsletter}
                          className="w-full sm:w-auto px-5 py-2.5 border border-white/10 rounded-xl hover:bg-white/10 text-slate-350 hover:text-white transition cursor-pointer text-xs font-bold text-center"
                        >
                          {language === 'bn' ? 'পরে করবেন' : 'Maybe Later'}
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 font-black text-slate-950 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition cursor-pointer text-xs uppercase flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <span>{language === 'bn' ? 'অপেক্ষা করুন...' : 'Submitting...'}</span>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>{language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Now'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* FLOATING CORNER NOTIFICATION OFFER CARD PANELS            */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[320px] sm:w-[350px]"
          >
            <div
              className="relative p-5 bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 text-white group overflow-hidden"
              style={{
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(239, 68, 68, 0.1)',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)',
              }}
            >
              {/* Highlight Hover border pulse animation effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-rose-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition duration-200 cursor-pointer z-10"
                title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-3 relative z-10 text-left">
                {/* Ribbon Tag */}
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-red-500/15 text-rose-400 border border-red-500/20 rounded-md">
                    {activeNotice.badge}
                  </span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white tracking-tight pr-5 leading-tight">
                    {activeNotice.title}
                  </h4>
                  <p className="text-xs text-slate-300 dark:text-slate-400 font-sans leading-normal">
                    {activeNotice.desc}
                  </p>
                </div>

                {/* Confirming Action redirect button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleRedirectAndScroll(activeNotice.target)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-slate-950 font-black text-[10px] uppercase rounded-lg transition duration-200 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 flex items-center gap-1"
                  >
                    <span>{activeNotice.btn}</span>
                    <ArrowRight className="w-3 h-3 stroke-[3.5]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
