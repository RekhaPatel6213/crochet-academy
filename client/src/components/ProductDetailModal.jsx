import React, { useState } from 'react';
import { 
  X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, 
  Sparkles, Check, Heart, Palette, Layers, Info, MessageCircle
} from 'lucide-react';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onOpenCustomOrder,
  settings
}) {
  const currency = settings?.currencySymbol || '₹';
  const whatsappNum = settings?.whatsappNumber || '918882967692';
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const imagesList = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.coverImage || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"];

  const currentImage = imagesList[selectedImageIdx] || imagesList[0];
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ zIndex: 1200, padding: '1rem', overflowY: 'auto' }}
    >
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '920px', 
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#FAF7F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-terracotta" style={{ fontSize: '0.72rem' }}>
              Handcrafted Product
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {product.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
            aria-label="Close product modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', alignItems: 'start' }}>
          
          {/* Left Column: Visual Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '360px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FAF7F2'
              }}
            >
              <img 
                src={currentImage} 
                alt={product.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />

              {product.badge && (
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    left: '12px', 
                    backgroundColor: 'var(--color-primary)', 
                    color: '#FFFFFF', 
                    fontSize: '0.72rem', 
                    fontWeight: 800, 
                    padding: '3px 10px', 
                    borderRadius: '999px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {product.badge}
                </span>
              )}

              {hasDiscount && (
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    right: '12px', 
                    backgroundColor: 'var(--color-sage)', 
                    color: '#FFFFFF', 
                    fontSize: '0.72rem', 
                    fontWeight: 800, 
                    padding: '3px 10px', 
                    borderRadius: '999px' 
                  }}
                >
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnails Row */}
            {imagesList.length > 1 && (
              <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIdx(i)}
                    style={{
                      padding: 0,
                      border: selectedImageIdx === i ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      width: '70px',
                      height: '56px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: selectedImageIdx === i ? 1 : 0.6,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '10px' }}>
                <ShieldCheck size={16} color="var(--color-sage)" />
                <span>100% Handcrafted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '10px' }}>
                <Truck size={16} color="var(--color-primary)" />
                <span>Free Ship &gt; $50</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Purchase Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', color: 'var(--color-honey)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--color-honey)" color="var(--color-honey)" />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {product.rating || 5.0}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({product.reviewsCount || 1} verified artisan reviews)
                </span>
              </div>

              <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.25, color: 'var(--text-main)' }}>
                {product.title}
              </h2>

              {/* Price & Stock */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
                  {currency}{Number(product.price).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span style={{ fontSize: '1.15rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                    {currency}{Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
                <span 
                  style={{ 
                    fontSize: '0.78rem', 
                    fontWeight: 700, 
                    color: isOutOfStock ? '#E05A47' : 'var(--color-sage)',
                    backgroundColor: isOutOfStock ? '#FEECEB' : 'var(--color-sage-light)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    marginLeft: 'auto'
                  }}
                >
                  {isOutOfStock ? "Sold Out" : `In Stock (${product.stock} available)`}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {product.description}
              </p>
            </div>

            {/* Specifications Box */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Info size={14} color="var(--color-primary)" /> Artisan Specifications:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{key}: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FAF7F2' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    style={{ border: 'none', background: 'none', padding: '0.5rem 0.85rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0.5rem 0.85rem', fontWeight: 800, fontSize: '0.9rem', minWidth: '32px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    disabled={isOutOfStock || quantity >= (product.stock || 10)}
                    style={{ border: 'none', background: 'none', padding: '0.5rem 0.85rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem', fontSize: '0.95rem', borderRadius: '12px' }}
                >
                  {addedAnimation ? (
                    <>
                      <Check size={18} />
                      <span>Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>{isOutOfStock ? "Out of Stock" : `Add to Cart • ${currency}${(product.price * quantity).toFixed(0)}`}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Order Directly on WhatsApp CTA */}
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello Anjali! I want to order the "${product.title}" (Quantity: ${quantity}, Total: ${currency}${product.price * quantity}) from your online store. Please share delivery details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <MessageCircle size={18} />
                <span>Instant Order on WhatsApp</span>
              </a>

              {/* Custom Order Callout for this product */}
              <div 
                style={{ 
                  backgroundColor: 'var(--color-honey-light)', 
                  borderRadius: '12px', 
                  padding: '0.85rem 1rem', 
                  border: '1px solid rgba(217, 155, 67, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#9E7333' }}>
                    Want custom colors or sizing?
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Have our master artisans customize this design to your exact specs.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCustomOrder) {
                      onOpenCustomOrder({
                        itemType: product.category || "Custom Amigurumi",
                        title: `Custom ${product.title}`,
                        referenceImage: currentImage
                      });
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', borderColor: 'var(--color-honey)', color: '#9E7333', fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  <Sparkles size={13} color="var(--color-honey)" />
                  <span>Customize This</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
