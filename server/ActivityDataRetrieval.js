const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

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
    }
    finally {
        await client.close();
    }
}

async function getTasksForApplicationFromDB(application) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();

        const database = client.db('rpaFrameworkCommands');
        const collection = database.collection('completeCollection');

        const listOfApplications = await collection.distinct('Task', { Application: application });
        console.log(listOfApplications);

        return listOfApplications;

    } catch (err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
}

async function getIdForSelectedTask(application, task) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();

        const database = client.db('rpaFrameworkCommands');
        const collection = database.collection('completeCollection');

        const listOfApplications = await collection.findOne({ Application: application, Task: task }); //test out to set parameter to get only the id here already
        console.log(listOfApplications);

        return listOfApplications._id;
    } catch (err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
}

module.exports = { getDistinctApplicationsFromDB, getTasksForApplicationFromDB, getIdForSelectedTask };