import React from 'react';
import { Users, Star, Video, ArrowRight } from 'lucide-react';

export const MentorsSection = () => {
  const mentors = [
    { name: "Priyanka Nair", company: "Google", role: "Staff Software Engineer", rating: "5.0", quote: "Cold-outreach spam is eliminated. I only meet candidates with a verified ≥7/10 score, letting us focus on distributed cloud systems." },
    { name: "Vikramaditya Roy", company: "Amazon", role: "Principal Architect", rating: "5.0", quote: "No time wasted explaining textbook syntax. Every mentee has passed proctored verification, allowing high-impact production feedback." }
  ];

  return (
    <section id="mentors" style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Competency-Gated Mentorship Track</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>Verified Alumni Mentor Network (≥ 70% Gated)</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {mentors.map((m, idx) => (
          <div key={idx} style={{ background: '#090d16', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{m.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>{m.role} @ {m.company}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: 700 }}>
                <Star size={14} fill="#fbbf24" /> {m.rating}
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>"{m.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};
