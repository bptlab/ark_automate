const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * @category Server
 * @module
 */
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
 * @description Connects to the in-memory database.
 */
exports.connect = async () => {
  const uri = await mongod.getUri();
  await mongoose.createConnection(uri, mongooseOpts);
  await mongoose.connect(uri, mongooseOpts);
};

/**
 * @description Drops the database, closes the connection and stops mongod.
 */
exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoose.disconnect();
  await mongod.stop();
};

/**
 * @description Removes all the data for all db collections.
 */
exports.clearDatabase = async () => {
  const { collections } = mongoose.connection;
  const result = [];
  Object.keys(collections).forEach((key) => {
    const collection = collections[key];
    result.push(collection.deleteMany());
  });
  return Promise.all(result);
};
