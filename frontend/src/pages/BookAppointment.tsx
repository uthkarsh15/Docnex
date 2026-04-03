import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];

// Get the day of the week (0=Sun) for the 1st of a given month/year
function getFirstDayOfWeek(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

const BookAppointment: React.FC = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    // B7: Start at current month/year instead of hardcoded Oct 2023
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [selectedDate, setSelectedDate] = useState(0); // 0 = none selected
    const [selectedTime, setSelectedTime] = useState('09:00 AM');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [confirming, setConfirming] = useState(false);

    // C1: Derive doctor info from doctorId to avoid always showing same name
    const doctorLookup: Record<string, { name: string; specialty: string }> = {
        'mock1': { name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist' },
        'test': { name: 'Dr. Sarah Mitchell', specialty: 'Senior Cardiologist' },
    };
    const doctor = doctorLookup[doctorId || ''] || { name: 'Dr. Sarah Mitchell', specialty: 'Senior Cardiologist' };

    const daysInCurrentMonth = DAYS_IN_MONTH[currentMonth];
    const firstDayOffset = getFirstDayOfWeek(currentYear, currentMonth);
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
        setSelectedDate(0); // Reset selection
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
        setSelectedDate(0);
    };

    const handleConfirm = () => {
        setShowConfirmModal(true);
    };

    const handleFinalConfirm = () => {
        setConfirming(true);
        setTimeout(() => {
            setConfirming(false);
            setConfirmed(true);
            setTimeout(() => {
                navigate('/patient');
            }, 2000);
        }, 1500);
    };

    const isPastDate = (day: number) => {
        if (!isCurrentMonth) return false;
        return day < today.getDate();
    };

    const timeSlots = [
        { t: '09:00 AM', p: 'Morning', available: true },
        { t: '09:30 AM', p: 'Morning', available: true },
        { t: '10:00 AM', p: 'Morning', available: true },
        { t: '10:30 AM', p: 'Morning', available: true },
        { t: '11:00 AM', p: 'Morning', available: true },
        { t: '01:30 PM', p: 'Afternoon', available: true },
        { t: '02:00 PM', p: 'Afternoon', available: true },
        { t: '02:30 PM', p: 'Afternoon', available: false },
    ];

    return (
        <main className="flex-1 flex flex-col items-center py-8 px-4 lg:px-20 font-display">
            <div className="w-full max-w-[1000px] flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Link to="/patient" className="hover:text-primary transition-colors no-underline text-slate-500">Home</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <Link to="/patient/book" className="hover:text-primary transition-colors no-underline text-slate-500">Cardiology</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary font-semibold">{doctor.name}</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-primary dark:text-white">Schedule Your Consultation</h1>
                    <p className="text-slate-500 dark:text-slate-400">Review doctor availability and confirm your preferred time slot below.</p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Calendar Selection */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-primary dark:text-white">
                                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    Select Date
                                </h3>
                                <div className="flex items-center gap-4 bg-primary/5 rounded-lg p-1">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-md shadow-sm transition-all"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                                    <span className="font-bold text-sm min-w-[120px] text-center uppercase tracking-wider text-primary">{MONTHS[currentMonth]} {currentYear}</span>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-md shadow-sm transition-all"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                                    <div key={d} className="text-[11px] font-bold text-slate-400 py-2">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {/* Empty cells for offset */}
                                {[...Array(firstDayOffset)].map((_, i) => (
                                    <div key={`empty-${i}`} className="h-12"></div>
                                ))}
                                {/* Day buttons */}
                                {[...Array(daysInCurrentMonth)].map((_, i) => {
                                    const day = i + 1;
                                    const past = isPastDate(day);
                                    return (
                                        <button
                                            key={day}
                                            onClick={() => !past && setSelectedDate(day)}
                                            className={`h-12 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                                selectedDate === day
                                                    ? 'bg-primary text-white shadow-lg font-bold'
                                                    : past
                                                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                        : 'text-slate-800 dark:text-slate-200 hover:bg-primary/5'
                                            }`}
                                            disabled={past}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-sm">
                            <h3 className="font-bold text-lg flex items-center gap-2 mb-6 text-primary dark:text-white">
                                <span className="material-symbols-outlined text-primary">schedule</span>
                                Available Time Slots
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {timeSlots.map(({ t, p, available }) => (
                                    <button
                                        key={t}
                                        onClick={() => available && setSelectedTime(t)}
                                        disabled={!available}
                                        className={`group relative py-3 px-4 rounded-lg border-2 transition-all font-bold text-center ${
                                            !available
                                                ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed'
                                                : selectedTime === t
                                                    ? 'bg-primary text-white border-primary shadow-md'
                                                    : 'bg-primary/5 text-primary border-transparent hover:border-primary/20'
                                        }`}
                                    >
                                        <div className={`text-[10px] uppercase ${!available ? '' : selectedTime === t ? 'opacity-70' : 'text-slate-400'}`}>{p}</div>
                                        <div>{t}</div>
                                        {selectedTime === t && available && (
                                            <span className="absolute top-1 right-1 material-symbols-outlined text-[14px]">check_circle</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary Sidebar */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                            <div className="h-32 bg-primary flex items-center justify-center p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-slate-800 opacity-50"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="size-20 rounded-full border-4 border-white/20 bg-cover bg-center mb-[-40px] shadow-xl overflow-hidden">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMiONSUBhXuPiLxNnIa7896LpTkNfjF85dSMAGQKI62xXuTFC1kyumk2_1-F71WSlUwlFfKPchvnUCWZLqiw0eW7jNm1-Yk8naLydUjFuDDzxfqE1L70A5Xr9ZMvlLFoPFFpjBRNTyPgW595bO_3k0pJhFF9TqDUDRQfwyHmlY0rV47Je5DLwwYgT_bs6o56zuw4RUvlneKJmFWkWKYa55td7NkLkuWABh74bHPVLB1D00vKiGYG49b3rFTjzNLBZyiIU9bimObNg" alt="Doctor" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 px-6 pb-6 text-center">
                                <h4 className="font-bold text-xl text-primary dark:text-white">{doctor.name}</h4>
                                <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wider">{doctor.specialty}</p>
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <div className="flex text-yellow-500">
                                        {[...Array(4)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm">star</span>)}
                                        <span className="material-symbols-outlined text-sm">star_half</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">(4.8/5)</span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4 text-left font-display text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Appointment Date</span>
                                        <span className="text-primary dark:text-white font-bold">
                                            {selectedDate > 0 ? `${MONTHS[currentMonth].slice(0,3)} ${selectedDate}, ${currentYear}` : '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Selected Time</span>
                                        <span className="text-primary dark:text-white font-bold">{selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Consultation Fee</span>
                                        <span className="text-primary dark:text-white font-bold">$120.00</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleConfirm}
                                    disabled={selectedDate === 0}
                                    className="w-full bg-primary text-white py-4 rounded-lg font-bold mt-8 hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Confirm Appointment
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                                <p className="text-[10px] text-slate-400 mt-4 px-4">By clicking confirm, you agree to DOCNEX medical service terms and privacy policy.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-slate-800/50 p-6 rounded-xl border border-blue-100 dark:border-slate-700">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-blue-600">info</span>
                                <div>
                                    <h5 className="text-sm font-bold text-blue-900 dark:text-blue-100">Need immediate help?</h5>
                                    <p className="text-xs text-blue-700 dark:text-blue-200 mt-1 leading-normal">If this is an emergency, please call 911 or visit the nearest emergency department.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => !confirming && !confirmed && setShowConfirmModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative" onClick={e => e.stopPropagation()}>
                        {!confirming && !confirmed && (
                            <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                        {confirmed ? (
                            <div className="text-center py-4">
                                <div className="size-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Appointment Confirmed!</h3>
                                <p className="text-slate-500 text-sm">You will receive a confirmation email and calendar invite. Redirecting to dashboard...</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Confirm Your Appointment</h3>
                                <div className="space-y-3 text-left text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
                                    <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-bold dark:text-white">{doctor.name}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-bold dark:text-white">{MONTHS[currentMonth].slice(0,3)} {selectedDate}, {currentYear}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-bold dark:text-white">{selectedTime}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Fee</span><span className="font-bold dark:text-white">$120.00</span></div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowConfirmModal(false)} disabled={confirming} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors dark:text-white">Cancel</button>
                                    <button
                                        onClick={handleFinalConfirm}
                                        disabled={confirming}
                                        className="flex-1 py-3 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {confirming ? (
                                            <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Booking...</>
                                        ) : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default BookAppointment;
