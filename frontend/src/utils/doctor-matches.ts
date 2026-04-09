import { AIIMS_DOCTORS, type AIIMSDoctor } from '../data/doctors';
import { type ReportAnalysis } from '../services/report-analysis.service';

/**
 * Multi-field doctor matching using all analysis outputs.
 * Scores doctors against specialist type, department, conditions, symptoms, and findings.
 * Returns top 3 best-matching doctors across all AIIMS campuses.
 * Falls back to the first 3 doctors if no match is found.
 */
export function matchDoctors(analysisResult: ReportAnalysis): { doctors: AIIMSDoctor[]; isDefault: boolean } {
  const {
    recommendedSpecialistType = '',
    recommendedDepartment = '',
    diagnosedConditions = [],
    symptoms = [],
    abnormalFindings = [],
  } = analysisResult;

  // Build a combined keyword pool from all analysis fields
  const keywordPool = [
    recommendedSpecialistType,
    recommendedDepartment,
    ...diagnosedConditions,
    ...symptoms,
    ...abnormalFindings,
  ].join(' ').toLowerCase();

  if (!keywordPool.trim()) {
    return { doctors: AIIMS_DOCTORS.slice(0, 3), isDefault: true };
  }

  // Split pool into individual words for fine-grained matching
  const poolWords = keywordPool.split(/[\s,/&]+/).filter(w => w.length > 2);

  // Score each doctor
  const scored = AIIMS_DOCTORS.map((doc) => {
    let score = 0;

    for (const tag of doc.specialization) {
      const tagLower = tag.toLowerCase();

      // Direct inclusion in keyword pool (e.g. pool contains "cardiology")
      if (keywordPool.includes(tagLower)) {
        score += 100;
      }
      // Tag contains a pool word (e.g. tag "heart failure" contains word "heart")
      else {
        for (const word of poolWords) {
          if (tagLower.includes(word) || word.includes(tagLower)) {
            score += 40;
            break; // only count once per tag
          }
        }
      }
    }

    // Department matching
    const deptLower = doc.department.toLowerCase();
    for (const word of poolWords) {
      if (deptLower.includes(word) || word.includes(deptLower)) {
        score += 30;
        break;
      }
    }

    return { doctor: doc, score };
  });

  // Filter doctors with score > 0 and sort by score descending
  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.doctor);

  if (matched.length > 0) {
    return { doctors: matched, isDefault: false };
  }

  // No match — return top 3 as fallback
  return { doctors: AIIMS_DOCTORS.slice(0, 3), isDefault: true };
}

/**
 * Simple keyword-only matching (backward compatible).
 * Used by legacy code that only passes a specialist type string.
 */
export function matchDoctorsByKeyword(recommendedSpecialistType: string): { doctors: AIIMSDoctor[]; isDefault: boolean } {
  if (!recommendedSpecialistType || !recommendedSpecialistType.trim()) {
    return { doctors: AIIMS_DOCTORS.slice(0, 3), isDefault: true };
  }

  const keyword = recommendedSpecialistType.toLowerCase().trim();

  const scored = AIIMS_DOCTORS.map((doc) => {
    const score = doc.specialization.filter(tag =>
      keyword.includes(tag.toLowerCase()) || tag.toLowerCase().includes(keyword)
    ).length;
    return { doctor: doc, score };
  });

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.doctor);

  if (matched.length > 0) {
    return { doctors: matched, isDefault: false };
  }

  return { doctors: AIIMS_DOCTORS.slice(0, 3), isDefault: true };
}
