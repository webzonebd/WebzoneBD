import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Cpu, FileSpreadsheet, LockKeyhole, Info, 
  PhoneCall, ArrowRight, Search, Printer, Clock, 
  ChevronDown, CheckCircle2, Copy, Check, Globe, 
  Calendar, Sparkles, BookOpen, RefreshCw, FileText
} from 'lucide-react';
import { Language, Theme } from '../types';

interface PrivacyTermsProps {
  language: Language;
  theme: Theme;
}

export default function PrivacyTerms({ language, theme }: PrivacyTermsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('section-1');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'section-1': true,
    'section-2': true,
    'section-3': true,
    'section-4': true,
    'section-5': true,
    'section-6': true,
    'section-7': true,
  });
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPrintFriendly, setIsPrintFriendly] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Premium corporate translations for WebzoneBD Legal Core Hub
  const legalContent = useMemo(() => ({
    en: {
      badge: "Legal & Compliance",
      title: "Privacy Policy & Digital Licensing Agreements",
      subtitle: "Your privacy, security, and digital licensing rights are important to us. Please review our policies regarding software licensing, digital downloads, hosting service delivery, and customer data protection.",
      values: [
        { label: "Secure Transactions", desc: "100% encrypted checkout layers" },
        { label: "Digital Product Licensing", desc: "Verified corporate usage terms" },
        { label: "Privacy Protection", desc: "No unauthorized telemetry or sales" },
        { label: "Customer Rights", desc: "Clear SLA and digital refund limits" }
      ],
      lastUpdated: "Last Updated & Verified: May 2026",
      searchPlaceholder: "Search legal keywords...",
      collapseAll: "Collapse All Sections",
      expandAll: "Expand All Sections",
      printFriendly: "Toggle Print Mode",
      printAction: "Download / Print PDF Document",
      backToHome: "Return to Main Store",
      toc: "Agreements Index",
      disclaimerTitle: "Official Legal Disclaimer",
      disclaimerText: "WebzoneBD IT Solution reserves the absolute right to modify these policies, licensing conditions, support requirements, and legal agreements at any time without prior customer notice. Users are encouraged to review this portal periodically for updates.",
      copiedLabel: "Copied Link!",
      sectionCopiedLabel: "Copied Section!",
      searchNoResult: "No legal articles match your query. Try searching for 'cPanel', 'Refund', 'SQL', or 'WhatsApp'.",
      viewProject: "Visit webzonebd.com",
      sections: [
        {
          id: "section-1",
          title: "Instant Digital Delivery Conditions",
          badge: "Digital Downloads",
          gradient: "from-blue-600 to-cyan-500",
          icon: <ZapIcon className="w-5 h-5 text-blue-500" />,
          content: [
            "Digital products including PHP scripts, Laravel applications, WordPress themes, plugins, Blogger templates, and software packages are delivered instantly through the customer dashboard after successful payment.",
            "All downloadable digital assets are provided inside securely archived ZIP packages which undergo strict malware and anti-virus reviews before release.",
            "For active security reasons, download signatures are cryptographically scanned and cataloged under your user account coordinates.",
            "Since digital products are intangible, copyable, and instantly downloaded items, final refunds cannot be issued once a download has been successfully recorded within our database.",
            "Important Notice: Customers are highly encouraged to carefully review live demo versions, technical dependency list, and software system requirements before checkout."
          ]
        },
        {
          id: "section-2",
          title: "cPanel Server Configuration & Installation Scope",
          badge: "Server & Setup Support",
          gradient: "from-purple-600 to-indigo-500",
          icon: <Cpu className="w-5 h-5 text-purple-500" />,
          content: [
            "WebzoneBD IT Solution provides professional installation guidance and technical assistance for all eligible purchased products.",
            "Customers are solely responsible for ensuring that their target Linux or cPanel hosting environment fully meets the stated requirements of the software.",
            "If unexpected installation issues occur due to: Server Misconfiguration, Outdated PHP Versions, Missing Core IonCube or cURL Extensions, Database Syntax Errors, or Directory Permissions, our support desk will assist you.",
            "We provide active customer support through local dashboard tickets, official email, and our dedicated Riyadh helpline.",
            "Saudi Arabia WhatsApp Support Line: +966 570511931 (Active daily)",
            "Any custom modification, software redesign work, third-party payment gateways integration, or major development changes are considered separate services and are not included in the standard license product cost."
          ]
        },
        {
          id: "section-3",
          title: "Compliance & Security Standards",
          badge: "Engineering Safety",
          gradient: "from-emerald-500 to-teal-500",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          content: [
            "WebzoneBD IT Solution follows modern software development lifecycle (SDLC) models to guarantee secure code construction.",
            "Our corporate development compliance covers: Prepared SQL Statements, Input XSS Filter Sanitations, CSRF Protection tokens, secure authorization wrappers, and rigorous database constraints.",
            "We continuously inspect and update our codebase templates to mitigate emerging web vulnerabilities and maintain high uptime metrics.",
            "To enjoy full speed response times and automated backups, we recommend deploying production websites on WebzoneBD's premium AMD EPYC NVMe cloud hosting setups."
          ]
        },
        {
          id: "section-4",
          title: "Customer Privacy Protection",
          badge: "Data Integrity",
          gradient: "from-blue-600 to-indigo-600",
          icon: <LockKeyhole className="w-5 h-5 text-indigo-500" />,
          content: [
            "We protect customer privacy using strictly encrypted backend file systems.",
            "Information securely logged during account creation includes: Full Name, email identifier, active phone, corporate billing specifications, support message logs, and core transaction timestamps.",
            "This telemetry is used strictly for processing software updates, validating legal licensing rights, preventing credit exploits, and managing support tickets.",
            "WebzoneBD IT Solution maintains a strict zero-sharing protocol: we do not sell or rent customer database lists to third-party ad networks or brokers."
          ]
        },
        {
          id: "section-5",
          title: "Digital Product Licensing",
          badge: "License Scope",
          gradient: "from-indigo-500 to-purple-500",
          icon: <FileSpreadsheet className="w-5 h-5 text-violet-500" />,
          content: [
            "Purchasing a digital product grants the buyer a conditional usage license according to terms configured with that product.",
            "Permitted Operations: You may install the script on the authorized domain limit, customize stylesheets and core controller logic for personal or venture projects, and receive future security hotfixes.",
            "Prohibited Operations: You are strictly forbidden from reselling components to another site, distributing original zipped script source files, or claiming copyright attribution for the brand logo or core source code."
          ]
        },
        {
          id: "section-6",
          title: "Refund Policy",
          badge: "Customer Risk",
          gradient: "from-red-500 to-rose-600",
          icon: <RefreshCw className="w-5 h-5 text-rose-500" />,
          content: [
            "Due to the nature of intangible software delivery, cash refunds are generally unavailable once files have been accessed by your customer account.",
            "Exceptions are reviewed on a case-by-case basis under: Duplicate Payments, confirmed complete failure of the download server, or non-functional features that cannot be resolved by support within 7 days.",
            "All refund claims are subject to log investigation, script tracking analysis, and admin approval logs."
          ]
        },
        {
          id: "section-7",
          title: "Contact & Support",
          badge: "Help Center",
          gradient: "from-teal-500 to-cyan-500",
          icon: <PhoneCall className="w-5 h-5 text-teal-500" />,
          content: [
            "Company Namespace: WebzoneBD IT Solution",
            "SaaS Website Address: www.webzonebd.com",
            "Support Email Helpline: info@webzonebd.com",
            "WhatsApp Global Assistance: +966 570511931 (Saudi Arabia)",
            "Our friendly on-site developers are eager to assist through digital tickets, secure email pipelines, and real-time WhatsApp interactive portals."
          ]
        }
      ]
    },
    bn: {
      badge: "আইন ও কমপ্লায়েন্স",
      title: "প্রাইভেসি পলিসি এবং লাইসেন্সিং শর্তাবলী",
      subtitle: "আপনার গোপনীয়তা, নিরাপত্তা এবং ডিজিটাল লাইসেন্সিং অধিকার আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। অনুগ্রহ করে আমাদের সফটওয়্যার লাইসেন্সিং, ডিজিটাল ডাউনলোড লগের শর্তাবলী এবং গ্রাহক তথ্য সুরক্ষা সংক্রান্ত নীতিগুলো পর্যালোচনা করুন।",
      values: [
        { label: "নিরাপদ লেনদেন", desc: "১০০% এনক্রিপ্টেড পেমেন্ট মেথড" },
        { label: "লাইসেন্সিং চুক্তি", desc: "যাচাইকৃত কাস্টম ব্যবহারকারী শর্তাবলী" },
        { label: "গোপনীয়তা সুরক্ষা", desc: "কোনো থার্ড-পার্টি ট্র্যাকিং বা তথ্য বিক্রয় নেই" },
        { label: "গ্রাহক অধিকার", desc: "নির্দিষ্ট সাপোর্ট গাইডলাইন ও রিফান্ড পলিসি" }
      ],
      lastUpdated: "সর্বশেষ সংস্করণ ও ভ্যালিডেশন: মে ২০২৬",
      searchPlaceholder: "পলিসি খুঁজুন...",
      collapseAll: "সব সংকুচিত করুন",
      expandAll: "সব প্রসারিত করুন",
      printFriendly: "প্রিন্ট মোড বদলান",
      printAction: "পিডিএফ ডকুমেন্ট ডাউনলোড/প্রিন্ট করুন",
      backToHome: "প্রধান স্টোরে ফিরে যান",
      toc: "আইনি নির্দেশিকা সূচী",
      disclaimerTitle: "আইনি দাবিত্যাগ",
      disclaimerText: "ওয়েবজোনবিডি আইটি সলিউশন যেকোনো সময় কোনো পূর্ব নোটিশ ছাড়াই এই নীতি, লাইসেন্সিং শর্তাবলী এবং গ্রাহক চ্যাট সাপোর্ট রুট পরিবর্তন করার অধিকার সংরক্ষণ করে। গ্রাহকদের নিয়মিত এই পাতাটি ভিজিট করতে উৎসাহিত করা হচ্ছে।",
      copiedLabel: "লিঙ্ক কপি হয়েছে!",
      sectionCopiedLabel: "সেকশন কপি হয়েছে!",
      searchNoResult: "কোনো নিবন্ধ পাওয়া যায়নি। অনুগ্রহ করে 'cPanel', 'Refund', 'SQL', বা 'WhatsApp' লিখে পুনরায় চেষ্টা করুন।",
      viewProject: "উয়েবজোনবিডি ভিজিট করুন",
      sections: [
        {
          id: "section-1",
          title: "ইনস্ট্যান্ট ডিজিটাল ডেলিভারি কন্ডিশন",
          badge: "ডিজিটাল ডাউনলোড",
          gradient: "from-blue-600 to-cyan-500",
          icon: <ZapIcon className="w-5 h-5 text-blue-500" />,
          content: [
            "ডিজিটাল পণ্য যেমন পিএইচপি স্ক্রিপ্ট, লারাভেল অ্যাপ্লিকেশন, ওয়ার্ডপ্রেস থিম, প্লাগইন, ব্লগার টেমপ্লেট এবং সফটওয়্যার প্যাকেজ পেমেন্ট সফল হওয়ার পরপরই কাস্টমার ড্যাশবোর্ড থেকে তাত্ক্ষণিকভাবে ডাউনলোড করা যায়।",
            "ডাউনলোডযোগ্য প্রতিটি ফাইল জিপ (ZIP) ফরম্যাটে প্রদান করা হয় এবং প্রকাশের পূর্বে পুঙ্খানুপুঙ্খ ভাইরাস ও ম্যালওয়্যার স্ক্রিন টেস্ট করা হয়।",
            "নিরাপত্তাজনিত কারণে আমাদের বিতরণকৃত সকল ডিজিটাল সম্পদ ক্ষতিকারক উপাদান বা ম্যালওয়্যার মুক্ত কিনা তা স্ক্যান করে নিশ্চিত করা হয়।",
            "ডিজিটাল প্রোডাক্ট অবস্তুগত এবং তাত্ক্ষণিকভাবে ডাউনলোড করা যায় বিধায়, সফলভাবে ফাইল ডাউনলোডের তথ্য সিস্টেমে রেকর্ড হওয়ার পর কোনো রিফান্ড বা মূল অর্থ ফেরত দেওয়া সম্ভব নয়।",
            "গুরুত্বপূর্ণ সতর্কীকরণ: কেনার পূর্বে প্রতিটি স্ক্রিপ্ট বা থিমের কর্মক্ষমতা, প্রয়োজনীয় পিএইচপি রিকোয়ারমেন্ট এবং ডেমো সংস্করণ বিশেষভাবে দেখে নেওয়ার জন্য অনুরোধ করা হচ্ছে।"
          ]
        },
        {
          id: "section-2",
          title: "সিপ্যানেল সার্ভার কনফিগারেশন এবং ইনস্টলেশন",
          badge: "সার্ভার ও কাস্টম সাপোর্ট",
          gradient: "from-purple-600 to-indigo-500",
          icon: <Cpu className="w-5 h-5 text-purple-500" />,
          content: [
            "ওয়েবজোনবিডি আইটি সলিউশন প্রতিটি ফাইলে সহজ ইন্সটলেশন গাইড এবং প্রয়োজনীয় ক্ষেত্রে টেকনিক্যাল এসিস্ট্যান্স প্রদান করে থাকে।",
            "গ্রাহক তার হোস্টিং পরিবেশ বা পিএইচপি রেডি সংস্করণ সঠিকভাবে সফটওয়্যারটির সাথে সামঞ্জস্যপূর্ণ কিনা তা নিশ্চিত করার জন্য সম্পূর্ণ দায়ী থাকবেন।",
            "যদি সার্ভার মিসকনফিগারেশন, আউটডেটেড পিএইচপি সংস্করণ, পিএইচপি এক্সটেনশন অনুপস্থিতি, ডেটাবেজ এরর অথবা পারমিশন ভুলের দরুন ইনস্টল করতে সমস্যা দেখা দেয় তবে সাহায্য করতে আমাদের টিম সদা প্রস্তুত।",
            "আমাদের সাপোর্ট চ্যানেলগুলোর মধ্যে রয়েছে সাপোর্ট টিকিট ড্যাশবোর্ড, অফিশিয়াল ইমেইল এবং সরাসরি হোয়াটসঅ্যাপ সাপোর্ট।",
            "সৌদি ডিরেক্ট ওয়াটসঅ্যাপ নম্বর: +966 570511931 (গ্রাহক সহায়তার জন্য সক্রিয়)",
            "যেকোনো প্রকার কাস্টমাইজেশন, ডিজাইন পরিবর্তন, থার্ড-পার্টি ট্র্যাকিং সংযুক্তিকরণ বা অতিরিক্ত সফটওয়্যার ডেভলপমেন্ট কাস্টম সার্ভিসের অন্তর্ভুক্ত যা স্ট্যান্ডার্ড প্রোডাক্ট লাইসেন্সের আওতাভুক্ত নয়।"
          ]
        },
        {
          id: "section-3",
          title: "কোড কমপ্লায়েন্স ও ডিজাইন সিকিউরিটি স্ট্যান্ডার্ড",
          badge: "কোড সিকিউরিটি",
          gradient: "from-emerald-500 to-teal-500",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          content: [
            "ওয়েবজোনবিডি আইটি সলিউশন সর্বোচ্চ নিরাপত্তা ও স্থিতিশীলতা নিশ্চিত করতে আধুনিক কোডিং সিস্টেম এবং নিরাপদ সফটওয়্যার ডেভলপমেন্ট জীবনচক্র অনুসরণ করে।",
            "আমাদের নিরাপদ নিরাপত্তা কাঠামোর মধ্যে রয়েছে এসকিউএল প্রিপেয়ার্ড স্টেটমেন্টস (Prepared SQL), ইনপুট ভ্যালিডেশন, ক্রস-সাইট স্ক্রিপ্টিং (XSS) প্রতিরোধ, শক্তিশালী অথেনটিকেশন এবং সিস্টেমেটিক ডেটাবেজ প্রোটেকশন স্ট্যান্ডার্ড।",
            "আমরা প্রতিনিয়ত সফটওয়্যারের কোড ফাইল আপডেট করি যাতে আধুনিক যুগের সব ধরণের কমন সিকিউরিটি ঝুঁকি কমানো যায় এবং নির্ভরযোগ্য বিশ্বস্ততা বজায় থাকে।",
            "আপনার মূল্যবান প্রজেক্টের সর্বোচ্চ গতি এবং শতভাগ ডাউনটাইম-মুক্ত পারফরম্যান্সের জন্য প্রডাকশন অ্যাপগুলো আমাদের এনভিএমই ক্লাউড হোস্টিংয়ে হোস্ট করার পরামর্শ রইল।"
          ]
        },
        {
          id: "section-4",
          title: "গ্রাহক গোপনীয়তা সুরক্ষা ও নিয়মনীতি",
          badge: "ডাটা প্রাইভেসি",
          gradient: "from-blue-600 to-indigo-600",
          icon: <LockKeyhole className="w-5 h-5 text-indigo-500" />,
          content: [
            "আমরা গ্রাহকের ব্যক্তিগত তথ্য সুরক্ষা ও তাদের প্রয়োজনীয় প্রাইভেসি বজায় রাখতে দৃঢ় প্রতিজ্ঞ এবং অত্যাধুনিক ব্যাকএন্ড সিকিউরিটি সার্ভার ব্যবহার করি।",
            "সংগৃহীত তথ্যের মধ্যে নাম, ইমেইল ঠিকানা, ফোন নম্বর, বিলিং বা ক্রয়ের মেটা-ডেটা, ড্যাশবোর্ডের সাপোর্ট টিকিটের ইতিহাস এবং অ্যাকাউন্টের অ্যাক্টিভিটি অন্তর্ভুক্ত হতে পারে।",
            "এই সমস্ত তথ্য শুধুমাত্র অর্ডার প্রসেস করা, প্রয়োজনীয় কাস্টমার কেয়ার নিশ্চিত করা, নতুন আপডেট কোড পাঠানো এবং নিরাপত্তা পর্যালোচনায় ব্যবহৃত হয়।",
            "ওয়েবজোনবিডি আইটি সলিউশন সুনির্দিষ্ট প্রতিশ্রুতি দিচ্ছে যে আমরা কখনোই কোনো গ্রাহকের ব্যক্তিগত তথ্য আমাদের ব্যবসা বহির্ভূত কোনো থার্ড-পার্টির নিকট বিক্রি বা ভাড়া দেই না।"
          ]
        },
        {
          id: "section-5",
          title: "ডিজিটাল প্রোডাক্ট লাইসেন্সিং চুক্তি",
          badge: "লাইসেন্স পরিসীমা",
          gradient: "from-indigo-500 to-purple-500",
          icon: <FileSpreadsheet className="w-5 h-5 text-violet-500" />,
          content: [
            "একটি লাইসেন্স ব্যবহারের অনুমোদন শুধুমাত্র নির্দিষ্ট শর্তাবলী অনুযায়ী গ্রাহককে কাস্টম কোড ব্যবহারের অনুমতি দেয়।",
            "অনুমোদিত কার্যক্রম: ক্রয়কৃত স্ক্রিপ্ট একটি নির্দিষ্ট ডোমেইনে ব্যবহারের অধিকার, নিজের ব্যবসার জন্য কোড এবং কাস্টম স্টাইল মডিফাই করার অধিকার ও আপডেট ফাইল অ্যাক্সেস করা।",
            "নিষিদ্ধ কাজ: আমাদের ব্যবসায়িক অনুমোদন ব্যতীত কোনো ডোমেইন ফাইল বা জিপ ফাইল পুনরায় অননুমোদিতভাবে বিক্রি করা, কোড ফাইল পাবলিকলি শেয়ার করা এবং কপিরাইট লিংক মুছে ফেলা।"
          ]
        },
        {
          id: "section-6",
          title: "বিস্তারিত রিফান্ড পলিসি ও শর্তাবলী",
          badge: "ক্রেতার ঝুঁকি",
          gradient: "from-red-500 to-rose-600",
          icon: <RefreshCw className="w-5 h-5 text-rose-500" />,
          content: [
            "অনলাইন ডিজিটাল পণ্যের বিশেষ প্রকৃতির জন্য, সফল ফিজিক্যাল বা ডিজিটাল ডাউনলোডের পর সাধারণ ক্ষেত্রগুলোতে ক্যাশ রিফান্ড পাওয়া সম্ভব নয়।",
            "কয়েকটি ব্যতিক্রম পরিস্থিতিতে রিফান্ড গ্রাহ্য হতে পারে, যেমন: একই পেমেন্ট ভুলবশত দুইবার করা হলে, ড্যাশবোর্ড সার্ভার গোলযোগের জন্য ফাইল ডাউনলোড ব্যর্থ হলে বা সম্পূর্ণ অকার্যকর হলে যা সমাধান করা যায়নি।",
            "যেকোনো রিফান্ড আবেদন আমাদের সার্ভার ডাটাবেজ ট্র্যাক লগের পুঙ্খানুপুঙ্খ রিভিউর পর চূড়ান্ত সমাধান বা সিদ্ধান্ত গ্রহণ করা হয়।"
          ]
        },
        {
          id: "section-7",
          title: "যোগাযোগ ও তথ্য সহায়তা কেন্দ্র",
          badge: "হেল্প সেন্টার",
          gradient: "from-teal-500 to-cyan-500",
          icon: <PhoneCall className="w-5 h-5 text-teal-500" />,
          content: [
            "কোম্পানি: ওয়েবজোনবিডি আইটি সলিউশন",
            "ওয়েবসাইট লিংক: www.webzonebd.com",
            "অফিশিয়াল ইমেইল: info@webzonebd.com",
            "হোয়াটসঅ্যাপ সাপোর্ট লাইন: +966 570511931 (সৌদি কার্যালয়)",
            "আমাদের সাপোর্ট টিম দিন-রাত চব্বিশ ঘণ্টা টিকিট পদ্ধতি, ইমেইল এবং হোয়াটসঅ্যাপ লাইভ চ্যাটের মাধ্যমে গ্রাহকদের তথ্য দিয়ে সাহায্য করতে সদা প্রস্তুত।"
          ]
        }
      ]
    },
    ar: {
      badge: "القوانين والامتثال",
      title: "سياسة الخصوصية واتفاقيات الترخيص الرقمي",
      subtitle: "خصوصيتك وأمنك وحقوق الترخيص الرقمي الخاصة بك هامة جداً بالنسبة لنا. يرجى مراجعة السياسات المتعلقة بترخيص البرامج، والتنزيلات الرقمية، واستلام الاستضافات السحابية وتأمين بيانات العميل الخاصة بالدفع.",
      values: [
        { label: "معاملات آمنة", desc: "أقنية فحص مشفرة بالكامل 100٪" },
        { label: "اتفاقية التراخيص", desc: "ترخيص استخدام برمجيات للنشاط" },
        { label: "حماية الخصوصية", desc: "حظر جمع البيانات بدون إذن أو بيعها" },
        { label: "حقوق المطورين", desc: "شروط الدعم SLAs الفني وسياسات الفحص" }
      ],
      lastUpdated: "آخر فحص وتحديث معتمد: مايو 2026",
      searchPlaceholder: "ابحث في الشروط والمواد الفنية...",
      collapseAll: "ضم جميع الأقسام",
      expandAll: "توسيع جميع الأقسام",
      printFriendly: "وضعية الطباعة الفاخرة",
      printAction: "تحميل أو طباعة وثيقة الاتفاقية (PDF)",
      backToHome: "العودة لباب المتجر",
      toc: "دليل بنود الاتفاقيات",
      disclaimerTitle: "إخلاء مسؤولية قانوني معتمد",
      disclaimerText: "تحتفظ شركة ويب زون بي دي للحلول البرمجية بالحق الكامل والمطلق في إجراء تحديث أو تعديل على هذه البنود، والشروط والاتفاقيات، وتكاليف التهيئة الخارجية للعملاء في أي حين دون إشعار. ونهيب بعملائنا تصفح هذا الدليل القانوني دورياً للوقوف على أحدث التنظيمات القانونية.",
      copiedLabel: "تم نسخ الرابط الحصري!",
      sectionCopiedLabel: "تم نسخ تفاصيل البند!",
      searchNoResult: "لم يتم العثور على أي نتائج مطابقة. يرجى كتابة كلمات مثل 'cPanel' أو 'الاسترجاع' أو 'الواتساب' للمطابقة.",
      viewProject: "زيارة خادم الويب دوت كوم",
      sections: [
        {
          id: "section-1",
          title: "شروط التنزيل الرقمي والتسليم الفوري",
          badge: "التنزيلات الرقمية الفورية",
          gradient: "from-blue-600 to-cyan-500",
          icon: <ZapIcon className="w-5 h-5 text-blue-500" />,
          content: [
            "تُسلّم جميع البرمجيات الرقمية بما فيها سكربتات PHP، وتصاميم لارفيل، وقوالب ووردبريس، وقوالب بلوجر فوراً من خلال لوحة تحكم حساب العميل البرمجية بعد تأكيد عملية الدفع التلقائي بنجاح.",
            "تتوفر حميع الملفات التقنية بصيغة زيب (ZIP) آمنة وخالية من الملفات الضارة وتخضع لاختبار أنظمتنا الوقائية للتحقق التام قبل نشرها بالمتجر.",
            "لأسباب دفاعية وأمنية، يجري مسح مفاتيح التنزيل الرقمي وربط بصمة التسجيل الآمن بإحداثيات العضوية والمنصة.",
            "نظراً لطبيعة السلع غير الملموسة وسرعة نسخ البرمجيات، لا نتيح رد الموال نقدياً بعد قيام سجل النظام بتوثيق عملية التنزيل بنجاح.",
            "التحذير الإداري: نشجع بشدة جميع المشترين على فحص النسخة التجريبية الحية (الدمو المباشر) ومتطلبات التشغيل التقنية والخوادم قبل الدفع التلقائي للطلب."
          ]
        },
        {
          id: "section-2",
          title: "دعم سيرفرات cPanel والتركيب الاسترشادي",
          badge: "الاستضافة والتركيب الفني",
          gradient: "from-purple-600 to-indigo-500",
          icon: <Cpu className="w-5 h-5 text-purple-500" />,
          content: [
            "تقدم ويب زون بي دي للحلول البرمجية كافة أدلة التركيب والتهيئة، والدعم الفني المباشر للمنتجات المؤهلة لتيسير انطلاق العملاء.",
            "يقع عبء التحقق وتجهيز بيئات تشغيل Linux والتأكد من دعم إصدارات PHP المقررة للمنتجات البرمجية على العميل بشكل تام.",
            "عند مواجهة عقبات تهيئة ملقمات الويب مثل: Server Misconfiguration، أو Outdated PHP، أو غياب إضافات IonCube التشفيرية، أو مشاكل قواعد البيانات، يقوم مستشارونا بالتدخل للإسناد.",
            "نوفر منصة دعم متكاملة من خلال نظام التذاكر للعملاء باللوحة، أو البريد المعتمد للمبيعات والنظم، وتطبيقات الواتساب المباشر بالقسم الفني.",
            "رقم الدعم بالواتساب (فرع السعودية): +966 570511931 (نشط على توازن اليوم)",
            "جميع الأعمال المتعلقة بالتعديل المخصص، أو إعادة تخطيط الهوية البصرية، أو ربط طرف ثالث لبوابات المدفوعات تُصنّف كأعمال برمجية وتطويرية مستقلة وتخضع لتقديرات عمل مستقل لا يشملها الترخيص الأساسي."
          ]
        },
        {
          id: "section-3",
          title: "معايير الأمان وصد ثغرات حقن SQL",
          badge: "الأمن البرمجي المستدام",
          gradient: "from-emerald-500 to-teal-500",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          content: [
            "تتبع شركة ويب زون بي دي أرقى دورات تشييد البرامج والحلول لتوفير دفاع تقني قوي للكود البرمجي للمؤسسات والمستهلك.",
            "معايير العمل لدينا تشمل بناء جمل SQL المحضّرة (Prepared SQL Statements)، وتنقيتها ضد ثغرات XSS، وتشفير الجلسات، وحماية بوابات التحقق والتوثيق المزدوج.",
            "نقوم بصفة دورية بإتاحة ترقيات برمجية لسد الهفوات والثغرات وحقن البيانات للحفاظ على موثوقية تشغيل السيرفرات وجودة أداء المواقع الإلكترونية.",
            "للحصول على سرعة مضاعفة واستقرار تام 100٪، ننصح عملائنا بنشر برمجياتهم وتطبيقاتهم على سيرفرات NVMe التابعة لويب زون بي دي."
          ]
        },
        {
          id: "section-4",
          title: "حماية خصوصية بيانات وسجلات المستخدمين",
          badge: "حفظ وسرية البيانات",
          gradient: "from-blue-600 to-indigo-600",
          icon: <LockKeyhole className="w-5 h-5 text-indigo-500" />,
          content: [
            "نلتزم تماماً بحفظ وتأمين هوية مستخدمينا عبر ملقمات وقواعد بيانات مشفرة كلياً.",
            "تشمل البيانات التي يجري تسجيلها للأغراض المحاسبية: الاسم، عنوان البريد الفعال، أرقام التواصل، سجلات السداد، ومحاضر تذاكر الدعم والنشاط التقني.",
            "نستخدم هذه التفاصيل بشكل حصري لمعالجة تراخيص البرامج، والتحقق ضد التزوير بالإنترنت، وترقية وتوفير حزم الأكواد والدعم الفني.",
            "تلتزم ويب زون بي دي بسياسة صارمة لمنع تسريب البيانات: لا نقوم ببيع أو تأجير أو مشاركة تفاصيل العملاء مع أي منصات تتبع أو إعلانات خارجية نهائياً وفي كل الظروف."
          ]
        },
        {
          id: "section-5",
          title: "بنود تراخيص المنتجات والبرمجيات",
          badge: "ترخيص الاستخدام المقنن",
          gradient: "from-indigo-500 to-purple-500",
          icon: <FileSpreadsheet className="w-5 h-5 text-violet-500" />,
          content: [
            "شراء المنتج يمنح المشتري ترخيص استخدام محدود بموجب الاشتراطات الخاصة بالمنتج لإرساء الشفافية والمسؤولية.",
            "الحقوق المسموح بها: تنصيب الكود على نطاق الدومين المرخص، وتطوير كود الواجهات والتطبيق لمطابقة الأهداف التجارية للعميل، والحصول على التحديثات الصادرة للمنتج.",
            "الحقوق المحظورة والممنوعة تماماً: إعادة بيع الكود للغير، أو فك ونشر الملفات الأصلية علناً، أو ادعاء الملكية الرسمية وحذف الروابط التوثيقية لفوটার মডিউল."
          ]
        },
        {
          id: "section-6",
          title: "سياسة الاسترجاع وحقوق المعاملات والاستخلاص",
          badge: "حق الاسترجاع",
          gradient: "from-red-500 to-rose-600",
          icon: <RefreshCw className="w-5 h-5 text-rose-500" />,
          content: [
            "بناء على طبيعة المواد البرمجية القابلة للنسخ، فإن التعويضات النقدية غير متاحة فور تأكيد تسليم البرمجيات بحساب العضو الرقمي.",
            "تُراجع الطلبات الاستثنائية وتخضع للمراجعة والتدقيق الإداري لحالات مثل: تكرار عملية الدفع بالخطأ، غياب كامل لتجهيزات وخادم التحميل، أو خلل فني في البرمجية غير برمجيات الأطراف الخارجية عجز الفنيون عن معالجته بسبعة أيام.",
            "تخضع جميع مطالبات الرد المالي لفحص السجلات التاريخية للخوادم للتحقق التام من نزاهة وصحة المراسلات الفنية للشركة."
          ]
        },
        {
          id: "section-7",
          title: "المراسلة ومكتب تنظيم الإفادات الفنية",
          badge: "اتصل بقسم النظم",
          gradient: "from-teal-500 to-cyan-500",
          icon: <PhoneCall className="w-5 h-5 text-teal-500" />,
          content: [
            "اسم الكيان التجاري: ويب زون بي دي للحلول التقنية (WebzoneBD IT Solution)",
            "رابط بوابة الإنترنت: www.webzonebd.com",
            "صندوق البريد التقني: info@webzonebd.com",
            "الخط الهاتفي الفعال: +966 570511931 (الرياض، المملكة العربية السعودية)",
            "يعمل فنيونا ومهندسونا على مدار الـ 24 ساعة عبر مكاتب فرز التذاكر، رسائل المبيعات بالبريد الإلكتروني، والواتساب لدعم نمو مشاريعكم بنجاح وتميز تقني ملموس."
          ]
        }
      ]
    }
  }), [language]);

  const activeContent = useMemo(() => {
    return legalContent[language] || legalContent.en;
  }, [legalContent, language]);

  // Handle active section scrolling highlight tracking
  useEffect(() => {
    if (isPrintFriendly) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      
      // Update reading progress bar
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (windowHeight > 0) {
        setScrollProgress((window.scrollY / windowHeight) * 100);
      }

      let currentSecId = 'section-1';
      for (const sectionId of Object.keys(sectionRefs.current)) {
        const el = sectionRefs.current[sectionId];
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSecId = sectionId;
          }
        }
      }
      setActiveSection(currentSecId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPrintFriendly]);

  // Search filter logic
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return activeContent.sections;
    const query = searchTerm.toLowerCase();
    return activeContent.sections.filter(sec => 
      sec.title.toLowerCase().includes(query) || 
      sec.content.some(paragraph => paragraph.toLowerCase().includes(query)) ||
      sec.badge.toLowerCase().includes(query)
    );
  }, [searchTerm, activeContent]);

  const handleScrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -90; // offset spacing for sticky headers
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCollapseAll = () => {
    const closed = activeContent.sections.reduce((acc, sec) => {
      acc[sec.id] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedSections(closed);
  };

  const handleExpandAll = () => {
    const opened = activeContent.sections.reduce((acc, sec) => {
      acc[sec.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedSections(opened);
  };

  const handleCopySection = (id: string, textList: string[]) => {
    const fullText = textList.join('\n\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedSectionId(id);
      setTimeout(() => setCopiedSectionId(null), 3000);
    });
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen text-neutral-800 dark:text-neutral-200 transition-colors duration-300 font-sans pb-24 relative select-none
        ${isPrintFriendly ? 'bg-white text-black p-8' : 'bg-[#F8FAFC] dark:bg-[#020617]'}
      `}
      id="compliance-portal-wrapper"
    >
      {/* 1. Reading Progress Bar */}
      {!isPrintFriendly && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-neutral-200/50 dark:bg-neutral-900/40 z-[99]" id="reading-bar-shell">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* 2. Glassmorphic Hero Banner */}
      <section className={`relative overflow-hidden pt-12 text-center select-none
        ${isPrintFriendly ? 'border-b pb-4' : 'pb-16 bg-gradient-to-b from-blue-600/5 via-cyan-500/5 to-transparent border-b border-neutral-200/30 dark:border-neutral-900/50'}
      `}>
        {/* Glow Spheres */}
        {!isPrintFriendly && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute top-2 right-1/4 w-[250px] h-[250px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          {/* Legal Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 rounded-full animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-700 dark:text-cyan-300">
              {activeContent.badge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4.5xl md:text-5xl font-black tracking-tight leading-tight select-text">
            <span className="text-neutral-950 dark:text-white block sm:inline">
              {activeContent.title.split('&')[0]} &
            </span>{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent block sm:inline">
              {activeContent.title.split('&')[1] || 'Digital Agreements'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed select-text font-serif">
            {activeContent.subtitle}
          </p>

          {!isPrintFriendly && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4">
              {activeContent.values.map((val, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-white/75 dark:bg-[#0c1222]/80 border border-neutral-200/50 dark:border-neutral-850 rounded-xl text-left hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="text-xs font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5 leading-none">
                    <span className="text-emerald-500 shrink-0 text-sm">✓</span>
                    <span>{val.label}</span>
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1 leading-normal font-sans font-medium">{val.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-mono font-bold text-neutral-450">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeContent.lastUpdated}</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
              <Globe className="w-3.5 h-3.5" />
              <span>WebzoneBD IT Solution</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Search Bar and Tool Controls Section */}
      {!isPrintFriendly && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white/60 dark:bg-[#0c1222]/60 backdrop-blur-md border border-neutral-200/40 dark:border-neutral-850 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Smooth interactive Search */}
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={activeContent.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none text-xs font-semibold tracking-wide text-neutral-900 dark:text-white"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-400 bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md hover:text-red-500"
                >
                  X
                </button>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCollapseAll}
                className="px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-[11px] font-bold rounded-lg transition"
              >
                {activeContent.collapseAll}
              </button>
              <button
                onClick={handleExpandAll}
                className="px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-[11px] font-bold rounded-lg transition"
              >
                {activeContent.expandAll}
              </button>
              
              <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

              <button
                onClick={() => setIsPrintFriendly(!isPrintFriendly)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 border
                  ${isPrintFriendly 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 border-neutral-200/50 dark:border-neutral-800'
                  }
                `}
                title="Enter clean minimalist view optimized for PDF formatting"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{activeContent.printFriendly}</span>
              </button>
            </div>

          </div>
        </section>
      )}

      {/* 4. Central Layout Grid containing sticky TOC on left & Content Panels on right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className={`grid grid-cols-1 ${isPrintFriendly ? 'w-full' : 'lg:grid-cols-4'} gap-8 items-start`}>
          
          {/* A. Sticky Table of Contents (Hidden in Print View) */}
          {!isPrintFriendly && (
            <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-4" id="table-of-contents-rail">
              <div className="bg-white/80 dark:bg-[#0c1222]/80 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-850 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/40 dark:border-neutral-800/40 pb-2.5">
                  <h3 className="text-xs uppercase font-mono font-black tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{activeContent.toc}</span>
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded text-neutral-500">
                    {filteredSections.length} Articles
                  </span>
                </div>

                <nav className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1" id="toc-scroller">
                  {filteredSections.map((sec, idx) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleScrollToSection(sec.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold leading-relaxed transition-all duration-200 flex items-start gap-2.5 group cursor-pointer
                          ${isActive 
                            ? 'bg-blue-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20' 
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-transparent'
                          }
                        `}
                      >
                        <span className={`text-[10px] font-mono font-black p-1 rounded-lg shrink-0 w-5 h-5 flex items-center justify-center leading-none mt-0.5
                          ${isActive 
                            ? 'bg-blue-600 text-white dark:bg-cyan-500' 
                            : 'bg-neutral-100 dark:bg-neutral-905 text-neutral-405'
                          }
                        `}>
                          {idx + 1}
                        </span>
                        <span className="truncate group-hover:underline transition-all">
                          {sec.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Return button */}
                <div className="pt-2 border-t border-neutral-200/30 dark:border-neutral-800/20">
                  <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed mb-2 select-text font-serif">
                    WebzoneBD provides reliable secure licensing guidelines.
                  </p>
                  <button
                    onClick={() => handleTriggerPrint()}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.01] hover:shadow-xs text-white text-[10px] font-black font-mono uppercase rounded-xl transition flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer active:scale-95"
                  >
                    <Printer className="w-3 h-3" />
                    <span>{activeContent.printAction.split(' ')[1] || 'Print'} Doc (PDF)</span>
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* B. Core Legal Articles content (Main block) */}
          <main className={isPrintFriendly ? 'w-full' : 'lg:col-span-3'}>
            
            {filteredSections.length === 0 ? (
              <div className="bg-white dark:bg-[#0c1222] border border-neutral-200 dark:border-neutral-850 rounded-2xl p-10 text-center space-y-4">
                <span className="text-4xl block">🔍</span>
                <p className="text-sm font-bold text-[#E11D48] dark:text-rose-400">
                  {activeContent.searchNoResult.split('.')[0]}.
                </p>
                <p className="text-xs text-neutral-450 dark:text-neutral-400 font-serif leading-relaxed max-w-md mx-auto">
                  {activeContent.searchNoResult.split('.')[1] || 'Please refine search keywords and parameters.'}
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 text-xs font-black rounded-xl hover:bg-neutral-200"
                >
                  Reset Filtering State
                </button>
              </div>
            ) : (
              <div className="space-y-6 select-text">
                {filteredSections.map((sec, index) => {
                  const isExpanded = expandedSections[sec.id] !== false;
                  return (
                    <motion.div
                      key={sec.id}
                      ref={el => { sectionRefs.current[sec.id] = el; }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden
                        ${isPrintFriendly 
                          ? 'border-neutral-400 bg-white text-black p-4 mb-4' 
                          : 'bg-white dark:bg-[#0F172A] border-neutral-200/70 dark:border-neutral-850 hover:shadow-md hover:shadow-blue-500/5 hover:border-neutral-300 dark:hover:border-neutral-800'
                        }
                      `}
                      id={sec.id}
                    >
                      {/* Left glowing border accent for SaaS Enterprise layout representation */}
                      {!isPrintFriendly && (
                        <div className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${sec.gradient}`} />
                      )}

                      {/* Header element */}
                      <div 
                        onClick={() => !isPrintFriendly && toggleSection(sec.id)}
                        className={`p-5 flex items-center justify-between gap-4 select-none
                          ${isPrintFriendly ? 'border-b pb-2 mb-2' : 'cursor-pointer'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {!isPrintFriendly && (
                            <span className="p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl group-hover:scale-110 transition duration-350">
                              {sec.icon}
                            </span>
                          )}
                          <div className="text-left">
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold uppercase
                              ${isPrintFriendly 
                                ? 'border text-black' 
                                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200/50 dark:border-neutral-800'
                              }
                            `}>
                              {sec.badge}
                            </span>
                            <h2 className="text-base sm:text-lg font-black tracking-tight mt-1 text-neutral-950 dark:text-white">
                              {sec.title}
                            </h2>
                          </div>
                        </div>

                        {!isPrintFriendly && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySection(sec.id, sec.content);
                              }}
                              className="p-1.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-blue-600/10 hover:text-blue-500 rounded-lg text-neutral-400 cursor-pointer transition"
                              title="Copy active policy legal text block"
                            >
                              {copiedSectionId === sec.id ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-neutral-450 dark:text-neutral-500"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.span>
                          </div>
                        )}
                      </div>

                      {/* Expanded Terms Body Text */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={isPrintFriendly ? undefined : { height: 0, opacity: 0 }}
                            animate={isPrintFriendly ? undefined : { height: 'auto', opacity: 1 }}
                            exit={isPrintFriendly ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className={`px-5 pb-6 text-xs sm:text-[13px] leading-relaxed select-text space-y-3 font-serif
                              ${isPrintFriendly ? 'text-black' : 'text-neutral-600 dark:text-neutral-300'}
                            `}>
                              {sec.content.map((para, pIdx) => {
                                const isImportant = para.startsWith("Important Notice:") || para.startsWith("গুরুত্বপূর্ণ সতর্কীকরণ:") || para.startsWith("التحذير الإداري:") || para.startsWith("Saudi Arabia") || para.startsWith("সৌদি ডিরেক্ট") || para.startsWith("رقم الدعم");
                                if (isImportant) {
                                  return (
                                    <div 
                                      key={pIdx} 
                                      className={`p-3.5 border-l-4 rounded-r-xl font-sans text-xs font-semibold
                                        ${isPrintFriendly 
                                          ? 'border-black bg-neutral-100 text-black' 
                                          : 'border-blue-600 dark:border-cyan-400 bg-blue-500/5 text-blue-800 dark:text-cyan-300'
                                        }
                                      `}
                                    >
                                      {para}
                                    </div>
                                  );
                                }
                                return (
                                  <p key={pIdx} className="paragraph-compliance leading-relaxed">
                                    {para}
                                  </p>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Disclaimer and printable footers */}
            <div className={`mt-8 select-text
              ${isPrintFriendly ? 'border-t pt-4 text-xs' : 'p-6 bg-gradient-to-br from-purple-550/5 via-indigo-550/5 to-transparent dark:from-purple-950/10 dark:via-indigo-950/10 border border-neutral-200/60 dark:border-neutral-850 rounded-2xl'}
            `}>
              <div className="flex items-center gap-2 mb-2 text-neutral-900 dark:text-white">
                <Info className="w-4 h-4 text-purple-600 dark:text-violet-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-black uppercase font-mono tracking-wider">
                  ⚠️ {activeContent.disclaimerTitle}
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed font-semibold font-serif">
                {activeContent.disclaimerText}
              </p>
            </div>

            {/* Back to store navigation block */}
            {!isPrintFriendly && (
              <div className="mt-8 flex justify-center">
                <p className="text-xs text-neutral-400 font-bold inline-flex items-center gap-1.5 select-all">
                  <span>🔒 Cryptographically Signed Security Baseline WebzoneBD</span>
                  <span>•</span>
                  <span>MD5-9a812b1</span>
                </p>
              </div>
            )}

          </main>

        </div>
      </section>

    </div>
  );
}

// Inline fallback icon for cleaner compiles
function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      type="image/svg+xml"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
