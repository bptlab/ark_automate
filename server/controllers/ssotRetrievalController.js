/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const ssotModels = require('../models/singleSourceOfTruthModel.js');
const userAccessModels = require('../models/userAccessObjectModel.js');

// GET /ssot/:id
exports.getSingleSourceOfTruth = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');

    const { id } = req.params;
    const ssot = await mongoose.model('SSoT').findById(id).exec();
    res.send(ssot);
  } catch (err) {
    console.error(err);
  }
};

// GET /getAvailableRobotsForUser/78d09f66d2ed466cf20b06f7
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
          AccessLevel: 0,
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

// GET /renameRobot?id=78d09f66d2ed466cf20b06f7&newName=Bot+Browser
exports.renameRobot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { id } = req.query;
    const usableUserId = mongoose.Types.ObjectId(id);
    const { newName } = req.query;
    const newNameWithEmptyspace = newName.replace(/\+/g, ' ');

    const ssot = await mongoose
      .model('SSoT')
      .findByIdAndUpdate(
        { _id: usableUserId },
        { robotName: newNameWithEmptyspace },
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

// GET /shareRobotWithUser?userId=78d09f66d2ed466cf20b06f7&robotId=78d09f66d2ed466cf20b06f7
exports.shareRobotWithUser = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');

    const uao = await mongoose.model('userAccessObject').create({
      AccessLevel: 'ReadWrite',
      robotId: req.query.robotId,
      userId: req.query.userId,
    });
    res.send(uao);
  } catch (err) {
    console.error(err);
  }
};

// GET /createNewRobot?userId=78d09f66d2ed466cf20b06f7&robotName=NewRobot
exports.createNewRobot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { userId } = req.query;
    const usableUserId = mongoose.Types.ObjectId(userId);
    const { robotName } = req.query;
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

    const uao = await mongoose.model('userAccessObject').create({
      AccessLevel: 'ReadWrite',
      robotId: ssot.id,
      userId: usableUserId,
    });

    const returnObj = {
      robotName: nameWithEmptyspace,
      robotId: ssot.id,
    };

    res.send(returnObj);
  } catch (err) {
    console.error(err);
  }
};

// POST /overwriteRobot/78d09f66d2ed466cf20b06f7
exports.overwriteRobot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const updatedSsot = req.body;

    const ssotData = await mongoose
      .model('SSoT')
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
