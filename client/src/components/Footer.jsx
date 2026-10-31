import React from 'react';
import { Award, Heart, Phone, Mail, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react';

export default function Footer({ onOpenPackages, onOpenExam, settings, onNavigate }) {
  const companyName = settings?.companyName || "Tishaya Petal & Loop";
  const tagline = (settings?.tagline || "HANDMADE • UNIQUE • WITH LOVE 🌸").replace(/♡/g, "🌸");
  const logo = settings?.logo || "/logo.png";
  const contactPhone = settings?.contactPhone || "+91 9099962395";
  const whatsappNum = settings?.whatsappNumber || "919099962395";
  const contactEmail = settings?.contactEmail || "anjalicrochetknit@gmail.com";
  const address = settings?.address || "2039, 12th Avenue, Gaur City 2, Greater Noida West, Uttar Pradesh 201009";
  const supportHours = settings?.supportHours || "Open Every Day: 10:00 AM – 9:00 PM IST";

  const getBrandParts = (name) => {
    const raw = (name || 'Tishaya Petal & Loop').trim();
    if (raw.toLowerCase().includes('tishaya')) {
      const remaining = raw.replace(/tishaya/i, '').trim();
      return { main: 'Tishaya', sub: remaining || 'Petal & Loop' };
    }
    const parts = raw.split(' ');
    if (parts.length > 1) {
      return { main: parts[0], sub: parts.slice(1).join(' ') };
    }
    return { main: raw, sub: 'Petal & Loop' };
  };

  const brandParts = getBrandParts(companyName);

  return (
    <footer className="site-footer">
      <div className="container">
        
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img 
                src={logo} 
                alt={companyName} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', backgroundColor: '#FFFFFF' }} 
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.3rem', color: '#FFFFFF', lineHeight: 0.9 }}>
                  {brandParts.main} <span style={{ fontSize: '0.55em' }}>🌸</span>
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', marginLeft: '16px', lineHeight: 1.1 }}>
                  {brandParts.sub}
                </span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.88)', marginTop: '4px' }}>
                  {tagline}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.92)', lineHeight: 1.6, margin: 0 }}>
              Handmade crochet boutique, yarn store, and teaching studio based in Gaur City 2, Greater Noida West. Specializing in eternal flowers, amigurumi, return gifts & accredited certification.
            </p>
            
            {/* Contact Details from Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.95)', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Phone size={13} color="#FFFFFF" />
                <span>Call: {contactPhone}</span>
              </div>
              <a 
                href={`https://wa.me/${whatsappNum}?text=Hello%20Tishaya%20Petal%20%26%20Loop!%20I%20have%20an%20order%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.45rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.22)', 
                  padding: '0.25rem 0.65rem', 
                  borderRadius: '8px', 
                  color: '#FFFFFF', 
                  textDecoration: 'none', 
                  fontWeight: 700, 
                  width: 'fit-content',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <MessageCircle size={14} color="#25D366" fill="#25D366" />
                <span>WhatsApp: +91 {whatsappNum}</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Mail size={13} color="#FFFFFF" />
                <span>{contactEmail}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <MapPin size={13} color="#FFFFFF" />
                <span>{address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Clock size={13} color="#FFFFFF" />
                <span>{supportHours}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.22)', border: '1px solid rgba(255, 255, 255, 0.35)', padding: '0.3rem 0.75rem', borderRadius: '999px', fontWeight: 700, backdropFilter: 'blur(4px)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                ★ 5.0/5 Google Verified Customer Rating
              </span>
            </div>
          </div>

          {/* Disciplines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: 0, fontWeight: 700 }}>
              Disciplines
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              <div>Amigurumi Plushies</div>
              <div>Wearable Cardigans</div>
              <div>Granny Squares</div>
              <div>Home Plant Hangers</div>
              <div>Beginner Stitch Lab</div>
            </div>
          </div>

          {/* Certification Guild */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
              <Award size={17} color="#FFFFFF" />
              Artisan Certification
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.92)', margin: 0, lineHeight: 1.5 }}>
              Pass our 10-Question MCQ test with 80% or higher to earn an official accredited credential.
            </p>
            <div>
              <a
                href="/certification"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/certification');
                  else if (onOpenExam) onOpenExam();
                }}
                style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'underline', textUnderlineOffset: '3px', display: 'inline-block' }}
              >
                Take Assessment (80%) →
              </a>
            </div>
            <div>
              <a
                href="/packages"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/packages');
                  else if (onOpenPackages) onOpenPackages();
                }}
                className="btn"
                style={{ 
                  padding: '0.55rem 1.25rem', 
                  fontSize: '0.82rem', 
                  fontWeight: 800, 
                  backgroundColor: '#FFFFFF', 
                  color: '#E65C7B', 
                  borderRadius: '999px', 
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)', 
                  border: 'none', 
                  textDecoration: 'none', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  transition: 'all 0.2s ease' 
                }}
              >
                <Sparkles size={14} color="#E65C7B" />
                <span>View Packages & Enroll</span>
              </a>
            </div>
            <div style={{ marginTop: '0.2rem' }}>
              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/faq');
                }}
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '0.82rem', 
                  textDecoration: 'none', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.35rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.16)', 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <span>Help & Frequently Asked Questions →</span>
              </a>
            </div>
          </div>

          {/* Stitch Cheat Sheet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: 0, fontWeight: 700 }}>
              Stitch Quick Key
            </h4>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.18)', 
              backdropFilter: 'blur(8px)', 
              padding: '0.95rem', 
              borderRadius: '14px', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              fontSize: '0.8rem', 
              color: '#FFFFFF', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.45rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.95 }}>US Single Crochet (SC)</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>= UK Double</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.95 }}>US Double Crochet (DC)</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>= UK Treble</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.95 }}>Magic Ring (MR)</span>
                <strong style={{ color: '#E8F5E9', fontWeight: 800 }}>= Zero Gap</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.95 }}>Invisible Decrease</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>= Front Loops</strong>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 {companyName}. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Handcrafted with <Heart size={14} color="#FFFFFF" fill="#FFFFFF" /> for artisans.
          </span>
        </div>

      </div>
    </footer>
  );
}