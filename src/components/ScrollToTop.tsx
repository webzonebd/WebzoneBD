import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop({ currentPage = 'home' }: { currentPage?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnyPopupActive, setIsAnyPopupActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button past hero section (approx 400px scroll threshold)
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 400);

      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once initially to set correct state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circular path configuration
  const radius = 20;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && !isAnyPopupActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed z-50 flex items-center justify-center transition-all duration-300 ${
            currentPage === 'services'
              ? 'bottom-36 md:bottom-20 lg:bottom-6 right-4 lg:right-6'
              : 'bottom-20 md:bottom-6 right-4 md:right-6'
          }`}
          id="scroll-to-top-root"
        >
          {/* Main Button Container */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="relative h-11 w-11 sm:h-13 sm:w-13 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group focus:outline-none"
            aria-label="Scroll to top"
            id="scroll-to-top-button"
            style={{
              boxShadow: '0 12px 30px rgba(124, 58, 237, 0.15)',
            }}
          >
            {/* Dynamic Glassmorphism Background layer */}
            <div className="absolute inset-0 rounded-full bg-white dark:bg-[#0F172A] border border-slate-200/50 dark:border-white/10 backdrop-blur-md transition-all duration-300 group-hover:border-violet-500/30 group-hover:shadow-[0_12px_30px_rgba(124,58,237,0.25)]" />

            {/* Premium Progress SVG Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none select-none">
              {/* Circular Track Background */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800/40"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Progress Stroke */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-[url(#scroll-grad)]"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="scroll-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Chevron Icon Container */}
            <div className="relative z-10 text-slate-700 dark:text-slate-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#7C3AED] group-hover:to-[#EC4899] group-hover:bg-clip-text transition-all duration-300">
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
