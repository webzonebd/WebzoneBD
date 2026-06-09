/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, ShieldAlert, Award, ChevronRight, Sparkles, 
  HelpCircle, ArrowRight, BookOpen, Star, Building2, ExternalLink 
} from 'lucide-react';

// Import Types
import { Language, Theme, Product, Order, SupportTicket, Coupon, SystemConfig, CartItem, UserSession, Currency, ActivityLog } from './types';

// Import Seeds
import { sampleProducts, systemConfigDefault, sampleCoupons, clientTestimonials } from './data';

// Import Parts
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Marketplace from './components/Marketplace';
import Services from './components/Services';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Blog from './components/Blog';
import { initialLocalBlogs, LocalBlogPost } from './components/BlogData';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import PrivacyTerms from './components/PrivacyTerms';
import Notification from './components/Notification';
import AuthSystem from './components/AuthSystem';
import DomainSearch from './components/DomainSearch';
import LiveChatWidget from './components/LiveChatWidget';
import Hosting from './components/Hosting';
import Solutions from './components/Solutions';
import DomainPage from './components/DomainPage';
import AffiliateSystem from './components/AffiliateSystem';
import AuthPopup from './components/AuthPopup';
import RefundPolicy from './components/RefundPolicy';
import PromotionalOfferSystem from './components/PromotionalOfferSystem';
import ScrollReveal from './components/ScrollReveal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('webzone_theme');
    return (saved as Theme) || 'light';
  });

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
    return 'home';
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authDefaultView, setAuthDefaultView] = useState<'login' | 'register'>('login');
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const path = window.location.pathname;
    const targetPath = currentPage === 'domain' ? '/domain-name-generator' : currentPage === 'hosting' ? '/hosting' : currentPage === 'refund' ? '/refund' : '/';
    if (path !== targetPath && (targetPath !== '/' || path === '/domain' || path === '/domain-name-generator' || path === '/hosting' || path === '/refund')) {
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
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // User Session state, pre-seeded or loaded from localStorage
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('webzone_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse webzone_session_user", e);
      return null;
    }
  });

  // Super Admin WordPress-Style Login state variables
  const [adminLoginEmail, setAdminLoginEmail] = useState('');
  const [adminLoginPass, setAdminLoginPass] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminRemember, setAdminRemember] = useState(false);

  // Persistent Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_wishlist');
      if (saved) return JSON.parse(saved);
      const savedUser = localStorage.getItem('webzone_session_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && Array.isArray(parsed.wishlistedProductIds)) {
          return parsed.wishlistedProductIds;
        }
      }
    } catch (e) {
      console.error("Failed to parse webzone_wishlist", e);
    }
    return [];
  });

  // Synchronize wishlist values with local storage and user credentials
  useEffect(() => {
    localStorage.setItem('webzone_wishlist', JSON.stringify(wishlist));
    if (user) {
      const updatedUser = { ...user, wishlistedProductIds: wishlist };
      localStorage.setItem('webzone_session_user', JSON.stringify(updatedUser));
    }
  }, [wishlist, user]);

  // Sync wishlist with logged-in user session changes
  useEffect(() => {
    if (user && Array.isArray(user.wishlistedProductIds)) {
      if (JSON.stringify(user.wishlistedProductIds) !== JSON.stringify(wishlist)) {
        setWishlist(user.wishlistedProductIds);
      }
    }
  }, [user]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const isAlready = prev.includes(productId);
      if (isAlready) {
        triggerToast(language === 'bn' ? "পছন্দ তালিকা থেকে সরানো হয়েছে!" : language === 'ar' ? "تمت إزالته من المفضلة!" : "Removed from your wishlist!");
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
  }, [currencySettings.simulatedCountry, currencySettings.enabled, currencySettings.defaultCurrency, currency]);


  // Terminal action / security incident logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse webzone_activity_logs", e);
    }
    return [
      {
        id: "log-1",
        action: "SSL Handshake and Injection Shields Activated",
        ipAddress: "192.168.1.104",
        userAgent: "Server-Agent Core Node (cPanel Express)",
        timestamp: "9:30 AM"
      },
      {
        id: "log-2",
        action: "Anti-CSRF Tokens validated successfully for Riyadh Node",
        ipAddress: "94.223.120.45",
        userAgent: "Chrome 125.0 / Windows 11 Secure Node",
        timestamp: "10:15 AM"
      }
    ];
  });

  // States with pre-seeded values for offline high fidelity sandbox
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_products');
      return saved ? JSON.parse(saved) : sampleProducts;
    } catch (e) {
      console.error("Failed to parse webzone_products", e);
      return sampleProducts;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse webzone_orders", e);
    }
    return [];
  });

  // Elevate Blog posts state so both Blog and AdminPanel share a single synchronous source
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
    // Seed high-fidelity interactive ticket for sandbox
    return [
      {
        id: "tkt-882",
        subject: "MySQL file import failed on cPanel phpMyAdmin",
        category: "Marketplace Script Support",
        priority: 'high',
        message: "Hello WebzoneBD, I purchased your WebNews premium assets but when I upload XML files on Blogger, it throws an authority warning. Kindly suggest configuration steps.",
        status: 'open',
        createdAt: "2026-05-29",
        replies: [
          {
            sender: 'user',
            message: "Hello WebzoneBD, I purchased your WebNews premium assets but when I upload XML files on Blogger, it throws an authority warning. Kindly suggest configuration steps.",
            createdAt: "10:15 AM"
          },
          {
            sender: 'admin',
            message: "Assalamu Alaikum, thanks for contacting WebzoneBD support. To setup on Blogger, please import bloggerspot-blogger.xml directly into the Blogger theme options via 'Restore' instead of 'Edit HTML'. Drop us a WhatsApp text on +966570511931 if you need free setup.",
            createdAt: "10:24 AM"
          }
        ]
      }
    ];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_coupons');
      return saved ? JSON.parse(saved) : sampleCoupons;
    } catch (e) {
      console.error("Failed to parse webzone_coupons", e);
      return sampleCoupons;
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

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

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
    }
  }, [user]);

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

  // Handle theme body toggling classes with persistent storage
  useEffect(() => {
    localStorage.setItem('webzone_theme', theme);
    const root = window.document.documentElement;
    root.classList.add('transition-colors', 'duration-300');
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0a0a0a';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#fafafa';
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
      id: "log-" + Date.now(),
      action,
      ipAddress: "192.168.1." + Math.floor(10 + Math.random() * 90),
      userAgent: navigator.userAgent.slice(0, 50),
      timestamp
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Cart operations
  const addToCart = (product: Product) => {
    // Check duplication
    const isAlreadyInCart = cart.some(item => item.product.id === product.id);
    if (isAlreadyInCart) {
      triggerToast(language === 'bn' ? "ইতিমধ্যে কার্ট ফাইলে যুক্ত আছে!" : language === 'ar' ? "هذه البرمجية مضافة بالفعل في السلة" : "Already in shopping cart!");
      return;
    }

    setCart([...cart, { product }]);
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

    // Apply to all items
    const updated = cart.map(item => ({
      ...item,
      appliedCoupon: activeCoupon
    }));

    setCart(updated);
    addActivityLog(`Applied promotional voucher to checkout: ${codeUpper}`);
    return null; // success
  };

  const resetCart = () => setCart([]);

  // Purchases booking simulator from Checkout buttons
  const addSimulatedOrder = (method: string) => {
    const orderItems: Order[] = cart.map(item => {
      const p = item.product;
      const basePrice = p.discountPrice || p.price;
      const discount = item.appliedCoupon ? (basePrice * item.appliedCoupon.discountPercent / 100) : 0;
      const finalPrice = parseFloat((basePrice - discount).toFixed(2));

      return {
        id: "ord-sim-" + Math.floor(10000 + Math.random() * 90000),
        productId: p.id,
        itemTitle: p.name,
        price: finalPrice,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: `${method} Gateways`,
        paymentStatus: 'completed'
      };
    });

    setOrders([...orders, ...orderItems]);
    // Log tracking
    addActivityLog(`Authenticated user completed checkout purchase of ${orderItems.length} products via ${method}`);
  };

  // Custom Inquiry service orders simulator
  const addSimulatedServiceOrder = (order: Order) => {
    setOrders([...orders, order]);
    addActivityLog(`Acquired custom digital solutions package order: ${order.itemTitle}`);
  };

  // Support ticket operations
  const addSupportTicket = (ticket: SupportTicket) => {
    setTickets([ticket, ...tickets]);
  };

  const addTicketReply = (ticketId: string, message: string, sender: 'user' | 'admin') => {
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
    addActivityLog(`SaaS Support message post: Ref ${ticketId} [By ${sender.toUpperCase()}]`);
  };

  // Admin exclusive states managers
  const addNewProduct = (prod: Product) => setProducts([prod, ...products]);
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));
  const updateOrderStatus = (id: string, status: 'completed' | 'failed') => {
    setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus: status } : o));
    addActivityLog(`Admin modified Order Reference Status: #${id} [To ${status.toUpperCase()}]`);
  };
  const addNewCoupon = (cp: Coupon) => setCoupons([cp, ...coupons]);
  const deleteCoupon = (code: string) => setCoupons(coupons.filter(c => c.code !== code));

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
      setCurrentPage('auth');
    } else {
      setCurrentPage(targetPage);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 font-sans transition-colors duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
      id="webzone-root-app"
    >
      {/* Dynamic Header with synced user status */}
      <Header
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        cart={cart}
        removeFromCart={removeFromCart}
        applyCouponToCart={applyCouponToCart}
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
        isAdmin={user?.role === 'admin' ? isAdmin : false}
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
          setIsAdmin(signedInUser.role === 'admin');
          addActivityLog(`Authorized Session tokens for user role: ${signedInUser.role.toUpperCase()}`);
          if (signedInUser.role === 'admin') {
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
      />

      {/* Main Core Router Panels */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Embedded Hero Header block */}
            <Hero
              language={language}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
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

            {/* Services highlights preview */}
            <ScrollReveal className="w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="p-1.5 sm:p-2 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-sky-50/10 to-transparent dark:from-slate-900/40 dark:via-slate-950/10 dark:to-transparent border border-neutral-200/40 dark:border-neutral-800/40 backdrop-blur-xs w-full">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4 sm:p-6">
                        <div className="space-y-2.5">
                          <h3 className="text-xl sm:text-2xl md:text-3.5xl font-black tracking-tight flex items-center gap-2.5">
                            <Award className="text-blue-600 dark:text-cyan-400 w-6 h-6 sm:w-7 sm:h-7 shrink-0 animate-pulse" />
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-cyan-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent font-display">
                              {tHome[language]?.servicesTitle || "Enterprise IT Services catalog"}
                            </span>
                          </h3>
                          <p className="text-xs sm:text-sm md:text-[14.5px] font-medium leading-relaxed text-neutral-600 dark:text-slate-300 max-w-2xl">
                            {tHome[language]?.servicesDesc || "We design and optimize responsive solutions ensuring maximum speed scales."}
                          </p>
                        </div>

                        <button
                          onClick={() => setCurrentPage('services')}
                          className="px-4.5 py-2.5 sm:px-5 sm:py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-neutral-800 dark:text-white border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-black rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
                        >
                          <span>{tHome[language]?.exploreBtn || "Explore Services"}</span>
                          <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''} text-blue-500 dark:text-cyan-400`} />
                        </button>
                      </div>
                    </div>
                </div>

                {/* Embed services */}
                <Services
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
                    searchTerm=""
                    currency={currency}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    currencySettings={currencySettings}
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Why choose WebzoneBD advantages grid - Reveal on scroll */}
            <ScrollReveal className="w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="agency-benefits-overview">
                <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white mb-8 text-center">{tHome.whyTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800 space-y-2 hover:border-emerald-500/40 transition">
                    <h4 className="font-extrabold text-xs sm:text-sm text-emerald-500 uppercase font-mono">{tHome.why1Title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-serif">{tHome.why1Desc}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800 space-y-2 hover:border-emerald-500/40 transition">
                    <h4 className="font-extrabold text-xs sm:text-sm text-emerald-500 uppercase font-mono">{tHome.why2Title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-serif">{tHome.why2Desc}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800 space-y-2 hover:border-emerald-500/40 transition">
                    <h4 className="font-extrabold text-xs sm:text-sm text-emerald-500 uppercase font-mono">{tHome.why3Title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-serif">{tHome.why3Desc}</p>
                  </div>
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
              language={language}
              theme={theme}
              addSimulatedServiceOrder={addSimulatedServiceOrder}
              triggerToast={triggerToast}
              setCurrentPage={setCurrentPage}
              currency={currency}
              currencySettings={currencySettings}
              addToCart={addToCart}
              setCartOpen={setCartOpen}
            />
          </div>
        )}

        {currentPage === 'marketplace' && (
          <div className="animate-in fade-in duration-200">
            <Marketplace
              language={language}
              theme={theme}
              addToCart={addToCart}
              searchTerm={searchTerm}
              currency={currency}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              currencySettings={currencySettings}
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
                setIsAdmin(signedInUser.role === 'admin');
                addActivityLog(`Authorized Session tokens for user role: ${signedInUser.role.toUpperCase()}`);
                
                // Redirect user based on role characteristics
                if (signedInUser.role === 'admin') {
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
              orders={orders}
              tickets={tickets}
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
              currencySettings={currencySettings}
              setLanguage={setLanguage}
              setTheme={setTheme}
            />
          </div>
        )}

        {currentPage === 'admin' && (
          <div className="animate-in fade-in duration-200">
            {user?.role === 'admin' ? (
              <AdminPanel
                language={language}
                theme={theme}
                products={products}
                orders={orders}
                tickets={tickets}
                systemConfig={systemConfig}
                coupons={coupons}
                addNewProduct={addNewProduct}
                deleteProduct={deleteProduct}
                updateOrderStatus={updateOrderStatus}
                addTicketReply={addTicketReply}
                addNewCoupon={addNewCoupon}
                deleteCoupon={deleteCoupon}
                updateSystemConfig={setSystemConfig}
                triggerToast={triggerToast}
                currency={currency}
                setCurrency={setCurrency}
                currencySettings={currencySettings}
                setCurrencySettings={setCurrencySettings}
                posts={posts}
                setPosts={setPosts}
              />
            ) : (
              <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-left" id="wp-style-admin-login-node">
                {/* Logo and Brand Heading */}
                <div className="mb-6 text-center">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="inline-flex items-center gap-2 text-2xl font-black text-neutral-900 dark:text-white group/wlogo"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold font-serif shadow-lg border-2 border-neutral-200 dark:border-neutral-800 group-hover/wlogo:scale-105 transition-transform duration-200">
                      W
                    </div>
                  </button>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-widest mt-2 uppercase">Website Control Panel Gateway</p>
                </div>

                {/* WordPress Style Login Container */}
                <div className="w-full max-w-[350px] space-y-4">
                  {/* WordPress-style Error Box */}
                  {adminLoginError && (
                    <div className="bg-white dark:bg-neutral-900 border-l-[4px] border-amber-500 p-4 shadow-sm text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed rounded-r animate-in fade-in slide-in-from-top-1">
                      <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider block mb-0.5">ERROR</span>
                      {adminLoginError}
                    </div>
                  )}

                  {/* The Login Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 rounded shadow-sm text-left space-y-4 font-sans">
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
                          if (adminLoginEmail === 'admin@webzonebd.com' && adminLoginPass === 'admin123') {
                            const adminUserSession: UserSession = {
                              id: 'usr-admin',
                              name: 'Super Admin Manager',
                              username: 'admin_root',
                              email: 'admin@webzonebd.com',
                              phone: '+8801799887766',
                              role: 'admin',
                              isVerified: true,
                              createdAt: '2026-06-01',
                              status: 'active',
                              wishlistedProductIds: []
                            };
                            setUser(adminUserSession);
                            setIsAdmin(true);
                            triggerToast("Welcome back, Chief Architect! Authorized Super Admin session.");
                          } else {
                            setAdminLoginError(`The password/email handshake you entered for ${adminLoginEmail} is incorrect. (Use admin@webzonebd.com / admin123)`);
                          }
                        }, 700);
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Username or Email Address</label>
                        <input
                          type="text"
                          value={adminLoginEmail}
                          onChange={(e) => setAdminLoginEmail(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-350 dark:border-neutral-800 p-2 text-sm text-neutral-900 dark:text-white rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                            onChange={(e) => setAdminRemember(e.target.checked)}
                            className="rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Remember Me</span>
                        </label>
                        
                        <button
                          type="submit"
                          disabled={adminLoginLoading}
                          className="inline-flex items-center justify-center gap-1 bg-[#2271b1] hover:bg-[#135e96] border border-[#2271b1] hover:border-[#135e96] text-white text-xs font-extrabold py-2 px-4 rounded cursor-pointer transition shadow active:scale-95 text-center font-sans tracking-wide font-mono uppercase"
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
                        setAdminLoginError("Custom Core Developer Security bypass is active. Use key admin123 on login panel.");
                      }}
                      className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
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
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Live Support Widget (WhatsApp & Telegram Support) */}
      <LiveChatWidget language={language} />

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
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        language={language}
        theme={theme}
        user={user}
        defaultView={authDefaultView}
        onLoginSuccess={(signedInUser) => {
          setUser(signedInUser);
          setIsAdmin(signedInUser.role === 'admin');
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

          if (signedInUser.role === 'admin') {
            setCurrentPage('admin');
          } else {
            setCurrentPage('dashboard');
          }
        }}
        triggerToast={triggerToast}
      />

      {/* Persistent Smart Promotional & Newsletter Offer System (Pop-ups + Notification panels) */}
      <PromotionalOfferSystem
        language={language}
        triggerToast={triggerToast}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
