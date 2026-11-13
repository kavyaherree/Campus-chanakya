import React from 'react';
import { Compass, CheckCircle2, ChevronRight } from 'lucide-react';

export const RoadmapSection = () => {
  const milestones = [
    { week: "Phase 1", title: "SSO Auth & Proctored Baseline", desc: "Single Sign-On authentication and initial proctored sandbox benchmark with blur/paste telemetry." },
    { week: "Phase 2", title: "Multi-Agent Diagnostic Loop", desc: "Automated compiler and stack trace analysis isolating conceptual gaps when scoring under 70%." },
    { week: "Phase 3", title: "Socratic Remediation Sprint", desc: "Interactive AI tutor hints and dynamic recovery roadmaps to achieve the ≥7/10 benchmark." },
    { week: "Phase 4", title: "Gated Mentorship & Recruiter Match", desc: "Competency-gated alumni office hours and two-tier composite recruitment matchmaking." }
  ];

  return (
    <section id="roadmap" style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>Closed-Loop Mastery Cycle</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>Student Mastery & Verification Roadmap</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {milestones.map((m, idx) => (
          <div key={idx} style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800, fontFamily: 'monospace' }}>{m.week}</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{m.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
