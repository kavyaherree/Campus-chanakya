import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AssessmentView from './pages/AssessmentView';
import StudentMentorshipView from './pages/StudentMentorshipView';
import RedemptionView from './pages/RedemptionView';
import AlumniDashboard from './pages/AlumniDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Dashboard layout wrapping authenticated portals with the dashboard navbar
function PortalLayout() {
  return (
    <div className="h-[100dvh] w-full max-w-full overflow-hidden bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Standalone Modern Landing Page (Exact VidyaSetu UI/UX Architecture) */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login defaultTab="signup" />} />

          {/* 3. Protected Dashboard Portals */}
          <Route element={<PortalLayout />}>
            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/mentorship"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentMentorshipView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentorship"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentMentorshipView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/:skillId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <AssessmentView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/redemption"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <RedemptionView />
                </ProtectedRoute>
              }
            />

            {/* Alumni Route */}
            <Route
              path="/alumni"
              element={
                <ProtectedRoute allowedRoles={['ALUMNI']}>
                  <AlumniDashboard />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Route */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
