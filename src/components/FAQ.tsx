import { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { Language, Theme } from '../types';
import { sampleFAQs } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface FAQProps {
  language: Language;
  theme: Theme;
}

export default function FAQ({ language, theme }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const activeFaqList = sampleFAQs[language] || sampleFAQs['en'];

  const filteredFaqs = activeFaqList.filter(faq => {
    const term = searchQuery.toLowerCase();
    return faq.q.toLowerCase().includes(term) || faq.a.toLowerCase().includes(term);
  });

  const t = {
    en: {
      heading: "Frequently Asked Help Questions",
      subheading: "Find instant setup information regarding licenses, web hosting rules, and payment methods.",
      placeholder: "Search answer keywords...",
      noResults: "Can't find the answers you're looking for? Ping us on WhatsApp +966570511931."
    },
    bn: {
      heading: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)",
      subheading: "আমাদের থিম, স্ক্রিপ্ট ক্রয় এবং ব্যবহারের নিয়মাবলী সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্নগুলোর উত্তর জেনে নিন।",
      placeholder: "এখানে খুঁজুন...",
      noResults: "আপনার প্রশ্নের উত্তর খুঁজে পাচ্ছেন না? সরাসরি হোয়াটসঅ্যাপ করুন: +৯৬৬৫৭০৫M১৯৩১।"
    },
    ar: {
      heading: "الأسئلة والحلول التقنية الشائعة",
      subheading: "ابحث واحصل على إجابات فورية حول ترخيص السكربتات وسيرفرات الاستضافة المدارة.",
      placeholder: "ابحث بالأسئلة المطروحة...",
      noResults: "لم تعثر على الإجابة؟ يسعدنا مساعدتك الفورية عبر واتساب: +966570511931."
    }
  }[language];

  return (
    <section className="py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" id="agency-faq-index">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center justify-center gap-2">
          <HelpCircle className="w-7 h-7 text-emerald-500 animate-pulse" />
          <span>{t.heading}</span>
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
          {t.subheading}
        </p>
      </div>

      {/* Interactive FAQ Search */}
      <div className="bg-white dark:bg-neutral-950/40 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center mb-8 gap-2">
        <div className="flex-1 flex items-center pl-3">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-transparent border-0 outline-none text-xs font-medium px-2 py-2 text-neutral-950 dark:text-neutral-50"
          />
        </div>
      </div>

      {/* Accordions */}
      {filteredFaqs.length === 0 ? (
        <p className="text-center text-xs text-neutral-450 font-bold">{t.noResults}</p>
      ) : (
        <div className="space-y-3" id="faq-accordions-container">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-neutral-950/40 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-extrabold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition duration-150 text-xs sm:text-sm"
                >
                  <span className={language === 'ar' ? 'text-right' : 'text-left'}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 ml-2 mr-2"
                  >
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-emerald-500' : 'text-neutral-400'}`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-serif border-t border-neutral-100 dark:border-neutral-900/60">
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
    </section>
  );
}
