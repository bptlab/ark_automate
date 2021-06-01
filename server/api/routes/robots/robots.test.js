/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const dbHandler = require('../../../utils/testing/testDatabaseHandler');
const dbLoader = require('../../../utils/testing/databaseLoader');
const ssotRetrievalController = require('../../controllers/ssotRetrievalController');
const ssotParsingController = require('../../controllers/ssotParsingController');

// eslint-disable-next-line no-unused-vars
const rpaTaskModel = require('../../models/rpaTaskModel');

const { testSsot, testRobotId } = require('../../../utils/testing/testData');

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

describe('GET /robots/{robotId}', () => {
  it('retrieves a ssot by id correctly', async () => {
    await dbLoader.loadSsotInDb();

    const request = httpMocks.createRequest({
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.getSingleSourceOfTruth(request, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(data._id)).toEqual(JSON.stringify(testRobotId));
  });
});

describe('PATCH /robots/{robotId}/robotName', () => {
  it('sets the robotName to the requested string', async () => {
    await dbLoader.loadSsotInDb();

    const request = httpMocks.createRequest({
      params: {
        robotId: testRobotId,
      },
      body: {
        newRobotName: 'newTestRobot',
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.renameRobot(request, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(data.robotName)).toEqual(
      JSON.stringify('newTestRobot')
    );

    const ssot = await mongoose.model('SSoT').findById(testRobotId).exec();
    expect(JSON.stringify(ssot.robotName)).toEqual(
      JSON.stringify('newTestRobot')
    );
  });
});

describe('GET /robots/{robotId}/robotCode', () => {
  it('successfully retrieves parsed code for ssot', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadAttributesInDb();
    await dbLoader.loadParametersInDb();

    const request = httpMocks.createRequest({
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotParsingController.getRobotCodeForId(request, response);
    expect(response.statusCode).toBe(200);

    const data = await response._getData();
    expect(data).toMatch('*** Settings ***');
    expect(data).toMatch('*** Tasks ***');
  });
});

describe('PUT /robots/{robotId}', () => {
  it('successfully retrieves overwritten ssot', async () => {
    await dbLoader.loadSsotInDb();

    const adaptedSsot = JSON.parse(JSON.stringify(testSsot)); // deep copy workaround
    adaptedSsot.elements = [
      {
        predecessorIds: [],
        successorIds: [],
        _id: '6062f0ad92ffd3044c6ee382',
        type: 'MARKER',
        name: 'Start Event',
        id: 'Event_1wm4a0f',
      },
    ];

    const request = httpMocks.createRequest({
      method: 'POST',
      params: {
        robotId: testRobotId,
      },
      body: adaptedSsot,
    });
    const response = httpMocks.createResponse();
    await ssotRetrievalController.overwriteRobot(request, response);

    expect(response.statusCode).toBe(200);

    const data = await response._getData();
    expect(data.elements.length).toBe(1);

    const newSsot = await mongoose.model('SSoT').findById(testRobotId).exec();
    expect(JSON.stringify(data)).toEqual(JSON.stringify(newSsot));
  });
});

describe('DELETE /robots/{robotId}', () => {
  it('successfully deletes the robots ssot', async () => {
    await dbLoader.loadSsotInDb();
    const ssotBefore = await mongoose.model('SSoT').find().exec();

    const request = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.deleteRobot(request, response);
    expect(response.statusCode).toBe(200);

    const usableTestRobotId = mongoose.Types.ObjectId(testRobotId);
    const foundSsots = await mongoose.model('SSoT').find().exec();
    expect(foundSsots.length).toBe(0);

    const foundSsotById = await mongoose
      .model('SSoT')
      .findById({ _id: usableTestRobotId })
      .exec();

    expect(foundSsotById).toBe(null);
    expect(foundSsotById).not.toBe(ssotBefore);
  });

  it('successfully deletes the user access object to a robot', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadUserAccessObjectsInDb();

    const loadedUserAccessObjects = await mongoose
      .model('userAccessObject')
      .find()
      .exec();
    expect(loadedUserAccessObjects.length).toBe(2);

    const request = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.deleteRobot(request, response);
    expect(response.statusCode).toBe(200);

    const foundUserAccessObjects = await mongoose
      .model('userAccessObject')
      .find()
      .exec();
    expect(foundUserAccessObjects.length).toBe(
      loadedUserAccessObjects.length - 1
    );

    const usableTestRobotId = mongoose.Types.ObjectId(testRobotId);
    const foundUserAccessObjectsById = await mongoose
      .model('userAccessObject')
      .find({ robotId: usableTestRobotId })
      .exec();

    expect(foundUserAccessObjectsById.length).toBe(0);
  });

  it('successfully deletes the attributes to a robots activities', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadAttributesInDb();

    const loadedAttributes = await mongoose
      .model('rpaAttributes')
      .find()
      .exec();
    expect(loadedAttributes.length).toBe(3);

    const request = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.deleteRobot(request, response);
    expect(response.statusCode).toBe(200);

    const foundAttributes = await mongoose.model('rpaAttributes').find().exec();
    expect(foundAttributes.length).toBe(0);
    expect(foundAttributes.length).not.toBe(loadedAttributes.length);
    expect(foundAttributes).not.toBe(loadedAttributes);
  });

  it('successfully deletes the parameters to a robots activities', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadParametersInDb();

    const loadedParameters = await mongoose.model('parameter').find().exec();
    expect(loadedParameters.length).toBe(3);

    const request = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.deleteRobot(request, response);
    expect(response.statusCode).toBe(200);

    const foundParameters = await mongoose.model('parameter').find().exec();
    expect(foundParameters.length).toBe(0);
    expect(foundParameters.length).not.toBe(loadedParameters.length);
    expect(foundParameters).not.toBe(loadedParameters);
  });

  it('successfully deletes the jobs to a robot', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadJobInDb();

    const loadedJobs = await mongoose.model('job').find().exec();
    expect(loadedJobs.length).toBe(1);

    const request = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.deleteRobot(request, response);
    expect(response.statusCode).toBe(200);

    const foundJobs = await mongoose.model('job').find().exec();
    expect(foundJobs.length).toBe(0);
    expect(foundJobs.length).not.toBe(loadedJobs.length);
    expect(foundJobs).not.toBe(loadedJobs);
  });

  it('sucessfully deletes every robot artifact to a given robotId', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadJobInDb();
    await dbLoader.loadParametersInDb();
    await dbLoader.loadAttributesInDb();
    await dbLoader.loadUserAccessObjectsInDb();
    await dbLoader.loadTasksInDb();

    const request = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        robotId: testRobotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.deleteRobot(request, response);
    expect(response.statusCode).toBe(200);

    const usableTestRobotId = mongoose.Types.ObjectId(testRobotId);
    const foundSsotById = await mongoose
      .model('SSoT')
      .findById({ _id: usableTestRobotId })
      .exec();
    expect(foundSsotById).toBe(null);

    const foundUserAccessObjectsById = await mongoose
      .model('userAccessObject')
      .find({ robotId: usableTestRobotId })
      .exec();
    expect(foundUserAccessObjectsById.length).toBe(0);

    const foundAttributes = await mongoose.model('rpaAttributes').find().exec();
    expect(foundAttributes.length).toBe(0);

    const foundParameters = await mongoose.model('parameter').find().exec();
    expect(foundParameters.length).toBe(0);

    const foundJobs = await mongoose.model('job').find().exec();
    expect(foundJobs.length).toBe(0);
  });
});
