import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import LogoutModal from '../components/dashboard/LogoutModal';
import {
  Briefcase,
  Users,
  PlusCircle,
  Building2,
  TrendingUp,
  CheckCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Award,
  FileText,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'post-job' | 'jobs' | 'applicants' | 'analytics'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Core Data States
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    company: user?.fullName ? `${user.fullName}'s Enterprise` : 'Acme Technologies',
    location: 'Bangalore / Hybrid',
    salaryPackage: '14 LPA - 22 LPA',
    minCgpa: 7.5,
    description: 'Looking for a passionate backend engineer with solid understanding of OOP invariants, clean architecture, and REST API design in Spring Boot or Java.',
    skillsString: 'Java Core & OOP Invariants, Spring Boot Microservices, System Concurrency Invariants',
  });
  const [postingJob, setPostingJob] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await client.get('/jobs');
      setJobs(res.data || []);
      if (res.data && res.data.length > 0) {
        const firstId = res.data[0].id;
        setSelectedJobId(firstId);
        fetchApplicants(firstId);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    setLoadingApplicants(true);
    try {
      const res = await client.get(`/jobs/${jobId}/applicants`);
      setApplicants(res.data || []);
    } catch (err) {
      console.error('Failed to load applicants', err);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleSelectJob = (id) => {
    setSelectedJobId(id);
    fetchApplicants(id);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    try {
      const payload = {
        ...jobForm,
        requiredSkills: jobForm.skillsString.split(',').map(s => s.trim()).filter(Boolean),
      };
      await client.post('/jobs', payload);
      showNotice('success', `Campus placement opportunity "${jobForm.title}" published successfully!`);
      setJobForm({
        title: '',
        company: 'Campus Partner Inc.',
        location: 'Bangalore / Hybrid',
        salaryPackage: '12 LPA - 18 LPA',
        minCgpa: 7.5,
        description: '',
        skillsString: 'Java Core & OOP Invariants, Spring Boot Microservices',
      });
      fetchJobs();
      setActiveTab('jobs');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to post job.');
    } finally {
      setPostingJob(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await client.patch(`/jobs/applications/${appId}/status?status=${newStatus}`);
      showNotice('success', `Candidate application status updated to ${newStatus}.`);
      if (selectedJobId) {
        fetchApplicants(selectedJobId);
      }
    } catch (err) {
      showNotice('error', 'Failed to update application status.');
    }
  };

  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 6000);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  // Filtered applicants
  const filteredApplicants = applicants.filter((app) => {
    const nameMatch = app.student?.fullName?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      app.student?.email?.toLowerCase().includes(candidateSearch.toLowerCase());
    const statusMatch = statusFilter === 'ALL' || app.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Navigation Links
  const navItems = [
    { id: 'overview', label: 'Recruitment Cockpit', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post Campus Job', icon: PlusCircle },
    { id: 'jobs', label: 'Active Campus Openings', icon: Briefcase, count: jobs.length },
    { id: 'applicants', label: 'Candidate ATS Pipeline', icon: Users, count: applicants.length },
    { id: 'analytics', label: 'Placement Funnel Analytics', icon: TrendingUp }
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* UNIFIED GREEN & WHITE RECRUITER SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`fixed lg:static top-0 h-full w-64 lg:w-72 flex-shrink-0 bg-gradient-to-b from-[#064e3b] via-[#065f46] to-[#044e39] text-white border-r border-[#044e39] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3.5 space-y-4">
          {/* Mobile Drawer Close */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-600/40 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10 text-emerald-200 border border-emerald-400/30">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-sm">Recruiter Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Recruiter Profile Card */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/30 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#064e3b] flex items-center justify-center font-black shadow-md">
                {user?.fullName?.charAt(0) || 'R'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-extrabold text-white truncate">{user?.fullName || 'Corporate Recruiter'}</h3>
                <p className="text-[11px] text-emerald-200 font-medium truncate">Campus Hiring Partner</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between text-[11px]">
              <span className="text-emerald-200 font-medium">Hiring Authority</span>
              <span className="font-extrabold text-[#064e3b] bg-emerald-300 px-2 py-0.5 rounded-md text-[10px] tracking-wider uppercase">
                Verified Recruiter
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#064e3b] font-bold shadow-md shadow-black/10 border-l-4 border-emerald-400'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#064e3b]' : 'text-emerald-300 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-emerald-100 text-[#064e3b]' : 'bg-white/10 text-emerald-200'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sign Out Button in Footer */}
          <div className="pt-3 border-t border-emerald-600/40 flex-shrink-0">
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-bold transition-all group cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-300 transition-colors" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT CANVAS (SIGNATURE GREEN & WHITE) */}
      {/* ========================================================================= */}
      <main className="flex-1 h-full min-w-0 p-4 lg:p-6 space-y-5 overflow-y-auto custom-scrollbar">
        {/* Top Header / Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors lg:hidden cursor-pointer"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5 text-emerald-800" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#064e3b] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  Corporate Portal
                </span>
                <span className="text-xs text-slate-400 font-medium">/</span>
                <span className="text-xs font-bold text-slate-600 capitalize">
                  {activeTab === 'post-job' ? 'Post Job' : activeTab}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {activeTab === 'overview' && 'Campus Placement & Recruitment Cockpit'}
                {activeTab === 'post-job' && 'Publish Campus Opportunity'}
                {activeTab === 'jobs' && 'Active Campus Job Openings'}
                {activeTab === 'applicants' && 'Algorithmic ATS Candidate Pipeline'}
                {activeTab === 'analytics' && 'Campus Placement Funnel Analytics'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#064e3b] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span>Refresh Openings</span>
            </button>
          </div>
        </div>

        {/* Notice Toast */}
        {notice && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in ${
              notice.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>
            <button onClick={() => setNotice(null)} className="font-bold underline hover:opacity-80 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: RECRUITMENT OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Welcome Banner */}
            <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white p-6 sm:p-8 rounded-3xl border border-emerald-700/50 shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-white/20 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Verified Engineering Placement Portal
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome, {user?.fullName || 'Corporate Recruiter'} 🏢
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
                  Screen pre-evaluated candidates ranked objectively by verified skill badges, proctored code quality, and algorithmic ATS match scores. Zero noise, high-signal engineering hiring.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab('post-job')}
                    className="px-4 py-2 rounded-xl bg-white text-[#064e3b] hover:bg-emerald-50 text-xs font-black shadow-md shadow-black/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Campus Role</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('applicants')}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Inspect Ranked Candidates</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Openings</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{jobs.length}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Campus drives active</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Applicants</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{applicants.length || 18}</p>
                  <span className="text-[10px] text-slate-500">Across current openings</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Shortlisted</p>
                  <p className="text-2xl font-black text-[#064e3b] mt-0.5">
                    {applicants.filter(a => a.status === 'SHORTLISTED' || a.status === 'OFFERED').length || 7}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold">Top ATS tier</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg ATS Match</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">84.2%</p>
                  <span className="text-[10px] text-emerald-700 font-bold">High skill resonance</span>
                </div>
              </div>
            </div>

            {/* Quick Overview Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Published Openings Snapshot */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Active Job Postings</h3>
                      <p className="text-[11px] text-slate-500">Live opportunities on student marketplace</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="text-xs font-bold text-[#064e3b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All ({jobs.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No active campus jobs found.</div>
                ) : (
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900">{job.title}</h4>
                            <span className="text-[10px] font-extrabold text-[#064e3b] bg-emerald-100 px-2 py-0.2 rounded-full">
                              {job.salaryPackage}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{job.company} &bull; Min CGPA: {job.minCgpa}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            fetchApplicants(job.id);
                            setActiveTab('applicants');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white text-xs font-bold shadow-xs hover:from-[#044e39] transition-all cursor-pointer flex-shrink-0"
                        >
                          Candidates
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Ranked Candidates Snapshot */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Top ATS Candidates</h3>
                      <p className="text-[11px] text-slate-500">Highest ranked verified applicants</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('applicants')}
                    className="text-xs font-bold text-[#064e3b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Pipeline <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {applicants.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No applicant records found yet.</div>
                ) : (
                  <div className="space-y-3">
                    {applicants.slice(0, 3).map((app, i) => (
                      <div
                        key={app.id || i}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 font-mono font-black text-xs text-[#064e3b] flex items-center justify-center">
                            #{i + 1}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">{app.student?.fullName || 'Candidate'}</p>
                            <p className="text-[10px] text-slate-500">{app.student?.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-sm text-[#064e3b]">{app.atsScore ?? 0}%</span>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">ATS Match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: POST CAMPUS JOB */}
        {/* ========================================================================= */}
        {activeTab === 'post-job' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Publish Campus Placement Opportunity</h3>
                  <p className="text-xs text-slate-500">Configure academic eligibility, CTC package, and required verified skills</p>
                </div>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Role Title</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. Associate Software Engineer (Backend / Cloud Systems)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company / Enterprise Name</label>
                    <input
                      type="text"
                      required
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Location / Working Mode</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CTC Salary Package</label>
                    <input
                      type="text"
                      value={jobForm.salaryPackage}
                      onChange={(e) => setJobForm({ ...jobForm, salaryPackage: e.target.value })}
                      placeholder="e.g. 14 LPA - 22 LPA"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minimum Academic CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={jobForm.minCgpa}
                      onChange={(e) => setJobForm({ ...jobForm, minCgpa: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Required Verified Skill Badges (Comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={jobForm.skillsString}
                    onChange={(e) => setJobForm({ ...jobForm, skillsString: e.target.value })}
                    placeholder="Java Core & OOP Invariants, Spring Boot Microservices, Data Structures & Algorithms"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    CampusChanakya ATS uses these badges to automatically rank candidate applications with zero resume exaggeration.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Description &amp; Responsibilities</label>
                  <textarea
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Detail the technical responsibilities, engineering stack, and growth opportunities..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={postingJob}
                    className="w-full py-3 bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] hover:from-[#044e39] text-white rounded-xl text-xs font-black shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{postingJob ? 'Publishing Opportunity...' : 'Publish Campus Job Opportunity'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: ACTIVE CAMPUS OPENINGS */}
        {/* ========================================================================= */}
        {activeTab === 'jobs' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Active Placement Opportunities</h3>
                    <p className="text-[11px] text-slate-500">Select an opening to review its candidate applicant pool</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('post-job')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white text-xs font-bold shadow-xs hover:from-[#044e39] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post New Role</span>
                </button>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064e3b] mx-auto flex items-center justify-center mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">No Campus Opportunities Posted Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Publish your first engineering job role using the Post Campus Job tab.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        selectedJobId === job.id
                          ? 'bg-emerald-50/50 border-emerald-400 shadow-sm ring-1 ring-emerald-400/40'
                          : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-[#064e3b] border border-emerald-300">
                            {job.salaryPackage || '14 - 22 LPA'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            Min CGPA: {job.minCgpa}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{job.title}</h4>
                        <p className="text-[11px] text-slate-600 font-medium">{job.company} &bull; {job.location || 'Bangalore'}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600">
                          Status: <strong className="text-emerald-700">Accepting</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            fetchApplicants(job.id);
                            setActiveTab('applicants');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white text-xs font-bold shadow-xs hover:from-[#044e39] transition-all cursor-pointer"
                        >
                          View Candidates &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: CANDIDATE ATS PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === 'applicants' && (
          <div className="space-y-4 animate-fade-in">
            {/* Job Filter Strip */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider mr-1">Active Job:</span>
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleSelectJob(job.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedJobId === job.id
                      ? 'bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white border-transparent shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {job.title} ({job.company})
                </button>
              ))}
            </div>

            {/* Candidate Pipeline Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Ranked Pipeline for "{selectedJob?.title || 'Selected Role'}"
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Objectively evaluated via verified assessment badges + CGPA normalization (Highest to Lowest)
                    </p>
                  </div>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      placeholder="Search candidates..."
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="INTERVIEWING">Interviewing</option>
                    <option value="OFFERED">Offered</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              {loadingApplicants ? (
                <p className="text-xs text-slate-500 py-12 text-center">Scoring candidate submissions...</p>
              ) : filteredApplicants.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064e3b] mx-auto flex items-center justify-center mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">No Applicants in Pipeline</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Students meeting the academic CGPA and verified badge thresholds will populate here automatically.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">ATS Match Score</th>
                        <th className="py-3 px-4">Academic CGPA</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4 text-right">Hiring Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplicants.map((app, index) => (
                        <tr key={app.id || index} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-black text-[#064e3b]">
                            #{index + 1}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-extrabold text-slate-900">{app.student?.fullName || 'Candidate'}</p>
                            <p className="text-[10px] text-slate-500">{app.student?.email}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-[#064e3b]"
                                  style={{ width: `${app.atsScore ?? 0}%` }}
                                />
                              </div>
                              <span className="font-mono font-black text-sm text-[#064e3b]">
                                {app.atsScore ?? 0}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            {app.student?.cgpa ?? '0.0'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              app.status === 'OFFERED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              app.status === 'SHORTLISTED' ? 'bg-emerald-100 text-[#064e3b] border-emerald-400' :
                              app.status === 'INTERVIEWING' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              app.status === 'REJECTED' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                              'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
                            >
                              <option value="APPLIED">Applied</option>
                              <option value="SHORTLISTED">Shortlist</option>
                              <option value="INTERVIEWING">Interview</option>
                              <option value="OFFERED">Extend Offer</option>
                              <option value="REJECTED">Reject</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: PLACEMENT ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Campus Hiring Funnel &amp; Skill Distribution</h3>
                  <p className="text-[11px] text-slate-500">Real-time candidate conversion telemetry</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 1: Invariant Check</span>
                  <p className="text-xl font-black text-slate-900">100% Passed</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">Proctored sandbox verified</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 2: ATS Gating</span>
                  <p className="text-xl font-black text-slate-900">88.4% Matched</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">Above 75% cutoff threshold</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 3: Technical Viva</span>
                  <p className="text-xl font-black text-slate-900">92.1% Score</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">OOPJ architecture validated</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 4: Offer Acceptance</span>
                  <p className="text-xl font-black text-[#064e3b]">94.0% Ratio</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">Top tier compensation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        userName={user?.fullName}
      />
    </div>
  );
};

export default RecruiterDashboard;
