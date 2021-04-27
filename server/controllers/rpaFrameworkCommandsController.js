const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const rpaModels = require('../models/rpaTaskModel');

// GET /rpa-framework/commands/get-available-applications
exports.getAvailableApplications = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    await mongoose.model('rpa-task').distinct('Application', (err, tasks) => {
      res.send(tasks);
    });
  } catch (err) {
    console.error(err);
  }
};

// GET /rpa-framework/commands/get-available-tasks-for-application?application=Browser
exports.getAvailableTasksForApplications = async (req, res) => {
  try {
    const { application } = req.query;
    res.set('Content-Type', 'application/json');
    if (application != null) {
      await mongoose
        .model('rpa-task')
        .distinct('Task', { Application: application }, (err, tasks) => {
          res.send(tasks);
        });
    } else {
      res.send('Please set a valid application parameter.');
    }
  } catch (err) {
    console.error(err);
  }
};

// GET /rpa-framework/commands/getAllParameters
exports.getAllParameters = async (req, res) => {
  const parameterObjects = await mongoose.model('rpa-task').find().exec();

  res.send(parameterObjects);
};
