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
  
    let firstInputFirstTask = new Variable({ Name: 'taste', Type: 'String', Required: true });
    let secondInputFirstTask = new Variable({ Name: 'isHealthy', Type: 'Boolean', Required: false });
    let firstTestTask = new Task({ 
      Application: 'My fancy Cookbook', 
      Task: 'Taste Recipe', 
      Code:'Taste Recipe', 
      InputVars: [ firstInputFirstTask, secondInputFirstTask ] });
  
    let firstInputSecondTask = new Variable({ Name: 'testVar', Type: 'String', Required: true });
    let secondInputSecondTask = new Variable({ Name: 'anotherVar', Type: 'String', Required: true });
    let thirdInputSecondTask = new Variable({ Name: 'lastInput', Type: 'String', Required: true });
    let singleOutputSecondTask = new Variable({ Name: 'outputVar', Type: 'String', Required: true, InfoText: 'Output variable' });
  
    let secondTestTask = new Task({ 
      Application: 'Fancy Sales App', 
      Task: 'Open Fancy Table', 
      Code:'Open Fancy Table', 
      InputVars: [ firstInputSecondTask, secondInputSecondTask, thirdInputSecondTask ], 
      Output: singleOutputSecondTask });
  
    return [ firstTestTask, secondTestTask ];
  }
}

module.exports = DBManager;
