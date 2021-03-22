const express = require('express');

const router = express.Router();

// Require controller modules
const parsingController = require('../controllers/ssotParsingController');
const retrievalController = require('../controllers/ssotRetrievalController');
const variableController = require('../controllers/ssotVariableController');

/// PARSING ROUTES ///
router.get('/parser/get-robot-code', parsingController.getRobotCode);
router.get('/parser/getForId/:botId', parsingController.getRobotCodeForId);

/// SSOT ROUTES ///
router.get('/get/:id', retrievalController.getSingleSourceOfTruth);
router.get('/getAvailableRobotsForUser/:userid', retrievalController.getRobotList);
router.get('/renameRobot', retrievalController.renameRobot);
router.get('/retrieveMetadataForRobot/:botId', retrievalController.retrieveRobotMetadata);
router.get('/shareRobotWithUser', retrievalController.shareRobotWithUser);
router.get('/createNewRobot', retrievalController.createNewRobot);

/// VARIABLE ROUTES ///
router.get('/getVariablesForNewTask', variableController.getVariablesForNewTask);
router.get('/checkForExistingVariables', variableController.checkForExistingVariables);
router.post('/updateVariables', variableController.updateVariables);

module.exports = router;
