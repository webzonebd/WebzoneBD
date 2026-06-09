import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, User, Clock, ArrowRight, Tag, Search, Share2, 
  Copy, Check, ThumbsUp, MessageSquare, Plus, Trash2, Edit3, 
  Eye, BookOpen, Sparkles, Globe, Mail, ArrowLeft, Send, 
  Printer, Heart, ShieldCheck, CheckCircle2, Settings, 
  Code, Database, Cpu, Layers, ExternalLink, X, ChevronRight, FileText, Flame, Trophy, Award, Sparkle, Bookmark
} from 'lucide-react';
import { Language, Theme } from '../types';
import { 
  BLOG_CATEGORIES, BLOG_TAGS, initialLocalBlogs, LocalBlogPost 
} from './BlogData';
import BlogCard from './BlogCard';
import BlogSidebar from './BlogSidebar';
import BlogDetails from './BlogDetails';

interface BlogProps {
  language: Language;
  theme: Theme;
  posts: LocalBlogPost[];
  setPosts: React.Dispatch<React.SetStateAction<LocalBlogPost[]>>;
  user?: any;
  onLoginClick?: (view?: 'login' | 'register') => void;
}

interface CommentReply {
  id: string;
  name: string;
  content: string;
  date: string;
  avatar: string;
  likes: number;
}

interface Comment {
  id: string;
  postId: string;
  name: string;
  content: string;
  date: string;
  avatar: string;
  likes: number;
  replies: CommentReply[];
  isApproved: boolean;
}

export default function Blog({ language, theme, posts, setPosts, user, onLoginClick }: BlogProps) {
  // Navigation & selection
  const [activeBlog, setActiveBlog] = useState<LocalBlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'popular' | 'trending' | 'views'>('latest');

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  // Recently Viewed tracker
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Newsletter setup
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Live Comments
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-2",
      postId: "blog-2",
      name: "Sajid Khan",
      content: "This security checklist is really crucial! PHP core prepared queries are indeed mandatory in modern web setups.",
      date: "2026-05-25",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      likes: 8,
      replies: [],
      isApproved: true
    }
  ]);

  // Track post visiting to recently viewed lists
  const handleSelectArticleAndIncrementViews = (post: LocalBlogPost) => {
    // Add view count
    setPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    }));

    // Setup active blog
    setActiveBlog(post);

    // Track recently viewed IDs
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== post.id);
      return [post.id, ...filtered].slice(0, 4);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = (postId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setBookmarkedIds(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberName || !subscriberEmail) return;
    setIsSubscribed(true);
  };

  const recentlyViewedPosts = useMemo(() => {
    return recentlyViewedIds
      .map(id => posts.find(p => p.id === id))
      .filter((p): p is LocalBlogPost => !!p);
  }, [recentlyViewedIds, posts]);

  // Sorting and Filtering algorithm
  const processedPosts = useMemo(() => {
    let list = [...posts].filter(p => !p.isDraft);

    // Filter by search text
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.titleBn && p.titleBn.toLowerCase().includes(q)) ||
        (p.titleAr && p.titleAr.toLowerCase().includes(q)) ||
        p.summary.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Filter by Tag
    if (selectedTag) {
      list = list.filter(p => p.tags && p.tags.includes(selectedTag));
    }

    // Sort options
    if (sortOption === 'popular') {
      list.sort((a, b) => b.likes - a.likes);
    } else if (sortOption === 'trending') {
      list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    } else if (sortOption === 'views') {
      list.sort((a, b) => b.views - a.views);
    } else {
      // 'latest'
      list.sort((a, b) => {
        const idA = parseInt(a.id.replace('blog-', '')) || 0;
        const idB = parseInt(b.id.replace('blog-', '')) || 0;
        return idB - idA;
      });
    }

    return list;
  }, [posts, searchTerm, selectedCategory, selectedTag, sortOption]);

  // Identify Featured HERO Post (Highest ranked or designated featured)
  const featuredPost = useMemo(() => {
    // Return first featured check
    const featured = posts.find(p => p.isFeatured && !p.isDraft);
    if (featured) return featured;
    // Fallback to first
    return posts.find(p => !p.isDraft) || null;
  }, [posts]);

  // Dictionary Translation Core Layout
  const t = useMemo(() => {
    return {
      en: {
        badge: "Knowledge Center",
        heroTitle: "Expert Tutorials, Tech Insights & Solutions",
        heroSubtitle: "Explore professional guides, server deployment schemas, speed caching setups, search engine strategies, and e-commerce models curated by WebzoneBD Architects.",
        resetFilters: "Clear Filter Selections",
        noResults: "We found no matching insights for your parameters. Try resetting your tags or text search.",
        sortLatest: "Latest Publications",
        sortPopular: "Highly Liked",
        sortTrending: "Hot Trending",
        sortViews: "Most Viewed",
        sortByLabel: "Sort By",
        exploreMore: "Explore Intel Publication",
        featuredBadge: "⭐ Featured Hero",
        isTrendingBadge: "🔥 Hot Choice",
        isEditorsBadge: "🏆 Editor's Choice"
      },
      bn: {
        badge: "ইনসাইটস ব্লগ",
        heroTitle: "আজকের প্রযুক্তি টিউটোরিয়াল এবং ব্যবসায়িক কৌশল",
        heroSubtitle: "লারাভেল, ওয়ার্ডপ্রেস স্পিড টিউটোরিয়াল, সিপ্যানেল হোস্টিং কনফিগারেশন এবং ডিজিটাল মার্কেটিং গাইড বুকস বাংলায় পড়ে নিজেকে সমৃদ্ধ করুন।",
        resetFilters: "ফিল্টার রিসেট করুন",
        noResults: "কোন টিউটোরিয়াল খুঁজে পাওয়া যায়নি! অনুসন্ধান পরিবর্তন করতে পারেন।",
        sortLatest: "সর্বশেষ টিউটোরিয়াল",
        sortPopular: "সবচেয়ে বেশি লাইক",
        sortTrending: "ট্রেন্ডিং আর্টিকেলস",
        sortViews: "সবচেয়ে বেশি পঠিত",
        sortByLabel: "বাছাই করুন",
        exploreMore: "মূল আর্টিকেলে যান",
        featuredBadge: "⭐ স্পেশাল হিরো",
        isTrendingBadge: "🔥 ট্রেন্ডিং চয়েস",
        isEditorsBadge: "🏆 সম্পাদকের সেরা বাছাই"
      },
      ar: {
        badge: "مركز المعرفة والمقالات",
        heroTitle: "رؤى الخبراء البرمجية وحلول التسويق والسيو",
        heroSubtitle: "احصل على شروحات عملية مجانية حول تهيئة الخوادم، تكامل بوابات الدفع، تسريع ووردبريس وتصدر محركات البحث لشركتك.",
        resetFilters: "تفريغ الفهاري والبحث",
        noResults: "لم نجد أي مقال يطابق هذه العبارة، قم بتغيير البحث.",
        sortLatest: "آخر المنشورات والمقالات",
        sortPopular: "المقالات الأكثر إعجاباً",
        sortTrending: "المقالات التفاعلية الرائجة",
        sortViews: "المقالات الأكثر تصفحاً",
        sortByLabel: "فرز الترتيب",
        exploreMore: "تمتع بقراءة المقال الكامل",
        featuredBadge: "⭐ مقال متميز وموصى به",
        isTrendingBadge: "🔥 الخيارات الرائجة حالياً",
        isEditorsBadge: "🏆 اختيار فريق التحرير"
      }
    };
  }, []);

  const d = t[language] || t.en;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#020617] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* Background Ambience Bubble for Dark mode */}
      {theme === 'dark' && (
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-950/20 via-[#020617] to-transparent pointer-events-none z-0" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-12">
        
        {/* Dynamic Details Reading Hub Conditional */}
        <AnimatePresence mode="wait">
          {activeBlog ? (
            <motion.div
              key="active-reading-hub"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BlogDetails
                post={activeBlog}
                language={language}
                theme={theme}
                onBack={() => setActiveBlog(null)}
                isBookmarked={bookmarkedIds.includes(activeBlog.id)}
                onBookmarkToggle={(id) => toggleBookmark(id)}
                onLikeToggle={(id) => toggleLike(id)}
                relatedPosts={posts.filter(p => p.category === activeBlog.category && p.id !== activeBlog.id)}
                onSelectRelated={(p) => handleSelectArticleAndIncrementViews(p)}
                comments={comments}
                setComments={setComments}
                user={user}
                onLoginClick={onLoginClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key="indexing-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              
              {/* Elegant Modern Hero Header Section */}
              <div className="text-center max-w-4xl mx-auto space-y-4 pt-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-black uppercase tracking-widest font-mono"
                >
                  <Sparkle className="w-3.5 h-3.5" />
                  <span>{d.badge}</span>
                </motion.div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
                  {d.heroTitle}
                </h1>

                <p className="text-sm md:text-base text-neutral-600 dark:text-slate-350 max-w-3xl mx-auto leading-relaxed">
                  {d.heroSubtitle}
                </p>
              </div>

              {/* Outstanding Large Featured Hero cover Card (If search & filter clear) */}
              {featuredPost && searchTerm === '' && selectedCategory === 'all' && !selectedTag && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden border relative ${
                    theme === 'dark' 
                      ? 'bg-slate-900/60 backdrop-blur-md border-slate-800 shadow-2xl' 
                      : 'bg-white border-neutral-200/80 shadow-[0_10px_45px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  {/* Image Column */}
                  <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-video relative group h-full max-h-[360px]">
                    <img 
                      src={featuredPost.image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 opacity-40" />

                    {/* Badge lists */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
                      <span className="px-3.5 py-1 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-full shadow-lg">
                        {language === 'bn' ? featuredPost.categoryBn || featuredPost.category : language === 'ar' ? featuredPost.categoryAr || featuredPost.category : featuredPost.category}
                      </span>
                      <span className="px-2.5 py-1 bg-blue-600 text-white font-extrabold text-[9px] rounded-full shadow-md">
                        {d.featuredBadge}
                      </span>
                      {featuredPost.isTrending && (
                        <span className="px-2.5 py-1 bg-pink-500 text-white font-extrabold text-[9px] rounded-full shadow-md">
                          {d.isTrendingBadge}
                        </span>
                      )}
                      {featuredPost.isEditorsChoice && (
                        <span className="px-2.5 py-1 bg-emerald-500 text-white font-extrabold text-[9px] rounded-full shadow-md animate-pulse">
                          {d.isEditorsBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Text Details Column */}
                  <div className="lg:col-span-5 space-y-4 flex flex-col justify-center">
                    <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-violet-500 block">
                      Featured Tutorial Publication
                    </span>

                    <h2 
                      onClick={() => handleSelectArticleAndIncrementViews(featuredPost)}
                      className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white hover:text-violet-500 cursor-pointer transition-colors leading-tight line-clamp-3"
                    >
                      {language === 'bn' ? featuredPost.titleBn || featuredPost.title : language === 'ar' ? featuredPost.titleAr || featuredPost.title : featuredPost.title}
                    </h2>

                    <p className="text-neutral-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed line-clamp-3">
                      {language === 'bn' ? featuredPost.summaryBn || featuredPost.summary : language === 'ar' ? featuredPost.summaryAr || featuredPost.summary : featuredPost.summary}
                    </p>

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-violet-550" /> {featuredPost.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {featuredPost.views}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4 border-t border-neutral-100 dark:border-slate-800/80">
                      
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center font-bold text-violet-600 text-xs">
                          {featuredPost.author?.[0]}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-800 dark:text-slate-200 block leading-none">{featuredPost.author || 'DevOps Spec'}</span>
                          <span className="text-[9px] text-neutral-450 block font-mono">Author</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectArticleAndIncrementViews(featuredPost)}
                        id="featured-card-cta-btn"
                        className="py-2.5 px-4 bg-violet-600 hover:bg-violet-750 text-white font-extrabold uppercase tracking-wide rounded-xl text-[10px] flex items-center gap-1 shadow-lg shadow-violet-600/10 cursor-pointer select-none transition-all duration-300 hover:-translate-y-0.5 group/fbtn"
                      >
                        <span>{d.exploreMore}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/fbtn:translate-x-1 transition-transform" />
                      </button>

                    </div>

                  </div>
                </motion.div>
              )}

              {/* Main Directory Deck layout Grid: Left is list & cards, Right is sidebar widget matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* List matrix block */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Sorter bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-violet-500" />
                      <span>{language === 'bn' ? 'আর্টিকেল ডিরেক্টরি' : language === 'ar' ? 'فهرس المقالات' : 'Intel Directory'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-slate-800 text-[10px] font-mono">{processedPosts.length} available</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-sans">
                      <span className="text-neutral-500 font-medium font-mono">{d.sortByLabel}:</span>
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as any)}
                        id="blog-sort-select-menu"
                        className="p-1 px-2.5 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-neutral-700 dark:text-slate-350 font-bold focus:outline-none"
                      >
                        <option value="latest">{d.sortLatest}</option>
                        <option value="popular">{d.sortPopular}</option>
                        <option value="trending">{d.sortTrending}</option>
                        <option value="views">{d.sortViews}</option>
                      </select>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  {processedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {processedPosts.map((post) => (
                        <div key={post.id} id={`blog-card-${post.id}`}>
                          <BlogCard
                            post={post}
                            language={language}
                            theme={theme}
                            isBookmarked={bookmarkedIds.includes(post.id)}
                            onBookmarkToggle={(id, e) => toggleBookmark(id, e)}
                            onSelect={(p) => handleSelectArticleAndIncrementViews(p)}
                            onLikeToggle={(id, e) => toggleLike(id, e)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 flex flex-col items-center space-y-4">
                      <FileText className="w-12 h-12 text-slate-400" />
                      <p className="text-xs text-neutral-500 dark:text-slate-400 max-w-md">
                        {d.noResults}
                      </p>
                      
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setSelectedTag(null);
                        }}
                        id="reset-filters-btn"
                        className="py-2.5 px-4 bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs rounded-xl cursor-pointer select-none"
                      >
                        {d.resetFilters}
                      </button>
                    </div>
                  )}

                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4">
                  <BlogSidebar
                    language={language}
                    theme={theme}
                    posts={posts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    recentlyViewed={recentlyViewedPosts}
                    onSelectPost={(p) => handleSelectArticleAndIncrementViews(p)}
                    subscriberName={subscriberName}
                    setSubscriberName={setSubscriberName}
                    subscriberEmail={subscriberEmail}
                    setSubscriberEmail={setSubscriberEmail}
                    isSubscribed={isSubscribed}
                    onSubscribe={handleSubscribe}
                  />
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
