import React from 'react';

/**
 * ============================================================================
 * CARD CONTAINER COMPONENT
 * ============================================================================
 * Standardized reusable card container featuring clean modern SaaS design,
 * crisp borders, soft emerald highlights, and typography aligned with Homepage.
 */
const Card = ({ title, subtitle, icon: Icon, action, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden ${className}`}>
      {/* Top Accent Emerald Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      {(title || Icon || action) && (
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};

export default Card;
