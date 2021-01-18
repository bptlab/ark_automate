const DBManager = require('../../utils/TestingUtils/MongoDbManager');
const DbTestingMatchers = require('../../utils/TestingUtils/DbTestingMatchers');
const ActivityDataRetrieval = require('./ActivityDataRetrieval');

describe('Test methods for callouts to MongoDB', () => {
  const dbman = new DBManager();

  beforeAll(() => dbman.start());
  afterAll(() => dbman.stop());

  it('retrieve available applications from mongoDB', async () => {
    let result = await ActivityDataRetrieval.getDistinctApplicationsFromDB();
    DbTestingMatchers.matchAvailableApplications(result);
  });

  it('get tasks for available application from mongoDB', async () => {
    let result = await ActivityDataRetrieval.getTasksForApplicationFromDB('Browser');
    DbTestingMatchers.matchAvailableTasksForApplication(result);
  });

  it('get tasks for unavailable available application from mongoDB', async () => {
    let result = await ActivityDataRetrieval.getTasksForApplicationFromDB('PinBall');
    DbTestingMatchers.matchAvailableTasksForUnavailableApplication(result);
  });

  it('get IO for selected task', async () => {
    let result = await ActivityDataRetrieval.getInputOutputForSelectedTask('Browser', 'Open Browser');
    DbTestingMatchers.matchIOForProvidedAppAndTask(result);
  });

  it('get IO for selected task where application is not available', async () => {
    let result = await ActivityDataRetrieval.getInputOutputForSelectedTask('PinBall', 'Start Game');
    DbTestingMatchers.matchIOForProvidedTaskWithAppUnavailable(result);
  });
});
