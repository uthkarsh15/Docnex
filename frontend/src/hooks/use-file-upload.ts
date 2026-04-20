import { useState, useCallback } from 'react';
import apiClient from '../api/client';

export interface UploadedFile {
    id: string;
    name: string;
    size: string;
    success: boolean;
    isAnalyzing?: boolean;
    analysisResult?: string;
    isViewOpen?: boolean;
    /** When true the inline delete-confirm UI is shown */
    isDeleteConfirmOpen?: boolean;
}

export interface UploadingFile {
    id: string;
    name: string;
    size: string;
    progress: number;
}

/**
 * Custom hook for handling multi-file uploads and simulation.
 * Fix 1: Added deleteFile with inline confirmation support.
 */
export function useFileUpload() {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
        { id: '1', name: 'Chest_XRay_Digital.dicom', success: true, size: '45.0 MB' },
    ]);

    const formatFileSize = (bytes: number): string => {
        if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
        return `${(bytes / 1e3).toFixed(1)} KB`;
    };

    /**
     * Start a simulated upload process.
     */
    const startUpload = useCallback((file: File) => {
        const fileId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newFile: UploadingFile = {
            id: fileId,
            name: file.name,
            size: formatFileSize(file.size),
            progress: 0,
        };
        
        setUploadingFiles(prev => [...prev, newFile]);

        let currentProgress = 0;
        const uploadInterval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5;
            
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(uploadInterval);
                setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
                setUploadedFiles(prev => [...prev, {
                    id: fileId,
                    name: file.name,
                    size: formatFileSize(file.size),
                    success: true,
                }]);
            } else {
                setUploadingFiles(prev => 
                    prev.map(f => f.id === fileId ? { ...f, progress: Math.min(currentProgress, 99) } : f)
                );
            }
        }, 300);
    }, []);

    const cancelUpload = useCallback((fileId: string) => {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
    }, []);

    const analyzeFile = useCallback((fileId: string) => {
        setUploadedFiles(prev => 
            prev.map(f => f.id === fileId ? { ...f, isAnalyzing: true, analysisResult: undefined } : f)
        );
        
        setTimeout(() => {
            setUploadedFiles(prev => 
                prev.map(f => f.id === fileId ? {
                    ...f,
                    isAnalyzing: false,
                    analysisResult: 'No anomalies detected. Full diagnostic report has been saved to your Vault.',
                } : f)
            );
        }, 2000);
    }, []);

    const toggleFileView = useCallback((fileId: string) => {
        setUploadedFiles(prev => 
            prev.map(f => f.id === fileId ? { ...f, isViewOpen: !f.isViewOpen } : f)
        );
    }, []);

    /**
     * Fix 1: Show/hide inline delete confirmation for a file.
     */
    const toggleDeleteConfirm = useCallback((fileId: string) => {
        setUploadedFiles(prev =>
            prev.map(f => f.id === fileId ? { ...f, isDeleteConfirmOpen: !f.isDeleteConfirmOpen } : f)
        );
    }, []);

    /**
     * Fix 1: Confirm deletion — call backend then remove from local state (optimistic).
     */
    const confirmDelete = useCallback(async (fileId: string) => {
        // Optimistic: remove from state immediately
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));

        // Attempt backend deletion (best effort — records may be client-only)
        try {
            await apiClient.delete(`/records/${fileId}`);
        } catch {
            // Silently ignore — record may not exist on backend yet
        }
    }, []);

    return {
        uploadingFiles,
        uploadedFiles,
        startUpload,
        cancelUpload,
        analyzeFile,
        toggleFileView,
        toggleDeleteConfirm,
        confirmDelete
    };
}
