/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const dbHandler = require('../utils/TestingUtils/TestDatabaseHandler');
const socketHelperFunctions = require('./socketHelperFunctions');
const testData = require('../utils/TestingUtils/testData');

const SsotModel = mongoose.model('SSoT');
const UserAccessObjectModel = mongoose.model('userAccessObject');
const JobModel = mongoose.model('job');

const loadSsotInDb = async () => {
  const ssot = new SsotModel(testData.testSsot);
  await ssot.save();
};

const loadUserAccessObjectsInDb = async () => {
  const userAccessObject = UserAccessObjectModel(testData.testUserAccessObject);
  await userAccessObject.save();
  const userAccessObject2 = UserAccessObjectModel(
    testData.testUserAccessObject2
  );
  await userAccessObject2.save();
};

const loadJobInDb = async () => {
  const job = new JobModel(testData.testJob);
  await job.save();
};

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
  it('sucessfully retreives the roboto code', async () => {
    await loadSsotInDb();

    const robotCode = await socketHelperFunctions.getRobotCode(testData.ssotId);
    expect(robotCode).not.toBeUndefined();
    expect(robotCode).not.toBeNull();
    expect(robotCode).toMatch('*** Settings ***');
    expect(robotCode).toMatch('*** Tasks ***');
  });
});

describe('user id retrieval', () => {
  it('sucessfully retreives all the user ids from the existing user access objects', async () => {
    await loadUserAccessObjectsInDb();

    const userIds = await socketHelperFunctions.getAllUserIds();
    expect(userIds).not.toBeUndefined();
    expect(userIds).not.toBeNull();
    expect(userIds).not.toContain('undefined');
    expect(userIds).toContain(testData.userId);
    expect(userIds).toContain(testData.user2Id);
    expect(userIds.length).toEqual(2);
  });
});

describe('job creation', () => {
  it('sucessfully creates a job', async () => {
    const jobId = await socketHelperFunctions.createJob(
      testData.userId,
      testData.ssotId,
      'testStatus',
      []
    );
    expect(jobId).not.toBeUndefined();
    expect(jobId).not.toBeNull();
    const foundJob = await mongoose.model('job').findById(jobId);
    expect(JSON.stringify(foundJob.id)).toEqual(JSON.stringify(jobId));
  });
});

describe('updating of job status', () => {
  it('sucessfully updates a job', async () => {
    await loadJobInDb();

    await socketHelperFunctions.updateRobotJobStatus(
      testData.testJob._id,
      'updatedStatus'
    );

    const foundJob = await mongoose.model('job').findById(testData.testJob._id);
    expect(foundJob).not.toBeNull();
    expect(foundJob).not.toBeUndefined();

    expect(foundJob.status).toEqual('updatedStatus');
  });
});

describe('getting all jobs for user', () => {
  it('sucessfully gets all jobs for user', async () => {
    await loadJobInDb();

    const jobList = await socketHelperFunctions.getAllWaitingJobsForUser(
      testData.userId
    );

    expect(jobList).not.toBeUndefined();
    expect(jobList).not.toBeNull();
    expect(jobList).not.toContain('undefined');
    expect(JSON.stringify(jobList)).toEqual(JSON.stringify([testData.testJob]));
    expect(jobList.length).toEqual(1);
  });
});
