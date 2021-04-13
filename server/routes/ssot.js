const express = require('express');

const router = express.Router();

// Require controller modules
const parsingController = require('../controllers/ssotParsingController');
const retrievalController = require('../controllers/ssotRetrievalController');
const variableController = require('../controllers/ssotVariableController');
const rpaAttributesController = require('../controllers/ssotRpaAttributes');

/// PARSING ROUTES ///
router.get('/parser/get-robot-code', parsingController.getRobotCode); // not used anymore
router.get('/parser/getForId/:botId', parsingController.getRobotCodeForId); 

/// SSOT ROUTES ///
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
router.get('/shareRobotWithUser', retrievalController.shareRobotWithUser); // not used
router.get('/createNewRobot', retrievalController.createNewRobot);
router.post('/overwriteRobot/:robotId', retrievalController.overwriteRobot);

/// VARIABLE ROUTES ///
router.get('/getVariablesForNewTask', variableController.getVariablesForNewTask); // not used
router.get('/getVariables', variableController.getVariables); // not used
router.get('/getVariables', variableController.getVariablesForTaskApp); // not used
router.get('/checkForExistingVariables', variableController.checkForExistingVariables); // not used
router.post('/updateInputAndOutput', variableController.updateVariables); // not used
router.post('/updateInputParameter', variableController.updateOnlyInputParams); // not used
router.post('/updateOutputVariableName', variableController.updateOnlyOutputVarName); // not used
router.post('/updateManyParameters', variableController.updateMany);
router.get('/getAllParameters/:robotId', variableController.retrieveParametersForRobot);
router.get('/', variableController.retrieveParametersForRobot);

/// RPA ATTRIBUTES ROUTES ///
router.get('/getAttributes', rpaAttributesController.getAttributes); // not used
router.post('/updateAttributes', rpaAttributesController.updateAttributes); // not used
router.post('/updateManyAttributes', rpaAttributesController.updateMany);
router.get('/getAllAttributes/:robotId', rpaAttributesController.retrieveAttributesForRobot);

module.exports = router;
