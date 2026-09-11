import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clipboard, Users, FileText, CreditCard, Truck, MessageSquare, 
  TrendingUp, Link, Sliders, Search, Filter, ArrowDown, Plus, 
  Trash2, Send, Check, X, AlertCircle, RefreshCw, Download, 
  Eye, Save, Shield, Calendar, DollarSign, Edit3, CheckCircle2, Info, ChevronRight, Sparkles,
  Star, Building, Briefcase, MapPin, Mail, Phone, User, MoreVertical, Copy, UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';

interface WhatsAppServiceOrdersProps {
  activeSubMenu: string;
  triggerToast: (msg: string) => void;
  isDark: boolean;
  language: string;
}

// Interfaces
interface ServiceOrder {
  id: string;
  customerName: string;
  whatsappNumber: string;
  serviceName: string;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  customFields: { label: string; value: string }[];
  tag?: 'Urgent' | 'Standard' | 'Delayed';
}

interface CustomerContact {
  id: string;
  name: string;
  whatsappNumber: string;
  isVerified: boolean;
  status: 'active' | 'inactive';
  group: string;
  email: string;
  starred?: boolean;
  notes?: string;
  jobTitle?: string;
  company?: string;
  address?: string;
}

interface CrmTicket {
  id: string;
  contactId: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface InvoiceNotification {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: 'generated' | 'sent' | 'paid' | 'overdue';
  sentDate: string;
}

interface PaymentReminder {
  id: string;
  invoiceId: string;
  customerName: string;
  amountDue: number;
  dueDate: string;
  status: 'upcoming' | 'due' | 'overdue' | 'sent';
  scheduledDate: string;
}

interface DeliveryUpdate {
  id: string;
  projectName: string;
  customerName: string;
  whatsappNumber: string;
  progress: number; // 0-100
  phase: 'Started' | 'Development' | 'Completed' | 'Delivered';
  lastUpdated: string;
}

interface TemplateMsg {
  id: string;
  name: string;
  category: 'utility' | 'marketing' | 'authentication';
  language: string;
  body: string;
}

// Initial Mock Data
const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'WSO-9201',
    customerName: 'Imran Hasan',
    whatsappNumber: '+8801712345678',
    serviceName: 'E-commerce Website Design',
    price: 450,
    status: 'processing',
    date: '2026-07-08',
    tag: 'Urgent',
    customFields: [
      { label: 'Business Domain', value: 'bengalmart.com' },
      { label: 'Color Preference', value: 'Midnight Blue & Gold' },
      { label: 'Features Required', value: 'Bkash Payment Gateway, SMS Notifications' }
    ]
  },
  {
    id: 'WSO-8392',
    customerName: 'Sajid Rahman',
    whatsappNumber: '+8801811223344',
    serviceName: 'SEO Optimization Pack',
    price: 150,
    status: 'pending',
    date: '2026-07-09',
    tag: 'Standard',
    customFields: [
      { label: 'Target Keywords', value: 'software development bd, tech firm dhaka' },
      { label: 'Competitor URL', value: 'https://competitor.bd' }
    ]
  },
  {
    id: 'WSO-7462',
    customerName: 'Anika Tabassum',
    whatsappNumber: '+8801912998877',
    serviceName: 'Social Media Management',
    price: 280,
    status: 'completed',
    date: '2026-07-05',
    tag: 'Standard',
    customFields: [
      { label: 'Page Handle', value: '@anika_boutique_bd' },
      { label: 'Post Frequency', value: '3 times a week' }
    ]
  },
  {
    id: 'WSO-6120',
    customerName: 'Sabbir Ahmed',
    whatsappNumber: '+8801511224455',
    serviceName: 'Dynamic Web Development',
    price: 650,
    status: 'cancelled',
    date: '2026-07-02',
    tag: 'Delayed',
    customFields: [
      { label: 'Business Focus', value: 'Real Estate Agency' }
    ]
  },
  {
    id: 'WSO-5112',
    customerName: 'Rakibul Islam',
    whatsappNumber: '+8801711223344',
    serviceName: 'Custom API Integration',
    price: 320,
    status: 'processing',
    date: '2026-07-07',
    tag: 'Urgent',
    customFields: [
      { label: 'API Target', value: 'Meta Cloud WhatsApp API Integration' }
    ]
  }
];

const INITIAL_CONTACTS: CustomerContact[] = [
  { id: 'C-01', name: 'Imran Hasan', whatsappNumber: '+8801712345678', isVerified: true, status: 'active', group: 'VIP Customers', email: 'imran@webzone.com', starred: true, notes: 'Lead Developer at WebzoneBD, interested in advanced BDIX cloud server hosting scripts and React integration solutions.', jobTitle: 'Chief Technical Officer', company: 'WebzoneBD Solutions', address: 'Dhaka, Bangladesh' },
  { id: 'C-02', name: 'Sajid Rahman', whatsappNumber: '+8801811223344', isVerified: true, status: 'active', group: 'Regular', email: 'sajid@gmail.com', starred: false, notes: 'Purchased SEO Optimization Pack. Inquired about monthly audit follow-ups.', jobTitle: 'SEO Strategist', company: 'Optimizers BD', address: 'Chittagong, BD' },
  { id: 'C-03', name: 'Anika Tabassum', whatsappNumber: '+8801912998877', isVerified: false, status: 'active', group: 'Regular', email: 'anika@boutique.com', starred: false, notes: 'Boutique eCommerce owner. High priority lead for full-stack mobile order system development and custom gateways.', jobTitle: 'Founder', company: 'Anika Boutique House', address: 'Sylhet, Bangladesh' },
  { id: 'C-04', name: 'Sabbir Ahmed', whatsappNumber: '+8801511224455', isVerified: true, status: 'inactive', group: 'Corporate Clients', email: 'sabbir@agency.com', starred: true, notes: 'Corporate user from Real Estate Agency. Previous order cancelled due to budget adjustments, but remains high priority for upcoming commercial portfolio.', jobTitle: 'Managing Director', company: 'Sheltech Properties', address: 'Banani, Dhaka' },
  { id: 'C-05', name: 'Rakibul Islam', whatsappNumber: '+8801711223344', isVerified: false, status: 'active', group: 'Regular', email: 'rakib@gmail.com', starred: false, notes: 'Requested WhatsApp API integration. Keeps checking automated template confirmations and triggers.', jobTitle: 'Marketing Lead', company: 'FastDelivery BD', address: 'Khulna, BD' },
  { id: 'C-06', name: 'Zeeshan Karim', whatsappNumber: '+8801311122233', isVerified: true, status: 'active', group: 'Corporate Clients', email: 'zeeshan@holding.com', starred: true, notes: 'Enterprise partner interested in B2B reseller hosting plans and bulk billing. Communicates primarily through verified official channels.', jobTitle: 'Partner', company: 'Karim Holdings Group', address: 'Gulshan-2, Dhaka' }
];

const INITIAL_TICKETS: CrmTicket[] = [
  { id: 'TKT-101', contactId: 'C-01', subject: 'SSL Certificate Installation Failure on Subdomain', status: 'resolved', priority: 'high', createdDate: '2026-07-06' },
  { id: 'TKT-102', contactId: 'C-01', subject: 'Inquire about VPS script automation API key setup', status: 'open', priority: 'medium', createdDate: '2026-07-09' },
  { id: 'TKT-201', contactId: 'C-02', subject: 'SEO Audit Report - Missing Keyword Mapping', status: 'pending', priority: 'medium', createdDate: '2026-07-08' },
  { id: 'TKT-301', contactId: 'C-03', subject: 'eCommerce checkout Bkash API Webhook verification fails', status: 'open', priority: 'high', createdDate: '2026-07-09' },
  { id: 'TKT-401', contactId: 'C-04', subject: 'Commercial Portfolio Theme installation issue', status: 'resolved', priority: 'low', createdDate: '2026-07-04' }
];

const INITIAL_FIELDS: FormField[] = [
  { id: 'F-1', label: 'Company Name', type: 'text', placeholder: 'Enter your business name', required: true },
  { id: 'F-2', label: 'Preferred Color Scheme', type: 'text', placeholder: 'e.g. Purple, Blue, Gold', required: false },
  { id: 'F-3', label: 'Detailed Description', type: 'textarea', placeholder: 'Provide specific instructions for your design...', required: true },
  { id: 'F-4', label: 'Expected Delivery Date', type: 'text', placeholder: 'YYYY-MM-DD', required: false }
];

const INITIAL_INVOICES: InvoiceNotification[] = [
  { id: 'I-1', invoiceNumber: 'INV-2026-001', customerName: 'Imran Hasan', amount: 450, status: 'sent', sentDate: '2026-07-08 10:15 AM' },
  { id: 'I-2', invoiceNumber: 'INV-2026-002', customerName: 'Sajid Rahman', amount: 150, status: 'generated', sentDate: '2026-07-09 09:30 AM' },
  { id: 'I-3', invoiceNumber: 'INV-2026-003', customerName: 'Anika Tabassum', amount: 280, status: 'paid', sentDate: '2026-07-05 02:45 PM' },
  { id: 'I-4', invoiceNumber: 'INV-2026-004', customerName: 'Sabbir Ahmed', amount: 650, status: 'overdue', sentDate: '2026-06-25 11:00 AM' }
];

const INITIAL_REMINDERS: PaymentReminder[] = [
  { id: 'R-1', invoiceId: 'INV-2026-001', customerName: 'Imran Hasan', amountDue: 450, dueDate: '2026-07-15', status: 'upcoming', scheduledDate: '2026-07-10 10:00 AM' },
  { id: 'R-2', invoiceId: 'INV-2026-004', customerName: 'Sabbir Ahmed', amountDue: 650, dueDate: '2026-07-02', status: 'overdue', scheduledDate: '2026-07-03 09:00 AM' },
  { id: 'R-3', invoiceId: 'INV-2026-002', customerName: 'Sajid Rahman', amountDue: 150, dueDate: '2026-07-18', status: 'upcoming', scheduledDate: '2026-07-11 11:30 AM' }
];

const INITIAL_DELIVERIES: DeliveryUpdate[] = [
  { id: 'D-1', projectName: 'E-commerce Website Design', customerName: 'Imran Hasan', whatsappNumber: '+8801712345678', progress: 45, phase: 'Development', lastUpdated: '2026-07-08 04:00 PM' },
  { id: 'D-2', projectName: 'SEO Optimization Pack', customerName: 'Sajid Rahman', whatsappNumber: '+8801811223344', progress: 10, phase: 'Started', lastUpdated: '2026-07-09 10:30 AM' },
  { id: 'D-3', projectName: 'Social Media Management', customerName: 'Anika Tabassum', whatsappNumber: '+8801912998877', progress: 100, phase: 'Delivered', lastUpdated: '2026-07-07 12:00 PM' }
];

const INITIAL_TEMPLATES: TemplateMsg[] = [
  { id: 'T-1', name: 'order_confirmation', category: 'utility', language: 'en_US', body: 'Hello {{customer_name}},\n\nThank you for ordering our *{{service_name}}*. Your order ID is *{{order_id}}*. Our development team is preparing your project board and will initiate the development loop shortly.\n\nBest Regards,\nWebzoneBD' },
  { id: 'T-2', name: 'invoice_notification', category: 'utility', language: 'en_US', body: 'Dear {{customer_name}},\n\nYour invoice *{{invoice_no}}* for the amount of *${{amount}}* has been generated. You can securely review and pay it here: {{invoice_link}}\n\nThank you for choosing WebzoneBD!' },
  { id: 'T-3', name: 'payment_reminder', category: 'utility', language: 'en_US', body: '⚠️ PAYMENT REMINDER ⚠️\n\nHi {{customer_name}},\n\nThis is a friendly reminder that a payment of *${{amount_due}}* is pending for Invoice *{{invoice_no}}*, which is due on *{{due_date}}*.\n\nPlease process the payment to ensure uninterrupted project execution.\n\nPay securely: {{pay_link}}' },
  { id: 'T-4', name: 'service_progress_update', category: 'utility', language: 'en_US', body: '🚀 PROJECT UPDATE 🚀\n\nHello {{customer_name}},\n\nWe are excited to inform you that your project *{{service_name}}* is currently in *{{phase}}* stage and has reached *{{progress}}% completion*.\n\nKeep track of real-time milestones on your client portal.\n\nBest Regards,\nWebzoneBD Team' },
  { id: 'T-5', name: 'welcome_message', category: 'utility', language: 'en_US', body: '👋 Hello {{customer_name}},\n\nWelcome to WebzoneBD WhatsApp Portal! We are glad to have you on board. You can now receive real-time order updates, fast invoice deliveries, and milestone tracks directly on this chat.\n\nType *MENU* to explore active services.' },
  { id: 'T-6', name: 'promotional_campaign', category: 'marketing', language: 'en_US', body: '🎉 RAMADAN SPECIAL OFFER 🎉\n\nHello {{customer_name}},\n\nEnjoy an exclusive *30% Discount* on all website scripts, themes, and full-stack API installations this week! Use Coupon Code *RAMADAN30* during checkout.\n\nExplore packages now: {{site_link}}' }
];

const CAMPAIGN_REPORT_DATA = [
  { date: '07-03', sent: 120, delivered: 118, read: 98, clicked: 65 },
  { date: '07-04', sent: 140, delivered: 137, read: 110, clicked: 72 },
  { date: '07-05', sent: 180, delivered: 175, read: 145, clicked: 95 },
  { date: '07-06', sent: 150, delivered: 148, read: 120, clicked: 81 },
  { date: '07-07', sent: 220, delivered: 215, read: 190, clicked: 130 },
  { date: '07-08', sent: 250, delivered: 247, read: 212, clicked: 154 },
  { date: '07-09', sent: 310, delivered: 304, read: 265, clicked: 198 }
];

export default function AdminWhatsAppServiceOrders({
  activeSubMenu,
  triggerToast,
  isDark,
  language
}: WhatsAppServiceOrdersProps) {

  // Active sub-navigation states
  const [activeTab, setActiveTab] = useState<string>('wa-orders');

  // Sync prop submenu to inner activeTab if provided
  useEffect(() => {
    if (activeSubMenu && activeSubMenu.startsWith('wa-')) {
      setActiveTab(activeSubMenu);
    }
  }, [activeSubMenu]);

  // Persistent States with LocalStorage fallback
  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    const local = localStorage.getItem('wa_service_orders');
    return local ? JSON.parse(local) : INITIAL_ORDERS;
  });

  const [contacts, setContacts] = useState<CustomerContact[]>(() => {
    const local = localStorage.getItem('wa_customer_contacts');
    return local ? JSON.parse(local) : INITIAL_CONTACTS;
  });

  const [formFields, setFormFields] = useState<FormField[]>(() => {
    const local = localStorage.getItem('wa_form_fields');
    return local ? JSON.parse(local) : INITIAL_FIELDS;
  });

  const [invoices, setInvoices] = useState<InvoiceNotification[]>(() => {
    const local = localStorage.getItem('wa_invoices');
    return local ? JSON.parse(local) : INITIAL_INVOICES;
  });

  const [reminders, setReminders] = useState<PaymentReminder[]>(() => {
    const local = localStorage.getItem('wa_reminders');
    return local ? JSON.parse(local) : INITIAL_REMINDERS;
  });

  const [deliveries, setDeliveries] = useState<DeliveryUpdate[]>(() => {
    const local = localStorage.getItem('wa_deliveries');
    return local ? JSON.parse(local) : INITIAL_DELIVERIES;
  });

  const [templates, setTemplates] = useState<TemplateMsg[]>(() => {
    const local = localStorage.getItem('wa_templates');
    return local ? JSON.parse(local) : INITIAL_TEMPLATES;
  });

  const [tickets, setTickets] = useState<CrmTicket[]>(() => {
    const local = localStorage.getItem('wa_crm_tickets');
    return local ? JSON.parse(local) : INITIAL_TICKETS;
  });

  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Secure API Key State
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('wa_business_api_key') || '';
  });

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('wa_webhook_url') || 'https://api.webzonebd.com/v1/whatsapp/webhook';
  });

  const [senderNumber, setSenderNumber] = useState<string>(() => {
    return localStorage.getItem('wa_sender_number') || '+8801999888777';
  });

  const [businessName, setBusinessName] = useState<string>(() => {
    return localStorage.getItem('wa_business_name') || 'WebzoneBD Enterprise';
  });

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  // Save changes to localStorage helper
  useEffect(() => {
    localStorage.setItem('wa_service_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('wa_orders_updated'));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wa_customer_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('wa_form_fields', JSON.stringify(formFields));
  }, [formFields]);

  useEffect(() => {
    localStorage.setItem('wa_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('wa_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('wa_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('wa_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('wa_crm_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Submenu states & Modals
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<ServiceOrder | null>(null);

  // Date and Tag Filter States
  const [orderStartDate, setOrderStartDate] = useState<string>('');
  const [orderEndDate, setOrderEndDate] = useState<string>('');
  const [orderQuickDate, setOrderQuickDate] = useState<string>('all'); // all, today, 7days, 30days
  const [orderTagFilter, setOrderTagFilter] = useState<string>('all'); // all, Urgent, Standard, Delayed

  const [contactSearch, setContactSearch] = useState<string>('');
  const [contactFilter, setContactFilter] = useState<string>('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({ 
    name: '', 
    whatsappNumber: '', 
    email: '', 
    group: 'Regular',
    jobTitle: '',
    company: '',
    address: '',
    notes: ''
  });

  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [selectedContactDetail, setSelectedContactDetail] = useState<CustomerContact | null>(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [detailForm, setDetailForm] = useState<Partial<CustomerContact>>({});
  const [newField, setNewField] = useState<Omit<FormField, 'id'>>({ label: '', type: 'text', placeholder: '', required: true });

  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);
  const [notifTarget, setNotifTarget] = useState<{ name: string; number: string; type: string; id: string; orderContext?: ServiceOrder } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('order_confirmation');
  const [customMsgBody, setCustomMsgBody] = useState('');

  // Auto Messaging settings
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [autoReplyText, setAutoReplyText] = useState('Thank you for contacting WebzoneBD! Your query has been logged. Our developers will reach back on WhatsApp within 30 minutes.');

  // Theme support classes
  const glassBg = isDark 
    ? 'bg-[#0F172A]/80 border-white/[0.08] text-white backdrop-blur-[20px] shadow-2xl' 
    : 'bg-[#FFFFFF]/90 border-slate-200/95 text-[#0F172A] shadow-lg';

  const inputBg = isDark 
    ? 'bg-[#111827] border-[#374151] text-white focus:border-purple-500' 
    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:border-purple-650';

  const buttonPrimary = 'h-[54px] rounded-[14px] bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] active:scale-95 disabled:opacity-50';

  const buttonSecondary = 'h-[54px] px-6 rounded-[14px] bg-transparent border border-fuchsia-500/40 text-fuchsia-400 font-semibold hover:bg-fuchsia-500/10 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2';

  // Floating Labels Input Component Helper
  const FormInput = ({ label, value, onChange, placeholder, type = 'text', required = false, disabled = false, readOnly = false }: any) => {
    return (
      <div className="relative w-full group">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly || !onChange}
          className={`w-full h-[56px] px-4 pt-4 rounded-[14px] font-medium text-sm transition-all duration-300 border focus:outline-none focus:ring-4 focus:ring-purple-500/18 ${inputBg}`}
        />
        <label className={`absolute left-4 top-1.5 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    );
  };

  const FormTextarea = ({ label, value, onChange, placeholder, required = false, disabled = false, readOnly = false }: any) => {
    return (
      <div className="relative w-full group">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly || !onChange}
          className={`w-full min-h-[140px] p-4 pt-6 rounded-[14px] font-medium text-sm transition-all duration-300 border focus:outline-none focus:ring-4 focus:ring-purple-500/18 custom-scrollbar resize-y ${inputBg}`}
        />
        <label className={`absolute left-4 top-2 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    );
  };

  // Bulk status update
  const handleBulkStatusChange = (newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    if (selectedOrders.length === 0) {
      triggerToast('⚠️ Please select at least one order.');
      return;
    }
    const updated = orders.map(o => {
      if (selectedOrders.includes(o.id)) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    setSelectedOrders([]);
    triggerToast(`🚀 Updated ${selectedOrders.length} service orders to ${newStatus}.`);
  };

  // Export to CSV helper
  const exportCSV = (type: 'orders' | 'contacts' | 'invoices') => {
    let dataToExport: any[] = [];
    let headers: string[] = [];
    let fileName = '';

    if (type === 'orders') {
      dataToExport = orders;
      headers = ['ID', 'Customer', 'WhatsApp', 'Service', 'Price', 'Status', 'Date'];
      fileName = 'whatsapp_service_orders.csv';
    } else if (type === 'contacts') {
      dataToExport = contacts;
      headers = ['ID', 'Name', 'WhatsApp', 'VerifiedStatus', 'Status', 'Group', 'Email'];
      fileName = 'whatsapp_customer_list.csv';
    } else {
      dataToExport = invoices;
      headers = ['ID', 'Invoice No', 'Customer', 'Amount', 'Status', 'Date Sent'];
      fileName = 'whatsapp_invoice_notifications.csv';
    }

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const item of dataToExport) {
      const values = headers.map(header => {
        const key = header.replace(' ', '').charAt(0).toLowerCase() + header.replace(' ', '').slice(1);
        let val = (item as any)[key] || '';
        if (header === 'WhatsApp') val = item.whatsappNumber;
        if (header === 'VerifiedStatus') val = item.isVerified ? 'Verified' : 'Unverified';
        if (header === 'Invoice No') val = item.invoiceNumber;
        if (header === 'Date Sent') val = item.sentDate;
        // Escape quotes
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    a.click();
    triggerToast(`📊 Exported ${fileName} successfully.`);
  };

  const exportSingleContactCSV = (contact: CustomerContact) => {
    const matchedOrders = orders.filter(o => 
      o.whatsappNumber.trim() === contact.whatsappNumber.trim() ||
      o.customerName.toLowerCase() === contact.name.toLowerCase()
    );
    const matchedTickets = tickets.filter(t => t.contactId === contact.id);

    const headers = ['Field', 'Value'];
    const rows = [
      ['Contact ID', contact.id],
      ['Name', contact.name],
      ['WhatsApp Number', contact.whatsappNumber],
      ['Email Address', contact.email],
      ['Group Label', contact.group],
      ['Verified Status', contact.isVerified ? 'Verified' : 'Unverified'],
      ['Status', contact.status],
      ['Company', contact.company || 'n/a'],
      ['Job Title', contact.jobTitle || 'n/a'],
      ['Address', contact.address || 'n/a'],
      ['CRM Notes', contact.notes || 'n/a'],
      [],
      ['--- LINKED ORDERS ---', ''],
      ['Order ID', 'Service Name', 'Price ($)', 'Status', 'Date'],
      ...matchedOrders.map(o => [o.id, o.serviceName, o.price, o.status, o.date]),
      [],
      ['--- SUPPORT TICKETS ---', ''],
      ['Ticket ID', 'Subject', 'Status', 'Priority', 'Created Date'],
      ...matchedTickets.map(t => [t.id, t.subject, t.status, t.priority, t.createdDate])
    ];

    const csvContent = rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${contact.name.toLowerCase().replace(/\s+/g, '_')}_crm_export.csv`);
    a.click();
    triggerToast(`📊 Exported comprehensive CRM profile for ${contact.name}!`);
  };

  // Add contact
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.whatsappNumber) {
      triggerToast('⚠️ Please enter Name and WhatsApp Number.');
      return;
    }
    const newId = `C-0${contacts.length + 1}`;
    setContacts([...contacts, {
      id: newId,
      name: newContact.name,
      whatsappNumber: newContact.whatsappNumber,
      isVerified: true,
      status: 'active',
      group: newContact.group,
      email: newContact.email || 'n/a',
      starred: false,
      jobTitle: newContact.jobTitle || '',
      company: newContact.company || '',
      address: newContact.address || '',
      notes: newContact.notes || ''
    }]);
    setIsAddContactOpen(false);
    setNewContact({ 
      name: '', 
      whatsappNumber: '', 
      email: '', 
      group: 'Regular',
      jobTitle: '',
      company: '',
      address: '',
      notes: ''
    });
    triggerToast('👥 Added customer contact successfully.');
  };

  // Add dynamic form field
  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newField.label) return;
    const newId = `F-${formFields.length + 1}`;
    setFormFields([...formFields, { ...newField, id: newId }]);
    setIsAddFieldOpen(false);
    setNewField({ label: '', type: 'text', placeholder: '', required: true });
    triggerToast('📝 Custom field added to WhatsApp Order Form Builder.');
  };

  // Save secure API configuration
  const handleSaveApiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('wa_business_api_key', apiKey);
    localStorage.setItem('wa_webhook_url', webhookUrl);
    localStorage.setItem('wa_sender_number', senderNumber);
    localStorage.setItem('wa_business_name', businessName);
    triggerToast('🔐 WhatsApp Business API connection configurations saved securely!');
  };

  // Direct manual message wizard trigger
  const triggerNotificationModal = (name: string, number: string, type: string, id: string, orderContext?: ServiceOrder) => {
    setNotifTarget({ name, number, type, id, orderContext });
    const template = templates.find(t => t.name.includes(type)) || templates[0];
    setSelectedTemplate(template.name);
    // Replace placeholder previews
    let preview = template.body
      .replace('{{customer_name}}', name)
      .replace('{{order_id}}', id)
      .replace('{{invoice_no}}', id)
      .replace('{{amount}}', orderContext ? String(orderContext.price) : '280')
      .replace('{{amount_due}}', orderContext ? String(orderContext.price) : '450')
      .replace('{{due_date}}', '2026-07-15')
      .replace('{{service_name}}', orderContext ? orderContext.serviceName : 'E-commerce Site')
      .replace('{{phase}}', orderContext ? (orderContext.status === 'completed' ? 'Delivered' : orderContext.status === 'processing' ? 'Development' : 'Started') : 'Development')
      .replace('{{progress}}', orderContext ? (orderContext.status === 'completed' ? '100' : orderContext.status === 'processing' ? '45' : '10') : '45')
      .replace('{{invoice_link}}', 'https://webzonebd.com/invoice/pay')
      .replace('{{pay_link}}', 'https://webzonebd.com/pay')
      .replace('{{site_link}}', 'https://webzonebd.com');
    setCustomMsgBody(preview);
    setIsSendNotificationOpen(true);
  };

  // Handle template selection change in modal
  useEffect(() => {
    if (notifTarget) {
      const template = templates.find(t => t.name === selectedTemplate) || templates[0];
      const order = notifTarget.orderContext;
      let preview = template.body
        .replace('{{customer_name}}', notifTarget.name)
        .replace('{{order_id}}', notifTarget.id)
        .replace('{{invoice_no}}', notifTarget.id)
        .replace('{{amount}}', order ? String(order.price) : '280')
        .replace('{{amount_due}}', order ? String(order.price) : '450')
        .replace('{{due_date}}', '2026-07-15')
        .replace('{{service_name}}', order ? order.serviceName : 'Bespoke Application Design')
        .replace('{{phase}}', order ? (order.status === 'completed' ? 'Delivered' : order.status === 'processing' ? 'Development' : 'Started') : 'Development Progress')
        .replace('{{progress}}', order ? (order.status === 'completed' ? '100' : order.status === 'processing' ? '65' : '10') : '65')
        .replace('{{invoice_link}}', 'https://webzonebd.com/invoice/pay')
        .replace('{{pay_link}}', 'https://webzonebd.com/pay')
        .replace('{{site_link}}', 'https://webzonebd.com');
      setCustomMsgBody(preview);
    }
  }, [selectedTemplate, notifTarget]);

  const handleSendLiveWhatsAppMessage = () => {
    if (!apiKey) {
      triggerToast('❌ Error: WhatsApp API Key is empty. Please set it in WhatsApp API Integration.');
      return;
    }
    // Simulate real API sending log addition
    triggerToast(`✉️ Live message broadcast successfully sent to ${notifTarget?.number} via Meta Cloud API!`);
    setIsSendNotificationOpen(false);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Header Widget */}
      <div className={`p-6 rounded-[24px] border ${glassBg} bg-gradient-to-br from-purple-900/10 via-pink-900/5 to-transparent`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">📱 WhatsApp Service Orders Suite</h2>
            </div>
            <p className="text-xs opacity-75">
              Automated client communication, order form field engines, transaction invoices, delivery notifications, and payment alerts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${
              connectionStatus === 'connected' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
              API Status: {connectionStatus === 'connected' ? 'Connected' : 'Offline'}
            </span>
            <button 
              onClick={() => {
                setConnectionStatus(connectionStatus === 'connected' ? 'disconnected' : 'connected');
                triggerToast(connectionStatus === 'connected' ? '🔌 API Disconnected' : '⚡ Meta Cloud API Connected successfully.');
              }}
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 transition rounded-lg text-xs font-mono flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Toggle
            </button>
          </div>
        </div>

        {/* Premium Glassmorphic Navigation Bar */}
        <div className="mt-6 border-t border-slate-200/60 dark:border-white/5 pt-4">
          <div className="bg-slate-100/70 dark:bg-[#0F172A]/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 p-1.5 rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-0.5 whitespace-nowrap">
              {[
                { id: 'wa-orders', label: 'Service Orders', icon: Clipboard },
                { id: 'wa-customers', label: 'Contacts', icon: Users },
                { id: 'wa-form-settings', label: 'Form Fields', icon: FileText },
                { id: 'wa-invoice-notif', label: 'Invoices', icon: Sparkles },
                { id: 'wa-payment-reminders', label: 'Reminders', icon: CreditCard },
                { id: 'wa-delivery-updates', label: 'Deliveries', icon: Truck },
                { id: 'wa-promo-messages', label: 'Promo Messages', icon: MessageSquare },
                { id: 'wa-templates', label: 'Templates', icon: FileText },
                { id: 'wa-campaign-reports', label: 'Campaign Analytics', icon: TrendingUp },
                { id: 'wa-api-integration', label: 'API Key Settings', icon: Link },
                { id: 'wa-settings', label: 'Settings', icon: Sliders }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs font-bold transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ${
                      active 
                        ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-[0_12px_24px_rgba(124,58,237,0.35)] scale-[1.02]' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Screen Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          
          {/* TAB 1: SERVICE ORDERS LIST */}
          {activeTab === 'wa-orders' && (
            <div className={`p-6 rounded-[24px] border ${glassBg}`}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold">📋 WhatsApp Service Orders List</h3>
                  <p className="text-xs opacity-75">Customer submissions received directly via dynamic WhatsApp landing forms.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => exportCSV('orders')} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 transition rounded-xl text-xs font-semibold text-white flex items-center gap-1.5">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 rounded-xl px-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase pl-1">Bulk:</span>
                    <button onClick={() => handleBulkStatusChange('processing')} className="px-2 py-1.5 hover:text-purple-400 text-xs font-semibold">Process</button>
                    <button onClick={() => handleBulkStatusChange('completed')} className="px-2 py-1.5 hover:text-emerald-400 text-xs font-semibold">Complete</button>
                    <button onClick={() => handleBulkStatusChange('cancelled')} className="px-2 py-1.5 hover:text-rose-400 text-xs font-semibold">Cancel</button>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by customer, service or order ID..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 h-[44px] bg-neutral-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500 text-white"
                  />
                </div>

                {/* Horizontal Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'pending', label: '🟡 Pending' },
                    { id: 'processing', label: '🟣 Processing' },
                    { id: 'completed', label: '🟢 Completed' },
                    { id: 'cancelled', label: '🔴 Cancelled' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setOrderFilter(f.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 whitespace-nowrap shrink-0 ${
                        orderFilter === f.id
                          ? 'bg-purple-600/20 text-purple-400 border-purple-500/40 shadow-sm'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="text-right whitespace-nowrap shrink-0">
                  <span className="text-xs font-mono text-slate-400">Showing {orders.length} unique items</span>
                </div>
              </div>

              {/* Premium Date & Priority Tagging Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-neutral-950/40 border border-white/5 shadow-inner">
                {/* Date Filter Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Filter by Date Range</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={orderStartDate}
                      onChange={(e) => {
                        setOrderStartDate(e.target.value);
                        setOrderQuickDate('all'); // Clear quick date when custom date is set
                      }}
                      className="flex-1 px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                      title="Start Date"
                    />
                    <span className="text-slate-500 text-xs font-bold">to</span>
                    <input
                      type="date"
                      value={orderEndDate}
                      onChange={(e) => {
                        setOrderEndDate(e.target.value);
                        setOrderQuickDate('all'); // Clear quick date when custom date is set
                      }}
                      className="flex-1 px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                      title="End Date"
                    />
                    {(orderStartDate || orderEndDate) && (
                      <button 
                        type="button"
                        onClick={() => { setOrderStartDate(''); setOrderEndDate(''); }}
                        className="p-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 rounded-lg text-xs font-bold cursor-pointer"
                        title="Clear Dates"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Date Filters */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Quick Date Filter</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'all', label: 'All Time' },
                      { id: 'today', label: 'Today' },
                      { id: '7days', label: '7 Days' },
                      { id: '30days', label: '30 Days' }
                    ].map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setOrderQuickDate(q.id);
                          setOrderStartDate('');
                          setOrderEndDate('');
                        }}
                        className={`py-2 rounded-lg text-[11px] font-bold transition-all duration-300 cursor-pointer border ${
                          orderQuickDate === q.id
                            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow border-transparent'
                            : 'bg-neutral-900 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag prioritization Filter */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-pink-400" />
                    <span>Priority Tag Filter</span>
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'all', label: 'All Tags' },
                      { id: 'Urgent', label: '🚨 Urgent' },
                      { id: 'Standard', label: '⚡ Standard' },
                      { id: 'Delayed', label: '⏳ Delayed' }
                    ].map((tagObj) => (
                      <button
                        key={tagObj.id}
                        type="button"
                        onClick={() => setOrderTagFilter(tagObj.id)}
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all duration-300 shrink-0 cursor-pointer ${
                          orderTagFilter === tagObj.id
                            ? 'bg-pink-600/20 text-pink-400 border-pink-500/40 shadow-sm'
                            : 'bg-neutral-900 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tagObj.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid or Table of Orders */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 text-slate-400 text-xs uppercase font-mono border-b border-white/10">
                      <th className="p-4"><input type="checkbox" onChange={(e) => {
                        if (e.target.checked) setSelectedOrders(orders.map(o => o.id));
                        else setSelectedOrders([]);
                      }} /></th>
                      <th className="p-4">Order ID / Date</th>
                      <th className="p-4">Customer Name & WhatsApp</th>
                      <th className="p-4">Service Package</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Priority Tag</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => orderFilter === 'all' || o.status === orderFilter)
                      .filter(o => orderTagFilter === 'all' || o.tag === orderTagFilter)
                      .filter(o => 
                        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.serviceName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.id.toLowerCase().includes(orderSearch.toLowerCase())
                      )
                      .filter(o => {
                        // Date filters
                        if (!orderStartDate && !orderEndDate && orderQuickDate === 'all') return true;
                        
                        const oDate = new Date(o.date);
                        oDate.setHours(0,0,0,0);
                        
                        // Handle quick filters
                        if (orderQuickDate !== 'all') {
                          const today = new Date();
                          today.setHours(0,0,0,0);
                          
                          const orderTime = new Date(o.date);
                          orderTime.setHours(0,0,0,0);
                          
                          const diffTime = today.getTime() - orderTime.getTime();
                          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                          
                          if (orderQuickDate === 'today') {
                            const todayStr = new Date().toISOString().split('T')[0];
                            return o.date === todayStr;
                          }
                          if (orderQuickDate === '7days') return diffDays >= 0 && diffDays <= 7;
                          if (orderQuickDate === '30days') return diffDays >= 0 && diffDays <= 30;
                        }

                        // Handle range selection
                        if (orderStartDate) {
                          const start = new Date(orderStartDate);
                          start.setHours(0,0,0,0);
                          if (oDate < start) return false;
                        }
                        if (orderEndDate) {
                          const end = new Date(orderEndDate);
                          end.setHours(23,59,59,999);
                          if (oDate > end) return false;
                        }
                        return true;
                      })
                      .map((o) => (
                        <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] text-xs">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(o.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedOrders([...selectedOrders, o.id]);
                                else setSelectedOrders(selectedOrders.filter(id => id !== o.id));
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-purple-400 font-bold block">{o.id}</span>
                            <span className="opacity-50 text-[10px]">{o.date}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold block">{o.customerName}</span>
                            <span className="font-mono text-emerald-400">{o.whatsappNumber}</span>
                          </td>
                          <td className="p-4 font-medium">{o.serviceName}</td>
                          <td className="p-4 font-mono font-bold text-pink-400">${o.price}</td>
                          <td className="p-4">
                            <select
                              value={o.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                const updated = orders.map(ord => ord.id === o.id ? { ...ord, status: newStatus } : ord);
                                setOrders(updated);
                                triggerToast(`✅ Order ${o.id} status updated to ${newStatus.toUpperCase()}`);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 ${
                                o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' :
                                o.status === 'processing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20' :
                                o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20' :
                                'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                              }`}
                            >
                              <option value="pending" className="bg-[#0F172A] text-yellow-400 font-bold">⏳ PENDING</option>
                              <option value="processing" className="bg-[#0F172A] text-purple-400 font-bold">⚙️ PROCESSING</option>
                              <option value="completed" className="bg-[#0F172A] text-emerald-400 font-bold">✅ COMPLETED</option>
                              <option value="cancelled" className="bg-[#0F172A] text-rose-400 font-bold">❌ CANCELLED</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <select
                              value={o.tag || 'Standard'}
                              onChange={(e) => {
                                const updated = orders.map(ord => ord.id === o.id ? { ...ord, tag: e.target.value as any } : ord);
                                setOrders(updated);
                                triggerToast(`🏷️ Tag updated for order ${o.id} to ${e.target.value}`);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 ${
                                o.tag === 'Urgent' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                                o.tag === 'Delayed' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                                'bg-slate-500/15 text-slate-400 border-slate-500/30'
                              }`}
                            >
                              <option value="Urgent" className="bg-[#0F172A] text-rose-400 font-bold">🚨 Urgent</option>
                              <option value="Standard" className="bg-[#0F172A] text-slate-300 font-bold">⚡ Standard</option>
                              <option value="Delayed" className="bg-[#0F172A] text-amber-400 font-bold">⏳ Delayed</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setViewingOrder(o)}
                                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all duration-200"
                                title="View Order Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {(() => {
                                let label = 'Draft Msg';
                                let templateKey = 'order_confirmation';
                                let btnColor = 'bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30';
                                
                                if (o.status === 'pending') {
                                  label = 'Confirm Order';
                                  templateKey = 'order_confirmation';
                                  btnColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20';
                                } else if (o.status === 'processing') {
                                  label = 'Project Update';
                                  templateKey = 'service_progress_update';
                                  btnColor = 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20';
                                } else if (o.status === 'completed') {
                                  label = 'Delivery Update';
                                  templateKey = 'service_progress_update';
                                  btnColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20';
                                } else if (o.status === 'cancelled') {
                                  label = 'Welcome Ping';
                                  templateKey = 'welcome_message';
                                  btnColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20';
                                }

                                return (
                                  <button
                                    onClick={() => triggerNotificationModal(o.customerName, o.whatsappNumber, templateKey, o.id, o)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm ${btnColor}`}
                                    title={`⚡ Dispatch ${label} using pre-approved template`}
                                  >
                                    <Send className="w-2.5 h-2.5" />
                                    <span>{label}</span>
                                  </button>
                                );
                              })()}
                              <button
                                onClick={() => {
                                  setOrders(orders.filter(item => item.id !== o.id));
                                  triggerToast(`🗑️ Removed order ${o.id}`);
                                }}
                                className="p-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 rounded-lg transition-all duration-200"
                                title="Delete Order"
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
          )}

          {/* TAB 2: CUSTOMER WHATSAPP LIST (Google Contacts Premium Workspace) */}
          {activeTab === 'wa-customers' && (
            <div className="space-y-6">
              
              {/* Smart Scan / Duplicate Merge Alert Banner */}
              {(() => {
                // Find duplicate phone numbers
                const numbers = contacts.map(c => c.whatsappNumber.trim());
                const duplicates = contacts.filter((c, i) => numbers.indexOf(c.whatsappNumber.trim()) !== i);
                if (duplicates.length === 0) return null;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gradient-to-r from-purple-900/40 via-purple-950/20 to-pink-900/40 border border-purple-500/20 rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          💡 Smart Clean-up Recommendation
                          <span className="text-[10px] bg-purple-500/35 px-2 py-0.5 rounded-full font-mono font-bold text-white uppercase animate-pulse">Scan Complete</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Found {duplicates.length} duplicate client records sharing identical WhatsApp numbers. We suggest merging them to combine notes, star states, and order logs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => {
                          // Inject a mock duplicate for test
                          const dupNum = '+8801712345678'; // Imran's number
                          const newDup: CustomerContact = {
                            id: `C-DUP-${Math.floor(Math.random() * 900 + 100)}`,
                            name: 'Imran Hasan (Redundant)',
                            whatsappNumber: dupNum,
                            isVerified: false,
                            status: 'active',
                            group: 'Regular',
                            email: 'imran.hasan.temp@gmail.com',
                            notes: 'Created duplicate for checkout test.',
                            company: 'WebzoneBD Temp',
                            jobTitle: 'Junior dev'
                          };
                          setContacts([...contacts, newDup]);
                          triggerToast('👤 Redundant contact added! Merging banner is active.');
                        }}
                        className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] text-slate-300 font-bold rounded-xl transition"
                      >
                        Add Test Duplicate
                      </button>
                      <button 
                        onClick={() => {
                          const uniqueMap: { [num: string]: CustomerContact } = {};
                          contacts.forEach(c => {
                            const trimmed = c.whatsappNumber.trim();
                            if (!uniqueMap[trimmed]) {
                              uniqueMap[trimmed] = { ...c };
                            } else {
                              const existing = uniqueMap[trimmed];
                              existing.starred = existing.starred || c.starred;
                              existing.isVerified = existing.isVerified || c.isVerified;
                              if (c.notes && c.notes !== existing.notes) {
                                existing.notes = `${existing.notes}\n[Merged Note]: ${c.notes}`;
                              }
                              if (!existing.jobTitle) existing.jobTitle = c.jobTitle;
                              if (!existing.company) existing.company = c.company;
                              if (!existing.address) existing.address = c.address;
                              if (existing.email === 'n/a' && c.email !== 'n/a') existing.email = c.email;
                            }
                          });
                          const merged = Object.values(uniqueMap);
                          setContacts(merged);
                          setSelectedContactIds([]);
                          triggerToast('✨ Successfully merged duplicates! consolidated communications.');
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-xs font-bold text-white rounded-xl shadow-lg shadow-purple-500/20 transition"
                      >
                        Merge Duplicates ({duplicates.length})
                      </button>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Master Layout */}
              <div className="flex flex-col xl:flex-row gap-6">
                
                {/* 1. Google Contacts left sidebar navigation */}
                <div className="w-full xl:w-64 shrink-0 space-y-4">
                  <div className={`p-5 rounded-[24px] border ${glassBg} space-y-4`}>
                    <button 
                      onClick={() => setIsAddContactOpen(true)}
                      className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:scale-[1.02] active:scale-[0.98] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" /> Create Contact
                    </button>

                    <div className="h-px bg-white/5 my-2" />

                    <div className="space-y-1">
                      {[
                        { id: 'all', label: 'All contacts', icon: Users, count: contacts.length },
                        { id: 'starred', label: 'Starred contacts', icon: Star, count: contacts.filter(c => c.starred).length },
                        { id: 'verified', label: 'Verified directory', icon: Shield, count: contacts.filter(c => c.isVerified).length },
                        { id: 'active', label: 'Active clients', icon: CheckCircle2, count: contacts.filter(c => c.status === 'active').length },
                        { id: 'inactive', label: 'Inactive list', icon: AlertCircle, count: contacts.filter(c => c.status === 'inactive').length },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        const isCurrent = contactFilter === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setContactFilter(item.id);
                              setSelectedContactIds([]);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-300 ${
                              isCurrent
                                ? 'bg-purple-600/15 border border-purple-500/20 text-purple-300'
                                : 'hover:bg-white/5 border border-transparent text-slate-300 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <IconComponent className={`w-4 h-4 ${isCurrent ? 'text-purple-400' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-white/5 text-slate-400 rounded-full">
                              {item.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="h-px bg-white/5 my-2" />

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-3 pb-1">Group Labels</p>
                      {[
                        { id: 'VIP Customers', label: 'VIP Customers', count: contacts.filter(c => c.group === 'VIP Customers').length, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                        { id: 'Corporate Clients', label: 'Corporate Clients', count: contacts.filter(c => c.group === 'Corporate Clients').length, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
                        { id: 'Regular', label: 'Regular Group', count: contacts.filter(c => c.group === 'Regular').length, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                      ].map((item) => {
                        const isCurrent = contactFilter === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setContactFilter(item.id);
                              setSelectedContactIds([]);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-300 ${
                              isCurrent
                                ? 'bg-purple-600/15 border border-purple-500/20 text-purple-300'
                                : 'hover:bg-white/5 border border-transparent text-slate-300 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-500" />
                              <span>{item.label}</span>
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-900 text-slate-400 rounded">
                              {item.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Google Sandbox trigger option to quickly demo */}
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl text-[10px] text-slate-400">
                      <span className="font-semibold block text-slate-300 mb-1">💡 Interactive Playground</span>
                      You can multi-select rows in the table to trigger batch actions or click rows to open slide drawers.
                    </div>
                  </div>
                </div>

                {/* 2. Right Workspace (Google Contacts Table) */}
                <div className="flex-1 space-y-4 min-w-0">
                  
                  {/* Action Bar */}
                  <div className={`p-4 rounded-[20px] border ${glassBg} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name, job title, company, number..."
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        className="w-full pl-10 pr-4 h-[44px] bg-neutral-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500 text-white font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button 
                        onClick={() => {
                          const mockUser: CustomerContact = {
                            id: `C-${Math.floor(Math.random() * 900 + 100)}`,
                            name: 'Google Workspace Client',
                            whatsappNumber: `+8801700${Math.floor(Math.random() * 900000 + 100000)}`,
                            isVerified: true,
                            status: 'active',
                            group: 'Corporate Clients',
                            email: 'partner@google-workspace.com',
                            starred: false,
                            jobTitle: 'Account Specialist',
                            company: 'Google Cloud BD',
                            address: 'California, US',
                            notes: 'Imported via bulk cloud sync.'
                          };
                          setContacts([...contacts, mockUser]);
                          triggerToast('📥 Imported a new cloud-synced customer contact!');
                        }}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                        title="Import simulated CSV or Google Workspace directory"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Import Sync
                      </button>
                      <button onClick={() => exportCSV('contacts')} className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 transition rounded-xl text-xs font-semibold text-white flex items-center gap-1.5">
                        <Download className="w-4 h-4" /> Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Bulk Actions Floating Ribbon */}
                  <AnimatePresence>
                    {selectedContactIds.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="p-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-[20px] shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-4 font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-white/20 text-white font-mono text-xs font-black rounded-full flex items-center justify-center border border-white/10">
                            {selectedContactIds.length}
                          </span>
                          <div>
                            <p className="text-xs font-bold font-sans">Batch Selection Active</p>
                            <p className="text-[10px] text-white/80">Trigger bulk operations across selected contacts</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = contacts.map(c => {
                                if (selectedContactIds.includes(c.id)) {
                                  return { ...c, starred: true };
                                }
                                return c;
                              });
                              setContacts(updated);
                              triggerToast(`⭐️ Starred ${selectedContactIds.length} customer contacts.`);
                            }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Star className="w-3.5 h-3.5 fill-white text-white" /> Star
                          </button>
                          
                          <button
                            onClick={() => {
                              const updated = contacts.map(c => {
                                if (selectedContactIds.includes(c.id)) {
                                  return { ...c, starred: false };
                                }
                                return c;
                              });
                              setContacts(updated);
                              triggerToast(`☆ Unstarred ${selectedContactIds.length} customer contacts.`);
                            }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Star className="w-3.5 h-3.5 text-white" /> Unstar
                          </button>

                          {/* Move Group Dropdown Button */}
                          <div className="relative group/btn">
                            <span className="px-3 py-1.5 bg-white/10 group-hover/btn:bg-white/20 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition">
                              🏷️ Move Group
                            </span>
                            <div className="absolute bottom-full right-0 mb-1 hidden group-hover/btn:block bg-neutral-900 border border-white/10 p-1.5 rounded-xl shadow-xl w-40 z-20">
                              {['Regular', 'VIP Customers', 'Corporate Clients'].map(grp => (
                                <button
                                  key={grp}
                                  onClick={() => {
                                    const updated = contacts.map(c => {
                                      if (selectedContactIds.includes(c.id)) {
                                        return { ...c, group: grp };
                                      }
                                      return c;
                                    });
                                    setContacts(updated);
                                    setSelectedContactIds([]);
                                    triggerToast(`🏷️ Moved selected contacts to "${grp}" group.`);
                                  }}
                                  className="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-white/10 hover:text-white rounded"
                                >
                                  {grp}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              // We pick the first contact to launch campaign ping, or trigger broadcast toast
                              const firstSelected = contacts.find(c => selectedContactIds.includes(c.id));
                              if (firstSelected) {
                                triggerNotificationModal(firstSelected.name, firstSelected.whatsappNumber, 'promotional_campaign', firstSelected.id);
                                triggerToast(`📣 Prepared broadcast marketing templates for ${selectedContactIds.length} contacts.`);
                              }
                            }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Send className="w-3.5 h-3.5 text-white" /> Bulk Template
                          </button>

                          <button
                            onClick={() => {
                              const updated = contacts.filter(c => !selectedContactIds.includes(c.id));
                              setContacts(updated);
                              setSelectedContactIds([]);
                              triggerToast(`🗑️ Deleted ${selectedContactIds.length} customer contacts from local database.`);
                            }}
                            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>

                          <button
                            onClick={() => setSelectedContactIds([])}
                            className="p-1 hover:bg-white/10 rounded-lg"
                            title="Deselect All"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Google Contacts List Table Container */}
                  <div className={`rounded-[24px] border ${glassBg} overflow-hidden`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="p-4 w-12 text-center">
                              <input 
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/20 accent-purple-600 cursor-pointer"
                                checked={(() => {
                                  // filter contacts displayed
                                  const displayed = contacts.filter(c => {
                                    if (contactFilter === 'all') return true;
                                    if (contactFilter === 'starred') return c.starred;
                                    if (contactFilter === 'verified') return c.isVerified;
                                    if (contactFilter === 'unverified') return !c.isVerified;
                                    if (contactFilter === 'active') return c.status === 'active';
                                    if (contactFilter === 'inactive') return c.status === 'inactive';
                                    return c.group === contactFilter;
                                  }).filter(c => 
                                    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                                    c.whatsappNumber.includes(contactSearch) ||
                                    c.email.toLowerCase().includes(contactSearch.toLowerCase())
                                  );
                                  return displayed.length > 0 && displayed.every(c => selectedContactIds.includes(c.id));
                                })()}
                                onChange={(e) => {
                                  const displayed = contacts.filter(c => {
                                    if (contactFilter === 'all') return true;
                                    if (contactFilter === 'starred') return c.starred;
                                    if (contactFilter === 'verified') return c.isVerified;
                                    if (contactFilter === 'unverified') return !c.isVerified;
                                    if (contactFilter === 'active') return c.status === 'active';
                                    if (contactFilter === 'inactive') return c.status === 'inactive';
                                    return c.group === contactFilter;
                                  }).filter(c => 
                                    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                                    c.whatsappNumber.includes(contactSearch) ||
                                    c.email.toLowerCase().includes(contactSearch.toLowerCase())
                                  );

                                  if (e.target.checked) {
                                    setSelectedContactIds(Array.from(new Set([...selectedContactIds, ...displayed.map(c => c.id)])));
                                  } else {
                                    setSelectedContactIds(selectedContactIds.filter(id => !displayed.map(c => c.id).includes(id)));
                                  }
                                }}
                              />
                            </th>
                            <th className="p-4 w-8"></th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name & Business Info</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Number</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Group Label</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(() => {
                            const filteredList = contacts
                              .filter(c => {
                                if (contactFilter === 'all') return true;
                                if (contactFilter === 'starred') return c.starred;
                                if (contactFilter === 'verified') return c.isVerified;
                                if (contactFilter === 'unverified') return !c.isVerified;
                                if (contactFilter === 'active') return c.status === 'active';
                                if (contactFilter === 'inactive') return c.status === 'inactive';
                                return c.group === contactFilter;
                              })
                              .filter(c => 
                                c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                                c.whatsappNumber.includes(contactSearch) ||
                                c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
                                (c.company && c.company.toLowerCase().includes(contactSearch.toLowerCase())) ||
                                (c.jobTitle && c.jobTitle.toLowerCase().includes(contactSearch.toLowerCase()))
                              );

                            if (filteredList.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={8} className="p-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <Users className="w-8 h-8 text-slate-600 animate-bounce" />
                                      <p className="text-sm font-bold">No Contacts Found</p>
                                      <p className="text-xs opacity-70">Adjust your search parameters or select a different sidebar label.</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }

                            return filteredList.map((c) => {
                              const isChecked = selectedContactIds.includes(c.id);
                              
                              // Generate randomized premium gradient color presets for client initials
                              const charCode = c.name.charCodeAt(0) || 65;
                              const presets = [
                                'from-purple-600 to-pink-500',
                                'from-cyan-500 to-blue-600',
                                'from-emerald-500 to-teal-600',
                                'from-pink-500 to-rose-500',
                                'from-indigo-600 to-violet-500',
                                'from-amber-500 to-orange-600'
                              ];
                              const gradientClass = presets[charCode % presets.length];

                              return (
                                <tr 
                                  key={c.id} 
                                  onClick={() => {
                                    setSelectedContactDetail(c);
                                    setIsEditingDetail(false);
                                    setDetailForm({ ...c });
                                  }}
                                  className={`hover:bg-white/[0.02] cursor-pointer group transition-all duration-150 ${isChecked ? 'bg-purple-600/5' : ''}`}
                                >
                                  {/* Checkbox column */}
                                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-white/20 accent-purple-600 cursor-pointer"
                                      checked={isChecked}
                                      onChange={() => {
                                        if (isChecked) {
                                          setSelectedContactIds(selectedContactIds.filter(id => id !== c.id));
                                        } else {
                                          setSelectedContactIds([...selectedContactIds, c.id]);
                                        }
                                      }}
                                    />
                                  </td>

                                  {/* Star indicator */}
                                  <td className="p-4" onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = contacts.map(item => {
                                      if (item.id === c.id) {
                                        return { ...item, starred: !item.starred };
                                      }
                                      return item;
                                    });
                                    setContacts(updated);
                                    triggerToast(c.starred ? `☆ Removed ${c.name} from starred list.` : `⭐️ Marked ${c.name} as Starred.`);
                                  }}>
                                    <button className="p-1 hover:bg-white/10 rounded-full transition">
                                      <Star className={`w-4 h-4 ${c.starred ? 'fill-amber-400 text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                    </button>
                                  </td>

                                  {/* Name & Avatar bubble with business subtext */}
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center font-bold text-xs text-white uppercase shadow`}>
                                        {c.name.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                                          <span>{c.name}</span>
                                          {c.isVerified && (
                                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1 rounded font-bold font-mono">✓ Verified</span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                          {c.jobTitle ? (
                                            <>
                                              <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                                              <span>{c.jobTitle}</span>
                                            </>
                                          ) : (
                                            <span>Client Portal</span>
                                          )}
                                          {c.company && (
                                            <>
                                              <span className="text-slate-600">•</span>
                                              <Building className="w-3 h-3 text-slate-500 shrink-0" />
                                              <span className="truncate max-w-[120px]">{c.company}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Phone/WhatsApp Number */}
                                  <td className="p-4">
                                    <div className="flex items-center gap-1.5 font-mono text-xs text-slate-200">
                                      <span className="text-emerald-400 text-[10px]">🟢</span>
                                      <span>{c.whatsappNumber}</span>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(c.whatsappNumber);
                                          triggerToast('📋 Copied phone number to clipboard.');
                                        }}
                                        className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition"
                                        title="Copy number"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Email */}
                                  <td className="p-4">
                                    <span className="text-xs text-slate-300">{c.email}</span>
                                  </td>

                                  {/* Group classification tags */}
                                  <td className="p-4">
                                    {(() => {
                                      let tagColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                                      if (c.group === 'VIP Customers') tagColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                      if (c.group === 'Corporate Clients') tagColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
                                      return (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tagColor} font-semibold`}>
                                          {c.group}
                                        </span>
                                      );
                                    })()}
                                  </td>

                                  {/* Active Status column */}
                                  <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${c.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                      {c.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>

                                  {/* Action Trigger Buttons */}
                                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => triggerNotificationModal(c.name, c.whatsappNumber, 'welcome_message', c.id)}
                                        className="p-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg text-xs font-bold transition"
                                        title="Send WhatsApp Ping"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedContactDetail(c);
                                          setIsEditingDetail(true);
                                          setDetailForm({ ...c });
                                        }}
                                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-slate-300 rounded-lg text-xs"
                                        title="Edit Contact"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setContacts(contacts.filter(item => item.id !== c.id));
                                          triggerToast(`🗑️ Deleted customer contact "${c.name}"`);
                                        }}
                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 rounded-lg text-xs"
                                        title="Delete Contact"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Detailed Slide-over Drawer / Card Panel */}
              <AnimatePresence>
                {selectedContactDetail && (
                  <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
                    {/* Background overlay closer */}
                    <div className="absolute inset-0 cursor-default" onClick={() => setSelectedContactDetail(null)} />
                    
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                      className="relative w-full max-w-lg h-full bg-slate-950 border-l border-white/10 shadow-2xl overflow-y-auto flex flex-col z-10"
                    >
                      {/* Top ribbon header details */}
                      <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="text-purple-400 w-5 h-5" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Google Contacts Card</span>
                        </div>
                        <button 
                          onClick={() => setSelectedContactDetail(null)}
                          className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Main Profile Header Section */}
                      <div className="p-6 text-center bg-gradient-to-b from-purple-950/20 to-transparent flex flex-col items-center border-b border-white/5 relative">
                        {/* Star Button */}
                        <button 
                          onClick={() => {
                            const isStarredNow = !selectedContactDetail.starred;
                            const updated = contacts.map(item => {
                              if (item.id === selectedContactDetail.id) {
                                return { ...item, starred: isStarredNow };
                              }
                              return item;
                            });
                            setContacts(updated);
                            const updatedObj = { ...selectedContactDetail, starred: isStarredNow };
                            setSelectedContactDetail(updatedObj);
                            setDetailForm(updatedObj);
                            triggerToast(isStarredNow ? '⭐️ Starred contact.' : '☆ Unstarred contact.');
                          }}
                          className="absolute right-6 top-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition"
                          title="Star Contact"
                        >
                          <Star className={`w-5 h-5 ${selectedContactDetail.starred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                        </button>

                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-2xl text-white uppercase shadow-lg shadow-purple-500/20 mb-3 border border-white/10">
                          {selectedContactDetail.name.charAt(0)}
                        </div>

                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                          {selectedContactDetail.name}
                          {selectedContactDetail.isVerified && (
                            <span className="text-[10px] bg-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Verified</span>
                          )}
                        </h3>

                        <p className="text-xs text-slate-300 mt-1 font-semibold flex items-center gap-1.5">
                          {selectedContactDetail.jobTitle || 'Business Client'} 
                          {selectedContactDetail.company && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-purple-400">{selectedContactDetail.company}</span>
                            </>
                          )}
                        </p>

                        <div className="flex gap-2.5 mt-5">
                          <a 
                            href={`https://wa.me/${selectedContactDetail.whatsappNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                          >
                            <Send className="w-3.5 h-3.5" /> Direct WhatsApp
                          </a>
                          <button 
                            onClick={() => triggerNotificationModal(selectedContactDetail.name, selectedContactDetail.whatsappNumber, 'welcome_message', selectedContactDetail.id)}
                            className="px-3.5 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-xl text-xs font-bold transition"
                          >
                            Send Ping Code
                          </button>
                          <button 
                            onClick={() => exportSingleContactCSV(selectedContactDetail)}
                            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/5"
                            title="Export Contact and CRM History as CSV"
                          >
                            <Download className="w-3.5 h-3.5 text-purple-400" /> Export CSV
                          </button>
                        </div>
                      </div>

                      {/* Content Form Block */}
                      <div className="p-6 flex-1 space-y-6">
                        
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <h4 className="text-xs font-bold tracking-widest uppercase text-purple-400">Contact Specifications</h4>
                          <button 
                            onClick={() => setIsEditingDetail(!isEditingDetail)}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-bold text-slate-300 flex items-center gap-1 transition"
                          >
                            <Edit3 className="w-3 h-3 text-purple-400" /> {isEditingDetail ? 'Cancel Edit' : 'Edit Fields'}
                          </button>
                        </div>

                        {isEditingDetail ? (
                          // Editable details form
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Full Name</label>
                              <input 
                                type="text"
                                value={detailForm.name || ''}
                                onChange={(e) => setDetailForm({ ...detailForm, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">WhatsApp</label>
                                <input 
                                  type="text"
                                  value={detailForm.whatsappNumber || ''}
                                  onChange={(e) => setDetailForm({ ...detailForm, whatsappNumber: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Email</label>
                                <input 
                                  type="email"
                                  value={detailForm.email || ''}
                                  onChange={(e) => setDetailForm({ ...detailForm, email: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Company</label>
                                <input 
                                  type="text"
                                  value={detailForm.company || ''}
                                  onChange={(e) => setDetailForm({ ...detailForm, company: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Job Title</label>
                                <input 
                                  type="text"
                                  value={detailForm.jobTitle || ''}
                                  onChange={(e) => setDetailForm({ ...detailForm, jobTitle: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Group Classification</label>
                                <select
                                  value={detailForm.group || 'Regular'}
                                  onChange={(e) => setDetailForm({ ...detailForm, group: e.target.value })}
                                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                                >
                                  <option value="Regular">Regular Group</option>
                                  <option value="VIP Customers">VIP Customers</option>
                                  <option value="Corporate Clients">Corporate Clients</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">System Status</label>
                                <select
                                  value={detailForm.status || 'active'}
                                  onChange={(e) => setDetailForm({ ...detailForm, status: e.target.value as 'active' | 'inactive' })}
                                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                                >
                                  <option value="active">Active Subscriber</option>
                                  <option value="inactive">Inactive Subscriber</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Address / Location</label>
                              <input 
                                type="text"
                                value={detailForm.address || ''}
                                onChange={(e) => setDetailForm({ ...detailForm, address: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Interactive Log Notes</label>
                              <textarea 
                                value={detailForm.notes || ''}
                                onChange={(e) => setDetailForm({ ...detailForm, notes: e.target.value })}
                                rows={3}
                                className="w-full p-3 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-y min-h-[100px]"
                                placeholder="Add logs of meetings, custom configuration needs, or communication notes..."
                              />
                            </div>

                            <button
                              onClick={() => {
                                const updated = contacts.map(item => {
                                  if (item.id === selectedContactDetail.id) {
                                    return { 
                                      ...item, 
                                      name: detailForm.name || item.name,
                                      whatsappNumber: detailForm.whatsappNumber || item.whatsappNumber,
                                      email: detailForm.email || item.email,
                                      group: detailForm.group || item.group,
                                      status: detailForm.status || item.status,
                                      company: detailForm.company || '',
                                      jobTitle: detailForm.jobTitle || '',
                                      address: detailForm.address || '',
                                      notes: detailForm.notes || ''
                                    };
                                  }
                                  return item;
                                });
                                setContacts(updated);
                                setSelectedContactDetail({
                                  ...selectedContactDetail,
                                  ...detailForm
                                } as CustomerContact);
                                setIsEditingDetail(false);
                                triggerToast('✨ Customer WhatsApp record saved successfully.');
                              }}
                              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white rounded-xl shadow-md"
                            >
                              Save Client Profile
                            </button>
                          </div>
                        ) : (
                          // Standard beautiful Read-only layout
                          <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] text-slate-500 font-mono uppercase block">Phone / WhatsApp</span>
                                <span className="font-mono text-slate-200">{selectedContactDetail.whatsappNumber}</span>
                              </div>
                              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] text-slate-500 font-mono uppercase block">Email Address</span>
                                <span className="text-slate-200 truncate block">{selectedContactDetail.email}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] text-slate-500 font-mono uppercase block">Group Classification</span>
                                <span className="font-bold text-purple-400">{selectedContactDetail.group}</span>
                              </div>
                              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] text-slate-500 font-mono uppercase block">Physical Address</span>
                                <span className="text-slate-200">{selectedContactDetail.address || 'n/a'}</span>
                              </div>
                            </div>

                            {selectedContactDetail.notes && (
                              <div className="p-4 bg-purple-900/10 border border-purple-500/10 rounded-2xl space-y-1.5">
                                <span className="text-[10px] text-purple-400 font-mono uppercase block">CRM Log Notes</span>
                                <p className="text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{selectedContactDetail.notes}</p>
                              </div>
                            )}

                            {/* 4. Connected Orders History (Enterprise sync!) */}
                            <div className="pt-4 border-t border-white/5">
                              <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 flex items-center gap-1">
                                <Clipboard className="w-3.5 h-3.5 text-purple-400" />
                                Linked WhatsApp Service Orders
                              </h5>

                              {(() => {
                                // Match order by customer name or whatsapp number
                                const userOrders = orders.filter(o => 
                                  o.whatsappNumber.trim() === selectedContactDetail.whatsappNumber.trim() ||
                                  o.customerName.toLowerCase() === selectedContactDetail.name.toLowerCase()
                                );

                                if (userOrders.length === 0) {
                                  return (
                                    <div className="p-4 bg-white/[0.01] border border-dashed border-white/5 rounded-xl text-center text-slate-400">
                                      No current active service orders mapped for this contact.
                                    </div>
                                  );
                                }

                                return (
                                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-4">
                                    {userOrders.map(order => (
                                      <div key={order.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition">
                                        <div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-[10px] text-purple-400 font-bold">{order.id}</span>
                                            <span className="font-bold text-slate-200">{order.serviceName}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 mt-0.5">
                                            Ordered: {order.date} • Price: ${order.price}
                                          </div>
                                        </div>
                                        <div>
                                          {(() => {
                                            let color = 'bg-slate-500/20 text-slate-400';
                                            if (order.status === 'processing') color = 'bg-blue-500/20 text-blue-400';
                                            if (order.status === 'completed') color = 'bg-emerald-500/20 text-emerald-400';
                                            if (order.status === 'cancelled') color = 'bg-rose-500/20 text-rose-400';
                                            return (
                                              <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${color}`}>
                                                {order.status}
                                              </span>
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* 5. Connected Support Tickets / Inquiries (CRM system!) */}
                            <div className="pt-4 border-t border-white/5">
                              <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
                                Active Tickets & Inquiries
                              </h5>

                              {(() => {
                                const userTickets = tickets.filter(t => t.contactId === selectedContactDetail.id);

                                if (userTickets.length === 0) {
                                  return (
                                    <div className="p-4 bg-white/[0.01] border border-dashed border-white/5 rounded-xl text-center text-slate-400 mb-4">
                                      No support tickets or inquiries logged for this contact.
                                    </div>
                                  );
                                }

                                return (
                                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-4">
                                    {userTickets.map(ticket => (
                                      <div key={ticket.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                          <div>
                                            <span className="font-mono text-[9px] text-pink-400 font-bold block">{ticket.id} • {ticket.createdDate}</span>
                                            <p className="font-semibold text-slate-200 mt-0.5">{ticket.subject}</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          {/* Status badge */}
                                          {(() => {
                                            let color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                                            if (ticket.status === 'pending') color = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                            if (ticket.status === 'resolved') color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                                            return (
                                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${color}`}>
                                                Status: {ticket.status.toUpperCase()}
                                              </span>
                                            );
                                          })()}
                                          {/* Priority badge */}
                                          {(() => {
                                            let color = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                                            if (ticket.priority === 'medium') color = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                            if (ticket.priority === 'high') color = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                                            return (
                                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${color}`}>
                                                Priority: {ticket.priority.toUpperCase()}
                                              </span>
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}

                              {/* Create/Log Support Ticket Subform */}
                              <div className="mt-4 p-4 bg-purple-950/10 border border-purple-500/10 rounded-2xl space-y-3">
                                <span className="text-[10px] text-purple-400 font-mono font-bold uppercase block">Log Support Ticket / Inquiry</span>
                                <div>
                                  <input 
                                    type="text"
                                    placeholder="Enter ticket subject or customer inquiry..."
                                    value={newTicketSubject}
                                    onChange={(e) => setNewTicketSubject(e.target.value)}
                                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                                  />
                                </div>
                                <div className="flex items-center justify-between gap-2.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-mono">Priority:</span>
                                    <select
                                      value={newTicketPriority}
                                      onChange={(e) => setNewTicketPriority(e.target.value as 'low' | 'medium' | 'high')}
                                      className="px-2 py-1 bg-neutral-900 border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                                    >
                                      <option value="low">Low</option>
                                      <option value="medium">Medium</option>
                                      <option value="high">High</option>
                                    </select>
                                  </div>
                                  <button
                                    onClick={() => {
                                      if (!newTicketSubject.trim()) {
                                        triggerToast('⚠️ Please enter a ticket subject.');
                                        return;
                                      }
                                      const tId = `TKT-${100 + tickets.length + 1}`;
                                      const newT: CrmTicket = {
                                        id: tId,
                                        contactId: selectedContactDetail.id,
                                        subject: newTicketSubject,
                                        status: 'open',
                                        priority: newTicketPriority,
                                        createdDate: new Date().toISOString().split('T')[0]
                                      };
                                      setTickets([...tickets, newT]);
                                      setNewTicketSubject('');
                                      triggerToast(`✨ Successfully logged CRM ticket "${tId}"!`);
                                    }}
                                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-[11px] font-bold text-white rounded-lg transition"
                                  >
                                    Create Ticket
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Sticky Footer */}
                      <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setContacts(contacts.filter(item => item.id !== selectedContactDetail.id));
                            setSelectedContactDetail(null);
                            triggerToast(`🗑️ Deleted customer contact "${selectedContactDetail.name}"`);
                          }}
                          className="px-3.5 py-2 hover:bg-rose-600/15 text-rose-400 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Record
                        </button>
                        <button 
                          onClick={() => setSelectedContactDetail(null)}
                          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition"
                        >
                          Close Card
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 3: ORDER FORM FIELD SETTINGS */}
          {activeTab === 'wa-form-settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Form Builder Panel */}
              <div className={`p-6 rounded-[24px] border ${glassBg}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold">📝 WhatsApp Order Form Builder</h3>
                    <p className="text-xs opacity-75">Modify custom fields clients must fill out when ordering.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddFieldOpen(true)}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Field
                  </button>
                </div>

                <div className="space-y-3">
                  {formFields.map((field, idx) => (
                    <div key={field.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-neutral-900 text-[10px] font-mono flex items-center justify-center border border-white/10 text-slate-400">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{field.label}</span>
                            {field.required && (
                              <span className="text-[9px] bg-red-500/15 text-red-400 px-1 rounded">Required</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Type: <span className="font-mono text-purple-400">{field.type}</span> • Placeholder: {field.placeholder}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFormFields(formFields.filter(f => f.id !== field.id));
                          triggerToast('🗑️ Field removed from form.');
                        }}
                        className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/30 rounded"
                        title="Remove Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview Form & Form Templates */}
              <div className="space-y-6">
                <div className={`p-6 rounded-[24px] border ${glassBg} bg-gradient-to-br from-neutral-950 to-neutral-900`}>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-4 text-purple-400">📱 WhatsApp Form Preview</h3>
                  
                  <div className="space-y-4">
                    {formFields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-xs font-semibold mb-1 text-slate-300">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            disabled
                            placeholder={field.placeholder}
                            className="w-full p-2.5 rounded-lg text-xs bg-neutral-900 border border-white/10 text-slate-400 focus:outline-none"
                            rows={3}
                          />
                        ) : (
                          <input
                            type={field.type}
                            disabled
                            placeholder={field.placeholder}
                            className="w-full p-2.5 rounded-lg text-xs bg-neutral-900 border border-white/10 text-slate-400 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}

                    <button disabled className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-xs font-bold text-white opacity-70">
                      Submit & Process Order via WhatsApp
                    </button>
                  </div>
                </div>

                {/* Template Preset Selector */}
                <div className={`p-6 rounded-[24px] border ${glassBg}`}>
                  <h3 className="font-bold text-xs tracking-wider uppercase mb-2">⚡ Form Presets Templates</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setFormFields([
                          { id: 'F-1', label: 'Business Domain', type: 'text', placeholder: 'e.g. smartdeal.com', required: true },
                          { id: 'F-2', label: 'Preferred Color Theme', type: 'text', placeholder: 'e.g. Purple & White', required: false },
                          { id: 'F-3', label: 'Hosting Logins', type: 'textarea', placeholder: 'Provide hosting server credentials securely...', required: true }
                        ]);
                        triggerToast('📋 Loaded E-commerce Website Design preset form.');
                      }}
                      className="p-3 bg-white/5 border border-white/10 text-xs hover:bg-white/10 rounded-xl transition text-left"
                    >
                      🌐 Web Design Form
                    </button>
                    <button 
                      onClick={() => {
                        setFormFields([
                          { id: 'F-1', label: 'Website Link', type: 'text', placeholder: 'e.g. https://mybrand.com', required: true },
                          { id: 'F-2', label: 'Target Search Keywords', type: 'textarea', placeholder: 'List primary SEO keywords...', required: true }
                        ]);
                        triggerToast('📋 Loaded SEO Optimization Form Preset.');
                      }}
                      className="p-3 bg-white/5 border border-white/10 text-xs hover:bg-white/10 rounded-xl transition text-left"
                    >
                      🚀 SEO Audit Form
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INVOICE NOTIFICATIONS */}
          {activeTab === 'wa-invoice-notif' && (
            <div className={`p-6 rounded-[24px] border ${glassBg}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold">🧾 WhatsApp Invoice Notifications</h3>
                  <p className="text-xs opacity-75">Send itemized digital invoices and track payment logs in real-time.</p>
                </div>
                <button onClick={() => exportCSV('invoices')} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 transition rounded-xl text-xs font-semibold text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4" /> Export Invoices CSV
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 text-slate-400 text-xs uppercase font-mono border-b border-white/10">
                      <th className="p-4">Invoice Number</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Date Dispatched</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02] text-xs">
                        <td className="p-4 font-mono font-bold text-fuchsia-400">{inv.invoiceNumber}</td>
                        <td className="p-4 font-semibold">{inv.customerName}</td>
                        <td className="p-4 font-mono font-bold text-pink-400">${inv.amount}</td>
                        <td className="p-4 opacity-75">{inv.sentDate}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                            inv.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                            inv.status === 'sent' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                            inv.status === 'overdue' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                            'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => triggerNotificationModal(inv.customerName, '+8801712345678', 'invoice_notification', inv.invoiceNumber)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold text-[11px] transition"
                          >
                            ⚡ Deliver Invoice via WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT REMINDERS */}
          {activeTab === 'wa-payment-reminders' && (
            <div className={`p-6 rounded-[24px] border ${glassBg}`}>
              <div className="mb-6">
                <h3 className="text-lg font-bold">💳 Payment Reminders Automated Portal</h3>
                <p className="text-xs opacity-75">Deploy intelligent reminders to prevent outstanding collections delays.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { title: 'Upcoming Collections', count: 2, value: '$600', color: 'border-purple-500' },
                  { title: 'Overdue Reminders', count: 1, value: '$650', color: 'border-rose-500' },
                  { title: 'Successfully Recovered', count: 4, value: '$1200', color: 'border-emerald-500' }
                ].map((card, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${card.color} bg-white/[0.02] text-left`}>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{card.title}</span>
                    <div className="flex justify-between items-baseline mt-2">
                      <span className="text-xl font-bold">{card.value}</span>
                      <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">{card.count} Invoices</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 text-slate-400 text-xs uppercase font-mono border-b border-white/10">
                      <th className="p-4">Ref Invoice</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Due Date</th>
                      <th className="p-4">Schedule Remind</th>
                      <th className="p-4">Alert Tier</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reminders.map((rem) => (
                      <tr key={rem.id} className="border-b border-white/5 hover:bg-white/[0.02] text-xs">
                        <td className="p-4 font-mono font-bold text-slate-400">{rem.invoiceId}</td>
                        <td className="p-4 font-semibold">{rem.customerName}</td>
                        <td className="p-4 font-mono font-bold text-pink-400">${rem.amountDue}</td>
                        <td className="p-4 text-amber-400 font-mono font-semibold">{rem.dueDate}</td>
                        <td className="p-4 opacity-75 font-mono text-[11px]">{rem.scheduledDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rem.status === 'overdue' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {rem.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => triggerNotificationModal(rem.customerName, '+8801712345678', 'payment_reminder', rem.invoiceId)}
                            className="px-2.5 py-1.5 bg-rose-650 hover:bg-rose-750 text-white font-bold rounded-lg text-[10px] transition"
                          >
                            📢 Trigger Alert
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SERVICE DELIVERY UPDATES */}
          {activeTab === 'wa-delivery-updates' && (
            <div className={`p-6 rounded-[24px] border ${glassBg}`}>
              <div className="mb-6">
                <h3 className="text-lg font-bold">🚚 Service Delivery Updates Loop</h3>
                <p className="text-xs opacity-75">Send instant WhatsApp micro-milestones updates as development advances.</p>
              </div>

              <div className="space-y-4">
                {deliveries.map((del) => (
                  <div key={del.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-purple-400">{del.projectName}</h4>
                          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-mono uppercase">{del.phase}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">Client: <strong className="text-white">{del.customerName}</strong> • Phone: <span className="font-mono">{del.whatsappNumber}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] opacity-50 block">Last Update Dispatched</span>
                        <span className="text-xs font-mono font-bold">{del.lastUpdated}</span>
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="opacity-75">Development Progress Track</span>
                        <span className="font-bold font-mono text-pink-400">{del.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-500 transition-all duration-500" 
                          style={{ width: `${del.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap gap-2 justify-between items-center mt-4 pt-4 border-t border-white/5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const updated = deliveries.map(item => item.id === del.id ? { ...item, progress: Math.min(item.progress + 10, 100), phase: item.progress + 10 >= 100 ? 'Completed' : 'Development' as any } : item);
                            setDeliveries(updated);
                            triggerToast('📈 Progress advanced by 10%!');
                          }}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs rounded"
                        >
                          +10% Progress
                        </button>
                        <button
                          onClick={() => {
                            const updated = deliveries.map(item => item.id === del.id ? { ...item, progress: Math.max(item.progress - 10, 0) } : item);
                            setDeliveries(updated);
                            triggerToast('📉 Progress decreased by 10%');
                          }}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs rounded"
                        >
                          -10%
                        </button>
                      </div>

                      <button
                        onClick={() => triggerNotificationModal(del.customerName, del.whatsappNumber, 'service_progress_update', del.projectName)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Deliver Progress via WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PROMOTIONAL MESSAGES */}
          {activeTab === 'wa-promo-messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Broadcast Form */}
              <div className={`p-6 rounded-[24px] border ${glassBg}`}>
                <h3 className="text-lg font-bold mb-2">📢 Bulk Campaign Broadcaster</h3>
                <p className="text-xs opacity-75 mb-6">Broadcast high-impact marketing messages, discount offers & announcements to customer segments.</p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!apiKey) {
                    triggerToast('❌ Error: Set your Meta Cloud API Key first to enable live bulk broadcasts.');
                    return;
                  }
                  triggerToast('🎉 WhatsApp campaign scheduled to broadcast to selected segment!');
                }} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-semibold block mb-1">Target Customer Segment</label>
                    <select className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-slate-300">
                      <option value="all">All Contacts ({contacts.length})</option>
                      <option value="verified">Verified Only</option>
                      <option value="VIP Customers">VIP Customer Segment</option>
                      <option value="Corporate Clients">Corporate Clients Cohort</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold block mb-1">Marketing Template Select</label>
                    <select className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-slate-300">
                      <option value="promotional_campaign">Ramadan Special Discount (30%)</option>
                      <option value="welcome_message">Universal Onboarding Message</option>
                    </select>
                  </div>

                  <FormTextarea
                    label="Promo Copwriting Text Body"
                    value={`🎉 RAMADAN SPECIAL OFFER 🎉\n\nHello, Enjoy an exclusive 30% Discount on all premium full-stack script packages, integrations, and automated WhatsApp features this week only!\n\nUse Code: RAMADAN30 during checkout.\n\nExplore packages: https://webzonebd.com`}
                    disabled
                  />

                  <button type="submit" className={`w-full ${buttonPrimary}`}>
                    🚀 Dispatch Promotional Campaign
                  </button>
                </form>
              </div>

              {/* Segmentation cohorts card */}
              <div className="space-y-6">
                <div className={`p-6 rounded-[24px] border ${glassBg}`}>
                  <h3 className="font-bold text-sm text-purple-400 mb-4">📢 Interactive Customer Segmentation</h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'VIP Segment', count: 1, desc: 'Highest value clients with active orders', color: 'bg-yellow-500/10 text-yellow-400' },
                      { name: 'Corporate Cohorts', count: 2, desc: 'Enterprise clients requesting dynamic custom builds', color: 'bg-purple-500/10 text-purple-400' },
                      { name: 'Standard Lead Pool', count: 3, desc: 'Leads from WhatsApp website chatbot integration', color: 'bg-emerald-500/10 text-emerald-400' }
                    ].map((seg, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <div>
                          <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded uppercase ${seg.color}`}>{seg.name}</span>
                          <p className="text-[11px] text-slate-300 mt-1">{seg.desc}</p>
                        </div>
                        <span className="text-xs font-mono font-bold bg-white/5 px-2.5 py-1 rounded-xl">{seg.count} contacts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-[24px] border ${glassBg} bg-gradient-to-br from-pink-900/10 to-transparent`}>
                  <h4 className="font-bold text-xs uppercase text-pink-400 mb-2">💡 Click and Conversion Tracker</h4>
                  <p className="text-xs opacity-75">WhatsApp templates automatically embed custom UTM URLs. The engine counts unique clicks for Conversion Rate optimization.</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: WHATSAPP TEMPLATES */}
          {activeTab === 'wa-templates' && (
            <div className={`p-6 rounded-[24px] border ${glassBg}`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold">📄 Meta Pre-Approved WhatsApp Templates</h3>
                  <p className="text-xs opacity-75">Template variables sync directly with order payloads. Highly pre-formatted parameters.</p>
                </div>
                <button
                  onClick={() => triggerToast('📝 New templates are requested from Meta Business Manager portal.')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-semibold"
                >
                  Request Meta Template Authorization
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((temp) => (
                  <div key={temp.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-xs font-bold text-purple-400">{temp.name}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-neutral-900 border border-white/10 rounded text-slate-400 uppercase font-mono">{temp.category}</span>
                      </div>
                      <div className="p-3 bg-black/30 rounded-xl font-mono text-[11px] text-emerald-300/90 whitespace-pre-wrap border border-white/5">
                        {temp.body}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <span className="text-[10px] text-slate-400">Language: {temp.language}</span>
                      <button
                        onClick={() => {
                          const updated = templates.map(t => t.id === temp.id ? { ...t, body: prompt('Edit template body:', t.body) || t.body } : t);
                          setTemplates(updated);
                          triggerToast('✏️ Template local state adjusted.');
                        }}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs transition"
                      >
                        Edit Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CAMPAIGN REPORTS */}
          {activeTab === 'wa-campaign-reports' && (
            <div className="space-y-6">
              
              {/* Report Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Total Messages Sent', value: '1,470', color: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/30', pct: '+12% from last week' },
                  { title: 'Delivered Rate', value: '98.4%', color: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/30', pct: 'Industry Standard' },
                  { title: 'Open & Read Rate', value: '84.2%', color: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/30', pct: 'Outstanding Engagement' },
                  { title: 'CTR (Conversion)', value: '62.7%', color: 'from-pink-500/10 to-pink-500/5', border: 'border-pink-500/30', pct: '+4% growth' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} text-left`}>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{stat.title}</span>
                    <h4 className="text-2xl font-black mt-1">{stat.value}</h4>
                    <span className="text-[10px] text-slate-400 block mt-1">{stat.pct}</span>
                  </div>
                ))}
              </div>

              {/* Graphic Chart */}
              <div className={`p-6 rounded-[24px] border ${glassBg}`}>
                <h3 className="font-bold text-base mb-4">📈 Campaign Click and Dispatch Analytics</h3>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CAMPAIGN_REPORT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <Legend />
                      <Area type="monotone" dataKey="sent" stroke="#7C3AED" fillOpacity={1} fill="url(#colorSent)" name="Sent Alerts" />
                      <Area type="monotone" dataKey="read" stroke="#EC4899" fillOpacity={1} fill="url(#colorRead)" name="Read Alerts" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 10: WHATSAPP API INTEGRATION */}
          {activeTab === 'wa-api-integration' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              
              {/* Form Config */}
              <form onSubmit={handleSaveApiSettings} className={`p-6 rounded-[24px] border ${glassBg} space-y-4`}>
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                    <Shield className="w-5 h-5" />
                    <h3 className="text-base font-bold">🔐 WhatsApp Cloud Business API Setup</h3>
                  </div>
                  <p className="text-xs opacity-75">Input details acquired from your Meta Developer Dashboard to establish secure handshake integrations.</p>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-[11px] flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Credential Security Notice:</span>
                    <p className="opacity-80 mt-0.5">Your Meta Business developer credentials are processed exclusively client-side and saved into secure local storage buffers.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <FormInput
                    label="Meta Cloud API Token (Bearer API Key)"
                    placeholder="e.g. EAAGu76Bf8c4B..."
                    value={apiKey}
                    onChange={(e: any) => setApiKey(e.target.value)}
                    type="password"
                    required
                  />

                  <FormInput
                    label="WhatsApp Sender Number ID (Phone ID)"
                    placeholder="e.g. 10293129103"
                    value={senderNumber}
                    onChange={(e: any) => setSenderNumber(e.target.value)}
                  />

                  <FormInput
                    label="WhatsApp Business Account ID (WABA)"
                    placeholder="e.g. 29312910394"
                    value={webhookUrl} // storing in standard configs
                    onChange={(e: any) => setWebhookUrl(e.target.value)}
                  />

                  <FormInput
                    label="Sender Profile Business Name"
                    placeholder="e.g. WebzoneBD Ltd"
                    value={businessName}
                    onChange={(e: any) => setBusinessName(e.target.value)}
                  />

                  <button type="submit" className={`w-full ${buttonPrimary}`}>
                    <Save className="w-4 h-4" /> Save Connection Settings
                  </button>
                </div>
              </form>

              {/* API Logs & Connection Info */}
              <div className="space-y-6">
                <div className={`p-6 rounded-[24px] border ${glassBg}`}>
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-slate-300">⚡ API Handshake Status</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span>Live Connection Pool:</span>
                      <span className="font-bold text-emerald-400">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Meta App ID:</span>
                      <span className="font-mono text-[11px]">app_3910319</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>API Endpoint Gateway:</span>
                      <span className="font-mono text-[11px] text-fuchsia-400">graph.facebook.com/v18.0</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Registered Webhook URL:</span>
                      <span className="font-mono text-[10px] opacity-70">https://api.webzonebd.com/v1/webhook</span>
                    </div>
                  </div>
                </div>

                {/* API Request logs */}
                <div className={`p-6 rounded-[24px] border ${glassBg} bg-neutral-950 font-mono text-[11px]`}>
                  <h4 className="font-bold text-xs text-purple-400 uppercase tracking-widest mb-3">📡 Active API Handshake Logs</h4>
                  
                  <div className="space-y-1.5 text-slate-300">
                    <p className="text-[10px] text-emerald-400 font-bold">[2026-07-09 10:42] POST /graph/messages - 200 OK</p>
                    <p className="text-[10px] opacity-60 ml-2">Payload: sender_id=102931 temp_id=order_confirmation</p>
                    <p className="text-[10px] text-emerald-400 font-bold">[2026-07-09 09:12] POST /graph/messages - 200 OK</p>
                    <p className="text-[10px] opacity-60 ml-2">Payload: sender_id=8321 temp_id=payment_reminder</p>
                    <p className="text-[10px] text-red-400 font-bold">[2026-07-08 17:33] POST /graph/messages - 401 Unauthorized</p>
                    <p className="text-[10px] opacity-60 ml-2">Error: Invalid Meta API Bearer Key signature</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 11: WHATSAPP SETTINGS */}
          {activeTab === 'wa-settings' && (
            <div className={`p-6 rounded-[24px] border ${glassBg} text-left`}>
              <h3 className="text-lg font-bold mb-1">⚙️ WhatsApp Auto Messaging & Preference Settings</h3>
              <p className="text-xs opacity-75 mb-6">Set trigger criteria, default responder copy, and dispatch quotas limits.</p>

              <div className="space-y-6">
                
                {/* Auto Reply settings */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold text-sm">🟢 Instant Auto Reply Bot</h4>
                      <p className="text-xs text-slate-300">Send an instant greetings/acknowledgment copy whenever a client writes MENU or initiates a lead.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoReplyEnabled}
                      onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                      className="w-10 h-6 bg-neutral-800 rounded-full cursor-pointer"
                    />
                  </div>

                  <FormTextarea
                    label="Auto Reply Text Template Body"
                    value={autoReplyText}
                    onChange={(e: any) => setAutoReplyText(e.target.value)}
                  />
                </div>

                {/* Dispatch limit parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <h4 className="font-bold text-xs uppercase text-purple-400 mb-2">Message Limits Constraints</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span>Daily Max Broadcast Quota:</span>
                        <strong className="font-mono">1,000 / day</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Retry Attemps upon Bounce:</span>
                        <strong className="font-mono">3 times</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <h4 className="font-bold text-xs uppercase text-pink-400 mb-2">Notification Preferences</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                        <span>Send WhatsApp alert on New Guest Order</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                        <span>Notify team on API Connection drops</span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* MODAL 1: VIEW SERVICE ORDER DETAIL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${glassBg} relative animate-in zoom-in-95 duration-200`}>
            <button
              onClick={() => setViewingOrder(null)}
              className="absolute right-4 top-4 p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Clipboard className="text-purple-400" /> Order Details for {viewingOrder.id}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Customer Name</span>
                  <p className="font-bold mt-0.5">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase">WhatsApp</span>
                  <p className="font-mono text-emerald-400 font-bold mt-0.5">{viewingOrder.whatsappNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Requested Service</span>
                  <p className="font-bold mt-0.5">{viewingOrder.serviceName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Agreed Budget</span>
                  <p className="font-mono text-pink-400 font-bold mt-0.5">${viewingOrder.price}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase block mb-1">Dynamic Form Client Submissions</span>
                <div className="space-y-2 p-3 bg-black/30 border border-white/5 rounded-xl">
                  {viewingOrder.customFields.map((field, i) => (
                    <div key={i}>
                      <span className="font-bold opacity-70 block text-[10px]">{field.label}:</span>
                      <p className="text-slate-200 mt-0.5 font-medium">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  triggerNotificationModal(viewingOrder.customerName, viewingOrder.whatsappNumber, 'order_confirmation', viewingOrder.id);
                  setViewingOrder(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-xl"
              >
                Dispatch Welcome Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CONTACT */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddContact} className={`w-full max-w-md p-6 rounded-3xl border ${glassBg} relative animate-in zoom-in-95 duration-200 space-y-4`}>
            <button
              type="button"
              onClick={() => setIsAddContactOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold flex items-center gap-2">
              <Users className="text-purple-400" /> Create WhatsApp Customer Record
            </h3>

            <FormInput
              label="Contact Full Name"
              placeholder="e.g. Imran Hasan"
              value={newContact.name}
              onChange={(e: any) => setNewContact({ ...newContact, name: e.target.value })}
              required
            />

            <FormInput
              label="WhatsApp Mobile Number (With Dial Code)"
              placeholder="e.g. +8801712345678"
              value={newContact.whatsappNumber}
              onChange={(e: any) => setNewContact({ ...newContact, whatsappNumber: e.target.value })}
              required
            />

            <FormInput
              label="Email Address (Optional)"
              placeholder="e.g. email@example.com"
              value={newContact.email}
              onChange={(e: any) => setNewContact({ ...newContact, email: e.target.value })}
            />

            <div>
              <label className="text-[10px] uppercase font-semibold block mb-1">Contact Group Classification</label>
              <select
                value={newContact.group}
                onChange={(e) => setNewContact({ ...newContact, group: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-slate-300"
              >
                <option value="Regular">Regular Group</option>
                <option value="VIP Customers">VIP Customers</option>
                <option value="Corporate Clients">Corporate Clients</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddContactOpen(false)}
                className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-xl"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ADD FIELD */}
      {isAddFieldOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddField} className={`w-full max-w-md p-6 rounded-3xl border ${glassBg} relative animate-in zoom-in-95 duration-200 space-y-4`}>
            <button
              type="button"
              onClick={() => setIsAddFieldOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold flex items-center gap-2">
              <FileText className="text-purple-400" /> Add Custom Field to Form
            </h3>

            <FormInput
              label="Field Display Label"
              placeholder="e.g. Hosting logins"
              value={newField.label}
              onChange={(e: any) => setNewField({ ...newField, label: e.target.value })}
              required
            />

            <FormInput
              label="Field Placeholder Hint"
              placeholder="e.g. cPanel user name & password..."
              value={newField.placeholder}
              onChange={(e: any) => setNewField({ ...newField, placeholder: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold block mb-1">Field Type</label>
                <select
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-slate-300"
                >
                  <option value="text">Short Text</option>
                  <option value="textarea">Paragraph Area</option>
                  <option value="number">Numeric Input</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-semibold block mb-1">Requirement Flag</label>
                <select
                  value={newField.required ? 'true' : 'false'}
                  onChange={(e) => setNewField({ ...newField, required: e.target.value === 'true' })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-slate-300"
                >
                  <option value="true">Required Field</option>
                  <option value="false">Optional Field</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddFieldOpen(false)}
                className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-xl"
              >
                Add Field
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: SEND MANUAL WHATSAPP NOTIFICATION MESSAGE */}
      {isSendNotificationOpen && notifTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${glassBg} relative animate-in zoom-in-95 duration-200`}>
            <button
              onClick={() => setIsSendNotificationOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold mb-1 flex items-center gap-1.5">
              <Send className="text-emerald-400" /> Dispatch WhatsApp Notification
            </h3>
            <p className="text-[11px] opacity-75 mb-4">
              Sending secure communication alert to <strong>{notifTarget.name}</strong> ({notifTarget.number})
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-semibold block mb-1">Pre-approved Template Payload</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold block mb-1">Interpreted Message Body Preview</label>
                <textarea
                  value={customMsgBody}
                  onChange={(e) => setCustomMsgBody(e.target.value)}
                  rows={6}
                  className="w-full p-3 font-mono text-[11px] bg-neutral-950 border border-white/10 text-emerald-300 rounded-xl resize-none outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-white/5 rounded-xl text-[10px] text-slate-400">
                🚀 This message will route via Meta Cloud API using template validation placeholders.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsSendNotificationOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendLiveWhatsAppMessage}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  ⚡ Send Live WhatsApp Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
