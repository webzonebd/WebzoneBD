import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlyingCartItem, Language, Currency } from '../types';
import { ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';

interface MacBookCartGenieAnimationProps {
  flyingItems: FlyingCartItem[];
  onItemComplete: (id: string) => void;
  language?: Language;
  currency?: Currency;
}

export default function MacBookCartGenieAnimation({
  flyingItems,
  onItemComplete,
  language = 'en',
  currency = 'USD'
}: MacBookCartGenieAnimationProps) {

  // Play crisp Apple-style interactive feedback chime
  const playMacBookChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // First pleasant high chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      osc1.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.18); // D6
      
      gain1.gain.setValueAtTime(0.06, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.36);

      // Harmonized sub-sine
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc2.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.12); // D5
      gain2.gain.setValueAtTime(0.03, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.3);
    } catch (err) {
      // Browser audio policy fallback
    }
  };

  const triggerDockBounce = () => {
    playMacBookChime();

    // Trigger bounce on Header Cart Button
    const headerCart = document.getElementById('global-header-cart-btn');
    if (headerCart) {
      headerCart.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.4)';
      headerCart.style.transform = 'scale(1.45) translateY(-4px)';
      headerCart.classList.add('ring-4', 'ring-purple-500/50', 'shadow-[0_0_25px_rgba(124,58,237,0.6)]');
      setTimeout(() => {
        headerCart.style.transform = 'scale(0.92)';
      }, 180);
      setTimeout(() => {
        headerCart.style.transform = 'scale(1.1)';
      }, 300);
      setTimeout(() => {
        headerCart.style.transform = 'scale(1)';
        headerCart.classList.remove('ring-4', 'ring-purple-500/50', 'shadow-[0_0_25px_rgba(124,58,237,0.6)]');
      }, 450);
    }

    // Trigger bounce on Mobile Bottom Nav Cart button
    const mobileCart = document.getElementById('nav-item-cart') || document.getElementById('mobile-bottom-cart-btn');
    if (mobileCart) {
      mobileCart.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.4)';
      mobileCart.style.transform = 'scale(1.4) translateY(-6px)';
      setTimeout(() => {
        mobileCart.style.transform = 'scale(0.9)';
      }, 180);
      setTimeout(() => {
        mobileCart.style.transform = 'scale(1.1)';
      }, 300);
      setTimeout(() => {
        mobileCart.style.transform = 'scale(1)';
      }, 450);
    }
  };

  const formatPrice = (price: number) => {
    if (currency === 'BDT') return `৳${(price * 120).toLocaleString()}`;
    if (currency === 'SAR') return `${(price * 3.75).toFixed(0)} SAR`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-visible" aria-hidden="true">
      <AnimatePresence>
        {flyingItems.map(item => {
          // Mid-air peak for authentic curved arc trajectory
          const deltaX = item.endX - item.startX;
          const deltaY = item.endY - item.startY;
          const midX = item.startX + deltaX * 0.5;
          const midY = Math.min(item.startY, item.endY) - 90; // upward curved arc
          
          return (
            <React.Fragment key={item.id}>
              {/* Particle Sparkle Trail */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`sparkle-${item.id}-${i}`}
                  initial={{
                    position: 'fixed',
                    left: item.startX,
                    top: item.startY,
                    scale: 0,
                    opacity: 0.9,
                  }}
                  animate={{
                    left: [item.startX, midX + (i * 12 - 30), item.endX],
                    top: [item.startY, midY + (i * 10 - 20), item.endY],
                    scale: [0, 1.2, 0],
                    opacity: [0.9, 0.6, 0],
                  }}
                  transition={{
                    duration: 0.82,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 shadow-[0_0_12px_rgba(236,72,153,0.8)] pointer-events-none"
                />
              ))}

              {/* Main macOS MacBook Window Card with Genie Animation */}
              <motion.div
                initial={{
                  position: 'fixed',
                  left: item.startX - 90,
                  top: item.startY - 50,
                  scale: 0.85,
                  rotate: 0,
                  opacity: 0.95,
                  filter: 'blur(0px) brightness(1)',
                }}
                animate={{
                  left: [item.startX - 90, midX - 70, item.endX - 20],
                  top: [item.startY - 50, midY, item.endY - 20],
                  // MacBook Genie squeeze/funnel effect: lifts up, curves in mid-air, then squeezes into the dock
                  scale: [0.85, 1.15, 0.8, 0.12],
                  scaleX: [1, 1.1, 0.85, 0.08],
                  scaleY: [1, 1.1, 0.9, 0.5],
                  rotate: [0, -10, 14, 0],
                  opacity: [1, 1, 0.9, 0],
                  filter: [
                    'blur(0px) brightness(1.1)',
                    'blur(0px) brightness(1.25)',
                    'blur(1px) brightness(1.5)',
                    'blur(3px) brightness(2)'
                  ],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.85,
                  ease: [0.25, 0.9, 0.3, 1],
                }}
                onAnimationComplete={() => {
                  triggerDockBounce();
                  onItemComplete(item.id);
                }}
                className="w-44 sm:w-48 rounded-2xl bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl border border-violet-500/40 dark:border-violet-400/40 shadow-[0_20px_50px_rgba(124,58,237,0.45)] dark:shadow-[0_25px_60px_rgba(124,58,237,0.6)] overflow-hidden pointer-events-none"
                style={{
                  transformOrigin: 'bottom right',
                }}
              >
                {/* macOS Window Title Bar with Traffic Lights */}
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-white/10">
                  <div className="flex items-center gap-1.5">
                    {/* Red / Yellow / Green macOS Dots */}
                    <span className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-sm inline-block" />
                    <span className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-sm inline-block" />
                    <span className="w-2 h-2 rounded-full bg-[#27C93F] shadow-sm inline-block" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-violet-500 animate-pulse" />
                    <span className="text-[8px] font-mono font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      Adding to Cart
                    </span>
                  </div>
                </div>

                {/* macOS Card Body */}
                <div className="p-2 flex items-center gap-2">
                  {/* Thumbnail with Glowing Ring */}
                  <div className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-violet-500/30 shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0 text-left">
                    <h5 className="text-[10px] font-extrabold text-slate-900 dark:text-white truncate leading-tight">
                      {item.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-mono font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-500">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-[7.5px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        ✓ In Cart
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom macOS Frosted Accent Strip */}
                <div className="h-1 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />
              </motion.div>
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
