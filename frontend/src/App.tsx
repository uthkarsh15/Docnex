import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import LandingPage from './pages/LandingPage.tsx';
import PatientDashboard from './pages/PatientDashboard.tsx';
import DoctorDashboard from './pages/DoctorDashboard.tsx';
import Login from './pages/Login.tsx';
import UploadRecord from './pages/UploadRecord.tsx';
import BookAppointment from './pages/BookAppointment.tsx';
import {
  PatientAppointments,
  PatientVault,
  DoctorAppointments,
  DoctorPatients,
  DoctorSchedule,
  DoctorSettings,
} from './pages/PlaceholderPages.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<{ role: string; name: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Detect system dark mode preference and apply 'dark' class to <html>
  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyDark = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    applyDark(darkQuery);
    darkQuery.addEventListener('change', applyDark);
    return () => darkQuery.removeEventListener('change', applyDark);
  }, []);

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

            {/* Protected Patient Routes */}
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

            {/* Protected Doctor Routes */}
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
