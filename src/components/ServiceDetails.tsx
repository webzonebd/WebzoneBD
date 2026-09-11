import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Star, Phone, Check, Send, Sparkles, MessageSquare, 
  Layers, Clock, ShieldCheck, Mail, Globe, CheckCircle2, Award, 
  HelpCircle, ChevronDown, ChevronUp, FileText, ShoppingBag, Info, 
  User, Database, Terminal, CheckCircle, ChevronRight, Play, Paperclip, AlertCircle,
  Share2, ArrowDownToLine, DollarSign, Wallet, Facebook, Twitter, Instagram, MessageCircle, QrCode,
  Shield, Copy, Upload, Zap, RefreshCw, Heart, Eye, Tag, Search, Plus, Trash2, ExternalLink, Gift
} from 'lucide-react';
import { Service, Language, Theme, Order, Currency } from '../types';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';

interface ServiceDetailsProps {
  service: any; // CatalogService type
  language: Language;
  theme: Theme;
  currency: Currency;
  onBack: () => void;
  onNavigateToService: (srvId: string) => void;
  allServices: any[];
  addSimulatedServiceOrder: (order: Order) => void;
  triggerToast: (msg: string) => void;
  addToCart?: (product: any) => void;
  setCartOpen?: (open: boolean) => void;
  onOrderWhatsApp?: (serviceName: string, packageName?: string) => void;
  onRequestQuotation?: (serviceName: string, packageName?: string) => void;
  user?: any;
}

export default function ServiceDetails({
  service,
  language,
  theme,
  currency,
  onBack,
  onNavigateToService,
  allServices,
  addSimulatedServiceOrder,
  triggerToast,
  addToCart,
  setCartOpen,
  onOrderWhatsApp,
  onRequestQuotation,
  user
}: ServiceDetailsProps) {
  const isDark = theme === 'dark';
  
  // Package & Pricing States
  const [activePackageTab, setActivePackageTab] = useState<'starter' | 'professional' | 'business'>('professional');
  const [advancePercent, setAdvancePercent] = useState<30 | 50 | 100>(100);
  
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specifications' | 'timeline' | 'reviews' | 'faq'>('overview');

  // Accordion & Timeline States
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [currentTimelineStep, setCurrentTimelineStep] = useState<number>(0);

  // Modal States
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [showSharePanel, setShowSharePanel] = useState<boolean>(false);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  // Manual Payment Verification Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1);
  const [selectedGateway, setSelectedGateway] = useState<string>('bKash Wallet');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);

  // Reviews States
  const [firestoreReviews, setFirestoreReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(user?.name || '');
  const [uploadedReviewImage, setUploadedReviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wishlist / Favorite state
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Countdown timer for offer (12 hours)
  const [timeLeft, setTimeLeft] = useState<number>(43200);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 43200));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  };

  const timer = formatCountdown(timeLeft);

  // Fetch Reviews from Firestore
  useEffect(() => {
    if (!service || !service.id) return;
    try {
      const q = query(
        collection(db, 'store_reviews'),
        where('productId', '==', service.id)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: any[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setFirestoreReviews(items);
      }, (error) => {
        console.error("Failed to fetch service reviews:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore query fallback:", e);
    }
  }, [service?.id]);

  // Combined Reviews
  const combinedReviews = useMemo(() => {
    const defaultReviews = [
      { id: 'rev-1', userId: 'usr-1', userName: 'Ahasanul Kabir', rating: 5, comment: 'WebzoneBD team executed our project flawlessly. Code structure is extremely clean and fast.', createdAt: '2026-07-10', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', approved: true },
      { id: 'rev-2', userId: 'usr-2', userName: 'Sabbir Rahman', rating: 5, comment: 'Incredible page speeds. Delivered right on schedule. Best IT agency in Bangladesh.', createdAt: '2026-07-05', userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', approved: true },
      { id: 'rev-3', userId: 'usr-3', userName: 'Khalid Bin Mansoor', rating: 5, comment: 'Great Arabic RTL support and payment gateway integration. Highly recommended!', createdAt: '2026-06-28', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', approved: true }
    ];
    return [...firestoreReviews, ...defaultReviews];
  }, [firestoreReviews]);

  // Top Thumbnail Carousel & Image Zoom States
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  // Dynamic gallery images
  const galleryImages = useMemo(() => {
    if (!service) return ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'];
    if (service.galleryImages && Array.isArray(service.galleryImages) && service.galleryImages.length > 0) {
      return service.galleryImages;
    }
    const main = service.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
    const catLower = (service.category || '').toLowerCase();

    let defaults = [
      main,
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80'
    ];

    if (catLower.includes('web') || catLower.includes('development') || catLower.includes('site')) {
      defaults = [
        main,
        'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
      ];
    } else if (catLower.includes('e-commerce') || catLower.includes('ecommerce') || catLower.includes('store') || catLower.includes('shop')) {
      defaults = [
        main,
        'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80'
      ];
    } else if (catLower.includes('app') || catLower.includes('mobile') || catLower.includes('software') || catLower.includes('saas') || catLower.includes('script')) {
      defaults = [
        main,
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    return defaults;
  }, [service.image, service.galleryImages, service.category]);

  // Auto-rotate images when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length, isHovered]);

  // Handle Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  // Category Information Generator
  const categoryInfo = useMemo(() => {
    const cat = (service.category || 'Web Development').toLowerCase();

    if (cat.includes('web') || cat.includes('development') || cat.includes('site')) {
      return {
        name: 'Web Development & Custom Systems',
        nameBn: 'ওয়েব ডেভেলপমেন্ট ও কাস্টম সিস্টেমস',
        icon: '🌐',
        description: 'High-performance, scalable web application development utilizing modern frontend frameworks (React, Vite, Next.js) and secure cloud backend APIs.',
        descriptionBn: 'আধুনিক ফ্রন্টএন্ড ফ্রেমওয়ার্ক (React, Next.js, Vite) এবং সুরক্ষিত ক্লাউড ব্যাকএন্ড দিয়ে নির্মিত হাই-পারফরম্যান্স ওয়েবাসাইট ও কাস্টম ওয়েব অ্যাপ।',
        features: [
          'Responsive Mobile-First Architecture',
          'SEO-Ready Semantic Code Structure',
          'Ultra-fast load time (Lighthouse 95+)',
          'Custom Admin Control Dashboard'
        ],
        featuresBn: [
          'সম্পূর্ণ মোবাইল-রেসপন্সিভ লেআউট',
          'এসইও-বান্ধব কোডিং স্ট্রাকচার',
          'সুপার-ফাস্ট লোডিং স্পিড (৯৫+ স্কোর)',
          'কাস্টম এডমিন কন্ট্রোল প্যানেল'
        ],
        techStack: 'React 19, Tailwind CSS v4, Node.js / PHP 8.2, MySQL / PostgreSQL',
        deliverables: '100% Full Source Code, Server Deployment, 1-Year SSL & Hosting Support',
        deliverablesBn: '১০০% ফুল সোর্স কোড, সার্ভার সেটআপ, ১ বছরের ফ্রি এসএসএল ও হোস্টিং সহায়তা',
        target: 'Startups, E-Commerce Stores, Corporate Agencies, & Local Businesses',
        targetBn: 'স্টার্টআপ, ই-কমার্স ব্র্যান্ড, কর্পোরেট এজেন্সি ও স্থানীয় ব্যবসা'
      };
    }

    if (cat.includes('e-commerce') || cat.includes('ecommerce') || cat.includes('store') || cat.includes('shop')) {
      return {
        name: 'E-Commerce & Digital Store Solutions',
        nameBn: 'ই-কমার্স ও ডিজিটাল স্টোর সলিউশন',
        icon: '🛒',
        description: 'End-to-end online shopping portals with instant payment gateway integrations (bKash, Nagad, SSLCommerz, Stripe), inventory engine, and order management.',
        descriptionBn: 'বিকাশ, নগদ, রকেট, কার্ড পেমেন্ট গেটওয়ে, ইনভেন্টরি ম্যানেজমেন্ট ও ইনস্ট্যান্ট অর্ডার ট্র্যাকিং সমৃদ্ধ পূর্ণাঙ্গ ই-কমার্স অনলাইন শপ।',
        features: [
          'Multi-Payment Gateway Integration',
          'Automated Invoice & SMS Notifications',
          'Stock & Inventory Control Engine',
          'Customer Coupon & Discount System'
        ],
        featuresBn: [
          'বিকাশ/নগদ/কার্ড পেমেন্ট গেটওয়ে',
          'অটোমেটেড ইনভয়েস ও এসএমএস এলার্ট',
          'স্টক ও স্টক ট্র্যাকিং প্যানেল',
          'ডিসকাউন্ট কুপন ও প্রমোশনাল কোড'
        ],
        techStack: 'WooCommerce, Laravel, React E-Com Engine, RESTful APIs',
        deliverables: 'Ready E-Commerce Store, Payment Gateway Config, Product Upload Suite',
        deliverablesBn: 'রেডি ই-কমার্স সাইট, পেমেন্ট গেটওয়ে কনফিগারেশন ও প্রোডাক্ট আপলোড গাইড',
        target: 'Online Merchants, Fashion Brands, Wholesale Outlets, Digital Sellers',
        targetBn: 'অনলাইন মার্চেন্ট, ফ্যাশন ও রিটেইল ব্র্যান্ড, ডিজিটাল পণ্য বিক্রেতা'
      };
    }

    return {
      name: 'Software, Mobile Apps & SaaS Scripts',
      nameBn: 'সফটওয়্যার, মোবাইল অ্যাপ ও সোর্স কোড',
      icon: '⚡',
      description: 'Custom SaaS platform engineering, Android/iOS App creation, and ready-to-deploy verified PHP/Node source code scripts for business automation.',
      descriptionBn: 'কাস্টম স্যাস (SaaS) প্ল্যাটফর্ম, অ্যান্ড্রয়েড/আইওএস মোবাইল অ্যাপস এবং ব্যবসায়ী অটোমেশনের জন্য ভেরিফাইড সোর্স কোড স্ক্রিপ্ট।',
      features: [
        'Modular Clean Code Architecture',
        'Unlimited Domain Licensing (100% GPL)',
        'REST API & Webhook Endpoints',
        'Real-time Notifications & Analytics'
      ],
      featuresBn: [
        'মডুলার ক্লিন কোড আর্কিটেকচার',
        'আনলিমিটেড ডোমেইন ব্যবহার লাইসেন্স',
        'রেস্ট এপিআই (REST API) ইন্টিগ্রেশন',
        'রিয়েল-টাইম পুশ নোটিফিকেশন'
      ],
      techStack: 'Flutter, React Native, PHP 8.2, Express.js, Firebase, Docker',
      deliverables: 'Full Source Code Repository, APK/IPA Bundles, Installation Documentation',
      deliverablesBn: 'সম্পূর্ণ সোর্স কোড, অ্যান্ড্রয়েড অ্যাপ ফাইল (APK), ইন্সটলেশন গাইডলাইন',
      target: 'SaaS Owners, App Entrepreneurs, Freelancers, Software Resellers',
      targetBn: 'স্যাস বা অ্যাপ উদ্যোক্তা, ফ্রিল্যান্সার ও সফটওয়্যার রিসেলার'
    };
  }, [service.category]);

  // Related category services
  const categoryServices = useMemo(() => {
    return allServices.filter(s => s.id !== service.id && s.category === service.category).slice(0, 3);
  }, [allServices, service.id, service.category]);

  // Pricing tiers
  const pricingTiers = {
    starter: {
      name: language === 'bn' ? 'স্টার্টার প্যাক' : 'Starter MVP Standard',
      price: service.startingPrice || 150,
      delivery: '3-5 Days',
      support: '30 Days SLA Support',
      revisions: '3 Free Revisions',
      features: [
        'Essential UX Page Layout',
        'Fully Responsive Mobile-First Design',
        'Standard Performance Caching',
        'Contact Form Integration',
        'Basic SEO Meta Tag Setup'
      ]
    },
    professional: {
      name: language === 'bn' ? 'প্রফেশনাল প্যাক' : 'Professional Growth',
      price: service.businessPrice || service.professionalPrice || Math.round((service.startingPrice || 150) * 1.3),
      delivery: '7-10 Days',
      support: '180 Days VIP Support',
      revisions: 'Unlimited Revisions',
      features: [
        'Premium Custom Creative Layouts',
        'Optimized Content Cluster / SEO Ready',
        'Full Admin Control Dashboard Panel',
        'WhatsApp & SMS Alert Triggers',
        'Speed optimization score 90+ (Lighthouse)',
        '1 Year Safe NVMe Web Hosting'
      ]
    },
    business: {
      name: language === 'bn' ? 'বিজনেস প্যাক' : 'Enterprise Scale SaaS',
      price: service.enterprisePrice || Math.round((service.startingPrice || 150) * 2.2),
      delivery: '14-20 Days',
      support: '365 Days Dev SLA Line Support',
      revisions: 'Lifetime Custom Revisions',
      features: [
        'Custom Web App Built From Scratch',
        'Multiple Payment Gateways (bKash/SSL/Stripe)',
        'Full Database Schema Backups',
        'API Proxy Routes Integration',
        'Lighthouse Speed score 98+ Guaranteed',
        'Android WebApp Wrapper APK included'
      ]
    }
  };

  const getFormatPrice = (val: number) => {
    const rate = currency === 'BDT' ? 115 : currency === 'SAR' ? 3.75 : 1;
    const symbol = currency === 'BDT' ? '৳' : currency === 'SAR' ? 'SAR ' : '$';
    return `${symbol}${Math.round(val * rate).toLocaleString()}`;
  };

  const overviewFeatures = [
    { id: 'perf', title: 'Fast Performance', icon: <Sparkles className="w-5 h-5 text-[#00E5FF]" />, desc: 'Page load times below 1.2 seconds with server-side compression & optimized state engine.' },
    { id: 'resp', title: 'Mobile Responsive', icon: <Layers className="w-5 h-5 text-[#3B82F6]" />, desc: 'Fluid layout adjustments with touch target compliance for all current smartphones.' },
    { id: 'seo', title: 'SEO Optimized', icon: <Award className="w-5 h-5 text-[#7C3AED]" />, desc: 'Valid semantic HTML tags, Google Search Console pre-indexing, mapping schemas, and speed boosts.' },
    { id: 'sec', title: 'Secure & Reliable', icon: <ShieldCheck className="w-5 h-5 text-[#EC4899]" />, desc: 'Hardened against custom SQL injection, Cross-Site Scripting (XSS), and automated crawlers.' }
  ];

  const timelineSteps = [
    { title: 'Requirements Collection', desc: 'Detailed consultation to aggregate targeted brand guidelines & scope specs.' },
    { title: 'Planning & Analysis', desc: 'Defining database architectures, route indices, and framework layout blueprints.' },
    { title: 'UI/UX Design', desc: 'Crafting pixel-perfect interactive high-fidelity Figma styles with color guides.' },
    { title: 'Development', desc: 'Active secure backend and frontend assembly utilizing React 19 + Fast Modules.' },
    { title: 'Internal Testing', desc: 'Rigorous isolated unit script reviews, responsiveness validation, and broken link scans.' },
    { title: 'Quality Assurance', desc: 'Lighthouse speed threshold audits, cross-browser caching validation, security checks.' },
    { title: 'Client Review', desc: 'Deploying to staging server for dynamic customer feedback and visual tweaks.' },
    { title: 'Final Delivery', desc: 'Packaging all GPL codebase, source vector SVG assets, or production cloud push.' },
    { title: 'Project Completion', desc: '100% complete handover with step-by-step custom admin video training guides.' }
  ];

  // FAQ List
  const faqItems = [
    { q: 'How long does the average service delivery take?', a: 'Standard Starter MVP layouts take 3 to 5 days, while complex custom web portal integrations usually run between 7 and 14 business days.' },
    { q: 'Can I request visual code revisions or tweaks?', a: 'Absolutely! Our standard professional tiers authorize unlimited revisions until the preliminary mockups completely satisfy your visual specifications.' },
    { q: 'Is high-performance web hosting and SSL included?', a: 'Yes! Selected Professional and Business models include 1 full year of fast non-volatile SSD cloud hosting alongside automatic SSL renewals.' },
    { q: 'Do you provide full admin dashboard code?', a: 'Yes, we design straightforward dashboards providing customer control nodes enabling product uploads or sitemap editing without coding knowledge.' },
    { q: 'What payment options are accepted for advance?', a: 'We support bKash, Nagad, Rocket, Upay, Bank Wire transfer, as well as Visa/Mastercard cards through SSLCommerz/Stripe.' },
    { q: 'Is source code provided after completion?', a: 'Yes, 100% full unencrypted source code (React, Node, PHP) is handed over upon final sign-off.' }
  ];

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqItems;
    return faqItems.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()));
  }, [faqSearch]);

  // Submit Order / Checkout
  const handleOrderSubmit = () => {
    const selectedTier = pricingTiers[activePackageTab];
    const calculatedAdvance = Math.round(selectedTier.price * (advancePercent / 100));
    const calculatedDue = selectedTier.price - calculatedAdvance;
    
    // Log order
    const orderDetails: Order = {
      id: 'ord-wb-' + Math.floor(100000 + Math.random() * 900000),
      serviceId: service.id,
      itemTitle: `${service.title} (${selectedTier.name})`,
      price: selectedTier.price,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Instant Secure Check',
      paymentStatus: 'pending',
      advancePercent: advancePercent,
      advanceAmount: calculatedAdvance,
      dueAmount: calculatedDue
    };
    addSimulatedServiceOrder(orderDetails);

    if (addToCart) {
      const packageProductRepresentation = {
        id: `srv-${service.id}-${activePackageTab}`,
        name: `${service.title} (${selectedTier.name})`,
        nameBn: `${service.titleBn || service.title} (${selectedTier.name})`,
        category: 'source',
        price: selectedTier.price,
        rating: service.rating || 5.0,
        reviewsCount: service.projectsCompleted || 100,
        description: service.shortDescription,
        descriptionBn: service.shortDescriptionBn || service.shortDescription,
        features: selectedTier.features,
        image: service.image,
        demoUrl: 'https://demo.webzonebd.com',
        downloadUrl: 'https://webzonebd.com',
        tags: [service.category || 'Service'],
        advancePercent: advancePercent,
        advanceAmount: calculatedAdvance,
        dueAmount: calculatedDue
      };

      addToCart(packageProductRepresentation);

      if (setCartOpen) {
        setCartOpen(true);
      }
    } else {
      setIsPaymentModalOpen(true);
      setPaymentStep(1);
    }
  };

  // Review Submit Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      triggerToast(language === 'bn' ? 'অনুগ্রহ করে মতামত টাইপ করুন' : 'Please type a comment');
      return;
    }

    const reviewObj = {
      productId: service.id,
      userId: user?.id || 'usr-' + Date.now(),
      userName: reviewerName || 'Verified Client',
      rating: newRating,
      comment: newComment,
      createdAt: new Date().toISOString().split('T')[0],
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      approved: true,
      reviewImage: uploadedReviewImage || undefined
    };

    try {
      await addDoc(collection(db, 'store_reviews'), reviewObj);
      triggerToast(language === 'bn' ? '🎉 রিভিউ সফলভাবে পাবলিক করা হয়েছে!' : '🎉 Review submitted & published!');
    } catch (err) {
      console.warn("Saving review to local list fallback:", err);
      setFirestoreReviews(prev => [reviewObj, ...prev]);
      triggerToast(language === 'bn' ? '🎉 আপনার রিভিউ যোগ করা হয়েছে!' : '🎉 Review added successfully!');
    }

    setNewComment('');
    setUploadedReviewImage(null);
  };

  // Handle Review Image Upload
  const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Verification process simulation
  const startVerificationProcess = () => {
    if (!senderNumber || !transactionId) {
      triggerToast("⚠️ Please fill in all payment details first.");
      return;
    }
    setPaymentStep(3);
    setVerificationProgress(10);
    
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const selectedTier = pricingTiers[activePackageTab];
          const calculatedAdvance = Math.round(selectedTier.price * (advancePercent / 100));

          const mockOrderObj: Order = {
            id: `ord-srv-${Math.floor(100000 + Math.random() * 900000)}`,
            serviceId: service.id,
            itemTitle: `${service.title} (${selectedTier.name})`,
            price: selectedTier.price,
            date: new Date().toISOString().split('T')[0],
            paymentMethod: selectedGateway,
            paymentStatus: 'completed',
            advancePercent: advancePercent,
            advanceAmount: calculatedAdvance,
            dueAmount: selectedTier.price - calculatedAdvance
          };

          addSimulatedServiceOrder(mockOrderObj);
          triggerToast("🎉 SUCCESS! Ledger verified! Your service project workspace is activated.");
          return 100;
        }
        return prev + 15;
      });
    }, 600);
  };

  // Consultation Callback submit
  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName || !consultPhone) {
      triggerToast('Please provide your name and contact mobile.');
      return;
    }
    triggerToast('Appointment scheduled! An agent will call you within 15 minutes.');
    setIsConsultationModalOpen(false);
    setConsultName('');
    setConsultPhone('');
  };

  // Share Handlers
  const handleCopyLink = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    navigator.clipboard.writeText(shareUrl);
    triggerToast(language === 'bn' ? "📋 পেজ লিংক কপি করা হয়েছে!" : "📋 Page link copied to clipboard!");
  };

  const handleFacebookShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(service.title)}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(service.title + ' ' + shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative min-h-screen pb-20 select-none overflow-hidden font-sans transition-colors duration-300 ${isDark ? 'bg-[#020617] text-white' : 'bg-slate-50 text-neutral-800'}`}>
      
      {/* 1. ANIMATED GRADIENT MESH BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-radial from-[#7C3AED]/25 via-transparent to-transparent blur-3xl opacity-60 animate-pulse duration-[10s]" />
        <div className="absolute -right-[20%] top-[10%] w-[70%] h-[70%] rounded-full bg-radial from-[#00E5FF]/20 via-transparent to-transparent blur-3xl opacity-50" />
        <div className="absolute left-[10%] bottom-[10%] w-[60%] h-[60%] rounded-full bg-radial from-[#EC4899]/15 via-transparent to-transparent blur-3xl opacity-40 animate-pulse duration-[8s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* ========================================= BREADCRUMB & HEADER BAR ========================================= */}
        <div className={`flex flex-wrap items-center justify-between mb-6 text-xs font-mono select-none backdrop-blur-md border p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-900/40 border-slate-800/40' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className={`group flex items-center gap-1.5 hover:underline cursor-pointer font-bold transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{language === 'bn' ? 'সকল সার্ভিস' : 'All Services'}</span>
            </button>
            <span className={`${isDark ? 'text-slate-600' : 'text-neutral-400'}`}>/</span>
            <span className={`${isDark ? 'text-slate-400' : 'text-neutral-500'} hidden sm:inline`}>{service.category || 'IT Services'}</span>
            <span className={`${isDark ? 'text-slate-600' : 'text-neutral-400'} hidden sm:inline`}>/</span>
            <span className={`${isDark ? 'text-slate-200' : 'text-neutral-800'} font-black truncate max-w-xs`}>{service.title}</span>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => {
                setIsFavorite(!isFavorite);
                triggerToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
              }}
              className={`p-2 rounded-xl border transition cursor-pointer ${isFavorite ? 'bg-pink-500/20 border-pink-500/40 text-pink-400' : isDark ? 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white' : 'border-slate-200 bg-slate-100 text-slate-600'}`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>

            <button
              onClick={() => setShowSharePanel(!showSharePanel)}
              className={`p-2 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${isDark ? 'border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-[#00E5FF]/40' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Share2 className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
            </button>

            <span className="bg-[#00E5FF]/10 text-[#00E5FF] font-black px-2.5 py-1 rounded-xl text-[9px] tracking-wider uppercase border border-[#00E5FF]/20">
              Verified SLA
            </span>
          </div>
        </div>

        {/* Share Panel Popup */}
        <AnimatePresence>
          {showSharePanel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border mb-6 backdrop-blur-xl space-y-3 ${isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-lg'}`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-slate-800/40">
                <span className="text-xs font-bold font-mono text-[#00E5FF]">Share Service Page</span>
                <button onClick={() => setShowSharePanel(false)} className="text-slate-400 hover:text-white text-xs font-bold">✕</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={handleFacebookShare} className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-bold flex flex-col items-center gap-1 hover:bg-blue-500/20 cursor-pointer">
                  <Facebook className="w-4 h-4 fill-current" />
                  <span className="text-[9px]">Facebook</span>
                </button>
                <button onClick={handleTwitterShare} className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-bold flex flex-col items-center gap-1 hover:bg-slate-700 cursor-pointer">
                  <Twitter className="w-4 h-4 fill-current" />
                  <span className="text-[9px]">Twitter</span>
                </button>
                <button onClick={handleWhatsAppShare} className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-bold flex flex-col items-center gap-1 hover:bg-emerald-500/20 cursor-pointer">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span className="text-[9px]">WhatsApp</span>
                </button>
                <button onClick={handleCopyLink} className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs font-bold flex flex-col items-center gap-1 hover:bg-purple-500/20 cursor-pointer">
                  <Copy className="w-4 h-4" />
                  <span className="text-[9px]">Copy Link</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTAINER GRID: Dynamic Left Content Frame (Col 8) & Sticky Desktop Sidebar on Right (Col 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA CONTAINER (8 Columns max width) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ========================================= TOP HERO & GALLERY SECTION ========================================= */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left 7 Columns: Animated Image Carousel & Zoom */}
              <div className="md:col-span-7 space-y-3">
                <div 
                  className={`relative aspect-video rounded-3xl overflow-hidden group cursor-zoom-in border transition-all ${
                    isDark ? 'bg-slate-950 border-white/10 shadow-2xl' : 'bg-slate-100 border-slate-200 shadow-md'
                  }`}
                  onMouseMove={(e) => {
                    setIsHovered(true);
                    handleMouseMove(e);
                  }}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    handleMouseLeave();
                  }}
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.img
                      key={activeImageIdx}
                      src={galleryImages[activeImageIdx]}
                      alt={service.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full h-full object-cover absolute inset-0"
                      style={zoomStyle}
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-[9.5px] tracking-widest font-mono font-extrabold uppercase rounded-lg shadow-lg text-white border border-white/10">
                      {service.category || 'IT SERVICE'}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] tracking-wide font-black uppercase rounded-lg shadow-lg flex items-center gap-1 font-mono">
                      <Star className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                      <span>{service.rating || '4.9'} VERIFIED</span>
                    </span>
                  </div>

                  {/* Indicator overlay */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-[10px] text-slate-300 rounded-lg border border-white/10 font-mono pointer-events-none group-hover:opacity-0 transition-opacity z-10">
                    🔍 Hover to zoom preview
                  </div>
                </div>

                {/* Thumbnails Row */}
                <div className="grid grid-cols-4 gap-2.5">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        activeImageIdx === idx 
                          ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/30 scale-[1.02]' 
                          : isDark ? 'border-white/10 opacity-60 hover:opacity-100' : 'border-slate-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>

                {/* Live Demo & Video Preview Trigger Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://demo.webzonebd.com"
                    target="_blank"
                    rel="noreferrer"
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${isDark ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Staging Demo</span>
                  </a>
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${isDark ? 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20' : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Video Walkthrough</span>
                  </button>
                </div>
              </div>

              {/* Right 5 Columns: Service Title & Quick Highlights */}
              <div className={`p-6 rounded-3xl border text-left space-y-4 backdrop-blur-xl shadow-2xl transition-all ${isDark ? 'border-white/10 bg-slate-950/40' : 'border-neutral-200 bg-white shadow-sm'}`}>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00E5FF]">
                    {categoryInfo.name}
                  </span>

                  <h1 className={`text-2xl sm:text-3xl font-black tracking-tight font-display transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'bn' ? service.titleBn || service.title : service.title}
                  </h1>

                  <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {language === 'bn' ? service.shortDescriptionBn || service.shortDescription : service.shortDescription}
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <div className={`p-2.5 rounded-xl border space-y-0.5 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[9px] text-slate-400 block uppercase">Starting</span>
                    <span className={`text-sm font-black ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>{getFormatPrice(service.startingPrice || 150)}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border space-y-0.5 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[9px] text-slate-400 block uppercase">Delivery SLA</span>
                    <span className={`text-sm font-black ${isDark ? 'text-[#3B82F6]' : 'text-indigo-600'}`}>{service.deliveryDays || '7'} Days</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border space-y-0.5 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[9px] text-slate-400 block uppercase">Completed</span>
                    <span className={`text-sm font-black ${isDark ? 'text-[#EC4899]' : 'text-pink-600'}`}>{service.projectsCompleted || '350'}+</span>
                  </div>
                </div>

                {/* Conversion Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={handleOrderSubmit}
                    className="w-full py-3 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:opacity-95 text-xs text-white font-black rounded-xl text-center active:scale-95 transition cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    🚀 Order Service ({getFormatPrice(service.startingPrice || 150)})
                  </button>

                  <a 
                    href={`https://wa.me/966570511931?text=Hello%20WebzoneBD%2C%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full py-2.5 px-4 rounded-xl border transition-colors text-xs font-black flex items-center justify-center gap-1.5 ${isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Instant WhatsApp Consultation</span>
                  </a>
                </div>
              </div>

            </div>

            {/* LIMITED TIME SPECIAL OFFER BANNER */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-left font-mono ${isDark ? 'bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border-purple-500/30' : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-purple-200'}`}>
              <div className="flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-pink-500 animate-bounce" />
                <div>
                  <p className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    🎁 Special Service Discount SLA Offer
                  </p>
                  <p className="text-[10px] text-slate-400">Get free 1-year NVMe SSD hosting & SSL certificate included with every order!</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-pink-500/30 text-pink-400 font-bold text-xs">
                <span>⏱️ Offer Ends:</span>
                <span className="font-mono text-white">{timer.hours}:{timer.minutes}:{timer.seconds}</span>
              </div>
            </div>

            {/* ========================================= TABBED NAVIGATION CONTENT BAR ========================================= */}
            <div className="space-y-6">
              <div className={`flex border-b overflow-x-auto no-scrollbar rounded-2xl p-1 backdrop-blur-md ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
                {[
                  { id: 'overview', label: language === 'bn' ? 'ওভারভিউ ও বিবরণ' : 'Overview & Blueprint' },
                  { id: 'features', label: language === 'bn' ? 'ফিচারসমূহ' : 'Full Features' },
                  { id: 'specifications', label: language === 'bn' ? 'টেক স্পেক্স' : 'Tech Specs' },
                  { id: 'timeline', label: language === 'bn' ? 'রোডম্যাপ' : 'Interactive Roadmap' },
                  { id: 'reviews', label: `Reviews (${combinedReviews.length})` },
                  { id: 'faq', label: 'FAQ' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setActiveTab(tb.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      activeTab === tb.id 
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-md' 
                        : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Category Info Card */}
                  <div className={`p-6 md:p-8 rounded-3xl border text-left space-y-6 transition-all ${isDark ? 'bg-slate-950/60 border-slate-800/90 shadow-2xl' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/30">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{categoryInfo.icon}</span>
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00E5FF]">
                            {language === 'bn' ? 'ক্যাটাগরি সার্ভিস ইনফরমেশন' : 'SERVICE CATEGORY INFORMATION'}
                          </span>
                        </div>
                        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {language === 'bn' ? categoryInfo.nameBn : categoryInfo.name}
                        </h3>
                      </div>
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold font-mono rounded-full">
                        {service.category || 'General Category'}
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>
                      {language === 'bn' ? categoryInfo.descriptionBn : categoryInfo.description}
                    </p>

                    {/* Key Capabilities */}
                    <div className="space-y-2">
                      <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {language === 'bn' ? 'ক্যাটাগরি মূল বৈশিষ্ট্যসমূহ:' : 'Category Capabilities & Benchmark Features:'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(language === 'bn' ? categoryInfo.featuresBn : categoryInfo.features).map((feat, idx) => (
                          <div key={idx} className={`flex items-start gap-2.5 p-3 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
                            <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Technical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-sans text-xs">
                      <div className={`p-3.5 rounded-2xl border space-y-1 ${isDark ? 'bg-slate-900/30 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Tech Stack</span>
                        <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{categoryInfo.techStack}</p>
                      </div>

                      <div className={`p-3.5 rounded-2xl border space-y-1 ${isDark ? 'bg-slate-900/30 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Deliverables</span>
                        <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {language === 'bn' ? categoryInfo.deliverablesBn : categoryInfo.deliverables}
                        </p>
                      </div>

                      <div className={`p-3.5 rounded-2xl border space-y-1 ${isDark ? 'bg-slate-900/30 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Target Audience</span>
                        <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {language === 'bn' ? categoryInfo.targetBn : categoryInfo.target}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Glass Cards overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {overviewFeatures.map((o) => (
                      <div 
                        key={o.id} 
                        className={`p-5 rounded-2xl border transition-all hover:scale-101 duration-300 group shadow-sm text-left relative ${isDark ? 'bg-slate-900/40 border-slate-800/60 hover:border-[#00E5FF]/30' : 'bg-white border-neutral-200 hover:border-blue-500/30'}`}
                      >
                        <div className={`p-2.5 rounded-xl inline-block mb-3 border transition-colors ${isDark ? 'bg-slate-800/60 border-slate-700/30' : 'bg-slate-50 border-neutral-150'}`}>
                          {o.icon}
                        </div>
                        <h4 className={`font-extrabold text-sm transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>
                          {o.title}
                        </h4>
                        <p className={`text-[11px] leading-relaxed mt-1 transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-600'}`}>{o.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: FEATURES */}
              {activeTab === 'features' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className={`p-6 rounded-3xl border text-left space-y-4 transition-colors ${isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div>
                      <h4 className={`text-sm font-mono font-bold uppercase tracking-widest ${isDark ? 'text-[#EC4899]' : 'text-pink-600'}`}>Full Package Capabilities</h4>
                      <h3 className={`text-base sm:text-lg font-black mt-0.5 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Included Core Features Checklist</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {[
                          'Full Server / Environment Configuration & Setup Support',
                          '100% Unique custom premium layouts with beautiful UX',
                          'Optimized Mobile responsive structure for modern screens',
                          'Baseline on-page SEO keywords indexing mapping',
                          'Social Media communication widget embeds (WhatsApp)',
                          'Modular lightweight compiled codebases in clean packages',
                          'Step-by-step user dashboard walkthrough training videos',
                          'Automated Database Schema Backups & Restore tools',
                          'REST API Proxy Controller Endpoints',
                          'Multi-Language Translation Engine (English, Bangla, Arabic)'
                        ].map((item, idx) => (
                          <div key={idx} className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800/40' : 'bg-slate-50 border-slate-100'}`}>
                            <Check className="w-4 h-4 text-emerald-500 font-black mt-0.5 shrink-0" />
                            <span className={`font-medium font-sans text-xs leading-normal transition-colors ${isDark ? 'text-slate-300' : 'text-neutral-700'}`}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SPECIFICATIONS */}
              {activeTab === 'specifications' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className={`p-6 rounded-3xl border text-left space-y-4 transition-colors ${isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-white border-neutral-200'}`}>
                    <div>
                      <h4 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>TECHNICAL SPECS & COMPATIBILITY SHEET</h4>
                      <h3 className={`text-base font-black mt-0.5 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Detailed Codebase Core Characteristics</h3>
                    </div>

                    <div className={`border rounded-2xl overflow-hidden text-xs mt-3 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      {[
                        { k: 'Server Engine', v: 'NodeJS Express compiled with Bun / PHP 8.2+ OOP' },
                        { k: 'UI Stack', v: 'React 19, Vite, Tailwind CSS v4' },
                        { k: 'Database Client', v: 'PostgreSQL or MySQL configured with Drizzle ORM' },
                        { k: 'License Status', v: 'GPL 100% Open Source (Self-Owned Unlimited Resell)' },
                        { k: 'Setup Script', v: 'cPanel / Cloud Run Git Integration Auto-Deploy script included' },
                        { k: 'Core Audits', v: 'SQL Injection Proof, CSRF guards, Schema.org pre-indexed' },
                        { k: 'SSL & Domain', v: 'Free 1-Year SSL & High-Speed NVMe SSD Cloud Hosting' }
                      ].map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`grid grid-cols-5 p-3 px-4 transition-colors border-b last:border-0 ${idx % 2 === 0 ? (isDark ? 'bg-slate-900/20' : 'bg-slate-50/50') : ''} ${isDark ? 'border-slate-800/40' : 'border-slate-200'}`}
                        >
                          <span className="col-span-2 font-bold text-[10.5px] text-slate-400 tracking-wide font-mono uppercase">{item.k}</span>
                          <span className={`col-span-3 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ROADMAP */}
              {activeTab === 'timeline' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className={`p-6 rounded-3xl border text-left space-y-6 transition-colors ${isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-white border-neutral-200'}`}>
                    <div className="space-y-1">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>Quality Assurance Timelines</span>
                      <h3 className={`text-base sm:text-lg font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Interactive 9-Stage Deployment Roadmap</h3>
                    </div>

                    <div className="relative pt-2 pb-1">
                      <div className="absolute top-5 left-2 right-2 h-1.5 bg-slate-800 rounded-full z-0" />
                      <div 
                        className="absolute top-5 left-2 h-1.5 bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7C3AED] rounded-full z-0 transition-all duration-500"
                        style={{ width: `${(currentTimelineStep / 8) * 100}%` }}
                      />

                      <div className="relative flex justify-between z-10">
                        {timelineSteps.map((step, idx) => {
                          const isPassed = idx <= currentTimelineStep;
                          const isActive = idx === currentTimelineStep;
                          return (
                            <button
                              key={idx}
                              onClick={() => setCurrentTimelineStep(idx)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all cursor-pointer ${isActive ? 'bg-[#00E5FF] text-slate-950 scale-115 ring-4 ring-cyan-500/25 shadow-[0_0_12px_#00E5FF]' : isPassed ? 'bg-gradient-to-tr from-[#3B82F6] to-[#7C3AED] text-white' : `${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-neutral-600'}`}`}
                              title={step.title}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-neutral-150'}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cyan-400/10 text-cyan-500 rounded-md border border-cyan-400/20">Stage 0{currentTimelineStep + 1}</span>
                        <h4 className={`font-black text-sm transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{timelineSteps[currentTimelineStep].title}</h4>
                      </div>
                      <p className={`text-xs font-sans leading-relaxed transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-650'}`}>{timelineSteps[currentTimelineStep].desc}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Rating Summary */}
                  <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center gap-6 text-left ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="text-center md:text-left space-y-1 md:pr-8 md:border-r border-slate-800/40">
                      <span className="text-4xl font-black text-amber-500 font-mono">4.95</span>
                      <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 stroke-none" />)}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">Based on {combinedReviews.length} client reviews</p>
                    </div>

                    <div className="flex-1 space-y-1.5 w-full text-xs font-mono">
                      {[5, 4, 3, 2, 1].map((st) => (
                        <div key={st} className="flex items-center gap-2">
                          <span className="w-3 text-slate-400 text-[10px]">{st}★</span>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: st === 5 ? '92%' : st === 4 ? '8%' : '0%' }} />
                          </div>
                          <span className="w-8 text-[9px] text-slate-400 text-right">{st === 5 ? '92%' : st === 4 ? '8%' : '0%'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Review Form */}
                  <form onSubmit={handleReviewSubmit} className={`p-6 rounded-3xl border space-y-4 text-left ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Write a Client Review</h4>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">Rating:</span>
                      <div className="flex items-center gap-1 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewRating(s)}
                            className="p-0.5 hover:scale-110 transition cursor-pointer"
                          >
                            <Star className={`w-5 h-5 ${s <= newRating ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name / Agency Name"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleReviewImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer w-full justify-center ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadedReviewImage ? 'Change Image' : 'Attach Screenshot'}</span>
                        </button>
                      </div>
                    </div>

                    {uploadedReviewImage && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
                        <img src={uploadedReviewImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedReviewImage(null)}
                          className="absolute top-1 right-1 p-0.5 bg-slate-950/80 rounded-full text-white text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    <textarea
                      rows={3}
                      placeholder="Share your experience working with WebzoneBD on this service project..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className={`w-full p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />

                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl hover:opacity-95 transition cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>

                  {/* Review List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {combinedReviews.map((rev, i) => (
                      <div key={rev.id || i} className={`p-5 rounded-2xl border space-y-3 relative text-left transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(rev.rating || 5)].map((_, iStar) => <Star key={iStar} className="w-3 h-3 fill-amber-500 stroke-none" />)}
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Verified Client</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed italic transition-colors ${isDark ? 'text-slate-300' : 'text-neutral-650'}`}>"{rev.comment}"</p>
                        
                        {rev.reviewImage && (
                          <div className="rounded-xl overflow-hidden max-h-36 border border-slate-800">
                            <img src={rev.reviewImage} alt="Review attachment" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className={`flex items-center gap-2.5 pt-1.5 border-t transition-colors ${isDark ? 'border-slate-800/40' : 'border-neutral-150'}`}>
                          <img src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} alt="review avatar" className="w-8 h-8 rounded-full object-cover border border-slate-750 shrink-0" referrerPolicy="no-referrer" />
                          <div>
                            <p className={`text-[11px] font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{rev.userName}</p>
                            <span className={`text-[9.5px] font-mono block leading-none transition-colors ${isDark ? 'text-slate-500' : 'text-slate-505'}`}>{rev.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className={`p-4 rounded-2xl border flex items-center gap-2 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search questions about this service..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2.5">
                    {filteredFaqs.map((faq, i) => {
                      const isOpen = openFaqIdx === i;
                      return (
                        <div key={i} className={`border rounded-xl overflow-hidden text-left transition-colors ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-neutral-200 bg-slate-50'}`}>
                          <button
                            onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                            className={`w-full p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-100'}`}
                          >
                            <span className={`text-xs font-bold pr-2 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{faq.q}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-[#00E5FF] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                          </button>
                          
                          {isOpen && (
                            <div className={`p-3.5 border-t text-xs leading-relaxed font-sans transition-colors ${isDark ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-100/50 border-neutral-200 text-neutral-600'}`}>
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RELATED SERVICES CAROUSEL */}
            <div className="space-y-4 text-left pt-4">
              <h3 className={`text-base sm:text-lg font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Cross-Connected Digital Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allServices.filter(s => s.id !== service.id).slice(0, 4).map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => {
                      onNavigateToService(s.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-3 border rounded-xl cursor-pointer flex items-center justify-between gap-3 transition group ${isDark ? 'bg-slate-900/40 hover:bg-slate-900 border-slate-800' : 'bg-white hover:bg-slate-50 border-neutral-200 shadow-xs'}`}
                  >
                    <div className="min-w-0">
                      <p className={`text-xs font-black transition group-hover:text-blue-600 ${isDark ? 'text-white hover:text-[#00E5FF]' : 'text-slate-800'}`}>{s.title}</p>
                      <p className={`text-[10px] font-mono mt-0.5 transition-colors ${isDark ? 'text-slate-400' : 'text-neutral-500'}`}>EST. Starting {getFormatPrice(s.startingPrice || 150)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition shrink-0" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ========================================= STICKY ORDER DESKTOP SIDEBAR (4 Columns width) ========================================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">

            {/* PRICING CONTROL CARD */}
            <div className={`p-5 md:p-6 rounded-3xl border relative overflow-hidden backdrop-blur-md shadow-2xl transition-all text-left ${isDark ? 'bg-slate-950/60 border-slate-800/90 shadow-[#00E5FF]/5' : 'bg-white border-neutral-200'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-transparent to-cyan-500/10 rounded-tr-3xl pointer-events-none" />
              
              {/* Product Badge */}
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-800/80">
                <span className="px-2 py-0.5 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 text-[9px] font-black uppercase font-mono tracking-widest rounded">
                  🎁 VERIFIED SLA ESCROW
                </span>
                <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ 4.95 ({combinedReviews.length} reviews)
                </span>
              </div>

              {/* Package selector tabs inside sidebar */}
              <div className={`grid grid-cols-3 p-1 border rounded-2xl text-[10px] font-black uppercase tracking-wider mt-4 transition-all ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-100 border-neutral-200 shadow-inner'}`}>
                {(['starter', 'professional', 'business'] as const).map((tierKey) => (
                  <button
                    key={tierKey}
                    onClick={() => setActivePackageTab(tierKey)}
                    className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${activePackageTab === tierKey ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md font-extrabold' : `${isDark ? 'text-slate-400 hover:text-white' : 'text-neutral-500 hover:text-slate-800'}`}`}
                  >
                    {tierKey === 'starter' ? 'Starter' : tierKey === 'professional' ? 'Pro' : 'SaaS'}
                  </button>
                ))}
              </div>

              {/* Price section */}
              <div className="py-4 space-y-1 text-left">
                <span className="text-[9.5px] uppercase font-mono text-slate-400 block tracking-widest">{language === 'bn' ? 'অর্ডার এস্টিমেটেড প্রাইস' : 'Estimated Total Price'}</span>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black font-mono tracking-tight transition-colors ${isDark ? 'text-[#00E5FF]' : 'text-blue-650'}`}>
                    {getFormatPrice(pricingTiers[activePackageTab].price)}
                  </span>
                  {activePackageTab === 'professional' && (
                    <span className="text-slate-500 line-through text-xs font-mono">
                      {getFormatPrice(Math.round(pricingTiers[activePackageTab].price * 1.4))}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-emerald-500 font-mono font-semibold flex items-center gap-1">
                  ❇️ {language === 'bn' ? '৮৫% সাশ্রয়ী মূল্যে লাইভ কাস্টম ডেভেলপমেন্ট' : '85% cheaper than dev agencies'}
                </p>
              </div>

              {/* 💳 Advance Payment Option inside Sidebar */}
              <div className={`p-3.5 rounded-2xl border space-y-2.5 my-3 text-left transition-all ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-neutral-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-neutral-800'}`}>
                    {language === 'bn' ? 'অ্যাডভান্স পেমেন্ট অপশন' : 'Advance Payment Option'}
                  </span>
                  <span className="text-[10px] text-pink-500 font-mono font-bold">
                    {language === 'bn' ? 'অগ্রিম নির্বাচন' : 'Select escrow advance'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[30, 50, 100].map((percent) => {
                    const isActive = advancePercent === percent;
                    return (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setAdvancePercent(percent as 30 | 50 | 100)}
                        className={`p-2 rounded-xl border text-center transition-all duration-200 flex flex-col items-center gap-0.5 cursor-pointer ${
                          isActive
                            ? 'border-transparent bg-gradient-to-r from-[#7C3AED]/15 via-[#A855F7]/15 to-[#EC4899]/15 text-[#7C3AED] ring-1 ring-[#7C3AED]/50 font-bold'
                            : isDark
                            ? 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-xs font-black font-mono">{percent}%</span>
                        <span className="text-[9px]">
                          {percent === 100 
                            ? (language === 'bn' ? '১০০% ফুল' : '100% Full Pay') 
                            : (language === 'bn' ? `${percent}% অ্যাডভান্স` : `${percent}% Advance`)
                          }
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-neutral-700'}`}>
                  <span>{language === 'bn' ? 'অগ্রিম প্রদেয়:' : 'Advance Payable:'}</span>
                  <strong className="text-emerald-500 font-black">
                    {getFormatPrice(Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))}
                  </strong>
                </div>
                {advancePercent < 100 && (
                  <div className={`flex items-center justify-between text-[10.5px] font-mono ${isDark ? 'text-slate-400' : 'text-neutral-600'}`}>
                    <span>{language === 'bn' ? 'বকেয়া থাকবে:' : 'Due Remaining:'}</span>
                    <strong className="text-amber-500 font-bold">
                      {getFormatPrice(pricingTiers[activePackageTab].price - Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))}
                    </strong>
                  </div>
                )}
              </div>

              {/* Delivery specifications in Sidebar */}
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2.5 mb-4 transition-colors ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-neutral-150'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10.5px]">SLA DELIVERY:</span>
                  <span className={`font-black ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>{pricingTiers[activePackageTab].delivery}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/20 pt-2">
                  <span className="text-slate-400 text-[10.5px]">REVISIONS:</span>
                  <span className="text-slate-300 font-black">{pricingTiers[activePackageTab].revisions}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/25 pt-2 border-dashed">
                  <span className="text-slate-400 text-[10.5px]">SUPPORT TERM:</span>
                  <span className="text-[#EC4899] font-black">{pricingTiers[activePackageTab].support}</span>
                </div>
              </div>

              {/* Packaging features checklist */}
              <div className="space-y-3 pb-5 border-b border-slate-800/15">
                <span className="text-[9.5px] font-black font-mono text-slate-400 block uppercase tracking-wider">{language === 'bn' ? 'প্যাকেজে অন্তর্ভুক্ত ফিচার সমূহ:' : 'Core Bundle Checklist:'}</span>
                <div className="space-y-2 text-xs">
                  {pricingTiers[activePackageTab].features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span className={`leading-snug transition-colors ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct order checkouts */}
              <div className="pt-5 space-y-2.5">
                <button 
                  onClick={handleOrderSubmit}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-black text-xs uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition-all text-center shadow-lg shadow-purple-500/20 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>🚀 {language === 'bn' ? 'ইনস্ট্যান্ট অর্ডার / চেকআউট' : 'Order Service Now'}</span>
                </button>

                <button 
                  onClick={() => {
                    if (onOrderWhatsApp) {
                      onOrderWhatsApp(service.title, pricingTiers[activePackageTab].name);
                    } else {
                      window.open(`https://wa.me/966570511931?text=Hello%20WebzoneBD%2C%20I%20want%20to%20order%20${encodeURIComponent(service.title)}%20-${pricingTiers[activePackageTab].name}`, '_blank');
                    }
                  }}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition-all text-center border border-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>🟢 {language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'Order via WhatsApp'}</span>
                </button>

                <button 
                  onClick={() => {
                    if (onRequestQuotation) {
                      onRequestQuotation(service.title, pricingTiers[activePackageTab].name);
                    } else {
                      setIsConsultationModalOpen(true);
                    }
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-black text-xs uppercase tracking-wide rounded-xl active:scale-95 transition hover:shadow-lg shadow-blue-500/10 cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>📋 {language === 'bn' ? 'কোটেশন রিকোয়েস্ট' : 'Request Quotation'}</span>
                </button>

                <button 
                  onClick={() => setIsConsultationModalOpen(true)}
                  className={`w-full py-2.5 px-4 rounded-xl border border-dashed text-[11px] font-bold tracking-wide transition-all cursor-pointer text-center ${isDark ? 'border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400' : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700'}`}
                >
                  📞 Request Free 15-Min Callback Call
                </button>
              </div>

              {/* Trust labels */}
              <div className="pt-4 flex justify-center items-center gap-4 text-[9px] font-mono text-slate-400 uppercase border-t border-slate-800/40 mt-4">
                <span className="flex items-center gap-1">🛡️ SSL SECURE</span>
                <span className="text-slate-800">|</span>
                <span className="flex items-center gap-1">❇️ GPL CODE</span>
              </div>
            </div>

            {/* SECURED CLIENT CERTIFICATION STATS */}
            <div className={`p-4 rounded-2xl border text-left space-y-2.5 transition-all ${isDark ? 'bg-slate-900/20 shadow-xl border-slate-800/80' : 'bg-emerald-50/70 border-emerald-150'}`}>
              <div className="flex gap-2 items-start text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div className="space-y-0.5 text-left">
                  <p className={`font-extrabold text-[11.5px] transition-colors ${isDark ? 'text-white' : 'text-emerald-950'}`}>Zero Initial Funding Risk</p>
                  <p className={`text-[10.5px] leading-normal transition-colors ${isDark ? 'text-slate-400' : 'text-emerald-800'}`}>WebzoneBD operates on milestones. Settle subsequent funding tiers only once preliminary wireframes meet approved requirements.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================= MANUAL PAYMENT VERIFICATION MODAL ========================================= */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-left my-8"
            >
              <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-xs font-mono font-black text-white tracking-wider uppercase">Scan & Pay / Instant Ledger Check</span>
                </div>
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {paymentStep === 1 && (
                <div className="p-6 space-y-5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 space-y-1">
                    <p className="font-bold">Ordering: {service.title} ({pricingTiers[activePackageTab].name})</p>
                    <p className="font-mono text-emerald-400">Advance Payable ({advancePercent}%): {getFormatPrice(Math.round(pricingTiers[activePackageTab].price * (advancePercent / 100)))}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Select Payment Gateway</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['bKash Wallet', 'Nagad Merchant', 'Rocket Pay', 'Bank Wire Transfer'].map((gw) => (
                        <button
                          key={gw}
                          type="button"
                          onClick={() => setSelectedGateway(gw)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${selectedGateway === gw ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white font-bold' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'}`}
                        >
                          <Wallet className="w-4 h-4 text-[#00E5FF]" />
                          <span>{gw}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR Graphic */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://webzonebd.com/pay/${encodeURIComponent(selectedGateway)}`} 
                        alt="Payment QR" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] font-mono text-emerald-400 font-bold">
                      {selectedGateway.includes('bKash') ? 'bKash Merchant: 01864000005' : 'Merchant Number: +8801864000005'}
                    </p>
                    <p className="text-[9.5px] text-slate-400">Scan QR Code or send money to above merchant account reference "WEBZONE"</p>
                  </div>

                  <button
                    onClick={() => setPaymentStep(2)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 font-extrabold text-[#020617] uppercase rounded-xl transition cursor-pointer text-xs"
                  >
                    I Have Sent Payment ➔ Enter Transaction Details
                  </button>
                </div>
              )}

              {paymentStep === 2 && (
                <div className="p-6 space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Your Sender Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 01711002233"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full bg-slate-950 text-xs border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Transaction ID (TrxID)</label>
                    <input
                      type="text"
                      placeholder="e.g. BKS982347239"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-slate-950 text-xs border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setPaymentStep(1)}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={startVerificationProcess}
                      className="flex-1 py-3 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] font-extrabold text-white uppercase rounded-xl transition cursor-pointer text-xs"
                    >
                      Verify Ledger Payment
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 3 && (
                <div className="p-8 text-center space-y-5 text-xs">
                  {verificationProgress < 100 ? (
                    <div className="space-y-4">
                      <RefreshCw className="w-12 h-12 text-[#00E5FF] animate-spin mx-auto" />
                      <p className="font-mono text-sm font-bold text-white">Verifying Transaction Ledger...</p>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300" style={{ width: `${verificationProgress}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{verificationProgress}% complete</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                      <h3 className="text-lg font-black text-white">Payment Verified & Project Activated!</h3>
                      <p className="text-slate-300">Your service project workspace has been allocated. Our deployment team will contact you directly on WhatsApp.</p>
                      <button
                        onClick={() => setIsPaymentModalOpen(false)}
                        className="py-3 px-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl cursor-pointer"
                      >
                        Close & Go To Workspace
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= DYNAMIC CONSULTATION SCHEDULER POPUP MODAL ========================================= */}
      <AnimatePresence>
        {isConsultationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-left"
            >
              <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-800">
                <span className="text-xs font-mono font-black text-[#00E5FF] tracking-wider uppercase">📞 Priority Call Callback</span>
                <button 
                  onClick={() => setIsConsultationModalOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConsultSubmit} className="p-5 space-y-4 text-xs text-left">
                <p className="text-slate-400 leading-normal">
                  Provide your name and contact phone or WhatsApp configuration below. A WebzoneBD Lead Business Architect will contact you directly within 15 minutes.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g., Imran Hasan"
                    className="w-full bg-slate-950 text-xs border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    placeholder="e.g., +8801864000005"
                    className="w-full bg-slate-950 text-xs border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 font-extrabold text-[#020617] uppercase rounded-xl transition cursor-pointer text-xs"
                >
                  🚀 Register Callback Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO WALKTHROUGH MODAL */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden border border-slate-800 text-left">
              <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-[#00E5FF]">🎬 Service Interactive Walkthrough Preview</span>
                <button onClick={() => setIsVideoOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs">✕</button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <img src={galleryImages[0]} alt="Video poster" className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <Play className="w-16 h-16 text-[#00E5FF] fill-[#00E5FF]/20 animate-pulse cursor-pointer" />
                  <p className="text-sm font-bold text-white font-mono">Interactive Video Walkthrough & Code Review</p>
                  <p className="text-xs text-slate-400">Clicking play connects to WebzoneBD HD Staging Server</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
