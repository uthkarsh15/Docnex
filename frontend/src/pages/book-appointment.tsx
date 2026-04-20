import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAppointmentBooking } from '../hooks/use-appointment-booking';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/**
 * BookAppointment page — UI consistency fix.
 * Fix 2: Matched root container padding, max-width, and grid layout to patient dashboard.
 * Added Sidebar for navigation consistency. Typography and card styles match design system.
 */
const BookAppointment: React.FC = () => {
    const {
        targetDoctor,
        viewDate,
        selectedDay,
        setSelectedDay,
        selectedTimeSlot,
        setSelectedTimeSlot,
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        isBookingInProgress,
        isBookingConfirmed,
        bookingError,
        calendar,
        availableSlots,
        actions
    } = useAppointmentBooking();

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role="PATIENT" />

                <div className="lg:col-span-9 space-y-8">
                    {/* Header — matches authenticated page heading pattern */}
                    <div>
                        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                            <Link to="/patient" className="hover:text-primary transition-colors no-underline text-slate-500">Home</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-primary font-semibold">{targetDoctor.fullName}</span>
                        </nav>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Schedule Your Consultation</h1>
                        <p className="text-slate-500 dark:text-slate-400">Review doctor availability and confirm your preferred time slot below.</p>
                    </div>

                    {/* Booking Error */}
                    {bookingError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600">
                            <span className="material-symbols-outlined">error</span>
                            <span className="text-sm font-medium">{bookingError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Calendar — card style matches design system */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                                        <span className="material-symbols-outlined text-primary">calendar_month</span>
                                        Select Date
                                    </h3>
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-lg p-1">
                                        <button onClick={() => actions.shiftMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"><span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-300">chevron_left</span></button>
                                        <span className="font-bold text-sm min-w-[120px] text-center uppercase tracking-wider text-slate-900 dark:text-white">{MONTHS[viewDate.month]} {viewDate.year}</span>
                                        <button onClick={() => actions.shiftMonth(1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"><span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-300">chevron_right</span></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                                        <div key={d} className="text-[11px] font-bold text-slate-400 py-2">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {[...Array(calendar.firstDayOffset)].map((_, i) => (
                                        <div key={`empty-${i}`} className="h-12"></div>
                                    ))}
                                    {[...Array(calendar.daysInMonth)].map((_, i) => {
                                        const day = i + 1;
                                        const disabled = actions.isDateDisabled(day);
                                        return (
                                            <button
                                                key={day}
                                                onClick={() => !disabled && setSelectedDay(day)}
                                                className={`h-12 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                                    selectedDay === day
                                                        ? 'bg-primary text-white shadow-lg font-bold'
                                                        : disabled
                                                            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                            : 'text-slate-800 dark:text-slate-200 hover:bg-primary/5'
                                                }`}
                                                disabled={disabled}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots — card style matches design system */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-lg flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                                    <span className="material-symbols-outlined text-primary">schedule</span>
                                    Available Time Slots
                                </h3>
                                {availableSlots.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-8">No available slots for this date. Try selecting a different day.</p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {availableSlots.map(({ time, period, isAvailable }) => (
                                            <button
                                                key={time}
                                                onClick={() => isAvailable && setSelectedTimeSlot(time)}
                                                disabled={!isAvailable}
                                                className={`group relative py-3 px-4 rounded-lg border-2 transition-all font-bold text-center ${
                                                    !isAvailable
                                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-transparent cursor-not-allowed'
                                                        : selectedTimeSlot === time
                                                            ? 'bg-primary text-white border-primary shadow-md'
                                                            : 'bg-primary/5 text-primary border-transparent hover:border-primary/20'
                                                }`}
                                            >
                                                <div className={`text-[10px] uppercase ${!isAvailable ? '' : selectedTimeSlot === time ? 'opacity-70' : 'text-slate-400'}`}>{period}</div>
                                                <div>{time}</div>
                                                {selectedTimeSlot === time && isAvailable && (
                                                    <span className="absolute top-1 right-1 material-symbols-outlined text-[14px]">check_circle</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Doctor Summary Card */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-center">
                                <div className="h-32 bg-primary relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-slate-800 opacity-50"></div>
                                    <div className="relative z-10 size-20 rounded-full border-4 border-white/20 bg-slate-200 shadow-xl mb-[-40px] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-400">person</span>
                                    </div>
                                </div>
                                <div className="pt-12 px-6 pb-6">
                                    <h4 className="font-bold text-xl text-slate-900 dark:text-white">{targetDoctor.fullName}</h4>
                                    <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wider">{targetDoctor.specialization}</p>
                                    <div className="flex items-center justify-center gap-2 mb-6">
                                        <div className="flex text-yellow-500">
                                            {[...Array(4)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm">star</span>)}
                                            <span className="material-symbols-outlined text-sm">star_half</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">(4.8/5)</span>
                                    </div>
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4 text-left text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Appointment Date</span>
                                            <span className="text-slate-900 dark:text-white font-bold">
                                                {selectedDay ? `${MONTHS[viewDate.month].slice(0,3)} ${selectedDay}, ${viewDate.year}` : '—'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Selected Time</span>
                                            <span className="text-slate-900 dark:text-white font-bold">{selectedTimeSlot}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Consultation Fee</span>
                                            <span className="text-slate-900 dark:text-white font-bold">${targetDoctor.consultationFee || '120.00'}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsConfirmModalOpen(true)}
                                        disabled={!selectedDay}
                                        className="w-full bg-primary text-white py-4 rounded-lg font-bold mt-8 hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Confirm Appointment
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                    <p className="text-[10px] text-slate-400 mt-4 px-4 leading-relaxed">By clicking confirm, you agree to DOCNEX medical service terms and privacy policy.</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                <div className="flex items-start gap-4 text-blue-800 dark:text-blue-300">
                                    <span className="material-symbols-outlined text-blue-600 shrink-0">info</span>
                                    <div>
                                        <h5 className="text-sm font-bold">Need immediate help?</h5>
                                        <p className="text-xs mt-1 leading-normal opacity-80">If this is an emergency, please call 911 or visit the nearest emergency department.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => !isBookingInProgress && !isBookingConfirmed && setIsConfirmModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative" onClick={e => e.stopPropagation()}>
                        {!isBookingInProgress && !isBookingConfirmed && (
                            <button onClick={() => setIsConfirmModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                        {isBookingConfirmed ? (
                            <div className="text-center py-4">
                                <div className="size-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Appointment Requested!</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Your appointment is now PENDING. The doctor will confirm it shortly. Redirecting to dashboard...</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Confirm Your Appointment</h3>
                                <div className="space-y-3 text-left text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
                                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Doctor</span><span className="font-bold text-slate-900 dark:text-white">{targetDoctor.fullName}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Date</span><span className="font-bold text-slate-900 dark:text-white">{MONTHS[viewDate.month].slice(0,3)} {selectedDay}, {viewDate.year}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Time</span><span className="font-bold text-slate-900 dark:text-white">{selectedTimeSlot}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Fee</span><span className="font-bold text-slate-900 dark:text-white">${targetDoctor.consultationFee || '120.00'}</span></div>
                                </div>
                                {bookingError && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-red-600 text-xs text-left">
                                        {bookingError}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button onClick={() => setIsConfirmModalOpen(false)} disabled={isBookingInProgress} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">Cancel</button>
                                    <button
                                        onClick={actions.processFinalBooking}
                                        disabled={isBookingInProgress}
                                        className="flex-1 py-3 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isBookingInProgress ? (
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
