const mongoose = require('mongoose');
const fetch = require('node-fetch');
const express = require('express');
const httpMocks = require('node-mocks-http');
const dbHandler = require('../utils/TestingUtils/db-handler');
const ssotRetrievalController = require('../controllers/ssotRetrievalController');
const ssotModel = require('../models/singleSourceOfTruthModel');
const uaoModel = require('../models/userAccessObjectModel');
const testData = require('./testData');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbHandler.connect();
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const loadSsotInDb = async () => {
  const ssot = new ssotModel(testData.exampleSsot);
  await ssot.save();
};

const loadUserAccessObjectInDb = async () => {
  const uao = new uaoModel(testData.userAccessObject);
  await uao.save();
};

describe('/ssot/getAvailableRobotsForUser', () => {
  it('retreives the list of robots for user correctly', async () => {
    await loadSsotInDb();
    await loadUserAccessObjectInDb();

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/ssot/getAvailableRobotsForUser',
      params: {
        userId: testData.userId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.getRobotList(request, response);
    const data = await response._getData();
    console.log('Hellooooo', data);
    expect(response.statusCode).toBe(200);
    // Solution found here https://github.com/facebook/jest/issues/8475#issuecomment-537830532
    expect(JSON.stringify(data[0]._id)).toEqual(
      JSON.stringify(testData.ssotId)
    );
  });
});

describe('/get/:id', () => {
  it('retreives a ssot by id correctly', async () => {
    await loadSsotInDb();

    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/ssot/get/',
      params: {
        id: testData.ssotId,
      },
    });
    const response = httpMocks.createResponse();

    await ssotRetrievalController.getSingleSourceOfTruth(request, response);
    const data = await response._getData();

    expect(response.statusCode).toBe(200);
    // Solution found here https://github.com/facebook/jest/issues/8475#issuecomment-537830532
    expect(JSON.stringify(data._id)).toEqual(JSON.stringify(testData.ssotId));
  });
});
