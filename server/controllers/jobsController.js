/* eslint-disable no-unused-vars */
require('express');
const mongoose = require('mongoose');
const JobsModel = require('../models/jobModel.js');
const ssotToRobotParser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');

// GET /jobs/user/604a2073f1ec35a222478e17
exports.getJobsForUser = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { id } = req.params;
    const usableId = mongoose.Types.ObjectId(id);
    const jobs = await mongoose
      .model('jobs')
      .find({ user_id: usableId })
      .exec();
    res.send(jobs);
  } catch (err) {
    console.error(err);
  }
};

// DELETE /jobs/604a2073f1ec35a442478e17
exports.deleteJobById = async (req, res) => {
  try {
    const { id } = req.params;
    await mongoose.model('jobs').deleteOne({ _id: id }).exec();
    const response = `Deleted Job with id: ${id}`;
    res.send(response);
  } catch (err) {
    console.error(err);
  }
};

// GET /jobs/new?userId=111111&robotId=123123&path=1&name=2
// Parameter array musst wie folgt gepassed werden https://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-url-query-parameters/23639793#23639793
exports.createJob = async (req, res) => {
  res.set('Content-Type', 'application/json');

  const queryKeys = Object.keys(req.query);
  const queryParameters = [];
  queryKeys.forEach((key) => {
    if (!(key === 'userId' || key === 'robotId')) {
      queryParameters.push({ name: key, value: req.query[key] });
    }
  });

  const job = new JobsModel.Job({
    user_id: req.query.userId,
    robot_id: req.query.robotId,
    status: 'waiting',
    parameters: queryParameters,
  });

  job.save((err) => {
    if (err) return console.error(err);
    return res.send(job);
  });
};

// GET /jobs/run/604a2073f1ec35a442478e17
exports.executeJob = async (req, res) => {
  try {
    const { id } = req.params;

    const ssot = await mongoose.model('SSoT').findById(id).lean().exec();
    if (ssot === null) {
      res.send('No Bot found for id');
    } else {
      const robotCode = ssotToRobotParser.parseSsotToRobotCode(ssot);
      res.send(robotCode);
    }
  } catch (err) {
    console.error(err);
  }
};
