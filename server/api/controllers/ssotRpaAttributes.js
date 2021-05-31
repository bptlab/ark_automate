const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const ssotModels = require('../models/singleSourceOfTruthModel.js');

/**
 * @swagger
 * /robots/rpaattributes:
 *     put:
 *       tags:
 *         - Robots
 *       summary: Overwrite existing rpa attribute objects with updated ones
 *       operationId: overwriteAttributes
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - attributeObjectList
 *               properties:
 *                 attributeObjectList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RPAAttributes'
 *         description: updated attributes object
 *         required: true
 *       responses:
 *         204:
 *           description: No Content
 *         400:
 *           description: Bad Request
 */
exports.updateMany = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { attributeObjectList } = req.body;

    const updateList = [];
    attributeObjectList.forEach((element) => {
      const updateElement = {
        updateOne: {
          filter: {
            robotId: element.robotId,
            activityId: element.activityId,
          },
          update: element,
          upsert: true,
        },
      };
      updateList.push(updateElement);
    });

    const updatedObjects = await mongoose
      .model('rpaAttributes')
      .bulkWrite(updateList);

    res.send(updatedObjects);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /robots/rpaattributes/{robotId}:
 *     parameters:
 *       - name: robotId
 *         in: path
 *         description: Id of a robot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/RobotIds'
 *     get:
 *       tags:
 *         - Robots
 *       summary: Retrieve all rpa attribute objects for a specific robot
 *       operationId: getAttributesForRobot
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/RPAAttributes'
 */
exports.retrieveAttributesForRobot = async (req, res) => {
  const { robotId } = req.params;

  const attributeObjects = await mongoose
    .model('rpaAttributes')
    .find({ robotId })
    .exec();

  res.send(attributeObjects);
};

/**
 * @swagger
 * /robots/rpaattributes/{robotId}:
 *     parameters:
 *       - name: robotId
 *         in: path
 *         description: Id of a robot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/RobotIds'
 *     delete:
 *       tags:
 *         - Robots
 *       summary: Delete attributes related to the specified activities
 *       operationId: deleteAttributes
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - activityIdListObject
 *               properties:
 *                 activityIdList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityIds'
 *         description: list of activities for which the attributes should be deleted
 *         required: true
 *       responses:
 *         204:
 *           description: No Content
 *         400:
 *           description: Bad Request
 */
exports.deleteForActivities = async (req, res) => {
  const { activityIdList } = req.body;
  const { robotId } = req.params;
  const usablerobotId = mongoose.Types.ObjectId(robotId);

  try {
    const deletionResult = await mongoose
      .model('rpaAttributes')
      .deleteMany({
        activityId: { $in: activityIdList },
        robotId: usablerobotId,
      })
      .exec();

    res.send(deletionResult);
  } catch (error) {
    res.status(400).send(error);
  }
};
