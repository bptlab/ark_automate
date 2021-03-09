const express = require('express');

const router = express.Router();

// Require controller modules
const retrievalController = require('../controllers/ssotRetrievalController');
const parsingController = require('../controllers/ssotParsingController');

/// SSOTPARSING ROUTES ///

router.get('/get/:id', retrievalController.getSingleSourceOfTruth);
router.get('/parser/get-robot-code', parsingController.getRobotCode);

module.exports = router;
