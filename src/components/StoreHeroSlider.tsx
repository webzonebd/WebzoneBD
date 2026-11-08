import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Star, ShoppingBag, ExternalLink, Eye, Heart, 
  ChevronLeft, ChevronRight, Play, ShieldCheck, 
  Sparkles, Flame, CheckCircle2, Download, Zap, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Language, Theme } from '../types';
import { StoreCategory } from './StoreData';

interface StoreHeroSliderProps {
  products: Product[];
  language: Language;
  theme: Theme;
  formatPrice: (price: number) => string;
  addToCart: (product: Product, eventOrOrigin?: any) => void;
  setCartOpen?: (open: boolean) => void;
  onViewProduct?: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  activeCategory?: string;
  categories?: StoreCategory[];
  triggerToast?: (msg: string) => void;
  onQuickBuy?: (product: Product, eventOrOrigin?: any) => void;
}

export default function StoreHeroSlider({
  products,
  language,
  theme,
  formatPrice,
  addToCart,
  setCartOpen,
  onViewProduct,
  wishlist,
  toggleWishlist,
  activeCategory = 'all',
  categories = [],
  triggerToast,
  onQuickBuy
}: StoreHeroSliderProps) {
  // Select 5-6 top spotlight products for the Google Play style hero slider
  const slides = React.useMemo(() => {
    let pool = [...products];
    if (activeCategory && activeCategory !== 'all') {
      const catProducts = pool.filter(p => p.category === activeCategory);
      if (catProducts.length >= 2) {
        pool = catProducts;
      }
    }

    // Filter featured, best sellers, high ratings, or top downloaded scripts
    const curated = pool.filter(p => p.isFeatured || p.isTrending || p.isBestSeller || p.rating >= 4.7);
    const chosen = curated.length >= 3 ? curated : pool;
    return chosen.slice(0, 6);
  }, [products, activeCategory]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayTimerRef = useRef<any>(null);
  const SLIDE_DURATION = 5500; // 5.5s per slide

  // Reset index if category changes and slides length shrinks
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Navigate to next slide
  const handleNext = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Navigate to previous slide
  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, handleNext, slides.length]);

  // Swipe handling
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  // Helper for category name
  const getCatName = (catId: string) => {
    const c = categories.find(cat => cat.id === catId);
    if (!c) return catId.replace('-', ' ').toUpperCase();
    return language === 'bn' ? c.nameBn : language === 'ar' ? c.nameAr : c.name;
  };

  // Google Play style dynamic theme colors per slide index
  const themeAccents = [
    {
      gradient: 'from-[#0B132B] via-[#1C2541] to-[#0a1128]',
      accentBg: 'bg-emerald-500',
      accentText: 'text-emerald-400',
      accentBorder: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      glow: 'rgba(16, 185, 129, 0.25)',
      btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/25',
      tagBadge: language === 'bn' ? "⭐ গুগল প্লে এডিটরস চয়েস" : language === 'ar' ? "⭐ اختيار المحررين" : "⭐ GOOGLE PLAY EDITORS' CHOICE"
    },
    {
      gradient: 'from-[#0f172a] via-[#1e1b4b] to-[#090d16]',
      accentBg: 'bg-indigo-500',
      accentText: 'text-indigo-400',
      accentBorder: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      glow: 'rgba(99, 102, 241, 0.28)',
      btnBg: 'bg-indigo-500 hover:bg-indigo-400 text-white font-black shadow-indigo-500/25',
      tagBadge: language === 'bn' ? "🔥 ট্রেন্ডিং ফ্ল্যাগশিপ স্ক্রিপ্ট" : language === 'ar' ? "🔥 البرمجيات الأكثر طلباً" : "🔥 TOP TRENDING FLAGSHIP"
    },
    {
      gradient: 'from-[#0c1a1e] via-[#0e2a36] to-[#050e14]',
      accentBg: 'bg-cyan-500',
      accentText: 'text-cyan-400',
      accentBorder: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      glow: 'rgba(6, 182, 212, 0.28)',
      btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-cyan-500/25',
      tagBadge: language === 'bn' ? "⚡ হাই-স্পিড রেডি সলিউশন" : language === 'ar' ? "⚡ برمجيات عالية السرعة" : "⚡ HIGH-SPEED READY SCRIPT"
    },
    {
      gradient: 'from-[#1e130c] via-[#2a170e] to-[#0f0a06]',
      accentBg: 'bg-amber-500',
      accentText: 'text-amber-400',
      accentBorder: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      glow: 'rgba(245, 158, 11, 0.25)',
      btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/25',
      tagBadge: language === 'bn' ? "👑 বেস্টসেলার মার্কেটপ্লেস পিক" : language === 'ar' ? "👑 الأفضل مبيعاً هذا الشهر" : "👑 #1 BESTSELLER MARKETPLACE PICK"
    },
    {
      gradient: 'from-[#1a0f1d] via-[#281330] to-[#0d0711]',
      accentBg: 'bg-purple-500',
      accentText: 'text-purple-400',
      accentBorder: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      glow: 'rgba(168, 85, 247, 0.28)',
      btnBg: 'bg-purple-500 hover:bg-purple-400 text-white font-black shadow-purple-500/25',
      tagBadge: language === 'bn' ? "✨ প্রিমিয়াম ভেরিফাইড কোড" : language === 'ar' ? "✨ كود برمجي موثق بالكامل" : "✨ PREMIUM VERIFIED SOURCE CODE"
    },
    {
      gradient: 'from-[#161329] via-[#201d40] to-[#0b0a17]',
      accentBg: 'bg-sky-500',
      accentText: 'text-sky-400',
      accentBorder: 'border-sky-500/30',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      glow: 'rgba(14, 165, 233, 0.28)',
      btnBg: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-sky-500/25',
      tagBadge: language === 'bn' ? "🚀 নতুন আল্ট্রা রিলিজ" : language === 'ar' ? "🚀 إصدار جديد متقدم" : "🚀 NEW ULTRA RELEASE"
    }
  ];

  const currentTheme = themeAccents[currentIndex % themeAccents.length];
  const isWishlisted = wishlist.includes(currentSlide.id);

  // Discount percentage calculation
  const originalPrice = currentSlide.discountPrice ? currentSlide.price : Math.round(currentSlide.price * 1.35);
  const activePrice = currentSlide.discountPrice || currentSlide.price;
  const discountPercent = Math.round(((originalPrice - activePrice) / originalPrice) * 100);

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  return (
    <div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden select-none"
      id="digital-store-google-play-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 🌟 GOOGLE PLAY STORE HERO BILLBOARD CONTAINER */}
      <div 
        className={`relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-br ${currentTheme.gradient} text-white overflow-hidden shadow-2xl border border-white/10 transition-colors duration-700`}
        style={{
          boxShadow: `0 20px 50px -15px ${currentTheme.glow}, 0 0 0 1px rgba(255, 255, 255, 0.08) inset`
        }}
      >
        {/* Background ambient lighting & grid aesthetic like Google Play */}
        <div 
          className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
        />
        
        {/* Dynamic Glow Orbs */}
        <div 
          className="absolute -top-28 -right-28 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60"
          style={{ background: currentTheme.glow }}
        />
        <div 
          className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40"
          style={{ background: currentTheme.glow }}
        />

        {/* Ambient hero artwork backdrop vignette */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <img 
            src={currentSlide.image} 
            alt="Hero Backdrop"
            className="w-full h-full object-cover filter blur-2xl scale-125 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        {/* 🎬 SLIDER ANIMATED WRAPPER */}
        <div className="relative min-h-[380px] sm:min-h-[340px] p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide.id + currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col items-center sm:items-start text-center sm:text-left space-y-3.5 sm:space-y-4 z-10"
            >
              {/* Editors' Choice / Top Tag Badge */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`px-3 py-1 text-[11px] font-mono tracking-wider font-extrabold uppercase rounded-full border flex items-center gap-1.5 shadow-sm ${currentTheme.badgeBg}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentTheme.tagBadge}</span>
                </span>

                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-300 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                  {getCatName(currentSlide.category)}
                </span>

                {currentSlide.badge && (
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-black text-amber-300 bg-amber-500/20 rounded-full border border-amber-500/30">
                    {currentSlide.badge}
                  </span>
                )}
              </div>

              {/* Script Title & App Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4">
                {/* Google Play App Icon */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl md:rounded-[22px] overflow-hidden border-2 border-white/20 shadow-xl shrink-0 group">
                  <img 
                    src={currentSlide.image} 
                    alt={currentSlide.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Title & Developer Attribution */}
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight drop-shadow-sm">
                    {language === 'bn' ? currentSlide.nameBn || currentSlide.name : language === 'ar' ? currentSlide.nameAr || currentSlide.name : currentSlide.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                      WebzoneBD Verified
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono text-xs">v{currentSlide.tags?.[0] || '2.4'} Updated</span>
                    <span>•</span>
                    <span className="text-cyan-300 font-mono text-xs flex items-center gap-1">
                      <Award className="w-3 h-3 text-cyan-400" />
                      Lifetime License
                    </span>
                  </p>
                </div>
              </div>

              {/* Rating, Installs & Trust Metrics Row (Google Play Store format) */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-slate-200 border-y border-white/10 py-2.5 my-1 w-full sm:w-auto">
                {/* Star Rating */}
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white font-mono">{currentSlide.rating.toFixed(1)}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(currentSlide.rating) ? 'fill-amber-400' : 'text-slate-600'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">({currentSlide.reviewsCount || 48})</span>
                </div>

                <span className="text-white/20">|</span>

                {/* Downloads Count */}
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-white">{currentSlide.downloadsCount || 240}+</span>
                  <span className="text-slate-400">{language === 'bn' ? 'ডাউনলোড' : 'Installs'}</span>
                </div>

                <span className="text-white/20">|</span>

                {/* Clean Code Assurance */}
                <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'bn' ? '১০০% ক্লিন কোড' : '100% Virus-Free'}</span>
                </div>
              </div>

              {/* Short Google Play Description */}
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-sans max-w-3xl text-center sm:text-left">
                {language === 'bn' ? currentSlide.descriptionBn || currentSlide.description : language === 'ar' ? currentSlide.descriptionAr || currentSlide.description : currentSlide.description}
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                {(currentSlide.features?.slice(0, 4) || ['Responsive Layout', 'Admin Control Panel', 'Payment Gateways']).map((feat, idx) => (
                  <span 
                    key={idx}
                    className="text-[10.5px] px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/5 backdrop-blur-sm flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    {feat}
                  </span>
                ))}
              </div>

              {/* Price, Offers & Action CTAs (Google Play Action Center) */}
              <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 w-full">
                {/* Price Tag with discount - CENTERED ON MOBILE */}
                <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <div className="inline-flex items-baseline justify-center gap-2.5 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-center shadow-lg">
                    <span className="text-2xl sm:text-2xl font-black font-mono text-white tracking-tight">
                      {formatPrice(activePrice)}
                    </span>
                    {originalPrice > activePrice && (
                      <>
                        <span className="text-xs font-mono text-slate-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons - CENTERED ON MOBILE */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto">
                  {/* Primary CTA: Quick Buy / Install Script (Google Play Button) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onQuickBuy) {
                        onQuickBuy(currentSlide, e);
                      } else {
                        addToCart(currentSlide, e);
                        if (setCartOpen) {
                          setCartOpen(true);
                        }
                        if (triggerToast) {
                          triggerToast(
                            language === 'bn' 
                              ? `⚡ ${currentSlide.nameBn || currentSlide.name} কার্টে যোগ হয়েছে! চেকআউটে নেওয়া হচ্ছে...` 
                              : `⚡ ${currentSlide.name} added! Redirecting to checkout...`
                          );
                        }
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition-all duration-200 transform active:scale-95 cursor-pointer ${currentTheme.btnBg}`}
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-300" />
                    <span>{language === 'bn' ? 'কুইক বাই (ইনস্টল)' : language === 'ar' ? 'شراء سريع' : 'Quick Buy'}</span>
                  </button>

                  {/* Secondary CTA: Live Demo */}
                  {currentSlide.demoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(currentSlide.demoUrl, '_blank');
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                      <span>{language === 'bn' ? 'লাইভ ডেমো' : language === 'ar' ? 'معاينة حية' : 'Live Demo'}</span>
                    </button>
                  )}

                  {/* Tertiary: View Details */}
                  {onViewProduct && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProduct(currentSlide);
                      }}
                      className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 backdrop-blur-md transition cursor-pointer"
                      title={language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  {/* Wishlist Heart with subtle pulse feedback */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isWishlisted) {
                        setRecentlyAddedId(currentSlide.id);
                        setTimeout(() => {
                          setRecentlyAddedId((prev) => (prev === currentSlide.id ? null : prev));
                        }, 850);
                      }
                      toggleWishlist(currentSlide.id);
                      if (triggerToast) {
                        triggerToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
                      }
                    }}
                    className={`relative p-2.5 rounded-xl border backdrop-blur-md transition-all duration-150 cursor-pointer active:scale-95 ${
                      isWishlisted 
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                        : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/15'
                    }`}
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {/* Subtle Expanding Ripple Ring on Addition */}
                    {recentlyAddedId === currentSlide.id && (
                      <span 
                        aria-hidden="true" 
                        className="absolute inset-0 rounded-xl bg-rose-500/35 animate-heart-ring pointer-events-none" 
                      />
                    )}
                    <Heart 
                      className={`w-4 h-4 transition-colors duration-200 ${
                        recentlyAddedId === currentSlide.id
                          ? 'fill-rose-500 text-rose-500 animate-heart-pulse drop-shadow-[0_0_6px_rgba(244,63,94,0.7)]'
                          : isWishlisted 
                            ? 'fill-rose-500 text-rose-500' 
                            : ''
                      }`} 
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ---------------- NAVIGATION CONTROLS (Google Play Store Style) ---------------- */}
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer z-20 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer z-20 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* ---------------- GOOGLE PLAY STYLE PROGRESS BARS & INDICATORS ---------------- */}
          <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
            {/* Slide Pagination Progress Bars */}
            <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id + idx}
                    type="button"
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                      isActive ? 'w-12 sm:w-16 bg-white/20' : 'w-4 sm:w-6 bg-white/10 hover:bg-white/25'
                    }`}
                    title={slide.name}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: isPaused ? '100%' : '100%' }}
                        transition={{ 
                          duration: isPaused ? 0 : SLIDE_DURATION / 1000, 
                          ease: 'linear',
                          repeat: 0
                        }}
                        className={`h-full ${currentTheme.accentBg} rounded-full`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Slide Index & Autoplay status */}
            <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
              <span className="font-bold text-white">0{currentIndex + 1}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">0{slides.length}</span>
              <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
                {isPaused ? '⏸ Paused' : '▶ Auto-Playing'}
              </span>
            </div>
          </div>
        </div>

        {/* ---------------- GOOGLE PLAY WEB-STYLE MINI QUICK-SELECT CARDS (Bottom Strip) ---------------- */}
        <div className="hidden md:grid grid-cols-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`thumb-${slide.id}-${idx}`}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`p-3 text-left transition-all duration-200 flex items-center gap-2.5 border-r border-white/5 relative group cursor-pointer ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active Top Highlight Bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeSlideIndicator"
                    className={`absolute top-0 inset-x-0 h-0.5 ${currentTheme.accentBg}`} 
                  />
                )}
                
                {/* Mini App Icon */}
                <img 
                  src={slide.image} 
                  alt={slide.name} 
                  className={`w-7 h-7 rounded-lg object-cover border shrink-0 transition-transform ${
                    isActive ? 'border-white/40 scale-105' : 'border-white/10'
                  }`}
                />

                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold truncate leading-tight">
                    {language === 'bn' ? slide.nameBn || slide.name : slide.name}
                  </p>
                  <p className="text-[9.5px] font-mono text-slate-400 truncate">
                    {formatPrice(slide.price)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
