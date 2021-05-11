/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const httpMocks = require('node-mocks-http');
const dbHandler = require('../../../utils/TestingUtils/TestDatabaseHandler');
const dbLoader = require('../../../utils/TestingUtils/databaseLoader');
const rpaController = require('../../controllers/rpaFrameworkCommandsController');
const testData = require('../../../utils/TestingUtils/testData');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => dbHandler.connect());

/**
 * Clear all test data after every test. Not needed here because no test writes data
 */
// afterEach(async () =>  dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => dbHandler.closeDatabase());

describe('GET /functionalities/applications', () => {
  it('retreives the list of all available apps correctly', async () => {
    await dbLoader.loadTasksInDb();
    const response = httpMocks.createResponse();
    await rpaController.getAvailableApplications({}, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(data).toEqual([
      testData.testRpaTask1.Application,
      testData.testRpaTask2.Application,
    ]);
  });
});

describe('GET /functionalities/{application}/tasks', () => {
  it('retrieves the list of all available tasks for an application correctly', async () => {
    const request = httpMocks.createRequest({
      params: {
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

describe('GET /functionalities', () => {
  it('retrieves the list of all available parameter Objects correctly', async () => {
    const response = httpMocks.createResponse();
    await rpaController.getAllRpaFunctionalities({}, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(data.length).toBe(testData.numberOfTestTasks);
    expect(data[0].inputVars.length).not.toBe(0);
    expect(data[0].inputVars.length).not.toBe(0);

    const paramObjectOfTestRpaTask1 = data[0].inputVars[0];
    const testTaskKey = testData.testRpaTask1.inputVars.keys[0];
    expect(paramObjectOfTestRpaTask1).toHaveProperty(
      String(testTaskKey),
      testData.testRpaTask1.inputVars[testTaskKey]
    );
  });
});
