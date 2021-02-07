const express = require('express');

const router = express.Router();

// Require controller modules
const parsingController = require('../controllers/ssotParsingController');

/// SSOTPARSING ROUTES ///

router.get('/parser/get-robot-code', parsingController.getRobotCode);

module.exports = router;
