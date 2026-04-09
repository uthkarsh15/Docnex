import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';

interface PlaceholderPageProps {
    title: string;
    subtitle: string;
    icon: string;
    role: 'PATIENT' | 'DOCTOR';
    actions?: { label: string; to: string; icon: string }[];
}

/**
 * Standard DocNex Placeholder Component.
 */
const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, subtitle, icon, role, actions = [] }) => {
    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role={role} />
                <div className="lg:col-span-9 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                    <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-5xl">{icon}</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">{subtitle}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center pt-4">
                        <Link
                            to={role === 'PATIENT' ? '/patient' : '/doctor'}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all transition-transform active:scale-95"
                        >
                            Return to Dashboard
                        </Link>
                        {actions.map((action, i) => (
                            <Link
                                key={i}
                                to={action.to}
                                className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-lg">{action.icon}</span>
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export const PatientAppointments: React.FC = () => (
    <PlaceholderPage
        role="PATIENT"
        title="Appointments"
        subtitle="Manage your upcoming clinical visits. This module is undergoing structural improvements."
        icon="calendar_month"
        actions={[
            { label: 'Book Doctor', to: '/patient/book', icon: 'add_circle' },
            { label: 'Find Specialist', to: '/patient', icon: 'person_search' },
        ]}
    />
);

export const PatientVault: React.FC = () => (
    <PlaceholderPage
        role="PATIENT"
        title="Medical Vault"
        subtitle="Your immutable health record archive. Access to historical data will be enabled in the next release."
        icon="shield_lock"
        actions={[
            { label: 'Upload Record', to: '/patient/upload', icon: 'cloud_upload' },
            { label: 'Analyse New Report', to: '/patient/report-analysis', icon: 'psychology' },
        ]}
    />
);

export const DoctorAppointments: React.FC = () => (
    <PlaceholderPage
        role="DOCTOR"
        title="Patient Schedule"
        subtitle="Comprehensive view of your clinical ledger. Integrated scheduling is coming soon."
        icon="calendar_today"
        actions={[
            { label: 'View Today', to: '/doctor', icon: 'dashboard' },
        ]}
    />
);

export const DoctorPatients: React.FC = () => (
    <PlaceholderPage
        role="DOCTOR"
        title="Patient Roster"
        subtitle="Manage and oversee your universal patient directory. Access to full clinical history is restricted."
        icon="groups"
        actions={[
            { label: 'Return Dashboard', to: '/doctor', icon: 'dashboard' },
        ]}
    />
);

export const DoctorSchedule: React.FC = () => (
    <PlaceholderPage
        role="DOCTOR"
        title="Availability Management"
        subtitle="Temporal logic configuration. Availability is currently managed via the primary hub."
        icon="schedule"
        actions={[
            { label: 'Return Dashboard', to: '/doctor', icon: 'dashboard' },
        ]}
    />
);

export const DoctorSettings: React.FC = () => {
    const [hasSaved, setHasSaved] = useState(false);

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role="DOCTOR" />
                <div className="lg:col-span-9 space-y-10">
                    <header>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
                        <p className="text-slate-500">Manage your profile information and notification preferences</p>
                    </header>
                    
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-8 shadow-sm">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input defaultValue="Dr. Sarah Mitchell" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input defaultValue="dr.mitchell@aura.md" type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specialization</label>
                                <input defaultValue="Advanced Cardiology" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary dark:text-white" />
                            </div>
                        </form>
                        
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => { setHasSaved(true); setTimeout(() => setHasSaved(false), 2000); }}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                            >
                                {hasSaved ? (
                                    <>Saved ✓</>
                                ) : 'Save Changes'}
                            </button>
                            <Link to="/doctor" className="text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">Cancel</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
