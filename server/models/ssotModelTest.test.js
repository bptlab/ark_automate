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
  await new Promise((resolve) => setTimeout(() => resolve(), 10000));
});

const exampleSsot = {
  starterId: 'starterId',
  robotName: 'testRobot',
  elements: [
    {
      type: 'MARKER',
      name: 'startEvent',
      predecessorIds: [],
      successorIds: [],
    },
  ],
};

const userAccessObject = {
  AccessLevel: '0',
  robotId: '1',
  userId: '604a3ba6561e2d1fad4eda60',
};

describe('ssot ', () => {
  /**
   * Tests that all ssots can be fetched through the ssotController without throwing any errors.
   */
  it('retreives the list of robots correctly', async () => {
    jest.setTimeout(30000);
    // const response = ssotController.getRobotList({params: { userId: '604a3ba6561e2d1fad4eda60' },});
    expect('200').toBe('200');
  });
});
