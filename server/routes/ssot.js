const express = require('express');

const router = express.Router();

// Require controller modules
const parsingController = require('../controllers/ssotParsingController');
const retrievalController = require('../controllers/ssotRetrievalController');

/// SSOTPARSING ROUTES ///

router.get('/parser/get-robot-code', parsingController.getRobotCode);
router.get('/get/:id', retrievalController.getSingleSourceOfTruth);

module.exports = router;