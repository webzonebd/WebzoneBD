import { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  Layers, 
  CreditCard, 
  Server, 
  Globe, 
  Code2, 
  MessageCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Language, Theme } from '../types';
import { sampleFAQs, FAQCategory, FAQItem } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface FAQProps {
  language: Language;
  theme: Theme;
}

type FilterCategory = 'all' | FAQCategory;

export default function FAQ({ language, theme }: FAQProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([0]);
  const [searchQuery, setSearchQuery] = useState('');

  const activeFaqList: FAQItem[] = sampleFAQs[language] || sampleFAQs['en'];

  // Categories configuration with localized titles & icons
  const categories: { id: FilterCategory; icon: typeof Layers; label: string; shortLabel: string; color: string }[] = useMemo(() => {
    switch (language) {
      case 'bn':
        return [
          { id: 'all', icon: Layers, label: 'সকল প্রশ্ন', shortLabel: 'সবগুলো', color: 'emerald' },
          { id: 'development', icon: Code2, label: 'ওয়েব ডেভেলপমেন্ট', shortLabel: 'ডেভেলপমেন্ট', color: 'indigo' },
          { id: 'hosting', icon: Server, label: 'হোস্টিং ও সার্ভার', shortLabel: 'হোস্টিং', color: 'sky' },
          { id: 'domains', icon: Globe, label: 'ডোমেইন সার্ভিস', shortLabel: 'ডোমেইন', color: 'violet' },
          { id: 'payments', icon: CreditCard, label: 'পেমেন্ট ও বিলিং', shortLabel: 'পেমেন্ট', color: 'emerald' }
        ];
      case 'ar':
        return [
          { id: 'all', icon: Layers, label: 'جميع الأسئلة', shortLabel: 'الكل', color: 'emerald' },
          { id: 'development', icon: Code2, label: 'تطوير البرمجيات', shortLabel: 'تطوير', color: 'indigo' },
          { id: 'hosting', icon: Server, label: 'الاستضافة والخوادم', shortLabel: 'استضافة', color: 'sky' },
          { id: 'domains', icon: Globe, label: 'حجز النطاقات', shortLabel: 'نطاقات', color: 'violet' },
          { id: 'payments', icon: CreditCard, label: 'الدفع والفواتير', shortLabel: 'المدفوعات', color: 'emerald' }
        ];
      case 'en':
      default:
        return [
          { id: 'all', icon: Layers, label: 'All Questions', shortLabel: 'All', color: 'emerald' },
          { id: 'development', icon: Code2, label: 'Development', shortLabel: 'Dev', color: 'indigo' },
          { id: 'hosting', icon: Server, label: 'Hosting & Cloud', shortLabel: 'Hosting', color: 'sky' },
          { id: 'domains', icon: Globe, label: 'Domains & DNS', shortLabel: 'Domains', color: 'violet' },
          { id: 'payments', icon: CreditCard, label: 'Payments & Billing', shortLabel: 'Payments', color: 'emerald' }
        ];
    }
  }, [language]);

  // Compute question counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      all: activeFaqList.length,
      development: 0,
      hosting: 0,
      domains: 0,
      payments: 0
    };
    activeFaqList.forEach(faq => {
      if (faq.category && counts[faq.category] !== undefined) {
        counts[faq.category] += 1;
      }
    });
    return counts;
  }, [activeFaqList]);

  // Filtered FAQ items by category and search query
  const filteredFaqs = useMemo(() => {
    return activeFaqList.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase().trim();
      return (
        faq.q.toLowerCase().includes(term) ||
        faq.a.toLowerCase().includes(term) ||
        faq.category.toLowerCase().includes(term)
      );
    });
  }, [activeFaqList, selectedCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleExpandAll = () => {
    if (openIndices.length === filteredFaqs.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(filteredFaqs.map((_, i) => i));
    }
  };

  const handleCategorySelect = (catId: FilterCategory) => {
    setSelectedCategory(catId);
    // Reset accordion to first item open when switching category
    setOpenIndices([0]);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setOpenIndices([0]);
  };

  // Translations
  const t = {
    en: {
      tag: "Knowledge Base & FAQs",
      heading: "Frequently Asked Help Questions",
      subheading: "Quick answers to common questions about our web development, NVMe cloud hosting, domain registration, and secure payment methods.",
      searchPlaceholder: selectedCategory === 'all' 
        ? "Search any keyword, e.g. 'SSL', 'bKash', 'React', 'cPanel'..." 
        : `Search questions inside ${categories.find(c => c.id === selectedCategory)?.label}...`,
      allTopics: "All Categories",
      filterByTopic: "Filter by Topic",
      showing: "Showing",
      of: "of",
      questions: "questions",
      expandAll: "Expand All",
      collapseAll: "Collapse All",
      noResults: "No questions found matching your filter or search query.",
      resetFilters: "Reset Filters",
      needMoreHelp: "Still have questions or need a custom solution?",
      chatWhatsApp: "Instant WhatsApp Chat",
      whatsappNumber: "+966 57 051 1931 / +880 1705 11931",
      avgResponse: "Average response within 10-15 minutes"
    },
    bn: {
      tag: "হেল্প সেন্টার ও সাধারণ প্রশ্নোত্তর",
      heading: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)",
      subheading: "আমাদের ওয়েবসাইট ডেভেলপমেন্ট, সুপারফাস্ট ক্লাউড হোস্টিং, বিটিসিএল ডোমেইন এবং বিকাশ/কার্ড পেমেন্ট সম্পর্কিত সকল প্রশ্নের দ্রুত উত্তর জেনে নিন।",
      searchPlaceholder: selectedCategory === 'all'
        ? "যেকোনো কীওয়ার্ড দিয়ে খুঁজুন, যেমন: 'হোস্টিং', 'বিকাশ', 'ডোমেইন', 'রিভিশন'..."
        : `${categories.find(c => c.id === selectedCategory)?.label}-এর মধ্যে খুঁজুন...`,
      allTopics: "সকল ক্যাটাগরি",
      filterByTopic: "ক্যাটাগরি অনুযায়ী ফিল্টার করুন",
      showing: "প্রদর্শিত হচ্ছে",
      of: "এর মধ্যে",
      questions: "টি প্রশ্ন",
      expandAll: "সবগুলো খুলুন",
      collapseAll: "সবগুলো বন্ধ করুন",
      noResults: "আপনার দেওয়া শব্দ বা ফিল্টারের সাথে মিলে এমন কোনো প্রশ্ন পাওয়া যায়নি।",
      resetFilters: "ফিল্টার রিসেট করুন",
      needMoreHelp: "আরও কিছু জানতে চান বা স্পেশালাইজড পরামর্শ প্রয়োজন?",
      chatWhatsApp: "হোয়াটসঅ্যাপে সরাসরি কথা বলুন",
      whatsappNumber: "+৯৬৬ ৫৭ ০৫১ ১৯৩১ / ০১৭০৫১১৯৩১",
      avgResponse: "গড় রেসপন্স টাইম ১০ থেকে ১৫ মিনিট"
    },
    ar: {
      tag: "قاعدة المعرفة والأسئلة الشائعة",
      heading: "الأسئلة والحلول التقنية الشائعة",
      subheading: "إجابات فورية وشاملة حول خدمات تطوير المواقع، استضافة NVMe السحابية فائقة السرعة، تسجيل النطاقات، وبوابات الدفع الإلكترونية.",
      searchPlaceholder: selectedCategory === 'all'
        ? "ابحث بكلمات مفتاحية مثل: 'SSL', 'الاستضافة', 'الدفع', 'ووردبريس'..."
        : `ابحث داخل أسئلة ${categories.find(c => c.id === selectedCategory)?.label}...`,
      allTopics: "جميع الأقسام",
      filterByTopic: "تصفية حسب الموضوع",
      showing: "يتم عرض",
      of: "من إجمالي",
      questions: "سؤال",
      expandAll: "فتح الكل",
      collapseAll: "إغلاق الكل",
      noResults: "لم يتم العثور على أي أسئلة مطابقة للبحث أو القسم المحدد.",
      resetFilters: "إعادة ضبط التصفية",
      needMoreHelp: "هل لديك استفسار إضافي أو تحتاج إلى استشارة تقنية مخصصة؟",
      chatWhatsApp: "محادثة فورية عبر واتساب",
      whatsappNumber: "+966 57 051 1931",
      avgResponse: "متوسط سرعة الرد من 10 إلى 15 دقيقة"
    }
  }[language];

  // Helper to get category badge color styling
  const getCategoryBadgeClass = (category: FAQCategory) => {
    switch (category) {
      case 'development':
        return 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/70 dark:border-indigo-800/60';
      case 'hosting':
        return 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/60';
      case 'domains':
        return 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200/70 dark:border-violet-800/60';
      case 'payments':
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60';
    }
  };

  const getCategoryLabel = (category: FAQCategory) => {
    const found = categories.find(c => c.id === category);
    return found ? found.shortLabel : category;
  };

  const isRtl = language === 'ar';

  return (
    <section 
      className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" 
      id="agency-faq-index"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header Section */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.tag}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center justify-center gap-2.5">
          <HelpCircle className="w-8 h-8 text-emerald-500 shrink-0" />
          <span>{t.heading}</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {t.subheading}
        </p>
      </div>

      {/* Categorized Filter Buttons */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            {t.filterByTopic}
          </span>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            {t.showing} <span className="font-bold text-emerald-700 dark:text-emerald-400">{filteredFaqs.length}</span> {t.of} {activeFaqList.length} {t.questions}
          </span>
        </div>

        <div 
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap"
          id="faq-category-filters"
          role="tablist"
          aria-label="FAQ Category Filters"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            const count = categoryCounts[category.id];

            return (
              <button
                key={category.id}
                id={`faq-filter-btn-${category.id}`}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleCategorySelect(category.id)}
                className={`group shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 min-h-[44px] cursor-pointer border ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md shadow-neutral-900/10 dark:bg-emerald-500 dark:text-neutral-950 dark:border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 border-neutral-200/90 dark:bg-neutral-900/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 dark:border-neutral-800'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                  isSelected 
                    ? 'text-emerald-400 dark:text-neutral-950' 
                    : 'text-neutral-500 dark:text-neutral-400 group-hover:text-emerald-500'
                }`} />
                <span>{category.label}</span>
                <span 
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-tight transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-neutral-950/25 dark:text-neutral-950'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive FAQ Search Bar */}
      <div className="bg-white dark:bg-neutral-900/90 p-2 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 shadow-xs flex items-center mb-6 gap-2 transition-focus focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/60">
        <div className="flex-1 flex items-center px-2">
          <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
          <input
            id="faq-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium px-2.5 py-1.5 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button
              id="faq-clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar: Category stats & Expand/Collapse Toggle */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            {categories.find(c => c.id === selectedCategory)?.label}
          </span>
          {searchQuery && (
            <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>

        {filteredFaqs.length > 0 && (
          <button
            id="faq-expand-all-btn"
            onClick={handleExpandAll}
            className="inline-flex items-center gap-1 font-semibold text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer py-1 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            {openIndices.length === filteredFaqs.length ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{t.collapseAll}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>{t.expandAll}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Accordions List */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-neutral-900/50 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <HelpCircle className="w-10 h-10 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            {t.noResults}
          </p>
          <button
            id="faq-reset-filters-btn"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3" id="faq-accordions-container">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            const badgeClass = getCategoryBadgeClass(faq.category);
            const categoryLabel = getCategoryLabel(faq.category);

            return (
              <div 
                key={`${faq.category}-${idx}`}
                id={`faq-item-${idx}`}
                className={`bg-white dark:bg-neutral-900/60 rounded-2xl border transition duration-150 overflow-hidden shadow-xs ${
                  isOpen 
                    ? 'border-emerald-400/80 dark:border-emerald-500/50 ring-1 ring-emerald-500/20 dark:ring-emerald-500/20' 
                    : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <button
                  id={`faq-question-btn-${idx}`}
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition duration-150 text-xs sm:text-sm gap-3 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border ${badgeClass}`}>
                      {categoryLabel}
                    </span>
                    <span className={`leading-snug text-neutral-900 dark:text-neutral-100 font-extrabold ${isRtl ? 'text-right' : 'text-left'}`}>
                      {faq.q}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronRight className={`w-4 h-4 transition-colors ${isOpen ? 'text-emerald-500' : 'text-neutral-400'}`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-panel-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/80 font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct Contact & Support Helper Box */}
      <div 
        className="mt-10 p-5 sm:p-6 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-neutral-900/90 dark:to-neutral-900/60 rounded-3xl border border-emerald-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        id="faq-help-support-card"
      >
        <div className="text-center sm:text-left space-y-1">
          <p className="text-sm font-extrabold text-neutral-900 dark:text-white">
            {t.needMoreHelp}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {t.whatsappNumber} &bull; <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.avgResponse}</span>
          </p>
        </div>

        <a
          id="faq-whatsapp-support-link"
          href="https://wa.me/966570511931?text=Hello%20WebzoneBD%20Support,%20I%20have%20a%20question%20regarding%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all duration-150 min-h-[44px] cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t.chatWhatsApp}</span>
        </a>
      </div>
    </section>
  );
}

