import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Star, Sparkles, Filter, Check, 
  ArrowRight, ShieldCheck, Heart, Eye, SlidersHorizontal, Package,
  MessageCircle, Truck, Gift
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Flowers & Bouquets',
  'Keychains & Clips',
  'Plushies & Amigurumi',
  'Bags & Accessories',
  'Baby & Kids',
  'Home Décor',
  'Wool & Yarn',
  'Tools & Kits',
  'Custom & Wholesale'
];

export default function ShopProducts({ 
  products = [], 
  onSelectProduct, 
  onAddToCart, 
  onOpenCustomOrder,
  settings
}) {
  const currency = settings?.currencySymbol || '₹';
  const whatsappNum = settings?.whatsappNumber || '919099962395';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [addedId, setAddedId] = useState(null);

  // Filter & Sort
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = !searchQuery || 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badge?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // featured default
  });

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="shop-products-section" style={{ minHeight: '80vh', paddingBottom: '4rem' }}>
      
      {/* SHOP HERO BANNER */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, rgba(200, 109, 81, 0.1) 0%, rgba(250, 247, 242, 0.95) 50%, #FAF7F2 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '3rem 0 2.5rem'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="badge badge-terracotta" style={{ marginBottom: '0.65rem' }}>
                <Sparkles size={13} /> Handmade with a Little Love
              </span>
              <h1 style={{ fontSize: '2.8rem', margin: '0.2rem 0 0.5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.15 }}>
                Artisan Handcrafted Shop
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                Every plushie, chunky sweater, granny square blanket, and rosewood hook tool is lovingly crafted by our accredited master artisans.
              </p>
            </div>

            {/* Custom Commission Prompt Card */}
            <div 
              onClick={onOpenCustomOrder}
              style={{ 
                backgroundColor: 'var(--bg-card-warm)', 
                border: '2px dashed var(--color-honey)', 
                borderRadius: '18px', 
                padding: '1.5rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '1.5rem', flexShrink: 0 }}>
                ✨
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: '#9E7333' }}>
                  Custom Commissions
                </span>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', marginTop: '0.1rem' }}>
                  Have an Idea in Mind?
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Create a custom order with your colors & sizing →
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        
        {/* Category Pills & Search Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                    border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="search-box-wrapper" style={{ minWidth: '220px' }}>
              <Search size={15} className="search-icon-pos" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="search-input"
                style={{ padding: '0.55rem 0.85rem 0.55rem 2.2rem', fontSize: '0.85rem' }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'var(--text-subtle)' }}
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* RESULTS COUNT & STOCK INFO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Showing <strong>{sortedProducts.length}</strong> handcrafted items</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="var(--color-sage)" /> Free Pan-India shipping on orders over {currency}{settings?.freeShippingThreshold || 499}
          </span>
        </div>

        {/* PRODUCTS GRID */}
        {sortedProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {sortedProducts.map((product) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const isOutOfStock = product.stock <= 0;
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
                  {/* Product Visual Image */}
                  <div>
                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#FAF7F2' }}>
                      <img 
                        src={product.coverImage || (product.images && product.images[0])} 
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
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            padding: '3px 9px', 
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
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            padding: '3px 8px', 
                            borderRadius: '999px' 
                          }}
                        >
                          Sale
                        </span>
                      )}

                      {/* Hover Quick View Chip */}
                      <div 
                        style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          left: '50%', 
                          transform: 'translateX(-50%)', 
                          backgroundColor: 'rgba(26,24,23,0.75)', 
                          color: '#FFFFFF', 
                          fontSize: '0.72rem', 
                          padding: '4px 10px', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.3rem',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <Eye size={12} /> Inspect Specs
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                          {product.category}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-honey)', fontSize: '0.75rem', fontWeight: 700 }}>
                          <Star size={13} fill="var(--color-honey)" /> {product.rating || 5.0} ({product.reviewsCount || 1})
                        </div>
                      </div>

                      <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.4rem', fontFamily: 'var(--font-serif)', lineHeight: 1.3, color: 'var(--text-main)' }}>
                        {product.title}
                      </h4>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                      </p>

                      {/* Price & Stock info */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
                          {currency}{Number(product.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                            {currency}{Number(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: isOutOfStock ? '#E05A47' : 'var(--color-sage)', fontWeight: 700, marginLeft: 'auto' }}>
                          {isOutOfStock ? "Sold Out" : `Stock: ${product.stock}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Buttons: Add to Cart & WhatsApp Order in ONE ROW */}
                  <div style={{ 
                    padding: '0.75rem 1rem', 
                    borderTop: '1px solid var(--border-subtle)', 
                    backgroundColor: '#FAF7F2', 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={isAdded ? "btn btn-sage" : "btn btn-primary"}
                      style={{ 
                        width: '100%', 
                        padding: '0.6rem 0.35rem', 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box'
                      }}
                      title={isOutOfStock ? "Out of Stock" : "Quick Add to Cart"}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> {isOutOfStock ? "Sold Out" : "Add to Cart"}
                        </>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello Tishaya! I want to order the "${product.title}" (${currency}${product.price}) from your crochet store. Please confirm availability.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.35rem',
                        fontSize: '0.8rem',
                        borderRadius: '10px',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxSizing: 'border-box',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                        transition: 'transform 0.15s ease'
                      }}
                      title="Direct Order on WhatsApp"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              No handcrafted products found matching your search.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CUSTOM COMMISSION FOOTER BANNER */}
        <div 
          style={{ 
            marginTop: '4rem', 
            backgroundColor: 'var(--bg-card-warm)', 
            borderRadius: '24px', 
            padding: '2.5rem', 
            border: '2px solid rgba(217, 155, 67, 0.4)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <span className="badge badge-honey" style={{ marginBottom: '0.45rem' }}>
              Artisan Commission Studio
            </span>
            <h3 style={{ fontSize: '1.75rem', margin: '0.2rem 0 0.5rem', fontFamily: 'var(--font-serif)' }}>
              Looking for a 100% Custom Handmade Piece?
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              Whether you want an amigurumi replica of your family pet, a personalized baby blanket with embroidered initials, or a custom-fitted cardigan in your exact dimensions, our master crocheters can bring your vision to life.
            </p>
          </div>

          <button
            onClick={onOpenCustomOrder}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem', borderRadius: '12px' }}
          >
            <Sparkles size={16} />
            <span>Create Custom Order Now →</span>
          </button>
        </div>

      </div>

    </div>
  );
}
