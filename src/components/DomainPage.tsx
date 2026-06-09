import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Globe, ChevronDown, Check, Shield, HelpCircle,
  ArrowRight, Server, RefreshCw, Layers, Zap, ShoppingCart,
  Gift, Heart, Star, Phone, Mail, MessageSquare, Info,
  ShieldCheck, X, Plus, Trash2, Settings, Database,
  TrendingUp, Sparkles, Clock, Bookmark, Filter, AlertTriangle,
  Cpu, Terminal, Sparkle
} from "lucide-react";
import { Language, Currency, Product, UserSession } from "../types";

interface DomainPageProps {
  language: Language;
  theme: string;
  currency: Currency;
  currencySettings: any;
  addToCart: (product: Product) => void;
  setCurrentPage: (page: string) => void;
  triggerToast: (msg: string) => void;
  user?: UserSession | null;
  setUser?: (user: UserSession | null) => void;
  isAdmin?: boolean;
  setIsAdmin?: (isAdmin: boolean) => void;
}

// BDT pricing rates matching original
const pricingDataBDT = [
  { ext: ".com", regular: 1699, offer: 1099, renewal: 1699, transfer: 1699, isHot: true },
  { ext: ".net", regular: 1799, offer: 1499, renewal: 1799, transfer: 1799, isHot: false },
  { ext: ".org", regular: 1699, offer: 1399, renewal: 1699, transfer: 1699, isHot: false },
  { ext: ".io", regular: 4200, offer: 3500, renewal: 4200, transfer: 4200, isHot: true },
  { ext: ".ai", regular: 8500, offer: 7499, renewal: 8500, transfer: 8500, isHot: true },
  { ext: ".co", regular: 2999, offer: 2499, renewal: 2999, transfer: 2999, isHot: false },
  { ext: ".shop", regular: 1200, offer: 899, renewal: 1200, transfer: 1205, isHot: false },
  { ext: ".store", regular: 1400, offer: 999, renewal: 1400, transfer: 1400, isHot: false },
  { ext: ".online", regular: 990, offer: 499, renewal: 990, transfer: 990, isHot: false },
  { ext: ".xyz", regular: 699, offer: 399, renewal: 699, transfer: 699, isHot: true },
  { ext: ".com.bd", regular: 1199, offer: 850, renewal: 1199, transfer: 1199, isHot: true },
  { ext: ".bd", regular: 1850, offer: 1450, renewal: 1850, transfer: 1850, isHot: false },
];

export default function DomainPage({
  language,
  theme,
  currency,
  currencySettings,
  addToCart,
  setCurrentPage,
  triggerToast,
  user,
  setUser,
  isAdmin,
  setIsAdmin,
}: DomainPageProps) {
  // --- STATE ---
  const [description, setDescription] = useState("");
  const [namingStyle, setNamingStyle] = useState("Brandable");
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([
    ".com", ".net", ".org", ".xyz", ".ai"
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [checkedStatusMap, setCheckedStatusMap] = useState<Record<string, { loading: boolean; isAvailable?: boolean }>>({});
  
  // Hostinger Search Engine States
  const [activeSearchMode, setActiveSearchMode] = useState<"instant" | "ai">("instant");
  const [instantSearchQuery, setInstantSearchQuery] = useState("");
  const [isInstantSearching, setIsInstantSearching] = useState(false);
  const [instantSearchResult, setInstantSearchResult] = useState<any | null>(null);
  const [instantAlternatives, setInstantAlternatives] = useState<any[]>([]);
  
  // Smart alternatives modal / expansion per domain
  const [activeAlternativesDomain, setActiveAlternativesDomain] = useState<string | null>(null);

  // Saved domains (persisted)
  const [savedDomains, setSavedDomains] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("webzone_saved_domains");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recent generation history (persisted)
  const [recentGenerations, setRecentGenerations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("webzone_recent_domain_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer Dashboard State
  const [dashboardTab, setDashboardTab] = useState<"saved" | "purchased" | "dns" | "whois">("saved");
  const [whoisQuery, setWhoisQuery] = useState("");
  const [whoisResult, setWhoisResult] = useState<any | null>(null);
  const [isQueryingWhois, setIsQueryingWhois] = useState(false);

  // DNS Mock records state
  const [dnsDomain, setDnsDomain] = useState("mybrandhub.com");
  const [dnsRecords, setDnsRecords] = useState<any[]>([
    { id: 1, type: "A", name: "@", value: "192.168.10.100", ttl: 14400 },
    { id: 2, type: "CNAME", name: "www", value: "mybrandhub.com", ttl: 14400 },
    { id: 3, type: "MX", name: "@", value: "10 mail.mybrandhub.com", ttl: 14400 },
  ]);
  const [newDnsType, setNewDnsType] = useState("A");
  const [newDnsName, setNewDnsName] = useState("");
  const [newDnsValue, setNewDnsValue] = useState("");

  // Admin Configuration States
  const [adminPromptTemplate, setAdminPromptTemplate] = useState(
    "You are an elite automated Domain consultancy engine built by WebzoneBD. You respond ONLY in valid JSON matching the exact schema."
  );
  const [adminWhmcsUrl, setAdminWhmcsUrl] = useState("https://www.host.webzonebd.com/cart.php");
  const [adminExtensions, setAdminExtensions] = useState<string[]>([
    ".com", ".net", ".org", ".io", ".ai", ".co", ".shop", ".store", ".online", ".xyz", ".com.bd", ".bd"
  ]);
  const [adminActivePromo, setAdminActivePromo] = useState("BDROCK99");

  // Show Admin Settings tab
  const [showAdminConfig, setShowAdminConfig] = useState(false);
  const [domainAdminEmail, setDomainAdminEmail] = useState("");
  const [domainAdminPassword, setDomainAdminPassword] = useState("");
  const [domainAdminError, setDomainAdminError] = useState("");

  // Currency utility rates
  const bdtRate = currencySettings?.rates?.BDT ?? 118.5;
  const targetRate = currencySettings?.rates?.[currency] ?? 1.0;

  const convertAndFormatVal = (bdtPrice: number) => {
    const priceInUSD = bdtPrice / bdtRate;
    const priceInTarget = priceInUSD * targetRate;
    if (currency === "BDT") {
      return `৳${Math.round(bdtPrice).toLocaleString()}`;
    } else if (currency === "SAR") {
      return `﷼${priceInTarget.toFixed(2)}`;
    } else {
      return `$${priceInTarget.toFixed(2)}`;
    }
  };

  // Preset prompts trigger
  const handlePresetFill = (presetDesc: string, styleVal: string) => {
    setDescription(presetDesc);
    setNamingStyle(styleVal);
    triggerToast(language === "bn" ? `পরীক্ষামূলক প্রম্পট সেটআপ করা হয়েছে!` : `Example preset has been loaded! Click Generate.`);
    const el = document.getElementById("ai-search-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Check live availability via node server endpoint
  const checkSingleDomainLive = async (domainName: string) => {
    setCheckedStatusMap(prev => ({
      ...prev,
      [domainName]: { loading: true }
    }));

    try {
      const response = await fetch("/api/check-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainName }),
      });
      const data = await response.json();
      setCheckedStatusMap(prev => ({
        ...prev,
        [domainName]: { loading: false, isAvailable: data.isAvailable }
      }));
    } catch {
      // Offline fallback check
      const isAvailableFallback = !domainName.includes("google") && !domainName.includes("facebook") && !domainName.includes("webzone");
      setCheckedStatusMap(prev => ({
        ...prev,
        [domainName]: { loading: false, isAvailable: isAvailableFallback }
      }));
    }
  };

  // Hostinger-Style Instant Domain Search Engine Submit Action
  const handleInstantDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = instantSearchQuery.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    if (!clean) {
      triggerToast(language === "bn" ? "অনুগ্রহ করে একটি ডোমেন নাম টাইপ করুন!" : "Please enter a domain name to search!");
      return;
    }

    setIsInstantSearching(true);
    setInstantSearchResult(null);
    setInstantAlternatives([]);

    let namePart = clean;
    let extPart = ".com";
    const dotIndex = clean.indexOf(".");
    if (dotIndex !== -1) {
       namePart = clean.substring(0, dotIndex);
       extPart = clean.substring(dotIndex);
    } else {
       if (!instantSearchQuery.includes(".")) {
         setInstantSearchQuery(prev => `${prev}.com`);
       }
    }

    const queryDomain = dotIndex !== -1 ? clean : `${clean}.com`;

    try {
      const response = await fetch("/api/check-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: queryDomain }),
      });
      const data = await response.json();
      setInstantSearchResult({
        name: queryDomain,
        isAvailable: data.isAvailable,
        extension: extPart,
        priceBDT: pricingDataBDT.find(p => p.ext === extPart)?.offer || 1099
      });
    } catch {
      setInstantSearchResult({
        name: queryDomain,
        isAvailable: true,
        extension: extPart,
        priceBDT: pricingDataBDT.find(p => p.ext === extPart)?.offer || 1099
      });
    }

    // Simultaneously fetch other major active suffix recommendations for hostinger style lists
    const targetAlts = [".com", ".net", ".org", ".xyz", ".ai", ".com.bd", ".bd"].filter(e => e !== extPart);
    const resolvedAlts: any[] = [];

    // Check first 4 alternatives in parallel for extreme speed
    const checkPromises = targetAlts.slice(0, 4).map(async (altExt) => {
      const fullAltDomain = `${namePart}${altExt}`;
      const pricingItem = pricingDataBDT.find(p => p.ext === altExt);
      const priceBDT = pricingItem ? pricingItem.offer : 1099;

      try {
        const altResponse = await fetch("/api/check-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: fullAltDomain }),
        });
        const altData = await altResponse.json();
        return {
          name: fullAltDomain,
          extension: altExt,
          isAvailable: altData.isAvailable,
          priceBDT: priceBDT
        };
      } catch {
        return {
          name: fullAltDomain,
          extension: altExt,
          isAvailable: !fullAltDomain.includes("google") && !fullAltDomain.includes("webzone"),
          priceBDT: priceBDT
        };
      }
    });

    try {
      const results = await Promise.all(checkPromises);
      resolvedAlts.push(...results);
    } catch {
      // fallback
    }

    setInstantAlternatives(resolvedAlts);
    setIsInstantSearching(false);
    triggerToast(language === "bn" ? "ডোমেন অনুসন্ধান সম্পন্ন হয়েছে!" : "Domains search query completed successfully!");
  };

  // Launch AI Domain Generator API Call
  const handleGenerateDomains = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      triggerToast(language === "bn" ? "অনুগ্রহ করে আপনার ব্র্যান্ড আইডি বা প্রজেক্ট বর্ণনা টাইপ করুন!" : "Please write a summary of your brand or business idea first!");
      return;
    }

    setIsGenerating(true);
    setHasGenerated(false);
    setSuggestions([]);

    try {
      const response = await fetch("/api/generate-domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description,
          style: namingStyle,
          extensions: selectedExtensions,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failure response");
      }

      const data = await response.json();
      const loadedSuggestions = data.suggestions || [];
      setSuggestions(loadedSuggestions);
      setHasGenerated(true);

      // Save to recent generation history
      const newGenerationRecord = {
        id: Date.now(),
        query: description,
        style: namingStyle,
        extensionsCount: selectedExtensions.length,
        timestamp: new Date().toLocaleTimeString(),
        resultsCount: loadedSuggestions.length,
      };

      const updatedHistory = [newGenerationRecord, ...recentGenerations.slice(0, 7)];
      setRecentGenerations(updatedHistory);
      localStorage.setItem("webzone_recent_domain_searches", JSON.stringify(updatedHistory));

      triggerToast(language === "bn" ? "এআই ডোমেন সাফল্যের সাথে জেনারেট হয়েছে!" : "AI Domain suggestions generated successfully!");

      // Async fetch availability for top 3 automatically
      loadedSuggestions.slice(0, 3).forEach((item: any) => {
        checkSingleDomainLive(item.name);
      });

      // Scroll to view
      setTimeout(() => {
        const resultsEl = document.getElementById("ai-generator-results");
        if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth" });
      }, 400);

    } catch (err: any) {
      console.error(err);
      triggerToast("Failed to communicate with AI Domain Generator API. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save domain to favorites
  const handleSaveDomainIdea = (domainObj: { name: string; isAvailable?: boolean }) => {
    // Prevent duplicate entries
    if (savedDomains.some((d) => d.name.toLowerCase() === domainObj.name.toLowerCase())) {
      triggerToast(language === "bn" ? "ডোমেনটি ইতোমধ্যে আপনার সেভ করা তালিকায় রয়েছে!" : "This domain is already in your saved ideas!");
      return;
    }

    const updated = [...savedDomains, {
      ...domainObj,
      savedAt: new Date().toLocaleDateString(),
      priceBDT: pricingDataBDT.find(p => domainObj.name.endsWith(p.ext))?.offer || 1099
    }];
    setSavedDomains(updated);
    localStorage.setItem("webzone_saved_domains", JSON.stringify(updated));
    triggerToast(language === "bn" ? `আইডিয়া বুকমার্কে সেভ করা হয়েছে!` : `Domain saved to your persistent ideas!`);
  };

  // Remove saved domain
  const handleRemoveSavedDomain = (domainName: string) => {
    const updated = savedDomains.filter(d => d.name.toLowerCase() !== domainName.toLowerCase());
    setSavedDomains(updated);
    localStorage.setItem("webzone_saved_domains", JSON.stringify(updated));
    triggerToast(language === "bn" ? "ডোমেনটি তালিকা থেকে সরানো হয়েছে" : "Removed domain from saved ideas.");
  };

  // Register domain by redirecting to WHMCS
  const handleRegisterDomainRedirect = (domainName: string) => {
    // Standard Whmcs Cart registration parameters
    const redirectUrl = `https://www.host.webzonebd.com/cart.php?a=add&domain=register&query=${encodeURIComponent(domainName)}`;
    triggerToast(language === "bn" ? "আপনাকে WHMCS সুরক্ষিত পেমেন্ট গেটওয়েতে রিডাইরেক্ট করা হচ্ছে..." : "Configuring WHMCS register cart. Redirecting in seconds...");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  };

  // Dynamic Toggle check list
  const handleToggleExtension = (ext: string) => {
    if (selectedExtensions.includes(ext)) {
      if (selectedExtensions.length === 1) {
        triggerToast("Please select at least one domain extension!");
        return;
      }
      setSelectedExtensions(selectedExtensions.filter(e => e !== ext));
    } else {
      setSelectedExtensions([...selectedExtensions, ext]);
    }
  };

  // WHOIS Mock live query
  const handleWhoisQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whoisQuery) return;
    setIsQueryingWhois(true);
    setWhoisResult(null);

    setTimeout(() => {
      const isTaken = whoisQuery.includes(".com") || whoisQuery.includes(".bd") || whoisQuery.length < 15;
      if (isTaken) {
        setWhoisResult({
          domain: whoisQuery,
          status: "Registered / Active",
          registrar: "WebzoneBD Networks LLC",
          creationDate: "12-Aug-2021",
          expirationDate: "12-Aug-2027",
          nameServers: ["ns1.webzonebd.com", "ns2.webzonebd.com"],
          owner: "Redacted for Privacy Shield LLC"
        });
      } else {
        setWhoisResult({
          domain: whoisQuery,
          status: "Available",
          explanation: "No active DNS nameservers or owner records found."
        });
      }
      setIsQueryingWhois(false);
    }, 1000);
  };

  // DNS Management Actions
  const handleAddDnsRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDnsValue || !newDnsName) {
      triggerToast("Please fill record label and server IP value!");
      return;
    }
    const newRec = {
      id: Date.now(),
      type: newDnsType,
      name: newDnsName,
      value: newDnsValue,
      ttl: 14400
    };
    setDnsRecords([...dnsRecords, newRec]);
    setNewDnsName("");
    setNewDnsValue("");
    triggerToast("DNS record appended successfully inside active nameservers zone!");
  };

  const handleRemoveDnsRecord = (id: number) => {
    setDnsRecords(dnsRecords.filter(r => r.id !== id));
    triggerToast("DNS Record removed safely.");
  };

  // Swappable layout text depending on locale selection
  const dict = {
    en: {
      generatorTitle: "Free AI Domain Name Generator",
      generatorSubtitle: "Use our free AI domain name generator to find unique names for your website or brand, and claim your perfect domain in seconds.",
      placeholderText: "Describe your business, brand, startup, website or project...",
      btnGenerate: "Generate Domain Names",
      styleHeading: "AI Generation Naming Style",
      extHeading: "Target Domain Extensions",
      resultsHeading: "AI Domain Name Results",
      resultsSub: "Verify live registration statuses directly. Click register to link immediately via WebzoneBD.",
      availabilityLabel: "Availability Status",
      alternativeHeader: "Smart Alternative Suggestions",
      dealsHeader: "Active Extension Deals & Discounts",
      conversionHeading: "Need Hosting Too? Save Extra BDT!",
      hostingOnlyBtn: "Register Domain Only",
      hostingBundleBtn: "Register Domain + High-Speed Hosting",
      hostingEmailBtn: "Register Domain + Professional Email G-Suite",
      recentHeader: "Recently Generated Search Clusters",
      trendingHeader: "Trending Tech Extensions & Keywords",
    },
    bn: {
      generatorTitle: "ফ্রি এআই ডোমেন নেম জেনারেটর 🚀",
      generatorSubtitle: "আপনার ব্যবসা বা নতুন ব্র্যান্ডের জন্য সহজে আকর্ষণীয় ইউনিক ডোমেন খুঁজে বের করুন এবং কয়েক সেকেন্ডে তা রেজিস্টার করুন।",
      placeholderText: "আপনার ব্যবসা, স্টার্টআপ, ওয়েবসাইট বা ইউনিক প্রজেক্টের বর্ণনা দিন...",
      btnGenerate: "ডোমেন নাম জেনারেট করুন",
      styleHeading: "এআই জেনারেশন নেমিং স্টাইল",
      extHeading: "ডোমেন এক্সটেনশন নির্বাচন",
      resultsHeading: "এআই জেনারেটেড ডোমেন তালিকা",
      resultsSub: "উচ্চ ক্ষমতাসম্পন্ন এআই দিয়ে জেনারেট করা ডোমেনের বিবরণ। রিয়েলটাইম খালি রয়েছে কি না চেক করে দ্রুত বুক করুন!",
      availabilityLabel: "ডোমেনের বর্তমান நிலை",
      alternativeHeader: "স্মার্ট বিকল্প নামের সাজেশন্স",
      dealsHeader: "অফারে বর্তমান ডোমেন মূল্য তালিকা",
      conversionHeading: "ডোমেনের সাথে কি হাই-স্পিড হোস্টিং লাগবে?",
      hostingOnlyBtn: "শুধু ডোমেন নিব",
      hostingBundleBtn: "ডোমেন + বিডিআইএক্স ক্লাউড হোস্টিং বান্ডেল",
      hostingEmailBtn: "ডোমেন + প্রফেশনাল বিজনেস ইমেইল",
      recentHeader: "সম্প্রতি করা সার্চ হিস্টোরি",
      trendingHeader: "বর্তমানে ট্রেন্ডিং ডোমেন ক্রাইটেরিয়া",
    },
    ar: {
      generatorTitle: "مولد أسماء النطاقات بالذكاء الاصطناعي 🚀",
      generatorSubtitle: "استخدم مولد نطاقات الويب الذكي للبحث عن أسماء نطاقات فريدة ومخصصة لهويتك التجارية وسجلها بأقل من دقيقة.",
      placeholderText: "صف طبيعة عملك، علاماتك التجارية، موقعك الإلكتروني أو خطط مشروعك بالتفصيل...",
      btnGenerate: "توليد نطاقات فريدة 🚀",
      styleHeading: "نمط التسمية الذكية بالذكاء الاصطناعي",
      extHeading: "أبرز الامتدادات المطلوبة للتسجيل",
      resultsHeading: "مقترحات النطاقات المستهدفة",
      resultsSub: "افحص بيانات المالك والاتصال فورياً. احجز النطاق المفضل إليك عبر بوابة التسجيل ويب زون بي دي البنغلاديشية.",
      availabilityLabel: "حالة توافر النطاق",
      alternativeHeader: "مقترحات بديلة متميزة وذكية",
      dealsHeader: "أفضل عروض التسجيل للامتدادات الرائجة",
      conversionHeading: "هل تحتاج استضافة أو سيرفر إلكتروني؟",
      hostingOnlyBtn: "تسجيل النطاق منفرداً فقط",
      hostingBundleBtn: "تسجيل النطاق مع استضافة فائقة السرعة cPanel",
      hostingEmailBtn: "نطاق احترافي مع خدمة بريد الأعمال المخصص",
      recentHeader: "عمليات التوليد والبحث الأخيرة",
      trendingHeader: "الامتدادات الأكثر رواجاً وشهرة بالخليج",
    }
  };

  const pageLangText = dict[language] || dict.en;

  return (
    <div className="bg-[#FAFBFD] dark:bg-[#030712] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans pb-24">
      
      {/* 1. HERO SECTION WITH NEW CUSTOM HOSTINGER STYLING */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#EFF6FF] via-[#FAFBFD] to-white dark:from-[#0B1530] dark:via-[#030712] dark:to-[#030712] border-b border-slate-100 dark:border-slate-800/50">
        <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/5 dark:to-cyan-500/5 opacity-50 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-650 dark:text-cyan-400 font-mono tracking-wider uppercase animate-pulse">
            <Sparkle className="w-4 h-4 text-emerald-500 fill-emerald-500 animate-spin" style={{ animationDuration: "12s" }} />
            <span>{language === "bn" ? "অ্যাডভান্সড এআই ইঞ্জিন চালিত" : "Premium Hostinger-Style AI Generator"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none max-w-4xl mx-auto font-display">
            {pageLangText.generatorTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {pageLangText.generatorSubtitle}
          </p>

          <div id="ai-search-anchor" className="max-w-4xl mx-auto pt-8">
            {/* Swapping Mode Segment Picker */}
            <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-2xl mb-6 max-w-sm mx-auto shadow-inner">
              <button
                type="button"
                onClick={() => setActiveSearchMode("instant")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border-none ${
                  activeSearchMode === "instant"
                    ? "bg-white dark:bg-[#0C1227] text-blue-600 dark:text-cyan-400 shadow-md border border-slate-200/20 dark:border-slate-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 bg-transparent"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "ইনস্ট্যান্ট সার্চ" : "Hostinger Search"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSearchMode("ai")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border-none ${
                  activeSearchMode === "ai"
                    ? "bg-white dark:bg-[#0C1227] text-blue-600 dark:text-cyan-400 shadow-md border border-slate-200/20 dark:border-slate-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 bg-transparent"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "এআই জেনারেটর" : "AI Generator"}</span>
              </button>
            </div>

            <div className="relative p-3 bg-white dark:bg-[#0C1227] backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl focus-within:ring-2 focus-within:ring-emerald-500/40 transition-all duration-300">
              
              {activeSearchMode === "instant" ? (
                /* Hostinger-Style Instant Search Form */
                <form onSubmit={handleInstantDomainSearch} className="space-y-4">
                  <div className="relative flex items-center">
                    <Globe className="absolute left-4 text-blue-500 w-5 h-5 animate-pulse" />
                    <input
                      type="text"
                      placeholder={language === "bn" ? "আপনার পছন্দের ডোমেন নামটি খুঁজুন (যেমন: mybrand.com)..." : "Search your perfect domain with extensions (e.g. mybrand.com)..."}
                      value={instantSearchQuery}
                      onChange={(e) => setInstantSearchQuery(e.target.value)}
                      className="w-full bg-transparent pl-12 pr-4 py-4 text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none border-none"
                    />
                  </div>

                  {/* Preloaded suggestion examples row for Instant Mode */}
                  <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">{language === "bn" ? "ইউনিক আইডিয়া:" : "Try Examples:"}</span>
                    {[
                      "hostingerpro.com",
                      "dhakaitlabs.net",
                      "riyadhshop.xyz",
                      "cloudservers.io",
                      "bdfastnet.com",
                    ].map((exName, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInstantSearchQuery(exName)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 active:scale-95 transition cursor-pointer"
                      >
                        {exName}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isInstantSearching || !instantSearchQuery.trim()}
                      className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/10 cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 border-none"
                    >
                      {isInstantSearching ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>{language === "bn" ? "সার্চ হচ্ছে..." : "Searching WHOIS Registry..."}</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          <span>{language === "bn" ? "ডোমেন চেক করুন" : "Search Domain"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Sleek AI Domain Generator Form */
                <form onSubmit={handleGenerateDomains} className="space-y-4">
                  <div className="relative flex items-center">
                    <Sparkles className="absolute left-4 text-emerald-500 w-5 h-5" />
                    <textarea
                      rows={2}
                      placeholder={pageLangText.placeholderText}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-transparent pl-12 pr-4 py-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none border-none"
                    />
                  </div>

                  {/* Preconfigured Examples Buttons Row */}
                  <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">{language === "bn" ? "প্রম্পট উদাহরণ:" : "Try Examples:"}</span>
                    {[
                      { label: language === "bn" ? "ওয়েব হোস্টিং কোম্পানি" : "Web Hosting Company", desc: "Premium cloud web hosting company offering global servers and domains support", style: "Tech" },
                      { label: language === "bn" ? "ডিজিটাল এজেন্সি" : "Digital Marketing Agency", desc: "Digital design, social SEO optimization, and premium media marketing group", style: "Startup" },
                      { label: language === "bn" ? "রিয়াদ রেস্টুরেন্ট" : "Restaurant in Riyadh", desc: "Elegant authentic Arabic hospitality and luxury dining outlet in Riyadh center", style: "Local Business" },
                      { label: language === "bn" ? "ই-কমার্স স্টোর" : "E-commerce Store", desc: "Handcrafted boutique fashion products and sustainable accessories eShop", style: "E-commerce" },
                      { label: language === "bn" ? "আইটি সলিউশন" : "IT Solution Company", desc: "Enterprise cloud engineering, high performance database administration and software", style: "Professional" }
                    ].map((ex, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handlePresetFill(ex.desc, ex.style)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 active:scale-95 transition cursor-pointer"
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>

                  {/* AI Configuration Area (Naming Style & TLD Selectors) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    {/* Option 1: AI Naming style */}
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider font-mono block">
                        {pageLangText.styleHeading}
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {["Brandable", "Professional", "Startup", "Tech", "Premium", "Creative", "Local Business", "E-commerce" ].map((style) => (
                          <label
                            key={style}
                            className={`px-2 py-1.5 rounded-lg border text-[10.5px] font-bold text-center cursor-pointer transition active:scale-95 select-none ${
                              namingStyle === style
                                ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-cyan-400 font-extrabold"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name="namingStyle"
                              value={style}
                              checked={namingStyle === style}
                              onChange={() => setNamingStyle(style)}
                              className="hidden"
                            />
                            {style}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Option 2: Domain Extensions selectors Checkbox List */}
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider font-mono block">
                        {pageLangText.extHeading}
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                        {pricingDataBDT.map((p) => {
                          const isSelected = selectedExtensions.includes(p.ext);
                          return (
                            <div
                              key={p.ext}
                              onClick={() => handleToggleExtension(p.ext)}
                              className={`p-1 rounded-lg border text-center cursor-pointer text-[10.5px] font-bold uppercase transition select-none tracking-tight ${
                                isSelected
                                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              <div>{p.ext}</div>
                              {p.isHot && <span className="text-[7.5px] font-mono text-emerald-500 dark:text-emerald-400 uppercase font-bold leading-none block">HOT</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Generate Core CTA button */}
                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/10 hover:shadow-emerald-500/10 cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 border-none"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>{language === "bn" ? "আপনার জন্য ডোমেন ওহী জেনারেট হচ্ছে..." : "AI Engine Analyzing & Creating suggestions..."}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-white text-yellow-300" />
                          <span>{pageLangText.btnGenerate}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Hostinger-Style Instant Search Results Section */}
            {activeSearchMode === "instant" && instantSearchResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6 text-left"
              >
                {/* Primary searched domain spotlight banner */}
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative ${
                  instantSearchResult.isAvailable
                    ? "bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500/20"
                    : "bg-rose-500/5 dark:bg-rose-500/5 border-rose-500/20"
                }`}>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white font-mono tracking-tight">{instantSearchResult.name}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest ${
                        instantSearchResult.isAvailable
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-455"
                      }`}>
                        {instantSearchResult.isAvailable ? (language === "bn" ? "✅ বুকিংয়ের জন্য খালি আছে" : "✅ Available") : (language === "bn" ? "❌ অলরেডি রেজিস্টার্ড" : "❌ Taken")}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                      {instantSearchResult.isAvailable
                        ? (language === "bn" ? "অভিনন্দন! আপনার পছন্দের ডোমেনটি খালি আছে। এখনই সর্বোচ্চ গতিসম্পন্ন এন্টারপ্রাইজ সার্ভারে রেজিস্টার করুন।" : "Perfect! This domain name is fully available for registry and standard deployment. Secure it immediately.")
                        : (language === "bn" ? "দুঃখিত! এই ডোমেনটি অলরেডি রেজিস্টার্ড হয়ে গেছে। আমরা আপনার জন্য কিছু চমৎকার বিকল্প খুঁজে পেয়েছি নিচে দেখুন।" : "Apologies! This domain represents an active registry or is unavailable. Consider taking our suggested alternatives below.")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 pt-4 md:pt-0 shrink-0">
                    {instantSearchResult.isAvailable && (
                      <div className="text-right">
                        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase leading-none block">{language === "bn" ? "অফারে মূল্য" : "Promo Price"}</span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-500 leading-none">{convertAndFormatVal(instantSearchResult.priceBDT)}</span>
                      </div>
                    )}
                    
                    {instantSearchResult.isAvailable ? (
                      <button
                        onClick={() => handleRegisterDomainRedirect(instantSearchResult.name)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-mono text-xs font-bold rounded-xl text-center hover:opacity-90 active:scale-[0.98] transition border-none cursor-pointer shadow-lg shadow-blue-500/10"
                      >
                        {language === "bn" ? "কিনুন 🛒" : "Buy It Now 🛒"}
                      </button>
                    ) : (
                      <a
                        href={`https://wa.me/966570511931?text=Hello+WebzoneBD+I+would+like+to+inquire+about+the+domain+whois+of+${instantSearchResult.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        {language === "bn" ? "ডোমেন মালিকের তথ্য" : "Inquire WHOIS"}
                      </a>
                    )}
                  </div>
                </div>

                {/* Grid of alternatives extensions */}
                {instantAlternatives.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <span>{language === "bn" ? "অন্যান্য জনপ্রিয় ডোমেন সলিউশন:" : "Popular recommended alternate TLDs:"}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {instantAlternatives.map((altItem) => (
                        <div
                          key={altItem.name}
                          className="p-5 bg-white dark:bg-[#0A0D1E] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-300 flex items-center justify-between gap-4 shadow-sm"
                        >
                          <div className="space-y-1">
                            <span className="font-mono text-sm sm:text-base font-bold text-slate-800 dark:text-white">{altItem.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-extrabold uppercase ${
                                altItem.isAvailable ? "text-emerald-500" : "text-rose-500"
                              }`}>
                                {altItem.isAvailable ? (language === "bn" ? "অবশিষ্ট" : "Available") : (language === "bn" ? "গৃহীত" : "Taken")}
                              </span>
                              {altItem.isAvailable && (
                                <span className="text-[10.5px] font-black text-emerald-500 font-mono">
                                  {convertAndFormatVal(altItem.priceBDT)}
                                </span>
                              )}
                            </div>
                          </div>

                          {altItem.isAvailable ? (
                            <button
                              onClick={() => handleRegisterDomainRedirect(altItem.name)}
                              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-cyan-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-mono text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 cursor-pointer"
                            >
                              <span>{language === "bn" ? "বুক করুন" : "Register"}</span>
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs font-bold font-mono">N/A</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC GENERATED DOMAIN RESULTS SECTION */}
      <AnimatePresence>
        {isGenerating && (
          <div className="max-w-4xl mx-auto px-4 pt-12 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Cpu className="w-8 h-8 text-blue-500 animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <h3 className="text-lg font-bold font-display">{language === "bn" ? "এআই পরামর্শ তৈরি করছে..." : "AI Brand Manager is working..."}</h3>
            <div className="w-full max-w-sm bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full animate-pulse-slow w-4/5 rounded-full" />
            </div>
            <p className="text-xs text-slate-400 font-mono">Selecting patterns for: style={namingStyle}</p>
          </div>
        )}

        {hasGenerated && (
          <section id="ai-generator-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
                  <span>{pageLangText.resultsHeading}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {pageLangText.resultsSub}
                </p>
              </div>

              {/* Saved Ideas count indicator */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">Generated: {suggestions.length} items</span>
                <span className="px-3 py-1 bg-emerald-550/10 border border-emerald-550/20 rounded-full text-xs font-bold text-emerald-650 dark:text-emerald-450">
                  Style: {namingStyle}
                </span>
              </div>
            </div>

            {/* SUGGESTIONS CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((item, idx) => {
                const checkedState = checkedStatusMap[item.name];
                const cleanExt = item.extension?.toLowerCase() || ".com";
                const isCheckLoading = checkedState?.loading;
                const availabilityChecked = checkedState !== undefined && !isCheckLoading;
                const isAvailable = checkedState?.isAvailable;

                // Match price BDT from extension
                const pricingItem = pricingDataBDT.find(p => p.ext === cleanExt);
                const offerBDT = pricingItem ? pricingItem.offer : 1099;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="p-6 bg-white dark:bg-[#0A0D1E] rounded-3xl border border-slate-200 dark:border-slate-850 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-blue-500/40 hover:-translate-y-1.5 transition-allDuration duration-300"
                  >
                    <div>
                      {/* Metric scores top badge strip */}
                      <div className="flex items-center justify-between gap-1 mb-4 flex-wrap">
                        <span className="uppercase text-[9px] font-black font-mono tracking-widest text-slate-400">
                          {item.extension}
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-[9px] font-mono rounded text-indigo-600 dark:text-cyan-450 font-bold">
                            LEN: {item.lengthScore}
                          </span>
                          <span className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-[9px] font-mono rounded text-amber-600 dark:text-amber-450 font-semibold" title="Brandability Index">
                            BRAND: {item.brandabilityScore}%
                          </span>
                          <span className="px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/20 text-[9px] font-mono rounded text-teal-600 dark:text-teal-400 font-bold" title="Search Engine Optimized score">
                            SEO: {item.seoScore}
                          </span>
                        </div>
                      </div>

                      {/* Suggested Name Title */}
                      <h3 className="text-xl font-black font-mono tracking-tight text-slate-900 dark:text-white break-words">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 leading-relaxed italic">
                        "{item.explanation || "No explanation provided"}"
                      </p>
                    </div>

                    {/* Verification & registration integration footer */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                      
                      {/* Live Domain Status Checker Box */}
                      <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                        <span className="text-[10px] font-bold text-slate-450 font-mono tracking-wider uppercase">
                          {pageLangText.availabilityLabel}
                        </span>

                        {!availabilityChecked ? (
                          <button
                            onClick={() => checkSingleDomainLive(item.name)}
                            disabled={isCheckLoading}
                            className="px-2.5 py-1 text-[10px] font-mono font-black text-blue-500 hover:text-white bg-blue-500/10 hover:bg-blue-600 rounded-lg transition active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer border-none"
                          >
                            {isCheckLoading ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Search className="w-3 h-3" />
                            )}
                            {isCheckLoading ? "Resolving DNS..." : "Scan Status"}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] font-extrabold shrink-0">
                            {isAvailable ? (
                              <span className="text-emerald-555 dark:text-emerald-400 flex items-center gap-0.5 font-sans font-black">
                                ✅ Available
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-455 flex items-center gap-0.5 font-sans font-black">
                                ❌ Registered
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Decision CTA Buttons */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {availabilityChecked && isAvailable && (
                          <div className="text-left">
                            <span className="text-[9px] font-mono text-slate-400 uppercase leading-none block">Promo Price</span>
                            <span className="text-base font-black text-emerald-500 leading-none">{convertAndFormatVal(offerBDT)}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 w-full justify-between">
                          {availabilityChecked && !isAvailable ? (
                            <button
                              onClick={() => {
                                triggerToast(`Opening alternatives for ${item.name}...`);
                                if (activeAlternativesDomain === item.name) {
                                  setActiveAlternativesDomain(null);
                                } else {
                                  setActiveAlternativesDomain(item.name);
                                }
                              }}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 hover:text-slate-900 text-slate-650 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                            >
                              Alternatives ⚡
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegisterDomainRedirect(item.name)}
                              className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-mono text-xs font-bold rounded-xl text-center hover:opacity-90 active:scale-[0.98] transition shadow-md border-none cursor-pointer"
                            >
                              Register Now 🛒
                            </button>
                          )}

                          <button
                            onClick={() => handleSaveDomainIdea(item)}
                            className="p-2 bg-slate-50 dark:bg-slate-900 outline-none hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                            title="Save Idea"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Smart Suffix Alternatives Sub-drawer */}
                      {activeAlternativesDomain === item.name && (
                        <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2 mt-2">
                          <span className="text-[9.5px] font-mono font-black text-blue-500 tracking-wider uppercase block">
                            {pageLangText.alternativeHeader}
                          </span>
                          <div className="grid grid-cols-1 gap-1.5 text-left">
                            {[
                              `get${item.name}`,
                              `my${item.name}`,
                              `${item.name.replace(cleanExt, "pro")}${cleanExt}`,
                              `${item.name.replace(cleanExt, "hub")}${cleanExt}`,
                              `${item.name.replace(cleanExt, "online")}${cleanExt}`,
                              `try${item.name}`
                            ].map((alt) => (
                              <div key={alt} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-100 dark:border-slate-800/40">
                                <span className="text-slate-800 dark:text-slate-200">{alt}</span>
                                <button
                                  onClick={() => handleRegisterDomainRedirect(alt)}
                                  className="text-[10px] font-extrabold text-emerald-500 hover:underline cursor-pointer bg-transparent border-none"
                                >
                                  Register 🚀
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* 3. AI INTEGRATED BRAND SUITE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-slate-50 dark:bg-[#070B19]/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-4">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Integrated AI Brand Preset Suites</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need inspiration? Inject any of our pre-conceived business domains to kickstart specialized AI generations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6 text-left">
            {[
              {
                title: "AI Business Name",
                desc: "Premium highly recognizable retail and corporate hub identities",
                p: "Web hosting startup providing blazing-fast infrastructure around Bangladesh and international nodes"
              },
              {
                title: "AI Company Name",
                desc: "Corporate structural company name ideas using formal roots",
                p: "Venture group backing next-generation algorithmic cloud SaaS builders"
              },
              {
                title: "AI Startup Name",
                desc: "Minimalist modern tech and Silicon Valley style startup words",
                p: "Mobile application checking real-time public transit routes and bus availability using crowdsourced telemetry"
              },
              {
                title: "AI Brand Name",
                desc: "Creative brand words that roll off the tongue perfectly",
                p: "Luxury organic tea farming collective shipping fresh leaves worldwide"
              },
              {
                title: "AI Slogan Generator",
                desc: "Punchy, catchy, memorable brand slogans and marketing catchphrases",
                p: "Supercharge your website loading speed and DNS performance tracking"
              },
              {
                title: "AI Logo Generator",
                desc: "Visualize and prompt abstract custom logo ideas",
                p: "Clean minimalist tech logo featuring a spinning galaxy vector combined with cPanel server database layout"
              }
            ].map((suiteItem, ind) => (
              <button
                key={ind}
                onClick={() => {
                  handlePresetFill(suiteItem.p, "Creative");
                  triggerToast(`AI Suite tool active: [${suiteItem.title}] prompt injected!`);
                }}
                className="p-5 bg-white dark:bg-[#0C1227]/90 hover:bg-slate-50 dark:hover:bg-indigo-950/20 rounded-2xl border border-slate-150 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-505 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                    {suiteItem.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2">
                    {suiteItem.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-blue-500 uppercase font-mono group-hover:translate-x-1 transition leading-none">
                  <span>Activate</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONVERSION HOOKS SECTION ("Need Hosting Too?") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            {pageLangText.conversionHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {language === "bn"
              ? "ডোমেন বুকিং এর সময় হোস্টিং যুক্ত করে প্রথম বছরে সেভ করুন অতিরিক্ত ৩০% পর্যন্ত ডাইরেক্ট ডিসকাউন্ট!"
              : "Claim first-year promo server and cPanel package models. Consolidate your server and name together."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Register Domain Only",
              subtitle: "For domain parking or future security setups",
              features: ["100% Full ownership logs", "Dynamic DNS configuration zone", "Free SSL certificate included", "WHOIS privacy protection layer"],
              price: "৳1,099",
              isPopular: false,
              action: () => {
                const el = document.getElementById("ai-search-anchor");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                triggerToast("Scroll to search your brand!");
              }
            },
            {
              title: "Register Domain + High-Speed Hosting",
              subtitle: "The choice of BDIX and speed-conscious developers",
              features: ["5GB Blazing-fast NVMe SSD storage", "Unlimited BDIX ultra speed router connectivity", "Free Domain configuration included", "Lifetime cPanel access & auto installers"],
              price: "৳1,999/yr",
              isPopular: true,
              action: () => {
                const hostProduct: Product = {
                  id: "hosting-business-bdix-bundle",
                  name: "BDIX High-Speed Enterprise Host + Domain Bundle",
                  nameBn: "বিডিআইএক্স হাই-স্পিড ৩জিবি হোস্টিং + ডোমেন বান্ডেল",
                  nameAr: "باقة استضافة فائقة السرعة مع نطاق مجاني كامل",
                  category: "source",
                  price: 1999 / bdtRate,
                  discountPrice: 1999 / bdtRate,
                  rating: 5.0,
                  reviewsCount: 22,
                  image: "https://images.unsplash.com/photo-1558444949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
                  description: "Professional WebzoneBD NVMe hosting package optimized with BDIX country-level routing.",
                  descriptionBn: "ওয়েবজোনবিডি বিশেষ হাই-স্পিড শেয়ার্ড বিডিআইএক্স হোস্টিং ও সম্পূর্ণ ডোমেন বান্ডেল অফার।",
                  descriptionAr: "باقة استضافة فائقة السرعة BDIX مع لوحة تحكم ونطاق ويب مجاني دائم لشركتك.",
                  features: ["5GB NVMe SSD Storage", "Free Dynamic .COM Setup", "cPanel Enterprise License Enabled", "24/7 Telephone priority helpline"],
                  featuresBn: ["৫জিবি এসএসডি স্টোরেজ", "ফ্রি ডোমেন সেটআপ", "সিপ্যানেল লাইসেন্স সাপোর্টেড", "২৪/৭ হেল্পলাইন"],
                  featuresAr: ["مساحة تخزين 5 جيجابايت NVMe SSD", "تثبيت مجاني للنطاق المفضل", "لوحة تحكم cPanel مجهزة بالكامل", "دعم مخصص 24/7"],
                  demoUrl: "#",
                  downloadUrl: "#",
                  tags: ["Bundle", "BDIX", "NVMe"],
                  views: 120
                };
                addToCart(hostProduct);
                triggerToast("Blazing fast NVMe Hosting + Free Domain added to your shopping cart!");
              }
            },
            {
              title: "Register Domain + Business Email Suite",
              subtitle: "Construct custom premium G-Suite matching your extensions",
              features: ["5 Professional custom address handles", "SPAM protection algorithms", "Includes standard .COM name reservation", "Priority 24/7 client ticket resolution support"],
              price: "৳1,499/yr",
              isPopular: false,
              action: () => {
                const mailProduct: Product = {
                  id: "business-email-gsuite-bundle",
                  name: "Corporate Professional Email Suite + Domain",
                  nameBn: "কর্পোরেট বিজনেস ইমেল স্যুট + ফ্রি ডোমেন",
                  nameAr: "بريد الأعمال الفاخر مع حجز نطاق كوم لإدارة شركتك",
                  category: "source",
                  price: 1499 / bdtRate,
                  discountPrice: 1499 / bdtRate,
                  rating: 4.8,
                  reviewsCount: 9,
                  image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=400&q=80",
                  description: "Custom spam-guarded business emails integrated securely with your registered domain.",
                  descriptionBn: "আপনার নিজস্ব ডোমেনের সাথে যুক্ত প্রিমিয়াম কর্পোরেট বিজনেস ইমেইল সমাধান।",
                  descriptionAr: "حسابات بريد إلكتروني مخصصة ومحمية بالكامل متصلة مباشرة بنطاق شركتك.",
                  features: ["5 Custom Professional Email Addresses", "Spam guard protection active", "Free Domain configuration included", "IMAP/POP3 cPanel mail routing console"],
                  featuresBn: ["৫টি প্রফেশনাল বিজনেস ইমেল অ্যাক্সেস", "অ্যাডভান্সড স্প্যাম প্রটেকশন", "ফ্রি ইমেইল ক্লায়েন্ট সেটআপ", "আইম্যাপ এবং পপ৩ সমর্থন প্যানেল"],
                  featuresAr: ["5 عناوين بريد إلكتروني احترافية مخصصة", "نظام حماية نشط ضد السبام والرسائل الضارة", "تضمين كامل لإعدادات النطاق", "لوحة تحكم إرسال متكاملة IMAP/POP3"],
                  demoUrl: "#",
                  downloadUrl: "#",
                  tags: ["Business Email", "Corporate"],
                  views: 45
                };
                addToCart(mailProduct);
                triggerToast("Corporate Email Suite added to your shopping cart!");
              }
            }
          ].map((pkg, i) => (
            <div
              key={i}
              className={`p-8 bg-white dark:bg-[#0A0D1E] rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${
                pkg.isPopular
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xl"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 transform translate-y-3 -translate-x-3 bg-emerald-550 dark:bg-emerald-600 text-white font-mono text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                  Recommended Bundle
                </div>
              )}

              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {pkg.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {pkg.subtitle}
                </p>

                <div className="mt-6 space-y-2 text-left">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <Check className="w-4 h-4 text-emerald-550 shrink-0" />
                      <span className="text-slate-650 dark:text-slate-350">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">First-Year Promo</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{pkg.price}</span>
                </div>

                <button
                  onClick={pkg.action}
                  className="px-5 py-2.5 bg-slate-900 dark:bg-slate-805 hover:bg-slate-800 dark:hover:bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer transition active:scale-95 border-none shadow-md"
                >
                  Configure Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE CLIENT DASHBOARD WITH MOCK DNS AND SAVED IDEAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="bg-white dark:bg-[#070B19] rounded-3xl border border-slate-200 dark:border-slate-850 shadow-2xl p-6 md:p-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-8 gap-4">
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                <span>{language === "bn" ? "ডোমেন ড্যাশবোর্ড ও ক্লায়েন্ট পোর্টাল" : "Domain Dashboard Integration"}</span>
              </h2>
              <p className="text-xs text-slate-455 dark:text-slate-400 mt-1">
                {language === "bn" ? "আপনার সংরক্ষিত ডোমেন আইডিয়া, DNS রেকর্ড এবং লাইভ WHOIS তথ্য এক প্যানেলে কন্ট্রোল করুন।" : "Manage your favorited ideas, active DNS mappings, and direct WHOIS lookups."}
              </p>
            </div>

            {/* Dashboard tabs switcher buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { tab: "saved", label: language === "bn" ? "সংরক্ষিত আইডিয়া" : "Saved Ideas", icon: Bookmark },
                { tab: "purchased", label: language === "bn" ? "নিবন্ধিত ডোমেন" : "Active Domains", icon: Globe },
                { tab: "dns", label: "DNS Console", icon: Terminal },
                { tab: "whois", label: "WHOIS Lookup", icon: Search },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = dashboardTab === t.tab;
                return (
                  <button
                    key={t.tab}
                    onClick={() => setDashboardTab(t.tab as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 select-none ${
                      isActive
                        ? "bg-blue-500 text-white shadow"
                        : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: SAVED IDEAS PANEL */}
          {dashboardTab === "saved" && (
            <div className="space-y-4">
              {savedDomains.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-150 dark:border-slate-800 rounded-3xl bg-slate-50/40 dark:bg-slate-900/10">
                  <Bookmark className="w-8 h-8 mx-auto text-slate-350" />
                  <p className="text-xs font-semibold">{language === "bn" ? "কোন সংরক্ষিত ডোমেন আইডিয়া নেই।" : "No domain name ideas favorited yet."}</p>
                  <p className="text-[10px] text-slate-400">Describe your project above and save items directly using the bookmark icon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  {savedDomains.map((item, i) => (
                    <div
                      key={item.name}
                      className="p-5 bg-[#FAFBFD] dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 font-mono">Added: {item.savedAt}</span>
                        <button
                          onClick={() => handleRemoveSavedDomain(item.name)}
                          className="p-1 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 rounded-lg transition"
                          title="Delete Idea"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-base font-black font-mono text-slate-900 dark:text-white leading-tight">
                        {item.name}
                      </h4>

                      <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                        <span className="text-xs font-mono text-emerald-550 font-bold">{convertAndFormatVal(item.priceBDT)}</span>
                        <button
                          onClick={() => handleRegisterDomainRedirect(item.name)}
                          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10.5px] rounded-lg transition active:scale-95"
                        >
                          Register 🚀
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REGISTERED DOMAINS & RENEWAL REMINDER */}
          {dashboardTab === "purchased" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800/40 space-y-4">
                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Active Registrations</span>
                
                {[
                  { domain: "webzonebd.com", ns: ["ns1.webzonebd.com", "ns2.webzonebd.com"], renewal: "12-Aug-2026", status: "Active" },
                  { domain: "mycreativecompany.net", ns: ["ns1.webzonebd.com", "ns2.webzonebd.com"], renewal: "24-Oct-2026", status: "Active" }
                ].map((act, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-[#0A0D1E] rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">{act.domain}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-600 dark:text-emerald-450 uppercase">{act.status}</span>
                    </div>

                    <div className="text-[10.5px] text-slate-400 space-y-1">
                      <p>Nameservers: {act.ns.join(", ")}</p>
                      <p>Renewal target Date: <span className="font-mono text-blue-500 font-bold">{act.renewal}</span></p>
                    </div>
                    
                    <div className="pt-2 flex justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setDnsDomain(act.domain);
                          setDashboardTab("dns");
                          triggerToast(`Switched DNS console view pointer to [${act.domain}]!`);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition"
                      >
                        Edit Zonemapping
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* RENEWAL COUNTDOWN TIMER WIDGET */}
              <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-amber-600 uppercase font-mono tracking-wider">Fast renewal warning</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-snug">
                    webzonebd.com expires in <span className="text-amber-500 text-xl font-mono">68 days</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Maintain corporate identity securely to prevent competitor sniping. Set up automatic renewal or process with WHMCS immediate checkout.
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Flat Rate</span>
                    <span className="text-lg font-black text-slate-950 dark:text-white font-mono">৳1,699</span>
                  </div>
                  <button
                    onClick={() => handleRegisterDomainRedirect("webzonebd.com")}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer border-none"
                  >
                    Process Renewal ⏳
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOCK cPANEL DNS ZONE CONSOLE */}
          {dashboardTab === "dns" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/65">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Zone Pointer:</span>
                  <span className="text-sm font-mono font-extrabold text-blue-500 dark:text-cyan-400 bg-white dark:bg-slate-950 border border-slate-150 px-2 py-0.5 rounded-lg">{dnsDomain}</span>
                </div>
                <div className="text-[10px] text-slate-400 italic">cPanel DNS preservation records system</div>
              </div>

              {/* Records List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Value</th>
                      <th className="py-2 px-3">TTL</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/40 dark:hover:bg-slate-900/30">
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 bg-blue-500/10 rounded text-[10px] font-extrabold text-blue-500">{r.type}</span>
                        </td>
                        <td className="py-2.5 px-3">{r.name}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-850 dark:text-neutral-200">{r.value}</td>
                        <td className="py-2.5 px-3 text-slate-400">{r.ttl}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleRemoveDnsRecord(r.id)}
                            className="p-1 hover:bg-rose-500/10 text-rose-500 rounded-lg transition border-none cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Record Form */}
              <form onSubmit={handleAddDnsRecord} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/40 space-y-3">
                <span className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider">Add DNS record</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-1">Type</label>
                    <select
                      value={newDnsType}
                      onChange={(e) => setNewDnsType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer select-none"
                    >
                      <option value="A">A (IP Address)</option>
                      <option value="CNAME">CNAME (Alias)</option>
                      <option value="MX">MX (Mail routing)</option>
                      <option value="TXT">TXT (Verification)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-1">Host/Name</label>
                    <input
                      type="text"
                      placeholder="@ or www"
                      value={newDnsName}
                      onChange={(e) => setNewDnsName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[9px] uppercase font-bold text-slate-400 font-mono block mb-1">IP Value / Target address</label>
                    <input
                      type="text"
                      placeholder="182.160.99.14 or dynamic domain target"
                      value={newDnsValue}
                      onChange={(e) => setNewDnsValue(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-blue-600 transition active:scale-95 border-none"
                  >
                    Add record Zone
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: LIVE WHOIS LOOKUP CONSOLE */}
          {dashboardTab === "whois" && (
            <div className="space-y-6 text-left">
              <form onSubmit={handleWhoisQuery} className="max-w-xl flex items-stretch gap-2.5">
                <input
                  type="text"
                  placeholder="Query registrar... e.g. webzonebd.com"
                  value={whoisQuery}
                  onChange={(e) => setWhoisQuery(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs focus:outline-none text-slate-900 dark:text-white font-mono font-semibold"
                />
                <button
                  type="submit"
                  disabled={isQueryingWhois}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-[#1E293B] text-white text-xs font-black rounded-2xl transition cursor-pointer"
                >
                  {isQueryingWhois ? "Lookup..." : "Consult WHOIS"}
                </button>
              </form>

              <AnimatePresence>
                {whoisResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800/40 text-xs font-mono space-y-3"
                  >
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Consolidated WHOIS server response</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 dark:text-zinc-200">
                      <p><span className="text-slate-450 uppercase">Domain Prefix:</span> {whoisResult.domain}</p>
                      <p><span className="text-slate-450 uppercase">Status:</span> <span className="text-blue-500 font-extrabold">{whoisResult.status}</span></p>
                      {whoisResult.registrar && (
                        <>
                          <p><span className="text-slate-450 uppercase">Registrar:</span> {whoisResult.registrar}</p>
                          <p><span className="text-slate-450 uppercase">Creation target:</span> {whoisResult.creationDate}</p>
                          <p><span className="text-slate-450 uppercase">Expiry target:</span> {whoisResult.expirationDate}</p>
                          <p><span className="text-slate-450 uppercase">Database Owner:</span> {whoisResult.owner}</p>
                          <p className="col-span-2"><span className="text-slate-450 uppercase">Active Nameservers:</span> {whoisResult.nameServers?.join(", ")}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </section>

      {/* 6. ADMIN DASHBOARD CONFIGURATION DRAWER (Toggled by user / hidden by default) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex justify-center">
        <button
          onClick={() => {
            setShowAdminConfig(!showAdminConfig);
            if (!showAdminConfig) {
              setDomainAdminError("");
            }
          }}
          className={`px-5 py-2.5 font-mono text-[11px] font-black tracking-wider uppercase rounded-full cursor-pointer transition-all duration-300 border flex items-center gap-2 ${
            showAdminConfig 
              ? "bg-red-500/10 hover:bg-red-500/15 border-red-500/20 text-red-500 shadow-md shadow-red-500/5" 
              : "bg-slate-205/30 hover:bg-slate-200/50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 shadow-sm"
          }`}
        >
          <span>🛡️ {showAdminConfig ? "Hide System Admin panel" : "Access System Admin Settings"}</span>
          {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
        </button>
      </section>

      <AnimatePresence>
        {showAdminConfig && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-12 text-left overflow-hidden"
          >
            {isAdmin ? (
              /* IF LOGGED IN: Show Administrative Control Console */
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-300">
                
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-505 bg-indigo-500/10 text-indigo-500 rounded-xl">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Administrative Control Console (WHMCS + Prompt Management)</span>
                      </h3>
                      <p className="text-[10px] uppercase font-mono text-emerald-500 font-bold block mt-0.5 tracking-wider">
                        ✓ SECURE SESSION AUTHENTICATED
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Admin signout */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-705 dark:text-slate-300 block">Super Admin Root</span>
                      <span className="text-[10px] text-slate-450 font-mono">admin@webzonebd.com</span>
                    </div>
                    <button
                      onClick={() => {
                        if (setUser) setUser(null);
                        if (setIsAdmin) setIsAdmin(false);
                        triggerToast("Logged out from admin configuration dashboard.");
                      }}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-305 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-xl transition cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Grid configs items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Prompt Template setup */}
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase font-mono text-slate-455 block">AI Prompt Guidelines Template</label>
                    <textarea
                      rows={3}
                      value={adminPromptTemplate}
                      onChange={(e) => setAdminPromptTemplate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  {/* API and coupon config */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold uppercase font-mono text-slate-455 block">WHMCS Checker Target URL</label>
                        <input
                          type="text"
                          value={adminWhmcsUrl}
                          onChange={(e) => setAdminWhmcsUrl(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold uppercase font-mono text-slate-450 block">Active promotion code</label>
                        <input
                          type="text"
                          value={adminActivePromo}
                          onChange={(e) => setAdminActivePromo(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold uppercase font-mono text-slate-455 block">Manage Active Extension TLD lists</label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {adminExtensions.map((e) => (
                          <span key={e} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10.5px] font-mono font-bold uppercase">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics report */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block font-bold">Live Generation Analytics & Conversion Metrics</span>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {[
                      { label: "Most Generated domain types", val: ".com (74%)", color: "text-blue-500" },
                      { label: "Most Registered Extensions", val: ".xyz / .com.bd", color: "text-emerald-500" },
                      { label: "Top Prompt Keyword Focus", val: "E-commerce Agency", color: "text-amber-500" },
                      { label: "WHMCS Conversion Rate", val: "14.28% checkout sync", color: "text-pink-500" },
                    ].map((an, ind) => (
                      <div key={ind} className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tight block">{an.label}</span>
                        <span className={`text-sm font-black font-mono mt-1 block ${an.color}`}>{an.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* IF NOT LOGGED IN: Show Secure Login Form */
              <div className="max-w-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-200">
                
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                    <Terminal className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-base font-black font-mono text-slate-900 dark:text-white">Admin Authorization Challenge</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                    This administrative sector requires secure admin privileges to access internal WHMCS assets and AI weights. 
                  </p>
                </div>

                {domainAdminError && (
                  <div className="p-3 bg-rose-500/10 border-l-4 border-rose-500 text-rose-500 text-xs font-semibold rounded-r">
                    {domainAdminError}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!domainAdminEmail || !domainAdminPassword) {
                      setDomainAdminError("Please fill in both email and password registers.");
                      return;
                    }
                    if (domainAdminEmail === "admin@webzonebd.com" && domainAdminPassword === "admin123") {
                      const adminUserSession = {
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
                      } as any;
                      if (setUser) setUser(adminUserSession);
                      if (setIsAdmin) setIsAdmin(true);
                      setDomainAdminError("");
                      triggerToast("Registered system admin panel logged in!");
                    } else {
                      setDomainAdminError("Incorrect admin credentials. Hint: use admin@webzonebd.com / admin123");
                    }
                  }}
                  className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 block">Admin Email Address</label>
                    <input
                      type="email"
                      required
                      value={domainAdminEmail}
                      onChange={(e) => setDomainAdminEmail(e.target.value)}
                      placeholder="admin@webzonebd.com"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 block">Password Pin Secret</label>
                    <input
                      type="password"
                      required
                      value={domainAdminPassword}
                      onChange={(e) => setDomainAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-lg cursor-pointer"
                  >
                    Authenticate Console
                  </button>
                </form>

              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

    </div>
  );
}
