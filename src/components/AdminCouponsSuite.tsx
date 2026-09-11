import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Award, Plus, Edit3, Trash2, Copy, Check, FileText, Download, Calendar, 
  TrendingUp, Users, DollarSign, RefreshCw, Layers, ShieldAlert, Zap, 
  Upload, Search, Filter, Play, Power, CheckSquare, Sparkles, Image as ImageIcon,
  ChevronDown, Settings as SettingsIcon, AlertCircle, Eye, RefreshCw as LoopIcon,
  BarChart3, PieChart as PieIcon, LineChart as LineIcon, Printer, CheckCircle2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar 
} from 'recharts';
import { Coupon, Language } from '../types';

interface AdminCouponsSuiteProps {
  coupons: Coupon[];
  addNewCoupon: (coupon: Coupon) => void;
  updateCoupon?: (code: string, updatedCoupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  triggerToast: (msg: string) => void;
  isDark: boolean;
  language: Language;
}

type TabType = 
  | 'dashboard' 
  | 'all' 
  | 'create' 
  | 'active' 
  | 'scheduled' 
  | 'expired' 
  | 'reports' 
  | 'customer' 
  | 'categories' 
  | 'bulk' 
  | 'settings';

export default function AdminCouponsSuite({
  coupons,
  addNewCoupon,
  updateCoupon,
  deleteCoupon,
  triggerToast,
  isDark,
  language
}: AdminCouponsSuiteProps) {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  
  // Local Enrichment state to track advanced attributes not persisted globally
  const [enrichedCoupons, setEnrichedCoupons] = useState<Coupon[]>([]);

  // Category State
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string; count: number }>>([
    { id: 'holiday', name: 'Holiday Promotions', color: '#7C3AED', count: 3 },
    { id: 'eid', name: 'Eid Campaign', color: '#10B981', count: 2 },
    { id: 'ramadan', name: 'Ramadan Specials', color: '#F59E0B', count: 1 },
    { id: 'blackfriday', name: 'Black Friday Deals', color: '#EF4444', count: 2 },
    { id: 'newyear', name: 'New Year Promotions', color: '#3B82F6', count: 1 }
  ]);

  // Merge parent coupons and enriched local coupons
  useEffect(() => {
    // Generate realistic detailed metadata for existing parent coupons if they don't have it
    const merged = coupons.map(c => {
      const match = enrichedCoupons.find(e => e.code === c.code);
      if (match) return { ...c, ...match };

      // Generate realistic default mock properties if missing
      const isExpired = new Date(c.expiryDate) < new Date();
      return {
        ...c,
        name: c.name || `${c.code} Promotional Discount`,
        description: c.description || `Get ${c.discountPercent}% OFF your digital order.`,
        type: c.type || 'percentage',
        discountValue: c.discountPercent,
        startDate: c.startDate || '2026-06-01',
        status: c.status || (isExpired ? 'expired' : 'active'),
        applyTo: c.applyTo || ['services', 'digital_products', 'entire_cart'],
        restrictions: c.restrictions || {
          minimumOrder: 20,
          maximumDiscount: 100,
          maxUses: 200,
          usesPerCustomer: 1,
          targetGroup: 'all'
        },
        category: c.category || 'holiday'
      };
    });

    // If merged is empty, add some realistic standard ones to seed
    if (merged.length === 0) {
      const defaultSeeds: Coupon[] = [
        {
          code: 'WELCOME20',
          discountPercent: 20,
          expiryDate: '2026-12-31',
          usageCount: 45,
          name: 'New User Welcome Pack',
          description: 'Special 20% discount code for new registered partners.',
          type: 'percentage',
          discountValue: 20,
          startDate: '2026-01-01',
          status: 'active',
          applyTo: ['services', 'entire_cart'],
          restrictions: { minimumOrder: 10, maximumDiscount: 50, maxUses: 500, usesPerCustomer: 1, targetGroup: 'new' },
          category: 'holiday'
        },
        {
          code: 'RAMADAN30',
          discountPercent: 30,
          expiryDate: '2026-04-15',
          usageCount: 120,
          name: 'Ramadan Kareem Mubarak',
          description: 'Get 30% reduction on all VPS performance packages.',
          type: 'percentage',
          discountValue: 30,
          startDate: '2026-03-01',
          status: 'expired',
          applyTo: ['hosting_packages', 'services'],
          restrictions: { minimumOrder: 50, maximumDiscount: 150, maxUses: 200, usesPerCustomer: 2, targetGroup: 'all' },
          category: 'ramadan'
        },
        {
          code: 'HOSTING25',
          discountPercent: 25,
          expiryDate: '2026-10-30',
          usageCount: 88,
          name: 'Direct Hosting Enterprise Promotion',
          description: '25% OFF clean high performance servers & nodes.',
          type: 'percentage',
          discountValue: 25,
          startDate: '2026-06-15',
          status: 'active',
          applyTo: ['hosting_packages'],
          restrictions: { minimumOrder: 30, maximumDiscount: 200, maxUses: 1000, usesPerCustomer: 1, targetGroup: 'all' },
          category: 'holiday'
        },
        {
          code: 'EID35',
          discountPercent: 35,
          expiryDate: '2026-07-25',
          usageCount: 0,
          name: 'Eid-ul-Adha Special Festivity Coupon',
          description: '35% heavy discount for our upcoming corporate premium campaign.',
          type: 'percentage',
          discountValue: 35,
          startDate: '2026-07-10',
          status: 'scheduled',
          applyTo: ['services', 'digital_products', 'domain_registration'],
          restrictions: { minimumOrder: 100, maximumDiscount: 500, maxUses: 100, usesPerCustomer: 1, targetGroup: 'vip' },
          category: 'eid'
        },
        {
          code: 'DIGITAL50',
          discountPercent: 50,
          expiryDate: '2026-12-15',
          usageCount: 201,
          name: 'Digital Assets Black Friday Heavy Code',
          description: 'Get half off any standalone software scripts in our marketplace.',
          type: 'percentage',
          discountValue: 50,
          startDate: '2026-05-01',
          status: 'active',
          applyTo: ['digital_products'],
          restrictions: { minimumOrder: 5, maximumDiscount: 300, maxUses: 500, usesPerCustomer: 1, targetGroup: 'all' },
          category: 'blackfriday'
        }
      ];
      defaultSeeds.forEach(s => addNewCoupon(s));
    }
  }, [coupons, enrichedCoupons]);

  const activeCouponsList = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return coupons.map(c => {
      const match = enrichedCoupons.find(e => e.code === c.code);
      return {
        ...c,
        name: c.name || `${c.code} Promotional Discount`,
        description: c.description || `Get ${c.discountPercent}% OFF your digital order.`,
        type: c.type || 'percentage',
        discountValue: c.discountPercent,
        startDate: c.startDate || '2026-06-01',
        status: c.status || (new Date(c.expiryDate) < new Date() ? 'expired' : 'active'),
        applyTo: c.applyTo || ['entire_cart'],
        restrictions: c.restrictions || { minimumOrder: 0, maximumDiscount: 9999, maxUses: 9999, usesPerCustomer: 1, targetGroup: 'all' },
        category: c.category || 'holiday'
      };
    });
  }, [coupons, enrichedCoupons]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredCoupons = useMemo(() => {
    return activeCouponsList.filter(c => {
      const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (c.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || c.type === filterType;
      const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [activeCouponsList, searchTerm, filterType, filterCategory]);

  // Counts for tabs
  const activeCount = useMemo(() => activeCouponsList.filter(c => c.status === 'active').length, [activeCouponsList]);
  const scheduledCount = useMemo(() => activeCouponsList.filter(c => c.status === 'scheduled').length, [activeCouponsList]);
  const expiredCount = useMemo(() => activeCouponsList.filter(c => c.status === 'expired').length, [activeCouponsList]);

  // Dashboard Stats
  const dashboardStats = useMemo(() => {
    const total = activeCouponsList.length;
    const totalRedemptions = activeCouponsList.reduce((sum, c) => sum + (c.usageCount || 0), 0);
    // Calculated mock finance attribution
    const totalDiscountGiven = activeCouponsList.reduce((sum, c) => sum + ((c.usageCount || 0) * (c.discountValue || 15) * 1.8), 0);
    const revenueImpact = activeCouponsList.reduce((sum, c) => sum + ((c.usageCount || 0) * 115), 0);
    const conversion = totalRedemptions > 0 ? 14.8 : 0;
    
    // Find top performing
    let topC = 'N/A';
    let maxUses = 0;
    activeCouponsList.forEach(c => {
      if ((c.usageCount || 0) > maxUses) {
        maxUses = c.usageCount || 0;
        topC = c.code;
      }
    });

    return {
      total,
      active: activeCount,
      expired: expiredCount,
      redemptions: totalRedemptions,
      discountGiven: Math.round(totalDiscountGiven),
      revenueGenerated: Math.round(revenueImpact),
      topCoupon: topC,
      conversionRate: conversion
    };
  }, [activeCouponsList, activeCount, expiredCount]);

  // Form Fields State (Create Coupon)
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState('percentage');
  const [formValue, setFormValue] = useState(15);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formExpiryDate, setFormExpiryDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState<'active' | 'scheduled' | 'expired' | 'suspended'>('active');
  const [formBanner, setFormBanner] = useState<string>('');
  const [formCategory, setFormCategory] = useState('holiday');
  
  // Applicability checkbox states
  const [applyServices, setApplyServices] = useState(true);
  const [applyDigital, setApplyDigital] = useState(true);
  const [applyDomain, setApplyDomain] = useState(false);
  const [applyHosting, setApplyHosting] = useState(false);
  const [applyEcommerce, setApplyEcommerce] = useState(false);
  const [applyCart, setApplyCart] = useState(true);

  // Restriction parameters
  const [minOrder, setMinOrder] = useState(25);
  const [maxDiscount, setMaxDiscount] = useState(100);
  const [maxUses, setMaxUses] = useState(500);
  const [usesPerCustomer, setUsesPerCustomer] = useState(1);
  const [targetGroup, setTargetGroup] = useState('all');

  // Interactive Bulk Generator State
  const [bulkQuantity, setBulkQuantity] = useState(50);
  const [bulkPrefix, setBulkPrefix] = useState('HOSTING20');
  const [bulkDiscount, setBulkDiscount] = useState(20);
  const [generatedBatch, setGeneratedBatch] = useState<string[]>([]);

  // Drag & drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Smart Features state
  const [smartFeatures, setSmartFeatures] = useState({
    autoApply: true,
    exitIntent: false,
    abandonedCart: true,
    firstPurchase: true,
    holidayPromos: true,
    eidCampaign: true,
    ramadanSpecial: false,
    blackFriday: true,
    newYear: true
  });

  // Security Validation settings
  const [securitySettings, setSecuritySettings] = useState({
    preventDuplicate: true,
    fraudDetection: true,
    rapidEntryThreshold: 5, // attempts before lockout
    lockoutDurationMinutes: 15,
    ipTracking: true,
    eligibilityCheck: true
  });

  // Fraud Log alerts simulation
  const [fraudLogs, setFraudLogs] = useState<Array<{ id: string; time: string; ip: string; code: string; reason: string }>>([
    { id: '1', time: '10 mins ago', ip: '103.45.122.9', code: 'RAMADAN50', reason: 'Attempted duplicate usage on same email account' },
    { id: '2', time: '1 hour ago', ip: '182.16.88.23', code: 'FAKECODE20', reason: 'Brute force code guessing - 5 consecutive failures' }
  ]);

  // Selected Coupon details view modal
  const [selectedCouponDetails, setSelectedCouponDetails] = useState<Coupon | null>(null);

  // Actions dropdown state
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null);

  // Coupon Editing States
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editFormName, setEditFormName] = useState('');
  const [editFormCode, setEditFormCode] = useState('');
  const [editFormDesc, setEditFormDesc] = useState('');
  const [editFormType, setEditFormType] = useState('percentage');
  const [editFormValue, setEditFormValue] = useState(15);
  const [editFormStartDate, setEditFormStartDate] = useState('');
  const [editFormExpiryDate, setEditFormExpiryDate] = useState('');
  const [editFormStatus, setEditFormStatus] = useState<'active' | 'scheduled' | 'expired' | 'suspended'>('active');
  const [editFormCategory, setEditFormCategory] = useState('holiday');
  const [editApplyServices, setEditApplyServices] = useState(true);
  const [editApplyDigital, setEditApplyDigital] = useState(true);
  const [editApplyDomain, setEditApplyDomain] = useState(false);
  const [editApplyHosting, setEditApplyHosting] = useState(false);
  const [editApplyEcommerce, setEditApplyEcommerce] = useState(false);
  const [editApplyCart, setEditApplyCart] = useState(true);
  const [editMinOrder, setEditMinOrder] = useState(25);
  const [editMaxDiscount, setEditMaxDiscount] = useState(100);
  const [editMaxUses, setEditMaxUses] = useState(500);
  const [editUsesPerCustomer, setEditUsesPerCustomer] = useState(1);
  const [editTargetGroup, setEditTargetGroup] = useState('all');

  const handleStartEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setEditFormName(coupon.name || '');
    setEditFormCode(coupon.code || '');
    setEditFormDesc(coupon.description || '');
    setEditFormType(coupon.type || 'percentage');
    setEditFormValue(coupon.discountPercent || 15);
    setEditFormStartDate(coupon.startDate || new Date().toISOString().split('T')[0]);
    setEditFormExpiryDate(coupon.expiryDate || new Date().toISOString().split('T')[0]);
    setEditFormStatus(coupon.status || 'active');
    setEditFormCategory(coupon.category || 'holiday');
    
    const applyTo = coupon.applyTo || [];
    setEditApplyServices(applyTo.includes('services'));
    setEditApplyDigital(applyTo.includes('digital_products'));
    setEditApplyDomain(applyTo.includes('domain_registration'));
    setEditApplyHosting(applyTo.includes('hosting_packages'));
    setEditApplyEcommerce(applyTo.includes('ecommerce_pos') || applyTo.includes('ecommerce_products'));
    setEditApplyCart(applyTo.includes('entire_cart'));

    const res = coupon.restrictions || {};
    setEditMinOrder(res.minimumOrder ?? 25);
    setEditMaxDiscount(res.maximumDiscount ?? 100);
    setEditMaxUses(res.maxUses ?? 500);
    setEditUsesPerCustomer(res.usesPerCustomer ?? 1);
    setEditTargetGroup(res.targetGroup || 'all');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const applyTo: string[] = [];
    if (editApplyServices) applyTo.push('services');
    if (editApplyDigital) applyTo.push('digital_products');
    if (editApplyDomain) applyTo.push('domain_registration');
    if (editApplyHosting) applyTo.push('hosting_packages');
    if (editApplyEcommerce) applyTo.push('ecommerce_pos');
    if (editApplyCart) applyTo.push('entire_cart');

    const updated: Coupon = {
      ...editingCoupon,
      code: editFormCode.toUpperCase().trim(),
      discountPercent: Number(editFormValue),
      expiryDate: editFormExpiryDate,
      name: editFormName,
      description: editFormDesc,
      type: editFormType,
      startDate: editFormStartDate,
      status: editFormStatus,
      applyTo,
      restrictions: {
        minimumOrder: Number(editMinOrder),
        maximumDiscount: Number(editMaxDiscount),
        maxUses: Number(editMaxUses),
        usesPerCustomer: Number(editUsesPerCustomer),
        targetGroup: editTargetGroup
      },
      category: editFormCategory
    };

    if (updateCoupon) {
      updateCoupon(editingCoupon.code, updated);
      triggerToast(`✨ Promo coupon ${editFormCode.toUpperCase().trim()} updated successfully!`);
    } else {
      triggerToast(`⚠️ Failed to update: updateCoupon callback not found.`);
    }
    setEditingCoupon(null);
  };

  // Success state animator
  const [showFormSuccess, setShowFormSuccess] = useState(false);

  // Copy helpers
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Custom Category creation
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#8B5CF6');

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const id = newCatName.toLowerCase().replace(/\s+/g, '-');
    if (categories.some(c => c.id === id)) {
      triggerToast('⚠️ Category already exists.');
      return;
    }
    setCategories([...categories, { id, name: newCatName, color: newCatColor, count: 0 }]);
    setNewCatName('');
    triggerToast('🎨 Custom Campaign Category registered!');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    triggerToast('📋 Coupon code copied successfully.');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Drag-and-drop banner handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormBanner(file.name);
      triggerToast(`📁 Uploaded template banner: ${file.name}`);
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormBanner(e.target.files[0].name);
      triggerToast(`📁 Uploaded template banner: ${e.target.files[0].name}`);
    }
  };

  // Create Coupon Form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) {
      triggerToast('❌ Error: Please specify a coupon code.');
      return;
    }
    if (coupons.some(c => c.code.toUpperCase() === formCode.trim().toUpperCase())) {
      triggerToast('❌ Error: This coupon code already exists.');
      return;
    }

    const applicableList: string[] = [];
    if (applyServices) applicableList.push('services');
    if (applyDigital) applicableList.push('digital_products');
    if (applyDomain) applicableList.push('domain_registration');
    if (applyHosting) applicableList.push('hosting_packages');
    if (applyEcommerce) applicableList.push('ecommerce_products');
    if (applyCart) applicableList.push('entire_cart');

    const newCp: Coupon = {
      code: formCode.trim().toUpperCase(),
      discountPercent: Number(formValue),
      expiryDate: formExpiryDate,
      usageCount: 0,
      name: formName.trim() || `${formCode.toUpperCase()} Coupon`,
      description: formDesc.trim() || `Enterprise grade promotion code ${formCode.toUpperCase()}`,
      type: formType,
      discountValue: Number(formValue),
      startDate: formStartDate,
      status: formStatus,
      bannerImage: formBanner || 'default_coupon_banner.jpg',
      applyTo: applicableList,
      restrictions: {
        minimumOrder: minOrder,
        maximumDiscount: maxDiscount,
        maxUses: maxUses,
        usesPerCustomer: usesPerCustomer,
        targetGroup: targetGroup
      },
      category: formCategory
    };

    // Store in enriched state
    setEnrichedCoupons(prev => [newCp, ...prev]);
    // Store in global parent state
    addNewCoupon(newCp);

    setShowFormSuccess(true);
    triggerToast(`🎟️ Created coupon "${newCp.code}" successfully.`);
    
    // Clear form
    setFormCode('');
    setFormName('');
    setFormDesc('');
    setFormBanner('');
    
    setTimeout(() => {
      setShowFormSuccess(false);
      setCurrentTab('all');
    }, 1500);
  };

  // Bulk generator execution
  const handleRunBulkGenerator = () => {
    if (bulkQuantity <= 0) return;
    const newCodes: string[] = [];
    
    for (let i = 0; i < bulkQuantity; i++) {
      let code = '';
      if (bulkPrefix === 'RANDOM AUTO CODE') {
        const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        code = `WZB-${randomHex}-${randomNum}`;
      } else {
        const indexSuffix = String(i + 1).padStart(3, '0');
        code = `${bulkPrefix}-${indexSuffix}-${Math.floor(10 + Math.random() * 90)}`;
      }

      // Avoid duplicates
      if (!coupons.some(c => c.code === code)) {
        newCodes.push(code);
        const item: Coupon = {
          code: code,
          discountPercent: bulkDiscount,
          expiryDate: '2026-12-31',
          usageCount: 0,
          name: `Bulk Generated Segment Coupon #${i+1}`,
          description: `Automatic batch coupon code of ${bulkPrefix} series.`,
          type: 'percentage',
          discountValue: bulkDiscount,
          startDate: '2026-07-01',
          status: 'active',
          applyTo: ['entire_cart'],
          restrictions: { minimumOrder: 15, maximumDiscount: 50, maxUses: 1, usesPerCustomer: 1, targetGroup: 'all' },
          category: 'holiday'
        };
        addNewCoupon(item);
      }
    }

    setGeneratedBatch(newCodes);
    triggerToast(`⚡ Successfully injected ${newCodes.length} bulk vouchers!`);
  };

  // Recharts chart data structures
  const usageChartData = useMemo(() => {
    return [
      { date: 'July 1', redemptions: 24, revenue: 1800 },
      { date: 'July 2', redemptions: 38, revenue: 2900 },
      { date: 'July 3', redemptions: 51, revenue: 4100 },
      { date: 'July 4', redemptions: 42, revenue: 3500 },
      { date: 'July 5', redemptions: 65, revenue: 5400 },
      { date: 'July 6', redemptions: 89, revenue: 7600 },
      { date: 'July 7', redemptions: 110, revenue: 9800 }
    ];
  }, []);

  const performancePieData = useMemo(() => {
    return activeCouponsList.slice(0, 5).map((c, i) => {
      const colors = ['#7C3AED', '#EC4899', '#10B981', '#3B82F6', '#F59E0B'];
      return {
        name: c.code,
        value: c.usageCount || 10,
        color: colors[i % colors.length]
      };
    });
  }, [activeCouponsList]);

  const targetGroupData = useMemo(() => {
    return [
      { name: 'All Customers', count: 420, fill: '#7C3AED' },
      { name: 'New Customers Only', count: 280, fill: '#A855F7' },
      { name: 'VIP Members', count: 150, fill: '#EC4899' },
      { name: 'Affiliates Linked', count: 95, fill: '#3B82F6' }
    ];
  }, []);

  // Export functions
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.text("WebzoneBD Voucher & Promotions Statement", 14, 20);
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`Generated At: ${new Date().toLocaleString()} (BST)`, 14, 28);
      doc.text(`Total Active Coupons: ${activeCount} | Total Usage Count: ${dashboardStats.redemptions}`, 14, 34);
      doc.line(14, 40, 196, 40);

      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Registered Coupon Voucher Ledger Matrix", 14, 48);

      let lineY = 56;
      doc.setFontSize(9);
      doc.text("Code", 14, lineY);
      doc.text("Discount", 50, lineY);
      doc.text("Category", 80, lineY);
      doc.text("Uses", 120, lineY);
      doc.text("Expiry Date", 150, lineY);
      doc.text("Status", 180, lineY);
      
      doc.line(14, lineY + 2, 196, lineY + 2);
      lineY += 10;

      activeCouponsList.forEach((c) => {
        if (lineY > 280) {
          doc.addPage();
          lineY = 20;
        }
        doc.setFont("Helvetica", "normal");
        doc.text(c.code, 14, lineY);
        doc.text(`${c.discountPercent}% OFF`, 50, lineY);
        doc.text(String(c.category || 'general'), 80, lineY);
        doc.text(String(c.usageCount || 0), 120, lineY);
        doc.text(c.expiryDate, 150, lineY);
        doc.text(String(c.status || 'active').toUpperCase(), 180, lineY);
        lineY += 8;
      });

      doc.save("WebzoneBD-Coupon-Report.pdf");
      triggerToast("📤 PDF Statement statement downloaded successfully.");
    } catch (e) {
      console.error(e);
      triggerToast("❌ PDF construction failure.");
    }
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Coupon Code,Coupon Name,Discount Value,Type,Category,Expiry Date,Usage Count,Status\n";
    
    activeCouponsList.forEach(c => {
      csvContent += `"${c.code}","${c.name || 'Promo'}",${c.discountPercent},"${c.type || 'percentage'}","${c.category || 'holiday'}","${c.expiryDate}",${c.usageCount || 0},"${c.status || 'active'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `coupon-ledger-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("📤 Exported CSV sheet containing all promo parameters.");
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className={`p-6 space-y-6 text-slate-800 dark:text-slate-100 ${isDark ? 'dark' : ''}`}>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-purple-600/10 text-purple-500">
              <Award className="w-6 h-6 animate-pulse" />
            </span>
            <h2 className="text-2xl font-black font-sans tracking-tight bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              🎟️ {language === 'bn' ? 'কুপন ও প্রচার নিয়ন্ত্রণ কেন্দ্র' : 'COUPON SYSTEM'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {language === 'bn' ? 'ওয়েবজোনবিডি এন্টারপ্রাইজ কুপন, ডিসকাউন্ট, প্রচারণা এবং অফার ম্যানেজমেন্ট সিস্টেম।' : 'Complete premium discount, promotion campaign modules, restrictions, and bulk generation tools.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={exportPDF} 
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition duration-300"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            PDF
          </button>
          <button 
            onClick={exportCSV} 
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition duration-300"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            CSV
          </button>
          <button 
            onClick={() => {
              setCurrentTab('create');
              triggerToast('✨ Coupon Form Loaded');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:opacity-90 transform hover:scale-[1.02] transition shadow-md shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* CORE HORIZONTAL SUBMENU TABS - Premium Glassmorphic Navigation Bar */}
      <div className="bg-slate-100/70 dark:bg-[#0F172A]/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 p-1.5 rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-0.5 whitespace-nowrap">
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
            { id: 'all', label: `All Coupons (${coupons.length})`, icon: Award },
            { id: 'create', label: 'Create Coupon', icon: Edit3 },
            { id: 'active', label: `Active (${activeCount})`, icon: Play },
            { id: 'scheduled', label: `Scheduled (${scheduledCount})`, icon: Calendar },
            { id: 'expired', label: `Expired (${expiredCount})`, icon: AlertCircle },
            { id: 'reports', label: 'Usage Reports', icon: TrendingUp },
            { id: 'customer', label: 'Customer Coupons', icon: Users },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'bulk', label: 'Bulk Generator', icon: Sparkles },
            { id: 'settings', label: 'Settings', icon: SettingsIcon }
          ].map(tb => {
            const active = currentTab === tb.id;
            const Icon = tb.icon;
            return (
              <button
                key={tb.id}
                onClick={() => setCurrentTab(tb.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs font-bold transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ${
                  active 
                    ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-[0_12px_24px_rgba(124,58,237,0.35)] scale-[1.02]' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTAINER VIEWS */}
      <div className="space-y-6">
        
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {currentTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* GRADIENT STATS WIDGETS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Coupon Codes', val: dashboardStats.total, desc: 'Registered system promo templates', color: 'from-purple-500 to-indigo-500', icon: Award },
                { label: 'Active Promotional Codes', val: dashboardStats.active, desc: 'Currently usable by checkout clients', color: 'from-emerald-500 to-teal-500', icon: Play },
                { label: 'Archived / Expired Codes', val: dashboardStats.expired, desc: 'Vouchers past expiration dates', color: 'from-rose-500 to-pink-500', icon: Trash2 },
                { label: 'Total Voucher Redemptions', val: dashboardStats.redemptions, desc: 'Successfully applied checkout items', color: 'from-amber-500 to-orange-500', icon: CheckSquare },
                { label: 'Accrued Discount Given', val: `$${dashboardStats.discountGiven.toLocaleString()}`, desc: 'Total monetary budget saved by clients', color: 'from-blue-500 to-cyan-500', icon: DollarSign },
                { label: 'Attributed Store Revenue', val: `$${dashboardStats.revenueGenerated.toLocaleString()}`, desc: 'Total purchase revenue utilizing discounts', color: 'from-pink-500 to-rose-500', icon: TrendingUp },
                { label: 'Top Performing Code', val: dashboardStats.topCoupon, desc: 'Most redeemed campaign voucher code', color: 'from-purple-500 to-pink-500', icon: Sparkles },
                { label: 'Conversion Success Rate', val: `${dashboardStats.conversionRate}%`, desc: 'Average cart checkout success with code', color: 'from-violet-500 to-fuchsia-500', icon: Zap }
              ].map((wd, i) => (
                <div 
                  key={i}
                  className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-xl hover:-translate-y-1 transition duration-300 relative overflow-hidden group"
                >
                  {/* Subtle decorative background gradient */}
                  <div className={`absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br ${wd.color} opacity-[0.04] group-hover:scale-125 transition duration-500`} />
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block tracking-tight">
                      {wd.label}
                    </span>
                    <span className={`p-1.5 rounded-lg bg-gradient-to-br ${wd.color} text-white`}>
                      <wd.icon className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black font-sans tracking-tight mb-1 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {wd.val}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 line-clamp-1">
                    {wd.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Usage Trend Area */}
              <div className="lg:col-span-2 p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                      <LineIcon className="w-4 h-4 text-purple-400" />
                      Promo Code Redemptions & Attributed Revenue
                    </h4>
                    <p className="text-[11px] text-slate-400">Attributing direct business growth from coupon campaign metrics</p>
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full font-mono font-bold">LIVE METRICS</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRedemptions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="redemptions" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRedemptions)" name="Code Applications" />
                      <Area type="monotone" dataKey="revenue" stroke="#EC4899" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Attributed Sales ($)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Top Coupon Share Pie */}
              <div className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                    <PieIcon className="w-4 h-4 text-pink-400" />
                    Campaign Share Matrix
                  </h4>
                  <p className="text-[11px] text-slate-400">Share of redemptions among top performing codes</p>
                </div>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performancePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performancePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5">
                  {performancePieData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold font-mono">{item.name}</span>
                      </div>
                      <span className="text-slate-400 font-bold">{item.value} applications</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* TWO COLUMN ROW: TARGET AUDIENCES & FRAUD MONITORING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 1. Target Audience Segmentation */}
              <div className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Eligibility Target Distribution
                  </h4>
                  <p className="text-[11px] text-slate-400">Voucher scopes assigned to dynamic demographic divisions</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {targetGroupData.map((grp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: grp.fill }} />
                        <span className="text-xs font-bold">{grp.name}</span>
                      </div>
                      <div>
                        <span className="text-xl font-black font-mono">{grp.count}</span>
                        <span className="text-[10px] text-slate-400 block">linked accounts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Security Alerts / Fraud logs */}
              <div className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-rose-500">
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-bounce" />
                      Live Fraud Tracking & Lockouts
                    </h4>
                    <p className="text-[11px] text-slate-400">Real-time prevention logs protecting store margins</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-500/15 text-rose-400">SECURE SHELL GATE</span>
                </div>
                <div className="space-y-3">
                  {fraudLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-2xl border border-rose-500/10 bg-rose-500/[0.02] space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {log.reason}
                        </span>
                        <span className="text-[10px] text-slate-450">{log.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Ip Address: <strong className="font-mono text-slate-600 dark:text-slate-300">{log.ip}</strong> • Attempted Code: <strong className="font-mono text-purple-400">{log.code}</strong>
                      </p>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-100 dark:border-white/5">
                    <span>Rapid Fail Limit Threshold: <strong className="text-slate-800 dark:text-slate-200">{securitySettings.rapidEntryThreshold} times</strong></span>
                    <button 
                      onClick={() => {
                        setFraudLogs([]);
                        triggerToast('🧹 Safety threat log cleared.');
                      }}
                      className="text-purple-400 hover:underline font-bold"
                    >
                      Clear Threat History
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* VIEW 2: ALL COUPONS TABLE */}
        {currentTab === 'all' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Search and Filters */}
            <div className="p-5 rounded-[24px] bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-[15px] border border-white/10 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
              
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search promo codes, names, or campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-[14px] pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter by:
                </span>
                
                {/* Type Filter */}
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-550/20 text-slate-700 dark:text-slate-300 transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Discount</option>
                  <option value="free_setup">Free Setup</option>
                  <option value="free_service">Free Service</option>
                </select>

                {/* Category Filter */}
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-550/20 text-slate-700 dark:text-slate-300 transition-all duration-200"
                >
                  <option value="all">All Campaigns</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <button 
                  onClick={() => { setSearchTerm(''); setFilterType('all'); setFilterCategory('all'); }}
                  className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition"
                  title="Reset Filter parameters"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Ledger list table with Glassmorphism */}
            <div className="rounded-[24px] border border-white/10 dark:border-white/5 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)] transition-all duration-300">
              <div className="overflow-x-auto max-h-[650px] overflow-y-auto scrollbar-thin relative">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-20 bg-gradient-to-r from-slate-50/95 via-purple-50/85 to-slate-50/95 dark:from-[#111827]/95 dark:via-purple-950/20 dark:to-[#111827]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                    <tr className="text-[10px] font-black uppercase tracking-wider text-slate-550 dark:text-purple-300">
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Voucher Details</th>
                      <th className="p-4">Campaign scope</th>
                      <th className="p-4 text-center">Discount value</th>
                      <th className="p-4 text-center">Usage log</th>
                      <th className="p-4 text-right">Validity range</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredCoupons.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-10 text-center italic text-slate-400">
                          No coupons found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCoupons.map((c) => {
                        let statusColor = 'bg-emerald-500/10 text-emerald-500';
                        if (c.status === 'scheduled') statusColor = 'bg-blue-500/10 text-blue-500';
                        if (c.status === 'expired') statusColor = 'bg-rose-500/10 text-rose-500';
                        if (c.status === 'suspended') statusColor = 'bg-amber-500/10 text-amber-500';

                        return (
                          <tr key={c.code} className="hover:bg-slate-100/40 dark:hover:bg-white/[0.015] transition duration-200">
                            <td className="p-4 font-mono font-black text-purple-500 text-xs select-all">
                              {c.code}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">{c.name}</span>
                              <span className="text-[10px] text-slate-400 line-clamp-1">{c.description}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-350 block uppercase">
                                {String(c.category || 'Holiday')}
                              </span>
                              <span className="text-[9px] text-slate-400 block line-clamp-1">
                                {c.applyTo?.join(', ')}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 font-mono">
                                {c.discountPercent}% OFF
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="font-bold text-xs font-mono">{c.usageCount || 0}</span>
                              <span className="text-[9px] text-slate-400 block">redemptions</span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="text-[10px] font-bold block">{c.expiryDate}</span>
                              <span className="text-[9px] text-slate-400 block">Starts {c.startDate || 'N/A'}</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-black ${statusColor}`}>
                                {String(c.status || 'active').toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4 text-center relative">
                              <div className="flex justify-center">
                                <div className="relative inline-block text-left">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionDropdown(openActionDropdown === c.code ? null : c.code);
                                    }}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111827] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 transition-all duration-300"
                                  >
                                    <span>Actions</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openActionDropdown === c.code ? 'rotate-180' : ''}`} />
                                  </button>

                                  <AnimatePresence>
                                    {openActionDropdown === c.code && (
                                      <>
                                        <div 
                                          className="fixed inset-0 z-10" 
                                          onClick={() => setOpenActionDropdown(null)}
                                        />
                                        
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                          transition={{ duration: 0.15 }}
                                          className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.15)] z-20 overflow-hidden divide-y divide-slate-100 dark:divide-white/5"
                                        >
                                          <div className="py-1">
                                            <button
                                              onClick={() => {
                                                setSelectedCouponDetails(c);
                                                setOpenActionDropdown(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-500/10 hover:text-purple-400 flex items-center gap-2 transition duration-150"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                              View Stats
                                            </button>
                                            <button
                                              onClick={() => {
                                                handleCopyCode(c.code);
                                                setOpenActionDropdown(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 flex items-center gap-2 transition duration-150"
                                            >
                                              {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                              Copy Code
                                            </button>
                                            <button
                                              onClick={() => {
                                                handleStartEdit(c);
                                                setOpenActionDropdown(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 flex items-center gap-2 transition duration-150"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                              Edit Coupon
                                            </button>
                                          </div>
                                          <div className="py-1">
                                            <button
                                              onClick={() => {
                                                deleteCoupon(c.code);
                                                triggerToast(`🗑️ Deactivated and deleted promo ${c.code}`);
                                                setOpenActionDropdown(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition duration-150"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                              Delete Coupon
                                            </button>
                                          </div>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW 3: CREATE COUPON FORM */}
        {currentTab === 'create' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
            
            {/* SUCCESS MESSAGE MODAL/ALERT */}
            <AnimatePresence>
              {showFormSuccess && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="mb-4 p-4 rounded-2xl bg-[#DCFCE7] border border-[#22C55E] flex items-center gap-3 text-emerald-800 text-xs font-semibold shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
                  <div>
                    <h5 className="font-bold">CONGRATULATIONS!</h5>
                    <p className="text-[11px] font-normal opacity-85">Enterprise coupon model initialized, indexed, and published to database pipeline successfully.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 rounded-[20px] border border-white/8 bg-white dark:bg-[#0F172A] shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-6">
              
              <div className="border-b border-slate-100 dark:border-white/5 pb-4">
                <h3 className="text-base font-black flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Voucher Parameter Architect Blueprint
                </h3>
                <p className="text-[11px] text-slate-400">Configure parameters, checkout restrictions, and demographic rules securely.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Row 1: Code and Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coupon Code Input */}
                  <div className="space-y-2 relative">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 tracking-wider block">COUPON CODE CODE (UPPERCASE ONLY)</label>
                    <div className="flex rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] overflow-hidden focus-within:ring-4 focus-within:ring-[#7C3AED]/18 focus-within:border-[#7C3AED] transition-all duration-300">
                      <input 
                        type="text" 
                        placeholder="e.g. EIDOFFER50"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                        required
                        className="w-full h-[56px] px-4 font-mono font-extrabold text-sm text-slate-900 dark:text-white bg-transparent outline-none uppercase"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const rand = 'WZB-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(10 + Math.random()*90);
                          setFormCode(rand);
                          triggerToast('⚡ Random code generated!');
                        }}
                        className="px-4 bg-slate-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-tight hover:opacity-80 transition"
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  {/* Coupon Name Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 tracking-wider block">COUPON VISUAL DISPLAY NAME</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Eid-ul-Adha Promotional Campaign"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Row 2: Description (min-height 140px textarea) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">COUPON DETAILED DESCRIPTION / CLIENT VOUCHER COPY</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide specific promotional copy explaining discounts eligibility, limitations, and setup..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full min-h-[140px] p-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white text-xs focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none resize-y"
                  />
                </div>

                {/* Row 3: Coupon Type, Value and Campaign Folder */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">COUPON TYPE CLASSIFICATION</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white text-xs focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none"
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed Amount Discount ($)</option>
                      <option value="free_setup">Free Setup Fee Waiver</option>
                      <option value="free_service">Free Standard Service Addition</option>
                      <option value="free_domain">Free Domain registration Voucher</option>
                      <option value="free_hosting">Free Hosting Node Upgrade</option>
                      <option value="first_order">First Order Registration Only</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">DISCOUNT VALUE (PERCENT OR CASH AMOUNT)</label>
                    <input 
                      type="number" 
                      value={formValue}
                      onChange={(e) => setFormValue(Number(e.target.value))}
                      min={1}
                      max={formType === 'percentage' ? 100 : 9999}
                      className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-sm focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">CAMPAIGN CATEGORY DIRECTORY</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white text-xs focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Row 4: Dates and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">CAMPAIGN GO-LIVE START DATE</label>
                    <input 
                      type="date" 
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">EXPIRATION TERMINATION DATE</label>
                    <input 
                      type="date" 
                      value={formExpiryDate}
                      onChange={(e) => setFormExpiryDate(e.target.value)}
                      className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white font-mono text-xs focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">INITIAL STATE CONTROL</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-900 dark:text-white text-xs focus:ring-4 focus:ring-[#7C3AED]/18 focus:border-[#7C3AED] transition-all duration-300 outline-none"
                    >
                      <option value="active">Active (Deploy Live)</option>
                      <option value="scheduled">Scheduled (In queue)</option>
                      <option value="suspended">Suspended (Offline draft)</option>
                    </select>
                  </div>

                </div>

                {/* Banner Image Drag & Drop File Upload */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-350 block">COUPON CAMPAIGN HERO BANNER IMAGE</label>
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                      isDragOver 
                        ? 'border-purple-500 bg-purple-500/5' 
                        : 'border-slate-200 dark:border-white/10 hover:border-purple-500 bg-slate-50 dark:bg-white/[0.01]'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleManualFileSelect}
                      accept="image/*"
                      className="hidden" 
                    />
                    <Upload className="w-8 h-8 text-purple-500 mb-2 animate-bounce" />
                    {formBanner ? (
                      <div className="text-center">
                        <p className="text-xs font-bold text-emerald-500 flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" /> Ready to bind
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">{formBanner}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs font-bold">Drag and drop campaign asset, or <span className="text-purple-400 underline">browse computer</span></p>
                        <p className="text-[10px] text-slate-450 mt-1">Recommended dimension: 1200 x 400px • Max size 2MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply To Checkbox Groups (Rounded design) */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111827] space-y-3 border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-black text-slate-500 dark:text-slate-350 uppercase">APPLICABILITY TARGET RANGE</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { state: applyServices, set: setApplyServices, lbl: '☑ Services' },
                      { state: applyDigital, set: setApplyDigital, lbl: '☑ Digital Products' },
                      { state: applyDomain, set: setApplyDomain, lbl: '☑ Domain Registration' },
                      { state: applyHosting, set: setApplyHosting, lbl: '☑ Hosting Packages' },
                      { state: applyEcommerce, set: setApplyEcommerce, lbl: '☑ Ecommerce Products' },
                      { state: applyCart, set: setApplyCart, lbl: '☑ Entire Cart Subtotal' }
                    ].map((app, idx) => (
                      <label 
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-white/5 transition duration-200 cursor-pointer text-xs font-semibold"
                      >
                        <input 
                          type="checkbox"
                          checked={app.state}
                          onChange={(e) => app.set(e.target.checked)}
                          className="w-4 h-4 rounded-md accent-purple-600 cursor-pointer"
                        />
                        <span>{app.lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Restrictions Input Parameter Block */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111827] space-y-4 border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-black text-slate-500 dark:text-slate-350 uppercase">VOUCHER AUDIT RESTRICTION CLAUSES</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">MINIMUM SUB-TOTAL AMOUNT ($)</label>
                      <input 
                        type="number" 
                        value={minOrder} 
                        onChange={(e) => setMinOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">MAXIMUM CAP DISCOUNT ($)</label>
                      <input 
                        type="number" 
                        value={maxDiscount} 
                        onChange={(e) => setMaxDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">TOTAL SYSTEM REDEMPTIONS CAP</label>
                      <input 
                        type="number" 
                        value={maxUses} 
                        onChange={(e) => setMaxUses(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">REDEMPTIONS PER CLIENT EMAIL</label>
                      <input 
                        type="number" 
                        value={usesPerCustomer} 
                        onChange={(e) => setUsesPerCustomer(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold"
                      />
                    </div>

                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-bold text-slate-400 block">DEMOGRAPHIC ELIGIBILITY ENROLMENT TARGET</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'all', lbl: 'All Registered Members' },
                        { id: 'new', lbl: 'New Accounts Only' },
                        { id: 'vip', lbl: 'VIP / High Tier Accounts Only' }
                      ].map(tg => (
                        <button
                          type="button"
                          key={tg.id}
                          onClick={() => setTargetGroup(tg.id)}
                          className={`py-1.5 rounded-xl border font-bold text-xs transition duration-200 ${
                            targetGroup === tg.id 
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-white/5 text-slate-500'
                          }`}
                        >
                          {tg.lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Primary Action submit button */}
                <button
                  type="submit"
                  className="w-full h-[54px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white font-extrabold text-sm hover:scale-[1.02] hover:opacity-95 shadow-[0_12px_30px_rgba(124,58,237,0.35)] transition duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 animate-pulse" />
                  INITIATE & DEPLOY VOUCHER
                </button>

              </form>

            </div>

          </motion.div>
        )}

        {/* VIEW 4: ACTIVE COUPONS */}
        {currentTab === 'active' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                Live Checking Checkout Coupons
              </h4>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold">Deploying {activeCount} codes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCouponsList.filter(c => c.status === 'active').map(c => (
                <div key={c.code} className="p-5 rounded-2xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-xl relative overflow-hidden flex flex-col justify-between h-48 hover:-translate-y-1 transition duration-300">
                  {/* Ticket Stub effect cutouts */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#0a0f1d] -translate-y-1/2 border-r border-slate-150 dark:border-white/5" />
                  <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#0a0f1d] -translate-y-1/2 border-l border-slate-150 dark:border-white/5" />
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-emerald-500 tracking-wider block bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">LIVE CAMPAIGN</span>
                      <span className="font-black text-xl text-purple-500 font-mono select-all uppercase">{c.code}</span>
                    </div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-white mt-3 line-clamp-1">{c.name}</h5>
                    <p className="text-[10.5px] text-slate-400 line-clamp-2 mt-1">{c.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-150 dark:border-white/5">
                    <span className="text-xs font-extrabold text-purple-400">{c.discountPercent}% OFF Cart</span>
                    <button 
                      onClick={() => handleCopyCode(c.code)}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW 5: SCHEDULED COUPONS */}
        {currentTab === 'scheduled' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Scheduled Promotions Pipeline
              </h4>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold">Queue: {scheduledCount} codes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCouponsList.filter(c => c.status === 'scheduled').map(c => (
                <div key={c.code} className="p-5 rounded-2xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-lg flex flex-col justify-between h-44">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">SCHEDULED QUEUE</span>
                      <span className="font-bold text-xs font-mono text-slate-400">{c.code}</span>
                    </div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-white mt-3 line-clamp-1">{c.name}</h5>
                    <p className="text-[10.5px] text-slate-450 mt-1">Starts active state on <strong className="text-slate-800 dark:text-slate-300 font-mono">{c.startDate}</strong></p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400">
                    <span>Valued Discount: <strong>{c.discountPercent}%</strong></span>
                    <span className="font-bold text-[10px] text-blue-400 flex items-center gap-1">
                      <LoopIcon className="w-3 h-3 animate-spin" /> Pending Clock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW 6: EXPIRED COUPONS */}
        {currentTab === 'expired' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Archived Campaign Logs
              </h4>
              <span className="text-xs bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full font-bold">Archive: {expiredCount} codes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCouponsList.filter(c => c.status === 'expired').map(c => (
                <div key={c.code} className="p-5 rounded-2xl border border-slate-150 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex flex-col justify-between h-44 opacity-75">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase">CAMPAIGN CLOSED</span>
                      <span className="font-bold text-xs font-mono text-slate-500 line-through">{c.code}</span>
                    </div>
                    <h5 className="font-bold text-sm text-slate-500 mt-3 line-clamp-1">{c.name}</h5>
                    <p className="text-[10.5px] text-slate-450 mt-1">Terminated validity on <strong className="font-mono text-rose-400">{c.expiryDate}</strong></p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-white/5">
                    <span className="text-xs text-slate-500">Applied {c.usageCount || 0} times</span>
                    <button 
                      onClick={() => {
                        triggerToast(`🔄 Renewing coupon: ${c.code} extended for 30 days.`);
                      }}
                      className="text-[10px] font-extrabold text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Renew Validity
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW 7: USAGE REPORTS */}
        {currentTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Download and Share row */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-white/5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Statement Generation Desk</h4>
                <p className="text-[11px] text-slate-500">Download formatted campaign statistics records instantly.</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={exportPDF}
                  className="px-4 py-2 bg-purple-650 hover:bg-purple-750 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> Download PDF Report
                </button>
                <button 
                  onClick={exportCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Export Excel Sheet
                </button>
                <button 
                  onClick={printReport}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" /> Print ledger
                </button>
              </div>
            </div>

            {/* Reports tables and Performance charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-purple-400">Most Used Campaign Coupons</h4>
                <div className="space-y-2">
                  {activeCouponsList.sort((a,b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 5).map((c, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-500 text-xs font-black flex items-center justify-center font-mono">#{idx+1}</span>
                        <div>
                          <span className="font-black text-xs font-mono block">{c.code}</span>
                          <span className="text-[10px] text-slate-400">{c.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-xs font-mono block text-emerald-500">{c.usageCount || 0} uses</span>
                        <span className="text-[9px] text-slate-400">Attributed to {c.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-pink-500">Campaign Revenue Contribution Chart</h4>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '11px' }} />
                      <Bar dataKey="revenue" fill="#EC4899" radius={[4, 4, 0, 0]} name="Attributed Sales Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* VIEW 8: CUSTOMER COUPONS */}
        {currentTab === 'customer' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
              <div>
                <h4 className="font-extrabold text-sm text-purple-400">Demographic Based Promo Automation</h4>
                <p className="text-xs text-slate-450">Tether system codes to automate registration triggers or custom loyalty accounts</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Welcome Vouchers', trigger: 'Auto-applied or emailed immediately upon customer account verification', code: 'WELCOME20', active: true, badge: 'NEW USERS' },
                  { name: 'Birthday Rewards', trigger: 'Dispatched to customer registered profile 24 hours prior to birthdate', code: 'BIRTHDAY25', active: false, badge: 'ANNUAL LOYALTY' },
                  { name: 'VIP Priority Club', trigger: 'Activated once lifetime spent balance exceeds $1,000 threshold limit', code: 'VIPMEM35', active: true, badge: 'HIGH VALUE SPENDERS' },
                  { name: 'Affiliate Federation Link', trigger: 'Allows custom affiliate markers to offer partner discount rate to referrers', code: 'AFFILATE10', active: true, badge: 'ORGANIC CHANNELS' }
                ].map((rule, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[8.5px] font-black bg-purple-500/10 text-purple-400 block w-max mb-1.5">{rule.badge}</span>
                        <h5 className="font-black text-xs">{rule.name}</h5>
                        <p className="text-[10px] text-slate-450 mt-1 line-clamp-2">{rule.trigger}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-purple-600 text-white px-2 py-1 rounded-lg">{rule.code}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-250 dark:border-white/5">
                      <span className="text-[10.5px] text-slate-400">Trigger Status: <strong className={rule.active ? 'text-emerald-500' : 'text-slate-500'}>{rule.active ? 'ACTIVE AUTOMATION' : 'DISABLED'}</strong></span>
                      <button 
                        onClick={() => {
                          triggerToast(`⚙️ Trigger settings altered: ${rule.name}`);
                        }}
                        className="text-xs font-bold text-purple-400 hover:underline"
                      >
                        Adjust Scope
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 9: CATEGORIES */}
        {currentTab === 'categories' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category creation form */}
            <div className="p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-purple-400">Create Campaign Category Folder</h4>
              <form onSubmit={handleAddNewCategory} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">CAMPAIGN TITLE NAME</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Eid-ul-Fitr Festival Pack"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">THEMATIC BRANDING COLOR CODE</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/5 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono uppercase">{newCatColor}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Create Category Directory
                </button>

              </form>
            </div>

            {/* List of categories */}
            <div className="md:col-span-2 p-5 rounded-3xl border border-slate-150 dark:border-white/5 bg-white dark:bg-[#0F172A] shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-purple-400">Campaign Folders Directory</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-2xl border border-slate-150 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                      <div>
                        <span className="font-bold text-xs block">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID Prefix: {cat.id}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold font-mono">
                      {activeCouponsList.filter(c => c.category === cat.id).length} codes
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW 10: BULK GENERATOR */}
        {currentTab === 'bulk' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
            
            <div className="p-5 rounded-[20px] border border-white/8 bg-white dark:bg-[#0F172A] shadow-xl space-y-5">
              <div className="border-b border-slate-100 dark:border-white/5 pb-3">
                <h4 className="font-extrabold text-sm text-purple-400">Crypto Bulk Coupon Codes Generator</h4>
                <p className="text-xs text-slate-400">Instantly generate batches of secure, unique cryptographic checkout vouchers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">TOTAL VOUCHERS QUANTITY</label>
                  <select
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]"
                  >
                    <option value={10}>Generate 10 Coupons</option>
                    <option value={50}>Generate 50 Coupons</option>
                    <option value={100}>Generate 100 Coupons</option>
                    <option value={500}>Generate 500 Coupons</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">CODE SEQUENCE FORMAT PREFIX</label>
                  <select
                    value={bulkPrefix}
                    onChange={(e) => setBulkPrefix(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]"
                  >
                    <option value="WEBZONE10">WEBZONE10 (WEBZONE10-XXX-XX)</option>
                    <option value="WELCOME20">WELCOME20 (WELCOME20-XXX-XX)</option>
                    <option value="HOSTING20">HOSTING20 (HOSTING20-XXX-XX)</option>
                    <option value="DIGITAL50">DIGITAL50 (DIGITAL50-XXX-XX)</option>
                    <option value="RANDOM AUTO CODE">RANDOM AUTO CRYPT CODE (WZB-XXXX-XXXX)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">DISCOUNT VALUE (%)</label>
                  <input 
                    type="number" 
                    value={bulkDiscount} 
                    onChange={(e) => setBulkDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] font-mono font-bold"
                  />
                </div>

              </div>

              <button 
                onClick={handleRunBulkGenerator}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:opacity-90 text-white font-extrabold text-xs rounded-xl shadow-md transition duration-300"
              >
                Incorporate crypto generation algorithm now
              </button>

              {/* Generated batch list panel */}
              {generatedBatch.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-emerald-500">⚡ GENERATION BATCH INJECTED SUCCESSFUL</span>
                    <button 
                      onClick={() => {
                        const content = "data:text/plain;charset=utf-8," + generatedBatch.join('\n');
                        const link = document.createElement("a");
                        link.setAttribute("href", encodeURI(content));
                        link.setAttribute("download", `bulk-vouchers-${Date.now()}.txt`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        triggerToast('📋 Raw batch file download complete.');
                      }}
                      className="text-purple-400 font-bold hover:underline"
                    >
                      Download as TXT file
                    </button>
                  </div>
                  <div className="max-h-[140px] overflow-y-auto font-mono text-[10px] p-3 rounded bg-slate-100 dark:bg-black/40 grid grid-cols-2 md:grid-cols-4 gap-1">
                    {generatedBatch.map((code, idx) => (
                      <div key={idx} className="p-1 border border-slate-200 dark:border-white/5 text-center bg-white dark:bg-[#111827] rounded">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* VIEW 11: SETTINGS */}
        {currentTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Smart Promo features */}
              <div className="p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-white/5 shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-purple-400">🤖 Smart Promotion Automatons</h4>
                <div className="space-y-3">
                  {[
                    { id: 'autoApply', lbl: 'Auto Apply Optimal Coupon in Cart', desc: 'Analyzes cart items and automatically inputs the best coupon code.' },
                    { id: 'exitIntent', lbl: 'Exit Intent Cart Discount popup', desc: 'Shows a 10% coupon popup modal if mouse trajectory suggests leaving page.' },
                    { id: 'abandonedCart', lbl: 'Abandoned Cart Email code trigger', desc: 'Automatically emails client cart voucher if unpaid for more than 30 mins.' },
                    { id: 'firstPurchase', lbl: 'Automatic First Purchase popup Ribbon', desc: 'Displays prominent Welcome Ribbon offering immediate signup discount.' }
                  ].map(sm => (
                    <label key={sm.id} className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition">
                      <input 
                        type="checkbox"
                        checked={smartFeatures[sm.id as keyof typeof smartFeatures]}
                        onChange={(e) => setSmartFeatures({ ...smartFeatures, [sm.id]: e.target.checked })}
                        className="w-4 h-4 rounded mt-0.5 accent-purple-600"
                      />
                      <div>
                        <span className="font-extrabold text-xs block">{sm.lbl}</span>
                        <span className="text-[10px] text-slate-450">{sm.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security settings */}
              <div className="p-5 rounded-[20px] bg-white dark:bg-[#0F172A] border border-slate-150 dark:border-white/5 shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-rose-500">🔐 Fraud Safeguard Parameters</h4>
                <div className="space-y-3">
                  
                  <label className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={securitySettings.preventDuplicate}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, preventDuplicate: e.target.checked })}
                      className="w-4 h-4 rounded mt-0.5 accent-purple-600"
                    />
                    <div>
                      <span className="font-bold text-xs block">Block duplicate coupon application on checkout email</span>
                      <span className="text-[10px] text-slate-450">Prevents users from applying same code twice with multiple browser sessions.</span>
                    </div>
                  </label>

                  <label className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={securitySettings.fraudDetection}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, fraudDetection: e.target.checked })}
                      className="w-4 h-4 rounded mt-0.5 accent-purple-600"
                    />
                    <div>
                      <span className="font-bold text-xs block">AI-Powered guessing attack lockouts</span>
                      <span className="text-[10px] text-slate-450">Locks checkout coupon fields for specific IP address if rapid failures occur.</span>
                    </div>
                  </label>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">Lockout Trigger Failures</span>
                      <input 
                        type="number"
                        value={securitySettings.rapidEntryThreshold}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, rapidEntryThreshold: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs rounded bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-white/5 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">Lockout Length (Minutes)</span>
                      <input 
                        type="number"
                        value={securitySettings.lockoutDurationMinutes}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, lockoutDurationMinutes: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs rounded bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-white/5 font-mono"
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </motion.div>
        )}

      </div>

      {/* MODAL VIEWPORT FOR DETAILED ANALYSIS OF SINGLE COUPON */}
      <AnimatePresence>
        {selectedCouponDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-6 rounded-[24px] bg-white dark:bg-[#0F172A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3">
                <div>
                  <h4 className="text-base font-black font-mono text-purple-400 select-all">{selectedCouponDetails.code}</h4>
                  <span className="text-[10px] text-slate-400">Detailed security and analytic properties</span>
                </div>
                <button 
                  onClick={() => setSelectedCouponDetails(null)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-450 font-medium">Coupon Name:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCouponDetails.name || 'Promo Coupon'}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-450 font-medium">Description Value:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCouponDetails.description}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-450 font-medium">Discount Percent Rate:</span>
                  <span className="font-black text-emerald-400">{selectedCouponDetails.discountPercent}% OFF</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-450 font-medium">Campaign Category Scope:</span>
                  <span className="font-bold text-purple-400 capitalize">{String(selectedCouponDetails.category || 'Holiday')}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-450 font-medium">Redemption Audit Count:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedCouponDetails.usageCount || 0} applications</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-450 font-medium">Expiry Threshold date:</span>
                  <span className="font-mono font-bold text-rose-400">{selectedCouponDetails.expiryDate}</span>
                </div>

                {selectedCouponDetails.restrictions && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 space-y-1 text-[11px]">
                    <span className="font-extrabold text-purple-400 block mb-1">Restrictions Applied:</span>
                    <div>Minimum Order Cart total required: <strong>${selectedCouponDetails.restrictions.minimumOrder ?? 0}</strong></div>
                    <div>Maximum Discount Allowed Cap: <strong>${selectedCouponDetails.restrictions.maximumDiscount ?? 100}</strong></div>
                    <div>Target Enrolment demographic: <strong>{selectedCouponDetails.restrictions.targetGroup || 'all'}</strong></div>
                  </div>
                )}

              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setSelectedCouponDetails(null)}
                  className="w-full py-2.5 rounded-xl bg-purple-650 hover:bg-purple-750 font-bold text-white text-xs"
                >
                  Dismiss Detailed Viewport
                </button>
              </div>

            </motion.div>
          </div>
        )}

        {editingCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[20px] overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-2xl my-8 p-6 rounded-[24px] bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-[25px] border border-slate-200/80 dark:border-white/10 shadow-[0_24px_60px_rgba(124,58,237,0.25)] space-y-6 relative overflow-hidden"
            >
              {/* Top premium linear gradient line indicator */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

              <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Modify Voucher Configuration
                  </h3>
                  <p className="text-[11px] text-slate-400">Edit coupon details, checkout rules, and applicability ranges securely.</p>
                </div>
                <button 
                  onClick={() => setEditingCoupon(null)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-6">
                
                {/* Row 1: Code and Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coupon Code Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] tracking-wider block">COUPON CODE (UPPERCASE ONLY)</label>
                    <div className="relative group/input">
                      <input 
                        type="text" 
                        placeholder="e.g. EIDOFFER50"
                        value={editFormCode}
                        onChange={(e) => setEditFormCode(e.target.value.toUpperCase())}
                        required
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] font-mono font-extrabold text-sm focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none uppercase"
                      />
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                  {/* Coupon Name Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] tracking-wider block">COUPON VISUAL DISPLAY NAME</label>
                    <div className="relative group/input">
                      <input 
                        type="text" 
                        placeholder="e.g. Eid-ul-Adha Promotional Campaign"
                        value={editFormName}
                        onChange={(e) => setEditFormName(e.target.value)}
                        required
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] font-medium focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none text-xs"
                      />
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Description */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] block">COUPON DETAILED DESCRIPTION / CLIENT VOUCHER COPY</label>
                  <div className="relative group/input">
                    <textarea 
                      rows={4}
                      placeholder="Provide specific promotional copy explaining discounts eligibility, limitations, and setup..."
                      value={editFormDesc}
                      onChange={(e) => setEditFormDesc(e.target.value)}
                      className="w-full min-h-[140px] p-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] text-xs focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none resize-y"
                    />
                    <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                  </div>
                </div>

                {/* Row 3: Coupon Type, Value and Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] block">COUPON TYPE CLASSIFICATION</label>
                    <div className="relative group/input">
                      <select
                        value={editFormType}
                        onChange={(e) => setEditFormType(e.target.value)}
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] text-xs focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none"
                      >
                        <option value="percentage">Percentage Discount (%)</option>
                        <option value="fixed">Fixed Amount Discount ($)</option>
                        <option value="free_setup">Free Setup Fee Waiver</option>
                        <option value="free_service">Free Standard Service Addition</option>
                        <option value="free_domain">Free Domain registration Voucher</option>
                        <option value="free_hosting">Free Hosting Node Upgrade</option>
                        <option value="first_order">First Order Registration Only</option>
                      </select>
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] block">DISCOUNT VALUE (PERCENT OR CASH)</label>
                    <div className="relative group/input">
                      <input 
                        type="number" 
                        value={editFormValue}
                        onChange={(e) => setEditFormValue(Number(e.target.value))}
                        min={1}
                        max={editFormType === 'percentage' ? 100 : 9999}
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] font-mono text-sm focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none"
                      />
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] block">CAMPAIGN CATEGORY DIRECTORY</label>
                    <div className="relative group/input">
                      <select
                        value={editFormCategory}
                        onChange={(e) => setEditFormCategory(e.target.value)}
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] text-xs focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                </div>

                {/* Row 4: Dates and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] block">CAMPAIGN GO-LIVE START DATE</label>
                    <div className="relative group/input">
                      <input 
                        type="date" 
                        value={editFormStartDate}
                        onChange={(e) => setEditFormStartDate(e.target.value)}
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] font-mono text-xs focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none"
                      />
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] block">EXPIRATION TERMINATION DATE</label>
                    <div className="relative group/input">
                      <input 
                        type="date" 
                        value={editFormExpiryDate}
                        onChange={(e) => setEditFormExpiryDate(e.target.value)}
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] font-mono text-xs focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none"
                      />
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] block">INITIAL STATE CONTROL</label>
                    <div className="relative group/input">
                      <select
                        value={editFormStatus}
                        onChange={(e) => setEditFormStatus(e.target.value as any)}
                        className="w-full h-[56px] px-4 rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-[#0F172A] dark:text-[#FFFFFF] text-xs focus:border-transparent focus:ring-4 focus:ring-[#7C3AED]/18 transition-all duration-300 outline-none"
                      >
                        <option value="active">Active (Deploy Live)</option>
                        <option value="scheduled">Scheduled (In queue)</option>
                        <option value="expired">Expired</option>
                        <option value="suspended">Suspended (Offline draft)</option>
                      </select>
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-focus-within/input:border-purple-500 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                </div>

                {/* Applicability target checkbox groups */}
                <div className="p-5 rounded-[20px] bg-slate-50/50 dark:bg-[#111827]/50 backdrop-blur-md space-y-3 border border-slate-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black text-[#475569] dark:text-[#CBD5E1] uppercase">APPLICABILITY TARGET RANGE</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { state: editApplyDigital, set: setEditApplyDigital, lbl: 'Digital Products' },
                      { state: editApplyDomain, set: setEditApplyDomain, lbl: 'Domain Registration' },
                      { state: editApplyHosting, set: setEditApplyHosting, lbl: 'Hosting Packages' },
                      { state: editApplyEcommerce, set: setEditApplyEcommerce, lbl: 'Ecommerce Products' },
                      { state: editApplyCart, set: setEditApplyCart, lbl: 'Entire Cart Subtotal' }
                    ].map((app, idx) => (
                      <label 
                        key={idx}
                        className="flex items-center gap-3 p-3.5 rounded-[14px] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all duration-200 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-250 select-none"
                      >
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox"
                            checked={app.state}
                            onChange={(e) => app.set(e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded-md border border-slate-300 dark:border-white/10 bg-[#F8FAFC] dark:bg-[#111827] peer-checked:bg-gradient-to-r peer-checked:from-[#7C3AED] peer-checked:to-[#EC4899] peer-checked:border-transparent flex items-center justify-center transition-all duration-200">
                            <Check className="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform duration-200 font-bold" />
                          </div>
                        </div>
                        <span>{app.lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Restriction Parameter block */}
                <div className="p-5 rounded-[20px] bg-slate-50/50 dark:bg-[#111827]/50 backdrop-blur-md space-y-4 border border-slate-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black text-[#475569] dark:text-[#CBD5E1] uppercase">VOUCHER AUDIT RESTRICTION CLAUSES</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">MINIMUM SUB-TOTAL AMOUNT ($)</label>
                      <input 
                        type="number" 
                        value={editMinOrder} 
                        onChange={(e) => setEditMinOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">MAXIMUM CAP DISCOUNT ($)</label>
                      <input 
                        type="number" 
                        value={editMaxDiscount} 
                        onChange={(e) => setEditMaxDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">TOTAL SYSTEM REDEMPTIONS CAP</label>
                      <input 
                        type="number" 
                        value={editMaxUses} 
                        onChange={(e) => setEditMaxUses(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">REDEMPTIONS PER CLIENT EMAIL</label>
                      <input 
                        type="number" 
                        value={editUsesPerCustomer} 
                        onChange={(e) => setEditUsesPerCustomer(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-bold text-[#475569] dark:text-[#CBD5E1] block">DEMOGRAPHIC ELIGIBILITY ENROLMENT TARGET</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'all', lbl: 'All Registered Members' },
                        { id: 'new', lbl: 'New Accounts Only' },
                        { id: 'vip', lbl: 'VIP / High Tier Accounts Only' }
                      ].map(tg => (
                        <button
                          key={tg.id}
                          type="button"
                          onClick={() => setEditTargetGroup(tg.id)}
                          className={`py-2 px-3 rounded-[12px] text-[11px] font-bold transition-all duration-350 border ${
                            editTargetGroup === tg.id 
                              ? 'bg-gradient-to-r from-purple-650 to-indigo-650 text-white border-transparent shadow-[0_8px_20px_rgba(124,58,237,0.25)] scale-[1.02]' 
                              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {tg.lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button 
                    type="button"
                    onClick={() => setEditingCoupon(null)}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition font-semibold text-xs text-slate-700 dark:text-slate-300"
                  >
                    Cancel Action
                  </button>
                  <button 
                    type="submit"
                    className="px-6 h-[54px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_12px_30px_rgba(124,58,237,0.35)] transition-all duration-300 font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <span>Publish Updated Configuration</span>
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
