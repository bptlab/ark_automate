const activityDataRetrieval = require('../services/ActivityDataRetrieval/ActivityDataRetrieval');

exports.getAvailableApplications = async (req, res) => {
  try {
    const listOfDistinctApplications = await activityDataRetrieval.getDistinctApplicationsFromDB();
    res.set('Content-Type', 'application/json');
    res.send(listOfDistinctApplications);
  } catch (err) {
    console.log(err);
  }
};

// GET /get-available-tasks-for-application?application=Browser
exports.getAvailableTasksForApplications = async (req, res) => {
  try {
    const {application} = req.query;
    res.set('Content-Type', 'application/json');
    if (application != null) {
      const listOfDistinctApplications = await activityDataRetrieval.getTasksForApplicationFromDB(
        application
      );
      res.send(listOfDistinctApplications);
    } else {
      res.send('Please set a valid application parameter.');
    }
  } catch (err) {
    console.log(err);
  }
};

// GET /get-vars-for-task?application=Browser&task=Open+Browser
exports.getVarsForTask = async (req, res) => {
  try {
    const {application} = req.query;
    const {task} = req.query;
    res.set('Content-Type', 'application/json');

    if (application != null && task != null) {
      const listOfDistinctApplications = await activityDataRetrieval.getInputOutputForSelectedTask(
        application,
        task
      );
      res.send(listOfDistinctApplications);
    } else {
      res.send('Please set valid application and task parameters.');
    }
  } catch (err) {
    console.log(err);
  }
};
