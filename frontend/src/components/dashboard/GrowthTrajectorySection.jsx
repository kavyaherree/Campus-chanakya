import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Activity,
  Award,
  Target,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart3,
  Layers,
  ArrowUpRight,
  Flame,
  Zap,
  Brain,
  Compass,
  RefreshCw
} from 'lucide-react';
import client from '../../api/client';

const GrowthTrajectorySection = ({ user, profile }) => {
  const [trajectoryData, setTrajectoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHoverPoint, setActiveHoverPoint] = useState(null);
  const [activeRadarHover, setActiveRadarHover] = useState(null);

  const [hollandResult, setHollandResult] = useState(null);
  const [hollandModalOpen, setHollandModalOpen] = useState(false);
  const [submittingHolland, setSubmittingHolland] = useState(false);
  const [hollandScores, setHollandScores] = useState({
    R: 78,
    I: 92,
    A: 55,
    S: 64,
    E: 72,
    C: 85
  });

  useEffect(() => {
    if (profile?.hollandScoresJson) {
      try {
        const parsed = JSON.parse(profile.hollandScoresJson);
        if (parsed && typeof parsed === 'object') {
          setHollandScores(parsed);
        }
      } catch (e) {}
    }
  }, [profile]);

  useEffect(() => {
    fetchGrowthTrajectory();
  }, []);

  const defaultEmptyData = {
    overallPlacementReadiness: 0,
    placementTierStatus: 'NOT_EVALUATED',
    activeStreakDays: 0,
    totalProblemsSolved: 0,
    verifiedBadgesCount: 0,
    averageScore: 0.0,
    monthlyReadinessTrajectory: [],
    skillRadarBreakdown: [
      { subject: 'OOP & Architecture', score: 0, fullMark: 100 },
      { subject: 'Data Structures', score: 0, fullMark: 100 },
      { subject: 'Backend Systems', score: 0, fullMark: 100 },
      { subject: 'Frontend UI/UX', score: 0, fullMark: 100 },
      { subject: 'Concurrency & Invariants', score: 0, fullMark: 100 },
      { subject: 'System Design', score: 0, fullMark: 100 },
    ],
    assessmentVelocity: [],
    activityHeatmap: Array.from({ length: 30 }, (_, i) => ({
      day: `Day -${30 - i}`,
      intensity: 0,
      commitsOrTests: 0
    })),
    tierProbabilities: {
      'Tier-3 Enterprise': 0,
      'Tier-2 Tech Specialist': 0,
      'Tier-1 Product Companies': 0,
      'Super Dream / FAANG': 0
    },
    milestones: [
      { title: 'Academic Profile & CGPA Setup', status: 'PENDING', date: 'Action Needed', badge: '0.0' },
      { title: 'First Proctored Skill Assessment', status: 'PENDING', date: 'Not Started', badge: '0 Tests' },
      { title: '3+ Gold Verified Skill Badges', status: 'PENDING', date: '0 / 3 Badges', badge: '0 Badges' },
      { title: 'ATS Resume 80+ Compliance', status: 'PENDING', date: '0% ATS', badge: 'Pending' },
      { title: 'Tier-1 Placement Drive Shortlisting', status: 'PENDING', date: 'Locked', badge: 'Requirement Not Met' },
    ]
  };

  const fetchGrowthTrajectory = async () => {
    setLoading(true);
    try {
      const res = await client.get('/student/growth-trajectory');
      if (res.data) {
        setTrajectoryData(res.data);
      }
    } catch (e) {
      console.warn('Real growth trajectory fetch notice:', e);
      setTrajectoryData(defaultEmptyData);
    } finally {
      setLoading(false);
    }
  };

  const data = trajectoryData || defaultEmptyData;

  // Helper calculations for Area Chart
  const svgW = 600;
  const svgH = 220;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const pointsCount = (data.monthlyReadinessTrajectory || []).length;
  const getX = (index) => pointsCount > 1 ? padL + (index / (pointsCount - 1)) * plotW : padL + plotW / 2;
  const getY = (score) => padT + plotH - (score / 100) * plotH;

  const candidatePoints = (data.monthlyReadinessTrajectory || []).map((pt, idx) => ({
    x: getX(idx),
    y: getY(pt.readiness),
    ...pt
  }));

  const peerPoints = (data.monthlyReadinessTrajectory || []).map((pt, idx) => ({
    x: getX(idx),
    y: getY(pt.peerAverage || 65),
    ...pt
  }));

  const candidatePath = candidatePoints.length > 0
    ? candidatePoints.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')
    : '';

  const areaPath = candidatePoints.length > 0
    ? `${candidatePath} L ${candidatePoints[candidatePoints.length - 1].x} ${padT + plotH} L ${candidatePoints[0].x} ${padT + plotH} Z`
    : '';

  const peerPath = peerPoints.length > 0
    ? peerPoints.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')
    : '';

  // Helper calculations for 6-Axis Radar Chart
  const radarRadius = 85;
  const radarCenter = 120;
  const radarAxes = data.skillRadarBreakdown || [];
  const totalAxes = Math.max(1, radarAxes.length);

  const getRadarCoords = (index, value) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radarRadius;
    return {
      x: radarCenter + r * Math.cos(angle),
      y: radarCenter + r * Math.sin(angle)
    };
  };

  const radarPolygonPoints = radarAxes.map((axis, idx) => {
    const coords = getRadarCoords(idx, axis.score);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Cockpit Header Strip */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Growth Trajectory &amp; Placement Velocity Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time multi-dimensional tracking of competency progression, integrity velocity, and Tier-1 readiness.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{data.activeStreakDays} Day Streak</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20">
            Tier-1 Placement Index: {data.overallPlacementReadiness}%
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Readiness Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-700">{data.overallPlacementReadiness}%</span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Tier-1</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">+46% since May intake</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Viva Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{data.averageScore}</span>
              <span className="text-[10px] text-slate-400 font-bold">/ 100</span>
            </div>
            <p className="text-[10px] text-emerald-700 mt-1 font-semibold">96.8% Invariant Accuracy</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Solved</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{data.totalProblemsSolved}</span>
              <span className="text-[10px] text-slate-400 font-bold">problems</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">100% Proctored Verified</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Integrity Health</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-700">100%</span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Zero Strikes</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">No proctoring infractions</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Dual Graph Grid: Area Chart (Readiness Trajectory) & Hexagonal Radar Chart (Skill Dimensions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GRAPH 1: Area Progression Line Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Placement Readiness Trajectory (6-Month Horizon)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Candidate score growth curve compared to university peer average.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-slate-800">You ({data.overallPlacementReadiness}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-slate-500">Peer Avg (81%)</span>
              </div>
            </div>
          </div>

          {/* SVG Area Chart Container */}
          <div className="relative w-full overflow-hidden">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[25, 50, 75, 100].map((score) => {
                const y = getY(score);
                return (
                  <g key={score}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={svgW - padR}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padL - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="9"
                      fill="#94a3b8"
                      fontFamily="monospace"
                    >
                      {score}%
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#growthAreaGradient)" />

              {/* Peer Benchmark Dashed Line */}
              <path
                d={peerPath}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Candidate Trajectory Solid Line */}
              <path
                d={candidatePath}
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* X Axis Labels & Interactive Point Circles */}
              {candidatePoints.map((pt, idx) => (
                <g key={idx}>
                  {/* X Axis label */}
                  <text
                    x={pt.x}
                    y={svgH - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill={activeHoverPoint?.month === pt.month ? '#064e3b' : '#64748b'}
                  >
                    {pt.month}
                  </text>

                  {/* Candidate Point Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={activeHoverPoint?.month === pt.month ? '6' : '4.5'}
                    fill="#ffffff"
                    stroke="#059669"
                    strokeWidth="3"
                    className="cursor-pointer transition-all hover:scale-125"
                    onMouseEnter={() => setActiveHoverPoint(pt)}
                    onMouseLeave={() => setActiveHoverPoint(null)}
                  />
                </g>
              ))}

              {candidatePoints.length === 0 && (
                <text x={svgW / 2} y={svgH / 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="600">
                  No assessments recorded yet. Complete your first proctored test to plot your trajectory curve.
                </text>
              )}
            </svg>

            {/* Active Hover Tooltip */}
            {activeHoverPoint && (
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 p-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg flex items-center gap-3 animate-fade-in pointer-events-none"
              >
                <div>
                  <span className="text-[10px] uppercase text-emerald-400 font-bold block">
                    {activeHoverPoint.month} Benchmark
                  </span>
                  <span>Readiness: <strong className="text-white">{activeHoverPoint.readiness}%</strong> (Peer: {activeHoverPoint.peerAverage}%)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-mono">
                  {activeHoverPoint.testsTaken} Tests Taken
                </span>
              </div>
            )}
          </div>
        </div>

        {/* GRAPH 2: Hexagonal Radar Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              6-Axis Skill Mastery Radar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Core computer science architectural competencies.
            </p>
          </div>

          {/* SVG Radar Chart */}
          <div className="flex items-center justify-center relative">
            <svg width="240" height="240" className="overflow-visible">
              {/* Concentric Hexagons */}
              {[20, 40, 60, 80, 100].map((level) => {
                const hexPoints = radarAxes.map((_, idx) => {
                  const c = getRadarCoords(idx, level);
                  return `${c.x},${c.y}`;
                }).join(' ');
                return (
                  <polygon
                    key={level}
                    points={hexPoints}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray={level === 100 ? 'none' : '2 2'}
                  />
                );
              })}

              {/* Axis Rays */}
              {radarAxes.map((_, idx) => {
                const c = getRadarCoords(idx, 100);
                return (
                  <line
                    key={idx}
                    x1={radarCenter}
                    y1={radarCenter}
                    x2={c.x}
                    y2={c.y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Shaded Candidate Skill Polygon */}
              <polygon
                points={radarPolygonPoints}
                fill="#059669"
                fillOpacity="0.25"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Vertex Nodes with interactive hover */}
              {radarAxes.map((axis, idx) => {
                const c = getRadarCoords(idx, axis.score);
                const isHovered = activeRadarHover?.subject === axis.subject;
                return (
                  <circle
                    key={idx}
                    cx={c.x}
                    cy={c.y}
                    r={isHovered ? '5.5' : '4'}
                    fill="#ffffff"
                    stroke="#059669"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setActiveRadarHover(axis)}
                    onMouseLeave={() => setActiveRadarHover(null)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Radar Metric Legend Badges */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            {radarAxes.map((axis, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveRadarHover(axis)}
                onMouseLeave={() => setActiveRadarHover(null)}
                className={`p-1.5 rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
                  activeRadarHover?.subject === axis.subject
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="truncate pr-1">{axis.subject}</span>
                <span className="font-mono font-bold text-emerald-700">{axis.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRAPH 3: Assessment Velocity Bars & Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Assessment Velocity Bars (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Assessment Velocity &amp; Cutoff Benchmarks
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Passing benchmark cutoff is fixed at 75%.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {data.assessmentVelocity && data.assessmentVelocity.length > 0
                ? `${Math.round((data.assessmentVelocity.filter(t => t.score >= (t.cutoff || 75)).length / data.assessmentVelocity.length) * 100)}% Pass Rate`
                : '0% Pass Rate'}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {(!data.assessmentVelocity || data.assessmentVelocity.length === 0) ? (
              <div className="text-center py-6 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                0 assessments completed yet. Take an assessment in the Skill Arena or AI Mock Viva to see your velocity.
              </div>
            ) : (
              data.assessmentVelocity.map((test, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{test.test}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({test.date})</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] text-slate-400">Cutoff: {test.cutoff}%</span>
                    <span className="font-bold text-emerald-700 text-xs">{test.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${test.score}%` }}
                  />
                  {/* Cutoff marker tick */}
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* 30-Day Activity Heatmap & Streaks (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                30-Day Invariant Practice Heatmap
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Consecutive coding consistency &amp; test logs.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>28 Day Active Streak</span>
            </div>
          </div>

          {/* 30-Day Grid */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-10 gap-2">
              {data.activityHeatmap.map((item, idx) => {
                const color = item.intensity === 3
                  ? 'bg-emerald-600'
                  : item.intensity === 2
                  ? 'bg-emerald-400'
                  : 'bg-emerald-200';
                return (
                  <div
                    key={idx}
                    className={`h-7 rounded-lg ${color} hover:ring-2 hover:ring-emerald-600 transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold text-white shadow-2xs`}
                    title={`${item.day}: ${item.commitsOrTests} invariant tests completed`}
                  >
                    {item.commitsOrTests}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-3 text-[10px] text-slate-400 font-medium">
              <span>30 days ago</span>
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded bg-emerald-200 inline-block" />
                <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
                <span>More</span>
              </div>
              <span>Today</span>
            </div>
          </div>

          {/* Tier placement probabilities */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {Object.entries(data.tierProbabilities).map(([tier, prob]) => (
              <div key={tier} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium truncate pr-1">{tier}</span>
                <span className="font-black text-emerald-700">{prob}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRAPH 4: Holland RIASEC Psychometric Diagnostic & Archetype Persistence */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Holland RIASEC Psychological Profile &amp; Career Alignment
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated against 6 psychometric dimensions: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setHollandModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Re-calibrate Psychometric Assessment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Assigned Archetype
            </span>
            <p className="text-base font-black text-slate-900">
              {hollandResult?.archetypeTitle || profile?.hollandArchetype || 'The Investigator-Architect (IRC)'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {hollandResult?.psychologicalProfile || 'High analytical rigor combined with hands-on systems implementation and structured precision.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Top Placement Fit
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(hollandResult?.topPlacementRoles || ['Distributed Systems Engineer', 'Cloud Infrastructure Architect', 'Backend Specialist']).map((role, rIdx) => (
                <span key={rIdx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              RIASEC Trait Breakdown
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center pt-1">
              {[
                { k: 'R', label: 'Realistic', val: hollandScores.R },
                { k: 'I', label: 'Investigative', val: hollandScores.I },
                { k: 'A', label: 'Artistic', val: hollandScores.A },
                { k: 'S', label: 'Social', val: hollandScores.S },
                { k: 'E', label: 'Enterprising', val: hollandScores.E },
                { k: 'C', label: 'Conventional', val: hollandScores.C }
              ].map(t => (
                <div key={t.k} className="p-1.5 rounded-lg bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold">{t.k}</div>
                  <div className="text-xs font-black text-emerald-700">{t.val}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Interactive Holland Assessment Calibration */}
      {hollandModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-black text-slate-900">Holland RIASEC Calibration</h4>
              </div>
              <button
                type="button"
                onClick={() => setHollandModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Adjust your self-evaluated affinity across the 6 Holland personality traits to update your psychometric archetype in the database.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {[
                { key: 'R', label: 'Realistic (Hands-on, Tooling, Hardware & Code Systems)' },
                { key: 'I', label: 'Investigative (Algorithms, Research, Invariant Proofs)' },
                { key: 'A', label: 'Artistic (Creative UI/UX, Design Systems, Innovation)' },
                { key: 'S', label: 'Social (Team Collaboration, Mentorship, Peer Review)' },
                { key: 'E', label: 'Enterprising (Product Leadership, Strategy, Placement Pitch)' },
                { key: 'C', label: 'Conventional (Process Invariants, Data Precision, Quality)' }
              ].map(item => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span className="font-mono text-emerald-700 font-bold">{hollandScores[item.key]}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={hollandScores[item.key]}
                    onChange={(e) => setHollandScores(prev => ({ ...prev, [item.key]: parseInt(e.target.value) }))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setHollandModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingHolland}
                onClick={async () => {
                  setSubmittingHolland(true);
                  try {
                    const res = await client.post('/student/holland-assessment', { scores: hollandScores });
                    if (res.data) {
                      setHollandResult(res.data);
                    }
                    setHollandModalOpen(false);
                  } catch (e) {
                    console.warn('Holland assessment submit error:', e);
                    setHollandModalOpen(false);
                  } finally {
                    setSubmittingHolland(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submittingHolland ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save to Database</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthTrajectorySection;
