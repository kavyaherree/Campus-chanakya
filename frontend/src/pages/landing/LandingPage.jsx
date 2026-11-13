import React, { useState, useEffect } from 'react';
import './css/landing_page.css';

import { TopPromoBanner } from './components/TopPromoBanner';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { SolutionsSection } from './components/SolutionsSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { LivePipelineSection } from './components/LivePipelineSection';
import { InstitutionalTestimonials } from './components/InstitutionalTestimonials';
import { CampusConversionBanner } from './components/CampusConversionBanner';
import { FooterSection } from './components/FooterSection';
import { SearchModal } from './components/SearchModal';
import { DemoModal } from './components/DemoModal';
import { RegisterCollegeModal } from '../../components/RegisterCollegeModal';
import { X, ShieldCheck, ArrowRight, CheckCircle2, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [registerCollegeOpen, setRegisterCollegeOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);

  // Smooth scroll reveal animation observer with graceful fallback
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    } else {
      elements.forEach((el) => el.classList.add('is-visible'));
    }
  }, []);

  return (
    <div className="landing-page-root">
      {/* 1. Top Telemetry Announcement Strip */}
      <TopPromoBanner />

      {/* 2. Main Navigation Bar with Search and 1-Click Portals */}
      <LandingNavbar 
        onOpenSearch={() => setSearchOpen(true)} 
        onOpenDemo={() => setDemoOpen(true)} 
        onOpenRegisterCollege={() => setRegisterCollegeOpen(true)}
      />

      {/* 3. Hero Section (Interactive Bézier Track Performance Graph) */}
      <HeroSection 
        onOpenDemo={() => setDemoOpen(true)} 
        onOpenRegisterCollege={() => setRegisterCollegeOpen(true)}
      />

      {/* 4. Verified Sandboxes & Clearance Metrics Strip with Score Animation */}
      <StatsSection />

      {/* 5. Platform Pillars (Academic Rigor & Enterprise Proof) */}
      <SolutionsSection onSelectSolution={(sol) => setSelectedSolution(sol)} />

      {/* 6. Placement Funnel & Stage Telemetry */}
      <WhyChooseUsSection onOpenDemo={() => setDemoOpen(true)} />

      {/* 7. Live Proctoring & Placement Department Pipeline */}
      <LivePipelineSection onOpenDemo={() => setDemoOpen(true)} />

      {/* 8. Institutional Validation Testimonials Grid */}
      <InstitutionalTestimonials />

      {/* 9. High-Impact Campus OS Conversion Banner */}
      <CampusConversionBanner onOpenDemo={() => setDemoOpen(true)} />

      {/* 10. Footer Section */}
      <FooterSection />

      {/* Interactive Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      <RegisterCollegeModal isOpen={registerCollegeOpen} onClose={() => setRegisterCollegeOpen(false)} />

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <div className="modal-overlay" onClick={() => setSelectedSolution(null)}>
          <div 
            className="modal-content-box" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '620px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0'
            }}
          >
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedSolution(null)}
              style={{ background: '#f1f5f9', color: '#475569', borderRadius: '50%', padding: '0.4rem' }}
            >
              <X size={18} />
            </button>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', border: '1px solid #a7f3d0' }}>
              <ShieldCheck size={14} />
              <span>{selectedSolution.tag || 'Platform Pillar'}</span>
            </div>

            <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>
              {selectedSolution.title}
            </h3>

            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              {selectedSolution.desc} CampusChanakya pairs automated compiler evaluations with real-time biometric and keystroke cadence proctoring to deliver transparent, reproducible placement readiness.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code2 size={14} color="#059669" />
                <span>Academic &amp; Placement Verification Standards</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>100% Deterministic evaluation via OpenJDK 21 execution sandboxes</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>Zero false-positive anti-cheat strike tracking for tab defocus</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>Direct candidate shortlisting for verified corporate drives</span>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                onClick={() => setSelectedSolution(null)} 
                style={{
                  padding: '0.6rem 1.25rem',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedSolution(null);
                  setDemoOpen(true);
                }}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;