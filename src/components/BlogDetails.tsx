import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, User, Clock, Eye, Heart, Bookmark, Share2, 
  ArrowLeft, Copy, Check, MessageSquare, Send, ThumbsUp, Trash2, 
  ChevronRight, ChevronDown, Info, AlertTriangle, Play,
  Facebook, Linkedin, Send as TelegramIcon, PhoneCall, Code, CheckSquare,
  Twitter, MessageCircle
} from 'lucide-react';
import { LocalBlogPost } from './BlogData';
import { Language, Theme } from '../types';
import BdixBlogPostDetails from './BdixBlogPostDetails';

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

// Hostinger/Kinsta-style premium code block with file icon, copy confirmation, and elegant styling
function BlogCodeBlock({ code, language }: { code: string; language: string; key?: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-neutral-200 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_35px_rgba(0,0,0,0.25)]">
      <div className="bg-neutral-50 dark:bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-200 dark:border-slate-800">
        <span className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-550 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]/40" />
          <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">{language || 'CODE SNIPPET'}</span>
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#7C3AED] dark:text-slate-400 dark:hover:text-[#00E5FF] transition-colors focus:outline-none cursor-pointer p-1 rounded hover:bg-neutral-100 dark:hover:bg-slate-900"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold font-mono text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-semibold font-mono text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <pre className="bg-[#FAF9FB] dark:bg-slate-950 p-5 text-xs sm:text-sm font-mono text-neutral-800 dark:text-slate-100 overflow-x-auto leading-relaxed max-h-[450px]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
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
  if (post.id === 'bdix-hosting') {
    return (
      <BdixBlogPostDetails
        post={post}
        language={language}
        theme={theme}
        onBack={onBack}
        isBookmarked={isBookmarked}
        onBookmarkToggle={onBookmarkToggle}
        onLikeToggle={onLikeToggle}
        relatedPosts={relatedPosts}
        onSelectRelated={onSelectRelated}
      />
    );
  }

  const articleRef = useRef<HTMLElement>(null);
  // Reading percentage state
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Auto-generate high-performance outline by parsing markdown headings from post content dynamically
  const titleText = language === 'bn' ? post.titleBn || post.title : language === 'ar' ? post.titleAr || post.title : post.title;
  const contentText = language === 'bn' ? post.contentBn || post.content : language === 'ar' ? post.contentAr || post.content : post.content;
  const categoryText = language === 'bn' ? post.categoryBn || post.category : language === 'ar' ? post.categoryAr || post.category : post.category;

  const generatedOutline = useMemo(() => {
    const lines = contentText.split('\n');
    const headings: { id: string; text: string; level: number }[] = [];
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        const match = trimmed.match(/^(#+)\s*(.*)$/);
        if (match) {
          const hashes = match[1];
          const rawText = match[2].trim();
          // Skip internal link/button line or bracket characters if any
          if (rawText.startsWith('[') || rawText.startsWith('https://')) return;
          
          const text = rawText.replace(/\s*\(\s*.*?\s*\)\s*$/, '').trim(); 
          const id = text.toLowerCase()
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
            
          if (id && text && headings.findIndex(h => h.id === id) === -1) {
            headings.push({
              id,
              text,
              level: hashes.length
            });
          }
        }
      }
    });

    // Fallback to static post.outline if parsed output is sparse
    if (headings.length === 0 && post.outline) {
      return post.outline.map(o => ({
        id: o.id,
        text: language === 'bn' ? o.textBn : language === 'ar' ? o.textAr : o.text,
        level: 3
      }));
    }

    return headings;
  }, [contentText, post.outline, language]);

  // Active reading progress scroll dynamic calculations specifically over the blog post content area
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const headerHeight = 72; // Sticky Header height under which the progress bar sits
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Distance scrolled within the element bounds relative to sticky offset
      const scrolled = -(rect.top - headerHeight);
      const totalScrollable = elementHeight - (viewportHeight - headerHeight);

      if (totalScrollable > 0) {
        const percentage = (scrolled / totalScrollable) * 100;
        setReadingProgress(Math.min(100, Math.max(0, percentage)));
      } else {
        setReadingProgress(rect.top < headerHeight ? 100 : 0);
      }

      // Sync active outline section based on which element is closest to the header viewport threshold
      let currentActiveId = '';
      let smallestDiff = Infinity;

      generatedOutline.forEach((sect) => {
        const sectionEl = document.getElementById(sect.id);
        if (sectionEl) {
          const sectionRect = sectionEl.getBoundingClientRect();
          const topDiff = sectionRect.top - (headerHeight + 30);
          
          if (topDiff <= 100 && topDiff > -20) {
            const absDiff = Math.abs(topDiff);
            if (absDiff < smallestDiff) {
              smallestDiff = absDiff;
              currentActiveId = sect.id;
            }
          } else if (topDiff <= 0 && Math.abs(topDiff) < smallestDiff) {
            smallestDiff = Math.abs(topDiff);
            currentActiveId = sect.id;
          }
        }
      });

      if (currentActiveId) {
        setActiveSection(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [post.id, generatedOutline]);

  // Floating Reactions counts in local state
  const [claps, setClaps] = useState(128);
  const [clapped, setClapped] = useState(false);
  const [loves, setLoves] = useState(94);
  const [loved, setLoved] = useState(false);
  const [insights, setInsights] = useState(45);
  const [insightActive, setInsightActive] = useState(false);

  // YouTube playing state & URL helper function
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Helper to convert raw YouTube URLs (e.g. watch?v=... or youtu.be/...) into valid embeddable URLs for iframes
  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    const cleaned = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = cleaned.match(regExp);
    
    if (match && match[2] && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return cleaned;
  };

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

  // Render dummy galleries or content enhancements
  const segments = contentText.split('\n\n');

  // Modern inline markup parser supporting bold, inline code backticks, and SEO-friendly hyperlinks
  const parseInlineMarkup = (text: string): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

    parts.forEach((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        tokens.push(
          <strong key={index} className="font-extrabold text-[#7C3AED] dark:text-purple-400 bg-purple-550/5 dark:bg-purple-400/10 px-1 py-0.2 rounded transition-all duration-200">
            {content}
          </strong>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        const content = part.slice(1, -1);
        tokens.push(
          <code key={index} className="font-mono text-[12px] font-bold bg-neutral-100 dark:bg-slate-900 text-pink-600 dark:text-cyan-400 border border-neutral-200 dark:border-slate-800 rounded px-1.5 py-0.5 select-all">
            {content}
          </code>
        );
      } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const textLabel = match[1];
          const hrefUrl = match[2];
          tokens.push(
            <a 
              key={index} 
              href={hrefUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#7C3AED] dark:text-[#00E5FF] font-bold border-b-2 border-[#7C3AED]/30 dark:border-[#00E5FF]/30 hover:border-[#7C3AED] dark:hover:border-[#00E5FF] hover:bg-[#7C3AED]/5 dark:hover:bg-[#00E5FF]/5 transition-all duration-200 px-1.5 py-0.5 rounded"
            >
              {textLabel}
            </a>
          );
        } else {
          tokens.push(<span key={index}>{part}</span>);
        }
      } else {
        tokens.push(<span key={index}>{part}</span>);
      }
    });

    return tokens;
  };

  // Modern formatted content renderer for enhanced readability
  const renderFormattedContent = (seg: string, idx: number, showOfferCard: boolean, showDomainOfferCard: boolean) => {
    const cleanSeg = seg.trim();
    if (!cleanSeg) return null;

    // Check if the segment is a raw YouTube link to render a responsive embedded YouTube player
    const isYTUrl = (text: string) => {
      const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;
      return urlPattern.test(text);
    };

    if (isYTUrl(cleanSeg)) {
      const embedUrl = getYouTubeEmbedUrl(cleanSeg);
      if (embedUrl) {
        return (
          <div key={idx} className="my-8 aspect-video w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] bg-black relative">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={embedUrl}
              title="YouTube Video Embed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        );
      }
    }

    // A. Parse Code Blocks (surrounded by triple backticks)
    if (cleanSeg.startsWith('```')) {
      const parts = cleanSeg.split('```');
      const innerContent = parts[1] || '';
      const bLines = innerContent.split('\n');
      let customLang = 'Terminal/PHP Code';
      let cleanCode = innerContent;
      
      if (bLines[0] && bLines[0].length < 15 && !bLines[0].includes(' ') && !bLines[0].includes('=')) {
        customLang = bLines[0].toUpperCase();
        cleanCode = bLines.slice(1).join('\n').trim();
      } else {
        cleanCode = innerContent.trim();
      }
      return <BlogCodeBlock code={cleanCode} language={customLang} key={idx} />;
    }

    // B. Parse Callouts (Info, Warning, Success boxes)
    if (cleanSeg.startsWith('[INFO]') || cleanSeg.startsWith('Info:')) {
      const actualText = cleanSeg.replace(/^\[INFO\]\s*/i, '').replace(/^Info:\s*/i, '');
      return (
        <div key={idx} className="p-5 my-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border-l-[5px] border-blue-500 flex gap-4 text-[16px] text-neutral-850 dark:text-slate-200 shadow-sm">
          <Info className="w-5.5 h-5.5 text-blue-500 flex-none mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block text-blue-700 dark:text-blue-400 font-extrabold uppercase text-[11px] tracking-wider font-mono">SEO Technical Insight</strong>
            <p className="leading-relaxed font-sans text-sm sm:text-base font-medium">{parseInlineMarkup(actualText)}</p>
          </div>
        </div>
      );
    }

    if (cleanSeg.startsWith('[WARNING]') || cleanSeg.startsWith('Critical Precaution:') || cleanSeg.startsWith('Warning:')) {
      const actualText = cleanSeg.replace(/^\[WARNING\]\s*/i, '').replace(/^Critical Precaution:\s*/i, '').replace(/^Warning:\s*/i, '');
      return (
        <div key={idx} className="p-5 my-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-l-[5px] border-amber-500 flex gap-4 text-[16px] text-neutral-850 dark:text-slate-200 shadow-sm">
          <AlertTriangle className="w-5.5 h-5.5 text-amber-500 flex-none mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block text-amber-700 dark:text-amber-400 font-extrabold uppercase text-[11px] tracking-wider font-mono">Critical Configuration Warning</strong>
            <p className="leading-relaxed font-sans text-sm sm:text-base font-medium">{parseInlineMarkup(actualText)}</p>
          </div>
        </div>
      );
    }

    if (cleanSeg.startsWith('[SUCCESS]') || cleanSeg.startsWith('Success:') || cleanSeg.startsWith('Highly Recommended:')) {
      const actualText = cleanSeg.replace(/^\[SUCCESS\]\s*/i, '').replace(/^Success:\s*/i, '').replace(/^Highly Recommended:\s*/i, '');
      return (
        <div key={idx} className="p-5 my-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border-l-[5px] border-emerald-500 flex gap-4 text-[16px] text-neutral-850 dark:text-slate-200 shadow-sm">
          <CheckSquare className="w-5.5 h-5.5 text-emerald-500 flex-none mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block text-emerald-700 dark:text-emerald-400 font-extrabold uppercase text-[11px] tracking-wider font-mono">Conversion Best Practice</strong>
            <p className="leading-relaxed font-sans text-sm sm:text-base font-medium">{parseInlineMarkup(actualText)}</p>
          </div>
        </div>
      );
    }

    // C. Parse Blockquotes
    if (cleanSeg.startsWith('>')) {
      const quoteLines = cleanSeg.split('\n').map(line => line.trim().replace(/^>\s*/, ''));
      const quoteText = quoteLines.filter(Boolean).join(' ');
      return (
        <blockquote key={idx} className="my-7 p-6 md:p-8 rounded-2xl border-l-[6px] border-[#7C3AED] bg-purple-500/5 dark:bg-purple-500/10 italic text-neutral-800 dark:text-slate-100 font-serif text-[18px] md:text-[20px] leading-relaxed relative overflow-hidden">
          <span className="absolute -top-3 left-4 text-8xl text-[#7C3AED]/10 select-none font-serif">“</span>
          <div className="relative z-10 leading-relaxed font-semibold">{parseInlineMarkup(quoteText)}</div>
        </blockquote>
      );
    }

    // D. Parse Tables (containing pipes | and separator ---)
    const lines = cleanSeg.split('\n');
    const isTable = lines.some(l => l.includes('|')) && lines.some(l => l.includes('---'));
    if (isTable) {
      const tableLines = lines.map(l => l.trim()).filter(Boolean);
      const headersLine = tableLines[0];
      if (headersLine) {
        const headers = headersLine.split('|').map(h => h.trim()).filter((h, i, arr) => {
          if (i === 0 && h === '') return false;
          if (i === arr.length - 1 && h === '') return false;
          return true;
        });

        const rows = tableLines.slice(2).map(rowLine => {
          return rowLine.split('|').map(cell => cell.trim()).filter((cell, i, arr) => {
            if (i === 0 && cell === '') return false;
            if (i === arr.length - 1 && cell === '') return false;
            return true;
          });
        });

        return (
          <div key={idx} className="my-8 overflow-x-auto border border-neutral-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/40 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            <table className="w-full text-left text-sm text-neutral-700 dark:text-slate-300 font-sans border-collapse">
              <thead className="bg-neutral-50/80 dark:bg-slate-900 border-b border-neutral-200 dark:border-slate-800 text-neutral-900 dark:text-white font-bold tracking-tight">
                <tr>
                  {headers.map((hdr, hIdx) => (
                    <th key={hIdx} className="p-4 uppercase text-[11px] text-[#7C3AED] dark:text-[#00E5FF] tracking-wider font-extrabold">{parseInlineMarkup(hdr)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150 dark:divide-slate-850">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-50/40 dark:hover:bg-slate-800/10 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 font-semibold text-neutral-850 dark:text-slate-200 text-sm sm:text-base">{parseInlineMarkup(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    // E. Parse Lists (Bullet or Numbered)
    const isList = lines.some(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed) || /^[১-৯]+\./.test(trimmed) || trimmed.startsWith('✔');
    });

    if (isList) {
      const listItems: React.ReactNode[] = [];
      lines.forEach((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let isBullet = true;
        let bulletChar = "⚡";
        let bulletColor = "text-[#7C3AED] dark:text-[#00E5FF]";
        let rawText = trimmed;

        if (trimmed.startsWith('•')) {
          bulletChar = "⚡";
          bulletColor = "text-[#7C3AED] dark:text-[#00E5FF]";
          rawText = trimmed.replace(/^•\s*/, '');
        } else if (trimmed.startsWith('✔')) {
          bulletChar = "✔";
          bulletColor = "text-emerald-500";
          rawText = trimmed.replace(/^✔\s*/, '');
        } else if (trimmed.startsWith('-')) {
          bulletChar = "–";
          bulletColor = "text-slate-400";
          rawText = trimmed.replace(/^-\s*/, '');
        } else if (trimmed.startsWith('*')) {
          bulletChar = "✦";
          bulletColor = "text-[#7C3AED]";
          rawText = trimmed.replace(/^\*\s*/, '');
        } else if (/^\d+\./.test(trimmed)) {
          isBullet = false;
          const matches = trimmed.match(/^(\d+\.)\s*/);
          bulletChar = matches ? matches[1] : "1.";
          bulletColor = "text-[#7C3AED] dark:text-[#00E5FF]";
          rawText = trimmed.replace(/^\d+\.\s*/, '');
        } else if (/^[১-৯]+\./.test(trimmed)) {
          isBullet = false;
          const matches = trimmed.match(/^([১-৯]+\.)\s*/);
          bulletChar = matches ? matches[1] : "১.";
          bulletColor = "text-[#7C3AED] dark:text-[#00E5FF]";
          rawText = trimmed.replace(/^[১-৯]+\.\s*/, '');
        }

        listItems.push(
          <li key={lIdx} className="flex items-start gap-3 text-neutral-800 dark:text-slate-300 transition-colors duration-250 hover:text-black dark:hover:text-white group">
            {isBullet ? (
              <span className={`flex-none ${bulletColor} font-black font-sans select-none pt-0.5 text-base sm:text-lg shrink-0`}>
                {bulletChar === "⚡" ? "⚡" : bulletChar === "✔" ? "✅" : bulletChar}
              </span>
            ) : (
              <span className={`flex-none font-bold ${bulletColor} min-w-[24px] text-right text-sm pr-1 select-none shrink-0 font-mono`}>
                {bulletChar}
              </span>
            )}
            <span className="flex-1 text-slate-750 dark:text-slate-350 leading-[1.8] text-[16px] sm:text-[18px] font-medium">
              {parseInlineMarkup(rawText)}
            </span>
          </li>
        );
      });

      return (
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10px" }}
          className="my-6 pl-1 sm:pl-3 space-y-4 font-sans text-[17px] md:text-[18px] leading-[1.8]"
          key={idx}
        >
          {listItems}
        </motion.ul>
      );
    }

    // F. Default paragraphs or Headings (if inline # headings are grouped inside double spacing, render appropriately)
    const parsedBlocks: React.ReactNode[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.startsWith('#')) {
        const level = (trimmedLine.match(/^#+/) || ['#'])[0].length;
        const text = trimmedLine.replace(/^#+\s*/, '');
        const id = text.toLowerCase()
          .replace(/[^a-zA-Z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');

        if (level === 1 || level === 2) {
          parsedBlocks.push(
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12px" }}
              className="pt-10 pb-4 text-left group"
              id={id}
              key={`heading-${idx}-${i}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-7 rounded-full bg-gradient-to-b from-purple-600 to-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.4)]" />
                <h2 className="text-xl md:text-2xl font-black text-[#7C3AED] dark:text-purple-400 tracking-tight leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-200">
                  {parseInlineMarkup(text)}
                </h2>
              </div>
              <div className="h-[2px] w-full bg-gradient-to-r from-purple-100 to-transparent dark:from-purple-900/30 dark:to-transparent mt-4 group-hover:from-purple-500/20 transition-all duration-300" />
            </motion.div>
          );
        } else if (level === 3) {
          parsedBlocks.push(
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              className="pt-8 pb-3 text-left group"
              id={id}
              key={`heading-${idx}-${i}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 rounded-full bg-slate-400 dark:bg-slate-600" />
                <h3 className="text-lg md:text-xl font-bold text-neutral-800 dark:text-white tracking-tight leading-snug hover:text-[#7C3AED] transition-colors duration-200">
                  {parseInlineMarkup(text)}
                </h3>
              </div>
              <div className="h-[1px] w-full bg-slate-150 dark:bg-slate-800/60 mt-3" />
            </motion.div>
          );
        } else {
          parsedBlocks.push(
            <h4 id={id} className="text-base font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight pt-5 pb-2" key={`heading-${idx}-${i}`}>
              {parseInlineMarkup(text)}
            </h4>
          );
        }
        continue;
      }

      // Default high-converting optimized paragraph (18px paragraph, 1.85 line-height)
      const isFirstParagraph = idx === 0 && i === 0;
      const canHaveDropCap = isFirstParagraph && language === 'en' && /^[A-Za-z]/.test(trimmedLine);

      if (canHaveDropCap) {
        const firstLetter = trimmedLine[0];
        const remainingText = trimmedLine.substring(1);
        parsedBlocks.push(
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="text-slate-800 dark:text-slate-200 text-[17px] md:text-[18px] leading-[1.8] md:leading-[1.85] text-justify md:text-left font-sans transition-colors duration-250 hover:text-black dark:hover:text-white first-letter:font-bold my-5"
            key={`p-drop-${idx}-${i}`}
          >
            <span className="float-left text-5xl md:text-6xl font-black mr-3 text-transparent bg-clip-text bg-gradient-to-br from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] leading-none mt-1 font-sans select-none">
              {firstLetter}
            </span>
            <span className="font-medium text-slate-850 dark:text-slate-200">{parseInlineMarkup(remainingText)}</span>
          </motion.p>
        );
      } else {
        parsedBlocks.push(
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="text-slate-800 dark:text-slate-200 text-[17px] md:text-[18px] leading-[1.8] md:leading-[1.85] text-justify md:text-left font-sans transition-colors duration-250 hover:text-black dark:hover:text-white font-medium my-5"
            key={`p-std-${idx}-${i}`}
          >
            {parseInlineMarkup(trimmedLine)}
          </motion.p>
        );
      }
    }

    return <div className="space-y-2">{parsedBlocks}</div>;
  };

  return (
    <div className="space-y-8 relative pb-16">
      
      {/* Fixed Full-Width Reading Progress Bar at the very top (under the header) */}
      <div className="fixed top-16 left-0 w-full h-[4px] z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] via-[#7C3AED] to-[#EC4899] transition-all duration-150 ease-out shadow-[0_2px_12px_rgba(0,229,255,0.7)]" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Sticky Top Reading Progress Bar */}
      <div className="sticky top-[64px] left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-neutral-200/50 dark:border-slate-800/85 z-40 transition-all duration-300 shadow-xs mr-auto">
        {/* Subtle, hyper-smooth premium progress line inside the container */}
        <div className="w-full h-[4px] bg-neutral-100 dark:bg-slate-950">
          <div 
            className="h-full bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] via-[#7C3AED] to-[#EC4899] transition-all duration-150 ease-out" 
            style={{ width: `${readingProgress}%` }}
          />
        </div>
        
        {/* Sub-Header info section inside sticky area */}
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-neutral-550 dark:text-slate-450">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`px-2 py-0.5 rounded text-white text-[9px] font-black uppercase tracking-wider font-mono shrink-0 bg-gradient-to-r ${getCategoryGradient(post.category)}`}>
              {categoryText}
            </span>
            <span className="truncate text-neutral-800 dark:text-slate-200 text-[11px] font-sans md:max-w-md hidden sm:block font-bold">
              {titleText}
            </span>
            {activeSection && (
              <>
                <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0 hidden md:block" />
                <span className="text-violet-500 text-[11px] truncate md:max-w-xs shrink-0 font-bold hidden md:block uppercase font-mono">
                  {generatedOutline.find(o => o.id === activeSection)?.text || activeSection}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold text-neutral-550 dark:text-slate-405 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] font-black text-sm">
                {Math.round(readingProgress)}%
              </span> 
              <span>read</span>
            </span>
            <span className="h-3 w-px bg-neutral-200 dark:bg-slate-800 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-500" />
              <span>{post.readTime} left</span>
            </span>
          </div>
        </div>
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

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Sticky TOC and shares */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
          
          {/* Table of Contents Widget - Hostinger & Kinsta Inspired */}
          <div className="p-6 bg-[#FCFCFD] dark:bg-[#0D1527] rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED] dark:text-[#00E5FF] mb-4 flex items-center gap-1.5 border-b border-purple-100 dark:border-purple-950/40 pb-2.5 select-none animate-pulse">
              <Info className="w-4 h-4" />
              <span>Outline Guide</span>
            </h4>
            <div className="space-y-1">
              {generatedOutline.map((o) => {
                const isCurrent = activeSection === o.id;

                return (
                  <a
                    key={o.id}
                    href={`#${o.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(o.id);
                      if (target) {
                        const headerOffset = 110; // offset of sticky header & progress bar
                        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                        setActiveSection(o.id);
                      }
                    }}
                    style={{ paddingLeft: `${Math.max(0, (o.level - 2) * 12)}px` }}
                    className={`block py-1.5 pr-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border-l-2 leading-tight ${
                      isCurrent 
                        ? 'border-[#7C3AED] bg-purple-500/5 text-[#7C3AED] dark:bg-purple-950/20 dark:text-purple-400 font-extrabold shadow-2xs'
                        : 'border-transparent text-neutral-650 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <span className="truncate block">{o.text}</span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Center/Right colums: Article details and comments */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Main Reading Canvas */}
          <article ref={articleRef} className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.01)] relative overflow-hidden">
            
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
            <h1 className="text-2xl md:text-4xl font-black text-neutral-900 dark:text-white leading-tight tracking-tight mb-4 font-sans">
              {titleText}
            </h1>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-slate-950/70 border border-neutral-200/50 dark:border-slate-850/60 flex flex-wrap items-center justify-between gap-4 mb-8">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 dark:bg-purple-900/20 flex items-center justify-center text-[#7C3AED] dark:text-[#00E5FF] font-black text-sm">
                  {post.author ? post.author[0] : 'W'}
                </div>
                <div>
                  <h4 className="text-sm font-black text-neutral-800 dark:text-white leading-none">
                    {post.author || 'Senior Enterprise Architect'}
                  </h4>
                  <span className="text-[10px] text-neutral-500 dark:text-slate-400 font-mono font-semibold">
                    Revision: June 2026
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 dark:text-slate-450 font-semibold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  {post.views} Views
                </span>
                <button
                  onClick={() => onBookmarkToggle(post.id)}
                  id="header-action-bookmark-toggle"
                  className="flex items-center gap-1 hover:text-amber-500 cursor-pointer text-xs"
                >
                  <Bookmark className={`w-3.5 h-3.5 text-amber-500 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>

            </div>

            {/* Dynamic Rich Text rendering */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-slate-300 space-y-5 text-sm md:text-base leading-relaxed font-sans">
              
              {segments.map((seg, idx) => {
                const showOfferCard = post.id === 'whmcs-automation' && idx === 5;
                const showDomainOfferCard = post.id === 'domain-registration-services' && idx === 3;

                return (
                  <React.Fragment key={idx}>
                    {renderFormattedContent(seg, idx, showOfferCard, showDomainOfferCard)}
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
                <div className="my-6 aspect-video rounded-2xl overflow-hidden border border-neutral-200 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] bg-black relative group">
                  {isPlayingVideo ? (
                    <iframe
                      className="absolute inset-0 w-full h-full border-0"
                      src={`${getYouTubeEmbedUrl(post.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}?autoplay=1`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-3">
                      <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-slate-950/30 transition-colors z-0" />
                      <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover z-[-1]" />
                      
                      <button 
                        onClick={() => setIsPlayingVideo(true)}
                        id="media-play-btn"
                        className="w-14 h-14 bg-violet-600 hover:bg-violet-750 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all cursor-pointer relative z-10 select-none"
                      >
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </button>
                      <div className="relative z-10 text-white space-y-0.5">
                        <h5 className="font-bold text-sm">System Optimization Guide Layout</h5>
                        <p className="text-[10px] text-gray-300 font-mono">Duration: 14:20 mins • Cloud WebzoneBD Tutorial</p>
                      </div>
                    </div>
                  )}
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

            {/* Share Insights (Modern Premium Brand Buttons) */}
            <div className="mt-8 pt-6 border-t border-dashed border-neutral-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-violet-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-slate-300 font-mono">
                  {language === 'bn' ? 'আর্টিকেলটি বন্ধুদের সাথে শেয়ার করুন' : 'Spread the Knowledge'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                {language === 'bn' 
                  ? 'আপনার সামাজিক যোগাযোগ মাধ্যমে এই গুরুত্বপূর্ণ তথ্যটি শেয়ার করে অন্যদের জানতে সাহায্য করুন।'
                  : 'Help colleagues and friends level up by sharing this technical insight on your social platforms.'
                }
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {/* Twitter / X */}
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}&text=${encodeURIComponent(titleText)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter/X"
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#111] hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Twitter className="w-4 h-4 fill-white shrink-0" />
                  <span>X / Twitter</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href={`https://linkedin.com/shareArticle?url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}&title=${encodeURIComponent(titleText)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#0077B5] hover:bg-[#00669c] text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 fill-white shrink-0" />
                  <span>LinkedIn</span>
                </a>

                {/* WhatsApp */}
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(titleText + ' - ' + window.location.origin + '/blog/' + post.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white shrink-0" />
                  <span>WhatsApp</span>
                </a>

                {/* Facebook */}
                <a 
                  href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Facebook className="w-4 h-4 fill-white shrink-0" />
                  <span>Facebook</span>
                </a>
              </div>

              {/* Extras and copy link footer */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-neutral-100 dark:border-slate-850/50">
                <div className="flex gap-2">
                  <a 
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/blog/' + post.id)}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-[#0088cc] dark:hover:text-[#0088cc] transition-colors flex items-center gap-1 font-mono text-[10.5px]"
                  >
                    <TelegramIcon className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>
                </div>
                <button 
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg font-bold font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedLink 
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 animate-pulse' 
                      : 'bg-neutral-150 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Permanent URL'}</span>
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
            <div className="space-y-6 pt-10 border-t border-neutral-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C3AED] dark:text-[#00E5FF] font-mono block mb-1">
                  {language === 'bn' ? 'আরও পড়ুন' : language === 'ar' ? 'اقرأ المزيد' : 'Keep Reading'}
                </span>
                <h3 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight">
                  {language === 'bn' ? 'সম্পর্কিত অন্যান্য আর্টিকেল' : language === 'ar' ? 'مقالات ذات صلة' : 'Related Insights & Articles'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {relatedPosts.slice(0, 4).map((rp) => {
                  const rTitle = language === 'bn' ? rp.titleBn || rp.title : language === 'ar' ? rp.titleAr || rp.title : rp.title;
                  const rCategory = language === 'bn' ? rp.categoryBn || rp.category : language === 'ar' ? rp.categoryAr || rp.category : rp.category;
                  return (
                    <div 
                      key={rp.id}
                      onClick={() => onSelectRelated(rp)}
                      className="p-4 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-[#7C3AED] dark:hover:border-purple-500 hover:shadow-lg transition-all duration-300 flex gap-4 group"
                    >
                      <div className="w-24 h-20 sm:w-28 sm:h-22 bg-neutral-100 dark:bg-slate-950 rounded-xl overflow-hidden flex-none relative">
                        <img 
                          src={rp.image} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          referrerPolicy="no-referrer" 
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#7C3AED]/90 text-white text-[8px] uppercase font-bold tracking-wider rounded font-mono">
                          {rCategory}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-850 dark:text-white group-hover:text-[#7C3AED] dark:group-hover:text-purple-400 line-clamp-2 leading-snug transition-colors">
                          {rTitle}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-400 dark:text-slate-450 font-mono mt-1 pt-1 border-t border-neutral-100 dark:border-slate-800/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                            {rp.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {rp.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}



        </div>

      </div>

    </div>
  );
}
