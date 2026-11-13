import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Check } from 'lucide-react';

export const FooterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="landing-footer light-footer" id="footer">
      <div className="footer-grid">
        
        {/* Col 1: Brand Info */}
        <div className="footer-brand-col">
          <Link to="/" className="nav-brand">
            <div className="nav-logo-icon">
              <GraduationCap size={20} color="#ffffff" />
            </div>
            <div className="nav-brand-title">
              <span>CampusChanakya</span>
              <span className="nav-brand-tagline">CAMPUS PLACEMENT PLATFORM</span>
            </div>
          </Link>
          <p className="footer-brand-desc">
            Campus placement and coding assessment platform connecting students, colleges, alumni, and employers.
          </p>
        </div>

        {/* Col 2: Portals */}
        <div>
          <h4 className="footer-col-title">Portals</h4>
          <ul className="footer-links-list">
            <li><Link to="/student" className="footer-link">Student Portal</Link></li>
            <li><Link to="/recruiter" className="footer-link">Recruiter Console</Link></li>
            <li><Link to="/alumni" className="footer-link">Alumni Network</Link></li>
            <li><Link to="/admin" className="footer-link">College Placement Admin</Link></li>
            <li><Link to="/login" className="footer-link">Sign In / Register</Link></li>
          </ul>
        </div>

        {/* Col 3: Core Features */}
        <div>
          <h4 className="footer-col-title">Features</h4>
          <ul className="footer-links-list">
            <li><a href="#solutions" className="footer-link">Coding Assessments</a></li>
            <li><a href="#solutions" className="footer-link">Verified Skill Scores</a></li>
            <li><a href="#why-us" className="footer-link">Placement Funnel</a></li>
            <li><a href="#placement-stats" className="footer-link">Department Statistics</a></li>
            <li><a href="#solutions" className="footer-link">Alumni Mock Interviews</a></li>
          </ul>
        </div>

        {/* Col 4: Resources */}
        <div>
          <h4 className="footer-col-title">Resources</h4>
          <ul className="footer-links-list">
            <li><a href="#home" className="footer-link">Assessment Guidelines</a></li>
            <li><a href="#home" className="footer-link">Anti-Cheat System</a></li>
            <li><a href="#why-us" className="footer-link">Recruiter Onboarding</a></li>
            <li><a href="#footer" className="footer-link">Privacy Policy</a></li>
            <li><a href="#footer" className="footer-link">Terms of Service</a></li>
          </ul>
        </div>

        {/* Col 5: Stay Updated */}
        <div className="newsletter-box">
          <h4 className="footer-col-title">Stay Updated</h4>
          <p className="newsletter-desc">
            Get placement updates and assessment drive announcements.
          </p>

          <form onSubmit={handleSubscribe} className="newsletter-input-group light-newsletter">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input light-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-subscribe">
              {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>
          {subscribed && (
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
              ✓ You have been subscribed!
            </span>
          )}
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar light-bottom-bar">
        <div>
          © 2026 CampusChanakya. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#footer" className="footer-link">Privacy Policy</a>
          <a href="#footer" className="footer-link">Terms of Service</a>
          <a href="#footer" className="footer-link">Placement Guidelines</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
