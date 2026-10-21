import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, 
  Sparkles, Star, ArrowRight, Package, Heart, Award
} from 'lucide-react';

export default function HomeImageSlider({
  slides = [],
  products = [],
  onSelectProduct,
  onNavigateShop,
  onOpenCustomOrder,
  onOpenPackages,
  settings
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const autoplayTimerRef = useRef(null);

  // Filter only active slides (if empty, provide default slides)
  const activeSlides = (slides && slides.length > 0) 
    ? slides.filter(s => s.active !== false)
    : [
        {
          id: 'slide-default-1',
          title: 'Eternal Blooming Crochet Bouquets',
          subtitle: 'Handmade with Love ♡ • Gaur City 2, Greater Noida West',
          description: 'Never-wilting handmade red roses, calla lilies, and eucalyptus foliage hand-crocheted with 100% hypoallergenic milk cotton. Wrapped in artisanal Korean paper with satin ribbon.',
          image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1600&q=80',
          badge: '🌸 Bestseller Bouquet',
          badgeColor: '#C86D51',
          btnText: 'View Forever Rose Bouquet (₹699)',
          btnActionType: 'product',
          btnActionTarget: 'prod-crochet-rose-bouquet',
          btnSecondaryText: 'Order on WhatsApp',
          btnSecondaryAction: 'whatsapp'
        },
        {
          id: 'slide-default-2',
          title: 'Sunny Sunflower Crochet Keychains',
          subtitle: 'Starting at Just ₹40 • Pan-India Doorstep Delivery',
          description: 'Brighten every day with delightful mini sunflower bag clips and backpack charms crafted with durable cotton yarn and golden swivel clips. Perfect return gifts for celebrations.',
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80',
          badge: '⭐ Budget Favorite',
          badgeColor: '#D99B43',
          btnText: 'View Sunflower Keychain (₹40)',
          btnActionType: 'product',
          btnActionTarget: 'prod-sunflower-keychain',
          btnSecondaryText: 'Shop All Keychains',
          btnSecondaryAction: 'shop'
        },
        {
          id: 'slide-default-3',
          title: 'Cuddly Amigurumi Teddy Bears & Plushies',
          subtitle: '100% Baby-Safe & Ultra-Soft Chenille Yarn',
          description: 'Irresistibly soft handmade teddy bears with anchored safety eyes and hand-knitted bows. Custom color themes, birth announcement ribbons, and personalized tags available.',
          image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1600&q=80',
          badge: '🧸 Cuddle Favorite',
          badgeColor: '#6B8E7B',
          btnText: 'View Chubby Teddy Bear (₹249)',
          btnActionType: 'product',
          btnActionTarget: 'prod-chubby-amigurumi-bear',
          btnSecondaryText: 'Custom Plush Commission',
          btnSecondaryAction: 'custom'
        },
        {
          id: 'slide-default-4',
          title: 'Pastel Daisy Granny Square Handbag',
          subtitle: 'Boho Chic Fashion • Hand-Crocheted by Artisans',
          description: 'Trending shoulder tote bag made from 13 daisy motif granny squares. Lined with durable cotton canvas and sturdy handles for everyday styling.',
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80',
          badge: '✨ Trending Wearable',
          badgeColor: '#C86D51',
          btnText: 'View Daisy Tote Bag (₹799)',
          btnActionType: 'product',
          btnActionTarget: 'prod-daisy-tote-bag',
          btnSecondaryText: 'Explore Handcrafted Shop',
          btnSecondaryAction: 'shop'
        }
      ];

  const totalSlides = activeSlides.length;

  // Autoplay Effect (changes every 5.5s unless paused)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, 5500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [totalSlides, isPaused, currentIndex]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Action Button Click Handler (Links to product or target view)
  const handleActionClick = (slide) => {
    const actionType = slide.btnActionType || 'product';
    const target = slide.btnActionTarget;

    if (actionType === 'product' && target) {
      // Find matching product in products array
      const product = products.find(p => p.id === target || p.title?.toLowerCase() === target.toLowerCase());
      if (product && onSelectProduct) {
        onSelectProduct(product);
        return;
      }
    }

    if (actionType === 'shop' || actionType === 'category') {
      if (onNavigateShop) onNavigateShop(target);
      return;
    }

    if (actionType === 'custom') {
      if (onOpenCustomOrder) onOpenCustomOrder({ itemType: slide.title });
      return;
    }

    if (actionType === 'packages') {
      if (onOpenPackages) onOpenPackages();
      return;
    }

    if (actionType === 'whatsapp') {
      const waNum = settings?.whatsappNumber || '919099962395';
      const text = encodeURIComponent(`Hello Anjali! I saw "${slide.title}" on your website slider and want to order.`);
      window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
      return;
    }

    // Default fallback: If target matches a product, open it, otherwise go to shop
    const fallbackProd = products.find(p => p.id === target);
    if (fallbackProd && onSelectProduct) {
      onSelectProduct(fallbackProd);
    } else if (onNavigateShop) {
      onNavigateShop();
    }
  };

  // Secondary Button Click Handler
  const handleSecondaryActionClick = (slide) => {
    const action = slide.btnSecondaryAction || 'whatsapp';

    if (action === 'whatsapp') {
      const waNum = settings?.whatsappNumber || '919099962395';
      const text = encodeURIComponent(`Hello Anjali! I have an inquiry about "${slide.title}".`);
      window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
      return;
    }

    if (action === 'custom') {
      if (onOpenCustomOrder) onOpenCustomOrder({ itemType: slide.title });
      return;
    }

    if (action === 'shop' && onNavigateShop) {
      onNavigateShop();
      return;
    }

    if (action === 'packages' && onOpenPackages) {
      onOpenPackages();
      return;
    }
  };

  if (totalSlides === 0) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <section 
      className="home-image-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Handmade Creations Carousel"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        backgroundColor: '#1E1612',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      {/* Background Slides with crossfade */}
      <div style={{ position: 'relative', minHeight: 'clamp(440px, 60vh, 560px)', display: 'flex', alignItems: 'center' }}>
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id || idx}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(1.05)',
                transition: 'opacity 0.75s ease-in-out, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 2 : 1
              }}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1600&q=80";
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(0.92)'
                }}
              />

              {/* Dynamic Artisanal Gradient Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(24, 17, 14, 0.94) 0%, rgba(24, 17, 14, 0.82) 48%, rgba(24, 17, 14, 0.35) 100%)',
                  backdropFilter: 'blur(1.5px)'
                }}
              />
            </div>
          );
        })}

        {/* Foreground Content Container */}
        <div 
          className="container"
          style={{ 
            position: 'relative', 
            zIndex: 10,
            paddingTop: '2.5rem',
            paddingBottom: '3.5rem'
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            
            {/* Top Pill Badge */}
            {currentSlide.badge && (
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span 
                  style={{
                    backgroundColor: currentSlide.badgeColor || 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '0.35rem 0.9rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    letterSpacing: '0.02em',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
                  }}
                >
                  <Sparkles size={13} />
                  <span>{currentSlide.badge}</span>
                </span>
                <span 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#F4ECE4',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {currentSlide.subtitle || "Handmade with Love ♡"}
                </span>
              </div>
            )}

            {/* Slide Headline */}
            <h1 
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '1rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.35)',
                letterSpacing: '-0.02em'
              }}
            >
              {currentSlide.title}
            </h1>

            {/* Slide Description */}
            <p 
              style={{
                fontSize: 'clamp(0.95rem, 1.6vw, 1.12rem)',
                color: '#E8DED6',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '620px',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)'
              }}
            >
              {currentSlide.description}
            </p>

            {/* Slide CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              
              {/* Primary Product Link Button */}
              <button
                onClick={() => handleActionClick(currentSlide)}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 1.65rem',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  backgroundColor: currentSlide.badgeColor || 'var(--color-primary)',
                  boxShadow: '0 6px 20px rgba(200, 109, 81, 0.45)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ShoppingBag size={18} />
                <span>{currentSlide.btnText || "View Product"}</span>
                <ArrowRight size={16} />
              </button>

              {/* Secondary Action: Direct WhatsApp Chat */}
              <button
                onClick={() => handleSecondaryActionClick(currentSlide)}
                className="btn"
                style={{
                  padding: '0.85rem 1.45rem',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 255, 255, 0.28)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
              >
                <MessageCircle size={18} color="#25D366" />
                <span>{currentSlide.btnSecondaryText || "Chat on WhatsApp"}</span>
              </button>

            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(30, 22, 18, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'background-color 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = 'var(--color-primary)'; 
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(30, 22, 18, 0.65)'; 
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; 
              }}
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(30, 22, 18, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'background-color 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = 'var(--color-primary)'; 
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(30, 22, 18, 0.65)'; 
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; 
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Carousel Bottom Dot Indicators */}
        {totalSlides > 1 && (
          <div 
            style={{
              position: 'absolute',
              bottom: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(20, 14, 12, 0.55)',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            {activeSlides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  style={{
                    width: isActive ? '28px' : '9px',
                    height: '9px',
                    borderRadius: '999px',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  title={slide.title}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
