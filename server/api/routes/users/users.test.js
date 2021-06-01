/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const dbHandler = require('../../../utils/testing/testDatabaseHandler');
const dbLoader = require('../../../utils/testing/databaseLoader');
const ssotRetrievalController = require('../../controllers/ssotRetrievalController');

// eslint-disable-next-line no-unused-vars
const rpaTaskModel = require('../../models/rpaTaskModel');

const {
  testSsot,
  testRobotId,
  testUserId,
} = require('../../../utils/testing/testData');

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

describe('GET /users/{userId}/robots', () => {
  it('retreives the list of robots for user correctly', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadUserAccessObjectsInDb();

    const request = httpMocks.createRequest({
      params: {
        userId: testUserId,
      },
    });
    const response = httpMocks.createResponse();
    await ssotRetrievalController.getRobotList(request, response);
    const data = await response._getData();
    expect(response.statusCode).toBe(200);
    // Catches error "Received: serializes to the same string"
    // Solution found here https://github.com/facebook/jest/issues/8475#issuecomment-537830532
    expect(JSON.stringify(data[0]._id)).toEqual(JSON.stringify(testRobotId));
  });
});

describe('POST /users/robotAccess', () => {
  it('successfully creates a userAccessObject for robot and user', async () => {
    const request = httpMocks.createRequest({
      body: {
        userId: testUserId,
        robotId: testRobotId,
        accessLevel: 'ReadWrite',
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.shareRobotWithUser(request, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(data.userId)).toEqual(JSON.stringify(testUserId));
    expect(JSON.stringify(data.robotId)).toEqual(JSON.stringify(testRobotId));

    const userAccessObject = await mongoose
      .model('userAccessObject')
      .find({
        userId: testUserId,
        robotId: testRobotId,
      })
      .exec();

    expect(JSON.stringify(userAccessObject[0].robotId)).toBe(
      JSON.stringify(testRobotId)
    );
    expect(JSON.stringify(userAccessObject[0].userId)).toEqual(
      JSON.stringify(testUserId)
    );
  });
});

describe('POST /users/{userId}/robots', () => {
  it('successfully creates a new ssot', async () => {
    const request = httpMocks.createRequest({
      body: {
        userId: testUserId,
        robotName: testSsot.robotName,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.createNewRobot(request, response);
    expect(response.statusCode).toBe(200);

    const data = await response._getData();
    const newRobotId = data._id;

    const request2 = httpMocks.createRequest({
      params: {
        userId: testUserId,
      },
    });
    const response2 = httpMocks.createResponse();
    await ssotRetrievalController.getRobotList(request2, response2);

    const data2 = await response2._getData();
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(data2[0]._id)).toEqual(JSON.stringify(newRobotId));
  });
});
