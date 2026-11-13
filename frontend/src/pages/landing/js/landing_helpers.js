/**
 * Helper Functions and Presets for Landing Page
 */

export const HERO_PRESETS = {
  diagnostic: {
    title: "Automated AI Remediation Engine (< 70%)",
    analogy: "Instead of a dead-end rejection, failing hidden test suites triggers multi-agent telemetry to inspect stack traces and compiler outputs, generating a custom Socratic recovery roadmap.",
    nodes: [
      { step: "1", title: "Failure Telemetry Capture", desc: "Monitors memory leaks, runtime crashes, and edge case failures." },
      { step: "2", title: "Stack Trace Diagnosis", desc: "Autonomous agent isolates conceptual gaps (e.g. pointer misuse, time complexity)." },
      { step: "3", title: "Dynamic Roadmap Assembly", desc: "Curriculum agent references technical docs to compile tailored recovery steps." },
      { step: "4", title: "Socratic Practice Tutor", desc: "Interactive hints guide logic-building without exposing direct code solutions." }
    ]
  },
  proctored: {
    title: "Proctored Skill Verification Sandbox (≥ 70%)",
    analogy: "Institutional SSO access ties challenges directly to student credentials while monitoring blur events and paste bursts, validating authentic engineering capability for corporate recruiters.",
    nodes: [
      { step: "1", title: "Institutional SSO Integration", desc: "Prevents duplicate accounts or unauthorized proxy test-taking." },
      { step: "2", title: "Anti-Cheat Telemetry", desc: "Monitors window blur, tab switching, and clipboard paste bursts." },
      { step: "3", title: "70% Objective Gating", desc: "Strict benchmark enforced before a technical skill can be officially verified." },
      { step: "4", title: "Verifiable Badge Issuance", desc: "Cryptographically signed proof showcased directly on candidate profile." }
    ]
  }
};

export const SYSTEM_METRICS = [
  { value: "0%", label: "Unverified Resume Inflation", color: "#00e676" },
  { value: "100%", label: "Proctored Skill Verification", color: "#06b6d4" },
  { value: "<7/10", label: "Automated Socratic Remediation", color: "#fbbf24" },
  { value: "≥7/10", label: "Competency-Gated Mentorship", color: "#f8fafc" }
];
