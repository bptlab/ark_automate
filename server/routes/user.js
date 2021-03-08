const express = require('express');

const router = express.Router();

// Require controller modules
const configurationController = require('../controllers/userConfigurationController');

/// USER CONFIG ROUTES ///

router.get('/config/get-current-id', configurationController.getCurrentId);

router.get('/config/set-current-id', configurationController.setCurrentId);

module.exports = router;
