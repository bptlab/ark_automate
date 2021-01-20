const express = require('express');
const serverRoutes = require('./routes/rpaFramework'); 
const request = require('supertest');
const DbManager = require('./utils/TestingUtils/MongoDbManager');
const DbTestingMatchers = require('./utils/TestingUtils/DbTestingMatchers');

describe('Test DB-request-routes', () => {
    const app = express();
    app.use('/rpa-framework', serverRoutes);
    const dbman = new DbManager();

    beforeAll(() => dbman.start());
    afterAll(() => dbman.stop());

    test('get available applications', async () => {
        const { body } = await request(app).get('/rpa-framework/commands/get-available-applications'); 
        DbTestingMatchers.matchAvailableApplications(body);
    });

    test('pass application parameter', async () => {
        const { body } = await request(app).get('/rpa-framework/commands/get-available-tasks-for-application?application=Browser'); 
        DbTestingMatchers.matchAvailableTasksForApplication(body);
    });

    test('pass unavailable application parameter', async () => {
      const { body } = await request(app).get('/rpa-framework/commands/get-available-tasks-for-application?application=Netflix');
      DbTestingMatchers.matchAvailableTasksForUnavailableApplication(body);
    });

    test('get IO for selected task and app', async () => {
      const { body } = await request(app).get('/rpa-framework/commands/get-vars-for-task?application=Browser&task=Open+Browser');
      DbTestingMatchers.matchIOForProvidedAppAndTask(body);
    });

    test('get IO for task with unavailable app', async () => {
      const { body } = await request(app).get('/rpa-framework/commands/get-vars-for-task?application=Netflix&task=Open+Browser');
      DbTestingMatchers.matchIOForProvidedTaskWithAppUnavailable(body);
    });
});
