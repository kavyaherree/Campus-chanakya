import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, BarChart2, Award, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LivePipelineSection = ({ onOpenDemo }) => {
  // Chart view toggle: 'rate' (% placed), 'salary' (Avg LPA), 'highest' (Top LPA)
  const [metricView, setMetricView] = useState('rate');
  const [hoveredSalaryIndex, setHoveredSalaryIndex] = useState(2); // Default highlight 10-18 LPA
  const [hoveredBranchIndex, setHoveredBranchIndex] = useState(null);

  const branchData = [
    { 
      branch: 'Computer Science & Eng (CSE)', 
      code: 'CSE',
      rate: 96.4, 
      salary: 14.8, 
      highest: 44.0, 
      students: 240, 
      placed: 231,
      topRecruiter: 'Google, Acme Tech' 
    },
    { 
      branch: 'Information Technology (IT)', 
      code: 'IT',
      rate: 94.2, 
      salary: 13.5, 
      highest: 38.5, 
      students: 180, 
      placed: 170,
      topRecruiter: 'Oracle, Razorpay' 
    },
    { 
      branch: 'Electronics & Comm (ECE)', 
      code: 'ECE',
      rate: 91.0, 
      salary: 10.2, 
      highest: 28.0, 
      students: 210, 
      placed: 191,
      topRecruiter: 'Cisco, Qualcomm' 
    },
    { 
      branch: 'Electrical Engineering (EEE)', 
      code: 'EEE',
      rate: 85.6, 
      salary: 8.6, 
      highest: 22.0, 
      students: 160, 
      placed: 137,
      topRecruiter: 'Texas Instruments, L&T' 
    },
    { 
      branch: 'Mechanical Engineering (ME)', 
      code: 'ME',
      rate: 82.1, 
      salary: 7.8, 
      highest: 18.0, 
      students: 190, 
      placed: 156,
      topRecruiter: 'Tata Motors, Bosch' 
    },
  ];

  const salaryDistribution = [
    { 
      bracket: '< 6 LPA', 
      pct: 15.0, 
      count: 213, 
      color: '#94a3b8', 
      firms: 'Core & Regional Engineering',
      delta: '-2.1% YoY'
    },
    { 
      bracket: '6 - 10 LPA', 
      pct: 42.0, 
      count: 596, 
      color: '#059669', 
      firms: 'TCS Digital, Cognizant, Infosys SP',
      delta: '+3.4% YoY'
    },
    { 
      bracket: '10 - 18 LPA', 
      pct: 31.0, 
      count: 440, 
      color: '#0284c7', 
      firms: 'Acme Tech, Oracle, Cisco, Intuit',
      delta: '+5.2% YoY'
    },
    { 
      bracket: '18 - 30 LPA', 
      pct: 9.0, 
      count: 128, 
      color: '#7c3aed', 
      firms: 'Amazon, Microsoft, Razorpay',
      delta: '+1.8% YoY'
    },
    { 
      bracket: '30+ LPA', 
      pct: 3.0, 
      count: 43, 
      color: '#f59e0b', 
      firms: 'Google, Atlassian, Tower Research',
      delta: '+0.9% YoY'
    },
  ];

  const recentAssessments = [
    { time: '14:22', test: 'Java OOP & Concurrency Sandbox', student: 'Aarav S. (CSE)', score: '94.8%', status: 'Passed · Clean Telemetry' },
    { time: '14:18', test: 'Spring Boot 3 REST API Architecture', student: 'Rhea M. (IT)', score: '91.2%', status: 'Passed · Clean Telemetry' },
    { time: '14:10', test: 'SQL Relational Index Optimization', student: 'Karan T. (ECE)', score: '88.5%', status: 'Passed · Clean Telemetry' },
    { time: '14:02', test: 'Algorithms & Graph Traversal Sandbox', student: 'Sneha P. (CSE)', score: '97.0%', status: 'Passed · Clean Telemetry' },
  ];

  const activeSalary = salaryDistribution[hoveredSalaryIndex] || salaryDistribution[2];

  return (
    <section className="live-pipeline-section light-mode-pipeline reveal-on-scroll" id="placement-stats">
      <div className="live-pipeline-container">
        
        {/* Section Header */}
        <div className="pipeline-header light-header">
          <div className="pipeline-header-left">
            <div className="pipeline-live-tag light-tag">
              <span className="live-dot-ping"></span>
              <span>TELEMETRY VERIFIED CAMPUS BENCHMARKS</span>
            </div>
            <h2 className="pipeline-title light-title">Placement &amp; Assessment Analytics</h2>
            <p className="pipeline-subtitle">
              Authentic department statistics, salary distributions, and compiler-verified test executions.
            </p>
          </div>

          <div className="pipeline-metrics-badge light-badge">
            <span>Median Package: <strong style={{ color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>10.8 LPA</strong></span>
            <span className="divider">|</span>
            <span>Highest Offer: <strong style={{ color: '#059669', fontVariantNumeric: 'tabular-nums' }}>44.0 LPA</strong></span>
            <span className="divider">|</span>
            <span>Batch Clearance: <strong style={{ color: '#0284c7', fontVariantNumeric: 'tabular-nums' }}>94.2%</strong></span>
          </div>
        </div>

        {/* 2-Column Analytics Grid */}
        <div className="pipeline-cards-grid">
          
          {/* Left Column: Department Placement Horizontal Bar Graph */}
          <div className="analytics-card-light">
            <div className="analytics-card-top">
              <div>
                <span className="analytics-card-title">DEPARTMENT PERFORMANCE BENCHMARK</span>
                <p className="analytics-card-sub">Department-wise placement clearance and compensation metrics</p>
              </div>

              {/* View Metric Toggles */}
              <div className="graph-toggle-pills">
                <button
                  type="button"
                  onClick={() => setMetricView('rate')}
                  className={`toggle-pill-btn ${metricView === 'rate' ? 'active' : ''}`}
                >
                  Placement %
                </button>
                <button
                  type="button"
                  onClick={() => setMetricView('salary')}
                  className={`toggle-pill-btn ${metricView === 'salary' ? 'active' : ''}`}
                >
                  Avg LPA
                </button>
                <button
                  type="button"
                  onClick={() => setMetricView('highest')}
                  className={`toggle-pill-btn ${metricView === 'highest' ? 'active' : ''}`}
                >
                  Top Offer
                </button>
              </div>
            </div>

            {/* Department Horizontal Bar Chart with Benchmark Line */}
            <div className="bars-chart-container" style={{ position: 'relative' }}>
              
              {/* Subtle Benchmark Target Vertical Line (90% Mark) */}
              {metricView === 'rate' && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '0', 
                    bottom: '0', 
                    left: '90%', 
                    borderLeft: '1.5px dashed #059669', 
                    zIndex: 2, 
                    pointerEvents: 'none' 
                  }}
                  title="90% Institutional Target"
                >
                  <span style={{ position: 'absolute', top: '-18px', right: '-12px', fontSize: '0.62rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '1px 4px', borderRadius: '3px' }}>
                    90% Target
                  </span>
                </div>
              )}

              {branchData.map((b, idx) => {
                let barPct = 0;
                let displayVal = '';
                let barColor = '#059669';

                if (metricView === 'rate') {
                  barPct = b.rate;
                  displayVal = `${b.rate}% Placed (${b.placed}/${b.students})`;
                  barColor = b.rate >= 90 ? '#059669' : '#0284c7';
                } else if (metricView === 'salary') {
                  barPct = (b.salary / 18) * 100;
                  displayVal = `${b.salary} LPA Avg`;
                  barColor = '#0284c7';
                } else {
                  barPct = (b.highest / 48) * 100;
                  displayVal = `${b.highest} LPA Peak`;
                  barColor = '#7c3aed';
                }

                const isHovered = hoveredBranchIndex === idx;

                return (
                  <div 
                    key={idx} 
                    className="bar-chart-row"
                    onMouseEnter={() => setHoveredBranchIndex(idx)}
                    onMouseLeave={() => setHoveredBranchIndex(null)}
                    style={{ 
                      padding: '0.35rem 0.5rem', 
                      borderRadius: '8px', 
                      background: isHovered ? '#f8fafc' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div className="bar-branch-label">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{b.branch}</span>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                          {b.students} Enrolled
                        </span>
                      </div>
                      <span className="bar-data-val" style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: barColor }}>
                        {displayVal}
                      </span>
                    </div>

                    <div className="bar-track" style={{ height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.min(barPct, 100)}%`,
                          background: barColor,
                          borderRadius: '9999px',
                          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Summary Bar */}
            <div className="analytics-card-footer">
              <span>Overall Batch Clearance: <strong style={{ color: '#059669', fontVariantNumeric: 'tabular-nums' }}>94.2%</strong></span>
              <span>Total Evaluated Students: <strong style={{ color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>1,420</strong></span>
            </div>
          </div>

          {/* Right Column: Salary Distribution Histogram & Test Integrity Ring */}
          <div className="analytics-card-light">
            <div className="analytics-card-top">
              <div>
                <span className="analytics-card-title">SALARY DISTRIBUTION HISTOGRAM</span>
                <p className="analytics-card-sub">Offers categorized by package brackets (LPA)</p>
              </div>
              <span className="verified-badge-sm">
                <ShieldCheck size={14} color="#059669" />
                <span>Verified Data</span>
              </span>
            </div>

            {/* Salary Breakdown Histogram / Columns with Hover Inspection */}
            <div className="salary-columns-wrap">
              {salaryDistribution.map((s, idx) => {
                const isSelected = idx === hoveredSalaryIndex;
                return (
                  <div 
                    key={idx} 
                    className="salary-col-item"
                    onMouseEnter={() => setHoveredSalaryIndex(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="col-bar-area">
                      <div
                        className="col-bar-fill"
                        style={{ 
                          height: `${s.pct * 2.3}px`, 
                          background: s.color,
                          opacity: isSelected ? 1 : 0.75,
                          transform: isSelected ? 'scaleX(1.08)' : 'scaleX(1)',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>
                    <span className="col-pct-label" style={{ fontWeight: isSelected ? 800 : 600, color: isSelected ? s.color : '#0f172a' }}>
                      {s.pct}%
                    </span>
                    <span className="col-bracket-name">{s.bracket}</span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Histogram Bracket Details Card */}
            {activeSalary && (
              <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.95rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a' }}>
                    {activeSalary.bracket}: {activeSalary.count} Students ({activeSalary.pct}% of batch)
                  </span>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    Top Employers: {activeSalary.firms}
                  </div>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>
                  {activeSalary.delta}
                </span>
              </div>
            )}

            {/* Proctor Integrity Gauge Box with Precision SVG Circular Ring */}
            <div className="proctor-gauge-box" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                
                {/* Precision SVG Circular Ring (99.8%) */}
                <div style={{ width: '56px', height: '56px', position: 'relative', flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3.2"
                      strokeDasharray="99.8, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: '#0f172a' }}>
                    99.8%
                  </div>
                </div>

                <div className="gauge-text-group">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="gauge-title" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                      Test Integrity &amp; Anti-Cheat Telemetry
                    </span>
                    <span style={{ fontSize: '0.62rem', background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px', fontWeight: 750 }}>
                      Tamper Proof
                    </span>
                  </div>
                  <span className="gauge-sub" style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    1,418 clean verified runs · 0 clipboard injections · Continuous biometric focus tracking
                  </span>
                </div>
              </div>

              <Link to="/login" className="btn-light-demo-action" style={{ textDecoration: 'none' }}>
                <span>View Engine</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>

        {/* Live Test Assessment Stream Strip */}
        <div className="live-test-activity-strip">
          <div className="activity-strip-header">
            <div className="activity-header-left">
              <span className="active-dot"></span>
              <span className="activity-title">RECENT CODING ASSESSMENTS COMPLETED</span>
            </div>
            <span className="activity-subtitle">Real-time submissions evaluated automatically</span>
          </div>

          <div className="activity-rows-grid">
            {recentAssessments.map((a, i) => (
              <div key={i} className="activity-card-compact">
                <div className="activity-time">{a.time}</div>
                <div className="activity-main">
                  <span className="activity-test-name">{a.test}</span>
                  <span className="activity-student">{a.student}</span>
                </div>
                <div className="activity-score-badge">
                  <span>{a.score}</span>
                  <CheckCircle2 size={13} color="#059669" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default LivePipelineSection;

