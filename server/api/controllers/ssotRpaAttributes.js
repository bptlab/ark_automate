const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const ssotModels = require('../models/singleSourceOfTruthModel.js');

/**
 * @swagger
 * /robots/rpaattributes:
 *     put:
 *       tags:
 *         - Robots
 *       summary: Overwrite existing rpa attribute objects with updated one's
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
 *         description: The id of a robot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/RobotIds'
 *     get:
 *       tags:
 *         - Robots
 *       summary: Get all rpa attribute objects for a specific robot
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
