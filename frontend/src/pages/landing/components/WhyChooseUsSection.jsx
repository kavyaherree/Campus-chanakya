import React, { useState } from 'react';
import { Check, ArrowRight, Filter, TrendingUp, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhyChooseUsSection = ({ onOpenDemo }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(1);

  const funnelStages = [
    {
      step: '01',
      title: 'Enrolled Engineering Candidates',
      count: '1,420',
      totalPct: 100,
      stageRetention: '100%',
      color: '#0f172a',
      criteria: 'Registered across CS, IT, ECE, EEE and Mech departments.',
      avgDuration: 'Day 0',
      tag: 'Candidate Pool'
    },
    {
      step: '02',
      title: 'Cleared Automated Coding Benchmarks',
      count: '1,180',
      totalPct: 83.1,
      stageRetention: '83.1% Conversion',
      color: '#059669',
      criteria: 'Passed >=80% automated unit tests in OpenJDK 21 sandbox.',
      avgDuration: '2.8 Days Avg',
      tag: 'Verified Skill'
    },
    {
      step: '03',
      title: 'Alumni Reviewed & Project Endorsed',
      count: '890',
      totalPct: 62.7,
      stageRetention: '75.4% Retention',
      color: '#0284c7',
      criteria: 'Code architecture and OOP design validated via PR mock rounds.',
      avgDuration: '5.2 Days Avg',
      tag: 'Industry Proof'
    },
    {
      step: '04',
      title: 'Shortlisted for Corporate Drives',
      count: '640',
      totalPct: 45.1,
      stageRetention: '71.9% Retention',
      color: '#7c3aed',
      criteria: 'Matched company CGPA cutoffs and ATS skill criteria.',
      avgDuration: '8.4 Days Avg',
      tag: 'Drive Shortlist'
    },
    {
      step: '05',
      title: 'Placement Offers Confirmed',
      count: '412',
      totalPct: 29.0,
      stageRetention: '64.4% Offer Rate',
      color: '#059669',
      criteria: 'Dual offers recorded: 68 students. Median CTC: 10.8 LPA.',
      avgDuration: '14.0 Days Avg',
      tag: 'Hired & Placed'
    },
  ];

  const activeStage = funnelStages[activeStageIndex];

  const points = [
    {
      title: 'Objective automated test evaluations',
      desc: 'Students are evaluated by compiler output, unit tests, and runtime constraints, removing resume subjectivity.'
    },
    {
      title: 'Zero false-positive anti-cheat sandbox',
      desc: 'Keystroke timing telemetry and clipboard monitoring ensure test results are 100% authentic and trustworthy.'
    },
    {
      title: 'Direct alumni mock interviews & referrals',
      desc: 'Working graduates review student projects, conduct mock viva rounds, and refer verified performers to hiring managers.'
    }
  ];

  return (
    <section className="talent-spotlight-section reveal-on-scroll" id="why-us">
      <div className="talent-spotlight-container">
        
        {/* Left Side: 10/10 Cohort Placement Funnel Graph */}
        <div className="spotlight-visual-col">
          <div className="spotlight-card-frame" style={{ background: '#ffffff', padding: '1.75rem', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            
            {/* Funnel Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Filter size={15} color="#059669" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Campus Placement Funnel
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  End-to-end conversion pipeline · 2026 Graduating Batch
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontWeight: 700 }}>
                1,420 Candidates
              </span>
            </div>

            {/* Stepped Conversion Funnel Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {funnelStages.map((stage, i) => {
                const isSelected = i === activeStageIndex;
                return (
                  <div 
                    key={i} 
                    onClick={() => setActiveStageIndex(i)}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.35rem', 
                      cursor: 'pointer',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      background: isSelected ? '#f8fafc' : 'transparent',
                      border: isSelected ? '1px solid #cbd5e1' : '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.76rem', color: '#334155' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8' }}>{stage.step}</span>
                        <span style={{ fontWeight: isSelected ? 800 : 600, color: isSelected ? '#0f172a' : '#334155' }}>
                          {stage.title}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                          {stage.stageRetention}
                        </span>
                        <strong style={{ fontSize: '0.82rem', color: stage.color, fontVariantNumeric: 'tabular-nums' }}>
                          {stage.count}
                        </strong>
                      </div>
                    </div>

                    {/* Funnel Progress Track */}
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${stage.totalPct}%`, 
                          height: '100%', 
                          background: stage.color, 
                          borderRadius: '9999px',
                          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Stage Deep-Dive Inspector */}
            {activeStage && (
              <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Stage {activeStage.step}: {activeStage.tag}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                    Velocity: {activeStage.avgDuration}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
                  {activeStage.criteria}
                </p>
              </div>
            )}

            {/* Funnel Footer Summary KPIs */}
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem', fontSize: '0.76rem', color: '#64748b' }}>
              <span>Median Time to Offer: <strong style={{ color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>14 Days</strong></span>
              <span>Placement Rate: <strong style={{ color: '#059669', fontVariantNumeric: 'tabular-nums' }}>94.2%</strong></span>
            </div>

          </div>
        </div>

        {/* Right Side: Clean Structured Copy */}
        <div className="spotlight-content-col">
          <div className="spotlight-header">
            <span className="section-eyebrow">PLACEMENT OUTCOMES</span>
            <h2 className="section-heading">Data-driven campus recruitment</h2>
            <p className="spotlight-lead">
              A transparent, measurable pipeline that helps colleges prepare candidates and companies hire verified talent.
            </p>
          </div>

          <div className="spotlight-points-list">
            {points.map((pt, idx) => (
              <div key={idx} className="spotlight-point-item">
                <div className="point-check-circle">
                  <Check size={16} color="#059669" />
                </div>
                <div className="point-text">
                  <h4 className="point-title">{pt.title}</h4>
                  <p className="point-desc">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="spotlight-actions">
            <Link to="/login" className="btn-hero-primary">
              <span>Explore Recruiter Benchmarks</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsSection;

