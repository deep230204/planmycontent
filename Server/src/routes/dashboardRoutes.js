const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// In a real app, you'd add auth middleware here
router.post('/data', dashboardController.getDashboardData);
router.post('/save-idea', dashboardController.saveIdea);
router.post('/save-content', dashboardController.saveContent);
router.post('/save-plan', dashboardController.savePlan);
router.delete('/idea/:id', dashboardController.deleteIdea);
router.delete('/content/:id', dashboardController.deleteContent);
router.delete('/plan/:id', dashboardController.deletePlan);

module.exports = router;

