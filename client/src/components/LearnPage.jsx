import React, { useState, useMemo } from 'react';
import { TUTORIAL_VIDEOS, VIDEO_CATEGORIES, ALL_VIDEOS } from '../data/learnVideos';

const VIDEOS_PER_PAGE = 24;

export default function LearnPage({ onNavigate, settings, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('tutorials'); // 'tutorials' | 'videos'
  const [searchQuery, setSearchQuery] = useState('');
  const [videoTypeFilter, setVideoTypeFilter] = useState('all'); // 'all' | 'tutorial' | 'live'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(VIDEOS_PER_PAGE);
  const [activeVideo, setActiveVideo] = useState(null);

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

  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_VIDEOS.filter((v) => {
      if (videoTypeFilter !== 'all' && v.type !== videoTypeFilter) return false;
      if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
      if (q && !v.title.toLowerCase().includes(q) && !v.category.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, videoTypeFilter, selectedCategory]);

  const visibleVideos = useMemo(
    () => filteredVideos.slice(0, visibleCount),
    [filteredVideos, visibleCount]
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(VIDEOS_PER_PAGE);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(VIDEOS_PER_PAGE);
  };

  const handleTypeChange = (type) => {
    setVideoTypeFilter(type);
    setVisibleCount(VIDEOS_PER_PAGE);
  };

  const tutorialCount = useMemo(
    () => ALL_VIDEOS.filter((v) => v.type === 'tutorial').length,
    []
  );
  const liveCount = useMemo(
    () => ALL_VIDEOS.filter((v) => v.type === 'live').length,
    []
  );

  const waNumber = (settings?.whatsapp_number || '919999999999').replace(/[^0-9]/g, '');

  return (
    <div className="learn-page-wrapper">
      <section className="section learn-hero-section">
        <div className="container">
          {/* Top Back Bar */}
          <div style={{ marginBottom: '24px' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={onBackToHome}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', fontSize: '0.9rem' }}
            >
              <i className="fa-solid fa-arrow-left" /> Back to Home
            </button>
          </div>

          {/* Header */}
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '28px' }}>
            <div className="section-tag">Free Learning</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.15, marginBottom: '14px' }}>
              Free Crochet Tutorials &amp; Video Library
            </h1>
            <p style={{ maxWidth: '720px', margin: '0', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
              Learn to crochet in simple Hindi &amp; English with {TUTORIAL_VIDEOS.length} step-by-step tutorials and {ALL_VIDEOS.length} full YouTube video lessons — from holding a hook to roses, sunflowers, keychains, bags, and Laddu Gopal dresses.
            </p>
          </div>

          {/* Primary View Tabs */}
          <div className="learn-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              className={activeTab === 'tutorials' ? 'btn-primary' : 'btn-outline'}
              onClick={() => handleTabChange('tutorials')}
              style={{ padding: '10px 20px', fontSize: '0.95rem' }}
            >
              <i className="fa-solid fa-graduation-cap" style={{ marginRight: '8px' }} />
              Step-by-Step Tutorials ({TUTORIAL_VIDEOS.length})
            </button>
            <button
              type="button"
              className={activeTab === 'videos' ? 'btn-primary' : 'btn-outline'}
              onClick={() => handleTabChange('videos')}
              style={{ padding: '10px 20px', fontSize: '0.95rem' }}
            >
              <i className="fa-brands fa-youtube" style={{ marginRight: '8px' }} />
              Full Video Library ({ALL_VIDEOS.length})
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '460px' }}>
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(VIDEOS_PER_PAGE);
                }}
                placeholder={
                  activeTab === 'tutorials'
                    ? 'Search tutorials (e.g. rose, sunflower, magic ring, Hindi)...'
                    : 'Search 319 videos (e.g. rose, keychain, rakhi, purse, tulip)...'
                }
                style={{
                  width: '100%',
                  padding: '10px 38px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
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
                    right: '10px',
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

            {activeTab === 'videos' && (
              <>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`learn-pill ${videoTypeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => handleTypeChange('all')}
                  >
                    All ({ALL_VIDEOS.length})
                  </button>
                  <button
                    type="button"
                    className={`learn-pill ${videoTypeFilter === 'tutorial' ? 'active' : ''}`}
                    onClick={() => handleTypeChange('tutorial')}
                  >
                    Tutorials ({tutorialCount})
                  </button>
                  <button
                    type="button"
                    className={`learn-pill ${videoTypeFilter === 'live' ? 'active' : ''}`}
                    onClick={() => handleTypeChange('live')}
                  >
                    Live Classes ({liveCount})
                  </button>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  aria-label="Filter by category"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    fontSize: '0.92rem',
                    minWidth: '210px'
                  }}
                >
                  <option value="All">All Categories ({VIDEO_CATEGORIES.length})</option>
                  {VIDEO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* TAB 1: 18 Step-by-Step Tutorials */}
          {activeTab === 'tutorials' && (
            <>
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
                  No tutorials matched "{searchQuery}". Try searching in the Full Video Library tab!
                </div>
              )}
            </>
          )}

          {/* TAB 2: All 319 Videos */}
          {activeTab === 'videos' && (
            <>
              <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing {visibleVideos.length} of {filteredVideos.length} videos
                {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
              </div>

              <div className="vcard-grid">
                {visibleVideos.map((v, idx) => (
                  <div
                    key={`${v.id}-${idx}`}
                    className="vcard"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setActiveVideo({
                        id: v.id,
                        title: v.title,
                        subtitle: v.category,
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
                          subtitle: v.category,
                          badge: v.type === 'live' ? 'Live class' : 'Tutorial',
                          meta: [v.duration, v.views].filter(Boolean).join(' · '),
                          youtubeUrl: v.youtubeUrl
                        });
                      }
                    }}
                  >
                    <div className="vthumb">
                      <img src={v.img} alt={v.title} width="320" height="180" loading="lazy" />
                      {v.duration && <span className="vlen">{v.duration}</span>}
                      {v.type === 'live' && <span className="vbadge-live">Live class</span>}
                      <div className="tcard-play-overlay">
                        <span className="tcard-play-btn">
                          <i className="fa-solid fa-play" />
                        </span>
                      </div>
                    </div>
                    <div className="vcard-body">
                      <span className="vcard-cat">{v.category}</span>
                      <span className="vtitle">{v.title}</span>
                      {v.views && <span className="vviews">{v.views}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                  No videos matched your filters. Try clearing the search or choosing "All Categories".
                </div>
              )}

              {visibleCount < filteredVideos.length && (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setVisibleCount((c) => c + VIDEOS_PER_PAGE)}
                    style={{ padding: '12px 28px' }}
                  >
                    Load More Videos ({filteredVideos.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="learn-ctas" style={{ marginTop: '44px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate && onNavigate('classes')}
            >
              Book a live 1:1 class
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => handleTabChange(activeTab === 'tutorials' ? 'videos' : 'tutorials')}
            >
              {activeTab === 'tutorials'
                ? `Browse all ${ALL_VIDEOS.length} videos`
                : `View ${TUTORIAL_VIDEOS.length} step-by-step tutorials`}
            </button>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hi! I want to learn crochet and join a class.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-brands fa-whatsapp" /> Ask on WhatsApp
            </a>
          </div>

          {/* Bottom 2-card info grid */}
          <div className="occasions-info-grid" style={{ marginTop: '48px' }}>
            <div className="occasions-info-card">
              <h3>Beginner friendly</h3>
              <p>
                Every tutorial uses simple stitches — chain, single crochet, double crochet — and step-by-step Hindi + English instructions.
              </p>
            </div>
            <div className="occasions-info-card">
              <h3>Watch &amp; practice</h3>
              <p>
                Click any tutorial or live class card above to watch the embedded video directly here, or open it on YouTube with full playback controls.
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
