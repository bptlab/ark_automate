const express = require('express');

const router = express.Router();

// Require controller modules
const parsingController = require('../controllers/ssotParsingController');
const retrievalController = require('../controllers/ssotRetrievalController');
const variableController = require('../controllers/ssotVariableController');
const rpaAttributesController = require('../controllers/ssotRpaAttributes');

/// PARSING ROUTES ///
router.get('/parser/getForId/:robotId', parsingController.getRobotCodeForId);

/// SSOT ROUTES ///
router.get('/get/:id', retrievalController.getSingleSourceOfTruth);
router.get(
  '/getAvailableRobotsForUser/:userId',
  retrievalController.getRobotList
);
router.get('/renameRobot', retrievalController.renameRobot);
router.get('/shareRobotWithUser', retrievalController.shareRobotWithUser);
router.get('/createNewRobot', retrievalController.createNewRobot);
router.post('/overwriteRobot/:robotId', retrievalController.overwriteRobot);
router.delete('/delete/:robotId', retrievalController.deleteRobot);

/// VARIABLE ROUTES ///
router.post('/updateManyParameters', variableController.updateMany);
router.get(
  '/getAllParameters/:robotId',
  variableController.retrieveParametersForRobot
);
router.delete('/deleteParameters', variableController.deleteMany);

/// RPA ATTRIBUTES ROUTES ///
router.post('/updateManyAttributes', rpaAttributesController.updateMany);
router.get(
  '/getAllAttributes/:robotId',
  rpaAttributesController.retrieveAttributesForRobot
);
router.delete('/deleteAttributes', rpaAttributesController.deleteMany);

module.exports = router;
