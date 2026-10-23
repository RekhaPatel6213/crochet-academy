import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, 
  Phone, MapPin, Sparkles, ArrowLeft, Clock, ShoppingBag, 
  Truck, CheckCircle2, ShieldCheck, Heart, Award, RefreshCw
} from 'lucide-react';

export default function FAQPage({ 
  onBack, 
  settings, 
  onNavigate, 
  onOpenCustomOrder,
  faqs = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState({ 0: true, 1: true });

  const contactPhone = settings?.contactPhone || '+91 9099962395';
  const whatsappNum = settings?.whatsappNumber || '919099962395';
  const companyName = settings?.companyName || 'Tishaya Petal & Loop';
  const address = settings?.address || '2039, 12th Avenue, Gaur City 2, Greater Noida West, Uttar Pradesh 201009';
  const supportHours = settings?.supportHours || 'Open Every Day: 10:00 AM – 9:00 PM IST';

  const categoryMeta = {
    'Orders': { label: 'Ordering & Products', icon: '🌸' },
    'Custom': { label: 'Custom Commissions', icon: '🎨' },
    'Classes': { label: 'Classes & Mentorship', icon: '🧶' },
    'Shipping': { label: 'Shipping & Delivery', icon: '🚚' },
    'Studio': { label: 'Studio & Storefront', icon: '📍' },
    'Care': { label: 'Care & Materials', icon: '🧼' },
    'Payments': { label: 'Payments & Pricing', icon: '💳' }
  };

  const fallbackFaqs = [
    {
      id: 'faq-1',
      category: 'Orders',
      q: `How can I place an order with ${companyName}?`,
      a: `You can easily place an order right here through our website by browsing our Handcrafted Shop and adding items to your cart with instant order placement, or directly message us on WhatsApp (${contactPhone}) with screenshots or names of your selected creations.`
    },
    {
      id: 'faq-2',
      category: 'Custom',
      q: 'Can I customize the color, flower arrangement, or size of a bouquet?',
      a: "Yes, absolutely! We specialize in bespoke commissions. You can click on 'Custom Order' in our navigation bar or message us on WhatsApp with your favorite color palette, desired flower species (roses, sunflowers, tulips, daisies, lilies), ribbon text, or reference photos. We will craft it to your exact preferences."
    },
    {
      id: 'faq-3',
      category: 'Shipping',
      q: 'How long does delivery take across India, and how are fragile bouquets packed?',
      a: 'Orders are dispatched within 24–48 hours from our Greater Noida West studio. Standard tracked shipping reaches Delhi NCR in 1–2 days, major metro cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune) in 2–4 business days, and other regions in 4–6 business days. Each delicate bouquet and amigurumi plush is safely nestled in crush-resistant aesthetic gift boxing with bubble wrap protection.'
    },
    {
      id: 'faq-4',
      category: 'Classes',
      q: 'Do you offer crochet classes in Greater Noida West and online?',
      a: 'Yes! We run comprehensive online interactive video masterclasses with verified certification, as well as hands-on weekend studio sessions at Gaur City 2, Greater Noida West. Our courses cater to all experience levels — from absolute beginner stitch basics (slip knots, single crochet, magic ring) to complex 3D amigurumi plushies, wearables, and multi-colored granny square blankets.'
    },
    {
      id: 'faq-5',
      category: 'Studio',
      q: 'Where is your physical studio located and what are your visiting hours?',
      a: `Our creative studio and workshop is located at ${address}. We are open for student classes, gift pick-ups, and studio visits every day from 10:00 AM to 9:00 PM IST. If visiting in person, drop us a quick WhatsApp ping before coming so we can prepare your items!`
    },
    {
      id: 'faq-6',
      category: 'Orders',
      q: 'What kind of yarn and materials do you use for your flowers and plushies?',
      a: 'We use exclusively premium 100% baby-safe, hypoallergenic combed milk cotton, acrylic, and chenille velvet yarns. They are lint-free, soft to the touch, washable, colorfast, and long-lasting — meaning your crochet bouquets will never wilt, fade, or trigger allergies like fresh flowers.'
    },
    {
      id: 'faq-7',
      category: 'Orders',
      q: 'Do you accept bulk, corporate, or return-gift orders for weddings and events?',
      a: 'Yes! We frequently craft bulk handcrafted favours, wedding return gifts, graduation sunflower keychains, bridesmaids bouquets, and corporate festive hampers (Diwali, New Year, Women’s Day). Bulk pricing discounts are available for quantities of 15+ pieces. Please reach out via WhatsApp at least 7–10 days in advance for large quantities.'
    },
    {
      id: 'faq-8',
      category: 'Custom',
      q: 'Can you recreate a bouquet or toy from an Instagram or Pinterest picture?',
      a: "Yes! Simply share the image with us via WhatsApp. Founder & lead artisan Tishaya will analyze the stitch pattern, calculate the yarn requirements, confirm timeline & pricing, and keep you updated with progress photos while crocheting your custom creation."
    },
    {
      id: 'faq-9',
      category: 'Classes',
      q: 'How does the Artisan Certification Exam work?',
      a: 'Our Certification Assessment is a 10-question multiple choice (MCQ) exam covering stitch anatomy, tension control, abbreviations (US vs UK terminology), magic rings, and project finishing. Scoring 80% or higher awards you an official verified PDF certificate with your credential ID that can be downloaded and displayed.'
    },
    {
      id: 'faq-10',
      category: 'Shipping',
      q: 'What are the shipping charges? Is Free Delivery available?',
      a: 'We offer FREE Pan-India doorstep delivery on all orders above ₹499! For orders below ₹499, a nominal flat courier fee of ₹60 is applied at checkout.'
    },
    {
      id: 'faq-11',
      category: 'Orders',
      q: 'How do I care for and clean my handcrafted crochet items?',
      a: 'Crochet flower bouquets simply need occasional gentle dusting with a soft brush or cool hairdryer on low setting. For keychains and plushies, hand wash in lukewarm water using mild baby detergent, gently squeeze (do not wring), and dry flat in shade. Avoid hot water, bleach, or tumble drying.'
    },
    {
      id: 'faq-12',
      category: 'Studio',
      q: 'What payment modes are accepted?',
      a: 'We accept UPI (Google Pay, PhonePe, Paytm), BHIM, Net Banking, credit/debit cards, and Cash on Delivery / Pay on Pickup at our Greater Noida West studio.'
    }
  ];

  // Dynamic active FAQs from props or fallback
  const allFaqs = useMemo(() => {
    const list = Array.isArray(faqs) && faqs.length > 0 ? faqs : fallbackFaqs;
    return list
      .filter(f => f.active !== false)
      .map((f, idx) => ({
        id: f.id || `faq-${idx}`,
        category: f.category || 'Orders',
        q: f.question || f.q || 'Question',
        a: f.answer || f.a || 'Answer'
      }));
  }, [faqs, companyName, contactPhone, address]);

  // Derive dynamic category pills from active FAQs
  const faqCategories = useMemo(() => {
    const cats = new Set();
    allFaqs.forEach(f => {
      if (f.category) cats.add(f.category);
    });

    const list = [{ id: 'All', label: 'All Questions', icon: '✨' }];
    cats.forEach(c => {
      const meta = categoryMeta[c] || { label: c, icon: '🧶' };
      list.push({
        id: c,
        label: meta.label,
        icon: meta.icon
      });
    });
    return list;
  }, [allFaqs]);

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq => {
      const matchCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery, allFaqs]);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    filteredFaqs.forEach(f => { allOpen[f.id] = true; });
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  return (
    <div className="faq-page-wrapper" style={{ backgroundColor: 'var(--bg-canvas, #FDFBF7)', minHeight: '85vh', paddingBottom: '5rem' }}>
      
      {/* Top Breadcrumb & Hero Header */}
      <section style={{ 
        background: 'linear-gradient(180deg, rgba(239, 230, 222, 0.6) 0%, rgba(253, 251, 247, 1) 100%)', 
        padding: '3rem 1.5rem 2.5rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ maxWidth: '980px', margin: '0 auto' }}>
          
          {/* Breadcrumb / Back button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <button
              onClick={onBack}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.85rem',
                padding: '0.45rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '999px',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} />
              <span>Back to Home</span>
            </button>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Home &gt; <strong style={{ color: 'var(--text-main)' }}>Frequently Asked Questions</strong>
            </span>
          </div>

          {/* Page Title & Subtitle */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <span className="badge badge-terracotta" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <HelpCircle size={14} />
              Help & Knowledge Hub
            </span>
            <h1 style={{ 
              fontSize: '2.75rem', 
              fontFamily: 'var(--font-serif)', 
              color: 'var(--text-main)', 
              margin: '0.35rem 0 0.85rem',
              lineHeight: 1.15
            }}>
              Frequently Asked Questions
            </h1>
            <p style={{ 
              fontSize: '1.05rem', 
              color: 'var(--text-muted)', 
              margin: '0 auto 2rem', 
              lineHeight: 1.6 
            }}>
              Find quick answers to common questions about our handcrafted bouquets, custom commissions, beginner crochet classes, studio visits, and Pan-India doorstep delivery.
            </p>

            {/* Live Search Input */}
            <div style={{ 
              position: 'relative', 
              maxWidth: '600px', 
              margin: '0 auto', 
              boxShadow: 'var(--shadow-md, 0 8px 30px rgba(0,0,0,0.06))',
              borderRadius: '999px'
            }}>
              <Search 
                size={18} 
                color="var(--color-primary)" 
                style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. shipping, custom bouquet, classes, studio)..."
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 3rem',
                  fontSize: '0.95rem',
                  border: '2px solid rgba(96, 169, 223, 0.35)',
                  borderRadius: '999px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'inherit',
                  color: 'var(--text-main)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(96, 169, 223, 0.35)'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section className="container" style={{ maxWidth: '980px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
        
        {/* Category Filter Pills & Toggle Controls */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '2rem' 
        }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {faqCategories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'All' 
                ? allFaqs.length 
                : allFaqs.filter(f => f.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1.15rem',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    borderRadius: '999px',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isSelected ? '0 4px 12px rgba(96, 169, 223, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    opacity: 0.85, 
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)', 
                    padding: '2px 6px', 
                    borderRadius: '999px' 
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expand / Collapse All */}
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
            <button
              onClick={handleExpandAll}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Results Counter if searching */}
        {searchQuery.trim() && (
          <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'question' : 'questions'} matching "<em>{searchQuery}</em>":
          </div>
        )}

        {/* FAQ List Accordion */}
        {filteredFaqs.length === 0 ? (
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '24px', 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            border: '1px dashed var(--border-subtle)',
            margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', margin: '0 0 0.5rem' }}>
              No matching questions found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              We couldn't find any questions matching your search. Would you like to chat directly with us on WhatsApp or submit a custom question?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
              >
                Clear Search & Filters
              </button>
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello ${companyName}! I have a question about: ${searchQuery}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ 
                  backgroundColor: '#25D366', 
                  color: '#FFFFFF', 
                  padding: '0.65rem 1.25rem', 
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: 700
                }}
              >
                <MessageCircle size={15} />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredFaqs.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: isOpen ? '1px solid rgba(96, 169, 223, 0.45)' : '1px solid var(--border-subtle)',
                    boxShadow: isOpen ? '0 6px 20px rgba(0,0,0,0.04)' : 'var(--shadow-sm)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      padding: '1.35rem 1.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: isOpen ? 'var(--color-primary)' : 'var(--text-main)',
                      gap: '1rem',
                      lineHeight: 1.35
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ 
                        color: 'var(--color-primary)', 
                        fontSize: '0.9rem', 
                        fontWeight: 800,
                        backgroundColor: 'rgba(96, 169, 223, 0.15)', 
                        padding: '2px 8px', 
                        borderRadius: '6px',
                        marginTop: '2px'
                      }}>
                        Q
                      </span>
                      <span>{item.q}</span>
                    </span>
                    <span style={{ 
                      flexShrink: 0,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? 'rgba(96, 169, 223, 0.15)' : 'var(--bg-canvas, #FDFBF7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isOpen ? (
                        <ChevronUp size={18} color="var(--color-primary)" />
                      ) : (
                        <ChevronDown size={18} color="var(--text-muted)" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ 
                      padding: '0 1.75rem 1.5rem', 
                      fontSize: '0.96rem', 
                      color: 'var(--text-muted)', 
                      lineHeight: 1.7, 
                      borderTop: '1px solid var(--border-subtle)',
                      backgroundColor: '#FFFCFA'
                    }}>
                      <p style={{ margin: '1rem 0 0' }}>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions CTA Banner Card */}
        <div style={{ 
          marginTop: '4rem', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '3rem', 
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md, 0 8px 30px rgba(0,0,0,0.06))',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-honey" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Heart size={14} color="#D97706" />
              Direct Artisan Assistance
            </span>
            <h3 style={{ fontSize: '1.85rem', fontFamily: 'var(--font-serif)', margin: '0 0 0.75rem', color: 'var(--text-main)' }}>
              Still have questions? We're just a message away!
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
              Whether you need help selecting a personalized bouquet, want to track an ongoing shipment, or wish to enroll in weekend crochet classes at Gaur City 2, our team is happy to guide you.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello ${companyName}! I was reading the FAQ and had a question.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  boxShadow: '0 6px 18px rgba(37, 211, 102, 0.35)'
                }}
              >
                <MessageCircle size={17} />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  if (onOpenCustomOrder) onOpenCustomOrder({});
                  else if (onNavigate) onNavigate('/custom-order');
                }}
                className="btn btn-primary"
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Sparkles size={16} />
                <span>Request Custom Order</span>
              </button>
            </div>
          </div>

          {/* Quick Studio & Contact Box */}
          <div style={{ 
            backgroundColor: 'var(--bg-canvas, #FDFBF7)', 
            borderRadius: '20px', 
            padding: '2rem', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
              Studio & Contact Overview
            </h4>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.88rem' }}>
              <Phone size={16} color="var(--color-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>Phone Helpline</strong>
                <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                  {contactPhone}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.88rem' }}>
              <Clock size={16} color="var(--color-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>Support & Visiting Hours</strong>
                <span style={{ color: 'var(--text-muted)' }}>{supportHours}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.88rem' }}>
              <MapPin size={16} color="var(--color-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>Studio Address</strong>
                <span style={{ color: 'var(--text-muted)' }}>{address}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-sage)' }}>
              <CheckCircle2 size={16} />
              <span>Pan-India Doorstep Delivery · Tracked & Safely Boxed</span>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
