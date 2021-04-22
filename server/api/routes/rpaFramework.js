const express = require('express');

const router = express.Router();

// Require controller modules
const commandsController = require('../controllers/rpaFrameworkCommandsController');

/// RPAFRAMEWORKCOMMANDS ROUTES ///

router.get(
  '/commands/get-available-applications',
  commandsController.getAvailableApplications
);

router.get(
  '/commands/get-available-tasks-for-application',
  commandsController.getAvailableTasksForApplications
);

router.get('/commands/getAllParameters', commandsController.getAllParameters);

module.exports = router;
