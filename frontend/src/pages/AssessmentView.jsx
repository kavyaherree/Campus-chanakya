import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import Card from '../components/Card';
import { ShieldAlert, Maximize2, Minimize2, CheckCircle2, AlertTriangle, Send, Code, BookOpen, ArrowLeft } from 'lucide-react';

export const AssessmentView = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const [tabWarning, setTabWarning] = useState('');
  const [submissionType, setSubmissionType] = useState('MCQ'); // 'MCQ' or 'CODE'
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '' });
  const [sourceCode, setSourceCode] = useState(`// Implement the requested Java OOP solution here
public class Solution {
    // Encapsulate properties
    private int score;

    public Solution(int score) {
        this.score = score;
    }

    public int getScore() {
        return this.score;
    }
}`);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch skill details
  useEffect(() => {
    client.get('/assessments/skills')
      .then(res => {
        const found = res.data.find(s => s.id.toString() === skillId);
        setSkill(found || { name: 'Java OOP Fundamentals', passingCutoff: 75 });
      })
      .catch(() => {
        setSkill({ name: 'Java OOP Invariants', passingCutoff: 75 });
      });
  }, [skillId]);

  // Anti-cheating proctoring event listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordStrikeViolation('TAB_SWITCH');
      }
    };

    const handleWindowBlur = () => {
      recordStrikeViolation('WINDOW_DEFOCUS');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  const recordStrikeViolation = (reason) => {
    setStrikes(prev => {
      const nextStrikes = prev + 1;
      setTabWarning(`Proctoring Strike #${nextStrikes} recorded: Tab switch or defocus detected. Integrity deduction applied.`);
      setTimeout(() => setTabWarning(''), 5000);
      return nextStrikes;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let finalScore = 0;
      let passed = false;

      if (submissionType === 'MCQ') {
        let correctCount = 0;
        if (answers.q1 === 'A') correctCount++;
        if (answers.q2 === 'C') correctCount++;
        if (answers.q3 === 'B') correctCount++;
        const rawScore = (correctCount / 3) * 100;
        const penalty = strikes * 5;
        finalScore = Math.max(0, rawScore - penalty);
        passed = finalScore >= (skill?.passingCutoff || 75);
      } else {
        const code = sourceCode.toLowerCase();
        let codeScore = 60;
        if (code.includes('private') && code.includes('public')) codeScore += 15;
        if (code.includes('class') && code.includes('return')) codeScore += 15;
        const penalty = strikes * 5;
        finalScore = Math.max(0, codeScore - penalty);
        passed = finalScore >= (skill?.passingCutoff || 75);
      }

      const payload = {
        skillId: Number(skillId),
        score: finalScore,
        passed: passed,
        strikesCount: strikes,
        weakTopicsCsv: passed ? '' : 'Encapsulation Invariants, JVM Runtime vtable dispatch',
        codeSnippet: submissionType === 'CODE' ? sourceCode : null
      };

      try {
        const res = await client.post('/assessments/submit', payload);
        setResult(res.data);
      } catch (postErr) {
        setResult({
          score: finalScore,
          passed: passed,
          strikesCount: strikes,
          feedback: passed
            ? `Congratulations! You verified ${skill?.name || 'this technical competency'} with a score of ${finalScore.toFixed(1)}%.`
            : `Cutoff missed (${finalScore.toFixed(1)}% vs ${skill?.passingCutoff || 75}% required). An AI remedial recovery plan has been generated.`
        });
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-6 animate-fade-in">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            {result.passed ? <CheckCircle2 className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12 text-amber-600" />}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {result.passed ? 'Competency Verified Successfully!' : 'Cutoff Not Reached'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Assessment target: {skill?.name} • Passing Requirement: {skill?.passingCutoff || 75}%
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Final Score</span>
              <span className="text-3xl font-extrabold text-emerald-700 font-mono mt-1 block">
                {result.score?.toFixed(1)}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Proctoring Strikes</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">
                {result.strikesCount || strikes}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed text-left">
            {result.feedback}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/student')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors text-center"
            >
              Return to Student Hub
            </button>
            {!result.passed && (
              <button
                onClick={() => navigate('/student?tab=redemption')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs transition-all text-center"
              >
                Access AI Remedial Plan
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Proctoring HUD Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl flex-shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Proctored Environment Active</span>
              <span className="text-[11px] font-extrabold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {strikes} Strikes
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Tab-switching and window defocusing will incur automatic score deductions.
            </p>
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200 flex-shrink-0"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Enable Fullscreen'}</span>
        </button>
      </div>

      {tabWarning && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{tabWarning}</span>
        </div>
      )}

      {/* Evaluation Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 w-full sm:w-fit">
        <button
          onClick={() => setSubmissionType('MCQ')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            submissionType === 'MCQ'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Viva Concept Questions (MCQ)</span>
        </button>
        <button
          onClick={() => setSubmissionType('CODE')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            submissionType === 'CODE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Live OOP Implementation (Code)</span>
        </button>
      </div>

      {/* Main Question Body */}
      <Card
        title={`Verification Assessment: ${skill?.name || 'Java OOP'}`}
        subtitle={`Required passing score: ${skill?.passingCutoff || 75}%`}
      >
        {submissionType === 'MCQ' ? (
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-sm font-extrabold text-slate-900">
                1. Which of the following best exemplifies strict Encapsulation in Java?
              </p>
              <div className="space-y-2 text-xs">
                {[
                  { key: 'A', text: 'Private fields with validated getters and setters enforcing domain invariants.' },
                  { key: 'B', text: 'Public static variables accessible globally across all package classes.' },
                  { key: 'C', text: 'Declaring all methods abstract inside an interface.' },
                  { key: 'D', text: 'Creating deep multiple inheritance hierarchies.' }
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      answers.q1 === opt.key
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q1"
                      value={opt.key}
                      checked={answers.q1 === opt.key}
                      onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
                      className="accent-emerald-600"
                    />
                    <span><strong className="text-slate-900">{opt.key}.</strong> {opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-sm font-extrabold text-slate-900">
                2. In runtime Polymorphism, which mechanism in the Java Virtual Machine (JVM) resolves overridden methods?
              </p>
              <div className="space-y-2 text-xs">
                {[
                  { key: 'A', text: 'Static bytecode linking at compile time.' },
                  { key: 'B', text: 'Heap garbage collection sweep.' },
                  { key: 'C', text: 'Virtual method table (vtable) dispatch based on actual runtime object type.' },
                  { key: 'D', text: 'Thread-local stack memory swapping.' }
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      answers.q2 === opt.key
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q2"
                      value={opt.key}
                      checked={answers.q2 === opt.key}
                      onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                      className="accent-emerald-600"
                    />
                    <span><strong className="text-slate-900">{opt.key}.</strong> {opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-sm font-extrabold text-slate-900">
                3. What is the fundamental difference between an Abstract Class and an Interface in modern Java?
              </p>
              <div className="space-y-2 text-xs">
                {[
                  { key: 'A', text: 'Interfaces cannot contain default or static methods.' },
                  { key: 'B', text: 'Abstract classes can hold state (instance fields) and constructors, whereas interfaces cannot.' },
                  { key: 'C', text: 'A class can extend multiple abstract classes simultaneously.' },
                  { key: 'D', text: 'Interfaces are deprecated in modern Spring Boot architectures.' }
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      answers.q3 === opt.key
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q3"
                      value={opt.key}
                      checked={answers.q3 === opt.key}
                      onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
                      className="accent-emerald-600"
                    />
                    <span><strong className="text-slate-900">{opt.key}.</strong> {opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Implement a Java class demonstrating <strong>Encapsulation</strong>, <strong>Inheritance</strong>, and <strong>Polymorphism</strong> with private fields and an overridden method.
            </p>
            <textarea
              rows={14}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full p-4 bg-slate-50 font-mono text-xs text-slate-900 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        )}

        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => navigate('/student')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Cancel Evaluation
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Grading Polymorphically...' : 'Submit Assessment'}</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentView;
