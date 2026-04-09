import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
    user: { role: string; name: string } | null;
    onLogout: () => void;
}

interface Notification {
    id: number;
    text: string;
    time: string;
    icon: string;
    read: boolean;
    link: string; // C3: each notification links somewhere
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // B1/B3: Notifications are now stateful so they can be marked as read
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, text: 'Your blood report results are ready', time: '2 min ago', icon: 'lab_profile', read: false, link: '/patient/vault' },
        { id: 2, text: 'Appointment with Dr. Mitchell confirmed', time: '1 hour ago', icon: 'event_available', read: false, link: '/patient/appointments' },
        { id: 3, text: 'New health tip available', time: '3 hours ago', icon: 'tips_and_updates', read: true, link: '/patient' },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close notifications dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // B1: Mark all notifications as read
    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // B3: Click a notification — mark as read and navigate
    const handleNotificationClick = (notif: Notification) => {
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        setNotifOpen(false);
        navigate(notif.link);
    };

    // C6: Role-aware nav links
    const getAuthenticatedNavLinks = () => {
        if (user?.role === 'DOCTOR') {
            return [
                { to: '/doctor', label: 'Dashboard' },
                { to: '/doctor/appointments', label: 'Appointments' },
                { to: '/doctor/patients', label: 'Patients' },
            ];
        }
        return [
            { to: '/patient', label: 'Dashboard' },
            { to: '/patient/report-analysis', label: 'AI Analysis' },
            { to: '/patient/book', label: 'Find Doctors' },
            { to: '/patient/upload', label: 'Records' },
        ];
    };

    const navLinks = user ? getAuthenticatedNavLinks() : [];

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 lg:px-20 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between whitespace-nowrap">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 no-underline text-primary dark:text-slate-100">
                        <div className="size-8 bg-primary dark:bg-slate-100 flex items-center justify-center rounded-lg text-white dark:text-primary">
                            <span className="material-symbols-outlined text-2xl">database</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight uppercase">DOCNEX</h2>
                    </Link>

                    {!user && isHomePage && (
                        <nav className="hidden md:flex items-center gap-10">
                            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-slate-100 text-sm font-semibold transition-colors no-underline cursor-pointer" href="#features" onClick={(e) => handleSmoothScroll(e, '#features')}>Features</a>
                            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-slate-100 text-sm font-semibold transition-colors no-underline cursor-pointer" href="#security" onClick={(e) => handleSmoothScroll(e, '#security')}>Security</a>
                            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-slate-100 text-sm font-semibold transition-colors no-underline cursor-pointer" href="#stats" onClick={(e) => handleSmoothScroll(e, '#stats')}>Performance</a>
                        </nav>
                    )}

                    {user && (
                        <nav className="hidden md:flex items-center gap-9">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`text-sm font-medium leading-normal transition-colors no-underline ${
                                        location.pathname === link.to
                                            ? 'text-primary font-bold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                <div className="flex flex-1 justify-end gap-6 items-center">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {/* Notifications Bell with Dropdown */}
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 size-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[8px] text-white font-bold flex items-center justify-center">{unreadCount}</span>
                                    )}
                                </button>
                                {notifOpen && (
                                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                                            {/* B1: Mark all read now works */}
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer hover:underline bg-transparent border-none p-0"
                                            >
                                                {unreadCount > 0 ? 'Mark all read' : 'All caught up ✓'}
                                            </button>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.map(n => (
                                                /* B3: Notifications now navigate on click */
                                                <button
                                                    key={n.id}
                                                    onClick={() => handleNotificationClick(n)}
                                                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-none bg-transparent text-left ${!n.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg text-primary mt-0.5">{n.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                                    </div>
                                                    {!n.read && <span className="size-2 bg-primary rounded-full mt-2 shrink-0"></span>}
                                                </button>
                                            ))}
                                        </div>
                                        {/* B2: "View all" now navigates */}
                                        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                                            <button
                                                onClick={() => { setNotifOpen(false); navigate(user.role === 'DOCTOR' ? '/doctor/appointments' : '/patient/appointments'); }}
                                                className="text-xs font-bold text-primary cursor-pointer hover:underline bg-transparent border-none p-0"
                                            >
                                                View all notifications →
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/a/default-user=s80-p")' }}></div>
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">{user.name}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider mt-1">{user.role}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => { onLogout(); navigate('/'); }}
                                className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/5 dark:bg-slate-800 text-primary dark:text-slate-100 hover:bg-primary/10 transition-colors"
                                title="Sign out"
                            >
                                <span className="material-symbols-outlined text-xl">logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-primary text-slate-50 text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-slate-900 dark:text-slate-100"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 animate-in fade-in slide-in-from-top-1">
                    {!user && isHomePage && (
                        <>
                            <a className="block px-4 py-2 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 no-underline" href="#features" onClick={(e) => { handleSmoothScroll(e, '#features'); setMobileMenuOpen(false); }}>Features</a>
                            <a className="block px-4 py-2 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 no-underline" href="#security" onClick={(e) => { handleSmoothScroll(e, '#security'); setMobileMenuOpen(false); }}>Security</a>
                            <a className="block px-4 py-2 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 no-underline" href="#stats" onClick={(e) => { handleSmoothScroll(e, '#stats'); setMobileMenuOpen(false); }}>Performance</a>
                        </>
                    )}
                    {/* C6: Mobile menu also role-aware */}
                    {user && navLinks.map(link => (
                        <Link key={link.to} to={link.to} className="block px-4 py-2 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 no-underline">{link.label}</Link>
                    ))}
                    {!user && (
                        <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full mt-2 bg-primary text-white text-sm font-bold py-3 rounded-lg">Get Started</button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
