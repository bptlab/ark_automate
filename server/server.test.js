const express = require("express");
const serverRoutes = require("./routes/rpaFramework"); 
const request = require("supertest");
const DBManager = require('./utils/TestingUtils/MongoDbManager');
const DbTestingMatchers = require('./utils/TestingUtils/DbTestingMatchers');

describe('Test DB-request-routes', () => {
    const app = express();
    app.use('/rpa-framework', serverRoutes);
    const dbman = new DBManager();

    beforeAll(() => dbman.start());
    afterAll(() => dbman.stop());

    it("attemp to get applications", async () => {
        const { body } = await request(app).get("/rpa-framework/commands/get-available-applications"); 
        DbTestingMatchers.matchAvailableApplications(body);
    });

    it('pass application parameter', async () => {
        const { body } = await request(app).get("/rpa-framework/commands/get-available-tasks-for-application?application=Browser"); 
        DbTestingMatchers.matchAvailableTasksForApplication(body);
    });

    it('pass unavailable application parameter', async () => {
      const { body } = await request(app).get("/rpa-framework/commands/get-available-tasks-for-application?application=Netflix");
      DbTestingMatchers.matchAvailableTasksForUnavailableApplication(body);
    });

    it('get IO for selected task and app', async () => {
      const { body } = await request(app).get("/rpa-framework/commands/get-vars-for-task?application=Browser&task=Open+Browser");
      DbTestingMatchers.matchIOForProvidedAppAndTask(body);
    });

    it('get IO for task with unavailable app', async () => {
      const { body } = await request(app).get("/rpa-framework/commands/get-vars-for-task?application=Netflix&task=Open+Browser");
      DbTestingMatchers.matchIOForProvidedTaskWithAppUnavailable(body);
    });
});
