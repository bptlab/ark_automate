const express = require('express');

const router = express.Router();

// Require controller modules
const retrievalController = require('../controllers/ssotRetrievalController');

/// SSOTPARSING ROUTES ///

router.get('/get/:id', retrievalController.getSingleSourceOfTruth);
router.get('/getAvailableBotsForUser/:userid', retrievalController.getBotList);

module.exports = router;
