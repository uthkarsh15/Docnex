const RecommendationService = require('../services/RecommendationService');

class RecommendationController {
    async recommend(req, res) {
        try {
            const { specialization, location } = req.query;
            const recommendations = await RecommendationService.recommendDoctors(specialization, location);
            res.json(recommendations);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async recommendBySymptom(req, res) {
        try {
            const { symptom, location } = req.query;
            const recommendations = await RecommendationService.recommendBySymptom(symptom, location);
            res.json(recommendations);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new RecommendationController();
