const mongoose = require('mongoose');
const {expect} = require('chai');
const dbHandler = require('../utils/TestingUtils/TestDatabaseHandler');
const jobsModel = require("./robotJobModel.js");

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

describe('it creates jobs correctly', () => {
  const job = new mongoose.model('job')({
    parameters: [],});
    it('should be invalid if userId is empty', async () => {
      
      job.validate((err) => {
          expect(err.errors.user_id).to.exist;
          expect(err.errors.user_id.message).equal('UserId required');
        });
    });

    it('should be invalid if robotId is empty', async () => {
      
      job.validate((err) => {
          expect(err.errors.robot_id).to.exist;
          expect(err.errors.robot_id.message).equal('RobotId required');
        });
    });

    it('should be invalid if Status is empty', async () => {
      
      job.validate((err) => {
          expect(err.errors.status).to.exist;
          expect(err.errors.status.message).equal('Status required');
        });
    });
  });
  