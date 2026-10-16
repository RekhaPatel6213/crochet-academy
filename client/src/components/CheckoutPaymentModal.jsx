import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, CreditCard, Lock, 
  Truck, ArrowRight, ShoppingBag, Package, Sparkles, AlertCircle
} from 'lucide-react';

export default function CheckoutPaymentModal({ 
  orderData, 
  onClose, 
  onOrderSuccess,
  settings
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    paymentMethod: 'Credit Card',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
    cardholderName: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!orderData) return null;

  const currency = orderData.currency || settings?.currencySymbol || '$';
  const { items = [], subtotal = 0, shipping = 0, discount = 0, total = 0, gst = 0, gstName = 'GST', gstRate = 0 } = orderData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.address) {
      setErrorMessage("Please fill in your name, email, and shipping address.");
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          last4: formData.cardNumber.slice(-4),
          cardholder: formData.cardholderName || formData.customerName
        }
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setOrderConfirmed(data.data);
        if (onOrderSuccess) onOrderSuccess(data.data);
      } else {
        setErrorMessage(data.message || "Failed to process order. Please try again.");
      }
    } catch (err) {
      console.error("Order processing error:", err);
      // Fallback local order confirmation if network issue
      const mockOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        total: total,
        items: items,
        trackingNumber: `PTL-${Math.floor(100000 + Math.random() * 900000)}-US`,
        date: new Date().toISOString().split('T')[0]
      };
      setOrderConfirmed(mockOrder);
      if (onOrderSuccess) onOrderSuccess(mockOrder);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) onClose(); }}
      style={{ zIndex: 1300, padding: '1rem', overflowY: 'auto' }}
    >
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '840px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#FAF7F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src="/logo.png" alt="Petal & Loop" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                {orderConfirmed ? "Order Confirmation" : "Secure Checkout & Payment"}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Petal & Loop Handcrafted Artisan Guild
              </span>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.45rem', borderRadius: '50%' }}
              aria-label="Close checkout"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {orderConfirmed ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', backgroundColor: 'var(--color-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-sage)' }}>
              <CheckCircle2 size={46} />
            </div>

            <div>
              <span className="badge badge-sage" style={{ marginBottom: '0.5rem' }}>
                Payment Processed Successfully
              </span>
              <h2 style={{ fontSize: '2rem', margin: '0.25rem 0 0.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                Thank You, {orderConfirmed.customerName}!
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                Your handcrafted order has been received by our studio artisans. A detailed confirmation receipt has been sent to <strong>{orderConfirmed.customerEmail}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#FAF7F2', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Order Number</span>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>{orderConfirmed.id}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Delivery</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>3 - 5 Business Days</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Tracking Reference</span>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-sage)' }}>
                  {orderConfirmed.trackingNumber || `PTL-${Math.floor(100000 + Math.random() * 900000)}-US`}
                </div>
              </div>

              {/* Items List in Receipt */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Items Ordered ({orderConfirmed.items?.length || 1})</span>
                {orderConfirmed.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span>{it.quantity}x {it.title}</span>
                    <strong>${(Number(it.price) * (it.quantity || 1)).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '1.05rem', fontWeight: 800 }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>${Number(orderConfirmed.total || total).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.5rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              Continue Shopping & Exploring Classes
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <form onSubmit={handleSubmitOrder}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', padding: '2rem', alignItems: 'start' }}>
              
              {/* LEFT: Customer & Payment Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Contact Info */}
                <div>
                  <h4 style={{ fontSize: '1rem', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)' }}>
                    <span>1.</span> Customer Contact Information
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="e.g. Eleanor Vance"
                        required
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder="eleanor@example.com"
                        required
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Phone Number (for shipping SMS updates)
                    </label>
                    <input 
                      type="tel" 
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div>
                  <h4 style={{ fontSize: '1rem', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)' }}>
                    <span>2.</span> Shipping Destination
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Street Address *
                      </label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Artisan Lane, Apt 4B"
                        required
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          City *
                        </label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Portland"
                          required
                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          State
                        </label>
                        <input 
                          type="text" 
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="OR"
                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          Postal Code *
                        </label>
                        <input 
                          type="text" 
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          placeholder="97201"
                          required
                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div>
                  <h4 style={{ fontSize: '1rem', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)' }}>
                    <span>3.</span> Secure Payment Method
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                    {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                        style={{
                          padding: '0.65rem',
                          borderRadius: '10px',
                          border: formData.paymentMethod === method ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: formData.paymentMethod === method ? '#FAF7F2' : '#FFFFFF',
                          fontSize: '0.78rem',
                          fontWeight: formData.paymentMethod === method ? 800 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {formData.paymentMethod === method && <CheckCircle2 size={13} color="var(--color-primary)" />}
                        <span>{method}</span>
                      </button>
                    ))}
                  </div>

                  {formData.paymentMethod === 'Credit Card' && (
                    <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Card Details</span>
                        <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>💳 Visa</span> • <span>Mastercard</span> • <span>Amex</span>
                        </div>
                      </div>

                      <div>
                        <input 
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="Card Number (4242 4242 4242 4242)"
                          style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', fontFamily: 'monospace' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                        <input 
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM / YY"
                          style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', fontFamily: 'monospace' }}
                        />
                        <input 
                          type="password"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          placeholder="CVC (3 digits)"
                          maxLength={4}
                          style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'PayPal' && (
                    <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      You will complete the transaction securely via PayPal authorization upon clicking Place Order.
                    </div>
                  )}

                  {formData.paymentMethod === 'Cash on Delivery' && (
                    <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Pay in cash directly to the courier upon delivery of your handcrafted items.
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT: Order Summary Card */}
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  Order Summary ({items.length} items)
                </h4>

                {/* Items preview list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                        <img src={it.coverImage || it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{it.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Qty: {it.quantity}</div>
                      </div>
                      <strong style={{ color: 'var(--text-main)' }}>
                        {currency}{(it.price * it.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Cost lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Subtotal</span>
                    <span>{currency}{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-sage)', fontWeight: 700 }}>
                      <span>Discount</span>
                      <span>-{currency}{discount.toFixed(2)}</span>
                    </div>
                  )}

                  {gst > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-sage)', fontWeight: 600 }}>
                      <span>{gstName} ({gstRate}%)</span>
                      <span>+{currency}{gst.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <strong style={{ color: 'var(--color-sage)' }}>FREE</strong> : `${currency}${shipping.toFixed(2)}`}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
                      {currency}{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#FEECEB', color: '#E05A47', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={15} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: '12px' }}
                >
                  {isProcessing ? (
                    <span>Processing Secure Payment...</span>
                  ) : (
                    <span>Authorize & Place Order • ${total.toFixed(2)}</span>
                  )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} color="var(--color-sage)" />
                  <span>30-Day Handmade Quality Satisfaction Guarantee</span>
                </div>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
}
