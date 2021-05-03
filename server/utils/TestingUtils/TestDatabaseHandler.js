const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongooseOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const mongod = new MongoMemoryServer({
  instance: {
    dbName: 'ark-automate',
    port: 59051,
  },
});

/**
 * Connect to the in-memory database.
 */
exports.connect = async () => {
  const uri = await mongod.getUri();
  await mongoose.createConnection(uri, mongooseOpts);
  await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drop database, close the connection and stop mongod.
 */
exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
exports.clearDatabase = async () => {
  const { collections } = mongoose.connection;

  // fix according to https://docs.w3cub.com/eslint/rules/no-await-in-loop.html
  const result = [];
  for (const key in collections) {
    const collection = collections[key];
    result.push(collection.deleteMany());
  }
  return Promise.all(result);
};
