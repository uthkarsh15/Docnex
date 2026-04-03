import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

interface UploadedFile {
    id: string;
    name: string;
    size: string;
    success: boolean;
    analyzing?: boolean;
    analysisResult?: string; // B6: inline analysis result instead of alert()
    viewOpen?: boolean;
}

interface UploadingFile {
    id: string;
    name: string;
    size: string;
    progress: number;
}

const UploadRecord: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
        { id: '1', name: 'Chest_XRay_Digital.dicom', success: true, size: '45.0 MB' },
    ]);
    const [dragOver, setDragOver] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    // D3: Contact modal now has a message form
    const [contactMessage, setContactMessage] = useState('');
    const [contactSent, setContactSent] = useState(false);

    const formatFileSize = (bytes: number): string => {
        if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
        return `${(bytes / 1e3).toFixed(1)} KB`;
    };

    const simulateUpload = useCallback((file: File) => {
        const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newUploading: UploadingFile = {
            id,
            name: file.name,
            size: formatFileSize(file.size),
            progress: 0,
        };
        setUploadingFiles(prev => [...prev, newUploading]);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setUploadingFiles(prev => prev.filter(f => f.id !== id));
                setUploadedFiles(prev => [...prev, {
                    id,
                    name: file.name,
                    size: formatFileSize(file.size),
                    success: true,
                }]);
            } else {
                setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, progress: Math.min(progress, 99) } : f));
            }
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const maxSize = 50 * 1024 * 1024;

        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                alert(`${file.name} exceeds the 50MB limit.`);
                return;
            }
            simulateUpload(file);
        });
    };

    const handleBrowseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleCancelUpload = (id: string) => {
        setUploadingFiles(prev => prev.filter(f => f.id !== id));
    };

    // B6: Show inline analysis result instead of alert()
    const handleAnalyze = (id: string) => {
        setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, analyzing: true, analysisResult: undefined } : f));
        setTimeout(() => {
            setUploadedFiles(prev => prev.map(f => f.id === id ? {
                ...f,
                analyzing: false,
                analysisResult: 'No anomalies detected. Full diagnostic report has been saved to your Vault.',
            } : f));
        }, 2000);
    };

    const handleView = (id: string) => {
        setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, viewOpen: !f.viewOpen } : f));
    };

    const handleContactClose = () => {
        setContactOpen(false);
        setContactSent(false);
        setContactMessage('');
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setContactSent(true);
    };

    return (
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 font-display">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.dicom,.dcm"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <Sidebar role="PATIENT" />

                <div className="lg:col-span-9 space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Upload Medical Record</h1>
                        <p className="text-slate-500 dark:text-slate-400">Securely transmit your clinical documents, lab results, or imaging for AI-assisted analysis.</p>
                    </div>

                    {/* Upload Area with Drag & Drop */}
                    <div className="relative group">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-white dark:bg-slate-900 transition-all cursor-pointer ${
                                dragOver
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10 scale-[1.02] shadow-xl'
                                    : 'border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary/50'
                            }`}
                        >
                            <div className={`size-16 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-full flex items-center justify-center mb-6 transition-transform ${dragOver ? 'scale-125' : 'group-hover:scale-110'}`}>
                                <span className="material-symbols-outlined text-4xl">{dragOver ? 'file_download' : 'cloud_upload'}</span>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {dragOver ? 'Drop files here' : 'Drag and drop health records'}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Support for PDF, DICOM, JPG, and PNG files (Max 50MB)</p>
                            </div>
                            <button
                                onClick={handleBrowseClick}
                                className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
                            >
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {/* Security Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                            <span className="material-symbols-outlined text-emerald-500">encrypted</span>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">End-to-End</p>
                                <p className="text-[10px] text-slate-500">AES-256 Protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                            <span className="material-symbols-outlined text-blue-500">shield_with_heart</span>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">Privacy First</p>
                                <p className="text-[10px] text-slate-500">GDPR Compliant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                            <span className="material-symbols-outlined text-amber-500">timer</span>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">Auto-Purge</p>
                                <p className="text-[10px] text-slate-500">30-day Retention</p>
                            </div>
                        </div>
                    </div>

                    {/* Uploads Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Uploads</h2>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                                {uploadingFiles.length > 0 ? `Uploading ${uploadingFiles.length} file(s)` : `${uploadedFiles.length} file(s) stored`}
                            </span>
                        </div>

                        {/* In-Progress Uploads */}
                        {uploadingFiles.map(file => (
                            <div key={file.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <span className="material-symbols-outlined">picture_as_pdf</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{file.name}</h4>
                                            <p className="text-xs text-slate-500">{file.size} • {Math.round(file.progress)}% complete</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleCancelUpload(file.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined">cancel</span>
                                    </button>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full rounded-full relative transition-all duration-300"
                                        style={{ width: `${file.progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Completed Uploads */}
                        {uploadedFiles.map(file => (
                            <div key={file.id} className="rounded-2xl overflow-hidden">
                                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{file.name}</h4>
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400">Upload Successful • {file.size}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleView(file.id)} className="px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">
                                                {file.viewOpen ? 'Hide' : 'View'}
                                            </button>
                                            <button
                                                onClick={() => handleAnalyze(file.id)}
                                                disabled={file.analyzing}
                                                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {file.analyzing && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                                {file.analyzing ? 'Analyzing...' : 'Analyze'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* B6: Inline analysis result instead of alert() */}
                                    {file.analysisResult && (
                                        <div className="mt-4 p-4 bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3">
                                            <span className="material-symbols-outlined text-emerald-600 mt-0.5">verified</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{file.analysisResult}</p>
                                                {/* C5: CTA to find specialist after analysis */}
                                                <button
                                                    onClick={() => navigate('/patient')}
                                                    className="mt-2 text-xs font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer flex items-center gap-1"
                                                >
                                                    Find a specialist for follow-up <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* File Preview Panel */}
                                {file.viewOpen && (
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-t-0 border-slate-200 dark:border-slate-800">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Filename</span>
                                                <p className="text-slate-900 dark:text-white font-medium mt-1">{file.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Size</span>
                                                <p className="text-slate-900 dark:text-white font-medium mt-1">{file.size}</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Uploaded</span>
                                                <p className="text-slate-900 dark:text-white font-medium mt-1">{new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</span>
                                                <p className="text-emerald-600 font-medium mt-1">Encrypted & Stored</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {uploadedFiles.length === 0 && uploadingFiles.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 block">folder_open</span>
                                <p className="text-sm">No files uploaded yet. Drag files above or click Browse.</p>
                            </div>
                        )}
                    </div>

                    {/* Help Card */}
                    <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black">Need assistance?</h3>
                                <p className="text-slate-400 text-sm max-w-md">Our specialized medical data team can help you digitize physical records or handle complex hospital transfer formats.</p>
                            </div>
                            <button
                                onClick={() => setContactOpen(true)}
                                className="whitespace-nowrap bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-sm hover:bg-slate-200 transition-all"
                            >
                                Contact Specialist
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                            <span className="material-symbols-outlined text-[160px]">support_agent</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* D3: Contact Specialist Modal — now has an actionable message form, distinct from Footer contact */}
            {contactOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleContactClose}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={handleContactClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {contactSent ? (
                            <div className="text-center py-4">
                                <div className="size-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                                <p className="text-slate-500 text-sm mb-4">A records specialist will reach out to you within 2 hours.</p>
                                <button onClick={handleContactClose} className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-all">Done</button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined">support_agent</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Records Assistance</h3>
                                        <p className="text-xs text-slate-500">Our team responds within 2 hours</p>
                                    </div>
                                </div>
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">How can we help?</label>
                                        <textarea
                                            required
                                            value={contactMessage}
                                            onChange={e => setContactMessage(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-white resize-none"
                                            placeholder="I need help digitizing physical records from my hospital…"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all">Send Message</button>
                                </form>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">call</span> +1 (800) DOCNEX-1</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">chat</span> Live Chat</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default UploadRecord;
