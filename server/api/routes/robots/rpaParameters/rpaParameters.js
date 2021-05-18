const express = require('express');
const variableController = require('../../../controllers/ssotVariableController');

const router = express.Router();

router.put('/', variableController.updateMany);
router.delete('/:robotId', variableController.deleteForActivities);
router.get('/:robotId', variableController.retrieveParametersForRobot);

module.exports = router;
