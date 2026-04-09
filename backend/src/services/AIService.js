const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const ANALYSIS_PROMPT = `You are a medical AI assistant. Carefully analyse this patient medical report.
Return ONLY a valid JSON object with no extra text, no markdown, no explanation:
{
  "patientName": "",
  "age": "",
  "symptoms": [],
  "diagnosedConditions": [],
  "severity": "mild | moderate | severe",
  "recommendedSpecialistType": "",
  "urgency": "routine | urgent | emergency",
  "summary": ""
}`;

class AIService {
  static async analyzeReport(base64PDF) {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured on the server.');
    }

    try {
      const response = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: ANALYSIS_PROMPT
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64PDF
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Clean markdown fences
      const clean = content.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);

    } catch (err) {
      console.error('AIService Error:', err);
      throw new Error('Failed to analyze report using AI.');
    }
  }
}

module.exports = AIService;
