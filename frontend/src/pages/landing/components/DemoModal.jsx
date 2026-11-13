import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  X, 
  GraduationCap, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Code2, 
  CheckCircle2, 
  Terminal,
  Cpu,
  Layers,
  Award
} from 'lucide-react';

export const DemoModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'oopj'
  const [loggingInRole, setLoggingInRole] = useState(null);

  if (!isOpen) return null;

  const demoRoles = [
    {
      role: 'STUDENT',
      title: 'Student Candidate',
      email: 'anjalimalik.7056408607.12@gmail.com',
      password: 'password123',
      name: 'Anjali Malik · CSE (9.1 CGPA)',
      icon: GraduationCap,
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      destination: '/student',
      badge: 'Student Portal',
      features: [
        'Proctored coding sandbox with anti-cheat strike telemetry',
        'AI Mock Viva Voce with Socratic dynamic question generator',
        'Real-time ATS Resume Scanner & Keyword Match Analyzer',
        'Verified Skill Badges & RIASEC Holland Code Career Radar'
      ]
    },
    {
      role: 'ALUMNI',
      title: 'Alumni Mentor',
      email: 'kavyakhurana70@gmail.com',
      password: 'password123',
      name: 'Kavya Khurana · Alumni Mentor',
      icon: Users,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      borderColor: '#bae6fd',
      destination: '/alumni',
      badge: 'Alumni Portal',
      features: [
        'Micro & Macro industry project creation with starter repos',
        'Student PR review queue & code architecture endorsements',
        '1-on-1 mentorship video slot scheduling and management',
        'Track mentee placement readiness and skill velocity'
      ]
    },
    {
      role: 'RECRUITER',
      title: 'Corporate Recruiter',
      email: 'ranarainam@gmail.com',
      password: 'password123',
      name: 'Rainam Rana · Corporate Recruiter',
      icon: Briefcase,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      destination: '/recruiter',
      badge: 'Recruiter Hub',
      features: [
        'Post placement vacancies with minimum CGPA & skill criteria',
        'Automated ATS ranking of candidate applicants',
        'Filter applicants by verified test scores & proctor integrity',
        'One-click candidate status workflow (Shortlist, Hire, Archive)'
      ]
    },
    {
      role: 'SUPER_ADMIN',
      title: 'Academic Governance & Superadmin',
      email: 'kavyauncut@gmail.com',
      password: 'password123',
      name: 'Kavya Superadmin · Academic Governance',
      icon: ShieldCheck,
      color: '#0f172a',
      bgColor: '#f8fafc',
      borderColor: '#cbd5e1',
      destination: '/admin',
      badge: 'Superadmin Tier 1',
      features: [
        'OOPJ & SOLID Design viva reference architecture audit',
        'Two-tier governance: Handle and onboard colleges',
        'University-wide student and recruiter stakeholder directory',
        'H2 Database metrics and system infrastructure telemetry'
      ]
    }
  ];

  const handleOneClickLogin = async (roleConfig) => {
    setLoggingInRole(roleConfig.role);
    try {
      await login(roleConfig.email, roleConfig.password);
      onClose();
      navigate(roleConfig.destination);
    } catch (err) {
      console.warn('Demo login failed, routing directly:', err);
      onClose();
      navigate(roleConfig.destination);
    } finally {
      setLoggingInRole(null);
    }
  };

  const oopjPillars = [
    {
      pillar: 'Encapsulation',
      file: 'User.java, StudentProfile.java, Assessment.java',
      concept: 'Private fields, immutability where applicable, validated setters guarding business invariants (e.g., CGPA bound between 0.0 and 10.0).'
    },
    {
      pillar: 'Inheritance',
      file: 'BaseEntity.java (@MappedSuperclass)',
      concept: 'Common primary keys, createdAt and updatedAt JPA audit timestamps inherited across all domain entities without schema duplication.'
    },
    {
      pillar: 'Polymorphism',
      file: 'SkillEvaluator.java, McqEvaluator.java, CodeEvaluator.java',
      concept: 'Strategy Pattern: Dynamic JVM vtable dispatch selects the concrete evaluator algorithm at runtime without conditional spaghetti.'
    },
    {
      pillar: 'Abstraction',
      file: 'EvaluatorFactory.java, AuthService, JobService',
      concept: 'Clean interface contracts decoupling REST controllers from underlying JPA queries, persistence transactions, and validation logic.'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-box" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '860px', 
          width: 'min(95vw, 860px)',
          maxHeight: '90dvh', 
          overflowY: 'auto',
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0'
        }}
      >
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          style={{ background: '#f1f5f9', color: '#475569', borderRadius: '50%', padding: '0.4rem' }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          <span>Interactive Academic Viva &amp; Demo Console</span>
        </div>

        <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Explore CampusChanakya Roles &amp; Architecture
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Select any persona below for <strong>instant 1-click login</strong> into their authenticated portal, or inspect the OOPJ reference design principles built for academic viva evaluation.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px', width: '100%', maxWidth: '100%', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('roles')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              flex: '1 1 auto',
              textAlign: 'center',
              background: activeTab === 'roles' ? '#ffffff' : 'transparent',
              color: activeTab === 'roles' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'roles' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            1-Click Demo Portals (4 Roles)
          </button>
          <button
            onClick={() => setActiveTab('oopj')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              flex: '1 1 auto',
              textAlign: 'center',
              background: activeTab === 'oopj' ? '#ffffff' : 'transparent',
              color: activeTab === 'oopj' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'oopj' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            OOPJ Viva Reference Guide
          </button>
        </div>

        {/* TAB 1: 4 DEMO ROLES */}
        {activeTab === 'roles' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {demoRoles.map((demo) => {
              const Icon = demo.icon;
              const isLoggingIn = loggingInRole === demo.role;
              return (
                <div
                  key={demo.role}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${demo.borderColor}`,
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: demo.bgColor, color: demo.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{demo.title}</h4>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{demo.name}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '9999px', background: demo.bgColor, color: demo.color, border: `1px solid ${demo.borderColor}` }}>
                        {demo.badge}
                      </span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {demo.features.map((feat, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                          <CheckCircle2 size={13} color={demo.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOneClickLogin(demo)}
                    disabled={isLoggingIn}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      background: demo.color,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      transition: 'opacity 0.15s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span>{isLoggingIn ? 'Logging in...' : `1-Click Launch ${demo.title}`}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: OOPJ VIVA GUIDE */}
        {activeTab === 'oopj' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '14px', fontSize: '0.82rem', color: '#065f46' }}>
              <strong>Viva Examiner Quick Reference:</strong> CampusChanakya was architected from the ground up to demonstrate all 4 pillars of Object-Oriented Programming (OOPJ) and SOLID principles in Java 17+ and Spring Boot 3.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
              {oopjPillars.map((item, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      0{idx + 1}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      {item.pillar}
                    </h4>
                  </div>

                  <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#0284c7', background: '#e0f2fe', padding: '0.2rem 0.5rem', borderRadius: '6px', width: 'fit-content', marginBottom: '0.5rem' }}>
                    {item.file}
                  </div>

                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                    {item.concept}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Default test credential: <code>password123</code> across all seeded accounts.
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '9px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};

export default DemoModal;