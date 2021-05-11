const express = require('express');
const commandsController = require('../../controllers/rpaFrameworkCommandsController');

const router = express.Router();

router.get('/applications', commandsController.getAvailableApplications);
router.get(
  '/:application/tasks',
  commandsController.getAvailableTasksForApplications
);
router.get('/', commandsController.getAllRpaFunctionalities);

module.exports = router;
