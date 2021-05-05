const express = require('express');
const variableController = require('../../../controllers/ssotVariableController');

const router = express.Router();

router.put('/', variableController.updateMany);
router.get('/:robotId', variableController.retrieveParametersForRobot);

module.exports = router;
