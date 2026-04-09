import { API_CONFIG } from '../config/api';
import { ANALYZER_CONFIG } from '../constants';
import { extractPdfText, validatePdfFile } from '../utils/pdf-extractor';

/**
 * Enhanced Report Analysis Interface — richer fields for better doctor matching.
 */
export interface ReportAnalysis {
  patientName: string;
  age: string;
  gender: string;
  bloodGroup: string;
  symptoms: string[];
  diagnosedConditions: string[];
  abnormalFindings: string[];
  criticalValues: string[];
  medications: string[];
  severity: 'mild' | 'moderate' | 'severe';
  recommendedSpecialistType: string;
  recommendedDepartment: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  keyFindings: string[];
  summary: string;
  followUpRequired: boolean;
}

/**
 * Send extracted text to Groq for structured analysis.
 * Uses an enhanced prompt for richer medical extraction.
 * @param file The PDF file to analyze
 * @returns Structured report analysis
 */
export async function analyzeMedicalReport(file: File): Promise<ReportAnalysis> {
  const apiKey = API_CONFIG.GROQ.API_KEY;
  const endpoint = API_CONFIG.GROQ.ENDPOINT;

  if (!apiKey) {
    throw new Error('Groq API key is missing from configuration.');
  }

  // Validate PDF
  const validationError = validatePdfFile(file, ANALYZER_CONFIG.MAX_FILE_SIZE_MB);
  if (validationError) {
    throw new Error(validationError);
  }

  // Step 1: Extract text from PDF
  const pdfText = await extractPdfText(file);

  if (!pdfText || pdfText.trim().length < 10) {
    throw new Error('Could not extract text from PDF. Please try a different file.');
  }

  // Step 2: Truncate to stay within Groq free tier limit
  const truncatedText = pdfText.slice(0, ANALYZER_CONFIG.MAX_TRUNCATE_LENGTH);

  // Step 3: Send truncated text to Groq with enhanced prompt
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: API_CONFIG.GROQ.MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a senior medical AI assistant trained to analyse patient reports.
          You extract precise medical findings and recommend the most appropriate specialist.
          Always return ONLY valid JSON. No markdown. No explanation. No extra text.`
        },
        {
          role: 'user',
          content: `Carefully analyse this medical report and return ONLY this exact JSON:
          {
            "patientName": "",
            "age": "",
            "gender": "",
            "bloodGroup": "",
            "symptoms": [],
            "diagnosedConditions": [],
            "abnormalFindings": [],
            "criticalValues": [],
            "medications": [],
            "severity": "mild | moderate | severe",
            "recommendedSpecialistType": "",
            "recommendedDepartment": "",
            "urgency": "routine | urgent | emergency",
            "keyFindings": [],
            "summary": "",
            "followUpRequired": true
          }

          Medical Report:
          ${truncatedText}`
        }
      ],
      max_tokens: ANALYZER_CONFIG.MAX_RESPONSE_TOKENS,
      temperature: ANALYZER_CONFIG.TEMPERATURE,
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Groq API call failed (Status ${response.status})`);
  }

  const resultData = await response.json();
  const rawContent = resultData.choices[0].message.content;
  
  try {
    const cleanJson = rawContent.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Build a safe result with defaults for all fields
    return {
      patientName: parsed.patientName || 'Unknown',
      age: parsed.age || 'N/A',
      gender: parsed.gender || 'N/A',
      bloodGroup: parsed.bloodGroup || 'N/A',
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      diagnosedConditions: Array.isArray(parsed.diagnosedConditions) ? parsed.diagnosedConditions : [],
      abnormalFindings: Array.isArray(parsed.abnormalFindings) ? parsed.abnormalFindings : [],
      criticalValues: Array.isArray(parsed.criticalValues) ? parsed.criticalValues : [],
      medications: Array.isArray(parsed.medications) ? parsed.medications : [],
      severity: (['mild', 'moderate', 'severe'].includes(parsed.severity?.toLowerCase?.())
        ? parsed.severity.toLowerCase()
        : 'moderate') as ReportAnalysis['severity'],
      recommendedSpecialistType: parsed.recommendedSpecialistType || '',
      recommendedDepartment: parsed.recommendedDepartment || '',
      urgency: (['routine', 'urgent', 'emergency'].includes(parsed.urgency?.toLowerCase?.())
        ? parsed.urgency.toLowerCase()
        : 'routine') as ReportAnalysis['urgency'],
      keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings : [],
      summary: parsed.summary || 'No summary available.',
      followUpRequired: typeof parsed.followUpRequired === 'boolean' ? parsed.followUpRequired : true,
    };
  } catch (error) {
    console.error('JSON Parse Error:', error);
    throw new Error('Unable to parse the AI response. Please try again.');
  }
}
