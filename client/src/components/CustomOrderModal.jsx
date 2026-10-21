import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Heart, Palette, Layers, Calendar, 
  Upload, Image as ImageIcon, ShieldCheck, CheckCircle2, ArrowRight, Clock, HelpCircle, ArrowLeft
} from 'lucide-react';

const ITEM_TYPES = [
  { id: 'Amigurumi Plush', label: 'Amigurumi & Pet Plush', basePrice: 45, icon: '🧸', desc: 'Custom animals, pets, anime or cartoon characters' },
  { id: 'Wearable Garment', label: 'Custom Cardigan / Sweater', basePrice: 110, icon: '🧶', desc: 'Made to your exact body measurements' },
  { id: 'Granny Square Blanket', label: 'Heirloom Throw Blanket', basePrice: 95, icon: '🏡', desc: 'Custom dimensions, colors & motif patterns' },
  { id: 'Floral Bouquet', label: 'Eternal Floral Bouquet', basePrice: 40, icon: '💐', desc: 'Forever velvet blooms tailored in your favorite blossoms' },
  { id: 'Bags & Accessories', label: 'Tote, Bag or Beanie', basePrice: 35, icon: '👜', desc: 'Everyday functional handmade accessories' }
];

const YARN_OPTIONS = [
  { id: 'Organic Cotton', name: '100% Organic Cotton', tag: 'Hypoallergenic & crisp stitch definition' },
  { id: 'Merino Wool', name: 'Extra-Fine Merino Wool', tag: 'Ultra-warm, breathable & cloud soft' },
  { id: 'Chenille Velvet', name: 'Chunky Chenille Velvet', tag: 'Plush, huggable velvet texture' },
  { id: 'Bamboo Silk', name: 'Bamboo Silk Blend', tag: 'Silky drape, lightweight & cooling' }
];

const PALETTE_PRESETS = [
  { id: 'Warm Honey & Terracotta', colors: ['#C86D51', '#D99B43', '#FAF7F2'] },
  { id: 'Meadow Sage & Olive', colors: ['#6B8E7B', '#4A7C59', '#FAF7F2'] },
  { id: 'Pastel Blossom', colors: ['#E8A598', '#CBB8D9', '#FFF5F0'] },
  { id: 'Midnight Twilight', colors: ['#2C3E50', '#8B6F8E', '#EAE6E1'] },
  { id: 'Custom Palette', colors: ['#D99B43', '#6B8E7B', '#C86D51'] }
];

export default function CustomOrderModal({ 
  isOpen, 
  onClose, 
  initialData = {}, 
  onCustomOrderSubmitted,
  settings,
  isPage = false
}) {
  const currency = settings?.currencySymbol || '$';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    itemType: initialData.itemType || 'Amigurumi Plush',
    title: initialData.title || '',
    yarnPreference: 'Chenille Velvet',
    colorPalette: 'Warm Honey & Terracotta',
    customMeasurements: '',
    personalizationText: '',
    referenceImage: initialData.referenceImage || '',
    specialNotes: '',
    urgency: 'Standard (10-14 days)',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    zip: '',
    paymentOption: 'deposit' // 'deposit' (50%) or 'full'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedCommission, setConfirmedCommission] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen && !isPage) return null;

  // Calculate live estimate
  const selectedType = ITEM_TYPES.find(t => t.id === formData.itemType) || ITEM_TYPES[0];
  let calculatedQuote = selectedType.basePrice;

  if (formData.yarnPreference === 'Merino Wool') calculatedQuote += 15;
  if (formData.personalizationText.trim()) calculatedQuote += 10;
  if (formData.urgency.includes('Rush')) calculatedQuote += 25;

  const depositAmount = Math.round(calculatedQuote * 0.5);
  const amountToCharge = formData.paymentOption === 'deposit' ? depositAmount : calculatedQuote;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) {
      setErrorMessage("Please enter your name and email.");
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        itemType: formData.itemType,
        title: formData.title || `Custom ${formData.itemType}`,
        yarnPreference: formData.yarnPreference,
        colorPalette: formData.colorPalette,
        customMeasurements: formData.customMeasurements || "Standard artisan sizing",
        personalizationText: formData.personalizationText,
        referenceImage: formData.referenceImage,
        specialNotes: formData.specialNotes,
        urgency: formData.urgency,
        estimatedQuote: calculatedQuote,
        depositPaid: amountToCharge,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        paymentMethod: "Credit Card (Simulated)"
      };

      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedCommission(data.data);
        if (onCustomOrderSubmitted) onCustomOrderSubmitted(data.data);
      } else {
        setErrorMessage(data.message || "Failed to submit custom commission.");
      }
    } catch (err) {
      console.error("Error submitting custom commission:", err);
      // Fallback local mock
      const mock = {
        id: `CUST-${Date.now().toString().slice(-4)}`,
        title: formData.title || `Custom ${formData.itemType}`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        estimatedQuote: calculatedQuote,
        depositPaid: amountToCharge,
        status: "Under Review"
      };
      setConfirmedCommission(mock);
      if (onCustomOrderSubmitted) onCustomOrderSubmitted(mock);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBodyContent = () => (
    <>
      {/* CONFIRMATION SCREEN */}
        {confirmedCommission ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-sage)' }}>
              <CheckCircle2 size={48} />
            </div>

            <div>
              <span className="badge badge-terracotta" style={{ marginBottom: '0.45rem' }}>
                Commission Assigned to Master Artisan
              </span>
              <h2 style={{ fontSize: '2rem', margin: '0.2rem 0 0.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                Commission #{confirmedCommission.id} Received!
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                Thank you, <strong>{confirmedCommission.customerName}</strong>! Our studio director is reviewing your pattern requirements, yarn weights, and custom colorways.
              </p>
            </div>

            {/* Custom Commission Card */}
            <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#FAF7F2', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Commission Project</span>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{formData.title || formData.itemType}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
                  <div>
                    <span style={{ backgroundColor: 'var(--color-honey-light)', color: '#9E7333', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      Under Review
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Yarn Selected:</span>
                  <div style={{ fontWeight: 700 }}>{formData.yarnPreference}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Color Palette:</span>
                  <div style={{ fontWeight: 700 }}>{formData.colorPalette}</div>
                </div>
              </div>

              {formData.personalizationText && (
                <div style={{ fontSize: '0.82rem', backgroundColor: '#FFFFFF', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Custom Embroidery / Tag:</span>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>"{formData.personalizationText}"</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.95rem' }}>
                <span>Estimated Quote: <strong>${calculatedQuote.toFixed(2)}</strong></span>
                <span style={{ color: 'var(--color-sage)', fontWeight: 800 }}>
                  Paid: ${Number(confirmedCommission.depositPaid || amountToCharge).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              Back to Crochet Academy & Shop
            </button>
          </div>
        ) : (
          /* MULTI-STEP CUSTOM COMMISSION BUILDER */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.75rem 2rem', overflowY: 'auto', flex: 1 }}>
              
              {/* Stepper Tabs Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.75rem' }}>
                {[
                  { num: 1, label: '1. Item & Style' },
                  { num: 2, label: '2. Yarn & Colors' },
                  { num: 3, label: '3. Details & Quote' },
                  { num: 4, label: '4. Contact & Deposit' }
                ].map((s) => (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setStep(s.num)}
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '0.85rem',
                      fontWeight: step === s.num ? 800 : 500,
                      color: step === s.num ? 'var(--color-primary)' : 'var(--text-muted)',
                      borderBottom: step === s.num ? '2px solid var(--color-primary)' : 'none',
                      paddingBottom: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* STEP 1: ITEM TYPE */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', margin: '0 0 0.35rem', fontFamily: 'var(--font-serif)' }}>
                      What would you like us to crochet for you?
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Select the category that best matches your custom vision.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {ITEM_TYPES.map((type) => {
                      const isSelected = formData.itemType === type.id;
                      return (
                        <div
                          key={type.id}
                          onClick={() => setFormData(prev => ({ ...prev, itemType: type.id }))}
                          style={{
                            padding: '1.25rem',
                            borderRadius: '16px',
                            border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                            backgroundColor: isSelected ? '#FAF7F2' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <div style={{ fontSize: '2rem' }}>{type.icon}</div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            {type.label}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                            {type.desc}
                          </p>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700, marginTop: 'auto' }}>
                            Starts around ${type.basePrice}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Project Title or Concept Name (Optional)
                    </label>
                    <input 
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. My Tabby Cat Amigurumi with bell collar, or Sunflower Cardigan"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.75rem' }}
                    >
                      <span>Next: Yarn & Colors →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: YARN & COLOR PALETTE */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Yarn material */}
                  <div>
                    <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', fontFamily: 'var(--font-serif)' }}>
                      Select Yarn Material & Texture
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                      {YARN_OPTIONS.map((yarn) => {
                        const isSelected = formData.yarnPreference === yarn.id;
                        return (
                          <div
                            key={yarn.id}
                            onClick={() => setFormData(prev => ({ ...prev, yarnPreference: yarn.id }))}
                            style={{
                              padding: '1rem',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                              backgroundColor: isSelected ? '#FAF7F2' : '#FFFFFF',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.25rem' }}>{yarn.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{yarn.tag}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div>
                    <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', fontFamily: 'var(--font-serif)' }}>
                      Color Palette Preset
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.85rem' }}>
                      {PALETTE_PRESETS.map((pal) => {
                        const isSelected = formData.colorPalette === pal.id;
                        return (
                          <div
                            key={pal.id}
                            onClick={() => setFormData(prev => ({ ...prev, colorPalette: pal.id }))}
                            style={{
                              padding: '0.85rem',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                              backgroundColor: isSelected ? '#FAF7F2' : '#FFFFFF',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                              {pal.colors.map((c, i) => (
                                <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: c, border: '1px solid rgba(0,0,0,0.1)' }} />
                              ))}
                            </div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{pal.id}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                      style={{ padding: '0.75rem 1.5rem' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.75rem' }}
                    >
                      Next: Custom Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DETAILS, MEASUREMENTS & INSPIRATION */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Custom Sizing / Dimensions
                      </label>
                      <input 
                        type="text"
                        name="customMeasurements"
                        value={formData.customMeasurements}
                        onChange={handleChange}
                        placeholder="e.g. 10 inches tall, or Bust: 36 inches, or 50x60 in"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Custom Embroidered Name / Tag (+$10)
                      </label>
                      <input 
                        type="text"
                        name="personalizationText"
                        value={formData.personalizationText}
                        onChange={handleChange}
                        placeholder="e.g. 'Milo', 'Luna', or 'Happy 1st Birthday'"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Inspiration or Reference Photo URL
                    </label>
                    <input 
                      type="url"
                      name="referenceImage"
                      value={formData.referenceImage}
                      onChange={handleChange}
                      placeholder="https://example.com/photo-of-your-pet-or-design.jpg"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                    />
                    {formData.referenceImage && (
                      <div style={{ marginTop: '0.5rem', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                        <img src={formData.referenceImage} alt="Reference preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Special Artisan Instructions & Notes
                    </label>
                    <textarea 
                      name="specialNotes"
                      value={formData.specialNotes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Please note any special details like extra fluffy ears, wooden buttons, or specific color placements."
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', resize: 'vertical' }}
                    />
                  </div>

                  {/* Urgency selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                      Crafting Timeline Urgency
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, urgency: 'Standard (10-14 days)' }))}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          border: formData.urgency.includes('Standard') ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: formData.urgency.includes('Standard') ? '#FAF7F2' : '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Standard Crafting</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 - 14 business days (Included)</div>
                      </div>

                      <div
                        onClick={() => setFormData(prev => ({ ...prev, urgency: 'Rush Priority (5-7 days)' }))}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          border: formData.urgency.includes('Rush') ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: formData.urgency.includes('Rush') ? '#FAF7F2' : '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Rush Priority (+ $25)</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 - 7 business days delivery</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Quote Box */}
                  <div style={{ backgroundColor: 'var(--bg-card-warm)', border: '2px solid rgba(217,155,67,0.4)', borderRadius: '14px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#9E7333', textTransform: 'uppercase' }}>
                        Live Estimated Artisan Quote
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Includes materials, master stitching & assembly
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
                        ${calculatedQuote.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-secondary"
                      style={{ padding: '0.75rem 1.5rem' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.75rem' }}
                    >
                      Next: Contact & Deposit →
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 4: CONTACT & DEPOSIT */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', padding: '1rem', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{formData.title || formData.itemType}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formData.yarnPreference} • {formData.colorPalette}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        ${calculatedQuote.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Your Full Name *
                      </label>
                      <input 
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Chloe Davenport"
                        required
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Email Address (for approval photos) *
                      </label>
                      <input 
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder="chloe@example.com"
                        required
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Phone (for WhatsApp / SMS progress updates)
                    </label>
                    <input 
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Payment option */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                      Payment Option
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, paymentOption: 'deposit' }))}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          border: formData.paymentOption === 'deposit' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: formData.paymentOption === 'deposit' ? '#FAF7F2' : '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Pay 50% Deposit Now</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 800 }}>{currency}{depositAmount.toFixed(2)} due today</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Remainder due upon photo approval</div>
                      </div>

                      <div
                        onClick={() => setFormData(prev => ({ ...prev, paymentOption: 'full' }))}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          border: formData.paymentOption === 'full' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: formData.paymentOption === 'full' ? '#FAF7F2' : '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Pay in Full</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 800 }}>{currency}{calculatedQuote.toFixed(2)} due today</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Direct automated shipping upon completion</div>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#FEECEB', color: '#E05A47', borderRadius: '8px', fontSize: '0.78rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn btn-secondary"
                      style={{ padding: '0.75rem 1.5rem' }}
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
                    >
                      {isSubmitting ? "Submitting Commission..." : `Authorize Deposit (${currency}${amountToCharge.toFixed(2)}) & Start Commission`}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={14} color="var(--color-sage)" />
                    <span>Photo proof sent before final shipment. 100% satisfaction guaranteed.</span>
                  </div>

                </div>
              )}

            </div>
          </form>
        )}
    </>
  );

  // If rendered as a standalone dedicated page (/custom-order)
  if (isPage) {
    return (
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); onClose(); }} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Home</a>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Custom Commission Order</span>
          </div>
        </div>

        {/* Page Card */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(135deg, #FAF7F2 0%, #FFFFFF 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.65rem', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                  {confirmedCommission ? "Custom Commission Confirmed" : "Custom Crochet Commission Studio"}
                </h1>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Handcrafted exactly to your dream specifications with 100% hypoallergenic yarn
                </p>
              </div>
            </div>
          </div>

          <div>
            {renderBodyContent()}
          </div>
        </div>
      </div>
    );
  }

  // Modal mode
  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
      style={{ zIndex: 1350, padding: '1rem', overflowY: 'auto' }}
    >
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '860px', 
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Top Header */}
        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#FAF7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                {confirmedCommission ? "Custom Commission Confirmed" : "Custom Crochet Commission Studio"}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Handcrafted exactly to your dream specifications
              </span>
            </div>
          </div>

          {!isSubmitting && (
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.45rem', borderRadius: '50%' }}
              aria-label="Close custom order modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {renderBodyContent()}
      </div>
    </div>
  );
}
