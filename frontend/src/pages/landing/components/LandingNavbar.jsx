import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, Menu, X, ArrowRight, Building2 } from 'lucide-react';

export const LandingNavbar = ({ onOpenSearch, onOpenDemo, onOpenRegisterCollege }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    { label: 'Home', href: '#home', type: 'anchor' },
    { label: 'Skill Benchmarks', href: '#solutions', type: 'anchor' },
    { label: 'Placement Pipeline', href: '#why-us', type: 'anchor' },
    { label: 'Live Analytics', href: '#placement-stats', type: 'anchor' },
    { label: 'Portals & Viva', href: '#demo-console', type: 'demo' },
  ];

  const handleNavClick = (item) => {
    setActiveTab(item.label);
    setMobileMenuOpen(false);

    if (item.type === 'demo') {
      if (onOpenDemo) onOpenDemo();
      return;
    }

    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="landing-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setActiveTab('Home')}>
          <div className="logo-icon-wrap">
            <GraduationCap className="logo-icon-svg" />
          </div>
          <span className="logo-text">Campus<span className="logo-text-accent">Chanakya</span></span>
        </Link>

        {/* Navigation Items (Center) */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`nav-link ${activeTab === item.label ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
              >
                <span>{item.label}</span>
              </a>
            </li>
          ))}

          {/* Mobile Drawer Actions */}
          <li className="mobile-drawer-actions">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenRegisterCollege) onOpenRegisterCollege();
              }}
              className="btn-drawer-signin"
              style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0', marginBottom: '0.5rem' }}
            >
              Register College
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenDemo) onOpenDemo();
              }}
              className="btn-drawer-portals"
            >
              <span>Launch Demo Console</span>
            </button>
            <Link 
              to="/login" 
              className="btn-drawer-signin"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Desktop Search Pill */}
          <div 
            className="nav-search-input-pill desktop-only-search"
            onClick={onOpenSearch}
            title="Search skills, sandboxes (Ctrl + K)"
          >
            <Search size={15} className="search-icon-dimmed" />
            <span className="search-placeholder-text">Search evaluations...</span>
            <kbd className="search-keyboard-shortcut">Ctrl K</kbd>
          </div>

          {/* Mobile Search Icon Button */}
          <button
            type="button"
            className="mobile-search-btn"
            onClick={onOpenSearch}
            title="Search (Ctrl + K)"
          >
            <Search size={18} />
          </button>

          {/* Register College Button */}
          <button
            type="button"
            onClick={onOpenRegisterCollege}
            className="btn-register-college-nav"
            style={{
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              flexShrink: 0,
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={15} />
            <span>Register College</span>
          </button>

          <Link 
            to="/login" 
            className="btn-signin-clean"
            style={{ 
              whiteSpace: 'nowrap', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
            }}
          >
            Sign In
          </Link>

          <button 
            onClick={onOpenDemo}
            className="btn-get-started-pill"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            Launch Portals
          </button>

          <button 
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
