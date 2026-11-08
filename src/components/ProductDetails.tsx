import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { 
  Star, ShoppingCart, ExternalLink, ChevronRight, CheckCircle2, Heart,
  Play, ShoppingBag, Search, Plus, Trash2, ArrowRight, Sparkles, Eye, Tag, 
  Download, Check, X, RefreshCw, Copy, Zap, MessageSquare, Send, User, ShieldCheck,
  Smartphone, BookOpen, Clock, AlertTriangle, Gift, ChevronDown, ChevronUp, AlertCircle,
  HelpCircle, Calendar, FileText, Info, Award, Shield, FileCode, CheckCircle, Upload,
  Share2, ArrowDownToLine, Phone, DollarSign, Wallet, Facebook, Twitter, Instagram, MessageCircle, QrCode
} from 'lucide-react';
import { Product, Language, Theme, Currency, ProductReview } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailsProps {
  product: Product;
  products: Product[];
  language: Language;
  theme: Theme;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  addToCart: (product: Product, eventOrOrigin?: any) => void;
  setCartOpen?: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  triggerToast: (msg: string) => void;
  onBack: () => void;
  onOpenLogin?: () => void;
  user: any;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  currencyRates?: any;
  onViewProduct?: (product: Product) => void;
  onQuickBuy?: (product: Product, eventOrOrigin?: any) => void;
}

export default function ProductDetails({
  product,
  products,
  language,
  theme,
  currency,
  setCurrency,
  addToCart,
  setCartOpen,
  wishlist,
  toggleWishlist,
  triggerToast,
  onBack,
  onOpenLogin,
  user,
  orders,
  setOrders,
  currencyRates,
  onViewProduct,
  onQuickBuy
}: ProductDetailsProps) {

  const isDark = theme === 'dark';

  // -----------------------------------------------------
  // STATES & INTERACTIVITY
  // -----------------------------------------------------
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specifications' | 'installation' | 'changelog'>('description');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
   const [selectedLicense, setSelectedLicense] = useState<'personal' | 'business' | 'developer'>('personal');
  const [advancePercent, setAdvancePercent] = useState<30 | 50 | 100>(100);
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);
  const [showSharePanel, setShowSharePanel] = useState<boolean>(false);
  const [isWishlistPulsing, setIsWishlistPulsing] = useState<boolean>(false);
  
  const [firestoreReviews, setFirestoreReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!product || !product.id) return;
    const q = query(
      collection(db, 'store_reviews'),
      where('productId', '==', product.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setFirestoreReviews(items);
    }, (error) => {
      console.error("Failed to fetch product reviews:", error);
    });
    return () => unsubscribe();
  }, [product?.id]);

  const mergedReviews = useMemo(() => {
    const defaultReviews: ProductReview[] = product.reviews || [
      { id: 'rev-1', userId: 'usr-1', userName: 'Ahasanul Kabir', rating: 5, comment: 'This Laravel script saved me months of work. The multi-vendor dashboard has everything required. Fully optimized codebase.', createdAt: '2026-07-10', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', approved: true },
      { id: 'rev-2', userId: 'usr-2', userName: 'Sabbir Rahman', rating: 5, comment: 'Incredible page speeds. Clean code and beautiful pixel design. High-speed responsive checkout works natively with bKash and SSLCommerz.', createdAt: '2026-07-05', userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', approved: true },
      { id: 'rev-3', userId: 'usr-3', userName: 'Maher Al-Mutairi', rating: 4, comment: 'Awesome translation capability. The Arabic RTL alignment is smooth. Perfect system for our Riyadh digital warehouse projects.', createdAt: '2026-06-28', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', approved: true }
    ];

    // Filter firestore reviews: 
    // Show if approved == true OR
    // Show if the user is the owner of the unapproved review
    const activeFireReviews = firestoreReviews.filter(rev => 
      rev.approved === true || (user && rev.userId === user.id)
    );

    // Combine them, putting new reviews at the top
    return [...activeFireReviews, ...defaultReviews];
  }, [firestoreReviews, user, product.reviews]);

  // Review Form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(user?.name || '');
  const [uploadedReviewImage, setUploadedReviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limited time countdown (Eid / Monsoon Premium Offer) - set to expire in 12 hours from mount
  const [timeLeft, setTimeLeft] = useState<number>(43200); // 12 hours in seconds
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

  // Manual Payment Verification Flow state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1); // 1: Method select, 2: Send payment info & upload voucher, 3: Verifying progress -> Activated!
  const [selectedGateway, setSelectedGateway] = useState<string>('bKash Wallet');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [activeDownloadUrl, setActiveDownloadUrl] = useState<string | null>(null);

  // Dynamic payment QR code configurations
  const [qrMode, setQrMode] = useState<'brand' | 'royal' | 'slate'>('brand');
  const [qrType, setQrType] = useState<'tel' | 'invoice' | 'standard'>('invoice');

  // Video preview modal state
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  // Mega Combo Bonanza States
  const [comboPackage, setComboPackage] = useState<'elite' | 'sovereign'>('elite');
  const [domainName, setDomainName] = useState<string>('');
  const [region, setRegion] = useState<string>('Singapore 🇸🇬');
  const [regionSearch, setRegionSearch] = useState<string>('');
  const [isRegionOpen, setIsRegionOpen] = useState<boolean>(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['white_label']);
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>(user?.email || '');
  const [comboError, setComboError] = useState<string>('');
  const [comboSuccess, setComboSuccess] = useState<boolean>(false);
  const [comboSubmitting, setComboSubmitting] = useState<boolean>(false);

  const getComboPricing = () => {
    const basePrice = product.discountPrice || product.price;
    const packageCost = comboPackage === 'sovereign' ? 129 : 79;
    const packageValue = comboPackage === 'sovereign' ? 250 : 150;
    
    let addonsCost = 0;
    if (selectedAddons.includes('white_label')) addonsCost += 19;
    if (selectedAddons.includes('backup')) addonsCost += 15;
    if (selectedAddons.includes('push')) addonsCost += 25;
    
    const speedCost = deliverySpeed === 'express' ? 15 : 0;
    
    const totalOriginal = basePrice + packageValue + addonsCost + speedCost;
    const totalCombo = basePrice + packageCost + addonsCost + speedCost;
    const savings = totalOriginal - totalCombo;
    const savingsPercent = Math.round((savings / totalOriginal) * 100);
    
    return {
      totalOriginal,
      totalCombo,
      savings,
      savingsPercent
    };
  };

  const handleSecureCombo = (e: React.FormEvent) => {
    e.preventDefault();
    setComboError('');
    setComboSuccess(false);

    if (!domainName.trim()) {
      setComboError(language === 'bn' 
        ? 'দয়া করে আপনার কাঙ্ক্ষিত ডোমেইন বা অ্যাপের নাম লিখুন!' 
        : language === 'ar'
        ? 'يرجى إدخال اسم النطاق أو التطبيق المطلوب!'
        : 'Please enter your desired Domain Name or App Title!');
      return;
    }
    if (!whatsappNumber.trim()) {
      setComboError(language === 'bn' 
        ? 'দয়া করে আপনার হোয়াটসঅ্যাপ নম্বরটি লিখুন!' 
        : language === 'ar'
        ? 'يرجى إدخال رقم الواتساب الخاص بك!'
        : 'Please enter your WhatsApp Number!');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setComboError(language === 'bn' 
        ? 'দয়া করে একটি সঠিক ইমেল ঠিকানা লিখুন!' 
        : language === 'ar'
        ? 'يرجى إدخال عنوان بريد إلكتروني صالح!'
        : 'Please enter a valid Email Address!');
      return;
    }

    setComboSubmitting(true);
    
    setTimeout(() => {
      setComboSubmitting(false);
      setComboSuccess(true);
      
      const basePrice = product.discountPrice || product.price;
      const packageCost = comboPackage === 'sovereign' ? 129 : 79;
      let addonsCost = 0;
      if (selectedAddons.includes('white_label')) addonsCost += 19;
      if (selectedAddons.includes('backup')) addonsCost += 15;
      if (selectedAddons.includes('push')) addonsCost += 25;
      const speedCost = deliverySpeed === 'express' ? 15 : 0;
      
      const finalComboUsdPrice = basePrice + packageCost + addonsCost + speedCost;

      const comboProduct: Product = {
        ...product,
        id: `combo-${product.id}-${Date.now()}`,
        name: `${product.name} [MEGA COMBO BONANZA]`,
        nameBn: `${product.nameBn} [মেগা কম্বো বোনানজা]`,
        nameAr: `${product.nameAr} [ميجا كومبو بونانزا]`,
        price: finalComboUsdPrice + 100,
        discountPrice: finalComboUsdPrice,
        badge: 'Mega Combo',
        views: 1,
        rating: 5,
        reviewsCount: 1,
        tags: ['combo', 'mega', 'bonanza'],
        features: [
          ...product.features,
          '1-Year Ultra-Fast SSD VPS Cloud Node Configured',
          'Professional installation setup by WebzoneBD engineer',
          'Priority WhatsApp Live technical support forum support'
        ]
      };

      addToCart(comboProduct);

      triggerToast(language === 'bn' 
        ? 'মেগা কম্বো বোনানজা সফলভাবে আপনার কার্টে যোগ করা হয়েছে!' 
        : language === 'ar'
        ? 'تمت إضافة باقة الميجا كومبو بنجاح إلى السلة!'
        : 'Mega Combo Bonanza successfully secured and added to cart!');
      
      if (setCartOpen) {
        setCartOpen(true);
      }
    }, 1500);
  };

  // Multi-currency pricing mapping
  const rates = currencyRates || { USD: 1.0, BDT: 118.5, SAR: 3.75 };
  const currencySymbols = { USD: '$', BDT: '৳', SAR: '﷼' };

  const getPriceInCurrency = (usdAmount: number, targetCurrency: Currency = currency) => {
    const rate = rates[targetCurrency] || 1.0;
    const symbol = currencySymbols[targetCurrency] || '$';
    const amount = usdAmount * rate;
    
    if (targetCurrency === 'BDT') {
      return `${symbol} ${Math.round(amount).toLocaleString()}`;
    }
    return `${symbol} ${amount.toFixed(2)}`;
  };

  // Convert license pricing multipliers
  const licensePriceMultiplier = {
    personal: 1.0,   // Base price (discounted)
    business: 2.2,   // 2.2x base
    developer: 5.5   // 5.5x base
  };

  const getLicensePrice = (type: 'personal' | 'business' | 'developer') => {
    const basePrice = product.discountPrice || product.price;
    const finalUsd = basePrice * licensePriceMultiplier[type];
    return getPriceInCurrency(finalUsd);
  };

  const getCategoryName = (catId: string) => {
    try {
      const saved = localStorage.getItem('webzone_store_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        const c = parsed.find((cat: any) => cat.id === catId);
        if (c) {
          return language === 'bn' ? c.nameBn : language === 'ar' ? c.nameAr : c.name;
        }
      }
    } catch (e) {
      // ignore
    }
    return catId.toUpperCase();
  };

  const recommendedProducts = useMemo(() => {
    const sameCategory = products.filter(p => p.id !== product.id && p.category === product.category);
    const otherCategories = products.filter(p => p.id !== product.id && p.category !== product.category);
    return [...sameCategory, ...otherCategories].slice(0, 5);
  }, [products, product.id, product.category]);

  const moreLikeThisProducts = useMemo(() => {
    const sameCat = products.filter(p => p.id !== product.id && p.category === product.category);
    if (sameCat.length > 0) {
      return sameCat.slice(0, 4);
    }
    // Fallback if no other products exist in the same category
    return products.filter(p => p.id !== product.id).slice(0, 4);
  }, [products, product.id, product.category]);

  const dynamicPackageDetails = useMemo(() => {
    if (selectedLicense === 'personal') {
      return {
        overview: language === 'bn' 
          ? `পার্সোনাল লাইসেন্স: একক ডোমেইন ভিত্তিক ব্যক্তিগত ওয়েবসাইট, টেস্ট বা ব্যক্তিগত স্টার্টআপের জন্য আদর্শ। "${product.nameBn || product.name}" এর স্ট্যান্ডার্ড ফাইল, ৩ মাসের নিয়মিত আপডেট এবং ডকুমেন্টেশন পাবেন।`
          : language === 'ar'
          ? `رخصة شخصية: مثالية للمواقع الشخصية لنطاق واحد أو للاختبار. تتضمن ملفات الأداء القياسي لـ "${product.name}" وتحديثات لمدة 3 أشهر.`
          : `Personal License: Perfect for single-domain personal websites, testing, or a private startup. Includes standard performance files of "${product.name}", 3 months of basic community updates, and standard documentation.`,
        features: language === 'bn' 
          ? [
              "১টি ডোমেইন লাইসেন্স অ্যাক্টিভেশন",
              "স্ট্যান্ডার্ড কোর ফিচারসমূহ অন্তর্ভুক্ত",
              "লাইফটাইম অটোমেটেড সেলফ-আপডেট",
              "৩ মাসের বেসিক চ্যাট সাপোর্ট ফোরাম",
              "বিস্তারিত অফলাইন সেটআপ গাইড ও ডকুমেন্টেশন"
            ]
          : language === 'ar'
          ? [
              "تفعيل ترخيص لنطاق واحد",
              "الميزات الأساسية القياسية متضمنة",
              "تحديثات ذاتية مدى الحياة",
              "دعم أساسي عبر الدردشة لمدة 3 أشهر",
              "وثائق إعداد مفصلة بدون اتصال"
            ]
          : [
              "Single Domain License Activation",
              "Standard Core Features Included",
              "Lifetime Automated Self-Updates",
              "3 Months Basic Chat Support Forum",
              "Detailed Offline Setup Documentation"
            ]
      };
    } else if (selectedLicense === 'business') {
      return {
        overview: language === 'bn'
          ? `বিজনেস লাইসেন্স: প্রতিষ্ঠিত ব্যবসা ও বাণিজ্যিক ব্যবহারের জন্য চমৎকার সমাধান। ৩টি ডোমেইন লাইসেন্স, ডাটাবেস অপ্টিমাইজেশন, এবং পাবেন ৬ মাসের প্রায়োরিটি ভিআইপি সেটআপ ও ইনস্টলেশন সাপোর্ট।`
          : language === 'ar'
          ? `رخصة تجارية: مُحسّنة للشركات القائمة والبوابات التجارية عالية الحركة. تدعم ما يصل إلى 3 نطاقات، و6 أشهر من الدعم ذي الأولوية VIP والمساعدة في التثبيت المجاني.`
          : `Business License: Optimized for established businesses, high-traffic commercial portals, or multiple setups. Supports up to 3 domains, custom db optimization, and includes 6 months of VIP priority setup + free installation assistance.`,
        features: language === 'bn'
          ? [
              "৩টি ডোমেইন লাইসেন্স অ্যাক্টিভেশন",
              "প্রিমিয়াম হাই-স্পিড পারফরম্যান্স ও ক্যাশিং",
              "আমাদের টিম দ্বারা সম্পূর্ণ ফ্রি রিমোট সেটআপ",
              "৬ মাসের প্রায়োরিটি ভিআইপি গ্রাহক সেবা",
              "বাণিজ্যিক ব্যবসা বা SaaS এ ব্যবহারের অনুমতি"
            ]
          : language === 'ar'
          ? [
              "تفعيل ترخيص لما يصل إلى 3 نطاقات",
              "أداء ممتاز عالي السرعة وتخزين مؤقت",
              "تثبيت مجاني عن بعد بواسطة خبير",
              "دعم عملاء VIP ذي أولوية لمدة 6 أشهر",
              "يُسمح بالاستخدام التجاري للشركات / SaaS"
            ]
          : [
              "Up to 3 Domains License Activation",
              "Premium High-Speed Performance & Caching",
              "Free Remote Setup & Installation by Expert",
              "6 Months Priority VIP Customer Support",
              "Commercial Business/SaaS Use Allowed"
            ]
      };
    } else {
      return {
        overview: language === 'bn'
          ? `ডেভেলপার/এজেন্সি লাইসেন্স: কাস্টম ক্লায়েন্ট প্রজেক্ট এবং এন্টারপ্রাইজ সিস্টেমের জন্য সেরা। আনলিমিটেড ডোমেইন সেটআপ, ১০০% হোয়াইট-লেবেল সোর্স কোড অ্যাক্সেস এবং ১২ মাসের ডিরেক্ট ইঞ্জিনিয়ার সাপোর্ট পাবেন।`
          : language === 'ar'
          ? `رخصة المطور/الوكالة: الأنسب لوكالات البرمجيات ومشاريع تسليم العملاء وأنظمة المؤسسات. توفر عمليات تثبيت غير محدودة للمجالات، والوصول الكامل إلى الكود المصدري الأبيض، و12 شهرًا من دعم المهندسين المباشر.`
          : `Developer/Agency License: Best suited for software agencies, client delivery projects, and enterprise systems. Offers unlimited domain installs, complete raw white-label source code access, and 12 months of direct engineer support.`,
        features: language === 'bn'
          ? [
              "আনলিমিটেড ডোমেইন ও ক্লায়েন্ট ইনস্টলেশন",
              "১০০% হোয়াইট-লেবেল র সোর্স কোড অ্যাক্সেস",
              "১২ মাসের ডিরেক্ট কোর ইঞ্জিনিয়ার সাপোর্ট",
              "এন্টারপ্রাইজ-গ্রেড সিকিউরিটি অডিট প্রোটোকল",
              "আনলিমিটেড ক্লায়েন্টদের কাছে পেইড সার্ভিস হিসেবে চালুর সুবিধা"
            ]
          : language === 'ar'
          ? [
              "يُسمح بعمليات تثبيت غير محدودة للعملاء والنطاقات",
              "وصول 100٪ إلى الكود المصدري الخام الأبيض",
              "دعم مباشر من مهندس كور لمدة 12 شهرًا",
              "بروتوكول تدقيق أمني على مستوى المؤسسات",
              "إعادة البيع لعملاء غير محدودين كخدمة مدفوعة"
            ]
          : [
              "Unlimited Clients & Domain Installs Allowed",
              "100% White-Label Raw Source Code Access",
              "12 Months Direct Core Engineer Support",
              "Enterprise-Grade Security Audit Protocol",
              "Resell to Unlimited Clients as a Paid Service"
            ]
      };
    }
  }, [selectedLicense, product, language]);

  const handleViewProduct = (p: Product) => {
    if (onViewProduct) {
      onViewProduct(p);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getLicenseOriginalPrice = (type: 'personal' | 'business' | 'developer') => {
    const originalBase = product.price;
    const finalUsd = originalBase * licensePriceMultiplier[type];
    return getPriceInCurrency(finalUsd);
  };

  // Gallery Images simulation
  const galleryImages = useMemo(() => {
    return [
      product.image,
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80"
    ];
  }, [product.image]);

  // Auto-rotate images when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length, isHovered]);

  // Handle Zoom Hover Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center' });
  };

  // Breadcrumb generation based on item
  const breadcrumbs = [
    { label: language === 'bn' ? 'হোম' : 'Home', action: onBack },
    { label: language === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace', action: onBack },
    { label: product.category.toUpperCase(), active: true }
  ];

  // Specific Product Specs matching the item
  const specs = useMemo(() => {
    const isLaravel = product.category === 'laravel' || product.tags?.includes('Laravel');
    const isWordPress = product.category === 'wordpress' || product.tags?.includes('WordPress');
    
    return {
      type: isLaravel ? "Laravel Script (Web Application)" : isWordPress ? "WordPress Theme" : "Digital Script Solution",
      version: isLaravel ? "v3.2.0 (Stable)" : "v2.1.4",
      license: "GPLv2 / WebZoneBD Digital Commercial",
      size: isLaravel ? "38.2 MB" : "14.5 MB",
      platform: isLaravel ? "Linux / VPS / Shared hosting" : "WordPress CMS",
      framework: isLaravel ? "Laravel 11.x, AlpineJS, Tailwind" : "Elementor, Redux Framework",
      compatibility: isLaravel ? "PHP 8.2 / 8.3 & MySQL 8.0+" : "WordPress 6.2+ & PHP 8.1+",
      languages: language === 'bn' ? "বাংলা, ইংরেজি, আরবি" : "English, Bengali, Arabic Supported",
      lastUpdated: "2026-07-15"
    };
  }, [product.category, product.tags, language]);

  // FAQs
  const defaultFaqs = [
    { q: "Is the installation free?", a: "Yes! If you purchase the Developer or Business license, our team provides complimentary setup on your cPanel VPS host within 12 hours." },
    { q: "Do I get lifetime free updates?", a: "Absolutely. All packages purchased from WebZoneBD include lifetime original updates directly via your dashboard." },
    { q: "What is the refund policy?", a: "As this is an downloadable digital product, we do not offer general refunds. However, if our script fails to execute due to bug loops and our staff cannot resolve it, we provide a 100% money-back guarantee." },
    { q: "How does manual payment verification work?", a: "You pay via local BDT wallets (bKash/Nagad) or Saudi banks. Upload the screenshot voucher with TxnID. Our system instantly audits ledger accounts to approve and unlock your download within 5 seconds." }
  ];

  const filteredFaqs = defaultFaqs.filter(faq => 
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Image Upload handler for Reviews
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

  // Submit Review Form
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      triggerToast(language === 'bn' ? "⚠️ রিভিউ পোস্ট করতে দয়া করে প্রথমে লগইন করুন।" : "⚠️ Please login first to post a review.");
      if (onOpenLogin) onOpenLogin();
      return;
    }
    if (!newComment.trim()) {
      triggerToast("⚠️ Please enter a review comment.");
      return;
    }
    const nameToUse = reviewerName.trim() || user?.name || (language === 'bn' ? 'সম্মানিত ক্রেতা' : 'Anonymous Client');
    const reviewId = `rev-${Date.now()}`;
    const newRevObj = {
      id: reviewId,
      productId: product.id,
      productName: product.name,
      userId: user.id,
      userName: nameToUse,
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      rating: newRating,
      comment: newComment,
      createdAt: new Date().toISOString().split('T')[0],
      approved: false
    };

    try {
      await setDoc(doc(db, 'store_reviews', reviewId), newRevObj);
      setNewComment('');
      setUploadedReviewImage(null);
      triggerToast(language === 'bn' 
        ? "✨ ধন্যবাদ! আপনার রিভিউটি সফলভাবে জমা হয়েছে এবং এডমিন অনুমোদনের জন্য অপেক্ষমান রয়েছে।"
        : "✨ Thank you! Your review has been submitted successfully and is awaiting admin approval.");
    } catch (error) {
      console.error("Failed to submit review:", error);
      handleFirestoreError(error, OperationType.WRITE, `store_reviews/${reviewId}`);
    }
  };

  // WhatsApp quick order redirect
  const handleWhatsAppOrder = () => {
    const baseUsd = (product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense];
    const advanceUsd = baseUsd * (advancePercent / 100);
    const dueUsd = baseUsd - advanceUsd;

    const totalStr = getPriceInCurrency(baseUsd);
    const advanceStr = getPriceInCurrency(advanceUsd);
    const dueStr = getPriceInCurrency(dueUsd);

    const text = `Assalamu Alaikum WebzoneBD,\n\nI want to quickly purchase:\n📦 Product Name: ${product.name}\n🔑 Selected License: ${selectedLicense.toUpperCase()}\n💰 Total Order Price: ${totalStr}\n💳 Advance Payment Option: ${advancePercent}%\n💵 Advance Payable: ${advanceStr}${advancePercent < 100 ? `\n⏳ Remaining Due: ${dueStr}` : ''}\n\nPlease share payment steps and manual activation details. My email: ${user?.email || 'Guest User'}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/966570511931?text=${encoded}`, '_blank');
    triggerToast("Redirecting to WhatsApp Order Desk...");
  };

  // Product sharing functionalities
  const handleNativeShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    const shareTitle = `${product.name} - WebzoneBD Premium Digital Asset`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: product.description || `Check out ${product.name} on WebzoneBD!`,
          url: shareUrl,
        });
        triggerToast(language === 'bn' ? "✨ প্রোডাক্টটি শেয়ার করার জন্য আপনাকে ধন্যবাদ!" : "✨ Thanks for sharing this product!");
      } catch (err) {
        console.log('Native share failed or dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    navigator.clipboard.writeText(shareUrl);
    triggerToast(language === 'bn' ? "📋 প্রোডাক্ট পেজ লিংক ক্লিপবোর্ডে কপি করা হয়েছে!" : "📋 Product page link copied to clipboard!");
  };

  const handleFacebookShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
    triggerToast(language === 'bn' ? "👥 ফেসবুক শেয়ার উইন্ডো ওপেন করা হয়েছে!" : "👥 Facebook share window opened!");
  };

  const handleTwitterShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    const shareTitle = `${product.name} - WebzoneBD`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank', 'noopener,noreferrer');
    triggerToast(language === 'bn' ? "🐦 টুইটার (X) শেয়ার উইন্ডো ওপেন করা হয়েছে!" : "🐦 Twitter (X) share window opened!");
  };

  const handleWhatsAppShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    const shareTitle = `${product.name} - WebzoneBD`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank', 'noopener,noreferrer');
    triggerToast(language === 'bn' ? "💬 হোয়াটসঅ্যাপ শেয়ার ওপেন করা হয়েছে!" : "💬 WhatsApp share window opened!");
  };

  const handleInstagramShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com';
    navigator.clipboard.writeText(shareUrl);
    triggerToast(language === 'bn' 
      ? "📸 লিংক কপি হয়েছে! আপনার ইনস্টাগ্রাম স্টোরি বা বায়োতে শেয়ার করতে পেস্ট করুন।" 
      : "📸 Link copied! Add it to your Instagram Story or Bio to share with your audience.");
  };

  // Affiliate Partner Detection Check
  const activeReferralPartner = useMemo(() => {
    return localStorage.getItem('webzone_referral_partner_id');
  }, []);

  // Launch Manual Payment Verification screen
  const openManualPaymentSheet = () => {
    setIsPaymentModalOpen(true);
    setPaymentStep(1);
    setVerificationProgress(0);
  };

  // Simulate automated ledger verification and approval process
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
          
          // Payment Approved!
          // Unlocks the download link and adds a custom order record to local/state db
          const mockOrderObj = {
            id: `ord-man-${Math.floor(1000 + Math.random() * 9000)}`,
            productId: product.id,
            itemTitle: product.name,
            price: product.discountPrice || product.price,
            date: new Date().toISOString().split('T')[0],
            paymentMethod: selectedGateway,
            paymentStatus: 'completed',
            status: 'delivered',
            downloadUrl: product.downloadUrl || "https://webzonebd.com/downloads/premium-package.zip",
            customerName: user?.name || "MD Imran Hossain",
            customerEmail: user?.email || "imranh7900@gmail.com",
            customerPhone: senderNumber,
            transactionId: transactionId
          };

          // Append mock order
          setOrders(prevOrders => [mockOrderObj, ...prevOrders]);
          
          // Save back to localStorage for Dashboard integration
          const updatedOrders = [mockOrderObj, ...orders];
          localStorage.setItem('webzone_orders', JSON.stringify(updatedOrders));

          // Set active download
          setActiveDownloadUrl(mockOrderObj.downloadUrl);
          
          triggerToast("🎉 SUCCESS! Automated system verified ledger balance. Product has been activated!");
          return 100;
        }
        return prev + 15;
      });
    }, 600);
  };

  return (
    <div className={`min-h-screen font-sans pb-24 overflow-x-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      
      {/* 14. SEO & Breadcrumb Structure */}
      <div className={`border-b backdrop-blur-xl transition-colors duration-300 ${
        isDark ? 'border-white/5 bg-slate-900/60' : 'border-slate-200 bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />}
                {bc.action ? (
                  <button 
                    onClick={bc.action}
                    className={`transition font-semibold cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    {bc.label}
                  </button>
                ) : (
                  <span className="text-indigo-500 font-bold">
                    {bc.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-4 text-xs">
            {activeReferralPartner && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-full font-mono animate-pulse">
                <Gift className="w-3.5 h-3.5" />
                <span>Referred by: <b>{activeReferralPartner}</b> (15% affiliate discount loaded!)</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold font-mono">14 Clients viewing now</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 13. Limited Time Offer Countdown Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-950 to-pink-900 border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-full text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MEGA COMBO BONANZA</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Get Eid-ul-Adha Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400">50% Mega Combo Package Discount</span> + Free Setup!
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-light">
              Purchase today and get <strong className="text-pink-400">Free Bonus 1:</strong> 1 Year Ultra-Fast Web Hosting & <strong className="text-pink-400">Bonus 2:</strong> Live Premium SEO Audit checklist.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2 p-4 bg-[#0B0F19]/80 border border-white/5 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Offer Ends In:</span>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-mono font-black text-white">{timer.hours}</span>
                <span className="text-[9px] text-slate-500 uppercase">hrs</span>
              </div>
              <span className="text-xl font-bold text-pink-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-mono font-black text-pink-400">{timer.minutes}</span>
                <span className="text-[9px] text-slate-500 uppercase">min</span>
              </div>
              <span className="text-xl font-bold text-pink-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-mono font-black text-rose-500">{timer.seconds}</span>
                <span className="text-[9px] text-slate-500 uppercase">sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. PRODUCT HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Image Gallery with Hover Zoom */}
          <div className="lg:col-span-7 space-y-4">
            <div 
              className={`relative aspect-video rounded-3xl overflow-hidden group cursor-zoom-in border transition-all ${
                isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-100 border-slate-200'
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
                  alt={product.name}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full h-full object-cover absolute inset-0"
                  style={zoomStyle}
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 bg-indigo-600/95 text-[10px] tracking-widest font-mono font-extrabold uppercase rounded-lg shadow-lg border border-white/10 text-white">
                  {product.category.toUpperCase()}
                </span>
                {product.badge && (
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-600 text-[10px] tracking-wide font-bold uppercase rounded-lg shadow-lg border border-white/10 text-white animate-pulse">
                    ★ {product.badge}
                  </span>
                )}
              </div>

              {/* Wishlist Heart on Gallery Top-Right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const isAdding = !wishlist.includes(product.id);
                  if (isAdding) {
                    setIsWishlistPulsing(true);
                    setTimeout(() => setIsWishlistPulsing(false), 850);
                  }
                  toggleWishlist(product.id);
                }}
                className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md border shadow-lg transition-all duration-150 cursor-pointer z-20 active:scale-90 ${
                  wishlist.includes(product.id)
                    ? 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-300 dark:border-rose-900 text-rose-500'
                    : 'bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 hover:scale-105'
                }`}
                title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isWishlistPulsing && (
                  <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-rose-500/35 animate-heart-ring pointer-events-none" />
                )}
                <Heart 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isWishlistPulsing
                      ? 'fill-rose-500 text-rose-500 animate-heart-pulse drop-shadow-[0_0_6px_rgba(244,63,94,0.7)]'
                      : wishlist.includes(product.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'fill-transparent'
                  }`} 
                />
              </button>

              {/* Zoom guide indicator */}
              <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-[10px] text-slate-400 rounded-lg border border-white/5 font-mono pointer-events-none group-hover:opacity-0 transition-opacity">
                Hover to zoom picture
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-video rounded-xl overflow-hidden border transition-all ${
                    activeImageIdx === idx 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/25' 
                      : isDark ? 'border-white/5 opacity-60 hover:opacity-100' : 'border-slate-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Buying Controls Panel */}
          <div className={`p-6 rounded-3xl border space-y-6 shadow-xl relative backdrop-blur-xl transition-all duration-300 ${
            isDark ? 'bg-[#0F172A]/70 border-white/5' : 'bg-white border-slate-200/80'
          }`}>
            <div className="absolute top-0 right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Title & Metadata */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-amber-500">{product.rating}</span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>({mergedReviews.length} client feedback reviews)</span>
              </div>

              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'bn' ? product.nameBn : language === 'ar' ? product.nameAr : product.name}
              </h1>

              <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Total Sales: <strong className={isDark ? 'text-white' : 'text-slate-800'}>{product.views + 120} units sold</strong></span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Stock (Instant cPanel Delivery)</span>
                </span>
              </div>
            </div>

            {/* Dynamic Multi-Currency Pricing Block */}
            <div className={`p-4 rounded-2xl border space-y-3 text-left transition-all ${
              isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Products Pricing:</span>
                
                {/* 15. Multi Currency Selector */}
                <div className={`flex gap-1 p-1 rounded-xl border ${
                  isDark ? 'bg-[#1E293B] border-white/5' : 'bg-slate-200/60 border-slate-300'
                }`}>
                  {(['USD', 'BDT', 'SAR'] as Currency[]).map(curr => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition font-mono ${
                        currency === curr 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold font-mono text-emerald-500 tracking-tight">
                    {getLicensePrice(selectedLicense)}
                  </span>
                  <span className={`text-sm line-through font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {getLicenseOriginalPrice(selectedLicense)}
                  </span>
                </div>

                {/* Horizontal line in mobile mode */}
                <div className="block sm:hidden w-full h-[1px] bg-slate-250 dark:bg-white/10 my-1" id="mobile-pricing-divider" />

                <span className="inline-flex items-center px-2.5 py-1 sm:py-0.5 rounded-full bg-pink-500/10 text-pink-500 text-[10.5px] font-bold font-mono">
                  Save -40% + Affiliate bonus code
                </span>
              </div>

              {activeReferralPartner && (
                <div className="text-[11px] text-emerald-500 font-mono font-medium flex items-center gap-1 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                  <Check className="w-3 h-3" />
                  <span>Additional 15% partner commission discount applied directly to price!</span>
                </div>
              )}
            </div>

            {/* Pricing & License Picker */}
            <div className="space-y-3 text-left">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select Products Package:</span>
              <div className="grid grid-cols-3 gap-2.5">
                {(['personal', 'business', 'developer'] as const).map(lic => (
                  <button
                    key={lic}
                    onClick={() => setSelectedLicense(lic)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${
                      selectedLicense === lic 
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-500/15 font-semibold' 
                        : isDark
                          ? 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">{lic}</span>
                    <span className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{getLicensePrice(lic)}</span>
                  </button>
                ))}
              </div>
              <p className={`text-[10.5px] text-center leading-relaxed font-light ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {selectedLicense === 'personal' && "✓ Single Domain Setup • 3 Months Free Support • Standard updates"}
                {selectedLicense === 'business' && "✓ 3 Domains installation • 6 Months Priority VIP support • Installation service"}
                {selectedLicense === 'developer' && "✓ Unlimited clients domain installs • 12 Months Support • White label source code"}
              </p>
            </div>

            {/* 💳 Advance Payment Option & Order Breakdown */}
            <div className={`p-4 rounded-2xl border space-y-3.5 my-3 text-left transition-all ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {language === 'bn' ? 'অ্যাডভান্স পেমেন্ট অপশন' : 'Advance Payment Option'}
                </span>
                <span className="text-[10px] text-pink-500 font-mono font-bold">
                  {language === 'bn' ? 'অগ্রিম নির্বাচন' : 'Select escrow advance'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {([30, 50, 100] as const).map((percent) => {
                  const isActive = advancePercent === percent;
                  return (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setAdvancePercent(percent)}
                      className={`p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col items-center gap-0.5 cursor-pointer ${
                        isActive
                          ? 'border-transparent bg-gradient-to-r from-[#7C3AED]/15 via-[#A855F7]/15 to-[#EC4899]/15 text-[#7C3AED] ring-1 ring-[#7C3AED]/50 font-bold'
                          : isDark
                          ? 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{percent}%</span>
                      <span className="text-[9.5px]">
                        {percent === 100 
                          ? (language === 'bn' ? '১০০% ফুল' : '100% Full Pay') 
                          : (language === 'bn' ? `${percent}% অ্যাডভান্স` : `${percent}% Advance`)
                        }
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Order Price Breakdown */}
              <div className={`pt-3 border-t space-y-2 text-xs font-mono ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {language === 'bn' ? 'মোট মূল্য (Total Order Price):' : 'Total Order Price:'}
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {getPriceInCurrency((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense])}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {language === 'bn' ? `অগ্রিম জমার পরিমাণ (${advancePercent}%):` : `Advance Payable (${advancePercent}%):`}
                  </span>
                  <strong className="text-emerald-500 font-black">
                    {getPriceInCurrency(((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense]) * (advancePercent / 100))}
                  </strong>
                </div>

                {advancePercent < 100 && (
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {language === 'bn' ? `ডেলিভারির পর বকেয়া (${100 - advancePercent}%):` : `Due Balance Remaining:`}
                    </span>
                    <strong className="text-amber-500 font-bold">
                      {getPriceInCurrency(((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense]) * ((100 - advancePercent) / 100))}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* 'Product Brief Overview' and 'Features Included' under 'Select Products Package' */}
            <div id="product-overview-features-box" className={`p-4 rounded-2xl border text-left space-y-4 transition-all ${
              isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-200/60'
            }`}>
              {/* Product Brief Overview */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#7C3AED]" />
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'প্রোডাক্ট ব্রিফ ওভারভিউ:' : 'Product Brief Overview:'}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {dynamicPackageDetails.overview}
                </p>
              </div>

              {/* Divider */}
              <div className={`h-[1px] ${isDark ? 'bg-white/5' : 'bg-slate-200/60'}`} />

              {/* Features Included */}
              <div className="space-y-2">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} block`}>
                  {language === 'bn' ? 'ফিচারসমূহ:' : 'Features Included:'}
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {dynamicPackageDetails.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {/* Custom Animated/Styled Checkmark matching instructions */}
                      <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                      </span>
                      <span className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buying Action buttons */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                
                {/* Add to Cart */}
                <button
                  onClick={(e) => {
                    addToCart(product, e);
                    if (setCartOpen) setCartOpen(true);
                    triggerToast(`🛒 Added "${product.name}" (${selectedLicense.toUpperCase()}) to your shopping cart!`);
                  }}
                  className={`h-[54px] rounded-[14px] text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-white/5 text-white'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-indigo-500" />
                  <span>Add To Cart</span>
                </button>

                {/* Instant Buy Now -> Launches manual payment sheet */}
                <button
                  onClick={openManualPaymentSheet}
                  className="h-[54px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs font-semibold tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-[0_12px_30px_rgba(124,58,237,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now (Instant)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Quick Order button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Quick WhatsApp Order (৳/$)</span>
                </button>

                {/* Premium Share Button */}
                <button
                  onClick={() => setShowSharePanel(!showSharePanel)}
                  className="relative p-[1px] rounded-xl overflow-hidden group cursor-pointer active:scale-95 transition-all duration-300 h-12"
                >
                  {/* The Gradient Border */}
                  <span className={`absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] transition duration-300 ${
                    showSharePanel ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  }`}></span>
                  {/* Inner button */}
                  <span className={`relative flex items-center justify-center gap-2 px-4 h-[46px] rounded-[11px] text-xs font-bold transition duration-300 ${
                    isDark ? 'bg-slate-950 text-white hover:bg-slate-900/80' : 'bg-white text-slate-800 hover:bg-slate-50/80'
                  }`}>
                    <Share2 className="w-4 h-4 text-[#A855F7]" />
                    <span>{language === 'bn' ? 'প্রোডাক্ট শেয়ার করুন' : 'Share Product'}</span>
                  </span>
                </button>
              </div>

              {/* Collapsible Premium Share Panel */}
              <AnimatePresence>
                {showSharePanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={`overflow-hidden rounded-[24px] border shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-5 transition-all ${
                      isDark 
                        ? 'bg-[#0F172A]/90 border-white/10 backdrop-blur-[20px]' 
                        : 'bg-white/95 border-slate-200/80 backdrop-blur-[20px]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold tracking-wider uppercase bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                          {language === 'bn' ? 'শেয়ারিং অপশনস' : 'Premium Sharing'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">100% Secure Link</span>
                      </div>

                      {/* Input field with Copy Link button */}
                      <div className="space-y-1.5 text-left">
                        <label className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {language === 'bn' ? 'প্রোডাক্ট লিংক কপি করুন:' : 'Copy Product Link:'}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            readOnly
                            value={typeof window !== 'undefined' ? window.location.href : 'https://webzonebd.com'}
                            className={`w-full h-11 pl-4 pr-16 rounded-xl text-[11px] font-mono font-medium border transition-all focus:outline-none ${
                              isDark
                                ? 'bg-[#111827] border-slate-800 text-white focus:border-purple-500'
                                : 'bg-[#F8FAFC] border-slate-200 text-slate-800 focus:border-purple-500'
                            }`}
                          />
                          <button
                            onClick={handleCopyLink}
                            className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                              isDark
                                ? 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200'
                            }`}
                          >
                            <Copy className="w-3 h-3 text-[#A855F7]" />
                            <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Direct Social Shares */}
                      <div className="space-y-2 text-left">
                        <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} block`}>
                          {language === 'bn' ? 'সোশ্যাল মিডিয়াতে শেয়ার করুন:' : 'Direct Social Share:'}
                        </span>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {/* Facebook */}
                          <button
                            onClick={handleFacebookShare}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] hover:shadow-sm cursor-pointer ${
                              isDark 
                                ? 'bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300' 
                                : 'bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-100/50'
                            }`}
                          >
                            <Facebook className="w-4 h-4 fill-current" />
                            <span className="text-[9px] font-bold font-mono">Facebook</span>
                          </button>

                          {/* Twitter */}
                          <button
                            onClick={handleTwitterShare}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] hover:shadow-sm cursor-pointer ${
                              isDark 
                                ? 'bg-slate-800/60 border-slate-700/50 text-white hover:bg-slate-800' 
                                : 'bg-slate-50/50 border-slate-200 text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <Twitter className="w-4 h-4 fill-current" />
                            <span className="text-[9px] font-bold font-mono">Twitter/X</span>
                          </button>

                          {/* WhatsApp */}
                          <button
                            onClick={handleWhatsAppShare}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] hover:shadow-sm cursor-pointer ${
                              isDark 
                                ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 hover:text-emerald-300' 
                                : 'bg-emerald-50/50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/50'
                            }`}
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span className="text-[9px] font-bold font-mono">WhatsApp</span>
                          </button>

                          {/* Instagram */}
                          <button
                            onClick={handleInstagramShare}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] hover:shadow-sm cursor-pointer ${
                              isDark 
                                ? 'bg-pink-600/10 border-pink-500/20 text-pink-400 hover:bg-pink-600/20 hover:text-pink-300' 
                                : 'bg-pink-50/50 border-pink-100 text-pink-600 hover:bg-pink-100/50'
                            }`}
                          >
                            <Instagram className="w-4 h-4" />
                            <span className="text-[9px] font-bold font-mono">Instagram</span>
                          </button>
                        </div>
                      </div>

                      {/* Native Share button if supported */}
                      {typeof navigator !== 'undefined' && navigator.share && (
                        <button
                          onClick={handleNativeShare}
                          className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold tracking-wider transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                            isDark
                              ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border-purple-500/30 text-purple-300'
                              : 'bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-100 text-purple-700'
                          }`}
                        >
                          <Share2 className="w-3.5 h-3.5 text-[#A855F7]" />
                          <span>{language === 'bn' ? 'সিস্টেম শেয়ার' : 'Native Device Share'}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 7. Digital Delivery Features & Guarantees */}
            <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
              <div className={`flex items-center gap-1.5 p-2 rounded-xl border transition-all ${
                isDark ? 'bg-slate-900/30 border-white/5' : 'bg-slate-50 border-slate-100'
              }`}>
                <ArrowDownToLine className="w-4 h-4 text-emerald-500" />
                <div className="text-left">
                  <p className={`text-[10px] font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>Instant download</p>
                  <p className="text-[8.5px] text-slate-400">Active within seconds</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 p-2 rounded-xl border transition-all ${
                isDark ? 'bg-slate-900/30 border-white/5' : 'bg-slate-50 border-slate-100'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <div className="text-left">
                  <p className={`text-[10px] font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>100% Genuine file</p>
                  <p className="text-[8.5px] text-slate-400">Security-audited script</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. PRODUCT GUARANTEES & TRUST BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className={`p-5 rounded-2xl border transition flex items-start gap-3.5 ${
            isDark ? 'bg-slate-900/60 border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-200 hover:border-indigo-500/30 hover:shadow-md'
          }`}>
            <Award className="w-10 h-10 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className={`text-sm font-extrabold font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Developer Choice</p>
              <p className={`text-xs font-light leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rated 4.95 stars based on verified buyer satisfaction surveys and code execution metrics.</p>
            </div>
          </div>
          <div className={`p-5 rounded-2xl border transition flex items-start gap-3.5 ${
            isDark ? 'bg-slate-900/60 border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-200 hover:border-indigo-500/30 hover:shadow-md'
          }`}>
            <Shield className="w-10 h-10 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className={`text-sm font-extrabold font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>100% Virus & Malware Free</p>
              <p className={`text-xs font-light leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sourced directly from certified developer repositories. Thoroughly screened before publication.</p>
            </div>
          </div>
        </div>

        {/* 3. PRODUCT INFORMATION TABS */}
        <div className="space-y-6 text-left">
          <div className={`flex border-b overflow-x-auto no-scrollbar ${
            isDark ? 'border-white/5' : 'border-slate-200'
          }`}>
            {([
              { id: 'description', label: 'Detailed Description' },
              { id: 'features', label: 'Full Core Features' },
              { id: 'specifications', label: 'Tech Specifications' },
              { id: 'installation', label: 'Installation Guide' },
              { id: 'changelog', label: 'Update Changelog' }
            ] as const).map(tb => (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id)}
                className={`px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer shrink-0 ${
                  activeTab === tb.id 
                    ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' 
                    : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          <div className={`p-6 rounded-3xl border min-h-[250px] transition-all ${
            isDark ? 'bg-slate-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Tab 1: Detailed Description */}
                {activeTab === 'description' && (
                  <div className={`space-y-4 text-xs sm:text-sm font-light leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <p>
                      This premium digital download package provides an exceptional full-stack system built exactly for scalability. Designed using clean architectures, it resolves standard server loads by integrating optimized caching pathways, modular controller templates, and custom database indices.
                    </p>
                    <p>
                      Administrators get extensive visibility into sales ledger channels, checkout pipelines, custom discount codes, active client files access logs, and live support requests. The system requires no extensive third-party frameworks and installs seamlessly on typical Linux PHP or WordPress servers.
                    </p>
                    <div className={`p-4 rounded-xl border flex gap-3 items-start mt-4 ${
                      isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <Gift className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className={`block font-mono font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Included Inside the Package ZIP:</strong>
                        <span className={`block mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1. Fully commented source codes (React, PHP, or HTML templates).</span>
                        <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>2. SQL database migration schemas and initial seed tables.</span>
                        <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>3. Comprehensive offline markdown documentation & step-by-step video setup tutorials.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Full Core Features */}
                {activeTab === 'features' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.features?.map((feat, idx) => (
                      <div key={idx} className={`flex gap-2.5 items-start p-3 rounded-xl border transition-colors ${
                        isDark ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-left">
                          <p className={`font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>{feat}</p>
                          <p className={`text-[11px] font-light mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fully verified under extreme loads and multi-user concurrent tests.</p>
                        </div>
                      </div>
                    ))}
                    <div className={`flex gap-2.5 items-start p-3 rounded-xl border transition-colors ${
                      isDark ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-left">
                        <p className={`font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>RTL Arabic / BDT Currency Support</p>
                        <p className={`text-[11px] font-light mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pre-configured language translation tables for global and GCC markets.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Tech Specifications */}
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Product Type", val: specs.type },
                      { label: "Software Version", val: specs.version },
                      { label: "License Terms", val: specs.license },
                      { label: "Asset File Size", val: specs.size },
                      { label: "Server Host Platform", val: specs.platform },
                      { label: "Code Frameworks", val: specs.framework },
                      { label: "System Compatibility", val: specs.compatibility },
                      { label: "Supported Languages", val: specs.languages },
                      { label: "Last Verified Updated", val: specs.lastUpdated }
                    ].map((sp, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border text-left space-y-1 transition-colors ${
                        isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{sp.label}</span>
                        <p className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{sp.val}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 4: Installation Guide */}
                {activeTab === 'installation' && (
                  <div className={`space-y-4 text-xs sm:text-sm font-light leading-relaxed ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>How to Install in 3 Easy Steps:</p>
                    <ol className="space-y-3 list-decimal list-inside">
                      <li>
                        <strong className={isDark ? 'text-white' : 'text-slate-800'}>Upload Code ZIP:</strong> Log into your cPanel host file manager or connect via FTP. Upload the acquired source ZIP inside your public root folder.
                      </li>
                      <li>
                        <strong className={isDark ? 'text-white' : 'text-slate-800'}>Run SQL Migration:</strong> Head to MySQL Databases, create a new schema. Access phpMyAdmin to import the pre-bundled <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 rounded text-xs font-mono">database.sql</code> file.
                      </li>
                      <li>
                        <strong className={isDark ? 'text-white' : 'text-slate-800'}>Configure environment:</strong> Open your configuration file (e.g. <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 rounded text-xs font-mono">.env</code> or config schema) to paste database connection keys, then click launch!
                      </li>
                    </ol>
                    <div className="p-3 bg-indigo-500/5 text-indigo-600 dark:text-indigo-300 rounded-xl border border-indigo-500/10 text-xs mt-4">
                      💡 <strong>Stuck? No worries!</strong> Purchase today and receive 100% free professional installation support from our certified engineers over Whatsapp and Live Support Ticket desk.
                    </div>
                  </div>
                )}

                {/* Tab 5: Update Changelog */}
                {activeTab === 'changelog' && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border transition-colors ${
                      isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="px-2 py-0.5 bg-indigo-500 text-white font-mono font-bold rounded text-[10px]">v3.2.0 (Latest Release)</span>
                        <span className="text-[10.5px] text-slate-500 font-mono">Released: 2026-07-15</span>
                      </div>
                      <ul className={`list-disc list-inside mt-3 text-xs space-y-1 text-left ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                        <li>Optimized database queries for 25x faster concurrent cart checkouts.</li>
                        <li>Fully integrated automated manual payment upload verification gateway module.</li>
                        <li>Upgraded compatible framework templates to Laravel 11 / WordPress 6.5.</li>
                        <li>Fixed RTL alignment anomalies inside Saudi/Arabic language dashboard views.</li>
                      </ul>
                    </div>
                    <div className={`p-4 rounded-xl border transition-colors ${
                      isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50/50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-mono font-bold rounded text-[10px]">v2.1.0</span>
                        <span className="text-[10.5px] text-slate-400 font-mono">Released: 2026-04-10</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 text-left">Added automated invoice dispatcher, guest checkout verification code, and affiliate commission dashboard support module.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 5. LIVE PREVIEW & DEMO CREDENTIALS SECTION */}
        <div className={`p-6 sm:p-8 rounded-3xl border text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-gradient-to-br from-slate-950 to-slate-900 border-white/5' : 'bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-sm'
        }`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="md:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 rounded-full text-xs font-bold">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>LIVE INTERACTIVE DEMO</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Test Drive before buying. Explore User & Admin Dashboards.
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              We believe in 100% digital transparency. Experience the live user interface of {product.name} or log into the super administrator console to review transaction logs, coupon structures, and security settings.
            </p>

            <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2.5 max-w-md transition-colors ${
              isDark ? 'bg-slate-900 border-white/5 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <p className={`font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Demo Admin Credentials:</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Username:</span>
                  <span className={`text-xs select-all font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>admin@webzonebd.com</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Password:</span>
                  <span className={`text-xs select-all font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>admin@pass2026</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={product.demoUrl || "https://demo.webzonebd.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>User Demo Link</span>
              </a>
              <a
                href={product.demoUrl ? `${product.demoUrl}/admin` : "https://demo.webzonebd.com/admin"}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 border text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border-white/5 text-white' : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Admin Demo Link</span>
              </a>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="px-6 py-3 bg-pink-500/10 hover:bg-pink-600 text-pink-600 dark:text-pink-400 hover:text-white text-xs font-bold rounded-xl border border-pink-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Video Walkthrough</span>
              </button>
            </div>
          </div>

          <div className={`md:col-span-5 relative aspect-video rounded-2xl border overflow-hidden group ${
            isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80" 
              alt="Dashboard screenshot mock" 
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-[#020617]/40 flex items-center justify-center">
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition cursor-pointer hover:scale-110 active:scale-95"
              >
                <Play className="w-6 h-6 fill-current" />
              </button>
            </div>
          </div>

        </div>

        {/* MEGA COMBO BONANZA SECTION */}
        <div id="mega-combo-bonanza" className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-pink-600/10 rounded-[24px] blur-3xl pointer-events-none" />
          
          <div className={`p-6 sm:p-8 rounded-[24px] border relative overflow-hidden transition-all duration-300 ${
            isDark 
              ? 'bg-[#0F172A] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
              : 'bg-[#FFFFFF] border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'
          }`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 via-pink-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            
            {/* Header with Glowing Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-full text-[10.5px] font-black tracking-wider uppercase shadow-md shadow-violet-500/20">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>MEGA COMBO BONANZA 🎁</span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? 'সুপারসেভার মেগা কম্বো প্যাকেজ' : language === 'ar' ? 'باقة الميجا كومبو التوفيرية الكبرى' : 'Super-Saver Mega Combo Packages'}
                </h3>
                <p className={`text-xs sm:text-sm font-light leading-relaxed max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'bn' 
                    ? `আমাদের আল্ট্রা-প্রিমিয়াম এন্টারপ্রাইজ কম্বো দিয়ে আপনার প্রজেক্টটি সুপারচার্জ করুন। এতে পাবেন ${product.name} স্ক্রিপ্টের সাথে হাই-স্পিড ক্লাউড হোস্টিং, অ্যান্ড্রয়েড অ্যাপ এবং ২৪/৭ ভিআইপি সাপোর্ট!` 
                    : language === 'ar' 
                    ? `قم بترقية عملك مع باقة الميجا كومبو الحصرية! تشتمل على ${product.name} بالإضافة إلى خادم سحابي عالي الأداء، تطبيق ذكي، ودعم فني متميز على مدار الساعة.` 
                    : `Supercharge your launch with our signature IT bundle. We pack ${product.name} with premium cloud nodes, app wrappers, full setup, and premium engineer assistance at 45%+ discount.`}
                </p>
              </div>

              {/* Countdown or Savings Badge */}
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 text-center flex flex-col justify-center min-w-[140px] shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">{language === 'bn' ? 'সীমিত অফার' : language === 'ar' ? 'عرض محدود' : 'Limited Offer'}</span>
                <span className="text-lg font-mono font-black text-amber-500 tracking-tight">
                  {timer.hours}:{timer.minutes}:{timer.seconds}
                </span>
                <span className="text-[9.5px] text-slate-400">{language === 'bn' ? 'সময় বাকি আছে' : language === 'ar' ? 'المتبقي للتنشيط' : 'Left to secure'}</span>
              </div>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSecureCombo} className="space-y-6">
              
              {/* STEP 1: Select Combo Package */}
              <div className="space-y-3">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'bn' ? '১. কম্বো প্যাকেজ নির্বাচন করুন' : language === 'ar' ? '١. اختر باقة الكومبو المناسبة' : '1. Choose Your Combo Deal'}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Elite Deal Card */}
                  <div 
                    onClick={() => setComboPackage('elite')}
                    className={`p-5 rounded-[24px] border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between group h-full ${
                      comboPackage === 'elite'
                        ? 'border-violet-500 ring-2 ring-violet-500/10 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 -translate-y-1.5 shadow-xl shadow-violet-500/5'
                        : isDark
                        ? 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:-translate-y-1 hover:shadow-lg'
                        : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    {comboPackage === 'elite' && (
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center pt-2.5 pr-2.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase">POPULAR</span>
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Elite SaaS Launchpad</h4>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'bn' 
                          ? 'ফুল স্ক্রিপ্ট লাইসেন্স + ১ বছর প্রিমিয়াম এসএসডি ক্লাউড হোস্টিং নোড + প্রফেশনাল ইন্সটলেশন ও কনফিগারেশন সেটআপ এবং ডেমো ম্যাপিং।' 
                          : language === 'ar' 
                          ? 'الترخيص الكامل + استضافة سحابية فائقة السرعة لمدة عام + الإعداد والتركيب الفني المتكامل مع ربط النطاق.' 
                          : 'Full code license + 1-Year High-Speed SSD VPS Node + Professional server installation, SSL configuration & mapping setup.'}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-white/5 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through block font-mono">
                          {getPriceInCurrency((product.discountPrice || product.price) + 150)}
                        </span>
                        <span className="text-base font-black text-violet-600 dark:text-violet-400 font-mono">
                          {getPriceInCurrency((product.discountPrice || product.price) + 79)}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {language === 'bn' ? '৪৫% সাশ্রয়' : language === 'ar' ? 'وفر ٤٥٪' : 'SAVE 45%'}
                      </span>
                    </div>
                  </div>

                  {/* Sovereign Deal Card */}
                  <div 
                    onClick={() => setComboPackage('sovereign')}
                    className={`p-5 rounded-[24px] border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between group h-full ${
                      comboPackage === 'sovereign'
                        ? 'border-pink-500 ring-2 ring-pink-500/10 bg-gradient-to-br from-pink-600/5 to-violet-600/5 -translate-y-1.5 shadow-xl shadow-pink-500/5'
                        : isDark
                        ? 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:-translate-y-1 hover:shadow-lg'
                        : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    {comboPackage === 'sovereign' && (
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center pt-2.5 pr-2.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-bold uppercase">ULTIMATE</span>
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Ultimate Sovereign Suite</h4>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'bn' 
                          ? 'এলিট প্লাস অ্যান্ড্রয়েড অ্যাপ র্যাপার + ব্রান্ডিং সহ কপিরাইট ক্রেডিট রিমুভাল + পুশ নোটিফিকেশন সেটআপ + ওয়ান-টু-ওয়ান ভিআইপি সাপোর্ট।' 
                          : language === 'ar' 
                          ? 'باقة النخبة + تطبيق أندرويد مدمج + إزالة حقوق الملكية + تنبيهات فورية + دعم فني مباشر وممتاز.' 
                          : 'Elite deal + Fully wrapped Android app + Copyright credit removal + Push notification setup + 1-to-1 live VIP developer assistance.'}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-white/5 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through block font-mono">
                          {getPriceInCurrency((product.discountPrice || product.price) + 250)}
                        </span>
                        <span className="text-base font-black text-pink-600 dark:text-pink-400 font-mono">
                          {getPriceInCurrency((product.discountPrice || product.price) + 129)}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {language === 'bn' ? '৫০% সাশ্রয়' : language === 'ar' ? 'وفر ٥٠٪' : 'SAVE 50%'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Custom Configurations Fields */}
              <div className="space-y-4">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'bn' ? '২. প্রজেক্টের তথ্য এবং সার্ভার নোড' : language === 'ar' ? '٢. تفاصيل المشروع وإعداد الخادم' : '2. Setup Information & Target Node'}
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Floating label for domain name */}
                  <div className="relative">
                    <input 
                      type="text" 
                      id="combo-domain-field"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      className={`peer w-full h-[56px] px-4 pt-5 pb-1 rounded-[14px] text-xs sm:text-sm font-medium transition-all duration-300 outline-none border
                        ${isDark 
                          ? 'bg-[#111827] border-[#374151] text-[#FFFFFF] focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-violet-500' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-violet-500'
                        }`}
                      placeholder=" "
                    />
                    <label 
                      htmlFor="combo-domain-field"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold pointer-events-none transition-all duration-300
                        peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2
                        peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-[#7C3AED]
                        ${domainName ? 'top-2.5 text-[10px]' : ''}
                        ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}
                    >
                      {language === 'bn' ? 'কাঙ্ক্ষিত ডোমেইন বা অ্যাপের নাম (যেমন: myshop.com)' : language === 'ar' ? 'اسم النطاق أو التطبيق المطلوب' : 'Desired Domain / App Title (e.g., myshop.com)'}
                    </label>
                  </div>

                  {/* Searchable Cloud Datacenter Dropdown */}
                  <div className="relative">
                    <div 
                      onClick={() => setIsRegionOpen(!isRegionOpen)}
                      className={`w-full h-[56px] px-4 rounded-[14px] border flex items-center justify-between cursor-pointer transition-all duration-300 select-none
                        ${isDark 
                          ? 'bg-[#111827] border-[#374151] text-[#FFFFFF]' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                        } ${isRegionOpen ? 'ring-[4px] ring-[#7C3AED]/18 border-violet-500' : ''}`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cloud Datacenter</span>
                        <span className="text-xs font-semibold">{region}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isRegionOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isRegionOpen && (
                      <div className={`absolute z-30 left-0 right-0 mt-2 p-3 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 max-h-[250px] overflow-y-auto ${
                        isDark ? 'bg-[#0F172A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}>
                        {/* Search field inside dropdown */}
                        <div className="relative mb-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Search locations..."
                            value={regionSearch}
                            onChange={(e) => setRegionSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full h-8 pl-8 pr-3 rounded-lg text-xs font-medium outline-none border transition-all duration-300 ${
                              isDark 
                                ? 'bg-slate-900 border-white/5 focus:border-violet-500 text-white' 
                                : 'bg-slate-50 border-slate-200 focus:border-violet-500 text-slate-850'
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          {['Singapore 🇸🇬', 'Dhaka, Bangladesh 🇧🇩', 'Riyadh, Saudi Arabia 🇸🇦', 'Frankfurt, Germany 🇩🇪', 'New York, USA 🇺🇸', 'London, United Kingdom 🇬🇧', 'Tokyo, Japan 🇯🇵', 'Mumbai, India 🇮🇳']
                            .filter(loc => loc.toLowerCase().includes(regionSearch.toLowerCase()))
                            .map((loc, idx) => (
                              <div 
                                key={idx}
                                onClick={() => {
                                  setRegion(loc);
                                  setIsRegionOpen(false);
                                  setRegionSearch('');
                                }}
                                className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                                  region === loc 
                                    ? 'bg-violet-500/10 text-violet-500' 
                                    : isDark 
                                    ? 'hover:bg-white/5' 
                                    : 'hover:bg-slate-100'
                                }`}
                              >
                                <span>{loc}</span>
                                {region === loc && <Check className="w-3.5 h-3.5" />}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 3: Optional Extras & Speed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Checkboxes for Addons */}
                <div className="space-y-3">
                  <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'bn' ? '৩. অতিরিক্ত অ্যাড-অন (ঐচ্ছিক)' : language === 'ar' ? '٣. إضافات فنية اختيارية' : '3. Optional Cloud Add-Ons'}
                  </label>
                  <div className="space-y-2.5">
                    {[
                      { id: 'white_label', title: language === 'bn' ? 'ব্র্যান্ডিং ও কপিরাইট রিমুভাল' : 'White-Label Branding Setup', desc: 'Replace our credits with yours', price: 19 },
                      { id: 'backup', title: language === 'bn' ? 'অটো ব্যাকআপ কনফিগারেশন' : 'Automated Cloud Backups', desc: 'Secure daily database logs', price: 15 },
                      { id: 'push', title: language === 'bn' ? 'পুশ নোটিফিকেশন মডিউল' : 'Push & SMS Gateway Module', desc: 'Active transactional alerts', price: 25 }
                    ].map(addon => {
                      const isChecked = selectedAddons.includes(addon.id);
                      return (
                        <div 
                          key={addon.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedAddons(prev => prev.filter(x => x !== addon.id));
                            } else {
                              setSelectedAddons(prev => [...prev, addon.id]);
                            }
                          }}
                          className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                            isChecked
                              ? 'border-violet-500/40 bg-violet-500/5'
                              : isDark ? 'border-white/5 bg-slate-950/20' : 'border-slate-200 bg-slate-50/20'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="pt-0.5">
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-300 ${
                                isChecked 
                                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] border-transparent' 
                                  : isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                              </div>
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{addon.title}</p>
                              <p className="text-[10px] text-slate-400">{addon.desc}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-500">{getPriceInCurrency(addon.price)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Radio buttons for Delivery Speed */}
                <div className="space-y-3">
                  <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'bn' ? '৪. ডেলিভারির সময়সীমা' : language === 'ar' ? '٤. مدة التسليم المطلوبة' : '4. Execution Timeframe'}
                  </label>
                  <div className="space-y-2.5">
                    {/* Standard Radio */}
                    <div 
                      onClick={() => setDeliverySpeed('standard')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                        deliverySpeed === 'standard'
                          ? 'border-violet-500/40 bg-violet-500/5'
                          : isDark ? 'border-white/5 bg-slate-950/20' : 'border-slate-200 bg-slate-50/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          deliverySpeed === 'standard'
                            ? 'border-violet-500'
                            : isDark ? 'border-slate-700' : 'border-slate-300'
                        }`}>
                          {deliverySpeed === 'standard' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7]" />
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Standard Deployment</p>
                          <p className="text-[10px] text-slate-400">{language === 'bn' ? '৩-৫ কর্মদিবস (ফ্রি)' : '3-5 Working Days (Free)'}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-500">FREE</span>
                    </div>

                    {/* Express Radio */}
                    <div 
                      onClick={() => setDeliverySpeed('express')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                        deliverySpeed === 'express'
                          ? 'border-pink-500/40 bg-pink-500/5'
                          : isDark ? 'border-white/5 bg-slate-950/20' : 'border-slate-200 bg-slate-50/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          deliverySpeed === 'express'
                            ? 'border-pink-500'
                            : isDark ? 'border-slate-700' : 'border-slate-300'
                        }`}>
                          {deliverySpeed === 'express' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899]" />
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Express Priority Queue ⚡</p>
                          <p className="text-[10px] text-slate-400">{language === 'bn' ? '২৪ ঘণ্টার মধ্যে ইন্সটলেশন সম্পন্ন' : 'Guaranteed under 24 Hours'}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-500">{getPriceInCurrency(15)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 4: WhatsApp and Email Contact details */}
              <div className="space-y-3">
                <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'bn' ? '৫. আপনার যোগাযোগের বিবরণ' : language === 'ar' ? '٥. تفاصيل التواصل والمتابعة' : '5. Contact Details (For Instant Delivery Coordinates)'}
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Floating label WhatsApp */}
                  <div className="relative">
                    <input 
                      type="text" 
                      id="combo-phone-field"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className={`peer w-full h-[56px] px-4 pt-5 pb-1 rounded-[14px] text-xs sm:text-sm font-medium transition-all duration-300 outline-none border
                        ${isDark 
                          ? 'bg-[#111827] border-[#374151] text-[#FFFFFF] focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-violet-500' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-violet-500'
                        }`}
                      placeholder=" "
                    />
                    <label 
                      htmlFor="combo-phone-field"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold pointer-events-none transition-all duration-300
                        peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2
                        peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-[#7C3AED]
                        ${whatsappNumber ? 'top-2.5 text-[10px]' : ''}
                        ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}
                    >
                      {language === 'bn' ? 'হোয়াটসঅ্যাপ নম্বর (যেমন: +৮৮০১৮৬৪০০০০০৫)' : language === 'ar' ? 'رقم الواتساب الخاص بك' : 'WhatsApp Number (e.g., +8801864000005)'}
                    </label>
                  </div>

                  {/* Floating label Email */}
                  <div className="relative">
                    <input 
                      type="email" 
                      id="combo-email-field"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className={`peer w-full h-[56px] px-4 pt-5 pb-1 rounded-[14px] text-xs sm:text-sm font-medium transition-all duration-300 outline-none border
                        ${isDark 
                          ? 'bg-[#111827] border-[#374151] text-[#FFFFFF] focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-violet-500' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-[4px] focus:ring-[#7C3AED]/18 focus:border-violet-500'
                        }`}
                      placeholder=" "
                    />
                    <label 
                      htmlFor="combo-email-field"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold pointer-events-none transition-all duration-300
                        peer-placeholder-shown:text-sm peer-placeholder-shown:top-1/2
                        peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-[#7C3AED]
                        ${contactEmail ? 'top-2.5 text-[10px]' : ''}
                        ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}
                    >
                      {language === 'bn' ? 'ইমেল ঠিকানা (ডেলিভারির ইনভয়েস পাওয়ার জন্য)' : language === 'ar' ? 'البريد الإلكتروني للفواتير' : 'Email Address (For invoice & delivery files)'}
                    </label>
                  </div>
                </div>
              </div>

              {/* DYNAMIC PRICE SUMMARY TABLE */}
              {(() => {
                const pricing = getComboPricing();
                return (
                  <div className={`p-4 sm:p-5 rounded-[20px] border space-y-3 ${
                    isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50/60 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-200/50 dark:border-white/5">
                      <span>{language === 'bn' ? 'হিসাব বিবরণী' : language === 'ar' ? 'ملخص الحساب والخصم' : 'Calculation & Saving Summary'}</span>
                      <span className="text-amber-500 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 animate-bounce" />
                        <span>{language === 'bn' ? `${pricing.savingsPercent}% ছাড় অন্তর্ভুক্ত` : language === 'ar' ? `خصم بقيمة ${pricing.savingsPercent}٪` : `${pricing.savingsPercent}% Instant Combo Discount Applied`}</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'bn' ? 'নরমাল মোট মূল্য' : 'Normal Standalone Total'}</span>
                        <span className="text-slate-400 line-through font-mono font-bold">
                          {getPriceInCurrency(pricing.totalOriginal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-500 font-bold">
                        <span>{language === 'bn' ? 'কম্বো স্পেশাল ডিসকাউন্ট' : 'Combo Package Bundle Discount'}</span>
                        <span className="font-mono">
                          - {getPriceInCurrency(pricing.savings)}
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-dashed border-slate-200/50 dark:border-white/5 flex justify-between items-center">
                        <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {language === 'bn' ? 'মোট প্রদেয় মূল্য' : 'Grand Combo Amount to Pay'}
                        </span>
                        <div className="text-right">
                          <span className="text-lg sm:text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                            {getPriceInCurrency(pricing.totalCombo)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* SUCCESS / ERROR FEEDBACK PANELS */}
              <AnimatePresence mode="wait">
                {comboError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl border bg-[#FEE2E2] border-[#EF4444] text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{comboError}</span>
                  </motion.div>
                )}

                {comboSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl border bg-[#DCFCE7] border-[#22C55E] text-emerald-800 dark:text-emerald-400 text-xs font-semibold flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#22C55E]" />
                    <div className="space-y-0.5 text-left">
                      <p className="font-bold">{language === 'bn' ? 'অভিনন্দন! আপনার কম্বো অফারটি বুক করা হয়েছে!' : 'Congratulations! Your Mega Combo has been Secured!'}</p>
                      <p className="text-[10.5px] opacity-90">
                        {language === 'bn' 
                          ? 'মেগা কম্বো প্যাকেজটি আপনার ডিজিটাল কার্টে যোগ করা হয়েছে। চেকআউট সম্পন্ন করার সাথে সাথেই আমাদের ইঞ্জিনিয়ার প্রজেক্ট শুরু করবেন।' 
                          : 'The package has been successfully added to your shopping cart. As soon as checkout completes, our deployment queue will initiate setups.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION BUTTON & SUBMISSION */}
              <div className="relative">
                {comboSubmitting ? (
                  <div className="w-full h-[54px] rounded-[14px] bg-slate-900/10 dark:bg-white/5 animate-pulse flex items-center justify-center text-xs font-bold text-slate-500 gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-violet-500" />
                    <span>Securing Combo Package Allocation...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full h-[54px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#7C3AED]/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <Zap className="w-4 h-4 fill-current group-hover:animate-bounce" />
                    <span>
                      {language === 'bn' ? 'সরাসরি কম্বো অফারটি কার্টে যুক্ত করুন' : language === 'ar' ? 'تأمين العرض الميجا وإضافته للسلة' : 'SECURE MEGA COMBO BONANZA DEAL 🚀'}
                    </span>
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>

        {/* 8. TRUST BADGES SECTION */}
        <div className={`py-6 border-t border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { title: "SSL Security", desc: "256-Bit SSL Protected", icon: ShieldCheck },
              { title: "Genuine File", desc: "100% Original Script", icon: Award },
              { title: "Satisfaction", desc: "Top Client Rating", icon: Star },
              { title: "Money Back", desc: "No Technical Risk", icon: RefreshCw },
              { title: "Quick Setup", desc: "Under 12hr Execution", icon: Clock }
            ].map((tb, idx) => {
              const IconComp = tb.icon;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-center">
                    <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/10">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <p className={`text-xs font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{tb.title}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light">{tb.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 11. PRODUCT SUPPORT CORE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          <div className={`p-5 rounded-2xl border transition space-y-3 ${
            isDark ? 'bg-[#0B0F19]/50 border-white/5 hover:border-indigo-500/20' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <MessageSquare className="w-8 h-8 text-indigo-500" />
            <h4 className={`text-xs font-black font-mono uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-805'}`}>WhatsApp Support Forum</h4>
            <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light">Direct technical conversation with engineers over +966570511931.</p>
          </div>
          <div className={`p-5 rounded-2xl border transition space-y-3 ${
            isDark ? 'bg-[#0B0F19]/50 border-white/5 hover:border-indigo-500/20' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <Clock className="w-8 h-8 text-emerald-500" />
            <h4 className={`text-xs font-black font-mono uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-805'}`}>24/7 Ticketing Desk</h4>
            <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light">Open secure troubleshooting requests within your customer panel anytime.</p>
          </div>
          <div className={`p-5 rounded-2xl border transition space-y-3 ${
            isDark ? 'bg-[#0B0F19]/50 border-white/5 hover:border-indigo-500/20' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <BookOpen className="w-8 h-8 text-pink-500" />
            <h4 className={`text-xs font-black font-mono uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-805'}`}>Documentation Wiki</h4>
            <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light">Interactive tutorials covering environment setups and API keys configuration.</p>
          </div>
          <div className={`p-5 rounded-2xl border transition space-y-3 ${
            isDark ? 'bg-[#0B0F19]/50 border-white/5 hover:border-indigo-500/20' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <Play className="w-8 h-8 text-amber-500" />
            <h4 className={`text-xs font-black font-mono uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-850'}`}>Video Walkthroughs</h4>
            <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light">Stuck? Follow YouTube tutorials displaying real host deployment guides.</p>
          </div>
        </div>

        {/* 9. SEARCHABLE FAQ SECTION (ACCORDION STYLE) */}
        <div className={`p-6 sm:p-8 rounded-3xl border text-left space-y-6 transition-all ${
          isDark ? 'bg-slate-900/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${
            isDark ? 'border-white/5' : 'border-slate-150'
          }`}>
            <div className="space-y-1">
              <h3 className={`text-lg font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                <span>Frequently Asked Questions</span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Find prompt help answers regarding script use, compatibility and updates.</p>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className={`w-full h-9 pl-9 pr-4 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-purple-500/18 transition-all ${
                  isDark 
                    ? 'bg-slate-950 border-white/5 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          <div className="space-y-3 max-w-4xl text-left">
            {filteredFaqs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No matches found for "{faqSearch}". Try searching other core terms.</p>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = activeFaqIdx === idx;
                return (
                  <div 
                    key={idx} 
                    className={`rounded-2xl border overflow-hidden transition-all ${
                      isDark ? 'border-white/5 bg-slate-950/20' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <button
                      onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                      className={`w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold transition cursor-pointer ${
                        isDark ? 'text-white hover:bg-slate-900/40' : 'text-slate-900 hover:bg-slate-100/50'
                      }`}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>
                    {isOpen && (
                      <div className={`p-4 border-t text-xs leading-relaxed font-light ${
                        isDark ? 'border-white/5 bg-slate-950/40 text-slate-300' : 'border-slate-150 bg-white text-slate-650'
                      }`}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 10. CUSTOMER REVIEWS & ADD REVIEW FEEDBACK */}
        <div className={`p-6 sm:p-8 rounded-3xl border text-left space-y-8 transition-all ${
          isDark ? 'bg-slate-900/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          
          <div className={`border-b pb-4 ${isDark ? 'border-white/5' : 'border-slate-150'}`}>
            <h3 className={`text-lg font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span>Certified Client Reviews</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Every comment represents a verified purchase audited via transaction receipts.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Reviews Summary Statistics */}
            <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col items-center text-center space-y-4 transition-all ${
              isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Aggregate Score</p>
              <div className="space-y-1">
                <p className={`text-4xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{product.rating}</p>
                <div className="flex items-center text-amber-500 gap-0.5 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Out of 5.0 maximum metric</p>
              </div>

              <div className={`w-full space-y-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                {[
                  { star: 5, pct: 85 },
                  { star: 4, pct: 10 },
                  { star: 3, pct: 5 },
                  { star: 2, pct: 0 },
                  { star: 1, pct: 0 }
                ].map(bar => (
                  <div key={bar.star} className="flex items-center gap-2.5 text-[10.5px] font-mono text-slate-400 dark:text-slate-500">
                    <span className="w-3 shrink-0 text-right">{bar.star}★</span>
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1E293B]' : 'bg-slate-200'}`}>
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${bar.pct}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-left">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List & Post form */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Review Feed list */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {mergedReviews.map((rev) => (
                  <div key={rev.id} className={`p-4 rounded-2xl border space-y-3 transition-all ${
                    isDark ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50/80 border-slate-150'
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={rev.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} 
                          alt={rev.userName} 
                          className="w-8 h-8 rounded-full border border-white/10"
                        />
                        <div className="text-left">
                          <p className={`text-xs font-bold font-mono flex flex-wrap items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <span>{rev.userName}</span>
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold rounded flex items-center gap-0.5 font-sans">
                              <ShieldCheck className="w-2.5 h-2.5 fill-current" />
                              <span>Verified Buyer</span>
                            </span>
                            {rev.approved === false && (
                              <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[8px] font-bold rounded flex items-center gap-0.5 font-sans animate-pulse">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Awaiting Approval</span>
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{rev.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className={`text-xs font-light leading-relaxed text-left pl-10 ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                      {rev.comment}
                    </p>
                    {/* Render uploaded image if present in review */}
                    {rev.id.toString().startsWith('rev-man') && (
                      <div className="pl-10">
                        <div className="relative w-16 aspect-video rounded-lg overflow-hidden border border-white/10 mt-1">
                          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80" alt="Voucher uploaded" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add feedback reviews Form - Styled EXACTLY as FORM CONTAINER */}
              <form 
                onSubmit={handleReviewSubmit} 
                className={`p-6 rounded-[20px] border shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-4 text-left transition-all ${
                  isDark ? 'bg-[#0F172A] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <p className={`text-xs font-black font-mono uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>Write a Verified Buyer Review</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name Input with Floating-style Label */}
                  <div className="space-y-1.5 text-left">
                    <label className={`text-xs font-semibold block ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>Your Full Name:</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Imran Hasan"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className={`w-full h-14 px-4 rounded-[14px] font-medium transition-all duration-300 outline-none border focus:ring-4 focus:ring-[rgba(124,58,237,0.18)] ${
                        isDark 
                          ? 'bg-[#111827] border-[#374151] text-white placeholder-slate-600 focus:border-[#A855F7]' 
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:border-[#7C3AED]'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className={`text-xs font-semibold block ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>Review Rating:</label>
                    <div className="flex items-center gap-1.5 h-14">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setNewRating(num)}
                          className="p-1 text-amber-500 focus:outline-none hover:scale-110 transition cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${num <= newRating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Textarea with premium height & focus */}
                <div className="space-y-1.5 text-left">
                  <label className={`text-xs font-semibold block ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>Share your detailed experience:</label>
                  <textarea
                    rows={4}
                    placeholder="Describe core highlights, setup speeds, code layout or customization guidance..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={`w-full min-h-[140px] p-4 rounded-[14px] font-medium transition-all duration-300 outline-none border resize-y focus:ring-4 focus:ring-[rgba(124,58,237,0.18)] ${
                      isDark 
                        ? 'bg-[#111827] border-[#374151] text-white placeholder-slate-600 focus:border-[#A855F7]' 
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:border-[#7C3AED]'
                    }`}
                  />
                </div>

                {/* Upload screenshot inside review */}
                <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-3.5 py-2.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition border ${
                        isDark 
                          ? 'bg-slate-900 hover:bg-slate-800 border-white/5 text-slate-300' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Product Photo</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleReviewImageChange}
                    />
                    {uploadedReviewImage && (
                      <span className="text-[9px] text-indigo-500 font-mono">Photo attached ✓</span>
                    )}
                  </div>

                  {/* Primary button styled review submission */}
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs font-semibold transition hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-[0_12px_30px_rgba(124,58,237,0.18)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review Comment</span>
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

        {/* 12. RELATED PRODUCTS & BUNDLE COMBOS */}
        <div className="space-y-6 text-left">
          
          <div className={`border-b pb-3 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
            <h3 className={`text-lg font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-5 h-5 text-violet-500" />
              <span>Recommended Digital Solutions</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Related packages and templates frequently bought together for digital setups.</p>
          </div>

          {/* Combo Offer Row */}
          <div className={`p-6 rounded-3xl border grid grid-cols-1 md:grid-cols-12 gap-6 items-center transition-all ${
            isDark ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-indigo-500/10' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200/60 shadow-sm'
          }`}>
            <div className="md:col-span-8 space-y-2">
              <span className="px-2 py-0.5 bg-pink-500 text-white font-mono font-bold text-[8.5px] rounded tracking-widest uppercase">Combo Bundle Package</span>
              <h4 className={`text-sm sm:text-base font-extrabold ${isDark ? 'text-white' : 'text-indigo-950'}`}>
                Frequently Bought Together: {product.name} + Ultra-Fast NVMe SSD Web Hosting
              </h4>
              <p className={`text-xs font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Secure the script today together with our robust, LiteSpeed-caching premium SSD Web Hosting. We pre-install, configure, and activate SSL automatically. Save up to $15 extra!
              </p>
            </div>
            
            <div className="md:col-span-4 flex flex-col sm:flex-row items-center justify-end gap-4 shrink-0">
              <div className="text-center sm:text-right font-mono">
                <span className="text-[10px] text-slate-400 block">Bundle Price:</span>
                <span className="text-xl font-extrabold text-emerald-500 block">
                  {getPriceInCurrency((product.discountPrice || product.price) + 19)}
                </span>
                <span className="text-[9.5px] text-slate-400 dark:text-slate-500 line-through">
                  {getPriceInCurrency((product.price) + 39)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  addToCart(product, e);
                  // Simulate adding mock hosting product
                  const hostProd: Product = {
                    id: "srv-hosting",
                    name: "1 Year NVMe Cloud Hosting Starter Combo",
                    nameBn: "১ বছর এনভিএমই ক্লাউড হোস্টিং",
                    nameAr: "استضافة السحابية لمدة عام",
                    category: "hosting",
                    price: 39,
                    discountPrice: 19,
                    rating: 4.9,
                    reviewsCount: 15,
                    description: "High speed SSD hosting with cPanel",
                    descriptionBn: "",
                    descriptionAr: "",
                    features: [],
                    featuresBn: [],
                    featuresAr: [],
                    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=120&q=80",
                    demoUrl: "",
                    downloadUrl: "",
                    tags: [],
                    views: 100
                  };
                  addToCart(hostProd);
                  if (setCartOpen) setCartOpen(true);
                  triggerToast("✨ Added Combo Bundle: Script + NVMe Web Hosting with additional discount!");
                }}
                className="px-5 py-3.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg active:scale-95 whitespace-nowrap"
              >
                Buy Combo Deal
              </button>
            </div>
          </div>

          {/* Similar items row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedProducts.map(p => {
              const hasDiscount = p.discountPrice !== undefined && p.discountPrice < p.price;
              return (
                <motion.div
                  key={`rec-${p.id}`}
                  onClick={() => handleViewProduct(p)}
                  className="group relative flex flex-col justify-between bg-white dark:bg-[#0B0F19] rounded-[20px] border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer h-full text-left overflow-hidden"
                  whileHover={{ y: -4 }}
                >
                  {/* Badge */}
                  {p.badge && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[7px] font-mono font-black uppercase tracking-wider bg-indigo-600 text-white rounded-md z-10 shadow-xs">
                      {p.badge}
                    </span>
                  )}

                  {/* Image Cover */}
                  <div className="relative h-24 w-full overflow-hidden bg-slate-50 dark:bg-neutral-950">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Content Details */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-mono font-bold text-slate-400">
                        {getCategoryName(p.category)}
                      </span>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-neutral-100 line-clamp-1 group-hover:text-blue-500 transition-colors">
                        {language === 'bn' ? p.nameBn : language === 'ar' ? p.nameAr : p.name}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between gap-1.5">
                      <div className="flex flex-col">
                        {hasDiscount ? (
                          <>
                            <span className="text-[11px] font-extrabold font-mono text-emerald-500">
                              {getPriceInCurrency(p.discountPrice!)}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 line-through">
                              {getPriceInCurrency(p.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-[11px] font-extrabold font-mono text-slate-800 dark:text-neutral-200">
                            {getPriceInCurrency(p.price)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p, e);
                          triggerToast(`🛒 Added "${p.name}" to cart.`);
                        }}
                        className="p-1.5 bg-indigo-50 hover:bg-blue-600 dark:bg-indigo-950/40 dark:hover:bg-cyan-500/20 text-indigo-650 dark:text-indigo-305 hover:text-white dark:hover:text-cyan-400 rounded-lg border border-indigo-200/40 dark:border-indigo-900/40 hover:border-blue-600 transition-all duration-200 cursor-pointer hover:scale-105"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* MORE LIKE THIS SECTION */}
        <div id="more-like-this" className="space-y-6 text-left mt-12 pt-8 border-t border-slate-200/50 dark:border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'bn' ? 'সংশ্লিষ্ট পণ্য' : 'RECOMMENDED FOR YOU'}</span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'bn' ? 'অনুরূপ আরও কিছু প্রোডাক্ট' : 'More Like This'}
              </h3>
              <p className={`text-xs sm:text-sm font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'bn' 
                  ? 'আপনার প্রজেক্টের সাথে সামঞ্জস্যপূর্ণ সেরা ডিজিটাল সリューション এবং স্ক্রিপ্টসমূহ নিচে দেওয়া হল।' 
                  : 'Handpicked elite digital assets and premium source codes in the same class to accelerate your business.'}
              </p>
            </div>
            
            <button 
              onClick={onBack}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'Explore All Products'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreLikeThisProducts.map(p => {
              const hasDiscount = p.discountPrice !== undefined && p.discountPrice < p.price;
              return (
                <motion.div
                  key={`mlt-${p.id}`}
                  onClick={() => handleViewProduct(p)}
                  className={`group relative flex flex-col justify-between rounded-[24px] border cursor-pointer overflow-hidden transition-all duration-300 h-full ${
                    isDark 
                      ? 'bg-[#0F172A] border-white/5 hover:border-violet-500/30 hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)]' 
                      : 'bg-[#FFFFFF] border-slate-200/80 hover:border-violet-500/30 hover:shadow-[0_20px_50px_rgba(124,58,237,0.08)]'
                  }`}
                  whileHover={{ y: -6 }}
                >
                  {/* Floating Promo Tag */}
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-lg z-10 shadow-sm shadow-violet-500/20">
                      {p.badge}
                    </span>
                  )}

                  {/* Image cover with hover scale */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-50 dark:bg-neutral-950">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-[10px] font-bold text-white flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-xs">
                        <Eye className="w-3 h-3" />
                        <span>{p.views || 42} {language === 'bn' ? 'বার দেখা হয়েছে' : 'views'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content details inside the Card */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#7C3AED] dark:text-[#A855F7]">
                          {getCategoryName(p.category)}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] font-bold font-mono">{p.rating?.toFixed(1) || '5.0'}</span>
                        </div>
                      </div>
                      
                      <h4 className={`text-sm font-extrabold line-clamp-2 transition-colors duration-200 ${
                        isDark ? 'text-white group-hover:text-[#A855F7]' : 'text-slate-900 group-hover:text-[#7C3AED]'
                      }`}>
                        {language === 'bn' ? p.nameBn || p.name : language === 'ar' ? p.nameAr || p.name : p.name}
                      </h4>
                      
                      <p className={`text-[11px] leading-relaxed font-light line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'bn' ? p.descriptionBn || p.description : language === 'ar' ? p.descriptionAr || p.description : p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        {hasDiscount ? (
                          <>
                            <span className="text-sm font-extrabold font-mono text-emerald-500 tracking-tight">
                              {getPriceInCurrency(p.discountPrice!)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 line-through">
                              {getPriceInCurrency(p.price)}
                            </span>
                          </>
                        ) : (
                          <span className={`text-sm font-extrabold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {getPriceInCurrency(p.price)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                          triggerToast(language === 'bn' 
                            ? `🛒 "${p.nameBn || p.name}" কার্ট ফাইলে যোগ করা হয়েছে!` 
                            : `🛒 Added "${p.name}" to cart.`);
                        }}
                        className="w-9 h-9 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl shadow-md shadow-[#7C3AED]/20 transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 15. STICKY MOBILE BOTTOM BAR */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t p-3 flex items-center justify-between gap-4 lg:hidden backdrop-blur-xl transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19]/90 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
      }`}>
        <div className="text-left font-mono shrink-0">
          <p className="text-[10px] max-w-[120px] truncate font-sans font-bold">{product.name}</p>
          <span className="text-xs font-extrabold text-emerald-500">{getPriceInCurrency(product.discountPrice || product.price)}</span>
        </div>

        <div className="flex gap-2 flex-1 justify-end max-w-xs">
          <button
            onClick={() => window.open(product.demoUrl, '_blank')}
            className={`px-3.5 h-10 border rounded-xl text-[10px] font-bold flex items-center justify-center cursor-pointer transition active:scale-95 ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 border-white/5 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-700'
            }`}
          >
            Demo
          </button>
          <button
            onClick={openManualPaymentSheet}
            className="px-4 h-10 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-[10px] font-extrabold rounded-xl transition shadow-lg flex items-center justify-center cursor-pointer active:scale-95 flex-1"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          MANUAL PAYMENT VERIFICATION SYSTEM MODAL SHEET
          ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border text-left my-8 transition-all ${
                isDark ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-slate-200'
              }`}
              id="manual-payment-verification-panel"
            >
              
              {/* Header */}
              <div className={`p-6 border-b flex items-center justify-between transition-colors ${
                isDark ? 'border-white/5 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="space-y-0.5 text-left">
                  <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[8.5px] rounded uppercase tracking-wider">Manual Ledger Channel</span>
                  <h3 className={`text-base font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Wallet className="w-5 h-5 text-indigo-500" />
                    <span>Local Payment Verification</span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step indicator */}
              <div className={`grid grid-cols-3 border-b text-center font-mono text-[9px] font-bold text-slate-500 transition-colors ${
                isDark ? 'border-white/5 bg-slate-950/20' : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className={`py-2 border-r transition-colors ${paymentStep === 1 ? 'text-indigo-500 bg-indigo-500/5' : ''}`}>1. CHOOSE BANK/WALLET</div>
                <div className={`py-2 border-r transition-colors ${paymentStep === 2 ? 'text-indigo-500 bg-indigo-500/5' : ''}`}>2. SEND & UPLOAD RECEIPT</div>
                <div className={`py-2 transition-colors ${paymentStep === 3 ? 'text-indigo-500 bg-indigo-500/5' : ''}`}>3. AUDITING & DOWNLOAD</div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Step 1: Select payment method */}
                {paymentStep === 1 && (
                  <div className="space-y-4">
                    <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Choose your preferred payment gateway. We support direct transfers inside Bangladesh (৳) and Saudi Arabia (﷼) using secure instant mobile channels or local national banks.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      {[
                        { name: "bKash Wallet", label: "bKash Personal (৳)", desc: "Direct BDT Personal Send Money" },
                        { name: "Nagad Wallet", label: "Nagad Personal (৳)", desc: "Secure local Nagad money checkout" },
                        { name: "Cellfin Wallet", label: "Cellfin Transfer (৳)", desc: "Islami Bank mobile wallet payout" },
                        { name: "Al Rajhi Bank", label: "Al Rajhi Saudi 🇸🇦", desc: "Instant transfer with IBAN / SA code" },
                        { name: "STC Pay", label: "STC Pay Wallet 🇸🇦", desc: "Mobile wallet STC Saudi pay transfer" }
                      ].map(gt => (
                        <button
                          key={gt.name}
                          onClick={() => setSelectedGateway(gt.name)}
                          className={`p-4 rounded-2xl border text-left space-y-1 cursor-pointer transition-all duration-300 ${
                            selectedGateway === gt.name 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-500/15 font-semibold' 
                              : isDark
                                ? 'bg-slate-950 border-white/5 text-slate-350 hover:border-slate-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <p className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{gt.label}</p>
                          <p className="text-[10px] text-slate-550 leading-tight font-light">{gt.desc}</p>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      {/* Primary Button */}
                      <button
                        onClick={() => setPaymentStep(2)}
                        className="h-[54px] px-8 rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs font-semibold tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-[0_12px_30px_rgba(124,58,237,0.35)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                      >
                        <span>Continue to Send Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Upload receipt */}
                {paymentStep === 2 && (
                  <div className="space-y-4">
                    
                    {/* Display payment credentials */}
                    <div className={`p-4 rounded-2xl border space-y-2 text-xs transition-colors ${
                      isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <p className={`font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Info className="w-4 h-4 text-indigo-500" />
                        <span>Send Payment To:</span>
                      </p>
                      
                      {selectedGateway.includes('bKash') && (
                        <div className="space-y-1 text-left">
                          <p className={isDark ? 'text-slate-350' : 'text-slate-650'}>Wallet Number: <strong className={isDark ? 'text-white font-mono select-all' : 'text-slate-900 font-mono select-all'}>0186400 0005</strong> (bKash Personal)</p>
                          <p className="text-slate-400 dark:text-slate-500 leading-relaxed font-light">Instructions: Please perform a regular Send Money. Note down your Transaction ID.</p>
                        </div>
                      )}
                      {selectedGateway.includes('Nagad') && (
                        <div className="space-y-1 text-left">
                          <p className={isDark ? 'text-slate-350' : 'text-slate-650'}>Wallet Number: <strong className={isDark ? 'text-white font-mono select-all' : 'text-slate-900 font-mono select-all'}>0186400 0005</strong> (Nagad Personal)</p>
                          <p className="text-slate-400 dark:text-slate-500 leading-relaxed font-light">Instructions: Please perform a regular Send Money. Note down your Transaction ID.</p>
                        </div>
                      )}
                      {selectedGateway.includes('Cellfin') && (
                        <div className="space-y-1 text-left">
                          <p className={isDark ? 'text-slate-350' : 'text-slate-650'}>Cellfin ID/Number: <strong className={isDark ? 'text-white font-mono select-all' : 'text-slate-900 font-mono select-all'}>0186400 0005</strong></p>
                          <p className="text-slate-400 dark:text-slate-500 leading-relaxed font-light">Instructions: Initiate a secure mobile payment transfer inside Cellfin portal.</p>
                        </div>
                      )}
                      {selectedGateway.includes('Al Rajhi') && (
                        <div className="space-y-1 text-left">
                          <p className={isDark ? 'text-slate-350' : 'text-slate-650'}>Bank Account Name: <strong className={isDark ? 'text-white' : 'text-slate-900'}>MD IMRAN HOSSAIN</strong></p>
                          <p className={isDark ? 'text-slate-350' : 'text-slate-650'}>Account Number: <strong className={`font-mono select-all ${isDark ? 'text-white' : 'text-slate-900'}`}>621000010006086016528</strong></p>
                          <p className={isDark ? 'text-slate-350' : 'text-slate-650'}>IBAN: <strong className={`font-mono select-all ${isDark ? 'text-white' : 'text-slate-900'}`}>SA56 8000 0621 6080 1601 6528</strong></p>
                          <p className="text-slate-400 dark:text-slate-500 leading-relaxed font-light font-mono">SWIFT Code: RJHISARI</p>
                        </div>
                      )}
                      {selectedGateway.includes('STC Pay') && (
                        <div className="space-y-1 text-left">
                          <p className={isDark ? 'text-slate-350' : 'text-slate-650'}>STC Pay Number: <strong className={isDark ? 'text-white font-mono select-all' : 'text-slate-900 font-mono select-all'}>+966 57 051 1931</strong></p>
                          <p className="text-slate-400 dark:text-slate-500 leading-relaxed font-light">Instructions: Transfer via STC Pay mobile app directly to our wallet.</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-dashed border-slate-300 dark:border-white/10 font-mono text-center space-y-1">
                        <p className="text-[11.5px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                          💰 Advance Payable ({advancePercent}%): {getPriceInCurrency(((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense]) * (advancePercent / 100))}
                        </p>
                        {advancePercent < 100 && (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                            Total Price: {getPriceInCurrency((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense])} • Due Remaining: {getPriceInCurrency(((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense]) * ((100 - advancePercent) / 100))}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Premium Scan & Pay QR Code Generator */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-4 ${
                      isDark 
                        ? 'bg-[#111827]/70 border-white/10 backdrop-blur-[20px]' 
                        : 'bg-white/90 border-slate-200 backdrop-blur-[20px]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-indigo-500 animate-pulse" />
                          <span className={`text-xs font-black tracking-wider uppercase bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-clip-text text-transparent`}>
                            Scan & Pay Dynamic QR
                          </span>
                        </div>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono animate-pulse">
                          ● Dynamic Live
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        {/* Left Column: QR Code Display Card */}
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-100/40 dark:bg-slate-950/60 border border-neutral-200 dark:border-white/5 relative group">
                          {/* Colored dynamic frame border representing brand */}
                          <div className={`absolute -inset-[1px] rounded-xl opacity-20 group-hover:opacity-45 transition-all duration-500 blur-sm bg-gradient-to-r ${
                            qrMode === 'royal' ? 'from-purple-600 to-indigo-600' :
                            qrMode === 'slate' ? 'from-slate-700 to-slate-900' :
                            selectedGateway.includes('bKash') ? 'from-[#d1245e] to-pink-500' :
                            selectedGateway.includes('Nagad') ? 'from-[#f15a22] to-orange-500' :
                            selectedGateway.includes('Cellfin') ? 'from-[#0081d6] to-sky-500' :
                            selectedGateway.includes('Al Rajhi') ? 'from-[#004b87] to-blue-500' : 'from-[#4f1153] to-purple-800'
                          }`}></div>

                          <div className="relative bg-white p-3 rounded-lg shadow-md max-w-[170px] aspect-square flex flex-col items-center justify-center">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${
                                qrMode === 'royal' ? '7c3aed' :
                                qrMode === 'slate' ? '0f172a' :
                                selectedGateway.includes('bKash') ? 'd1245e' :
                                selectedGateway.includes('Nagad') ? 'f15a22' :
                                selectedGateway.includes('Cellfin') ? '0081d6' :
                                selectedGateway.includes('Al Rajhi') ? '004b87' : '4f1153'
                              }&data=${encodeURIComponent(
                                qrType === 'tel' 
                                  ? (selectedGateway.includes('Al Rajhi') ? 'SA5680000621608016016528' : selectedGateway.includes('STC Pay') ? '+966570511931' : '01864000005')
                                  : qrType === 'invoice'
                                    ? `WebzoneBD Invoice\nAsset: ${product.name}\nPrice: ${getPriceInCurrency((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense])}\nWallet: ${selectedGateway.includes('Al Rajhi') ? '621000010006086016528' : selectedGateway.includes('STC Pay') ? '+966 57 051 1931' : '0186400 0005'}`
                                    : `Pay ${getPriceInCurrency((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense])} via ${selectedGateway} to ${selectedGateway.includes('Al Rajhi') ? '621000010006086016528' : selectedGateway.includes('STC Pay') ? '+966 57 051 1931' : '0186400 0005'}`
                              )}`}
                              alt={`${selectedGateway} QR Code`}
                              className="w-36 h-36 object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                            <div className="mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                              <span className="text-[8px] font-bold text-slate-400 font-mono uppercase">Verified Gateway</span>
                            </div>
                          </div>

                          {/* Action Buttons underneath QR Code */}
                          <div className="w-full mt-3 flex gap-2 justify-center">
                            <button
                              type="button"
                              onClick={async () => {
                                const qrHEX = 
                                  qrMode === 'royal' ? '7c3aed' :
                                  qrMode === 'slate' ? '0f172a' :
                                  selectedGateway.includes('bKash') ? 'd1245e' :
                                  selectedGateway.includes('Nagad') ? 'f15a22' :
                                  selectedGateway.includes('Cellfin') ? '0081d6' :
                                  selectedGateway.includes('Al Rajhi') ? '004b87' : '4f1153';
                                const qrPayload = 
                                  qrType === 'tel' 
                                    ? (selectedGateway.includes('Al Rajhi') ? 'SA5680000621608016016528' : selectedGateway.includes('STC Pay') ? '+966570511931' : '01864000005')
                                    : qrType === 'invoice'
                                      ? `WebzoneBD Invoice\nAsset: ${product.name}\nPrice: ${getPriceInCurrency((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense])}\nWallet: ${selectedGateway.includes('Al Rajhi') ? '621000010006086016528' : selectedGateway.includes('STC Pay') ? '+966 57 051 1931' : '0186400 0005'}`
                                      : `Pay ${getPriceInCurrency((product.discountPrice || product.price) * licensePriceMultiplier[selectedLicense])} via ${selectedGateway} to ${selectedGateway.includes('Al Rajhi') ? '621000010006086016528' : selectedGateway.includes('STC Pay') ? '+966 57 051 1931' : '0186400 0005'}`;
                                const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${qrHEX}&data=${encodeURIComponent(qrPayload)}`;
                                try {
                                  const response = await fetch(qrImg);
                                  const blob = await response.blob();
                                  const blobUrl = URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = blobUrl;
                                  link.download = `${selectedGateway.replace(/\s+/g, '_')}_QR.png`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  URL.revokeObjectURL(blobUrl);
                                  triggerToast(language === 'bn' ? "QR কোডটি সফলভাবে ডাউনলোড হয়েছে!" : "QR Code downloaded successfully! 📲");
                                } catch (err) {
                                  window.open(qrImg, '_blank');
                                  triggerToast(language === 'bn' ? "নতুন ট্যাবে QR কোড ওপেন করা হয়েছে!" : "QR Code opened in a new tab!");
                                }
                              }}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-300 cursor-pointer ${
                                isDark 
                                  ? 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' 
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200'
                              }`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'ডাউনলোড QR' : 'Save QR'}</span>
                            </button>

                            {/* Direct launch app or code dial shortcut */}
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedGateway.includes('bKash')) {
                                  window.open('bkash://', '_blank');
                                  triggerToast(language === 'bn' ? "বিকাশ অ্যাপ ওপেন করার চেষ্টা করা হচ্ছে... অথবা ডায়াল করুন *247#" : "Attempting to open bKash App... or Dial *247#");
                                } else if (selectedGateway.includes('Nagad')) {
                                  window.open('nagad://', '_blank');
                                  triggerToast(language === 'bn' ? "নগদ অ্যাপ ওপেন করার চেষ্টা করা হচ্ছে... অথবা ডায়াল করুন *167#" : "Attempting to open Nagad App... or Dial *167#");
                                } else if (selectedGateway.includes('STC Pay')) {
                                  window.open('stcpay://', '_blank');
                                  triggerToast(language === 'bn' ? "STC Pay অ্যাপ ওপেন করা হচ্ছে..." : "Attempting to open STC Pay App...");
                                } else {
                                  navigator.clipboard.writeText(selectedGateway.includes('Al Rajhi') ? '621000010006086016528' : '01864000005');
                                  triggerToast(language === 'bn' ? "নাম্বার কপি হয়েছে! আপনার মোবাইল ব্যাংকিং অ্যাপ দিয়ে পে করুন।" : "Number copied! Paste inside your mobile banking app to pay.");
                                }
                              }}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-300 cursor-pointer ${
                                isDark 
                                  ? 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200'
                              }`}
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'অ্যাপে যান' : 'Pay via App'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Right Column: Customizer & Quick instructions */}
                        <div className="space-y-3.5 text-left">
                          {/* Customizer 1: Color / Theme select */}
                          <div className="space-y-1">
                            <label className={`text-[10px] font-bold tracking-wide uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {language === 'bn' ? 'QR কোড থিম:' : 'QR Code Visual Theme:'}
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'brand', label: language === 'bn' ? 'ব্র্যান্ড' : 'Brand' },
                                { id: 'royal', label: language === 'bn' ? 'রয়্যাল' : 'Royal' },
                                { id: 'slate', label: language === 'bn' ? 'ডার্ক' : 'Slate' },
                              ].map((themeOpt) => (
                                <button
                                  key={themeOpt.id}
                                  type="button"
                                  onClick={() => setQrMode(themeOpt.id as any)}
                                  className={`py-1.5 rounded-lg text-[9px] font-bold text-center border transition-all cursor-pointer ${
                                    qrMode === themeOpt.id
                                      ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400 font-extrabold shadow-sm'
                                      : isDark
                                        ? 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-slate-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                                  }`}
                                >
                                  {themeOpt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Customizer 2: QR Payload selection */}
                          <div className="space-y-1">
                            <label className={`text-[10px] font-bold tracking-wide uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {language === 'bn' ? 'QR কোড ডাটা টাইপ:' : 'QR Code Data Payload:'}
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'invoice', label: language === 'bn' ? 'ইনভয়েস' : 'Invoice' },
                                { id: 'standard', label: language === 'bn' ? 'স্ট্যান্ডার্ড' : 'Standard' },
                                { id: 'tel', label: language === 'bn' ? 'টেলিফোন' : 'Number Only' },
                              ].map((typeOpt) => (
                                <button
                                  key={typeOpt.id}
                                  type="button"
                                  onClick={() => setQrType(typeOpt.id as any)}
                                  className={`py-1.5 rounded-lg text-[9px] font-bold text-center border transition-all cursor-pointer ${
                                    qrType === typeOpt.id
                                      ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-sm'
                                      : isDark
                                        ? 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-slate-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                                  }`}
                                >
                                  {typeOpt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Quick scanning tips block */}
                          <div className={`p-3 rounded-xl border text-[10.5px] space-y-1 leading-normal ${
                            isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-200/60'
                          }`}>
                            <p className="font-bold flex items-center gap-1 text-[9.5px] uppercase tracking-wider text-[#A855F7]">
                              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                              <span>{language === 'bn' ? 'মোবাইল ব্যাংকিং স্ক্যান নির্দেশিকা' : 'Mobile Scanning Guidelines'}</span>
                            </p>
                            <ol className={`list-decimal list-inside space-y-1 text-left ${isDark ? 'text-slate-450' : 'text-slate-550'}`}>
                              <li>{language === 'bn' ? 'আপনার মোবাইল ব্যাংকিং অ্যাপ ওপেন করুন' : 'Open your Bkash, Nagad or Banking app'}</li>
                              <li>{language === 'bn' ? 'স্ক্যান কিউআর (Scan QR) অপশন নির্বাচন করুন' : 'Tap on the "Scan QR" button'}</li>
                              <li>{language === 'bn' ? 'এই পেজের কিউআর কোডটি ক্যামেরার সামনে ধরুন' : 'Point camera to this dynamic code'}</li>
                              <li>{language === 'bn' ? 'টাকা এবং রেফারেন্স অটো-ফিল হবে, পিন দিয়ে সম্পূর্ণ করুন' : 'Validate total amount, enter PIN & pay!'}</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input sender details - with exact premium heights and floating style */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      <div className="space-y-1.5">
                        <label className={`text-[11px] font-bold block ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>Sender Wallet/Phone Number:</label>
                        <input
                          type="text"
                          placeholder="e.g. 01712345678"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          className={`w-full h-14 px-4 rounded-[14px] text-xs font-medium transition-all duration-300 outline-none border focus:ring-4 focus:ring-[rgba(124,58,237,0.18)] ${
                            isDark 
                              ? 'bg-[#111827] border-[#374151] text-white placeholder-slate-600 focus:border-[#A855F7]' 
                              : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:border-[#7C3AED]'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-[11px] font-bold block ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>Transaction ID (TxnID):</label>
                        <input
                          type="text"
                          placeholder="e.g. BKL1004523"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className={`w-full h-14 px-4 rounded-[14px] text-xs font-medium transition-all duration-300 outline-none border focus:ring-4 focus:ring-[rgba(124,58,237,0.18)] font-mono ${
                            isDark 
                              ? 'bg-[#111827] border-[#374151] text-white placeholder-slate-600 focus:border-[#A855F7]' 
                              : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:border-[#7C3AED]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Receipt voucher screenshot uploader */}
                    <div className="space-y-1.5 text-left">
                      <label className={`text-[11px] font-bold block ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>Upload screenshot / payment voucher:</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 relative ${
                          isDark
                            ? 'border-white/10 hover:border-indigo-500/30 bg-slate-950/40'
                            : 'border-slate-300 hover:border-indigo-500/50 bg-slate-50/50'
                        }`}
                      >
                        {receiptPreview ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="relative w-16 aspect-video rounded-lg overflow-hidden border border-white/10">
                              <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                              <p className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>voucher_receipt.png</p>
                              <p className="text-[10px] text-emerald-500 font-bold">Voucher attached successfully ✓</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                            <p className={`text-xs ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>Drag & Drop or Click to Upload Payment Receipt</p>
                            <p className="text-[9px] text-slate-400">Formats supported: JPG, PNG, WEBP (Max 4MB)</p>
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setReceiptPreview(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setPaymentStep(1)}
                        className={`px-5 h-11 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Back
                      </button>
                      
                      {/* Primary Button */}
                      <button
                        onClick={startVerificationProcess}
                        className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs font-bold transition-all duration-300 hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-[0_12px_30px_rgba(124,58,237,0.18)]"
                      >
                        <span>Submit for Verification</span>
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* Step 3: Verifying progress & Activation */}
                {paymentStep === 3 && (
                  <div className="space-y-6 py-4 text-center">
                    {verificationProgress < 100 ? (
                      <div className="space-y-4">
                        <div className="relative w-16 h-16 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-slate-950/20 dark:border-slate-900" />
                          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                        </div>
                        
                        <div className="space-y-2 max-w-sm mx-auto">
                          <p className={`text-sm font-black font-mono uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>Auditing Payment Ledger...</p>
                          <p className={`text-[11px] font-light leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            WebZoneBD instant payment verification engine is auditing bank API feeds to match Transaction ID <b>{transactionId}</b>. Please hold on.
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className={`max-w-xs mx-auto h-2 rounded-full overflow-hidden border ${
                          isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-100 border-slate-250'
                        }`}>
                          <div className="h-full bg-indigo-500 transition-all duration-350" style={{ width: `${verificationProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        {/* Success Message Block */}
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                          <CheckCircle className="w-8 h-8" />
                        </div>

                        <div className="space-y-2 max-w-md mx-auto">
                          <p className={`text-base font-black font-mono uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>VOUCHER APPROVED & DOWNLOAD ACTIVE!</p>
                          <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                            Assalamu Alaikum! Our manual checkout reconciliation cleared ledger balance. Your digital asset licenses are registered. You can download the zip package source code instantly from here or in your Customer Downloads panel.
                          </p>
                        </div>

                        {/* Download CTA */}
                        {activeDownloadUrl && (
                          <div className={`p-4 rounded-2xl border space-y-3 max-w-sm mx-auto ${
                            isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <p className={`text-[10px] font-mono text-left font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>🔐 SECURE ACTIVE ZIP LINK:</p>
                            <a
                              href={activeDownloadUrl}
                              download
                              className="h-11 w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download Source Package (.Zip)</span>
                            </a>
                            <button
                              onClick={() => {
                                setIsPaymentModalOpen(false);
                                onBack(); // Redirect user
                                triggerToast("Redirecting to your active download control dashboard...");
                              }}
                              className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold hover:underline block mx-auto pt-1 font-mono cursor-pointer"
                            >
                              Go to Customer Downloads Dashboard
                            </button>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------------------------------
          VIDEO PREVIEW MODAL PLAYER
          ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-black w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-900 hover:bg-rose-600 text-white rounded-full z-10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Product Video Walkthrough"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
