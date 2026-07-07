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
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
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

export default function Blog({ language, theme, posts, setPosts, user, onLoginClick, wishlist, toggleWishlist }: BlogProps) {
  // Navigation & selection
  const [activeBlog, setActiveBlog] = useState<LocalBlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'popular' | 'trending' | 'views'>('latest');

  // Bookmarks
  const [localBookmarkedIds, setLocalBookmarkedIds] = useState<string[]>([]);
  const bookmarkedIds = wishlist || localBookmarkedIds;
  // Recently Viewed tracker
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Newsletter setup
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Optimized high-engagement Related Articles list
  const computedRelatedPosts = useMemo(() => {
    if (!activeBlog) return [];
    
    // 1. Same category posts (excluding current post and drafts)
    const sameCategory = posts.filter(
      p => p.category === activeBlog.category && p.id !== activeBlog.id && !p.isDraft
    );
    
    let related = [...sameCategory];
    
    // 2. Shared tags fallback to hit at least 3 matching items
    if (related.length < 3) {
      const activeTags = activeBlog.tags || [];
      const sameTags = posts.filter(
        p => 
          p.id !== activeBlog.id && 
          !p.isDraft &&
          !related.some(r => r.id === p.id) &&
          p.tags && p.tags.some(t => activeTags.includes(t))
      );
      related = [...related, ...sameTags];
    }
    
    // 3. Global popular blog posts fallback
    if (related.length < 3) {
      const popularFallback = posts
        .filter(p => p.id !== activeBlog.id && !p.isDraft && !related.some(r => r.id === p.id))
        .sort((a, b) => (b.views || 0) - (a.views || 0));
      related = [...related, ...popularFallback];
    }
    
    return related.slice(0, 3);
  }, [activeBlog, posts]);

  // WebzoneBD Blog CMS Control Terminal States
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<LocalBlogPost | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formCategory, setFormCategory] = useState('web-dev');
  const [formImage, setFormImage] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formSummaryBn, setFormSummaryBn] = useState('');
  const [formSummaryAr, setFormSummaryAr] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formContentBn, setFormContentBn] = useState('');
  const [formContentAr, setFormContentAr] = useState('');
  const [formAuthor, setFormAuthor] = useState('WebzoneBD Expert Team');
  const [formReadTime, setFormReadTime] = useState('5 min read');
  const [formTags, setFormTags] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsTrending, setFormIsTrending] = useState(false);
  const [formIsEditorsChoice, setFormIsEditorsChoice] = useState(false);
  const [formIsDraft, setFormIsDraft] = useState(false);

  const handleOpenCreateForm = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormTitleBn('');
    setFormTitleAr('');
    setFormCategory('web-dev');
    setFormImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200');
    setFormSummary('');
    setFormSummaryBn('');
    setFormSummaryAr('');
    setFormContent('');
    setFormContentBn('');
    setFormContentAr('');
    setFormAuthor('WebzoneBD Expert Team');
    setFormReadTime('5 min read');
    setFormTags('Laravel, PHP');
    setFormIsFeatured(false);
    setFormIsTrending(false);
    setFormIsEditorsChoice(false);
    setFormIsDraft(false);
    setShowPostForm(true);
  };

  const handleOpenEditForm = (post: LocalBlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title || '');
    setFormTitleBn(post.titleBn || '');
    setFormTitleAr(post.titleAr || '');
    
    const matchedCategory = BLOG_CATEGORIES.find(cat => cat.label === post.category || cat.id === post.category) || { id: 'web-dev' };
    setFormCategory(matchedCategory.id);
    
    setFormImage(post.image || '');
    setFormSummary(post.summary || '');
    setFormSummaryBn(post.summaryBn || '');
    setFormSummaryAr(post.summaryAr || '');
    setFormContent(post.content || '');
    setFormContentBn(post.contentBn || '');
    setFormContentAr(post.contentAr || '');
    setFormAuthor(post.author || 'WebzoneBD Expert Team');
    setFormReadTime(post.readTime || '5 min read');
    setFormTags(post.tags ? post.tags.join(', ') : '');
    setFormIsFeatured(!!post.isFeatured);
    setFormIsTrending(!!post.isTrending);
    setFormIsEditorsChoice(!!post.isEditorsChoice);
    setFormIsDraft(!!post.isDraft);
    setShowPostForm(true);
    
    // Smooth scroll to form area
    setTimeout(() => {
      document.getElementById('blog-cms-editor-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই ব্লগটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this blog post?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (activeBlog?.id === postId) {
        setActiveBlog(null);
      }
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const matchedCat = BLOG_CATEGORIES.find(cat => cat.id === formCategory) || {
      label: formCategory,
      bn: formCategory,
      ar: formCategory
    };

    const tagsArray = formTags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    if (editingPost) {
      setPosts(prev => prev.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            title: formTitle,
            titleBn: formTitleBn || formTitle,
            titleAr: formTitleAr || formTitle,
            category: matchedCat.label,
            categoryBn: matchedCat.bn || matchedCat.label,
            categoryAr: matchedCat.ar || matchedCat.label,
            image: formImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200',
            summary: formSummary,
            summaryBn: formSummaryBn || formSummary,
            summaryAr: formSummaryAr || formSummary,
            content: formContent,
            contentBn: formContentBn || formContent,
            contentAr: formContentAr || formContent,
            author: formAuthor,
            readTime: formReadTime,
            tags: tagsArray,
            isFeatured: formIsFeatured,
            isTrending: formIsTrending,
            isEditorsChoice: formIsEditorsChoice,
            isDraft: formIsDraft
          };
        }
        return p;
      }));
      setShowPostForm(false);
      setEditingPost(null);
    } else {
      const newId = `blog-${Date.now()}`;
      const newPost: LocalBlogPost = {
        id: newId,
        title: formTitle,
        titleBn: formTitleBn || formTitle,
        titleAr: formTitleAr || formTitle,
        category: matchedCat.label,
        categoryBn: matchedCat.bn || matchedCat.label,
        categoryAr: matchedCat.ar || matchedCat.label,
        image: formImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200',
        summary: formSummary,
        summaryBn: formSummaryBn || formSummary,
        summaryAr: formSummaryAr || formSummary,
        content: formContent,
        contentBn: formContentBn || formContent,
        contentAr: formContentAr || formContent,
        author: formAuthor,
        readTime: formReadTime,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        tags: tagsArray,
        isFeatured: formIsFeatured,
        isTrending: formIsTrending,
        isEditorsChoice: formIsEditorsChoice,
        isDraft: formIsDraft,
        outline: [
          { id: "intro", text: "Introduction", textBn: "ভূমিকা", textAr: "مقدمة" }
        ]
      };
      setPosts(prev => [newPost, ...prev]);
      setShowPostForm(false);
    }
  };

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
    if (toggleWishlist) {
      toggleWishlist(postId);
    } else {
      setLocalBookmarkedIds(prev => 
        prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
      );
    }
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
        heroTitle: "WebzoneBD Tech Blog – Expert Tutorials & Insights",
        heroSubtitle: "সার্ভার সেটআপ, স্পিড অপ্টিমাইজেশন, এসইও এবং ই-কমার্স সলিউশন নিয়ে WebzoneBD Architects-এর এক্সক্লুসিভ গাইড ও টেকনিক্যাল রিসোর্স।",
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
        heroTitle: "WebzoneBD Tech Blog – Expert Tutorials & Insights",
        heroSubtitle: "সার্ভার সেটআপ, স্পিড অপ্টিমাইজেশন, এসইও এবং ই-কমার্স সলিউশন নিয়ে WebzoneBD Architects-এর এক্সক্লুসিভ গাইড ও টেকনিক্যাল রিসোর্স।",
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
        badge: "مرونة المعرفة والمقالات",
        heroTitle: "مدونة WebzoneBD التقنية – شروحات وخبرات حصرية",
        heroSubtitle: "أدلة ودراسات ممتازة لتهيئة الخوادم، تسريع المواقع، السيو وبوابات الدفع مقدمة من مهندسي WebzoneBD.",
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
        
        {/* 🛠️ WebzoneBD Blog CMS Control Terminal Button - Visible Only for Super Admins */}
        {user?.role === 'admin' && (
          <div className="flex justify-end pt-2" id="blog-cms-top-controller">
            <button
              type="button"
              onClick={() => setIsCmsOpen(!isCmsOpen)}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
            >
              <Settings className="w-4 h-4 animate-spin-slow text-[#00E5FF]" />
              <span>{isCmsOpen ? (language === 'bn' ? 'ব্লগ সিএমএস বন্ধ করুন ✕' : 'Close Blog CMS ✕') : (language === 'bn' ? 'ওয়েবজোনবিডি ব্লগ সিএমএস টার্মিনাল 🛠️' : 'Blog Admin Mode 🛠️')}</span>
            </button>
          </div>
        )}

        {/* 💻 WEBZONEBD BLOG CMS CONTROL TERMINAL WORKSPACE */}
        {user?.role === 'admin' && isCmsOpen && (
          <div 
            className={`p-6 rounded-3xl border transition-all duration-300 space-y-6 shadow-2xl relative ${
              theme === 'dark' 
                ? 'bg-slate-950 border-slate-850 text-white' 
                : 'bg-white border-slate-200 text-slate-800'
            }`} 
            id="blog-cms-control-terminal-panel"
          >
            
            {/* Header branding */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-150'
            }`}>
              <div>
                <div className="flex items-center gap-2 text-violet-500 dark:text-violet-400 font-mono text-xs uppercase tracking-widest font-black">
                  <Database className="w-4 h-4 animate-pulse text-[#00E5FF]" />
                  <span>Administrative CMS Terminal Active</span>
                </div>
                <h2 className={`text-xl md:text-2xl font-black tracking-tight mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  WebzoneBD Blog CMS Control Terminal
                </h2>
                <p className={`text-xs font-semibold leading-relaxed font-sans ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Dynamic Content Management System (CMS) connected to Store Database
                </p>
              </div>

              {/* Add draft entry button trigger */}
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>{language === 'bn' ? 'নতুন ব্লগ পোস্ট করুন' : 'Write New Insight'}</span>
              </button>
            </div>

            {/* 📝 NEW / EDIT FORM COLLAPSIBLE */}
            {showPostForm && (
              <form 
                onSubmit={handleSavePost} 
                className={`p-6 rounded-2xl border space-y-6 animate-in slide-in-from-top-4 duration-300 ${
                  theme === 'dark' 
                    ? 'bg-slate-950 border-slate-850/80 bg-slate-900/45' 
                    : 'bg-slate-50 border-slate-200'
                }`} 
                id="blog-cms-editor-panel"
              >
                <div className={`flex items-center justify-between border-b pb-3 ${
                  theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <h4 className="text-xs font-black text-violet-500 dark:text-violet-400 font-mono flex items-center gap-1.5 uppercase">
                    <Edit3 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                    <span>{editingPost ? (language === 'bn' ? 'ব্লগ তথ্য সংশোধন' : 'Edit Insight Draft') : (language === 'bn' ? 'নতুন ব্লগ যুক্ত করুন' : 'Publish New Technical Blueprint')}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className={`p-1 px-2.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition ${
                      theme === 'dark' 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' 
                        : 'bg-white hover:bg-slate-200 border border-slate-200 text-slate-700'
                    }`}
                  >
                    {language === 'bn' ? 'লুকান ✕' : 'Close Editor ✕'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Titles & Metadata */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Title (English)*</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Setting up Custom CentOS VPS clusters with LiteSpeed"
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans font-semibold transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Title (Bangla)</label>
                      <input
                        type="text"
                        value={formTitleBn}
                        onChange={(e) => setFormTitleBn(e.target.value)}
                        placeholder="যেমন: সেন্টওএস ভিপিএস কিভাবে কনফিগার করবেন?"
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans font-semibold transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Title (Arabic)</label>
                      <input
                        type="text"
                        value={formTitleAr}
                        onChange={(e) => setFormTitleAr(e.target.value)}
                        placeholder="مثال: كيفية إعداد خوادم VPS مجاناً"
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans font-semibold transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={`text-[10px] uppercase font-mono font-black block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                        }`}>Author</label>
                        <input
                          type="text"
                          required
                          value={formAuthor}
                          onChange={(e) => setFormAuthor(e.target.value)}
                          className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans transition ${
                            theme === 'dark' 
                              ? 'bg-slate-950 border border-slate-800 text-white' 
                              : 'bg-white border border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-[10px] uppercase font-mono font-black block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                        }`}>Read Time</label>
                        <input
                          type="text"
                          required
                          value={formReadTime}
                          onChange={(e) => setFormReadTime(e.target.value)}
                          placeholder="e.g. 5 min read"
                          className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans transition ${
                            theme === 'dark' 
                              ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                              : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Category Preset</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans cursor-pointer transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white' 
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      >
                        {BLOG_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => (
                          <option 
                            key={cat.id} 
                            value={cat.id}
                            className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}
                          >
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="Laravel, PHP, cPanel, Web安全"
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Column 2: Summaries & Images */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Summary (English)</label>
                      <textarea
                        rows={2}
                        value={formSummary}
                        onChange={(e) => setFormSummary(e.target.value)}
                        placeholder="Brief overview summarizing the guide..."
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none font-sans transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Summary (Bangla)</label>
                      <textarea
                        rows={2}
                        value={formSummaryBn}
                        onChange={(e) => setFormSummaryBn(e.target.value)}
                        placeholder="বাংলায় সংক্ষিপ্ত বিবরণ..."
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none font-sans transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Summary (Arabic)</label>
                      <textarea
                        rows={2}
                        value={formSummaryAr}
                        onChange={(e) => setFormSummaryAr(e.target.value)}
                        placeholder="نبذة عامة باللغة العربية..."
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none font-sans transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-650' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Thumbnail Image URL*</label>
                      <input
                        type="url"
                        required
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-[#00E5FF]' 
                            : 'bg-white border border-slate-200 text-indigo-650'
                        }`}
                      />
                      
                      {/* Image quick presets */}
                      <div className="space-y-1 pt-1">
                        <span className={`text-[8px] font-mono font-black uppercase tracking-widest block ${
                          theme === 'dark' ? 'text-slate-500' : 'text-slate-450'
                        }`}>Quick Templates Cover</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: "Server", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200" },
                            { name: "Coding", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200" },
                            { name: "Cyber", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200" },
                            { name: "Hardware", url: "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=1200" }
                          ].map(preset => (
                            <button
                              type="button"
                              key={preset.name}
                              onClick={() => setFormImage(preset.url)}
                              className={`px-2 py-1 text-[9px] font-mono font-black rounded-lg border transition cursor-pointer ${
                                formImage === preset.url
                                  ? 'bg-violet-600 border-violet-500 text-white'
                                  : (theme === 'dark'
                                    ? 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                                    : 'bg-white border-slate-200 text-slate-605 hover:bg-slate-100 hover:text-slate-900')
                              }`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Full Articles */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Content (English)*</label>
                      <textarea
                        rows={7}
                        required
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="Write the full lesson body in markdown or text..."
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-mono font-black block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>Content (Bangla)</label>
                      <textarea
                        rows={4}
                        value={formContentBn}
                        onChange={(e) => setFormContentBn(e.target.value)}
                        placeholder="বাংলায় সম্পূর্ণ কন্টেন্ট..."
                        className={`w-full p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans transition ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border border-slate-800 text-white placeholder-slate-600' 
                            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Switch toggles row */}
                <div className={`p-4 rounded-xl border flex flex-wrap gap-6 items-center justify-between text-xs font-bold transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-950 border-slate-850 text-slate-300' 
                    : 'bg-white border-slate-250 text-slate-700 shadow-inner'
                }`}>
                  <div className="flex flex-wrap gap-5">
                    <label className={`flex items-center gap-2 cursor-pointer select-none transition ${
                      theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-violet-600 rounded bg-slate-900 border-slate-800"
                      />
                      <span>Featured Post ⭐</span>
                    </label>

                    <label className={`flex items-center gap-2 cursor-pointer select-none transition ${
                      theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formIsTrending}
                        onChange={(e) => setFormIsTrending(e.target.checked)}
                        className="w-4 h-4 accent-violet-600 rounded bg-slate-900 border-slate-800"
                      />
                      <span>Trending Insight 🔥</span>
                    </label>

                    <label className={`flex items-center gap-2 cursor-pointer select-none transition ${
                      theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formIsEditorsChoice}
                        onChange={(e) => setFormIsEditorsChoice(e.target.checked)}
                        className="w-4 h-4 accent-violet-600 rounded bg-slate-900 border-slate-800"
                      />
                      <span>Editor's Selection 🏆</span>
                    </label>

                    <label className={`flex items-center gap-2 cursor-pointer select-none transition ${
                      theme === 'dark' ? 'text-slate-355 hover:text-white' : 'text-slate-605 hover:text-slate-950'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formIsDraft}
                        onChange={(e) => setFormIsDraft(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded bg-slate-900 border-slate-800"
                      />
                      <span className="text-amber-505 dark:text-amber-400 font-extrabold">Save as Draft 📦</span>
                    </label>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className={`flex-1 sm:flex-none py-2 px-5 font-black rounded-lg text-xs uppercase cursor-pointer transition ${
                        theme === 'dark' 
                          ? 'bg-slate-800 hover:bg-slate-750 text-white' 
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none py-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>{editingPost ? 'Update Post' : 'Publish Post'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 📋 ENTIRE BLOG BLUEPRINTS CATALOG TABLE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase block tracking-widest font-mono">
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                  Core Catalog Overview ({posts.length} entries)
                </span>
                <span className={`text-[10px] text-xs font-black border px-2.5 py-1 rounded ${
                  theme === 'dark' 
                    ? 'text-violet-400 bg-slate-900 border-slate-800' 
                    : 'text-violet-605 bg-violet-50 border-violet-150'
                }`}>
                  Real-Time Sync Ready
                </span>
              </div>
              
              <div className={`overflow-x-auto rounded-2xl border transition-all duration-300 ${
                theme === 'dark' ? 'border-slate-850 bg-slate-950' : 'border-slate-200 bg-white shadow-sm'
              }`}>
                <table className={`w-full text-left text-xs font-semibold min-w-[700px] ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <thead className={`text-[10px] font-mono uppercase tracking-wider border-b transition ${
                    theme === 'dark' 
                      ? 'bg-slate-900/60 text-slate-400 border-slate-850' 
                      : 'bg-slate-50 text-slate-550 border-slate-200'
                  }`}>
                    <tr>
                      <th className="p-4">Cover</th>
                      <th className="p-4">Title & Language Mapping</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Views/Likes</th>
                      <th className="p-4">Attributes</th>
                      <th className="p-4 text-right">Handshake Handover Operations</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y transition ${
                    theme === 'dark' ? 'divide-slate-850/80' : 'divide-slate-200'
                  }`}>
                    {posts.map((post) => (
                      <tr 
                        key={post.id} 
                        className={`transition ${
                          theme === 'dark' ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-4">
                          <img
                            src={post.image}
                            alt="thumb"
                            className={`w-12 h-8 object-cover rounded-lg border ${
                              theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                            }`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=120';
                            }}
                          />
                        </td>
                        <td className="p-4 space-y-1">
                          <div className={`font-extrabold line-clamp-1 max-w-sm ${
                            theme === 'dark' ? 'text-[#E2E8F0]' : 'text-slate-900'
                          }`}>
                            {post.title}
                          </div>
                          {post.titleBn && (
                            <div className={`text-[10px] font-sans block line-clamp-1 ${
                              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              🇧🇩 {post.titleBn}
                            </div>
                          )}
                          <div className={`text-[9px] font-mono ${
                            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            ID: <span className="text-violet-500 dark:text-violet-400 font-bold">{post.id}</span> • Date: {post.date}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-extrabold border ${
                            theme === 'dark' 
                              ? 'bg-slate-900 border-slate-800 text-slate-300' 
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10px]">
                          <div>👁️ {post.views}</div>
                          <div>👍 {post.likes}</div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {post.isFeatured && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 rounded">
                                ⭐ Featured
                              </span>
                            )}
                            {post.isTrending && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-violet-500/10 text-violet-605 dark:text-violet-400 border border-violet-500/20 rounded">
                                🔥 Trending
                              </span>
                            )}
                            {post.isEditorsChoice && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-[#00E5FF]/10 text-[#00AFCE] dark:text-[#00E5FF] border border-[#00E5FF]/20 rounded">
                                🏆 Editor
                              </span>
                            )}
                            {post.isDraft && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-rose-500/15 text-rose-600 dark:text-rose-455 border border-rose-500/10 rounded animate-pulse">
                                📦 Draft
                              </span>
                            )}
                            {!post.isFeatured && !post.isTrending && !post.isEditorsChoice && !post.isDraft && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded">
                                Public
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(post)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                theme === 'dark' 
                                  ? 'bg-slate-900 border-slate-800 text-[#00E5FF] hover:bg-slate-850 hover:border-slate-700' 
                                  : 'bg-slate-50 border-slate-205 text-indigo-600 hover:bg-slate-100 hover:border-indigo-200'
                              }`}
                              title="Edit blueprint details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                theme === 'dark' 
                                  ? 'bg-slate-900 border-slate-800 text-rose-500 hover:bg-rose-950 hover:border-rose-900' 
                                  : 'bg-slate-50 border-slate-205 text-rose-650 hover:bg-rose-100 hover:border-rose-200'
                              }`}
                              title="Delete from database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

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
                relatedPosts={computedRelatedPosts}
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

                {/* High-Tech Server Room 16:9 Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full aspect-[16/9] rounded-3xl overflow-hidden border border-neutral-200/60 dark:border-slate-800 shadow-xl dark:shadow-2xl/45 bg-[#070B16] group relative mt-6 sm:mt-8"
                >
                  {!imageFailed ? (
                    <img
                      src="/input_file_0.png"
                      alt="WebzoneBD Tech High-Tech Server Blog Banner"
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => {
                        console.warn("User-uploaded banner asset not loaded, rendering the high-tech SVG/HTML dynamic mirroring container.");
                        setImageFailed(true);
                      }}
                    />
                  ) : (
                    /* High-fidelity mirror of the design layout of input_file_0.png */
                    <div className="absolute inset-0 w-full h-full relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-[#090E1A]">
                      
                      {/* Technical Grid background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                      
                      {/* Soft ambient radial glow spheres behind */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
                      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-violet-600/10 blur-[70px] pointer-events-none" />

                      {/* Header-like high tech border line */}
                      <div className="w-full flex justify-between items-center text-[9px] sm:text-xs font-mono text-cyan-500/60 pb-1 border-b border-cyan-500/10 z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                          </span>
                          <span>CORE_STACK_STABLE</span>
                        </div>
                        <div className="tracking-widest">WEBZONEBD ARCHITECTIVE LABS v5.0</div>
                      </div>

                      {/* MAIN DESIGN SCHEDULING BODY */}
                      <div className="grid grid-cols-12 gap-2 items-center my-auto w-full z-10">
                        
                        {/* LEFT COL: SPEED, SERVER, SEO (Cols 1-4) */}
                        <div className="col-span-4 space-y-3 sm:space-y-5 text-right hidden sm:block">
                          <div className="flex items-center justify-end gap-2.5 group/node">
                            <div className="space-y-0.5">
                              <h4 className="text-[10px] sm:text-xs font-black tracking-wider text-cyan-400 uppercase">SERVER SETUP</h4>
                              <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-none">High-Performance Clusters</p>
                            </div>
                            <div className="p-1.5 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/5 group-hover/node:scale-105 transition-all">
                              <Database className="w-4 h-4 sm:w-5 h-5" />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2.5 group/node">
                            <div className="space-y-0.5">
                              <h4 className="text-[10px] sm:text-xs font-black tracking-wider text-cyan-400 uppercase">SPEED OPTIMIZATION</h4>
                              <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-none font-sans">LiteSpeed Enterprise</p>
                            </div>
                            <div className="p-1.5 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/5 group-hover/node:scale-105 transition-all">
                              <Flame className="w-4 h-4 sm:w-5 h-5 text-amber-500" />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2.5 group/node">
                            <div className="space-y-0.5">
                              <h4 className="text-[10px] sm:text-xs font-black tracking-wider text-cyan-400 uppercase font-sans">SEO BOOSTER</h4>
                              <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-none">Core Web Vitals</p>
                            </div>
                            <div className="p-1.5 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/5 group-hover/node:scale-105 transition-all">
                              <Cpu className="w-4 h-4 sm:w-5 h-5 text-[#00E5FF]" />
                            </div>
                          </div>
                        </div>

                        {/* CENTER COL: LOGO & LOGOTEXT (Cols 4-8 on small / Cols 12 on mobile) */}
                        <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-center text-center space-y-4">
                          
                          {/* Outer Pulsing Aura surrounding shielding */}
                          <div className="relative animate-pulse">
                            <div className="absolute -inset-2.5 bg-cyan-500/20 rounded-full blur-md" />
                            <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-[#6C3BFF] rounded-2xl flex items-center justify-center p-3 sm:p-4 shadow-xl shadow-cyan-500/20 border border-white/10 active:scale-95 transition-all cursor-pointer">
                              {/* Shield overlay SVG */}
                              <svg className="w-full h-full text-white filter drop-shadow-[0_2px_8px_rgba(0,229,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              
                              {/* Glowing monogram inside */}
                              <span className="absolute text-sm sm:text-lg font-black tracking-tighter text-white font-mono leading-none top-[18px] sm:top-[26px]">WB</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h2 className="text-sm sm:text-lg md:text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#00E5FF] to-blue-500 uppercase font-sans">
                              WEBZONEBD
                            </h2>
                            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase leading-none">
                              TECH BLOG
                            </h3>
                            <p className="text-[8px] sm:text-[10px] text-cyan-400 font-mono font-black uppercase tracking-widest leading-none pt-1">
                              EXPERT TUTORIALS & INSIGHTS
                            </p>
                          </div>
                        </div>

                        {/* RIGHT COL: E-COMMERCE, TECHNICAL GUIDES (Cols 8-12) */}
                        <div className="col-span-4 space-y-3 sm:space-y-5 text-left hidden sm:block">
                          <div className="flex items-center justify-start gap-2.5 group/node">
                            <div className="p-1.5 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/5 group-hover/node:scale-105 transition-all">
                              <Layers className="w-4 h-4 sm:w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-[10px] sm:text-xs font-black tracking-wider text-cyan-400 uppercase font-sans">E-COMMERCE</h4>
                              <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-none">Checkout & Sales Solutions</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-start gap-2.5 group/node">
                            <div className="p-1.5 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/5 group-hover/node:scale-105 transition-all">
                              <Settings className="w-4 h-4 sm:w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-[10px] sm:text-xs font-black tracking-wider text-cyan-400 uppercase">TECHNICAL GUIDES</h4>
                              <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-none">Step-By-Step Blueprints</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-start gap-2.5 group/node">
                            <div className="p-1.5 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/5 group-hover/node:scale-105 transition-all">
                              <Code className="w-4 h-4 sm:w-5 h-5 text-[#6C3BFF]" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-[10px] sm:text-xs font-black tracking-wider text-cyan-400 uppercase">EXPERT SCRIPTS</h4>
                              <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-none font-sans">Optimized Code Snippets</p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* BANGLA ACCENTED DESCRIPTION SUBTITLE FOOTER */}
                      <footer className="w-full text-center py-2 border-t border-cyan-500/10 z-10 animate-fade-in">
                        <p className="text-[9px] sm:text-xs text-slate-300 font-medium font-sans">
                          সার্ভার সেটআপ, স্পিড অপ্টিমাইজেশন, এসইও এবং ই-কমার্স সলিউশন নিয়ে <span className="text-[#00E5FF] font-black">WebzoneBD Architects</span>-এর এক্সক্লুসিভ গাইড ও টেকনিক্যাল রিসোর্স।
                        </p>
                      </footer>

                    </div>
                  )}

                  {/* Subtle high-contrast glossy overlay border */}
                  <div className="absolute inset-0 border border-white/5 dark:border-white/10 rounded-3xl z-20 pointer-events-none" />
                </motion.div>
              </div>

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
