import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import LandingPage from './pages/landing-page';
import PatientDashboard from './pages/patient-dashboard';
import DoctorDashboard from './pages/doctor-dashboard';
import Login from './pages/Login';
import UploadRecord from './pages/upload-record';
import BookAppointment from './pages/book-appointment';
import ReportAnalysis from './pages/report-analysis';

import {
  PatientAppointments,
  DoctorAppointments,
  DoctorPatients,
  DoctorSchedule,
  DoctorSettings,
} from './pages/placeholder-pages';

/**
 * Main Application Component
 */
const App: React.FC = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('docnex_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('docnex_user', JSON.stringify(user));
      // Keep legacy key in sync
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('docnex_user');
      localStorage.removeItem('user');
    }
  }, [user]);

  // Handle system dark mode preference
  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    
    updateTheme(darkQuery);
    darkQuery.addEventListener('change', updateTheme);
    return () => darkQuery.removeEventListener('change', updateTheme);
  }, []);

  /**
   * Universal logout handler.
   * Fix 6: Clear all auth keys from both storages.
   */
  const handleLogout = () => {
    localStorage.removeItem('docnex_token');
    localStorage.removeItem('docnex_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={(u: { id?: string; role: string; name: string }) => setUser(u)} />} />

            {/* Patient Routes */}
            <Route
              path="/patient"
              element={user?.role === 'PATIENT' ? <PatientDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/patient/upload"
              element={user?.role === 'PATIENT' ? <UploadRecord /> : <Navigate to="/login" />}
            />
            <Route
              path="/patient/book/:doctorId"
              element={user?.role === 'PATIENT' ? <BookAppointment /> : <Navigate to="/login" />}
            />
            <Route
              path="/patient/book"
              element={user?.role === 'PATIENT' ? <BookAppointment /> : <Navigate to="/login" />}
            />
            <Route
              path="/patient/appointments"
              element={user?.role === 'PATIENT' ? <PatientAppointments /> : <Navigate to="/login" />}
            />
            <Route
              path="/patient/vault"
              element={<Navigate to="/patient/upload" />}
            />
            <Route
              path="/patient/report-analysis"
              element={user?.role === 'PATIENT' ? <ReportAnalysis /> : <Navigate to="/login" />}
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor"
              element={user?.role === 'DOCTOR' ? <DoctorDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/doctor/appointments"
              element={user?.role === 'DOCTOR' ? <DoctorAppointments /> : <Navigate to="/login" />}
            />
            <Route
              path="/doctor/patients"
              element={user?.role === 'DOCTOR' ? <DoctorPatients /> : <Navigate to="/login" />}
            />
            <Route
              path="/doctor/schedule"
              element={user?.role === 'DOCTOR' ? <DoctorSchedule /> : <Navigate to="/login" />}
            />
            <Route
              path="/doctor/settings"
              element={user?.role === 'DOCTOR' ? <DoctorSettings /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
