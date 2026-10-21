import React from 'react';
import { Sparkles, Shirt, Grid, Home, ShoppingBag, BookOpen } from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  Shirt: Shirt,
  Grid: Grid,
  Home: Home,
  ShoppingBag: ShoppingBag,
  BookOpen: BookOpen
};

export default function CategoryGrid({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  onOpenCategoryDetail
}) {
  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div className="section-header-row" style={{ marginBottom: '1.75rem' }}>
        <div>
          <span className="badge badge-terracotta" style={{ marginBottom: '0.65rem' }}>
            Handcrafted Curriculums
          </span>
          <h2 className="section-title">
            Explore Crochet Disciplines
          </h2>
          <p className="section-subtitle">
            Click on any discipline to view its full syllabus, video tutorials, photo guides, and enrolled masterclasses.
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            ← View All Categories
          </button>
        )}
      </div>

      {/* Grid of categories */}
      <div className="categories-grid">
        {categories.map((cat) => {
          const IconComp = ICON_MAP[cat.iconName] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <a
              key={cat.id}
              href={`/category/${cat.id}`}
              onClick={(e) => {
                e.preventDefault();
                if (onOpenCategoryDetail) {
                  onOpenCategoryDetail(cat);
                } else if (onSelectCategory) {
                  onSelectCategory(isSelected ? null : cat.id);
                }
              }}
              className={`category-card ${isSelected ? 'selected' : ''}`}
              style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
              title={`Click to open full ${cat.title} detail page`}
            >
              <div>
                <div className="cat-top">
                  <div 
                    className="cat-icon"
                    style={{ backgroundColor: `${cat.accent}20`, color: cat.accent }}
                  >
                    <IconComp size={24} />
                  </div>
                  <span 
                    className="cat-badge"
                    style={{ backgroundColor: `${cat.accent}15`, color: cat.accent }}
                  >
                    {cat.badge}
                  </span>
                </div>

                <h3 className="cat-title">
                  {cat.title}
                </h3>
                <div className="cat-subtitle">
                  {cat.subtitle}
                </div>
                <div 
                  className="cat-desc"
                  dangerouslySetInnerHTML={{ __html: cat.description || '' }}
                />
              </div>

              <div className="cat-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span 
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: cat.accent, 
                      display: 'inline-block' 
                    }} 
                  />
                  {cat.projectCount} Masterclasses
                </span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  View Detail Page →
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
