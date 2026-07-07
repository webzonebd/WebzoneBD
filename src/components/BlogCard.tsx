import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Eye, Heart, Bookmark, Share2, ArrowRight, Check } from 'lucide-react';
import { LocalBlogPost } from './BlogData';
import { Language, Theme } from '../types';

interface BlogCardProps {
  post: LocalBlogPost;
  language: Language;
  theme: Theme;
  isBookmarked: boolean;
  onBookmarkToggle: (postId: string, e: React.MouseEvent) => void;
  onSelect: (post: LocalBlogPost) => void;
  onLikeToggle: (postId: string, e: React.MouseEvent) => void;
}

export default function BlogCard({
  post,
  language,
  theme,
  isBookmarked,
  onBookmarkToggle,
  onSelect,
  onLikeToggle
}: BlogCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const simulatedUrl = `${window.location.origin}/blog/${post.id}`;
    navigator.clipboard.writeText(simulatedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const titleText = language === 'bn' ? post.titleBn || post.title : language === 'ar' ? post.titleAr || post.title : post.title;
  const summaryText = language === 'bn' ? post.summaryBn || post.summary : language === 'ar' ? post.summaryAr || post.summary : post.summary;
  const categoryText = language === 'bn' ? post.categoryBn || post.category : language === 'ar' ? post.categoryAr || post.category : post.category;

  // Premium Category Gradients mapping
  const getCategoryGradient = (cat: string) => {
    const lowercase = cat.toLowerCase();
    if (lowercase.includes('dev') || lowercase.includes('laravel')) {
      return 'from-blue-600 to-cyan-500';
    } else if (lowercase.includes('host') || lowercase.includes('domain')) {
      return 'from-emerald-600 to-teal-400';
    } else if (lowercase.includes('seo') || lowercase.includes('marketing')) {
      return 'from-purple-600 to-pink-500';
    } else if (lowercase.includes('commerce') || lowercase.includes('pos')) {
      return 'from-amber-500 to-orange-600';
    }
    return 'from-indigo-600 to-violet-500';
  };

  const cardBackground = theme === 'dark' 
    ? 'bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-violet-500/30 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
    : 'bg-white/90 backdrop-blur-md border border-neutral-200/80 hover:border-violet-500/30 shadow-[0_4px_30px_rgba(0,0,0,0.05)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className={`group h-full flex flex-col rounded-3xl overflow-hidden pointer-events-auto transition-shadow hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] ${cardBackground}`}
    >
      {/* Visual Anchor Frame */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={titleText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Floating Badges (Highlights Only, Category moved below) */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
          {post.isFeatured && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold text-white rounded-full shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-1 animate-pulse">
              ⭐ Featured
            </span>
          )}
          {post.isTrending && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold text-white rounded-full shadow-md bg-gradient-to-r from-violet-600 to-pink-600 flex items-center gap-1">
              🔥 Trending
            </span>
          )}
          {post.isEditorsChoice && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold text-white rounded-full shadow-md bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center gap-1">
              🏆 Editor's Choice
            </span>
          )}
        </div>

        {/* Action Widgets */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          {/* Bookmark */}
          <motion.button
            onClick={(e) => onBookmarkToggle(post.id, e)}
            id={`bookmark-btn-${post.id}`}
            aria-label="Toggle Bookmark"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.8 }}
            animate={{
              scale: isBookmarked ? [1, 1.3, 0.9, 1.1, 1] : 1
            }}
            transition={{ duration: 0.45 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
              isBookmarked 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                : 'bg-slate-950/40 text-slate-200 hover:bg-slate-950/70 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Quick Share */}
          <button
            onClick={handleShare}
            id={`share-btn-${post.id}`}
            aria-label="Copy Link"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
              copied 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-slate-950/40 text-slate-200 hover:bg-slate-950/70 hover:text-white'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Card Content body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Tags strictly under image (Published date removed) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded bg-gradient-to-r ${getCategoryGradient(post.category)}`}>
              {categoryText}
            </span>
            {post.tags && post.tags.slice(0, 2).map((tg) => (
              <span key={tg} className="px-1.5 py-0.5 text-[9.5px] font-bold text-neutral-500 dark:text-slate-400 bg-neutral-100 dark:bg-slate-800 rounded">
                #{tg}
              </span>
            ))}
            <span className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-slate-400 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h3 
            onClick={() => onSelect(post)}
            className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-violet-500 transition-colors line-clamp-2 cursor-pointer pt-1"
          >
            {titleText}
          </h3>

          <p className="text-neutral-600 dark:text-slate-300 text-sm line-clamp-3 leading-relaxed">
            {summaryText}
          </p>
        </div>

        {/* Footer info row */}
        <div className="pt-6 mt-4 border-t border-neutral-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-xs">
              {post.author ? post.author.split(' ')[0][0] : 'W'}
            </div>
            <div className="max-w-[120px] truncate">
              <span className="text-xs font-semibold text-neutral-800 dark:text-slate-200 block truncate">
                {post.author || 'WebzoneBD'}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-slate-400 block font-mono">
                Author
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-mono text-neutral-500 dark:text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              {post.views}
            </span>

            {/* Like count active */}
            <motion.button
              onClick={(e) => onLikeToggle(post.id, e)}
              id={`like-btn-${post.id}`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.8 }}
              animate={{
                scale: post.likes > 248 ? [1, 1.3, 0.9, 1.1, 1] : 1
              }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-1 text-xs font-mono text-neutral-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-450 cursor-pointer active:scale-95 transition-all group/like"
            >
              <Heart className={`w-3.5 h-3.5 transition-colors group-hover/like:fill-rose-500 ${post.likes > 248 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{post.likes}</span>
            </motion.button>
          </div>
        </div>

        {/* CTA read block */}
        <div className="mt-4 pt-2">
          <button
            onClick={() => onSelect(post)}
            id={`read-cta-${post.id}`}
            className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-violet-50 hover:bg-violet-100 text-violet-600 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 hover:text-violet-500 dark:hover:text-violet-400 transition-all cursor-pointer relative overflow-hidden group/btn"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ টিউটোরিয়াল' : language === 'ar' ? 'اقرأ المقال بالكامل' : 'Enjoy Full Tutorial'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
