import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Reverted to original LandingPage UI as per user request.
 * Kept kebab-case filename as per naming convention cleanup rule.
 */
const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [demoModalOpen, setDemoModalOpen] = useState(false);
    const [demoForm, setDemoForm] = useState({ name: '', email: '', company: '' });
    const [demoSubmitted, setDemoSubmitted] = useState(false);

    const handleDemoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDemoSubmitted(true);
    };

    const handleDemoClose = () => {
        setDemoModalOpen(false);
        setDemoSubmitted(false);
        setDemoForm({ name: '', email: '', company: '' });
    };

    const scrollTo = (id: string) => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleFeatureClick = (link: string) => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate(link);
        } else {
            navigate('/login');
        }
    };

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#1e293b] to-[#0f1729] z-0 opacity-100"></div>
                <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
                        <span className="size-2 bg-blue-400 rounded-full animate-pulse"></span>
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Next-Gen Healthcare</span>
                    </div>

                    <h1 className="text-white text-5xl lg:text-7xl font-black leading-tight tracking-tight mb-8">
                        Secure. Intelligent.<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">Reliable Healthcare.</span>
                    </h1>

                    <p className="text-slate-300 text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-10">
                        Experience the next generation of healthcare data management. Securely store patient records, harness AI diagnostics, and optimize specialist matching.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-white text-[#0f1729] text-base font-black hover:bg-slate-100 transition-all"
                        >
                            Start Free Trial
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        <button
                            onClick={() => scrollTo('#features')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl h-14 px-8 border border-white/30 text-white text-base font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
                        >
                            Explore Features
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-background-light dark:bg-background-dark" id="features">
                <div className="max-w-7xl mx-auto px-6 lg:px-20">
                    <div className="mb-16">
                        <h2 className="text-[#0f1729] dark:text-slate-100 text-sm font-black uppercase tracking-[0.2em] mb-4">Core Capabilities</h2>
                        <h3 className="text-slate-900 dark:text-slate-100 text-4xl font-bold tracking-tight">Tailored for Modern Medicine</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'psychology', title: 'AI Insights', desc: 'Predictive analytics for better patient outcomes and diagnostic accuracy through advanced machine learning models.', link: '/patient', cta: 'Try AI Matching' },
                            { icon: 'shield_lock', title: 'Secure Storage', desc: 'Military-grade encryption for all medical records and sensitive patient data, fully HIPAA and GDPR compliant.', link: '/patient/upload', cta: 'Upload Records' },
                            { icon: 'person_search', title: 'Doctor Matching', desc: 'Intelligent pairing based on specialty, availability, and clinical history to ensure the best patient-provider fit.', link: '/patient/book', cta: 'Find Specialists' },
                        ].map((feature, i) => (
                            <div key={i} className="group relative flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0f1729]/10">
                                <div className="size-14 rounded-xl bg-[#0f1729]/5 dark:bg-slate-100/10 flex items-center justify-center text-[#0f1729] dark:text-slate-100">
                                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold">{feature.title}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => handleFeatureClick(feature.link)}
                                        className="flex items-center gap-2 text-[#0f1729] dark:text-slate-100 text-sm font-bold no-underline bg-transparent border-none cursor-pointer p-0 hover:gap-3 transition-all"
                                    >
                                        {feature.cta} <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="py-20 bg-white dark:bg-slate-900/50" id="security">
                <div className="max-w-7xl mx-auto px-6 lg:px-20">
                    <div className="mb-12">
                        <h2 className="text-[#0f1729] dark:text-slate-100 text-sm font-black uppercase tracking-[0.2em] mb-4">Enterprise Security</h2>
                        <h3 className="text-slate-900 dark:text-slate-100 text-4xl font-bold tracking-tight">Your data, protected by design</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'encrypted', title: 'AES-256 Encryption', desc: 'All data encrypted at rest and in transit using military-grade cryptographic standards.' },
                            { icon: 'verified_user', title: 'HIPAA Compliant', desc: 'Full compliance with healthcare data protection regulations across all jurisdictions.' },
                            { icon: 'security', title: 'Zero-Trust Architecture', desc: 'Every access request is verified regardless of source, ensuring maximum protection.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                <div className="size-12 shrink-0 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                </div>
                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-bold mb-1">{item.title}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* CTA Section */}
            <section className="py-24 bg-background-light dark:bg-background-dark">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-[2rem] p-10 lg:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <span className="material-symbols-outlined text-[10rem]">health_metrics</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-3xl lg:text-5xl font-black mb-6 relative z-10">Ready to transform your healthcare workflow?</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">Join over 1,000 medical professionals who trust DOCNEX with their critical patient data.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-[#0f1729] text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                            >
                                Create Free Account
                            </button>
                            <button
                                onClick={() => setDemoModalOpen(true)}
                                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
                            >
                                Schedule a Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Modal */}
            {demoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleDemoClose}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={handleDemoClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {demoSubmitted ? (
                            <div className="text-center py-8">
                                <div className="size-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Demo Scheduled!</h3>
                                <p className="text-slate-500 text-sm mb-6">We'll send you a confirmation email with a calendar invite shortly.</p>
                                <button
                                    onClick={handleDemoClose}
                                    className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Schedule a Demo</h3>
                                <p className="text-sm text-slate-500 mb-6">Fill in your details and our team will reach out within 24 hours.</p>
                                <form onSubmit={handleDemoSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Full Name</label>
                                        <input required value={demoForm.name} onChange={e => setDemoForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" placeholder="John Smith" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Email</label>
                                        <input required type="email" value={demoForm.email} onChange={e => setDemoForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" placeholder="john@hospital.org" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Organization</label>
                                        <input value={demoForm.company} onChange={e => setDemoForm(f => ({ ...f, company: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" placeholder="City General Hospital" />
                                    </div>
                                    <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary/90 transition-all mt-2">Request Demo</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default LandingPage;
