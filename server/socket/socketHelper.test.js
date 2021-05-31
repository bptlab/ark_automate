/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const dbHandler = require('../utils/testing/testDatabaseHandler');
const socketHelperFunctions = require('./socketHelperFunctions');
const testData = require('../utils/testing/testData');

const {
  testRobotId,
  testUserId,
  testJobId,
  testRobotCode,
} = require('../utils/testing/testData');

const dbLoader = require('../utils/testing/databaseLoader');

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

describe('robot code retrieval', () => {
  it('sucessfully retreives the robot code', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadAttributesInDb();
    await dbLoader.loadParametersInDb();
    await dbLoader.loadJobInDb();
    await dbLoader.loadTasksInDb();

    const robotCode = await socketHelperFunctions.getRobotCodeForJob(
      testRobotId,
      testJobId
    );
    expect(robotCode).not.toBeUndefined();
    expect(robotCode).not.toBeNull();
    expect(String(robotCode).replace(/\s/g, '')).toEqual(
      String(testRobotCode).replace(/\s/g, '')
    );
  });
});

describe('user id retrieval', () => {
  it('sucessfully retreives all the user ids from the existing user access objects', async () => {
    await dbLoader.loadUserAccessObjectsInDb();

    const userIds = await socketHelperFunctions.getAllUserIds();
    expect(userIds).not.toBeUndefined();
    expect(userIds).not.toBeNull();
    expect(userIds).not.toContain('undefined');
    expect(userIds).toContain(testUserId);
    expect(userIds).toContain(testData.user2Id);
    expect(userIds.length).toEqual(2);
  });
});

describe('job creation', () => {
  it('sucessfully creates a job', async () => {
    const jobId = await socketHelperFunctions.createJob(
      testUserId,
      testRobotId,
      'testStatus',
      []
    );
    expect(jobId).not.toBeUndefined();
    expect(jobId).not.toBeNull();

    const foundJob = await mongoose.model('job').findById(jobId);
    expect(JSON.stringify(foundJob.id)).toEqual(JSON.stringify(jobId));
  });
});

describe('updating of job', () => {
  it('sucessfully updates a job status', async () => {
    await dbLoader.loadJobInDb();

    await socketHelperFunctions.updateRobotJobStatus(
      testData.testJob._id,
      'updatedStatus'
    );

    const foundJob = await mongoose.model('job').findById(testData.testJob._id);
    expect(foundJob).not.toBeNull();
    expect(foundJob).not.toBeUndefined();
    expect(foundJob.status).toEqual('updatedStatus');
  });

  it('sucessfully updates a job error object', async () => {
    await dbLoader.loadJobInDb();

    await socketHelperFunctions.updateRobotJobErrors(
      testData.testJob._id,
      testData.failingRobotRunLog
    );

    const foundJob = await mongoose.model('job').findById(testData.testJob._id);
    expect(foundJob.loggedErrors.length).toEqual(2);
    expect(foundJob.loggedErrors[0].activityName).toBe('Browser3');
    expect(foundJob.loggedErrors[0].tasks.length).toBe(2);
    expect(foundJob.loggedErrors[0].message).toBe(
      "No keyword with name 'Open Chro Browser' found. Did you mean:\n    RPA.Browser.Selenium.Open Chrome Browser"
    );
    expect(foundJob.loggedErrors[1].activityName).toBe('Save file');
    expect(foundJob.loggedErrors[1].message).toBe('Test Failing Message');
  });
});

describe('getting all jobs for user', () => {
  it('sucessfully gets all jobs for user', async () => {
    await dbLoader.loadJobInDb();

    const jobList = await socketHelperFunctions.getAllWaitingJobsForUser(
      testUserId
    );

    expect(jobList).not.toBeUndefined();
    expect(jobList).not.toBeNull();
    expect(jobList).not.toContain('undefined');
    expect(JSON.stringify(jobList)).toEqual(JSON.stringify([testData.testJob]));
    expect(jobList.length).toEqual(1);
  });
});
