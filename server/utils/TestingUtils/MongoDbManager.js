const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const rpaModels = require('../../models/rpaTaskModel');

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000);

class DBManager {
  constructor() {
    this.server = new MongoMemoryServer(
        {
            instance : {
                dbName : 'rpaFrameworkCommands'
            }
        });
  }

  // Spin up a new in-memory mongo instance
  async start() {
    const url = await this.server.getUri();
    process.env.MONGODB_URI = url;

    const conn = await mongoose.createConnection(); // just create connection instance
    const Tasks = conn.model('rpa-tasks'); // define model
    conn.openUri(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    Tasks.createCollection()
      .then(() => {
        Tasks.insertMany(this.mockDocuments());
      });
  }

  // Close the connection and halt the mongo instance
  stop() {
    mongoose.disconnect();
    return this.server.stop();
  }

  mockDocuments() {
    const Task = mongoose.model('rpa-tasks');
    const Variable = mongoose.model('rpa-tasks-variable');
  
    let var1 = new Variable({ Name: 'taste', Type: 'String', Required: true });
    let var2 = new Variable({ Name: 'isHealthy', Type: 'Boolean', Required: false });
    let task1 = new Task({ Application: 'My fancy Cookbook', Task: 'Taste Recipe', Code:'Taste Recipe', InputVars: [ var1, var2 ] });
  
    let var3 = new Variable({ Name: 'testVar', Type: 'String', Required: true });
    let var4 = new Variable({ Name: 'anotherVar', Type: 'String', Required: true });
    let var5 = new Variable({ Name: 'lastInput', Type: 'String', Required: true });
    let var6 = new Variable({ Name: 'outputVar', Type: 'String', Required: true, InfoText: 'Output variable' });
  
    let task2 = new Task({ Application: 'Fancy Sales App', Task: 'Open Fancy Table', Code:'Open Fancy Table', InputVars: [ var3, var4, var5 ], Output: var6 });
  
    return [ task1, task2 ];
  }
}

module.exports = DBManager;
