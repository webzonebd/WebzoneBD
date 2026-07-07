import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle, Globe, Terminal, Star, Clock, 
  ShoppingCart, MessageSquare, ArrowRight, MessageCircle, 
  PhoneCall, ShieldCheck, Zap, Laptop, Award, Gift, ChevronDown, 
  ChevronUp, Bell, Calendar, Mail, Check, X, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme, Currency } from '../types';

interface DigitalWebDevProps {
  language: Language;
  theme: Theme;
  currency: Currency;
  addSimulatedServiceOrder: (order: any) => void;
  triggerToast: (msg: string) => void;
  addToCart?: (product: any) => void;
  setCartOpen?: (open: boolean) => void;
}

const AnimatedPrice = ({ targetPrice, currency, translatePrice }: { targetPrice: number; currency: Currency; translatePrice: (p: number) => string }) => {
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetPrice;
    if (start === end) return;

    const duration = 1000; // 1 second
    const stepTime = 16; // ~60fps
    const totalSteps = duration / stepTime;
    const stepValue = end / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setDisplayPrice(end);
        clearInterval(timer);
      } else {
        setDisplayPrice(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetPrice]);

  return (
    <span>
      {translatePrice(displayPrice)}
    </span>
  );
};

export default function DigitalWebDevelopment({
  language,
  theme,
  currency,
  addSimulatedServiceOrder,
  triggerToast,
  addToCart,
  setCartOpen
}: DigitalWebDevProps) {

  // State managers
  const [isPricingLoading, setIsPricingLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsPricingLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedPackForOrder, setSelectedPackForOrder] = useState<any>(null);
  
  // Form states
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultDesc, setConsultDesc] = useState('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 5,
    minutes: 42,
    seconds: 19
  });

  // Currency Converter helper
  const translatePrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdtPrice / 115).toLocaleString()}`;
    } else if (currency === 'SAR') {
      return `SAR ${(Math.round(bdtPrice / 115) * 3.75).toFixed(0)}`;
    }
    return `৳${bdtPrice.toLocaleString()}`;
  };

  // Timer update
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Popup banner trigger on 10 seconds timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user has already dismissed or claimed
      const hasSeen = localStorage.getItem('webzone_newsletter_dismissed_2026');
      if (!hasSeen) {
        setNewsletterOpen(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleClaimOffer = (offerName: string) => {
    triggerToast(language === 'bn' 
      ? `🎉 অভিনন্দন! "${offerName}" বুকিং কোড আপনার মেল ও হোয়াটসঅ্যাপে পাঠানো হয়েছে।`
      : `🎉 Awesome! Your special coupon for "${offerName}" has been reserved.`);
    localStorage.setItem('webzone_newsletter_dismissed_2026', 'true');
    setNewsletterOpen(false);
  };

  // 3 Packages structure
  const packagesList = [
    {
      id: 'pkg-boost',
      icon: '🚀',
      badge: language === 'bn' ? '🔥 বেস্ট সেলার' : '🔥 Best Seller',
      hoverGradient: 'from-[#00E5FF] to-[#3B82F6]',
      color: 'from-[#00E5FF] to-[#3B82F6]',
      glow: 'shadow-[#00E5FF]/20',
      title: language === 'bn' ? 'ই-কমার্স বুস্ট প্যাকেজ' : 'E-Commerce Boost Package',
      price: 3999,
      regularPrice: 5000,
      delivery: '3-5 Working Days',
      deliveryBn: '৩-৫ কার্যদিবস',
      renewal: 2500,
      desc: language === 'bn' ? 'ফেসবুক ভিজিটরদের কাস্টমারে রূপান্তর করুন' : 'Turn Facebook Visitors Into Customers',
      features: [
        language === 'bn' ? 'ফ্রি .COM ডোমেইন রেজিস্ট্রেশন (১ বছর)' : 'Free .COM Domain Registration (1 Year)',
        language === 'bn' ? 'ফ্রি NVMe SSD হোস্টিং (১ বছর)' : 'Free NVMe SSD Hosting (1 Year)',
        language === 'bn' ? '১টি প্রোডাক্টের জন্য প্রিমিয়াম ল্যান্ডিং পেজ' : 'Premium Landing Page For 1 Product',
        language === 'bn' ? '১-ক্লিক অর্ডার ফর্ম' : 'One Click Order Form',
        language === 'bn' ? 'ক্যাশ অন ডেলিভারি সাপোর্ট' : 'Cash On Delivery Support',
        language === 'bn' ? 'ফেসবুক পিক্সেল সেটআপ' : 'Facebook Pixel Setup',
        language === 'bn' ? 'কনভার্সন এপিআই সেটআপ' : 'Conversion API Setup',
        language === 'bn' ? 'মোবাইল রেসপনসিভ ডিজাইন' : 'Mobile Responsive Design',
        language === 'bn' ? 'সুপার ফাস্ট লোডিং ওয়েবসাইট' : 'Fast Loading Website',
        language === 'bn' ? 'সম্পূর্ণ কাস্টমাইজেশন সুবিধা' : 'Full Customization',
        language === 'bn' ? '৭ দিনের ফ্রি টেকনিক্যাল সাপোর্ট' : '7 Days Free Technical Support'
      ]
    },
    {
      id: 'pkg-corp',
      icon: '🏢',
      badge: language === 'bn' ? '🏆 বিজনেস চয়েস' : '🏆 Business Choice',
      hoverGradient: 'from-[#7C3AED] to-[#EC4899]',
      color: 'from-[#7C3AED] to-[#EC4899]',
      glow: 'shadow-[#7C3AED]/20',
      title: language === 'bn' ? 'প্রফেশনাল বিজনেস প্যাকেজ' : 'Professional Business Package',
      price: 7499,
      regularPrice: 10000,
      delivery: '5-7 Working Days',
      deliveryBn: '৫-৭ কার্যদিবস',
      renewal: 3000,
      desc: language === 'bn' ? 'অনলাইনে বিশ্বাসযোগ্যতা বাড়ান এবং ব্র্যান্ড বড় করুন' : 'Build Trust & Grow Your Brand Online',
      features: [
        language === 'bn' ? 'ফ্রি .COM ডোমেইন রেজিস্ট্রেশন (১ বছর)' : 'Free .COM Domain Registration (1 Year)',
        language === 'bn' ? 'ফ্রি BDiX হোস্টিং (১ বছর)' : 'Free BDiX Hosting (1 Year)',
        language === 'bn' ? '৫ পেজ পর্যন্ত ওয়েবসাইট (হোম, আমাদের সম্পর্কে, সেবা, গ্যালারি, যোগাযোগ)' : 'Up To 5 Pages Website (Home, About, Services, Gallery, Contact)',
        language === 'bn' ? 'বিজনেস ইমেইল সেটআপ' : 'Business Email Setup',
        language === 'bn' ? 'গুগল ম্যাপস ইন্টিগ্রেশন' : 'Google Maps Integration',
        language === 'bn' ? 'যোগাযোগ ফর্ম (Contact Form)' : 'Contact Form',
        language === 'bn' ? 'সোশ্যাল মিডিয়া ইন্টিগ্রেশন' : 'Social Media Integration',
        language === 'bn' ? 'এসইও ফ্রেন্ডলি স্ট্রাকচার' : 'SEO Friendly Structure',
        language === 'bn' ? 'মোবাইল রেসপনসিভ ডিজাইন' : 'Mobile Responsive Design',
        language === 'bn' ? 'সম্পূর্ণ কাস্টমাইজেশন সুবিধা' : 'Full Customization',
        language === 'bn' ? '১ মাসের ফ্রি টেকনিক্যাল সাপোর্ট' : '1 Month Free Technical Support'
      ]
    },
    {
      id: 'pkg-shop',
      icon: '🛍️',
      badge: language === 'bn' ? '⭐ সবচেয়ে জনপ্রিয়' : '⭐ Most Popular',
      hoverGradient: 'from-[#10B981] to-[#06B6D4]',
      color: 'from-[#10B981] to-[#06B6D4]',
      glow: 'shadow-[#10B981]/20',
      title: language === 'bn' ? 'ডিজিটাল ই-কমার্স প্যাকেজ' : 'Digital eCommerce Package',
      price: 12999,
      regularPrice: 16000,
      delivery: '5-7 Working Days',
      deliveryBn: '৫-৭ কার্যদিবস',
      renewal: 3200,
      desc: language === 'bn' ? 'পেশাদার ব্র্যান্ডের মতো আপনার অনলাইন স্টোর চালু করুন' : 'Launch Your Online Store Like A Professional Brand',
      features: [
        language === 'bn' ? 'ফ্রি .COM ডোমেইন রেজিস্ট্রেশন' : 'Free .COM Domain Registration',
        language === 'bn' ? 'ফ্রি প্রিমিয়াম BDiX হোস্টিং' : 'Free Premium BDiX Hosting',
        language === 'bn' ? 'আনলিমিটেড প্রোডাক্ট আপলোড সুবিধা' : 'Unlimited Product Upload Facility',
        language === 'bn' ? 'প্রাথমিক ১৫টি প্রোডাক্ট আপলোড (WebzoneBD দ্বারা)' : 'Initial 15 Products Uploaded By WebzoneBD',
        language === 'bn' ? 'বিকাশ ইন্টিগ্রেশন' : 'bKash Integration',
        language === 'bn' ? 'নগদ ইন্টিগ্রেশন' : 'Nagad Integration',
        language === 'bn' ? 'রকেট ইন্টিগ্রেশন' : 'Rocket Integration',
        language === 'bn' ? 'স্বয়ংক্রিয় অর্ডার ম্যানেজমেন্ট' : 'Automated Order Management',
        language === 'bn' ? 'ইনভয়েস সিস্টেম' : 'Invoice System',
        language === 'bn' ? 'কুরিয়ার ইন্টিগ্রেশন রেডি' : 'Courier Integration Ready',
        language === 'bn' ? 'কাস্টমার ড্যাশবোর্ড' : 'Customer Dashboard',
        language === 'bn' ? 'মোবাইল ফ্রেন্ডলি ডিজাইন' : 'Mobile Friendly Design',
        language === 'bn' ? 'ওয়েবসাইট ম্যানেজমেন্ট ট্রেনিং' : 'Website Management Training',
        language === 'bn' ? '১ মাসের ফ্রি টেকনিক্যাল সাপোর্ট' : '1 Month Free Technical Support'
      ]
    }
  ];

  // Table rows structure for 3 packages
  const comparisonRows = [
    { feature: language === 'bn' ? 'সার্ভিস প্রাইস' : 'Starting Price', p1: '৳3,999', p2: '৳7,499', p3: '৳12,999' },
    { feature: language === 'bn' ? 'ফ্রি ডোমেইন (১ বছর)' : 'Free Domain (1 Yr)', p1: '✔', p2: '✔', p3: '✔' },
    { feature: language === 'bn' ? 'SSD ক্লাউড হোস্টিং' : 'Cloud Hosting (1 Yr)', p1: '✔ NVMe SSD', p2: '✔ BDiX', p3: '✔ Premium BDiX' },
    { feature: language === 'bn' ? 'পণ্য আপলোড সুবিধা' : 'Product Upload', p1: '1 Landing Page', p2: 'Up to 5 Pages', p3: 'Unlimited (15 by us)' },
    { feature: language === 'bn' ? 'পেমেন্ট মেথড সাপোর্ট' : 'Payment Methods', p1: 'COD Form', p2: 'Contact Form', p3: 'bKash/Nagad/Rocket' },
    { feature: language === 'bn' ? 'পিক্সেল ও কনভার্সন এপিআই' : 'Pixel & Conversion API', p1: '✔ Premium', p2: '✗', p3: '✔ Custom' },
    { feature: language === 'bn' ? 'গুগল ম্যাপস ইন্টিগ্রেশন' : 'Google Maps Integration', p1: '✗', p2: '✔ Standard', p3: '✔ Embed' },
    { feature: language === 'bn' ? 'ইনভয়েস ও ড্যাশবোর্ড' : 'Invoice & Dashboard', p1: '✗', p2: '✗', p3: '✔ Client Portal' },
    { feature: language === 'bn' ? 'ফ্রি টেকনিক্যাল সাপোর্ট' : 'Free Technical Support', p1: '7 Days', p2: '1 Month', p3: '1 Month + Training' },
    { feature: language === 'bn' ? 'ডেলিভারি সময়সীমা' : 'Delivery Timeline', p1: '3-5 Days', p2: '5-7 Days', p3: '5-7 Days' }
  ];

  // Review sliding carousel data
  const clientReviews = [
    {
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      name: language === 'bn' ? 'আরিফুর রহমান' : 'Arifur Rahman',
      role: language === 'bn' ? 'প্রোপ্রাইটর, ফ্যাশন হাউজ বিডি' : 'Proprietor, Fashion House BD',
      review: language === 'bn' ? 'ই-কমার্স বুস্ট প্যাকেজ দিয়ে শুরু করেছিলাম। ওয়েবসাইট যেমন সুন্দর তেমনি সুপারডুপার ফাস্ট! আমার ফেসবুক ট্রাফিক থেকে ল্যান্ডিং পেজ দিয়ে প্রতিদিন ১২০+ অর্ডার জেনারেট হচ্ছে।' : 'Outstanding performance! The Ecommerce boost page loaded in less than 0.8 seconds and doubled our regular order counts instantly.'
    },
    {
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      name: language === 'bn' ? 'সায়মা আক্তার' : 'Saima Akter',
      role: language === 'bn' ? 'ফাউন্ডার, অর্গানিক অর্চার্ড' : 'Founder, Organic Orchard',
      review: language === 'bn' ? 'পেমেন্ট গেটওয়ে সহ ডিজিটাল শপ প্যাকেজটি অসাধারণ। গ্রাহকরা খুব সহজেই স্বয়ংক্রিয়ভাবে অর্ডার প্লেস করে বিকাশ এ পেমেন্ট করে দিচ্ছে। ধন্যবাদ ওয়েবজোনবিডি।' : 'Integrating automatic local payment gateways with user-friendly dashboards completely saved our operation times. Best agency in Bangladesh.'
    },
    {
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      name: language === 'bn' ? 'ইঞ্জিঃ হাসান তালুকদার' : 'Engr. Hasan Talukdar',
      role: language === 'bn' ? 'ব্যবস্থাপনা পরিচালক, গ্রীন প্রোপার্টিজ' : 'Managing Director, Green Properties',
      review: language === 'bn' ? 'আমাদের নতুন প্রজেক্টের জন্য কর্পোরেট সাইটের কাজ করিয়েছি। এদের কাজের মান যেমন অত্যন্ত পেশাদার ঠিক তেমনি কাস্টমার সাপোর্ট সার্ভিস খুবই দ্রুত!' : 'Superb corporate design. It reflects our real estate identity beautifully and the premium speed optimizations made Google index our keywords immediately.'
    }
  ];

  // Faq accordion list
  const faqsList = [
    {
      q: language === 'bn' ? 'ওয়েবসাইট তৈরি করার পর কি ডোমেইল ও হোস্টিং প্রতি বছর রিনিউ করতে হবে?' : 'Do I need to renew the domain and hosting next year?',
      a: language === 'bn' ? 'হ্যাঁ, ডোমেইন এবং ক্লাউড হোস্টিং সার্ভিস প্রতি বছর সক্রিয় রাখার জন্য খুবই স্বল্প মূল্যে রিনিউ করতে হবে। আমাদের ডোমেইন রিনিউ মাত্র ১০০০৳/বছর এবং প্রিমিয়াম স্পিড ক্লাউড হোস্টিং ১২০০৳/বছর।' : 'Yes, domain registry and premium cloud hosting rely on active yearly cycles. We secure renewal charges at competitive market pricing with zero setup fee surprises later.'
    },
    {
      q: language === 'bn' ? 'অর্ডার করার পর ডেলিভারি হতে সাধারণত কত দিন সময় লাগবে?' : 'What is the package delivery time?',
      a: language === 'bn' ? 'আমাদের ফাস্ট-ট্র্যাক ইন্টেলিজেন্ট সিস্টেমের মাধ্যমে কাজ চলমান থাকে। সাধারণ ল্যান্ডিং পেজ ৩ দিন, কর্পোরেট ওয়েবসাইট ৫ দিন এবং ডাইনামিক ই-কমার্স সিস্টেম ৭ দিনের মাঝে সম্পন্ন হয়ে লাইভ হয়ে যাবে।' : 'Fastest response in the country. Static landing pages deploy in under 72 hours, corporate portals in 5 business days, and complete automated digital storefronts with checkout integrations within 7 days.'
    },
    {
      q: language === 'bn' ? 'আমি কি পরবর্তীতে আমার প্যাকেজে নতুন কাস্টম ফিচার যুক্ত করতে পারব?' : 'Can I add custom features in the future?',
      a: language === 'bn' ? 'অবশ্যই! আমাদের ডেভেলপাররা কাস্টম মডিউল সিস্টেমে সাইট তৈরি করেন। যার ফলে যেকোনো সময় আপনি আপনার সুবিধামতো নতুন যেকোনো সলিউশন বা এপিআই ইন্টিগ্রেট করে নিতে পারবেন উইদাউট কোনো সমস্যা।' : 'Absolutely. Our systems are built completely modular on React/Laravel frameworks, meaning you can plug in additional widgets, advanced dashboards, or multi-vendor layouts seamlessly later.'
    },
    {
      q: language === 'bn' ? 'গুগল ম্যাপে আমার ব্যবসা প্রতিষ্ঠা করার পর কি ভেরিফিকেশনের জন্য হেল্প পাব?' : 'Do you help with Google Maps Verification?',
      a: language === 'bn' ? 'হ্যাঁ, গুগল ম্যাপস ও গুগল মাই বিজনেস স্পেশালিস্টরা সরাসরি আপনার প্রোফাইল কাস্টমাইজ করে সাবমিট করবেন যাতে আপনার লোকেশনটি দ্রুত এবং নির্বিঘ্নে ভেরিফাইড হয়ে ম্যাপে লাইভ বা ভিজিবল হয়।' : 'Our elite listing team configures absolute accurate postal and geolocation metadata, helping bypass typical verification hurdles and ranking your spot prominently.'
    }
  ];

  const handleOrderNowClick = (pkg: any) => {
    if (addToCart) {
      // Calculate active base USD price so that the Cart converts it exactly to the correct displayed price
      let baseUSDPrice = pkg.price / 118.5; // Default BDT rate fallback
      
      let bdtRate = 118.5;
      try {
        const saved = localStorage.getItem('webzone_custom_currency_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.rates) {
            bdtRate = parsed.rates.BDT || 118.5;
          }
        }
      } catch (e) {}

      if (currency === 'BDT') {
        baseUSDPrice = pkg.price / bdtRate;
      } else if (currency === 'USD') {
        baseUSDPrice = Math.round(pkg.price / 115);
      } else if (currency === 'SAR') {
        baseUSDPrice = Math.round(pkg.price / 115);
      }

      const packageProductRepresentation = {
        id: `webdev-${pkg.id}`,
        name: pkg.title,
        nameBn: pkg.title,
        nameAr: pkg.title,
        category: 'laravel' as any, // Cast to any or standard category
        price: baseUSDPrice,
        discountPrice: undefined,
        rating: 5.0,
        reviewsCount: 154,
        description: pkg.desc,
        descriptionBn: pkg.desc,
        descriptionAr: pkg.desc,
        features: pkg.features,
        featuresBn: pkg.features,
        featuresAr: pkg.features,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
        demoUrl: 'https://demo.webzonebd.com',
        downloadUrl: 'https://webzonebd.com',
        tags: ['Web Development', 'Premium Package'],
        views: 280
      };

      addToCart(packageProductRepresentation);

      if (setCartOpen) {
        setCartOpen(true);
      }
      
      triggerToast(language === 'bn' 
        ? `🛒 "${pkg.title}" কার্টে যোগ করা হয়েছে এবং চেকআউট স্লাইডার চালু হয়েছে!` 
        : `🛒 "${pkg.title}" added to shopping cart! Opening checkout drawer...`
      );
    } else {
      setSelectedPackForOrder(pkg);
      setOrderModalOpen(true);
    }
  };

  const submitDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackForOrder) return;

    addSimulatedServiceOrder({
      id: "ord-webdev-" + Date.now(),
      serviceId: selectedPackForOrder.id,
      itemTitle: `${selectedPackForOrder.title} (Ultra-Premium Setup)`,
      price: selectedPackForOrder.price / 115, // standard USD base
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "Interactive SSL Web Checkout",
      paymentStatus: 'pending'
    });

    triggerToast(language === 'bn' 
      ? `🎉 অভিন্দন! "${selectedPackForOrder.title}" পেমেন্ট সিঙ্ক সম্পন্ন হয়েছে। আমাদের ডেভ ট্র্যাকিং ইউনিট খুব শীঘ্রই আপনার সাথে হোয়াটসঅ্যাপে যুক্ত হবে।`
      : `🎉 Superb! Secure checkout for "${selectedPackForOrder.title}" registered successfully.`);
    setOrderModalOpen(false);
  };

  const handleSendFormConsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName || !consultPhone) {
      triggerToast(language === 'bn' ? 'দয়া করে আপনার নাম এবং মোবাইল নম্বরটি লিখুন।' : 'Name and Contact No are required.');
      return;
    }

    triggerToast(language === 'bn' 
      ? '✉️ আসসালামু আলাইকুম! আপনার কন্সালটেশন রিকোয়েস্ট সফলভাবে সাবমিট হয়েছে। আমাদের ডিজিটাল এনালিস্ট ১৫ মিনিটে হোয়াটসঅ্যাপে নক করবেন।'
      : '✉️ Done! Your free consultation schedule is registered with WebzoneBD specialists.');
    
    setConsultModalOpen(false);
    // Reset fields
    setConsultName('');
    setConsultPhone('');
    setConsultEmail('');
    setConsultDesc('');
  };

  return (
    <div className="relative overflow-hidden w-full transition-colors duration-300">
      
      {/* BACKGROUND MOVING AURORA LIGHT MESH EFFECTS */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-20 left-10 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-cyan-400/5 dark:bg-cyan-500/10 blur-[80px] sm:blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] right-10 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-violet-400/5 dark:bg-purple-600/10 blur-[100px] sm:blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-pink-400/5 dark:bg-pink-500/5 blur-[80px] sm:blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 space-y-16 sm:space-y-24">

        {/* 1. HERO SECTION WITH GLASSMORPHISM & PARALLAX */}
        <section className="relative text-center max-w-5xl mx-auto space-y-6 pt-6 sm:pt-10">
          
          {/* Animated Glow Border Badge On Top */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black font-sans uppercase tracking-wider text-cyan-600 bg-cyan-100/60 dark:text-cyan-400 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>{language === 'bn' ? '🔥 সীমিত সময়ের বিশেষ ব্যবসা অফার' : '🔥 Limited Time Business Offers'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.05]">
            {language === 'bn' ? 'নতুন ব্যবসা শুরু করুন ও স্বাধীনভাবে ' : 'Digital Solutions to Launch & '}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm font-sans">
              {language === 'bn' ? 'অনলাইন ব্যবসা বৃদ্ধি করুন' : 'Grow Your Online Business'}
            </span>
          </h1>

          <p className="text-sm sm:text-lg max-w-3xl mx-auto text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
            {language === 'bn' 
              ? 'আপনার ব্র্যান্ডের বিশ্বাসযোগ্যতা বাড়াতে আমাদের ৫টি হাই-প্রিমিয়াম রেডি-টু-ইউজ প্যাকেজ থেকে আজই বেছে নিয়ে ডিজিটাল রূপান্তর শুরু করুন।' 
              : 'Launch, Grow & Scale Your Business Online with physical-world SLA guarantees, automated pixel features, and complete verified cloud setups from WebzoneBD-IT.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <a 
              href="#packages-grid"
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/10 hover:scale-102 hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)] transition transform active:scale-98 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 animate-bounce" />
              <span>{language === 'bn' ? '🚀 অল-ইন-ওয়ান প্যাকেজসমূহ' : '🚀 Explore Packages'}</span>
            </a>

            <button 
              onClick={() => setConsultModalOpen(true)}
              className="px-6 py-3.5 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-black text-xs sm:text-sm rounded-xl shadow-sm hover:scale-102 transition transform active:scale-98 flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              <span>{language === 'bn' ? '💬 ফ্রি ডেমো কনসালটেশন' : '💬 Free Consultation'}</span>
            </button>

            <a 
              href="https://wa.me/966570511931"
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:scale-102 transition flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'bn' ? '📞 সরাসরি যোগাযোগ' : '📞 Contact Us'}</span>
            </a>
          </div>

          {/* Trust Badges Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-10 max-w-4xl mx-auto border-t border-neutral-200/50 dark:border-neutral-900/60 text-left">
            {[
              { text: language === 'bn' ? '১০০+ সফল প্রজেক্ট কমপ্লিট' : '100+ Projects Completed', desc: language === 'bn' ? 'দেশী ও আন্তর্জাতিক ব্যবসা' : 'SaaS, Portals & Gigs' },
              { text: language === 'bn' ? '৫০০+ হ্যাপি গ্লোবাল ক্লায়েন্ট' : '500+ Happy Clients', desc: language === 'bn' ? '১২+ দেশে ২৪/৭ নির্ভরযোগ্যতা' : 'With 99% satisfaction' },
              { text: language === 'bn' ? '২৪/৭ ডেডিকেটেড লাইভ ডমেস্টিক সাপোর্ট' : '24/7 Domestic Support', desc: language === 'bn' ? '১০ মিনিটে সমাধান নিশ্চিত' : 'Experienced devs online' },
              { text: language === 'bn' ? 'সাশ্রয়ী কাস্টম বাজেট ফ্রেন্ডলি' : 'Affordable Reliable Pricing', desc: language === 'bn' ? 'কোনো হিডেন চার্জ ছাড়াই জিরো কমপ্লেক্স' : 'Zero hidden startup overhead' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50/50 dark:bg-[#0F172A]/40 border border-neutral-200/40 dark:border-slate-800/40">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11.5px] font-black text-neutral-900 dark:text-white leading-tight">{item.text}</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. SERVICES GRID: PREMIUM ANIMATED GLASSMORPHISM CARDS */}
        <section id="packages-grid" className="relative space-y-12 text-leftScrollReveal py-8 z-10">
          
          {/* Animated Gradient Mesh & Background Effects */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
            {/* Aurora glow shape 1 */}
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#00E5FF]/8 dark:bg-[#00E5FF]/15 blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
            {/* Aurora glow shape 2 */}
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#7C3AED]/8 dark:bg-[#7C3AED]/12 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            {/* Aurora glow shape 3 */}
            <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-[#10B981]/8 dark:bg-[#10B981]/12 blur-[110px] animate-pulse" style={{ animationDuration: '10s' }} />
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#00E5FF]/40 dark:bg-pink-400/30"
                style={{
                  top: `${20 + i * 12}%`,
                  left: `${10 + (i * 15) % 80}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4 + (i % 3) * 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="text-center space-y-4 relative z-10">
            {/* Urgent Promo Ticker Banner Row */}
            <div className="inline-flex flex-wrap justify-center gap-2 items-center bg-white/50 dark:bg-slate-950/20 px-4 py-2 rounded-full border border-neutral-200/60 dark:border-white/5 shadow-sm text-xs backdrop-blur-md mb-2">
              <span className="flex items-center gap-1 font-black text-red-500 animate-pulse">
                <span>🔥</span> {language === 'bn' ? 'সীমিত সময়ের অফার' : 'Limited Time Offer'}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="flex items-center gap-1 font-semibold text-neutral-600 dark:text-neutral-300">
                <span>⏰</span> {language === 'bn' ? 'অল্প কয়েকটি স্লট বাকী' : 'Only Limited Slots Available'}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-cyan-400">
                <span>🎁</span> {language === 'bn' ? 'ফ্রি .COM ডোমেইন যুক্ত' : 'Free Domain Included'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {language === 'bn' ? 'আমাদের ৩টি মেগা ডিজিটাল ডেভেলপমেন্ট প্যাকেজ' : 'Three Premium Business Agency Pricing Packages'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-slate-400 max-w-2xl mx-auto">
              {language === 'bn' ? 'আপনার কাঙ্খিত ক্যাটাগরি বেছে নিন এবং সরাসরি সুরক্ষিত পেমেন্ট গেটওয়ের মাধ্যমে কাজ সফলভাবে শুরু করুন।' : 'Choose the ideal setup for your business enterprise. Fully secured deployment queues with custom frameworks.'}
            </p>
          </div>

          {isPricingLoading ? (
            /* Premium shimmer-skeleton loader to build agency feedback feeling */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
              {[...Array(3)].map((_, sIdx) => (
                <div key={sIdx} className="p-6 sm:p-8 rounded-[24px] bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl animate-pulse border border-neutral-200/50 dark:border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-24 bg-neutral-200 dark:bg-slate-800 rounded-full" />
                    <div className="h-10 w-10 bg-neutral-200 dark:bg-slate-800 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-neutral-205 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-5/6 bg-neutral-200/60 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="h-14 bg-neutral-200/40 dark:bg-slate-800 rounded-xl" />
                  <div className="space-y-2.5 pt-2">
                    <div className="h-3 w-16 bg-neutral-200/50 dark:bg-slate-800 rounded" />
                    {[...Array(4)].map((_, f) => (
                      <div key={f} className="flex gap-2 items-center">
                        <div className="h-3.5 w-3.5 bg-neutral-200 dark:bg-slate-800 rounded-full shrink-0" />
                        <div className="h-3.5 w-full bg-neutral-200/35 dark:bg-slate-800 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-slate-900">
                    <div className="h-11 bg-neutral-200 dark:bg-slate-800 rounded-xl" />
                    <div className="h-11 bg-neutral-200/40 dark:bg-slate-850 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* RESPONSIVE LAYOUT CONTAINER: Desktop grid / Tablet grid / Mobile Horizontal Slider */
            <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4 pb-6 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-none scrollbar-hide">
              {packagesList.map((pkg, index) => {
                const glowHex = pkg.id === 'pkg-boost' ? 'rgba(0,229,255,0.4)' : pkg.id === 'pkg-corp' ? 'rgba(124,58,237,0.4)' : 'rgba(16,185,129,0.4)';
                
                return (
                  <motion.div 
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    style={{
                      '--neon-glow': glowHex
                    } as any}
                    className="min-w-[290px] w-[82vw] md:w-auto snap-center shrink-0 group relative flex flex-col justify-between rounded-[24px] p-0.5 bg-gradient-to-br from-white/30 via-white/10 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent hover:bg-gradient-to-br hover:from-white/80 dark:hover:from-white/20 hover:to-transparent shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white/40 dark:border-white/5"
                  >
                    
                    {/* Animated Neon Shadow Border Backdrop on Card Hover */}
                    <div className={`absolute inset-[-1px] rounded-[24px] bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition duration-700 blur-[8px] -z-10`} />

                    {/* Display Animated floating badge on Top Right Corner - positioned inside the boundaries to prevent overflow clipping on mobile slider and desktop */}
                    <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-600 via-pink-500 to-orange-500 text-white text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full z-30 shadow-md border border-white/30 dark:border-white/10 select-none pointer-events-none animate-bounce">
                      {language === 'bn' ? '⚡ ফ্রি ডোমেইন ও হোস্টিং' : '🚀 FREE DOMAIN & HOSTING'}
                    </div>

                    {/* Premium Card Surface Glassmorphism Container with Background Blur */}
                    <div className="h-full flex flex-col justify-between p-6 sm:p-8 bg-white/60 dark:bg-[#090D1A]/85 backdrop-blur-xl rounded-[23px] relative overflow-hidden z-20 transition-colors duration-500 min-h-[540px] md:min-h-[620px]">
                      
                      {/* Shine Effect Overlay swipe animation */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/15 dark:via-white/5 to-transparent pointer-events-none" />

                      {/* Accent Bubble */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${pkg.color} opacity-10 dark:opacity-[0.12] rounded-full blur-2xl group-hover:scale-130 transition duration-500`} />

                      <div className="space-y-6">
                        
                        {/* Header Box / Badge & Floating Icon layout */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[10.5px] font-extrabold tracking-widest text-white uppercase px-3 py-1 bg-gradient-to-r ${pkg.color} rounded-full z-15 shadow-sm`}>
                            {pkg.badge}
                          </span>
                          
                          {/* Floating Icon Frame with standard animation loop */}
                          <motion.div 
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                            className="p-3 sm:p-3.5 bg-neutral-100/60 dark:bg-[#131B2F] text-2xl rounded-xl z-15 shrink-0 border border-neutral-200/40 dark:border-slate-800"
                          >
                            {pkg.icon}
                          </motion.div>
                        </div>

                        {/* Title and Description */}
                        <div className="space-y-2">
                          <h3 className={`text-xl sm:text-2xl font-black text-neutral-900 dark:text-white leading-tight group-hover:bg-gradient-to-r group-hover:${pkg.color} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                            {pkg.title}
                          </h3>
                          <p className="text-[12.5px] sm:text-[13px] text-neutral-500 dark:text-slate-400 font-medium leading-relaxed">
                            {pkg.desc}
                          </p>
                        </div>

                        {/* Highlighted Promo Price with Beautiful UI Gradient Design */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-50/90 to-neutral-100/40 dark:from-slate-900/60 dark:to-[#0c1222] border border-neutral-200/50 dark:border-[#1E293B]/80 text-left relative overflow-hidden group/price shadow-xs z-10">
                          {/* Soft radial glow internally */}
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${pkg.color} opacity-[0.12] rounded-full blur-xl pointer-events-none`} />
                          
                          <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-0.5">
                              <span className={`text-[9.5px] uppercase font-black tracking-widest bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent block`}>
                                {language === 'bn' ? 'অফার প্রাইস' : 'PROMO PRICE'}
                              </span>
                              <div className="flex items-baseline">
                                <span className={`text-2xl sm:text-3.5xl font-extrabold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent font-mono tracking-tight`}>
                                  <AnimatedPrice targetPrice={pkg.price} currency={currency} translatePrice={translatePrice} />
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right space-y-1">
                              <span className="text-[11px] text-neutral-400 block tracking-wide line-through font-medium">
                                {translatePrice(pkg.regularPrice)}
                              </span>
                              <span className="inline-block text-[9.5px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full uppercase leading-none border border-red-200/40 dark:border-none animate-pulse">
                                {language === 'bn' ? '৫০% ছাড়' : '50% OFF'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Specific Delivery Timeline & Future Renewal Cost Indicators */}
                        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-neutral-50/70 dark:bg-[#070B16] border border-neutral-100/50 dark:border-white/5 text-[10.5px]">
                          <div>
                            <span className="text-neutral-400 uppercase tracking-wider font-semibold block">{language === 'bn' ? '🕒 ডেলিভারি সময়' : '🕒 DELIVERY'}</span>
                            <span className="font-extrabold text-neutral-700 dark:text-neutral-200">{language === 'bn' ? pkg.deliveryBn : pkg.delivery}</span>
                          </div>
                          <div className="text-right border-l border-neutral-200/45 dark:border-slate-800/80 pl-2">
                            <span className="text-neutral-400 uppercase tracking-wider font-semibold block">{language === 'bn' ? '♻ রিনিউয়াল ফি' : '♻ RENEWAL'}</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                              {translatePrice(pkg.renewal)} / {language === 'bn' ? 'বছর' : 'Yr'}
                            </span>
                          </div>
                        </div>

                        {/* Features Included list bullet layout */}
                        <div className="space-y-3 border-t border-neutral-100 dark:border-[#1E293B]/60 pt-5 relative">
                          <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 font-black uppercase block">
                            {language === 'bn' ? 'যা যা থাকছে প্যাকেজে:' : 'FEATURES INCLUDED:'}
                          </span>
                          
                          <ul className="space-y-2 min-h-[220px] max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-slate-800 pr-1">
                            {pkg.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-1.5 text-[11.5px] text-neutral-700 dark:text-neutral-300 leading-tight">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Call-to-action Order buttons layout bottom */}
                      <div className="pt-5 border-t border-neutral-100 dark:border-[#1E293B]/60 space-y-2.5 mt-5">
                        
                        {/* Direct order button with dynamic pulsing outline effect */}
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderNowClick(pkg);
                          }}
                          className={`w-full py-2.5 bg-gradient-to-r ${pkg.color} text-white font-black text-xs rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>
                            {language === 'bn' 
                              ? `অনলাইন ক্রয় করুন - ${translatePrice(pkg.price)}` 
                              : `Order Now - ${translatePrice(pkg.price)}`}
                          </span>
                        </motion.button>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPackForOrder(pkg);
                            setConsultModalOpen(true);
                          }}
                          className="w-full py-2.5 bg-neutral-100/80 hover:bg-neutral-200 dark:bg-[#131B2F]/80 dark:hover:bg-[#1B2541]/90 text-neutral-700 dark:text-slate-300 font-bold text-xs rounded-xl transition border border-neutral-200/60 dark:border-slate-800/80 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>{language === 'bn' ? 'বিস্তারিত তথ্য জানুন' : 'View Details'}</span>
                        </button>

                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>



        {/* 4. BUSINESS GROWTH BUNDLE WITH ANIMATED GRADIENT BORDER */}
        <section className="relative rounded-3xl p-[2px] bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-600 shadow-xl overflow-hidden">
          <div className="rounded-[22px] bg-white dark:bg-[#030712] p-6 sm:p-10 md:p-12 text-left space-y-8 relative overflow-hidden">
            
            {/* Background absolute visuals */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-[#7C3AED] bg-indigo-50 border border-indigo-200 dark:text-[#a78bfa] dark:bg-purple-950/40 dark:border-purple-800 uppercase font-sans">
                  <Gift className="w-3.5 h-3.5 animate-pulse" />
                  <span>{language === 'bn' ? 'স্পেশাল সুপার সেভার বান্ডেল অফার' : 'LIMITED ULTIMATE BUSINESS TRIPLE BLOCK'}</span>
                </span>

                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
                  {language === 'bn' ? '৩টি কমপ্লিট সলিউশন একসাথে নিয়ে বিজনেস সুপারচার্জ করুন!' : 'Ultimate Business Scale Triple Block Bundle'}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-slate-350 leading-relaxed font-sans">
                  {language === 'bn'
                    ? 'আলাদা আলাদা সার্ভিস কেনার পরিবর্তে একটি মেগা অফারে পান কর্পোরেট ওয়েবসাইট, সম্পূর্ণ গুগল মাই বিজনেস গুগল ম্যাপ লোকেশন অপ্টিমাইজেশন এবং প্রথম মাসের জন্য কমপ্লিট লোকাল কাস্টমার গ্রোথ অ্যান্ড মার্কেটিং এডস রানিং প্যাকেজ।'
                    : 'Establish total market dominance. Get three major high-end WebzoneBD systems deployed synchronously at a single massive discounted checkout.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 bg-neutral-50 dark:bg-slate-900/80 rounded-xl text-neutral-700 dark:text-slate-300 font-bold border border-neutral-200/50 dark:border-slate-800 text-[11px] font-mono">
                    ✔ {language === 'bn' ? '১০০% বাজেট সাশ্রয়ী' : 'Save Up To 45%'}
                  </span>
                  <span className="px-3 py-1.5 bg-neutral-50 dark:bg-slate-900/80 rounded-xl text-neutral-700 dark:text-slate-300 font-bold border border-neutral-200/50 dark:border-slate-800 text-[11px] font-mono">
                    ✔ {language === 'bn' ? 'ফাস্ট ট্র্যাক কুপন' : 'Grow 3X Faster'}
                  </span>
                  <span className="px-3 py-1.5 bg-neutral-50 dark:bg-slate-900/80 rounded-xl text-neutral-700 dark:text-slate-300 font-bold border border-neutral-200/50 dark:border-slate-800 text-[11px] font-mono">
                    ✔ {language === 'bn' ? 'উইন-উইন ২৪/৭ ভিআইপি সাপোর্ট' : 'VIP Priority Support'}
                  </span>
                </div>
              </div>

              {/* Bundle Check & Purchase Panel */}
              <div className="lg:col-span-5 bg-neutral-50/80 dark:bg-slate-900/50 border border-neutral-200/70 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-inner text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="text-emerald-500">🏢</span>
                    <span>{language === 'bn' ? 'কর্পোরেট ব্যবসা ওয়েবসাইট সলিউশন' : 'Corporate Website Setup'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="text-emerald-500">📍</span>
                    <span>{language === 'bn' ? 'সম্পূর্ণ গুগল মাই বিজনেস ম্যাপ সেটআপ' : 'Google Business Map Listing'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="text-emerald-500">📈</span>
                    <span>{language === 'bn' ? 'বিজনেস গ্রোথ ট্র্যাকিং এবং সার্চ এসইও' : 'Business Growth & Promotion'}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200/60 dark:border-slate-800 pt-3">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold leading-none">{language === 'bn' ? 'বান্ডেল অফার প্রাইস' : 'BUNDLE DEPLOYMENT VALUE'}</span>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-black text-rose-500 font-mono leading-none">
                      {translatePrice(10999)}
                    </span>
                    <span className="text-sm font-bold text-neutral-400 line-through leading-none font-mono">
                      {translatePrice(19999)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase font-mono block mt-1.5">
                    🚀 {language === 'bn' ? 'আপনি সরাসরি সঞ্চয় করছেন ৯,০০০৳!' : 'Saves ৳9,000 Instantly!'}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    const bundlePkg = { id: 'pkg-bundle-mega', title: 'Ultimate Triple Business Scale Bundle', price: 10999 };
                    handleOrderNowClick(bundlePkg);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-650 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer transform active:scale-95 transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4.5 h-4.5 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  <span>{language === 'bn' ? 'বান্ডেল অফারটি অ্যাক্টিভেট করুন' : 'Get Bundle Offer'}</span>
                </button>
              </div>
            </div>

          </div>
        </section>



        {/* 8. MODERN FAQ ACCORDION SECTION */}
        <section className="space-y-12 max-w-4xl mx-auto text-left">
          <div className="text-center space-y-2">
            <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#7C3AED] font-bold">
              {language === 'bn' ? 'সাধারণ প্রশ্ন উত্তর' : 'COMMON QUERIES INDEXED'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {language === 'bn' ? 'আপনার মনে থাকা প্রশ্নগুলোর কুইক উত্তর' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-slate-400">
              {language === 'bn' ? 'ওয়েব ডেভেলপমেন্ট বুকিংয়ের পূর্বে কাস্টমারদের জিজ্ঞেস করা কমন বিষয়।' : 'Pricing, Delivery, Revisions, Hosting and maintenance warranties defined simply.'}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {faqsList.map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-neutral-250/70 dark:border-neutral-850 bg-white/50 dark:bg-neutral-950/20 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-extrabold text-neutral-900 dark:text-white text-xs sm:text-sm hover:bg-neutral-100/50 dark:hover:bg-slate-900/30 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === index ? <ChevronUp className="w-4.5 h-4.5 text-cyan-500" /> : <ChevronDown className="w-4.5 h-4.5 text-neutral-400" />}
                </button>

                {activeFaq === index && (
                  <div className="p-4 sm:p-5 bg-neutral-50/50 dark:bg-[#0F172A]/20 border-t border-neutral-105 dark:border-slate-900 text-xs sm:text-[13px] text-neutral-500 dark:text-slate-400 leading-relaxed font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. LIMITED TIME PROMO BANNER WITH COUNTDOWN TIMER */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-[#1e1b4b] to-neutral-900 text-white p-6 sm:p-10 border border-indigo-950/60 shadow-xl text-left">
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80')] opacity-5 bg-cover bg-center pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/15 border border-red-500/30 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                <span>{language === 'bn' ? 'সর্বশেষ ৩টি স্লট অবশিষ্ট' : 'ONLY 3 PACKAGE SLOTS LEFT TODAY'}</span>
              </span>

              <h3 className="text-xl sm:text-3xl font-black font-display tracking-tight leading-snug text-white">
                {language === 'bn' ? '৫০% বিশেষ প্রোমো অফার শেষ হতে বাকি' : 'Reserve Lifetime 50% Startup Discount'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {language === 'bn' ? 'আজকের শেষ স্লটে নাম লেখাতে এবং গেম-চেঞ্জিং ফাইবার স্পেশাল বোনাস উপহার সুনিশ্চিত করতে কাউন্টডাউন শেষ হওয়ার পূর্বে বুক করুন।' : 'Ensure early delivery timeline. Deploy corporate sites, Google Verification QR maps, and landing assets.'}
              </p>
            </div>

            {/* Countdown layout */}
            <div className="flex flex-col items-center gap-4 shrink-0 w-full lg:w-auto">
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { val: timeLeft.days, label: language === 'bn' ? 'দিন' : 'Days' },
                  { val: timeLeft.hours, label: language === 'bn' ? 'ঘণ্টা' : 'Hrs' },
                  { val: timeLeft.minutes, label: language === 'bn' ? 'মিনিট' : 'Mins' },
                  { val: timeLeft.seconds, label: language === 'bn' ? 'সেকেন্ড' : 'Secs' }
                ].map((unit, uIdx) => (
                  <div key={uIdx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 min-w-[64px] sm:min-w-[76px]">
                    <span className="block font-mono font-black text-lg sm:text-2xl text-cyan-400 leading-none">
                      {unit.val.toString().padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-slate-300 tracking-wider mt-1">{unit.label}</span>
                  </div>
                ))}
              </div>

              <a 
                href="#packages-grid"
                className="px-6 py-2.5 sm:px-8 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-650 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wide rounded-xl cursor-pointer shadow-lg w-full text-center transition"
              >
                {language === 'bn' ? 'অফার প্রাইসে এখন বুক করুন' : 'Claim Discount Now'}
              </a>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA GRADIENT ROW */}
        <section className="relative rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl text-center">
          
          <div className="absolute inset-0 bg-cover bg-center opacity-5 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80')]" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-[1.1]">
              {language === 'bn' ? 'আজই আপনার ব্যবসা সেটআপ লাইভ করুন!' : 'Ready To Scale Your Digital Presence?'}
            </h2>
            <p className="text-xs sm:text-base text-cyan-50 max-w-2xl mx-auto leading-relaxed">
              {language === 'bn' 
                ? 'পেশাদারি ওয়েবজোনবিডি আইটি সলিউশনের মাধ্যমে আত্মবিশ্বাসের সাথে অনলাইনে আস্ট্রাবলিশ হন। আমাদের ২৪/৭ সাপোর্ট টিম সব সময় আপনার সাথে যুক্ত রয়েছে।'
                : 'Empower your enterprise with reliable IT setups. Partner with WebzoneBD and get premium custom designs in 72 hours.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a 
                href="#packages-grid"
                className="px-8 py-3.5 bg-neutral-900 border border-neutral-800 hover:bg-black text-white font-black text-xs sm:text-sm rounded-xl hover:scale-103 transition transform cursor-pointer flex items-center gap-1.5"
              >
                <span>🚀 {language === 'bn' ? 'প্যাকেজ শুরু করুন' : 'Order Now'}</span>
              </a>

              <a 
                href="https://wa.me/966570511931" 
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-3.5 bg-white text-blue-600 font-extrabold text-xs sm:text-sm rounded-xl hover:scale-103 transition transform cursor-pointer flex items-center gap-1.5"
              >
                <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'WhatsApp Chat'}</span>
              </a>

              <button 
                onClick={() => setConsultModalOpen(true)}
                className="px-8 py-3.5 bg-blue-500/30 hover:bg-blue-500/50 text-white border border-white/20 font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <span>{language === 'bn' ? 'ফ্রি কনসালটেশন' : 'Free Consultation'}</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* AUTOMATIC NEWSLETTER PROMO ACCORDING TO USER REQUIREMENT: SHOW ON 10 SECONDS TIMEOUT */}
      <AnimatePresence>
        {newsletterOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 sm:p-8 max-w-md w-full relative border border-neutral-200 dark:border-slate-800 shadow-2xl text-left space-y-6"
            >
              <button 
                onClick={() => {
                  localStorage.setItem('webzone_newsletter_dismissed_2026', 'true');
                  setNewsletterOpen(false);
                }}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 pt-2">
                <span className="inline-block text-3xl">🎁</span>
                <span className="block text-[10px] uppercase font-mono font-black tracking-widest text-cyan-600 dark:text-cyan-405 leading-none">
                  {language === 'bn' ? 'বিশেষ কাস্টমার উপহার' : 'EXCLUSIVE VISITOR GIFT'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white leading-tight">
                  {language === 'bn' ? 'আপনার প্রথম প্রজেক্টে ১০০০৳ ডিসকাউন্ট কোড নিন!' : 'Get Free Premium Business Consultation'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed font-sans">
                  {language === 'bn' 
                    ? 'আমাদের সাথে যেকোনো ডিজিটাল প্রজেক্ট অথবা ম্যাপ সেটআপে বুকিং ডেমোসহ স্পেশাল ১০০০৳ গিফট ভাউচার সুনিশ্চিত করতে নিচে ক্লেইম করুন।' 
                    : 'Get 100% free technical audit, domain sitemap verification guidelines and localized business reviews coupon pack.'}
                </p>
              </div>

              {/* Action options */}
              <div className="space-y-2">
                <button 
                  onClick={() => handleClaimOffer(language === 'bn' ? '১০০০৳ মেগা ডিসকাউন্ট কুপন' : 'Free Business Audit Voucher')}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer hover:opacity-95"
                >
                  🚀 {language === 'bn' ? 'উপহার কোডটি ক্লেইম করুন' : 'Claim Free Offer Now'}
                </button>

                <button 
                  onClick={() => {
                    localStorage.setItem('webzone_newsletter_dismissed_2026', 'true');
                    setNewsletterOpen(false);
                  }}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-neutral-500 dark:text-slate-350 text-xs font-bold rounded-xl transition cursor-pointer text-center"
                >
                  {language === 'bn' ? 'আমার প্রয়োজন নেই' : 'Maybe Later'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONSULTATION SCHEDULE OVERLAY MODAL */}
      <AnimatePresence>
        {consultModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 sm:p-8 max-w-lg w-full relative border border-neutral-200 dark:border-slate-800 shadow-2xl text-left space-y-4"
            >
              <button 
                onClick={() => setConsultModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white leading-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  <span>{language === 'bn' ? 'ফ্রি বিজনেস কনসালটেশন রিকোয়েস্ট' : 'Request Free IT consultation'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'bn' ? 'আপনার ব্যবসা ডিজিটাল করতে ১৫ মিনিটে আমাদের ডেভদের যুক্ত করুন।' : 'Analyze project requirements, frameworks and sitemaps securely with our lead developers.'}
                </p>
              </div>

              <form onSubmit={handleSendFormConsult} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    {language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g. Imran Hossain"
                    className="w-full bg-neutral-50 dark:bg-slate-900 border border-neutral-250 dark:border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-0 text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      {language === 'bn' ? 'হোয়াটসঅ্যাপ / মোবাইল নম্বর' : 'WhatsApp Contact No'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      placeholder="e.g. +88017000000"
                      className="w-full bg-neutral-50 dark:bg-slate-900 border border-neutral-250 dark:border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-0 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      {language === 'bn' ? 'ইমেইল ঠিকানা (ঐচ্ছিক)' : 'Email Address (Optional)'}
                    </label>
                    <input 
                      type="email" 
                      value={consultEmail}
                      onChange={(e) => setConsultEmail(e.target.value)}
                      placeholder="e.g. name@brand.com"
                      className="w-full bg-neutral-50 dark:bg-slate-900 border border-neutral-250 dark:border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-0 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    {language === 'bn' ? 'আপনার ব্যবসা সম্পর্কে বা কোনো বিশেষ সার্ভিস চাহিদা' : 'Your Project Goals or specific package requirements'}
                  </label>
                  <textarea 
                    rows={3}
                    value={consultDesc}
                    onChange={(e) => setConsultDesc(e.target.value)}
                    placeholder={language === 'bn' ? "e.g. আমার একটি ফার্নিচার প্রোডাক্ট ই-কমার্স ওয়েবসাইট ও কাস্টমার পি পিক্সেল ফানেল প্রয়োজন..." : "e.g. Company corporate profile layout with Google Maps Embed and custom slider features..."}
                    className="w-full bg-neutral-50 dark:bg-slate-900 border border-neutral-250 dark:border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-0 text-neutral-900 dark:text-white resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-xs uppercase tracking-wide rounded-xl shadow-lg cursor-pointer transform active:scale-98 transition"
                  >
                    🚀 {language === 'bn' ? 'ফ্রি পরামর্শ বুক করুন' : 'Activate Free Consultation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER SUMMARY SUBMISSION MODAL SCREEN */}
      <AnimatePresence>
        {orderModalOpen && selectedPackForOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 sm:p-8 max-w-md w-full relative border border-neutral-200 dark:border-slate-800 shadow-2xl text-left space-y-4"
            >
              <button 
                onClick={() => setOrderModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[9.5px] font-black tracking-widest text-cyan-600 bg-cyan-50 dark:bg-cyan-500/15 px-2 px-2 py-0.5 rounded font-mono uppercase block">
                  {language === 'bn' ? 'অর্ডার রিভিউ' : 'SECURE DEPLOYMENT SUMMARY'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white leading-tight">
                  {selectedPackForOrder.title}
                </h3>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-slate-900 rounded-xl space-y-2 border border-neutral-200/50 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{language === 'bn' ? 'প্যাকেজ ডেসক্রিপশন' : 'Service Item'}</span>
                  <span className="font-bold text-neutral-800 dark:text-white">{language === 'bn' ? 'সফটওয়্যার অ্যান্ড হোস্টিং' : 'Custom Web Solution'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 dark:border-slate-800 pt-2">
                  <span>{language === 'bn' ? 'ডেলিভারি গ্যারান্টি' : 'Milestone SLA Warranty'}</span>
                  <span className="font-bold text-emerald-500 font-mono">100% SLA Assured</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-800 dark:text-slate-200 border-t border-neutral-100 dark:border-slate-800 pt-2">
                  <span className="font-extrabold">{language === 'bn' ? 'সর্বমোট পরিশোধযোগ্য' : 'Total Price (Inc Tax)'}</span>
                  <span className="font-mono font-black text-lg text-blue-600 dark:text-cyan-400">
                    {translatePrice(selectedPackForOrder.price)}
                  </span>
                </div>
              </div>

              <form onSubmit={submitDirectOrder} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                    {language === 'bn' ? 'হোয়াটসঅ্যাপ / কন্ট্যাক্ট মোবাইল*' : 'WhatsApp / Phone Number*'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. +88017XXXXXXXX"
                    className="w-full bg-neutral-50 dark:bg-slate-950 border border-neutral-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-450 dark:placeholder:text-slate-500 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                    {language === 'bn' ? 'ইমেইল ঠিকানা*' : 'Email Address*'}
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. name@brand.com"
                    className="w-full bg-neutral-50 dark:bg-slate-950 border border-neutral-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-450 dark:placeholder:text-slate-500 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs uppercase tracking-wide rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm Order Setup'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
