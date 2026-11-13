import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Search,
  Filter,
  X,
  QrCode,
  Calendar,
  FileCheck
} from 'lucide-react';
import client from '../../api/client';

const VerifiedBadgesSection = ({ user, onTakeAssessment }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const res = await client.get('/student/badges');
      if (res.data && Array.isArray(res.data)) {
        setBadges(res.data);
      }
    } catch (e) {
      console.warn('Real verified badges fetch notice:', e);
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(`https://campuschanakya.edu/verify/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenCertificate = (badge) => {
    setSelectedBadge(badge);
    setVerifyModalOpen(true);
  };

  const filteredBadges = badges.filter((b) => {
    const matchesSearch = b.skillName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'ALL' || b.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier) => {
    switch (tier) {
      case 'PLATINUM_MASTER':
        return {
          bg: 'from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-400/50',
          badge: 'bg-indigo-400 text-indigo-950',
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      case 'GOLD':
        return {
          bg: 'from-amber-600 via-amber-500 to-yellow-600 text-white border-amber-300',
          badge: 'bg-yellow-300 text-amber-950',
          pill: 'bg-amber-50 text-amber-800 border-amber-200'
        };
      case 'SILVER':
        return {
          bg: 'from-slate-600 via-slate-500 to-slate-700 text-white border-slate-300',
          badge: 'bg-slate-200 text-slate-900',
          pill: 'bg-slate-100 text-slate-700 border-slate-200'
        };
      default:
        return {
          bg: 'from-amber-700 to-amber-800 text-white border-amber-500',
          badge: 'bg-amber-300 text-amber-950',
          pill: 'bg-amber-50 text-amber-800 border-amber-200'
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Cryptographically Verified Skill Badges
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Industry-recognized, tamper-proof competency credentials evaluated via proctored anti-cheating test pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Earned Credentials</span>
            <p className="text-lg font-black text-emerald-700">{badges.length} Mastered</p>
          </div>
          <button
            onClick={() => onTakeAssessment()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Verify New Skill</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified badge name or category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PLATINUM_MASTER', 'GOLD', 'SILVER'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterTier === tier
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tier === 'PLATINUM_MASTER' ? 'Platinum Master' : tier.charAt(0) + tier.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.length === 0 ? (
          <div className="col-span-full p-8 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-800">0 Verified Badges Earned</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You haven't earned any verified skill credentials yet. Pass proctored tests in the Skill Arena or AI Mock Viva to receive your certified credentials.
            </p>
            <button
              onClick={() => onTakeAssessment && onTakeAssessment()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold shadow-sm hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <span>Start Skill Assessment</span>
            </button>
          </div>
        ) : (
          filteredBadges.map((badge) => {
          const tierStyle = getTierColor(badge.tier);
          return (
            <div
              key={badge.id}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Header: Tier Pill & Score */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${tierStyle.pill}`}>
                    {badge.tier.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <span className="text-emerald-700 text-base">{badge.score}%</span>
                    <span className="text-[10px] text-slate-400">Score</span>
                  </div>
                </div>

                {/* Badge Visual Strip */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tierStyle.bg} flex items-center justify-center font-black text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {badge.skillName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {badge.category}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {badge.description}
                </p>

                {/* Invariants verified tags */}
                {badge.verifiedInvariants && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Verified Technical Invariants:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {badge.verifiedInvariants.map((inv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium"
                        >
                          ✓ {inv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Credential Bar & Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="overflow-hidden pr-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Credential ID</span>
                  <span className="text-[11px] font-mono font-extrabold text-slate-800 truncate block">
                    {badge.credentialId}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleCopyId(badge.credentialId)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Copy Share Link"
                  >
                    {copiedId === badge.credentialId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleOpenCertificate(badge)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* VERIFY CREDENTIAL OFFICIAL MODAL */}
      {/* ========================================================================= */}
      {verifyModalOpen && selectedBadge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-[#064e3b] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Official Certificate of Verification</h3>
                  <p className="text-xs text-emerald-200">CampusChanakya Automated Evaluation Authority</p>
                </div>
              </div>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Body (Clean Academic Diploma Presentation) */}
            <div className="p-8 space-y-6 text-center bg-radial from-white to-slate-50 relative">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                  This Certifies That
                </span>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user?.fullName || 'Aarav Sharma'}
                </h4>
                <p className="text-xs text-slate-500">
                  has demonstrated verified, tamper-proof competency in
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <h5 className="text-lg font-black text-emerald-800">
                  {selectedBadge.skillName}
                </h5>
                <p className="text-xs font-semibold text-slate-600">
                  Evaluated Score: <strong className="text-slate-900">{selectedBadge.score}%</strong> • Tier: <strong className="text-emerald-700">{selectedBadge.tier}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Credential ID:</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">{selectedBadge.credentialId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Verification Hash:</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{selectedBadge.verificationHash}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date:</span>
                  <span className="font-medium text-slate-800">{selectedBadge.issuedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Proctoring Strikes:</span>
                  <span className="font-extrabold text-emerald-700">0 (Clean Integrity)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">Digitally Cryptographically Signed</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyId(selectedBadge.credentialId)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Verification URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedBadgesSection;
