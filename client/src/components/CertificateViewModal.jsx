import React from 'react';
import { X, Award, Printer, Sparkles } from 'lucide-react';

export default function CertificateViewModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '820px' }}>
        
        {/* Modal Header */}
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--color-honey)" />
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
              Verified Guild Certificate
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={handlePrint}
              className="btn btn-sage"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.45rem', borderRadius: '50%' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div style={{ padding: '2rem' }}>
          <div id="printable-certificate" className="certificate-frame">
            <div className="cert-corner-tl" />
            <div className="cert-corner-tr" />
            <div className="cert-corner-bl" />
            <div className="cert-corner-br" />

            <div style={{ maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.1rem' }}>
                <img 
                  src="/logo.png" 
                  alt="Petal & Loop" 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D99B43', boxShadow: '0 4px 12px rgba(217,155,67,0.3)' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', color: '#9E7333', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Sparkles size={15} />
                Petal & Loop Guild of Excellence
                <Sparkles size={15} />
              </div>

              <h1 style={{ fontSize: '2.4rem', margin: 0, letterSpacing: '-0.02em' }}>
                Certificate of Mastery
              </h1>

              <p style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                This credential certifies that
              </p>

              <div style={{ borderBottom: '2px solid rgba(217, 155, 67, 0.4)', paddingBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '2.1rem', color: 'var(--color-primary)', margin: 0 }}>
                  {certificate.studentName}
                </h2>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                Has successfully passed the Master Artisan Assessment with a verified score of <strong>{certificate.score}%</strong> (≥80% required) and demonstrated precision in stitch anatomy, tension calibration, and pattern assembly.
              </p>

              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(217,155,67,0.3)', display: 'flex', justifyContent: 'space-around', fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Distinction</span>
                  <strong style={{ color: 'var(--color-sage)' }}>{certificate.honors}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Issued On</span>
                  <strong>{certificate.issueDate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Verification ID</span>
                  <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{certificate.credentialId}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700, fontSize: '0.95rem' }}>Evelyn Vance</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Master Artisan Director</div>
                </div>
                <div className="guild-seal">
                  <span>Guild</span>
                  <span style={{ fontSize: '0.85rem' }}>★</span>
                  <span>Seal</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700, fontSize: '0.95rem' }}>Marcus Aurel</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Head of Assessment</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
