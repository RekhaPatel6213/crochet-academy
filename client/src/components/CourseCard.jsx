import React from 'react';
import { PlayCircle, Clock, BookOpen, Star, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CourseCard({ course, onSelectCourse, completedSteps = [] }) {
  const totalSteps = course.steps?.length || 0;
  const completedCount = completedSteps.length;
  const isCompleted = totalSteps > 0 && completedCount === totalSteps;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="course-card">
      
      {/* Thumbnail area */}
      <div className="course-thumb-box">
        <img 
          src={course.coverImage} 
          alt={course.title}
          className="course-thumb-img" 
        />
        <div className="course-thumb-overlay" />
        
        {/* Top Badges */}
        <div className="course-top-tags">
          <span className="tag-badge">
            {course.level}
          </span>
          <span className="tag-badge tag-badge-primary">
            {course.package}
          </span>
        </div>

        {/* Bottom meta stats */}
        <div className="course-bottom-meta">
          <span className="meta-chip">
            <Clock size={13} color="var(--color-honey)" />
            {course.duration}
          </span>
          <span className="meta-chip">
            <Star size={13} color="var(--color-honey)" fill="var(--color-honey)" />
            {course.rating} ({course.reviewsCount})
          </span>
        </div>
      </div>

      {/* Card Content body */}
      <div className="course-card-body">
        <div>
          <div className="course-category-tag">
            {course.categoryId.replace('-', ' ')}
          </div>
          <h3 className="course-card-title">
            {course.title}
          </h3>
          <p className="course-card-summary">
            {course.summary}
          </p>

          {/* Quick specs */}
          <div className="course-specs-row">
            <span className="spec-pill">
              <BookOpen size={14} color="var(--color-sage)" />
              {course.steps?.length || 0} Steps
            </span>
            <span className="spec-pill">
              <PlayCircle size={14} color="var(--color-primary)" />
              Video + Photos
            </span>
          </div>
        </div>

        {/* Progress or Button */}
        <div>
          {totalSteps > 0 && (
            <div className="progress-bar-wrap">
              <div className="progress-bar-label">
                <span>Progress ({completedCount}/{totalSteps} steps)</span>
                <span style={{ color: 'var(--color-primary)' }}>{progressPercent}%</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={() => onSelectCourse(course)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px' }}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} />
                <span>Review Masterclass</span>
              </>
            ) : (
              <>
                <PlayCircle size={16} />
                <span>Start Step-by-Step Class</span>
              </>
            )}
            <ChevronRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
