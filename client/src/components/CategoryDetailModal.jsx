import React, { useState } from 'react';
import { 
  X, ArrowLeft, Play, Film, Image as ImageIcon, BookOpen, 
  Sparkles, Award, ShieldCheck, CheckCircle2, Clock, 
  ExternalLink, Layers, ChevronRight
} from 'lucide-react';

export default function CategoryDetailModal({ 
  category, 
  courses = [], 
  onClose, 
  onSelectCourse, 
  onOpenPackages 
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!category) return null;

  // Associated courses in this category
  const categoryCourses = courses.filter(
    c => c.categoryId?.toLowerCase() === category.id?.toLowerCase()
  );

  // Gallery images array
  const imagesList = Array.isArray(category.images) && category.images.length > 0 
    ? category.images 
    : [category.coverImage || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'];

  const primaryImage = imagesList[selectedImageIndex] || imagesList[0];

  // Helper to format YouTube embed
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    return url;
  };

  const videoEmbedUrl = getEmbedUrl(category.videoUrl);

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ zIndex: 1100, padding: '1rem', overflowY: 'auto' }}
    >
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1080px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: `2px solid ${category.accent || 'var(--color-primary)'}`
        }}
      >
        {/* TOP BAR / NAVIGATION */}
        <div 
          style={{ 
            padding: '1rem 1.75rem', 
            borderBottom: '1px solid var(--border-subtle)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#FAF7F2' 
          }}
        >
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeft size={15} /> Back to Disciplines
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img 
              src="/logo.png" 
              alt="Petal & Loop" 
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
              Petal & Loop Academy
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
            aria-label="Close detail modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* HERO BANNER WITH THEME COLOR */}
        <div 
          style={{ 
            background: `linear-gradient(135deg, ${category.accent}18 0%, rgba(250, 247, 242, 0.9) 100%)`, 
            padding: '2.5rem 2rem 2rem', 
            borderBottom: '1px solid var(--border-subtle)',
            position: 'relative'
          }}
        >
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span 
                className="badge" 
                style={{ backgroundColor: category.accent || 'var(--color-primary)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700 }}
              >
                {category.badge || 'Artisanal Discipline'}
              </span>
              <span className="badge badge-sage" style={{ fontSize: '0.72rem' }}>
                {category.difficulty || 'All Levels Welcome'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Category #{category.id}
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', margin: '0.2rem 0 0.5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.15, color: 'var(--text-main)' }}>
              {category.title}
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              {category.subtitle}
            </p>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-sm)' }}>
                <Film size={15} color="var(--color-primary)" />
                <strong>{categoryCourses.length} Masterclasses</strong>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-sm)' }}>
                <ImageIcon size={15} color={category.accent || 'var(--color-primary)'} />
                <strong>{imagesList.length} Photo Guides</strong>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-sm)' }}>
                <Award size={15} color="var(--color-honey)" />
                <strong>80% MCQ Certified</strong>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-sm)' }}>
                <ShieldCheck size={15} color="var(--color-sage)" />
                <strong>Lifetime Access</strong>
              </div>
            </div>
          </div>
        </div>

        {/* DETAIL CONTENT BODY */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* SECTION 1: VIDEO MASTERCLASS + PHOTO GALLERY DUAL GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: videoEmbedUrl ? '1.2fr 0.8fr' : '1fr', gap: '1.75rem', alignItems: 'start' }}>
            
            {/* A. Embedded Video Studio */}
            {videoEmbedUrl && (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '18px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Play size={18} fill="var(--color-primary)" color="var(--color-primary)" />
                    Video Masterclass Introduction
                  </h3>
                  <span className="badge badge-terracotta" style={{ fontSize: '0.65rem' }}>
                    HD Video
                  </span>
                </div>

                <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                  <iframe
                    src={videoEmbedUrl}
                    title={`${category.title} Video Overview`}
                    style={{ width: '100%', height: '300px', border: 'none', display: 'block' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.65rem 0 0', lineHeight: 1.4 }}>
                  Comprehensive video tutorial covering foundation stitch formulas, tension control, and artisan assembly.
                </p>
              </div>
            )}

            {/* B. Multiple Images Visual Gallery */}
            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '18px', padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={18} color={category.accent || 'var(--color-primary)'} />
                  Visual Stitch Gallery ({imagesList.length} Photos)
                </h3>
              </div>

              {/* Main Featured Photo */}
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <img 
                  src={primaryImage} 
                  alt={category.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#FFF', fontSize: '0.68rem', padding: '3px 8px', borderRadius: '6px' }}>
                  Photo {selectedImageIndex + 1} of {imagesList.length}
                </span>
              </div>

              {/* Thumbnails Row */}
              {imagesList.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {imagesList.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImageIndex(i)}
                      style={{
                        padding: 0,
                        border: selectedImageIndex === i ? `2px solid ${category.accent || 'var(--color-primary)'}` : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        width: '64px',
                        height: '52px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        opacity: selectedImageIndex === i ? 1 : 0.65,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <img src={img} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* SECTION 2: RICH FORMATTED CURRICULUM DESCRIPTION */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
              <BookOpen size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                Curriculum Details & Stitch Syllabus
              </h3>
            </div>

            <div 
              style={{ fontSize: '0.95rem', lineHeight: '1.75', color: 'var(--text-main)' }}
              dangerouslySetInnerHTML={{ __html: category.description || '<p>Comprehensive hands-on crochet instruction.</p>' }} 
            />
          </div>

          {/* SECTION 3: ALL CROCHET CLASSES IN THIS CATEGORY */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-sage" style={{ marginBottom: '0.25rem' }}>
                  Hands-On Projects
                </span>
                <h3 style={{ fontSize: '1.5rem', margin: '0.2rem 0', fontFamily: 'var(--font-serif)' }}>
                  Classes in this Discipline ({categoryCourses.length})
                </h3>
              </div>
            </div>

            {categoryCourses.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {categoryCourses.map((crs) => (
                  <div
                    key={crs.id}
                    onClick={() => {
                      if (onSelectCourse) onSelectCourse(crs);
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
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
                    <div>
                      <div style={{ position: 'relative', height: '160px' }}>
                        <img 
                          src={crs.coverImage} 
                          alt={crs.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--color-primary)', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                          {crs.package}
                        </span>
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(26,24,23,0.75)', color: '#FFF', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={12} /> {crs.duration}
                        </div>
                      </div>

                      <div style={{ padding: '1.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {crs.level}
                        </span>
                        <h4 style={{ fontSize: '1.15rem', margin: '0.25rem 0 0.5rem', lineHeight: 1.3 }}>
                          {crs.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {crs.summary}
                        </p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Includes {crs.steps?.length || 1} illustrated step cards & formulas
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#FAF7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-sage)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Play size={13} fill="var(--color-sage)" /> Start Class
                      </span>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>
                  Masterclasses for {category.title} are currently being recorded in the artisan studio. Check back soon!
                </p>
              </div>
            )}
          </div>

          {/* SECTION 4: MEMBERSHIP CALLOUT FOOTER */}
          <div 
            style={{ 
              backgroundColor: 'var(--bg-card-warm)', 
              borderRadius: '20px', 
              padding: '2rem', 
              border: '2px solid rgba(217, 155, 67, 0.4)',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-terracotta">Guild Membership</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-sage)', fontWeight: 700 }}>Full Academy Access</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', margin: 0 }}>
                Unlock Complete Access to {category.title} & Verified Certificate
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Includes video lessons, downloadable PDF stitch counts, and our accredited 80% MCQ certification.
              </p>
            </div>

            <button
              onClick={() => {
                if (onOpenPackages) onOpenPackages();
              }}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={16} /> View Membership Packages →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
