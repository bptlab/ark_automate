const express = require('express');

const router = express.Router();

// Require controller modules
const retrievalController = require('../controllers/ssotRetrievalController');

/// SSOTPARSING ROUTES ///

router.get('/ssot', retrievalController.getSsot);

module.exports = router;
