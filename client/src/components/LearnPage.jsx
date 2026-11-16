import React, { useState, useMemo } from 'react';
import { TUTORIAL_VIDEOS, VIDEO_CATEGORIES, VIDEO_SECTIONS, ALL_VIDEOS } from '../data/learnVideos';

export default function LearnPage({ onNavigate, settings, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' (Video Library) | 'tutorials' (18 Tutorials)
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' or category slug
  const [videoTypeFilter, setVideoTypeFilter] = useState('all'); // 'all' | 'tutorial' | 'live'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Filter 18 step-by-step tutorials
  const filteredTutorials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TUTORIAL_VIDEOS;
    return TUTORIAL_VIDEOS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.hi.toLowerCase().includes(q) ||
        item.lvl.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter sections and their videos based on search, type, and category selection
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return VIDEO_SECTIONS.map((sec) => {
      // If a specific category is chosen and it's not this one, filter out
      if (selectedCategory !== 'all' && sec.slug !== selectedCategory) {
        return null;
      }

      // Filter videos in this section
      const matchingVideos = sec.videos.filter((v) => {
        if (videoTypeFilter !== 'all' && v.type !== videoTypeFilter) return false;
        if (q && !v.title.toLowerCase().includes(q)) return false;
        return true;
      });

      if (matchingVideos.length === 0) return null;

      return {
        ...sec,
        videos: matchingVideos,
        matchCount: matchingVideos.length
      };
    }).filter(Boolean);
  }, [selectedCategory, videoTypeFilter, searchQuery]);

  // Calculate live count and tutorial count across all 319 videos
  const tutorialCount = useMemo(
    () => ALL_VIDEOS.filter((v) => v.type === 'tutorial').length,
    []
  );
  const liveCount = useMemo(
    () => ALL_VIDEOS.filter((v) => v.type === 'live').length,
    []
  );

  const totalFilteredVideos = useMemo(() => {
    return filteredSections.reduce((sum, s) => sum + s.videos.length, 0);
  }, [filteredSections]);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    if (slug !== 'all') {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const waNumber = (settings?.whatsapp_number || '919999999999').replace(/[^0-9]/g, '');

  return (
    <div className="learn-page-wrapper">
      {/* Hero Header */}
      <section className="page-hero learn-hero-section">
        <div className="container">
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={onBackToHome}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', fontSize: '0.9rem' }}
            >
              <i className="fa-solid fa-arrow-left" /> Back to Home
            </button>
          </div>

          <p className="kicker" style={{ color: 'var(--primary, #c96857)', fontWeight: '600', marginBottom: '8px', fontSize: '1.05rem' }}>
            Free videos in Hindi &amp; English · {ALL_VIDEOS.length} and counting
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15, marginBottom: '14px', color: 'var(--text, #2d2420)' }}>
            Crochet Video Library
          </h1>
          <p className="lead" style={{ maxWidth: '800px', margin: '0 0 20px', fontSize: '1.05rem', color: 'var(--text-muted, #7a6f68)', lineHeight: 1.6 }}>
            Every crochet tutorial and live class grouped by category, most-watched first. Pick a category, then press play — the video opens right here. <em>(Crosia sikhe — sabhi video ek jagah.)</em>
          </p>

          {/* Stats Bar */}
          <ul className="vstats" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
            <li style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary, #c96857)', marginRight: '6px' }}>{tutorialCount}</strong>
              step-by-step tutorials
            </li>
            <li style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary, #c96857)', marginRight: '6px' }}>{liveCount}</strong>
              live class recordings
            </li>
            <li style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary, #c96857)', marginRight: '6px' }}>{VIDEO_CATEGORIES.length}</strong>
              categories
            </li>
          </ul>

          {/* Hero CTAs */}
          <div className="hero-ctas" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              className={activeTab === 'videos' ? 'btn-primary' : 'btn-outline'}
              onClick={() => setActiveTab('videos')}
              style={{ padding: '10px 22px' }}
            >
              <i className="fa-brands fa-youtube" style={{ marginRight: '8px' }} />
              Video Library ({ALL_VIDEOS.length})
            </button>
            <button
              type="button"
              className={activeTab === 'tutorials' ? 'btn-primary' : 'btn-outline'}
              onClick={() => setActiveTab('tutorials')}
              style={{ padding: '10px 22px' }}
            >
              <i className="fa-solid fa-graduation-cap" style={{ marginRight: '8px' }} />
              18 Tutorials with written steps
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => onNavigate && onNavigate('classes')}
              style={{ padding: '10px 20px' }}
            >
              Book a live 1:1 class
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Category Filter Bar (Only for Video Library tab) */}
      {activeTab === 'videos' && (
        <div className="cfilter-bar">
          <div className="container">
            <div className="cfilters" role="group" aria-label="Filter by category">
              <button
                type="button"
                className="fchip"
                aria-pressed={selectedCategory === 'all'}
                onClick={() => handleCategoryClick('all')}
              >
                All ({ALL_VIDEOS.length})
              </button>
              {VIDEO_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  className="fchip"
                  aria-pressed={selectedCategory === cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  {cat.title} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Type Filter Controls Bar */}
      <section style={{ padding: '24px 0 10px', background: 'var(--bg-light, #fbf7f4)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '480px' }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'videos'
                    ? 'Search 319 videos (e.g. rose, keychain, purse, tulip)...'
                    : 'Search 18 tutorials (e.g. rose, sunflower, Hindi)...'
                }
                style={{
                  width: '100%',
                  padding: '10px 38px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border, #e5ddd5)',
                  background: '#fff',
                  fontSize: '0.95rem'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>

            {/* Type Pills (for Video Library) */}
            {activeTab === 'videos' && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginRight: '4px' }}>Type:</span>
                <button
                  type="button"
                  className={`learn-pill ${videoTypeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setVideoTypeFilter('all')}
                >
                  All ({ALL_VIDEOS.length})
                </button>
                <button
                  type="button"
                  className={`learn-pill ${videoTypeFilter === 'tutorial' ? 'active' : ''}`}
                  onClick={() => setVideoTypeFilter('tutorial')}
                >
                  Tutorials ({tutorialCount})
                </button>
                <button
                  type="button"
                  className={`learn-pill ${videoTypeFilter === 'live' ? 'active' : ''}`}
                  onClick={() => setVideoTypeFilter('live')}
                >
                  Live Classes ({liveCount})
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          {/* TAB 1: Video Library Grouped by Category */}
          {activeTab === 'videos' && (
            <div>
              {searchQuery && (
                <div style={{ marginBottom: '24px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Found <strong>{totalFilteredVideos}</strong> videos matching "{searchQuery}" across categories:
                </div>
              )}

              {filteredSections.map((sec) => (
                <section
                  key={sec.slug}
                  id={sec.slug}
                  data-cat={sec.slug}
                  className="csec vsec"
                  style={{ scrollMarginTop: '130px', marginBottom: '40px' }}
                >
                  <div className="csec-head" style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '1.65rem', margin: 0, fontWeight: '700', color: 'var(--text, #2d2420)' }}>
                      {sec.title}
                    </h2>
                    <p className="vcount" style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      {sec.videos.length} video{sec.videos.length === 1 ? '' : 's'}
                    </p>
                  </div>

                  <div className="vgrid">
                    {sec.videos.map((v) => (
                      <div
                        key={v.id}
                        className="vcard"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setActiveVideo({
                            id: v.id,
                            title: v.title,
                            subtitle: sec.title,
                            badge: v.type === 'live' ? 'Live class' : 'Tutorial',
                            meta: [v.duration, v.views].filter(Boolean).join(' · '),
                            youtubeUrl: v.youtubeUrl
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveVideo({
                              id: v.id,
                              title: v.title,
                              subtitle: sec.title,
                              badge: v.type === 'live' ? 'Live class' : 'Tutorial',
                              meta: [v.duration, v.views].filter(Boolean).join(' · '),
                              youtubeUrl: v.youtubeUrl
                            });
                          }
                        }}
                      >
                        <span className="vthumb">
                          <img src={v.img} alt={v.title} width="320" height="180" loading="lazy" />
                          {v.duration && <span className="vlen">{v.duration}</span>}
                          {v.type === 'live' && <span className="vbadge vbadge-live">Live class</span>}
                          <div className="tcard-play-overlay">
                            <span className="tcard-play-btn">
                              <i className="fa-solid fa-play" />
                            </span>
                          </div>
                        </span>
                        <span className="vtitle">{v.title}</span>
                        {v.views && <span className="vviews">{v.views}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {filteredSections.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-video-slash" style={{ fontSize: '2.5rem', marginBottom: '14px', opacity: 0.4 }} />
                  <h3>No videos found</h3>
                  <p>No videos matched your criteria. Try clearing the search or choosing "All".</p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setVideoTypeFilter('all');
                    }}
                    style={{ marginTop: '12px' }}
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 18 Step-by-Step Tutorials */}
          {activeTab === 'tutorials' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.65rem', marginBottom: '8px' }}>Step-by-Step Tutorials with Written Steps</h2>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                  Structured guides with stitch patterns, materials, and Hindi subtitles for fundamental crochet projects.
                </p>
              </div>

              <div className="tut-grid">
                {filteredTutorials.map((item) => (
                  <div
                    key={item.id}
                    className="tcard"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setActiveVideo({
                        id: item.id,
                        title: item.name,
                        subtitle: item.hi,
                        badge: item.lvl,
                        youtubeUrl: item.youtubeUrl
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveVideo({
                          id: item.id,
                          title: item.name,
                          subtitle: item.hi,
                          badge: item.lvl,
                          youtubeUrl: item.youtubeUrl
                        });
                      }
                    }}
                  >
                    <div className="tcard-img">
                      <img src={item.img} alt={item.name} width="320" height="180" loading="lazy" />
                      <div className="tcard-play-overlay">
                        <span className="tcard-play-btn">
                          <i className="fa-solid fa-play" />
                        </span>
                      </div>
                    </div>
                    <span className="tcard-lvl">{item.lvl}</span>
                    <span className="tcard-name">{item.name}</span>
                    <span className="tcard-hi">{item.hi}</span>
                  </div>
                ))}
              </div>

              {filteredTutorials.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                  No tutorials matched "{searchQuery}".
                </div>
              )}
            </div>
          )}

          {/* Bottom Call to Actions & Info Cards */}
          <div className="learn-ctas" style={{ marginTop: '50px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate && onNavigate('classes')}
            >
              Book a live 1:1 class
            </button>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hi! I want to learn crochet and join a class.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }} /> Ask on WhatsApp
            </a>
          </div>

          <div className="occasions-info-grid" style={{ marginTop: '40px' }}>
            <div className="occasions-info-card">
              <h3>Beginner Friendly</h3>
              <p>
                Every tutorial uses simple stitches — chain, single crochet, double crochet — with clear step-by-step Hindi &amp; English instructions.
              </p>
            </div>
            <div className="occasions-info-card">
              <h3>Watch &amp; Practice</h3>
              <p>
                Click any tutorial or live class card above to watch directly in our embedded player without leaving the page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded YouTube Player Modal */}
      {activeVideo && (
        <div
          className="modal-overlay active"
          onClick={() => setActiveVideo(null)}
          style={{ zIndex: 10000 }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '820px', width: '95%', padding: '24px' }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
            >
              &times;
            </button>

            <div style={{ marginBottom: '14px', paddingRight: '32px' }}>
              {activeVideo.badge && (
                <span className="tcard-lvl" style={{ marginBottom: '6px', display: 'inline-block' }}>
                  {activeVideo.badge}
                </span>
              )}
              <h3 style={{ margin: '4px 0', fontSize: '1.35rem' }}>{activeVideo.title}</h3>
              {activeVideo.subtitle && (
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {activeVideo.subtitle}
                  {activeVideo.meta ? ` · ${activeVideo.meta}` : ''}
                </p>
              )}
            </div>

            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '14px',
                background: '#000'
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
              />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ fontSize: '0.9rem', padding: '8px 16px' }}
              >
                <i className="fa-brands fa-youtube" style={{ marginRight: '8px', color: '#ff0000' }} />
                Watch on YouTube
              </a>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setActiveVideo(null)}
                style={{ fontSize: '0.9rem', padding: '8px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
