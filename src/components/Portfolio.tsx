import React, { useState, useMemo, useEffect } from 'react';
import { 
  ExternalLink, 
  Calendar, 
  User, 
  Search, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  ArrowUpRight, 
  Zap, 
  Globe, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck, 
  Send, 
  Smile,
  Layers,
  Heart,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioItem, Language, Theme } from '../types';
import { samplePortfolio } from '../data';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import PortfolioTeamProfiles from './PortfolioTeamProfiles';

interface PortfolioProps {
  language: Language;
  theme: Theme;
}

export default function Portfolio({ language, theme }: PortfolioProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('wz_cms_portfolio');
    return saved ? JSON.parse(saved) : samplePortfolio;
  });

  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'title' | 'category'>('featured');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video'>('image');

  // Real-time Firestore sync for dynamic client updates
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'cms_sync', 'portfolio'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          setPortfolioItems(data.items);
          localStorage.setItem('wz_cms_portfolio', JSON.stringify(data.items));
        }
      }
    }, (error) => {
      console.info("Firestore portfolio listener standing by for offline/sandbox mode.");
    });
    return () => unsub();
  }, []);

  // Sync effect to reset activeMediaTab when a project is selected
  useEffect(() => {
    if (selectedProject) {
      setActiveMediaTab('image');
    }
  }, [selectedProject]);

  // Quote Modal states
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'web',
    brief: '',
    budget: 'medium'
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Auto scroll link anchor helper
  useEffect(() => {
    // Check local storage for quick category deep link redirection
    const handleCheckRedirection = () => {
      const savedCategory = localStorage.getItem('webzone_target_portfolio_category');
      if (savedCategory) {
        setFilter(savedCategory);
        localStorage.removeItem('webzone_target_portfolio_category');
        setTimeout(() => {
          const el = document.getElementById('bento-grid-catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    };
    handleCheckRedirection();
    window.addEventListener('storage', handleCheckRedirection);
    return () => window.removeEventListener('storage', handleCheckRedirection);
  }, []);

  const categories = [
    { id: 'all', en: "All Projects", bn: "সকল প্রজেক্ট", ar: "جميع المشاريع", icon: "💎" },
    { id: 'web', en: "Web Development", bn: "ওয়েব ডেভেলপমেন্ট", ar: "تطوير الويب", icon: "🌐" },
    { id: 'marketing', en: "Digital Marketing", bn: "ডিজিটাল মার্কেটিং", ar: "التسويق الرقمي", icon: "📢" },
    { id: 'graphic', en: "Graphic Design", bn: "গ্রাফিক ডিজাইন", ar: "تصميم الجرافيك", icon: "🖌️" },
    { id: 'news', en: "News Portal", bn: "নিউজ পোর্টাল", ar: "بوابة الأخبار", icon: "📰" },
    { id: 'blog', en: "Blogging Website", bn: "ব্লগিং সাইট", ar: "موقع مدونة", icon: "✍️" },
    { id: 'ecommerce', en: "E-Commerce Website", bn: "ই-কমার্স ওয়েবসাইট", ar: "التجارة الإلكترونية", icon: "🛒" },
    { id: 'portfolio', en: "Customer Portfolio", bn: "কাস্টমার পোর্টফোলিও", ar: "معرض أعمال العملاء", icon: "💼" },
    { id: 'seoAds', en: "SEO & Google Ads", bn: "এসইও ও গুগল এডস", ar: "سيو وإعلانات جوجل", icon: "🚀" },
    { id: 'solutions', en: "ERP & POS Systems", bn: "সফটওয়্যার ও পস সিস্টেম", ar: "حلول البرمجيات وأنظمة الحسابات", icon: "📊" }
  ];

  // Detailed Static Tech List for Visual representation
  const techStackIcons = [
    { name: "Laravel", icon: "⚙️", bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200 dark:border-red-900/30", text: "text-red-600 dark:text-red-400" },
    { name: "PHP", icon: "🐘", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
    { name: "HTML & CSS", icon: "🎨", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
    { name: "WordPress", icon: "📝", bg: "bg-cyan-50 dark:bg-cyan-950/20", border: "border-cyan-200 dark:border-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" },
    { name: "WooCommerce", icon: "🛍️", bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
    { name: "React", icon: "⚛️", bg: "bg-sky-50 dark:bg-sky-950/20", border: "border-sky-200 dark:border-sky-900/30", text: "text-sky-600 dark:text-sky-400" },
    { name: "Next.js", icon: "▲", bg: "bg-neutral-50 dark:bg-neutral-900/30", border: "border-neutral-200 dark:border-neutral-800", text: "text-black dark:text-white" },
    { name: "MySQL", icon: "🛢️", bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
    { name: "Cloud Hosting", icon: "☁️", bg: "bg-indigo-50 dark:bg-indigo-950/20", border: "border-indigo-200 dark:border-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
    { name: "Google Ads", icon: "📈", bg: "bg-yellow-50 dark:bg-yellow-950/20", border: "border-yellow-200 dark:border-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
    { name: "Meta Ads", icon: "🎯", bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
    { name: "SEO Optimization", icon: "🔍", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" }
  ];

  // Specific Project-Based localized testimonials
  const localizedTestimonials = {
    en: [
      { name: "Nayeem Islam", company: "Prime Group BD Ltd.", feedback: "WebzoneBD built our enterprise identity in less than three weeks. Speed is immaculate and our conversion rates increased by 150%. Their attention to lightweight rendering layouts is outstanding.", rating: 5, role: "Chief Information Officer" },
      { name: "A. Rahman Chowdhury", company: "ProthomBarta Media", feedback: "Ad zones load perfectly and page layout is extremely intuitive to scroll. We are managing millions of monthly hits safely on high-priority cloud hosting setups provided by WebzoneBD.", rating: 5, role: "Managing Editor" },
      { name: "Syed Al-Masood", company: "Abaabil Super Shop", feedback: "The offline capability of Webzone POS Pro saves us during occasional power outages. Transactions compile in 1.2s and local invoices print immediately over bluetooth.", rating: 5, role: "Technology Director" }
    ],
    bn: [
      { name: "নাঈম ইসলাম", company: "প্রাইম গ্রুপ বিডি লিমিটেড", feedback: "ওয়েবজোনবিডি তিন সপ্তাহেরও কম সময়ে আমাদের কর্পোরেট পোর্টাল ডেভেলপ করেছে। পেজ স্পিড এককথায় অসাধারণ এবং কাস্টমার ইনকোয়ারি প্রায় ১৫০% বৃদ্ধি পেয়েছে। চমৎকার টিম ওয়ার্ক!", rating: 5, role: "চীফ ইনফরমেশন অফিসার" },
      { name: "এ. রহমান চৌধুরী", company: "প্রথমবার্তা মিডিয়া লিমিটেড", feedback: "আমাদের প্রথমবার্তা নিউজ পোর্টালের অ্যাড জোন এবং স্পোর্টস মডিউল সহজে নিয়ন্ত্রন করা যায়। দৈনিক লাখ লাখ পাঠক সাইটে কোনো ল্যাগ বা ডাউনটাইম ছাড়াই খবর পড়তেছেন।", rating: 5, role: "ব্যবস্থাপনা সম্পাদক" },
      { name: "সৈয়দ আল-মাসুদ", company: "আবাবিল সুপার শপ নেটওয়ার্ক", feedback: "ওয়েবজোন পস প্রো-এর অফলাইন ব্যাকআপ ফিচারটি আমাদের দারুণ সাহায্য করে। ইন্টারনেট কানেকশন চলে গেলেও নিরবচ্ছিন্ন ক্যাশআউট করা যায় এবং বিল সাথে সাথে প্রিন্ট হয়।", rating: 5, role: "প্রযুক্তি পরিচালক" }
    ],
    ar: [
      { name: "نعيم إسلام", company: "مجموعة برايم جروب ليمتد", feedback: "قامت ويب زون بي دي ببناء واجهتنا المؤسسية في أقل من ثلاثة أسابيع. سرعة تصفح مذهلة وتضاعف استفسارات العملاء بنسبة 150%. الدعم الفني لديهم متميز حقاً.", rating: 5, role: "رئيس قسم المعلوماتية" },
      { name: "أ. الرحمن شودري", company: "صحيفة بروثوم بارتا المحلية", feedback: "تعمل مساحات إعلانات جوجل ونظام النشرات اليومية بسلاسة متناهية. نخدم ملايين الزيارات بأمان كامل عبر خوادم مخصصة قوية من مهندسي ويب زون بي دي.", rating: 5, role: "رئيس التحرير التنفيذي" },
      { name: "سيد المسعود", company: "شبكة مخازن أبابيل التجارية", feedback: "ساعدتنا ميزة العمل بلا شبكة في برنامج نقاط البيع الذكي كثيراً أثناء لقطات انقطاع الكهرباء والشبكة الكهربية المؤقتة. تصدر الفاتورة المعتمدة في تكة واحدة.", rating: 5, role: "المدير التقني والتكنولوجي" }
    ]
  }[language];

  // Filter, Search & Sort Logic
  const filteredItems = useMemo(() => {
    let result = portfolioItems.filter(item => {
      // Category filter check
      const matchesCategory = filter === 'all' || item.category === filter;
      
      // Text search query check
      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return matchesCategory;

      const titleMatches = item.title.toLowerCase().includes(searchLower) ||
                           item.titleBn.toLowerCase().includes(searchLower) ||
                           item.titleAr.toLowerCase().includes(searchLower);

      const clientMatches = item.client.toLowerCase().includes(searchLower);
      const categoryMatches = item.categoryLabel.toLowerCase().includes(searchLower) ||
                              item.categoryLabelBn.includes(searchLower);

      const techMatches = item.techStack?.some(tech => tech.toLowerCase().includes(searchLower)) || false;

      return matchesCategory && (titleMatches || clientMatches || categoryMatches || techMatches);
    });

    if (sortBy === 'title') {
      result = [...result].sort((a, b) => {
        const titleA = language === 'bn' ? a.titleBn : language === 'ar' ? a.titleAr : a.title;
        const titleB = language === 'bn' ? b.titleBn : language === 'ar' ? b.titleAr : b.title;
        return titleA.localeCompare(titleB);
      });
    } else if (sortBy === 'category') {
      result = [...result].sort((a, b) => {
        const catA = language === 'bn' ? a.categoryLabelBn : language === 'ar' ? a.categoryLabelAr : a.categoryLabel;
        const catB = language === 'bn' ? b.categoryLabelBn : language === 'ar' ? b.categoryLabelAr : b.categoryLabel;
        return catA.localeCompare(catB);
      });
    }

    return result;
  }, [portfolioItems, filter, searchQuery, sortBy, language]);

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  // Dictionary translations for robust UI
  const t = {
    en: {
      heroTitle: "Our Portfolio & Success Stories",
      heroSubtitle: "Explore our completed projects, digital solutions, websites, software systems, and marketing campaigns delivered for clients worldwide.",
      btnViewProjects: "View Projects",
      btnRequestQuotation: "Request Quotation",
      btnStart: "Start Your Project",
      statsCompleted: "Projects Completed",
      statsClients: "Happy Clients",
      statsCountries: "Countries Served",
      statsExperience: "Years Experience",
      searchPlaceholder: "Search projects by name, technology, or client...",
      gridTitle: "Our Strategic Client Deployments",
      gridSub: "Filter & search through real-world applications built to absolute perfection.",
      client: "Client / Brand",
      timeline: "Build Period",
      features: "Key Deliverables",
      techBannerTitle: "Technologies We Leverage",
      liveDemo: "Live Preview",
      caseStudy: "Case Details",
      closeBtn: "Close Details",
      successStoriesHeader: "Client Success Stories",
      successStoriesSub: "See what major companies say after integrating WebzoneBD digital platforms.",
      ctaTitle: "Ready To Build Your Next Project?",
      ctaSub: "Let WebzoneBD IT Solution help transform your business with modern technology solutions.",
      ctaConsultation: "Request Free Consultation",
      ctaStart: "Start Project",
      ctaWhatsapp: "WhatsApp Support",
      resultsTitle: "Campaign Success Metrics",
      noResults: "No matching deployments found. Try adjusting your filter tags or search queries.",
      formName: "Your Full Name",
      formEmail: "Email Address",
      formPhone: "WhatsApp / Contact Phone",
      formBrief: "Project Objectives / Features Needed",
      formCategory: "Project Category",
      formBudget: "Planned Budget",
      budgetOption1: "Basic Starter Package (< ৳20,000 / $250)",
      budgetOption2: "Professional Growth Package (৳20k-৳50k / $250-$600)",
      budgetOption3: "Enterprise Custom Software (৳50,000+ / $600+)",
      formSubmit: "Generate My Quotation",
      formSuccessTitle: "Quotation Generated In System!",
      formSuccessDesc: "Assalamu Alaikum! Our sales team is compiling pricing modules for you. We will call you within 2 hour periods."
    },
    bn: {
      heroTitle: "আমাদের পোর্টফোলিও এবং আর্কিটেকচার কেস স্টাডিজ",
      heroSubtitle: "বিশ্বজুড়ে গ্রাহকদের জন্য আমাদের সফলভাবে সম্পন্নকৃত প্রকল্প, ডিজিটাল সেবা, উচ্চ গতির ওয়েবসাইট এবং আধুনিক পস ও ই-কমার্স সফটওয়্যার গ্যালারি এক্সপ্লোর করুন।",
      btnViewProjects: "প্রকল্পগুলো দেখুন",
      btnRequestQuotation: "অনলাইন কোটেশন পাঠান",
      btnStart: "প্রজেক্ট আজই শুরু করুন",
      statsCompleted: "সম্পন্নকৃত প্রজেক্ট",
      statsClients: "সন্তুষ্ট গ্রাহক",
      statsCountries: "সেবা প্রদানকৃত দেশ",
      statsExperience: "উদ্যোক্তা অভিজ্ঞতা",
      searchPlaceholder: "প্রজেক্টের নাম, টেকনোলজি বা ক্লায়েন্ট সার্চ করুন...",
      gridTitle: "আমাদের সফল ক্লায়েন্ট প্ল্যাটফর্ম সমূহ",
      gridSub: "নিয়মিত কাস্টম সলিউশন ফিল্টার ও সার্চ স্ক্রিন অনুসন্ধান করুন নিখুঁতভাবে।",
      client: "অংশীদার ব্র্যান্ড",
      timeline: "নির্মাণ সময়কাল",
      features: "বিশেষ সুবিধাসমূহ",
      techBannerTitle: "আমরা যে প্রযুক্তিসমূহ ব্যবহার করি",
      liveDemo: "লাইভ প্রিভিউ",
      caseStudy: "বিস্তারিত কেস স্টাডি",
      closeBtn: "সব বন্ধ করুন",
      successStoriesHeader: "গ্রাহকদের সাফল্যের গল্প",
      successStoriesSub: "ওয়েবজোনবিডি পোর্টাল এবং কাস্টম সিস্টেম চালুর পর ক্লায়েন্টদের প্রতিক্রিয়া দেখুন।",
      ctaTitle: "আপনার পরবর্তী প্রজেক্টের জন্য প্রস্তুত?",
      ctaSub: "ইনটেলিজেন্ট আধুনিক প্রযুক্তি সলিউশন দিয়ে আপনার ব্যবসা রূপান্তরে আজই সাহায্য নিতে পারেন ওয়েবজোনবিডি-র কাছে।",
      ctaConsultation: "ফ্রি টিম কন্সাল্টেশন",
      ctaStart: "প্রজেক্ট শুরু করুন",
      ctaWhatsapp: "হোয়াটসঅ্যাপ সাপোর্ট",
      resultsTitle: "ক্যাম্পেইন বা প্রজেক্টের ফলাফল",
      noResults: "আপনার অনুসন্ধানের সাথে মিলে যাওয়া কোনো প্রজেক্ট পাওয়া যায়নি। অনুগ্রহ করে অন্যভাবে সার্চ করুন।",
      formName: "আপনার পুরো নাম",
      formEmail: "ইমেইল এড্রেস",
      formPhone: "হোয়াটসঅ্যাপ / কন্টাক্ট নাম্বার",
      formBrief: "প্রকল্পের সংক্ষিপ্ত বিবরণী / প্রয়োজনীয় রিকোয়ারমেন্ট",
      formCategory: "প্রকল্পের ক্যাটাগরি",
      formBudget: "পরিকল্পিত বাজেট",
      budgetOption1: "মিনি বেসিক প্যাকেজ (< ২০,০০০ টাকা)",
      budgetOption2: "প্রফেশনাল স্ট্যান্ডার্ড প্যাকেজ (২০,০০০ - ৫০,০০০ টাকা)",
      budgetOption3: "এন্টারপ্রাইজ কাস্টম সফটওয়্যার (৫০,০০০+ টাকা / আনলিমিটেড)",
      formSubmit: "কোটেশন রিকোয়েস্ট সাবমিট করুন",
      formSuccessTitle: "কোটেশনের রিকোয়েস্ট সফলভাবে সিস্টেমে যুক্ত হয়েছে!",
      formSuccessDesc: "আসসালামু আলাইকুম! আমাদের টিম আপনার বিবরণী বিশ্লেষণ করছে। পরবর্তী ২ ঘণ্টার মধ্যে সরাসরি ফোন কলের মাধ্যমে আপনার অফার চূড়ান্ত করা হবে।"
    },
    ar: {
      heroTitle: "معرض أعمالنا وقصص نجاح الشركاء",
      heroSubtitle: "استكشف مشاريعنا المنجزة، والحلول الرقمية، ومواقع الويب فائقة السرعة، والأنظمة البرمجية المتكاملة لعملائنا في جميع أنحاء العالم.",
      btnViewProjects: "تصفح المشاريع المكتملة",
      btnRequestQuotation: "طلب تسعيرة دقيقة",
      btnStart: "ابدأ مشروعك الآن",
      statsCompleted: "مشاريع مكتملة وموزعة",
      statsClients: "عملاء سعداء تماماً",
      statsCountries: "دول تم خدمتها",
      statsExperience: "سنوات من التقنية",
      searchPlaceholder: "ابحث في المشاريع بحسب الاسم، التكنولوجيا أو اسم الشريك...",
      gridTitle: "البوابات والأنظمة المفعلة للعملاء",
      gridSub: "ابحث وتصفح عبر تطبيقات حقيقية تعمل بدقة متناهية تحت الضغط والإنتاج.",
      client: "الجهة المتعاقدة",
      timeline: "فترة البناء والبرمجة",
      features: "المخرجات والمزايا الرئيسية",
      techBannerTitle: "ترسانتنا من اللغات والتقنيات البرمجية",
      liveDemo: "معاينة حية ومباشرة",
      caseStudy: "تفاصيل دراسة الحالة",
      closeBtn: "إغلاق التفاصيل",
      successStoriesHeader: "قصص تفوق ونجاح عملائنا الكرام",
      successStoriesSub: "شاهد انطباع ومراجعات كبرى المؤسسات بعد تشغيل منصات ويب زون بي دي السحابية.",
      ctaTitle: "هل تريد بناء فكرتك أو مشروعك القادم؟",
      ctaSub: "دع فريق ويب زون بي دي للحلول البرمجية المتطورة ينقل نشاطك التجاري لآفاق جديدة من السرعة والأتمتة التامة.",
      ctaConsultation: "طلب استشارة مجانية هاتفية",
      ctaStart: "البدء الفوري بالمشروع",
      ctaWhatsapp: "دعم الواتساب الفوري",
      resultsTitle: "مؤشرات النجاح والأرقام المحققة",
      noResults: "لم يتم العثور على نتائج مطابقة لعملية البحث. يرجى تعديل معايير البحث والفرز.",
      formName: "اسمك الكريم الكامل",
      formEmail: "بريدك الإلكتروني",
      formPhone: "الواتساب أو رقم الجوال للإتصال",
      formBrief: "أهداف المشروع والخصائص المطلوبة",
      formCategory: "نوع وباب التقنية المعني",
      formBudget: "الميزانية المتاحة للمشروع",
      budgetOption1: "الحزمة الأساسية (< 20,000 ৳ / 250$)",
      budgetOption2: "حزمة النمو والتحول السريع (20k-50k ৳ / 250$-600$)",
      budgetOption3: "حل برمجيات مخصص للشركات (50,000+ ৳ / 600$+)",
      formSubmit: "إرسال وتجهيز مقترحي الفني",
      formSuccessTitle: "تم استيعاب طلب التسعيرة في بوابتنا بنجاح!",
      formSuccessDesc: "وعليكم السلام! يقوم فريقنا المالي والفني بإعداد التسعورة المثالية المناسبة لمجال عملكم، وسنتصل بكم عبر الجوال خلال ساعتين فقط لتزويدكم بالتفاصيل."
    }
  }[language];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone) return;
    setQuoteSubmitted(true);
    setTimeout(() => {
      // Clear form states and close modal safely after temporary visual success
      setQuoteForm({ name: '', phone: '', email: '', category: 'web', brief: '', budget: 'medium' });
      setQuoteSubmitted(false);
      setIsQuoteModalOpen(false);
    }, 4500);
  };

  const handleConsultText = () => {
    const defaultText = `Assalamu Alaikum WebzoneBD! I am visiting your dynamic showcase page and would like to schedule a free technology consultation checklist regarding starting a new custom ${filter !== 'all' ? filter : 'IT'} project.`;
    window.open(`https://wa.me/966570511931?text=${encodeURIComponent(defaultText)}`, '_blank');
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#F8FAFC] min-h-screen transition-colors duration-200">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200/50 dark:border-neutral-900 bg-linear-to-b from-blue-50/20 via-transparent to-transparent dark:from-sky-950/10">
        
        {/* Floating gradient circles mimicking luxury high-tech elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-tr from-blue-400/20 to-cyan-400/15 rounded-full filter blur-[100px] pointer-events-none opacity-80" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-violet-400/15 to-pink-400/10 rounded-full filter blur-[120px] pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/40 dark:border-blue-900/40 text-xs font-black uppercase tracking-wider animate-pulse mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Stories Live Portfolio</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight max-w-4xl mx-auto">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                const el = document.getElementById('bento-grid-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/15 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
            >
              <span>{t.btnViewProjects}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 border border-neutral-200 dark:border-neutral-850 hover:border-blue-600 font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 text-cyan-500" />
              <span>{t.btnRequestQuotation}</span>
            </button>

            <button
              onClick={handleConsultText}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-md shadow-emerald-500/10 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{t.btnStart}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ================= PORTFOLIO STATISTICS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard-counters">
          
          {[
            { metric: "100+", title: t.statsCompleted, color: "text-blue-500 dark:text-cyan-400", sub: "Web, POS & Apps" },
            { metric: "50+", title: t.statsClients, color: "text-violet-500 dark:text-pink-400", sub: "Global Brands & Shops" },
            { metric: "10+", title: t.statsCountries, color: "text-emerald-500 dark:text-teal-400", sub: "Worldwide Deployments" },
            { metric: "5+", title: t.statsExperience, color: "text-amber-500 dark:text-orange-400", sub: "Senior Engineering Staff" }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="p-5 sm:p-6 bg-white dark:bg-[#0F172A] border border-neutral-200/70 dark:border-neutral-850 rounded-2xl shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all duration-150 text-center space-y-1.5"
            >
              <div className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${stat.color} font-mono`}>
                {stat.metric}
              </div>
              <h3 className="text-[11px] sm:text-xs font-bold text-neutral-800 dark:text-neutral-200">
                {stat.title}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                {stat.sub}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= PORTFOLIO CATEGORIES & LIVE SEARCH ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6" id="bento-grid-catalog">
        
        {/* Strategic Deployments Header Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border border-blue-200/60 dark:border-blue-800/40 mb-8 backdrop-blur-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            
            <div className="space-y-2 text-left max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                  <Layers className="w-3 h-3" />
                  <span>Strategic Deployments</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>99.99% Live Production Uptime</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                {t.gridTitle}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium">
                {t.gridSub}
              </p>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              {/* Search input bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-white dark:bg-slate-900 text-neutral-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 shadow-xs transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white rounded-full"
                    title="Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort options dropdown */}
              <div className="relative w-full sm:w-auto shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors shadow-xs"
                >
                  <option value="featured">✨ {language === 'bn' ? 'ফিচার্ড প্রজেক্ট' : language === 'ar' ? 'المشاريع المميزة' : 'Sort: Featured'}</option>
                  <option value="title">🔤 {language === 'bn' ? 'নাম অনুযায়ী (A-Z)' : language === 'ar' ? 'أبجدياً (A-Z)' : 'Sort: Name (A-Z)'}</option>
                  <option value="category">📂 {language === 'bn' ? 'ক্যাটাগরি অনুযায়ী' : language === 'ar' ? 'حسب الفئة' : 'Sort: Category'}</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex overflow-x-auto pb-3 gap-2 justify-start scrollbar-hidden">
          {categories.map((cat) => {
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-2xs ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-[#0F172A] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{language === 'bn' ? cat.bn : language === 'ar' ? cat.ar : cat.en}</span>
              </button>
            );
          })}
        </div>

      </section>

      {/* ================= MAIN CASES AND PROJECT GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white dark:bg-[#0F172A]/40 rounded-3xl border border-neutral-200/50 dark:border-neutral-850">
            <Smile className="w-10 h-10 text-neutral-400 mx-auto opacity-70 mb-3 animate-bounce" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto font-medium">
              {t.noResults}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 text-xs font-bold font-mono text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5" 
            id="interactive-grid-portfolio-posts"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
                const hasVideo = !!item.videoUrl;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    key={item.id}
                    className="bg-white dark:bg-[#0F172A] border border-neutral-200/60 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Visual Banner Media */}
                    <div 
                      title={language === 'bn' ? 'বিস্তারিত দেখতে এখানে ক্লিক করুন' : language === 'ar' ? 'اضغط لعرض التفاصيل الكاملة' : 'Click to view complete case details'}
                      onClick={() => setSelectedProject(item)}
                      className="group/img relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-150 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-850 cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />

                      {/* Touch & Hover Zoom Banner Overlay */}
                      <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        {hasVideo ? (
                          <div className="p-3.5 rounded-full bg-linear-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-xl transform scale-75 group-hover/img:scale-100 transition-all duration-300 animate-pulse">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        ) : (
                          <div className="px-3.5 py-1.5 rounded-full bg-neutral-950/85 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-white/20 shadow-xl transform scale-90 group-hover/img:scale-100 transition-all duration-300">
                            <Search className="w-3 h-3 text-purple-400" />
                            <span>{language === 'bn' ? 'কেস স্টাডি' : language === 'ar' ? 'عرض تفاصيل' : 'Case Study'}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Video badge */}
                      {hasVideo && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-lg shadow-red-500/20">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                          </span>
                          <span>VIDEO DEMO</span>
                        </span>
                      )}

                      {/* Category overlay tags */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded border border-neutral-800">
                          {language === 'bn' ? item.categoryLabelBn : language === 'ar' ? item.categoryLabelAr : item.categoryLabel}
                        </span>
                        {item.subCategory && (
                          <span className="bg-purple-600/90 backdrop-blur-md text-white text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded border border-purple-500/50">
                            {language === 'bn' ? item.subCategoryBn || item.subCategory : language === 'ar' ? item.subCategoryAr || item.subCategory : item.subCategory}
                          </span>
                        )}
                      </div>

                      {/* Multi regional visual feedback for premium delivery */}
                      {item.results && item.results.length > 0 && (
                        <span className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-xs text-white text-[9px] font-black tracking-tight px-2 py-0.5 rounded shadow-sm z-10">
                          🚀 {language === 'bn' ? item.resultsBn?.[0]?.value || item.results[0].value : language === 'ar' ? item.resultsAr?.[0]?.value || item.results[0].value : item.results[0].value}
                        </span>
                      )}
                    </div>

                    {/* Info and Descriptions */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3.5">
                        
                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer" onClick={() => setSelectedProject(item)}>
                          {language === 'bn' ? item.titleBn : language === 'ar' ? item.titleAr : item.title}
                        </h3>

                        {/* Brief description */}
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold line-clamp-2">
                          {language === 'bn' ? item.descriptionBn : language === 'ar' ? item.descriptionAr : item.description}
                        </p>

                        {/* Tech pills stack representation */}
                        {item.techStack && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.techStack.map((tech, tIdx) => (
                              <span 
                                key={tIdx}
                                className="text-[9px] font-black tracking-tight font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800"
                              >
                                #{tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Meta stats like partner & Timeline builds */}
                        <div className="space-y-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-900/60 pt-3.5">
                          <p className="flex items-center gap-1.5 font-medium">
                            <User className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                            <span>{t.client}: <strong className="text-neutral-700 dark:text-neutral-300">{item.client}</strong></span>
                          </p>
                          <p className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                            <span>{t.timeline}: <strong className="text-neutral-700 dark:text-neutral-300">{item.duration}</strong></span>
                          </p>
                        </div>

                      </div>

                      {/* Operational Interactive Action buttons with case details launch */}
                      <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-900/60 w-full">
                        
                        <button
                          onClick={() => {
                            window.open(item.demoUrl, '_blank');
                          }}
                          className="flex-1 py-2 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{t.liveDemo}</span>
                        </button>

                        <button
                          onClick={() => setSelectedProject(item)}
                          className="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:text-white hover:bg-purple-600 dark:hover:bg-purple-600 flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          <span>{t.caseStudy}</span>
                        </button>

                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </section>

      {/* ================= IMMERSIVE DETAILS CASE STUDY POPUP MODAL ================= */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-neutral-200 dark:border-neutral-800 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative z-10 text-left max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header Close triggers */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 px-2.5 py-1.5 rounded-full bg-neutral-950/70 text-white hover:bg-red-500/90 transition-colors cursor-pointer"
                  title={t.closeBtn}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 pb-6">
                
                {/* Visual Poster or Video Walkthrough Player */}
                <div className="relative h-64 sm:h-72 w-full bg-neutral-950 overflow-hidden">
                  {selectedProject.videoUrl && activeMediaTab === 'video' ? (
                    <div className="w-full h-full relative">
                      <iframe
                        src={`${selectedProject.videoUrl}?autoplay=1&mute=1&rel=0`}
                        title={selectedProject.title}
                        className="w-full h-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent" />
                    </div>
                  )}

                  {/* Top Header Controls / Tabs to Toggle media */}
                  {selectedProject.videoUrl && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-neutral-950/70 p-1 rounded-xl backdrop-blur-md border border-white/10 z-30">
                      <button
                        onClick={() => setActiveMediaTab('image')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          activeMediaTab === 'image'
                            ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>📸</span>
                        <span>{language === 'bn' ? 'স্ক্রিনশট' : language === 'ar' ? 'لقطة شاشة' : 'Screenshot'}</span>
                      </button>
                      <button
                        onClick={() => setActiveMediaTab('video')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          activeMediaTab === 'video'
                            ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span>{language === 'bn' ? 'ভিডিও ওয়াকথ্রু' : language === 'ar' ? 'عرض مرئي' : 'Video Demo'}</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Title overlay */}
                  {(activeMediaTab === 'image' || !selectedProject.videoUrl) && (
                    <div className="absolute bottom-5 left-6 right-6 space-y-1.5 z-10 pointer-events-none">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-block bg-purple-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md">
                          {language === 'bn' ? selectedProject.categoryLabelBn : language === 'ar' ? selectedProject.categoryLabelAr : selectedProject.categoryLabel}
                        </span>
                        {selectedProject.subCategory && (
                          <span className="inline-block bg-emerald-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md">
                            {language === 'bn' ? selectedProject.subCategoryBn || selectedProject.subCategory : language === 'ar' ? selectedProject.subCategoryAr || selectedProject.subCategory : selectedProject.subCategory}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
                        {language === 'bn' ? selectedProject.titleBn : language === 'ar' ? selectedProject.titleAr : selectedProject.title}
                      </h2>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  
                  {/* Performance metrics results block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-850 rounded-2xl">
                      <h4 className="text-xs uppercase font-mono font-black text-[#8B5CF6] tracking-wider mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t.features}</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {(language === 'bn' ? selectedProject.featuresBn || selectedProject.features : language === 'ar' ? selectedProject.featuresAr || selectedProject.features : selectedProject.features)?.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5">
                            <span className="text-[#8B5CF6] font-extrabold shrink-0">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-850 rounded-2xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs uppercase font-mono font-black text-[#2563EB] tracking-wider mb-2.5 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>{t.resultsTitle}</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          {(language === 'bn' ? selectedProject.resultsBn || selectedProject.results : language === 'ar' ? selectedProject.resultsAr || selectedProject.results : selectedProject.results)?.map((res, rIdx) => (
                            <div key={rIdx} className="space-y-0.5">
                              <span className="text-lg font-black text-emerald-500 font-mono block leading-none">{res.value}</span>
                              <span className="text-[10px] text-neutral-400 font-medium block">{res.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-neutral-400 pt-4 border-t border-neutral-100 dark:border-neutral-850">
                        <p>{t.client}: <strong className="text-neutral-700 dark:text-neutral-200">{selectedProject.client}</strong></p>
                        <p>{t.timeline}: <strong className="text-neutral-700 dark:text-neutral-200">{selectedProject.duration}</strong></p>
                      </div>
                    </div>

                  </div>

                  {/* Project Scope & Objectives */}
                  {(selectedProject.projectScope || selectedProject.projectScopeBn || selectedProject.projectScopeAr) && (
                    <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/30 rounded-2xl space-y-1.5">
                      <h4 className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-500" />
                        <span>{language === 'bn' ? 'প্রজেক্টের স্কোপ ও লক্ষ্য' : language === 'ar' ? 'نطاق المشروع والأهداف' : 'Project Scope & Objectives'}</span>
                      </h4>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                        {language === 'bn' ? selectedProject.projectScopeBn || selectedProject.projectScope : language === 'ar' ? selectedProject.projectScopeAr || selectedProject.projectScope : selectedProject.projectScope}
                      </p>
                    </div>
                  )}

                  {/* Challenge & Solution Breakdown */}
                  {(selectedProject.challenge || selectedProject.solution) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedProject.challenge && (
                        <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 rounded-2xl space-y-1.5">
                          <h4 className="text-xs font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>{language === 'bn' ? 'মূল চ্যালেঞ্জ' : language === 'ar' ? 'التحدي الرئيسي' : 'The Challenge'}</span>
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {language === 'bn' ? selectedProject.challengeBn || selectedProject.challenge : language === 'ar' ? selectedProject.challengeAr || selectedProject.challenge : selectedProject.challenge}
                          </p>
                        </div>
                      )}
                      {selectedProject.solution && (
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl space-y-1.5">
                          <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>{language === 'bn' ? 'আমাদের সলিউশন' : language === 'ar' ? 'الحل المقدم' : 'Our Solution'}</span>
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {language === 'bn' ? selectedProject.solutionBn || selectedProject.solution : language === 'ar' ? selectedProject.solutionAr || selectedProject.solution : selectedProject.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Core description details block */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">Project Audit Analysis</h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-semibold">
                      {language === 'bn' ? selectedProject.descriptionBn : language === 'ar' ? selectedProject.descriptionAr : selectedProject.description}
                    </p>
                    <p className="text-xs text-neutral-400 leading-normal">
                      With years of architectural coding experience, WebzoneBD IT Solution has optimized this deployment for highest uptime, multi-CDN caching, asset compression, and direct SEO schema search crawler compliance.
                    </p>
                  </div>

                  {/* Technology used block */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">Technologies Engaged</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.techStack?.map((tItem, tK) => (
                        <span 
                          key={tK}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40 rounded-lg text-xs font-bold"
                        >
                          #{tItem}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Client Testimonial Block */}
                  {selectedProject.testimonial && (
                    <div className="p-4 bg-neutral-100/70 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl space-y-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed font-serif">
                        "{language === 'bn' ? selectedProject.testimonial.quoteBn || selectedProject.testimonial.quote : language === 'ar' ? selectedProject.testimonial.quoteAr || selectedProject.testimonial.quote : selectedProject.testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-2.5 pt-1">
                        {selectedProject.testimonial.avatar && (
                          <img src={selectedProject.testimonial.avatar} alt={selectedProject.testimonial.author} className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white">{selectedProject.testimonial.author}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">{selectedProject.testimonial.role} — {selectedProject.testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Immersive CTA redirect buttons */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-850 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-850 cursor-pointer"
                    >
                      {language === 'bn' ? 'বন্ধ করুন' : language === 'ar' ? 'إغلاق نافذة التفاصيل' : 'Close Details'}
                    </button>

                    <button
                      onClick={() => {
                        window.open(selectedProject.demoUrl, '_blank');
                      }}
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.liveDemo}</span>
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HIGH-RESOLUTION SCREENSHOT LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (() => {
          const project = filteredItems[lightboxIndex];
          const hasPrev = filteredItems.length > 1;
          const hasNext = filteredItems.length > 1;

          const handlePrev = (e?: React.MouseEvent) => {
            if (e) e.stopPropagation();
            setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
          };

          const handleNext = (e?: React.MouseEvent) => {
            if (e) e.stopPropagation();
            setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
          };

          const handleOpenCaseStudy = (e: React.MouseEvent) => {
            e.stopPropagation();
            setSelectedProject(project);
            setLightboxIndex(null);
          };

          return (
            <motion.div 
              id="portfolio-lightbox-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-between p-4 sm:p-6 select-none"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Top Bar Controls */}
              <div className="w-full flex items-center justify-between max-w-6xl z-10 pt-2 pb-4">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#06B6D4]">
                    {language === 'bn' ? 'প্রজেক্ট স্ক্রিনশট গ্যালারি' : language === 'ar' ? 'معرض لقطات شاشة المشاريع' : 'Project Screenshot Spotlight'}
                  </span>
                  <div className="text-xs text-neutral-400 font-mono font-bold flex items-center gap-1.5">
                    <span>{lightboxIndex + 1} / {filteredItems.length}</span>
                    <span className="bg-neutral-800 text-neutral-300 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase">
                      {language === 'bn' ? project.categoryLabelBn : language === 'ar' ? project.categoryLabelAr : project.categoryLabel}
                    </span>
                    {project.subCategory && (
                      <span className="bg-purple-900/60 text-purple-300 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase">
                        {language === 'bn' ? project.subCategoryBn || project.subCategory : language === 'ar' ? project.subCategoryAr || project.subCategory : project.subCategory}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block text-[9px] font-mono bg-neutral-900 border border-neutral-805 text-neutral-500 rounded px-2 py-1 leading-none uppercase">
                    ← / → navigate · esc close
                  </span>
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 sm:p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-805 text-neutral-400 hover:text-white transition-all cursor-pointer border border-neutral-800 flex items-center justify-center active:scale-90"
                    title={language === 'bn' ? 'বন্ধ করুন (Esc)' : language === 'ar' ? 'إغلاق (Esc)' : 'Close Spotlight (Esc)'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Stage area */}
              <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center min-h-0 py-4">
                
                {/* Previous trigger arrow */}
                {hasPrev && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 sm:left-4 z-20 p-3 rounded-full bg-neutral-900/65 sm:bg-neutral-900/50 hover:bg-neutral-800 text-white hover:text-cyan-450 border border-neutral-850 backdrop-blur-xs transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                    title={language === 'bn' ? 'পূর্ববর্তী' : language === 'ar' ? 'السابق' : 'Previous'}
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                )}

                {/* Animated high-res showcase screenshot */}
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="relative max-w-full max-h-[70vh] sm:max-h-[75vh] h-auto rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="max-w-full max-h-[70vh] sm:max-h-[75vh] w-auto h-auto object-contain cursor-zoom-out select-none"
                    onClick={() => setLightboxIndex(null)}
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Next trigger arrow */}
                {hasNext && (
                  <button
                    onClick={handleNext}
                    className="absolute right-0 sm:right-4 z-20 p-3 rounded-full bg-neutral-900/65 sm:bg-neutral-900/50 hover:bg-neutral-800 text-white hover:text-cyan-455 border border-neutral-850 backdrop-blur-xs transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                    title={language === 'bn' ? 'পরবর্তী' : language === 'ar' ? 'التالي' : 'Next'}
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                )}

              </div>

              {/* Bottom Information and Actions Panel */}
              <div 
                className="w-full max-w-4xl bg-neutral-900/80 backdrop-blur-md border border-neutral-850 p-4 sm:p-5 rounded-2xl sm:rounded-3xl z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-4 text-center md:text-left mt-2 mb-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                    {language === 'bn' ? project.titleBn : language === 'ar' ? project.titleAr : project.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium max-w-2xl line-clamp-2">
                    {language === 'bn' ? project.descriptionBn : language === 'ar' ? project.descriptionAr : project.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/40 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{t.client}: <strong className="text-neutral-200">{project.client}</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{t.timeline}: <strong className="text-neutral-200">{project.duration}</strong></span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleOpenCaseStudy}
                    className="flex-1 md:flex-none px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600/20 text-cyan-400 hover:text-white hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'bn' ? 'কেস স্টাডি দেখুন' : language === 'ar' ? 'تفاصيل دراسة الحالة' : 'Case Details'}</span>
                  </button>

                  <button
                    onClick={() => {
                      window.open(project.demoUrl, '_blank');
                    }}
                    className="flex-1 md:flex-none px-4 py-2.5 text-xs font-bold rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.liveDemo}</span>
                  </button>
                </div>
              </div>

            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ================= TEAM PROFILES & QUALITY SERVICES MATRIX ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioTeamProfiles language={language} theme={theme} />
      </section>

      {/* ================= CLIENT TESTIMONIALS ================= */}
      <section className="bg-white dark:bg-[#0F172A] border-t border-b border-neutral-200/50 dark:border-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              {t.successStoriesHeader}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
              {t.successStoriesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localizedTestimonials.map((test, tIndex) => (
              <div 
                key={tIndex}
                className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#020617] border border-neutral-200/60 dark:border-neutral-850/50 hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5" title="5 Star Rated Service">
                    {[...Array(test.rating)].map((_, rK) => (
                      <Star key={rK} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-semibold italic">
                    "{test.feedback}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-850/60">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {test.name[0]}
                  </div>
                  <div className="leading-tight">
                    <h4 className="text-xs font-black text-neutral-900 dark:text-white">{test.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-bold">{test.role} - {test.company}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= KEY TECHNOLOGIES VISUAL SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            {t.techBannerTitle}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            We employ modern, highly efficient technology matrices to compile secure, lightweight, and super scalable platforms.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3" id="tech-visuals-badges">
          {techStackIcons.map((tech, tcIdx) => (
            <div 
              key={tcIdx}
              className={`px-4 py-2.5 rounded-2xl border ${tech.bg} ${tech.border} flex items-center gap-2 text-xs font-black ${tech.text} shadow-xs`}
            >
              <span className="text-base">{tech.icon}</span>
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 px-4 relative overflow-hidden text-center border-t border-blue-500" id="agency-cta-portfolio">
        
        {/* Abstract vector shape decorators */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 opacity-10 rounded-full filter blur-xl transform translate-x-20 -translate-y-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 opacity-20 rounded-full filter blur-2xl transform -translate-x-20 translate-y-20" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-cyan-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guaranteed Production Timelines</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {t.ctaTitle}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-cyan-100 max-w-xl mx-auto leading-relaxed font-semibold">
            {t.ctaSub}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-sm shadow-lg transition-all duration-150 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{t.ctaConsultation}</span>
            </button>

            <button
              onClick={handleConsultText}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-blue-600 font-bold text-sm shadow-md transition-all duration-150 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4 text-cyan-500" />
              <span>{t.ctaStart}</span>
            </button>

            <a
              href="https://wa.me/966570511931"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xs transition-all duration-150 flex items-center justify-center gap-1.5"
            >
              <Smile className="w-4 h-4" />
              <span>{t.ctaWhatsapp}</span>
            </a>

          </div>

        </div>
      </section>


      {/* ================= INTERACTIVE LEAD QUOTATION GENERATOR MODAL ================= */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsQuoteModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-neutral-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Header title */}
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span>{language === 'bn' ? 'অনলাইন কোটেশন রিকোয়েস্ট' : language === 'ar' ? 'طلب تسعيرة دقيقة فورية' : 'Request Custom Quote'}</span>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-500">
                      Give us 2 minutes. We will compute the absolute pricing model.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {quoteSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 text-center space-y-3 bg-blue-50/20 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-900/30"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white">{t.formSuccessTitle}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                      {t.formSuccessDesc}
                    </p>
                    <p className="text-[11px] text-blue-600 dark:text-cyan-400 font-mono">Redirecting queue secure system...</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-bold text-neutral-400">{t.formName} *</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          placeholder="Fahim Ahmed"
                          className="w-full px-3 py-2 text-xs bg-[#F8FAFC] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-bold text-neutral-400">{t.formPhone} *</label>
                        <input
                          type="tel"
                          required
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          placeholder="+880 1711-223344"
                          className="w-full px-3 py-2 text-xs bg-[#F8FAFC] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-bold text-neutral-400">{t.formCategory}</label>
                        <select
                          value={quoteForm.category}
                          onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#F8FAFC] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                        >
                          <option value="web">Web Development</option>
                          <option value="news">News Portal</option>
                          <option value="blog">Blogging Site</option>
                          <option value="ecommerce">Ecommerce Shop</option>
                          <option value="portfolio">Personal Portfolio</option>
                          <option value="seoAds">SEO & Marketing</option>
                          <option value="solutions">ERP / POS Database Systems</option>
                        </select>
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] font-bold text-neutral-400">{t.formBudget}</label>
                        <select
                          value={quoteForm.budget}
                          onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#F8FAFC] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                        >
                          <option value="basic">{t.budgetOption1}</option>
                          <option value="medium">{t.budgetOption2}</option>
                          <option value="enterprise">{t.budgetOption3}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-bold text-neutral-400">{t.formEmail}</label>
                      <input
                        type="email"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        placeholder="fahim@example.com"
                        className="w-full px-3 py-2 text-xs bg-[#F8FAFC] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-bold text-neutral-400">{t.formBrief} *</label>
                      <textarea
                        required
                        rows={3}
                        value={quoteForm.brief}
                        onChange={(e) => setQuoteForm({ ...quoteForm, brief: e.target.value })}
                        placeholder={language === 'bn' ? 'আমাদের একটি মাল্টি ভেন্ডর পস এবং ই-কমার্স সমাধান প্রয়োজন যেখানে থার্মাল প্রিন্ট চালানো যাবে।' : 'Need custom online shop integrated with checkout and local invoice prints...'}
                        className="w-full p-3 text-xs bg-[#F8FAFC] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.formSubmit}</span>
                    </button>

                  </form>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
