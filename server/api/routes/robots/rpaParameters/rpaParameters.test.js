/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const dbHandler = require('../../../../utils/testing/testDatabaseHandler');
const dbLoader = require('../../../../utils/testing/databaseLoader');
const ssotParameterController = require('../../../controllers/ssotParameterController');

// eslint-disable-next-line no-unused-vars
const rpaTaskModel = require('../../../models/rpaTaskModel');

const testData = require('../../../../utils/testing/testData');
const { testSsot, testRobotId } = require('../../../../utils/testing/testData');

beforeAll(async () => dbHandler.connect());

afterEach(async () => dbHandler.clearDatabase());

afterAll(async () => dbHandler.closeDatabase());

describe('PUT /robots/parameters', () => {
  it('successfully updates parameter for a task', async () => {
    await dbLoader.loadParametersInDb();
    const updatedValue = 'StonksOnlyGoDown.xls';

    const request = httpMocks.createRequest({
      method: 'POST',
      body: {
        parameterObjectsList: [
          {
            activityId: testSsot.elements[2].id,
            robotId: testRobotId,
            rpaParameters: [
              {
                name: 'filename',
                type: 'String',
                isRequired: true,
                infoText: 'Path to filename',
                index: 0,
                value: updatedValue,
              },
            ],
          },
        ],
      },
    });
    const response = httpMocks.createResponse();

    await ssotParameterController.updateMany(request, response);
    expect(response.statusCode).toBe(200);
    const data = await response._getData();
    expect(data.modifiedCount).toBe(1);

    const newParamObject = await mongoose
      .model('parameter')
      .findOne({
        robotId: testRobotId,
        activityId: testSsot.elements[2].id,
      })
      .exec();

    expect(newParamObject.rpaParameters[0].value).toEqual(updatedValue);
  });
});

describe('GET /robots/parameters/{robotId}', () => {
  it('successfully retreives all parameters for a robot', async () => {
    await dbLoader.loadParametersInDb();

    const request = httpMocks.createRequest({
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotParameterController.retrieveParametersForRobot(request, response);
    expect(response.statusCode).toBe(200);
    const data = await response._getData();
    expect(data.length).toBe(3);
    expect(JSON.stringify(data)).toEqual(
      JSON.stringify([
        testData.testParameter1,
        testData.testParameter2,
        testData.testParameter3,
      ])
    );
  });
});

describe('DELETE /robots/parameters/{robotId}', () => {
  it('deletes removed activity related parameter', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadParametersInDb();

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

    await ssotParameterController.deleteForActivities(request, response);

    const foundParameters = await mongoose.model('parameter').find().exec();
    expect(foundParameters.length).toBe(1);

    expect(response.statusCode).toBe(200);
  });
});
