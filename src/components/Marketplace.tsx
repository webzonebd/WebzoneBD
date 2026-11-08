import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Star, ShoppingCart, ExternalLink, Filter, HelpCircle, 
  ChevronRight, ChevronLeft, BadgePercent, CheckCircle2, ChevronDown, Heart,
  Play, ShoppingBag, Search, Plus, Trash2, Edit, Sliders, 
  ArrowRight, Sparkles, SlidersHorizontal, Eye, Tag, Download, 
  Check, X, RefreshCw, Layers, Copy, Zap, LayoutGrid, List,
  TrendingUp, Award, Settings, FileSpreadsheet, Mic, MicOff,
  MessageSquare, Send, User
} from 'lucide-react';
import { Product, Language, Theme, Currency } from '../types';
import { 
  defaultStoreCategories, 
  defaultStoreSubCategories, 
  getSeedProducts, 
  StoreCategory, 
  StoreSubCategory 
} from './StoreData';
import { motion, AnimatePresence } from 'motion/react';
import { MarketplaceGridSkeleton } from './skeletons/MarketplaceSkeleton';
import StoreHeroSlider from './StoreHeroSlider';

interface MarketplaceProps {
  language: Language;
  theme: Theme;
  addToCart: (product: Product, eventOrOrigin?: any) => void;
  setCartOpen?: (open: boolean) => void;
  searchTerm: string;
  currency?: Currency;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  currencySettings?: any;
  isAdmin?: boolean;
  user?: any;
  triggerToast?: (msg: string) => void;
  onOpenLogin?: () => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onViewProduct?: (product: Product) => void;
  onQuickBuy?: (product: Product, eventOrOrigin?: any) => void;
}

export default function Marketplace({ 
  language, 
  theme, 
  addToCart, 
  setCartOpen, 
  searchTerm: parentSearchTerm, 
  currency = 'USD',
  wishlist = [],
  toggleWishlist,
  currencySettings,
  isAdmin,
  user,
  triggerToast,
  onOpenLogin,
  onUpdateProduct,
  onViewProduct,
  onQuickBuy
}: MarketplaceProps) {
  
  // -----------------------------------------------------
  // STATES & PERSISTENCE
  // -----------------------------------------------------

  // Categories & Subcategories State
  const [categories, setCategories] = useState<StoreCategory[]>(() => {
    const saved = localStorage.getItem('webzone_store_categories');
    return saved ? JSON.parse(saved) : defaultStoreCategories;
  });

  // Track item just added to wishlist for immediate subtle heart pulse feedback
  const [recentlyAddedWishlistId, setRecentlyAddedWishlistId] = useState<string | null>(null);

  // Centralized Quick Buy Handler
  const handleQuickBuy = (prod: Product, e?: any) => {
    if (onQuickBuy) {
      onQuickBuy(prod, e);
    } else {
      addToCart(prod, e);
      if (setCartOpen) {
        setCartOpen(true);
      }
      if (triggerToast) {
        triggerToast(
          language === 'bn' 
            ? `⚡ ${prod.nameBn || prod.name} কার্টে যোগ হয়েছে! চেকআউটে নেওয়া হচ্ছে...` 
            : `⚡ ${prod.name} added! Redirecting to checkout...`
        );
      }
    }
  };

  const [subCategories, setSubCategories] = useState<StoreSubCategory[]>(() => {
    const saved = localStorage.getItem('webzone_store_subcategories');
    return saved ? JSON.parse(saved) : defaultStoreSubCategories;
  });

  // Products state (defaults to 60 products under 20 categories)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('webzone_store_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        return parsed.map(p => {
          if (p.image) {
            if (p.image.includes('photo-1460925895917-afdab827c52f')) {
              p.image = p.image.replace('photo-1460925895917-afdab827c52f', 'photo-1557821552-17105176677c');
            }
            if (p.image.includes('photo-1504711434969-e33886168f5c')) {
              p.image = p.image.replace('photo-1504711434969-e33886168f5c', 'photo-1585829365295-ab7cd400c167');
            }
            if (p.image.includes('photo-1499750310107-5fef28a66643')) {
              p.image = p.image.replace('photo-1499750310107-5fef28a66643', 'photo-1486312338219-ce68d2c6f44d');
            }
            if (p.image.includes('photo-1522071820081-009f0129c71c')) {
              p.image = p.image.replace('photo-1522071820081-009f0129c71c', 'photo-1516321318423-f06f85e504b3');
            }
          }
          return p;
        });
      } catch (e) {
        return getSeedProducts();
      }
    }
    return getSeedProducts();
  });

  // Sync state modifications down to LocalStorage
  useEffect(() => {
    localStorage.setItem('webzone_store_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('webzone_store_subcategories', JSON.stringify(subCategories));
  }, [subCategories]);

  useEffect(() => {
    localStorage.setItem('webzone_store_products', JSON.stringify(products));
  }, [products]);

  // Admin and interaction toggles
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const userStr = localStorage.getItem('webzone_session_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return u?.role === 'admin';
      } catch(e){}
    }
    return false;
  });

  useEffect(() => {
    if (isAdmin || user?.role === 'admin') {
      setIsAdminMode(true);
    }
  }, [isAdmin, user]);

  const [openAdminPanel, setOpenAdminPanel] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'categories' | 'subcategories' | 'bulk'>('products');

  // Search & Filtering State
  const [localSearch, setLocalSearch] = useState<string>(parentSearchTerm || '');

  // Voice Search Web Speech API state
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Clean up speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Cleanup error stopping speech recognition:", err);
        }
      }
    };
  }, []);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg = language === 'bn' ? "আপনার ব্রাউজার ভয়েস সার্চ সমর্থন করে না।" : language === 'ar' ? "متصفحك لا يدعم البحث الصوتي." : "Your browser does not support Web Speech voice search.";
      if (triggerToast) triggerToast(`⚠️ ${msg}`);
      else alert(msg);
      return;
    }

    try {
      // If already listening, stop the active recognition instance
      if (isListening) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = false;
      recognition.lang = language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech session dynamic feedback:", event?.error || event);
        setIsListening(false);
        const errType = event.error || '';
        if (errType === 'not-allowed') {
          const msg = language === 'bn'
            ? "মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি অথবা আইফ্রেম সিকিউরিটি পলিসি দ্বারা এটি অবরুদ্ধ করা হয়েছে। অনুগ্রহ করে অ্যাপটি নতুন ট্যাবে (New Tab) ওপেন করুন।"
            : "Microphone permission is denied or restricted by iframe security. Please open the application in a new tab to use voice search.";
          if (triggerToast) triggerToast(`🛑 ${msg}`);
          else console.warn(msg);
        } else if (errType === 'no-speech') {
          // Speech recognition timed out or heard nothing
        } else if (errType) {
          const msg = language === 'bn'
            ? `ভয়েস রিকগনিশন ত্রুটি: ${errType}`
            : `Speech recognition error encountered: ${errType}`;
          if (triggerToast) triggerToast(`⚠️ ${msg}`);
          else console.warn(msg);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const textResult = event.results[0][0].transcript;
        if (textResult) {
          // Remove punctuation and trim whitespace
          const cleanedText = textResult.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
          if (cleanedText) {
            setLocalSearch(cleanedText);
            // Autofocus input so user can see what has been searched or type more
            const searchInput = document.querySelector('input[placeholder*="search"]') || document.querySelector('input[type="text"]');
            if (searchInput) {
              (searchInput as HTMLInputElement).focus();
            }

            // --- Voice-to-Cart Auto-Matching and Trigger ---
            const lowerSearch = cleanedText.toLowerCase();
            const matchedProduct = products.find(p => {
              const nameLower = p.name ? p.name.toLowerCase() : '';
              const nameBnLower = p.nameBn ? p.nameBn.toLowerCase() : '';
              const nameArLower = p.nameAr ? p.nameAr.toLowerCase() : '';
              const tagsLower = p.tags ? p.tags.map(t => t.toLowerCase()) : [];
              
              return (
                nameLower.includes(lowerSearch) ||
                nameBnLower.includes(lowerSearch) ||
                nameArLower.includes(lowerSearch) ||
                lowerSearch.includes(nameLower) ||
                tagsLower.some(t => t.includes(lowerSearch) || lowerSearch.includes(t))
              );
            });

            if (matchedProduct) {
              // Add product to cart automatically
              addToCart(matchedProduct);

              // Smoothly slide open shopping cart panel so user gets immediate visual feedback
              if (setCartOpen) {
                setCartOpen(true);
              }
            }
          }
        }
      };

      recognition.start();
    } catch (e) {
      console.error("Error starting speech recognition:", e);
      setIsListening(false);
    }
  };
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(300); // Max USD
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all'); // Filter by Badge: Best Seller, etc
  const [sortBy, setSortBy] = useState<string>('featured'); // featured, sales, price-asc, price-desc, rating
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Pagination State (8 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 8;

  // Loading & Skeleton State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Initial load skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 420);
    return () => clearTimeout(timer);
  }, []);

  // Category / filter transition skeleton effect
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 320);
    return () => clearTimeout(timer);
  }, [activeCategory, activeSubCategory, selectedLicense, selectedBadge, sortBy]);

  const handleRefreshCatalog = () => {
    setIsRefreshing(true);
    if (triggerToast) {
      triggerToast(language === 'bn' ? 'মার্কেটপ্লেস ক্যাটালগ রিফ্রেশ হচ্ছে... 🔄' : 'Syncing marketplace product catalog... 🔄');
    }
    setTimeout(() => {
      setIsRefreshing(false);
      if (triggerToast) {
        triggerToast(language === 'bn' ? '✓ ক্যাটালগ সফলভাবে আপডেট হয়েছে!' : '✓ Catalog synced & up to date!');
      }
    }, 600);
  };

  // Reset page to 1 when any search, category, or filter criteria alters
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch, activeCategory, activeSubCategory, priceRange, selectedLicense, selectedBadge, sortBy]);

  // Search suggestions and Recents state
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('webzone_recent_views');
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Product detail pop-up
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const [coupons, setCoupons] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('webzone_coupons');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { code: "WEBZONE20", discountPercent: 20, expiryDate: "2026-12-31" },
      { code: "EID2026", discountPercent: 15, expiryDate: "2026-06-30" },
      { code: "WELCOME", discountPercent: 10, expiryDate: "2026-12-31" }
    ];
  });
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Sync state with storage events to support live updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem('webzone_coupons');
        if (saved) {
          setCoupons(JSON.parse(saved));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // CMS forms states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductFeatureText, setNewProductFeatureText] = useState('');
  const [newProductFeatureTextBn, setNewProductFeatureTextBn] = useState('');
  const [newProductFeatureTextAr, setNewProductFeatureTextAr] = useState('');
  const [activeFeatureLangTab, setActiveFeatureLangTab] = useState<'en' | 'bn' | 'ar'>('en');
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', nameBn: '', nameAr: '',
    category: 'ready-websites', subCategory: '',
    price: 39, discountPrice: undefined,
    rating: 4.8, reviewsCount: 12, downloadsCount: 20, views: 240,
    badge: 'New', isFeatured: false, isTrending: false, isBestSeller: false,
    licenseType: 'regular',
    image: '', demoUrl: '', downloadUrl: '',
    tags: [], features: [], featuresBn: [], featuresAr: [],
    description: '', descriptionBn: '', descriptionAr: ''
  });

  const [categoryForm, setCategoryForm] = useState<Partial<StoreCategory>>({
    id: '', name: '', nameBn: '', nameAr: '', description: '', descriptionBn: '', descriptionAr: ''
  });
  const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);

  const [subForm, setSubForm] = useState<Partial<StoreSubCategory>>({
    id: '', categoryId: 'ready-websites', name: '', nameBn: '', nameAr: ''
  });

  // Review Submission States
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);

  // Reset form when active product changes
  useEffect(() => {
    setNewRating(5);
    setNewComment('');
  }, [activeProduct]);

  // Trigger values if parent alters the search
  useEffect(() => {
    if (parentSearchTerm !== undefined) {
      setLocalSearch(parentSearchTerm);
    }
  }, [parentSearchTerm]);

  // -----------------------------------------------------
  // CURRENCY & CONVERSION LOGIC
  // -----------------------------------------------------
  const formatPrice = (usd: number) => {
    let cur = currency;
    let rates = { USD: 1.0, BDT: 118.5, SAR: 3.75 };
    if (currencySettings) {
      rates = currencySettings.rates || rates;
      if (currencySettings.enabled && !currencySettings.enabled[cur]) {
        cur = currencySettings.defaultCurrency || 'USD';
      }
    }
    const rate = rates[cur] ?? 1.0;
    const converted = usd * rate;

    switch (cur) {
      case 'BDT':
        return `৳ ${Math.round(converted).toLocaleString()}`;
      case 'SAR':
        return `﷼ ${converted.toFixed(2)}`;
      case 'USD':
      default:
        return `$ ${converted.toFixed(2)}`;
    }
  };

  // -----------------------------------------------------
  // REAL-TIME PREDICTIVE SEARCH AUTOCOMPLETE & MATCHING
  // -----------------------------------------------------
  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    return (
      <>
        {before}
        <mark className="bg-purple-500/25 text-purple-700 dark:text-purple-300 font-bold px-0.5 rounded">
          {match}
        </mark>
        {after}
      </>
    );
  };

  const predictiveSearchResults = useMemo(() => {
    const raw = localSearch.trim();
    if (!raw) return { products: [], categories: [], total: 0 };
    const query = raw.toLowerCase();

    // Score and match products
    const matched = products.map(p => {
      let score = 0;
      const nameLower = (p.name || '').toLowerCase();
      const nameBnLower = (p.nameBn || '').toLowerCase();
      const nameArLower = (p.nameAr || '').toLowerCase();
      const categoryName = (getCategoryName(p.category) || '').toLowerCase();
      const subCat = (p.subCategory || '').toLowerCase();
      const tags = (p.tags || []).map(t => t.toLowerCase());
      const desc = (p.description || '').toLowerCase();

      // Exact title match gets highest score
      if (nameLower === query || nameBnLower === query) score += 100;
      else if (nameLower.startsWith(query) || nameBnLower.startsWith(query)) score += 60;
      else if (nameLower.includes(query) || nameBnLower.includes(query) || nameArLower.includes(query)) score += 40;

      // Category / SubCategory matches
      if (categoryName.includes(query) || p.category.toLowerCase().includes(query)) score += 30;
      if (subCat.includes(query)) score += 25;

      // Tags match
      if (tags.some(t => t === query)) score += 35;
      else if (tags.some(t => t.includes(query))) score += 20;

      // Description match
      if (desc.includes(query)) score += 10;

      return { product: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

    // Matching categories
    const matchingCategoryIds: string[] = Array.from(new Set(matched.map(m => m.product.category)));
    const matchingCategories = matchingCategoryIds.map((catId: string) => {
      const count = matched.filter(m => m.product.category === catId).length;
      return { id: catId, name: getCategoryName(catId), count };
    }).slice(0, 4);

    return {
      products: matched.slice(0, 6).map(m => m.product),
      categories: matchingCategories,
      total: matched.length
    };
  }, [localSearch, products, categories, language]);

  const searchSuggestionsList = useMemo(() => {
    return predictiveSearchResults.products.map(p => ({
      id: p.id,
      text: p.name,
      category: p.category
    }));
  }, [predictiveSearchResults]);

  const handleSuggestionClick = (text: string, categoryId?: string) => {
    setLocalSearch(text);
    if (categoryId) setActiveCategory(categoryId);
    setShowSuggestions(false);
  };

  // Recently Viewed Cache Handlers
  const handleViewProduct = (product: Product) => {
    if (onViewProduct) {
      onViewProduct(product);
    } else {
      setActiveProduct(product);
    }
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== product.id);
      const updated = [product.id, ...filtered].slice(0, 5);
      localStorage.setItem('webzone_recent_views', JSON.stringify(updated));
      return updated;
    });
  };

  // -----------------------------------------------------
  // FILTER ENGINE
  // -----------------------------------------------------
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Search query match
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.nameAr.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }

    // Subcategory filter
    if (activeSubCategory !== 'all') {
      list = list.filter(p => p.subCategory === activeSubCategory);
    }

    // Max Price Filter
    list = list.filter(p => (p.discountPrice || p.price) <= priceRange);

    // License Type Filter
    if (selectedLicense !== 'all') {
      list = list.filter(p => p.licenseType?.toLowerCase() === selectedLicense.toLowerCase());
    }

    // Badge / Status Filter
    if (selectedBadge !== 'all') {
      if (selectedBadge === 'Featured') {
        list = list.filter(p => p.isFeatured === true || p.badge === 'Featured');
      } else if (selectedBadge === 'Trending') {
        list = list.filter(p => p.isTrending === true || p.badge === 'Trending');
      } else if (selectedBadge === 'Best Seller') {
        list = list.filter(p => p.isBestSeller === true || p.badge === 'Best Seller');
      } else {
        list = list.filter(p => p.badge === selectedBadge);
      }
    }

    // Sort order
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'sales') {
      list.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
    } else if (sortBy === 'latest') {
      // higher ID or seed count first
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [products, localSearch, activeCategory, activeSubCategory, priceRange, selectedLicense, selectedBadge, sortBy]);

  // Subset of exactly 6 items for premium paginated layouts
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return processedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [processedProducts, currentPage, productsPerPage]);

  // Count matches to define total pages
  const totalPages = useMemo(() => {
    return Math.ceil(processedProducts.length / productsPerPage) || 1;
  }, [processedProducts.length, productsPerPage]);

  // Dynamically count matches per category to satisfy Envato Style Sidebar UX
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  // -----------------------------------------------------
  // RELATED RECOMMENDATION ENGINE (6 MODULES IN TOTAL)
  // -----------------------------------------------------
  const productRecommendations = useMemo(() => {
    if (!activeProduct) {
      return {
        similar: [],
        customersAlsoViewed: [],
        frequentlyBoughtTogether: [],
        trending: [],
        recommendedForYou: []
      };
    }

    // Filter out active product so it doesn't suggest itself
    const pool = products.filter(p => p.id !== activeProduct.id);

    // 1. Similar Products: same category
    const similar = pool.filter(p => p.category === activeProduct.category).slice(0, 6);

    // 2. Customers Also Viewed: shared tags or same price brackets (+/- $30)
    const activePrice = activeProduct.discountPrice || activeProduct.price;
    const customersAlsoViewed = pool.filter(p => {
      const priceVal = p.discountPrice || p.price;
      const similarPrice = Math.abs(priceVal - activePrice) <= 35;
      const sharedTags = p.tags.some(t => activeProduct.tags.includes(t));
      return similarPrice || sharedTags;
    }).slice(0, 6);

    // 3. Frequently Bought Together: complementary categories or products
    const frequentlyBoughtTogether = pool.filter(p => {
      // pairing e.g., plugins with themes, payment modules with scripts
      if (activeProduct.category === 'wordpress-themes' && p.category === 'premium-plugins') return true;
      if (activeProduct.category === 'ready-websites' && p.category === 'wordpress-themes') return true;
      if (activeProduct.category === 'php-scripts' && p.category === 'payment-solutions') return true;
      return p.rating >= 4.8;
    }).slice(0, 6);

    // 4. Trending Products: isTrending flag or high ratings
    const trending = pool.filter(p => p.isTrending || p.badge === 'Trending' || p.views > 300).slice(0, 6);

    // 5. Recommended For You: high rated or featured items in the catalog
    const recommendedForYou = pool.filter(p => p.isFeatured || p.rating >= 4.9).slice(0, 6);

    return {
      similar: similar.length ? similar : pool.slice(0, 6),
      customersAlsoViewed: customersAlsoViewed.length ? customersAlsoViewed : pool.slice(1, 7),
      frequentlyBoughtTogether: frequentlyBoughtTogether.length ? frequentlyBoughtTogether : pool.slice(2, 8),
      trending: trending.length ? trending : pool.slice(3, 9),
      recommendedForYou: recommendedForYou.length ? recommendedForYou : pool.slice(4, 10)
    };
  }, [activeProduct, products]);

  // -----------------------------------------------------
  // HELPERS FOR PRODUCT REVIEWS
  // -----------------------------------------------------
  const getProductReviews = (product: Product) => {
    if (product.reviews && product.reviews.length > 0) {
      return product.reviews;
    }
    
    // Seeded high fidelity reviews based on product ID to make the app look complete
    const seededReviews: Record<string, any[]> = {
      'prod-1': [
        {
          id: 'rev-seed-1',
          userId: 'user-seed-1',
          userName: 'Rashedul Islam',
          rating: 5,
          comment: language === 'bn' ? 'অসাধারণ স্ক্রিপ্ট! পেমেন্ট গেটওয়েগুলো খুব সহজেই সেটআপ করতে পেরেছি।' : language === 'ar' ? 'سكربت رائع جداً! ميزات الدفع سهلة الإعداد والتثبيت.' : 'Outstanding script! Successfully configured all local payment gateways in under an hour.',
          createdAt: '2026-06-25T10:30:00Z'
        },
        {
          id: 'rev-seed-2',
          userId: 'user-seed-2',
          userName: 'Abu Bakar',
          rating: 4,
          comment: language === 'bn' ? 'অ্যাডমিন প্যানেল খুব শক্তিশালী এবং লোডিং স্পিড অনেক ভালো।' : language === 'ar' ? 'لوحة تحكم المسؤول قوية جداً وسرعة تحميل ممتازة.' : 'Admin panel is incredibly powerful, and overall speed is top tier.',
          createdAt: '2026-06-28T14:15:00Z'
        }
      ],
      'prod-2': [
        {
          id: 'rev-seed-3',
          userId: 'user-seed-3',
          userName: 'Fahmida Yeasmin',
          rating: 5,
          comment: language === 'bn' ? 'আমার ওয়েবসাইটটি এখন গুগল স্পিড টেস্টে ৯৯% স্কোর পাচ্ছে! দারুণ থিম!' : language === 'ar' ? 'حصل موقعي الآن على درجة 99٪ في اختبار سرعة قوقل. قالب ممتاز!' : 'My news portal loads in under a second and is incredibly clean. Elementor blocks are superb!',
          createdAt: '2026-06-12T08:00:00Z'
        }
      ],
      'prod-3': [
        {
          id: 'rev-seed-4',
          userId: 'user-seed-4',
          userName: 'Imtiaz Ahmed',
          rating: 5,
          comment: language === 'bn' ? 'খুবই কম দামে এত সুন্দর ব্লগার থিম আর কোথাও পাওয়া যাবে না।' : language === 'ar' ? 'سعر رائع جداً مقارنة بالميزات المتاحة. قالب متجاوب ونظيف.' : 'Very responsive blogger template. Perfect SEO markup.',
          createdAt: '2026-06-18T11:45:00Z'
        }
      ]
    };

    return seededReviews[product.id] || [];
  };

  // -----------------------------------------------------
  // REVIEW SUBMISSION AND HANDLING
  // -----------------------------------------------------
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    if (!user) {
      if (onOpenLogin) {
        onOpenLogin();
      } else if (triggerToast) {
        triggerToast(t.pleaseLoginToReview);
      } else {
        alert(t.pleaseLoginToReview);
      }
      return;
    }

    if (!newComment.trim()) {
      const errMsg = language === 'bn' ? "দয়া করে একটি মন্তব্য লিখুন!" : language === 'ar' ? "يرجى كتابة تعليق!" : "Please write a comment!";
      if (triggerToast) triggerToast(errMsg);
      else alert(errMsg);
      return;
    }

    setReviewSubmitting(true);

    try {
      const newReview = {
        id: `rev-${Date.now()}`,
        userId: user.id || 'user-id',
        userName: user.name || user.username || user.email || 'Anonymous Client',
        userAvatar: user.avatar,
        rating: newRating,
        comment: newComment.trim(),
        createdAt: new Date().toISOString()
      };

      const currentReviews = getProductReviews(activeProduct);
      const updatedReviews = [newReview, ...currentReviews];

      const newCount = updatedReviews.length;
      const ratingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newAvgRating = parseFloat((ratingSum / newCount).toFixed(1));

      const updatedProduct = {
        ...activeProduct,
        reviews: updatedReviews,
        rating: newAvgRating,
        reviewsCount: newCount
      };

      const updatedProducts = products.map(p => p.id === activeProduct.id ? updatedProduct : p);
      setProducts(updatedProducts);
      setActiveProduct(updatedProduct);

      if (onUpdateProduct) {
        onUpdateProduct(updatedProduct);
      }

      setNewComment('');
      setNewRating(5);

      if (triggerToast) {
        triggerToast(`🎉 ${t.reviewSuccess}`);
      } else {
        alert(t.reviewSuccess);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // -----------------------------------------------------
  // ADMIN CMS FUNCTIONS (WRITE OPERATIONS)
  // -----------------------------------------------------

  // Product Add / Edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category) {
      alert("Name and Category fields are mandatory.");
      return;
    }

    const priceNum = Number(productForm.price) || 0;
    const discountNum = productForm.discountPrice ? Number(productForm.discountPrice) : undefined;

    if (editingProduct) {
      // Modify
      const updated = products.map(p => p.id === editingProduct.id ? {
        ...p,
        ...productForm,
        price: priceNum,
        discountPrice: discountNum
      } as Product : p);
      setProducts(updated);
      setEditingProduct(null);
      alert("Product details updated successfully!");
    } else {
      // Create new
      const newId = `prod-cms-${Date.now()}`;
      const newProd: Product = {
        id: newId,
        name: productForm.name || '',
        nameBn: productForm.nameBn || productForm.name || '',
        nameAr: productForm.nameAr || productForm.name || '',
        category: productForm.category || 'ready-websites',
        subCategory: productForm.subCategory || '',
        price: priceNum,
        discountPrice: discountNum,
        rating: Number(productForm.rating) || 4.8,
        reviewsCount: Number(productForm.reviewsCount) || 12,
        downloadsCount: Number(productForm.downloadsCount) || 12,
        views: Number(productForm.views) || 90,
        badge: productForm.badge || 'New',
        isFeatured: !!productForm.isFeatured,
        isTrending: !!productForm.isTrending,
        isBestSeller: !!productForm.isBestSeller,
        licenseType: productForm.licenseType || 'regular',
        image: productForm.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        demoUrl: productForm.demoUrl || 'https://demo.webzonebd.com',
        downloadUrl: productForm.downloadUrl || '#',
        tags: typeof productForm.tags === 'string' ? (productForm.tags as string).split(',').map(s=>s.trim()) : (productForm.tags || []),
        features: typeof productForm.features === 'string' ? (productForm.features as string).split(',').map(s=>s.trim()) : (productForm.features || ["Fully optimized", "cPanel Ready"]),
        featuresBn: typeof productForm.featuresBn === 'string' ? (productForm.featuresBn as string).split(',').map(s=>s.trim()) : (productForm.featuresBn || ["সহজ ইনস্টলেশন"]),
        featuresAr: typeof productForm.featuresAr === 'string' ? (productForm.featuresAr as string).split(',').map(s=>s.trim()) : (productForm.featuresAr || ["مهيأ بالكامل"]),
        description: productForm.description || 'Highly responsive premium files.',
        descriptionBn: productForm.descriptionBn || 'সহজ ও আকর্ষণীয় ডিজাইন।',
        descriptionAr: productForm.descriptionAr || 'تنسيق حديث ومتكامل للغاية.'
      };
      setProducts([newProd, ...products]);
      alert("New Premium Product created successfully!");
    }

    // Reset Form
    setProductForm({
      name: '', nameBn: '', nameAr: '', category: 'ready-websites', subCategory: '',
      price: 39, discountPrice: undefined, rating: 4.8, reviewsCount: 12, downloadsCount: 20, views: 240,
      badge: 'New', isFeatured: false, isTrending: false, isBestSeller: false, licenseType: 'regular',
      image: '', demoUrl: '', downloadUrl: '', tags: [], features: [], featuresBn: [], featuresAr: [],
      description: '', descriptionBn: '', descriptionAr: ''
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product? This action is irreversible.")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    // Scroll form into focus or just keep visible
  };

  // Category Add / Edit / Delete
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.id || !categoryForm.name) {
      alert("ID and Category Name are required.");
      return;
    }

    if (editingCategory) {
      const updated = categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryForm } : c);
      setCategories(updated);
      setEditingCategory(null);
      alert("Category modified successfully!");
    } else {
      // Check existing ID
      if (categories.some(c => c.id === categoryForm.id)) {
        alert("This category ID already exists. Please choose another.");
        return;
      }
      setCategories([...categories, categoryForm as StoreCategory]);
      alert("New category registered successfully!");
    }
    setCategoryForm({ id: '', name: '', nameBn: '', nameAr: '', description: '', descriptionBn: '', descriptionAr: '' });
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm(`Are you sure you want to delete Category "${catId}"? All matching products will sit without category.`)) {
      setCategories(categories.filter(c => c.id !== catId));
    }
  };

  // Sub-Category CMS
  const handleSaveSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.id || !subForm.name) {
      alert("ID and Sub-Category Name are required.");
      return;
    }
    setSubCategories([...subCategories, subForm as StoreSubCategory]);
    alert("Sub-Category added successfully!");
    setSubForm({ id: '', categoryId: 'ready-websites', name: '', nameBn: '', nameAr: '' });
  };

  const handleDeleteSub = (subId: string) => {
    if (confirm("Delete this sub-category?")) {
      setSubCategories(subCategories.filter(s => s.id !== subId));
    }
  };

  // Bulk Import System (restores default scripts instantly)
  const handleBulkRestore = () => {
    if (confirm("Would you like to import/reset the entire catalog with 60 high-fidelity Envato projects? This merges with any active custom changes.")) {
      const defaultProducts = getSeedProducts();
      // Union merge based on ID
      const merged = [...products];
      defaultProducts.forEach(seed => {
        if (!merged.some(m => m.id === seed.id)) {
          merged.push(seed);
        }
      });
      setProducts(merged);
      setCategories(defaultStoreCategories);
      setSubCategories(defaultStoreSubCategories);
      alert(`Merged complete dataset. Responsive Digital Store has ${merged.length} items loaded!`);
    }
  };

  // -----------------------------------------------------
  // TRANSLATION STRINGS MAPPING
  // -----------------------------------------------------
  const t = {
    en: {
      heading: "Envato Digital Store Hub",
      subheading: "Secure, professional-grade source codes, SaaS applications, payment widgets, and custom portals with lifetime updates.",
      searchPlaceholder: "Search themes, scripts, licenses, or solutions...",
      filtersLabel: "Search Filters & Criteria",
      clearFilters: "Reset Matrix",
      categoryTitle: "Digital Categories",
      licenseLabel: "License Grade",
      badgeFilters: "Marketplace Badges",
      sortByLabel: "Sort Listing",
      priceLabel: "Max Price Value",
      licenseRegular: "Regular Use License",
      licenseExtended: "Extended Developer",
      licenseGeneral: "General Products",
      bestSeller: "Weekly Best Sellers",
      trendingBadge: "Trending Code",
      matchedCount: "Items Released",
      watchLive: "Live Demo",
      buyNow: "File Download",
      viewDetails: "View Specifications",
      noMatched: "No products matched your specified filter layout.",
      similarLabel: "Similar Dynamic Items",
      alsoViewed: "Customers Also Viewed",
      frequentBought: "Frequently Bought Together",
      trendingNow: "Trending In Marketplace",
      recommendedFor: "Recommended For You",
      adminBtn: "Store Admin Mode 🛠️",
      adminTitle: "WebzoneBD CMS Control Terminal",
      bulkTitle: "Database Seed & Recovery",
      bulkDesc: "Merge the prefilled catalog with 60 advanced product relationship matrices setup.",
      closeAdmin: "Exit Workspace",
      recentlyViewedTitle: "Recently Viewed Products",
      recentlyViewedSub: "The last 5 premium digital products you viewed.",
      clearHistory: "Clear History",
      reviewsTitle: "Customer Reviews & Feedbacks",
      noReviews: "No reviews yet. Be the first to review this product!",
      writeReview: "Write a Review",
      ratingLabel: "Your Rating",
      commentLabel: "Your Comment",
      submitReview: "Submit Review",
      reviewSuccess: "Review submitted successfully!",
      pleaseLoginToReview: "Please sign in to submit a review.",
      loginBtn: "Sign In"
    },
    bn: {
      heading: "ওয়েবজোনবিডি প্রিমিয়াম প্রোডাক্ট স্টোর",
      subheading: "যাচাইকৃত সোর্স কোড, পিএইচপি স্ক্রিপ্ট, ওয়ার্ডপ্রেস থিম এবং মোবাইল অ্যাপ সোর্স কোডসমূহ এখানে পাবেন।",
      searchPlaceholder: "থিম, স্ক্রিপ্ট, লাইসেন্স বা পেমেন্ট গেটওয়ে খুঁজুন...",
      filtersLabel: "ফিল্টার এবং ক্যাটাগরি",
      clearFilters: "সব রিসেট করুন",
      categoryTitle: "ডিজিটাল ক্যাটাগরিসমূহ",
      licenseLabel: "লাইসেন্সের ধরণ",
      badgeFilters: "মার্কেটপ্লেস ব্যাজ",
      sortByLabel: "ক্রমানুসারে সাজান",
      priceLabel: "সর্বোচ্চ বাজেট মূল্য",
      licenseRegular: "সাধারণ লাইসেন্স",
      licenseExtended: "বর্ধিত ডেভেলপার লাইসেন্স",
      licenseGeneral: "সাধারণ প্রোডাক্ট",
      bestSeller: "সাপ্তাহিক সর্বোচ্চ বিক্রিত",
      trendingBadge: "হট ও ট্রেন্ডিং আইটেম",
      matchedCount: "খুঁজে পাওয়া ফাইলসমূহ",
      watchLive: "লাইভ প্রিভিউ",
      buyNow: "ফাইল ডাউনলোড",
      viewDetails: "বিস্তারিত দেখুন",
      noMatched: "আপনার খোঁজা ক্যাটাগরি বা বাজেটের কোনো প্রোডাক্ট পাওয়া যায়নি।",
      similarLabel: "সম্পর্কিত অন্যান্য স্ক্রিপ্ট",
      alsoViewed: "গ্রাহকরা এই ফাইলগুলোও দেখেছেন",
      frequentBought: "সবচেয়ে বেশি একসাথে কেনা আইটেম",
      trendingNow: "মার্কেটপ্লেসে ট্রেন্ডিং প্রজেক্ট",
      recommendedFor: "আপনার জন্য সেরা সাজেশন",
      adminBtn: "স্টোর এডমিন প্যানেল 🛠️",
      adminTitle: "ওয়েবজোনবিডি সিএমএস কন্ট্রোল প্যানেল",
      bulkTitle: "বাল্ক ডেটা রিকভারি এবং ইমপোর্ট",
      bulkDesc: "এক ক্লিকেই নতুন ৬০টি প্রফেশনাল ডিজিটাল প্রোডাক্ট স্টোর ডেটাবেজে যুক্ত করুন।",
      closeAdmin: "অ্যাডমিন প্যানেল বন্ধ করুন",
      recentlyViewedTitle: "সম্প্রতি দেখা প্রোডাক্ট সমূহ",
      recentlyViewedSub: "আপনার শেষ ৫টি ক্লিক করা প্রোডাক্টের তালিকা",
      clearHistory: "মুছে ফেলুন",
      reviewsTitle: "গ্রাহকদের রিভিউ ও মতামত",
      noReviews: "এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনিই লিখুন!",
      writeReview: "একটি রিভিউ লিখুন",
      ratingLabel: "আপনার রেটিং",
      commentLabel: "আপনার মন্তব্য",
      submitReview: "রিভিউ সাবমিট করুন",
      reviewSuccess: "রিভিউ সফলভাবে সাবমিট করা হয়েছে!",
      pleaseLoginToReview: "রিভিউ জমা দিতে অনুগ্রহ করে লগইন করুন।",
      loginBtn: "লগইন করুন"
    },
    ar: {
      heading: "متجر ويب زون بي دي الرقمي المميز",
      subheading: "سكربتات برمجية نظيفة، تطبيقات سحابية، بوابات دفع إلكترونية مع تراخيص استخدام مدى الحياة.",
      searchPlaceholder: "البحث عن القوالب، أنظمة الحسابات، بوابات الدفع...",
      filtersLabel: "عناصر تصفية المنتجات",
      clearFilters: "إعادة ضبط",
      categoryTitle: "الأقسام المتاحة",
      licenseLabel: "مستوى الترخيص",
      badgeFilters: "أوسمة وشارات البيع",
      sortByLabel: "ترتيب حسب",
      priceLabel: "الحد الأقصى للسعر",
      licenseRegular: "ترخيص استخدام عادي",
      licenseExtended: "ترخيص المطورين الممتد",
      licenseGeneral: "منتجات عامة",
      bestSeller: "الأعلى مبيعا هذا الأسبوع",
      trendingBadge: "برمجيات شائعة جداً",
      matchedCount: "البرمجيات المطابقة",
      watchLive: "معاينة حية",
      buyNow: "تنزيل الملف",
      viewDetails: "المواصفات الفنية بالتفصيل",
      noMatched: "لم تظهر نتائج تطابق المعايير المحددة للتصفية في المتجر.",
      similarLabel: "حلول برمجية مشابهة",
      alsoViewed: "عملاء تصفحوا هذا بحثوا أيضاً عن",
      frequentBought: "يُشترى في الغالب معاً",
      trendingNow: "شائع جداً بالمتجر حالياً",
      recommendedFor: "موصى به خصيصاً لك",
      adminBtn: "إدارة المتجر الذكية 🛠️",
      adminTitle: "لوحة التحكم الإدارية المباشرة CMS",
      bulkTitle: "معالجة واستيراد البيانات الشاملة",
      bulkDesc: "اضغط هنا لإدراج كتالوج يضم 60 منتجاً رقمياً مطوراً مع علاقات الترشيح والربط.",
      closeAdmin: "خروج من الإدارة",
      recentlyViewedTitle: "المنتجات التي تم عرضها مؤخراً",
      recentlyViewedSub: "آخر 5 منتجات قمت بزيارتها مؤخرًا",
      clearHistory: "مسح السجل",
      reviewsTitle: "آراء وتقييمات العملاء",
      noReviews: "لا توجد تقييمات بعد. كن أول من يكتب تقييماً لهذا المنتج!",
      writeReview: "اكتب تقييمًا",
      ratingLabel: "تقييمك",
      commentLabel: "تعليقك",
      submitReview: "إرسال التقييم",
      reviewSuccess: "تم تقديم التقييم بنجاح!",
      pleaseLoginToReview: "يرجى تسجيل الدخول لتقديم تقييم.",
      loginBtn: "تسجيل الدخول"
    }
  }[language];

  // Map category ID to its translation names
  const getCategoryName = (catId: string) => {
    const c = categories.find(cat => cat.id === catId);
    if (!c) return catId;
    return language === 'bn' ? c.nameBn : language === 'ar' ? c.nameAr : c.name;
  };

  const getSubCategoryName = (subId: string) => {
    const s = subCategories.find(sub => sub.id === subId);
    if (!s) return subId;
    return language === 'bn' ? s.nameBn : language === 'ar' ? s.nameAr : s.name;
  };

  return (
    <section className="py-12 bg-neutral-50 dark:bg-[#030712] transition-colors duration-300" id="marketplace-envato-module">
      
      {/* 🛠️ DEMO/DEVELOPER SWITCH TO ACTIVATE ADMINISTRATIVE CMS PANELS INSTANTLY ON PREVIEW */}
      {(user?.role === 'admin' || isAdmin) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-end">
          <button
            onClick={() => {
              const nextOpen = !openAdminPanel;
              setOpenAdminPanel(nextOpen);
              if (nextOpen) {
                setIsAdminMode(true);
              }
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span>{t.adminBtn}</span>
          </button>
        </div>
      )}

      { AnimatePresence && (
        <AnimatePresence>
          {openAdminPanel && (user?.role === 'admin' || isAdmin) && isAdminMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden"
              id="admin-cms-control-panel"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border-2 border-indigo-500/20 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                      <Sliders className="w-5 h-5" />
                      <span>{t.adminTitle}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Dynamic Content Management System (CMS) connected to Store Database</p>
                  </div>
                  <button
                    onClick={() => setOpenAdminPanel(false)}
                    className="p-1 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-500 hover:text-white transition"
                  >
                    {t.closeAdmin}
                  </button>
                </div>

                {/* Tab selections */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  {(['products', 'categories', 'subcategories', 'bulk'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveAdminTab(tab)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeAdminTab === tab
                          ? 'bg-indigo-600/95 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* 1. PRODUCT CMS MANAGER */}
                {activeAdminTab === 'products' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Add & Edit Form */}
                    <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        {editingProduct ? "Edit Product Details" : "Create New Premium Product"}
                      </h4>
                      
                      <form onSubmit={handleSaveProduct} className="space-y-3 text-xs text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Product ID/Name (English)</label>
                            <input 
                              type="text" 
                              value={productForm.name} 
                              onChange={e => setProductForm({...productForm, name: e.target.value})}
                              placeholder="Ready School CRM"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Name (বাংলা)</label>
                            <input 
                              type="text" 
                              value={productForm.nameBn} 
                              onChange={e => setProductForm({...productForm, nameBn: e.target.value})}
                              placeholder="তৈরি স্কুল সিআরএম"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Category Parent</label>
                            <select
                              value={productForm.category}
                              onChange={e => setProductForm({...productForm, category: e.target.value})}
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white block"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Sub Category ID</label>
                            <input 
                              type="text" 
                              value={productForm.subCategory} 
                              onChange={e => setProductForm({...productForm, subCategory: e.target.value})}
                              placeholder="ready-news / wp-multipurpose"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-805 dark:text-white block"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Regular Price ($)</label>
                            <input 
                              type="number" 
                              value={productForm.price} 
                              onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Promo Discount Price ($)</label>
                            <input 
                              type="number" 
                              value={productForm.discountPrice || ''} 
                              onChange={e => setProductForm({...productForm, discountPrice: e.target.value ? Number(e.target.value) : undefined})}
                              placeholder="Optional sale rate"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Badge Banner Label</label>
                            <select
                              value={productForm.badge}
                              onChange={e => setProductForm({...productForm, badge: e.target.value})}
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white block"
                            >
                              <option value="New">New</option>
                              <option value="Best Seller">Best Seller</option>
                              <option value="Trending">Trending</option>
                              <option value="Hot Deal">Hot Deal</option>
                              <option value="Featured">Featured</option>
                              <option value="Verified">Verified</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">License Type Option</label>
                            <select
                              value={productForm.licenseType}
                              onChange={e => setProductForm({...productForm, licenseType: e.target.value})}
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white block"
                            >
                              <option value="regular">Regular License</option>
                              <option value="extended">Extended License</option>
                              <option value="general">General Products</option>
                            </select>
                          </div>
                        </div>

                        {/* Boolean checkboxes */}
                        <div className="flex flex-wrap gap-4 py-1.5 border-y border-slate-150 dark:border-slate-850">
                          <label className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-350 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!productForm.isFeatured}
                              onChange={e => setProductForm({...productForm, isFeatured: e.target.checked})}
                            />
                            <span>Featured (IsFeatured)</span>
                          </label>

                          <label className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-350 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!productForm.isTrending}
                              onChange={e => setProductForm({...productForm, isTrending: e.target.checked})}
                            />
                            <span>Trending (IsTrending)</span>
                          </label>

                          <label className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-350 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!productForm.isBestSeller}
                              onChange={e => setProductForm({...productForm, isBestSeller: e.target.checked})}
                            />
                            <span>Best Seller</span>
                          </label>
                        </div>

                        {/* Custom Thumbnail Upload & Preview Group */}
                        <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-neutral-900/40">
                          <label className="font-bold text-slate-600 dark:text-slate-400 block text-xs">Product Cover Thumbnail</label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            {productForm.image ? (
                              <div className="relative w-16 h-16 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-neutral-950 flex-shrink-0">
                                <img 
                                  src={productForm.image} 
                                  alt="Product thumbnail preview" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-md border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-neutral-950 flex items-center justify-center text-[10px] text-slate-400 font-medium flex-shrink-0">
                                No Cover
                              </div>
                            )}
                            <div className="flex-1 w-full space-y-1.5">
                              <input 
                                type="file" 
                                accept="image/*"
                                id="marketplace-product-file-thumbnail"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      if (event.target?.result) {
                                        setProductForm({
                                          ...productForm,
                                          image: event.target.result as string
                                        });
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="text-xs text-slate-500 dark:text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-600/10 file:text-indigo-600 dark:file:bg-indigo-500/15 dark:file:text-indigo-400 hover:file:bg-indigo-650/20 cursor-pointer w-full"
                              />
                              <input 
                                type="text" 
                                value={productForm.image || ''} 
                                onChange={e => setProductForm({...productForm, image: e.target.value})}
                                placeholder="Or enter/paste direct image URL..."
                                className="w-full text-xs p-1.5 rounded bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white outline-none focus:border-indigo-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Live Preview URL</label>
                            <input 
                              type="text" 
                              value={productForm.demoUrl} 
                              onChange={e => setProductForm({...productForm, demoUrl: e.target.value})}
                              placeholder="https://demo.webzonebd.com/..."
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-400 block">Script ZIP Download URL</label>
                            <input 
                              type="text" 
                              value={productForm.downloadUrl} 
                              onChange={e => setProductForm({...productForm, downloadUrl: e.target.value})}
                              placeholder="https://webzonebd.com/..."
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 dark:text-slate-400 block">Product English Description</label>
                          <textarea
                            value={productForm.description}
                            onChange={e => setProductForm({...productForm, description: e.target.value})}
                            rows={3}
                            className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                          />
                        </div>

                        {/* Dynamic Features Included List builder */}
                        <div className="space-y-3 p-4 bg-indigo-50/10 dark:bg-indigo-950/25 border border-indigo-500/10 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[11px] sm:text-xs">
                              Features Included / কার্যাবলী ও সুবিধাসমূহ
                            </label>
                            
                            {/* Simple, premium language tabs */}
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                              {(['en', 'bn', 'ar'] as const).map(tab => (
                                <button
                                  key={tab}
                                  type="button"
                                  onClick={() => setActiveFeatureLangTab(tab)}
                                  className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase transition-all duration-200 ${
                                    activeFeatureLangTab === tab
                                      ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-sm'
                                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  {tab === 'en' ? 'EN' : tab === 'bn' ? 'বাংলা' : 'AR'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dynamic Lists based on selected language tab */}
                          <div className="space-y-2">
                            {activeFeatureLangTab === 'en' && (
                              <div className="space-y-2">
                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                  {Array.isArray(productForm.features) && productForm.features.length > 0 ? (
                                    productForm.features.map((feat, index) => (
                                      <div 
                                        key={index} 
                                        className="flex items-center justify-between bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                                      >
                                        <span className="font-semibold text-[11px] flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                          {feat}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = (productForm.features as string[]).filter((_, i) => i !== index);
                                            setProductForm({ ...productForm, features: updated });
                                          }}
                                          className="text-red-500 hover:text-red-700 transition px-1.5 py-0.5 text-[10px] hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                                          title="Delete feature"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 italic p-2 text-center bg-slate-50/50 dark:bg-slate-950/10 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                                      No English features added yet. Type a feature below and click Add.
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newProductFeatureText}
                                    onChange={e => setNewProductFeatureText(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (newProductFeatureText.trim()) {
                                          const current = Array.isArray(productForm.features) ? productForm.features : [];
                                          if (!current.includes(newProductFeatureText.trim())) {
                                            const updated = [...current, newProductFeatureText.trim()];
                                            setProductForm({ ...productForm, features: updated });
                                          }
                                          setNewProductFeatureText('');
                                        }
                                      }
                                    }}
                                    placeholder="e.g. Clean & optimized code structure"
                                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#7C3AED]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newProductFeatureText.trim()) {
                                        const current = Array.isArray(productForm.features) ? productForm.features : [];
                                        if (!current.includes(newProductFeatureText.trim())) {
                                          const updated = [...current, newProductFeatureText.trim()];
                                          setProductForm({ ...productForm, features: updated });
                                        }
                                        setNewProductFeatureText('');
                                      }
                                    }}
                                    className="px-3 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            )}

                            {activeFeatureLangTab === 'bn' && (
                              <div className="space-y-2">
                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                  {Array.isArray(productForm.featuresBn) && productForm.featuresBn.length > 0 ? (
                                    productForm.featuresBn.map((feat, index) => (
                                      <div 
                                        key={index} 
                                        className="flex items-center justify-between bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                                      >
                                        <span className="font-semibold text-[11px] flex items-center gap-2 text-slate-700 dark:text-slate-300 font-sans">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                          {feat}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = (productForm.featuresBn as string[]).filter((_, i) => i !== index);
                                            setProductForm({ ...productForm, featuresBn: updated });
                                          }}
                                          className="text-red-500 hover:text-red-700 transition px-1.5 py-0.5 text-[10px] hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                                          title="Delete feature"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 italic p-2 text-center bg-slate-50/50 dark:bg-slate-950/10 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 font-sans">
                                      কোনো বাংলা বৈশিষ্ট্য যুক্ত করা হয়নি। নিচে টাইপ করুন এবং Add বাটনে ক্লিক করুন।
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newProductFeatureTextBn}
                                    onChange={e => setNewProductFeatureTextBn(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (newProductFeatureTextBn.trim()) {
                                          const current = Array.isArray(productForm.featuresBn) ? productForm.featuresBn : [];
                                          if (!current.includes(newProductFeatureTextBn.trim())) {
                                            const updated = [...current, newProductFeatureTextBn.trim()];
                                            setProductForm({ ...productForm, featuresBn: updated });
                                          }
                                          setNewProductFeatureTextBn('');
                                        }
                                      }
                                    }}
                                    placeholder="যেমন: সম্পূর্ণ অপ্টিমাইজড ও রেসপন্সিভ ডিজাইন"
                                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#7C3AED] font-sans"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newProductFeatureTextBn.trim()) {
                                        const current = Array.isArray(productForm.featuresBn) ? productForm.featuresBn : [];
                                        if (!current.includes(newProductFeatureTextBn.trim())) {
                                          const updated = [...current, newProductFeatureTextBn.trim()];
                                          setProductForm({ ...productForm, featuresBn: updated });
                                        }
                                        setNewProductFeatureTextBn('');
                                      }
                                    }}
                                    className="px-3 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white rounded-xl text-xs font-bold transition cursor-pointer font-sans"
                                  >
                                    যোগ করুন
                                  </button>
                                </div>
                              </div>
                            )}

                            {activeFeatureLangTab === 'ar' && (
                              <div className="space-y-2">
                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                  {Array.isArray(productForm.featuresAr) && productForm.featuresAr.length > 0 ? (
                                    productForm.featuresAr.map((feat, index) => (
                                      <div 
                                        key={index} 
                                        className="flex items-center justify-between bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                                      >
                                        <span className="font-semibold text-[11px] flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                          {feat}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = (productForm.featuresAr as string[]).filter((_, i) => i !== index);
                                            setProductForm({ ...productForm, featuresAr: updated });
                                          }}
                                          className="text-red-500 hover:text-red-700 transition px-1.5 py-0.5 text-[10px] hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                                          title="Delete feature"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 italic p-2 text-center bg-slate-50/50 dark:bg-slate-950/10 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                                      لم يتم إضافة ميزات باللغة العربية بعد. اكتب الميزة أدناه واضغط على إضافة.
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newProductFeatureTextAr}
                                    onChange={e => setNewProductFeatureTextAr(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (newProductFeatureTextAr.trim()) {
                                          const current = Array.isArray(productForm.featuresAr) ? productForm.featuresAr : [];
                                          if (!current.includes(newProductFeatureTextAr.trim())) {
                                            const updated = [...current, newProductFeatureTextAr.trim()];
                                            setProductForm({ ...productForm, featuresAr: updated });
                                          }
                                          setNewProductFeatureTextAr('');
                                        }
                                      }
                                    }}
                                    placeholder="مثال: لوحة تحكم سهلة وسريعة"
                                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#7C3AED] text-right"
                                    dir="rtl"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newProductFeatureTextAr.trim()) {
                                        const current = Array.isArray(productForm.featuresAr) ? productForm.featuresAr : [];
                                        if (!current.includes(newProductFeatureTextAr.trim())) {
                                          const updated = [...current, newProductFeatureTextAr.trim()];
                                          setProductForm({ ...productForm, featuresAr: updated });
                                        }
                                        setNewProductFeatureTextAr('');
                                      }
                                    }}
                                    className="px-3 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                                  >
                                    إضافة
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg cursor-pointer transition text-center"
                          >
                            <Check className="w-3.5 h-3.5 inline mr-1" />
                            <span>{editingProduct ? "Update Product" : "Save Product Details"}</span>
                          </button>
                          {editingProduct && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(null);
                                setProductForm({});
                              }}
                              className="py-2.5 px-3 bg-slate-250 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-350 font-black rounded-lg cursor-pointer transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Catalog Listings with Quick Actions */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Database Product Logs ({products.length} Items)</h4>
                      </div>

                      <div className="max-h-[500px] overflow-y-auto border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white/50 dark:bg-slate-950/20 divide-y divide-slate-100 dark:divide-slate-800">
                        {products.map(p => (
                          <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                            <div className="flex items-center gap-3">
                              <img src={p.image} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div className="text-left">
                                <p className="font-extrabold text-slate-800 dark:text-neutral-100 text-xs line-clamp-1">{p.name}</p>
                                <p className="text-[10px] font-mono text-indigo-500 uppercase font-black">{getCategoryName(p.category)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-xs font-mono font-bold text-slate-500 mr-2">{formatPrice(p.price)}</span>
                              <button
                                onClick={() => handleEditProductClick(p)}
                                className="p-1 px-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1 px-2.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CATEGORIES CMS MANAGER */}
                {activeAdminTab === 'categories' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                    
                    {/* Add Form */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                        {editingCategory ? "Edit Category Meta" : "Register New Dynamic Category"}
                      </h4>

                      <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 dark:text-slate-450 block">Category ID / Unique Slug (lower-case-dashes)</label>
                          <input 
                            type="text" 
                            disabled={!!editingCategory}
                            value={categoryForm.id} 
                            onChange={e => setCategoryForm({...categoryForm, id: e.target.value})}
                            placeholder="ready-websites"
                            className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white disabled:opacity-50"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-450 block">Name (EN)</label>
                            <input 
                              type="text" 
                              value={categoryForm.name} 
                              onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                              placeholder="Ready Websites"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-450 block">Name (বাংলা)</label>
                            <input 
                              type="text" 
                              value={categoryForm.nameBn} 
                              onChange={e => setCategoryForm({...categoryForm, nameBn: e.target.value})}
                              placeholder="তৈরি ওয়েবসাইট"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 dark:text-slate-450 block">Name (Arabic)</label>
                            <input 
                              type="text" 
                              value={categoryForm.nameAr} 
                              onChange={e => setCategoryForm({...categoryForm, nameAr: e.target.value})}
                              placeholder="المواقع الجاهزة"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 dark:text-slate-500 block">Description Overview (English)</label>
                          <textarea 
                            value={categoryForm.description} 
                            onChange={e => setCategoryForm({...categoryForm, description: e.target.value})}
                            rows={2}
                            placeholder="Fully loaded and working scripts templates ready to deploy."
                            className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer"
                        >
                          {editingCategory ? "Update Category" : "Add Active Category"}
                        </button>
                      </form>
                    </div>

                    {/* Active Categories List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Active Categories Database ({categories.length} Registered)</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                        {categories.map(c => (
                          <div key={c.id} className="p-3.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-150 dark:border-slate-850 flex flex-col justify-between hover:border-slate-350 transition">
                            <div className="space-y-1">
                              <p className="font-bold text-xs text-slate-900 dark:text-white">{language === 'bn' ? c.nameBn : language === 'ar' ? c.nameAr : c.name}</p>
                              <code className="text-[10px] font-mono text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded block w-fit">{c.id}</code>
                              <p className="text-[10.5px] leading-relaxed text-slate-500 line-clamp-2">{c.description || 'No description seed'}</p>
                            </div>

                            <div className="flex items-center justify-end gap-1.5 mt-3 border-t border-slate-100 dark:border-slate-900 pt-2 text-[10px]">
                              <button
                                onClick={() => {
                                  setEditingCategory(c);
                                  setCategoryForm(c);
                                }}
                                className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/25 rounded cursor-pointer font-bold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c.id)}
                                className="px-2.5 py-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded cursor-pointer font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SUBCATEGORIES CMS */}
                {activeAdminTab === 'subcategories' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Add Sub-Category Connection</h4>
                      
                      <form onSubmit={handleSaveSubCategory} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 dark:text-slate-450 block">Sub-Category Unique ID</label>
                          <input 
                            type="text" 
                            value={subForm.id}
                            onChange={e => setSubForm({...subForm, id: e.target.value})}
                            placeholder="wp-seo"
                            className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-808 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-600 dark:text-slate-450 block">Parent Category</label>
                          <select
                            value={subForm.categoryId}
                            onChange={e => setSubForm({...subForm, categoryId: e.target.value})}
                            className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white block"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 block">Name (EN)</label>
                            <input 
                              type="text" 
                              value={subForm.name}
                              onChange={e => setSubForm({...subForm, name: e.target.value})}
                              placeholder="SEO Tools"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 block">Name (বাংলা)</label>
                            <input 
                              type="text" 
                              value={subForm.nameBn}
                              onChange={e => setSubForm({...subForm, nameBn: e.target.value})}
                              placeholder="এসইও টুলস"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600 block">Name (AR)</label>
                            <input 
                              type="text" 
                              value={subForm.nameAr}
                              onChange={e => setSubForm({...subForm, nameAr: e.target.value})}
                              placeholder="محركات البث"
                              className="w-full p-2 rounded-lg bg-white dark:bg-neutral-950 border"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer">
                          Add Sub-Category Link
                        </button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Existing Sub-Category Assignments</h4>
                      <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl bg-white/50 p-2">
                        {subCategories.map(sub => (
                          <div key={sub.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                            <div className="text-left">
                              <p className="font-bold text-slate-800 dark:text-white">{sub.name}</p>
                              <p className="text-[10px] text-slate-400">Parent: {getCategoryName(sub.categoryId)} | ID: {sub.id}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteSub(sub.id)}
                              className="text-rose-500 text-[10px] hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SEED & RE_DB */}
                {activeAdminTab === 'bulk' && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-4">
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-full w-fit mx-auto">
                        <FileSpreadsheet className="w-8 h-8" />
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">{t.bulkTitle}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">{t.bulkDesc}</p>
                    </div>

                    <button
                      onClick={handleBulkRestore}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                      <span>Execute Full Bulk Seed Database</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* -----------------------------------------------------------------
          GOOGLE PLAY STORE STYLE HERO SLIDER (WITH SMOOTH SLIDE ANIMATION)
          ----------------------------------------------------------------- */}
      <StoreHeroSlider 
        products={products}
        language={language}
        theme={theme}
        formatPrice={formatPrice}
        addToCart={addToCart}
        setCartOpen={setCartOpen}
        onViewProduct={handleViewProduct}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        activeCategory={activeCategory}
        categories={categories}
        triggerToast={triggerToast}
        onQuickBuy={handleQuickBuy}
      />

      {/* Active Category Header Pill (if filtered by category or search) */}
      {activeCategory !== 'all' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'bn' ? 'বাছাইকৃত ক্যাটাগরি' : 'Active Category'}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {getCategoryName(activeCategory)}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {processedProducts.length} {t.matchedCount}
              </span>
              <button
                onClick={() => { setActiveCategory('all'); setActiveSubCategory('all'); }}
                className="text-xs text-blue-600 hover:text-blue-500 font-bold px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer"
              >
                {language === 'bn' ? 'সব দেখুন' : 'View All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
          CORE LAYOUT: SIDEBAR FILTERS MATRIX + PRODUCT LISTINGS GRID
          ----------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FILTERS CONSOLE (SMART ENVATO UX) */}
        <div className={`col-span-1 lg:col-span-3 space-y-6 lg:block ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="p-6 bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-900/[0.01]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-5">
              <span className="text-sm font-extrabold text-slate-900 dark:text-neutral-150 flex items-center gap-1.5 font-display">
                <SlidersHorizontal className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                {t.filtersLabel}
              </span>
              <button
                onClick={() => {
                  setLocalSearch('');
                  setActiveCategory('all');
                  setActiveSubCategory('all');
                  setPriceRange(300);
                  setSelectedLicense('all');
                  setSelectedBadge('all');
                  setSortBy('featured');
                }}
                className="text-[10px] font-mono text-rose-500 hover:underline flex items-center gap-1"
                title="Reset filters matrix"
              >
                <RefreshCw className="w-3 h-3" />
                {t.clearFilters}
              </button>
            </div>

            {/* Price Filter range */}
            <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-850">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{t.priceLabel}</span>
                <span className="font-mono text-emerald-500 dark:text-emerald-400 font-extrabold">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-cyan-450"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-450">
                <span>{formatPrice(5)}</span>
                <span>{formatPrice(300)}</span>
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-3 py-5 border-b border-slate-100 dark:border-slate-850 text-left">
              <h4 className="text-xs uppercase font-mono tracking-widest font-black text-slate-400">{t.categoryTitle}</h4>
              <div className="space-y-1 max-h-[240px] overflow-y-auto pr-1">
                <button
                  onClick={() => { setActiveCategory('all'); setActiveSubCategory('all'); }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                    activeCategory === 'all'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'border-transparent text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="truncate">{language === 'bn' ? 'সকল আইটেম' : language === 'ar' ? 'عرض الكل' : 'All Digital Goods'}</span>
                  <span className={`text-[9px] font-mono font-black ${activeCategory === 'all' ? 'text-white' : 'text-slate-400'}`}>
                    {products.length}
                  </span>
                </button>

                {categories.map(cat => {
                  const count = categoryCounts[cat.id] || 0;
                  const isSelected = activeCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setActiveSubCategory('all'); }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'border-transparent text-slate-600 dark:text-slate-350 hover:bg-slate-105 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span className="truncate text-left">{language === 'bn' ? cat.nameBn : language === 'ar' ? cat.nameAr : cat.name}</span>
                      <span className={`text-[9px] font-mono font-black ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Category selection matching chosen parent */}
            {activeCategory !== 'all' && (
              <div className="space-y-3 py-5 border-b border-slate-100 dark:border-slate-850 text-left">
                <h4 className="text-xs uppercase font-mono tracking-widest font-black text-slate-400">Sub Taxonomy Filter</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSubCategory('all')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeSubCategory === 'all' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    All Sub-Categories
                  </button>

                  {subCategories.filter(s => s.categoryId === activeCategory).map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCategory(sub.id)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeSubCategory === sub.id 
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' 
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {language === 'bn' ? sub.nameBn : language === 'ar' ? sub.nameAr : sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* License options */}
            <div className="space-y-2 py-5 border-b border-slate-105 dark:border-slate-850 text-left">
              <h4 className="text-xs uppercase font-mono tracking-widest font-black text-slate-400">{t.licenseLabel}</h4>
              <div className="space-y-1">
                {(['all', 'regular', 'extended', 'general'] as const).map(lic => (
                  <button
                    key={lic}
                    onClick={() => setSelectedLicense(lic)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                      selectedLicense === lic
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                        : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {lic === 'all' ? 'All Developer Licenses' : lic === 'regular' ? t.licenseRegular : lic === 'extended' ? t.licenseExtended : t.licenseGeneral}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Banner filter options */}
            <div className="space-y-2 pt-5 text-left">
              <h4 className="text-xs uppercase font-mono tracking-widest font-black text-slate-400">{t.badgeFilters}</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['all', 'Best Seller', 'Trending', 'New', 'Hot Deal', 'Featured', 'Verified'].map(badge => (
                  <button
                    key={badge}
                    onClick={() => setSelectedBadge(badge)}
                    className={`px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md border transition cursor-pointer ${
                      selectedBadge === badge
                        ? 'bg-indigo-600 border-indigo-650 text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    {badge === 'all' ? 'Show All' : badge}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SEARCH + PRODUCT CARDS GRID */}
        <div className="col-span-1 lg:col-span-9 space-y-6">
          
          {/* TOP CARD BAR: SEARCH SYSTEM INTEGRATING LIVE SUGGESTIONS + SORTING */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative z-20 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(124,58,237,0.06)] transition-all duration-300">
            {/* SaaS Style Header row with Double Pulsing Quick Buy Badges */}
            <div className="flex items-center justify-between mb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4899] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
                </span>
                <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] uppercase text-[10px] sm:text-[11px]">
                  ⚡ {language === 'bn' ? 'ইনস্ট্যান্ট চেকআউট ও ডেলিভারি' : 'Instant Delivery'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/15 text-[#7C3AED] dark:text-[#A855F7] text-[10px] sm:text-xs font-extrabold border border-violet-500/20 shadow-[0_4px_12px_rgba(124,58,237,0.08)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{language === 'bn' ? 'কুইক বাই সচল' : 'Quick Buy Active'}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              
              {/* Dynamic search input with Premium SaaS Gradient Focus & Floating layout */}
              <div ref={searchContainerRef} className="relative flex-1 w-full text-left group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-[15px] opacity-0 group-focus-within:opacity-100 transition duration-500 blur-[2px] -z-10"></div>
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-[15px] opacity-0 group-focus-within:opacity-100 transition duration-500 -z-10"></div>
                
                <div className="relative flex items-center h-[56px] w-full rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] group-focus-within:border-transparent group-focus-within:bg-[#FFFFFF] dark:group-focus-within:bg-[#0F172A] transition-all duration-300">
                  <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-[#7C3AED] group-focus-within:scale-110 transition-all duration-300" />
                  <input
                    type="text"
                    value={localSearch}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      } else if (e.key === 'Enter') {
                        setShowSuggestions(false);
                      }
                    }}
                    onChange={e => {
                      setLocalSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder={t.searchPlaceholder}
                    className="w-full h-full pl-11 pr-24 bg-transparent border-0 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                  />
                  
                  <div className="absolute right-4.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                    {/* Voice search microphone trigger with modern hover */}
                    <button
                      type="button"
                      onClick={startVoiceSearch}
                      className={`p-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/20'
                          : 'text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                      title="Voice Search"
                    >
                      {isListening ? (
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <Mic className="w-3.5 h-3.5 relative text-white" />
                        </span>
                      ) : (
                        <Mic className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {localSearch && (
                      <button 
                        onClick={() => setLocalSearch('')}
                        className="p-1.5 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-all duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Listening floating HUD under input */}
                {isListening && (
                  <div className="absolute left-0 right-0 top-full mt-2.5 p-3.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-xl animate-in slide-in-from-top-1 fade-in duration-300 z-50">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      <span className="font-semibold tracking-wide">
                        {language === 'bn' ? "আমি শুনছি... বলুন।" : language === 'ar' ? "أنا أستمع... تحدث الآن." : "Listening... speak now."}
                      </span>
                    </div>
                    {/* Visual Audio waves */}
                    <div className="flex items-center justify-end gap-1.5 flex-1 bg-transparent">
                      <span className="w-[3px] h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></span>
                      <span className="w-[3px] h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }}></span>
                      <span className="w-[3px] h-4 bg-white/90 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }}></span>
                      <span className="w-[3px] h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '450ms', animationDuration: '0.6s' }}></span>
                    </div>
                  </div>
                )}

                {/* Real-Time Predictive Search Dropdown */}
                {showSuggestions && localSearch.trim().length > 0 && (
                  <div 
                    id="store-predictive-search-dropdown"
                    className="absolute left-0 right-0 top-full mt-2.5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.2)] z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    {/* Header bar */}
                    <div className="px-4 py-2.5 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-pink-50/70 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-pink-950/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span className="text-[11px] font-extrabold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-200">
                          {language === 'bn' 
                            ? `প্রেডিক্টিভ সার্চ রেজাল্ট (${predictiveSearchResults.total}টি পাওয়া গেছে)` 
                            : `Predictive Search Matches (${predictiveSearchResults.total} found)`}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-800">
                        ESC to close
                      </span>
                    </div>

                    {/* Matching Category Chips (if any matching categories) */}
                    {predictiveSearchResults.categories.length > 0 && (
                      <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                          {language === 'bn' ? 'ক্যাটাগরি ফিল্টার:' : 'Filter by:'}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {predictiveSearchResults.categories.map(cat => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setActiveCategory(cat.id);
                                setShowSuggestions(false);
                              }}
                              className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-[#7C3AED] dark:text-[#A855F7] border border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <span>{cat.name}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-mono">
                                {cat.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products Predictive List */}
                    {predictiveSearchResults.products.length > 0 ? (
                      <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-slate-100/60 dark:divide-slate-800/40">
                        {predictiveSearchResults.products.map(product => (
                          <div
                            key={product.id}
                            onClick={() => {
                              handleViewProduct(product);
                              setShowSuggestions(false);
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 dark:hover:bg-slate-800/70 transition-all text-left cursor-pointer group/item"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700/60 relative">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover/item:text-[#7C3AED] dark:group-hover/item:text-[#A855F7] transition truncate">
                                    {highlightMatch(language === 'bn' ? (product.nameBn || product.name) : product.name, localSearch)}
                                  </h4>
                                  {product.badge && (
                                    <span className="text-[9px] uppercase font-mono font-black px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                      {product.badge}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                    {getCategoryName(product.category)}
                                  </span>
                                  {product.subCategory && (
                                    <span className="text-slate-400 hidden sm:inline">
                                      • {product.subCategory}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    <span>{product.rating?.toFixed(1) || '4.9'}</span>
                                  </span>
                                  {product.downloadsCount && (
                                    <span className="hidden sm:inline text-slate-400">
                                      • {product.downloadsCount}+ {language === 'bn' ? 'ডাউনলোড' : 'sales'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Price & Quick Buy action */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span className="block text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
                                  {formatPrice(product.price)}
                                </span>
                                {product.discountPrice && product.discountPrice > product.price && (
                                  <span className="text-[10px] line-through text-slate-400 block font-mono">
                                    {formatPrice(product.discountPrice)}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickBuy(product, e);
                                  setShowSuggestions(false);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
                                title="Quick Buy"
                              >
                                <Zap className="w-3 h-3 text-amber-300 fill-current" />
                                <span className="hidden sm:inline">{language === 'bn' ? 'কুইক বাই' : 'Quick Buy'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Empty state with popular recommendations */
                      <div className="p-5 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                          {language === 'bn' 
                            ? `"${localSearch}" এর সাথে কোনো ডিজিটাল পণ্য মেলেনি` 
                            : `No matching digital items found for "${localSearch}"`}
                        </p>
                        <div className="text-[11px] font-bold text-slate-400 mb-2 font-mono uppercase tracking-wider">
                          {language === 'bn' ? 'জনপ্রিয় সার্চসমূহ ট্রাই করুন:' : 'Try Popular Searches:'}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {['E-Commerce', 'POS System', 'Courier', 'Pharmacy', 'Flutter App', 'WordPress', 'React', 'Laravel'].map(term => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                setLocalSearch(term);
                                setShowSuggestions(true);
                              }}
                              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950 dark:hover:text-purple-300 transition cursor-pointer font-medium"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer bar */}
                    {predictiveSearchResults.total > 0 && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {language === 'bn' ? 'ক্যাটালগে দেখতে চান?' : 'Want to view all in store?'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSuggestions(false)}
                          className="text-xs font-bold text-[#7C3AED] dark:text-[#A855F7] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{language === 'bn' ? `সকল ${predictiveSearchResults.total}টি রেজাল্ট দেখুন` : `View all ${predictiveSearchResults.total} items`}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sorting and mobile drawers control - beautiful interactive dropdown & toggle button */}
              <div className="flex flex-row items-center gap-2.5 w-full md:w-auto shrink-0 justify-between md:justify-start">
                {/* Refresh Catalog Button with Smooth Spin */}
                <button
                  type="button"
                  onClick={handleRefreshCatalog}
                  disabled={isRefreshing || isLoading}
                  className="h-[56px] px-4 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-[#374151] rounded-[14px] text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold transition-all duration-300 active:scale-95 disabled:opacity-50"
                  title={language === 'bn' ? 'ক্যাটালগ রিফ্রেশ করুন' : 'Refresh Catalog'}
                >
                  <RefreshCw className={`w-4 h-4 text-[#7C3AED] ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{language === 'bn' ? 'রিফ্রেশ' : 'Sync'}</span>
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden h-[56px] px-5 bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 hover:from-[#7C3AED]/20 hover:to-[#EC4899]/20 border border-violet-500/20 rounded-[14px] text-[#7C3AED] dark:text-[#A855F7] flex items-center justify-center gap-2 cursor-pointer text-xs font-bold transition-all duration-300"
                >
                  <Filter className="w-4 h-4 text-[#7C3AED]" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-3 w-full md:w-auto flex-1 md:flex-initial justify-end">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden sm:inline whitespace-nowrap">{t.sortByLabel}:</span>
                  
                  <div className="relative w-full sm:w-52 text-left group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-[15px] opacity-0 group-focus-within:opacity-100 transition duration-500 blur-[2px] -z-10"></div>
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] rounded-[15px] opacity-0 group-focus-within:opacity-100 transition duration-500 -z-10"></div>
                    
                    <div className="relative flex items-center h-[56px] w-full rounded-[14px] bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] group-focus-within:border-transparent group-focus-within:bg-[#FFFFFF] dark:group-focus-within:bg-[#0F172A] transition-all duration-300">
                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="w-full h-full bg-transparent border-0 px-4 pr-10 text-xs sm:text-sm font-semibold text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                      >
                        <option value="featured" className="bg-white dark:bg-[#0F172A] text-slate-800 dark:text-neutral-200">Best Matches</option>
                        <option value="sales" className="bg-white dark:bg-[#0F172A] text-slate-800 dark:text-neutral-200">Top Selling Code</option>
                        <option value="latest" className="bg-white dark:bg-[#0F172A] text-slate-800 dark:text-neutral-200">New Releases</option>
                        <option value="price-asc" className="bg-white dark:bg-[#0F172A] text-slate-800 dark:text-neutral-200">Low Price First</option>
                        <option value="price-desc" className="bg-white dark:bg-[#0F172A] text-slate-800 dark:text-neutral-200">High Price First</option>
                        <option value="rating" className="bg-white dark:bg-[#0F172A] text-slate-800 dark:text-neutral-200">Customer Score</option>
                      </select>
                      <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 group-focus-within:text-[#7C3AED] pointer-events-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Viewed Cache Row inside Search bar with polished chip designs */}
            {recentlyViewed.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-bold flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <Eye className="w-4 h-4 text-[#7C3AED]" />
                  Recently Viewed:
                </span>
                {recentlyViewed.map(id => {
                  const p = products.find(prod => prod.id === id);
                  if (!p) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => handleViewProduct(p)}
                      className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-slate-100 dark:bg-[#111827] dark:hover:bg-[#1f2937] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-full cursor-pointer transition-all duration-200 truncate max-w-40 hover:scale-105"
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* GRID OF PRODUCTS (WITH SKELETON LOADER STATE) */}
          {isLoading || isRefreshing ? (
            <div className="animate-in fade-in duration-300">
              <MarketplaceGridSkeleton count={productsPerPage} />
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-150 dark:border-slate-850 p-6 space-y-3">
              <Sliders className="w-14 h-14 mx-auto text-slate-300 stroke-[1.2] shrink-0" />
              <p className="text-base font-extrabold text-slate-800 dark:text-white">{t.noMatched}</p>
              <button
                onClick={() => {
                  setLocalSearch('');
                  setActiveCategory('all');
                  setActiveSubCategory('all');
                  setPriceRange(300);
                  setSelectedLicense('all');
                  setSelectedBadge('all');
                }}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow"
              >
                Reset Search Criteria
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="marketplace-products-grid">
              
              {paginatedProducts.map((product) => {
                const hasDiscount = product.discountPrice !== undefined;
                const priceValue = hasDiscount ? product.discountPrice : product.price;
                const totalSales = product.downloadsCount || Math.floor(product.reviewsCount * 4 + 11);

                const viewText = language === 'bn' ? 'বিস্তারিত দেখুন' : language === 'ar' ? 'عرض التفاصيل' : 'View';
                const addCardText = language === 'bn' ? 'কার্টে যোগ' : language === 'ar' ? 'أضف للسلة' : 'Add to Cart';
                const quickBuyText = language === 'bn' ? 'কুইক বাই' : language === 'ar' ? 'شراء سريع' : 'Quick Buy';

                return (
                  <motion.div 
                    layout
                    key={product.id}
                    className="group relative flex flex-col justify-between h-full rounded-[24px] overflow-hidden p-[1.5px] transition-shadow duration-300 hover:shadow-[0_25px_50px_rgba(99,102,241,0.25)] dark:hover:shadow-[0_25px_50px_rgba(6,182,212,0.18)]"
                    whileHover={{ 
                      scale: 1.03, 
                      y: -8 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 350, 
                      damping: 22 
                    }}
                  >
                    {/* Premium Ambient Gradient Border */}
                    <span className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-60 dark:opacity-40 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Pulsing light glow behind the card on hover */}
                    <span className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />
                    
                    {/* Main card background container to mask the inner 1.5px border spacing */}
                    <div className="relative z-10 flex flex-col justify-between h-full w-full bg-white dark:bg-[#0B0F19] rounded-[23px] overflow-hidden">
                      
                      {/* Image with zoom and badging */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-50 dark:bg-neutral-950 border-b border-slate-100 dark:border-slate-850">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />

                        {/* Badges styling matching specification */}
                        {product.badge && (
                          <span className={`absolute top-4 left-4 px-2.5 py-1 text-[9px] font-mono font-black text-white rounded-lg flex items-center gap-1 shadow-md uppercase tracking-wider animate-pulse ${
                            product.badge === 'Best Seller' ? 'bg-gradient-to-r from-amber-500 to-orange-650' :
                            product.badge === 'Trending' ? 'bg-gradient-to-r from-purple-600 to-pink-650' :
                            product.badge === 'New' ? 'bg-gradient-to-r from-blue-600 to-sky-500' :
                            product.badge === 'Hot Deal' ? 'bg-gradient-to-r from-rose-500 to-red-750' :
                            'bg-gradient-to-r from-emerald-500 to-teal-600'
                          }`}>
                            <Sparkles className="w-3 h-3" />
                            {product.badge}
                          </span>
                        )}

                        {/* Diagonal Ribbon for Discounted Items */}
                        {hasDiscount && (
                          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
                            <div className="absolute top-[12px] right-[-20px] w-[85px] bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white text-[8px] font-black uppercase tracking-widest text-center py-0.5 select-none rotate-45 shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                              {language === 'bn' ? 'ছাড়' : language === 'ar' ? 'خصم' : 'SALE'}
                            </div>
                          </div>
                        )}

                        {/* Wishlist triggers with subtle pulse animation */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const isAdding = !wishlist.includes(product.id);
                            if (isAdding) {
                              setRecentlyAddedWishlistId(product.id);
                              setTimeout(() => {
                                setRecentlyAddedWishlistId((prev) => (prev === product.id ? null : prev));
                              }, 850);
                            }
                            toggleWishlist(product.id);
                          }}
                          className={`relative ${hasDiscount ? 'top-11 right-3' : 'top-4 right-4'} p-2 rounded-full backdrop-blur-md border shadow-md transition-all duration-150 cursor-pointer z-10 active:scale-90 ${
                            wishlist.includes(product.id)
                              ? 'bg-rose-50/95 border-rose-200 text-rose-500 dark:bg-rose-950/90 dark:border-rose-900/60'
                              : 'bg-white/95 dark:bg-[#020617]/90 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:scale-110'
                          }`}
                          title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                          aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          {/* Subtle Expanding Ripple Ring on Addition */}
                          {recentlyAddedWishlistId === product.id && (
                            <span 
                              aria-hidden="true" 
                              className="absolute inset-0 rounded-full bg-rose-500/35 animate-heart-ring pointer-events-none" 
                            />
                          )}
                          <Heart 
                            className={`w-3.5 h-3.5 fill-current transition-colors duration-200 ${
                              recentlyAddedWishlistId === product.id 
                                ? 'animate-heart-pulse drop-shadow-[0_0_6px_rgba(244,63,94,0.7)]' 
                                : ''
                            }`} 
                          />
                        </button>

                        {/* Quick Buy floating action on image hover */}
                        <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-15">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickBuy(product, e);
                            }}
                            className="pointer-events-auto px-4 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white text-xs font-black shadow-xl border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                            <span>{quickBuyText}</span>
                          </button>
                        </div>
                      </div>

                      {/* Metadata contents */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] uppercase tracking-widest font-black font-mono text-indigo-500 dark:text-cyan-400 bg-indigo-500/5 dark:bg-cyan-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                              {getCategoryName(product.category)}
                            </span>
                          </div>

                          <h3 
                            onClick={() => handleViewProduct(product)}
                            className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-cyan-405 cursor-pointer transition"
                          >
                            {language === 'bn' ? product.nameBn : language === 'ar' ? product.nameAr : product.name}
                          </h3>

                          <p className="text-[11.5px] text-slate-500 dark:text-slate-350 leading-[1.6] line-clamp-2">
                            {language === 'bn' ? product.descriptionBn : language === 'ar' ? product.descriptionAr : product.description}
                          </p>

                          <div className="flex items-center gap-2.5 text-[10.5px] font-bold text-slate-450 select-none">
                            <div className="flex items-center gap-1 text-amber-500 shrink-0">
                              <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                              <span>{product.rating}</span>
                            </div>
                            <span>|</span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3 text-slate-400" />
                              <span>{totalSales} sold</span>
                            </span>
                          </div>
                        </div>

                        {/* Align triggers under strict forest border */}
                        <div className="space-y-4 pt-3.5 border-t border-slate-100 dark:border-slate-850">
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1.5">
                              {hasDiscount ? (
                                <>
                                  <span className="text-base font-black font-mono text-emerald-500 dark:text-emerald-400">
                                    {formatPrice(product.discountPrice!)}
                                  </span>
                                  <span className="text-[11px] text-slate-400 line-through font-mono">
                                    {formatPrice(product.price)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                            </div>

                            <span className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase bg-indigo-500/5 px-1.5 py-0.5 rounded">
                              {product.licenseType === 'extended' ? 'Extended' : product.licenseType === 'general' ? 'General' : 'Regular'}
                            </span>
                          </div>

                          {/* High fidelity 3-Button structure */}
                          {/* High fidelity 3-Button structure */}
                          <div className="flex flex-col gap-2">
                            {/* Row 1: View & Add Card */}
                            <div className="grid grid-cols-2 gap-2">
                              {/* 'View' Button */}
                              <button
                                onClick={() => handleViewProduct(product)}
                                className="px-2 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/20 dark:hover:border-cyan-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-[10.5px] font-extrabold duration-200 flex items-center justify-center gap-1 cursor-pointer hover:shadow-sm"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                                <span>{viewText}</span>
                              </button>

                              {/* 'Add Card' Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product, e);
                                }}
                                className="px-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/45 border border-indigo-200/55 dark:border-indigo-900/55 hover:border-indigo-300 dark:hover:border-cyan-500/40 text-indigo-650 dark:text-indigo-305 rounded-xl text-[10.5px] font-black duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-95 hover:shadow-xs"
                                title={addCardText}
                              >
                                <ShoppingCart className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                                <span>{addCardText}</span>
                              </button>
                            </div>

                            {/* Row 2: 'Quick Buy' Button (Instant cart addition & checkout redirect) */}
                            <button
                              id={`quick-buy-btn-${product.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickBuy(product, e);
                              }}
                              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white rounded-xl text-[11.5px] font-black flex items-center justify-center gap-1.5 duration-200 transition-all cursor-pointer hover:scale-[1.01] active:scale-95 text-center shadow-md shadow-indigo-600/15 dark:shadow-cyan-455/10 group/qb"
                              title={quickBuyText}
                            >
                              <Zap className="w-3.5 h-3.5 fill-current text-amber-300 animate-pulse" />
                              <span className="tracking-wide">{quickBuyText}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/qb:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Elegant Horizontal Divider Group */}
            <div className="my-12 flex items-center justify-center gap-4 text-slate-350 dark:text-slate-800" id="elegant-horizontal-divider-group">
              <span className="h-[1px] w-1/4 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-800 to-transparent"></span>
              <div className="flex gap-2 justify-center items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80"></span>
                <span className="w-2.5 h-2.5 rotate-45 border-2 border-indigo-500 dark:border-cyan-400 bg-white dark:bg-slate-950"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80"></span>
              </div>
              <span className="h-[1px] w-1/4 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-800 to-transparent"></span>
            </div>

            {/* Premium Gradient Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850" id="marketplace-pagination-outer">
                <p className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">
                  {language === 'bn' 
                    ? `সর্বমোট ${processedProducts.length} টি প্রোডাক্টের মধ্যে ${(currentPage - 1) * productsPerPage + 1} - ${Math.min(currentPage * productsPerPage, processedProducts.length)} দেখানো হচ্ছে` 
                    : `Showing ${(currentPage - 1) * productsPerPage + 1}-${Math.min(currentPage * productsPerPage, processedProducts.length)} of ${processedProducts.length} Premium Assets`}
                </p>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition duration-150 cursor-pointer ${
                      currentPage === 1
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-850'
                        : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500/30 dark:hover:border-cyan-500/30 shadow-xs'
                    }`}
                  >
                    <span>{language === 'bn' ? '← পূর্ববর্তী' : '← Previous'}</span>
                  </button>

                  {/* Pages list (Exact pages 1 2 3 4 5) */}
                  <div className="flex items-center gap-1.5 font-mono">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 text-xs font-black rounded-xl transition duration-150 cursor-pointer relative overflow-hidden flex items-center justify-center ${
                          currentPage === page
                            ? 'text-white border border-transparent shadow-md shadow-indigo-650/15 font-black'
                            : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 font-bold'
                        }`}
                      >
                        {currentPage === page && (
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-650 to-cyan-500 rounded-xl -z-10" />
                        )}
                        <span>{page}</span>
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition duration-150 cursor-pointer ${
                      currentPage === totalPages
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-850'
                        : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500/30 dark:hover:border-cyan-500/30 shadow-xs'
                    }`}
                  >
                    <span>{language === 'bn' ? 'পরবর্তী →' : 'Next →'}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* PREMIUM RECENTLY VIEWED PRODUCTS SECTION */}
        {recentlyViewed.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-100 dark:border-slate-850" id="recently-viewed-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500 dark:text-cyan-400 animate-pulse" />
                  <span>{t.recentlyViewedTitle}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.recentlyViewedSub}
                </p>
              </div>
              <button
                onClick={() => {
                  setRecentlyViewed([]);
                  localStorage.removeItem('webzone_recent_views');
                }}
                className="self-start sm:self-auto text-[10px] font-mono font-black text-rose-500 hover:text-rose-600 border border-rose-100 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/10 px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center gap-1.5 hover:shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearHistory}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentlyViewed.map(id => {
                const product = products.find(p => p.id === id);
                if (!product) return null;
                const hasDiscount = product.discountPrice !== undefined && product.discountPrice! < product.price;

                return (
                  <motion.div
                    key={`recent-${product.id}`}
                    onClick={() => handleViewProduct(product)}
                    className="group relative flex flex-col justify-between bg-white dark:bg-[#0B0F19] rounded-[20px] border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer h-full text-left overflow-hidden"
                    whileHover={{ y: -4 }}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[7px] font-mono font-black uppercase tracking-wider bg-indigo-600 text-white rounded-md z-10 shadow-xs">
                        {product.badge}
                      </span>
                    )}

                    {/* Image Cover */}
                    <div className="relative h-24 w-full overflow-hidden bg-slate-50 dark:bg-neutral-950">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase font-mono font-bold text-slate-400">
                          {getCategoryName(product.category)}
                        </span>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-neutral-100 line-clamp-1 group-hover:text-blue-500 transition-colors">
                          {language === 'bn' ? product.nameBn : language === 'ar' ? product.nameAr : product.name}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between gap-1.5">
                        <div className="flex flex-col">
                          {hasDiscount ? (
                            <>
                              <span className="text-[11px] font-extrabold font-mono text-emerald-500">
                                {formatPrice(product.discountPrice!)}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] font-extrabold font-mono text-slate-800 dark:text-neutral-200">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons: Quick Buy + Cart */}
                        <div className="flex items-center gap-1.5">
                          {/* Quick Buy button */}
                          <button
                            id={`quick-buy-compact-${product.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickBuy(product, e);
                            }}
                            className="px-2 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-black flex items-center gap-1 shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                            title={language === 'bn' ? 'কুইক বাই' : language === 'ar' ? 'شراء سريع' : 'Quick Buy'}
                          >
                            <Zap className="w-2.5 h-2.5 fill-current text-amber-300" />
                            <span>{language === 'bn' ? 'কুইক বাই' : 'Quick Buy'}</span>
                          </button>

                          {/* Action Cart click */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, e);
                            }}
                            className="p-1.5 bg-indigo-50 hover:bg-blue-600 dark:bg-indigo-950/40 dark:hover:bg-cyan-500/20 text-indigo-650 dark:text-indigo-305 hover:text-white dark:hover:text-cyan-400 rounded-lg border border-indigo-200/40 dark:border-indigo-900/40 hover:border-blue-600 transition-all duration-200 cursor-pointer hover:scale-105"
                            title={language === 'bn' ? 'কার্টে যোগ' : 'Add to cart'}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* -----------------------------------------------------------------
          PRODUCT DETAIL LIGHTBOX MODAL (STRICT FORES GRID PAIRING - 4 COLUMNS MODEL)
          ----------------------------------------------------------------- */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm overflow-y-auto"
            id="product-detail-modal"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#0B0F19] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] flex flex-col text-left"
            >
              
              {/* Header Cover Banner */}
              <div className="relative h-48 sm:h-64 bg-slate-100 dark:bg-slate-900 shrink-0">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Close Button overlay */}
                <button
                  onClick={() => setActiveProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-[#020617]/70 hover:bg-rose-600 rounded-full text-white transition cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1.5 max-w-2xl">
                    <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-widest font-black uppercase bg-indigo-600 rounded-md">
                      {getCategoryName(activeProduct.category)}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {language === 'bn' ? activeProduct.nameBn : language === 'ar' ? activeProduct.nameAr : activeProduct.name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Scrollable specs layout representing Envato/ThemeForest design */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">
                
                {/* 2-Column Specs Panel */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-100 dark:border-slate-850">
                  
                  {/* Left block short description */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description Overview</p>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-350 font-serif">
                        {language === 'bn' ? activeProduct.descriptionBn : language === 'ar' ? activeProduct.descriptionAr : activeProduct.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Technical Specifications & Features</p>
                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
                        {(language === 'bn' ? activeProduct.featuresBn : language === 'ar' ? activeProduct.featuresAr : activeProduct.features).map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/50 dark:border-slate-900">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-slate-600 dark:text-slate-350">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right specs metadata box */}
                  <div className="md:col-span-4 p-5 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-slate-900 space-y-4 text-xs">
                    <div className="space-y-1 pb-3 border-b border-slate-200 dark:border-slate-900">
                      <p className="font-bold text-slate-450 uppercase tracking-wide">Developer License</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xl font-black text-emerald-500">
                          {formatPrice(activeProduct.discountPrice || activeProduct.price)}
                        </span>
                        {activeProduct.discountPrice && (
                          <span className="bg-rose-500/10 text-rose-500 font-mono font-bold px-1.5 py-0.5 rounded text-[10px]">
                            {Math.round(((activeProduct.price - activeProduct.discountPrice) / activeProduct.price) * 100)}% discount
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-450">Release Grade:</span>
                        <span className="font-bold text-slate-800 dark:text-white uppercase font-mono">Verified Version</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450">Active Users:</span>
                        <span className="font-bold text-slate-800 dark:text-white font-mono">{activeProduct.downloadsCount || 45} Clients</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450">Review Rating:</span>
                        <span className="font-bold text-amber-500 font-mono">★ {activeProduct.rating} / 5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450">Theme System:</span>
                        <span className="font-bold text-indigo-400 capitalize">{activeProduct.licenseType || 'regular'} layout</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-indigo-500 bg-indigo-500/5 p-2 rounded-xl text-center border border-indigo-500/10 font-bold leading-relaxed">
                      🔓 cPanel Zip Delivery is instantly available for downlading.
                    </p>

                    {/* Available Promo Coupons List with Copy to Clipboard */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-900 space-y-2.5 text-left">
                      <p className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px] flex items-center gap-1.5 justify-start">
                        <Tag className="w-3 h-3 text-indigo-500" />
                        <span>{language === 'bn' ? 'প্রোমো কুপন সমূহ' : 'Available Promo Coupons'}</span>
                      </p>
                      <div className="space-y-2">
                        {coupons.length === 0 ? (
                          <p className="text-[10px] text-slate-450 italic font-sans">{language === 'bn' ? 'কোনো কুপন সক্রিয় নেই।' : 'No active coupons available.'}</p>
                        ) : (
                          coupons.map((c) => (
                            <div 
                              key={c.code}
                              className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 transition"
                            >
                              <div className="text-left font-sans">
                                <span className="font-mono font-black text-xs text-indigo-500 dark:text-indigo-400 block tracking-wider uppercase">
                                  {c.code}
                                </span>
                                <span className="text-[8.5px] text-slate-450 block">
                                  {language === 'bn' ? `${c.discountPercent}% ছাড় • মেয়াদ: ${c.expiryDate || 'Unlimited'}` : `${c.discountPercent}% OFF • Expires: ${c.expiryDate || 'Unlimited'}`}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(c.code);
                                  setCopiedCoupon(c.code);
                                  setTimeout(() => setCopiedCoupon(null), 2000);
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-500 hover:text-white dark:hover:text-white dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0"
                                title="Copy coupon code"
                              >
                                {copiedCoupon === c.code ? (
                                  <>
                                    <Check className="w-3 h-3 text-[rgb(16,185,129)]" />
                                    <span className="text-[rgb(16,185,129)] font-sans">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-450" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* -----------------------------------------------------------------
                    CUSTOMER REVIEWS & RATING FORM
                    ----------------------------------------------------------------- */}
                <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-850">
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      <span>{t.reviewsTitle}</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      {language === 'bn' ? `${getProductReviews(activeProduct).length} টি রিভিউর ভিত্তিতে তৈরি রেটিং` : language === 'ar' ? `بناءً على ${getProductReviews(activeProduct).length} من مراجعات العملاء` : `Overall feedback metrics based on ${getProductReviews(activeProduct).length} certified client reviews`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Reviews Summary & Statistics */}
                    <div className="md:col-span-4 p-5 bg-slate-50 dark:bg-neutral-950 border border-slate-200/50 dark:border-slate-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shrink-0">
                      <div className="space-y-1">
                        <span className="text-4xl font-extrabold text-slate-800 dark:text-white font-mono leading-none block">
                          {activeProduct.rating.toFixed(1)}
                        </span>
                        <div className="flex items-center justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(activeProduct.rating)
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-450 block font-sans">
                          {language === 'bn' ? '৫ এর মধ্যে রেটিং' : language === 'ar' ? 'من اصل 5 نجوم' : 'out of 5 stars'}
                        </span>
                      </div>

                      {/* Rating Distribution Chart */}
                      <div className="w-full space-y-1.5 text-xs">
                        {[5, 4, 3, 2, 1].map((ratingVal) => {
                          const reviews = getProductReviews(activeProduct);
                          const total = reviews.length;
                          const count = reviews.filter(r => r.rating === ratingVal).length;
                          const percent = total > 0 ? (count / total) * 100 : ratingVal === 5 ? 100 : 0;
                          return (
                            <div key={ratingVal} className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-slate-550 w-3">{ratingVal}</span>
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-amber-500 rounded-full" 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="font-mono text-[10px] text-slate-450 w-6 text-right">
                                {total > 0 ? `${count}` : ratingVal === 5 ? '1' : '0'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review List & Submission Form */}
                    <div className="md:col-span-8 space-y-6">
                      
                      {/* Submissions form block */}
                      <div className="p-5 bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-850 rounded-2xl space-y-4">
                        <h5 className="text-xs font-black uppercase text-indigo-550 dark:text-indigo-400 tracking-wider flex items-center gap-1">
                          <Plus className="w-4 h-4" />
                          <span>{t.writeReview}</span>
                        </h5>

                        {user ? (
                          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs text-left">
                            {/* Star Selection */}
                            <div className="space-y-1.5">
                              <label className="font-bold text-slate-600 dark:text-slate-400 block">{t.ratingLabel}</label>
                              <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() => setNewRating(star)}
                                    className="p-1 hover:scale-110 transition cursor-pointer"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
                                        star <= newRating
                                          ? 'text-amber-500 fill-amber-500'
                                          : 'text-slate-300 dark:text-slate-700 hover:text-amber-400'
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="font-mono font-bold text-amber-500 ml-2 text-sm">{newRating}.0 / 5.0</span>
                              </div>
                            </div>

                            {/* Comment field */}
                            <div className="space-y-1.5">
                              <label className="font-bold text-slate-600 dark:text-slate-400 block">{t.commentLabel}</label>
                              <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={language === 'bn' ? "এখানে আপনার মতামত বা কাজের অভিজ্ঞতা লিখুন..." : language === 'ar' ? "اكتب تفاصيل تجربتك مع هذا القالب أو البرمجية هنا..." : "Share details of your experience with this software package..."}
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white block focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-[12px]"
                                rows={3}
                                maxLength={500}
                              />
                            </div>

                            {/* Submit btn */}
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                disabled={reviewSubmitting}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-650 text-white font-black rounded-xl cursor-pointer flex items-center gap-1.5 transition transform active:scale-95 shadow-md shadow-indigo-600/10 text-[11px]"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{reviewSubmitting ? '...' : t.submitReview}</span>
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="p-4 bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-slate-900 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                            <div className="space-y-1">
                              <p className="font-bold text-slate-700 dark:text-slate-300">{t.pleaseLoginToReview}</p>
                              <p className="text-[10px] text-slate-450">Join WebzoneBD premium digital community to rate scripts and access cloud-installer codes.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenLogin) onOpenLogin();
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[11px] cursor-pointer shrink-0 transition"
                            >
                              {t.loginBtn}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-3">
                        {getProductReviews(activeProduct).length === 0 ? (
                          <p className="text-xs text-slate-450 italic font-sans py-4 text-center bg-slate-50 dark:bg-neutral-950/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-850">
                            {t.noReviews}
                          </p>
                        ) : (
                          getProductReviews(activeProduct).map((review) => (
                            <div 
                              key={review.id}
                              className="p-4 bg-slate-50 dark:bg-neutral-950/40 rounded-xl border border-slate-200/50 dark:border-slate-900 flex gap-3 text-left font-sans items-start"
                            >
                              <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 text-indigo-500 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 uppercase">
                                {review.userName.slice(0, 2)}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{review.userName}</span>
                                  <span className="text-[9px] text-slate-450 font-mono">
                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`w-3 h-3 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-800'}`} 
                                    />
                                  ))}
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-serif pt-1">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* -----------------------------------------------------------------
                    RELATED STAGE CONNECTIONS (MINIMUM 6 SHOWN ACROSS ROWS DESKTOP:4)
                    ----------------------------------------------------------------- */}
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>{t.similarLabel}</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">Complementary layouts within {getCategoryName(activeProduct.category)}</p>
                  </div>

                  {/* Desktop: 4 Columns per row representing layout mapping */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {productRecommendations.similar.map(p => {
                      const finalPrice = p.discountPrice || p.price;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => handleViewProduct(p)}
                          className="p-3.5 bg-slate-50 hover:bg-white dark:bg-neutral-950 dark:hover:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-850 cursor-pointer transition transform hover:-translate-y-1 space-y-2.5 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5 text-left">
                            <img src={p.image} className="h-20 w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                            <h5 className="font-bold text-xs text-slate-900 dark:text-slate-200 line-clamp-1">{p.name}</h5>
                            <p className="text-[10px] text-slate-450 line-clamp-2 leading-relaxed">{p.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-850">
                            <span className="font-mono font-black text-xs text-emerald-500">{formatPrice(finalPrice)}</span>
                            <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">
                              {p.badge || 'PRO'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic bought and customers items columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Bought Pack block */}
                  <div className="space-y-3.5 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                     <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                       <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                       {t.frequentBought}
                     </h4>
                     
                     <div className="space-y-2">
                       {productRecommendations.frequentlyBoughtTogether.slice(0, 3).map(p => (
                         <div 
                           key={p.id}
                           onClick={() => handleViewProduct(p)}
                           className="p-2 flex items-center justify-between gap-3 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-950 transition cursor-pointer"
                         >
                           <div className="flex items-center gap-2">
                             <img src={p.image} className="w-8 h-8 rounded shrink-0 object-cover" referrerPolicy="no-referrer" />
                             <span className="font-bold text-xs text-slate-700 dark:text-slate-350 line-clamp-1">{p.name}</span>
                           </div>
                           <span className="font-mono text-xs text-emerald-500 font-extrabold">{formatPrice(p.discountPrice || p.price)}</span>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Also Viewed block */}
                  <div className="space-y-3.5 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                     <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        {t.alsoViewed}
                     </h4>
                     <div className="space-y-2">
                       {productRecommendations.customersAlsoViewed.slice(0, 3).map(p => (
                         <div 
                           key={p.id}
                           onClick={() => handleViewProduct(p)}
                           className="p-2 flex items-center justify-between gap-3 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-950 transition cursor-pointer"
                         >
                           <div className="flex items-center gap-2">
                             <img src={p.image} className="w-8 h-8 rounded shrink-0 object-cover" referrerPolicy="no-referrer" />
                             <span className="font-bold text-xs text-slate-700 dark:text-slate-350 line-clamp-1">{p.name}</span>
                           </div>
                           <span className="font-mono text-xs text-emerald-500 font-extrabold">{formatPrice(p.discountPrice || p.price)}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>

              </div>

              {/* Bottom detail action links */}
              <div className="bg-slate-50 dark:bg-[#080B13] p-5 border-t border-slate-155 dark:border-slate-850 flex items-center justify-between shrink-0">
                <button
                  onClick={() => window.open(activeProduct.demoUrl, '_blank')}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-indigo-500" />
                  <span>{t.watchLive}</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setActiveProduct(null)}
                    className="px-4 py-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-neutral-200 font-extrabold"
                  >
                    Close Specifications
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickBuy(activeProduct, e);
                      setActiveProduct(null);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-black rounded-xl cursor-pointer hover:scale-[1.01] active:scale-95 transition flex items-center gap-1.5 shadow shadow-blue-500/10"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-300 animate-pulse" />
                    <span>{language === 'bn' ? 'কুইক বাই (চেকআউট)' : language === 'ar' ? 'شراء سريع' : 'Quick Buy'}</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
