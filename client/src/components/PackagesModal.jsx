import React, { useState } from 'react';
import { X, Check, Sparkles, Award, ShieldCheck, CreditCard, Lock, ArrowLeft } from 'lucide-react';

export default function PackagesModal({ 
  packages = [], 
  userStatus, 
  onClose, 
  onEnrollSuccess,
  isPage = false
}) {
  const [selectedPkg, setSelectedPkg] = useState(packages[1] || packages[0]);
  const [studentName, setStudentName] = useState(userStatus?.studentName || '');
  const [studentEmail, setStudentEmail] = useState(userStatus?.studentEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      alert("Please enter your name and email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/packages/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPkg.id,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setPurchaseSuccess(data);
        if (onEnrollSuccess) onEnrollSuccess(data);
      } else {
        alert(data.message || "Failed to complete enrollment");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Error completing enrollment. Check server connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => (
    <div>
      {purchaseSuccess ? (
        /* Purchase Confirmation */
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--border-subtle)', textAlign: 'center', maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-sage-light)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Check size={32} strokeWidth={3} />
          </div>
          <span className="badge badge-sage" style={{ marginBottom: '0.75rem' }}>
            Order Confirmed
          </span>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Welcome to the Guild, {studentName}!
          </h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Your enrollment in <strong style={{ color: 'var(--text-main)' }}>{purchaseSuccess.package?.name}</strong> is now active. All masterclasses, step guides, and the 80% MCQ certification have been unlocked.
          </p>

          <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.82rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Package:</span>
              <strong>{purchaseSuccess.package?.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Enrolled Name:</span>
              <strong>{studentName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Certification Status:</span>
              <strong style={{ color: 'var(--color-sage)' }}>Unlocked (80% Exam)</strong>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            Start Learning Now →
          </button>
        </div>
      ) : (
        <>
          {/* Packages Tiers Grid */}
          <div className="packages-tier-grid">
            {packages.map((pkg) => {
              const isSelected = selectedPkg?.id === pkg.id;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`package-card ${isSelected ? 'selected' : ''}`}
                >
                  {pkg.badge && (
                    <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.75rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.25rem', margin: 0 }}>
                        {pkg.name}
                      </h4>
                    </div>

                    <p style={{ fontSize: '0.78rem', marginBottom: '1rem' }}>
                      {pkg.tagline}
                    </p>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <span className="package-price-number">
                        ${pkg.price}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                        / {pkg.billing}
                      </span>
                    </div>

                    {pkg.includesCertification && (
                      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-honey-light)', border: '1px solid rgba(217,155,67,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#9E7333', fontWeight: 700, marginBottom: '1rem' }}>
                        <Award size={16} />
                        <span>Includes 80% MCQ Certification</span>
                      </div>
                    )}

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                      {pkg.features.map((feat, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <Check size={14} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.82rem' }}
                  >
                    {isSelected ? 'Selected Plan ✓' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Checkout Card Form */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                  Complete Registration for {selectedPkg?.name}
                </h3>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 800, color: selectedPkg?.price === 0 ? 'var(--color-sage)' : 'var(--color-primary)' }}>
                Total: {selectedPkg?.price === 0 ? 'FREE ($0)' : `$${selectedPkg?.price} USD`}
              </div>
            </div>

            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Student Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Clara Vance"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <input 
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="clara@example.com"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ padding: '0.65rem 1rem', backgroundColor: 'var(--bg-canvas)', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color="var(--color-sage)" />
                  {selectedPkg?.price === 0 ? '100% Free Forever • No Credit Card Required' : 'Simulated 256-Bit SSL Instant Verification (No real charge)'}
                </span>
                <strong style={{ color: selectedPkg?.price === 0 ? 'var(--color-sage)' : 'var(--text-main)' }}>
                  {selectedPkg?.price === 0 ? 'Free Access' : 'Instant Access'}
                </strong>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn ${selectedPkg?.price === 0 ? 'btn-sage' : 'btn-primary'}`}
                style={{ padding: '0.85rem', fontSize: '1rem', width: '100%' }}
              >
                {isSubmitting ? "Activating..." : (selectedPkg?.price === 0 ? `Enroll for Free in ${selectedPkg?.name} ($0)` : `Confirm & Unlock ${selectedPkg?.name} ($${selectedPkg?.price})`)}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );

  // If rendered as a standalone dedicated page
  if (isPage) {
    return (
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); onClose(); }} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Home</a>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Crochet Membership Packages</span>
          </div>
        </div>

        {/* Page Card */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '2rem 2.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(135deg, #FAF7F2 0%, #FFFFFF 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-terracotta" style={{ fontSize: '0.75rem' }}>
                Lifetime Guild Access
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-sage)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} /> 100% Satisfaction Guarantee
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', margin: '0.2rem 0 0.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
              Choose Your Crochet Mastery Package
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Unlock step-by-step masterclasses, downloadable PDF pattern blueprints, and verified artisan credentials.
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  // Modal mode
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '1180px' }}>
        
        {/* Header */}
        <div className="modal-header-bar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-terracotta" style={{ fontSize: '0.72rem' }}>
                Lifetime Guild Access
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-sage)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} /> 100% Satisfaction Guarantee
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', margin: '0.25rem 0 0' }}>
              Choose Your Crochet Mastery Package
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem' }}>
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
