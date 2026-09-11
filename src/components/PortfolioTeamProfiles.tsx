import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Code, 
  TrendingUp, 
  Headphones, 
  ExternalLink, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Globe, 
  Zap, 
  UserCheck, 
  ChevronRight,
  Briefcase,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme } from '../types';

interface PortfolioTeamProfilesProps {
  language: Language;
  theme: Theme;
}

export interface TeamMember {
  id: string;
  name: string;
  nameBn: string;
  nameAr: string;
  role: string;
  roleBn: string;
  roleAr: string;
  category: 'ceo' | 'developer' | 'marketer' | 'support';
  avatar: string;
  badge: string;
  badgeBn: string;
  badgeAr: string;
  bio: string;
  bioBn: string;
  bioAr: string;
  experience: string;
  projectsCompleted: string;
  rating: number;
  skills: string[];
  certifications: string[];
  email: string;
  phone: string;
  whatsapp: string;
  highlights: {
    en: string[];
    bn: string[];
    ar: string[];
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: 'ceo-profile',
    name: 'Md. Imran Hossain',
    nameBn: 'মোঃ ইমরান হোসেন',
    nameAr: 'محمد عمران حسين',
    role: 'Founder & Chief Executive Officer (CEO)',
    roleBn: 'প্রতিষ্ঠাতা ও প্রধান নির্বাহী কর্মকর্তা (সিইও)',
    roleAr: 'المؤسس والرئيس التنفيذي (CEO)',
    category: 'ceo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    badge: 'Executive Leadership',
    badgeBn: 'নির্বাহী নেতৃত্ব',
    badgeAr: 'القيادة التنفيذية',
    bio: 'Visionary tech leader and digital strategist with over 8 years of excellence spearheading full-scale cloud migrations, corporate brand transformations, and enterprise software deployments across Bangladesh and the Middle East.',
    bioBn: '৮ বছরেরও বেশি অভিজ্ঞতাসম্পন্ন প্রযুক্তি উদ্যোক্তা ও ডিজিটাল স্ট্র্যাটেজিস্ট। বাংলাদেশ ও মধ্যপ্রাচ্যজুড়ে শত শত প্রতিষ্ঠানের ক্লাউড মাইগ্রেশন, এন্টারপ্রাইজ সফটওয়্যার ও ডিজিটাল প্ল্যাটফর্ম সফলভাবে বাস্তবায়ন করেছেন।',
    bioAr: 'قائد تقني ملهم وخبير استراتيجي رقمي يتمتع بخبرة تزيد عن 8 سنوات في قيادة التحول الرقمي السحابي والبرمجيات المؤسسية في بنغلاديش والشرق الأوسط.',
    experience: '8+ Years Exp',
    projectsCompleted: '350+ Strategic Deliveries',
    rating: 5.0,
    skills: ['Executive Leadership', 'Digital Transformation', 'Enterprise Cloud Architecture', 'Fintech & SaaS Strategy', 'Corporate Client Relations', 'Product Engineering'],
    certifications: ['Certified Cloud Solutions Leader', 'Senior IT Project Management', 'Digital Business Innovation Award'],
    email: 'ceo@webzonebd.com',
    phone: '+880 1864-000005',
    whatsapp: '8801864000005',
    highlights: {
      en: [
        'Direct strategic oversight for 350+ institutional web & ERP projects',
        'Spearheaded the 100% NVMe BDIX ultra-low latency server network',
        'Advises growing startups on conversion architecture and SaaS monetization'
      ],
      bn: [
        '৩৫০+ কর্পোরেট ও প্রাতিষ্ঠানিক প্রজেক্টের প্রত্যক্ষ পরিকল্পনা ও তত্ত্বাবধান',
        '১০০% এনভিএমই বিডিআইএক্স আল্ট্রা-লো ল্যাটেন্সি হোস্টিং নেটওয়ার্কের রূপকার',
        'স্টার্টআপ ও ই-কমার্স উদ্যোক্তাদের রূপান্তর ও রাজস্ব বৃদ্ধিতে কৌশলগত পরামর্শক'
      ],
      ar: [
        'إشراف استراتيجي مباشر على أكثر من 350 مشروعاً مؤسسياً وأنظمة ERP',
        'تأسيس شبكة استضافة NVMe السحابية فائقة السرعة مع زمن استجابة متدني',
        'مستشار تجاري معتمد للشركات الناشئة لرفع كفاءة التحويل والأرباح'
      ]
    }
  },
  {
    id: 'developer-profile',
    name: 'Tanvir Ahmed',
    nameBn: 'তানভীর আহমেদ',
    nameAr: 'تنوير أحمد',
    role: 'Lead Full-Stack Software Engineer',
    roleBn: 'প্রধান ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ার',
    roleAr: 'كبير مهندسي البرمجيات المتكاملة (Lead Dev)',
    category: 'developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    badge: 'Core Architecture & Engineering',
    badgeBn: 'কোর সফটওয়্যার আর্কিটেকচার',
    badgeAr: 'الهندسة البرمجية والنظم',
    bio: 'Senior architect specialized in high-concurrency Laravel, React, Next.js, Node.js, and multi-tenant database infrastructures. Dedicated to building 99.99% uptime web apps and blazing-fast REST/GraphQL APIs.',
    bioBn: 'লারারেল, রিয়্যাক্ট, নেক্সট.জেএস এবং মাল্টি-টেন্যান্ট ডেটাবেজ আর্কিটেকচারে পারদর্শী অভিজ্ঞ সিনিয়র ইঞ্জিনিয়ার। সর্বোচ্চ গতির এপিআই এবং সিকিউর ওয়েব অ্যাপ্লিকেশন তৈরিতে নিবেদিত।',
    bioAr: 'مهندس برمجيات أول متخصص في بناء النظم عالية الكفاءة بلغات Laravel وReact وNext.js وقواعد البيانات السحابية السريعة.',
    experience: '6+ Years Exp',
    projectsCompleted: '200+ Software Deployed',
    rating: 5.0,
    skills: ['Laravel & PHP 8.3', 'React & Next.js 14', 'Node.js & Express', 'PostgreSQL & MySQL', 'Redis Caching & CDN', 'RESTful API & Webhooks', 'Docker & DevOps'],
    certifications: ['Zend Certified PHP Engineer', 'AWS Solutions Architect Associate', 'React Core Specialist'],
    email: 'dev@webzonebd.com',
    phone: '+880 1864-000005',
    whatsapp: '8801864000005',
    highlights: {
      en: [
        'Engineered custom POS & ERP engines handling 100k+ daily transactions',
        'Optimized core Web Vitals reaching sub-500ms page load speeds',
        'Built automated bKash/Nagad/Rocket checkout payment gateways'
      ],
      bn: [
        'প্রতিদিন ১ লাখ+ ট্রানজাকশন সম্পন্ন করতে সক্ষম পিওএস ও ইআরপি ইঞ্জিন তৈরি',
        'কোর ওয়েব ভাইটালস অপটিমাইজেশন নিশ্চিত করে ৫০০ মিলি-সেকেন্ডের নিচে স্পিড অর্জন',
        'বিকাশ, নগদ ও রকেট পেমেন্ট গেটওয়ের নিরবচ্ছিন্ন অটোমেশন আর্কিটেকচার প্রণয়ন'
      ],
      ar: [
        'برمجة أنظمة نقاط بيع وERP تتحمل أكثر من 100 ألف معاملة يومية',
        'تحسين أداء مؤشرات الويب الأساسية ليصل تحميل الصفحات لأقل من 500 مللي ثانية',
        'تطوير وتأمين بوابات الدفع الإلكتروني المباشرة والتلقائية'
      ]
    }
  },
  {
    id: 'marketer-profile',
    name: 'Sultana Razia',
    nameBn: 'সুলতানা রাজিয়া',
    nameAr: 'سلطانة راضية',
    role: 'Principal Digital Growth & SEO Strategist',
    roleBn: 'প্রধান ডিজিটাল গ্রোথ ও এসইও স্ট্র্যাটেজিস্ট',
    roleAr: 'مديرة استراتيجيات النمو والتسويق الرقمي والسيو',
    category: 'marketer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    badge: 'Marketing & ROI Acceleration',
    badgeBn: 'মার্কেটিং ও আরওআই বৃদ্ধি',
    badgeAr: 'التسويق وتسريع العائد',
    bio: 'Data-driven marketing director and certified SEO master with proven experience scaling brand visibility, Google Rank #1 SERPs, and managing multi-million BDT Meta and Google Ads campaigns with high ROI.',
    bioBn: 'ডাটা-ড্রিভেন ডিজিটাল মার্কেটিং স্পেশালিস্ট ও সার্টিফাইড এসইও এক্সপার্ট। গুগল সার্চে ১ নম্বর র‍্যাঙ্কিং অর্জন এবং সফল মেটা ও গুগল অ্যাডস ক্যাম্পেইন পরিচালনায় দক্ষ।',
    bioAr: 'خبيرة تسويق رقمي معتمدة تقود استراتيجيات السيو المتقدم وحملات إعلانات جوجل وميتا الممولة لتحقيق أعلى عوائد استثمارية.',
    experience: '5+ Years Exp',
    projectsCompleted: '180+ Ad Campaigns',
    rating: 4.9,
    skills: ['Technical SEO & Schema', 'Google Ads (Search & Display)', 'Meta Ads & Pixel Mastery', 'Conversion Rate Optimization (CRO)', 'Content & Copywriting', 'Analytics & Funnel Tracking'],
    certifications: ['Google Ads Certified Professional', 'Meta Certified Media Planner', 'HubSpot Inbound & Growth Certified'],
    email: 'growth@webzonebd.com',
    phone: '+880 1864-000005',
    whatsapp: '8801864000005',
    highlights: {
      en: [
        'Delivered 350%+ average client traffic growth within 90 days',
        'Ranked 100+ competitive keywords on Google First Page SERPs',
        'Managed high-conversion e-commerce retargeting ad funnels'
      ],
      bn: [
        '৯০ দিনের মধ্যে ক্লায়েন্ট ওয়েবসাইটে গড়ে ৩৫০%+ অর্গানিক ট্রাফিক বৃদ্ধি',
        'গুগলের প্রথম পাতায় ১০০+ প্রতিযোগিতাপূর্ণ কিওয়ার্ড সফলভাবে র‍্যাংক করানো',
        'ই-কমার্স বিক্রয় দ্বিগুণ করতে হাই-কনভার্টিং রি-টার্গেটিং ফানেল ব্যবস্থাপনা'
      ],
      ar: [
        'تحقيق نمو بنسبة تزيد عن 350% في الزيارات الحقيقية للمواقع خلال 90 يوماً',
        'تصدر الصفحة الأولى في محرك بحث جوجل لأكثر من 100 كلمة مفتاحية تنافسية',
        'إدارة مسارات تسويقية ذكية لرفع مبيعات المتاجر الإلكترونية'
      ]
    }
  },
  {
    id: 'support-profile',
    name: 'Kawsar Mahmud',
    nameBn: 'কাউসার মাহমুদ',
    nameAr: 'كوثر محمود',
    role: 'Lead Systems Administrator & 24/7 Support Lead',
    roleBn: 'প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটর ও ২৪/৭ সাপোর্ট লিড',
    roleAr: 'كبير مسؤولي النظم ومدير الدعم الفني 24/7',
    category: 'support',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    badge: '24/7 Infrastructure & Client Care',
    badgeBn: '২৪/৭ সাপোর্ট ও সিস্টেম নিরাপত্তা',
    badgeAr: 'الدعم الفني وإدارة البنية التحتية',
    bio: 'Linux and cPanel server guru delivering round-the-clock infrastructure stability, instant SSL deployments, automated offsite daily backups, and sub-10 minute ticketing response SLAs for all WebzoneBD clients.',
    bioBn: 'লিনাক্স ও সিপ্যানেল সার্ভার বিশেষজ্ঞ। সার্বক্ষণিক সার্ভার স্ট্যাবিলিটি, ফ্রি এসএসএল সেটআপ, অটোমেটিক ডেইলি ব্যাকআপ এবং ১০ মিনিটের মধ্যে টিকিট সাপোর্ট দিতে নিবেদিত।',
    bioAr: 'خبير إدارة خوادم لينكس وcPanel يضمن استقرار البنية التحتية مدار الساعة وتوفير دعم فني سريع في أقل من 10 دقائق.',
    experience: '6+ Years Exp',
    projectsCompleted: '1,500+ Tickets Resolved',
    rating: 5.0,
    skills: ['cPanel / WHM Administration', 'Linux Server Hardening', 'DNS & Cloudflare Protection', 'BDIX Routing & Optimization', 'Live WhatsApp Assistance', 'Disaster Recovery & Daily Backups'],
    certifications: ['cPanel & WHM Certified Professional', 'Red Hat Certified System Administrator (RHCSA)', 'Cloudflare Accredited Specialist'],
    email: 'support@webzonebd.com',
    phone: '+880 1864-000005',
    whatsapp: '8801864000005',
    highlights: {
      en: [
        '99.98% first-contact resolution on client hosting & domain tickets',
        'Automated multi-datacenter remote backup with zero data loss guarantee',
        '24/7 live WhatsApp and telephone support line for mission-critical apps'
      ],
      bn: [
        'হোস্টিং ও ডোমেইন সাপোর্ট টিকিটে ৯৯.৯৮% প্রথম যোগাযোগেই তাৎক্ষণিক সমাধান',
        'জিরো ডাটা লস নিশ্চয়তাসহ রিমোট ডাটা সেন্টার ডেইলি অটো ব্যাকআপ',
        'জরুরি টেকনিক্যাল সহায়তায় ২৪/৭ ডেডিকেটেড হোয়াটসঅ্যাপ ও হেল্পলাইন ব্যবস্থা'
      ],
      ar: [
        'حل مشكلات الاستضافة والدومين بنسبة 99.98% من أول استجابة',
        'نظام نسخ احتياطي يومي مؤتمت يضمن سلامة البيانات بنسبة 100%',
        'دعم فني حي مباشر عبر الواتساب والهاتف على مدار الساعة 24/7'
      ]
    }
  }
];

export default function PortfolioTeamProfiles({ language, theme }: PortfolioTeamProfilesProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'ceo' | 'developer' | 'marketer' | 'support'>('all');

  const filteredMembers = activeTab === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.category === activeTab);

  const t = {
    en: {
      sectionBadge: 'Executive Leadership & Specialists',
      sectionTitle: 'Meet The Minds Behind WebzoneBD',
      sectionSub: 'Our multidisciplinary team of visionary executives, senior engineers, growth strategists, and dedicated 24/7 support specialists powering your digital success.',
      qualityBadge: 'WebzoneBD Quality Benchmark',
      qualityTitle: 'Engineering Standards & Quality Matrix',
      qualitySub: 'Every project we deliver conforms to enterprise SLAs, top-tier security standards, and measurable growth deliverables.',
      viewProfile: 'View Full Profile',
      directContact: 'Direct WhatsApp',
      emailSpecialist: 'Send Email',
      skillsTitle: 'Core Competencies',
      certificationsTitle: 'Professional Certifications',
      highlightsTitle: 'Key Accomplishments',
      allSpecialists: 'All Leaders',
      ceoTab: 'CEO & Leadership',
      devTab: 'Lead Developers',
      marketingTab: 'Growth & SEO',
      supportTab: '24/7 Support',
      modalClose: 'Close Profile',
      servicePillars: [
        {
          icon: Code,
          title: 'Full-Stack Software Craftsmanship',
          desc: 'Clean, scalable, documented codebases powered by modern frameworks like Laravel, React, and Next.js with sub-500ms response targets.',
          badge: 'Clean Code Standard'
        },
        {
          icon: Cpu,
          title: 'Ultra-Fast NVMe BDIX Hosting',
          desc: 'Enterprise-grade cPanel and cloud servers with 100% NVMe storage, LiteSpeed caching, and 1ms Bangladesh local IX latency.',
          badge: '99.99% Uptime SLA'
        },
        {
          icon: TrendingUp,
          title: 'ROI-Driven Digital Growth',
          desc: 'Omni-channel marketing funnels, Schema-validated technical SEO, and conversion-optimized ad campaigns that scale your sales.',
          badge: 'Verified Conversions'
        },
        {
          icon: Headphones,
          title: 'Uncompromised 24/7 Client Care',
          desc: 'Direct human support via WhatsApp, phone, and ticketing with guaranteed 10-minute SLA response on critical server needs.',
          badge: 'Instant Human Help'
        }
      ]
    },
    bn: {
      sectionBadge: 'নির্বাহী নেতৃত্ব ও বিশেষজ্ঞ টিম',
      sectionTitle: 'ওয়েবজোনবিডি-র পেছনে অভিজ্ঞ টিম মেম্বার্স',
      sectionSub: 'আমাদের দক্ষ সফটওয়্যার আর্কিটেক্ট, ডিজিটাল মার্কেটিং স্ট্র্যাটেজিস্ট ও ২৪/৭ ডেডিকেটেড সাপোর্ট ইঞ্জিনিয়ারদের সাথে পরিচিত হোন যারা আপনার ব্যবসাকে এগিয়ে নেয়।',
      qualityBadge: 'ওয়েবজোনবিডি কোয়ালিটি স্ট্যান্ডার্ড',
      qualityTitle: 'কোয়ালিটি সার্ভিস ও ইঞ্জিনিয়ারিং মানদণ্ড',
      qualitySub: 'আমাদের প্রতিটি প্রজেক্ট আন্তর্জাতিক মানসম্পন্ন কোডিং, সর্বোচ্চ ডেটা সিকিউরিটি এবং ব্যবসায়িক লক্ষ্য পূরণের নিশ্চয়তা দেয়।',
      viewProfile: 'সম্পূর্ণ প্রোফাইল দেখুন',
      directContact: 'সরাসরি হোয়াটসঅ্যাপ',
      emailSpecialist: 'ইমেইল করুন',
      skillsTitle: 'দক্ষতা ও বিশেষত্ব',
      certificationsTitle: 'প্রফেশনাল সার্টিফিকেশন',
      highlightsTitle: 'উল্লেখযোগ্য অর্জন ও অবদান',
      allSpecialists: 'সকল এক্সপার্ট',
      ceoTab: 'সিইও ও নেতৃত্ব',
      devTab: 'লিড ডেভেলপার',
      marketingTab: 'মার্কেটিং ও এসইও',
      supportTab: '২৪/৭ সাপোর্ট',
      modalClose: 'প্রোফাইল বন্ধ করুন',
      servicePillars: [
        {
          icon: Code,
          title: 'আধুনিক ফুল-স্ট্যাক সফটওয়্যার নির্মাণ',
          desc: 'লারারেল, রিয়্যাক্ট ও নেক্সট.জেএস প্রযুক্তিতে পরিচ্ছন্ন ও স্কেলেবল কোডবেস যা ৫০০ মিলি-সেকেন্ডের কম সময়ে লোড হয়।',
          badge: 'ক্লিন কোড গ্যারান্টি'
        },
        {
          icon: Cpu,
          title: 'আল্ট্রা-ফাস্ট এনভিএমই বিডিআইএক্স হোস্টিং',
          desc: 'লাইটস্পিড ক্যাশিং ও ১ মিলি-সেকেন্ড লোকাল বিডিআইএক্স লেটেন্সিসহ ১০০% এনভিএমই স্টোরেজ সিপ্যানেল ক্লাউড সার্ভার।',
          badge: '৯৯.৯৯% আপটাইম এসএলএ'
        },
        {
          icon: TrendingUp,
          title: 'আরওআই-চালিত ডিজিটাল গ্রোথ',
          desc: 'টেকনিক্যাল এসইও, টার্গেটেড মেটা ও গুগল বিজ্ঞাপন এবং কনভার্সন অপটিমাইজেশন যা সরাসরি বিক্রয় বৃদ্ধি করে।',
          badge: 'গ্যারান্টিড রেজাল্ট'
        },
        {
          icon: Headphones,
          title: 'সার্বক্ষণিক ২৪/৭ বিশ্বস্ত গ্রাহক সেবা',
          desc: 'হোয়াটসঅ্যাপ, ফোন কল এবং টিকিট ডেস্কে সার্বক্ষণিক মানবীয় সহায়তা এবং জরুরি প্রয়োজনে ১০ মিনিটের মধ্যে রেসপন্স।',
          badge: 'তাৎক্ষণিক লাইভ সহায়তা'
        }
      ]
    },
    ar: {
      sectionBadge: 'القيادة التنفيذية والخبراء',
      sectionTitle: 'تعرف على الفريق المتخصص خلف ويب زون بي دي',
      sectionSub: 'فريقنا المتكامل من المهندسين وخبراء التسويق والدعم الفني السحابي المكرس لنجاح أعمالكم وتفوقها التقني.',
      qualityBadge: 'معايير جودة ويب زون بي دي',
      qualityTitle: 'مصفوفة الجودة والمعايير الهندسية',
      qualitySub: 'يخضع كل مشروع لمعايير هندسية متقدمة تضمن الأمان التام وسرعة التصفح وتضاعف الأرباح.',
      viewProfile: 'عرض الملف الكامل',
      directContact: 'مراسلة عبر واتساب',
      emailSpecialist: 'إرسال بريد',
      skillsTitle: 'الكفاءات والخبرات الأساسية',
      certificationsTitle: 'الشهادات المعتمدة',
      highlightsTitle: 'أبرز الإنجازات والنتائج',
      allSpecialists: 'جميع القادة',
      ceoTab: 'الرئيس التنفيذي',
      devTab: 'كبار المطورين',
      marketingTab: 'التسويق والسيو',
      supportTab: 'الدعم الفني 24/7',
      modalClose: 'إغلاق الملف',
      servicePillars: [
        {
          icon: Code,
          title: 'هندسة برمجية متكاملة عالية الأداء',
          desc: 'كود نظيف وآمن معتمد على أحدث أطر العمل مثل Laravel وNext.js مع سرعة استجابة مذهلة.',
          badge: 'معايير برمجية نظيفة'
        },
        {
          icon: Cpu,
          title: 'استضافة سحابية فائقة السرعة NVMe',
          desc: 'خوادم مجهزة بأقراص NVMe ومسرعات LiteSpeed تضمن استقراراً كاملاً بنسبة 99.99%.',
          badge: 'ضمان جهوزية 99.99%'
        },
        {
          icon: TrendingUp,
          title: 'تسويق رقمي مدروس لتحقيق أعلى عائد',
          desc: 'استراتيجيات سيو وحملات إعلانية احترافية تركز على مضاعفة المبيعات والانتشار.',
          badge: 'نتائج تسويقية مؤكدة'
        },
        {
          icon: Headphones,
          title: 'دعم فني استثنائي على مدار الساعة',
          desc: 'تواصل مباشر عبر الواتساب والمكالمات الهاتفية وتذاكر الدعم السريعة في أقل من 10 دقائق.',
          badge: 'دعم إنساني فوري'
        }
      ]
    }
  }[language];

  return (
    <div className="w-full space-y-16 py-8">
      
      {/* ================= QUALITY SERVICES INFORMATION PROFILE ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{t.qualityBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              {t.qualityTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {t.qualitySub}
            </p>
          </div>

          {/* 4 Pillars Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.servicePillars.map((pillar, pIdx) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={pIdx}
                  className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-indigo-400/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {pillar.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10.5px] text-indigo-300 font-bold">
                    <span>100% Quality Assured</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= TEAM PROFILES SECTION ================= */}
      <section className="space-y-8" id="webzonebd-team-profiles">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/40 dark:border-blue-900/40 text-xs font-black uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.sectionBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
            {t.sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
            {t.sectionSub}
          </p>
        </div>

        {/* Profile Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: t.allSpecialists, icon: Sparkles },
            { id: 'ceo', label: t.ceoTab, icon: Award },
            { id: 'developer', label: t.devTab, icon: Code },
            { id: 'marketer', label: t.marketingTab, icon: TrendingUp },
            { id: 'support', label: t.supportTab, icon: Headphones }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div>
                {/* Header Visual & Avatar Banner */}
                <div className="relative h-44 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-4 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Category Pill */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/15 text-white backdrop-blur-md border border-white/20">
                      {language === 'bn' ? member.badgeBn : language === 'ar' ? member.badgeAr : member.badge}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-[10px] font-black text-white">{member.rating}</span>
                    </div>
                  </div>

                  {/* Avatar Circular Portrait */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-18 h-18 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-xl group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900" title="Active & Available">
                        <Zap className="w-2.5 h-2.5 fill-white" />
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[11px] font-extrabold text-indigo-200 font-mono">
                        {member.experience}
                      </span>
                      <span className="block text-[9.5px] text-slate-300 font-medium">
                        {member.projectsCompleted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3.5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {language === 'bn' ? member.nameBn : language === 'ar' ? member.nameAr : member.name}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-cyan-400 mt-0.5">
                      {language === 'bn' ? member.roleBn : language === 'ar' ? member.roleAr : member.role}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {language === 'bn' ? member.bioBn : language === 'ar' ? member.bioAr : member.bio}
                  </p>

                  {/* Skills tags preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {member.skills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300">
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t.viewProfile}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${member.whatsapp}?text=Assalamu%20Alaikum%20${encodeURIComponent(member.name)},%20I%20am%20viewing%20your%20WebzoneBD%20team%20profile%20and%20would%20like%20to%20consult%20regarding%20a%20project.`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/20 text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 text-center"
                    title={t.directContact}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${member.email}?subject=Project%20Inquiry%20via%20WebzoneBD%20Portfolio`}
                    className="py-1.5 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-500/20 text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 text-center"
                    title={t.emailSpecialist}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* ================= MODAL DETAILED SPECIALIST PROFILE ================= */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 text-left max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Close button */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black px-1.5">✕</span>
                </button>
              </div>

              {/* Banner Top */}
              <div className="relative bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/40 shadow-2xl shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase bg-indigo-500/40 border border-indigo-300/30 text-indigo-200">
                      {language === 'bn' ? selectedMember.badgeBn : language === 'ar' ? selectedMember.badgeAr : selectedMember.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {language === 'bn' ? selectedMember.nameBn : language === 'ar' ? selectedMember.nameAr : selectedMember.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-cyan-300">
                      {language === 'bn' ? selectedMember.roleBn : language === 'ar' ? selectedMember.roleAr : selectedMember.role}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-300 font-mono">
                      <span>⚡ {selectedMember.experience}</span>
                      <span>•</span>
                      <span>🏆 {selectedMember.projectsCompleted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-slate-700 dark:text-slate-200">
                
                {/* Biography */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Executive Biography
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    {language === 'bn' ? selectedMember.bioBn : language === 'ar' ? selectedMember.bioAr : selectedMember.bio}
                  </p>
                </div>

                {/* Key Accomplishments / Highlights */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.highlightsTitle}</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedMember.highlights[language].map((hl, hIdx) => (
                      <li key={hIdx} className="text-xs flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {t.skillsTitle}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.skills.map((sk, skIdx) => (
                      <span
                        key={skIdx}
                        className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {t.certificationsTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMember.certifications.map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-2"
                      >
                        <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Connect footer inside modal */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-mono text-slate-500">
                    Direct Official Email: <strong className="text-indigo-600 dark:text-indigo-400">{selectedMember.email}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedMember.whatsapp}?text=Assalamu%20Alaikum%20${encodeURIComponent(selectedMember.name)},%20I%20am%20interested%20in%20consulting%20with%20you%20regarding%20WebzoneBD%20services.`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp {selectedMember.name.split(' ')[0]}</span>
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
