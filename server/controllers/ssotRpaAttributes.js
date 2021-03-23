const mongoose = require('mongoose');
const ssotModels = require('../models/singleSourceOfTruthModel.js');

// GET /ssot/getAttributes/?botId=6045eccf&activityId=ActivityId123
exports.getAttributes = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const { botId } = req.query;
        const { activityId } = req.query;

        const attributes = await mongoose.model('rpaAttributes').findOne(
            {
                activityId,
                ssotId: botId,
            },
            {
                rpaApplication: 1,
                rpaTask: 1,
                _id: 0
            }
        ).exec()

        res.send(attributes);
    } catch (err) {
        console.error(err);
    }
};

// POST /ssot/updateAttributes/
// do not forget the payload in the body for this request
exports.updateAttributes = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const updatedInfo = req.body;
        console.log(updatedInfo);
        const botId = updatedInfo.ssotId;
        const { activityId } = updatedInfo;
        console.log(botId);
        console.log(activityId);

        const updatedAttributes = await mongoose
            .model('rpaAttributes')
            .findOneAndUpdate(
                {
                    activityId,
                    ssotId: botId,
                },
                updatedInfo,
                {
                    new: true,
                    useFindAndModify: false,
                    upsert: true
                }
            )
            .exec();

        res.send(updatedAttributes);
    } catch (err) {
        console.error(err);
    }
};

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
                        ssotId: element.ssotId,
                        activityId: element.activityId
                    },
                    update: element,
                    upsert: true
                }
            };
            updateList.push(updateElement);
        });

        const updatedObjects = await mongoose.model('rpaAttributes').bulkWrite(updateList).exec()

        res.send(updatedObjects);
    } catch (err) {
        console.error(err);
    }
};

/**
 * @description TODO
 */
exports.retrieveAttributesForRobot = async (req, res) => {
    const { robotId } = req.params;

    const parameterObjects = await mongoose
        .model('rpaAttributes')
        .find(
            {
                ssotId: robotId
            }
        )
        .exec();

    res.send(parameterObjects);
};