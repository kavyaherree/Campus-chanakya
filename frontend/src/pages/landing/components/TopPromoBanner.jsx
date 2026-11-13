import React from 'react';
import { ArrowRight } from 'lucide-react';

export const TopPromoBanner = () => {
  return (
    <aside className="top-telemetry-strip" aria-label="Platform Announcement">
      <div className="telemetry-strip-container">
        <span className="telemetry-badge-new">2026 BATCH</span>
        <span className="telemetry-desc-text">
          Campus placement tests and recruitment drives are currently active.
        </span>
        <a href="#placement-stats" className="telemetry-link-inline">
          <span>View Placement Data</span>
          <ArrowRight size={13} className="telemetry-arrow-icon" />
        </a>
      </div>
    </aside>
  );
};

export default TopPromoBanner;
