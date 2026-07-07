/**
 * Types and interfaces for WebzoneBD IT Solution
 */

export type Language = 'en' | 'bn' | 'ar';
export type Theme = 'light' | 'dark';
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'customer' | 'user' | 'vendor' | 'staff' | 'affiliate';
export type Currency = 'USD' | 'BDT' | 'SAR';

export interface UserSession {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isSocial?: boolean;
  socialProvider?: 'google' | 'facebook' | 'github';
  createdAt: string;
  status: 'active' | 'suspended';
  wishlistedProductIds: string[];
  preferredCurrency?: Currency;
  country?: string;
  paymentMethod?: string;
  phoneCode?: string;
  companyName?: string;
  taxId?: string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPostal?: string;
  tfaEnabled?: boolean;
  prefOrder?: boolean;
  prefMilestone?: boolean;
  prefSupport?: boolean;
  prefRenewal?: boolean;
  googleConnected?: boolean;
  githubConnected?: boolean;
  facebookConnected?: boolean;
  linkedinConnected?: boolean;
  addressLine2?: string;
  billingName?: string;
  timezone?: string;
  selectedLang?: string;
  prefEmail?: boolean;
  prefInvoice?: boolean;
  prefAffiliate?: boolean;
  prefTicket?: boolean;
  prefMarketing?: boolean;
  prefPromos?: boolean;
  prefWhatsApp?: boolean;
  emailOtpEnabled?: boolean;
  googleAuthEnabled?: boolean;
  whatsappOtpEnabled?: boolean;
  lastLogin?: string;
  provider?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  nameAr: string;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  description: string;
  descriptionBn: string;
  descriptionAr: string;
  features: string[];
  featuresBn: string[];
  featuresAr: string[];
  image: string;
  demoUrl: string;
  downloadUrl: string;
  tags: string[];
  views: number;
  badge?: 'Best Seller' | 'Trending' | 'New' | 'Hot Deal' | 'Featured' | 'Verified' | string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  licenseType?: 'regular' | 'extended' | string;
  relatedIds?: string[];
  downloadsCount?: number;
  advancePercent?: number;
  advanceAmount?: number;
  dueAmount?: number;
}

export interface Service {
  id: string;
  title: string;
  titleBn: string;
  titleAr: string;
  iconName: string; // Lucide icon name mapping
  image: string;
  shortDescription: string;
  shortDescriptionBn: string;
  shortDescriptionAr: string;
  fullDescription: string;
  fullDescriptionBn: string;
  fullDescriptionAr: string;
  startingPrice: number;
  features: string[];
  featuresBn: string[];
  featuresAr: string[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  expiryDate: string;
  usageCount?: number;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  message: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  replies: Array<{
    sender: 'user' | 'admin';
    message: string;
    createdAt: string;
  }>;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn: string;
  titleAr: string;
  image: string;
  category: string;
  categoryBn: string;
  categoryAr: string;
  summary: string;
  summaryBn: string;
  summaryAr: string;
  content: string;
  contentBn: string;
  contentAr: string;
  date: string;
  author: string;
  readTime: string;
  videoUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  titleBn: string;
  titleAr: string;
  category: string;
  categoryLabel: string;
  categoryLabelBn: string;
  categoryLabelAr: string;
  subCategory?: string;
  subCategoryBn?: string;
  subCategoryAr?: string;
  image: string;
  client: string;
  duration: string;
  demoUrl: string;
  description?: string;
  descriptionBn?: string;
  descriptionAr?: string;
  techStack?: string[];
  features?: string[];
  featuresBn?: string[];
  featuresAr?: string[];
  results?: { label: string; value: string }[];
  resultsBn?: { label: string; value: string }[];
  resultsAr?: { label: string; value: string }[];
  longCaseStudy?: string;
  longCaseStudyBn?: string;
  longCaseStudyAr?: string;
  videoUrl?: string;
}

export interface Order {
  id: string;
  productId?: string;
  serviceId?: string;
  itemTitle: string;
  price: number;
  date: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  downloadUrl?: string;
  trackingId?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered';
  isGuest?: boolean;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  transactionId?: string;
  transactionReceipt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  assignedStaff?: string;
  orderNotes?: string;
  advancePercent?: number;
  advanceAmount?: number;
  dueAmount?: number;
}

export interface CartItem {
  product: Product;
  appliedCoupon?: Coupon;
  advancePercent?: number;
  advanceAmount?: number;
  dueAmount?: number;
}

export interface SystemConfig {
  siteName: string;
  siteTitle: string;
  metaDesc: string;
  googleAnalyticsId: string;
  whatsappNumber: string;
  bangladeshContact: string;
  supportEmail: string;
  autoApproveTickets: boolean;
}
