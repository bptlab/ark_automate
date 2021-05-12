const ssotToRobotparser = require('../../services/SsotToRobotParsing/SsotToRobotParser.js');

/**
 * @swagger
 * /robots/{robotId}/robotCode:
 *     parameters:
 *       - name: robotId
 *         in: path
 *         description: The id of a robot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/RobotIds'
 *     get:
 *       tags:
 *         - Robots
 *       summary: Get the robot framework code of a specific robot
 *       operationId: getRobotCode
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RobotCode'
 */
exports.getRobotCodeForId = async (req, res) => {
  try {
    const { robotId } = req.params;
    const robotCode = await ssotToRobotparser.parseSsotById(robotId);
    res.send(robotCode);
  } catch (err) {
    console.error(err);
  }
};
