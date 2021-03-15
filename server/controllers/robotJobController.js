const mongoose = require('mongoose');
const ssotToRobotParser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');
const ssotModels = require('../models/singleSourceOfTruthModel.js');

const robotJobs = [];

// GET /robot/jobs/add?robotId=123245
exports.addNewRobotJob = async (req, res) => {
  try {
    const { robotId } = req.query;
    robotJobs.push(robotId);
    res.send(robotJobs);
  } catch (err) {
    console.error(err);
  }
};

// GET /robot/jobs/execute
exports.executeCurrentRobotJob = async (req, res) => {
  try {
    if (robotJobs.length !== 0) {
      mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const robotId = robotJobs.pop();
      const ssot = await mongoose.model('SSoT').findById(robotId).exec();
      const robotCode = ssotToRobotParser.parseSsotToRobotCode(ssot);
      res.send(robotCode);
    } else {
      res.send('No new job');
    }
  } catch (err) {
    console.error(err);
  }
};
