/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { expect } = require('chai');
const dbHandler = require('../utils/TestingUtils/testDatabaseHandler');
const { testSsot } = require('../utils/TestingUtils/testData');
const ssotModel = require('./singleSourceOfTruthModel.js');

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

describe('Robots can be created', () => {
  const ssot = new mongoose.model('SSoT')(testSsot);
  it('should throw no errors for correct job', async () => {
    ssot.save((err) => {
      expect(err).to.not.exist;
    });
  });
});

describe('Robots have validation for missing parameters', () => {
  const job = new mongoose.model('SSoT')({});
  it('should be invalid if robotName is empty', async () => {
    job.save((err) => {
      expect(err.errors.robotName).to.exist;
      expect(err.errors.robotName.message).equal('robotName required');
    });
  });
});
