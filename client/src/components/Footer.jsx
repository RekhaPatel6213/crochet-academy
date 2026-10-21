import React from 'react';
import { Award, Heart, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function Footer({ onOpenPackages, onOpenExam, settings, onNavigate }) {
  const companyName = settings?.companyName || "Tishaya Petal & Loop";
  const tagline = settings?.tagline || "Handmade • Unique • With Love ♡";
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
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.25)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} 
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.3rem', color: '#FFFFFF', lineHeight: 0.9 }}>
                  {brandParts.main} <span style={{ color: '#F8B4C4', fontSize: '0.6em' }}>♡</span>
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', marginLeft: '16px', lineHeight: 1.1 }}>
                  {brandParts.sub}
                </span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#D8CCC4', marginTop: '4px' }}>
                  {tagline || "HANDMADE • UNIQUE • WITH LOVE"}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#D8CCC4', lineHeight: 1.6, margin: 0 }}>
              Handmade crochet boutique, yarn store, and teaching studio based in Gaur City 2, Greater Noida West. Specializing in eternal flowers, amigurumi, return gifts & accredited certification.
            </p>
            
            {/* Contact Details from Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: '#E8DED6', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Phone size={13} color="var(--color-honey)" />
                <span>Call: {contactPhone}</span>
              </div>
              <a 
                href={`https://wa.me/${whatsappNum}?text=Hello%20Tishaya%20Petal%20%26%20Loop!%20I%20have%20an%20order%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
              >
                <MessageCircle size={13} color="#25D366" />
                <span>WhatsApp: +91 {whatsappNum}</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Mail size={13} color="var(--color-honey)" />
                <span>{contactEmail}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <MapPin size={13} color="var(--color-honey)" />
                <span>{address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Clock size={13} color="var(--color-honey)" />
                <span>{supportHours}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-honey)', backgroundColor: 'rgba(217,155,67,0.15)', padding: '0.25rem 0.65rem', borderRadius: '999px', fontWeight: 700 }}>
                ★ 5.0/5 Google Verified Customer Rating
              </span>
            </div>
          </div>

          {/* Disciplines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: 0 }}>
              Disciplines
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: '#D8CCC4' }}>
              <div>Amigurumi Plushies</div>
              <div>Wearable Cardigans</div>
              <div>Granny Squares</div>
              <div>Home Plant Hangers</div>
              <div>Beginner Stitch Lab</div>
            </div>
          </div>

          {/* Certification Guild */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} color="var(--color-honey)" />
              Artisan Certification
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#D8CCC4', margin: 0, lineHeight: 1.5 }}>
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
                style={{ color: 'var(--color-honey)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-block' }}
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
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-block' }}
              >
                View Packages & Enroll
              </a>
            </div>
          </div>

          {/* Stitch Cheat Sheet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: 0 }}>
              Stitch Quick Key
            </h4>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', color: '#D8CCC4', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>US Single Crochet (SC)</span>
                <strong style={{ color: 'var(--color-honey)' }}>= UK Double</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>US Double Crochet (DC)</span>
                <strong style={{ color: 'var(--color-honey)' }}>= UK Treble</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Magic Ring (MR)</span>
                <strong style={{ color: 'var(--color-sage)' }}>= Zero Gap</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Invisible Decrease</span>
                <strong style={{ color: 'var(--color-primary)' }}>= Front Loops</strong>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 {companyName}. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Handcrafted with <Heart size={14} color="var(--color-primary)" fill="var(--color-primary)" /> for artisans.
          </span>
        </div>

      </div>
    </footer>
  );
}
