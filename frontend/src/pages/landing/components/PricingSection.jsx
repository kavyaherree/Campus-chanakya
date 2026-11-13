import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const PricingSection = () => {
  const [activeTab, setActiveTab] = useState('student');

  const portals = [
    {
      id: 'student',
      name: 'Student Portal & Remediation',
      desc: 'Proctored testing sandboxes, anti-cheat telemetry, and autonomous Socratic remediation.',
      accessBadge: 'Institutional SSO',
      popular: false,
      buttonText: 'Enter Student Portal',
      buttonClass: 'outline',
      link: '/student',
      features: [
        'Single Sign-On (SSO) Auth',
        'Tamper-Resistant Sandbox',
        'Client Anti-Cheat Telemetry',
        'Socratic Remediation (< 7/10)'
      ]
    },
    {
      id: 'alumni',
      name: 'Competency-Gated Alumni Mentorship',
      desc: 'Connect with verified ≥70% benchmark scholars for high-impact production guidance.',
      accessBadge: 'Verified Gating',
      popular: true,
      buttonText: 'Enter Mentorship Hub',
      buttonClass: 'filled-green',
      link: '/student',
      features: [
        'Zero Cold-Outreach Spam',
        'Gated Mentorship (≥ 7/10)',
        'Enterprise Microservices Track',
        'Production Code Feedback'
      ]
    },
    {
      id: 'corporate',
      name: 'Two-Tier Recruiter Engine',
      desc: 'Skill-first sourcing engine powered by composite semantic matching & proctored scores.',
      accessBadge: 'Recruiter Match',
      popular: false,
      buttonText: 'Enter Corporate Hub',
      buttonClass: 'outline',
      link: '/corporate',
      features: [
        'Verified-First Candidate Sourcing',
        'Resume-JD Cosine Similarity',
        'Proctored Assessment Score',
        'Zero Screening Overhead'
      ]
    }
  ];

  return (
    <section className="pricing-section" id="pricing">
      
      {/* Header & Role Switcher */}
      <div className="pricing-header-center">
        <div className="section-label">ACCESSIBLE TO ALL LEARNERS</div>
        <h2 className="section-title">Portals Designed For Every Role</h2>
        <p className="section-subtitle" style={{ margin: '0.75rem auto 0 auto' }}>
          CampusChanakya provides tailored portals for students, alumni mentors, corporate recruiters, and college admins.
        </p>

        <div className="billing-toggle-wrapper">
          <div className="toggle-pill-bg">
            <button
              className={`toggle-btn ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
            >
              Learners & Mentors
            </button>
            <button
              className={`toggle-btn ${activeTab === 'institutional' ? 'active' : ''}`}
              onClick={() => setActiveTab('institutional')}
            >
              Recruiters & Admins
            </button>
          </div>
          <span className="save-badge">100% Free for Students</span>
        </div>
      </div>

      {/* Grid: 3 Portal Cards + 1 Right Callout Banner */}
      <div className="pricing-layout-grid">
        
        {/* 3 Portal Cards Subgrid */}
        <div className="pricing-cards-subgrid">
          {portals.map((portal) => (
            <div 
              key={portal.id} 
              className={`pricing-card ${portal.popular ? 'popular' : ''}`}
            >
              {portal.popular && (
                <div className="popular-top-badge">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="plan-name">{portal.name}</h3>
                <p className="plan-desc">{portal.desc}</p>
                
                <div className="plan-price-box">
                  <span className="price-amount" style={{ fontSize: '1.8rem', color: '#00e676' }}>
                    {portal.accessBadge}
                  </span>
                </div>

                <ul className="plan-features-list">
                  {portal.features.map((feat, i) => (
                    <li key={i} className="feature-li">
                      <Check size={14} color="#00e676" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                to={portal.link} 
                className={`btn-plan-select ${portal.buttonClass}`}
              >
                <span>{portal.buttonText} →</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Right Callout Banner Card */}
        <div className="pricing-callout-card">
          <div>
            <div className="callout-label">JOIN CAMPUSCHANAKYA TODAY</div>
            <h3 className="callout-title">
              Ready to Transform Your Educational Journey?
            </h3>
            <p className="callout-desc">
              Bridge the campus-to-corporate gap with verified coding execution, Socratic remediation, and alumni endorsements.
            </p>
          </div>

          <div>
            <Link to="/login" className="btn-get-started" style={{ width: '100%', justifyContent: 'center' }}>
              <span>Get Started Today</span>
              <ArrowRight size={16} />
            </Link>

            <div className="callout-doodle">
              Capability First, Hiring Simplified
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
