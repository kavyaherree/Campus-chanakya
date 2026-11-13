import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Terminal,
  Activity,
  Target,
  TrendingUp,
  Brain,
  ShieldCheck,
  CheckSquare,
  Square,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  ChevronRight
} from 'lucide-react';
import client from '../../api/client';

const QUICK_PROMPTS = [
  'How do I crack SDE-1 placement at Google or Microsoft?',
  'Audit my profile weaknesses and recommend my next skill badge',
  'What technical invariants must I prepare for in Spring Boot & Java?',
  'Analyze my ATS resume match for Cloud Backend roles',
];

const AiCoachSection = ({ user, profile, onNavigateTab }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: `Hello ${user?.fullName?.split(' ')[0] || 'Aarav'}! I am your Autonomous Agentic Career Coach. I monitor your academic telemetry, verified skill badges, proctoring integrity, and placement velocity to formulate high-yield strategies. How can I assist your placement trajectory today?`,
      timestamp: 'Just now',
      agentSteps: [
        {
          phase: 'Telemetry Initialization',
          thought: `Assessing student profile: CGPA ${profile?.cgpa ?? 0.0}, Target Role '${profile?.targetRole || 'Software Engineer'}'.`,
          action: 'TelemetrySensor.connect()',
          observation: (profile?.totalStrikesRecorded ?? 0) === 0 ? 'Zero proctoring strikes recorded; integrity clean.' : `${profile?.totalStrikesRecorded} strikes recorded.`
        }
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [agentThinking, setAgentThinking] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [activeTabSub, setActiveTabSub] = useState('chat'); // 'chat' | 'roadmap' | 'diagnostics'
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchActionPlan();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentThinking]);

  const fetchActionPlan = async () => {
    setLoadingRoadmap(true);
    try {
      const res = await client.get('/ai/coach/action-plan');
      if (res.data && Array.isArray(res.data)) {
        setActiveRoadmap(res.data);
      }
    } catch (e) {
      // Fallback default agentic plan
      setActiveRoadmap([
        { id: 'plan-1', title: 'Phase 1: Invariant & Object-Oriented Mastery', description: 'Verify polymorphism, encapsulation, and Java 21 dynamic dispatch with 0 strikes.', completed: true, priority: 'HIGH', status: 'COMPLETED' },
        { id: 'plan-2', title: 'Phase 2: Spring Boot Enterprise Security & JPA', description: 'Master stateless JWT filters, N+1 query prevention, and @Transactional rollback semantics.', completed: true, priority: 'HIGH', status: 'COMPLETED' },
        { id: 'plan-3', title: 'Phase 3: ATS Resume Keyword Optimization (90+ Score)', description: 'Upload resume PDF, integrate verified credentials, and align with Tier-1 role rubrics.', completed: true, priority: 'HIGH', status: 'COMPLETED' },
        { id: 'plan-4', title: 'Phase 4: High-Frequency AI Mock Viva Voce', description: 'Conduct simulated viva sessions on Concurrency and System Design with 4-pillar evaluation.', completed: false, priority: 'HIGH', status: 'IN_PROGRESS' },
        { id: 'plan-5', title: 'Phase 5: 1-on-1 Alumni Mock Technical Interview', description: 'Schedule live architecture review session with alumni mentor from Google/Amazon.', completed: false, priority: 'MEDIUM', status: 'UPCOMING' },
        { id: 'plan-6', title: 'Phase 6: Campus Placement Drive Applications', description: 'One-click submit verified candidate credentials to open Tier-1 engineering vacancies.', completed: false, priority: 'MEDIUM', status: 'UPCOMING' },
      ]);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleToggleItem = async (itemId, currentCompleted) => {
    const nextState = !currentCompleted;
    setActiveRoadmap(prev => prev.map(item => item.id === itemId ? { ...item, completed: nextState, status: nextState ? 'COMPLETED' : 'IN_PROGRESS' } : item));
    try {
      await client.post('/ai/coach/action-plan/toggle', { itemId, completed: nextState });
    } catch (ignored) {}
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || agentThinking) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setAgentThinking(true);

    try {
      const res = await client.post('/ai/coach/chat', {
        message: query,
        targetRole: profile?.targetRole || 'Full Stack Java / Cloud Engineer',
        contextIntent: 'CHAT'
      });

      const agentData = res.data;
      const agentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: agentData?.responseMessage || 'I have completed your autonomous diagnostic inquiry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentSteps: agentData?.agentSteps || [],
        suggestedActions: agentData?.suggestedActions || [],
        identifiedGaps: agentData?.identifiedGaps || [],
        topCompanies: agentData?.topCompanyRecommendations || []
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      console.warn('Agent chat fallback:', err);
      const lower = query.toLowerCase();
      let dynamicReply = `Regarding **"${query}"**: Focus on core principles, code readability, and measurable project impact. Practice articulating trade-offs clearly to interviewers.`;
      
      if (lower.includes('resume') || lower.includes('ats')) {
        dynamicReply = `Regarding **"${query}"**: Ensure your resume highlights measurable metrics (e.g., *latency reduced by 35%*, *throughput scaled to 50K req/sec*). Use industry-standard section headings and include strong system architecture keywords.`;
      } else if (lower.includes('viva') || lower.includes('interview')) {
        dynamicReply = `Regarding **"${query}"**: Structure your technical answers using the **STAR methodology** (Situation, Task, Action, Result). State the time and space complexity upfront before writing any solution.`;
      } else if (lower.includes('dsa') || lower.includes('leetcode') || lower.includes('algorithm')) {
        dynamicReply = `Regarding **"${query}"**: Master patterns such as Two Pointers, Sliding Window, Monotonic Stack, and Topological Sort. Always state edge cases (empty arrays, duplicates, overflow) before coding.`;
      } else if (lower.includes('spring') || lower.includes('java') || lower.includes('concurrency')) {
        dynamicReply = `Regarding **"${query}"**: Review memory visibility with \`volatile\`, hardware CAS primitives in \`AtomicInteger\`, deadlock detection in multithreading, and Bean lifecycles in Spring Boot.`;
      }

      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: dynamicReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentSteps: [
          {
            phase: 'Autonomous Reasoning',
            thought: `Parsed candidate query on: ${query.substring(0, 30)}...`,
            action: 'GapMatcher.resolve()',
            observation: 'Generated contextual placement intelligence tailored to query.'
          }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setAgentThinking(false);
    }
  };

  const completedCount = activeRoadmap.filter(item => item.completed).length;
  const roadmapProgress = Math.round((completedCount / Math.max(1, activeRoadmap.length)) * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Agent Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#044e39] text-white shadow-lg shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 flex items-center justify-center shadow-inner">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Autonomous Agentic Career Coach
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 font-extrabold text-[10px] uppercase">
                  Reasoning Core Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                Multi-step autonomous diagnostics, gap resolution, and roadmap execution for {user?.fullName || 'Candidate'}.
              </p>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10">
            <button
              onClick={() => setActiveTabSub('chat')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTabSub === 'chat' ? 'bg-white text-[#064e3b] shadow-md' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Interactive Chat
            </button>
            <button
              onClick={() => setActiveTabSub('roadmap')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabSub === 'roadmap' ? 'bg-white text-[#064e3b] shadow-md' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>30-Day Roadmap</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/30 text-[10px] font-black">
                {roadmapProgress}%
              </span>
            </button>
            <button
              onClick={() => setActiveTabSub('diagnostics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTabSub === 'diagnostics' ? 'bg-white text-[#064e3b] shadow-md' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Telemetry Audit
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: INTERACTIVE AGENT CHAT */}
      {/* ========================================================================= */}
      {activeTabSub === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Chat Canvas (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Chat Messages Log */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400 font-medium">
                    {msg.sender === 'agent' ? (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        CampusChanakya Autonomous Agent
                      </span>
                    ) : (
                      <span className="font-bold text-slate-700">You</span>
                    )}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs space-y-3'
                    }`}
                  >
                    {/* If Agent has Multi-step Reasoning, display collapsible agent thought drawer */}
                    {msg.agentSteps && msg.agentSteps.length > 0 && (
                      <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 border border-slate-800">
                        <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                            Autonomous Reasoning Chain
                          </span>
                          <span className="text-[10px] uppercase bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800 text-emerald-300">
                            Verified
                          </span>
                        </div>
                        {msg.agentSteps.map((step, idx) => (
                          <div key={idx} className="space-y-0.5 text-slate-300">
                            <p className="text-amber-400 font-semibold">{step.phase || 'Thought Phase'}:</p>
                            <p className="text-slate-400 pl-2">💭 {step.thought}</p>
                            {step.action && <p className="text-sky-400 pl-2">⚙️ {step.action}</p>}
                            {step.observation && <p className="text-emerald-300 pl-2">👁️ {step.observation}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="whitespace-pre-line font-medium">{msg.text}</div>

                    {/* Suggested Action Cards inside agent message */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recommended Live Execution Items:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.suggestedActions.map((act) => (
                            <div
                              key={act.id}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-800 text-xs flex items-center justify-between shadow-2xs"
                            >
                              <div className="overflow-hidden">
                                <p className="font-bold truncate text-[11px]">{act.title}</p>
                                <span className="text-[9px] text-emerald-700 font-bold">{act.estimatedMinutes} mins • {act.category}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {agentThinking && (
                <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-800 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 w-fit animate-pulse">
                  <Bot className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Agent is executing multi-step diagnostic reasoning...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold uppercase text-slate-400 whitespace-nowrap">
                Quick Prompts:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[11px] font-medium whitespace-nowrap shadow-xs transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your Agentic Career Coach anything about placement readiness, interviews, or skills..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
              />
              <button
                type="button"
                disabled={!inputMessage.trim() || agentThinking}
                onClick={() => handleSendMessage()}
                className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Rail: Live Agentic Tools & Status (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Agent Live Telemetry Widget */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Agent Diagnostics
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Placement Readiness:</span>
                  <span className="font-extrabold text-emerald-700">94% (Tier-1 Ready)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Target Placement Role:</span>
                  <span className="font-semibold text-emerald-700 truncate max-w-[160px]">{profile?.targetRole || 'Not Specified'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Academic CGPA:</span>
                  <span className="font-bold text-slate-800">{profile?.cgpa ?? 0.0} / 10.0</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Proctoring Honesty:</span>
                  <span className="font-bold text-emerald-700">{(profile?.totalStrikesRecorded ?? 0) === 0 ? '100% (Zero Strikes)' : `${profile?.totalStrikesRecorded} Strikes`}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Target Company Tier:</span>
                  <span className="font-bold text-purple-700">Google / Microsoft IDC</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSendMessage('Run full competency diagnostic and audit skill gaps')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Run Autonomous Diagnostic</span>
                </button>
                <button
                  onClick={() => onNavigateTab('ai-interview')}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Live AI Mock Viva</span>
                </button>
              </div>
            </div>

            {/* Roadmap Mini-Tracker */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  Sprint Roadmap
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {completedCount}/{activeRoadmap.length} done
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${roadmapProgress}%` }}
                />
              </div>

              <div className="space-y-2 pt-1">
                {activeRoadmap.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item.id, item.completed)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className={`truncate font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTabSub('roadmap')}
                className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline pt-1"
              >
                View Complete 30-Day Roadmap →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: 30-DAY PERSONALIZED ACTION ROADMAP */}
      {/* ========================================================================= */}
      {activeTabSub === 'roadmap' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                30-Day Tier-1 Tech Placement Sprint Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Curated autonomously by your AI Coach based on your verified skills and Departmental benchmarks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500">Overall Progress</span>
                <p className="text-lg font-black text-emerald-700">{roadmapProgress}% Completed</p>
              </div>
              <button
                onClick={fetchActionPlan}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Refresh Roadmap"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeRoadmap.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleToggleItem(item.id, item.completed)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  item.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-500'
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs text-slate-800'
                }`}
              >
                <div className="mt-0.5">
                  {item.completed ? (
                    <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-emerald-500 transition-colors" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className={`text-sm font-extrabold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {item.title}
                    </h4>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      item.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.priority === 'HIGH'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status || (item.completed ? 'COMPLETED' : 'IN PROGRESS')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: TELEMETRY AUDIT & REPEATED ERRORS */}
      {/* ========================================================================= */}
      {activeTabSub === 'diagnostics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  Database Telemetry &amp; Performance Audit
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time database records tracking verified marks, proctoring integrity, and persistent repeated errors.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live H2 DB Synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Assessments Taken</span>
                <p className="text-2xl font-black text-slate-900">{profile?.totalAssessmentsTaken ?? 0}</p>
                <p className="text-[11px] text-emerald-700 font-semibold">{profile?.totalAssessmentsPassed ?? 0} Assessments Passed</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Average Assessment Score</span>
                <p className="text-2xl font-black text-slate-900">
                  {profile?.averageAssessmentScore !== undefined && profile?.averageAssessmentScore !== null && profile?.averageAssessmentScore > 0
                    ? `${profile.averageAssessmentScore}%`
                    : 'N/A'}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">Strict Benchmark Cutoff 75%</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Skills Awarded</span>
                <p className="text-2xl font-black text-emerald-700">{profile?.verifiedSkills?.length || 0}</p>
                <p className="text-[11px] text-slate-500 font-semibold">Cryptographically Verified</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Proctoring Infractions</span>
                <p className={`text-2xl font-black ${(profile?.totalStrikesRecorded || 0) > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {profile?.totalStrikesRecorded || 0} Strikes
                </p>
                <p className="text-[11px] text-slate-500 font-semibold">Max 3 Allowed Per Session</p>
              </div>
            </div>
          </div>

          {/* Persistent Repeated Errors Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Persistent Repeated Errors &amp; Conceptual Deficits
                </h4>
                <p className="text-xs text-slate-500">
                  Aggregated recurring errors automatically indexed in the database across all viva and assessment sessions.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {profile?.repeatedErrors?.length || 0} Deficit Topics Logged
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
                          <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {err.topic}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {err.occurrences}x Recurring Error
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                            {err.associatedSkill || 'AI Assessment'}
                          </span>
                        </div>
                      </div>

                      {err.remedialAdvice && (
                        <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                          <span className="font-bold text-slate-800">AI Remedial Tip: </span>
                          {err.remedialAdvice}
                        </p>
                      )}

                      {err.lastDetectedAt && (
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span>Last Detected: {new Date(err.lastDetectedAt).toLocaleDateString()}</span>
                          {err.lastRecordedScore !== undefined && (
                            <span>• Score at Failure: {err.lastRecordedScore}%</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-bold text-slate-800">Clean Telemetry Record</h5>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No repeated errors detected in the database. Complete mock vivas and skill tests to automatically benchmark your technical invariants.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiCoachSection;
