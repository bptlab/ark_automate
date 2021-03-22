const userId = '604a3ba6561e2d1fad4eda60';
const ssotId = '604a3ba6561e2d1fad4eda10';

const testSsot = {
  _id: ssotId,
  starterId: 'starterId',
  robotName: 'testRobot',
  elements: [
    {
      type: 'MARKER',
      name: 'StartEvent',
      predecessorIds: [],
      successorIds: [],
    },
  ],
};

const testUserAccessObject = {
  AccessLevel: '0',
  robotId: '604a3ba6561e2d1fad4eda10',
  userId,
};

module.exports = { testSsot, testUserAccessObject, userId, ssotId };
