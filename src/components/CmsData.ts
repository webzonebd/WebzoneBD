export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  status: 'published' | 'draft' | 'scheduled';
  sections: Array<{
    id: string;
    type: 'hero' | 'features' | 'pricing' | 'faq' | 'cta' | 'html';
    content: any;
  }>;
}

export interface CmsMenuItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  target: '_self' | '_blank';
  children?: CmsMenuItem[];
}

export interface CmsMenu {
  id: string;
  name: string;
  type: 'header' | 'footer' | 'sidebar' | 'mobile';
  items: CmsMenuItem[];
}

export interface CmsBlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
  status: 'published' | 'draft' | 'scheduled';
}

export interface CmsService {
  id: string;
  name: string;
  slug: string;
  featuredImage: string;
  description: string;
  features: string[];
  category: string;
  pricing: Array<{ name: string; price: number; features: string[] }>;
}

export interface CmsProduct {
  id: string;
  name: string;
  sku: string;
  slug: string;
  productImage: string;
  galleryImages: string[];
  price: number;
  salePrice?: number;
  category: string;
  subCategory: string;
  description: string;
  productType: 'digital' | 'service' | 'downloadable';
  downloads?: string[];
  externalUrl?: string;
  status: 'published' | 'draft';
}

export interface CmsMediaFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'pdf' | 'docx' | 'zip';
  url: string;
  folder: string;
}

export interface CmsForm {
  id: string;
  title: string;
  fields: Array<{ name: string; type: string; required: boolean; options?: string[] }>;
  submissions: Array<{ id: string; date: string; data: any }>;
}

export interface CmsRedirect {
  id: string;
  oldUrl: string;
  newUrl: string;
  statusCode: 301 | 302;
  hits: number;
}

export interface CmsAnnouncement {
  id: string;
  text: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
}

export interface CmsFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CmsTestimonial {
  id: string;
  clientName: string;
  businessName: string;
  avatar: string;
  rating: number;
  reviewText: string;
}

export const INITIAL_CMS_PAGES: CmsPage[] = [
  {
    id: "pg-home",
    title: "WebzoneBD Solution Gateway",
    slug: "home",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    content: "WebzoneBD is Bangladesh's premier IT solution hub.",
    seoTitle: "WebzoneBD - High Performance VPS & Dedicated Server Hosting",
    metaDescription: "Providing blazing-fast web development, BDIX hosting, SSL configurations and custom CRM solution in Dhaka.",
    canonicalUrl: "https://webzonebd.com",
    status: "published",
    sections: [
      { id: "sec-hero", type: "hero", content: { title: "Next-Gen Software Architects", subtitle: "We scale IT infrastructures for global tech enterprises.", buttonText: "Initiate Consult", buttonLink: "/contact" } },
      { id: "sec-feats", type: "features", content: { list: ["Enterprise Class Performance", "BDIX Zero Latency Transit", "99.99% Hardware SLA Guarantee"] } }
    ]
  },
  {
    id: "pg-pricing",
    title: "Hosting & Development Pricing Plans",
    slug: "pricing",
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    content: "View plans compiled directly for small scale web operations up to corporate giants.",
    seoTitle: "Affordable Shared Hosting & WordPress VPS pricing",
    metaDescription: "No hidden charges. Flexible payment channels through bKash, SSLCommerz and Mastercard.",
    canonicalUrl: "https://webzonebd.com/pricing",
    status: "published",
    sections: []
  }
];

export const INITIAL_CMS_MENUS: CmsMenu[] = [
  {
    id: "menu-hdr",
    name: "Primary Header Navigation",
    type: "header",
    items: [
      { id: "item-1", name: "Home", url: "/home", icon: "Home", target: "_self" },
      { id: "item-2", name: "VPS Hosting", url: "/hosting", icon: "Server", target: "_self" },
      { id: "item-3", name: "Development Catalog", url: "/services", icon: "Code", target: "_self" },
      { id: "item-4", name: "Bespoke Solutions", url: "/bespoke", icon: "Layout", target: "_self" }
    ]
  },
  {
    id: "menu-ftr",
    name: "Corporate Footer Grid",
    type: "footer",
    items: [
      { id: "item-f1", name: "Terms of Service", url: "/terms", icon: "FileText", target: "_self" },
      { id: "item-f2", name: "SSL Certificate SLA", url: "/ssl-policy", icon: "ShieldAlert", target: "_blank" }
    ]
  }
];

export const INITIAL_CMS_BLOGS: CmsBlogPost[] = [
  {
    id: "post-1",
    title: "Securing Express Endpoints with Cloud native WAFs",
    slug: "securing-js-endpoints",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    content: "This guide covers setup of Cloudflare WAF, secure headers, helmet and rate limiter models on production environments.",
    author: "Super Admin",
    category: "Security",
    tags: ["Security", "Valkyrie", "React"],
    seoTitle: "Express Endpoint Hardening & WAF configuration",
    metaDescription: "Secure your backend routing, sanitise query bounds, protect database calls instantly.",
    status: "published"
  }
];

export const INITIAL_CMS_SERVICES: CmsService[] = [
  {
    id: "srv-web",
    name: "Enterprise Software Engineering",
    slug: "enterprise-engineering",
    featuredImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    description: "Multi-layered high-performance customized web applications based on React, Next.js and secure APIs.",
    category: "Web Development",
    features: ["Fully decoupled frontend UI", "Edge server synchronization", "Integrated Cloud SQL Schema"],
    pricing: [
      { name: "Starter", price: 499, features: ["Single Database", "Vite Frontend", "3 revisions"] },
      { name: "Corporate Pack", price: 1899, features: ["High availability databases", "Drizzle Sync", "Full support SLA"] }
    ]
  }
];

export const INITIAL_CMS_PRODUCTS: CmsProduct[] = [
  {
    id: "prod-t1",
    name: "WebzoneBD Admin Dashboard Template Bundle",
    sku: "WZBD-T10",
    slug: "admin-bundle-bootstrap",
    productImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    galleryImages: [],
    price: 49,
    salePrice: 29,
    category: "templates",
    subCategory: "Bootstrap",
    description: "Fully reactive admin dashboard template containing dark theme layout, custom responsive metrics charts.",
    productType: "digital",
    downloads: ["https://webzonebd.com/downloads/bundle-v10.zip"],
    status: "published"
  }
];

export const INITIAL_CMS_MEDIA: CmsMediaFile[] = [
  { id: "med-1", name: "hero_branding_banner.jpg", size: "432 KB", type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", folder: "Home Banner" },
  { id: "med-2", name: "corporate_presentation.pdf", size: "2.4 MB", type: "pdf", url: "https://webzonebd.com/wp-content/presentation.pdf", folder: "Documents" }
];

export const INITIAL_CMS_TESTIMONIALS: CmsTestimonial[] = [
  { id: "tst-1", clientName: "Imran Khan", businessName: "Apex Commerce Ltd", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", rating: 5, reviewText: "The fastest response times for BDIX transit servers I have experienced in five years of business." }
];

export const INITIAL_CMS_FAQS: CmsFAQ[] = [
  { id: "faq-1", question: "Do you offer custom SLA support packages?", answer: "Yes, our technical operations center runs 24/7/365 with response guarantees under 15 minutes for critical service tiers.", category: "General" }
];

export const INITIAL_CMS_ANNOUNCEMENTS: CmsAnnouncement[] = [
  { id: "ann-1", text: "⚡ Upgrade Alert: PHP 8.4 hosting profiles coupled with MySQL 9 are now officially live across Dhaka clusters!", bgColor: "#7c3aed", textColor: "#ffffff", isActive: true }
];

export const INITIAL_CMS_REDIRECTS: CmsRedirect[] = [
  { id: "red-1", oldUrl: "/old-hosting-plans", newUrl: "/hosting", statusCode: 301, hits: 142 }
];

export const INITIAL_CMS_FORMS: CmsForm[] = [
  {
    id: "frm-contact",
    title: "Client Consultation Request Desk",
    fields: [
      { name: "Full Name", type: "text", required: true },
      { name: "Email", type: "email", required: true },
      { name: "Required Service", type: "select", required: true, options: ["Web App", "SEO Optimization", "BDIX VPS Cloud"] }
    ],
    submissions: [
      { id: "sub-1", date: "2026-06-11 14:02", data: { "Full Name": "Asif Chowdhury", "Email": "asifa@apex.org", "Required Service": "BDIX VPS Cloud" } }
    ]
  }
];
