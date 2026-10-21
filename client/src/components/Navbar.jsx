import React, { useState, useRef, useEffect } from 'react';
import { 
  Award, Sparkles, ShoppingBag, Flame, FolderPlus, 
  MessageCircle, Menu, X, Phone, MapPin, ChevronDown, Layers 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeCategoryDetail,
  onBackToHome,
  userStatus, 
  onOpenPackages, 
  onOpenExam,
  onOpenCertificate,
  onOpenAdmin,
  cartItemsCount = 0,
  onOpenCart,
  onOpenCustomOrder,
  settings
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const hasCertificate = userStatus?.certificates && userStatus.certificates.length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoHome = () => {
    setMobileMenuOpen(false);
    if (onBackToHome) {
      onBackToHome();
    } else {
      setActiveTab('explore');
    }
  };

  const handleNavigate = (action) => {
    setMobileMenuOpen(false);
    action();
  };

  // Format brand name into elegant pattern: Main name in script font + heart, sub in serif
  const getBrandParts = (name) => {
    const raw = (name || 'Tishaya Petal & Loop').trim();
    if (raw.toLowerCase().includes('tishaya')) {
      const remaining = raw.replace(/tishaya/i, '').trim();
      return { main: 'Tishaya', sub: remaining || 'Petal & Loop' };
    }
    const parts = raw.split(' ');
    if (parts.length > 1) {
      return { main: parts[0], sub: parts.slice(1).join(' ') };
    }
    return { main: raw, sub: 'Petal & Loop' };
  };

  const brandParts = getBrandParts(settings?.companyName);

  return (
    <>
      {/* Top Announcement Bar */}
      {settings?.showPromoBanner && settings?.promoBannerText && (
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          fontWeight: 600,
          padding: '0.45rem 1rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          position: 'relative',
          zIndex: 101,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{settings.promoBannerText}</span>
          {settings.contactPhone && (
            <span style={{ opacity: 0.9, fontSize: '0.74rem', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '0.75rem', flexShrink: 0 }}>
              📞 Helpline: {settings.contactPhone}
            </span>
          )}
        </div>
      )}

      <header className="site-header">
        <div className="container nav-inner">
          
          {/* Brand Logo & Name - Pattern: Big circular logo badge + script first name + serif sub + spaced motto */}
          <div 
            className="brand-wrapper"
            onClick={handleGoHome}
            aria-label={`${settings?.companyName || 'Tishaya Petal & Loop'} home`}
          >
            <img 
              src={settings?.logo || "/logo.png"} 
              alt={settings?.companyName || "Tishaya Petal & Loop"} 
              className="brand-logo-img" 
              onError={(e) => { e.target.src = "/logo.png"; }}
            />
            <div className="brand-text-block">
              <span className="brand-script-name">
                {brandParts.main} <span className="brand-heart">♡</span>
              </span>
              <span className="brand-sub-title">{brandParts.sub}</span>
              <span className="brand-tag-motto">{settings?.tagline || "HANDMADE • UNIQUE • WITH LOVE"}</span>
            </div>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="nav-links-center">
            <button
              onClick={handleGoHome}
              className={`nav-link-item ${activeTab === 'explore' ? 'active' : ''}`}
            >
              Categories & Classes
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`nav-link-item ${activeTab === 'shop' ? 'active' : ''}`}
              style={{ fontWeight: activeTab === 'shop' ? 800 : 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ShoppingBag size={14} color="var(--color-primary)" />
              <span>Handcrafted Shop</span>
              <span style={{ 
                fontSize: '0.65rem', 
                backgroundColor: 'rgba(200, 109, 81, 0.12)', 
                color: 'var(--color-primary)', 
                padding: '0.1rem 0.45rem', 
                borderRadius: '12px', 
                fontWeight: 800 
              }}>
                From ₹40
              </span>
            </button>

            <button
              onClick={onOpenCustomOrder}
              className="nav-link-item"
              style={{ color: '#9E7333', fontWeight: 600 }}
              title="Create a personalized crochet commission"
            >
              <Sparkles size={14} color="var(--color-honey)" />
              <span>Custom Order</span>
            </button>

            {activeTab === 'category-detail' && activeCategoryDetail && (
              <button
                onClick={() => setActiveTab('category-detail')}
                className="nav-link-item active"
                style={{ 
                  color: activeCategoryDetail.accent || 'var(--color-primary)', 
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: activeCategoryDetail.accent || 'var(--color-primary)' 
                  }} 
                />
                <span>{activeCategoryDetail.title}</span>
              </button>
            )}

            {/* "More ▾" Dropdown Menu with Hover & Click Support */}
            <div 
              className={`nav-more-dropdown ${moreOpen ? 'is-open' : ''}`}
              ref={moreRef}
            >
              <button
                type="button"
                onClick={() => setMoreOpen(prev => !prev)}
                className={`nav-link-item ${moreOpen || activeTab === 'packages' || activeTab === 'exam' ? 'active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                aria-expanded={moreOpen}
              >
                <span>More</span>
                <ChevronDown size={14} className="more-caret" />
              </button>

              <div className="more-menu-panel">
                <button
                  type="button"
                  onClick={() => { setMoreOpen(false); onOpenPackages(); }}
                  className="more-menu-item"
                >
                  <div className="more-item-icon" style={{ backgroundColor: '#FFF4E5', color: '#D97706' }}>
                    <Layers size={15} />
                  </div>
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>Crochet Packages</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Starter, Artisan & Master passes</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setMoreOpen(false); onOpenExam(); }}
                  className="more-menu-item"
                >
                  <div className="more-item-icon" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
                    <Award size={15} />
                  </div>
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>MCQ Certification</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Take 80% passing assessment</div>
                  </div>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.25rem 0' }} />

                <button
                  type="button"
                  onClick={() => { setMoreOpen(false); onOpenAdmin(); }}
                  className="more-menu-item"
                >
                  <div className="more-item-icon" style={{ backgroundColor: '#FDEAE4', color: 'var(--color-primary)' }}>
                    <FolderPlus size={15} />
                  </div>
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-primary)' }}>Admin Studio CRM</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Catalogue, slider & store settings</div>
                  </div>
                </button>
              </div>
            </div>
          </nav>

          {/* Right Action Controls: WhatsApp, Cart, and Mobile Hamburger */}
          <div className="nav-actions-right">
            
            {/* WhatsApp Direct Chat Button */}
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '918882967692'}?text=Hello%20Anjali%20Crochet%20Knit!%20I%20have%20an%20order%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa-btn"
              title="Chat directly with Anjali on WhatsApp"
            >
              <MessageCircle size={15} />
              <span className="nav-btn-text">WhatsApp</span>
            </a>

            {/* CART DRAWER BUTTON WITH BADGE */}
            <button
              onClick={onOpenCart}
              className="btn btn-secondary"
              style={{ 
                position: 'relative', 
                padding: '0.52rem 0.9rem', 
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                borderColor: cartItemsCount > 0 ? 'var(--color-primary)' : 'var(--border-subtle)',
                backgroundColor: cartItemsCount > 0 ? '#FAF7F2' : '#FFFFFF'
              }}
              title="View Shopping Basket"
            >
              <ShoppingBag size={16} color={cartItemsCount > 0 ? 'var(--color-primary)' : 'var(--text-main)'} />
              <span style={{ fontWeight: 700, color: cartItemsCount > 0 ? 'var(--color-primary)' : 'var(--text-main)' }} className="nav-btn-text">
                Cart
              </span>
              {cartItemsCount > 0 && (
                <span 
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: '#FFFFFF', 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    borderRadius: '999px', 
                    padding: '1px 6px',
                    lineHeight: 1.4
                  }}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* MOBILE NAVIGATION DRAWER (Slide-down for tablets & phones) */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => handleNavigate(handleGoHome)}
                className={`mobile-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
              >
                Categories & Classes
              </button>

              <button
                onClick={() => handleNavigate(() => setActiveTab('shop'))}
                className={`mobile-nav-item ${activeTab === 'shop' ? 'active' : ''}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={16} color="var(--color-primary)" />
                  <span>Handcrafted Shop</span>
                </div>
                <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  From ₹40
                </span>
              </button>

              <button
                onClick={() => handleNavigate(onOpenCustomOrder)}
                className="mobile-nav-item"
                style={{ color: '#9E7333', fontWeight: 700 }}
              >
                <Sparkles size={16} color="var(--color-honey)" />
                <span>Custom Commission Order</span>
              </button>

              <button
                onClick={() => handleNavigate(onOpenPackages)}
                className="mobile-nav-item"
              >
                <span>Crochet Packages & Classes</span>
              </button>

              <button
                onClick={() => handleNavigate(onOpenExam)}
                className="mobile-nav-item"
              >
                <Award size={16} color="var(--color-honey)" />
                <span>Take 80% MCQ Assessment</span>
              </button>

              <button
                onClick={() => handleNavigate(onOpenAdmin)}
                className="mobile-nav-item"
                style={{ color: 'var(--color-primary)', fontWeight: 700 }}
              >
                <FolderPlus size={16} color="var(--color-primary)" />
                <span>Admin Studio CRM</span>
              </button>

              {/* Direct WhatsApp Callout in Mobile Menu */}
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '918882967692'}?text=Hello%20Anjali%20Crochet%20Knit!%20I%20have%20an%20order%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-item"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderRadius: '12px',
                  marginTop: '0.5rem'
                }}
              >
                <MessageCircle size={18} />
                <span>Chat with Anjali on WhatsApp</span>
              </a>

              {/* Contact Information in Mobile Menu */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.75rem', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={13} color="var(--color-primary)" />
                  <span>{settings?.contactPhone || "+91 8882967692"}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={13} color="var(--color-primary)" />
                  <span>Gaur City 2, Greater Noida West</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
