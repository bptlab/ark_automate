const express = require('express');
const parameterController = require('../../../controllers/ssotParameterController');

const router = express.Router();

router.put('/', parameterController.updateMany);
router.delete('/:robotId', parameterController.deleteForActivities);
router.get('/:robotId', parameterController.retrieveParametersForRobot);

module.exports = router;
