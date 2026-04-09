import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    role: 'PATIENT' | 'DOCTOR';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const location = useLocation();

    const patientLinks = [
        { label: 'Home', icon: 'home', path: '/patient' },
        { label: 'Upload Record', icon: 'cloud_upload', path: '/patient/upload' },
        { label: 'AI Report Analysis', icon: 'psychology', path: '/patient/report-analysis' },
        { label: 'Find Doctors', icon: 'person_search', path: '/patient/book' },
        { label: 'My Appointments', icon: 'calendar_month', path: '/patient/appointments' },
        { label: 'Vault', icon: 'shield_lock', path: '/patient/vault' },
    ];

    const doctorLinks = [
        { label: 'Dashboard', icon: 'dashboard', path: '/doctor' },
        { label: 'Appointments', icon: 'calendar_today', path: '/doctor/appointments' },
        { label: 'Patients', icon: 'groups', path: '/doctor/patients' },
        { label: 'Schedule', icon: 'schedule', path: '/doctor/schedule' },
        { label: 'Settings', icon: 'settings', path: '/doctor/settings' },
    ];

    const links = role === 'PATIENT' ? patientLinks : doctorLinks;

    // D5: Sidebar card links to /patient/vault for patients, /doctor/settings for doctors
    const cardLink = role === 'PATIENT' ? '/patient/vault' : '/doctor/settings';
    const cardTitle = role === 'PATIENT' ? 'Secure Storage' : 'Need Help?';
    const cardDesc = role === 'PATIENT'
        ? 'HIPAA & GDPR Compliant Military-grade Encryption'
        : 'Configure your profile, preferences, and notification settings';
    const cardIcon = role === 'PATIENT' ? 'verified_user' : 'help_center';

    return (
        <aside className="lg:col-span-3 space-y-6">
            <div className="flex flex-col gap-2">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all no-underline ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            {/* D5: Card is now clickable and navigates to a real page */}
            <Link
                to={cardLink}
                className="block bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 no-underline hover:border-primary/30 hover:shadow-md transition-all group"
            >
                <div className="size-10 bg-primary/5 dark:bg-slate-100/10 rounded-lg flex items-center justify-center text-primary dark:text-white group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">{cardIcon}</span>
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{cardTitle}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{cardDesc}</p>
                </div>
            </Link>
        </aside>
    );
};

export default Sidebar;
