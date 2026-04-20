import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

interface LoginProps {
    onLogin: (user: { id?: string; role: string; name: string }) => void;
}

/**
 * Reverted to original Login UI as per user request.
 * Kept kebab-case filename as per naming convention cleanup rule.
 */
const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { token, user } = response.data;

            // Fix 6: Always store in localStorage with consistent keys
            localStorage.setItem('docnex_token', token);
            localStorage.setItem('docnex_user', JSON.stringify(user));
            // Legacy keys for backward compatibility
            if (rememberMe) {
                localStorage.setItem('token', token);
            } else {
                sessionStorage.setItem('token', token);
            }
            onLogin(user);

            if (user.role === 'PATIENT') {
                navigate('/patient');
            } else if (user.role === 'DOCTOR') {
                navigate('/doctor');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Invalid credentials or server error.');
        } finally {
            setLoading(false);
        }
    };

    const handleMockLogin = (role: string, name: string) => {
        // Mock login doesn't have a real token or id, but still persist
        const mockUser = { role, name };
        localStorage.setItem('docnex_user', JSON.stringify(mockUser));
        onLogin(mockUser);
        if (role === 'PATIENT') navigate('/patient');
        else navigate('/doctor');
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const userData = {
                role: 'PATIENT',
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            };

            localStorage.setItem('docnex_token', await firebaseUser.getIdToken());
            localStorage.setItem('token', await firebaseUser.getIdToken());
            localStorage.setItem('docnex_user', JSON.stringify(userData));
            onLogin(userData);
            navigate('/patient');
        } catch (err: any) {
            console.error('Google login error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled. You closed the popup before completing authentication.');
            } else if (err.code === 'auth/network-request-failed') {
                setError('Network error. Please check your internet connection and try again.');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Pop-up blocked by browser. Please allow pop-ups for this site and try again.');
            } else {
                setError('Google sign-in failed. Please try again or use email login.');
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setForgotSent(true);
        setTimeout(() => {
            setForgotOpen(false);
            setForgotSent(false);
            setForgotEmail('');
        }, 3000);
    };

    return (
        <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden bg-background-light dark:bg-background-dark min-h-[80vh]">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-[440px] glass-card rounded-xl shadow-2xl dark:shadow-black/30 p-8 md:p-10 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Access your secure professional document portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg shrink-0">error_outline</span>
                        <span className="flex-1">{error}</span>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 transition-colors shrink-0 bg-transparent border-none cursor-pointer p-0">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">
                                <span className="material-symbols-outlined text-xl">mail</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-500 transition-all outline-none"
                                id="email"
                                placeholder="dr.smith@medical.org"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="password">Password</label>
                            <button type="button" onClick={() => setForgotOpen(true)} className="text-xs font-semibold text-primary dark:text-blue-400 no-underline hover:underline bg-transparent border-none cursor-pointer p-0">Forgot?</button>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">
                                <span className="material-symbols-outlined text-xl">lock</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-12 py-3.5 bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-500 transition-all outline-none"
                                id="password"
                                placeholder="Enter your security key"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-1">
                        <input
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary dark:bg-slate-700 dark:checked:bg-primary"
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="text-sm text-slate-600 dark:text-slate-400 select-none" htmlFor="remember">Stay signed in for 30 days</label>
                    </div>

                    <button
                        className="w-full bg-primary dark:bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 dark:shadow-blue-600/20 hover:bg-primary/90 dark:hover:bg-blue-700 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        <span>{loading ? 'Authenticating...' : 'Secure Sign In'}</span>
                        {loading ? (
                            <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        )}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Or continue with</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 mt-5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all disabled:opacity-50 group"
                    >
                        {googleLoading ? (
                            <span className="material-symbols-outlined text-lg animate-spin text-slate-500 dark:text-slate-400">progress_activity</span>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        )}
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700/50 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Quick Access (Beta)</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => handleMockLogin('PATIENT', 'John Wilson')}
                            className="text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25 transition-all border-none cursor-pointer"
                        >
                            Patient Access
                        </button>
                        <button
                            onClick={() => handleMockLogin('DOCTOR', 'Dr. Sarah Smith')}
                            className="text-[10px] font-black uppercase tracking-tighter bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-500/20 dark:hover:bg-blue-500/25 transition-all border-none cursor-pointer"
                        >
                            Doctor Portal
                        </button>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {forgotOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setForgotOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/30 w-full max-w-sm p-8 relative border border-transparent dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setForgotOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer p-0">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {forgotSent ? (
                            <div className="text-center py-4">
                                <div className="size-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-2xl">mark_email_read</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Reset Link Sent!</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Check your inbox at <strong className="text-slate-700 dark:text-slate-200">{forgotEmail}</strong> for password reset instructions.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Reset Password</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enter your email and we'll send a password reset link.</p>
                                <form onSubmit={handleForgotSubmit} className="space-y-4">
                                    <input
                                        required type="email" value={forgotEmail}
                                        onChange={e => setForgotEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20"
                                        placeholder="your.email@medical.org"
                                    />
                                    <button type="submit" className="w-full bg-primary dark:bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 transition-all">Send Reset Link</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Login;
