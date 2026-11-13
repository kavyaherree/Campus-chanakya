import React from 'react';
import { SYSTEM_METRICS } from '../js/landing_helpers';

export const MetricsTrustSection = () => {
  return (
    <section style={{ background: '#090d16', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3.5rem 1.5rem', marginTop: '3rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
        {SYSTEM_METRICS.map((m, idx) => (
          <div key={idx}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.3rem', fontWeight: 600 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
