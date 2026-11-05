import React, { useState } from 'react';
import { Play, X, ExternalLink, Sparkles, BookOpen, MessageCircle } from 'lucide-react';

export const TUTORIAL_VIDEOS = [
  {
    id: 'kpAh8tKFJSM',
    name: 'Crochet for complete beginners',
    hi: 'Crosia chalana kaise sikhe — bilkul shuruaat se',
    lvl: 'Beginner · 6:54 + 13:33',
    img: 'https://i.ytimg.com/vi/kpAh8tKFJSM/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=kpAh8tKFJSM'
  },
  {
    id: 'ytZRz2B5RKA',
    name: 'Rose keychain',
    hi: 'Rose flower keychain kaise banate hain',
    lvl: 'Beginner · 6:29',
    img: 'https://i.ytimg.com/vi/ytZRz2B5RKA/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=ytZRz2B5RKA'
  },
  {
    id: 'gjXv-lyaPyA',
    name: 'Crochet sunflower',
    hi: 'Crosia se sunflower kaise banaen',
    lvl: 'Beginner · 10:39',
    img: 'https://i.ytimg.com/vi/gjXv-lyaPyA/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=gjXv-lyaPyA'
  },
  {
    id: '3avDGacJevY',
    name: 'Rose leaf (patti)',
    hi: 'Rose flower ki patti kaise banaye',
    lvl: 'Beginner · 6:31',
    img: 'https://i.ytimg.com/vi/3avDGacJevY/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=3avDGacJevY'
  },
  {
    id: 'luBtggbVYNE',
    name: 'Cherry keychain',
    hi: 'Crosia se cherry kaise banaye',
    lvl: 'Beginner · 1 h 54 min',
    img: 'https://i.ytimg.com/vi/luBtggbVYNE/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=luBtggbVYNE'
  },
  {
    id: 'MWMEvyKuQNo',
    name: 'Strawberry',
    hi: 'Crosia se strawberry kaise banaye',
    lvl: 'Beginner · 2 h 48 min',
    img: 'https://i.ytimg.com/vi/MWMEvyKuQNo/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=MWMEvyKuQNo'
  },
  {
    id: 'V-4qYjvlQqE',
    name: 'Heart shape',
    hi: 'Crosia se heart shape kaise banaye',
    lvl: 'Beginner · 7:01',
    img: 'https://i.ytimg.com/vi/V-4qYjvlQqE/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=V-4qYjvlQqE'
  },
  {
    id: 'xdFCRUQ584M',
    name: 'Granny square',
    hi: 'Crosia se granny square kaise banaye',
    lvl: 'Beginner · 9:49',
    img: 'https://i.ytimg.com/vi/xdFCRUQ584M/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=xdFCRUQ584M'
  }
];

export default function LearnSection({ onNavigate, settings }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const whatsappNum = settings?.whatsappNumber || '919099962395';

  return (
    <section data-learn id="learn" style={{ marginTop: '5.5rem', scrollMarginTop: '100px' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
          <span 
            className="badge badge-terracotta" 
            style={{ marginBottom: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>🌸</span>
            <span>Free Video Tutorials in Hindi</span>
          </span>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso)' }}>
            Learn Crochet with Anjali
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            Free video tutorials in Hindi, classes and yarn from Gaur City 2, Greater Noida West
          </p>
        </div>

        {/* 8 Video Tutorial Cards Grid (Identical layout to anjalicrochet.store) */}
        <div className="tut-grid">
          {TUTORIAL_VIDEOS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className="tcard"
              style={{ cursor: 'pointer' }}
              title={`Click to watch ${item.name} video tutorial`}
            >
              <span className="tcard-img">
                <img 
                  src={item.img} 
                  alt={`${item.name} crochet tutorial video`} 
                  loading="lazy" 
                  width="480" 
                  height="360" 
                />
                <span className="tcard-play-overlay">
                  <span className="tcard-play-btn">
                    <Play size={20} fill="#FFFFFF" color="#FFFFFF" />
                  </span>
                </span>
              </span>
              <span className="tcard-lvl">{item.lvl}</span>
              <span className="tcard-name">{item.name}</span>
              <span className="tcard-hi">{item.hi}</span>
            </div>
          ))}
        </div>

        {/* CTAs Row */}
        <div className="learn-ctas">
          <button
            onClick={() => onNavigate ? onNavigate('/masterclasses') : null}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.92rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <BookOpen size={16} />
            <span>All 18 tutorials with written steps</span>
          </button>

          <a 
            href="https://www.youtube.com/@Anjalicrochetknit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.92rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}
          >
            <ExternalLink size={16} />
            <span>Browse all 318 videos on YouTube</span>
          </a>
        </div>

        {/* Occasions / Inquire Info Cards */}
        <div className="occasions-info-grid">
          <div className="occ-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-sage">Guided Training</span>
            </div>
            <h3>Crochet classes</h3>
            <p>Learn with Anjali, offline in Gaur City 2 (₹1,500/month) or online from home (₹1,000/month).</p>
            <a 
              href={`https://wa.me/${whatsappNum}?text=Hello%20Anjali!%20I%20am%20interested%20in%20joining%20your%20Crochet%20Classes%20(Online%20/%20Offline).`}
              target="_blank"
              rel="noopener noreferrer"
              className="occ-ask-link"
            >
              <MessageCircle size={15} />
              <span>Class details →</span>
            </a>
          </div>

          <div className="occ-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-honey">Materials & Tools</span>
            </div>
            <h3>Crochet yarn</h3>
            <p>Ganga, Anchor and Vardhman yarn, crochet thread, hooks and kits, in retail and bulk. Ask us what's in stock.</p>
            <a 
              href={`https://wa.me/${whatsappNum}?text=Hello%20Anjali!%20I%20want%20to%20inquire%20about%20Crochet%20Yarn,%20threads%20and%20hooks.`}
              target="_blank"
              rel="noopener noreferrer"
              className="occ-ask-link"
            >
              <MessageCircle size={15} />
              <span>Buy yarn →</span>
            </a>
          </div>
        </div>

      </div>

      {/* Embedded Video Player Modal */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: '#1E1916',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '850px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            color: '#FFFFFF'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(90deg, #2A211D 0%, #1E1916 100%)'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {activeVideo.lvl}
                </span>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: '#FFFFFF' }}>
                  {activeVideo.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                aria-label="Close video player"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000000' }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              background: '#231C18'
            }}>
              <span style={{ fontSize: '0.88rem', color: '#D8CCC4', fontStyle: 'italic' }}>
                🇮🇳 {activeVideo.hi}
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.82rem',
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'transparent',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Open on YouTube</span>
                </a>

                <a
                  href={`https://wa.me/${whatsappNum}?text=Hello%20Anjali!%20I%20have%20a%20question%20about%20your%20${encodeURIComponent(activeVideo.name)}%20crochet%20tutorial.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <MessageCircle size={14} />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
