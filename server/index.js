const activityDataRetrieval = require('./ActivityDataRetrieval');
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.use(express.json());

  app.get('/get-available-applications', async (req, res) => {
    console.log(process.env.MONGODB_URI);
    /*
    try {
      let listOfDistinctApplications = await activityDataRetrieval.getDistinctApplicationsFromDB();
      res.set('Content-Type', 'application/json');
      res.send(listOfDistinctApplications);
    } catch (err) {
      console.log(err);
    }*/
  });

  // GET /get-available-tasks-for-application?application=Browser
  app.get('/get-available-tasks-for-application', async (req, res) => {
    try {
      let application = req.query.application; //TODO filter empty application
      let listOfDistinctApplications = await activityDataRetrieval.getTasksForApplicationFromDB(
        application
      );
      res.set('Content-Type', 'application/json');
      res.send(listOfDistinctApplications);
    } catch (err) {
      console.log(err);
    }
  });

  // GET /get-id-for-task?application=Browser&task=Open+Browser
  app.get('/get-id-for-task', async (req, res) => {
    try {
      let application = req.query.application;
      console.log(application);
      let task = req.query.task;
      console.log(task); //TODO filter when both empty
      let listOfDistinctApplications = await activityDataRetrieval.getIdForSelectedTask(
        application,
        task
      );
      res.set('Content-Type', 'application/json');
      res.send(listOfDistinctApplications);
    } catch (err) {
      console.log(err);
    }
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? 'dev server' : 'cluster worker ' + process.pid
      }: listening on port ${PORT}`
    );
  });
}
