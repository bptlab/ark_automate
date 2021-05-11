const express = require('express');
const rpaAttributesController = require('../../../controllers/ssotRpaAttributes');

const router = express.Router();

router.put('/', rpaAttributesController.updateMany);
router.delete('/:robotId', rpaAttributesController.deleteForActivities);
router.get('/:robotId', rpaAttributesController.retrieveAttributesForRobot);

module.exports = router;
