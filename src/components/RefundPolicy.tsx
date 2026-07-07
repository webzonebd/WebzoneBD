import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, Globe, Phone, FileText, CheckCircle2, ChevronRight, HelpCircle, ArrowRight, MessageSquare, AlertTriangle, Sparkles } from 'lucide-react';
import { Language, Theme } from '../types';

interface RefundPolicyProps {
  language: Language;
  theme: Theme;
  setCurrentPage: (page: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function RefundPolicy({ language, theme, setCurrentPage, triggerToast }: RefundPolicyProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Set SEO Meta Title and Description dynamically
    document.title = language === 'bn' 
      ? 'রিফান্ড নীতি এবং শর্ত | WebzoneBD IT Solution' 
      : 'Refund Policy | WebzoneBD IT Solution';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = language === 'bn'
      ? 'WebzoneBD IT Solution এর ডিজিটাল পণ্য, স্ক্রিপ্ট, হোস্টিং এবং সেবাগুলোর রিফান্ড নীতি সম্পর্কীত বিস্তারিত বিবরণী।'
      : 'Read the official Refund Policy of WebzoneBD IT Solution regarding digital products, services, support, and refund eligibility.';
    
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }
  }, [language]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    if (triggerToast) {
      triggerToast(language === 'bn' ? `${label} ক্লিপবোর্ডে কপি করা হয়েছে!` : `${label} copied to clipboard!`);
    }
    setTimeout(() => setCopiedField(null), 3000);
  };

  const trans = {
    en: {
      badge: "🛡️ Contract Terms",
      title: "Refund Policy",
      subtitle: "Transparent policies designed to ensure a secure and trustworthy experience for our customers.",
      
      sec1Title: "📌 Digital Products & Services",
      sec1Desc: "Since all products and services offered by WebzoneBD IT Solution are of a digital nature, generally no refunds are provided. Once an order is completed and delivery is initiated, it shall be deemed final and irreversible.",
      
      sec2Title: "⚠️ Exceptions",
      sec2Subtitle: "Refunds may be evaluated under the following exclusive circumstances:",
      sec2Cond1: "If the premium product or digital service fails to perform its core functions entirely",
      sec2Cond2: "If our support engineers are unable to resolve the critical bug after diagnostic reviews",
      sec2Cond3: "If an explicit written request for a refund is lodged within 24 hours of placing the order",
      sec2Footer: "Upon fulfillment of the conditions listed above, our compliance team will audit the inquiry to reach a final refund determination.",
      
      sec3Title: "💬 Support Channels",
      sec3Subtitle: "For inquiries, claims, or technical assistance, feel free to contact us through any of our support lines:",
      
      ctaTitle: "Need Help?",
      ctaDesc: "Our customer success support team is ready to assist you 24/7 with any product or service-related issues.",
      ctaBtn: "Contact Support Hub",
      
      copied: "Copied!",
      whatsapp: "WhatsApp (Saudi Arabia)",
      bangladesh: "Bangladesh Line",
      website: "Official Website",
      email: "E-Mail Address",
    },
    bn: {
      badge: "🛡️ চুক্তির শর্তাবলী",
      title: "রিফান্ড নীতি",
      subtitle: "আমাদের গ্রাহকদের একটি নিরাপদ ও নির্ভরযোগ্য অভিজ্ঞতা নিশ্চিত করার লক্ষ্যে স্বচ্ছ এবং সহজ রিফান্ড নীতিমালা।",
      
      sec1Title: "📌 ডিজিটাল পণ্য ও সেবা",
      sec1Desc: "যেহেতু WebzoneBD IT Solution-এর সকল পণ্য ও সেবা ডিজিটাল প্রকৃতির, তাই সাধারণত কোনো রিফান্ড প্রদান করা হয় না। একবার অর্ডার সম্পন্ন ও ডেলিভারি প্রদান করা হলে তা চূড়ান্ত বলে গণ্য হবে।",
      
      sec2Title: "⚠️ ব্যতিক্রম",
      sec2Subtitle: "নিম্নলিখিত ক্ষেত্রে রিফান্ড বিবেচনা করা হতে পারে:",
      sec2Cond1: "প্রোডাক্ট বা সেবা সম্পূর্ণভাবে কাজ না করলে",
      sec2Cond2: "আমাদের সাপোর্ট টিম সমস্যাটি সমাধান করতে ব্যর্থ হলে",
      sec2Cond3: "অর্ডারের ২৪ ঘণ্টার মধ্যে রিফান্ডের আবেদন করা হলে",
      sec2Footer: "উপরের শর্তগুলো পূরণ হলে বিষয়টি সম্পূর্ণ যাচাই ও পর্যালোচনা করে রিফান্ড অনুমোদন করা হতে পারে।",
      
      sec3Title: "💬 সাপোর্ট সেন্টার",
      sec3Subtitle: "যেকোনো সমস্যা, অভিযোগ বা সহায়তার জন্য সরাসরি আমাদের সাথে নিম্নের অফিসিয়াল চ্যানেলে যোগাযোগ করুন:",
      
      ctaTitle: "সাহায্য প্রয়োজন?",
      ctaDesc: "আমাদের নিবেদিত সাপোর্ট টিম যেকোনো টেকনিক্যাল বা প্রোডাক্টের সমস্যা সমাধান করতে সদা প্রস্তুত রয়েছে।",
      ctaBtn: "সাপোর্ট সেন্টারে যান",
      
      copied: "কপি করা হয়েছে!",
      whatsapp: "হোয়াটসঅ্যাপ (সৌদি আরব)",
      bangladesh: "বাংলাদেশ হেল্পলাইন",
      website: "অফিসিয়াল ওয়েবসাইট",
      email: "ই-মেইল এড্রেস",
    },
    ar: {
      badge: "🛡️ شروط العقد",
      title: "سياسة استرداد الأموال",
      subtitle: "سياسات شفافة مصممة لضمان تجربة آمنة وموثوقة لعملائنا الكرام.",
      sec1Title: "📌 المنتجات والخدمات الرقمية",
      sec1Desc: "نظرًا لأن جميع المنتجات والخدمات التي تقدمها شركة ويب زون بي دي لتقنية المعلومات هي ذات طبيعة رقمية، فلن يتم توفير عمليات استرداد الأموال كقاعدة عامة. بمجرد اكتمال الطلب وبدء التسليم، يعتبر نهائياً وغير قابل للإلغاء.",
      sec2Title: "⚠️ الحالات الاستثنائية",
      sec2Subtitle: "يمكن مراجعة طلبات استرداد الأموال حصرياً في ظل الظروف التالية:",
      sec2Cond1: "إذا فشل المنتج الرقمي أو الخدمة السحابية في أداء وظائفه الأساسية تماماً",
      sec2Cond2: "إذا عجز مهندسو الدعم والخبراء لدينا عن حل المشكلة الفنية بعد الفحص والتدقيق",
      sec2Cond3: "إذا تم تقديم طلب رسمي مكتوب للاسترداد خلال 24 ساعة فقط من وقت الشراء",
      sec2Footer: "عند استيفاء الشروط المذكورة أعلاه، سيقوم فريق الامتثال والجودة لدينا بـتدقيق ومراجعة الطلب للوصول إلى قرار نهائي.",
      sec3Title: "💬 قنوات الدعم المباشر",
      sec3Subtitle: "للاستفسارات والطلبات والمساعدة التقنية، يسعدنا تواصلكم معنا عبر الخطوط الرسمية التالية:",
      ctaTitle: "هل تحتاج مساعدة؟",
      ctaDesc: "فريق خدمات العملاء لدينا مستعد لمساعدتكم وتقديم الحلول على مدار الساعة 24/7 لأي مشكلة.",
      ctaBtn: "الاتصال بمركز الدعم",
      copied: "تم النسخ!",
      whatsapp: "الواتساب (المملكة العربية السعودية)",
      bangladesh: "هاتف بنجلاديش الأساسي",
      website: "الموقع الإلكتروني الرسمي",
      email: "عنوان البريد الإلكتروني",
    }
  }[language] || {
    badge: "🛡️ Contract Terms",
    title: "Refund Policy",
    subtitle: "Transparent policies designed to ensure a secure and trustworthy experience for our customers.",
    sec1Title: "📌 Digital Products & Services",
    sec1Desc: "Since all products and services offered by WebzoneBD IT Solution are of a digital nature, generally no refunds are provided. Once an order is completed and delivery is initiated, it shall be deemed final and irreversible.",
    sec2Title: "⚠️ Exceptions",
    sec2Subtitle: "Refunds may be evaluated under the following exclusive circumstances:",
    sec2Cond1: "If the premium product or digital service fails to perform its core functions entirely",
    sec2Cond2: "If our support engineers are unable to resolve the critical bug after diagnostic reviews",
    sec2Cond3: "If an explicit written request for a refund is lodged within 24 hours of placing the order",
    sec2Footer: "Upon fulfillment of the conditions listed above, our compliance team will audit the inquiry to reach a final refund determination.",
    sec3Title: "💬 Support Channels",
    sec3Subtitle: "For inquiries, claims, or technical assistance, feel free to contact us through any of our support lines:",
    ctaTitle: "Need Help?",
    ctaDesc: "Our customer success support team is ready to assist you 24/7 with any product or service-related issues.",
    ctaBtn: "Contact Support Hub",
    copied: "Copied!",
    whatsapp: "WhatsApp (Saudi Arabia)",
    bangladesh: "Bangladesh Line",
    website: "Official Website",
    email: "E-Mail Address",
  };

  return (
    <div 
      className="relative min-h-screen bg-[#050816] text-white flex flex-col overflow-hidden py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-pink-500 selection:text-white"
      id="refund-policy-page"
    >
      {/* Dynamic Animated Atmospheric Glow Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#7C3AED]/10 blur-[130px] pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute top-[30%] left-[40%] w-[40%] h-[45%] rounded-full bg-[#06B6D4]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#EC4899]/5 blur-[120px] pointer-events-none animate-pulse duration-[7000ms]" />

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[15%] left-[25%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping duration-[3000ms]" />
        <div className="absolute top-[40%] left-[85%] w-2 h-2 bg-pink-400 rounded-full animate-ping duration-[4000ms]" />
        <div className="absolute top-[75%] left-[10%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping duration-[5000ms]" />
        <div className="absolute top-[60%] left-[65%] w-2.5 h-2.5 bg-violet-400 rounded-full animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-center">
        
        {/* Animated Hero Section */}
        <div className="text-center mb-16 space-y-6">
          {/* Glassmorphism Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(255,255,255,0.02)]"
          >
            <ShieldCheck className="w-4 h-4 text-[#06B6D4] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase font-mono text-slate-300">
              {trans.badge}
            </span>
          </motion.div>

          {/* Main Heading with Animated Gradient Text */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-[#7C3AED] via-[#EC4899] to-[#06B6D4] bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientFlow_6s_linear_infinite]">
              {trans.title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {trans.subtitle}
          </motion.p>
        </div>

        {/* Policy Content Card with Integrated Glassmorphism & Mouse Hover Glow Glow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          onMouseMove={handleMouseMove}
          className="relative group bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden hover:border-white/15 transition-all duration-500"
          style={{ id: 'refund-policy-container-glass' }}
        >
          {/* Radial Glowing effect following pointer on hover */}
          <div 
            className="absolute -inset-px opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none rounded-[24px]"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
            }}
          />

          {/* Neon running glow indicators on borders */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          {/* Sections Stack */}
          <div className="space-y-12 divide-y divide-white/5">
            
            {/* Section 1 */}
            <div className="space-y-4 pt-1 text-left">
              <div className="flex items-center gap-2 text-xl font-bold text-blue-400">
                <FileText className="w-5 h-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  {trans.sec1Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-white/2 rounded-2xl p-4 sm:p-5 border border-white/5 hover:bg-white/4 transition duration-300">
                {trans.sec1Desc}
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 pt-8 text-left">
              <div className="flex items-center gap-2 text-xl font-bold text-[#EC4899]">
                <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  {trans.sec2Title}
                </h2>
              </div>
              
              <div className="space-y-3 bg-white/2 border border-white/5 p-4 sm:p-6 rounded-2xl">
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {trans.sec2Subtitle}
                </p>

                <ul className="space-y-3 pt-2">
                  {[trans.sec2Cond1, trans.sec2Cond2, trans.sec2Cond3].map((cond, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{cond}</span>
                    </motion.li>
                  ))}
                </ul>

                <p className="text-[11px] sm:text-xs text-rose-300/80 italic pt-4 mt-2 border-t border-white/5">
                  ✓ {trans.sec2Footer}
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 pt-8 text-left">
              <div className="flex items-center gap-2 text-xl font-bold text-[#06B6D4]">
                <MessageSquare className="w-5 h-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  {trans.sec3Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {trans.sec3Subtitle}
              </p>

              {/* Grid interactive copyable blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                
                {/* Email Support Card */}
                <div 
                  onClick={() => handleCopy("info@webzonebd.com", trans.email)}
                  className="group/item flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-900 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-slate-500">EMAIL SUPPORT</p>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover/item:text-blue-400 transition-colors">info@webzonebd.com</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md group-hover/item:text-white group-hover/item:bg-blue-600/20 transition-all duration-300">
                    {copiedField === trans.email ? trans.copied : "COPY"}
                  </span>
                </div>

                {/* Website Card */}
                <div 
                  onClick={() => handleCopy("www.webzonebd.com", trans.website)}
                  className="group/item flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-900 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-slate-500">WEBSITE HUB</p>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover/item:text-cyan-400 transition-colors">www.webzonebd.com</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md group-hover/item:text-white group-hover/item:bg-cyan-600/20 transition-all duration-300">
                    {copiedField === trans.website ? trans.copied : "COPY"}
                  </span>
                </div>

                {/* WhatsApp Saudi Card */}
                <div 
                  onClick={() => handleCopy("+966570511931", trans.whatsapp)}
                  className="group/item flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-900 hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-slate-500">{trans.whatsapp.toUpperCase()}</p>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover/item:text-emerald-400 transition-colors">+966 570511931</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md group-hover/item:text-white group-hover/item:bg-emerald-600/20 transition-all duration-300">
                    {copiedField === trans.whatsapp ? trans.copied : "COPY"}
                  </span>
                </div>

                {/* Bangladesh Line */}
                <div 
                  onClick={() => handleCopy("+8801864000005", "Bangladesh Line")}
                  className="group/item flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-900 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-slate-500">{trans.bangladesh.toUpperCase()}</p>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover/item:text-purple-400 transition-colors">+880 1864-000005</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md group-hover/item:text-white group-hover/item:bg-purple-600/20 transition-all duration-300">
                    {copiedField === "Bangladesh Line" ? trans.copied : "COPY"}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

        {/* Contact Support CTA Container with Dynamic Floating Background & glowing buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 text-center bg-gradient-to-br from-indigo-950/50 via-slate-900/50 to-blue-950/30 border border-white/10 p-8 sm:p-12 rounded-[24px] backdrop-blur-xl relative overflow-hidden"
          id="refund-support-cta-container"
        >
          {/* Neon Highlight Particle */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#EC4899]/15 blur-2xl rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-500/15 blur-2xl rounded-full" />

          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {trans.ctaTitle}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              {trans.ctaDesc}
            </p>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo(0, 0);
                }}
                className="relative py-3.5 px-8 text-xs font-black tracking-widest uppercase text-white rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[100%_center] transition-all duration-500 shadow-[0_10px_35px_rgba(37,99,235,0.25)] flex items-center gap-2 mx-auto cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                <span>{trans.ctaBtn}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Back navigation hub button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo(0, 0);
            }}
            className="text-xs text-slate-500 hover:text-white transition duration-300 inline-flex items-center gap-1 cursor-pointer font-bold"
          >
            ← {language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Back to Home Page'}
          </button>
        </div>

      </div>
    </div>
  );
}
