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
 *       summary: Overwrite existing parameter objects with updated one's
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
 *         description: The id of a robot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/RobotIds'
 *     get:
 *       tags:
 *         - Robots
 *       summary: Get all parameter objects for a specific robot
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
