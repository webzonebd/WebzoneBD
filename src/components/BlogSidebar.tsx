import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mail, Cpu, Layers, Tag as TagIcon, Sparkles, Send, CheckCircle2, Eye, Clock } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_TAGS, LocalBlogPost } from './BlogData';
import { Language, Theme } from '../types';

interface BlogSidebarProps {
  language: Language;
  theme: Theme;
  posts: LocalBlogPost[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedTag: string | null;
  setSelectedTag: (t: string | null) => void;
  recentlyViewed: LocalBlogPost[];
  onSelectPost: (post: LocalBlogPost) => void;
  subscriberName: string;
  setSubscriberName: (n: string) => void;
  subscriberEmail: string;
  setSubscriberEmail: (e: string) => void;
  isSubscribed: boolean;
  onSubscribe: (e: React.FormEvent) => void;
}

export default function BlogSidebar({
  language,
  theme,
  posts,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  recentlyViewed,
  onSelectPost,
  subscriberName,
  setSubscriberName,
  subscriberEmail,
  setSubscriberEmail,
  isSubscribed,
  onSubscribe
}: BlogSidebarProps) {

  // Dynamic calculations for category counters
  const categoryCountMap = React.useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach(post => {
      const match = BLOG_CATEGORIES.find(c => c.label === post.category);
      if (match) {
        counts[match.id] = (counts[match.id] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  // High traffic popular posts
  const popularPosts = React.useMemo(() => {
    return [...posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  }, [posts]);

  const widgetBg = theme === 'dark' 
    ? 'bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
    : 'bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.02)]';

  const tDict = {
    en: {
      search: "Search Core Intel",
      searchPlaceholder: "Search insights, cPanel setup...",
      categories: "Category Matrix",
      popular: "High Traffic Articles",
      recent: "Recently Viewed Insights",
      tags: "Interactive Cloud Tags",
      newsletter: "Stay Tuned",
      newsletterDesc: "Get premium code updates directly to your email inbox.",
      vpsTitle: "AMD EPYC NVMe Cloud VPS",
      vpsDesc: "Host responsive Laravel or WordPress sites from only 350 BDT/mo. Fully isolated, free SSL + cPanel panel.",
      vpsBtn: "Deploy Server Now →"
    },
    bn: {
      search: "অনুসন্ধান করুন",
      searchPlaceholder: "নিবন্ধ খুজুন...",
      categories: "ক্যাটাগরি সমূহ",
      popular: "জনপ্রিয় টিউটোরিয়াল",
      recent: "সম্প্রতি পড়া হয়েছে",
      tags: "সবচেয়ে বেশি ব্যবহৃত ট্যাগ",
      newsletter: "আপডেট থাকুন",
      newsletterDesc: "নতুন কোড ও ডেভেলপমেন্ট আপডেট ইমেইল বক্সে সরাসরি পান।",
      vpsTitle: "এএমডি এপিক ক্লাউড হোস্টিং",
      vpsDesc: "লারাভেল বা ওয়ার্ডপ্রেস গতিময় করতে সেরা এএমডি সার্ভার। মাত্র ৩৫০ টাকা/মাস থেকে সিপ্যানেল প্যানেল সহ!",
      vpsBtn: "আজই সার্ভার কিনুন →"
    },
    ar: {
      search: "ابحث في المقالات",
      searchPlaceholder: "ابحث عن السيو، البرمجة...",
      categories: "مصفوفة التصنيفات",
      popular: "المقالات الأكثر قراءة",
      recent: "تصفحتها مؤخراً",
      tags: "الوسوم السحابية التفاعلية",
      newsletter: "كن على إطلاع عاجل",
      newsletterDesc: "احصل على آخر شفرات البرمجة مباشرة عبر بريدك الإلكتروني.",
      vpsTitle: "خوادم السحابة الفائقة والحديثة",
      vpsDesc: "استضافة متطورة للارفيل وووردبريس مع لوحة تسيير cpanel كاملة بأسعار ممتازة جداً.",
      vpsBtn: "قم بتهيئة الخادم فوراً ←"
    }
  };

  const currentDict = tDict[language] || tDict.en;

  return (
    <div className="space-y-6">
      
      {/* Search Widget */}
      <div className={widgetBg}>
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-violet-500" />
          <span>{currentDict.search}</span>
        </h4>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={currentDict.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-950 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-sans"
          />
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-neutral-400" />
        </div>
      </div>

      {/* Categories Widget */}
      <div className={widgetBg}>
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-violet-500" />
          <span>{currentDict.categories}</span>
        </h4>
        <div className="space-y-1.5">
          {BLOG_CATEGORIES.map((cat) => {
            const label = language === 'bn' ? cat.bn : language === 'ar' ? cat.ar : cat.label;
            const count = categoryCountMap[cat.id] || 0;
            const isSelected = selectedCategory === cat.label || (cat.id === 'all' && selectedCategory === 'all');

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id === 'all' ? 'all' : cat.label);
                  setSelectedTag(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-violet-500 text-white font-bold'
                    : 'text-neutral-700 hover:bg-neutral-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                }`}
              >
                <span>{label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Posts Widget */}
      <div className={widgetBg}>
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{currentDict.popular}</span>
        </h4>
        <div className="space-y-4">
          {popularPosts.map((pp) => {
            const titleText = language === 'bn' ? pp.titleBn || pp.title : language === 'ar' ? pp.titleAr || pp.title : pp.title;
            return (
              <div 
                key={pp.id} 
                onClick={() => onSelectPost(pp)}
                className="flex gap-3 hover:translate-x-1.5 transition-transform duration-300 cursor-pointer group"
              >
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-none relative">
                  <img src={pp.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-slate-950/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-neutral-850 dark:text-slate-100 group-hover:text-violet-500 transition-colors line-clamp-2 leading-tight">
                    {titleText}
                  </h5>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 dark:text-slate-450 font-mono mt-1">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" />
                      {pp.views}
                    </span>
                    <span>•</span>
                    <span>{pp.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Viewed Posts */}
      {recentlyViewed.length > 0 && (
        <div className={widgetBg}>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>{currentDict.recent}</span>
          </h4>
          <div className="space-y-3.5">
            {recentlyViewed.map((rp) => {
              const titleText = language === 'bn' ? rp.titleBn || rp.title : language === 'ar' ? rp.titleAr || rp.title : rp.title;
              return (
                <div 
                  key={rp.id} 
                  onClick={() => onSelectPost(rp)}
                  className="flex items-start gap-2.5 cursor-pointer hover:text-violet-500 transition-colors group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-none" />
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-neutral-800 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-violet-500 transition-colors">
                      {titleText}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Tag Cloud Widget */}
      <div className={widgetBg}>
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-violet-500" />
          <span>{currentDict.tags}</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {BLOG_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(isSelected ? null : tag);
                  setSelectedCategory('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-350'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* VPS Banner Advertisement */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-[0_15px_30px_rgba(99,102,241,0.25)] flex flex-col justify-between h-72">
        {/* Glow */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-cyan-300 rounded-full blur-3xl opacity-20" />
        
        <div className="space-y-2 relative z-10">
          <span className="px-2.5 py-0.5 bg-cyan-400 text-slate-900 text-[9px] font-extrabold tracking-widest rounded-full uppercase">
            Promo Offer
          </span>
          <h4 className="font-bold text-lg leading-snug">
            {currentDict.vpsTitle}
          </h4>
          <p className="text-indigo-100 text-xs line-clamp-4 leading-relaxed">
            {currentDict.vpsDesc}
          </p>
        </div>
        
        <div className="relative z-10 pt-4">
          <a
            href="#hosting-pricing-deck"
            className="inline-block w-full py-2.5 px-4 bg-white hover:bg-cyan-100 text-indigo-700 text-center text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            {currentDict.vpsBtn}
          </a>
        </div>
      </div>

      {/* Stay Tuned Box */}
      <div className={widgetBg}>
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-violet-500" />
          <span>{currentDict.newsletter}</span>
        </h4>
        <p className="text-neutral-500 dark:text-slate-400 text-xs mb-4 leading-relaxed">
          {currentDict.newsletterDesc}
        </p>
        
        <AnimatePresence mode="wait">
          {isSubscribed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex flex-col items-center text-center space-y-1"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-450">Thank You!</h5>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-snug">
                You have successfully joined our digital resources channel.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={onSubscribe} className="space-y-2.5">
              <input
                type="text"
                required
                value={subscriberName}
                onChange={(e) => setSubscriberName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-slate-800 bg-neutral-100 dark:bg-slate-900 rounded-xl text-neutral-900 dark:text-white"
              />
              <input
                type="email"
                required
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-slate-800 bg-neutral-100 dark:bg-slate-900 rounded-xl text-neutral-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
