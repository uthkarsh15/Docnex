import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/navbar.tsx';
import Footer from './components/footer.tsx';

// Page Components
import LandingPage from './pages/landing-page.tsx';
import PatientDashboard from './pages/patient-dashboard.tsx';
import DoctorDashboard from './pages/doctor-dashboard.tsx';
import Login from './pages/login.tsx';
import UploadRecord from './pages/upload-record.tsx';
import BookAppointment from './pages/book-appointment.tsx';
import ReportAnalysis from './pages/report-analysis.tsx';

import {
  PatientAppointments,
  PatientVault,
  DoctorAppointments,
  DoctorPatients,
  DoctorSchedule,
  DoctorSettings,
} from './pages/placeholder-pages.tsx';

/**
 * Main Application Component
 */
const App: React.FC = () => {
  const [user, setUser] = useState<{ role: string; name: string } | null>(() => {
    const savedValue = localStorage.getItem('user');
    return savedValue ? JSON.parse(savedValue) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
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
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />

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
              element={user?.role === 'PATIENT' ? <PatientVault /> : <Navigate to="/login" />}
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
