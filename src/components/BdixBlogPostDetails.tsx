import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server, Cpu, Zap, Shield, Clock, Star, Check, X, Layers, Globe,
  Sparkles, TrendingUp, Smartphone, Users, ChevronDown, ChevronUp, ChevronRight,
  PhoneCall, ArrowRight, Menu, Moon, Sun, ArrowLeft, Bookmark, Share2,
  ExternalLink, Code, CheckSquare, RefreshCw, Send, CheckCircle2,
  Facebook, Linkedin, Twitter, MessageCircle, Copy
} from 'lucide-react';
import { LocalBlogPost } from './BlogData';
import { Language, Theme } from '../types';

interface BdixBlogPostDetailsProps {
  post: LocalBlogPost;
  language: Language;
  theme: Theme;
  onBack: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: (postId: string) => void;
  onLikeToggle: (postId: string) => void;
  relatedPosts?: LocalBlogPost[];
  onSelectRelated?: (post: LocalBlogPost) => void;
}

export default function BdixBlogPostDetails({
  post,
  language,
  theme: appTheme,
  onBack,
  isBookmarked,
  onBookmarkToggle,
  onLikeToggle,
  relatedPosts = [],
  onSelectRelated
}: BdixBlogPostDetailsProps) {
  // Local independent state for robust interactive experience
  const [isDarkMode, setIsDarkMode] = useState(appTheme === 'dark');
  const [billingPeriod, setBillingPeriod] = useState<'yearly' | '24months'>('24months');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [pingTestStatus, setPingTestStatus] = useState<'idle' | 'testing' | 'completed'>('idle');
  const [pingResults, setPingResults] = useState<{ isp: string; local: number; global: number }[]>([]);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Local state for translation to match whatever language user picks (or toggles)
  const [currentLang, setCurrentLang] = useState<Language>(language);

  // Sync with global theme
  useEffect(() => {
    setIsDarkMode(appTheme === 'dark');
  }, [appTheme]);

  // Sync with global language selection
  useEffect(() => {
    setCurrentLang(language);
  }, [language]);

  // Reading Progress scroll listener over the exact article body content limits
  const articleRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const headerHeight = 64; // Under the main website layout header
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Distance scrolled within the element bounds relative to sticky offset
      const scrolled = -(rect.top - headerHeight);
      const totalScrollable = elementHeight - (viewportHeight - headerHeight);

      if (totalScrollable > 0) {
        const percentage = (scrolled / totalScrollable) * 100;
        setScrollProgress(Math.min(100, Math.max(0, percentage)));
      } else {
        setScrollProgress(rect.top < headerHeight ? 100 : 0);
      }

      // Sync active outline sections on scroll passing the viewport sticky boundary
      const sections = [
        { id: "intro" },
        { id: "what-is-bdix" },
        { id: "advantages" },
        { id: "packages" },
        { id: "who-needs-it" },
        { id: "comparison" },
        { id: "faq" }
      ];
      for (const sect of sections) {
        const sectionEl = document.getElementById(sect.id);
        if (sectionEl) {
          const sectionRect = sectionEl.getBoundingClientRect();
          if (sectionRect.top >= headerHeight && sectionRect.top <= headerHeight + 150) {
            setActiveSection(sect.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Ping Testing Simulator
  const runPingTest = () => {
    setPingTestStatus('testing');
    const isps = [
      { isp: 'Link3 Technologies', local: 2, global: 148 },
      { isp: 'Dot Internet', local: 1, global: 152 },
      { isp: 'AmberIT', local: 3, global: 165 },
      { isp: 'Grameenphone Fiber', local: 4, global: 142 },
      { isp: 'Robi Axiata LTE', local: 8, global: 159 },
      { isp: 'Amber IT Corp', local: 3, global: 161 }
    ];
    setPingResults([]);
    
    // Stagger results loading for high fidelity feel
    isps.forEach((item, index) => {
      setTimeout(() => {
        setPingResults(prev => [...prev, item]);
        if (index === isps.length - 1) {
          setPingTestStatus('completed');
        }
      }, (index + 1) * 600);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Translations dictionary specifically for BD IX Hosting
  const t = {
    en: {
      tag: "Premium Local Web Hosting",
      heading: "Ultra Fast BDiX Hosting in Bangladesh",
      subheading: "1-10ms Ping, Ultra Fast Website Loading, 99.9% Cloud Uptime Guarantee for high-performance localized traffic.",
      startCta: "Start BDiX Hosting",
      testCta: "Run Speed Ping Test",
      discountBadge: "24 Months billing = Save 30% Auto Discount",
      whatIsTitle: "What is BDiX (Bangladesh Internet Exchange) Routing?",
      whatIsDesc: "BDiX is the national internet exchange of Bangladesh. Traditionally, if website files are hosted in the US or Europe, even a visitor from Dhaka has to wait for traffic to route over underwater ocean cables to the West and back (taking 150-250ms). With BDiX hosting, the traffic is routed locally through Bangladeshi ISPs, resulting in a blistering 1-10ms website loading speed.",
      routeHow: "How Local Routing Accelerates Your Brand:",
      advantagesTitle: "Engineered for Extreme Speeds",
      packagesTitle: "High-Performance BDiX NVMe Packages",
      whoNeedsTitle: "Who Absolutely Needs BDiX Hosting?",
      comparisonTitle: "Head-to-Head Performance Benchmark",
      reviewsTitle: "Loved by 5,000+ Bangladeshi Developers & Businesses",
      faqTitle: "Frequently Asked Questions",
      finalCtaHead: "Give Your Website the Blazing Fast BDiX Super Speed Today",
      viewPackages: "Choose Your Package",
      freeConsult: "Talk to Server Architects",
      uptime: "99.9% Uptime",
      nvme: "Enterprise NVMe SSD",
      ssl: "Free Lifetime SSL",
      migration: "Free Website Migration",
      monthly: "Monthly",
      yearly: "Yearly Pricing",
      saveDiscount: "Save 30% with 24-Month License",
      starter: "Starter Plan",
      business: "Business Core",
      enterprise: "Enterprise Scale",
      yearSuffix: "/year",
      twoYearSuffix: "/2 years",
    },
    bn: {
      tag: "প্রিমিয়াম লোকাল ওয়েব হোস্টিং",
      heading: "বাংলাদেশের সবচেয়ে দ্রুতগতির BDiX Hosting",
      subheading: "১-১০ms লাইভ পিং, আল্ট্রা ফাস্ট ওয়েবসাইট লোডিং এবং ৯৯.৯% ক্লাউড আপটাইম। ডাটা থাকবে নিজের দেশে, স্পিড মিলবে সবার চেয়ে বেশি।",
      startCta: "হোস্টিং শুরু করুন",
      testCta: "লাইভ স্পিড টেস্ট করুন",
      discountBadge: "২৪ মাসের প্যাকেজে ৩০% মেগা ডিসকাউন্ট প্রযোজ্য",
      whatIsTitle: "বিডিআইএক্স (BDiX) লোকাল রাউটিং কি এবং কিভাবে কাজ করে?",
      whatIsDesc: "BDiX বা বাংলাদেশ ইন্টারনেট এক্সচেঞ্জ হলো বাংলাদেশের অভ্যন্তরীণ ট্রাফিকের জন্য লোকাল নেটওয়ার্ক হাব। সাধারণত, কোনো ওয়েবসাইট মার্কিন যুক্তরাষ্ট্র বা ইউরোপে হোস্ট করা থাকলে, ঢাকার একজন ভিজিটর ক্লিক করলেও ডাটা আটলান্টিক সমুদ্র পাড়ি দিয়ে ঘুরে আসতে ১৫০-২৫০ms সময় নেয়। কিন্তু BDiX কানেক্টেড সার্ভারে ওয়েবসাইট রাখলে ডাটা কোনো বিদেশি চ্যানেল ছাড়াই দেশের লোকাল ইন্টারনেট এক্সচেঞ্জের মাধ্যমে সরাসরি ইউজারের নিকট ১-১০ms সময়ে পৌছে যায়।",
      routeHow: "লোকাল এক্সপ্রেস রাউটিং যেভাবে আপনার ব্র্যান্ডকে রক্ষা করে:",
      advantagesTitle: "বিডিআইএক্স হোস্টিং-এর দারুণ প্রযুক্তিগত সুবিধা",
      advantagesSubtitle: "অত্যাধুনিক লাইটস্পিড সার্ভার, বিশুদ্ধ NVMe সলিড স্টেট ড্রাইভ এবং লোকাল ISP অপ্টিমাইজেশনের দুর্দান্ত সমন্বয়।",
      packagesTitle: "গ্রাহকপ্রিয় প্রিমিয়াম বিডিআইএক্স NVMe হোস্টিং প্যাকেজ",
      whoNeedsTitle: "কাদের জন্য BDiX হোস্টিং অত্যন্ত জরুরী?",
      comparisonTitle: "বিডিআইএক্স হোস্টিং বনাম সাধারণ বিদেশি হোস্টিং",
      reviewsTitle: "বাংলাদেশের ৫,০০০+ দক্ষ ডেভেলপার ও বিজনেস ওনারদের বাস্তব মতামত",
      faqTitle: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)",
      finalCtaHead: "আজই BDiX Hosting নিয়ে আপনার ওয়েবসাইটকে দিন সুপার স্পিড",
      viewPackages: "প্যাকেজ দেখুন",
      freeConsult: "ফ্রি কনসালটেশন",
      uptime: "৯৯.৯% আপটাইম গ্যারান্টি",
      nvme: "এন্টারপ্রাইজ NVMe SSD স্টোরেজ",
      ssl: "ফ্রি লাইফটাইম SSL সার্টিফিকেট",
      migration: "ফ্রি ওয়েবসাইট মাইগ্রেশন সাপোর্ট",
      monthly: "মাসিক",
      yearly: "বাৎসরিক ফি",
      saveDiscount: "২৪ মাস এককালীন নিলে ৩০% ডিসকাউন্ট",
      starter: "স্টার্টার প্ল্যান",
      business: "বিজনেস কোর",
      enterprise: "এন্টারপ্রাইজ স্কেল",
      yearSuffix: "/বছর",
      twoYearSuffix: "/২ বছর",
    }
  };

  const currentT = currentLang === 'ar' ? t.en : (t[currentLang] || t.en);

  const advantages = [
    {
      titleEn: "Blazing Fast Response Speed",
      titleBn: "সুপার ফাস্ট লোডিং স্পিড",
      descEn: "Website assets load up to 20x faster. Perfect for local user engagement and high conversion ratios.",
      descBn: "আপনার কাস্টমারের ওয়েবসাইটের লোডিং স্পিড হবে চোখের পলকে। ২০ গুণ দ্রুত লোডিংয়ের ফলে সেলস বৃদ্ধি পায় চমৎকারভাবে।"
    },
    {
      titleEn: "Blistering Low Latency",
      titleBn: "সর্বনিম্ন ১-১০ms পিং টাইম",
      descEn: "Ping levels drop from 180ms down to a mere 1-10ms within Bangladesh's local ISP exchange paths.",
      descBn: "বিদেশি হোস্টিং এর মত ১৫০ms+ লেটেন্সি নয়, বাংলাদেশের ভেতর যেকোনো নেটওয়ার্ক থেকে স্পিড মিলবে ১-১০ms।"
    },
    {
      titleEn: "Advanced Local SEO Advantage",
      titleBn: "সার্চ ইঞ্জিন (Local SEO) বুস্ট",
      descEn: "Google ranks fast loading websites with local IP locations much higher for localized search terms.",
      descBn: "গুগল স্পিডকে অনেক গুরুত্ব দেয়। বিডিআইএক্স লোকাল আইপি ব্যবহারের কারণে গুগলের লোকাল সার্চে আপনার সাইট আগে আসবে।"
    },
    {
      titleEn: "Instant File Downloads",
      titleBn: "নিমিষেই আনলিমিটেড ডাউনলোড",
      descEn: "Enables visitors to stream and download static documents, videos, and dynamic PDF data with zero lag.",
      descBn: "কোনো রকম বাফারিং ছাড়াই ভিজিটররা সাইটের ছবি, ইমেজ গ্যালারি, ডকুমেন্ট এবং পিডিএফ ডাউনলোড করতে পারবেন দ্রুত।"
    },
    {
      titleEn: "Local ISP Direct Optimization",
      titleBn: "লোকাল আইএসপি কানেক্টিভিটি",
      descEn: "Directly peered with all major bandwidth distributors and mobile network groups across Bangladesh.",
      descBn: "লিংক৩, আমরা ব্রডব্যান্ড, কার্নিভাল এবং গ্রামীণফোন-রবি সহ দেশের সকল লোকাল ব্রডব্যান্ড নেটওয়ার্কের সাথে ডিরেক্ট পিয়ারিং।"
    },
    {
      titleEn: "High Performance Isolation",
      titleBn: "এন্টারপ্রাইজ হাই পারফরম্যান্স",
      descEn: "Powered by AMD EPYC modern CPUs and structured server kernels to handle sudden traffic spikes smoothly.",
      descBn: "আমাদের সার্ভারে রয়েছে অত্যাধুনিক AMD EPYC প্রসেসর এবং ক্লাউড এনভায়রনমেন্ট, যা ট্রাফিক লোড নিখুঁতভাবে হ্যান্ডেল করে।"
    }
  ];

  const pricingPackages = [
    {
      nameBn: "Starter",
      nameEn: "Starter Pack",
      ssd: "2GB NVMe SSD",
      sites: "1 Website",
      bandwidth: "100GB Bandwidth",
      priceYear: 799,
      price24m: 1118, // discounted
      original24m: 1598,
      isMiddle: false,
      descBn: "নতুন ব্লগার ও ছোট পোর্টফোলিওর জন্য আদর্শ।"
    },
    {
      nameBn: "Business",
      nameEn: "Business Core",
      ssd: "5GB NVMe SSD",
      sites: "5 Websites",
      bandwidth: "Unlimited Bandwidth",
      priceYear: 1499,
      price24m: 2098, // discounted
      original24m: 2998,
      isMiddle: true,
      descBn: "সবচেয়ে জনপ্রিয়! ছোট-মাঝারি ই-কমার্স ও বিজনেসের জন্য সেরা চয়েস।"
    },
    {
      nameBn: "Enterprise",
      nameEn: "Enterprise Scale",
      ssd: "10GB NVMe SSD",
      sites: "Unlimited Websites",
      bandwidth: "Unlimited Bandwidth",
      priceYear: 2599,
      price24m: 3638, // discounted
      original24m: 5198,
      isMiddle: false,
      descBn: "অধিক ট্রাফিকযুক্ত নিউজ পোর্টাল ও লার্জ ই-কমার্স সাইটের জন্য উপযোগী।"
    }
  ];

  const whoNeeds = [
    {
      title: currentLang === 'bn' ? "ই-কমার্স ওয়েবসাইট" : "Ecommerce Websites",
      desc: currentLang === 'bn' ? "১ সেকেন্ড লেটেন্সির কারণে বহু ই-কমার্স সেল বাতিল হয়ে যায়। BDiX হোস্টিং-এ ইনস্ট্যান্ট পেমেন্ট গেটওয়ে রাউটিং এবং চেকআউট মিলবে দ্রুত।" : "A 1-second delay reduces conversions by 7%. BDiX ensures instant checkouts and seamless payment gateway validation for local orders.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80"
    },
    {
      title: currentLang === 'bn' ? "অনলাইন নিউজ পোর্টাল" : "News Portals",
      desc: currentLang === 'bn' ? "হাজার হাজার ভিজিটর যখন একসাথে ব্রেকিং নিউজ পড়তে আসেন তখন বিডিআইএক্স লোকাল ব্যান্ডউইথ আপনার খরচ কমায় এবং আপটাইম সুরক্ষিত রাখে।" : "When thousands of visits crash international connections, country-level loop routes preserve your page stability and load assets instantly.",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=300&q=80"
    },
    {
      title: currentLang === 'bn' ? "ওটিটি ও স্ট্রিমিং প্ল্যাটফর্ম" : "OTT Platforms",
      desc: currentLang === 'bn' ? "ভিডিও বা অডিও কন্টেন্ট বাফারিং ছাড়াই স্ট্রিমিং করতে দেশের দর্শকদের জন্য লোকাল হোস্টিং ছাড়া কোনো বিকল্প নেই।" : "Streaming medium requirements demand flawless data pipes. Deliver zero-buffering high-definition localized audiovisual streams.",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=300&q=80"
    },
    {
      title: currentLang === 'bn' ? "শিক্ষা প্রতিষ্ঠান ও এলএমএস সাইট" : "Educational Sites & LMS",
      desc: currentLang === 'bn' ? "অনলাইন এক্সাম বা রেজাল্ট প্রকাশের সময়ে বিপুল চাপ সামলানোর জন্য লোকাল সার্ভার ডাটা এক্সচেঞ্জ নির্ভরযোগ্য সেবা বজায় রাখে।" : "Handling peak board results or classroom logins seamlessly requires local server resources to handle immediate local concurrency.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=300&q=80"
    },
    {
      title: currentLang === 'bn' ? "সরকারি ও কর্পোরেট ওয়েবসাইট" : "Government & State Portals",
      desc: currentLang === 'bn' ? "জাতীয় নিরাপত্তা এবং সর্বোচ্চ ডাটা ট্রান্সফার স্পিডের স্বার্থে সরকারি সার্ভিস পোর্টালগুলো বাধ্যতামূলকভাবে বিডিআইএক্স রাউটিং ব্যবহার করে।" : "Crucial data speed metrics and structural safety requirements necessitate localized government frameworks hosted securely.",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=300&q=80"
    }
  ];

  const comparison = [
    { feature: currentLang === 'bn' ? "স্পিড (বাংলাদেশের ভেতর)" : "Speed inside Bangladesh", bdix: "২০ গুণ দ্রুতগতির লোড (1-10ms)", inter: "ধীরগতির লোড (150-250ms)", positive: true },
    { feature: currentLang === 'bn' ? "পিং লেটেন্সি (Ping Rate)" : "Ping Latency (Lower is Better)", bdix: "১ থেকে ৫ মিলি-সেকেন্ড (১ms)", inter: "১৫০ থেকে ২৫০ মিলি-সেকেন্ড (১৫০ms)", positive: true },
    { feature: currentLang === 'bn' ? "লোকাল আইএসপি বাফারিং" : "Local ISP Buffer Lag", bdix: "জিরো বাফারিং (Direct Connection)", inter: "সমুদ্রের সাবমেরিন ক্যাবল সমস্যার ঝুঁকি", positive: true },
    { feature: currentLang === 'bn' ? "লোকাল এসইও অ্যাডভান্টেজ" : "Local Search SEO Score", bdix: "চমৎকার র‍্যাংকিং ও ট্রাফিক স্কোর", inter: "সাধারণ র‍্যাংকিং স্কোর", positive: true },
    { feature: currentLang === 'bn' ? "লোকাল ট্রাফিক হ্যান্ডেলিং" : "High Volume Local Traffic Boost", bdix: "অসাধারণ ব্যাকআপ ও কস্ট-এফিশিয়েন্সি", inter: "রিসোর্স অনুযায়ী ধীর লোড", positive: true },
  ];

  const testimonials = [
    { name: "আরিফুর রহমান", company: "Dhaka Tech Mart", role: "প্রতিষ্ঠাতা ও সিইও", text: "বিডিআইএক্স হোস্টিং ব্যবহার করার পর আমাদের ই-কমার্স ওয়েবসাইটের চেকআউট স্পিড অবিশ্বাস্য রকমের বেড়ে গেছে। কাস্টমার পেইজ লোড না হওয়ার কারণে চলে যাওয়া একেবারেই বন্ধ হয়েছে। সেলস বেড়েছে প্রায় ৪৫%!" },
    { name: "নুসরাত জাহান", company: "ExamBD Education", role: "টেকনিক্যাল ডিরেক্টর", text: "লাইভ কুইজ পরীক্ষার সময় আমাদের সাইটে একসাথে ৩-৪ হাজার স্টুডেন্ট পরীক্ষা দেয়। আগে বিদেশি সার্ভারে সাইট ক্র্যাশ করতো, কিন্তু WebzoneBD এর BDiX কানেক্টেড NVMe ড্রাইভ আমাদের সেই দুশ্চিন্তা দূর করেছে।" },
    { name: "এম ডি রাকিবুল", company: "Pratidin Khobor", role: "চীফ ইনফরমেটিক্স", text: "আমাদের দৈনিক অনলাইন পোর্টালের জন্য BDiX হোস্টিং অপরিহার্য ছিল। ব্রেকিং নিউজে লাখ লাখ মানুষ ঢুকলেও সাইট ডাউন হয় না। লাইটস্পিড এবং লোকাল ব্যান্ডউইথের অনন্য অভিজ্ঞতা।" },
    { name: "তারেক জামান", company: "BD Groceries Limited", role: "আইটি হেড", text: "WebzoneBD-এর কাস্টমার সাপোর্ট অসাধারণ। আমরা মাঝরাতে সাইট মাইগ্রেশন করতে চেয়েছিলাম, তারা কোনো ডাউনটাইম ছাড়াই আমাদেরকে ফ্রীতে মাইগ্রেট করে ফ্রী এসএসএল এক্টিভেট করে দিয়েছে।" },
    { name: "সারমিন সুলতানা", company: "Boutique Hub BD", role: "মার্কেট ডিরেক্টর", text: "১ms এর কম সময়ে যখন আমাদের ক্যাটালগ ওপেন হয়, সাধারণ ফেসবুক ইউজাররা সাইট ভিজিট করতে অনেক স্বাচ্ছন্দ্য বোধ করেন। ডেলিভারি ও অর্ডার রেশিও আগের চেয়ে অনেক বেড়েছে!" },
    { name: "তাহমিদুল ইসলাম", company: "SaaS Dev Bangladesh", role: "সিনিয়র ডেভেলপার", text: "লোকাল সার্ভার হওয়াতে ডেভলপমেন্ট টেস্ট এবং ডাটাবেজ কোয়েরি রেসপন্স এত কম সময়ে হচ্ছে যা সত্যি অতুলনীয়। রিয়াদ বা ঢাকায় যাদের ব্যবসা তাদের জন্য এটি বেস্ট হোস্টিং।" }
  ];

  const faqs = [
    {
      q: currentLang === 'bn' ? "BDiX Hosting কি?" : "What is BDiX Hosting?",
      a: currentLang === 'bn' ? "বিডিআইএক্স হোস্টিং হলো এমন হোস্টিং যার প্রধান সার্ভার বাংলাদেশ ইন্টারনেট এক্সচেঞ্জ (BDiX) এর সাথে সরাসরি যুক্ত। এর ফলে বাংলাদেশে থাকা সমস্ত ভিজিটর আন্তর্জাতিক ক্যাবল নেটওয়ার্ক এড়িয়ে বিডিআইএক্স লোকাল হাই-স্পিড পিয়ারিংয়ের মাধ্যমে অসাধারণ স্পিডে সাইট ভিজিট করতে পারেন।" : "BDiX Hosting places web servers inside bandwidth exchanges connected straight to Bangladesh's national network hub. Locals get loaded files directly from close range without passing transatlantic fiber lines."
    },
    {
      q: currentLang === 'bn' ? "বিডিআইএক্স এবং সাধারণ হোস্টিংয়ের প্রধান পার্থক্য কী?" : "What is the key difference between BDiX & Normal Hosting?",
      a: currentLang === 'bn' ? "মূল পার্থক্য হলো দূরত্ব ও গতি। সাধারণ হোস্টিং সাধারণত যুক্তরাষ্ট্র, সিঙ্গাপুর বা জার্মানিতে থাকে, যার সাবমেরিন ক্যাবল হয়ে আসতে অন্তত ১৫০-২০০ মিলি-সেকেন্ড সময় লাগে। আর বিডিআইএক্স হোস্টিং দেশের ভেতরে থাকার ফলে মাত্র ১-১০ মিলি-সেকেন্ডে ডেটা আদান প্রদান সম্পন্ন হয়।" : "The core difference lies in speed and distance. A visitor from Dhaka accessing US servers takes 180ms round-trip of network routing. With BDiX hosting in local datacenters, the lag drops to 1-10ms."
    },
    {
      q: currentLang === 'bn' ? "BDiX কি SEO এর জন্য ভালো?" : "Is BDiX beneficial for SEO?",
      a: currentLang === 'bn' ? "হ্যাঁ, অত্যন্ত ভালো। গুগলের Core Web Vitals রেটিং-এ সাইটের 'লোডিং স্পিড' অন্যতম প্রধান র‍্যাংকিং ফ্যাক্টর। আপনার সাইট ১ সেকেন্ডের কম সময়ে লোড হলে গুগল সার্চের ওপরের দিকে স্থান পাওয়ার সম্ভাবনা অনেক বেড়ে যায়।" : "Yes. Page loading velocity is part of search algorithms. Lower load metrics satisfy modern crawlers and naturally score higher ranks. Google algorithm prioritizes speedy Local IPs."
    },
    {
      q: currentLang === 'bn' ? "বিদেশি ভিজিটরদের জন্য ওয়েবসাইট কেমন স্পিড পাবে?" : "How fast will my site render for international visitors?",
      a: currentLang === 'bn' ? "আমাদের বিডিআইএক্স সার্ভারে হাই-স্পিড লোকাল নেটওয়ার্কের পাশাপাশি ডুয়াল আপলিঙ্ক ইন্টারন্যাশনাল ব্যান্ডউইথও রয়েছে। সুতরাং বাংলাদেশি দর্শকদের জন্য এটি রকেটের মত স্পিড দিলেও বিদেশি দর্শকদের জন্য স্বাভাবিক মানসম্মত আন্তর্জাতিক গতির নিশ্চয়তা দেয়।" : "Our premium networks maintain high-capacity international uplinks and Cloudflare edge peerings. International audiences access standard stable global latency with ease."
    }
  ];

  const toc = [
    { id: "hero", label: currentLang === 'bn' ? "১. বিডিআইএক্স স্পিড হিরো" : "1. Speed Hero" },
    { id: "what-is-bdix", label: currentLang === 'bn' ? "২. বিডিআইএক্স কী এবং কেন?" : "2. What is BDiX?" },
    { id: "advantages", label: currentLang === 'bn' ? "৩. চমৎকার সুবিধাসমূহ" : "3. Seven Core Advantages" },
    { id: "comparison", label: currentLang === 'bn' ? "৪. পারফরম্যান্স তুলনা টেবিল" : "4. Comparative Benchmark" },
    { id: "pricing", label: currentLang === 'bn' ? "৫. কম বাজেট হোস্টিং প্যাকেজ" : "5. Economical Hosting Plans" },
    { id: "reviews", label: currentLang === 'bn' ? "৬. কাস্টমার বাস্তব মতামত" : "6. Verified Client Reviews" },
    { id: "faq", label: currentLang === 'bn' ? "৭. সাধারণত জিজ্ঞাসিত প্রশ্ন" : "7. Solved FAQs" }
  ];

  // Animated particle decorations
  const particles = Array.from({ length: 15 });

  return (
    <div id="bdix-premium-post-wrapper" className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'bg-[#0B0F19] text-slate-100 dark' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sticky Top Reading Progress Bar */}
      <div className="sticky top-[64px] left-0 w-full bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-neutral-200/50 dark:border-slate-800/85 z-40 transition-all duration-300 shadow-xs mr-auto">
        {/* Subtle, hyper-smooth premium progress line */}
        <div className="w-full h-[4px] bg-neutral-100 dark:bg-slate-950">
          <div 
            className="h-full bg-gradient-to-r from-[#6C3BFF] via-[#00E5FF] to-indigo-500 transition-all duration-75" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        
        {/* Sub-Header info section inside sticky area */}
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded text-white text-[9px] font-black uppercase tracking-wider font-mono shrink-0 bg-gradient-to-r from-[#6C3BFF] to-indigo-600">
              {currentLang === 'bn' ? 'বিডিআইএক্স হোস্টিং' : 'BDiX Hosting'}
            </span>
            <span className="truncate text-slate-800 dark:text-slate-200 text-[11px] font-sans md:max-w-md hidden sm:block font-bold">
              {currentLang === 'bn' ? 'বাংলাদেশের সবচেয়ে দ্রুতগতির BDiX Hosting' : 'BDiX Hosting - Dhaka High Speed'}
            </span>
            {activeSection && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 hidden md:block" />
                <span className="text-[#6C3BFF] text-[11px] truncate md:max-w-xs shrink-0 font-bold hidden md:block uppercase font-mono">
                  {toc.find(o => o.id === activeSection)?.label || activeSection}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C3BFF] to-[#00E5FF] font-black text-sm">
                {Math.round(scrollProgress)}%
              </span> 
              <span>{currentLang === 'bn' ? 'পঠিত' : 'read'}</span>
            </span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6c3bff]" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating Interactive WhatsApp Chat Assistance */}
      <a
        href="https://api.whatsapp.com/send?phone=8801900000000&text=Hello%20WebzoneBD!%20I%20am%20interested%20in%20your%20premium%20BDiX%20Hosting%2520Packages."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center border border-white/20 group"
        title="Chat on WhatsApp"
        id="floating-whatsapp-trigger"
      >
        <PhoneCall className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-bold text-xs whitespace-nowrap ml-0 group-hover:ml-2">
          {currentLang === 'bn' ? 'হোয়াটসঅ্যাপ মেসেজ' : 'Chat WhatsApp'}
        </span>
      </a>

      {/* Premium Multi-Tier Stickable Hub Header */}
      <header className={`sticky top-0 z-[40] transition-all backdrop-blur-md border-b flex items-center justify-between px-4 sm:px-6 py-3 ${isDarkMode ? 'bg-[#0B0F19]/80 border-slate-800/80 shadow-lg' : 'bg-white/90 border-slate-200/80 shadow-xs'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer text-slate-500 dark:text-slate-400"
            title="Back to Blog directory"
            id="back-btn-header"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="hidden sm:block">
            <span className="text-[10px] font-mono tracking-widest text-[#6C3BFF] font-black uppercase">WebzoneBD Architects</span>
            <div className="text-xs font-extrabold flex items-center gap-1.5 leading-none">
              <span className="text-[#6C3BFF]">BDiX</span>
              <span className="text-slate-400">/</span>
              <span className="truncate max-w-[130px]">{post.title}</span>
            </div>
          </div>
        </div>

        {/* Mega Menu dynamic utility integrations */}
        <div className="flex items-center gap-3">
          
          {/* Simple Language Switcher Tab */}
          <button
            onClick={() => setCurrentLang(prev => prev === 'bn' ? 'en' : 'bn')}
            id="btn-lang-toggle-internal"
            className="px-2.5 py-1.5 rounded-lg text-xs font-black bg-[#6C3BFF]/10 text-[#6C3BFF] hover:bg-[#6C3BFF]/20 transition-all border border-[#6C3BFF]/15 cursor-pointer active:scale-95 uppercase font-mono"
            title="Switch Language"
          >
            {currentLang === 'bn' ? 'English' : 'বাংলা'}
          </button>

          {/* Independent Dark Mode Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            id="btn-dark-toggle-internal"
            className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-500 dark:text-slate-400 flex items-center justify-center"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-600" />}
          </button>

          {/* Social share widget */}
          <button
            onClick={handleCopyLink}
            id="btn-copy-top-nav"
            className={`p-2 border rounded-xl transition-all cursor-pointer flex items-center justify-center ${copiedLink ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-505 dark:text-slate-400'}`}
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Action-centric checkout trigger */}
          <a
            href="https://www.host.webzonebd.com/index.php?rp=/store/share-hosting"
            target="_blank"
            rel="noreferrer"
            id="btn-header-purchase-action"
            className="hidden md:inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-[#6C3BFF] to-blue-600 hover:opacity-95 shadow-md hover:shadow-[#6C3BFF]/25 cursor-pointer"
          >
            <span>{currentLang === 'bn' ? 'হোস্টিং শুরু করুন' : 'Order BDiX Host'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ================= HERO STAGE SECTION ================= */}
      <section id="hero" className="relative pt-12 pb-20 items-center overflow-hidden min-h-[85vh] flex">
        {/* Abstract futuristic grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#6C3BFF]/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Text Area */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6C3BFF]/10 border border-[#6C3BFF]/20 text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono shadow-xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{currentT.tag}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
                {currentLang === 'bn' ? 'বাংলাদেশের সবচেয়ে দ্রুতগতির' : 'Blazing Fast'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C3BFF] to-cyan-500">BDiX Hosting</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-350 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-medium font-sans">
                {currentT.subheading}
              </p>

              {/* Conversion Buttons Stack */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="https://www.host.webzonebd.com/index.php?rp=/store/share-hosting"
                  target="_blank"
                  rel="noreferrer"
                  id="hero-buy-host-btn"
                  className="px-6 py-3.5 font-bold text-sm text-white rounded-2xl bg-gradient-to-r from-[#6C3BFF] via-[#00E5FF]/20 to-blue-600 hover:opacity-95 shadow-xl shadow-[#6C3BFF]/20 hover:scale-[1.02] active:scale-95 cursor-pointer select-none transition-all flex items-center justify-center gap-2 border border-white/10"
                >
                  <Server className="w-4 h-4" />
                  <span>{currentT.startCta}</span>
                </a>

                <button
                  onClick={() => {
                    const el = document.getElementById('speed-test-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    runPingTest();
                  }}
                  id="hero-speed-test-btn"
                  className="px-6 py-3.5 font-bold text-sm rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-805 transition-all text-center flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-800 active:scale-95 shadow-xs"
                >
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  <span>{currentT.testCta}</span>
                </button>
              </div>

              {/* Trust Badges Ribbon */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 sm:grid-cols-5 gap-3.5 max-w-3xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-505 dark:text-slate-400 font-bold justify-center lg:justify-start">
                  <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-505"><Check className="w-3.5 h-3.5 shrink-0" /></span>
                  <span>BDiX Connected</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-505 dark:text-slate-400 font-bold justify-center lg:justify-start">
                  <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-505"><Check className="w-3.5 h-3.5 shrink-0" /></span>
                  <span>LiteSpeed Server</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-505 dark:text-slate-400 font-bold justify-center lg:justify-start">
                  <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-505"><Check className="w-3.5 h-3.5 shrink-0" /></span>
                  <span>NVMe SSD Storage</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-505 dark:text-slate-400 font-bold justify-center lg:justify-start">
                  <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-505"><Check className="w-3.5 h-3.5 shrink-0" /></span>
                  <span>Free SSL Secure</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-505 dark:text-slate-400 font-bold justify-center lg:justify-start col-span-2 sm:col-span-1">
                  <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-505"><Check className="w-3.5 h-3.5 shrink-0" /></span>
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right Side: High-Tech 3D Server, Bangladesh Map Vector and Speedometer illustration */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Outer decorative halo */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#6C3BFF]/20 animate-spin-slow pointer-events-none" />
              <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-dashed border-cyan-400/20 animate-spin-reverse pointer-events-none" />

              <div className="bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-md w-full max-w-md relative shadow-2xl space-y-6">
                
                {/* Visual server representational graphic card */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative space-y-4 shadow-inner">
                  {/* Glass reflection beam */}
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />
                  
                  {/* Bangladesh Latency Node Map marker */}
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] bg-slate-800 font-bold px-1.5 py-0.5 rounded text-emerald-400 uppercase font-mono">DHAKA SERVER COR-1</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">ONLINE</span>
                  </div>

                  {/* Latency meter mockup */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Server Ping Rate:</span>
                      <span className="text-cyan-400 font-black animate-pulse">1.13 Milliseconds (ms)</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "98%" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="h-full bg-gradient-to-r from-[#6C3BFF] via-cyan-400 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Active connection nodes list mockup */}
                  <div className="grid grid-cols-3 gap-2 text-[9px] font-mono pt-1 text-slate-450">
                    <div className="p-1 px-1.5 rounded bg-slate-950 border border-slate-850/65 flex flex-col items-center">
                      <span className="text-pink-500 font-black">10 Gbps</span>
                      <span>Uplink</span>
                    </div>
                    <div className="p-1 px-1.5 rounded bg-slate-950 border border-slate-850/65 flex flex-col items-center">
                      <span className="text-cyan-400 font-black">AMD EPYC</span>
                      <span>CPUs</span>
                    </div>
                    <div className="p-1 px-1.5 rounded bg-slate-950 border border-slate-850/65 flex flex-col items-center">
                      <span className="text-emerald-400 font-black">99.99%</span>
                      <span>Uptime</span>
                    </div>
                  </div>
                </div>

                {/* Country outline routing visualization inside card */}
                <div className="space-y-2 text-center lg:text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-widest block">
                    {currentLang === 'bn' ? 'বাংলাদেশ ডমেস্টিক এক্সপ্রেস গেটওয়ে' : 'BANGLADESH DOMESTIC EXPRESS GATEWAY'}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {currentLang === 'bn' 
                      ? "বিডিআইএক্স সংযোগের কারণে আপনার ভিজিটর দেশের ট্রাফিক ফাইবার লাইনে দেশের ম্যাপের ভেতর সরাসরি কানেক্ট হয়।" 
                      : "Direct localized peering guarantees traffic does not travel through underwater lines to load your data."}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= PERFORMANCE STATS ROW ================= */}
      <section className="bg-white/80 dark:bg-slate-950/80 border-t border-b border-slate-200/60 dark:border-slate-800/50 py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-[#6C3BFF] block leading-none font-mono">1ms</span>
              <span className="text-xs font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-widest block">
                {currentLang === 'bn' ? 'মিনিমাম পিং লেটেন্সি' : 'Minimum Ping Latency'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-cyan-500 block leading-none font-mono">99.99%</span>
              <span className="text-xs font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-widest block">
                {currentLang === 'bn' ? 'রিয়েল-টাইম আপটাইম' : 'Guaranteed Uptime'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-indigo-505 block leading-none font-mono">5,000+</span>
              <span className="text-xs font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-widest block">
                {currentLang === 'bn' ? 'হোস্টেড ওয়েবসাইটস' : 'Websites Hosted'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-[#6C3BFF] block leading-none font-mono">24/7/365</span>
              <span className="text-xs font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-widest block">
                {currentLang === 'bn' ? 'সিস্টেম ইঞ্জিনিয়ার সাপোর্ট' : 'Expert Tech Support'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT IS BDIX SECTION (COMPLEX ROUTE GRAPHICS) ================= */}
      <section id="what-is-bdix" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Visual Map Routing illustration */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden shadow-xl">
                
                <h4 className="text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono mb-4 text-center">
                  {currentLang === 'bn' ? 'ইন্টারনেট ট্রাফিক রাউটিং মেকানিজম তুলনা' : 'How BDiX Bypass Route Works'}
                </h4>

                {/* Submarine ocean route (BAD) */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 mb-6 text-xs">
                  <div className="flex items-center justify-between text-rose-500 font-bold">
                    <span>1. International Route (USA/Europe Hosting)</span>
                    <span className="font-mono text-[10.5px]">150ms - 260ms lag</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Dhaka User</span>
                    <span className="text-slate-300">→</span>
                    <span>Cox's Bazar Landing</span>
                    <span className="text-slate-300">→</span>
                    <span>Singapore Transit</span>
                    <span className="text-slate-300">→</span>
                    <span>US Server (Loading...)</span>
                  </div>
                  <div className="h-1 bg-rose-200 dark:bg-rose-950/40 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-rose-500 w-[55%] animate-pulse" />
                  </div>
                </div>

                {/* BDiX Domestic local loop (SUPERB) */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
                  <div className="flex items-center justify-between text-emerald-500 font-bold">
                    <span>2. BDiX Local Route (WebzoneBD Servers)</span>
                    <span className="font-mono text-[10.5px]">1ms - 8ms instant</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Dhaka User</span>
                    <span className="text-emerald-500 font-bold">→</span>
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-1.5 rounded">BDiX Peer Hub</span>
                    <span className="text-emerald-500 font-bold">→</span>
                    <span className="bg-[#6C3BFF]/20 text-indigo-400 font-bold px-1.5 rounded">WebzoneBD Servers</span>
                  </div>
                  <div className="h-1 bg-emerald-200 dark:bg-emerald-950/40 rounded-full overflow-hidden mt-2">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="h-full bg-emerald-500" 
                    />
                  </div>
                </div>

                {/* Visual loop schema block */}
                <div className="border border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-2xl mt-6">
                  <p className="text-[11px] text-slate-450 leading-relaxed font-semibold font-sans italic text-center">
                    {currentLang === 'bn' 
                      ? "বিডিআইএক্স সংযোগের চমৎকার বেনিফিটের কারণে আপনার ডেটা কক্সবাজার ও সিঙ্গাপুরের সমুদ্রের ক্যাবল ক্ষতিগ্রস্ত হলেও কোনো ল্যাগ ছাড়াই সচল থাকে।"
                      : "No matter if undersea cables sustain physical fiber damage, your domestic users load websites smoothly locally."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Explainer */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-mono font-black text-cyan-500 tracking-widest">
                {currentLang === 'bn' ? 'উচ্চ-প্রযুক্তির স্পিড বিপ্লব' : 'High-Performance Operations'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {currentT.whatIsTitle}
              </h2>
              <p className="text-sm text-slate-505 dark:text-slate-350 leading-relaxed font-semibold">
                {currentT.whatIsDesc}
              </p>

              <div className="space-y-4 pt-2">
                <span className="text-xs font-black uppercase text-slate-450 block font-mono">
                  {currentT.routeHow}
                </span>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded-lg bg-[#6C3BFF]/10 text-indigo-500 font-black text-xs select-none shrink-0 font-mono">১</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {currentLang === 'bn' ? 'অভাবনীয় বাফারিং-ফ্রী ইউজার এক্সপেরিয়েন্স' : 'Immensely Lower Bounce Rates'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentLang === 'bn' 
                          ? "১-২ms পিং লাইনের কারণে কাস্টমার যেকোনো ছবিতে ক্লিক করা মাত্র সাথে সাথে ওপেন হবে।"
                          : "Localized delivery translates to ultra responsive clicks, holding reader attention perfectly."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded-lg bg-[#6C3BFF]/10 text-indigo-500 font-black text-xs select-none shrink-0 font-mono">২</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {currentLang === 'bn' ? 'লোকাল সার্চ ইঞ্জিন (SEO) অপ্টিমাইজেশন বুস্ট' : 'Google Speed Algorithm Domination'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentLang === 'bn' 
                          ? "গুগল স্পিড ও লোকাল আইপি লোকেশনকে র‍্যাংকিংয়ে বিশেষ অগ্রাধিকার দেয় যা আপনার ট্রাফিক দ্বিগুণ করতে সাহায্য করে।"
                          : "Speed values and matching country core factors award upper placements across localized searches."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded-lg bg-[#6C3BFF]/10 text-indigo-500 font-black text-xs select-none shrink-0 font-mono">৩</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {currentLang === 'bn' ? 'নিরবচ্ছিন্ন লোকাল ক্যাশ মেমোরি রাইট' : 'Continuous Redundancy & Core Protection'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentLang === 'bn' 
                          ? "সাবমেরিন ক্যাবল কাটা গেলেও বা বিদেশী ডাটার ইন্টারনেট বিঘ্নিত হলেও দেশের দর্শকরা আপনার সাইট নিরবচ্ছিন্নভাবে পান।"
                          : "Even during undersea optic cable damage, client business remains online because of direct domestic routes."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= ADVANTAGES GRID (6 CARDS WITH ICONS) ================= */}
      <section id="advantages" className="py-20 bg-white/40 dark:bg-slate-950/50 border-t border-b border-slate-200/40 dark:border-slate-800/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono">
              {currentLang === 'bn' ? 'দারুণ প্রযুক্তিগত সুবিধা' : 'Unmatched Local Performance'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
              {currentT.advantagesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              {currentLang === 'bn' 
                ? "আমাদের বিডিআইএক্স হোস্টিং-এ ব্যবহৃত প্রতিটি প্রযুক্তি লোকাল কাস্টমার ভিজিটিং স্পিড বুস্ট করতে অপ্টিমাইজড।" 
                : "Every component we specify keeps local traffic at lightning priority with high conversion security."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {advantages.map((adv, idx) => {
              const icons = [Zap, Clock, TrendingUp, Cpu, Globe, Layers];
              const IconComp = icons[idx] || Cpu;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800/80 rounded-3xl transition-all shadow-md dark:shadow-xl/40 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#6C3BFF]/5 rounded-bl-3xl group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#6C3BFF]/10 text-[#6C3BFF] flex items-center justify-center font-bold">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white transition-colors group-hover:text-[#6C3BFF]">
                        {currentLang === 'bn' ? adv.titleBn : adv.titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {currentLang === 'bn' ? adv.descBn : adv.descEn}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PING TEST SPEED SIMULATOR INTEGRATION ================= */}
      <section id="speed-test-section" className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="p-6 sm:p-10 bg-slate-900 dark:bg-slate-950/80 border border-slate-800 rounded-3xl space-y-6 text-slate-100 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold block">// BANGLADESH Domestic network latency check</span>
              <h3 className="text-lg sm:text-2xl font-black">
                {currentLang === 'bn' ? 'লাইভ বিডিআইএক্স লেটেন্সি স্পিড টেস্ট সিমুলেটর' : 'Interactive BDiX Latency Ping Simulator'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-2xl">
                {currentLang === 'bn' 
                  ? "দেশের বিভিন্ন জনপ্রিয় আইএসপি (ISP) থেকে আপনার হোস্টিংয়ে কি রকম পিং ও রেসপন্স টাইম পাওয়া যাবে তা লাইভ পরখ করে দেখুন।" 
                  : "Compare simulated diagnostic response times across premier home networks using BDiX versus foreign web servers."}
              </p>
            </div>

            <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold font-sans block">Select diagnostic speed node:</span>
                <span className="text-xs font-mono font-black text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Dhaka Edge Cluster Node-Alpha
                </span>
              </div>

              <button
                onClick={runPingTest}
                disabled={pingTestStatus === 'testing'}
                className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 rounded-2xl cursor-pointer disabled:opacity-50 select-none flex items-center justify-center gap-2 duration-200 active:scale-95 text-center min-w-[150px] shrink-0"
                id="btn-run-latency-check"
              >
                {pingTestStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{currentLang === 'bn' ? 'লেটেন্সি চেক করুন' : 'Test Latency Ping'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated Live Latency Monitor Board */}
            <div className="bg-slate-950 p-4 border border-slate-850/60 rounded-2xl min-h-[180px] space-y-3">
              {pingTestStatus === 'idle' && (
                <div className="h-[180px] flex flex-col items-center justify-center text-center text-slate-500 text-xs font-mono">
                  <Cpu className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
                  <span>Click the test button above to ping WebzoneBD BDiX servers...</span>
                </div>
              )}

              {pingTestStatus !== 'idle' && (
                <div className="space-y-2 text-xs font-mono">
                  <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-400 font-black border-b border-slate-850 pb-2 uppercase tracking-wider">
                    <span className="col-span-6">ISP Network / Region</span>
                    <span className="col-span-3 text-center text-emerald-400">BDiX (Local)</span>
                    <span className="col-span-3 text-center text-rose-450">Regular Host</span>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {pingResults.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center text-slate-350 bg-slate-900/40 p-1.5 px-2.5 border border-slate-850 rounded-xl"
                      >
                        <span className="col-span-6 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#13C2C2] shrink-0" />
                          {item.isp}
                        </span>
                        
                        <span className="col-span-3 text-center font-black text-emerald-400 bg-emerald-500/5 py-1 rounded">
                          {item.local}ms
                        </span>
                        
                        <span className="col-span-3 text-center font-bold text-rose-400/80">
                          {item.global}ms
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {pingTestStatus === 'testing' && (
                    <div className="text-center pt-2 text-[#6C3BFF] font-black animate-pulse text-[10.5px]">
                      // STAGGERED ROUTE PINGS IN PROGRESS...
                    </div>
                  )}

                  {pingTestStatus === 'completed' && (
                    <div className="text-center pt-2 text-emerald-400 font-bold text-[10.5px] bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                      ✔ COMPLETED SUCCESSFUL LATENCY CHECKS. BDIX SPEED IS ON AVERAGE 98% FASTER WITH LOW LOSS.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPARISON TABLE ================= */}
      <section id="comparison" className="py-20 bg-white/30 dark:bg-slate-950/40 border-t border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono">
              {currentLang === 'bn' ? 'হেড টু হেড তুলনা' : 'Competitive Metric Details'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {currentT.comparisonTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              {currentLang === 'bn' 
                ? "আমাদের লোকাল বিডিআইএক্স হোস্টিং এবং সাধারণ আন্তর্জাতিক হোস্টিং-এর মধ্যে বাস্তব গতি ও উপযোগিতার তুলনা দেখুন।" 
                : "A core breakdown of technical indicators contrasting local domestic exchanges with standard global servers."}
            </p>
          </div>

          <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950/90 text-slate-800 dark:text-slate-350 border-b border-slate-200 dark:border-slate-800 font-mono text-[10.5px] uppercase font-black uppercase tracking-wider">
                  <th className="p-4 px-6">{currentLang === 'bn' ? 'ফিচারস / পারফরম্যান্স মেট্রিক' : 'Feature / Metric'}</th>
                  <th className="p-4 px-6 text-slate-950 dark:text-white bg-[#6C3BFF]/10 text-center font-bold">
                    WebzoneBD BDiX Cloud
                  </th>
                  <th className="p-4 px-6 text-center">{currentLang === 'bn' ? 'সাধারণ আন্তর্জাতিক হোস্টিং' : 'Regular Global'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                {comparison.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="p-4 px-6 font-bold text-slate-905 dark:text-slate-200">{row.feature}</td>
                    <td className="p-4 px-6 text-emerald-600 dark:text-emerald-400 bg-[#6C3BFF]/5/40 text-center font-bold">
                      <div className="flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{row.bdix}</span>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-rose-500 text-center font-bold">
                      <div className="flex items-center justify-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{row.inter}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= HOSTING PACKAGES (3 PRICING CARDS WITH discount TOGGLE) ================= */}
      <section id="pricing" className="py-20 relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#6C3BFF]/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono">
              {currentLang === 'bn' ? 'ফ্লেক্সিবল সাশ্রয়ী প্যাকেজ' : 'Scalable Premium Solutions'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {currentT.packagesTitle}
            </h2>
            
            {/* 30% Auto Discount Toggle Area */}
            <div className="inline-flex flex-col items-center gap-2 pt-2">
              <div className="inline-flex bg-white dark:bg-slate-900 border border-slate-240 dark:border-slate-800 p-1 rounded-2xl shadow-md">
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all select-none cursor-pointer ${billingPeriod === 'yearly' ? 'bg-[#6C3BFF] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  id="billing-toggle-yearly"
                >
                  {currentT.yearly}
                </button>
                <button
                  onClick={() => setBillingPeriod('24months')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all select-none cursor-pointer flex items-center gap-1.5 ${billingPeriod === '24months' ? 'bg-[#6C3BFF] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  id="billing-toggle-discount"
                >
                  <span>24 Months</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500 text-white font-black text-[8px] rounded uppercase leading-none">
                    -30%
                  </span>
                </button>
              </div>
              <span className="text-[10px] sm:text-xs font-black text-emerald-505 dark:text-emerald-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentT.discountBadge}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            {pricingPackages.map((pkg, idx) => {
              const currentPrice = billingPeriod === 'yearly' ? pkg.priceYear : pkg.price24m;
              const originalPriceTotal = billingPeriod === 'yearly' ? pkg.priceYear : pkg.original24m;
              const perYearEquivalent = billingPeriod === 'yearly' ? pkg.priceYear : Math.round(pkg.price24m / 2);

              return (
                <div
                  key={idx}
                  className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    pkg.isMiddle
                      ? 'bg-white dark:bg-[#121829] border-[#6C3BFF] shadow-xl md:scale-105 z-10 shadow-[#6C3BFF]/10'
                      : 'bg-white/70 dark:bg-slate-900/40 border-slate-205 dark:border-slate-805 shadow-md hover:border-[#6C3BFF]/40'
                  }`}
                >
                  
                  {/* Highlighted middle package overlay */}
                  {pkg.isMiddle && (
                    <div className="absolute top-0 right-0">
                      <span className="bg-[#6C3BFF] text-white font-mono font-black text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl block shadow-md">
                        {currentLang === 'bn' ? 'সেরা চয়েস' : 'Most Popular Plan'}
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#6C3BFF] font-mono block">
                        {pkg.nameEn}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black mt-1 text-slate-900 dark:text-white">
                        {currentLang === 'bn' ? pkg.nameBn : pkg.nameEn}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-1.5 min-h-[36px]">
                        {pkg.descBn}
                      </p>
                    </div>

                    {/* Highly responsive pricing scale */}
                    <div className="py-4 border-t border-b border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-slate-905 dark:text-white font-mono">
                          ৳{currentPrice}
                        </span>
                        
                        <span className="text-xs text-slate-500 font-semibold font-mono">
                          {billingPeriod === 'yearly' ? currentT.yearSuffix : currentT.twoYearSuffix}
                        </span>
                      </div>

                      {billingPeriod === '24months' && (
                        <div className="text-[11px] text-emerald-505 dark:text-emerald-400 font-bold font-mono">
                          <span>{currentLang === 'bn' ? 'সরাসরি ডিসকাউন্ট স্পেশাল:' : 'Special Rate:'} </span>
                          <span className="line-through text-slate-450 text-[10px] mr-1">৳{pkg.original24m}</span>
                          <span>(৳{perYearEquivalent}{currentT.yearSuffix})</span>
                        </div>
                      )}
                    </div>

                    {/* Features checklist inside cards */}
                    <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-350">
                      <li className="flex items-center gap-2.5 font-bold">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{pkg.ssd} {currentLang === 'bn' ? 'আল্ট্রা-স্পিড স্টোরেজ' : 'Space'}</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-bold">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{pkg.sites} {currentLang === 'bn' ? 'ওয়েবসাইট হোস্ট করুন' : 'Allowed'}</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-bold">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{pkg.bandwidth} {currentLang === 'bn' ? 'ব্যান্ডউইথ সীমা' : 'Bandwidth'}</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-bold">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{currentT.ssl}</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-bold">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{currentT.migration}</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 font-medium">
                        <Check className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{currentLang === 'bn' ? 'সহজ এক ক্লিকে ওয়ার্ডপ্রেস ইন্সটল' : 'One-Click App WordPress Installer'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pricing conversion actions */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href="https://www.host.webzonebd.com/index.php?rp=/store/share-hosting"
                      target="_blank"
                      rel="noreferrer"
                      id={`pricing-card-action-${idx}`}
                      className={`w-full py-3.5 font-extrabold text-xs text-center rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all select-none active:scale-95 duration-200 ${
                        pkg.isMiddle
                          ? 'bg-gradient-to-r from-[#6C3BFF] to-blue-600 text-white shadow-lg shadow-[#6C3BFF]/25 hover:opacity-95'
                          : 'bg-slate-100 hover:bg-[#6C3BFF] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-white dark:text-slate-250 border border-slate-205 dark:border-slate-750 hover:border-[#6C3BFF]'
                      }`}
                    >
                      <span>{currentT.startCta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center text-xs text-slate-450 leading-relaxed max-w-2xl mx-auto font-sans">
            {currentLang === 'bn' 
              ? "* সমস্ত অ্যাকাউন্টেই ২৪/৭ রিয়্যাল-টাইম সার্ভার ক্যাশে অপ্টিমাইজেশন এবং ডাইরেক্ট লাইভ চ্যাট সাপোর্ট অন্তর্ভুক্ত রয়েছে। ২৪ মাস প্যাকেজ মেয়াদ এককালীন ক্রয়ের ক্ষেত্রে স্বয়ংক্রিয়ভাবে ৩০% ডিসকাউন্ট যোগ করা হয়েছে।" 
              : "* All packages enjoy AMD EPYC performance pools and complimentary priority live support. 24 Months pricing incorporates a special 30% savings discount."}
          </div>
        </div>
      </section>

      {/* ================= WHO NEEDS BDIX HOSTING (5 CARDS) ================= */}
      <section id="who-needs" className="py-20 bg-white/40 dark:bg-slate-950/40 border-t border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono">
              {currentLang === 'bn' ? 'কাদের জন্য এটি অপরিহার্য?' : 'Critical User Clusters'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {currentT.whoNeedsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whoNeeds.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all hover:shadow-md hover:border-cyan-500/30 group"
              >
                <div className="space-y-4">
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100">
                    <img 
                      src={item.image} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#6C3BFF] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CUSTOMER REVIEWS (6 TESTIMONIALS) ================= */}
      <section id="reviews" className="py-20 relative overflow-hidden bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono">
              {currentLang === 'bn' ? 'বাস্তব ক্লায়েন্ট রিভিউ' : 'True Customer Reviews'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {currentT.reviewsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#121829]/60 backdrop-blur-md border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-md text-left flex flex-col justify-between relative"
              >
                <div className="absolute top-4 right-4 text-[#6C3BFF]/10 text-5xl font-serif leading-none select-none">“</div>
                
                <div className="space-y-3 relative z-10">
                  {/* Real five star ratings */}
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-current shrink-0" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-505 dark:text-slate-350 leading-relaxed font-semibold">
                    {test.text}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C3BFF] to-blue-500 text-white font-extrabold text-sm flex items-center justify-center">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {test.name}
                    </h4>
                    <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold block mt-0.5">
                      {test.role}, <strong className="text-slate-900 dark:text-slate-200">{test.company}</strong>
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE BLOG CONTENT INSIDE (STICKY OUTLINE) ================= */}
      <section className="py-20 border-t border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Sticky Left Sidebar Outline / Table of Contents */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="p-6 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-805 rounded-3xl shadow-xs space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#6C3BFF] font-black uppercase block">Estimated: 12 Min Read</span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">
                  {currentLang === 'bn' ? 'আর্টিকেল সূচিপত্র' : 'Article Highlights Guidelines'}
                </h4>
                <nav className="space-y-2 text-xs">
                  {toc.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const target = document.getElementById(item.id);
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="w-full text-left font-bold text-slate-550 dark:text-slate-400 hover:text-[#6C3BFF] dark:hover:text-cyan-405 block p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-xs"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Read-Friendly Large Typography Blog Content Area */}
            <article ref={articleRef} className="lg:col-span-8 space-y-8 text-left select-text select-text pr-0 lg:pr-6">
              
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentLang === 'bn' ? 'বাংলাদেশের সবচেয়ে দ্রুতগতির BDiX হোস্টিং নিয়ে বিস্তারিত গাইড' : 'Complete Engineering Blueprint to BDiX Hosting Systems'}
                </h2>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-450 dark:text-slate-400">
                  <span>Author: {post.author}</span>
                  <span>Category: {currentT.tag}</span>
                </div>
              </div>

              <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-350 font-sans font-medium">
                <p>
                  {currentLang === 'bn' 
                    ? "আজকের তীব্র প্রতিযোগিতামূলক অনলাইন বাজারে, একটি ওয়েবসাইটের দ্রুত লোডিং স্পিড কাস্টমার ধরে রাখার প্রধান চাবিকাঠি। মানুষ এখন আর ধীরগতির ওয়েবসাইটের জন্য অপেক্ষা করে না। ক্লিক করার ১ থেকে ২ সেকেন্ডের মধ্যে যদি পেজ ওপেন না হয়, তবে ভিজিটর অন্য প্রতিযোগী সাইটে চলে যান।"
                    : "In today's fast paced technology landscapce, page performance determines absolute conversion limits. Users wait mere fractions of seconds before dropping off back to local search competitors. BDiX bypasses foreign route transits entirely."}
                </p>

                <p>
                  <strong>{currentLang === 'bn' ? 'কেন ১ms পিং গুরুত্বপূর্ণ?' : 'Why is 1-10ms Ping critical?'}</strong>{' '}
                  {currentLang === 'bn' 
                    ? "যখন আপনার হোস্টিং দেশের আইএক্স (IX) বা ডমেস্টিক আইপি এর সাথে সরাসরি যুক্ত থাকে, তখন নেটওয়ার্কের লেটেন্সি ড্রপ করে সর্বনিম্ন সীমায় নেমে আসে। ১-১০ms লেটেন্সির অর্থ হলো—কোনো বাফারিং ছাড়াই ইউজারের ব্রাউজার সার্ভারের সাথে প্রতিনিয়ত ডেটা এক্সচেঞ্জ করতে পারছে।"
                    : "When servers communicate peer-to-peer over local IX infrastructures inside Bangladesh, standard network latency indicators sink to near 1ms levels. Checkouts render faster, media starts without delay, and applications feel robust."}
                </p>

                <div className="border-l-4 border-[#6C3BFF] pl-4 italic bg-slate-100 dark:bg-slate-900/60 p-4 rounded-r-2xl text-xs sm:text-sm font-semibold">
                  {currentLang === 'bn' 
                    ? "“গবেষণায় দেখা গেছে, মোবাইল সাইটগুলোর স্পিড ০.১ সেকেন্ড বুস্ট করলেও রিটেল কনভার্সন রেট প্রায় ৮.৪% বৃদ্ধি পায়! BDiX স্পিড এবং লোকাল ব্যান্ডউইথ ব্যবহার করে আপনার ব্যবসার সেলস দ্বিগুণ করার মোক্ষম সুযোগ।”"
                    : "“A speed boost of just 0.1s yields up to an 8% increase in overall checkout conversion. Keep local assets domestic on country routing channels.”"}
                </div>

                <p>
                  <strong>{currentLang === 'bn' ? 'কোনোরূপ ফাইবার কাটআউট বা ডাউনটাইম রিস্ক নেই:' : 'SUBSEA FIBER LOSS COMPENSATED:'}</strong>{' '}
                  {currentLang === 'bn' 
                    ? "বঙ্গোপসাগরে প্রায় প্রতি বছরই সাবমেরিন ক্যাবল মেরামত বা রক্ষণাবেক্ষণের কারণে আমাদের আন্তর্জাতিক ব্যান্ডউইথ ব্যাপকভাবে বিঘ্নিত হয় যা দেশের প্রায় প্রতিটি ব্যবসায়িক সাইটকে স্লো করে দেয়। কিন্তু বিডিআইএক্স হোস্টেড সাইটগুলো লোকাল ট্রাফিকের জন্য সম্পূর্ণ নিরাপদ এবং ক্যাবল মেরামত করার দিনগুলোতেও কোনো ল্যাগ ছাড়াই নিরবচ্ছিন্ন স্পিডে চলে।"
                    : "Undersea deep seawater communication fiber cuts routinely hamper global gateway uplinks. However, BDiX routed local pages sustain zero drops because internal traffic doesn't traverse through cox's bazar or offshore networks."}
                </p>
              </div>

              {/* In-content conversion box */}
              <div className="my-8 p-6 bg-gradient-to-r from-[#6C3BFF]/20 via-blue-500/10 to-transparent border border-[#6C3BFF]/20 rounded-3xl space-y-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  {currentLang === 'bn' ? 'আপনার ওয়েবসাইট স্পিড নিয়ে চিন্তিত?' : 'Want a Blazing Fast Speed Upgrade?'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  {currentLang === 'bn' 
                    ? "আমাদের বিশেষজ্ঞ ইঞ্জিনিয়ারদের দিয়ে কোনোরূপ ডাউনটাইম ও ডেটা লস ছাড়াই সম্পূর্ণ ফ্রিতে বর্তমান হোস্টিং থেকে আমাদের অতি দ্রুতগতির বিডিআইএক্স NVMe হোস্টিং-এ শিফট করুন আজই।"
                    : "Shift your files to WebzoneBD's premium local cluster for free with zero downtime. Get absolute core security with LiteSpeed cache."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.host.webzonebd.com/index.php?rp=/store/share-hosting"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 text-xs font-bold text-white bg-[#6C3BFF] hover:bg-opacity-90 rounded-xl cursor-pointer"
                  >
                    🚀 {currentT.viewPackages}
                  </a>
                </div>
              </div>

              {/* Share Insights (Modern Premium Brand Buttons) */}
              <div className="mt-8 pt-6 border-t border-dashed border-neutral-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-violet-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-300 font-mono">
                    {currentLang === 'bn' ? 'আর্টিকেলটি বন্ধুদের সাথে শেয়ার করুন' : 'Spread the Knowledge'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  {currentLang === 'bn' 
                    ? 'আপনার সামাজিক যোগাযোগ মাধ্যমে এই গুরুত্বপূর্ণ তথ্যটি শেয়ার করে অন্যদের জানতে সাহায্য করুন।'
                    : 'Help colleagues and friends level up by sharing this technical insight on your social platforms.'
                  }
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {/* Twitter / X */}
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(currentLang === 'bn' ? post.titleBn || post.title : post.title)}`}
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
                    href={`https://linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(currentLang === 'bn' ? post.titleBn || post.title : post.title)}`}
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
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent((currentLang === 'bn' ? post.titleBn || post.title : post.title) + ' - ' + window.location.href)}`}
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
                    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
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
                      href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`} 
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-[#0088cc] dark:hover:text-[#0088cc] transition-colors flex items-center gap-1 font-mono text-[10.5px]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </a>
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className={`px-3 py-1.5 rounded-lg font-bold font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                      copiedLink 
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 animate-pulse' 
                        : 'bg-neutral-150 dark:bg-slate-850 text-neutral-600 dark:text-slate-350 hover:bg-neutral-200 dark:hover:bg-slate-750'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Permanent URL'}</span>
                  </button>
                </div>
              </div>

            </article>

          </div>
        </div>
      </section>

      {/* ================= ACCORDION FAQ SECTION ================= */}
      <section id="faq" className="py-20 bg-white/40 dark:bg-slate-950/40 border-t border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#6C3BFF] font-mono">
              {currentLang === 'bn' ? 'প্রশ্ন এবং উত্তর' : 'Common Knowledge Base'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {currentT.faqTitle}
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-3xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer select-none"
                  id={`faq-accordion-trigger-${idx}`}
                >
                  <span className="leading-tight">{faq.q}</span>
                  <span className="shrink-0 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {activeFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 sm:p-6 pt-0 border-t border-slate-50 dark:border-slate-850/60 text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed font-semibold">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA CONVERSION GRADIENT SECTION ================= */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#6C3BFF] via-indigo-900 to-[#121829] text-white">
        
        {/* Glowing floating decorative ambient circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-cyan-400 text-xs font-black uppercase tracking-widest font-mono border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPRESS LOCAL BDIX CONNECT</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            {currentT.finalCtaHead}
          </h2>

          <p className="text-xs sm:text-sm text-indigo-200 font-medium max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn' 
              ? "১-১০ms লাইভ রেসপন্স পিং ল্যাগ, আল্ট্রা-স্পিড পিওর NVMe এসএসডি ড্রাইভ এবং লাইটস্পিড ক্যাশিং প্রযুক্তির অনন্য সমন্বয় নিয়ে শুরু করুন আজই।"
              : "Engage customers and drop page bounce metrics inside Bangladesh instantly. Experience country-level loop routes."}
          </p>

          {/* Core Action Callers */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://www.host.webzonebd.com/index.php?rp=/store/share-hosting"
              target="_blank"
              rel="noreferrer"
              id="final-cta-host-buy-action"
              className="px-8 py-4 font-black text-sm text-slate-900 bg-white hover:bg-slate-50 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <Server className="w-4 h-4 text-violet-655" />
              <span>{currentLang === 'bn' ? 'বিডিআইএক্স হোস্টিং কিনুন' : 'Purchase Package'}</span>
            </a>

            <button
              onClick={() => {
                const formEl = document.getElementById('consultation-form-block');
                formEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              id="final-cta-consult-action"
              className="px-8 py-4 font-black text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 rounded-2xl shadow-md backdrop-blur-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 select-none"
            >
              <PhoneCall className="w-4 h-4 text-cyan-300" />
              <span>{currentT.freeConsult}</span>
            </button>
          </div>

          <div className="text-[10.5px] font-mono text-indigo-305 pt-2">
            No Setup Fee · High-Performance Backups · Free Safe Web Transfer Support
          </div>
        </div>
      </section>

      {/* ================= OPTIONAL FREE CONSULTATION BOOKING BLOCK ================= */}
      <section id="consultation-form-block" className="py-20 max-w-md mx-auto px-4 sm:px-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="text-center space-y-1.5">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest text-[#6C3BFF]">
              {currentLang === 'bn' ? 'ফ্রি টেকনিক্যাল কনসালটেশন' : 'Schedule Server Discussion'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              {currentLang === 'bn' 
                ? "আপনার বর্তমান সাইটের লোডিং স্পিড ফ্রিতে চেক করাতে এবং সার্ভার আর্কিটেক্টের সাজেশান নিতে ফর্মটি পূরণ করুন।" 
                : "Leave your contact details. Our senior network optimizer will analyze your current loading speed for free."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {contactFormSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-505 dark:text-emerald-400 rounded-2xl text-center space-y-2"
                key="success-form"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-550 mx-auto animate-bounce" />
                <h5 className="text-xs font-black uppercase">সফলভাবে জমা হয়েছে!</h5>
                <p className="text-[11px] font-semibold">
                  {currentLang === 'bn' 
                    ? "আপনার তথ্য নথিভুক্ত করা হয়েছে। কিছুক্ষণের মধ্যে আমাদের সিস্টেম ইঞ্জিনিয়ার আপনাকে কল করবেন।" 
                    : "Information safely filed. Our database expert will call your phone soon."}
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!contactName || !contactPhone) return;
                  setContactFormSubmitted(true);
                }}
                className="space-y-3"
                key="active-form"
                id="consultation-form-action"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-450 block uppercase">Full Name / নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arif Rahman"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#6C3BFF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-450 block uppercase">Phone Number / ফোন নম্বর</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +880 1XXX-XXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#6C3BFF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#6C3BFF] hover:bg-opacity-95 rounded-xl shadow-md cursor-pointer select-none text-center active:scale-95 duration-200"
                >
                  {currentLang === 'bn' ? 'ফ্রি সেশন বুক করুন' : 'Request Free Session'}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Related Articles Section for content discovery & engagement */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#6C3BFF] dark:text-[#00E5FF] font-mono block mb-1">
                {currentLang === 'bn' ? 'আরও পড়ুন' : currentLang === 'ar' ? 'اقرأ المزيد' : 'Keep Reading'}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentLang === 'bn' ? 'সম্পর্কিত অন্যান্য আর্টিকেল' : currentLang === 'ar' ? 'مقالات ذات صلة' : 'Related Insights & Articles'}
              </h3>
            </div>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800/60 dark:to-transparent hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.slice(0, 3).map((rp) => {
              const rTitle = currentLang === 'bn' ? rp.titleBn || rp.title : currentLang === 'ar' ? rp.titleAr || rp.title : rp.title;
              const rCategory = currentLang === 'bn' ? rp.categoryBn || rp.category : currentLang === 'ar' ? rp.categoryAr || rp.category : rp.category;
              return (
                <div
                  key={rp.id}
                  onClick={() => onSelectRelated && onSelectRelated(rp)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/85 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#6C3BFF]/40 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image wrap */}
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-150 dark:bg-slate-950 mb-3.5 relative">
                      <img
                        src={rp.image}
                        alt={rTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#6C3BFF] dark:bg-purple-600 text-white text-[9px] uppercase font-black tracking-wider rounded-md font-mono">
                        {rCategory}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-850 dark:text-white group-hover:text-[#6C3BFF] dark:group-hover:text-purple-400 line-clamp-2 leading-snug transition-colors">
                      {rTitle}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-450 font-mono mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6C3BFF]" />
                      {rp.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {rp.views.toLocaleString()} {currentLang === 'bn' ? 'বার দেখা হয়েছে' : 'views'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer support citation */}
      <footer className="py-8 border-t border-slate-200/50 dark:border-slate-805/50 text-center text-[11px] text-slate-450 font-mono">
        <div>WebzoneBD Tech Core Publications © 2026. All rights secured.</div>
        <div className="mt-1">Authorized under BDiX Domestic network agreements.</div>
      </footer>

    </div>
  );
}
