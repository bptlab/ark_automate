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

// GET /getAvailableBotsForUser/:userid
exports.getBotList = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { userid } = req.params;

    const usableUserId = mongoose.Types.ObjectId(userid);
    const availableSsotsById = await mongoose
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

    const ssotIds = [];
    availableSsotsById.forEach((singleUserObj) => {
      ssotIds.push(singleUserObj.robotId);
    });

    const availableSsots = await mongoose
      .model('SSoT')
      .find(
        { _id: { $in: ssotIds } },
        {
          startedId: 1,
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

// GET /renameBot?id=Browser&newName=Open+Browser
exports.renameBot = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const { id } = req.query;
    const { newName } = req.query;
    const newNameWithEmptyspace = newName.replace(/\+/g, ' ');

    const ssot = await mongoose
      .model('SSoT')
      .findByIdAndUpdate(
        { _id: id },
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
