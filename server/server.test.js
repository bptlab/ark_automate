const express = require('express');
const serverRoutes = require('./routes/rpaFramework'); 
const request = require('supertest');
const DbManager = require('./utils/TestingUtils/MongoDbManager');

describe('Test DB-request-routes', () => {
    const app = express();
    app.use('/rpa-framework', serverRoutes);
    const dbman = new DbManager();
    
    beforeAll(() => dbman.start());
    afterAll(() => dbman.stop());

    test('get available applications', async () => {
        const { body } = await request(app).get('/rpa-framework/commands/get-available-applications'); 
        expect.assertions(3);
        expect(body).toHaveLength(2);
        expect(body).toContain('My fancy Cookbook');
        expect(body).toContain('Fancy Sales App');
    });

    test('pass application parameter', async () => {
        const { body } = await request(app).get('/rpa-framework/commands/get-available-tasks-for-application?application=Fancy+Sales+App'); 
        expect.assertions(2);
        expect(body).toHaveLength(1);
        expect(body).toContain('Open Fancy Table');
    });

    test('pass unavailable application parameter', async () => {
      const { body } = await request(app).get('/rpa-framework/commands/get-available-tasks-for-application?application=FancyStreamingService');
      expect.assertions(1);
      expect(body).toHaveLength(0);
    });

    test('get IO for selected task and app', async () => {
      const { body } = await request(app).get('/rpa-framework/commands/get-vars-for-task?application=Fancy+Sales+App&task=Open+Fancy+Table');
      expect.assertions(10);
      expect(body).toHaveProperty('InputVars');
      expect(body.InputVars).toHaveLength(3);
      expect(body.InputVars[0].Type).toEqual('String');
      expect(body.InputVars[1].Type).toEqual('String');
      expect(body.InputVars[2].Type).toEqual('String');

      expect(body).toHaveProperty('Output');
      expect(body.Output).toHaveProperty('Name');
      expect(body.Output).toHaveProperty('Type');
      expect(body.Output).toHaveProperty('Required');
      expect(body.Output).toHaveProperty('InfoText');
    });

    test('get IO for task with unavailable app', async () => {
      const { body } = await request(app).get('/rpa-framework/commands/get-vars-for-task?application=Netflix&task=Open+Browser');
      expect.assertions(1);
      expect(body).toBeFalsy();
    });
});
