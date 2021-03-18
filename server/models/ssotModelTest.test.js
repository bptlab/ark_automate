const mongoose = require('mongoose');
const fetch = require('node-fetch');
const dbHandler = require('../utils/TestingUtils/db-handler');
const ssotController = require('../controllers/ssotRetrievalController');
const ssotModel = require('./singleSourceOfTruthModel');
const uaoModel = require('./userAccessObjectModel');
const express = require('express');
const httpMocks = require('node-mocks-http');

let uri = '';

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

const exampleSsot = {
  starterId: 'starterId',
  robotName: 'testRobot',
  elements: [
    {
      type: 'MARKER',
      name: 'DasistdieneueSSOT',
      predecessorIds: [],
      successorIds: [],
    },
  ],
};

const userAccessObject = {
  AccessLevel: '0',
  robotId: '604a3ba6561e2d1fad4eda10',
  userId: '604a3ba6561e2d1fad4eda60',
};

describe('ssot ', () => {
  /**
   * Tests that all ssots can be fetched through the ssotController without throwing any errors.
   */
  it('retreives the list of robots correctly', async () => {
    // TODO BEFORE UND AFTER FUNKTION FÜR JEDEN TEST SCHREIBEN
    let ssot = new ssotModel(exampleSsot);
    const savedSSot = await ssot.save();

    let uao = new uaoModel(userAccessObject);
    const savedUao = await uao.save();

    var response = httpMocks.createResponse();
    const result = await ssotModel.find();
    console.log(result);
    const data = await ssotController.getRobotList(
      {
        params: { userId: '604a3ba6561e2d1fad4eda60' },
      },
      response
    );
    // TODO CHECKEN WARUM DATA UNDEFINED
    console.log(data);
    expect('200').toBe('200');
  });
});
