/**
 * @category Server
 * @module
 */
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

/**
 * @description Will send out request to external MongoDB Database to retrieve all distinct Applications available
 * @returns {List} List of Application Names found in MongoDB
 */
async function getDistinctApplicationsFromDB() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();

    const database = client.db('rpaFrameworkCommands');
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
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();

    const database = client.db('rpaFrameworkCommands');
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
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();

    const database = client.db('rpaFrameworkCommands');
    const collection = database.collection('completeCollection');

    const listOfApplications = await collection.findOne({
      Application: application,
      Task: task,
    }, {
      projection: {
        'inputVars': 1,
        'outputVars': 1
      }
    }); 

    return listOfApplications;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

module.exports = {
  getDistinctApplicationsFromDB,
  getTasksForApplicationFromDB,
  getInputOutputForSelectedTask,
};
