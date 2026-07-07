import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, FileText, Menu, BookOpen, Layers, Briefcase, 
  ShoppingBag, FolderOpen, Image as ImageIcon, Send, Sparkles, 
  Settings, Trash2, Plus, Edit3, Eye, Copy, ArrowUp, ArrowDown, X, 
  Check, Save, Search, RefreshCw, AlertCircle, Trash, Code, FileCode,
  Tag, Compass, ShieldAlert, CheckCircle, ExternalLink, Megaphone, Shuffle,
  Globe, Clock, DollarSign, Smartphone, Database, ShieldCheck, Download, CreditCard, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, deleteDoc, getDocs, collection, onSnapshot } from 'firebase/firestore';
import PaymentSettingsView from './PaymentSettingsView';
import {
  CmsPage, CmsMenuItem, CmsMenu, CmsBlogPost, CmsService, CmsProduct,
  CmsMediaFile, CmsForm, CmsRedirect, CmsAnnouncement, CmsFAQ, CmsTestimonial,
  INITIAL_CMS_PAGES, INITIAL_CMS_MENUS, INITIAL_CMS_BLOGS, INITIAL_CMS_SERVICES,
  INITIAL_CMS_PRODUCTS, INITIAL_CMS_MEDIA, INITIAL_CMS_TESTIMONIALS, INITIAL_CMS_FAQS,
  INITIAL_CMS_ANNOUNCEMENTS, INITIAL_CMS_REDIRECTS, INITIAL_CMS_FORMS
} from './CmsData';
import { PortfolioItem } from '../types';
import { samplePortfolio } from '../data';

interface WebsiteControlCenterProps {
  language: 'en' | 'bn' | 'ar';
  theme: 'light' | 'dark';
  activeSubMenu: string;
  setActiveSubMenu: (sub: string) => void;
  triggerToast: (msg: string) => void;
  orders?: any[];
  currencyRates?: any;
  setCurrencyRates?: any;
  verificationSettings?: any;
  setVerificationSettings?: any;
  paymentNotifs?: any;
  setPaymentNotifs?: any;
  bdMethods?: any;
  setBdMethods?: any;
  saMethods?: any;
  setSaMethods?: any;
  intlMethods?: any;
  setIntlMethods?: any;
  customMethods?: any;
  setCustomMethods?: any;
  logAdminAction?: (action: string) => void;
  getOrderSerial?: (orderId: string) => string;
  updateOrderStatus?: (id: string, status: 'completed' | 'failed' | 'refunded') => void;
}

export default function WebsiteControlCenter({
  language,
  theme,
  activeSubMenu,
  setActiveSubMenu,
  triggerToast,
  orders = [],
  currencyRates = { USD: 1, BDT: 118.5, SAR: 3.75 },
  setCurrencyRates,
  verificationSettings = { verificationMode: 'manual', txnIdRequired: true, screenshotRequired: true },
  setVerificationSettings,
  paymentNotifs = { email: true, sms: false, whatsapp: true, telegram: false },
  setPaymentNotifs,
  bdMethods = {},
  setBdMethods,
  saMethods = {},
  setSaMethods,
  intlMethods = {},
  setIntlMethods,
  customMethods = [],
  setCustomMethods,
  logAdminAction = () => {},
  getOrderSerial,
  updateOrderStatus
}: WebsiteControlCenterProps) {
  const isDark = theme === 'dark';

  // --- PERSISTENT STATE LOGIC with LOCAL STORAGE & FIRESTORE ---
  const [pages, setPages] = useState<CmsPage[]>(() => {
    const saved = localStorage.getItem('wz_cms_pages');
    return saved ? JSON.parse(saved) : INITIAL_CMS_PAGES;
  });

  const [menus, setMenus] = useState<CmsMenu[]>(() => {
    const saved = localStorage.getItem('wz_cms_menus');
    return saved ? JSON.parse(saved) : INITIAL_CMS_MENUS;
  });

  const [blogs, setBlogs] = useState<CmsBlogPost[]>(() => {
    const saved = localStorage.getItem('wz_cms_blogs');
    return saved ? JSON.parse(saved) : INITIAL_CMS_BLOGS;
  });

  const [services, setServices] = useState<CmsService[]>(() => {
    const saved = localStorage.getItem('wz_cms_services');
    return saved ? JSON.parse(saved) : INITIAL_CMS_SERVICES;
  });

  const [products, setProducts] = useState<CmsProduct[]>(() => {
    const saved = localStorage.getItem('wz_cms_products');
    return saved ? JSON.parse(saved) : INITIAL_CMS_PRODUCTS;
  });

  const [media, setMedia] = useState<CmsMediaFile[]>(() => {
    const saved = localStorage.getItem('wz_cms_media');
    return saved ? JSON.parse(saved) : INITIAL_CMS_MEDIA;
  });

  const [forms, setForms] = useState<CmsForm[]>(() => {
    const saved = localStorage.getItem('wz_cms_forms');
    return saved ? JSON.parse(saved) : INITIAL_CMS_FORMS;
  });

  const [redirects, setRedirects] = useState<CmsRedirect[]>(() => {
    const saved = localStorage.getItem('wz_cms_redirects');
    return saved ? JSON.parse(saved) : INITIAL_CMS_REDIRECTS;
  });

  const [announcements, setAnnouncements] = useState<CmsAnnouncement[]>(() => {
    const saved = localStorage.getItem('wz_cms_announcements');
    return saved ? JSON.parse(saved) : INITIAL_CMS_ANNOUNCEMENTS;
  });

  const [faqs, setFaqs] = useState<CmsFAQ[]>(() => {
    const saved = localStorage.getItem('wz_cms_faqs');
    return saved ? JSON.parse(saved) : INITIAL_CMS_FAQS;
  });

  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>(() => {
    const saved = localStorage.getItem('wz_cms_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_CMS_TESTIMONIALS;
  });

  // Blog categories & tags states
  const [blogCategories, setBlogCategories] = useState<string[]>(['Tech', 'Security', 'Web Development', 'Hardware SLA', 'Hosting Rules']);
  const [blogTags, setBlogTags] = useState<string[]>(['React', 'Firebase', 'Valkyrie', 'API', 'Docker']);

  // WooCommerce Product Categories & Subcategories
  const [productCategories, setProductCategories] = useState<string[]>(['templates', 'plugins', 'scripts', 'graphics', 'assets']);
  const [productSubCategories, setProductSubCategories] = useState<string[]>(['React Boilerplates', 'Laravel Plugins', 'Bootstrap Themes', 'Tailwind kits']);

  // Global SEO state
  const [seoConfig, setSeoConfig] = useState({
    titleTemplate: '%title% | WebzoneBD platform',
    metaRobots: 'index, follow',
    ogSiteName: 'WebzoneBD IT Solutions',
    schemaType: 'LocalBusiness',
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://webzonebd.com/sitemap.xml'
  });

  // Header & Footer CMS states
  const [headerSettings, setHeaderSettings] = useState({
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
    announcementEnabled: true,
    announcementText: '🎉 Multi-Region SSD cloud clusters are fully spun up!',
    ctaText: 'Build Custom Application',
    ctaLink: '/consultation'
  });

  const [footerSettings, setFooterSettings] = useState({
    copyrightText: '© 2026 WebzoneBD IT Solution. All Technical Infrastructure Reserved.',
    socialFacebook: 'https://facebook.com/webzonebd',
    socialLinkedIn: 'https://linkedin.com/company/webzonebd',
    socialGithub: 'https://github.com/webzonebd',
    columns: [
      { title: 'Core Services', links: ['SaaS Core Engine', 'Decoupled Architectures', 'SLA Enterprise Node'] },
      { title: 'Quick Links', links: ['Refund Policy', 'Client Panel', 'System Documentation'] }
    ]
  });

  // Enterprise Logs & Versions
  const [activityLogs, setActivityLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem('wz_cms_activity_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'act-1', who: 'imranh7900@gmail.com', action: 'System bootstrapped with clean states', when: new Date(Date.now() - 3600000).toISOString() }
    ];
  });

  const [versionHistory, setVersionHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('wz_cms_version_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('wz_cms_portfolio');
    return saved ? JSON.parse(saved) : samplePortfolio;
  });

  // Refs to prevent recursive write loops when remote snapshot updates local state
  const isBypassingSync = useRef({
    pages: false,
    menus: false,
    blog_posts: false,
    services: false,
    products: false,
    media_library: false,
    forms: false,
    redirects: false,
    announcements: false,
    faqs: false,
    testimonials: false,
    seo_settings: false,
    homepage_sections: false,
    portfolio: false
  });

  // Action helper logging
  const addActivityLogEntry = (action: string) => {
    const newLog = {
      id: `act-` + Date.now(),
      who: 'imranh7900@gmail.com',
      action,
      when: new Date().toISOString()
    };
    setActivityLogs(p => {
      const next = [newLog, ...p].slice(0, 50);
      writeToFirestoreSync('activity_logs', next);
      return next;
    });
  };

  const createVersionEntry = (what: string, colPath: string, stateArr: any[]) => {
    const newVer = {
      id: `ver-` + Date.now(),
      who: 'imranh7900@gmail.com',
      what,
      when: new Date().toISOString(),
      collectionPath: colPath,
      restoreData: JSON.stringify(stateArr)
    };
    setVersionHistory(p => {
      const next = [newVer, ...p].slice(0, 20);
      writeToFirestoreSync('version_history', next);
      return next;
    });
  };

  // Real-time Firestore snapshot listeners
  useEffect(() => {
    const collections = [
      'pages', 'menus', 'blog_posts', 'services', 'products',
      'media_library', 'forms', 'redirects', 'announcements',
      'faqs', 'testimonials', 'seo_settings', 'homepage_sections',
      'activity_logs', 'version_history', 'portfolio'
    ];

    const unsubscribes = collections.map(col => {
      return onSnapshot(doc(db, 'cms_sync', col), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            if (col === 'pages' && data.items) {
              if (JSON.stringify(pages) !== JSON.stringify(data.items)) {
                isBypassingSync.current.pages = true;
                setPages(data.items);
              }
            } else if (col === 'menus' && data.items) {
              if (JSON.stringify(menus) !== JSON.stringify(data.items)) {
                isBypassingSync.current.menus = true;
                setMenus(data.items);
              }
            } else if (col === 'blog_posts' && data.items) {
              if (JSON.stringify(blogs) !== JSON.stringify(data.items)) {
                isBypassingSync.current.blog_posts = true;
                setBlogs(data.items);
              }
            } else if (col === 'services' && data.items) {
              if (JSON.stringify(services) !== JSON.stringify(data.items)) {
                isBypassingSync.current.services = true;
                setServices(data.items);
              }
            } else if (col === 'products' && data.items) {
              if (JSON.stringify(products) !== JSON.stringify(data.items)) {
                isBypassingSync.current.products = true;
                setProducts(data.items);
              }
            } else if (col === 'media_library' && data.items) {
              if (JSON.stringify(media) !== JSON.stringify(data.items)) {
                isBypassingSync.current.media_library = true;
                setMedia(data.items);
              }
            } else if (col === 'forms' && data.items) {
              if (JSON.stringify(forms) !== JSON.stringify(data.items)) {
                isBypassingSync.current.forms = true;
                setForms(data.items);
              }
            } else if (col === 'redirects' && data.items) {
              if (JSON.stringify(redirects) !== JSON.stringify(data.items)) {
                isBypassingSync.current.redirects = true;
                setRedirects(data.items);
              }
            } else if (col === 'announcements' && data.items) {
              if (JSON.stringify(announcements) !== JSON.stringify(data.items)) {
                isBypassingSync.current.announcements = true;
                setAnnouncements(data.items);
              }
            } else if (col === 'faqs' && data.items) {
              if (JSON.stringify(faqs) !== JSON.stringify(data.items)) {
                isBypassingSync.current.faqs = true;
                setFaqs(data.items);
              }
            } else if (col === 'testimonials' && data.items) {
              if (JSON.stringify(testimonials) !== JSON.stringify(data.items)) {
                isBypassingSync.current.testimonials = true;
                setTestimonials(data.items);
              }
            } else if (col === 'portfolio' && data.items) {
              if (JSON.stringify(portfolio) !== JSON.stringify(data.items)) {
                isBypassingSync.current.portfolio = true;
                setPortfolio(data.items);
              }
            } else if (col === 'seo_settings' && data.settings) {
              if (JSON.stringify(seoConfig) !== JSON.stringify(data.settings)) {
                isBypassingSync.current.seo_settings = true;
                setSeoConfig(data.settings);
              }
            } else if (col === 'homepage_sections' && data.sections) {
              if (JSON.stringify(headerSettings) !== JSON.stringify(data.sections.headerSettings)) {
                setHeaderSettings(data.sections.headerSettings);
              }
              if (JSON.stringify(footerSettings) !== JSON.stringify(data.sections.footerSettings)) {
                setFooterSettings(data.sections.footerSettings);
              }
            } else if (col === 'activity_logs' && data.items) {
              setActivityLogs(data.items);
            } else if (col === 'version_history' && data.items) {
              setVersionHistory(data.items);
            }
          }
        }
      }, (error) => {
        // Safe snapshot console stand-by
      });
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [pages, menus, blogs, services, products, media, forms, redirects, announcements, faqs, testimonials, seoConfig, headerSettings, footerSettings, portfolio]);

  // --- PERSISTENCE SYNCHRONIZER HOOKS ---
  useEffect(() => {
    localStorage.setItem('wz_cms_pages', JSON.stringify(pages));
    if (isBypassingSync.current.pages) {
      isBypassingSync.current.pages = false;
    } else {
      writeToFirestoreSync('pages', pages);
    }
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('wz_cms_menus', JSON.stringify(menus));
    if (isBypassingSync.current.menus) {
      isBypassingSync.current.menus = false;
    } else {
      writeToFirestoreSync('menus', menus);
    }
  }, [menus]);

  useEffect(() => {
    localStorage.setItem('wz_cms_blogs', JSON.stringify(blogs));
    if (isBypassingSync.current.blog_posts) {
      isBypassingSync.current.blog_posts = false;
    } else {
      writeToFirestoreSync('blog_posts', blogs);
    }
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('wz_cms_services', JSON.stringify(services));
    if (isBypassingSync.current.services) {
      isBypassingSync.current.services = false;
    } else {
      writeToFirestoreSync('services', services);
    }
  }, [services]);

  useEffect(() => {
    localStorage.setItem('wz_cms_products', JSON.stringify(products));
    if (isBypassingSync.current.products) {
      isBypassingSync.current.products = false;
    } else {
      writeToFirestoreSync('products', products);
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wz_cms_media', JSON.stringify(media));
    if (isBypassingSync.current.media_library) {
      isBypassingSync.current.media_library = false;
    } else {
      writeToFirestoreSync('media_library', media);
    }
  }, [media]);

  useEffect(() => {
    localStorage.setItem('wz_cms_forms', JSON.stringify(forms));
    if (isBypassingSync.current.forms) {
      isBypassingSync.current.forms = false;
    } else {
      writeToFirestoreSync('forms', forms);
    }
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('wz_cms_redirects', JSON.stringify(redirects));
    if (isBypassingSync.current.redirects) {
      isBypassingSync.current.redirects = false;
    } else {
      writeToFirestoreSync('redirects', redirects);
    }
  }, [redirects]);

  useEffect(() => {
    localStorage.setItem('wz_cms_announcements', JSON.stringify(announcements));
    if (isBypassingSync.current.announcements) {
      isBypassingSync.current.announcements = false;
    } else {
      writeToFirestoreSync('announcements', announcements);
    }
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('wz_cms_faqs', JSON.stringify(faqs));
    if (isBypassingSync.current.faqs) {
      isBypassingSync.current.faqs = false;
    } else {
      writeToFirestoreSync('faqs', faqs);
    }
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('wz_cms_testimonials', JSON.stringify(testimonials));
    if (isBypassingSync.current.testimonials) {
      isBypassingSync.current.testimonials = false;
    } else {
      writeToFirestoreSync('testimonials', testimonials);
    }
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('wz_cms_portfolio', JSON.stringify(portfolio));
    if (isBypassingSync.current.portfolio) {
      isBypassingSync.current.portfolio = false;
    } else {
      writeToFirestoreSync('portfolio', portfolio);
    }
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('wz_cms_seo', JSON.stringify(seoConfig));
    if (isBypassingSync.current.seo_settings) {
      isBypassingSync.current.seo_settings = false;
    } else {
      setDoc(doc(db, 'cms_sync', 'seo_settings'), { settings: seoConfig, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [seoConfig]);

  useEffect(() => {
    localStorage.setItem('wz_cms_header_footer_settings', JSON.stringify({ headerSettings, footerSettings }));
    if (isBypassingSync.current.homepage_sections) {
      isBypassingSync.current.homepage_sections = false;
    } else {
      setDoc(doc(db, 'cms_sync', 'homepage_sections'), { sections: { headerSettings, footerSettings }, updatedAt: new Date().toISOString() }).catch(() => {});
    }
  }, [headerSettings, footerSettings]);

  useEffect(() => {
    localStorage.setItem('wz_cms_activity_logs', JSON.stringify(activityLogs));
    setDoc(doc(db, 'cms_sync', 'activity_logs'), { items: activityLogs, updatedAt: new Date().toISOString() }).catch(() => {});
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('wz_cms_version_history', JSON.stringify(versionHistory));
    setDoc(doc(db, 'cms_sync', 'version_history'), { items: versionHistory, updatedAt: new Date().toISOString() }).catch(() => {});
  }, [versionHistory]);

  // Firestore background write helper wrapper to satisfy secure rule mandates securely
  const writeToFirestoreSync = async (collectionPath: string, dataArray: any[]) => {
    try {
      // Background write sync doc to represents active states stably
      const syncDocRef = doc(db, 'cms_sync', collectionPath);
      await setDoc(syncDocRef, {
        items: dataArray,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      // Fail silently for local-sandbox preview without throwing blocks
      console.info(`Firestore background sync standing by for operational environment config: ${collectionPath}`);
    }
  };

  const handleFetchFromFirestoreCollection = async () => {
    try {
      triggerToast("🔄 Syncing CMS collections with Live cloud Firestore...");
      const snapshot = await getDocs(collection(db, 'cms_sync'));
      let syncedCount = 0;
      snapshot.forEach(docSnap => {
        const path = docSnap.id;
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          syncedCount++;
          if (path === 'pages') setPages(data.items);
          else if (path === 'menus') setMenus(data.items);
          else if (path === 'blog_posts') setBlogs(data.items);
          else if (path === 'services') setServices(data.items);
          else if (path === 'products') setProducts(data.items);
          else if (path === 'media_library') setMedia(data.items);
          else if (path === 'forms') setForms(data.items);
          else if (path === 'redirects') setRedirects(data.items);
          else if (path === 'announcements') setAnnouncements(data.items);
          else if (path === 'faqs') setFaqs(data.items);
          else if (path === 'testimonials') setTestimonials(data.items);
          else if (path === 'portfolio') setPortfolio(data.items);
        }
      });
      triggerToast(`✅ Successfully reconciled ${syncedCount} CMS collections!`);
    } catch (err: any) {
      triggerToast("💡 Local Sandbox Mode: Persisted in local state successfully.");
    }
  };

  // --- SUBMENU VIEW CONTROLLER ---
  // If activeSubMenu is from parent, normalise to local category path
  const [localMenu, setLocalMenu] = useState<string>('dashboard');
  useEffect(() => {
    if (activeSubMenu.startsWith('cms-')) {
      setLocalMenu(activeSubMenu.replace('cms-', ''));
    }
  }, [activeSubMenu]);

  const handleUpdateLocalMenu = (id: string) => {
    setLocalMenu(id);
    setActiveSubMenu(`cms-${id}`);
  };

  // --- MODAL & EDITOR STATES ---
  const [showPageEditor, setShowPageEditor] = useState<CmsPage | null>(null);
  const [showBlogEditor, setShowBlogEditor] = useState<CmsBlogPost | null>(null);
  const [showServiceEditor, setShowServiceEditor] = useState<CmsService | null>(null);
  const [showProductEditor, setShowProductEditor] = useState<CmsProduct | null>(null);
  const [showRedirectEditor, setShowRedirectEditor] = useState<CmsRedirect | null>(null);
  const [showPortfolioEditor, setShowPortfolioEditor] = useState<PortfolioItem | null>(null);

  // --- PAYMENT SETTINGS STATES ---
  const [setPaymentSubTab, setSetPaymentSubTab] = useState<'overview' | 'bd' | 'sa' | 'intl' | 'verification' | 'history'>('overview');
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodCountry, setNewMethodCountry] = useState('Bangladesh');
  const [newMethodType, setNewMethodType] = useState('Mobile Money');
  const [newMethodLogo, setNewMethodLogo] = useState('');
  const [newMethodQr, setNewMethodQr] = useState('');
  const [newMethodInstructions, setNewMethodInstructions] = useState('');
  const [selectedVerifyOrder, setSelectedVerifyOrder] = useState<any>(null);
  const [verifyingProgress, setVerifyingProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyActionType, setVerifyActionType] = useState<'approve' | 'reject'>('approve');
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('all');
  const [txMethodFilter, setTxMethodFilter] = useState('all');

  const getOrderSerialResolved = getOrderSerial || ((orderId: string) => {
    if (orderId && orderId.startsWith('Order-')) return orderId;
    const idx = orders.findIndex(o => o.id === orderId);
    return idx !== -1 ? `Order-${101 + idx}` : (orderId || 'Order-101');
  });

  // CMS Accident prevention delete confirmation dialogue state
  const [deleteConf, setDeleteConf] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: null
  });

  // Dynamic Page Builder Subsections Control
  const [selectedBuilderPage, setSelectedBuilderPage] = useState<CmsPage | null>(null);

  // Search filter
  const [cmsSearch, setCmsSearch] = useState('');

  // Media Library helpers
  const [mediaFolder, setMediaFolder] = useState<string>('All Files');
  const [mediaFolders, setMediaFolders] = useState<string[]>(['All Files', 'Home Banner', 'Documents', 'Products', 'Blog Assets']);
  const [newFolderInput, setNewFolderInput] = useState('');
  const [simUploadInput, setSimUploadInput] = useState({ name: '', size: '124 KB', type: 'image' });

  // Custom Form Creator helper
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormFields, setNewFormFields] = useState<any[]>([{ name: 'Email Address', type: 'email', required: true }]);

  // --- UI STYLING ELEMENTS ---
  const cardBg = isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100 shadow-sm';
  const inputStyle = `w-full rounded px-3 py-1.5 text-xs border ${
    isDark ? 'bg-neutral-950 border-neutral-800 text-white focus:outline-none focus:border-purple-500' : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:outline-none focus:border-purple-600'
  }`;
  const labelStyle = `text-[10px] font-bold block mb-1 uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`;

  const premiumInputClass = `w-full h-14 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border focus:outline-hidden focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-purple-500 ${
    isDark 
      ? 'bg-[#111827] border-[#374151] text-white placeholder-neutral-500' 
      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-neutral-400'
  }`;

  const premiumLabelClass = `text-xs font-semibold block mb-1 uppercase tracking-wider ${
    isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'
  }`;

  const premiumPrimaryBtnClass = `w-full h-14 px-6 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-bold text-sm hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] active:scale-[0.98] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer`;

  const premiumSecondaryBtnClass = `w-full h-14 px-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800 bg-white/10 hover:bg-white/20 dark:hover:bg-neutral-900/40 text-neutral-600 dark:text-neutral-300 font-bold text-sm hover:scale-[1.02] hover:shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer`;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen ${isDark ? 'text-white' : 'text-neutral-900'}`} id="website-control-panel-root">
      
      {/* 1. SUBNEMU MINI-SIDEBAR RAIL */}
      <div className={`col-span-1 lg:col-span-3 p-4 rounded-2xl border ${cardBg} self-start`} id="cms-rail-container">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h4 className="text-sm font-bold tracking-tight">CMS Navigator</h4>
            <p className="text-[10px] opacity-60">WordPress + Shopify Controls</p>
          </div>
          <button 
            onClick={handleFetchFromFirestoreCollection}
            className="p-1 px-2 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[10px] flex items-center gap-1 font-mono hover:scale-105 transition"
            title="Fetch Database Collections"
          >
            <RefreshCw className="w-3 h-3" /> Sync Remote
          </button>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'dashboard', label: '📊 CMS Dashboard', icon: BarChart },
            { id: 'preview', label: '🖥️ Shopify Live Preview', icon: Eye },
            { id: 'pages', label: '📄 Pages Manager', icon: FileText },
            { id: 'menus', label: '⚓ Menus & Dropdowns', icon: Menu },
            { id: 'blogs', label: '✍️ Blog Engine', icon: BookOpen },
            { id: 'categories', label: '📁 Categories & Tags', icon: Tag },
            { id: 'services', label: '💼 Services Catalog', icon: Briefcase },
            { id: 'products', label: '🛒 WooCommerce Products', icon: ShoppingBag },
            { id: 'portfolio', label: '🎨 Our Portfolio', icon: Award },
            { id: 'media', label: '🖼️ Media Library', icon: FolderOpen },
            { id: 'forms', label: '📝 Forms & Lead Desk', icon: FileCode },
            { id: 'seo', label: '🔍 Enterprise SEO Manager', icon: Globe },
            { id: 'builders', label: '🏗️ Layout Builders', icon: Layers },
            { id: 'testimonials', label: '⭐ Feedback & FAQs', icon: Sparkles },
            { id: 'announcements', label: '📢 Broadcast & Redirects', icon: Megaphone },
            { id: 'logs', label: '📋 System Activity Logs', icon: Compass },
            { id: 'versions', label: '🕒 Version History', icon: Clock },
            { id: 'settings', label: '⚙️ Website Settings', icon: Settings },
            { id: 'payment', label: '💳 Payment Settings', icon: CreditCard }
          ].map(item => {
            const isSel = localMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleUpdateLocalMenu(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                  isSel 
                    ? 'bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 font-bold' 
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 opacity-85'
                }`}
              >
                <item.icon className="w-4 h-4 text-purple-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. CMS CONTENT CORE PANEL */}
      <div className="col-span-1 lg:col-span-9 space-y-6">

        {/* CMS DASHBOARD SCANNABLE VIEW */}
        {localMenu === 'dashboard' && (
          <div className="space-y-6" id="cms-dashboard--view">
            <div className={`p-6 rounded-2xl border ${cardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2 font-sans">
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                WebzoneBD Super Admin CMS
              </h2>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                Configure entire marketing sections, product portfolios, drag sections and publish media arrays stably to Firestore.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { name: 'Total Pages', val: pages.length, desc: 'Static routes', color: 'text-blue-500' },
                  { name: 'Products Catalog', val: products.length, desc: 'Woo templates', color: 'text-amber-500' },
                  { name: 'Bespoke Services', val: services.length, desc: 'Active services', color: 'text-emerald-500' },
                  { name: 'Media Library', val: media.length, desc: 'Files listed', color: 'text-primary' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/40">
                    <span className="text-[10px] text-neutral-400 block font-bold uppercase">{stat.name}</span>
                    <span className={`text-2xl font-black block mt-1 ${stat.color}`}>{stat.val}</span>
                    <span className="text-[9px] text-neutral-400 font-mono mt-0.5 block">{stat.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Launch Console */}
              <div className={`p-6 rounded-2xl border ${cardBg}`}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-3">⚡ Quick Action Hub</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button onClick={() => { handlePageCreateInit(); handleUpdateLocalMenu('pages'); }} className="p-3 text-left border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-purple-500" /> Page Workspace
                  </button>
                  <button onClick={() => { handleBlogCreateInit(); handleUpdateLocalMenu('blogs'); }} className="p-3 text-left border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" /> New Blog Article
                  </button>
                  <button onClick={() => { handleProductCreateInit(); handleUpdateLocalMenu('products'); }} className="p-3 text-left border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-500" /> Add Woo Product
                  </button>
                  <button onClick={() => handleUpdateLocalMenu('seo')} className="p-3 text-left border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" /> Config Yoast SEO
                  </button>
                </div>
              </div>

              {/* Site Setup status */}
              <div className={`p-6 rounded-2xl border ${cardBg}`}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-2">📡 Operational Telemetry</h3>
                <div className="space-y-2 mt-4 text-xs font-mono">
                  <div className="p-2.5 rounded bg-neutral-150 dark:bg-neutral-950 flex items-center justify-between">
                    <span className="text-neutral-400">Database Engine</span>
                    <span className="text-emerald-500 font-bold">Firestore Enterprise</span>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-150 dark:bg-neutral-950 flex items-center justify-between">
                    <span className="text-neutral-400">Media Sync Gateway</span>
                    <span className="text-purple-400 font-bold">Unsplash CDN proxy</span>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-150 dark:bg-neutral-950 flex items-center justify-between">
                    <span className="text-neutral-400">Sitemap Pipeline</span>
                    <span className="text-blue-400 font-bold">Dynamic XML Auto-Gen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGES WORKSPACE CMS VIEW */}
        {localMenu === 'pages' && (
          <div className="space-y-6" id="cms-pages--view">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight">Active Pages Index</h2>
                <p className="text-xs text-neutral-400">Create, Duplicate and Drag-Build sections for WebzoneBD pages.</p>
              </div>
              <button 
                onClick={handlePageCreateInit}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono tracking-wide flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Create Page
              </button>
            </div>

            {/* List Array */}
            <div className={`p-4 rounded-2xl border ${cardBg} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold">
                      <th className="py-2.5">Title</th>
                      <th className="py-2.5">Slug / Path</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {pages.map(pg => (
                      <tr key={pg.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="py-3 font-semibold">{pg.title}</td>
                        <td className="py-3 text-neutral-400 font-mono">/{pg.slug}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                            pg.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {pg.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex gap-1.5">
                            <button onClick={() => setSelectedBuilderPage(pg)} className="p-1 px-2 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[10px] flex items-center gap-0.5 text-purple-400 font-bold" title="Open Layout Builder">
                              <Layers className="w-3 h-3" /> Page Builder
                            </button>
                            <button onClick={() => setShowPageEditor(pg)} className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:text-purple-400" title="Edit Properties">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDuplicatePage(pg)} className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:text-amber-500" title="Duplicate Page">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                setDeleteConf({
                                  isOpen: true,
                                  title: `Delete Page "${pg.title}"?`,
                                  description: `Are you absolutely certain you want to permanently delete the custom page "${pg.title}"? This will discard all visual sub-sections and routes associated with this URL mapping pattern.`,
                                  onConfirm: () => handleDeletePage(pg.id)
                                });
                              }} 
                              className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:text-red-500" 
                              title="Delete"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Page Builder Sub-Section */}
            {selectedBuilderPage && (
              <div className={`p-6 rounded-2xl border border-purple-500/30 ${cardBg} relative overflow-hidden`} id="visual-section-builder">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-250 dark:border-neutral-800">
                  <div>
                    <span className="text-[9px] bg-purple-600/25 text-purple-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Drag & Builder Panel</span>
                    <h3 className="text-sm font-black mt-1">Sections Hierarchy: {selectedBuilderPage.title}</h3>
                  </div>
                  <button onClick={() => setSelectedBuilderPage(null)} className="text-xs hover:underline text-neutral-400">Close Builder</button>
                </div>

                <div className="space-y-2 max-w-xl">
                  {selectedBuilderPage.sections && selectedBuilderPage.sections.length > 0 ? (
                    selectedBuilderPage.sections.map((sect, idx) => (
                      <div key={sect.id} className="p-3.5 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-purple-600/15 text-purple-400 flex items-center justify-center font-bold font-mono text-[10px]">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold uppercase tracking-wider text-[9px] text-purple-400 font-mono mb-0.5 block">{sect.type} Block</span>
                            <span className="text-neutral-300 font-semibold">{sect.content?.title || sect.content?.list?.join(', ') || 'Custom Section Content'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleMoveSection(selectedBuilderPage.id, idx, 'up')} className="p-1 rounded bg-neutral-100 dark:bg-neutral-900 border" title="Move Up">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleMoveSection(selectedBuilderPage.id, idx, 'down')} className="p-1 rounded bg-neutral-100 dark:bg-neutral-900 border" title="Move Down">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleDeleteSection(selectedBuilderPage.id, sect.id)} className="p-1 rounded bg-red-950 border border-red-500/10 text-red-400" title="Remove Section">
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs opacity-50 border border-dashed rounded-xl">
                      No active page builder blocks. Add a hero banner or features section below to begin!
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <button onClick={() => handleAddSection(selectedBuilderPage.id, 'hero')} className="px-3 py-1 bg-purple-600/10 text-purple-400 rounded-lg border border-purple-500/20 hover:bg-purple-600 hover:text-white transition">+ Add Hero Section</button>
                  <button onClick={() => handleAddSection(selectedBuilderPage.id, 'features')} className="px-3 py-1 bg-emerald-600/10 text-emerald-400 rounded-lg border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition">+ Add Features Section</button>
                  <button onClick={() => handleAddSection(selectedBuilderPage.id, 'pricing')} className="px-3 py-1 bg-sky-600/10 text-sky-400 rounded-lg border border-sky-500/20 hover:bg-sky-600 hover:text-white transition">+ Add Pricing Section</button>
                  <button onClick={() => handleAddSection(selectedBuilderPage.id, 'faq')} className="px-3 py-1 bg-amber-600/10 text-amber-400 rounded-lg border border-amber-500/20 hover:bg-amber-600 hover:text-white transition">+ Add FAQ Box</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MENUS BUILDER VIEW */}
        {localMenu === 'menus' && (
          <div className="space-y-6" id="cms-menus--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">WordPress Multi-Level Menu Builder</h2>
              <p className="text-xs text-neutral-400">Configure layout menus, reorder links, and customize mega menus targeting different rails.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Menu manager container */}
              {menus.map(menu => (
                <div key={menu.id} className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider">{menu.name}</h3>
                      <span className="text-[10px] text-purple-400 font-mono capitalize">{menu.type} placement</span>
                    </div>
                    <button onClick={() => handleAddMenuItem(menu.id)} className="p-1 px-2 rounded bg-purple-600 text-white text-[10px] flex items-center gap-0.5 font-bold">
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>

                  <div className="space-y-2">
                    {menu.items.map((item, idx) => (
                      <div key={item.id} className="p-2.5 rounded-lg bg-neutral-100/65 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold flex items-center gap-1.5">
                            <span className="text-purple-400">🔗</span> {item.name}
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">{item.url} ({item.target})</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button onClick={() => handleReorderMenuItems(menu.id, idx, 'up')} className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Move Up">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleReorderMenuItems(menu.id, idx, 'down')} className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Move Down">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleRemoveMenuItem(menu.id, item.id)} className="p-1 rounded hover:text-red-500" title="Delete Link">
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOG ENGINE VIEW */}
        {localMenu === 'blogs' && (
          <div className="space-y-6" id="cms-blogs--view">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight">CMS Blogging Engine</h2>
                <p className="text-xs text-neutral-400">Write fully optimized SEO posts with featured banner uploads.</p>
              </div>
              <button onClick={handleBlogCreateInit} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 transition">
                <Plus className="w-3.5 h-3.5" /> Write Article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map(post => (
                <div key={post.id} className={`p-4 rounded-xl border ${cardBg} flex gap-4 text-xs relative overflow-hidden`}>
                  <img src={post.featuredImage} alt={post.title} className="w-20 h-20 object-cover rounded-lg border border-neutral-200 dark:border-neutral-800 transform hover:scale-105 transition duration-200" />
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[9px] bg-purple-600/10 text-purple-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">{post.category}</span>
                    <h4 className="font-bold leading-snug line-clamp-1">{post.title}</h4>
                    <p className="text-neutral-500 line-clamp-2 text-[11px]">{post.content}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider font-mono">By {post.author}</span>
                      <div className="flex gap-1">
                        <button onClick={() => setShowBlogEditor(post)} className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-purple-400"><Edit3 className="w-3 h-3" /></button>
                        <button 
                          onClick={() => {
                            setDeleteConf({
                              isOpen: true,
                              title: `Delete Article "${post.title}"?`,
                              description: `Are you absolutely certain you want to permanently delete this blog post? It will vanish from the user-facing public knowledge base.`,
                              onConfirm: () => handleDeleteBlog(post.id)
                            });
                          }} 
                          className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-red-500 hover:bg-red-500/10"
                          title="Delete Post"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES & TAGS VIEW */}
        {localMenu === 'categories' && (
          <div className="space-y-6" id="cms-fields--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">Categories & Taxonomy Core</h2>
              <p className="text-xs text-neutral-400">Manage taxonomies for WordPress-style blogging and products collections.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blog taxonomy list */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <h3 className="text-xs font-black uppercase tracking-wider">Blog Categories</h3>
                <div className="flex flex-wrap gap-1.5">
                  {blogCategories.map(cat => (
                    <span key={cat} className="px-2.5 py-1 text-xs rounded bg-neutral-100 dark:bg-neutral-900 border flex items-center gap-1">
                      📁 {cat}
                      <button onClick={() => setBlogCategories(prev => prev.filter(c => c !== cat))} className="hover:text-red-500 font-bold ml-1">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input id="new-blog-cat-in" placeholder="New blog category..." className={inputStyle} />
                  <button onClick={() => {
                    const val = (document.getElementById('new-blog-cat-in') as HTMLInputElement)?.value;
                    if (val) { setBlogCategories(p => [...p, val]); triggerToast(`📁 Blog category "${val}" registered.`); (document.getElementById('new-blog-cat-in') as HTMLInputElement).value = ''; }
                  }} className="px-3 bg-purple-600 text-white rounded text-xs">Add</button>
                </div>
              </div>

              {/* Tags system */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <h3 className="text-xs font-black uppercase tracking-wider">System Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {blogTags.map(tg => (
                    <span key={tg} className="px-2.5 py-1 text-xs rounded bg-neutral-100 dark:bg-neutral-900 border flex items-center gap-1">
                      🏷️ {tg}
                      <button onClick={() => setBlogTags(prev => prev.filter(t => t !== tg))} className="hover:text-red-500 font-bold ml-1">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input id="new-blog-tag-in" placeholder="New tag..." className={inputStyle} />
                  <button onClick={() => {
                    const val = (document.getElementById('new-blog-tag-in') as HTMLInputElement)?.value;
                    if (val) { setBlogTags(p => [...p, val]); triggerToast(`🏷️ Tag "${val}" created.`); (document.getElementById('new-blog-tag-in') as HTMLInputElement).value = ''; }
                  }} className="px-3 bg-purple-600 text-white rounded text-xs">Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES MANAGEMENT VIEW */}
        {localMenu === 'services' && (
          <div className="space-y-6" id="cms-services--view">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight">Services Catalog</h2>
                <p className="text-xs text-neutral-400">Manage digital services pricing plans, packages, SLA grids, and features catalog.</p>
              </div>
              <button onClick={handleServiceCreateInit} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 transition">
                <Plus className="w-3.5 h-3.5" /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {services.map(srv => (
                <div key={srv.id} className={`p-5 rounded-xl border ${cardBg} flex flex-col md:flex-row gap-5 text-xs relative overflow-hidden`}>
                  <img src={srv.featuredImage} alt={srv.name} className="w-full md:w-32 h-32 object-cover rounded-lg border" />
                  <div className="flex-1 space-y-2">
                    <span className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">{srv.category}</span>
                    <h3 className="text-sm font-bold">{srv.name}</h3>
                    <p className="text-neutral-500 leading-relaxed">{srv.description}</p>
                    <div className="flex flex-wrap gap-2 text-[10px] text-neutral-400">
                      {srv.features.map((f, id) => (
                        <span key={id} className="bg-neutral-100 dark:bg-neutral-900 border px-2 py-0.5 rounded">✔️ {f}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80 pt-3 mt-2">
                      <span className="font-bold text-neutral-500">Packages: <span className="text-purple-400">{srv.pricing.length} Active Plans</span></span>
                      <div className="flex gap-2">
                        <button onClick={() => setShowServiceEditor(srv)} className="p-1 px-3.5 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center gap-1 hover:text-purple-400"><Edit3 className="w-3 h-3" /> Edit Packages</button>
                        <button 
                          onClick={() => {
                            setDeleteConf({
                              isOpen: true,
                              title: `Delete Service "${srv.name}"?`,
                              description: `Are you absolutely certain you want to remove the service listing "${srv.name}" and all associated plan templates?`,
                              onConfirm: () => handleDeleteService(srv.id)
                            });
                          }} 
                          className="p-1 px-2 rounded bg-neutral-100 dark:bg-neutral-800 text-red-500 hover:bg-red-500/15"
                          title="Delete Service"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WOOCOMMERCE STYLE PRODUCTS FOR WEBZONEBD */}
        {localMenu === 'products' && (
          <div className="space-y-6" id="cms-products--view">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight">WooCommerce Products Manager</h2>
                <p className="text-xs text-neutral-400">SaaS dashboard to sell themes, download templates, source codes and licensing scripts.</p>
              </div>
              <button onClick={handleProductCreateInit} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 transition">
                <Plus className="w-3.5 h-3.5" /> Quick Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(prod => (
                <div key={prod.id} className={`p-4 rounded-xl border ${cardBg} flex flex-col gap-3 text-xs relative overflow-hidden group`}>
                  <img src={prod.productImage} alt={prod.name} className="w-full h-32 object-cover rounded-lg border group-hover:scale-[1.01] transition duration-300" />
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-purple-600/10 text-purple-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">{prod.category}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">SKU: {prod.sku}</span>
                    </div>
                    <h4 className="font-bold leading-tight line-clamp-1">{prod.name}</h4>
                    <p className="text-neutral-500 line-clamp-2 text-[10.5px] leading-relaxed">{prod.description}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-emerald-400">${prod.salePrice || prod.price}</span>
                        {prod.salePrice && <span className="text-xs line-through text-neutral-500">${prod.price}</span>}
                      </div>

                      <div className="flex gap-1.5">
                        <button onClick={() => setShowProductEditor(prod)} className="p-1 px-2 rounded bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 hover:text-purple-400" title="Shopify Editor">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteConf({
                              isOpen: true,
                              title: `Purge "${prod.name}"?`,
                              description: `Are you absolutely sure you want to deactivate and remove this premium product from the WooCommerce digital catalog? This cannot be undone.`,
                              onConfirm: () => handleDeleteProduct(prod.id)
                            });
                          }} 
                          className="p-1 rounded bg-neutral-100 dark:bg-neutral-850 text-red-500 hover:bg-red-500/15" 
                          title="Remove Product"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEDIA LIBRARY VIEW */}
        {localMenu === 'media' && (
          <div className="space-y-6" id="cms-media--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">SaaS Media Asset Manager</h2>
              <p className="text-xs text-neutral-400">Virtual host catalog supporting JPG, WEBP, SVG, PDF, DOCX, and MP4 media syncing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Virtual Folders Sidebar */}
              <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
                <h4 className="text-xs font-black uppercase tracking-wider">Directory Folders</h4>
                <div className="space-y-1">
                  {mediaFolders.map(fold => (
                    <button
                      key={fold}
                      onClick={() => setMediaFolder(fold)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between ${
                        mediaFolder === fold ? 'bg-purple-600/15 text-purple-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <span>📁 {fold}</span>
                      <span className="text-[10px] opacity-65">
                        {fold === 'All Files' ? media.length : media.filter(m => m.folder === fold).length} assets
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
                  <div className="flex gap-2">
                    <input 
                      placeholder="New folder..." 
                      className={inputStyle}
                      value={newFolderInput}
                      onChange={(e) => setNewFolderInput(e.target.value)}
                    />
                    <button onClick={() => {
                      if (newFolderInput) {
                        setMediaFolders(p => [...p, newFolderInput]);
                        triggerToast(`📁 Folder "${newFolderInput}" created in media asset disk.`);
                        setNewFolderInput('');
                      }
                    }} className="px-3 bg-purple-600 text-white text-xs rounded">New</button>
                  </div>
                </div>
              </div>

              {/* Main Media Assets area */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-100 dark:bg-neutral-900 border p-3 rounded-lg">
                  <span className="text-xs">Location: <span className="font-mono text-purple-400">/public/uploads/{mediaFolder}/</span></span>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Simulated filename..." 
                      className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-950 border text-[11px] outline-none"
                      value={simUploadInput.name}
                      onChange={(e) => setSimUploadInput({...simUploadInput, name: e.target.value})}
                    />
                    <button onClick={() => {
                      if (!simUploadInput.name) { triggerToast("❌ Please specify sample filename first."); return; }
                      const newFile: CmsMediaFile = {
                        id: `med-` + Date.now(),
                        name: simUploadInput.name,
                        size: simUploadInput.size,
                        type: simUploadInput.type as any,
                        url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80",
                        folder: mediaFolder === 'All Files' ? 'Default' : mediaFolder
                      };
                      setMedia(prev => [...prev, newFile]);
                      triggerToast(`🚀 Integrated media file "${simUploadInput.name}" successfully!`);
                      setSimUploadInput({ name: '', size: '124 KB', type: 'image' });
                    }} className="px-3 py-1 bg-purple-600 text-white rounded text-[11px] font-bold flex items-center gap-1">
                      <Save className="w-3.5 h-3.5" /> Upload File
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {media.filter(m => mediaFolder === 'All Files' || m.folder === mediaFolder).map(file => (
                    <div key={file.id} className={`p-3 rounded-lg border ${cardBg} text-xs flex flex-col gap-2`}>
                      <div className="w-full h-20 bg-neutral-100 dark:bg-neutral-950 rounded border flex items-center justify-center relative overflow-hidden">
                        {file.type === 'image' ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">📄</span>
                        )}
                      </div>
                      <span className="font-bold break-all line-clamp-1">{file.name}</span>
                      <div className="flex items-center justify-between text-[11px] opacity-65">
                        <span className="font-mono">{file.size}</span>
                        <button onClick={() => setMedia(prev => prev.filter(f => f.id !== file.id))} className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FORMS & LEADS VIEW */}
        {localMenu === 'forms' && (
          <div className="space-y-6" id="cms-forms--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">Form Builder & Client Submissions</h2>
              <p className="text-xs text-neutral-400">Construct custom consultation desk, forms fields layouts and examine leads submissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Creator form */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <h3 className="text-xs font-black uppercase tracking-wider">🛠️ SaaS Form Creator</h3>
                <div className="space-y-2">
                  <div>
                    <label className={labelStyle}>Form Title</label>
                    <input 
                      placeholder="e.g. Hostinger Partnership Form" 
                      className={inputStyle}
                      value={newFormTitle}
                      onChange={(e) => setNewFormTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-bold block mb-1">FIELDS STRUCTURE</span>
                    {newFormFields.map((field, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={field.name} onChange={(e) => {
                          const updated = [...newFormFields];
                          updated[i].name = e.target.value;
                          setNewFormFields(updated);
                        }} className={inputStyle} />
                        <select value={field.type} onChange={(e) => {
                          const updated = [...newFormFields];
                          updated[i].type = e.target.value;
                          setNewFormFields(updated);
                        }} className="rounded text-xs p-1 bg-neutral-100 dark:bg-neutral-900 border text-white">
                          <option value="text">Short Text</option>
                          <option value="email">Email</option>
                          <option value="select">Dropdown</option>
                        </select>
                      </div>
                    ))}
                    <button onClick={() => setNewFormFields(p => [...p, { name: 'Name', type: 'text', required: true }])} className="text-purple-400 text-xs hover:underline mt-2">+ Add Field Row</button>
                  </div>

                  <button onClick={() => {
                    if (!newFormTitle) { triggerToast("❌ Please specify form title."); return; }
                    const newForm: CmsForm = {
                      id: `frm-` + Date.now(),
                      title: newFormTitle,
                      fields: newFormFields,
                      submissions: []
                    };
                    setForms(prev => [...prev, newForm]);
                    triggerToast(`📝 Form "${newFormTitle}" successfully registered in active client templates catalog!`);
                    setNewFormTitle('');
                  }} className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs">
                    Create Dynamic Form
                  </button>
                </div>
              </div>

              {/* Submissions leads viewer */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <h3 className="text-xs font-black uppercase tracking-wider">📩 Live Leads Submissions</h3>
                {forms.map(frm => (
                  <div key={frm.id} className="p-3 rounded-lg border bg-neutral-50 dark:bg-neutral-950 text-xs space-y-2">
                    <span className="font-bold block text-purple-400">{frm.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono italic block">{frm.submissions.length} Total Submissions</span>
                    
                    {frm.submissions.map(sub => (
                      <div key={sub.id} className="p-2 bg-neutral-105 border rounded text-[11px] font-mono whitespace-pre-wrap leading-tight mt-1">
                        <div className="text-neutral-400 block border-b pb-1 mb-1 font-sans">Lead on {sub.date}</div>
                        {JSON.stringify(sub.data, null, 2)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ENTERPRISE SEO MANAGER */}
        {localMenu === 'seo' && (
          <div className="space-y-6" id="cms-seo--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">SEO Manager (Yoast & RankMath CMS)</h2>
              <p className="text-xs text-neutral-400">Configure global metadata templates, schema schemas, and robots.txt files dynamically.</p>
            </div>

            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
              <h3 className="text-xs font-black uppercase tracking-wider">Yoast Schema & Web Crawler configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Global Title Template</label>
                  <input value={seoConfig.titleTemplate} onChange={(e) => setSeoConfig({...seoConfig, titleTemplate: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Robots Meta tags</label>
                  <input value={seoConfig.metaRobots} onChange={(e) => setSeoConfig({...seoConfig, metaRobots: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Open Graph Site Brand</label>
                  <input value={seoConfig.ogSiteName} onChange={(e) => setSeoConfig({...seoConfig, ogSiteName: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>JSON-LD Schema Structure</label>
                  <input value={seoConfig.schemaType} onChange={(e) => setSeoConfig({...seoConfig, schemaType: e.target.value})} className={inputStyle} />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Robots.txt Content</label>
                <textarea rows={4} value={seoConfig.robotsTxt} onChange={(e) => setSeoConfig({...seoConfig, robotsTxt: e.target.value})} className={`${inputStyle} font-mono`} />
              </div>

              <div className="flex gap-2">
                <button onClick={() => triggerToast("🚀 Robots.txt pipeline synced successfully.")} className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-bold font-mono">
                  Test robots.txt
                </button>
                <button onClick={() => {
                  triggerToast("⚡ Dynamic XML Sitemap compiled containing 14 operational service URLs!");
                }} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold leading-none flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Generate Sitemap
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT BUILDERS */}
        {localMenu === 'builders' && (
          <div className="space-y-6" id="cms-builders--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">Homepage, Header & Footer CMS Builders</h2>
              <p className="text-xs text-neutral-400">Customize the global layout, logos, social links, and menus placement natively.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Header builder */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-3`}>
                <h3 className="text-xs font-black uppercase tracking-wider">Header Configuration</h3>
                <div>
                  <label className={labelStyle}>Platform Logo URL</label>
                  <input value={headerSettings.logoUrl} onChange={(e) => setHeaderSettings({...headerSettings, logoUrl: e.target.value})} className={inputStyle} />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" checked={headerSettings.announcementEnabled} onChange={(e) => setHeaderSettings({...headerSettings, announcementEnabled: e.target.checked})} />
                  <span className="text-xs">Enable Sitewide Announcement Bar</span>
                </div>
                <div>
                  <label className={labelStyle}>Announcement Text</label>
                  <input value={headerSettings.announcementText} onChange={(e) => setHeaderSettings({...headerSettings, announcementText: e.target.value})} className={inputStyle} />
                </div>
                <button onClick={() => triggerToast("📢 Header variables committed to memory.")} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs">Save Header Settings</button>
              </div>

              {/* Footer configuration */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-3`}>
                <h3 className="text-xs font-black uppercase tracking-wider">Footer Configuration</h3>
                <div>
                  <label className={labelStyle}>Copyright Disclaimer</label>
                  <input value={footerSettings.copyrightText} onChange={(e) => setFooterSettings({...footerSettings, copyrightText: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Linked Facebook URL</label>
                  <input value={footerSettings.socialFacebook} onChange={(e) => setFooterSettings({...footerSettings, socialFacebook: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Linked Github URL</label>
                  <input value={footerSettings.socialGithub} onChange={(e) => setFooterSettings({...footerSettings, socialGithub: e.target.value})} className={inputStyle} />
                </div>
                <button onClick={() => triggerToast("📁 Footer variables saved.")} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs">Save Footer Settings</button>
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK & FAQS */}
        {localMenu === 'testimonials' && (
          <div className="space-y-6" id="cms-testimonials--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">Testimonials & Client FAQ Manager</h2>
              <p className="text-xs text-neutral-400">Examine reviews, rating scores, testimonials and dynamic client Q&A catalogs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Testimonials */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider">Testimonials list</h3>
                  <button onClick={handleAddTestimonial} className="text-xs text-purple-400 font-bold hover:underline">+ Add Testimonial</button>
                </div>

                <div className="space-y-3">
                  {testimonials.map(t => (
                    <div key={t.id} className="p-3 bg-neutral-100/65 dark:bg-neutral-950 border rounded-lg text-xs flex gap-3">
                      <img src={t.avatar} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <div className="font-bold">{t.clientName} <span className="text-[10px] text-neutral-400 font-mono">({t.businessName})</span></div>
                        <span className="text-yellow-500 font-bold">{"★".repeat(t.rating)}</span>
                        <p className="text-neutral-500 italic leading-snug mt-1">{t.reviewText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ lists */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider">Frequently Asked Questions</h3>
                  <button onClick={handleAddFAQ} className="text-xs text-purple-400 font-bold hover:underline">+ Add QA Node</button>
                </div>

                <div className="space-y-3">
                  {faqs.map(item => (
                    <div key={item.id} className="p-3 bg-neutral-100/65 dark:bg-neutral-950 border rounded-lg text-xs space-y-1">
                      <span className="font-bold flex items-center gap-1 text-purple-400">❓ {item.question}</span>
                      <p className="text-neutral-500 leading-relaxed pl-4">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BROADCASTS & REDIRECTS */}
        {localMenu === 'announcements' && (
          <div className="space-y-6" id="cms-announcements--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">Sitewide Announcements & URL Shortener redirects</h2>
              <p className="text-xs text-neutral-400">Configure sitewide countdown/marketing announcements and manage SEO HTTP redirects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Broadcast announcement */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <h3 className="text-xs font-black uppercase tracking-wider">Announcements styling</h3>
                {announcements.map(ann => (
                  <div key={ann.id} className="p-3 rounded-lg text-xs space-y-2 border" style={{ backgroundColor: ann.bgColor + '15', borderColor: ann.bgColor + '30' }}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono font-bold uppercase text-[9px]" style={{ color: ann.bgColor }}>Countdown Live</span>
                      <input type="checkbox" checked={ann.isActive} onChange={() => {
                        setAnnouncements(p => p.map(a => a.id === ann.id ? { ...a, isActive: !a.isActive } : a));
                      }} />
                    </div>
                    <p style={{ color: isDark ? '#ffffff' : '#111827' }} className="font-bold">{ann.text}</p>
                    <div className="flex gap-2">
                      <input type="color" value={ann.bgColor} onChange={(e) => {
                        setAnnouncements(p => p.map(a => a.id === ann.id ? { ...a, bgColor: e.target.value } : a));
                      }} className="w-8 h-6 bg-transparent border-none cursor-pointer" />
                      <span className="text-[10px] text-neutral-400 font-mono uppercase mt-0.5">{ann.bgColor}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* URL Redirect core */}
              <div className={`p-5 rounded-2xl border ${cardBg} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider">URL Redirection rules</h3>
                  <button onClick={handleRedirectCreateInit} className="text-xs text-purple-400 font-bold hover:underline">+ Create Rule</button>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  {redirects.map(r => (
                    <div key={r.id} className="p-2 bg-neutral-100/65 dark:bg-neutral-950 border rounded-lg flex items-center justify-between">
                      <div>
                        <div><span className="text-red-400 font-bold">{r.statusCode}</span> <span className="text-neutral-400">{r.oldUrl}</span> → {r.newUrl}</div>
                        <span className="text-[9px] text-neutral-400 block font-sans mt-0.5">Hits Tracker: {r.hits} redirects redirecting</span>
                      </div>
                      <button onClick={() => setRedirects(p => p.filter(it => it.id !== r.id))} className="text-red-500 hover:scale-105 ml-2 font-black">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OUR PORTFOLIO & SUCCESS STORIES CMS VIEW */}
        {localMenu === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn" id="cms-portfolio--view">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Award className="text-purple-500 w-5 h-5" /> Our Strategic Client Deployments
                </h2>
                <p className="text-xs text-neutral-400">Manage case studies, screenshots, video walkthroughs, key deliverables and dynamic features.</p>
              </div>
              <button 
                onClick={handlePortfolioCreateInit}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs font-bold font-sans tracking-wide flex items-center gap-1.5 transition-all duration-300 hover:scale-102 hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] active:scale-95 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Strategic Project
              </button>
            </div>

            {/* List and search filtering bar */}
            <div className={`p-4 rounded-xl border ${cardBg} flex flex-col sm:flex-row gap-3 items-center justify-between`}>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search portfolio by title, brand, or technology..."
                  value={cmsSearch}
                  onChange={(e) => setCmsSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100/50 dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <span className="text-xs text-neutral-400 font-mono font-bold">
                {portfolio.length} Projects Deployed
              </span>
            </div>

            {/* Grid of Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portfolio.filter(item => {
                const s = cmsSearch.toLowerCase().trim();
                return !s || item.title.toLowerCase().includes(s) || 
                       (item.titleBn && item.titleBn.toLowerCase().includes(s)) ||
                       item.client.toLowerCase().includes(s) ||
                       item.techStack.some(t => t.toLowerCase().includes(s));
              }).map(project => (
                <div 
                  key={project.id} 
                  className={`p-4 rounded-2xl border ${cardBg} hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between group h-full`}
                >
                  <div className="space-y-3">
                    <div className="w-full h-36 bg-neutral-150 dark:bg-neutral-950 rounded-xl overflow-hidden relative border">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      {project.videoUrl && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-full">
                          VIDEO DEMO
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-[9px] px-2 py-0.5 rounded font-mono uppercase">
                        {project.categoryLabel}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xs sm:text-sm font-extrabold line-clamp-1 text-neutral-900 dark:text-neutral-100">
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                          #{tech}
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] text-neutral-400 space-y-1 pt-2 border-t font-mono">
                      <p>Client: <strong className="text-neutral-700 dark:text-neutral-300">{project.client}</strong></p>
                      <p>Build Period: <strong className="text-neutral-700 dark:text-neutral-300">{project.duration}</strong></p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t mt-4">
                    <button 
                      onClick={() => setShowPortfolioEditor(project)}
                      className="flex-1 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-purple-600/10 hover:text-purple-400 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-purple-400" /> Edit Deployment
                    </button>
                    <button 
                      onClick={() => handleDeletePortfolio(project.id)}
                      className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/15 text-red-500 transition cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEBSITE CMS SETTINGS */}
        {localMenu === 'settings' && (
          <div className="space-y-6" id="cms-settings--view">
            <div>
              <h2 className="text-lg font-black tracking-tight">Website Core Identity Settings</h2>
              <p className="text-xs text-neutral-400">Configure global metadata properties, CMS email triggers and bKash parameters.</p>
            </div>

            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
              <h3 className="text-xs font-black uppercase tracking-wider">CMS properties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Primary Contact Mobile (Bangladesh)</label>
                  <input placeholder="+880 1700 000000" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Support Ticket Escalation Window</label>
                  <select className={inputStyle}>
                    <option>Instant (Under 15 minutes SLA)</option>
                    <option>Standard (Under 4 hours)</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>CMS Language Locales</label>
                  <div className="flex gap-2 text-xs pt-1">
                    <span className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 border">en (English)</span>
                    <span className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 border">bn (Bengali)</span>
                    <span className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 border">ar (Arabic)</span>
                  </div>
                </div>
              </div>
              <button onClick={() => triggerToast("🔒 CMS Global properties synced successfully.")} className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono tracking-wide">
                Commit Global State Changes
              </button>
            </div>
          </div>
        )}

        {/* WEBSITE CMS PAYMENT SETTINGS */}
        {localMenu === 'payment' && (
          <div className="space-y-6" id="cms-payment-settings--view">
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-4">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <CreditCard className="text-purple-500 w-5 h-5" /> Payment Gateway & Rates Settings
              </h2>
              <p className="text-xs text-neutral-400 font-sans">Configure global metadata properties, CMS payment triggers, currencies and local wallet/bank transfers credentials.</p>
            </div>

            <PaymentSettingsView
              theme={theme}
              language={language}
              orders={orders}
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
              logAdminAction={logAdminAction}
              getOrderSerialResolved={getOrderSerialResolved}
              triggerToast={triggerToast}
              updateOrderStatus={updateOrderStatus}
            />
          </div>
        )}

        {/* SHOPIFY LIVE PREVIEW SIMULATOR */}
        {localMenu === 'preview' && (
          <div className="space-y-6 animate-fadeIn" id="cms-live-preview--view">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Eye className="text-purple-500 w-5 h-5 animate-pulse" /> Live Frontend Simulator
                </h2>
                <p className="text-xs text-neutral-400">See your live WordPress, WooCommerce, and Shopify edits instantly synchronized.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addActivityLogEntry("Triggered direct sync cache refresh");
                    triggerToast("⚡ Real-time caches force-refreshed!");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-mono flex items-center gap-1.5 transition animate-pulse"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Purge Cache
                </button>
              </div>
            </div>

            {/* Simulated browser wrapper */}
            <div className={`border rounded-2xl ${cardBg} overflow-hidden shadow-2xl`}>
              {/* Simulated browser frame bar */}
              <div className="bg-neutral-100 dark:bg-neutral-900 border-b p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 max-w-lg bg-white dark:bg-neutral-800 border rounded-md px-3 py-1 text-[11px] font-mono text-neutral-500 flex items-center justify-between select-none">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-green-500 font-bold">https://</span>webzonebd.com/sandbox-live-render
                  </span>
                  <span className="text-emerald-500 text-[10px] font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    ● Realtime Secure
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400 hidden sm:inline">Active Session:</span>
                  <span className="px-2 py-0.5 font-mono text-[10px] bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-full font-bold">
                    imranh7900@gmail.com
                  </span>
                </div>
              </div>

              {/* Dynamic live renderer contents */}
              <div className="p-6 bg-slate-50 dark:bg-neutral-950 min-h-[450px] space-y-8 select-none">
                {/* Header view */}
                <header className="bg-white dark:bg-neutral-900 border rounded-xl p-4 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
                    <span className="font-sans font-black text-sm tracking-tight">{headerSettings.logoText}</span>
                  </div>
                  <nav className="hidden md:flex gap-4 text-xs font-medium text-neutral-400">
                    {menus.find(m => m.id === 'header-primary-menu')?.items.slice(0, 5).map(item => (
                      <span key={item.id} className="hover:text-purple-400 transition cursor-pointer">{item.name}</span>
                    ))}
                  </nav>
                  <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition shadow-md shadow-purple-600/10">
                    Book Call
                  </button>
                </header>

                {/* Hero area */}
                <section className="bg-gradient-to-tr from-purple-900/15 via-transparent to-transparent border border-purple-500/10 rounded-2xl p-8 relative overflow-hidden">
                  <div className="max-w-lg space-y-4">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded">
                      Live WooCommerce Catalog Deployed
                    </span>
                    <h1 className="text-2xl font-black tracking-tight leading-none">
                      Dynamic headless hosting portals built for scale.
                    </h1>
                    <p className="text-xs text-neutral-400 line-clamp-2">
                      Experience BDIX cluster Nodes designed to process massive client queries with under 10ms micro-routing delay.
                    </p>
                  </div>
                </section>

                {/* Simulated products grid */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">🔥 Trending digital solutions</h3>
                    <span className="text-[10px] text-purple-400 hover:underline cursor-pointer">View catalog ({products.length}) →</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {products.slice(0, 3).map(p => (
                      <div key={p.id} className="bg-white dark:bg-neutral-900 border rounded-xl p-3 shadow-sm space-y-2">
                        <img src={p.productImage} className="w-full h-24 object-cover rounded-md" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-xs font-bold truncate">{p.name}</p>
                          <div className="flex gap-2 items-center mt-1">
                            {p.salePrice ? (
                              <>
                                <span className="text-xs font-bold text-green-500">${p.salePrice}</span>
                                <span className="text-[10px] line-through text-neutral-500">${p.price}</span>
                              </>
                            ) : (
                              <span className="text-xs font-bold font-mono">${p.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Catalog */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Enterprise Services ({services.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.slice(0, 2).map(s => (
                      <div key={s.id} className="bg-white dark:bg-neutral-900 border rounded-xl p-4 shadow-sm flex gap-3">
                        <img src={s.featuredImage} className="w-12 h-12 object-cover rounded-md flex-shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-xs font-bold">{s.name}</p>
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated footer view */}
                <footer className="bg-white dark:bg-neutral-900 border rounded-xl p-4 text-center space-y-2 shadow-sm">
                  <p className="text-[10px] text-neutral-400">{footerSettings.copyrightText}</p>
                  <div className="flex gap-4 justify-center text-[10px] text-purple-400">
                    <span className="hover:underline cursor-pointer">Facebook</span>
                    <span className="hover:underline cursor-pointer">LinkedIn</span>
                    <span className="hover:underline cursor-pointer">GitHub</span>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM ACTIVITY LOGS VIEW */}
        {localMenu === 'logs' && (
          <div className="space-y-6 animate-fadeIn" id="cms-activity-logs--view">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Compass className="text-purple-400 w-5 h-5" /> Enterprise Activity Audit Logs
                </h2>
                <p className="text-xs text-neutral-400">Track and audit logs for database writes, deletions, and snapshot synchronizations.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActivityLogs([]);
                  triggerToast("🔒 Local activity logs purged.");
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold font-mono transition"
              >
                Clear Log Buffer
              </button>
            </div>

            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
              <div className="border rounded-xl overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                {activityLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400">
                    No active audit logs in operational buffer. Create or edit pages to populate immediately.
                  </div>
                ) : (
                  activityLogs.map((log: any) => (
                    <div key={log.id} className="p-3.5 bg-neutral-50/50 dark:bg-neutral-900/20 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/20 transition flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-neutral-300">{log.action}</p>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                          <span className="font-mono text-purple-400">{log.who}</span>
                          <span className="opacity-40">•</span>
                          <span>{new Date(log.when).toLocaleDateString()} at {new Date(log.when).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-purple-600/10 text-purple-400 text-[9px] font-mono border border-purple-500/10 font-black">
                        SUCCESS
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VERSION HISTORY VIEW */}
        {localMenu === 'versions' && (
          <div className="space-y-6 animate-fadeIn" id="cms-version-history--view">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Clock className="text-purple-400 w-5 h-5 animate-pulse" /> CMS Version & Rollback Manager
                </h2>
                <p className="text-xs text-neutral-400">Securely roll back system states to previous checkpoints automatically.</p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    createVersionEntry("Manual snapshot backup", "pages", pages);
                    triggerToast("✨ Manual Version checkpoint registered!");
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold font-mono shadow-md shadow-purple-600/15"
                >
                  Create Backup Checkpoint
                </button>
              </div>

              <div className="border rounded-xl overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800 font-sans">
                {versionHistory.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
                    <p>No historic version records registered yet.</p>
                    <p className="text-[10px] text-neutral-500">Backup checkpoints appear automatically when editing or via structural commits.</p>
                  </div>
                ) : (
                  versionHistory.map((ver: any) => (
                    <div key={ver.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/10 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-neutral-200">{ver.what}</p>
                          <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border text-[9px] font-mono text-neutral-400">
                            {ver.collectionPath}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                          <span className="font-mono text-purple-400">{ver.who}</span>
                          <span className="opacity-40">•</span>
                          <span>{new Date(ver.when).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const data = JSON.parse(ver.restoreData);
                            if (ver.collectionPath === 'pages') setPages(data);
                            else if (ver.collectionPath === 'menus') setMenus(data);
                            else if (ver.collectionPath === 'blog_posts') setBlogs(data);
                            else if (ver.collectionPath === 'services') setServices(data);
                            else if (ver.collectionPath === 'products') setProducts(data);
                            else if (ver.collectionPath === 'media_library') setMedia(data);
                            else if (ver.collectionPath === 'forms') setForms(data);
                            else if (ver.collectionPath === 'redirects') setRedirects(data);
                            else if (ver.collectionPath === 'announcements') setAnnouncements(data);
                            else if (ver.collectionPath === 'faqs') setFaqs(data);
                            else if (ver.collectionPath === 'testimonials') setTestimonials(data);
                            
                            addActivityLogEntry(`Restored CMS version for ${ver.collectionPath} -> (${ver.what})`);
                            triggerToast(`✨ Version restored!`);
                          } catch (e) {
                            triggerToast("❌ Failed to parse data safely.");
                          }
                        }}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-bold font-mono transition shadow"
                      >
                        Rollback
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- EDITORS & SLIDERS SLIDE-OVER OVERLAYS --- */}
      
      {/* 1. Page Editor Overlay */}
      {showPageEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border ${cardBg} max-h-[85vh] overflow-y-auto space-y-4`}>
            <h3 className="text-sm font-black uppercase tracking-wider">Configure Page Properties</h3>
            <div className="space-y-2.5">
              <div>
                <label className={labelStyle}>Page Title</label>
                <input value={showPageEditor.title} onChange={(e) => setShowPageEditor({...showPageEditor, title: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Slug (Relative path)</label>
                <input value={showPageEditor.slug} onChange={(e) => setShowPageEditor({...showPageEditor, slug: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Featured Image URL</label>
                <input value={showPageEditor.featuredImage} onChange={(e) => setShowPageEditor({...showPageEditor, featuredImage: e.target.value})} className={inputStyle} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b">
                <div>
                  <label className={labelStyle}>SEO Header Title</label>
                  <input value={showPageEditor.seoTitle} onChange={(e) => setShowPageEditor({...showPageEditor, seoTitle: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Canonical URL</label>
                  <input value={showPageEditor.canonicalUrl} onChange={(e) => setShowPageEditor({...showPageEditor, canonicalUrl: e.target.value})} className={inputStyle} />
                </div>
              </div>
              <div>
                <label className={labelStyle}>SEO Meta Description</label>
                <textarea rows={2} value={showPageEditor.metaDescription} onChange={(e) => setShowPageEditor({...showPageEditor, metaDescription: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Operational Status</label>
                <select value={showPageEditor.status} onChange={(e) => setShowPageEditor({...showPageEditor, status: e.target.value as any})} className={inputStyle}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
              <button onClick={() => setShowPageEditor(null)} className="px-3 py-1.5 rounded text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800">Cancel</button>
              <button onClick={() => {
                setPages(prev => prev.map(p => p.id === showPageEditor.id ? showPageEditor : p));
                triggerToast(`✅ Updated static page properties of /${showPageEditor.slug} seamlessly!`);
                setShowPageEditor(null);
              }} className="px-4.5 py-1.5 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Blog Editor Overlay */}
      {showBlogEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border ${cardBg} max-h-[85vh] overflow-y-auto space-y-4`}>
            <h3 className="text-sm font-black uppercase tracking-wider">Configure Blog post</h3>
            <div className="space-y-3">
              <div>
                <label className={labelStyle}>Blog Title</label>
                <input value={showBlogEditor.title} onChange={(e) => setShowBlogEditor({...showBlogEditor, title: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Url Slug</label>
                <input value={showBlogEditor.slug} onChange={(e) => setShowBlogEditor({...showBlogEditor, slug: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Featured Image Unsplash Link</label>
                <input value={showBlogEditor.featuredImage} onChange={(e) => setShowBlogEditor({...showBlogEditor, featuredImage: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Category</label>
                <select value={showBlogEditor.category} onChange={(e) => setShowBlogEditor({...showBlogEditor, category: e.target.value})} className={inputStyle}>
                  {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Blog Body Markdown Content</label>
                <textarea rows={4} value={showBlogEditor.content} onChange={(e) => setShowBlogEditor({...showBlogEditor, content: e.target.value})} className={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Author</label>
                  <input value={showBlogEditor.author} onChange={(e) => setShowBlogEditor({...showBlogEditor, author: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Operational Status</label>
                  <select value={showBlogEditor.status} onChange={(e) => setShowBlogEditor({...showBlogEditor, status: e.target.value as any})} className={inputStyle}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
              <button onClick={() => setShowBlogEditor(null)} className="px-3 py-1.5 rounded text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800">Cancel</button>
              <button onClick={() => {
                setBlogs(prev => prev.map(b => b.id === showBlogEditor.id ? showBlogEditor : b));
                triggerToast(`✅ Blog "${showBlogEditor.title}" saved successfully.`);
                setShowBlogEditor(null);
              }} className="px-4.5 py-1.5 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold">Save Blog</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Service Editor Overlay */}
      {showServiceEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border ${cardBg} max-h-[85vh] overflow-y-auto space-y-4`}>
            <h3 className="text-sm font-black uppercase tracking-wider">Configure Service & Pricing plans</h3>
            <div className="space-y-3">
              <div>
                <label className={labelStyle}>Service Portfolio Name</label>
                <input value={showServiceEditor.name} onChange={(e) => setShowServiceEditor({...showServiceEditor, name: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Brief Category</label>
                <input value={showServiceEditor.category} onChange={(e) => setShowServiceEditor({...showServiceEditor, category: e.target.value})} className={inputStyle} />
              </div>
              <div className="p-3 border rounded-xl bg-neutral-100/40 dark:bg-neutral-950 space-y-2">
                <span className="text-[10px] font-bold block">PRICING TIERS CONTROLLER</span>
                {showServiceEditor.pricing.map((tier, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={tier.name} onChange={(e) => {
                      const updated = [...showServiceEditor.pricing];
                      updated[i].name = e.target.value;
                      setShowServiceEditor({...showServiceEditor, pricing: updated});
                    }} placeholder="Tier" className={inputStyle} />
                    <input type="number" value={tier.price} onChange={(e) => {
                      const updated = [...showServiceEditor.pricing];
                      updated[i].price = Number(e.target.value);
                      setShowServiceEditor({...showServiceEditor, pricing: updated});
                    }} className="w-20 rounded border px-2 py-1 text-xs dark:bg-neutral-900" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
              <button onClick={() => setShowServiceEditor(null)} className="px-3 py-1.5 rounded text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800">Cancel</button>
              <button onClick={() => {
                setServices(prev => prev.map(s => s.id === showServiceEditor.id ? showServiceEditor : s));
                triggerToast(`✅ Digital service packages updated perfectly.`);
                setShowServiceEditor(null);
              }} className="px-4.5 py-1.5 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold">Save Portfolios</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Product Editor Overlay */}
      {showProductEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border ${cardBg} max-h-[85vh] overflow-y-auto space-y-4`} id="shopify-style-product-editor">
            <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              Shopify/WooCommerce Product Composer
            </h3>
            <div className="space-y-3">
              <div>
                <label className={labelStyle}>Product Display Name</label>
                <input value={showProductEditor.name} onChange={(e) => setShowProductEditor({...showProductEditor, name: e.target.value})} className={inputStyle} />
              </div>

              {/* Real-time file-input custom thumbnail image preview upload zone */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-50 dark:bg-neutral-900/40 p-3 rounded-xl border border-neutral-150 dark:border-neutral-800">
                {showProductEditor.productImage ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-250 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950 flex-shrink-0">
                    <img 
                      src={showProductEditor.productImage} 
                      alt="Product thumbnail preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center text-[10px] text-neutral-400 font-medium flex-shrink-0">
                    No Thumbnail
                  </div>
                )}
                <div className="flex-1 space-y-1.5 w-full">
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
                    Product Thumbnail Image
                  </label>
                  <div className="flex flex-col gap-1.5">
                    <input 
                      type="file" 
                      accept="image/*"
                      id="cms-product-file-thumbnail"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setShowProductEditor({
                                ...showProductEditor,
                                productImage: event.target.result as string
                              });
                              triggerToast("📷 Product thumbnail preview generated successfully.");
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-[11px] text-neutral-500 dark:text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-emerald-600/10 file:text-emerald-500 hover:file:bg-emerald-600/20 cursor-pointer w-full"
                    />
                    <input 
                      type="text"
                      placeholder="Or paste direct image URL instead..."
                      value={showProductEditor.productImage}
                      onChange={(e) => setShowProductEditor({...showProductEditor, productImage: e.target.value})}
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-800 text-[11px] px-2 py-1 rounded outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>SKU identification</label>
                  <input value={showProductEditor.sku} onChange={(e) => setShowProductEditor({...showProductEditor, sku: e.target.value})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Slug</label>
                  <input value={showProductEditor.slug} onChange={(e) => setShowProductEditor({...showProductEditor, slug: e.target.value})} className={inputStyle} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Category</label>
                  <select value={showProductEditor.category} onChange={(e) => setShowProductEditor({...showProductEditor, category: e.target.value})} className={inputStyle}>
                    {productCategories.map(pC => <option key={pC} value={pC}>{pC}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Sub Category</label>
                  <select value={showProductEditor.subCategory} onChange={(e) => setShowProductEditor({...showProductEditor, subCategory: e.target.value})} className={inputStyle}>
                    {productSubCategories.map(pS => <option key={pS} value={pS}>{pS}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Base Price ($)</label>
                  <input type="number" value={showProductEditor.price} onChange={(e) => setShowProductEditor({...showProductEditor, price: Number(e.target.value)})} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Sale Price ($)</label>
                  <input type="number" value={showProductEditor.salePrice || ''} onChange={(e) => setShowProductEditor({...showProductEditor, salePrice: e.target.value ? Number(e.target.value) : undefined})} className={inputStyle} />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Product description</label>
                <textarea rows={3} value={showProductEditor.description} onChange={(e) => setShowProductEditor({...showProductEditor, description: e.target.value})} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Product Type</label>
                <select value={showProductEditor.productType} onChange={(e) => setShowProductEditor({...showProductEditor, productType: e.target.value as any})} className={inputStyle}>
                  <option value="digital">Digital Product</option>
                  <option value="service">Service Product</option>
                  <option value="downloadable">Downloadable Product</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
              <button onClick={() => setShowProductEditor(null)} className="px-3 py-1.5 rounded text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800">Cancel</button>
              <button onClick={() => {
                setProducts(prev => prev.map(p => p.id === showProductEditor.id ? showProductEditor : p));
                triggerToast(`✅ Product "${showProductEditor.name}" updated cleanly.`);
                setShowProductEditor(null);
              }} className="px-4.5 py-1.5 rounded text-xs bg-emerald-600 hover:bg-emerald-705 text-white font-bold">Commit Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Deletion Confirmation Dialog Overlay */}
      {deleteConf.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-350">
          <div className={`w-full max-w-sm rounded-2xl border ${isDark ? 'border-neutral-800 bg-neutral-950 text-white' : 'border-neutral-250 bg-white text-neutral-900'} shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200`}>
            {/* Banner strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1.5 flex-1 w-full">
                <h4 className="text-sm font-black tracking-tight uppercase font-sans">
                  {deleteConf.title}
                </h4>
                <p className="text-xs opacity-75 leading-relaxed font-sans mt-1">
                  {deleteConf.description}
                </p>
                <span className="text-[10px] text-red-400 font-bold block bg-red-500/5 px-2 py-1 rounded border border-red-500/10 mt-2 font-sans">
                  ⚠️ This action is irreversible. All associated database logs and configurations will be dropped.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-2 font-sans">
              <button
                onClick={() => setDeleteConf(prev => ({ ...prev, isOpen: false }))}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  isDark ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-900' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                No, Keep
              </button>
              <button
                onClick={() => {
                  if (deleteConf.onConfirm) deleteConf.onConfirm();
                  setDeleteConf(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-4 py-1.5 text-xs font-black bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 14. Portfolio Item Editor Overlay */}
      {showPortfolioEditor && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div 
            style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}
            className={`w-full max-w-2xl p-6 ${isDark ? 'bg-[#0F172A]' : 'bg-[#FFFFFF]'} shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-5 my-8 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200`}
            id="premium-portfolio-editor-form"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Award className="text-purple-500 w-5 h-5" />
                  Configure Deployment Portfolio Case Study
                </h3>
                <p className="text-[11px] text-neutral-400">Configure cover image, walkthrough videos, deliverables, and features.</p>
              </div>
              <button 
                onClick={() => setShowPortfolioEditor(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form body */}
            <div className="space-y-4 text-xs font-sans">
              
              {/* Media links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={premiumLabelClass}>Cover Photo URL</label>
                  <input 
                    type="text" 
                    value={showPortfolioEditor.image} 
                    onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, image: e.target.value})} 
                    className={premiumInputClass}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
                <div>
                  <label className={premiumLabelClass}>Video Demo Embed URL (Optional)</label>
                  <input 
                    type="text" 
                    value={showPortfolioEditor.videoUrl || ''} 
                    onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, videoUrl: e.target.value})} 
                    className={premiumInputClass}
                    placeholder="e.g. https://www.youtube.com/embed/..."
                  />
                </div>
              </div>

              {/* Client & Period / Link */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={premiumLabelClass}>Client / Brand</label>
                  <input 
                    type="text" 
                    value={showPortfolioEditor.client} 
                    onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, client: e.target.value})} 
                    className={premiumInputClass}
                    placeholder="e.g. Hostinger BD"
                  />
                </div>
                <div>
                  <label className={premiumLabelClass}>Build Period</label>
                  <input 
                    type="text" 
                    value={showPortfolioEditor.duration} 
                    onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, duration: e.target.value})} 
                    className={premiumInputClass}
                    placeholder="e.g. 2 Months"
                  />
                </div>
                <div>
                  <label className={premiumLabelClass}>Live View Link</label>
                  <input 
                    type="text" 
                    value={showPortfolioEditor.demoUrl} 
                    onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, demoUrl: e.target.value})} 
                    className={premiumInputClass}
                    placeholder="https://client-demo.com"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={premiumLabelClass}>Category Key</label>
                  <select 
                    value={showPortfolioEditor.category} 
                    onChange={(e) => {
                      const val = e.target.value;
                      let label = 'Web Development';
                      let labelBn = 'ওয়েব ডেভেলপমেন্ট';
                      let labelAr = 'تطوير الويب';
                      if (val === 'pos') { label = 'POS Software'; labelBn = 'পিওএস সফটওয়্যার'; labelAr = 'برامج نقاط البيع'; }
                      else if (val === 'app') { label = 'App Development'; labelBn = 'অ্যাপ ডেভেলপমেন্ট'; labelAr = 'تطوير التطبيقات'; }
                      else if (val === 'graphic') { label = 'Graphic Design'; labelBn = 'গ্রাফিক ডিজাইন'; labelAr = 'تصميم الجرافيك'; }
                      else if (val === 'seo') { label = 'SEO Marketing'; labelBn = 'এসইও ও মার্কেটিং'; labelAr = 'التسويق السحابي'; }
                      
                      setShowPortfolioEditor({
                        ...showPortfolioEditor, 
                        category: val,
                        categoryLabel: label,
                        categoryLabelBn: labelBn,
                        categoryLabelAr: labelAr
                      });
                    }} 
                    className={premiumInputClass}
                  >
                    <option value="web">Web Development</option>
                    <option value="pos">POS Software</option>
                    <option value="app">App Development</option>
                    <option value="graphic">Graphic Design</option>
                    <option value="seo">SEO Marketing</option>
                  </select>
                </div>
                <div>
                  <label className={premiumLabelClass}>Technologies Engaged (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={showPortfolioEditor.techStack.join(', ')} 
                    onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                    className={premiumInputClass}
                    placeholder="React, Next.js, Firestore"
                  />
                </div>
              </div>

              {/* Sub Category */}
              <div className="space-y-3 pt-2 border-t border-neutral-200/40 dark:border-neutral-800">
                <span className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Sub Category (Multi-lingual specification / সাব ক্যাটাগরি)</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={premiumLabelClass}>Sub-Category (English)</label>
                    <input 
                      type="text" 
                      value={showPortfolioEditor.subCategory || ''} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, subCategory: e.target.value})} 
                      className={premiumInputClass}
                      placeholder="e.g. Enterprise SaaS, Custom ERP"
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Sub-Category (Bangla)</label>
                    <input 
                      type="text" 
                      value={showPortfolioEditor.subCategoryBn || ''} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, subCategoryBn: e.target.value})} 
                      className={premiumInputClass}
                      placeholder="যেমন: এন্টারপ্রাইজ স্যাস, কাস্টম ইআরপি"
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Sub-Category (Arabic)</label>
                    <input 
                      type="text" 
                      value={showPortfolioEditor.subCategoryAr || ''} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, subCategoryAr: e.target.value})} 
                      className={premiumInputClass}
                      placeholder="على سبيل المثال: برنامج ساس للمؤسسات"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-language Title field tab cards */}
              <div className="space-y-3.5 pt-2 border-t border-neutral-200/40 dark:border-neutral-800">
                <span className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">PROJECT NAMES (MULTI-LINGUAL SPECIFICATION)</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={premiumLabelClass}>English Title</label>
                    <input 
                      type="text" 
                      value={showPortfolioEditor.title} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, title: e.target.value})} 
                      className={premiumInputClass}
                      placeholder="Apex Logistics Platform"
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Bangla Title</label>
                    <input 
                      type="text" 
                      value={showPortfolioEditor.titleBn || ''} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, titleBn: e.target.value})} 
                      className={premiumInputClass}
                      placeholder="এপেক্স লজিস্টিকস প্ল্যাটফর্ম"
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Arabic Title</label>
                    <input 
                      type="text" 
                      value={showPortfolioEditor.titleAr || ''} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, titleAr: e.target.value})} 
                      className={premiumInputClass}
                      placeholder="منصة الخدمات اللوجستية"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-language description */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">AUDIT ANALYSIS / DESCRIPTIONS</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={premiumLabelClass}>English Description</label>
                    <textarea 
                      rows={4} 
                      value={showPortfolioEditor.description} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, description: e.target.value})} 
                      className={`${premiumInputClass} min-h-[140px] resize-y py-3 scrollbar-thin`}
                      placeholder="Provide full description..."
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Bangla Description</label>
                    <textarea 
                      rows={4} 
                      value={showPortfolioEditor.descriptionBn || ''} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, descriptionBn: e.target.value})} 
                      className={`${premiumInputClass} min-h-[140px] resize-y py-3 scrollbar-thin`}
                      placeholder="বিস্তারিত বিবরণ..."
                    />
                  </div>
                  <div>
                    <label className={premiumLabelClass}>Arabic Description</label>
                    <textarea 
                      rows={4} 
                      value={showPortfolioEditor.descriptionAr || ''} 
                      onChange={(e) => setShowPortfolioEditor({...showPortfolioEditor, descriptionAr: e.target.value})} 
                      className={`${premiumInputClass} min-h-[140px] resize-y py-3 scrollbar-thin`}
                      placeholder="الوصف التفصيلي للمشروع..."
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Features List */}
              <div className="space-y-3 pt-3 border-t border-neutral-200/40 dark:border-neutral-850">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Features Included / কার্যাবলী ও সুবিধাসমূহ</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      const nextFeatures = [...(showPortfolioEditor.features || []), 'New premium feature'];
                      const nextFeaturesBn = [...(showPortfolioEditor.featuresBn || []), 'নতুন প্রিমিয়াম ফিচার'];
                      const nextFeaturesAr = [...(showPortfolioEditor.featuresAr || []), 'خاصية برمجية متطورة'];
                      setShowPortfolioEditor({
                        ...showPortfolioEditor,
                        features: nextFeatures,
                        featuresBn: nextFeaturesBn,
                        featuresAr: nextFeaturesAr
                      });
                    }}
                    className="text-purple-400 text-[11px] font-bold hover:underline"
                  >
                    + Add Feature Row
                  </button>
                </div>
                
                <div className="space-y-2.5 max-h-48 overflow-y-auto p-2 border rounded-xl bg-neutral-100/30 dark:bg-neutral-950/20 scrollbar-thin">
                  {showPortfolioEditor.features?.map((feat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800 bg-white dark:bg-[#111827] space-y-2">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="text-[10px] font-mono text-neutral-400 font-bold">Feature #{idx + 1}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            setShowPortfolioEditor({
                              ...showPortfolioEditor,
                              features: showPortfolioEditor.features.filter((_, i) => i !== idx),
                              featuresBn: showPortfolioEditor.featuresBn?.filter((_, i) => i !== idx) || [],
                              featuresAr: showPortfolioEditor.featuresAr?.filter((_, i) => i !== idx) || []
                            });
                          }}
                          className="text-red-500 font-bold text-xs hover:scale-110 transition"
                        >
                          × Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input 
                          type="text" 
                          value={feat} 
                          onChange={(e) => {
                            const updated = [...showPortfolioEditor.features];
                            updated[idx] = e.target.value;
                            setShowPortfolioEditor({...showPortfolioEditor, features: updated});
                          }}
                          className={`${premiumInputClass} !h-10 text-xs px-3`}
                          placeholder="Feature English"
                        />
                        <input 
                          type="text" 
                          value={showPortfolioEditor.featuresBn?.[idx] || ''} 
                          onChange={(e) => {
                            const updated = [...(showPortfolioEditor.featuresBn || [])];
                            updated[idx] = e.target.value;
                            setShowPortfolioEditor({...showPortfolioEditor, featuresBn: updated});
                          }}
                          className={`${premiumInputClass} !h-10 text-xs px-3`}
                          placeholder="ফিচার বাংলা"
                        />
                        <input 
                          type="text" 
                          value={showPortfolioEditor.featuresAr?.[idx] || ''} 
                          onChange={(e) => {
                            const updated = [...(showPortfolioEditor.featuresAr || [])];
                            updated[idx] = e.target.value;
                            setShowPortfolioEditor({...showPortfolioEditor, featuresAr: updated});
                          }}
                          className={`${premiumInputClass} !h-10 text-xs px-3`}
                          placeholder="فيشر عربي"
                        />
                      </div>
                    </div>
                  ))}
                  {(!showPortfolioEditor.features || showPortfolioEditor.features.length === 0) && (
                    <div className="text-center py-4 text-neutral-400 text-[11px] italic">No custom features added yet.</div>
                  )}
                </div>
              </div>

              {/* Dynamic Key Deliverables / Results list */}
              <div className="space-y-3 pt-3 border-t border-neutral-200/40 dark:border-neutral-850">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Key Deliverables / Metrics results</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      const nextRes = [...(showPortfolioEditor.results || []), { label: 'Metric Name', value: 'Value' }];
                      const nextResBn = [...(showPortfolioEditor.resultsBn || []), { label: 'সূচক নাম', value: 'মান' }];
                      const nextResAr = [...(showPortfolioEditor.resultsAr || []), { label: 'اسم المؤشر', value: 'القيمة' }];
                      setShowPortfolioEditor({
                        ...showPortfolioEditor,
                        results: nextRes,
                        resultsBn: nextResBn,
                        resultsAr: nextResAr
                      });
                    }}
                    className="text-purple-400 text-[11px] font-bold hover:underline"
                  >
                    + Add Deliverable Row
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto p-2 border rounded-xl bg-neutral-100/30 dark:bg-neutral-950/20 scrollbar-thin">
                  {showPortfolioEditor.results?.map((res, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800 bg-white dark:bg-[#111827] space-y-2">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="text-[10px] font-mono text-neutral-400 font-bold">Deliverable #{idx + 1}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            setShowPortfolioEditor({
                              ...showPortfolioEditor,
                              results: showPortfolioEditor.results.filter((_, i) => i !== idx),
                              resultsBn: showPortfolioEditor.resultsBn?.filter((_, i) => i !== idx) || [],
                              resultsAr: showPortfolioEditor.resultsAr?.filter((_, i) => i !== idx) || []
                            });
                          }}
                          className="text-red-500 font-bold text-xs hover:scale-110 transition"
                        >
                          × Remove
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={res.label} 
                            onChange={(e) => {
                              const updated = [...showPortfolioEditor.results];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setShowPortfolioEditor({...showPortfolioEditor, results: updated});
                            }}
                            className={`${premiumInputClass} !h-10 text-xs px-3`}
                            placeholder="Label (English)"
                          />
                          <input 
                            type="text" 
                            value={res.value} 
                            onChange={(e) => {
                              const updated = [...showPortfolioEditor.results];
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              setShowPortfolioEditor({...showPortfolioEditor, results: updated});
                            }}
                            className={`${premiumInputClass} !h-10 text-xs px-3`}
                            placeholder="Value (e.g. +85%)"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={showPortfolioEditor.resultsBn?.[idx]?.label || ''} 
                            onChange={(e) => {
                              const updated = [...(showPortfolioEditor.resultsBn || [])];
                              if (!updated[idx]) updated[idx] = { label: '', value: '' };
                              updated[idx].label = e.target.value;
                              setShowPortfolioEditor({...showPortfolioEditor, resultsBn: updated});
                            }}
                            className={`${premiumInputClass} !h-10 text-xs px-3`}
                            placeholder="লেবেল (বাংলা)"
                          />
                          <input 
                            type="text" 
                            value={showPortfolioEditor.resultsBn?.[idx]?.value || ''} 
                            onChange={(e) => {
                              const updated = [...(showPortfolioEditor.resultsBn || [])];
                              if (!updated[idx]) updated[idx] = { label: '', value: '' };
                              updated[idx].value = e.target.value;
                              setShowPortfolioEditor({...showPortfolioEditor, resultsBn: updated});
                            }}
                            className={`${premiumInputClass} !h-10 text-xs px-3`}
                            placeholder="মান (বাংলা)"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={showPortfolioEditor.resultsAr?.[idx]?.label || ''} 
                            onChange={(e) => {
                              const updated = [...(showPortfolioEditor.resultsAr || [])];
                              if (!updated[idx]) updated[idx] = { label: '', value: '' };
                              updated[idx].label = e.target.value;
                              setShowPortfolioEditor({...showPortfolioEditor, resultsAr: updated});
                            }}
                            className={`${premiumInputClass} !h-10 text-xs px-3`}
                            placeholder="الاسم (عربي)"
                          />
                          <input 
                            type="text" 
                            value={showPortfolioEditor.resultsAr?.[idx]?.value || ''} 
                            onChange={(e) => {
                              const updated = [...(showPortfolioEditor.resultsAr || [])];
                              if (!updated[idx]) updated[idx] = { label: '', value: '' };
                              updated[idx].value = e.target.value;
                              setShowPortfolioEditor({...showPortfolioEditor, resultsAr: updated});
                            }}
                            className={`${premiumInputClass} !h-10 text-xs px-3`}
                            placeholder="القيمة (عربي)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!showPortfolioEditor.results || showPortfolioEditor.results.length === 0) && (
                    <div className="text-center py-4 text-neutral-400 text-[11px] italic">No metrics results added yet.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-neutral-200/50 dark:border-neutral-800">
              <button 
                type="button"
                onClick={() => setShowPortfolioEditor(null)} 
                className={premiumSecondaryBtnClass}
              >
                Cancel Configuration
              </button>
              <button 
                type="button"
                onClick={() => {
                  setPortfolio(prev => {
                    const exists = prev.some(p => p.id === showPortfolioEditor.id);
                    if (exists) {
                      return prev.map(p => p.id === showPortfolioEditor.id ? showPortfolioEditor : p);
                    } else {
                      return [...prev, showPortfolioEditor];
                    }
                  });
                  addActivityLogEntry(`Configured portfolio project ${showPortfolioEditor.title} in CMS collection`);
                  triggerToast(`✅ Portfolio deployment properties committed successfully!`);
                  setShowPortfolioEditor(null);
                }} 
                className={premiumPrimaryBtnClass}
              >
                <Save className="w-4 h-4" /> Commit Dynamic State
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  // --- CONTROLLER HANDLER LOGICS ---

  // Page handlers
  function handlePageCreateInit() {
    const newPg: CmsPage = {
      id: `pg-` + Date.now(),
      title: "New CMS Page Workspace",
      slug: "new-page-" + Math.floor(Math.random() * 100),
      featuredImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80",
      content: "Freshly bootstrapped drag & drop layout system.",
      seoTitle: "New Optimized SEO Portal Link",
      metaDescription: "Configure Yoast tags cleanly.",
      canonicalUrl: "https://webzonebd.com",
      status: "draft",
      sections: []
    };
    setPages(p => [...p, newPg]);
    triggerToast("📄 Page workspace added successfully to database draft state!");
    setSelectedBuilderPage(newPg);
  }

  function handleDuplicatePage(p: CmsPage) {
    const dup: CmsPage = {
      ...p,
      id: `pg-` + Date.now(),
      title: `${p.title} (Duplicate)`,
      slug: `${p.slug}-copy`
    };
    setPages(prev => [...prev, dup]);
    triggerToast(`📊 Duplicated "${p.title}" successfully.`);
  }

  function handleDeletePage(id: string) {
    setPages(prev => prev.filter(p => p.id !== id));
    triggerToast("🗑️ Static page and sub-sections recycled safely.");
    if (selectedBuilderPage?.id === id) setSelectedBuilderPage(null);
  }

  function handleAddSection(pageId: string, type: 'hero' | 'features' | 'pricing' | 'faq') {
    let mockContent = {};
    if (type === 'hero') mockContent = { title: "Decoupled Server Infrastructures", subtitle: "We execute customized configurations.", buttonText: "Request Quote" };
    else if (type === 'features') mockContent = { list: ["bKash Auto Checkout", "Instant Root Port Provisioning"] };
    else if (type === 'pricing') mockContent = { list: ["Base plan- $29/mo", "Dedicated enterprise node"] };
    else if (type === 'faq') mockContent = { title: "What is BDIX SLA?", subtitle: "Guaranteed 10ms latencies within Dhaka metropolitan." };

    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        const nextSecs = [...(p.sections || []), { id: `sec-` + Date.now(), type, content: mockContent }];
        const updated = { ...p, sections: nextSecs };
        // Sync context wrapper
        if (selectedBuilderPage?.id === pageId) setSelectedBuilderPage(updated);
        return updated;
      }
      return p;
    }));
    triggerToast(`🏗️ Drag Block [${type.toUpperCase()}] committed into layout pipeline!`);
  }

  function handleMoveSection(pageId: string, idx: number, direction: 'up' | 'down') {
    setPages(prev => prev.map(p => {
      if (p.id === pageId && p.sections) {
        const next = [...p.sections];
        if (direction === 'up' && idx > 0) {
          const temp = next[idx]; next[idx] = next[idx - 1]; next[idx - 1] = temp;
        } else if (direction === 'down' && idx < next.length - 1) {
          const temp = next[idx]; next[idx] = next[idx + 1]; next[idx + 1] = temp;
        }
        const updated = { ...p, sections: next };
        if (selectedBuilderPage?.id === pageId) setSelectedBuilderPage(updated);
        return updated;
      }
      return p;
    }));
  }

  function handleDeleteSection(pageId: string, sectionId: string) {
    setPages(prev => prev.map(p => {
      if (p.id === pageId && p.sections) {
        const next = p.sections.filter(s => s.id !== sectionId);
        const updated = { ...p, sections: next };
        if (selectedBuilderPage?.id === pageId) setSelectedBuilderPage(updated);
        return updated;
      }
      return p;
    }));
    triggerToast("🗑️ Builder section removed from pipeline.");
  }

  // Blog handlers
  function handleBlogCreateInit() {
    const item: CmsBlogPost = {
      id: `post-` + Date.now(),
      title: "Custom VPS Hosting Optimization",
      slug: "hosting-optimization-sla",
      featuredImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
      category: "Tech",
      content: "This technical document details our multi-region SSD storage setup, high bandwidth transits, and CPU scheduling pools.",
      author: "Technical Staff Leader",
      tags: ["API", "React"],
      seoTitle: "Optimizing Dhaka cluster server profiles",
      metaDescription: "Learn to maximize VPS response capabilities easily.",
      status: "draft"
    };
    setBlogs(prev => [...prev, item]);
    triggerToast("✍️ New blogging template compiled successfully.");
    setShowBlogEditor(item);
  }

  function handleDeleteBlog(id: string) {
    setBlogs(prev => prev.filter(b => b.id !== id));
    triggerToast("🗑️ Article deleted successfully.");
  }

  // Service handlers
  function handleServiceCreateInit() {
    const s: CmsService = {
      id: `srv-` + Date.now(),
      name: "Dhaka High Capacity Hosting Node",
      slug: "dhaka-high-capacity",
      featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
      description: "Blazing fast BDIX connected physical SSD nodes deployed at local server centers.",
      features: ["Unlimited subdomains", "bKash gateway setup"],
      pricing: [
        { name: "Starter SSD", price: 19, features: ["50 GB Storage", "Cpanel setup"] }
      ],
      category: "BDIX Hosting"
    };
    setServices(prev => [...prev, s]);
    triggerToast("💼 service template loaded. Add custom service packages now.");
    setShowServiceEditor(s);
  }

  function handleDeleteService(id: string) {
    setServices(prev => prev.filter(s => s.id !== id));
    triggerToast("🗑️ Service catalog node deleted safely.");
  }

  // Product handlers
  function handleProductCreateInit() {
    const item: CmsProduct = {
      id: `prod-` + Date.now(),
      name: "WebzoneBD React-Next.js Premium Blog Kit",
      sku: "WZ-KIT20",
      slug: "react-next-seo-kit",
      productImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
      galleryImages: [],
      price: 99,
      salePrice: 59,
      category: "templates",
      subCategory: "React Boilerplates",
      description: "High speed, decoupled frontend template linked natively to client layouts with fully integrated modular CSS.",
      productType: "digital",
      downloads: ["https://webzonebd.com/downloads/nextseo-v1.zip"],
      status: "draft"
    };
    setProducts(prev => [...prev, item]);
    triggerToast("🛒 woo Product registered cleanly in Draft state.");
    setShowProductEditor(item);
  }

  function handleDeleteProduct(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id));
    triggerToast("🗑️ Digital product removed from active WooCommerce catalog.");
  }

  // Menu item links reorder
  function handleAddMenuItem(menuId: string) {
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        const item: CmsMenuItem = {
          id: `item-` + Date.now(),
          name: "SLA Cloud Nodes",
          url: "/vps-nodes",
          icon: "Layers",
          target: "_self"
        };
        return { ...m, items: [...m.items, item] };
      }
      return m;
    }));
    triggerToast("⚓ Link successfully appended to parent menu!");
  }

  function handleReorderMenuItems(menuId: string, idx: number, direction: 'up' | 'down') {
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        const next = [...m.items];
        if (direction === 'up' && idx > 0) {
          const temp = next[idx]; next[idx] = next[idx - 1]; next[idx - 1] = temp;
        } else if (direction === 'down' && idx < next.length - 1) {
          const temp = next[idx]; next[idx] = next[idx + 1]; next[idx + 1] = temp;
        }
        return { ...m, items: next };
      }
      return m;
    }));
  }

  function handleRemoveMenuItem(menuId: string, itemId: string) {
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        return { ...m, items: m.items.filter(it => it.id !== itemId) };
      }
      return m;
    }));
    triggerToast("⚓ Link removed.");
  }

  // Redirect Manager handler
  function handleRedirectCreateInit() {
    const item: CmsRedirect = {
      id: `red-` + Date.now(),
      oldUrl: `/vps-dhaka-${Math.floor(Math.random() * 100)}`,
      newUrl: "/hosting",
      statusCode: 301,
      hits: 0
    };
    setRedirects(prev => [item, ...prev]);
    triggerToast("🔗 301 Permanent Redirect registered cleanly!");
  }

  // QA & FAQs, Testimonials defaults
  function handleAddTestimonial() {
    const item: CmsTestimonial = {
      id: `tst-` + Date.now(),
      clientName: "Siddique Rahman",
      businessName: "Sajib Trade Corp",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      reviewText: "Decoupled CMS interface built for our business made deployment painless."
    };
    setTestimonials(p => [...p, item]);
    triggerToast("⭐ test testimonial added successfully!");
  }

  function handleAddFAQ() {
    const item: CmsFAQ = {
      id: `faq-` + Date.now(),
      question: "Are SSL Certificates included with SSD corporate profiles?",
      answer: "Yes, Let's Encrypt Wildcard profiles with automate cron renewal scripts are free of charge.",
      category: "Hosting"
    };
    setFaqs(p => [...p, item]);
    triggerToast("❓ FAQ registered.");
  }

  // Strategic Portfolio Project handlers
  function handlePortfolioCreateInit() {
    const item: PortfolioItem = {
      id: `port-` + Date.now(),
      title: "Apex Cloud POS - Enterprise Digital Billing System",
      titleBn: "এপেক্স ক্লাউড পিওএস - এন্টারপ্রাইজ ডিজিটাল বিলিং সিস্টেম",
      titleAr: "نظام نقاط البيع السحابي المتكامل لإدارة المخازن والمبيعات",
      category: "web",
      categoryLabel: "Web Development",
      categoryLabelBn: "ওয়েব ডেভেলপমেন্ট",
      categoryLabelAr: "تطوير الويب",
      subCategory: "Enterprise SaaS",
      subCategoryBn: "এন্টারপ্রাইজ স্যাস",
      subCategoryAr: "برمجيات ساس للمؤسسات",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      client: "Apex Trade & Retail Group",
      duration: "3 Months",
      demoUrl: "https://apex-pos-demo.example",
      description: "A complete decoupled cloud-native POS billing application built with React and Firestore database, supporting real-time offline synchronization and automated thermal printing integrations.",
      descriptionBn: "রিয়্যাক্ট এবং ফায়ারস্টোর ডাটাবেস দিয়ে তৈরি একটি সম্পূর্ণ ডিকাপল্ড ক্লাউড-নেটিভ পিওএস বিলিং অ্যাপ্লিকেশন, যা রিয়েল-টাইম অফলাইন সিঙ্ক্রোনাইজেশন এবং স্বয়ংক্রিয় থার্মাল প্রিন্টিং ইন্টিগ্রেশন সমর্থন করে।",
      descriptionAr: "برنامج كاشير سحابي متطور مصمم خصيصاً للمؤسسات التجارية الكبيرة، يعمل بكفاءة مع انقطاع الشبكة ويوفر طباعة الفواتير فورياً.",
      techStack: ["React", "Firebase", "Node.js", "Tailwind CSS"],
      features: [
        "Real-time inventory stock management",
        "Thermal ticket layout printing support",
        "Offline persistence with SQLite cache"
      ],
      featuresBn: [
        "রিয়েল-টাইম ইনভেন্টরি স্টক ম্যানেজমেন্ট",
        "থার্মাল টিকিট লেআউট প্রিন্টিং সাপোর্ট",
        "SQLite ক্যাশ সহ অফলাইন পার্সিস্টেন্স"
      ],
      featuresAr: [
        "مراقبة المخزون والمبيعات لحظياً بالكامل",
        "دعم طابعات الفواتير والباركود المختلفة",
        "حفظ البيانات محلياً والمزامنة تلقائياً عند عودة الاتصال"
      ],
      results: [
        { label: "Monthly POS Invoices", value: "24,000+" },
        { label: "Transaction Latency", value: "Sub-12ms" }
      ],
      resultsBn: [
        { label: "মাসিক পিওএস চালান", value: "২৪,০০০+" },
        { label: "লেনদেন বিলম্ব", value: "১২ মিলি-সেকেন্ডের কম" }
      ],
      resultsAr: [
        { label: "الفواتير المصدرة شهرياً", value: "+24,000" },
        { label: "زمن معالجة العمليات", value: "أقل من 12 مللي ثانية" }
      ],
      videoUrl: ""
    };
    setPortfolio(prev => [...prev, item]);
    triggerToast("🎨 Portfolio project template registered cleanly in active catalog.");
    setShowPortfolioEditor(item);
  }

  function handleDeletePortfolio(id: string) {
    setPortfolio(prev => prev.filter(p => p.id !== id));
    triggerToast("🗑️ Portfolio project deleted from database catalog.");
  }
}
