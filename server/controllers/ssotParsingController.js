const ssot = require('../services/SsotToRobotParsing/__tests__/SsotForTesting.json');
const ssotToRobotparser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');

exports.getRobotCode = async (req, res) => {
  try {
    const robotCode = ssotToRobotparser.parseSsotToRobotCode(ssot);
    res.send(robotCode);
  } catch (err) {
    console.error(err);
  }
};

exports.getRobotCodeForId = async (req, res) => {
  try {
    const { robotId } = req.params;
    const robotCode = await ssotToRobotparser.parseSsotById(robotId);
    res.send(robotCode);
  } catch (err) {
    console.error(err);
  }
};
