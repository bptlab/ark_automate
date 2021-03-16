const mongoose = require('mongoose');
const ssotToRobotParser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');
const ssotModels = require('../models/singleSourceOfTruthModel.js');

exports.getRobotCode = async (robotId) => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const ssot = await mongoose.model('SSoT').findById(robotId).exec();
    const robotCode = ssotToRobotParser.parseSsotToRobotCode(ssot);
    return robotCode;
  } catch (err) {
    return console.error(err);
  }
};
