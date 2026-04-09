const AIService = require('../services/AIService');

class ReportController {
  static async analyze(req, res) {
    const { base64PDF } = req.body;

    if (!base64PDF) {
      return res.status(400).json({ error: 'Base64 PDF data is required.' });
    }

    try {
      const result = await AIService.analyzeReport(base64PDF);
      res.status(200).json(result);
    } catch (err) {
      console.error('ReportController Error:', err);
      if (err.message.includes('429')) {
        return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
      } else if (err.message.includes('401')) {
        return res.status(401).json({ error: 'Invalid API key. Please check server configuration.' });
      }
      res.status(500).json({ error: 'Unable to analyse report. Please try a clearer PDF.' });
    }
  }
}

module.exports = ReportController;
