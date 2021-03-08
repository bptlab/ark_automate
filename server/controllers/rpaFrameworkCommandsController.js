const mongoose = require('mongoose');
const rpaModels = require('../models/rpaTaskModel');

// GET /rpa-framework/commands/get-available-applications
exports.getAvailableApplications = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json'); 
    mongoose.model('rpa-task').distinct('Application', (err, tasks) => {
      res.send(tasks);
    });
  } catch (err) {
    console.log(err);
  }
};

// GET /rpa-framework/commands/get-available-tasks-for-application?application=Browser
exports.getAvailableTasksForApplications = async (req, res) => {
  try {
    const {application} = req.query;
    res.set('Content-Type', 'application/json');
    if (application != null) {
      mongoose.model('rpa-task').distinct('Task', { Application: application }, (err, tasks) => {
        res.send(tasks);
      });
    } else {
      res.send('Please set a valid application parameter.');
    }
  } catch (err) {
    console.log(err);
  }
};

// GET /rpa-framework/commands/get-vars-for-task?application=Browser&task=Open+Browser
exports.getVarsForTask = async (req, res) => {
  try {
    const {application} = req.query;
    const {task} = req.query;
    res.set('Content-Type', 'application/json');

    if (application != null && task != null) {
      mongoose.model('rpa-task').findOne(
      {
        Application: application,
        Task: task,
      }, 
      {
        InputVars: 1,
        Output: 1
      }, 
      (err, tasks) => {
        res.send(tasks);
      });
    } else {
      res.send('Please set valid application and task parameters.');
    }
  } catch (err) {
    console.log(err);
  }
};
