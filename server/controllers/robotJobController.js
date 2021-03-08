const mongoose = require('mongoose');
const parserSSotToRobot = require('../utils/');

let robotJobs = [];

// GET /robot/jobs/add?robotId=123245
exports.addNewRobotJob = async (req, res) => {
  try {
    const { robotId } = req.params;
    robotJobs.push(robotId);
  } catch (err) {
    console.error(err);
  }
};

// GET /robot/jobs/execute
exports.addNewRobotJob = async (req, res) => {
  try {
    if (robotJobs.length !== 0) {
      res.set('Content-Type', 'application/json');
      mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      let robotId = robotJobs.pop();
      const ssot = await mongoose.model('SSoT').findById(robotId).exec();
    }
  } catch (err) {
    console.error(err);
  }
};
