const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

/**
 * @description Will send out request to externel MongoDB Database to retrieve all distinct Applications available
 * @returns {List} List of Application Names found in MongoDB
 */
async function getDistinctApplicationsFromDB() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();

    const database = client.db('rpaFrameworkCommands');
    const collection = database.collection('completeCollection');

    const listOfApplications = await collection.distinct('Application');
    console.log(listOfApplications);

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
    console.log(listOfTasks);

    return listOfTasks;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

/**
 * @description Will send out request to externel MongoDB Database to retrieve the Id of a specified combination of Application and Task
 * @param {string} application Application to search in
 * @param {string} task Task of that Application to search for
 * @returns {String} Id of the MongoDB Document corresponding to the specified Application and Task
 */
async function getIdForSelectedTask(application, task) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();

    const database = client.db('rpaFrameworkCommands');
    const collection = database.collection('completeCollection');

    const listOfApplications = await collection.findOne({
      Application: application,
      Task: task,
    }); //test out to set parameter to get only the id here already
    console.log(listOfApplications);

    return listOfApplications._id;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

module.exports = {
  getDistinctApplicationsFromDB,
  getTasksForApplicationFromDB,
  getIdForSelectedTask,
};
