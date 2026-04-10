import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

interface Appointment {
    id: string;
    patient: string;
    date: string;
    time: string;
    type: string;
    status: string;
}

/**
 * Reverted to original DoctorDashboard UI as per user request.
 * Kept kebab-case filename as per naming convention cleanup rule.
 * Updated sidebar import to match kebab-case rule.
 */
const DoctorDashboard: React.FC = () => {
    // Generate dynamic dates relative to today
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: '1', patient: 'John Wilson', date: fmt(today), time: '09:00 AM', type: 'Cardiology', status: 'Confirmed' },
        { id: '2', patient: 'Emma Watson', date: fmt(today), time: '11:30 AM', type: 'Follow-up', status: 'Pending' },
        { id: '3', patient: 'Robert Brown', date: fmt(tomorrow), time: '02:00 PM', type: 'Consultation', status: 'Confirmed' },
        { id: '4', patient: 'Lisa Chang', date: fmt(tomorrow), time: '04:00 PM', type: 'Check-up', status: 'Pending' },
        { id: '5', patient: 'Michael Davis', date: fmt(dayAfter), time: '10:00 AM', type: 'Cardiology', status: 'Confirmed' },
    ]);
    const [showAll, setShowAll] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const displayedAppointments = showAll ? appointments : appointments.slice(0, 3);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleStatusChange = (id: string, newStatus: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        setActiveMenu(null);
        if (newStatus === 'Confirmed') showToast('Appointment confirmed successfully');
        else if (newStatus === 'Completed') showToast('Appointment marked as completed');
        else if (newStatus === 'Pending') showToast('Appointment rescheduled — awaiting patient confirmation');
    };

    const handleCancel = (id: string) => {
        if (confirm('Cancel this appointment?')) {
            setAppointments(prev => prev.filter(a => a.id !== id));
            showToast('Appointment cancelled');
        }
        setActiveMenu(null);
    };

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
    const pendingCount = appointments.filter(a => a.status === 'Pending').length;

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role="DOCTOR" />

                <div className="lg:col-span-9 space-y-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Doctor Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400">Welcome back, Dr. Mitchell. Here's a summary of your scheduled appointments and platform performance.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Patients', value: '1,248', grow: '+12%', icon: 'groups', color: 'text-blue-500' },
                            { label: 'Consultations', value: String(appointments.length), grow: `${confirmedCount} confirmed`, icon: 'clinical_notes', color: 'text-emerald-500' },
                            { label: 'Platform Rating', value: '4.9/5', grow: 'Top 1%', icon: 'star', color: 'text-amber-500' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                                        <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{stat.grow}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Appointments Table */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                {showAll ? 'All Appointments' : 'Scheduled Today'}
                            </h2>
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-xs font-black text-primary uppercase tracking-widest hover:underline px-2 py-1"
                            >
                                {showAll ? 'Show Less' : 'View All'}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse font-display">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Patient Name</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Time</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Consultation Type</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {displayedAppointments.map((apt) => (
                                            <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {apt.patient.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{apt.patient}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{apt.time}</td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-500">{apt.type}</td>
                                                <td className="px-6 py-5">
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded ${
                                                        apt.status === 'Confirmed'
                                                            ? 'bg-emerald-500/10 text-emerald-600'
                                                            : apt.status === 'Completed'
                                                                ? 'bg-blue-500/10 text-blue-600'
                                                                : 'bg-amber-500/10 text-amber-600'
                                                    }`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="relative" ref={activeMenu === apt.id ? menuRef : undefined}>
                                                        <button
                                                            onClick={() => setActiveMenu(activeMenu === apt.id ? null : apt.id)}
                                                            className="text-primary hover:text-slate-700 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">more_vert</span>
                                                        </button>
                                                        {activeMenu === apt.id && (
                                                            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
                                                                {apt.status === 'Pending' && (
                                                                    <button
                                                                        onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                                                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-emerald-600"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">check_circle</span> Confirm
                                                                    </button>
                                                                )}
                                                                {apt.status === 'Confirmed' && (
                                                                    <button
                                                                        onClick={() => handleStatusChange(apt.id, 'Completed')}
                                                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-blue-600"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">task_alt</span> Mark Complete
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleStatusChange(apt.id, 'Pending')}
                                                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-amber-600"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">schedule</span> Reschedule
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancel(apt.id)}
                                                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 text-red-500 border-t border-slate-100 dark:border-slate-800"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">cancel</span> Cancel
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                <span>Showing {displayedAppointments.length} of {appointments.length} appointments</span>
                                <span>{confirmedCount} confirmed • {pendingCount} pending</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="bg-[#0f1729] rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black">Manage Your Slots</h3>
                                <p className="text-slate-400 text-sm max-w-sm">Optimize your clinic hours and update availability for real-time patient booking.</p>
                            </div>
                            <button
                                onClick={() => setScheduleOpen(true)}
                                className="bg-white text-primary px-10 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-xl"
                            >
                                Manage Schedule
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <span className="material-symbols-outlined text-[120px]">calendar_today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manage Schedule Modal */}
            {scheduleOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setScheduleOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setScheduleOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Weekly Availability</h3>
                        <p className="text-sm text-slate-500 mb-6">Toggle your available days and set working hours.</p>
                        <div className="space-y-3">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                                <ScheduleRow key={day} day={day} defaultActive={i < 4} />
                            ))}
                        </div>
                        <button onClick={() => { setScheduleOpen(false); }} className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-6 hover:bg-primary/90 transition-all">
                            Save Schedule
                        </button>
                    </div>
                </div>
            )}

            {toast && (
                <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                    <span className="text-sm font-medium">{toast}</span>
                </div>
            )}
        </main>
    );
};

const ScheduleRow: React.FC<{ day: string; defaultActive: boolean }> = ({ day, defaultActive }) => {
    const [active, setActive] = useState(defaultActive);
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${active ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setActive(!active)}
                    className={`size-5 rounded flex items-center justify-center transition-colors ${active ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    {active && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
                <span className={`text-sm font-medium ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{day}</span>
            </div>
            {active && <span className="text-xs text-slate-500">9:00 AM – 5:00 PM</span>}
        </div>
    );
};

export default DoctorDashboard;
