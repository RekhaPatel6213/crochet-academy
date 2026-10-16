import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Play, Film, Image as ImageIcon, BookOpen, 
  Sparkles, Award, ShieldCheck, CheckCircle2, Clock, 
  ChevronRight, Layers, Home, ExternalLink, Share2, Check
} from 'lucide-react';

export default function CategoryDetailPage({ 
  category, 
  categories = [],
  courses = [], 
  onBack, 
  onSwitchCategory,
  onSelectCourse, 
  onOpenPackages,
  onOpenExam
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'video', 'gallery', 'syllabus', 'classes'
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
  }, [category?.id]);

  if (!category) return null;

  // Filter courses belonging to this category
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

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="category-detail-tab-page" style={{ width: '100%', minHeight: '80vh', backgroundColor: 'var(--bg-canvas)' }}>
      
      {/* TOP NAVIGATION & BREADCRUMB TAB BAR */}
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          borderBottom: '1px solid var(--border-subtle)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 40,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div className="container" style={{ padding: '0.75rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            
            {/* Breadcrumb Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <button
                onClick={onBack}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '10px' }}
              >
                <ArrowLeft size={14} /> Back to Home
              </button>

              <span style={{ color: 'var(--text-subtle)' }}>/</span>

              <span 
                onClick={onBack}
                style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Return to Disciplines on Home Page"
              >
                <Home size={14} /> Disciplines
              </span>

              <span style={{ color: 'var(--text-subtle)' }}>/</span>

              <span style={{ fontWeight: 800, color: category.accent || 'var(--color-primary)' }}>
                {category.title}
              </span>
            </div>

            {/* Quick Share / Info Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleShare}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {copiedLink ? <Check size={14} color="var(--color-sage)" /> : <Share2 size={14} />}
                <span>{copiedLink ? "Link Copied!" : "Share Discipline"}</span>
              </button>

              <button
                onClick={onOpenPackages}
                className="btn btn-primary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Sparkles size={14} />
                <span>All Packages</span>
              </button>
            </div>

          </div>

          {/* SIBLING CATEGORY SWITCHER TABS */}
          {categories && categories.length > 0 && (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                overflowX: 'auto', 
                paddingTop: '0.65rem',
                paddingBottom: '0.2rem',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '0.65rem'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginRight: '0.25rem' }}>
                All Disciplines:
              </span>

              {categories.map((cat) => {
                const isActive = cat.id === category.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (onSwitchCategory) onSwitchCategory(cat);
                    }}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 800 : 500,
                      backgroundColor: isActive ? (cat.accent || 'var(--color-primary)') : '#FAF7F2',
                      color: isActive ? '#FFFFFF' : 'var(--text-main)',
                      border: isActive ? 'none' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <span 
                      style={{ 
                        width: '7px', 
                        height: '7px', 
                        borderRadius: '50%', 
                        backgroundColor: isActive ? '#FFFFFF' : (cat.accent || 'var(--color-primary)') 
                      }} 
                    />
                    <span>{cat.title}</span>
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* FULL-WIDTH HERO HEADER SECTION */}
      <section 
        style={{ 
          background: `linear-gradient(135deg, ${category.accent}15 0%, rgba(250, 247, 242, 0.95) 60%, #FAF7F2 100%)`, 
          borderBottom: '1px solid var(--border-subtle)',
          padding: '3rem 0 2.5rem'
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'center' }}>
            
            {/* Left Column: Hero Text */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                <span 
                  className="badge" 
                  style={{ backgroundColor: category.accent || 'var(--color-primary)', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800 }}
                >
                  {category.badge || 'Artisanal Discipline'}
                </span>
                <span className="badge badge-sage" style={{ fontSize: '0.75rem' }}>
                  {category.difficulty || 'All Skill Levels'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Curriculum Code #{category.id}
                </span>
              </div>

              <h1 style={{ fontSize: '2.8rem', margin: '0 0 0.75rem', fontFamily: 'var(--font-serif)', lineHeight: 1.15, color: 'var(--text-main)' }}>
                {category.title}
              </h1>

              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', margin: '0 0 1.75rem', lineHeight: 1.6, maxWidth: '640px' }}>
                {category.subtitle}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.75rem' }}>
                {categoryCourses.length > 0 && (
                  <button
                    onClick={() => onSelectCourse(categoryCourses[0])}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.6rem', fontSize: '0.92rem' }}
                  >
                    <Play size={16} fill="#FFFFFF" />
                    <span>Start First Class: {categoryCourses[0].title}</span>
                  </button>
                )}

                <button
                  onClick={onOpenExam}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem' }}
                >
                  <Award size={16} color="var(--color-honey)" />
                  <span>80% MCQ Exam</span>
                </button>
              </div>

              {/* Metric Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: 'var(--shadow-sm)' }}>
                  <Film size={15} color="var(--color-primary)" />
                  <strong>{categoryCourses.length} Masterclasses</strong>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: 'var(--shadow-sm)' }}>
                  <ImageIcon size={15} color={category.accent || 'var(--color-primary)'} />
                  <strong>{imagesList.length} Photo Guides</strong>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: 'var(--shadow-sm)' }}>
                  <Award size={15} color="var(--color-honey)" />
                  <strong>80% Accredited Credential</strong>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: 'var(--shadow-sm)' }}>
                  <ShieldCheck size={15} color="var(--color-sage)" />
                  <strong>Lifetime Guild Access</strong>
                </div>
              </div>

            </div>

            {/* Right Column: Featured Visual Showcase Card */}
            <div style={{ position: 'relative' }}>
              <div 
                style={{ 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  border: `3px solid ${category.accent || 'var(--color-primary)'}`,
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: '#FFFFFF',
                  position: 'relative'
                }}
              >
                <img 
                  src={primaryImage} 
                  alt={category.title}
                  style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                />

                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    padding: '1.25rem', 
                    background: 'linear-gradient(to top, rgba(26,24,23,0.85) 0%, transparent 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--color-honey-light)' }}>
                    Featured Discipline
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                    {category.title}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  right: '18px', 
                  backgroundColor: 'var(--color-primary)', 
                  color: '#FFFFFF', 
                  padding: '0.4rem 0.9rem', 
                  borderRadius: '999px', 
                  fontSize: '0.75rem', 
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {category.badge || 'Featured'}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SUB-TABS NAVIGATION BAR */}
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 1.5rem' }}>
          {[
            { id: 'all', label: 'All Content & Overview', icon: BookOpen },
            { id: 'video', label: 'Video Masterclass', icon: Play },
            { id: 'gallery', label: `Photo Guides (${imagesList.length})`, icon: ImageIcon },
            { id: 'syllabus', label: 'Curriculum Syllabus', icon: Layers },
            { id: 'classes', label: `Masterclasses (${categoryCourses.length})`, icon: Film }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  padding: '0.65rem 1.25rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: isActive ? `3px solid ${category.accent || 'var(--color-primary)'}` : '3px solid transparent',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <IconComp size={15} color={isActive ? (category.accent || 'var(--color-primary)') : 'var(--text-subtle)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TAB CONTENT CONTAINER */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        
        {/* DUAL SECTION: VIDEO MASTERCLASS + VISUAL STITCH GALLERY */}
        {(activeSubTab === 'all' || activeSubTab === 'video' || activeSubTab === 'gallery') && (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: videoEmbedUrl ? '1.2fr 0.8fr' : '1fr', 
              gap: '2rem', 
              alignItems: 'start',
              marginBottom: '2.5rem'
            }}
          >
            
            {/* 1. Video Masterclass Player */}
            {(activeSubTab === 'all' || activeSubTab === 'video') && videoEmbedUrl && (
              <div 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '20px', 
                  padding: '1.5rem', 
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-terracotta" style={{ marginBottom: '0.25rem' }}>
                      HD Video Tutorial
                    </span>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Play size={18} fill="var(--color-primary)" color="var(--color-primary)" />
                      {category.title} Masterclass Studio
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Official Guild Tutorial
                  </span>
                </div>

                <div style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#000000', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                  <iframe
                    src={videoEmbedUrl}
                    title={`${category.title} Video Masterclass`}
                    style={{ width: '100%', height: '360px', border: 'none', display: 'block' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', backgroundColor: '#FAF7F2', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Watch the instructor-led studio demo covering foundational tension, hook positioning, and stitch count formulas.
                  </div>
                  <a
                    href={category.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}
                  >
                    Open on YouTube <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}

            {/* 2. Photo Guides & Multi-Image Gallery */}
            {(activeSubTab === 'all' || activeSubTab === 'gallery') && (
              <div 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '20px', 
                  padding: '1.5rem', 
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-sage" style={{ marginBottom: '0.25rem' }}>
                      Visual Documentation
                    </span>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ImageIcon size={18} color={category.accent || 'var(--color-primary)'} />
                      Stitch Gallery ({imagesList.length} Photos)
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Photo {selectedImageIndex + 1} of {imagesList.length}
                  </span>
                </div>

                {/* Primary High-Resolution Photo */}
                <div 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '270px', 
                    borderRadius: '14px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: '#FAF7F2'
                  }}
                >
                  <img 
                    src={primaryImage} 
                    alt={`${category.title} detail photo ${selectedImageIndex + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(26,24,23,0.75)', color: '#FFFFFF', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '8px' }}>
                    Click thumbnails below to inspect
                  </div>
                </div>

                {/* Thumbnails Row */}
                {imagesList.length > 1 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Select photo angle:
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                      {imagesList.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedImageIndex(i)}
                          style={{
                            padding: 0,
                            border: selectedImageIndex === i ? `2px solid ${category.accent || 'var(--color-primary)'}` : '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            width: '74px',
                            height: '58px',
                            cursor: 'pointer',
                            flexShrink: 0,
                            opacity: selectedImageIndex === i ? 1 : 0.65,
                            transform: selectedImageIndex === i ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.2s ease',
                            boxShadow: selectedImageIndex === i ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <img src={img} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                  High-definition photography capturing tension gauge, textured loop definition, and assembly joins.
                </div>
              </div>
            )}

          </div>
        )}

        {/* CURRICULUM SYLLABUS & RICH FORMATTED DESCRIPTION */}
        {(activeSubTab === 'all' || activeSubTab === 'syllabus') && (
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '20px', 
              padding: '2.25rem', 
              border: '1px solid var(--border-subtle)', 
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <BookOpen size={22} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.45rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                  Comprehensive Syllabus & Crafting Guide
                </h3>
              </div>
              <span className="badge badge-honey" style={{ fontSize: '0.75rem' }}>
                Accredited Curriculum
              </span>
            </div>

            <div 
              style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-main)' }}
              dangerouslySetInnerHTML={{ __html: category.description || '<p>Comprehensive hands-on crochet instruction.</p>' }} 
            />
          </div>
        )}

        {/* ALL CROCHET CLASSES IN THIS CATEGORY */}
        {(activeSubTab === 'all' || activeSubTab === 'classes') && (
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-header-row" style={{ marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-sage" style={{ marginBottom: '0.35rem' }}>
                  Step-by-Step Hands-On Video Classes
                </span>
                <h3 style={{ fontSize: '1.75rem', margin: '0.2rem 0', fontFamily: 'var(--font-serif)' }}>
                  Included Masterclasses in {category.title} ({categoryCourses.length})
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                  Each project contains step-by-step video timestamps, stitch formulas, and progress tracker checkpoints.
                </p>
              </div>

              <button
                onClick={onOpenPackages}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
              >
                <span>Unlock All Classes →</span>
              </button>
            </div>

            {categoryCourses.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {categoryCourses.map((crs) => (
                  <div
                    key={crs.id}
                    onClick={() => onSelectCourse && onSelectCourse(crs)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
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
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div>
                      {/* Course Cover Image */}
                      <div style={{ position: 'relative', height: '180px' }}>
                        <img 
                          src={crs.coverImage} 
                          alt={crs.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <span 
                          style={{ 
                            position: 'absolute', 
                            top: '12px', 
                            right: '12px', 
                            backgroundColor: 'var(--color-primary)', 
                            color: '#FFFFFF', 
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            padding: '3px 10px', 
                            borderRadius: '999px',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          {crs.package}
                        </span>

                        <div 
                          style={{ 
                            position: 'absolute', 
                            bottom: '12px', 
                            left: '12px', 
                            backgroundColor: 'rgba(26,24,23,0.8)', 
                            color: '#FFFFFF', 
                            fontSize: '0.72rem', 
                            padding: '3px 9px', 
                            borderRadius: '6px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.35rem' 
                          }}
                        >
                          <Clock size={12} color="var(--color-honey)" /> {crs.duration}
                        </div>
                      </div>

                      {/* Course Info */}
                      <div style={{ padding: '1.35rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                            {crs.level}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ★ {crs.rating} ({crs.reviewsCount})
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.2rem', margin: '0.2rem 0 0.5rem', lineHeight: 1.3, fontFamily: 'var(--font-serif)' }}>
                          {crs.title}
                        </h4>

                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {crs.summary}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span style={{ backgroundColor: '#FAF7F2', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontWeight: 600 }}>
                            {crs.steps?.length || 1} Illustrated Steps
                          </span>
                          <span style={{ backgroundColor: '#FAF7F2', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontWeight: 600 }}>
                            Video + PDF
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div style={{ padding: '0.85rem 1.35rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#FAF7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-sage)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Play size={14} fill="var(--color-sage)" /> Start Step-by-Step Class
                      </span>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '3.5rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
                  Classes for {category.title} are currently being recorded in the artisan studio. Check back soon!
                </p>
                <button onClick={onBack} className="btn btn-secondary">
                  Explore Other Disciplines →
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM GUILD MEMBERSHIP & EXAM CALLOUT */}
        <div 
          style={{ 
            backgroundColor: 'var(--bg-card-warm)', 
            borderRadius: '24px', 
            padding: '2.5rem', 
            border: '2px solid rgba(217, 155, 67, 0.4)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.75rem'
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
              <span className="badge badge-terracotta">Artisan Guild Membership</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-sage)', fontWeight: 700 }}>Full Academy Access</span>
            </div>
            <h3 style={{ fontSize: '1.65rem', margin: '0.2rem 0 0.5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.25 }}>
              Ready to Master {category.title} & Earn Your 80% Certificate?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              Get unlimited access to all step-by-step masterclasses, printable PDF stitch charts, unlimited retakes of our 80% MCQ certification assessment, and official verified credentials.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenPackages}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.65rem', fontSize: '0.92rem' }}
            >
              <Sparkles size={16} />
              <span>Choose Package</span>
            </button>

            <button
              onClick={onOpenExam}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.65rem', fontSize: '0.92rem' }}
            >
              <Award size={16} color="var(--color-honey)" />
              <span>Take 80% MCQ Exam</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
