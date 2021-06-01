/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const dbHandler = require('../../../../utils/testing/testDatabaseHandler');
const dbLoader = require('../../../../utils/testing/databaseLoader');
const ssotAttributesController = require('../../../controllers/ssotRpaAttributes');

// eslint-disable-next-line no-unused-vars
const rpaTaskModel = require('../../../models/rpaTaskModel');

const testData = require('../../../../utils/testing/testData');
const { testSsot, testRobotId } = require('../../../../utils/testing/testData');

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

describe('PUT /robots/rpaattributes', () => {
  it('successfully updates all attributes for a robot', async () => {
    await dbLoader.loadAttributesInDb();

    const NEW_APP_VALUE = 'NewTestApp';
    const NEW_TASK_VALUE = 'NewTestTask';

    const request = httpMocks.createRequest({
      method: 'POST',
      body: {
        attributeObjectList: [
          {
            activityId: 'Activity_175v5b5',
            robotId: '606199015d691786a44a608f',
            rpaApplication: NEW_APP_VALUE,
            rpaTask: NEW_TASK_VALUE,
          },
        ],
      },
    });
    const response = httpMocks.createResponse();

    await ssotAttributesController.updateMany(request, response);
    expect(response.statusCode).toBe(200);
    const data = await response._getData();
    expect(data.modifiedCount).toBe(1);

    const newAttributesObject = await mongoose
      .model('rpaAttributes')
      .findOne({
        robotId: testRobotId,
        activityId: testSsot.elements[2].id,
      })
      .exec();

    expect(newAttributesObject.rpaApplication).toEqual(NEW_APP_VALUE);
    expect(newAttributesObject.rpaTask).toEqual(NEW_TASK_VALUE);
  });
});

describe('GET /robots/rpaattributes/{robotId}', () => {
  it('successfully retreives all attributes for a robot', async () => {
    await dbLoader.loadAttributesInDb();

    const request = httpMocks.createRequest({
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotAttributesController.retrieveAttributesForRobot(
      request,
      response
    );
    expect(response.statusCode).toBe(200);
    const data = await response._getData();

    expect(data.length).toBe(3);
    expect(JSON.stringify(data)).toEqual(
      JSON.stringify([
        testData.testAttributes1,
        testData.testAttributes2,
        testData.testAttributes3,
      ])
    );
  });
});

describe('DELETE /robots/rpaattributes/{robotId}', () => {
  it('deletes removed activity related attributes', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadAttributesInDb();

    const deletedActivityList = [
      testSsot.elements[2].id,
      testSsot.elements[3].id,
    ];
    const payload = { activityIdList: deletedActivityList };

    const request = httpMocks.createRequest({
      method: 'DELETE',
      body: payload,
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotAttributesController.deleteForActivities(request, response);

    const foundAttributes = await mongoose.model('rpaAttributes').find().exec();
    expect(foundAttributes.length).toBe(1);

    expect(response.statusCode).toBe(200);
  });
});
