const mongoose = require('mongoose');
const testData = require('./testData');

const loadSsotInDb = async () => {
  const SsotModel = mongoose.model('SSoT');
  const ssot = new SsotModel(testData.testSsot);
  await ssot.save();
};

const loadUserAccessObjectsInDb = async () => {
  const UserAccessObjectModel = mongoose.model('userAccessObject');
  const userAccessObject = UserAccessObjectModel(testData.testUserAccessObject);
  await userAccessObject.save();
  const userAccessObject2 = UserAccessObjectModel(
    testData.testUserAccessObject2
  );
  await userAccessObject2.save();
};

const loadJobInDb = async () => {
  const JobModel = mongoose.model('job');
  const job = new JobModel(testData.testJob);
  await job.save();
};

const loadAttributesInDb = async () => {
  const RpaAttribute = mongoose.model('rpaAttributes');
  const rpaAttribute = new RpaAttribute(testData.testAttributes1);
  await rpaAttribute.save();
  const rpaAttribute2 = new RpaAttribute(testData.testAttributes2);
  await rpaAttribute2.save();
  const rpaAttribute3 = new RpaAttribute(testData.testAttributes3);
  await rpaAttribute3.save();
};

const loadParametersInDb = async () => {
  const RpaParam = mongoose.model('parameter');
  const rpaParameter = new RpaParam(testData.testParameter1);
  await rpaParameter.save();
  const rpaParameter2 = new RpaParam(testData.testParameter2);
  await rpaParameter2.save();
  const rpaParameter3 = new RpaParam(testData.testParameter3);
  await rpaParameter3.save();
};

const loadTasksInDb = async () => {
  const RpaTask = mongoose.model('rpa-task');
  const rpaTask = await new RpaTask(testData.testRpaTask1);
  await rpaTask.save();
  const rpaTask2 = await new RpaTask(testData.testRpaTask2);
  await rpaTask2.save();
  const rpaTask3 = await new RpaTask(testData.testRpaTask3);
  await rpaTask3.save();
  const rpaTask4 = await new RpaTask(testData.testRpaTask4);
  await rpaTask4.save();
  const rpaTask5 = await new RpaTask(testData.testRpaTask5);
  await rpaTask5.save();
};

module.exports = {
  loadJobInDb,
  loadUserAccessObjectsInDb,
  loadSsotInDb,
  loadAttributesInDb,
  loadParametersInDb,
  loadTasksInDb,
};
