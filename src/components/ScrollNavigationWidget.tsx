import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface ScrollNavigationWidgetProps {
  language: Language;
  theme: 'light' | 'dark';
}

export default function ScrollNavigationWidget({ language }: ScrollNavigationWidgetProps) {
  const [scrollY, setScrollY] = useState(0);
  const [showWidget, setShowWidget] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<'top' | 'bottom' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Show widget after scrolling 300px
      if (currentScrollY >= 300) {
        setShowWidget(true);
      } else {
        setShowWidget(false);
      }

      // Check if user is near the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = currentScrollY + windowHeight >= documentHeight - 60;
      setIsAtBottom(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  // Tooltip language dictionary
  const tooltipText = {
    en: {
      top: 'Back To Top',
      bottom: 'Go To Bottom',
    },
    bn: {
      top: 'উপরে যান',
      bottom: 'নিচে যান',
    },
    ar: {
      top: 'الرجوع للأعلى',
      bottom: 'الذهاب للأسفل',
    },
  };

  const text = tooltipText[language] || tooltipText.en;

  // Render nothing if we shouldn't show the widget
  if (!showWidget) return null;

  return (
    <div 
      className="fixed bottom-24 right-4 md:right-6 z-[9999] flex flex-col items-center gap-3 font-sans pointer-events-none"
      id="wbd-scroll-navigation-widget"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pointer-events-auto flex flex-col gap-2 p-1.5 rounded-full bg-white/20 dark:bg-slate-950/30 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-[0_15px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
        >
          {/* Scroll To Top Button - Auto-hides when at the very top (though widget itself is hidden under 300px) */}
          <div className="relative group">
            <motion.button
              type="button"
              onClick={scrollToTop}
              onMouseEnter={() => setHoveredButton('top')}
              onMouseLeave={() => setHoveredButton(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 dark:shadow-indigo-950/40 hover:opacity-95 transition-all duration-300 cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 animate-pulse" />
            </motion.button>

            {/* Tooltip (sliding out to the left) */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden sm:block">
              <div className="bg-slate-900/90 dark:bg-slate-950/95 text-white text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700/30 dark:border-slate-800/80 whitespace-nowrap backdrop-blur-sm">
                {text.top}
              </div>
            </div>
          </div>

          {/* Scroll To Bottom Button - Auto-hides when page is at the absolute bottom */}
          <AnimatePresence>
            {!isAtBottom && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.8 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <motion.button
                  type="button"
                  onClick={scrollToBottom}
                  onMouseEnter={() => setHoveredButton('bottom')}
                  onMouseLeave={() => setHoveredButton(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 dark:shadow-cyan-950/40 hover:opacity-95 transition-all duration-300 cursor-pointer"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="w-5 h-5" />
                </motion.button>

                {/* Tooltip */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden sm:block">
                  <div className="bg-slate-900/90 dark:bg-slate-950/95 text-white text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700/30 dark:border-slate-800/80 whitespace-nowrap backdrop-blur-sm">
                    {text.bottom}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
