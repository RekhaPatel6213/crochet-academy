import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, Award, AlertCircle, RotateCcw, Sparkles, Printer, ArrowLeft
} from 'lucide-react';

export default function CertificationExamModal({ 
  onClose, 
  userStatus, 
  onExamPassed,
  isPage = false
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [studentName, setStudentName] = useState(userStatus?.studentName || '');
  const [submitting, setSubmitting] = useState(false);
  const [examResult, setExamResult] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/exam/questions');
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitExam = async () => {
    if (!studentName.trim()) {
      alert("Please enter your name as you wish it to appear on your Certificate.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          studentName: studentName.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setExamResult(data);
        if (data.passed) {
          triggerConfetti();
          if (onExamPassed) onExamPassed(data.certificate);
        }
      }
    } catch (err) {
      console.error("Error submitting exam:", err);
      alert("Failed to submit exam. Please verify server connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#C86D51', '#D99B43', '#6B8E7B'] });
    fire(0.2, { spread: 60, colors: ['#C86D51', '#D99B43', '#FFFFFF'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#D99B43', '#EBF2EE'] });
  };

  const handleRetake = () => {
    setExamResult(null);
    setAnswers({});
    setCurrentIndex(0);
  };

  const printCertificate = () => {
    window.print();
  };

  const currentQ = questions[currentIndex];
  const totalCount = questions.length;
  const answeredCount = Object.keys(answers).length;

  const renderExamBody = () => (
    <div>
      {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                Loading Examination Questions...
              </p>
            </div>
          ) : examResult ? (
            /* Results Screen */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Score Banner */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2rem', border: `2px solid ${examResult.passed ? 'var(--color-sage)' : 'var(--color-primary)'}`, textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: examResult.passed ? 'var(--color-sage-light)' : 'var(--color-primary-light)', color: examResult.passed ? 'var(--color-sage)' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  {examResult.passed ? <Award size={32} /> : <AlertCircle size={32} />}
                </div>

                <span className={`badge ${examResult.passed ? 'badge-sage' : 'badge-terracotta'}`} style={{ marginBottom: '0.5rem' }}>
                  {examResult.passed ? 'Examination Passed' : 'Below 80% Threshold'}
                </span>

                <h3 style={{ fontSize: '2rem', margin: '0.35rem 0' }}>
                  {examResult.passed ? 'Congratulations, Certified Artisan!' : 'Practice Stitches & Retake!'}
                </h3>

                <p style={{ fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
                  {examResult.passed ? (
                    <>You scored <strong style={{ color: 'var(--color-sage)', fontSize: '1.1rem' }}>{examResult.score}%</strong> ({examResult.correctCount}/{examResult.totalQuestions} correct). You have earned the official certification credential!</>
                  ) : (
                    <>You scored <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>{examResult.score}%</strong> ({examResult.correctCount}/{examResult.totalQuestions} correct). An 80% score is required. Review the question diagnostics below and retake anytime.</>
                  )}
                </p>

                {examResult.passed && examResult.certificate ? (
                  <button
                    onClick={printCertificate}
                    className="btn btn-sage"
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.92rem' }}
                  >
                    <Printer size={18} />
                    <span>Print / Save Official Certificate</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRetake}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    <RotateCcw size={16} />
                    <span>Retake Examination Now</span>
                  </button>
                )}
              </div>

              {/* Certificate Canvas / View if passed */}
              {examResult.passed && examResult.certificate && (
                <div id="printable-certificate" className="certificate-frame">
                  <div className="cert-corner-tl" />
                  <div className="cert-corner-tr" />
                  <div className="cert-corner-bl" />
                  <div className="cert-corner-br" />

                  <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.1rem' }}>
                      <img 
                        src="/logo.png" 
                        alt="Petal & Loop" 
                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D99B43', boxShadow: '0 4px 12px rgba(217,155,67,0.3)' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#9E7333', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <Sparkles size={16} />
                      Petal & Loop Guild of Excellence
                      <Sparkles size={16} />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-0.02em' }}>
                      Certificate of Mastery
                    </h1>

                    <p style={{ fontStyle: 'italic', fontSize: '0.88rem' }}>
                      This hereby certifies with highest acclaim that
                    </p>

                    <div style={{ borderBottom: '2px solid rgba(217, 155, 67, 0.4)', paddingBottom: '0.35rem', margin: '0.25rem 0' }}>
                      <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', margin: 0 }}>
                        {examResult.certificate.studentName}
                      </h2>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      Has demonstrated exceptional technical mastery in crochet tension, gauge calculation, invisible decreases, modular assemblies, and pattern decryption by achieving an official examination score of <strong>{examResult.score}%</strong>.
                    </p>

                    <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(217,155,67,0.3)', display: 'flex', justifyContent: 'space-around', fontSize: '0.78rem', margin: '0.5rem 0' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Distinction</span>
                        <strong style={{ color: 'var(--color-sage)' }}>{examResult.certificate.honors}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Issue Date</span>
                        <strong>{examResult.certificate.issueDate}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Credential ID</span>
                        <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{examResult.certificate.credentialId}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700, fontSize: '1rem' }}>Evelyn Vance</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Master Artisan Director</div>
                      </div>
                      <div className="guild-seal">
                        <span>Official</span>
                        <span style={{ fontSize: '0.9rem' }}>★</span>
                        <span>Seal</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700, fontSize: '1rem' }}>Marcus Aurel</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Head of Assessment</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Explanations diagnostic review */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Question Diagnostics & Feedback:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {examResult.feedback?.map((item, idx) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: item.isCorrect ? 'var(--color-sage-light)' : 'var(--color-primary-light)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          Q{idx + 1}: {item.question}
                        </div>
                        <span className={`badge ${item.isCorrect ? 'badge-sage' : 'badge-terracotta'}`}>
                          {item.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>Explanation:</strong> {item.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Active Examination Form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Student Name banner */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Student Full Name (Appears on your credential) *
                  </label>
                  <input 
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name..."
                    style={{ width: '280px', padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Answered: <strong style={{ color: 'var(--color-primary)' }}>{answeredCount}</strong> of {totalCount}</span>
                  <div style={{ width: '130px', height: '6px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.25rem' }}>
                    <div style={{ width: `${(answeredCount / totalCount) * 100}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>
              </div>

              {/* Current Question Card */}
              {currentQ && (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      Question {currentIndex + 1} of {totalCount}
                    </span>
                    <span className="badge badge-honey">
                      Crochet Technique & Theory
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', lineHeight: 1.35 }}>
                    {currentQ.question}
                  </h3>

                  {/* Options */}
                  <div>
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = answers[currentQ.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`mcq-option-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="option-badge">
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: isSelected ? 700 : 500 }}>
                            {option}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', marginTop: '1.25rem' }}>
                    <button
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      className="btn btn-secondary"
                      style={{ opacity: currentIndex === 0 ? 0.4 : 1, padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                    >
                      ← Previous
                    </button>

                    <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
                      {questions.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: currentIndex === idx 
                              ? 'var(--color-primary)' 
                              : answers[q.id] !== undefined 
                                ? 'var(--color-sage)' 
                                : 'var(--bg-card-subtle)',
                            color: currentIndex === idx || answers[q.id] !== undefined ? '#FFFFFF' : 'var(--text-muted)'
                          }}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    {currentIndex < totalCount - 1 ? (
                      <button
                        onClick={() => setCurrentIndex(prev => Math.min(totalCount - 1, prev + 1))}
                        className="btn btn-primary"
                        style={{ padding: '0.55rem 1.15rem', fontSize: '0.82rem' }}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        disabled={submitting || answeredCount < totalCount}
                        onClick={handleSubmitExam}
                        className="btn btn-sage"
                        style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', opacity: answeredCount < totalCount ? 0.5 : 1 }}
                      >
                        {submitting ? "Evaluating..." : "Submit for Grading (80%) ✓"}
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}
    </div>
  );

  // If rendered as a standalone dedicated page (/certification or /exam)
  if (isPage) {
    return (
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem 5rem' }}>
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
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>MCQ Certification Exam</span>
          </div>
        </div>

        {/* Page Card */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(135deg, #FAF7F2 0%, #FFFFFF 100%)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--color-honey-light)', color: '#9E7333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-honey" style={{ fontSize: '0.7rem' }}>
                  Accredited Certification
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  80% Minimum Passing Score
                </span>
              </div>
              <h1 style={{ fontSize: '1.65rem', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                Official Crochet Artisan MCQ Assessment
              </h1>
            </div>
          </div>

          <div style={{ padding: '2rem' }}>
            {renderExamBody()}
          </div>
        </div>
      </div>
    );
  }

  // Modal mode
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--color-honey-light)', color: '#9E7333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-honey" style={{ fontSize: '0.7rem' }}>
                  Accredited Certification
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  80% Minimum Passing Score
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', margin: '0.15rem 0 0' }}>
                Official Crochet Artisan MCQ Assessment
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem' }}>
          {renderExamBody()}
        </div>

      </div>
    </div>
  );
}
