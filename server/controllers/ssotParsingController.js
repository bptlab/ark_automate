const ssotToRobotparser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');

exports.getRobotCodeForId = async (req, res) => {
  try {
    const { robotId } = req.params;
    const robotCode = await ssotToRobotparser.parseSsotById(robotId);
    res.send(robotCode);
  } catch (err) {
    console.error(err);
  }
};
