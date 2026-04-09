/**
 * API Configuration
 * All API endpoints and keys are managed here.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  GROQ: {
    API_KEY: import.meta.env.VITE_GROQ_API_KEY,
    ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
    MODEL: 'llama-3.3-70b-versatile',
  },
};
