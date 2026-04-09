/**
 * App-wide constants
 */

export const ANALYZER_CONFIG = {
  MAX_FILE_SIZE_MB: 20,
  MAX_TRUNCATE_LENGTH: 1500,
  MAX_RESPONSE_TOKENS: 400,
  TEMPERATURE: 0.1,
};

export const SEVERITY_LEVELS = ['mild', 'moderate', 'severe'] as const;
export const URGENCY_LEVELS = ['routine', 'urgent', 'emergency'] as const;

export const DEFAULT_HOSPITAL = 'AIIMS New Delhi';
