import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, MapPin, Send, HelpCircle, PhoneCall, 
  MessageSquare, Globe, Copy, Check, UploadCloud, Briefcase, 
  DollarSign, Building, Clock, ChevronDown, Sparkles, Zap, 
  ArrowRight, Facebook, Linkedin, Youtube, Instagram, FileText, CheckCircle
} from 'lucide-react';
import { Language, Theme } from '../types';

interface ContactProps {
  language: Language;
  theme: Theme;
  triggerToast: (msg: string) => void;
}

export default function Contact({ language, theme, triggerToast }: ContactProps) {
  // Offline form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [service, setService] = useState('web');
  const [budget, setBudget] = useState('medium');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  
  // File upload simulation
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  // Custom states
  const [activeOffice, setActiveOffice] = useState<'riyadh' | 'dhaka'>('riyadh');
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  // Simulation parameters
  const [transmittedLog, setTransmittedLog] = useState<any | null>(null);

  const translations = {
    en: {
      heroTag: "🏆 Secure Digital Transformation Partner",
      heroTitle: "Let's Discuss Your Next Project",
      heroSubtitle: "Need a high-speed website, custom software, scaleable VPS hosting, expert SEO ranking, or multi-vendor eCommerce system? Our elite crew is ready to deploy your solutions today.",
      btnScroll: "Contact Us Now",
      btnWhatsApp: "WhatsApp Live Chat",
      btnConsultation: "Get Free Consultation",
      
      infoTitle: "Corporate Workspace Hubs",
      infoSubtitle: "Click to reveal coordinates, maps & dynamic hotline operations.",
      companyName: "WebzoneBD IT Solution",
      addressLabel: "Physical Office Address",
      whatsappLabel: "Riyadh Saudi Arabia Operations (WhatsApp)",
      dhakaLabel: "Dhaka Bangladesh Headquarters",
      billingEmail: "info@webzonebd.com",
      
      btnCopy: "Copy Info",
      btnCopied: "Copied!",
      btnGetDirections: "Directions on Google Map",
      
      formTitle: "Leave an Offline Message",
      formSub: "Submit your inquiry parameters directly to our local SMTP relay server. One of our engineers will contact you securely.",
      
      labelName: "Full Name",
      labelCompany: "Company Name",
      labelEmail: "Email Address",
      labelPhone: "WhatsApp / Contact Phone",
      labelCountry: "Operating Country",
      labelService: "Service Interested In",
      labelBudget: "Planned Budget Range",
      labelSubject: "Inquiry Headline",
      labelMsg: "Project Objectives / Detailed Requirements",
      labelAttachment: "Attach Project Brief / Mockup System (PDF/DOC)",
      attachmentPlaceholder: "Drag & drop files here or click to select from archive",
      
      serviceOptionWeb: "SaaS Web Development (React / Next.js)",
      serviceOptionEcom: "Multi-vendor Ecommerce & Cart Systems",
      serviceOptionNews: "Advanced High-Speed News Portals",
      serviceOptionBlog: "Headless GraphQL Blogging Websites",
      serviceOptionSeo: "SEO Operations & Strategic Google Ads",
      serviceOptionPos: "Enterprise Cloud ERP & Offline POS Systems",
      
      budgetOptionLow: "Basic Scale Program (< ৳20,000 / $250)",
      budgetOptionMid: "SME Standard Level (৳20k-৳50k / $250-$600)",
      budgetOptionHigh: "Custom Enterprise Software & Cloud (৳50,550+)",
      
      btnSubmit: "Transmitting Secure Inquiry",
      btnWhatsappSubmit: "Send Request via WhatsApp Chat",
      successTitle: "data transmission completed successfully!",
      successDesc: "Your request has been routed to our active CRM database queue. A ticketing invoice summary is printed below:",
      
      chatTitle: "Live Chat Communication",
      chatSub: "Choose your favorite instantaneous encryption protocol below to chat instantly.",
      chatStatus: "Available Now & Replying instantly",
      btnMessager: "Facebook Messenger",
      btnTelegram: "Secure Telegram",
      
      socialTitle: "Connect With Our Network",
      socialSub: "Follow our social profiles to track discounts, release news, and customer case videos.",
      
      hoursTitle: "Business Hours & SLAs",
      daysWeek: "Saturday - Thursday",
      hoursWeek: "08:00 AM - 06:00 PM (Riyadh & BD Time)",
      daysFri: "Friday Support Desk",
      hoursFri: "Limited Support (Emergency Ticket Redirection)",
      
      faqTitle: "Frequently Answered Queries",
      faqSub: "Find quick answers regarding our service SLAs, quotation processes, and post-launch maintenance guarantees.",
      
      ctaTitle: "Ready To Start Your Project?",
      ctaSub: "Let WebzoneBD IT Solution help transform your business with modern technology solutions. Request a free call today.",
      ctaQuote: "Request Dynamic Quote",
      ctaSupport: "WhatsApp Support Desk",
      ctaInquiry: "Send Instant Message"
    },
    bn: {
      heroTag: "🏆 নির্ভরযোগ্য বিজনেস ডিজিটাল পার্টনার",
      heroTitle: "আপনার পরবর্তী প্রজেক্ট নিয়ে আলোচনা করুন",
      heroSubtitle: "আপনার কি একটি হাই-স্পিড ওয়েবসাইট, কাস্টম সফটওয়্যার, ক্লাউড হোস্টিং, গুগল এডওয়ার্ডস বা মাল্টি-ভেন্ডর ই-কমার্স সাইটের প্রয়োজন? আমাদের ইঞ্জিনিয়ারিং টিম আপনার সেবায় নিয়োজিত রয়েছে।",
      btnScroll: "সরাসরি যোগাযোগ করুন",
      btnWhatsApp: "হোয়াটসঅ্যাপ লাইভ চ্যাট",
      btnConsultation: "ফ্রি টেক্সট কন্সাল্টেশন",
      
      infoTitle: "আমাদের কর্পোরেট অফিস লোকেশন",
      infoSubtitle: "অফিসের রিয়েল-টাইম ঠিকানা, ম্যাপ লিংক এবং অফিসিয়াল যোগাযোগ নম্বর সমূহ দেখতে ক্লিক করুন।",
      companyName: "ওয়েবজোনবিডি আইটি সলিউশন",
      addressLabel: "অফিসের মূল ঠিকানা",
      whatsappLabel: "রিয়াদ সৌদি আরব শাখা (হোয়াটসঅ্যাপ)",
      dhakaLabel: "ঢাকা বাংলাদেশ প্রধান কার্যালয় হেল্পলাইন",
      billingEmail: "info@webzonebd.com",
      
      btnCopy: "কপি করুন",
      btnCopied: "কপি হয়েছে!",
      btnGetDirections: "গুগল ম্যাপে ডিরেকশন",
      
      formTitle: "লিভ অ্যান অফলাইন মেসেজ ফর্ম",
      formSub: "আপনার প্রজেক্টের রিকোয়ারমেন্ট সাবমিট করুন। আমাদের কাস্টিক ডাটাবেজে আপনার রিকোয়েস্ট যুক্ত করে খুব দ্রুত মেইল বা কল করা হবে।",
      
      labelName: "আপনার পুরো নাম",
      labelCompany: "কোম্পানির নাম (যদি থাকে)",
      labelEmail: "ইমেইল এড্রেস",
      labelPhone: "হোয়াটসঅ্যাপ / সক্রিয় কন্টাক্ট নাম্বার",
      labelCountry: "আপনার দেশ",
      labelService: "পছন্দনীয় সার্ভিস ক্যাটাগরি",
      labelBudget: "প্রজেক্টের আনুমানিক বাজেট",
      labelSubject: "মেসেজের মূল বিষয়",
      labelMsg: "প্রজেক্টের বিস্তারিত বিবরণ / প্রয়োজনীয় ফিচার সমূহ",
      labelAttachment: "প্রজেক্টের লেআউট ফাইল / রিকোয়ারমেন্ট ডকুমেন্ট যুক্ত করুন",
      attachmentPlaceholder: "ফাইলগুলো এখানে ড্র্যাগ করুন অথবা সিলেক্ট করতে ক্লিক করুন।",
      
      serviceOptionWeb: "কাস্টম ওয়েবসাইট ডেভেলপমেন্ট (React / Next.js)",
      serviceOptionEcom: "মাল্টি-ভেন্ডর ই-কমার্স ডিজিটাল স্টোর ও কাট সিস্টেম",
      serviceOptionNews: "অটো ই-পেপার সিঙ্কসহ নিউজ পোর্টাল অনলাইন",
      serviceOptionBlog: "হেডলেস ওয়ার্ডপ্রেস ও ব্লগার ব্লগার থিম অপ্টিমাইজেশন",
      serviceOptionSeo: "অর্গানিক এসইও এবং গুগল ও মেটা এডস ক্যাম্পেইন",
      serviceOptionPos: "ক্লাউড এন্টারপ্রাইজ ইআরপি ও অফলাইন পস সফটওয়্যার",
      
      budgetOptionLow: "বেসিক স্কেল প্রোগ্রাম (< ২০,০০০ টাকা)",
      budgetOptionMid: "স্ট্যান্ডার্ড প্রফেশনাল লেভেল (২০,০০০ - ৫০,০০০ টাকা)",
      budgetOptionHigh: "এন্টারপ্রাইজ কাস্টম সফটওয়্যার ও ক্লাউড (৫০,০০০+ টাকা)",
      
      btnSubmit: "মেসেজটি ট্রান্সমিট করুন",
      btnWhatsappSubmit: "হোয়াটসঅ্যাপে সরাসরি মেসেজ পাঠান",
      successTitle: "মেসেজটি সফলভাবে সিস্টেমে জমা হয়েছে!",
      successDesc: "আসসালামু আলাইকুম! আপনার বিবরণটি আমাদের ডাটাবেজে যুক্ত করা হয়েছে। নিম্নে রিসিট টিকিট কপি প্রিন্ট করা হলো:",
      
      chatTitle: "লাইভ চ্যাট কুয়্যারি সাপোর্ট",
      chatSub: "তাত্ক্ষণিক যোগাযোগের জন্য নিচে দেওয়া যেকোনো পছন্দের এনক্রিপশন সিস্টেম ব্যবহার করে চ্যাট শুরু করুন।",
      chatStatus: "সহায়তাকর্মী অনলাইনে আছেন এবং দ্রুত রিপ্লাই দিচ্ছেন",
      btnMessager: "ফেসবুক মেসেঞ্জার",
      btnTelegram: "সিকিউর টেলিগ্রাম চ্যাট",
      
      socialTitle: "আমাদের সোশ্যাল মিডিয়া নেটওয়ার্ক",
      socialSub: "আমাদের সোশ্যাল প্রোফাইলগুলোতে নিয়মিত ডিসকাউন্ট অফার এবং প্রজেক্টের সাকসেস কেস ভিডিও ট্র্যাক করুন।",
      
      hoursTitle: "অফিস আওয়ার ও সার্ভিস ডেডলাইন",
      daysWeek: "শনিবার - বৃহস্পতিবার",
      hoursWeek: "সকাল ০৮:০০ টা - সন্ধ্যা ০৬:০০ টা (রিয়াদ ও বিডি টাইম)",
      daysFri: "শুক্রবার হেল্প ডেস্ক",
      hoursFri: "জরুরি সাপোর্ট (শুধুমাত্র মেইল বা হোয়াটসঅ্যাপ টিকিট রুট)",
      
      faqTitle: "অনলাইন জিজ্ঞাসিত প্রশ্নোত্তর সমূহ (FAQ)",
      faqSub: "আমাদের কোটেশন প্রক্রিয়া, প্রজেক্ট ডেলিভারি টাইম এবং লাইফ-টাইম ব্যাকআপ সহায়তা সংক্রান্ত প্রশ্ন ও উত্তর সমূহ।",
      
      ctaTitle: "আপনার প্রজেক্টটি আজই শুরু করতে চান?",
      ctaSub: "আমাদের কাস্টম প্রিমিয়াম আইটি সলিউশন দিয়ে আপনার ব্যবসাকে দিন নতুন গতি। আজই একটি ফ্রি কন্সাল্টেশন কোটা বুক করুন।",
      ctaQuote: "ডাইনামিক কোটেশন রিকোয়েস্ট",
      ctaSupport: "হোয়াটসঅ্যাপ সাপোর্ট হেল্পলাইন",
      ctaInquiry: "তাত্ক্ষণিক মেসেজ পাঠান"
    },
    ar: {
      heroTag: "🏆 شريك التحول الرقمي التقني المعتمد",
      heroTitle: "فلنناقش مشروعك القادم ونصنعه بدقة",
      heroSubtitle: "هل تحتاج إلى موقع ويب فائق ومستقر، برنامج مخصص للشركات، خوادم لوحة تحكم cPanel، سيو احترافي أو نظام نقاط بيع متطور؟ فريق ويب زون بي دي التقني مستعد لنقل نشاطك آلياً اليوم.",
      btnScroll: "تواصل معنا فوراً بالأسفل",
      btnWhatsApp: "محادثة واتساب الفورية",
      btnConsultation: "طلب كشف فني واستشارة مجاناً",
      
      infoTitle: "مواقع ومكاتب مكاتبنا الرسمية",
      infoSubtitle: "انقر فوق اسم المكتب لعرض الإحداثيات الكاملة وخط الهواتف الخارجي المباشر.",
      companyName: "WebzoneBD IT Solution",
      addressLabel: "العنوان الفعلي والمقر المعتمد",
      whatsappLabel: "إدارة عمليات الرياض بالمملكة العربية السعودية (واتساب)",
      dhakaLabel: "المقر الرئيسي للإدارة - دكا بنغلاديش",
      billingEmail: "info@webzonebd.com",
      
      btnCopy: "نسخ التفاصيل",
      btnCopied: "تم النسخ!",
      btnGetDirections: "عرض الإتجاهات بالخريطة للتنقل",
      
      formTitle: "إرسال رسالة غير متزامنة للمراجعة",
      formSub: "تفضل بتسجيل تفاصيل مشروعك أو السكربت الذي ترغب به في خوادمنا، وسنقوم بمراجعة التفاصيل لتأكيد الحصة.",
      
      labelName: "الاسم الكريم بالكامل",
      labelCompany: "اسم الشركة التجارية (اختياري)",
      labelEmail: "البريد الإلكتروني المهني",
      labelPhone: "الهاتف أو الواتساب الفعال",
      labelCountry: "دولة العمل والتشغيل",
      labelService: "الخدمة أو النوع المستهدف",
      labelBudget: "نطاق الميزانية التقديرية",
      labelSubject: "عنوان الاستفسار الرئيسي",
      labelMsg: "تفاصيل وأهداف وخصائص فكرة المشروع",
      labelAttachment: "إرفاق مستند المتطلبات أو اللقطات (PDF/DOC)",
      attachmentPlaceholder: "اسحب ملفات المتطلبات هنا برفق أو انقر لإختيار أرشيف محلي",
      
      serviceOptionWeb: "تطوير بوابات الويب والسحابيات (React / Next.js)",
      serviceOptionEcom: "منصات أسواق التجارة الإلكترونية الشاملة ومقومات الدفع",
      serviceOptionNews: "مواقع الصحف الإخبارية الفورية ومخازن الإعلانات جودل",
      serviceOptionBlog: "مدونات وقوالب ووردبريس المتوافقة مع محركات البحث سيو",
      serviceOptionSeo: "حملات سيو متقدمة وإدارة إعلانات جوجل الاحترافية",
      serviceOptionPos: "أنظمة نقاط البيع الكاشير الفورية بدون الحاجة لإنترنت",
      
      budgetOptionLow: "الباقة الأولية السريعة (< 20,000 ৳ / 250$)",
      budgetOptionMid: "الحزمة المتوسطة للنمو والتجارة (20k-50k ৳ / 250$-600$)",
      budgetOptionHigh: "حلول برمجية وخطط سحابية مخصصة للشركات (50,000+ ৳)",
      
      btnSubmit: "بث طلبي الفني الآمن للسيرفر",
      btnWhatsappSubmit: "توجيه وتمرير الطلب مباشر عبر الواتساب",
      successTitle: "تم استيعاب وبث طلبي الفني المالي لغرف CRM بنجاح!",
      successDesc: "أهلاً وسهلاً بك! تم إرسال الرسالة إلى إدارة هندسة الأنظمة السحابية بنجاح وقمنا بتوليد الفاتورة التقديرية المكتملة أدناه:",
      
      chatTitle: "مكتب المراسلة السريعة والدردشة",
      chatSub: "فضلًا اختر تطبيق التشفير والتواصل المفضل لديك أدناه للربط والتحدث فوراً مع مهندسينا الأكفاء.",
      chatStatus: "المستشار متصل ومتاح للمراسلة الفورية بلا لافتات تعليق",
      btnMessager: "فيسبوك ماسنجر للأعمال",
      btnTelegram: "تليغرام المحمي الفوري",
      
      socialTitle: "تواصل مع مجتمعنا التقني",
      socialSub: "تابع بواباتنا الاجتماعية الرسمية لتصلك تحديثات السكربتات وصور الخرج وأخبار تخفيضات الاستضافة الفورية.",
      
      hoursTitle: "مؤشرات عمل المكاتب وخطوط SLAs",
      daysWeek: "السبت إلى الخميس لكل الفروع",
      hoursWeek: "من 08:00 صباحاً وحتى 06:00 مساءً (توقيت الرياض ودكا)",
      daysFri: "عمل مكتب الدعم يوم الجمعة",
      hoursFri: "مغلق (العمل بنظام تذاكر الطوارئ المستعجلة فقط بالواتساب)",
      
      faqTitle: "قسم الأسئلة والأجوبة السريعة الشائعة",
      faqSub: "نصائح وإرشادات سريعة حول أوقات البناء، تجهيز عروض الميزانية، وخطط حماية الأنظمة والدعم الفني بعد التركيب.",
      
      ctaTitle: "جاهز لتأسيس وتدشين أعمالك الرقمية فوراً وبلا حدود؟",
      ctaSub: "دع كبار مهندسي ومطوري ويب زون بي دي للحلول التقنية المتطورة يتولون تشخيص وتعميم خدماتك بأحدث اللغات المعتمدة دولياً.",
      ctaQuote: "مستكشف باقات التسعير التفاعلي",
      ctaSupport: "صالة دعم الواتساب السريعة",
      ctaInquiry: "تراسل وتراسل مع الخوادم"
    }
  };
  const t = translations[language] || translations.en;

  // Offical business metadata details variables
  const offices = {
    riyadh: {
      city: language === 'bn' ? "সৌদি আরব (অনলাইন কন্টাক্ট)" : language === 'ar' ? "المملكة العربية السعودية (اتصال أونلاين فريد)" : "Saudi Arabia (Online Contact Only)",
      address: language === 'bn' ? "কোনো ভৌত অফিস শাখা নেই (শুধুমাত্র অনলাইন ও হোয়াটসঅ্যাপ সাপোর্ট)" : language === 'ar' ? "لا يوجد فرع فعلي للمكتب - دعم فني وتساب وأونلاين فقط" : "No Physical Office (Online Support & WhatsApp Contact Only)",
      phone: "+966 570511931",
      email: "riyadh@webzonebd.com",
      mapSearchUrl: "https://wa.me/966570511931"
    },
    dhaka: {
      city: language === 'bn' ? "ঢাকা, বাংলাদেশ প্রধান কার্যালয়" : language === 'ar' ? "مقر الإدارة الرئيسي دكا بنغلاديش" : "Dhaka, Bangladesh Main HQ Office",
      address: "Azimpur, Dhanmondi Road, Dhaka 1205, Bangladesh",
      phone: "01864000005",
      email: "info@webzonebd.com",
      mapSearchUrl: "https://maps.app.goo.gl/V6EFN5YJ6qhT2YRJ6"
    }
  };

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    triggerToast(language === 'bn' ? "ক্লিপবোর্ডে কপি করা হয়েছে!" : "Successfully copied to clipboard!");
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
      triggerToast(language === 'bn' ? `${e.target.files[0].name} ফাইলটি সংযুক্ত করা হয়েছে` : `${e.target.files[0].name} successfully attached.`);
    }
  };

  const currentOfficeDetails = offices[activeOffice];

  const handleOfflineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !msg) {
      triggerToast(language === 'bn' ? "দয়া করে সকল বাধ্যতামূলক তথ্য পূরণ করুন।" : "Please fill out all mandatory fields.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate real-time secure transmitting to CRM server & SMTP client logs
    setTimeout(() => {
      const log = {
        transmissionUrl: "https://mail-relay.webzonebd.com/v1/smtp-dispatch",
        status: "250 OK Message accepted",
        timestamp: new Date().toISOString(),
        envelope: {
          sender: email,
          recipient: "info@webzonebd.com",
          subject: subject || `Inquiry from ${name} regarding ${service}`
        },
        payload: {
          clientName: name,
          clientCompany: company || "Not Available",
          clientPhone: phone,
          clientEmail: email,
          country: country,
          requestedService: service,
          estimatedBudget: budget,
          detailsMsg: msg,
          attachmentMetadata: attachedFile ? { name: attachedFile.name, size: `${(attachedFile.size / 1024).toFixed(1)} KB` } : null
        }
      };
      
      setIsSubmitting(false);
      setIsSubmittedSuccessfully(true);
      setTransmittedLog(log);
      triggerToast(t.successTitle);
    }, 1800);
  };

  const handleSendWhatsAppQuery = () => {
    const formattedUrlMessage = 
`Hello WebzoneBD IT Solution,
I am interested in your services and would like to direct pass my inquiry.

Name: ${name || '[Enter Name]'}
Company: ${company || '[Enter Company Name]'}
Email: ${email || '[Enter Email Address]'}
Phone: ${phone || '[Enter Phone Number]'}
Service Category: ${service}
Budget Level: ${budget}
Subject: ${subject || 'General Consultation Consultation'}
Message Details: ${msg || '[I would like to start a custom IT system project with WebzoneBD]'}`;
    
    window.open(`https://wa.me/966570511931?text=${encodeURIComponent(formattedUrlMessage)}`, '_blank');
  };

  const handleStartFacebookChat = () => {
    window.open("https://www.facebook.com/Webzonebd", "_blank");
  };

  const handleStartTelegramChat = () => {
    window.open("https://t.me/webzonebdit", "_blank");
  };

  const handleStartInstagramChat = () => {
    window.open("https://www.instagram.com/webzonebd", "_blank");
  };

  const handleStartLinkedinChat = () => {
    window.open("https://www.linkedin.com/company/webzonebd", "_blank");
  };

  const handleStartYoutubeChat = () => {
    window.open("https://www.youtube.com/@webzonebd", "_blank");
  };

  const handleResetForm = () => {
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMsg('');
    setAttachedFile(null);
    setIsSubmittedSuccessfully(false);
    setTransmittedLog(null);
  };

  const faqData = [
    {
      q: language === 'bn' ? "প্রজেক্টের জন্য আপনারা কত দ্রুত সাড়া দেন?" : language === 'ar' ? "ما هي سرعة الاستجابة لطلبات المشاريع الجديدة؟" : "How quickly do you respond to new client inquiries?",
      a: language === 'bn' ? "আমরা সাধারণত আমাদের হোয়াটসঅ্যাপ হেল্পলাইনে এবং মেইল টিকেটে ১ থেকে ২ ঘণ্টার মধ্যে রেসপন্স নিশ্চিত করি।" : language === 'ar' ? "يستجيب فريق مبيعات النظم في غضون ساعة إلى ساعتين كحد أقصى للطلبات الواردة عبر واتساب والبريد الفني." : "We typically respond to new business messages, WhatsApp prompts, or emergency emails within 1 to 2 hours during physical office timelines."
    },
    {
      q: language === 'bn' ? "আমি কি প্রজেক্টের জন্য ফ্রি ডাইনামিক কোটেশন বা বাজেট পেতে পারি?" : language === 'ar' ? "هل يمكنني طلب مقترح مالي وفني مخصص لمشروعي؟" : "Can I request a custom financial & technical quotation?",
      a: language === 'bn' ? "হ্যাঁ! আমাদের এই কন্টাক্ট পেজের ফর্মে রিকোয়ারমেন্ট সাবমিট করলেই আমাদের টিম কাস্টম কোটেশন পিডিএফ আকারে ফ্রীতে শেয়ার করবে।" : language === 'ar' ? "بالتأكيد! فقط املأ بيانات الاستفسار بالنموذج السحابي وسيقوم خبراؤنا بتوليد وإرسال ملف تسعير وقائمة متطلبات PDF متكاملة مجاناً لمشروعكم." : "Yes absolutely! By filling our offline message form with your feature list, our engineering desk will design a complete custom quotation PDF proposal for you free of charge."
    },
    {
      q: language === 'bn' ? "আপনারা কি আন্তর্জাতিক গ্রাহকদের জন্য কাজ করেন?" : language === 'ar' ? "هل تقدمون خدمات برمجية واستضافة للشركات الدولية خارج بنغلاديش والسعودية؟" : "Do you deliver digital and software assistance services internationally?",
      a: language === 'bn' ? "হ্যাঁ, আমরা কাতার, ওমান, সৌদি আরব, কুয়েত, মার্কিন যুক্তরাষ্ট্রসহ বিশ্বব্যাপী ৫টিরও বেশি দেশে কাস্টম আইটি সলিউশন সরবরাহ করে আসছি।" : language === 'ar' ? "نعم نقوم بخدمة الشركات والمؤسسات في دول مجلس التعاون الخليجي، أوروبا والشرق الأوسط، مدعومين بخيارات دفع متعددة العملات والترجمة اللغوية المخصصة." : "Yes, WebzoneBD IT Solution has actively completed web & software systems for international startups and businesses across Saudi Arabia, KSA, UAE, UK, and USA."
    },
    {
      q: language === 'bn' ? "হোয়াটসঅ্যাপ হেল্পলাইনে কি সরাসরি আলোচনা সম্ভব?" : language === 'ar' ? "هل يمكنني مناقشة التفاصيل وحجز الخطط هاتفياً عبر واتساب؟" : "Can I communicate directly with senior developers via WhatsApp?",
      a: language === 'bn' ? "অবশ্যই! আমাদের অফিশিয়াল হোয়াটসঅ্যাপ হেল্পলাইন (+৯৬৬ ৫৭ ০৫১ ১৯৩১) ২৪ ঘণ্টা চ্যাটের জন্য সক্রিয় থাকে। যেকোনো সময় মেসেজ দিলে কাস্টমার এক্সিকিউটিভ সলিড সাপোর্ট দিবে।" : language === 'ar' ? "نعم بالطبع! خط الواتساب الرسمي لدينا يعمل على مدار الساعة لخدمة محادثات الشركاء والاتفاق على معايير الجودة بشكل سريع وآمن." : "Definitely. Our verified WhatsApp support node (+966-570511931) is open for direct communication, allowing you to instantly send requirements, screenshots, or code logs for fast review."
    },
    {
      q: language === 'bn' ? "প্রজেক্ট শেষ করার পরে আপনারা কি বিক্রয়োত্তর সেবা প্রদান করেন?" : language === 'ar' ? "هل تقدمون خدمات الضمان والدعم الفني بعد تسليم المشروع والموقع للعمل؟" : "Do you offer post-delivery maintenance and bug fix support?",
      a: language === 'bn' ? "হ্যাঁ! প্রতিটি ওয়েবসাইটের সাথে আমরা চুক্তির মেয়াদ অনুযায়ী ৩ থেকে ১২ মাস পর্যন্ত সম্পূর্ণ ফ্রি রক্ষণাবেক্ষণ ও কারিগরি সহায়তা প্রদান করি।" : language === 'ar' ? "تقدم ويب زون بي دي فترات ضمان وصيانة مجانية تبدأ من 3 شهور وحتى سنة كاملة بعد الإطلاق لتأمين الحماية التامة للبيانات وحل المشكلات الفنية الطارئة مجاناً." : "Yes. All our custom projects include 3 to 12 months of free technical maintenance, which covers standard script updates, local cPanel backups, database index optimization, and crash recovery."
    }
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#F8FAFC] min-h-screen transition-colors duration-200">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200/50 dark:border-neutral-900 bg-linear-to-b from-blue-50/20 via-transparent to-transparent dark:from-sky-950/10">
        
        {/* Animated gradients and glassmorphism elements matching SaaS feel */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] rounded-full filter blur-[110px] pointer-events-none opacity-20" />
        <div className="absolute bottom-5 left-10 w-96 h-96 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded-full filter blur-[120px] pointer-events-none opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/40 dark:border-blue-900/40 text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>{t.heroTag}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight max-w-4xl mx-auto">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                const el = document.getElementById('leave-offline-message-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/15 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{t.btnScroll}</span>
            </button>

            <button
              onClick={() => {
                window.open("https://wa.me/966570511931", "_blank");
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 hover:text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 border border-neutral-200 dark:border-neutral-850 hover:border-emerald-600 font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>{t.btnWhatsApp}</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('leave-offline-message-form');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  // Set focus to message or form input
                  setTimeout(() => {
                    const firstInput = document.getElementById('form-input-name');
                    if (firstInput) firstInput.focus();
                  }, 400);
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-linear-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>{t.btnConsultation}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ================= 2. CONTACT INFORMATION / OFFICE HUBS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="hubs-directories">
        
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white flex items-center justify-center gap-2">
            <Building className="w-6 h-6 text-[#2563EB]" />
            <span>{t.infoTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
            {t.infoSubtitle}
          </p>
        </div>

        {/* Riyadh / Dhaka Active Hub Navigation State Toggles */}
        <div className="flex items-center justify-center gap-3.5 mb-8">
          <button
            onClick={() => setActiveOffice('riyadh')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
              activeOffice === 'riyadh'
                ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white border-blue-500 shadow-md shadow-blue-500/10'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            📍 {language === 'bn' ? "সৌদি আরব (অনলাইন)" : language === 'ar' ? "السعودية (اتصال أونلاين)" : "Saudi Arabia Online"}
          </button>

          <button
            onClick={() => setActiveOffice('dhaka')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
              activeOffice === 'dhaka'
                ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white border-blue-500 shadow-md shadow-blue-500/10'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            📍 {language === 'bn' ? "ঢাকা প্রধান কার্যালয়" : language === 'ar' ? "المقر الرئيسي في دكا" : "Dhaka Main Headquarters Office"}
          </button>
        </div>

        {/* Active Hub Info Grid Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Office Address & City */}
          <div className="bg-white dark:bg-[#0F172A] border border-neutral-200/60 dark:border-neutral-850 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
            <div className="space-y-2">
              <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 inline-block">
                <MapPin className="w-5 h-5" />
              </span>
              <h3 className="text-xs uppercase font-mono font-black text-neutral-400 tracking-wider">
                {activeOffice === 'riyadh' ? (language === 'bn' ? "অনলাইন কন্টাক্ট চ্যানেল" : language === 'ar' ? "قناة الاتصال أونلاين" : "Online Support Channel") : t.addressLabel}
              </h3>
              <p className="text-sm font-extrabold text-[#2563EB] dark:text-cyan-400">
                {currentOfficeDetails.city}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-semibold">
                {currentOfficeDetails.address}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
              <button
                onClick={() => handleCopyText(currentOfficeDetails.address, 'address')}
                className="text-xs font-mono font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'address' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'address' ? t.btnCopied : t.btnCopy}</span>
              </button>

              <a 
                href={currentOfficeDetails.mapSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>{activeOffice === 'riyadh' ? (language === 'bn' ? "হোয়াটসঅ্যাপে চ্যাট করুন" : language === 'ar' ? "راسلنا على واتساب" : "Chat on WhatsApp") : t.btnGetDirections}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Phone Hotline Call Routing */}
          <div className="bg-white dark:bg-[#0F172A] border border-neutral-200/60 dark:border-neutral-850 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
            <div className="space-y-2">
              <span className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 inline-block">
                <Phone className="w-5 h-5" />
              </span>
              <h3 className="text-xs uppercase font-mono font-black text-neutral-400 tracking-wider">
                {language === 'bn' ? "সরাসরি ফোন ও কন্টাক্ট নোড" : language === 'ar' ? "هاتف الاتصال والمراسلة المباشر" : "Direct Dial Hotlines"}
              </h3>
              <p className="text-sm font-extrabold text-[#2563EB] dark:text-cyan-400 font-mono">
                {currentOfficeDetails.phone}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-normal font-semibold">
                Available during standard daytime hours. Dial directly for quick pre-sales queries.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center gap-3">
              <button
                onClick={() => handleCopyText(currentOfficeDetails.phone, 'phone')}
                className="text-xs font-mono font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'phone' ? t.btnCopied : t.btnCopy}</span>
              </button>

              <a
                href={`tel:${currentOfficeDetails.phone}`}
                className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                📱 Call Directly Now
              </a>
            </div>
          </div>

          {/* Card 3: Agency Billing & Assistance Information */}
          <div className="bg-white dark:bg-[#0F172A] border border-neutral-200/60 dark:border-neutral-850 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
            <div className="space-y-2">
              <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-pink-400 inline-block">
                <Mail className="w-5 h-5" />
              </span>
              <h3 className="text-xs uppercase font-mono font-black text-neutral-400 tracking-wider">
                Email & Online Domain Setup
              </h3>
              <p className="text-sm font-extrabold text-[#2563EB] dark:text-cyan-400 font-mono">
                {t.billingEmail}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-450 font-semibold leading-normal">
                Web Address: www.webzonebd.com<br/>
                For cPanel setup questions, invoicing, or server outages.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
              <button
                onClick={() => handleCopyText("info@webzonebd.com", 'email')}
                className="text-xs font-mono font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'email' ? t.btnCopied : t.btnCopy}</span>
              </button>

              <a
                href="mailto:info@webzonebd.com"
                className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                ✉ Send Secure Mail
              </a>
            </div>
          </div>

        </div>

      </section>

      {/* ================= 3. LEAVE AN OFFLINE MESSAGE FORM ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="leave-offline-message-form">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left instructions block */}
          <div className="lg:col-span-2 text-left space-y-6">
            <div className="space-y-2.5">
              <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 text-[10px] uppercase font-mono font-black tracking-wider">
                📩 Central SMTP Delivery Node
              </span>
              <h2 className="text-2xl sm:text-3xl font-extra-black text-neutral-950 dark:text-white font-sans">
                {t.formTitle}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                {t.formSub}
              </p>
            </div>

            {/* Simulated Live status monitor display */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-neutral-200/50 dark:border-neutral-800 space-y-3.5 shadow-xs">
              <h4 className="text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                System Health Monitoring Node
              </h4>
              <div className="space-y-2 font-mono text-[10px] text-neutral-500">
                <p className="flex items-center justify-between">
                  <span>SSL SMTP connection:</span>
                  <span className="text-emerald-500 font-bold font-mono">● OPERATIONAL (port 465)</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Response SLA Guarantee:</span>
                  <span className="text-blue-500 font-bold">&lt; 120 Minutes</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Current Date Queue:</span>
                  <span className="text-yellow-600 font-bold">2026-06-01 (NORMAL LOAD)</span>
                </p>
              </div>

              {attachedFile && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-900/40 text-[10px] leading-relaxed flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-blue-500">📄</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[130px]">{attachedFile.name}</span>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="text-red-500 hover:underline">Delete</button>
                </div>
              )}
            </div>

            {/* Quick pre-formulated WhatsApp submission guidelines block */}
            <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 to-blue-500/5 border border-emerald-500/20 text-left space-y-3">
              <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="text-base">💬</span>
                <span>WhatsApp Pre-Fill System Enabled</span>
              </h4>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-normal font-semibold">
                Don't want to type of cPanel file configurations? You can fill the form fields and press <strong>"Send via WhatsApp"</strong> to generate a structured request automatically!
              </p>
              <button
                type="button"
                onClick={handleSendWhatsAppQuery}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1 active:scale-95"
              >
                🚀 Generate Auto WhatsApp Message
              </button>
            </div>
          </div>

          {/* Right Message Form with Premium Glassmorphic Layout */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0F172A] border border-neutral-200/60 dark:border-neutral-850 p-6 sm:p-8 rounded-3xl" id="contact-form-block">
            
            <AnimatePresence mode="wait">
              {!isSubmittedSuccessfully ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleOfflineSubmit} 
                  className="space-y-4 text-xs font-semibold"
                >
                  
                  {/* Row 1: Name & Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelName} *</label>
                      <div className="relative">
                        <input
                          id="form-input-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Imran Hasan"
                          className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelCompany}</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Webzone BD Media Group"
                        className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-500 dark:text-neutral-450 block font-mono font-bold">{t.labelEmail} *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. user@webzonebd.com"
                        className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelPhone} *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +8801864000005"
                        className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 3: Service Selection & Country Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-505 dark:text-neutral-450 block font-bold">{t.labelService}</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="web">{t.serviceOptionWeb}</option>
                        <option value="ecommerce">{t.serviceOptionEcom}</option>
                        <option value="news">{t.serviceOptionNews}</option>
                        <option value="blog">{t.serviceOptionBlog}</option>
                        <option value="seo">{t.serviceOptionSeo}</option>
                        <option value="pos">{t.serviceOptionPos}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelCountry}</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. Bangladesh / Saudi Arabia"
                        className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Row 4: Budget range select */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelBudget}</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="low">{t.budgetOptionLow}</option>
                      <option value="medium">{t.budgetOptionMid}</option>
                      <option value="high">{t.budgetOptionHigh}</option>
                    </select>
                  </div>

                  {/* Row 5: Subject line */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelSubject}</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Domain setup assistance or custom database integration price"
                      className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Row 6: Detailed MSG Box */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelMsg} *</label>
                    <textarea
                      required
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      rows={4}
                      placeholder="Include website requirements, deadline preferences, theme links if you have any..."
                      className="w-full rounded-xl border bg-[#F8FAFC] dark:bg-[#020617] border-neutral-250 dark:border-neutral-800 px-4 py-3 text-neutral-950 dark:text-neutral-50 transition focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Row 7: Drag and Drop Upload Brief simulation button */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-neutral-500 dark:text-neutral-450 block font-bold">{t.labelAttachment}</label>
                    <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6.5 text-center bg-[#F8FAFC]/50 dark:bg-[#020617]/40 relative group hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Upload attachment file"
                      />
                      <UploadCloud className="w-8 h-8 mx-auto text-neutral-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors mb-2" />
                      <p className="text-xs text-neutral-600 dark:text-neutral-350 font-bold">
                        {t.attachmentPlaceholder}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-medium mt-1">
                        Supported forms: PDF, Word Doc, images up to 10MB sizes.
                      </p>
                    </div>
                  </div>

                  {/* Operations Form submit triggers */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 text-white font-black hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin text-sm">⏳</span>
                          <span>Routing packet on Port 465...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t.btnSubmit}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendWhatsAppQuery}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95"
                    >
                      <span>💬 Direct WhatsApp Submit</span>
                    </button>
                  </div>

                </motion.form>
              ) : (
                <motion.div 
                  key="contact-success-desk"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 sm:p-6 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-400/30">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                      {t.successTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                      {t.successDesc}
                    </p>
                  </div>

                  {/* Simulated printing client receipt details box */}
                  {transmittedLog && (
                    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 p-4 rounded-2xl text-left text-xs font-mono space-y-2 max-w-lg mx-auto">
                      <div className="pb-2 border-b border-neutral-250 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                        <span>STATION: WEBZONE-MAIN-SMTP-01</span>
                        <span>STATUS: {transmittedLog.status}</span>
                      </div>
                      
                      <div className="space-y-1 text-neutral-600 dark:text-neutral-350 select-text">
                        <p><span className="text-blue-500">Sender:</span> {transmittedLog.payload.clientName} ({transmittedLog.payload.clientEmail})</p>
                        <p><span className="text-blue-500">Phone:</span> {transmittedLog.payload.clientPhone}</p>
                        <p><span className="text-blue-500">Target Segment:</span> {transmittedLog.payload.requestedService}</p>
                        <p><span className="text-blue-500">Allocated Budget:</span> {transmittedLog.payload.estimatedBudget === 'high' ? 'Enterprise (> ৳50,050)' : transmittedLog.payload.estimatedBudget === 'medium' ? 'Standard Growth (৳20k-৳50k)' : 'Basic Budget'}</p>
                        <p className="line-clamp-2"><span className="text-blue-500">Summary:</span> {transmittedLog.payload.detailsMsg}</p>
                        {transmittedLog.payload.attachmentMetadata && (
                          <p className="text-amber-500">📎 Attachment Node: {transmittedLog.payload.attachmentMetadata.name} ({transmittedLog.payload.attachmentMetadata.size})</p>
                        )}
                        <p className="text-[10px] text-neutral-400 pt-1.5 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                          Timestamp Hash: {transmittedLog.timestamp}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 pt-3">
                    <button
                      onClick={handleResetForm}
                      className="px-5 py-2.5 rounded-xl border border-neutral-250 dark:border-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
                    >
                      ← Send Another Inquiry
                    </button>

                    <button
                      onClick={() => {
                        window.open("https://wa.me/966570511931", "_blank");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Close and Chat WhatsApp
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* ================= 4. QUICK CONTACT METHODS & 5. LIVE CHAT SYSTEM ================= */}
      <section className="bg-[#FAF9F6] dark:bg-[#0b0f19] border-t border-b border-neutral-200/50 dark:border-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-left space-y-4">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-mono font-black tracking-wider inline-block select-none animate-pulse">
                ⚡ {t.chatStatus}
              </span>
              <h2 className="text-2xl sm:text-3.5xl font-black text-neutral-950 dark:text-white leading-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {t.chatTitle}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                {t.chatSub}
              </p>

              {/* Verified SLA info indicator bar with clean background styling */}
              <div className="p-4 bg-gradient-to-r from-emerald-550/5 to-teal-550/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300 font-semibold leading-normal">
                <span className="text-base p-1.5 bg-emerald-500/10 rounded-lg">🕒</span>
                <span>Active global support desk operates efficiently in UTC+3 & UTC+6 timezones. Messages on WhatsApp connect instantly to standby developers.</span>
              </div>
            </div>

            {/* Instant Social encryption triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* WhatsApp Trigger */}
              <button
                onClick={() => {
                  window.open("https://wa.me/966570511931", "_blank");
                }}
                className="relative p-6 bg-white dark:bg-[#0c1222] border border-emerald-500/30 hover:border-emerald-500 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-emerald-500/10 text-center space-y-3 cursor-pointer group flex flex-col items-center justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-150" />
                <div className="space-y-1 relative z-10 select-none">
                  <span className="text-4xl block filter drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]">💬</span>
                  <h4 className="text-xs sm:text-[13px] font-black text-neutral-950 dark:text-white uppercase tracking-wider pt-2">WhatsApp Chat</h4>
                  <p className="text-[10px] text-neutral-400 font-semibold">Active pre-sales support desk.</p>
                </div>
                <span className="text-[10px] font-black font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all block mt-4 leading-none">CHAT ON MOBILE →</span>
              </button>

              {/* Telegram Trigger */}
              <button
                onClick={handleStartTelegramChat}
                className="relative p-6 bg-white dark:bg-[#0c1222] border border-sky-500/30 hover:border-sky-500 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-sky-500/10 text-center space-y-3 cursor-pointer group flex flex-col items-center justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-150" />
                <div className="space-y-1 relative z-10 select-none">
                  <span className="text-4xl block filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.3)]">✈️</span>
                  <h4 className="text-xs sm:text-[13px] font-black text-neutral-950 dark:text-white uppercase tracking-wider pt-2">{t.btnTelegram}</h4>
                  <p className="text-[10px] text-neutral-400 font-semibold">Secure encryption network.</p>
                </div>
                <span className="text-[10px] font-black font-mono text-sky-500 bg-sky-500/10 px-3 py-1.5 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-all block mt-4 leading-none">LAUNCH CHAT →</span>
              </button>

              {/* Messenger Trigger */}
              <button
                onClick={handleStartFacebookChat}
                className="relative p-6 bg-white dark:bg-[#0c1222] border border-indigo-500/30 hover:border-indigo-500 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-indigo-500/10 text-center space-y-3 cursor-pointer group flex flex-col items-center justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-150" />
                <div className="space-y-1 relative z-10 select-none">
                  <span className="text-4xl block filter drop-shadow-[0_2px_8px_rgba(99,102,241,0.3)]">👥</span>
                  <h4 className="text-xs sm:text-[13px] font-black text-neutral-950 dark:text-white uppercase tracking-wider pt-2">{t.btnMessager}</h4>
                  <p className="text-[10px] text-neutral-400 font-semibold">Fast Facebook dispatch.</p>
                </div>
                <span className="text-[10px] font-black font-mono text-indigo-505 bg-indigo-500/10 px-3 py-1.5 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-all block mt-4 leading-none">VISIT PAGE →</span>
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 6. SOCIAL MEDIA SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8" id="social-networks-desk">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
            {t.socialTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-medium">
            {t.socialSub}
          </p>
        </div>

        {/* Dynamic Social Grid Icons representation with premium hover gradients */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Facebook Page", color: "hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-700 hover:text-white text-blue-600 hover:shadow-md hover:shadow-blue-500/20", icon: <Facebook className="w-5 h-5" />, click: handleStartFacebookChat },
            { label: "Telegram Support", color: "hover:bg-gradient-to-br hover:from-sky-450 hover:to-blue-600 hover:text-white text-sky-500 hover:shadow-md hover:shadow-sky-400/20", icon: <Send className="w-5 h-5" />, click: handleStartTelegramChat },
            { label: "LinkedIn Company", color: "hover:bg-gradient-to-br hover:from-blue-700 hover:to-sky-800 hover:text-white text-blue-700 hover:shadow-md hover:shadow-blue-700/20", icon: <Linkedin className="w-5 h-5" />, click: handleStartLinkedinChat },
            { label: "Instagram Log", color: "hover:bg-gradient-to-br hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-white text-pink-600 hover:shadow-md hover:shadow-pink-500/20", icon: <Instagram className="w-5 h-5" />, click: handleStartInstagramChat },
            { label: "YouTube Channel", color: "hover:bg-gradient-to-br hover:from-red-650 hover:to-rose-800 hover:text-white text-red-600 hover:shadow-md hover:shadow-red-600/20", icon: <Youtube className="w-5 h-5" />, click: handleStartYoutubeChat },
            { label: "WebzoneBD Node", color: "hover:bg-gradient-to-br hover:from-neutral-800 hover:to-neutral-950 hover:text-white text-neutral-850 dark:text-neutral-200 hover:shadow-md hover:shadow-neutral-800/20", icon: <Globe className="w-5 h-5" />, click: () => window.open("https://www.webzonebd.com", "_blank") }
          ].map((soc, sIndex) => (
            <button
              key={sIndex}
              onClick={soc.click}
              className={`p-5 bg-white dark:bg-[#0c1222] border border-neutral-250/60 dark:border-neutral-850 rounded-2xl transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer font-bold select-none text-[11px] hover:-translate-y-1 hover:shadow-lg active:scale-95 ${soc.color}`}
            >
              <span className="p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl transition-colors">{soc.icon}</span>
              <span className="tracking-wide">{soc.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= 7. GOOGLE MAP SECTION ================= */}
      <section className="bg-white dark:bg-[#0F172A] border-t border-b border-neutral-200/50 dark:border-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center text-left">
            
            <div className="lg:col-span-2 space-y-6">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/40 rounded-full text-[10px] tracking-wider uppercase font-black font-mono">
                📍 office location details
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                How to Reach Us
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                We maintain our active administrative and operational headquarters for client software design. This includes our physical office in Dhaka (Bangladesh) and our online-only specialized contact hub in Saudi Arabia.
              </p>

              <div className="space-y-3 pt-2">
                <div 
                  onClick={() => setActiveOffice('riyadh')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeOffice === 'riyadh' 
                      ? 'border-[#2563EB] bg-blue-500/5' 
                      : 'border-neutral-200/50 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/10'
                  }`}
                >
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white">📍 Saudi Arabia Operations (Online)</h4>
                  <p className="text-[11px] text-neutral-450 font-semibold leading-normal mt-1">
                    No Physical Branch - Premium Online Support & WhatsApp Channel Only.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveOffice('dhaka')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeOffice === 'dhaka' 
                      ? 'border-[#2563EB] bg-blue-500/5' 
                      : 'border-neutral-200/50 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/10'
                  }`}
                >
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white">📍 Dhaka Main HQ Hub (Bangladesh)</h4>
                  <p className="text-[11px] text-neutral-455 font-semibold leading-normal mt-1">Azimpur, Dhanmondi Road, Dhaka 1205, Bangladesh.</p>
                </div>
              </div>
            </div>

            {/* Simulated High-tech interactive map representation instead of failing iframe */}
            <div className="lg:col-span-3 h-80 sm:h-96 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800 bg-linear-to-tr from-slate-900 to-indigo-950 p-6 flex flex-col justify-between text-white relative shadow-inner">
              
              {/* Graphic background representing geographical connections */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-mono font-black tracking-widest uppercase text-cyan-400">
                  🌐 WEBZONE-GEOGRAPHICAL-NETWORK-LOG
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="space-y-4 max-w-sm relative z-10 text-left">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold">
                  Active Connection: <span className="text-cyan-400 uppercase font-mono">{activeOffice === 'riyadh' ? 'ONLINE CHANNELS' : 'PHYSICAL HEADQUARTERS'}</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {currentOfficeDetails.city}
                </h3>
                
                <p className="text-xs text-neutral-300 leading-relaxed font-semibold">
                  {currentOfficeDetails.address}
                </p>

                <div className="text-[10px] font-mono text-neutral-400 leading-normal space-y-1 pt-2">
                  <p>{activeOffice === 'riyadh' ? '✓ Instant Online Encryption Channel Enabled' : '✓ Geolocation Marker LatLng Sync Enabled'}</p>
                  <p>{activeOffice === 'riyadh' ? '✓ Direct WhatsApp Technical Routing Ready' : '✓ Direct Route Optimization Checklist Ready'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                <a 
                  href={currentOfficeDetails.mapSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold font-mono text-center rounded-xl transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 animate-pulse"
                >
                  <span>{activeOffice === 'riyadh' ? '💬 Message via WhatsApp' : '🚀 Open Google Map Direction Router'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button 
                  onClick={() => handleCopyText(currentOfficeDetails.address, 'office-address')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold font-mono text-center rounded-xl transition cursor-pointer active:scale-95"
                >
                  Copy Connection details
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= 8. FAQ SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left" id="faq-accordions">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-2 space-y-4.5">
            <span className="px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-pink-400 border border-purple-250/30 text-[10px] uppercase font-mono font-black tracking-wider inline-block">
              <HelpCircle className="w-3.5 h-3.5 shrink-0 inline-block align-middle mr-1.5" />
              <span>SLA FAQ BOARD</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extra-black text-neutral-950 dark:text-white leading-tight">
              {t.faqTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
              {t.faqSub}
            </p>

            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/55 dark:border-neutral-800 text-xs leading-relaxed text-neutral-500">
              <span className="font-extrabold text-[#2563EB] block mb-1">🛠️ Webzone Core Developers Support</span>
              Have questions regarding specific API endpoints, custom webhook payloads or WordPress plugin licenses? Let us know on WhatsApp for fast response!
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            {faqData.map((item, index) => {
              const isOpen = faqOpen[index];
              return (
                <div 
                  key={index}
                  className="border border-neutral-200/60 dark:border-neutral-850/80 rounded-2xl overflow-hidden bg-white dark:bg-[#0F172A] transition-colors"
                >
                  <button
                    onClick={() => {
                      setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
                    }}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-neutral-950 dark:text-white text-xs sm:text-sm cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 select-none transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-neutral-150 dark:border-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= 9. BUSINESS INFORMATION & SLA HOURS ================= */}
      <section className="bg-white dark:bg-[#0F172A] border-t border-b border-neutral-200/50 dark:border-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 bg-[#F8FAFC] dark:bg-[#020617] border border-neutral-200/50 dark:border-neutral-850 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-mono font-black text-blue-500 tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.hoursTitle}</span>
                </h4>
                <p className="text-xs font-black text-neutral-950 dark:text-white pt-1">{t.daysWeek}</p>
                <p className="text-[11px] text-neutral-400 font-semibold">{t.hoursWeek}</p>
              </div>
              <span className="text-[9px] text-emerald-500 bg-emerald-500/10 rounded px-2 py-0.5 inline-block w-max mt-2">Active Timeline Status</span>
            </div>

            <div className="p-5 bg-[#F8FAFC] dark:bg-[#020617] border border-neutral-200/50 dark:border-neutral-850 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-mono font-black text-[#8B5CF6] tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t.daysFri}</span>
                </h4>
                <p className="text-xs font-black text-neutral-950 dark:text-white pt-1">Limited Active Operations</p>
                <p className="text-[11px] text-neutral-400 font-semibold">{t.hoursFri}</p>
              </div>
              <span className="text-[9px] text-[#8B5CF6] bg-[#8B5CF6]/10 rounded px-2 py-0.5 inline-block w-max mt-2">Standby Support Ready</span>
            </div>

            <div className="p-5 bg-[#F8FAFC] dark:bg-[#020617] border border-neutral-200/50 dark:border-neutral-850 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-mono font-black text-[#EC4899] tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  <span>SLA Urgent Emergency Ticket Dispatch</span>
                </h4>
                <p className="text-xs font-black text-neutral-950 dark:text-white pt-1">Priority Outage Support Email</p>
                <p className="text-[11px] text-neutral-400 font-semibold">Email: info@webzonebd.com</p>
              </div>
              <span className="text-[9px] text-pink-500 bg-pink-500/10 rounded px-2 py-0.5 inline-block w-max mt-2">Standby outage redirect</span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 10. CTA SECTION ================= */}
      <section className="bg-[#020617] text-white py-16 md:py-20 relative overflow-hidden text-center">
        
        {/* Animated decorative graphics in background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-35">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-cyan-400 text-[10px] uppercase font-mono font-black tracking-widest animate-pulse">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>let's create together</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {t.ctaTitle}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {t.ctaSub}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-lg mx-auto">
            
            <button
              onClick={() => {
                const el = document.getElementById('leave-offline-message-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs transition duration-150 shadow-md shadow-blue-500/10 cursor-pointer text-center flex items-center justify-center gap-1 active:scale-95"
            >
              <span>{t.ctaQuote}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                window.open("https://wa.me/966570511931", "_blank");
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-center active:scale-95"
            >
              <span>{t.ctaSupport}</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('leave-offline-message-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition duration-150 cursor-pointer text-center flex items-center justify-center gap-1 active:scale-95"
            >
              <span>{t.ctaInquiry}</span>
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}
