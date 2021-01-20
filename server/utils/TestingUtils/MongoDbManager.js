const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000);

// List all of your collection names here - I'll add some examples
const COLLECTIONS = ['completeCollection'];

class DBManager {
  constructor() {
    this.db = null;
    this.server = new MongoMemoryServer(
        {
            instance : {
                dbName : 'rpaFrameworkCommands'
            }
        });
    this.connection = null;
  }

  // Spin up a new in-memory mongo instance
  async start() {
    const url = await this.server.getUri();
    process.env.MONGODB_URI = url;

    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = this.connection.db(await this.server.getDbName());
    await this.db.createCollection('completeCollection');
    let testDocuments = [
        {"Application":"MS Excel","Task":"Open Application","Code":"Open Application","inputVars":{"visible":"Boolean","display_alerts":"Boolean"}},
        {"Application":"Browser","Task":"Open Browser","Code":"Open Browser","inputVars":{"url":"String","browser":"String","alias":"String","remote_url":"Boolean","desired_capabilities":"String","ff_profile_dir":"String","options":"String","service_log_path":"String","executable_path":"String"}}
    ];
    await this.db.collection('completeCollection').insertMany(testDocuments);
  }

  // Close the connection and halt the mongo instance
  stop() {
    this.connection.close();
    return this.server.stop();
  }

  // Remove all documents from the entire database - useful between tests
  cleanup() {
    return Promise.all(COLLECTIONS.map((c) => this.db.collection(c).deleteMany({})));
  }

  log(input) {
    console.log(input);
  }
}

module.exports = DBManager;
