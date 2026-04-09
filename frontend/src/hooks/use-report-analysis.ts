import { useState, useRef, useCallback } from 'react';
import { analyzeMedicalReport, type ReportAnalysis as AnalysisResult } from '../services/report-analysis.service';
import { matchDoctors } from '../utils/doctor-matches';
import { type AIIMSDoctor } from '../data/doctors';

/**
 * Custom hook for medical report analysis logic.
 * Manages file state, loading, error, and analysis results.
 * Uses multi-field matching for better doctor recommendations.
 * Persists latest results to sessionStorage for dashboard access.
 */
export function useReportAnalysis() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [suggestedDocs, setSuggestedDocs] = useState<AIIMSDoctor[]>([]);
  const [isDefaultDocs, setIsDefaultDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  /**
   * Reset all analysis states.
   */
  const handleReset = useCallback(() => {
    setFile(null);
    setAnalysis(null);
    setSuggestedDocs([]);
    setIsDefaultDocs(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  /**
   * Process and validate a selected file.
   */
  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF medical report');
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum size is 20 MB.');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setAnalysis(null);
    setSuggestedDocs([]);
    setIsDefaultDocs(false);
  }, []);

  /**
   * Call the AI service to analyze the current file.
   * Now passes full analysis result to multi-field doctor matcher.
   */
  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setSuggestedDocs([]);
    setIsDefaultDocs(false);

    try {
      const result = await analyzeMedicalReport(file);
      setAnalysis(result);

      // Match doctors using full analysis result (multi-field scoring)
      const { doctors, isDefault } = matchDoctors(result);
      setSuggestedDocs(doctors);
      setIsDefaultDocs(isDefault);

      // Persist to sessionStorage so Dashboard can show latest results
      try {
        sessionStorage.setItem('latestAnalysis', JSON.stringify(result));
        sessionStorage.setItem('latestDoctors', JSON.stringify(doctors));
      } catch { /* ignore storage errors */ }
    } catch (err: any) {
      console.error('Report analysis error:', err);
      setError(
        err?.response?.data?.error?.message || 
        err?.message || 
        'An unexpected error occurred during analysis'
      );
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  return {
    file,
    isLoading,
    analysis,
    suggestedDocs,
    isDefaultDocs,
    error,
    dragActive,
    fileInputRef,
    handleFileSelect,
    handleAnalyze,
    handleReset,
    setDragActive,
    setError
  };
}
