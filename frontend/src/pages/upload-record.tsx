import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useFileUpload } from '../hooks/use-file-upload';

/**
 * Unified Records page — combines Upload and Vault functionality.
 * Kept the extracted useFileUpload hook for business logic.
 * Restored the original inline layout, CSS classes, and typography.
 * Fix 1: Added functioning delete button with inline confirmation on each record.
 */
const UploadRecord: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'upload' | 'vault'>('upload');
    const {
        uploadingFiles,
        uploadedFiles,
        startUpload,
        cancelUpload,
        analyzeFile,
        toggleFileView,
        toggleDeleteConfirm,
        confirmDelete
    } = useFileUpload();

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const maxSize = 50 * 1024 * 1024;

        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                alert(`${file.name} exceeds the 50MB limit.`);
                return;
            }
            startUpload(file);
        });
    };

    const handleBrowseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 font-display">
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
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">My Records</h1>
                        <p className="text-slate-500 dark:text-slate-400">Upload clinical documents or access your secure medical vault.</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'upload'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">cloud_upload</span>
                            Upload
                        </button>
                        <button
                            onClick={() => setActiveTab('vault')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'vault'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">shield_lock</span>
                            Vault
                        </button>
                    </div>

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <div className="space-y-8">
                            {/* Upload Area Restored to original layout */}
                            <div className="relative group">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-primary transition-all cursor-pointer"
                                >
                                    <div className="size-16 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Drag and drop health records</h3>
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
                                            <button onClick={() => cancelUpload(file.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined">cancel</span>
                                            </button>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full relative transition-all duration-300"
                                                style={{ width: `${file.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}

                                {/* Completed Uploads — with Delete button (Fix 1) */}
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
                                                    <button onClick={() => toggleFileView(file.id)} className="px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">
                                                        {file.isViewOpen ? 'Hide' : 'View'}
                                                    </button>
                                                    <button
                                                        onClick={() => analyzeFile(file.id)}
                                                        disabled={file.isAnalyzing}
                                                        className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        {file.isAnalyzing && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                                        {file.isAnalyzing ? 'Analyzing...' : 'Analyze'}
                                                    </button>
                                                    {/* Fix 1: Delete button */}
                                                    <button
                                                        onClick={() => toggleDeleteConfirm(file.id)}
                                                        className="px-3 py-2 text-xs font-bold text-red-500 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Fix 1: Inline delete confirmation */}
                                            {file.isDeleteConfirmOpen && (
                                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                        <span className="material-symbols-outlined text-lg">warning</span>
                                                        <span className="text-sm font-medium">Are you sure you want to delete this record?</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => toggleDeleteConfirm(file.id)}
                                                            className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(file.id)}
                                                            className="px-4 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                                        >
                                                            Confirm Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {file.analysisResult && (
                                                <div className="mt-4 p-4 bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-emerald-600 mt-0.5">verified</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{file.analysisResult}</p>
                                                        <button
                                                            onClick={() => navigate('/patient/report-analysis')}
                                                            className="mt-2 text-xs font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer flex items-center gap-1"
                                                        >
                                                            Find a specialist for follow-up <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {file.isViewOpen && (
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
                            </div>

                            {/* Help Card Restored */}
                            <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black">Need assistance?</h3>
                                        <p className="text-slate-400 text-sm max-w-md">Our specialized medical data team can help you digitize physical records or handle complex hospital transfer formats.</p>
                                    </div>
                                    <button className="whitespace-nowrap bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-sm hover:bg-slate-200 transition-all">
                                        Contact Specialist
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vault Tab */}
                    {activeTab === 'vault' && (
                        <div className="space-y-6">
                            {uploadedFiles.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Stored Records</h2>
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{uploadedFiles.length} file(s)</span>
                                    </div>
                                    {uploadedFiles.map(file => (
                                        <div key={file.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <span className="material-symbols-outlined">description</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{file.name}</h4>
                                                        <p className="text-xs text-slate-500">{file.size} • Encrypted & Stored</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => toggleFileView(file.id)} className="px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                                        {file.isViewOpen ? 'Hide' : 'View'}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleDeleteConfirm(file.id)}
                                                        className="px-3 py-2 text-xs font-bold text-red-500 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Fix 1: Inline delete confirmation in Vault */}
                                            {file.isDeleteConfirmOpen && (
                                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                        <span className="material-symbols-outlined text-lg">warning</span>
                                                        <span className="text-sm font-medium">Are you sure?</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => toggleDeleteConfirm(file.id)} className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">Cancel</button>
                                                        <button onClick={() => confirmDelete(file.id)} className="px-4 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">Confirm</button>
                                                    </div>
                                                </div>
                                            )}
                                            {file.isViewOpen && (
                                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg grid grid-cols-2 gap-4 text-sm">
                                                    <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Filename</span><p className="text-slate-900 dark:text-white font-medium mt-1">{file.name}</p></div>
                                                    <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Size</span><p className="text-slate-900 dark:text-white font-medium mt-1">{file.size}</p></div>
                                                    <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</span><p className="text-emerald-600 font-medium mt-1">Encrypted & Stored</p></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                                    <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-5xl">shield_lock</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Medical Vault</h2>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">No records in your vault yet. Upload your first document to get started.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4 justify-center pt-4">
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                                >
                                    Upload Record
                                </button>
                                <Link
                                    to="/patient/report-analysis"
                                    className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 no-underline"
                                >
                                    <span className="material-symbols-outlined text-lg">psychology</span>
                                    Analyse New Report
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default UploadRecord;
