/**
 * @category Server
 * @module
 */
const { MongoClient } = require('mongodb');

/**
 * @description Will send out request to external MongoDB Database to retrieve all distinct Applications available
 * @returns {List} List of Application Names found in MongoDB
 */
async function getDistinctApplicationsFromDB() {
  const client = createNewClient();
  try {
    const database = await establishDbConnection(client, 'rpaFrameworkCommands');
    const collection = database.collection('completeCollection');
    const listOfApplications = await collection.distinct('Application');

    return listOfApplications;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

/**
 * @description Will send out request to externel MongoDB Database to retrieve all available Tasks for a given Application
 * @param {string} application String of an Applications Name to search available Tasks for
 * @returns {List} List of Task Names found in MongoDB for the specified Application
 */
async function getTasksForApplicationFromDB(application) {
  const client = createNewClient();
  try {
    const database = await establishDbConnection(client, 'rpaFrameworkCommands');
    const collection = database.collection('completeCollection');

    const listOfTasks = await collection.distinct('Task', {
      Application: application,
    });

    return listOfTasks;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

/**
 * @description Will send out request to external MongoDB Database 
 * to retrieve input and output variables for the selected application, task tuple
 * @param {string} application Application to search in
 * @param {string} task Task of that Application to search for
 * @returns {Object} Object with inputVars and outputVars as properties, each containing 
 * another Object with the retrieved values
 */
async function getInputOutputForSelectedTask(application, task) {
  const client = createNewClient();
  try {
    const database = await establishDbConnection(client, 'rpaFrameworkCommands');
    const collection = database.collection('completeCollection');

    const IoObjectForTask = await collection.findOne({
      Application: application,
      Task: task,
    }, {
      projection: {
        'inputVars': 1,
        'outputVars': 1
      }
    }); 

    return IoObjectForTask;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

/**
 * @description This method is a helper which will provide a new database from mongodb after connecting to it
 * @param {string} databaseName The name of the database to connect to
 * @returns {Object} The database object
 */
async function establishDbConnection(client, databaseName) {
  try {
    await client.connect();
    return database = client.db(databaseName);

  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Utility method to provide a new client
 * @returns {Object} The mongodb client object
 */
function createNewClient() {
  return client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  getDistinctApplicationsFromDB,
  getTasksForApplicationFromDB,
  getInputOutputForSelectedTask,
};
