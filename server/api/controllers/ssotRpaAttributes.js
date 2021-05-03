const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const ssotModels = require('../models/singleSourceOfTruthModel.js');

// POST /ssot/updateManyAttributes/
// do not forget the payload in the body for this request
exports.updateMany = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const attributeList = req.body;

    const updateList = [];
    attributeList.forEach((element) => {
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

// GET /getAllAttributes/604f537ed699a2eb47433184'
exports.retrieveAttributesForRobot = async (req, res) => {
  const { robotId } = req.params;

  const attributeObjects = await mongoose
    .model('rpaAttributes')
    .find({ robotId })
    .exec();

  res.send(attributeObjects);
};

// DELETE /deleteAttributes/604f537ed699a2eb47433184' TODO
exports.deleteMany = async (req, res) => {
  const { activityIdList } = req.query;
  const { robotId } = req.query;
  const usablerobotId = mongoose.Types.ObjectId(robotId);

  try {
    const deletedActivities = JSON.parse(activityIdList);
    const deletionResult = await mongoose
      .model('rpaAttributes')
      .deleteMany({
        activityId: { $in: deletedActivities },
        robotId: usablerobotId,
      })
      .exec();

    res.send(deletionResult);
  } catch (error) {
    res.status(400).send(error);
  }
};
