import React, { useState } from 'react';
import { 
  Settings, ShoppingBag, Plus, Tag, Ticket, Database,
  TrendingUp, BarChart, ShieldAlert, Check, X, Trash2, 
  Layers, Upload, Terminal, Save, Key, LayoutGrid, Sparkles, BookOpen
} from 'lucide-react';
import { Product, Order, SupportTicket, SystemConfig, Coupon, Language, Theme, Currency } from '../types';
import { BLOG_CATEGORIES, BLOG_TAGS, LocalBlogPost } from './BlogData';

interface AdminPanelProps {
  language: Language;
  theme: Theme;
  products: Product[];
  orders: Order[];
  tickets: SupportTicket[];
  systemConfig: SystemConfig;
  coupons: Coupon[];
  addNewProduct: (prod: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: 'completed' | 'failed') => void;
  addTicketReply: (ticketId: string, message: string, sender: 'user' | 'admin') => void;
  addNewCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  updateSystemConfig: (cfg: SystemConfig) => void;
  triggerToast: (msg: string) => void;
  currency?: Currency;
  setCurrency?: (c: Currency) => void;
  currencySettings?: any;
  setCurrencySettings?: (settings: any) => void;
  posts: LocalBlogPost[];
  setPosts: React.Dispatch<React.SetStateAction<LocalBlogPost[]>>;
}

export default function AdminPanel({
  language,
  theme,
  products,
  orders,
  tickets,
  systemConfig,
  coupons,
  addNewProduct,
  deleteProduct,
  updateOrderStatus,
  addTicketReply,
  addNewCoupon,
  deleteCoupon,
  updateSystemConfig,
  triggerToast,
  currency,
  setCurrency,
  currencySettings,
  setCurrencySettings,
  posts,
  setPosts
}: AdminPanelProps) {
  const [activeMenu, setActiveMenu] = useState<'analytics' | 'products' | 'orders' | 'tickets' | 'coupons' | 'settings' | 'currency' | 'blog' | 'affiliates' | 'security'>('analytics');

  // WhatsApp OTP Security Shield Dashboard States
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [blockedNumbers, setBlockedNumbers] = useState<any[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<any[]>([]);
  const [newBlockPhone, setNewBlockPhone] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('Manual Administrative Isolation Quarantine');
  const [securityConfig, setSecurityConfig] = useState(() => {
    try {
      const stored = localStorage.getItem('webzonebd_security_config');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      maxAttempts: 5,
      cooldownSeconds: 30,
      quarantineMinutes: 10,
      bypassMode: false
    };
  });

  // Sync state with localstorage
  const syncSecurityLocalStorage = () => {
    try {
      setSecurityLogs(JSON.parse(localStorage.getItem('webzonebd_security_otp_logs') || '[]'));
      setBlockedNumbers(JSON.parse(localStorage.getItem('webzonebd_blocked_numbers') || '[]'));
      setFailedAttempts(JSON.parse(localStorage.getItem('webzonebd_failed_attempts') || '[]'));
    } catch (e) {
      console.error(e);
    }
  };

  // Run on mount or active menu shift
  React.useEffect(() => {
    if (activeMenu === 'security') {
      syncSecurityLocalStorage();
    }
  }, [activeMenu]);

  // Blog Post Editor/Creator Form State
  const [editingPost, setEditingPost] = useState<LocalBlogPost | null>(null);
  const [adminPostTitle, setAdminPostTitle] = useState('');
  const [adminPostTitleBn, setAdminPostTitleBn] = useState('');
  const [adminPostTitleAr, setAdminPostTitleAr] = useState('');
  const [adminPostSummary, setAdminPostSummary] = useState('');
  const [adminPostSummaryBn, setAdminPostSummaryBn] = useState('');
  const [adminPostSummaryAr, setAdminPostSummaryAr] = useState('');
  const [adminPostContent, setAdminPostContent] = useState('');
  const [adminPostContentBn, setAdminPostContentBn] = useState('');
  const [adminPostContentAr, setAdminPostContentAr] = useState('');
  const [adminPostCategory, setAdminPostCategory] = useState('Web Development');
  const [adminPostAuthor, setAdminPostAuthor] = useState('Senior DevOps Specialist');
  const [adminPostReadTime, setAdminPostReadTime] = useState('6 min read');
  const [adminPostImage, setAdminPostImage] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80');
  const [adminPostDraft, setAdminPostDraft] = useState(false);
  const [adminPostFeatured, setAdminPostFeatured] = useState(false);
  const [adminPostTrending, setAdminPostTrending] = useState(false);
  const [adminPostEditorsChoice, setAdminPostEditorsChoice] = useState(false);
  const [adminPostTags, setAdminPostTags] = useState<string[]>([]);
  const [adminSeoTitle, setAdminSeoTitle] = useState('');
  const [adminSeoDesc, setAdminSeoDesc] = useState('');

  // Tag toggler for Admin Form
  const handleToggleFormTag = (tag: string) => {
    setAdminPostTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleInitiateCreate = () => {
    setEditingPost(null);
    setAdminPostTitle('');
    setAdminPostTitleBn('');
    setAdminPostTitleAr('');
    setAdminPostSummary('');
    setAdminPostSummaryBn('');
    setAdminPostSummaryAr('');
    setAdminPostContent('');
    setAdminPostContentBn('');
    setAdminPostContentAr('');
    setAdminPostCategory('Web Development');
    setAdminPostAuthor('Senior DevOps Specialist');
    setAdminPostReadTime('6 min read');
    setAdminPostImage('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80');
    setAdminPostDraft(false);
    setAdminPostFeatured(false);
    setAdminPostTrending(false);
    setAdminPostEditorsChoice(false);
    setAdminPostTags([]);
    setAdminSeoTitle('');
    setAdminSeoDesc('');
    triggerToast("Publisher form reset for a brand new publication entry!");
  };

  const handleInitiateEdit = (post: LocalBlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
    setAdminPostTitle(post.title || '');
    setAdminPostTitleBn(post.titleBn || '');
    setAdminPostTitleAr(post.titleAr || '');
    setAdminPostSummary(post.summary || '');
    setAdminPostSummaryBn(post.summaryBn || '');
    setAdminPostSummaryAr(post.summaryAr || '');
    setAdminPostContent(post.content || '');
    setAdminPostContentBn(post.contentBn || '');
    setAdminPostContentAr(post.contentAr || '');
    setAdminPostCategory(post.category || 'Web Development');
    setAdminPostAuthor(post.author || 'Senior DevOps Specialist');
    setAdminPostReadTime(post.readTime || '6 min read');
    setAdminPostImage(post.image || '');
    setAdminPostDraft(!!post.isDraft);
    setAdminPostFeatured(!!post.isFeatured);
    setAdminPostTrending(!!post.isTrending);
    setAdminPostEditorsChoice(!!post.isEditorsChoice);
    setAdminPostTags(post.tags || []);
    setAdminSeoTitle(post.seoTitle || '');
    setAdminSeoDesc(post.seoMetaDesc || '');
    triggerToast(`Loaded post data into publisher workspace: ${post.title}`);
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you absolutely sure you want to permanently delete this digital resource blog? This is irreversible!")) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      triggerToast("Resource publication deleted successfully from database!");
    }
  };

  const handleSaveAdminForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPostTitle || !adminPostSummary || !adminPostContent) {
      triggerToast("Failed validation: Required fields are incomplete!");
      return;
    }

    const matchedCategory = BLOG_CATEGORIES.find(c => c.label === adminPostCategory) || BLOG_CATEGORIES[1];

    if (editingPost) {
      // Edit mode
      setPosts(prev => prev.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            title: adminPostTitle,
            titleBn: adminPostTitleBn || adminPostTitle,
            titleAr: adminPostTitleAr || adminPostTitle,
            summary: adminPostSummary,
            summaryBn: adminPostSummaryBn || adminPostSummary,
            summaryAr: adminPostSummaryAr || adminPostSummary,
            content: adminPostContent,
            contentBn: adminPostContentBn || adminPostContent,
            contentAr: adminPostContentAr || adminPostContent,
            category: adminPostCategory,
            categoryBn: matchedCategory.bn,
            categoryAr: matchedCategory.ar,
            author: adminPostAuthor,
            readTime: adminPostReadTime,
            image: adminPostImage,
            isDraft: adminPostDraft,
            isFeatured: adminPostFeatured,
            isTrending: adminPostTrending,
            isEditorsChoice: adminPostEditorsChoice,
            tags: adminPostTags,
            seoTitle: adminSeoTitle,
            seoMetaDesc: adminSeoDesc
          };
        }
        return p;
      }));
      triggerToast(`Successfully modified core publication draft config!`);
    } else {
      // Create mode
      const newPost: LocalBlogPost = {
        id: `blog-` + Date.now(),
        title: adminPostTitle,
        titleBn: adminPostTitleBn || adminPostTitle,
        titleAr: adminPostTitleAr || adminPostTitle,
        summary: adminPostSummary,
        summaryBn: adminPostSummaryBn || adminPostSummary,
        summaryAr: adminPostSummaryAr || adminPostSummary,
        content: adminPostContent,
        contentBn: adminPostContentBn || adminPostContent,
        contentAr: adminPostContentAr || adminPostContent,
        category: adminPostCategory,
        categoryBn: matchedCategory.bn,
        categoryAr: matchedCategory.ar,
        author: adminPostAuthor,
        readTime: adminPostReadTime,
        image: adminPostImage,
        isDraft: adminPostDraft,
        isFeatured: adminPostFeatured,
        isTrending: adminPostTrending,
        isEditorsChoice: adminPostEditorsChoice,
        tags: adminPostTags,
        seoTitle: adminSeoTitle,
        seoMetaDesc: adminSeoDesc,
        views: 200,
        likes: 120,
        date: "May 2026",
        outline: [
          { id: "s-1", text: "Introduction Guide", textBn: "পরিচিতি নির্দেশিকা", textAr: "تمهيد الإرشاد" }
        ]
      };
      setPosts(prev => [newPost, ...prev]);
      triggerToast(`Successfully created and published a new live article resources!`);
    }

    // Reset Form
    handleInitiateCreate();
  };

  // Product Creator Form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(25);
  const [newProdCategory, setNewProdCategory] = useState<'php' | 'wordpress' | 'blogger' | 'laravel' | 'mobile' | 'source'>('php');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdFeature, setNewProdFeature] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80');

  // Coupon Form state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);

  // System Config states
  const [configSiteName, setConfigSiteName] = useState(systemConfig.siteName);
  const [configSiteTitle, setConfigSiteTitle] = useState(systemConfig.siteTitle);
  const [configMetaDesc, setConfigMetaDesc] = useState(systemConfig.metaDesc);
  const [configWhatsApp, setConfigWhatsApp] = useState(systemConfig.whatsappNumber);
  const [configContact, setConfigContact] = useState(systemConfig.bangladeshContact);
  const [configGaId, setConfigGaId] = useState(systemConfig.googleAnalyticsId);

  // Admin reply chat helpers
  const [activeAdminChatTicketId, setActiveAdminChatTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // SVG Chart calculation helper data
  const chartSales = [120, 240, 180, 320, 480, 410, 590]; // mock sales points
  const points = chartSales.map((val, idx) => `${idx * 80 + 30},${240 - val * 0.3}`).join(' ');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc) {
      triggerToast("Kindly input a valid asset title and description.");
      return;
    }

    const createdProduct: Product = {
      id: "prod-" + Date.now(),
      name: newProdName,
      nameBn: newProdName,
      nameAr: newProdName,
      category: newProdCategory,
      price: newProdPrice,
      rating: 5.0,
      reviewsCount: 1,
      description: newProdDesc,
      descriptionBn: newProdDesc,
      descriptionAr: newProdDesc,
      features: [newProdFeature || "Fully cPanel integration ready codes"],
      featuresBn: [newProdFeature || "সহজ ইনস্টলেশন সুবিধা"],
      featuresAr: [newProdFeature || "كود آمن تماماً وجاهز للمزامنة"],
      image: newProdImage,
      demoUrl: "https://demo.webzonebd.com",
      downloadUrl: "https://webzonebd.com/downloads/new-product.zip",
      tags: [newProdCategory, "New Release"],
      views: 12
    };

    addNewProduct(createdProduct);
    triggerToast("✨ Product script successfully injected into Marketplace catalog!");
    
    // reset
    setNewProdName('');
    setNewProdDesc('');
    setNewProdFeature('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const newCp: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponPercent,
      expiryDate: "2026-12-31"
    };

    addNewCoupon(newCp);
    triggerToast(`🎟️ Coupon ${newCp.code} is now verified and fully active!`);
    setNewCouponCode('');
  };

  const handleSaveConfig = () => {
    const updatedCfg: SystemConfig = {
      siteName: configSiteName,
      siteTitle: configSiteTitle,
      metaDesc: configMetaDesc,
      googleAnalyticsId: configGaId,
      whatsappNumber: configWhatsApp,
      bangladeshContact: configContact,
      supportEmail: systemConfig.supportEmail,
      autoApproveTickets: systemConfig.autoApproveTickets
    };

    updateSystemConfig(updatedCfg);
    triggerToast("💾 Global system meta configurations persisted successfully!");
  };

  const handleAdminTicketReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdminChatTicketId || !adminReplyText) return;

    addTicketReply(activeAdminChatTicketId, adminReplyText, 'admin');
    triggerToast("Reply message delivered to user board.");
    setAdminReplyText('');
  };

  const openTicket = tickets.find(t => t.id === activeAdminChatTicketId);

  // States for Currency Settings Panel
  const [bdtRate, setBdtRate] = useState(currencySettings?.rates?.BDT ?? 118.5);
  const [sarRate, setSarRate] = useState(currencySettings?.rates?.SAR ?? 3.75);
  const [defaultCurSel, setDefaultCurSel] = useState<Currency>(currencySettings?.defaultCurrency ?? 'USD');
  const [usdEnabled, setUsdEnabled] = useState(currencySettings?.enabled?.USD ?? true);
  const [bdtEnabled, setBdtEnabled] = useState(currencySettings?.enabled?.BDT ?? true);
  const [sarEnabled, setSarEnabled] = useState(currencySettings?.enabled?.SAR ?? true);
  const [simulatedCountry, setSimulatedCountry] = useState(currencySettings?.simulatedCountry ?? 'auto');

  // Affiliate custom management states
  const [cookieDuration, setCookieDuration] = useState('30');
  const [commHosting, setCommHosting] = useState(20);
  const [commWebDev, setCommWebDev] = useState(15);
  const [commMarketing, setCommMarketing] = useState(15);
  const [commSeo, setCommSeo] = useState(15);
  const [commPos, setCommPos] = useState(20);
  const [commMarketplace, setCommMarketplace] = useState(10);
  
  // Local list of mock pending affiliate applications
  const [affiliatesList, setAffiliatesList] = useState([
    { id: 'aff-1', name: 'Saiful Islam', username: 'saiful_dev', email: 'saiful@webzonebd.com', phone: '+8801712345678', country: 'Bangladesh', paymentMethod: 'bKash', status: 'pending', tier: 'Starter' },
    { id: 'aff-2', name: 'Fahad Al-Qahtani', username: 'fahad_sa', email: 'fahad@riyadhbiz.com', phone: '+966501234567', country: 'Saudi Arabia', paymentMethod: 'Bank Transfer', status: 'pending', tier: 'Starter' },
    { id: 'aff-3', name: 'Zeeshan Malik', username: 'zee_marketing', email: 'zeeshan@malikseo.com', phone: '+8801911223344', country: 'Bangladesh', paymentMethod: 'Nagad', status: 'approved', tier: 'Gold Affiliate' }
  ]);

  // Withdrawal queue requests
  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 'wd-1', name: 'Zeeshan Malik', amount: '1200 BDT', gateway: 'Nagad', wallet: '+8801911223344', date: '2026-05-30', status: 'pending' },
    { id: 'wd-2', name: 'Fahad Al-Qahtani', amount: '150 SAR', gateway: 'Bank Transfer', wallet: 'SA9380000001234567890123', date: '2026-05-28', status: 'settled' }
  ]);

  const handleSaveCurrencySettings = () => {
    if (setCurrencySettings) {
      setCurrencySettings({
        rates: {
          USD: 1.0,
          BDT: Number(bdtRate) || 118.5,
          SAR: Number(sarRate) || 3.75
        },
        enabled: {
          USD: true, // Always force USD active
          BDT: bdtEnabled,
          SAR: sarEnabled
        },
        defaultCurrency: defaultCurSel,
        simulatedCountry: simulatedCountry,
        detectedCountryName: currencySettings?.detectedCountryName ?? 'Unknown'
      });
      triggerToast("🚀 Custom currency rates, fallbacks, and activation filters saved!");
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="admin-panel-container">
      {/* Upper security alert board */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center justify-between mb-8 text-neutral-800 dark:text-neutral-200" id="admin-credentials-reminder">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold uppercase text-yellow-600 dark:text-yellow-400 block mb-0.5">Authorized Developer Session</span>
            <p>Admin Mode is <strong>active</strong>. Use standard seed details: Username: <strong>admin@webzonebd.com</strong> • Password: <strong>admin123</strong>.</p>
          </div>
        </div>

        <span className="text-[10px] font-mono select-all bg-yellow-500/20 px-2 py-1 rounded font-bold">SQL_SECURE_BYPASS=TRUE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Drawer Menu */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl h-fit space-y-2">
          <h3 className="text-xs font-mono font-extrabold uppercase text-neutral-400 px-3 pb-2 border-b border-neutral-150 dark:border-neutral-850">
            Navigation Console
          </h3>

          {[
            { id: 'analytics', label: "Analytics Overviews", icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'security', label: "WhatsApp Security Shield", icon: <Key className="w-4 h-4 text-emerald-500 animate-pulse" /> },
            { id: 'products', label: "Manage Scripts", icon: <LayoutGrid className="w-4 h-4" /> },
            { id: 'orders', label: "Sales & Orders", icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'tickets', label: "Client Support Chats", icon: <Ticket className="w-4 h-4" /> },
            { id: 'coupons', label: "Discount Code Manager", icon: <Tag className="w-4 h-4" /> },
            { id: 'currency', label: "Currency Config Panel", icon: <Database className="w-4 h-4 text-emerald-500 animate-pulse" /> },
            { id: 'blog', label: "Publisher Studio Controls", icon: <BookOpen className="w-4 h-4 text-pink-500" /> },
            { id: 'affiliates', label: "Affiliate & Partner Hub", icon: <Sparkles className="w-4 h-4 text-pink-500" /> },
            { id: 'settings', label: "SEO & System Config", icon: <Settings className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                activeMenu === item.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Dashboard Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeMenu === 'analytics' && (
            <div className="space-y-6" id="panel-analytics">
              {/* Dynamic Metrics Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-950/40 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 font-bold uppercase">Today Revenues</p>
                  <p className="text-2xl font-black font-mono mt-1 text-emerald-500">${orders.reduce((sum, ord) => sum + ord.price, 0)}</p>
                  <span className="text-[9px] text-neutral-400 font-mono">Simulated Billing</span>
                </div>

                <div className="bg-white dark:bg-neutral-950/40 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 font-bold uppercase font-sans">Delivered Assets</p>
                  <p className="text-2xl font-black font-mono mt-1 text-neutral-900 dark:text-neutral-50">{products.length}</p>
                  <span className="text-[9px] text-neutral-400 font-mono">cPanel Script ZIPs</span>
                </div>

                <div className="bg-white dark:bg-neutral-950/40 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 font-bold uppercase">Sales Completed</p>
                  <p className="text-2xl font-black font-mono mt-1 text-cyan-500">{orders.filter(o => o.paymentStatus === 'completed').length}</p>
                  <span className="text-[9px] text-neutral-400 font-mono">SSLCommerz Verified</span>
                </div>

                <div className="bg-white dark:bg-neutral-950/40 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 font-bold uppercase">Pending Tickets</p>
                  <p className="text-2xl font-black font-mono mt-1 text-red-500">{tickets.filter(t => t.status === 'open').length}</p>
                  <span className="text-[9px] text-neutral-400 font-mono">Workload tickets</span>
                </div>
              </div>

              {/* Advanced SVG Graph Sales Representation layout */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white flex items-center gap-1">
                      <BarChart className="w-4 h-4 text-emerald-500" />
                      <span>Monthly Agency Sales Revenue ($) Tracker</span>
                    </h3>
                    <p className="text-[11px] text-neutral-450">SVG rendered fluid visualizer matrix metrics (2026 data).</p>
                  </div>

                  <span className="p-1 px-2.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-black rounded">
                    SLA=99.98%
                  </span>
                </div>

                <div className="w-full h-48 border-b border-l border-neutral-200 dark:border-neutral-800 p-2 relative">
                  <svg className="w-full h-full" viewBox="0 0 540 180" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      points={points}
                      className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
                    />
                    {chartSales.map((val, i) => (
                      <circle
                        key={i}
                        cx={i * 80 + 30}
                        cy={240 - val * 0.3}
                        r="5"
                        className="fill-emerald-400 stroke-white dark:stroke-neutral-950 stroke-2 cursor-pointer hover:r-[7] transition-all"
                      />
                    ))}
                  </svg>
                  {/* labels */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 text-[9px] text-neutral-400 font-mono font-bold uppercase pt-1">
                    <span>Nov</span>
                    <span>Dec</span>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May (Current)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'products' && (
            <div className="space-y-6" id="panel-products">
              {/* Product creator */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-4">Add Premium Script / Digital Project Setup</h3>
                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Resource Product Title</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. ZoneBlogger - Minimal Grid Template"
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-neutral-500">Launch Cost ($)</label>
                        <input
                          type="number"
                          required
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                          className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-500">Asset Category</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value as any)}
                          className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white text-xs"
                        >
                          <option value="laravel">Laravel</option>
                          <option value="php">PHP Script</option>
                          <option value="wordpress">WordPress Theme</option>
                          <option value="blogger">Blogger Template</option>
                          <option value="mobile">MobileWebView</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Visual Thumbnail Image URL</label>
                      <input
                        type="text"
                        required
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-500">One key technical feature</label>
                      <input
                        type="text"
                        value={newProdFeature}
                        onChange={(e) => setNewProdFeature(e.target.value)}
                        placeholder="e.g. AdSense safe layouts optimized with Tailwind CSS"
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-500">Interactive Description summary overview</label>
                    <textarea
                      required
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      rows={2}
                      placeholder="Specify dynamic capabilities, database rules, admin specs..."
                      className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-305 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 text-neutral-950 font-black rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compile Product Resource</span>
                  </button>
                </form>
              </div>

              {/* Product list */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-4">Inventory Catalogue Script Assets</h3>
                <div className="space-y-2">
                  {products.map((p) => (
                    <div key={p.id} className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-12 h-10 rounded object-cover" />
                        <div>
                          <p className="font-bold text-neutral-950 dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-neutral-450 uppercase tracking-widest font-mono">ID: {p.id} • Category: {p.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-mono font-black text-emerald-500">${p.price}</span>
                        <button
                          onClick={() => {
                            deleteProduct(p.id);
                            triggerToast("Script deleted from repository catalogue.");
                          }}
                          className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'orders' && (
            <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl" id="panel-orders">
              <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-4">Secure Transactions Logs</h3>
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-center text-neutral-400 py-6 text-xs font-semibold">No transactions initiated yet.</p>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                          ord.paymentStatus === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : ord.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {ord.paymentStatus}
                        </span>
                        <h4 className="font-extrabold text-neutral-900 dark:text-white mt-1.5">{ord.itemTitle}</h4>
                        <p className="text-[10px] text-neutral-450 uppercase font-mono tracking-wider mt-0.5">Order ID: {ord.id} • Method: {ord.paymentMethod} • Date: {ord.date}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto md:justify-end border-t md:border-t-0 pt-2.5 md:pt-0">
                        <span className="font-mono font-black text-emerald-500 text-sm mr-2">${ord.price}</span>
                        
                        {ord.paymentStatus === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                updateOrderStatus(ord.id, 'completed');
                                triggerToast("Approved invoice order transaction.");
                              }}
                              className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
                              title="Approve Order"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                updateOrderStatus(ord.id, 'failed');
                                triggerToast("Order set back as Failed invoice.");
                              }}
                              className="p-1.5 bg-red-500 text-white rounded hover:bg-red-650 transition"
                              title="Reject Order"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeMenu === 'tickets' && (
            <div className="space-y-6" id="panel-tickets">
              {/* Active tickets */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Workload support tickets</h3>
                <div className="space-y-2">
                  {tickets.map((tkt) => (
                    <div 
                      key={tkt.id} 
                      onClick={() => setActiveAdminChatTicketId(tkt.id)}
                      className={`p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                        activeAdminChatTicketId === tkt.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-200/50 dark:border-neutral-800'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-neutral-950 dark:text-white">{tkt.subject}</p>
                        <p className="text-[10px] text-neutral-450 uppercase font-mono mt-0.5">ID: {tkt.id} • Priority: {tkt.priority} • Replies: {tkt.replies.length}</p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        tkt.status === 'open' ? 'bg-emerald-520/10 text-emerald-500' : 'bg-neutral-500/10 text-neutral-500'
                      }`}>
                        {tkt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat replying */}
              {activeAdminChatTicketId && openTicket && (
                <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl space-y-4">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400">Answering Customer: Imran Hasan</h4>
                      <p className="text-sm font-extrabold text-neutral-900 dark:text-white">{openTicket.subject}</p>
                    </div>
                    <button onClick={() => setActiveAdminChatTicketId(null)} className="text-xs text-neutral-500 font-medium">Close chat</button>
                  </div>

                  <div className="space-y-2 py-2 max-h-48 overflow-y-auto px-1">
                    {openTicket.replies.map((r, i) => (
                      <div key={i} className={`flex ${r.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-xl text-xs max-w-sm ${
                          r.sender === 'admin' ? 'bg-emerald-500 text-white' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
                        }`}>
                          <p className="font-semibold text-[9ppx] opacity-60 uppercase">{r.sender}</p>
                          <p>{r.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAdminTicketReplySubmit} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder="Type official support response..."
                      className="flex-1 rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-1.5 text-xs text-neutral-950 dark:text-neutral-50"
                    />
                    <button type="submit" className="px-5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-bold rounded-lg">
                      Send Reply
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeMenu === 'coupons' && (
            <div className="space-y-6" id="panel-coupons">
              {/* Creator Form */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-sm font-extrabold text-neutral-905 dark:text-white mb-4 flex items-center gap-1">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span>Generate New Discount Coupon System</span>
                </h3>

                <form onSubmit={handleCreateCoupon} className="flex flex-col sm:flex-row items-end gap-3 text-xs font-bold font-mono">
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-neutral-450 font-sans">COUPON STRING CODE</label>
                    <input
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      placeholder="e.g. ULTRA50"
                      className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white uppercase font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5 w-full sm:w-32">
                    <label className="text-neutral-450 font-sans">DISCOUNT VALUE (%)</label>
                    <input
                      type="number"
                      required
                      min={5}
                      max={95}
                      value={newCouponPercent}
                      onChange={(e) => setNewCouponPercent(parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-905 border-neutral-305 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white font-mono text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-900 dark:bg-emerald-500 text-white dark:text-black hover:opacity-90 rounded-lg text-xs font-extrabold transition font-sans w-full sm:w-auto"
                  >
                    Activate Coupon
                  </button>
                </form>

                <p className="text-[10px] text-neutral-400 mt-2">Active coupon codes are processed immediately on header's cart during downloads checkouts.</p>
              </div>

              {/* Coupon directory */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl">
                <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-4">Active Directories Coupons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {coupons.map((cp) => (
                    <div key={cp.code} className="p-3 bg-neutral-5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-1.5 rounded bg-emerald-500/10 text-emerald-500 font-bold font-mono text-xs uppercase">
                          {cp.code}
                        </span>
                        <div>
                          <p className="font-extrabold text-neutral-900 dark:text-white font-mono">-{cp.discountPercent}% OFF</p>
                          <p className="text-[9px] text-neutral-450">Expiry: {cp.expiryDate}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          deleteCoupon(cp.code);
                          triggerToast("Coupon deleted successfully.");
                        }}
                        className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'blog' && (
            <div className="space-y-6" id="panel-blog-publisher">
              
              {/* Publisher form widget */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4">
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-150 flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-pink-500 animate-pulse" />
                      <span>{editingPost ? "Modify Corporate Resource" : "Create Modern Tech Insight Publication"}</span>
                    </h3>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                      Draft or publish markdown articles, tutorial outlines, tags, and SEO definitions targeting global clients.
                    </p>
                  </div>
                  {editingPost && (
                    <button
                      onClick={handleInitiateCreate}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-350 rounded-xl text-[10px] font-mono"
                    >
                      Cancel Edit & Create New
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveAdminForm} className="space-y-4 text-xs font-semibold">
                  
                  {/* Row 1: Languages Title Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">English Post Title *</label>
                      <input
                        type="text"
                        required
                        value={adminPostTitle}
                        onChange={(e) => setAdminPostTitle(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                        placeholder="e.g. Masterclass Web Setup Guide"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Bengali Post Title</label>
                      <input
                        type="text"
                        value={adminPostTitleBn}
                        onChange={(e) => setAdminPostTitleBn(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                        placeholder="বাংলা শিরোনাম"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Arabic Post Title</label>
                      <input
                        type="text"
                        value={adminPostTitleAr}
                        onChange={(e) => setAdminPostTitleAr(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                        placeholder="العنوان بالعربية"
                      />
                    </div>
                  </div>

                  {/* Row 2: Image banner url & Category selects */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Featured Image Banner URL</label>
                      <input
                        type="url"
                        value={adminPostImage}
                        onChange={(e) => setAdminPostImage(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Associate Category</label>
                      <select
                        value={adminPostCategory}
                        onChange={(e) => setAdminPostCategory(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white cursor-pointer"
                      >
                        {BLOG_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.label}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Estimate Read Time (Format)</label>
                      <input
                        type="text"
                        value={adminPostReadTime}
                        onChange={(e) => setAdminPostReadTime(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Row 3: Summaries inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">English Post Summary *</label>
                      <textarea
                        required
                        value={adminPostSummary}
                        onChange={(e) => setAdminPostSummary(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Bengali Post Summary</label>
                      <textarea
                        value={adminPostSummaryBn}
                        onChange={(e) => setAdminPostSummaryBn(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Arabic Post Summary</label>
                      <textarea
                        value={adminPostSummaryAr}
                        onChange={(e) => setAdminPostSummaryAr(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Row 4: Detailed Content Area */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">English Body Content (Markdown Supported) *</label>
                      <textarea
                        required
                        value={adminPostContent}
                        onChange={(e) => setAdminPostContent(e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white font-mono"
                        placeholder="Write dynamic content here..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Bengali Body Content (Markdown Supported)</label>
                      <textarea
                        value={adminPostContentBn}
                        onChange={(e) => setAdminPostContentBn(e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Arabic Body Content (Markdown Supported)</label>
                      <textarea
                        value={adminPostContentAr}
                        onChange={(e) => setAdminPostContentAr(e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-905 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 5: Authors & Publication Statuses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500">Author Name</label>
                      <input
                        type="text"
                        value={adminPostAuthor}
                        onChange={(e) => setAdminPostAuthor(e.target.value)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-neutral-700 dark:text-neutral-300 select-none">
                        <input
                          type="checkbox"
                          checked={adminPostDraft}
                          onChange={(e) => setAdminPostDraft(e.target.checked)}
                          className="w-3.5 h-3.5 accent-rose-500 rounded cursor-pointer"
                        />
                        <span>Offline Draft</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-neutral-700 dark:text-neutral-300 select-none">
                        <input
                          type="checkbox"
                          checked={adminPostFeatured}
                          onChange={(e) => setAdminPostFeatured(e.target.checked)}
                          className="w-3.5 h-3.5 accent-blue-500 rounded cursor-pointer"
                        />
                        <span>Featured Hero</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-neutral-700 dark:text-neutral-300 select-none">
                        <input
                          type="checkbox"
                          checked={adminPostTrending}
                          onChange={(e) => setAdminPostTrending(e.target.checked)}
                          className="w-3.5 h-3.5 accent-purple-500 rounded cursor-pointer"
                        />
                        <span>Hot Trending</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-neutral-700 dark:text-neutral-300 select-none">
                        <input
                          type="checkbox"
                          checked={adminPostEditorsChoice}
                          onChange={(e) => setAdminPostEditorsChoice(e.target.checked)}
                          className="w-3.5 h-3.5 accent-pink-500 rounded cursor-pointer"
                        />
                        <span>Editor's Choice</span>
                      </label>
                    </div>
                  </div>

                  {/* Row 6: Interactive Tags Block */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-500 block">Associate Tags (Interactive Selector)</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      {BLOG_TAGS.map(tag => {
                        const isSelected = adminPostTags.includes(tag);
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => handleToggleFormTag(tag)}
                            className={`text-[10px] font-mono px-3 py-1 rounded-lg transition-all ${
                              isSelected 
                                ? 'bg-pink-500 text-white font-extrabold' 
                                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-350 hover:border-pink-500/55'
                            }`}
                          >
                            #{tag} {isSelected && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 7: SEO customizations */}
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/15 rounded-xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-emerald-600 dark:text-emerald-400">Google SEO Title Tag</label>
                      <input
                        type="text"
                        value={adminSeoTitle}
                        onChange={(e) => setAdminSeoTitle(e.target.value)}
                        className="w-full rounded-lg border bg-white dark:bg-neutral-900 border-emerald-500/20 px-3 py-2 text-neutral-900 dark:text-white"
                        placeholder="Snippet title for index crawler"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-emerald-600 dark:text-emerald-400">Google META Description Tag</label>
                      <input
                        type="text"
                        value={adminSeoDesc}
                        onChange={(e) => setAdminSeoDesc(e.target.value)}
                        className="w-full rounded-lg border bg-white dark:bg-neutral-900 border-emerald-500/20 px-3 py-2 text-neutral-900 dark:text-white"
                        placeholder="Short click convertible SEO meta explanation"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleInitiateCreate}
                      className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-[#152035] dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold transition cursor-pointer"
                    >
                      Clear / Reset Fields
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPost ? "Save & Apply Modifications" : "Launch Resource Article"}</span>
                    </button>
                  </div>

                </form>
              </div>

              {/* Publications list table */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono font-extrabold uppercase text-neutral-400 border-b pb-2">
                  Live publications register ({posts.length} entries)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-mono text-[10px]">
                        <th className="py-2.5">Title Banner</th>
                        <th className="py-2.5">English / Bangladeshi Banner Title</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5 text-center">Status</th>
                        <th className="py-2.5 text-right">Dev Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-150 dark:divide-neutral-850">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition">
                          <td className="py-3">
                            <img
                              src={post.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"}
                              alt={post.title}
                              className="w-12 h-10 object-cover rounded-lg border border-neutral-250 dark:border-neutral-800"
                            />
                          </td>
                          <td className="py-3 pr-2">
                            <span className="font-extrabold text-neutral-800 dark:text-neutral-200 block max-w-[280px] truncate">{post.title}</span>
                            <span className="text-[10px] text-[#818ea8] font-mono block max-w-[280px] truncate">{post.titleBn}</span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 rounded font-bold font-mono text-[9px] uppercase">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            {post.isDraft ? (
                              <span className="px-2 py-0.5 text-[8px] bg-rose-500/20 text-rose-500 rounded font-black font-mono">DRAFT</span>
                            ) : (
                              <span className="px-2 py-0.5 text-[8px] bg-emerald-500/20 text-emerald-500 rounded font-black font-mono">PUBLISHED</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => handleInitiateEdit(post, e)}
                                className="px-2.5 py-1 text-[10px] bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-neutral-950 rounded-lg transition font-bold"
                              >
                                Edit Props
                              </button>
                              <button
                                onClick={(e) => handleDeletePost(post.id, e)}
                                className="p-1 px-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition"
                                title="Delete publication permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {activeMenu === 'settings' && (
            <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-2xl space-y-6" id="panel-settings">
              <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-4 flex items-center gap-1">
                <Settings className="w-4 h-4 text-emerald-500" />
                <span>SEO Index Metadata & System Configurations</span>
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-500">Site Branding Name</label>
                    <input
                      type="text"
                      value={configSiteName}
                      onChange={(e) => setConfigSiteName(e.target.value)}
                      className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-500 font-mono">Google Analytics Measurement Key</label>
                    <input
                      type="text"
                      value={configGaId}
                      onChange={(e) => setConfigGaId(e.target.value)}
                      className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 font-mono text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-500">Global Homepage META Title Tag</label>
                  <input
                    type="text"
                    value={configSiteTitle}
                    onChange={(e) => setConfigSiteTitle(e.target.value)}
                    className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-500">META Description Tag SEO Snippet</label>
                  <textarea
                    value={configMetaDesc}
                    onChange={(e) => setConfigMetaDesc(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-500">Bangladesh Support Contact Phone</label>
                    <input
                      type="text"
                      value={configContact}
                      onChange={(e) => setConfigContact(e.target.value)}
                      className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-350 dark:border-neutral-800 px-3 py-2 font-mono text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-500">Saudi Arabia WhatsApp Number</label>
                    <input
                      type="text"
                      value={configWhatsApp}
                      onChange={(e) => setConfigWhatsApp(e.target.value)}
                      className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-350 dark:border-neutral-800 px-3 py-2 font-mono text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-5 py-2.5 bg-emerald-500 text-neutral-950 font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update SEO Metadata Configurations</span>
                </button>
              </div>
            </div>
          )}

          {activeMenu === 'currency' && (
            <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-2xl space-y-6" id="panel-currency">
              <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4">
                <h3 className="text-sm font-black text-neutral-950 dark:text-white flex items-center gap-2">
                  <Database className="w-4.5 h-4.5 text-emerald-500" />
                  <span>Multi-Currency Central Bank & Exchange Controls</span>
                </h3>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                  Persist global exchange valuation standards, toggle localized checkout routes, and simulate client regions.
                </p>
              </div>

              <div className="space-y-5 text-xs font-semibold">
                {/* Exchange rates inputs */}
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase font-mono tracking-wider mb-2.5">1. Exchange Rates (Relative to 1.00 USD)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500 dark:text-neutral-400">USD Rate (Base)</label>
                      <input
                        type="text"
                        value="1.00"
                        disabled
                        className="w-full rounded-lg border bg-neutral-100 dark:bg-zinc-900 border-neutral-200 dark:border-neutral-800 px-3 py-2 text-neutral-400 dark:text-neutral-600 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-500 dark:text-neutral-400">Bangladesh (BDT) Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        value={bdtRate}
                        onChange={(e) => setBdtRate(parseFloat(e.target.value) || 118.5)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-350 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-500 dark:text-neutral-400">Saudi Arabia (SAR) Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        value={sarRate}
                        onChange={(e) => setSarRate(parseFloat(e.target.value) || 3.75)}
                        className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-350 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggle availability activation */}
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase font-mono tracking-wider mb-2.5">2. Enable / Disable Available Currencies</h4>
                  <div className="bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">United States Dollar (USD)</span>
                      <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-mono">
                        <Check className="w-3.5 h-3.5" /> Static Active Base
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-2.5">
                      <label className="text-neutral-700 dark:text-neutral-300 cursor-pointer" htmlFor="bdt-cb">
                        Bangladeshi Taka (BDT)
                      </label>
                      <input
                        type="checkbox"
                        id="bdt-cb"
                        checked={bdtEnabled}
                        onChange={(e) => setBdtEnabled(e.target.checked)}
                        className="w-4 h-4 cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-2.5">
                      <label className="text-neutral-700 dark:text-neutral-305 cursor-pointer" htmlFor="sar-cb">
                        Saudi Riyal (SAR)
                      </label>
                      <input
                        type="checkbox"
                        id="sar-cb"
                        checked={sarEnabled}
                        onChange={(e) => setSarEnabled(e.target.checked)}
                        className="w-4 h-4 cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Default buyer currency */}
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase font-mono tracking-wider mb-2.5">3. Platform Fallback Default Currency</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['USD', 'BDT', 'SAR'].map((cur) => {
                      const isAva = cur === 'USD' || (cur === 'BDT' ? bdtEnabled : sarEnabled);
                      return (
                        <button
                          key={cur}
                          type="button"
                          disabled={!isAva}
                          onClick={() => setDefaultCurSel(cur as Currency)}
                          className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                            !isAva
                              ? 'opacity-40 cursor-not-allowed border-dashed bg-transparent border-neutral-200 dark:border-neutral-800'
                              : defaultCurSel === cur
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-md'
                              : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 cursor-pointer'
                          }`}
                        >
                          <span className="text-xs font-black">{cur}</span>
                          <span className="text-[9px] font-mono">{cur === 'USD' ? 'Base Global' : cur === 'BDT' ? '৳ - BD Target' : '﷼ - Saudi Target'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Geolocation Region Simulation controls */}
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
                    <span>4. Geolocation Country Simulation (Development Mode)</span>
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                  </h4>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mb-2 font-sans font-normal leading-relaxed">
                    Test the auto-detection algorithms immediately by forcing the browser to detect specific countries on network reload.
                  </p>
                  <select
                    value={simulatedCountry}
                    onChange={(e) => setSimulatedCountry(e.target.value as any)}
                    className="w-full rounded-lg border bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 px-3 py-2 text-neutral-900 dark:text-white cursor-pointer"
                  >
                    <option value="auto">🛰️ Actual Browser Timezone / IP (Normal Auto-detect)</option>
                    <option value="BD">🇧🇩 Force Bangladesh Location (Matched: BDT)</option>
                    <option value="SA">🇸🇦 Force Saudi Arabia Location (Matched: SAR)</option>
                    <option value="US">🇺🇸 Force USA & Rest of World (Matched: USD)</option>
                  </select>
                </div>

                {/* Simulated Region info status */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    📍 Current Simulated Network Detection Status: <b className="text-blue-500 font-mono font-bold font-sans">[{currencySettings?.detectedCountryName}]</b>
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveCurrencySettings}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-lg transition-all flex items-center gap-1. cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Persist Currency Config Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'affiliates' && (
            <div className="space-y-6 animate-in fade-in duration-300" id="panel-affiliates">
              {/* Affiliate Settings and General configuration */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-2xl text-left space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
                    <span className="p-1.5 bg-pink-500/10 text-pink-500 rounded-lg">📈</span>
                    <span>Affiliate & Referral Settings Console</span>
                  </h3>
                  <p className="text-xs text-neutral-450 mt-1">Configure global cookie lifetimes, referral percentages, and review user marketing channels.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Left: Cookie settings */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider block">Global Tracking Cookie Lifespan</label>
                      <select
                        value={cookieDuration}
                        onChange={(e) => {
                          setCookieDuration(e.target.value);
                          triggerToast(`🍪 Sticky referral cookie lifespan updated to ${e.target.value} Days successfully!`);
                        }}
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-850 p-2.5 rounded-xl font-bold text-xs text-neutral-900 dark:text-white cursor-pointer"
                      >
                        <option value="30">30 Days Duration (Standard)</option>
                        <option value="60">60 Days Extended Tracking</option>
                        <option value="90">90 Days Maximum Referral Tracking</option>
                      </select>
                      <p className="text-[10px] text-neutral-500 leading-normal">Defines how many days a referral lead cookie stays cached inside a customer's browser. Overrides on checkout.</p>
                    </div>

                    <div className="p-4 bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/10 rounded-xl space-y-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-pink-500 font-bold block">🛡️ Smart Fraud Protection</span>
                      <p className="text-[10px] text-neutral-500 dark:text-slate-400 leading-normal">
                        Automatic cross-IP verification checks are enabled. Affiliates are strictly restricted from matching their own referred checkout events.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[9.5px] text-emerald-500 font-black font-mono">
                        ● SELF_REFERRAL_BYPASS=BLOCKED
                      </span>
                    </div>
                  </div>

                  {/* Right: Commission rate values */}
                  <div className="p-4 rounded-xl bg-slate-500/5 dark:bg-slate-900/40 border border-neutral-200/50 dark:border-neutral-800 space-y-3.5">
                    <span className="text-xs font-mono font-black text-neutral-400 uppercase tracking-widest block">Commission Rates By Service Category</span>
                    
                    <div className="space-y-2 text-xs text-neutral-800 dark:text-neutral-200">
                      <div className="flex justify-between items-center gap-4">
                        <span>Hosting Services:</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <input type="number" value={commHosting} onChange={(e) => setCommHosting(Number(e.target.value))} className="w-14 p-1 rounded border text-center font-bold bg-white dark:bg-neutral-900" />
                          <span className="font-bold">%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span>Web Development:</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <input type="number" value={commWebDev} onChange={(e) => setCommWebDev(Number(e.target.value))} className="w-14 p-1 rounded border text-center font-bold bg-white dark:bg-neutral-900" />
                          <span className="font-bold">%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span>Digital Marketing:</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <input type="number" value={commMarketing} onChange={(e) => setCommMarketing(Number(e.target.value))} className="w-14 p-1 rounded border text-center font-bold bg-white dark:bg-neutral-900" />
                          <span className="font-bold">%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span>SEO Auditing Campaign:</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <input type="number" value={commSeo} onChange={(e) => setCommSeo(Number(e.target.value))} className="w-14 p-1 rounded border text-center font-bold bg-white dark:bg-neutral-900" />
                          <span className="font-bold">%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span>POS / School Software:</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <input type="number" value={commPos} onChange={(e) => setCommPos(Number(e.target.value))} className="w-14 p-1 rounded border text-center font-bold bg-white dark:bg-neutral-900" />
                          <span className="font-bold">%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span>Marketplace Digital Scripts:</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <input type="number" value={commMarketplace} onChange={(e) => setCommMarketplace(Number(e.target.value))} className="w-14 p-1 rounded border text-center font-bold bg-white dark:bg-neutral-900" />
                          <span className="font-bold">%</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerToast("✨ Successfully updated custom affiliate commission rates by category!")}
                      className="w-full py-1.5 mt-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-extrabold text-[10px] uppercase rounded-lg transition cursor-pointer"
                    >
                      Save New Commission Rates
                    </button>
                  </div>
                </div>
              </div>

              {/* Affiliate Account Applications & Onboarding Approvals queue */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-2xl text-left space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white uppercase tracking-wider font-mono">1. Partner Registration Applications Log</h4>
                  <p className="text-xs text-neutral-450 mt-1">Review and approve new partners onboarding details, WhatsApp numbers, payment settings, and countries.</p>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-neutral-900 dark:text-neutral-100">
                      <thead className="bg-pink-500/5 font-mono text-[9px] uppercase tracking-wider text-slate-400 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                          <th className="p-3">Reference/Email</th>
                          <th className="p-3">Partner Specs</th>
                          <th className="p-3">Region/WhatsApp</th>
                          <th className="p-3">Payout Gateway</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-150 dark:divide-neutral-850 font-medium whitespace-nowrap">
                        {affiliatesList.map((aff) => (
                          <tr key={aff.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition">
                            <td className="p-3">
                              <span className="font-black text-neutral-900 dark:text-white block">{aff.name}</span>
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">@{aff.username} • {aff.email}</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[9.5px] bg-pink-500/10 text-pink-500 font-black font-mono uppercase">{aff.tier}</span>
                            </td>
                            <td className="p-3">
                              <span className="block text-xs font-mono">{aff.phone}</span>
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">{aff.country}</span>
                            </td>
                            <td className="p-3 text-neutral-500 font-bold font-mono">
                              {aff.paymentMethod}
                            </td>
                            <td className="p-3">
                              {aff.status === 'approved' ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-[9px] font-black uppercase font-mono">Approved</span>
                              ) : aff.status === 'rejected' ? (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 text-[9px] font-black uppercase font-mono">Rejected</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 text-[9px] font-black uppercase font-mono animate-pulse">Pending Review</span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-1.5">
                              {aff.status === 'pending' ? (
                                <div className="inline-flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAffiliatesList(prev => prev.map(a => a.id === aff.id ? { ...a, status: 'approved' } : a));
                                      triggerToast(`✅ Approved official WebzoneBD Affiliate partner: ${aff.name}!`);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-sans rounded-lg transition text-[9px] uppercase cursor-pointer"
                                  >
                                    Approve Partner
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAffiliatesList(prev => prev.map(a => a.id === aff.id ? { ...a, status: 'rejected' } : a));
                                      triggerToast(`❌ Rejected affiliate request.`);
                                    }}
                                    className="px-2.5 py-1 bg-rose-550/20 hover:bg-rose-500/30 text-rose-550 dark:text-rose-450 font-black font-sans rounded-lg transition text-[9px] uppercase cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-neutral-400 italic">No actions needed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Dynamic commissions payouts settlements requests queue */}
              <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-2xl text-left space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white uppercase tracking-wider font-mono">2. Withdraw Payout Settlements Requests</h4>
                  <p className="text-xs text-neutral-450 mt-1">Release and reconcile withdraw funds for affiliates who reached minimum withdraw thresholds (1,000 BDT / 50 SAR / 20 USD).</p>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-neutral-900 dark:text-neutral-100">
                      <thead className="bg-pink-500/5 font-mono text-[9px] uppercase tracking-wider text-slate-400 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                          <th className="p-3">Payout Reference</th>
                          <th className="p-3">Ref Affiliate</th>
                          <th className="p-3">Requested Amount</th>
                          <th className="p-3">Withdraw Gateway</th>
                          <th className="p-3">Payout Address / Wallet</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Settlement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-150 dark:divide-neutral-850 font-medium whitespace-nowrap">
                        {withdrawRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition">
                            <td className="p-3 font-mono font-bold text-[10px]">{req.id}</td>
                            <td className="p-3 font-black">{req.name}</td>
                            <td className="p-3 text-emerald-500 font-black font-mono text-xs">{req.amount}</td>
                            <td className="p-3 font-semibold text-neutral-505 dark:text-neutral-400 font-sans">{req.gateway}</td>
                            <td className="p-3 font-mono text-[10px] text-neutral-400 dark:text-neutral-500 select-all">{req.wallet}</td>
                            <td className="p-3">
                              {req.status === 'settled' ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-[9px] font-black uppercase font-mono">Settled (Paid)</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 text-[9px] font-black uppercase font-mono animate-pulse">Pending Queue</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {req.status === 'pending' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWithdrawRequests(prev => prev.map(w => w.id === req.id ? { ...w, status: 'settled' } : w));
                                    triggerToast(`💸 Successfully settled payout of ${req.amount} via ${req.gateway} instantly!`);
                                  }}
                                  className="px-2.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold font-sans rounded-lg transition text-[9px] uppercase cursor-pointer shadow hover:opacity-90"
                                >
                                  Release Cash Payout
                                </button>
                              ) : (
                                <span className="text-[10px] text-emerald-500 font-bold font-mono">✓ COMPLETED</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300" id="panel-security-shield">
              {/* Header banner */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-2xl text-white text-left shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-widest font-mono">
                    🛡️ WebzoneBD Security Sandbox
                  </span>
                  <h3 className="text-xl font-black">WhatsApp Business Verification & Security Shield Monitor</h3>
                  <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
                    Prevent spam abuse, credential stuffing, and bot attacks. Here you can monitor dynamic OTP transaction codes, view telemetry logs, and fine-tune rate limits or blacklist suspicious IPs/numbers instantly.
                  </p>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-15 select-none pointer-events-none">
                  <Terminal className="w-32 h-32" />
                </div>
              </div>

              {/* Security Telemetry Metric Status Bars */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-4 rounded-xl text-left space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">WAF FIREWALL STATUS</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-505 animate-ping" />
                    <span className="text-sm font-extrabold text-emerald-500 dark:text-emerald-400">STRICT ARMED</span>
                  </div>
                  <p className="text-[10.5px] text-neutral-450 dark:text-neutral-505">All registration and recovery workflows are force-integrated with WhatsApp OTP.</p>
                </div>

                <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-4 rounded-xl text-left space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">AES KEY-SALT PROTOCOL</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100">AES-256-GCM / SHA2</span>
                  </div>
                  <p className="text-[10.5px] text-neutral-450 dark:text-neutral-505">Plain OTP codes are strictly hashed in sandbox registers to safeguard against database leakages.</p>
                </div>

                <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-4 rounded-xl text-left space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">CURRENT ACTIVE BANS</span>
                  <div className="text-sm font-extrabold text-rose-500 flex items-center gap-1.5">
                    <span>{blockedNumbers.length} Targets Isolated</span>
                  </div>
                  <p className="text-[10.5px] text-neutral-450 dark:text-neutral-505 font-mono animate-pulse">Quarantine period: 10 minutes from incident trigger.</p>
                </div>

                <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-4 rounded-xl text-left space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">RESEND COOLDOWN LIMIT</span>
                  <div className="text-sm font-extrabold text-cyan-500">
                    <span>{securityConfig.cooldownSeconds}s Cooldown</span>
                  </div>
                  <p className="text-[10.5px] text-neutral-450 dark:text-neutral-505">Anti-mass request protection restricts client triggers to 1 request per 30s.</p>
                </div>
              </div>

              {/* Main functional column splits */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                
                {/* 1. CONFIGURATION AND QUICK MANUAL BAN PANEL */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Security Constants config form */}
                  <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-xl space-y-4">
                    <div>
                      <h4 className="text-xs font-mono font-extrabold uppercase text-neutral-400">
                        🛡️ Adjust Security Cooldowns & Thresholds
                      </h4>
                      <p className="text-[10.5px] text-neutral-450 mt-1">Fine-tune system threshold dynamics to align with operational threat levels.</p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-bold text-neutral-400">MAX OTP RE-VERIFY ATTEMPTS</label>
                        <select 
                          className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                          value={securityConfig.maxAttempts}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const updated = { ...securityConfig, maxAttempts: val };
                            setSecurityConfig(updated);
                            localStorage.setItem('webzonebd_security_config', JSON.stringify(updated));
                            triggerToast(`⚡ Security Update: Account block trigger lowered to ${val} failed attempts.`);
                          }}
                        >
                          <option value="3">3 Attempts (Highest Strictness)</option>
                          <option value="4">4 Attempts</option>
                          <option value="5">5 Attempts (Standard Default)</option>
                          <option value="10">10 Attempts (Loose Security Mode)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10.5px] font-bold text-neutral-400">ANTI-SPAM DISPATCH COOLDOWN</label>
                        <select 
                          className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                          value={securityConfig.cooldownSeconds}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const updated = { ...securityConfig, cooldownSeconds: val };
                            setSecurityConfig(updated);
                            localStorage.setItem('webzonebd_security_config', JSON.stringify(updated));
                            triggerToast(`⏳ Security Update: Fresh OTP requests rate-limited to 1 request per ${val} seconds.`);
                          }}
                        >
                          <option value="15">15 Seconds (Fast Test mode)</option>
                          <option value="30">30 Seconds (Default)</option>
                          <option value="60">60 Seconds</option>
                          <option value="120">120 Seconds (High Traffic block)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10.5px] font-bold text-neutral-400">QUARANTINE SHIELD DURATION</label>
                        <select 
                          className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                          value={securityConfig.quarantineMinutes}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const updated = { ...securityConfig, quarantineMinutes: val };
                            setSecurityConfig(updated);
                            localStorage.setItem('webzonebd_security_config', JSON.stringify(updated));
                            triggerToast(`🔒 Quarantine Update: Suspicion triggers will lock phone and IP for ${val} minutes.`);
                          }}
                        >
                          <option value="5">5 Minutes</option>
                          <option value="10">10 Minutes (Standard Default)</option>
                          <option value="30">30 Minutes</option>
                          <option value="60">60 Minutes (Maximum Quarantine)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Manual blacklisting form */}
                  <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-xl space-y-4">
                    <div>
                      <h4 className="text-xs font-mono font-extrabold uppercase text-neutral-400">
                        🚫 Manually Blacklist Phone or IP Address
                      </h4>
                      <p className="text-[10.5px] text-neutral-450 mt-1">Isolate abusing numbers or malicious coordinates instantly manually.</p>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newBlockPhone) {
                          triggerToast('Please type a valid target value.');
                          return;
                        }
                        const updatedBlocks = [...blockedNumbers, {
                          phone: newBlockPhone,
                          ip: "180.234.92.115",
                          blockedAt: new Date().toISOString(),
                          reason: newBlockReason,
                          expiresAt: new Date(Date.now() + securityConfig.quarantineMinutes * 60000).toISOString()
                        }];
                        localStorage.setItem('webzonebd_blocked_numbers', JSON.stringify(updatedBlocks));
                        setBlockedNumbers(updatedBlocks);
                        setNewBlockPhone('');
                        triggerToast(`🚫 Isolation registered! Target ${newBlockPhone} successfully quarantined.`);
                        syncSecurityLocalStorage();
                      }}
                      className="space-y-3 pt-1 text-xs"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider font-extrabold text-neutral-400">TARGET PHONE / IP COORDINATE</label>
                        <input 
                          type="text" 
                          required
                          value={newBlockPhone}
                          onChange={(e) => setNewBlockPhone(e.target.value)}
                          placeholder="e.g. +8801700 or 103.55.10.22"
                          className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider font-extrabold text-neutral-400">QUARANTINE REASON DESCRIPTOR</label>
                        <select 
                          className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                          value={newBlockReason}
                          onChange={(e) => setNewBlockReason(e.target.value)}
                        >
                          <option value="Manual Administrative Isolation Quarantine">Manual Administrative Overwrites</option>
                          <option value="Excessive brute-force password recovery trigger">Spam password recovery trigger</option>
                          <option value="Spam bot registration attempts flagged">Suspicion of sandbox spam bot</option>
                          <option value="Malicious IP scanning coordinates blacklisted">Port probing coordinate blacklist</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-neutral-950 text-rose-500 font-extrabold border border-neutral-200 dark:border-neutral-800 text-xs uppercase cursor-pointer transition hover:bg-neutral-900"
                      >
                        Enforce Quarantine Boundary
                      </button>
                    </form>
                  </div>
                </div>

                {/* 2. SECURITY OTP TRANSACTION LOGS AND VERIFICATION HISTORY */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Logs pane */}
                  <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-extrabold uppercase text-neutral-400">
                          📊 Live Encrypted WhatsApp Verification Logs
                        </h4>
                        <p className="text-[10.5px] text-neutral-450 mt-1">Review live dispatch, valid verifications, and failed inputs.</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('webzonebd_security_otp_logs', '[]');
                          localStorage.setItem('webzonebd_failed_attempts', '[]');
                          syncSecurityLocalStorage();
                          triggerToast('🧹 Transaction logs memory cleared safely.');
                        }}
                        className="p-1 px-2.5 text-[10px] font-bold border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg text-neutral-400 transition cursor-pointer"
                      >
                        Reset Logs
                      </button>
                    </div>

                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden text-xs max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left font-sans text-neutral-900 dark:text-neutral-150">
                        <thead className="bg-[#2d7ff9]/5 font-mono text-[9px] uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-950 z-15">
                          <tr>
                            <th className="p-2.5 font-bold">Timestamp</th>
                            <th className="p-2.5 font-bold font-mono">Trigger Target</th>
                            <th className="p-2.5 font-bold">Event Type</th>
                            <th className="p-2.5 font-bold">Encrypt Code</th>
                            <th className="p-2.5 font-bold text-right">Coordinate IP</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-150 dark:divide-neutral-850 whitespace-nowrap">
                          {securityLogs.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center italic text-neutral-550 text-xs">
                                No security transactions recorded yet. Fill forms at registration step 3 or forgot screen to dispatch.
                              </td>
                            </tr>
                          ) : (
                            securityLogs.map((log: any) => (
                              <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition text-[11px] leading-none">
                                <td className="p-2.5 font-mono text-[9.5px]">
                                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </td>
                                <td className="p-2.5">
                                  <div className="font-extrabold">{log.phone}</div>
                                  <div className="text-[10px] text-neutral-450 font-mono truncate max-w-[120px]">{log.email}</div>
                                </td>
                                <td className="p-2.5">
                                  {log.type === 'dispatch' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[8.5px] font-black uppercase font-mono">DISPATCHED</span>
                                  )}
                                  {log.type === 'verification' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[8.5px] font-black uppercase font-mono">VERIFIED</span>
                                  )}
                                  {log.type === 'failed_attempt' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[8.5px] font-black uppercase font-mono">BAD INPUT</span>
                                  )}
                                  {log.type === 'block' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[8.5px] font-black uppercase font-mono animate-pulse">QUARANTINE</span>
                                  )}
                                  {log.type === 'unblock' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[#1dbf73] text-[8.5px] font-black uppercase font-mono">WHITELISTED</span>
                                  )}
                                </td>
                                <td className="p-2.5 font-mono text-[9px] text-[#2d7ff9] font-black">
                                  {log.encryptedCode || <span className="text-neutral-500 font-normal">••• SECURE</span>}
                                </td>
                                <td className="p-2.5 font-mono text-right text-neutral-450 text-[10px]">{log.ip}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Active Isolation Blacklist list */}
                  <div className="bg-white dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800 p-5 rounded-xl space-y-4">
                    <div>
                      <h4 className="text-xs font-mono font-extrabold uppercase text-neutral-400">
                        🚫 Active Isolated Targets quarantine blacklists ({blockedNumbers.length})
                      </h4>
                      <p className="text-[10.5px] text-neutral-450 mt-1">Whitelist coordinates immediately to unlock public registration or password recover triggers.</p>
                    </div>

                    <div className="border border-neutral-200 dark:border-neutral-850 rounded-lg overflow-hidden text-xs max-h-[220px] overflow-y-auto">
                      <table className="w-full text-left font-sans text-neutral-900 dark:text-neutral-150">
                        <thead className="bg-[#2d7ff9]/5 font-mono text-[9px] uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                          <tr>
                            <th className="p-2.5 font-bold">Isolated Point</th>
                            <th className="p-2.5 font-bold">Ban Reason Descriptor</th>
                            <th className="p-2.5 font-bold">Expire Coordinate</th>
                            <th className="p-2.5 font-bold text-right">Action Gate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-150 dark:divide-neutral-850 text-[11px] whitespace-nowrap">
                          {blockedNumbers.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-6 text-center italic text-neutral-500 text-xs text-neutral-450">
                                Safe condition: No IP addresses or WhatsApp accounts currently blacklisted.
                              </td>
                            </tr>
                          ) : (
                            blockedNumbers.map((b: any, index: number) => (
                              <tr key={index} className="hover:bg-neutral-50/10 dark:hover:bg-neutral-900/10 transition leading-tight">
                                <td className="p-2.5 font-bold">
                                  <div className="text-neutral-800 dark:text-slate-200 font-mono text-[11px]">{b.phone}</div>
                                  <div className="text-[9px] text-neutral-450 font-mono">Coordinate IP: {b.ip}</div>
                                </td>
                                <td className="p-2.5 text-neutral-450 max-w-[120px] truncate" title={b.reason}>
                                  {b.reason}
                                </td>
                                <td className="p-2.5 text-rose-500 font-mono text-[10px] font-bold">
                                  {new Date(b.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-2.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = blockedNumbers.filter((_, idx) => idx !== index);
                                      localStorage.setItem('webzonebd_blocked_numbers', JSON.stringify(filtered));
                                      setBlockedNumbers(filtered);
                                      triggerToast(`🔓 Target whitelisted and unblocked cleanly from metadata logs!`);
                                      
                                      // Append unblocked telemetry event
                                      try {
                                        const logs = JSON.parse(localStorage.getItem('webzonebd_security_otp_logs') || '[]');
                                        logs.unshift({
                                          id: 'log-' + Math.random().toString(36).substr(2, 9),
                                          timestamp: new Date().toISOString(),
                                          type: 'unblock',
                                          phone: b.phone,
                                          ip: b.ip,
                                          status: 'active',
                                          message: `Manual administrative clearance and whitelisting issued.`
                                        });
                                        localStorage.setItem('webzonebd_security_otp_logs', JSON.stringify(logs.slice(0, 50)));
                                        setSecurityLogs(logs);
                                      } catch (e) {
                                        console.error(e);
                                      }
                                    }}
                                    className="px-2.5 py-1 text-[9.5px] font-black tracking-wider uppercase text-emerald-500 bg-emerald-500/15 rounded-lg border border-emerald-500/10 hover:bg-emerald-500 hover:text-neutral-950 transition cursor-pointer"
                                  >
                                    Whitelist Tag
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
