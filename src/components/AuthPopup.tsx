import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2, 
  Smartphone, ShieldCheck, Sparkles, RefreshCw, Key, ArrowRight,
  ShieldAlert, Activity, AlertCircle, Sparkles as SparklesIcon,
  Check, Info, ChevronRight, CornerDownRight, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme, UserSession, UserRole, Currency } from '../types';
import { PRESEEDED_USERS } from './AuthSystem';
import { auth as firebaseAuth, db as firebaseDb, handleFirestoreError, OperationType } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: Theme;
  user: UserSession | null;
  defaultView?: 'login' | 'register' | 'forgot';
  defaultRole?: 'customer' | 'affiliate';
  onLoginSuccess: (user: UserSession) => void;
  triggerToast: (msg: string) => void;
  onNavigate?: (page: string) => void;
}

export default function AuthPopup({
  isOpen,
  onClose,
  language,
  theme,
  user,
  defaultView = 'login',
  defaultRole = 'customer',
  onLoginSuccess,
  triggerToast,
  onNavigate
}: AuthPopupProps) {
  const [view, setView] = useState<'login' | 'register' | 'forgot' | 'success'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [showPartitionError, setShowPartitionError] = useState(false);

  useEffect(() => {
    setIsIframe(typeof window !== 'undefined' && window.self !== window.top);
  }, []);

  // Form Fields - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Form Fields - Registration
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhoneCode, setRegPhoneCode] = useState('+880');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTerms, setRegTerms] = useState(false);

  // Validation Errors - Registration
  const [regFullNameError, setRegFullNameError] = useState('');
  const [regEmailError, setRegEmailError] = useState('');
  const [regPhoneError, setRegPhoneError] = useState('');
  const [regPasswordError, setRegPasswordError] = useState('');
  const [regConfirmPasswordError, setRegConfirmPasswordError] = useState('');

  // Password Strength Helper
  const getPasswordStrengthLabel = (pass: string) => {
    if (!pass) return '';
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  // Sanitization and Validation Logic
  const sanitizeNameInput = (val: string) => {
    let clean = val.replace(/<[^>]*>?/gm, ''); // HTML tags removal
    return clean;
  };

  const validateFullNameField = (name: string) => {
    if (!name) return 'Full Name is required.';
    if (name.trim().length === 0) return 'Do not allow only spaces.';
    if (name.length < 2) return 'Please enter a valid Full Name. Minimum 2 characters required.';
    if (name.length > 100) return 'Maximum 100 characters allowed.';
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) return 'Please enter a valid Full Name. Allow letters and spaces only.';
    return '';
  };

  const validateEmailField = (email: string) => {
    if (!email) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePhoneField = (phone: string, code: string) => {
    if (!phone) return 'Phone number is required.';
    // Strip out non-numbers to get actual digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      return 'Please enter a valid phone number. Must be between 8 and 15 digits.';
    }
    return '';
  };

  const validatePasswordField = (pass: string) => {
    if (!pass) return 'Password is required.';
    if (pass.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least 1 uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least 1 lowercase letter.';
    if (!/[0-9]/.test(pass)) return 'Password must contain at least 1 number.';
    if (!/[^A-Za-z0-9]/.test(pass)) return 'Password must contain at least 1 special character.';
    return '';
  };

  const validateConfirmPasswordField = (confirm: string, pass: string) => {
    if (!confirm) return 'Confirm password is required.';
    if (confirm !== pass) return 'Confirm Password must match Password field.';
    return '';
  };

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');

  // Security & Simulations
  const [mathNumA, setMathNumA] = useState(0);
  const [mathNumB, setMathNumB] = useState(0);
  const [mathAnswer, setMathAnswer] = useState(0);
  const [mathInput, setMathInput] = useState('');
  
  // Security simulation messages
  const [isHashing, setIsHashing] = useState(false);
  const [hashedPassword, setHashedPassword] = useState('');
  const [rateLimitCounter, setRateLimitCounter] = useState(0);
  const [rateLimitBlocked, setRateLimitBlocked] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  const [emailStatusMessage, setEmailStatusMessage] = useState('');

  // Registered user reference for simulated email preview
  const [lastRegisteredUser, setLastRegisteredUser] = useState<{
    name: string;
    email: string;
    username: string;
  } | null>(null);

  // Auto math challenge creator
  const generateMathQuestion = () => {
    const list = [
      { a: 3, b: 6, ans: 9 },
      { a: 7, b: 2, ans: 9 },
      { a: 5, b: 4, ans: 9 },
      { a: 8, b: 5, ans: 13 },
      { a: 6, b: 7, ans: 13 },
      { a: 9, b: 3, ans: 12 },
      { a: 4, b: 8, ans: 12 },
      { a: 2, b: 9, ans: 11 }
    ];
    const picked = list[Math.floor(Math.random() * list.length)];
    setMathNumA(picked.a);
    setMathNumB(picked.b);
    setMathAnswer(picked.ans);
    setMathInput('');
  };

  // Reset variables on view swap or modal opens
  useEffect(() => {
    if (isOpen) {
      setView(defaultView === 'forgot' ? 'forgot' : defaultView || 'login');
      generateMathQuestion();
      setIsHashing(false);
      setMathInput('');
      setRateLimitCounter(0);
      setRateLimitBlocked(false);
    }
  }, [isOpen, defaultView]);

  // Rate Limiter countdown tracking
  useEffect(() => {
    let interval: any;
    if (rateLimitBlocked && rateLimitTimer > 0) {
      interval = setInterval(() => {
        setRateLimitTimer(prev => {
          if (prev <= 1) {
            setRateLimitBlocked(false);
            setRateLimitCounter(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimitBlocked, rateLimitTimer]);

  // Handle password hashing visual simulation
  const simulateHashing = (password: string, callback: () => void) => {
    setIsHashing(true);
    // Convert text to simple visual hex character sequence (mimicking pbkdf2_sha256 hashing)
    let hash = 'pbkdf2_sha256$280000$';
    for (let i = 0; i < password.length; i++) {
      hash += password.charCodeAt(i).toString(16);
    }
    hash += 'f391e8bc02a945d8b7a0d';
    setHashedPassword(hash.substring(0, 48) + '...');
    
    setTimeout(() => {
      setIsHashing(false);
      callback();
    }, 1200);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rateLimitBlocked) {
      triggerToast(`🚨 Security Rate Limiter Active. Please wait ${rateLimitTimer}s.`);
      return;
    }

    if (!loginEmail || !loginPassword) {
      triggerToast(language === 'bn' ? 'দয়া করে সবগুলো ঘর পূরণ করুন।' : 'Please fill all required credentials.');
      return;
    }

    // Brute Force Guard Checking
    if (rateLimitCounter >= 5) {
      setRateLimitBlocked(true);
      setRateLimitTimer(30);
      triggerToast('🚨 Brute Force Lockout: Too many login attempts. Blocked for 30 seconds.');
      return;
    }

    // Math check
    const answered = parseInt(mathInput);
    if (isNaN(answered) || answered !== mathAnswer) {
      setRateLimitCounter(prev => prev + 1);
      triggerToast(language === 'bn' ? '🚨 ম্যাথ ভেরিফিকেশন উত্তর ভুল হয়েছে!' : '🚨 Math Verification challenge failed.');
      generateMathQuestion();
      return;
    }

    simulateHashing(loginPassword, () => {
      // Find matching user from PRESEEDED_USERS
      let matched = PRESEEDED_USERS.find(
        u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.password === loginPassword
      );

      if (!matched) {
        try {
          const savedStaff = localStorage.getItem('webzone_admin_staff');
          if (savedStaff) {
            const staffList = JSON.parse(savedStaff);
            const stf = staffList.find(
              (s: any) => s.email && s.email.toLowerCase() === loginEmail.toLowerCase().trim() && s.password === loginPassword
            );
            if (stf) {
              matched = {
                id: stf.userId,
                name: stf.name,
                username: stf.name.toLowerCase().replace(/\s+/g, '_'),
                email: stf.email,
                phone: '+8801864000123',
                role: (stf.role?.toLowerCase() === 'admin' ? 'admin' : 'staff') as any,
                avatar: stf.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                isVerified: true,
                isSocial: false,
                createdAt: '2026-06-22',
                status: (stf.status || 'active') as any,
                password: stf.password || '',
                wishlistedProductIds: [] as string[]
              } as any;
            }
          }
        } catch (e) {
          console.warn("Error reading webzone_admin_staff in AuthPopup:", e);
        }
      }

      if (matched) {
        if ((matched.status as string) === 'suspended') {
          triggerToast('🚫 Suspended account. Please contact corporate workspace.');
          return;
        }

        onLoginSuccess(matched);
        triggerToast(language === 'bn' ? `স্বাগতম, ${matched.name}! লগইন সফল হয়েছে।` : `Welcome back, ${matched.name}! Security token stored.`);
        onClose();
      } else {
        setRateLimitCounter(prev => prev + 1);
        triggerToast(language === 'bn' ? '🚨 ভুল ইমেইল অথবা পাসওয়ার্ড!' : '🚨 Invalid email or password security combination.');
        generateMathQuestion();
      }
    });
  };

  // Register handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateFullNameField(regFullName);
    const emailErr = validateEmailField(regEmail);
    const phoneErr = validatePhoneField(regPhone, regPhoneCode);
    const passErr = validatePasswordField(regPassword);
    const confirmErr = validateConfirmPasswordField(regConfirmPassword, regPassword);

    setRegFullNameError(nameErr);
    setRegEmailError(emailErr);
    setRegPhoneError(phoneErr);
    setRegPasswordError(passErr);
    setRegConfirmPasswordError(confirmErr);

    if (nameErr || emailErr || phoneErr || passErr || confirmErr) {
      triggerToast(language === 'bn' ? 'অনুগ্রহ করে ফর্মের ত্রুটিগুলো সংশোধন করুন।' : 'Please fix the errors in the registration form.');
      return;
    }

    if (!regTerms) {
      triggerToast('You must accept WebzoneBD Terms & Privacy Agreements.');
      return;
    }

    // Check if user email already exists
    const exists = PRESEEDED_USERS.some(u => u.email.toLowerCase() === regEmail.toLowerCase().trim());
    if (exists) {
      triggerToast('An account already exists with this email address.');
      return;
    }

    simulateHashing(regPassword, () => {
      // Form combined phone number with the chosen country code
      const cleanPhone = regPhone.replace(/\D/g, ''); // strip out non-numbers
      const combinedWhatsApp = `${regPhoneCode}${cleanPhone}`;

      // Automatic currency resolution
      // bd (+880) -> BDT (Taka)
      // sa (+966) -> SAR (Riyal)
      // other -> USD (Dollar)
      let resolvedPrefCurrency: Currency = 'USD';
      if (regPhoneCode === '+880') {
        resolvedPrefCurrency = 'BDT';
      } else if (regPhoneCode === '+966') {
        resolvedPrefCurrency = 'SAR';
      }

      // Create new customer user
      const freshUser: UserSession = {
        id: 'usr-' + Date.now(),
        name: regFullName,
        username: regUsername.toLowerCase().trim(),
        email: regEmail.toLowerCase().trim(),
        phone: combinedWhatsApp,
        phoneCode: regPhoneCode,
        role: 'customer' as UserRole,
        isVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        wishlistedProductIds: [],
        preferredCurrency: resolvedPrefCurrency,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };

      // Push to preseeded list
      PRESEEDED_USERS.push({
        id: freshUser.id,
        name: freshUser.name,
        username: freshUser.username,
        email: freshUser.email,
        phone: freshUser.phone,
        role: freshUser.role,
        password: regPassword, // Keep for simulated login checks
        avatar: freshUser.avatar || '',
        isVerified: true,
        isSocial: false,
        createdAt: freshUser.createdAt,
        status: freshUser.status as 'active',
        preferredCurrency: freshUser.preferredCurrency,
        wishlistedProductIds: []
      } as any);

      // Save for Email Simulated Preview
      setLastRegisteredUser({
        name: freshUser.name,
        email: freshUser.email,
        username: freshUser.username
      });

      // Log in immediately
      onLoginSuccess(freshUser);
      setView('success');
      setEmailStatusMessage(`📧 Simulated Welcome Email sent successfully to ${freshUser.email}`);
      triggerToast(language === 'bn' ? 'অ্যাকাউন্ট তৈরি সফল হয়েছে!' : 'WebzoneBD Account created and ready to use!');
    });
  };

  // Google / Facebook dynamic authentication simulator
  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      setIsGoogleLoading(true);
      try {
        // Fix Firebase Authentication Persistence
        await setPersistence(firebaseAuth, browserLocalPersistence);

        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({
          prompt: 'select_account'
        });
        
        const credentials = await signInWithPopup(firebaseAuth, googleProvider);
        const fbUser = credentials.user;
        
        if (fbUser) {
          const userDocRef = doc(firebaseDb, 'users', fbUser.uid);
          let userSessionData: UserSession;
          const nowIso = new Date().toISOString();
          
          try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              // Existing user auto log in
              const existingData = userDocSnap.data();
              userSessionData = {
                ...existingData,
                id: fbUser.uid,
                name: existingData.name || fbUser.displayName || 'Google User',
                email: existingData.email || fbUser.email || '',
                avatar: existingData.avatar || fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                isVerified: fbUser.emailVerified || existingData.isVerified || false,
                lastLogin: nowIso,
                provider: 'Google',
                isSocial: true,
                socialProvider: 'google'
              } as UserSession;
              await setDoc(userDocRef, userSessionData);
            } else {
              // Brand new user auto create account
              userSessionData = {
                id: fbUser.uid,
                name: fbUser.displayName || 'Google User',
                username: (fbUser.email?.split('@')[0] || 'google_user') + '_' + Math.floor(1000 + Math.random() * 9000),
                email: fbUser.email || `${fbUser.uid}@google.com`,
                phone: fbUser.phoneNumber || '',
                role: 'customer',
                isVerified: fbUser.emailVerified,
                createdAt: nowIso,
                lastLogin: nowIso,
                status: 'active',
                wishlistedProductIds: [],
                avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                socialProvider: 'google',
                isSocial: true,
                provider: 'Google'
              };
              await setDoc(userDocRef, userSessionData);
            }
            
            onLoginSuccess(userSessionData);
            triggerToast(language === 'bn' ? `সাফল্যের সাথে গুগল দিয়ে সাইন-ইন সম্পন্ন হয়েছে! স্বাগতম, ${userSessionData.name}` : `🔒 Authenticated securely via Firebase Google Auth as: ${userSessionData.name}`);
            onClose();
            return;
          } catch (fireErr) {
            handleFirestoreError(fireErr, OperationType.WRITE, `users/${fbUser.uid}`);
          }
        }
      } catch (err: any) {
        const errMsg = err?.message || '';
        const isPartitionErr = err?.code === 'auth/web-storage-unsupported' || 
                              err?.code === 'auth/popup-blocked' ||
                              errMsg.includes('missing initial state') || 
                              errMsg.includes('sessionStorage') || 
                              errMsg.includes('storage-partitioned') ||
                              errMsg.includes('popup-blocked') ||
                              errMsg.includes('popup_blocked');
        
        if (isPartitionErr) {
          console.warn("Firebase Google Auth Popup/Storage blocked (expected in iframe or restricted settings):", err);
          setShowPartitionError(true);
        } else if (err?.code === 'auth/popup-closed-by-user' || errMsg.includes('closed by user')) {
          console.info("Google Sign-In cancelled by user.");
          triggerToast(language === 'bn' ? 'গুগল লগইন বাতিল করা হয়েছে।' : 'Google Sign-In was cancelled.');
        } else {
          console.warn("Firebase Google Auth Unexpected Error Details in Popup (falling back): ", err);
          if (typeof window !== 'undefined' && window.self !== window.top) {
            setShowPartitionError(true);
          } else {
            triggerToast(language === 'bn' ? `গুগল লগইন ত্রুটি: ${err.message}` : `Google Sign-In Error: ${err.message || 'Authentication failed'}`);
          }
        }
        return;
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      const socialName = "Facebook User";
      const socialEmail = "facebook@webzonebd.com";
      const socialUsername = "facebook_user";
      const socialAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80";

      triggerToast(`🔗 Authenticating via Facebook App Token...`);

      setTimeout(() => {
        let matched = PRESEEDED_USERS.find(u => u.email === socialEmail);
        if (!matched) {
          matched = {
            id: 'usr-social-' + Date.now(),
            name: socialName,
            username: socialUsername,
            email: socialEmail,
            phone: '+966570511931',
            role: 'customer' as UserRole,
            password: 'socialpassword',
            avatar: socialAvatar,
            isVerified: true,
            isSocial: true,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active' as const,
            wishlistedProductIds: []
          };
          PRESEEDED_USERS.push(matched);
        }

        onLoginSuccess({
          id: matched.id,
          name: matched.name,
          username: matched.username,
          email: matched.email,
          phone: matched.phone,
          role: matched.role,
          isVerified: true,
          createdAt: matched.createdAt,
          status: matched.status,
          wishlistedProductIds: [],
          avatar: matched.avatar
        });

        triggerToast(`✅ Welcome back, ${matched.name}! Session established via social federation.`);
        onClose();
      }, 1000);
    }
  };

  // Password reset submit handler
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      triggerToast('Please write your email identifier key.');
      return;
    }
    triggerToast(`📬 Success: Password reset token dispatched securely to ${forgotEmail}! Check junk folder.`);
    setView('login');
  };

  if (!isOpen) return null;

  // Visual Palette
  const cardBgTheme = theme === 'dark' ? 'bg-[#0F172A]' : 'bg-white';
  const overlayTheme = theme === 'dark' ? 'bg-[#020617]/80 backdrop-blur-md' : 'bg-slate-900/65 backdrop-blur-sm';

  const gradientStyles = {
    primary: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    account: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    premium: 'linear-gradient(135deg, #2563EB 0%, #8B5CF6 50%, #06B6D4 100%)'
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto ${overlayTheme}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border ${theme === 'dark' ? 'border-slate-800/80 bg-[#0F172A]/90' : 'border-slate-100 bg-white/95'} backdrop-blur-xl`}
      >
        {/* Glow Top Accent Bar using Premium Gradient */}
        <div 
          className="h-1.5 w-full" 
          style={{ backgroundImage: view === 'success' ? gradientStyles.premium : gradientStyles.primary }} 
        />

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-500/10 transition-all text-neutral-400 dark:text-neutral-500 hover:text-rose-500 dark:hover:text-rose-400 z-55 cursor-pointer active:scale-90"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="p-6 md:p-8 space-y-6 text-left">
          
          {/* =====================================
              SECURITY CRYPYTO HASHING SIMULATIONAL OVERLAY
              ===================================== */}
          <AnimatePresence>
            {isHashing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#020617]/85 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-center p-6"
              >
                <div className="p-4 bg-blue-600/10 rounded-full border border-blue-500/30 text-[#06B6D4] animate-spin mb-4">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest font-mono">
                  🔑 Encrypting Input Keys
                </h4>
                <p className="text-[10px] text-cyan-300 font-mono mt-1 w-full max-w-xs break-all truncate">
                  SHA-256 Base state: {hashedPassword}
                </p>
                <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>PBKDF2 SHA-256 Security active</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =====================================
              LOGIN VIEW
              ===================================== */}
          {view === 'login' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                  <span className="p-[3px] rounded-xl text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                    <span className="p-1 rounded-lg bg-slate-900/40 inline-block">
                      <Key className="w-4 h-4 text-white" />
                    </span>
                  </span>
                  <span>Welcome Back</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Sign in to access WebzoneBD Services & unified customer portal dashboard.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email address field */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#2563EB] transition-colors">
                      <Mail className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. customer@webzonebd.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition duration-200"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Secure Code Password
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#2563EB] transition-colors">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition duration-200 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-250 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* MATH SECURITY CHIP */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono font-black">
                    <span className="text-[#EC4899] uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>Security Core Protection</span>
                    </span>
                    <button
                      type="button"
                      onClick={generateMathQuestion}
                      className="text-[#2563EB] dark:text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Change Sum</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-slate-600 dark:text-slate-350 font-bold whitespace-nowrap">
                      Calculate sum: 
                      <span className="ml-1.5 px-2.5 py-1 rounded bg-[#2563EB]/10 dark:bg-cyan-500/10 text-[#2563EB] dark:text-cyan-400 font-mono text-xs font-black">
                        {mathNumA} + {mathNumB} = ?
                      </span>
                    </p>
                    <input
                      type="text"
                      required
                      placeholder="Sum answer"
                      value={mathInput}
                      onChange={(e) => setMathInput(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-[35%] text-center font-mono font-extrabold text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                {/* Remember Me and Forgot Security Links */}
                <div className="flex justify-between items-center text-xs select-none">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563EB] border-slate-300 dark:border-slate-700 accent-[#2563EB] cursor-pointer"
                    />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-[#2563EB] dark:text-cyan-400 hover:underline cursor-pointer font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submition trigger Buttons */}
                <button
                  type="submit"
                  className="w-full py-3 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:opacity-95 transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] duration-250 group pointer-events-auto"
                  style={{ background: `linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)` }}
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Secure SignIn Portal</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider">
                  Or Federation Access
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Social Login Grid */}
              <div className="space-y-2">
                {isIframe && (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs flex items-start gap-2 leading-relaxed mb-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold block mb-0.5 text-slate-800 dark:text-purple-200">
                        {language === 'bn' ? '💡 প্রিভিউ ফ্রেম নোটিশ' : '💡 Live Preview Frame Detected'}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {language === 'bn' 
                          ? 'ব্রাউজারের নিরাপত্তা সীমাবদ্ধতা এড়াতে এবং গুগল লগইন নিশ্চিত করতে দয়া করে এই সাইটটি নতুন ট্যাবে ব্যবহার করুন।' 
                          : 'To bypass browser security limits and sign in with Google seamlessly, please use this site in a new browser tab.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open(window.location.href, '_blank')}
                        className="mt-1.5 inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        <span>{language === 'bn' ? 'নতুন ট্যাবে ওপেন করুন' : 'Open in New Tab'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  disabled={isGoogleLoading}
                  className="w-full h-[54px] flex items-center justify-center gap-2.5 px-4 bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-[#1f2937] border border-slate-200 dark:border-[#374151] rounded-2xl shadow-sm hover:shadow-[0_12px_30px_rgba(124,58,237,0.15)] transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 dark:text-white"
                >
                  {isGoogleLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  <span className="font-semibold text-sm">
                    {isGoogleLoading 
                      ? (language === 'bn' ? 'গুগল সংযোগ করা হচ্ছে...' : 'Connecting to Google...') 
                      : (language === 'bn' ? 'গুগল দিয়ে চালিয়ে যান' : 'Continue with Google')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-200"
                >
                  <svg className="w-4.5 h-4.5 fill-blue-600 dark:fill-blue-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>{language === 'bn' ? 'ফেসবুক দিয়ে চালিয়ে যান' : 'Continue with Facebook'}</span>
                </button>
              </div>

              {/* Bottom login toggle */}
              <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                <p className="text-xs text-slate-450 dark:text-slate-400">
                  New to WebzoneBD?{' '}
                  <button
                    onClick={() => setView('register')}
                    className="font-bold text-[#8B5CF6] dark:text-pink-400 hover:underline cursor-pointer"
                  >
                    Create New Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* =====================================
              REGISTRATION VIEW
              ===================================== */}
          {view === 'register' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                  <span className="p-[3px] rounded-xl text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]">
                    <span className="p-1 rounded-lg bg-slate-900/40 inline-block">
                      <User className="w-4 h-4 text-white" />
                    </span>
                  </span>
                  <span>Create Free Account</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Join WebzoneBD IT Solution and manage your services from one secure dashboard.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Full Name
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const sanitized = sanitizeNameInput(raw);
                        // Block any non-letters and non-spaces
                        const filtered = sanitized.replace(/[^a-zA-Z\s]/g, '');
                        setRegFullName(filtered);
                        setRegFullNameError(validateFullNameField(filtered));
                      }}
                      placeholder="e.g. Al-Amin Chowdhury"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
                    />
                  </div>
                  {regFullNameError && (
                    <p className="text-[10px] text-red-500 font-medium font-mono pl-1 mt-0.5">{regFullNameError}</p>
                  )}
                </div>

                {/* Grid row for UserName and WhatsApp mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Unique Username */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                      placeholder="e.g. alamin79"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
                    />
                  </div>

                  {/* WhatsApp Mobile Number */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                      WhatsApp Number
                    </label>
                    <div className="flex gap-2 relative">
                      {/* Country Code Selection Dropdown */}
                      <div className="relative w-[30%] flex-shrink-0 group">
                        <select
                          value={regPhoneCode}
                          onChange={(e) => {
                            setRegPhoneCode(e.target.value);
                            const label = e.target.value === '+880' ? 'BD (BDT Taka)' : e.target.value === '+966' ? 'SA (SAR Riyal)' : 'Global (USD Dollar)';
                            triggerToast(`Phone Code: ${e.target.value} (${label})`);
                            setRegPhoneError(validatePhoneField(regPhone, e.target.value));
                          }}
                          className="w-full pl-2 pr-7 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-neutral border-neutral-300 dark:border-neutral-850 text-xs font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                        >
                          <option value="+880">🇧🇩 +880</option>
                          <option value="+966">🇸🇦 +966</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+91">🇮🇳 +91</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-slate-400">
                          <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Phone Local Number Input */}
                      <div className="relative w-[70%] group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                          <Phone className="w-4 h-4 text-emerald-500" />
                        </span>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, ''); // Block letters and special characters
                            setRegPhone(val);
                            setRegPhoneError(validatePhoneField(val, regPhoneCode));
                          }}
                          placeholder="e.g. 1700112233"
                          className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    {regPhoneError && (
                      <p className="text-[10px] text-red-500 font-medium font-mono mt-1 pl-1">{regPhoneError}</p>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRegEmail(val);
                        setRegEmailError(validateEmailField(val));
                      }}
                      placeholder="e.g. info@webzonebd.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
                    />
                  </div>
                  {regEmailError && (
                    <p className="text-[10px] text-red-500 font-medium font-mono pl-1 mt-0.5">{regEmailError}</p>
                  )}
                </div>

                {/* Passwords double security */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRegPassword(val);
                          setRegPasswordError(validatePasswordField(val));
                        }}
                        placeholder="••••••••"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {regPasswordError && (
                      <p className="text-[10px] text-red-500 font-medium font-mono pl-1 mt-0.5">{regPasswordError}</p>
                    )}
                    {regPassword && (
                      <div className="mt-1 space-y-1 pl-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono uppercase text-slate-400">Strength:</span>
                          <span className={`text-[9px] font-black uppercase ${
                            getPasswordStrengthLabel(regPassword) === 'Weak' ? 'text-red-500' :
                            getPasswordStrengthLabel(regPassword) === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                            {getPasswordStrengthLabel(regPassword)}
                          </span>
                        </div>
                        <div className="flex h-1 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              getPasswordStrengthLabel(regPassword) === 'Weak' ? 'w-1/3 bg-red-500' :
                              getPasswordStrengthLabel(regPassword) === 'Medium' ? 'w-2/3 bg-amber-500' : 'w-full bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRegConfirmPassword(val);
                          setRegConfirmPasswordError(validateConfirmPasswordField(val, regPassword));
                        }}
                        placeholder="••••••••"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {regConfirmPasswordError && (
                      <p className="text-[10px] text-red-500 font-medium font-mono pl-1 mt-0.5">{regConfirmPasswordError}</p>
                    )}
                  </div>
                </div>

                {/* Agreement Checkbox Terms & Privacy Policy */}
                <label className="flex items-start gap-2.5 select-none cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5 text-[#8B5CF6] border-slate-300 dark:border-slate-700 accent-[#8B5CF6] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {language === 'bn' ? (
                      <>
                        আমি{' '}
                        <span
                          id="register-terms-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onClose();
                            onNavigate?.('privacy');
                            triggerToast('শর্তাবলী ও শর্তসমূহ পেজে নিয়ে যাওয়া হচ্ছে...');
                          }}
                          className="underline text-slate-700 hover:text-[#8B5CF6] dark:text-slate-200 dark:hover:text-[#EC4899] font-bold cursor-pointer transition-colors"
                        >
                          Terms & Conditions
                        </span>{' '}
                        এবং{' '}
                        <span
                          id="register-privacy-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onClose();
                            onNavigate?.('privacy');
                            triggerToast('প্রাইভেসি পলিসি পেজে নিয়ে যাওয়া হচ্ছে...');
                          }}
                          className="underline text-slate-700 hover:text-[#8B5CF6] dark:text-slate-200 dark:hover:text-[#EC4899] font-bold cursor-pointer transition-colors"
                        >
                          Privacy Policy
                        </span>{' '}
                        নির্দেশিকাগুলির সাথে একমত।
                      </>
                    ) : language === 'ar' ? (
                      <>
                        أنا أوافق على{' '}
                        <span
                          id="register-terms-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onClose();
                            onNavigate?.('privacy');
                            triggerToast('جاري الانتقال إلى الشروط والأحكام...');
                          }}
                          className="underline text-slate-700 hover:text-[#8B5CF6] dark:text-slate-200 dark:hover:text-[#EC4899] font-bold cursor-pointer transition-colors"
                        >
                          الشروط والأحكام
                        </span>{' '}
                        و{' '}
                        <span
                          id="register-privacy-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onClose();
                            onNavigate?.('privacy');
                            triggerToast('جاري الانتقال إلى سياسة الخصوصية...');
                          }}
                          className="underline text-slate-700 hover:text-[#8B5CF6] dark:text-slate-200 dark:hover:text-[#EC4899] font-bold cursor-pointer transition-colors"
                        >
                          سياسة الخصوصية
                        </span>{' '}
                        الخاصة بنا.
                      </>
                    ) : (
                      <>
                        I agree to the{' '}
                        <span
                          id="register-terms-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onClose();
                            onNavigate?.('privacy');
                            triggerToast('Navigating to Terms & Conditions...');
                          }}
                          className="underline text-slate-700 hover:text-[#8B5CF6] dark:text-slate-200 dark:hover:text-[#EC4899] font-bold cursor-pointer transition-colors"
                        >
                          Terms & Conditions
                        </span>{' '}
                        and{' '}
                        <span
                          id="register-privacy-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onClose();
                            onNavigate?.('privacy');
                            triggerToast('Navigating to Privacy Policy...');
                          }}
                          className="underline text-slate-700 hover:text-[#8B5CF6] dark:text-slate-200 dark:hover:text-[#EC4899] font-bold cursor-pointer transition-colors"
                        >
                          Privacy Policy
                        </span>{' '}
                        guidelines.
                      </>
                    )}
                  </span>
                </label>

                {/* Submit button registration */}
                <button
                  type="submit"
                  className="w-full py-3 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:opacity-95 transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer duration-250 mt-1"
                  style={{ background: `linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)` }}
                >
                  <Smartphone className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Account</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-1.5 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider">
                  Quick Signup Federation
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Social Login Grid */}
              <div className="space-y-2">
                {isIframe && (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs flex items-start gap-2 leading-relaxed mb-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold block mb-0.5 text-slate-800 dark:text-purple-200">
                        {language === 'bn' ? '💡 প্রিভিউ ফ্রেম নোটিশ' : '💡 Live Preview Frame Detected'}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {language === 'bn' 
                          ? 'ব্রাউজারের নিরাপত্তা সীমাবদ্ধতা এড়াতে এবং গুগল লগইন নিশ্চিত করতে দয়া করে এই সাইটটি নতুন ট্যাবে ব্যবহার করুন।' 
                          : 'To bypass browser security limits and sign in with Google seamlessly, please use this site in a new browser tab.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open(window.location.href, '_blank')}
                        className="mt-1.5 inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        <span>{language === 'bn' ? 'নতুন ট্যাবে ওপেন করুন' : 'Open in New Tab'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  disabled={isGoogleLoading}
                  className="w-full h-[54px] flex items-center justify-center gap-2.5 px-4 bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-[#1f2937] border border-slate-200 dark:border-[#374151] rounded-2xl shadow-sm hover:shadow-[0_12px_30px_rgba(124,58,237,0.15)] transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 dark:text-white"
                >
                  {isGoogleLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  <span className="font-semibold text-sm">
                    {isGoogleLoading 
                      ? (language === 'bn' ? 'গুগল সংযোগ করা হচ্ছে...' : 'Connecting to Google...') 
                      : (language === 'bn' ? 'গুগল দিয়ে চালিয়ে যান' : 'Continue with Google')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-200"
                >
                  <svg className="w-4.5 h-4.5 fill-blue-600 dark:fill-blue-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>{language === 'bn' ? 'ফেসবুক দিয়ে চালিয়ে যান' : 'Continue with Facebook'}</span>
                </button>
              </div>

              {/* Bottom toggle back to login */}
              <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                <p className="text-xs text-slate-450 dark:text-slate-400">
                  Already registered?{' '}
                  <button
                    onClick={() => setView('login')}
                    className="font-bold text-[#2563EB] dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Login Now
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* =====================================
              PASSWORD RESET / FORGOT POPUP
              ===================================== */}
          {view === 'forgot' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                  <span className="p-1.5 rounded-xl text-white bg-indigo-600">
                    <Lock className="w-4 h-4 text-white" />
                  </span>
                  <span>Reset Password</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Enter your email address below to receive password reset security links automatically.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. register@webzonebd.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </button>
              </form>

              <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                <button
                  onClick={() => setView('login')}
                  className="font-bold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer text-xs"
                >
                  ← Back to Secure Login
                </button>
              </div>
            </div>
          )}

          {/* =====================================
              SUCCESS POPUP VIEW - WITH VERIFIED WELCOME EMAIL PREVIEW
              ===================================== */}
          {view === 'success' && (
            <div className="space-y-6 text-center py-2 animate-in fade-in zoom-in duration-350">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500 animate-bounce">
                  <CheckCircle2 className="w-12 h-12 stroke-[2]" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
                    Account Created Successfully
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Welcome to WebzoneBD IT Agency. Your account is ready to use.
                  </p>
                </div>
              </div>

              {/* WELCOME EMAIL SIMULATOR TEMPLATE PREVIEW BOX */}
              {lastRegisteredUser && (
                <div className="border border-indigo-500/25 dark:border-slate-800 bg-indigo-500/5 rounded-2xl p-4 text-left space-y-3 font-sans relative overflow-hidden">
                  
                  {/* Embedded envelope watermark decorative shape */}
                  <div className="absolute -right-6 -bottom-6 text-indigo-500/5 select-none rotate-12 pointer-events-none">
                    <Mail className="w-32 h-32" />
                  </div>

                  <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2.5 text-[10px]">
                    <div className="space-y-0.5">
                      <p className="text-slate-400 font-mono">
                        <span className="font-bold text-slate-500 dark:text-slate-350">FROM:</span> info@webzonebd.com
                      </p>
                      <p className="text-slate-400 font-mono">
                        <span className="font-bold text-slate-500 dark:text-slate-350">TO:</span> {lastRegisteredUser.email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-mono font-black uppercase rounded text-[8px] tracking-wider border border-emerald-500/15">
                      📧 Welcome Email Dispatched
                    </span>
                  </div>

                  {/* Mail Subject line heading */}
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Subject: Welcome to WebzoneBD IT Agency – Your Account is Ready</span>
                  </div>

                  {/* Scrollable Email client viewport */}
                  <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-mono max-h-52 overflow-y-auto space-y-3.5">
                    <p>Dear <strong className="text-slate-900 dark:text-white font-bold">{lastRegisteredUser.name}</strong>,</p>
                    
                    <p>Thank you for joining WebzoneBD IT Solution.</p>
                    
                    <p>We are pleased to inform you that your account has been successfully created.</p>
                    
                    <div className="border-l-3 border-[#2563EB] pl-3 py-1 bg-slate-550/5 dark:bg-slate-900/40 rounded space-y-1 my-2">
                      <p className="font-bold uppercase tracking-wider text-[9px] text-[#2563EB] dark:text-cyan-400">Account Information</p>
                      <p><span className="text-slate-450">Full Name:</span> {lastRegisteredUser.name}</p>
                      <p><span className="text-slate-450">Email Address:</span> {lastRegisteredUser.email}</p>
                      <p><span className="text-slate-450">Username:</span> {lastRegisteredUser.username}</p>
                      <p><span className="text-slate-450">Login URL:</span> <a href="https://www.webzonebd.com/login" target="_blank" className="text-[#2563EB] hover:underline">https://www.webzonebd.com/login</a></p>
                    </div>

                    <p>You can now access your customer dashboard to manage:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400 text-[10px]">
                      <li>Hosting Services</li>
                      <li>Domain Registrations</li>
                      <li>Website Development Projects</li>
                      <li>Digital Products & Downloads</li>
                      <li>Invoices & Billing</li>
                      <li>Support Tickets</li>
                      <li>Affiliate Program</li>
                    </ul>

                    <p className="italic text-slate-450 text-[10px] border-t border-slate-100 dark:border-slate-800 pt-2 text-center">
                      🔐 For security reasons, we recommend changing your password after your first login.
                    </p>

                    <div className="pt-2 text-[10px] space-y-0.5 text-slate-500 dark:text-slate-450">
                      <p>Website: <a href="https://www.webzonebd.com" className="text-cyan-500">https://www.webzonebd.com</a></p>
                      <p>Email: info@webzonebd.com</p>
                      <p>WhatsApp: +966 570511931</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-850 font-sans text-[10px]">
                      <p className="font-bold text-slate-700 dark:text-slate-350">Best Regards,</p>
                      <p className="font-black text-[#2563EB] dark:text-cyan-450">WebzoneBD IT Solution</p>
                      <p className="text-slate-455 text-[9px]">Technology & Digital Business Solutions</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interaction grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setView('login')}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black uppercase rounded-xl transition border border-slate-205 dark:border-slate-800 cursor-pointer text-center pointer-events-auto active:scale-95 duration-200"
                >
                  Login Now
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 duration-200 pointer-events-auto"
                  style={{ background: `linear-gradient(135deg, #2563EB 0%, #8B5CF6 50%, #06B6D4 100%)` }}
                >
                  <span>Go To Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

        {showPartitionError && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="w-full max-w-md p-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <ShieldAlert className="w-8 h-8 shrink-0 text-purple-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'গুগল সাইন-ইন সমাধান' : 'Google Sign-In Help Required'}
                </h3>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {language === 'bn' 
                  ? 'ব্রাউজারের সিকিউরিটি পলিসি (Storage Partitioning) এর কারণে এই প্রিভিউ ফ্রেমের ভেতর সরাসরি গুগল লগইন সম্পন্ন করা যাচ্ছে না। এটি সমাধানের জন্য অনুগ্রহ করে অ্যাপটি একটি নতুন ট্যাবে ওপেন করে গুগল সাইন-ইন সম্পন্ন করুন।' 
                  : 'Due to browser iframe security restrictions (Storage Partitioning), Google Sign-In is blocked inside this preview frame. To resolve this instantly, please open WebzoneBD in a new tab to complete your secure sign-in.'}
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    window.open(window.location.href, '_blank');
                  }}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in New Tab'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPartitionError(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-xs font-semibold cursor-pointer"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close / Go Back'}
                </button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
