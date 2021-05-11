const express = require('express');
const retrievalController = require('../../controllers/ssotRetrievalController');

const router = express.Router();

router.get('/:userId/robots', retrievalController.getRobotList);
router.post('/robotAccess', retrievalController.shareRobotWithUser);
router.post('/:userId/robots', retrievalController.createNewRobot);

module.exports = router;
