import React from 'react';
import { Cpu, Cloud, Globe, Layers, Zap, Database, ShieldCheck } from 'lucide-react';

export const TrustedBySection = () => {
  const partners = [
    { name: 'Google', icon: Cloud },
    { name: 'Microsoft', icon: Cpu },
    { name: 'Amazon', icon: Layers },
    { name: 'CGC Mohali', icon: Zap },
    { name: 'Capgemini', icon: Database },
    { name: 'Infosys', icon: Globe },
    { name: 'TCS', icon: ShieldCheck },
  ];

  return (
    <section className="trusted-section reveal-on-scroll">
      <div className="trusted-title">
        TRUSTED BY LEADING TECH ENTERPRISES & ACADEMIC INSTITUTIONS
      </div>
      <div className="trusted-logos-grid">
        {partners.map((partner, idx) => {
          const IconComp = partner.icon;
          return (
            <div key={idx} className={`logo-item reveal-on-scroll reveal-stagger-${(idx % 4) + 1}`}>
              <IconComp size={18} color="#059669" />
              <span>{partner.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
