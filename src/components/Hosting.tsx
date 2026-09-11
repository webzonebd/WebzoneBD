import React, { useState, useEffect } from 'react';
import { 
  Server, Shield, Cpu, HardDrive, Database, Zap, Sparkles, 
  Check, ArrowRight, Phone, MessageSquare, ExternalLink, HelpCircle, 
  Globe, Terminal, Award, BadgeAlert, Layers, Activity, Lock, Search, 
  Star, RefreshCw, Layers as LayersIcon, CheckCircle, Info, HelpCircle as HelpIcon,
  ChevronDown, PhoneCall, CheckCircle2, DollarSign, Upload, Cloud,
  Mail, Gauge, CircuitBoard, Sliders, ShieldCheck, Code2, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme, Currency, Product } from '../types';
import VpsPerformanceChart from './VpsPerformanceChart';
import DomainSearch from './DomainSearch';
import HostingHero from './HostingHero';
import ServiceCard3D from './ServiceCard3D';

// Helper function to resolve intuitive spec icons & color schemes for plan line items
const getSpecDetail = (feature: string) => {
  const lower = feature.toLowerCase();

  // 1. RAM / Memory
  if (
    lower.includes('ram') ||
    lower.includes('ddr4') ||
    lower.includes('ddr5') ||
    lower.includes('memory') ||
    lower.includes('র্যাম') ||
    lower.includes('ذاكرة') ||
    lower.includes('الرام')
  ) {
    return {
      icon: CircuitBoard,
      category: 'RAM',
      colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20 dark:border-purple-500/30'
    };
  }

  // 2. CPU / Processor / Cores
  if (
    lower.includes('cpu') ||
    lower.includes('vcpu') ||
    lower.includes('core') ||
    lower.includes('epyc') ||
    lower.includes('processor') ||
    lower.includes('কোর') ||
    lower.includes('প্রসেসর') ||
    lower.includes('معالج')
  ) {
    return {
      icon: Cpu,
      category: 'CPU',
      colorClass: 'text-blue-600 dark:text-cyan-400 bg-blue-500/10 border-blue-500/20 dark:border-blue-500/30'
    };
  }

  // 3. Bandwidth / Traffic / BDIX Speed
  if (
    lower.includes('bandwidth') ||
    lower.includes('traffic') ||
    lower.includes('ব্যান্ডউইথ') ||
    lower.includes('ترافيك') ||
    lower.includes('باندويث')
  ) {
    return {
      icon: Gauge,
      category: 'Bandwidth',
      colorClass: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20 dark:border-cyan-500/30'
    };
  }

  // 4. Storage / NVMe / SSD / Disk
  if (
    lower.includes('nvme') ||
    lower.includes('ssd') ||
    lower.includes('storage') ||
    lower.includes('disk') ||
    lower.includes('ডিস্ক') ||
    lower.includes('স্টোরেজ') ||
    lower.includes('এসএসডি') ||
    lower.includes('مساحة') ||
    lower.includes('أقراص')
  ) {
    return {
      icon: HardDrive,
      category: 'Storage',
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30'
    };
  }

  // 5. Email / Mailbox
  if (
    lower.includes('email') ||
    lower.includes('mail') ||
    lower.includes('mailbox') ||
    lower.includes('ইমেইল') ||
    lower.includes('মেইল') ||
    lower.includes('بريد')
  ) {
    return {
      icon: Mail,
      category: 'Email',
      colorClass: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20 dark:border-sky-500/30'
    };
  }

  // 6. Database / MySQL
  if (
    lower.includes('database') ||
    lower.includes('mysql') ||
    lower.includes('sql') ||
    lower.includes('ডাটাবেস') ||
    lower.includes('قواعد بيانات')
  ) {
    return {
      icon: Database,
      category: 'Database',
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30'
    };
  }

  // 7. Dedicated IP / Root / SSH
  if (
    lower.includes('root') ||
    lower.includes('ssh') ||
    lower.includes('ipv4') ||
    lower.includes('dedicated ip') ||
    lower.includes('ip') ||
    lower.includes('রুট') ||
    lower.includes('আইপি') ||
    lower.includes('صلاحيات') ||
    lower.includes('جذر') ||
    lower.includes('عنوان')
  ) {
    return {
      icon: Terminal,
      category: 'Root / IP',
      colorClass: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20 dark:border-violet-500/30'
    };
  }

  // 8. SSL / Certificate / Padlock
  if (
    lower.includes('ssl') ||
    lower.includes('certificate') ||
    lower.includes('wildcard') ||
    lower.includes('এসএসএল') ||
    lower.includes('সার্টিফিকেট') ||
    lower.includes('شهادة') ||
    lower.includes('أمان')
  ) {
    return {
      icon: Lock,
      category: 'SSL Security',
      colorClass: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20 dark:border-teal-500/30'
    };
  }

  // 9. DDoS / Security / Malware / Imunify / Firewall
  if (
    lower.includes('security') ||
    lower.includes('ddos') ||
    lower.includes('firewall') ||
    lower.includes('imunify') ||
    lower.includes('malware') ||
    lower.includes('shield') ||
    lower.includes('শিল্ড') ||
    lower.includes('সিকিউরিটি') ||
    lower.includes('ম্যালওয়্যার') ||
    lower.includes('حماية') ||
    lower.includes('جدران')
  ) {
    return {
      icon: ShieldCheck,
      category: 'Security',
      colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30'
    };
  }

  // 10. cPanel / WHM / Control Panel / CyberPanel / Hestia
  if (
    lower.includes('cpanel') ||
    lower.includes('whm') ||
    lower.includes('panel') ||
    lower.includes('cyberpanel') ||
    lower.includes('hestia') ||
    lower.includes('সিপ্যানেল') ||
    lower.includes('প্যানেল') ||
    lower.includes('لوحة')
  ) {
    return {
      icon: Sliders,
      category: 'Control Panel',
      colorClass: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20 dark:border-orange-500/30'
    };
  }

  // 11. Website / Domain / Subdomain / Addon
  if (
    lower.includes('website') ||
    lower.includes('domain') ||
    lower.includes('subdomain') ||
    lower.includes('nameserver') ||
    lower.includes('ওয়েবসাইট') ||
    lower.includes('ডোমেইন') ||
    lower.includes('সাবডোমেইন') ||
    lower.includes('নেমসার্ভার') ||
    lower.includes('موقع') ||
    lower.includes('نطاقات') ||
    lower.includes('دومين')
  ) {
    return {
      icon: Globe,
      category: 'Domain',
      colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20 dark:border-indigo-500/30'
    };
  }

  // 12. Backup / Cloud Backup / Remote Backup
  if (
    lower.includes('backup') ||
    lower.includes('ব্যাকআপ') ||
    lower.includes('نسخ') ||
    lower.includes('احتياطي')
  ) {
    return {
      icon: Cloud,
      category: 'Backup',
      colorClass: 'text-blue-600 dark:text-cyan-400 bg-blue-500/10 border-blue-500/20 dark:border-blue-500/30'
    };
  }

  // 13. Web Server / LiteSpeed / Cache / Fast Speed / BDIX
  if (
    lower.includes('litespeed') ||
    lower.includes('cache') ||
    lower.includes('caching') ||
    lower.includes('bdix') ||
    lower.includes('বিডিআইএক্স') ||
    lower.includes('স্পীড') ||
    lower.includes('ক্যাশিং') ||
    lower.includes('مسرعات')
  ) {
    return {
      icon: Zap,
      category: 'Speed Engine',
      colorClass: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30'
    };
  }

  // 14. Support / 24/7 / VIP / Managed
  if (
    lower.includes('support') ||
    lower.includes('24/7') ||
    lower.includes('vip') ||
    lower.includes('সাপোর্ট') ||
    lower.includes('دعم')
  ) {
    return {
      icon: Headphones,
      category: 'Support',
      colorClass: 'text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/20 dark:border-pink-500/30'
    };
  }

  // 15. Apps / WordPress / Softaculous / Python / Node / Ruby / PHP
  if (
    lower.includes('wordpress') ||
    lower.includes('softaculous') ||
    lower.includes('python') ||
    lower.includes('node') ||
    lower.includes('ruby') ||
    lower.includes('php') ||
    lower.includes('অ্যাপস') ||
    lower.includes('ওয়ার্ডপ্রেস') ||
    lower.includes('تثبيت')
  ) {
    return {
      icon: Code2,
      category: 'Apps & Code',
      colorClass: 'text-violet-600 dark:text-purple-400 bg-violet-500/10 border-violet-500/20 dark:border-violet-500/30'
    };
  }

  // 16. FTP / SFTP / Migration
  if (
    lower.includes('ftp') ||
    lower.includes('sftp') ||
    lower.includes('migration') ||
    lower.includes('মাইগ্রেশন') ||
    lower.includes('نقل')
  ) {
    return {
      icon: Upload,
      category: 'Transfer',
      colorClass: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20 dark:border-teal-500/30'
    };
  }

  // 17. Uptime / SLA Guarantee
  if (
    lower.includes('uptime') ||
    lower.includes('sla') ||
    lower.includes('99.9') ||
    lower.includes('গ্যারান্টি') ||
    lower.includes('আপটাইম') ||
    lower.includes('ضمان') ||
    lower.includes('تشغيل')
  ) {
    return {
      icon: Activity,
      category: 'Uptime SLA',
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30'
    };
  }

  // 18. Money Back / Guarantee
  if (
    lower.includes('money back') ||
    lower.includes('মানি ব্যাক') ||
    lower.includes('استعادة')
  ) {
    return {
      icon: DollarSign,
      category: 'Guarantee',
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30'
    };
  }

  // 19. White-Label / Branding / Reseller
  if (
    lower.includes('white-label') ||
    lower.includes('whitelabel') ||
    lower.includes('হোয়াইট') ||
    lower.includes('ব্র্যান্ডিং')
  ) {
    return {
      icon: Award,
      category: 'White-Label',
      colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20 dark:border-purple-500/30'
    };
  }

  // Default fallback
  return {
    icon: CheckCircle2,
    category: 'Included',
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30'
  };
};

const vpsSetupTrans = {
  en: {
    tag: "✓ Initial VPS Setup",
    heading: "Step-by-Step VPS Setup",
    sub: "A precise, technical checklist to securely access root privileges and lay down standard server configurations on WebzoneBD nodes.",
    terminalTitle: "WebzoneBD Secure Server Terminal",
    ipPlaceholder: "Your VPS IP Address",
    connectedText: "Connected to root@",
    activeStepPrefix: "Step",
    steps: [
      {
        title: "Provisioning & Secure Welcome Email",
        desc: "Once your WebzoneBD VPS order has finished provisioning, our systems auto-dispatch a highly secure, encrypted credentials package to your primary email address. This contains your dedicated IPv4 address, default SSH port, default administrative user 'root', and randomly generated temporary administrator passphrase.",
        command: "# Initial status tracking:\ncurl -s https://api.webzonebd.com/vps/provision-status"
      },
      {
        title: "Initial Connection via Secure Shell (SSH)",
        desc: "Fire up your computer's native Terminal application (macOS/Linux) or launch PuTTY (Windows). Initiate a secure login handshake with the root administrator user using the assigned dedicated IP address. Upon first connection, you must accept the server's unique RSA/ECDSA key fingerprint to forge a secure encrypted pipe.",
        command: "ssh root@your_server_ip -p 22\n# Accept RSA key fingerprint when prompted by typing 'yes'"
      },
      {
        title: "Root Passphrase Rotation & Sudo Privilege Isolation",
        desc: "To lock out threat vectors, you must immediately change the temporary system administrator password. To prevent accidental root commands, create a low-privilege system user account and assign it to the 'sudo' (superuser do) group for executing security administrative tasks on demand.",
        command: "# Change main root account password:\npasswd\n\n# Create specialized low-privilege user and assign sudo powers:\nadduser webadmin\nusermod -aG sudo webadmin"
      },
      {
        title: "Core Updates & Firewall Locking Policy",
        desc: "Ensure the hypervisor's guest OS dependencies are pristine. Fetch the newest packages repositories and upgrade all core binaries to secure stable versions. Afterward, configure the Uncomplicated Firewall (UFW) to only permit incoming SSH, web ports (HTTP/HTTPS), and lock down unused ingress channels.",
        command: "# Fetch and apply the latest Ubuntu/Debian updates:\nsudo apt update && sudo apt upgrade -y\n\n# Secure standard system ports with firewall rules:\nsudo ufw allow OpenSSH\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable"
      },
      {
        title: "Web Engine Stack & Panel Setup",
        desc: "Access your pre-loaded Virtualizor control pane, or initialize standard modern web stacks such as LiteSpeed Enterprise Web Server, Nginx, or an easy GUI management layout (such as CyberPanel or Plesk). Update your DNS settings, deploy your application codes, and link your databases securely.",
        command: "# Point nameservers to WebzoneBD & check virtual host records:\nnslookup yourbrand.com ns1.webzonebd.com\n# All systems green and ready for production deployment!"
      }
    ]
  },
  bn: {
    tag: "✓ প্রাথমিক ভিপিএস সেটআপ",
    heading: "ধাপে ধাপে ভিপিএস সেটআপ",
    sub: "আপনার ব্র্যান্ড-নিউ WebzoneBD VPS সার্ভারে রুট অ্যাক্সেস পেতে এবং প্রাথমিক সিকিউরিটি ও কনফিগারেশন সেটআপ করতে নিচের সঠিক গাইডটি অনুসরণ করুন।",
    terminalTitle: "WebzoneBD সুরক্ষিত সার্ভার টার্মিনাল",
    ipPlaceholder: "আপনার ভিপিএস আইপি অ্যাড্রেস",
    connectedText: "রুট কানেকশন সফল@",
    activeStepPrefix: "ধাপ",
    steps: [
      {
        title: "ভিপিএস প্রোভিশনিং ও সুরক্ষিত ইমেইল তথ্য",
        desc: "WebzoneBD-তে আপনার ভিপিএস ক্রয় সম্পন্ন হওয়ার সাথে সাথেই আমাদের অটোমেটেড সিস্টেম আপনার রেজিস্টার্ড ইমেইলে একটি সুরক্ষিত ইমেল পাঠাবে। এই প্যাকের মধ্যে পাবেন আপনার ডেডিকেটেড IPv4 অ্যাড্রেস, ডিফল্ট SSH পোর্ট (২২), রুট ইউজারনেম ('root') এবং র্যান্ডমলি জেনারেটেড একটি স্ট্রং পাসওয়ার্ড।",
        command: "# Initial status tracking:\ncurl -s https://api.webzonebd.com/vps/provision-status"
      },
      {
        title: "SSH টার্মিনাল ব্যবহার করে প্রথম সংযোগ স্থাপন",
        desc: "উইন্ডোজ অপারেটিং সিস্টেমে 'PuTTY' সফটওয়্যারটি ওপেন করুন অথবা ম্যাক/লিনাক্সে আপনার কম্পিউটারের ডিফল্ট 'Terminal' অ্যাপটি খুলুন। এরপর আপনার অনন্য সুরক্ষিত আইপি ব্যবহার করে সিকিউর কানেকশন রিকোয়েস্ট তৈরি করুন। প্রথমবারের মত কানেক্ট করতে RSA ফিঙ্গারপ্রিন্ট অ্যাক্সেপ্ট করতে হবে।",
        command: "ssh root@your_server_ip -p 22\n# প্রম্পট আসলে 'yes' লিখে প্রথম সংযোগ অনুমোদন করুন"
      },
      {
        title: "রুট পাসওয়ার্ড রোটেশন ও সুডো ইউজার ক্রিয়েশন",
        desc: "সার্ভারের সর্বোচ্চ নিরাপত্তা বজায় রাখতে আপনার মেইলে পাওয়া সাময়িক পাসওয়ার্ডটি পরিবর্তন করা আবশ্যক। এছাড়াও সার্বক্ষণিক রুট অ্যাকাউন্ট এড়াতে একটি নরমাল সিস্টেম ইউজার তৈরি করুন এবং প্রয়োজনে রুট পাওয়ার দিয়ে চালানোর জন্য তাকে 'sudo' গ্রুপে যুক্ত করুন।",
        command: "# এডমিনিস্ট্রেটরের মূল পাসওয়ার্ড পরিবর্তন করুন:\npasswd\n\n# নতুন শক্তিশালী ইউজার তৈরি এবং অ্যাডমিন গ্রুপে যুক্ত করুন:\nadduser webadmin\nusermod -aG sudo webadmin"
      },
      {
        title: "সিস্টেম আপডেট এবং ফায়ারওয়াল পলিসি সেটিংস",
        desc: "আপনার ভার্চুয়াল সার্ভারের নতুন লিনাক্স রিসিভারের অবিরত গতি ও নিরাপত্তা আপডেট নিশ্চিত করতে লিনাক্স ডিপেন্ডেন্সিগুলো আপডেট করে নিন। এরপর ফায়ারওয়াল (UFW) প্রটেকশন চালু করে অপ্রয়োজনীয় পোর্টের প্রবেশদ্বার সম্পূর্ণরূপে অফ করে দিন।",
        command: "# নতুন আপডেট ও প্রয়োজনীয় ফাইল প্যাচ ডাউনলোড করুন:\nsudo apt update && sudo apt upgrade -y\n\n# লিনাক্স ফায়ারওয়ালে দরকারী পোর্ট অনুমোদন ও এটি সচল করুন:\nsudo ufw allow OpenSSH\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable"
      },
      {
        title: "ওয়েব ইঞ্জিন স্ট্যাক ও কন্ট্রোল প্যানেল কনফিগারেশন",
        desc: "সবশেষে আপনার জন্য ইন্টিগ্রেটেড কাস্টম ভার্চুয়ালাইজেশন কন্ট্রোল ফ্লো (যেমন Virtualizor বা CyberPanel/cPanel) দিয়ে হোস্ট জোন সেটআপ করুন। আপনার ডোমেইনের ডিএনএস রেকর্ড আপডেট করুন, লাইটস্পিড ক্যাশ সচল করুন এবং প্রজেক্টের কোড ভিপিএস ডাটাবেসে লঞ্চ করুন।",
        command: "# পয়েন্ট নেমসার্ভার এবং ডিএনএস কুয়েরি রেকর্ড দেখে নেওয়া:\nnslookup yourbrand.com ns1.webzonebd.com\n# সফল সেটআপ! আপনার ওয়েবসাইট এখন রকেট গতিতে লাইভ।"
      }
    ]
  },
  ar: {
    tag: "✓ دليل إعداد خادم VPS الأولي",
    heading: "إعداد خادم الـ VPS خطوة بخطوة",
    sub: "خطوات تفصيلية آمنة للاتصال بخادم ويب زون المشترك والخاص وسيطرة كاملة على جدار الحماية ونظام التشغيل.",
    terminalTitle: "محاكي الاتصال الآمن بسيرفرات ويب زون",
    ipPlaceholder: "عنوان الآي بي المخصص للسيرفر",
    connectedText: "تم الاتصال بنجاح بـ root@",
    activeStepPrefix: "الخطوة",
    steps: [
      {
        title: "تفعيل السيرفر واستلام بيانات الاعتماد",
        desc: "بمجرد معالجة طلب شراء السيرفر من بنغلاديش، يقوم النظام آلياً بإرسال رسالة مشفرة إلى بريدك الإلكتروني تحتوي على الـ IP المخصص، واسم مستخدم الإدارة 'root' وكلمة المرور المؤقتة والآمنة.",
        command: "# Initial status tracking:\ncurl -s https://api.webzonebd.com/vps/provision-status"
      },
      {
        title: "الاتصال لأول مرة بالسيرفر عبر بروتوكول SSH",
        desc: "افتح نافذة الأوامر Terminal على الماك أو برنامج PuTTY على الويندوز. قم بإنشاء بيئة اتصال مشفرة باستخدام عنوان IP الافتراضي والآمن والمنفذ الافتراضي 22. وافق على شفرة التوثيق للحماية والمتابعة.",
        command: "ssh root@your_server_ip -p 22\n# اكتب 'yes' للموافقة وتحميل بصمة التشفير الآمنة"
      },
      {
        title: "تغيير كلمة المرور الافتراضية للـ Root وعزل الصلاحيات",
        desc: "توصي سياسات الأمان الخاصة بنا بتحديث فوري وعاجل لكلمة المرور الافتراضية. يوصى أيضاً بإنشاء مستخدم فرعي جديد وتعيينه كعضو في مجموعة الحماية 'sudo' لمنع عمليات الاختراق المباشرة للروت.",
        command: "# تغيير كلمة مرور حساب المسؤول الرئيسي:\npasswd\n\n# إنشاء مستخدم عادي جديد ومنحه صلاحيات السوبر أدمن:\nadduser webadmin\nusermod -aG sudo webadmin"
      },
      {
        title: "تحديث حزم نظام التشغيل وجدار الحماية الآمن (UFW)",
        desc: "قم بتشغيل معالجات التحديث للحفاظ على ثبات وسرعة كفاءة نظام السيرفر. قم بتوجيه الجدار الناري لكي يمنح فقط تصريحات الوصول للمنافذ الأساسية للمشروع مثل منافذ المتصفحات والاتصال المشفر SSH.",
        command: "# تحديث جميع ملفات نظام التشغيل والمحركات:\nsudo apt update && sudo apt upgrade -y\n\n# ضبط جدار الحماية للسيرفر الداخلي وفلترة المنافذ:\nsudo ufw allow OpenSSH\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable"
      },
      {
        title: "لوحات التحكم وحظر الهجمات وتدشين الموقع",
        desc: "قم بتوجيه نطاق موقعك الإلكتروني لكي ينظر لخوادم الأسماء لويب زون (WebzoneBD). ثبّت خادم الويب LiteSpeed لرفع الفعاليات وسرعة تنفيذ قواعد البيانات وتشغيل موقع البروجكت بكفاءة قصوى.",
        command: "# التحقق من تفعيل ونطاق خوادم الأسماء للخادم:\nnslookup yourbrand.com ns1.webzonebd.com\n# مبارك! السيرفر الآن نشط ومحمي وتطبيقك يعمل بسرعة خارقة."
      }
    ]
  }
};

interface HostingProps {
  language: Language;
  theme: Theme;
  currency: Currency;
  currencySettings?: any;
  addToCart?: (product: Product) => void;
  addServiceOrder?: (order: any) => Promise<void> | void;
  user?: any;
  triggerToast?: (title: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  setCurrentPage?: (page: string) => void;
}

export default function Hosting({ 
  language, 
  theme, 
  currency, 
  currencySettings, 
  addToCart,
  addServiceOrder,
  user,
  triggerToast,
  setCurrentPage
}: HostingProps) {
  
  // Active category tab for filtering Packages
  const [activeTab, setActiveTab] = useState<'bdix' | 'vps' | 'reseller' | 'cloud'>('bdix');

  const selectTab = (tab: 'bdix' | 'vps' | 'reseller' | 'cloud') => {
    setActiveTab(tab);
    localStorage.setItem('webzone_target_hosting_tab', tab);
  };

  useEffect(() => {
    const handleStorage = () => {
      const target = localStorage.getItem('webzone_target_hosting_tab');
      if (target === 'bdix' || target === 'vps' || target === 'reseller' || target === 'cloud') {
        setActiveTab(target);
      }
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 150);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);
  
  // Billing cycle state: 1 | 12 | 24 months
  const [billingCycle, setBillingCycle] = useState<'1' | '12' | '24'>('24');
  const [isBillingDropdownOpen, setIsBillingDropdownOpen] = useState(false);

  // FAQ Accordion active indices state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Step-by-Step VPS Setup active step state
  const [activeSetupStep, setActiveSetupStep] = useState<number | null>(0);
  const [vpsIp, setVpsIp] = useState('141.136.42.112');

  // Domain search state inside the redesigned page
  const [domainQuery, setDomainQuery] = useState('');
  const [selectedExt, setSelectedExt] = useState('.com');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedName, setSearchedName] = useState('');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  
  const [domainResult, setDomainResult] = useState<{
    domain: string;
    isAvailable: boolean;
    isPremium: boolean;
    priceUSD: number;
  } | null>(null);

  const isRtl = language === 'ar';

  // Migration Guide Interactive Wizard States
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [wizardWebType, setWizardWebType] = useState<string>('wordpress');
  const [wizardHasDomain, setWizardHasDomain] = useState<string>('yes');
  const [wizardTransferMethod, setWizardTransferMethod] = useState<string>('expert');
  const [wizardOldProvider, setWizardOldProvider] = useState<string>('Namecheap');
  const [wizardSiteSize, setWizardSiteSize] = useState<string>('Under 5GB');
  const [wizardAnalysisRun, setWizardAnalysisRun] = useState<boolean>(false);
  
  // Custom Manual Upload Simulated states
  const [wizardFileSelected, setWizardFileSelected] = useState<string | null>(null);
  const [wizardFileProgress, setWizardFileProgress] = useState<number>(0);
  const [wizardFileUploading, setWizardFileUploading] = useState<boolean>(false);

  // Live Simulated Transfer states
  const [wizardSimState, setWizardSimState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [wizardSimProgress, setWizardSimProgress] = useState<number>(0);
  const [wizardSimStatus, setWizardSimStatus] = useState<string>('');
  const [wizardSimLogs, setWizardSimLogs] = useState<string[]>([]);

  // Checklist states
  const [wizardChecklist, setWizardChecklist] = useState<Record<string, boolean>>({
    nameservers: false,
    ssl: false,
    dbconn: false,
    cache: false
  });

  const planPricing: Record<string, { '1': number; '12': number; '24': number }> = {
    'bdix-starter': { '1': 250, '12': 2500, '24': 4500 },
    'bdix-business': { '1': 400, '12': 4000, '24': 7000 },
    'bdix-professional': { '1': 600, '12': 6000, '24': 10500 },
    'vps-starter': { '1': 1750, '12': 16800, '24': 29400 },
    'vps-business': { '1': 3505, '12': 33648, '24': 58884 },
    'vps-professional': { '1': 5925, '12': 56880, '24': 99540 },
    'reseller-10g': { '1': 899, '12': 8500, '24': 15000 },
    'reseller-20g': { '1': 1799, '12': 16500, '24': 29000 },
    'reseller-50g': { '1': 2499, '12': 23500, '24': 42000 },
    'cloud-starter': { '1': 999, '12': 9590, '24': 16783 },
    'cloud-business': { '1': 1999, '12': 19190, '24': 33583 },
    'cloud-vps': { '1': 3999, '12': 38390, '24': 67183 },
  };

  const bdtPrices: Record<string, number> = {
    'bdix-starter': 250,
    'bdix-business': 400,
    'bdix-professional': 600,
    'vps-starter': 1750,
    'vps-business': 3505,
    'vps-professional': 5925,
    'reseller-10g': 899,
    'reseller-20g': 1799,
    'reseller-50g': 2499,
    'cloud-starter': 999,
    'cloud-business': 1999,
    'cloud-vps': 3999,
  };

  // Currency rates & precise formatting
  const formatPriceVal = (value: number) => {
    let cur = currency;
    if (currencySettings) {
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
        cur = firstEnabled || 'USD';
      }
    }
    switch (cur) {
      case 'BDT':
        return `৳ ${Math.round(value).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${value.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${value.toFixed(2)}`;
    }
  };

  const getDisplayPrice = (pkgId: string, cycle: '1' | '12' | '24') => {
    let cur = currency;
    let rates = currencySettings?.rates || { USD: 1.0, BDT: 118.5, SAR: 3.75 };
    if (currencySettings) {
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        const firstEnabled = (Object.keys(currencySettings.enabled) as Currency[]).find(c => currencySettings.enabled[c]);
        cur = firstEnabled || 'USD';
      }
    }

    const priceInfo = planPricing[pkgId] || { '1': 100, '12': 1000, '24': 1800 };
    const bdtTotal = priceInfo[cycle];
    
    const months = cycle === '1' ? 1 : cycle === '12' ? 12 : 24;
    const bdtMonthlyAvg = bdtTotal / months;

    const bdtRate = rates.BDT ?? 118.5;
    const targetRate = rates[cur] ?? 1.0;

    const monthlyPriceInUSD = bdtMonthlyAvg / bdtRate;
    const monthlyPriceInTarget = monthlyPriceInUSD * targetRate;

    const totalInUSD = bdtTotal / bdtRate;
    const totalInTarget = totalInUSD * targetRate;

    return {
      monthlyAvg: monthlyPriceInTarget,
      totalCost: totalInTarget,
      bdtTotal,
    };
  };

  const getMonthlyPrice = (pkgId: string) => {
    return getDisplayPrice(pkgId, '1').monthlyAvg;
  };

  const formatPeriod = () => {
    if (language === 'bn') return '/মাস';
    if (language === 'ar') return '/شهرياً';
    return '/mo';
  };

  // Redesign translation dict
  const t = {
    en: {
      heroTitle: "Premium Web Hosting Solutions",
      heroSubtitle: "Fast, secure, and reliable hosting services for businesses, ecommerce stores, blogs, and enterprise applications.",
      getStarted: "Get Started",
      comparePlans: "Compare Plans",
      whatsappSupport: "WhatsApp Support",
      
      domainTitle: "Find Your Perfect Domain Name",
      domainPlaceholder: "Search your perfect domain...",
      registerDomain: "Register Domain",
      transferDomain: "Transfer Domain",
      viewPricing: "View Pricing",
      available: "Domain is Available!",
      taken: "Already Registered / Taken",
      
      categoriesHeading: "Tailored Hosting Categories",
      categoriesSub: "Choose the computing architectures designed for your unique traffic scales and requirements.",
      sharedTitle: "Shared BDIX Hosting",
      sharedDesc: "BDIX-optimized hosting delivering sub-5ms rendering speeds in Bangladesh.",
      vpsTitle: "Managed VPS Hosting",
      vpsDesc: "High-performance nodes with dedicated server-grade CPUs and OS environments.",
      resellerTitle: "Reseller Hosting",
      resellerDesc: "Start your white-label business with custom name servers and WHM control.",
      explorePlans: "Explore Packages",
      from: "Starting at",

      packagesHeading: "Flexible Hosting Plans",
      packagesSub: "Save 20% on any plan when choosing annual billing cycles. Automated setup in minutes.",
      hourlyBillingMsg: "Secure cPanel with fast LiteSpeed server and malware screening shields.",
      save20: "Yearly (Save 20%)",
      monthly: "Monthly Only",
      totalSavings: "Total Savings:",
      originalYearly: "Original Cost:",
      discountedYearly: "Annual Bill:",
      orderButton: "Order Package",
      contactSales: "Contact Sales",
      perfectFor: "Ideal for:",

      featsTitle: "State-of-the-Art Architecture",
      featsSub: "Our servers are built with top-tier hardware configurations and direct connectivity switches.",
      feat1: "LiteSpeed Web Server",
      feat1Desc: "Supercharged page caching resulting in 20x faster page rendering speeds.",
      feat2: "Free SSL Certificate",
      feat2Desc: "Automated standard Let's Encrypt Wildcard SSL encryption keys.",
      feat3: "SSD Storage",
      feat3Desc: "High-density enterprise SSD NVMe storage with fast write operations.",
      feat4: "Daily Backup",
      feat4Desc: "Automated off-site cloud replication for continuous data protection.",
      feat5: "cPanel Control Panel",
      feat5Desc: "Industry-standard administration panel featuring 1-click script installers.",
      feat6: "BDIX Connectivity",
      feat6Desc: "Direct local network routes providing low-ping response speeds.",
      feat7: "99.9% Uptime",
      feat7Desc: "Backed by enterprise-grade SLA guarantees and automated link failover.",
      feat8: "24/7 Support",
      feat8Desc: "Continuous expert troubleshooting via Tickets, WhatsApp and Phone.",

      compHeading: "Plan Comparison Matrix",
      compSub: "Evaluate technical specifications across our premium hosting tier lines side by side.",
      compStorage: "SSD Storage Capacity",
      compBandwidth: "Monthly Bandwidth Limit",
      compSSL: "SSL Protection Type",
      compEmails: "Professional Email Addresses",
      compDatabases: "MySQL Database Limits",
      compSupport: "Support Clearances",
      compBackups: "Backup Schedules",
      compUptime: "Uptime Reliability Rate",

      reviewsHeading: "Trusted by Modern Agencies",
      reviewsSub: "Read success stories from businesses and development agencies leveraging our hosting services.",
      r1Author: "Arman Chowdhury",
      r1Role: "Systems Tech Lead, Dhaka Agency",
      r1Text: "The BDIX speeds are absolutely incredible. Our local client portfolios load instantly in less than 2 seconds. Exceptional server consistency!",
      r2Author: "Siddique Al-Ghamdi",
      r2Role: "Technical Director, Saudi AgriGroup",
      r2Text: "The customer support at WebzoneBD is unmatched. We migrated our heavy CRM database without single second of downtime. Highly recommended!",
      r3Author: "Masud Zaman",
      r3Role: "Founder of ShopBD Hub",
      r3Text: "Using the reseller package to manage 45+ WordPress stores. The WHM custom branding and LiteSpeed cache engine are incredible assets.",

      faqHeading: "Common Questions & Answers",
      faqSub: "Get answers to key server configurations, website migrations, and domain registration.",
      f1Q: "What is BDIX Hosting?",
      f1A: "BDIX hosting utilizes direct connections with the Bangladesh Internet Exchange (BDIX). This provides extremely low latency (under 5ms) and fast rendering for visitors inside Bangladesh.",
      f2Q: "How do I migrate my website?",
      f2A: "Our server administrators handle website migration completely free! We migrate all file databases, configurations, and emails with zero downtime guaranteed.",
      f3Q: "Do you provide backups?",
      f3A: "Yes! All packages receive automated weekly backups. Business and Professional tiers include automatic daily cloud backups with instant recovery tools inside cPanel.",
      f4Q: "Can I upgrade later?",
      f4A: "Absolutely. You can seamlessly scale computing power, NVMe storage space, or server resources directly from your client panel at any time without data loss.",
      f5Q: "What support do you provide?",
      f5A: "We provide 24/7 support. You can reach out directly via live web tickets, WhatsApp support chats, or by contacting our specialized systems administrators.",

      needHelp: "Need Help Selecting a Custom Hosting Matrix?",
      needHelpSub: "Get custom recommendation tailored to your framework profiles, website traffic, and compute requirements.",
      orderHosting: "Order Hosting",
    },
    bn: {
      heroTitle: "প্রিমিয়াম ওয়েব হোস্টিং সলিউশন",
      heroSubtitle: "ব্যবসা, ই-কমার্স স্টোর, ব্লগ এবং করপোরেট অ্যাপ্লিকেশনের জন্য অত্যন্ত দ্রুত, নিরাপদ এবং নির্ভরযোগ্য হোস্টিং সেবা।",
      getStarted: "শুরু করুন",
      comparePlans: "প্ল্যানসমূহ তুলনা করুন",
      whatsappSupport: "হোয়াটসঅ্যাপ সাপোর্ট",

      domainTitle: "আপনার পছন্দের ডোমেন সংরক্ষণ করুন",
      domainPlaceholder: "আপনার পছন্দের ডোমেনটি খুঁজুন...",
      registerDomain: "ডোমেন বুকিং",
      transferDomain: "ডোমেন ট্রান্সফার",
      viewPricing: "মূল্য তালিকা",
      available: "ডোমেনটি খালি আছে!",
      taken: "ইতিমধ্যে নিবন্ধিত / খালি নেই",

      categoriesHeading: "বিশেষায়িত হোস্টিং ক্যাটাগরি",
      categoriesSub: "আপনার ট্রাফিক লোড এবং সফটওয়্যারের পরিধি অনুযায়ী নিখুঁত কম্পিউটিং ক্যাটাগরি বেছে নিন।",
      sharedTitle: "শেয়ার্ড বিডিআইএক্স হোস্টিং",
      sharedDesc: "বাংলাদেশী গ্রাহকদের জন্য ৫ মিলি-সেকেন্ডের নিচে দ্রুত পেজ লোড সমন্বিত বিডিআইএক্স হোস্টিং।",
      vpsTitle: "ম্যানেজড ভিপিএস হোস্টিং",
      vpsDesc: "ডেডিকেটেড প্রসেসর এবং আল্ট্রা-স্পিড রিসোর্স সমৃদ্ধ উচ্চ ক্ষমতাসম্পন্ন ভার্চুয়াল সার্ভার।",
      resellerTitle: "রিসেলার হোস্টিং",
      resellerDesc: "WHM কন্ট্রোল এবং কাস্টম নেমসার্ভার দিয়ে নিজস্ব ব্র্যান্ড নামে হোস্টিং ব্যবসা শুরু করুন।",
      explorePlans: "প্যাকেজসমূহ দেখুন",
      from: "শুরু মাত্র",

      packagesHeading: "হোস্টিং প্যাকেজসমূহ",
      packagesSub: "বার্ষিক বিলিং চক্রে ২০% পর্যন্ত সাশ্রয় উপভোগ করুন। মাত্র কয়েক মিনিটে অটোমেটেড সেটআপ।",
      hourlyBillingMsg: "ফাস্ট লাইটস্পিড এবং ম্যালওয়্যার শিল্ড সুরক্ষাসহ সিপ্যানেল প্যানেল সুবিধা।",
      save20: "বার্ষিক পেমেন্ট (২০% ছাড়)",
      monthly: "শুধুমাত্র মাসিক পেমেন্ট",
      totalSavings: "মোট সাশ্রয়:",
      originalYearly: "সাধারণ মূল্য:",
      discountedYearly: "বার্ষিক মূল্য:",
      orderButton: "অর্ডার করুন",
      contactSales: "সেন্স টিম",
      perfectFor: "আদর্শ ব্যবহার ক্ষেত্র:",

      featsTitle: "সেরা মানের আধুনিক হোস্টিং ফিচার",
      featsSub: "আমাদের প্রতিটি নোড এন্টারপ্রাইজ হার্ডওয়্যার এবং কাস্টম স্পিড অপ্টিমাইজেশন দ্বারা পরিচালিত।",
      feat1: "লাইটস্পিড ওয়েব সার্ভার",
      feat1Desc: "উন্নত ক্যাশিং প্রযুক্তিসম্পন্ন যা সাধারণ সার্ভার অপেক্ষা ২০ গুণ পর্যন্ত দ্রুত পেজ লোড দেয়।",
      feat2: "ফ্রি এসএসএল সার্টিফিকেট",
      feat2Desc: "লেটস এনক্রিপ্ট ওয়াইল্ডকার্ড এসএসএল যা আপনার ওয়েবসাইটকে রাখে সুরক্ষিত।",
      feat3: "এসএসডি স্টোরেজ",
      feat3Desc: "দ্রুততম রিড/রাইট স্পিডের জন্য হাই-ডেন্সিটি এন্টারপ্রাইজ এসএসডি এনভিএমই ড্রাইভ।",
      feat4: "দৈনিক ব্যাকআপ",
      feat4Desc: "ডাটা সুরক্ষায় প্রতিদিন স্বয়ংক্রিয় অফ-সাইট ক্লাউড ব্যাকআপ সিস্টেম।",
      feat5: "সিপ্যানেল কন্ট্রোল প্যানেল",
      feat5Desc: "১-ক্লিক স্ক্রিপ্ট ইন্সটলার সংবলিত বিশ্বমানের সহজতম কন্ট্রোল প্যানেল।",
      feat6: "বিডিআইএক্স কানেক্টিভিটি",
      feat6Desc: "স্থানীয় ইন্টারনেট এক্সচেঞ্জের সাথে সংযোগ যা বাংলাদেশে লেটেন্সি কমিয়ে স্পিড বাড়ায়।",
      feat7: "৯৯.৯% আপটাইম",
      feat7Desc: "উন্নত এন্টারপ্রাইজ এসএলএ গ্যারান্টি এবং নিরবচ্ছিন্ন ফেইলওভার পাওয়ার সুবিধা।",
      feat8: "২৪/৭ টেকনিক্যাল সাপোর্ট",
      feat8Desc: "অভিজ্ঞ সার্ভার বিশেষজ্ঞদের থেকে টিকিট, হোয়াটসঅ্যাপ এবং সরাসরি ফোনে দিনরাত সাহায্য।",

      compHeading: "ফিচার তুলনা তালিকা",
      compSub: "আমাদের আকর্ষণীয় হোস্টিং প্ল্যানগুলোর মধ্যকার কারিগরি পার্থক্যসমূহ বিস্তারিত তুলনা করে দেখুন।",
      compStorage: "এসএসডি স্টোরেজ সীমা",
      compBandwidth: "মাসিক ব্যান্ডউইথ লিমিট",
      compSSL: "এসএসএল প্রটেকশন",
      compEmails: "প্রফেশনাল ইমেইল আইডি",
      compDatabases: "মাইএসকিউএল ডাটাবেস সীমা",
      compSupport: "টেকনিক্যাল সাপোর্ট টাইপ",
      compBackups: "ডাটা ব্যাকআপ পরিকল্পনা",
      compUptime: "আপটাইম গ্যারান্টি রেট",

      reviewsHeading: "আমাদের গ্রাহকদের ইতিবাচক মতামত",
      reviewsSub: "আইটি এজেন্সি এবং করপোরেট প্রতিষ্ঠানসমূহের সফলতার সত্য কাহিনী ও প্রশংসাসমূহ জানুন।",
      r1Author: "আরমান চৌধুরী",
      r1Role: "সিস্টেম টেক লিড, ঢাকা এজেন্সি",
      r1Text: "বিডিআইএক্স কানেক্টিভিটি অসাধারণ। আমাদের গ্রাহকদের পোর্টফোলিও ওয়েবসাইটগুলো কোনো বাফারিং ছাড়াই লোড হয়। ধন্যবাদ ওয়েবজোনবিডি!",
      r2Author: "সিদ্দিক আল-গামদি",
      r2Role: "প্রযুক্তিগত পরিচালক, সৌদি অ্যাগ্রিগ্রুপ",
      r2Text: "তাদের সাপোর্ট অত্যন্ত আন্তরিক ও পেশাদার। কোডিং ম্যাপের ডাউনটাইম ছাড়াই অত্যন্ত সহজে ও নিরাপদে ডাটাবেস হোস্টিংয়ে মাইগ্রেশন সম্পন্ন হয়েছে।",
      r3Author: "মাসুদ জামান",
      r3Role: "শপবিডি হাবের প্রতিষ্ঠাতা",
      r3Text: "আমি ৪৫টিরও বেশি ওয়ার্ডপ্রেস ওয়েবসাইট দেখাশোনায় রিসেলার প্ল্যানটি বেছে নিয়েছি। হোয়াইট লেবেল নেমসার্ভার এবং লাইটস্পিড স্পিড ক্যাশ অসাধারণ কাজ করে।",

      faqHeading: "সাধারণ জিজ্ঞাসা ও উত্তর",
      faqSub: "কনফিগারেশন, মাইগ্রেশন এবং ডোমেন বুকিং সম্পর্কিত প্রয়োজনীয় নির্দেশনাবলী নিচে তুলে ধরা হলো।",
      f1Q: "বিডিআইএক্স হোস্টিং কী?",
      f1A: "বিডিআইএক্স হোস্টিং হলো বাংলাদেশি গ্রাহকদের জন্য অপ্টিমাইজড হোস্টিং, যা সরাসরি লোকাল ইন্টারনেট এক্সচেঞ্জের মাধ্যমে ৫ মিলি-সেকেন্ডের নিচে ওয়েবসাইট লোড করতে পারে।",
      f2Q: "আপনারা কি ফ্রি ওয়েবসাইট ট্রান্সফার করে দেন?",
      f2A: "হ্যাঁ! আমাদের কারিগরি বিশেষজ্ঞরা সম্পূর্ণ ডাউনটাইম ও ডাটা হারানোর ঝুঁকি ছাড়াই আপনার আগের সার্ভার থেকে সমস্ত ডাটা আমাদের ড্রাইভে ফ্রিতে ট্রান্সফার করে দেয়।",
      f3Q: "আপনারা কি নিয়মিত ব্যাকআপ রাখেন?",
      f3A: "হ্যাঁ! প্রতিটি অ্যাকাউন্টে সাপ্তাহিক রিমোট ব্যাকআপ রাখা হয়। এছাড়া বিজনেস ও প্রফেশনাল প্ল্যানে রয়েছে দৈনিক ক্লাউড ব্যাকআপ এবং সিপ্যানেল থেকে দ্রুত রিস্টোর সুবিধা।",
      f4Q: "পরবর্তীতে কি প্ল্যান আপগ্রেড করা যাবে?",
      f4A: "অবশ্যই। আপনার ট্রাফিক বাড়লে আপনি যেকোনো সময় কোনো ফাইল নষ্ট হওয়া ছাড়াই গ্রাহক ড্যাশবোর্ড থেকে তাৎক্ষণিক আপনার হোস্টিং প্ল্যান আপগ্রেড করতে পারবেন।",
      f5Q: "আপনারা কী ধরনের সাপোর্ট দিয়ে থাকেন?",
      f5A: "আমারা টিকিট ড্যাশবোর্ড, সার্বক্ষণিক হোয়াটসঅ্যাপ গ্রুপ এবং সরাসরি মোবাইল কলের মাধ্যমে ২৪ ঘণ্টা সার্বক্ষণিক বিশেষজ্ঞ টেক সাপোর্ট দিয়ে থাকি।",

      needHelp: "হোস্টিং প্ল্যান নির্বাচনে ফ্রি পরামর্শ প্রয়োজন?",
      needHelpSub: "আপনার ওয়েবসাইটের ট্রাফিক এবং ব্যবহৃত ফ্রেমওয়ার্ক ডাইনামিক্স অনুযায়ী সঠিক হোস্টিং সিলেক্ট করতে বিশেষজ্ঞ পরামর্শ নিন ফ্রিতে।",
      orderHosting: "হোস্টিং অর্ডার করুন",
    },
    ar: {
      heroTitle: "حلول استضافة المواقع الفاخرة",
      heroSubtitle: "خدمات استضافة سريعة وآمنة وموثوقة بالكامل للشركات، والمتاجر الإلكترونية، والمدونات، وتطبيقات الأعمال الكبرى.",
      getStarted: "ابدأ الآن",
      comparePlans: "مقارنة الخطط",
      whatsappSupport: "الدعم عبر واتساب",

      domainTitle: "ابحث عن نطاقك المثالي فوراً",
      domainPlaceholder: "ابحث عن اسم نطاقك المثالي...",
      registerDomain: "تسجيل النطاق",
      transferDomain: "نقل النطاق",
      viewPricing: "عرض الأسعار",
      available: "النطاق متاح للحجز فوراً!",
      taken: "هذا النطاق محجوز بالفعل",

      categoriesHeading: "فئات الاستضافة السحابية",
      categoriesSub: "اختر الحل المناسب لحجم حركة المرور لمشروعك ومواصفات قواعد البيانات المطلوبة.",
      sharedTitle: "استضافة BDIX المشتركة",
      sharedDesc: "استضافة فائقة السرعة BDIX تضمن تصفح يقل عن 5 مللي ثانية للمستخدمين والزوار بمرونة تامة.",
      vpsTitle: "خوادم VPS المدارة",
      vpsDesc: "خوادم افتراضية خاصة قوية توفر معالجات وموارد مخصصة بالكامل لتشغيل التطبيقات والبرمجيات الكبرى.",
      resellerTitle: "استضافة الموزعين Reseller",
      resellerDesc: "ابدأ نشاطك واستضف عملاءك تحت هويتك التجارية وعناوين خوادمك المخصصة كلياً.",
      explorePlans: "عرض الباقات",
      from: "يبدأ سِعر من",

      packagesHeading: "خطط الاستضافة المرنة",
      packagesSub: "وفر ٢٠٪ من قيمة أي باقة تختارها عند الفوترة والدفع السنوي المسبق. تفعيل تلقائي متكامل بدقائق.",
      hourlyBillingMsg: "لوحة تحكم cPanel مألوفة تدعم مسرعات LiteSpeed وحماية جدران الإطفاء ومكافحة الم malware.",
      save20: "الدفع السنوي (وفر ٢٠٪)",
      monthly: "الدفع الشهري فقط",
      totalSavings: "مجموع التوفير الفعلي:",
      originalYearly: "التكلفة السنوية المعتادة:",
      discountedYearly: "الفاتورة السنوية المخفضة:",
      orderButton: "اطلب الآن",
      contactSales: "تواصل بالمبيعات",
      perfectFor: "مثالي لـ:",

      featsTitle: "بنية تحتية هندسية رائدة",
      featsSub: "جميع الخوادم لدينا مزودة بمكونات عتاد متكاملة وحزم تسريع سحابية ذكية تضمن تفوقك الرقمي.",
      feat1: "خادم الويب السريع LiteSpeed",
      feat1Desc: "مسرعات كاش ذكية توفر تصفح وتحميل أسرع بـ ٢٠ ضعفاً مقارنة بالسيرفرات المعتادة.",
      feat2: "شهادة أمان SSL مجانية",
      feat2Desc: "تشفير وحماية لكافة اتصالات زوار موقعك بشهادات Let's Encrypt آمنة.",
      feat3: "أقراص تخزين SSD NVMe",
      feat3Desc: "وحدات تخزين صلبة فائقة لضمان تلبية عمليات الاستعلام المعقدة عن البيانات كاستم بلمح البصر.",
      feat4: "النسخ الاحتياطي اليومي",
      feat4Desc: "حفظ وأرشفة ملفاتك وقواعد البيانات يومياً على خوادم سحابية خارجية لتأمين استقرار أعمالك.",
      feat5: "لوحة تحكم cPanel الشهيرة",
      feat5Desc: "إدارة كاملة لبريدك والملفات وقواعد البيانات وتثبيت السكريبتات بضغطة واحدة وبمرونة ممتازة.",
      feat6: "ارتباط ومسرع BDIX السريع",
      feat6Desc: "ربط فوري يمنح المستخدمين والزوار سرعات معالجة منخفضة اللاتنسي للغاية.",
      feat7: "معدل استقرار Uptime 99.9٪",
      feat7Desc: "عنصر تشغيل ومراقبة حيوي على مدار دقات الساعة مع ضمانات SLAs عتاد متكامل.",
      feat8: "دعم فني متخصص 24/7",
      feat8Desc: "توفر دائم لكبار خبراء السيرفرات وأنظمة التشغيل للمساعدة عبر تذاكر الدعم والواتساب والهاتف.",

      compHeading: "جدول المقارنة الفني للأداء",
      compSub: "جدول مقارنة شامل للخصائص التقنية والعتاد لتحديد الخيار الأمثل لبرمجياتك.",
      compStorage: "سعة المساحة SSD NVMe",
      compBandwidth: "ترافيك نقل البيانات شهرياً",
      compSSL: "نوع شهادة الأمان SSL",
      compEmails: "حسابات البريد المهني للموقع",
      compDatabases: "قواعد بيانات MySQL المسموحة",
      compSupport: "أولويات الدعم الفني للموقع",
      compBackups: "جدولة وأرشفة النسخ الاحتياطي",
      compUptime: "معدل استقرار الخادم المضمون",

      reviewsHeading: "ثقة مطلقة من المطورين والشركات",
      reviewsSub: "قصص نجاح وآراء كتبها عملاؤنا ممن وثقوا بنا لإطلاق وتثبيت خوادم تطبيقاتهم.",
      r1Author: "عمران شوذري",
      r1Role: "رئيس المطورين، وكالة دكا ديجيتال",
      r1Text: "اتصال BDIX مذهل بكل ما تحمله الكلمة من معنى. تفتح مواقع عملائنا وتعمل دون تفكير أو تأخير. استقرار ممتاز للخادم!",
      r2Author: "صديق الغامدي",
      r2Role: "المدير التقني، المجموعة الزراعية السعودية",
      r2Text: "الدعم الفني في ويب زون لا يعلى عليه. قمنا بنقل ومزامنة قواعد بيانات نظام إداري ضخم دون ثانية واحدة من التوقف. رائعون جداً!",
      r3Author: "مسعود زمان",
      r3Role: "مؤسس بوابات ومتجر ShopBD",
      r3Text: "اخترت الباقة ريسيلر لإدارة ما يزيد عن ٤٥ متجراً للووردبريس. لوحة WHM وعناوين الخوادم الخاصة تمنح علامتي استقرار واحترافية عالية.",

      faqHeading: "الأسئلة الشائعة والإجابات",
      faqSub: "تفاصيل متكاملة وإجابات حول نقل المواقع واستقرار الاستضافة وحجز النطاقات.",
      f1Q: "ما هي استضافة BDIX؟",
      f1A: "هي استضافة تتصل مباشرة بنقطة تبادل الإنترنت المحلية، مما يوفر استجابة فائقة السرعة تقل عن ٥ ملي ثانية للمستخدمين والزوار المحليين.",
      f2Q: "كيف يتم نقل موقعي الإلكتروني؟",
      f2A: "فريق النقل المتخصص لدينا يقوم بنقل موقعك بالكامل وملفاته والبرمجيات مجاناً وبضمان عدم توقف الموقع لثانية واحدة.",
      f3Q: "هل الاستضافة تشمل نسخاً احتياطياً؟",
      f3A: "نعم! جميع الباقات تتضمن نسخ احتياطي أسبوعي على خوادم خارجية، وتشمل خطط الأعمال حزم نسخ احتياطي يومي واستعادة فورية بضغطة زر.",
      f4Q: "هل يمكنني ترقية الباقة لاحقاً؟",
      f4A: "طبعاً! يمكنك ترقية وتوسيع موارد المعالج أو سعة الذاكرة والقرص السحابي في أي وقت وبشكل فوري وتلقائي ومن واجهة لوحتك مباشرة.",
      f5Q: "ما هي قنوات الدعم المتوفرة لديكم؟",
      f5A: "نوفر قنوات دعم هندسي متواجدة على مدار دقات الساعة تشمل نظام التذاكر البرمجية الفوري باللوحة، دعم الواتساب السريع، والاتصال المباشر.",

      needHelp: "هل تحتاج مساعدة لاختيار الخطة الأنسب؟",
      needHelpSub: "تواصل مع مستشاري الخوادم لتصميم وتهيئة بنية تحتية مخصصة تناسب حركة زوارك والبيئة البرمجية.",
      orderHosting: "اطلب الاستضافة فوراً",
    }
  };

  const currentTrans = t[language] || t.en;

  // Domain price definitions
  const domainExtensionsPrices: Record<string, number> = {
    '.com': 10.99,
    '.net': 14.99,
    '.org': 13.99,
    '.co': 19.99,
    '.com.bd': 10.25, // equivalent to BDT 1,200
    '.bd': 12.80     // equivalent to BDT 1,500
  };

  const packagesList = {
    bdix: [
      {
        id: "bdix-starter",
        name: "Starter Plan",
        nameBn: "স্টার্টার প্ল্যান",
        nameAr: "الخطة الأساسية Starter",
        price: 0.99,
        storage: "2GB NVMe SSD",
        badge: null,
        features: [
          language === 'bn' ? "১টি ওয়েবসাইট এবং আনলিমিটেড সাবডোমেইন" : language === 'ar' ? "موقع ويب واحد ونطاقات فرعية غير محدودة" : "Host 1 Website & Unlimited Subdomains",
          language === 'bn' ? "২ জিবি ফাস্ট এসএসডি স্টোরেজ" : language === 'ar' ? "مساحة ٢ جيجابايت فائقة NVMe" : "2GB NVMe SSD Storage",
          language === 'bn' ? "unlimited ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل بيانات وباندويث مفتوح" : "Unlimited Bandwidth",
          language === 'bn' ? "১০টি ইমেইল এড্রেস" : language === 'ar' ? "١٠ حسابات بريد مخصصة" : "10 Mailbox Accounts",
          language === 'bn' ? "৫টি মাইএসকিউএল ডাটাবেস" : language === 'ar' ? "٥ قواعد بيانات MySQL مخصصة" : "5 MySQL Databases",
          language === 'bn' ? "ফ্রি আনলিমিটেড SSL শীল্ড" : language === 'ar' ? "شهادة أمان SSL مجانية" : "Free SSL Certificates",
          language === 'bn' ? "লাইটস্পীড ওয়েব ক্যাশিং" : language === 'ar' ? "مسرعات الويب LiteSpeed" : "LiteSpeed Web Server",
          language === 'bn' ? "পেশাদার সিপ্যানেল সফটওয়্যার" : language === 'ar' ? "لوحة تحكم cPanel المتكاملة" : "cPanel Control Panels"
        ],
        perfectFor: [
          language === 'bn' ? "ব্যক্তিগত বা পোর্টফোলিও ওয়েবসাইট" : language === 'ar' ? "مناسب للمواقع الشخصية والمدونات" : "Personal Websites",
          language === 'bn' ? "পণ্য বিক্রির ল্যান্ডিং পেজ" : language === 'ar' ? "صفحات البيع والهبوط السريعة" : "Landing Pages"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/share-hosting"
      },
      {
        id: "bdix-business",
        name: "Business Plan",
        nameBn: "বিজনেস প্ল্যান",
        nameAr: "الخطة الاحترافية للشركات Business",
        price: 1.99,
        storage: "5GB NVMe SSD",
        badge: language === 'bn' ? "সবচেয়ে জনপ্রিয়" : language === 'ar' ? "الأكثر اختياراً" : "Most Popular",
        features: [
          language === 'bn' ? "১টি ওয়েবসাইট এবং আনলিমিটেড সাবডোমেইন" : language === 'ar' ? "موقع ويب واحد ونطاقات فرعية غير محدودة" : "Host 1 Website & Unlimited Subdomains",
          language === 'bn' ? "৫ জিবি আল্ট্রা ফাস্ট স্টোরেজ" : language === 'ar' ? "مساحة ٥ جيجابايت NVMe SSD" : "5GB NVMe SSD Storage",
          language === 'bn' ? "unlimited হাই-স্পিড ব্যান্ডউইথ" : language === 'ar' ? "ترافيك وباندويث غير محدود" : "Unlimited Bandwidth",
          language === 'bn' ? "৩০টি প্রফেশনাল মেইলবক্স" : language === 'ar' ? "٣٠ بريداً إلكترونياً رسمياً" : "30 Enterprise Email Boxes",
          language === 'bn' ? "১৫টি ডাটাবেস ডাটাপয়েন্ট" : language === 'ar' ? "١٥ قاعدة بيانات مخصصة" : "15 Databases Integration",
          language === 'bn' ? "ফ্রি লাইফটাইম ওয়াইল্ডকার্ড SSL" : language === 'ar' ? "شهادات أمان Let's Encrypt مجاناً" : "Lifetime Free Wildcard SSL",
          language === 'bn' ? "লাইটস্পীড ও সিপ্যানেল" : language === 'ar' ? "تثبيت فوري بضغطة واحدة" : "LiteSpeed Caching & cPanel",
          language === 'bn' ? "ডেইলি রিমোট ক্লাউড ব্যাকআপ" : language === 'ar' ? "نسخ احتياطي يومي آمن على كلاود" : "Daily Remote Cloud Backup"
        ],
        perfectFor: [
          language === 'bn' ? "পেশাদার করপোরেট ও বিজনেস সাইট" : language === 'ar' ? "المواقع التعريفية ومواقع الشركات" : "Business Websites",
          language === 'bn' ? "মাঝারি ব্লগ ও কন্টেন্ট পাবলিশার" : language === 'ar' ? "المدونات التفاعلية ومواقع المتاجر" : "Dynamic Blogs & Corporate"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/share-hosting"
      },
      {
        id: "bdix-professional",
        name: "Professional Plan",
        nameBn: "প্রফেশনাল প্ল্যান",
        nameAr: "باقة النخبة والمتاجر Professional",
        price: 2.99,
        storage: "10GB NVMe SSD",
        badge: language === 'bn' ? "সেরা পছন্দ" : language === 'ar' ? "أفضل قيمة" : "Best Value",
        features: [
          language === 'bn' ? "১টি ওয়েবসাইট এবং আনলিমিটেড সাবডোমেইন" : language === 'ar' ? "موقع ويب واحد ونطاقات فرعية غير محدودة" : "Host 1 Website & Unlimited Subdomains",
          language === 'bn' ? "১০ জিবি সুপারস্টোরেজ NVMe" : language === 'ar' ? "أقراص تخزين ١٠ جيجابايت NVMe SSD" : "10GB Premium NVMe Storage",
          language === 'bn' ? "unlimited রিয়েলটাইম ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل ترافيك وباندويث فائق" : "Unlimited Bandwidth",
          language === 'bn' ? "unlimited মেইলবক্স অ্যাড্রেস" : language === 'ar' ? "حسابات بريد إلكتروني غير محدودة" : "Unlimited Email Accounts",
          language === 'bn' ? "unlimited মাইএসকিউএল ডাটাবেস" : language === 'ar' ? "قواعد بيانات وأدوات غير محدودة" : "Unlimited MySQL Databases",
          language === 'bn' ? "ফ্রি ওয়াইল্ডকার্ড এসএসএল সার্টিফিকেট" : language === 'ar' ? "شهادات أمان وبادلوك لكل المواقع" : "Free Wildcard SSL Access",
          language === 'bn' ? "১০০% অপ্টিমাইজড গুগল এডসেন্স" : language === 'ar' ? "باقة مهيئة لخدمات جوجل أدسنس والمتاجر" : "Google AdSense & SEO Optimized",
          language === 'bn' ? "সার্বক্ষণিক অগ্রাধিকার ভিত্তিক বিশেষ সাপোর্ট" : language === 'ar' ? "دعم فني هندسي بريميوم ذو أولوية" : "Priority 24/7 VIP Support"
        ],
        perfectFor: [
          language === 'bn' ? "পূর্ণ মাত্রার ই-কমার্স বা শপ ওয়েবসাইট" : language === 'ar' ? "المتاجر الإلكترونية المتكاملة السريعة" : "Ecommerce Gateway Stores",
          language === 'bn' ? "অধিক ভিজিটর সমৃদ্ধ নিউজ পোর্টাল" : language === 'ar' ? "بوابات الأخبار والمنصات الكبرى" : "High Traffic Portals"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/share-hosting"
      }
    ],
    vps: [
      {
        id: "vps-starter",
        name: "VPS Starter Plan",
        nameBn: "ভিপিএস স্টার্টার প্ল্যান",
        nameAr: "خادم VPS المبتدئ السحابي",
        price: 14.99,
        storage: "50GB Enterprise NVMe SSD",
        badge: null,
        features: [
          language === 'bn' ? "১ কোর ডেডিকেটেড হাই-পারফরম্যান্স প্রসেসর" : language === 'ar' ? "معالج فوري ١ Core AMD EPYC" : "1 Core Dedicated AMD EPYC",
          language === 'bn' ? "২ জিবি ডেডিকেটেড র্যাম" : language === 'ar' ? "٢ جيجابايت ذاكرة عشوائية عالية الرام" : "2GB Dedicated DDR4 RAM",
          language === 'bn' ? "৫০ জিবি এন্টারপ্রাইজ NVMe এসএসডি" : language === 'ar' ? "٥٠ جيجابايت أقراص تخزين Enterprise" : "50GB Enterprise NVMe Storage",
          language === 'bn' ? "১ টেরাবাইট হাই-রুট ব্যান্ডউইথ" : language === 'ar' ? "باندويث ترافيك كامل ١ تيرابايت شهرياً" : "1TB Monthly Safe Bandwidth",
          language === 'bn' ? "১টি ইউনিক ডেডিকেটেড আইপি অ্যাড্রেস" : language === 'ar' ? "عنوان بروتوكول معزول ١ Dedicated IP" : "1 Unique Dedicated IPv4",
          language === 'bn' ? "১০০% রুট এক্সেস এবং ওপেন কনসোল" : language === 'ar' ? "صلاحيات جذر كاملة Root Access" : "Full OS Root Administrator SSH Access",
          language === 'bn' ? "উবুন্টু/ডেবিয়ান/সেন্টওএস রিমোট ওএস" : language === 'ar' ? "توافق كامل مع أنظمة لينكس المختلفة" : "OS installation (Ubuntu, Debian, CentOS)",
          language === 'bn' ? "২৪/৭ বিশেষ ম্যানেজড সার্ভার মনিটরিং" : language === 'ar' ? "مراقبة وإدارة الخادم بالكامل" : "Managed Server Node Setup Support"
        ],
        perfectFor: [
          language === 'bn' ? "ভারী বা জটিল কাস্টম ওয়েব অ্যাপ্লিকেশন" : language === 'ar' ? "تطبيقات الويب والأنظمة البرمجية كاستم" : "Custom Web Applications",
          language === 'bn' ? "পরীক্ষামূলক সার্ভার ডেভেলপমেন্ট নোড" : language === 'ar' ? "بيئات اختبار الأكواد وتطوير النظم" : "Testing & Dev Environments"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/vps"
      },
      {
        id: "vps-business",
        name: "VPS Business Plan",
        nameBn: "ভিপিএস বিজনেস প্ল্যান",
        nameAr: "خادم الأعمال السحابية VPS العالي",
        price: 29.99,
        storage: "100GB Enterprise NVMe SSD",
        badge: language === 'bn' ? "সবচেয়ে জনপ্রিয়" : language === 'ar' ? "الأكثر اختياراً" : "Most Popular",
        features: [
          language === 'bn' ? "২ কোর শক্তিশালী ডেডিকেটেড প্রসেসর" : language === 'ar' ? "معالج فائق ٢ Cores AMD EPYC" : "2 Cores Dedicated AMD EPYC",
          language === 'bn' ? "৪ জিবি দ্রুতগতির ডেডিকেটেড র্যাম" : language === 'ar' ? "٤ جيجابايت ذاكرة عشوائية عالية RAM" : "4GB Dedicated DDR4 RAM",
          language === 'bn' ? "১০০ জিবি আল্ট্রা-স্পিড এন্টারপ্রাইজ NVMe" : language === 'ar' ? "مساحة ضخمة ١٠٠ جيجابايت NVMe" : "100GB Enterprise NVMe SSD",
          language === 'bn' ? "২ টেরাবাইট ফাস্ট মান্থলি ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل ترافيك شهري ضخم ٢ تيرابايت" : "2TB Monthly Bandwidth Scale",
          language === 'bn' ? "২টি সম্পূর্ণ ইউনিক ডেডিকেটেড আইপি" : language === 'ar' ? "عنوانين بروتوكول معزولين ٢ IPs" : "2 Dedicated IPv4 Allocations",
          language === 'bn' ? "রুট এক্সেস, ওপেন পোর্টস ও ডাটা শিল্ড" : language === 'ar' ? "صلاحيات جذر كاملة وجدران إطفاء نيم" : "Full OS Root Access & Firewall Configs",
          language === 'bn' ? "ফ্রি সাইবার প্যানেল / হেষ্টিয়া কন্ট্রোল প্যানেল" : language === 'ar' ? "تثبيت لوحات فري CyberPanel/Hestia" : "Free Web Control Panels Pre-installed",
          language === 'bn' ? "নিরাপদ ভার্চুয়ালাইজেশন KVM আর্কিটেকচার" : language === 'ar' ? "أنظمة عزل فائقة ببيئة KVM الافتراضية" : "Secure Virtualization (KVM Hypervisor)"
        ],
        perfectFor: [
          language === 'bn' ? "উচ্চ ভিজিটর সমৃদ্ধ বাণিজ্যিক স্টোর" : language === 'ar' ? "متاجر التجارة الإلكترونية عالية النشاط" : "High-Density E-commerce Stores",
          language === 'bn' ? "কর্পোরেট ইআরপি এবং সিআরএম সফটওয়্যার" : language === 'ar' ? "أنظمة إدارة الأعمال المركزية POS & CRM" : "Database & SaaS API engines"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/vps"
      },
      {
        id: "vps-professional",
        name: "VPS Pro Plan",
        nameBn: "ভিপিএস প্রো প্ল্যান",
        nameAr: "خادم المحترفين السحابي VPS Pro",
        price: 49.99,
        storage: "200GB Enterprise NVMe SSD",
        badge: language === 'bn' ? "সর্বোচ্চ ক্ষমতা" : language === 'ar' ? "الأداء الأقصى" : "Maximum Power",
        features: [
          language === 'bn' ? "৪ কোর শক্তিশালী ডেডিকেটেড প্রসেসর" : language === 'ar' ? "معالج فائق ٤ Cores AMD EPYC" : "4 Cores Dedicated AMD EPYC",
          language === 'bn' ? "৮ জিবি দ্রুতগতির ডেডিকেটেড র্যাম" : language === 'ar' ? "٨ جيجابايت ذاكرة عشوائية عالية RAM" : "8GB Dedicated DDR4 RAM",
          language === 'bn' ? "২০০ জিবি আল্ট্রা-স্পিড এন্টারপ্রাইজ NVMe" : language === 'ar' ? "مساحة ضخمة ٢٠٠ جيجابايت NVMe" : "200GB Enterprise NVMe SSD",
          language === 'bn' ? "৪ টেরাবাইট ফাস্ট মান্থলি ব্যান্ডউইথ" : language === 'ar' ? "معدل نقل ترافيك شهري ضخم ٤ تيرابايت" : "4TB Monthly Bandwidth Scale",
          language === 'bn' ? "৩টি সম্পূর্ণ ইউনিক ডেডিকেটেড আইপি" : language === 'ar' ? "ثلاث عناوين بروتوكول معزولة ٣ IPs" : "3 Dedicated IPv4 Allocations",
          language === 'bn' ? "রুট এক্সেস, ওপেন পোর্টস ও ডাটা শিল্ড" : language === 'ar' ? "صلاحيات جذر كاملة وجدران إطفاء نيم" : "Full OS Root Access & Firewall Configs",
          language === 'bn' ? "ফ্রি সাইপার প্যানেল বা সিপ্যানেল সফটওয়্যার" : language === 'ar' ? "لوحات حرة مع إمكانية تثبيت لوحة تحكم" : "Free Web Control Panels Pre-installed",
          language === 'bn' ? "নিরাপদ ভার্চুয়ালাইজেশন KVM আর্কিটেকচার" : language === 'ar' ? "أنظمة عزل فائقة ببيئة KVM الافتراضية" : "Secure Virtualization (KVM Hypervisor)"
        ],
        perfectFor: [
          language === 'bn' ? "বৃহৎ নিউজ পোর্টাল এবং মিডিয়া সাইট" : language === 'ar' ? "بوابات الأخبار الكبرى والشبكات التفاعلية" : "High Traffic Portals & Network Hubs",
          language === 'bn' ? "হাই-ডিমান্ড কাস্টম SaaS ব্যাকএন্ড ইঞ্জিন" : language === 'ar' ? "محركات الأكواد ومواقع الخدمات البرمجية SaaS" : "SaaS Applications & heavy SQL engines"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/vps"
      }
    ],
    reseller: [
      {
        id: "reseller-10g",
        name: "10 GB NVMe Reseller",
        nameBn: "১০ জিবি এনভিএমই রিসেলার",
        nameAr: "موزع 10 جيجابايت NVMe SSD",
        price: 8.99,
        storage: "10GB NVMe SSD",
        badge: null,
        features: [
          language === 'bn' ? "১০টি cPanel অ্যাকাউন্ট" : "10 cPanel Accounts Managed",
          language === 'bn' ? "১০০% পিউর NVMe SSD স্টোরেজ" : "100% Pure NVMe SSD Storage",
          language === 'bn' ? "ফ্রি WHM + SSL + ব্যাকআপ সুবিধা" : "Free WHM + SSL + Automated Backup",
          language === 'bn' ? "১০০% হোয়াইট লেবেল (কাস্টম নেমসার্ভার)" : "100% White-Label Custom Nameservers",
          language === 'bn' ? "লোকাল বিডিআইএক্স কানেক্টিভিটি" : "Super-fast BDIX Connectivity",
          language === 'bn' ? "২৪/৭ ইনস্ট্যান্ট টেকনিক্যাল সাপোর্ট" : "24/7 Instant Technical Support"
        ],
        perfectFor: [
          language === 'bn' ? "ক্ষুদ্র ওয়েব এজেন্সি বা আইটি প্রতিষ্ঠান" : "Aspiring Web Hosting Brands",
          language === 'bn' ? "অল্প কিছু ক্লায়েন্ট সাইট নিরাপদ রাখার কাজে" : "Custom Multi-site Hubs"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/reseller-hosting"
      },
      {
        id: "reseller-20g",
        name: "30 GB NVMe Reseller",
        nameBn: "৩০ জিবি এনভিএমই রিসেলার",
        nameAr: "موزع 30 جيجابايت NVMe SSD",
        price: 17.99,
        storage: "30GB NVMe SSD",
        badge: language === 'bn' ? "সবচেয়ে জনপ্রিয়" : "Most Popular",
        features: [
          language === 'bn' ? "২৫-৩০টি cPanel অ্যাকাউন্ট" : "25-30 cPanel Accounts",
          language === 'bn' ? "৩০ জিবি পিউর NVMe SSD স্টোরেজ" : "30GB Pure NVMe SSD Storage",
          language === 'bn' ? "ডেডিকেটেড ফুল রিসোর্স পুল" : "Dedicated Server Resource Pool",
          language === 'bn' ? "অত্যন্ত দ্রুত লাইটস্পিড ওয়েব সার্ভার" : "LiteSpeed Web Server Integration",
          language === 'bn' ? "হোয়াইট-লেবেল ব্রান্ডিং রি-সেল সেলস" : "White-Label Brandings & Controls",
          language === 'bn' ? "WHM প্যানেল এডমিন এক্সেস সুবিধা" : "Full WHM Central Reseller Panel"
        ],
        perfectFor: [
          language === 'bn' ? "মাঝারি আইটি কনসালটেন্সি ও এজেন্সি" : "Growing IT & Web Solutions Teams",
          language === 'bn' ? "পেশাদার ফ্রিল্যান্সার বা ওয়েব ডেভেলপার" : "Modern Freelancers & Agencies"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/reseller-hosting"
      },
      {
        id: "reseller-50g",
        name: "50 GB NVMe Reseller",
        nameBn: "৫০ জিবি এনভিএমই রিসেলার",
        nameAr: "موزع 50 جيجابايت NVMe SSD",
        price: 24.99,
        storage: "50GB NVMe SSD",
        badge: language === 'bn' ? "সেরা পছন্দ" : "Best Value",
        features: [
          language === 'bn' ? "৪০-৫০টি cPanel অ্যাকাউন্ট" : "40-50 cPanel Accounts Allowed",
          language === 'bn' ? "৫০ জিবি এন্টারপ্রাইজ NVMe স্টোরেজ" : "50GB Enterprise NVMe SSD Storage",
          language === 'bn' ? "আল্ট্রা-ব্যান্ডউইথ আনক্যাপড প্ল্যান" : "Ultra-Bandwidth Uncapped Plan",
          language === 'bn' ? "এক্সপার্ট এজেন্সি আনলিমিটেড চয়েস" : "Expert Agency Premium Choice",
          language === 'bn' ? "কাস্টম নেমসার্ভার ও হোয়াইট লেবেল" : "Whitelabel Name Servers & Branding",
          language === 'bn' ? "রিসেলার এক্সক্লুসিভ বেনিফিটস সিংক" : "Reseller Exclusive Central Benefits"
        ],
        perfectFor: [
          language === 'bn' ? "প্রতিষ্ঠিত কাস্টম সফটওয়্যার কোম্পানি" : "Full-Scale Software & IT Companies",
          language === 'bn' ? "বৃহৎ ফ্রিল্যান্সিং টিম বা ডেভেলপমেন্ট গুরু" : "Professional Hosting Resellers"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/reseller-hosting"
      }
    ],
    cloud: [
      {
        id: "cloud-starter",
        name: "Starter Cloud",
        nameBn: "স্টার্টার ক্লাউড",
        nameAr: "الاستضافة السحابية للمبتدئين Starter Cloud",
        price: 8.43,
        storage: "5 GB NVMe Disk",
        badge: null,
        features: [
          language === 'bn' ? "বার্ষিক ক্রয়ে ফ্রি .XYZ, .SHOP, .MY.ID ডোমেইন" : language === 'ar' ? "دومين .XYZ, .SHOP, .MY.ID مجاني عند الاشتراك السنوي" : "Free .XYZ, .SHOP, .MY.ID on Annual Purchase",
          language === 'bn' ? "৫ জিবি এনভিএমই ডিস্ক স্টোরেজ" : language === 'ar' ? "مساحة 5 GB NVMe Disk" : "5 GB NVMe Disk Storage",
          language === 'bn' ? "২টি অ্যাডঅন ডোমেইন" : language === 'ar' ? "2 دومين إضافي Addon Domains" : "2 Addon Domains",
          language === 'bn' ? "১০০ জিবি হাই-স্পিড ব্যান্ডউইথ" : language === 'ar' ? "100 GB Bandwidth" : "100 GB Bandwidth",
          language === 'bn' ? "আনলিমিটেড সাব ডোমেইন" : language === 'ar' ? "نطاقات فرعية غير محدودة" : "Unlimited Sub Domains",
          language === 'bn' ? "আনলিমিটেড মাইএসকিউএল ডাটাবেস" : language === 'ar' ? "قواعد بيانات غير محدودة" : "Unlimited Databases",
          language === 'bn' ? "আনলিমিটেড ইমেইল অ্যাকাউন্ট" : language === 'ar' ? "حسابات بريد غير محدودة" : "Unlimited Email Accounts",
          language === 'bn' ? "লাইফটাইম ফ্রি এসএসএল সার্টিফিকেট" : language === 'ar' ? "شهادات SSL مجانية مدى الحياة" : "Lifetime Free SSL Certificates",
          language === 'bn' ? "৯৯.৯% গ্যারান্টিযুক্ত আপটাইম" : language === 'ar' ? "ضمان تشغيل 99.9% Uptime" : "99.9% Guaranteed Uptime",
          language === 'bn' ? "এফটিপি এবং এসএফটিপি সাপোর্ট" : language === 'ar' ? "دعم FTP & SFTP" : "FTP & SFTP Support",
          language === 'bn' ? "ওয়ার্ডপ্রেস অপটিমাইজড ইঞ্জিন" : language === 'ar' ? "تحسين كلي للووردبريس" : "WordPress Optimized",
          language === 'bn' ? "লেটেস্ট সিপ্যানেল কন্ট্রোল প্যানেল" : language === 'ar' ? "أحدث لوحة تحكم cPanel" : "Latest cPanel Control Panel",
          language === 'bn' ? "লাইটস্পীড ওয়েব সার্ভার" : language === 'ar' ? "خادم LiteSpeed فائق السرعة" : "Litespeed Web Server",
          language === 'bn' ? "ক্লাউডলিনাক্স পিএইচপি সিলেক্টর" : language === 'ar' ? "محدد PHP Cloudlinux" : "Cloudlinux PHP Selector",
          language === 'bn' ? "সফটাকুলার ১-ক্লিক অ্যাপস ইনস্টলার" : language === 'ar' ? "تثبيت التطبيقات Softaculous" : "Softaculous Apps Installer",
          language === 'bn' ? "ইমিউনিফাই ৩৬০ সিকিউরিটি প্রটেকশন" : language === 'ar' ? "حماية Imunify 360 Security" : "Imunify 360 Security",
          language === 'bn' ? "এডভান্সড ডিডিওএস প্রোটেকশন" : language === 'ar' ? "حماية تقدمية من هجمات DDoS" : "DDoS Protection",
          language === 'bn' ? "ওনড ও সেলফ-ম্যানেজড ইনফ্রাস্ট্রাকচার" : language === 'ar' ? "بنية تحتية مملوكة بالكامل" : "Owned Infrastructure",
          language === 'bn' ? "পাইথন, নোড.জেএস এবং রুবি সাপোর্টেড" : language === 'ar' ? "دعم Python, Node.js, Ruby" : "Python, Node.js, Ruby Supported",
          language === 'bn' ? "ফ্রি ওয়েবসাইট মাইগ্রেশন সার্ভিস" : language === 'ar' ? "نقل المواقع مجاناً" : "Free Website Migration",
          language === 'bn' ? "২৪/৭ প্রিমিয়াম সাপোর্ট সিস্টেম" : language === 'ar' ? "نظام دعم فني مميز" : "Premium Support System",
          language === 'bn' ? "৩ দিনের মানি ব্যাক গ্যারান্টি" : language === 'ar' ? "ضمان استعادة الأموال خلال 3 أيام" : "3 Days Money Back Guarantee"
        ],
        perfectFor: [
          language === 'bn' ? "স্টার্টআপ ও নতুন প্রজেক্ট" : "Startups & New Projects",
          language === 'bn' ? "পার্সোনাল ও বিজনেস পোর্টফোলিও" : "Personal & Business Portfolios"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/cloud-hosting"
      },
      {
        id: "cloud-business",
        name: "Small Business Cloud",
        nameBn: "স্মল বিজনেস ক্লাউড",
        nameAr: "الاستضافة السحابية للأعمال الصغيرة Small Business Cloud",
        price: 16.87,
        storage: "10 GB NVMe Disk",
        badge: language === 'bn' ? "সবচেয়ে জনপ্রিয় 🔥" : language === 'ar' ? "الأكثر شعبية 🔥" : "Most Popular 🔥",
        features: [
          language === 'bn' ? "বার্ষিক ক্রয়ে ফ্রি .XYZ, .SHOP, .MY.ID ডোমেইন" : language === 'ar' ? "دومين .XYZ, .SHOP, .MY.ID مجاني عند الاشتراك السنوي" : "Free .XYZ, .SHOP, .MY.ID on Annual Purchase",
          language === 'bn' ? "১০ জিবি এনভিএমই ডিস্ক স্টোরেজ" : language === 'ar' ? "مساحة 10 GB NVMe Disk" : "10 GB NVMe Disk Storage",
          language === 'bn' ? "৫টি অ্যাডঅন ডোমেইন" : language === 'ar' ? "5 دومين إضافي Addon Domains" : "5 Addon Domains",
          language === 'bn' ? "আনলিমিটেড হাই-স্পিড ব্যান্ডউইথ" : language === 'ar' ? "باندويث غير محدود Unlimited Bandwidth" : "Unlimited Bandwidth",
          language === 'bn' ? "আনলিমিটেড সাব ডোমেইন" : language === 'ar' ? "نطاقات فرعية غير محدودة" : "Unlimited Sub Domains",
          language === 'bn' ? "আনলিমিটেড মাইএসকিউএল ডাটাবেস" : language === 'ar' ? "قواعد بيانات غير محدودة" : "Unlimited Databases",
          language === 'bn' ? "আনলিমিটেড ইমেইল অ্যাকাউন্ট" : language === 'ar' ? "حسابات بريد غير محدودة" : "Unlimited Email Accounts",
          language === 'bn' ? "লাইফটাইম ফ্রি এসএসএল সার্টিফিকেট" : language === 'ar' ? "شهادات SSL مجانية مدى الحياة" : "Lifetime Free SSL Certificates",
          language === 'bn' ? "৯৯.৯% গ্যারান্টিযুক্ত আপটাইম" : language === 'ar' ? "ضمان تشغيل 99.9% Uptime" : "99.9% Guaranteed Uptime",
          language === 'bn' ? "এফটিপি এবং এসএফটিপি সাপোর্ট" : language === 'ar' ? "دعم FTP & SFTP" : "FTP & SFTP Support",
          language === 'bn' ? "ওয়ার্ডপ্রেস অপটিমাইজড ইঞ্জিন" : language === 'ar' ? "تحسين كلي للووردبريس" : "WordPress Optimized",
          language === 'bn' ? "লেটেস্ট সিপ্যানেল কন্ট্রোল প্যানেল" : language === 'ar' ? "أحدث لوحة تحكم cPanel" : "Latest cPanel Control Panel",
          language === 'bn' ? "লাইটস্পীড ওয়েব সার্ভার" : language === 'ar' ? "خادم LiteSpeed فائق السرعة" : "Litespeed Web Server",
          language === 'bn' ? "ক্লাউডলিনাক্স পিএইচপি সিলেক্টর" : language === 'ar' ? "محدد PHP Cloudlinux" : "Cloudlinux PHP Selector",
          language === 'bn' ? "সফটাকুলার ১-ক্লিক অ্যাপস ইনস্টলার" : language === 'ar' ? "تثبيت التطبيقات Softaculous" : "Softaculous Apps Installer",
          language === 'bn' ? "ইমিউনিফাই ৩৬০ সিকিউরিটি প্রটেকশন" : language === 'ar' ? "حماية Imunify 360 Security" : "Imunify 360 Security",
          language === 'bn' ? "এডভান্সড ডিডিওএস প্রোটেকশন" : language === 'ar' ? "حماية تقدمية من هجمات DDoS" : "DDoS Protection",
          language === 'bn' ? "ডেইলি অটোমেটিক ক্লাউড ব্যাকআপ" : language === 'ar' ? "نسخ احتياطي يومي آلي Daily Automatic Backups" : "Daily Automatic Backups",
          language === 'bn' ? "ওনড ও সেলফ-ম্যানেজড ইনফ্রাস্ট্রাকচার" : language === 'ar' ? "بنية تحتية مملوكة بالكامل" : "Owned Infrastructure",
          language === 'bn' ? "পাইথন, নোড.জেএস এবং রুবি সাপোর্টেড" : language === 'ar' ? "دعم Python, Node.js, Ruby" : "Python, Node.js, Ruby Supported",
          language === 'bn' ? "ফ্রি ওয়েবসাইট মাইগ্রেশন সার্ভিস" : language === 'ar' ? "نقل المواقع مجاناً" : "Free Website Migration",
          language === 'bn' ? "২৪/৭ প্রিমিয়াম সাপোর্ট সিস্টেম" : language === 'ar' ? "نظام دعم فني مميز" : "Premium Support System",
          language === 'bn' ? "৩ দিনের মানি ব্যাক গ্যারান্টি" : language === 'ar' ? "ضمان استعادة الأموال خلال 3 أيام" : "3 Days Money Back Guarantee"
        ],
        perfectFor: [
          language === 'bn' ? "গ্রোইং বিজনেস ও ই-কমার্স স্টোর" : "Growing Businesses & Ecommerce",
          language === 'bn' ? "হাই-ট্রাফিক পোর্টাল ও কর্পোরেট ওয়েবসাইট" : "High-Traffic Portals & Websites"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/cloud-hosting"
      },
      {
        id: "cloud-vps",
        name: "Business Cloud VPS",
        nameBn: "বিজনেস ক্লাউড ভিপিএস",
        nameAr: "خادم الأعمال السحابية Business Cloud VPS",
        price: 33.75,
        storage: "30 GB NVMe Disk",
        buttonText: language === 'bn' ? "বিজনেস শুরু করুন" : language === 'ar' ? "ابدأ الأعمال الآن" : "Start Business",
        badge: language === 'bn' ? "হাই পারফরম্যান্স 🚀" : language === 'ar' ? "أداء فائق 🚀" : "High Performance 🚀",
        features: [
          language === 'bn' ? "বার্ষিক ক্রয়ে ফ্রি .XYZ, .SHOP, .MY.ID ডোমেইন" : language === 'ar' ? "دومين .XYZ, .SHOP, .MY.ID مجاني عند الاشتراك السنوي" : "Free .XYZ, .SHOP, .MY.ID on Annual Purchase",
          language === 'bn' ? "৩০ জিবি এনভিএমই ডিস্ক স্টোরেজ" : language === 'ar' ? "مساحة 30 GB NVMe Disk" : "30 GB NVMe Disk Storage",
          language === 'bn' ? "৫টি অ্যাডঅন ডোমেইন" : language === 'ar' ? "5 دومين إضافي Addon Domains" : "5 Addon Domains",
          language === 'bn' ? "আনলিমিটেড হাই-স্পিড ব্যান্ডউইথ" : language === 'ar' ? "باندويث غير محدود Unlimited Bandwidth" : "Unlimited Bandwidth",
          language === 'bn' ? "আনলিমিটেড সাব ডোমেইন" : language === 'ar' ? "نطاقات فرعية غير محدودة" : "Unlimited Sub Domains",
          language === 'bn' ? "আনলিমিটেড মাইএসকিউএল ডাটাবেস" : language === 'ar' ? "قواعد بيانات غير محدودة" : "Unlimited Databases",
          language === 'bn' ? "আনলিমিটেড ইমেইল অ্যাকাউন্ট" : language === 'ar' ? "حسابات بريد غير محدودة" : "Unlimited Email Accounts",
          language === 'bn' ? "লাইফটাইম ফ্রি এসএসএল সার্টিফিকেট" : language === 'ar' ? "شهادات SSL مجانية مدى الحياة" : "Lifetime Free SSL Certificates",
          language === 'bn' ? "৯৯.৯% গ্যারান্টিযুক্ত আপটাইম" : language === 'ar' ? "ضمان تشغيل 99.9% Uptime" : "99.9% Guaranteed Uptime",
          language === 'bn' ? "এফটিপি এবং এসএফটিপি সাপোর্ট" : language === 'ar' ? "دعم FTP & SFTP" : "FTP & SFTP Support",
          language === 'bn' ? "ওয়ার্ডপ্রেস অপটিমাইজড ইঞ্জিন" : language === 'ar' ? "تحسين كلي للووردبرিস" : "WordPress Optimized",
          language === 'bn' ? "লেটেস্ট সিপ্যানেল কন্ট্রোল প্যানেল" : language === 'ar' ? "أحدث لوحة تحكم cPanel" : "Latest cPanel Control Panel",
          language === 'bn' ? "লাইটস্পীড ওয়েব সার্ভার" : language === 'ar' ? "خادم LiteSpeed فائق السرعة" : "Litespeed Web Server",
          language === 'bn' ? "ক্লাউডলিনাক্স পিএইচপি সিলেক্টর" : language === 'ar' ? "محدد PHP Cloudlinux" : "Cloudlinux PHP Selector",
          language === 'bn' ? "সফটাকুলার ১-ক্লিক অ্যাপস ইনস্টলার" : language === 'ar' ? "تثبيت التطبيقات Softaculous" : "Softaculous Apps Installer",
          language === 'bn' ? "ইমিউনিফাই ৩৬০ সিকিউরিটি প্রটেকশন" : language === 'ar' ? "حماية Imunify 360 Security" : "Imunify 360 Security",
          language === 'bn' ? "এডভান্সড ডিডিওএস প্রোটেকশন" : language === 'ar' ? "حماية تقدمية من هجمات DDoS" : "DDoS Protection",
          language === 'bn' ? "ডেইলি অটোমেটিক ক্লাউড ব্যাকআপ" : language === 'ar' ? "نسخ احتياطي يومي آلي Daily Automatic Backups" : "Daily Automatic Backups",
          language === 'bn' ? "ওনড ও সেলফ-ম্যানেজড ইনফ্রাস্ট্রাকচার" : language === 'ar' ? "بنية تحتية مملوكة بالكامل" : "Owned Infrastructure",
          language === 'bn' ? "পাইথন, নোড.জেএস এবং রুবি সাপোর্টেড" : language === 'ar' ? "دعم Python, Node.js, Ruby" : "Python, Node.js, Ruby Supported",
          language === 'bn' ? "ফ্রি ওয়েবসাইট মাইগ্রেশন সার্ভিস" : language === 'ar' ? "نقل المواقع مجاناً" : "Free Website Migration",
          language === 'bn' ? "২৪/৭ প্রিমিয়াম সাপোর্ট সিস্টেম" : language === 'ar' ? "نظام دعم فني مميز" : "Premium Support System",
          language === 'bn' ? "৩ দিনের মানি ব্যাক গ্যারান্টি" : language === 'ar' ? "ضمان استعادة الأموال خلال 3 أيام" : "3 Days Money Back Guarantee"
        ],
        perfectFor: [
          language === 'bn' ? "বড় ই-কমার্স প্ল্যাটফর্ম ও এজেন্সি" : "Enterprise Ecommerce & Agencies",
          language === 'bn' ? "উচ্চ ক্ষমতাসম্পন্ন কাস্টম ওয়েব অ্যাপস" : "High-Demand Custom Web Applications"
        ],
        url: "https://host.webzonebd.com/index.php?rp=/store/cloud-hosting"
      }
    ]
  };

  const handleSupportInquiry = (msgType: 'sales' | 'whatsapp') => {
    const defaultMsg = language === 'bn' 
      ? 'আসসালামু আলাইকুম WebzoneBD, আমি আপনাদের কাস্টম হোস্টিং সার্ভিস সম্পর্কে জানতে এবং পরামর্শ নিতে আগ্রহী।' 
      : language === 'ar' 
      ? 'السلام عليكم ويب زون، أود الحصول على مشورة بخصوص خطط الاستضافة المخصصة لمشروعي.' 
      : 'Hello WebzoneBD, I need a custom recommendation choosing the right hosting plan for my business application.';
    
    if (msgType === 'sales') {
      window.open(`https://host.webzonebd.com/contact.php?text=${encodeURIComponent(defaultMsg)}`, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://wa.me/966570511931?text=${encodeURIComponent(defaultMsg)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleExternalNav = (url: string) => {
    const divider = url.includes('?') ? '&' : '?';
    const finalUrl = `${url}${divider}currency=${currency}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  // Migration Guide simulator and interaction handlers
  const handleStartSimulation = () => {
    if (wizardSimState === 'running') return;
    setWizardSimState('running');
    setWizardSimProgress(0);
    setWizardSimLogs([]);

    const steps = [
      {
        progress: 15,
        status: language === 'bn' ? 'আগের হোস্টিং প্রোভাইডারের সার্ভারের সাথে নিরাপদ কানেকশন স্থাপন করা হচ্ছে...' 
                : language === 'ar' ? 'جاري الاتصال بالسيرفر للمستضيف القديم وتأمين الاتصال السحابي...' 
                : 'Establishing secure handshake connection with current hosting provider...',
        log: language === 'bn' ? '✓ কানেকশন সাকসেসফুল। পিং রেট: ৪৫ মিলি সেকেন্ড।' 
             : language === 'ar' ? '✓ تم إقامة الاتصال الهيكلي بنجاح. وقت الاستجابة: 45ms' 
             : '✓ Handshake established successfully. Ping Latency: 45ms'
      },
      {
        progress: 40,
        status: language === 'bn' ? 'পুরো সিপ্যানেল ফাইল এবং ডাটাবেস ব্যাকআপ তৈরি করা হচ্ছে...' 
                : language === 'ar' ? 'جاري تجميع وضغط ملفات الموقع وقواعد البيانات بصيغة cPanel تار...' 
                : 'Packaging files & compressing MySQL databases into a secure cPanel backup standard archive...',
        log: language === 'bn' ? '✓ ব্যাকআপ আর্কাইভ তৈরি শেষ। সাইজ: ১২৪ মেগাবাইট।' 
             : language === 'ar' ? '✓ تم إنشاء حزمة الأرشيف بالكامل. المساحة المستخرجة: 124MB' 
             : '✓ Archive packaged. Detected size: 124MB cPanel tarball.'
      },
      {
        progress: 65,
        status: language === 'bn' ? 'ওয়েবজোনবিডি আল্ট্রা-স্পিড ঢাকা বিডিআইএক্স উডলিংকের মাধ্যমে ফাইল ট্রান্সফার করা হচ্ছে...' 
                : language === 'ar' ? 'جاري نقل الملفات عبر منفذ الربط السحابي لـ WebzoneBD بمعدل فائق...' 
                : 'Transporting data block via secure WebzoneBD high-speed BDIX pipeline link...',
        log: language === 'bn' ? '✓ ট্রান্সফার কমপ্লিট। গড় স্পিড: ৬.৫ এমবি/সেকেন্ড।' 
             : language === 'ar' ? '✓ اكتملت عملية النقل الآمن للمقر الجديد. معدل السرعة: 6.5 MB/s' 
             : '✓ Data transmitted. Dynamic speed: 6.5 MB/s uplink burst.'
      },
      {
        progress: 85,
        status: language === 'bn' ? 'লাইটস্পিড সার্ভারে ফাইল কুয়েরি এক্সট্রাক্ট করা হচ্ছে ও পিএইচপি মেমোরি এডজাস্ট করা হচ্ছে...' 
                : language === 'ar' ? 'جاري فك الضغط على خادم LiteSpeed ومطابقة روابط قواعد البيانات للووردبريس...' 
                : 'Extracting file tree onto LiteSpeed system nodes & matching database credentials...',
        log: language === 'bn' ? '✓ ডেটাবেস কানেকশন রিকনফিগার করা শেষ।' 
             : language === 'ar' ? '✓ تم فك الضغط ومطابقة wp-config لتفادي مشاكل الأخطاء بالكامل' 
             : '✓ Database credentials successfully re-mapped and wp-config matches confirmed.'
      },
      {
        progress: 100,
        status: language === 'bn' ? 'স্বয়ংক্রিয় ক্লাউড সিকিউরিটি স্ক্যান এবং লেটস এনক্রিপ্ট এসএসএল ইস্যু করা হচ্ছে...' 
                : language === 'ar' ? 'جاري إجراء الفحص بالحصن الأمني Imunify360 وإصدار شهادةLet\'s Encrypt SSL مجاناً...' 
                : 'Running custom Imunify360 scan & issuing Let\'s Encrypt TLS protection...',
        log: language === 'bn' ? '✓ অভিনন্দন! কোনো ম্যালওয়্যার পাওয়া যায়নি। এসএসএল সিকিউর শীল্ড একটিভ হয়েছে!' 
             : language === 'ar' ? '✓ رائع جداً! لم يتم العثور على برمجيات ضارة وتم تفعيل تشفير SSL وبادلوك الحماية!' 
             : '✓ Completed! Imunify350 scan: 0 threats. Free Let\'s Encrypt SSL active.'
      }
    ];

    let currentStepIdx = 0;
    
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const item = steps[currentStepIdx];
        setWizardSimProgress(item.progress);
        setWizardSimStatus(item.status);
        setWizardSimLogs(prev => [...prev, item.log]);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setWizardSimState('completed');
      }
    }, 1200);
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setWizardFileSelected(file.name);
    setWizardFileUploading(true);
    setWizardFileProgress(0);

    const interval = setInterval(() => {
      setWizardFileProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setWizardFileUploading(false);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleDummyDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setWizardFileSelected("backup_site_archive.tar.gz");
    setWizardFileUploading(true);
    setWizardFileProgress(0);

    const interval = setInterval(() => {
      setWizardFileProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setWizardFileUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleToggleChecklist = (key: string) => {
    setWizardChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Perform a simulated domain lookup inside Hosting page
  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanVal = domainQuery.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!cleanVal) return;

    setIsSearching(true);
    setHasSearched(false);

    setTimeout(() => {
      let domainName = cleanVal;
      let extensionUsed = selectedExt;

      const extMatch = cleanVal.match(/(\.[a-z]{2,3}(\.[a-z]{2})?)$/);
      if (extMatch) {
         extensionUsed = extMatch[1];
         domainName = cleanVal.substring(0, cleanVal.length - extensionUsed.length);
      }

      if (domainName.replace(/[^a-z0-9-]/g, '') === '') {
        setIsSearching(false);
        return;
      }

      setSearchedName(`${domainName}${extensionUsed}`);

      const takenDomainsList = [
        'google', 'facebook', 'youtube', 'github', 'microsoft', 'netflix', 'amazon', 
        'webzone', 'webzonebd', 'saudi', 'it', 'solution', 'hosting', 'bd'
      ];

      const isTaken = takenDomainsList.includes(domainName) || domainName.length < 3;
      const isPremium = domainName.length <= 4 && !isTaken;

      const baseExtPrice = domainExtensionsPrices[extensionUsed] || 11.99;
      const finalPrice = isPremium ? baseExtPrice * 8.5 : baseExtPrice;

      setDomainResult({
        domain: `${domainName}${extensionUsed}`,
        isAvailable: !isTaken,
        isPremium,
        priceUSD: finalPrice
      });

      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  // Add search domain directly to cart
  const handleRegisterDomainItem = (domain: string, priceUSD: number) => {
    if (!addToCart) return;

    const virtualProduct: Product = {
      id: `domain-registration-${domain.replace(/\./g, '-')}-${Date.now()}`,
      name: `Domain: ${domain} (1 Year Registration)`,
      nameBn: `ডোমেন: ${domain} (১ বছরের রেজিস্ট্রেশন)`,
      nameAr: `النطاق: ${domain} (حجز لمدة سنة واحدة)`,
      category: 'source',
      price: Math.round(priceUSD),
      discountPrice: Math.round(priceUSD),
      rating: 5.0,
      reviewsCount: 1,
      description: `Domain name registration for ${domain} featuring premium secure DNS protection and WHOIS Privacy control.`,
      descriptionBn: `${domain} ডোমেন ক্রয়ের জন্য প্রিমিয়াম সিকিউর ডিএনএস কন্ট্রোল ও হু-ইজ প্রাইভেসি সেবা।`,
      descriptionAr: `تأمين تسجيل نطاق ${domain} شامل لوحة تحكم كاملة بالنطاق والـ DNS وحماية الخصوصية المطلقة.`,
      features: [
        "Instant DNS Propagation",
        "Free WHOIS privacy shielding",
        "2 DNSSEC signatures included",
        "No hidden setup charges"
      ],
      featuresBn: [
        "তাত্ক্ষণিক ডিএনএস অ্যাক্টিভেশন",
        "সম্পূর্ণ ফ্রি হু-ইজ প্রাইভেসি শিল্ড",
        "২ টি ডিএনএস-এসইসি সিকিউরিটি",
        "কোন গোপন চার্জ নেই"
      ],
      featuresAr: [
        "بث فوري كامل للـ DNS وسجلات الخادم",
        "إخفاء هوية وبيانات مالك النطاق مجاناً",
        "تأمين خوادم النطاق بخاصية DNSSEC",
        "لا توجد رسوم خفية أو مصاريف إضافية"
      ],
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
      demoUrl: "#",
      downloadUrl: "#",
      tags: ["Domain", "Registry"],
      views: 12
    };

    addToCart(virtualProduct);
    setAddedItems(prev => ({ ...prev, [domain]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [domain]: false }));
    }, 3000);
  };

  // Scroll to comparison structure
  const handleScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- WHATSAPP ORDER FORM STATES & HANDLERS ---
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    domain: '',
    hostingType: 'bdix',
    planId: 'bdix-starter',
    billingCycle: '24' as '1' | '12' | '24',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const formPackagesList = [
    { id: 'bdix-starter', title: 'Starter Plan (BDIX Shared)', titleBn: 'স্টার্টার প্ল্যান (BDIX Shared)', category: 'Shared Hosting', price: 0.99, hostingType: 'bdix' },
    { id: 'bdix-business', title: 'Business Plan (BDIX Shared)', titleBn: 'বিজনেস প্ল্যান (BDIX Shared)', category: 'Shared Hosting', price: 1.99, hostingType: 'bdix' },
    { id: 'bdix-professional', title: 'Professional Plan (BDIX Shared)', titleBn: 'প্রফেশনাল প্ল্যান (BDIX Shared)', category: 'Shared Hosting', price: 2.99, hostingType: 'bdix' },
    { id: 'vps-starter', title: 'VPS Starter Plan', titleBn: 'ভিপিএস স্টার্টার প্ল্যান', category: 'VPS Plans', price: 14.99, hostingType: 'vps' },
    { id: 'vps-business', title: 'VPS Business Plan', titleBn: 'ভিপিএস বিজনেস প্ল্যান', category: 'VPS Plans', price: 29.99, hostingType: 'vps' },
    { id: 'vps-professional', title: 'VPS Pro Plan', titleBn: 'ভিপিএস প্রো প্ল্যান', category: 'VPS Plans', price: 49.99, hostingType: 'vps' },
    { id: 'reseller-10g', title: '10 GB NVMe Reseller', titleBn: '১০ জিবি এনভিএমই রিসেলার', category: 'Reseller Hosting', price: 8.99, hostingType: 'reseller' },
    { id: 'reseller-20g', title: '30 GB NVMe Reseller', titleBn: '৩০ জিবি এনভিএমই রিসেলার', category: 'Reseller Hosting', price: 17.99, hostingType: 'reseller' },
    { id: 'reseller-50g', title: '50 GB NVMe Reseller', titleBn: '৫০ জিবি এনভিএমই রিসেলার', category: 'Reseller Hosting', price: 24.99, hostingType: 'reseller' },
    { id: 'cloud-starter', title: 'Starter Cloud (৳999/mo)', titleBn: 'স্টার্টার ক্লাউড (৳৯৯৯/মাস)', category: 'Cloud Hosting', price: 8.43, hostingType: 'cloud' },
    { id: 'cloud-business', title: 'Small Business Cloud (৳1,999/mo)', titleBn: 'স্মল বিজনেস ক্লাউড (৳১,৯৯৯/মাস)', category: 'Cloud Hosting', price: 16.87, hostingType: 'cloud' },
    { id: 'cloud-vps', title: 'Business Cloud VPS (৳3,999/mo)', titleBn: 'বিজনেস ক্লাউড ভিপিএস (৳৩,৯৯৯/মাস)', category: 'Cloud Hosting', price: 33.75, hostingType: 'cloud' },
  ];

  const handleHostingTypeChange = (type: string) => {
    const firstPkgOfNewType = formPackagesList.find(p => p.hostingType === type);
    setOrderForm(prev => ({
      ...prev,
      hostingType: type,
      planId: firstPkgOfNewType ? firstPkgOfNewType.id : ''
    }));
  };

  const handleOpenOrderModal = (planId?: string) => {
    const selectedPlanId = planId || 'bdix-starter';
    let detectedType = 'bdix';
    if (selectedPlanId.startsWith('vps-')) {
      detectedType = 'vps';
    } else if (selectedPlanId.startsWith('reseller-')) {
      detectedType = 'reseller';
    } else if (selectedPlanId.startsWith('cloud-')) {
      detectedType = 'cloud';
    }

    setOrderForm({
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      companyName: '',
      domain: '',
      hostingType: detectedType,
      planId: selectedPlanId,
      billingCycle: billingCycle || '24',
      notes: ''
    });
    setFormSubmitted(false);
    setFormError('');
    setIsOrderModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!orderForm.customerName.trim()) {
      setFormError(language === 'bn' ? 'দয়া করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    if (!orderForm.customerPhone.trim()) {
      setFormError(language === 'bn' ? 'দয়া করে আপনার মোবাইল নম্বর লিখুন।' : 'Please enter your mobile number.');
      return;
    }

    setFormLoading(true);

    try {
      const selectedPkgDetails = formPackagesList.find(p => p.id === orderForm.planId);
      const displayPrice = getDisplayPrice(orderForm.planId, orderForm.billingCycle);
      
      const orderId = `ord-fixed-hosting-${Date.now()}`;
      const orderObj = {
        id: orderId,
        itemTitle: selectedPkgDetails ? `[Hosting] ${selectedPkgDetails.title}` : `[Hosting] ${orderForm.planId}`,
        price: Number(displayPrice.totalCost.toFixed(2)),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        paymentMethod: 'WhatsApp Order Direct',
        paymentStatus: 'pending' as const,
        status: 'pending' as const,
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail || 'N/A',
        customerPhone: orderForm.customerPhone,
        orderNotes: `Company: ${orderForm.companyName || 'N/A'}\nDomain: ${orderForm.domain || 'N/A'}\nBilling Cycle: ${orderForm.billingCycle} Months\nPlan: ${orderForm.planId}\nNotes: ${orderForm.notes || 'None'}`
      };

      if (addServiceOrder) {
        await addServiceOrder(orderObj);
      } else {
        const saved = localStorage.getItem('webzone_orders');
        const list = saved ? JSON.parse(saved) : [];
        list.push(orderObj);
        localStorage.setItem('webzone_orders', JSON.stringify(list));
      }

      // Format WhatsApp Message
      const msg = `🟢 *NEW HOSTING ORDER* 🟢
----------------------------------
👤 *Customer:* ${orderForm.customerName}
📞 *Phone:* ${orderForm.customerPhone}
📧 *Email:* ${orderForm.customerEmail || 'N/A'}
🏢 *Company Name:* ${orderForm.companyName || 'N/A'}
🌐 *Domain:* ${orderForm.domain || 'N/A'}
📦 *Plan:* ${selectedPkgDetails?.title || orderForm.planId}
🗓️ *Billing Cycle:* ${orderForm.billingCycle} Months
💰 *Price:* ${formatPriceVal(displayPrice.totalCost)}
📝 *Notes:* ${orderForm.notes || 'None'}
----------------------------------
Sent from WebzoneBD Premium Order System`;

      window.open(`https://wa.me/966570511931?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      setFormSubmitted(true);
      if (triggerToast) {
        triggerToast(language === 'bn' ? 'অর্ডার সফলভাবে জমা হয়েছে!' : 'Order submitted successfully!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      setFormError(language === 'bn' ? 'অর্ডার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to submit order. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div 
      className="bg-[#F8FAFC] dark:bg-[#020617] text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300 font-sans overflow-hidden" 
      dir={isRtl ? 'rtl' : 'ltr'}
      id="redesigned-hosting-site-page"
    >
      
      {/* ================================= HERO SECTION ================================= */}
      <HostingHero
        language={language}
        theme={theme}
        onGetStarted={() => handleScrollToId('redesigned-categories')}
        onViewPlans={() => handleScrollToId('redesigned-comparison-table')}
        onSearchDomain={(query) => {
          setDomainQuery(query);
          handleScrollToId('redesigned-domain-search');
        }}
      />

      {/* ================================= DOMAIN SEARCH SECTION ================================= */}
      <DomainSearch
        language={language}
        theme={theme}
        currency={currency}
        addToCart={addToCart || (() => {})}
        setCurrentPage={setCurrentPage || (() => {})}
        currencySettings={currencySettings}
        showCategories={false}
      />

      {/* ================================= HOSTING CATEGORIES ================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="redesigned-categories">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            {currentTrans.categoriesHeading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {currentTrans.categoriesSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: 'bdix',
              title: currentTrans.sharedTitle,
              desc: currentTrans.sharedDesc,
              price: 0.99,
              icon: Database,
              color: 'from-sky-400 to-blue-600',
              accent: 'border-blue-500/20 shadow-blue-500/10',
              badge: language === 'bn' ? "বিডিআইএক্স অপ্টিমাইজড ⚡" : language === 'ar' ? "تحسين BDIX ⚡" : "BDIX Optimized ⚡",
              subBadge: "BDIX Network"
            },
            {
              id: 'reseller',
              title: currentTrans.resellerTitle,
              desc: currentTrans.resellerDesc,
              price: 11.99,
              icon: Layers,
              color: 'from-emerald-400 to-cyan-500',
              accent: 'border-emerald-500/20 shadow-emerald-500/10',
              badge: language === 'bn' ? "হোয়াইট-লেবেল 👥" : language === 'ar' ? "علامة تجارية مخصصة 👥" : "White-Label 👥",
              subBadge: "WHM Panel"
            },
            {
              id: 'vps',
              title: currentTrans.vpsTitle,
              desc: currentTrans.vpsDesc,
              price: 14.99,
              icon: Cpu,
              color: 'from-[#2563EB] to-[#8B5CF6]',
              accent: 'border-purple-500/20 shadow-purple-500/10',
              badge: language === 'bn' ? "ডেডিকেটেড কোর 🚀" : language === 'ar' ? "أنوية مخصصة 🚀" : "Dedicated Core 🚀",
              subBadge: "Root Access"
            },
            {
              id: 'cloud',
              title: language === 'bn' ? 'ক্লাউড হোস্টিং' : language === 'ar' ? 'الاستضافة السحابية' : 'Cloud Hosting',
              desc: language === 'bn' ? 'উচ্চ গতিসম্পন্ন ও নিরাপদ ক্লাউড ইনফ্রাস্ট্রাকচার, ফ্রি ডিডিওএস ও ইমিউনিফাই ৩৬০ সিকিউরিটি।' : language === 'ar' ? 'بنية سحابية عالية الأداء مع حماية كاملة ودعم معالجات مختلفة.' : 'High-availability cloud infrastructure with NVMe storage, cPanel & LiteSpeed.',
              price: 8.43,
              icon: Cloud,
              color: 'from-cyan-400 to-blue-600',
              accent: 'border-cyan-500/20 shadow-cyan-500/10',
              badge: language === 'bn' ? "আল্ট্রা ফাস্ট ☁️" : language === 'ar' ? "أداء سحابي ☁️" : "Ultra Fast ☁️",
              subBadge: "Cloud NVMe"
            }
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;

            const highlights = cat.id === 'bdix'
              ? (language === 'bn' 
                  ? ["⚡ সুপারফাস্ট ৫ মিলি-সেকেন্ড লেটেন্সি", "🔒 ফ্রি ক্রোম-ভেরিফাইড SSL লাইসেন্স", "📂 ১০০% এনভিএমই এসএসডি ড্রাইভ"]
                  : language === 'ar'
                  ? ["⚡ استجابة فائقة السرعة للأجهزة", "🔒 شهادة أمان SSL تلقائية ومجانية", "📂 أقراص تخزين سحابية NVMe فائقة"]
                  : ["⚡ Ultra-low 5ms local latency", "🔒 Free chrome-verified SSL", "📂 20x faster NVMe SSD disks"])
              : cat.id === 'vps'
              ? (language === 'bn' 
                  ? ["🚀 ডেডিকেটেড রুট অ্যাডমিন অ্যাক্সেস", "🌐 নিজস্ব ডেডিকেটেড আইপি অ্যাড্রেস", "⚙️ ম্যানেজড সুপার-কন্ট্রোল প্যানেল"]
                  : language === 'ar'
                  ? ["🚀 صلاحية وصول كاملة للـ Root", "🌐 عناوين IP مخصصة لكل سيرفر", "⚙️ لوحة قيادة مدارة بالكامل"]
                  : ["🚀 Server-grade Dedicated IP", "🌐 Full root administrator access", "⚙️ Managed server optimizations"])
              : cat.id === 'cloud'
              ? (language === 'bn'
                  ? ["☁️ ১০০% এনভিএমই ক্লাউড ক্লাস্টার", "🚀 সিপ্যানেল ও লাইটস্পিড সার্ভার", "🛡️ ইমিউনিফাই ৩৬০ ও ফ্রি ডিডিওএস প্রটেকশন"]
                  : language === 'ar'
                  ? ["☁️ بنية تحتية سحابية NVMe 100%", "🚀 خادم LiteSpeed ولوحة cPanel", "🛡️ حماية Imunify360 و DDoS مجاناً"]
                  : ["☁️ 100% NVMe Cloud Infrastructure", "🚀 cPanel & LiteSpeed Web Server", "🛡️ Imunify360 & Free DDoS Protection"])
              : (language === 'bn'
                  ? ["👥 হোয়াইট-লেবেল ব্রান্ডিং অপশন", "🛠️ মাস্টার WHM অ্যাডমিন প্যানেল", "💰 আনলিমিটেড সিপ্যানেল অ্যাকাউন্ট তৈরি"]
                  : language === 'ar'
                  ? ["👥 إعادة توجيه لوحة التحكم بالهوية", "🛠️ واجهة إدارة المشتركين WHM", "💰 إنشاء عدد غير محدود من الحسابات"]
                  : ["👥 White-label custom branding", "🛠️ Master WHM administrative access", "💰 Create unlimited standard cPanels"]);

            return (
              <ServiceCard3D
                key={cat.id}
                isSelected={isSelected}
                glowGradient={
                  cat.id === 'bdix'
                    ? 'from-sky-400 via-blue-500 to-indigo-600'
                    : cat.id === 'vps'
                    ? 'from-blue-600 via-purple-500 to-indigo-600'
                    : cat.id === 'cloud'
                    ? 'from-cyan-400 via-blue-500 to-indigo-600'
                    : 'from-emerald-400 via-teal-500 to-cyan-500'
                }
                onClick={() => {
                  selectTab(cat.id as any);
                  handleScrollToId('redesigned-packages');
                }}
                innerClassName="p-6 sm:p-8"
              >
                {/* Visual glow accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-6 blur-xl pointer-events-none group-hover:opacity-18 transition`} />
                
                {/* Floating Badge */}
                {cat.badge && (
                  <span className="absolute top-4 right-4 text-white font-mono font-black text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow bg-gradient-to-r from-blue-600 to-cyan-500">
                    {cat.badge}
                  </span>
                )}

                <div className="space-y-6">
                  {/* Icon beside title */}
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center w-12 h-12 shadow-lg shrink-0`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white font-display leading-tight">
                        {cat.title}
                      </h3>
                      <span className="inline-block text-[10px] font-mono uppercase bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 px-2.5 py-0.5 rounded-md font-bold mt-1">
                        {cat.subBadge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>

                  {/* Pricing view */}
                  <div className="py-4 border-y border-slate-100 dark:border-slate-800">
                    <span className="text-xxs sm:text-xs text-slate-400 uppercase font-bold font-mono block leading-none mb-1">
                      {currentTrans.from}
                    </span>
                    <div className="flex items-baseline gap-1.5 font-sans mt-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] dark:text-cyan-400">
                        {(() => {
                          const baseVal = cat.id === 'bdix' 
                            ? getDisplayPrice('bdix-starter', '24').monthlyAvg 
                            : cat.id === 'vps' 
                            ? getDisplayPrice('vps-starter', '24').monthlyAvg 
                            : getDisplayPrice('reseller-10g', '24').monthlyAvg;
                          return formatPriceVal(baseVal);
                        })()}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {formatPeriod()}
                      </span>
                    </div>
                    <span className="block text-[9.5px] text-green-600 dark:text-green-400 font-mono font-extrabold mt-1.5">
                      {language === 'bn' ? '⚡ ২৪ মাসের বিলিং কিস্তিতে' : language === 'ar' ? '⚡ فوترة ٢٤ شهراً' : '⚡ (Billed 24 months for maximum discount)'}
                    </span>
                  </div>

                  {/* Highlights section */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 rounded-xl text-left border border-slate-200/40 dark:border-slate-800/50 space-y-2">
                    <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                      {language === 'bn' ? 'ফিচার হাইলাইটস' : language === 'ar' ? 'أبرز المزايا' : 'Category Highlights'}
                    </span>
                    <ul className="space-y-1.5">
                      {highlights.map((hlt, hIdx) => (
                        <li key={hIdx} className="text-[11px] font-bold text-slate-650 dark:text-slate-350 leading-snug flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{hlt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100/70 dark:border-slate-800/40">
                  <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.01]">
                    <span>{currentTrans.explorePlans}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </ServiceCard3D>
            );
          })}
        </div>
      </section>

      {/* ================================= HOSTING PACKAGES ================================= */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/20 border-y border-slate-200/30 dark:border-slate-900/40" id="redesigned-packages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black font-mono bg-blue-500/10 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-400 uppercase tracking-widest mb-3">
              <Server className="w-3 h-3 fill-current" />
              <span>Premium Hosting Node Server Tiers</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              {currentTrans.packagesHeading}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-300">
              {currentTrans.packagesSub}
            </p>
          </div>

          {/* Tab Selector & Billing Period switches */}
          <div className="flex flex-col items-center gap-6 mb-14 select-none">
            
            {/* Premium Modern Category Selector Field */}
            <div className="w-full max-w-5xl mx-auto">
              <div className="text-center mb-3">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                  {language === 'bn' ? 'হোস্টিং ক্যাটাগরি বেছে নিন' : language === 'ar' ? 'اختر فئة الاستضافة' : 'Select Hosting Infrastructure Category'}
                </span>
              </div>

              {/* Responsive Category Grid: 2 columns on mobile, 4 columns on large screens */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 p-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/90 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/60">
                {[
                  {
                    id: 'bdix' as const,
                    label: language === 'bn' ? 'শেয়ার্ড বিডিআইএক্স' : language === 'ar' ? 'استضافة BDIX' : 'Shared BDIX',
                    subtitle: language === 'bn' ? '১-৫ms সুপারফাস্ট স্পিড' : language === 'ar' ? 'سرعة فائقة BDIX' : '1-5ms Ultra-Low Ping',
                    badge: language === 'bn' ? 'জনপ্রিয়' : language === 'ar' ? 'شائع' : 'Fastest',
                    badgeStyle: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                    activeBadgeStyle: 'bg-emerald-400 text-slate-950 font-black',
                    icon: Globe,
                    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
                    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400',
                    activeIconBg: 'bg-white/20 text-white shadow-inner',
                    features: language === 'bn' 
                      ? ['LiteSpeed ক্যাশ', 'ফ্রি এসএসএল', 'cPanel প্যানেল', 'ডেইলি ব্যাকআপ']
                      : language === 'ar'
                      ? ['كاش LiteSpeed', 'شهادة SSL مجاناً', 'لوحة cPanel', 'نسخ احتياطي']
                      : ['LiteSpeed Cache', 'Free SSL', 'cPanel Access', 'Daily Backups'],
                    summary: language === 'bn'
                      ? 'বাংলাদেশি ও দক্ষিণ এশিয়ান ভিজিটরদের জন্য কম ল্যাটেন্সি এবং লাইটস্পিড ক্যাশ সহ সুপারফাস্ট BDIX কানেক্টিভিটি।'
                      : language === 'ar'
                      ? 'استضافة BDIX فائقة السرعة مع مخدمات LiteSpeed لضمان تحميل صفحات فوري وأعلى أداء للمواقع.'
                      : 'Ultra-low latency NVMe BDIX routing engineered for instantaneous page rendering and high concurrency.'
                  },
                  {
                    id: 'reseller' as const,
                    label: language === 'bn' ? 'রিসেলার হোস্টিং' : language === 'ar' ? 'استضافة الموزعين' : 'Reseller Hosting',
                    subtitle: language === 'bn' ? 'হোয়াইট-লেবেল WHM' : language === 'ar' ? 'لوحة WHM كاملة' : 'White-Label WHM',
                    badge: language === 'bn' ? 'এজেন্সি' : language === 'ar' ? 'للشركات' : 'Agency',
                    badgeStyle: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
                    activeBadgeStyle: 'bg-cyan-400 text-slate-950 font-black',
                    icon: Layers,
                    gradient: 'from-indigo-600 via-purple-600 to-blue-600',
                    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                    activeIconBg: 'bg-white/20 text-white shadow-inner',
                    features: language === 'bn'
                      ? ['কাস্টম নেমসার্ভার', 'ফ্রি WHM প্যানেল', 'ক্লায়েন্ট একাউন্ট তৈরি', 'ম্যালওয়্যার শিল্ড']
                      : language === 'ar'
                      ? ['خوادم أسماء مخصصة', 'لوحة WHM مجاناً', 'حسابات cPanel غير محدودة', 'حماية متقدمة']
                      : ['Private Nameservers', 'Free WHM Panel', 'Unmetered Accounts', 'Malware Shield'],
                    summary: language === 'bn'
                      ? 'আপনার নিজস্ব ব্র্যান্ড নামে হোস্টিং ব্যবসা শুরু করতে আনলিমিটেড cPanel অ্যাকাউন্ট ও ফুল WHM কন্ট্রোল।'
                      : language === 'ar'
                      ? 'ابدأ شركة استضافتك الخاصة بعلامتك التجارية الكاملة مع لوحة تحكم WHM ودعم فني على مدار الساعة.'
                      : 'Launch your independent web hosting business with white-label WHM, custom branding, and automated provisioning.'
                  },
                  {
                    id: 'vps' as const,
                    label: language === 'bn' ? 'ভিপিএস হোস্টিং' : language === 'ar' ? 'خوادم VPS' : 'VPS Hosting',
                    subtitle: language === 'bn' ? 'ডেডিকেটেড KVM নোড' : language === 'ar' ? 'خوادم KVM مخصصة' : 'Dedicated KVM Node',
                    badge: language === 'bn' ? 'রুট অ্যাক্সেস' : language === 'ar' ? 'رووت كامل' : 'Root Access',
                    badgeStyle: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
                    activeBadgeStyle: 'bg-amber-400 text-slate-950 font-black',
                    icon: Terminal,
                    gradient: 'from-purple-600 via-fuchsia-600 to-indigo-600',
                    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
                    activeIconBg: 'bg-white/20 text-white shadow-inner',
                    features: language === 'bn'
                      ? ['ডেডিকেটেড vCPU', 'NVMe Gen4 স্টোরেজ', 'ফুল রুট SSH', 'IPv4 এড্রেস']
                      : language === 'ar'
                      ? ['معالجات vCPU مخصصة', 'أقراص NVMe Gen4', 'صلاحيات SSH كاملة', 'عنوان IPv4 مخصص']
                      : ['Dedicated vCPU', 'NVMe Gen4 Storage', 'Full Root SSH', 'Dedicated IPv4'],
                    summary: language === 'bn'
                      ? 'ফুল রুট এক্সেস, ডেডিকেটেড সিপিইউ/র‍্যাম এবং কাস্টম ওএস কনফিগারেশন সহ এন্টারপ্রাইজ KVM ভার্চুয়ালাইজেশন।'
                      : language === 'ar'
                      ? 'خوادم سحابية افتراضية عالية الأداء مع صلاحيات Root كاملة وموارد مخصصة تماماً لتطبيقاتك.'
                      : 'High-performance KVM virtual private servers with guaranteed hardware allocation, zero noisy neighbors, and full root access.'
                  },
                  {
                    id: 'cloud' as const,
                    label: language === 'bn' ? 'ক্লাউড হোস্টিং' : language === 'ar' ? 'الاستضافة السحابية' : 'Cloud Hosting',
                    subtitle: language === 'bn' ? '৯৯.৯৯% হাই SLA' : language === 'ar' ? 'توسيع تلقائي 99.99%' : '99.99% High SLA',
                    badge: language === 'bn' ? 'স্কেল-আপ' : language === 'ar' ? 'سحابي' : 'Auto Scale',
                    badgeStyle: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
                    activeBadgeStyle: 'bg-emerald-400 text-slate-950 font-black',
                    icon: Cloud,
                    gradient: 'from-cyan-600 via-teal-600 to-blue-600',
                    iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
                    activeIconBg: 'bg-white/20 text-white shadow-inner',
                    features: language === 'bn'
                      ? ['অটো ফেইলওভার', 'রিডানড্যান্ট স্টোরেজ', 'ইনস্ট্যান্ট স্কেলিং', 'এন্টারপ্রাইজ SLA']
                      : language === 'ar'
                      ? ['نقل تلقائي عند العطل', 'تخزين سحابي مكرر', 'ترقية فورية للموارد', 'ضمان استقرار فائق']
                      : ['Auto-Failover Node', 'Redundant Ceph SAN', 'Instant Scale', 'Enterprise SLA'],
                    summary: language === 'bn'
                      ? 'উচ্চ ট্রাফিকের জন্য রিডানড্যান্ট ক্লাউড ক্লাস্টার আর্কিটেকচার এবং ৯৯.৯৯% নিরবচ্ছিন্ন আপটাইম গ্যারান্টি।'
                      : language === 'ar'
                      ? 'بنية تحتية سحابية متقدمة متعددة العقد تضمن عدم توقف موقعك حتى في أوقات ذروة الزيارات.'
                      : 'Multi-node cloud infrastructure with automatic resource redistribution, instant autoscaling, and zero downtime.'
                  },
                ].map((categoryTab) => {
                  const isSelected = activeTab === categoryTab.id;
                  const IconComponent = categoryTab.icon;

                  return (
                    <button
                      key={categoryTab.id}
                      type="button"
                      onClick={() => selectTab(categoryTab.id)}
                      className={`relative group text-left rtl:text-right p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[92px] sm:min-h-[110px] ${
                        isSelected
                          ? `bg-gradient-to-br ${categoryTab.gradient} text-white shadow-lg shadow-blue-500/20 scale-[1.02] border border-white/20`
                          : 'bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-400/40 dark:hover:border-cyan-500/40'
                      }`}
                    >
                      {/* Active Indicator Glow Ring */}
                      {isSelected && (
                        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                      )}

                      {/* Header Row: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          isSelected ? categoryTab.activeIconBg : categoryTab.iconBg
                        }`}>
                          <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2px]" />
                        </div>

                        <span className={`text-[8.5px] sm:text-[9.5px] font-black uppercase font-mono px-2 py-0.5 rounded-full border transition-all ${
                          isSelected 
                            ? categoryTab.activeBadgeStyle
                            : categoryTab.badgeStyle
                        }`}>
                          {categoryTab.badge}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs sm:text-sm font-extrabold tracking-tight line-clamp-1 ${
                            isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                          }`}>
                            {categoryTab.label}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          )}
                        </div>
                        <p className={`text-[10px] sm:text-[11px] font-medium line-clamp-1 mt-0.5 ${
                          isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {categoryTab.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Category Highlights Summary Strip */}
              <AnimatePresence mode="wait">
                {(() => {
                  const activeConfig = [
                    {
                      id: 'bdix',
                      label: language === 'bn' ? 'শেয়ার্ড বিডিআইএক্স' : language === 'ar' ? 'استضافة BDIX' : 'Shared BDIX',
                      icon: Globe,
                      summary: language === 'bn'
                        ? 'বাংলাদেশি ও দক্ষিণ এশিয়ান ভিজিটরদের জন্য কম ল্যাটেন্সি এবং লাইটস্পিড ক্যাশ সহ সুপারফাস্ট BDIX কানেক্টিভিটি।'
                        : language === 'ar'
                        ? 'استضافة BDIX فائقة السرعة مع مخدمات LiteSpeed لضمان تحميل صفحات فوري وأعلى أداء للمواقع.'
                        : 'Ultra-low latency NVMe BDIX routing engineered for instantaneous page rendering and high concurrency.',
                      features: language === 'bn' 
                        ? ['LiteSpeed ক্যাশ', 'ফ্রি এসএসএল', 'cPanel এক্সেস', 'ডেইলি ক্লাউড ব্যাকআপ']
                        : language === 'ar'
                        ? ['كاش LiteSpeed', 'شهادة SSL مجاناً', 'لوحة cPanel', 'نسخ احتياطي يومي']
                        : ['LiteSpeed Cache', 'Free SSL', 'cPanel Access', 'Daily Backups']
                    },
                    {
                      id: 'reseller',
                      label: language === 'bn' ? 'রিসেলার হোস্টিং' : language === 'ar' ? 'استضافة الموزعين' : 'Reseller Hosting',
                      icon: Layers,
                      summary: language === 'bn'
                        ? 'আপনার নিজস্ব ব্র্যান্ড নামে হোস্টিং ব্যবসা শুরু করতে আনলিমিটেড cPanel অ্যাকাউন্ট ও ফুল WHM কন্ট্রোল।'
                        : language === 'ar'
                        ? 'ابدأ شركة استضافتك الخاصة بعلامتك التجارية الكاملة مع لوحة تحكم WHM ودعم فني على مدار الساعة.'
                        : 'Launch your independent web hosting business with white-label WHM, custom branding, and automated provisioning.',
                      features: language === 'bn'
                        ? ['কাস্টম নেমসার্ভার', 'ফ্রি WHM প্যানেল', 'ক্লায়েন্ট একাউন্ট তৈরি', 'ম্যালওয়্যার শিল্ড']
                        : language === 'ar'
                        ? ['خوادم أسماء مخصصة', 'لوحة WHM مجاناً', 'حسابات cPanel غير محدودة', 'حماية متقدمة']
                        : ['Private Nameservers', 'Free WHM Panel', 'Unmetered Accounts', 'Malware Shield']
                    },
                    {
                      id: 'vps',
                      label: language === 'bn' ? 'ভিপিএস হোস্টিং' : language === 'ar' ? 'خوادم VPS' : 'VPS Hosting',
                      icon: Terminal,
                      summary: language === 'bn'
                        ? 'ফুল রুট এক্সেস, ডেডিকেটেড সিপিইউ/র‍্যাম এবং কাস্টম ওএস কনফিগারেশন সহ এন্টারপ্রাইজ KVM ভার্চুয়ালাইজেশন।'
                        : language === 'ar'
                        ? 'خوادم سحابية افتراضية عالية الأداء مع صلاحيات Root كاملة وموارد مخصصة تماماً لتطبيقاتك.'
                        : 'High-performance KVM virtual private servers with guaranteed hardware allocation, zero noisy neighbors, and full root access.',
                      features: language === 'bn'
                        ? ['ডেডিকেটেড vCPU', 'NVMe Gen4 স্টোরেজ', 'ফুল রুট SSH', 'IPv4 এড্রেস']
                        : language === 'ar'
                        ? ['معالجات vCPU مخصصة', 'أقراص NVMe Gen4', 'صلاحيات SSH كاملة', 'عنوان IPv4 مخصص']
                        : ['Dedicated vCPU', 'NVMe Gen4 Storage', 'Full Root SSH', 'Dedicated IPv4']
                    },
                    {
                      id: 'cloud',
                      label: language === 'bn' ? 'ক্লাউড হোস্টিং' : language === 'ar' ? 'الاستضافة السحابية' : 'Cloud Hosting',
                      icon: Cloud,
                      summary: language === 'bn'
                        ? 'উচ্চ ট্রাফিকের জন্য রিডানড্যান্ট ক্লাউড ক্লাস্টার আর্কিটেকচার এবং ৯৯.৯৯% নিরবচ্ছিন্ন আপটাইম গ্যারান্টি।'
                        : language === 'ar'
                        ? 'بنية تحتية سحابية متقدمة متعددة العقد تضمن عدم توقف موقعك حتى في أوقات ذروة الزيارات.'
                        : 'Multi-node cloud infrastructure with automatic resource redistribution, instant autoscaling, and zero downtime.',
                      features: language === 'bn'
                        ? ['অটো ফেইলওভার', 'রিডানড্যান্ট স্টোরেজ', 'ইনস্ট্যান্ট স্কেলিং', 'এন্টারপ্রাইজ SLA']
                        : language === 'ar'
                        ? ['نقل تلقائي عند العطل', 'تخزين سحابي مكرر', 'ترقية فورية للموارد', 'ضمان استقرار فائق']
                        : ['Auto-Failover Node', 'Redundant Ceph SAN', 'Instant Scale', 'Enterprise SLA']
                    }
                  ].find(c => c.id === activeTab);

                  if (!activeConfig) return null;
                  const ActiveIcon = activeConfig.icon;

                  return (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3.5 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-cyan-500/5 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-cyan-950/30 border border-blue-500/20 dark:border-blue-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-cyan-500/20 text-blue-600 dark:text-cyan-400 shrink-0">
                          <ActiveIcon className="w-4 h-4" />
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium text-[11px] sm:text-xs leading-relaxed">
                          <strong className="text-slate-900 dark:text-white font-extrabold mr-1">{activeConfig.label}:</strong>
                          {activeConfig.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {activeConfig.features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
                          >
                            <Check className="w-3 h-3 text-emerald-500 stroke-[3px]" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Elegant Custom Billing Cycle Dropdown Selector */}
            <div className="relative w-full max-w-sm px-4">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-2 text-center font-mono">
                {language === 'bn' ? 'বিলিং সাইকেল নির্বাচন করুন' : language === 'ar' ? 'اختر دورة الفوترة' : 'Select Billing Cycle Duration'}
              </label>
              
              <button
                type="button"
                id="billing-cycle-dropdown-trigger"
                onClick={() => setIsBillingDropdownOpen(!isBillingDropdownOpen)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-250 text-xs font-black text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${
                    billingCycle === '24' ? 'bg-purple-500 animate-pulse' : billingCycle === '12' ? 'bg-blue-500' : 'bg-slate-400'
                  }`} />
                  <span className="tracking-tight">
                    {billingCycle === '24'
                      ? (language === 'bn' ? '২৪ মাস (৩০% ছাড়)' : language === 'ar' ? '٢٤ شهراً (خصم ٣٠٪)' : '24 Months (Best Value - 30% Off) 🔥')
                      : billingCycle === '12'
                      ? (language === 'bn' ? '১২ মাস (২০% ছাড়)' : language === 'ar' ? '١٢ شهراً (خصم ٢٠٪)' : '12 Months (Popular - 20% Off) ⭐')
                      : (language === 'bn' ? '১ মাস (সাধারণ মূল্য)' : language === 'ar' ? 'شهر واحد (سعر عادي)' : '1 Month (Standard Pricing)')
                    }
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isBillingDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isBillingDropdownOpen && (
                  <>
                    {/* Backdrop wrapper to close select on click outside */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsBillingDropdownOpen(false)}
                    />
                    
                    <motion.div
                      id="billing-cycle-dropdown-list"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-4 right-4 mt-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col gap-1"
                    >
                      {[
                        { 
                          id: '1' as '1' | '12' | '24', 
                          label: language === 'bn' ? '১ মাস (সাধারণ মূল্য)' : language === 'ar' ? 'شهر واحد' : '1 Month',
                          desc: language === 'bn' ? 'কোনো ডিসকাউন্ট নেই' : 'Standard monthly rolling billing cycle',
                          badge: null,
                          color: 'bg-slate-400'
                        },
                        { 
                          id: '12' as '1' | '12' | '24', 
                          label: language === 'bn' ? '১২ মাস (২০% ছাড়)' : language === 'ar' ? '١٢ شهراً (خصم ٢٠٪)' : '12 Months',
                          desc: language === 'bn' ? 'বার্ষিক মেয়াদে ২০% সাশ্রয় করুন' : 'Save 20% compared to monthly rolling',
                          badge: 'Save 20% ⭐',
                          badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                          color: 'bg-blue-500'
                        },
                        { 
                          id: '24' as '1' | '12' | '24', 
                          label: language === 'bn' ? '২৪ মাস (৩০% ছাড়)' : language === 'ar' ? '٢٤ شهراً (خصم ٣٠٪)' : '24 Months',
                          desc: language === 'bn' ? 'দ্বিবার্ষিক মেয়াদে ৩০% সর্বোচ্চ ডিসকাউন্ট' : 'Save 30% - Absolute Best Value deal',
                          badge: 'Save 30% 🔥',
                          badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
                          color: 'bg-purple-500'
                        }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setBillingCycle(opt.id);
                            setIsBillingDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                            billingCycle === opt.id 
                              ? 'bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold' 
                              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                            <div className="flex flex-col gap-0.5">
                              <span className="font-extrabold">{opt.label}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-tight">{opt.desc}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {opt.badge && (
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono ${opt.badgeColor}`}>
                                {opt.badge}
                              </span>
                            )}
                            {billingCycle === opt.id && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[3px]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Cards dynamic listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch max-w-6xl mx-auto">
            {packagesList[activeTab].map((pkg) => {
              const priceData = getDisplayPrice(pkg.id, billingCycle);
              const displayPrice = priceData.monthlyAvg;

              const rates = currencySettings?.rates || { BDT: 118.5, SAR: 3.75, USD: 1.0 };
              const bdtRate = rates.BDT ?? 118.5;
              const targetRate = rates[currency] ?? 1.0;

              const months = billingCycle === '1' ? 1 : billingCycle === '12' ? 12 : 24;
              const baselineMonthlyTarget = (planPricing[pkg.id]?.['1'] ?? 100) / bdtRate * targetRate;
              const baselineTotalTarget = baselineMonthlyTarget * months;
              
              const totalCostTarget = priceData.totalCost;
              const totalSavingsTarget = baselineTotalTarget - totalCostTarget;

              let activeBadge = pkg.badge;
              if (billingCycle === '24') {
                if (pkg.id.endsWith('professional') || pkg.id.endsWith('50g')) {
                  activeBadge = language === 'bn' ? "সেরা ভ্যালু (৩০% ছাড়) 💎" : language === 'ar' ? "أفضل قيمة" : "Best Value (30% Off) 💎";
                } else if (pkg.id.endsWith('business') || pkg.id.endsWith('20g')) {
                  activeBadge = language === 'bn' ? "সবচেয়ে জনপ্রিয় 🔥" : language === 'ar' ? "الأكثر اختياراً" : "Most Popular 🔥";
                }
              }

              return (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <ServiceCard3D
                    glowGradient={
                      activeBadge && (activeBadge.includes('Best Value') || activeBadge.includes('সেরা ভ্যালু'))
                        ? 'from-emerald-500 via-teal-500 to-cyan-400'
                        : 'from-blue-600 via-indigo-500 to-purple-500'
                    }
                    isSelected={!!activeBadge}
                    innerClassName="p-6 sm:p-8"
                  >
                    {/* Floating Badge */}
                    {activeBadge && (
                      <span className={`absolute top-4 right-4 text-white font-mono font-black text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow animate-pulse bg-gradient-to-r ${
                        activeBadge.includes('Best Value') || activeBadge.includes('সেরা ভ্যালু')
                          ? 'from-emerald-500 to-teal-600'
                          : 'from-blue-600 to-indigo-650'
                      }`}>
                        {activeBadge}
                      </span>
                    )}

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] text-white flex items-center justify-center shadow-lg">
                        {activeTab === 'bdix' ? <Database className="w-5 h-5" /> : activeTab === 'vps' ? <Cpu className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                          {language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name}
                        </h3>
                        <span className="inline-block text-[10px] font-mono uppercase bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 px-2.5 py-0.5 rounded-md font-bold mt-1">
                          {pkg.storage}
                        </span>
                      </div>
                    </div>

                    {/* Select Billing Cycle Duration Selector Inside Card */}
                    <div className="pt-3 pb-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                          {language === 'bn' ? 'বিলিং সাইকেল সময়কাল' : language === 'ar' ? 'دورة الفوترة' : 'Billing Cycle Duration'}
                        </span>
                        <span className="text-[9.5px] font-black text-blue-600 dark:text-cyan-400 font-mono">
                          {billingCycle === '24' ? '30% OFF 🔥' : billingCycle === '12' ? '20% OFF ⭐' : 'Regular'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                        {[
                          { cycle: '1' as const, label: language === 'bn' ? '১ মাস' : language === 'ar' ? 'شهر' : '1 Mo', badge: '' },
                          { cycle: '12' as const, label: language === 'bn' ? '১২ মাস' : language === 'ar' ? '١٢ شهر' : '12 Mo', badge: '-20%' },
                          { cycle: '24' as const, label: language === 'bn' ? '২৪ মাস' : language === 'ar' ? '٢٤ شهر' : '24 Mo', badge: '-30%' }
                        ].map((btn) => {
                          const isSelected = billingCycle === btn.cycle;
                          return (
                            <button
                              key={btn.cycle}
                              type="button"
                              onClick={() => setBillingCycle(btn.cycle)}
                              className={`relative py-1.5 px-2 rounded-lg text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-black shadow-sm border border-blue-500/20 dark:border-cyan-500/30'
                                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 font-medium'
                              }`}
                            >
                              <span className="text-[11px] leading-tight font-bold">{btn.label}</span>
                              {btn.badge && (
                                <span className={`text-[8.5px] font-mono leading-none font-bold mt-0.5 px-1 py-0.2 rounded-full ${
                                  isSelected
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    : 'text-emerald-500/80 dark:text-emerald-400/80'
                                }`}>
                                  {btn.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pricing view */}
                    <div className="py-4 border-y border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline gap-1.5 font-sans">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] dark:text-cyan-400">
                          {formatPriceVal(displayPrice)}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {formatPeriod()}
                        </span>
                      </div>

                      {/* Display equivalent prices in other supported currencies */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-[10.5px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40 font-mono">
                        <span className="font-sans font-medium text-slate-400 text-[10px] uppercase tracking-wider">or:</span>
                        {currency !== 'BDT' && (
                          <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
                            🇧🇩 ৳{Math.round(priceData.bdtTotal / months)}{formatPeriod()}
                          </span>
                        )}
                        {currency !== 'BDT' && currency !== 'SAR' && <span className="text-slate-350 dark:text-slate-700">|</span>}
                        {currency !== 'SAR' && (
                          <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
                            🇸🇦 ﷼{(priceData.monthlyAvg * (rates.SAR ?? 3.75) / targetRate).toFixed(2)}{formatPeriod()}
                          </span>
                        )}
                        {currency !== 'USD' && (currency === 'BDT' || currency === 'SAR') && <span className="text-slate-350 dark:text-slate-700">|</span>}
                        {currency !== 'USD' && (
                          <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
                            🇺🇸 ${(priceData.monthlyAvg / targetRate).toFixed(2)}{formatPeriod()}
                          </span>
                        )}
                      </div>

                      {billingCycle !== '1' ? (
                        <div className="mt-3.5 space-y-1 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10 font-mono text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 text-left">
                          <div className="flex justify-between items-center">
                            <span>{language === 'bn' ? 'রেগুলার প্রাইস:' : language === 'ar' ? 'السعر العادي:' : 'Regular Price:'}</span>
                            <span className="line-through">{formatPriceVal(baselineTotalTarget)}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold text-[#10B981]">
                            <span>{language === 'bn' ? 'বিশেষ ছাড়কৃত মূল্য:' : language === 'ar' ? 'ಸعر العرض:' : 'Special Price:'}</span>
                            <span>{formatPriceVal(totalCostTarget)}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">
                            <span>{language === 'bn' ? 'মোট সাশ্রয়:' : language === 'ar' ? 'إجمالي التوفير:' : 'Total Savings:'}</span>
                            <span>{formatPriceVal(totalSavingsTarget)}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-bold mt-2 font-mono">
                          ⚡ {language === 'bn' 
                            ? '১২ এবং ২৪ মাসের পেমেন্টে ক্যাশব্যাক সহ ২০% থেকে ৩০% ছাড় পান।' 
                            : language === 'ar' 
                            ? 'وفر ما يصل إلى ٣٠٪ عند اختيار باقات الدفع السنوية.'
                            : 'Save 20% to 30% when purchasing in 12 or 24 month cycles.'}
                        </p>
                      )}
                    </div>

                    {/* VPS Performance Chart integration */}
                    {activeTab === 'vps' && (
                      <VpsPerformanceChart />
                    )}

                    {/* Perfect for bullet points */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-xl text-left border border-slate-200/40 dark:border-slate-800/50">
                      <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                        {currentTrans.perfectFor}
                      </span>
                      <ul className="space-y-1">
                        {pkg.perfectFor.map((p, idx) => (
                          <li key={idx} className="text-[11px] font-bold text-slate-650 dark:text-slate-350 leading-snug flex items-start gap-1">
                            <span className="text-emerald-500">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Core Features / Specs List with intuitive SVG icons */}
                    <div className="space-y-2 text-left">
                      {pkg.features.map((feature, i) => {
                        const spec = getSpecDetail(feature);
                        const SpecIcon = spec.icon;
                        return (
                          <div 
                            key={i} 
                            className="group/item flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-all duration-200 text-xs"
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border shadow-xs transition-transform duration-200 group-hover/item:scale-110 mt-0.5 ${spec.colorClass}`}>
                              <SpecIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                            </div>
                            <span className="text-slate-750 dark:text-slate-250 font-medium leading-relaxed flex-1">
                              {feature}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Pricing action CTAs */}
                  <div className="mt-8 space-y-2.5">
                    <button
                      onClick={() => handleExternalNav(pkg.url)}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.01]"
                    >
                      <span>{currentTrans.orderButton}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenOrderModal(pkg.id)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5 hover:border-emerald-500/30"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>{language === 'bn' ? '🟢 হোয়াটসঅ্যাপ অর্ডার ফর্ম' : language === 'ar' ? '🟢 طلب عبر الواتساب' : '🟢 WhatsApp Order Form'}</span>
                    </button>
                  </div>
                  </ServiceCard3D>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================================= HOSTING FEATURES SECTION ================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-black bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400 uppercase tracking-widest mb-3">
            ✓ WebzoneBD Standard Features
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            {currentTrans.featsTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentTrans.featsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: currentTrans.feat1, desc: currentTrans.feat1Desc, icon: Zap, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
            { title: currentTrans.feat2, desc: currentTrans.feat2Desc, icon: Lock, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
            { title: currentTrans.feat3, desc: currentTrans.feat3Desc, icon: HardDrive, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
            { title: currentTrans.feat4, desc: currentTrans.feat4Desc, icon: Database, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
            { title: currentTrans.feat5, desc: currentTrans.feat5Desc, icon: Server, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
            { title: currentTrans.feat6, desc: currentTrans.feat6Desc, icon: Activity, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
            { title: currentTrans.feat7, desc: currentTrans.feat7Desc, icon: Shield, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
            { title: currentTrans.feat8, desc: currentTrans.feat8Desc, icon: Phone, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition duration-300 text-left"
              >
                <div className={`p-3 rounded-xl ${item.color} border inline-block mb-4`}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 font-display">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================= PACKAGE COMPARISON TABLE ================================= */}
      <section className="py-24 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950/20 dark:via-slate-900/10 dark:to-slate-950/30 border-y border-slate-200/50 dark:border-slate-900" id="redesigned-comparison-table">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-600 dark:text-indigo-400 font-extrabold mb-4 uppercase tracking-widest font-mono"
            >
              <Award className="w-3.5 h-3.5 animate-pulse" />
              {language === 'bn' ? 'ফিচার মেট্রিক্স' : language === 'ar' ? 'مقارنة الخصائص' : 'Spec Matrix'}
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4 font-display">
              {currentTrans.compHeading}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              {currentTrans.compSub}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xl">
            {/* Ambient glowing shapes behind the comparison table to make it premium */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="overflow-x-auto">
              <table className="w-full text-start font-sans border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-7 px-6 bg-slate-50/50 dark:bg-slate-900/20 text-start text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                      {language === 'bn' ? 'ফিচার বা কারিগরি স্পেক' : language === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
                    </td>
                    
                    {/* Starter Header Card */}
                    <td className="py-7 px-6 min-w-[200px] text-center border-l border-slate-100 dark:border-slate-800/60">
                      <div className="relative rounded-2xl p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                          <Server className="w-12 h-12" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">
                          {activeTab === 'bdix' ? (language === 'bn' ? 'বেসিক প্ল্যান' : language === 'ar' ? 'البداية الاقتصادية' : 'Entry Tier') : activeTab === 'vps' ? (language === 'bn' ? 'ভার্চুয়াল নোড' : 'Cloud Server') : (language === 'bn' ? 'রিসেলার ১' : 'Reseller Basic')}
                        </span>
                        <h4 className="text-lg font-black tracking-tight">
                          {(() => {
                            const pkg = packagesList[activeTab][0];
                            return language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name;
                          })()}
                        </h4>
                      </div>
                    </td>

                    {/* Business Header Card */}
                    <td className="py-7 px-6 min-w-[220px] text-center border-l border-slate-100 dark:border-slate-800/60 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-black text-white uppercase tracking-widest shadow-md flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : language === 'ar' ? 'الأكثر اختياراً' : 'Most Popular'}
                      </div>
                      <div className="relative rounded-2xl p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl overflow-hidden group border border-indigo-400/40">
                        <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:scale-125 transition-transform duration-500">
                          <Cpu className="w-12 h-12" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">
                          {language === 'bn' ? 'সেরা ভ্যালু' : language === 'ar' ? 'القيمة الأفضل' : 'Best Value'}
                        </span>
                        <h4 className="text-lg font-black tracking-tight">
                          {(() => {
                            const pkg = packagesList[activeTab][1];
                            return language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name;
                          })()}
                        </h4>
                      </div>
                    </td>

                    {/* Professional Header Card */}
                    <td className="py-7 px-6 min-w-[200px] text-center border-l border-slate-100 dark:border-slate-800/60 font-sans">
                      <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#06B6D4] to-[#10B981] text-white shadow-lg overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                          <Award className="w-12 h-12" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">
                          {language === 'bn' ? 'সবচেয়ে শক্তিশালী' : language === 'ar' ? 'الأداة الأقوى' : 'Maximum Power'}
                        </span>
                        <h4 className="text-lg font-black tracking-tight">
                          {(() => {
                            const pkg = packagesList[activeTab][2];
                            return language === 'bn' ? pkg.nameBn : language === 'ar' ? pkg.nameAr : pkg.name;
                          })()}
                        </h4>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  
                  {/* Dynamic Price Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group bg-emerald-500/5">
                    <td className="py-5 px-6 font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-650 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-250">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-black text-slate-900 dark:text-white">{language === 'bn' ? 'স্ট্যান্ডার্ড প্রাইসিং' : language === 'ar' ? 'السعر العادل' : 'Active Plan Price'}</span>
                        <span className="block text-[8.5px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{language === 'bn' ? 'স্বয়ংক্রিয় রূপান্তর' : language === 'ar' ? 'تحويل تلقائي' : 'Auto Real-time Rate'}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-100 dark:border-slate-800/40 text-emerald-600 dark:text-emerald-450 font-extrabold font-mono text-base">
                      {formatPriceVal(getMonthlyPrice(packagesList[activeTab][0].id))}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-100 dark:border-slate-800/40 text-emerald-600 dark:text-emerald-450 font-extrabold font-mono text-base bg-indigo-50/30 dark:bg-indigo-950/30">
                      {formatPriceVal(getMonthlyPrice(packagesList[activeTab][1].id))}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-100 dark:border-slate-800/40 text-emerald-600 dark:text-emerald-450 font-extrabold font-mono text-base">
                      {formatPriceVal(getMonthlyPrice(packagesList[activeTab][2].id))}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </td>
                  </tr>

                  {/* Storage Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-250">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compStorage}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-800 dark:text-slate-100 font-mono">{packagesList[activeTab][0].storage}</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20">{packagesList[activeTab][1].storage}</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-800 dark:text-slate-100 font-mono">{packagesList[activeTab][2].storage}</td>
                  </tr>

                  {/* Bandwidth Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-250">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compBandwidth}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      {activeTab === 'bdix' ? 'Unlimited BDIX Block' : activeTab === 'vps' ? '1TB Transfer Pool' : 'Unlimited Bandwidth'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold bg-indigo-50/20 dark:bg-indigo-950/20">
                      {activeTab === 'bdix' ? 'Unlimited High-Speed' : activeTab === 'vps' ? '2TB Transfer Pool' : 'Unlimited Pool'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      {activeTab === 'bdix' ? 'Unlimited Priority Node' : activeTab === 'vps' ? '4TB Transfer Pool' : 'Unlimited Enterprise'}
                    </td>
                  </tr>

                  {/* SSL Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-650 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-250">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span>{activeTab === 'vps' ? 'OS Web Terminal' : currentTrans.compSSL}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'vps' ? 'Free OS Console' : 'Free AutoSSL'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 bg-indigo-50/20 dark:bg-indigo-950/20 font-mono font-extrabold text-xs">
                      {activeTab === 'vps' ? 'CyberPanel Prebuilt' : 'Free Wildcard Lifetime'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'vps' ? 'Free Pre-installed' : 'Free Wildcard Lifetime'}
                    </td>
                  </tr>

                  {/* Mailbox Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-250">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span>{activeTab === 'bdix' ? currentTrans.compEmails : activeTab === 'vps' ? 'Processor Compute Cores' : 'WHM accounts limit'}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'bdix' ? '10 Inbox Accounts' : activeTab === 'vps' ? '1 Dedicated AMD EPYC Core' : 'Host up to 10 WHM'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20 text-xs">
                      {activeTab === 'bdix' ? '30 Inbox Accounts' : activeTab === 'vps' ? '2 Dedicated AMD EPYC Cores' : 'Host up to 20 WHM'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                      {activeTab === 'bdix' ? 'Unlimited Inbox Accounts' : activeTab === 'vps' ? '4 Dedicated AMD EPYC Cores' : 'Host up to 50 WHM Accounts'}
                    </td>
                  </tr>

                  {/* Database Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-250">
                        <Database className="w-4 h-4" />
                      </div>
                      <span>{activeTab === 'bdix' ? currentTrans.compDatabases : activeTab === 'vps' ? 'RAM Allocation (DDR4)' : 'Subdomains / Addon Domain'}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-xs">
                      {activeTab === 'bdix' ? '5 MySQL DBs' : activeTab === 'vps' ? '2 GB ECC RAM' : 'Unlimited'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20 text-xs">
                      {activeTab === 'bdix' ? '15 MySQL DBs' : activeTab === 'vps' ? '4 GB ECC RAM' : 'Unlimited'}
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                      {activeTab === 'bdix' ? 'Unlimited DBs' : activeTab === 'vps' ? '8 GB ECC RAM' : 'Unlimited'}
                    </td>
                  </tr>

                  {/* Support Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-250">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compSupport}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">24/7 Standard Tickets</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold bg-indigo-50/20 dark:bg-indigo-950/20">24/7 Priority Support</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-cyan-400 dark:to-teal-300">
                      24/7 VIP Admin Access
                    </td>
                  </tr>

                  {/* Backup Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-250">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compBackups}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">Weekly Remote Nodes</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold bg-indigo-50/20 dark:bg-indigo-950/20">Daily Cloud Backup</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">Daily Cloud + Auto-Restore</td>
                  </tr>

                  {/* Uptime Specs Row */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 group">
                    <td className="py-5 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-250">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span>{currentTrans.compUptime}</span>
                    </td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono">99.9% SLA</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 text-slate-900 dark:text-white font-extrabold font-mono bg-indigo-50/20 dark:bg-indigo-950/20">99.9% SLA</td>
                    <td className="py-5 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">99.9% High Availability</td>
                  </tr>

                  {/* Pricing / Call to Action Row inside bottom of comparison table to maximize conversions */}
                  <tr className="bg-slate-50/30 dark:bg-slate-900/10">
                    <td className="py-6 px-6 font-bold text-slate-950 dark:text-white">
                      <div className="text-xs text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">{language === 'bn' ? 'তাত্ক্ষণিক অ্যাকশন' : 'Action Hub'}</div>
                      <div className="text-sm font-black">{language === 'bn' ? 'হোস্টিং শুরু করুন' : 'Provision Instantly'}</div>
                    </td>
                    <td className="py-6 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      <a 
                        href="https://host.webzonebd.com/index.php?rp=/store/share-hosting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 w-full max-w-[150px] py-2 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition duration-200"
                      >
                        {language === 'bn' ? 'অর্ডার করুন' : language === 'ar' ? 'طلب الآن' : 'Order Starter'}
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                    <td className="py-6 px-6 text-center border-l border-slate-50 dark:border-slate-800/40 bg-indigo-50/25 dark:bg-indigo-950/25">
                      <a 
                        href="https://host.webzonebd.com/index.php?rp=/store/share-hosting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full max-w-[150px] py-2.5 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-600/20"
                      >
                        {language === 'bn' ? 'জনপ্রিয় প্ল্যান' : language === 'ar' ? 'طلب الأكثر شعبية' : 'Order Business'}
                        <Sparkles className="w-3" />
                      </a>
                    </td>
                    <td className="py-6 px-6 text-center border-l border-slate-50 dark:border-slate-800/40">
                      <a 
                        href="https://host.webzonebd.com/index.php?rp=/store/share-hosting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 w-full max-w-[150px] py-2 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition duration-200"
                      >
                        {language === 'bn' ? 'প্রফেশনাল' : language === 'ar' ? 'طلب النخبة' : 'Order Pro'}
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ================================= WEBSITE MIGRATION WIZARD ================================= */}
      <section className="py-24 bg-gradient-to-b from-slate-100/30 via-white to-slate-50 dark:from-slate-950/20 dark:via-[#0F172A]/10 dark:to-slate-950/20 border-y border-slate-200/50 dark:border-slate-900" id="migration-wizard-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Localized Wizard Translations */}
          {(() => {
            const wizardTrans = {
              en: {
                sectionBadge: "🚚 INTERACTIVE COMPANION",
                sectionTitle: "Website Migration Guide & Wizard",
                sectionSub: "Moving from an old hosting provider (like Bluehost, Hostinger, cPanel) to WebzoneBD is 100% free and automatic. Step through our live interactive simulator to see how simple it is!",
                prevStep: "Previous Step",
                nextStep: "Next Step",
                
                step1Name: "1. Framework & Domain",
                step1Desc: "Map your setup",
                step2Name: "2. Choose Method",
                step2Desc: "Automated or Expert",
                step3Name: "3. Live Simulator",
                step3Desc: "Run the transfer",
                step4Name: "4. Verification",
                step4Desc: "Checkpoint checklists",

                frameworkHeading: "Select Your Site Framework Profile",
                wpTitle: "WordPress / WooCommerce",
                phpTitle: "Pure / OOP PHP",
                larTitle: "Laravel Engine",
                statTitle: "Static HTML Store",

                recTitle: "💡 Custom Package Recommendation",
                haveDomainHeading: "Do you already own your active domain?",
                yesDomain: "Yes, I will point WebzoneBD nameservers after buying",
                noDomain: "No, I will register a brand-new domain",

                optSharedTitle: "Recommended: Shared BDIX Business Plan",
                optSharedDesc: "Featuring LiteSpeed caching, premium NVMe arrays, and automated cPanel restore. WordPress loads 20x faster with under 5ms ping times in Bangladesh.",
                optPhpTitle: "Recommended: Shared BDIX Starter or Business",
                optPhpDesc: "Fully customizable environment with MultiPHP selector supporting version 5.6 to 8.3, fully loaded with Zend OPCache & customized execution specs.",
                optLarTitle: "Recommended: Managed VPS Starter Server",
                optLarDesc: "Fully managed VPS node with root SSH controls, git clone interfaces, Composer, custom SQLite or MariaDB database servers.",
                optStatTitle: "Recommended: Shared BDIX Starter Plan",
                optStatTitleSub: "Highly secure, cost-optimized, and static asset pre-built speeds. Comes with free SSL certificate and monthly automated off-site cloud replication.",

                methodHeading: "How would you like to handle your data transfer?",
                expTitle: "Option A: Free Expert Managed Migration (Recommended)",
                expDesc: "Our senior server engineers migrate everything — databases, emails, configuration files — safely without a single second of downtime.",
                manTitle: "Option B: Manual cPanel Auto-Upload (Self-Service)",
                manDesc: "Export a complete backup (.tar.gz cPanel file) from your current host and upload it here into our automatic analysis and loading queue.",

                providerLabel: "Select Your Current Host Provider:",
                sizeLabel: "Estimated Website File Size:",
                btnAnalyze: "Analyze Transition Path",
                analysisFinished: "✓ Transition Path Analysis Compiled Successfully:",
                analyzingWait: "Analyzing transition compatibility...",
                estimateTime: "Estimated Duration",
                compLevel: "Compatibility Level",
                recDowntime: "Downtime Estimation",
                statusReady: "Status Ready",

                dragDropLabel: "Drag & drop your old host's cPanel full backup archive (.tar.gz) here, or browse files",
                uploadingLabel: "Uploading cPanel Backup...",
                uploadedSuccess: "Backup successfully parsed & mapped:",

                simHeading: "Live Server Website Migration Simulator",
                simDesc: "Run our interactive pipeline engine and preview how WebzoneBD replicates files, maps databases, and secures configs behind the scenes.",
                btnSimStart: "Initialize Live Simulation Pipeline",
                btnSimRunning: "Simulation Active. Transferring...",
                btnSimDone: "Simulation Finished Successfully!",
                terminalTitle: "WebzoneBD Node Console — Dhaka Server Central",
                logPrompt: "[sys_admin@webzonebd-dhaka ~]$ ",

                checklistHeading: "Step 4: Post-Migration Checkpoint Checks",
                checklistDesc: "Your data is fully moved! Check off these final items to safely switch your DNS nameservers and begin loading under 5ms.",
                chk1: "Nameservers pointed to ns1.webzonebd.com & ns2.webzonebd.com",
                chk2: "Let's Encrypt Free Wildcard SSL active inside cPanel",
                chk3: "Database configurations matched correctly inside code files",
                chk4: "Cleared browser cached files & Cloudflare assets",

                congratsTitle: "🎉 Congratulations! Website is Fully Live!",
                congratsDesc: "All checkpoints passed. Your website is officially running on WebzoneBD's premium local servers, loading instantly inside Bangladesh with 99.9% uptime!",
                pricingScrollCTA: "Explore Hosting Packages & Get Started",
              },
              bn: {
                sectionBadge: "🚚 ইন্টারেক্টিভ গাইড",
                sectionTitle: "এক ক্লিকে ওয়েবসাইট মাইগ্রেশন গাইড",
                sectionSub: "নেমচিপ, হোস্টিংগার বা অন্য কোনো প্রোভাইডার থেকে ওয়েবজোনবিডিতে সাইট নিয়ে আসার প্রক্রিয়া অত্যন্ত সহজ। নিজেকে প্রস্তুত করতে নিচের লাইভ ইন্টারেক্টিভ সিমুলেটরটি ব্যবহার করে দেখুন!",
                prevStep: "পূর্ববর্তী ধাপ",
                nextStep: "পরবর্তী ধাপ",

                step1Name: "১. ফ্রেমওয়ার্ক ও ডোমেন",
                step1Desc: "আপনার ফাইল নির্বাচন",
                step2Name: "২. পদ্ধতি নির্বাচন",
                step2Desc: "ফ্রি বা ম্যানুয়াল",
                step3Name: "৩. লাইভ সিমুলেটর",
                step3Desc: "ট্রান্সফার প্রক্রিয়া",
                step4Name: "৪. ভেরিফিকেশন",
                step4Desc: "চেকলিস্ট ও লাইভ",

                frameworkHeading: "আপনার ওয়েবসাইটের ফ্রেমওয়ার্ক নির্বাচন করুন",
                wpTitle: "ওয়ার্ডপ্রেস / WooCommerce",
                phpTitle: "পিওর পিএইচপি কোড",
                larTitle: "লারাভেল ফ্রেমওয়ার্ক",
                statTitle: "স্ট্যাটিক HTML সাইট",

                recTitle: "💡 বিশেষ হোস্টিং প্যাকেজ পরামর্শ",
                haveDomainHeading: "আপনার কি নিজস্ব সচল ডোমেন আছে?",
                yesDomain: "হ্যাঁ, আমি ওয়েবজোনবিডি নেমসার্ভার আপডেট করব",
                noDomain: "না, কাস্টম ডোমেন বুকিং করব",

                optSharedTitle: "সুপারিশকৃত: বিডিআইএক্স বিজেনস হোস্টিং প্ল্যান",
                optSharedDesc: "ওয়ার্ডপ্রেস সাইটের জন্য লাইটস্পিড ক্যাশিং এবং দ্রুত এনভিএমই ড্রাইভ। স্পিড ২০ গুণ পর্যন্ত বাড়বে এবং বাংলাদেশে ৫ মিলি-সেকেন্ডের নিচে দ্রুত পেজ লোড হবে।",
                optPhpTitle: "সুপারিশকৃত: বিডিআইএক্স স্টার্টার বা বিজনেস প্ল্যান",
                optPhpDesc: "MultiPHP ম্যানেজারের মাধ্যমে পিএইচপি ৫.৬ থেকে ৮.৩ পর্যন্ত যেকোনো সংস্করণ এক ক্লিকে সংস্করণ নির্বাচন করুন। মেমরি লিমিট বাড়ানোর জন্য চমৎকার সুযোগ।",
                optLarTitle: "সুপারিশকৃত: আমাদের ক্লাউড ভিপিএস স্টার্টার সার্ভার",
                optLarDesc: "লারাভেলের জন্য রুট এসএসএইচ এক্সেস, গিট ডেপ্লয়মেন্ট, ক্রন জবস এবং সম্পূর্ণ ডেডিকেটেড রিসোর্স সমৃদ্ধ শক্তিশালী সার্ভার এনভায়রনমেন্ট।",
                optStatTitle: "সুপারিশকৃত: বিডিআইএক্স স্টার্টার হোস্টিং প্ল্যান",
                optStatTitleSub: "অল্প ট্রাফিকের জন্য চমৎকার বাজেট প্ল্যান। সম্পূর্ণ সুরক্ষিত লেটস এনক্রিপ্ট এসএসএল এবং প্রতি সপ্তাহে অটোমেটেড অফসাইট ক্লাউড ব্যাকআপ সহ।",

                methodHeading: "ফাইলগুলো আমাদের সার্ভারে কীভাবে স্থানান্তর করতে চান?",
                expTitle: "পদ্ধতি ক: সম্পূর্ণ ফ্রী প্রফেশনাল টিম দ্বারা মাইগ্রেশন (সুপারিশকৃত)",
                expDesc: "আমাদের সার্ভার এডমিনরাই ডাউনলোড, ডাটাবেস এক্সপোর্ট এবং জিরো ডাউনটাইম গ্যারান্টি দিয়ে সমস্ত ডাটা ফ্রিতে নতুন সার্ভারে স্থানান্তর করে দিবেন।",
                manTitle: "পদ্ধতি খ: সিপ্যানেল ফুল ব্যাকআপ ম্যানুয়াল আপলোড (সেলফ-সার্ভিস)",
                manDesc: "আপনার পূর্বের হোস্টিং সিপ্যানেল থেকে একটি ফুল ব্যাকআপ ফাইল (.tar.gz) ডাউনলোড করুন এবং ডাটা রেডি করতে এখানে আপলোড করুন।",

                providerLabel: "আপনার বর্তমান হোস্টিং প্রোভাইডার কে?",
                sizeLabel: "ওয়েবসাইট ফাইলের আনুমানিক সাইজ কত?",
                btnAnalyze: "মাইগ্রেশন এনালাইসিস উইজার্ড",
                analysisFinished: "✓ সাকসেসফুল মাইগ্রেশন এনালাইসিস কমপ্লিট:",
                analyzingWait: "মাইগ্রেশন সামঞ্জস্যতা যাচাই করা হচ্ছে...",
                estimateTime: "প্রয়োজনীয় সময়",
                compLevel: "সামঞ্জস্যতার মান",
                recDowntime: "সম্ভাব্য ডাউনটাইম",
                statusReady: "রেডি স্ট্যাটাস",

                dragDropLabel: "আপনার আগের হোস্টিংয়ের সিপ্যানেল ব্যাকআপ ফাইলটি (.tar.gz) এখানে ড্র্যাগ অ্যান্ড ড্রপ বা সিলেক্ট করুন",
                uploadingLabel: "ব্যাকআপ ফাইল আপলোড হচ্ছে...",
                uploadedSuccess: "ব্যাকআপ ফাইলটি সফলভাবে বিশ্লেষণ করা হয়েছে:",

                simHeading: "লাইভ সার্ভার ট্রান্সফার সিমুলেটর",
                simDesc: "সিমুলেশন ইঞ্জিনটি চালু করে রিয়েলটাইমে দেখে নিন কীভাবে ওয়েবজোনবিডি সার্ভারের নেপথ্যে ফাইল, ডাটাবেস স্থানান্তর এবং এসএসএল কাস্টম কনফিগার করে।",
                btnSimStart: "লাইভ সিমুলেশন শুরু করুন",
                btnSimRunning: "সিমুলেশন চলছে. ফাইল ট্রান্সফার...",
                btnSimDone: "সিমুলেশন সফলভাবে সম্পন্ন হয়েছে!",
                terminalTitle: "ওয়েবজোনবিডি কনসোল — ঢাকা সার্ভার সেন্ট্রাল",
                logPrompt: "[sys_admin@webzonebd-dhaka ~]$ ",

                checklistHeading: "ধাপ ৪: ফাইনাল চেকলিস্ট ও ওয়েবসাইট লাইভ",
                checklistDesc: "অভিনন্দন! আপনার ফাইলগুলো স্থানান্তরিত হয়েছে। ডোমেন এবং হোস্টিং সম্পূর্ণ লাইভ করতে নিচের কাজগুলো সম্পন্ন করুন।",
                chk1: "nameservers ns1.webzonebd.com এবং ns2.webzonebd.com এ আপডেট করা হয়েছে",
                chk2: "সিপ্যানেল থেকে ফ্রি লেটস এনক্রিপ্ট এসএসএল একটিভ করা হয়েছে",
                chk3: "কোড ফাইলের মধ্যে নতুন ডাটাবেস পাসওয়ার্ড ও ইউজারনেম ঠিক করা হয়েছে",
                chk4: "ব্রাউজার ক্যাশ ফাইল এবং ক্লাউডফ্লেয়ার সম্পূর্ণ ক্লিয়ার করা হয়েছে",

                congratsTitle: "🎉 অভিনন্দন! আপনার ওয়েবসাইট সম্পূর্ণ লাইভ হয়েছে!",
                congratsDesc: "সমস্ত চেকলিস্ট সম্পন্ন। আপনার সাইট এখন ওয়েবজোনবিডির হাই-স্পিড লোকাল সার্ভার চালিত এবং বাংলাদেশে বাফারিং ছাড়া ৫ms-এ লোড হচ্ছে!",
                pricingScrollCTA: "আমাদের হোস্টিং প্ল্যানগুলো দেখে নিন",
              },
              ar: {
                sectionBadge: "🚚 معالج النقل الذكي",
                sectionTitle: "دليل ومعالج نقل المواقع التفاعلي",
                sectionSub: "إن نقل موقعك النشط حالياً من مستضيف قديم (مثل نيم شيب، هوستينجر، سي بانل) هو عملية سهلة ومجانية بنسبة 100%. أطلق المحاكاة لتعرف كيف تنجز ذلك خطوة بخطوة!",
                prevStep: "الخطوة السابقة",
                nextStep: "الخطوة التالية",

                step1Name: "١. البيئة العتادية والنطاق",
                step1Desc: "تحديد مواصفات الموقع",
                step2Name: "٢. طريقة الإعداد",
                step2Desc: "تلقائي أو بمساعدتنا",
                step3Name: "٣. تشغيل المحاكي اللحظي",
                step3Desc: "متابعة عملية النقل والربط",
                step4Name: "٤. التشغيل والاستقرار",
                step4Desc: "فحص متكامل وتأمين النطاق",

                frameworkHeading: "اختر لغة البرمجة أو سكربت موقعك الحالي",
                wpTitle: "ووردبريس / ووكومرس",
                phpTitle: "بي اتش بي PHP مستقل",
                larTitle: "إطار عمل لاراويل Laravel",
                statTitle: "موقع ثابت HTML / CSS",

                recTitle: "💡 نصيحة الاستضافة الأنسب لتوزيعك الفني",
                haveDomainHeading: "هل تمتلك نطاقاً (دومين) نشطاً بالفعل؟",
                yesDomain: "نعم، سأقوم بتوجيه عناوين خوادمي Nameservers بعد الحجز",
                noDomain: "لا، أرغب في تسجيل نطاق جديد فوراً",

                optSharedTitle: "الخيار الأفضل للووردبريس: باقة الأعمال المشتركة BDIX",
                optSharedDesc: "مزود بمسرعات الكاش LiteSpeed الذكية وقواعد بيانات NVMe SSD لضمان أسرع استجابة وتجربة تصفح سريعة للغاية بأقل من 5 ملي ثانية لبنجلاديش وجوارها.",
                optPhpTitle: "الخيار الأنسب للبي اتش بي: باقة BDIX الأساسية أو الأعمال",
                optPhpDesc: "مزود ببيئات مرنة تمنحك تحديد إصدار PHP من 5.6 وحتى 8.3 بضغطة واحدة، مع زيادة حدود الذاكرة وتعديل خيارات معالجة الاستفسارات.",
                optLarTitle: "الخيار المناسب للاراﭭيل: خادم VPS سحابي مدار",
                optLarDesc: "خادم افتراضي خاص يمنحك سرعة فائقة مع معالجات AMD EPYC، صلاحيات جذر، مكدسات تفعيل Git، وتهجير قواعد البيانات بشكل معزول.",
                optStatTitle: "الخيار الأنسب للمواقع الثابتة: الباقة الاقتصادية المشتركة BDIX",
                optStatTitleSub: "أداء فائق بأسعار ممتازة لتشغيل المحتوى والتعريف السريع. تشمل شهادة أمان وعزل تشفير متكامل ونسخ احتياطي أسبوعي خارجي.",

                methodHeading: "كيف تود البدء بنقل ورفع ملفاتك إلينا؟",
                expTitle: "الخيار الأول: النقل الاحترافي بواسطة فريقنا المدار (مجاني بالكامل - موصى به)",
                expDesc: "سيقوم خبراء الخوادم لدينا بسحب وتفعيل جميع المقاطع البرمجية، قواعد البيانات، وإيميلات العمل باحترافية كاملة وبدون ثانية واحدة من التوقف لموقعك.",
                manTitle: "الخيار الثاني: رفع ملف الأرشيف السحابي يدوياً (خدمة ذاتية ذكية)",
                manDesc: "قم باستخراج ملف نسخ كلي (.tar.gz) من مستضيفك القديم وارفع الملف هنا لتشغيل خطوط الاستئناف التلقائي لفك الضغط وتوزيع المقاطع.",

                providerLabel: "اختر مستضيفك الحالي:",
                sizeLabel: "الحجم المقدر لملفات موقعك حالياً:",
                btnAnalyze: "تحليل وتفصيل مسار النقل المتاح",
                analysisFinished: "✓ تم إنتاج وإعداد تحليل مسار الانتقال بنجاح:",
                analyzingWait: "جاري تحليل ملاءمة الخادم وخطوات النقل...",
                estimateTime: "الوقت الإجمالي المتوقع",
                compLevel: "معدل الملاءمة الفنية",
                recDowntime: "وقت التوقف المتوقع",
                statusReady: "جاهز للتنفيذ فوراً",

                dragDropLabel: "اسحب وألقِ ملف النسخ الاحتياطي لـ cPanel بصيغة (.tar.gz) هنا، أو تصفح الملفات المحلية",
                uploadingLabel: "جاري رفع ملف الموقع المقدر...",
                uploadedSuccess: "تم تحليل وحصر محتويات الأرشيف السحابي بنجاح:",

                simHeading: "محاكي خط معالجة النقل الفوري للسيرفر",
                simDesc: "اضغط لتشغيل معالج نقل المواقع الذكي الافتراضي وشاهد كيف تقوم خوادم ويب زون بربط وتسكين البيانات في الخلفية بمرونة فائقة.",
                btnSimStart: "أطلق محاكاة النقل البرمجية الفورية",
                btnSimRunning: "المحاكي نشط الآن. جاري المعالجة الحية لملفك...",
                btnSimDone: "اكتملت محاكاة نقل المواقع وتوطين البيانات بنجاح تام!",
                terminalTitle: "منصة ويب زون الفورية — الطرفية المركزية لخادم دكا داتا سنتر",
                logPrompt: "[sys_admin@webzonebd-dhaka ~]$ ",

                checklistHeading: "الخطوة ٤: مراجعة نقاط الحماية والاستقرار",
                checklistDesc: "لقد تم نقل ملفات موقعك بالكامل! تفضل بالتحقق وتطبيق النقاط النهائية لتأمين استقرار موقعك وتفعيله الفوري.",
                chk1: "تم توجيه عناوين نطاقي بالكامل للخوادم ns1.webzonebd.com و ns2.webzonebd.com",
                chk2: "تفعيل شهادة Let's Encrypt SSL بنجاح من داخل cPanel الفورية",
                chk3: "تأكيد توافق إعدادات قواعد البيانات مع التغييرات الجديدة للمقر",
                chk4: "تفريغ ذاكرة الكاش بالمتصفح وخصائص CDN (Cloudflare)",

                congratsTitle: "🎉 تهانينا القلبية الحارة! موقعك الإلكتروني مستقر ونشط الآن!",
                congratsDesc: "لقد اجتزت كافة نقاط التحقق. موقعك الآن يعمل بكامل كفاءته من داخل خوادم ويب زون الحية، وسرعة باهرة بأقل من ٥ ملي ثانية لمستخدِميك ومتابِعيك!",
                pricingScrollCTA: "تصفح باقات الاستضافة السحابية والبدء الفوري",
              }
            };

            const tW = wizardTrans[language] || wizardTrans.en;

            return (
              <div className="space-y-12">
                
                {/* Stepper Header Nodes */}
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-2 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800">
                    {[
                      { step: 0, title: tW.step1Name, desc: tW.step1Desc },
                      { step: 1, title: tW.step2Name, desc: tW.step2Desc },
                      { step: 2, title: tW.step3Name, desc: tW.step3Desc },
                      { step: 3, title: tW.step4Name, desc: tW.step4Desc },
                    ].map((item) => {
                      const isActive = wizardStep === item.step;
                      const isCompleted = wizardStep > item.step;
                      
                      return (
                        <button
                          key={item.step}
                          onClick={() => {
                            if (wizardSimState === 'running') return;
                            setWizardStep(item.step);
                          }}
                          className={`text-start p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer flex items-start gap-2.5 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow shadow-blue-500/20' 
                              : isCompleted 
                              ? 'bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-white dark:bg-[#1E293B] text-slate-500 hover:text-slate-800 dark:hover:text-white border-transparent'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : isCompleted 
                              ? 'bg-emerald-500/20 text-emerald-500' 
                              : 'bg-slate-105 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {isCompleted ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <Award className="w-3.5 h-3.5" />}
                          </div>
                          <div className="text-start leading-none mt-1">
                            <div className="text-xs font-black tracking-tight">{item.title}</div>
                            <div className={`text-[9.5px] mt-1.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper Content Panels */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={wizardStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      
                      {/* Step 1: Framework and Domain Mapping */}
                      {wizardStep === 0 && (
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2 justify-start">
                              <Terminal className="text-blue-500 w-4 h-4" />
                              <span>{tW.frameworkHeading}</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                              {[
                                { id: 'wordpress', label: tW.wpTitle, icon: Globe, color: 'hover:border-blue-500 text-blue-500 dark:text-blue-400' },
                                { id: 'custom-php', label: tW.phpTitle, icon: Database, color: 'hover:border-purple-500 text-purple-500 dark:text-purple-400' },
                                { id: 'laravel', label: tW.larTitle, icon: Cpu, color: 'hover:border-rose-500 text-rose-500 dark:text-rose-400' },
                                { id: 'static-html', label: tW.statTitle, icon: HardDrive, color: 'hover:border-emerald-500 text-emerald-500 dark:text-emerald-400' },
                              ].map((fw) => {
                                const FwIcon = fw.icon;
                                const isSel = wizardWebType === fw.id;
                                return (
                                  <button
                                    key={fw.id}
                                    onClick={() => setWizardWebType(fw.id)}
                                    className={`p-5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                                      isSel
                                        ? 'border-blue-500 dark:border-cyan-400 bg-blue-50/20 dark:bg-cyan-950/20 shadow-md ring-2 ring-blue-500/25'
                                        : 'border-slate-200/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 bg-transparent'
                                    } ${fw.color}`}
                                  >
                                    <FwIcon className="w-7 h-7 stroke-[1.8]" />
                                    <span className="text-xs font-black tracking-tight leading-snug">{fw.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Recommendation Box */}
                          <div className="p-5.5 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-cyan-500/5 dark:to-blue-500/5 rounded-2xl border border-blue-500/10 dark:border-cyan-400/10 text-left">
                            <h4 className="text-[10px] font-black uppercase text-blue-600 dark:text-cyan-400 tracking-wider flex items-center gap-1.5 mb-2.5">
                              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                              <span>{tW.recTitle}</span>
                            </h4>
                            {wizardWebType === 'wordpress' && (
                              <div>
                                <h5 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">{tW.optSharedTitle}</h5>
                                <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{tW.optSharedDesc}</p>
                              </div>
                            )}
                            {wizardWebType === 'custom-php' && (
                              <div>
                                <h5 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">{tW.optPhpTitle}</h5>
                                <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{tW.optPhpDesc}</p>
                              </div>
                            )}
                            {wizardWebType === 'laravel' && (
                              <div>
                                <h5 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">{tW.optLarTitle}</h5>
                                <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{tW.optLarDesc}</p>
                              </div>
                            )}
                            {wizardWebType === 'static-html' && (
                              <div>
                                <h5 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">{tW.optStatTitle}</h5>
                                <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{tW.optStatTitleSub}</p>
                              </div>
                            )}
                          </div>

                          {/* Domain Preferences */}
                          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-3 text-left">
                              {tW.haveDomainHeading}
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                onClick={() => setWizardHasDomain('yes')}
                                className={`flex-1 p-4 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                                  wizardHasDomain === 'yes'
                                    ? 'border-[#2563EB] dark:border-cyan-400 bg-slate-50/50 dark:bg-slate-900/40 font-bold'
                                    : 'border-slate-200/50 dark:border-slate-800/80 bg-transparent'
                                }`}
                              >
                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${wizardHasDomain === 'yes' ? 'border-[#2563EB] dark:border-cyan-400 bg-[#2563EB] dark:bg-cyan-400' : 'border-slate-400'}`}>
                                  {wizardHasDomain === 'yes' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span className="text-xs text-slate-700 dark:text-slate-300">{tW.yesDomain}</span>
                              </button>
                              <button
                                onClick={() => setWizardHasDomain('no')}
                                className={`flex-1 p-4 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                                  wizardHasDomain === 'no'
                                    ? 'border-[#2563EB] dark:border-cyan-400 bg-slate-50/50 dark:bg-slate-900/40 font-bold'
                                    : 'border-slate-200/50 dark:border-slate-800/80 bg-transparent'
                                }`}
                              >
                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${wizardHasDomain === 'no' ? 'border-[#2563EB] dark:border-cyan-400 bg-[#2563EB] dark:bg-cyan-400' : 'border-slate-400'}`}>
                                  {wizardHasDomain === 'no' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span className="text-xs text-slate-700 dark:text-slate-300">{tW.noDomain}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Select Transfer Method */}
                      {wizardStep === 1 && (
                        <div className="space-y-6">
                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-4 text-left">
                            {tW.methodHeading}
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                              onClick={() => setWizardTransferMethod('expert')}
                              className={`p-6 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                                wizardTransferMethod === 'expert'
                                  ? 'border-blue-500 dark:border-cyan-400 bg-blue-50/10 dark:bg-cyan-950/15'
                                  : 'border-slate-200/50 dark:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 justify-start">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">{tW.expTitle}</h4>
                              </div>
                              <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{tW.expDesc}</p>
                            </button>

                            <button
                              onClick={() => setWizardTransferMethod('manual')}
                              className={`p-6 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                                wizardTransferMethod === 'manual'
                                  ? 'border-blue-500 dark:border-cyan-400 bg-blue-50/10 dark:bg-cyan-950/15'
                                  : 'border-slate-200/50 dark:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 justify-start">
                                <Upload className="w-4 h-4 text-blue-500 shrink-0" />
                                <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">{tW.manTitle}</h4>
                              </div>
                              <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{tW.manDesc}</p>
                            </button>
                          </div>

                          {/* Option A View: Free Expert Tool */}
                          {wizardTransferMethod === 'expert' ? (
                            <div className="p-5 sm:p-7 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/40 dark:border-slate-800/85">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                <div>
                                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">{tW.providerLabel}</label>
                                  <select 
                                    value={wizardOldProvider}
                                    onChange={(e) => {
                                      setWizardOldProvider(e.target.value);
                                      setWizardAnalysisRun(false);
                                    }}
                                    className="w-full text-xs p-3 px-3.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-white outline-none cursor-pointer font-bold"
                                  >
                                    <option value="Namecheap">Namecheap</option>
                                    <option value="Hostinger">Hostinger</option>
                                    <option value="GoDaddy">GoDaddy</option>
                                    <option value="Hostgator">Hostgator</option>
                                    <option value="Bluehost">Bluehost</option>
                                    <option value="Other cPanel Provider">Other Provider</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">{tW.sizeLabel}</label>
                                  <select 
                                    value={wizardSiteSize}
                                    onChange={(e) => {
                                      setWizardSiteSize(e.target.value);
                                      setWizardAnalysisRun(false);
                                    }}
                                    className="w-full text-xs p-3 px-3.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-white outline-none cursor-pointer font-bold"
                                  >
                                    <option value="Under 5GB">Under 5GB</option>
                                    <option value="5GB - 20GB">5GB - 20GB</option>
                                    <option value="20GB - 100GB">20GB - 100GB</option>
                                    <option value="Over 100GB">Over 100GB</option>
                                  </select>
                                </div>
                              </div>

                              <div className="mt-5 text-left">
                                <button
                                  onClick={() => setWizardAnalysisRun(true)}
                                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] text-white text-[11px] font-black rounded-xl cursor-pointer flex items-center gap-1 shadow transition"
                                >
                                  <Activity className="w-3.5 h-3.5 animate-pulse text-indigo-200" />
                                  <span>{tW.btnAnalyze}</span>
                                </button>
                              </div>

                              {wizardAnalysisRun && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-6 bg-slate-950 font-mono text-[10.5px] text-emerald-400 p-4.5 rounded-xl text-left border border-slate-800 leading-relaxed shadow-inner"
                                >
                                  <div className="font-extrabold text-white text-xs mb-3 flex items-center gap-2 justify-start">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current animate-spin" />
                                    <span>{tW.analysisFinished}</span>
                                  </div>
                                  <div className="space-y-1.5 text-slate-300">
                                    <div>• <span className="text-slate-400">{tW.estimateTime}:</span> <span className="text-amber-400 font-extrabold">{wizardSiteSize === 'Under 5GB' ? '20-30 mins' : wizardSiteSize === '5GB - 20GB' ? '30-45 mins' : '1-2 hours'}</span></div>
                                    <div>• <span className="text-slate-400">{tW.compLevel}:</span> <span className="text-emerald-400 font-extrabold">100% Fully Compatible automatic transfer route</span></div>
                                    <div>• <span className="text-slate-400">{tW.recDowntime}:</span> <span className="text-emerald-400 font-black">Absolutely ZERO (0.00s downtime guaranteed)</span></div>
                                    <div className="pt-2 text-[9.5px] text-[#10B911] font-bold uppercase tracking-wider">➔ [ {tW.statusReady} / Proceed to Step 3 for Simulator ]</div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          ) : (
                            /* Option B View: cPanel Archive Manual Upload Simulation */
                            <div className="space-y-4 text-left">
                              <div 
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDummyDrop}
                                className="border-2 border-dashed border-slate-250 dark:border-slate-800 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30 hover:border-blue-500 hover:bg-slate-100/40 dark:hover:bg-slate-850/30 transition duration-300 relative cursor-pointer"
                              >
                                <input 
                                  type="file" 
                                  id="wizard-mock-file"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                  onChange={handleMockFileUpload}
                                />
                                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  {tW.dragDropLabel}
                                </h4>
                                <span className="block text-[10px] text-slate-400 tracking-wider mt-1.5 font-mono">Accepts: .tar, .tar.gz, .zip (Max. 50GB file size)</span>
                              </div>

                              {wizardFileSelected && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800 flex flex-col gap-2">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-755 dark:text-slate-300">
                                    <span className="truncate max-w-[250px] font-mono">📁 {wizardFileSelected}</span>
                                    <span>{wizardFileProgress}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300" 
                                      style={{ width: `${wizardFileProgress}%` }}
                                    />
                                  </div>
                                  
                                  {wizardFileUploading ? (
                                    <span className="text-[10px] text-slate-400 font-bold animate-pulse">{tW.uploadingLabel}</span>
                                  ) : (
                                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-450 mt-1 flex items-center gap-1.5 leading-normal font-semibold justify-start">
                                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                      <span>{tW.uploadedSuccess} cPanel dynamic core archive matches. PHP structures mapped successfully. Ready for step 3.</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 3: Simulated Live Transfer */}
                      {wizardStep === 2 && (
                        <div className="space-y-6">
                          <div className="text-left">
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2 justify-start">
                              <Terminal className="text-cyan-400 w-4 h-4 animate-pulse" />
                              <span>{tW.simHeading}</span>
                            </h3>
                            <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-slate-800/60 pb-3">
                              {tW.simDesc}
                            </p>
                          </div>

                          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
                            <div className="text-left flex flex-col justify-center space-y-3.5 md:flex-1">
                              {wizardSimState === 'idle' && (
                                <button
                                  onClick={handleStartSimulation}
                                  className="px-5 py-3.5 bg-[#2563EB] hover:bg-blue-650 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition transform hover:scale-[1.01] self-start"
                                >
                                  <Terminal className="w-4 h-4 text-cyan-300 animate-pulse" />
                                  <span>{tW.btnSimStart}</span>
                                </button>
                              )}

                              {wizardSimState === 'running' && (
                                <div className="flex items-center gap-4">
                                  <div className="px-5 py-3 bg-slate-105 dark:bg-slate-850 text-slate-500 dark:text-slate-350 text-xs font-black rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                    <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                                    <span>{tW.btnSimRunning}</span>
                                  </div>
                                  <span className="text-base font-bold text-[#2563EB] dark:text-cyan-400 font-mono animate-pulse">{wizardSimProgress}%</span>
                                </div>
                              )}

                              {wizardSimState === 'completed' && (
                                <div className="flex flex-wrap gap-3">
                                  <div className="px-4 py-2.5 bg-emerald-500 text-white text-xs font-black rounded-xl shadow flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                    <span>{tW.btnSimDone}</span>
                                  </div>
                                  <button
                                    onClick={handleStartSimulation}
                                    className="px-3 py-1.5 text-[10.5px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition cursor-pointer flex items-center gap-1 border border-slate-200 dark:border-slate-800"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Reset Simulator</span>
                                  </button>
                                </div>
                              )}

                              {wizardSimStatus && (
                                <p className="text-xs text-slate-600 dark:text-slate-350 font-bold max-w-sm leading-snug">
                                  ⚙️ {wizardSimStatus}
                                </p>
                              )}
                            </div>

                            <div className="w-full md:w-[460px] text-left shrink-0">
                              <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-[10px]">
                                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2h h-2 bg-red-500 rounded-full inline-block" style={{ width: 8, height: 8 }} />
                                    <span className="w-2h h-2 bg-yellow-500 rounded-full inline-block" style={{ width: 8, height: 8 }} />
                                    <span className="w-2h h-2 bg-green-500 rounded-full inline-block" style={{ width: 8, height: 8 }} />
                                  </div>
                                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 font-mono">{tW.terminalTitle}</span>
                                </div>
                                
                                <div className="p-4 h-48 overflow-y-auto space-y-2 text-emerald-400 scrollbar-thin leading-normal">
                                  <div className="text-slate-500 flex items-center justify-start gap-1">
                                    <span>{tW.logPrompt}</span>
                                    <span>init_migration --source=cpanel_archive.tar.gz</span>
                                  </div>
                                  {wizardSimLogs.map((log, index) => (
                                    <div key={index} className="text-emerald-400 animate-fade-in font-medium">
                                      {log}
                                    </div>
                                  ))}
                                  {wizardSimState === 'running' && (
                                    <div className="flex items-center gap-1.5 text-slate-500 tracking-wider justify-start">
                                      <span className="inline-block w-2 w-2 bg-cyan-400 rounded-sm shrink-0 animate-pulse" style={{ width: 6, height: 6 }} />
                                      <span>Transmitting encrypted packets...</span>
                                    </div>
                                  )}
                                  {wizardSimState === 'completed' && (
                                    <div className="pt-2.5 border-t border-slate-900 text-white font-extrabold text-center text-xxs text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse uppercase tracking-wider">
                                      [ *** DEPLOYMENT OK — BDIX DHAKA ROUTE HIGH SPEED BURST ACTIVE *** ]
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Checklist & Live Badge */}
                      {wizardStep === 3 && (
                        <div className="space-y-6">
                          <div className="text-left">
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2 justify-start">
                              <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                              <span>{tW.checklistHeading}</span>
                            </h3>
                            <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-b border-slate-104 dark:border-slate-800/60 pb-3">
                              {tW.checklistDesc}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-3 text-left">
                              {[
                                { key: 'nameservers', text: tW.chk1 },
                                { key: 'ssl', text: tW.chk2 },
                                { key: 'dbconn', text: tW.chk3 },
                                { key: 'cache', text: tW.chk4 },
                              ].map((chk) => {
                                const isTicked = wizardChecklist[chk.key];
                                return (
                                  <button
                                    key={chk.key}
                                    onClick={() => handleToggleChecklist(chk.key)}
                                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${
                                      isTicked 
                                        ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10' 
                                        : 'border-slate-200/50 dark:border-slate-800'
                                    }`}
                                  >
                                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                      isTicked 
                                        ? 'border-emerald-500 bg-emerald-500 text-white' 
                                        : 'border-slate-350 dark:border-slate-700'
                                    }`}>
                                      {isTicked && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                                    </div>
                                    <span className={`text-[11.5px] select-none font-bold ${isTicked ? 'text-slate-900 dark:text-white line-through opacity-70' : 'text-slate-650 dark:text-slate-300'}`}>
                                      {chk.text}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Success Trophy Badges */}
                            <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50/30 dark:bg-slate-900/10 rounded-3xl border border-slate-205/30 dark:border-slate-805/20 relative min-h-[220px]">
                              <AnimatePresence mode="wait">
                                {Object.values(wizardChecklist).every(v => v) ? (
                                  <motion.div
                                    key="celebrate-badge"
                                    initial={{ scale: 0.88, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.88, opacity: 0 }}
                                    className="space-y-4"
                                  >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none animate-pulse" />
                                    
                                    <div className="p-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-550 text-white w-16 h-16 flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto animate-bounce">
                                      <Award className="w-8 h-8 text-white stroke-[2.2] animate-pulse" />
                                    </div>
                                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">
                                      {tW.congratsTitle}
                                    </h4>
                                    <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-450 max-w-xs mx-auto leading-relaxed">
                                      {tW.congratsDesc}
                                    </p>
                                    
                                    <button
                                      onClick={() => handleScrollToId('redesigned-packages')}
                                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] text-white text-[10px] font-black rounded-lg cursor-pointer shadow transition"
                                    >
                                      {tW.pricingScrollCTA}
                                    </button>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="waiting-badge"
                                    className="text-slate-400 dark:text-slate-600 flex flex-col items-center gap-3.5"
                                  >
                                    <Lock className="w-10 h-10 stroke-[1.5] text-slate-300 dark:text-slate-750 animate-pulse" />
                                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-550 max-w-[200px] leading-snug">
                                      Point NS, configure SSL, match DB, and clear browser cache to test full Go-Live safety
                                    </span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>

                  {/* Nav Footer controls */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => setWizardStep(prev => Math.max(0, prev - 1))}
                      disabled={wizardStep === 0 || wizardSimState === 'running'}
                      className="px-4.5 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-350 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-[11px] font-black transition cursor-pointer"
                    >
                      ← {tW.prevStep}
                    </button>

                    <button
                      onClick={() => setWizardStep(prev => Math.min(3, prev + 1))}
                      disabled={wizardStep === 3 || wizardSimState === 'running'}
                      className="px-4.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.01] text-white disabled:opacity-40 disabled:pointer-events-none rounded-xl text-[11px] font-black transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{tW.nextStep}</span>
                      <span>→</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* ================================= CUSTOMER TESTIMONIALS ================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            {currentTrans.reviewsHeading}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentTrans.reviewsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              author: currentTrans.r1Author,
              role: currentTrans.r1Role,
              text: currentTrans.r1Text,
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            },
            {
              author: currentTrans.r2Author,
              role: currentTrans.r2Role,
              text: currentTrans.r2Text,
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
            },
            {
              author: currentTrans.r3Author,
              role: currentTrans.r3Role,
              text: currentTrans.r3Text,
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 bg-white dark:bg-[#0F172A] border border-slate-200/50 dark:border-slate-800 rounded-3xl flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-lg text-left"
            >
              <div>
                <div className="flex gap-1 text-amber-500 mb-4 justify-start">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-amber-450" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed font-serif mb-6">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.author}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================= STEP-BY-STEP VPS SETUP ACCORDION ================================= */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50/70 dark:from-slate-900/10 dark:to-slate-950/45 border-t border-slate-200/50 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-black bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400 uppercase tracking-widest mb-4">
              <Terminal className="w-3.5 h-3.5 animate-pulse text-blue-500" />
              {(vpsSetupTrans[language] || vpsSetupTrans.en).tag}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4 font-display">
              {(vpsSetupTrans[language] || vpsSetupTrans.en).heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {(vpsSetupTrans[language] || vpsSetupTrans.en).sub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Interactive Accordion steps */}
            <div className="lg:col-span-7 space-y-4">
              {(vpsSetupTrans[language] || vpsSetupTrans.en).steps.map((step, idx) => {
                const isOpen = activeSetupStep === idx;
                return (
                  <div 
                    key={idx}
                    className={`rounded-2xl border transition duration-300 overflow-hidden text-left ${
                      isOpen 
                        ? 'bg-white dark:bg-[#0F172A] border-blue-500/30 shadow-lg dark:shadow-blue-900/10 scale-[1.01]' 
                        : 'bg-white/80 dark:bg-slate-900/50 border-slate-200/65 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => setActiveSetupStep(isOpen ? null : idx)}
                      className="w-full py-5 px-6 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center font-mono text-xs font-black transition ${
                          isOpen 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {(vpsSetupTrans[language] || vpsSetupTrans.en).activeStepPrefix} {idx + 1}
                          </span>
                          <span className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                            {step.title}
                          </span>
                        </div>
                      </div>
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isOpen ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-150/10 text-slate-400 dark:text-slate-500'
                      }`}>
                        <ChevronDown className={`w-4 h-4 transition transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-850/75">
                            <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans mb-5">
                              {step.desc}
                            </p>
                            
                            {/* Command helper inline inside accordion item */}
                            <div className="bg-slate-900 rounded-xl p-4.5 border border-slate-800 text-left font-mono text-[10.5px] sm:text-xs">
                              <div className="flex items-center justify-between text-slate-450 border-b border-slate-850/30 pb-2 mb-3">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                  {language === 'bn' ? 'কমান্ড এক্সিকিউটর' : language === 'ar' ? 'سطر الأوامر' : 'CLI Command'}
                                </span>
                                <span className="text-[9px] text-slate-600">bash / linux</span>
                              </div>
                              <pre className="text-emerald-400 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                                {step.command.replace(/your_server_ip/g, vpsIp)}
                              </pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right side: Interactive Server Simulator Terminal Display */}
            <div className="lg:col-span-5 bg-[#080E1C] rounded-3xl border border-slate-800 shadow-2xl p-6.5 overflow-hidden relative">
              {/* Terminal glowing backdrop light */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Terminal Header dots */}
              <div className="flex items-center justify-between border-b border-slate-800/90 pb-4 mb-5 animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">
                  {(vpsSetupTrans[language] || vpsSetupTrans.en).terminalTitle}
                </div>
                <div className="w-8" />
              </div>

              {/* Interactive IP Configurator */}
              <div className="mb-6 bg-slate-900/90 rounded-2xl border border-slate-850 p-4">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-450 mb-2.5 text-left font-bold">
                  ⚡ {language === 'bn' ? 'সার্ভার আইপি মডিফায়ার (লাইভ টেস্ট)' : language === 'ar' ? 'عنوان الآي بي التجريبي' : 'Interactive IP Address'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vpsIp}
                    onChange={(e) => setVpsIp(e.target.value)}
                    placeholder={(vpsSetupTrans[language] || vpsSetupTrans.en).ipPlaceholder}
                    className="flex-1 bg-[#030712] border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500/70"
                  />
                  <button 
                    onClick={() => setVpsIp('141.136.42.112')}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-300 rounded-xl transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Terminal Display Screen */}
              <div className="bg-[#030712] rounded-2xl border border-slate-900 p-5 font-mono text-xxs sm:text-xs text-left leading-relaxed min-h-[310px] flex flex-col justify-between">
                <div className="space-y-3.5 text-slate-300">
                  <div className="text-slate-500 leading-tight">
                    # WebzoneBD Secure SSH Terminal v1.42 (KVM Node-12)<br />
                    # Port: 22 | Host: {vpsIp} | Agent: secure-shell
                  </div>
                  
                  {activeSetupStep !== null && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span>$</span>
                        <span className="text-blue-400 font-bold">
                          {(vpsSetupTrans[language] || vpsSetupTrans.en).activeStepPrefix} {activeSetupStep + 1} System Core:
                        </span>
                      </div>
                      
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-850/60 font-mono text-[10px] sm:text-[11px] text-emerald-400">
                        {(vpsSetupTrans[language] || vpsSetupTrans.en).steps[activeSetupStep].title}
                      </div>

                      <div className="pl-3.5 border-l-2 border-slate-800 text-slate-400 font-sans text-xxs sm:text-xs">
                        {(vpsSetupTrans[language] || vpsSetupTrans.en).steps[activeSetupStep].desc.substring(0, 100)}...
                      </div>

                      <div className="text-slate-550 text-[11px]">
                        $ current run command:<br />
                        <span className="text-slate-100 font-mono text-[10px]">
                          {(vpsSetupTrans[language] || vpsSetupTrans.en).steps[activeSetupStep].command.split('\n')[0].replace(/your_server_ip/g, vpsIp)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-850/40 flex items-center justify-between text-[10px]">
                  <span className="text-blue-500 font-bold animate-pulse inline-flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    {(vpsSetupTrans[language] || vpsSetupTrans.en).connectedText}{vpsIp}
                  </span>
                  <span className="text-slate-600 font-mono">UTC +6h</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================================= FAQ SECTION ================================= */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              {currentTrans.faqHeading}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {currentTrans.faqSub}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: currentTrans.f1Q, a: currentTrans.f1A },
              { q: currentTrans.f2Q, a: currentTrans.f2A },
              { q: currentTrans.f3Q, a: currentTrans.f3A },
              { q: currentTrans.f4Q, a: currentTrans.f4A },
              { q: currentTrans.f5Q, a: currentTrans.f5A }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/50 dark:border-slate-800 p-1 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-4.5 px-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpIcon className="w-4 h-4 text-blue-550 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xxs sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850">
                          {faq.a}
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

      {/* ================================= CONTACT CTA SECTION ================================= */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white p-8 md:p-14 text-center border border-slate-800">
          {/* Ambient overlays */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-650/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex justify-center p-4 bg-white/10 rounded-2xl backdrop-blur mb-6 border border-white/10">
            <HelpCircle className="w-8 h-8 text-cyan-400" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 font-display">
            {currentTrans.needHelp}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            {currentTrans.needHelpSub}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => handleScrollToId('redesigned-packages')}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-2 transition duration-300 scale-[1.01]"
            >
              <Award className="w-4 h-4 text-white fill-current animate-pulse" />
              <span>{currentTrans.orderHosting}</span>
            </button>

            <button 
              onClick={() => handleOpenOrderModal()}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 transition duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{language === 'bn' ? '🟢 হোয়াটসঅ্যাপ অর্ডার ফর্ম' : language === 'ar' ? '🟢 طلب عبر الواتساب' : '🟢 WhatsApp Order Form'}</span>
            </button>

            <button 
              onClick={() => handleSupportInquiry('whatsapp')}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 transition duration-300"
            >
              <Phone className="w-4 h-4" />
              <span>{currentTrans.whatsappSupport}</span>
            </button>
          </div>

        </div>
      </section>

      {/* WhatsApp Order Form Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div id="wbd-whatsapp-order-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-[20px] border border-slate-200/50 dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 md:p-10 text-slate-950 dark:text-white overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
                    🟢 {language === 'bn' ? 'অর্ডার ফর্ম' : 'Order Form'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {language === 'bn' ? 'হোস্টিং অর্ডার ও সাবস্ক্রিপশন' : '🟢 WhatsApp Order Form'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto pr-1 -mr-3 space-y-6 scrollbar-thin">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center"
                  >
                    <div className="w-16 h-16 bg-[#DCFCE7] border border-[#22C55E] text-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {language === 'bn' ? 'অর্ডার সফলভাবে পাঠানো হয়েছে!' : 'Order Placed Successfully!'}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                      {language === 'bn' 
                        ? 'আপনার হোস্টিং অর্ডারের তথ্য সিস্টেমে নথিভুক্ত করা হয়েছে এবং হোয়াটসঅ্যাপ চ্যাট ওপেন করা হচ্ছে।' 
                        : 'Your hosting order specifications have been stored in the database. WhatsApp is opening for instant completion.'}
                    </p>
                    <button
                      onClick={() => setIsOrderModalOpen(false)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition"
                    >
                      {language === 'bn' ? 'উইন্ডো বন্ধ করুন' : 'Close Window'}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    {/* Select Hosting Plan Category Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        {language === 'bn' ? 'হোস্টিং প্ল্যান নির্বাচন করুন *' : 'Select Hosting Plan *'}
                      </label>
                      <div className="relative">
                        <select
                          value={orderForm.hostingType}
                          onChange={(e) => handleHostingTypeChange(e.target.value)}
                          className="w-full h-14 pl-4 pr-10 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300 appearance-none hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                        >
                          <option value="bdix" className="dark:bg-[#111827]">Shared BDiX</option>
                          <option value="reseller" className="dark:bg-[#111827]">Reseller Hosting</option>
                          <option value="vps" className="dark:bg-[#111827]">VPS Hosting</option>
                          <option value="cloud" className="dark:bg-[#111827]">Cloud Hosting</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Dynamic Hosting Package Select Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        {language === 'bn' ? 'প্যাকেজ নির্বাচন করুন *' : 'Select Package *'}
                      </label>
                      <div className="relative">
                        <select
                          value={orderForm.planId}
                          onChange={(e) => setOrderForm({ ...orderForm, planId: e.target.value })}
                          className="w-full h-14 pl-4 pr-10 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300 appearance-none hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                        >
                          {formPackagesList
                            .filter((pkg) => pkg.hostingType === orderForm.hostingType)
                            .map((pkg) => {
                              const priceData = getDisplayPrice(pkg.id, orderForm.billingCycle);
                              return (
                                <option key={pkg.id} value={pkg.id} className="dark:bg-[#111827]">
                                  {language === 'bn' ? pkg.titleBn : pkg.title} ({formatPriceVal(priceData.monthlyAvg)}/{language === 'bn' ? 'মাস' : 'mo'})
                                </option>
                              );
                            })}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Billing Cycle Radio Grid */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        {language === 'bn' ? 'বিলিং সাইকেল নির্বাচন করুন' : 'Select Billing Cycle'}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: '1', label: language === 'bn' ? '১ মাস (মাসিক)' : '1 Month' },
                          { value: '12', label: language === 'bn' ? '১২ মাস (১ বছর)' : '12 Months' },
                          { value: '24', label: language === 'bn' ? '২৪ মাস (২ বছর)' : '24 Months' },
                        ].map((cycle) => {
                          const isSelected = orderForm.billingCycle === cycle.value;
                          return (
                            <button
                              key={cycle.value}
                              type="button"
                              onClick={() => setOrderForm({ ...orderForm, billingCycle: cycle.value as '1' | '12' | '24' })}
                              className={`p-3 rounded-xl border text-center transition-all duration-300 flex flex-col justify-center items-center gap-1 cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-violet-500/10 to-pink-500/10 border-violet-500 text-violet-600 dark:text-violet-400 font-bold shadow-sm shadow-violet-500/5'
                                  : 'bg-[#F8FAFC] dark:bg-[#111827] border-[#E2E8F0] dark:border-[#374151] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <span className="text-xs">{cycle.label}</span>
                              <span className="text-[10px] font-mono opacity-80">
                                {formatPriceVal(getDisplayPrice(orderForm.planId, cycle.value as '1' | '12' | '24').monthlyAvg)}/mo
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={orderForm.customerName}
                        onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                        placeholder={language === 'bn' ? 'যেমন: সাজ্জাদ হোসেন' : 'e.g. Sazzad Hossain'}
                        className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    {/* Email & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                          {language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={orderForm.customerPhone}
                          onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                          placeholder={language === 'bn' ? 'যেমন: ০১৭XXXXXXXX' : 'e.g. 017XXXXXXXX'}
                          className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                          {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          value={orderForm.customerEmail}
                          onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                          placeholder="e.g. name@example.com"
                          className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Company name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        {language === 'bn' ? 'কোম্পানির নাম (যদি থাকে)' : 'Add Your Company Name (If any)'}
                      </label>
                      <input
                        type="text"
                        value={orderForm.companyName}
                        onChange={(e) => setOrderForm({ ...orderForm, companyName: e.target.value })}
                        placeholder={language === 'bn' ? 'যেমন: আমাদের ব্যবসা লিমিটেড' : 'e.g. My Business Ltd.'}
                        className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    {/* Domain name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        {language === 'bn' ? 'ডোমেন নাম (যদি থাকে)' : 'Your Domain Name (If any)'}
                      </label>
                      <input
                        type="text"
                        value={orderForm.domain}
                        onChange={(e) => setOrderForm({ ...orderForm, domain: e.target.value })}
                        placeholder="e.g. mybusiness.com"
                        className="w-full h-14 px-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    {/* Additional requirements Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        {language === 'bn' ? 'विशेष কোনো নির্দেশনা বা নোট' : 'Special Requirements / Notes'}
                      </label>
                      <textarea
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                        placeholder={language === 'bn' ? 'আপনার প্রয়োজনীয় কোনো সেটিংস বা নির্দেশাবলী এখানে লিখুন...' : 'Enter any setup specifications or custom requirements here...'}
                        className="w-full min-h-[140px] p-4 rounded-[14px] font-medium bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] text-slate-950 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/18 focus:border-transparent transition-all duration-300 resize-y"
                      />
                    </div>

                    {/* Error Box */}
                    {formError && (
                      <div className="p-4 bg-[#FEE2E2] border border-[#EF4444] rounded-xl text-red-650 text-xs font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Bottom Order summary & Button */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/65 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                      <div className="text-center sm:text-left">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-widest block leading-none">
                          {language === 'bn' ? 'মোট প্রদেয় মূল্য' : 'Total Price'}
                        </span>
                        <span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent font-mono">
                          {formatPriceVal(getDisplayPrice(orderForm.planId, orderForm.billingCycle).totalCost)}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({orderForm.billingCycle} {language === 'bn' ? 'মাস' : 'Months'})
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full sm:w-auto h-[54px] px-8 rounded-[14px] bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)] text-white text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {formLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{language === 'bn' ? 'সাবমিট হচ্ছে...' : 'Submitting...'}</span>
                          </>
                        ) : (
                          <>
                            <span>{language === 'bn' ? 'অর্ডার সম্পন্ন করুন 🟢' : 'Complete Order on WhatsApp 🟢'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
