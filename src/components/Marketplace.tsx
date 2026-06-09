import { useState } from 'react';
import { 
  Star, ShoppingCart, ExternalLink, Filter, HelpCircle, 
  ChevronRight, BadgePercent, CheckCircle2, ChevronDown, Heart,
  Play, ShoppingBag
} from 'lucide-react';
import { Product, Language, Theme, CartItem, Currency } from '../types';
import { sampleProducts } from '../data';

interface MarketplaceProps {
  language: Language;
  theme: Theme;
  addToCart: (product: Product) => void;
  searchTerm: string;
  currency?: Currency;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  currencySettings?: any;
}

export default function Marketplace({ 
  language, 
  theme, 
  addToCart, 
  searchTerm, 
  currency = 'USD',
  wishlist = [],
  toggleWishlist,
  currencySettings
}: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Helper to format currency conversion rates dynamically
  const formatPrice = (usd: number) => {
    let cur = currency;
    let rates = { USD: 1.0, BDT: 118.5, SAR: 3.75 };
    if (currencySettings) {
      rates = currencySettings.rates || rates;
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
        cur = firstEnabled || 'USD';
      }
    }

    const rate = rates[cur] ?? 1.0;
    const converted = usd * rate;

    switch (cur) {
      case 'BDT':
        return `৳ ${Math.round(converted).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${converted.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${converted.toFixed(2)}`;
    }
  };

  // Categories list
  const categories = [
    { id: 'all', en: "All Assets", bn: "সকল আইটেম", ar: "جميع البرمجيات" },
    { id: 'laravel', en: "Laravel", bn: "লারাভেল", ar: "لارافيل" },
    { id: 'php', en: "PHP Scripts", bn: "পিএইচপি স্ক্রিপ্টস", ar: "سكربتات PHP" },
    { id: 'wordpress', en: "WP Themes", bn: "ওয়ার্ডপ্রেস থিম", ar: "قوالب ووردبريس" },
    { id: 'blogger', en: "Blogger", bn: "ব্লগার টেমপ্লেট", ar: "قوالب بلوجر" },
    { id: 'mobile', en: "Mobile Apps", bn: "মোবাইল অ্যাপস", ar: "تطبيقات هواتف" }
  ];

  // Filters logic
  const filteredProducts = sampleProducts.filter((product) => {
    // Search filter
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchString) ||
      product.nameBn.toLowerCase().includes(searchString) ||
      product.nameAr.toLowerCase().includes(searchString) ||
      product.tags.some(t => t.toLowerCase().includes(searchString));

    // Category filter
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const t = {
    en: {
      heading: "Most Powerful Digital Store",
      subheading: "Browse tested PHP, Blogger and WordPress projects with developer setup support.",
      demo: "Live Preview",
      buyNow: "Buy Now",
      watchLiveDemo: "Watch Live Demo",
      totalSalesLabel: "Sales",
      allRights: "Verified File Malware-Free",
      features: "Technical Specifications & Core Features",
      ratings: "Customer Satisfaction Rate",
      categoryLabel: "Category",
      discountBadge: "PROMO PRICE",
      instantlyAvailable: "🔓 Guaranteed Instant cPanel Ready Script ZIP Download",
      close: "Back to Digital Store"
    },
    bn: {
      heading: "সব চেয়ে বড় ডিজিটাল স্টোর",
      subheading: "আমরা রানিং সিকিউর কোড এবং গুগল এডসেন্স ফ্রেন্ডলি ব্লগার থিম বিক্রি করি।",
      demo: "লাইভ ডেমো",
      buyNow: "সরাসরি কিনুন",
      watchLiveDemo: "লাইভ ডেমো দেখুন",
      totalSalesLabel: "মোট বিক্রি",
      allRights: "ম্যালওয়্যার-মুক্ত ফাইল যাচাইকৃত",
      features: "টেকনিক্যাল বৈশিষ্ট্য ও সুবিধাসমূহ",
      ratings: "গ্রাহক রিভিউ সন্তুষ্টি",
      categoryLabel: "ক্যাটাগরি",
      discountBadge: "ডিসকাউন্ট অফার",
      instantlyAvailable: "🔓 পেমেন্ট সফল হওয়ার সাথে সাথেই ফাইল ডাউনলোড করার সুবিধা",
      close: "বন্ধ করুন"
    },
    ar: {
      heading: "المتجر الرقمي المتطور للأكواد",
      subheading: "تصفح وحمل أفضل البرامج والسكربتات المهيأة تماماً للتثبيت الفوري.",
      demo: "معاينة حية دمو",
      buyNow: "اشتري الآن",
      watchLiveDemo: "شاهد العرض المباشر",
      totalSalesLabel: "مبيعات",
      allRights: "ملف بروتوكول آمن خالٍ من الفيروسات",
      features: "المواصفات الفنية والميزات الأساسية",
      ratings: "معدل رضاء العملاء والمشترين",
      categoryLabel: "الفئة",
      discountBadge: "سعر ترويجي",
      instantlyAvailable: "🔓 تنزيل فوري مضمون بنسبة 100٪ بعد السداد الآمن",
      close: "العودة للمتجر"
    }
  }[language];

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="marketplace-catalog">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          {t.heading}
        </h2>
        <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto dark:text-neutral-400">
          {t.subheading}
        </p>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-none justify-start md:justify-center mb-10" id="marketplace-categories-bar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-xl border transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 bg-white/55 dark:bg-slate-950/20'
            }`}
          >
            {language === 'bn' ? cat.bn : language === 'ar' ? cat.ar : cat.en}
          </button>
        ))}
      </div>

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-600">
          <Filter className="w-12 h-12 mx-auto mb-3 stroke-[1.5]" />
          <p className="text-base font-semibold">
            {language === 'bn' ? "কোনো আইটেম খুঁজে পাওয়া যায়নি।" : language === 'ar' ? "عذرًا، لم يتم العثور على أي برمجية مطابقة." : "No matching items found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="marketplace-products-grid">
          {filteredProducts.map((product) => {
            const hasDiscount = product.discountPrice !== undefined;
            const priceToDisplay = hasDiscount ? product.discountPrice : product.price;
            const totalSales = Math.floor(product.reviewsCount * 3.5 + 12);

            return (
              <div 
                key={product.id}
                className="group relative flex flex-col justify-between h-full bg-white dark:bg-[#0f172a] rounded-[24px] border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 hover:shadow-[0_24px_50px_rgba(37,99,235,0.08)] dark:hover:shadow-[0_24px_50px_rgba(6,182,212,0.04)] hover:-translate-y-2 hover:border-blue-500/40 dark:hover:border-cyan-500/40 overflow-hidden"
              >
                {/* Product thumbnail image with premium zoom effects */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Wishlist floating icon on top right overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 cursor-pointer z-10 ${
                      wishlist.includes(product.id)
                        ? 'bg-rose-50/90 border-rose-200 text-rose-500 dark:bg-rose-950/80 dark:border-rose-900/60 dark:text-rose-450'
                        : 'bg-white/95 dark:bg-[#020617]/90 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:scale-110'
                    }`}
                    title={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className="w-4 h-4 fill-current opacity-95" />
                  </button>

                  {/* Promo discount flag badge with premium pink/red gradient */}
                  {hasDiscount && (
                    <span className="absolute top-4 left-4 px-2.5 py-1 text-[9px] font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg flex items-center gap-1 shadow-md uppercase tracking-wider">
                      <BadgePercent className="w-3.5 h-3.5" />
                      {t.discountBadge}
                    </span>
                  )}
                </div>

                {/* Card contents - Flex-1 to push the bottom container equally */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Product Category badge style */}
                    <div className="flex items-center">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold font-mono text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-400/10 px-2.5 py-1 rounded-md border border-blue-500/10 dark:border-cyan-400/10">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 
                      onClick={() => setActiveProduct(product)}
                      className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition text-left"
                    >
                      {language === 'bn' ? product.nameBn : language === 'ar' ? product.nameAr : product.name}
                    </h3>

                    {/* Product Short Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.8] line-clamp-2 text-left">
                      {language === 'bn' ? product.descriptionBn : language === 'ar' ? product.descriptionAr : product.description}
                    </p>

                    {/* Product Rating and Total Sales indicators */}
                    <div className="flex items-center gap-3 text-xs font-semibold select-none pt-1">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">({product.reviewsCount})</span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-800">|</span>
                      <div className="text-slate-500 dark:text-slate-400 font-medium">
                        <span className="text-slate-705 dark:text-slate-200 font-bold">{totalSales}</span> {t.totalSalesLabel}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons aligned consistently */}
                  <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        {hasDiscount ? (
                          <>
                            <span className="text-xl font-bold font-mono text-emerald-500 dark:text-emerald-400 select-none">
                              {formatPrice(product.discountPrice!)}
                            </span>
                            <span className="text-xs text-slate-400 line-through font-mono">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white select-none">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      
                      {hasDiscount && (
                        <span className="text-[9px] font-extrabold font-mono bg-rose-500/10 text-rose-500 dark:text-rose-450 px-2 py-0.5 rounded-md border border-rose-500/10">
                          {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Watch Live Demo (Secondary Outline Button) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(product.demoUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="px-3 py-3 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        title={t.watchLiveDemo}
                      >
                        <Play className="w-3.5 h-3.5 fill-current opacity-90" />
                        <span>{t.watchLiveDemo}</span>
                      </button>

                      {/* Buy Now (Primary Premium Gradient Button) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          const checkoutText = encodeURIComponent(
                            `Assalamu Alaikum WebzoneBD, I would like to purchase: "${product.name}" (${formatPrice(hasDiscount ? product.discountPrice! : product.price)})`
                          );
                          window.open(`https://wa.me/966570511931?text=${checkoutText}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="px-3 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-[0_4px_12px_rgba(37,99,235,0.25)] cursor-pointer"
                        title={t.buyNow}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 animate-bounce-slow" />
                        <span>{t.buyNow}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Lightbox / Modal */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs" id="product-detail-modal">
          <div className="bg-white dark:bg-neutral-950 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            {/* Header image area */}
            <div className="relative h-48 sm:h-56 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-500 rounded">
                    {activeProduct.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold line-clamp-1">
                    {language === 'bn' ? activeProduct.nameBn : language === 'ar' ? activeProduct.nameAr : activeProduct.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition"
              >
                <HelpCircle className="w-4 h-4 rotate-45" />
              </button>
            </div>

            {/* Content area scrolling */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-900/60">
                {/* Rating & views */}
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider font-extrabold text-neutral-400">{t.ratings}</p>
                  <div className="flex items-center gap-1.5 text-sm text-amber-500 font-bold mt-1">
                    <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                    <span>{activeProduct.rating} Stars Satisfaction</span>
                    <span className="text-neutral-400 text-xs font-normal">({activeProduct.reviewsCount} buyer ratings)</span>
                  </div>
                </div>

                {/* Price block */}
                <div className="text-right sm:text-right">
                  <p className="text-xs uppercase font-mono tracking-wider font-extrabold text-neutral-400">Premium Developer License</p>
                  <p className="text-xl font-black font-mono text-emerald-500 mt-0.5">
                    ${activeProduct.discountPrice || activeProduct.price}
                  </p>
                </div>
              </div>

              {/* Long Description */}
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase font-mono tracking-wider text-neutral-400">Description Overview</p>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {language === 'bn' ? activeProduct.descriptionBn : language === 'ar' ? activeProduct.descriptionAr : activeProduct.description}
                </p>
              </div>

              {/* Core features block */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase font-mono tracking-wider text-neutral-400">{t.features}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(language === 'bn' ? activeProduct.featuresBn : language === 'ar' ? activeProduct.featuresAr : activeProduct.features).map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-905/30 border border-neutral-150/60 dark:border-neutral-900/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-emerald-500 font-bold bg-emerald-500/5 px-2.5 py-2 rounded-lg border border-emerald-500/10">
                {t.instantlyAvailable}
              </p>
            </div>

            {/* Footer triggers */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => {
                  window.open(activeProduct.demoUrl, '_blank');
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current opacity-90" />
                <span>{t.watchLiveDemo}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer"
                >
                  {t.close}
                </button>

                <button
                  onClick={() => {
                    addToCart(activeProduct);
                    const checkoutText = encodeURIComponent(
                      `Assalamu Alaikum WebzoneBD, I would like to purchase: "${activeProduct.name}" ($${activeProduct.discountPrice || activeProduct.price})`
                    );
                    window.open(`https://wa.me/966570511931?text=${checkoutText}`, '_blank', 'noopener,noreferrer');
                    setActiveProduct(null);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-lg text-xs font-extrabold transition-all duration-300 flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t.buyNow}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
