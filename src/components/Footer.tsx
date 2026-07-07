import React, { useState } from 'react';
import { Globe, Mail, Phone, MapPin, Send, ExternalLink, ShieldCheck, Newspaper, Briefcase, Store, Server, Users, Lock, FileText, RefreshCcw, Terminal } from 'lucide-react';
import { Language, Theme, UserSession } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FooterProps {
  language: Language;
  theme: Theme;
  setCurrentPage: (page: string) => void;
  triggerToast: (msg: string) => void;
  onLoginClick?: (view?: 'login' | 'register', role?: 'customer' | 'affiliate') => void;
  user?: UserSession | null;
  setUser?: (user: UserSession | null) => void;
  isAdmin?: boolean;
  setIsAdmin?: (isAdmin: boolean) => void;
}

export default function Footer({ 
  language, 
  theme, 
  setCurrentPage, 
  triggerToast,
  onLoginClick,
  user,
  setUser,
  isAdmin,
  setIsAdmin
}: FooterProps) {
  const [showFooterAdminLogin, setShowFooterAdminLogin] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerPassword, setFooterPassword] = useState('');

  const paymentGateways = [
    {
      name: 'bKash',
      logo: (
        <div className="flex items-center gap-1.5 font-sans font-black">
          <span className="w-5 h-5 rounded-full bg-[#E2125B] flex items-center justify-center text-white text-[10px] shadow-sm shadow-[#E2125B]/30 animate-pulse font-bold">৳</span>
          <span className="text-[#E2125B] tracking-tight text-xs">bKash</span>
        </div>
      ),
      badge: language === 'bn' ? 'বিকাশ পেমেন্ট' : language === 'ar' ? 'بوابة بكاش' : 'bKash Instant'
    },
    {
      name: 'Nagad',
      logo: (
        <div className="flex items-center gap-1.5 font-sans font-black">
          <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#EA4335] to-[#FBBC05] flex items-center justify-center text-white text-[9px] shadow-sm font-bold">৳</span>
          <span className="bg-gradient-to-r from-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent tracking-tight text-xs">nagad</span>
        </div>
      ),
      badge: language === 'bn' ? 'নগদ পেমেন্ট' : language === 'ar' ? 'بوابة نقد' : 'Nagad Instant'
    },
    {
      name: 'Roket',
      logo: (
        <div className="flex items-center gap-1.5 font-sans font-black">
          <span className="w-5 h-5 rounded-full bg-[#8C3B91] flex items-center justify-center text-white text-[10px] shadow-sm shadow-[#8C3B91]/30 font-bold">৳</span>
          <span className="text-[#8C3B91] tracking-tight text-xs">Rocket</span>
        </div>
      ),
      badge: language === 'bn' ? 'রকেট ওয়ালেট' : language === 'ar' ? 'محفظة روكيت' : 'Rocket DBBL'
    },
    {
      name: 'Bangla QR',
      logo: (
        <div className="flex items-center gap-1.5 font-sans font-black">
          <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-neutral-800 dark:bg-neutral-950 rounded border border-emerald-500/30">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-red-400 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-sm"></div>
          </div>
          <span className="text-emerald-400 tracking-tight text-xs">Bangla QR</span>
        </div>
      ),
      badge: language === 'bn' ? 'বাংলা কিউআর' : language === 'ar' ? 'رمز الاستجابة' : 'Unified QR'
    },
    {
      name: 'Cellfin',
      logo: (
        <div className="flex items-center gap-1.5 font-sans font-black">
          <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#0284C7] to-[#0D9488] flex items-center justify-center text-white text-[10px] shadow-sm font-bold">c</span>
          <span className="text-[#0284C7] dark:text-[#38BDF8] tracking-tight text-xs font-black">cellfin</span>
        </div>
      ),
      badge: language === 'bn' ? 'সেলফিন ওয়ালেট' : language === 'ar' ? 'محفظة سيلفين' : 'Cellfin Wallet'
    },
    {
      name: 'IBBL Bank',
      logo: (
        <div className="flex items-center gap-1.5 font-sans font-black">
          <span className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center text-white text-[9px] shadow-sm shadow-emerald-500/20 font-bold">i</span>
          <span className="text-[#059669] dark:text-[#34D399] tracking-tight text-xs">IBBL</span>
        </div>
      ),
      badge: language === 'bn' ? 'ইসলামী ব্যাংক' : language === 'ar' ? 'بنك إسلامي' : 'IBBL NetBanking'
    }
  ];
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value;
    if (email) {
      triggerToast(language === 'bn' ? "ওয়েবজোনবিডি নিউজলেটারে সাবস্ক্রাইব করার জন্য ধন্যবাদ!" : language === 'ar' ? "شكراً لكونك جزءاً من مجتمعنا الإخباري الرقمي!" : "Thank you for joining WebzoneBD newsletters!");
      e.currentTarget.reset();
    }
  };

  const t = {
    en: {
      aboutTitle: "WebzoneBD IT Agency",
      aboutDesc: "Starting a new business or growing an existing one? WebzoneBD IT Agency provides complete IT and digital services including website development, eCommerce, software solutions, branding, SEO, digital marketing, hosting, and technical support to help your business grow faster and smarter.",
      quickTitle: "Quick Navigation",
      legalTitle: "Contract Terms",
      newsTitle: "Digital Weekly Newsletter",
      newsDesc: "Get coupon alerts and PHP scripts updates.",
      placeholder: "Your Email Address",
      subscribe: "Subscribe",
      rights: "© 2026 WebzoneBD IT Agency. All Rights Reserved. Trusted on Cloud Run."
    },
    bn: {
      aboutTitle: "ওয়েবজোনবিডি আইটি এজেন্সি",
      aboutDesc: "নতুন ব্যবসা শুরু করছেন বা চলমান ব্যবসা বাড়াতে চান? ওয়েবজোনবিডি আইটি এজেন্সি দিচ্ছে ওয়েবসাইট ডেভেলপমেন্ট, ই-কমার্স, সফটওয়্যার সলিউশন, ব্র্যান্ডিং, এসইও, ডিজিটাল মার্কেটিং, হোস্টিং এবং টেকনিক্যাল সাপোর্ট সহ সম্পূর্ণ আইটি ও ডিজিটাল সেবা, যা আপনার ব্যবসাকে দ্রুত এবং স্মার্টভাবে এগিয়ে নিতে সাহায্য করবে।",
      quickTitle: "সহজ লিংকসমূহ",
      legalTitle: "শর্তাবলী ও পলিসি",
      newsTitle: "উপযোগী নিউজলেটার",
      newsDesc: "নতুন স্ক্রিপ্ট এর রিলিজ এবং কুপন অফারগুলো ইমেইল এর মাধ্যমে ফ্রিতে পান।",
      placeholder: "আপনার ইমেইল অ্যাড্রেস লিখুন",
      subscribe: "সাবস্ক্রাইব",
      rights: "© ২০২৬ ওয়েবজোনবিডি আইটি এজেন্সি। সর্বস্বত্ব সংরক্ষিত।"
    },
    ar: {
      aboutTitle: "وكالة ويب زون بي دي لتقنية المعلومات",
      aboutDesc: "هل تبدأ مشروعاً جديداً أم تطور مشروعاً قائماً؟ تقدم وكالة ويب زون بي دي لتقنية المعلومات خدمات رقمية وتكنولوجية متكاملة تشمل تطوير المواقع، التجارة الإلكترونية، البرمجيات، الهوية البصرية، السيو، التسويق الرقمي، الاستضافة والدعم الفني لمساعدتك على النمو بشكل أسرع وأذكى.",
      quickTitle: "روابط التنقل السريعة",
      legalTitle: "الخصوصية والترخيص",
      newsTitle: "النشرة البريدية الرقمية",
      newsDesc: "احصل على بوابات الخصم والتحديثات البرمجية الفورية.",
      placeholder: "البريد الإلكتروني الكريم...",
      subscribe: "اشتراك مجاني",
      rights: "© 2026 WebzoneBD IT Agency. All Rights Reserved. Trusted on Cloud Run."
    }
  }[language];

  return (
    <footer className="bg-neutral-900 text-neutral-400 py-6 sm:py-12 border-t border-neutral-800" id="agency-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Globe className="h-6 w-6 text-blue-500 stroke-[2.5]" />
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                WebzoneBD IT Agency
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-400">
              {t.aboutDesc}
            </p>
          </div>

          {/* Nav links */}
          <div className="space-y-4">
            <h4 className="text-white text-xs sm:text-sm font-extrabold uppercase font-mono tracking-wider">
              {t.quickTitle}
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm font-semibold">
              {[
                { 
                  label: language === 'bn' ? "ব্লগ ও খবর" : language === 'ar' ? "المدونات والأخبار" : "Blog", 
                  icon: <Newspaper className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('blog'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "সার্ভিসেস" : language === 'ar' ? "الخدمات" : "Services", 
                  icon: <Briefcase className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('services'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "ডিজিটাল স্টোর" : language === 'ar' ? "المتجر الرقمي" : "Digital Store", 
                  icon: <Store className="w-4 h-4 text-pink-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('marketplace'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "হাই-স্পিড হোস্টিং" : language === 'ar' ? "الاستضافة السريعة" : "Hosting Services", 
                  icon: <Server className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('hosting'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "ডোমেন রেজিস্ট্রেশন" : language === 'ar' ? "تسجيل النطاقات" : "Domain Registration", 
                  icon: <Globe className="w-4 h-4 text-blue-500 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('domain'); window.scrollTo(0, 0); } 
                },
                { 
                  label: language === 'bn' ? "অ্যাফিলিয়েট প্রোগ্রাম" : language === 'ar' ? "برنامج الشركاء" : "Affiliate Program", 
                  icon: <Users className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition duration-300" />,
                  onClick: () => { setCurrentPage('affiliate'); window.scrollTo(0, 0); } 
                }
              ].map((lnk, i) => (
                <li key={i}>
                  <button
                    onClick={lnk.onClick}
                    className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                  >
                    {lnk.icon}
                    <span>{lnk.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-white text-xs sm:text-sm font-extrabold uppercase font-mono tracking-wider">
              {t.legalTitle}
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm font-semibold">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                >
                  <Mail className="w-4 h-4 text-violet-400 shrink-0 group-hover:scale-110 transition duration-300" />
                  <span>{language === 'bn' ? "যোগাযোগ করুন" : language === 'ar' ? "اتصل بنا" : "Contact"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('privacy');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                >
                  <Lock className="w-4 h-4 text-teal-400 shrink-0 group-hover:scale-110 transition duration-300" />
                  <span>{language === 'bn' ? "প্রাইভেসি পলিসি লাইসেন্স" : language === 'ar' ? "سياسة الخصوصية" : "Privacy Policy"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('privacy');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-cyan-400 transition flex items-center gap-2.5 cursor-pointer text-left text-neutral-300"
                >
                  <FileText className="w-4 h-4 text-stone-400 shrink-0 group-hover:scale-110 transition duration-300" />
                  <span>{language === 'bn' ? "ডকুমেন্টেশন ও সেবা সুরক্ষাবলয়" : language === 'ar' ? "ترخيص الاستعمال والخدمات" : "Terms & Conditions"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('refund');
                    window.scrollTo(0, 0);
                  }}
                  className="group hover:text-pink-400 text-slate-300 transition flex items-center gap-2.5 cursor-pointer text-left font-semibold"
                >
                  <RefreshCcw className="w-4 h-4 text-rose-450 shrink-0 group-hover:rotate-45 transition duration-300" />
                  <span>{language === 'bn' ? "রিফান্ড পলিসি" : language === 'ar' ? "سياسة الاسترجاع" : "Refund Policy"}</span>
                </button>
              </li>
              <li className="pt-2" id="admin-portal-handshake">
                <button
                  type="button"
                  onClick={() => setShowFooterAdminLogin(!showFooterAdminLogin)}
                  className={`text-[10.5px] font-mono flex items-center gap-1.5 cursor-pointer transition select-none outline-none text-left p-1 rounded-md ${
                    showFooterAdminLogin 
                      ? "text-cyan-400 font-black bg-cyan-950/20 shadow-inner" 
                      : "text-neutral-505 hover:text-neutral-300"
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 text-blue-505 shrink-0 ${showFooterAdminLogin ? "animate-pulse stroke-[2.5]" : ""}`} />
                  <span>{language === 'bn' ? 'ম্যালওয়্যার-স্ক্যানড অ্যাডমিন পোর্টাল' : 'Malware-Scan Verified cPanel ready'}</span>
                </button>

                <AnimatePresence>
                  {showFooterAdminLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-left space-y-3 font-sans w-full max-w-[240px] shadow-2xl"
                    >
                      {isAdmin ? (
                        <div className="space-y-2 text-xs">
                          <p className="text-[10px] text-emerald-400 font-bold block leading-relaxed">
                            ✓ Currently authenticated as Super Admin Root session.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (setUser) setUser(null);
                              if (setIsAdmin) setIsAdmin(false);
                              triggerToast("Super Admin session closed.");
                              setShowFooterAdminLogin(false);
                            }}
                            className="w-full text-center py-1.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-[10px] font-bold rounded-lg transition"
                          >
                            Close Admin Mode
                          </button>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!footerEmail || !footerPassword) {
                              triggerToast("All admin login options required.");
                              return;
                            }
                            const formattedEmail = footerEmail.trim().toLowerCase();
                            if ((formattedEmail === 'admin@webzonebd.com' || formattedEmail === 'webzonebd@yahoo.com') && footerPassword === 'admin123') {
                              const adminUserSession = {
                                id: formattedEmail === 'webzonebd@yahoo.com' ? 'usr-webzonebd-admin' : 'usr-admin',
                                name: formattedEmail === 'webzonebd@yahoo.com' ? 'WebzoneBD Admin Office' : 'Super Admin Manager',
                                username: formattedEmail === 'webzonebd@yahoo.com' ? 'webzonebd' : 'admin_root',
                                email: formattedEmail,
                                phone: formattedEmail === 'webzonebd@yahoo.com' ? '+8801864000123' : '+8801799887766',
                                role: 'admin',
                                isVerified: true,
                                createdAt: '2026-06-10',
                                status: 'active',
                                wishlistedProductIds: []
                              } as any;
                              if (setUser) setUser(adminUserSession);
                              if (setIsAdmin) setIsAdmin(true);
                              triggerToast(language === 'bn' ? "স্বাগতম! আপনি অ্যাডমিন প্যানেলে সফলভাবে প্রবেশ করেছেন।" : "Welcome back, Chief Architect! Authorized WebzoneBD Super Admin session.");
                              setCurrentPage('dashboard');
                              setShowFooterAdminLogin(false);
                            } else {
                              triggerToast("❌ Handshake failed: Incorrect credentials.");
                            }
                          }}
                          className="space-y-2.5 text-neutral-300"
                        >
                          <span className="text-[9.5px] uppercase font-mono tracking-widest font-black text-neutral-400 block pb-1 border-b border-neutral-800">WHMCS cPanel Access</span>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase block">User Interface ID</label>
                            <input
                              type="email"
                              required
                              value={footerEmail}
                              onChange={(e) => setFooterEmail(e.target.value)}
                              placeholder="webzonebd@yahoo.com"
                              className="w-full bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-[11px] text-white rounded focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase block">Secret PIN Key</label>
                            <input
                              type="password"
                              required
                              value={footerPassword}
                              onChange={(e) => setFooterPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-[11px] text-white rounded focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                          >
                            Login WHMCS
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h4 className="text-white text-xs sm:text-sm font-extrabold uppercase font-mono tracking-wider">
              {t.newsTitle}
            </h4>
            <p className="text-xs text-neutral-400">
              {t.newsDesc}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                name="email"
                placeholder={t.placeholder}
                className="flex-1 h-8 sm:h-10 rounded-lg border bg-neutral-800 border-neutral-700 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 h-8 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold rounded-lg transition shrink-0"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Trusted Payment Gateways Marquee Section */}
        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>
                  {language === 'bn' ? 'বিশ্বস্ত পেমেন্ট গেটওয়ে সমূহ' : language === 'ar' ? 'بوابات دفع موثوقة وآمنة' : 'Trusted Payment Gateways'}
                </span>
              </h4>
              <p className="text-xs text-neutral-500">
                {language === 'bn' ? 'নিরাপদ ও স্বয়ংক্রিয় ইনস্ট্যান্ট ডেলিভারি সুরক্ষিত চ্যানেল' : language === 'ar' ? 'دفع وتفعيل تلقائي آمن وفوري ومؤمن تماماً' : 'Secure, end-to-end encrypted instant billing network'}
              </p>
            </div>
          </div>

          {/* Marquee Outer Container with horizontal overflow hidden */}
          <div className="relative w-full overflow-hidden py-3 select-none">
            {/* Smooth Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

            <motion.div 
              className="flex gap-4 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity,
              }}
            >
              {/* Quadruple the list for a perfectly seamless infinite loop */}
              {[...paymentGateways, ...paymentGateways, ...paymentGateways, ...paymentGateways].map((gateway, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-neutral-950/45 border border-neutral-800/80 shadow-md backdrop-blur-md min-w-[200px] hover:border-neutral-750 transition-colors duration-300 group"
                >
                  <div className="flex-1 flex items-center justify-start">
                    {gateway.logo}
                  </div>
                  <div className="h-5 w-px bg-neutral-800" />
                  <span className="text-[9px] font-mono tracking-wide text-neutral-500 uppercase group-hover:text-neutral-400 transition-colors duration-300">
                    {gateway.badge}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Lower row - 50% smaller padding on mobile */}
        <div className="mt-6 sm:mt-12 pt-3 sm:pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <p>{t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
