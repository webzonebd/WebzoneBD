import { Product } from '../types';

export interface StoreCategory {
  id: string;
  name: string;
  nameBn: string;
  nameAr: string;
  description: string;
  descriptionBn: string;
  descriptionAr: string;
  icon?: string;
}

export interface StoreSubCategory {
  id: string;
  categoryId: string;
  name: string;
  nameBn: string;
  nameAr: string;
}

export const defaultStoreCategories: StoreCategory[] = [
  {
    id: "ready-websites",
    name: "Ready Websites",
    nameBn: "তৈরি ওয়েবসাইট",
    nameAr: "المواقع الجاهزة",
    description: "Fully configured and ready-to-launch dynamic website templates.",
    descriptionBn: "সম্পূর্ণ রেডি এবং ইনস্টল করার উপযোগী ডায়নামিক ওয়েবসাইটসমূহ।",
    descriptionAr: "مواقع ويب ديناميكية مهيأة بالكامل وجاهزة للإطلاق المباشر."
  },
  {
    id: "wordpress-themes",
    name: "WordPress Themes",
    nameBn: "ওয়ার্ডপ্রেস থিম",
    nameAr: "قوالب ووردبريس",
    description: "Highly optimized, modern, and SEO friendly themes for WordPress.",
    descriptionBn: "ওয়ার্ডপ্রেসের জন্য হাই-স্পিড এবং এসইও ফ্রেন্ডলি প্রিমিয়াম থিমসমূহ।",
    descriptionAr: "قوالب ووردبريس عصرية ومحسنة للغاية لجميع محركات البحث."
  },
  {
    id: "premium-plugins",
    name: "Premium WordPress Plugins",
    nameBn: "ওয়ার্ডপ্রেস প্রিমিয়াম প্লাগিন",
    nameAr: "إضافات ووردبريس المدفوعة",
    description: "Essential premium add-ons for security, backup, and advanced automation.",
    descriptionBn: "ওয়ার্ডপ্রেসের জন্য প্রয়োজনীয় সিকিউরিটি ও অটোমেশন প্লাগিনসমূহ।",
    descriptionAr: "ملحقات وإضافات برمجية مميزة للأمن والنسخ الاحتياطي والأتمتة."
  },
  {
    id: "news-solutions",
    name: "News Portal Solutions",
    nameBn: "নিউজ পোর্টাল পেজ",
    nameAr: "حلول البوابات الإخبارية",
    description: "Publish your news with highly responsive and smart publishing systems.",
    descriptionBn: "স্মার্ট পাবলিশিং সুবিধা সহ রেসপনসিভ নিউজ পোর্টাল সলিউশন।",
    descriptionAr: "أنظمة وبوابات إخبارية ذكية متكاملة لنشر محتواك بسهولة بالغة."
  },
  {
    id: "ecommerce-solutions",
    name: "E-Commerce Solutions",
    nameBn: "ই-কমার্স সলিউশন",
    nameAr: "حلول التجارة الإلكترونية",
    description: "Stunning designs with multi-vendor management and global checkouts.",
    descriptionBn: "মাল্টি-ভেন্ডর সিস্টেম এবং কাস্টম পেমেন্ট গেটওয়ে সহ ই-কমার্স।",
    descriptionAr: "تصاميم مذهلة مع ميزات البيع الفردي والمشترك وبوابات الدفع."
  },
  {
    id: "microjob-marketplace",
    name: "Microjob Marketplace",
    nameBn: "মাইক্রোজব মার্কেটপ্লেস",
    nameAr: "سوق العمل المصغر",
    description: "Build local or global freelancing platforms with ease.",
    descriptionBn: "ফ্রিল্যান্সার ও কাস্টমার কানেক্ট করার জন্য উন্নত কাজের ওয়েবসাইট।",
    descriptionAr: "برمجيات مخصصة لبناء أسواق ومنصات تشغيل الخدمات المصغرة."
  },
  {
    id: "smm-solutions",
    name: "SMM Panel Solutions",
    nameBn: "এসএমএম প্যানেল সলিউশন",
    nameAr: "حلول لوحات SMM",
    description: "Launch your reseller social media marketing panels instantly.",
    descriptionBn: "অটো এপিআই রিলে সহ আধুনিক সোশ্যাল মিডিয়া রিসেলার প্যানেল।",
    descriptionAr: "منصات متكاملة لإطلاق وإدارة خدمات التسويق وإعادة البيع في جميع المنصات."
  },
  {
    id: "digital-product-store",
    name: "Digital Product Store",
    nameBn: "ডিজিটাল প্রোডাক্ট স্টোর",
    nameAr: "متجر المنتجات الرقمية",
    description: "Sell license keys, digital files, and templates with self-checkout.",
    descriptionBn: "ডিজিটাল লাইসেন্স কী ও ডাউনলোড ফাইল বিক্রির অটোমেটেড স্টোর।",
    descriptionAr: "بيع وتوزيع برمجيات تراخيص الاستخدام والملفات مع الدفع التلقائي."
  },
  {
    id: "php-scripts",
    name: "PHP Scripts",
    nameBn: "পিএইচপি স্ক্রিপ্টস",
    nameAr: "سكربتات PHP المكتوبة",
    description: "Clean, object-oriented PHP codes for dynamic software utilities.",
    descriptionBn: "সহজ ইন্সটলেশন গাইড সহ সিকিউরড পিএইচপি ওয়েব স্ক্রিপ্টসমূহ।",
    descriptionAr: "نصوص برمجية نظيفة بلغة PHP تدعم الأنظمة الخدمية وقواعد البيانات."
  },
  {
    id: "crm-erp-solutions",
    name: "CRM & ERP Solutions",
    nameBn: "সিআরএম ও ইআরপি সফটওয়্যার",
    nameAr: "أنظمة CRM & ERP المؤسسية",
    description: "Manage billing, staff, school assets, and corporate inventories.",
    descriptionBn: "প্রতিষ্ঠান চালনা, স্কুল ম্যানেজমেন্ট ও ইনভেন্টরি অটোমেশন সফটওয়্যার।",
    descriptionAr: "أنظمة مبيعات وموظفين وإدارة المستودعات وتسجيل نفقات الشركات."
  },
  {
    id: "mobile-apps",
    name: "Mobile Apps & Source Code",
    nameBn: "মোবাইল অ্যাপস ও সোর্স কোড",
    nameAr: "تطبيقات الهواتف والأكواد",
    description: "Flutter & React Native cross-platform apps for extreme mobile users.",
    descriptionBn: "অ্যান্ড্রয়েড এবং আইওএস এর জন্য আধুনিক ফ্লাটার সোর্স কোডসমূহ।",
    descriptionAr: "تطبيقات هواتف ذكية جاهزة للتعديل والنشر على متاجر التطبيقات."
  },
  {
    id: "payment-solutions",
    name: "Payment Gateway Solutions",
    nameBn: "পেমেন্ট গেটওয়ে সলিউশন",
    nameAr: "حلول بوابات الدفع الإلكتروني",
    description: "bKash, Nagad, Rocket, SSLCommerz, and Stripe payment modules.",
    descriptionBn: "বিকাশ, নগদ এবং রকেট সহ স্বয়ংক্রিয় পেমেন্ট রিসিভ করার প্লাগইন।",
    descriptionAr: "وحدات بوابات السداد المحلية والخليجية لربط المبيعات برقمك مباشرة."
  },
  {
    id: "dollar-buy-sell",
    name: "Dollar Buy Sell Website",
    nameBn: "ডলার বাই সেল ওয়েবসাইট",
    nameAr: "موقع بيع وشراء الدولار والعملات",
    description: "Start currency exchange platform with live rate management.",
    descriptionBn: "স্বয়ংক্রিয় রেট হিসাব ও এডমিন ম্যানেজমেন্ট সহ ডলার এক্সচেঞ্জ সাইট।",
    descriptionAr: "منصات لتشغيل تبادل العملات الرقمية والوساطة المالية المباشرة স."
  },
  {
    id: "blogger-templates",
    name: "Blogger Templates",
    nameBn: "ব্লগার টেমপ্লেট",
    nameAr: "قوالب بلوجر",
    description: "AdSense ready premium layouts for Google Blogger platforms.",
    descriptionBn: "গুগল ব্লগারস সাইটের জন্য আকর্ষণীয় সুপার ফাস্ট টেমপ্লেটসমূহ।",
    descriptionAr: "قوالب ومواضيع بلوجر جاهزة لاعتماد قوقل أدسنس وتحقيق الأرباح."
  },
  {
    id: "saas-applications",
    name: "SaaS Applications",
    nameBn: "সাস এপ্লিকেশন",
    nameAr: "تطبيقات السحاب SaaS",
    description: "Multi-tenant software architectures to run subscription businesses.",
    descriptionBn: "মাসিক সাবস্ক্রিপশন ভিত্তিক সফটওয়্যার ব্যবসার কাস্টম সেটআপ।",
    descriptionAr: "منصات تشغيل الخدمات المشتركة والاشتراكات الدورية السحابية."
  },
  {
    id: "agency-website",
    name: "Agency Website",
    nameBn: "এজেন্সি ওয়েবসাইট",
    nameAr: "موقع ويب للوكالات والمؤسسات",
    description: "Clean websites for creative, digital, and marketing agencies.",
    descriptionBn: "আইটি বা ডিজিটাল মার্কেটিং এজেন্সির জন্য আকর্ষণীয় পোর্টাল।",
    descriptionAr: "مواقع ويب احترافية ممتازة لعرض وتفصيل خدمات الشركات الخدمية."
  },
  {
    id: "business-website",
    name: "Business Website",
    nameBn: "বিজনেস ওয়েবসাইট",
    nameAr: "מواقع למותגים ועסקים",
    description: "Corporate web setups reflecting professionalism for startups.",
    descriptionBn: "যেকোনো কোম্পানির ব্র্যান্ড প্রমোশনের জন্য প্রফেশনাল ওয়েব পেজ।",
    descriptionAr: "بوابات ومواقع ويب متخصصة للشركات والمصانع الناشئة والكبيرة."
  },
  {
    id: "portfolio-website",
    name: "Portfolio Website",
    nameBn: "পোর্টফোলিও ওয়েবসাইট",
    nameAr: "مواقع السير الذاتية",
    description: "Showcase your professional projects, arts, and photography beautifully.",
    descriptionBn: "ডিজাইনার, ডেভেলপার বা ফ্রিল্যান্সারদের কাজের দারুণ পোর্টফোলিও।",
    descriptionAr: "صفحات الهوية الرقمية للمهندسين والمصممين لكسب المزيد من العملاء."
  },
  {
    id: "educational-website",
    name: "Educational Website",
    nameBn: "শিক্ষামূলক ওয়েবসাইট",
    nameAr: "بوابات تعليمية ومدارس",
    description: "E-learning platforms, online LMS portals, and institutional grids.",
    descriptionBn: "অনলাইন লার্নিং ম্যানেজমেন্ট ও স্কুল-কলেজের জন্য তথ্যবহুল ওয়েবসাইট।",
    descriptionAr: "منصات ومواقع مخصصة للمدارس، أكاديميات التعليم عن بُعد، والجامعات."
  },
  {
    id: "hosting-whmcs",
    name: "Hosting & WHMCS Solutions",
    nameBn: "হোস্টিং ও ডব্লিউএইচএমসিএস",
    nameAr: "حلول الاستضافة ونوافذ WHMCS",
    description: "Run hosting agency with templates and billing configurations.",
    descriptionBn: "হোস্টিং রিসেলার ব্যবসা শুরু করার সম্পূর্ণ সিস্টেম ও সিআরএম গাইড।",
    descriptionAr: "تصاميم متكاملة ولوحات إلكترونية لأتمتة بيع خوادم السيرفرات ومفاتيح النطاق."
  }
];

export const defaultStoreSubCategories: StoreSubCategory[] = [
  // Subcategories
  { id: "ready-news", categoryId: "ready-websites", name: "News Portals", nameBn: "খবরের পোর্টাল", nameAr: "بوابات أخبار" },
  { id: "ready-shop", categoryId: "ready-websites", name: "E-Commerce", nameBn: "ই-কমার্স", nameAr: "متاجر بيع" },
  { id: "ready-custom", categoryId: "ready-websites", name: "Digital Stores", nameBn: "ডিজিটাল স্টোর", nameAr: "متاجر رقمية" },
  { id: "wp-business", categoryId: "wordpress-themes", name: "Business", nameBn: "ব্যবসায়িক থিম", nameAr: "أعمال تجارية" },
  { id: "wp-agency", categoryId: "wordpress-themes", name: "Agency Themes", nameBn: "এজেন্সি থিম", nameAr: "قوالب وكالة" },
  { id: "wp-multipurpose", categoryId: "wordpress-themes", name: "Multipurpose", nameBn: "বহুমুখী থিম", nameAr: "متعددة الاستخدامات" },
  { id: "wp-plugin-seo", categoryId: "premium-plugins", name: "SEO Toolkits", nameBn: "এসইও টুলকিট", nameAr: "أدوات مخصصة للتحسين" },
  { id: "wp-plugin-security", categoryId: "premium-plugins", name: "Security & Shield", nameBn: "নিরাপত্তা প্লাগিন", nameAr: "الأمن البرمجي" },
  { id: "wp-plugin-ai", categoryId: "premium-plugins", name: "AI Writers", nameBn: "এআই রাইটার", nameAr: "منشئ محتوى ذكي" },
];

export const getSeedProducts = (): Product[] => {
  const list: Product[] = [];

  // Helper macro to generate 3 products for any custom category context easily
  const createDemoItems = (
    catId: string, 
    titles: [string, string, string],
    bangles: [string, string, string],
    arabics: [string, string, string],
    stubPrice: number,
    tags: string[],
    unsplashKeys: [string, string, string]
  ) => {
    titles.forEach((title, i) => {
      const isPromo = i === 1;
      const indexStr = i + 1;
      const downloads = Math.floor(Math.random() * 210) + 40;
      const reviews = Math.floor(downloads / 4) + 5;
      
      const badgeList = ['Best Seller', 'Trending', 'New', 'Hot Deal', 'Featured', 'Verified'];
      const badge = badgeList[(Math.floor(stubPrice + i)) % badgeList.length];

      list.push({
        id: `prod-seed-${catId}-${indexStr}`,
        name: title,
        nameBn: bangles[i],
        nameAr: arabics[i],
        category: catId,
        subCategory: `${catId}-sub-${indexStr}`,
        price: stubPrice + (i * 10),
        discountPrice: isPromo ? Math.round((stubPrice + (i * 10)) * 0.7) : undefined,
        rating: parseFloat((4.5 + (i * 0.2)).toFixed(2)),
        reviewsCount: reviews,
        downloadsCount: downloads,
        views: downloads * 12,
        badge: badge,
        isFeatured: indexStr === 1,
        isTrending: indexStr === 2,
        isBestSeller: indexStr === 3,
        licenseType: indexStr === 2 ? 'extended' : 'regular',
        image: `https://images.unsplash.com/${unsplashKeys[i]}?auto=format&fit=crop&w=800&q=80`,
        demoUrl: `https://demo.webzonebd.com/${catId}-v${indexStr}`,
        downloadUrl: `https://webzonebd.com/downloads/${catId}-file-v${indexStr}.zip`,
        tags: [...tags, `v${indexStr}`, "premium"],
        description: title === "Freelance Marketplace Solution"
          ? `Deploy the ultimate professional multi-vendor microjob & custom bidding platform. Supports live project bidding, instant gig sales, multiple payment methods (bKash, Nagad, Stripe, PayPal), and a master admin control panel. Certified source from Techbari: https://techbari.com/product/freelance-marketplace-php-script-download`
          : `Experience supreme performance with our top-grade ${title}. Built with secure modern coding practices, fully optimized, and complete with live dashboard controls for non-technical administrators. Enjoy 1-year developer guarantees and live support.`,
        descriptionBn: title === "Freelance Marketplace Solution"
          ? `তৈরি করুন প্রফেশনাল মাল্টি-ভেন্ডর মাইক্রোজব ও বিডিং মার্কেটপ্লেস পোর্টাল। এই স্ক্রিপ্টে রয়েছে প্রকল্প বিডিং, ইন্সট্যান্ট গিগ সেল, লোকাল গেটওয়ে (বিকাশ, নগদ, রকেট) এবং ফুল কন্ট্রোল এডমিন প্যানেল। ডাউনলোড করুন ভেরিফাইড সোর্স কোড: https://techbari.com/product/freelance-marketplace-php-script-download`
          : `ডিজিটাল গ্রাহকদের সাহায্য করতে আমাদের এই প্রিমিয়াম ${bangles[i]} সলিউশনটি ব্যবহার করুন। এতে রয়েছে সহজ ইনস্টলেশন গাইড, সম্পূর্ণ সুরক্ষিত ডাটাবেস সিকিউরিটি ফ্রেমওয়ার্ক এবং ফ্রি লাইভ সাপোর্ট সার্ভিস।`,
        descriptionAr: title === "Freelance Marketplace Solution"
          ? `برمجية متكاملة تماماً لإدارة مشاريع العمل الحر والعروض وبوابات المسابقات المصغرة بالتكامل مع المحفظة الرقمية المتوافقة مع بوابات الدفع. رابط التحميل: https://techbari.com/product/freelance-marketplace-php-script-download`
          : `استمتع بتجربة أداء مذهلة مع ${arabics[i]} الاحترافي المدعوم بضمان أمني فائق ولوحة قيادة واضحة وسهلة الاستخدام للمبتدئين والمطورين بشكل شامل.`,
        features: [
          "100% Fully Responsive Layout",
          "Advanced Admin Settings Control Panel",
          "Optimized Loading Speeds Under 0.8s",
          "Complete Security Integration Suite",
          "One-Click Demo Content Import Tool"
        ],
        featuresBn: [
          "১০০% ফুল্লি রেসপনসিভ লেআউট ডিজাইন",
          "উন্নত ও ডায়নামিক এডমিন সেটিংস প্যানেল",
          "০.৮ সেকেন্ডের চরম ফাস্ট লোডিং স্পিড",
          "সম্পূর্ণ সুরক্ষিত ডাটাবেস সিকিউরিটি",
          "১ ক্লিকে ফাইল এবং ডেমো সেটআপ টুল"
        ],
        featuresAr: [
          "تصميم متكامل ومتجاوب بالكامل مع الهواتف والأجهزة اللوحية",
          "لوحة تحكم إدارية متطورة وسهلة التعديل والتهيئة",
          "سرعة تحميل فائقة الأداء تقل عن 0.8 ثانية",
          "حزمة الأمان والحماية القصوى من الثغرات البرمجية",
          "استيراد محتوى المعاينة بضغطة زر واحدة بكل سلاسة"
        ]
      });
    });
  };

  // 1. Ready Websites
  createDemoItems(
    "ready-websites",
    ["Ready News Portal Website", "Ready E-Commerce Website", "Ready Digital Store Website"],
    ["রেডি নিউজ পোর্টাল ওয়েবসাইট", "রেডি ই-কমার্স ওয়েবসাইট", "রেডি ডিজিটাল স্টোর ওয়েবসাইট"],
    ["موقع إخباري جاهز للتدشين", "متجر إلكتروني جاهز بالكامل", "متجر منتجات رقمية جاهز للتفعيل"],
    249,
    ["Ready Website", "Live site", "Ready Portal"],
    ["photo-1542831371-29b0f74f9713", "photo-1557821552-17105176677c", "photo-1472851294608-062f824d29cc"]
  );

  // 2. WordPress Themes
  createDemoItems(
    "wordpress-themes",
    ["Premium Business Theme", "Agency Theme Pro", "Multipurpose Theme"],
    ["প্রিমিয়াম বিজনেস ওয়ার্ডপ্রেস থিম", "এজেন্সি থিম প্রো", "বহুমুখী মাল্টিপারপাস থিম"],
    ["قالب الأعمال التجاري ووردبريس", "قالب وكالة التصميم والتسويق", "القالب المتعدد الشامل"],
    39,
    ["WP Theme", "WordPress", "Elementor Theme"],
    ["photo-1517694712202-14dd9538aa97", "photo-1551434678-e076c223a692", "photo-1486312338219-ce68d2c6f44d"]
  );

  // 3. Premium WordPress Plugins
  createDemoItems(
    "premium-plugins",
    ["SEO Toolkit Pro", "Security Shield Pro", "AI Content Generator"],
    ["এসইও টুলকিট প্রো প্লাগিন", "সিকিউরিটি শিল্ড প্রো", "এআই কনটেন্ট রাইটার প্লাগিন"],
    ["حزمة تحسين محركات البحث برو", "درع الأمن وبوابة الحماية القصوى", "مولد المحتوى الذكي ووردبريس"],
    29,
    ["Plugin", "WP Plugin", "Useful Tools"],
    ["photo-1516321318423-f06f85e504b3", "photo-1550751827-4bd374c3f58b", "photo-1677442136019-21780efad99a"]
  );

  // 4. News Portal Solutions
  createDemoItems(
    "news-solutions",
    ["News Portal Pro", "Newspaper Website Bundle", "Auto News Publishing System"],
    ["নিউজ পোর্টাল প্রো পিএইচপি", "নিউজপেপার ওয়েবসাইট কম্বো", "অটো নিউজ পাবলিশিং সিস্টেম"],
    ["نظام بورتال الأخبار الاحترافي", "حزمة الصحف والمجلات المتكاملة", "نشر أخبار قوقل التلقائي ديسكভার"],
    99,
    ["News script", "Mag", "Portal"],
    ["photo-1504711434969-e33886168f5c", "photo-1526470608268-f674ce90ebd4", "photo-1451187580459-43490279c0fa"]
  );

  // 5. E-Commerce Solutions
  createDemoItems(
    "ecommerce-solutions",
    ["Premium WooCommerce Solution", "Multi-Vendor Marketplace", "Shopify Custom OS Hub"],
    ["প্রিমিয়াম উকমার্স সলিউশন", "ডায়নামিক মাল্টি-ভেন্ডর মার্কেটপ্লেস", "শপিফাই কাস্টম ওএস ওয়ান-ক্লিক"],
    ["باقة ووكومرس المتكاملة للمبيعات", "سوق التجار المتكامل ومتعدد البائعين", "موقع شوبيفاي المخصص بأحدث هيكل"],
    129,
    ["WooCommerce", "Cart", "E-com"],
    ["photo-1557821552-17105176677c", "photo-1522202176988-66273c2fd55f", "photo-1511512578047-dfb367046420"]
  );

  // 6. Microjob Marketplace
  createDemoItems(
    "microjob-marketplace",
    ["Ready Microjob Website", "WorkupJob Clone", "Freelance Marketplace Solution"],
    ["তৈরি স্পেশাল মাইক্রোজব সাইট", "ওয়ার্কআপজব ক্লোন স্ক্রিপ্ট", "ফ্রিল্যান্স মার্কেটপ্লেস পোর্টাল"],
    ["موقع تشغيل المائكرو جوب للأعمال", "برمجية مستنسخة من وورك اب جوب", "حلول بوابات التوظيف والعمل الحر"],
    149,
    ["Microjob", "WorkupJob", "Freelance"],
    ["photo-1515378791036-0648a3ef77b2", "photo-1522071820081-009f0129c71c", "photo-1507537297725-24a1c029d3ca"]
  );

  // 7. SMM Panel Solutions
  createDemoItems(
    "smm-solutions",
    ["SMM Panel Website", "Social Media Marketing Platform", "Reseller SMM Panel"],
    ["ইন্সট্যান্ট এসএমএম প্যানেল ওয়েবসাইট", "সোশ্যাল মিডিয়া মার্কেটিং স্ক্রিপ্ট", "রিসেলার এসএমএম এপিআই প্যানেল"],
    ["موقع لوحة SMM الجاهز للربط", "منصة متطورة لتسويق حسابات التواصل", "لوحات SMM مخصصة للموزعين والمتاجر"],
    49,
    ["SMM Panel", "API Panel", "Social Provider"],
    ["photo-1611162617213-7d7a39e9b1d7", "photo-1611162616305-c69b3fa7fbe0", "photo-1432821596592-e2c18b78144f"]
  );

  // 8. Digital Product Store
  createDemoItems(
    "digital-product-store",
    ["Theme Marketplace", "Digital Download Store", "License Management Platform"],
    ["থিম এবং ফাইল সেলিং মার্কেটপ্লেস", "ডিজিটাল ডাউনলোড স্টোর স্ক্রিপ্ট", "লাইসেন্স ও অ্যাক্টিভেশন ম্যানেজমেন্ট"],
    ["سوق لبيع القوالب والملفات الرقمية", "متجر التحميل المباشر للمنتجات", "نظام توزيع تراخيص ومفاتيح البرامج"],
    89,
    ["Envato Clone", "Downloads Store", "License key"],
    ["photo-1523275335684-37898b6baf30", "photo-1593642532400-2682810df593", "photo-1454165804606-c3d57bc86b40"]
  );

  // 9. PHP Scripts
  createDemoItems(
    "php-scripts",
    ["Microjob Script", "Betting Script", "SMM Panel Script"],
    ["প্রফেশনাল মাইক্রোজব পিএইচপি স্ক্রিপ্ট", "বেটিং এবং গেমিং কাস্টম স্ক্রিপ্ট", "এডভান্স এসএমএম প্যানেল স্ক্রিপ্ট"],
    ["سكربت العمل المصغر PHP نظيف", "سكربت ألعاب التوقع والتداول", "مجموعة سكربت SMM المدفوعة الجاهزة"],
    49,
    ["PHP", "Web utility", "Pure scripts"],
    ["photo-1542831371-29b0f74f9713", "photo-1531403009284-440f080d1e12", "photo-1550751827-4bd374c3f58b"]
  );

  // 10. CRM & ERP Solutions
  createDemoItems(
    "crm-erp-solutions",
    ["School ERP", "Business CRM", "Inventory ERP"],
    ["স্মার্ট স্কুল ইআরপি সফটওয়্যার", "অটোমেটেড বিজনেস সিআরএম পোর্টাল", "ইনভেন্টরি অ্যান্ড একাউন্টস ইআরপি"],
    ["نظام المدرسة المتكامل التعليمي ERP", "برنامج CRM المخصص لإدارة العملاء", "إدارة المخازن النقدية والحسابات ERP"],
    199,
    ["School ERP", "CRM", "Inventory System"],
    ["photo-1507238691740-187a5b1d37b8", "photo-1552581230-c01bc0d48453", "photo-1586528116311-ad8dd3c8310d"]
  );

  // 11. Mobile Apps & Source Code
  createDemoItems(
    "mobile-apps",
    ["News App Source Code", "E-Commerce App", "Delivery App"],
    ["নিউজ মোবাইল অ্যাপস সোর্স কোড", "ই-কমার্স ফ্লাটার মোবাইল অ্যাপ", "হোম ডেলিভারি সম্পূর্ণ অ্যাপ সোর্স"],
    ["كود تطبيق الأخبار فلاتر متجاوب", "تطبيق المتجر الإلكتروني للآيفون", "تطبيق خدمات الشحن والتوصيل المتكامل"],
    119,
    ["Flutter", "React Native", "Android source"],
    ["photo-1512941937669-90a1b58e7e9c", "photo-1555421689-491a97ff2040", "photo-1526738549149-8e07eca6c147"]
  );

  // 12. Payment Gateway Solutions
  createDemoItems(
    "payment-solutions",
    ["SSLCommerz Integration", "bKash Payment Module", "Nagad Payment Gateway"],
    ["এসএসএলকমার্জ অটোমেটেড প্লাগইন", "বিকাশ ইনস্ট্যান্ট পেমেন্ট রিসিভার", "নগদ পেমেন্ট গেটওয়ে মডিউল"],
    ["بوابة دفع اس اس ال كوميرز", "وحدة دفع بيكاش المفعلة بالكامل", "موديول سداد نقاد للمبيعات السريعة"],
    29,
    ["Payments bKash", "SSLCommerz", "Payment modules"],
    ["photo-1559526324-4b87b5e36e44", "photo-1563013544-824ae1d704d3", "photo-1556742049-0cfed4f6a45d"]
  );

  // 13. Dollar Buy Sell Website
  createDemoItems(
    "dollar-buy-sell",
    ["Dollar Exchange Platform", "Currency Trading Website", "Dollar Marketplace Script"],
    ["ডলার বাই সেল এক্সচেঞ্জ প্ল্যাটফর্ম", "কারেন্সি ট্রেডিং রিয়েলটাইম সাইট", "ডলার কেনাবেচা করার ডাইনামিক স্ক্রিপ্ট"],
    ["منصة تبادل وسداد الدولار الرقمية", "موقع تداول العملات ريت حقيقي", "سكربت تبادل أرصدة بنوك إلكترونية"],
    159,
    ["Currency exchanger", "Exchange", "Dollar buy-sell"],
    ["photo-1621416894569-0f39ed31d247", "photo-1590283603385-17ffb3a7f29f", "photo-1611974789855-9c2a0a7236a3"]
  );

  // 14. Blogger Templates
  createDemoItems(
    "blogger-templates",
    ["Premium News Blogger Theme", "Portfolio Minimal Blogger", "AdSense Optimized Blogger"],
    ["প্রিমিয়াম নিউজ ব্লগার টেমপ্লেট", "পোর্টফোলিও মিনিমাল ব্লগার থিম", "অ্যাডসেন্স অপ্টিমাইজড সেরা ব্লগার থিম"],
    ["قالب بلوجر الإخباري ذو المظهر الأنيق", "قالب السيرة الذاتية البسيط بلوقر", "قالب بلوجر مهيأ بالكامل لادسنس"],
    12,
    ["Blogger theme", "Blogspot XML", "Instant load"],
    ["photo-1499750310107-5fef28a66643", "photo-1488190211105-8b0e65b80b4e", "photo-1457369804613-52c61a468e7d"]
  );

  // 15. SaaS Applications
  createDemoItems(
    "saas-applications",
    ["Multi-tenant SaaS CRM", "AI Chat Agency SaaS", "Project Management Grid"],
    ["মাল্টি-ট্যানেন্ট সাস ইআরএম সফটওয়্যার", "এআই চ্যাট এজেন্সি সাস প্ল্যাটফর্ম", "প্রজেক্ট ম্যানেজমেন্ট গ্রিড সফটওয়্যার"],
    ["برنامج CRM متعدد المستأجرين سحابي", "أكاديمية الذكاء الاصطناعي SaaS", "جدولة وإدارة مشاريع الفريق SaaS"],
    189,
    ["SaaS CRM", "Multi tenant", "AI Application"],
    ["photo-1551434678-e076c223a692", "photo-1618005182384-a83a8bd57fbe", "photo-1507238691740-187a5b1d37b8"]
  );

  // 16. Agency Website
  createDemoItems(
    "agency-website",
    ["Creative Agency Portal", "Marketing Agency Web", "Digital Brand Showcase"],
    ["ক্রিয়েটিভ এজেন্সি ইনফো পোর্টাল", "নিউজ জেনারেশন মার্কেটিং ওয়েবসাইট", "ডিজিটাল ব্র্যান্ড কাস্টম শোকেস"],
    ["موقع وكالة التصميم والإبداع الرقمي", "صفحة الهبوط لوكالات التسويق الالكتروني", "منصة عرض الهويات وبناء العلامات"],
    59,
    ["Agency Web", "Creative", "Bootstrap"],
    ["photo-1454165804606-c3d57bc86b40", "photo-1542744173-8e0856c166d5", "photo-1517245386807-bb43f82c33c4"]
  );

  // 17. Business Website
  createDemoItems(
    "business-website",
    ["Corporate Business Hub", "Consulting Pro Website", "Startup Launchpage"],
    ["কর্পোরেট বিজনেস হাব ওয়েবসাইট", "কনসাল্টিং প্রফেশনাল ওয়েবসাইট", "স্টার্টআপ লঞ্চপ্যাড ল্যান্ডিং পেজ"],
    ["موقع الشركات والمجموعات القابضة", "موقع استشارات النظم والحلول", "موقع التعريف للشركات الناشئة ستارت اب"],
    59,
    ["Corporate", "Business", "Startup Page"],
    ["photo-1486406146926-c627a92ad1ab", "photo-1491975474562-1f4e30bc9468", "photo-1551836022-d5d88e9218df"]
  );

  // 18. Portfolio Website
  createDemoItems(
    "portfolio-website",
    ["Designer Creative Portfolio", "Developer Portfolio Pro", "Photography Gallery Studio"],
    ["আকর্ষণীয় ডিজাইনার ক্রিয়েটিভ পোর্টফোলিও", "প্রফেশনাল ডেভেলপার পোর্টফোলিও", "ফটোগ্রাফি গ্যালারি ডিজিটাল স্টুডিও"],
    ["معرض أعمال المصممين والمطورين ثلاثي", "ملف أعمال المطور الاحترافي المرموز", "معرض صور استوديو فوتوغرافي متفاعل"],
    49,
    ["Portfolio", "My site", "Tailwind site"],
    ["photo-1507679799987-c73779587ccf", "photo-1517694712202-14dd9538aa97", "photo-1452587925148-ce544e77e70d"]
  );

  // 19. Educational Website
  createDemoItems(
    "educational-website",
    ["College Dynamic Portal", "Online Course LMS", "School Classic Site"],
    ["কলেজ ডায়নামিক ইনফো পোর্টাল", "অনলাইন লার্নিং ম্যানেজমেন্ট এলএমএস", "স্কুল ক্লাসিক রেসপন্সিভ ওয়েবসাইট"],
    ["موقع الكليات والمعاهد الديناميكي", "منصة لبيع الدورات نظام LMS ذكي", "موقع المدارس والاقسام الابتدائية الكلاسيكي"],
    99,
    ["School web", "LMS", "Course sales"],
    ["photo-1523050854058-8df90110c9f1", "photo-1516321318423-f06f85e504b3", "photo-1503676260728-1c00da094a0b"]
  );

  // 20. Hosting & WHMCS Solutions
  createDemoItems(
    "hosting-whmcs",
    ["Hosting Website", "WHMCS Setup", "Domain Reseller Website"],
    ["প্রফেশনাল হোস্টিং ও ডোমেইন ওয়েবসাইট", "ডব্লিউএইচএমসিএস সম্পূর্ণ সেটআপ গাইড", "ডোমেইন রিসেলার অটোমেটেড ওয়েবসাইট"],
    ["موقع خدمات الاستضافة جاهز كليا", "تثبيت وإعداد بوابة WHMCS سداد تلقائي", "موقع الموزعين لبيع النطاقات وسجلات قوقل"],
    119,
    ["Hosting", "WHMCS", "Domain shop"],
    ["photo-1558494949-ef010cbdcc31", "photo-1563986768609-322da13575f3", "photo-1551836022-b5d88e9218df"]
  );

  return list;
};
