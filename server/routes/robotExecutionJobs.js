const express = require('express');

const router = express.Router();

// Require controller modules
const robotExecutionJobController = require('../controllers/robotExecutionJobController');

/// ROBOT JOBS ROUTES ///

router.get('/add', robotExecutionJobController.addNewRobotJob);
router.get('/execute', robotExecutionJobController.executeCurrentRobotJob);

module.exports = router;
