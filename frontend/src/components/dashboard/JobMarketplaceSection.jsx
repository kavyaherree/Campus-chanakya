import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  Filter,
  DollarSign,
  Send,
  X,
  Target,
  ExternalLink,
  Award,
  RefreshCw
} from 'lucide-react';

const DEFAULT_JOBS = [
  {
    id: 1,
    title: 'Associate Cloud Software Engineer (Java/Go)',
    company: 'Google Cloud India',
    location: 'Bengaluru / Hyderabad (Hybrid)',
    package: '24.5 LPA',
    type: 'Full-Time Placement',
    minCgpa: 8.0,
    requiredSkills: ['Java Core', 'Spring Boot', 'Cloud Architecture', 'Data Structures & Algorithms'],
    deadline: 'Nov 04, 2026',
    description: 'Build scalable distributed control planes for Google Cloud Platform. High focus on polymorphic strategy patterns, thread safety, and latency invariants.'
  },
  {
    id: 2,
    title: 'Software Development Engineer - Platform (SDE-1)',
    company: 'Microsoft IDC',
    location: 'Noida / Bengaluru',
    package: '32.0 LPA',
    type: 'Full-Time Placement',
    minCgpa: 8.5,
    requiredSkills: ['Java Core', 'Spring Boot', 'Concurrency & Multithreading Invariants', 'Data Structures & Algorithms'],
    deadline: 'Nov 18, 2026',
    description: 'Work on mission-critical Azure storage fabric and high-throughput microservices. Candidates with verified proctoring records receive prioritized screening.'
  },
  {
    id: 3,
    title: 'Backend Systems Engineer (Fintech Core)',
    company: 'Razorpay',
    location: 'Bengaluru',
    package: '21.0 LPA',
    type: 'Full-Time Placement',
    minCgpa: 7.5,
    requiredSkills: ['Java Core', 'Spring Boot', 'MySQL', 'RESTful APIs'],
    deadline: 'Nov 12, 2026',
    description: 'Architect resilient payment orchestration pipelines. Candidates should exhibit deep understanding of transactional rollback invariants and atomic CAS counters.'
  },
  {
    id: 4,
    title: 'Specialist Programmer (Digital Specialist)',
    company: 'Infosys Limited',
    location: 'Pan India Hubs',
    package: '9.5 LPA',
    type: 'Campus Drive',
    minCgpa: 7.0,
    requiredSkills: ['Java Core', 'Data Structures & Algorithms', 'React.js'],
    deadline: 'Nov 09, 2026',
    description: 'Core digital engineering division focusing on modern enterprise architectures, cloud transformations, and reactive full-stack web applications.'
  },
  {
    id: 5,
    title: 'Cloud Infrastructure & SRE Intern',
    company: 'Amazon AWS',
    location: 'Bengaluru',
    package: '1.2 Lac/month Internship',
    type: '6-Month Internship',
    minCgpa: 8.0,
    requiredSkills: ['Java Core', 'Docker', 'Cloud Architecture'],
    deadline: 'Nov 24, 2026',
    description: 'Scale multi-region container orchestration clusters with zero-downtime invariants. Prior verified credentials in Concurrency and Microservices favored.'
  }
];

const JobMarketplaceSection = ({ user, profile, appliedJobs, onApplyJob }) => {
  const [jobs, setJobs] = useState(DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const studentCgpa = parseFloat(profile?.cgpa || user?.cgpa || 0);
  const verifiedSkills = profile?.verifiedSkills || [];

  // Fetch live jobs from backend & merge with curated benchmarks
  useEffect(() => {
    fetchBackendJobs();
  }, []);

  const fetchBackendJobs = async () => {
    setRefreshing(true);
    try {
      const res = await client.get('/jobs');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Map backend jobs to match view model
        const backendJobsFormatted = res.data.map(bj => ({
          id: bj.id,
          title: bj.title,
          company: bj.company || 'Enterprise Partner',
          location: bj.location || 'Bengaluru / Hybrid',
          package: bj.salaryPackage || '14.0 LPA - 18.0 LPA',
          type: 'Corporate Placement',
          minCgpa: bj.minCgpa || 7.0,
          requiredSkills: Array.isArray(bj.requiredSkills) 
            ? bj.requiredSkills 
            : (typeof bj.requiredSkills === 'string' ? bj.requiredSkills.split(',').map(s => s.trim()) : ['Java Core', 'Spring Boot']),
          deadline: 'Dec 01, 2026',
          description: bj.description || 'Verified placement vacancy posted by verified recruiter.'
        }));

        // Combine backend jobs first, then default jobs (avoid ID clashes)
        const combined = [...backendJobsFormatted];
        DEFAULT_JOBS.forEach(dj => {
          if (!combined.some(c => c.id === dj.id || c.title.toLowerCase() === dj.title.toLowerCase())) {
            combined.push(dj);
          }
        });
        setJobs(combined);
      }
    } catch (e) {
      console.warn('Real jobs fetch fallback to defaults:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const calculateAtsScore = (job) => {
    if (studentCgpa === 0 && verifiedSkills.length === 0) return 0;
    let score = 50;
    // CGPA bonus
    if (studentCgpa >= job.minCgpa) {
      score += Math.min(20, Math.round((studentCgpa - job.minCgpa) * 10));
    } else {
      score -= 20;
    }
    // Skill match bonus
    const reqList = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
    const matched = reqList.filter(req =>
      verifiedSkills.some(v => v.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(v.toLowerCase()))
    ).length;

    score += Math.round((matched / Math.max(1, reqList.length)) * 30);
    return Math.min(100, Math.max(0, score));
  };

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    const reqSkillsSample = Array.isArray(job.requiredSkills) ? job.requiredSkills.slice(0, 2).join(' and ') : 'Java & Spring Boot';
    setCoverNote(`I am excited to apply for the ${job.title} position at ${job.company}. My academic CGPA is ${studentCgpa} and I hold verified credentials in ${reqSkillsSample}.`);
    setApplyModalOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    const score = calculateAtsScore(selectedJob);
    try {
      if (onApplyJob) {
        await onApplyJob(selectedJob.id, score);
      }
    } catch (err) {
      console.warn('Apply job notice:', err);
    } finally {
      setApplying(false);
      setApplyModalOpen(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || job.type.includes(filterType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Campus Placement Marketplace &amp; ATS Screener
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verified candidate applications with real-time ATS match scoring and automated recruiter screening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBackendJobs}
            disabled={refreshing}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh vacancies from database"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Applied Drives</span>
            <p className="text-lg font-black text-purple-700">{Object.keys(appliedJobs || {}).length} Open</p>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            Eligible: {jobs.filter(j => studentCgpa >= j.minCgpa).length} / {jobs.length} Drives
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, job role, or location..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-purple-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'Placement', 'Internship'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type === 'ALL' ? 'All Openings' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Listing Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const atsScore = calculateAtsScore(job);
          const isEligible = studentCgpa >= job.minCgpa;
          const isApplied = appliedJobs && appliedJobs[job.id] !== undefined;

          return (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                    {job.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-600 bg-slate-100">
                    Deadline: {job.deadline}
                  </span>
                  {isEligible ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      CGPA Eligible (Min: {job.minCgpa})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                      Requires CGPA {job.minCgpa}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 mt-1">
                    <span className="flex items-center gap-1 text-slate-900 font-extrabold">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      {job.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-extrabold">
                      {job.package}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {job.description}
                </p>

                {/* Required Skills tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Required:</span>
                  {(Array.isArray(job.requiredSkills) ? job.requiredSkills : []).map((req, i) => {
                    const hasSkill = verifiedSkills.some(v => v.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(v.toLowerCase()));
                    return (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          hasSkill
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {hasSkill ? '✓ ' : ''}{req}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: ATS Score & Apply Button */}
              <div className="flex md:flex-col items-center justify-between md:items-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 flex-shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Candidate ATS Match</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-emerald-700">{atsScore}%</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">High Fit</span>
                  </div>
                </div>

                {isApplied ? (
                  <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Applied ({appliedJobs[job.id]}%)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!isEligible}
                    onClick={() => handleOpenApply(job)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>One-Click Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1-CLICK APPLY MODAL */}
      {/* ========================================================================= */}
      {applyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Confirm Placement Application</h3>
                <p className="text-xs text-slate-500">{selectedJob.title} at {selectedJob.company}</p>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-purple-700 block">Candidate ATS Screen Score</span>
                  <p className="text-2xl font-black text-purple-950 mt-0.5">{calculateAtsScore(selectedJob)}% Match</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-slate-800 block">Academic CGPA: {studentCgpa}</span>
                  <span className="text-emerald-700 font-semibold">{verifiedSkills.length} Verified Badges Attached</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Note / Candidate Statement</label>
                <textarea
                  rows="3"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={applying}
                  onClick={handleConfirmApply}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{applying ? 'Submitting Application...' : 'Submit Verified Application'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMarketplaceSection;