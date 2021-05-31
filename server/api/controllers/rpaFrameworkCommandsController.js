const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const rpaModels = require('../models/rpaTaskModel');

/**
 * @swagger
 * /functionalities/applications:
 *     get:
 *       tags:
 *         - RPA-Functionalities
 *       summary: Get all applications that ark automate supports
 *       operationId: getApplications
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Applications'
 */
exports.getAvailableApplications = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    const tasks = await mongoose.model('rpa-task').distinct('application');
    res.send(tasks);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /functionalities/{application}/tasks:
 *     parameters:
 *       - name: application
 *         in: path
 *         description: Name of an application
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Applications'
 *     get:
 *       tags:
 *         - RPA-Functionalities
 *       summary: Gets all the tasks to execute for an application
 *       operationId: getTasks
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Tasks'
 *         404:
 *           description: Not Found
 */
exports.getAvailableTasksForApplications = async (req, res) => {
  try {
    const { application } = req.params;
    res.set('Content-Type', 'application/json');
    if (application != null) {
      await mongoose
        .model('rpa-task')
        .distinct('task', { application }, (err, tasks) => {
          res.send(tasks);
        });
    } else {
      res.send('Please set a valid application parameter.');
    }
  } catch (err) {
    console.error(err);
  }
};

/**
 * @swagger
 * /functionalities:
 *     get:
 *       tags:
 *         - RPA-Functionalities
 *       summary: Retrieve all available Task and Application combinations with the input parameters and possible output values
 *       operationId: getFunctionalities
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Functionalities'
 */
exports.getAllRpaFunctionalities = async (req, res) => {
  const parameterObjects = await mongoose.model('rpa-task').find().exec();

  res.send(parameterObjects);
};
