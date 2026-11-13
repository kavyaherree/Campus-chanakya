import React, { useState } from 'react';
import { HERO_PRESETS } from '../js/landing_helpers';
import { Lightbulb, Code2, Terminal, Play } from 'lucide-react';

export const ConceptStudioSection = () => {
  const [activePreset, setActivePreset] = useState('diagnostic');
  const preset = HERO_PRESETS[activePreset];

  return (
    <section id="concept" style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>Multi-Agent Feedback Architecture</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>Autonomous Diagnostic & Verification Engine</h2>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActivePreset('diagnostic')} style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', background: activePreset === 'diagnostic' ? '#06b6d4' : '#090d16', color: activePreset === 'diagnostic' ? '#020617' : '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 700, cursor: 'pointer' }}>
          Remediation Loop (&lt; 70%)
        </button>
        <button onClick={() => setActivePreset('proctored')} style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', background: activePreset === 'proctored' ? '#06b6d4' : '#090d16', color: activePreset === 'proctored' ? '#020617' : '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 700, cursor: 'pointer' }}>
          Proctored Verification (≥ 70%)
        </button>
      </div>

      <div style={{ background: '#090d16', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '1rem', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
          <Lightbulb size={18} /> Intuitive Physical Analogy
        </div>
        <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.6 }}>{preset.analogy}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {preset.nodes.map((n, i) => (
            <div key={i} style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 800, fontFamily: 'monospace' }}>STEP {n.step}</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem', color: '#fff' }}>{n.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
