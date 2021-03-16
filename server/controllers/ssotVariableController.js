/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const ssotModels = require('../models/singleSourceOfTruthModel.js');
const userAccessModels = require('../models/userAccessObjectModel.js');

const retrieveElementsAndMatchingElement = async (botId, activityId) => {
    let matchingElement = {};

    const ssot = await mongoose.model('SSoT').findOne(
        {
            _id: botId
        },
        {
            elements: 1,
            _id: 0
        }
    ).exec();

    const elementList = ssot.elements;
    elementList.forEach((singleElement) => {
        if (singleElement.id === activityId) {
            matchingElement = singleElement;
        }
    });

    const returnObject = {
        'elementList': elementList,
        'matchingElement': matchingElement
    };

    return returnObject;
}

const checkIfElementIsEmpty = (element) => (
    element && Object.keys(element).length === 0 && element.constructor === Object
)


// GET /ssot/getVariablesForNewTask/?botId=6045eccf&activityId=ActivityId123&application=MS+Excel&task=Open+Application
exports.getVariablesForNewTask = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const { botId } = req.query;
        const { activityId } = req.query;
        const { application } = req.query;
        const applicationWithEmptyspace = application.replace(/\+/g, ' ');
        const { task } = req.query;
        const taskWithEmptyspace = task.replace(/\+/g, ' ');

        const rpaTaskVariables = await mongoose.model('rpa-task').findOne(
            {
                Application: applicationWithEmptyspace,
                Task: taskWithEmptyspace,
            },
            {
                inputVars: 1,
                _id: 0
            }
        ).exec();

        const inputVars = [];
        rpaTaskVariables.get('inputVars').forEach((singleVar) => {
            const varWithValue = singleVar;
            varWithValue.value = '';
            inputVars.push(varWithValue);
        });

        const listAndElement = await retrieveElementsAndMatchingElement(botId, activityId);
        const { elementList } = listAndElement;
        const { matchingElement } = listAndElement;
        matchingElement.rpaParameters = inputVars;

        const updatesSsot = await mongoose.model('SSoT').findByIdAndUpdate(
            { _id: botId },
            { elements: elementList },
            {
                new: true,
                useFindAndModify: false
            }
        ).exec();

        res.send(inputVars);
    } catch (err) {
        console.error(err);
    }
};

// GET /ssot/checkForExistingVariables/?botId=6045eccfa9a07940e5763f0b&activityId=Activity_1groimk
exports.checkForExistingVariables = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const { botId } = req.query;
        const { activityId } = req.query;

        const element = (await retrieveElementsAndMatchingElement(botId, activityId)).matchingElement;

        if (checkIfElementIsEmpty(element)) {
            res.status(403).send('No matching activity could be found');
        } else {
            res.send(element.rpaParameters);
        }

    } catch (err) {
        console.error(err);
    }
};

// GET /ssot/updateVariables/?botId=604f537ed699a2eb47433184&activityId=Activity_1groimk
// do not forget the payload in the body for this request
exports.updateVariables = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const { botId } = req.query;
        const { activityId } = req.query;

        const listAndElement = await retrieveElementsAndMatchingElement(botId, activityId);
        const { elementList } = listAndElement;
        const { matchingElement } = listAndElement;
        matchingElement.rpaParameters = req.body;

        const updatesSsot = await mongoose.model('SSoT').findByIdAndUpdate(
            { _id: botId },
            { elements: elementList },
            {
                new: true,
                useFindAndModify: false
            }
        ).exec();

        res.send(updatesSsot);

    } catch (err) {
        console.error(err);
    }
};