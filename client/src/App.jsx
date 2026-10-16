import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategoryGrid from './components/CategoryGrid';
import CourseCard from './components/CourseCard';
import CourseDetailModal from './components/CourseDetailModal';
import PackagesModal from './components/PackagesModal';
import CertificationExamModal from './components/CertificationExamModal';
import CertificateViewModal from './components/CertificateViewModal';
import CategoryDetailPage from './components/CategoryDetailPage';
import ShopProducts from './components/ShopProducts';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutPaymentModal from './components/CheckoutPaymentModal';
import CustomOrderModal from './components/CustomOrderModal';
import AdminCRM from './components/AdminCRM';
import Footer from './components/Footer';
import HomeImageSlider from './components/HomeImageSlider';
import { 
  Search, Sparkles, Award, CheckCircle2, 
  Play, Check, BookOpen, ShoppingBag,
  MessageCircle, Heart, Star, Truck, ShieldCheck, 
  ChevronDown, ChevronUp, Gift, Clock, MapPin, ExternalLink, HelpCircle
} from 'lucide-react';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [userStatus, setUserStatus] = useState({
    activePackages: ['pkg-starter'],
    completedSteps: {},
    certificates: []
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [openFaq, setOpenFaq] = useState(0);

  // Store & Brand Settings (Company Name, Logo, Favicon, Currency, GST, Discounts, Contact)
  const [settings, setSettings] = useState({
    companyName: 'Anjali Crochet Knit',
    tagline: 'Handmade • Unique • With Love ♡',
    contactPhone: '+91 8882967692',
    whatsappNumber: '918882967692',
    contactEmail: 'anjalicrochetknit@gmail.com',
    address: '2039, 12th Avenue, Gaur City 2, Greater Noida West, Uttar Pradesh 201009',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    currencySymbol: '₹',
    currencyCode: 'INR',
    currencyPosition: 'prefix',
    gstRate: 5,
    gstName: 'GST (India)',
    enableGst: true,
    taxMode: 'exclusive',
    defaultDiscount: 10,
    promoCode: 'ANJALI10',
    promoBannerText: '🌸 Anjali Crochet Knit ♡ Bouquets from ₹499 & Keychains from ₹40 · WhatsApp: +91 8882967692 · Pan-India Delivery!',
    showPromoBanner: true,
    freeShippingThreshold: 499,
    supportHours: 'Open Every Day: 10:00 AM – 9:00 PM IST'
  });

  // Dynamic Browser Favicon & Title Updater
  useEffect(() => {
    if (settings.favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    }
    if (settings.companyName) {
      document.title = `${settings.companyName} • ${settings.tagline || 'Crochet Academy'}`;
    }
  }, [settings.favicon, settings.companyName, settings.tagline]);
  
  // Shopping Cart State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('petal_cart_items');
      return saved ? JSON.parse(saved) : [
        {
          id: "prod-honeybee-plush",
          title: "Handcrafted Honeybee Amigurumi Plush",
          price: 28,
          quantity: 1,
          coverImage: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
        }
      ];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductDetail, setActiveProductDetail] = useState(null);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [customOrderInitialData, setCustomOrderInitialData] = useState({});
  const [checkoutOrderData, setCheckoutOrderData] = useState(null);

  // Modals state
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeCategoryDetail, setActiveCategoryDetail] = useState(null);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
    const isAdminPath = window.location.pathname.startsWith('/admin') || 
                        window.location.hash.includes('admin') || 
                        window.location.search.includes('admin');
    if (isAdminPath) {
      setIsAdminOpen(true);
    }

    const handlePopState = () => {
      const isPath = window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin');
      setIsAdminOpen(isPath);
      if (window.location.hash.startsWith('#category-')) {
        const catId = window.location.hash.replace('#category-', '');
        setCategories(currentCats => {
          const foundCat = currentCats.find(c => c.id === catId);
          if (foundCat) {
            setActiveCategoryDetail(foundCat);
            setActiveTab('category-detail');
          }
          return currentCats;
        });
      } else {
        setActiveCategoryDetail(null);
        setActiveTab(prev => prev === 'category-detail' ? 'explore' : prev);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    window.history.pushState(null, '', '/admin');
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    window.history.pushState(null, '', '/');
  };

  const handleOpenCategoryDetail = (cat) => {
    setActiveCategoryDetail(cat);
    setActiveTab('category-detail');
    window.history.pushState(null, '', `#category-${cat.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveTab('explore');
    setActiveCategoryDetail(null);
    if (window.location.hash.startsWith('#category-')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    try {
      localStorage.setItem('petal_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const handleAddToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: quantity,
          coverImage: product.coverImage || product.images?.[0] || '',
          badge: product.badge,
          stock: product.stock
        }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedCheckout = (calcData) => {
    setIsCartOpen(false);
    setCheckoutOrderData(calcData);
  };

  const handleOpenCustomOrder = (initialData = {}) => {
    setCustomOrderInitialData(initialData);
    setIsCustomOrderOpen(true);
  };

  const handleOrderSuccess = (newOrder) => {
    setCartItems([]);
    setAppliedPromo(null);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(err => console.error("Error updating products inventory:", err));
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [catRes, courseRes, pkgRes, userRes, prodRes, settingsRes, slidesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/courses'),
        fetch('/api/packages'),
        fetch('/api/user/status'),
        fetch('/api/products'),
        fetch('/api/settings'),
        fetch('/api/slides')
      ]);

      const [catData, courseData, pkgData, userData, prodData, settingsData, slidesData] = await Promise.all([
        catRes.json(),
        courseRes.json(),
        pkgRes.json(),
        userRes.json(),
        prodRes.json(),
        settingsRes.json(),
        slidesRes.json()
      ]);

      if (catData.success) {
        setCategories(catData.data);
        if (window.location.hash.startsWith('#category-')) {
          const catId = window.location.hash.replace('#category-', '');
          const found = catData.data.find(c => c.id === catId);
          if (found) {
            setActiveCategoryDetail(found);
            setActiveTab('category-detail');
          }
        }
      }
      if (courseData.success) setCourses(courseData.data);
      if (pkgData.success) setPackages(pkgData.data);
      if (userData.success) setUserStatus(userData.data);
      if (prodData.success) setProducts(prodData.data);
      if (settingsData.success && settingsData.data) setSettings(settingsData.data);
      if (slidesData.success && slidesData.data) setSlides(slidesData.data);
    } catch (err) {
      console.error("Error loading academy data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (courseId, stepNumber) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/toggle-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber })
      });
      const data = await res.json();
      if (data.success) {
        setUserStatus(prev => ({
          ...prev,
          completedSteps: {
            ...prev.completedSteps,
            [courseId]: data.completedSteps
          }
        }));
      }
    } catch (err) {
      console.error("Error toggling step:", err);
    }
  };

  const handleEnrollSuccess = (data) => {
    setUserStatus(prev => ({
      ...prev,
      activePackages: data.activePackages,
      studentName: data.package?.studentName || prev.studentName
    }));
  };

  const handleExamPassed = (newCert) => {
    setUserStatus(prev => ({
      ...prev,
      certificates: [newCert, ...(prev.certificates || [])]
    }));
  };

  const filteredCourses = courses.filter(c => {
    const matchesCat = !selectedCategory || c.categoryId === selectedCategory;
    const matchesLevel = levelFilter === 'All' || c.level.toLowerCase().includes(levelFilter.toLowerCase());
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLevel && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCategoryDetail={activeCategoryDetail}
        onBackToHome={handleBackToHome}
        userStatus={userStatus}
        onOpenPackages={() => setIsPackagesOpen(true)}
        onOpenExam={() => setIsExamOpen(true)}
        onOpenCertificate={(cert) => setActiveCertificate(cert)}
        onOpenAdmin={handleOpenAdmin}
        cartItemsCount={cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomOrder={() => handleOpenCustomOrder({})}
        settings={settings}
      />

      {/* HOME PAGE DYNAMIC IMAGE SLIDER (Placed directly after header) */}
      {activeTab === 'explore' && (
        <HomeImageSlider 
          slides={slides}
          products={products}
          onSelectProduct={(prod) => setActiveProductDetail(prod)}
          onNavigateShop={() => setActiveTab('shop')}
          onOpenCustomOrder={handleOpenCustomOrder}
          onOpenPackages={() => setIsPackagesOpen(true)}
          settings={settings}
        />
      )}

      <main style={{ flex: 1 }}>
        {activeTab === 'category-detail' && activeCategoryDetail ? (
          <CategoryDetailPage 
            category={activeCategoryDetail}
            categories={categories}
            courses={courses}
            onBack={handleBackToHome}
            onSwitchCategory={handleOpenCategoryDetail}
            onSelectCourse={(course) => setActiveCourse(course)}
            onOpenPackages={() => setIsPackagesOpen(true)}
            onOpenExam={() => setIsExamOpen(true)}
          />
        ) : activeTab === 'shop' ? (
          <ShopProducts 
            products={products}
            onSelectProduct={(prod) => setActiveProductDetail(prod)}
            onAddToCart={handleAddToCart}
            onOpenCustomOrder={handleOpenCustomOrder}
            settings={settings}
          />
        ) : (
          <>
            {/* HERO SECTION */}
            <section className="hero-section">
              <div className="container">
                <div className="hero-grid">
                  
                  {/* Left Hero Content */}
                  <div className="hero-content">
                    <div>
                      <span className="badge badge-terracotta" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={14} />
                        Anjali Crochet Knit ♡ Handmade with Love • Gaur City 2, Gr. Noida West
                      </span>
                    </div>

                    <h1 className="hero-title">
                      Handcrafted Flowers, Gifts <br />
                      <span className="hero-title-accent">& Crochet Classes,</span> Made for You.
                    </h1>

                    <p className="hero-lead">
                      Discover eternal blooming bouquets from <strong>₹499</strong>, cute keychains from <strong>₹40</strong>, cuddly amigurumi toys, and custom gift hampers crafted with 100% hypoallergenic yarn. Learn crochet with Anjali Kumari or order directly on WhatsApp with Pan-India doorstep delivery!
                    </p>

                    <div className="hero-cta-group">
                      <button
                        onClick={() => setActiveTab('shop')}
                        className="btn btn-primary"
                        style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <ShoppingBag size={18} />
                        <span>Explore Handcrafted Shop</span>
                      </button>

                      <a
                        href={`https://wa.me/${settings?.whatsappNumber || '918882967692'}?text=Hello%20Anjali!%20I%20want%20to%20order%20from%20your%20crochet%20store.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{ 
                          padding: '0.85rem 1.5rem', 
                          fontSize: '1rem', 
                          backgroundColor: '#25D366', 
                          color: '#FFFFFF', 
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                        }}
                      >
                        <MessageCircle size={18} />
                        <span>Order on WhatsApp</span>
                      </a>

                      <button
                        onClick={() => setIsPackagesOpen(true)}
                        className="btn btn-secondary"
                        style={{ padding: '0.85rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Award size={18} color="var(--color-honey)" />
                        <span>Crochet Classes & Cert</span>
                      </button>
                    </div>

                    <div className="hero-perks">
                      <div className="perk-item">
                        <CheckCircle2 size={16} color="var(--color-sage)" />
                        <span>100% Handcrafted with Love</span>
                      </div>
                      <div className="perk-item">
                        <CheckCircle2 size={16} color="var(--color-sage)" />
                        <span>Pan-India Doorstep Delivery</span>
                      </div>
                      <div className="perk-item">
                        <CheckCircle2 size={16} color="var(--color-sage)" />
                        <span>Direct WhatsApp Customization</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Hero Visual Card */}
                  <div className="hero-media-wrapper">
                    <div className="hero-media-card">
                      <img 
                        src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80" 
                        alt="Handmade crochet flowers bouquet"
                        className="hero-media-img"
                      />
                      
                      <div className="hero-floating-badge">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--color-honey)', fontWeight: 800 }}>★</span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>5.0 Google Rating</strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          100+ Happy Customers across India & NCR
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab('shop')}
                        className="hero-floating-cta"
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MessageCircle size={16} color="#FFFFFF" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Bouquets from ₹499</div>
                          <div style={{ fontSize: '0.72rem', color: '#D8CCC4' }}>Order via WhatsApp or Online</div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* LOCAL HIGHLIGHTS STRIP (Directly Inspired by anjalicrochet.store) */}
            <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-md)',
                padding: '1.5rem 2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(200, 109, 81, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    🧶
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>Wool & Yarn Shop</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vardhman, Ganga skeins & hooks</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(107, 142, 123, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    👩‍🏫
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>Crochet Classes</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>From ₹1,000/mo (Online & Studio)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(217, 155, 67, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    📦
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>Bulk & Return Gifts</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Weddings & Corporate Hampers</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(139, 111, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    ⏰
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>Open Every Day</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>10 AM – 9 PM • Gaur City 2</span>
                  </div>
                </div>
              </div>
            </div>

        {/* MAIN BODY CONTENT */}
        <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
          
          {/* GIFTS FOR EVERY OCCASION (As featured on anjalicrochet.store) */}
          <div style={{ marginBottom: '4.5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
              <span className="badge badge-terracotta" style={{ marginBottom: '0.65rem' }}>
                Handcrafted Keepsakes
              </span>
              <h2 style={{ fontSize: '2.4rem', margin: '0 0 0.65rem', fontFamily: 'var(--font-serif)' }}>
                Gifts for Every Occasion ♡
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', margin: 0, lineHeight: 1.6 }}>
                Whether it's a romantic milestone, family celebration, or heartfelt return gift, our eternal hand-crocheted treasures make every moment unforgettable.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  icon: '🎂',
                  title: 'Birthdays & Anniversaries',
                  desc: 'Eternal Rose & Lily bouquets that never wilt, adorable plushies & personalized greeting tags.',
                  badge: 'Forever Bouquets',
                  color: '#E77D59',
                  action: () => setActiveTab('shop')
                },
                {
                  icon: '💍',
                  title: 'Weddings & Return Gifts',
                  desc: 'Luxury customized pinewood hampers, bespoke favor bags & bulk discounts for wedding guests.',
                  badge: 'Custom Favors',
                  color: '#C86D51',
                  action: () => handleOpenCustomOrder({ itemType: 'Wedding & Return Gift Favors' })
                },
                {
                  icon: '🪔',
                  title: 'Festivals & Celebrations',
                  desc: 'Diwali torans, Karwa Chauth gift boxes, Rakhi sets & auspicious festive home décor.',
                  badge: 'Festive Specials',
                  color: '#D99B43',
                  action: () => setActiveTab('shop')
                },
                {
                  icon: '🍼',
                  title: 'Baby Showers & Newborns',
                  desc: 'Cloud-soft combed cotton booties, natural beechwood bunny rattles & nursery milestone props.',
                  badge: '100% Baby-Safe',
                  color: '#6B8E7B',
                  action: () => setActiveTab('shop')
                }
              ].map((occ, idx) => (
                <div 
                  key={idx}
                  onClick={occ.action}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2rem 1.5rem',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2.2rem' }}>{occ.icon}</span>
                      <span style={{ backgroundColor: `${occ.color}15`, color: occ.color, fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                        {occ.badge}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                      {occ.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                      {occ.desc}
                    </p>
                  </div>
                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: occ.color, fontWeight: 700, fontSize: '0.82rem' }}>
                    <span>Browse Collection</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORIES SECTION */}
          <div id="categories">
            <CategoryGrid 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(id) => setSelectedCategory(id)}
              onOpenCategoryDetail={handleOpenCategoryDetail}
            />
          </div>

          {/* PROJECT MASTERCLASSES SECTION */}
          <div>
            <div className="filter-toolbar">
              <div>
                <span className="badge badge-sage" style={{ marginBottom: '0.4rem' }}>
                  Video & Illustrated Guides
                </span>
                <h3 style={{ fontSize: '2rem', margin: 0 }}>
                  {selectedCategory 
                    ? `${categories.find(c => c.id === selectedCategory)?.title || 'Selected'} Projects` 
                    : 'All Crochet Masterclasses'}
                </h3>
              </div>

              {/* Search & Level Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                
                {/* Search Bar */}
                <div className="search-box-wrapper">
                  <Search size={16} className="search-icon-pos" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects or stitches..."
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', fontWeight: 700 }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Level selector */}
                <div className="filter-pills">
                  {['All', 'Beginner', 'Intermediate'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`pill-btn ${levelFilter === lvl ? 'active' : ''}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="courses-grid">
                {filteredCourses.map((course) => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                    completedSteps={userStatus.completedSteps?.[course.id] || []}
                    onSelectCourse={(c) => setActiveCourse(c)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '3.5rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>No projects match your filter criteria.</p>
                <button
                  onClick={() => { setSelectedCategory(null); setSearchQuery(''); setLevelFilter('All'); }}
                  className="btn btn-outline-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* ALL-IN-ONE PACKAGES SECTION (AS PER HOME PAGE) */}
          <div id="packages" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            
            {/* Header Callout */}
            <div className="bundle-callout-banner" style={{ marginBottom: '2.5rem' }}>
              <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
                <span className="badge badge-terracotta" style={{ marginBottom: '0.75rem' }}>
                  All-In-One Course Packages
                </span>
                <h2 style={{ fontSize: '2.4rem', marginBottom: '0.85rem', lineHeight: 1.2 }}>
                  Unlock Complete Access & Earn Your Verified Certificate
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  Get full access to all step-by-step video masterclasses, printable PDF stitch charts, unlimited access to our 80% MCQ certification assessment, and official guild credentials.
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <button
                    onClick={() => setIsPackagesOpen(true)}
                    className="btn btn-primary"
                    style={{ padding: '0.85rem 1.75rem' }}
                  >
                    <Sparkles size={16} />
                    <span>Choose Membership Tier</span>
                  </button>
                  <button
                    onClick={() => setIsExamOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '0.85rem 1.75rem' }}
                  >
                    <Award size={16} color="var(--color-honey)" />
                    <span>Test Your Knowledge (80% MCQ)</span>
                  </button>
                </div>
              </div>

              <div className="callout-yarn-watermark">
                🧶
              </div>
            </div>

            {/* Exact Single-Row 4 Packages Grid Display */}
            <div className="packages-tier-grid">
              {packages.map((pkg) => {
                const isFree = Number(pkg.price) === 0;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setIsPackagesOpen(true)}
                    className={`package-card ${pkg.popular ? 'selected' : ''}`}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    {pkg.badge && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '-11px', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        backgroundColor: pkg.popular ? 'var(--color-primary)' : (pkg.color || '#8B6F8E'), 
                        color: '#FFFFFF', 
                        fontSize: '0.68rem', 
                        fontWeight: 800, 
                        padding: '0.2rem 0.75rem', 
                        borderRadius: '999px', 
                        whiteSpace: 'nowrap',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {pkg.badge}
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>
                          {pkg.name}
                        </h4>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {pkg.tagline}
                      </p>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <span className="package-price-number" style={{ color: isFree ? 'var(--color-sage)' : 'var(--color-primary)' }}>
                          {isFree ? "Free" : `${settings?.currencySymbol || '₹'}${pkg.price}`}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                          / {pkg.billing}
                        </span>
                      </div>

                      {pkg.includesCertification ? (
                        <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-honey-light)', border: '1px solid rgba(217,155,67,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#9E7333', fontWeight: 700, marginBottom: '1rem' }}>
                          <Award size={15} /> Includes 80% MCQ Exam & Cert
                        </div>
                      ) : (
                        <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          <BookOpen size={15} /> Foundational Practice Only
                        </div>
                      )}

                      <ul className="package-features-list">
                        {pkg.features?.map((feat, idx) => (
                          <li key={idx}>
                            <Check size={14} className="feature-check" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPackagesOpen(true);
                      }}
                      className={pkg.popular ? "btn btn-primary" : "btn btn-secondary"}
                      style={{ width: '100%', marginTop: '1.25rem', padding: '0.65rem', fontSize: '0.85rem' }}
                    >
                      {isFree ? "Start Free Now →" : "Enroll in " + pkg.name + " →"}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

          {/* CERTIFICATION OVERVIEW SECTION */}
          <div style={{ marginTop: '5rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '3.5rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="badge badge-honey">
                    Official Assessment
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-sage)', fontWeight: 700 }}>
                    ≥ 80% Score to Pass
                  </span>
                </div>
                <h3 style={{ fontSize: '2.4rem', margin: 0, lineHeight: 1.2 }}>
                  Accredited Crochet Mastery Assessment
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  Our comprehensive 10-Question MCQ test evaluates your understanding of yarn weights, hook pairings, tension control, invisible decreases, granny square joins, and international stitch notation. Score 80% or higher to unlock your official verified certificate!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.82rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem' }}>10 Questions</strong>
                    <span style={{ color: 'var(--text-muted)' }}>Multiple choice format</span>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: '0.9rem' }}>80% Threshold</strong>
                    <span style={{ color: 'var(--text-muted)' }}>8/10 or more to pass</span>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <strong style={{ display: 'block', color: 'var(--color-sage)', fontSize: '0.9rem' }}>Instant Grade</strong>
                    <span style={{ color: 'var(--text-muted)' }}>Immediate diagnostic review</span>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <strong style={{ display: 'block', color: 'var(--color-honey)', fontSize: '0.9rem' }}>Official Certificate</strong>
                    <span style={{ color: 'var(--text-muted)' }}>Download, print & verify</span>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    onClick={() => setIsExamOpen(true)}
                    className="btn btn-sage"
                    style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
                  >
                    <Award size={18} />
                    <span>Begin Certification Exam (80%) →</span>
                  </button>
                </div>
              </div>

              {/* Sample preview card */}
              <div style={{ backgroundColor: 'var(--bg-card-warm)', border: '4px solid rgba(217, 155, 67, 0.4)', borderRadius: '20px', padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', color: '#9E7333' }}>
                  Credential Preview
                </span>
                <h4 style={{ fontSize: '1.65rem', margin: 0 }}>
                  Certificate of Mastery
                </h4>
                <div style={{ borderBottom: '1px solid rgba(217, 155, 67, 0.3)', paddingBottom: '0.35rem', margin: '0.25rem auto', maxWidth: '240px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {userStatus.studentName || "Your Full Name Here"}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Official validation of crochet technique, tension control, and pattern execution.
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-sage)', backgroundColor: 'var(--color-sage-light)', padding: '0.35rem 0.85rem', borderRadius: '999px' }}>
                    Passing Grade: ≥ 80%
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* BULK & WHOLESALE ORDERS BANNER (As per anjalicrochet.store) */}
          <div className="bulk-banner-card" style={{
            marginTop: '5rem',
            backgroundColor: '#2C2420',
            borderRadius: '28px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '640px', zIndex: 2 }}>
              <span style={{ backgroundColor: 'rgba(217,155,67,0.2)', color: 'var(--color-honey)', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                <Sparkles size={13} /> Bulk & Wholesale Gifting Partner
              </span>
              <h3 style={{ fontSize: '2.2rem', color: '#FFFFFF', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                Planning a Wedding, Return Gift, or Corporate Event?
              </h3>
              <p style={{ color: '#D8CCC4', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Get custom gift hampers, forever flower arrangements, and keychains handcrafted to match your event color theme. We provide wholesale rates (starting from 5+ pieces), bespoke calligraphy tags, and Pan-India bulk courier shipping.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', zIndex: 2 }}>
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '918882967692'}?text=${encodeURIComponent('Hello Anjali! I would like to enquire about bulk / wholesale gift orders for an upcoming event.')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)'
                }}
              >
                <MessageCircle size={18} />
                <span>Enquire on WhatsApp</span>
              </a>
              <button
                onClick={() => handleOpenCustomOrder({ itemType: 'Bulk Wholesale Hamper' })}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem', backgroundColor: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Request Custom Quote
              </button>
            </div>
          </div>

          {/* WHY CHOOSE ANJALI CROCHET KNIT */}
          <div style={{ marginTop: '5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
              <span className="badge badge-sage" style={{ marginBottom: '0.5rem' }}>
                Our Promise & Craftsmanship
              </span>
              <h2 style={{ fontSize: '2.3rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)' }}>
                Why Choose Anjali Crochet Knit?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                From our studio in Gaur City 2, Greater Noida West to homes across India, here is what makes our handcrafted creations special.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: '🌸', title: '100% Handcrafted', desc: 'Every stitch made with love by skilled women artisans. No machines, pure human artistry.' },
                { icon: '🧶', title: 'Premium Yarn', desc: 'We only use soft, non-toxic, hypoallergenic, baby-safe milk cotton and acrylic yarns.' },
                { icon: '🎨', title: 'Custom Made to Order', desc: 'Pick your favorite colors, custom lengths, names, and customized gift wraps.' },
                { icon: '🚚', title: 'Pan-India Delivery', desc: 'Carefully cushioned and safely dispatched to every pin code across India with tracking.' },
                { icon: '⭐', title: 'Direct WhatsApp Care', desc: 'Personal attention on WhatsApp directly from founder Anjali Kumari for every single order.' }
              ].map((pill, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.75rem 1.25rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{pill.icon}</div>
                  <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>{pill.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{pill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMER REVIEWS & TESTIMONIALS (Google 5-Star Reviews) */}
          <div style={{ marginTop: '5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              <span className="badge badge-honey" style={{ marginBottom: '0.5rem' }}>
                ★ 5.0 Google Verified Ratings
              </span>
              <h2 style={{ fontSize: '2.3rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)' }}>
                Loved by Crochet Enthusiasts & Givers
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                Real feedback from our happy clients, students, and gift shoppers in Delhi-NCR and across India.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  name: 'Pooja Sharma',
                  location: 'Gaur City 2, Greater Noida',
                  review: 'I ordered the crochet rose & lily eternal bouquet for our wedding anniversary. It looks breathtaking in our living room and never wilts! Beautiful packaging.',
                  tag: 'Eternal Bouquet'
                },
                {
                  name: 'Rahul Verma',
                  location: 'Sector 62, Noida',
                  review: 'Ordered 40 customized sunflower keychains for our college farewell. Anjali delivered everything on time with cute individual packaging. Super reliable!',
                  tag: 'Bulk Farewell Order'
                },
                {
                  name: 'Neha Gupta',
                  location: 'Delhi',
                  review: 'Joined Anjali’s beginner crochet classes on weekends. She is so patient and broke down every stitch with ease. Now I can crochet granny square bags easily!',
                  tag: 'Crochet Student'
                },
                {
                  name: 'Priya Sen',
                  location: 'Bengaluru, Karnataka',
                  review: 'Pan-India shipping was surprisingly fast. The baby booties and wooden rattle gift set were packed in a lovely box. My sister loved it for her baby shower!',
                  tag: 'Baby Shower Gift'
                }
              ].map((rev, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ color: 'var(--color-honey)', fontSize: '0.85rem', letterSpacing: '2px' }}>
                        ★★★★★
                      </div>
                      <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-canvas)', color: 'var(--color-primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                        {rev.tag}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1.25rem' }}>
                      "{rev.review}"
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-sage-light)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      {rev.name[0]}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)' }}>{rev.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 {rev.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
          <div style={{ marginTop: '5rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              <span className="badge badge-terracotta" style={{ marginBottom: '0.5rem' }}>
                Got Questions?
              </span>
              <h2 style={{ fontSize: '2.3rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                Everything you need to know about our products, custom orders, classes, and Pan-India shipping.
              </p>
            </div>

            <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                {
                  q: "How can I place an order with Anjali Crochet Knit?",
                  a: "You can easily place an order right here through our online store cart with instant order confirmation, or directly message us on WhatsApp (+91 8882967692) with your selected items."
                },
                {
                  q: "Can I customize the color, flower arrangement, or size of a bouquet?",
                  a: "Yes, absolutely! We love custom commissions. Click on 'Custom Order' or WhatsApp us your color preferences, special ribbon text, or reference pictures. We will tailor it to your exact vision."
                },
                {
                  q: "How long does delivery take across India?",
                  a: "Orders are dispatched within 24–48 hours from Greater Noida West. Standard delivery reaches most metro cities in 2–4 business days and other regions in 4–6 business days with tracking."
                },
                {
                  q: "Do you offer crochet classes in Greater Noida West and online?",
                  a: "Yes! We run online foundation batches as well as hands-on weekend studio sessions at Gaur City 2, Greater Noida West starting from ₹1,000/month. We teach all levels from absolute beginner to master amigurumi."
                },
                {
                  q: "Where is your physical studio located and what are your timings?",
                  a: "Our studio is located at 2039, 12th Avenue, Gaur City 2, Greater Noida West, Uttar Pradesh 201009. We are open every day from 10:00 AM to 9:00 PM IST."
                }
              ].map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: isOpen ? 'var(--color-primary)' : 'var(--text-main)'
                      }}
                    >
                      <span>{item.q}</span>
                      {isOpen ? <ChevronUp size={18} color="var(--color-primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)' }}>
                        <p style={{ margin: '0.85rem 0 0' }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
          </>
        )}

      </main>

      {/* FOOTER */}
      <Footer 
        onOpenPackages={() => setIsPackagesOpen(true)}
        onOpenExam={() => setIsExamOpen(true)}
        settings={settings}
      />

      {/* MODALS */}
      {activeCourse && (
        <CourseDetailModal 
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          completedSteps={userStatus.completedSteps?.[activeCourse.id] || []}
          onToggleStep={handleToggleStep}
        />
      )}

      {isPackagesOpen && (
        <PackagesModal 
          packages={packages}
          userStatus={userStatus}
          onClose={() => setIsPackagesOpen(false)}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}

      {isExamOpen && (
        <CertificationExamModal 
          onClose={() => setIsExamOpen(false)}
          userStatus={userStatus}
          onExamPassed={handleExamPassed}
        />
      )}

      {activeCertificate && (
        <CertificateViewModal 
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Custom Commission Order Modal */}
      <CustomOrderModal 
        isOpen={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
        initialData={customOrderInitialData}
        onCustomOrderSubmitted={(newCommission) => {
          // Commission successfully submitted
        }}
        settings={settings}
      />

      {/* Product Detail Modal */}
      {activeProductDetail && (
        <ProductDetailModal 
          product={activeProductDetail}
          onClose={() => setActiveProductDetail(null)}
          onAddToCart={handleAddToCart}
          onOpenCustomOrder={(initialData) => {
            setActiveProductDetail(null);
            handleOpenCustomOrder(initialData);
          }}
          settings={settings}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedCheckout={handleProceedCheckout}
        onOpenCustomOrder={() => {
          setIsCartOpen(false);
          handleOpenCustomOrder({});
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={(promo) => setAppliedPromo(promo)}
        settings={settings}
      />

      {/* Checkout & Payment Modal */}
      {checkoutOrderData && (
        <CheckoutPaymentModal 
          orderData={checkoutOrderData}
          onClose={() => setCheckoutOrderData(null)}
          onOrderSuccess={handleOrderSuccess}
          settings={settings}
        />
      )}

      {/* Floating WhatsApp Action Button (Matching anjalicrochet.store) */}
      <a
        href={`https://wa.me/${settings?.whatsappNumber || '918882967692'}?text=Hello%20Anjali%20Crochet%20Knit!%20I%20have%20an%20order%20inquiry.`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-wa-btn"
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 95,
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          padding: '0.75rem 1.35rem',
          borderRadius: '999px',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          border: '2px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          fontWeight: 800,
          textDecoration: 'none',
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        title="Chat directly with Anjali on WhatsApp (+91 8882967692)"
      >
        <MessageCircle size={20} />
        <span>Chat on WhatsApp</span>
      </a>

      {/* Floating Admin Studio Button (Positioned at bottom-left) */}
      <button
        onClick={handleOpenAdmin}
        className="floating-admin-btn"
        style={{
          position: 'fixed',
          bottom: '22px',
          left: '22px',
          zIndex: 90,
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          padding: '0.65rem 1.15rem',
          borderRadius: '999px',
          boxShadow: '0 6px 20px rgba(200, 109, 81, 0.4)',
          border: '2px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '0.85rem'
        }}
        title="Open Admin CRM to manage students, orders, categories & classes"
      >
        <span>⚙️</span>
        <span>Admin CRM</span>
      </button>

      {isAdminOpen && (
        <AdminCRM 
          categories={categories}
          courses={courses}
          packages={packages}
          products={products}
          slides={slides}
          onUpdateSlides={(newSlides) => setSlides(newSlides)}
          onClose={handleCloseAdmin}
          onRefreshData={fetchInitialData}
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(newSettings)}
        />
      )}

    </div>
  );
}
