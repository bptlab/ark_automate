/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const dbHandler = require('../utils/TestingUtils/TestDatabaseHandler');
const dbLoader = require('../utils/TestingUtils/databaseLoader');
const rpaController = require('../controllers/rpaFrameworkCommandsController');
const testData = require('../utils/TestingUtils/testData');

const ssotModel = require('../models/singleSourceOfTruthModel');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => dbHandler.closeDatabase());

describe('/commands/get-available-applications', () => {
  it('retreives the list of all available apps correctly', async () => {
    // TODO - check out why this test failes sometimes
    await dbLoader.loadTasksInDb();

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/commands/get-available-applications',
    });

    const response = httpMocks.createResponse();
    await rpaController.getAvailableApplications(request, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(data).toEqual([
      testData.testRpaTask1.Application,
      testData.testRpaTask2.Application,
    ]);
  });
});

describe('/commands/get-available-tasks-for-application', () => {
  it('retrieves the list of all available tasks for an application correctly', async () => {
    await dbLoader.loadTasksInDb();

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/commands/get-available-tasks-for-application',
      query: {
        application: testData.testRpaTask1.Application,
      },
    });

    const response = httpMocks.createResponse();
    await rpaController.getAvailableTasksForApplications(request, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(data).toEqual([
      testData.testRpaTask1.Task,
      testData.testRpaTask3.Task,
    ]);
  });
});

describe('/commands/getAllParameters', () => {
  it('retrieves the list of all available tasks correctly', async () => {
    await dbLoader.loadTasksInDb();

    const response = httpMocks.createResponse();
    await rpaController.getAllParameters({}, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(data.length).toBe(3);
    expect(data[0].inputVars.length).not.toBe(0);
    expect(data[0].inputVars.length).not.toBe(0);
    expect(data[0].inputVars[0]).toHaveProperty(
      'name',
      testData.testRpaTask1.inputVars[0].name
    );
  });
});

describe('/commands/get-vars-for-task', () => {
  it('retrieves the list of all available variables for a task', async () => {
    await dbLoader.loadTasksInDb();

    const request = httpMocks.createRequest({
      query: {
        application: testData.testRpaTask1.Application,
        task: testData.testRpaTask1.Task,
      },
    });

    const response = httpMocks.createResponse();
    await rpaController.getVarsForTask(request, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(data.inputVars.length).toBe(1);
    expect(data.inputVars).toHaveProperty(
      'name',
      testData.testRpaTask1.inputVars.name
    );
  });
});
