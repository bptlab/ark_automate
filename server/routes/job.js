const express = require('express');

const router = express.Router();

// Require controller modules
const jobsController = require('../controllers/jobsController');

/// RPAFRAMEWORKCOMMANDS ROUTES ///

router.get('/new', jobsController.createJob);
router.get('/user/:id', jobsController.getJobsForUser);
router.get('/run/:id', jobsController.executeJob);
router.delete('/:id', jobsController.deleteJobById);

module.exports = router;
