import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Briefcase,
  Terminal,
  Cpu,
  Layers,
  Award,
  Clock,
  Building2,
  } from 'lucide-react';
import '../css/enhanced_hero.css';

export const HeroSection = ({ onOpenDemo, onOpenRegisterCollege }) => {
  // Selected skill track and timeframe
  const [selectedTrack, setSelectedTrack] = useState('Java OOP');
  const [timeRange, setTimeRange] = useState('7D');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(6); // Default highlight latest

  // Rich data configurations across 4 comprehensive engineering skill tracks
  const trackData = {
    'Java OOP': {
      title: 'Object-Oriented Architecture (OOPJ)',
      overallScore: '9.4',
      percentile: 'Top 3.8%',
      improvement: '+19.2%',
      testSuiteCount: '32 / 32 Passed',
      runtimeAvg: '14ms',
      memoryProfile: '16.4 MB (Zero Leaks)',
      lineColor: '#059669',
      cohortBaseline: '76.4%',
      // SVG Bézier paths for 500x120 canvas
      linePath: 'M 20 88 C 60 85, 75 74, 95 72 C 120 70, 150 78, 175 76 C 210 74, 230 55, 255 52 C 285 48, 310 40, 335 38 C 365 35, 390 30, 415 28 C 440 26, 460 20, 480 18',
      areaPath: 'M 20 88 C 60 85, 75 74, 95 72 C 120 70, 150 78, 175 76 C 210 74, 230 55, 255 52 C 285 48, 310 40, 335 38 C 365 35, 390 30, 415 28 C 440 26, 460 20, 480 18 L 480 115 L 20 115 Z',
      benchmarkPath: 'M 20 82 L 95 78 L 175 76 L 255 72 L 335 68 L 415 65 L 480 62',
      points: [
        { cx: 20, cy: 88, day: 'Session 1', val: '74.0%', benchmark: '68.5%', testCases: '24/24', latency: '22ms' },
        { cx: 95, cy: 72, day: 'Session 2', val: '82.5%', benchmark: '70.0%', testCases: '26/26', latency: '19ms' },
        { cx: 175, cy: 76, day: 'Session 3', val: '80.0%', benchmark: '71.5%', testCases: '28/28', latency: '18ms' },
        { cx: 255, cy: 52, day: 'Session 4', val: '88.0%', benchmark: '73.0%', testCases: '30/30', latency: '16ms' },
        { cx: 335, cy: 38, day: 'Session 5', val: '92.5%', benchmark: '74.2%', testCases: '32/32', latency: '15ms' },
        { cx: 415, cy: 28, day: 'Session 6', val: '95.0%', benchmark: '75.5%', testCases: '32/32', latency: '14ms' },
        { cx: 480, cy: 18, day: 'Final Viva', val: '98.4%', benchmark: '76.4%', testCases: '32/32', latency: '12ms' },
      ],
      competencies: [
        { label: 'Encapsulation & Domain Invariants', category: 'Core Design', pct: 97, status: 'Advanced' },
        { label: 'Dynamic Polymorphism & JVM VTable', category: 'Runtime', pct: 95, status: 'Advanced' },
        { label: 'Design Patterns (Strategy, Factory, Singleton)', category: 'Architecture', pct: 92, status: 'Proficient' },
        { label: 'Exception Hierarchy & Safe Resource Cleanup', category: 'Reliability', pct: 94, status: 'Advanced' },
      ],
      recruiterMatch: {
        company: 'Acme Enterprise Tech · Cloud & Core Platforms',
        packageStr: '18.0 LPA Package',
        cutoffReq: 'Min 7.5 CGPA · 85% Code Score',
        matchPct: '96.8%'
      }
    },
    'Spring Boot': {
      title: 'Spring Boot 3 & Microservice REST APIs',
      overallScore: '9.2',
      percentile: 'Top 6.1%',
      improvement: '+16.5%',
      testSuiteCount: '28 / 28 Passed',
      runtimeAvg: '18ms',
      memoryProfile: '24.1 MB (Garbage Free)',
      lineColor: '#0284c7',
      cohortBaseline: '72.8%',
      linePath: 'M 20 92 C 65 82, 85 70, 105 68 C 140 64, 160 56, 185 52 C 220 48, 240 38, 270 34 C 310 30, 340 32, 375 28 C 410 24, 450 20, 480 16',
      areaPath: 'M 20 92 C 65 82, 85 70, 105 68 C 140 64, 160 56, 185 52 C 220 48, 240 38, 270 34 C 310 30, 340 32, 375 28 C 410 24, 450 20, 480 16 L 480 115 L 20 115 Z',
      benchmarkPath: 'M 20 86 L 105 80 L 185 76 L 270 72 L 375 68 L 480 64',
      points: [
        { cx: 20, cy: 92, day: 'Session 1', val: '71.0%', benchmark: '64.0%', testCases: '20/20', latency: '28ms' },
        { cx: 105, cy: 68, day: 'Session 2', val: '83.5%', benchmark: '68.0%', testCases: '22/22', latency: '24ms' },
        { cx: 185, cy: 52, day: 'Session 3', val: '88.0%', benchmark: '70.5%', testCases: '24/24', latency: '20ms' },
        { cx: 270, cy: 34, day: 'Session 4', val: '93.0%', benchmark: '71.8%', testCases: '26/26', latency: '19ms' },
        { cx: 375, cy: 28, day: 'Session 5', val: '95.2%', benchmark: '72.4%', testCases: '28/28', latency: '18ms' },
        { cx: 480, cy: 16, day: 'Final Viva', val: '97.5%', benchmark: '72.8%', testCases: '28/28', latency: '15ms' },
      ],
      competencies: [
        { label: 'REST Routing & RFC-7807 Error Handlers', category: 'API Contract', pct: 96, status: 'Advanced' },
        { label: 'Spring Data JPA & N+1 Query Optimization', category: 'Persistence', pct: 91, status: 'Proficient' },
        { label: 'Stateless JWT Filter & Spring Security 6', category: 'Security', pct: 94, status: 'Advanced' },
        { label: 'Transaction Propagation & Rollback Rules', category: 'Data Integrity', pct: 90, status: 'Proficient' },
      ],
      recruiterMatch: {
        company: 'Fintech Scaleup · Payments Infrastructure',
        packageStr: '22.0 LPA Package',
        cutoffReq: 'Min 8.0 CGPA · Spring Boot Certified',
        matchPct: '94.5%'
      }
    },
    'Data Structures': {
      title: 'Algorithms & Computational Complexity',
      overallScore: '9.0',
      percentile: 'Top 8.4%',
      improvement: '+22.0%',
      testSuiteCount: '45 / 45 Passed',
      runtimeAvg: '8ms',
      memoryProfile: '8.2 MB (O(1) Aux Space)',
      lineColor: '#7c3aed',
      cohortBaseline: '70.2%',
      linePath: 'M 20 96 C 60 88, 85 75, 110 70 C 150 64, 170 54, 205 48 C 245 42, 275 38, 310 32 C 350 26, 395 24, 435 20 C 460 18, 475 14, 480 12',
      areaPath: 'M 20 96 C 60 88, 85 75, 110 70 C 150 64, 170 54, 205 48 C 245 42, 275 38, 310 32 C 350 26, 395 24, 435 20 C 460 18, 475 14, 480 12 L 480 115 L 20 115 Z',
      benchmarkPath: 'M 20 90 L 110 82 L 205 78 L 310 74 L 435 70 L 480 66',
      points: [
        { cx: 20, cy: 96, day: 'Session 1', val: '68.0%', benchmark: '61.0%', testCases: '30/30', latency: '15ms' },
        { cx: 110, cy: 70, day: 'Session 2', val: '81.5%', benchmark: '65.2%', testCases: '35/35', latency: '12ms' },
        { cx: 205, cy: 48, day: 'Session 3', val: '89.0%', benchmark: '67.4%', testCases: '40/40', latency: '10ms' },
        { cx: 310, cy: 32, day: 'Session 4', val: '93.5%', benchmark: '69.0%', testCases: '42/42', latency: '9ms' },
        { cx: 435, cy: 20, day: 'Session 5', val: '96.2%', benchmark: '70.0%', testCases: '45/45', latency: '8ms' },
        { cx: 480, cy: 12, day: 'Final Viva', val: '99.0%', benchmark: '70.2%', testCases: '45/45', latency: '7ms' },
      ],
      competencies: [
        { label: 'Arrays, Two-Pointers & Sliding Window', category: 'Techniques', pct: 98, status: 'Advanced' },
        { label: 'Binary Search Trees & Heap Traversal', category: 'Structures', pct: 90, status: 'Proficient' },
        { label: 'Graph BFS/DFS & Shortest Path (Dijkstra)', category: 'Graph Theory', pct: 88, status: 'Proficient' },
        { label: 'Asymptotic Big-O Time & Space Optimality', category: 'Analysis', pct: 96, status: 'Advanced' },
      ],
      recruiterMatch: {
        company: 'Global Systems Lab · High-Throughput Core',
        packageStr: '24.0 LPA Package',
        cutoffReq: 'Min 8.2 CGPA · O(N) Complexity Standard',
        matchPct: '97.2%'
      }
    },
    'System Design': {
      title: 'Distributed Architecture & Concurrency',
      overallScore: '8.8',
      percentile: 'Top 11.2%',
      improvement: '+14.8%',
      testSuiteCount: '24 / 24 Passed',
      runtimeAvg: '22ms',
      memoryProfile: '32.0 MB (High Throughput)',
      lineColor: '#059669',
      cohortBaseline: '68.5%',
      linePath: 'M 20 86 C 70 80, 95 68, 125 64 C 170 58, 200 50, 240 44 C 285 38, 320 34, 365 28 C 410 24, 445 22, 480 18',
      areaPath: 'M 20 86 C 70 80, 95 68, 125 64 C 170 58, 200 50, 240 44 C 285 38, 320 34, 365 28 C 410 24, 445 22, 480 18 L 480 115 L 20 115 Z',
      benchmarkPath: 'M 20 84 L 125 78 L 240 74 L 365 70 L 480 66',
      points: [
        { cx: 20, cy: 86, day: 'Session 1', val: '72.0%', benchmark: '62.0%', testCases: '16/16', latency: '35ms' },
        { cx: 125, cy: 64, day: 'Session 2', val: '84.0%', benchmark: '65.5%', testCases: '18/18', latency: '30ms' },
        { cx: 240, cy: 44, day: 'Session 3', val: '90.2%', benchmark: '67.0%', testCases: '20/20', latency: '26ms' },
        { cx: 365, cy: 28, day: 'Session 4', val: '94.8%', benchmark: '68.0%', testCases: '22/22', latency: '24ms' },
        { cx: 480, cy: 18, day: 'Final Viva', val: '97.2%', benchmark: '68.5%', testCases: '24/24', latency: '21ms' },
      ],
      competencies: [
        { label: 'Java Concurrency & Thread Pool Primitives', category: 'Multi-threading', pct: 93, status: 'Advanced' },
        { label: 'Stateless Web API & Distributed Caching', category: 'Scalability', pct: 89, status: 'Proficient' },
        { label: 'Idempotency, Retries & Deadlock Prevention', category: 'Fault-Tolerance', pct: 91, status: 'Proficient' },
        { label: 'Database Indexing & Partitioning Tradeoffs', category: 'Storage', pct: 87, status: 'Proficient' },
      ],
      recruiterMatch: {
        company: 'Cloud Scale Platforms · Backend Infra',
        packageStr: '20.0 LPA Package',
        cutoffReq: 'Min 7.5 CGPA · Distributed Systems',
        matchPct: '93.8%'
      }
    }
  };

  const current = trackData[selectedTrack] || trackData['Java OOP'];
  const safeHoverIndex = Math.min(hoveredPointIndex, current.points.length - 1);
  const activePoint = current.points[safeHoverIndex] || current.points[current.points.length - 1];

  return (
    <section className="light-hero-section" id="home">
      <div className="light-hero-container">
        
        {/* =========================================================
            LEFT COLUMN: Authoritative, Clear, Enterprise Value Copy
            (No Quick Demo Clutter)
           ========================================================= */}
        <div className="light-hero-left">
          
          {/* Engineering Category Tag */}
          <div className="light-hero-tag">
            <span className="tag-live-dot"></span>
            <span>CAMPUS PLACEMENT ENGINE · OPENJDK 21 HOTSPOT</span>
          </div>

          {/* Clean, high-impact headline */}
          <h1 className="light-hero-title">
            Campus placements backed by <span className="title-green-accent">verified technical proof.</span>
          </h1>

          {/* Direct, high-trust description */}
          <p className="light-hero-desc">
            CampusChanakya replaces keyword-stuffed resumes with tamper-resistant coding evaluations, automated unit test verification, and direct ATS matching for colleges and corporate recruiters.
          </p>

          {/* Clean Action Buttons */}
          <div className="light-hero-actions">
            <Link to="/login" className="btn-light-primary">
              <span>Start Skill Assessment</span>
              <ArrowRight size={17} />
            </Link>

            <button
              type="button"
              onClick={onOpenRegisterCollege}
              className="btn-light-secondary"
              style={{
                cursor: 'pointer',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1.5px solid #a7f3d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Building2 size={16} />
              <span>Register College</span>
            </button>
          </div>

          {/* 3 Enterprise Trust Credentials Strip */}
          <div className="enterprise-trust-pills">
            <div className="trust-pill-item">
              <div className="trust-pill-icon">
                <ShieldCheck size={16} color="#059669" />
              </div>
              <div className="trust-pill-text">
                <strong>Anti-Cheat JIT Sandbox</strong>
                <span>Zero clipboard injections · Keystroke cadence validation</span>
              </div>
            </div>

            <div className="trust-pill-item">
              <div className="trust-pill-icon">
                <Cpu size={16} color="#0284c7" />
              </div>
              <div className="trust-pill-text">
                <strong>OOPJ Viva Reference Architecture</strong>
                <span>JVM Dynamic Dispatch · Encapsulated Domain Models</span>
              </div>
            </div>

            <div className="trust-pill-item">
              <div className="trust-pill-icon">
                <TrendingUp size={16} color="#7c3aed" />
              </div>
              <div className="trust-pill-text">
                <strong>Deterministic Recruiter ATS</strong>
                <span>Ranked candidate queues filtered by verified pass cutoffs</span>
              </div>
            </div>
          </div>

          {/* Verified Institutional Telemetry Numbers */}
          <div className="key-metrics-inline">
            <div className="metric-inline-item">
              <span className="metric-inline-num">1,420+</span>
              <span className="metric-inline-label">Evaluations Completed</span>
            </div>
            <div className="metric-inline-item">
              <span className="metric-inline-num">99.8%</span>
              <span className="metric-inline-label">Proctoring Integrity</span>
            </div>
            <div className="metric-inline-item">
              <span className="metric-inline-num">94.2%</span>
              <span className="metric-inline-label">Placement Clearance</span>
            </div>
            <div className="metric-inline-item">
              <span className="metric-inline-num">14 Days</span>
              <span className="metric-inline-label">Median Offer Time</span>
            </div>
          </div>

        </div>

        {/* =========================================================
            RIGHT COLUMN: 10/10 Precision Data & Visualizations Dashboard
            (Dual-series, hover crosshairs, precise metrics, zero ani-slop)
           ========================================================= */}
        <div className="light-hero-right">
          <div className="dashboard-graph-card">
            
            {/* 1. Header Bar with Runtime Telemetry */}
            <div className="card-header-bar">
              <div className="card-title-group">
                <div className="window-dots">
                  <span className="window-dot window-dot-red"></span>
                  <span className="window-dot window-dot-yellow"></span>
                  <span className="window-dot window-dot-green"></span>
                </div>
                <span className="card-title-text">VERIFIED CODE EXECUTION BENCHMARK</span>
              </div>

              <div className="card-status-pill">
                <span className="pulse-green-dot"></span>
                <span>JIT Tier-4 Compiled · 0 Flags</span>
              </div>
            </div>

            {/* 2. Precision Dual Metric Highlights */}
            <div className="dual-stats-grid">
              <div className="stat-metric-box highlight">
                <div className="metric-label-sm">
                  <span>CANDIDATE SCORE</span>
                  <span className="metric-rank-badge">{current.percentile}</span>
                </div>
                <div className="metric-val-lg green">
                  {current.overallScore} <span className="metric-val-denom">/ 10.0</span>
                </div>
                <div className="metric-val-sub">
                  <span>{current.testSuiteCount}</span>
                  <span className="sub-metric-divider">·</span>
                  <strong style={{ color: '#059669' }}>{current.improvement} vs baseline</strong>
                </div>
              </div>

              <div className="stat-metric-box">
                <div className="metric-label-sm">
                  <span>PROCTORING &amp; RUNTIME</span>
                  <span className="metric-clean-pill">
                    <CheckCircle2 size={12} color="#059669" />
                    <span>Clean Session</span>
                  </span>
                </div>
                <div className="metric-val-lg">
                  {current.runtimeAvg} <span className="metric-val-denom">Avg Execution</span>
                </div>
                <div className="metric-val-sub">
                  <span>Memory: {current.memoryProfile}</span>
                </div>
              </div>
            </div>

            {/* 3. Skill Track Tabs & Time-Range Controls */}
            <div className="graph-controls-row">
              <div className="skill-tab-group">
                {Object.keys(trackData).map((track) => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => {
                      setSelectedTrack(track);
                      setHoveredPointIndex(trackData[track].points.length - 1);
                    }}
                    className={`skill-tab-btn ${selectedTrack === track ? 'active' : ''}`}
                  >
                    {track}
                  </button>
                ))}
              </div>

              <div className="timerange-group">
                {['7D', '30D', '90D', 'All'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTimeRange(range)}
                    className={`timerange-btn ${timeRange === range ? 'active' : ''}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Enhanced Multi-Series SVG Graph with Interactive Hover Tooltip */}
            <div className="graph-chart-wrapper">
              
              {/* Chart Meta Header */}
              <div className="chart-meta-row">
                <div className="chart-meta-title">
                  <span className="chart-series-name">{current.title}</span>
                  <span className="chart-timeframe-label">({timeRange} Verified Runs)</span>
                </div>

                <div className="chart-legend-row">
                  <div className="legend-item">
                    <span className="legend-indicator candidate"></span>
                    <span>Candidate Verified</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator cohort"></span>
                    <span>Cohort 75th %ile ({current.cohortBaseline})</span>
                  </div>
                </div>
              </div>

              {/* Main SVG Coordinate Canvas */}
              <div className="svg-container-relative">
                <svg 
                  className="svg-canvas-box" 
                  viewBox="0 0 500 120" 
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGradientEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.28" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                    </linearGradient>

                    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#059669" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Horizontal Gridlines & Y-Axis Reference Lines */}
                  <g className="gridlines-group" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1">
                    <line x1="20" y1="18" x2="480" y2="18" />
                    <line x1="20" y1="48" x2="480" y2="48" />
                    <line x1="20" y1="78" x2="480" y2="78" />
                    <line x1="20" y1="108" x2="480" y2="108" />
                  </g>

                  {/* Y-Axis Reference Ticks */}
                  <g className="y-axis-labels" fill="#94a3b8" fontSize="9" fontFamily="inherit" fontWeight="600">
                    <text x="2" y="21">100%</text>
                    <text x="2" y="51">80%</text>
                    <text x="2" y="81">60%</text>
                    <text x="2" y="111">40%</text>
                  </g>

                  {/* Series 2: Cohort Benchmark Dotted Reference Line */}
                  <path
                    d={current.benchmarkPath}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />

                  {/* Series 1: Shaded Area */}
                  <path d={current.areaPath} fill="url(#areaGradientEmerald)" />

                  {/* Series 1: Primary Bézier Spline */}
                  <path
                    d={current.linePath}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    filter="url(#softGlow)"
                  />

                  {/* Active Crosshair Line on Hover */}
                  {activePoint && (
                    <line
                      x1={activePoint.cx}
                      y1="10"
                      x2={activePoint.cx}
                      y2="115"
                      stroke="#059669"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Interactive Milestone Nodes */}
                  {current.points.map((pt, i) => {
                    const isSelected = i === safeHoverIndex;
                    return (
                      <g 
                        key={i} 
                        className="svg-node-group"
                        onMouseEnter={() => setHoveredPointIndex(i)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Invisible larger hit target for seamless mouseover */}
                        <circle cx={pt.cx} cy={pt.cy} r="14" fill="transparent" />

                        {isSelected && (
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r="7.5"
                            fill="#059669"
                            opacity="0.25"
                          />
                        )}
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r={isSelected ? 5.2 : 3.8}
                          fill={isSelected ? '#059669' : '#ffffff'}
                          stroke="#059669"
                          strokeWidth={isSelected ? '2.5' : '2'}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Precision Tooltip Card Following Active Node */}
                {activePoint && (
                  <div 
                    className="chart-hover-card"
                    style={{
                      left: `clamp(10%, ${(activePoint.cx / 500) * 100}%, 85%)`
                    }}
                  >
                    <div className="tooltip-header-pill">
                      <span>{activePoint.day}</span>
                      <span className="tooltip-status-clean">Passed</span>
                    </div>
                    <div className="tooltip-metrics-row">
                      <div className="tooltip-metric">
                        <span className="tooltip-num green">{activePoint.val}</span>
                        <span className="tooltip-lbl">Score</span>
                      </div>
                      <div className="tooltip-metric">
                        <span className="tooltip-num muted">{activePoint.benchmark}</span>
                        <span className="tooltip-lbl">Cohort Avg</span>
                      </div>
                      <div className="tooltip-metric">
                        <span className="tooltip-num dark">{activePoint.latency}</span>
                        <span className="tooltip-lbl">Latency</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* X-Axis Milestone Labels */}
              <div className="chart-x-axis-grid">
                {current.points.map((pt, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    className={`x-axis-node-btn ${i === safeHoverIndex ? 'active' : ''}`}
                  >
                    {pt.day}
                  </button>
                ))}
              </div>

            </div>

            {/* 5. Competency Matrix with Categorized Mastery Metrics */}
            <div className="competency-bars-container">
              <div className="competency-header">
                <span className="comp-header-title">TECHNICAL COMPETENCY BREAKDOWN</span>
                <span className="comp-verified-pill">
                  <CheckCircle2 size={13} color="#059669" />
                  <span>4 of 4 Verified</span>
                </span>
              </div>

              <div className="competencies-grid-list">
                {current.competencies.map((comp, idx) => (
                  <div key={idx} className="competency-item">
                    <div className="comp-label-row">
                      <div className="comp-name-group">
                        <span className="comp-label-text">{comp.label}</span>
                        <span className="comp-cat-badge">{comp.category}</span>
                      </div>
                      <div className="comp-score-group">
                        <span className="comp-status-tag">{comp.status}</span>
                        <span className="comp-percentage">{comp.pct}%</span>
                      </div>
                    </div>

                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${comp.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Recruiter Shortlisting Cutoff Bar */}
            <div className="bottom-ats-match-box">
              <div className="ats-info-left">
                <div className="ats-company-badge">
                  <Briefcase size={14} color="#059669" />
                </div>
                <div className="ats-text-block">
                  <span className="ats-drive-name">{current.recruiterMatch.company}</span>
                  <span className="ats-cutoff-note">{current.recruiterMatch.cutoffReq} · <strong>{current.recruiterMatch.packageStr}</strong></span>
                </div>
              </div>
              <div className="ats-score-badge">
                <span className="ats-pct">{current.recruiterMatch.matchPct}</span>
                <span className="ats-lbl">ATS Match</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;

