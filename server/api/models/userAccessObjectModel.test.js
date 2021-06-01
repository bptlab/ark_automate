const mongoose = require('mongoose');
const { expect } = require('chai');
const dbHandler = require('../../utils/testing/testDatabaseHandler.js');
const { testUserAccessObject } = require('../../utils/testing/testData.js');
// eslint-disable-next-line no-unused-vars
const userAccessObjectModel = require('./userAccessObjectModel.js');

const UserAccesObject = mongoose.model('userAccessObject');
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

describe('user access objects can be created', () => {
  const userAccessObject = new UserAccesObject(testUserAccessObject);
  it('should throw no errors for correct job', async () => {
    userAccessObject.save((err) => expect(err).to.not.exist);
  });
});

describe('user access objects have validation for missing parameters', () => {
  const job = new UserAccesObject({});
  it('should be invalid if robotId is empty', async () => {
    job.save(
      (err) =>
        expect(err.errors.robotId).to.exist &&
        expect(err.errors.robotId.message).equal('RobotId required')
    );
  });

  it('should be invalid if userId is empty', async () => {
    job.save(
      (err) =>
        expect(err.errors.userId).to.exist &&
        expect(err.errors.userId.message).equal('UserId required')
    );
  });
});
