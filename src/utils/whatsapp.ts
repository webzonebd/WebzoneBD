export interface WhatsAppOrderItem {
  name: string;
  price?: string | number;
  quantity?: number;
}

export interface WhatsAppOrderPayload {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  amount: string | number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  items?: WhatsAppOrderItem[];
  targetPhone?: string;
  language?: 'bn' | 'en' | 'ar';
}

/**
 * Formats order details into a clean, structured WhatsApp message string.
 */
export function constructWhatsAppOrderSummaryMessage(payload: WhatsAppOrderPayload): string {
  const {
    orderId,
    customerName = 'Valued Customer',
    customerPhone,
    amount,
    currency = 'BDT',
    paymentMethod = 'Online Gateway',
    transactionId,
    items = [],
    language = 'bn',
  } = payload;

  const formattedAmount = typeof amount === 'number'
    ? (currency === 'BDT' ? `৳${amount.toLocaleString()}` : currency === 'SAR' ? `${amount.toLocaleString()} SAR` : `$${amount.toLocaleString()}`)
    : amount;

  const itemListFormatted = items.length > 0
    ? items.map((item, idx) => {
        const qtyStr = item.quantity && item.quantity > 1 ? ` (x${item.quantity})` : '';
        const priceStr = item.price ? ` - ${typeof item.price === 'number' ? `${item.price}` : item.price}` : '';
        return `   ${idx + 1}. ${item.name}${qtyStr}${priceStr}`;
      }).join('\n')
    : '   1. WebzoneBD Order Service';

  if (language === 'bn') {
    return [
      `আসসালামু আলাইকুম, আমি ওয়েবজোন বিডি থেকে একটি নতুন অর্ডার কনফার্ম করতে চাই।`,
      ``,
      `📦 *অর্ডার আইডি:* #${orderId}`,
      `👤 *গ্রাহকের নাম:* ${customerName}`,
      customerPhone ? `📞 *মোবাইল নম্বর:* ${customerPhone}` : null,
      `💳 *পেমেন্ট মেথড:* ${paymentMethod}`,
      transactionId ? `🔑 *ট্রানজেকশন আইডি (TrxID):* ${transactionId}` : null,
      `💰 *মোট মূল্য:* ${formattedAmount}`,
      ``,
      `🛒 *অর্ডারকৃত আইটেম:*`,
      itemListFormatted,
      ``,
      `অনুগ্রহ করে আমার অর্ডারটি রিভিউ করে ডেলিভারি ও সার্ভিস কনফার্ম করুন। ধন্যবাদ!`,
    ].filter(Boolean).join('\n');
  } else if (language === 'ar') {
    return [
      `السلام عليكم، أود تأكيد طلبي من WebzoneBD.`,
      ``,
      `📦 *رقم الطلب:* #${orderId}`,
      `👤 *اسم العميل:* ${customerName}`,
      customerPhone ? `📞 *رقم الهاتف:* ${customerPhone}` : null,
      `💳 *طريقة الدفع:* ${paymentMethod}`,
      transactionId ? `🔑 *رقم المعاملة (TrxID):* ${transactionId}` : null,
      `💰 *الإجمالي:* ${formattedAmount}`,
      ``,
      `🛒 *المنتجات:*`,
      itemListFormatted,
      ``,
      `يرجى تأكيد الطلب. شكراً لكم!`,
    ].filter(Boolean).join('\n');
  }

  // Default English
  return [
    `Hello, I would like to confirm my new order placed on WebzoneBD.`,
    ``,
    `📦 *Order ID:* #${orderId}`,
    `👤 *Customer Name:* ${customerName}`,
    customerPhone ? `📞 *Contact Number:* ${customerPhone}` : null,
    `💳 *Payment Method:* ${paymentMethod}`,
    transactionId ? `🔑 *Transaction ID (TrxID):* ${transactionId}` : null,
    `💰 *Total Amount:* ${formattedAmount}`,
    ``,
    `🛒 *Ordered Items:*`,
    itemListFormatted,
    ``,
    `Please verify and confirm my order status. Thank you!`,
  ].filter(Boolean).join('\n');
}

/**
 * Generates the wa.me / api.whatsapp.com URL with pre-filled encoded order text.
 */
export function generateWhatsAppUrl(payload: WhatsAppOrderPayload): string {
  // Clean target phone string (default: +8801864000005)
  const rawTarget = payload.targetPhone || '8801864000005';
  const cleanPhone = rawTarget.replace(/[^0-9]/g, '');
  
  const messageText = constructWhatsAppOrderSummaryMessage(payload);
  const encodedMsg = encodeURIComponent(messageText);

  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
}

/**
 * Triggers opening the WhatsApp URL in a new window or tab.
 */
export function sendOrderToWhatsApp(payload: WhatsAppOrderPayload, openInNewTab = true): string {
  const url = generateWhatsAppUrl(payload);
  if (typeof window !== 'undefined') {
    if (openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }
  return url;
}
