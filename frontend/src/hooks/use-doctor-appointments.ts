import { useState, useCallback, useEffect, useRef } from 'react';

export interface ClinicalAppointment {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}

/**
 * Custom hook for managing doctor's clinic schedule and appointment lifecycle.
 */
export function useDoctorAppointments() {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

    const [appointments, setAppointments] = useState<ClinicalAppointment[]>([
        { id: '1', patient: 'John Wilson', date: formatDate(today), time: '09:00 AM', type: 'Cardiology', status: 'Confirmed' },
        { id: '2', patient: 'Emma Watson', date: formatDate(today), time: '11:30 AM', type: 'Follow-up', status: 'Pending' },
        { id: '3', patient: 'Robert Brown', date: formatDate(tomorrow), time: '02:00 PM', type: 'Consultation', status: 'Confirmed' },
        { id: '4', patient: 'Lisa Chang', date: formatDate(tomorrow), time: '04:00 PM', type: 'Check-up', status: 'Pending' },
        { id: '5', patient: 'Michael Davis', date: formatDate(dayAfter), time: '10:00 AM', type: 'Cardiology', status: 'Confirmed' },
    ]);

    const [isShowingAll, setIsShowingAll] = useState(false);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    
    const actionMenuRef = useRef<HTMLDivElement>(null);

    /**
     * Display contextual toast feedback.
     */
    const triggerNotification = useCallback((message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    }, []);

    /**
     * Update appointment status with lifecycle feedback.
     */
    const updateAppointmentStatus = useCallback((id: string, nextStatus: ClinicalAppointment['status']) => {
        setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: nextStatus } : apt));
        setActiveActionId(null);
        
        switch(nextStatus) {
            case 'Confirmed': triggerNotification('Clinical appointment synchronized successfully'); break;
            case 'Completed': triggerNotification('Consultation marked as archived'); break;
            case 'Pending': triggerNotification('Reschedule request initiated for patient'); break;
        }
    }, [triggerNotification]);

    /**
     * Terminate appointment with safety confirmation.
     */
    const terminateAppointment = useCallback((id: string) => {
        if (confirm('Acknowledge: Are you sure you want to terminate this clinical slot?')) {
            setAppointments(prev => prev.filter(apt => apt.id !== id));
            triggerNotification('Appointment slot purged from ledger');
        }
        setActiveActionId(null);
    }, [triggerNotification]);

    /**
     * Close action menus on external interaction.
     */
    useEffect(() => {
        const handleExternalInteraction = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionId(null);
            }
        };
        document.addEventListener('mousedown', handleExternalInteraction);
        return () => document.removeEventListener('mousedown', handleExternalInteraction);
    }, []);

    const confirmedCount = appointments.filter(apt => apt.status === 'Confirmed').length;
    const pendingCount = appointments.filter(apt => apt.status === 'Pending').length;
    const displayedAppointments = isShowingAll ? appointments : appointments.slice(0, 3);

    return {
        appointments,
        displayedAppointments,
        isShowingAll,
        setIsShowingAll,
        activeActionId,
        setActiveActionId,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        notification,
        actionMenuRef,
        updateAppointmentStatus,
        terminateAppointment,
        stats: {
            confirmedCount,
            pendingCount,
            totalCount: appointments.length
        }
    };
}
