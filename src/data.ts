import { Product, Service, BlogPost, PortfolioItem, SystemConfig, Coupon } from './types';

export const systemConfigDefault: SystemConfig = {
  siteName: "WebzoneBD IT Solution",
  siteTitle: "WebzoneBD IT Solution - Web Development & Digital Marketing Agency",
  metaDesc: "Get premium web themes, Laravel scripts, web hosting, domain registration, and high-performance SEO and Digital Marketing services from WebzoneBD.",
  googleAnalyticsId: "G-WEBZONEBD2026",
  whatsappNumber: "+966570511931",
  bangladeshContact: "+8801864000005",
  supportEmail: "info@webzonebd.com",
  autoApproveTickets: true,
  themePrimaryColor: "#7C3AED",
  themeSecondaryColor: "#A855F7",
  themeGradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)",
  themeBorderRadius: "20px"
};

export const sampleCoupons: Coupon[] = [
  { code: "WEBZONE20", discountPercent: 20, expiryDate: "2026-12-31", usageCount: 12 },
  { code: "EID2026", discountPercent: 15, expiryDate: "2026-06-30", usageCount: 8 },
  { code: "WELCOME", discountPercent: 10, expiryDate: "2026-12-31", usageCount: 4 }
];

export const sampleProducts: Product[] = [
  {
    id: "prod-1",
    name: "ZoneCart - Multi-Vendor Laravel E-commerce Script",
    nameBn: "জোনকার্ট - মাল্টি-ভেন্ডর লারাভেল ই-কমার্স স্ক্রিপ্ট",
    nameAr: "ZoneCart - سكربت لارافيل للتجارة الإلكترونية متعدد التجار",
    category: "laravel",
    price: 49,
    discountPrice: 29,
    rating: 4.9,
    reviewsCount: 42,
    description: "ZoneCart is a highly optimized, fully responsive multi-vendor e-commerce platform built with Laravel latest version. Includes powerful admin panel, vendor management, multiple payment gateways, and order SMS notifications.",
    descriptionBn: "জোনকার্ট হচ্ছে লারাভেল দিয়ে তৈরি একটি হাই-পারফরম্যান্স মাল্টি-ভেন্ডর ই-কমার্স স্ক্রিপ্ট। এতে রয়েছে অ্যাডমিন প্যানেল, ভেন্ডর ম্যানেজমেন্ট এবং পেমেন্ট গেটওয়ে ইন্টিগ্রেশন।",
    descriptionAr: "ZoneCart هي منصة تجارة إلكترونية متعددة التجار متطورة ومحسنة للغاية تم إنشاؤها باستخدام أحدث إصدار من Laravel. تتضمن لوحة تحكم قوية للمسؤول، وإدارة البائعين، وبوابات دفع متعددة.",
    features: [
      "Laravel 11 & Tailwind CSS Structure",
      "SSLCommerz, bKash, Stripe, PayPal integrated",
      "Robust Admin, Vendor, and Customer Dashboards",
      "SEO Friendly Slug & Structured Schema Markup",
      "Fast API for Android/iOS mobile application support"
    ],
    featuresBn: [
      "লারাভেল ১১ এবং টেইলউইন্ড সিএসএস আর্কিটেকচার",
      "এসএসএলকমার্জ, বিকাশ, স্ট্রাইপ এবং পে-পাল যুক্ত করা",
      "অ্যাডমিন, ভেন্ডর এবং কাস্টমার ড্যাশবোর্ড",
      "এসইও ফ্রেন্ডলি ইউআরএল এবং স্কিমা মার্কআপ",
      "মোবাইল অ্যাপের জন্য ফাস্ট এপিআই সাপোর্ট"
    ],
    featuresAr: [
      "هيكل Laravel 11 و Tailwind CSS",
      "بوابات مدمجة: bKash و SSLCommerz و Stripe و PayPal",
      "لوحات تحكم متطورة للمسؤول والبائعين والعملاء",
      "روابط صديقة لمحركات البحث (SEO) ومخطط هيكلي",
      "واجهة برمجة تطبيقات سريعة لدعم تطبيقات الأجهزة المحمولة"
    ],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://demo.webzonebd.com/zonecart",
    downloadUrl: "https://webzonebd.com/downloads/zonecart-v2.zip",
    tags: ["Laravel", "E-commerce", "Multi-vendor", "Php Script"],
    views: 1240
  },
  {
    id: "prod-2",
    name: "WebNews - Premium News & Magazine WordPress Theme",
    nameBn: "ওয়েবনিউজ - প্রিমিয়াম নিউজ পোর্টাল ওয়ার্ডপ্রেস থিম",
    nameAr: "WebNews - قالب ووردبريس مميز للأخبار والمجلات",
    category: "wordpress",
    price: 39,
    discountPrice: 24,
    rating: 4.8,
    reviewsCount: 28,
    description: "WebNews is a premium, elementor-powered news and responsive magazine WordPress theme. It loads in under 1 second, fully optimized for Google AdSense and social integrations. One-click demo install.",
    descriptionBn: "ওয়েবনিউজ হলো একটি এলিমেন্টর দ্বারা চালিত প্রিমিয়াম নিউজ পোর্টাল ওয়ার্ডপ্রেস থিম। এটি গুগলের অ্যাডসেন্স ও সোশাল মিডিয়া ফ্রেন্ডলি।",
    descriptionAr: "WebNews هو قالب ووردبريس متميز للأخبار والمجلات يعمل بواسطة Elementor. محمل في أقل من ثانية واحدة، ومتوافق بالكامل مع جوجل أدسنس والمشاركة الاجتماعية.",
    features: [
      "Ready-to-use custom news layouts",
      "Optimized Google AdSense spaces and CTR",
      "Super fast loading under 1 second",
      "One-click demo install capabilities"
    ],
    featuresBn: [
      "রেডি-টু-ইউজ নিউজ লেআউট ও কাস্টম উইজেট",
      "গুগল অ্যাডসেন্সের জন্য মানসম্মত বিজ্ঞাপন প্লেসমেন্ট",
      "১ সেকেন্ডের নিচে সুপার ফাস্ট লোডিং স্পিড",
      "এক ক্লিকেই ডেমো ইমপোর্ট করার সুবিধা"
    ],
    featuresAr: [
      "تنسيقات أخبار مخصصة وجاهزة تماماً للاستخدام",
      "أماكن إعلانات محسّنة بالكامل لجوجل أدسنس",
      "سرعة تحميل فائقة في أقل من ثانية واحدة",
      "إمكانية تثبيت الديمو بضغطة زر واحدة تلقائياً"
    ],
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://demo.webzonebd.com/webnews",
    downloadUrl: "https://webzonebd.com/downloads/webnews-wp-theme.zip",
    tags: ["WordPress", "News", "Magazine", "Elementor Theme"],
    views: 940
  },
  {
    id: "prod-3",
    name: "BloggerSpot - Responsive Modern Personal Blogger Template",
    nameBn: "ব্লগারস্পট - রেসপনসিভ আধুনিক পার্সোনাল ব্লগার টেমপ্লেট",
    nameAr: "BloggerSpot - قالب بلوجر شخصي وعصري متجاوب",
    category: "blogger",
    price: 15,
    discountPrice: 9,
    rating: 4.7,
    reviewsCount: 33,
    description: "BloggerSpot is a premium UI-focused, clean portfolio and personal blog template for Google Blogspot. Extremely lightweight, lightweight JS loads instantly on mobile 3G/4G connections.",
    descriptionBn: "ব্লগারস্পট হলো ব্লগার প্ল্যাটফর্মের জন্য একটি প্রিমিয়াম থিম। এটি খুবই ফ্রেন্ডলি এবং ৩জি/৪জি নেটওয়ার্কেও দ্রুত লোড হতে সক্ষম।",
    descriptionAr: "قالب BloggerSpot هو قالب بلوجر احترافي مميز ومدونة شخصية نظيفة تركز على واجهة المستخدم لـ Blogspot من Google. خفيف الوزن للغاية ويتحمل على الفور.",
    features: [
      "Layout v3 with Custom Widgets support",
      "Fully Responsive Grid & Clean Typography",
      "SEO Meta Tags & Schema Configured",
      "Fast dark-mode toggle action button",
      "Structured FAQ and breadcrumbs widgets"
    ],
    featuresBn: [
      "কাস্টম উইজেট সুবিধা সহ লেআউট ভার্সন ৩",
      "ফুল রেসপনসিভ গ্রিড এবং প্রিমিয়াম টাইপোগ্রাফি",
      "এসইও মেটা ট্যাগ এবং স্কিমা কনফিগার করা",
      "সহজ ডার্ক মোড টগল অ্যাকশন বাটন",
      "স্ট্রাকচার্ড এফএকিউ এবং ব্রেডক্রাম্বস সুবিধা"
    ],
    featuresAr: [
      "مخطط الإصدار 3 مع دعم الأدوات المخصصة",
      "شبكة متجاوبة بالكامل وتنسيق خطوط نظيف",
      "مهيأ بالكامل لـ SEO والكلمات الدلالية والمخطط الهيكلي",
      "زر تبديل سريع للوضع الداكن والسلس",
      "مبني فيه نظام الأسئلة الشائعة وعناصر التنقل"
    ],
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://demo.webzonebd.com/bloggerspot",
    downloadUrl: "https://webzonebd.com/downloads/bloggerspot-blogger.xml",
    tags: ["Blogger", "Blogspot", "Responsive Theme", "Blogging"],
    views: 1560
  },
  {
    id: "prod-4",
    name: "SchoolZone - Ultimate School/College Management System PHP",
    nameBn: "স্কুলজোন - স্কুল ও কলেজ ব্যবস্থাপনা সিস্টেম পিএইচপি স্ক্রিপ্ট",
    nameAr: "SchoolZone - نظام إدارة المدارس والكليات المتكامل PHP",
    category: "php",
    price: 59,
    discountPrice: 35,
    rating: 4.95,
    reviewsCount: 56,
    description: "SchoolZone is a complete PHP solution for educational institutes. Covers student databases, marks management, dynamic fee collection, online classes, parent portals, and live SMS reporting tools.",
    descriptionBn: "স্কুলজোন হলো শিক্ষা প্রতিষ্ঠানের জন্য পূর্ণাঙ্গ পিএইচপি স্ক্রিপ্ট। এতে স্টুডেন্ট ডাটাবেজ, রেজাল্ট শিট, ফি ড্যাশবোর্ড এবং অভিভাবক পোর্টাল রয়েছে।",
    descriptionAr: "SchoolZone هو نظام PHP متكامل للمؤسسات التعليمية. يغطي قواعد بيانات الطلاب، إدارة الدرجات، تحصيل الرسوم إلكترونيًا، الفصول الدراسية عبر الإنترنت، وبوابات الآباء.",
    features: [
      "Student, Teacher, Admin, Parent multidimensional panels",
      "Online exam structure with auto grading",
      "Accounts & Dynamic Expense tracker built",
      "Dynamic SMS notifications to mobile numbers",
      "Built with high security against SQL injection & CSRF"
    ],
    featuresBn: [
      "শিক্ষার্থী, শিক্ষক, অ্যাডমিন ও অভিভাবক আলাদা প্যানেল",
      "অনলাইন পরীক্ষার সিস্টেম এবং অটো গ্রেডিং",
      "একাউন্টস এবং দৈনিক খরচের হিসাব রাখার সফটওয়্যার",
      "মোবাইলে ডাইনামিক অটো এসএমএস অ্যালার্ট সুবিধা",
      "এসকিউএল ইনজেকশন এবং সিএসআরএফ থেকে সম্পূর্ণ নিরাপদ"
    ],
    featuresAr: [
      "لوحات تحكم متعددة الأبعاد للطلاب والمعلمين والآباء والمسؤولين",
      "نظام اختبارات متكامل ونظام تصحيح تلقائي",
      "نظام حسابات وتتبع النفقات اليومية والديناميكية",
      "إشعارات تلقائية عبر الرسائل القصيرة لجميع الهواتف",
      "حماية قصوى ضد تزوير الطلبات وثغرات SQL Injection"
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://demo.webzonebd.com/schoolzone",
    downloadUrl: "https://webzonebd.com/downloads/schoolzone-v1.zip",
    tags: ["PHP Script", "School Management", "Education System", "Portal"],
    views: 1120
  }
];

export const sampleServices: Service[] = [
  {
    id: "srv-web",
    title: "Website & Core Software Development",
    titleBn: "ওয়েবসাইট ও কাস্টম সফটওয়্যার ডেভেলপমেন্ট",
    titleAr: "تطوير مواقع الويب والبرمجيات المخصصة",
    iconName: "Globe",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "High-end corporate, agency, e-commerce, and enterprise web applications with solid PHP & Node structures.",
    shortDescriptionBn: "লারাভেল, রিয়্যাক্ট এবং নোড জেএস এর মাধ্যমে প্রিমিয়াম ই-কমার্স ও কর্পোরেট ওয়েবসাইট ডেভেলপমেন্ট করিয়ে নিন।",
    shortDescriptionAr: "مواقع ومنصات معقدة لشركات ومتاجر إلكترونية وتطبيقات مخصصة تعتمد على بنية PHP و Node قوية ومحسنة للعمل الشاق.",
    fullDescription: "From dynamic custom script design to complex multi-vendor digital stores, we build web properties optimized for security, speeds, and long-term business scale. Our frameworks of choice: Laravel, React, and robust APIs.",
    fullDescriptionBn: "ডাইনামিক কাস্টম প্রজেক্ট থেকে শুরু করে জটিল মাল্টি-ভেন্ডর ডিজিটাল স্টোর ও কর্পোরেট পোর্টাল – আমরা তৈরি করি দারুণ ডিজাইনে যা সিকিউরিটি, স্পিড এবং ভবিষ্যতের টেকনিক্যাল সাপোর্টে সেরা।",
    fullDescriptionAr: "من تصميم البرامج البسيطة والسكربتات إلى الأسواق الضخمة متعددة التجار، نقوم ببناء مواقع ومنصات محسنة للغاية لتكون آمنة وسريعة ومتوافقة مع تطلعاتك. الأنظمة المفضلة لدينا: Laravel و React.",
    startingPrice: 199,
    features: ["Custom tailored design patterns", "100% security against vulnerability exploits", "Optimized mobile performance scoring", "Free 1 Year hosting + backup features"],
    featuresBn: ["ক্লায়েন্ট পছন্দের কাস্টম ডিজাইন প্যাটার্ন", "১০০% সিকিউরড কোডিং এবং হ্যাকিং প্রোটেকশন", "মোবাইল ডিভাইসে ফাস্ট পেজ স্পিড লোড", "১ বছরের ফ্রি ডোমেইন এবং প্রিমিয়াম হোস্টিং"],
    featuresAr: ["أنماط وتصاميم مخصصة تماماً لعملك", "حماية 100٪ ضد جميع الثغرات الأمنية المعروفة", "أداء محسّن بالكامل للأجهزة المحمابة", "استضافة مجانية لمدة عام مع ميزات النسخ الاحتياطي التلقائي"]
  },
  {
    id: "srv-seo",
    title: "Premium Search Engine Optimization (SEO)",
    titleBn: "প্রিমিয়াম সার্চ ইঞ্জিন অপ্টিমাইজেশন (এসইও)",
    titleAr: "خدمات تحسين محركات البحث المميزة (SEO)",
    iconName: "Search",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Drive consistent unpaid Google traffic with deep technical audit, page-speed tweaks, and white-hat link building.",
    shortDescriptionBn: "গুগলের প্রথম পেজে আপনার ব্র্যান্ডের র‍্যাংক নিয়ে আসুন টেকনিক্যাল ব্যাকলিংক এবং কিওয়ার্ড রিসার্চের মাধ্যমে।",
    shortDescriptionAr: "اجذب زيارات حقيقية مستمرة من محرك البحث جوجل من خلال التدقيق التقني، وتحسين السرعة، وبناء روابط باك لينك آمنة.",
    fullDescription: "We don't buy generic traffic. We target buyers by mapping intent search key terms, running rich responsive optimization audits, and doing custom outreach directory listing link campaigns.",
    fullDescriptionBn: "আমরা সাধারণ ট্রাফিক এনে কাজ শেষ করি না। আমরা সরাসরি আপনার ক্রেতাদের টার্গেট করে কিওয়ার্ড নিয়ে কাজ করি, টেকনিক্যাল অডিট ঠিক করি এবং মানসম্মত ব্যাকলিংক তৈরি করে র‍্যাংক উন্নত করি।",
    fullDescriptionAr: "نحن لا نشتري زيارات وهمية. نستهدف المشترين الحقيقيين من خلال استكشاف نية الكلمات الدلالية، وتنفيذ تعديلات تقنية، والحصول على باك لينك عالي الجودة لرفع الهوتة.",
    startingPrice: 99,
    features: ["Deep Keyword Intent Mapping Search", "Technical Speed and Meta Fix Campaigns", "Premium DA 50+ Manual Safe Link Building", "Weekly Competitors Track Metrics Reports"],
    featuresBn: ["গভীর কিওয়ার্ড টার্গেটিং অ্যানালিসিস", "টেকনিক্যাল স্পিড এবং মেটা ক্যাশ ফিক্স", "হাই অথরিটি ডিএ ম্যানুয়াল সেফ লিঙ্ক বিল্ডিং", "সাপ্তাহিক প্রতিযোগী ট্র্যাক রিপোর্ট"],
    featuresAr: ["تحليل نية الكلمات الدلالية العميقة", "حملات تحسين السرعة الفنية والوسائط", "بناء روابط يدوي آمن عالي السلطة", "تقارير أسبوعية لتتبع المنافسين"]
  }
];

export const samplePortfolio: PortfolioItem[] = [
  {
    id: "port-web-1",
    title: "PrimeGroup corporate portal and headless workspace",
    titleBn: "প্রাইমগ্রুপ কর্পোরেট পোর্টাল এবং হেডলেস ওয়ার্কস্পেস",
    titleAr: "بوابة شركة برايم جروب الموحدة ومساحة العمل الرقمية السحابية",
    category: "web",
    categoryLabel: "Web Development",
    categoryLabelBn: "ওয়েবসাইট উন্নয়ন",
    categoryLabelAr: "تطوير الويب",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    client: "Prime Group BD Ltd.",
    duration: "3 Weeks",
    demoUrl: "https://primegroup.example",
    description: "A state-of-the-art corporate website showcasing institutional services, custom contact desks, and multi-regional translation setups with dynamic loading.",
    descriptionBn: "একটি আধুনিক কর্পোরেট ওয়েবসাইট যা প্রাতিষ্ঠানিক সেবা, যোগাযোগের জন্য বিশেষ ফর্ম এবং দ্রুত গতিতে ভাষা পরিবর্তন কাস্টমাইজেশন ফিচার সম্বলিত।",
    descriptionAr: "موقع ويب احترافي ومتطور للشركات الكبرى لعرض الخدمات المؤسسية، مع بوابات اتصال مخصصة، وإعدادات ترجمة ديناميكية متعددة المناطق الجغرافية.",
    projectScope: "Engineer an enterprise-grade digital identity for Prime Group BD Ltd. with high-speed rendering, multi-language localization (EN, BN, AR), automated quotation generator, and zero-downtime global CDN distribution.",
    projectScopeBn: "প্রাইম গ্রুপ বিডি এর জন্য হাই-স্পিড রেন্ডারিং, মাল্টি-ল্যাঙ্গুয়েজ (ইংরেজি, বাংলা, আরবি) লোকালাইজেশন, অটোমেটেড কোটেশন জেনারেটর এবং গ্লোবাল সিডিএন সহ একটি এন্টারপ্রাইজ কর্পোরেট পোর্টাল তৈরি করা।",
    projectScopeAr: "هندسة هوية رقمية مؤسسية لشركة برايم جروب ليمتد تتميز برندر فائق السرعة، ودعم كامل للغات الثلاث، ومحرك حساب تكلفة آلي، وتوزيع سحابي عالمي بلا انقطاع.",
    challenge: "The legacy client website suffered from slow page loads (4.2s), fragmented branding, lack of mobile responsiveness, and manual quote processing causing missed customer inquiries.",
    challengeBn: "ক্লায়েন্টের আগের ওয়েবসাইটটি অত্যন্ত ধীরগতির (৪.২ সেকেন্ড) ছিল, মোবাইল উপযোগী ছিল না এবং ম্যানুয়াল কোটেশন প্রসেসিং এর কারণে নিয়মিত ক্লায়েন্ট ইনকোয়ারি মিস হতো।",
    challengeAr: "كان الموقع القديم يعاني من بطء التحميل (4.2 ثانية)، وعدم توافق الشاشات الذكية، ومعالجة المبيعات يدوياً مما أدى لفقدان فرس تجارية حقيقية.",
    solution: "Designed a clean React & Tailwind CSS web architecture paired with Framer Motion layout animations, instant quotation calculator engine, and multi-region edge server deployment.",
    solutionBn: "রিয়েক্ট ও টেইলউইন্ড সিএসএস দিয়ে একটি ক্লিন আর্কিটেকচার তৈরি করা হয়, সাথে কোটেশন ক্যালকুলেটর ইঞ্জিন এবং মাল্টি-রিজিয়ন এজ সার্ভার সিঙ্ক যুক্ত করা হয়।",
    solutionAr: "تم بناء موقع ويب حديث باستخدام تقنيات React و Tailwind CSS مع محرك تفاعلي لحساب الفواتير الفورية وإدارتها عبر خوادم سحابية موزعة.",
    techStack: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Cloudflare CDN"],
    features: ["Fully Responsive Layout", "Light/Dark Mode Sync", "Quotation Cost Calculation Engine", "Multi-Currency Matrix", "Interactive Inquiry Desk"],
    featuresBn: ["১০০% রেস্পন্সিভ মোবাইল ফ্রেন্ডলি", "লাইট ও ডার্ক মুড অটো সিঙ্ক", "বাজেট এবং কোটেশন ক্যালকুলেশন ইঞ্জিন", "মাল্টি-কারেন্সি ম্যাট্রিক্স", "ইন্টারেক্টিভ কন্টাক্ট ডেক্স"],
    featuresAr: ["تصميم متجاوب بالكامل وتفاعلي", "مزامنة تفاعلية للوضع المظلم والمضيء", "محرك حساب تكلفة الخدمة الفورية", "مصفوفة للعملات المزدوجة", "مكتب استفسارات تفاعلي"],
    results: [{ label: "Page Load Speed", value: "0.8s" }, { label: "Client Inquiries", value: "+150%" }, { label: "Mobile Bounce Rate", value: "-62%" }],
    resultsBn: [{ label: "পেজ লোড স্পীড", value: "০.৮ সেকেন্ড" }, { label: "ক্লায়েন্ট ইনকোয়ারি", value: "+১৫০%" }, { label: "মোবাইল ড্রপ আউট", value: "-৬২%" }],
    resultsAr: [{ label: "سرعة تحميل الصفحة", value: "0.8 ثانية" }, { label: "استفسارات العملاء", value: "+150%" }, { label: "معدل الارتداد بالهاتف", value: "-62%" }],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    galleryImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "WebzoneBD built our enterprise identity in less than three weeks. Speed is immaculate and our conversion rates increased by 150%. Their attention to lightweight rendering layouts is outstanding.",
      quoteBn: "ওয়েবজোনবিডি তিন সপ্তাহেরও কম সময়ে আমাদের কর্পোরেট পোর্টাল ডেভেলপ করেছে। পেজ স্পিড এককথায় অসাধারণ এবং কাস্টমার ইনকোয়ারি প্রায় ১৫০% বৃদ্ধি পেয়েছে।",
      quoteAr: "قامت ويب زون بي دي ببناء واجهتنا المؤسسية في أقل من ثلاثة أسابيع. سرعة تصفح مذهلة وتضاعف استفسارات العملاء بنسبة 150%. الدعم الفني لديهم متميز حقاً.",
      author: "Nayeem Islam",
      role: "Chief Information Officer",
      company: "Prime Group BD Ltd.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    featured: true
  },
  {
    id: "port-news-1",
    title: "ProthomBarta - High-speed Next.js News Portal with Google Ads",
    titleBn: "প্রথমবার্তা - হাই-স্পিড নেক্সট-জেএস নিউজ পোর্টাল ও গুগল এডস",
    titleAr: "ProthomBarta - بوابة إخبارية فائقة السرعة مع دمج إعلانات جوجل أدسنس",
    category: "news",
    categoryLabel: "News Portal",
    categoryLabelBn: "নিউজ পোর্টাল",
    categoryLabelAr: "بوابة الأخبار",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    client: "Prothom Barta Media Ltd.",
    duration: "1.5 Months",
    demoUrl: "https://news.prothombarta.example",
    description: "An optimized media platform built with headless server-side rendering, featuring real-time local sports desks and intelligent ad placeholder zones.",
    descriptionBn: "হেডলেস সার্ভার-সাইড রেন্ডারিং সহ তৈরি একটি অপ্টিমাইজড মিডিয়া প্ল্যাটফর্ম, যেখানে রিয়েল-টাইম খবর, স্পোর্টস ডেস্ক এবং বিজ্ঞাপন স্থাপনের জন্য বিশেষ জোন রয়েছে।",
    descriptionAr: "منصة إعلامية متطورة ومحسنة للغاية تم إنشاؤها باستخدام نظام الرندر من جهة السيرفر، وتتميز بنشرات إخبارية حية ومناطق ذكية لعرض الإعلانات المستهدفة.",
    projectScope: "Architect a scalable news publishing portal capable of handling over 2.4 million monthly readers, with real-time breaking news tickers, automated category feeds, and strategic Google AdSense monetization.",
    projectScopeBn: "মাসিক ২৪ লাখের বেশি পাঠকের চাপ সহ্য করতে সক্ষম একটি আধুনিক নিউজ পোর্টাল তৈরি করা, যেখানে ব্রেকিং নিউজ নোটিফিকেশন, ক্যাটাগরি ফিড এবং গুগল অ্যাডসেন্স বিজ্ঞাপনী জোন রয়েছে।",
    projectScopeAr: "بناء بوابة نشر إخبارية قادرة على خدمة أكثر من 2.4 مليون زائر شهرياً مع شريط أخبار عاجل، وتغذية برمجية تصنيفية، وتوزيع استراتيجي لإعلانات جوجل أدسنس.",
    challenge: "Handling extreme traffic spikes during breaking news events without server crash, while maximizing ad viewability CTR without compromising editorial readability.",
    challengeBn: "ব্রেকিং নিউজের সময়ে হঠাৎ বিপুল পাঠকের ট্রাফিক সত্ত্বেও সার্ভার ডাউন না হওয়া এবং খবরের পাঠযোগ্যতা নষ্ট না করে গুগল বিজ্ঞাপনের সর্বোচ্চ ক্লিক নিশ্চিত করা।",
    challengeAr: "التعامل مع تدفقات الزوار الهائلة أثناء الأخبار العاجلة دون توقف الخادم، مع زيادة العائد الإعلاني دون التأثير على سلاسة القراءة.",
    solution: "Implemented Next.js incremental static regeneration (ISR) backed by Cloudflare Edge caching and dynamic ad slot rendering engine.",
    solutionBn: "নেক্সট-জেএস ইনক্রিমেন্টাল স্ট্যাটিক রিজেনারেশন (ISR) এবং ক্লাউডফ্লেয়ার এজ ক্যাশিং এর মাধ্যমে লোডিং স্পিড এবং সার্ভার স্ট্যাবিলিটি নিশ্চিত করা হয়েছে।",
    solutionAr: "تم الاعتماد على تقنية Next.js ISR المدعومة بالتخزين السحابي المؤقت والتوزيع الذكي لمساحات الإعلانات.",
    techStack: ["Next.js", "Tailwind CSS", "Google Ad Manager", "GraphQL API", "Redis Cache"],
    features: ["Breaking News Notification System", "Multi-Author Dashboard Engine", "Slick Ad Insertion Framework", "AMP & Instant Mobile Pages"],
    featuresBn: ["ব্রেকিং নিউজ লাইভ নোটিফিকেশন", "মাল্টি-রাইটার ড্যাশবোর্ড প্যানেল", "অটোমেটেড বিজ্ঞাপন প্লেসমেন্ট ফ্রেমওয়ার্ক", "এএমপি এবং মোবাইল ফাস্ট পেজ"],
    featuresAr: ["نظام فوري لإشعارات الأخبار العاجلة", "منصة لوحة تحكم مخصصة للكتاب والمحررين", "إطار مدمج لتوزيع الإعلانات الذاتية", "صفحات جوال فائقة السرعة AMP"],
    results: [{ label: "Monthly Sessions", value: "2.4M" }, { label: "Ad Visibility Match", value: "98.5%" }, { label: "Ad Revenue Uplift", value: "+210%" }],
    resultsBn: [{ label: "মাসিক ভিজিটর সেশন", value: "২৪ লাখ+" }, { label: "বিজ্ঞাপন দৃশ্যমানতা", value: "৯৮.৫%" }, { label: "বিজ্ঞাপন আয় বৃদ্ধি", value: "+২১০%" }],
    resultsAr: [{ label: "الجلسات الشهرية للموقع", value: "2.4 مليون" }, { label: "توافق رؤية الإعلان", value: "98.5%" }, { label: "نمو العوائد الإعلانية", value: "+210%" }],
    videoUrl: "https://www.youtube.com/embed/Y7PlVlUInb0",
    galleryImages: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "Ad zones load perfectly and page layout is extremely intuitive to scroll. We are managing millions of monthly hits safely on high-priority cloud hosting setups provided by WebzoneBD.",
      quoteBn: "আমাদের প্রথমবার্তা নিউজ পোর্টালের অ্যাড জোন এবং স্পোর্টস মডিউল সহজে নিয়ন্ত্রন করা যায়। দৈনিক লাখ লাখ পাঠক সাইটে কোনো ল্যাগ বা ডাউনটাইম ছাড়াই খবর পড়তেছেন।",
      quoteAr: "تعمل مساحات إعلانات جوجل ونظام النشرات اليومية بسلاسة متناهية. نخدم ملايين الزيارات بأمان كامل عبر خوادم مخصصة قوية من مهندسي ويب زون بي دي.",
      author: "A. Rahman Chowdhury",
      role: "Managing Editor",
      company: "ProthomBarta Media",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    featured: true
  },
  {
    id: "port-blog-1",
    title: "TechSphere - Elegant Headless WordPress & GraphQL Blogging Platform",
    titleBn: "টেকস্ফিয়ার - চমৎকার হেডলেস ওয়ার্ডপ্রেস ও গ্রাফ-কিউএল ব্লগ",
    titleAr: "TechSphere - منصة تدوين تقنية سريعة متصلة بالوردبريس الهيدليس وتكنولوجيا GraphQL",
    category: "blog",
    categoryLabel: "Blogging Site",
    categoryLabelBn: "ব্লগিং সাইট",
    categoryLabelAr: "موقع مدونة",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    client: "TechSphere Network",
    duration: "1 Month",
    demoUrl: "https://blog.techsphere.example",
    description: "Super-fast technical publication portal pulling secure posts via GraphQL endpoints, equipped with instant automated newsletter newsletters.",
    descriptionBn: "গ্রাফ-কিউএল এন্ডপয়েন্টের মাধ্যমে নিরাপদে পোস্ট লোড করার জন্য সুপার-ফাস্ট টেকনিক্যাল পাবলিকেশন পোর্টাল, সাথে রয়েছে অটোমেটেড ইমেইল নিউজলেটার সিস্টেম।",
    descriptionAr: "بوابة نشر تقنية فائقة السرعة تجلب المقالات بأمان تام من واجهات ووردبريس عبر قنوات GraphQL، ومزودة بأنظمة نشرات بريدية لزيادة المتابعين تلقائياً.",
    projectScope: "Build a headless content site leveraging WordPress as a backend CMS while delivering lightning-fast static pages with React and GraphQL for optimal SEO and newsletter subscriptions.",
    projectScopeBn: "ব্যাকএন্ডে ওয়ার্ডপ্রেস সিএমএস এবং ফ্রন্টএন্ডে রিয়েক্ট ও গ্রাফ-কিউএল দিয়ে একটি ফাস্ট ব্লগিং প্ল্যাটফর্ম ডেভেলপ করা যা এসইও এবং ইমেইল সাবস্ক্রিপশনে অসাধারণ পারফর্ম করে।",
    projectScopeAr: "تطوير موقع مدونة متطور يعتمد ووردبريس كنظام خلفي مع تقديم واجهات React فائقة السرعة عبر GraphQL لرفع معايير محركات البحث والتفاعل.",
    challenge: "Traditional WordPress sites often suffer from database query lag and heavy plugin overhead, hurting mobile user retention.",
    challengeBn: "সনাতন ওয়ার্ডপ্রেস ওয়েবসাইটগুলোতে অতিরিক্ত প্লাগইন এবং ডাটাবেজ কোয়েরির কারণে স্লো লোডিংয়ের সমস্যা হতো, যা মোবাইল রিডারদের বিরক্ত করতো।",
    challengeAr: "تعاني مواقع ووردبريس التقليدية من البطء وتراكم الإضافات، مما يضعف جودة القراءة بالهاتف الذكي.",
    solution: "Decoupled the CMS into a Headless WordPress architecture via WPGraphQL, delivering pre-rendered static HTML with instant search indexing.",
    solutionBn: "ওয়ার্ডপ্রেসকে হেডলেস আর্কিটেকচারে রূপান্তর করে WPGraphQL দিয়ে রিয়েক্ট ফ্রন্টএন্ডের সাথে যুক্ত করা হয়েছে, যা তাৎক্ষণিক লোডিং প্রদান করে।",
    solutionAr: "تم فصل العرض عن إدارة المحتوى واستخدام WPGraphQL لتوليد صفحات ساكنة لحظية فائقة الأداء.",
    techStack: ["WordPress API", "React", "GraphQL", "Tailwind CSS", "Vercel Edge"],
    features: ["100/100 Google Lighthouse Score", "Instant Static Site Generation", "Automated Newsletter Dispatcher", "Dark Mode Code Syntax Highlighter"],
    featuresBn: ["১০০% গুগল লাইটহাউস স্পীড স্কোর", "তাত্ক্ষণিক স্ট্যাটিক পেজেস জেনারেশন", "অটোমেটেড ইমেইল নিউজলেটার সাবস্ক্রিপশন", "কোট ও কোড সিনট্যাক্স হাইলাইটার"],
    featuresAr: ["مؤشر سرعة وتوافق جوجل لايتهاوس 100/100", "توليد فوري للمواقع الساكنة لخدمة أسرع", "موزع نشرات بريدية برمجية مؤتمت بالكامل", "تظليل الكود البرمجي بالوضع المظلم"],
    results: [{ label: "PageSpeed Index Score", value: "100/100" }, { label: "Newsletter Optins", value: "+28k" }],
    resultsBn: [{ label: "পেজস্পিড ইনডেক্স স্কোর", value: "১০০/১০০" }, { label: "নিউজলেটার সাবস্ক্রাইবার", value: "২৮,০০০+" }],
    resultsAr: [{ label: "مقياس سرعة محرك جوجل", value: "100/100" }, { label: "مشتركي النشرة البريدية", value: "+28,000" }],
    galleryImages: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "TechSphere loaded in literally a fraction of a second. Readers comment constantly on how crisp the code blocks look and our newsletter subscription rate shot up by 400%.",
      quoteBn: "টেকস্ফিয়ার মাত্র কয়েক মিলিসেকেন্ডেই লোড হয়। ভিজিটররা এর ইন্টারফেসের প্রশংসা করে এবং আমাদের ইমেইল নিউজলেটার সাবস্ক্রিপশন ৪০০% বৃদ্ধি পেয়েছে।",
      quoteAr: "تتحمل مدونتنا في أجزاء من الثانية! القراء يثنون على وضوح التكاويد والتصميم وشهدنا نمواً بنسبة 400% في المشتركين.",
      author: "Tanvir Ahmed",
      role: "Founder & Lead Editor",
      company: "TechSphere Network",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "port-ecom-1",
    title: "BazarBD - Dynamic Laravel Multi-Vendor E-commerce",
    titleBn: "বাজারবিডি - ডাইনামিক লারাভেল মাল্টি-ভেন্ডর ই-কমার্স",
    titleAr: "BazarBD - سوق إلكتروني ديناميكي متطور متعدد البائعين بمقومات حماية قصوى لارافيل",
    category: "ecommerce",
    categoryLabel: "E-Commerce Website",
    categoryLabelBn: "ই-কমার্স",
    categoryLabelAr: "التجارة الإلكترونية",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    client: "BazarBD Bangladesh",
    duration: "2.5 Months",
    demoUrl: "https://bazarbd.com.example",
    description: "A robust online digital store connecting vendors with tens of thousands of buyers daily, featuring automated checkout and active local currency SMS integration.",
    descriptionBn: "একটি শক্তিশালী অনলাইন ডিজিটাল স্টোর যা বিক্রেতাদের হাজার হাজার ক্রেতাদের সাথে দৈনিক সংযোগ করে দেয়, সাথে অটোমেটেড পেমেন্ট এবং কাস্টমার এসএমএস সিঙ্ক সুবিধা রয়েছে।",
    descriptionAr: "سوق إلكتروني متكامل وآمن يربط بين البائعين والعملاء، يوفر أنظمة دفع مؤتمتة وتكاملاً كاملاً مع بوابات الشحن ورسائل تتبع الهواتف الفورية.",
    projectScope: "Develop a multi-vendor e-commerce platform supporting vendor registration, multi-currency checkout (BDT, USD, SAR), bKash/SSLCommerz/Stripe payment gateways, inventory sync, and instant SMS order tracking.",
    projectScopeBn: "ভেন্ডর রেজিস্ট্রেশন, একাধিক কারেন্সি (টাকা, ডলার, রিয়াল), বিকাশ/এসএসএলকমার্জ/স্ট্রাইপ পেমেন্ট গেটওয়ে, ইনভেন্টরি সিঙ্ক এবং অটোমেটেড এসএমএস ট্র্যাকিং সহ মাল্টি-ভেন্ডর ই-কমার্স গড়ে তোলা।",
    projectScopeAr: "بناء منصة تجارة إلكترونية متعددة التجار تدعم تسجيل البائعين، وسداد متعدد العملات، وبوابات الدفع الإلكترونية المحلية والعالمية، وتتبع الطلبات بائل الرسائل.",
    challenge: "Managing thousands of concurrently updated product stocks across 450+ independent merchants with zero race conditions during flash sale events.",
    challengeBn: "ফ্ল্যাশ সেলের সময়ে ৪৫০ জনেরও বেশি বিক্রেতার হাজার হাজার পণ্যের স্টক রিয়েল-টাইমে নিখুঁতভাবে ইনভেন্টরিতে ট্র্যাকিং করা।",
    challengeAr: "إدارة مخزون آلاف المنتجات بالتزامن لـ 450 تاجراً مختلفاً أثناء العروض الخاطفة دون حدوث أخطاء بالنظام.",
    solution: "Engineered a custom Laravel 11 core with database transaction locks, Redis queue managers, and SSLCommerz automated callback webhooks.",
    solutionBn: "লারাভেল ১১ এর ডাটাবেজ ট্রানজেকশন লক, রেডিস কিউ প্রসেসর এবং এসএসএলকমার্জ ওয়েবহুক দিয়ে নিরবচ্ছিন্ন পেমেন্ট ও ইনভেন্টরি অটোমেশন নিশ্চিত করা হয়েছে।",
    solutionAr: "تمت برمجة بنية لارافيل مع معالجة الرسوين وجدولتها عبر تقنية Redis وموصلات الدفع الفورية.",
    techStack: ["Laravel", "PHP", "MySQL", "SSLCommerz Checkout", "bKash Gateway", "Tailwind CSS"],
    features: ["Complex Multi-Vendor Dashboards", "Dynamic Shopping Cart", "Integrated Payment & Invoicing Gateways", "Instant SMS Order Tracking"],
    featuresBn: ["কাস্টম বিক্রেতা ড্যাশবোর্ড", "ডাইনামিক শপিং কার্ট ও চেকআউট", "সমন্বিত পেমেন্ট গেটওয়ে এবং অটোমেটেড রসিদ", "ইনস্ট্যান্ট এসএমএস ট্র্যাকিং"],
    featuresAr: ["لوحات تحكم ذكية متعددة البائعين والمشرفين", "عربة تسوق ديناميكية وخيارات طلب مرنة", "بوابات دفع مدمجة وفواتير إلكترونية فورية", "تتبع الطلبيات بالرسائل النصية"],
    results: [{ label: "Daily Volume Tracking", value: "৳2.5M+" }, { label: "Registered Merchants", value: "450+" }, { label: "Order Settlement Speed", value: "< 2s" }],
    resultsBn: [{ label: "দৈনিক লেনদেন", value: "৳২৫ লাখ+" }, { label: "নিবন্ধিত বিক্রেতা", value: "৪৫০+" }, { label: "অর্ডার সেটেলমেন্ট স্পীড", value: "< ২ সেকেন্ড" }],
    resultsAr: [{ label: "حجم المعاملات اليومي", value: "+2.5M ৳" }, { label: "التجار المسجلين بالمنصة", value: "450+" }, { label: "سرعة تأكيد الطلب", value: "أقل من ثانيتين" }],
    videoUrl: "https://www.youtube.com/embed/fA3-r_3f0vA",
    galleryImages: [
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "BazarBD handles over 2.5 million Taka in daily transactions smoothly. WebzoneBD's custom Laravel engineering provided bulletproof reliability for our merchants.",
      quoteBn: "বাজারবিডি প্রতিদিন ২৫ লাখ টাকারও বেশি লেনদেন সহজে হ্যান্ডেল করে। ওয়েবজোনবিডির কাস্টম লারাভেল ইঞ্জিনিয়ারিং আমাদের মার্চেন্টদের চূড়ান্ত নিরাপত্তা দিয়েছে।",
      quoteAr: "يعالج موقع بازار بي دي معامالات يومية تتجاوز 2.5 مليون تاكا بسلاسة. تميز فريق ويب زون بي دي بمنحنا أماناً واستقراراً تاماً.",
      author: "Mahmud Hasan",
      role: "Managing Director",
      company: "BazarBD Bangladesh",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    },
    featured: true
  },
  {
    id: "port-cust-1",
    title: "Dr. Rahman - Interactive Physician Professional CV & Patient Booking Web",
    titleBn: "ডাক্তার রহমান - ইন্টারেক্টিভ প্রফেশনাল পোর্টফোলিও ও বুকিং ওয়েবসাইট",
    titleAr: "Dr. Rahman - معرض أعمال طبيب تفاعلي مع نظام حجز المواعيد فوري للعيادة এবং হাসপাতাল",
    category: "portfolio",
    categoryLabel: "Customer Portfolio",
    categoryLabelBn: "কাস্টমার পোর্টফোলিও",
    categoryLabelAr: "معرض أعمال العملاء",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    client: "Prof. Dr. Rahman Chowdhury",
    duration: "3 Weeks",
    demoUrl: "https://dr-rahman.example",
    description: "A highly responsive business branding and portfolio portal for medical professionals, enabling patients to browse schedules, query credentials, and book appointments.",
    descriptionBn: "চিকিৎসকদের জন্য একটি পেশাদারী পোর্টফোলিও এবং বুকিং ওয়েবসাইট, যার মাধ্যমে রোগীরা সহজে সিডিউল দেখে সরাসরি বুক করতে পারেন এবং ফি পেমেন্ট সম্পন্ন করতে পারেন।",
    descriptionAr: "موقع هوية احترافي تفاعلي للأطباء والاستشاريين، يمنح المرضى إمكانية تصفح المؤهلات العلمية، وحجز مواعيد الكشف والعيادة الفورية مع سداد الفحص.",
    projectScope: "Create an elegant personal doctor portfolio and appointment scheduling platform with real-time chamber slot selection, patient records integration, and SMS appointment reminders.",
    projectScopeBn: "ডাক্তারদের প্রফেশনাল পোর্টফোলিও এবং রিয়েল-টাইম অ্যাপয়েন্টমেন্ট বুকিং প্ল্যাটফর্ম তৈরি করা যা চেম্বারের সময়সূচী প্রদর্শন এবং রোগীদের এসএমএস রিমাইন্ডার পাঠায়।",
    projectScopeAr: "إنشاء موقع هوية وحجوزات طبية تفاعلي يتيح اختيار مواعيد الكشف المتاحة بالعيادة مع إرسال إشعارات تذكير بالرسائل.",
    challenge: "Patients faced difficulties getting chamber serials over phone calls, leading to long waiting times at the clinic.",
    challengeBn: "ফোনে চেম্বারের সিরিয়াল পাওয়া কঠিন ছিল, যার ফলে ক্লিনিকে রোগীদের দীর্ঘক্ষণ অপেক্ষা করতে হতো।",
    challengeAr: "صعوبة الحصول على المواعيد هاتفياً وتراكم المرضى بقاعات الانتظار.",
    solution: "Built a self-service web portal with visual chamber selector, instant mobile serial confirmation, and automated Google Calendar integration.",
    solutionBn: "ভিজ্যুয়াল চেম্বার সিলেক্টর, তাত্ক্ষণিক মোবাইল মেসেজ ও গুগল ক্যালেন্ডার সিঙ্ক সহ একটি সেলফ-সার্ভিস ওয়েব পোর্টাল তৈরি করা হয়েছে।",
    solutionAr: "تطوير بوابة اختيار حرة للمواعيد والخدمات الطبية مؤتمتة بالكامل بالتقويم الذكي.",
    techStack: ["React", "Google Calendar sync", "Lucide React Icons", "Node.js Schema", "Twilio SMS"],
    features: ["Real-time Slot Availability Checker", "Professional Branding Visuals Desk", "Automated SMS Schedule Confirmations", "Prescription Download Portal"],
    featuresBn: ["রিয়েল-টাইম কন্সাল্টেশন স্লট ফাঁকা আছে কিনা নিশ্চিতকারক", "আকর্ষণীয় ব্র্যান্ডিং প্রেজেন্টেশন", "অটোমেটেড এসএমএস অ্যাপয়েন্টমেন্ট কনফার্মেশন", "প্রেসক্রিপশন ডাউনলোড পোর্টাল"],
    featuresAr: ["نظام حجز مواعيد مرن في الوقت الفعلي", "تصميم بصري احترافي يعزز مكانة الطبيب", "إرسال رسائل نصية تلقائية لتأكيد مواعيد الكشف", "بوابة تحميل الوصفات الطبية"],
    results: [{ label: "Monthly Patient Bookings", value: "1,200+" }, { label: "Direct Phone Call Rate", value: "+80%" }],
    resultsBn: [{ label: "মাসিক সরাসরি বুকিং", value: "১,২০০+" }, { label: "সরাসরি যোগাযোগ বৃদ্ধি", value: "+৮০%" }],
    resultsAr: [{ label: "الحجوزات الطبية شهريا", value: "+1,200" }, { label: "زيادة الاتصال الهاتفي المباشر", value: "+80%" }],
    galleryImages: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "My patients love the online serial booking feature. Chamber waiting room congestion reduced by 70% and my professional online presence looks world-class.",
      quoteBn: "আমার রোগীরা অনলাইনে সহজে সিরিয়াল নিতে পেরে খুব সন্তুষ্ট। ক্লিনিকে ভিড় ৭০% কমে গেছে এবং আমার পোর্টফোলিওটি আন্তর্জাতিক মানের দেখায়।",
      quoteAr: "المرضى يعشقون سهولة الحجز المباشر المريح! انخفض الازدحام بالعيادة بنسبة 70% وواجهتي الرقمية تبدو عالمية.",
      author: "Prof. Dr. Rahman Chowdhury",
      role: "Senior Cardiology Specialist",
      company: "National Heart Institute",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "port-seo-1",
    title: "GulfHost KSA - Industrial SEO Audit & high ROI ranking optimization campaign",
    titleBn: "গালফহোস্ট - ইন্ডাস্ট্রিয়াল এসইও র‍্যাংকিং বুস্টার ও গুগল অ্যাডস ক্যাম্পেইন",
    titleAr: "GulfHost KSA - حملة تنشيط وتحسين محركات البحث وسيو متقدم لشركة استضافة الخليج",
    category: "seoAds",
    categoryLabel: "SEO & Google Ads",
    categoryLabelBn: "এসইও ও গুগল এডস",
    categoryLabelAr: "سيو وإعلانات جوجل",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    client: "GulfHost KSA Technology Group",
    duration: "4 Months",
    demoUrl: "https://gulfhost.com.example",
    description: "Multi-layered digital search engine ranking operations driving tier-1 strategic local keywords directly to position 1, significantly cutting down per-click costs.",
    descriptionBn: "গুগলের প্রথম পেজে নির্দিষ্ট কি-ওয়ার্ড র‍্যাঙ্ক করার জন্য হাই-লেভেল এসইও অপ্টিমাইজেশন প্রকল্প, যার মাধ্যমে পেইড ট্রাফিকের বিজ্ঞাপনী খরচ কমে এসেছে চমৎকারভাবে।",
    descriptionAr: "عمليات تحسين متقدمة لظهور محركات البحث لمصطلحات حيوية عالية التنافسية بمشروع استضافة الويب، مما عاد بزيادة هائلة للزيارات المجانية وتخفيض تكلفة النقرة الإعلانية.",
    projectScope: "Execute a technical SEO audit, semantic search optimization, high-authority backlink strategy, and Google Search Ads campaign for a major web hosting provider in Saudi Arabia.",
    projectScopeBn: "সৌদি আরবের শীর্ষ স্থানীয় ওয়েব হোস্টিং কোম্পানির জন্য টেকনিক্যাল এসইও অডিট, কি-ওয়ার্ড রিকভারি, ব্যাকলিঙ্ক স্ট্র্যাটেজি এবং গুগল এডস ক্যাম্পেইন পরিচালনা করা।",
    projectScopeAr: "تنفيذ مراجعة شاملة لجميع جوانب محركات البحث، وتوزيع الكلمات المفتاحية، وبناء الروابط الموثوقة، وتفعيل إعلانات جوجل لمؤسسة استضافة كبرى بالسعودية.",
    challenge: "Extremely competitive web hosting keywords in GCC region with high PPC bidding costs exceeding $12 per click.",
    challengeBn: "মিডল ইস্ট অঞ্চলের ওয়েব হোস্টিং কি-ওয়ার্ডগুলোতে প্রতিযোগিতার মাত্রা অত্যধিক এবং ক্লিক প্রতি বিজ্ঞাপনী খরচ $১২ ডলারের বেশি ছিল।",
    challengeAr: "المنافسة المحمومة للغاية على كلمات استضافة الويب بدول الخليج وارتفاع سعر النقرة الإعلانية فوق 12 دولار.",
    solution: "Implemented schema markups, long-tail localized landing pages, and quality score improvements on Google Ads campaign setup.",
    solutionBn: "স্কিমা মার্কআপ, কাস্টম ল্যান্ডিং পেজ এবং গুগল অ্যাডসের কোয়ালিটি স্কোর বৃদ্ধির মাধ্যমে কম খরচে বেশি লিড পাওয়ার কৌশল বাস্তবায়ন করা হয়।",
    solutionAr: "تم تحسين جودة الإعلان وبناء صفحات هبوط مخصصة رفعت الكفاءة وزادت المبيعات بثلث التكلفة.",
    techStack: ["Ahrefs Analysis Pro", "Google AdWords Engine", "Semantic Keyword Strategy", "Technical Schema Setup"],
    features: ["Target Core Keywords Domination", "Cost-Per-Lead reduction of 42%", "High Traffic Velocity index metrics"],
    featuresBn: ["প্রধান কি-ওয়ার্ড প্রথম পেজে রিকভারি", "প্রতি লিড সংগ্রহে ৪২% বিজ্ঞাপনী খরচ হ্রাস", "অর্গানিক ট্রাফিকের উচ্চ গতিশীল ভলিউম"],
    featuresAr: ["تصدر نتائج البحث للكلمات الأكثر مبيعاً", "تخفيض تكلفة الحصول على العميل بنسبة 42%", "تتبع فوري ومؤشرات صحة الزيارات النشطة"],
    results: [{ label: "Organic Search Volume", value: "+320%" }, { label: "Acquisition Cost Offset", value: "-42%" }, { label: "Google Ads ROI", value: "480%" }],
    resultsBn: [{ label: "অর্গানিক সার্চ ট্রাফিক", value: "+৩২০%" }, { label: "লিড সংগ্রহ খরচ হ্রাস", value: "-৪২%" }, { label: "গুগল এডস আরওআই", value: "৪৮০%" }],
    resultsAr: [{ label: "حجم الزيارات العضوية المجانية", value: "+320%" }, { label: "تكلفة الاستحواذ المخفضة", value: "-42%" }, { label: "عائد الإعلانات التجاري", value: "480%" }],
    galleryImages: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "WebzoneBD brought our core keywords to Google's #1 rank within 4 months. Our organic search leads surged by 320% while cutting our Google Ads spend nearly in half.",
      quoteBn: "ওয়েবজোনবিডি মাত্র ৪ মাসের মধ্যে আমাদের মূল কি-ওয়ার্ডগুলোকে গুগলের প্রথম স্থানে নিয়ে এসেছে। এতে আমাদের অর্গানিক কাস্টমার ৩২০% বেড়েছে।",
      quoteAr: "نجحت ويب زون بي دي بوضع كلماتنا المفتاحية في المرتبة الأولى بجوجل خلال 4 أشهر فقط! ارتفعت مبيعاتنا 320% وانخفضت الميزانية الإعلانية للنصف.",
      author: "Fahad Al-Otaibi",
      role: "VP Marketing",
      company: "GulfHost KSA Technology Group",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "port-sol-1",
    title: "Webzone POS Pro - Intelligent Cloud Integrated Local Offline Business Core",
    titleBn: "ওয়েবজোন পস প্রো - ইন্টেলিজেন্ট ক্লাউড সিঙ্ক এবং লো-কস্ট অফলাইন পস সফটওয়্যার",
    titleAr: "Webzone POS Pro - نظام نقاط بيع والحركات المالية سحابي يعمل بدون الحاجة للانترنت المستمر",
    category: "solutions",
    categoryLabel: "ERP & POS Systems",
    categoryLabelBn: "ইআরপি ও পস সফটওয়্যার",
    categoryLabelAr: "أنظمة ERP و نقاط البيع",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    client: "Abaabil Super Shop Network",
    duration: "2 Months",
    demoUrl: "https://pos.webzonebd.example",
    description: "Highly automated point-of-sale manager running in standard desktop web layouts. Saves offline tickets and synchronization queue when network triggers reconnect.",
    descriptionBn: "ডেস্কটপ ব্রাউজারে চালিত দারুণ একটি পস সফটওয়্যার। ইন্টারনেট প্রবলেম থাকলেও অফলাইনে ডাটা সেভ রাখে এবং পরবর্তীতে স্বয়ংক্রিয়ভাবে ক্লাউড ডাটাবেজ সিঙ্ক সম্পন্ন করে।",
    descriptionAr: "برنامج نقاط بيع وبنية مالية ذكية لأصحاب المحلات التجارية والمخازن، يسجل الحركات المالية المباشرة محلياً بدون إنترنت، ويزامنها مع السحابة فور عودة الاتصال فورا.",
    projectScope: "Engineer a progressive POS & ERP software solution with offline IndexedDB storage, Bluetooth thermal receipt printing, barcode scanning, inventory low-stock alerts, and Cloud Firestore backup.",
    projectScopeBn: "অফলাইন ইনডেক্সড-ডিবি ডাটাবেজ, ব্লুটুথ থার্মাল রিসিট প্রিন্টিং, বারকোড স্ক্যানার এবং ক্লাউড ফায়ারস্টোর ব্যাকআপ সহ একটি আধুনিক পস ও ইআরপি সফটওয়্যার তৈরি করা।",
    projectScopeAr: "تطوير نظام نقاط بيع وإدارة مخازن ذكي يعمل بدون إنترنت مع إمكانية طباعة الفواتير وربط ماسح الباركود والمزامنة السحابية.",
    challenge: "Frequent internet connectivity issues at retail counters caused billing halts and lost customer sales.",
    challengeBn: "রিটেইল কাউন্টারে বারবার ইন্টারনেট কানেকশন চলে যাওয়ার ফলে ক্যাশআউট বন্ধ হয়ে যেতো এবং কাস্টমার বিল গ্রহণে ভিড় জমে যেতো।",
    challengeAr: "انقطاع الإنترنت المتكرر بالمعارض يؤدي لتوقف عمليات المحاسبة والبيع.",
    solution: "Engineered a local-first offline architecture using IndexedDB that processes transactions instantly and syncs with Firestore once reconnected.",
    solutionBn: "ইনডেক্সড-ডিবি দিয়ে লোকাল-ফার্স্ট অফলাইন আর্কিটেকচার তৈরি করা হয়েছে যা ব্রাউজারে লেনদেন সম্পন্ন করে এবং নেটের সংযোগ পেলে ক্লাউডে সিঙ্ক করে।",
    solutionAr: "تمت برمجة بنية محلية سريعة تحفظ المبيعات بالجهاز وتزامنها سحابياً تلقائياً فور توفر الاتصال.",
    techStack: ["React App", "IndexedDB Offline Cache", "PDF Thermal Receipt generator", "Tailwind styling CSS", "Firestore Sync"],
    features: ["Instant Offline Sales Hold State", "Dynamic Thermal Print Invoices", "Live Stock level warning notification", "Multi-Counter Cashier Permissions"],
    featuresBn: ["অফলাইন সেলস ও রিসিট হোল্ডিং", "থার্মাল প্রিন্ট চালান অটো জেনারেশন", "রিয়েল-টাইম স্টক লেভেল অ্যালার্ট ও নোটিফিকেশন", "মাল্টি-কাউন্টার ক্যাশিয়ার রোলস"],
    featuresAr: ["دعم معالجة المبيعات بلا إنترنت تماماً", "توليد وطباعة فورية للفواتير الحرارية والدفع", "تنبيهات فورية عند انخفاض مستوى المنتجات بالمخزن", "إدارة صلاحيات البائعين الصرافين"],
    results: [{ label: "Billing Processing Speed", value: "1.2s" }, { label: "Offline Outages Safe", value: "100%" }],
    resultsBn: [{ label: "বিল প্রসেসিং স্পীড", value: "১.২ সেকেন্ড" }, { label: "অফলাইন নিরবচ্ছিন্ন সংযোগ নিশ্চিত", value: "১০০%" }],
    resultsAr: [{ label: "سرعة تجهيز وإصدار الفاتورة", value: "1.2 ثانية" }, { label: "تأمين معالجة انقطاع الشبكة", value: "100%" }],
    galleryImages: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "The offline capability of Webzone POS Pro saves us during power or internet outages. Transactions compile in 1.2s and local invoices print immediately.",
      quoteBn: "ওয়েবজোন পস প্রো-এর অফলাইন ব্যাকআপ ফিচারটি আমাদের দারুণ সাহায্য করে। ইন্টারনেট কানেকশন চলে গেলেও নিরবচ্ছিন্ন ক্যাশআউট করা যায়।",
      quoteAr: "ساعدتنا ميزة العمل بلا شبكة في برنامج نقاط البيع الذكي كثيراً أثناء لقطات انقطاع الكهرباء والشبكة الكهربية المؤقتة.",
      author: "Syed Al-Masood",
      role: "Technology Director",
      company: "Abaabil Super Shop Network",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    featured: true
  },
  {
    id: "port-mkt-1",
    title: "Apex Logistics - Integrated Social Media & Google Lead Generation Drive",
    titleBn: "এপেক্স লজিস্টিকস - ইন্টিগ্রেটেড সোশ্যাল মিডিয়া ও গুগল লিড জেনারেশন ড্রাইভ",
    titleAr: "Apex Logistics - حملة متكاملة لتوليد العملاء المحتملين عبر شبكات التواصل وإعلانات جوجل",
    category: "marketing",
    categoryLabel: "Digital Marketing",
    categoryLabelBn: "ডিজিটাল মার্কেটিং",
    categoryLabelAr: "التسويق الرقمي",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    client: "Apex Logistics Ltd.",
    duration: "2 Months",
    demoUrl: "https://apex-logistics.example",
    description: "Multi-channel targeting campaign designed to capture qualified business-to-business logistics leads using social SEO, precise demographic audiences, and automated email nurturing.",
    descriptionBn: "সোশ্যাল এসইও, টার্গেটেড ডেমোগ্রাফিক অডিয়েন্স এবং অটোমেটেড কন্টেন্ট ফানেল ব্যবহার করে হাই-কোয়ালিটি বিটুবি লিড সংগ্রহের জন্য বহুমুখী ডিজিটাল ক্যাম্পেইন।",
    descriptionAr: "حملة تسويقية متكاملة متعددة القنوات مصممة لجذب العملاء في قطاع الأعمال واللوجستيات باستخدام السيو الاجتماعي، وتحديد الجمهور بدقة، والمتابعة البريدية المؤتمتة.",
    projectScope: "Launch a multi-platform B2B lead generation strategy combining Meta Ads, Google Search Ads, and LinkedIn Outreach to capture enterprise freight contracts.",
    projectScopeBn: "ফেসবুক, গুগল সার্চ এবং লিঙ্কডইন আউটরিচ ব্যবহার করে এন্টারপ্রাইজ ফ্রেইট ও লজিস্টিকস চুক্তির জন্য একটি শক্তিশালী বিটুবি লিড জেনারেশন ক্যাম্পেইন চালানো।",
    projectScopeAr: "إطلاق استراتيجية تسويق B2B متكاملة تجمع بين إعلانات فيسبوك وجوجل ولينكدإن لجذب عقود الشحن التجارية.",
    challenge: "High acquisition cost and unqualified leads generated through traditional generic social media ad boosts.",
    challengeBn: "সাধারণ সোশ্যাল মিডিয়া বুস্টিংয়ের মাধ্যমে খরচ বেশি হলেও অনাকাঙ্ক্ষিত অডিয়েন্স থেকে লিড আসতো।",
    challengeAr: "ارتفاع تكلفة العميل وضعف جودة الطلبات الناتجة عن الترويج التقليدي.",
    solution: "Designed custom lead magnet landing pages, implemented custom audience pixels, and automated CRM email follow-up sequences.",
    solutionBn: "কাস্টম ল্যান্ডিং পেজ, পিক্সেল ট্র্যাকিং এবং সিআরএম ইমেইল অটোমেশনের মাধ্যমে উচ্চমানের বিটুবি লিড নিশ্চিত করা হয়।",
    solutionAr: "تم بناء صفحات هبوط حصرية، وربط البكسل الذكي، وأتمتة المتابعة البريدية لنظام CRM.",
    techStack: ["Meta Ads Manager", "Google Ads", "LinkedIn Sales Navigator", "ActiveCampaign"],
    features: ["Highly targeted audience segments", "Interactive sales onboarding funnel", "Complete dynamic KPI dashboard tracking"],
    featuresBn: ["অডিয়েন্স সেগমেন্টেশন", "ইন্টারেক্টিভ সেলস ফানেল", "ডাইনামিক কেপিআই ড্যাশবোর্ড ট্র্যাকিং"],
    featuresAr: ["استهداف دقيق لشرائح الجمهور الفعالة", "مسارات تفاعلية متكاملة لإتمام وتثبيت البيع", "لوحة تحكم ديناميكية لقياس الأداء ومؤشرات النجاح"],
    results: [{ label: "Qualified Leads Generated", value: "3,400+" }, { label: "Cost Per Acquisition", value: "-35%" }],
    resultsBn: [{ label: "কোয়ালিফাইড লিড জেনারেশন", value: "৩,৪০০+" }, { label: "লিড সংগ্রহ খরচ হ্রাস", value: "৩৫% কমেছে" }],
    resultsAr: [{ label: "العملاء المحتملين الجدد", value: "+3,400" }, { label: "تخفيض تكلفة العميل الجديد", value: "بنسبة 35%" }],
    galleryImages: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "WebzoneBD transformed our digital marketing strategy. We closed 3,400+ qualified B2B logistics leads with a 35% reduction in acquisition cost.",
      quoteBn: "ওয়েবজোনবিডি আমাদের ডিজিটাল মার্কেটিং সম্পূর্ণ বদলে দিয়েছে। আমরা ৩৫% কম খরচে ৩,৪০০+ কোয়ালিফাইড লিড সংগ্রহ করেছি।",
      quoteAr: "غيرت ويب زون بي دي استراتيجيتنا التسويقية بالكامل! حققنا أكثر من 3400 عميل تجاري بتخفيض 35% بالتكلفة.",
      author: "Kamrul Islam",
      role: "Head of Growth",
      company: "Apex Logistics Ltd.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "port-graph-1",
    title: "Apex Logistics - Premium Corporate Rebranding & Visual Identity Guidelines",
    titleBn: "এপেক্স লজিস্টিকস - প্রিমিয়াম কর্পোরেট রিব্র্যান্ডিং ও ভিজ্যুয়াল আইডেন্টিটি ডিজাইন",
    titleAr: "Apex Logistics - إعادة تصميم الهوية البصرية وشعار الشركة مع دليل العلامة التجارية المتكامل",
    category: "graphic",
    categoryLabel: "Graphic Design",
    categoryLabelBn: "গ্রাফিক ডিজাইন",
    categoryLabelAr: "تصميم الجرافيك",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    client: "Apex Logistics Ltd.",
    duration: "1 Month",
    demoUrl: "https://apex-branding.example",
    description: "A complete overhaul of corporate design assets, including high-contrast premium vector logos, dynamic UI/UX design schemes, typography alignments, and high-performance branding presentation kits.",
    descriptionBn: "হাই-কন্ট্রাস্ট প্রিমিয়াম ভেক্টর লোগো, আকর্ষনীয় ইউআই/ইউএক্স কালার স্কিম, টাইপোগ্রাফি বিন্যাস এবং পেশাদার ব্রোশিয়ার ডিজাইন সহ একটি সম্পূর্ণ ভিজ্যুয়াল রিব্র্যান্ডিং সলিউশন।",
    descriptionAr: "تطوير شامل وممتاز للأصول التصميمية للشركة، بما في ذلك الشعارات المتجهية (Vector) عالية التباين، ومخططات واجهات الاستخدام UI/UX، وتوافق الخطوط، وحزم عروض العلامة التجارية الفائقة.",
    projectScope: "Redesign the entire corporate visual language for Apex Logistics, including vector logo suites, vehicle livery, business stationary, social media templates, and full brand guideline manual.",
    projectScopeBn: "এপেক্স লজিস্টিকসের লোগো, গাড়ি ও কন্টেইনার স্টিকার, বিজনেস কার্ড, প্যাড, সোশ্যাল মিডিয়া টেমপ্লেট এবং ব্র্যান্ড গাইডলাইন ম্যানুয়াল নতুনভাবে ডিজাইন করা।",
    projectScopeAr: "إعادة تصميم الهوية البصرية للشركة بما في ذلك الشعارات الموجهة، ملصقات الناقلات، البطاقات الشخصية، ودليل العلامة الكامل.",
    challenge: "Outdated visual identity that failed to reflect their position as a modern, technology-enabled logistics provider.",
    challengeBn: "পুরানো লোগো ও ব্র্যান্ডিং যা তাদের আধুনিক প্রযুক্তিনির্ভর লজিস্টিকস সার্ভিস হিসেবে ফুটিয়ে তুলতে ব্যর্থ হচ্ছিল।",
    challengeAr: "هوية قديمة لا تعكس تطور الشركة وحداثتها التقنية بالخدمات اللوجستية.",
    solution: "Created a sleek, dynamic vector mark representing motion and security, paired with an enterprise color palette and UI design system.",
    solutionBn: "গতিশীলতা ও নিরাপত্তার প্রতীক হিসেবে একটি সুনির্দিষ্ট ভেক্টর লোগো মার্ক এবং এন্টারপ্রাইজ কালার প্যালেট তৈরি করা হয়েছে।",
    solutionAr: "صممنا شعاراً ديناميكياً يعكس السرعة والأمان مع اختيار حزمة ألوان راقية ودليل شامل.",
    techStack: ["Adobe Illustrator", "Figma", "Photoshop", "Brand Books Guidelines"],
    features: ["Vector assets with infinite scaling", "Responsive screen layout blueprints", "Complete multi-variant color palette"],
    featuresBn: ["ইনফিনিট স্কেলিং ভেক্টর লোগো সম্পদ", "রেস্পন্সিভ স্ক্রিন লেআউট ব্লুপ্রিন্ট", "মাল্টি-ভেরিয়েন্ট কালার প্যালেট গাইডলাইন"],
    featuresAr: ["أصول رسومية متجهية قابلة للتكبير اللانهائي", "تخطيطات هندسية لواجهات الشاشات المتجاوبة", "دليل شامل لمنظومة وحزم الألوان المتعددة"],
    results: [{ label: "Brand Equity Increase", value: "+85%" }, { label: "Digital UI Satisfaction Score", value: "99.2%" }],
    resultsBn: [{ label: "ব্র্যান্ড ভ্যালু বৃদ্ধি", value: "+৮৫%" }, { label: "ব্যবহারকারীদের ইউআই সন্তুষ্টি", value: "৯৯.২%" }],
    resultsAr: [{ label: "ارتفاع القيمة السوقية للهوية", value: "+85%" }, { label: "معدل الرضا عن واجهة الاستخدام", value: "99.2%" }],
    galleryImages: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80"
    ],
    testimonial: {
      quote: "The brand identity designed by WebzoneBD instantly elevated our market perception. Clients and investors praised the clean, professional vector aesthetic.",
      quoteBn: "ওয়েবজোনবিডির ডিজাইন করা ব্র্যান্ড আইডেন্টিটি মার্কেটে আমাদের পরিচিতি বহুগুণ বাড়িয়ে দিয়েছে। ক্লায়েন্ট এবং ইনভেস্টররা আমাদের নতুন লুক পছন্দ করেছেন।",      quoteAr: "الهوية التي صممتها ويب زون بي دي رفعت مكانة علامتنا بالسوق بشكل مبهر وحازت إعجاب جميع عملائنا والمستثمرين.",
      author: "Farhan Tanvir",
      role: "Chief Executive Officer",
      company: "Apex Logistics Ltd.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "port-ecom-2",
    title: "BazarBD - Dynamic Laravel Multi-Vendor E-commerce",
    titleBn: "বাজারবিডি - ডাইনামিক লারাভেল মাল্টি-ভেন্ডর ই-কমার্স",
    titleAr: "BazarBD - سوق إلكتروني ديناميكي متطور متعدد البائعين بمقومات حماية قصوى لارافيل",
    category: "ecommerce",
    categoryLabel: "E-Commerce Website",
    categoryLabelBn: "ই-কমার্স",
    categoryLabelAr: "التجارة الإلكترونية",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    client: "BazarBD Bangladesh",
    duration: "2.5 Months",
    demoUrl: "https://bazarbd.com.example",
    description: "A robust online digital store connecting vendors with tens of thousands of buyers daily, featuring automated checkout and active local currency SMS integration.",
    descriptionBn: "একটি শক্তিশালী অনলাইন ডিজিটাল স্টোর যা বিক্রেতাদের হাজার হাজার ক্রেতাদের সাথে দৈনিক সংযোগ করে দেয়, সাথে অটোমেটেড পেমেন্ট এবং কাস্টমার এসএমএস সিঙ্ক সুবিধা রয়েছে।",
    descriptionAr: "سوق إلكتروني متكامل وآمن يربط بين البائعين والعملاء، يوفر أنظمة دفع مؤتمتة وتكاملاً كاملاً مع بوابات الشحن ورسائل تتبع الهواتف الفورية.",
    techStack: ["Laravel", "PHP", "MySQL", "SSLCommerz Checkout", "Tailwind CSS"],
    features: ["Complex Multi-Vendor Dashboards", "Dynamic Shopping Cart", "Integrated Payment & Invoicing Gateways"],
    featuresBn: ["কাস্টম বিক্রেতা ড্যাশবোর্ড", "ডাইনামিক শপিং কার্ট ও চেকআউট", "সমন্বিত পেমেন্ট গেটওয়ে এবং অটোমেটেড রসিদ"],
    featuresAr: ["لوحات تحكم ذكية متعددة البائعين والمشرفين", "عربة تسوق ديناميكية وخيارات طلب مرنة", "بوابات دفع مدمجة وفواتير إلكترونية فورية"],
    results: [{ label: "Daily Volume Tracking", value: "৳2.5M+" }, { label: "Registered Merchants", value: "450+" }],
    resultsBn: [{ label: "দৈনিক লেনদেন", value: "৳২৫ লাখ+" }, { label: "নিবন্ধিত বিক্রেতা", value: "৪৫০+" }],
    resultsAr: [{ label: "حجم المعاملات اليومي", value: "+2.5M ৳" }, { label: "التجار المسجلين بالمنصة", value: "450+" }],
    videoUrl: "https://www.youtube.com/embed/fA3-r_3f0vA"
  },
  {
    id: "port-cust-2",
    title: "Dr. Rahman - Interactive Physician Professional CV & Patient Booking Web",
    titleBn: "ডাক্তার রহমান - ইন্টারেক্টিভ প্রফেশনাল পোর্টফোলিও ও বুকিং ওয়েবসাইট",
    titleAr: "Dr. Rahman - معرض أعمال طبيب تفاعلي مع نظام حجز المواعيد فوري للعيادة এবং হাসপাতাল",
    category: "portfolio",
    categoryLabel: "Customer Portfolio",
    categoryLabelBn: "কাস্টমার পোর্টফোলিও",
    categoryLabelAr: "معرض أعمال العملاء",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    client: "Prof. Dr. Rahman Chowdhury",
    duration: "3 Weeks",
    demoUrl: "https://dr-rahman.example",
    description: "A highly responsive business branding and portfolio portal for medical professionals, enabling patients to browse schedules, query credentials, and book appointments.",
    descriptionBn: "চিকিৎসকদের জন্য একটি পেশাদারী পোর্টফোলিও এবং বুকিং ওয়েবসাইট, যার মাধ্যমে রোগীরা সহজে সিডিউল দেখে সরাসরি বুক করতে পারেন এবং ফি পেমেন্ট সম্পন্ন করতে পারেন।",
    descriptionAr: "موقع هوية احترافي تفاعلي للأطباء والاستشاريين، يمنح المرضى إمكانية تصفح المؤهلات العلمية، وحجز مواعيد الكشف والعيادة الفورية مع سداد الفحص.",
    techStack: ["React", "Google Calendar sync", "Lucide React Icons", "Node.js Schema"],
    features: ["Real-time Slot Availability Checker", "Professional Branding Visuals Desk", "Automated SMS Schedule Confirmations"],
    featuresBn: ["রিয়েল-টাইম কন্সাল্টেশন স্লট ফাঁকা আছে কিনা নিশ্চিতকারক", "আকর্ষণীয় ব্র্যান্ডিং প্রেজেন্টেশন", "অটোমেটেড এসএমএস অ্যাপয়েন্টমেন্ট কনফার্মেশন"],
    featuresAr: ["نظام حجز مواعيد مرن في الوقت الفعلي", "تصميم بصري احترافي يعزز مكانة الطبيب", "إرسال رسائل نصية تلقائية لتأكيد مواعيد الكشف"],
    results: [{ label: "Monthly Patient Bookings", value: "1,200+" }, { label: "Direct Phone Call Rate", value: "+80%" }],
    resultsBn: [{ label: "মাসিক সরাসরি বুকিং", value: "১,২০০+" }, { label: "সরাসরি যোগাযোগ বৃদ্ধি", value: "+৮০%" }],
    resultsAr: [{ label: "الحجوزات الطبية شهريا", value: "+1,200" }, { label: "زيادة الاتصال الهاتفي المباشر", value: "+80%" }]
  },
  {
    id: "port-seo-2",
    title: "GulfHost KSA - Industrial SEO Audit & high ROI ranking optimization campaign",
    titleBn: "গালফহোস্ট - ইন্ডাস্ট্রিয়াল এসইও র‍্যাংকিং বুস্টার ও গুগল অ্যাডস ক্যাম্পেইন",
    titleAr: "GulfHost KSA - حملة تنشيط وتحسين محركات البحث وسيو متقدم لشركة استضافة الخليج",
    category: "seoAds",
    categoryLabel: "SEO & Google Ads",
    categoryLabelBn: "এসইও ও গুগল এডস",
    categoryLabelAr: "سيو وإعلانات جوجل",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    client: "GulfHost KSA Technology Group",
    duration: "4 Months",
    demoUrl: "https://gulfhost.com.example",
    description: "Multi-layered digital search engine ranking operations driving tier-1 strategic local keywords directly to position 1, significantly cutting down per-click costs.",
    descriptionBn: "গুগলের প্রথম পেজে নির্দিষ্ট কি-ওয়ার্ড র‍্যাঙ্ক করার জন্য হাই-লেভেল এসইও অপ্টিমাইজেশন প্রকল্প, যার মাধ্যমে পেইড ট্রাফিকের বিজ্ঞাপনী খরচ কমে এসেছে চমৎকারভাবে।",
    descriptionAr: "عمليات تحسين متقدمة لظهور محركات البحث لمصطلحات حيوية عالية التنافسية بمشروع استضافة الويب، مما عاد بزيادة هائلة للزيارات المجانية وتخفيض تكلفة النقرة الإعلانية.",
    techStack: ["Ahrefs Analysis Pro", "Google AdWords Engine", "Semantic Keyword Strategy", "Technical Schema Setup"],
    features: ["Target Core Keywords Domination", "Cost-Per-Lead reduction of 42%", "High Traffic Velocity index metrics"],
    featuresBn: ["প্রধান কি-ওয়ার্ড প্রথম পেজে রিকভারি", "প্রতি লিড সংগ্রহে ৪২% বিজ্ঞাপনী খরচ হ্রাস", "অর্গানিক ট্রাফিকের উচ্চ গতিশীল ভলিউম"],
    featuresAr: ["تصدر نتائج البحث للكلمات الأكثر مبيعاً", "تخفيض تكلفة الحصول على العميل بنسبة 42%", "تتبع فوري ومؤشرات صحة الزيارات النشطة"],
    results: [{ label: "Organic Search Volume", value: "+320%" }, { label: "Acquisition Cost Offset", value: "-42%" }],
    resultsBn: [{ label: "অর্গানিক সার্চ ট্রাফিক", value: "+৩২০%" }, { label: "লিড সংগ্রহ খরচ হ্রাস", value: "-৪২%" }],
    resultsAr: [{ label: "حجم الزيارات العضوية المجانية", value: "+320%" }, { label: "تكلفة الاستحواذ المخفضة", value: "-42%" }]
  },
  {
    id: "port-sol-2",
    title: "Webzone POS Pro - Intelligent Cloud Integrated Local Offline Business Core",
    titleBn: "ওয়েবজোন পস প্রো - ইন্টেলিজেন্ট ক্লাউড সিঙ্ক এবং লো-কস্ট অফলাইন পস সফটওয়্যার",
    titleAr: "Webzone POS Pro - نظام نقاط بيع والحركات المالية سحابي يعمل بدون الحاجة للانترنت المستمر",
    category: "solutions",
    categoryLabel: "ERP & POS Systems",
    categoryLabelBn: "ইআরপি ও পস সফটওয়্যার",
    categoryLabelAr: "أنظمة ERP و نقاط البيع",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    client: "Abaabil Super Shop Network",
    duration: "2 Months",
    demoUrl: "https://pos.webzonebd.example",
    description: "Highly automated point-of-sale manager running in standard desktop web layouts. Saves offline tickets and synchronization queue when network triggers reconnect.",
    descriptionBn: "ডেস্কটপ ব্রাউজারে চালিত দারুণ একটি পস সফটওয়্যার। ইন্টারনেট প্রবলেম থাকলেও অফলাইনে ডাটা সেভ রাখে এবং পরবর্তীতে স্বয়ংক্রিয়ভাবে ক্লাউড ডাটাবেজ সিঙ্ক সম্পন্ন করে।",
    descriptionAr: "برنامج نقاط بيع وبنية مالية ذكية لأصحاب المحلات التجارية والمخازن، يسجل الحركات المالية المباشرة محلياً بدون إنترنت، ويزامنها مع السحابة فور عودة الاتصال فورا.",
    techStack: ["React App", "IndexedDB Offline Cache", "PDF Thermal Receipt generator", "Tailwind styling CSS"],
    features: ["Instant Offline Sales Hold State", "Dynamic Thermal Print Invoices", "Live Stock level warning notification"],
    featuresBn: ["অফলাইন সেলস ও রিসিট হোল্ডিং", "থার্মাল প্রিন্ট চালান অটো জেনারেশন", "রিয়েল-টাইম স্টক লেভেল অ্যালার্ট ও নোটিফিকেশন"],
    featuresAr: ["دعم معالجة المبيعات بلا إنترنت تماماً", "توليد وطباعة فورية للفواتير الحرارية والدفع", "تنبيهات فورية عند انخفاض مستوى المنتجات بالمخزن"],
    results: [{ label: "Billing Processing Speed", value: "1.2s" }, { label: "Offline Outages Safe", value: "100%" }],
    resultsBn: [{ label: "বিল প্রসেসিং স্পীড", value: "১.২ সেকেন্ড" }, { label: "অফলাইন নিরবচ্ছিন্ন সংযোগ নিশ্চিত", value: "১০০%" }],
    resultsAr: [{ label: "سرعة تجهيز وإصدار الفاتورة", value: "1.2 ثانية" }, { label: "تأمين معالجة انقطاع الشبكة", value: "100%" }]
  },
  {
    id: "port-mkt-2",
    title: "Apex Logistics - Integrated Social Media & Google Lead Generation Drive",
    titleBn: "এপেক্স লজিস্টিকস - ইন্টিগ্রেটেড সোশ্যাল মিডিয়া ও গুগল লিড জেনারেশন ড্রাইভ",
    titleAr: "Apex Logistics - حملة متكاملة لتوليد العملاء المحتملين عبر شبكات التواصل وإعلانات جوجل",
    category: "marketing",
    categoryLabel: "Digital Marketing",
    categoryLabelBn: "ডিজিটাল মার্কেটিং",
    categoryLabelAr: "التسويق الرقمي",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    client: "Apex Logistics Ltd.",
    duration: "2 Months",
    demoUrl: "https://apex-logistics.example",
    description: "Multi-channel targeting campaign designed to capture qualified business-to-business logistics leads using social SEO, precise demographic audiences, and automated email nurturing.",
    descriptionBn: "সোশ্যাল এসইও, টার্গেটেড ডেমোগ্রাফিক অডিয়েন্স এবং অটোমেটেড কন্টেন্ট ফানেল ব্যবহার করে হাই-কোয়ালিটি বিটুবি লিড সংগ্রহের জন্য বহুমুখী ডিজিটাল ক্যাম্পেইন।",
    descriptionAr: "حملة تسويقية متكاملة متعددة القنوات مصممة لجذب العملاء في قطاع الأعمال واللوجستيات باستخدام السيو الاجتماعي، وتحديد الجمهور بدقة، والمتابعة البريدية المؤتمتة.",
    techStack: ["Meta Ads Manager", "Google Ads", "LinkedIn Sales Navigator", "ActiveCampaign"],
    features: ["Highly targeted audience segments", "Interactive sales onboarding funnel", "Complete dynamic KPI dashboard tracking"],
    featuresBn: ["অডিয়েন্স সেগমেন্টেশন", "ইন্টারেক্টিভ সেলস ফানেল", "ডাইনামিক কেপিআই ড্যাশবোর্ড ট্র্যাকিং"],
    featuresAr: ["استهداف دقيق لشرائح الجمهور الفعالة", "مسارات تفاعلية متكاملة لإتمام وتثبيت البيع", "لوحة تحكم ديناميكية لقياس الأداء ومؤشرات النجاح"],
    results: [{ label: "Qualified Leads Generated", value: "3,400+" }, { label: "Cost Per Acquisition", value: "Decreased 35%" }],
    resultsBn: [{ label: "কোয়ালিফাইড লিড জেনারেশন", value: "৩,৪০০+" }, { label: "লিড সংগ্রহ খরচ হ্রাস", value: "৩৫% কমেছে" }],
    resultsAr: [{ label: "العملاء المحتملين الجدد", value: "+3,400" }, { label: "تخفيض تكلفة العميل الجديد", value: "بنسبة 35%" }]
  },
  {
    id: "port-graph-2",
    title: "Apex Logistics - Premium Corporate Rebranding & Visual Identity Guidelines",
    titleBn: "এপেক্স লজিস্টিকস - প্রিমিয়াম কর্পোরেট রিব্র্যান্ডিং ও ভিজ্যুয়াল আইডেন্টিটি ডিজাইন",
    titleAr: "Apex Logistics - إعادة تصميم الهوية البصرية وشعار الشركة مع دليل العلامة التجارية المتكامل",
    category: "graphic",
    categoryLabel: "Graphic Design",
    categoryLabelBn: "গ্রাফিক ডিজাইন",
    categoryLabelAr: "تصميم الجرافيك",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    client: "Apex Logistics Ltd.",
    duration: "1 Month",
    demoUrl: "https://apex-branding.example",
    description: "A complete overhaul of corporate design assets, including high-contrast premium vector logos, dynamic UI/UX design schemes, typography alignments, and high-performance branding presentation kits.",
    descriptionBn: "হাই-কন্ট্রাস্ট প্রিমিয়াম ভেক্টর লোগো, আকর্ষনীয় ইউআই/ইউএক্স কালার স্কিম, টাইপোগ্রাফি বিন্যাস এবং পেশাদার ব্রোশিয়ার ডিজাইন সহ একটি সম্পূর্ণ ভিজ্যুয়াল রিব্র্যান্ডিং সলিউশন।",
    descriptionAr: "تطوير شامل وممتاز للأصول التصميمية للشركة، بما في ذلك الشعارات المتجهية (Vector) عالية التباين، ومخططات واجهات الاستخدام UI/UX، وتوافق الخطوط، وحزم عروض العلامة التجارية الفائقة.",
    techStack: ["Adobe Illustrator", "Figma", "Photoshop", "Brand Books Guidelines"],
    features: ["Vector assets with infinite scaling", "Responsive screen layout blueprints", "Complete multi-variant color palette"],
    featuresBn: ["ইনফিনিট স্কেলিং ভেক্টর লোগো সম্পদ", "রেস্পন্সিভ স্ক্রিন লেআউট ব্লুপ্রিন্ট", "মাল্টি-ভেরিয়েন্ট কালার প্যালেট গাইডলাইন"],
    featuresAr: ["أصول رسومية متجهية قابلة للتكبير اللانهائي", "تخطيطات هندسية لواجهات الشاشات المتجاوبة", "دليل شامل لمنظومة وحزم الألوان المتعددة"],
    results: [{ label: "Brand Equity Increase", value: "+85%" }, { label: "Digital UI Satisfaction Score", value: "99.2%" }],
    resultsBn: [{ label: "ব্র্যান্ড ভ্যালু বৃদ্ধি", value: "+৮৫%" }, { label: "ব্যবহারকারীদের ইউআই সন্তুষ্টি", value: "৯৯.২%" }],
    resultsAr: [{ label: "ارتفاع القيمة السوقية للهوية", value: "+85%" }, { label: "معدل الرضا عن واجهة الاستخدام", value: "99.2%" }]
  }
];

export const sampleBlogs: BlogPost[] = [
  {
    id: "blog-2",
    title: "Step-by-Step Security Checklist To Harden Your PHP Core Applications",
    titleBn: "পিএইচপি ওয়েবসাইট সুরক্ষিত রাখার ৫টি কার্যকরী সিকিউরিটি উপায়",
    titleAr: "قائمة فحص شاملة لتأمين وحماية مواقع وتطبيقات PHP الخاصة بك",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    category: "Security",
    categoryBn: "ওয়েবসাইট নিরাপত্তা",
    categoryAr: "أمان الويب",
    summary: "Prevent SQL injection attacks, close Cross-site Scripting (XSS) leaks, sanitize post requests, and implement secure token patterns.",
    summaryBn: "সার্ভারে এসকিউএল ইনজেকশন প্রতিহত করা, এক্সএসএস ফাঁস প্রতিরোধ করা এবং সেশনের নিরাপত্তা নিশ্চিত করার কার্যকারী গাইডলাইন।",
    summaryAr: "طريقة حظر هجمات حقن SQL Injection وسد ثغرات البرمجة عبر المواقع XSS وتعقيم المتغيرات الواردة وصياغة الرموز الآمنة.",
    content: `Web applications face millions of bots trying to exploit SQL vulnerabilities daily. Always sanitize and use Prepared Statements for any Database querying. Use CSRF tokens on every POST request to avoid malicious script form submissions.

Set HTTPOnly cookies to protect against session highjack attempts. Keep your PHP dependencies updated to patch software bugs.`,
    contentBn: `বর্তমান যুগে প্রতিদিন হ্যাকারদের বিভিন্ন বট নেটওয়ার্কের মাধ্যমে হাজার হাজার সাইট আক্রান্ত হয়। তাই আপনার ডেটাবেজে সরাসরি ভ্যালু না পাঠিয়ে প্রি-প্রিপেয়ার্ড স্টেটমেন্ট কোয়েরি ব্যবহার করুন।

সবসময় সিএসআরএফ টোকেন সক্রিয় রাখুন এবং কুকিজ সুরক্ষিত রাখতে 'HTTPOnly' অপশন অন করে রাখুন। নিয়মিত সার্ভারে সফটওয়্যার ভার্সন আপডেট করুন।`,
    contentAr: `تواجه تطبيقات الويب يومياً محاولات مستمرة لاكتشاف الثغرات البرمجية. من الضروري جداً استخدام المعاملات المجهزة والأقواس الآمنة في قواعد البيانات.

تأكد من تنشيط رموز CSRF في طلبات الإرسال لمنع الثغرات، واجعل ملفات الإرتباط HTTPOnly لمنع هجمات سرقة الجلسة.`,
    date: "2026-05-12",
    author: "Technical Specialist",
    readTime: "4 min"
  }
];

export type FAQCategory = 'payments' | 'hosting' | 'domains' | 'development';

export interface FAQItem {
  q: string;
  a: string;
  category: FAQCategory;
}

export const sampleFAQs: Record<'en' | 'bn' | 'ar', FAQItem[]> = {
  en: [
    // Payments
    {
      q: "What premium payment gateways do you support inside Bangladesh and globally?",
      a: "Inside Bangladesh, we accept bKash, Nagad, Rocket, Upay, and local bank debit/credit cards via SSLCommerz. Globally, we support automated, secure checkout via Stripe, PayPal, and international Visa & Mastercard with instant invoice generation.",
      category: "payments"
    },
    {
      q: "Will I receive an official invoice and billing receipt immediately after payment?",
      a: "Yes, immediately upon completing your transaction, a digitally signed invoice with an itemized fee breakdown, unique invoice ID, and transaction hash is generated in your Client Dashboard and emailed to your address.",
      category: "payments"
    },
    {
      q: "What is your refund policy or money-back guarantee for digital services and hosting?",
      a: "We provide an unconditional 7-day money-back guarantee for shared and cloud hosting accounts if performance doesn't meet your expectations. For custom web development, payments are milestone-bound with stage-by-stage approval guarantees.",
      category: "payments"
    },
    {
      q: "Do you offer milestone-based payment schedules for custom web development projects?",
      a: "Yes. For bespoke corporate portals and web applications, we provide structured milestone schedules (e.g., 40% initial project kickoff, 30% after interactive staging review, and 30% upon final production deployment and code handover).",
      category: "payments"
    },
    {
      q: "Can I pay in multiple currencies such as BDT, USD, or Saudi Riyal (SAR)?",
      a: "Absolutely. Our checkout currency selector lets you view prices and settle invoices seamlessly in Bangladeshi Taka (BDT), US Dollars (USD), or Saudi Riyals (SAR) without unexpected bank conversion surcharges.",
      category: "payments"
    },

    // Hosting
    {
      q: "What server architecture and NVMe storage powers WebzoneBD hosting?",
      a: "Our cloud hosting nodes run enterprise AMD EPYC and Intel Xeon processors with 100% Pure NVMe SSD storage in RAID-10 arrays. Combined with LiteSpeed Web Server and LSCache, your websites achieve up to 20x faster page loading speeds.",
      category: "hosting"
    },
    {
      q: "Do you provide BDIX high-speed direct routing for visitors in Bangladesh?",
      a: "Yes! All Bangladeshi users connect through high-throughput BDIX optical pipelines (1Gbps to 10Gbps local throughput), providing ultra-low latency under 10ms and instant domestic page response times.",
      category: "hosting"
    },
    {
      q: "What is your server uptime guarantee, and is an SSL certificate included for free?",
      a: "We offer a 99.9% network uptime commitment backed by our formal SLA. Every domain and subdomain hosted on our infrastructure receives automated, free Lifetime SSL certificates powered by Let's Encrypt / AutoSSL.",
      category: "hosting"
    },
    {
      q: "How often are automated website backups generated, and how can I restore them?",
      a: "We perform automated daily and weekly offsite cloud backups using JetBackup. You can easily download or restore full website files, individual MySQL databases, or email inboxes in a single click directly from cPanel.",
      category: "hosting"
    },
    {
      q: "Do you offer free website migration assistance from our existing hosting provider?",
      a: "Yes, our technical engineering team handles 100% zero-downtime website and database migrations from your current cPanel, Plesk, or DirectAdmin hosting provider completely free of charge.",
      category: "hosting"
    },

    // Domains
    {
      q: "How quickly is a domain name registered, and who holds legal ownership?",
      a: "Domain registration is instantaneous upon payment confirmation. You maintain 100% legal registrant ownership, administrative rights, transfer authorization codes (EPP), and full DNS management via our dashboard.",
      category: "domains"
    },
    {
      q: "Do you register Bangladeshi .com.bd / .org.bd domains as well as global TLDs?",
      a: "Yes. We facilitate official BTCL registration for Bangladeshi country-code domains (.com.bd, .org.bd, .net.bd, .edu.bd) including document assistance, alongside all international TLDs (.com, .net, .org, .xyz, .io, .ai, .store).",
      category: "domains"
    },
    {
      q: "How long does DNS propagation take after updating nameservers?",
      a: "Local nameserver updates resolve almost instantly (within 15 to 30 minutes), while global worldwide DNS cache propagation across Tier-1 ISPs typically completes within 2 to 24 hours.",
      category: "domains"
    },
    {
      q: "Are there any hidden costs or surprise price hikes during annual domain renewals?",
      a: "Zero hidden charges. Our domain renewal fees are transparently published upfront and pegged directly to standard registry rates, ensuring steady, honest, and predictable renewal costs year after year.",
      category: "domains"
    },
    {
      q: "Is WHOIS privacy protection available to protect my personal contact information?",
      a: "Yes. Free WHOIS ID Protection is included with all eligible top-level domains, safeguarding your personal name, private phone number, and email address from public scrapers, spammers, and telemarketers.",
      category: "domains"
    },

    // Development
    {
      q: "Do you offer custom web development and tailored web application services?",
      a: "Yes! We specialize in crafting bespoke business websites, multi-vendor e-commerce stores, SaaS dashboards, and automated client management systems tailored precisely to your brand's unique operational needs.",
      category: "development"
    },
    {
      q: "What modern tech stacks and frameworks do your developers engineer with?",
      a: "We engineer solutions using React, Next.js, TypeScript, Tailwind CSS, Laravel, PHP 8.3+, Node.js, and PostgreSQL/MySQL, paired with containerized Cloud Run / Docker architecture and automated CI/CD pipelines.",
      category: "development"
    },
    {
      q: "What is your typical project delivery timeline and client revision policy?",
      a: "Standard business websites are delivered in 3 to 7 business days, while comprehensive e-commerce portals require 10 to 14 days. We provide multiple rounds of design & feature revisions until your expectations are 100% met.",
      category: "development"
    },
    {
      q: "Will the developed website be fully mobile responsive and Google SEO friendly?",
      a: "Every application is built mobile-first to guarantee pristine responsiveness across all smartphone, tablet, and desktop screens, compliant with Google Core Web Vitals, Schema.org structured data, and high-speed asset minification.",
      category: "development"
    },
    {
      q: "Do I get full source code ownership and administrative training upon project delivery?",
      a: "Yes. You receive full, unencrypted source code ownership and Git repository access upon final settlement, alongside recorded video walkthroughs or live 1-on-1 walkthrough sessions for your team.",
      category: "development"
    }
  ],
  bn: [
    // Payments
    {
      q: "বাংলাদেশে এবং আন্তর্জাতিকভাবে কী কী পেমেন্ট মেথড বা গেটওয়ে আপনারা সাপোর্ট করেন?",
      a: "বাংলাদেশে আমাদের রয়েছে বিকাশ, নগদ, রকেট, উপায় এবং এসএসএলকমার্জ (SSLCommerz) এর মাধ্যমে যেকোনো ব্যাংকের ভিসা ও মাস্টারকার্ড পেমেন্ট সুবিধা। আন্তর্জাতিক গ্রাহকদের জন্য রয়েছে পে-পাল (PayPal) এবং স্ট্রাইপ (Stripe) এর মাধ্যমে সুরক্ষিত পেমেন্ট গেটওয়ে।",
      category: "payments"
    },
    {
      q: "পেমেন্ট সম্পন্ন করার পর কি অফিশিয়াল ডিজিটাল ইনভয়েস ও রিসিট পাওয়া যাবে?",
      a: "হ্যাঁ, পেমেন্ট সফল হওয়ার সাথে সাথেই আপনার ক্লায়েন্ট ড্যাশবোর্ডে ইউনিক ইনভয়েস আইডি এবং লেনদেনের পূর্ণ বিবরণসহ ডিজিটাল ইনভয়েস জেনারেট হবে এবং স্বয়ংক্রিয়ভাবে আপনার ইমেইলে পাঠিয়ে দেওয়া হবে।",
      category: "payments"
    },
    {
      q: "আপনাদের সার্ভিস বা হোস্টিং প্যাকেজের রিফান্ড পলিসি ও গ্যারান্টি কেমন?",
      a: "আমাদের শেয়ার্ড ও ক্লাউড হোস্টিং সেবায় শর্তহীন ৭ দিনের মানি-ব্যাক গ্যারান্টি প্রদান করা হয়। কাস্টম ডেভেলপমেন্ট কাজের ক্ষেত্রে সুনির্দিষ্ট মাইলস্টোন অনুযায়ী ক্লায়েন্টের অনুমোদন সাপেক্ষে স্বচ্ছ নিয়মাবলি প্রযোজ্য।",
      category: "payments"
    },
    {
      q: "বড় কাস্টম ওয়েব ডেভেলপমেন্ট প্রজেক্টে কি ধাপে ধাপে (Milestone ভিত্তিক) পেমেন্ট করা যায়?",
      a: "হ্যাঁ, বড় মাপের ওয়েবসাইট বা সফটওয়্যার ডেভেলপমেন্টে আমরা সহজ মাইলস্টোন পেমেন্ট সুবিধা দিই (যেমন: প্রাথমিক কাজের সূচনায় ৪০%, বিটা ডেমো অনুমোদনের পর ৩০%, এবং সাইট লাইভ ও সোর্স কোড হস্তান্তরের সময় বাকি ৩০%)।",
      category: "payments"
    },
    {
      q: "আমি কি বাংলাদেশি টাকা (BDT), ইউএস ডলার (USD) বা সৌদি রিয়াল (SAR)-এ পে করতে পারব?",
      a: "হ্যাঁ, আমাদের প্ল্যাটফর্মে রয়েছে মাল্টি-কারেন্সি সাপোর্ট। আপনি খুব সহজেই বিডিটি (BDT), ইউএস ডলার (USD) কিংবা সৌদি রিয়াল (SAR) সিলেক্ট করে কোনো অতিরিক্ত কনভার্শন ফি ছাড়াই পেমেন্ট পরিশোধ করতে পারবেন।",
      category: "payments"
    },

    // Hosting
    {
      q: "আপনাদের হোস্টিং সার্ভারে কী ধরনের হার্ডওয়্যার এবং NVMe স্টোরেজ ব্যবহৃত হয়?",
      a: "আমাদের ক্লাউড হোস্টিং এন্টারপ্রাইজ গ্রেড AMD EPYC ও Intel Xeon প্রসেসর এবং রেইড-১০ প্রযুক্তির ১০০% পিওর NVMe SSD স্টোরেজ দ্বারা পরিচালিত। সাথে লাইটস্পিড (LiteSpeed) ওয়েব সার্ভার থাকায় সাইট সাধারণ হোস্টিংয়ের চেয়ে ২০ গুণ দ্রুত লোড হয়।",
      category: "hosting"
    },
    {
      q: "আপনাদের সার্ভারে কি হাই-স্পিড BDIX কানেক্টিভিটি এবং কম ল্যাটেন্সি সুবিধা রয়েছে?",
      a: "হ্যাঁ, আমাদের হোস্টিং সার্ভার সরাসরি ১Gbps থেকে ১০Gbps ক্ষমতার BDIX পাইপলাইনের সাথে যুক্ত। ফলে বাংলাদেশের যেকোনো প্রান্ত থেকে আপনার ওয়েবসাইটে প্রবেশের সময় পিং ল্যাটেন্সি ১০ মিলি-সেকেন্ডের নিচে থাকে।",
      category: "hosting"
    },
    {
      q: "আপনাদের সার্ভারের আপটাইম গ্যারান্টি কত এবং ফ্রি এসএসএল (SSL) সার্টিফিকেট পাওয়া যাবে কি?",
      a: "আমরা অফিশিয়াল এসএলএ (SLA) সহ ৯৯.৯% নেটওয়ার্ক আপটাইম গ্যারান্টি দিয়ে থাকি। এছাড়া প্রতিটি ডোমেইন ও সাব-ডোমেইনের জন্য লাইফটাইম ফ্রি অটোমেটেড SSL সার্টিফিকেট (Let's Encrypt / AutoSSL) যুক্ত থাকে।",
      category: "hosting"
    },
    {
      q: "ওয়েবসাইটের স্বয়ংক্রিয় ব্যাকআপ কত দিন পর পর তৈরি হয় এবং রিস্টোর করা যায় কিভাবে?",
      a: "JetBackup প্রযুক্তির মাধ্যমে প্রতিদিন এবং প্রতি সপ্তাহে সম্পূর্ণ ক্লাউড ব্যাকআপ স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়। cPanel থেকে মাত্র ১-ক্লিকেই আপনি ওয়েবসাইট ফাইল, ডেটাবেজ বা ইমেইল অ্যাকাউন্ট রিস্টোর করতে পারবেন।",
      category: "hosting"
    },
    {
      q: "অন্য প্রোভাইডার থেকে আপনাদের হোস্টিংয়ে ওয়েবসাইট ট্রান্সফারে কি ফ্রি মাইগ্রেশন সাহায্য পাওয়া যাবে?",
      a: "হ্যাঁ! আপনার বর্তমান যেকোনো cPanel বা কন্ট্রোল প্যানেল থেকে কোনো প্রকার সাইট ডাউনটাইম ছাড়াই আমাদের এক্সপার্ট টিম সম্পূর্ণ বিনামূল্যে আপনার ওয়েবসাইট ও ডেটাবেজ মাইগ্রেশন সম্পন্ন করে দিবে।",
      category: "hosting"
    },

    // Domains
    {
      q: "ডোমেন রেজিস্ট্রেশন সম্পন্ন হতে কত সময় লাগে এবং আইনগত মালিকানা কার থাকবে?",
      a: "পেমেন্ট নিশ্চিত হওয়ার সাথে সাথে স্বয়ংক্রিয়ভাবে ইনস্ট্যান্ট ডোমেইন অ্যাক্টিভ হয়ে যায়। ডোমেইনের ১০০% আইনগত মালিকানা, কন্ট্রোল প্যানেল এবং ট্রান্সফার অথরাইজেশন কোড (EPP) সম্পূর্ণ আপনার নামে থাকবে।",
      category: "domains"
    },
    {
      q: "আপনারা কি বিটিসিএল এর .com.bd ডোমেন এবং গ্লোবাল .com, .net ডোমেন রেজিস্টার করেন?",
      a: "হ্যাঁ, আমরা বিটিসিএল (BTCL) অনুমোদিত .com.bd, .org.bd, .net.bd ডোমেন রেজিস্ট্রেশন ডকুমেন্টেশন সহায়তা সহ করে থাকি। এছাড়া সাধারণ গ্লোবাল ডোমেন যেমন .com, .net, .org, .xyz, .io ইত্যাদি ইনস্ট্যান্ট রেজিস্টার করা যায়।",
      category: "domains"
    },
    {
      q: "নেমসার্ভার পরিবর্তনের পর ডিএনএস (DNS) সক্রিয় হতে কত সময় লাগে?",
      a: "নেমসার্ভার পরিবর্তনের পর স্থানীয়ভাবে ১৫ থেকে ৩০ মিনিটের মধ্যে কার্যকর হয়। তবে বৈশ্বিক আইএসপি প্রোভাইডারদের ক্ষেত্রে সম্পূর্ণ DNS প্রোপাগেশন হতে সাধারণত ২ থেকে ২৪ ঘণ্টা সময় লাগতে পারে।",
      category: "domains"
    },
    {
      q: "বার্ষিক ডোমেন রিনিউ করার সময় কি অতিরিক্ত কোনো হিডেন চার্জ দিতে হয়?",
      a: "একদমই না। আমাদের ওয়েবসাইটে কোনো প্রকার লুকানো চার্জ বা হিডেন ফি নেই। ডোমেন রিনিউ করার পূর্বে স্বচ্ছ ও নির্ধারিত রেজিস্ট্রি ফি অনুযায়ী আপনি রিনিউ করতে পারবেন।",
      category: "domains"
    },
    {
      q: "আমার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে কি WHOIS প্রাইভেসি প্রোটেকশন দেওয়া হয়?",
      a: "হ্যাঁ, সমর্থিত সকল টপ-লেভেল ডোমেনের জন্য আমরা ফ্রি হু-ইজ (WHOIS ID Protection) সুবিধা দিয়ে থাকি। এর ফলে পাবলিক সার্চে আপনার ব্যক্তিগত নাম, ফোন নম্বর বা ইমেইল ঠিকানা স্প্যামারদের হাত থেকে সম্পূর্ণ গোপন থাকে।",
      category: "domains"
    },

    // Development
    {
      q: "আপনারা কি কাস্টম ওয়েবসাইট ও সফটওয়্যার ডেভেলপমেন্ট সেবা প্রদান করেন?",
      a: "অবশ্যই! ক্লায়েন্টদের যেকোনো ব্যবসায়িক চাহিদা অনুযায়ী আমরা কাস্টম কর্পোরেট ওয়েবসাইট, মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম, নিউজ পোর্টাল, স্কুল-কলেজ ম্যানেজমেন্ট এবং স্পেশালাইজড ওয়েব অ্যাপ্লিকেশন তৈরি করে থাকি।",
      category: "development"
    },
    {
      q: "আপনারা সাধারণত কী ধরনের আধুনিক টেকনোলজি এবং ফ্রেমওয়ার্ক ব্যবহার করেন?",
      a: "আমরা আধুনিক ফ্রন্টএন্ডের জন্য React, Next.js, TypeScript ও Tailwind CSS এবং শক্তিশালী ব্যাকএন্ডের জন্য Laravel, PHP 8.3+, Node.js ও PostgreSQL/MySQL ব্যবহার করি, যা সর্বোচ্চ পারফরম্যান্স নিশ্চিত করে।",
      category: "development"
    },
    {
      q: "একটি ওয়েবসাইট তৈরিতে কতদিন সময় লাগে এবং ফ্রি রিভিশন সুবিধা আছে কি?",
      a: "সাধারণত একটি প্রফেশনাল বিজনেস ওয়েবসাইট ৩ থেকে ৭ কর্মদিবসে এবং ই-কমার্স ওয়েবসাইট ১০ থেকে ১৪ কর্মদিবসে সম্পূর্ণ প্রস্তুত করা হয়। ক্লায়েন্ট সন্তুষ্ট না হওয়া পর্যন্ত প্রজেক্টে ফ্রি রিভিশন সুবিধা অন্তর্ভুক্ত থাকে।",
      category: "development"
    },
    {
      q: "তৈরিকৃত ওয়েবসাইটটি কি সম্পূর্ণ মোবাইল ফ্রেন্ডলি এবং গুগল এসইও ফ্রেন্ডলি হবে?",
      a: "হ্যাঁ, প্রতিটি সাইট মোবাইল-ফার্স্ট ডিজাইনে তৈরি করা হয়। ফলে মোবাইল, ট্যাব এবং ল্যাপটপে সাইট নিখুঁতভাবে প্রদর্শিত হয়। এছাড়া গুগল কোর ওয়েব ভাইটালস (Core Web Vitals) এবং টেকনিক্যাল অন-পেজ এসইও নিশ্চিত করা হয়।",
      category: "development"
    },
    {
      q: "কাজ সমাপ্তির পর আমি কি সম্পূর্ণ সোর্স কোডের মালিকানা এবং পরিচালনা প্রশিক্ষণ পাব?",
      a: "হ্যাঁ, ফাইনাল ডেলিভারির সাথে সাথে আপনি ওয়েবসাইটের সম্পূর্ণ আন-এনক্রিপ্টেড সোর্স কোড ও ফুল অ্যাডমিন এক্সেস পাবেন। পাশাপাশি অ্যাডমিন প্যানেল থেকে সহজে পোস্ট, প্রোডাক্ট ও অর্ডার ম্যানেজ করার পূর্ণ গাইডলাইন ও ট্রেনিং দেওয়া হয়।",
      category: "development"
    }
  ],
  ar: [
    // Payments
    {
      q: "ما هي بوابات ووسائل الدفع المدعومة محلياً في بنجلاديش وعالمياً؟",
      a: "في بنجلاديش ندعم محافظ bKash و Nagad و Rocket وبطاقات البنوك عبر SSLCommerz. أما للعملاء الدوليين والخليجيين، فنوفر الدفع الآمن ببطاقات فيزا وماستركارد عبر Stripe وباي بال (PayPal).",
      category: "payments"
    },
    {
      q: "هل سأحصل على فاتورة رسمية وإيصال إلكتروني فوري بعد الدفع؟",
      a: "نعم، فور إتمام عملية الدفع يتم إنشاء فاتورة إلكترونية مفصلة برقم مرجعي فريد في لوحة تحكم العميل، مع إرسال نسخة رسمية مباشرة إلى بريدك الإلكتروني المسجل.",
      category: "payments"
    },
    {
      q: "ما هي سياسة استرجاع الأموال وضمان الجودة للخدمات والاستضافة؟",
      a: "نوفر ضمان استرجاع الأموال لمدة 7 أيام لخدمات الاستضافة السحابية إذا لم تطابق المعايير التقنية المطلوبة. أما للمشاريع البرمجية المخصصة فتتم المدفوعات وفق مراحل إنجاز معتمدة وواضحة.",
      category: "payments"
    },
    {
      q: "هل توفرون إمكانية الدفع على دفعات ومراحل للمشاريع البرمجية الكبيرة؟",
      a: "نعم، للمشاريع وتطبيقات الويب الكبيرة نقدم خطة دفع مقسمة على مراحل (مثلاً: 40% عند بدء المشروع، 30% بعد معاينة النسخة التجريبية، و30% عند الإطلاق النهائي وتسليم الكود المصدري).",
      category: "payments"
    },
    {
      q: "هل يمكنني الدفع بالريال السعودي أو الدولار الأمريكي دون رسوم تحويل إضافية؟",
      a: "بالتأكيد. يمكنك اختيار العملة المفضلة (الريال السعودي SAR، الدولار USD، أو التاكا BDT) من قائمة العملات والدفع مباشرة بالسعر المحدد دون أي مفاجآت في الرسوم المصرفية.",
      category: "payments"
    },

    // Hosting
    {
      q: "ما هي البنية التحتية وسرعات أقراص NVMe المستخدمة في استضافتكم؟",
      a: "سيرفراتنا السحابية مزودة بمعالجات AMD EPYC و Intel Xeon فائقة الأداء مع أقراص تخزين 100% Pure NVMe بنظام RAID-10، وخوادم LiteSpeed التي تضاعف سرعة تحميل موقعك حتى 20 ضعفاً مقارنة بالاستضافة العادية.",
      category: "hosting"
    },
    {
      q: "هل تدعم سيرفراتكم اتصال شبكة BDIX ذات السرعة الفائقة؟",
      a: "نعم، ترتبط سيرفراتنا بمسار شبكة BDIX المحلي بسرعة من 1 إلى 10 جيجابت بالثانية، مما يوفر زمن استجابة منخفض جداً (Ping أقل من 10ms) وتصفحاً فائق السرعة داخل بنجلاديش.",
      category: "hosting"
    },
    {
      q: "ما هو ضمان وقت تشغيل السيرفرات (Uptime) وهل شهادة SSL مجانية؟",
      a: "نضمن جاهزية تشغيل للشبكة بنسبة 99.9% بموجب اتفاقية مستوى الخدمة (SLA). كما تتضمن كل استضافة شهادات أمان SSL مجانية ومدى الحياة تتجدد تلقائياً عبر Let's Encrypt.",
      category: "hosting"
    },
    {
      q: "كم مرة يتم إنشاء نسخ احتياطية للموقع، وكيف يمكنني استعادتها؟",
      a: "يتم أخذ نسخ احتياطية سحابية تلقائية يومياً وأسبوعياً عبر نظام JetBackup، وبإمكانك استعادة ملفات الموقع بالكامل أو قواعد بيانات MySQL بنقرة واحدة من لوحة التحكم cPanel.",
      category: "hosting"
    },
    {
      q: "هل توفرون خدمة نقل المواقع (Migration) مجاناً من المستضيف الحالي؟",
      a: "نعم، يقوم فريق الدعم الفني المتخصص بنقل موقعك وقواعد البيانات بالكامل من المستضيف السابق (سواء cPanel أو Plesk) إلى سيرفراتنا دون أي توقف للموقع وبشكل مجاني تماماً.",
      category: "hosting"
    },

    // Domains
    {
      q: "كم يستغرق حجز النطاق، ولمن تعود ملكيته القانونية الكاملة؟",
      a: "يتم تفعيل حجز النطاق فوراً وبشكل تلقائي بمجرد تأكيد الدفع، وتكون ملكية النطاق القانونية وإدارته ورمز النقل (EPP) والتحكم في سجلات DNS بالكامل مسجلة باسمك وحسابك.",
      category: "domains"
    },
    {
      q: "هل تقدمون حجز النطاقات المحلية (.com.bd) والنطاقات العالمية الشائعة؟",
      a: "نعم، نقدم خدمة تسجيل النطاقات البنغلاديشية الرسمية (.com.bd, .net.bd, .org.bd) مع إتمام الإجراءات الورقية لدى BTCL، بالإضافة لكافة الامتدادات العالمية (.com, .net, .org, .xyz, .io, .ai).",
      category: "domains"
    },
    {
      q: "كم يستغرق انتشار سجلات DNS بعد تعديل أسماء الخوادم (Nameservers)؟",
      a: "يبدأ انتشار DNS محلياً في غضون 15 إلى 30 دقيقة، بينما يكتمل التحديث الشامل لسجلات النطاق على كافة مزودي الإنترنت حول العالم خلال 2 إلى 24 ساعة كحد أقصى.",
      category: "domains"
    },
    {
      q: "هل توجد أي رسوم خفية أو مفاجئة عند تجديد النطاق سنوياً؟",
      a: "لا توجد أي رسوم خفية على الإطلاق. أسعار تجديد النطاقات معلنة بوضوح ومطابقة لأسعار السجلات الرسمية، مما يضمن لك استقرار التكاليف السنوية ووضوحها التام.",
      category: "domains"
    },
    {
      q: "هل تتوفر ميزة حماية خصوصية بيانات WHOIS مجاناً مع النطاق؟",
      a: "نعم، نقدم خدمة حماية الخصوصية (WHOIS Privacy ID Protection) مجاناً لكافة النطاقات العالمية المؤهلة لحجب اسمك الشخصي وبريدك ورقم هاتفك عن رسائل السبام والمسوقين.",
      category: "domains"
    },

    // Development
    {
      q: "هل تقدمون خدمات مخصصة لتطوير وبرمجة المواقع وتطبيقات الويب؟",
      a: "نعم! نتخصص في برمجة المواقع الإلكترونية المخصصة للشركات، المتاجر الإلكترونية المتعددة التجار، منصات SaaS، وتطوير الأنظمة البرمجية المتكاملة وفق أحدث المعايير.",
      category: "development"
    },
    {
      q: "ما هي أحدث التقنيات وأطر العمل التي يعتمد عليها مبرمجوكم؟",
      a: "نعتمد على أحدث حزم التقنيات مثل React و Next.js و TypeScript و Tailwind CSS للواجهات الأمامية، و Laravel و Node.js و PostgreSQL/MySQL للأنظمة الخلفية مع النشر المؤتمت CI/CD.",
      category: "development"
    },
    {
      q: "ما هي المدة التقديرية لتسليم المشروع، وما هي سياسة التعديلات؟",
      a: "تستغرق مواقع الشركات النموذجية من 3 إلى 7 أيام عمل، والمتاجر الإلكترونية الكبيرة من 10 إلى 14 يوماً، مع توفير جولات مراجعة وتعديل مجانية حتى الوصول إلى الرضا التام.",
      category: "development"
    },
    {
      q: "هل سيكون الموقع متوافقاً مع الهواتف الذكية ومحسناً لمحركات البحث SEO؟",
      a: "كافة المواقع التي نصممها تعتمد مبدأ Mobile-First وتعمل بسلاسة فائقة على شاشات الجوال والأجهزة اللوحية، مع ضبط معايير Google Core Web Vitals ومخططات Schema لمحركات البحث.",
      category: "development"
    },
    {
      q: "هل أحصل على ملكية الكود المصدري وتدريب على لوحة التحكم بعد التسليم؟",
      a: "نعم، تحصل على ملكية الكود المصدري غير المشفر بالكامل وروابط مستودعات Git، مع جلسة تدريبية عملية لشرح كيفية إدارة المحتوى والمنتجات والطلبات بسهولة تامة.",
      category: "development"
    }
  ]
};

export const clientTestimonials = [
  {
    name: "Ahmad Al-Harbi",
    role: "CEO, GulfTrading KSA",
    text: "WebzoneBD IT Solution digitized our entire company portal and optimized our local SEO rankings on Google. Highly professional, WhatsApp support is fast and friendly!",
    textBn: "ওয়েবজোনবিডি আমাদের কোম্পানির সম্পূর্ণ পোর্টাল ডিজিটাল করেছে এবং গুগলে চমৎকার এসইও রেজাল্ট এনে দিয়েছে। এদের ব্যবহার ও ২৪/৭ সাপোর্ট অতুলনীয়!",
    textAr: "قامت شركة WebzoneBD IT بتطوير نظام شركتنا بالكامل وتحسين تصنيفنا المحلي في محرك البحث جوجل. دعم فني سريع عبر واتساب ومحترفين جداً!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Sajjad Rahman",
    role: "Proprietor, BazarBD Ltd",
    text: "The ZoneCart Laravel Multi-Vendor script is extremely clean, and easy to modify. Saved us thousands of dollars in customized web development. Highly recommended!",
    textBn: "জোনকার্ট লারাভেল স্ক্রিপ্টটি চমৎকার এবং অত্যন্ত পরিচ্ছন্ন কোডিং। আমাদের কাস্টম সফটওয়্যার তৈরিতে হাজার হাজার ডলার সাশ্রয় করেছে। ধন্যবাদ সকলকে!",
    textAr: "سكربت ZoneCart لارافيل للتجارة الإلكترونية رائع جداً وسهل التخصيص. وفر علينا آلاف الدولارات التي كدنا ننفقها في برمجة خاصة من الصفر.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  }
];
