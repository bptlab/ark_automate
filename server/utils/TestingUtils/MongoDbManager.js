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
    const Tasks = conn.model('rpa-task'); // define model
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
    const Task = mongoose.model('rpa-task');
    const Variable = mongoose.model('rpa-tasks-variable');
  
    const firstInputFirstTask = new Variable({ Name: 'taste', Type: 'String', Required: true });
    const secondInputFirstTask = new Variable({ Name: 'isHealthy', Type: 'Boolean', Required: false });
    const firstTestTask = new Task({ 
      Application: 'My fancy Cookbook', 
      Task: 'Taste Recipe', 
      Code:'Taste Recipe', 
      InputVars: [ firstInputFirstTask, secondInputFirstTask ] });
  
    const firstInputSecondTask = new Variable({ Name: 'testVar', Type: 'String', Required: true });
    const secondInputSecondTask = new Variable({ Name: 'anotherVar', Type: 'String', Required: true });
    const thirdInputSecondTask = new Variable({ Name: 'lastInput', Type: 'String', Required: true });
    const singleOutputSecondTask = new Variable({ Name: 'outputVar', Type: 'String', Required: true, InfoText: 'Output variable' });
  
    const secondTestTask = new Task({ 
      Application: 'Fancy Sales App', 
      Task: 'Open Fancy Table', 
      Code:'Open Fancy Table', 
      InputVars: [ firstInputSecondTask, secondInputSecondTask, thirdInputSecondTask ], 
      Output: singleOutputSecondTask });
  
    return [ firstTestTask, secondTestTask ];
  }
}

module.exports = DBManager;
