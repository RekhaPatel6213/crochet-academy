import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, ChevronRight, Home as HomeIcon, 
  Sparkles, Layers, Video, Filter, CheckCircle2 
} from 'lucide-react';
import CourseCard from './CourseCard';

export default function MasterclassesPage({
  courses = [],
  categories = [],
  userStatus = {},
  onSelectCourse,
  onBackToHome,
  onNavigate,
  settings
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCat = selectedCategoryId === 'All' || c.categoryId === selectedCategoryId;
      const matchesLevel = levelFilter === 'All' || (c.level && c.level.toLowerCase().includes(levelFilter.toLowerCase()));
      const matchesSearch = !searchQuery.trim() || 
        (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.summary && c.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.categoryId && c.categoryId.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesLevel && matchesSearch;
    });
  }, [courses, selectedCategoryId, levelFilter, searchQuery]);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', paddingBottom: '5rem' }}>
      
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(74, 124, 89, 0.08) 0%, rgba(250, 247, 242, 0.4) 100%)',
        borderBottom: '1px solid rgba(44, 34, 30, 0.06)',
        paddingTop: '2.5rem',
        paddingBottom: '2.5rem'
      }}>
        <div className="container">
          
          {/* Breadcrumb Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem'
          }}>
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/');
                else if (onBackToHome) onBackToHome();
              }}
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <HomeIcon size={14} />
              <span>Home</span>
            </a>
            <ChevronRight size={13} style={{ opacity: 0.6 }} />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              All Crochet Masterclasses
            </span>
          </div>

          <div style={{ maxWidth: '800px' }}>
            <span 
              className="badge badge-sage" 
              style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Video size={13} />
              <span>Video & Illustrated Guides</span>
            </span>
            <h1 style={{
              fontSize: '2.75rem',
              color: 'var(--color-espresso)',
              margin: '0 0 0.85rem',
              lineHeight: 1.15,
              fontWeight: 700
            }}>
              All Crochet Masterclasses
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0
            }}>
              Master new crochet stitches, techniques, and projects with comprehensive step-by-step masterclasses. Track your progress across video lessons, photo instructions, and materials checklists.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            
            {/* Search Input */}
            <div className="search-box-wrapper" style={{ width: '100%', maxWidth: '380px' }}>
              <Search size={16} className="search-icon-pos" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, stitches or yarn..."
                className="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-subtle)',
                    fontWeight: 700
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Level Selector Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                Level:
              </span>
              <div className="filter-pills">
                {['All', 'Beginner', 'Intermediate'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={`pill-btn ${levelFilter === lvl ? 'active' : ''}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                Discipline:
              </span>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(44, 34, 30, 0.15)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Disciplines ({courses.length})</option>
                {categories.map((cat) => {
                  const count = courses.filter(c => c.categoryId === cat.id).length;
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.title} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

          </div>

          {/* Quick Stats bar */}
          <div style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <span>
              Showing <strong>{filteredCourses.length}</strong> of {courses.length} Masterclasses
              {(searchQuery || levelFilter !== 'All' || selectedCategoryId !== 'All') && (
                <button
                  onClick={() => { setSearchQuery(''); setLevelFilter('All'); setSelectedCategoryId('All'); }}
                  style={{
                    marginLeft: '0.75rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Reset all filters
                </button>
              )}
            </span>

            <button
              onClick={() => onNavigate ? onNavigate('/categories') : null}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Explore Curriculums by Discipline</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Courses Grid Section */}
      <section style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          
          {filteredCourses.length > 0 ? (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id}
                  course={course}
                  completedSteps={userStatus?.completedSteps?.[course.id] || []}
                  onSelectCourse={onSelectCourse}
                />
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '4rem 1.5rem',
              textAlign: 'center',
              border: '1px dashed rgba(44, 34, 30, 0.15)',
              maxWidth: '560px',
              margin: '0 auto'
            }}>
              <BookOpen size={42} color="var(--color-primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-espresso)', margin: '0 0 0.5rem' }}>
                No masterclasses match your filters
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                We could not find any project matching "{searchQuery || levelFilter || selectedCategoryId}". Try searching with different terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryId('All');
                  setSearchQuery('');
                  setLevelFilter('All');
                }}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem' }}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Bottom Help & Navigation Card */}
          <div style={{
            marginTop: '4rem',
            background: 'linear-gradient(135deg, #FFFDFB 0%, #F5EDE6 100%)',
            border: '1px solid rgba(44, 34, 30, 0.08)',
            borderRadius: '20px',
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ maxWidth: '620px' }}>
              <span className="badge badge-honey" style={{ marginBottom: '0.5rem' }}>
                Structured Learning Paths
              </span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-espresso)', margin: '0 0 0.5rem' }}>
                Want to learn by craft discipline instead?
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                Explore our full curriculums for Amigurumi, Wearable Garments, Beginner Stitch Lab, Granny Squares, and Lace Mastery with dedicated photo guides.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate ? onNavigate('/categories') : null}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                View All Disciplines →
              </button>
              <button
                onClick={() => onNavigate ? onNavigate('/shop') : null}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
              >
                Visit Handcrafted Shop
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
