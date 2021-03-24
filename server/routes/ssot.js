const express = require('express');

const router = express.Router();

// Require controller modules
const parsingController = require('../controllers/ssotParsingController');
const retrievalController = require('../controllers/ssotRetrievalController');

/// SSOTPARSING ROUTES ///
router.get('/parser/get-robot-code', parsingController.getRobotCode);
router.get('/get/:id', retrievalController.getSingleSourceOfTruth);
router.get(
  '/getAvailableRobotsForUser/:userId',
  retrievalController.getRobotList
);
router.get('/renameRobot', retrievalController.renameRobot);
router.get(
  '/retrieveMetadataForRobot/:botId',
  retrievalController.retrieveRobotMetadata
);
router.get('/shareRobotWithUser', retrievalController.shareRobotWithUser);
router.get('/createNewRobot', retrievalController.createNewRobot);

module.exports = router;
