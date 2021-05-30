const mongoose = require('mongoose');
const { expect } = require('chai');
const dbHandler = require('../../utils/testing/testDatabaseHandler.js');
const { testRpaTask1 } = require('../../utils/testing/testData.js');
// eslint-disable-next-line no-unused-vars
const taskModel = require('./rpaTaskModel.js');

const RpaTask = mongoose.model('rpa-task');

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

describe('tasks can be created', () => {
  const task = new RpaTask(testRpaTask1);
  it('should throw no errors for correct job', async () => {
    task.save((err) => expect(err).to.not.exist);
  });
});

describe('tasks have validation for missing parameters', () => {
  const task = new RpaTask({});
  it('should be invalid if application is empty', async () => {
    task.save(
      (err) =>
        expect(err.errors.application).to.exist &&
        expect(err.errors.application.message).equal('Application required')
    );
  });

  it('should be invalid if task is empty', async () => {
    task.save(
      (err) =>
        expect(err.errors.task).to.exist &&
        expect(err.errors.task.message).equal('Task required')
    );
  });

  it('should be invalid if code is empty', async () => {
    task.save(
      (err) =>
        expect(err.errors.code).to.exist &&
        expect(err.errors.code.message).equal('Code required')
    );
  });
});
