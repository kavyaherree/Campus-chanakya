import client from '../api/client';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LogOut, 
  Award, 
  Briefcase, 
  Bot, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw, 
  ChevronDown,
  Users,
  Code2,
  ExternalLink,
  CheckCircle2,
X
} from 'lucide-react';
import LogoutModal from './dashboard/LogoutModal';

export const Navbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [welcomeToast, setWelcomeToast] = useState(null);

  useEffect(() => {
    const rawToast = sessionStorage.getItem('cc_show_welcome_toast');
    if (rawToast) {
      try {
        const parsed = JSON.parse(rawToast);
        setWelcomeToast(parsed);
        sessionStorage.removeItem('cc_show_welcome_toast');
        const timer = setTimeout(() => {
          setWelcomeToast(null);
        }, 4500);
        return () => clearTimeout(timer);
      } catch (e) {
        sessionStorage.removeItem('cc_show_welcome_toast');
      }
    }
  }, [location.pathname]);
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const getRoleDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'STUDENT': return '/student';
      case 'ALUMNI': return '/alumni';
      case 'RECRUITER': return '/recruiter';
      case 'ADMIN':
      case 'SUPER_ADMIN': return '/admin';
      default: return '/student';
    }
  };

  return (
    <nav className="sticky top-0 z-50 h-16 flex-shrink-0 bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#032b21] border-b border-emerald-500/30 px-3 sm:px-6 flex items-center shadow-lg shadow-emerald-950/25 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-200 text-[#064e3b] flex items-center justify-center shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-transform ring-1 ring-white/20 flex-shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#064e3b]" />
          </div>
          <div className="min-w-0">
            <span className="text-sm sm:text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-200 transition-colors drop-shadow-xs truncate block">
              CampusChanakya
            </span>
            <span className="hidden sm:block text-[9.5px] uppercase font-bold text-emerald-300 tracking-widest">
              Knowledge to Impact
            </span>
          </div>
        </Link>

        {/* Navigation / User Controls */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* User Meta Card */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white tracking-tight">{user.fullName}</p>
                <span className="inline-block px-2 py-0.5 text-[9.5px] font-extrabold uppercase rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 tracking-wider">
                  {user.role}
                </span>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-200 text-[#064e3b] font-black flex items-center justify-center text-xs shadow-md ring-2 ring-emerald-400/30">
                {user.fullName?.charAt(0) || 'U'}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-1.5 text-emerald-200/80 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-400/30"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-emerald-300 hover:text-rose-300 transition-colors" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 text-xs font-black text-[#064e3b] bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-200 hover:from-emerald-200 hover:to-teal-100 rounded-full shadow-md shadow-emerald-950/40 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        userName={user?.fullName}
      />
          {/* Welcome Toast Notification */}
      {welcomeToast && (
        <div style={{
          position: 'fixed',
          top: '4.5rem',
          right: '1.5rem',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1), 0 0 0 1px #e2e8f0',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
              Welcome, {welcomeToast.name}!
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Successfully signed in as {welcomeToast.role.toLowerCase()}
            </div>
          </div>
          <button 
            onClick={() => setWelcomeToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;