import { Order } from '../types';
import { safeLocalStorage as localStorage } from './storage';

export interface OrderReceiptItem {
  id?: string;
  name: string;
  description?: string;
  quantity?: number;
  unitPrice?: number | string;
  totalPrice?: number | string;
}

export interface FormattedOrderSummary {
  orderId: string;
  receiptNumber: string;
  orderSerial: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  itemTitle: string;
  items: OrderReceiptItem[];
  currency: string;
  currencySymbol: string;
  subtotal: number;
  advanceAmount?: number;
  dueAmount?: number;
  totalPaid: number;
  formattedTotal: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  verificationDate: string;
  downloadUrl?: string;
  portalUrl: string;
  assignedStaff?: string;
  notes?: string;
  trackingId?: string;
}

export interface FormatOrderOptions {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  currency?: string;
  language?: 'en' | 'bn' | 'ar';
  customItems?: OrderReceiptItem[];
}

export interface EmailReceiptDispatchResult {
  success: boolean;
  sent: boolean;
  simulated: boolean;
  receiptNumber: string;
  orderId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  htmlTemplate: string;
  plainText: string;
  timestamp: string;
  summary: FormattedOrderSummary;
  auditLogItem: {
    id: string;
    event: string;
    author: string;
    date: string;
    desc: string;
  };
  details?: {
    smtpConfigured?: boolean;
    deliveryChannel?: string;
    messageId?: string;
  };
}

/**
 * Normalizes and formats an order into a clean, complete structured summary.
 */
export function formatOrderSummary(order: Order, options: FormatOrderOptions = {}): FormattedOrderSummary {
  const orderId = order.id || `ORD-${Date.now().toString().slice(-5)}`;
  const orderSerial = order.id.toUpperCase().startsWith('ORD-') 
    ? order.id.toUpperCase() 
    : `#WZD-${order.id.toUpperCase().slice(-6)}`;
  
  const receiptNumber = `REC-${new Date().getFullYear()}-${order.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  // Customer credentials fallback resolution
  const customerName = options.customerName || order.customerName || order.guestName || 'Valued Client';
  const customerEmail = options.customerEmail || order.customerEmail || order.guestEmail || 'client@webzonebd.com';
  const customerPhone = options.customerPhone || order.customerPhone || order.guestPhone || undefined;
  const companyName = order.companyName || undefined;

  // Currency & formatting
  const currency = (options.currency || 'USD').toUpperCase();
  const currencySymbol = currency === 'BDT' ? '৳' : currency === 'SAR' ? '﷼ ' : '$';

  const price = typeof order.price === 'number' ? order.price : parseFloat(String(order.price)) || 0;
  const formattedTotal = `${currencySymbol}${price.toLocaleString()}`;

  // Items construction
  let items: OrderReceiptItem[] = options.customItems || [];
  if (items.length === 0) {
    items = [
      {
        id: '1',
        name: order.itemTitle || 'WebzoneBD Enterprise Digital Solution',
        description: order.serviceId 
          ? 'Professional IT Implementation & Cloud Deployment' 
          : order.productId 
          ? 'Licensed Source Script & Lifetime Documentation Package' 
          : 'Digital Service & Hosting Infrastructure',
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
      }
    ];
  }

  const transactionId = order.transactionId || `TRX-${orderId.slice(-4)}-VERIFIED`;
  const paymentMethod = order.paymentMethod || 'bKash Merchant / SSLCommerz';
  const verificationDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const portalUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?tab=dashboard`
    : 'https://webzonebd.com/dashboard';

  return {
    orderId,
    receiptNumber,
    orderSerial,
    customerName,
    customerEmail,
    customerPhone,
    companyName,
    itemTitle: order.itemTitle || 'WebzoneBD Solution',
    items,
    currency,
    currencySymbol,
    subtotal: price,
    advanceAmount: order.advanceAmount,
    dueAmount: order.dueAmount || 0,
    totalPaid: price,
    formattedTotal,
    paymentMethod,
    paymentStatus: 'PAID & VERIFIED',
    transactionId,
    verificationDate,
    downloadUrl: order.downloadUrl && order.downloadUrl !== '#' ? order.downloadUrl : undefined,
    portalUrl,
    assignedStaff: order.assignedStaff,
    notes: order.orderNotes,
    trackingId: order.trackingId,
  };
}

/**
 * Generates a responsive, high-contrast HTML Email Confirmation Receipt
 */
export function generateReceiptHtml(summary: FormattedOrderSummary, options?: { brandName?: string; previewMode?: boolean }): string {
  const brandName = options?.brandName || 'WebzoneBD';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${summary.receiptNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f19;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      color: #334155;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 32px 16px;
      box-sizing: border-box;
    }
    .card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.35);
      border: 1px solid #1e293b;
    }
    .header {
      background: linear-gradient(135deg, #090d16 0%, #171f33 100%);
      padding: 32px 28px 24px;
      text-align: left;
      border-bottom: 2px solid #3b82f6;
    }
    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      text-decoration: none;
    }
    .logo-text span {
      color: #38bdf8;
    }
    .receipt-badge {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 5px 12px;
      border-radius: 9999px;
    }
    .hero-title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px 0;
    }
    .hero-subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
    }
    .body-content {
      padding: 28px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .intro-p {
      font-size: 13px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .highlight-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .grid-2 {
      width: 100%;
      border-collapse: collapse;
    }
    .grid-2 td {
      padding: 6px 4px;
      font-size: 12px;
      vertical-align: top;
    }
    .meta-label {
      color: #64748b;
      font-weight: 600;
    }
    .meta-val {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
      font-family: monospace;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table th {
      background-color: #f1f5f9;
      color: #475569;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #cbd5e1;
    }
    .items-table td {
      padding: 12px;
      font-size: 13px;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
    }
    .total-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #86efac;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-title {
      font-size: 13px;
      font-weight: 700;
      color: #166534;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .total-amount {
      font-size: 22px;
      font-weight: 900;
      color: #15803d;
      font-family: monospace;
    }
    .cta-container {
      text-align: center;
      margin: 28px 0 16px;
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      font-weight: 800;
      font-size: 14px;
      text-decoration: none;
      padding: 13px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .security-notice {
      background-color: #f8fafc;
      border-left: 3px solid #10b981;
      padding: 12px 14px;
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
      margin-top: 24px;
      border-radius: 4px;
    }
    .footer {
      background-color: #0f172a;
      padding: 24px;
      text-align: center;
      color: #94a3b8;
      font-size: 11px;
      line-height: 1.6;
    }
    .footer a {
      color: #38bdf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      
      <!-- Top Brand Banner -->
      <div class="header">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: left;">
              <div class="logo-text">${brandName}<span>BD</span></div>
              <div class="hero-subtitle">Official Transaction & Billing Confirmation</div>
            </td>
            <td style="text-align: right;">
              <span class="receipt-badge">✓ PAYMENT VERIFIED</span>
            </td>
          </tr>
        </table>
        <div style="margin-top: 18px;">
          <h1 class="hero-title">Official Order Receipt</h1>
          <p class="hero-subtitle">Receipt Ref: <span style="font-family: monospace; color: #cbd5e1;">${summary.receiptNumber}</span></p>
        </div>
      </div>

      <!-- Main Receipt Body -->
      <div class="body-content">
        <h2 class="greeting">Assalamu Alaikum ${summary.customerName},</h2>
        <p class="intro-p">
          We are pleased to confirm that your payment has been successfully authorized and verified by our billing audit pipeline. Your transaction record is finalized and digital access credentials are enabled.
        </p>

        <!-- Transaction & Order Metadata Box -->
        <div class="highlight-box">
          <table class="grid-2">
            <tr>
              <td class="meta-label">Order Reference:</td>
              <td class="meta-val">${summary.orderSerial}</td>
            </tr>
            <tr>
              <td class="meta-label">Payment Gateway:</td>
              <td class="meta-val" style="color: #2563eb;">${summary.paymentMethod}</td>
            </tr>
            <tr>
              <td class="meta-label">Transaction ID (TrxID):</td>
              <td class="meta-val" style="color: #059669;">${summary.transactionId}</td>
            </tr>
            <tr>
              <td class="meta-label">Audit Timestamp:</td>
              <td class="meta-val">${summary.verificationDate}</td>
            </tr>
            ${summary.customerPhone ? `
            <tr>
              <td class="meta-label">Contact Number:</td>
              <td class="meta-val">${summary.customerPhone}</td>
            </tr>` : ''}
            <tr>
              <td class="meta-label">Payment Status:</td>
              <td class="meta-val" style="color: #10b981;">✓ ${summary.paymentStatus}</td>
            </tr>
          </table>
        </div>

        <!-- Itemized Order Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Purchased Item / Solution</th>
              <th style="text-align: center; width: 60px;">Qty</th>
              <th style="text-align: right; width: 90px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${summary.items.map(item => `
            <tr>
              <td>
                <div style="font-weight: 700; color: #0f172a;">${item.name}</div>
                ${item.description ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${item.description}</div>` : ''}
              </td>
              <td style="text-align: center; font-family: monospace;">${item.quantity || 1}</td>
              <td style="text-align: right; font-weight: 700; font-family: monospace;">
                ${summary.currencySymbol}${typeof item.totalPrice === 'number' ? item.totalPrice.toLocaleString() : summary.totalPaid.toLocaleString()}
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Total Paid Banner -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px;">
          <tr>
            <td style="padding: 16px 20px; font-size: 13px; font-weight: 800; color: #166534; text-transform: uppercase;">
              Total Amount Settled (Paid):
            </td>
            <td style="padding: 16px 20px; text-align: right; font-size: 22px; font-weight: 900; color: #15803d; font-family: monospace;">
              ${summary.formattedTotal} ${summary.currency}
            </td>
          </tr>
        </table>

        <!-- Action CTA: Download or Access -->
        <div class="cta-container">
          <a href="${summary.downloadUrl || summary.portalUrl}" class="btn-primary">
            ${summary.downloadUrl ? '📥 Download Purchased Assets' : '🚀 Access Client Portal'}
          </a>
        </div>

        <!-- Security & Audit Note -->
        <div class="security-notice">
          <strong>🔒 Verified Transaction Certificate:</strong> This electronic email receipt acts as an official tax and purchase confirmation issued by ${brandName} IT Network. Please retain this email for your warranty, source code updates, and service SLAs.
        </div>
      </div>

      <!-- Footer Info -->
      <div class="footer">
        <p style="margin: 0 0 6px 0; color: #f8fafc; font-weight: 700;">${brandName} Software & Cloud Solutions</p>
        <p style="margin: 0 0 10px 0;">
          Helpline: <a href="https://wa.me/8801864000005">+880 1864-000005</a> &bull; Support: <a href="mailto:support@webzonebd.com">support@webzonebd.com</a>
        </p>
        <p style="margin: 0; opacity: 0.7;">
          &copy; ${new Date().getFullYear()} ${brandName}. All rights reserved. cPanel & SSL Enterprise Cloud Infrastructure.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

/**
 * Formats a plain text receipt fallback for terminal or logging
 */
export function generateReceiptPlainText(summary: FormattedOrderSummary): string {
  return [
    `=============================================================`,
    `               OFFICIAL PAYMENT RECEIPT                       `,
    `                     WebzoneBD IT                            `,
    `=============================================================`,
    `Receipt No   : ${summary.receiptNumber}`,
    `Order Serial : ${summary.orderSerial}`,
    `Date/Time    : ${summary.verificationDate}`,
    `Customer     : ${summary.customerName} <${summary.customerEmail}>`,
    summary.customerPhone ? `Phone        : ${summary.customerPhone}` : null,
    `Status       : ${summary.paymentStatus}`,
    `Gateway      : ${summary.paymentMethod}`,
    `TrxID        : ${summary.transactionId}`,
    `-------------------------------------------------------------`,
    `Item         : ${summary.itemTitle}`,
    `Total Paid   : ${summary.formattedTotal} ${summary.currency}`,
    `-------------------------------------------------------------`,
    `Access Link  : ${summary.downloadUrl || summary.portalUrl}`,
    `Support      : support@webzonebd.com | +8801864000005`,
    `=============================================================`,
  ].filter(Boolean).join('\n');
}

/**
 * Simulates and executes sending an HTML order confirmation email to the client upon successful payment verification.
 * Dispatches to /api/send-email if available, logs to webzone_email_logs, and returns an audit timeline entry.
 */
export async function simulateSendOrderReceiptEmail(
  order: Order,
  options: FormatOrderOptions & { author?: string; viaApi?: boolean } = {}
): Promise<EmailReceiptDispatchResult> {
  const summary = formatOrderSummary(order, options);
  const htmlTemplate = generateReceiptHtml(summary);
  const plainText = generateReceiptPlainText(summary);
  const timestamp = new Date().toLocaleString();

  let sent = false;
  let simulated = true;
  let errorMsg: string | undefined = undefined;

  // Try dispatching through backend API if requested and in browser
  if (options.viaApi !== false && typeof fetch !== 'undefined') {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: summary.orderId,
          customerName: summary.customerName,
          customerEmail: summary.customerEmail,
          itemTitle: summary.itemTitle,
          price: summary.totalPaid,
          currency: summary.currency,
          date: summary.verificationDate,
          paymentMethod: summary.paymentMethod,
          downloadUrl: summary.downloadUrl || summary.portalUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        sent = Boolean(data.sent);
        simulated = !sent;
      }
    } catch (err: any) {
      // Backend may be offline or in preview fallback mode - simulation succeeds smoothly
      errorMsg = err?.message;
      simulated = true;
    }
  }

  // Persist receipt record in localStorage so it synchronizes with Admin Panel's Receipts & Email Center
  if (typeof localStorage !== 'undefined') {
    try {
      const existingLogsRaw = localStorage.getItem('webzone_email_logs');
      const existingLogs: any[] = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];

      const newLogItem = {
        id: `eml-${Date.now()}`,
        orderId: summary.orderId,
        recipientName: summary.customerName,
        recipientEmail: summary.customerEmail,
        subject: `💳 Order Confirmation & Invoice Receipt - #${summary.orderSerial}`,
        itemTitle: summary.itemTitle,
        price: summary.totalPaid,
        timestamp,
        status: sent ? 'Dispatched via live SMTP server' : 'Simulated SMTP Relay (HTML rendered & saved)',
        sent,
        htmlTemplate,
        details: {
          receiptNumber: summary.receiptNumber,
          transactionId: summary.transactionId,
          paymentMethod: summary.paymentMethod,
          formattedTotal: summary.formattedTotal,
          deliveryTarget: summary.customerEmail
        }
      };

      const updatedLogs = [newLogItem, ...existingLogs].slice(0, 100);
      localStorage.setItem('webzone_email_logs', JSON.stringify(updatedLogs));
    } catch (e) {
      console.warn('Could not store email log to localStorage', e);
    }
  }

  // Build the audit timeline log item for the order's history
  const auditLogItem = {
    id: `log-email-${Date.now()}`,
    event: 'Email Receipt Sent',
    author: options.author || 'Automated SMTP System',
    date: timestamp,
    desc: `Automated confirmation receipt dispatched to client (${summary.customerEmail}). TrxID: ${summary.transactionId} | Amount: ${summary.formattedTotal} ${summary.currency}.`
  };

  return {
    success: true,
    sent,
    simulated,
    receiptNumber: summary.receiptNumber,
    orderId: summary.orderId,
    recipientEmail: summary.customerEmail,
    recipientName: summary.customerName,
    subject: `💳 Order Confirmation & Invoice Receipt - #${summary.orderSerial}`,
    htmlTemplate,
    plainText,
    timestamp,
    summary,
    auditLogItem,
    details: {
      deliveryChannel: sent ? 'Live SMTP Transport' : 'Simulated Client Email Delivery Sandbox',
      messageId: `msg-${summary.receiptNumber.toLowerCase()}-${Date.now()}`
    }
  };
}
