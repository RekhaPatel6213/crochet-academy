import React, { useState } from 'react';
import { 
  X, Play, Video, ListOrdered, CheckCircle2, Circle, 
  Lightbulb, Scissors, BookOpen, Layers, 
  ChevronLeft, ChevronRight
} from 'lucide-react';

export default function CourseDetailModal({ 
  course, 
  onClose, 
  completedSteps = [], 
  onToggleStep 
}) {
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'video' | 'steps' | 'materials'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedMaterials, setCheckedMaterials] = useState({});

  if (!course) return null;

  const totalSteps = course.steps?.length || 0;
  const currentStep = course.steps[currentStepIndex];
  const isCurrentStepDone = completedSteps.includes(currentStep?.stepNumber);

  const toggleMaterial = (idx) => {
    setCheckedMaterials(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '960px' }}>
        
        {/* Top Header */}
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img 
              src="/logo.png" 
              alt="Petal & Loop" 
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(238, 109, 136, 0.25)' }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  {course.categoryId.replace('-', ' ')}
                </span>
                <span className="badge badge-honey" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                  {course.level}
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: '0.1rem 0 0', lineHeight: 1.2 }}>
                {course.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls Bar */}
        <div className="modal-tabs-row">
          <div className="tab-group">
            <button
              onClick={() => setActiveTab('both')}
              className={`tab-btn ${activeTab === 'both' ? 'active' : ''}`}
            >
              <Layers size={14} />
              Interactive Studio
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            >
              <Video size={14} />
              Video Masterclass
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`tab-btn ${activeTab === 'steps' ? 'active' : ''}`}
            >
              <ListOrdered size={14} />
              Step-by-Step Cards
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
            >
              <Scissors size={14} />
              Materials & Stitches
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <span>Progress: {completedSteps.length} of {totalSteps} steps completed</span>
            <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--color-sage)' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div style={{ padding: '1.75rem' }}>
          
          {/* Video Studio Section */}
          {(activeTab === 'both' || activeTab === 'video') && (
            <div className="video-player-container">
              <div className="video-ratio-box">
                <iframe
                  src={`${course.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Timestamp bookmarks row */}
              <div className="video-bookmarks-bar">
                <span style={{ color: 'var(--color-honey)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                  <Play size={14} fill="var(--color-honey)" /> Jump to Step:
                </span>
                {course.steps?.map((st, i) => (
                  <button
                    key={st.stepNumber}
                    onClick={() => {
                      setCurrentStepIndex(i);
                      if (activeTab === 'video') setActiveTab('both');
                    }}
                    className={`bookmark-pill ${currentStepIndex === i ? 'active' : ''}`}
                  >
                    <span>{st.timestamp}</span>
                    <span style={{ opacity: 0.8 }}>Step {st.stepNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Step Card */}
          {(activeTab === 'both' || activeTab === 'steps') && currentStep && (
            <div className="step-card-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span 
                    style={{ 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '12px', 
                      backgroundColor: 'var(--color-primary)', 
                      color: '#FFFFFF', 
                      fontWeight: 800, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.1rem'
                    }}
                  >
                    {currentStep.stepNumber}
                  </span>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Step {currentStep.stepNumber} of {totalSteps} • Video Mark: {currentStep.timestamp}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', margin: '0.1rem 0 0' }}>
                      {currentStep.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onToggleStep(course.id, currentStep.stepNumber)}
                  className={`btn ${isCurrentStepDone ? 'btn-sage' : 'btn-secondary'}`}
                  style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                >
                  {isCurrentStepDone ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Step Completed ✓</span>
                    </>
                  ) : (
                    <>
                      <Circle size={16} />
                      <span>Mark Step Completed</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions and diagram */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  {currentStep.stitchFormula && (
                    <div className="step-formula-box">
                      <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#9E7333', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Pattern Formula & Stitch Count
                      </span>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {currentStep.stitchFormula}
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.65 }}>
                    <strong style={{ display: 'block', marginBottom: '0.35rem' }}>Step-by-Step Instructions:</strong>
                    {currentStep.instruction}
                  </div>

                  {currentStep.proTip && (
                    <div className="step-tip-box">
                      <Lightbulb size={20} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-sage)', textTransform: 'uppercase', display: 'block' }}>
                          Artisan Pro Tip
                        </span>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                          {currentStep.proTip}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diagram / Photo preview */}
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card-subtle)' }}>
                  <img 
                    src={currentStep.diagram} 
                    alt={currentStep.title} 
                    style={{ width: '100%', height: '170px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Visual reference for tension check & stitch alignment.
                  </div>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                  className="btn btn-secondary"
                  style={{ opacity: currentStepIndex === 0 ? 0.4 : 1, padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                >
                  <ChevronLeft size={16} /> Previous Step
                </button>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {course.steps.map((st, i) => (
                    <button
                      key={st.stepNumber}
                      onClick={() => setCurrentStepIndex(i)}
                      style={{
                        width: currentStepIndex === i ? '24px' : '10px',
                        height: '10px',
                        borderRadius: '999px',
                        backgroundColor: currentStepIndex === i 
                          ? 'var(--color-primary)' 
                          : completedSteps.includes(st.stepNumber) 
                            ? 'var(--color-sage)' 
                            : 'var(--border-strong)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title={`Step ${st.stepNumber}`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentStepIndex === totalSteps - 1}
                  onClick={() => setCurrentStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                  className="btn btn-primary"
                  style={{ opacity: currentStepIndex === totalSteps - 1 ? 0.4 : 1, padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                >
                  Next Step <ChevronRight size={16} />
                </button>
              </div>

            </div>
          )}

          {/* Materials & Stitches Tab */}
          {(activeTab === 'materials' || activeTab === 'both') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Materials Checklist */}
              <div className="step-card-box" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Scissors size={18} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.15rem' }}>
                    Materials & Tools Checklist
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
                  Gather all tools before starting. Click items to check off your tray:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {course.materials?.map((mat, idx) => (
                    <div 
                      key={idx}
                      onClick={() => toggleMaterial(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        backgroundColor: checkedMaterials[idx] ? 'var(--color-sage-light)' : 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        textDecoration: checkedMaterials[idx] ? 'line-through' : 'none',
                        color: checkedMaterials[idx] ? 'var(--text-muted)' : 'var(--text-main)'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={!!checkedMaterials[idx]} 
                        onChange={() => {}}
                        style={{ accentColor: 'var(--color-sage)' }}
                      />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abbreviations Glossary */}
              <div className="step-card-box" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <BookOpen size={18} color="var(--color-sage)" />
                  <h3 style={{ fontSize: '1.15rem' }}>
                    Stitch Abbreviations Key
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
                  Universal pattern codes used throughout this project:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {course.abbreviations?.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.5rem 0', 
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.85rem' 
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                        {item.code}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
