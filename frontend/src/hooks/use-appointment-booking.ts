import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DOCTORS_DB } from '../data/doctors';

export interface BookingSlot {
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  isAvailable: boolean;
}

/**
 * Custom hook for managing the clinical appointment booking flow.
 * Handles calendar logic, slot selection, and confirmation sequence.
 */
export function useAppointmentBooking() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    
    const now = new Date();
    const [viewDate, setViewDate] = useState({ 
        month: now.getMonth(), 
        year: now.getFullYear() 
    });
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 AM');
    
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isBookingInProgress, setIsBookingInProgress] = useState(false);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const targetDoctor = useMemo(() => 
        DOCTORS_DB.find(doc => doc.userId === doctorId) || DOCTORS_DB[0]
    , [doctorId]);

    const daysInMonth = useMemo(() => 
        new Date(viewDate.year, viewDate.month + 1, 0).getDate()
    , [viewDate]);

    const firstDayOffset = useMemo(() => 
        new Date(viewDate.year, viewDate.month, 1).getDay()
    , [viewDate]);

    const isViewingCurrentMonth = useMemo(() => 
        now.getFullYear() === viewDate.year && now.getMonth() === viewDate.month
    , [viewDate, now]);

    const shiftMonth = useCallback((offset: number) => {
        setViewDate(prev => {
            let nextMonth = prev.month + offset;
            let nextYear = prev.year;
            
            if (nextMonth > 11) {
                nextMonth = 0;
                nextYear++;
            } else if (nextMonth < 0) {
                nextMonth = 11;
                nextYear--;
            }
            
            return { month: nextMonth, year: nextYear };
        });
        setSelectedDay(null);
    }, []);

    const processFinalBooking = useCallback(() => {
        setIsBookingInProgress(true);
        setBookingError(null);
        
        // Simulate backend synchronization
        setTimeout(() => {
            setIsBookingInProgress(false);
            setIsBookingConfirmed(true);
            setTimeout(() => {
                navigate('/patient');
            }, 2000);
        }, 1500);
    }, [navigate]);

    const isDateDisabled = useCallback((day: number) => {
        if (!isViewingCurrentMonth) return false;
        return day < now.getDate();
    }, [isViewingCurrentMonth, now]);

    const availableSlots: BookingSlot[] = [
        { time: '09:00 AM', period: 'Morning', isAvailable: true },
        { time: '09:30 AM', period: 'Morning', isAvailable: true },
        { time: '10:00 AM', period: 'Morning', isAvailable: true },
        { time: '10:30 AM', period: 'Morning', isAvailable: true },
        { time: '11:00 AM', period: 'Morning', isAvailable: true },
        { time: '01:30 PM', period: 'Afternoon', isAvailable: true },
        { time: '02:00 PM', period: 'Afternoon', isAvailable: true },
        { time: '02:30 PM', period: 'Afternoon', isAvailable: false },
    ];

    return {
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
        calendar: {
            daysInMonth,
            firstDayOffset,
            isViewingCurrentMonth
        },
        availableSlots,
        actions: {
            shiftMonth,
            processFinalBooking,
            isDateDisabled
        }
    };
}
