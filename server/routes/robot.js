const express = require('express');

const router = express.Router();

// Require controller modules
const robotJobController = require('../controllers/robotJobController');

/// ROBOT JOBS ROUTES ///

router.get('/jobs/add', robotJobController.addNewRobotJob);
router.get('/jobs/execute', robotJobController.executeCurrentRobotJob);

module.exports = router;
