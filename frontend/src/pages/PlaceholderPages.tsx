import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

interface PlaceholderPageProps {
    title: string;
    subtitle: string;
    icon: string;
    role: 'PATIENT' | 'DOCTOR';
    actions?: { label: string; to: string; icon: string }[];
}

// C8: Placeholder pages now have contextual action buttons instead of dead ends
const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, subtitle, icon, role, actions = [] }) => {
    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role={role} />
                <div className="lg:col-span-9 flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <div className="size-20 bg-primary/5 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-primary dark:text-slate-300">{icon}</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">{subtitle}</p>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            to={role === 'PATIENT' ? '/patient' : '/doctor'}
                            className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all no-underline"
                        >
                            ← Back to Dashboard
                        </Link>
                        {actions.map((action, i) => (
                            <Link
                                key={i}
                                to={action.to}
                                className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all no-underline"
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

// Patient Pages — C8: Each has relevant action links
export const PatientAppointments: React.FC = () => (
    <PlaceholderPage
        role="PATIENT"
        title="My Appointments"
        subtitle="View and manage your upcoming and past consultations. This feature is coming soon."
        icon="calendar_month"
        actions={[
            { label: 'Book New Appointment', to: '/patient/book', icon: 'add_circle' },
            { label: 'Find Doctors', to: '/patient', icon: 'person_search' },
        ]}
    />
);

export const PatientVault: React.FC = () => (
    <PlaceholderPage
        role="PATIENT"
        title="Secure Vault"
        subtitle="Your encrypted medical records vault. Access all your stored documents securely. Coming soon."
        icon="shield_lock"
        actions={[
            { label: 'Upload a Record', to: '/patient/upload', icon: 'cloud_upload' },
        ]}
    />
);

// Doctor Pages
export const DoctorAppointments: React.FC = () => (
    <PlaceholderPage
        role="DOCTOR"
        title="All Appointments"
        subtitle="View your complete appointment history and upcoming schedule. Coming soon."
        icon="calendar_today"
        actions={[
            { label: 'View Today\'s Schedule', to: '/doctor', icon: 'dashboard' },
        ]}
    />
);

export const DoctorPatients: React.FC = () => (
    <PlaceholderPage
        role="DOCTOR"
        title="Patient Records"
        subtitle="Access and manage your patient roster and their medical histories. Coming soon."
        icon="groups"
        actions={[
            { label: 'View Appointments', to: '/doctor', icon: 'calendar_today' },
        ]}
    />
);

// D6: DoctorSchedule links back to the dashboard where the schedule modal lives
export const DoctorSchedule: React.FC = () => (
    <PlaceholderPage
        role="DOCTOR"
        title="Schedule Management"
        subtitle="Full schedule management is coming soon. You can configure your weekly availability from your dashboard."
        icon="schedule"
        actions={[
            { label: 'Manage from Dashboard', to: '/doctor', icon: 'dashboard' },
        ]}
    />
);

export const DoctorSettings: React.FC = () => {
    const [saved, setSaved] = useState(false);

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role="DOCTOR" />
                <div className="lg:col-span-9 space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Settings</h1>
                        <p className="text-slate-500">Manage your profile and notification preferences.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Display Name</label>
                                <input defaultValue="Dr. Sarah Smith" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Email</label>
                                <input defaultValue="dr.smith@medical.org" type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Specialization</label>
                                <input defaultValue="Senior Cardiologist" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                                className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                {saved ? (
                                    <><span className="material-symbols-outlined text-sm">check</span> Saved!</>
                                ) : 'Save Changes'}
                            </button>
                            <Link to="/doctor" className="text-sm text-slate-500 hover:text-slate-700 no-underline font-medium">Cancel</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
