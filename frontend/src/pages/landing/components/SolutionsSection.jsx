import React from 'react';
import { Terminal, CheckCircle2, Users, Briefcase, Shield } from 'lucide-react';

export const SolutionsSection = ({ onSelectSolution }) => {
  const pillars = [
    {
      id: 'coding_tests',
      icon: Terminal,
      title: 'Online Coding Tests',
      desc: 'Timed coding environments with automated test cases and anti-cheat tracking to assess real problem-solving ability.',
      badge: 'Assessment Tests',
      badgeIcon: Shield,
      accent: '#059669',
      accentBg: '#ecfdf5'
    },
    {
      id: 'skill_reports',
      icon: CheckCircle2,
      title: 'Skill Scorecards',
      desc: 'Instant, objective scorecards showing student strengths across Data Structures, Java, Python, and Web Development.',
      badge: 'Verified Scores',
      badgeIcon: CheckCircle2,
      accent: '#0284c7',
      accentBg: '#f0f9ff'
    },
    {
      id: 'referrals',
      icon: Users,
      title: 'Alumni Mentorship',
      desc: 'Connect students with working alumni for 1-on-1 interview preparation, project feedback, and job referrals.',
      badge: 'Alumni Network',
      badgeIcon: Users,
      accent: '#7c3aed',
      accentBg: '#f5f3ff'
    },
    {
      id: 'recruiter_hub',
      icon: Briefcase,
      title: 'Recruiter Hiring Hub',
      desc: 'Filter candidates by branch, CGPA, and verified test scores to shortlist and schedule interviews directly.',
      badge: 'Campus Hiring',
      badgeIcon: Briefcase,
      accent: '#059669',
      accentBg: '#ecfdf5'
    }
  ];

  return (
    <section className="pillars-section reveal-on-scroll" id="solutions">
      <div className="pillars-container">
        
        {/* Section Header */}
        <div className="pillars-header">
          <div>
            <span className="section-eyebrow">CORE MODULES</span>
            <h2 className="section-heading">Four tools built for campus placements</h2>
            <p className="section-subheading">
              A unified platform for students to practice, alumni to mentor, and recruiters to hire with confidence.
            </p>
          </div>
        </div>

        {/* 4 Clean Pillars Grid */}
        <div className="pillars-grid">
          {pillars.map((p) => {
            const Icon = p.icon;
            const BadgeIcon = p.badgeIcon;
            return (
              <div
                key={p.id}
                className="pillar-card"
                onClick={() => onSelectSolution && onSelectSolution({
                  title: p.title,
                  desc: p.desc,
                  tag: p.badge
                })}
              >
                <div className="pillar-icon-box" style={{ background: p.accentBg, color: p.accent }}>
                  <Icon size={24} />
                </div>

                <div className="pillar-content">
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-desc">{p.desc}</p>
                </div>

                <div className="pillar-badge" style={{ color: p.accent }}>
                  <BadgeIcon size={14} />
                  <span>{p.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SolutionsSection;
