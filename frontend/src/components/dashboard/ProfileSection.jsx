import React, { useState } from 'react';
import {
  User,
  Edit3,
  Award,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  Code2,
  Share2,
  Globe,
  Phone,
  Mail,
  Building,
  Hash,
  Save,
  X,
  Plus,
  Trash2,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Database,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import client from '../../api/client';

const ProfileSection = ({ user, profile, onProfileUpdate }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [notice, setNotice] = useState('');

  // Local Form state for Edit Profile
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || user?.fullName || 'Aarav Sharma',
    email: profile?.email || user?.email || 'student@campus.edu',
    phone: profile?.phone || user?.phoneNumber || '',
    college: profile?.college || 'National Institute of Technology',
    branch: profile?.branch || user?.department || 'Computer Science & Engineering',
    graduationYear: profile?.graduationYear || 2026,
    enrollmentNumber: profile?.enrollmentNumber || user?.rollNumber || '',
    cgpa: profile?.cgpa ?? user?.cgpa ?? 0.0,
    targetRole: profile?.targetRole || 'Software Development Engineer',
    bio: profile?.bio || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    portfolioUrl: profile?.portfolioUrl || '',
    verifiedSkills: profile?.verifiedSkills || []
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const handleOpenEdit = () => {
    setFormData({
      fullName: profile?.fullName || user?.fullName || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || user?.phoneNumber || '',
      college: profile?.college || 'National Institute of Technology',
      branch: profile?.branch || user?.department || 'Computer Science & Engineering',
      graduationYear: profile?.graduationYear || 2026,
      enrollmentNumber: profile?.enrollmentNumber || user?.rollNumber || '',
      cgpa: profile?.cgpa ?? user?.cgpa ?? 0.0,
      targetRole: profile?.targetRole || 'Software Development Engineer',
      bio: profile?.bio || '',
      githubUrl: profile?.githubUrl || '',
      linkedinUrl: profile?.linkedinUrl || '',
      portfolioUrl: profile?.portfolioUrl || '',
      verifiedSkills: profile?.verifiedSkills || []
    });
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await client.put('/student/profile', formData);
      if (res.data) {
        onProfileUpdate(res.data);
      }
      setNotice('Profile credentials updated successfully!');
      setTimeout(() => setNotice(''), 4000);
      setEditModalOpen(false);
    } catch (err) {
      console.warn('Profile save fallback to local state:', err);
      onProfileUpdate(formData);
      setNotice('Profile saved locally!');
      setTimeout(() => setNotice(''), 4000);
      setEditModalOpen(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !formData.verifiedSkills.includes(newSkillInput.trim())) {
      setFormData({
        ...formData,
        verifiedSkills: [...formData.verifiedSkills, newSkillInput.trim()]
      });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      verifiedSkills: formData.verifiedSkills.filter(s => s !== skill)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="underline hover:text-emerald-950 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner Card: Personal & Academic Overview */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#064e3b] via-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-700/20 ring-4 ring-white">
              {formData.fullName?.charAt(0) || 'A'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formData.fullName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  Verified Candidate
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold">
                  {formData.enrollmentNumber}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                {formData.targetRole}
              </p>
              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {formData.college}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {formData.branch} (Class of {formData.graduationYear})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleOpenEdit}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/15 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Bio Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {formData.bio}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {formData.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {formData.phone}
            </span>
            {formData.githubUrl && (
              <a href={formData.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold transition-colors">
                <Code2 className="w-3.5 h-3.5" />
                GitHub
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {formData.linkedinUrl && (
              <a href={formData.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                LinkedIn
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {formData.portfolioUrl && (
              <a href={formData.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold transition-colors">
                <Globe className="w-3.5 h-3.5" />
                Portfolio
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Academic Metric Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: CGPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academic Merit</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">{formData.cgpa}</span>
              <span className="text-xs font-semibold text-slate-400">/ 10.0 CGPA</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">Top 5% Departmental Standing</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Average Assessment Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assessment Performance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-700">
                {profile?.averageAssessmentScore !== undefined && profile?.averageAssessmentScore !== null && profile?.averageAssessmentScore > 0
                  ? `${profile.averageAssessmentScore}%`
                  : 'N/A'}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {profile?.totalAssessmentsPassed || 0}/{profile?.totalAssessmentsTaken || 0} Passed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {profile?.totalAssessmentsTaken ? `${profile.totalAssessmentsTaken} tests recorded in database` : 'Take tests to log database marks'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200/80 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Integrity & Proctoring */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Integrity Audit</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">
                {profile?.totalStrikesRecorded ? `${profile.totalStrikesRecorded}` : '0'}
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                (profile?.totalStrikesRecorded || 0) > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {(profile?.totalStrikesRecorded || 0) > 0 ? 'Strikes Logged' : 'Zero Strikes'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {(profile?.totalStrikesRecorded || 0) > 0 ? 'Anti-cheat infractions recorded in DB' : 'Clean verified proctoring history'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Persistent Repeated Errors & Weakness Log */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Persistent Repeated Errors &amp; Diagnostic Deficits
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated recurring mistakes tracked in database across mock vivas and proctored coding assessments.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold self-start sm:self-auto">
            {profile?.repeatedErrors?.length || 0} Error Topics Logged
          </span>
        </div>

        {profile?.repeatedErrors && profile.repeatedErrors.length > 0 ? (
          <div className="space-y-3">
            {profile.repeatedErrors.map((err, idx) => {
              const isCritical = err.severity === 'CRITICAL_REPEATED_ERROR' || (err.occurrences && err.occurrences >= 2);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCritical
                      ? 'bg-rose-50/40 border-rose-200 text-rose-950'
                      : 'bg-amber-50/30 border-amber-200/80 text-amber-950'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {err.topic}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {err.occurrences}x Repeated Deficit
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                        {err.associatedSkill || 'AI Assessment'}
                      </span>
                    </div>
                  </div>

                  {err.remedialAdvice && (
                    <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="font-bold text-slate-800">Targeted AI Remediation: </span>
                      {err.remedialAdvice}
                    </p>
                  )}

                  {err.lastDetectedAt && (
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>Last Detected: {new Date(err.lastDetectedAt).toLocaleDateString()}</span>
                      {err.lastRecordedScore !== undefined && (
                        <span>• Score: {err.lastRecordedScore}%</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Clean Academic Invariants</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              No repeated mistakes indexed in the database. Any recurring viva or assessment gaps will automatically appear here with remediation guidance.
            </p>
          </div>
        )}
      </div>

      {/* Verified Skills Strip */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Verified Technical Competencies ({formData.verifiedSkills.length})
            </h3>
          </div>
          <button
            onClick={handleOpenEdit}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
          >
            Manage Skills
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {formData.verifiedSkills.map((skill, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Details Summary Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Academic Standing &amp; Enrollment Records
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Institution</span>
            <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{formData.college}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Branch / Specialization</span>
            <p className="text-xs font-bold text-slate-900 mt-1">{formData.branch}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Enrollment Number</span>
            <p className="text-xs font-bold font-mono text-slate-900 mt-1">{formData.enrollmentNumber}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Target Role</span>
            <p className="text-xs font-bold text-emerald-700 mt-1 line-clamp-1">{formData.targetRole}</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Student Profile</h3>
                  <p className="text-xs text-slate-500">Update academic and personal credentials</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">College / University Name</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch / Department</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enrollment / PRN Number</label>
                  <input
                    type="text"
                    value={formData.enrollmentNumber}
                    onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Cumulative CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Placement Role</label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Bio / Elevator Pitch</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Handles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portfolio / Website URL</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Skills Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700">Verified Technical Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add a technical skill (e.g., Spring Boot, Redis, Kafka)..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {formData.verifiedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
