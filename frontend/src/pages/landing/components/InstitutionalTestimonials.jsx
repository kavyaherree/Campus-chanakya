import React from 'react';

export const InstitutionalTestimonials = () => {
  const testimonials = [
    {
      quote:
        'We shortlisted 25 candidates in under two hours based on verified coding test scores instead of reviewing hundreds of resumes.',
      name: 'Rohit Verma',
      role: 'Technical Recruiter · Acme Technologies',
      initials: 'RV',
      accentBg: '#ecfdf5',
      accentColor: '#059669'
    },
    {
      quote:
        'The practice tests highlighted exact areas to improve in data structures before my first on-campus interview.',
      name: 'Aarav Sharma',
      role: 'Final Year CSE Student (Placed at 18 LPA)',
      initials: 'AS',
      accentBg: '#f0f9ff',
      accentColor: '#0284c7'
    },
    {
      quote:
        'Our placement cell now tracks all 1,400+ students and coordinates drives with recruiters in one place.',
      name: 'Dr. S. K. Mukherjee',
      role: 'Head of Training & Placement',
      initials: 'SM',
      accentBg: '#f5f3ff',
      accentColor: '#7c3aed'
    }
  ];

  return (
    <section className="testimonials-section reveal-on-scroll">
      <div className="testimonials-container">
        
        {/* Section Header */}
        <div className="testimonials-header">
          <span className="section-eyebrow">USER FEEDBACK</span>
          <h2 className="section-heading">Used by students, recruiters, and colleges</h2>
          <p className="section-subheading">
            Straightforward feedback from people who use CampusChanakya for campus placements.
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              
              <div className="testimonial-author">
                <div 
                  className="author-avatar-circle"
                  style={{ background: t.accentBg, color: t.accentColor }}
                >
                  {t.initials}
                </div>
                <div className="author-info">
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InstitutionalTestimonials;
