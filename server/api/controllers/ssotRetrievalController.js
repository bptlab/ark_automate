/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const ssotModels = require('../models/singleSourceOfTruthModel.js');
const userAccessModels = require('../models/userAccessObjectModel.js');

/**
 * @swagger
 * /robots/{robotId}:
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
 *       summary: Retrieve a robot with a specific id
 *       operationId: getSpecificRobot
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Robots'
 */
exports.getSingleSourceOfTruth = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');

    const { robotId } = req.params;
    const ssot = await mongoose.model('SSoT').findById(robotId).exec();
    res.send(ssot);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /users/{userId}/robots:
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: Id of a user
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectIds'
 *     get:
 *       tags:
 *         - Users
 *       summary: Retrieve all robots for a specific user
 *       operationId: getRobotsForUser
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - _id
 *                     - robotName
 *                   properties:
 *                     _id:
 *                      $ref: '#/components/schemas/RobotIds'
 *                     robotName:
 *                       $ref: '#/components/schemas/RobotNames'
 */
exports.getRobotList = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { userId } = req.params;
    const usableUserId = mongoose.Types.ObjectId(userId);

    const userAccessObjs = await mongoose
      .model('userAccessObject')
      .find(
        { userId: usableUserId },
        {
          accessLevel: 0,
          _id: 0,
          userId: 0,
        }
      )
      .exec();

    const robotIds = [];
    userAccessObjs.forEach((singleUserObj) => {
      robotIds.push(singleUserObj.robotId);
    });

    const availableSsots = await mongoose
      .model('SSoT')
      .find(
        { _id: { $in: robotIds } },
        {
          starterId: 1,
          robotName: 1,
        }
      )
      .exec();

    const ssots = [];
    availableSsots.forEach((ssot) => {
      ssots.push({
        _id: ssot.id,
        starterId: ssot.startedId,
        robotName: ssot.robotName,
      });
    });
    res.send(ssots);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /robots/{robotId}/robotName:
 *     parameters:
 *       - name: robotId
 *         in: path
 *         description: Id of a robot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/RobotIds'
 *     patch:
 *       tags:
 *         - Robots
 *       summary: Updates the name of a robot
 *       operationId: setRobotName
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RobotNameObjects'
 *         description: Object with new robot name
 *         required: true
 *       responses:
 *         204:
 *           description: No Content
 *         400:
 *           description: Bad Request
 */
exports.renameRobot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { robotId } = req.params;
    const usableRobotId = mongoose.Types.ObjectId(robotId);
    const { newRobotName } = req.body;

    const ssot = await mongoose
      .model('SSoT')
      .findByIdAndUpdate(
        { _id: usableRobotId },
        { robotName: newRobotName },
        {
          new: true,
          useFindAndModify: false,
        }
      )
      .exec();

    res.send({
      starterId: ssot.starterId,
      robotName: ssot.robotName,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /users/robotAccess:
 *     post:
 *       tags:
 *         - Users
 *       summary: Share a robot with a user
 *       operationId: createUserAccessObject
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAccessObjects'
 *         description: Object that connects a user with a robot
 *         required: true
 *       responses:
 *         201:
 *           description: Created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserAccessObjects'
 *         400:
 *           description: Bad Request
 */
exports.shareRobotWithUser = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');

    const userObject = await mongoose
      .model('userAccessObject')
      .create(req.body);
    res.send(userObject);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /users/{userId}/robots:
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: Id of a user
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectIds'
 *     post:
 *       tags:
 *         - Users
 *       summary: Create a new robot for a specific user
 *       operationId: createRobotForUser
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - userId
 *                 - robotName
 *               properties:
 *                 userId:
 *                   $ref: '#/components/schemas/ObjectIds'
 *                 robotName:
 *                   $ref: '#/components/schemas/RobotNames'
 *         description: Object that contains the new robotObject and a new userAccessObject
 *         required: true
 *       responses:
 *         201:
 *           description: Created
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 required:
 *                   - robotId
 *                   - robotName
 *                 properties:
 *                   robotId:
 *                     $ref: '#/components/schemas/RobotIds'
 *                   robotName:
 *                     $ref: '#/components/schemas/RobotNames'
 *         400:
 *           description: Bad Request
 */
exports.createNewRobot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { userId } = req.body;
    const usableUserId = mongoose.Types.ObjectId(userId);
    const { robotName } = req.body;
    const nameWithEmptyspace = robotName.replace(/\+/g, ' ');

    const initialStartEvent = {
      predecessorIds: [],
      successorIds: [],
      type: 'MARKER',
      id: 'Event_startEvent',
    };

    const ssot = await mongoose.model('SSoT').create({
      starterId: '',
      robotName: nameWithEmptyspace,
      elements: [initialStartEvent],
    });

    const updatedSsot = await ssot
      .updateOne({
        _id: ssot.id,
      })
      .exec();

    const userObject = await mongoose.model('userAccessObject').create({
      accessLevel: 'ReadWrite',
      robotId: ssot.id,
      userId: usableUserId,
    });

    const returnObj = {
      _id: ssot.id,
      robotName: nameWithEmptyspace,
    };

    res.send(returnObj);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /robots/{robotId}:
 *   parameters:
 *     - name: robotId
 *       in: path
 *       description: Id of a robot
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/RobotIds'
 *   put:
 *     tags:
 *       - Robots
 *     summary: Overwrite an existing robot with an updated one
 *     operationId: overwriteRobot
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Robots'
 *       description: updated Robot object
 *       required: true
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 */
exports.overwriteRobot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const updatedSsot = req.body;

    const ssotData = await mongoose
      .model('SSoT')
      // eslint-disable-next-line no-underscore-dangle
      .findByIdAndUpdate(updatedSsot._id, updatedSsot, {
        new: true,
        useFindAndModify: false,
        upsert: true,
      })
      .exec();

    res.send(ssotData);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /robots/{robotId}:
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
 *       summary: Deletes a robot with a specific id
 *       operationId: deleteSpecificRobot
 *       responses:
 *         200:
 *           description: OK
 */
exports.deleteRobot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { robotId } = req.params;
    const usableRobotId = mongoose.Types.ObjectId(robotId);

    const response = await mongoose
      .model('SSoT')
      .deleteOne({ _id: usableRobotId })
      .exec();

    await mongoose
      .model('userAccessObject')
      .deleteMany({ robotId: usableRobotId })
      .exec();

    await mongoose
      .model('rpaAttributes')
      .deleteMany({ robotId: usableRobotId })
      .exec();

    await mongoose
      .model('parameter')
      .deleteMany({ robotId: usableRobotId })
      .exec();

    await mongoose.model('job').deleteMany({ robotId: usableRobotId }).exec();

    res.send(response);
  } catch (err) {
    console.error(err);
  }
};
