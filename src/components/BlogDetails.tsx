import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, User, Clock, Eye, Heart, Bookmark, Share2, 
  ArrowLeft, Copy, Check, MessageSquare, Send, ThumbsUp, Trash2, 
  ChevronRight, Info, AlertTriangle, Play,
  Facebook, Linkedin, Send as TelegramIcon, PhoneCall, Code, CheckSquare
} from 'lucide-react';
import { LocalBlogPost } from './BlogData';
import { Language, Theme } from '../types';

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

interface BlogDetailsProps {
  post: LocalBlogPost;
  language: Language;
  theme: Theme;
  onBack: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: (postId: string) => void;
  onLikeToggle: (postId: string) => void;
  relatedPosts: LocalBlogPost[];
  onSelectRelated: (post: LocalBlogPost) => void;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  user?: any;
  onLoginClick?: (view?: 'login' | 'register') => void;
}

export default function BlogDetails({
  post,
  language,
  theme,
  onBack,
  isBookmarked,
  onBookmarkToggle,
  onLikeToggle,
  relatedPosts,
  onSelectRelated,
  comments,
  setComments,
  user,
  onLoginClick
}: BlogDetailsProps) {
  // Reading percentage state
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Active reading progress scroll dynamic calculations
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const windowHeight = scrollHeight - clientHeight;
      if (windowHeight > 0) {
        const scrolled = (window.scrollY / windowHeight) * 105; // Added slight boost to hit 100% just before footer
        setReadingProgress(Math.min(100, Math.max(0, scrolled)));
      } else {
        setReadingProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initially on render/page mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [post.id]);

  // Floating Reactions counts in local state
  const [claps, setClaps] = useState(128);
  const [clapped, setClapped] = useState(false);
  const [loves, setLoves] = useState(94);
  const [loved, setLoved] = useState(false);
  const [insights, setInsights] = useState(45);
  const [insightActive, setInsightActive] = useState(false);

  // Comments entry form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentIsSuccess, setCommentIsSuccess] = useState(false);

  // Reply state
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyText, setReplyText] = useState('');

  // Admin moderation mode flag
  const [isAdminModerator, setIsAdminModerator] = useState(false);

  // Sync comments entry names for logged-in users automatically
  useEffect(() => {
    if (user) {
      setCommentName(user.name || user.username || '');
      setCommentEmail(user.email || '');
    } else {
      setCommentName('');
      setCommentEmail('');
    }
  }, [user]);

  const getCategoryGradient = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'php': return 'from-blue-600 to-indigo-600';
      case 'wordpress': return 'from-sky-500 to-blue-600';
      case 'blogger': return 'from-orange-500 to-amber-600';
      case 'laravel': return 'from-rose-600 to-red-500';
      case 'mobile': return 'from-emerald-500 to-teal-600';
      case 'source': return 'from-fuchsia-600 to-pink-600';
      default: return 'from-[#00E5FF] via-[#3B82F6] to-[#7C3AED]';
    }
  };

  const renderDomainOfferCard = () => {
    return (
      <div className="relative my-8 p-[1.5px] rounded-3xl overflow-hidden bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] via-[#7C3AED] to-[#EC4899] group shadow-[0_0_40px_-5px_rgba(0,229,255,0.3)] transition-all duration-500 hover:shadow-[0_0_50px_0px_rgba(236,72,153,0.4)]">
        {/* Glowing backdrop with pulse animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#EC4899] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
        
        {/* Glassmorphic box content */}
        <div className="relative bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-6 md:p-8 rounded-[22px] overflow-hidden">
          {/* Animated custom glitter/shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-10 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-white rounded-full bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] shadow-md flex items-center gap-1 animate-bounce">
                🚀 Register Your Domain Today
              </span>
              <span className="text-[10px] text-[#EC4899] font-mono font-bold animate-pulse">
                ● Modern SaaS Campaign
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-snug">
              Search, register, and secure your online identity with WebzoneBD IT Solution.
            </h3>

            <p className="text-neutral-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
              Domain names are selling fast. Grab your preferred Extension (.com, .net, .org, .co, .io) with full DNS control and premium security lock management today.
            </p>

            <div className="py-4 border-y border-neutral-150 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#3B82F6] block mb-1">WebzoneBD Registrars Integration</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] tracking-tight text-rose-500 dark:text-pink-500">Best Registrar Rates</span>
                  <span className="text-xs text-neutral-500 dark:text-slate-400 font-mono">/annual</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.host.webzonebd.com/cart.php?a=add&domain=register"
                  target="_blank"
                  rel="noreferrer"
                  id="domain-offer-cta-now"
                  className="px-5 py-3 bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 select-none"
                >
                  🌐 Register Domain Now
                </a>
              </div>
            </div>

            {/* Premium details indicator badges */}
            <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono text-neutral-400 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-500">✓ Glassmorphism</span>
              <span className="flex items-center gap-1 text-emerald-500">✓ Animated Gradient Border</span>
              <span className="flex items-center gap-1 text-emerald-500">✓ Neon Glow Effect</span>
              <span className="flex items-center gap-1 text-[#00E5FF]">✓ Hover Animation</span>
              <span className="flex items-center gap-1 text-[#EC4899]">✓ Pulse Effect</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHostingOfferCard = () => {
    return (
      <div className="relative my-8 p-[1.5px] rounded-3xl overflow-hidden bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] group shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)] transition-all duration-500 hover:shadow-[0_0_50px_-5px_rgba(236,72,153,0.3)]">
        {/* Glowing backdrop with pulse animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#EC4899] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
        
        {/* Glassmorphic box content */}
        <div className="relative bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-6 md:p-8 rounded-[22px] overflow-hidden">
          {/* Animated custom glitter/shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-10 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-white rounded-full bg-gradient-to-r from-rose-500 via-[#EC4899] to-[#7C3AED] shadow-md flex items-center gap-1 animate-bounce">
                <span>🔥</span> Exclusive Hosting Offer
              </span>
              <span className="text-[10px] text-[#00E5FF] font-mono font-bold animate-pulse">
                ● Live Neon Campaign
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-snug">
              Launch Your Website with Premium Hosting
            </h3>

            <p className="text-neutral-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
              Get high-performance web hosting, free SSL, powerful control panel access, daily backups, and expert technical support from WebzoneBD.
            </p>

            <div className="py-4 border-y border-neutral-150 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#3B82F6] block mb-1">WebzoneBD IT Preferred Rates</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-rose-500 dark:text-pink-500 tracking-tight">Starting from $2.99</span>
                  <span className="text-xs text-neutral-500 dark:text-slate-400 font-mono">/month</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://webzonebd.com"
                  target="_blank"
                  rel="noreferrer"
                  id="h-offer-cta-now"
                  className="px-4.5 py-2.5 bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 select-none"
                >
                  🚀 Get Hosting Now
                </a>
                <a
                  href="https://webzonebd.com"
                  target="_blank"
                  rel="noreferrer"
                  id="h-offer-cta-visit"
                  className="px-4 py-2.5 bg-neutral-100 dark:bg-slate-900 hover:bg-neutral-200 dark:hover:bg-slate-800 text-neutral-800 dark:text-slate-350 font-bold text-xs rounded-xl border border-neutral-250 dark:border-slate-800 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 select-none"
                >
                  🌐 Visit WebzoneBD.com
                </a>
              </div>
            </div>

            {/* Premium details indicator badges */}
            <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono text-neutral-400 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-500">✓ Pulse Animation</span>
              <span className="flex items-center gap-1 text-emerald-500">✓ Hover Glow</span>
              <span className="flex items-center gap-1 text-emerald-500">✓ Floating Icons</span>
              <span className="flex items-center gap-1 text-emerald-500">✓ Shine Effect</span>
              <span className="flex items-center gap-1 text-emerald-500">✓ Neon Border Animation</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Scroll tracker for reading status
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setReadingProgress(Math.min(scrolled, 100));
      }

      // Sync active section based on current scroll position
      const outlineElements = post.outline || [];
      for (const sect of outlineElements) {
        const el = document.getElementById(sect.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(sect.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const handleCopyLink = () => {
    const simulatedUrl = `${window.location.origin}/blog/${post.id}`;
    navigator.clipboard.writeText(simulatedUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const currentCommentCount = useMemo(() => {
    return comments.filter(c => c.postId === post.id && (c.isApproved || !c.isApproved)).length;
  }, [comments, post]);

  // Insert a guest comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = user ? (user.name || user.username) : commentName;
    if (!finalName || !commentText) return;

    const newComment: Comment = {
      id: `c-guest-` + Date.now(),
      postId: post.id,
      name: finalName,
      content: commentText,
      date: new Date().toISOString().split('T')[0],
      avatar: user?.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=150&q=80`,
      likes: 0,
      replies: [],
      isApproved: true // Instantly visible for a smooth demo
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    setCommentIsSuccess(true);
    setTimeout(() => setCommentIsSuccess(false), 3000);
  };

  // Reply to comment
  const handleSubmitReply = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    const finalReplyName = user ? (user.name || user.username) : replyName;
    if (!finalReplyName || !replyText) return;

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const newReply: CommentReply = {
          id: `cr-` + Date.now(),
          name: finalReplyName,
          content: replyText,
          date: new Date().toISOString().split('T')[0],
          avatar: user?.avatar || `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80`,
          likes: 0
        };
        return {
          ...c,
          replies: [...c.replies, newReply]
        };
      }
      return c;
    }));

    setReplyName('');
    setReplyText('');
    setReplyingToCommentId(null);
  };

  // Like a comment
  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: c.likes + 1 };
      }
      return c;
    }));
  };

  // Admin delete comment
  const handleDeleteComment = (commentId: string) => {
    if (confirm("Are you sure you want to moderate and delete this comment?")) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  // Language selectors
  const titleText = language === 'bn' ? post.titleBn || post.title : language === 'ar' ? post.titleAr || post.title : post.title;
  const contentText = language === 'bn' ? post.contentBn || post.content : language === 'ar' ? post.contentAr || post.content : post.content;
  const categoryText = language === 'bn' ? post.categoryBn || post.category : language === 'ar' ? post.categoryAr || post.category : post.category;

  // Render dummy galleries or content enhancements
  const segments = contentText.split('\n\n');

  return (
    <div className="space-y-8 relative pb-16">
      
      {/* Sticky Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3.5px] bg-neutral-100 dark:bg-slate-950 z-50">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-violet-500 to-pink-500 transition-all duration-75" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back button Row & breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <button
          onClick={onBack}
          id="btn-back-to-hub"
          className="px-4 py-2 border border-neutral-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-slate-900 transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'আর্টিকেল তালিকা' : language === 'ar' ? 'رجوع رئيسي' : 'Back to Intel Hub'}</span>
        </button>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 dark:text-slate-450">
          <span className="cursor-pointer hover:underline" onClick={onBack}>Blog</span>
          <ChevronRight className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{categoryText}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-violet-500 font-semibold truncate max-w-[120px]">{titleText}</span>
        </div>
      </div>

      {/* Widescreen Hero Cover / Canvas Graphic Header */}
      {post.id === 'whmcs-automation' ? (
        <div className="w-full rounded-2xl md:rounded-3xl border border-[#00E5FF]/20 overflow-hidden relative shadow-2xl min-h-[300px] md:min-h-[420px] flex flex-col justify-end p-6 md:p-10 bg-slate-950">
          
          {/* Animated Gradient Mesh Background layer with glow blobs */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#00E5FF] opacity-30 blur-[80px] animate-pulse" />
            <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#7C3AED] opacity-25 blur-[100px] animate-pulse" />
            <div className="absolute -bottom-10 left-1/3 w-80 h-80 rounded-full bg-[#EC4899] opacity-25 blur-[90px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#3B82F6] opacity-35 blur-[80px] animate-pulse" />
          </div>

          {/* Floating Neon Particles */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            <div className="absolute top-1/4 right-24 w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
            <div className="absolute bottom-12 left-1/4 w-2.5 h-2.5 rounded-full bg-[#EC4899] animate-pulse" />
            <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping" />
          </div>

          {/* Glassmorphism gradient layer to shield content */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent backdrop-blur-[2px] z-0" />
          
          {/* Cover image blended overlay */}
          <div className="absolute right-0 bottom-0 top-0 w-full lg:w-1/2 opacity-25 lg:opacity-35 pointer-events-none mix-blend-screen overflow-hidden">
            <img 
              src={post.image} 
              alt={titleText} 
              className="w-full h-full object-cover scale-105" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-transparent lg:to-transparent" />
          </div>

          {/* Title Header text with gradient effect */}
          <div className="relative z-10 space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#00E5FF] bg-white/10 backdrop-blur-md rounded-full shadow-lg font-mono border border-[#00E5FF]/20">
                🚀 {categoryText}
              </span>
              <span className="px-3 py-1 bg-pink-500/20 text-[#EC4899] border border-[#EC4899]/30 text-[9px] uppercase font-mono font-bold rounded-full">
                🔥 Hot Premium Feature
              </span>
              {post.tags && post.tags.map((tg) => (
                <span key={tg} className="px-2.5 py-1 bg-white/5 text-slate-300 text-[9px] uppercase font-mono font-bold rounded-full border border-white/10">
                  #{tg}
                </span>
              ))}
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-xl"
            >
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] via-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                WHMCS 9.0.0
              </span>{' '}
              – How Web Hosting Billing & Automation Works
            </motion.h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
                {post.readTime} Read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-[#00E5FF]" />
                {post.views} Views
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <Check className="w-4 h-4" /> SEO Optimized & Fast-Loading
              </span>
            </div>
          </div>
        </div>
      ) : post.id === 'domain-registration-services' ? (
        <div className="w-full rounded-2xl md:rounded-3xl border border-[#00E5FF]/25 overflow-hidden relative shadow-2xl min-h-[300px] md:min-h-[420px] flex flex-col justify-end p-6 md:p-10 bg-slate-950 font-sans">
          
          {/* Animated Gradient Mesh Background layer with requested colors */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-75">
            <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-[#00E5FF]/15 blur-[90px] animate-pulse" />
            <div className="absolute top-20 right-10 w-[450px] h-[450px] rounded-full bg-[#7C3AED]/20 blur-[120px] animate-pulse [animation-duration:8s]" />
            <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-[#EC4899]/15 blur-[100px] animate-pulse [animation-duration:6s]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#3B82F6]/20 blur-[95px] animate-pulse [animation-duration:7s]" />
          </div>

          {/* Floating Neon Particles */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-55">
            <div className="absolute top-10 left-12 w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            <div className="absolute top-1/3 right-20 w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
            <div className="absolute bottom-16 left-1/4 w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
            <div className="absolute top-1/2 left-[60%] w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping" />
          </div>

          {/* Glassmorphism gradient overlay layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent backdrop-blur-[2px] z-0" />
          
          {/* Cover image blended overlay */}
          <div className="absolute right-0 bottom-0 top-0 w-full lg:w-1/2 opacity-20 lg:opacity-30 pointer-events-none mix-blend-screen overflow-hidden">
            <img 
              src={post.image} 
              alt={titleText} 
              className="w-full h-full object-cover scale-105" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-transparent lg:to-transparent" />
          </div>

          {/* Title Header text with gradient effect */}
          <div className="relative z-10 space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#00E5FF] bg-white/10 backdrop-blur-md rounded-full shadow-lg font-mono border border-[#00E5FF]/20">
                🌐 Domain Registration Services
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-[#7C3AED]/20 to-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30 text-[9px] uppercase font-mono font-bold rounded-full">
                🔥 Hostinger & Cloudflare Premium
              </span>
              {post.tags && post.tags.map((tg) => (
                <span key={tg} className="px-2.5 py-1 bg-white/5 text-slate-300 text-[9px] uppercase font-mono font-bold rounded-full border border-white/10">
                  #{tg}
                </span>
              ))}
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-xl"
            >
              Secure Your{' '}
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] via-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                Perfect Domain Name
              </span>{' '}
              Today
            </motion.h1>

            <p className="text-xs md:text-sm lg:text-base text-slate-300 font-sans font-semibold">
              Professional Domain Registration Solutions for Startups & Growing Businesses
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-350 pt-2 border-t border-white/10 max-w-2xl">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                {post.readTime} Read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-pink-500 animate-pulse" />
                {post.views} Views
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <Check className="w-4 h-4" /> SEO Optimized & Fast-Loading
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Standard widescreen Cover Image Card code */
        <div className="w-full rounded-2xl md:rounded-3xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative group shadow-lg">
          <div className="aspect-[21/9] w-full min-h-[220px] md:min-h-[380px] max-h-[460px] relative">
            <img 
              src={post.image} 
              alt={titleText} 
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500" 
              referrerPolicy="no-referrer" 
            />
            {/* Overlay dark shade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col justify-end space-y-3.5 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-widest text-white rounded bg-gradient-to-r ${getCategoryGradient(post.category)}`}>
                  {categoryText}
                </span>
                {post.tags && post.tags.map((tg) => (
                  <span key={tg} className="px-2 py-0.5 bg-white/20 hover:bg-white/35 backdrop-blur-md text-white text-[9px] uppercase font-mono font-bold rounded">
                    #{tg}
                  </span>
                ))}
              </div>

              <h1 className="text-lg md:text-3xl lg:text-4xl font-black leading-tight tracking-tight drop-shadow-md">
                {titleText}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-violet-400" />
                  {post.readTime} Read
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views} Views
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Layout Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Sticky TOC and shares */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-12 h-fit">
          
          {/* Table of Contents Widget */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white mb-3.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-violet-500" />
              <span>Table of Contents</span>
            </h4>
            <div className="space-y-2">
              {post.outline && post.outline.map((o) => {
                const label = language === 'bn' ? o.textBn : language === 'ar' ? o.textAr : o.text;
                const isCurrent = activeSection === o.id;

                return (
                  <a
                    key={o.id}
                    href={`#${o.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(o.id)?.scrollIntoView({ behavior: 'smooth' });
                      setActiveSection(o.id);
                    }}
                    className={`block py-1.5 px-2 rounded-lg text-xs font-medium cursor-pointer transition-all border-l-2 leading-tight ${
                      isCurrent 
                        ? 'border-violet-500 bg-violet-50/50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400 font-semibold'
                        : 'border-transparent text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* High-Performance Premium Newsletter Signup Panel */}
          <div className="p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-slate-900 dark:to-slate-950 rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#EC4899]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6] font-mono">
                  Weekly Insights Feed
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-neutral-950 dark:text-white">
                  Join WebzoneBD Tech Circle
                </h4>
                <p className="text-neutral-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Get high-velocity hosting guides, WHMCS security checks, and modern core developer secrets directly in your inbox.
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Successfully added to the premium intelligence feed! Welcome aboard WebzoneBD Circle.");
                }}
                className="space-y-2.5"
                id="newsletter-form-sidebar"
              >
                <div className="space-y-1.5">
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter professional email..." 
                    className="w-full bg-white dark:bg-slate-950/80 border border-neutral-200 dark:border-slate-800 px-3 py-2 text-xs rounded-xl text-neutral-905 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2 bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer select-none"
                >
                  Join Feed Now
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Center/Right colums: Article details and comments */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Main Reading Canvas */}
          <article className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.01)] relative overflow-hidden">
            
            {/* Omitted smaller cover image banner since the massive fullscreen cinematic header is active! */}

            {/* Badges block */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3.5 py-1 text-white font-extrabold uppercase tracking-widest text-[9.5px] rounded-full bg-gradient-to-r ${getCategoryGradient(post.category)}`}>
                {categoryText}
              </span>
              {post.tags && post.tags.map((tg) => (
                <span key={tg} className="px-2.5 py-1 bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-350 text-[10px] uppercase font-bold rounded-lg font-mono">
                  #{tg}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-black text-neutral-900 dark:text-white leading-tight tracking-tight mb-4">
              {titleText}
            </h1>

            {/* Author details banner */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-slate-950 border border-neutral-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 mb-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm">
                  {post.author ? post.author[0] : 'W'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-white leading-none">
                    {post.author || 'Senior Enterprise Architect'}
                  </h4>
                  <span className="text-[10px] text-neutral-500 dark:text-slate-400 font-mono">
                    Published: {post.date} • Revision: June 2026
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 dark:text-slate-450">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-violet-500" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views} Views
                </span>
                <button
                  onClick={() => onBookmarkToggle(post.id)}
                  id="header-action-bookmark-toggle"
                  className="flex items-center gap-1 hover:text-amber-500 cursor-pointer text-xs"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>

            </div>

            {/* Dynamic Rich Text rendering */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-slate-300 space-y-5 text-sm md:text-base leading-relaxed font-sans">
              
              {segments.map((seg, idx) => {
                const showOfferCard = post.id === 'whmcs-automation' && idx === 5;
                const showDomainOfferCard = post.id === 'domain-registration-services' && idx === 3;

                // Render headings nicely
                if (seg.startsWith('### ')) {
                  let headingId = post.outline && post.outline[idx] ? post.outline[idx].id : `heading-${idx}`;
                  if (post.id === 'whmcs-automation') {
                    if (seg.includes('Step 1')) headingId = 'step-1';
                    else if (seg.includes('Step 2')) headingId = 'step-2';
                    else if (seg.includes('Step 3')) headingId = 'step-3';
                    else if (seg.includes('Step 4')) headingId = 'step-4';
                    else if (seg.includes('Step 5')) headingId = 'step-5';
                    else if (seg.includes('Step 6')) headingId = 'step-6';
                    else if (seg.includes('Step 7')) headingId = 'step-7';
                    else if (seg.includes('Why Choose')) headingId = 'why-whmcs';
                  } else if (post.id === 'domain-registration-services') {
                    if (seg.includes('What Is a Domain')) headingId = 'domain-definition';
                    else if (seg.includes('Why Is Domain Registration')) headingId = 'domain-importance';
                    else if (seg.includes('How Domain Registration Works')) headingId = 'domain-workflow';
                    else if (seg.includes('Why Choose WebzoneBD')) headingId = 'domain-advantages';
                  }

                  return (
                    <motion.h3 
                       initial={{ opacity: 0, x: -5 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       key={idx} 
                       id={headingId}
                       className="text-lg md:text-xl font-black tracking-tight text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-slate-800 pb-2 pt-6 flex items-center gap-1.5 group transition-colors"
                    >
                      <span className="text-[#3B82F6] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all font-mono">#</span>
                      <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-slate-350 bg-clip-text hover:text-[#00E5FF] transition-colors">
                        {seg.replace('### ', '')}
                      </span>
                    </motion.h3>
                  );
                }

                // Render code block custom helper - suppress for Custom structured articles
                if (post.id !== 'whmcs-automation' && post.id !== 'domain-registration-services' && (seg.includes('```') || idx === 2)) {
                  return (
                    <div key={idx} className="my-4 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                      <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Terminal/PHP Code block</span>
                        <span className="flex items-center gap-1 cursor-pointer hover:text-white">
                          <Code className="w-3 h-3" />
                          <span>Syntax Active</span>
                        </span>
                      </div>
                      <pre className="bg-slate-900 p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                        {`// Optimized routing middleware schema\nRoute::middleware(['sslcommerz.webhook'])->group(function () {\n    Route::post('/payment/verification', [PaymentController::class, 'verifyTransaction']);\n    Route::get('/payment/logs', [PaymentController::class, 'readCloudLogs']);\n});`}
                      </pre>
                    </div>
                  );
                }

                // Render custom callout block mock - suppress for custom structured articles
                if (post.id !== 'whmcs-automation' && post.id !== 'domain-registration-services' && idx === 1) {
                  return (
                    <div key={idx} className="p-4 my-2 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 flex gap-3 text-sm text-neutral-700 dark:text-slate-300">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-none" />
                      <div>
                        <strong className="block text-amber-500 font-bold mb-0.5">Critical Precaution:</strong>
                        <span>Never concatenate user inputs into a dynamic raw query. Bruteforcers can manipulate variables to dump system coordinates. Always filter inputs and compile with strict parameters.</span>
                      </div>
                    </div>
                  );
                }

                // Standard paragraph with micro scroll reveal feel
                return (
                  <React.Fragment key={idx}>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      className="leading-relaxed text-sm md:text-base text-neutral-700 dark:text-slate-300 transition-colors hover:text-black dark:hover:text-white"
                    >
                      {seg}
                    </motion.p>
                    {showOfferCard && renderHostingOfferCard()}
                    {showDomainOfferCard && renderDomainOfferCard()}
                  </React.Fragment>
                );
              })}

              {/* Enhanced Interactive Element: Database Query Comparison Table - Suppress for custom structured articles */}
              {post.id !== 'whmcs-automation' && post.id !== 'domain-registration-services' && (
                <div className="my-6 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-violet-500" />
                    <span>Performance Benchmark Comparison (Laravel vs Node cPanel)</span>
                  </h4>
                  <div className="overflow-x-auto border border-neutral-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs text-neutral-600 dark:text-slate-400 font-sans">
                      <thead className="bg-neutral-50 dark:bg-slate-950 text-neutral-800 dark:text-white font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Database Target</th>
                          <th className="p-3">SATA Hosting Delay</th>
                          <th className="p-3">AMD EPYC NVMe Speed</th>
                          <th className="p-3">Enhancement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-slate-800">
                        <tr>
                          <td className="p-3 font-semibold">10,000 Order Index Select</td>
                          <td className="p-3">280 ms</td>
                          <td className="p-3 text-emerald-500 font-bold">14 ms</td>
                          <td className="p-3 font-mono">20.0X Faster</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">Stripe webhook authentication verify</td>
                          <td className="p-3">450 ms</td>
                          <td className="p-3 text-emerald-500 font-bold">38 ms</td>
                          <td className="p-3 font-mono">11.8X Speed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Custom Image Micro-gallery - Suppress for WHMCS & Domain posts */}
              {post.id !== 'whmcs-automation' && post.id !== 'domain-registration-services' && (
                <div className="grid grid-cols-2 gap-3 my-6">
                  <div className="rounded-xl overflow-hidden aspect-video bg-neutral-100 relative group">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-slate-950/20" />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-video bg-neutral-100 relative group">
                    <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-slate-950/20" />
                  </div>
                </div>
              )}

              {/* Simulated Embedded Video Mockup - Suppress for WHMCS & Domain posts */}
              {post.id !== 'whmcs-automation' && post.id !== 'domain-registration-services' && (
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-slate-950 border border-neutral-200 dark:border-slate-800 my-6 flex flex-col items-center justify-center text-center space-y-3 aspect-video relative overflow-hidden group">
                  <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-slate-950/30 transition-colors z-0" />
                  <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover z-[-1]" />
                  
                  <button 
                    onClick={() => alert("Simulated playback: Booting micro server setup visualization video tutorial.")}
                    id="media-play-btn"
                    className="w-14 h-14 bg-violet-600 hover:bg-violet-750 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all cursor-pointer relative z-10 select-none"
                  >
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                  <div className="relative z-10 text-white space-y-0.5">
                    <h5 className="font-bold text-sm">System Optimization Guide Layout</h5>
                    <p className="text-[10px] text-gray-300 font-mono">Duration: 14:20 mins • Cloud WebzoneBD Tutorial</p>
                  </div>
                </div>
              )}

            </div>

            {/* Micro Reactions HUD below content */}
            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 dark:text-slate-450 uppercase font-extrabold mr-1">React:</span>
                
                <button
                  onClick={() => {
                    setLoves(prev => loved ? prev - 1 : prev + 1);
                    setLoved(!loved);
                  }}
                  id="reaction-love-btn"
                  className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                    loved ? 'bg-rose-500 text-white' : 'bg-neutral-50 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${loved ? 'fill-current' : ''}`} />
                  <span>{loves}</span>
                </button>

                <button
                  onClick={() => {
                    setClaps(prev => clapped ? prev - 1 : prev + 1);
                    setClapped(!clapped);
                  }}
                  id="reaction-clap-btn"
                  className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                    clapped ? 'bg-indigo-500 text-white' : 'bg-neutral-50 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100'
                  }`}
                >
                  <span>👏</span>
                  <span>{claps}</span>
                </button>

                <button
                  onClick={() => {
                    setInsights(prev => insightActive ? prev - 1 : prev + 1);
                    setInsightActive(!insightActive);
                  }}
                  id="reaction-insight-btn"
                  className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                    insightActive ? 'bg-amber-500 text-white' : 'bg-neutral-50 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100'
                  }`}
                >
                  <span>💡</span>
                  <span>{insights}</span>
                </button>
              </div>

              {/* Share Copy feedback inline */}
              <button
                onClick={() => {
                  onLikeToggle(post.id);
                }}
                id="footer-like-increment-btn"
                className="px-4 py-1.5 font-bold font-mono bg-violet-600 text-white hover:bg-violet-750 text-xs rounded-full flex items-center gap-1 cursor-pointer select-none"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Like this Post ({post.likes})</span>
              </button>

            </div>

            {/* Share Insights (Small Icons Only under the post) */}
            <div className="mt-6 pt-5 border-t border-dashed border-neutral-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 font-mono">
                  {language === 'bn' ? 'শেয়ার করুন' : language === 'ar' ? 'مشاركة المقال' : 'Share Insights'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-neutral-600 dark:text-slate-350 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`} 
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter/X"
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-slate-950 dark:hover:text-white text-neutral-600 dark:text-slate-350 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                >
                  <span className="text-xs font-black font-mono">X</span>
                </a>
                <a 
                  href={`https://linkedin.com/shareArticle?url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`} 
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-slate-800 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-800 dark:hover:text-white text-neutral-600 dark:text-slate-350 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`} 
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-neutral-600 dark:text-slate-350 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
                <a 
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`} 
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram"
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 dark:hover:text-white text-neutral-600 dark:text-slate-350 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                >
                  <TelegramIcon className="w-4 h-4" />
                </a>
                <button 
                  onClick={handleCopyLink}
                  title="Copy Link"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    copiedLink 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                      : 'bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 text-neutral-600 dark:text-slate-350'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </article>

          {/* About Author Box Section */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-slate-400 mb-4 font-mono">
              About the Author Publication Group
            </h4>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white text-xl font-bold font-sans">
                {post.author ? post.author[0] : 'W'}
              </div>
              <div className="space-y-2 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    {post.author || 'Senior DevOps Specialist'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-lg border border-violet-500/20 text-violet-600 dark:text-violet-400 font-mono text-[9.5px]">
                    15 publications
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-slate-400 leading-relaxed font-sans">
                  Imran Hasan contributes to server stack designs, webhooks safety standards, performance scaling systems, and cloud architecture developments regularly.
                </p>
                
                <div className="flex justify-center md:justify-start gap-3 pt-1 text-[11px] font-mono font-bold text-violet-500">
                  <span className="cursor-pointer hover:underline">GitHub Workspace</span>
                  <span>•</span>
                  <span className="cursor-pointer hover:underline">LinkedIn Profile</span>
                </div>
              </div>
            </div>
          </div>

          {/* WebzoneBD Core Services promotions layout / Custom WHMCS Automation CTA */}
          {post.id === 'whmcs-automation' ? (
            <div className="p-8 rounded-3xl border border-neutral-200 dark:border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl z-0" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl z-0" />
              
              <div className="relative z-10 space-y-6">
                <span className="px-3 py-1 bg-gradient-to-r from-[#00E5FF] to-pink-500 text-white font-extrabold uppercase tracking-widest text-[9.5px] rounded-lg">
                  ⚡ Automation Agency Service
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Need WHMCS Setup or Hosting Automation?
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                    At WebzoneBD IT Solution, we provide complete WHMCS installer provisioning, automation configurations, payment gateway setups, custom API integration, client theme styles, and full lifecycle support.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>WHMCS Pro 9.0.0 Configuration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>cPanel / Virtuozzo Automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>SslCommerz & Local Gateways</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>Premium Responsive Themes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <a 
                    href="#contact-section" 
                    onClick={onBack}
                    id="whmcs-cta-consultation-btn"
                    className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-650 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer select-none"
                  >
                    Get Free Consultation
                  </a>
                  <a 
                    href="https://wa.me/8801978250615"
                    target="_blank"
                    rel="noreferrer"
                    id="whmcs-cta-contact-btn"
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer select-none border border-slate-700"
                  >
                    Contact WebzoneBD
                  </a>
                </div>
              </div>
            </div>
          ) : post.id === 'domain-registration-services' ? (
            <div className="p-8 rounded-3xl border border-neutral-200 dark:border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl z-0" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7C3AED]/5 rounded-full blur-3xl z-0" />
              
              <div className="relative z-10 space-y-6">
                <span className="px-3 py-1 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-white font-extrabold uppercase tracking-widest text-[9.5px] rounded-lg">
                  ⚡ Domain Management Portal
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Secure Your Perfect Domain with WebzoneBD IT Solution
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                    At WebzoneBD, we help startups, entrepreneurs, and growing businesses build a strong foundation online with domain registration, premium web hosting, website design, custom ERP solutions, and digital strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>Instant .COM, .NET, .ORG Registry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>Free DNS Nameserver Delegation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>Secure Registrar Lock Against Hijacking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    <span>24/7 WebzoneBD Expert Support Feed</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <a 
                    href="https://www.host.webzonebd.com/cart.php?a=add&domain=register" 
                    target="_blank"
                    rel="noreferrer"
                    id="domain-portal-btn-register"
                    className="px-5 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer select-none"
                  >
                    🚀 Search & Register Now
                  </a>
                  <a 
                    href="#contact-section" 
                    onClick={onBack}
                    id="domain-consultation-btn"
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer select-none border border-slate-700"
                  >
                    Get General Consultation
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-neutral-200 dark:border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-xl relative overflow-hidden font-sans">
              <div className="absolute top-0 right-0 w-44 h-44 bg-violet-500/10 rounded-full blur-3xl z-0" />
              
              <div className="relative z-10 space-y-4">
                <span className="px-3 py-1 bg-violet-500/20 text-violet-400 font-extrabold uppercase tracking-widest text-[9.5px] rounded-lg">
                  Related WebzoneBD Core Services Promo
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
                    Optimize Your Professional IT Solutions Now
                  </h3>
                  <p className="text-gray-400 text-xs max-w-2xl leading-relaxed">
                    WebzoneBD delivers top-tier Web Development, Google Ads Management, Local SEO Blueprint configurations, ERP software solutions, and High-Performance Cloud VPS configurations.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-bold text-slate-200">
                  <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-none" /><span>Web Development</span></div>
                  <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-none" /><span>SEO Services</span></div>
                  <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-none" /><span>ERP & POS Software</span></div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-3">
                  <a 
                    href="#contact-section" 
                    onClick={onBack}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-750 hover:to-indigo-750 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/20 cursor-pointer select-none"
                  >
                    Get Consultation
                  </a>
                  <a 
                    href="https://wa.me/8801978250615"
                    target="_blank"
                    rel="noreferrer"
                    id="cta-wa-service-btn"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer select-none"
                  >
                    WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Comments council section */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 dark:border-slate-800/80 pb-4">
              <h3 className="text-base font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-4.5 h-4.5 text-violet-500" />
                <span>Executive Council Disclosures ({currentCommentCount})</span>
              </h3>

              {/* Administration moderator selector lock */}
              <button
                onClick={() => setIsAdminModerator(!isAdminModerator)}
                id="comment-admin-toggle-btn"
                className={`px-3 py-1 rounded-lg text-[10px] uppercase font-mono font-bold border cursor-pointer select-none ${
                  isAdminModerator 
                    ? 'bg-rose-500 text-white border-rose-500' 
                    : 'border-neutral-200 dark:border-slate-800 text-neutral-500 hover:bg-neutral-50'
                }`}
              >
                {isAdminModerator ? '🔐 Admin Moderator Mode: Active' : '🔓 Toggle Mod Desk'}
              </button>
            </div>

            {/* Existing Comments loop */}
            <div className="space-y-6">
              {comments.filter(c => c.postId === post.id).map((cmt) => (
                <div 
                  key={cmt.id} 
                  id={`comment-container-${cmt.id}`}
                  className="p-4 bg-neutral-50 dark:bg-slate-950 rounded-2xl border border-neutral-200/60 dark:border-slate-800/60 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img src={cmt.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-extrabold text-neutral-800 dark:text-white">
                          {cmt.name}
                        </h4>
                        <span className="text-[9px] text-neutral-500 dark:text-slate-400 font-mono">
                          {cmt.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLikeComment(cmt.id)}
                        id={`cmt-like-${cmt.id}`} 
                        className="p-1 px-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg text-[11px] font-mono text-neutral-500 dark:text-slate-400 flex items-center gap-1 cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-violet-550" />
                        <span>{cmt.likes}</span>
                      </button>

                      <button
                        onClick={() => setReplyingToCommentId(replyingToCommentId === cmt.id ? null : cmt.id)}
                        id={`cmt-reply-btn-${cmt.id}`} 
                        className="py-1 px-2 text-[11px] font-mono text-violet-500 hover:underline cursor-pointer"
                      >
                        Reply
                      </button>

                      {isAdminModerator && (
                        <button
                          onClick={() => handleDeleteComment(cmt.id)}
                          id={`cmt-delete-${cmt.id}`} 
                          className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 dark:text-slate-300 leading-relaxed font-sans pl-1.5">
                    {cmt.content}
                  </p>

                  {/* Replied block tree */}
                  {cmt.replies && cmt.replies.length > 0 && (
                    <div className="ml-6 pl-4 border-l border-violet-500/20 space-y-4 pt-2">
                      {cmt.replies.map((rep) => (
                        <div key={rep.id} className="p-3 bg-neutral-100 dark:bg-slate-900 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-2">
                            <img src={rep.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <div>
                              <h5 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                                {rep.name}
                              </h5>
                              <span className="text-[8px] text-neutral-500 font-mono block">
                                Reply • {rep.date}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-slate-450 leading-relaxed pl-1">
                            {rep.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply entry box */}
                  <AnimatePresence>
                    {replyingToCommentId === cmt.id && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={(e) => handleSubmitReply(cmt.id, e)}
                        className="ml-6 pl-4 border-l-2 border-dashed border-violet-500/30 pt-3 space-y-2"
                      >
                        {!user ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Name"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                              className="bg-white dark:bg-slate-900 border border-neutral-300 dark:border-slate-800 p-2 text-xs rounded-xl text-neutral-900 dark:text-white"
                            />
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500 font-mono">
                            Replying securely as <strong className="text-violet-500">{user.name || user.username}</strong>
                          </div>
                        )}
                        <div className="relative">
                          <textarea
                            required
                            rows={2}
                            placeholder="Add reply thread comment details..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-neutral-300 dark:border-slate-800 p-2 text-xs rounded-xl text-neutral-950 dark:text-white"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-750 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                        >
                          Submit Reply
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                </div>
              ))}
            </div>

            {/* Comment adding form */}
            {(!user || user.role !== 'customer') ? (
              <div className="p-6 bg-amber-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-amber-300 dark:border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center justify-center gap-1.5">
                    <span>🔐 Customer Authentication Required</span>
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed font-sans">
                    {user ? (
                      language === 'bn'
                        ? `আপনি বর্তমানে '${user.role}' হিসাবে সাইন ইন আছেন। মন্তব্য করার জন্য অনুগ্রহ করে আপনার কাস্টমার অ্যাকাউন্ট দিয়ে লগইন করুন।`
                        : `You are signed in as '${user.role}'. To preserve council integrity, only logged-in WebzoneBD customers may post commentaries.`
                    ) : (
                      language === 'bn' 
                        ? 'এই ক্যাটাগরির রিভিউ ও মতামত প্রকাশের জন্য কাস্টমার অ্যাকাউন্ট দিয়ে লগইন করা আবশ্যক।' 
                        : language === 'ar' 
                        ? 'يلزم تسجيل دخول العملاء أولاً للمشاركة بآرائهم والتعليق.' 
                        : 'To preserve council integrity, only logged-in WebzoneBD customers may post commentaries.'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => onLoginClick?.('login')}
                  type="button"
                  id="comment-auth-cta-btn"
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer select-none transition-transform hover:scale-[1.02]"
                >
                  🔑 {language === 'bn' ? 'কাস্টমার লগইন' : language === 'ar' ? 'تسجيل دخول العملاء' : 'Customer Login / Sign Up'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitComment} className="p-4 bg-neutral-50 dark:bg-slate-950 rounded-2xl border border-neutral-200 dark:border-slate-800 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                      Submit Council Commentary (Logged In)
                    </h4>
                  </div>
                  <p className="text-[10px] text-neutral-510 dark:text-slate-400 leading-snug">
                    Posting securely as <strong className="text-violet-500">{user.name || user.username}</strong> ({user.role})
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-60">
                  <input
                    type="text"
                    disabled
                    placeholder="Your Name (Visible)"
                    value={commentName}
                    className="w-full p-2.5 text-xs bg-neutral-100 dark:bg-slate-800 border border-neutral-200 dark:border-slate-800 rounded-xl text-neutral-500 select-none cursor-not-allowed"
                  />
                  <input
                    type="email"
                    disabled
                    placeholder="Private Address (Invisible)"
                    value={commentEmail}
                    className="w-full p-2.5 text-xs bg-neutral-100 dark:bg-slate-800 border border-neutral-200 dark:border-slate-800 rounded-xl text-neutral-500 select-none cursor-not-allowed"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="What is your review of this design checklist or code snippet module?"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-xl text-neutral-900 dark:text-white font-sans"
                />

                <button
                  type="submit"
                  id="comment-submit-btn"
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Submit council commentary</span>
                  <Send className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {commentIsSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-xs rounded-xl font-bold font-sans flex items-center gap-1.5"
                    >
                      <span>✓ Comment added live below! Join the digital resources discussion.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            )}

          </div>

          {/* Related Articles Slider */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-950 dark:text-white flex items-center gap-1">
                <span>Recommended Reading (Same Category)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((rp) => {
                  const rTitle = language === 'bn' ? rp.titleBn || rp.title : language === 'ar' ? rp.titleAr || rp.title : rp.title;
                  return (
                    <div 
                      key={rp.id}
                      onClick={() => onSelectRelated(rp)}
                      className="p-4 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-violet-500/30 transition-all flex gap-3 group"
                    >
                      <img src={rp.image} alt="" className="w-20 h-14 object-cover rounded-lg flex-none group-hover:opacity-90" referrerPolicy="no-referrer" />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-bold text-neutral-850 dark:text-white group-hover:text-violet-500 line-clamp-2 leading-snug">
                          {rTitle}
                        </h4>
                        <span className="text-[9px] text-neutral-400 font-mono uppercase block mt-1">
                          {rp.date} • {rp.readTime}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive SEO Crawling visualizer card */}
          <div className="p-6 bg-slate-900/50 dark:bg-slate-950/60 border border-neutral-200/50 dark:border-slate-800 rounded-3xl text-xs space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Code className="w-4 h-4 text-violet-400" />
              <span>CRAWLER METADATA SIMULATOR & SCHEMAS (SEO FRAMEWORK ON)</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-350 select-text">
              <div className="space-y-1 font-mono text-[10.5px]">
                <span className="text-violet-400 font-bold block">// LD-JSON Schema Markup</span>
                <p className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-400 overflow-x-auto leading-relaxed">
                  {`{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "${titleText.substring(0,60)}...",
  "image": "${post.image}",
  "author": "${post.author || 'Senior DevOps'}"
}`}
                </p>
              </div>

              <div className="space-y-1 font-sans text-xs">
                <span className="text-pink-400 font-bold block font-mono">// Live Open Graph Metadata Crawled Preview</span>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1 text-slate-400">
                  <p><span className="text-cyan-400">og:title:</span> "{titleText.substring(0,40)}..."</p>
                  <p><span className="text-cyan-400">og:description:</span> "{post.seoMetaDesc || 'Optimizing code deployment...'}"</p>
                  <p><span className="text-cyan-400">og:url:</span> "https://webzonebd.com/blog/{post.id}"</p>
                  <p><span className="text-cyan-400">og:image:</span> "{post.image.substring(0,35)}..."</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
