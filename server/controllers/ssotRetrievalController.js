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
    const availableSSOTsById = await mongoose
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

    const SSOTIds = [];
    availableSSOTsById.forEach((singleUserObj) => {
      SSOTIds.push(singleUserObj.robotId);
    });

    const availableSSOTs = await mongoose
      .model('SSoT')
      .find(
        { _id: { $in: SSOTIds } },
        {
          robotMetadata: 1,
        }
      )
      .exec();

    const SSOTs = [];
    availableSSOTs.forEach((singleSSOT) => {
      SSOTs.push(singleSSOT.robotMetadata);
    });

    res.send(SSOTs);
  } catch (err) {
    console.error(err);
  }
};
