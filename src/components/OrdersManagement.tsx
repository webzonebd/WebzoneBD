import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  Eye, 
  Edit, 
  Printer, 
  MoreVertical, 
  Check, 
  X, 
  Clock, 
  ExternalLink,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  FileText,
  Sliders,
  Send,
  Trash2,
  Plus,
  Calendar,
  CreditCard,
  UserCheck,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  ChevronDown,
  Info,
  SlidersHorizontal,
  Activity,
  Award,
  BookOpen,
  Mail
} from 'lucide-react';
import { Order, Language } from '../types';
import {
  formatOrderSummary,
  generateReceiptHtml,
  generateReceiptPlainText,
  simulateSendOrderReceiptEmail,
  FormattedOrderSummary,
  EmailReceiptDispatchResult
} from '../utils/orderReceipt';

interface OrdersManagementProps {
  orders: Order[];
  customers: any[];
  isDark: boolean;
  language: Language;
  formatPrice: (usd: number) => string;
  getOrderSerial: (orderId: string) => string;
  setSelectedOrderForInspect: (order: Order | null) => void;
  setSelectedOrderForInvoiceModal: (order: Order | null) => void;
  updateOrderStatus: (id: string, status: 'completed' | 'failed' | 'refunded') => void;
  updateOrderDetails?: (id: string, updatedFields: Partial<Order>) => void;
  deleteOrder?: (id: string) => void;
  currentUser: any;
  triggerToast: (msg: string) => void;
}

export default function OrdersManagement({
  orders,
  customers,
  isDark,
  language,
  formatPrice,
  getOrderSerial,
  setSelectedOrderForInspect,
  setSelectedOrderForInvoiceModal,
  updateOrderStatus,
  updateOrderDetails,
  deleteOrder,
  currentUser,
  triggerToast,
}: OrdersManagementProps) {

  const isStaffViewOnly = useMemo(() => {
    const role = currentUser?.role;
    return role === 'staff';
  }, [currentUser]);

  // Local state for advanced search and filters
  const [quickSearch, setQuickSearch] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced Filter state variables
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterMinAmount, setFilterMinAmount] = useState<string>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<string>('');
  const [filterAssignedStaff, setFilterAssignedStaff] = useState<string>('all');
  const [filterOrderType, setFilterOrderType] = useState<string>('all'); // Store Product vs Custom Service
  const [filterCustomerName, setFilterCustomerName] = useState<string>('');
  const [filterInvoiceId, setFilterInvoiceId] = useState<string>('');
  const [selectedStatFilter, setSelectedStatFilter] = useState<string>('all');

  // Table interactive features
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const [transitioningOrders, setTransitioningOrders] = useState<Record<string, { status: 'completed' | 'failed' | 'refunded', stage: 'updating' | 'success' }>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detail Drawer and interactive dialog states
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [drawerActiveTab, setDrawerActiveTab] = useState<'details' | 'timeline' | 'invoice' | 'receipt' | 'logs'>('details');
  const [newOrderNote, setNewOrderNote] = useState('');
  const [customLogs, setCustomLogs] = useState<{ [orderId: string]: any[] }>({});

  // Email receipt trigger and simulation modal states
  const [selectedOrderForEmailReceipt, setSelectedOrderForEmailReceipt] = useState<Order | null>(null);
  const [emailReceiptSending, setEmailReceiptSending] = useState(false);
  const [emailReceiptTargetEmail, setEmailReceiptTargetEmail] = useState('');
  const [emailReceiptViewMode, setEmailReceiptViewMode] = useState<'preview' | 'html' | 'text'>('preview');
  const [emailReceiptResult, setEmailReceiptResult] = useState<EmailReceiptDispatchResult | null>(null);

  // Confirmation state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete_single' | 'delete_bulk' | 'cancel_single' | 'status_bulk' | 'staff_bulk';
    title: string;
    description: string;
    targetId?: string;
    targetStatus?: any;
    targetStaff?: string;
  } | null>(null);

  // Dropdowns in Bulk Actions
  const [showBulkStatusMenu, setShowBulkStatusMenu] = useState(false);
  const [showBulkStaffMenu, setShowBulkStaffMenu] = useState(false);

  // Auto close menus
  useEffect(() => {
    const closeAll = () => {
      setActiveRowMenuId(null);
      setShowBulkStatusMenu(false);
      setShowBulkStaffMenu(false);
    };
    window.addEventListener('click', closeAll);
    return () => window.removeEventListener('click', closeAll);
  }, []);

  // Sync simulated refreshing state
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast(language === 'bn' ? '🔄 সফলভাবে ক্লাউড ডাটাবেজ আপডেট করা হয়েছে!' : '🔄 Order pipeline records successfully synchronized!');
    }, 700);
  };

  // Pre-configured staff lists for assignment dropdowns
  const staffList = ['Masud Rana', 'Imran Khan', 'Anika Rahman', 'Tahsin Ahmed', 'Karim Al Hasan'];

  // Helper to extract order type
  const getOrderType = (o: Order) => {
    if (o.productId) return 'Store Product';
    if (o.serviceId) return 'Custom Service';
    return 'General';
  };

  // Helper to resolve client object elegantly
  const resolveCustomer = (o: Order) => {
    const userId = (o as any).userId;
    let cust = customers.find(c => c.id === userId);
    if (!cust) {
      const hash = o.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      cust = customers[hash % (customers.length || 1)] || null;
    }
    return {
      name: o.customerName || o.guestName || cust?.name || 'GUEST CUSTOMER',
      email: o.customerEmail || o.guestEmail || cust?.email || 'N/A',
      phone: o.customerPhone || o.guestPhone || cust?.phone || 'N/A',
      avatar: cust?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(o.customerName || o.guestName || 'G')}&background=7C3AED&color=fff&bold=true`
    };
  };

  // Multi-Filter Pipeline
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const cust = resolveCustomer(o);
      const serial = getOrderSerial(o.id).toLowerCase();

      // Quick Search across Invoice, Name, Email, Phone
      if (quickSearch.trim()) {
        const query = quickSearch.toLowerCase();
        const matchesQuick = 
          serial.includes(query) ||
          cust.name.toLowerCase().includes(query) ||
          cust.email.toLowerCase().includes(query) ||
          cust.phone.toLowerCase().includes(query);
        if (!matchesQuick) return false;
      }

      // Selected Stat Card Filter override
      if (selectedStatFilter !== 'all') {
        if (selectedStatFilter === 'today') {
          const todayStr = '2026-06-26';
          if (!o.date || !o.date.startsWith(todayStr)) return false;
        } else if (selectedStatFilter === 'pending') {
          if (o.paymentStatus !== 'pending') return false;
        } else if (selectedStatFilter === 'processing') {
          if (o.status !== 'processing') return false;
        } else if (selectedStatFilter === 'completed') {
          if (o.paymentStatus !== 'completed' && o.status !== 'delivered') return false;
        } else if (selectedStatFilter === 'cancelled') {
          if (o.paymentStatus !== 'failed') return false;
        } else if (selectedStatFilter === 'refunded') {
          if (o.paymentStatus !== 'refunded') return false;
        }
      }

      // Advanced filters
      if (filterOrderStatus !== 'all') {
        const oStatus = o.status || 'new';
        if (oStatus !== filterOrderStatus) return false;
      }

      if (filterPaymentStatus !== 'all') {
        if (o.paymentStatus !== filterPaymentStatus) return false;
      }

      if (filterPaymentMethod !== 'all') {
        const pMethod = (o.paymentMethod || '').toLowerCase();
        if (pMethod !== filterPaymentMethod.toLowerCase()) return false;
      }

      if (filterStartDate) {
        const oDate = new Date(o.date || '');
        const sDate = new Date(filterStartDate);
        if (oDate < sDate) return false;
      }

      if (filterEndDate) {
        const oDate = new Date(o.date || '');
        const eDate = new Date(filterEndDate);
        eDate.setHours(23, 59, 59, 999);
        if (oDate > eDate) return false;
      }

      if (filterMinAmount) {
        if (Number(o.price) < Number(filterMinAmount)) return false;
      }

      if (filterMaxAmount) {
        if (Number(o.price) > Number(filterMaxAmount)) return false;
      }

      if (filterAssignedStaff !== 'all') {
        if ((o.assignedStaff || 'Unassigned') !== filterAssignedStaff) return false;
      }

      if (filterOrderType !== 'all') {
        const oType = getOrderType(o);
        if (oType !== filterOrderType) return false;
      }

      if (filterCustomerName.trim()) {
        if (!cust.name.toLowerCase().includes(filterCustomerName.toLowerCase())) return false;
      }

      if (filterInvoiceId.trim()) {
        if (!serial.includes(filterInvoiceId.toLowerCase())) return false;
      }

      return true;
    });
  }, [orders, quickSearch, filterOrderStatus, filterPaymentStatus, filterPaymentMethod, filterStartDate, filterEndDate, filterMinAmount, filterMaxAmount, filterAssignedStaff, filterOrderType, filterCustomerName, filterInvoiceId, selectedStatFilter]);

  // Sorted and Paginated Results
  const sortedAndFilteredOrders = useMemo(() => {
    const list = [...filteredOrders];
    list.sort((a, b) => {
      let valA: any = a[sortField as keyof Order] || '';
      let valB: any = b[sortField as keyof Order] || '';

      if (sortField === 'customerName') {
        valA = resolveCustomer(a).name;
        valB = resolveCustomer(b).name;
      } else if (sortField === 'amount') {
        valA = Number(a.price) || 0;
        valB = Number(b.price) || 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredOrders, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredOrders.slice(start, start + itemsPerPage);
  }, [sortedAndFilteredOrders, currentPage, itemsPerPage]);

  // Reset pagination on filter adjustment
  useEffect(() => {
    setCurrentPage(1);
  }, [quickSearch, filterOrderStatus, filterPaymentStatus, filterPaymentMethod, filterStartDate, filterEndDate, filterMinAmount, filterMaxAmount, filterAssignedStaff, filterOrderType, filterCustomerName, filterInvoiceId, itemsPerPage, selectedStatFilter]);

  // Interactive statistics computing
  const stats = useMemo(() => {
    const todayStr = '2026-06-26'; // Mock local simulation date
    const todayOrders = orders.filter(o => o.date && o.date.startsWith(todayStr));
    
    const totalOrdersCount = orders.length;
    const todayOrdersCount = todayOrders.length;
    const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'pending').length;
    const processingOrdersCount = orders.filter(o => o.status === 'processing').length;
    const completedOrdersCount = orders.filter(o => o.paymentStatus === 'completed' || o.status === 'delivered').length;
    const cancelledOrdersCount = orders.filter(o => o.paymentStatus === 'failed').length;
    const refundedOrdersCount = orders.filter(o => o.paymentStatus === 'refunded').length;

    const totalRevenueSum = orders
      .filter(o => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    return {
      totalOrdersCount,
      todayOrdersCount,
      pendingOrdersCount,
      processingOrdersCount,
      completedOrdersCount,
      cancelledOrdersCount,
      refundedOrdersCount,
      totalRevenueSum
    };
  }, [orders]);

  // Multi-select helpers
  const handleSelectAllToggle = () => {
    if (selectedOrderIds.length === paginatedOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(paginatedOrders.map(o => o.id));
    }
  };

  const handleSelectRowToggle = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Direct trigger whatsapp message
  const handleTriggerWhatsApp = (o: Order) => {
    const cust = resolveCustomer(o);
    if (!cust.phone || cust.phone === 'N/A') {
      triggerToast('⚠️ Client phone credentials not set or invalid.');
      return;
    }
    const sanitized = cust.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${cust.name},\nWe are checking in regarding your invoice ${getOrderSerial(o.id)} ($${o.price}) for "${o.itemTitle}". Please let us know if you need assistance!`);
    window.open(`https://wa.me/${sanitized}?text=${message}`, '_blank');
  };

  // Dedicated trigger for simulated HTML order confirmation email receipt
  const handleTriggerEmailReceipt = async (order: Order, overrideEmail?: string) => {
    setEmailReceiptSending(true);
    try {
      const cust = resolveCustomer(order);
      const targetEmail = overrideEmail || emailReceiptTargetEmail || cust.email;
      
      const result = await simulateSendOrderReceiptEmail(order, {
        customerName: cust.name,
        customerEmail: targetEmail,
        customerPhone: cust.phone,
        author: currentUser?.name || 'Order Processing Workflow',
        currency: 'USD'
      });

      setEmailReceiptResult(result);

      // Append log entry to order's activity timeline
      setCustomLogs(prev => ({
        ...prev,
        [order.id]: [result.auditLogItem, ...(prev[order.id] || getOrderLogs(order.id))]
      }));

      triggerToast(`📧 Live confirmation receipt simulated & dispatched to ${targetEmail}!`);
    } catch (err) {
      console.error('Email receipt trigger failed', err);
      triggerToast('⚠️ Failed to simulate email receipt dispatch.');
    } finally {
      setEmailReceiptSending(false);
    }
  };

  // Generate simulated dynamic logs
  const getOrderLogs = (orderId: string) => {
    if (customLogs[orderId]) return customLogs[orderId];
    
    // Simulate initial timeline activity logs based on order variables
    const initialLogs = [
      { id: '1', event: 'Order Created', author: 'System Pipeline', date: '2026-06-25 10:32 AM', desc: 'Transaction initialized via SSLCommerz Gateway.' },
      { id: '2', event: 'Email Receipt Sent', author: 'Nodemailer SMTP', date: '2026-06-25 10:33 AM', desc: 'Automated notification dispatched successfully.' },
    ];
    return initialLogs;
  };

  const handleAddOrderNote = (orderId: string) => {
    if (!newOrderNote.trim()) return;
    
    const timestamp = new Date().toLocaleString();
    const newLogItem = {
      id: Date.now().toString(),
      event: 'Note Added',
      author: currentUser?.name || 'Admin',
      date: timestamp,
      desc: newOrderNote
    };

    setCustomLogs(prev => ({
      ...prev,
      [orderId]: [newLogItem, ...(prev[orderId] || getOrderLogs(orderId))]
    }));

    // Update state notes field if callback is specified
    if (updateOrderDetails) {
      const order = orders.find(o => o.id === orderId);
      const combinedNotes = order?.orderNotes 
        ? `${order.orderNotes}\n[${timestamp}]: ${newOrderNote}`
        : `[${timestamp}]: ${newOrderNote}`;
      updateOrderDetails(orderId, { orderNotes: combinedNotes });
    }

    setNewOrderNote('');
    triggerToast('📝 Internal note submitted successfully!');
  };

  // Trigger status update with premium loading & success transitions
  const triggerStatusUpdateWithAnimation = (orderId: string, status: 'completed' | 'failed' | 'refunded') => {
    // 1. Initial State: loading transition
    setTransitioningOrders(prev => ({
      ...prev,
      [orderId]: { status, stage: 'updating' }
    }));
    setActiveRowMenuId(null);

    // 2. Timeout simulation (1000ms loader phase) then flip to 'success'
    setTimeout(() => {
      setTransitioningOrders(prev => ({
        ...prev,
        [orderId]: { status, stage: 'success' }
      }));

      // Call original prop callback to execute state changes
      updateOrderStatus(orderId, status);

      // Trigger respective success toast message
      let toastMsg = '';
      if (status === 'completed') {
        toastMsg = `💳 Invoice #${getOrderSerial(orderId)} marked as PAID`;
        
        // Automated Email Receipt trigger in order processing workflow upon successful payment verification
        const orderObj = orders.find(o => o.id === orderId);
        if (orderObj) {
          const cust = resolveCustomer(orderObj);
          simulateSendOrderReceiptEmail(orderObj, {
            customerName: cust.name,
            customerEmail: cust.email,
            customerPhone: cust.phone,
            author: currentUser?.name || 'Payment Verification Workflow',
            currency: 'USD'
          }).then(res => {
            setCustomLogs(prev => ({
              ...prev,
              [orderId]: [res.auditLogItem, ...(prev[orderId] || getOrderLogs(orderId))]
            }));
            triggerToast(`📧 Payment verified! HTML email receipt dispatched to ${cust.email}`);
          }).catch(console.error);
        }
      } else if (status === 'refunded') {
        toastMsg = `💳 Invoice #${getOrderSerial(orderId)} marked as REFUNDED`;
      } else {
        toastMsg = `💳 Invoice #${getOrderSerial(orderId)} cancelled successfully.`;
      }
      triggerToast(toastMsg);

      // 3. Clear transition wrapper state after 1500ms success animation
      setTimeout(() => {
        setTransitioningOrders(prev => {
          const next = { ...prev };
          delete next[orderId];
          return next;
        });
      }, 1500);

    }, 1000);
  };

  // BULK AND SINGLE CONFIRMATIONS DISPATCHER
  const handleExecuteAction = () => {
    if (!confirmDialog) return;

    const { type, targetId, targetStatus, targetStaff } = confirmDialog;

    if (type === 'delete_single' && targetId) {
      if (deleteOrder) {
        deleteOrder(targetId);
        triggerToast(`🗑️ Invoice #${getOrderSerial(targetId)} successfully removed from registry.`);
      }
    } else if (type === 'cancel_single' && targetId) {
      triggerStatusUpdateWithAnimation(targetId, 'failed');
    } else if (type === 'delete_bulk') {
      if (deleteOrder) {
        selectedOrderIds.forEach(id => deleteOrder(id));
        triggerToast(`🗑️ Checked transaction lines (${selectedOrderIds.length}) permanently purged.`);
        setSelectedOrderIds([]);
      }
    } else if (type === 'status_bulk' && targetStatus) {
      selectedOrderIds.forEach(id => {
        // We can update details or use status handler
        if (targetStatus === 'completed' || targetStatus === 'failed' || targetStatus === 'refunded') {
          updateOrderStatus(id, targetStatus);
        } else {
          // General status update in order details
          if (updateOrderDetails) {
            updateOrderDetails(id, { status: targetStatus });
          }
        }
      });
      triggerToast(`⚙️ Payment / Order status bulk synchronized for ${selectedOrderIds.length} checked rows.`);
      setSelectedOrderIds([]);
    } else if (type === 'staff_bulk' && targetStaff) {
      if (updateOrderDetails) {
        selectedOrderIds.forEach(id => {
          updateOrderDetails(id, { assignedStaff: targetStaff });
        });
        triggerToast(`👥 Assigned ${targetStaff} to ${selectedOrderIds.length} selected orders.`);
        setSelectedOrderIds([]);
      }
    }

    setConfirmDialog(null);
  };

  // Export CSV Ledger
  const handleExportCSV = (targetRows: Order[]) => {
    try {
      if (targetRows.length === 0) {
        triggerToast('⚠️ Export criteria contains empty row array.');
        return;
      }
      const headers = ['Invoice ID', 'Date', 'Customer Name', 'Customer Email', 'Customer Phone', 'Purchased Item', 'Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Assigned Staff'];
      const rows = targetRows.map(o => {
        const cust = resolveCustomer(o);
        return [
          getOrderSerial(o.id),
          o.date || 'N/A',
          `"${cust.name.replace(/"/g, '""')}"`,
          cust.email,
          cust.phone,
          `"${o.itemTitle.replace(/"/g, '""')}"`,
          o.price,
          o.paymentMethod || 'N/A',
          o.paymentStatus.toUpperCase(),
          o.status || 'NEW',
          o.assignedStaff || 'Unassigned'
        ];
      });

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `saas_orders_ledger_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('📥 CSV Ledger exported successfully!');
    } catch (e) {
      triggerToast('❌ Export to CSV failed.');
    }
  };

  // Export Excel Spreadsheet (structured Tab delimited text file matching excel-compatibility standards)
  const handleExportExcel = (targetRows: Order[]) => {
    try {
      if (targetRows.length === 0) {
        triggerToast('⚠️ Export criteria contains empty row array.');
        return;
      }
      const headers = ['Invoice ID', 'Date', 'Customer Name', 'Customer Email', 'Customer Phone', 'Purchased Item', 'Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Assigned Staff'];
      const rows = targetRows.map(o => {
        const cust = resolveCustomer(o);
        return [
          getOrderSerial(o.id),
          o.date || '',
          cust.name,
          cust.email,
          cust.phone,
          o.itemTitle,
          o.price,
          o.paymentMethod || '',
          o.paymentStatus.toUpperCase(),
          o.status || 'NEW',
          o.assignedStaff || 'Unassigned'
        ];
      });

      const tabContent = [headers.join('\t'), ...rows.map(e => e.join('\t'))].join('\n');
      const blob = new Blob([tabContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `saas_orders_excel_${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('📥 Excel Ledger exported successfully!');
    } catch (e) {
      triggerToast('❌ Export to Excel failed.');
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 relative">
      
      {/* Dynamic light accent glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[200px] bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[150px] bg-gradient-to-r from-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Panel Design */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-100 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white rounded-md text-[9px] font-black uppercase tracking-wider shadow">
              Enterprise CRM Hub
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-purple-500 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Sync Engine Online
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
            <span>📦</span> {language === 'bn' ? 'অর্ডার এবং বিলিং ক্যাটালগ' : 'Orders & Checkout Catalog'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'একটি কেন্দ্রীয় অ্যাডমিন প্যানেল থেকে সমস্ত কাস্টমার অর্ডার এবং বিলিং পরিচালনা করুন।' 
              : 'Manage all customer orders from a centralized admin panel. Seamless transaction tracking & CRM pipelines.'}
          </p>
        </div>

        {/* Header Tools */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
              isRefreshing ? 'animate-spin' : ''
            } ${
              isDark 
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 shadow-3xs'
            }`}
            title="Synchronize Database Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleExportCSV(sortedAndFilteredOrders)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-slate-200 hover:text-white hover:bg-neutral-850' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-3xs'
            }`}
            title="Export filtered records to standard CSV ledger"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExportExcel(sortedAndFilteredOrders)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-slate-200 hover:text-white hover:bg-neutral-850' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-3xs'
            }`}
            title="Export full workbook structure to Excel Spreadsheet"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Excel Sheet</span>
          </button>
        </div>
      </div>

      {/* TOP STATISTICS BENTO BLOCK (8 CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 animate-fade-in" id="orders-dashboard-stats-grid">
        {/* Total Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('all')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'all'
              ? isDark
                ? 'bg-gradient-to-tr from-[#7C3AED]/20 via-[#A855F7]/10 to-transparent border-purple-500/80 shadow-[0_12px_30px_rgba(124,58,237,0.25)] ring-1 ring-purple-500/30'
                : 'bg-gradient-to-tr from-[#7C3AED]/10 via-[#A855F7]/5 to-[#EC4899]/5 border-purple-400 shadow-[0_12px_30px_rgba(124,58,237,0.12)]'
              : isDark
                ? 'bg-[#0F172A]/70 backdrop-blur-[20px] border-white/[0.08] hover:border-purple-500/30'
                : 'bg-white/85 backdrop-blur-[20px] border-slate-200 hover:border-purple-400/50 shadow-3xs'
          }`}
        >
          {/* Subtle top indicator line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              selectedStatFilter === 'all' ? 'text-purple-600 dark:text-purple-300' : 'text-slate-400 dark:text-slate-500'
            }`}>Total Orders</span>
            <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              selectedStatFilter === 'all' ? 'bg-[#7C3AED]/15 text-[#7C3AED]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className={`text-2xl font-black font-mono tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>{stats.totalOrdersCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[9px] font-black">100%</span>
          </div>
        </button>

        {/* Today's Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('today')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'today'
              ? isDark
                ? 'bg-gradient-to-tr from-cyan-950/40 via-cyan-900/10 to-transparent border-cyan-500/80 shadow-[0_12px_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
                : 'bg-gradient-to-tr from-cyan-50 via-cyan-50/50 to-white border-cyan-400 shadow-[0_12px_30px_rgba(6,182,212,0.12)]'
              : isDark
                ? 'bg-[#0F172A]/70 backdrop-blur-[20px] border-white/[0.08] hover:border-cyan-500/30'
                : 'bg-white/85 backdrop-blur-[20px] border-slate-200 hover:border-cyan-400/50 shadow-3xs'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              selectedStatFilter === 'today' ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-400 dark:text-slate-500'
            }`}>Today's Orders</span>
            <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              selectedStatFilter === 'today' ? 'bg-cyan-500/15 text-cyan-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className="text-2xl font-black font-mono tracking-tight text-cyan-500 dark:text-cyan-400">{stats.todayOrdersCount}</span>
            <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono font-black uppercase">26-Jun</span>
          </div>
        </button>

        {/* Pending Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('pending')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'pending'
              ? isDark
                ? 'bg-gradient-to-tr from-amber-950/40 via-amber-900/10 to-transparent border-amber-500/80 shadow-[0_12px_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30'
                : 'bg-gradient-to-tr from-amber-50 via-amber-50/50 to-white border-amber-400 shadow-[0_12px_30px_rgba(245,158,11,0.12)]'
              : isDark
                ? 'bg-[#0F172A]/70 backdrop-blur-[20px] border-white/[0.08] hover:border-amber-500/30'
                : 'bg-white/85 backdrop-blur-[20px] border-slate-200 hover:border-amber-400/50 shadow-3xs'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              selectedStatFilter === 'pending' ? 'text-amber-600 dark:text-amber-300' : 'text-slate-400 dark:text-slate-500'
            }`}>Pending</span>
            <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              selectedStatFilter === 'pending' ? 'bg-amber-500/15 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className="text-2xl font-black font-mono tracking-tight text-amber-500">{stats.pendingOrdersCount}</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0 self-center" />
          </div>
        </button>

        {/* Processing Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('processing')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'processing'
              ? isDark
                ? 'bg-gradient-to-tr from-blue-950/40 via-blue-900/10 to-transparent border-blue-500/80 shadow-[0_12px_30px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/30'
                : 'bg-gradient-to-tr from-blue-50 via-blue-50/50 to-white border-blue-400 shadow-[0_12px_30px_rgba(59,130,246,0.12)]'
              : isDark
                ? 'bg-[#0F172A]/70 backdrop-blur-[20px] border-white/[0.08] hover:border-blue-500/30'
                : 'bg-white/85 backdrop-blur-[20px] border-slate-200 hover:border-blue-400/50 shadow-3xs'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              selectedStatFilter === 'processing' ? 'text-blue-600 dark:text-blue-300' : 'text-slate-400 dark:text-slate-500'
            }`}>Processing</span>
            <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              selectedStatFilter === 'processing' ? 'bg-blue-500/15 text-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className="text-2xl font-black font-mono tracking-tight text-blue-500">{stats.processingOrdersCount}</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0 self-center" />
          </div>
        </button>

        {/* Completed Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('completed')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'completed'
              ? isDark
                ? 'bg-gradient-to-tr from-emerald-950/40 via-emerald-900/10 to-transparent border-emerald-500/80 shadow-[0_12px_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30'
                : 'bg-gradient-to-tr from-emerald-50 via-emerald-50/50 to-white border-emerald-400 shadow-[0_12px_30px_rgba(16,185,129,0.12)]'
              : isDark
                ? 'bg-[#0F172A]/70 backdrop-blur-[20px] border-white/[0.08] hover:border-emerald-500/30'
                : 'bg-white/85 backdrop-blur-[20px] border-slate-200 hover:border-emerald-400/50 shadow-3xs'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              selectedStatFilter === 'completed' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'
            }`}>Completed</span>
            <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              selectedStatFilter === 'completed' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className="text-2xl font-black font-mono tracking-tight text-emerald-500">{stats.completedOrdersCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black">Success</span>
          </div>
        </button>

        {/* Cancelled Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('cancelled')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'cancelled'
              ? isDark
                ? 'bg-gradient-to-tr from-rose-950/40 via-rose-900/10 to-transparent border-rose-500/80 shadow-[0_12px_30px_rgba(239,68,68,0.25)] ring-1 ring-rose-500/30'
                : 'bg-gradient-to-tr from-rose-50 via-rose-50/50 to-white border-rose-400 shadow-[0_12px_30px_rgba(239,68,68,0.12)]'
              : isDark
                ? 'bg-[#0F172A]/70 backdrop-blur-[20px] border-white/[0.08] hover:border-rose-500/30'
                : 'bg-white/85 backdrop-blur-[20px] border-slate-200 hover:border-rose-400/50 shadow-3xs'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-red-500" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              selectedStatFilter === 'cancelled' ? 'text-rose-600 dark:text-rose-300' : 'text-slate-400 dark:text-slate-500'
            }`}>Cancelled</span>
            <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              selectedStatFilter === 'cancelled' ? 'bg-rose-500/15 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className="text-2xl font-black font-mono tracking-tight text-rose-500">{stats.cancelledOrdersCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[8px] font-black">Voided</span>
          </div>
        </button>

        {/* Refunded Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('refunded')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'refunded'
              ? isDark
                ? 'bg-gradient-to-tr from-fuchsia-950/40 via-fuchsia-900/10 to-transparent border-fuchsia-500/80 shadow-[0_12px_30px_rgba(217,70,239,0.25)] ring-1 ring-fuchsia-500/30'
                : 'bg-gradient-to-tr from-fuchsia-50 via-fuchsia-50/50 to-white border-fuchsia-400 shadow-[0_12px_30px_rgba(217,70,239,0.12)]'
              : isDark
                ? 'bg-[#0F172A]/70 backdrop-blur-[20px] border-white/[0.08] hover:border-fuchsia-500/30'
                : 'bg-white/85 backdrop-blur-[20px] border-slate-200 hover:border-fuchsia-400/50 shadow-3xs'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-400 to-pink-500" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              selectedStatFilter === 'refunded' ? 'text-fuchsia-600 dark:text-fuchsia-300' : 'text-slate-400 dark:text-slate-500'
            }`}>Refunded</span>
            <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              selectedStatFilter === 'refunded' ? 'bg-fuchsia-500/15 text-fuchsia-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <RefreshCw className="w-3.5 h-3.5 animate-in spin-in-12" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className="text-2xl font-black font-mono tracking-tight text-fuchsia-500">{stats.refundedOrdersCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black">Returned</span>
          </div>
        </button>

        {/* Total Revenue */}
        <button
          type="button"
          onClick={() => setSelectedStatFilter('completed')}
          className={`p-3.5 rounded-[24px] border flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden cursor-pointer group select-none outline-none ${
            selectedStatFilter === 'revenue_completed' // Optional highlighting if matched
              ? isDark
                ? 'bg-gradient-to-tr from-purple-950/20 via-neutral-900/40 to-neutral-900/60 border-purple-500/50'
                : 'bg-gradient-to-tr from-purple-100 via-slate-50 to-white border-purple-300'
              : isDark
                ? 'bg-gradient-to-tr from-purple-950/20 via-neutral-900/40 to-neutral-900/60 border-purple-500/20 shadow-[0_12px_30px_rgba(124,58,237,0.05)] hover:border-purple-500/40'
                : 'bg-gradient-to-tr from-purple-50 via-slate-50 to-white border-purple-200/65 shadow-2xs hover:border-purple-400/40'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-[#EC4899]" />
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest leading-tight block">Total Revenue</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 transition-transform group-hover:scale-110">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-auto w-full">
            <span className="text-sm font-black font-mono text-emerald-500 truncate max-w-full">
              {formatPrice(stats.totalRevenueSum)}
            </span>
          </div>
        </button>
      </div>

      {/* QUICK SEARCH & COLLAPSIBLE ADVANCED FILTERS BAR */}
      <div className={`p-4 rounded-[20px] border relative z-20 ${
        isDark 
          ? 'bg-[#0F172A] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.25)]' 
          : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)]'
      }`}>
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Quick Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'bn' ? "ইনভয়েস আইডি, ক্রেতার নাম, ইমেল অথবা ফোন দিয়ে খুঁজুন..." : "Quick Search by Invoice ID, Customer name, Email or Phone..."}
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className={`w-full h-11 pl-10 pr-9 rounded-xl text-xs font-medium transition-all duration-300 outline-none ${
                isDark 
                  ? 'bg-[#111827] border-[#374151] text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10' 
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 shadow-3xs'
              }`}
            />
            {quickSearch && (
              <button
                onClick={() => setQuickSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Trigger Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`h-11 px-4 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95 ${
              showAdvancedFilters || filterOrderStatus !== 'all' || filterPaymentStatus !== 'all' || filterPaymentMethod !== 'all' || filterStartDate || filterEndDate || filterMinAmount || filterMaxAmount || filterAssignedStaff !== 'all' || filterOrderType !== 'all' || filterCustomerName || filterInvoiceId
                ? 'bg-purple-600/10 border-purple-500 text-purple-400 hover:bg-purple-600/20' 
                : isDark 
                  ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
            {(filterOrderStatus !== 'all' || filterPaymentStatus !== 'all' || filterPaymentMethod !== 'all' || filterStartDate || filterEndDate || filterMinAmount || filterMaxAmount || filterAssignedStaff !== 'all' || filterOrderType !== 'all' || filterCustomerName || filterInvoiceId) && (
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            )}
          </button>
        </div>

        {/* Collapsible Filters block */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.06]">
                
                {/* 1. Order Status Filter */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Order Status</label>
                  <select
                    value={filterOrderStatus}
                    onChange={(e) => setFilterOrderStatus(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border cursor-pointer transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    <option value="all">All Order States</option>
                    <option value="new">New</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* 2. Payment Status Filter */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Payment Status</label>
                  <select
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border cursor-pointer transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    <option value="all">All Payment States</option>
                    <option value="completed">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* 3. Payment Method Filter */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Payment Method</label>
                  <select
                    value={filterPaymentMethod}
                    onChange={(e) => setFilterPaymentMethod(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border cursor-pointer transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    <option value="all">All Gateways</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="SSLCommerz">SSLCommerz</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="STC Pay">STC Pay</option>
                    <option value="Al Raji Bank">Al Raji Bank</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                {/* 4. Order Type Filter */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Order Type</label>
                  <select
                    value={filterOrderType}
                    onChange={(e) => setFilterOrderType(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border cursor-pointer transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    <option value="all">All Types</option>
                    <option value="Store Product">Store Product</option>
                    <option value="Custom Service">Custom Service</option>
                  </select>
                </div>

                {/* 5. Start Date */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Date Range (Start)</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                {/* 6. End Date */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Date Range (End)</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                {/* 7. Amount range Min */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Min Amount ($)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={filterMinAmount}
                    onChange={(e) => setFilterMinAmount(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                {/* 8. Amount range Max */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Max Amount ($)</label>
                  <input
                    type="number"
                    placeholder="10000.00"
                    value={filterMaxAmount}
                    onChange={(e) => setFilterMaxAmount(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                {/* 9. Assigned Staff */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Assigned Staff</label>
                  <select
                    value={filterAssignedStaff}
                    onChange={(e) => setFilterAssignedStaff(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border cursor-pointer transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    <option value="all">All Staff</option>
                    <option value="Unassigned">Unassigned</option>
                    {staffList.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* 10. Specific customer name filter */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Customer Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Imran"
                    value={filterCustomerName}
                    onChange={(e) => setFilterCustomerName(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                {/* 11. Specific Invoice ID filter */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">Invoice Serial ID</label>
                  <input
                    type="text"
                    placeholder="E.g., INV-2026-0001"
                    value={filterInvoiceId}
                    onChange={(e) => setFilterInvoiceId(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg text-xs font-semibold outline-none border transition ${
                      isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  />
                </div>

                {/* Reset filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterOrderStatus('all');
                      setFilterPaymentStatus('all');
                      setFilterPaymentMethod('all');
                      setFilterStartDate('');
                      setFilterEndDate('');
                      setFilterMinAmount('');
                      setFilterMaxAmount('');
                      setFilterAssignedStaff('all');
                      setFilterOrderType('all');
                      setFilterCustomerName('');
                      setFilterInvoiceId('');
                      triggerToast('🛡️ All filters cleared.');
                    }}
                    className={`w-full h-10 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
                      isDark 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20' 
                        : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ORDERS LIST TABLE WITH STICKY HEADER & CHECKBOX SELECTION */}
      <div className={`p-5 rounded-[24px] border relative z-10 ${
        isDark 
          ? 'bg-[#0F172A] border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.35)]' 
          : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
      }`}>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/[0.06] relative">
          <table className="w-full text-left border-collapse min-w-[1200px] text-xs">
            <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-neutral-900 border-b border-slate-100 dark:border-white/[0.08]">
              <tr className="text-purple-400 font-bold uppercase font-mono text-[10px] tracking-wider">
                {/* 1. Checkbox Select All */}
                <th className="py-3.5 px-4 w-[50px] text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={paginatedOrders.length > 0 && selectedOrderIds.length === paginatedOrders.length}
                      onChange={handleSelectAllToggle}
                      className="w-4 h-4 rounded-md accent-[#7C3AED] cursor-pointer transition"
                    />
                  </div>
                </th>
                
                {/* 2. Invoice ID */}
                <th className="py-3.5 px-3">Invoice ID</th>
                
                {/* 3. Order Date */}
                <th className="py-3.5 px-3">Order Date</th>
                
                {/* 4. Customer details */}
                <th className="py-3.5 px-3">Customer</th>
                
                {/* 5. Purchased Products / Services */}
                <th className="py-3.5 px-3">Products / Services</th>
                
                {/* 6. Paid Price amount */}
                <th className="py-3.5 px-3 text-right">Amount</th>
                
                {/* 7. Payment method */}
                <th className="py-3.5 px-3">Payment Method</th>
                
                {/* 8. Payment status */}
                <th className="py-3.5 px-3">Payment Status</th>
                
                {/* 9. Order status */}
                <th className="py-3.5 px-3">Order Status</th>
                
                {/* 10. Assigned Staff */}
                <th className="py-3.5 px-3">Assigned Staff</th>
                
                {/* 11. Last update */}
                <th className="py-3.5 px-3">Last Updated</th>
                
                {/* 12. Actions */}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {isRefreshing ? (
                // SKELETON LOADER STATE
                [...Array(itemsPerPage)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="w-4 h-4 bg-slate-200 dark:bg-neutral-800 rounded mx-auto" /></td>
                    <td className="py-4 px-3"><div className="w-16 h-4 bg-slate-200 dark:bg-neutral-800 rounded" /></td>
                    <td className="py-4 px-3"><div className="w-24 h-4 bg-slate-200 dark:bg-neutral-800 rounded" /></td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-neutral-800 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="w-20 h-3 bg-slate-200 dark:bg-neutral-800 rounded" />
                          <div className="w-28 h-2 bg-slate-200 dark:bg-neutral-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3"><div className="w-40 h-4 bg-slate-200 dark:bg-neutral-800 rounded" /></td>
                    <td className="py-4 px-3 text-right"><div className="w-14 h-4 bg-slate-200 dark:bg-neutral-800 rounded ml-auto" /></td>
                    <td className="py-4 px-3"><div className="w-20 h-4 bg-slate-200 dark:bg-neutral-800 rounded" /></td>
                    <td className="py-4 px-3"><div className="w-16 h-5 bg-slate-200 dark:bg-neutral-800 rounded-full" /></td>
                    <td className="py-4 px-3"><div className="w-16 h-5 bg-slate-200 dark:bg-neutral-800 rounded-full" /></td>
                    <td className="py-4 px-3"><div className="w-20 h-4 bg-slate-200 dark:bg-neutral-800 rounded" /></td>
                    <td className="py-4 px-3"><div className="w-16 h-3 bg-slate-200 dark:bg-neutral-800 rounded" /></td>
                    <td className="py-4 px-4 text-right"><div className="w-24 h-8 bg-slate-200 dark:bg-neutral-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : paginatedOrders.length === 0 ? (
                // EMPTY STATE
                <tr>
                  <td colSpan={12} className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 border border-purple-500/15 rounded-full flex items-center justify-center mx-auto text-purple-500">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Orders Found</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed">
                        We couldn't locate any billing pipeline transactions matching your customized filtering credentials inside the cloud registry.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // REAL ROW ITERATOR
                paginatedOrders.map((o) => {
                  const cust = resolveCustomer(o);
                  const isChecked = selectedOrderIds.includes(o.id);
                  const orderType = getOrderType(o);

                  // Premium transition styling
                  const transitioningInfo = transitioningOrders[o.id];
                  const isTransitioning = !!transitioningInfo;
                  let transitioningClass = '';
                  if (isTransitioning) {
                    if (transitioningInfo.stage === 'updating') {
                      transitioningClass = 'bg-indigo-500/10 dark:bg-indigo-500/5 animate-pulse ring-1 ring-indigo-500/30';
                    } else if (transitioningInfo.stage === 'success') {
                      if (transitioningInfo.status === 'completed') {
                        transitioningClass = 'bg-emerald-500/10 dark:bg-emerald-500/5 ring-1 ring-emerald-500/30';
                      } else if (transitioningInfo.status === 'refunded') {
                        transitioningClass = 'bg-fuchsia-500/10 dark:bg-fuchsia-500/5 ring-1 ring-fuchsia-500/30';
                      } else if (transitioningInfo.status === 'failed') {
                        transitioningClass = 'bg-rose-500/10 dark:bg-rose-500/5 ring-1 ring-rose-500/30';
                      }
                    }
                  }

                  return (
                    <tr 
                      key={o.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all duration-300 ${
                        isChecked ? 'bg-purple-600/[0.02] dark:bg-purple-500/[0.02]' : ''
                      } ${transitioningClass}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRowToggle(o.id)}
                            className="w-4 h-4 rounded-md accent-[#7C3AED] cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* Invoice ID */}
                      <td className="py-3 px-3 font-mono font-bold">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForInvoiceModal(o)}
                          className="text-purple-500 hover:text-purple-400 hover:underline flex items-center gap-1 focus:outline-none"
                        >
                          <span>{getOrderSerial(o.id)}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-65" />
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 font-mono opacity-80 whitespace-nowrap">
                        {o.date ? o.date.slice(0, 16).replace('T', ' ') : 'N/A'}
                      </td>

                      {/* Customer Details info block */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            className="w-8 h-8 rounded-full border border-slate-200 dark:border-neutral-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left">
                            <span className="font-semibold block truncate max-w-[140px] dark:text-white">{cust.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px] font-mono leading-none">{cust.email}</span>
                            <span className="text-[9px] text-slate-500 block truncate max-w-[140px] font-mono leading-none mt-0.5">{cust.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Purchased Products / Services */}
                      <td className="py-3 px-3">
                        <div className="font-semibold truncate max-w-[180px]" title={o.itemTitle}>{o.itemTitle}</div>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-[8px] font-bold uppercase tracking-wide inline-block mt-1">
                          {orderType}
                        </span>
                      </td>

                      {/* Total Amount Paid */}
                      <td className="py-3 px-3 text-right font-black font-mono text-purple-400 text-sm whitespace-nowrap">
                        {formatPrice(Number(o.price) || 0)}
                      </td>

                      {/* Payment Method Gateway */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold uppercase tracking-wide opacity-80 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {o.paymentMethod || 'SSLCommerz'}
                        </span>
                      </td>

                      {/* Payment Status Badges */}
                      <td className="py-3 px-3">
                        {(() => {
                          if (isTransitioning) {
                            if (transitioningInfo.stage === 'updating') {
                              return (
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-2 py-0.5 w-max font-sans font-bold"
                                >
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-2.5 h-2.5 border-2 border-t-transparent rounded-full border-indigo-400"
                                  />
                                  <span className="text-[8px] tracking-wider uppercase">Updating</span>
                                </motion.div>
                              );
                            } else if (transitioningInfo.stage === 'success') {
                              let bgStyle = 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400';
                              let text = 'PAID';
                              if (transitioningInfo.status === 'refunded') {
                                bgStyle = 'bg-fuchsia-500/15 border-fuchsia-500/25 text-fuchsia-400';
                                text = 'REFUNDED';
                              } else if (transitioningInfo.status === 'failed') {
                                bgStyle = 'bg-rose-500/15 border-rose-500/25 text-rose-400';
                                text = 'CANCELLED';
                              }

                              return (
                                <motion.div
                                  initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
                                  animate={{ scale: [1.2, 1], rotate: [5, 0], opacity: 1 }}
                                  transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
                                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 border font-sans font-bold text-[9px] ${bgStyle}`}
                                >
                                  <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                                  >
                                    ✓
                                  </motion.span>
                                  <span>{text}</span>
                                </motion.div>
                              );
                            }
                          }

                          let style = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                          if (o.paymentStatus === 'completed' || o.paymentStatus === 'paid') {
                            style = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                          } else if (o.paymentStatus === 'failed') {
                            style = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                          } else if (o.paymentStatus === 'refunded') {
                            style = 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20';
                          }
                          return (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans ${style}`}>
                              {o.paymentStatus === 'completed' ? 'Paid' : o.paymentStatus.toUpperCase()}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Order status mapping */}
                      <td className="py-3 px-3">
                        {(() => {
                          const oStatus = o.status || 'new';
                          let style = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
                          if (oStatus === 'completed' || oStatus === 'delivered') {
                            style = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                          } else if (oStatus === 'processing') {
                            style = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                          } else if (oStatus === 'cancelled') {
                            style = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                          }
                          return (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans capitalize ${style}`}>
                              {oStatus}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-slate-400 text-[9px]">
                            <UserCheck className="w-3 h-3" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {o.assignedStaff || 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      {/* Last updated timestamp */}
                      <td className="py-3 px-3 opacity-60 font-mono text-[10px]">
                        Just now
                      </td>

                      {/* Action trigger links */}
                      <td className="py-3 px-4 text-right relative">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          
                          {/* 👁 View button */}
                          <button
                            onClick={() => setSelectedOrderForInspect(o)}
                            className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                              isDark 
                                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                            }`}
                            title="View / Edit Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 🖨 Print button */}
                          <button
                            onClick={() => setSelectedOrderForInvoiceModal(o)}
                            className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                              isDark 
                                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]' 
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                            }`}
                            title="Print / PDF Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* ⋮ More dropdown menu handler */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRowMenuId(prev => prev === o.id ? null : o.id);
                              }}
                              className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                                isDark 
                                  ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white' 
                                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-3xs'
                              }`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown element */}
                            {activeRowMenuId === o.id && (
                              <div className={`absolute z-50 right-0 mt-1.5 w-44 rounded-xl border p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                                isDark 
                                  ? 'bg-neutral-900 border-neutral-800 text-white shadow-black/40' 
                                  : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/20'
                              }`}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForInspect(o)}
                                  className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-150 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer font-bold"
                                >
                                  <Edit className="w-3.5 h-3.5 text-purple-400" />
                                  <span>{isStaffViewOnly ? 'View Details' : 'Edit Order'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForInvoiceModal(o)}
                                  className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-150 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer font-bold"
                                >
                                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                                  <span>View Invoice</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTriggerWhatsApp(o)}
                                  className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-neutral-150 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer font-bold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp Message</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const cust = resolveCustomer(o);
                                    setEmailReceiptTargetEmail(cust.email);
                                    setSelectedOrderForEmailReceipt(o);
                                    setEmailReceiptResult(null);
                                    setActiveRowMenuId(null);
                                  }}
                                  className="w-full text-left text-xs px-2.5 py-2 rounded-lg hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center gap-2 cursor-pointer font-bold transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Email Receipt</span>
                                </button>

                                {/* Restrict edit options for Staff users according to permissions schema */}
                                {!isStaffViewOnly && (
                                  <>
                                    <div className="border-t border-slate-100 dark:border-white/[0.06] my-1" />
                                    
                                    <div className="px-2 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                                      Quick Set Status
                                    </div>

                                    <button
                                      type="button"
                                      disabled={o.paymentStatus === 'completed'}
                                      onClick={() => {
                                        triggerStatusUpdateWithAnimation(o.id, 'completed');
                                      }}
                                      className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer font-semibold ${
                                        o.paymentStatus === 'completed' ? 'opacity-40 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>Mark Paid</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled={o.paymentStatus === 'refunded'}
                                      onClick={() => {
                                        triggerStatusUpdateWithAnimation(o.id, 'refunded');
                                      }}
                                      className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-fuchsia-500/10 hover:text-fuchsia-400 flex items-center gap-1.5 cursor-pointer font-semibold ${
                                        o.paymentStatus === 'refunded' ? 'opacity-40 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <Clock className="w-3 h-3 text-fuchsia-400" />
                                      <span>Mark Refunded</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled={o.paymentStatus === 'failed'}
                                      onClick={() => {
                                        setConfirmDialog({
                                          isOpen: true,
                                          type: 'cancel_single',
                                          title: 'Cancel Order Invoice?',
                                          description: `Are you absolutely sure you want to cancel Invoice #${getOrderSerial(o.id)} for ${o.itemTitle}? This updates payment state callback as Failed.`,
                                          targetId: o.id
                                        });
                                      }}
                                      className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 flex items-center gap-1.5 cursor-pointer font-semibold ${
                                        o.paymentStatus === 'failed' ? 'opacity-40 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <X className="w-3 h-3 text-rose-400" />
                                      <span>Cancel Order</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
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

        {/* PAGINATION DECK CONTROLLER */}
        {sortedAndFilteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.08] relative z-10 text-xs">
            {/* items count */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">{language === 'bn' ? 'প্রতি পাতায় প্রদর্শন:' : 'Show per page:'}</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`h-8 text-xs font-bold rounded-lg px-2 outline-none border cursor-pointer ${
                  isDark 
                    ? 'bg-neutral-900 border-neutral-800 text-white' 
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                {[10, 20, 35, 50].map((val) => (
                  <option key={val} value={val}>{val} entries</option>
                ))}
              </select>
              <span className="text-slate-500 font-medium font-mono">
                Showing {Math.min(sortedAndFilteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}-
                {Math.min(sortedAndFilteredOrders.length, currentPage * itemsPerPage)} of {sortedAndFilteredOrders.length}
              </span>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  currentPage === 1 
                    ? 'opacity-40 cursor-not-allowed border-transparent' 
                    : isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08]' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = currentPage === pageNum;
                // Only show localized pages
                if (totalPages > 5 && Math.abs(currentPage - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                  return pageNum === 2 || pageNum === totalPages - 1 ? <span key={pageNum} className="px-1 text-slate-400">...</span> : null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition border cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white border-transparent shadow'
                        : isDark
                          ? 'bg-white/[0.02] border-white/[0.05] hover:border-neutral-700 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  currentPage === totalPages 
                    ? 'opacity-40 cursor-not-allowed border-transparent' 
                    : isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08]' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FLOATABLE BULK ACTION DOCK BAR */}
      <AnimatePresence>
        {selectedOrderIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-2xl w-full px-4"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.12] rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3 pl-2">
                <span className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-black">
                  {selectedOrderIds.length}
                </span>
                <span className="font-bold text-slate-300">{language === 'bn' ? 'অর্ডার নির্বাচন করা হয়েছে' : 'rows selected'}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* 1. Change status bulk option */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBulkStatusMenu(!showBulkStatusMenu);
                      setShowBulkStaffMenu(false);
                    }}
                    className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.08] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
                  >
                    <span>Change Status</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {showBulkStatusMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#111827] border border-white/[0.08] rounded-xl p-1 shadow-2xl flex flex-col gap-0.5">
                      <div className="px-2 py-1 text-[8px] font-black text-slate-500 uppercase font-sans">Payment States</div>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            type: 'status_bulk',
                            title: 'Bulk Update to PAID?',
                            description: `This will mark payments for ${selectedOrderIds.length} checked invoices as COMPLETED.`,
                            targetStatus: 'completed'
                          });
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 font-semibold"
                      >
                        Set Status: Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            type: 'status_bulk',
                            title: 'Bulk Update to REFUNDED?',
                            description: `This will mark payments for ${selectedOrderIds.length} checked invoices as REFUNDED.`,
                            targetStatus: 'refunded'
                          });
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-fuchsia-500/10 hover:text-fuchsia-400 font-semibold"
                      >
                        Set Status: Refunded
                      </button>

                      <div className="h-px bg-white/[0.06] my-1" />
                      <div className="px-2 py-1 text-[8px] font-black text-slate-500 uppercase font-sans">Pipeline States</div>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            type: 'status_bulk',
                            title: 'Bulk Update to PROCESSING?',
                            description: `This will mark pipeline progress for ${selectedOrderIds.length} checked orders as Processing.`,
                            targetStatus: 'processing'
                          });
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-blue-500/10 hover:text-blue-400 font-semibold"
                      >
                        Pipeline: Processing
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Assign staff bulk option */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBulkStaffMenu(!showBulkStaffMenu);
                      setShowBulkStatusMenu(false);
                    }}
                    className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.08] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
                  >
                    <span>Assign Staff</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {showBulkStaffMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#111827] border border-white/[0.08] rounded-xl p-1 shadow-2xl flex flex-col gap-0.5">
                      <div className="px-2 py-1 text-[8px] font-black text-slate-500 uppercase font-sans">Active Staff Members</div>
                      {staffList.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              type: 'staff_bulk',
                              title: `Assign Staff: ${st}?`,
                              description: `Assign ${st} as the active processor for ${selectedOrderIds.length} checked invoices.`,
                              targetStaff: st
                            });
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-purple-500/10 hover:text-purple-400 font-semibold"
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Export CSV checked rows */}
                <button
                  type="button"
                  onClick={() => handleExportCSV(orders.filter(o => selectedOrderIds.includes(o.id)))}
                  className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-xl transition cursor-pointer"
                  title="Export selected rows to CSV"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                </button>

                {/* 4. Delete bulk checked rows */}
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      type: 'delete_bulk',
                      title: 'Purge Selected Records?',
                      description: `Are you absolutely sure you want to permanently delete ${selectedOrderIds.length} checked orders? This is irreversible and prunes databases permanently.`,
                    });
                  }}
                  className="p-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/20 rounded-xl transition cursor-pointer"
                  title="Permanently Purge Selected Orders"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </button>

                {/* 5. Clear Checked */}
                <button
                  type="button"
                  onClick={() => setSelectedOrderIds([])}
                  className="px-3 py-1.5 text-slate-400 hover:text-white font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPREHENSIVE ORDER DETAILS FLOATING DRAWER (Stripe / Linear Inspired) */}
      <AnimatePresence>
        {inspectingOrder && (() => {
          const cust = resolveCustomer(inspectingOrder);
          const orderType = getOrderType(inspectingOrder);
          const activeLogs = getOrderLogs(inspectingOrder.id);

          return (
            <div className="fixed inset-0 z-[200] flex justify-end">
              {/* Overlay backdrop with blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setInspectingOrder(null)}
                className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`relative w-full max-w-2xl h-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-l flex flex-col justify-between text-left ${
                  isDark ? 'bg-[#0F172A] border-white/[0.08] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Header design bar */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500" />

                {/* Top Section */}
                <div className="p-6 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between mt-1">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">Invoice Inspect Engine</span>
                    <h3 className="text-lg font-black tracking-tight mt-1 flex items-center gap-1.5">
                      <span>Invoice Receipt</span>
                      <span className="text-purple-500 font-mono font-black">{getOrderSerial(inspectingOrder.id)}</span>
                    </h3>
                  </div>

                  <button
                    onClick={() => setInspectingOrder(null)}
                    className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tab select bar */}
                <div className="px-6 border-b border-slate-100 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.01] flex items-center gap-4 text-xs font-bold text-slate-400">
                  <button
                    onClick={() => setDrawerActiveTab('details')}
                    className={`py-3.5 border-b-2 transition-all ${
                      drawerActiveTab === 'details' ? 'border-purple-500 text-purple-500' : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    📋 Overview Details
                  </button>
                  <button
                    onClick={() => setDrawerActiveTab('timeline')}
                    className={`py-3.5 border-b-2 transition-all ${
                      drawerActiveTab === 'timeline' ? 'border-purple-500 text-purple-500' : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    ⏳ Activity Timeline
                  </button>
                  <button
                    onClick={() => setDrawerActiveTab('invoice')}
                    className={`py-3.5 border-b-2 transition-all ${
                      drawerActiveTab === 'invoice' ? 'border-purple-500 text-purple-500' : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    📄 Invoice Live Preview
                  </button>
                  <button
                    onClick={() => {
                      setDrawerActiveTab('receipt');
                      if (inspectingOrder) {
                        const cust = resolveCustomer(inspectingOrder);
                        setEmailReceiptTargetEmail(cust.email);
                      }
                    }}
                    className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                      drawerActiveTab === 'receipt' ? 'border-cyan-500 text-cyan-400' : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>📧 Email Receipt Trigger</span>
                  </button>
                </div>

                {/* Middle scrollable area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {drawerActiveTab === 'details' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Section 1: Customer info cards */}
                      <div className="space-y-2.5 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Customer Information</span>
                        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50/50 border-slate-100'}`}>
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            className="w-12 h-12 rounded-full border border-slate-200 dark:border-neutral-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left space-y-0.5">
                            <h4 className="font-bold text-sm dark:text-white flex items-center gap-2">
                              <span>{cust.name}</span>
                              {inspectingOrder.companyCategory && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {inspectingOrder.companyCategory}
                                </span>
                              )}
                            </h4>
                            <p className="text-xs font-mono text-slate-400">{cust.email}</p>
                            <p className="text-xs font-mono text-slate-500">{cust.phone}</p>
                            {inspectingOrder.companyName && (
                              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-0.5">
                                <span>🏢 {inspectingOrder.companyName}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Billing specs */}
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Billing Summary</span>
                          <div className={`p-4 rounded-xl border space-y-2 text-xs font-semibold ${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50/50 border-slate-100'}`}>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Payment Gateway:</span>
                              <span className="font-mono">{inspectingOrder.paymentMethod || 'bKash'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Method Code:</span>
                              <span className="font-mono text-[10px] text-purple-400 uppercase font-black">Online Settlement</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Transaction ID:</span>
                              <span className="font-mono text-[10px] truncate max-w-[120px]" title={inspectingOrder.transactionId}>
                                {inspectingOrder.transactionId || 'TXN-SIMULATED'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Receipt Stats</span>
                          <div className={`p-4 rounded-xl border space-y-2 text-xs font-semibold ${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50/50 border-slate-100'}`}>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Order Status:</span>
                              <span className="capitalize">{inspectingOrder.status || 'new'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Payment Status:</span>
                              <span>{inspectingOrder.paymentStatus.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Assigned To:</span>
                              <span>{inspectingOrder.assignedStaff || 'Unassigned'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Products / Services details */}
                      <div className="space-y-1.5 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Purchased Products / Services</span>
                        <div className={`p-4 rounded-xl border divide-y divide-slate-100 dark:divide-white/[0.05] ${isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50/50 border-slate-100'}`}>
                          <div className="flex justify-between py-1.5 text-xs font-semibold">
                            <div className="text-left">
                              <p className="font-bold text-slate-800 dark:text-slate-100">{inspectingOrder.itemTitle}</p>
                              <span className="text-[10px] text-slate-400">Class taxonomy: {orderType}</span>
                            </div>
                            <span className="font-mono text-purple-400">{formatPrice(inspectingOrder.price)}</span>
                          </div>

                          <div className="flex justify-between py-2 text-xs font-semibold pt-3">
                            <span className="text-slate-400 font-bold">Total Paid Gross:</span>
                            <span className="font-mono font-black text-emerald-500 text-sm">{formatPrice(inspectingOrder.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Notes and Comments */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Notes & Comments</span>
                        <div className="space-y-2.5">
                          {inspectingOrder.orderNotes && (
                            <div className={`p-3.5 rounded-xl border text-xs font-medium font-mono leading-relaxed whitespace-pre-wrap ${
                              isDark ? 'bg-amber-500/5 border-amber-500/10 text-amber-300' : 'bg-amber-50/50 border-amber-100 text-amber-850'
                            }`}>
                              {inspectingOrder.orderNotes}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type internal client notes..."
                              value={newOrderNote}
                              onChange={(e) => setNewOrderNote(e.target.value)}
                              className={`flex-1 h-10 px-3.5 rounded-xl text-xs font-medium outline-none border transition ${
                                isDark ? 'bg-[#111827] border-[#374151] text-white' : 'bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddOrderNote(inspectingOrder.id)}
                              className="px-4 h-10 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shrink-0 cursor-pointer active:scale-95 shadow-md shadow-purple-500/15"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add Note</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {drawerActiveTab === 'timeline' && (
                    <div className="space-y-5 animate-in fade-in duration-200 text-left">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">System Audit Log History</span>
                      </div>

                      <div className="relative pl-6 border-l-2 border-slate-100 dark:border-white/[0.06] space-y-6">
                        {activeLogs.map((log: any, idx: number) => (
                          <div key={log.id} className="relative">
                            {/* Dot icon */}
                            <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              log.event === 'Note Added' 
                                ? 'bg-amber-500 border-amber-300' 
                                : 'bg-purple-500 border-purple-300'
                            }`} />

                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black dark:text-white">{log.event}</span>
                                <span className="text-[10px] font-mono text-slate-400">{log.date}</span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                                {log.desc}
                              </p>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-500 font-bold uppercase tracking-wider inline-block">
                                Author: {log.author}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {drawerActiveTab === 'invoice' && (
                    <div className="h-full min-h-[450px] flex flex-col space-y-3 animate-in fade-in duration-200 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">HTML Live Invoice Rendering</span>
                        <button
                          onClick={() => setSelectedOrderForInvoiceModal(inspectingOrder)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition active:scale-95"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Trigger Official Print Modal</span>
                        </button>
                      </div>

                      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/[0.08] min-h-[350px] bg-white relative">
                        {/* Simulate invoice loading structure */}
                        <iframe
                          title="HTML Drawer Invoice Preview"
                          srcDoc={`
                            <html>
                              <head>
                                <style>
                                  body { font-family: sans-serif; padding: 24px; color: #333; line-height: 1.5; }
                                  .header { border-bottom: 2px solid #7C3AED; padding-bottom: 12px; margin-bottom: 18px; }
                                  .title { font-size: 20px; font-weight: bold; color: #7C3AED; }
                                  .info-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; }
                                  .table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 11px; }
                                  .table th { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
                                  .table td { border-bottom: 1px solid #eee; padding: 8px; }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div class="title">OFFICIAL INVOICE RECEIPT</div>
                                  <div style="font-size:10px; opacity:0.7;">Invoice Serial: ${getOrderSerial(inspectingOrder.id)}</div>
                                </div>
                                <div class="info-row">
                                  <span><strong>Customer:</strong> ${cust.name}</span>
                                  <span><strong>Date:</strong> ${inspectingOrder.date || 'N/A'}</span>
                                </div>
                                <div class="info-row">
                                  <span><strong>Email:</strong> ${cust.email}</span>
                                  <span><strong>Method:</strong> ${inspectingOrder.paymentMethod || 'SSLCommerz'}</span>
                                </div>
                                <table class="table">
                                  <thead>
                                    <tr>
                                      <th>Item Purchased</th>
                                      <th style="text-align:right;">Total Paid</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>${inspectingOrder.itemTitle}</td>
                                      <td style="text-align:right;"><strong>$${inspectingOrder.price}</strong></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </body>
                            </html>
                          `}
                          className="w-full h-full bg-white border-0"
                        />
                      </div>
                    </div>
                  )}

                  {drawerActiveTab === 'receipt' && (() => {
                    const activeSummary = formatOrderSummary(inspectingOrder, {
                      customerName: cust.name,
                      customerEmail: emailReceiptTargetEmail || cust.email,
                      customerPhone: cust.phone,
                      currency: 'USD'
                    });
                    const receiptHtml = generateReceiptHtml(activeSummary);
                    const receiptPlain = generateReceiptPlainText(activeSummary);

                    return (
                      <div className="h-full min-h-[480px] flex flex-col space-y-4 animate-in fade-in duration-200 text-left">
                        {/* Control header bar */}
                        <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono block">
                                Trigger Order Email Receipt Workflow
                              </span>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Formats order summary using utilities & simulates client HTML confirmation email transmission.
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={emailReceiptSending}
                              onClick={() => handleTriggerEmailReceipt(inspectingOrder, emailReceiptTargetEmail || cust.email)}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-md shadow-cyan-500/20 active:scale-95 shrink-0"
                            >
                              {emailReceiptSending ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                                  />
                                  <span>Simulating Dispatch...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Trigger Email Receipt</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Recipient Target Input & Meta */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.06] text-xs">
                            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                              <span className="text-slate-400 text-[11px] font-semibold">Recipient:</span>
                              <input
                                type="email"
                                value={emailReceiptTargetEmail || cust.email}
                                onChange={(e) => setEmailReceiptTargetEmail(e.target.value)}
                                placeholder="customer@example.com"
                                className="flex-1 px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                              />
                            </div>

                            {/* View switcher */}
                            <div className="flex items-center gap-1 bg-slate-200 dark:bg-white/[0.05] p-0.5 rounded-lg text-[11px]">
                              <button
                                type="button"
                                onClick={() => setEmailReceiptViewMode('preview')}
                                className={`px-2.5 py-1 rounded-md font-bold transition ${
                                  emailReceiptViewMode === 'preview'
                                    ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                }`}
                              >
                                HTML Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => setEmailReceiptViewMode('text')}
                                className={`px-2.5 py-1 rounded-md font-bold transition ${
                                  emailReceiptViewMode === 'text'
                                    ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                }`}
                              >
                                Plain Text
                              </button>
                            </div>
                          </div>

                          {/* Transmission status feedback indicator */}
                          {emailReceiptResult && (
                            <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span>
                                  Dispatched to <strong>{emailReceiptResult.recipientEmail}</strong> via {emailReceiptResult.details?.deliveryChannel || 'Simulated SMTP Relay'}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] opacity-75">{emailReceiptResult.receiptNumber}</span>
                            </div>
                          )}
                        </div>

                        {/* Interactive Viewer Body */}
                        <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] min-h-[420px] bg-white relative">
                          {emailReceiptViewMode === 'preview' ? (
                            <iframe
                              title="Live HTML Email Receipt Preview"
                              srcDoc={receiptHtml}
                              className="w-full h-full min-h-[420px] bg-slate-900 border-0"
                            />
                          ) : (
                            <pre className="p-4 text-xs font-mono bg-slate-950 text-emerald-400 whitespace-pre-wrap overflow-x-auto h-full min-h-[420px]">
                              {receiptPlain}
                            </pre>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Footer action tools */}
                <div className="p-6 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-end gap-3">
                  <button
                    onClick={() => setInspectingOrder(null)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                      isDark 
                        ? 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]' 
                        : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Close Drawer
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const cust = resolveCustomer(inspectingOrder);
                      setEmailReceiptTargetEmail(cust.email);
                      setSelectedOrderForEmailReceipt(inspectingOrder);
                      setEmailReceiptResult(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedOrderForInspect(inspectingOrder);
                      setInspectingOrder(null);
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded-xl text-xs font-bold cursor-pointer transition active:scale-95 shadow-lg shadow-purple-500/15"
                  >
                    Edit Order Properties
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* COMPREHENSIVE ENTERPRISE DIALOG MODALS FOR DELETES & CONFIRMATIONS */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(null)}
              className="absolute inset-0 bg-neutral-950/65 backdrop-blur-md"
            />

            {/* Dialog body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative max-w-md w-full p-6 rounded-[24px] border shadow-[0_25px_60px_rgba(0,0,0,0.5)] text-left overflow-hidden ${
                isDark 
                  ? 'bg-[#111827] border-white/[0.08] text-white' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Premium Top Line bar */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500" />

              <div className="flex items-start gap-4 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>

                <div className="space-y-1.5 flex-1 text-left">
                  <h4 className="text-base font-black tracking-tight font-sans">
                    {confirmDialog.title}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-medium">
                    {confirmDialog.description}
                  </p>
                  <p className="text-[10px] text-amber-500 font-extrabold uppercase font-mono tracking-widest">
                    ⚠️ Confirmation Required
                  </p>
                </div>
              </div>

              {/* Action trigger links */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer active:scale-95 ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.06]' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  No, Go Back
                </button>

                <button
                  type="button"
                  onClick={handleExecuteAction}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition active:scale-95 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  Yes, Confirm Action
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEDICATED EMAIL RECEIPT WORKFLOW MODAL */}
      <AnimatePresence>
        {selectedOrderForEmailReceipt && (() => {
          const cust = resolveCustomer(selectedOrderForEmailReceipt);
          const activeSummary = formatOrderSummary(selectedOrderForEmailReceipt, {
            customerName: cust.name,
            customerEmail: emailReceiptTargetEmail || cust.email,
            customerPhone: cust.phone,
            currency: 'USD'
          });
          const receiptHtml = generateReceiptHtml(activeSummary);
          const receiptPlain = generateReceiptPlainText(activeSummary);

          return (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
              {/* Overlay backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrderForEmailReceipt(null)}
                className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={`relative max-w-3xl w-full max-h-[90vh] rounded-[24px] border shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col text-left overflow-hidden ${
                  isDark ? 'bg-[#0F172A] border-white/[0.1] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Specular Top Bar Accent */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black tracking-tight">Order Email Receipt Trigger</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {activeSummary.receiptNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Verified payment receipt confirmation workflow & client HTML preview
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrderForEmailReceipt(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Subheader controls */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <span className="text-slate-400 font-semibold text-[11px]">Send to:</span>
                    <input
                      type="email"
                      value={emailReceiptTargetEmail || cust.email}
                      onChange={(e) => setEmailReceiptTargetEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="flex-1 max-w-sm px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-200 dark:bg-white/[0.06] p-0.5 rounded-lg text-[11px]">
                      <button
                        type="button"
                        onClick={() => setEmailReceiptViewMode('preview')}
                        className={`px-3 py-1 rounded-md font-bold transition ${
                          emailReceiptViewMode === 'preview'
                            ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        HTML Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailReceiptViewMode('text')}
                        className={`px-3 py-1 rounded-md font-bold transition ${
                          emailReceiptViewMode === 'text'
                            ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        Plain Text
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={emailReceiptSending}
                      onClick={() => handleTriggerEmailReceipt(selectedOrderForEmailReceipt, emailReceiptTargetEmail || cust.email)}
                      className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md shadow-cyan-500/20 active:scale-95"
                    >
                      {emailReceiptSending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Simulating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Simulate Send Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Transmission outcome notification if sent */}
                {emailReceiptResult && (
                  <div className="mx-5 mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>
                        HTML Receipt simulated and sent to <strong>{emailReceiptResult.recipientEmail}</strong> via {emailReceiptResult.details?.deliveryChannel || 'Simulated SMTP Engine'}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] opacity-80">{emailReceiptResult.timestamp}</span>
                  </div>
                )}

                {/* Modal Main Preview Viewport */}
                <div className="flex-1 overflow-hidden p-5 min-h-[400px]">
                  <div className="w-full h-[460px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-white">
                    {emailReceiptViewMode === 'preview' ? (
                      <iframe
                        title="HTML Order Confirmation Receipt"
                        srcDoc={receiptHtml}
                        className="w-full h-full bg-slate-900 border-0"
                      />
                    ) : (
                      <pre className="p-4 text-xs font-mono bg-slate-950 text-emerald-400 whitespace-pre-wrap overflow-y-auto h-full">
                        {receiptPlain}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between text-xs">
                  <div className="text-slate-400 font-mono text-[11px]">
                    Status: <span className="text-emerald-400 font-bold">✓ PAYMENT VERIFIED</span> &bull; TrxID: {activeSummary.transactionId}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(receiptHtml);
                        triggerToast('📋 HTML template copied to clipboard!');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Copy HTML Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForEmailReceipt(null)}
                      className="px-4 py-1.5 bg-slate-200 dark:bg-white/[0.08] hover:bg-slate-300 dark:hover:bg-white/[0.12] rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
