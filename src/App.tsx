/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { flushSync } from 'react-dom';
import { 
  PhoneCall, ShieldAlert, Award, ChevronRight, Sparkles, 
  HelpCircle, ArrowRight, BookOpen, Star, Building2, ExternalLink, Bell, Clock,
  Info, AlertTriangle, Gift, ChevronDown, ChevronUp
} from 'lucide-react';

// Import Types
import { Language, Theme, Product, Order, SupportTicket, Coupon, SystemConfig, CartItem, UserSession, Currency, ActivityLog, FlyingCartItem } from './types';

// Import Seeds
import { sampleProducts, systemConfigDefault, sampleCoupons, clientTestimonials } from './data';

// Import Parts
import { db as firebaseDb, auth as firebaseAuth, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import Header from './components/Header';
import ProductDetails from './components/ProductDetails';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import MacBookCartGenieAnimation from './components/MacBookCartGenieAnimation';
const Marketplace = lazy(() => import('./components/Marketplace'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const Blog = lazy(() => import('./components/Blog'));
import { initialLocalBlogs, LocalBlogPost } from './components/BlogData';
const Portfolio = lazy(() => import('./components/Portfolio'));
const Contact = lazy(() => import('./components/Contact'));
const FAQ = lazy(() => import('./components/FAQ'));
const PrivacyTerms = lazy(() => import('./components/PrivacyTerms'));
import Notification from './components/Notification';
const AuthSystem = lazy(() => import('./components/AuthSystem'));
import DomainSearch from './components/DomainSearch';
import LiveChatWidget from './components/LiveChatWidget';
const Hosting = lazy(() => import('./components/Hosting'));
const Solutions = lazy(() => import('./components/Solutions'));
const DomainPage = lazy(() => import('./components/DomainPage'));
const AffiliateSystem = lazy(() => import('./components/AffiliateSystem'));
const AuthPopup = lazy(() => import('./components/AuthPopup'));
const RefundPolicy = lazy(() => import('./components/RefundPolicy'));
const OffersPage = lazy(() => import('./components/OffersPage'));
const PromotionalOfferSystem = lazy(() => import('./components/PromotionalOfferSystem'));
import ScrollReveal from './components/ScrollReveal';
import BottomNavigation from './components/BottomNavigation';
import ScrollToTop from './components/ScrollToTop';
import { motion, AnimatePresence } from 'motion/react';
import Helmet from './components/Helmet';

// Dynamic SEO Metadata Configuration dictionary based on currentPage and language
const seoConfig: Record<string, Record<Language, { title: string; description: string }>> = {
  home: {
    en: {
      title: "WebzoneBD - Premium Software, Scripts, Domain & SSD Cloud hosting",
      description: "Professional developer marketplace for premium digital products, WHMCS modules, custom web apps, dynamic domains & high-speed SSD cPanel hosting."
    },
    bn: {
      title: "ওয়েবজোনবিডি - প্রিমিয়াম সফটওয়্যার, স্ক্রিপ্ট, ডোমেইন এবং এসএসডি ক্লাউড হোস্টিং",
      description: "প্রিমিয়াম ডিজিটাল পণ্য, ডোমেইন রেজিস্ট্রেশন এবং উচ্চ গতির এসএসডি সিপ্যানেল ক্লাউড হোস্টিং এর জন্য সেরা ডেভেলপার মার্কেটপ্লেস ও রিটেল সার্ভিস।"
    },
    ar: {
      title: "ويب زون بي دي - البرمجيات والسكربتات والنطاقات واستضافة السحابية",
      description: "متجر المطورين الاحترافي للمنتجات الرقمية المتميزة، والبرمجيات الخاصة، والنطاقات السريعة، واستضافة لوحة التحكم السحابية SSD cPanel."
    }
  },
  solutions: {
    en: {
      title: "Enterprise Grade Custom Solutions & Systems - WebzoneBD",
      description: "Tailored IT consultancy, scalable business architectures, API gateways, custom database design, and next-generation dedicated applications."
    },
    bn: {
      title: "এন্টারপ্রাইজ কাস্টম সলিউশন এবং সিস্টেম আর্কিটেকচার - ওয়েবজোনবিডি",
      description: "আপনার ব্যবসার জন্য উন্নত লারাভেল এবং রিয়্যাক্ট কাস্টম সফটওয়্যার ডিজাইন, এপিআই গেটওয়ে ও ডেডিকেটেড ক্লাউড সলিউশন।"
    },
    ar: {
      title: "حلول وأنظمة مخصصة للمؤسسات والشركات - ويب زون بي دي",
      description: "استشارات تقنية متخصصة، بنية أساسية برمجية قابلة للتوسع، خوادم قواعد البيانات الذكية وتوفير بوابات الدفع الإلكترونية السريعة."
    }
  },
  services: {
    en: {
      title: "IT Services & Growth Marketing Packages - WebzoneBD",
      description: "Explore our premium IT development packages, social media management, SEO growth hacks, security audits, and dedicated server options."
    },
    bn: {
      title: "আইটি ডেভলপমেন্ট সার্ভিস ও বিজনেস প্রোমোশন প্যাকেজ - ওয়েবজোনবিডি",
      description: "আমাদের প্রফেশনل ডিজিটাল মার্কেটিং, কমপ্লিট এসইও গ্রোথ হ্যাকস, সিকিউরিটি অডিট এবং ফুলস্ট্যাক কোডিং সার্ভিস প্যাকেজ এক্সপ্লোর করুন।"
    },
    ar: {
      title: "خدمات تكنولوجيا المعلومات وحزم التسويق الرقمي - ويب زون بي دي",
      description: "استكشف خدمات البرمجة الشاملة والتسويق الرقمي عبر وسائل التواصل الاجتماعي، وحزم تحسين نتائج البحث السريعة لموقعك."
    }
  },
  marketplace: {
    en: {
      title: "Premium Scripts, Templates & Software Catalogue - WebzoneBD",
      description: "Browse our security-audited full-stack web applications, Laravel systems, NextJS templates, customized PHP modules, and themes with fast downloads."
    },
    bn: {
      title: "প্রিমিয়াম ওয়েব স্ক্রিপ্ট, থিম এবং সফটওয়্যার ক্যাটালগ - ওয়েবজোনবিডি",
      description: "নিরাপদভাবে অডিট করা ফুলস্ট্যাক ওয়েব স্ক্রিপ্ট, লারাভেল সাইট, পিএইচপি অ্যাপ্লিকেশন এবং প্রিকিড কোড কালেকশন ডিরেক্টরি।"
    },
    ar: {
      title: "كتالوج المنتجات الرقمية والسكربتات المتميزة - ويب زون بي دي",
      description: "تصفح مئات السكربتات الموثوقة والمدققة أمنياً، قوالب ووردبريس ومحركات لارفيل المتقدمة برابط تحميل مباشر وسريع."
    }
  },
  portfolio: {
    en: {
      title: "Premium Successful Case Studies & Portfolios - WebzoneBD",
      description: "Take a tour of our newly deployed cloud architectures, SaaS products, interactive web systems, and high performance enterprise solutions."
    },
    bn: {
      title: "সফল ক্লায়েন্ট প্রজেক্ট এবং ডিজাইন পোর্টফোলিও - ওয়েবজোনবিডি",
      description: "আমাদের রিয়েল-টাইম কাস্টম পোর্টফোলিও, সফল ক্লাউড মাইগ্রেশন কেস স্টাডিজ এবং উন্নত ইউজার এক্সপেরিয়েন্স প্রজেক্ট গ্যালারি।"
    },
    ar: {
      title: "معرض الأعمال ومشاريع العملاء الناجحة - ويب زون بي دي",
      description: "اطلع على أحدث التطبيقات البرمجية والمشاريع السحابية التي قمنا بتطويرها لشركاء النجاح حول العالم."
    }
  },
  blog: {
    en: {
      title: "WebzoneBD Official Blog - Digital Tech News & Insights",
      description: "Stay updated with digital software trends, cybersecurity audits, hosting server management, web frameworks tips, and business digitization news."
    },
    bn: {
      title: "ওয়েবজোনবিডি অফিসিয়াল ব্লগ - আইটি এবং ওয়েব ডেভেলপমেন্ট টিপস",
      description: "টেক ট্রেন্ড, সাইবার সিকিউরিটি সতর্কতা, ডোমেন হোস্টিং এর সহজ টিপস এবং লেটেস্ট ফ্রেমওয়ার্ক সম্পর্কিত আপডেট ও ডায়েরি।"
    },
    ar: {
      title: "المدونة الرسمية التكنولوجية - ويب زون بي دي",
      description: "تابع أحدث المقالات التقنية، طرق تحسين الأداء للمواقع الإلكترونية، استراتيجيات السيرفرات وإرشادات حماية البيانات."
    }
  },
  faq: {
    en: {
      title: "Frictionless Support Center & Instant FAQ - WebzoneBD",
      description: "Find solutions for license activation, server setup, billing transfers, secure gateways, domains validation, and reseller hosting guidelines."
    },
    bn: {
      title: "হেল্প সেন্টার এবং সাধারণ প্রশ্নাবলী (FAQ) - ওয়েবজোনবিডি",
      description: "লাইসেন্স অ্যাক্টিভেশন, ডিএনএস নেমসার্ভার আপডেট, পেমেন্ট গেটওয়ে, কুপন রিডিম এবং রিফান্ড পলিসি সম্পর্কিত সকল প্রশ্নের তাৎক্ষণিক সমাধান।"
    },
    ar: {
      title: "مركز الدعم الفني والأسئلة الشائعة - ويب زون بي دي",
      description: "ابحث عن إجابات فورية لأسئلتك حول تفعيل التراخيص، تحديثات النطاقات، طرق الدفع الفوري ومعالجة الفواتير الإلكترونية."
    }
  },
  contact: {
    en: {
      title: "Contact Dedicated Technical Support Team - WebzoneBD",
      description: "Get in touch with WebzoneBD. Available over Whatsapp, live chat system, and customer helpdesk ticketing for immediate technical assistance."
    },
    bn: {
      title: "২৪/৭ কাস্টমার সাপোর্ট এবং যোগাযোগ - ওয়েবজোনবিডি",
      description: "যেকোনো আইটি সমস্যা বা কোড পারচেজ সহায়তায় আমাদের হোয়াটসঅ্যাপ ফোরাম, লাইভ চ্যাট বোট অথবা ডিরেক্ট সাপোর্ট টিকিট নিয়ে কথা বলুন।"
    },
    ar: {
      title: "اتصل بفريق الدعم الفني المباشر - ويب زون بي دي",
      description: "تواصل مع مستشارينا عبر واتساب أو نظام المحادثة الفورية، أو قم بفتح تذكرة دعم فني جديدة عبر نظام المساعدة الفوري المستمر."
    }
  },
  hosting: {
    en: {
      title: "SSD Cloud Web VPS Hosting & Dedicated cPanel - WebzoneBD",
      description: "Supercharge your website with NVMe SSD high-speed cloud hosting, reliable server uplinks, free SSL certificates, automated backup and instant handshakes."
    },
    bn: {
      title: "সুপারফাস্ট এনভিএমই এসএসডি ক্লাউড হোস্টিং - ওয়েবজোনবিডি",
      description: "আপনার ওয়েবসাইটের গতি বাড়ান আল্ট্রা-ফাস্ট লাইটস্পিড রানিং হোস্টিং, ফ্রি এসএসএল, জেইলহোস্ট প্রোটেকশন এবং অটো ব্যাকআপের সাথে।"
    },
    ar: {
      title: "استضافة السيرفرات السحابية ومواقع الويب فائقة السرعة - ويب زون بي دي",
      description: "احصل على استضافة سيرفرات NVMe SSD قوية مع حماية متكاملة، شهادة SSL مجاناً، ونماذج نسخ احتياطي دورية وتفعيل فوري."
    }
  },
  domain: {
    en: {
      title: "Register & Search Secure Popular Domains - WebzoneBD",
      description: "Check domain name availability instantly. Choose popular extensions (.com, .net, .org) with secure digital setups and integration tools."
    },
    bn: {
      title: "মিনিটের মধ্যে পছন্দের ডোমেন খুঁজুন এবং কিনুন - ওয়েবজোনবিডি",
      description: "সহজ ডোমেন সার্চ টুল এবং ইন্টেলিজেন্ট নেম জেনারেটর দিয়ে পছন্দসই ডোমেন খুঁজুন ও WHMCS গেটওয়েতে অর্ডার নিশ্চিত করুন।"
    },
    ar: {
      title: "حجز وتسجيل النطاقات العالمية بأسعار تنافسية - ويب زون بي دي",
      description: "ابحث عن نطاقك المثالي فوراً مع أداة التوليد الذكية لنطاق أحلامك، تفعيل فوري مع ربط الـ DNS بالاستضافة بسلاسة."
    }
  },
  privacy: {
    en: {
      title: "Security Compliance, Terms of Service & Privacy - WebzoneBD",
      description: "Review WebzoneBD's digital agreement, consumer terms of service, data safety processes, and secure firewall logs."
    },
    bn: {
      title: "গোপনীয়তা নীতি এবং ট্রাস্ট অ্যাগ্রিমেন্ট শর্তাবলী - ওয়েবজোনবিডি",
      description: "আমাদের ডিজিটাল ট্রাস্ট পলিসি, কুপন শেয়ারিং মেথড, ইউজার অ্যাকাউন্টের ডাটা ব্যাকআপ প্রটোকল এবং প্রাইজ পলিসি রুলস।"
    },
    ar: {
      title: "شروط الاستخدام وسياسة الخصوصية وأمان البيانات - ويب زون بي دي",
      description: "راجع سياسة الاستخدام والامتثال الأمني وحماية معلومات المشتركين، وبروتوكولات الجدران النارية والنسخ الاحتياطي لدينا."
    }
  },
  refund: {
    en: {
      title: "Direct Checkouts, Refund Policy & Order Integrity - WebzoneBD",
      description: "Understand our digital asset trial periods, secure payments, and standard 30-day billing refunds rules for hosting packages."
    },
    bn: {
      title: "নিরাপদ অর্ডার ভ্যারিফিকেশন এবং রিফান্ড পলিসি - ওয়েবজোনবিডি",
      description: "আমাদের ডোমেইন, সিপ্যানেল হোস্টিং এবং ডিজিটাল ডাব্লিউএইচএমসিএস মডিউলসমূহের জন্য রিফান্ড পলিসি ও গাইডলাইন।"
    },
    ar: {
      title: "شروط الدفع المعالجة وسياسة المسترجعات البرمجية - ويب زون بي دي",
      description: "تفاصيل استرجاع الأموال وعروض التوزيع والتراخيص الرقمية والمنتجات السحابية المفعلة بشكل آلي وسلس."
    }
  },
  affiliate: {
    en: {
      title: "Affiliate Program - Earn Commissions & Share - WebzoneBD",
      description: "Join WebzoneBD's rewarding digital affiliate partner programs. Earn up to 40% in recurring commissions sharing premium templates and hosting."
    },
    bn: {
      title: "অ্যাফিলিয়েট ড্যাশবোর্ড এবং পার্টনার কমিশন ফোরাম - ওয়েবজোনবিডি",
      description: "আমাদের Certified পার্টনার হয়ে অন্যকে প্রিমিয়াম প্রোডাক্ট শেয়ার করুন এবং প্রতিটি সফল অর্ডারে ৪০% পর্যন্ত লাইফটাইম কমিশন ইনকাম করুন।"
    },
    ar: {
      title: "برنامج التسويق بالعمولة والأرباح المشاركة - ويب زون بي دي",
      description: "انضم إلى أقوى شبكات التوزيع بالعمولة للخدمات السحابية والبرمجيات المتميزة، واربح عمولات شهرية مستمرة تصل لـ 40%."
    }
  },
  auth: {
    en: {
      title: "Customer Secure Authentication Portal - WebzoneBD",
      description: "Sign in safely using secure OTP code handshake protocol or register a new client profile to instantly manage your licenses and server logs."
    },
    bn: {
      title: "কাস্টমার লগইন এবং সিকিউরড রেজিস্ট্রেশন প্যানেল - ওয়েবজোনবিডি",
      description: "ওটিপি হ্যান্ডশেক কোড অথবা নরমাল পাসওয়ার্ড দিয়ে ক্রিপ্টোগ্রাফিক সুরক্ষায় আপনার পারসোনাল ড্যাশবোর্ড অ্যাক্সেস করুন।"
    },
    ar: {
      title: "بوابة الولوج الآمنة للعملاء والشركاء - ويب زون بي دي",
      description: "تسجيل الدخول الآمن بخطوتين (OTP Verification Code) أو إنشاء حساب مستخدم للتحكم بتراخيصك الفورية."
    }
  },
  dashboard: {
    en: {
      title: "Client Core Workspace Dashboard - WebzoneBD",
      description: "Monitor active hosting quotas, track order verification badges, config nameserver records, download raw sources, or open tech tickets."
    },
    bn: {
      title: "ক্লায়েন্ট কন্ট্রোল ড্যাশবোর্ড এবং ওয়ার্কস্পেস - ওয়েবজোনবিডি",
      description: "আপনার মোট অর্ডারকৃত হোস্টিং স্ট্যাটাস, সচল ওয়েব ডোমেন, এপিআই কুয়েরি লক এবং ডিএনএস সার্ভার রেজিস্ট্রি কাস্টমাইজ করুন।"
    },
    ar: {
      title: "لوحة تحكم المستخدم وإدارة الاشتراكات المباشرة - ويب زون بي دي",
      description: "راقب تراخيص السكربتات المفعّلة، تحكّم بإعدادات خوادم الأسماء للنطاقات، نزّل الملفات المصدرية المباشرة وافتح التذاكر الفنية."
    }
  },
  admin: {
    en: {
      title: "WordPress-Style Command Controls Console - WebzoneBD",
      description: "Superuser dashboard panel to manage digital items catalog, verify secure transaction vouchers, reset license tokens, and respond to logs."
    },
    bn: {
      title: "সুপার অ্যাডমিন কন্টেন্ট ম্যানেজমেন্ট সিস্টেম - ওয়েবজোনবিডি",
      description: "ওয়েবজোন পোর্টালে ক্যাটালগ সংশোধন, ক্লায়েন্ট রেকর্ড মেইনটেইন, সিকিউরড ট্রানজেকশন ভাউচার কনফার্ম এবং হেল্প ডেস্ক ডেটা ম্যানেজ করার অ্যাডমিন মডিউল।"
    },
    ar: {
      title: "لوحة تحكم السوبر أدمن المتقدمة CMS - ويب زون بي دي",
      description: "إدارة ملفات المنتجات، مراجعة دفعات التحويل الرقمي المأمنة وبطاقات الدعم وتراخيص السكربتات ووضع حد الخصومات المسموحة."
    }
  },
  offers: {
    en: {
      title: "🚀 Limited Time Mega Combo Offers Festival - WebzoneBD",
      description: "Exclusive bundle deals and massive campaigns. Save up to 50% on domains registration, high-speed NVMe hosting, e-store development, and custom news portals setup."
    },
    bn: {
      title: "🚀 লিমিটেড-টাইম মেগা কম্বো অফার ফেস্টিভ্যাল - ওয়েবজোনবিডি",
      description: "বিশেষ ক্যাম্পেইন এবং অফার। ডোমেন রেজিস্ট্রেশন, হাই-স্পিড হোস্টিং, চমৎকার কমার্স এবং নিউজ পোর্টাল ডেভলপমেন্ট প্যাকেজে ৫০% পর্যন্ত ডিসকাউন্ট পান।"
    },
    ar: {
      title: "🚀 عروض المهرجان الكبرى وحزم الكومبو الحصرية - ويب زون بي دي",
      description: "احصل على نطاق مجاني واستضافة فائقة السرعة مع بوابات دفع متكاملة في عروض الكومبو الشاملة بخصم لغاية 50% لفترة محدودة."
    }
  }
};

export default function App() {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('webzone_language');
    if (saved === 'en' || saved === 'bn' || saved === 'ar') return saved as Language;

    // Quick synchronous check for Bangladesh (timezone or locale)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isBDLocale = navigator.language && (navigator.language.includes('bn') || navigator.language.includes('BD'));
      const isBDTz = tz && (tz.includes('Dhaka') || tz.includes('Chittagong') || tz.includes('Asia/Dhaka'));
      if (isBDTz || isBDLocale) return 'bn';
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('webzone_language', lang);
    localStorage.setItem('webzone_language_manual', 'true');
    setLanguageState(lang);
  };
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('webzone_theme');
    return (saved as Theme) || 'light';
  });

  // Auto-detect language based on location (Bangladesh -> bn, others -> en)
  useEffect(() => {
    const saved = localStorage.getItem('webzone_language');
    const manual = localStorage.getItem('webzone_language_manual');
    if (!saved && !manual) {
      // 1. Try ipapi.co
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.country_code === 'BD') {
            setLanguageState('bn');
          } else {
            setLanguageState('en');
          }
        })
        .catch(() => {
          // 2. Fallback to ip-api.com
          fetch('https://ip-api.com/json')
            .then(res => res.json())
            .then(data => {
              if (data && (data.countryCode === 'BD' || data.country === 'Bangladesh')) {
                setLanguageState('bn');
              } else {
                setLanguageState('en');
              }
            })
            .catch(() => {
              // 3. Fallback to ipinfo.io
              fetch('https://ipinfo.io/json')
                .then(res => res.json())
                .then(data => {
                  if (data && data.country === 'BD') {
                    setLanguageState('bn');
                  } else {
                    setLanguageState('en');
                  }
                })
                .catch(() => {
                  // Keep synchronous default guess
                });
            });
        });
    }
  }, []);

  // Capture incoming referral parameters for affiliate tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const camp = params.get('camp');
    if (ref) {
      localStorage.setItem('webzone_referral_partner_id', ref);
      if (camp) {
        localStorage.setItem('webzone_referral_campaign_suffix', camp);
      }
      setTimeout(() => {
        triggerToast(`🎁 Active Affiliate Link loaded! Referred by certified partner (${ref}). Up to 40% discount applies!`);
      }, 1500);
    }
  }, []);
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/domain' || path === '/domain-name-generator' || path.endsWith('/domain') || path.endsWith('/domain-name-generator')) return 'domain';
    if (path === '/hosting' || path.endsWith('/hosting')) return 'hosting';
    if (path === '/refund' || path.endsWith('/refund')) return 'refund';
    if (path === '/offers' || path.endsWith('/offers')) return 'offers';
    return 'home';
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('webzone_session_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'admin' || u.role === 'super_admin' || u.role === 'editor' || u.role === 'staff';
      }
    } catch (e) {}
    return false;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authDefaultView, setAuthDefaultView] = useState<'login' | 'register'>('login');
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState<boolean>(false);
  const [siteWideBroadcast, setSiteWideBroadcast] = useState<string | null>(() => {
    return localStorage.getItem('site_wide_broadcast_notification');
  });
  const [siteWideBroadcastLink, setSiteWideBroadcastLink] = useState<string | null>(() => {
    return localStorage.getItem('site_wide_broadcast_link');
  });
  const [siteWideBroadcastLinkText, setSiteWideBroadcastLinkText] = useState<string | null>(() => {
    return localStorage.getItem('site_wide_broadcast_link_text') || 'Claim Offer';
  });
  const [siteWideBroadcastStartAt, setSiteWideBroadcastStartAt] = useState<number | null>(() => {
    const raw = localStorage.getItem('site_wide_broadcast_start_at');
    return raw ? Number(raw) : null;
  });
  const [siteWideBroadcastExpiresAt, setSiteWideBroadcastExpiresAt] = useState<number | null>(() => {
    const raw = localStorage.getItem('site_wide_broadcast_expires_at');
    return raw ? Number(raw) : null;
  });
  const [broadcastTimeLeft, setBroadcastTimeLeft] = useState<number>(0);
  const [broadcastDismissed, setBroadcastDismissed] = useState<boolean>(false);
  const [siteWideBroadcastSeverity, setSiteWideBroadcastSeverity] = useState<'info' | 'urgent' | 'offer'>(() => {
    return (localStorage.getItem('site_wide_broadcast_severity') as any) || 'info';
  });
  const [isBroadcastExpanded, setIsBroadcastExpanded] = useState<boolean>(false);
  const [isBroadcastActive, setIsBroadcastActive] = useState<boolean>(false);

  useEffect(() => {
    setBroadcastDismissed(false);
    setIsBroadcastExpanded(false);
  }, [siteWideBroadcast]);

  // Real-time broadcast scheduler and countdown timer tick that drives automatic dispatch & dismissal
  useEffect(() => {
    if (!siteWideBroadcast) {
      setIsBroadcastActive(false);
      setBroadcastTimeLeft(0);
      return;
    }

    const checkTimes = () => {
      const now = Date.now();
      
      // Determine if starting time has begun
      const startsIn = siteWideBroadcastStartAt ? siteWideBroadcastStartAt - now : 0;
      const isStartPassed = startsIn <= 0;

      if (!isStartPassed) {
        setIsBroadcastActive(false);
        setBroadcastTimeLeft(0);
        return;
      }

      // Check ending time
      if (siteWideBroadcastExpiresAt) {
        const remaining = siteWideBroadcastExpiresAt - now;
        if (remaining <= 0) {
          // Already expired, dismiss and clear out all storage variables gracefully
          setSiteWideBroadcast(null);
          setSiteWideBroadcastLink(null);
          setSiteWideBroadcastLinkText(null);
          setSiteWideBroadcastStartAt(null);
          setSiteWideBroadcastExpiresAt(null);
          setIsBroadcastActive(false);
          setBroadcastTimeLeft(0);
          
          localStorage.removeItem('site_wide_broadcast_notification');
          localStorage.removeItem('site_wide_broadcast_link');
          localStorage.removeItem('site_wide_broadcast_link_text');
          localStorage.removeItem('site_wide_broadcast_id');
          localStorage.removeItem('site_wide_broadcast_expires_at');
          localStorage.removeItem('site_wide_broadcast_start_at');
          localStorage.removeItem('site_wide_broadcast_duration');
          return;
        } else {
          setIsBroadcastActive(true);
          setBroadcastTimeLeft(remaining);
        }
      } else {
        setIsBroadcastActive(true);
        setBroadcastTimeLeft(0);
      }
    };

    checkTimes(); // run immediately
    const interval = setInterval(checkTimes, 1000);

    return () => clearInterval(interval);
  }, [siteWideBroadcast, siteWideBroadcastStartAt, siteWideBroadcastExpiresAt]);

  const formatCountdown = (msDiff: number): string => {
    if (msDiff <= 0) return '00:00:00';
    const totalSecs = Math.floor(msDiff / 1000);
    const secs = totalSecs % 60;
    const totalMins = Math.floor(totalSecs / 60);
    const mins = totalMins % 60;
    const totalHours = Math.floor(totalMins / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    const formattedSecs = secs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');

    if (days > 0) {
      return `${days}d ${formattedHours}h ${formattedMins}m ${formattedSecs}s`;
    }
    return `${formattedHours}:${formattedMins}:${formattedSecs}`;
  };

  // Restored Authentication & Admin Login States
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('webzone_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const syncRegisteredUserToAdmin = (signedInUser: any) => {
    if (signedInUser && signedInUser.role === 'customer') {
      try {
        const saved = localStorage.getItem('webzone_admin_customers');
        let currentList = saved ? JSON.parse(saved) : [
          { id: 'usr-101', name: 'Imran Hasan', companyName: 'Hasan Technologies Ltd.', email: 'imranh7900@gmail.com', phone: '+880 1711 223344', whatsapp: '+880 1711 223344', dob: '1992-06-15', gender: 'Male', status: 'active', walletBalance: 450, totalSpent: 1200, country: 'Bangladesh', city: 'Dhaka', address: 'House 42, Road 11, Banani', postalCode: '1213', websiteUrl: 'https://imranhasan.tech', customerType: 'VIP Client', tags: ['VIP', 'High Value', 'Priority Support'], lastLogin: '2026-06-11 09:41', joinedAt: '2026-01-15' },
          { id: 'usr-102', name: 'Al-Shehri Majid', companyName: 'Saudi Web Enterprises', email: 'majid@saudiweb.com', phone: '+966 50 123 4567', whatsapp: '+966 50 123 4567', dob: '1988-10-02', gender: 'Male', status: 'active', walletBalance: 1200, totalSpent: 3500, country: 'Saudi Arabia', city: 'Riyadh', address: 'King Fahd Road, Al Olaya District', postalCode: '12214', websiteUrl: 'https://saudiweb.com', customerType: 'Corporate Client', tags: ['Corporate', 'High Value'], lastLogin: '2026-06-11 01:10', joinedAt: '2026-02-20' },
          { id: 'usr-103', name: 'Zeeshan Rahman', companyName: 'Zeeshan Agency', email: 'zee@rahmanit.com', phone: '+880 1864 051151', whatsapp: '+880 1864 051151', dob: '1995-12-25', gender: 'Male', status: 'active', walletBalance: 85, totalSpent: 450, country: 'Bangladesh', city: 'Chittagong', address: 'Halishahar Main Road', postalCode: '4216', websiteUrl: 'https://rahmanit.com', customerType: 'Regular Client', tags: ['Regular'], lastLogin: '2026-06-09 16:15', joinedAt: '2026-03-05' },
          { id: 'usr-104', name: 'Sarah Connor', companyName: 'Cyberdyne Systems', email: 'sarah@t800.io', phone: '+1 415 888 9999', whatsapp: '+1 415 888 9999', dob: '1984-04-12', gender: 'Female', status: 'suspended', walletBalance: 0, totalSpent: 250, country: 'USA', city: 'Los Angeles', address: 'P.O. Box 4141', postalCode: '90001', websiteUrl: 'https://t800.io', customerType: 'Reseller', tags: ['Reseller', 'Risk Customer'], lastLogin: '2026-06-05 23:45', joinedAt: '2026-03-12' },
          { id: 'usr-105', name: 'Enamul Haque', companyName: 'Dhaka Host Group', email: 'enamul@dhakahost.net', phone: '+880 1912 345678', whatsapp: '+880 1912 345678', dob: '1990-09-08', gender: 'Male', status: 'active', walletBalance: 1560, totalSpent: 8900, country: 'Bangladesh', city: 'Dhaka', address: 'Banosree Block C', postalCode: '1219', websiteUrl: 'https://dhakahost.net', customerType: 'Affiliate Partner', tags: ['Affiliate', 'High Value'], lastLogin: '2026-06-11 10:25', joinedAt: '2025-11-10' }
        ];

        const alreadyExists = currentList.some((c: any) => c.id === signedInUser.id || c.email?.toLowerCase() === signedInUser.email?.toLowerCase());
        if (!alreadyExists) {
          const formattedCustomer = {
            id: signedInUser.id || ('usr-' + Math.floor(1000 + Math.random() * 9000)),
            name: signedInUser.name,
            companyName: 'Individual Client',
            email: signedInUser.email,
            phone: signedInUser.phone || '',
            whatsapp: signedInUser.phone || '',
            dob: '1995-01-01',
            gender: 'Male',
            status: 'active',
            walletBalance: signedInUser.walletBalance || 0,
            totalSpent: 0,
            country: 'Bangladesh',
            city: 'Dhaka',
            address: 'Customer Address',
            postalCode: '1200',
            websiteUrl: '',
            customerType: 'Regular Client',
            tags: ['New Client'],
            lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
            joinedAt: new Date().toISOString().split('T')[0],
            workspaceFeatures: {
              projects: true,
              supportTickets: true,
              digitalStore: true,
              downloads: true,
              affiliateSystem: false,
              wallet: true,
              aiTools: true,
              notifications: true
            }
          };
          currentList.push(formattedCustomer);
          localStorage.setItem('webzone_admin_customers', JSON.stringify(currentList));
        }
      } catch (e) {
        console.error("Failed to sync customer to admin registry", e);
      }
    }
  };
  const [adminLoginEmail, setAdminLoginEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('webzone_admin_remember_login');
      return saved ? JSON.parse(saved).email || '' : '';
    } catch (e) {
      return '';
    }
  });
  const [adminLoginPass, setAdminLoginPass] = useState<string>('');
  const [adminRemember, setAdminRemember] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('webzone_admin_remember_login');
      return saved ? JSON.parse(saved).remember === true : false;
    } catch (e) {
      return false;
    }
  });
  const [adminLoginLoading, setAdminLoginLoading] = useState<boolean>(false);
  const [adminLoginError, setAdminLoginError] = useState<string>('');

  // Password reset modal and mailer simulator states
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotLoading, setForgotLoading] = useState<boolean>(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string>('');

  useEffect(() => {
    const path = window.location.pathname;
    const targetPath = currentPage === 'domain' ? '/domain-name-generator' : currentPage === 'hosting' ? '/hosting' : currentPage === 'refund' ? '/refund' : currentPage === 'offers' ? '/offers' : '/';
    if (path !== targetPath && (targetPath !== '/' || path === '/domain' || path === '/domain-name-generator' || path === '/hosting' || path === '/refund' || path === '/offers')) {
      window.history.pushState({}, '', targetPath);
    }
  }, [currentPage]);

  // Support back button transitions seamlessly
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/domain' || path === '/domain-name-generator' || path.endsWith('/domain') || path.endsWith('/domain-name-generator')) {
        setCurrentPage('domain');
      } else if (path === '/hosting' || path.endsWith('/hosting')) {
        setCurrentPage('hosting');
      } else if (path === '/refund' || path.endsWith('/refund')) {
        setCurrentPage('refund');
      } else if (path === '/offers' || path.endsWith('/offers')) {
        setCurrentPage('offers');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  // Terminal action / security incident logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse webzone_activity_logs", e);
    }
    return [];
  });

  // States with pre-seeded values for offline high fidelity sandbox
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_products');
      if (saved) {
        const parsed = JSON.parse(saved) as Product[];
        return parsed.map(p => {
          if (p.id === 'prod-1' && p.image.includes('photo-1460925895917-afdab827c52f')) {
            p.image = 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80';
          } else if (p.id === 'prod-2' && p.image.includes('photo-1504711434969-e33886168f5c')) {
            p.image = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
          } else if (p.id === 'prod-3' && p.image.includes('photo-1499750310107-5fef28a66643')) {
            p.image = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80';
          } else if (p.id === 'prod-4' && p.image.includes('photo-1522071820081-009f0129c71c')) {
            p.image = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
          }
          return p;
        });
      }
      return sampleProducts;
    } catch (e) {
      console.error("Failed to parse webzone_products", e);
      return sampleProducts;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const staffMembers = ["Imran Khan", "Afsana Mim", "Shakil Ahmed", "Kamrul Hasan", "Farhana Islam", "Tarek Rahman"];
    const productDownloads: { [key: string]: string } = {
      'prod-1': 'https://webzonebd.com/secure-download/zonecart-laravel-ecommerce.zip',
      'prod-2': 'https://webzonebd.com/secure-download/webnews-wordpress-magazine-theme.zip',
      'prod-3': 'https://webzonebd.com/secure-download/bloggerspot-responsive-blogger-template.zip',
      'prod-4': 'https://webzonebd.com/secure-download/schoolzone-ultimate-management-system.zip',
    };

    let baseOrders: Order[] = [];
    try {
      const saved = localStorage.getItem('webzone_orders');
      if (saved) {
        baseOrders = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse webzone_orders", e);
    }

    if (!baseOrders || baseOrders.length === 0) {
      baseOrders = [
        {
          id: "ord-101",
          serviceId: "srv-web",
          itemTitle: "Business Ecommerce+Payment Gateway Website Build",
          price: 1200,
          date: "2026-06-23",
          paymentMethod: "SSLCommerz Gateway",
          paymentStatus: "completed",
          status: "delivered",
          customerName: "Imran Hasan",
          customerEmail: "imranh7900@gmail.com",
          customerPhone: "+880 1711 223344",
          transactionId: "TXNSL100234",
          downloadUrl: "https://webzonebd.com/secure-download/package-source.zip",
          assignedStaff: "Imran Khan"
        },
        {
          id: "ord-102",
          serviceId: "srv-erp",
          itemTitle: "POS Solution Design & Deployment",
          price: 3500,
          date: "2026-06-20",
          paymentMethod: "Saudi National Bank Transfer",
          paymentStatus: "completed",
          status: "delivered",
          customerName: "Al-Shehri Majid",
          customerEmail: "majid@saudiweb.com",
          customerPhone: "+966 50 123 4567",
          transactionId: "TXNSB881023",
          downloadUrl: "https://webzonebd.com/secure-download/package-source.zip",
          assignedStaff: "Afsana Mim"
        },
        {
          id: "ord-103",
          serviceId: "srv-shop",
          itemTitle: "Professional Business Website",
          price: 450,
          date: "2026-06-22",
          paymentMethod: "Bank Transfer",
          paymentStatus: "completed",
          status: "delivered",
          customerName: "Zeeshan Rahman",
          customerEmail: "zee@rahmanit.com",
          customerPhone: "+880 1864 051151",
          transactionId: "TXNBK710294",
          downloadUrl: "https://webzonebd.com/secure-download/package-source.zip",
          assignedStaff: "Shakil Ahmed"
        },
        {
          id: "ord-104",
          serviceId: "srv-school",
          itemTitle: "School Management Solution Hosting",
          price: 8900,
          date: "2026-06-18",
          paymentMethod: "Bank Transfer",
          paymentStatus: "completed",
          status: "delivered",
          customerName: "Enamul Haque",
          customerEmail: "enamul@dhakahost.net",
          customerPhone: "+880 1912 345678",
          transactionId: "TXNBK129045",
          downloadUrl: "https://webzonebd.com/secure-download/package-source.zip",
          assignedStaff: "Kamrul Hasan"
        },
        {
          id: "ord-105",
          productId: "prod-1",
          itemTitle: "ZoneCart - Multi-Vendor Laravel E-commerce Script",
          price: 29,
          date: "2026-06-27",
          paymentMethod: "bKash Wallet",
          paymentStatus: "pending",
          status: "pending",
          customerName: "Sarah Connor",
          customerEmail: "sarah@t800.io",
          customerPhone: "+1 415 888 9999",
          transactionId: "TXNBK551920",
          downloadUrl: "https://webzonebd.com/secure-download/zonecart-laravel-ecommerce.zip",
          assignedStaff: "Farhana Islam"
        }
      ];
    }

    // Assure that even custom local-stored older items get fallback info details
    return baseOrders.map((ord, idx) => {
      const pid = ord.productId || 'prod-1';
      return {
        ...ord,
        customerName: ord.customerName || ord.guestName || 'Mizanur Rahman',
        customerEmail: ord.customerEmail || ord.guestEmail || 'mizanur@gmail.com',
        customerPhone: ord.customerPhone || ord.guestPhone || '01711223344',
        transactionId: ord.transactionId || `TXN${100000 + idx * 2315}`,
        assignedStaff: ord.assignedStaff || staffMembers[idx % staffMembers.length],
        downloadUrl: ord.downloadUrl || productDownloads[pid] || 'https://webzonebd.com/secure-download/package-source.zip'
      };
    });
  });

    // Synchronized user wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const savedUser = localStorage.getItem('webzone_session_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          const savedWishlist = localStorage.getItem(`webzone_wishlist_${parsedUser.id}`);
          if (savedWishlist) return JSON.parse(savedWishlist);
          if (parsedUser.wishlistedProductIds) return parsedUser.wishlistedProductIds;
        }
      }
      const saved = localStorage.getItem('webzone_wishlist_guest') || localStorage.getItem('webzone_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Two-way sync: Update user.wishlistedProductIds when wishlist state changes
  const wishlistString = JSON.stringify(wishlist);
  useEffect(() => {
    if (user) {
      localStorage.setItem(`webzone_wishlist_${user.id}`, JSON.stringify(wishlist));
      localStorage.setItem('webzone_wishlist', JSON.stringify(wishlist));
      
      const hasDiff = !user.wishlistedProductIds || 
        user.wishlistedProductIds.length !== wishlist.length ||
        !wishlist.every(id => user.wishlistedProductIds.includes(id)) ||
        !user.wishlistedProductIds.every(id => wishlist.includes(id));
        
      if (hasDiff) {
        setUser(prev => prev ? { ...prev, wishlistedProductIds: wishlist } : null);
      }
    } else {
      localStorage.setItem('webzone_wishlist_guest', JSON.stringify(wishlist));
      localStorage.setItem('webzone_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlistString, user?.id]);

  // Two-way sync: Update wishlist state when user.wishlistedProductIds changes (e.g. from Dashboard)
  const wishlistedIdsString = JSON.stringify(user?.wishlistedProductIds || []);
  useEffect(() => {
    if (user && user.wishlistedProductIds) {
      const hasDiff = wishlist.length !== user.wishlistedProductIds.length ||
        !wishlist.every(id => user.wishlistedProductIds.includes(id)) ||
        !user.wishlistedProductIds.every(id => wishlist.includes(id));
      
      if (hasDiff) {
        setWishlist(user.wishlistedProductIds);
        localStorage.setItem(`webzone_wishlist_${user.id}`, JSON.stringify(user.wishlistedProductIds));
      }
    }
  }, [wishlistedIdsString]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        triggerToast(language === 'bn' ? "পছন্দ তালিকা থেকে সরানো হয়েছে।" : language === 'ar' ? "تم الحذف من المفضلة!" : "Removed from your wishlist.");
        return prev.filter(id => id !== productId);
      } else {
        triggerToast(language === 'bn' ? "পছন্দ তালিকায় যুক্ত করা হয়েছে!" : language === 'ar' ? "تمت إضافته للمفضلة!" : "Added to your wishlist!");
        return [...prev, productId];
      }
    });
  };

  // Active Multi-Currency formatter state, loaded from localStorage defaulting to USD
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('webzone_active_currency');
    return (saved as Currency) || 'USD';
  });

  // Centralized payment and currency config
  const [currencySettings, setCurrencySettings] = useState(() => {
    const saved = localStorage.getItem('webzone_custom_currency_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.rates && parsed.enabled) return parsed;
      } catch (e) {}
    }
    return {
      rates: {
        USD: 1.0,
        BDT: 118.5,
        SAR: 3.75
      },
      enabled: {
        USD: true,
        BDT: true,
        SAR: true
      },
      defaultCurrency: 'USD' as Currency,
      simulatedCountry: 'auto' as 'auto' | 'SA' | 'BD' | 'US',
      detectedCountryName: 'Unknown (Detecting...)'
    };
  });

  // Synchronized persistent storage hook
  useEffect(() => {
    localStorage.setItem('webzone_custom_currency_settings', JSON.stringify(currencySettings));
  }, [currencySettings]);

  // Async IP Geolocation State
  const [ipCountryCode, setIpCountryCode] = useState<string | null>(null);

  useEffect(() => {
    const sim = currencySettings.simulatedCountry;
    if (sim === 'auto') {
      const detectIP = async () => {
        try {
          const res = await fetch('https://ipwho.is/');
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.country_code) {
              setIpCountryCode(data.country_code);
              console.log("Detected visitor country code via IP:", data.country_code);
              return;
            }
          }
          throw new Error("ipwho.is response was not successful");
        } catch (e) {
          console.warn("Primary IP geolocation lookup failed, trying fallback...", e);
          // Fallback to freeipapi.com
          try {
            const res = await fetch('https://freeipapi.com/api/json');
            if (res.ok) {
              const data = await res.json();
              if (data && data.countryCode) {
                setIpCountryCode(data.countryCode);
                console.log("Detected visitor country code via fallback IP:", data.countryCode);
                return;
              }
            }
          } catch (fallbackError) {
            console.warn("Fallback IP geolocation lookup failed:", fallbackError);
          }
        }
      };
      detectIP();
    }
  }, [currencySettings.simulatedCountry]);

  // Synchronized Auto Detect Location Engine
  const lastSimulatedCountry = useRef<string>('');
  const initialDetectionRun = useRef(false);

  useEffect(() => {
    let resolvedCountryName = 'USA / Others';
    let autoCurrency: Currency = 'USD';

    const sim = currencySettings.simulatedCountry;
    if (sim === 'auto') {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) {
          const tzLower = tz.toLowerCase();
          if (tzLower.includes('dhaka') || tzLower.includes('bangladesh') || tzLower.includes('bengal')) {
            resolvedCountryName = 'Bangladesh';
            autoCurrency = 'BDT';
          } else if (
            tzLower.includes('riyadh') || 
            tzLower.includes('jeddah') || 
            tzLower.includes('dammam') || 
            tzLower.includes('arabia') || 
            tzLower.includes('kuwait') || 
            tzLower.includes('qatar') || 
            tzLower.includes('bahrain')
          ) {
            resolvedCountryName = 'Saudi Arabia';
            autoCurrency = 'SAR';
          }
        }
      } catch (err) {
        console.error("Timezone fetch fail", err);
      }

      // Override with IP Geolocation if detected and accurate
      if (ipCountryCode) {
        if (ipCountryCode === 'BD') {
          resolvedCountryName = 'Bangladesh';
          autoCurrency = 'BDT';
        } else if (ipCountryCode === 'SA') {
          resolvedCountryName = 'Saudi Arabia';
          autoCurrency = 'SAR';
        } else {
          resolvedCountryName = 'USA / Others';
          autoCurrency = 'USD';
        }
      }
    } else if (sim === 'BD') {
      resolvedCountryName = 'Bangladesh';
      autoCurrency = 'BDT';
    } else if (sim === 'SA') {
      resolvedCountryName = 'Saudi Arabia';
      autoCurrency = 'SAR';
    } else {
      resolvedCountryName = 'USA / Others';
      autoCurrency = 'USD';
    }

    // Determine final currency based on active / enabled status
    let finalCurrency = autoCurrency;
    if (!currencySettings.enabled[finalCurrency]) {
      finalCurrency = currencySettings.defaultCurrency || 'USD';
    }
    if (!currencySettings.enabled[finalCurrency]) {
      // absolute fallback to any enabled currency
      const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
      finalCurrency = firstEnabled || 'USD';
    }

    const simChanged = lastSimulatedCountry.current !== sim;
    const isFirstTime = !initialDetectionRun.current;

    // We only force-override the active currency if:
    // 1. It's the very first render, and no manually saved currency exists, OR
    // 2. The simulation configuration/region is explicitly changed by the Administrator.
    const hasSavedActiveCurrency = localStorage.getItem('webzone_active_currency');

    let targetCurrency = currency;
    if (simChanged || (isFirstTime && !hasSavedActiveCurrency)) {
      targetCurrency = finalCurrency;
    }

    // Verify if current active currency is enabled (if not, force fallback)
    if (!currencySettings.enabled[targetCurrency]) {
      let fall = currencySettings.defaultCurrency || 'USD';
      if (!currencySettings.enabled[fall]) {
        const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
        fall = firstEnabled || 'USD';
      }
      targetCurrency = fall;
    }

    // Language automatic update logic
    const isManualLanguage = localStorage.getItem('webzone_language_manual') === 'true';
    let targetLanguage: Language = 'en';
    if (sim === 'BD' || resolvedCountryName === 'Bangladesh') {
      targetLanguage = 'bn';
    } else if (sim === 'SA' || resolvedCountryName === 'Saudi Arabia') {
      targetLanguage = 'en'; // Defaults to English for Arabia as explicitly requested by the user
    }

    // Force language if simulation changed, OR if no manual preference is set yet
    if (simChanged || (!isManualLanguage && isFirstTime)) {
      setLanguageState(targetLanguage);
      localStorage.setItem('webzone_language', targetLanguage);
    }

    // Update settings and active currency context stably
    let updated = false;
    const nextSettings = { ...currencySettings };

    if (currencySettings.detectedCountryName !== resolvedCountryName) {
      nextSettings.detectedCountryName = resolvedCountryName;
      updated = true;
    }

    if (updated) {
      setCurrencySettings(nextSettings);
    }

    if (currency !== targetCurrency) {
      setCurrency(targetCurrency);
    }

    // Keep state refs clean for next execution blocks
    lastSimulatedCountry.current = sim;
    initialDetectionRun.current = true;
  }, [currencySettings.simulatedCountry, currencySettings.enabled, currencySettings.defaultCurrency, currency, ipCountryCode]);
  const [posts, setPosts] = useState<LocalBlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('webzonebd_blog_posts');
      if (saved) {
        const parsed: LocalBlogPost[] = JSON.parse(saved);
        // Ensure any new default blogs (like 'whmcs-automation') are added
        const missing = initialLocalBlogs.filter(def => !parsed.some(p => p.id === def.id));
        if (missing.length > 0) {
          return [...missing, ...parsed];
        }
        return parsed;
      }
      return initialLocalBlogs;
    } catch (e) {
      console.error("Failed to parse webzonebd_blog_posts", e);
      return initialLocalBlogs;
    }
  });

  useEffect(() => {
    localStorage.setItem('webzonebd_blog_posts', JSON.stringify(posts));
  }, [posts]);

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse webzone_tickets", e);
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse webzone_coupons", e);
      return [];
    }
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    try {
      const saved = localStorage.getItem('webzone_system_config');
      return saved ? JSON.parse(saved) : systemConfigDefault;
    } catch (e) {
      console.error("Failed to parse webzone_system_config", e);
      return systemConfigDefault;
    }
  });

  // Lifted Payment Control Center States
  const [currencyRates, setCurrencyRates] = useState(() => {
    try {
      const saved = localStorage.getItem('webzone_currency_rates');
      return saved ? JSON.parse(saved) : { BDT: 118.5, SAR: 3.75, USD: 1.0 };
    } catch (e) {
      return { BDT: 118.5, SAR: 3.75, USD: 1.0 };
    }
  });

  const [verificationSettings, setVerificationSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('webzone_verification_settings');
      return saved ? JSON.parse(saved) : {
        verificationMode: 'manual',
        txnIdRequired: true,
        screenshotRequired: true
      };
    } catch (e) {
      return {
        verificationMode: 'manual',
        txnIdRequired: true,
        screenshotRequired: true
      };
    }
  });

  const [paymentNotifs, setPaymentNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem('webzone_payment_notifs');
      return saved ? JSON.parse(saved) : { email: true, sms: false, whatsapp: true, telegram: false };
    } catch (e) {
      return { email: true, sms: false, whatsapp: true, telegram: false };
    }
  });

  const [bdMethods, setBdMethods] = useState(() => {
    try {
      const saved = localStorage.getItem('webzone_bd_methods');
      return saved ? JSON.parse(saved) : {
        bkash: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: 'bkash_mid_9901_key', instructions: 'Send Money or Personal transfer directly to our bKash personal wallet.', qrCode: '' },
        nagad: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: 'nagad_api_secure_token', instructions: 'Send Money directly to our secure Nagad Personal Wallet.', qrCode: '' },
        rocket: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: '', instructions: 'Direct Mobile Cash-in or Send Money via Rocket wallet.', qrCode: '' },
        cellfin: { enabled: true, number: '0186400 0005', instructions: 'Initiate prompt cellfin transfer directly to our wallet.', qrCode: '' },
        islamiBank: { enabled: true, bankName: 'Islami Bank Bangladesh PLC', accountName: 'MD IMRAN HOSSAIN', accountNumber: '20501290204369912', iban: 'BD03IBBL20501290204369912', swift: 'IBBLBDDHXXX', qrCode: '' }
      };
    } catch (e) {
      return {
        bkash: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: 'bkash_mid_9901_key', instructions: 'Send Money or Personal transfer directly to our bKash personal wallet.', qrCode: '' },
        nagad: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: 'nagad_api_secure_token', instructions: 'Send Money directly to our secure Nagad Personal Wallet.', qrCode: '' },
        rocket: { enabled: true, type: 'personal', number: '0186400 0005', apiKey: '', instructions: 'Direct Mobile Cash-in or Send Money via Rocket wallet.', qrCode: '' },
        cellfin: { enabled: true, number: '0186400 0005', instructions: 'Initiate prompt cellfin transfer directly to our wallet.', qrCode: '' },
        islamiBank: { enabled: true, bankName: 'Islami Bank Bangladesh PLC', accountName: 'MD IMRAN HOSSAIN', accountNumber: '20501290204369912', iban: 'BD03IBBL20501290204369912', swift: 'IBBLBDDHXXX', qrCode: '' }
      };
    }
  });

  const [saMethods, setSaMethods] = useState(() => {
    try {
      const saved = localStorage.getItem('webzone_sa_methods');
      return saved ? JSON.parse(saved) : {
        stcPay: { enabled: true, walletNumber: '+966 57 051 1931', instructions: 'Transfer via STC Pay mobile app directly to our wallet.', qrCode: '' },
        alRajhi: { enabled: true, bankName: 'Al Rajhi Bank Saudi Arabia 🇸🇦', accountName: 'MD IMRAN HOSSAIN', accountNumber: '621000010006086016528', iban: 'SA56 8000 0621 6080 1601 6528', swift: 'RJHISARI', qrCode: '' }
      };
    } catch (e) {
      return {
        stcPay: { enabled: true, walletNumber: '+966 57 051 1931', instructions: 'Transfer via STC Pay mobile app directly to our wallet.', qrCode: '' },
        alRajhi: { enabled: true, bankName: 'Al Rajhi Bank Saudi Arabia 🇸🇦', accountName: 'MD IMRAN HOSSAIN', accountNumber: '621000010006086016528', iban: 'SA56 8000 0621 6080 1601 6528', swift: 'RJHISARI', qrCode: '' }
      };
    }
  });

  const [intlMethods, setIntlMethods] = useState(() => {
    try {
      const saved = localStorage.getItem('webzone_intl_methods');
      return saved ? JSON.parse(saved) : {
        paypal: { enabled: true, email: 'billing@webzonebd.com', clientId: 'AX_M_MOCK_PAYPAL_CLIENT_ID_9921', secretKey: 'E_M_MOCK_SECRET_KEY_8820' },
        bankTransfer: { enabled: true, bankName: 'HSBC International', accountHolder: 'WebzoneBD Global Ltd', accountNumber: '4005001234566', iban: 'GB88MIDL4005001234566', swift: 'MIDLGB22' }
      };
    } catch (e) {
      return {
        paypal: { enabled: true, email: 'billing@webzonebd.com', clientId: 'AX_M_MOCK_PAYPAL_CLIENT_ID_9921', secretKey: 'E_M_MOCK_SECRET_KEY_8820' },
        bankTransfer: { enabled: true, bankName: 'HSBC International', accountHolder: 'WebzoneBD Global Ltd', accountNumber: '4005001234566', iban: 'GB88MIDL4005001234566', swift: 'MIDLGB22' }
      };
    }
  });

  const [customMethods, setCustomMethods] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_custom_methods');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Keep currencySettings rates in sync with currencyRates
  useEffect(() => {
    setCurrencySettings(prev => {
      if (prev.rates.BDT === currencyRates.BDT && prev.rates.SAR === currencyRates.SAR && prev.rates.USD === currencyRates.USD) {
        return prev;
      }
      return {
        ...prev,
        rates: {
          ...prev.rates,
          USD: currencyRates.USD || 1.0,
          BDT: currencyRates.BDT || 118.5,
          SAR: currencyRates.SAR || 3.75
        }
      };
    });
  }, [currencyRates]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedUser = localStorage.getItem('webzone_session_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          const savedCart = localStorage.getItem(`webzone_cart_${parsedUser.id}`);
          if (savedCart) return JSON.parse(savedCart);
        }
      }
      const savedGuestCart = localStorage.getItem('webzone_cart_guest') || localStorage.getItem('webzone_cart');
      return savedGuestCart ? JSON.parse(savedGuestCart) : [];
    } catch (e) {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // For MacBook Genie Fly-to-Cart animation
  const [flyingItems, setFlyingItems] = useState<FlyingCartItem[]>([]);
  const lastClickRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      lastClickRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  const getCartTargetCoordinates = (): { x: number; y: number } => {
    // Check if on mobile screen width first (bottom navigation cart button)
    if (window.innerWidth < 768) {
      const mobileCart = document.getElementById('nav-item-cart') || document.getElementById('mobile-bottom-cart-btn');
      if (mobileCart) {
        const rect = mobileCart.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      }
    }

    let el = document.getElementById('global-header-cart-btn');
    if (!el) {
      el = document.querySelector('[aria-label="View Cart"]') || document.querySelector('.fa-shopping-cart') || document.querySelector('.lucide-shopping-bag');
    }
    if (el) {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    return {
      x: window.innerWidth - 80,
      y: 50
    };
  };

  const triggerCartFlyAnimation = (
    product: Product,
    eventOrOrigin?: React.MouseEvent | HTMLElement | { clientX: number; clientY: number }
  ) => {
    let startX = lastClickRef.current.x || window.innerWidth / 2;
    let startY = lastClickRef.current.y || window.innerHeight / 2;

    if (eventOrOrigin) {
      if ('clientX' in eventOrOrigin && typeof eventOrOrigin.clientX === 'number') {
        startX = eventOrOrigin.clientX;
        startY = eventOrOrigin.clientY;
      } else if (eventOrOrigin instanceof HTMLElement) {
        const rect = eventOrOrigin.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else if ('currentTarget' in (eventOrOrigin as any)) {
        const target = (eventOrOrigin as any).currentTarget as HTMLElement;
        if (target && target.getBoundingClientRect) {
          const rect = target.getBoundingClientRect();
          startX = rect.left + rect.width / 2;
          startY = rect.top + rect.height / 2;
        }
      }
    }

    const { x: endX, y: endY } = getCartTargetCoordinates();

    const newFlyingItem: FlyingCartItem = {
      id: `fly-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      startX,
      startY,
      endX,
      endY,
      image: product.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
      name: language === 'bn' ? (product.nameBn || product.name) : language === 'ar' ? (product.nameAr || product.name) : product.name,
      price: product.discountPrice || product.price,
      badge: product.badge || 'PRO',
      category: product.category
    };

    setFlyingItems(prev => [...prev, newFlyingItem]);
  };

  // Save cart changes per-user or guest
  useEffect(() => {
    if (user) {
      localStorage.setItem(`webzone_cart_${user.id}`, JSON.stringify(cart));
    } else {
      localStorage.setItem('webzone_cart_guest', JSON.stringify(cart));
      localStorage.setItem('webzone_cart', JSON.stringify(cart));
    }
  }, [cart, user?.id]);

  useEffect(() => {
    localStorage.setItem('webzone_payment_notifs', JSON.stringify(paymentNotifs));
  }, [paymentNotifs]);

  useEffect(() => {
    localStorage.setItem('webzone_bd_methods', JSON.stringify(bdMethods));
  }, [bdMethods]);

  useEffect(() => {
    localStorage.setItem('webzone_sa_methods', JSON.stringify(saMethods));
  }, [saMethods]);

  useEffect(() => {
    localStorage.setItem('webzone_intl_methods', JSON.stringify(intlMethods));
  }, [intlMethods]);

  useEffect(() => {
    localStorage.setItem('webzone_custom_methods', JSON.stringify(customMethods));
  }, [customMethods]);

  // Keep currencySettings rates in sync with currencyRates
  useEffect(() => {
    setCurrencySettings(prev => {
      if (prev.rates.BDT === currencyRates.BDT && prev.rates.SAR === currencyRates.SAR && prev.rates.USD === currencyRates.USD) {
        return prev;
      }
      return {
        ...prev,
        rates: {
          ...prev.rates,
          USD: currencyRates.USD || 1.0,
          BDT: currencyRates.BDT || 118.5,
          SAR: currencyRates.SAR || 3.75
        }
      };
    });
  }, [currencyRates]);

  // Save cart changes per-user or guest
  useEffect(() => {
    if (user) {
      localStorage.setItem(`webzone_cart_${user.id}`, JSON.stringify(cart));
    } else {
      localStorage.setItem('webzone_cart_guest', JSON.stringify(cart));
      localStorage.setItem('webzone_cart', JSON.stringify(cart));
    }
  }, [cart, user?.id]);

  // Load user-specific wishlist and cart when user ID changes
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = user?.id || null;
    if (currentUserId !== lastUserIdRef.current) {
      if (currentUserId) {
        // User logged in (or switched)
        // 1. Wishlist Load
        const savedUserWishlist = localStorage.getItem(`webzone_wishlist_${currentUserId}`);
        if (savedUserWishlist) {
          setWishlist(JSON.parse(savedUserWishlist));
        } else if (user?.wishlistedProductIds && user.wishlistedProductIds.length > 0) {
          setWishlist(user.wishlistedProductIds);
          localStorage.setItem(`webzone_wishlist_${currentUserId}`, JSON.stringify(user.wishlistedProductIds));
        } else {
          // If no user wishlist existed, migrate guest wishlist or set empty
          const currentWishlist = wishlist;
          localStorage.setItem(`webzone_wishlist_${currentUserId}`, JSON.stringify(currentWishlist));
          setUser(prev => prev ? { ...prev, wishlistedProductIds: currentWishlist } : null);
        }

        // 2. Cart Load
        const savedUserCart = localStorage.getItem(`webzone_cart_${currentUserId}`);
        if (savedUserCart) {
          setCart(JSON.parse(savedUserCart));
        } else {
          // If no user cart existed, carry over the guest cart
          localStorage.setItem(`webzone_cart_${currentUserId}`, JSON.stringify(cart));
        }
      } else {
        // User logged out
        // Restore guest wishlist and guest cart
        const guestSavedWishlist = localStorage.getItem('webzone_wishlist_guest');
        if (guestSavedWishlist) {
          setWishlist(JSON.parse(guestSavedWishlist));
        } else {
          setWishlist([]);
        }

        const guestSavedCart = localStorage.getItem('webzone_cart_guest');
        if (guestSavedCart) {
          setCart(JSON.parse(guestSavedCart));
        } else {
          setCart([]);
        }
      }
      lastUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  // Persistent state handlers
  useEffect(() => {
    localStorage.setItem('webzone_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('webzone_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('webzone_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('webzone_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('webzone_system_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('webzone_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('webzone_session_user');
      firebaseAuth.signOut().catch(err => console.warn("Firebase sign out error: ", err));
    }
  }, [user]);

  // Security Guards: Protect Dashboard and Admin routes from unauthenticated users
  useEffect(() => {
    if ((currentPage === 'dashboard' || currentPage === 'admin') && !user) {
      setCurrentPage('home');
      setAuthDefaultView('login');
      setIsAuthPopupOpen(true);
      triggerToast(language === 'bn' 
        ? "🔒 ড্যাশবোর্ড ব্যবহারের জন্য দয়া করে লগইন করুন!" 
        : "🔒 Access Restricted. Kindly authenticate your account session."
      );
    }
  }, [currentPage, user, language]);

  useEffect(() => {
    localStorage.setItem('webzone_active_currency', currency);
    // Persist under checkout session key
    sessionStorage.setItem('webzone_checkout_currency', currency);
    // Synchronize with user account profile baseline if logged in
    if (user && user.preferredCurrency !== currency) {
      setUser(prev => prev ? { ...prev, preferredCurrency: currency } : null);
    }
  }, [currency, user]);

  useEffect(() => {
    localStorage.setItem('webzone_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Handle theme body toggling classes with persistent storage & smooth Hostinger animation
  const handleThemeToggle = (newTheme?: Theme, event?: React.MouseEvent) => {
    const nextTheme = newTheme || (theme === 'light' ? 'dark' : 'light');
    
    if (event) {
      const rect = (event.currentTarget as HTMLElement)?.getBoundingClientRect?.();
      if (rect) {
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        document.documentElement.style.setProperty('--theme-x', `${x}px`);
        document.documentElement.style.setProperty('--theme-y', `${y}px`);
      }
    } else {
      document.documentElement.style.setProperty('--theme-x', `50%`);
      document.documentElement.style.setProperty('--theme-y', `50%`);
    }

    document.documentElement.classList.add('theme-transition-active');

    const applyTheme = () => {
      flushSync(() => {
        setTheme(nextTheme);
        const root = window.document.documentElement;
        if (nextTheme === 'dark') {
          root.classList.add('dark');
          root.style.backgroundColor = '#0F172A';
        } else {
          root.classList.remove('dark');
          root.style.backgroundColor = '#FFFFFF';
        }
      });
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      try {
        (document as any).startViewTransition(() => {
          applyTheme();
        });
      } catch (e) {
        applyTheme();
      }
    } else {
      applyTheme();
    }

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition-active');
    }, 700);
  };

  useEffect(() => {
    localStorage.setItem('webzone_theme', theme);
    const root = window.document.documentElement;
    root.classList.add('transition-colors', 'duration-500');
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0F172A';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#FFFFFF';
    }
  }, [theme]);

  // Toast notifier helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Helper to push activity logs dynamically
  const addActivityLog = (action: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: ActivityLog = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9),
      action,
      ipAddress: "192.168.1." + Math.floor(10 + Math.random() * 90),
      userAgent: navigator.userAgent.slice(0, 50),
      timestamp
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  // Cart operations
  const addToCart = (
    product: Product,
    eventOrOrigin?: React.MouseEvent | HTMLElement | { clientX: number; clientY: number }
  ) => {
    // Trigger the MacBook Genie motion animation
    triggerCartFlyAnimation(product, eventOrOrigin);

    // Check duplication
    const isAlreadyInCart = cart.some(item => item.product.id === product.id);
    if (isAlreadyInCart) {
      triggerToast(language === 'bn' ? "ইতিমধ্যে কার্ট ফাইলে যুক্ত আছে!" : language === 'ar' ? "هذه البرمجية مضافة بالفعل في السلة" : "Already in shopping cart!");
      return;
    }

    // See if any coupon is currently active in localStorage
    let activeCoupon = null;
    const activeCode = localStorage.getItem('webzone_active_coupon_code');
    if (activeCode) {
      activeCoupon = coupons.find(c => c.code === activeCode.toUpperCase());
    }

    const newItem = activeCoupon ? { product, appliedCoupon: activeCoupon } : { product };

    setCart(prev => [...prev, newItem]);
    addActivityLog(`Added product in digital cart: ${product.name}`);
    triggerToast(language === 'bn' ? `${product.name} কার্ট ফাইলে যোগ করা হয়েছে!` : language === 'ar' ? `تمت إضافة ${product.name} بنجاح` : `Added ${product.name} to cart.`);
  };

  const removeFromCart = (index: number) => {
    const term = cart[index].product.name;
    const duplicated = [...cart];
    duplicated.splice(index, 1);
    setCart(duplicated);
    addActivityLog(`Removed product from cart: ${term}`);
    triggerToast(language === 'bn' ? "কার্ট ফাইল থেকে সরানো হয়েছে।" : language === 'ar' ? "تم الحذف من السلة" : "Removed from cart.");
  };

  const applyCouponToCart = (couponCode: string): string | null => {
    const codeUpper = couponCode.trim().toUpperCase();
    const activeCoupon = coupons.find(c => c.code === codeUpper);

    if (!activeCoupon) {
      return language === 'bn' ? "ভুল কুপন কোড!" : language === 'ar' ? "رمز الكوبون غير صالح" : "Invalid coupon code!";
    }

    const isPastExpiry = activeCoupon.expiryDate ? new Date(activeCoupon.expiryDate + 'T23:59:59') < new Date() : false;
    const isExpired = activeCoupon.status === 'expired' || isPastExpiry;

    if (isExpired) {
      return language === 'bn' ? "ভুল কুপন কোড!" : language === 'ar' ? "رمز الكوبون غير صالح" : "Invalid coupon code!";
    }

    // Save active coupon identifier to localStorage
    localStorage.setItem('webzone_active_coupon_code', codeUpper);

    // Increment usageCount in coupons state
    setCoupons((prevCoupons) =>
      prevCoupons.map((c) =>
        c.code === codeUpper
          ? { ...c, usageCount: (c.usageCount ?? 0) + 1 }
          : c
      )
    );

    // Apply to all items
    const updated = cart.map(item => ({
      ...item,
      appliedCoupon: { ...activeCoupon, usageCount: (activeCoupon.usageCount ?? 0) + 1 }
    }));

    setCart(updated);
    addActivityLog(`Applied promotional voucher to checkout: ${codeUpper}`);
    return null; // success
  };

  const removeCouponFromCart = () => {
    localStorage.removeItem('webzone_active_coupon_code');
    setCart((prevCart) =>
      prevCart.map((item) => {
        const { appliedCoupon, ...rest } = item;
        return rest;
      })
    );
    addActivityLog(`Removed applied coupon from cart`);
  };

  // URL coupon auto-application check
  const initialCouponProcessed = useRef(false);
  useEffect(() => {
    if (initialCouponProcessed.current) return;
    if (coupons.length === 0) return;
    initialCouponProcessed.current = true;
    const params = new URLSearchParams(window.location.search);
    const urlCoupon = params.get('coupon');
    if (urlCoupon) {
      const codeUpper = urlCoupon.trim().toUpperCase();
      const match = coupons.find(c => c.code === codeUpper);
      if (match) {
        localStorage.setItem('webzone_active_coupon_code', codeUpper);
        if (cart.length > 0) {
          applyCouponToCart(codeUpper);
        } else {
          triggerToast(language === 'bn' ? `প্রোমো কোড "${codeUpper}" অ্যাক্টিভেট করা হয়েছে! কার্টে ছাড় প্রযোজ্য হবে।` : language === 'ar' ? `تم تفعيل كود الخصم "${codeUpper}" بنجاح!` : `Coupon code "${codeUpper}" activated! Discount will be applied.`);
          addActivityLog(`URL Parameter Coupon auto-activated: ${codeUpper}`);
        }
      } else {
        triggerToast(language === 'bn' ? `ভুল কুপন কোড "${codeUpper}"!` : language === 'ar' ? `رمز الكوبون "${codeUpper}" غير صالح` : `Invalid URL coupon "${codeUpper}".`);
      }
    }
  }, [coupons, cart.length]);

  const resetCart = () => setCart([]);

  const processAffiliateCommission = (orderId: string, itemTitle: string, price: number) => {
    const referrerId = localStorage.getItem('webzone_referral_partner_id');
    const campaignSuffix = localStorage.getItem('webzone_referral_campaign_suffix') || 'direct';
    if (!referrerId) return;

    // Load static/existing affiliates
    const savedAffs = localStorage.getItem('webzone_affiliate_list');
    const affiliatesList = savedAffs ? JSON.parse(savedAffs) : [
      { userId: 'usr-101', name: 'Imran Hasan', code: 'PARTNER-IMRAN', referrals: 24, commissionEarned: 1240, status: 'approved', channel: 'Personal Tech Blog', commissionRate: 20, registeredAt: '2025-10-15', balance: 140, clicks: 1482, paymentDetails: 'bKash: 01711223344' },
      { userId: 'usr-102', name: 'Al-Shehri Majid', code: 'PARTNER-MAJID', referrals: 58, commissionEarned: 3500, status: 'approved', channel: 'Riyadh Hosting Network', commissionRate: 25, registeredAt: '2025-11-20', balance: 840, clicks: 3120, paymentDetails: 'PayPal: majid@saudiweb.com' },
      { userId: 'usr-103', name: 'Zeeshan Rahman', code: 'PARTNER-ZEESHAN', referrals: 8, commissionEarned: 320, status: 'approved', channel: 'YouTube Channel', commissionRate: 15, registeredAt: '2026-01-11', balance: 0, clicks: 540, paymentDetails: 'Nagad: 01864051151' },
      { userId: 'usr-105', name: 'Enamul Haque', code: 'AFF-ENAMUL', referrals: 15, commissionEarned: 560, status: 'approved', channel: 'Dhaka Host Group LLC', commissionRate: 15, registeredAt: '2025-11-10', balance: 120, clicks: 420, paymentDetails: 'bKash: 01912345678' },
    ];

    // Try finding the partner by code or by userId
    const affiliate = affiliatesList.find((a: any) => 
      a.code.toUpperCase() === referrerId.toUpperCase() || 
      a.userId === referrerId
    );

    if (affiliate && affiliate.status === 'approved') {
      const rate = affiliate.commissionRate || 15;
      const commissionEarned = parseFloat((price * (rate / 100)).toFixed(2));
      
      // Credit stats
      affiliate.referrals += 1;
      affiliate.commissionEarned += commissionEarned;
      affiliate.balance += commissionEarned;

      // Save back to master list
      localStorage.setItem('webzone_affiliate_list', JSON.stringify(affiliatesList));

      // Load and append to referral ledger
      const savedRefs = localStorage.getItem('webzone_affiliate_referrals');
      const referralsList = savedRefs ? JSON.parse(savedRefs) : [
        { id: 'ref-1', affiliateId: 'usr-101', affiliateCode: 'PARTNER-IMRAN', referredUserName: 'Anwar Hossain', productName: 'Corporate Portal Dynamic Development', saleAmount: 450, commissionEarned: 90, campaignSuffix: 'tech_post', date: '2026-06-12', status: 'approved' },
        { id: 'ref-2', affiliateId: 'usr-102', affiliateCode: 'PARTNER-MAJID', referredUserName: 'Bander Al-Harbi', productName: 'Premium VPS Dedicated Node', saleAmount: 1200, commissionEarned: 300, campaignSuffix: 'hosting_campaign', date: '2026-06-11', status: 'approved' }
      ];

      const newRef = {
        id: "ref-" + Math.floor(10000 + Math.random() * 90000),
        affiliateId: affiliate.userId,
        affiliateCode: affiliate.code,
        referredUserName: user?.name || "Anonymous Client",
        productName: itemTitle,
        saleAmount: price,
        commissionEarned: commissionEarned,
        campaignSuffix: campaignSuffix,
        date: new Date().toISOString().split('T')[0],
        status: 'approved'
      };

      referralsList.push(newRef);
      localStorage.setItem('webzone_affiliate_referrals', JSON.stringify(referralsList));

      // Broadcast success notification
      triggerToast(`💸 Affiliate referral tracked! $${commissionEarned} commission credited to Partner ${affiliate.name}!`);
    }
  };

  // Purchases booking simulator from Checkout buttons
  const addSimulatedOrder = async (
    method: string, 
    guestInfo?: { 
      name: string; 
      phone: string; 
      email: string; 
      transactionId?: string; 
      transactionReceipt?: string; 
      isGuest?: boolean;
      orderNotes?: string;
    }
  ) => {
    const orderItems: Order[] = cart.map(item => {
      const p = item.product;
      const basePrice = p.discountPrice || p.price;
      const discount = item.appliedCoupon ? (basePrice * item.appliedCoupon.discountPercent / 100) : 0;
      const finalPrice = parseFloat((basePrice - discount).toFixed(2));

      // Calculate adjusted advance amount based on coupon/discount if applicable
      let itemAdvancePercent = p.advancePercent;
      let itemAdvanceAmount = p.advanceAmount;
      let itemDueAmount = p.dueAmount;

      if (itemAdvancePercent !== undefined && itemAdvancePercent < 100) {
        itemAdvanceAmount = Math.round(finalPrice * (itemAdvancePercent / 100));
        itemDueAmount = finalPrice - itemAdvanceAmount;
      }

      const txId = guestInfo?.transactionId || "TXNDG" + Math.floor(1000000 + Math.random() * 9000000);
      const staffList = ["Imran Khan", "Afsana Mim", "Shakil Ahmed", "Kamrul Hasan", "Farhana Islam", "Tarek Rahman"];
      const randomStaff = staffList[Math.floor(Math.random() * staffList.length)];

      return {
        id: "ord-sim-" + Math.floor(10000 + Math.random() * 90000),
        productId: p.id,
        itemTitle: p.name,
        price: finalPrice,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: guestInfo?.isGuest ? `${method} (Guest Checkout)` : `${method} Gateways`,
        paymentStatus: 'pending',
        status: 'pending',
        isGuest: guestInfo?.isGuest || false,
        guestName: guestInfo?.name || '',
        guestPhone: guestInfo?.phone || '',
        guestEmail: guestInfo?.email || '',
        transactionId: txId,
        transactionReceipt: guestInfo?.transactionReceipt || '',
        downloadUrl: p.downloadUrl || 'https://webzonebd.com/secure-download/package-source.zip',
        customerName: guestInfo?.name || user?.name || 'Mizanur Rahman',
        customerEmail: guestInfo?.email || user?.email || 'mizanur@gmail.com',
        customerPhone: guestInfo?.phone || user?.phone || '01711223344',
        assignedStaff: randomStaff,
        orderNotes: guestInfo?.orderNotes || '',
        advancePercent: itemAdvancePercent,
        advanceAmount: itemAdvanceAmount,
        dueAmount: itemDueAmount
      };
    });

    setOrders([...orders, ...orderItems]);

    // Push new alerts to localStorage for the Super Admin notifications panel
    try {
      const existingAlertsRaw = localStorage.getItem('admin_webhooks_alerts');
      let existingAlerts = [];
      if (existingAlertsRaw) {
        existingAlerts = JSON.parse(existingAlertsRaw);
      }
      if (!Array.isArray(existingAlerts) || existingAlerts.length === 0) {
        existingAlerts = [
          { id: 'nt-1', title: "Stripe Webhook checkout completed", body: "Metadata parsed successfully for id ord-99381. Authorized payment gateway handshake verified.", dt: "10 mins ago", severity: "info" },
          { id: 'nt-2', title: "Hostinger deployment container container backup OK", body: "Hostinger server node backup cycle consolidated cleanly with no corrupted segments.", dt: "2 hours ago", severity: "success" },
          { id: 'nt-3', title: "Nagad API signature handshake timeout threshold warning", body: "Webzone Nagad Payment Gateway gateway handshake response took 4.5s. Exceeded target threshold parameters.", dt: "1 day ago", severity: "warning" },
          { id: 'nt-4', title: "Secured administrative session login key generated", body: "IP 103.112.54.9 authorized Standard Super-Admin tokens credentials handshake successfully.", dt: "2 days ago", severity: "info" }
        ];
      }

      const clientName = guestInfo?.name || user?.name || "Client Customer";
      orderItems.forEach(ord => {
        existingAlerts.unshift({
          id: "nt-ord-" + ord.id,
          title: `⚠️ Manual Payment Verification Needed (Order #${ord.id})`,
          body: `Customer ${clientName} placed an order for "${ord.itemTitle}" via ${ord.paymentMethod}. Charged amount: $${ord.price}. Verification: Please inspect transaction details and manually verify to deliver digital assets download links.`,
          dt: "Just now",
          severity: "warning"
        });
      });

      localStorage.setItem('admin_webhooks_alerts', JSON.stringify(existingAlerts));
    } catch (err) {
      console.warn("Failed to inject admin webhook alert:", err);
    }

    // Firestore Integration: Save order documents
    for (const ord of orderItems) {
      try {
        const docRef = doc(firebaseDb, 'orders', ord.id);
        await setDoc(docRef, {
          ...ord,
          userId: user?.id || 'anonymous'
        });
      } catch (err) {
        console.warn("Real Firestore Order save bypassed or unconfigured:", err);
      }
      
      // Process affiliate commission for this item
      processAffiliateCommission(ord.id, ord.itemTitle, ord.price);
    }

    // Log tracking
    addActivityLog(`${guestInfo?.isGuest ? 'Guest customer' : 'Authenticated user'} completed checkout purchase of ${orderItems.length} products via ${method} - Initial status set to PENDING`);
  };

  // Custom Inquiry service orders simulator
  const addSimulatedServiceOrder = async (order: Order) => {
    setOrders([...orders, order]);

    try {
      const docRef = doc(firebaseDb, 'orders', order.id);
      await setDoc(docRef, {
        ...order,
        userId: user?.id || 'anonymous'
      });
    } catch (err) {
      console.warn("Real Firestore Service Order save bypassed:", err);
    }

    // Process affiliate commission for this service
    if (order.price) {
      processAffiliateCommission(order.id, order.itemTitle, order.price);
    }

    addActivityLog(`Acquired custom digital solutions package order: ${order.itemTitle}`);
  };

  // Support ticket operations
  const addSupportTicket = async (ticket: SupportTicket) => {
    setTickets([ticket, ...tickets]);

    try {
      const docRef = doc(firebaseDb, 'tickets', ticket.id);
      await setDoc(docRef, {
        ...ticket,
        userId: user?.id || 'anonymous'
      });
    } catch (err) {
      console.warn("Real Firestore Ticket save bypassed:", err);
    }
  };

  const addTicketReply = async (ticketId: string, message: string, sender: 'user' | 'admin') => {
    const updated = tickets.map(tkt => {
      if (tkt.id === ticketId) {
        return {
          ...tkt,
          status: sender === 'admin' ? 'answered' : 'open' as any,
          replies: [
            ...tkt.replies,
            {
              sender,
              message,
              createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return tkt;
    });

    setTickets(updated);

    // Update in Firestore
    try {
      const docRef = doc(firebaseDb, 'tickets', ticketId);
      const ticketObj = updated.find(t => t.id === ticketId);
      if (ticketObj) {
        await setDoc(docRef, {
          ...ticketObj,
          userId: user?.id || 'anonymous'
        }, { merge: true });
      }
    } catch (err) {
      console.info("Real Firestore Ticket reply write bypassed:", err);
    }

    addActivityLog(`SaaS Support message post: Ref ${ticketId} [By ${sender.toUpperCase()}]`);
  };

  // Admin exclusive states managers
  const addNewProduct = (prod: Product) => {
    setProducts([prod, ...products]);
    addActivityLog(`Created new product: ${prod.name} (ID: ${prod.id}) under category "${prod.category}"`);
  };
  const deleteProduct = (id: string) => {
    const found = products.find(p => p.id === id);
    setProducts(products.filter(p => p.id !== id));
    if (found) {
      addActivityLog(`Purged product from catalog: ${found.name} (ID: ${id})`);
    } else {
      addActivityLog(`Purged product from catalog: ID ${id}`);
    }
  };
  const updateOrderStatus = (id: string, status: 'completed' | 'failed' | 'refunded') => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          paymentStatus: status as any,
          status: status === 'completed' ? 'delivered' : o.status
        };
      }
      return o;
    }));
    addActivityLog(`Admin modified Order Reference Status: #${id} [To ${status.toUpperCase()}]`);
    if (status === 'refunded') {
      const adminUser = user?.username || user?.email || 'admin_root';
      addActivityLog(`Order #${id} marked as REFUNDED by administrative user: ${adminUser}`);
    }
  };
  const updateOrderDetails = (id: string, updatedFields: Partial<Order>) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          ...updatedFields
        };
      }
      return o;
    }));
    addActivityLog(`Admin updated order details for #${id}: ${Object.keys(updatedFields).join(', ')}`);
  };
  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    addActivityLog(`Purged and deleted Order Record Reference: #${id}`);
  };
  const addNewCoupon = (cp: Coupon) => {
    setCoupons([cp, ...coupons]);
    addActivityLog(`Created new promotional coupon code: ${cp.code} [Discount: ${cp.discountPercent}% OFF]`);
  };
  const updateCoupon = (code: string, updatedCoupon: Coupon) => {
    setCoupons(prev => prev.map(c => c.code.toUpperCase() === code.toUpperCase() ? updatedCoupon : c));
    addActivityLog(`Updated promotional coupon code: ${updatedCoupon.code}`);
  };
  const deleteCoupon = (code: string) => {
    setCoupons(coupons.filter(c => c.code !== code));
    addActivityLog(`Deactivated and deleted promotional coupon code: ${code}`);
  };

  const updateProductRating = (idOrName: string, rating: number, comment: string) => {
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (
          p.id === idOrName ||
          p.name.toLowerCase() === idOrName.toLowerCase() ||
          p.name.toLowerCase().includes(idOrName.toLowerCase()) ||
          idOrName.toLowerCase().includes(p.name.toLowerCase())
        ) {
          const currentReviewsCount = p.reviewsCount || 0;
          const currentRating = p.rating || 4.5;
          const targetCount = currentReviewsCount + 1;
          const targetRating = Number(((currentRating * currentReviewsCount + rating) / targetCount).toFixed(1));
          return {
            ...p,
            reviewsCount: targetCount,
            rating: targetRating
          };
        }
        return p;
      });
    });
    addActivityLog(`Submitted feedback rating ${rating}★ for "${idOrName}". Comment: "${comment.substring(0, 45)}"`);
  };

  // Switch RTL alignment depending on Arabic representation
  const isRtl = language === 'ar';

  const tHome = {
    en: {
      servicesTitle: "Enterprise IT Services catalog",
      servicesDesc: "We design and optimize responsive solutions ensuring maximum speed scales.",
      exploreBtn: "Explore Services",
      featuredTitle: "Featured Digital Store Scripts",
      featuredDesc: "Malware checked standard PHP scripts and Elementor responsive themes.",
      reviewsTitle: "Trusted by Corporate Partners Globally",
      reviewsDesc: "We provide digital support solutions inside Saudi Arabia and Bangladesh.",
      whyTitle: "Why Tech-Leaders Choose WebzoneBD?",
      why1Title: "100% Secure Codes",
      why1Desc: "Protected against Cross-Site Form exploits and SQL injection.",
      why2Title: "cPanel Ready Setup",
      why2Desc: "Files downloaded include easy configurations text instructions.",
      why3Title: "24/7 Ticketing Live",
      why3Desc: "Open verified assistance threads from Riyadh to Dhaka core hubs.",
      quoteBtn: "Contact WhatsApp Live"
    },
    bn: {
      servicesTitle: "এন্টারপ্রাইজ আইটি সার্ভিস ক্যাটালগ",
      servicesDesc: "আমরা সর্বোচ্চ গতি এবং সঠিক স্কেল নিশ্চিত করে কাস্টম রেসপন্সিভ সলিউশন ডিজাইন ও অপ্টিমাইজ করি।",
      exploreBtn: "আইটি সার্ভিসেস",
      featuredTitle: "ডিজিটাল স্টোর ফিচার প্রোডাক্টস",
      featuredDesc: "আমাদের যাচাইকৃত পিএইচপি স্ক্রিপ্টস এবং দ্রুতগতির ব্লগার ও ওয়ার্ডপ্রেস ফাইলসমূহ।",
      reviewsTitle: "ক্লায়েন্টদের আমাদের সম্পর্কিত ইতিবাচক মতামত",
      reviewsDesc: "সৌদি আরব এবং বাংলাদেশের শত শত ব্যবসা ডিজিটাল উপায়ে এগিয়ে নেওয়ার গল্প।",
      whyTitle: "কেন সবাই ওয়েবজোনবিডি টিমের সেবা পছন্দ করেন?",
      why1Title: "১০০% হ্যাকিং সুরক্ষিত কোড",
      why1Desc: "প্রতিটি ফাইল কাস্টম স্যানিটাইজড যা এসকিউএল ইনজেকশন মুক্ত থাকে।",
      why2Title: "সিপ্যানেল হোস্ট রেডি",
      why2Desc: "সবগুলো জিপ ফাইলে সহজ ইন্সটলেশন গাইড দেওয়া রয়েছে।",
      why3Title: "২৪/৭ বিশেষ সাপোর্ট টিম",
      why3Desc: "টিকিট ড্যাশবোর্ডের মাধ্যমে রিয়েলটাইম সহায়তা প্রদান করি।"
    },
    ar: {
      servicesTitle: "مجموعة خدماتنا البرمجية المعتمدة",
      servicesDesc: "نصمم ونبني واجهات فائقة السرعة تضمن مضاعفة حضور شركتك.",
      exploreBtn: "استكشف الخدمات",
      featuredTitle: "منتجات المتجر الرقمي المميزة",
      featuredDesc: "سكربتات PHP وقوالب بلوجر وووردبريس نصوص نظيفة تماماً من الأكواد الخبيثة.",
      reviewsTitle: "رأي شركاء النجاح وأصحاب الأعمال",
      reviewsDesc: "ساعدنا مئات الشركات في بنجلاديش والشرق الأوسط على التحول الرقمي الفعال.",
      whyTitle: "لماذا يفضل المطورون ويب زون بي دي؟",
      why1Title: "أكواد حماية قصوى 100٪",
      why1Desc: "حواجز برمجية آمنة تمنع استغلال الثغرات البرمجية وحقن قواعد البيانات.",
      why2Title: "جاهز لتثبيت cPanel السريع",
      why2Desc: "جميع الملفات محملة بدليل شرح بسيط يضمن لك التركيب بدقائق.",
      why3Title: "تذاكر دعم نشطة على مدار الساعة",
      why3Desc: "افتح تذكرتك وتابع تقدمها مع كبار المطورين في السعودية ودكا."
    }
  }[language];

  // Auth session routing safeguard logic
  const handleAuthRedirect = (targetPage: string) => {
    if (!user) {
      triggerToast(language === 'bn' ? "ড্যাশবোর্ড ব্যবহারের জন্য দয়া করে লগইন করুন!" : "🔒 Access Restricted. Kindly authenticate your account session.");
      setAuthDefaultView('login');
      setIsAuthPopupOpen(true);
    } else {
      setCurrentPage(targetPage);
    }
  };

  // Fetch active page dynamic SEO configurations with safe defaults
  const activeMetadata = seoConfig[currentPage]?.[language] || seoConfig.home[language];

  return (
    <div 
      className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 font-sans transition-colors duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
      id="webzone-root-app"
    >
      {/* Dynamic SEO Meta title / description injection */}
      <Helmet 
        title={activeMetadata.title} 
        description={activeMetadata.description} 
        language={language}
      />

      {/* Dynamic Header with synced user status */}
      <Header
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={handleThemeToggle}
        cart={cart}
        removeFromCart={removeFromCart}
        applyCouponToCart={applyCouponToCart}
        removeCouponFromCart={removeCouponFromCart}
        resetCart={resetCart}
        addSimulatedOrder={addSimulatedOrder}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        currentPage={currentPage}
        setCurrentPage={(p) => {
          if (p === 'dashboard' || p === 'admin') {
            handleAuthRedirect(p);
          } else {
            setCurrentPage(p);
          }
        }}
        isAdmin={(user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'editor' || user?.role === 'staff') ? isAdmin : false}
        setIsAdmin={setIsAdmin}
        userEmail="info@webzonebd.com"
        user={user}
        onLogout={() => {
          addActivityLog("Terminated secure session successfully.");
          setUser(null);
          setIsAdmin(false);
          setCurrentPage('home');
          triggerToast(language === 'bn' ? "সফলভাবে লগআউট হয়েছেন!" : "Logged out from Secure Dashboard.");
        }}
        onLoginClick={(view) => {
          setAuthDefaultView(view || 'login');
          setIsAuthPopupOpen(true);
        }}
        onLoginSuccess={(signedInUser) => {
          setUser(signedInUser);
          syncRegisteredUserToAdmin(signedInUser);
          const isStaffRole = signedInUser.role === 'admin' || signedInUser.role === 'super_admin' || signedInUser.role === 'editor' || signedInUser.role === 'staff';
          setIsAdmin(isStaffRole);
          addActivityLog(`Authorized Session tokens for user role: ${signedInUser.role.toUpperCase()}`);
          if (isStaffRole) {
            setCurrentPage('admin');
          } else {
            setCurrentPage('dashboard');
          }
        }}
        currency={currency}
        setCurrency={setCurrency}
        setSearchTerm={setSearchTerm}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        addToCart={addToCart}
        currencySettings={currencySettings}
        setCurrencySettings={setCurrencySettings}
        triggerToast={triggerToast}
        currencyRates={currencyRates}
        verificationSettings={verificationSettings}
        bdMethods={bdMethods}
        saMethods={saMethods}
        intlMethods={intlMethods}
        customMethods={customMethods}
      />

      {/* Dynamic Global Broadcast Notification Banner Alert */}
      <AnimatePresence>
        {siteWideBroadcast && isBroadcastActive && !broadcastDismissed && (() => {
          const getSeverityDetails = (sev: 'info' | 'urgent' | 'offer') => {
            switch (sev) {
              case 'urgent':
                return {
                  bg: 'bg-gradient-to-r from-red-700 via-rose-850 to-orange-600',
                  border: 'border-red-500/30',
                  icon: <AlertTriangle className="w-3.5 h-3.5 text-white" />,
                  badgeText: '⚠️ URGENT ALERT'
                };
              case 'offer':
                return {
                  bg: 'bg-gradient-to-r from-purple-700 via-indigo-850 to-blue-600',
                  border: 'border-purple-500/30',
                  icon: <Gift className="w-3.5 h-3.5 text-white" />,
                  badgeText: '🎁 PROMO / OFFER'
                };
              case 'info':
              default:
                return {
                  bg: 'bg-gradient-to-r from-blue-700 via-indigo-850 to-sky-650',
                  border: 'border-blue-500/30',
                  icon: <Info className="w-3.5 h-3.5 text-white" />,
                  badgeText: 'ℹ️ BROADCAST'
                };
            }
          };

          const sevDetails = getSeverityDetails(siteWideBroadcastSeverity);

          return (
            <motion.div
              initial={{ opacity: 0, y: -40, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -40, height: 0, transition: { duration: 0.25, ease: 'easeInOut' } }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`${sevDetails.bg} text-white text-xs py-2 px-3 sm:px-4 shadow-lg border-b ${sevDetails.border} relative z-30 overflow-hidden`}
              id="global-broadcast-banner"
            >
              <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
                {/* Banner Left Section (Bell Icon, Text Message, Timer Indicator) */}
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 w-full sm:w-auto">
                  <motion.span
                    animate={{
                      scale: [1, 1.14, 1],
                      boxShadow: [
                        "0 0 0 0px rgba(255, 255, 255, 0.2)",
                        "0 0 0 6px rgba(255, 255, 255, 0)",
                        "0 0 0 0px rgba(255, 255, 255, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="flex-shrink-0 bg-white/20 text-white rounded-full p-1 flex items-center justify-center shadow-inner"
                  >
                    {sevDetails.icon}
                  </motion.span>
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 min-w-0 flex-1">
                    <span className="hidden sm:inline-block font-black text-[9px] uppercase font-mono tracking-widest bg-yellow-400 text-neutral-900 px-1.5 py-0.5 rounded shadow shrink-0">
                      System Broadcast
                    </span>
                    
                    {/* Expandable/truncatable text wrapper */}
                    <div 
                      onClick={() => setIsBroadcastExpanded(!isBroadcastExpanded)}
                      className="flex-1 min-w-0 cursor-pointer sm:cursor-default group flex items-center gap-1.5"
                      title="Tap to expand/collapse message on mobile"
                    >
                      <p className={`font-semibold tracking-tight text-[11px] sm:text-xs text-neutral-100 leading-tight transition-all duration-300 break-words ${isBroadcastExpanded ? '' : 'line-clamp-1 sm:line-clamp-none'}`}>
                        {siteWideBroadcast}
                      </p>
                      
                      {/* Mobile Expand / Collapse badge */}
                      <span className="sm:hidden inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-white/15 hover:bg-white/25 text-[8.5px] font-black uppercase tracking-wider text-yellow-350 transition shrink-0 select-none border border-white/5 active:scale-95">
                        {isBroadcastExpanded ? "COLLAPSE" : "MORE"}
                        {isBroadcastExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                      </span>
                    </div>
                    
                    {broadcastTimeLeft > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/45 border border-white/10 font-mono text-yellow-350 font-black text-[9px] uppercase tracking-wider shadow-inner shrink-0 leading-none">
                        <Clock className="w-2.5 h-2.5 text-yellow-450 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Ends in: {formatCountdown(broadcastTimeLeft)}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Banner Right Section (Buttons) */}
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t border-white/10 sm:border-0">
                  {/* Mobile mode left-aligned timeline */}
                  {broadcastTimeLeft > 0 && (
                    <span className="inline-flex sm:hidden items-center gap-1 px-1.5 py-0.5 rounded bg-black/45 border border-white/15 font-mono text-yellow-350 font-black text-[9px] uppercase tracking-wider shadow-inner shrink-0 leading-none">
                      <Clock className="w-2.5 h-2.5 text-yellow-450 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>Ends in: {formatCountdown(broadcastTimeLeft)}</span>
                    </span>
                  )}

                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    {siteWideBroadcastLink && (
                      <a
                        href={siteWideBroadcastLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-950 rounded-md text-[10px] font-black cursor-pointer transition flex items-center gap-1 hover:scale-[1.02] active:scale-95 shadow-sm shadow-black/20 shrink-0 leading-none"
                        title="Claim site-wide offer"
                      >
                        🎁 {siteWideBroadcastLinkText || 'Claim Offer'}
                      </a>
                    )}
                    
                    <button
                      onClick={() => setBroadcastDismissed(true)}
                      className="px-2 py-1 bg-white/10 hover:bg-white/20 hover:text-white rounded-md text-[10px] font-medium cursor-pointer transition border border-white/10 shrink-0 leading-none"
                      title="Close System Broadcast Alert"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Main Core Router Panels */}
      <main className="flex-1 pb-32 md:pb-0">
        <Suspense fallback={
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-zinc-500 dark:text-zinc-400 font-sans">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-cyan-400 mb-4 animate-pulse"></div>
            <p className="text-sm font-medium">Loading panel...</p>
          </div>
        }>
        {currentPage === 'home' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Embedded Hero & Domain Search group without space-y-5 gap */}
            <div className="flex flex-col">
              <Hero
                language={language}
                theme={theme}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                triggerToast={triggerToast}
              />

              {/* Premium Domain Registration Search section */}
              <DomainSearch
                language={language}
                theme={theme}
                currency={currency}
                addToCart={addToCart}
                setCurrentPage={setCurrentPage}
                currencySettings={currencySettings}
              />
            </div>

            {/* Services highlights preview */}
            <ScrollReveal className="w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
                {/* Embed services */}
                <Services
                  user={user}
                  language={language}
                  theme={theme}
                  addSimulatedServiceOrder={addSimulatedServiceOrder}
                  triggerToast={triggerToast}
                  setCurrentPage={setCurrentPage}
                  currency={currency}
                  currencySettings={currencySettings}
                  isHomePage={true}
                  addToCart={addToCart}
                  setCartOpen={setCartOpen}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                />
              </div>
            </ScrollReveal>

            {/* Featured marketplace items - Reveal on scroll */}
            <ScrollReveal className="w-full">
              <div className="bg-neutral-100 dark:bg-neutral-900/10 border-y border-neutral-200/50 dark:border-neutral-900 pt-5 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="text-blue-600 dark:text-cyan-400 w-5 h-5" />
                        <span>{tHome.featuredTitle}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450">{tHome.featuredDesc}</p>
                    </div>

                    <button
                      onClick={() => setCurrentPage('marketplace')}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] text-xs font-black rounded-xl transition flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
                    >
                      <span>{language === 'bn' ? "সকল স্ক্রিপ্ট দেখুন" : language === 'ar' ? "تصفح البرامج" : "Browse All Store"}</span>
                      <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Embed Marketplace with blank search */}
                  <Marketplace
                    language={language}
                    theme={theme}
                    addToCart={addToCart}
                    setCartOpen={setCartOpen}
                    searchTerm=""
                    currency={currency}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    currencySettings={currencySettings}
                    triggerToast={triggerToast}
                    user={user}
                    isAdmin={isAdmin}
                    onOpenLogin={() => setIsAuthPopupOpen(true)}
                    onUpdateProduct={handleUpdateProduct}
                  />
                </div>
              </div>
            </ScrollReveal>


            {/* Client feedback testimonials list preview - Reveal on scroll */}
            <ScrollReveal className="w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-neutral-200/50 dark:border-neutral-900/60" id="agency-testimonials">
                <div className="text-center space-y-2 mb-10">
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">{tHome.reviewsTitle}</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{tHome.reviewsDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clientTestimonials.map((item, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800 rounded-3xl flex flex-col justify-between hover:scale-101 transition duration-200">
                      <p className="text-xs sm:text-sm italic text-neutral-600 dark:text-neutral-300 leading-relaxed font-serif mb-4">
                        "{language === 'bn' ? item.textBn : language === 'ar' ? item.textAr : item.text}"
                      </p>

                      <div className="flex items-center gap-3">
                        <img src={item.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                        <div className="text-left">
                          <p className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">{item.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">{item.role}</p>
                        </div>

                        <div className="ml-auto flex text-amber-500 gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                          <Star className="w-3.5 h-3.5 fill-amber-505 stroke-amber-500" />
                          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {currentPage === 'solutions' && (
          <div className="animate-in fade-in duration-200">
            <Solutions
              language={language}
              theme={theme}
              addSimulatedServiceOrder={addSimulatedServiceOrder}
              triggerToast={triggerToast}
            />
          </div>
        )}

        {currentPage === 'services' && (
          <div className="animate-in fade-in duration-200">
            <Services
              user={user}
              language={language}
              theme={theme}
              addSimulatedServiceOrder={addSimulatedServiceOrder}
              triggerToast={triggerToast}
              setCurrentPage={setCurrentPage}
              currency={currency}
              currencySettings={currencySettings}
              addToCart={addToCart}
              setCartOpen={setCartOpen}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          </div>
        )}

        {currentPage === 'marketplace' && (
          <div className="animate-in fade-in duration-200">
            <Marketplace
              language={language}
              theme={theme}
              addToCart={addToCart}
              setCartOpen={setCartOpen}
              searchTerm={searchTerm}
              currency={currency}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              currencySettings={currencySettings}
              isAdmin={isAdmin}
              user={user}
              triggerToast={triggerToast}
              onOpenLogin={() => setIsAuthPopupOpen(true)}
              onUpdateProduct={handleUpdateProduct}
              onViewProduct={(product) => {
                setSelectedProduct(product);
                setCurrentPage('product-details');
              }}
            />
          </div>
        )}

        {currentPage === 'product-details' && selectedProduct && (
          <div className="animate-in fade-in duration-200">
            <ProductDetails
              product={selectedProduct}
              products={products}
              language={language}
              theme={theme}
              currency={currency}
              setCurrency={setCurrency}
              addToCart={addToCart}
              setCartOpen={setCartOpen}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              triggerToast={triggerToast}
              onBack={() => {
                setCurrentPage('marketplace');
                setSelectedProduct(null);
              }}
              onOpenLogin={() => setIsAuthPopupOpen(true)}
              user={user}
              orders={orders}
              setOrders={setOrders}
              currencyRates={currencyRates}
              onViewProduct={(prod) => {
                setSelectedProduct(prod);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentPage === 'portfolio' && (
          <div className="animate-in fade-in duration-200">
            <Portfolio
              language={language}
              theme={theme}
            />
          </div>
        )}

        {currentPage === 'blog' && (
          <div className="animate-in fade-in duration-200">
            <Blog
              language={language}
              theme={theme}
              posts={posts}
              setPosts={setPosts}
              user={user}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              onLoginClick={(view) => {
                setAuthDefaultView(view || 'login');
                setIsAuthPopupOpen(true);
              }}
            />
          </div>
        )}

        {currentPage === 'faq' && (
          <div className="animate-in fade-in duration-150">
            <FAQ
              language={language}
              theme={theme}
            />
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="animate-in fade-in duration-200">
            <Contact
              language={language}
              theme={theme}
              triggerToast={triggerToast}
            />
          </div>
        )}

        {currentPage === 'hosting' && (
          <div className="animate-in fade-in duration-200">
            <Hosting
              language={language}
              theme={theme}
              currency={currency}
              currencySettings={currencySettings}
              addToCart={addToCart}
              addServiceOrder={addSimulatedServiceOrder}
              user={user}
              triggerToast={triggerToast}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}

        {currentPage === 'domain' && (
          <div className="animate-in fade-in duration-200">
            <DomainPage
              language={language}
              theme={theme}
              currency={currency}
              currencySettings={currencySettings}
              addToCart={addToCart}
              setCurrentPage={setCurrentPage}
              triggerToast={triggerToast}
              user={user}
              setUser={setUser}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
            />
          </div>
        )}

        {currentPage === 'privacy' && (
          <div className="animate-in fade-in duration-150">
            <PrivacyTerms
              language={language}
              theme={theme}
            />
          </div>
        )}

        {currentPage === 'refund' && (
          <div className="animate-in fade-in duration-200">
            <RefundPolicy
              language={language}
              theme={theme}
              setCurrentPage={setCurrentPage}
              triggerToast={triggerToast}
            />
          </div>
        )}

        {currentPage === 'offers' && (
          <div className="animate-in fade-in duration-200">
            <OffersPage
              language={language}
              theme={theme}
              currency={currency}
              currencySettings={currencySettings}
              triggerToast={triggerToast}
              addToCart={addToCart}
              setCartOpen={setCartOpen}
            />
          </div>
        )}

        {currentPage === 'affiliate' && (
          <div className="animate-in fade-in duration-200">
            <AffiliateSystem
              language={language}
              theme={theme}
              user={user}
              onLoginClick={(view) => {
                setAuthDefaultView(view || 'register');
                setIsAuthPopupOpen(true);
              }}
              triggerToast={triggerToast}
            />
          </div>
        )}

        {/* Brand new integrated SaaS authentication portal */}
        {currentPage === 'auth' && (
          <div className="animate-in fade-in duration-200">
            <AuthSystem
              language={language}
              theme={theme}
              defaultView={authDefaultView}
              onLoginSuccess={(signedInUser) => {
                setUser(signedInUser);
                syncRegisteredUserToAdmin(signedInUser);
                const isStaffRole = signedInUser.role === 'admin' || signedInUser.role === 'super_admin' || signedInUser.role === 'editor' || signedInUser.role === 'staff';
                setIsAdmin(isStaffRole);
                addActivityLog(`Authorized Session tokens for user role: ${signedInUser.role.toUpperCase()}`);
                
                // Redirect user based on role characteristics
                if (isStaffRole) {
                  setCurrentPage('admin');
                } else {
                  setCurrentPage('dashboard');
                }
              }}
              triggerToast={triggerToast}
              onBackToHome={() => setCurrentPage('home')}
            />
          </div>
        )}

        {currentPage === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            {user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor' || user.role === 'staff') ? (
              <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8 animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                    {language === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট রেস্ট্রিকশন' : 'Administrator Zone Guard'}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                    {language === 'bn' 
                      ? 'অ্যাডমিন এবং স্টাফ অ্যাকাউন্টের জন্য সাধারণ কাস্টমার ড্যাশবোর্ড দেখা অনুমোদিত নয়। অনুগ্রহ করে অ্যাডমিন প্যানেল ব্যবহার করুন।' 
                      : 'The standard Customer Dashboard is restricted for Administrators, Editors, and Staff members. Please access the central Admin Control Panel to manage databases and layouts.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-650 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {language === 'bn' ? '⚙️ অ্যাডমিন কন্ট্রোল প্যানেল' : '⚙️ Secure Admin Control Panel'}
                  </button>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="px-5 py-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold rounded-xl transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {language === 'bn' ? '🏠 প্রধান পেজ' : '🏠 Back to Home'}
                  </button>
                </div>
              </div>
            ) : (
              <Dashboard
                language={language}
                theme={theme}
                user={user}
                onLogout={() => {
                  addActivityLog("Terminated secure session.");
                  setUser(null);
                  setIsAdmin(false);
                  setCurrentPage('home');
                }}
                onNavigate={(page) => setCurrentPage(page)}
                orders={
                  (user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'vendor' || user?.role === 'editor')
                    ? orders
                    : orders.filter((o) => {
                        return (
                          (user?.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
                          (user?.phone && o.customerPhone === user.phone) ||
                          (user?.name && o.customerName === user.name)
                        );
                      })
                }
                tickets={
                  (user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'vendor' || user?.role === 'editor')
                    ? tickets
                    : tickets.filter((t) => t.userId === user?.id)
                }
                addSupportTicket={addSupportTicket}
                addTicketReply={addTicketReply}
                triggerToast={triggerToast}
                currency={currency}
                setCurrency={setCurrency}
                onUpdateUser={(updated) => {
                  setUser(updated);
                }}
                activityLogs={activityLogs}
                onAddActivityLog={addActivityLog}
                products={products}
                onAddProduct={addNewProduct}
                onUpdateProductRating={updateProductRating}
                currencySettings={currencySettings}
                setLanguage={setLanguage}
                setTheme={handleThemeToggle}
                onUpdateOrders={(newOrders) => setOrders(newOrders)}
                deleteOrder={deleteOrder}
              />
            )}
          </div>
        )}

        {currentPage === 'admin' && (
          <div className="animate-in fade-in duration-200">
            {(user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'editor') ? (
              <Suspense fallback={
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-zinc-500 font-sans">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                  <p className="text-sm font-medium">Loading Admin Panel...</p>
                </div>
              }>
                <AdminPanel
                  language={language}
                  setLanguage={setLanguage}
                  theme={theme}
                  products={products}
                  orders={orders}
                  tickets={tickets}
                  systemConfig={systemConfig}
                  coupons={coupons}
                  addNewProduct={addNewProduct}
                  deleteProduct={deleteProduct}
                  updateOrderStatus={updateOrderStatus}
                  updateOrderDetails={updateOrderDetails}
                  deleteOrder={deleteOrder}
                  addTicketReply={addTicketReply}
                  addNewCoupon={addNewCoupon}
                  updateCoupon={updateCoupon}
                  deleteCoupon={deleteCoupon}
                  updateSystemConfig={setSystemConfig}
                  triggerToast={triggerToast}
                  currency={currency}
                  setCurrency={setCurrency}
                  currencySettings={currencySettings}
                  setCurrencySettings={setCurrencySettings}
                  posts={posts}
                  setPosts={setPosts}
                  activityLogs={activityLogs}
                  onAddActivityLog={addActivityLog}
                  user={user}
                  setUser={setUser}
                  siteWideBroadcast={siteWideBroadcast}
                  onBroadcastChange={(val, link, linkText, expiresAt, severity, startAt) => {
                    setSiteWideBroadcast(val);
                    if (val) {
                      localStorage.setItem('site_wide_broadcast_notification', val);
                      if (link) {
                        setSiteWideBroadcastLink(link);
                        localStorage.setItem('site_wide_broadcast_link', link);
                      } else {
                        setSiteWideBroadcastLink(null);
                        localStorage.removeItem('site_wide_broadcast_link');
                      }
                      if (linkText) {
                        setSiteWideBroadcastLinkText(linkText);
                        localStorage.setItem('site_wide_broadcast_link_text', linkText);
                      } else {
                        setSiteWideBroadcastLinkText('Claim Offer');
                        localStorage.setItem('site_wide_broadcast_link_text', 'Claim Offer');
                      }
                      if (expiresAt) {
                        setSiteWideBroadcastExpiresAt(expiresAt);
                        localStorage.setItem('site_wide_broadcast_expires_at', String(expiresAt));
                      } else {
                        setSiteWideBroadcastExpiresAt(null);
                        localStorage.removeItem('site_wide_broadcast_expires_at');
                      }
                      if (startAt) {
                        setSiteWideBroadcastStartAt(startAt);
                        localStorage.setItem('site_wide_broadcast_start_at', String(startAt));
                      } else {
                        setSiteWideBroadcastStartAt(null);
                        localStorage.removeItem('site_wide_broadcast_start_at');
                      }
                      const sev = severity || 'info';
                      setSiteWideBroadcastSeverity(sev as any);
                      localStorage.setItem('site_wide_broadcast_severity', sev);
                    } else {
                      localStorage.removeItem('site_wide_broadcast_notification');
                      localStorage.removeItem('site_wide_broadcast_link');
                      localStorage.removeItem('site_wide_broadcast_link_text');
                      localStorage.removeItem('site_wide_broadcast_id');
                      localStorage.removeItem('site_wide_broadcast_expires_at');
                      localStorage.removeItem('site_wide_broadcast_start_at');
                      localStorage.removeItem('site_wide_broadcast_duration');
                      localStorage.removeItem('site_wide_broadcast_severity');
                      setSiteWideBroadcastLink(null);
                      setSiteWideBroadcastLinkText(null);
                      setSiteWideBroadcastExpiresAt(null);
                      setSiteWideBroadcastStartAt(null);
                      setSiteWideBroadcastSeverity('info');
                    }
                  }}
                  setTheme={handleThemeToggle}
                  onLogout={() => {
                    addActivityLog("Terminated secure session successfully.");
                    setUser(null);
                    setIsAdmin(false);
                    setCurrentPage('home');
                    triggerToast(language === 'bn' ? "সফলভাবে লগআউট হয়েছেন!" : "Logged out from Secure Dashboard.");
                  }}
                  currencyRates={currencyRates}
                  setCurrencyRates={setCurrencyRates}
                  verificationSettings={verificationSettings}
                  setVerificationSettings={setVerificationSettings}
                  paymentNotifs={paymentNotifs}
                  setPaymentNotifs={setPaymentNotifs}
                  bdMethods={bdMethods}
                  setBdMethods={setBdMethods}
                  saMethods={saMethods}
                  setSaMethods={setSaMethods}
                  intlMethods={intlMethods}
                  setIntlMethods={setIntlMethods}
                  customMethods={customMethods}
                  setCustomMethods={setCustomMethods}
                />
              </Suspense>
            ) : (
              <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-left" id="wp-style-admin-login-node">
                {/* Logo and Brand Heading */}
                <motion.div 
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mb-6 text-center"
                >
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="inline-flex items-center gap-2 text-2xl font-black text-neutral-900 dark:text-white group/wlogo"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold font-serif shadow-lg border-2 border-neutral-200 dark:border-neutral-800 group-hover/wlogo:scale-105 transition-transform duration-200">
                      W
                    </div>
                  </button>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-widest mt-2 uppercase">Website Control Panel Gateway</p>
                </motion.div>

                {/* WordPress Style Login Container with elegant staggered upward entrance animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[350px] space-y-4"
                >
                  {/* WordPress-style Error Box */}
                  {adminLoginError && (
                    <div className="bg-white dark:bg-neutral-900 border-l-[4px] border-amber-500 p-4 shadow-sm text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed rounded-r animate-in fade-in slide-in-from-top-1">
                      <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider block mb-0.5">ERROR</span>
                      {adminLoginError}
                    </div>
                  )}

                  {/* The Login Card with premium glowing shadow structures */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 rounded shadow-[0_0_15px_rgba(34,113,177,0.08)] hover:shadow-[0_0_25px_rgba(34,113,177,0.18)] transition-all duration-500 transform-gpu relative overflow-hidden ring-1 ring-blue-500/5 text-left space-y-4 font-sans">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!adminLoginEmail) {
                          setAdminLoginError("The email address field is empty.");
                          return;
                        }
                        if (!adminLoginPass) {
                          setAdminLoginError("The password field is empty.");
                          return;
                        }
                        
                        setAdminLoginLoading(true);
                        setAdminLoginError('');
                        
                        setTimeout(() => {
                          setAdminLoginLoading(false);
                          
                          let matchedStaff: any = null;
                          if (adminLoginEmail === 'admin@webzonebd.com' && adminLoginPass === 'admin123') {
                            matchedStaff = {
                              userId: 'usr-admin',
                              name: 'Super Admin Manager',
                              role: 'Super Admin',
                              department: 'Administration',
                              email: 'admin@webzonebd.com',
                              status: 'active'
                            };
                          } else {
                            try {
                              const savedStaff = localStorage.getItem('webzone_admin_staff');
                              if (savedStaff) {
                                const staffList = JSON.parse(savedStaff);
                                const found = staffList.find((s: any) => s.email === adminLoginEmail && s.password === adminLoginPass);
                                if (found) {
                                  matchedStaff = found;
                                }
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }

                          if (matchedStaff) {
                            if (matchedStaff.status === 'suspended') {
                              setAdminLoginError("Your staff account is currently suspended. Please contact system administrator.");
                              return;
                            }
                            
                            const adminUserSession: UserSession = {
                              id: matchedStaff.userId || 'usr-admin',
                              name: matchedStaff.name,
                              username: matchedStaff.email.split('@')[0],
                              email: matchedStaff.email,
                              phone: matchedStaff.phone || '+8801799887766',
                              role: (matchedStaff.role === 'Super Admin' || matchedStaff.role === 'super_admin') ? 'super_admin' : ((matchedStaff.role === 'Editor' || matchedStaff.role === 'editor') ? 'editor' : 'admin'),
                              isVerified: true,
                              createdAt: '2026-06-01',
                              status: matchedStaff.status || 'active',
                              wishlistedProductIds: []
                            };

                            // Active Admin Remember Me handling
                            if (adminRemember) {
                              try {
                                localStorage.setItem('webzone_admin_remember_login', JSON.stringify({
                                  email: adminLoginEmail.trim(),
                                  remember: true,
                                  timestamp: Date.now()
                                }));
                              } catch (e) {}
                            } else {
                              try {
                                localStorage.removeItem('webzone_admin_remember_login');
                              } catch (e) {}
                            }

                            setUser(adminUserSession);
                            setIsAdmin(true);
                            triggerToast(`Welcome back, ${matchedStaff.name}! Authorized staff session.`);
                          } else {
                            setAdminLoginError(`The credentials you entered are incorrect. Use default admin@webzonebd.com / admin123 or registered staff email.`);
                          }
                        }, 700);
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Username or Email Address</label>
                          {adminLoginEmail.length > 0 && (
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminLoginEmail) ? (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-sans">✓ valid format</span>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold font-sans">✗ incorrect format</span>
                            )
                          )}
                        </div>
                        <input
                          type="text"
                          value={adminLoginEmail}
                          onChange={(e) => setAdminLoginEmail(e.target.value)}
                          className={`w-full bg-white dark:bg-neutral-950 border p-2 text-sm text-neutral-900 dark:text-white rounded focus:ring-1 focus:outline-none transition-all duration-200 ${
                            adminLoginEmail.length === 0 ? 'border-neutral-350 dark:border-neutral-800 focus:border-blue-500 focus:ring-blue-500' :
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminLoginEmail) ? 'border-emerald-500/40 dark:border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500' : 'border-rose-500/50 dark:border-rose-550/40 focus:border-rose-500 focus:ring-rose-500'
                          }`}
                          placeholder="admin@webzonebd.com"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Password</label>
                        <input
                          type="password"
                          value={adminLoginPass}
                          onChange={(e) => setAdminLoginPass(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-350 dark:border-neutral-800 p-2 text-sm text-neutral-900 dark:text-white rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={adminRemember}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setAdminRemember(val);
                              if (!val) {
                                try {
                                  localStorage.removeItem('webzone_admin_remember_login');
                                } catch (err) {}
                              }
                            }}
                            className="rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            {language === 'bn' ? 'রিমেম্বার মি' : 'Remember Me'}
                          </span>
                        </label>
                        
                        <button
                          type="submit"
                          disabled={adminLoginLoading || (adminLoginEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminLoginEmail))}
                          className="inline-flex items-center justify-center gap-1 bg-[#2271b1] hover:bg-[#135e96] border border-[#2271b1] hover:border-[#135e96] text-white text-xs font-extrabold py-2 px-4 rounded cursor-pointer transition shadow active:scale-95 text-center font-sans tracking-wide font-mono uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {adminLoginLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : 'Log In'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Auxiliary Links */}
                  <div className="flex justify-between items-center px-1 text-xs font-medium font-sans">
                    <button 
                      onClick={() => {
                        setForgotEmail(adminLoginEmail);
                        setForgotSuccessMessage('');
                        setShowForgotModal(true);
                      }}
                      className="text-neutral-400 hover:text-blue-650 dark:hover:text-blue-450 transition font-sans hover:underline"
                    >
                      Lost your password?
                    </button>
                    <button 
                      onClick={() => setCurrentPage('home')}
                      className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      ← Go to WebzoneBD
                    </button>
                  </div>
                </motion.div>

                {/* Simulated Recovery Password Modal */}
                {showForgotModal && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4 text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <h4 className="font-extrabold text-xs text-neutral-950 dark:text-white uppercase font-mono tracking-wider">
                          Lost Password Recovery
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(false)}
                          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition text-lg font-black"
                        >
                          ×
                        </button>
                      </div>

                      {forgotSuccessMessage ? (
                        <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl">
                            ✓
                          </div>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                            {forgotSuccessMessage}
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowForgotModal(false)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-750 text-white text-xs font-black uppercase font-mono rounded cursor-pointer transition-all duration-200"
                          >
                            Return to Gatekeeper
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 font-sans">
                          <p className="text-[11px] text-neutral-500 leading-relaxed">
                            Enter your registered staff email handle. We will simulate checking our secure credentials registry and generate an automated password reset dispatch simulation instantly.
                          </p>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-neutral-400 block">Recovery Email Address</label>
                            <input
                              type="email"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              placeholder="staff@webzonebd.com"
                              className="w-full bg-slate-50 dark:bg-neutral-950 border border-neutral-350 dark:border-neutral-850 p-2 text-xs text-neutral-900 dark:text-white rounded focus:border-blue-500 outline-none"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={forgotLoading || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)}
                            onClick={() => {
                              setForgotLoading(true);
                              setTimeout(() => {
                                setForgotLoading(false);
                                setForgotSuccessMessage(`🔑 A password reset simulation dispatch has been sent to ${forgotEmail}. The message includes a token bypass link to safely redefine terminal credentials.`);
                                addActivityLog(`Dispatched automated staff password recovery simulation token to: ${forgotEmail}`);
                                triggerToast("Recovery simulation links routed successfully! ✉️");
                              }, 1250);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-750 text-white text-xs font-black uppercase font-mono rounded cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {forgotLoading ? (
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : "Simulate Password Reset"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </Suspense>
      </main>

      {/* Floating Action Live Support Widget (WhatsApp & Telegram Support) */}
      {!(user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor')) && !isAdmin && (
        <LiveChatWidget language={language} currentPage={currentPage} />
      )}

      {/* Floating 'Scroll to Top' button */}
      <ScrollToTop currentPage={currentPage} />

      {/* Premium Telegram-style Bottom Navigation menu */}
      <BottomNavigation
        language={language}
        currentPage={currentPage}
        cartOpen={cartOpen}
        cartCount={cart.length}
        onNavigate={(p) => {
          if (p === 'dashboard' || p === 'admin') {
            handleAuthRedirect(p);
          } else if (p === 'cart') {
            setCartOpen(true);
          } else {
            setCurrentPage(p);
          }
        }}
        onLoginClick={(view) => {
          setAuthDefaultView(view || 'login');
          setIsAuthPopupOpen(true);
        }}
        user={user}
        triggerToast={triggerToast}
      />

      {/* Dynamic Toast Alerts banner */}
      <Notification
        message={toastMessage}
        onClear={() => setToastMessage(null)}
      />

      {/* Dynamic Footer widget */}
      <Footer
        language={language}
        theme={theme}
        setCurrentPage={setCurrentPage}
        triggerToast={triggerToast}
        user={user}
        setUser={setUser}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Modern Authentication Glassmorphic Modal System */}
      <Suspense fallback={null}>
        <AuthPopup
          isOpen={isAuthPopupOpen}
          onClose={() => setIsAuthPopupOpen(false)}
          language={language}
          theme={theme}
          user={user}
          defaultView={authDefaultView}
          onNavigate={(page) => setCurrentPage(page)}
          onLoginSuccess={(signedInUser) => {
            setUser(signedInUser);
            syncRegisteredUserToAdmin(signedInUser);
            const isStaffRole = signedInUser.role === 'admin' || signedInUser.role === 'super_admin' || signedInUser.role === 'editor' || signedInUser.role === 'staff';
            setIsAdmin(isStaffRole);
            addActivityLog(`Authorized Session tokens for user role: ${signedInUser.role.toUpperCase()}`);
            
            // Switch global active currency to match user preference or phone country code
            let targetCurr: 'USD' | 'BDT' | 'SAR' = 'USD';
            if (signedInUser.preferredCurrency) {
              targetCurr = signedInUser.preferredCurrency;
            } else if (signedInUser.phone) {
              const p = signedInUser.phone;
              if (p.startsWith('+880') || p.startsWith('880')) {
                targetCurr = 'BDT';
              } else if (p.startsWith('+966') || p.startsWith('966')) {
                targetCurr = 'SAR';
              }
            }
            setCurrency(targetCurr);
            localStorage.setItem('webzone_active_currency', targetCurr);

            if (isStaffRole) {
              setCurrentPage('admin');
            } else {
              setCurrentPage('dashboard');
            }
          }}
          triggerToast={triggerToast}
        />
      </Suspense>

      {/* Persistent Smart Promotional & Newsletter Offer System (Pop-ups + Notification panels) */}
      <PromotionalOfferSystem
        language={language}
        triggerToast={triggerToast}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin || !!(user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor' || user.role === 'staff'))}
      />

      {/* MacBook Genie Motion Fly-to-Cart Animation Overlay */}
      <MacBookCartGenieAnimation
        flyingItems={flyingItems}
        onItemComplete={(id) => setFlyingItems(prev => prev.filter(fi => fi.id !== id))}
        language={language}
        currency={currency}
      />
    </div>
  );
}
