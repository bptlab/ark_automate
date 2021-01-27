const DbManager = require('../../utils/TestingUtils/MongoDbManager');
const DbTestingMatchers = require('../../utils/TestingUtils/DbTestingMatchers');
const ActivityDataRetrieval = require('./ActivityDataRetrieval');

describe('Test methods for callouts to MongoDB', () => {
  const dbman = new DbManager();

  beforeAll(() => dbman.start());
  afterAll(() => dbman.stop());

  test('retrieve available applications from mongoDB', async () => {
    let result = await ActivityDataRetrieval.getDistinctApplicationsFromDB();
    DbTestingMatchers.matchAvailableApplications(result);
  });

  test('get tasks for available application from mongoDB', async () => {
    let result = await ActivityDataRetrieval.getTasksForApplicationFromDB('Browser');
    DbTestingMatchers.matchAvailableTasksForApplication(result);
  });

  test('get tasks for unavailable available application from mongoDB', async () => {
    let result = await ActivityDataRetrieval.getTasksForApplicationFromDB('PinBall');
    DbTestingMatchers.matchAvailableTasksForUnavailableApplication(result);
  });

  test('get IO for selected task', async () => {
    let result = await ActivityDataRetrieval.getInputOutputForSelectedTask('Browser', 'Open Browser');
    DbTestingMatchers.matchIOForProvidedAppAndTask(result);
  });

  test('get IO for selected task where application is not available', async () => {
    let result = await ActivityDataRetrieval.getInputOutputForSelectedTask('PinBall', 'Start Game');
    DbTestingMatchers.matchIOForProvidedTaskWithAppUnavailable(result);
  });
});
