const {
  SSOT_JSON_STRING,
} = require('../services/SsotToRobotParsing/__tests__/SsotForTesting.js');
const ssotToRobotparser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');
const ssot = SSOT_JSON_STRING;
exports.getRobotCode = async (req, res) => {
  try {
    let robotCode = ssotToRobotparser.parseSsotToRobotCode(ssot);
    res.send(robotCode);
  } catch (err) {
    console.log(err);
  }
};
