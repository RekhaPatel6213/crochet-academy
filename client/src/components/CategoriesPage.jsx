import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Shirt, Grid, Home as HomeIcon, ShoppingBag, BookOpen, 
  Search, ArrowRight, ChevronRight 
} from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Shirt,
  Grid,
  Home: HomeIcon,
  ShoppingBag,
  BookOpen
};

export default function CategoriesPage({
  categories = [],
  courses = [],
  onOpenCategoryDetail,
  onBackToHome,
  onNavigate
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('all');

  const parentCategories = useMemo(() => {
    return categories.filter(c => !c.parentId);
  }, [categories]);

  const hasSubcategories = useMemo(() => {
    return categories.some(c => !!c.parentId);
  }, [categories]);

  const filteredCategories = useMemo(() => {
    let result = categories;
    if (selectedParentId !== 'all') {
      result = result.filter(c => c.parentId === selectedParentId || c.id === selectedParentId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [categories, selectedParentId, searchQuery]);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', paddingBottom: '5rem' }}>
      
      {/* Hero Banner for Disciplines Page */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(238, 109, 136, 0.08) 0%, rgba(250, 247, 242, 0.4) 100%)',
        borderBottom: '1px solid rgba(44, 34, 30, 0.06)',
        paddingTop: '2.5rem',
        paddingBottom: '2.5rem'
      }}>
        <div className="container">
          
          {/* Breadcrumb Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem'
          }}>
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/');
                else if (onBackToHome) onBackToHome();
              }}
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <HomeIcon size={14} />
              <span>Home</span>
            </a>
            <ChevronRight size={13} style={{ opacity: 0.6 }} />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              Crochet Disciplines & Curriculums
            </span>
          </div>

          <div style={{ maxWidth: '780px' }}>
            <span 
              className="badge badge-terracotta" 
              style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>🌸</span>
              <span>Handcrafted Curriculums</span>
            </span>
            <h1 style={{
              fontSize: '2.75rem',
              color: 'var(--color-espresso)',
              margin: '0 0 0.85rem',
              lineHeight: 1.15,
              fontWeight: 700
            }}>
              Explore Crochet Disciplines
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0
            }}>
              Choose from our structured curriculums designed by master artisans. Each discipline includes comprehensive step-by-step video tutorials, downloadable stitch charts, photo guides, and accredited progress tracking.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            
            {/* Search Input */}
            <div className="search-box-wrapper" style={{ width: '100%', maxWidth: '380px' }}>
              <Search size={16} className="search-icon-pos" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search disciplines or techniques..."
                className="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-subtle)',
                    fontWeight: 700
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Total Count Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                border: '1px solid rgba(44, 34, 30, 0.08)'
              }}>
                Showing <strong>{filteredCategories.length}</strong> of {categories.length} Disciplines
              </span>

              {hasSubcategories && (
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(44, 34, 30, 0.15)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Groups</option>
                  {parentCategories.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Main Disciplines Grid Section */}
      <section style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          
          {filteredCategories.length > 0 ? (
            <div className="categories-grid">
              {filteredCategories.map((cat) => {
                const IconComp = ICON_MAP[cat.iconName] || Sparkles;
                const catCourses = courses.filter(c => c.categoryId === cat.id);
                const projectCount = cat.projectCount || catCourses.length || 0;

                return (
                  <a
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenCategoryDetail) {
                        onOpenCategoryDetail(cat);
                      } else if (onNavigate) {
                        onNavigate(`/category/${cat.id}`);
                      }
                    }}
                    className="category-card"
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    title={`Click to open full ${cat.title} syllabus & masterclasses`}
                  >
                    <div>
                      {/* Top Bar with Icon and Badge */}
                      <div className="cat-top">
                        <div 
                          className="cat-icon"
                          style={{
                            backgroundColor: `${cat.accent || '#E77D59'}20`,
                            color: cat.accent || '#E77D59'
                          }}
                        >
                          <IconComp size={24} />
                        </div>
                        <span 
                          className="cat-badge"
                          style={{
                            backgroundColor: `${cat.accent || '#E77D59'}15`,
                            color: cat.accent || '#E77D59'
                          }}
                        >
                          {cat.badge || 'Curriculum'}
                        </span>
                      </div>

                      <h3 className="cat-title" style={{ fontSize: '1.35rem', margin: '0.65rem 0 0.35rem' }}>
                        {cat.title}
                      </h3>
                      
                      <div className="cat-subtitle" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        {cat.subtitle}
                      </div>

                      <div 
                        className="cat-desc"
                        dangerouslySetInnerHTML={{ __html: cat.description || '' }}
                        style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55 }}
                      />
                    </div>

                    {/* Card Footer */}
                    <div className="cat-footer" style={{
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(44, 34, 30, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <span 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: cat.accent || 'var(--color-primary)', 
                            display: 'inline-block' 
                          }} 
                        />
                        {projectCount} Masterclasses
                      </span>
                      <span style={{
                        color: 'var(--color-primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <span>View Detail Page</span>
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px dashed rgba(44, 34, 30, 0.15)',
              maxWidth: '540px',
              margin: '0 auto'
            }}>
              <BookOpen size={40} color="var(--color-primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-espresso)', margin: '0 0 0.5rem' }}>
                No disciplines found matching "{searchQuery}"
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try adjusting your search terms or view all handcrafted curriculums.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedParentId('all'); }}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Bottom Callout Banner */}
          <div style={{
            marginTop: '4rem',
            background: 'linear-gradient(135deg, #FFFDFB 0%, #F5EDE6 100%)',
            border: '1px solid rgba(44, 34, 30, 0.08)',
            borderRadius: '20px',
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <span className="badge badge-sage" style={{ marginBottom: '0.5rem' }}>
                Need Custom Mentorship or Personalized Orders?
              </span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-espresso)', margin: '0 0 0.5rem' }}>
                Have a specific crochet project or bespoke design in mind?
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                Our studio creates custom bouquets, character amigurumis, and personalized heirlooms. You can also explore our beginner-to-advanced project masterclasses.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate ? onNavigate('/') : onBackToHome()}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
              >
                ← Explore Masterclasses
              </button>
              <button
                onClick={() => onNavigate ? onNavigate('/shop') : null}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                Visit Handcrafted Shop →
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
