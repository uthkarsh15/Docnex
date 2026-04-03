import React, { useState } from 'react';

type ModalType = 'privacy' | 'terms' | 'contact' | null;

const Footer: React.FC = () => {
    const [modal, setModal] = useState<ModalType>(null);

    const modalContent = {
        privacy: {
            title: 'Privacy Policy',
            icon: 'policy',
            body: (
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p><strong>Last updated:</strong> January 1, 2024</p>
                    <p>DOCNEX Inc. ("we", "us") is committed to protecting your personal health information (PHI) in compliance with HIPAA, GDPR, and applicable data protection laws.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Data Collection</h4>
                    <p>We collect only the minimum necessary health records, diagnostic data, and account information required to deliver our services.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Data Security</h4>
                    <p>All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Our infrastructure is SOC 2 Type II certified.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Data Retention</h4>
                    <p>Patient records are retained for the legally required minimum period. Users may request data deletion at any time through their account settings.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Your Rights</h4>
                    <p>You have the right to access, correct, export, or delete your personal data. Contact our Data Protection Officer at dpo@docnex.com.</p>
                </div>
            )
        },
        terms: {
            title: 'Terms of Service',
            icon: 'gavel',
            body: (
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p><strong>Effective Date:</strong> January 1, 2024</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Acceptance of Terms</h4>
                    <p>By accessing DOCNEX, you agree to these Terms of Service and our Privacy Policy.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Service Description</h4>
                    <p>DOCNEX provides a secure platform for medical record management, AI-assisted diagnostics, and healthcare provider matching.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Medical Disclaimer</h4>
                    <p>DOCNEX is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">User Responsibilities</h4>
                    <p>Users are responsible for maintaining account security and ensuring the accuracy of submitted health records.</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Limitation of Liability</h4>
                    <p>DOCNEX shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.</p>
                </div>
            )
        },
        contact: {
            title: 'Contact Us',
            icon: 'contact_support',
            body: (
                <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="material-symbols-outlined text-primary">mail</span>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Email Support</p>
                            <p className="text-slate-500">support@docnex.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="material-symbols-outlined text-primary">call</span>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Phone</p>
                            <p className="text-slate-500">+1 (800) DOCNEX-1</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Headquarters</p>
                            <p className="text-slate-500">350 Fifth Avenue, New York, NY 10118</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="material-symbols-outlined text-primary">schedule</span>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Business Hours</p>
                            <p className="text-slate-500">Monday – Friday, 9:00 AM – 6:00 PM EST</p>
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <>
            <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-12 px-6 lg:px-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="size-6 bg-primary dark:bg-slate-100 flex items-center justify-center rounded text-white dark:text-primary">
                            <span className="material-symbols-outlined text-sm">database</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight uppercase">DOCNEX</h2>
                    </div>
                    <div className="flex gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <button onClick={() => setModal('privacy')} className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 text-sm font-medium text-slate-500 dark:text-slate-400">Privacy Policy</button>
                        <button onClick={() => setModal('terms')} className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 text-sm font-medium text-slate-500 dark:text-slate-400">Terms of Service</button>
                        <button onClick={() => setModal('contact')} className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 text-sm font-medium text-slate-500 dark:text-slate-400">Contact</button>
                    </div>
                    <p className="text-slate-400 text-xs">© {new Date().getFullYear()} DOCNEX Inc. All rights reserved.</p>
                </div>
            </footer>

            {/* Footer Modals */}
            {modal && modalContent[modal] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">{modalContent[modal].icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{modalContent[modal].title}</h3>
                        </div>
                        {modalContent[modal].body}
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;
