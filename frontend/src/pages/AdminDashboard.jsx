import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import LogoutModal from '../components/dashboard/LogoutModal';
import RegisterCollegeModal from '../components/RegisterCollegeModal';
import {
  ShieldCheck,
  Users,
  Award,
  Briefcase,
  Activity,
  Database,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Code2,
  Terminal,
  ShieldAlert,
  Server,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Building2,
  GraduationCap,
  PlusCircle,
  MapPin,
  Mail,
  Phone,
  Power
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Determine Two-Tier Hierarchy
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || (user?.email && user.email.toLowerCase() === 'kavyauncut@gmail.com');

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState(isSuperAdmin ? 'colleges' : 'overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Platform Metrics
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalColleges: 3,
    verifiedSkills: 0,
    activePlacements: 0,
    avgPassRate: 0.0,
    antiCheatStrikesTotal: 0,
    h2DbSize: '1.2 MB',
    activeConnections: 1,
    redemptionRate: '0%'
  });

  const [colleges, setColleges] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('ALL');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, uRes, aRes, cRes] = await Promise.allSettled([
        client.get('/admin/metrics'),
        client.get('/admin/users'),
        client.get('/admin/audit-logs'),
        client.get('/colleges')
      ]);

      if (mRes.status === 'fulfilled' && mRes.value.data) {
        setStats(mRes.value.data);
      }
      if (uRes.status === 'fulfilled' && Array.isArray(uRes.value.data)) {
        setUserDirectory(uRes.value.data);
      }
      if (aRes.status === 'fulfilled' && Array.isArray(aRes.value.data)) {
        setAuditLogs(aRes.value.data);
      }
      if (cRes.status === 'fulfilled' && Array.isArray(cRes.value.data)) {
        setColleges(cRes.value.data);
      }
    } catch (err) {
      console.warn('Error fetching live admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCollegeStatus = async (collegeId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await client.put(`/colleges/${collegeId}/status`, { status: nextStatus });
      setColleges(prev => prev.map(c => c.id === collegeId ? { ...c, status: nextStatus } : c));
    } catch (err) {
      console.warn('Error updating college status:', err);
    }
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  const filteredColleges = colleges.filter((c) => {
    const q = collegeSearch.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) ||
      (c.code || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q) ||
      (c.state || '').toLowerCase().includes(q) ||
      (c.adminEmail || '').toLowerCase().includes(q);
  });

  const filteredUsers = userDirectory.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchesSearch = (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.college || '').toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesCollege = selectedCollegeFilter === 'ALL' || 
      u.collegeCode === selectedCollegeFilter || 
      u.college === selectedCollegeFilter;
    return matchesSearch && matchesRole && matchesCollege;
  });

  // Navigation Links based on Tier
  const navItems = [
    ...(isSuperAdmin ? [
      { id: 'colleges', label: 'Colleges Management', icon: Building2, count: colleges.length }
    ] : []),
    { id: 'overview', label: isSuperAdmin ? 'Platform Governance' : 'College Overview', icon: LayoutDashboard },
    { id: 'directory', label: isSuperAdmin ? 'Global User Directory' : 'College Roster', icon: Users, count: filteredUsers.length },
    { id: 'oopj-viva', label: 'Academic Viva & OOPJ', icon: Award },
    { id: 'anti-cheat', label: 'Anti-Cheat & Proctor Audits', icon: ShieldAlert },
    { id: 'system', label: 'Database & System Health', icon: Database }
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* UNIFIED GREEN & WHITE ADMIN SIDEBAR */}
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
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-sm">
                {isSuperAdmin ? 'Superadmin Portal' : 'College Admin Portal'}
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Profile Card */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/30 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#064e3b] flex items-center justify-center font-black shadow-md">
                {isSuperAdmin ? '👑' : '🏛️'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-extrabold text-white truncate">
                  {user?.fullName || (isSuperAdmin ? 'Kavya Superadmin' : 'College Administrator')}
                </h3>
                <p className="text-[11px] text-emerald-200 font-medium truncate">
                  {isSuperAdmin ? 'Platform Owner (Superadmin)' : 'Institutional TPO Cell'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between text-[11px]">
              <span className="text-emerald-200 font-medium">Access Tier</span>
              <span className={`font-extrabold px-2 py-0.5 rounded-md text-[10px] tracking-wider uppercase ${
                isSuperAdmin 
                  ? 'text-amber-950 bg-amber-300' 
                  : 'text-[#064e3b] bg-emerald-300'
              }`}>
                {isSuperAdmin ? 'Tier 1: Superadmin' : 'Tier 2: College Admin'}
              </span>
            </div>
          </div>

          {/* Quick Register College Action for Superadmin */}
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setRegisterModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 hover:text-white border border-emerald-400/40 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>Register College</span>
            </button>
          )}

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
      {/* MAIN CONTENT VIEW CANVAS */}
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
                  {isSuperAdmin ? 'Tier 1: Platform Superadmin' : 'Tier 2: Institutional Governance'}
                </span>
                <span className="text-xs text-slate-400 font-medium">/</span>
                <span className="text-xs font-bold text-slate-600 capitalize">
                  {activeTab === 'colleges' ? 'Colleges Network' : activeTab === 'oopj-viva' ? 'OOPJ Viva' : activeTab}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {activeTab === 'colleges' && 'Colleges & Institutional Network Management'}
                {activeTab === 'overview' && (isSuperAdmin ? 'Executive Platform Governance Panel' : 'College TPO & Placement Command Center')}
                {activeTab === 'oopj-viva' && 'Academic Viva & OOPJ Architectural Benchmarks'}
                {activeTab === 'anti-cheat' && 'Proctor Security & Biometric Telemetry Audits'}
                {activeTab === 'directory' && (isSuperAdmin ? 'Global Platform Stakeholder Directory' : 'College Student, Alumni & Recruiter Roster')}
                {activeTab === 'system' && 'Infrastructure Health & Embedded Database'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setRegisterModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register College</span>
              </button>
            )}
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Two-Tier Authority: Active</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 0: COLLEGES MANAGEMENT (SUPERADMIN TIER 1) */}
        {/* ========================================================================= */}
        {activeTab === 'colleges' && isSuperAdmin && (
          <div className="space-y-6 animate-fade-in">
            {/* Superadmin Hero Banner */}
            <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white p-6 sm:p-8 rounded-3xl border border-emerald-700/50 shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-white/20 mb-3">
                  <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                  Superadmin Tier 1 Oversight
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  University &amp; College Management Panel 🏛️
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
                  As Platform Superadmin, you handle and onboard institutions. Each verified college operates as a Tier-2 autonomous node, independently managing its students, alumni mentors, and corporate recruiters.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setRegisterModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white text-[#064e3b] hover:bg-emerald-50 text-xs font-black shadow-md shadow-black/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#064e3b]" />
                    <span>Register New College</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCollegeFilter('ALL');
                      setActiveTab('directory');
                    }}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>View All Stakeholders</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Colleges KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Colleges</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{colleges.length}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Onboarded Institutions</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Colleges</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {colleges.filter(c => c.status === 'ACTIVE').length}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold">Verified &amp; Operational</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Affiliated Students</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {colleges.reduce((acc, c) => acc + (c.studentCount || 0), 0)}
                  </p>
                  <span className="text-[10px] text-sky-700 font-bold">Across all colleges</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Partner Recruiters</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {colleges.reduce((acc, c) => acc + (c.recruiterCount || 0), 0)}
                  </p>
                  <span className="text-[10px] text-amber-700 font-bold">Active hiring nodes</span>
                </div>
              </div>
            </div>

            {/* Colleges Table List */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Onboarded College Institutions</h3>
                    <p className="text-[11px] text-slate-500">Tier-2 Autonomous Institutional Nodes</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={collegeSearch}
                      onChange={(e) => setCollegeSearch(e.target.value)}
                      placeholder="Search colleges..."
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    onClick={() => setRegisterModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Register College</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">College / University</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">College Administrator (TPO)</th>
                      <th className="py-3 px-4 text-center">Students</th>
                      <th className="py-3 px-4 text-center">Alumni</th>
                      <th className="py-3 px-4 text-center">Recruiters</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredColleges.map((col) => (
                      <tr key={col.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-900 block">{col.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200 font-extrabold">
                                {col.code}
                              </span>
                              {col.domain && (
                                <span className="text-[11px] text-slate-400">· {col.domain}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{col.city || 'Campus'}, {col.state || 'IN'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block text-[11px]">{col.adminName}</span>
                          <span className="text-slate-500 font-mono text-[10px] block">{col.adminEmail}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                            {col.studentCount || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200 font-mono">
                            {col.alumniCount || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                            {col.recruiterCount || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCollegeStatus(col.id, col.status)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                              col.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                            title="Click to toggle status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${col.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            <span>{col.status}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedCollegeFilter(col.code);
                              setActiveTab('directory');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>View Roster</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: EXECUTIVE OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Welcome Banner */}
            <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white p-6 sm:p-8 rounded-3xl border border-emerald-700/50 shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-white/20 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  {isSuperAdmin ? 'CampusChanakya Platform Oversight' : 'National Institute of Technology TPO Cell'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isSuperAdmin ? 'Platform Superadmin Governance Panel 🛡️' : 'College TPO & Placement Command Center 🏛️'}
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
                  {isSuperAdmin 
                    ? 'Supervise all onboarded colleges, verification audits, and global software engineering standards.'
                    : 'Manage placement drives, students assessment readiness, alumni mentors, and recruiter relationships for your college.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {isSuperAdmin ? (
                    <button
                      onClick={() => setActiveTab('colleges')}
                      className="px-4 py-2 rounded-xl bg-white text-[#064e3b] hover:bg-emerald-50 text-xs font-black shadow-md shadow-black/10 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Manage Colleges</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('directory')}
                      className="px-4 py-2 rounded-xl bg-white text-[#064e3b] hover:bg-emerald-50 text-xs font-black shadow-md shadow-black/10 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Manage Students Roster</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('oopj-viva')}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>OOPJ Viva Checklist</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('anti-cheat')}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>View Telemetry Audits</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {isSuperAdmin ? 'Total Platform Users' : 'College Candidates'}
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalUsers}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">&uarr; 14% semester growth</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verified Badges</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.verifiedSkills}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Passed Code Evaluations</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Placement Drives</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.activePlacements}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Active Recruiter Openings</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064e3b] flex items-center justify-center shadow-xs">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Viva Clearance Rate</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.avgPassRate}%</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Zero Fake Pass Rate</span>
                </div>
              </div>
            </div>

            {/* Quick Two-Tier System Architecture Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                  Two-Tier Architecture
                </span>
                <span className="text-xs font-bold text-slate-700">Governance Model Status</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                    <Building2 className="w-4 h-4" />
                    <span>Tier 1: Platform Superadmin (Kavya Superadmin)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Oversees and onboards Colleges. Manages platform telemetry, system health, and inter-institutional governance.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                    <Users className="w-4 h-4" />
                    <span>Tier 2: College Administration (TPO Cell)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Directly handles and governs affiliated Students, Alumni Mentors, and Visiting Recruiters for the college.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ACADEMIC VIVA & OOPJ ARCHITECTURAL BENCHMARKS */}
        {/* ========================================================================= */}
        {activeTab === 'oopj-viva' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">OOPJ Architectural Rigor Benchmarks</h2>
                  <p className="text-xs text-slate-500">
                    Live verification standards and design invariants enforced during technical vivas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#064e3b]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Encapsulation &amp; Data Hiding Invariants</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All entity states and assessment sessions are encapsulated via strict access modifiers and validated setter boundaries.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#064e3b]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>2. Polymorphic Dynamic Dispatch</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The evaluation engine polymorphically dispatches assessment scoring algorithms based on runtime question taxonomy.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#064e3b]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>3. Inheritance &amp; Shared BaseEntity Auditing</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All domain models inherit identity keys and UTC audit timestamps from BaseEntity, preventing boilerplate replication.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#064e3b]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>4. Abstraction &amp; Spring Service Boundaries</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Controllers depend strictly on abstractions via service contracts rather than concrete implementations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: ANTI-CHEAT & PROCTOR AUDITS */}
        {/* ========================================================================= */}
        {activeTab === 'anti-cheat' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Anti-Cheat Security &amp; Biometric Audits</h2>
                    <p className="text-xs text-slate-500">
                      Live proctoring telemetry logs tracking tab switches, keystroke cadence, and clipboard violations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Total Infraction Strikes:</span>
                  <span className="font-mono font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 text-sm">
                    {stats.antiCheatStrikesTotal}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Session ID</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Evaluated Skill</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Strikes</th>
                      <th className="py-3 px-4">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-500">#{log.id}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{log.studentName}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{log.studentEmail}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{log.skill}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{log.score}%</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              log.strikes > 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {log.strikes} {log.strikes === 1 ? 'Strike' : 'Strikes'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              log.passed ? 'bg-emerald-100 text-[#064e3b]' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {log.passed ? 'VERIFIED PASSED' : 'NEEDS REDEMPTION'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                          No proctoring infractions recorded. Zero tampering detected across active sessions.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: USER & ROLE DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'directory' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {isSuperAdmin ? 'Global Stakeholder Directory' : 'College Stakeholder Roster'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Enrolled Students, Alumni Mentors, Corporate Recruiters, and Administrators
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search directory..."
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* College Filter for Superadmin */}
                  {isSuperAdmin && (
                    <select
                      value={selectedCollegeFilter}
                      onChange={(e) => setSelectedCollegeFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ALL">All Colleges</option>
                      {colleges.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="STUDENT">Student</option>
                    <option value="ALUMNI">Alumni</option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Superadmin</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Institution / College</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            u.role === 'SUPER_ADMIN' ? 'bg-amber-50 text-amber-900 border-amber-300 font-mono' :
                            u.role === 'STUDENT' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            u.role === 'ALUMNI' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                            u.role === 'RECRUITER' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {u.role === 'SUPER_ADMIN' ? 'SUPERADMIN' : u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {u.collegeCode || 'NIT-KKR'}
                            </span>
                            <span className="text-slate-700 text-[11px] truncate max-w-[150px]">
                              {u.college || 'National Institute of Technology'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">{u.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: SYSTEM HEALTH & H2 DATABASE */}
        {/* ========================================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#064e3b] border border-emerald-200">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Embedded System &amp; Database Health</h2>
                  <p className="text-xs text-slate-500">H2 / Spring Boot 3 Engine Runtime Telemetry</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Database Footprint</span>
                  <p className="text-lg font-black text-slate-900">{stats.h2DbSize}</p>
                  <p className="text-[10px] text-slate-500">Persistent file-backed H2 engine</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Active Connections</span>
                  <p className="text-lg font-black text-slate-900">{stats.activeConnections} Active Pool</p>
                  <p className="text-[10px] text-emerald-700 font-bold">HikariCP 5.1 Subsystem</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Two-Tier Governance</span>
                  <p className="text-lg font-black text-slate-900">Enforced</p>
                  <p className="text-[10px] text-emerald-700 font-bold">Superadmin &amp; College Admins</p>
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
      />

      {/* Register College Modal */}
      <RegisterCollegeModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={() => fetchAdminData()}
      />
    </div>
  );
};

export default AdminDashboard;
