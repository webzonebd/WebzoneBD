import { 
  Rocket, 
  Store, 
  Building2, 
  ShoppingCart, 
  ShoppingBag, 
  Code2, 
  GraduationCap, 
  Stethoscope, 
  Building, 
  Plane, 
  HeartHandshake, 
  UserCheck, 
  Sparkles,
  Newspaper
} from 'lucide-react';

export interface CompanyCategoryItem {
  id: string;
  name: string;
  nameBn: string;
  nameAr: string;
  badge: string;
  badgeBn: string;
  icon: any;
  color: string;
  multiplier: number;
  description: string;
  descriptionBn: string;
  recommendedFeatures: string[];
  smartTips: {
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
  };
}

export const COMPANY_CATEGORIES: CompanyCategoryItem[] = [
  {
    id: 'startup',
    name: 'Startup',
    nameBn: 'স্টার্টআপ (Startup)',
    nameAr: 'شركة ناشئة',
    badge: 'Fast Growth',
    badgeBn: 'ফাস্ট গ্রোথ',
    icon: Rocket,
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    multiplier: 1.0,
    description: 'MVP development, rapid scaling, high-converting landing pages and cloud architecture.',
    descriptionBn: 'দ্রুত এমভিপি লঞ্চ, হাই-কনভার্টিং ল্যান্ডিং পেজ ও স্কেলেবল ক্লাউড ব্যাকএন্ড।',
    recommendedFeatures: ['payment_gateway', 'admin_panel', 'seo_setup'],
    smartTips: {
      title: 'Startup Scaling Recommendation',
      titleBn: 'স্টার্টআপ স্কেলিং সুপারিশ',
      description: 'Prioritize fast MVP validation with automated payment integration and SEO indexing to capture early market share.',
      descriptionBn: 'দ্রুত মার্কেট টেস্টের জন্য অটোমেটেড পেমেন্ট এবং এসইও অপ্টিমাইজেশন যুক্ত করার পরামর্শ দেওয়া হচ্ছে।'
    }
  },
  {
    id: 'small_business_sme',
    name: 'Small Business (SME)',
    nameBn: 'স্মল বিজনেস (SME)',
    nameAr: 'شركات صغيرة ومتوسطة',
    badge: 'Reliable',
    badgeBn: 'নির্ভরযোগ্য',
    icon: Store,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    multiplier: 1.05,
    description: 'Local business web footprint, client inquiries capture, WhatsApp leads and local SEO.',
    descriptionBn: 'লোকাল বিজনেস ব্রান্ডিং, ক্লায়েন্ট ইনকোয়ারি কালেকশন এবং হোয়াটসঅ্যাপ ডিরেক্ট লিডস।',
    recommendedFeatures: ['payment_gateway', 'seo_setup', 'multi_language'],
    smartTips: {
      title: 'Local SME Growth Kit',
      titleBn: 'এসএমই গ্রোথ প্যাকেজ টিপস',
      description: 'Incorporate local Google Maps SEO and multi-language support to attract local neighborhood and regional buyers.',
      descriptionBn: 'লোকাল কাস্টমার আকর্ষণ করতে গুগল ম্যাপ এসইও এবং বাংলা-ইংরেজি উভয় ভাষা সাপোর্ট অন্তর্ভুক্ত করুন।'
    }
  },
  {
    id: 'enterprise_company',
    name: 'Enterprise Company',
    nameBn: 'এন্টারপ্রাইজ কোম্পানি',
    nameAr: 'شركات كبرى ومؤسسات',
    badge: 'High Security',
    badgeBn: 'হাই সিকিউরিটি',
    icon: Building2,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    multiplier: 1.35,
    description: 'Multi-role RBAC, SLA guarantee, hardened cybersecurity, high-load architecture.',
    descriptionBn: 'মাল্টি-রোল অ্যাক্সেস কন্ট্রোল, সর্বোচ্চ সাইবার সিকিউরিটি ও হাই-লোড সার্ভার অবকাঠামো।',
    recommendedFeatures: ['admin_panel', 'cloud_hosting', 'custom_api', 'multi_language'],
    smartTips: {
      title: 'Enterprise Architecture Framework',
      titleBn: 'এন্টারপ্রাইজ ফ্রেমওয়ার্ক প্ল্যান',
      description: 'Deploy dedicated Cloud Server Hosting with custom API integrations and automated daily backup routines.',
      descriptionBn: 'উচ্চ পারফরম্যান্সের জন্য ডেডিকেটেড ক্লাউড হোস্টিং এবং কাস্টম এপিআই ইন্টিগ্রেশন বেছে নিন।'
    }
  },
  {
    id: 'ecommerce_business',
    name: 'E-commerce Business',
    nameBn: 'ই-কমার্স বিজনেস',
    nameAr: 'متاجر إلكترونية وتجارة',
    badge: 'High Conversion',
    badgeBn: 'সেলস বুস্টিং',
    icon: ShoppingCart,
    color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    multiplier: 1.2,
    description: 'Automated bKash/Nagad/Cards checkout, courier tracking API, inventory stock sync.',
    descriptionBn: 'অটো পেমেন্ট গেটওয়ে, কুরিয়ার ট্র্যাকিং এপিআই ও রিয়েলটাইম ইনভেন্টরি ম্যানেজমেন্ট।',
    recommendedFeatures: ['payment_gateway', 'admin_panel', 'seo_setup', 'cloud_hosting'],
    smartTips: {
      title: 'E-Commerce Conversion Suite',
      titleBn: 'ই-কমার্স সেলস টিপস',
      description: 'Combine instant bKash/Nagad checkout and SEO optimization to boost conversion rates and minimize cart abandonment.',
      descriptionBn: 'কার্ট অ্যাবান্ডন কমাতে বিকাশ/নগদ অটো পেমেন্ট ও সুপারফাস্ট হোস্টিং সিলেক্ট করা হয়েছে।'
    }
  },
  {
    id: 'retail_shop',
    name: 'Retail Shop',
    nameBn: 'রিটেইল শপ / শোরুম',
    nameAr: 'متاجر تجزئة ومعارض',
    badge: 'POS & Inventory',
    badgeBn: 'পিওএস ও স্টক',
    icon: ShoppingBag,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    multiplier: 1.1,
    description: 'Barcode scanning, point of sale register, daily profit-loss ledger, receipt printing.',
    descriptionBn: 'বারকোড স্ক্যানার, পিওএস রেজিস্টার, ক্যাশ ড্রয়ার ও রসিদ প্রিন্টিং সাপোর্ট।',
    recommendedFeatures: ['admin_panel', 'payment_gateway', 'cloud_hosting'],
    smartTips: {
      title: 'Physical Outlet POS Setup',
      titleBn: 'রিটেইল শপ অটোমেশন',
      description: 'Pair your online catalog with dynamic admin management to sync in-store sales and online orders seamlessly.',
      descriptionBn: 'শোরুম ও অনলাইন স্টক একসাথে পরিচালনা করতে ডাইনামিক অ্যাডমিন প্যানেল সক্রিয় রাখুন।'
    }
  },
  {
    id: 'it_software_company',
    name: 'IT & Software Company',
    nameBn: 'আইটি ও সফটওয়্যার কোম্পানি',
    nameAr: 'شركات تقنية وبرمجيات',
    badge: 'Tech Stack',
    badgeBn: 'টেক স্ট্যাক',
    icon: Code2,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    multiplier: 1.25,
    description: 'SaaS portals, API documentation, developer sandboxes, clean React/Next.js codebases.',
    descriptionBn: 'সাস পোর্টাল, এপিআই ডক্স, আধুনিক রিঅ্যাক্ট/নেক্সট জেএস ও অটোমেটেড সিআই/সিডি।',
    recommendedFeatures: ['custom_api', 'cloud_hosting', 'admin_panel'],
    smartTips: {
      title: 'SaaS Ready Architecture',
      titleBn: 'সাস আর্কিটেকচার সুপারিশ',
      description: 'Incorporate custom REST APIs and secure cloud hosting to handle complex SaaS web application loads.',
      descriptionBn: 'জটিল ডেটা হ্যান্ডলিং ও এপিআই কানেকশনের জন্য কাস্টম এপিআই মডিউল নির্বাচন করুন।'
    }
  },
  {
    id: 'blog_and_news_portal',
    name: 'Blog and News Portal',
    nameBn: 'ব্লগ ও নিউজ পোর্টাল',
    nameAr: 'مدونة وبوابة إخبارية',
    badge: 'High Traffic & AdSense',
    badgeBn: 'হাই ট্রাফিক ও অ্যাডসেন্স',
    icon: Newspaper,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    multiplier: 1.05,
    description: 'Breaking news ticker, category taxonomies, Google AdSense ready, video embed & high-load CDN.',
    descriptionBn: 'ব্রেকিং নিউজ টিকার, ক্যাটাগরি আর্টিকেলিং, গুগল অ্যাডসেন্স অপ্টিমাইজেশন ও হাই-ট্রাফিক ক্যাশিং।',
    recommendedFeatures: ['admin_panel', 'seo_setup', 'cloud_hosting', 'multi_language'],
    smartTips: {
      title: 'Newsroom & Editorial CMS Suite',
      titleBn: 'নিউজ ও এডিটোরিয়াল পোর্টাল টিপস',
      description: 'Prioritize ultra-fast page caching, Google Discover SEO, and easy category management for viral readership.',
      descriptionBn: 'উচ্চ ট্রাফিক ও দ্রুত পেইজ লোডের জন্য সুপারফাস্ট ক্লাউড হোস্টিং ও গুগল ডিসকভার এসইও চালু রাখুন।'
    }
  },
  {
    id: 'educational_institute',
    name: 'Educational Institute',
    nameBn: 'শিক্ষা প্রতিষ্ঠান / ইনস্টিটিউট',
    nameAr: 'مؤسسات تعليمية وأكاديميات',
    badge: 'LMS & Portal',
    badgeBn: 'এলএমএস পোর্টাল',
    icon: GraduationCap,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    multiplier: 1.15,
    description: 'Student admission portal, automated results, attendance records, online tuition fees.',
    descriptionBn: 'অনলাইন ভর্তি, রেজাল্ট শিট পাবলিশিং, বেতন ফি কালেকশন ও নোটিশ বোর্ড।',
    recommendedFeatures: ['payment_gateway', 'admin_panel', 'multi_language'],
    smartTips: {
      title: 'Institute Digitalization Suite',
      titleBn: 'শিক্ষা প্রতিষ্ঠান ডিজিটালাইজেশন',
      description: 'Enable online fees payment through bKash/Nagad and multi-language support for parents and students.',
      descriptionBn: 'অভিভাবকদের সুবিধার জন্য অনলাইন ফি কালেকশন গেটওয়ে এবং দ্বিভাষিক নোটিশ সাপোর্ট চালু রাখুন।'
    }
  },
  {
    id: 'healthcare_medical',
    name: 'Healthcare & Medical',
    nameBn: 'হেলথকেয়ার ও মেডিকেল',
    nameAr: 'رعاية صحية ومراكز طبية',
    badge: 'Appointments',
    badgeBn: 'ডক্টর সিরিয়াল',
    icon: Stethoscope,
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    multiplier: 1.2,
    description: 'Doctor appointment scheduling, diagnostic reports download, telemedicine portal.',
    descriptionBn: 'ডাক্তারের সিরিয়াল বুকিং, ডায়াগনস্টিক রিপোর্ট ডাউনলোড ও পেশেন্ট পোর্টাল।',
    recommendedFeatures: ['admin_panel', 'payment_gateway', 'seo_setup'],
    smartTips: {
      title: 'Patient Care & Appointment System',
      titleBn: 'পেশেন্ট কেয়ার ও অ্যাপয়েন্টমেন্ট টিপস',
      description: 'Implement direct patient appointment booking with SMS notification confirmations and doctor schedule management.',
      descriptionBn: 'রোগীদের জন্য সহজ অনলাইন অ্যাপয়েন্টমেন্ট বুকিং ও ডায়নামিক অ্যাডমিন প্যানেল যুক্ত করুন।'
    }
  },
  {
    id: 'real_estate_company',
    name: 'Real Estate Company',
    nameBn: 'রিয়েল এস্টেট কোম্পানি',
    nameAr: 'شركات عقارية واستثمار',
    badge: 'Property Showcase',
    badgeBn: 'প্রপার্টি ক্যাটালগ',
    icon: Building,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    multiplier: 1.2,
    description: 'Virtual property tours, interactive floor plans, lead capture CRM, pricing calculators.',
    descriptionBn: 'প্রপার্টি লিস্টিং, ভার্চুয়াল ট্যুর, ইন্টারেক্টিভ ফ্লোর প্ল্যান ও হট লিড কালেকশন।',
    recommendedFeatures: ['seo_setup', 'multi_language', 'admin_panel'],
    smartTips: {
      title: 'High-Ticket Property Leads Suite',
      titleBn: 'রিয়েল এস্টেট লিড কালেকশন',
      description: 'Utilize high-converting landing layouts with local Google Search SEO to attract serious property investors.',
      descriptionBn: 'প্রবাসী ও স্থানীয় বিনিয়োগকারীদের জন্য এসইও ও মাল্টি-ল্যাঙ্গুয়েজ ফিচার যুক্ত করুন।'
    }
  },
  {
    id: 'travel_tourism_agency',
    name: 'Travel & Tourism Agency',
    nameBn: 'ট্রাভেল ও ট্যুরিজম এজেন্সি',
    nameAr: 'وكالات سفر وسياحة',
    badge: 'Tour Packages',
    badgeBn: 'ট্যুর প্যাকেজ',
    icon: Plane,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    multiplier: 1.15,
    description: 'Tour package booking, visa assistance inquiry, flight ticketing, currency conversion.',
    descriptionBn: 'ট্যুর ও হজ-উমরাহ প্যাকেজ বুকিং, ভিসা প্রসেসিং ইনকোয়ারি ও অনলাইন পেমেন্ট।',
    recommendedFeatures: ['payment_gateway', 'multi_language', 'seo_setup'],
    smartTips: {
      title: 'Travel Agency Booking Framework',
      titleBn: 'ট্রাভেল এজেন্সি অটোমেশন',
      description: 'Integrate dynamic multi-currency display, package reservation forms, and WhatsApp booking triggers.',
      descriptionBn: 'ভ্রমণপিপাসুদের দ্রুত বুকিংয়ের জন্য বিকাশ/নগদ পেমেন্ট ও হোয়াটসঅ্যাপ ইনস্ট্যান্ট কনফার্মেশন বেছে নিন।'
    }
  },
  {
    id: 'ngo_non_profit',
    name: 'NGO / Non-Profit Organization',
    nameBn: 'এনজিও / অলাভজনক সংস্থা',
    nameAr: 'منظمات غير ربحية ومبادرات',
    badge: 'Donations & Impact',
    badgeBn: 'ডোনেশন ও সেবা',
    icon: HeartHandshake,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    multiplier: 0.95,
    description: 'Online donation gateways, transparency audit reports, volunteer signup campaigns.',
    descriptionBn: 'অনলাইন অনুদান সংগ্রহ, প্রজেক্ট রিপোর্ট পাবলিশিং ও ভলান্টিয়ার রেজিস্ট্রেশন।',
    recommendedFeatures: ['payment_gateway', 'multi_language', 'admin_panel'],
    smartTips: {
      title: 'NGO Donor Trust & Fund Collection',
      titleBn: 'এনজিও ডোনেশন পোর্টাল টিপস',
      description: 'Include secure donation gateway with instant receipt generation and multilingual transparency reports.',
      descriptionBn: 'আন্তর্জাতিক ও স্থানীয় ফান্ড কালেকশনের জন্য ডুয়েল কারেন্সি পেমেন্ট গেটওয়ে নির্বাচন করুন।'
    }
  },
  {
    id: 'personal_brand_freelancer',
    name: 'Personal Brand / Freelancer',
    nameBn: 'পার্সোনাল ব্র্যান্ড / ফ্রিল্যান্সার',
    nameAr: 'علامة شخصية ومستقلين',
    badge: 'Portfolio',
    badgeBn: 'পোর্টফোলিও',
    icon: UserCheck,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    multiplier: 0.9,
    description: 'Creative portfolio showcase, client testimonials, booking calendar, contact funnels.',
    descriptionBn: 'প্রিমিয়াম পোর্টফোলিও শোকেস, ক্লায়েন্ট টেস্টিমোনিয়াল ও ডিরেক্ট বুকিং ক্যালেন্ডার।',
    recommendedFeatures: ['seo_setup', 'cloud_hosting'],
    smartTips: {
      title: 'Personal Brand Authority Suite',
      titleBn: 'পার্সোনাল ব্র্যান্ডিং টিপস',
      description: 'Showcase your best case studies with lightning-fast cloud hosting and Google SEO to get organic freelance clients.',
      descriptionBn: 'গুগলে নিজের নামের র‍্যাংক বাড়াতে টেকনিক্যাল এসইও ও সুপারফাস্ট ক্লাউড হোস্টিং নির্বাচন করুন।'
    }
  },
  {
    id: 'other',
    name: 'Other',
    nameBn: 'অন্যান্য (Other)',
    nameAr: 'أخرى (مخصص)',
    badge: 'Custom Scope',
    badgeBn: 'কাস্টম স্কোপ',
    icon: Sparkles,
    color: 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20',
    multiplier: 1.0,
    description: 'Tailored architecture engineered specifically to your exact enterprise specifications.',
    descriptionBn: 'আপনার সুনির্দিষ্ট বিজনেস প্রয়োজনীয়তা অনুযায়ী বিশেষায়িত কাস্টম সলিউশন।',
    recommendedFeatures: ['payment_gateway', 'admin_panel', 'cloud_hosting'],
    smartTips: {
      title: 'Custom Specification Blueprint',
      titleBn: 'কাস্টম প্রজেক্ট ব্লুপ্রিন্ট',
      description: 'Our senior architects will conduct a 1-on-1 technical consultation to determine your exact software blueprint.',
      descriptionBn: 'আমাদের ইঞ্জিনিয়াররা আপনার রিকোয়ারমেন্ট পর্যালোচনা করে সর্বোত্তম সলিউশন অফার করবেন।'
    }
  }
];
