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

        const userAccessObjs = await mongoose.model('userAccessObject').find(
            { userId: usableUserId }, 
            {
                AccessLevel: 0,
                _id: 0,
                userId: 0
            }
        ).exec();
        
        const SSOTIds = [];
        userAccessObjs.forEach((singleUserObj) => {
            SSOTIds.push(singleUserObj.robotId);
        });

        const availableSSOTs = await mongoose.model('SSoT').find(
            { _id: { $in: SSOTIds } }, 
            {
                robotMetadata: 1
            }
        ).exec();
        
        const SSOTs = [];
        availableSSOTs.forEach((singleSSOT) => {
            SSOTs.push(singleSSOT.robotMetadata);
        });

        res.send(SSOTs);
    } catch (err) {
        console.error(err);
    }
};

// GET /renameBot?id=78d09f66d2ed466cf20b06f7&newName=Bot+Browser
exports.renameBot = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const {id} = req.query;
        const usableUserId = mongoose.Types.ObjectId(id);
        const {newName} = req.query;
        const newNameWithEmptyspace = newName.replace(/\+/g, ' ');

        const ssot = await mongoose.model('SSoT').findByIdAndUpdate(
            { _id: usableUserId },
            {'robotMetadata.robotName': newNameWithEmptyspace},
            {
                new: true,
                useFindAndModify: false
            }
        ).exec();

        res.send(ssot.robotMetadata);
    } catch (err) {
        console.error(err);
    }
};

// GET /createNewBot?userid=78d09f66d2ed466cf20b06f7&botName=NewRobot
exports.createNewBot = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const {userid} = req.query;
        const usableUserId = mongoose.Types.ObjectId(userid);
        const {botName} = req.query;
        const nameWithEmptyspace = botName.replace(/\+/g, ' ');

        const ssot = await mongoose.model('SSoT').create({
            robotMetadata: {
                starterId: '',
                robotName: nameWithEmptyspace
            },
            elements: []
        });

        const updatedSsot = await ssot.updateOne({
            'robotMetadata.robotId': ssot.id
        }).exec();

        const uao = await mongoose.model('userAccessObject').create({
            AccessLevel: 'ReadWrite',
            robotId: ssot.id,
            userId: usableUserId
        });

        const returnObj = {
            robotName: nameWithEmptyspace,
            robotId: ssot.id
        };
        
        res.send(returnObj);
    } catch (err) {
        console.error(err);
    }
};
