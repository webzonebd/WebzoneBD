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
      aboutTitle: "WebzoneBD IT Solution",
      aboutDesc: "Starting a new business or growing an existing one? WebzoneBD IT Solution provides complete IT and digital services including website development, eCommerce, software solutions, branding, SEO, digital marketing, hosting, and technical support to help your business grow faster and smarter.",
      quickTitle: "Quick Navigation",
      legalTitle: "Contract Terms",
      newsTitle: "Digital Weekly Newsletter",
      newsDesc: "Get coupon alerts and PHP scripts updates.",
      placeholder: "Your Email Address",
      subscribe: "Subscribe",
      rights: "© 2026 WebzoneBD IT Solution. All Rights Reserved. Trusted on Cloud Run."
    },
    bn: {
      aboutTitle: "ওয়েবজোনবিডি আইটি সলিউশন",
      aboutDesc: "নতুন ব্যবসা শুরু করছেন বা চলমান ব্যবসা বাড়াতে চান? ওয়েবজোনবিডি আইটি সলিউশন দিচ্ছে ওয়েবসাইট ডেভেলপমেন্ট, ই-কমার্স, সফটওয়্যার সলিউশন, ব্র্যান্ডিং, এসইও, ডিজিটাল মার্কেটিং, হোস্টিং এবং টেকনিক্যাল সাপোর্ট সহ সম্পূর্ণ আইটি ও ডিজিটাল সেবা, যা আপনার ব্যবসাকে দ্রুত এবং স্মার্টভাবে এগিয়ে নিতে সাহায্য করবে।",
      quickTitle: "সহজ লিংকসমূহ",
      legalTitle: "শর্তাবলী ও পলিসি",
      newsTitle: "উপযোগী নিউজলেটার",
      newsDesc: "নতুন স্ক্রিপ্ট এর রিলিজ এবং কুপন অফারগুলো ইমেইল এর মাধ্যমে ফ্রিতে পান।",
      placeholder: "আপনার ইমেইল অ্যাড্রেস লিখুন",
      subscribe: "সাবস্ক্রাইব",
      rights: "© ২০২৬ ওয়েবজোনবিডি আইটি সলিউশন। সর্বস্বত্ব সংরক্ষিত।"
    },
    ar: {
      aboutTitle: "ويب زون بي دي للحلول",
      aboutDesc: "هل تبدأ مشروعاً جديداً أم تطور مشروعاً قائماً؟ تقدم ويب زون بي دي للحلول التقنية خدمات رقمية وتكنولوجية متكاملة تشمل تطوير المواقع، التجارة الإلكترونية، البرمجيات، الهوية البصرية، السيو، التسويق الرقمي، الاستضافة والدعم الفني لمساعدتك على النمو بشكل أسرع وأذكى.",
      quickTitle: "روابط التنقل السريعة",
      legalTitle: "الخصوصية والترخيص",
      newsTitle: "النشرة البريدية الرقمية",
      newsDesc: "احصل على بوابات الخصم والتحديثات البرمجية الفورية.",
      placeholder: "البريد الإلكتروني الكريم...",
      subscribe: "اشتراك مجاني",
      rights: "© 2026 ويب زون بي دي للحلول التقنية. جميع الحقوق محفوظة."
    }
  }[language];

  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800" id="agency-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Globe className="h-6 w-6 text-blue-500 stroke-[2.5]" />
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                WebzoneBD
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
              <li className="pt-2">
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
                  <span>Malware-Scan Verified cPanel ready</span>
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
                            if (footerEmail === 'admin@webzonebd.com' && footerPassword === 'admin123') {
                              const adminUserSession = {
                                id: 'usr-admin',
                                name: 'Super Admin Manager',
                                username: 'admin_root',
                                email: 'admin@webzonebd.com',
                                phone: '+8801799887766',
                                role: 'admin',
                                isVerified: true,
                                createdAt: '2026-06-01',
                                status: 'active',
                                wishlistedProductIds: []
                              } as any;
                              if (setUser) setUser(adminUserSession);
                              if (setIsAdmin) setIsAdmin(true);
                              triggerToast("Welcome back, Chief Architect! Authorized Super Admin session.");
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
                              placeholder="admin@webzonebd.com"
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
                className="flex-1 rounded-lg border bg-neutral-800 border-neutral-700 px-3 py-1.5 text-xs text-white placeholder-neutral-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold rounded-lg transition"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Lower row */}
        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <p>{t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
