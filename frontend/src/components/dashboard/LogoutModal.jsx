import React from 'react';
import { LogOut, X, AlertTriangle, ShieldCheck } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scale-up">
        {/* Top Header Strip */}
        <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />

        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shadow-xs">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Confirm Sign Out</h3>
                <p className="text-xs text-slate-500">CampusChanakya Student Session</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to sign out{userName ? `, ${userName}` : ''}? Your verified skill badges, growth trajectory data, and active placement applications are securely preserved in your cloud profile.
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Zero data loss: All profile updates and ATS drafts are auto-saved.</span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center"
            >
              Cancel &amp; Stay
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Yes, Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
