import { useState, useCallback } from 'react';
import apiClient from '../api/client';
import { DOCTORS_DB } from '../data/doctors';

export interface DoctorRecommendation {
  userId: string;
  fullName: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  location: string;
  bio: string;
  isVerified: boolean;
  rating: number;
  matchRate?: string;
  imageUrl?: string;
}

/**
 * Custom hook for symptom-based doctor recommendations.
 */
export function useSymptomAnalysis() {
  const [symptom, setSymptom] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<DoctorRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecommendation | null>(null);

  /**
   * Handle symptom analysis and recommendation fetching.
   */
  const handleAnalyze = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!symptom.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/doctors/recommendations/symptom', {
        params: { symptom, location: 'New York' }
      });
      
      const data = response.data.map((doc: any, index: number) => ({
        ...doc,
        matchRate: `${98 - index * index}% Match`
      }));
      
      setRecommendations(data);
    } catch (err: any) {
      console.error('Recommendation fetch error:', err);
      setError(err?.response?.data?.error || 'Could not fetch recommendations at this time.');
    } finally {
      setIsLoading(false);
    }
  }, [symptom]);

  /**
   * Fallback default doctors when no search has been performed.
   */
  const defaultDoctors: DoctorRecommendation[] = DOCTORS_DB.slice(0, 1).map(doc => ({
    ...doc,
    matchRate: "98% Match"
  }));

  const displayDoctors = recommendations.length > 0 ? recommendations : defaultDoctors;

  return {
    symptom,
    setSymptom,
    isLoading,
    recommendations,
    displayDoctors,
    error,
    selectedDoctor,
    setSelectedDoctor,
    handleAnalyze
  };
}
