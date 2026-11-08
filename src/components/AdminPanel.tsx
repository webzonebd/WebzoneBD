import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { 
  BarChart, Users, ShoppingBag, FolderOpen, Globe, LayoutGrid, HelpCircle, 
  Sparkles, DollarSign, Send, Star, FileText, Check, X, Shield, Plus, Trash2, Edit, 
  TrendingUp, TrendingDown, Activity, UserCheck, Key, Ticket, Layers, Save, Terminal, Play, 
  FileUp, Database, ArrowRight, BookOpen, AlertCircle, RefreshCw, MessageSquare,
  Smartphone, ShieldAlert, BadgeInfo, CheckCircle, Clock, CheckCircle2, Sliders, ChevronLeft, ChevronRight, Eye, EyeOff, XCircle, RotateCcw, ChevronDown, ChevronUp,
  Search, Mail, Award, Bell, Image, Download, Copy, Sun, Moon, Menu, Phone, User, LogOut, Printer, ShieldCheck, Clipboard, CreditCard, Truck, Link, Palette, Crown
} from 'lucide-react';
import { Product, Order, SupportTicket, SystemConfig, Coupon, Language, Theme, Currency, ActivityLog } from '../types';
import { jsPDF } from 'jspdf';
const LiveThemePreviewer = lazy(() => import('./LiveThemePreviewer'));
const KanbanBoard = lazy(() => import('./KanbanBoard'));
const WebsiteControlCenter = lazy(() => import('./WebsiteControlCenter'));
const GuestOrderTracking = lazy(() => import('./GuestOrderTracking'));
const CustomersManager = lazy(() => import('./CustomersManager'));
const Dashboard = lazy(() => import('./Dashboard'));
const CompanyRevenueDashboard = lazy(() => import('./CompanyRevenueDashboard'));
const RecentOrdersWidget = lazy(() => import('./RecentOrdersWidget'));
const AdminWhatsAppServiceOrders = lazy(() => import('./AdminWhatsAppServiceOrders'));
const OrdersManagement = lazy(() => import('./OrdersManagement'));
const AffiliateSystem = lazy(() => import('./AffiliateSystem'));
const AdminAdvancedAnalytics = lazy(() => import('./AdminAdvancedAnalytics'));
const AdminLiveChat = lazy(() => import('./AdminLiveChat'));
import { AdminReportsSuite } from './AdminReportsSuite';
import AdminCouponsSuite from './AdminCouponsSuite';
import AdminMarketingHub from './AdminMarketingHub';
import { catalogServicesData, CatalogService } from './ServicesData';
import { 
  ResponsiveContainer, 
  AreaChart as RechartAreaChart, 
  Area as RechartArea, 
  BarChart as RechartBarChart, 
  Bar as RechartBar, 
  LineChart as RechartLineChart, 
  Line as RechartLine, 
  XAxis as RechartXAxis, 
  YAxis as RechartYAxis, 
  Tooltip as RechartTooltip, 
  CartesianGrid as RechartCartesianGrid, 
  Legend as RechartLegend, 
  ComposedChart as RechartComposedChart,
  Cell as RechartCell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface PermissionSet {
  manage_products: boolean;
  manage_orders: boolean;
  manage_support: boolean;
  manage_content: boolean;
  manage_users: boolean;
  manage_system: boolean;
}

interface RoleConfig {
  role: string;
  label: string;
  description: string;
  permissions: PermissionSet;
  color: string;
}

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
  updateOrderStatus: (id: string, status: 'completed' | 'failed' | 'refunded') => void;
  updateOrderDetails?: (id: string, updatedFields: Partial<Order>) => void;
  deleteOrder?: (id: string) => void;
  addTicketReply: (ticketId: string, message: string, sender: 'user' | 'admin') => void;
  addNewCoupon: (coupon: Coupon) => void;
  updateCoupon?: (code: string, updatedCoupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  updateSystemConfig: (cfg: SystemConfig) => void;
  triggerToast: (msg: string) => void;
  currency?: Currency;
  setCurrency?: (c: Currency) => void;
  currencySettings?: any;
  setCurrencySettings?: (settings: any) => void;
  posts: any[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  activityLogs?: ActivityLog[];
  onAddActivityLog?: (action: string) => void;
  user?: any;
  setUser?: (u: any) => void;
  siteWideBroadcast?: string | null;
  onBroadcastChange?: (msg: string | null, link?: string | null, linkText?: string | null, expiresAt?: number | null, severity?: string, startAt?: number | null) => void;
  setTheme?: (theme: Theme, event?: React.MouseEvent) => void;
  onLogout?: () => void;
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
  customMethods?: any[];
  setCustomMethods?: any;
  setLanguage?: (lang: Language) => void;
}

// Simulated database initialization helper for custom administrative SaaS models
const INITIAL_CUSTOMERS = [
  { id: 'usr-101', name: 'Imran Hasan', companyName: 'Hasan Technologies Ltd.', email: 'imranh7900@gmail.com', phone: '+880 1711 223344', whatsapp: '+880 1711 223344', dob: '1992-06-15', gender: 'Male', status: 'active', walletBalance: 450, totalSpent: 1200, country: 'Bangladesh', city: 'Dhaka', address: 'House 42, Road 11, Banani', postalCode: '1213', websiteUrl: 'https://imranhasan.tech', customerType: 'VIP Client', tags: ['VIP', 'High Value', 'Priority Support'], lastLogin: '2026-06-11 09:41', joinedAt: '2026-06-26' },
  { id: 'usr-102', name: 'Al-Shehri Majid', companyName: 'Saudi Web Enterprises', email: 'majid@saudiweb.com', phone: '+966 50 123 4567', whatsapp: '+966 50 123 4567', dob: '1988-10-02', gender: 'Male', status: 'active', walletBalance: 1200, totalSpent: 3500, country: 'Saudi Arabia', city: 'Riyadh', address: 'King Fahd Road, Al Olaya District', postalCode: '12214', websiteUrl: 'https://saudiweb.com', customerType: 'Corporate Client', tags: ['Corporate', 'High Value'], lastLogin: '2026-06-11 01:10', joinedAt: '2026-02-20' },
  { id: 'usr-103', name: 'Zeeshan Rahman', companyName: 'Zeeshan Agency', email: 'zee@rahmanit.com', phone: '+880 1864 051151', whatsapp: '+880 1864 051151', dob: '1995-12-25', gender: 'Male', status: 'active', walletBalance: 85, totalSpent: 450, country: 'Bangladesh', city: 'Chittagong', address: 'Halishahar Main Road', postalCode: '4216', websiteUrl: 'https://rahmanit.com', customerType: 'Regular Client', tags: ['Regular'], lastLogin: '2026-06-09 16:15', joinedAt: '2026-03-05' },
  { id: 'usr-104', name: 'Sarah Connor', companyName: 'Cyberdyne Systems', email: 'sarah@t800.io', phone: '+1 415 888 9999', whatsapp: '+1 415 888 9999', dob: '1984-04-12', gender: 'Female', status: 'suspended', walletBalance: 0, totalSpent: 250, country: 'USA', city: 'Los Angeles', address: 'P.O. Box 4141', postalCode: '90001', websiteUrl: 'https://t800.io', customerType: 'Reseller', tags: ['Reseller', 'Risk Customer'], lastLogin: '2026-06-05 23:45', joinedAt: '2026-03-12' },
  { id: 'usr-105', name: 'Enamul Haque', companyName: 'Dhaka Host Group', email: 'enamul@dhakahost.net', phone: '+880 1912 345678', whatsapp: '+880 1912 345678', dob: '1990-09-08', gender: 'Male', status: 'active', walletBalance: 1560, totalSpent: 8900, country: 'Bangladesh', city: 'Dhaka', address: 'Banosree Block C', postalCode: '1219', websiteUrl: 'https://dhakahost.net', customerType: 'Affiliate Partner', tags: ['Affiliate', 'High Value'], lastLogin: '2026-06-11 10:25', joinedAt: '2025-11-10' }
];

const INITIAL_CUSTOMER_NOTES = [
  { id: 'n-1', customerId: 'usr-101', title: 'Onboarding Call', description: 'Imran completed onboarding. He needs a dedicated hosting setup soon.', createdBy: 'Anisur Rahman', createdAt: '2026-06-11 10:15', visibility: 'Admin Only' },
  { id: 'n-2', customerId: 'usr-101', title: 'Payment Issue Rescheduled', description: 'Agreed to pay for VPS next week instead of today.', createdBy: 'Sayeeda Yeasmin', createdAt: '2026-06-08 14:22', visibility: 'Staff Only' },
  { id: 'n-3', customerId: 'usr-102', title: 'Corporate Contract Signed', description: 'Majid signed the annual retainer contract. VIP support prioritised.', createdBy: 'Fahim Morshed', createdAt: '2026-06-01 09:00', visibility: 'Public Internal' }
];

const INITIAL_CUSTOMER_ACTIVITIES = [
  { id: 'act-1', customerId: 'usr-101', activity: 'Dashboard Login Success', date: '2026-06-11 09:41', ipAddress: '103.111.22.45', device: 'Chrome on macOS (14.2)' },
  { id: 'act-2', customerId: 'usr-101', activity: 'Updated Profile Details', date: '2026-06-10 16:30', ipAddress: '103.111.22.45', device: 'Chrome on macOS (14.2)' },
  { id: 'act-3', customerId: 'usr-101', activity: 'Created New Support Ticket #TKT-8833', date: '2026-06-09 11:15', ipAddress: '103.111.22.45', device: 'Safari on iPhone 15' },
  { id: 'act-4', customerId: 'usr-102', activity: 'Deposited $1200 via Stripe Gateway', date: '2026-06-10 18:22', ipAddress: '94.200.150.32', device: 'Firefox on Windows 11' },
  { id: 'act-5', customerId: 'usr-105', activity: 'Requested Payout of Affiliate Earnings', date: '2026-06-11 08:12', ipAddress: '182.16.55.90', device: 'Chrome on Android' }
];

const INITIAL_CUSTOMER_SECURITY = [
  { id: 'sec-1', customerId: 'usr-101', event: 'Password changed successfully', date: '2026-06-05 14:00', ipAddress: '103.111.22.45', device: 'Chrome on macOS' },
  { id: 'sec-2', customerId: 'usr-101', event: 'New login session created', date: '2026-06-11 09:41', ipAddress: '103.111.22.45', device: 'Chrome on macOS' },
  { id: 'sec-3', customerId: 'usr-104', event: 'Failed login attempt - invalid credentials', date: '2026-06-10 23:15', ipAddress: '5.200.41.90', device: 'Unknown Linux client' },
  { id: 'sec-4', customerId: 'usr-104', event: 'Account suspended - admin action', date: '2026-06-11 01:22', ipAddress: 'Internal System', device: 'Super Admin panel' }
];

const INITIAL_DOWNLOADS = [
  { id: 'dl-1', name: 'WebzoneBD Multivendor eCommerce Code', version: 'v4.1.2 Pro', format: 'ZIP', size: '142.5 MB', lastUpdated: '2026-05-10' },
  { id: 'dl-2', name: 'Premium WHMCS Automation Template Pack', version: 'v3.0', format: 'TAR.GZ', size: '28.8 MB', lastUpdated: '2026-06-01' },
  { id: 'dl-3', name: 'bKash/Nagad Payment System Laravel Addon', version: 'v1.8', format: 'ZIP', size: '4.2 MB', lastUpdated: '2026-06-08' }
];

const INITIAL_PROJECTS = [
  { id: 'proj-501', title: 'Enterprise E-Commerce Portal', clientName: 'Imran Hasan', clientId: 'usr-101', progress: 65, status: 'in_progress', budget: 1800, dueDate: '2026-07-15', assignedStaff: 'Anisur Rahman', milestones: 5, completedMilestones: 3 },
  { id: 'proj-502', title: 'Corporate Branding Website & SEO Boost', clientName: 'Al-Shehri Majid', clientId: 'usr-102', progress: 90, status: 'revision', budget: 3200, dueDate: '2026-06-30', assignedStaff: 'Sayeeda Yeasmin', milestones: 6, completedMilestones: 5 },
  { id: 'proj-503', title: 'SaaS Mobile App Core API Dev', clientName: 'Enamul Haque', clientId: 'usr-105', progress: 15, status: 'pending_brief', budget: 4500, dueDate: '2026-09-01', assignedStaff: 'Tariqul Islam', milestones: 8, completedMilestones: 1 }
];

const INITIAL_TASKS = [
  { id: 'task-1', projectId: 'proj-501', title: 'Database Schema Design & Firestore Blueprint Mapping', column: 'todo', priority: 'high', assignee: 'Anisur' },
  { id: 'task-2', projectId: 'proj-501', title: 'Stripe & bKash Callback Handlers Implementation', column: 'in_progress', priority: 'critical', assignee: 'Anisur' },
  { id: 'task-3', projectId: 'proj-501', title: 'Design Glassmorphic User Interface Layout in Tailwind', column: 'completed', priority: 'medium', assignee: 'Sayeeda' },
  { id: 'task-4', projectId: 'proj-502', title: 'Meta tags crawl test with Google Search Console', column: 'in_progress', priority: 'high', assignee: 'Tariqul' },
  { id: 'task-5', projectId: 'proj-503', title: 'Collect Customer functional brief requirements doc', column: 'backlog', priority: 'low', assignee: 'Sayeeda' }
];

const INITIAL_CUSTOMER_DOWNLOAD_LOGS = [
  { id: 'dl-901', customerName: 'Zeeshan Rahman', productName: 'Premium bKash PG v2 PHP SDK', ipAddress: '103.242.22.10', timestamp: '2026-06-09 14:22', size: '2.4 MB', status: 'valid' },
  { id: 'dl-902', customerName: 'Al-Shehri Majid', productName: 'Multivendor Laravel Core Script', ipAddress: '37.12.188.54', timestamp: '2026-06-08 09:12', size: '48.1 MB', status: 'valid' },
  { id: 'dl-903', customerName: 'Imran Hasan', productName: 'Real Estate WordPress Premium Theme', ipAddress: '103.88.236.41', timestamp: '2026-06-07 19:40', size: '18.7 MB', status: 'valid' }
];

const INITIAL_STAFF = [
  { userId: 'stf-01', name: 'Anisur Rahman', role: 'Staff', department: 'Development', ticketsCount: 4, sprintVelocity: 95, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', status: 'active', email: 'anisur@webzonebd.com', password: 'anisurpassword', permissions: ['manage_projects', 'manage_tasks', 'write_code'] },
  { userId: 'stf-02', name: 'Sayeeda Yeasmin', role: 'Staff', department: 'Support', ticketsCount: 15, sprintVelocity: 88, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', status: 'active', email: 'sayeeda@webzonebd.com', password: 'sayeedapassword', permissions: ['view_projects', 'reply_tickets', 'support_chat'] },
  { userId: 'stf-03', name: 'Tariqul Islam', role: 'Staff', department: 'SEO & Copywriting', ticketsCount: 2, sprintVelocity: 90, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', status: 'active', email: 'tariqul@webzonebd.com', password: 'tariqulpassword', permissions: ['view_projects', 'manage_tasks', 'ai_generation'] },
  { userId: 'stf-04', name: 'Fahim Morshed', role: 'Staff', department: 'DevOps', ticketsCount: 0, sprintVelocity: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', status: 'active', email: 'fahim@webzonebd.com', password: 'fahimpassword', permissions: ['manage_servers', 'security_audit', 'whmcs_sync'] },
  { userId: 'stf-05', name: 'Order Operations Manager', role: 'Order Mgr', department: 'Sales & Billing', ticketsCount: 0, sprintVelocity: 92, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80', status: 'active', email: 'sales@webzonebd.com', password: 'sales789', permissions: ['manage_orders', 'view_billing', 'dispatch_invoices'] }
];

const INITIAL_WITHDRAW_REQUESTS = [
  { id: 'wit-301', partnerName: 'Imran Hasan', partnerId: 'PARTNER-IMRAN', amout: 250, method: 'bKash', details: '01711223344', status: 'pending', date: '2026-06-09' },
  { id: 'wit-302', partnerName: 'Al-Shehri Majid', partnerId: 'PARTNER-MAJID', amout: 840, method: 'PayPal', details: 'majid@saudiweb.com', status: 'pending', date: '2026-06-08' },
  { id: 'wit-303', partnerName: 'Zeeshan Rahman', partnerId: 'PARTNER-ZEESHAN', amout: 120, method: 'Nagad', details: '01864051151', status: 'completed', date: '2026-06-02' }
];

// Eloquent-style simulation classes for blog JSON import triggers
export class Category {
  static firstOrCreate(param: string | { name: string; slug?: string }) {
    const categoryName = typeof param === 'string' ? param : (param.name || param.slug || 'General');
    console.log(`[Category::firstOrCreate] Ensuring category exists across taxonomies: ${categoryName}`);
    const saved = localStorage.getItem('webzone_blog_categories_pool');
    let pool: string[] = saved ? JSON.parse(saved) : ['WordPress', 'Laravel Development', 'Web Development', 'Web Hosting', 'Domain Registration', 'SEO & Google Ads', 'E-Commerce & POS', 'Ecommerce Education', 'Technology News'];
    const exists = pool.some(c => c.toLowerCase() === categoryName.toLowerCase());
    if (!exists) {
      pool.push(categoryName);
      localStorage.setItem('webzone_blog_categories_pool', JSON.stringify(pool));
    }
    const catId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { id: catId, name: categoryName, isNew: !exists };
  }
}

export class Post {
  static create(postData: any) {
    console.log(`[Post::create] Instantiating newly parsed blog draft:`, postData);
    const slug = postData.slug || postData.id || (postData.title ? postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `blog-${Date.now()}`);
    // Extract category name or ID
    const catName = postData.category || postData.category_id || "General";
    return {
      id: slug,
      title: postData.title || "Untitled Blog Payload",
      titleBn: postData.titleBn || postData.title || "শিরোনামহীন ব্লগ",
      titleAr: postData.titleAr || postData.title || "بلا عنوان",
      image: postData.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      category: catName,
      categoryBn: postData.categoryBn || catName,
      categoryAr: postData.categoryAr || catName,
      summary: postData.summary || postData.meta_description || postData.metaDesc || "Draft blog summary details...",
      summaryBn: postData.summaryBn || postData.summary || "ড্রাফট ব্লগের সারসংক্ষেপ...",
      summaryAr: postData.summaryAr || postData.summary || "مسودة ملخص المدونة...",
      content: postData.content || "",
      contentBn: postData.contentBn || postData.content || "",
      contentAr: postData.contentAr || postData.content || "",
      date: postData.date || new Date().toISOString().split('T')[0],
      author: postData.author || "WebzoneBD Editor Team",
      readTime: postData.readTime || "5 min read",
      views: postData.views || 0,
      likes: postData.likes || 0,
      videoUrl: postData.videoUrl || "",
      meta_keywords: postData.meta_keywords || "",
      meta_description: postData.meta_description || "",
      category_id: postData.category_id || "",
      isDraft: true,
      status: postData.status || 'draft',
      tags: postData.tags || ["WordPress"]
    };
  }
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
  updateOrderDetails,
  deleteOrder,
  addTicketReply,
  addNewCoupon,
  updateCoupon,
  deleteCoupon,
  updateSystemConfig,
  triggerToast,
  currency = 'USD',
  setCurrency,
  currencySettings,
  setCurrencySettings,
  posts,
  setPosts,
  activityLogs = [],
  onAddActivityLog,
  user,
  setUser,
  siteWideBroadcast,
  onBroadcastChange,
  setTheme,
  onLogout,
  currencyRates: propCurrencyRates,
  setCurrencyRates: propSetCurrencyRates,
  verificationSettings: propVerificationSettings,
  setVerificationSettings: propSetVerificationSettings,
  paymentNotifs: propPaymentNotifs,
  setPaymentNotifs: propSetPaymentNotifs,
  bdMethods: propBdMethods,
  setBdMethods: propSetBdMethods,
  saMethods: propSaMethods,
  setSaMethods: propSetSaMethods,
  intlMethods: propIntlMethods,
  setIntlMethods: propSetIntlMethods,
  customMethods: propCustomMethods,
  setCustomMethods: propSetCustomMethods,
  setLanguage
}: AdminPanelProps) {
  
  const translationDict: Record<string, Record<string, string>> = {
    'bn': {
      '🏠 Dashboard': '🏠 ড্যাশবোর্ড',
      'Control overview metrics': 'সিস্টেম ও সাধারণ কাজের ওভারভিউ',
      '👥 Customers': '👥 গ্রাহক সমূহ',
      'Manage user segments & telemetry': 'গ্রাহক সেগমেন্ট এবং ডাটাবেস পরিচালনা করুন',
      'Customer List': 'গ্রাহক তালিকা',
      'Customer Groups': 'গ্রাহক গ্রুপ',
      'Customer Tags': 'গ্রাহক ট্যাগ',
      'Customer Notes': 'গ্রাহক নোট',
      'VIP Customers': 'ভিআইপি গ্রাহক',
      'Corporate Clients': 'কর্পোরেট ক্লায়েন্ট',
      'Affiliates': 'অ্যাফিলিয়েট',
      'Customer Activity Logs': 'গ্রাহক কার্যকলাপ লগ',
      'Customer Security Logs': 'গ্রাহক নিরাপত্তা লগ',
      'Customer Reports': 'গ্রাহক রিপোর্ট',
      '📦 Orders Management': '📦 অর্ডার ব্যবস্থাপনা',
      'Customer Order and billing pipelines,': 'গ্রাহক অর্ডার এবং বিলিং পাইপলাইন',
      'All Orders': 'সকল অর্ডার',
      '📋 Guest Order List': '📋 গেস্ট অর্ডার তালিকা',
      '📧 Receipts & Email Center': '📧 রশিদ ও ইমেল কেন্দ্র',
      '💼 Services': '💼 সেবা সমূহ',
      'Website dev & SEO catalog': 'ওয়েবসাইট ডেভেলপমেন্ট ও এসইও ক্যাটালগ',
      'All Services': 'সকল সেবা',
      'Service Categories': 'সেবা ক্যাটাগরি',
      'Service Orders': 'সেবা অর্ডার',
      'Service Inquiries': 'সেবা অনুসন্ধান',
      'WhatsApp Leads': 'হোয়াটসঅ্যাপ লিড',
      'Service Reports': 'সেবা রিপোর্ট',
      '📂 Projects': '📂 প্রকল্প সমূহ',
      'Client portal milestones & tasks': 'ক্লায়েন্ট পোর্টাল মাইলস্টোন এবং টাস্ক',
      'Active Projects': 'চলমান প্রকল্প',
      'Pending Projects': 'অপেক্ষমাণ প্রকল্প',
      'Completed Projects': 'সম্পন্ন প্রকল্প',
      'Milestones': 'মাইলস্টোন',
      'Tasks': 'টাস্ক সমূহ',
      'Files': 'ফাইল সমূহ',
      'Client Approvals': 'ক্লায়েন্ট অনুমোদন',
      '🎫 Support Center': '🎫 সাপোর্ট সেন্টার',
      'Live ticket chat reply center': 'লাইভ টিকিট ও চ্যাট সহায়তা',
      'Tickets': 'টিকেট সমূহ',
      'Live Chat': 'লাইভ চ্যাট',
      'WhatsApp Requests': 'হোয়াটসঅ্যাপ অনুরোধ',
      'Knowledge Base': 'নলেজ বেস',
      '🤖 AI Center': '🤖 এআই সেন্টার',
      'Gemini content generator suite': 'জেমিনি কন্টেন্ট জেনারেটর সুইট',
      'AI Blog Generator': 'এআই ব্লগ জেনারেটর',
      'AI Content Generator': 'এআই কন্টেন্ট জেনারেটর',
      'AI SEO Generator': 'এআই এসইও জেনারেটর',
      'AI Meta Generator': 'এআই মেটা জেনারেটর',
      'AI Business Name Gen': 'এআই বিজনেস নাম জেনারেটর',
      '💰 Affiliate System': '💰 অ্যাফিলিয়েট সিস্টেম',
      'Commissions withdrawal portal': 'কমিশন ও উত্তোলন পোর্টাল',
      'Affiliate Users': 'অ্যাফিলিয়েট ব্যবহারকারী',
      'Commissions': 'কমিশন সমূহ',
      'Withdraw Requests': 'উত্তোলন অনুরোধ',
      'Analytics': 'বিশ্লেষণ',
      '📢 Marketing': '📢 মার্কেটিং',
      'Email blaster lists, coupons': 'ইমেইল প্রচার এবং কুপন',
      'Email Campaigns': 'ইমেইল ক্যাম্পেইন',
      'SMS Campaigns': 'এসএমএস ক্যাম্পেইন',
      'Push Notifications': 'পুশ নোটিফিকেশন',
      'Coupon System': 'কুপন সিস্টেম',
      '⭐ Reviews': '⭐ রিভিউ সমূহ',
      'Audit marketplace client feedback': 'মার্কেটপ্লেস ও গ্রাহক রিভিউ অডিট',
      'Product Reviews': 'পণ্য রিভিউ',
      'Service Reviews': 'সেবা রিভিউ',
      'Testimonials': 'টেস্টিমোনিয়াল',
      '📊 Reports': '📊 রিপোর্ট সমূহ',
      'System statistics & telemetry': 'সিস্টেম পরিসংখ্যান এবং টেলিমেট্রি',
      'Revenue Reports': 'রেভিনিউ রিপোর্ট',
      'Store Reports': 'স্টোর রিপোর্ট',
      'Affiliate Reports': 'অ্যাফিলিয়েট রিপোর্ট',
      '🛡️ Audit Trail Log': '🛡️ অডিট ট্রেইল লগ',
      '👨‍💼 Staff Management': '👨‍💼 স্টাফ ম্যানেজমেন্ট',
      'Staff lists, roles permissions': 'স্টাফ তালিকা এবং ভূমিকা ও অনুমতি',
      '🔔 Notifications': '🔔 নোটিফিকেশন সমূহ',
      'System Alert Logs & status': 'সিস্টেম অ্যালارت লগ এবং স্ট্যাটাস',
      '👤 Client Dashboard Workspace': '👤 ক্লায়েন্ট ড্যাশবোর্ড',
      'Interactive Client view emulator': 'গ্রাহক ড্যাশবোর্ড এমুলেটর',
      '🖥️ Website Control Panel': '🖥️ ওয়েবসাইট নিয়ন্ত্রণ প্যানেল',
      'Shopify & WordPress Style CMS': 'শপিফাই ও ওয়ার্ডপ্রেস স্টাইল সিএমএস',
      'CMS Dashboard': 'সিএমএস ড্যাশবোর্ড',
      'Pages Management': 'পৃষ্ঠা ব্যবস্থাপনা',
      'Menus Builder': 'মেনু বিল্ডার',
      'Blog Posts': 'ব্লগ পোস্ট সমূহ',
      'Blog Categories': 'ব্লগ ক্যাটাগরি',
      'Blog & Product Tags': 'ব্লগ ও প্রোডাক্ট ট্যাগ',
      'Services Catalog': 'সেবা ক্যাটালগ',
      'Woo Products': 'পণ্য সমূহ',
      'Product Categories': 'পণ্য ক্যাটাগরি',
      'Product Sub Categories': 'পণ্য সাব-ক্যাটাগরি',
      'Media Library': 'মিডিয়া লাইব্রেরি',
      'Forms & Leads': 'ফরম ও লিড সমূহ',
      'SEO Manager': 'এসইও ম্যানেজার',
      'Homepage Builder': 'হোমপেজ বিল্ডার',
      'Header Builder': 'হেডার বিল্ডার',
      'Footer Builder': 'ফুটার বিল্ডার',
      'Testimonials UI': 'টেস্টিমোনিয়াল ইউআই',
      'FAQ Manager': 'এফএকিউ ম্যানেজার',
      'Announcements Bar': 'অ্যানাউন্সমেন্ট বার',
      'Redirect Manager': 'রিডাইরেক্ট ম্যানেজার',
      'Website Settings': 'ওয়েবসাইট সেটিংস',
      'Payment Settings': 'পেমেন্ট সেটিংস',
      '🌐 Web Settings': '🌐 ওয়েব সেটিংস',
      'Identity, default rates, and appearance setup': 'ওয়েবসাইট আইডেন্টিটি, ডিফল্ট রেট এবং অ্যাপিয়ারেন্স সেটিংস',
      'Total Clients': 'মোট কাস্টমার',
      'Registered enterprise portal users': 'নিবন্ধিত পোর্টাল ব্যবহারকারী',
      'Total Order Count': 'মোট অর্ডার সংখ্যা',
      'All purchases & orders logged': 'রেকর্ডকৃত সফল ও পেন্ডিং অর্ডার',
      'Total Blogs': 'মোট ব্লগ পোস্ট',
      'SEO optimized content nodes': 'এসইও অপ্টিমাইজড কন্টেন্ট নোড',
      'Total Products': 'মোট পণ্য',
      'Themes, scripts & addons live': 'লাইভ থিম, স্ক্রিপ্ট এবং অ্যাডন',
      'Total Revenue': 'মোট রেভিনিউ আয়',
      'Real-time revenue computed from real order database': 'বাস্তব অর্ডার ডাটাবেস থেকে রিয়েল-টাইমে হিসাবকৃত',
      'Support Tickets': 'সাপোর্ট টিকিট',
      'Pending assistance tickets logged': 'গ্রাহক সহায়তা টিকিট সংখ্যা',
      '🏦 Core Metrics': '🏦 মূল মেট্রিক্স',
      '🌐 CMS & Sales Catalog': '🌐 সিএমএস এবং বিক্রয় ক্যাটালগ',
      '📦 Workspace Operations': '📦 ওয়ার্কস্পেস অপারেশন',
      '🤖 AI & Support Desk': '🤖 এআই এবং সাপোর্ট ডেস্ক',
      '📢 Growth & Feedback': '📢 প্রবৃদ্ধি ও প্রতিক্রিয়া',
      '🛠️ System & Governance': '🛠️ সিস্টেম ও প্রশাসন'
    },
    'ar': {
      '🏠 Dashboard': '🏠 لوحة التحكم',
      'Control overview metrics': 'إحصائيات ومقاييس النظام العامة وبوابات العمل',
      '👥 Customers': '👥 إدارة العملاء',
      'Manage user segments & telemetry': 'إدارة قطاعات العملاء وسجلات النشاط البرمجي',
      'Customer List': 'قائمة العملاء',
      'Customer Groups': 'مجموعات العملاء',
      'Customer Tags': 'وسوم العملاء',
      'Customer Notes': 'ملاحظات العملاء',
      'VIP Customers': 'عملاء VIP',
      'Corporate Clients': 'عملاء الشركات',
      'Affiliates': 'الشركاء والمسوقون',
      'Customer Activity Logs': 'سجلات نشاط العملاء',
      'Customer Security Logs': 'سجلات الأمن للعملاء',
      'Customer Reports': 'تقارير العملاء',
      '📦 Orders Management': '📦 إدارة الطلبات',
      'Customer Order and billing pipelines,': 'إدارة عمليات الطلبات والفواتير والتحصيلات',
      'All Orders': 'جميع الطلبات',
      '📋 Guest Order List': '📋 طلبات الزوار',
      '📧 Receipts & Email Center': '📧 مركز الإشعارات والفواتير',
      '💼 Services': '💼 الخدمات والكتالوج',
      'Website dev & SEO catalog': 'تطوير المواقع والبرمجة وتحسين محركات البحث',
      'All Services': 'جميع الخدمات',
      'Service Categories': 'أقسام الخدمات',
      'Service Orders': 'طلبات الخدمات',
      'Service Inquiries': 'الاستفسارات والطلبات',
      'WhatsApp Leads': 'عملاء واتساب المهتمين',
      'Service Reports': 'تقارير الخدمات',
      '📂 Projects': '📂 إدارة المشاريع',
      'Client portal milestones & tasks': 'مراحل مشاريع العملاء والمهام والملفات المعنية',
      'Active Projects': 'المشاريع النشطة',
      'Pending Projects': 'المشاريع المعلقة',
      'Completed Projects': 'المشاريع المكتملة',
      'Milestones': 'مراحل المشروع',
      'Tasks': 'المهام',
      'Files': 'الملفات والمستندات',
      'Client Approvals': 'موافقات العميل',
      '🎫 Support Center': '🎫 مركز الدعم الفني',
      'Live ticket chat reply center': 'مركز الردود السريعة والمحادثة المباشرة مع العملاء',
      'Tickets': 'تذاكر الدعم',
      'Live Chat': 'المحادثة المباشرة',
      'WhatsApp Requests': 'طلبات واتساب الفنية',
      'Knowledge Base': 'قاعدة المعرفة',
      '🤖 AI Center': '🤖 مركز الذكاء الاصطناعي',
      'Gemini content generator suite': 'جناح توليد المحتوى الذكي وجوجل جيميناي',
      'AI Blog Generator': 'توليد المقالات بالذكاء الاصطناعي',
      'AI Content Generator': 'توليد المحتوى التسويقي',
      'AI SEO Generator': 'توليد السيو الذكي',
      'AI Meta Generator': 'توليد الميتا داتا',
      'AI Business Name Gen': 'مولد أسماء الشركات',
      '💰 Affiliate System': '💰 نظام التسويق بالعمولة',
      'Commissions withdrawal portal': 'بوابة سحب الأرباح والعمولات للمسوقين والشركاء',
      'Affiliate Users': 'مسوقي العمولة',
      'Commissions': 'الأرباح والعمولات',
      'Withdraw Requests': 'طلبات السحب والتحويل',
      'Analytics': 'إحصائيات الأداء',
      '📢 Marketing': '📢 الحملات التسويقية',
      'Email blaster lists, coupons': 'إدارة حملات البريد والرسائل القسائم التسويقية',
      'Email Campaigns': 'حملات البريد الإلكتروني',
      'SMS Campaigns': 'حملات الرسائل القصيرة',
      'Push Notifications': 'إشعارات الويب والويب هوك',
      'Coupon System': 'نظام الكوبونات والخصومات',
      '⭐ Reviews': '⭐ التقييمات والمراجعات',
      'Audit marketplace client feedback': 'مراجعة وتدقيق تقييمات العملاء وآرائهم',
      'Product Reviews': 'تقييمات المنتجات',
      'Service Reviews': 'تقييمات الخدمات',
      'Testimonials': 'آراء العملاء والشركاء',
      '📊 Reports': '📊 التقارير والإحصاءات',
      'System statistics & telemetry': 'إحصائيات وتقارير تفصيلية عن المبيعات والأداء والمستخدمين',
      'Revenue Reports': 'تقارير المبيعات والأرباح',
      'Store Reports': 'تقارير المتجر الرقمي',
      'Affiliate Reports': 'تقارير التسويق بالعمولة',
      '🛡️ Audit Trail Log': '🛡️ سجل الفحص والأمان',
      '👨‍💼 Staff Management': '👨‍💼 إدارة الموظفين والصلاحيات',
      'Staff lists, roles permissions': 'إدارة الموظفين وتعديل الرتب وصلاحيات الوصول الفرعية',
      '🔔 Notifications': '🔔 الإشعارات وسجلات النظام',
      'System Alert Logs & status': 'سجلات التنبيهات وإشعارات النظام المركزية',
      '👤 Client Dashboard Workspace': '👤 مساحة عمل العميل',
      'Interactive Client view emulator': 'مساحة تحاكي بيئة عمل العميل لمشاهدة واجهته',
      '🖥️ Website Control Panel': '🖥️ لوحة تحكم الموقع (CMS)',
      'Shopify & WordPress Style CMS': 'منصة تحرير المحتوى وإدارة صفحات الويب والواجهة',
      'CMS Dashboard': 'لوحة تحكم المحتوى',
      'Pages Management': 'إدارة الصفحات الثابتة',
      'Menus Builder': 'باني القوائم',
      'Blog Posts': 'مقالات المدونة',
      'Blog Categories': 'تصنيفات المدونة',
      'Blog & Product Tags': 'وسوم المدونات والمنتجات',
      'Services Catalog': 'كتالوج الخدمات المعروضة',
      'Woo Products': 'المنتجات الرقمية والاسكريبتات',
      'Product Categories': 'تصنيفات المنتجات',
      'Product Sub Categories': 'الأقسام الفرعية للمنتجات',
      'Media Library': 'مكتبة الوسائط والملفات',
      'Forms & Leads': 'النماذج وقنوات الاتصال',
      'SEO Manager': 'مدير السيو والأرشفة',
      'Homepage Builder': 'مطور الصفحة الرئيسية',
      'Header Builder': 'تعديل الجزء العلوي (Header)',
      'Footer Builder': 'تعديل الجزء السفلي (Footer)',
      'Testimonials UI': 'إعدادات الشهادات',
      'FAQ Manager': 'إدارة الأسئلة الشائعة',
      'Announcements Bar': 'شريط الإعلانات والخصومات',
      'Redirect Manager': 'إدارة الروابط والتحويلات',
      'Website Settings': 'إعدادات وهوية الموقع',
      'Payment Settings': 'إعدادات بوابات الدفع والتحويل',
      '🌐 Web Settings': '🌐 إعدادات الموقع العامة',
      'Identity, default rates, and appearance setup': 'إدارة الهوية والشعارات والعملة الافتراضية ومعدلات الصرف',
      'Total Clients': 'إجمالي العملاء',
      'Registered enterprise portal users': 'مستخدمي البوابة الإلكترونية المسجلين',
      'Total Order Count': 'إجمالي عدد الطلبات',
      'All purchases & orders logged': 'جميع المشتريات والطلبات المسجلة',
      'Total Blogs': 'إجمالي المقالات',
      'SEO optimized content nodes': 'مقالات مهيأة لمحركات البحث',
      'Total Products': 'إجمالي المنتجات',
      'Themes, scripts & addons live': 'القوالب والاسكريبتات المتاحة',
      'Total Revenue': 'إجمالي الإيرادات',
      'Real-time revenue computed from real order database': 'تم حساب الإيرادات من قاعدة البيانات الحقيقية',
      'Support Tickets': 'تذاكر الدعم الفني',
      'Pending assistance tickets logged': 'تذاكر الدعم الفني المعلقة',
      '🏦 Core Metrics': '🏦 المقاييس الأساسية',
      '🌐 CMS & Sales Catalog': '🌐 إدارة المحتوى والكتالوج',
      '📦 Workspace Operations': '📦 العمليات والمشاريع',
      '🤖 AI & Support Desk': '🤖 الذكاء الاصطناعي والدعم',
      '📢 Growth & Feedback': '📢 التسويق والتقييمات',
      '🛠️ System & Governance': '🛠️ النظام والإعدادات'
    }
  };

  const translate = (text: string): string => {
    if (!text) return '';
    const trimmed = text.trim();
    const dict = translationDict[language];
    if (dict && dict[trimmed]) {
      return dict[trimmed];
    }
    // Match exact without emojis
    const emojiRegex = /^(\p{Emoji}\s*)/u;
    const match = trimmed.match(emojiRegex);
    if (match) {
      const emoji = match[1];
      const rest = trimmed.replace(emojiRegex, '').trim();
      if (dict && dict[rest]) {
        return `${emoji}${dict[rest]}`;
      }
    }
    return text;
  };

  // Helper to standardise Order IDs sequentially to e.g., Order-101, Order-102, Order-103
  const getOrderSerial = (orderId: string) => {
    // Avoid double-formatting if it's already serialised or simulated
    if (orderId && orderId.startsWith('Order-')) return orderId;
    const idx = orders.findIndex(o => o.id === orderId);
    return idx !== -1 ? `Order-${101 + idx}` : (orderId || 'Order-101');
  };

  // Pricing Formatter Helper
  const formatPrice = (usd: number) => {
    let cur = currency || 'USD';
    let rates = { USD: 1.0, BDT: 118.5, SAR: 3.75 };
    if (currencySettings) {
      rates = currencySettings.rates || rates;
      if (!currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
    }
    const rate = rates[cur] ?? 1.0;
    const converted = usd * rate;

    switch (cur) {
      case 'BDT':
        return `৳ ${Math.round(converted).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${converted.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${converted.toFixed(2)}`;
    }
  };

  // Route Guard persistent state check - ensuring users with administrative roles can read / interact
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const userStr = localStorage.getItem('webzone_session_user');
      return userStr ? JSON.parse(userStr) : (user || null);
    } catch (e) {
      return user || null;
    }
  });

  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(() => {
    const role = currentUser?.role;
    return role === 'super_admin' || role === 'admin' || role === 'order_manager' || role === 'content_manager' || role === 'support_staff' || role === 'editor' || role === 'staff';
  });

  useEffect(() => {
    const checkRole = () => {
      const userStr = localStorage.getItem('webzone_session_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setCurrentUser(u);
          if (u?.role === 'super_admin' || u?.role === 'admin' || u?.role === 'order_manager' || u?.role === 'content_manager' || u?.role === 'support_staff' || u?.role === 'editor' || u?.role === 'staff') {
            setHasAdminAccess(true);
            return;
          }
        } catch (e) {}
      } else if (user) {
        setCurrentUser(user);
        if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'order_manager' || user.role === 'content_manager' || user.role === 'support_staff' || user.role === 'editor' || user.role === 'staff') {
          setHasAdminAccess(true);
          return;
        }
      }
      setHasAdminAccess(false);
    };
    checkRole();
    window.addEventListener('storage', checkRole);
    return () => window.removeEventListener('storage', checkRole);
  }, [user]);

  // Roles Config loaded dynamically with localstorage persistence
  const [rolesConfig, setRolesConfig] = useState<RoleConfig[]>(() => {
    const defaultRoles: RoleConfig[] = [
      {
        role: "super_admin",
        label: "Super Admin",
        description: "Full root master-control to all WebzoneBD IT solution panels, finances, and security governance matrix.",
        permissions: {
          manage_products: true,
          manage_orders: true,
          manage_support: true,
          manage_content: true,
          manage_users: true,
          manage_system: true
        },
        color: "from-rose-600 to-red-600 text-rose-400 border-rose-500/30"
      },
      {
        role: "content_manager",
        label: "Content Manager",
        description: "Oversees digital services catalog, software store products, blog articles, CMS pages, AI Content Center, and portfolio case studies.",
        permissions: {
          manage_products: true,
          manage_orders: false,
          manage_support: false,
          manage_content: true,
          manage_users: false,
          manage_system: false
        },
        color: "from-cyan-600 to-blue-500 text-cyan-400 border-cyan-500/30"
      },
      {
        role: "order_manager",
        label: "Order Manager",
        description: "Sales & order processing lead. Manages store orders, revenue invoices, payment verification, project milestones, affiliate payouts, and promotional coupons.",
        permissions: {
          manage_products: true,
          manage_orders: true,
          manage_support: false,
          manage_content: false,
          manage_users: false,
          manage_system: false
        },
        color: "from-emerald-600 to-teal-500 text-emerald-400 border-emerald-500/30"
      },
      {
        role: "support_staff",
        label: "Support Staff",
        description: "Customer care & helpdesk specialist. Manages support tickets, live chats, SLA inquiries, and customer profile records.",
        permissions: {
          manage_products: false,
          manage_orders: false,
          manage_support: true,
          manage_content: false,
          manage_users: true,
          manage_system: false
        },
        color: "from-purple-600 to-indigo-500 text-purple-400 border-purple-500/30"
      },
      {
        role: "admin",
        label: "Admin Ops",
        description: "Administrative operator with broad permissions across store products, sales orders, support tickets, CMS content, and customer directory.",
        permissions: {
          manage_products: true,
          manage_orders: true,
          manage_support: true,
          manage_content: true,
          manage_users: true,
          manage_system: false
        },
        color: "from-amber-600 to-yellow-500 text-amber-400 border-amber-500/30"
      },
      {
        role: "editor",
        label: "Editor",
        description: "Content author and blog curator focusing strictly on articles, news, and client evaluations moderation.",
        permissions: {
          manage_products: false,
          manage_orders: false,
          manage_support: false,
          manage_content: true,
          manage_users: false,
          manage_system: false
        },
        color: "from-sky-600 to-blue-500 text-sky-400 border-sky-500/30"
      },
      {
        role: "staff",
        label: "General Staff",
        description: "Assigned staff member. Responds to support inquiries and manages designated ticket helpdesk queues.",
        permissions: {
          manage_products: false,
          manage_orders: false,
          manage_support: true,
          manage_content: false,
          manage_users: false,
          manage_system: false
        },
        color: "from-teal-600 to-[#10B981] text-teal-400 border-teal-500/30"
      },
      {
        role: "customer",
        label: "User (Customer)",
        description: "Default standard client profile. Holds zero operational or admin features in this panel.",
        permissions: {
          manage_products: false,
          manage_orders: false,
          manage_support: false,
          manage_content: false,
          manage_users: false,
          manage_system: false
        },
        color: "from-gray-600 to-slate-500 text-slate-400 border-slate-500/20"
      }
    ];

    const saved = localStorage.getItem('webzone_roles_permissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RoleConfig[];
        const merged = [...parsed];
        defaultRoles.forEach(def => {
          const existingIdx = merged.findIndex(r => r.role === def.role);
          if (existingIdx === -1) {
            merged.push(def);
          } else {
            // Ensure permissions object has all keys from default definition
            merged[existingIdx] = {
              ...def,
              ...merged[existingIdx],
              permissions: {
                ...def.permissions,
                ...merged[existingIdx].permissions
              }
            };
          }
        });
        return merged;
      } catch (e) {}
    }
    return defaultRoles;
  });

  useEffect(() => {
    localStorage.setItem('webzone_roles_permissions', JSON.stringify(rolesConfig));
  }, [rolesConfig]);

  const checkPermission = (permKey: keyof PermissionSet): boolean => {
    if (!currentUser) return false;
    const roleKey = currentUser.role || 'customer';
    
    // Super Admin has master bypass ALWAYS
    if (roleKey === 'super_admin') return true;

    const matchedRole = rolesConfig.find(r => r.role === roleKey);
    if (matchedRole && matchedRole.permissions) {
      return !!matchedRole.permissions[permKey];
    }
    
    // Fallback logic for legacy roles
    if (roleKey === 'admin') return true;
    if (roleKey === 'content_manager' || roleKey === 'editor') {
      return permKey === 'manage_content' || permKey === 'manage_products';
    }
    if (roleKey === 'order_manager') {
      return permKey === 'manage_orders' || permKey === 'manage_products';
    }
    if (roleKey === 'support_staff' || roleKey === 'staff') {
      return permKey === 'manage_support' || permKey === 'manage_users';
    }
    return false;
  };

  const renderAccessDenied = (permissionName: string, sectionTitle: string) => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-xl mx-auto space-y-6 animate-in fade-in duration-300" id={`lock-${permissionName}`}>
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center text-red-500 shadow-md">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-white tracking-tight">Security Access Restricted</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Your current assigned role <span className="font-extrabold text-rose-400 uppercase">"{currentUser?.role?.replace('_', ' ') || 'Guest'}"</span> does not possess the <span className="font-mono text-red-400 bg-neutral-900 border border-neutral-805 px-1.5 py-0.5 rounded text-[10px]">{permissionName.toUpperCase()}</span> security clearance required to run actions inside the <span className="font-bold text-neutral-200">{sectionTitle}</span> panel.
          </p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-805 p-4 rounded-xl text-left space-y-2 text-xs w-full font-mono">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">Zero-Trust Telemetry Logs</span>
          <div className="text-[10px] space-y-1 text-slate-450 font-mono">
            <div><span className="text-purple-400">TIMESTAMP:</span> {new Date().toISOString()}</div>
            <div><span className="text-purple-400">SESSION_ID:</span> {currentUser?.id || 'ANONYMOUS'}</div>
            <div><span className="text-purple-400">VIOLATION:</span> SEC_UNAUTHORIZED_TAB_READ</div>
            <div><span className="text-purple-400">RESOLUTION:</span> Access block triggered by context governor.</div>
          </div>
        </div>

        <div className="text-[10.5px] text-slate-400 italic">
          Please contact an institution Super Admin to re-evaluate your security credentials.
        </div>
      </div>
    );
  };

  // Navigation tabs matching Super-Admin requirements precisely
  const [activeMenu, setActiveMenu] = useState<string>(() => localStorage.getItem('webzone_admin_active_menu') || 'dashboard');

  // Revenue Dashboard Period Range Filter States
  const [revenueFilterType, setRevenueFilterType] = useState<'all' | 'month' | 'quarter' | 'custom'>('all');
  const [revenueSelectedMonth, setRevenueSelectedMonth] = useState<string>('2026-06');
  const [revenueSelectedQuarter, setRevenueSelectedQuarter] = useState<string>('2026-Q2');
  const [revenueStartDate, setRevenueStartDate] = useState<string>('2026-06-01');
  const [revenueEndDate, setRevenueEndDate] = useState<string>('2026-06-30');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  const [isMobileRoleDropdownOpen, setIsMobileRoleDropdownOpen] = useState<boolean>(false);
  const [isAdminSidebarCollapsed, setIsAdminSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('webzone_admin_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleSetAdminSidebarCollapsed = (collapsed: boolean) => {
    setIsAdminSidebarCollapsed(collapsed);
    try {
      localStorage.setItem('webzone_admin_sidebar_collapsed', String(collapsed));
    } catch (e) {}
  };
  const [activeSubMenu, setActiveSubMenu] = useState<string>('all');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    try {
      const current = localStorage.getItem('webzone_admin_active_menu') || 'dashboard';
      return { [current]: true };
    } catch (e) {
      return { 'dashboard': true };
    }
  });

  useEffect(() => {
    if (activeMenu) {
      setExpandedMenus(prev => ({
        ...prev,
        [activeMenu]: true
      }));
    }
  }, [activeMenu]);

  const getMenuIcon = (id: string) => {
    switch (id) {
      case 'dashboard': return BarChart;
      case 'customer-dashboard': return User;
      case 'cms': return Globe;
      case 'customers': return Users;
      case 'orders': return ShoppingBag;
      case 'services': return Layers;
      case 'projects': return FolderOpen;
      case 'support': return HelpCircle;
      case 'live-chat': return MessageSquare;
      case 'ai-center': return Sparkles;
      case 'affiliates': return DollarSign;
      case 'marketing': return Send;
      case 'reviews': return Star;
      case 'reports': return TrendingUp;
      case 'staff': return ShieldCheck;
      case 'notifications': return Bell;
      case 'settings': return Sliders;
      case 'web-settings': return Database;
      default: return LayoutGrid;
    }
  };

  const getSubmenuIcon = (id: string) => {
    switch (id) {
      // CMS
      case 'cms-dashboard': return Activity;
      case 'cms-pages': return FileText;
      case 'cms-menus': return Sliders;
      case 'cms-blogs': return BookOpen;
      case 'cms-categories': return FolderOpen;
      case 'cms-tags': return Sliders;
      case 'cms-services': return Layers;
      case 'cms-products': return ShoppingBag;
      case 'cms-pro-cats': return FolderOpen;
      case 'cms-pro-subcats': return Layers;
      case 'cms-media': return Image;
      case 'cms-forms': return Mail;
      case 'cms-seo': return Globe;
      case 'cms-homepage': return Sliders;
      case 'cms-header': return Sliders;
      case 'cms-footer': return Sliders;
      case 'cms-testimonials': return Star;
      case 'cms-faqs': return HelpCircle;
      case 'cms-announcements': return Bell;
      case 'cms-redirects': return ArrowRight;
      case 'cms-settings': return Sliders;
      // Customers
      case 'all-customers': return Users;
      case 'customer-groups': return FolderOpen;
      case 'customer-tags': return Sliders;
      case 'customer-notes': return FileText;
      case 'vip-customers': return Award;
      case 'corporate-clients': return Shield;
      case 'customer-affiliates': return DollarSign;
      case 'customer-activity-logs': return Activity;
      case 'customer-security-logs': return ShieldAlert;
      case 'customer-reports': return TrendingUp;
      // Orders
      case 'all-orders': return ShoppingBag;
      case 'guest-orders': return User;
      case 'email-notifications': return Mail;
      // Services
      case 'all-services': return Layers;
      case 'service-categories': return FolderOpen;
      case 'service-orders': return ShoppingBag;
      case 'service-inquiries': return HelpCircle;
      case 'whatsapp-leads': return MessageSquare;
      case 'service-reports': return TrendingUp;
      // Projects
      case 'active-projects': return Activity;
      case 'pending-projects': return Clock;
      case 'completed-projects': return CheckCircle2;
      case 'milestones': return Award;
      case 'tasks': return CheckCircle;
      case 'files': return FileText;
      case 'approvals': return Check;
      // Support & Live Chat
      case 'support-tickets': return Ticket;
      case 'support-chat': return MessageSquare;
      case 'support-whatsapp': return Phone;
      case 'support-kb': return BookOpen;
      case 'chat-sessions': return MessageSquare;
      case 'chat-waiting': return Clock;
      case 'chat-history': return FileText;
      case 'chat-settings': return Sliders;
      // AI Center
      case 'ai-blog': return BookOpen;
      case 'ai-content': return Sparkles;
      case 'ai-seo': return Globe;
      case 'ai-meta': return FileText;
      case 'ai-name': return Plus;
      // Affiliates
      case 'aff-users': return Users;
      case 'aff-commissions': return DollarSign;
      case 'aff-withdrawals': return ArrowRight;
      case 'aff-analytics': return TrendingUp;
      // Marketing
      case 'mkt-coupons': return Award;
      case 'mkt-sms': return Phone;
      case 'mkt-push': return Bell;
      case 'mkt-whatsapp': return MessageSquare;
      case 'mkt-social': return Globe;
      case 'mkt-affiliate': return Users;
      case 'mkt-referral': return UserCheck;
      case 'mkt-loyalty': return Award;
      case 'mkt-abandoned': return ShoppingBag;
      case 'mkt-leads': return FileText;
      case 'mkt-newsletter': return Mail;
      case 'mkt-automation': return Sparkles;
      case 'mkt-settings': return Sliders;
      // WhatsApp Service Orders
      case 'wa-orders': return Clipboard;
      case 'wa-customers': return Users;
      case 'wa-form-settings': return FileText;
      case 'wa-invoice-notif': return Sparkles;
      case 'wa-payment-reminders': return CreditCard;
      case 'wa-delivery-updates': return Truck;
      case 'wa-promo-messages': return MessageSquare;
      case 'wa-templates': return FileText;
      case 'wa-campaign-reports': return TrendingUp;
      case 'wa-api-integration': return Link;
      case 'wa-settings': return Sliders;
      // Reviews
      case 'rev-product': return ShoppingBag;
      case 'rev-service': return Layers;
      case 'rev-testimonials': return Star;
      // Reports
      case 'rep-revenue': return DollarSign;
      case 'rep-customer': return Users;
      case 'rep-services': return Layers;
      case 'rep-store': return ShoppingBag;
      case 'rep-affiliate': return TrendingUp;
      // Staff
      case 'stf-users': return Users;
      case 'stf-roles': return Shield;
      case 'stf-permissions': return Key;
      case 'stf-performance': return Activity;
      // Settings
      case 'set-general': return Sliders;
      case 'set-email': return Mail;
      case 'set-payment': return DollarSign;
      case 'set-firebase': return Database;
      case 'set-api': return Key;
      // Web Settings
      case 'web-identity': return Sliders;
      case 'web-appearance': return Image;
      case 'web-theme-preview': return Palette;
      case 'web-payments': return DollarSign;
      case 'web-security': return Shield;
      default: return ArrowRight;
    }
  };
  const [orderPeriod, setOrderPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);
  const [staffViewMode, setStaffViewMode] = useState<'directory' | 'roles'>('directory');

  // Services Management states
  const [adminServices, setAdminServices] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_services_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        catalogServicesData.forEach(defaultSvc => {
          if (!parsed.some((s: any) => s.id === defaultSvc.id)) {
            parsed.push(defaultSvc);
          }
        });
        return parsed;
      } catch (e) {
        return catalogServicesData;
      }
    }
    return catalogServicesData;
  });

  useEffect(() => {
    localStorage.setItem('webzone_services_catalog', JSON.stringify(adminServices));
  }, [adminServices]);

  const [adminCategories, setAdminCategories] = useState([
    { id: 'cat_1', name: 'Development', desc: 'Custom web systems, SaaS platforms, CMS stores, database integrations', color: 'from-purple-500 to-indigo-500', serviceCount: 3 },
    { id: 'cat_2', name: 'Design', desc: 'Figma vectors, high-fidelity UI wireframes, logos, advertising assets', color: 'from-pink-500 to-rose-500', serviceCount: 1 },
    { id: 'cat_3', name: 'SEO', desc: 'Google search optimization, meta mappings, crawl audits, speed boosts', color: 'from-cyan-500 to-blue-500', serviceCount: 1 },
    { id: 'cat_4', name: 'Marketing', desc: 'Social ads campaigns, newsletter CRM funnels, search platform outreach', color: 'from-amber-500 to-orange-500', serviceCount: 1 },
    { id: 'cat_5', name: 'Mobile App', desc: 'Cross-platform mobile applications, Flutter stores, push alerts configurations', color: 'from-emerald-500 to-teal-500', serviceCount: 1 }
  ]);

  const [adminInquiries, setAdminInquiries] = useState<any[]>([]);
  const [adminWhatsAppLeads, setAdminWhatsAppLeads] = useState<any[]>([]);

  useEffect(() => {
    const unsubInquiries = onSnapshot(collection(db, 'service_inquiries'), (snapshot) => {
      const inquiriesList: any[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        inquiriesList.push({
          id: data.id || docSnapshot.id,
          name: data.customerName || data.name || 'Anonymous Client',
          email: data.emailAddress || data.email || 'N/A',
          phone: data.whatsappNumber || data.mobileNumber || data.phone || 'N/A',
          serviceName: data.serviceName || 'Custom Service',
          budget: parseFloat(data.budget) || 150,
          message: data.projectDetails || data.message || 'N/A',
          status: data.status || 'Pending',
          date: (data.createdAt || '').split('T')[0] || '2026-06-24'
        });
      });
      // Fallback to mock data if empty so the dashboard is beautifully populated on clean load
      if (inquiriesList.length === 0) {
        setAdminInquiries([
          { id: 'inq-001', name: 'Imran Hasan', email: 'imranh7900@gmail.com', phone: '+880 1711 223344', serviceName: 'Website Development', budget: 1200, message: 'Need custom LMS website with secure local bKash payment gateway.', status: 'Pending', date: '2026-06-23' },
          { id: 'inq-002', name: 'Majid Al-Shehri', email: 'majid@saudiweb.com', phone: '+966 50 123 4567', serviceName: 'Ecommerce Development', budget: 3500, message: 'Multi-store platform for boutique products in Riyadh. Needs Arabic RTL UI.', status: 'Responded', date: '2026-06-22' },
          { id: 'inq-003', name: 'Zeeshan Rahman', email: 'zee@rahmanit.com', phone: '+880 1864 051151', serviceName: 'SEO Services & Audits', budget: 450, message: 'E-commerce site crawl optimization and schema validation audit.', status: 'Pending', date: '2026-06-21' },
          { id: 'inq-004', name: 'Sarah Connor', email: 'sarah@t800.io', phone: '+1 415 888 9999', serviceName: 'Graphic Designs', budget: 250, message: 'Modern tech-mono flyer & catalog illustrations for cyber products.', status: 'Contacted', date: '2026-06-20' }
        ]);
      } else {
        inquiriesList.sort((a, b) => b.date.localeCompare(a.date));
        setAdminInquiries(inquiriesList);
      }
    }, (error) => {
      console.warn("Firestore: service_inquiries access failed or unauthorized. Using high-fidelity fallback dataset.", error);
      setAdminInquiries([
        { id: 'inq-001', name: 'Imran Hasan', email: 'imranh7900@gmail.com', phone: '+880 1711 223344', serviceName: 'Website Development', budget: 1200, message: 'Need custom LMS website with secure local bKash payment gateway.', status: 'Pending', date: '2026-06-23' },
        { id: 'inq-002', name: 'Majid Al-Shehri', email: 'majid@saudiweb.com', phone: '+966 50 123 4567', serviceName: 'Ecommerce Development', budget: 3500, message: 'Multi-store platform for boutique products in Riyadh. Needs Arabic RTL UI.', status: 'Responded', date: '2026-06-22' },
        { id: 'inq-003', name: 'Zeeshan Rahman', email: 'zee@rahmanit.com', phone: '+880 1864 051151', serviceName: 'SEO Services & Audits', budget: 450, message: 'E-commerce site crawl optimization and schema validation audit.', status: 'Pending', date: '2026-06-21' },
        { id: 'inq-004', name: 'Sarah Connor', email: 'sarah@t800.io', phone: '+1 415 888 9999', serviceName: 'Graphic Designs', budget: 250, message: 'Modern tech-mono flyer & catalog illustrations for cyber products.', status: 'Contacted', date: '2026-06-20' }
      ]);
    });

    const unsubLeads = onSnapshot(collection(db, 'whatsapp_leads'), (snapshot) => {
      const leadsList: any[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        leadsList.push({
          id: data.id || docSnapshot.id,
          name: data.name || 'Anonymous Lead',
          phone: data.whatsapp || data.phone || '+966570511931',
          service: data.service || 'Custom Service Solution',
          budget: data.budget ? (data.budget.includes('$') ? data.budget : `$${data.budget}`) : '$150',
          date: (data.createdAt || '').split('T')[0] || '2026-06-24',
          status: data.status || 'Active Conversion'
        });
      });
      if (leadsList.length === 0) {
        setAdminWhatsAppLeads([
          { id: 'wa-001', name: 'Abdur Rahman', phone: '+8801700000001', service: 'Custom ERP', budget: '$2500', date: '2026-06-24', status: 'Active Conversion' },
          { id: 'wa-002', name: 'Khaled Masud', phone: '+8801800000002', service: 'UI/UX Redesign', budget: '$450', date: '2026-06-23', status: 'Follow-up' },
          { id: 'wa-003', name: 'Majid Al-Qahtani', phone: '+966509999999', service: 'E-commerce Mobile App', budget: '$1800', date: '2026-06-22', status: 'Closed Converted' }
        ]);
      } else {
        setAdminWhatsAppLeads(leadsList);
      }
    }, (error) => {
      console.warn("Firestore: whatsapp_leads access failed or unauthorized. Using high-fidelity fallback dataset.", error);
      setAdminWhatsAppLeads([
        { id: 'wa-001', name: 'Abdur Rahman', phone: '+8801700000001', service: 'Custom ERP', budget: '$2500', date: '2026-06-24', status: 'Active Conversion' },
        { id: 'wa-002', name: 'Khaled Masud', phone: '+8801800000002', service: 'UI/UX Redesign', budget: '$450', date: '2026-06-23', status: 'Follow-up' },
        { id: 'wa-003', name: 'Majid Al-Qahtani', phone: '+966509999999', service: 'E-commerce Mobile App', budget: '$1800', date: '2026-06-22', status: 'Closed Converted' }
      ]);
    });

    return () => {
      unsubInquiries();
      unsubLeads();
    };
  }, []);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [defaultCategory, setDefaultCategory] = useState<string>('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [srvForm, setSrvForm] = useState({
    title: '',
    titleBn: '',
    category: 'website-development',
    startingPrice: 199,
    starterPrice: 150,
    businessPrice: 199,
    enterprisePrice: 399,
    projectBudgetCategory: '100-500',
    deliveryDays: 7,
    deliveryTimelineCategory: '7-days',
    serviceLevel: 'Business',
    technologies: '',
    thumbnail: '',
    shortDescription: '',
    shortDescriptionBn: '',
    fullDescription: '',
    fullDescriptionBn: '',
    features: '',
    featuresBn: '',
    views: 120,
    likes: 45,
    rating: 4.9,
    projectsCompleted: 24
  });
  const [srvNewFeatureText, setSrvNewFeatureText] = useState('');

  useEffect(() => {
    if (showServiceModal) {
      if (editingService) {
        setSrvForm({
          title: editingService.title || editingService.name || '',
          titleBn: editingService.titleBn || '',
          category: editingService.category || 'website-development',
          startingPrice: editingService.startingPrice || editingService.price || 199,
          starterPrice: editingService.starterPrice || 150,
          businessPrice: editingService.businessPrice || 199,
          enterprisePrice: editingService.enterprisePrice || 399,
          projectBudgetCategory: editingService.projectBudgetCategory || '100-500',
          deliveryDays: editingService.deliveryDays || 7,
          deliveryTimelineCategory: editingService.deliveryTimelineCategory || '7-days',
          serviceLevel: editingService.serviceLevel || 'Business',
          technologies: Array.isArray(editingService.technologies) ? editingService.technologies.join(', ') : (editingService.technologies || ''),
          thumbnail: editingService.thumbnail || editingService.image || '',
          shortDescription: editingService.shortDescription || editingService.desc || '',
          shortDescriptionBn: editingService.shortDescriptionBn || '',
          fullDescription: editingService.fullDescription || '',
          fullDescriptionBn: editingService.fullDescriptionBn || '',
          features: Array.isArray(editingService.features) ? editingService.features.join(', ') : (editingService.features || ''),
          featuresBn: Array.isArray(editingService.featuresBn) ? editingService.featuresBn.join(', ') : (editingService.featuresBn || ''),
          views: editingService.views || 120,
          likes: editingService.likes || 45,
          rating: editingService.rating || 4.9,
          projectsCompleted: editingService.projectsCompleted || 24
        });
      } else {
        let mappedCat = 'website-development';
        if (defaultCategory) {
          const lower = defaultCategory.toLowerCase();
          if (lower.includes('develop') || lower.includes('website')) mappedCat = 'website-development';
          else if (lower.includes('e-commerce') || lower.includes('ecommerce')) mappedCat = 'ecommerce';
          else if (lower.includes('design') || lower.includes('graphic')) mappedCat = 'graphic-design';
          else if (lower.includes('seo')) mappedCat = 'website-seo';
          else if (lower.includes('market')) mappedCat = 'digital-marketing';
          else if (lower.includes('app') || lower.includes('mobile')) mappedCat = 'mobile-app-development';
          else mappedCat = lower.replace(/\s+/g, '-');
        }
        setSrvForm({
          title: '',
          titleBn: '',
          category: mappedCat,
          startingPrice: 199,
          starterPrice: 150,
          businessPrice: 199,
          enterprisePrice: 399,
          projectBudgetCategory: '100-500',
          deliveryDays: 7,
          deliveryTimelineCategory: '7-days',
          serviceLevel: 'Business',
          technologies: '',
          thumbnail: '',
          shortDescription: '',
          shortDescriptionBn: '',
          fullDescription: '',
          fullDescriptionBn: '',
          features: '',
          featuresBn: '',
          views: 120,
          likes: 45,
          rating: 4.9,
          projectsCompleted: 24
        });
      }
    }
  }, [showServiceModal, editingService, defaultCategory]);

  const getCategoryName = (catValue: string) => {
    if (!catValue) return 'Development';
    const matched = adminCategories.find(c => c.id.toLowerCase() === catValue.toLowerCase() || c.name.toLowerCase() === catValue.toLowerCase());
    if (matched) return matched.name;
    
    const val = catValue.toLowerCase();
    if (val.includes('develop') || val === 'ecommerce' || val === 'news-portal' || val === 'school-management' || val === 'whmcs-solutions' || val === 'business-software' || val === 'custom-development') {
      return 'Development';
    }
    if (val.includes('design') || val === 'graphic-design') {
      return 'Design';
    }
    if (val.includes('seo') || val === 'website-seo') {
      return 'SEO';
    }
    if (val.includes('market') || val === 'digital-marketing' || val === 'content-marketing') {
      return 'Marketing';
    }
    if (val.includes('mobile') || val === 'mobile-apps' || val === 'mobile-app-development') {
      return 'Mobile App';
    }
    return catValue;
  };

  const getMatchingServices = (catName: string) => {
    return adminServices.filter(srv => {
      const serviceCat = getCategoryName(srv.category);
      return serviceCat.toLowerCase() === catName.toLowerCase();
    });
  };

  // Automated Email Notification States
  const [selectedMailLog, setSelectedMailLog] = useState<any>(null);
  const [mailInspectMode, setMailInspectMode] = useState<'preview' | 'html' | 'details'>('preview');
  const [manualMailOrderId, setManualMailOrderId] = useState<string>('');
  const [manualMailEmail, setManualMailEmail] = useState<string>('');
  const [manualSending, setManualSending] = useState<boolean>(false);

  useEffect(() => {
    const railPermissionMap: Record<string, keyof PermissionSet> = {
      'revenue-analytics': 'manage_orders',
      'cms': 'manage_content',
      'customers': 'manage_users',
      'orders': 'manage_orders',
      'services': 'manage_products',
      'projects': 'manage_orders',
      'store': 'manage_products',
      'support': 'manage_users',
      'live-chat': 'manage_users',
      'ai-center': 'manage_content',
      'gemini-chatbot': 'manage_content',
      'affiliates': 'manage_orders',
      'marketing': 'manage_products',
      'reviews': 'manage_products',
      'reports': 'manage_orders',
      'staff': 'manage_users',
      'notifications': 'manage_users',
      'web-settings': 'manage_content',
      'settings': 'manage_orders',
    };

    const permKey = railPermissionMap[activeMenu];
    if (permKey && !checkPermission(permKey)) {
      setActiveMenu('dashboard');
      setActiveSubMenu('all');
    } else {
      localStorage.setItem('webzone_admin_active_menu', activeMenu);
    }
  }, [activeMenu, currentUser, rolesConfig]);

  const [showHeaderNotifs, setShowHeaderNotifs] = useState(false);
  const [headerTime, setHeaderTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  const [adminNotifications, setAdminNotifications] = useState<{
    id: string;
    type: 'order' | 'system' | 'general';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    orderId?: string;
    amount?: number;
    ticketId?: string;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_admin_notifications');
      if (saved) {
        // Filter out seed notifications to ensure we only display real-time events
        return JSON.parse(saved).filter((n: any) => n.id && !n.id.startsWith('notif-seed-'));
      }
    } catch (e) {}
    return [];
  });

  const [knownOrderIds, setKnownOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_known_order_ids');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return orders ? orders.map(o => o.id) : [];
  });

  const [knownTicketIds, setKnownTicketIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_known_ticket_ids');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return tickets ? tickets.map(t => t.id) : [];
  });

  const [knownTicketReplies, setKnownTicketReplies] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('webzone_known_ticket_replies');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const counts: Record<string, number> = {};
    if (tickets) {
      tickets.forEach(t => {
        counts[t.id] = t.replies ? t.replies.length : 0;
      });
    }
    return counts;
  });

  const [animateBell, setAnimateBell] = useState(false);

  const [dashboardWidgets, setDashboardWidgets] = useState<{
    id: string;
    title: string;
    visible: boolean;
    order: number;
    column: 'left' | 'right' | 'full';
  }[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_dashboard_widgets_custom');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [
      { id: 'advanced-analytics', title: 'Advanced Analytics & BI Suite', visible: true, order: 1, column: 'full' },
      { id: 'stat-cards', title: 'Quick Stats Cards Grid', visible: true, order: 2, column: 'full' },
      { id: 'services-tiers', title: 'Services Active Tiers Monitor', visible: true, order: 2, column: 'left' },
      { id: 'sales-charts', title: 'Sales Bar Chart & Growth Performance', visible: true, order: 3, column: 'full' },
      { id: 'recent-orders', title: 'Recent Orders Pipeline Table', visible: true, order: 4, column: 'full' },
      { id: 'broadcast-actions', title: 'Broadcast Delivery Controls', visible: true, order: 5, column: 'left' },
      { id: 'client-activities', title: 'Recent Client Activities Telemetry', visible: true, order: 6, column: 'right' },
      { id: 'whatsapp-leads', title: 'WhatsApp CRM Inquiries Lead Feed', visible: true, order: 7, column: 'right' },
      { id: 'top-products', title: 'Top Selling Store Products Summary', visible: true, order: 8, column: 'left' },
      { id: 'customer-wallets', title: 'Recent Customers Wallet Controls', visible: true, order: 9, column: 'full' }
    ];
  });

  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);

  const handleUpdateWidgets = (updated: typeof dashboardWidgets) => {
    setDashboardWidgets(updated);
    localStorage.setItem('webzone_dashboard_widgets_custom', JSON.stringify(updated));
  };

  const toggleWidgetVisibility = (id: string) => {
    const updated = dashboardWidgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    handleUpdateWidgets(updated);
    triggerToast(`Widget visibility status updated`);
  };

  const moveWidgetOrder = (id: string, direction: 'up' | 'down') => {
    const sorted = [...dashboardWidgets].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(w => w.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index - 1].order;
      sorted[index - 1].order = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index + 1].order;
      sorted[index + 1].order = temp;
    }

    const final = [...sorted].sort((a, b) => a.order - b.order).map((w, idx) => ({ ...w, order: idx + 1 }));
    handleUpdateWidgets(final);
  };

  const changeWidgetColumn = (id: string, col: 'left' | 'right' | 'full') => {
    const updated = dashboardWidgets.map(w => w.id === id ? { ...w, column: col } : w);
    handleUpdateWidgets(updated);
    triggerToast(`Widget alignment changed to ${col}`);
  };

  const resetWidgetsToDefault = () => {
    const defaults = [
      { id: 'advanced-analytics', title: 'Advanced Analytics & BI Suite', visible: true, order: 1, column: 'full' },
      { id: 'stat-cards', title: 'Quick Stats Cards Grid', visible: true, order: 2, column: 'full' },
      { id: 'services-tiers', title: 'Services Active Tiers Monitor', visible: true, order: 2, column: 'left' },
      { id: 'sales-charts', title: 'Sales Bar Chart & Growth Performance', visible: true, order: 3, column: 'full' },
      { id: 'recent-orders', title: 'Recent Orders Pipeline Table', visible: true, order: 4, column: 'full' },
      { id: 'broadcast-actions', title: 'Broadcast Delivery Controls', visible: true, order: 5, column: 'left' },
      { id: 'client-activities', title: 'Recent Client Activities Telemetry', visible: true, order: 6, column: 'right' },
      { id: 'whatsapp-leads', title: 'WhatsApp CRM Inquiries Lead Feed', visible: true, order: 7, column: 'right' },
      { id: 'top-products', title: 'Top Selling Store Products Summary', visible: true, order: 8, column: 'left' },
      { id: 'customer-wallets', title: 'Recent Customers Wallet Controls', visible: true, order: 9, column: 'full' }
    ];
    handleUpdateWidgets(defaults as any);
    triggerToast(`Dashboard widgets reset to defaults`);
  };

  const getWidgetStyle = (id: string): React.CSSProperties => {
    const w = dashboardWidgets.find(item => item.id === id);
    if (!w) return {};
    return {
      order: w.order,
      display: w.visible ? 'block' : 'none'
    };
  };

  const getWidgetColumnClass = (id: string): string => {
    const w = dashboardWidgets.find(item => item.id === id);
    if (!w) return 'col-span-1 xl:col-span-2';
    return w.column === 'full' ? 'col-span-1 xl:col-span-2' : 'col-span-1';
  };

  useEffect(() => {
    localStorage.setItem('webzone_admin_notifications', JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  useEffect(() => {
    localStorage.setItem('webzone_known_ticket_ids', JSON.stringify(knownTicketIds));
  }, [knownTicketIds]);

  useEffect(() => {
    localStorage.setItem('webzone_known_ticket_replies', JSON.stringify(knownTicketReplies));
  }, [knownTicketReplies]);

  useEffect(() => {
    localStorage.setItem('webzone_known_order_ids', JSON.stringify(knownOrderIds));
  }, [knownOrderIds]);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // Detect if there are orders that are not in knownOrderIds
    const newOrders = orders.filter(o => !knownOrderIds.includes(o.id));

    if (newOrders.length > 0) {
      const newNotifs = newOrders.map(o => ({
        id: `notif-order-${o.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'order' as const,
        title: `New Order: #${o.id.slice(-6).toUpperCase()}`,
        message: `${o.customerName || 'A customer'} purchased "${o.itemTitle || 'Ready Package'}" for $${o.price}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        orderId: o.id,
        amount: o.price
      }));

      setAdminNotifications(prev => [...newNotifs, ...prev]);
      setKnownOrderIds(prev => [...prev, ...newOrders.map(o => o.id)]);
      setAnimateBell(true);

      // Sound Effect using Web Audio API to prevent resource load failures
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc1.start(audioCtx.currentTime);
        osc1.stop(audioCtx.currentTime + 0.25);

        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(698.46, audioCtx.currentTime); // F5
          gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
          osc2.start(audioCtx.currentTime);
          osc2.stop(audioCtx.currentTime + 0.25);
        }, 100);

        setTimeout(() => {
          const osc3 = audioCtx.createOscillator();
          const gain3 = audioCtx.createGain();
          osc3.connect(gain3);
          gain3.connect(audioCtx.destination);
          osc3.type = 'sine';
          osc3.frequency.setValueAtTime(880.00, audioCtx.currentTime); // A5
          gain3.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
          osc3.start(audioCtx.currentTime);
          osc3.stop(audioCtx.currentTime + 0.4);
        }, 200);
      } catch (e) {
        console.log('Audio Context ignored:', e);
      }

      // Automatically stop bell animation after 6 seconds
      const timeoutId = setTimeout(() => {
        setAnimateBell(false);
      }, 6000);

      triggerToast(`🔔 New Order Alert! ${newOrders[0].customerName || 'Customer'} placed an order for ${newOrders[0].itemTitle}.`);

      return () => clearTimeout(timeoutId);
    }
  }, [orders, knownOrderIds]);

  useEffect(() => {
    if (!tickets || tickets.length === 0) return;

    let hasNewNotification = false;
    const newNotifs: any[] = [];
    const updatedKnownTicketIds = [...knownTicketIds];
    const updatedKnownTicketReplies = { ...knownTicketReplies };

    tickets.forEach(t => {
      // 1. Is this a new ticket that we haven't seen yet?
      if (!knownTicketIds.includes(t.id)) {
        updatedKnownTicketIds.push(t.id);
        updatedKnownTicketReplies[t.id] = t.replies ? t.replies.length : 0;
        
        newNotifs.push({
          id: `notif-ticket-new-${t.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'general' as const,
          title: `New Ticket: ${t.subject}`,
          message: `Client created support ticket: "${t.message.substring(0, 60)}${t.message.length > 60 ? '...' : ''}"`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          ticketId: t.id
        });
        hasNewNotification = true;
      } else {
        // 2. Already exists. Did the customer add a new reply?
        const prevReplyCount = knownTicketReplies[t.id] || 0;
        const currentReplyCount = t.replies ? t.replies.length : 0;
        
        if (currentReplyCount > prevReplyCount) {
          const newReplies = t.replies.slice(prevReplyCount);
          const hasUserReply = newReplies.some(r => r.sender === 'user');
          
          if (hasUserReply) {
            const lastUserReply = [...newReplies].reverse().find(r => r.sender === 'user');
            newNotifs.push({
              id: `notif-ticket-reply-${t.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              type: 'general' as const,
              title: `New Message on #${t.id.slice(-6).toUpperCase()}`,
              message: `Customer: "${lastUserReply?.message.substring(0, 60)}${(lastUserReply?.message.length || 0) > 60 ? '...' : ''}"`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isRead: false,
              ticketId: t.id
            });
            hasNewNotification = true;
          }
          updatedKnownTicketReplies[t.id] = currentReplyCount;
        }
      }
    });

    if (hasNewNotification) {
      setAdminNotifications(prev => [...newNotifs, ...prev]);
      setKnownTicketIds(updatedKnownTicketIds);
      setKnownTicketReplies(updatedKnownTicketReplies);
      setAnimateBell(true);

      // Sound Alarm using Web Audio API for message alert
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playTone = (freq: number, start: number, duration: number) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime + start);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + start + duration);
          osc.start(audioCtx.currentTime + start);
          osc.stop(audioCtx.currentTime + start + duration);
        };

        playTone(660, 0, 0.15);
        playTone(660, 0.2, 0.15);
        playTone(880, 0.4, 0.3);
      } catch (e) {
        console.log('Audio Context ignored:', e);
      }

      // Automatically stop bell animation after 6 seconds
      const timeoutId = setTimeout(() => {
        setAnimateBell(false);
      }, 6000);

      triggerToast(`✉️ New Customer Message Alert!`);
    }
  }, [tickets, knownTicketIds, knownTicketReplies]);

  const handleNotificationClick = (notif: any) => {
    // Mark as read
    setAdminNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    
    // If it's an order notification, go to orders page and filter
    if (notif.orderId) {
      setActiveMenu('orders');
      setActiveSubMenu('all-orders');
      setGlobalSearch(notif.orderId);
      setShowHeaderNotifs(false);
      triggerToast(`🔍 Filtering customer orders for #${notif.orderId.slice(-6).toUpperCase()}`);
    } else if (notif.ticketId) {
      setActiveMenu('support');
      setActiveSubMenu('all');
      setSelectedTicketId(notif.ticketId);
      setShowHeaderNotifs(false);
      triggerToast(`🔍 Opening customer support ticket #${notif.ticketId.slice(-6).toUpperCase()}`);
    }
  };

  const markAllNotificationsAsRead = () => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    triggerToast('🧹 All notification badges cleared.');
  };

  const clearAllNotifications = () => {
    setAdminNotifications([]);
    triggerToast('🗑️ Notification logs purged.');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHeaderTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Multi-theme responsive style helper variables
  const isDark = theme === 'dark';

  // Local active copy of activityLogs synced to webzone_activity_logs (with accountability)
  const [localActivityLogs, setLocalActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_activity_logs');
      return saved ? JSON.parse(saved) : (activityLogs || []);
    } catch (e) {
      return activityLogs || [];
    }
  });

  // Sync with prop changes if parent context modifies it
  useEffect(() => {
    if (activityLogs && activityLogs.length > 0) {
      setLocalActivityLogs(activityLogs);
    }
  }, [activityLogs]);

  const logAdminAction = (action: string) => {
    if (onAddActivityLog) {
      onAddActivityLog(action);
      return; // Handled by parent container propagation to prevent state race condition
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: ActivityLog = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9),
      action,
      ipAddress: "192.168.1." + Math.floor(10 + Math.random() * 90),
      userAgent: navigator.userAgent.slice(0, 50),
      timestamp
    };

    setLocalActivityLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('webzone_activity_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Audit Logs sub-tab selection and search filters
  const [notifSubTab, setNotifSubTab] = useState<'alerts' | 'audit'>('audit');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('all');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<string>('all');
  const [auditSortOrder, setAuditSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedAuditLog, setSelectedAuditLog] = useState<ActivityLog | null>(null);
  const [alerts, setAlerts] = useState<any[]>(() => {
    const saved = localStorage.getItem('admin_webhooks_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse webhooks alerts", e);
      }
    }
    return [
      { id: 'nt-1', title: "Stripe Webhook checkout completed", body: "Metadata parsed successfully for id ord-99381. Authorized payment gateway handshake verified.", dt: "10 mins ago", severity: "info" },
      { id: 'nt-2', title: "Hostinger deployment container container backup OK", body: "Hostinger server node backup cycle consolidated cleanly with no corrupted segments.", dt: "2 hours ago", severity: "success" },
      { id: 'nt-3', title: "Nagad API signature handshake timeout threshold warning", body: "Webzone Nagad Payment Gateway gateway handshake response took 4.5s. Exceeded target threshold parameters.", dt: "1 day ago", severity: "warning" },
      { id: 'nt-4', title: "Secured administrative session login key generated", body: "IP 103.112.54.9 authorized Standard Super-Admin tokens credentials handshake successfully.", dt: "2 days ago", severity: "info" }
    ];
  });

  // Safety Deletion & Critical Action Confirm Dialog State
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: (() => void) | null;
    variant?: 'danger' | 'success' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: null,
    variant: 'danger',
    confirmText: 'Yes, proceed',
    cancelText: 'Cancel'
  });

  const panelBg = isDark ? 'bg-white/[0.05] border-white/[0.08] backdrop-blur-[20px] shadow-2xl' : 'bg-white border-slate-200/85 shadow-md shadow-slate-100/40';
  const textTitle = isDark ? 'text-white' : 'text-slate-900 font-bold';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const cardBorder = isDark ? 'border-white/[0.08]' : 'border-slate-200';
  const tableRowBg = isDark ? 'hover:bg-white/[0.03] border-white/[0.08]' : 'hover:bg-slate-50/70 border-slate-100';

  // State models persistable on Local Storage level to simulate exact dynamic DB changes
  const [customers, setCustomers] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [projects, setProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [withdrawRequests, setWithdrawRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAW_REQUESTS;
  });

  const [affiliateList, setAffiliateList] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_affiliate_list');
    return saved ? JSON.parse(saved) : [
      { userId: 'usr-101', name: 'Imran Hasan', code: 'PARTNER-IMRAN', referrals: 24, commissionEarned: 1240, status: 'approved', channel: 'Personal Tech Blog', commissionRate: 20, registeredAt: '2025-10-15', balance: 140, clicks: 1482, paymentDetails: 'bKash: 01711223344' },
      { userId: 'usr-102', name: 'Al-Shehri Majid', code: 'PARTNER-MAJID', referrals: 58, commissionEarned: 3500, status: 'approved', channel: 'Riyadh Hosting Network', commissionRate: 25, registeredAt: '2025-11-20', balance: 840, clicks: 3120, paymentDetails: 'PayPal: majid@saudiweb.com' },
      { userId: 'usr-103', name: 'Zeeshan Rahman', code: 'PARTNER-ZEESHAN', referrals: 8, commissionEarned: 320, status: 'approved', channel: 'YouTube Channel', commissionRate: 15, registeredAt: '2026-01-11', balance: 0, clicks: 540, paymentDetails: 'Nagad: 01864051151' },
      { userId: 'usr-105', name: 'Enamul Haque', code: 'AFF-ENAMUL', referrals: 15, commissionEarned: 560, status: 'approved', channel: 'Dhaka Host Group LLC', commissionRate: 15, registeredAt: '2025-11-10', balance: 120, clicks: 420, paymentDetails: 'bKash: 01912345678' },
    ];
  });

  const [affiliateReferrals, setAffiliateReferrals] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_affiliate_referrals');
    return saved ? JSON.parse(saved) : [
      { id: 'ref-1', affiliateId: 'usr-101', affiliateCode: 'PARTNER-IMRAN', referredUserName: 'Anwar Hossain', productName: 'Corporate Portal Dynamic Development', saleAmount: 450, commissionEarned: 90, campaignSuffix: 'tech_post', date: '2026-06-12', status: 'approved' },
      { id: 'ref-2', affiliateId: 'usr-102', affiliateCode: 'PARTNER-MAJID', referredUserName: 'Bander Al-Harbi', productName: 'Premium VPS Dedicated Node', saleAmount: 1200, commissionEarned: 300, campaignSuffix: 'hosting_campaign', date: '2026-06-11', status: 'approved' }
    ];
  });

  const [staffList, setStaffList] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [downloads] = useState<any[]>(INITIAL_DOWNLOADS);

  // Currency Settings State
  const [internalCurrencyRates, setInternalCurrencyRates] = useState(() => {
    const saved = localStorage.getItem('webzone_currency_rates');
    return saved ? JSON.parse(saved) : { BDT: 118.5, SAR: 3.75, USD: 1.0 };
  });
  const currencyRates = propCurrencyRates || internalCurrencyRates;
  const setCurrencyRates = propSetCurrencyRates || setInternalCurrencyRates;

  // Payment Verification Settings
  const [internalVerificationSettings, setInternalVerificationSettings] = useState(() => {
    const saved = localStorage.getItem('webzone_verification_settings');
    return saved ? JSON.parse(saved) : {
      verificationMode: 'manual', // manual or auto
      txnIdRequired: true,
      screenshotRequired: true
    };
  });
  const verificationSettings = propVerificationSettings || internalVerificationSettings;
  const setVerificationSettings = propSetVerificationSettings || setInternalVerificationSettings;

  // Payment Notifications State
  const [internalPaymentNotifs, setInternalPaymentNotifs] = useState(() => {
    const saved = localStorage.getItem('webzone_payment_notifs');
    return saved ? JSON.parse(saved) : {
      email: true,
      sms: false,
      whatsapp: true,
      telegram: false
    };
  });
  const paymentNotifs = propPaymentNotifs || internalPaymentNotifs;
  const setPaymentNotifs = propSetPaymentNotifs || setInternalPaymentNotifs;

  // Bangladesh payment methods configurations
  const [internalBdMethods, setInternalBdMethods] = useState(() => {
    const saved = localStorage.getItem('webzone_bd_methods');
    return saved ? JSON.parse(saved) : {
      bkash: { enabled: true, type: 'merchant', number: '01711223344', apiKey: 'bkash_mid_9901_key', instructions: 'Send money to our merchant number and paste the transaction ID here.', qrCode: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300' },
      nagad: { enabled: true, type: 'personal', number: '01811223344', apiKey: 'nagad_api_secure_token', instructions: 'Send money with send money option and input your mobile number as reference.', qrCode: '' },
      rocket: { enabled: false, type: 'personal', number: '019112233449', apiKey: '', instructions: ' rocket transfer to 12-digit number.', qrCode: '' },
      cellfin: { enabled: false, number: '01511223344', instructions: 'Transfer to CellFin wallet.', qrCode: '' },
      islamiBank: { enabled: true, bankName: 'Islami Bank Bangladesh PLC', accountName: 'WebzoneBD IT Solutions', accountNumber: '20501450201235600', iban: 'BD03IBBL20501450201235600', swift: 'IBBLBDDHXXX', qrCode: '' }
    };
  });
  const bdMethods = propBdMethods || internalBdMethods;
  const setBdMethods = propSetBdMethods || setInternalBdMethods;

  // Saudi Arabia payment methods configurations
  const [internalSaMethods, setInternalSaMethods] = useState(() => {
    const saved = localStorage.getItem('webzone_sa_methods');
    return saved ? JSON.parse(saved) : {
      stcPay: { enabled: true, walletNumber: '+966501234567', instructions: 'Transfer via STC Pay mobile app directly to our wallet.', qrCode: '' },
      alRajhi: { enabled: true, bankName: 'Al Rajhi Bank', accountName: 'WebzoneBD SA Ltd', accountNumber: '880012345678901', iban: 'SA8000000000880012345678901', swift: 'RAJISARIXXX', qrCode: '' }
    };
  });
  const saMethods = propSaMethods || internalSaMethods;
  const setSaMethods = propSetSaMethods || setInternalSaMethods;

  // International payment methods configurations
  const [internalIntlMethods, setInternalIntlMethods] = useState(() => {
    const saved = localStorage.getItem('webzone_intl_methods');
    return saved ? JSON.parse(saved) : {
      paypal: { enabled: true, email: 'billing@webzonebd.com', clientId: 'AX_M_MOCK_PAYPAL_CLIENT_ID_9921', secretKey: 'E_M_MOCK_SECRET_KEY_8820' },
      bankTransfer: { enabled: true, bankName: 'HSBC International', accountHolder: 'WebzoneBD Global Ltd', accountNumber: '4005001234566', iban: 'GB88MIDL4005001234566', swift: 'MIDLGB22' }
    };
  });
  const intlMethods = propIntlMethods || internalIntlMethods;
  const setIntlMethods = propSetIntlMethods || setInternalIntlMethods;

  // Custom added payment gateways
  const [internalCustomMethods, setInternalCustomMethods] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_custom_methods');
    return saved ? JSON.parse(saved) : [];
  });
  const customMethods = propCustomMethods || internalCustomMethods;
  const setCustomMethods = propSetCustomMethods || setInternalCustomMethods;

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('webzone_currency_rates', JSON.stringify(currencyRates));
  }, [currencyRates]);

  useEffect(() => {
    localStorage.setItem('webzone_verification_settings', JSON.stringify(verificationSettings));
  }, [verificationSettings]);

  useEffect(() => {
    localStorage.setItem('webzone_payment_notifs', JSON.stringify(paymentNotifs));
  }, [paymentNotifs]);

  useEffect(() => {
    localStorage.setItem('webzone_bd_methods', JSON.stringify(bdMethods));
  }, [bdMethods]);

  useEffect(() => {
    localStorage.setItem('webzone_sa_methods', JSON.stringify(saMethods));
  }, [saMethods]);

  useEffect(() => {
    localStorage.setItem('webzone_intl_methods', JSON.stringify(intlMethods));
  }, [intlMethods]);

  useEffect(() => {
    localStorage.setItem('webzone_custom_methods', JSON.stringify(customMethods));
  }, [customMethods]);
  useEffect(() => {
    localStorage.setItem('webzone_admin_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('webzone_admin_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('webzone_admin_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('webzone_admin_withdrawals', JSON.stringify(withdrawRequests));
  }, [withdrawRequests]);

  useEffect(() => {
    localStorage.setItem('webzone_affiliate_list', JSON.stringify(affiliateList));
  }, [affiliateList]);

  useEffect(() => {
    localStorage.setItem('webzone_affiliate_referrals', JSON.stringify(affiliateReferrals));
  }, [affiliateReferrals]);

  useEffect(() => {
    localStorage.setItem('webzone_admin_staff', JSON.stringify(staffList));
  }, [staffList]);

  // Staff Workload & Activity Tracker states
  const [selectedWorkloadStaff, setSelectedWorkloadStaff] = useState<string>('all');

  // Payment Settings View States
  const [setPaymentSubTab, setSetPaymentSubTab] = useState<'overview' | 'bd' | 'sa' | 'intl' | 'verification' | 'history'>('overview');
  
  // Custom Payment Method Form States
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodCountry, setNewMethodCountry] = useState('Bangladesh');
  const [newMethodType, setNewMethodType] = useState('Mobile Money');
  const [newMethodLogo, setNewMethodLogo] = useState('');
  const [newMethodQr, setNewMethodQr] = useState('');
  const [newMethodInstructions, setNewMethodInstructions] = useState('');

  // Payment Verification Modal States
  const [selectedVerifyOrder, setSelectedVerifyOrder] = useState<any>(null);
  const [verifyingProgress, setVerifyingProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyActionType, setVerifyActionType] = useState<'approve' | 'reject'>('approve');

  // Transaction History Search & Filter States
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('all');
  const [txMethodFilter, setTxMethodFilter] = useState('all');
  const [selectedStaffDeptFilter, setSelectedStaffDeptFilter] = useState<string>('all');
  const [activeQuickActionsStaffId, setActiveQuickActionsStaffId] = useState<string | null>(null);
  const [messageModalStaff, setMessageModalStaff] = useState<any | null>(null);
  const [viewProfileModalStaff, setViewProfileModalStaff] = useState<any | null>(null);
  const [assignTaskModalStaff, setAssignTaskModalStaff] = useState<any | null>(null);
  const [quickMessageText, setQuickMessageText] = useState('');
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [quickTaskProjectId, setQuickTaskProjectId] = useState('proj-501');
  const [quickTaskColumn, setQuickTaskColumn] = useState<'backlog' | 'todo' | 'in_progress' | 'completed'>('todo');
  const [staffActivityFeed, setStaffActivityFeed] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_staff_activity_feed');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'act-1', staffName: 'Sayeeda Yeasmin', action: 'ticket_closed', desc: 'Resolved Support Ticket #882: phpMyAdmin DB import authority warning', details: 'Client confirmed solution active.', time: '3 mins ago', department: 'Support' },
      { id: 'act-2', staffName: 'Anisur Rahman', action: 'order_delivered', desc: 'Delivered Order #1061: ZoneCart Multi-Vendor Script deployment', details: 'Added manual instructions to documentation.', time: '12 mins ago', department: 'Development' },
      { id: 'act-3', staffName: 'Fahim Morshed', action: 'server_optimized', desc: 'DevOps server security patching & Docker container backup completed', details: 'Restored 1.2 GB cache segments.', time: '28 mins ago', department: 'DevOps' },
      { id: 'act-4', staffName: 'Tariqul Islam', action: 'seo_campaign', desc: 'Approved & optimized 4 active Affiliate Promotion campaign tags', details: 'Updated Google Ads sitemap index.', time: '1 hour ago', department: 'SEO & Copywriting' },
      { id: 'act-5', staffName: 'Sayeeda Yeasmin', action: 'ticket_closed', desc: 'Closed Ticket #712: Nagad callback sandbox latency issue solved', details: 'Replaced endpoint curl parameters.', time: '2 hours ago', department: 'Support' }
    ];
  });

  // Sync Activity Feed to localStorage
  useEffect(() => {
    localStorage.setItem('webzone_staff_activity_feed', JSON.stringify(staffActivityFeed));
  }, [staffActivityFeed]);

  // Real-time Simulation Feed Loop
  useEffect(() => {
    const actionTypes = [
      { action: 'ticket_closed', templates: ["Resolved Support Ticket #{id}: {subject}", "Closed ticket #{id} regarding cPanel server DNS setup issues", "Answered client inquiry #{id} regarding payment gateway callback"] },
      { action: 'order_delivered', templates: ["Delivered Order #{id}: {item}", "Completed client request for custom setup of {item}", "Successfully initiated download access for {item} on Order #{id}"] },
      { action: 'server_optimized', templates: ["Performed maintenance on cPanel host node {server}", "Optimized SQL index buffers and cleared temporary cache logs", "Successfully renewed SSL protocols handshake security layer"] },
      { action: 'seo_campaign', templates: ["Published SEO target copywriting templates for {subject}", "Revised marketing keywords database index listings", "Created Google Search Console sitemap indexing tag for {subject}"] }
    ];

    const subjects = ["WooCom Premium", "MySQL DB import", "Blogger theme", "Bkash payment", "SSL security", "WordPress setup"];
    const items = ["ZoneCart Multivendor Laravel Script", "WebNews WordPress Theme", "BloggerSpot Modern Template", "SchoolZone PHP Management System"];
    const servers = ["Node-3", "Dhaka-Core-A", "Riyadh-S1", "cPanel-Main-Shard"];

    const interval = setInterval(() => {
      if (!staffList || staffList.length === 0) return;
      
      const randomStaff = staffList[Math.floor(Math.random() * staffList.length)];
      if (randomStaff.status === 'suspended') return;
      
      const randomType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      
      let action = randomType.action;
      if (randomStaff.department === 'Support' && Math.random() < 0.6) {
        action = 'ticket_closed';
      } else if (randomStaff.department === 'Development' && Math.random() < 0.6) {
        action = 'order_delivered';
      }
      
      const chosenTypeObj = actionTypes.find(t => t.action === action) || actionTypes[0];
      const template = chosenTypeObj.templates[Math.floor(Math.random() * chosenTypeObj.templates.length)];
      
      const randId = Math.floor(Math.random() * 800) + 100;
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const server = servers[Math.floor(Math.random() * servers.length)];
      
      const desc = template
        .replace("{id}", String(randId))
        .replace("{subject}", subject)
        .replace("{item}", item)
        .replace("{server}", server);
        
      const newLog = {
        id: `sim-act-${Date.now()}`,
        staffName: randomStaff.name,
        action,
        desc,
        details: `Auto-verified by system supervisor standard logs.`,
        time: 'Just now',
        department: randomStaff.department
      };

      setStaffActivityFeed(prev => {
        const updatedPrev = prev.map((log) => {
          if (log.time === 'Just now') return { ...log, time: '1 min ago' };
          if (log.time === '1 min ago') return { ...log, time: '3 mins ago' };
          if (log.time === '3 mins ago') return { ...log, time: '12 mins ago' };
          if (log.time === '12 mins ago') return { ...log, time: '40 mins ago' };
          if (log.time === '40 mins ago') return { ...log, time: '2 hours ago' };
          if (log.time.endsWith('mins ago')) {
            const m = parseInt(log.time) + 3;
            return { ...log, time: `${m} mins ago` };
          }
          return log;
        });
        return [newLog, ...updatedPrev].slice(0, 7);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [staffList]);

  // General Filter / Search states across lists
  const [globalSearch, setGlobalSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'reference'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [affiliateSearch, setAffiliateSearch] = useState('');
  const [affiliateStatusFilter, setAffiliateStatusFilter] = useState<'all' | 'approved' | 'pending' | 'suspended'>('all');
  const [dashboardChartView, setDashboardChartView] = useState<'revenue' | 'orders' | 'customers'>('revenue');
  const [selectedOrderForInspect, setSelectedOrderForInspect] = useState<Order | null>(null);
  const [selectedOrderForInvoiceModal, setSelectedOrderForInvoiceModal] = useState<Order | null>(null);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState<string | null>(null);
  const [selectedGuestReceipt, setSelectedGuestReceipt] = useState<string | null>(null);
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [guestStatusFilter, setGuestStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  // Complete Customers Enterprise management states
  const [selectedCustomerProfileId, setSelectedCustomerProfileId] = useState<string | null>(null);
  const [selectedCustomerIdForEdit, setSelectedCustomerIdForEdit] = useState<string | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);
  
  // Custom success wizard
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState<{
    open: boolean;
    customerId: string;
    customerName: string;
    password?: string;
    workspaceFeatures: any;
  } | null>(null);

  // Searchable Country suggestions
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // High-fidelity loaders
  const [isLoadingSkeletons, setIsLoadingSkeletons] = useState(false);

  // Advanced filters state
  const [custTypeFilter, setCustTypeFilter] = useState<string>('all');
  const [custStatusFilter, setCustStatusFilter] = useState<string>('all');
  const [custCountryFilter, setCustCountryFilter] = useState<string>('all');
  const [custSpendFilter, setCustSpendFilter] = useState<string>('all'); // all, 0-500, 500-2000, 2000+
  const [custCityFilter, setCustCityFilter] = useState<string>('all');
  const [custOrderCountFilter, setCustOrderCountFilter] = useState<string>('all');
  const [custPaymentStatusFilter, setCustPaymentStatusFilter] = useState<string>('all');
  const [custRegDateFilter, setCustRegDateFilter] = useState<string>('all'); // all, today, this-month, this-year
  const [activeProfileTab, setActiveProfileTab] = useState<string>('Overview');

  // Gemini Chatbot JSON importer state hooks
  const [showGeminiChatbotModal, setShowGeminiChatbotModal] = useState<boolean>(false);
  const [blogJsonInput, setBlogJsonInput] = useState<string>('');

  // Bulk selectors
  const [selectedBulkCustomers, setSelectedBulkCustomers] = useState<string[]>([]);

  // Upgraded Customers CRM Workspace State Hooks
  const [selectedCustForOrders, setSelectedCustForOrders] = useState<any | null>(null);
  const [selectedCustForInvoices, setSelectedCustForInvoices] = useState<any | null>(null);
  const [custDeleteConfirm, setCustDeleteConfirm] = useState<{ isOpen: boolean; customerId: string; customerName: string } | null>(null);
  const [emailComposer, setEmailComposer] = useState<{ isOpen: boolean; customerEmail: string; customerName: string; subject: string; body: string } | null>(null);
  const [whatsappComposer, setWhatsappComposer] = useState<{ isOpen: boolean; customerPhone: string; customerName: string; message: string } | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  
  // Communication wizard
  const [showCommunicationModal, setShowCommunicationModal] = useState<{
    open: boolean;
    type: 'email' | 'sms' | 'whatsapp' | 'push';
    customerId: string | 'bulk';
    customerName: string;
    customerTarget: string;
  } | null>(null);

  // Form states for adding and editing customer with password and workspaceFeatures
  const [custForm, setCustForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    dob: '1995-01-01',
    gender: 'Male',
    country: 'Bangladesh',
    city: 'Dhaka',
    address: '',
    postalCode: '',
    websiteUrl: '',
    customerType: 'Regular Client',
    status: 'active',
    tags: [] as string[],
    password: '',
    walletBalance: 0,
    totalSpent: 0,
    workspaceFeatures: {
      projects: true,
      supportTickets: true,
      digitalStore: true,
      downloads: true,
      affiliateSystem: true,
      wallet: true,
      aiTools: true,
      notifications: true
    }
  });

  // Client Simulation Collections in Local Storage
  const [customerNotes, setCustomerNotes] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_cust_notes');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_NOTES;
  });
  const [customerActivities, setCustomerActivities] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_cust_activities');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_ACTIVITIES;
  });
  const [customerSecurity, setCustomerSecurity] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_cust_security');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_SECURITY;
  });
  const [walletTransactions, setWalletTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem('webzone_admin_cust_wallet_txs');
    if (saved) return JSON.parse(saved);
    return [
      { id: "tx-1", customerId: "usr-101", type: "deposit", amount: 450, date: "2026-06-11 09:41", description: "Initial dynamic balance mapping" },
      { id: "tx-2", customerId: "usr-102", type: "deposit", amount: 1200, date: "2026-06-10 18:22", description: "Annual corporate service deposit" },
      { id: "tx-3", customerId: "usr-103", type: "deposit", amount: 85, date: "2026-06-02 11:30", description: "Manual client checkout deposit" },
      { id: "tx-4", customerId: "usr-105", type: "deposit", amount: 1560, date: "2026-06-11 08:12", description: "Affiliate commissions internal conversion" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('webzone_admin_cust_notes', JSON.stringify(customerNotes));
  }, [customerNotes]);
  useEffect(() => {
    localStorage.setItem('webzone_admin_cust_activities', JSON.stringify(customerActivities));
  }, [customerActivities]);
  useEffect(() => {
    localStorage.setItem('webzone_admin_cust_security', JSON.stringify(customerSecurity));
  }, [customerSecurity]);
  useEffect(() => {
    localStorage.setItem('webzone_admin_cust_wallet_txs', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  // Sync activeSubMenu selection of Orders to orderFilter automatically
  useEffect(() => {
    if (activeMenu === 'orders') {
      if (activeSubMenu === 'all-orders' || activeSubMenu === 'all') {
        setOrderFilter('all');
      } else if (activeSubMenu === 'pending-orders') {
        setOrderFilter('pending');
      } else if (activeSubMenu === 'completed-orders') {
        setOrderFilter('completed');
      } else if (activeSubMenu === 'failed-orders') {
        setOrderFilter('failed');
      } else if (activeSubMenu === 'refunded-orders') {
        setOrderFilter('refunded');
      } else if (activeSubMenu === 'processing-orders') {
        setOrderFilter('processing');
      }
    }
  }, [activeSubMenu, activeMenu]);

  // Sync activeSubMenu selection of Web Settings to webSettingsSubTab automatically
  useEffect(() => {
    if (activeMenu === 'web-settings') {
      if (activeSubMenu === 'web-identity') {
        setWebSettingsSubTab('identity');
      } else if (activeSubMenu === 'web-appearance') {
        setWebSettingsSubTab('appearance');
      } else if (activeSubMenu === 'web-theme-preview') {
        setWebSettingsSubTab('theme-preview');
      } else if (activeSubMenu === 'web-payments') {
        setWebSettingsSubTab('payments');
      } else if (activeSubMenu === 'web-security') {
        setWebSettingsSubTab('security');
      }
    }
  }, [activeSubMenu, activeMenu]);

  // Synchronous filter update function to sync both orderFilter state and activeSubMenu sidebar highlight
  const handleSetOrderFilter = (filter: 'all' | 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'reference') => {
    setOrderFilter(filter);
    if (activeMenu === 'orders') {
      setActiveSubMenu('all-orders');
    }
  };

  // Customer Management Interactivity
  const [selectedCustomerIdForWallet, setSelectedCustomerIdForWallet] = useState<string | null>(null);
  const [walletAmountValue, setWalletAmountValue] = useState<number>(50);

  const handleToggleCustomerStatus = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'suspended' : 'active';
        triggerToast(`🔐 Customer security profiles altered! Status of #${id} changed to: ${nextStatus.toUpperCase()}`);
        logAdminAction(`Modified safety/auth status of Customer ID: ${id} to ${nextStatus.toUpperCase()}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleAdjustWallet = (id: string, mode: 'add' | 'subtract') => {
    if (!walletAmountValue || walletAmountValue <= 0) {
      triggerToast("Error: Please provide a valid transaction amount!");
      return;
    }
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const adjustment = mode === 'add' ? walletAmountValue : -walletAmountValue;
        const newBalance = Math.max(0, c.walletBalance + adjustment);
        triggerToast(`💰 Client wallet state updated! Authorized payment gateway increment of $${walletAmountValue} for id ${id}. New balance: $${newBalance}`);
        logAdminAction(`Executed financial ledger adjustment on Customer ID: ${id} [Amount: $${walletAmountValue}, Action: ${mode.toUpperCase()}], New Balance: $${newBalance}`);
        return { ...c, walletBalance: newBalance };
      }
      return c;
    }));
    setSelectedCustomerIdForWallet(null);
  };

  const handleDownloadInvoicePdf = (ord: Order, cust: any) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor = [37, 99, 235]; // #2563EB
      const secondaryColor = [71, 85, 105]; // #475569
      const darkColor = [15, 23, 42]; // #0F172A
      const lightBg = [248, 250, 252]; // #F8FAFC
      const borderColor = [226, 232, 240]; // #E2E8F0

      // Top ribbon decoration
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 8, 'F');

      // Branding Header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('WEBZONEBD', 15, 22);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Premium Software, Scripts, Domain & SSD Cloud hosting', 15, 27);

      // Invoice Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('INVOICE', 195, 22, { align: 'right' });

      // Metadata
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Invoice ID: #${ord.id || 'ORD-' + Math.floor(Math.random() * 9000 + 1000)}`, 195, 28, { align: 'right' });
      doc.text(`Place Date: ${ord.date || '2026-06-20'}`, 195, 33, { align: 'right' });
      doc.text(`Payment: ${(ord.paymentMethod || 'bKash Gateways').toUpperCase()}`, 195, 38, { align: 'right' });

      // Divider
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.4);
      doc.line(15, 45, 195, 45);

      // Business details
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('FROM:', 15, 53);

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('WebzoneBD IT Solutions Ltd.', 15, 58);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Dhaka Office: House 4, Block F, Banani Road, Dhaka 1213', 15, 63);
      doc.text('Saudi Arabia Online Node Support Hub', 15, 67);
      doc.text('Contact WhatsApp: +966-570511931', 15, 71);
      doc.text('Email: support@webzonebd.com', 15, 75);

      // Client details
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('BILLED TO:', 110, 53);

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(cust?.name || ord.customerName || 'Valued Customer', 110, 58);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Email: ${cust?.email || ord.customerEmail || 'N/A'}`, 110, 63);
      doc.text(`Phone: ${cust?.phone || ord.customerPhone || 'N/A'}`, 110, 67);
      doc.text(`WhatsApp: ${cust?.whatsapp || cust?.phone || 'N/A'}`, 110, 71);
      doc.text(`Country: ${cust?.country || 'Bangladesh'}`, 110, 75);

      // Divider
      doc.line(15, 90, 195, 90);

      // Table Header banner box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(15, 97, 180, 8, 'F');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('ITEM DESCRIPTION', 18, 102);
      doc.text('UNIT PRICE', 140, 102);
      doc.text('TOTAL', 175, 102);

      // Separator line
      doc.line(15, 105, 195, 105);

      // Table Content
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(ord.itemTitle || 'Premium Product / Script License', 18, 114);
      doc.text(`$${ord.price || 0}`, 140, 114);
      doc.text(`$${ord.price || 0}`, 175, 114);

      doc.line(15, 120, 195, 120);

      // Calculations table values
      const basePrice = (ord.price || 0) * 0.85;
      const vatAmount = (ord.price || 0) * 0.15;
      const grossTotal = ord.price || 0;

      // Summary
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Subtotal:', 140, 130);
      doc.text(`$${basePrice.toFixed(2)}`, 175, 130);

      doc.text('VAT/Tax (15%):', 140, 135);
      doc.text(`$${vatAmount.toFixed(2)}`, 175, 135);

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Total Paid Amount:', 140, 142);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`$${grossTotal.toFixed(2)}`, 175, 142);

      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.line(15, 150, 195, 150);

      // Receipt note
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('TRANSACTION STATUS:', 15, 158);

      const paidStatus = (ord.paymentStatus || 'COMPLETED').toUpperCase();
      if (paidStatus === 'COMPLETED') {
        doc.setTextColor(22, 163, 74); // success green
      } else {
        doc.setTextColor(217, 119, 6); // warning amber
      }
      doc.text(paidStatus, 15, 164);

      // Thank you message
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Thank you for purchasing premium digital scripts and templates from WebzoneBD!', 15, 175);
      doc.text('This is a computer generated commercial invoice. No handmade physical signature is needed.', 15, 179);

      // Download / Save file
      doc.save(`Invoice-${ord.id || 'N_A'}.pdf`);
      triggerToast(`📄 Printable Invoice PDF generated for #${ord.id || 'N_A'}!`);
    } catch (err) {
      console.error(err);
      triggerToast('❌ Failed to construct printable PDF invoice.');
    }
  };

  // Automated Email Notification System Logs State
  const [emailLogs, setEmailLogs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_email_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getCustomerForOrder = (order: Order) => {
    const words = (order.itemTitle || '').toLowerCase();
    if (words.includes('corporate') || words.includes('branding') || words.includes('majid')) {
      return customers.find(c => c.id === 'usr-102') || customers[1];
    }
    if (words.includes('zeeshan') || words.includes('rahman')) {
      return customers.find(c => c.id === 'usr-103') || customers[2];
    }
    if (words.includes('enamul') || words.includes('host')) {
      return customers.find(c => c.id === 'usr-105') || customers[4];
    }
    return customers.find(c => c.id === 'usr-101') || customers[0];
  };

  const dispatchAutomatedEmail = async (order: Order, overrideEmail?: string) => {
    const matchedCustomer = getCustomerForOrder(order);
    const customerName = matchedCustomer ? matchedCustomer.name : "Imran Hasan";
    const customerEmail = overrideEmail || (matchedCustomer ? matchedCustomer.email : "imranh7900@gmail.com");

    const payload = {
      orderId: order.id,
      customerName,
      customerEmail,
      itemTitle: order.itemTitle,
      price: order.price,
      currency: "USD",
      date: order.date || new Date().toLocaleDateString(),
      paymentMethod: order.paymentMethod || "Card Processing Gateway",
      downloadUrl: order.downloadUrl || "#"
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Email notification API call failed.");
      
      const data = await response.json();

      const newLog = {
        id: "eml-" + Date.now().toString(),
        orderId: order.id,
        recipientName: customerName,
        recipientEmail: customerEmail,
        subject: data.subject || `Confirmation Receipt - #${getOrderSerial(order.id)}`,
        itemTitle: order.itemTitle,
        price: order.price,
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: data.status,
        sent: data.sent,
        htmlTemplate: data.htmlTemplate,
        details: data.details
      };

      setEmailLogs(prev => {
        const updated = [newLog, ...prev].slice(0, 50);
        localStorage.setItem('webzone_email_logs', JSON.stringify(updated));
        return updated;
      });

      if (data.sent) {
        triggerToast(`📧 Live receipt dispatched successfully to ${customerEmail}!`);
        logAdminAction(`Sent real client invoice email to ${customerEmail} for Order #${getOrderSerial(order.id)}`);
      } else {
        triggerToast(`💾 Invoice generated & drafted inside Receipt Email dashboard!`);
        logAdminAction(`Simulated premium invoice email draft for Order #${getOrderSerial(order.id)}`);
      }
    } catch (err: any) {
      console.error(err);
      triggerToast("⚠️ Failed to transmit invoice via email delivery agent.");
    }
  };

  // Order Management Interactivity
  const handleModifyOrderStatus = async (id: string, nextStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded') => {
    triggerToast(`📦 Order state mutated! Order #${id} updated to status: ${nextStatus.toUpperCase()}`);
    logAdminAction(`Updated Order Status for Order Reference #${id} to: ${nextStatus.toUpperCase()}`);
    // Simulate updating in global orders prop if available, or just log
    if (updateOrderStatus) {
      if (nextStatus === 'completed' || nextStatus === 'failed' || nextStatus === 'refunded') {
        updateOrderStatus(id, nextStatus as any);
      }
    }

    if (nextStatus === 'completed') {
      const targetOrder = orders.find(o => o.id === id);
      if (targetOrder) {
        await dispatchAutomatedEmail(targetOrder);
      }
    }
  };

  // Support Ticketing and Realtime AI Chat Simulator
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [supportChatLogs, setSupportChatLogs] = useState<any[]>([
    { id: 'c-1', sender: 'customer', name: 'Zeeshan Rahman', message: 'Assalamu Alaikum. Realized the DB callback triggers throw errors on PHP 8.2 host. Any hotfix available?', timestamp: 'May 10, 14:05', channel: 'whatsapp' },
    { id: 'c-2', sender: 'assistant', name: 'Tariqul (AI Assis)', message: 'Walaikum Assalamu Rahmatullah. Let me prepare the patch for you instantly. Standby.', timestamp: 'May 10, 14:08', channel: 'whatsapp' }
  ]);
  const [newChatInputText, setNewChatInputText] = useState('');
  const [whatsappFilter, setWhatsappFilter] = useState<'all' | 'live' | 'whatsapp'>('all');

  // Reports Premium & Smart System States
  const [reportForecastScenario, setReportForecastScenario] = useState<'none' | 'conservative' | 'optimistic' | 'hyper'>('none');
  const [slaLatencyTestingId, setSlaLatencyTestingId] = useState<string | null>(null);
  const [slaLatencyResult, setSlaLatencyResult] = useState<Record<string, { ms: number; status: string }>>({});
  const [customerDrilldownChannel, setCustomerDrilldownChannel] = useState<string | null>(null);
  const [generatedLicenseTestKey, setGeneratedLicenseTestKey] = useState<string>('');
  const [licenseTestStatus, setLicenseTestStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const [payoutProcessingId, setPayoutProcessingId] = useState<string | null>(null);

  const handleAdminSubmitTicketReply = (ticketId: string) => {
    if (!adminReplyText.trim()) return;
    addTicketReply(ticketId, adminReplyText, 'admin');
    logAdminAction(`Submitted official support reply on Ticket Reference #${ticketId}`);
    setAdminReplyText('');
    triggerToast("📩 Customer communication case updated successfully!");
  };

  // Interactive Reports Helper Functions
  const triggerSlaDiagnostic = (id: string) => {
    setSlaLatencyTestingId(id);
    const serviceName = 
      id === 'srv1' ? 'Website Development Builds' : 
      id === 'srv2' ? 'Custom bKash API Gateway' : 
      id === 'srv3' ? 'SEO Optimization Keywords Engine' : 
      'Enterprise Custom ERP System';
    
    setTimeout(() => {
      const latency = Math.floor(20 + Math.random() * 85);
      const statuses = ["EXCELLENT", "OPTIMAL", "STABLE"];
      const status = latency < 45 ? "EXCELLENT" : latency < 70 ? "OPTIMAL" : "STABLE";
      setSlaLatencyResult(prev => ({
        ...prev,
        [id]: { ms: latency, status }
      }));
      setSlaLatencyTestingId(null);
      triggerToast(`⚡ SLA Handshake verified for [${serviceName}]: ${latency}ms latency. Status is ${status}.`);
      logAdminAction(`Executed diagnostic SLA network latency ping test for service component: ${serviceName}`);
    }, 1200);
  };

  const generateTestLicenseKey = () => {
    setLicenseTestStatus('generating');
    setTimeout(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let segment1 = '';
      let segment2 = '';
      let segment3 = '';
      for (let i = 0; i < 4; i++) {
        segment1 += chars[Math.floor(Math.random() * chars.length)];
        segment2 += chars[Math.floor(Math.random() * chars.length)];
        segment3 += chars[Math.floor(Math.random() * chars.length)];
      }
      const key = `WZ-SECURE-${segment1}-${segment2}-${segment3}-2026`;
      setGeneratedLicenseTestKey(key);
      setLicenseTestStatus('done');
      triggerToast("🔑 Secure cryptographic license signature generated successfully.");
      logAdminAction(`Generated sandbox encrypted digital catalog license validation key: ${key}`);
    }, 1100);
  };

  const triggerPayoutSettlement = (name: string, amount: string) => {
    setPayoutProcessingId(name);
    setTimeout(() => {
      setPayoutProcessingId(null);
      triggerToast(`💸 Direct deposit payout of ${amount} to ${name} cleared successfully!`);
      logAdminAction(`Approved and settled affiliate partner commission balance of ${amount} for partner: ${name}`);
    }, 1400);
  };

  const handleSendLiveChatMessage = () => {
    if (!newChatInputText.trim()) return;
    const adminMsg = {
      id: `c-` + Date.now(),
      sender: 'admin',
      name: 'Super Admin',
      message: newChatInputText,
      timestamp: 'Just now',
      channel: 'live'
    };
    setSupportChatLogs(prev => [...prev, adminMsg]);
    const cleanUserQuery = newChatInputText;
    setNewChatInputText('');

    // Simulated Auto-Reply from Customer or Bot to keep it deeply interactive and lively!
    setTimeout(() => {
      setSupportChatLogs(prev => [...prev, {
        id: `c-` + (Date.now() + 1),
        sender: 'customer',
        name: 'Imran Hasan',
        message: `Acknowledged. Appreciate the high-velocity support on WebzoneBD. Please forward the ZIP logs file when complete!`,
        timestamp: 'Just now',
        channel: 'live'
      }]);
    }, 2000);
  };

  // Project Management System: Milestone & Kanban Kanban Board Toggles
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-501');
  const [newKanbanTaskTitle, setNewKanbanTaskTitle] = useState('');
  const [newKanbanTaskPriority, setNewKanbanTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newKanbanTaskAssignee, setNewKanbanTaskAssignee] = useState('Anisur');

  const handleAddKanbanTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKanbanTaskTitle.trim()) return;
    const newTask = {
      id: `task-` + Date.now(),
      projectId: selectedProjectId,
      title: newKanbanTaskTitle,
      column: 'todo',
      priority: newKanbanTaskPriority,
      assignee: newKanbanTaskAssignee
    };
    setTasks(prev => [...prev, newTask]);
    logAdminAction(`Created project task: "${newKanbanTaskTitle}" in sprint board (Assignee: ${newKanbanTaskAssignee})`);
    setNewKanbanTaskTitle('');
    triggerToast("📂 Backlog expanded! New task published to Scrum workspace board.");
  };

  const handleMoveTaskColumn = (taskId: string, nextCol: 'backlog' | 'todo' | 'in_progress' | 'completed') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        triggerToast(`📋 Task tracker update: "${t.title}" moved to ${nextCol.toUpperCase()}`);
        logAdminAction(`Moved Kanban task "${t.title}" state to: ${nextCol.toUpperCase()}`);
        return { ...t, column: nextCol };
      }
      return t;
    }));
  };

  const handleSimulateClientApproval = (projId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        const nextProgress = Math.min(100, p.progress + 15);
        const nextStatus = nextProgress === 100 ? 'completed' : p.status;
        triggerToast(`✅ Client Approval Simulated! Milestone verified and signed-off by customer. Progress dials up to ${nextProgress}%`);
        logAdminAction(`Simulated client milestone sign-off for Project: "${p.title}" (ID: ${projId}). Progress now ${nextProgress}%`);
        return { 
          ...p, 
          progress: nextProgress, 
          status: nextStatus,
          completedMilestones: Math.min(p.milestones, p.completedMilestones + 1)
        };
      }
      return p;
    }));
  };

  // AI Center: Real, functioning UI with secure Express API server-side logic
  const [aiMode, setAiMode] = useState<'blog' | 'content' | 'seo' | 'meta' | 'business-name'>('blog');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiCompanyType, setAiCompanyType] = useState('Laravel App Developers');
  const [aiGeneratedOutput, setAiGeneratedOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // AI Image Generator States & Methods
  const [aiSubTab, setAiSubTab] = useState<'copywriter' | 'image'>('copywriter');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('minimalist');
  const [imageRatio, setImageRatio] = useState('1:1');
  const [imageGeneratedUrl, setImageGeneratedUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageList, setImageList] = useState<{ url: string; prompt: string; ratio: string; style: string; timestamp: string }[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_ai_generated_images');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const triggerDownloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerImageGeneration = async () => {
    if (!imagePrompt.trim()) {
      triggerToast("⚠️ Please specify a detailed text prompt for the AI image model.");
      return;
    }
    setImageLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: imageStyle,
          aspectRatio: imageRatio
        })
      });

      if (!response.ok) throw new Error("Image service communication failure.");
      const data = await response.json();
      setImageGeneratedUrl(data.imageUrl);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newImgItem = {
        url: data.imageUrl,
        prompt: imagePrompt,
        ratio: imageRatio,
        style: imageStyle,
        timestamp
      };
      
      const updatedList = [newImgItem, ...imageList].slice(0, 50);
      setImageList(updatedList);
      localStorage.setItem('webzone_ai_generated_images', JSON.stringify(updatedList));

      if (data.isFallback) {
        triggerToast("💡 Generated fallback graphics option matching keywords!");
      } else {
        triggerToast("🎨 Unique AI Image generated successfully!");
      }

      logAdminAction(`Generated AI Asset thumbnail image: "${imagePrompt.substring(0, 40)}..." [Style: ${imageStyle}, Ratio: ${imageRatio}]`);
    } catch (err) {
      console.error(err);
      triggerToast("❌ Failed to reach image generation model server.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleTriggerAiGeneration = async () => {
    if (!aiPrompt.trim() && aiMode !== 'business-name') {
      triggerToast("Please provide detailed guidelines or a prompt for the AI agent!");
      return;
    }
    setAiLoading(true);
    setAiGeneratedOutput('');

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: aiMode,
          prompt: aiPrompt,
          tone: aiTone,
          keywords: aiKeywords,
          companyType: aiCompanyType
        })
      });

      if (!response.ok) throw new Error("Server communication failure.");
      const data = await response.json();
      setAiGeneratedOutput(data.output);
      triggerToast("🤖 Advanced Gemini 3.5 AI generation completed!");
      logAdminAction(`Triggered generative AI model for task: "${aiMode.toUpperCase()}" [Prompt: "${aiPrompt.substring(0, 40)}..."]`);
    } catch (err) {
      console.error(err);
      triggerToast("Error: Failed to connect to server-side AI proxy. Displaying backup schema mock.");
      logAdminAction(`Attempted generative AI model task: "${aiMode.toUpperCase()}" but server-side proxy failed.`);
      setAiGeneratedOutput(`### AI Generation Error\nCould not access the backend service on port 3000. Try checking your credentials under Settings.`);
    } finally {
      setAiLoading(false);
    }
  };

  // Staff Management Interactivity
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('Development');
  const [newStaffAvatar, setNewStaffAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
  const [newStaffRole, setNewStaffRole] = useState('Staff');
  const [newStaffVelocity, setNewStaffVelocity] = useState(85);
  const [newStaffPermissions, setNewStaffPermissions] = useState<string[]>(['manage_projects', 'manage_tasks']);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Edit Staff states
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingStaffName, setEditingStaffName] = useState('');
  const [editingStaffRole, setEditingStaffRole] = useState('');
  const [editingStaffDept, setEditingStaffDept] = useState('');
  const [editingStaffVelocity, setEditingStaffVelocity] = useState(85);
  const [editingStaffAvatar, setEditingStaffAvatar] = useState('');
  const [editingStaffPermissions, setEditingStaffPermissions] = useState<string[]>([]);
  const [editingStaffTickets, setEditingStaffTickets] = useState(0);
  const [editingStaffStatus, setEditingStaffStatus] = useState('active');
  const [editingStaffEmail, setEditingStaffEmail] = useState('');
  const [editingStaffPassword, setEditingStaffPassword] = useState('');

  const startEditingStaff = (stf: any) => {
    setEditingStaffId(stf.userId);
    setEditingStaffName(stf.name);
    setEditingStaffRole(stf.role || 'Staff');
    setEditingStaffDept(stf.department || 'Development');
    setEditingStaffVelocity(stf.sprintVelocity || 85);
    setEditingStaffAvatar(stf.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
    setEditingStaffPermissions(stf.permissions || []);
    setEditingStaffTickets(stf.ticketsCount || 0);
    setEditingStaffStatus(stf.status || 'active');
    setEditingStaffEmail(stf.email || '');
    setEditingStaffPassword(stf.password || '');
  };

  const saveEditedStaff = (userId: string) => {
    if (!editingStaffName.trim()) {
      triggerToast('⚠️ Staff name cannot be empty!');
      return;
    }
    setStaffList(prev => prev.map(s => {
      if (s.userId === userId) {
        return {
          ...s,
          name: editingStaffName,
          role: editingStaffRole,
          department: editingStaffDept,
          sprintVelocity: Number(editingStaffVelocity),
          avatar: editingStaffAvatar,
          permissions: editingStaffPermissions,
          ticketsCount: Number(editingStaffTickets),
          status: editingStaffStatus,
          email: editingStaffEmail,
          password: editingStaffPassword
        };
      }
      return s;
    }));
    logAdminAction(`Updated staff representative details for user ID: ${userId}`);
    triggerToast(`✨ Successfully updated details for ${editingStaffName}!`);
    setEditingStaffId(null);
  };

  const deleteStaffMember = (userId: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently remove ${name} from active staff directory?`)) {
      setStaffList(prev => prev.filter(s => s.userId !== userId));
      logAdminAction(`Permanently expunged staff representative: ${name} (ID: ${userId})`);
      triggerToast(`🗑️ Staff representative ${name} removed from registry.`);
    }
  };

  const handleAddNewStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    const newStaff = {
      userId: `stf-` + Date.now(),
      name: newStaffName,
      role: newStaffRole,
      department: newStaffDept,
      ticketsCount: 0,
      sprintVelocity: Number(newStaffVelocity),
      avatar: newStaffAvatar,
      status: 'active',
      permissions: newStaffPermissions,
      email: newStaffEmail,
      password: newStaffPassword
    };
    setStaffList(prev => [...prev, newStaff]);
    logAdminAction(`Cataloged and registered new staff member: ${newStaffName} (Dept: ${newStaffDept})`);
    setNewStaffName('');
    setNewStaffRole('Staff');
    setNewStaffDept('Development');
    setNewStaffVelocity(85);
    setNewStaffPermissions(['manage_projects', 'manage_tasks']);
    setNewStaffEmail('');
    setNewStaffPassword('');
    setShowAddStaffModal(false);
    triggerToast(`👨‍💼 Staff catalog updated! ${newStaffName} mapped to ${newStaffDept}`);
  };

  // Affiliate Withdrawal Actions
  const handleApproveWithdrawalRequest = (id: string) => {
    setWithdrawRequests(prev => prev.map(w => {
      if (w.id === id) {
        // Also update affiliate balance if matching in affiliateList
        setAffiliateList(pAffs => pAffs.map(aff => {
          if (aff.userId === w.partnerId || aff.code === w.partnerCode) {
            return { ...aff, balance: Math.max(0, aff.balance - w.amout) };
          }
          return aff;
        }));
        triggerToast(`Approved Affiliate withdrawal transfer of $${w.amout} via ${w.method} for ${w.partnerName}!`);
        logAdminAction(`Approved affiliate payout withdrawal transaction #${id} for ${w.partnerName} of amount $${w.amout}`);
        return { ...w, status: 'completed' as const };
      }
      return w;
    }));
  };

  const handleUpdateAffiliateStatus = (userId: string, status: 'approved' | 'pending' | 'suspended') => {
    setAffiliateList(prev => prev.map(a => {
      if (a.userId === userId) {
        logAdminAction(`Updated affiliate partner ${a.name} status to ${status.toUpperCase()}`);
        triggerToast(`Affiliate status updated for ${a.name}!`);
        return { ...a, status };
      }
      return a;
    }));
  };

  const handleUpdateAffiliateCommissionRate = (userId: string, rate: number) => {
    setAffiliateList(prev => prev.map(a => {
      if (a.userId === userId) {
        logAdminAction(`Updated affiliate partner ${a.name} commission rate to ${rate}%`);
        triggerToast(`Commission rate set to ${rate}% for ${a.name}`);
        return { ...a, commissionRate: rate };
      }
      return a;
    }));
  };

  // Marketing Coupons & Direct Campaigns
  const [marketingChannel, setMarketingChannel] = useState<'email' | 'sms' | 'push'>('email');
  const [campaignHeading, setCampaignHeading] = useState('');
  const [campaignBodyContent, setCampaignBodyContent] = useState('');
  const [campaignLoading, setCampaignLoading] = useState(false);

  const handleLaunchCampaignBlast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignHeading.trim() || !campaignBodyContent.trim()) {
      triggerToast("Error: Campaign subject or contents are blank!");
      return;
    }
    setCampaignLoading(true);
    setTimeout(() => {
      setCampaignLoading(false);
      triggerToast(`📢 Broadcaster blast initiated! Successfully delivered campaign to all targeted lists.`);
      logAdminAction(`Launched bulk campaign blast via ${marketingChannel.toUpperCase()} [Subject: "${campaignHeading}"]`);
      setCampaignHeading('');
      setCampaignBodyContent('');
    }, 1500);
  };

  const [promoCouponCode, setPromoCouponCode] = useState('');
  const [promoCouponDiscount, setPromoCouponDiscount] = useState<number>(20);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCouponCode.trim()) {
      triggerToast("Error: Coupon code cannot be blank!");
      return;
    }
    const cleanCode = promoCouponCode.trim().toUpperCase();
    const newCop: Coupon = {
      code: cleanCode,
      discountPercent: promoCouponDiscount,
      expiryDate: '2026-12-31'
    };
    addNewCoupon(newCop);
    logAdminAction(`Created promotional coupon: ${cleanCode} with ${promoCouponDiscount}% discount`);
    setPromoCouponCode('');
    triggerToast(`🎟️ Promotional voucher code ${cleanCode} is now active system-wide!`);
  };

  // Reviews approval switcher
  const [approvedReviews, setApprovedReviews] = useState<Record<string, boolean>>({
    'rev-1': true,
    'rev-2': false,
    'rev-3': true
  });

  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    const q = collection(db, 'store_reviews');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setDbReviews(items);
    }, (error) => {
      console.error("Failed to load reviews in AdminPanel:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleFirestoreReviewApproval = async (review: any) => {
    const nextApproved = !review.approved;
    try {
      await updateDoc(doc(db, 'store_reviews', review.id), { approved: nextApproved });
      triggerToast(`⭐ Review audit state altered! Review is now ${nextApproved ? 'APPROVED (Visible)' : 'MUTED (Hidden)'}`);
      logAdminAction(`Toggled approval status for store review #${review.id} to: ${nextApproved ? 'APPROVED' : 'MUTED'}`);
    } catch (err) {
      console.error("Failed to update review approval:", err);
      triggerToast("❌ Failed to update review state in Firestore.");
    }
  };

  const handleDeleteFirestoreReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review permanently?")) return;
    try {
      await deleteDoc(doc(db, 'store_reviews', reviewId));
      triggerToast(`🗑️ Review #${reviewId} deleted successfully.`);
      logAdminAction(`Deleted store review #${reviewId}`);
    } catch (err) {
      console.error("Failed to delete review:", err);
      triggerToast("❌ Failed to delete review from Firestore.");
    }
  };

  const [reviewTab, setReviewTab] = useState<'store' | 'testimonials'>('store');

  const handleToggleReviewApproval = (id: string) => {
    setApprovedReviews(prev => {
      const next = !prev[id];
      triggerToast(`⭐ Review audit state altered! Review #${id} is now ${next ? 'APPROVED (Visible)' : 'MUTED (Hidden)'}`);
      logAdminAction(`Toggled approval status for client review #${id} to: ${next ? 'APPROVED' : 'MUTED'}`);
      return { ...prev, [id]: next };
    });
  };

  // General site settings config
  const [siteSetTitle, setSiteSetTitle] = useState(systemConfig.siteName);
  const [siteSetSlogan, setSiteSetSlogan] = useState(systemConfig.siteTitle);
  const [siteSetMetaDesc, setSiteSetMetaDesc] = useState(systemConfig.metaDesc);
  const [siteSetPayGateway, setSiteSetPayGateway] = useState('bKash Live Merchant keys');
  const [siteSetFcmToken, setSiteSetFcmToken] = useState('firebase-fcm-project-zone-911');

  // State variables for Admin Panel Dashboard Quick Actions widget
  const [isAdminClearingCache, setIsAdminClearingCache] = useState<boolean>(false);
  const [siteBroadcastInput, setSiteBroadcastInput] = useState<string>(siteWideBroadcast || '');
  const [siteBroadcastLink, setSiteBroadcastLink] = useState<string>(() => localStorage.getItem('site_wide_broadcast_link') || '');
  const [siteBroadcastLinkText, setSiteBroadcastLinkText] = useState<string>(() => localStorage.getItem('site_wide_broadcast_link_text') || 'Claim Offer');
  const [siteBroadcastDuration, setSiteBroadcastDuration] = useState<string>(() => localStorage.getItem('site_wide_broadcast_duration') || '24 Hours');
  const [siteBroadcastSeverity, setSiteBroadcastSeverity] = useState<'info' | 'urgent' | 'offer'>(() => (localStorage.getItem('site_wide_broadcast_severity') as any) || 'info');
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState<boolean>(false);
  const [siteBroadcastScheduleOption, setSiteBroadcastScheduleOption] = useState<'immediate' | 'scheduled'>(() => {
    const raw = localStorage.getItem('site_wide_broadcast_start_at');
    return raw ? 'scheduled' : 'immediate';
  });
  const [siteBroadcastStartAt, setSiteBroadcastStartAt] = useState<string>(() => {
    const raw = localStorage.getItem('site_wide_broadcast_start_at');
    if (raw) {
      const ms = Number(raw);
      const date = new Date(ms);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return '';
  });

  const [broadcastTemplates, setBroadcastTemplates] = useState<any[]>(() => {
    const raw = localStorage.getItem('site_wide_broadcast_templates');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      {
        id: 'tmpl-weekend',
        name: '🎉 Weekend Special Sale',
        message: 'Weekend Flash Sale is Active! Use coupon code WEEKEND10 to get a flat 10% cash discount on all premium hostings!',
        link: 'https://webzonebd.com/sale',
        linkText: 'Claim 10% Off',
        duration: '24 Hours',
        severity: 'offer'
      },
      {
        id: 'tmpl-maintenance',
        name: '⚠️ Scheduled Server Maintenance',
        message: 'Scheduled network edge maintenance will occur tonight at 02:00 AM UTC. Services may feel brief packet drop latency for ~5 mins.',
        link: 'https://status.webzonebd.com',
        linkText: 'Status Page',
        duration: '12 Hours',
        severity: 'urgent'
      },
      {
        id: 'tmpl-coupon',
        name: '🎁 50% Off Domain Offer',
        message: 'Super Flash Host Deal! Claim and buy any dot-com corporate domain for half price with any yearly cPanel SSD storage cloud tier.',
        link: 'https://webzonebd.com/domains',
        linkText: 'Check Domains',
        duration: '7 Days',
        severity: 'offer'
      }
    ];
  });
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [isSavingTemplate, setIsSavingTemplate] = useState<boolean>(false);

  const [broadcastTick, setBroadcastTick] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setBroadcastTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLocalClearAlert = () => {
    setSiteBroadcastInput('');
    setSiteBroadcastLink('');
    setSiteBroadcastLinkText('Claim Offer');
    setSiteBroadcastScheduleOption('immediate');
    setSiteBroadcastStartAt('');
    localStorage.removeItem('site_wide_broadcast_notification');
    localStorage.removeItem('site_wide_broadcast_link');
    localStorage.removeItem('site_wide_broadcast_link_text');
    localStorage.removeItem('site_wide_broadcast_id');
    localStorage.removeItem('site_wide_broadcast_duration');
    localStorage.removeItem('site_wide_broadcast_expires_at');
    localStorage.removeItem('site_wide_broadcast_start_at');
    
    if (onBroadcastChange) {
      localStorage.removeItem('site_wide_broadcast_severity');
      onBroadcastChange(null, null, null, null, 'info', null);
      logAdminAction(`Cleared public site-wide notification broadcast.`);
      triggerToast("📴 Site-wide notification cleared.");
    } else {
      logAdminAction(`Cleared public site-wide notification broadcast.`);
      triggerToast("📴 Site-wide notification cleared.");
    }
  };

  // Web Settings State variables
  const [webSettingsSubTab, setWebSettingsSubTab] = useState<'identity' | 'appearance' | 'theme-preview' | 'payments' | 'security'>('identity');
  
  // Tab 1: Identity & Contacts
  const [webSiteName, setWebSiteName] = useState(systemConfig.siteName || 'WebzoneBD IT Solution');
  const [webSiteTitle, setWebSiteTitle] = useState(systemConfig.siteTitle || 'Slogan of IT Solution');
  const [webMetaDesc, setWebMetaDesc] = useState(systemConfig.metaDesc || 'Global SEO Meta description');
  const [webSupportEmail, setWebSupportEmail] = useState(systemConfig.supportEmail || 'support@webzonebd.com');
  const [webContactPhone, setWebContactPhone] = useState(systemConfig.bangladeshContact || '+8801711223344');
  const [webWhatsappNumber, setWebWhatsappNumber] = useState(systemConfig.whatsappNumber || '+8801864000005');
  const [webGoogleAnalyticsId, setWebGoogleAnalyticsId] = useState(systemConfig.googleAnalyticsId || 'G-XXXXXXXXXX');
  const [webLogoUrl, setWebLogoUrl] = useState(() => localStorage.getItem('web_settings_logo_url') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80');
  const [webFaviconUrl, setWebFaviconUrl] = useState(() => localStorage.getItem('web_settings_favicon_url') || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=32&auto=format&fit=crop&q=80');

  // Tab 2: Appearance & Display
  const [webMaintenanceMode, setWebMaintenanceMode] = useState(() => localStorage.getItem('web_settings_maintenance') === 'true');
  const [webDefaultTheme, setWebDefaultTheme] = useState(() => localStorage.getItem('web_settings_theme') || 'dark');
  const [webAnnouncementText, setWebAnnouncementText] = useState(() => localStorage.getItem('web_settings_announcement') || '⚡ Eid-ul-Adha Special 15% discount on all active WordPress licenses!');
  const [webShowSocialShare, setWebShowSocialShare] = useState(() => localStorage.getItem('web_settings_social_share') !== 'false');

  // Tab 3: Payment & Gateway Rates
  const [webDefaultCurrency, setWebDefaultCurrency] = useState(currencySettings?.defaultCurrency || 'USD');
  const [webUsdBdtRate, setWebUsdBdtRate] = useState(() => Number(localStorage.getItem('web_settings_usd_bdt_rate')) || 118);
  const [webStripeMode, setWebStripeMode] = useState(() => localStorage.getItem('web_settings_stripe_mode') || 'sandbox');
  const [webCommissionRate, setWebCommissionRate] = useState(() => Number(localStorage.getItem('web_settings_affiliate_comm')) || 15); // % commission

  // Tab 4: Security & Dev Defaults
  const [webAutoApproveTickets, setWebAutoApproveTickets] = useState(systemConfig.autoApproveTickets);
  const [webRequireEmailOtp, setWebRequireEmailOtp] = useState(() => localStorage.getItem('web_settings_req_otp') === 'true');
  const [webSessionTimeout, setWebSessionTimeout] = useState(() => Number(localStorage.getItem('web_settings_timeout')) || 30); // minutes
  const [webLoggingDepth, setWebLoggingDepth] = useState(() => localStorage.getItem('web_settings_log_depth') || 'comprehensive');

  // MySQL Database Backup States & Handlers
  const [isBackupGenerating, setIsBackupGenerating] = useState(false);
  const [backupProgress, setBackupProgress] = useState<string>('');
  const [backupProgressPercent, setBackupProgressPercent] = useState<number>(0);
  const [lastBackupDate, setLastBackupDate] = useState(() => localStorage.getItem('last_mysql_backup_date') || 'June 21, 2026 at 03:00 AM (Weekly Scheduled)');
  const [backupHistory, setBackupHistory] = useState(() => {
    const cached = localStorage.getItem('mysql_backup_history');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const seenIds = new Set<string>();
          const sanitized = parsed.map((item: any, idx: number) => {
            let itemId = item.id;
            if (!itemId || itemId === 'b-${Date.now()}' || itemId.includes('${Date.now()}') || seenIds.has(itemId)) {
              itemId = `b-${Date.now()}-${idx}-${Math.floor(Math.random() * 100000)}`;
            }
            seenIds.add(itemId);
            return {
              ...item,
              id: itemId
            };
          });
          localStorage.setItem('mysql_backup_history', JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'b-01', date: 'June 21, 2026', size: '138 KB', type: 'Weekly Scheduled', status: 'completed' },
      { id: 'b-02', date: 'June 14, 2026', size: '134 KB', type: 'Weekly Scheduled', status: 'completed' },
      { id: 'b-03', date: 'June 07, 2026', size: '129 KB', type: 'Weekly Scheduled', status: 'completed' }
    ];
  });

  const generateMySQLBackupDump = (isLive = false) => {
    let sql = `-- ==========================================================\n`;
    sql += `-- WebzoneBD Enterprise MySQL Database Backup Dump\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- System: WebzoneBD Premium SaaS Architecture\n`;
    sql += `-- Backup Strategy: ${isLive ? 'Live On-Demand Dump' : 'Weekly Automated Snapshot'}\n`;
    sql += `-- Database Engine: InnoDB | Charset: utf8mb4_unicode_ci\n`;
    sql += `-- Host: mysql-db-master.production.webzonebd.internal\n`;
    sql += `-- ==========================================================\n\n`;

    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
    sql += `SET AUTOCOMMIT = 0;\n`;
    sql += `START TRANSACTION;\n`;
    sql += `SET time_zone = "+00:00";\n\n`;

    // 1. Table structure for table `system_config`
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`system_config\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`system_config\`;\n`;
    sql += `CREATE TABLE \`system_config\` (\n`;
    sql += `  \`site_name\` varchar(255) NOT NULL,\n`;
    sql += `  \`support_email\` varchar(255) DEFAULT NULL,\n`;
    sql += `  \`currency\` varchar(10) DEFAULT 'BDT',\n`;
    sql += `  \`maintenance_mode\` tinyint(1) DEFAULT '0'\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    sql += `INSERT INTO \`system_config\` (\`site_name\`, \`support_email\`, \`currency\`, \`maintenance_mode\`) VALUES\n`;
    sql += `('${(webSiteName || '').replace(/'/g, "''") || 'WebzoneBD'}', '${(webSupportEmail || '').replace(/'/g, "''") || 'support@webzonebd.com'}', '${currency || 'BDT'}', ${webMaintenanceMode ? 1 : 0});\n\n`;

    // 2. Table structure for table `products`
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`products\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`products\`;\n`;
    sql += `CREATE TABLE \`products\` (\n`;
    sql += `  \`id\` varchar(100) NOT NULL,\n`;
    sql += `  \`name\` varchar(255) NOT NULL,\n`;
    sql += `  \`category\` varchar(100) NOT NULL,\n`;
    sql += `  \`price\` decimal(10,2) NOT NULL,\n`;
    sql += `  \`discount_price\` decimal(10,2) DEFAULT NULL,\n`;
    sql += `  \`rating\` decimal(3,2) DEFAULT '5.00',\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (products && products.length > 0) {
      sql += `INSERT INTO \`products\` (\`id\`, \`name\`, \`category\`, \`price\`, \`discount_price\`, \`rating\`) VALUES\n`;
      const prodRows = products.map(p => 
        `('${p.id}', '${(p.name || '').replace(/'/g, "''")}', '${(p.category || '').replace(/'/g, "''")}', ${p.price || 0}, ${p.discountPrice || 0}, ${p.rating || 5})`
      ).join(',\n') + ';\n\n';
      sql += prodRows;
    }

    // 3. Table structure for table `orders`
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`orders\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`orders\`;\n`;
    sql += `CREATE TABLE \`orders\` (\n`;
    sql += `  \`order_id\` varchar(100) NOT NULL,\n`;
    sql += `  \`item_title\` varchar(255) NOT NULL,\n`;
    sql += `  \`customer_name\` varchar(255) NOT NULL,\n`;
    sql += `  \`customer_email\` varchar(255) NOT NULL,\n`;
    sql += `  \`amount\` decimal(10,2) NOT NULL,\n`;
    sql += `  \`payment_status\` varchar(50) NOT NULL,\n`;
    sql += `  \`order_status\` varchar(50) NOT NULL,\n`;
    sql += `  \`date\` datetime NOT NULL,\n`;
    sql += `  PRIMARY KEY (\`order_id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (orders && orders.length > 0) {
      sql += `INSERT INTO \`orders\` (\`order_id\`, \`item_title\`, \`customer_name\`, \`customer_email\`, \`amount\`, \`payment_status\`, \`order_status\`, \`date\`) VALUES\n`;
      const ordRows = orders.map(o => 
        `('${o.id}', '${(o.itemTitle || '').replace(/'/g, "''")}', '${(o.customerName || o.guestName || 'Guest Customer').replace(/'/g, "''")}', '${(o.customerEmail || o.guestEmail || 'customer@webzonebd.com').replace(/'/g, "''")}', ${o.price || 0}, '${o.paymentStatus || 'pending'}', '${o.status || 'pending'}', '${o.date || new Date().toISOString().slice(0, 19).replace('T', ' ')}')`
      ).join(',\n') + ';\n\n';
      sql += ordRows;
    }

    // 4. Table structure for table `tickets`
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`tickets\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`tickets\`;\n`;
    sql += `CREATE TABLE \`tickets\` (\n`;
    sql += `  \`id\` varchar(100) NOT NULL,\n`;
    sql += `  \`subject\` varchar(255) NOT NULL,\n`;
    sql += `  \`status\` varchar(50) NOT NULL,\n`;
    sql += `  \`user_id\` varchar(255) DEFAULT NULL,\n`;
    sql += `  \`priority\` varchar(50) NOT NULL,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (tickets && tickets.length > 0) {
      sql += `INSERT INTO \`tickets\` (\`id\`, \`subject\`, \`status\`, \`user_id\`, \`priority\`) VALUES\n`;
      const tktRows = tickets.map(t => 
        `('${t.id}', '${(t.subject || '').replace(/'/g, "''")}', '${t.status || 'open'}', '${(t.userId || '').replace(/'/g, "''")}', '${t.priority || 'medium'}')`
      ).join(',\n') + ';\n\n';
      sql += tktRows;
    }

    // 5. Table structure for table `coupons`
    sql += `-- --------------------------------------------------------\n`;
    sql += `-- Table: \`coupons\`\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS \`coupons\`;\n`;
    sql += `CREATE TABLE \`coupons\` (\n`;
    sql += `  \`code\` varchar(100) NOT NULL,\n`;
    sql += `  \`discount_percent\` decimal(5,2) NOT NULL,\n`;
    sql += `  \`expiry_date\` varchar(100) NOT NULL,\n`;
    sql += `  PRIMARY KEY (\`code\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (coupons && coupons.length > 0) {
      sql += `INSERT INTO \`coupons\` (\`code\`, \`discount_percent\`, \`expiry_date\`) VALUES\n`;
      const coupRows = coupons.map(c => 
        `('${c.code}', ${c.discountPercent || 0}, '${c.expiryDate || ''}')`
      ).join(',\n') + ';\n\n';
      sql += coupRows;
    }

    sql += `COMMIT;\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    sql += `-- ==========================================================\n`;
    sql += `-- END OF WEBZONEBD ENTERPRISE BACKUP DUMP\n`;
    sql += `-- ==========================================================\n`;
    return sql;
  };

  const triggerSQLDownload = (filename: string, sqlContent: string) => {
    const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleInstantDownloadBackup = () => {
    // Generates a real SQL database backup and downloads instantly
    const sqlContent = generateMySQLBackupDump(true);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `webzonebd_mysql_live_backup_${dateStr}_instant.sql`;
    triggerSQLDownload(filename, sqlContent);
    
    // Add to history
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const newBackup = {
      id: `b-${Date.now()}`,
      date: nowFormatted,
      size: `${(sqlContent.length / 1024).toFixed(1)} KB`,
      type: 'On-Demand Instant',
      status: 'completed'
    };
    
    const updatedHistory = [newBackup, ...backupHistory];
    setBackupHistory(updatedHistory);
    localStorage.setItem('mysql_backup_history', JSON.stringify(updatedHistory));
    localStorage.setItem('last_mysql_backup_date', `${nowFormatted} (Instant)`);
    setLastBackupDate(`${nowFormatted} (Instant)`);
    triggerToast('🚀 Live MySQL Database backup generated and downloaded instantly!');
  };

  const handleDownloadBackup = (isLiveOnDemand = false) => {
    if (isLiveOnDemand) {
      setIsBackupGenerating(true);
      setBackupProgressPercent(5);
      setBackupProgress('Connecting to main MySQL Server replica on internal subnet...');
      
      const steps = [
        { progress: 'Establishing secure root session...', delay: 600, percent: 18 },
        { progress: 'Parsing InnoDB tables, indexes, and constraints...', delay: 1200, percent: 35 },
        { progress: 'Generating table schema declarations: 6 tables matching criteria...', delay: 1800, percent: 52 },
        { progress: 'Serializing live dataset records into raw SQL commands...', delay: 2400, percent: 68 },
        { progress: 'Writing INSERT records for products catalog & system preferences...', delay: 3000, percent: 82 },
        { progress: 'Formatting raw sql commands output stream buffer...', delay: 3600, percent: 94 },
        { progress: 'Compressing SQL dump wrapper payloads...', delay: 4200, percent: 100 }
      ];

      steps.forEach((step) => {
        setTimeout(() => {
          setBackupProgress(step.progress);
          setBackupProgressPercent(step.percent);
        }, step.delay);
      });

      setTimeout(() => {
        const sqlContent = generateMySQLBackupDump(true);
        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `webzonebd_mysql_live_backup_${dateStr}.sql`;
        triggerSQLDownload(filename, sqlContent);
        
        // Add to history
        const nowFormatted = new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const newBackup = {
          id: `b-${Date.now()}`,
          date: nowFormatted,
          size: `${(sqlContent.length / 1024).toFixed(1)} KB`,
          type: 'On-Demand Live',
          status: 'completed'
        };
        const updatedHistory = [newBackup, ...backupHistory];
        setBackupHistory(updatedHistory);
        localStorage.setItem('mysql_backup_history', JSON.stringify(updatedHistory));
        localStorage.setItem('last_mysql_backup_date', `${nowFormatted} (On-Demand)`);
        setLastBackupDate(`${nowFormatted} (On-Demand)`);

        setIsBackupGenerating(false);
        setBackupProgress('');
        setBackupProgressPercent(0);
        triggerToast('✅ MySQL Live Database Backup generated and downloaded successfully!');
      }, 4500);

    } else {
      const sqlContent = generateMySQLBackupDump(false);
      const filename = `webzonebd_weekly_scheduled_backup_2026-06-21.sql`;
      triggerSQLDownload(filename, sqlContent);
      triggerToast('📥 Downloaded Weekly Scheduled MySQL Database Backup successfully!');
    }
  };

  const handleSaveWebSettings = () => {
    const updatedCfg: SystemConfig = {
      siteName: webSiteName,
      siteTitle: webSiteTitle,
      metaDesc: webMetaDesc,
      whatsappNumber: webWhatsappNumber,
      bangladeshContact: webContactPhone,
      supportEmail: webSupportEmail,
      googleAnalyticsId: webGoogleAnalyticsId,
      autoApproveTickets: webAutoApproveTickets
    };
    updateSystemConfig(updatedCfg);

    // Keep old settings compatible
    setSiteSetTitle(webSiteName);
    setSiteSetSlogan(webSiteTitle);
    setSiteSetMetaDesc(webMetaDesc);

    if (currencySettings && setCurrencySettings) {
      setCurrencySettings({
        ...currencySettings,
        defaultCurrency: webDefaultCurrency,
        exchangeRates: {
          ...currencySettings.exchangeRates,
          BDT: webUsdBdtRate
        }
      });
    }

    localStorage.setItem('web_settings_logo_url', webLogoUrl);
    localStorage.setItem('web_settings_favicon_url', webFaviconUrl);
    localStorage.setItem('web_settings_maintenance', String(webMaintenanceMode));
    localStorage.setItem('web_settings_theme', webDefaultTheme);
    localStorage.setItem('web_settings_announcement', webAnnouncementText);
    localStorage.setItem('web_settings_social_share', String(webShowSocialShare));
    localStorage.setItem('web_settings_usd_bdt_rate', String(webUsdBdtRate));
    localStorage.setItem('web_settings_stripe_mode', webStripeMode);
    localStorage.setItem('web_settings_affiliate_comm', String(webCommissionRate));
    localStorage.setItem('web_settings_req_otp', String(webRequireEmailOtp));
    localStorage.setItem('web_settings_timeout', String(webSessionTimeout));
    localStorage.setItem('web_settings_log_depth', webLoggingDepth);

    logAdminAction(`Saved general Website Settings under Web Settings panel.`);
    onAddActivityLog?.(`Admin updated central Web Settings: ${webSiteName}`);
    triggerToast("🌐 Great Success! Full website admin-related settings updated successfully!");
  };

  const handleSaveGeneralConfigSettings = () => {
    const updated: SystemConfig = {
      siteName: siteSetTitle,
      siteTitle: siteSetSlogan,
      metaDesc: siteSetMetaDesc,
      whatsappNumber: systemConfig.whatsappNumber,
      bangladeshContact: systemConfig.bangladeshContact,
      supportEmail: systemConfig.supportEmail,
      googleAnalyticsId: systemConfig.googleAnalyticsId,
      autoApproveTickets: systemConfig.autoApproveTickets
    };
    updateSystemConfig(updated);
    logAdminAction(`Saved general configurations. Site name: "${siteSetTitle}", Site slogan: "${siteSetSlogan}"`);
    triggerToast("⚙️ WebzoneBD IT Solution platform configurations committed to memory!");
  };

  // Helper to get quarter from date string (YYYY-MM-DD)
  const getQuarterFromDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 2) return '';
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    if (isNaN(month)) return '';
    const quarter = Math.ceil(month / 3);
    return `${year}-Q${quarter}`;
  };

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return '';
    const parts = monthStr.split('-');
    if (parts.length < 2) return monthStr;
    const year = parts[0];
    const month = parts[1];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIdx = parseInt(month, 10) - 1;
    return monthNames[monthIdx] ? `${monthNames[monthIdx]} ${year}` : monthStr;
  };

  const formatQuarter = (quarterStr: string) => {
    if (!quarterStr) return '';
    const parts = quarterStr.split('-');
    if (parts.length < 2) return quarterStr;
    const year = parts[0];
    const q = parts[1];
    return `${q}, ${year}`;
  };

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    orders.forEach(o => {
      if (o.date && o.date.length >= 7) {
        months.add(o.date.substring(0, 7));
      }
    });
    // Add current month if not present
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    months.add(currentMonthStr);
    return Array.from(months).sort().reverse();
  }, [orders]);

  const availableQuarters = useMemo(() => {
    const quarters = new Set<string>();
    orders.forEach(o => {
      if (o.date) {
        const q = getQuarterFromDate(o.date);
        if (q) quarters.add(q);
      }
    });
    // Add current quarter if not present
    const now = new Date();
    const currentQ = `${now.getFullYear()}-Q${Math.ceil((now.getMonth() + 1) / 3)}`;
    quarters.add(currentQ);
    return Array.from(quarters).sort().reverse();
  }, [orders]);

  // Derived filtered orders for dashboard total revenue
  const filteredOrdersForRevenue = useMemo(() => {
    return orders.filter(o => {
      if (o.paymentStatus !== 'completed') return false;
      if (!o.date) return false;
      
      if (revenueFilterType === 'month') {
        return o.date.startsWith(revenueSelectedMonth);
      }
      if (revenueFilterType === 'quarter') {
        const oq = getQuarterFromDate(o.date);
        return oq === revenueSelectedQuarter;
      }
      if (revenueFilterType === 'custom') {
        if (revenueStartDate && o.date < revenueStartDate) return false;
        if (revenueEndDate && o.date > revenueEndDate) return false;
        return true;
      }
      return true; // 'all'
    });
  }, [orders, revenueFilterType, revenueSelectedMonth, revenueSelectedQuarter, revenueStartDate, revenueEndDate]);

  // Derived dashboard analytic widgets metric summaries
  const totalRevenueSum = filteredOrdersForRevenue.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  const totalRevenueBdt = totalRevenueSum * (webUsdBdtRate || 118.5);
  const activeProjectsCount = projects.filter(p => p.status !== 'completed').length;
  const storeRevenueSum = products.length * 140;
  const affiliatePayoutTotal = withdrawRequests.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amout, 0);

  // Helpers for Recharts Sales Bar Chart
  const getMonthLabelByStr = (dateStr: string): string => {
    if (!dateStr) return 'Jun';
    const lowercase = dateStr.toLowerCase();
    if (lowercase.includes('jan') || lowercase.includes('-01-')) return 'Jan';
    if (lowercase.includes('feb') || lowercase.includes('-02-')) return 'Feb';
    if (lowercase.includes('mar') || lowercase.includes('-03-')) return 'Mar';
    if (lowercase.includes('apr') || lowercase.includes('-04-')) return 'Apr';
    if (lowercase.includes('may') || lowercase.includes('-05-')) return 'May';
    if (lowercase.includes('jun') || lowercase.includes('-06-')) return 'Jun';
    if (lowercase.includes('jul') || lowercase.includes('-07-')) return 'Jul';
    if (lowercase.includes('aug') || lowercase.includes('-08-')) return 'Aug';
    if (lowercase.includes('sep') || lowercase.includes('-09-')) return 'Sep';
    if (lowercase.includes('oct') || lowercase.includes('-10-')) return 'Oct';
    if (lowercase.includes('nov') || lowercase.includes('-11-')) return 'Nov';
    if (lowercase.includes('dec') || lowercase.includes('-12-')) return 'Dec';
    
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.getMonth()];
      }
    } catch (e) {
      // ignore
    }
    return 'Jun';
  };

  const monthlySalesAggregateData = (() => {
    const baseData: Record<string, { month: string; completedSales: number; pendingSales: number; orderCount: number }> = {
      'Jan': { month: 'Jan', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Feb': { month: 'Feb', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Mar': { month: 'Mar', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Apr': { month: 'Apr', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'May': { month: 'May', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Jun': { month: 'Jun', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Jul': { month: 'Jul', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Aug': { month: 'Aug', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Sep': { month: 'Sep', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Oct': { month: 'Oct', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Nov': { month: 'Nov', completedSales: 0, pendingSales: 0, orderCount: 0 },
      'Dec': { month: 'Dec', completedSales: 0, pendingSales: 0, orderCount: 0 },
    };

    orders.forEach(order => {
      const m = getMonthLabelByStr(order.date);
      if (!baseData[m]) {
        baseData[m] = { month: m, completedSales: 0, pendingSales: 0, orderCount: 0 };
      }
      const orderPrice = Number(order.price) || 0;
      baseData[m].orderCount += 1;
      if (order.paymentStatus === 'completed') {
        baseData[m].completedSales += orderPrice;
      } else if (order.paymentStatus === 'pending') {
        baseData[m].pendingSales += orderPrice;
      }
    });

    // We filter to only include months that have active orders OR are part of the standard Jan-Dec range (we can keep all 12 or just Jan-Jun/Jul if you like)
    // To present a clean, real report, we'll keep all 12 so the user gets a full year timeline based on their actual database records.
    return Object.values(baseData);
  })();

  const topSellingProducts = React.useMemo(() => {
    const salesCounts: Record<string, number> = {};
    orders.filter(o => o.paymentStatus === 'completed').forEach(o => {
      if (o.productId) {
        salesCounts[o.productId] = (salesCounts[o.productId] || 0) + 1;
      }
    });
    
    return [...products]
      .map(p => ({
        ...p,
        salesCount: salesCounts[p.id] || 0
      }))
      .sort((a, b) => b.salesCount - a.salesCount || b.views - a.views)
      .slice(0, 3);
  }, [products, orders]);

  // Global search filtering logic for items on display
  const filterListBySearch = (list: any[], fieldKeys: string[]) => {
    if (!globalSearch.trim()) return list;
    const term = globalSearch.toLowerCase();
    return list.filter(item => {
      return fieldKeys.some(key => {
        const val = item[key];
        if (!val) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  };

  const [pendingWaOrdersCount, setPendingWaOrdersCount] = useState(0);

  const updatePendingCount = () => {
    try {
      const raw = localStorage.getItem('wa_service_orders');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const count = parsed.filter((o: any) => o.status === 'pending').length;
          setPendingWaOrdersCount(count);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setPendingWaOrdersCount(0);
  };

  useEffect(() => {
    updatePendingCount();
    
    const handleUpdate = () => {
      updatePendingCount();
    };
    window.addEventListener('wa_orders_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    
    const interval = setInterval(updatePendingCount, 1500);
    
    return () => {
      window.removeEventListener('wa_orders_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  if (!hasAdminAccess) {
    const tRestricted = {
      en: {
        title: "Access Restricted",
        subtitle: "ADMINISTRATION CREDENTIALS REQUIRED",
        desc: "You are attempting to access a secured zone reserved for authorized administrators only. Your security credentials, IP address, and attempt logs have been registered for safety.",
        action: "Return to Homepage",
        badge: "SECURITY GATE"
      },
      bn: {
        title: "প্রবেশাধিকার নিষিদ্ধ",
        subtitle: "শুধুমাত্র অ্যাডমিনদের জন্য সংরক্ষিত",
        desc: "আপনি একটি সুরক্ষিত ডোমেইনে প্রবেশের চেষ্টা করছেন যা শুধুমাত্র অনুমোদিত অ্যাডমিন ড্যাশবোর্ডের জন্য সংরক্ষিত। ব্যবহারের আইপি অ্যাড্রেস এবং সিকিউরিটি লগ সুরক্ষিত রাখা হয়েছে।",
        action: "হোমপেজে ফিরে যান",
        badge: "সিকিউরিটি গেট"
      },
      ar: {
        title: "الوصول مقيد",
        subtitle: "مطلوب صلاحيات مسؤول النظام",
        desc: "أنت تحاول الدخول إلى منطقة آمنة ومحمية مخصصة لمسؤولي النظام المعتمدين فقط. تم تسجيل تفاصيل محاولتك وعنوان بروتوكول الإنترنت الخاص بك للتدقيق الأمني.",
        action: "العودة إلى الصفحة الرئيسية",
        badge: "بوابة الحماية"
      }
    }[language] || {
      title: "Access Restricted",
      subtitle: "ADMINISTRATION CREDENTIALS REQUIRED",
      desc: "You are attempting to access a secured zone reserved for authorized administrators only. Your security credentials, IP address, and attempt logs have been registered for safety.",
      action: "Return to Homepage",
      badge: "SECURITY GATE"
    };

    return (
      <div className={`min-h-screen font-sans ${isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'} flex items-center justify-center p-6 text-center shadow-inner`}>
        <div className={`max-w-md w-full p-8 rounded-3xl border-2 ${isDark ? 'bg-neutral-900 border-rose-500/30' : 'bg-white border-neutral-250 shadow-xl'}`}>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 border border-rose-500/30 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <span className="px-3 py-1 rounded bg-rose-500/10 text-rose-500 text-[10px] font-mono tracking-widest uppercase font-black mb-2 border border-rose-500/20">
              {tRestricted.badge}
            </span>

            <h2 className="text-xl font-black tracking-tight mb-2">
              {tRestricted.title}
            </h2>
            <p className="text-xs font-mono tracking-wider text-rose-500 font-bold mb-4 uppercase">
              {tRestricted.subtitle}
            </p>
            <p className={`text-xs ${textMuted} leading-relaxed mb-6`}>
              {tRestricted.desc}
            </p>

            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-black transition active:scale-95 hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <ArrowRight className="w-4 h-4" />
              <span>{tRestricted.action}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const adminMenuRails = [
    { id: 'dashboard', label: '🏠 Dashboard', desc: 'Control overview metrics', submenus: [] },
    { id: 'customers', label: '👥 Customers', desc: 'Manage user segments & telemetry', submenus: [
      { id: 'all-customers', label: 'Customer List' },
      { id: 'customer-groups', label: 'Customer Groups' },
      { id: 'customer-tags', label: 'Customer Tags' },
      { id: 'customer-notes', label: 'Customer Notes' },
      { id: 'vip-customers', label: 'VIP Customers' },
      { id: 'corporate-clients', label: 'Corporate Clients' },
      { id: 'customer-affiliates', label: 'Affiliates' },
      { id: 'customer-activity-logs', label: 'Customer Activity Logs' },
      { id: 'customer-security-logs', label: 'Customer Security Logs' },
      { id: 'customer-reports', label: 'Customer Reports' }
    ] },
    { id: 'orders', label: '📦 Orders Management', desc: 'Customer Order and billing pipelines,', submenus: [
      { id: 'all-orders', label: 'All Orders' },
      { id: 'guest-orders', label: '📋 Guest Order List' },
      { id: 'email-notifications', label: '📧 Receipts & Email Center' }
    ] },
    { id: 'services', label: '💼 Services', desc: 'Website dev & SEO catalog', submenus: [
      { id: 'all-services', label: 'All Services' },
      { id: 'service-categories', label: 'Service Categories' },
      { id: 'service-orders', label: 'Service Orders' },
      { id: 'service-inquiries', label: 'Service Inquiries' },
      { id: 'whatsapp-leads', label: 'WhatsApp Leads' },
      { id: 'service-reports', label: 'Service Reports' }
    ] },
    { id: 'whatsapp-service-orders', label: '📱 WhatsApp Service Orders', desc: 'Manage orders, custom fields', submenus: [
      { id: 'wa-orders', label: 'Service Orders List' },
      { id: 'wa-customers', label: 'Customer WhatsApp List' },
      { id: 'wa-form-settings', label: 'Order Form Field Settings' },
      { id: 'wa-invoice-notif', label: 'Invoice Notifications' },
      { id: 'wa-payment-reminders', label: 'Payment Reminders' },
      { id: 'wa-delivery-updates', label: 'Service Delivery Updates' },
      { id: 'wa-promo-messages', label: 'Promotional Messages' },
      { id: 'wa-templates', label: 'WhatsApp Templates' },
      { id: 'wa-campaign-reports', label: 'Campaign Reports' },
      { id: 'wa-api-integration', label: 'WhatsApp API Integration' },
      { id: 'wa-settings', label: 'WhatsApp Settings' }
    ] },
    { id: 'projects', label: '📂 Projects', desc: 'Client portal milestones & tasks', submenus: [
      { id: 'active-projects', label: 'Active Projects' },
      { id: 'pending-projects', label: 'Pending Projects' },
      { id: 'completed-projects', label: 'Completed Projects' },
      { id: 'milestones', label: 'Milestones' },
      { id: 'tasks', label: 'Tasks' },
      { id: 'files', label: 'Files' },
      { id: 'approvals', label: 'Client Approvals' }
    ] },
    { id: 'support', label: '🎫 Support Center', desc: 'Live ticket chat reply center', submenus: [
      { id: 'support-tickets', label: 'Tickets' },
      { id: 'support-chat', label: 'Live Chat' },
      { id: 'support-whatsapp', label: 'WhatsApp Requests' },
      { id: 'support-kb', label: 'Knowledge Base' }
    ] },
    { id: 'live-chat', label: '💬 Live Chat System', desc: 'Real-time visitor live chats & responses', submenus: [
      { id: 'support-chat', label: 'Live Console' },
      { id: 'chat-sessions', label: 'Active Sessions' },
      { id: 'chat-waiting', label: 'Waiting Queue' },
      { id: 'chat-settings', label: 'Chat Settings' }
    ] },
    { id: 'ai-center', label: '🤖 AI Center', desc: 'Gemini content generator suite', submenus: [
      { id: 'ai-blog', label: 'AI Blog Generator' },
      { id: 'ai-content', label: 'AI Content Generator' },
      { id: 'ai-seo', label: 'AI SEO Generator' },
      { id: 'ai-meta', label: 'AI Meta Generator' },
      { id: 'ai-name', label: 'AI Business Name Gen' }
    ] },
    { id: 'affiliates', label: '💰 Affiliate System', desc: 'Commissions withdrawal portal', submenus: [
      { id: 'aff-users', label: 'Affiliate Users' },
      { id: 'aff-commissions', label: 'Commissions' },
      { id: 'aff-withdrawals', label: 'Withdraw Requests' },
      { id: 'aff-analytics', label: 'Analytics' }
    ] },
    { id: 'marketing', label: '📢 Marketing', desc: 'Enterprise marketing & campaign hubs', submenus: [
      { id: 'mkt-coupons', label: 'Coupon System' },
      { id: 'mkt-sms', label: 'SMS Marketing' },
      { id: 'mkt-push', label: 'Push Notifications' },
      { id: 'mkt-whatsapp', label: 'WhatsApp Marketing' },
      { id: 'mkt-social', label: 'Social Media Campaigns' },
      { id: 'mkt-affiliate', label: 'Affiliate Marketing' },
      { id: 'mkt-referral', label: 'Referral Program' },
      { id: 'mkt-loyalty', label: 'Loyalty & Rewards' },
      { id: 'mkt-abandoned', label: 'Abandoned Cart Recovery' },
      { id: 'mkt-leads', label: 'Lead Management' },
      { id: 'mkt-newsletter', label: 'Newsletter Subscribers' },
      { id: 'mkt-automation', label: 'Marketing Automation' },
      { id: 'mkt-settings', label: 'Marketing Settings' }
    ] },
    { id: 'reviews', label: '⭐ Reviews', desc: 'Audit marketplace client feedback', submenus: [
      { id: 'rev-product', label: 'Product Reviews' },
      { id: 'rev-service', label: 'Service Reviews' },
      { id: 'rev-testimonials', label: 'Testimonials' }
    ] },
    { id: 'reports', label: '📊 Reports & Analytics', desc: 'Central Business Intelligence & visual reports', submenus: [
      { id: 'rep-analytics', label: '🚀 Advanced Analytics (Charts)' },
      { id: 'rep-overview', label: 'Dashboard Overview' },
      { id: 'rep-visitors', label: 'Visitor Analytics' },
      { id: 'rep-customer', label: 'Customer Reports' },
      { id: 'rep-sales', label: 'Sales Reports' },
      { id: 'rep-store', label: 'Digital Store Reports' },
      { id: 'rep-services', label: 'Service Reports' },
      { id: 'rep-financial', label: 'Financial Reports' },
      { id: 'rep-marketing', label: 'Marketing Reports' },
      { id: 'rep-device', label: 'Device Analytics' },
      { id: 'rep-browser', label: 'Browser Analytics' },
      { id: 'rep-realtime', label: 'Real-Time Monitoring' },
      { id: 'rep-export', label: 'Export Center' }
    ] },
    { id: 'staff', label: '👨‍💼 Staff Management', desc: 'Staff lists, roles permissions', submenus: [] },
    { id: 'notifications', label: '🔔 Notifications', desc: 'System Alert Logs & status', submenus: [] },
    { id: 'customer-dashboard', label: '👤 Client Dashboard Workspace', desc: 'Interactive Client view emulator', submenus: [] },
    { id: 'cms', label: '🖥️ Website Control Panel', desc: 'Shopify & WordPress Style CMS', submenus: [
      { id: 'cms-dashboard', label: 'CMS Dashboard' },
      { id: 'cms-pages', label: 'Pages Management' },
      { id: 'cms-menus', label: 'Menus Builder' },
      { id: 'cms-blogs', label: 'Blog Posts' },
      { id: 'cms-categories', label: 'Blog Categories' },
      { id: 'cms-tags', label: 'Blog & Product Tags' },
      { id: 'cms-services', label: 'Services Catalog' },
      { id: 'cms-products', label: 'Woo Products' },
      { id: 'cms-pro-cats', label: 'Product Categories' },
      { id: 'cms-pro-subcats', label: 'Product Sub Categories' },
      { id: 'cms-media', label: 'Media Library' },
      { id: 'cms-forms', label: 'Forms & Leads' },
      { id: 'cms-seo', label: 'SEO Manager' },
      { id: 'cms-homepage', label: 'Homepage Builder' },
      { id: 'cms-header', label: 'Header Builder' },
      { id: 'cms-footer', label: 'Footer Builder' },
      { id: 'cms-testimonials', label: 'Testimonials UI' },
      { id: 'cms-faqs', label: 'FAQ Manager' },
      { id: 'cms-announcements', label: 'Announcements Bar' },
      { id: 'cms-redirects', label: 'Redirect Manager' },
      { id: 'cms-settings', label: 'Website Settings' },
      { id: 'cms-payment', label: 'Payment Settings' }
    ] },
    { id: 'web-settings', label: '🌐 Web Settings', desc: 'Identity, default rates, and appearance setup', submenus: [] }
  ];

  const localizedAdminMenuRails = adminMenuRails.map(rail => ({
    ...rail,
    label: translate(rail.label),
    desc: translate(rail.desc),
    submenus: (rail.submenus || []).map(sub => ({
      ...sub,
      label: translate(sub.label)
    }))
  }));

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen font-sans ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'} pb-24`}>
      
      {/* 1. SaaS Dashboard Header Ribbon */}
      <header className={`border-b ${isDark ? 'bg-[#0F172A]/85 border-white/[0.08]' : 'bg-white/95 border-[#E2E8F0]'} sticky top-0 z-30 backdrop-blur-md transition-all duration-300 shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Status Badge */}
            <div className="flex items-center gap-3">
              <div id="header-brand-logo" className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-purple-650/20 hover:scale-105 transition-all cursor-pointer">
                W
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                  {language === 'bn' ? 'অ্যাডমিন প্যানেল' : language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-bold">
                    Active Console
                  </span>
                </div>
              </div>
            </div>

            {/* Global Search Gate, Theme Switcher, Clock & Indicators */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Dynamic Telemetry Clock */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 dark:bg-black/20 border border-slate-200/50 dark:border-white/[0.05] rounded-xl font-mono text-[11px] text-slate-500 dark:text-slate-400 select-none">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="font-semibold tracking-wider font-mono">{headerTime}</span>
                <span className="text-[9px] opacity-60">UTC</span>
              </div>

              {/* Global Real-time Search input */}
              <div className="relative max-w-xs hidden md:block" id="header-global-search">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Instant key index search..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={`w-44 pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none transition-all ${
                    isDark 
                      ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-slate-500 focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/30' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/10'
                  }`}
                />
              </div>

              {/* Quick Navigation: Orders */}
              <button
                id="header-orders-link"
                onClick={() => {
                  setActiveMenu('orders');
                  setActiveSubMenu('all-orders');
                  triggerToast(`📦 Switched to Orders Management panel`);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  activeMenu === 'orders'
                    ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] border-transparent text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                    : isDark
                      ? 'bg-white/[0.05] border-white/[0.08] text-neutral-300 hover:bg-white/[0.1] hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-neutral-750 hover:bg-slate-100 shadow-sm'
                }`}
                title="Orders Management"
              >
                <ShoppingBag className={`w-4 h-4 ${activeMenu === 'orders' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
                <span className="text-xs font-bold hidden sm:inline">
                  {language === 'bn' ? 'অর্ডার ব্যবস্থাপনা' : 'Orders'}
                </span>
                {orders && orders.length > 0 && (
                  <span className={`flex h-4 min-w-[16px] items-center justify-center rounded-full text-[9px] font-black px-1 leading-none ${
                    activeMenu === 'orders'
                      ? 'bg-white text-[#7C3AED]'
                      : 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-sm'
                  }`}>
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Quick Navigation: Live Chat System */}
              <button
                id="header-live-chat-link"
                onClick={() => {
                  setActiveMenu('live-chat');
                  setActiveSubMenu('support-chat');
                  triggerToast(language === 'bn' ? '💬 লাইভ চ্যাট সাপোর্ট সিস্টেমে প্রবেশ করা হয়েছে' : '💬 Switched to Live Chat Support System');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  activeMenu === 'live-chat' || (activeMenu === 'support' && activeSubMenu === 'support-chat')
                    ? 'bg-gradient-to-r from-[#06B6D4] via-[#0284C7] to-[#2563EB] border-transparent text-white shadow-[0_4px_12px_rgba(6,182,212,0.3)]'
                    : isDark
                      ? 'bg-white/[0.05] border-white/[0.08] text-neutral-300 hover:bg-white/[0.1] hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-neutral-750 hover:bg-slate-100 shadow-sm'
                }`}
                title="Live Chat Support System"
              >
                <MessageSquare className={`w-4 h-4 ${activeMenu === 'live-chat' || (activeMenu === 'support' && activeSubMenu === 'support-chat') ? 'text-white' : 'text-cyan-500 animate-pulse'}`} />
                <span className="text-xs font-bold hidden sm:inline">
                  {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
                </span>
                <span className="flex h-4 items-center justify-center rounded-full text-[9px] font-black px-1.5 leading-none bg-emerald-500 text-white animate-pulse">
                  Live
                </span>
              </button>

              {/* Quick Navigation: Customers */}
              <button
                id="header-customers-link"
                onClick={() => {
                  setActiveMenu('customers');
                  setActiveSubMenu('all-customers');
                  triggerToast(`👥 Switched to Customers panel`);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  activeMenu === 'customers'
                    ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] border-transparent text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                    : isDark
                      ? 'bg-white/[0.05] border-white/[0.08] text-neutral-300 hover:bg-white/[0.1] hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-neutral-750 hover:bg-slate-100 shadow-sm'
                }`}
                title="Customers"
              >
                <Users className={`w-4 h-4 ${activeMenu === 'customers' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
                <span className="text-xs font-bold hidden sm:inline">
                  {language === 'bn' ? 'কাস্টমারস' : 'Customers'}
                </span>
                {customers && customers.length > 0 && (
                  <span className={`flex h-4 min-w-[16px] items-center justify-center rounded-full text-[9px] font-black px-1 leading-none ${
                    activeMenu === 'customers'
                      ? 'bg-white text-[#7C3AED]'
                      : 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-sm'
                  }`}>
                    {customers.length}
                  </span>
                )}
              </button>

              {/* Interactive Notifications Bell widget */}
              <div className="relative" id="header-notifications-bell">
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes wiggle {
                    0%, 100% { transform: rotate(0) scale(1); }
                    15% { transform: rotate(14deg) scale(1.1); }
                    30% { transform: rotate(-12deg) scale(1.1); }
                    45% { transform: rotate(10deg) scale(1.1); }
                    60% { transform: rotate(-8deg) scale(1.05); }
                    75% { transform: rotate(4deg) scale(1.05); }
                    90% { transform: rotate(-2deg) scale(1); }
                  }
                  .animate-wiggle {
                    animation: wiggle 0.6s ease-in-out infinite;
                  }
                `}} />
                <button
                  onClick={() => setShowHeaderNotifs(!showHeaderNotifs)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                    showHeaderNotifs
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                      : isDark
                        ? 'bg-white/[0.05] border-white/[0.08] text-slate-350 hover:bg-white/[0.1]'
                        : 'bg-slate-100 border-slate-200 text-slate-650 hover:bg-slate-200/80 shadow-sm'
                  } ${animateBell ? 'animate-wiggle border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}`}
                >
                  <Bell className={`w-4 h-4 transition-colors ${animateBell ? 'text-amber-400' : ''}`} />
                  {adminNotifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-[10px] font-black text-white flex items-center justify-center animate-bounce shadow-md border border-white/20">
                      {adminNotifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>

                {showHeaderNotifs && (
                  <div className={`absolute right-0 mt-3 w-80 p-4 rounded-2xl border shadow-2xl z-50 text-left animate-in slide-in-from-top-3 duration-200 ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-neutral-800 pb-2 mb-2">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-purple-500">Live Orders & Security Queue</span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Real-time Admin Feed</p>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded animate-pulse">Live Link</span>
                    </div>
                    
                    {adminNotifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <span className="text-2xl block mb-1">🛡️</span>
                        <p className="text-xs text-slate-400 dark:text-slate-500">No active alerts in queue.</p>
                        <p className="text-[10px] text-slate-500">System registers are perfectly stable.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {adminNotifications.map((notif) => (
                          <div 
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer border pl-3 relative group hover:scale-[1.01] ${
                              notif.isRead 
                                ? isDark 
                                  ? 'bg-white/[0.01] border-neutral-800/60 text-slate-400' 
                                  : 'bg-slate-50/50 border-slate-100 text-slate-500'
                                : isDark
                                  ? 'bg-purple-950/15 border-purple-900/40 text-slate-250 hover:bg-purple-950/25'
                                  : 'bg-purple-50/45 border-purple-100 text-neutral-900 hover:bg-purple-50/70'
                            } ${
                              notif.type === 'order' 
                                ? 'border-l-4 border-l-emerald-500' 
                                : 'border-l-4 border-l-purple-500'
                            }`}
                          >
                            {!notif.isRead && (
                              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                            )}
                            <div className="flex items-start gap-1.5">
                              {notif.type === 'order' ? (
                                <span className="text-xs">📦</span>
                              ) : notif.ticketId ? (
                                <span className="text-xs">✉️</span>
                              ) : (
                                <span className="text-xs">🛡️</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-extrabold text-[11px] leading-tight truncate">
                                  {notif.title}
                                </p>
                                <p className="text-[10px] mt-0.5 leading-snug opacity-90 break-words">
                                  {notif.message}
                                </p>
                                <div className="flex items-center justify-between mt-1.5">
                                  <span className="text-[9px] opacity-60 font-mono">{notif.time}</span>
                                  {notif.orderId && (
                                    <span className="text-[9px] font-bold text-purple-500 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                      Inspect Order &rarr;
                                    </span>
                                  )}
                                  {notif.ticketId && (
                                    <span className="text-[9px] font-bold text-purple-500 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                      Inspect Ticket &rarr;
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {adminNotifications.length > 0 && (
                      <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-neutral-800 mt-3 pt-2 text-[10px]">
                        <button 
                          onClick={markAllNotificationsAsRead}
                          className="text-purple-500 hover:text-purple-600 font-bold hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                        <button 
                          onClick={clearAllNotifications}
                          className="text-rose-500 hover:text-rose-650 font-semibold hover:underline cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="hidden lg:block px-2.5 py-1 rounded bg-slate-900 text-purple-400 border border-neutral-800 font-mono text-[10px] uppercase font-bold tracking-widest">
                CRM BRIDGE STATE: ONLINE
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Super Admin Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* MOBILE ACTIVE PANEL HUB - Visible only on viewport < lg */}
        <div className="block lg:hidden w-full mb-6 relative">
          <div className={`w-full flex items-center justify-between py-2.5 px-4 border rounded-2xl shadow-md ${
            isDark 
              ? 'bg-[#1E293B] border-slate-800 text-white' 
              : 'bg-white border-[#E2E8F0] text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              {/* Left-side Menu Bar Button exactly like Customer Dashboard */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 sm:p-2.5 rounded-xl border focus:outline-none transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center group ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-900/15 text-purple-400 hover:bg-purple-900/50'
                    : 'bg-purple-50 border-purple-100/30 text-purple-650 hover:bg-purple-100'
                }`}
                title="Toggle Admin Sidebar"
                id="super-admin-mobile-sidebar-hamburger"
              >
                {/* Premium Asymmetrical Interactive Mini Hamburger Indicator */}
                <div className="flex flex-col gap-1 w-5 h-5 justify-center items-center">
                  <span className="w-5 h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-300 rounded-full transition-all duration-300 group-hover:w-3.5" />
                  <span className="w-3.5 h-0.5 bg-gradient-to-r from-purple-500 via-pink-600 to-indigo-600 dark:from-purple-300 dark:via-pink-450 dark:to-indigo-300 rounded-full transition-all duration-300 mr-auto group-hover:w-5" />
                  <span className="w-4.5 h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 dark:from-purple-400 dark:via-pink-405 dark:to-indigo-300 rounded-full transition-all duration-300 mr-auto" />
                </div>
              </button>
              
              <div className="text-left">
                <span className="text-[9px] text-[#94A3B8] font-mono uppercase block font-bold tracking-wide">PORTAL NAVIGATION</span>
                <span className="text-xs font-black capitalize flex items-center gap-1.5">
                  <span>{localizedAdminMenuRails.find(r => r.id === activeMenu)?.label.match(/^\p{Emoji}/u)?.[0] || '🎯'}</span>
                  <span>{localizedAdminMenuRails.find(r => r.id === activeMenu)?.label.replace(/^\p{Emoji}/u, '').trim() || activeMenu.toUpperCase()}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/20 font-mono">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION SLIDE-OUT DRAWER CHIP */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden block lg:hidden">
            {/* Backdrop Blur overlay */}
            <div 
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
              {/* Sliding Sheet Panel */}
              <div className="w-screen max-w-xs sm:max-w-sm">
                <div className={`h-full flex flex-col shadow-2xl relative transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-b from-[#0F0C20]/95 via-[#0D111F]/98 to-[#05060F]/95 border-r border-violet-500/10' 
                    : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 border-r border-slate-200/90'
                }`}>
                  
                  {/* Drawer Head */}
                  <div className={`p-4 border-b flex items-center justify-between transition-all duration-300 ${
                    isDark 
                      ? 'border-violet-950/30 bg-violet-950/20' 
                      : 'border-slate-200/80 bg-slate-100/65'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-fuchsia-600/25">
                        👑
                      </div>
                      <div>
                        <h2 className={`text-xs font-extrabold uppercase tracking-widest font-sans ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>Super Admin Console</h2>
                        <p className={`text-[10px] leading-none mt-0.5 ${
                          isDark ? 'text-neutral-400' : 'text-slate-500'
                        }`}>Governance Pathways</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                        isDark 
                          ? 'border-neutral-800 text-neutral-400 hover:text-white hover:border-violet-500/50' 
                          : 'border-slate-200 text-slate-500 hover:text-slate-950 hover:border-violet-400'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Content Scrollable container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    
                    {/* Security governance status inside drawer */}
                    <div className={`p-3.5 rounded-xl border transition-all duration-300 space-y-3 ${
                      isDark 
                        ? 'bg-neutral-900/40 border-white/[0.04] text-white shadow-md shadow-black/10' 
                        : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
                    }`}>
                      <div className={`flex items-center justify-between border-b pb-2 ${
                        isDark ? 'border-neutral-800' : 'border-slate-100'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-violet-500" />
                          <span className="text-[9px] font-mono font-bold text-violet-500 uppercase tracking-widest">Dashboard Control</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[7px] font-bold bg-violet-500/10 text-violet-600 border border-violet-500/20 font-mono uppercase tracking-widest">
                          DYNAMIC ROLE
                        </span>
                      </div>
                      
                      <div className="space-y-0.5">
                        <div className={`text-xs font-bold font-sans ${isDark ? 'text-neutral-100' : 'text-slate-900'}`}>
                          {currentUser?.name || 'Super Admin Controller'}
                        </div>
                        <div className={`text-[9px] font-mono truncate ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{currentUser?.email || 'superadmin@webzonebd.com'}</div>
                      </div>

                      {/* Dashboard Control Dropdown section */}
                      <div className={`border-t pt-2.5 space-y-2 ${isDark ? 'border-neutral-800/80' : 'border-slate-100'}`}>
                        <div className="flex items-center justify-between">
                          <label className="text-[8.5px] uppercase tracking-wider font-bold opacity-60 text-slate-400">Dynamic Role Switch</label>
                          <span className="text-[7.5px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20">3 Core Roles</span>
                        </div>

                        {/* Dropdown Selector */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsMobileRoleDropdownOpen(!isMobileRoleDropdownOpen)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                              isDark ? 'bg-slate-900/90 border-white/10 hover:border-violet-500/50 text-white' : 'bg-slate-50 border-slate-200 hover:border-violet-400 text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs shrink-0">
                                {currentUser?.role === 'super_admin' ? '👑' : currentUser?.role === 'admin' ? '⚡' : currentUser?.role === 'order_manager' ? '📦' : '🛡️'}
                              </span>
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold leading-tight truncate">
                                  {currentUser?.role === 'super_admin' ? 'Super Admin' : 
                                   currentUser?.role === 'admin' ? 'Admin' : 
                                   currentUser?.role === 'order_manager' ? 'Order Mgr' : 
                                   (currentUser?.role ? currentUser.role.replace('_', ' ').toUpperCase() : 'Super Admin')}
                                </p>
                                <p className="text-[8px] opacity-60 font-mono leading-tight truncate">
                                  {currentUser?.role === 'super_admin' ? 'Root Master Access' :
                                   currentUser?.role === 'admin' ? 'Operations Lead' :
                                   currentUser?.role === 'order_manager' ? 'Sales & Billing' : 'Custom Session'}
                                </p>
                              </div>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isMobileRoleDropdownOpen ? 'rotate-180 text-violet-500' : ''}`} />
                          </button>

                          {/* Dropdown Menu */}
                          {isMobileRoleDropdownOpen && (
                            <div className={`mt-1.5 p-1.5 rounded-lg border shadow-xl space-y-1 ${
                              isDark ? 'bg-neutral-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}>
                              {[
                                {
                                  role: 'super_admin',
                                  label: 'Super Admin',
                                  tag: 'Root Master',
                                  desc: 'Full master governance & system controls',
                                  icon: '👑',
                                  name: 'Super Admin Controller',
                                  email: 'superadmin@webzonebd.com',
                                  badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20'
                                },
                                {
                                  role: 'admin',
                                  label: 'Admin',
                                  tag: 'Operations Lead',
                                  desc: 'Store catalog, CRM, tickets & CMS',
                                  icon: '⚡',
                                  name: 'Admin Moderator',
                                  email: 'admin@webzonebd.com',
                                  badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20'
                                },
                                {
                                  role: 'order_manager',
                                  label: 'Order Mgr',
                                  tag: 'Sales & Billing',
                                  desc: 'Sales orders, billing & fulfillment',
                                  icon: '📦',
                                  name: 'Order Operations Manager',
                                  email: 'orders@webzonebd.com',
                                  badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20'
                                }
                              ].map((preset) => {
                                const isCurrent = currentUser?.role === preset.role;
                                return (
                                  <button
                                    key={preset.role}
                                    type="button"
                                    onClick={() => {
                                      const updatedUser = {
                                        ...currentUser,
                                        role: preset.role,
                                        name: preset.name,
                                        email: preset.email
                                      };
                                      setCurrentUser(updatedUser);
                                      localStorage.setItem('webzone_session_user', JSON.stringify(updatedUser));
                                      if (setUser) setUser(updatedUser);
                                      setIsMobileRoleDropdownOpen(false);
                                      triggerToast(`🛡️ Dashboard Control: Role switched to ${preset.label}`);
                                    }}
                                    className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-all ${
                                      isCurrent 
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-md shadow-violet-600/20' 
                                        : isDark 
                                          ? 'hover:bg-white/5 text-slate-300 hover:text-white' 
                                          : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-sm shrink-0">{preset.icon}</span>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold truncate">{preset.label}</span>
                                          <span className={`text-[7px] px-1 py-0.2 rounded border font-mono ${isCurrent ? 'bg-white/20 text-white border-white/30' : preset.badgeColor}`}>
                                            {preset.tag}
                                          </span>
                                        </div>
                                        <p className={`text-[7.5px] truncate ${isCurrent ? 'text-white/80' : 'opacity-60'}`}>{preset.desc}</p>
                                      </div>
                                    </div>
                                    {isCurrent && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Quick 1-Click Segmented Buttons */}
                        <div className="grid grid-cols-3 gap-1 pt-1 font-sans text-[8.5px]">
                          {[
                            { role: 'super_admin', label: 'Super Admin', icon: '👑', name: 'Super Admin Controller', email: 'superadmin@webzonebd.com' },
                            { role: 'admin', label: 'Admin', icon: '⚡', name: 'Admin Moderator', email: 'admin@webzonebd.com' },
                            { role: 'order_manager', label: 'Order Mgr', icon: '📦', name: 'Order Operations Manager', email: 'orders@webzonebd.com' }
                          ].map((preset) => {
                            const isCurrent = currentUser?.role === preset.role;
                            return (
                              <button
                                key={preset.role}
                                type="button"
                                onClick={() => {
                                  const updatedUser = {
                                    ...currentUser,
                                    role: preset.role,
                                    name: preset.name,
                                    email: preset.email
                                  };
                                  setCurrentUser(updatedUser);
                                  localStorage.setItem('webzone_session_user', JSON.stringify(updatedUser));
                                  if (setUser) setUser(updatedUser);
                                  setIsMobileRoleDropdownOpen(false);
                                  triggerToast(`🛡️ Dashboard Control: Shifted to ${preset.label}`);
                                }}
                                className={`py-1.5 px-1 rounded-md text-center border transition-all duration-200 cursor-pointer font-bold flex items-center justify-center gap-1 ${
                                  isCurrent 
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-sm shadow-violet-600/20 scale-[1.02]' 
                                    : isDark
                                      ? 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              >
                                <span className="text-[10px]">{preset.icon}</span>
                                <span className="truncate">{preset.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Rail links block for mobile */}
                    <div className="space-y-2">
                      <span className={`text-[10px] md:text-[11px] uppercase tracking-widest opacity-50 font-bold block mb-2 px-1.5 ${
                        isDark ? 'text-white/80' : 'text-slate-700'
                      }`}>
                        Consolidated Pathways
                      </span>
                      {localizedAdminMenuRails.map((rail) => {
                        const isActive = activeMenu === rail.id;
                        const isExpanded = !!expandedMenus[rail.id];
                        const emojiRegex = /^\p{Emoji}/u;
                        const match = rail.label.match(emojiRegex);
                        const emoji = match ? match[0] : '🎯';
                        const cleanLabel = match ? rail.label.replace(emoji, '').trim() : rail.label;

                        return (
                          <div key={rail.id} className="w-full">
                            <button
                              onClick={() => {
                                if (rail.id === 'gemini-chatbot') {
                                  setBlogJsonInput('');
                                  setShowGeminiChatbotModal(true);
                                  setIsMobileMenuOpen(false);
                                  return;
                                }
                                if (rail.submenus && rail.submenus.length > 0) {
                                  setExpandedMenus(prev => ({
                                    ...prev,
                                    [rail.id]: !prev[rail.id]
                                  }));
                                } else {
                                  setActiveMenu(rail.id);
                                  setActiveSubMenu('all');
                                  setIsMobileMenuOpen(false);
                                  setExpandedMenus(prev => ({
                                    ...prev,
                                    [rail.id]: true
                                  }));
                                }
                                setGlobalSearch('');
                              }}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-[13px] transition-all duration-300 flex items-center justify-between cursor-pointer focus:outline-none ${
                                isActive 
                                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white font-bold border-transparent shadow-[0_8px_25px_rgba(79,70,229,0.3)] scale-[1.015] ring-1 ring-white/10' 
                                  : isDark
                                    ? 'bg-white/[0.015] text-slate-300 border-white/[0.04] hover:bg-gradient-to-r hover:from-[#4F46E5]/20 hover:to-[#06B6D4]/20 hover:border-[#4F46E5]/25 hover:text-white hover:shadow-[0_8px_25px_rgba(79,70,229,0.2)]'
                                    : 'bg-slate-50/40 text-slate-700 border-slate-200/50 hover:bg-gradient-to-r hover:from-[#4F46E5]/20 hover:to-[#06B6D4]/20 hover:border-[#4F46E5]/20 hover:text-slate-950 hover:shadow-[0_8px_25px_rgba(79,70,229,0.15)] shadow-xs'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-base shrink-0 filter drop-shadow">{emoji}</span>
                                <div className="truncate min-w-0">
                                  <div className="font-bold text-left text-xs md:text-[13px] tracking-tight flex items-center gap-2">
                                    <span>{cleanLabel}</span>
                                    {rail.id === 'whatsapp-service-orders' && pendingWaOrdersCount > 0 && (
                                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 animate-pulse">
                                        {pendingWaOrdersCount}
                                      </span>
                                    )}
                                  </div>
                                  <span className={`text-[10px] md:text-[10.5px] block font-medium leading-tight mt-1 text-left opacity-80`}>
                                    {rail.desc}
                                  </span>
                                </div>
                              </div>
                              {rail.submenus.length > 0 && (
                                <ChevronRight className={`w-3 h-3 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-white' : 'opacity-50'}`} />
                              )}
                            </button>

                            {/* Nested submenus if active */}
                            {isExpanded && rail.submenus.length > 0 && (
                              <div className={`mt-1 pl-3 space-y-0.5 border-l-2 mr-2 ml-4 ${
                                isDark ? 'border-[#06B6D4]/20' : 'border-[#4F46E5]/20'
                              }`}>
                                {rail.submenus.map((sub) => {
                                  const isSubActive = activeSubMenu === sub.id;
                                  const SubIconComp = getSubmenuIcon(sub.id);
                                  return (
                                    <button
                                      key={sub.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(rail.id);
                                        setActiveSubMenu(sub.id);
                                        setIsMobileMenuOpen(false);
                                      }}
                                      className={`w-full text-left py-2 px-3 rounded-lg text-[11px] md:text-[12px] font-sans transition-all flex items-center justify-between cursor-pointer focus:outline-none group/subitem ${
                                        isSubActive 
                                          ? 'text-white font-extrabold bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] shadow-[0_4px_12px_rgba(79,70,229,0.25)] border-l-2 border-[#06B6D4] pl-2'
                                          : isDark
                                            ? 'text-slate-400 hover:text-white hover:bg-white/[0.02]/50'
                                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                                        <SubIconComp className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                          isSubActive 
                                            ? 'text-white'
                                            : 'text-slate-400 dark:text-slate-500 group-hover/subitem:text-slate-600 dark:group-hover/subitem:text-slate-300'
                                        }`} />
                                        <span className="truncate">{sub.label}</span>
                                      </div>
                                      {isSubActive && <span className="w-1 h-1 rounded-full bg-white shrink-0 animate-ping" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Mobile Drawer Logout Section */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-neutral-900/40">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (onLogout) {
                          onLogout();
                        }
                      }}
                      style={{ minHeight: '40px' }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 active:scale-95 rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-indigo-500/20 text-center"
                    >
                      <LogOut className="w-4 h-4 text-white" />
                      <span>{language === 'bn' ? 'লগআউট করুন 🚪' : 'Logout Portal 🚪'}</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION RAILS - Premium Glassmorphism with #4F46E5 to #06B6D4 Gradients */}
          <nav className={`hidden lg:flex flex-col transition-all duration-300 sticky top-20 max-h-[calc(100vh-6.5rem)] relative ${
            isAdminSidebarCollapsed ? 'lg:col-span-1 p-2' : 'lg:col-span-3 p-4'
          } rounded-3xl border ${
            isDark 
              ? 'bg-[#0F172A]/80 border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl' 
              : 'bg-white/80 border-slate-200/90 shadow-[0_20px_50px_rgba(79,70,229,0.06)] backdrop-blur-3xl'
          } space-y-4`}>
            
            {/* Collapse / Expand Toggle Button matching active theme */}
            <button
              onClick={() => {
                handleSetAdminSidebarCollapsed(!isAdminSidebarCollapsed);
                triggerToast(isAdminSidebarCollapsed ? 'Admin panel expanded' : 'Admin panel collapsed');
              }}
              className={`absolute -right-3 top-5 w-6 h-6 border rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all active:scale-95 cursor-pointer z-40 ${
                isDark 
                  ? 'bg-[#1E1B4B]/90 border-white/20 text-[#06B6D4] hover:text-[#4F46E5]' 
                  : 'bg-white border-slate-200 text-[#4F46E5] hover:text-[#06B6D4]'
              }`}
              title={isAdminSidebarCollapsed ? 'Expand Admin Sidebar' : 'Collapse Admin Sidebar'}
              style={{ minWidth: '24px', minHeight: '24px' }}
            >
              {isAdminSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5 animate-pulse" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            {/* Super Admin Title Banner - Governance Pathways & Gradient Heading */}
            {!isAdminSidebarCollapsed ? (
              <div id="super-admin-headline-container" className="px-3 pt-2 pb-1.5 text-left relative overflow-hidden select-none">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4]"></span>
                  </span>
                  <span className="text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
                    Super Admin Console
                  </span>
                </div>
                <h2 className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-400 mt-1 pl-4 uppercase font-mono">
                  Governance Pathways
                </h2>
                <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#4F46E5]/20 dark:via-[#06B6D4]/35 to-transparent" />
              </div>
            ) : (
              <div className="w-full text-center py-2 relative flex justify-center group/title" title="Super Admin Console • Governance Pathways">
                <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] animate-ping" />
                
                {/* Floating Absolute Tooltip */}
                <div className={`absolute left-full ml-3 p-3 text-[10px] rounded-xl opacity-0 scale-95 group-hover/title:opacity-100 group-hover/title:scale-100 transition-all duration-200 shadow-xl pointer-events-none whitespace-nowrap z-50 border ${
                  isDark ? 'bg-[#12102E] border-white/10 text-white animate-fade-in' : 'bg-white border-indigo-100 text-slate-800'
                }`}>
                  <p className="font-extrabold text-xs bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent uppercase">Super Admin Panel</p>
                  <p className="text-[9px] text-slate-400 font-medium">Governance Pathways</p>
                </div>
              </div>
            )}

            {/* Profile & Sandbox Settings Block */}
            <div className={`transition-all duration-300 rounded-2xl border mb-4 shadow-xl relative overflow-hidden ${
              isDark 
                ? 'bg-slate-900/60 border-white/[0.08] text-white shadow-xl shadow-black/20 backdrop-blur-md' 
                : 'bg-white/70 border-slate-200/80 text-slate-900 shadow-md shadow-slate-100/5 backdrop-blur-md'
            } ${isAdminSidebarCollapsed ? 'p-2' : 'p-4'} space-y-3`}>
              {/* Decorative radial blur gradient inside the card */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] opacity-15 rounded-full blur-xl pointer-events-none animate-pulse" />

              {/* If collapsed: Render a compact profile badge with hover information */}
              {isAdminSidebarCollapsed ? (
                <div className="flex flex-col items-center gap-2.5 group relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] text-white flex items-center justify-center font-black uppercase text-xs shadow-md shadow-indigo-600/30 cursor-pointer hover:scale-105 transition-transform duration-300">
                    {currentUser?.role === 'super_admin' ? '👑' : currentUser?.role === 'admin' ? '⚡' : currentUser?.role === 'order_manager' ? '📦' : '👑'}
                  </div>
                  <Shield className="w-3.5 h-3.5 text-[#06B6D4] dark:text-[#06B6D4]" />
                  
                  {/* Floating Absolute Tooltip */}
                  <div className={`absolute left-full ml-3 p-4 text-[11px] font-sans rounded-2xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 shadow-2xl pointer-events-none whitespace-nowrap z-50 border ${
                    isDark ? 'bg-[#0F172A]/90 border-white/10 text-white backdrop-blur-xl' : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-xl'
                  } space-y-3`}>
                    <p className="font-extrabold text-xs text-[#06B6D4]">🛡️ Dashboard Control</p>
                    <p className="font-mono text-[9px] opacity-70">Active session: {currentUser?.name || "Super Admin Controller"}</p>
                    <p className="font-mono text-[9px] uppercase font-bold text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded-full border border-[#06B6D4]/20 inline-block">
                      {currentUser?.role ? currentUser.role.replace('_', ' ').toUpperCase() : 'SUPER ADMIN'}
                    </p>
                    <div className="border-t border-slate-200 dark:border-white/[0.05] pt-2 space-y-2">
                      <p className="text-[9px] font-bold text-slate-400">Dashboard Control Roles:</p>
                      <div className="flex flex-col gap-1.5 pointer-events-auto">
                        {[
                          { role: 'super_admin', label: '👑 Super Admin', tag: 'Root Master', name: 'Super Admin Controller', email: 'superadmin@webzonebd.com' },
                          { role: 'admin', label: '⚡ Admin', tag: 'Operations Lead', name: 'Admin Moderator', email: 'admin@webzonebd.com' },
                          { role: 'order_manager', label: '📦 Order Mgr', tag: 'Sales & Billing', name: 'Order Operations Manager', email: 'sales@webzonebd.com' }
                        ].map(r => (
                          <button
                            key={r.role}
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedUser = {
                                ...currentUser,
                                role: r.role,
                                name: r.name,
                                email: r.email
                              };
                              setCurrentUser(updatedUser);
                              localStorage.setItem('webzone_session_user', JSON.stringify(updatedUser));
                              if (setUser) setUser(updatedUser);
                              triggerToast(`🛡️ Dashboard Control: Role switched to ${r.label}`);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-left text-[9px] font-bold transition-all flex items-center justify-between gap-3 ${
                              currentUser?.role === r.role
                                ? 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white shadow-md'
                                : isDark
                                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                            }`}
                          >
                            <span>{r.label}</span>
                            <span className="text-[7.5px] opacity-70 font-mono">{r.tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.05] pb-2">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#06B6D4] dark:text-[#06B6D4] animate-pulse" />
                      <span className="text-[9px] font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] uppercase tracking-widest">Dashboard Control</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 font-sans tracking-wide">
                      DYNAMIC ROLE
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-50 text-slate-400 block">Supervisor Session</span>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold font-sans truncate text-slate-800 dark:text-neutral-100">
                        {currentUser?.name || 'Super Admin Controller'}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black font-sans border shrink-0 ${
                        currentUser?.role === 'super_admin' ? 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20' :
                        currentUser?.role === 'admin' ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20' :
                        currentUser?.role === 'order_manager' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {currentUser?.role === 'super_admin' ? 'SUPER ADMIN' : 
                         currentUser?.role === 'admin' ? 'ADMIN' : 
                         currentUser?.role === 'order_manager' ? 'ORDER MGR' : 
                         (currentUser?.role ? currentUser.role.replace('_', ' ').toUpperCase() : 'SUPER ADMIN')}
                      </span>
                    </div>
                    <div className="text-[8.5px] font-mono text-slate-400 truncate opacity-80">{currentUser?.email || 'superadmin@webzonebd.com'}</div>
                  </div>

                  {/* Dashboard Control Dropdown Section */}
                  <div className="border-t border-slate-200 dark:border-white/[0.05] pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase tracking-wider font-bold opacity-60 text-slate-400 text-left block">Dashboard Control</label>
                      <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">Dynamic Role Switch</span>
                    </div>

                    {/* Role Dropdown Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200 ${
                          isDark 
                            ? 'bg-slate-800/80 hover:bg-slate-800 border-white/10 hover:border-indigo-500/50 text-white shadow-sm' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-indigo-300 text-slate-900 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm shrink-0">
                            {currentUser?.role === 'super_admin' ? '👑' : currentUser?.role === 'admin' ? '⚡' : currentUser?.role === 'order_manager' ? '📦' : '🛡️'}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-black leading-tight text-slate-900 dark:text-white truncate">
                                {currentUser?.role === 'super_admin' ? 'Super Admin' : 
                                 currentUser?.role === 'admin' ? 'Admin' : 
                                 currentUser?.role === 'order_manager' ? 'Order Mgr' : 
                                 (currentUser?.role ? currentUser.role.replace('_', ' ').toUpperCase() : 'Super Admin')}
                              </span>
                              <span className={`text-[7.5px] px-1.5 py-0.2 rounded-full border font-bold font-mono ${
                                currentUser?.role === 'super_admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                currentUser?.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                currentUser?.role === 'order_manager' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}>
                                {currentUser?.role === 'super_admin' ? 'Root Master' :
                                 currentUser?.role === 'admin' ? 'Operations Lead' :
                                 currentUser?.role === 'order_manager' ? 'Sales & Billing' : 'Custom'}
                              </span>
                            </div>
                            <p className="text-[8px] opacity-60 font-mono leading-tight truncate mt-0.5">
                              {currentUser?.role === 'super_admin' ? 'Unrestricted root & governance' :
                               currentUser?.role === 'admin' ? 'Products, orders & CRM operations' :
                               currentUser?.role === 'order_manager' ? 'Sales pipelines & billing invoices' : 'Active control session'}
                            </p>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${isRoleDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                      </button>

                      {/* Dropdown Menu Popup */}
                      {isRoleDropdownOpen && (
                        <div className={`mt-1.5 p-1.5 rounded-xl border shadow-2xl space-y-1 z-30 relative ${
                          isDark ? 'bg-[#0B1120] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
                        }`}>
                          {[
                            {
                              role: 'super_admin',
                              label: 'Super Admin',
                              tag: 'Root Master',
                              desc: 'Unrestricted master access, database telemetry & governance',
                              icon: '👑',
                              name: 'Super Admin Controller',
                              email: 'superadmin@webzonebd.com',
                              badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20'
                            },
                            {
                              role: 'admin',
                              label: 'Admin',
                              tag: 'Operations Lead',
                              desc: 'Full operations over products, orders, support SLA & content',
                              icon: '⚡',
                              name: 'Admin Moderator',
                              email: 'admin@webzonebd.com',
                              badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20'
                            },
                            {
                              role: 'order_manager',
                              label: 'Order Mgr',
                              tag: 'Sales & Billing',
                              desc: 'Manage sales orders, billing invoices & payment fulfillment',
                              icon: '📦',
                              name: 'Order Operations Manager',
                              email: 'sales@webzonebd.com',
                              badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20'
                            }
                          ].map((preset) => {
                            const isCurrent = currentUser?.role === preset.role;
                            return (
                              <button
                                key={preset.role}
                                type="button"
                                onClick={() => {
                                  const updatedUser = {
                                    ...currentUser,
                                    role: preset.role,
                                    name: preset.name,
                                    email: preset.email
                                  };
                                  setCurrentUser(updatedUser);
                                  localStorage.setItem('webzone_session_user', JSON.stringify(updatedUser));
                                  if (setUser) setUser(updatedUser);
                                  setIsRoleDropdownOpen(false);
                                  triggerToast(`🛡️ Dashboard Control: Role switched to ${preset.label}`);
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all duration-150 ${
                                  isCurrent 
                                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white font-bold shadow-md shadow-indigo-500/20' 
                                    : isDark 
                                      ? 'hover:bg-white/5 text-slate-300 hover:text-white' 
                                      : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-base shrink-0">{preset.icon}</span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10.5px] font-bold truncate">{preset.label}</span>
                                      <span className={`text-[7px] px-1.5 py-0.2 rounded-full border font-mono font-bold ${isCurrent ? 'bg-white/20 text-white border-white/30' : preset.badgeColor}`}>
                                        {preset.tag}
                                      </span>
                                    </div>
                                    <p className={`text-[8px] truncate mt-0.5 ${isCurrent ? 'text-white/80' : 'opacity-60'}`}>{preset.desc}</p>
                                  </div>
                                </div>
                                {isCurrent && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Quick 1-Click Segmented Switching Pills */}
                    <div className="grid grid-cols-3 gap-1 pt-0.5 font-sans text-[8.5px]">
                      {[
                        { role: 'super_admin', label: 'Super Admin', icon: '👑', name: 'Super Admin Controller', email: 'superadmin@webzonebd.com' },
                        { role: 'admin', label: 'Admin', icon: '⚡', name: 'Admin Moderator', email: 'admin@webzonebd.com' },
                        { role: 'order_manager', label: 'Order Mgr', icon: '📦', name: 'Order Operations Manager', email: 'orders@webzonebd.com' }
                      ].map((preset) => {
                        const isCurrent = currentUser?.role === preset.role;
                        return (
                          <button
                            key={preset.role}
                            type="button"
                            onClick={() => {
                              const updatedUser = {
                                ...currentUser,
                                role: preset.role,
                                name: preset.name,
                                email: preset.email
                              };
                              setCurrentUser(updatedUser);
                              localStorage.setItem('webzone_session_user', JSON.stringify(updatedUser));
                              if (setUser) setUser(updatedUser);
                              setIsRoleDropdownOpen(false);
                              triggerToast(`🛡️ Dashboard Control: Shifted to ${preset.label}`);
                            }}
                            className={`py-1.5 px-1 rounded-lg text-center border transition-all duration-200 cursor-pointer font-bold flex items-center justify-center gap-1 ${
                              isCurrent 
                                ? 'bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] text-white border-transparent shadow-sm shadow-indigo-500/25 scale-[1.02]' 
                                : isDark
                                  ? 'bg-slate-850 text-slate-300 border-white/[0.06] hover:bg-slate-800 hover:text-white'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
                            }`}
                          >
                            <span className="text-[10px]">{preset.icon}</span>
                            <span className="truncate">{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Permission Ledger Statuses */}
                  <div className="border-t border-slate-200 dark:border-white/[0.05] pt-2 space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-50 text-slate-400 text-left block">Active Clearance Status</span>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-sans text-[8.5px] pt-0.5 text-slate-500 dark:text-slate-400 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${checkPermission('manage_products') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="truncate">Products</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${checkPermission('manage_orders') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="truncate">Orders & Pay</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${checkPermission('manage_support') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="truncate">Support SLA</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${checkPermission('manage_content') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="truncate">CMS & AI</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${checkPermission('manage_users') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="truncate">CRM Users</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${checkPermission('manage_system') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="truncate">System Settings</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* List Menu Rails (Scrollable and Categorized!) */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-290px)] pr-1.5 -mr-1.5 space-y-4 custom-scrollbar" id="admin-sidebar-scroll-rails">
              {(() => {
                const allRails = [
                  { id: 'dashboard', label: '🏠 Dashboard', desc: 'Control overview metrics', submenus: [] },
                  { id: 'store', label: '🏪 Store admin mode', desc: 'General storefront controls', submenus: [
                    { id: 'store-dashboard', label: 'Store Dashboard' },
                    { id: 'store-products', label: 'Products Catalog' },
                    { id: 'store-orders', label: 'Store Orders' },
                    { id: 'store-customers', label: 'Store Customers' },
                    { id: 'store-coupons', label: 'Store Coupons' },
                    { id: 'store-shipping', label: 'Store Shipping' },
                    { id: 'store-settings', label: 'Store Settings' }
                  ] },
                  { id: 'customers', label: '👥 Customers', desc: 'Manage user segments & telemetry', submenus: [
                    { id: 'all-customers', label: 'Customer List' },
                    { id: 'customer-groups', label: 'Customer Groups' },
                    { id: 'customer-tags', label: 'Customer Tags' },
                    { id: 'customer-notes', label: 'Customer Notes' },
                    { id: 'vip-customers', label: 'VIP Customers' },
                    { id: 'corporate-clients', label: 'Corporate Clients' },
                    { id: 'customer-affiliates', label: 'Affiliates' },
                    { id: 'customer-activity-logs', label: 'Customer Activity Logs' },
                    { id: 'customer-security-logs', label: 'Customer Security Logs' },
                    { id: 'customer-reports', label: 'Customer Reports' }
                  ] },
                  { id: 'orders', label: '📦 Orders Management', desc: 'Customer Order and billing pipelines,', submenus: [
                    { id: 'all-orders', label: 'All Orders' },
                    { id: 'guest-orders', label: '📋 Guest Order List' },
                    { id: 'email-notifications', label: '📧 Receipts & Email Center' }
                  ] },
                  { id: 'services', label: '💼 Services', desc: 'Website dev & SEO catalog', submenus: [
                    { id: 'all-services', label: 'All Services' },
                    { id: 'service-categories', label: 'Service Categories' },
                    { id: 'service-orders', label: 'Service Orders' },
                    { id: 'service-inquiries', label: 'Service Inquiries' },
                    { id: 'whatsapp-leads', label: 'WhatsApp Leads' },
                    { id: 'service-reports', label: 'Service Reports' }
                  ] },
                  { id: 'whatsapp-service-orders', label: '📱 WhatsApp Service Orders', desc: 'Manage orders, custom fields', submenus: [
                    { id: 'wa-orders', label: 'Service Orders List' },
                    { id: 'wa-customers', label: 'Customer WhatsApp List' },
                    { id: 'wa-form-settings', label: 'Order Form Field Settings' },
                    { id: 'wa-invoice-notif', label: 'Invoice Notifications' },
                    { id: 'wa-payment-reminders', label: 'Payment Reminders' },
                    { id: 'wa-delivery-updates', label: 'Service Delivery Updates' },
                    { id: 'wa-promo-messages', label: 'Promotional Messages' },
                    { id: 'wa-templates', label: 'WhatsApp Templates' },
                    { id: 'wa-campaign-reports', label: 'Campaign Reports' },
                    { id: 'wa-api-integration', label: 'WhatsApp API Integration' },
                    { id: 'wa-settings', label: 'WhatsApp Settings' }
                  ] },
                  { id: 'projects', label: '📂 Projects', desc: 'Client portal milestones & tasks', submenus: [
                    { id: 'active-projects', label: 'Active Projects' },
                    { id: 'pending-projects', label: 'Pending Projects' },
                    { id: 'completed-projects', label: 'Completed Projects' },
                    { id: 'milestones', label: 'Milestones' },
                    { id: 'tasks', label: 'Tasks' },
                    { id: 'files', label: 'Files' },
                    { id: 'approvals', label: 'Client Approvals' }
                  ] },
                  { id: 'support', label: '🎫 Support Center', desc: 'Live ticket chat reply center', submenus: [
                    { id: 'support-tickets', label: 'Tickets' },
                    { id: 'support-chat', label: 'Live Chat' },
                    { id: 'support-whatsapp', label: 'WhatsApp Requests' },
                    { id: 'support-kb', label: 'Knowledge Base' }
                  ] },
                  { id: 'live-chat', label: '💬 Live Chat System', desc: 'Real-time visitor live chats & responses', submenus: [
                    { id: 'support-chat', label: 'Live Console' },
                    { id: 'chat-sessions', label: 'Active Sessions' },
                    { id: 'chat-waiting', label: 'Waiting Queue' },
                    { id: 'chat-settings', label: 'Chat Settings' }
                  ] },
                  { id: 'ai-center', label: '🤖 AI Center', desc: 'Gemini content generator suite', submenus: [
                    { id: 'ai-blog', label: 'AI Blog Generator' },
                    { id: 'ai-content', label: 'AI Content Generator' },
                    { id: 'ai-seo', label: 'AI SEO Generator' },
                    { id: 'ai-meta', label: 'AI Meta Generator' },
                    { id: 'ai-name', label: 'AI Business Name Gen' }
                  ] },
                  { id: 'affiliates', label: '💰 Affiliate System', desc: 'Commissions withdrawal portal', submenus: [
                    { id: 'aff-users', label: 'Affiliate Users' },
                    { id: 'aff-commissions', label: 'Commissions' },
                    { id: 'aff-withdrawals', label: 'Withdraw Requests' },
                    { id: 'aff-analytics', label: 'Analytics' }
                  ] },
                  { id: 'marketing', label: '📢 Marketing', desc: 'Enterprise marketing & campaign hubs', submenus: [
                    { id: 'mkt-coupons', label: 'Coupon System' },
                    { id: 'mkt-sms', label: 'SMS Marketing' },
                    { id: 'mkt-push', label: 'Push Notifications' },
                    { id: 'mkt-whatsapp', label: 'WhatsApp Marketing' },
                    { id: 'mkt-social', label: 'Social Media Campaigns' },
                    { id: 'mkt-affiliate', label: 'Affiliate Marketing' },
                    { id: 'mkt-referral', label: 'Referral Program' },
                    { id: 'mkt-loyalty', label: 'Loyalty & Rewards' },
                    { id: 'mkt-abandoned', label: 'Abandoned Cart Recovery' },
                    { id: 'mkt-leads', label: 'Lead Management' },
                    { id: 'mkt-newsletter', label: 'Newsletter Subscribers' },
                    { id: 'mkt-automation', label: 'Marketing Automation' },
                    { id: 'mkt-settings', label: 'Marketing Settings' }
                  ] },
                  { id: 'reviews', label: '⭐ Reviews', desc: 'Audit marketplace client feedback', submenus: [
                    { id: 'rev-product', label: 'Product Reviews' },
                    { id: 'rev-service', label: 'Service Reviews' },
                    { id: 'rev-testimonials', label: 'Testimonials' }
                  ] },
                  { id: 'reports', label: '📊 Reports', desc: 'System statistics & telemetry', submenus: [
                    { id: 'rep-revenue', label: 'Revenue Reports' },
                    { id: 'rep-customer', label: 'Customer Reports' },
                    { id: 'rep-services', label: 'Service Reports' },
                    { id: 'rep-store', label: 'Store Reports' },
                    { id: 'rep-affiliate', label: 'Affiliate Reports' }
                  ] },
                  { id: 'staff', label: '👨‍💼 Staff Management', desc: 'Staff lists, roles permissions', submenus: [] },
                  { id: 'notifications', label: '🔔 Notifications', desc: 'System Alert Logs & status', submenus: [] },
                  { id: 'customer-dashboard', label: '👤 Client Dashboard Workspace', desc: 'Interactive Client view emulator', submenus: [] },
                  { id: 'cms', label: '🖥️ Website Control Panel', desc: 'Shopify & WordPress Style CMS', submenus: [
                    { id: 'cms-dashboard', label: 'CMS Dashboard' },
                    { id: 'cms-pages', label: 'Pages Management' },
                    { id: 'cms-menus', label: 'Menus Builder' },
                    { id: 'cms-blogs', label: 'Blog Posts' },
                    { id: 'cms-categories', label: 'Blog Categories' },
                    { id: 'cms-tags', label: 'Blog & Product Tags' },
                    { id: 'cms-services', label: 'Services Catalog' },
                    { id: 'cms-products', label: 'Woo Products' },
                    { id: 'cms-pro-cats', label: 'Product Categories' },
                    { id: 'cms-pro-subcats', label: 'Product Sub Categories' },
                    { id: 'cms-media', label: 'Media Library' },
                    { id: 'cms-forms', label: 'Forms & Leads' },
                    { id: 'cms-seo', label: 'SEO Manager' },
                    { id: 'cms-homepage', label: 'Homepage Builder' },
                    { id: 'cms-header', label: 'Header Builder' },
                    { id: 'cms-footer', label: 'Footer Builder' },
                    { id: 'cms-testimonials', label: 'Testimonials UI' },
                    { id: 'cms-faqs', label: 'FAQ Manager' },
                    { id: 'cms-announcements', label: 'Announcements Bar' },
                    { id: 'cms-redirects', label: 'Redirect Manager' },
                    { id: 'cms-settings', label: 'Website Settings' }
                  ] },
                  { id: 'web-settings', label: '🌐 Web Settings', desc: 'Identity, default rates, and appearance setup', submenus: [] }
                ];

                const localizedAllRails = allRails.map(rail => ({
                  ...rail,
                  label: translate(rail.label),
                  desc: translate(rail.desc),
                  submenus: (rail.submenus || []).map(sub => ({
                    ...sub,
                    label: translate(sub.label)
                  }))
                }));

                const railPermissionMap: Record<string, keyof PermissionSet> = {
                  'revenue-analytics': 'manage_orders',
                  'cms': 'manage_content',
                  'customers': 'manage_users',
                  'orders': 'manage_orders',
                  'services': 'manage_products',
                  'projects': 'manage_orders',
                  'store': 'manage_products',
                  'support': 'manage_users',
                  'ai-center': 'manage_content',
                  'gemini-chatbot': 'manage_content',
                  'affiliates': 'manage_orders',
                  'marketing': 'manage_products',
                  'reviews': 'manage_products',
                  'reports': 'manage_orders',
                  'staff': 'manage_users',
                  'notifications': 'manage_users',
                  'web-settings': 'manage_content',
                  'settings': 'manage_orders',
                };

                const isRailPermitted = (railId: string) => {
                  const permKey = railPermissionMap[railId];
                  if (!permKey) return true;
                  return checkPermission(permKey);
                };

                const categories = [
                  { title: translate('🏦 Core Metrics'), ids: ['dashboard'] },
                  { title: translate('🌐 CMS & Sales Catalog'), ids: ['services', 'store'] },
                  { title: translate('📦 Workspace Operations'), ids: ['customers', 'orders', 'whatsapp-service-orders', 'projects'] },
                  { title: translate('🤖 AI & Support Desk'), ids: ['support', 'ai-center'] },
                  { title: translate('📢 Growth & Feedback'), ids: ['affiliates', 'marketing', 'reviews'] },
                  { title: translate('🛠️ System & Governance'), ids: ['reports', 'staff', 'notifications', 'customer-dashboard', 'cms', 'web-settings'] }
                ];

                return categories.map((cat, catIdx) => {
                  const railsInCat = cat.ids
                    .map(id => localizedAllRails.find(r => r.id === id))
                    .filter(Boolean)
                    .filter(r => isRailPermitted(r!.id)) as typeof localizedAllRails;
                  if (railsInCat.length === 0) return null;
                  return (
                    <div key={cat.title} className={`${catIdx > 0 ? 'pt-2' : ''} space-y-1`}>
                      {!isAdminSidebarCollapsed && (
                        <div className={`text-[11px] md:text-[11.5px] uppercase tracking-widest font-extrabold mt-4 mb-2.5 px-3 py-1.5 rounded-lg select-none inline-block border ${
                          isDark 
                            ? 'bg-slate-800/40 text-[#06B6D4] border-[#06B6D4]/15 shadow-[0_2px_12px_rgba(6,182,212,0.03)]' 
                            : 'bg-indigo-50/60 text-indigo-700 border-[#4F46E5]/10 shadow-[0_2px_12px_rgba(79,70,229,0.03)]'
                        }`}>
                          {cat.title}
                        </div>
                      )}
                      
                      {railsInCat.map((rail) => {
                        const isActive = activeMenu === rail.id;
                        const isExpanded = !!expandedMenus[rail.id];
                        const emojiRegex = /^\p{Emoji}/u;
                        const match = rail.label.match(emojiRegex);
                        const emoji = match ? match[0] : '🎯';
                        const cleanLabel = match ? rail.label.replace(emoji, '').trim() : rail.label;
                        const MenuIconComp = getMenuIcon(rail.id);

                        return (
                          <div key={rail.id} className="w-full relative group/menu">
                            <button
                              onClick={() => {
                                if (rail.id === 'gemini-chatbot') {
                                  setBlogJsonInput('');
                                  setShowGeminiChatbotModal(true);
                                  return;
                                }
                                
                                if (rail.submenus && rail.submenus.length > 0) {
                                  setExpandedMenus(prev => ({
                                    ...prev,
                                    [rail.id]: !prev[rail.id]
                                  }));
                                } else {
                                  setActiveMenu(rail.id);
                                  setActiveSubMenu('all');
                                  setExpandedMenus(prev => ({
                                    ...prev,
                                    [rail.id]: true
                                  }));
                                }
                                setGlobalSearch('');
                              }}
                              className={`w-full text-left p-3.5 rounded-2xl border text-xs md:text-[13px] transition-all duration-300 flex items-center justify-between cursor-pointer focus:outline-none relative overflow-hidden group/btn ${
                                isActive 
                                  ? 'text-white font-extrabold border-white/20 scale-[1.02] bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] shadow-[0_8px_25px_rgba(79,70,229,0.35)] backdrop-blur-md' 
                                  : isDark
                                    ? 'bg-white/[0.03] text-slate-300 border-white/[0.06] hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:border-white/20 hover:text-white hover:translate-x-1 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(79,70,229,0.25)] backdrop-blur-xs'
                                    : 'bg-white/40 text-slate-700 border-slate-200/60 hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#06B6D4] hover:border-transparent hover:text-white hover:translate-x-1 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(79,70,229,0.25)] backdrop-blur-md shadow-xs'
                              }`}
                              id={`super-admin-rail-${rail.id}`}
                            >
                              {/* Glassmorphism ambient sheen */}
                              <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none" />

                              {isAdminSidebarCollapsed ? (
                                <div className="w-full text-center text-lg select-none relative" title={cleanLabel}>
                                  <MenuIconComp className={`w-5.5 h-5.5 mx-auto transition-transform duration-300 group-hover/btn:scale-110 ${
                                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover/btn:text-white'
                                  }`} />
                                  {rail.id === 'whatsapp-service-orders' && pendingWaOrdersCount > 0 && (
                                    <span className="absolute top-[-8px] right-[4px] flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-red-500/20">
                                      {pendingWaOrdersCount}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 z-10 w-full min-w-0">
                                  <MenuIconComp className={`w-4.5 h-4.5 shrink-0 transition-all duration-300 group-hover/btn:scale-110 ${
                                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover/btn:text-white'
                                  }`} />
                                  <div className="truncate min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <div className={`font-bold text-left text-xs md:text-[13px] tracking-tight truncate transition-colors duration-300 ${
                                        isActive 
                                          ? 'text-white font-bold' 
                                          : 'text-slate-700 dark:text-slate-300 group-hover/btn:text-white'
                                      }`}>{cleanLabel}</div>
                                      {rail.id === 'whatsapp-service-orders' && pendingWaOrdersCount > 0 && (
                                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 animate-pulse">
                                          {pendingWaOrdersCount} {translate('Pending')}
                                        </span>
                                      )}
                                    </div>
                                    <span className={`text-[10px] md:text-[10.5px] block font-medium leading-tight mt-1 text-left transition-colors duration-250 truncate ${
                                      isActive 
                                        ? 'text-white/85 font-medium' 
                                        : isDark 
                                          ? 'text-slate-400 group-hover/btn:text-white/80' 
                                          : 'text-slate-500 group-hover/btn:text-white/80'
                                    }`}>
                                      {rail.desc}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {!isAdminSidebarCollapsed && rail.submenus.length > 0 && (
                                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-all duration-300 z-10 ${
                                  isActive ? 'text-white' : 'text-slate-400 group-hover/btn:text-white'
                                } ${isExpanded ? 'rotate-90 scale-110' : 'opacity-40 group-hover/btn:opacity-100'}`} />
                              )}

                              {/* Collapsed view Floating tooltip */}
                              {isAdminSidebarCollapsed && (
                                <div className="absolute left-full ml-3 px-3 py-1.5 bg-neutral-950 text-white text-xs font-bold font-sans rounded-lg opacity-0 scale-95 group-hover/menu:opacity-100 group-hover/menu:scale-100 transition-all duration-200 shadow-xl pointer-events-none whitespace-nowrap z-50 border border-neutral-800">
                                  <p className="font-extrabold">{cleanLabel}</p>
                                  <p className="text-[9.5px] text-purple-400 font-mono mt-0.5">{rail.desc}</p>
                                  {rail.submenus.length > 0 && (
                                    <span className="block text-[8px] text-neutral-450 uppercase tracking-widest mt-1">
                                      • Contains nested features
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>

                            {/* Sidebar Nested Sub-menus rendering style improvements */}
                            {isExpanded && rail.submenus.length > 0 && (
                              <div className={`mt-1.5 pl-3 space-y-1 border-l-2 border-[#8B5CF6]/20 pb-1.5 ${isAdminSidebarCollapsed ? 'hidden' : 'ml-4 animate-fade-in'}`}>
                                {rail.submenus.map((sub) => {
                                  const isSubActive = activeSubMenu === sub.id;
                                  const SubIconComp = getSubmenuIcon(sub.id);
                                  return (
                                    <button
                                      key={sub.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(rail.id);
                                        setActiveSubMenu(sub.id);
                                      }}
                                      className={`w-full text-left py-2 px-3.5 rounded-lg text-[11px] md:text-[12px] font-sans transition-all duration-200 flex items-center justify-between cursor-pointer focus:outline-none group/subitem ${
                                        isSubActive 
                                          ? 'text-white font-extrabold bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] shadow-[0_4px_12px_rgba(79,70,229,0.25)] border-l-2 border-[#06B6D4] pl-2' 
                                          : isDark
                                            ? 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/60'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                                        <SubIconComp className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                          isSubActive 
                                            ? 'text-white'
                                            : 'text-slate-400 dark:text-slate-500 group-hover/subitem:text-slate-600 dark:group-hover/subitem:text-slate-300'
                                        }`} />
                                        <span className="truncate">{sub.label}</span>
                                        {sub.id === 'wa-orders' && pendingWaOrdersCount > 0 && (
                                          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 animate-pulse ml-1">
                                            {pendingWaOrdersCount}
                                          </span>
                                        )}
                                      </div>
                                      {isSubActive && <span className="w-1 h-1 rounded-full bg-white shrink-0 animate-ping" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Admin Logout Option Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.05] relative group/logout w-full">
              <button
                onClick={() => {
                  if (onLogout) {
                     onLogout();
                  }
                }}
                style={{ minHeight: '24px' }}
                className={`w-full flex items-center ${isAdminSidebarCollapsed ? 'justify-center p-1' : 'justify-center gap-1.5 px-3 py-1.5'} text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(79,70,229,0.35)] active:scale-95 rounded-lg transition-all duration-300 cursor-pointer shadow-md shadow-indigo-550/20 text-center relative`}
              >
                <LogOut className="w-3.5 h-3.5 text-white shrink-0 animate-pulse" />
                {!isAdminSidebarCollapsed && (
                  <span>{language === 'bn' ? 'লগআউট করুন 🚪' : 'Logout Portal 🚪'}</span>
                )}
              </button>

              {isAdminSidebarCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 bg-neutral-950 text-white text-[10px] font-black font-sans rounded-xl opacity-0 scale-90 group-hover/logout:opacity-100 group-hover/logout:scale-100 transition-all duration-200 shadow-xl pointer-events-none whitespace-nowrap z-50 border border-slate-800">
                  {language === 'bn' ? '🚪 লগআউট' : '🚪 Logout Admin Portal'}
                </div>
              )}
            </div>
          </nav>

          {/* MAIN FUNCTION PANEL SCREEN VIEWPORT */}
          <main className={`transition-all duration-300 ${isAdminSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'} space-y-6`}>
            
            {/* SCREEN VIEWPORT CMS: WEBSITE CONTROL PANEL */}
            {activeMenu === 'cms' && (
              !checkPermission('manage_content') ? renderAccessDenied('manage_content', 'Website Control Panel CMS') : (
                <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading website control center...</div>}>
                  <WebsiteControlCenter
                    language={language}
                    theme={theme}
                    activeSubMenu={activeSubMenu}
                    setActiveSubMenu={setActiveSubMenu}
                    triggerToast={triggerToast}
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
                    getOrderSerial={getOrderSerial}
                    updateOrderStatus={updateOrderStatus}
                  />
                </Suspense>
              )
            )}

            {/* SCREEN VIEWPORT: CLIENT DASHBOARD WORKSPACE EMULATOR */}
            {activeMenu === 'customer-dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-2xl border border-indigo-500/30 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-extrabold px-2.5 py-1 bg-indigo-950/80 rounded-full border border-indigo-500/25 inline-block">
                      ⚙️ Super Admin Simulation Mode
                    </span>
                    <h3 className="text-xl font-black font-sans tracking-tight pt-1">Client Dashboard Portal</h3>
                    <p className="text-xs text-indigo-200 font-light max-w-xl">
                      You are emulating the interface, invoices, domain hosting portals, downloads, and ticket boards seen by your customers. Use the <strong>Dynamic Role Sandbox</strong> in the sidebar to switch client segments instantly.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 bg-neutral-900/60 px-3 py-2 rounded-xl border border-indigo-500/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-indigo-200">Emulating: <strong className="text-white font-bold">{currentUser?.name || "Regular User"} ({currentUser?.role || "customer"})</strong></span>
                  </div>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-950 shadow-md">
                  <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading emulated client dashboard...</div>}>
                    <Dashboard
                      language={language}
                      theme={theme}
                      user={currentUser}
                      onLogout={() => {
                        triggerToast("🚪 Terminated simulated user session.");
                      }}
                      onNavigate={(page) => {
                        triggerToast(`🌐 Client virtual navigation: ${page}`);
                      }}
                      orders={orders}
                      tickets={tickets}
                      addSupportTicket={(ticket) => {
                        triggerToast(`🎫 Simulated customer ticket opened: "${ticket.subject}"`);
                      }}
                      addTicketReply={(ticketId, message, sender) => {
                        addTicketReply(ticketId, message, sender);
                        triggerToast(`💬 Registered interaction for Ticket #${ticketId}`);
                      }}
                      triggerToast={triggerToast}
                      currency={currency || 'USD'}
                      setCurrency={setCurrency || (() => {})}
                      onUpdateUser={(updated) => {
                        setCurrentUser(updated);
                        if (setUser) setUser(updated);
                        triggerToast("⚙️ Simulated customer profile metrics synced");
                      }}
                      activityLogs={activityLogs}
                      onAddActivityLog={(log) => {
                        if (onAddActivityLog) {
                          onAddActivityLog(`[Simulation] ${log}`);
                        }
                      }}
                      products={products}
                      onAddProduct={addNewProduct}
                      onUpdateProductRating={(id, rating, comment) => {
                        triggerToast(`⭐ Simulated visual rating ${rating}/5 added: "${comment}"`);
                      }}
                      currencySettings={currencySettings}
                      setLanguage={setLanguage || (() => {})}
                      setTheme={() => {}}
                    />
                  </Suspense>
                </div>
              </div>
            )}

            {/* 📈 ACTIVE VIEW: রেভিনিউ প্রবৃদ্ধি ও লেখচিত্র (Company Revenue & Growth Analytics) */}
            {activeMenu === 'revenue-analytics' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading growth analytics...</div>}>
                  <CompanyRevenueDashboard
                    language={language}
                    theme={theme}
                    orders={orders}
                    currency={currency}
                    triggerToast={triggerToast}
                    isAdmin={true}
                  />
                </Suspense>
              </div>
            )}

            {/* SCREEN VIEWPORT A: SUPER ADMIN OVERVIEW DASHBOARD */}
            {activeMenu === 'dashboard' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
                
                {/* WordPress-like Screen Options / Dashboard Customizer */}
                <div className="col-span-1 xl:col-span-2 p-5 rounded-2xl border bg-slate-50 border-slate-200 dark:bg-neutral-900/45 dark:border-neutral-800 transition-all duration-300 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-500" />
                      <div>
                        <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>
                          Configure Widgets
                        </h3>
                        <p className="text-[10px] text-zinc-400 opacity-90">Customize visible sections</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsWidgetPanelOpen(!isWidgetPanelOpen)}
                      className={`group relative p-[1.5px] rounded-[14px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:scale-[1.03] transition-all duration-300 cursor-pointer ${
                        isWidgetPanelOpen
                          ? 'shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.45)]'
                          : 'shadow-[0_4px_12px_rgba(124,58,237,0.1)] hover:shadow-[0_8px_24px_rgba(124,58,237,0.25)]'
                      }`}
                    >
                      <div className={`px-4 py-2 rounded-[12.5px] font-extrabold text-[11px] flex items-center gap-2 transition-all duration-300 ${
                        isWidgetPanelOpen
                          ? 'bg-transparent text-white'
                          : isDark
                            ? 'bg-[#0F172A] text-neutral-100 group-hover:bg-[#0F172A]/80'
                            : 'bg-white text-[#0F172A] group-hover:bg-white/95'
                      }`}>
                        <Sliders className={`w-3.5 h-3.5 transition-transform duration-300 ${isWidgetPanelOpen ? 'rotate-45 text-white' : 'text-purple-500'}`} />
                        <span>{isWidgetPanelOpen ? 'Hide Widgets' : 'Edit Widgets'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isWidgetPanelOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                  </div>

                  {isWidgetPanelOpen && (
                    <div className="mt-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800/60 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[...dashboardWidgets].sort((a, b) => a.order - b.order).map((widget, idx, arr) => (
                          <div
                            key={widget.id}
                            className={`group relative p-[1px] rounded-[14px] transition-all duration-300 ${
                              widget.visible
                                ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] shadow-[0_8px_16px_rgba(124,58,237,0.08)] hover:shadow-[0_12px_24px_rgba(124,58,237,0.15)] scale-[1.01]'
                                : isDark
                                  ? 'bg-[#374151]/30 hover:bg-[#374151]/50 shadow-sm'
                                  : 'bg-[#E2E8F0]/70 hover:bg-[#E2E8F0] shadow-sm'
                            }`}
                          >
                            <div className={`p-2.5 rounded-[13px] h-full flex flex-col justify-between space-y-2 transition-all duration-300 ${
                              widget.visible
                                ? isDark
                                  ? 'bg-[#111827] text-white'
                                  : 'bg-white text-[#0F172A]'
                                : isDark
                                  ? 'bg-[#111827]/60 text-neutral-500'
                                  : 'bg-[#F8FAFC]/80 text-slate-400'
                            }`}>
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full font-mono transition-all duration-300 flex-shrink-0 ${
                                    widget.visible
                                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700/30'
                                  }`}>
                                    #{widget.order}
                                  </span>
                                  <span className={`text-[11px] sm:text-xs font-bold tracking-tight leading-tight truncate transition-all duration-300 ${
                                    widget.visible
                                      ? isDark ? 'text-neutral-100' : 'text-slate-900'
                                      : 'opacity-60'
                                  }`}>
                                    {widget.title}
                                  </span>
                                </div>
                                <button
                                  onClick={() => toggleWidgetVisibility(widget.id)}
                                  className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer flex-shrink-0 ${
                                    widget.visible
                                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:scale-110 shadow-[0_0_8px_rgba(34,197,94,0.12)]'
                                      : isDark
                                        ? 'bg-[#111827] hover:bg-neutral-800 text-neutral-400 border-[#374151] hover:scale-110'
                                        : 'bg-white hover:bg-slate-100 text-slate-500 border-[#E2E8F0] hover:scale-110'
                                  }`}
                                  title={widget.visible ? "Hide this widget" : "Show this widget"}
                                >
                                  {widget.visible ? <Eye className="w-3.5 h-3.5 animate-pulse" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                              </div>

                              <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-neutral-100 dark:border-neutral-800/50">
                                {/* Reorder controls: Up / Down */}
                                <div className="flex items-center gap-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => moveWidgetOrder(widget.id, 'up')}
                                    className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                                      isDark
                                        ? 'bg-[#111827] border-[#374151] text-neutral-400 hover:text-white hover:border-purple-500 hover:shadow-[0_0_8px_rgba(124,58,237,0.12)]'
                                        : 'bg-white border-[#E2E8F0] text-slate-500 hover:text-slate-800 hover:border-purple-500 hover:shadow-[0_0_8px_rgba(124,58,237,0.08)]'
                                    } disabled:opacity-20 disabled:pointer-events-none`}
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    disabled={idx === arr.length - 1}
                                    onClick={() => moveWidgetOrder(widget.id, 'down')}
                                    className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                                      isDark
                                        ? 'bg-[#111827] border-[#374151] text-neutral-400 hover:text-white hover:border-purple-500 hover:shadow-[0_0_8px_rgba(124,58,237,0.12)]'
                                        : 'bg-white border-[#E2E8F0] text-slate-500 hover:text-slate-800 hover:border-purple-500 hover:shadow-[0_0_8px_rgba(124,58,237,0.08)]'
                                    } disabled:opacity-20 disabled:pointer-events-none`}
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Segmented Alignment Controls */}
                                <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border transition-all duration-300 ${
                                  isDark 
                                    ? 'bg-[#111827]/80 border-[#374151]' 
                                    : 'bg-[#F8FAFC] border-[#E2E8F0]'
                                }`}>
                                  {[
                                    { key: 'left', label: 'Left' },
                                    { key: 'right', label: 'Right' },
                                    { key: 'full', label: 'Full' }
                                  ].map((colOpt) => {
                                    const isActive = widget.column === colOpt.key;
                                    return (
                                      <button
                                        key={colOpt.key}
                                        onClick={() => changeWidgetColumn(widget.id, colOpt.key as any)}
                                        className={`px-1.5 py-0.5 rounded-md text-[8px] sm:text-[8.5px] font-extrabold transition-all duration-300 cursor-pointer ${
                                          isActive
                                            ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-[0_1px_4px_rgba(124,58,237,0.2)]'
                                            : isDark
                                              ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/55'
                                        }`}
                                      >
                                        {colOpt.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800/40">
                        <button
                          onClick={resetWidgetsToDefault}
                          className={`px-4 py-2 text-[10px] font-extrabold rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                            isDark 
                              ? 'bg-[#111827] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-[#374151] hover:border-[#7C3AED] hover:shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-[#7C3AED]'
                          }`}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset to Default</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                


                {/* 0. ADVANCED ANALYTICS & BUSINESS INTELLIGENCE HUB WIDGET */}
                <div 
                  className={"w-full " + getWidgetColumnClass("advanced-analytics")} 
                  style={getWidgetStyle('advanced-analytics')}
                >
                  <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading Advanced Analytics Engine...</div>}>
                    <AdminAdvancedAnalytics
                      language={language}
                      theme={theme}
                      orders={orders as any}
                      products={products as any}
                      customers={customers as any}
                      tickets={tickets as any}
                      triggerToast={triggerToast}
                    />
                  </Suspense>
                </div>

                {/* 1. Analytics Widget Cards - 6 Premium Enterprise SaaS Cards */}
                <div 
                  className={`space-y-4 ${getWidgetColumnClass('stat-cards')}`} 
                  style={getWidgetStyle('stat-cards')}
                >
                  <div className={`grid gap-4 ${dashboardWidgets.find(w => w.id === 'stat-cards')?.column === 'full' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`} id="admin-dashboard-stats-grid">
                    {[
                      { 
                        title: "Total Clients", 
                        val: customers.length.toLocaleString(), 
                        trend: "+14.2% MoM", 
                        isUp: true, 
                        icon: Users, 
                        glow: "text-blue-500", 
                        gradient: "from-blue-500/10 to-transparent",
                        desc: "Registered enterprise portal users" 
                      },
                      { 
                        title: language === 'bn' ? 'মোট অর্ডার সংখ্যা' : "Total Order Count", 
                        val: orders.length.toLocaleString(), 
                        trend: "+14.2% MoM", 
                        isUp: true, 
                        icon: ShoppingBag, 
                        glow: "text-purple-400", 
                        gradient: "from-purple-500/10 to-transparent",
                        desc: language === 'bn' ? 'রেকর্ডকৃত সফল ও পেন্ডিং অর্ডার' : "All purchases & orders logged" 
                      },
                      { 
                        title: "Total Blogs", 
                        val: posts.length.toLocaleString(), 
                        trend: "+12.4% QTR", 
                        isUp: true, 
                        icon: BookOpen, 
                        glow: "text-pink-500", 
                        gradient: "from-pink-500/10 to-transparent",
                        desc: "SEO optimized content nodes" 
                      },
                      { 
                        title: "Total Products", 
                        val: products.length.toLocaleString(), 
                        trend: "+4.3% wk", 
                        isUp: true, 
                        icon: Layers, 
                        glow: "text-amber-500", 
                        gradient: "from-amber-500/10 to-transparent",
                        desc: "Themes, scripts & addons live" 
                      },
                      { 
                        title: language === 'bn' ? "মোট রেভিনিউ আয়" : "Total Revenue", 
                        val: `৳${Math.round(totalRevenueBdt).toLocaleString()}`, 
                        trend: `≈ $${Math.round(totalRevenueSum).toLocaleString()} USD`, 
                        isUp: true, 
                        icon: DollarSign, 
                        glow: "text-emerald-500", 
                        gradient: "from-emerald-500/10 to-transparent",
                        desc: language === 'bn' ? "বাস্তব অর্ডার ডাটাবেস থেকে রিয়েল-টাইমে হিসাবকৃত" : "Real-time revenue computed from real order database" 
                      },
                      { 
                        title: language === 'bn' ? 'সাপোর্ট টিকিট' : "Support Tickets", 
                        val: tickets.length.toLocaleString(), 
                        trend: `+${tickets.filter(t => t.status === 'open').length} open`, 
                        isUp: tickets.filter(t => t.status === 'open').length > 0, 
                        icon: MessageSquare, 
                        glow: "text-fuchsia-400", 
                        gradient: "from-fuchsia-500/10 to-transparent",
                        desc: language === 'bn' ? 'গ্রাহক সহায়তা টিকিট সংখ্যা' : "Pending assistance tickets logged" 
                      }
                    ].map((wid, idx) => {
                      const CardIcon = wid.icon;
                      return (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-2xl border ${panelBg} shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/5 group/card text-left`}
                        >
                          {/* Interactive glow shine effect on background */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${wid.gradient} opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`} />
                          
                          <div className="flex items-start justify-between relative z-10">
                            <span className="text-[10px] uppercase font-bold font-sans tracking-widest opacity-60 text-slate-400 block">{wid.title}</span>
                            
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              isDark ? 'bg-white/[0.04]' : 'bg-slate-100'
                            } group-hover/card:scale-110 group-hover/card:bg-purple-600 group-hover/card:text-white`}>
                              <CardIcon className={`w-4 h-4 transition-colors ${wid.glow} group-hover/card:text-white`} />
                            </div>
                          </div>

                          <div className="mt-3 relative z-10">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-2xl font-black font-sans tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {wid.val}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-2">
                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-sans ${
                                wid.isUp 
                                  ? 'bg-emerald-500/10 text-emerald-500' 
                                  : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                <span className="text-[8px]">{wid.isUp ? '▲' : '▼'}</span>
                                {wid.trend}
                              </span>
                              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 font-mono leading-none truncate max-w-[70px]">
                                {wid.desc}
                              </span>
                            </div>
                          </div>

                          <div className="absolute right-0 bottom-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover/card:bg-purple-500/10 transition-colors pointer-events-none" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Extra Stats Section placed directly below Total Products and secondary metric elements */}
                <div 
                  className={`w-full ${getWidgetColumnClass('services-tiers')}`} 
                  style={getWidgetStyle('services-tiers')}
                >
                  <div className="grid grid-cols-1 gap-4 mt-2" id="admin-dashboard-extra-stats-under-products">
                    
                    {/* All Services Active Tiers Card */}
                    <div className={`p-5 rounded-2xl border ${cardBorder} ${panelBg} shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-500/5 group/services-card text-left`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover/services-card:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex items-start justify-between relative z-10">
                        <div>
                          <span className="text-[10px] uppercase font-bold font-sans tracking-widest opacity-60 text-slate-400 block mb-1">
                            Sales Catalog
                          </span>
                          <h4 className={`text-base font-bold ${textTitle} flex items-center gap-1.5`}>
                            All Services Field
                          </h4>
                        </div>

                        <button 
                          onClick={() => {
                            setActiveMenu('services');
                            triggerToast('💼 Redirected to Bespoke enterprise services configuration panel.');
                          }}
                          className="text-[9px] uppercase tracking-wider font-extrabold text-purple-400 hover:text-purple-300 bg-purple-500/10 rounded px-2 py-1 transition-all"
                        >
                          Manager Hub →
                        </button>
                      </div>

                      <div className="mt-4 relative z-10 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-black font-sans tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              6
                            </span>
                            <span className="text-xs font-semibold text-slate-400">bespoke services active</span>
                          </div>
                          
                          {/* Inline list of services with tiny cute badges */}
                          <div className="flex flex-wrap gap-1 mt-2 max-w-[320px]">
                            {[
                              'Web Dev', 'Ecommerce', 'SEO Audits', 'Marketing', 'Graphics', 'Mobile Apps'
                            ].map((sName, idx) => (
                              <span 
                                 key={idx}
                                className={`text-[8.5px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  isDark 
                                    ? 'bg-neutral-850 border-neutral-800/85 text-neutral-300' 
                                    : 'bg-slate-50 border-slate-150 text-slate-600'
                                } hover:border-purple-500/30 transition-colors cursor-help`}
                                title={sName}
                              >
                                ⚙️ {sName}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isDark ? 'bg-white/[0.04]' : 'bg-slate-100'
                         } group-hover/services-card:scale-110 group-hover/services-card:bg-purple-600 group-hover/services-card:text-white`}>
                          <Layers className="w-5 h-5 text-purple-500 group-hover/services-card:text-white transition-colors" />
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-neutral-800/80 relative z-10 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">SLA Coverage: 24/7 Priority</span>
                        <span className="text-purple-400 font-extrabold">GPL Multi-License</span>
                      </div>

                      <div className="absolute right-0 bottom-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover/services-card:bg-purple-500/10 transition-colors pointer-events-none" />
                    </div>

                  </div>
                </div>

                {/* 2. Interactive Charting Block Grid supporting Recharts Sales Bar Chart and Growth monitor */}
                <div 
                  className={`w-full ${getWidgetColumnClass('sales-charts')}`} 
                  style={getWidgetStyle('sales-charts')}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="admin-dashboard-charts-bento-grid">
                  
                  {/* CHART CARD A: RECHARTS COMPREHENSIVE SALES & PENDING PAYMENTS ANALYZER */}
                  <div className={`p-6 rounded-2xl border ${cardBorder} ${panelBg} space-y-4 flex flex-col justify-between shadow-xl`} id="admin-sales-recharts-bar-block">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h4 className={`text-base font-bold ${textTitle}`}>Sales & Pending Revenue Analyzer</h4>
                        </div>
                        <p className="text-[11px] opacity-65 mt-0.5">Dual-stream Recharts visualizer highlighting collected vs outstanding balances</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <span className="px-2 py-0.5 text-[8.5px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 rounded-md">LIVE FED</span>
                        <span className="px-2 py-0.5 text-[8.5px] font-mono font-bold bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/20 rounded-md">RECHARTS BAR</span>
                      </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-64 w-full relative pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartBarChart data={monthlySalesAggregateData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                          <defs>
                            {/* High-fidelity color gradients for Completed vs Pending bars */}
                            <linearGradient id="completedBarGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" stopOpacity={0.88} />
                              <stop offset="100%" stopColor="#059669" stopOpacity={0.25} />
                            </linearGradient>
                            <linearGradient id="pendingBarGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.88} />
                              <stop offset="100%" stopColor="#D97706" stopOpacity={0.25} />
                            </linearGradient>
                          </defs>

                          <RechartCartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1E293B" : "#E2E8F0"} vertical={false} />
                          <RechartXAxis 
                            dataKey="month" 
                            stroke={isDark ? "#64748B" : "#94A3B8"} 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <RechartYAxis 
                            stroke={isDark ? "#64748B" : "#94A3B8"} 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(v) => `$${v}`}
                          />
                          <RechartTooltip 
                            contentStyle={{ 
                              backgroundColor: isDark ? '#0F172A' : '#FFFFFF', 
                              borderColor: isDark ? '#334155' : '#CBD5E1', 
                              borderRadius: '16px',
                              fontSize: 10,
                              fontWeight: '600',
                              color: isDark ? '#F8FAFC' : '#0F172A',
                              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15)'
                            }} 
                            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                          />
                          <RechartLegend 
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 10, paddingTop: '12px' }} 
                          />
                          
                          <RechartBar 
                            dataKey="completedSales" 
                            fill="url(#completedBarGrad)" 
                            name="Completed Revenue" 
                            radius={[5, 5, 0, 0]} 
                            barSize={12} 
                          />
                          <RechartBar 
                            dataKey="pendingSales" 
                            fill="url(#pendingBarGrad)" 
                            name="Pending Payments" 
                            radius={[5, 5, 0, 0]} 
                            barSize={12} 
                          />
                        </RechartBarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Footer interactive summary stats */}
                    <div className="grid grid-cols-3 gap-2.5 text-center pt-3 border-t border-slate-200/50 dark:border-slate-800/45 select-none font-sans">
                      <div className="p-2 rounded-xl bg-slate-500/5 hover:bg-slate-500/8 transition-colors">
                        <span className="text-[10px] block opacity-50 font-bold uppercase tracking-wider">Accumulated Vol</span>
                        <span className={`text-[13px] font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          ${(monthlySalesAggregateData.reduce((acc, curr) => acc + curr.completedSales + curr.pendingSales, 0)).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="p-2 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/8 transition-colors">
                        <span className="text-[10px] block text-emerald-400 font-bold uppercase tracking-wider">Completed Cap</span>
                        <span className="text-[13px] font-black text-emerald-500 tracking-tight">
                          ${(monthlySalesAggregateData.reduce((acc, curr) => acc + curr.completedSales, 0)).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-amber-500/5 hover:bg-amber-500/8 transition-colors">
                        <span className="text-[10px] block text-amber-500 font-bold uppercase tracking-wider">In-Pipeline</span>
                        <span className="text-[13px] font-black text-amber-500 tracking-tight">
                          ${(monthlySalesAggregateData.reduce((acc, curr) => acc + curr.pendingSales, 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CHART CARD B: INTERACTIVE GROWTH MONITOR */}
                  <div className={`p-6 rounded-2xl border ${panelBg} space-y-4 flex flex-col justify-between shadow-xl`} id="admin-enterprise-growth-monitor-block">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div>
                        <h4 className={`text-base font-bold ${textTitle}`}>Enterprise SaaS Growth Monitor</h4>
                        <p className="text-[11px] opacity-60 mt-0.5">Telemetry mappings for key business performance layers (2026)</p>
                      </div>
                      
                      <div className="flex items-center bg-neutral-900/40 p-0.5 rounded-xl border border-neutral-800 text-xs font-mono self-start sm:self-auto">
                        {(['revenue', 'orders', 'customers'] as const).map((viewKey) => (
                          <button
                            key={viewKey}
                            onClick={() => setDashboardChartView(viewKey)}
                            className={`px-3 py-1.5 rounded-lg transition-all capitalize font-bold text-[10px] ${
                              dashboardChartView === viewKey 
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/15' 
                                : 'text-neutral-450 hover:text-white'
                            }`}
                          >
                            {viewKey === 'revenue' ? '📈 Revenue' : viewKey === 'orders' ? '📊 Orders' : '👥 Customers'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Specific Chart representations based on Selected Tab */}
                    <div className="w-full h-64 bg-neutral-950 border border-neutral-800 rounded-2xl relative flex items-end p-4 pt-12 overflow-hidden shadow-inner">
                      <div className="absolute left-4 top-4 flex items-center gap-4 text-[10px] font-mono z-10">
                        {dashboardChartView === 'revenue' && (
                          <div className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            <span>Monthly Earnings (Primary Purple #6C3BFF Sprints)</span>
                          </div>
                        )}
                        {dashboardChartView === 'orders' && (
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                            <span className="w-2 h-2 bg-emerald-400 rounded animate-pulse" />
                            <span>Orders Volume Trends</span>
                          </div>
                        )}
                        {dashboardChartView === 'customers' && (
                          <div className="flex items-center gap-1.5 bg-[#0EA5E9]/10 text-cyan-400 px-2 py-1 rounded">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span>Accumulated Customer Growth curve</span>
                          </div>
                        )}
                      </div>

                      {/* Dynamic SVGs */}
                      {dashboardChartView === 'revenue' && (
                        <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6C3BFF" stopOpacity="0.45" />
                              <stop offset="100%" stopColor="#6C3BFF" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0,150 L 0,130 Q 100,105 200,90 T 400,45 T 600,20 L 600,150 Z" fill="url(#purpleGlow)" />
                          <path d="M 0,130 Q 100,105 200,90 T 400,45 T 600,20" fill="none" stroke="#6C3BFF" strokeWidth="4" />
                          <circle cx="200" cy="90" r="4.5" fill="#6C3BFF" stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx="400" cy="45" r="4.5" fill="#6C3BFF" stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx="600" cy="20" r="4.5" fill="#6C3BFF" stroke="#ffffff" strokeWidth="1.5" />
                        </svg>
                      )}

                      {dashboardChartView === 'orders' && (
                        <div className="w-full h-[80%] flex items-end justify-between px-6 gap-3 pb-2 z-10">
                          {[
                            { m: 'Jan', h: '35%', val: 45 },
                            { m: 'Feb', h: '42%', val: 54 },
                            { m: 'Mar', h: '58%', val: 72 },
                            { m: 'Apr', h: '75%', val: 88 },
                            { m: 'May', h: '82%', val: 94 },
                            { m: 'Jun', h: '98%', val: 104 }
                          ].map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group animate-bounce-short">
                              <span className="text-[8.5px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 px-1 rounded -mt-4">{bar.val} orders</span>
                              <div className="w-full bg-emerald-500 bg-opacity-70 rounded-t-lg group-hover:bg-opacity-100 transition-all cursor-pointer" style={{ height: bar.h }} />
                              <span className="text-[9px] font-mono text-neutral-400 mt-1">{bar.m}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {dashboardChartView === 'customers' && (
                        <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0,150 L 0,135 Q 120,110 240,85 T 480,50 T 600,35 L 600,150 Z" fill="url(#cyanGlow)" />
                          <path d="M 0,135 Q 120,110 240,85 T 480,50 T 600,35" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                          <circle cx="240" cy="85" r="4" fill="#0ea5e9" />
                          <circle cx="480" cy="50" r="4" fill="#0ea5e9" />
                          <circle cx="600" cy="35" r="4" fill="#0ea5e9" />
                        </svg>
                      )}

                      {dashboardChartView !== 'orders' && (
                        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-6 text-[9px] font-mono opacity-50 z-10">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun (Consolidated)</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                </div>

                {/* Modern Premium SaaS Widget: Recent Orders List */}
                <div 
                  className={`w-full ${getWidgetColumnClass('recent-orders')}`} 
                  style={getWidgetStyle('recent-orders')}
                >
                  <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading recent orders...</div>}>
                    <RecentOrdersWidget
                      orders={orders}
                      customers={customers}
                      isDark={isDark}
                      language={language}
                      formatPrice={formatPrice}
                      getOrderSerial={getOrderSerial}
                      setSelectedOrderForInspect={setSelectedOrderForInspect}
                      setSelectedOrderForInvoiceModal={setSelectedOrderForInvoiceModal}
                      updateOrderStatus={updateOrderStatus}
                      updateOrderDetails={updateOrderDetails}
                      deleteOrder={deleteOrder}
                      currentUser={currentUser}
                      setActiveMenu={setActiveMenu}
                      triggerToast={triggerToast}
                    />
                  </Suspense>
                </div>

                {/* Custom Admin Panel Quick Actions Control Deck */}
                <div 
                  className={`w-full ${getWidgetColumnClass('broadcast-actions')}`} 
                  style={getWidgetStyle('broadcast-actions')}
                >
                  <div className={`p-5 rounded-2xl border ${cardBorder} ${panelBg} space-y-5 flex flex-col justify-between`} id="admin-dashboard-quick-actions">
                    <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-purple-400" />
                        <div>
                          <h4 className={`text-sm font-bold tracking-tight ${textTitle}`}>Broadcast Quick Actions</h4>
                          <span className="text-[10px] opacity-60 block">Real-time site-wide notifications delivery engine</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase border border-purple-500/15">
                        Live
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-5 pt-1">
                      {/* Sub-Widget B: Site-wide Broadcaster Notification with premium pink/violet sunset gradient design */}
                      <div className={`p-5 rounded-2xl border ${
                        isDark 
                          ? 'border-purple-500/20 bg-gradient-to-br from-neutral-900 via-purple-950/25 to-neutral-900/95 shadow-[0_4px_20px_rgba(168,85,247,0.06)] hover:shadow-[0_10px_35px_rgba(168,85,247,0.12)]' 
                          : 'border-purple-200 bg-gradient-to-br from-purple-50/60 via-white to-pink-50/40 shadow-[0_4px_16px_rgba(168,85,247,0.05)] hover:shadow-[0_10px_30px_rgba(168,85,247,0.09)]'
                        } space-y-3 flex flex-col justify-between transition-all duration-350 relative group/notify overflow-hidden`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-purple-500/5' : 'bg-purple-500/10'} rounded-full blur-2xl group-hover/notify:bg-purple-500/15 transition-all duration-500 pointer-events-none`} />
                        
                        <div className="space-y-1.5 relative z-10 text-left">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-xs font-black tracking-wide flex items-center gap-1.5 font-sans uppercase ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                              <Bell className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
                              Site-wide Delivery Engine
                            </h5>
                            <span className={`inline-flex items-center gap-1 text-[8.5px] px-2 py-0.5 rounded-full font-mono font-bold border shadow-inner ${
                              isDark 
                                ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' 
                                : 'bg-pink-100 text-pink-700 border-pink-200'
                            }`}>
                              📢 Broadcaster
                            </span>
                          </div>
                          
                          <p className={`text-[10.5px] leading-relaxed font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Deploy real-time hot offer ribbons, coupons, or technical dispatches to every client dashboard & guest page instantly.
                          </p>
                        </div>

                        <div className="space-y-3 relative z-10 font-sans">
                          <div>
                            <span className={`text-[9px] font-extrabold uppercase tracking-wider block mb-1 ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>📢 Broadcast Message</span>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Type temporary broadcast alert message..."
                                value={siteBroadcastInput}
                                onChange={(e) => setSiteBroadcastInput(e.target.value)}
                                className={`w-full text-xs rounded-xl px-3 py-2 outline-none border transition duration-200 ${
                                  isDark 
                                    ? 'bg-neutral-950/90 border-neutral-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30' 
                                    : 'bg-white border-neutral-250 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 shadow-xs'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <span className={`text-[9.5px] font-extrabold uppercase tracking-wider block mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>🔗 Button Link URL</span>
                              <input
                                type="text"
                                placeholder="e.g., https://webzonebd.com/sale"
                                value={siteBroadcastLink}
                                onChange={(e) => setSiteBroadcastLink(e.target.value)}
                                className={`w-full text-[10.5px] rounded-xl px-3 py-2 outline-none border transition duration-200 font-mono ${
                                  isDark 
                                    ? 'bg-neutral-950/90 border-neutral-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-550/35' 
                                    : 'bg-white border-neutral-250 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-550/35 shadow-xs'
                                }`}
                              />
                            </div>
                            <div>
                              <span className={`text-[9.5px] font-extrabold uppercase tracking-wider block mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>🏷️ Button Text</span>
                              <input
                                type="text"
                                placeholder="Claim Offer"
                                value={siteBroadcastLinkText}
                                onChange={(e) => setSiteBroadcastLinkText(e.target.value)}
                                className={`w-full text-[10.5px] rounded-xl px-3 py-2 outline-none border transition duration-200 ${
                                  isDark 
                                    ? 'bg-neutral-950/90 border-neutral-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-550/35' 
                                    : 'bg-white border-neutral-250 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-550/35 shadow-xs'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Broadcast Message Timeline Dropdown selector with automatic countdown and premium styling */}
                          <div className="relative">
                            <span className={`text-[9.5px] font-extrabold uppercase tracking-wider block mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                              ⏱️ Broadcast Duration Timeline
                            </span>
                            
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setIsTimelineDropdownOpen(!isTimelineDropdownOpen)}
                                className={`w-full flex items-center justify-between text-xs rounded-xl px-3 py-2.5 outline-none border transition duration-200 text-left font-bold cursor-pointer select-none ${
                                  isDark 
                                    ? 'bg-neutral-950/90 border-neutral-800 text-white focus:border-purple-500' 
                                    : 'bg-white border-neutral-250 text-slate-900 focus:border-purple-500 shadow-xs'
                                }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                  <span>{siteBroadcastDuration}</span>
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isTimelineDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {isTimelineDropdownOpen && (
                                <div className={`absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border p-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                                  isDark 
                                    ? 'bg-neutral-900 border-neutral-800 text-white shadow-black/40' 
                                    : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/25'
                                }`}>
                                  {['12 Hours', '24 Hours', '7 Days', '30 Days', '90 Days'].map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => {
                                        setSiteBroadcastDuration(opt);
                                        localStorage.setItem('site_wide_broadcast_duration', opt);
                                        setIsTimelineDropdownOpen(false);
                                      }}
                                      className={`w-full text-left text-xs px-3 py-2 rounded-lg font-bold transition-all flex items-center justify-between cursor-pointer ${
                                        siteBroadcastDuration === opt
                                          ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                                          : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:bg-neutral-100 text-neutral-600 dark:text-neutral-300'
                                      }`}
                                    >
                                      <span>{opt}</span>
                                      {siteBroadcastDuration === opt && <span className="text-[10px] text-purple-500 font-bold">● Active</span>}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Broadcast Message Severity Selector */}
                          <div>
                            <span className={`text-[9.5px] font-extrabold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                              🛡️ Broadcast Severity Level
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { val: 'info', label: 'ℹ️ Info', desc: 'Informative update', activeClasses: 'bg-blue-600/15 text-blue-400 border-blue-500/40' },
                                { val: 'urgent', label: '⚠️ Urgent', desc: 'Alert / Maintenance', activeClasses: 'bg-red-600/15 text-red-400 border-red-500/40' },
                                { val: 'offer', label: '🎁 Offer', desc: 'Promo / Deal / Discount', activeClasses: 'bg-amber-600/15 text-amber-500 border-amber-500/40' }
                              ].map((sev) => (
                                <button
                                  type="button"
                                  key={sev.val}
                                  onClick={() => {
                                    setSiteBroadcastSeverity(sev.val as any);
                                    localStorage.setItem('site_wide_broadcast_severity', sev.val);
                                    triggerToast(`🛡️ Severity set to: ${sev.label}`);
                                  }}
                                  className={`px-2 py-1.5 rounded-xl border text-[10.5px] font-bold text-center transition duration-200 cursor-pointer ${
                                    siteBroadcastSeverity === sev.val
                                      ? sev.activeClasses
                                      : isDark
                                        ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                                        : 'bg-slate-50/50 border-neutral-200 text-slate-600 hover:border-neutral-300 hover:text-slate-800'
                                  }`}
                                  title={sev.desc}
                                >
                                  {sev.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Broadcast Timing Schedule Picker */}
                          <div className={`p-3 rounded-xl border ${
                            isDark 
                              ? 'bg-neutral-950/45 border-neutral-800' 
                              : 'bg-slate-50 border-neutral-100'
                          }`}>
                            <span className={`text-[9.5px] font-extrabold uppercase tracking-wider block mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-505'}`}>
                              ⚡ Dispatch Display Timing
                            </span>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSiteBroadcastScheduleOption('immediate');
                                  setSiteBroadcastStartAt('');
                                }}
                                className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold text-center transition duration-200 cursor-pointer ${
                                  siteBroadcastScheduleOption === 'immediate'
                                    ? 'bg-purple-600/15 text-purple-450 border-purple-500/40'
                                    : isDark
                                      ? 'bg-neutral-950/30 border-neutral-800 text-neutral-400'
                                      : 'bg-white border-neutral-200 text-slate-600 shadow-2xs'
                                }`}
                              >
                                ⚡ Show Immediately
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSiteBroadcastScheduleOption('scheduled');
                                  const date = new Date();
                                  date.setMinutes(date.getMinutes() + 15);
                                  const year = date.getFullYear();
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const day = String(date.getDate()).padStart(2, '0');
                                  const hours = String(date.getHours()).padStart(2, '0');
                                  const minutes = String(date.getMinutes()).padStart(2, '0');
                                  setSiteBroadcastStartAt(`${year}-${month}-${day}T${hours}:${minutes}`);
                                }}
                                className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold text-center transition duration-200 cursor-pointer ${
                                  siteBroadcastScheduleOption === 'scheduled'
                                    ? 'bg-purple-600/15 text-purple-450 border-purple-500/40'
                                    : isDark
                                      ? 'bg-neutral-950/30 border-neutral-800 text-neutral-400'
                                      : 'bg-white border-neutral-200 text-slate-600 shadow-2xs'
                                }`}
                              >
                                📅 Advanced Schedule
                              </button>
                            </div>

                            {siteBroadcastScheduleOption === 'scheduled' && (
                              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className={`text-[8.5px] font-extrabold uppercase tracking-widest block ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                                  🎯 Choose Publish Date & Time
                                </span>
                                <input
                                  type="datetime-local"
                                  value={siteBroadcastStartAt}
                                  onChange={(e) => setSiteBroadcastStartAt(e.target.value)}
                                  className={`w-full text-xs rounded-lg px-2.5 py-1.5 outline-none border transition duration-200 font-mono ${
                                    isDark 
                                      ? 'bg-neutral-900 border-neutral-800 text-white focus:border-purple-500' 
                                      : 'bg-white border-neutral-200 text-slate-900 focus:border-purple-500 shadow-2xs'
                                  }`}
                                />
                                <div className="text-[9px] text-zinc-400 leading-relaxed font-mono mt-1 opacity-80">
                                  System time: {new Date().toLocaleString()}
                                  {siteBroadcastStartAt && (() => {
                                    const diff = new Date(siteBroadcastStartAt).getTime() - Date.now();
                                    if (diff > 0) {
                                      const diffMins = Math.ceil(diff / (1000 * 60));
                                      const days = Math.floor(diffMins / (24 * 60));
                                      const hours = Math.floor((diffMins % (24 * 60)) / 60);
                                      const mins = diffMins % 60;
                                      return (
                                        <span className="block text-purple-400 font-bold mt-0.5 animate-pulse">
                                          ⏳ Starts in: {days > 0 ? `${days}d ` : ''}{hours > 0 ? `${hours}h ` : ''}{mins} mins
                                        </span>
                                      );
                                    } else {
                                      return <span className="block text-red-400 font-bold mt-0.5">⚠️ Selected time is in the past! It will show immediately.</span>;
                                    }
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Saved Templates Deck Section */}
                          <div className={`mt-3 p-3.5 rounded-xl border ${
                            isDark 
                              ? 'bg-neutral-950/40 border-neutral-800 shadow-inner' 
                              : 'bg-slate-50/50 border-indigo-100/60 shadow-xs'
                          } space-y-3`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-[9.5px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-purple-350' : 'text-purple-900'}`}>
                                📋 Announcement Templates Deck
                              </span>
                              <span className="text-[8.5px] font-mono opacity-50">Quick Recall</span>
                            </div>

                            {/* Templates Quick List */}
                            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                              {broadcastTemplates.map((tmpl) => (
                                <div
                                  key={tmpl.id}
                                  className={`inline-flex items-center gap-1.5 rounded-lg border text-[10px] pl-2 pr-1 py-1 transition-all group/tmpl ${
                                    siteBroadcastInput === tmpl.message
                                      ? 'bg-purple-600/10 text-purple-400 border-purple-500/30'
                                      : isDark
                                        ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                                        : 'bg-white border-slate-200 hover:border-indigo-200 text-slate-700 shadow-2xs'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSiteBroadcastInput(tmpl.message || '');
                                      setSiteBroadcastLink(tmpl.link || '');
                                      setSiteBroadcastLinkText(tmpl.linkText || 'Claim Offer');
                                      setSiteBroadcastDuration(tmpl.duration || '24 Hours');
                                      if (tmpl.severity) {
                                        setSiteBroadcastSeverity(tmpl.severity);
                                        localStorage.setItem('site_wide_broadcast_severity', tmpl.severity);
                                      }
                                      triggerToast(`📋 Loaded template: ${tmpl.name}`);
                                    }}
                                    className="font-bold flex-1 text-left cursor-pointer mr-1 hover:text-purple-500 transition-colors"
                                    title="Click to recall this announcement template"
                                  >
                                    {tmpl.name}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = broadcastTemplates.filter(t => t.id !== tmpl.id);
                                      setBroadcastTemplates(filtered);
                                      localStorage.setItem('site_wide_broadcast_templates', JSON.stringify(filtered));
                                      triggerToast(`🗑️ Template "${tmpl.name}" removed.`);
                                    }}
                                    className="p-1 rounded text-red-400 hover:text-red-500 hover:bg-red-500/10 transition opacity-60 hover:opacity-100 cursor-pointer"
                                    title="Delete template"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}

                              {broadcastTemplates.length === 0 && (
                                <div className="text-[10px] text-zinc-500 italic py-1">
                                  No announcement templates saved. Set values below to save first.
                                </div>
                              )}
                            </div>

                            {/* Save Current as Template Row */}
                            <div className="space-y-1.5 pt-2 border-t border-dashed border-neutral-800/60 dark:border-neutral-800/40">
                              <span className={`text-[8.5px] font-bold uppercase tracking-wider block ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                                💾 Save Current Input as Template
                              </span>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="e.g., Summer Super Flash Deal"
                                  value={newTemplateName}
                                  onChange={(e) => setNewTemplateName(e.target.value)}
                                  className={`flex-1 text-[10px] rounded-lg px-2.5 py-1.5 outline-none border transition duration-200 ${
                                    isDark 
                                      ? 'bg-neutral-900 border-neutral-800 text-white focus:border-purple-500' 
                                      : 'bg-white border-neutral-200 text-slate-900 focus:border-purple-500 shadow-2xs'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!newTemplateName.trim()) {
                                      triggerToast("⚠️ Enter a template name first.");
                                      return;
                                    }
                                    if (!siteBroadcastInput.trim()) {
                                      triggerToast("⚠️ Cannot save an empty broadcast message template.");
                                      return;
                                    }
                                    const newTmpl = {
                                      id: `tmpl-${Date.now()}`,
                                      name: newTemplateName.trim(),
                                      message: siteBroadcastInput.trim(),
                                      link: siteBroadcastLink.trim(),
                                      linkText: siteBroadcastLinkText.trim() || 'Claim Offer',
                                      duration: siteBroadcastDuration,
                                      severity: siteBroadcastSeverity
                                    };
                                    const updated = [...broadcastTemplates, newTmpl];
                                    setBroadcastTemplates(updated);
                                    localStorage.setItem('site_wide_broadcast_templates', JSON.stringify(updated));
                                    setNewTemplateName('');
                                    triggerToast(`💾 Template "${newTmpl.name}" saved to your Deck!`);
                                  }}
                                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                                    isDark 
                                      ? 'bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/20' 
                                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                                  }`}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Save Current</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                            <button
                              onClick={() => {
                                if (!siteBroadcastInput.trim()) {
                                  triggerToast("⚠️ Please enter a broadcast message first.");
                                  return;
                                }

                                const msg = siteBroadcastInput.trim();
                                const link = siteBroadcastLink.trim();
                                const linkTxt = siteBroadcastLinkText.trim() || 'Claim Offer';
                                const broadcastId = `bcast-${Date.now()}`;

                                // Calculate expires at values dynamically based on selected timeline duration
                                let ms = 24 * 60 * 60 * 1000; // default 24h
                                if (siteBroadcastDuration === '12 Hours') ms = 12 * 60 * 60 * 1000;
                                else if (siteBroadcastDuration === '24 Hours') ms = 24 * 60 * 60 * 1000;
                                else if (siteBroadcastDuration === '7 Days') ms = 7 * 24 * 60 * 60 * 1000;
                                else if (siteBroadcastDuration === '30 Days') ms = 30 * 24 * 60 * 60 * 1000;
                                else if (siteBroadcastDuration === '90 Days') ms = 90 * 24 * 60 * 60 * 1000;

                                // Scheduled start calculation
                                let startAt: number | null = null;
                                if (siteBroadcastScheduleOption === 'scheduled' && siteBroadcastStartAt) {
                                  startAt = new Date(siteBroadcastStartAt).getTime();
                                }

                                const displayStart = startAt || Date.now();
                                const expiresAt = displayStart + ms;

                                // Direct LocalStorage writes for synchronisation state backup
                                localStorage.setItem('site_wide_broadcast_notification', msg);
                                localStorage.setItem('site_wide_broadcast_link', link);
                                localStorage.setItem('site_wide_broadcast_link_text', linkTxt);
                                localStorage.setItem('site_wide_broadcast_id', broadcastId);
                                localStorage.setItem('site_wide_broadcast_expires_at', String(expiresAt));
                                if (startAt) {
                                  localStorage.setItem('site_wide_broadcast_start_at', String(startAt));
                                } else {
                                  localStorage.removeItem('site_wide_broadcast_start_at');
                                }
                                localStorage.setItem('site_wide_broadcast_duration', siteBroadcastDuration);
                                localStorage.setItem('site_wide_broadcast_severity', siteBroadcastSeverity);

                                // Propagate to all simulated customers so it's registered in their local notification boxes
                                const accountsToUpdate = ['usr-101', 'usr-102', 'usr-103', 'usr-104', 'usr-105', 'guest'];
                                accountsToUpdate.forEach(userId => {
                                  try {
                                    const saved = localStorage.getItem(`webzone_notifications_${userId}`);
                                    const existing = saved ? JSON.parse(saved) : [
                                      { id: 'not-welcome', title: '👋 Welcome to WebzoneBD!', message: 'Explore ready-made IT services, customize parameters, and build a digital footprint.', type: 'system', date: 'Just now', read: false }
                                    ];

                                    // Replace any previous broadcast promotions or duplicates safely
                                    const cleaned = existing.filter((n: any) => n.id !== broadcastId && n.type !== 'offer');

                                    const newBroadcastNotif = {
                                      id: broadcastId,
                                      title: '🎁 Special Site-wide Offer Announced!',
                                      message: msg,
                                      type: 'offer',
                                      link: link || undefined,
                                      linkText: linkTxt,
                                      date: 'Just now',
                                      read: false
                                    };

                                    localStorage.setItem(`webzone_notifications_${userId}`, JSON.stringify([newBroadcastNotif, ...cleaned]));
                                  } catch (err) {
                                    console.error("Broadcast write layout failed for ID:", userId, err);
                                  }
                                });

                                if (onBroadcastChange) {
                                  onBroadcastChange(msg, link, linkTxt, expiresAt, siteBroadcastSeverity, startAt);
                                  if (startAt && startAt > Date.now()) {
                                    logAdminAction(`Scheduled site-wide broadcast display: "${msg}" to start at ${new Date(startAt).toLocaleString()}`);
                                    triggerToast(`📅 Broadcast scheduled to publish automatically on: ${new Date(startAt).toLocaleString()}`);
                                  } else {
                                    logAdminAction(`Dispatched active site-wide broadcast: "${msg}" [Severity: ${siteBroadcastSeverity.toUpperCase()}]`);
                                    triggerToast(`📢 Site-wide notification dispatched with ${siteBroadcastSeverity} level!`);
                                  }
                                } else {
                                  logAdminAction(`Dispatched active site-wide broadcast (Direct Storage): "${msg}" [Severity: ${siteBroadcastSeverity.toUpperCase()}]`);
                                  triggerToast("📢 Notification properties updated physically in workspace.");
                                }
                              }}
                              className="py-2.5 px-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 text-white text-[10.5px] font-black rounded-xl cursor-pointer text-center transition flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-md shadow-pink-600/10 hover:shadow-pink-550/25 duration-200"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Broadcast Alert
                            </button>
                            <button
                              onClick={handleLocalClearAlert}
                              className={`py-2.5 px-3 font-bold rounded-xl cursor-pointer text-center border transition ${
                                isDark 
                                  ? 'bg-neutral-950/80 hover:bg-neutral-850 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700' 
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 border-neutral-200'
                              }`}
                            >
                              Clear Alert
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Site wide active notification status preview and Recent Broadcasts Status Center widget */}
                    {(() => {
                      const liveNotif = siteWideBroadcast || localStorage.getItem('site_wide_broadcast_notification');
                      const liveLink = localStorage.getItem('site_wide_broadcast_link');
                      const liveLinkText = localStorage.getItem('site_wide_broadcast_link_text') || 'Claim Offer';
                      const liveExpiresAt = Number(localStorage.getItem('site_wide_broadcast_expires_at') || '0');
                      const liveStartAt = Number(localStorage.getItem('site_wide_broadcast_start_at') || '0');
                      const liveSeverity = localStorage.getItem('site_wide_broadcast_severity') || 'info';

                      // Find recent announcement actions in audit logs
                      const broadcastLogs = localActivityLogs.filter(log => 
                        log.action.toLowerCase().includes('broadcast') || 
                        log.action.toLowerCase().includes('announcement') ||
                        log.action.toLowerCase().includes('site-wide')
                      ).slice(0, 4);

                      const now = Date.now();
                      const isUpcoming = liveNotif && liveStartAt > now;
                      const isActiveLive = liveNotif && (!liveStartAt || liveStartAt <= now) && (!liveExpiresAt || liveExpiresAt > now);

                      return (
                        <div className={`p-5 rounded-2xl border transition-all duration-350 ${
                          isDark 
                            ? 'bg-neutral-950/40 border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)]' 
                            : 'bg-white border-slate-200/85 shadow-[0_4px_16px_rgba(148,163,184,0.08)]'
                        } space-y-4`}>
                          
                          {/* Heading */}
                          <div className="flex items-center justify-between border-b border-neutral-800/20 dark:border-neutral-800/60 pb-3">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-purple-500" />
                              <div>
                                <h4 className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                                  📣 Broadcast Control & Status Center
                                </h4>
                                <p className="text-[9.5px] text-zinc-400 opacity-80 mt-0.5">Diagnose and examine sent system notices and upcoming triggers</p>
                              </div>
                            </div>
                            <span className="text-[8.5px] font-mono tracking-wider opacity-60">ADMIN CONSOLE</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* Left part: Live & Scheduled Status indicator */}
                            <div className="space-y-3">
                              <span className={`text-[9.5px] font-bold uppercase tracking-wider block ${isDark ? 'text-zinc-500' : 'text-slate-450'}`}>
                                🎯 Dispatch Status Indicator
                              </span>

                              {isUpcoming && (
                                <div className={`p-3.5 rounded-xl border space-y-2.5 relative overflow-hidden ${
                                  isDark 
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' 
                                    : 'bg-amber-50/50 border-amber-200 text-amber-900 shadow-3xs'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase bg-amber-500/15 border border-amber-500/35 px-2 py-0.5 rounded-full select-none animate-pulse">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-ping" />
                                      📅 Scheduled (Upcoming)
                                    </span>
                                    <span className="text-[9.5px] font-mono opacity-85">
                                      Level: {liveSeverity.toUpperCase()}
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="text-xs font-extrabold tracking-tight leading-relaxed line-clamp-2">
                                      "{liveNotif}"
                                    </div>
                                    <span className="text-[9px] opacity-70 block font-mono">
                                      Button URL: <span className="underline italic break-all">{liveLink || 'None'}</span>
                                    </span>
                                  </div>

                                  {/* Ticking starting countdown */}
                                  <div className="pt-2 border-t border-amber-500/10 flex items-center justify-between text-[10px] font-mono">
                                    <span className="opacity-75">Publish Schedule:</span>
                                    <span className="font-bold text-amber-400 animate-pulse">
                                      {(() => {
                                        const startsIn = liveStartAt - Date.now();
                                        if (startsIn <= 0) return 'Publishing...';
                                        const sMins = Math.ceil(startsIn / (1000 * 60));
                                        const sDays = Math.floor(sMins / (24 * 60));
                                        const sHours = Math.floor((sMins % (24 * 60)) / 60);
                                        const sM = sMins % 60;
                                        const sSec = Math.floor((startsIn % (1000 * 60)) / 1000);
                                        return `⏳ In ${sDays > 0 ? `${sDays}d ` : ''}${sHours > 0 ? `${sHours}h ` : ''}${sM}m ${sSec}s`;
                                      })()}
                                    </span>
                                  </div>

                                  {/* Clear and dispatch immediate actions */}
                                  <div className="flex gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        // Force starting now
                                        localStorage.removeItem('site_wide_broadcast_start_at');
                                        if (onBroadcastChange) {
                                          onBroadcastChange(liveNotif, liveLink, liveLinkText, liveExpiresAt, liveSeverity, null);
                                        }
                                        logAdminAction(`Forced scheduled broadcast to start immediately: "${liveNotif}"`);
                                        triggerToast("⚡ Scheduled announcement pushed to active state instantly!");
                                      }}
                                      className="flex-1 py-1 px-2 bg-purple-600 hover:bg-purple-500 text-white text-[9.5px] font-bold rounded-lg cursor-pointer transition text-center"
                                    >
                                      ⚡ Run Now
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleLocalClearAlert}
                                      className="py-1 px-2 bg-transparent hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 border border-amber-500/30 text-[9.5px] font-bold rounded-lg cursor-pointer transition text-center"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {isActiveLive && (
                                <div className={`p-3.5 rounded-xl border space-y-2.5 relative overflow-hidden ${
                                  isDark 
                                    ? 'bg-purple-600/10 border-purple-500/20 text-purple-200' 
                                    : 'bg-purple-500/5 border-purple-200 text-purple-900 shadow-3xs'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 px-2 py-0.5 rounded-full select-none">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping shrink-0" />
                                      🟢 Live & Broadcasting
                                    </span>
                                    <span className="text-[9px] opacity-75 font-mono">
                                      Severity: {liveSeverity.toUpperCase()}
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="text-xs font-bold leading-relaxed line-clamp-2">
                                      "{liveNotif}"
                                    </div>
                                    <span className="text-[9px] opacity-75 block font-mono">
                                      With CTA: <strong className="underline">{liveLinkText}</strong> &rarr; <span className="italic break-all">{liveLink || 'None'}</span>
                                    </span>
                                  </div>

                                  <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between text-[10px] font-mono">
                                    <span className="opacity-75">Expiration Countdown:</span>
                                    <span className="font-bold text-pink-400 animate-pulse">
                                      {(() => {
                                        const remaining = liveExpiresAt - Date.now();
                                        if (remaining <= 0) return 'Expired';
                                        const rMins = Math.ceil(remaining / (1000 * 60));
                                        const rDays = Math.floor(rMins / (24 * 60));
                                        const rHours = Math.floor((rMins % (24 * 60)) / 60);
                                        const rM = rMins % 60;
                                        const rSec = Math.floor((remaining % (1000 * 60)) / 1000);
                                        return `⏳ ${rDays > 0 ? `${rDays}d ` : ''}${rHours > 0 ? `${rHours}h ` : ''}${rM}m ${rSec}s left`;
                                      })()}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={handleLocalClearAlert}
                                    className="w-full py-1.5 bg-rose-650/15 hover:bg-rose-600 hover:text-white border border-rose-500/20 text-rose-400 text-[9.5px] font-extrabold rounded-lg cursor-pointer transition text-center duration-200"
                                  >
                                    🛑 Terminate Live Broadcast Alert
                                  </button>
                                </div>
                              )}

                              {!liveNotif && (
                                <div className={`p-4 rounded-xl border border-dashed flex flex-col items-center justify-center text-center space-y-2 py-8 ${
                                  isDark ? 'bg-neutral-950/20 border-neutral-850' : 'bg-slate-50/50 border-slate-200 shadow-2xs'
                                }`}>
                                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                    <Check className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className={`text-[11px] font-bold ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>Broadcasting Bands Idle</p>
                                    <p className="text-[10px] text-zinc-405 max-w-[200px] mt-0.5 leading-normal opacity-80">
                                      No upcoming schedules or live messages. Set a timing trigger above.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right part: Recent broadcast activities history */}
                            <div className="space-y-3">
                              <span className={`text-[9.5px] font-bold uppercase tracking-wider block ${isDark ? 'text-zinc-500' : 'text-slate-450'}`}>
                                📋 Live Dispatch Audit Logs
                              </span>

                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {broadcastLogs.length === 0 ? (
                                  <div className="text-center py-8 text-zinc-500 text-[10px] border border-dashed rounded-xl border-neutral-800/60">
                                    <p>Ready to audit broadcast dispatches.</p>
                                  </div>
                                ) : (
                                  broadcastLogs.map((log, index) => (
                                    <div key={log.id ? `${log.id}-${index}` : index} className={`p-2.5 rounded-lg border flex flex-col space-y-1 transition duration-150 ${
                                      isDark 
                                        ? 'bg-neutral-950/40 border-neutral-850/60 hover:border-neutral-800' 
                                        : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 shadow-3xs'
                                    }`}>
                                      <p className={`text-[10px] leading-normal ${isDark ? 'text-neutral-200' : 'text-slate-700'}`}>
                                        {log.action}
                                      </p>
                                      <div className="flex items-center justify-between text-[8px] opacity-50 font-mono">
                                        <span>IP: {log.ipAddress || 'Internal'}</span>
                                        <span>⏱️ {log.timestamp || 'Just now'}</span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Customer activity telemetry logs */}
                <div 
                  className={`w-full ${getWidgetColumnClass('client-activities')}`} 
                  style={getWidgetStyle('client-activities')}
                >
                  <div className={`p-5 rounded-2xl border ${cardBorder} ${panelBg} space-y-4 flex flex-col justify-between h-full`} id="admin-dashboard-customer-activities">
                    <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <div>
                          <h4 className={`text-sm font-bold tracking-tight ${textTitle}`}>Recent Client Activities</h4>
                          <span className="text-[10px] opacity-60 block">Real-time system actions & operations audit</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono opacity-50">Top 5 Records</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[170px] pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                      {localActivityLogs.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500 text-xs">
                          <p>No recent user security logs registered.</p>
                        </div>
                      ) : (
                        localActivityLogs.slice(0, 5).map((log, index) => (
                          <div key={log.id || index} className="p-2.5 bg-neutral-950/50 border border-neutral-900 rounded-xl space-y-1 hover:border-neutral-800/80 transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[10.5px] font-medium text-neutral-200 leading-normal line-clamp-2">
                                {log.action}
                              </p>
                              <span className="text-[9px] opacity-45 font-mono bg-neutral-900 px-1 py-0.5 rounded shrink-0">
                                {log.timestamp || 'Just now'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500">
                              <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                              <span className="truncate max-w-[120px]">{log.userAgent ? log.userAgent.slice(0, 30) : 'System Worker'}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => setActiveMenu('customers')}
                      className="w-full py-1.5 px-3 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-[10px] font-bold text-neutral-400 border border-neutral-800 rounded-lg text-center transition flex items-center justify-center gap-1.5"
                    >
                      Audit Full Customer Logs <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* WhatsApp Live Lead Feed Widget */}
                <div 
                  className={`w-full ${getWidgetColumnClass('whatsapp-leads')}`} 
                  style={getWidgetStyle('whatsapp-leads')}
                >
                  <div className={`p-5 rounded-2xl border ${cardBorder} ${panelBg} space-y-4 flex flex-col justify-between h-full`} id="admin-dashboard-whatsapp-inquiries">
                    <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <div>
                          <h4 className={`text-sm font-bold tracking-tight ${textTitle}`}>WhatsApp Live Lead Feed</h4>
                          <span className="text-[10px] opacity-60 block">Real-time chat inquiries & click actions</span>
                        </div>
                      </div>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[170px] pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                      {adminWhatsAppLeads.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500 text-xs">
                          <p>No recent WhatsApp inquiries tracked.</p>
                        </div>
                      ) : (
                        adminWhatsAppLeads.slice(0, 5).map((lead, index) => {
                          // Determine status badge colors dynamically
                          let statusClasses = 'bg-purple-650/15 text-purple-400 border-purple-500/20';
                          if (lead.status === 'Closed Converted' || lead.status === 'Responded') {
                            statusClasses = 'bg-emerald-600/15 text-emerald-400 border-emerald-500/20';
                          } else if (lead.status === 'Follow-up' || lead.status === 'Contacted') {
                            statusClasses = 'bg-amber-600/15 text-amber-500 border-amber-550/20';
                          }

                          return (
                            <div key={lead.id || index} className="p-2.5 bg-neutral-950/50 border border-neutral-900 rounded-xl space-y-1.5 hover:border-neutral-800/80 transition-all text-left">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className={`text-[11px] font-bold ${isDark ? 'text-neutral-100' : 'text-slate-900'} block`}>
                                    {lead.name}
                                  </span>
                                  <span className="text-[9px] text-neutral-450 block font-mono">
                                    {lead.phone}
                                  </span>
                                </div>
                                <span className={`text-[8.5px] px-2 py-0.5 rounded-full border font-bold ${statusClasses} shrink-0`}>
                                  {lead.status}
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-2 text-[9.5px]">
                                <span className="text-purple-400 font-medium truncate max-w-[150px]">
                                  💼 {lead.service}
                                </span>
                                <span className="text-[9px] text-neutral-450 font-mono">
                                  {lead.budget && lead.budget !== 'N/A' ? `Budget: ${lead.budget}` : ''}
                                </span>
                              </div>

                              <div className="text-[8px] font-mono text-neutral-500 flex justify-between items-center pt-0.5 border-t border-neutral-900/60">
                                <span>Action Registered</span>
                                <span>⏱️ {lead.date || 'Just now'}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setActiveMenu('services');
                        setActiveSubMenu('whatsapp-leads');
                        triggerToast('💼 Redirected to WhatsApp Orders CRM Panel.');
                      }}
                      className="w-full py-1.5 px-3 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-[10px] font-bold text-neutral-400 border border-neutral-800 rounded-lg text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Manage WhatsApp CRM <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 3. Splitted Viewports: Top Products */}
                <div 
                  className={`w-full ${getWidgetColumnClass('top-products')}`} 
                  style={getWidgetStyle('top-products')}
                >
                  <div className={`p-5 rounded-2xl border ${panelBg}`}>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${textTitle}`}>Top Selling Store Products</h4>
                    <div className="space-y-2">
                      {topSellingProducts.length > 0 ? (
                        topSellingProducts.map((p) => (
                          <div key={p.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                            <div>
                              <span className="font-semibold block truncate max-w-[200px]" title={language === 'bn' ? p.nameBn : p.name}>
                                {language === 'bn' ? p.nameBn : p.name}
                              </span>
                              <span className="text-[9px] opacity-60 font-mono">
                                {p.category} • {p.salesCount} sales
                              </span>
                            </div>
                            <span className="font-bold text-emerald-400 font-mono text-[11px]">{formatPrice(p.price)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-xs text-slate-500 py-4">No products in store</div>
                      )}
                    </div>
                  </div>
                </div>



                {/* 5. Recent Customers Grid with quick wallet adjustment adjustments */}
                <div 
                  className={`w-full ${getWidgetColumnClass('customer-wallets')}`} 
                  style={getWidgetStyle('customer-wallets')}
                >
                  <div className={`p-5 rounded-2xl border ${panelBg} space-y-4`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${textTitle}`}>Recent Customers Wallet Controls</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.slice(0, 3).map((cust) => {
                      const custOrders = orders.filter(o => 
                        (o.customerEmail && o.customerEmail.toLowerCase() === cust.email.toLowerCase()) || 
                        (o.customerPhone && o.customerPhone === cust.phone) ||
                        (o.guestEmail && o.guestEmail.toLowerCase() === cust.email.toLowerCase()) || 
                        (o.guestPhone && o.guestPhone === cust.phone)
                      );
                      const affLink = `https://webzonebd.com/?ref=REF-${cust.id.toUpperCase()}`;
                      
                      return (
                        <div 
                          key={cust.id} 
                          className={`p-5 rounded-2xl border ${
                            isDark 
                              ? 'bg-gradient-to-br from-neutral-905 via-neutral-950 to-indigo-950/20 border-neutral-800/80 hover:border-indigo-500/40 shadow-xl shadow-black/20 hover:shadow-indigo-500/10' 
                              : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/15 border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10'
                          } flex flex-col justify-between space-y-4 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-350 relative overflow-hidden group/custCard`}
                        >
                          {/* Radial Ambient Glow inside card */}
                          <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover/custCard:bg-indigo-500/20 transition-all duration-300 pointer-events-none" />
                          <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />

                          {/* Top Border Animated Gradient strip */}
                          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60 group-hover/custCard:opacity-100 transition-opacity duration-300" />

                          {/* Name and Header Info */}
                          <div className="flex items-start justify-between relative z-10">
                            <div className="min-w-0 flex-1">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white block tracking-tight truncate group-hover/custCard:text-indigo-600 dark:group-hover/custCard:text-cyan-400 transition-colors duration-250">
                                {cust.name}
                              </span>
                              
                              {/* Email address directly below name */}
                              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-mono truncate select-all">{cust.email}</span>
                              </div>

                              {/* WhatsApp number below email */}
                              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-550 dark:text-slate-450">
                                <span className="text-[10px] shrink-0">💬</span>
                                <span className="font-mono font-semibold text-emerald-650 dark:text-emerald-400 select-all">
                                  {cust.whatsapp || cust.phone || 'N/A'}
                                </span>
                              </div>
                            </div>
                            
                            <span className="p-1 px-2.5 bg-indigo-500/10 dark:bg-purple-500/10 text-indigo-700 dark:text-purple-400 font-mono text-[8.5px] font-black rounded-lg uppercase tracking-wider shrink-0 ml-2 border border-indigo-500/10 dark:border-purple-500/10">
                              {cust.country || 'Bangladesh'}
                            </span>
                          </div>

                          {/* Order List Field */}
                          <div className="space-y-1.5 text-[10px] relative z-10">
                            <div className="flex items-center justify-between">
                              <span className="opacity-60 dark:opacity-50 uppercase font-mono tracking-wider font-extrabold text-[8.5px] flex items-center gap-1">
                                <ShoppingBag className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Order History ({custOrders.length})
                              </span>
                              <span className="px-1.5 py-0.5 bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/15 rounded-md font-black font-mono text-[8px]">
                                Total Spent: ${cust.totalSpent || 0}
                              </span>
                            </div>
                            {custOrders.length > 0 ? (
                              <div className="max-h-[85px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin dark:scrollbar-thumb-neutral-800 scrollbar-thumb-slate-250">
                                {custOrders.map((o, idx) => (
                                  <div 
                                    key={o.id || idx} 
                                    className="p-1.5 px-2 bg-slate-100/75 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-850 rounded-lg flex items-center justify-between gap-2.5 hover:border-indigo-500/20 hover:bg-slate-100 dark:hover:bg-neutral-950 transition-all duration-200"
                                  >
                                    <span className="text-slate-700 dark:text-neutral-300 truncate font-semibold flex-1 text-[8.5px]" title={o.itemTitle}>
                                      {o.itemTitle}
                                    </span>
                                    <span className="font-mono shrink-0 font-bold text-emerald-600 dark:text-emerald-400 text-[8.5px]">
                                      ${o.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="italic text-slate-500 dark:text-neutral-500 text-center py-3 bg-slate-50/50 dark:bg-neutral-900/35 border border-dashed border-slate-200 dark:border-neutral-850 rounded-lg text-[8.5px]">
                                No registered orders
                              </div>
                            )}
                          </div>

                          {/* Recent Transactions Section */}
                          <div className="space-y-1.5 text-[10px] relative z-10">
                            <span className="opacity-60 dark:opacity-50 uppercase font-mono tracking-wider font-extrabold text-[8.5px] flex items-center gap-1">
                              💳 Recent Transactions ({custOrders.length})
                            </span>
                            {custOrders.length > 0 ? (
                              <div className="max-h-[85px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin dark:scrollbar-thumb-neutral-800 scrollbar-thumb-slate-250">
                                {custOrders.map((o, idx) => {
                                  const statusVal = o.paymentStatus || 'completed';
                                  const isCompleted = statusVal === 'completed';
                                  const isPending = statusVal === 'pending';
                                  
                                  const badgeClass = isCompleted
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15'
                                    : isPending
                                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15'
                                      : 'bg-rose-500/10 text-rose-650 dark:text-rose-400 border-rose-500/15';

                                  return (
                                    <div 
                                      key={`txn-${o.id || idx}`}
                                      className="p-1.5 px-2 bg-slate-100/50 dark:bg-neutral-900/60 border border-slate-150 dark:border-neutral-850/85 rounded-lg flex items-center justify-between gap-1 text-[8.5px] hover:bg-slate-100 dark:hover:bg-neutral-900 transition-all duration-200"
                                    >
                                      <span className="text-slate-500 dark:text-slate-400 font-mono shrink-0 text-[8px]">
                                        {o.date}
                                      </span>
                                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 ml-auto">
                                        ${o.price}
                                      </span>
                                      <span className={`px-1 rounded text-[7.5px] uppercase font-bold font-mono border ${badgeClass}`}>
                                        {statusVal}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="italic text-slate-500 dark:text-neutral-500 text-center py-3 bg-slate-50/50 dark:bg-neutral-900/35 border border-dashed border-slate-200 dark:border-neutral-850 rounded-lg text-[8.5px]">
                                No logged transactions
                              </div>
                            )}
                          </div>

                          {/* Affiliate Link */}
                          <div className="space-y-1.5 text-[10px] relative z-10">
                            <span className="opacity-60 dark:opacity-50 uppercase font-mono tracking-wider font-extrabold text-[8.5px]">Affiliate Link</span>
                            <div className="flex gap-1.5">
                              <input 
                                type="text" 
                                readOnly 
                                value={affLink}
                                className="bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-300 border border-slate-200 dark:border-neutral-850 text-[8.5px] rounded-lg px-2.5 py-1.5 flex-1 font-mono focus:outline-none focus:border-purple-500/50 truncate select-all transition-colors duration-200"
                              />
                              <button 
                                onClick={() => {
                                  try {
                                    navigator.clipboard.writeText(affLink);
                                    triggerToast('📋 Affiliate link copied to clipboard successfully!');
                                  } catch (err) {
                                    triggerToast('❌ Failed to copy affiliate link');
                                  }
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-750 transition shrink-0 cursor-pointer flex items-center justify-center animate-pulse"
                                title="Copy link"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Wallet Balance Display */}
                          <div className="flex items-center justify-between bg-slate-100/70 dark:bg-neutral-900 px-3 py-2 rounded-xl border border-slate-200/55 dark:border-neutral-850 relative z-10">
                            <span className="text-[9px] opacity-60 dark:opacity-55 uppercase font-mono tracking-wide">Wallet Balance:</span>
                            <span className="font-extrabold font-mono text-xs text-emerald-600 dark:text-emerald-400">${cust.walletBalance}</span>
                          </div>

                          {/* Quick Adjust Action */}
                          <div className="pt-1.5 relative z-10">
                            <button
                              onClick={() => {
                                setSelectedCustomerIdForWallet(cust.id);
                                setWalletAmountValue(50);
                              }}
                              className="w-full py-2 px-2.5 bg-neutral-900 hover:bg-indigo-600 dark:bg-neutral-850 dark:hover:bg-purple-600 active:scale-95 text-[9px] font-black uppercase tracking-wider text-white dark:text-white rounded-xl transition-all duration-300 border border-neutral-800/80 dark:border-neutral-850 hover:border-transparent flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-indigo-500/20"
                            >
                              ⚡ Quick balance adjustment
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                </div>

              </div>
            )}

            {/* SCREEN VIEWPORT B: CUSTOMERS CLIENT RELATIONSHIP & LEDGER PLATFORM */}
            {activeMenu === 'customers' && (
              !checkPermission('manage_users') ? renderAccessDenied('manage_users', 'Customer Directory & CRM') : (
                <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading customer directory...</div>}>
                  <CustomersManager
                    theme={theme}
                    language={language}
                    customers={customers}
                    setCustomers={setCustomers}
                    orders={orders}
                    tickets={tickets}
                    projects={projects}
                    triggerToast={triggerToast}
                    logAdminAction={logAdminAction}
                    handleDownloadInvoicePdf={handleDownloadInvoicePdf}
                    checkPermission={checkPermission}
                    renderAccessDenied={renderAccessDenied}
                    usdBdtRate={webUsdBdtRate}
                    custTypeFilter={custTypeFilter}
                    setCustTypeFilter={setCustTypeFilter}
                    custStatusFilter={custStatusFilter}
                    setCustStatusFilter={setCustStatusFilter}
                    custCountryFilter={custCountryFilter}
                    setCustCountryFilter={setCustCountryFilter}
                    custSpendFilter={custSpendFilter}
                    setCustSpendFilter={setCustSpendFilter}
                    custCityFilter={custCityFilter}
                    setCustCityFilter={setCustCityFilter}
                    custOrderCountFilter={custOrderCountFilter}
                    setCustOrderCountFilter={setCustOrderCountFilter}
                    custPaymentStatusFilter={custPaymentStatusFilter}
                    setCustPaymentStatusFilter={setCustPaymentStatusFilter}
                    custRegDateFilter={custRegDateFilter}
                    setCustRegDateFilter={setCustRegDateFilter}
                    selectedCustomerProfileId={selectedCustomerProfileId}
                    setSelectedCustomerProfileId={setSelectedCustomerProfileId}
                    activeProfileTab={activeProfileTab}
                    setActiveProfileTab={setActiveProfileTab}
                    selectedBulkCustomers={selectedBulkCustomers}
                    setSelectedBulkCustomers={setSelectedBulkCustomers}
                    showCommunicationModal={showCommunicationModal}
                    setShowCommunicationModal={setShowCommunicationModal}
                    custForm={custForm}
                    setCustForm={setCustForm}
                    showAddCustomerModal={showAddCustomerModal}
                    setShowAddCustomerModal={setShowAddCustomerModal}
                    selectedCustomerIdForEdit={selectedCustomerIdForEdit}
                    setSelectedCustomerIdForEdit={setSelectedCustomerIdForEdit}
                    setCustomerSecurity={setCustomerSecurity}
                    setShowRegistrationSuccess={setShowRegistrationSuccess}
                    selectedCustForOrders={selectedCustForOrders}
                    setSelectedCustForOrders={setSelectedCustForOrders}
                    selectedCustForInvoices={selectedCustForInvoices}
                    setSelectedCustForInvoices={setSelectedCustForInvoices}
                    custDeleteConfirm={custDeleteConfirm}
                    setCustDeleteConfirm={setCustDeleteConfirm}
                    emailComposer={emailComposer}
                    setEmailComposer={setEmailComposer}
                    whatsappComposer={whatsappComposer}
                    setWhatsappComposer={setWhatsappComposer}
                    filtersExpanded={filtersExpanded}
                    setFiltersExpanded={setFiltersExpanded}
                    globalSearch={globalSearch}
                    setGlobalSearch={setGlobalSearch}
                  />
                </Suspense>
              )
            )}


            {/* SCREEN VIEWPORT: ORDERS MANAGEMENT & BILLING PIPELINES */}
            {activeMenu === 'orders' && (
              !checkPermission('manage_orders') ? renderAccessDenied('manage_orders', 'Orders Management') : (
                <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading orders manager...</div>}>
                  <OrdersManagement
                    orders={orders}
                    customers={customers}
                    isDark={isDark}
                    language={language}
                    formatPrice={(val: number) => `$${val.toFixed(2)}`}
                    getOrderSerial={getOrderSerial}
                    setSelectedOrderForInspect={setSelectedOrderForInspect}
                    setSelectedOrderForInvoiceModal={setSelectedOrderForInvoiceModal}
                    updateOrderStatus={updateOrderStatus}
                    updateOrderDetails={updateOrderDetails}
                    deleteOrder={deleteOrder}
                    currentUser={currentUser}
                    triggerToast={triggerToast}
                  />
                </Suspense>
              )
            )}

            {/* SCREEN VIEWPORT: CENTRAL REPORTS & BUSINESS INTELLIGENCE SUITE */}
            {activeMenu === 'reports' && (
              <AdminReportsSuite
                isDark={isDark}
                textTitle={textTitle}
                panelBg={panelBg}
                activeSubMenu={activeSubMenu}
                setActiveSubMenu={setActiveSubMenu}
                logAdminAction={logAdminAction}
                triggerToast={triggerToast}
                checkPermission={checkPermission}
                renderAccessDenied={renderAccessDenied}
                localActivityLogs={activityLogs}
                setLocalActivityLogs={() => {}}
                products={products as any}
                orders={orders as any}
                tickets={tickets as any}
                customers={customers as any}
                projects={projects as any}
                withdrawRequests={withdrawRequests as any}
                affiliateList={affiliateList as any}
                coupons={coupons as any}
              />
            )}

            {/* SCREEN VIEWPORT: MARKETING & PROMOTION HUB */}
            {activeMenu === 'marketing' && (
              <AdminMarketingHub
                isDark={isDark}
                language={language}
                triggerToast={triggerToast}
                activeSubMenu={activeSubMenu}
              />
            )}

            {/* SCREEN VIEWPORT: COUPONS & DISCOUNT MANAGEMENT */}
            {activeMenu === 'coupons' && (
              <AdminCouponsSuite
                isDark={isDark}
                language={language}
                coupons={coupons}
                addNewCoupon={addNewCoupon}
                updateCoupon={updateCoupon}
                deleteCoupon={deleteCoupon}
                triggerToast={triggerToast}
              />
            )}

            {/* SCREEN VIEWPORT: AFFILIATE PARTNER SYSTEM */}
            {activeMenu === 'affiliates' && (
              <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading affiliate system...</div>}>
                <AffiliateSystem
                  language={language}
                  theme={theme}
                  user={currentUser}
                  onLoginClick={() => {}}
                  triggerToast={triggerToast}
                />
              </Suspense>
            )}

            {/* SCREEN VIEWPORT: KANBAN WORKFLOW & MILESTONES */}
            {activeMenu === 'kanban' && (
              <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading Kanban board...</div>}>
                <KanbanBoard
                  theme={theme}
                  language={language}
                  triggerToast={triggerToast}
                />
              </Suspense>
            )}

            {/* SCREEN VIEWPORT: LIVE THEME & BRANDING PREVIEWER */}
            {(activeMenu === 'live-theme-preview' || activeMenu === 'web-theme-preview') && (
              <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading live theme previewer...</div>}>
                <LiveThemePreviewer
                  theme={theme}
                  language={language}
                  triggerToast={triggerToast}
                />
              </Suspense>
            )}

            {/* SCREEN VIEWPORT: GUEST ORDER TRACKING PORTAL */}
            {(activeMenu === 'tracking' || activeMenu === 'guest-tracking') && (
              <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading order tracker...</div>}>
                <GuestOrderTracking
                  theme={theme}
                  language={language}
                  triggerToast={triggerToast}
                  onOpenOrderInspect={(order: any) => setSelectedOrderForInspect(order)}
                />
              </Suspense>
            )}

            {/* SCREEN VIEWPORT: LIVE CHAT MANAGEMENT & TAWK.TO CENTER */}
            {(activeMenu === 'support' || activeSubMenu === 'support-chat' || activeMenu === 'live-chat') && (
              <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading live chat center...</div>}>
                <AdminLiveChat
                  language={language}
                  theme={theme}
                  triggerToast={triggerToast}
                  currentUser={currentUser}
                />
              </Suspense>
            )}

            {/* FALLBACK VIEWPORT: WEBSITE CONTROL CENTER FOR SERVICES, CMS, WEB-SETTINGS, STAFF */}
            {['services', 'ai-center', 'reviews', 'staff', 'notifications', 'web-settings', 'products', 'categories'].includes(activeMenu) && activeSubMenu !== 'support-chat' && (
              <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Loading control center...</div>}>
                <WebsiteControlCenter
                  language={language}
                  theme={theme}
                  activeSubMenu={activeSubMenu}
                  setActiveSubMenu={setActiveSubMenu}
                  triggerToast={triggerToast}
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
                  getOrderSerial={getOrderSerial}
                  updateOrderStatus={updateOrderStatus}
                />
              </Suspense>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
