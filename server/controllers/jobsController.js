/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const JobsModel = require('../models/jobModel.js');
const ssotToRobotParser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');

// GET /jobs/user/:id
// testuserid 604a2073f1ec35a222478e17
exports.getJobsForUser = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { id } = req.params;
    const usableId = mongoose.Types.ObjectId(id);
    const jobs = await mongoose
      .model('jobs')
      .find({ user_id: usableId })
      .exec();
    console.log(usableId);
    console.log(typeof usableId);

    res.send(jobs);
  } catch (err) {
    console.error(err);
  }
};

// DELETE /jobs/:id
// test job id 604a2073f1ec35a442478e17
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

// GET /jobs/new?userId=111111&ssotId=123123
// TODO herausfinden wie ich das mit den Parameter Array hier machen kann https://stackoverflow.com/questions/1763508/passing-arrays-as-url-parameter/1764199#1764199
exports.createJob = async (req, res) => {
  res.set('Content-Type', 'application/json');
  const job = new JobsModel.Job({
    user_id: req.query.userId,
    robot_id: req.query.robotId,
    status: 'waiting',
    parameters: [
      {
        name: 'path',
        value: '1',
      },
    ],
  });
  job.save((err) => {
    if (err) return console.error(err);
    return res.send(job);
  });
};

// GET /jobs/run/:id
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
