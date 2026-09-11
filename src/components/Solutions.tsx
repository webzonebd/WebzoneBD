import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Sparkles, Phone, MessageSquare, 
  Flame, Star, Gift, ArrowRight, Award, Check,
  Monitor, Barcode, TrendingUp, Users, Settings2,
  ShoppingCart, Package, Lock, Plus, Clock, 
  Printer, PieChart, Users2, Database, HelpCircle, 
  Send, Server, ShieldCheck, DollarSign, RefreshCw,
  Layers, Heart, Building2, GraduationCap, BookOpen, 
  School, Calendar, ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme, Order } from '../types';

interface SolutionsProps {
  language: Language;
  theme: Theme;
  addSimulatedServiceOrder?: (order: Order) => void;
  triggerToast: (msg: string) => void;
}

export default function Solutions({ 
  language, 
  theme, 
  addSimulatedServiceOrder, 
  triggerToast 
}: SolutionsProps) {
  const [activeSolution, setActiveSolution] = useState<'pos' | 'school'>('pos');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  
  // Simulated State for the Live POS simulation
  const [salesCount, setSalesCount] = useState(148);
  const [stockLevel, setStockLevel] = useState(94);
  const [revenue, setRevenue] = useState(62800);

  // Simulated State for School Management Simulation
  const [studentCount, setStudentCount] = useState(1248);
  const [admissionCount, setAdmissionCount] = useState(42);
  const [smsCount, setSmsCount] = useState(12845);

  const [currencySymbol, setCurrencySymbol] = useState('৳');
  
  // Custom states for demo request form
  const [demoForm, setDemoForm] = useState({
    name: '',
    phone: '',
    email: '',
    businessType: '',
    branches: '1',
    message: ''
  });
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Custom states for consultation form
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [consultSuccess, setConsultSuccess] = useState(false);

  // Set default business types when active solution toggles
  useEffect(() => {
    if (activeSolution === 'pos') {
      setDemoForm(prev => ({ ...prev, businessType: 'Retail Store' }));
    } else {
      setDemoForm(prev => ({ ...prev, businessType: 'General School' }));
    }
  }, [activeSolution]);

  // Sync tab with localStorage selection
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('webzone_target_solution_tab');
      if (stored === 'pos' || stored === 'school') {
        setActiveSolution(stored);
      }
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Translate Currency to active language and BDT/USD/SAR
  useEffect(() => {
    if (language === 'bn') {
      setCurrencySymbol('৳');
    } else if (language === 'ar') {
      setCurrencySymbol('﷼');
    } else {
      setCurrencySymbol('$');
    }
  }, [language]);

  // Handle live random counts to simulate actual real-time active system activity
  useEffect(() => {
    const timer = setInterval(() => {
      // POS State Changes
      setSalesCount(prev => prev + (Math.random() > 0.4 ? 1 : 0));
      setStockLevel(prev => {
        if (prev <= 10) return 99;
        return prev - (Math.random() > 0.75 ? 1 : 0);
      });
      setRevenue(prev => prev + (Math.random() > 0.45 ? Math.floor(Math.random() * 500) + 120 : 0));

      // School State Changes
      setStudentCount(prev => prev + (Math.random() > 0.85 ? 1 : 0));
      setAdmissionCount(prev => {
        if (prev >= 65) return 30;
        return prev + (Math.random() > 0.7 ? 1 : 0);
      });
      setSmsCount(prev => prev + (Math.random() > 0.35 ? Math.floor(Math.random() * 4) + 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Multi-language Translation Resources for BOTH solutions
  const solutionsData = {
    pos: {
      category: {
        en: "Business Software Solutions",
        bn: "বিজনেস সফটওয়্যার সলিউশনস",
        ar: "حلول البرمجيات السحابية للأعمال"
      },
      packageName: {
        en: "POS Software Development Solution",
        bn: "POS সফটওয়্যার ডেভেলপমেন্ট সলিউশন",
        ar: "نظام كاشير ونقاط البيع POS المتكامل"
      },
      badge: {
        en: "🔥 LIMITED TIME OFFER",
        bn: "🔥 সীমিত সময়ের অফার",
        ar: "🔥 عرض ترويجي لفترة محدودة"
      },
      subtitle: {
        en: "A complete Point of Sale (POS) solution designed to automate sales, inventory, customers, and business operations.",
        bn: "একটি কমপ্লিট পয়েন্ট অফ সেল (POS) সলিউশন যা আপনার সেলস, ইনভেন্টরি, কাস্টমার এবং সামগ্রিক ব্যবসা অটোমেট করার জন্য ডিজাইন করা হয়েছে।",
        ar: "حل هندسي متكامل ومبسط لنظام نقاط البيع (POS) مصمم خصيصاً لأتمتة المبيعات وتتبع وإدارة المخزون والعملاء وعمليات الفواتير والتقارير الفورية."
      },
      whoSubtitle: {
        en: "Tailored to solve overhead, stock errors, and trace revenues for retail counters and wholesales.",
        bn: "স্টক নির্ভুল রাখতে এবং সহজ হিসাব রাখার জন্য আপনার বিক্রয় কাউন্টারের জন্য চূড়ান্ত সলিউশন।",
        ar: "نظام كاشير معتمد كلياً متوافق مع مقترحات هيئة الزكاة والضريبة والجمارك بالمملكة لضبط الفروع ومستودعات التوزيع."
      },
      perfectFor: {
        en: "Perfect For Retail & Shops:",
        bn: "যাদের জন্য অত্যন্ত প্রয়োজনীয়:",
        ar: "مثالي ومناسب للمطاعم والمتاجر التالية:"
      },
      regularPriceStr: { en: "৳50,000", bn: "৳৫০,০০০", ar: "SAR ১,৬০০" },
      offerPriceStr: { en: "৳25,000", bn: "৳২৫,০০০", ar: "SAR ৮০০" },
      savePriceStr: { en: "৳25,005", bn: "৳২৫,০০০", ar: "SAR ৮০০" },
      deliveryTimeline: { en: "7 - 15 Business Days", bn: "৭ - ১৫ কর্মদিবস", ar: "7 - 15 أيام عمل رسمية" },
      ctaTitle: {
        en: "Ready To Digitize Your Business?",
        bn: "আপনার ব্যবসাকে ডিজিটাল করতে প্রস্তুত?",
        ar: "هل تريد البدء في رقمنة شركتك الآن؟"
      },
      ctaSubtitle: {
        en: "Get a professional POS software solution and manage your business smarter. Request a live interactive playground demo or a free setup audit.",
        bn: "একটি প্রফেশনাল POS সফটওয়্যার সলিউশন পান এবং আপনার ব্যবসাকে স্মার্টলি পরিচালনা করুন। ডেমো দেখতে বা ফ্রি কনসালটেশনের জন্য আজই ফর্মটি পূরণ করুনন।",
        ar: "احصل على نظام كاشير ونقاط بيع مخصص واحترافي لتدير مشروعك التجاري بذكاء ومرونة تامة. اطلب دليلاً تفاعلياً تجريبياً اليوم مجاناً."
      }
    },
    school: {
      category: {
        en: "Education Management Solutions",
        bn: "এডুকেশন ম্যানেজমেন্ট সলিউশনস",
        ar: "حلول البرمجيات التعليمية الذكية"
      },
      packageName: {
        en: "School Management System Solution",
        bn: "স্কুল ম্যানেজমেন্ট সিস্টেম সলিউশন",
        ar: "نظام إدارة المدارس والمعاهد الرقمي"
      },
      badge: {
        en: "🎓 EDUCATION SOLUTION",
        bn: "🎓 স্কুল ডিজিটালাইজেশন অফার",
        ar: "🎓 متاح كحل تعليمي متكامل"
      },
      subtitle: {
        en: "A complete digital school management platform to manage students, teachers, attendance, exams, fees, accounts, and academic operations from a single dashboard.",
        bn: "শিক্ষার্থী, শিক্ষক, উপস্থিতি হাজিরা, পরীক্ষা রেজাল্ট, ফি সংগ্রহ, হিসাব এবং সমন্বিত মেম্বারশিপ পোর্টাল পরিচালনা করার চূড়ান্ত সলিউশন।",
        ar: "منصة هندسية سحابية متكاملة مخصصة لإدارة وتتبع شؤون الطلاب، المدرسين، الغياب والحضور، الامتحانات الفورية، المدفوعات والتقارير الأكاديمية."
      },
      whoSubtitle: {
        en: "Engineered to eliminate manual papers, streamline result processing, and dispatch SMS alerts automatically.",
        bn: "কাগজে-কলমে হিসাব করার ঝামেলা চিরতরে দূর করতে এবং অভিভাবকদের কাছে এসএসএস মেসেজ পাঠাতে প্রফেশনাল সমাধান।",
        ar: "نظام متطور كلياً للتخلص من السجلات والبيانات الورقية وتسهيل ميكنة المراسلات الفورية لأهالي الطلاب."
      },
      perfectFor: {
        en: "Perfect For Educational Hubs:",
        bn: "যাদের জন্য অত্যন্ত উপযোগী:",
        ar: "ملائم كلياً للمؤسسات والمنشآت التالية:"
      },
      regularPriceStr: { en: "৳80,000", bn: "৳৮০,০০০", ar: "SAR ২,৫৬০" },
      offerPriceStr: { en: "৳40,000", bn: "৳৪০,০০০", ar: "SAR ১,২৮) " },
      savePriceStr: { en: "৳40,000", bn: "৳৪০,০০০", ar: "SAR ১,২৭২" },
      deliveryTimeline: { en: "10 - 20 Business Days", bn: "১০ - ২০ কর্মদিবস", ar: "10 - 20 أيام عمل رسمية" },
      ctaTitle: {
        en: "Ready To Digitize Your Educational Institution?",
        bn: "আপনার শিক্ষা প্রতিষ্ঠানকে ডিজিটাল করতে প্রস্তুত?",
        ar: "هل تريد بدء رقمنة معهدك أو كليتك الآن؟"
      },
      ctaSubtitle: {
        en: "Transform your school into a modern digital education platform with our complete School Management System. Request a live sandbox trial link.",
        bn: "আপনার শিক্ষা প্রতিষ্ঠানকে একটি মডার্ন ডিজিটাল এডুকেশন প্ল্যাটফর্মে রুপান্তর করুন আমাদের স্কুল ম্যানেজমেন্ট সফটওয়্যারের মাধ্যমে।",
        ar: "حول مدرستك أو منشأتك إلى مركز تعليمي سحابي متطور اليوم. تواصل معنا لمعاينة لوحة الإدارة الفنية والتحكم فوراً."
      }
    }
  };

  const sharedTexts = {
    en: {
      includedPerks: "PACKAGE INCLUDED MODULES",
      freeBonus: "EXCLUSIVE FREE BONUSES",
      regularPrice: "Regular Price",
      offerPrice: "Special Offer Price",
      youSave: "You Save",
      discount: "50% OFF",
      deliveryLabel: "Est. Lead Time:",
      whyChooseTitle: "WHY CHOOSE THIS CONFIGURED SOLUTION",
      packageBenefits: "BUSINESS VALUE & KEY BENEFITS",
      btnDemo: "Request Free Demo",
      btnConsult: "Get Free Consultation",
      btnWhatsApp: "WhatsApp Now",
      successDemo: "System verified! Your sandbox credentials folder has been calculated. Our support executive will WhatsApp or call you with entry links in minutes.",
      successConsult: "Consultation booked! We will design and share a secure system architecture blueprint for your organization size.",
      activeLabel: "Simulated Daily Traffic & Active Events"
    },
    bn: {
      includedPerks: "প্যাকেজের অন্তর্ভুক্ত মডিউলসমূহ",
      freeBonus: "সম্পূর্ণ ফ্রি স্পেশাল বোনাস উপহার",
      regularPrice: "নিয়মিত মূল্য",
      offerPrice: "স্পেশাল অফার মূল্য",
      youSave: "আপনার মোট সাশ্রয়",
      discount: "৫০% ছাড়",
      deliveryLabel: "ডেলিভারি সময়সীমা:",
      whyChooseTitle: "কেন আমাদের এই সলিউশনটি সেরা?",
      packageBenefits: "মূল্যবান ব্যবসায়িক সুফলসমূহ",
      btnDemo: "ফ্রি ডেমো রিকোয়েস্ট",
      btnConsult: "ফ্রি কনসালটেশন বুকিং",
      btnWhatsApp: "সরাসরি হোয়াটসঅ্যাপ করুন",
      successDemo: "ডেমো রিকোয়েস্ট সফলভাবে রেজিস্টার হয়েছে! আপনার জন্য একটি ফ্রি ডেমো অ্যাকাউন্ট তৈরি হচ্ছে। খুব শীঘ্রই আমাদের প্রতিনিধি আপনাকে লিঙ্কটি পাঠাবেন।",
      successConsult: "কনসালটেশন রিকোয়েস্ট সফল হয়েছে! আমাদের অভিজ্ঞ আইটি ইঞ্জিনিয়ার খুব শীঘ্রই আপনার ব্যবসায়িক রূপরেখা নিয়ে কন্টাক্ট করবেন।",
      activeLabel: "লাইভ ডাটাবেজ ইন্টারেক্টিভ ট্র্যাকার"
    },
    ar: {
      includedPerks: "الخصائص والموديولات المشمولة بالنظام",
      freeBonus: "الهدايا الإضافية والخدمات المجانية",
      regularPrice: "السعر الأصلي المعتاد",
      offerPrice: "سعر العرض الحصري المخفض",
      youSave: "إجمالي قيمة التوفير",
      discount: "خصم 50% فوري",
      deliveryLabel: "فترة البناء والربط الكامل:",
      whyChooseTitle: "لماذا يفضل المطورون هذا الحل المخصص؟",
      packageBenefits: "عوائد وفوائد الأتمتة لشركتك",
      btnDemo: "طلب معاينة تجريبية للنظام",
      btnConsult: "طلب استشارة تخطيطية مجانية",
      btnWhatsApp: "تواصل عبر الواتساب الفوري",
      successDemo: "تم استلام طلب المعاينة الفنية بنجاح! يتم حالياً إعداد بيانات الدخول لنسخة POS أو المدرسة السحابية. سيتواصل معكم الدعم التقني عبر الواتساب لتسليم لوحة التحكم.",
      successConsult: "تم تسجيل طلبك بدقة! سيقوم مهندسينا بدراسة حجم ونشاط شركتك لتقديم الحل التقني المناسب لنشاطك.",
      activeLabel: "تتبع المبيعات والعمليات الجارية بالثانية"
    }
  }[language];

  // Selected solution dataset
  const currentSol = solutionsData[activeSolution];

  // Perfect For Data Matrices
  const typesOfBusiness = {
    pos: [
      { name: { en: "Retail Stores", bn: "খুচরা বিক্রেতা ও রিটেল শপ", ar: "محلات ومتجر التجزئة" }, icon: ShoppingCart },
      { name: { en: "Super Shops", bn: "সুপার শপ ও গ্রোসারি", ar: "السوبرماركت والتموينات" }, icon: Building2 },
      { name: { en: "Restaurants", bn: "রেস্টুরেন্ট ও ক্যাফে", ar: "المطاعم والمقاهي العصرية" }, icon: Monitor },
      { name: { en: "Pharmacies", bn: "ফার্মেসি ও হেলথ কেয়ার", ar: "الصيدليات والعيادات الطبية" }, icon: Heart },
      { name: { en: "Fashion Stores", bn: "ফ্যাশন ও বুটিক আউটলেট", ar: "معارض الملابس والأزياء" }, icon: Star },
      { name: { en: "Electronics Shops", bn: "ইলেকট্রনিক্স ও গেজেটস", ar: "الاتصالات والأجهزة الذكية" }, icon: Award },
      { name: { en: "Wholesale Businesses", bn: "পাইকারি বা হোলসেল ব্যবসা", ar: "تجارة الجملة ومراكز التوزيع" }, icon: Package },
      { name: { en: "Multi-Branch Businesses", bn: "মাল্টি-ব্রাঞ্চ কর্পোরেট ব্যবসা", ar: "الشركات الكبرى متعددة الفروع" }, icon: Layers }
    ],
    school: [
      { name: { en: "General Schools", bn: "প্রাথমিক, হাইস্কুল ও কিন্ডারগার্টেন", ar: "المدارس الحكومية والأهلية" }, icon: School },
      { name: { en: "Colleges", bn: "কলেজ ও উচ্চমাধ্যমিক বিদ্যালয়", ar: "الكليات التقنية والمتوسطة" }, icon: GraduationCap },
      { name: { en: "Madrasas", bn: "মাদরাসা ও হেফজখানা এডুকেশন", ar: "المدارس الدينية والمعاهد" }, icon: BookOpen },
      { name: { en: "Coaching Centers", bn: "কোচিং সেন্টার ও প্রাইভেট ব্যাচ", ar: "مراكز التقوية والتدريب الصيفي" }, icon: Users },
      { name: { en: "Training Institutes", bn: "ভোকেশনাল ও প্রফেশনাল আইটি একাডেমী", ar: "مراكز التدريب المهني والتعليم المستمر" }, icon: Settings2 },
      { name: { en: "Educational Organizations", bn: "সম্মিলিত মাদ্রাসা বোর্ড ও ট্রাস্ট স্কুল", ar: "المجمعات التعليمية والتعليم الأهلي" }, icon: Layers }
    ]
  }[activeSolution];

  // Deliverable Features
  const posInclusions = {
    pos: [
      { text: { en: "Modern POS Dashboard", bn: "অত্যাধুনিক পস ওভারভিউ ড্যাশবোর্ড", ar: "لوحة تحكم إحصائية فورية متقدمة" } },
      { text: { en: "Product & Category Management", bn: "প্রোডাক্ট এবং ক্যাটাগরি আনলিমিটেড এন্ট্রি", ar: "إدارة وتصنيف المنتجات والأقسام" } },
      { text: { en: "Inventory Management", bn: "কাস্টম ইনভেন্টরি পণ্য স্টক এন্ট্রি ট্র্যাকার", ar: "أتمتة وإدارة المخازن والمستودعات" } },
      { text: { en: "Stock Tracking", bn: "রিয়েলটাইম স্টক রি-অর্ডার ওয়ার্নিং সিস্টেম", ar: "تتبع دقيق لحركة البضائع المتبقية" } },
      { text: { en: "Barcode Support", bn: "স্বয়ংক্রিয় বারকোড জেনারেটর ও স্ক্যানার সাপোর্ট", ar: "دعم الباركود والملصقات التلقائية بالكامل" } },
      { text: { en: "Sales Management", bn: "সহজ বিক্রয় ব্যবস্থাপনা ও মাল্টি-পেমেন্ট মেথড", ar: "لوحة كاشير وإدارة شاملة للمبيعات" } },
      { text: { en: "Purchase Management", bn: "সাপ্লায়ার ক্রয় ও সাপ্লাই চেইন লেজার", ar: "إدارة المشتريات وفواتير التوريد" } },
      { text: { en: "Customer Management", bn: "কাস্টমার ডাটাবেস এবং ডিউ লেজার বুক", ar: "ملفات العملاء وتتبع حسابات الآجل" } },
      { text: { en: "Supplier Management", bn: "সাপ্লায়ার ট্র্যাকার ও পেমেন্ট রেকর্ড", ar: "إدارة حسابات الموردين والدفع المستحق" } },
      { text: { en: "Employee Management", bn: "স্টাফ কন্ট্রোল এবং লগইন সেশন কন্ট্রোলার", ar: "إدارة بيانات الموظفين وكروت الكاشير" } },
      { text: { en: "Expense Management", bn: "দৈনিক বিবিধ খরচ ও ব্যাকঅফিস ট্র্যাকার", ar: "تسجيل المصروفات وبنود الميزانية التشغيلية" } },
      { text: { en: "Profit & Loss Reports", bn: "লাভ ও লোকসান এর নির্ভুল অটোমেটেড রিপোর্টস", ar: "تقارير الأرباح والخسائر الفورية بنقرة" } },
      { text: { en: "Daily Sales Reports", bn: "দৈনিক চূড়ান্ত ট্রানজেকশন কাস্টম ইমেইল অ্যালার্ট", ar: "مخلص مبيعات يومية كاش يرسل للإدارة" } },
      { text: { en: "Invoice & Receipt Printing", bn: "থার্মাল প্রিন্টার সাপোর্ট ও কাস্টম ইনভয়েসিং", ar: "دعم طباعة فواتير حرارية وسندات قبض" } },
      { text: { en: "Role & Permission Management", bn: "অ্যাডমিন ও কর্মচারীদের কাস্টম অনুমতি এক্সেস", ar: "إسناد الصلاحيات والأدوار للمستخدمين" } },
      { text: { en: "Multi User Access", bn: "একত্রে একাধিক কম্পিউটার ব্যবহারের সুবিধা", ar: "دعم تعدد المستخدمين والعمل المتزامن" } },
      { text: { en: "Mobile Responsive Interface", bn: "মোবাইল ও ট্যাবলেট ফ্রেন্ডলি ইউজার ইন্টারফেস", ar: "واجهة متوافقة مع الجوال والآيباد تماماً" } }
    ],
    school: [
      { text: { en: "Super Admin Dashboard", bn: "প্রধান এডমিন বা বোর্ডের জন্য সুপিরিয়র ড্যাশবোর্ড", ar: "لوحة تحكم المدير العام العليا" } },
      { text: { en: "School Management Dashboard", bn: "ডিজিটাল স্কুল ম্যানেজমেন্ট কাউন্টার প্যানেল", ar: "لوحة تحكم إدارة فرع المدرسة" } },
      { text: { en: "Student Management", bn: "শিক্ষার্থীর নাম, রোল, ছবি ও ইউনিক আইডি ট্র্যাকার", ar: "إدارة كاملة لملفات وسجلات الطلاب ونموهم" } },
      { text: { en: "Teacher Management", bn: "শিক্ষক প্রোফাইল, স্যালারি লেজার ও ক্লাস অ্যাসাইনমেন্ট", ar: "إدارة شؤون المعلمين وتوزيع الحصص الصفية" } },
      { text: { en: "Staff Management", bn: "অন্যান্য কর্মচারী কন্ট্রোল ও স্যালারি পেমেন্ট শীট", ar: "قاعدة بيانات الكادر الإداري والخدمي والرواتب" } },
      { text: { en: "Class & Section Management", bn: "শ্রেণী এবং শাখা নির্ধারণ ও স্টুডেন্ট শিফট সিস্টেম", ar: "إعداد الفصول والمراحل والأقسام والشعب" } },
      { text: { en: "Subject Management", bn: "সিলেবাস অনুযায়ী আনলিমিটেড বিষয় ও বই সাজানো", ar: "توليد مصفوفة ومواد المنهج الدراسي" } },
      { text: { en: "Attendance Management", bn: "দৈনিক ও পিরিয়ড ভিত্তিক উপস্থিতি (অটোমেটিক SMS)", ar: "رصد الحضور والغياب اليومي مع خيار الإخطار الفوري" } },
      { text: { en: "Exam & Result Management", bn: "পরীক্ষা শিডিউল এন্ট্রি, মার্কশিট ও রেজাল্ট প্রসেসিং", ar: "إعداد كشوف الاختبارات وإصدار الشهادات والنتائج" } },
      { text: { en: "Online Admission System", bn: "অনলাইন প্রফেশনাল এডমিশন সাবমিশন ফর্ম ও ডাটাবেস", ar: "بوابة سحابية لاستقبال طلبات القبول والترشيح" } },
      { text: { en: "Fee Collection Management", bn: "স্টুডেন্ট টিউশন ফি সংগ্রহ ও বকেয়া হিসাব ট্র্যাকিং", ar: "أتمتة تحصيل الرسوم المدرسية والأقساط الشهرية" } },
      { text: { en: "SMS Notification System", bn: "অভিভাবকদের কাছে হাজিরা, নোটিশ ও রেজাল্টের অটো SMS", ar: "برودكاست رسائل الجوال النصية والإنذارات لأولياء الأمور" } },
      { text: { en: "Notice Board Management", bn: "জরুরি নোটিশ বা ছুটির বার্তা প্রকাশের কাস্টম পোর্টাল", ar: "لوحة الإعلانات والتعاميم المدرسية الرسمية السحابية" } },
      { text: { en: "Routine Management", bn: "ক্লাস রুটিন ও পরীক্ষার সাপ্তাহিক সময়সূচী মেকার", ar: "برمجة وبناء جدول الحصص اليومي والأسبوعي" } },
      { text: { en: "Homework Management", bn: "অনলাইন হোমওয়ার্ক অ্যাসাইনমেন্ট এবং শিক্ষক মূল্যায়ন", ar: "رفع الواجبات والتمارين المدرسية اليومية مع المتابعة" } },
      { text: { en: "Parent Portal", bn: "অভিভাবকদের জন্য কাস্টম ড্যাশবোর্ড ও কন্টাক্ট হাব", ar: "حساب خاص لولي الأمر لمتابعة الدرجات والغياب" } },
      { text: { en: "Student Portal", bn: "শিক্ষার্থীদের স্বয়ংক্রিয় লগইন, রুটিন ও এক্সাম ভিউয়ার", ar: "أكوانت الطالب الفردي للاستعلام عن الواجبات" } },
      { text: { en: "Teacher Portal", bn: "শিক্ষকদের জন্য উপস্থিতি জমা এবং মার্কস এন্ট্রি পোর্টাল", ar: "بوابة المعلم للمساعدة في رصد الدرجات الأكاديمية" } },
      { text: { en: "Academic Reports", bn: "সহজ গ্রাফিকাল রিপোর্ট জেনারেটর ও বার্ষিক বিশ্লেষণ", ar: "إصدار تقارير الأداء الأكاديمي والبيانات التحليلية" } },
      { text: { en: "Accounting Module", bn: "স্কুলের আয়-ব্যয়, ইনভয়েস রশিদ ও ক্যাশবুক লেজার", ar: "نظام محاسبة متكامل للحسابات الجارية والميزانية" } },
      { text: { en: "Role & Permission Management", bn: "অধ্যক্ষ, শিক্ষক ও হিসাবরক্ষকদের আলাদা নিয়ন্ত্রণ ক্ষমতা", ar: "إسناد وتخصيص صلاحيات الوصول والسرية التامة" } },
      { text: { en: "Mobile Responsive Design", bn: "স্মার্টফোন, ট্যাব বা যেকোনো ছোট ডিসপ্লেতে শতভাগ রেসপন্সিভ", ar: "شاشات متلائمة تماماً مع الهواتف الذكية والأجهزة اللوحية" } }
    ]
  }[activeSolution];

  // Free Bonuses
  const posBonuses = {
    pos: [
      { text: { en: "Installation Support", bn: "ফ্রি ইনস্টলেশন লাইভ সাপোর্ট", ar: "تثبيت وضبط النظام على السيرفر مجاناً" } },
      { text: { en: "System Setup", bn: "পরিপূর্ণ সিস্টেম টেস্ট ও ইনিশিয়াল ক্যাটালগ সেটআপ", ar: "إعداد حسابات السداد الافتراضية" } },
      { text: { en: "Business Branding Integration", bn: "ইনভয়েসে ব্যবসার লোগো ও ব্র্যান্ডিং কাস্টমাইজেশন", ar: "دمج هويتك التجارية وتفاصيل الضريبة للفاتورة" } },
      { text: { en: "Invoice Design Customization", bn: "পেশাদার ইনভয়েস ডিজাইন (বাংলা ও ইংরেজি বোথ)", ar: "تخصيص كامل لقوالب الفواتير الحرارية والسندات" }, icon: Printer },
      { text: { en: "Staff Training Session", bn: "স্টাফ পরিচালনা ট্রেনিং এবং ভিডিও গাইডলাইন সেশন", ar: "جلسة فيديو تدريبية لخطوات الكاشير وطاقم العمل" } },
      { text: { en: "30 Days Technical Support", bn: "৩০ দিনের প্রিমিয়াম ডেডিকেটেড টেকনিক্যাল সাপোর্ট", ar: "دعم فني وتحديثات مستمرة لمدة 30 يوماً مجاناً" } }
    ],
    school: [
      { text: { en: "Installation & Setup", bn: "যেকোনো ক্লাউড হোস্টিং এ ফ্রি ইন্সটলেশন ও ব্যাকআপ কনফিগ", ar: "تهيئة الخادم السحابي بالكامل وتأمين النطاقات بنجاح" } },
      { text: { en: "School Branding Integration", bn: "প্রতিষ্ঠানের নিজস্ব লোগো ও ব্র্যান্ডিং সম্পূর্ণ ইন্টিগ্রেশন", ar: "دمج الهوية المدرسية المطبوعة وشعار المدرسة على المنصة" } },
      { text: { en: "Report Card Design", bn: "পেশাদার ও মডার্ন মার্কশিট বা একাডেমিক প্রোগ্রেসকার্ড ডিজাইন", ar: "تخصيص كامل لقالب شهادة الطالب والتقديرات" }, icon: Printer },
      { text: { en: "Admission Form Setup", bn: "অনলাইন ভর্তি ফর্ম কালেকশন ডাটাবেজ কাস্টমাইজেশন", ar: "صياغة وتعديل حقول الاستمارة الرقمية للتقديم الذاتي" } },
      { text: { en: "Basic Staff Training", bn: "শিক্ষক ও ডাটা এন্ট্রি অপারেটরদের জন্য স্পেশাল জুম লাইভ ট্রেনিং", ar: "تدريب المعلمين وموظفي القبول والتسجيل بورشة حصرية" } },
      { text: { en: "30 Days Technical Support", bn: "৩০ দিনের ডেডিকেটেড ভিআইপি সাপোর্ট ও ফিক্সড লাইভ চ্যাট সুবিধা", ar: "إتحاذ الضوابط وتوفير مساندة برمجية ومتابعة فنية 30 يوماً" } }
    ]
  }[activeSolution];

  // Why Choose Us Info
  const posWhyChoose = {
    pos: [
      { title: { en: "Easy To Use", bn: "সহজ অপারেশন প্যানেল", ar: "واجهات بسيطة بدون تعقيد" }, desc: { en: "Our checkout screen is built for raw speed. Training a junior cashier takes less than 20 minutes.", bn: "সহজ বিলিং কাউন্টার ডিজাইন যাতে যেকোনো অপারেটর সহজে দ্রুত প্রোডাক্ট স্ক্যান বা ইনপুট দিতে পারেন।", ar: "واجهة سريعة وخفيفة تضمن عدم تأخر طابور العملاء على صندوق المحاسب." } },
      { title: { en: "Fast Performance", bn: "আল্ট্রা ফাস্ট রেসপন্স স্পিড", ar: "أداء فائق الاستجابة وسرعة عالية" }, desc: { en: "No lag or caching spikes. Optimized SQLite or MySQL pipeline queries fetch products instantly.", bn: "ক্যাশ মেমোরির দুর্দান্ত ব্যবহার এবং লাইটওয়েট ডাটাবেস কুয়েরির ফলে প্রজেক্ট এক সেকেন্ডের মধ্যে লোড হয়।", ar: "قاعدة بيانات مطورة خصيصاً لإحضار آلاف المنتجات بلمح البصر دون بطء." } },
      { title: { en: "Secure Architecture", bn: "হ্যাকিং প্রতিরোধী আর্কিটেকচার", ar: "بنية برمجية معززة الأمان والخصوصية" }, desc: { en: "Strict CSRF protection and prepared statement binds stop any malicious remote code inject attempts.", bn: "নিরাপদ ডাটাবেস সিকিউরিটি যা সাইবার অ্যাটাক এবং অননুমোদিত এক্সেস থেকে আপনার ব্যবসায়িক তথ্য সুরক্ষিত রাখে।", ar: "تأمين شامل يحظر محاولات حقن قواعد البيانات أو استخراج السجلات الحسابية." } },
      { title: { en: "Business Automation", bn: "অটোমেটেড সেলস ওয়ার্কফ্লো", ar: "أتمتة ذكية متكاملة للمتاجر" }, desc: { en: "Autogenerate receipt PDFs, stock alerts, email notifications, and daily sales metrics summaries instantly.", bn: "অটোমেটিক ইনভয়েস পিডিএফ জেনারেটর, দৈনিক হিসাব মেল এবং স্টক অ্যালার্ট সিস্টেম কাজকে করে দারুণ সহজ।", ar: "إشعارات مخازن منخفضة وتوليد فوري لتقارير المبيعات دورياً." } },
      { title: { en: "Scalable For Growth", bn: "ভবিষ্যত ব্যবসা সম্প্রসারণ ফ্রেন্ডলি", ar: "قابل للتوسع تماشياً مع نمو الفروع" }, desc: { en: "Cloud syncing triggers allow adding new stores or wholesale hubs under a unified headquarter admin node.", bn: "নতুন ব্রাঞ্চ বা আউটলেট চালু করতে চাইলে খুব সহজে একই ক্লাউড ডাটাবেসে সেটিকে যুক্ত করা যাবে।", ar: "تأسيس بنية سحابية تتيح تفعيل فروع جديدة للمنشأة تحت إدارة موحدة." } },
      { title: { en: "Professional Support", bn: "ডেডিকেটেড ইঞ্জিনিয়ার সাপোর্ট", ar: "دعم ومتابعة هندسية احترافية" }, desc: { en: "Get directly connected with lead software engineering staff to debug layout or print node bugs.", bn: "ইনস্টলেশন থেকে শুরু করে প্রিন্টার কনফিগারেশন পর্যন্ত যেকোনো প্রয়োজনে আমাদের অভিজ্ঞ পস ইঞ্জিনিয়ারদের হেল্প পাবেন।", ar: "مهندسو تطوير نشطين يضمنون لك معالجة وإعداد طابعات الإيصالات." } },
      { title: { en: "Cloud Ready", bn: "সার্ভার ও হোস্টিং ক্লাউড রেডি", ar: "جاهز كلياً للاستضافة السحابية VPS" }, desc: { en: "Deploy on any standard custom VPS node or Linux hosting with effortless cPanel database connection.", bn: "যেকোনো ডেডিকেটেড ক্লাউড এবং ভিপিএস সার্ভারে খুব সহজে এটিকে ডিপ্লয় করে হাই ডেনসিটি স্পিড উপভোগ করুন।", ar: "إمكانية المزامنة السحابية وإتاحة متابعة أرقام المبيعات من أي جهاز ذكي بالمنزل." } },
      { title: { en: "Future Upgrade Support", bn: "ফ্রি লাইফটাইম আপডেট সুবিধা", ar: "دعم ترقيات الفيرجن مستقبلياً" }, desc: { en: "WebzoneBD is continually optimizing and hardening the core POS pipeline. Receive major upgrade releases free.", bn: "আমাদের ডেভেলপার টিম নিয়মিত পস মডিউলে নতুন আপডেট রিলিজ করে থাকে যা আজীবনের জন্য ফ্রি পাবেন।", ar: "فريق المبرمجين يحسن الكود باستمرار لتقديم الإضافات الجديدة والتحسينات." } }
    ],
    school: [
      { title: { en: "Easy School Administration", bn: "যুগান্তকারী স্কুল এডমিনিস্ট্রেশন", ar: "إدارة مدرسية مبسطة بمرونة" }, desc: { en: "Streamline daily operations like student admissions, class distribution schedules, timetables, and teacher lists.", bn: "শিক্ষার দৈনিক সামগ্রিক অফিশিয়াল কাজ, শিক্ষক ক্লাসের সময়সূচী এবং ফাইল জেনারেশন করুন এক ক্লিকে।", ar: "أتمتة الأعمال الإدارية كجدولة الحصص وحفظ ملفات الطلاب ومكافحة البيروقراطية." } },
      { title: { en: "Automated Attendance", bn: "অটোমেটেড ডিজিটাল হাজিরা ট্র্যাকার", ar: "رصد الحضور المدرسية التلقائي" }, desc: { en: "Take classes attendance with interactive bulk checkboxes, system immediately calculates student record rates.", bn: "একত্রে পুরো ক্লাসের হাজিরা নেওয়ার কাস্টম প্যানেল যা অভিভাবকের ফোনে ইন্ট্যান্ট নোটিফিকেশন পাঠাতে সক্ষম।", ar: "تسجيل حضور جماعي بلمسة مع إعداد تلقائي لنسب الغياب والتقييم الشهري." } },
      { title: { en: "Faster Fee Collection", bn: "স্মার্ট ফি কালেকশন মডিউল", ar: "تسريع تحصيل الرسوم والمدفوعات" }, desc: { en: "Generate unique student invoice codes. Support automated receipt layouts and late fine calculation logs.", bn: "বাৎসরিক স্টুডেন্ট টিউশন ফি এবং বকেয়ার কাস্টম রশিদ জেনারেট করুন এবং মোবাইল ব্যাংকিং এ কালেকশন ট্র্যাক করুন।", ar: "إصدار وتتبع إيصالات الرسوم المستحقة والتحفظ تلقائياً بإيداعات الخزينة." } },
      { title: { en: "Better Communication", bn: "অভিভাবকদের সাথে নিবিড় সংযোগ", ar: "قنوات تواصل ممتازة فورية" }, desc: { en: "Integrated custom SMS gateway API module sends student exam ranks, results, notices and holiday alerts.", bn: "অটোমেটিক কাস্টম বাল্ক এসএমএস গেটওয়ে যার সাহায্যে পরীক্ষার রেজাল্ট, জরুরি ছুটির খবর অভিভাবকদের ফোনে পৌঁছে যাবে।", ar: "رسائل موبايل فورية لأولياء الأمور بنتائج الفصول أو مواعيد الحضور الاستثنائي." } },
      { title: { en: "Centralized Data Management", bn: "নিরাপদ ক্লাউড ডাটাবেজ", ar: "توطيد مركزي لجميع البيانات" }, desc: { en: "All teachers files, students files, financials, test records are synchronized securely in high end databases.", bn: "অত্যন্ত শক্তিশালী ও এনক্রিপ্টেড ডাটাবেজ হাব যাতে আপনার প্রতিষ্ঠানের সকল তথ্য আজীবনের জন্য সুরক্ষিত থাকে।", ar: "حفظ ومزامنة كل حسابات الطلاب وعلامات الامتحانات على خوادم محمية دورياً." } },
      { title: { en: "Secure Student Records", bn: "ভূমিকা ভিত্তিক কড়া সিকিউরিটি", ar: "خصوصية وسرية السجلات الأكاديمية" }, desc: { en: "Prevent staff unauthorized marks edits. Set read/write locks securely for class teacher logins only.", bn: "অননুমোদিত স্টাফদের এক্সেস ব্লক করুন। প্রিন্সিপাল কাস্টম অনুমতি এক্সেস কনফিগার দিয়ে সুরক্ষিত রাখতে পারবেন।", ar: "منع التعديلات غير المصرح بها لعلامات الامتحانات بفضل توزيع الأدوار والصلاحيات." } },
      { title: { en: "Cloud Ready System", bn: "ক্লাউড হোস্টিং ও ভিপিএস সাপোর্ট", ar: "مرونة الاستضافة السحابية VPS" }, desc: { en: "Deploy on high frequency VPS or stable Linux server cPanel nodes. Setup continuous DB backup schedules.", bn: "যেকোনো ডেডিকেটেড ক্লাউড এবং ভিপিএস সার্ভারে খুব সহজে এটিকে ডিপ্লয় করে হাই ডেনসিটি স্পিড উপভোগ করুন।", ar: "إمكانية الاستضافة على أي VPS عالي السرعة مع برمجة نظام النسخ الاحتياطي التلقائي." } },
      { title: { en: "Future Upgrade Support", bn: "আজীবন ফ্রি সফটওয়্যার আপডেট সুবিধা", ar: "ترقيات برمجية مجانية بالكامل" }, desc: { en: "Receive newly optimized dashboard designs and newly engineered security patches for lifetime.", bn: "আমাদের ডেভেলপার টিম নিয়মিত স্কুল মডিউলে নতুন আপডেট রিলিজ করে থাকে যা আজীবনের জন্য ফ্রি পাবেন।", ar: "نظام مستمر التحديث لتقديم معايير الأمان والتوافقية مع الأنظمة والتشريعات الجديدة." } }
    ]
  }[activeSolution];

  // Benefits Matrices
  const posBenefits = {
    pos: [
      { text: { en: "Increase Productivity", bn: "উৎপাদনশীলতা ও ব্যবসার কর্মক্ষমতা বৃদ্ধি", ar: "مضاعفة إنتاجية طاقم الكاشير وموظفي المبيعات" }, icon: TrendingUp },
      { text: { en: "Reduce Manual Work", bn: "হাতে কলমে লেখার ঝামেলা কমায় এবং ভুল দূর করে", ar: "تقليص الأخطاء الحسابية والأوراق المالية المكتوبة ימין" }, icon: Settings2 },
      { text: { en: "Track Sales Instantly", bn: "যেকোনো স্থান থেকে ইনস্ট্যান্ট রিয়েল-টাইম বিক্রয় ট্র্যাকিং", ar: "تتبع والتحقق من حجم المبيعات الإجمالية بالثانية غيابياً" }, icon: DollarSign },
      { text: { en: "Manage Inventory Efficiently", bn: "ইনভেন্টরি পণ্য সহজে ট্র্যাকিং ও স্টক অপটিমাইজেশন", ar: "إدارة المخزونات بمرونة قصوى وتجنب نفاد البضائع الفجائي" }, icon: Package },
      { text: { en: "Generate Professional Reports", bn: "মুনাফা ও খরচের বিবরণী সহ প্রফেশনাল ব্যবসায়িক রিপোর্ট", ar: "إعداد تقارير مالية وتوريدية متميزة بنقرة للمحاسب" }, icon: PieChart },
      { text: { en: "Improve Business Control", bn: "ব্যবসার সঠিক তথ্য ভিত্তিক সিদ্ধান্ত গ্রহণ সহজ করে", ar: "بسط الرقابة الإدارية والتنبؤ بمسار مبيعات الفصول" }, icon: ShieldCheck }
    ],
    school: [
      { text: { en: "Reduce Manual Work", bn: "হাতে-কলমে লেখার ঝামেলা ও অতিরিক্ত রেজিস্টার খাতা ৯৮% কমায়", ar: "تقليص الأوراق الإدارية اليدوية وتخفيف أعباء الأرشفة" }, icon: ClipboardCheck },
      { text: { en: "Improve Academic Management", bn: "পরীক্ষা, রুটিন এবং রেজাল্ট প্রসেসিং এর গতি বহু গুণ বাড়ায়", ar: "تنظيم كلي للاختبارات والمستويات الأكاديمية وجدول العمل" }, icon: GraduationCap },
      { text: { en: "Track Student Performance", bn: "যেকোনো ছাত্রের মেধার অগ্রগতি ও ক্লাসের হাজিরা হিস্ট্রি ট্র্যাক", ar: "تتبع دقيق لمقاييس التفوق الدراسي والرسوب الفجائي" }, icon: TrendingUp },
      { text: { en: "Manage Teachers Efficiently", bn: "শিক্ষকদের ক্লাসের সময়সূচী ও স্যালারি ট্র্যাক ম্যানেজার", ar: "توزيع وإدارة المعلمين ومتابعة أداء الحصص بجاذبية" }, icon: Users },
      { text: { en: "Automate School Operations", bn: "ভর্তি আবেদন, মাসিক ফি ও জেনারেটেড রিপোর্ট অটোমেশন", ar: "التحصيل المالي الفوري وتحديث إعلانات المدرسة تلقائياً" }, icon: Settings2 },
      { text: { en: "Generate Reports Instantly", bn: "বাৎসরিক আয়ের খতিয়ান ও পরীক্ষার সম্মিলিত মেধা তালিকা প্রজেক্টর", ar: "استدعاء وبناء كشوف الأداء والتقارير الأكاديمية بلحظات" }, icon: PieChart }
    ]
  }[activeSolution];

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.phone) {
      triggerToast(language === 'bn' ? "দয়া করে আপনার নাম এবং মোবাইল নম্বর দিন।" : "Please provide your name and phone number to verify.");
      return;
    }
    setDemoSuccess(true);
    triggerToast(language === 'bn' ? "ডেমো রিকোয়েস্ট সফলভাবে রেজিস্টার হয়েছে!" : "Interactive sandbox demo credentials initialized.");
    setTimeout(() => {
      setDemoSuccess(false);
      setDemoModalOpen(false);
      setDemoForm({ name: '', phone: '', email: '', businessType: '', branches: '1', message: '' });
    }, 4500);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultForm.name || !consultForm.phone) {
      triggerToast(language === 'bn' ? "দয়া করে নাম ও কন্টাক্ট নম্বর ইনপুট দিন।" : "Kindly state your name and phone number.");
      return;
    }
    setConsultSuccess(true);
    triggerToast(language === 'bn' ? "ফ্রি কনসালটেশন সফলভাবে জমা হয়েছে!" : "Consultation request dispatched to WebzoneBD.");
    setTimeout(() => {
      setConsultSuccess(false);
      setConsultModalOpen(false);
      setConsultForm({ name: '', phone: '', email: '', notes: '' });
    }, 4500);
  };

  const executeWhatsAppDirect = (actionLabel: string) => {
    const defaultWhatsApp = activeSolution === 'pos'
      ? (language === 'bn' 
        ? `আসসালামু আলাইকুম WebzoneBD, আমি আপনার 'POS Software Development Solution' (৳২৫,০০০ অফার) সম্পর্কে জানতে এবং একটি লাইভ ডেমো সেশন বুক করতে আগ্রহী।`
        : language === 'ar'
        ? `السلام عليكم ويب زون لتكنولوجيا المعلومات، أود حجز موعد لنقاش واستعراض نظام كاشير POS لشركتي الحصري بسعر 25000 تاكا.`
        : `Assalamu Alaikum WebzoneBD, I am highly interested in purchasing your POS Software Development Solution package for my enterprise shop. Please share the sandbox demo credentials.`)
      : (language === 'bn'
        ? `আসসালামু আলাইকুম WebzoneBD, আমি আপনার 'School Management System Solution' (৳৪০,০০০ অফার) সম্পর্কে জানতে এবং একটি লাইভ ডেমো বুক করতে আগ্রহী।`
        : language === 'ar'
        ? `السلام عليكم ويب زون لتقنية المعلومات، نود مناقشة وحجز موعد لمشروع رقمنة مدرستي وربط نظام نظام لإدارة المدارس (School Management System) بسعر العرض 40,000 تاكا.`
        : `Assalamu Alaikum WebzoneBD, I want to digitize our educational institution with your School Management System Solution package (Offer price: ৳40,000). Please share the admin portal demo.`);
    
    const rootPhone = language === 'bn' ? '8801864000005' : '8801864000005'; // Saudi or global BD node redirection
    window.open(`https://wa.me/${rootPhone}?text=${encodeURIComponent(defaultWhatsApp)}`, '_blank', 'noopener,noreferrer');
  };

  // Custom Icon Helpers to prevent typing errors
  const FileCheck = () => <ClipboardCheck className="w-4 h-4 text-emerald-500" />;

  return (
    <div className="relative min-h-screen py-10 md:py-16 bg-neutral-50 dark:bg-slate-950 font-sans overflow-hidden" id="solutions-section">
      
      {/* Background radial soft lights */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-gradient-to-br from-[#06b6d4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* PREMIUM SOLUTION SELECTOR TAB - Glassmorphic futuristic segment controller */}
        <div className="flex justify-center" id="solutions-package-switcher">
          <div className="relative p-1.5 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl backdrop-blur-md flex items-center gap-1 sm:gap-2">
            
            {/* POS Segment */}
            <button
              onClick={() => setActiveSolution('pos')}
              className={`px-4 py-2.5 sm:px-6 sm:py-3 text-xs font-black font-sans uppercase rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeSolution === 'pos'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>POS Software</span>
            </button>

            {/* School Segment */}
            <button
              onClick={() => setActiveSolution('school')}
              className={`px-4 py-2.5 sm:px-6 sm:py-3 text-xs font-black font-sans uppercase rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeSolution === 'school'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>School Management System</span>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-black tracking-widest rounded-md uppercase ml-1 animate-pulse">
                New
              </span>
            </button>

          </div>
        </div>

        {/* UPPER TITLE HEADER BLOCK - Responsive state changes */}
        <div className="text-center max-w-4xl mx-auto space-y-5 px-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black font-mono tracking-widest bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-transparent text-blue-600 dark:text-cyan-400 border border-blue-500/20 active:scale-95 transition">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse fill-rose-500" />
            <span>{currentSol.badge[language]}</span>
          </span>
          <p className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] dark:text-[#06B6D4] font-mono leading-none">
            {currentSol.category[language]}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-neutral-900 dark:text-white leading-tight">
            {currentSol.packageName[language]}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-slate-300 leading-relaxed font-sans font-medium px-4">
            {currentSol.subtitle[language]}
          </p>
        </div>

        {/* STATISTICAL ANIMATED METRICS COUNTER GRID - Dynamically swaps POS / School metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4" id="premium-animated-statistics">
          
          {activeSolution === 'pos' ? (
            <>
              {/* POS STATS 1 */}
              <div className="relative group rounded-2xl bg-white/60 dark:bg-slate-900/40 p-6 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-md flex items-center gap-4 transition duration-300 hover:scale-[1.02] hover:border-blue-500/30">
                <div className="p-3.5 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-xl shrink-0">
                  <TrendingUp className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-slate-800 dark:text-white tracking-tight">
                    {salesCount}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                    {language === 'bn' ? 'আজকের পস লেনদেন ট্র্যাকার' : language === 'ar' ? 'المبيعات الجارية اليوم سحابياً' : 'Simulated Counter Sales Today'}
                  </p>
                </div>
              </div>

              {/* POS STATS 2 */}
              <div className="relative group rounded-2xl bg-white/60 dark:bg-slate-900/40 p-6 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-md flex items-center gap-4 transition duration-300 hover:scale-[1.02] hover:border-emerald-500/30">
                <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                  <Package className="w-6 h-6 text-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-slate-800 dark:text-white tracking-tight">
                    {stockLevel}%
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                    {language === 'bn' ? 'লাইভ স্টক পরিমাপক সিঙ্ক' : language === 'ar' ? 'تتبع مستوى المخازن النشطة' : 'Live Inventory Level Track'}
                  </p>
                </div>
              </div>

              {/* POS STATS 3 */}
              <div className="relative group rounded-2xl bg-white/60 dark:bg-slate-900/40 p-6 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-md flex items-center gap-4 transition duration-300 hover:scale-[1.02] hover:border-rose-500/30">
                <div className="p-3.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl shrink-0 font-extrabold text-lg">
                  {currencySymbol}
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-slate-800 dark:text-white tracking-tight">
                    {revenue.toLocaleString()}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                    {language === 'bn' ? 'লাইভ বিক্রিত হিসাব (BDT)' : language === 'ar' ? 'صافي الإيرادات المسجلة اليوم' : 'Secure Net Revenue Registered'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* SCHOOL STATS 1 */}
              <div className="relative group rounded-2xl bg-white/60 dark:bg-slate-900/40 p-6 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-md flex items-center gap-4 transition duration-300 hover:scale-[1.02] hover:border-indigo-500/30">
                <div className="p-3.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                  <Users className="w-6 h-6 animate-pulse text-indigo-500" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-slate-800 dark:text-white tracking-tight">
                    {studentCount}+
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                    {language === 'bn' ? 'মোট একটিভ শিক্ষার্থী ডাটাবেজ' : language === 'ar' ? 'إجمالي الطلاب النشطين بالمنصة' : 'Simulated Active Student Database'}
                  </p>
                </div>
              </div>

              {/* SCHOOL STATS 2 */}
              <div className="relative group rounded-2xl bg-white/60 dark:bg-slate-900/40 p-6 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-md flex items-center gap-4 transition duration-300 hover:scale-[1.02] hover:border-amber-500/30">
                <div className="p-3.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                  <ClipboardCheck className="w-6 h-6 text-amber-500 animate-bounce" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-slate-800 dark:text-white tracking-tight">
                    {admissionCount}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                    {language === 'bn' ? 'চলতি মাসে নতুন অনলাইন ভর্তি আবেদন' : language === 'ar' ? 'طلبات التسجيل الجديدة المستلمة' : 'New Online Admissions This Month'}
                  </p>
                </div>
              </div>

              {/* SCHOOL STATS 3 */}
              <div className="relative group rounded-2xl bg-white/60 dark:bg-slate-900/40 p-6 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-md flex items-center gap-4 transition duration-300 hover:scale-[1.02] hover:border-cyan-500/30">
                <div className="p-3.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl shrink-0">
                  <MessageSquare className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-slate-800 dark:text-white tracking-tight">
                    {smsCount.toLocaleString()}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                    {language === 'bn' ? 'ডিসপ্যাচড বাল্ক নোটিশ এসটিডি SMS' : language === 'ar' ? 'إجمالي الرسائل النصية SMS المرسلة' : 'Notice Board bulk SMS Dispatched'}
                  </p>
                </div>
              </div>
            </>
          )}

        </div>

        {/* PACKAGE DETAILS CORE BENTO PLATFORM - PREMIUM CARD & PRICING SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-11 items-start max-w-6xl mx-auto px-4" id="pos-premium-package-bento">
          
          {/* LEFT COLUMN: THE PREMIUM SAAS CARD VIEW */}
          <div className="lg:col-span-7 space-y-6 flex flex-col h-full justify-between">
            
            <div className="relative rounded-[28px] bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/95 shadow-xl p-6 sm:p-9 space-y-7 flex-1 backdrop-blur-lg">
              {/* Top Linear Gradient Accenter */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-[#06B6D4] to-transparent" />

              {/* Upper Header Header Section */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-slate-100 dark:border-slate-800/60 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-600 dark:text-cyan-400 px-3 py-1.5 rounded-lg font-black font-mono tracking-widest border border-blue-500/5">
                      {activeSolution === 'pos' ? 'Enterprise Business Node' : 'Education Digitization Node'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-md text-amber-600 font-black text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{sharedTexts.deliveryLabel} {currentSol.deliveryTimeline[language]}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm leading-relaxed font-semibold">
                  {currentSol.whoSubtitle[language]}
                </p>
              </div>

              {/* WHO IS THIS FOR? RETAILS OR SCHOOLS */}
              <div className="space-y-4 text-left">
                <p className="text-xs uppercase tracking-widest font-mono font-black text-slate-400 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  <span>{currentSol.perfectFor[language]}</span>
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {typesOfBusiness.map((biz, idx) => {
                    const BizIcon = biz.icon || School;
                    return (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-850 hover:border-emerald-500/30 transition duration-150 hover:scale-[1.01]"
                      >
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <BizIcon className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                          {language === 'bn' ? biz.name.bn : language === 'ar' ? biz.name.ar : biz.name.en}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CORE WHY CHOOSE THIS VALUE */}
              <div className="space-y-4 pt-4 border-t border-dashed border-slate-100 dark:border-slate-800/50">
                <h4 className="text-xs uppercase font-mono font-black text-slate-450 tracking-wider">
                  {sharedTexts.whyChooseTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {posWhyChoose.slice(0, 4).map((cho, idx) => (
                    <div key={idx} className="space-y-1.5 text-left bg-neutral-100 dark:bg-slate-950/20 p-3.5 rounded-xl border border-neutral-200/20 dark:border-slate-800">
                      <p className="text-xs font-black text-slate-800 dark:text-neutral-200 flex items-center gap-1.5 text-blue-600 dark:text-cyan-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{language === 'bn' ? cho.title.bn : language === 'ar' ? cho.title.ar : cho.title.en}</span>
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                        {language === 'bn' ? cho.desc.bn : language === 'ar' ? cho.desc.ar : cho.desc.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: PRICING SYSTEM & DELIVERABLES */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between space-y-6">
            
            {/* SPECIAL OFFERS CARD - High visual contrast dark container */}
            <div className="relative rounded-[24px] bg-slate-900 border border-slate-850 shadow-xl p-6 sm:p-8 text-white space-y-6">
              
              {/* Glimmer active effects */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full pointer-events-none blur-xl" />
              
              <div className="space-y-4 border-b border-slate-800 pb-5 text-left">
                <span className="px-2.5 py-1 text-[9px] uppercase font-mono font-black tracking-wider bg-rose-500 text-white rounded-md">
                  {sharedTexts.discount}
                </span>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  <span>WebzoneBD Digitization Deal</span>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse fill-amber-400" />
                </h3>
              </div>

              {/* Strike-through and Special offer Pricing Highlights */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-450 block">
                    {sharedTexts.regularPrice}
                  </span>
                  <p className="text-xl sm:text-2xl font-black line-through text-slate-500 font-mono mt-0.5">
                    {currentSol.regularPriceStr[language]}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-[#06B6D4] block">
                    {sharedTexts.offerPrice}
                  </span>
                  <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mt-0.5 animate-pulse">
                    {currentSol.offerPriceStr[language]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 font-black text-xs rounded-md border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" />
                  <span>{sharedTexts.youSave} {currentSol.savePriceStr[language]}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  One-time package. No monthly licensing fee.
                </span>
              </div>

              {/* FREE BONUS SECTION */}
              <div className="space-y-4 pt-5 border-t border-slate-800 text-left">
                <p className="text-xs font-black uppercase text-amber-400 tracking-widest font-mono flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-450 animate-bounce" />
                  <span>{sharedTexts.freeBonus}</span>
                </p>

                <div className="space-y-3">
                  {posBonuses.map((bonus, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="mt-0.5 text-amber-400 font-black">✔</span>
                      <span className="text-slate-300 font-semibold leading-relaxed">
                        {language === 'bn' ? bonus.text.bn : language === 'ar' ? bonus.text.ar : bonus.text.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* PACKAGE BENEFITS BLOCK - Highlighting the "KEY BENEFITS" */}
            <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6 text-left">
              <h4 className="text-xs uppercase font-mono font-black text-slate-450 tracking-wider mb-4 border-b border-dashed border-slate-100 dark:border-slate-800 pb-3">
                {sharedTexts.packageBenefits}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {posBenefits.map((ben, idx) => {
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5.5 h-5.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3.5]" />
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {language === 'bn' ? ben.text.bn : language === 'ar' ? ben.text.ar : ben.text.en}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>



        {/* PREMIUM CALL TO ACTION BLOCK */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#020617] text-white p-8 md:p-14 text-center border border-slate-850 max-w-5xl mx-auto px-4 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/15 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 rounded-full blur-l pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 mb-1">
              <Award className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white mb-2 leading-tight">
              {currentSol.ctaTitle[language]}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-310 text-slate-300 leading-relaxed font-sans font-medium px-4">
              {currentSol.ctaSubtitle[language]}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xs rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-cyan-300 animate-pulse shrink-0" />
                <span>{sharedTexts.btnDemo}</span>
              </button>

              <button
                onClick={() => setConsultModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{sharedTexts.btnConsult}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => executeWhatsAppDirect("Direct Purchase Conversation")}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Phone className="w-4 h-4 fill-white shrink-0" />
                <span>{sharedTexts.btnWhatsApp}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* RENDER REQUEST DEMO PORTAL POPUP MODEL */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col z-10"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 absolute top-0 left-0" />

              <div className="flex items-start justify-between pb-3 border-b border-light-200 dark:border-slate-800/60 mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'ফ্রি লাইভ ডেমো এক্সেস পোর্টাল' : activeSolution === 'pos' ? 'Request POS Interactive Demo' : 'Request School MS Trial Credentials'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                    Start playing inside our high performance sandbox credentials.
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="p-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-850 text-xs font-mono font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {demoSuccess ? (
                <div className="py-8 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                     <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'অন-বোর্ডিং লিঙ্ক প্রস্তুত!' : 'Sandbox Token Calculated!'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans max-w-sm">
                    {sharedTexts.successDemo}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 pl-1">
                  
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                      placeholder="e.g. Imran Hasan"
                      className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        WhatsApp Call Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                        placeholder="e.g. +8801864000005"
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                        placeholder="e.g. imran@school.com"
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        {activeSolution === 'pos' ? 'Your Shop/Store Category' : 'Institution Type'}
                      </label>
                      <select
                        value={demoForm.businessType}
                        onChange={(e) => setDemoForm({...demoForm, businessType: e.target.value})}
                        className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-100 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none"
                      >
                        {activeSolution === 'pos' ? (
                          <>
                            <option value="Super Shop">Super Shop / Retail Outlet</option>
                            <option value="Restaurant">Restaurant or Food Cafe</option>
                            <option value="Pharmacy">Pharmacy / Drugstore</option>
                            <option value="Fashion Outlets">Fashion Boutique</option>
                            <option value="Wholesaler">Wholesale Business</option>
                          </>
                        ) : (
                          <>
                            <option value="General School">High School / KG School</option>
                            <option value="College">College / Technical Inst.</option>
                            <option value="Madrasa">Madrasa / Quranic Center</option>
                            <option value="Coaching Center">Coaching & Tuition</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        {activeSolution === 'pos' ? 'Active Cash Counters' : 'Estimated Students'}
                      </label>
                      <select
                        value={demoForm.branches}
                        onChange={(e) => setDemoForm({...demoForm, branches: e.target.value})}
                        className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-100 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none"
                      >
                        {activeSolution === 'pos' ? (
                          <>
                            <option value="1">1 Single Billing node</option>
                            <option value="2-4">2 - 4 Registers linked</option>
                            <option value="5+">5+ Enterprise multiple nodes</option>
                          </>
                        ) : (
                          <>
                            <option value="under-300">Under 300 pupils</option>
                            <option value="300-1000">300 - 1,000 pupils</option>
                            <option value="1000+">1000+ Multi-shift school</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      Special requirements or current operational barriers
                    </label>
                    <textarea
                      rows={2}
                      value={demoForm.message}
                      onChange={(e) => setDemoForm({...demoForm, message: e.target.value})}
                      placeholder={activeSolution === 'pos' 
                        ? "e.g. Need thermal printer mapping, barcode excel imports..." 
                        : "e.g. Need monthly tuition bill alerts via SMS API, report card layouts..."}
                      className="w-full text-xs px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDemoModalOpen(false)}
                      className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                    >
                      Retrieve Sandbox Credentials
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONSTRUCT RENDER CONSULTATION POPUP MODEL */}
      <AnimatePresence>
        {consultModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConsultModalOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col z-10"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-400 absolute top-0 left-0" />

              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60 mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'ফ্রি আইটি কনসালটেশন' : 'Schedule Setup Audit & Layout Consultation'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                    Consult directly with senior solutions engineers at WebzoneBD IT Solution.
                  </p>
                </div>
                <button
                  onClick={() => setConsultModalOpen(false)}
                  className="p-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-xs font-mono font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {consultSuccess ? (
                <div className="py-8 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                     <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'কনসালটেশন রিকোয়েস্ট সেভড!' : 'Consultation Scheduled!'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans max-w-sm">
                    {sharedTexts.successConsult}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 pl-1">
                  
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={consultForm.name}
                      onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                      placeholder="e.g. Imran Hasan"
                      className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        WhatsApp Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={consultForm.phone}
                        onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
                        placeholder="e.g. +8801864000005"
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={consultForm.email}
                        onChange={(e) => setConsultForm({...consultForm, email: e.target.value})}
                        placeholder="e.g. business@example.com"
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      Tell us about your business goals or layout specs
                    </label>
                    <textarea
                      rows={3}
                      value={consultForm.notes}
                      onChange={(e) => setConsultForm({...consultForm, notes: e.target.value})}
                      placeholder={activeSolution === 'pos' 
                        ? "Let us know your register layout specs or custom thermal printing hardware..." 
                        : "Let us know the estimated students list size, shifting schedules, or custom SMS requirements..."}
                      className="w-full text-xs px-3 py-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultModalOpen(false)}
                      className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md"
                    >
                      Submit Consultation Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
