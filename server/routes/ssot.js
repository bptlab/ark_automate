const express = require('express');

const router = express.Router();

// Require controller modules
const retrievalController = require('../controllers/ssotRetrievalController');
const parsingController = require('../controllers/ssotParsingController');

/// SSOTPARSING ROUTES ///
router.get('/parser/get-robot-code', parsingController.getRobotCode);
router.get('/get/:id', retrievalController.getSingleSourceOfTruth);
router.get('/getAvailableRobotsForUser/:userid', retrievalController.getRobotList);
router.get('/renameRobot', retrievalController.renameRobot);
router.get('/retrieveMetadataForRobot/:botId', retrievalController.retrieveRobotMetadata);
router.get('/shareRobotWithUser', retrievalController.shareRobotWithUser);
router.get('/createNewRobot', retrievalController.createNewRobot);

module.exports = router;
