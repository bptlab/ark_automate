/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const ssotModels = require('../models/singleSourceOfTruthModel.js');
const userAccessModels = require('../models/userAccessObjectModel.js');
const rpaModels = require('../models/rpaTaskModel');

/**
 * @swagger
 * /robots/parameters:
 *     put:
 *       tags:
 *         - Robots
 *       summary: Overwrite existing parameter objects with updated ones
 *       operationId: overwriteParameters
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - parameterObjectsList
 *               properties:
 *                 parameterObjectsList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Parameters'
 *         description: updated parameter object
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
    const { parameterObjectsList } = req.body;

    const updateList = [];
    parameterObjectsList.forEach((element) => {
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
      .model('parameter')
      .bulkWrite(updateList);

    res.send(updatedObjects);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /robots/parameters/{robotId}:
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
 *       summary: Retrieve all parameter objects for a specific robot
 *       operationId: getParametersForRobot
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Parameters'
 */
exports.retrieveParametersForRobot = async (req, res) => {
  const { robotId } = req.params;

  const parameterObjects = await mongoose
    .model('parameter')
    .find({
      robotId,
    })
    .exec();

  res.send(parameterObjects);
};

/**
 * @swagger
 * /robots/parameters/{robotId}:
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
 *       summary: Delete parameters related to the specified activities
 *       operationId: deleteParameters
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
 *         description: updated parameter object
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
      .model('parameter')
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
