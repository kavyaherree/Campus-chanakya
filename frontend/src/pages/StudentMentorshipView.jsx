import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import {
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GitPullRequest,
  Star,
  ExternalLink,
  Calendar,
  Clock,
  Video,
  Code,
  ArrowRight,
  BookOpen,
  Award,
  Send,
  X,
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';

const SKILLS_LIST = [
  { id: 'spring-boot', name: 'Spring Boot Microservices', assessmentId: 'spring-boot-architecture' },
  { id: 'java-core', name: 'Java Core & OOP Invariants', assessmentId: 'java-core-oop' },
  { id: 'dsa', name: 'Data Structures & Algorithms', assessmentId: 'dsa-advanced' },
  { id: 'concurrency', name: 'System Concurrency Invariants', assessmentId: 'concurrency-invariants' },
  { id: 'sql', name: 'Database Systems & SQL Normalization', assessmentId: 'sql-normalization' },
  { id: 'react', name: 'React & Modern Frontend', assessmentId: 'react-frontend' }
];

export const StudentMentorshipView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedSkill, setSelectedSkill] = useState(SKILLS_LIST[0].name);
  const [skillsStatus, setSkillsStatus] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gatingError, setGatingError] = useState(null);

  // Unlocked Data
  const [projects, setProjects] = useState([]);
  const [slots, setSlots] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  // Active sub-view: 'projects' | 'slots' | 'my-submissions'
  const [activeSubTab, setActiveSubTab] = useState('projects');

  // PR Submission Modal State
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedProjectForSubmit, setSelectedProjectForSubmit] = useState(null);
  const [githubPrUrl, setGithubPrUrl] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [isSubmittingPr, setIsSubmittingPr] = useState(false);

  // Slot Booking State
  const [bookingSlotId, setBookingSlotId] = useState(null);

  useEffect(() => {
    fetchSkillsStatus();
    loadSubmissions();
  }, []);

  useEffect(() => {
    if (selectedSkill) {
      loadGatedSkillData(selectedSkill);
    }
  }, [selectedSkill]);

  const fetchSkillsStatus = async () => {
    try {
      const res = await client.get('/student/mentorship/skills-status');
      if (res.data?.skillsStatus) {
        setSkillsStatus(res.data.skillsStatus);
      }
    } catch (err) {
      console.warn('Failed to load skills status:', err);
    }
  };

  const loadSubmissions = async () => {
    try {
      const res = await client.get('/student/mentorship/my-submissions');
      if (res.data) setMySubmissions(res.data);
    } catch (err) {
      console.warn('Failed to load student submissions:', err);
    }
  };

  const loadGatedSkillData = async (skill) => {
    setLoading(true);
    setGatingError(null);
    try {
      // 1. Attempt to fetch projects for this skill (gated by MentorshipGatingValidator)
      const projRes = await client.get(`/student/mentorship/projects?skill=${encodeURIComponent(skill)}`);
      setProjects(projRes.data || []);
      setIsUnlocked(true);

      // 2. Fetch available slots for this skill
      try {
        const slotRes = await client.get(`/student/mentorship/slots?skill=${encodeURIComponent(skill)}`);
        setSlots(slotRes.data || []);
      } catch (slotErr) {
        setSlots([]);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setIsUnlocked(false);
        setGatingError(err.response?.data?.reason || 'Prerequisite skill verification badge missing.');
        setProjects([]);
        setSlots([]);
      } else {
        console.warn('Skill data fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit GitHub PR
  const handleOpenSubmitModal = (project) => {
    setSelectedProjectForSubmit(project);
    setGithubPrUrl('');
    setStudentNotes('');
    setSubmitModalOpen(true);
  };

  const handleSubmitPr = async (e) => {
    e.preventDefault();
    if (!selectedProjectForSubmit || !githubPrUrl.trim()) return;

    setIsSubmittingPr(true);
    try {
      await client.post('/student/mentorship/projects/submit', {
        projectId: selectedProjectForSubmit.id,
        githubPrUrl: githubPrUrl.trim(),
        studentNotes: studentNotes.trim()
      });
      showNotice('success', 'Your GitHub Pull Request has been submitted for Alumni Review and Endorsement!');
      setSubmitModalOpen(false);
      setSelectedProjectForSubmit(null);
      loadSubmissions();
      setActiveSubTab('my-submissions');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to submit Pull Request.');
    } finally {
      setIsSubmittingPr(false);
    }
  };

  // Book 1:1 Mentorship Slot
  const handleBookSlot = async (slotId) => {
    setBookingSlotId(slotId);
    try {
      await client.post('/student/mentorship/slots/book', { slotId });
      showNotice('success', 'Mentorship slot booked successfully! Google Meet link is active.');
      loadGatedSkillData(selectedSkill);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to book mentorship slot.');
    } finally {
      setBookingSlotId(null);
    }
  };

  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 6000);
  };

  const currentSkillMeta = SKILLS_LIST.find((s) => s.name === selectedSkill) || SKILLS_LIST[0];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* Toast Notice */}
      {notice && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
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
          <button onClick={() => setNotice(null)} className="font-bold underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-100/40 via-teal-100/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#064e3b] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Verified Skill Access
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                Direct Mentorship
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              Alumni Mentorship &amp; Projects
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Work on hands-on coding projects and book 1-on-1 video sessions with alumni mentors.
              Access unlocks once you pass the skill assessment with a score of 7.0 or higher.
            </p>
          </div>


          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchSkillsStatus();
                loadGatedSkillData(selectedSkill);
                loadSubmissions();
              }}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Skill Verification Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Select Technology to Inspect Access &amp; Projects:
          </p>
          <div className="flex flex-wrap gap-2">
            {SKILLS_LIST.map((skill) => {
              const statusObj = skillsStatus.find((s) => s.skillName === skill.name);
              const isSkillVerified = statusObj?.unlocked ?? (skill.name === 'Spring Boot Microservices');
              const isSelected = selectedSkill === skill.name;

              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : isSkillVerified
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSkillVerified ? (
                    <ShieldCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  ) : (
                    <Lock className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  )}
                  <span>{skill.name}</span>
                  {isSkillVerified && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
                      VERIFIED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VERIFICATION CHECK BANNER: LOCKED STATE vs UNLOCKED STATE */}
      {/* ========================================================================= */}
      {!isUnlocked ? (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-rose-50/40 border-2 border-amber-300 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex-shrink-0">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 flex-1">
              <span className="text-[11px] uppercase font-black tracking-widest text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                Skill Test Required
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                🔒 Complete [{selectedSkill}] Assessment (Score &ge; 7.0 / 10) to unlock projects and 1-on-1 mentorship.
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                To make sure students have the fundamentals ready before writing project code with alumni mentors,
                please pass the skill assessment first. Once passed, you can view project specifications, submit code, and book meeting slots.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Status: {gatingError || 'Assessment not yet completed for this skill.'}</span>
            </div>

            <button
              onClick={() => navigate(`/assessment/${currentSkillMeta.assessmentId}`)}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <span>Take {selectedSkill} Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Unlocked Access Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-900">
                  Skill Verified: {selectedSkill}
                </p>
                <p className="text-[11px] text-emerald-700">
                  You have passed this skill assessment. Projects and 1-on-1 mentorship sessions are unlocked for you.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-extrabold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-xs self-start sm:self-auto">
              Unlocked &bull; Ready
            </span>
          </div>


          {/* Sub-Tab Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setActiveSubTab('projects')}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeSubTab === 'projects'
                  ? 'bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Available Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('slots')}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeSubTab === 'slots'
                  ? 'bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>1:1 Mentor Slots ({slots.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('my-submissions')}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeSubTab === 'my-submissions'
                  ? 'bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
              <span>My Submissions ({mySubmissions.length})</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* SUB-TAB 1: PROJECTS GRID */}
          {/* ========================================================================= */}
          {activeSubTab === 'projects' && (
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <Code className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-black text-slate-800">No Projects Found for {selectedSkill}</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Alumni mentors are actively drafting new micro and macro challenges for this skill. Check back shortly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {proj.projectType === 'MICRO' ? (
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                                MICRO (1-3 Days Utility)
                              </span>
                            ) : (
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                MACRO (2-3 Weeks Architecture)
                              </span>
                            )}
                          </div>
                          {proj.starterRepoUrl && (
                            <a
                              href={proj.starterRepoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#064e3b] font-bold hover:underline flex items-center gap-1 flex-shrink-0"
                            >
                              <span>Starter Repo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-[#064e3b] transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>

                        {proj.acceptanceCriteria && (
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                            <span className="font-black text-slate-900 uppercase tracking-wider text-[10px] block">
                              Acceptance Criteria:
                            </span>
                            <p className="whitespace-pre-line font-mono text-slate-600 leading-relaxed">
                              {proj.acceptanceCriteria}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500 font-medium">
                          Alumnus: <strong className="text-slate-800">{proj.alumni?.fullName || 'Senior SDE'}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenSubmitModal(proj)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <GitPullRequest className="w-3.5 h-3.5" />
                          <span>Submit PR for Review</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-TAB 2: 1:1 SLOTS CALENDAR / GRID */}
          {/* ========================================================================= */}
          {activeSubTab === 'slots' && (
            <div className="space-y-4">
              {slots.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-black text-slate-800">No Open Slots Currently Scheduled</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Alumni mentors post new mock viva and architecture review slots weekly. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                            1:1 Mentorship Session
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(slot.scheduledAt).toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            Mentor: {slot.alumni?.fullName || 'Alumni Lead'}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            {slot.notes || '1-on-1 Mock Interview, System Architecture Critique & Invariant Walkthrough.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700">
                          {slot.targetSkill}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleBookSlot(slot.id)}
                          disabled={bookingSlotId === slot.id}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{bookingSlotId === slot.id ? 'Booking...' : 'Reserve 1:1 Slot'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-TAB 3: MY SUBMISSIONS & REVIEWS */}
          {/* ========================================================================= */}
          {activeSubTab === 'my-submissions' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">My Project PR Submissions &amp; Endorsements</h3>
                <p className="text-xs text-slate-500">
                  Approved submissions directly increase your Alumni Endorsement score (20% of your Composite ATS Matchmaker score).
                </p>
              </div>

              {mySubmissions.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <GitPullRequest className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">No Submissions Yet</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Select an unlocked project and submit your GitHub Pull Request URL to get alumni feedback!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mySubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">
                              {sub.project?.title || 'Industry Project'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {sub.project?.targetSkill}
                            </span>
                          </div>
                          <a
                            href={sub.githubPrUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-xs text-[#064e3b] hover:underline flex items-center gap-1 mt-1 font-semibold"
                          >
                            <span>{sub.githubPrUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div>
                          {sub.status === 'APPROVED' ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              APPROVED &amp; ENDORSED
                            </span>
                          ) : sub.status === 'REVISION_REQUESTED' ? (
                            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-black text-xs border border-rose-300 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                              REVISION REQUESTED
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              PENDING ALUMNI REVIEW
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Endorsement Rating & Feedback */}
                      {sub.endorsementScore && (
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Alumni Endorsement:</span>
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              {[...Array(sub.endorsementScore)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                              ))}
                              <span className="text-xs text-slate-900 ml-1.5 font-black">
                                {sub.endorsementScore} / 5 Stars
                              </span>
                            </div>
                          </div>

                          {sub.alumniFeedback && (
                            <p className="text-xs text-slate-700 leading-relaxed font-sans pt-1 border-t border-slate-100">
                              <strong className="text-slate-900">Alumni Feedback:</strong> {sub.alumniFeedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PR SUBMISSION DRAWER / MODAL */}
      {/* ========================================================================= */}
      {submitModalOpen && selectedProjectForSubmit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white flex items-center justify-center font-bold">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Submit Project Work for Review</h3>
                  <p className="text-xs text-slate-500">
                    Project: {selectedProjectForSubmit.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPr} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Pull Request / Repository URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={githubPrUrl}
                  onChange={(e) => setGithubPrUrl(e.target.value)}
                  placeholder="https://github.com/my-username/my-project/pull/1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Fork the starter repo, implement the acceptance criteria, and paste your public PR URL.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Submission Notes for Alumni Mentor
                </label>
                <textarea
                  rows={3}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Summarize your design patterns, concurrency controls, test coverage, and benchmark results..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPr}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] hover:from-[#044e39] text-white text-xs font-black shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingPr ? 'Submitting...' : 'Submit PR for Alumni Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMentorshipView;
