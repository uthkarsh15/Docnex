import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSymptomAnalysis } from '../hooks/use-symptom-analysis';
import apiClient from '../api/client';

interface MyAppointment {
    _id: string;
    status: string;
    createdAt: string;
    slot: {
        startTime: string;
        endTime: string;
        doctor: {
            specialization: string;
            user: { fullName: string };
        };
    };
}

/**
 * Patient Dashboard — Unified UI with state handling for Fix 3, 5, and 7.
 * Fix 3: Added Upcoming/Past categorization and Cancel flow with confirmation.
 * Fix 5: Gated recommendations behind AI analysis check.
 * Fix 7: Ensuring user-scoped data display.
 */
const PatientDashboard: React.FC = () => {
    const navigate = useNavigate();
    const {
        symptom,
        setSymptom,
        isLoading,
        recommendations,
        selectedDoctor,
        setSelectedDoctor,
        handleAnalyze
    } = useSymptomAnalysis();

    // Load latest analysis from sessionStorage if available (from Fix 1)
    const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
    const [latestDoctors, setLatestDoctors] = useState<any[]>([]);

    // — My Appointments State —
    const [myAppointments, setMyAppointments] = useState<MyAppointment[]>([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

    const fetchMyAppointments = useCallback(async () => {
        try {
            const res = await apiClient.get('/appointments/my');
            setMyAppointments(res.data);
        } catch {
            // silently ignore
        } finally {
            setAppointmentsLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            const savedAnalysis = sessionStorage.getItem('latestAnalysis');
            const savedDoctors = sessionStorage.getItem('latestDoctors');
            if (savedAnalysis) setLatestAnalysis(JSON.parse(savedAnalysis));
            if (savedDoctors) setLatestDoctors(JSON.parse(savedDoctors));
        } catch { /* ignore parse errors */ }
        
        fetchMyAppointments();
    }, [fetchMyAppointments]);

    // Fix 3: Categorize appointments
    const now = new Date();
    const upcomingAppointments = myAppointments.filter(apt => {
        const startTime = new Date(apt.slot?.startTime);
        return startTime > now && (apt.status === 'PENDING' || apt.status === 'CONFIRMED');
    });
    
    const pastAppointments = myAppointments.filter(apt => {
        const startTime = new Date(apt.slot?.startTime);
        return startTime <= now || apt.status === 'COMPLETED' || apt.status === 'CANCELLED';
    });

    const handleCancelAppointment = async (id: string) => {
        setCancellingId(id);
        try {
            await apiClient.post(`/appointments/cancel/${id}`);
            // Optimistic update
            setMyAppointments(prev => prev.map(apt => 
                apt._id === id ? { ...apt, status: 'CANCELLED' } : apt
            ));
            setCancelConfirmId(null);
        } catch (err: any) {
            alert(err?.response?.data?.error || 'Failed to cancel appointment');
        } finally {
            setCancellingId(null);
        }
    };

    const statusChip = (status: string) => {
        const map: Record<string, string> = {
            'PENDING': 'bg-amber-500/10 text-amber-600',
            'CONFIRMED': 'bg-emerald-500/10 text-emerald-600',
            'CANCELLED': 'bg-red-500/10 text-red-600',
            'COMPLETED': 'bg-slate-500/10 text-slate-500',
        };
        return map[status] || 'bg-slate-500/10 text-slate-500';
    };

    const formatSlotTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Fix 5: Logic to determine if recommendations should be shown
    const showRecommendations = latestAnalysis || recommendations.length > 0;

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role="PATIENT" />

                <div className="lg:col-span-9 space-y-12">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black leading-tight tracking-tight">Patient Console</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-normal">Manage your health data, AI insights, and clinical schedule.</p>
                    </div>

                    {/* Latest Report Summary Card */}
                    {latestAnalysis && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in">
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl">lab_profile</span>
                                    <h3 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider">Active Analysis Result</h3>
                                </div>
                                <button onClick={() => navigate('/patient/report-analysis')} className="text-[10px] font-bold text-primary hover:underline bg-transparent border-none cursor-pointer uppercase tracking-wider">FULL REPORT →</button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Patient</span><p className="font-bold dark:text-white mt-0.5">{latestAnalysis.patientName || 'User'}</p></div>
                                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Severity</span><p className={`font-bold mt-0.5 ${latestAnalysis.severity === 'severe' ? 'text-red-500' : latestAnalysis.severity === 'moderate' ? 'text-amber-500' : 'text-emerald-500'}`}>{latestAnalysis.severity?.toUpperCase()}</p></div>
                                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Urgency</span><p className="font-bold dark:text-white mt-0.5">{latestAnalysis.urgency?.toUpperCase()}</p></div>
                                    <div><span className="text-slate-400 font-bold uppercase text-[10px]">Primary Specialist</span><p className="font-bold text-primary mt-0.5">{latestAnalysis.recommendedSpecialistType || 'General Physician'}</p></div>
                                </div>
                                {latestDoctors.length > 0 && (
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Matches:</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {latestDoctors.slice(0, 3).map((doc: any) => (
                                                <span key={doc.id} className="text-[11px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{doc.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Symptom Search Bar */}
                    <form className="flex w-full gap-3" onSubmit={(e) => handleAnalyze(e as any)}>
                        <div className="flex flex-1 items-stretch rounded-xl h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <div className="text-slate-500 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-2xl text-primary">psychology</span>
                            </div>
                            <input
                                className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-400 px-4 text-base font-normal dark:text-white outline-none"
                                placeholder="Describe symptoms for AI matching..."
                                value={symptom}
                                onChange={(e) => setSymptom(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={isLoading || !symptom.trim()}
                            className="bg-primary text-white px-8 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Analyzing</>
                            ) : (
                                <>Analyze <span className="material-symbols-outlined text-lg">search</span></>
                            )}
                        </button>
                    </form>

                    {/* Fix 5: Specialist Recommendations Section — ONLY SHOW IF AI ANALYSIS PERFORMED */}
                    {showRecommendations ? (
                        <div className="space-y-6 pt-4 animate-in">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-primary dark:text-white uppercase tracking-wider">Recommended Specialists</h3>
                                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">AI matches for you</span>
                            </div>

                            <div className="flex flex-col gap-6">
                                {(recommendations.length > 0 ? recommendations : (latestDoctors.length > 0 ? latestDoctors : [])).map((doc, idx) => {
                                    // Handle both recommendation and legacy doctor structures
                                    const name = doc.fullName || doc.name;
                                    const specialization = doc.specialization || doc.department;
                                    
                                    return (
                                        <div key={idx} className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-6 flex flex-col md:flex-row gap-8">
                                                <div className="size-24 md:size-32 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
                                                </div>
                                                <div className="flex flex-col flex-1 gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{doc.matchRate || '98% Match'}</span>
                                                            <span className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                                                <span className="material-symbols-outlined text-sm">star</span> {doc.rating || '4.9'}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold dark:text-white">{name}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">{specialization} • {doc.experienceYears || '10+'} Years Exp.</p>
                                                        <div className="flex items-center gap-2 text-slate-500 text-xs mt-2">
                                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                                            <span>{doc.location || 'AIIMS Main Campus'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        <button 
                                                            onClick={() => navigate(doc.userId ? `/patient/book/${doc.userId}` : '/patient/book')}
                                                            className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                                                        >
                                                            Book Appointment
                                                        </button>
                                                        <button 
                                                            onClick={() => setSelectedDoctor(doc)}
                                                            className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                        >
                                                            Profile
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4">
                            <div className="size-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined text-3xl text-slate-300">stethoscope</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold dark:text-white">Specialist Matching</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">Upload a medical report or describe symptoms above to see your personalized doctor recommendations.</p>
                            </div>
                            <button onClick={() => navigate('/patient/report-analysis')} className="text-xs font-bold text-primary hover:underline">UPLOAD REPORT NOW →</button>
                        </div>
                    )}

                    {/* My Appointments Sections — Fix 3: Upcoming vs Past */}
                    <div className="space-y-8 pt-6">
                        {/* Upcoming Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Upcoming Consultations
                                {upcomingAppointments.length > 0 && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">{upcomingAppointments.length}</span>}
                            </h3>
                            
                            {appointmentsLoading ? (
                                <div className="p-8 text-center text-slate-400"><p className="text-xs">Fetching schedule...</p></div>
                            ) : upcomingAppointments.length === 0 ? (
                                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-center">
                                    <p className="text-xs text-slate-400">No upcoming appointments scheduled.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingAppointments.map((apt) => (
                                        <div key={apt._id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                        {apt.slot?.doctor?.user?.fullName?.split(' ').map(n => n[0]).join('') || 'DR'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{apt.slot?.doctor?.user?.fullName || 'Doctor'}</h4>
                                                        <p className="text-[10px] uppercase font-bold text-primary leading-none mb-1">{apt.slot?.doctor?.specialization}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-xs text-slate-400">event</span>
                                                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{formatSlotTime(apt.slot?.startTime)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusChip(apt.status)}`}>
                                                        {apt.status}
                                                    </span>
                                                    
                                                    {/* Fix 3: Cancel Button with Confirmation */}
                                                    {apt.status !== 'CANCELLED' && (
                                                        <div className="relative">
                                                            {cancelConfirmId === apt._id ? (
                                                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                                                    <button 
                                                                        onClick={() => handleCancelAppointment(apt._id)}
                                                                        disabled={cancellingId === apt._id}
                                                                        className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 shadow-sm"
                                                                    >
                                                                        {cancellingId === apt._id ? '...' : 'CONFIRM'}
                                                                    </button>
                                                                    <button onClick={() => setCancelConfirmId(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><span className="material-symbols-outlined text-sm">close</span></button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => setCancelConfirmId(apt._id)} className="text-red-400 hover:text-red-500 text-[10px] font-bold px-2 py-1 uppercase tracking-wider underline">Cancel</button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Past Section */}
                        {pastAppointments.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Past History</h3>
                                <div className="space-y-3 opacity-60">
                                    {pastAppointments.map((apt) => (
                                        <div key={apt._id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold dark:text-white">{apt.slot?.doctor?.user?.fullName}</span>
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${statusChip(apt.status)}`}>{apt.status}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                                                <span>{new Date(apt.slot?.startTime).toLocaleDateString()}</span>
                                                <span>{apt.slot?.doctor?.specialization}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => navigate('/patient/report-analysis')} className="p-6 bg-white dark:bg-slate-900 rounded-2xl text-center hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all cursor-pointer">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">AI Diagnostic</p>
                            <div className="text-2xl font-black text-primary dark:text-white">
                                <span className="material-symbols-outlined text-3xl">psychology</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">New Analysis →</p>
                        </button>
                        <button onClick={() => navigate('/patient/upload')} className="p-6 bg-white dark:bg-slate-900 rounded-2xl text-center hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all cursor-pointer">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Vault Storage</p>
                            <div className="text-2xl font-black text-primary dark:text-white">Cloud</div>
                            <p className="text-[10px] text-slate-500 mt-2">Access Records →</p>
                        </button>
                        <button onClick={() => navigate('/patient/appointments')} className="p-6 bg-white dark:bg-slate-900 rounded-2xl text-center hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all cursor-pointer">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Clinic Visits</p>
                            <div className="text-2xl font-black text-primary dark:text-white">{myAppointments.filter(a => a.status === 'COMPLETED').length}</div>
                            <p className="text-[10px] text-slate-500 mt-2">Full Ledger →</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Doctor Profile Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedDoctor(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="text-center mb-8">
                            <div className="size-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedDoctor.fullName || selectedDoctor.name}</h3>
                            <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">{selectedDoctor.specialization || selectedDoctor.department}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Experience</span>
                                <span className="font-bold dark:text-white">{selectedDoctor.experienceYears || '10+'} Years</span>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm flex flex-col gap-1">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Facility</span>
                                <span className="font-bold dark:text-white">{selectedDoctor.location || 'AIIMS India'}</span>
                            </div>
                            {selectedDoctor.consultationFee && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm flex justify-between items-center">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Service Fee</span>
                                    <span className="font-bold text-primary">${selectedDoctor.consultationFee}</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => { setSelectedDoctor(null); navigate(selectedDoctor.userId ? `/patient/book/${selectedDoctor.userId}` : '/patient/book'); }}
                            className="w-full bg-primary text-white font-bold py-4 rounded-2xl mt-8 hover:bg-slate-800 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            Confirm Booking
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PatientDashboard;
