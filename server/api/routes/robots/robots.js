const express = require('express');
const rpaattributesRouter = require('./rpaAttributes/rpaAttributes');
const parametersRouter = require('./rpaParameters/rpaParameters');
const parsingController = require('../../controllers/ssotParsingController');
const retrievalController = require('../../controllers/ssotRetrievalController');

const router = express.Router();

router.use('/parameters', parametersRouter);
router.use('/rpaattributes', rpaattributesRouter);

router.get('/:robotId', retrievalController.getSingleSourceOfTruth);
router.put('/:robotId', retrievalController.overwriteRobot);
router.delete('/:robotId', retrievalController.deleteRobot);
router.patch('/:robotId/robotName', retrievalController.renameRobot);
router.get('/:robotId/robotCode', parsingController.getRobotCodeForId);

module.exports = router;
