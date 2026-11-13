import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  ArrowRight, 
  Terminal, 
  BookOpen, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  GraduationCap, 
  Code2, 
  Bot, 
  FileText,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const searchableItems = [
    {
      title: 'Java OOP Invariants & Dynamic Dispatch',
      category: 'Skill Sandbox',
      desc: 'Polymorphism, encapsulation, and JVM vtable benchmark tests.',
      icon: Code2,
      color: '#059669',
      action: () => navigate('/assessment/java-oop')
    },
    {
      title: 'Spring Boot 3 & Microservice REST APIs',
      category: 'Skill Sandbox',
      desc: 'Stateless JWT filters, Spring Security 6, and @Transactional rules.',
      icon: Terminal,
      color: '#0284c7',
      action: () => navigate('/assessment/spring-boot')
    },
    {
      title: 'Data Structures & Algorithmic Bounds',
      category: 'Skill Sandbox',
      desc: 'Computational complexity, graph traversals, and dynamic programming.',
      icon: Cpu,
      color: '#7c3aed',
      action: () => navigate('/assessment/dsa')
    },
    {
      title: 'Student Placement Hub',
      category: 'Portal',
      desc: 'Proctored sandbox tests, skill badges, and job applications.',
      icon: GraduationCap,
      color: '#059669',
      action: () => navigate('/student')
    },
    {
      title: 'AI Mock Viva Voce',
      category: 'Student Tool',
      desc: 'Interactive oral interview with Socratic questions on OOPJ pillars.',
      icon: Bot,
      color: '#059669',
      action: () => navigate('/student?tab=ai-interview')
    },
    {
      title: 'ATS Resume Maker & PDF Scanner',
      category: 'Student Tool',
      desc: 'Single-column technical resume builder with automated ATS keyword scoring.',
      icon: FileText,
      color: '#0284c7',
      action: () => navigate('/student?tab=ats-resume')
    },
    {
      title: 'Alumni Mentorship Network',
      category: 'Portal',
      desc: 'Review student pull requests and host 1-on-1 technical mentorship slots.',
      icon: Users,
      color: '#0284c7',
      action: () => navigate('/alumni')
    },
    {
      title: 'Corporate Recruiter Hiring Hub',
      category: 'Portal',
      desc: 'Post campus vacancies, filter by CGPA cutoffs, and shortlist applicants.',
      icon: Briefcase,
      color: '#7c3aed',
      action: () => navigate('/recruiter')
    },
    {
      title: 'Academic Admin & Integrity Governance',
      category: 'Portal',
      desc: 'OOPJ viva benchmarks, anti-cheat telemetry audits, and user directory.',
      icon: ShieldCheck,
      color: '#0f172a',
      action: () => navigate('/admin')
    },
    {
      title: 'AI Remediation & 3-Day Recovery Roadmaps',
      category: 'Student Tool',
      desc: 'Targeted study plan when assessment scores fall below cutoff.',
      icon: TrendingUp,
      color: '#d97706',
      action: () => navigate('/redemption')
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = query.trim()
    ? searchableItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      )
    : searchableItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-box" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '640px', 
          width: 'min(95vw, 640px)',
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
          style={{ background: '#f1f5f9', color: '#475569', borderRadius: '50%', padding: '0.35rem' }}
        >
          <X size={18} />
        </button>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
          <Search size={20} color="#059669" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search skills, sandboxes, portals, tools... (↑↓ to select, Enter)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: '1rem',
              width: '100%',
              fontWeight: 600
            }}
          />
        </div>

        {/* Category Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {query.trim() ? `Found ${filteredItems.length} matching results` : 'Quick Navigation'}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            Esc to close
          </span>
        </div>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '380px', overflowY: 'auto' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No matches found for "{query}". Try searching for "Java", "Recruiter", "Viva", or "Resume".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    background: isSelected ? '#f1f5f9' : 'transparent',
                    border: isSelected ? '1px solid #cbd5e1' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '1px' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: item.color, background: `${item.color}15`, padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                      {item.category}
                    </span>
                    <ArrowRight size={14} color={isSelected ? '#0f172a' : '#94a3b8'} />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;