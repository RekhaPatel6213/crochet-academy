import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, Sparkles, 
  ShieldCheck, Tag, Check, ChevronRight 
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onProceedCheckout,
  onOpenCustomOrder,
  appliedPromo,
  onApplyPromo,
  settings
}) {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const currency = settings?.currencySymbol || '$';
  const FREE_SHIPPING_THRESHOLD = Number(settings?.freeShippingThreshold) || 50;

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 5.99;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo?.percent) {
    discountAmount = (subtotal * appliedPromo.percent) / 100;
  }

  // GST Calculation from Settings
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstRate = settings?.enableGst ? (Number(settings?.gstRate) || 0) : 0;
  const gstAmount = (taxableAmount * gstRate) / 100;
  const grandTotal = Math.max(0, taxableAmount + shippingCost + gstAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'PETAL10') {
      onApplyPromo({ code: 'PETAL10', percent: 10, label: '10% Artisan Welcome Discount' });
      setPromoError('');
    } else if (code === 'ARTISAN20') {
      onApplyPromo({ code: 'ARTISAN20', percent: 20, label: '20% Guild Member Discount' });
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try PETAL10 for 10% off!');
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ zIndex: 1250, display: 'flex', justifyContent: 'flex-end', padding: 0 }}
    >
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          height: '100vh', 
          backgroundColor: '#FFFFFF', 
          boxShadow: '-10px 0 35px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          animation: 'slideInRight 0.25s ease-out'
        }}
      >
        {/* TOP BAR */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#FAF7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Your Craft Basket
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {cartItems.reduce((cnt, it) => cnt + it.quantity, 0)} handcrafted items
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* FREE SHIPPING PROGRESS METER */}
        <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#FFFDF9', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span>
              {isFreeShipping ? (
                <strong style={{ color: 'var(--color-sage)' }}>🎉 You unlocked FREE Standard Shipping!</strong>
              ) : (
                <span>Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more for <strong>FREE Shipping</strong></span>
              )}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{Math.round(freeShippingProgress)}%</span>
          </div>

          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${freeShippingProgress}%`, 
                backgroundColor: isFreeShipping ? 'var(--color-sage)' : 'var(--color-primary)',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
        </div>

        {/* CART ITEMS SCROLLABLE LIST */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Your basket is empty
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px', margin: 0 }}>
                Explore our plushies, wearable garments, wooden hook tools, and natural yarn skein kits!
              </p>
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
              >
                Explore Handcrafted Shop
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '0.85rem', 
                  backgroundColor: '#FAF7F2', 
                  borderRadius: '14px', 
                  border: '1px solid var(--border-subtle)' 
                }}
              >
                {/* Product Thumbnail */}
                <div style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                  <img 
                    src={item.coverImage || item.image || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80"} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>

                {/* Info & Quantity */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <h5 style={{ fontSize: '0.88rem', margin: '0 0 0.2rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {item.title}
                      </h5>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ${Number(item.price).toFixed(2)} each
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#B35A4B', cursor: 'pointer', padding: '0.2rem' }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem' }}>
                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{ border: 'none', background: 'none', padding: '0.2rem 0.55rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '22px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{ border: 'none', background: 'none', padding: '0.2rem 0.55rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}
                      >
                        +
                      </button>
                    </div>

                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>

                </div>
              </div>
            ))
          )}

          {/* Quick Custom Commission Banner */}
          {cartItems.length > 0 && (
            <div 
              style={{ 
                backgroundColor: 'var(--color-honey-light)', 
                borderRadius: '12px', 
                padding: '0.85rem 1rem', 
                border: '1px solid rgba(217,155,67,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#9E7333' }}>
                  Looking for custom sizing?
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Request custom colors, measurements & embroidery
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCustomOrder) onOpenCustomOrder();
                }}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem', borderColor: 'var(--color-honey)', color: '#9E7333', fontWeight: 700 }}
              >
                <Sparkles size={12} /> Commission
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM CHECKOUT FOOTER */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#FAF7F2', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Promo (try PETAL10)" 
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', textTransform: 'uppercase' }}
              />
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.95rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                Apply
              </button>
            </form>

            {promoError && (
              <div style={{ fontSize: '0.72rem', color: '#E05A47' }}>
                {promoError}
              </div>
            )}

            {appliedPromo && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-sage)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={14} /> Applied: {appliedPromo.label} (-{appliedPromo.percent}%)
              </div>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>{currency}{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-sage)', fontWeight: 700 }}>
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-{currency}{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {settings?.enableGst && gstRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-sage)', fontWeight: 600 }}>
                  <span>{settings?.gstName || 'GST'} ({gstRate}%)</span>
                  <span>+{currency}{gstAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>{isFreeShipping ? <strong style={{ color: 'var(--color-sage)' }}>FREE</strong> : `${currency}${shippingCost.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
                  {currency}{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                onClose();
                onProceedCheckout({
                  items: cartItems,
                  subtotal,
                  shipping: shippingCost,
                  discount: discountAmount,
                  gst: gstAmount,
                  gstRate: gstRate,
                  gstName: settings?.gstName || 'GST',
                  total: grandTotal,
                  appliedPromo,
                  currency
                });
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: '12px' }}
            >
              <span>Proceed to Checkout • {currency}{grandTotal.toFixed(2)}</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} color="var(--color-sage)" />
              <span>Encrypted 256-bit SSL Secure Checkout</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
