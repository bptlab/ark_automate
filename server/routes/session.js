const express = require('express');

const router = express.Router();

// Require controller modules
const sessionsController = require('../controllers/sessionsController');

/// RPAFRAMEWORKCOMMANDS ROUTES ///

router.get('/byClient/:id', sessionsController.getUserFromClientId);
router.get('/new', sessionsController.createSession);
router.get('/:id', sessionsController.getSession);
router.delete('/:id', sessionsController.deleteSession);

module.exports = router;
