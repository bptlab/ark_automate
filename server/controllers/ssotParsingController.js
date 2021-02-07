const ssot = require('../ssot.json');
const parser = require('../services/parser/parser.js');

exports.getRobotCode = async (req, res) => {
  try {
    let robotCode = parser.parseSsotToRobotCode(ssot);
    res.send(robotCode);
  } catch (err) {
    console.log(err);
  }
};
