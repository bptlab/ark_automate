/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const ssotModels = require('../models/singleSourceOfTruthModel.js');
const userAccessModels = require('../models/userAccessObjectModel.js');
const rpaModels = require('../models/rpaTaskModel');

const retrieveParameterObject = async (robotId, activityParameterId) =>
    mongoose.model('parameter').findOne(
        {
            ssotId: botId,
            activityId: activityParameterId,
      ssotId: robotId,
        }
    ).exec()
)

const findParametersForTask = async (applicationName, taskName) => (
    mongoose.model('rpa-task').findOne(
        {
            Application: applicationName,
            Task: taskName,
        },
        {
            inputVars: 1,
            outputValue: 1,
            _id: 0
        }
    ).exec()
)

const initiateParametersForActivity = async (botId, activityId, updatedParameters, hasOutput) => {
  robotId,
        return mongoose.model('parameter').findOneAndUpdate(
            {
          ssotId: robotId,
                activityId,
            },
            { 
                rpaParameters: updatedParameters,
                outputVariable: `${activityId}_output`
            },
            {
                new: true,
                useFindAndModify: false,
                upsert: true
            }
        ).exec()
    } 
    
    return mongoose.model('parameter').findOneAndUpdate(
        {
        ssotId: robotId,
            activityId,
        },
        { 
            rpaParameters: updatedParameters,
            $unset: { outputVariable: 1 }
        },
        {
            new: true,
            useFindAndModify: false,
            upsert: true
        }
    ).exec()    
}

const checkForOutputValue = async (robotId, activityId) => {
    const parameterObject = await  mongoose.model('parameter').findOne(
        {
            ssotId: botId,
            activityId,
      ssotId: robotId,
        }
    ).exec();
    return !!parameterObject.outputVariable
}

const updateParametersForActivity = async (botId, activityId, updatedParameters, updatedOutput, hasOutput) => {
  robotId,
        return mongoose.model('parameter').findOneAndUpdate(
            {
          ssotId: robotId,
                activityId,
            },
            { 
                rpaParameters: updatedParameters,
                outputVariable: updatedOutput
            },
            {
                new: true,
                useFindAndModify: false,
                upsert: true
            }
        ).exec()
    } 
    
    return mongoose.model('parameter').findOneAndUpdate(
        {
        ssotId: robotId,
            activityId,
        },
        { 
            rpaParameters: updatedParameters,
            $unset: { outputVariable: 1 }
        },
        {
            new: true,
            useFindAndModify: false,
            upsert: true
        }
    ).exec()    
}

// GET /ssot/getVariablesForNewTask/?robotId=6045eccf&activityId=ActivityId123&application=MS+Excel&task=Open+Application
exports.getVariablesForNewTask = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
    const { robotId } = req.query;
        const { activityId } = req.query;
        const { application } = req.query;
        const applicationWithEmptyspace = application.replace(/\+/g, ' ');
        const { task } = req.query;
        const taskWithEmptyspace = task.replace(/\+/g, ' ');

        const rpaTaskVariables = await findParametersForTask(applicationWithEmptyspace, taskWithEmptyspace);

        const inputVars = [];
        rpaTaskVariables.get('inputVars').forEach((singleVar) => {
            const varWithValue = singleVar;
            varWithValue.value = '';
            inputVars.push(varWithValue);
        });

        const updatedParameterObject = await initiateParametersForActivity(
      robotId,
            activityId,
            inputVars,
            rpaTaskVariables.outputValue
        );
        
        res.send(updatedParameterObject);
    } catch (err) {
        console.error(err);
    }
};

// GET /ssot/getVariables/?robotId=6045eccf&activityId=ActivityId123
exports.getVariables = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
    const { robotId } = req.query;
        const { activityId } = req.query;

        const variables = await mongoose.model('parameter').findOne(
            {
                ssotId: botId,
        ssotId: robotId,
            }
        ).exec()
        
        res.send(variables);
    } catch (err) {
        console.error(err);
    }
};

// GET /ssot/getVariablesForTaskApplication/?task=6045eccf&application=ActivityId123
exports.getVariablesForTaskApp = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const {application} = req.query;
        const applicationWithEmptyspace = application.replace(/\+/g, ' ');
        const {task} = req.query;
        const taskWithEmptyspace = task.replace(/\+/g, ' ');

        const variables = await mongoose.model('rpa-task').findOne(
            {
                Task: taskWithEmptyspace,
                Application: applicationWithEmptyspace
            }
        ).exec()
        
        res.send(variables);
    } catch (err) {
        console.error(err);
    }
};

// GET /ssot/checkForExistingVariables/?robotId=6045eccfa9a07940e5763f0b&activityId=Activity_1groimk
exports.checkForExistingVariables = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
    const { robotId } = req.query;
        const { activityId } = req.query;

    const element = await retrieveParameterObject(robotId, activityId);

        res.send(element);
    } catch (err) {
        console.error(err);
    }
};

// POST /ssot/updateInputAndOutput/?robotId=604f537ed699a2eb47433184&activityId=Activity_1groimk
// do not forget the payload in the body for this request
exports.updateVariables = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
    const { robotId } = req.query;
        const {activityId} = req.query;
        const updatedInfo = req.body;
        const {parameters} = updatedInfo;
        const {output} = updatedInfo;
        
    const hasOutput = await checkForOutputValue(robotId, activityId);
        const updatedParameterObject = await updateParametersForActivity(
      robotId,
            activityId,
            parameters,
            output,
            hasOutput
        );

        res.send(updatedParameterObject);

    } catch (err) {
        console.error(err);
    }
};

// POST /ssot/updateInputParameter/?botId=604f537ed699a2eb47433184&activityId=Activity_1groimk
// do not forget the payload in the body for this request
exports.updateOnlyInputParams = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
    const { robotId } = req.query;
        const {activityId} = req.query;
        const parameters = req.body;
        
        const updatedParameterObject = await mongoose.model('parameter').findOneAndUpdate(
            {
          ssotId: robotId,
                activityId
            },
            { 
                rpaParameters: parameters
            },
            {
                new: true,
                useFindAndModify: false,
                upsert: true
            }
        ).exec()

        res.send(updatedParameterObject);

    } catch (err) {
        console.error(err);
    }
};

// POST /ssot/updateOutputVariableName/?robotId=604f537ed699a2eb47433184&activityId=Activity_1groimk
// do not forget the payload in the body for this request
exports.updateOnlyOutputVarName = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
    const { robotId } = req.query;
        const {activityId} = req.query;
        const outputVarName = req.body;
        
        const updatedParameterObject = await mongoose.model('parameter').findOneAndUpdate(
            {
          ssotId: robotId,
                activityId
            },
            { 
                outputVariable: outputVarName
            },
            {
                new: true,
                useFindAndModify: false,
                upsert: true
            }
        ).exec()

        res.send(updatedParameterObject);

    } catch (err) {
        console.error(err);
    }
};

// POST /ssot/updateManyParameters/
// do not forget the payload in the body for this request
exports.updateMany = async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const parameterList = req.body;

        const updateList = [];
        parameterList.forEach( (element) => {
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
        
        const updatedObjects = await mongoose.model('parameter').bulkWrite(updateList)

        res.send(updatedObjects);
    } catch (err) {
        console.error(err);
    }
};

// GET /getAllParameters/604f537ed699a2eb47433184'
exports.retrieveParametersForRobot = async (req, res) => {
    const { robotId } = req.params;

    const parameterObjects = await mongoose
        .model('parameter')
        .find(
            {
                ssotId: robotId
            }
        )
        .exec();

    res.send(parameterObjects);
};
