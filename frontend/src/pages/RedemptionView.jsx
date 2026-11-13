import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import Card from '../components/Card';
import { CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, BookOpen, AlertCircle, X } from 'lucide-react';

export const RedemptionView = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await client.get('/redemption/my-plans');
      setPlans(res.data || []);
    } catch (err) {
      console.error('Failed to load redemption plans', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (planId, skillId) => {
    try {
      await client.patch(`/redemption/complete/${planId}`);
      setNotice({
        type: 'success',
        message: 'Congratulations! Remediation schedule marked complete. Re-attempt token unlocked.',
        skillId: skillId
      });
      fetchPlans();
    } catch (err) {
      setNotice({
        type: 'error',
        message: 'Failed to update plan status. Please verify your connection.'
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
            Automated Academic Remediation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 flex items-center gap-2 tracking-tight">
            Redemption Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            When an assessment score falls below cutoff, CampusChanakya generates a targeted 3-day recovery schedule to reinforce conceptual weak spots before unlocking re-tests.
          </p>
        </div>
      </div>

      {notice && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold animate-fade-in ${
          notice.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            <span>{notice.message}</span>
          </div>
          <div className="flex items-center gap-2">
            {notice.skillId && (
              <button
                onClick={() => navigate(`/assessment/${notice.skillId}`)}
                className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Re-take Assessment Now
              </button>
            )}
            <button onClick={() => setNotice(null)} className="p-1 rounded-md hover:bg-black/5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading your remediation schedules...</div>
      ) : plans.length === 0 ? (
        <Card title="No Active Remediation Plans" icon={ShieldCheck}>
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-extrabold text-slate-900">You are all clear!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Either all attempted skill assessments were successfully verified above cutoff, or you have not taken an assessment yet.
            </p>
            <button
              onClick={() => navigate('/student')}
              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Browse Available Skills
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {plans.map((plan) => {
            let parsedRoadmap = null;
            try {
              parsedRoadmap = JSON.parse(plan.roadmapJson);
            } catch (e) {
              console.error('Failed to parse roadmap JSON', e);
            }

            return (
              <Card
                key={plan.id}
                title={`3-Day Remediation: ${plan.assessment?.skill?.name || 'Java OOP'}`}
                subtitle={`Identified Weak Topics: ${plan.weakTags}`}
                icon={CheckCircle2}
                action={
                  plan.completed ? (
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      Roadmap Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleComplete(plan.id, plan.assessment?.skill?.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      Mark Completed &amp; Re-attempt
                    </button>
                  )
                }
              >
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {parsedRoadmap && parsedRoadmap.days ? (
                      parsedRoadmap.days.map((day, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Day {idx + 1}</span>
                          <h4 className="text-sm font-extrabold text-slate-900">{day.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{day.task}</p>
                          <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Estimated 45 mins</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-xs text-slate-500 py-4 text-center">
                        Review core OOPJ principles: Encapsulation, Polymorphic Strategy dynamic dispatch, and runtime exception handling before retaking.
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RedemptionView;