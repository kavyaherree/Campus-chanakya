import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import LogoutModal from '../components/dashboard/LogoutModal';
import {
  Code2,
  GitPullRequest,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  Star,
  Users,
  Calendar,
  Video,
  Clock,
  AlertCircle,
  X,
  RefreshCw,
  LogOut,
  ChevronRight,
  Menu,
  Trash2,
  Search,
  Filter,
  Check,
  BookOpen,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export const AlumniDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'projects' | 'reviews' | 'slots' | 'mentees'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  // Overall Statistics
  const [stats, setStats] = useState({
    activeMentees: 0,
    totalProjectsPublished: 0,
    pendingPrReviews: 0,
    totalPrReviewsCompleted: 0,
    totalSlotsScheduled: 0,
    alumniName: user?.fullName || 'Alumni Mentor'
  });

  // Projects State
  const [projects, setProjects] = useState([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL'); // 'ALL' | 'MICRO' | 'MACRO'
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    targetSkill: 'Java Basics & OOP',
    projectType: 'MICRO',
    starterRepoUrl: 'https://github.com/campus-chanakya/starter-project',
    acceptanceCriteria: '1. All unit tests must pass.\n2. Handle edge cases cleanly.\n3. Clean, readable code structure.'
  });
  const [creatingProject, setCreatingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  // Reviews State
  const [submissions, setSubmissions] = useState([]);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED'
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: 'APPROVED',
    alumniFeedback: '',
    endorsementScore: 5
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Mentorship Slots State
  const [slots, setSlots] = useState([]);
  const [slotFilter, setSlotFilter] = useState('ALL'); // 'ALL' | 'OPEN' | 'BOOKED'
  const [slotForm, setSlotForm] = useState({
    targetSkill: 'Spring Boot Microservices',
    scheduledAt: '',
    meetingUrl: 'https://meet.google.com/new',
    notes: 'Please bring your questions or project code to discuss during the call.'
  });
  const [creatingSlot, setCreatingSlot] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState(null);

  // Students Directory State
  const [mentees, setMentees] = useState([]);
  const [menteeSearch, setMenteeSearch] = useState('');

  // Confirmation Delete Modal
  const [deleteDialog, setDeleteDialog] = useState(null); // { type: 'project' | 'slot', id, title }

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        fetchStats(),
        fetchProjects(),
        fetchSubmissions(),
        fetchSlots(),
        fetchMentees()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await client.get('/alumni/stats');
      if (res.data) setStats(res.data);
    } catch (err) {
      console.warn('Could not fetch stats:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await client.get('/alumni/projects/my-projects');
      if (res.data) setProjects(res.data);
    } catch (err) {
      console.warn('Could not fetch projects:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await client.get('/alumni/projects/submissions');
      if (res.data) setSubmissions(res.data);
    } catch (err) {
      console.warn('Could not fetch submissions:', err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await client.get('/alumni/slots');
      if (res.data) setSlots(res.data);
    } catch (err) {
      console.warn('Could not fetch slots:', err);
    }
  };

  const fetchMentees = async () => {
    try {
      const res = await client.get('/alumni/mentees');
      if (res.data) setMentees(res.data);
    } catch (err) {
      console.warn('Could not fetch mentees:', err);
    }
  };

  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 5000);
  };

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreatingProject(true);
    try {
      await client.post('/alumni/projects', projectForm);
      showNotice('success', `Project "${projectForm.title}" published successfully!`);
      setProjectForm({
        title: '',
        description: '',
        targetSkill: 'Java Basics & OOP',
        projectType: 'MICRO',
        starterRepoUrl: '',
        acceptanceCriteria: ''
      });
      fetchProjects();
      fetchStats();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to create project. Please check the fields and try again.');
    } finally {
      setCreatingProject(false);
    }
  };

  // Delete Project
  const confirmDeleteProject = async () => {
    if (!deleteDialog || deleteDialog.type !== 'project') return;
    setDeletingProjectId(deleteDialog.id);
    try {
      await client.delete(`/alumni/projects/${deleteDialog.id}`);
      showNotice('success', 'Project removed successfully.');
      setDeleteDialog(null);
      fetchProjects();
      fetchStats();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not delete project.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Open Review Modal
  const handleOpenReview = (submission) => {
    setSelectedSubmission(submission);
    setReviewForm({
      status: submission.status === 'PENDING' ? 'APPROVED' : submission.status,
      alumniFeedback: submission.alumniFeedback || 'Good job on the implementation. Clean code and all requirements met.',
      endorsementScore: submission.endorsementScore || 5
    });
    setReviewModalOpen(true);
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setSubmittingReview(true);
    try {
      await client.post('/alumni/projects/review', {
        submissionId: selectedSubmission.id,
        status: reviewForm.status,
        alumniFeedback: reviewForm.alumniFeedback,
        endorsementScore: reviewForm.endorsementScore
      });
      showNotice('success', `Review saved. Student received a ${reviewForm.endorsementScore}-star rating.`);
      setReviewModalOpen(false);
      setSelectedSubmission(null);
      fetchSubmissions();
      fetchStats();
      fetchMentees();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not save review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Create Mentorship Slot
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setCreatingSlot(true);
    try {
      await client.post('/alumni/slots', slotForm);
      showNotice('success', `Mentorship session slot added for "${slotForm.targetSkill}"!`);
      setSlotForm({
        targetSkill: 'Spring Boot Microservices',
        scheduledAt: '',
        meetingUrl: 'https://meet.google.com/new',
        notes: ''
      });
      fetchSlots();
      fetchStats();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not add time slot. Please verify the date and time.');
    } finally {
      setCreatingSlot(false);
    }
  };

  // Delete Mentorship Slot
  const confirmDeleteSlot = async () => {
    if (!deleteDialog || deleteDialog.type !== 'slot') return;
    setDeletingSlotId(deleteDialog.id);
    try {
      await client.delete(`/alumni/slots/${deleteDialog.id}`);
      showNotice('success', 'Time slot removed successfully.');
      setDeleteDialog(null);
      fetchSlots();
      fetchStats();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not remove time slot.');
    } finally {
      setDeletingSlotId(null);
    }
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Code2, count: projects.length },
    { id: 'reviews', label: 'Student Reviews', icon: GitPullRequest, badge: stats.pendingPrReviews },
    { id: 'slots', label: 'Mentorship Sessions', icon: Calendar, count: slots.length },
    { id: 'mentees', label: 'Students', icon: Users, count: mentees.length }
  ];

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.targetSkill?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesFilter = projectFilter === 'ALL' || p.projectType === projectFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((s) => {
    const studentName = s.student?.fullName || '';
    const projTitle = s.project?.title || '';
    const matchesSearch =
      studentName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      projTitle.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchesStatus =
      reviewStatusFilter === 'ALL' || s.status === reviewStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Slots
  const filteredSlots = slots.filter((slot) => {
    if (slotFilter === 'ALL') return true;
    return slot.status === slotFilter;
  });

  // Filtered Mentees
  const filteredMentees = mentees.filter((m) => {
    const name = m.name || '';
    const skill = m.skill || '';
    const email = m.email || '';
    return (
      name.toLowerCase().includes(menteeSearch.toLowerCase()) ||
      skill.toLowerCase().includes(menteeSearch.toLowerCase()) ||
      email.toLowerCase().includes(menteeSearch.toLowerCase())
    );
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (GREEN & WHITE THEME) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed lg:static top-0 h-full w-64 lg:w-72 flex-shrink-0 bg-gradient-to-b from-[#064e3b] via-[#065f46] to-[#044e39] text-white border-r border-[#044e39] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-600/40 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10 text-emerald-200 border border-emerald-400/30">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-sm">Alumni Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/30 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#064e3b] flex items-center justify-center font-black shadow-md">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-extrabold text-white truncate">{user?.fullName || 'Alumni Mentor'}</h3>
                <p className="text-[11px] text-emerald-200 font-medium truncate">{user?.email || 'kavyakhurana70@gmail.com'}</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between text-[11px]">
              <span className="text-emerald-200 font-medium">Role</span>
              <span className="font-extrabold text-[#064e3b] bg-emerald-300 px-2 py-0.5 rounded-md text-[10px] tracking-wide">
                Verified Mentor
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
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-900 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-emerald-100 text-[#064e3b]' : 'bg-white/10 text-emerald-200'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="pt-3 border-t border-emerald-600/40 mt-auto">
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
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 h-full min-w-0 p-4 lg:p-6 space-y-5 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors lg:hidden cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5 text-emerald-800" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-wide text-[#064e3b] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  Alumni Portal
                </span>
                <span className="text-xs text-slate-400 font-medium">/</span>
                <span className="text-xs font-bold text-slate-600 capitalize">
                  {activeTab === 'overview' && 'Dashboard'}
                  {activeTab === 'projects' && 'Projects'}
                  {activeTab === 'reviews' && 'Student Reviews'}
                  {activeTab === 'slots' && 'Mentorship Sessions'}
                  {activeTab === 'mentees' && 'Students'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {activeTab === 'overview' && 'Welcome to your Alumni Dashboard'}
                {activeTab === 'projects' && 'Create and Manage Student Projects'}
                {activeTab === 'reviews' && 'Review Student Submissions'}
                {activeTab === 'slots' && 'Manage 1-on-1 Mentorship Sessions'}
                {activeTab === 'mentees' && 'Students Directory'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#064e3b] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh all data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xs ${
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
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white p-6 sm:p-8 rounded-3xl border border-emerald-700/50 shadow-md">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome back, {user?.fullName || 'Mentor'}!
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
                  Support students on their career journey. You can post practical coding tasks, review their code submissions, and offer 1-on-1 mentorship sessions.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="px-4 py-2 rounded-xl bg-white text-[#064e3b] hover:bg-emerald-50 text-xs font-black shadow-md shadow-black/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New Project</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('slots')}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Add Time Slot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Connected Students</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.activeMentees || mentees.length}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Students guided by you</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Projects Published</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{projects.length}</p>
                  <span className="text-[10px] text-slate-500">Short &amp; In-depth tasks</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
                  <GitPullRequest className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Reviews</p>
                  <p className="text-2xl font-black text-amber-700 mt-0.5">
                    {submissions.filter((s) => s.status === 'PENDING').length}
                  </p>
                  <span className="text-[10px] text-amber-600 font-bold">Waiting for your review</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mentorship Sessions</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{slots.length}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">1-on-1 meeting slots</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Submissions */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                      <GitPullRequest className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Recent Student Submissions</h3>
                      <p className="text-[11px] text-slate-500">Code submissions awaiting your evaluation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-bold text-[#064e3b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All ({submissions.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No student submissions received yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.slice(0, 3).map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">
                            {sub.student?.fullName || 'Student'}
                          </p>
                          <p className="text-[11px] text-slate-600 font-medium truncate max-w-xs">
                            {sub.project?.title || 'Project'}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'REVISION_REQUESTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.status === 'APPROVED' ? 'Approved' : sub.status === 'REVISION_REQUESTED' ? 'Needs Changes' : 'Pending Review'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleOpenReview(sub)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white text-xs font-bold shadow-xs hover:from-[#044e39] transition-all cursor-pointer flex-shrink-0"
                        >
                          Review Code
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Projects */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Your Active Projects</h3>
                      <p className="text-[11px] text-slate-500">Tasks visible to interested students</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-bold text-[#064e3b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Manage ({projects.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    You have not published any projects yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 3).map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-[#064e3b] border border-emerald-300">
                            {proj.projectType === 'MICRO' ? 'Short Task' : 'In-Depth Project'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {proj.targetSkill}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 truncate">{proj.title}</h4>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PROJECTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Create Project Form */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 sticky top-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Create New Project</h3>
                    <p className="text-[11px] text-slate-500">Provide tasks for students to practice their skills</p>
                  </div>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Build an API Rate Limiter"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Project Duration</label>
                      <select
                        value={projectForm.projectType}
                        onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="MICRO">Short Task (1–3 Days)</option>
                        <option value="MACRO">In-Depth Project (2–3 Weeks)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Required Skill</label>
                      <select
                        value={projectForm.targetSkill}
                        onChange={(e) => setProjectForm({ ...projectForm, targetSkill: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Java Basics & OOP">Java Basics &amp; OOP</option>
                        <option value="Spring Boot Microservices">Spring Boot Microservices</option>
                        <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
                        <option value="Database Systems & SQL">Database Systems &amp; SQL</option>
                        <option value="React & Frontend">React &amp; Frontend</option>
                        <option value="System Design">System Design</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Starter Code URL (Optional)</label>
                    <input
                      type="url"
                      value={projectForm.starterRepoUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, starterRepoUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Description</label>
                    <textarea
                      rows={3}
                      required
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Explain what the student should build and what problems they are solving..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Passing Criteria</label>
                    <textarea
                      rows={3}
                      value={projectForm.acceptanceCriteria}
                      onChange={(e) => setProjectForm({ ...projectForm, acceptanceCriteria: e.target.value })}
                      placeholder="List the specific requirements that must be met to approve the project..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingProject}
                    className="w-full py-3 bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] hover:from-[#044e39] text-white rounded-xl text-xs font-black shadow-md shadow-emerald-950/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{creatingProject ? 'Publishing Project...' : 'Publish Project'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Published Projects List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Your Published Projects</h3>
                      <p className="text-[11px] text-slate-500">Projects currently available to students</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Total: {filteredProjects.length}</span>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects by title or skill..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {['ALL', 'MICRO', 'MACRO'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setProjectFilter(type)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          projectFilter === type
                            ? 'bg-[#064e3b] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {type === 'ALL' ? 'All' : type === 'MICRO' ? 'Short' : 'In-Depth'}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064e3b] mx-auto flex items-center justify-center mb-3">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">No Projects Found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {projectSearch
                        ? 'No projects match your search query. Try clearing the filter.'
                        : 'Use the form on the left to publish your first project for students.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              {proj.projectType === 'MICRO' ? (
                                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                                  Short Task (1–3 Days)
                                </span>
                              ) : (
                                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  In-Depth (2–3 Weeks)
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                                {proj.targetSkill || proj.techStack}
                              </span>
                            </div>
                            <h4 className="text-base font-black text-slate-900 mt-2">{proj.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {proj.starterRepoUrl && (
                              <a
                                href={proj.starterRepoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#064e3b] hover:border-emerald-300 transition-all shadow-xs"
                                title="Open Starter Repository"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() =>
                                setDeleteDialog({
                                  type: 'project',
                                  id: proj.id,
                                  title: proj.title
                                })
                              }
                              className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-xs cursor-pointer"
                              title="Delete this project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {proj.acceptanceCriteria && (
                          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                              Passing Criteria:
                            </span>
                            <p className="whitespace-pre-line text-slate-600">{proj.acceptanceCriteria}</p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active &amp; Accepting Submissions
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            Created: {new Date(proj.createdAt || Date.now()).toLocaleDateString()}
                          </span>
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
        {/* TAB 3: STUDENT REVIEWS */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                    <GitPullRequest className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Review Student Submissions</h3>
                    <p className="text-[11px] text-slate-500">
                      Check submitted student code, provide constructive feedback, and award a star rating
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500">Total: {filteredSubmissions.length}</span>
              </div>

              {/* Search and Status Filters */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search by student name or project..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'PENDING', label: 'Pending' },
                    { id: 'APPROVED', label: 'Approved' },
                    { id: 'REVISION_REQUESTED', label: 'Needs Changes' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setReviewStatusFilter(filter.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        reviewStatusFilter === filter.id
                          ? 'bg-[#064e3b] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
                    <GitPullRequest className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">No Submissions Found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When students submit their code for your projects, their work will appear here for you to review.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">Code Link</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div>
                              <p className="text-slate-900 font-extrabold">{sub.student?.fullName || 'Student'}</p>
                              <p className="text-[10px] text-slate-500 font-normal">{sub.student?.email}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-800">{sub.project?.title || 'Project'}</p>
                            <span className="text-[10px] text-slate-500">{sub.project?.targetSkill}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={sub.githubPrUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#064e3b] font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              <span>View Code</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-3.5 px-4">
                            {sub.status === 'APPROVED' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[10px]">
                                Approved
                              </span>
                            ) : sub.status === 'REVISION_REQUESTED' ? (
                              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-extrabold text-[10px]">
                                Needs Changes
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-extrabold text-[10px]">
                                Pending Review
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {sub.endorsementScore ? (
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                {[...Array(sub.endorsementScore)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                ))}
                                <span className="text-slate-700 ml-1 text-[11px]">({sub.endorsementScore}/5)</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-normal">Not rated yet</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenReview(sub)}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] hover:from-[#044e39] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                            >
                              {sub.status === 'PENDING' ? 'Review Code' : 'Update Review'}
                            </button>
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
        {/* TAB 4: MENTORSHIP SESSIONS (1-ON-1 SLOTS) */}
        {/* ========================================================================= */}
        {activeTab === 'slots' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Create Slot Form */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 sticky top-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Add Available Time Slot</h3>
                    <p className="text-[11px] text-slate-500">Offer 1-on-1 meeting slots for students</p>
                  </div>
                </div>

                <form onSubmit={handleCreateSlot} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Topic or Skill Focus</label>
                    <select
                      value={slotForm.targetSkill}
                      onChange={(e) => setSlotForm({ ...slotForm, targetSkill: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Spring Boot Microservices">Spring Boot Microservices</option>
                      <option value="Java Basics & OOP">Java Basics &amp; OOP</option>
                      <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
                      <option value="Database Systems & SQL">Database Systems &amp; SQL</option>
                      <option value="React & Frontend">React &amp; Frontend</option>
                      <option value="Career & Interview Prep">Career &amp; Interview Prep</option>
                      <option value="System Design">System Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Session Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={slotForm.scheduledAt}
                      onChange={(e) => setSlotForm({ ...slotForm, scheduledAt: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                    <input
                      type="url"
                      required
                      value={slotForm.meetingUrl}
                      onChange={(e) => setSlotForm({ ...slotForm, meetingUrl: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Notes / Agenda</label>
                    <textarea
                      rows={3}
                      value={slotForm.notes}
                      onChange={(e) => setSlotForm({ ...slotForm, notes: e.target.value })}
                      placeholder="e.g. Please bring questions regarding your project code or interview preparation..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingSlot}
                    className="w-full py-3 bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] hover:from-[#044e39] text-white rounded-xl text-xs font-black shadow-md shadow-emerald-950/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{creatingSlot ? 'Adding Time Slot...' : 'Add Available Time Slot'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Scheduled Slots List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Your Mentorship Sessions</h3>
                      <p className="text-[11px] text-slate-500">Scheduled time slots and booked student meetings</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {['ALL', 'OPEN', 'BOOKED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setSlotFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          slotFilter === status
                            ? 'bg-[#064e3b] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status === 'ALL' ? 'All' : status === 'OPEN' ? 'Open' : 'Booked'}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredSlots.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064e3b] mx-auto flex items-center justify-center mb-3">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">No Sessions Found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Add a time slot using the form on the left so students can book a 1-on-1 session with you.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">
                              {slot.targetSkill}
                            </span>
                            {slot.status === 'BOOKED' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[10px]">
                                Booked by {slot.student?.fullName || 'Student'}
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-[10px]">
                                Available for Booking
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            {slot.notes || '1-on-1 Mentorship Discussion'}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(slot.scheduledAt).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {slot.meetingUrl && (
                            <a
                              href={slot.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Call</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                type: 'slot',
                                id: slot.id,
                                title: `${slot.targetSkill} on ${new Date(slot.scheduledAt).toLocaleDateString()}`
                              })
                            }
                            className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-xs cursor-pointer"
                            title="Remove this time slot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
        {/* TAB 5: STUDENTS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'mentees' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Students Directory</h3>
                    <p className="text-[11px] text-slate-500">
                      Students who have worked on your projects or booked mentorship sessions
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500">Total: {filteredMentees.length}</span>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={menteeSearch}
                  onChange={(e) => setMenteeSearch(e.target.value)}
                  placeholder="Search students by name, email, or skill..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              {filteredMentees.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064e3b] mx-auto flex items-center justify-center mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">No Students Found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Students will appear here once they submit a project or reserve a 1-on-1 session.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMentees.map((mentee) => (
                    <div key={mentee.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white text-[#064e3b] font-black text-base flex items-center justify-center border border-slate-200 shadow-xs">
                          {mentee.name?.charAt(0) || 'S'}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">{mentee.name}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{mentee.email}</p>
                          <p className="text-[10px] text-slate-500">
                            {mentee.branch || 'Engineering'} &bull; CGPA {mentee.cgpa || '0.0'}
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[10px]">Skill:</span>
                          <span className="font-bold text-slate-800 text-[10px]">{mentee.skill}</span>
                        </div>
                        {mentee.projectTitle && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[10px]">Project:</span>
                            <span className="font-medium text-slate-700 truncate max-w-[140px] text-[10px]">
                              {mentee.projectTitle}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[10px]">
                          {mentee.status}
                        </span>
                        {mentee.endorsementScore > 0 && (
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(mentee.endorsementScore)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* REVIEW & RATING MODAL */}
      {/* ========================================================================= */}
      {reviewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200 flex items-center justify-center font-bold">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Review Student Submission</h3>
                  <p className="text-xs text-slate-500">
                    Student: {selectedSubmission.student?.fullName} &bull; Project: {selectedSubmission.project?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Code Link:</span>
                  <a
                    href={selectedSubmission.githubPrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#064e3b] hover:underline flex items-center gap-1 font-mono"
                  >
                    {selectedSubmission.githubPrUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {selectedSubmission.studentNotes && (
                  <p className="text-xs text-slate-600 italic">
                    Student Note: "{selectedSubmission.studentNotes}"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Decision</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, status: 'APPROVED' })}
                    className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      reviewForm.status === 'APPROVED'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approve Submission</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, status: 'REVISION_REQUESTED' })}
                    className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      reviewForm.status === 'REVISION_REQUESTED'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Request Changes</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Star Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, endorsementScore: star })}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewForm.endorsementScore
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-slate-700 ml-2">
                    {reviewForm.endorsementScore} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback for the Student</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.alumniFeedback}
                  onChange={(e) => setReviewForm({ ...reviewForm, alumniFeedback: e.target.value })}
                  placeholder="Explain what was done well and any areas where the student can improve..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] hover:from-[#044e39] text-white text-xs font-black shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{submittingReview ? 'Saving Review...' : 'Save Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {deleteDialog.type === 'project' ? 'Delete Project?' : 'Remove Time Slot?'}
                </h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong>"{deleteDialog.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteDialog.type === 'project' ? confirmDeleteProject : confirmDeleteSlot}
                disabled={deletingProjectId || deletingSlotId}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AlumniDashboard;
