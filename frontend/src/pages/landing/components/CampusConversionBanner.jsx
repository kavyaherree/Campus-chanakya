import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Play } from 'lucide-react';

export const CampusConversionBanner = ({ onOpenDemo }) => {
  return (
    <section className="conversion-banner-section reveal-on-scroll">
      <div className="conversion-banner-container light-conversion-card">
        
        <div className="banner-text-col">
          <div className="banner-pill-tag light-tag">
            <CheckCircle2 size={15} color="#059669" />
            <span>CAMPUS RECRUITMENT PLATFORM</span>
          </div>

          <h2 className="banner-headline light-headline">
            Get started with CampusChanakya today
          </h2>

          <p className="banner-description light-desc">
            Take practice coding assessments, view verified scorecards, or log in as a recruiter to shortlist candidates for upcoming drives.
          </p>
        </div>

        <div className="banner-actions-col">
          <Link to="/login" className="btn-banner-primary">
            <span>Start Practice Test</span>
            <ArrowRight size={16} />
          </Link>

          <button onClick={onOpenDemo} className="btn-banner-outline">
            <Play size={14} />
            <span>View Demo Console</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CampusConversionBanner;
