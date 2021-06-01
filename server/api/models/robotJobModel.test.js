/* eslint-disable no-unused-expressions */

const mongoose = require('mongoose');
const { expect } = require('chai');
const dbHandler = require('../../utils/testing/testDatabaseHandler.js');
const { testJob } = require('../../utils/testing/testData.js');
// eslint-disable-next-line no-unused-vars
const jobsModel = require('./robotJobModel.js');

const Job = mongoose.model('job');

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

describe('jobs can be created', () => {
  const job = new Job(testJob);
  it('should throw no errors for correct job', async () => {
    job.save((err) => {
      expect(err).to.not.exist;
    });
  });
});

describe('jobs have validation for missing parameters', () => {
  const job = new Job({
    parameters: [],
  });
  it('should be invalid if userId is empty', async () => {
    job.save((err) => {
      expect(err.errors.userId).to.exist;
      expect(err.errors.userId.message).equal('UserId required');
    });
  });

  it('should be invalid if robotId is empty', async () => {
    job.save((err) => {
      expect(err.errors.robotId).to.exist;
      expect(err.errors.robotId.message).equal('RobotId required');
    });
  });

  it('should be invalid if status is empty', async () => {
    job.save((err) => {
      expect(err.errors.status).to.exist;
      expect(err.errors.status.message).equal('Status required');
    });
  });
});
