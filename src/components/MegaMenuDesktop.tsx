import React, { useState, useRef } from 'react';
import { 
  Server, Database, Globe, ShoppingBag, Code, Sparkles, Layers,
  ChevronDown, ArrowRight, ShieldCheck, CheckCircle, Zap, Search,
  Laptop, Cpu, Flame, Briefcase, FileText,
  DollarSign, Users, MessageSquare, Headphones, Award,
  Rocket, Terminal, HardDrive, Check, Shield, BookOpen,
  Layout, Palette, Monitor, PenTool, BarChart3, TrendingUp,
  Target, Share2, ShoppingCart, CreditCard, Package, Store,
  Gauge, ShieldAlert, Settings, Wrench, LayoutTemplate,
  Binary, Calendar, Key, Download, Activity, HelpCircle,
  UserCheck, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Currency } from '../types';

interface MegaMenuDesktopProps {
  language: Language;
  currency: Currency;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  setIsAdmin?: (admin: boolean) => void;
  triggerToast?: (msg: string) => void;
}

export const MegaMenuDesktop: React.FC<MegaMenuDesktopProps> = ({
  language,
  currency,
  currentPage,
  setCurrentPage,
  setIsAdmin,
  triggerToast
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [domainQuery, setDomainQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth hover handlers with grace timeout to prevent flicker
  const handleMouseEnter = (menuKey: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 160);
  };

  // Close mega menu on click navigation
  const handleNavigate = (page: string, tabKey?: string, tabStorageName?: string, keyword?: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
    
    if (tabKey && tabStorageName) {
      localStorage.setItem(tabStorageName, tabKey);
    }
    if (keyword) {
      localStorage.setItem('webzone_services_filter_keyword', keyword);
    }
    window.dispatchEvent(new Event('storage'));
    
    if (setIsAdmin) setIsAdmin(false);
    setCurrentPage(page);
  };

  const handleDomainQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery.trim()) {
      if (triggerToast) {
        triggerToast(language === 'bn' ? 'অনুগ্রহ করে ডোমেন নাম লিখুন' : 'Please enter a domain name to search');
      }
      return;
    }
    localStorage.setItem('webzone_domain_search_keyword', domainQuery.trim());
    window.dispatchEvent(new Event('storage'));
    handleNavigate('domain');
  };

  // Translations
  const t = {
    home: language === 'bn' ? 'হোম' : language === 'ar' ? 'الرئيسية' : 'Home',
    services: language === 'bn' ? 'সার্ভিসেস' : language === 'ar' ? 'الخدمات' : 'Services',
    hosting: language === 'bn' ? 'হোস্টিং' : language === 'ar' ? 'الاستضافة' : 'Hosting',
    store: language === 'bn' ? 'স্টোর' : language === 'ar' ? 'المتجر' : 'Store',
    portfolio: language === 'bn' ? 'পোর্টফোলিও' : language === 'ar' ? 'المشاريع' : 'Portfolio',
    blogs: language === 'bn' ? 'ব্লগ' : language === 'ar' ? 'المدونة' : 'Blogs',
    offers: language === 'bn' ? 'অফার্স' : language === 'ar' ? 'العروض' : 'Offers'
  };

  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5" aria-label="Modern Mega Navigation">
      
      {/* 1. HOME BUTTON */}
      <button
        id="nav-link-home"
        onClick={() => handleNavigate('home')}
        className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 cursor-pointer ${
          currentPage === 'home'
            ? 'bg-blue-50 dark:bg-neutral-900/80 text-blue-600 dark:text-cyan-400 font-extrabold shadow-xs'
            : 'text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50'
        }`}
      >
        {t.home}
      </button>

      {/* 2. SERVICES MEGA MENU */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('services')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          id="nav-link-services"
          onClick={() => handleNavigate('services', 'all', 'webzone_target_services_tab')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            currentPage === 'services' || activeMenu === 'services'
              ? 'bg-blue-50 dark:bg-neutral-900/80 text-blue-600 dark:text-cyan-400 font-extrabold shadow-xs'
              : 'text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50'
          }`}
        >
          <span>{t.services}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${activeMenu === 'services' ? 'rotate-180 text-blue-600 dark:text-cyan-400' : ''}`} />
        </button>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-[35%] lg:-translate-x-[42%] top-full pt-2.5 w-[940px] lg:w-[1060px] xl:w-[1160px] z-50 origin-top text-left pointer-events-auto"
            >
              <div className="relative p-6 rounded-[24px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Rainbow top brand accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

                {/* 5 Distinct Service Columns */}
                <div className="grid grid-cols-5 gap-4.5">
                  
                  {/* Column 1: Web Design & WordPress */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold">
                        <Laptop className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                        {language === 'bn' ? 'ওয়েব ডিজাইন' : 'Web & WordPress'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { title: 'WordPress Portals', titleBn: 'ওয়ার্ডপ্রেস সাইট ও পোর্টাল', desc: 'Fast, secure custom blogs & businesses', tab: 'web', icon: Globe },
                        { title: 'Framer & Webflow', titleBn: 'ফ্রেমার ও ওয়েবফ্লো ল্যান্ডিং', desc: 'Pixel-perfect vector landing pages', tab: 'web', icon: Monitor },
                        { title: 'UI/UX Design Systems', titleBn: 'ইউআই/ইউএক্স ফিগমা ডিজাইন', desc: 'Interactive prototypes & wireframes', tab: 'web', icon: Palette },
                        { title: 'Corporate Websites', titleBn: 'কর্পোরেট এজেন্সি সাইট', desc: 'High-converting brand layouts', tab: 'web', icon: Building2 }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate('services', item.tab, 'webzone_target_services_tab', item.title)}
                          className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-blue-600 dark:group-hover/item:text-cyan-400 transition-colors truncate">
                              {language === 'bn' ? item.titleBn : item.title}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Laravel & Custom Software */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                        <Code className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {language === 'bn' ? 'লারাভেল ও কোডিং' : 'Laravel & SaaS'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { title: 'Custom Laravel SaaS', titleBn: 'কাস্টম লারাভেল সফটওয়্যার', desc: 'Scalable cloud applications with PHP', tab: 'web', icon: Cpu },
                        { title: 'Admin Dashboards & ERP', titleBn: 'কাস্টম সিএমএস ও ইআরপি', desc: 'Role-based management portals', tab: 'web', icon: LayoutTemplate },
                        { title: 'Database Architectures', titleBn: 'ডাটাবেস অপ্টিমাইজেশন', desc: 'High-concurrency PostgreSQL & MySQL', tab: 'web', icon: Database },
                        { title: 'RESTful API Bridges', titleBn: 'রেস্ট এপিআই সলিউশন', desc: 'Secure web & mobile integrations', tab: 'web', icon: Terminal }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate('services', item.tab, 'webzone_target_services_tab', item.title)}
                          className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors truncate">
                              {language === 'bn' ? item.titleBn : item.title}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Digital Marketing & SEO */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {language === 'bn' ? 'মার্কেটিং ও এসইও' : 'Marketing & SEO'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { title: 'Technical Search SEO', titleBn: 'গুগল ১ম পেজ এসইও', desc: 'Rank high on Google Search queries', tab: 'seo', icon: Search },
                        { title: 'Targeted Social Ads', titleBn: 'টার্গেটেড সোশ্যাল ক্যাম্পেইন', desc: 'High ROI Facebook & Google ads', tab: 'marketing', icon: Target },
                        { title: 'Conversion Funnels', titleBn: 'কনভার্সন ফানেল ও পিক্সেল', desc: 'Pixel tracking & analytics setup', tab: 'marketing', icon: TrendingUp },
                        { title: 'Brand Vector Identity', titleBn: 'ব্র্যান্ড আইডেন্টিটি ও লোগো', desc: 'Logos, vector typography & banners', tab: 'graphics', icon: Sparkles }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate('services', item.tab, 'webzone_target_services_tab', item.title)}
                          className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors truncate">
                              {language === 'bn' ? item.titleBn : item.title}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: E-Commerce Solutions */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        {language === 'bn' ? 'ই-কমার্স সমাধান' : 'E-Commerce & Pay'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { title: 'Online Retail Shops', titleBn: 'অনলাইন শপ ও ক্যাটালগ', desc: 'Custom WooCommerce & React storefronts', tab: 'web', icon: ShoppingCart },
                        { title: 'Payment Gateways', titleBn: 'পেমেন্ট গেটওয়ে ইন্টিগ্রেশন', desc: 'bKash, Nagad, Rocket, SSLCommerz, STC Pay', tab: 'web', icon: CreditCard },
                        { title: 'Inventory & POS', titleBn: 'ইনভেন্টরি ট্র্যাকিং সিস্টেম', desc: 'Automated invoices, barcodes & stock', tab: 'web', icon: Package },
                        { title: 'Multi-Vendor Portals', titleBn: 'মাল্টি-ভেন্ডর মার্কেটপ্লেস', desc: 'Seller payouts, escrow & commissions', tab: 'web', icon: Store }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate('services', item.tab, 'webzone_target_services_tab', item.title)}
                          className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors truncate">
                              {language === 'bn' ? item.titleBn : item.title}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 5: Server & Gig Fixes */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                        <Server className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {language === 'bn' ? 'স্পেশাল গিগ সার্ভিস' : 'Gigs & Repairs'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { title: 'Speed Optimization', titleBn: 'স্পিড ও ক্যাশিং টিউনিং', desc: 'Achieve 95+ score on PageSpeed', tab: 'web', icon: Gauge },
                        { title: 'Malware & Firewall Fix', titleBn: 'ম্যালওয়্যার ক্লিন ও সিকিউরিটি', desc: 'Deep virus scan & firewall protection', tab: 'web', icon: ShieldAlert },
                        { title: 'WHMCS Automation', titleBn: 'WHMCS হোস্টিং বিলিং', desc: 'Automated server billing & setup', tab: 'web', icon: Settings },
                        { title: 'Theme Customization', titleBn: 'কাস্টম কোড ও ফিচার সেটআপ', desc: 'Custom hooks & tailored plugins', tab: 'web', icon: Wrench }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate('services', item.tab, 'webzone_target_services_tab', item.title)}
                          className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors truncate">
                              {language === 'bn' ? item.titleBn : item.title}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Highlight Banners */}
                <div className="mt-5 pt-4.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-3.5">
                  {[
                    {
                      id: 'digital-web-dev',
                      title: '🚀 Digital Web Development',
                      titleBn: '🚀 ফুল-স্ট্যাক ডিজিটাল ওয়েব ডেভেলপমেন্ট',
                      desc: 'Modern turnkey business platforms deployed in 48 hours.'
                    },
                    {
                      id: 'google-business',
                      title: '📍 Google Business Map Setup',
                      titleBn: '📍 ১০০% গুগল মাই বিজনেস ম্যাপ ভেরিফিকেশন',
                      desc: 'Rank on top for local searches and attract real buyers.'
                    },
                    {
                      id: 'growth-package',
                      title: '📈 All-in-One Growth Packages',
                      titleBn: '📈 আল্টিমেট বিজনেস গ্রোথ প্যাকেজস',
                      desc: 'Website + SEO + Social Marketing at discounted combo price.'
                    }
                  ].map((banner) => (
                    <div
                      key={banner.id}
                      onClick={() => handleNavigate('services', banner.id, 'webzone_target_services_tab')}
                      className="group p-3 rounded-2xl bg-gradient-to-r from-blue-50/40 via-indigo-50/30 to-cyan-50/20 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-900/60 hover:from-blue-600 hover:to-indigo-600 border border-slate-200/70 dark:border-slate-700/50 hover:border-transparent cursor-pointer transition-all duration-250 shadow-xs hover:shadow-md"
                    >
                      <h4 className="text-[11.5px] font-black text-slate-900 dark:text-white group-hover:text-white transition-colors">
                        {language === 'bn' ? banner.titleBn : banner.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mt-0.5 leading-snug transition-colors">
                        {banner.desc}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. HOSTING & CLOUD MEGA MENU */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('hosting')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          id="nav-link-hosting"
          onClick={() => handleNavigate('hosting', 'bdix', 'webzone_target_hosting_tab')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            currentPage === 'hosting' || activeMenu === 'hosting'
              ? 'bg-blue-50 dark:bg-neutral-900/80 text-blue-600 dark:text-cyan-400 font-extrabold shadow-xs'
              : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50'
          }`}
        >
          <span>{t.hosting}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${activeMenu === 'hosting' ? 'rotate-180 text-blue-600 dark:text-cyan-400' : ''}`} />
        </button>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu === 'hosting' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-[40%] lg:-translate-x-[48%] top-full pt-2.5 w-[920px] lg:w-[1040px] xl:w-[1140px] z-50 origin-top text-left pointer-events-auto"
            >
              <div className="relative p-6 rounded-[24px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Rainbow top brand accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

                <div className="grid grid-cols-12 gap-5.5">
                  
                  {/* Left 8 Cols: Hosting Options Grid */}
                  <div className="col-span-8 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                          BDIX Ultra NVMe Cloud Infrastructure
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                        ⚡ &lt;5ms Latency in BD
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'bdix', title: 'BDIX Shared Hosting', desc: 'Ultra-fast NVMe storage with cPanel & Free SSL.', badge: 'POPULAR', color: 'indigo' },
                        { id: 'bdix', title: 'WordPress LiteSpeed', desc: 'Pre-configured LSCache plugin for instant load times.', badge: 'TURBO', color: 'blue' },
                        { id: 'bdix', title: 'High-Power Business Cloud', desc: 'Dedicated isolated CPU cores for high-volume stores.', badge: 'ENTERPRISE', color: 'purple' },
                        { id: 'reseller', title: 'WHM Reseller Hosting', desc: 'Start your own hosting business with 100% white label.', badge: 'RESELLER', color: 'emerald' },
                        { id: 'vps', title: 'AMD EPYC NVMe VPS', desc: 'KVM virtual machines with root access & dedicated IP.', badge: 'SSD VPS', color: 'amber' },
                        { id: 'vps', title: 'Dedicated Bare Metal', desc: 'Physical enterprise servers with unmetered 1Gbps port.', badge: 'PHYSICAL', color: 'rose' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate('hosting', item.id, 'webzone_target_hosting_tab')}
                          className="group/item flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 border border-slate-150/70 dark:border-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-700/50 cursor-pointer transition-all duration-200"
                        >
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 group-hover/item:bg-indigo-600 group-hover/item:text-white shadow-xs transition-colors shrink-0">
                            <Server className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-cyan-400 transition-colors truncate">
                                {item.title}
                              </span>
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shrink-0">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-normal">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Trust Highlights Bar */}
                    <div className="pt-2 flex items-center justify-between text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>99.99% Uptime SLA</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                        <span>Free SSL & Daily Cloud Backup</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>100Gbps DDoS Protection</span>
                      </div>
                    </div>

                  </div>

                  {/* Right 4 Cols: Featured Hosting Promo Card */}
                  <div className="col-span-4 flex flex-col justify-between p-5.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 text-white relative overflow-hidden shadow-lg shadow-indigo-600/20">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-3.5 relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-[9px] font-black uppercase tracking-wider">
                        <Flame className="w-3 h-3 text-amber-300" />
                        <span>Featured BDIX Package</span>
                      </div>

                      <div>
                        <div className="text-[11px] text-cyan-100 font-medium">Starting from only</div>
                        <div className="text-2xl font-black tracking-tight mt-0.5">$1.99 <span className="text-xs font-normal text-cyan-200">/month</span></div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/15 text-[11px]">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          <span>Pure NVMe SSD Storage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          <span>Unmetered BDIX Bandwidth</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          <span>Free 1-Click Script Installer</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigate('hosting', 'bdix', 'webzone_target_hosting_tab')}
                      className="mt-6 w-full py-2.5 bg-white text-indigo-700 hover:bg-cyan-50 rounded-xl text-xs font-black tracking-wide text-center transition-all cursor-pointer shadow-sm active:scale-98"
                    >
                      Deploy Server Now
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. STORE & GPL MARKETPLACE MEGA MENU */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('store')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          id="nav-link-store"
          onClick={() => handleNavigate('marketplace')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            currentPage === 'marketplace' || activeMenu === 'store'
              ? 'bg-blue-50 dark:bg-neutral-900/80 text-blue-600 dark:text-cyan-400 font-extrabold shadow-xs'
              : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50'
          }`}
        >
          <span>{t.store}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${activeMenu === 'store' ? 'rotate-180 text-blue-600 dark:text-cyan-400' : ''}`} />
        </button>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu === 'store' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-[50%] lg:-translate-x-[55%] top-full pt-2.5 w-[920px] lg:w-[1020px] xl:w-[1120px] z-50 origin-top text-left pointer-events-auto"
            >
              <div className="relative p-6 rounded-[24px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Top brand line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600" />

                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Left 9 Cols: Store Categories */}
                  <div className="col-span-9 grid grid-cols-3 gap-4.5">
                    
                    {/* Category 1: Website Templates */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Pre-made Layouts
                        </span>
                      </div>
                      <div className="space-y-1">
                        {[
                          { title: 'WordPress Themes', desc: 'Responsive, fast & SEO-optimized designs', icon: Layout },
                          { title: 'HTML5 & Tailwind Templates', desc: 'Clean modern code with zero bloat', icon: Code },
                          { title: 'Figma UI Kits', desc: 'Design systems with customizable mockups', icon: Palette },
                          { title: 'React / Next.js Kits', desc: 'Production-ready web application starters', icon: Binary }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleNavigate('marketplace')}
                            className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                              <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors truncate">
                                {item.title}
                              </div>
                              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category 2: Scripts & SaaS */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Scripts & SaaS
                        </span>
                      </div>
                      <div className="space-y-1">
                        {[
                          { title: 'PHP & Laravel Scripts', desc: 'Full-stack commercial portals with database', icon: Terminal },
                          { title: 'E-Commerce Engines', desc: 'Multi-vendor stores & POS systems', icon: ShoppingBag },
                          { title: 'Booking & CRM Software', desc: 'Ready-to-use business management', icon: Calendar },
                          { title: 'Payment Gateways Addons', desc: 'bKash, Nagad, Rocket plugins', icon: CreditCard }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleNavigate('marketplace')}
                            className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                              <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors truncate">
                                {item.title}
                              </div>
                              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category 3: GPL Licenses Hub */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          100% Clean GPL Hub
                        </span>
                      </div>
                      <div className="space-y-1">
                        {[
                          { title: 'Premium GPL Themes', desc: 'Unlimited domain usage, clean source code', icon: Key },
                          { title: 'Premium GPL Plugins', desc: 'Elementor Pro, WP Rocket, RankMath', icon: Download },
                          { title: 'WooCommerce Extensions', desc: 'All payment & checkout addons unlocked', icon: Package },
                          { title: 'Lifetime GPL Bundles', desc: 'Complete agency asset libraries', icon: Award }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleNavigate('marketplace')}
                            className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                              <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors truncate">
                                {item.title}
                              </div>
                              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right 3 Cols: Featured Promo Card */}
                  <div className="col-span-3 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 text-white relative overflow-hidden shadow-lg shadow-emerald-600/20">
                    <div className="space-y-3 relative z-10">
                      <span className="inline-block text-[8px] uppercase tracking-wider font-extrabold bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                        🔥 GPL Flash Sale
                      </span>
                      <h4 className="text-sm font-black leading-snug">
                        Download 100% Clean GPL Themes & Plugins
                      </h4>
                      <div className="text-[11px] font-bold py-1 px-2 bg-white/15 rounded-lg border border-white/20 font-mono text-center">
                        Starting from $4.99
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigate('marketplace')}
                      className="mt-5 w-full py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold text-center transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      Browse Digital Store
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. PORTFOLIO MEGA MENU */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('portfolio')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          id="nav-link-portfolio"
          onClick={() => handleNavigate('portfolio')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            currentPage === 'portfolio' || activeMenu === 'portfolio'
              ? 'bg-blue-50 dark:bg-neutral-900/80 text-blue-600 dark:text-cyan-400 font-extrabold shadow-xs'
              : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50'
          }`}
        >
          <span>{t.portfolio}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${activeMenu === 'portfolio' ? 'rotate-180 text-blue-600 dark:text-cyan-400' : ''}`} />
        </button>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu === 'portfolio' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-[60%] lg:-translate-x-[68%] top-full pt-2.5 w-[840px] lg:w-[920px] z-50 origin-top text-left pointer-events-auto"
            >
              <div className="relative p-6 rounded-[24px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

                <div className="grid grid-cols-12 gap-5">
                  
                  {/* Left 8 Cols: Showcase Categories */}
                  <div className="col-span-8 space-y-3.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Client Case Studies & Live Projects</span>
                      </span>
                      <span className="text-[10px] text-slate-400">500+ Delivered Worldwide</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: 'Fintech & Payment Systems', desc: 'High-security multi-currency digital gateways', tech: 'Laravel / Vue', icon: CreditCard },
                        { title: 'E-Commerce Megastores', desc: 'Dynamic shopping platforms with 50,000+ items', tech: 'React / Node', icon: ShoppingBag },
                        { title: 'Hospital & School ERPs', desc: 'Automated student/patient management systems', tech: 'Laravel / MySQL', icon: Building2 },
                        { title: 'BDIX Media Portals', desc: 'Ultra-fast video streaming and news networks', tech: 'Next.js / CDN', icon: Globe }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate('portfolio')}
                          className="group p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-150/70 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50 cursor-pointer transition-all duration-150 flex items-start gap-2.5"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-950/50 group-hover:scale-110 group-hover:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:scale-105" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                              {item.title}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {item.desc}
                            </p>
                            <span className="inline-block mt-1.5 text-[8px] font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-100/70 dark:bg-blue-950/70 px-1.5 py-0.5 rounded">
                              {item.tech}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-black text-blue-600 dark:text-cyan-400">500+</div>
                        <div className="text-[9px] text-slate-500">Completed Projects</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">99.4%</div>
                        <div className="text-[9px] text-slate-500">Client Satisfaction</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-black text-purple-600 dark:text-purple-400">12+</div>
                        <div className="text-[9px] text-slate-500">Countries Served</div>
                      </div>
                    </div>

                  </div>

                  {/* Right 4 Cols: CTA */}
                  <div className="col-span-4 flex flex-col justify-between p-4.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-lg shadow-blue-600/20">
                    <div className="space-y-3 relative z-10">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[8.5px] font-extrabold uppercase">
                        🚀 Bespoke Projects
                      </div>
                      <h4 className="text-sm font-black leading-snug">
                        Have a Custom Idea in Mind?
                      </h4>
                      <p className="text-[10px] text-blue-100 leading-normal">
                        Our engineering team designs bespoke web and mobile platforms tailored exactly to your business model.
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavigate('portfolio')}
                      className="mt-5 w-full py-2 bg-white text-blue-800 hover:bg-blue-50 rounded-xl text-xs font-bold text-center transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      View All Projects
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. BLOGS MEGA MENU */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('blogs')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          id="nav-link-blogs"
          onClick={() => handleNavigate('blog')}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            currentPage === 'blog' || activeMenu === 'blogs'
              ? 'bg-blue-50 dark:bg-neutral-900/80 text-blue-600 dark:text-cyan-400 font-extrabold shadow-xs'
              : 'text-neutral-750 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50'
          }`}
        >
          <span>{t.blogs}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${activeMenu === 'blogs' ? 'rotate-180 text-blue-600 dark:text-cyan-400' : ''}`} />
        </button>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu === 'blogs' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute right-0 top-full pt-2.5 w-[780px] lg:w-[860px] z-50 origin-top text-left pointer-events-auto"
            >
              <div className="relative p-6 rounded-[24px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

                <div className="grid grid-cols-3 gap-5">
                  
                  {/* Column 1: Tech Blog & Insights */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        Tech Insights & SEO
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { title: 'Tech Blog & Insights', desc: 'Web tips, SEO guides & server setups', page: 'blog', icon: FileText },
                        { title: 'BDIX Speed Benchmark', desc: 'Real-time network latency comparisons', page: 'blog', icon: Activity },
                        { title: 'Server Security Best Practices', desc: 'DDoS defense & SSL hardening', page: 'blog', icon: ShieldCheck },
                        { title: 'E-Commerce Growth Secrets', desc: 'Speed optimization for high conversions', page: 'blog', icon: Sparkles }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate(item.page)}
                          className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors truncate">
                              {item.title}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Developer Tutorials & Guides */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Tutorials & Knowledge
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { title: 'Developer Tutorials', desc: 'Laravel, WordPress & React guides', page: 'blog', icon: Code },
                        { title: 'Domain & DNS Mastery', desc: 'Nameservers, Cloudflare & MX records', page: 'blog', icon: Globe },
                        { title: 'Help Desk & FAQs', desc: 'Frequently asked customer questions', page: 'faq', icon: HelpCircle },
                        { title: 'Affiliate Partner Guide', desc: 'How to earn 30% monthly commission', page: 'affiliate', badge: 'GUIDE', icon: DollarSign }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNavigate(item.page)}
                          className="group/item flex items-start gap-2 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-150"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white group-hover/item:bg-slate-200/80 dark:group-hover/item:bg-slate-700/80 group-hover/item:scale-110 group-hover/item:shadow-sm transition-all duration-200 ease-out shrink-0 transform-gpu">
                            <item.icon className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/item:scale-105" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[7.5px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Featured Article / Reading Hub Card */}
                  <div className="flex flex-col justify-between p-4.5 rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 text-white relative overflow-hidden shadow-lg shadow-purple-600/20 text-left">
                    <div className="space-y-3 relative z-10">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[8.5px] font-extrabold uppercase">
                        📰 Featured Tech Read
                      </div>
                      <h4 className="text-sm font-black leading-snug">
                        Explore Webzone BD Articles & Tutorials
                      </h4>
                      <p className="text-[10px] text-purple-100 leading-normal">
                        Stay ahead with in-depth web development tutorials, server architecture analysis, and hosting insights.
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavigate('blog')}
                      className="mt-4 w-full py-2 bg-white text-purple-800 hover:bg-purple-50 rounded-xl text-xs font-bold text-center transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      Read All Blogs & Articles
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. OFFERS & DEALS (Glowing CTA button) */}
      <button
        id="nav-link-offers"
        onClick={() => handleNavigate('offers')}
        className={`px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
          currentPage === 'offers'
            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold border border-rose-500/30 shadow-xs'
            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs'
        }`}
      >
        <span className="animate-pulse">🔥</span>
        <span>{t.offers}</span>
      </button>

    </nav>
  );
};

export default MegaMenuDesktop;
