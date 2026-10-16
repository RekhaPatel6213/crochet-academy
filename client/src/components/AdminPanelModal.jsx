import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Video, Layers, Sparkles, 
  CheckCircle2, FolderPlus, Film, ListOrdered, Image, Clock, ShieldAlert
} from 'lucide-react';

export default function AdminPanelModal({ 
  categories, 
  courses, 
  onClose, 
  onRefreshData 
}) {
  const [activeTab, setActiveTab] = useState('new-course'); // 'new-course' | 'new-category' | 'manage-courses' | 'manage-categories'
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New Category State
  const [catForm, setCatForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    badge: 'New',
    accent: '#C86D51',
    iconName: 'Sparkles',
    difficulty: 'All Levels',
    coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
  });

  // New Course State
  const [courseForm, setCourseForm] = useState({
    title: '',
    categoryId: categories[0]?.id || 'amigurumi',
    level: 'Beginner Friendly',
    duration: '35 mins',
    package: 'Free',
    summary: '',
    coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=z5cKzWdOaI4',
    materialsText: "Worsted Weight Cotton Yarn (Color A & B)\n4.0mm Crochet Hook\nYarn needle & stitch markers\nFiberfill stuffing",
    steps: [
      {
        stepNumber: 1,
        title: "Magic Ring & First Round",
        timestamp: "00:45",
        stitchFormula: "Round 1: 6 SC in MR [6]",
        instruction: "Make an adjustable magic ring and crochet 6 single crochets into the loop. Cinch tight.",
        proTip: "Keep your tension uniform for easy insertion on Round 2.",
        diagram: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
      },
      {
        stepNumber: 2,
        title: "Increases & Shaping",
        timestamp: "04:10",
        stitchFormula: "Round 2: INC in each st around [12]",
        instruction: "Work 2 single crochets into each stitch of the previous round to double your stitch count.",
        proTip: "Place a locking stitch marker in the last stitch of each round.",
        diagram: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
      }
    ]
  });

  // Add step handler
  const handleAddStep = () => {
    setCourseForm(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          stepNumber: prev.steps.length + 1,
          title: `Step ${prev.steps.length + 1}`,
          timestamp: `0${prev.steps.length + 2}:00`,
          stitchFormula: "",
          instruction: "",
          proTip: "",
          diagram: prev.coverImage || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
        }
      ]
    }));
  };

  // Remove step handler
  const handleRemoveStep = (index) => {
    if (courseForm.steps.length <= 1) {
      alert("At least one step is required.");
      return;
    }
    setCourseForm(prev => {
      const updated = prev.steps.filter((_, i) => i !== index).map((s, idx) => ({
        ...s,
        stepNumber: idx + 1
      }));
      return { ...prev, steps: updated };
    });
  };

  // Update step field
  const handleUpdateStep = (index, field, value) => {
    setCourseForm(prev => {
      const updated = [...prev.steps];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, steps: updated };
    });
  };

  // Submit Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Category "${catForm.title}" created successfully!` });
        setCatForm({
          title: '',
          subtitle: '',
          description: '',
          badge: 'New',
          accent: '#C86D51',
          iconName: 'Sparkles',
          difficulty: 'All Levels',
          coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
        });
        if (onRefreshData) onRefreshData();
      } else {
        setFeedback({ type: 'error', message: data.message || "Failed to create category." });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: "Server connection error." });
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete category "${title}" and all its classes?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Category "${title}" deleted.` });
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      alert("Error deleting category");
    }
  };

  // Submit Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const materialsList = courseForm.materialsText
        .split('\n')
        .map(m => m.trim())
        .filter(Boolean);

      const payload = {
        ...courseForm,
        materials: materialsList
      };

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Crochet Class "${courseForm.title}" created with ${courseForm.steps.length} steps!` });
        // Reset form
        setCourseForm(prev => ({
          ...prev,
          title: '',
          summary: '',
          steps: [
            {
              stepNumber: 1,
              title: "Foundation & First Round",
              timestamp: "00:00",
              stitchFormula: "",
              instruction: "",
              proTip: "",
              diagram: prev.coverImage
            }
          ]
        }));
        if (onRefreshData) onRefreshData();
      } else {
        setFeedback({ type: 'error', message: data.message || "Failed to create class." });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: "Server connection error." });
    } finally {
      setLoading(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Delete crochet class "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Class "${title}" deleted.` });
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      alert("Error deleting class");
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '1100px' }}>
        
        {/* Admin Header */}
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/logo.png" 
              alt="Petal & Loop" 
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-primary)' }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="badge badge-terracotta" style={{ fontSize: '0.7rem' }}>
                  Instructor Studio
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Admin Control Panel
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: '0.1rem 0 0' }}>
                Manage Categories, Videos & Step-by-Step Classes
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

        {/* Tab Selection */}
        <div className="modal-tabs-row">
          <div className="tab-group">
            <button
              onClick={() => { setActiveTab('new-course'); setFeedback(null); }}
              className={`tab-btn ${activeTab === 'new-course' ? 'active' : ''}`}
            >
              <Plus size={14} />
              Add New Crochet Class (Step Builder)
            </button>
            <button
              onClick={() => { setActiveTab('new-category'); setFeedback(null); }}
              className={`tab-btn ${activeTab === 'new-category' ? 'active' : ''}`}
            >
              <FolderPlus size={14} />
              Add New Category
            </button>
            <button
              onClick={() => { setActiveTab('manage-courses'); setFeedback(null); }}
              className={`tab-btn ${activeTab === 'manage-courses' ? 'active' : ''}`}
            >
              <Film size={14} />
              All Classes ({courses.length})
            </button>
            <button
              onClick={() => { setActiveTab('manage-categories'); setFeedback(null); }}
              className={`tab-btn ${activeTab === 'manage-categories' ? 'active' : ''}`}
            >
              <Layers size={14} />
              All Categories ({categories.length})
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div 
            style={{ 
              margin: '1.25rem 1.75rem 0', 
              padding: '0.85rem 1.25rem', 
              borderRadius: '12px', 
              fontSize: '0.88rem', 
              fontWeight: 600,
              backgroundColor: feedback.type === 'success' ? 'var(--color-sage-light)' : 'var(--color-primary-light)',
              color: feedback.type === 'success' ? 'var(--color-sage)' : 'var(--color-primary)',
              border: `1px solid ${feedback.type === 'success' ? 'rgba(107,142,123,0.3)' : 'rgba(200,109,81,0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab 1: Add New Crochet Class */}
        <div style={{ padding: '1.75rem' }}>
          {activeTab === 'new-course' && (
            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Section 1: Basic Information */}
              <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Film size={18} color="var(--color-primary)" />
                  1. Project & Video Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Class Title *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Chubby Strawberry Amigurumi"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Category *
                    </label>
                    <select
                      value={courseForm.categoryId}
                      onChange={(e) => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Difficulty Level
                    </label>
                    <select
                      value={courseForm.level}
                      onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Beginner Friendly">Beginner Friendly</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Duration
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 40 mins"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Package Requirement
                    </label>
                    <select
                      value={courseForm.package}
                      onChange={(e) => setCourseForm({ ...courseForm, package: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Free">Free</option>
                      <option value="Starter">Starter</option>
                      <option value="Artisan">Artisan</option>
                      <option value="Master">Master</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      YouTube Video URL (Standard link or embed) *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={courseForm.videoUrl}
                      onChange={(e) => setCourseForm({ ...courseForm, videoUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Cover Image URL *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={courseForm.coverImage}
                      onChange={(e) => setCourseForm({ ...courseForm, coverImage: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Project Description / Summary *
                  </label>
                  <textarea 
                    rows={2}
                    required
                    placeholder="Brief overview of what students will crochet..."
                    value={courseForm.summary}
                    onChange={(e) => setCourseForm({ ...courseForm, summary: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Section 2: Materials */}
              <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                  2. Required Materials (One per line)
                </h3>
                <textarea 
                  rows={3}
                  value={courseForm.materialsText}
                  onChange={(e) => setCourseForm({ ...courseForm, materialsText: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              {/* Section 3: Step-by-Step Builder */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ListOrdered size={20} color="var(--color-primary)" />
                      3. Step-by-Step Guide Builder ({courseForm.steps.length} Steps)
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                      Define video timestamps, row-by-row formulas, and instructions with photos for each step.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                  >
                    <Plus size={15} /> Add Another Step
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {courseForm.steps.map((st, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        border: '1px solid var(--border-subtle)', 
                        borderRadius: '14px', 
                        padding: '1.25rem', 
                        backgroundColor: 'var(--bg-card-warm)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {idx + 1}
                          </span>
                          <strong style={{ fontSize: '0.95rem' }}>Step {idx + 1}</strong>
                        </div>

                        {courseForm.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="btn btn-secondary"
                            style={{ color: 'var(--color-primary)', padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          >
                            <Trash2 size={14} /> Remove Step
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Step Title *
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Magic Ring & First 6 Stitches"
                            value={st.title}
                            onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Video Timestamp Bookmark (e.g. 02:15)
                          </label>
                          <input 
                            type="text"
                            placeholder="01:30"
                            value={st.timestamp}
                            onChange={(e) => handleUpdateStep(idx, 'timestamp', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.85rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                          Stitch Formula / Pattern Notation
                        </label>
                        <input 
                          type="text"
                          placeholder="e.g. Round 1: 6 SC in MR [6] | Round 2: INC in each [12]"
                          value={st.stitchFormula}
                          onChange={(e) => handleUpdateStep(idx, 'stitchFormula', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', fontFamily: 'monospace' }}
                        />
                      </div>

                      <div style={{ marginBottom: '0.85rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                          Step Instructions *
                        </label>
                        <textarea 
                          rows={2}
                          required
                          placeholder="Detailed description of what the hands and hook do..."
                          value={st.instruction}
                          onChange={(e) => handleUpdateStep(idx, 'instruction', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Pro Tip (Optional)
                          </label>
                          <input 
                            type="text"
                            placeholder="e.g. Count your 'V' loops before tightening."
                            value={st.proTip}
                            onChange={(e) => handleUpdateStep(idx, 'proTip', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Step Photo / Diagram URL
                          </label>
                          <input 
                            type="text"
                            placeholder="https://..."
                            value={st.diagram}
                            onChange={(e) => handleUpdateStep(idx, 'diagram', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '0.95rem', fontSize: '1rem', width: '100%', fontWeight: 700 }}
              >
                {loading ? "Publishing Class..." : `Publish Class with ${courseForm.steps.length} Steps →`}
              </button>

            </form>
          )}

          {/* Tab 2: Add New Category */}
          {activeTab === 'new-category' && (
            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '640px', margin: '0 auto' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.75rem', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FolderPlus size={20} color="var(--color-primary)" />
                  Create New Crochet Category
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Category Title *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Tunisian Crochet & Lace"
                      value={catForm.title}
                      onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Subtitle / Tagline
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Woven textures & delicate stitches"
                      value={catForm.subtitle}
                      onChange={(e) => setCatForm({ ...catForm, subtitle: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Badge Pill (e.g. New, Popular)
                      </label>
                      <input 
                        type="text"
                        value={catForm.badge}
                        onChange={(e) => setCatForm({ ...catForm, badge: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Accent Theme Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="color"
                          value={catForm.accent}
                          onChange={(e) => setCatForm({ ...catForm, accent: e.target.value })}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{catForm.accent}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Cover Image URL
                    </label>
                    <input 
                      type="text"
                      value={catForm.coverImage}
                      onChange={(e) => setCatForm({ ...catForm, coverImage: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Description *
                    </label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="What techniques and concepts will students learn in this discipline?"
                      value={catForm.description}
                      onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', resize: 'vertical' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-sage"
                  style={{ marginTop: '1.5rem', width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                >
                  {loading ? "Adding Category..." : "Save Category ✓"}
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Manage Courses */}
          {activeTab === 'manage-courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                  Active Crochet Classes ({courses.length})
                </h3>
                <button
                  onClick={() => setActiveTab('new-course')}
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Add New Class
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {courses.map(c => (
                  <div 
                    key={c.id}
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '16px', 
                      padding: '1.15rem', 
                      border: '1px solid var(--border-subtle)', 
                      display: 'flex', 
                      gap: '0.85rem' 
                    }}
                  >
                    <img 
                      src={c.coverImage} 
                      alt={c.title} 
                      style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} 
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                          {c.categoryId}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', margin: '0.1rem 0 0.25rem', lineHeight: 1.25 }}>
                          {c.title}
                        </h4>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {c.steps?.length || 0} Steps • {c.duration} • {c.package}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#D32F2F', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                      >
                        <Trash2 size={13} /> Delete Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Manage Categories */}
          {activeTab === 'manage-categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                  Active Categories ({categories.length})
                </h3>
                <button
                  onClick={() => setActiveTab('new-category')}
                  className="btn btn-sage"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {categories.map(cat => (
                  <div 
                    key={cat.id}
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '16px', 
                      padding: '1.25rem', 
                      border: '1px solid var(--border-subtle)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between', 
                      borderLeft: `5px solid ${cat.accent || 'var(--color-primary)'}` 
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span className="badge badge-terracotta" style={{ fontSize: '0.65rem' }}>
                          {cat.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {cat.projectCount} Classes
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', margin: '0.25rem 0' }}>
                        {cat.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        {cat.description}
                      </p>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.title)}
                        style={{ background: 'none', border: 'none', color: '#D32F2F', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
