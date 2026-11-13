import React from 'react';
import { useScoreAnimation } from '../js/useScoreAnimation';

export const StatsSection = () => {
  const [valSandboxes, refSandboxes] = useScoreAnimation(1240, 1600, 0);
  const [valClearance, refClearance] = useScoreAnimation(86, 1400, 0);
  const [valHiring, refHiring] = useScoreAnimation(4.2, 1500, 1);
  const [valDrives, refDrives] = useScoreAnimation(40, 1300, 0);

  const stats = [
    {
      ref: refSandboxes,
      number: `${valSandboxes.toLocaleString()}+`,
      title: 'Students Assessed',
      sub: 'Across 6 engineering branches.'
    },
    {
      ref: refClearance,
      number: `${valClearance}%`,
      title: 'Test Pass Rate',
      sub: 'Average score on benchmark tests.'
    },
    {
      ref: refHiring,
      number: `${valHiring}x`,
      title: 'Faster Shortlisting',
      sub: 'Recruiters filter by test score.'
    },
    {
      ref: refDrives,
      number: `${valDrives}+`,
      title: 'Campus Placement Drives',
      sub: 'Active recruitment rounds hosted.'
    },
  ];

  return (
    <section className="stats-strip-section reveal-on-scroll">
      <div className="stats-strip-container">
        {stats.map((s, idx) => (
          <div key={idx} className="stat-strip-card" ref={s.ref}>
            <div className="stat-strip-number">{s.number}</div>
            <div className="stat-strip-title">{s.title}</div>
            <div className="stat-strip-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
