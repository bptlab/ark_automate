const express = require('express');

const router = express.Router();

// Require controller modules
const parsingController = require('../controllers/ssotParsingController');
const retrievalController = require('../controllers/ssotRetrievalController');
const variableController = require('../controllers/ssotVariableController');
const rpaAttributesController = require('../controllers/ssotRpaAttributes');

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
router.post('/overwriteRobot/:robotId', retrievalController.overwriteRobot);

/// VARIABLE ROUTES ///
router.get('/getVariablesForNewTask', variableController.getVariablesForNewTask);
router.get('/getVariables', variableController.getVariables);
router.get('/getVariables', variableController.getVariablesForTaskApp);
router.get('/checkForExistingVariables', variableController.checkForExistingVariables);
router.post('/updateInputAndOutput', variableController.updateVariables);
router.post('/updateInputParameter', variableController.updateOnlyInputParams);
router.post('/updateOutputVariableName', variableController.updateOnlyOutputVarName);

/// RPA ATTRIBUTES ROUTES ///
router.get('/getAttributes', rpaAttributesController.getAttributes);
router.post('/updateAttributes', rpaAttributesController.updateAttributes);

module.exports = router;
