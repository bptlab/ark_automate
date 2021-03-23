/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const dbHandler = require('../utils/TestingUtils/TestDatabaseHandler');
const rpaController = require('../controllers/rpaFrameworkCommandsController');
const testData = require('./testData');

const loadTasksInDb = async () => {
  const RpaTask = mongoose.model('rpa-task');
  const rpaTask = await new RpaTask(testData.testRpaTask1);
  await rpaTask.save();
  const rpaTask2 = await new RpaTask(testData.testRpaTask2);
  await rpaTask2.save();
  const rpaTask3 = await new RpaTask(testData.testRpaTask3);
  await rpaTask3.save();
};

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
    await loadTasksInDb();

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
    await loadTasksInDb();

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
