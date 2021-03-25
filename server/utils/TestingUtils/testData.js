const userId = '604a3ba6561e2d1fad4eda60';
const user2Id = '604a3ba6561e2d1fad4eda00';

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

const testUserAccessObject2 = {
  AccessLevel: '0',
  robotId: '604a3ba6561e2d1fad4eda11',
  userId: user2Id,
};

const testRpaTask1 = {
  Application: 'Browser',
  Task: 'Click Button',
  Code: 'Click Button',
  inputVars: [{ modifier: 'Boolean', locator: 'String' }],
  outputVars: {},
};

const testRpaTask2 = {
  Application: 'Excel',
  Task: 'Input Text',
  Code: 'Input Text',
  inputVars: [{ locator: 'String', text: 'String', clear: 'Boolean' }],
  outputVars: {},
};

const testRpaTask3 = {
  Application: 'Browser',
  Task: 'Input Password',
  inputVars: [{ locator: 'String', password: 'String', clear: 'Boolean' }],
  outputVars: {},
};

const testJob = {
  _id: '605c68a86d596e0d6bed0077',
  __v: 0,
  user_id: userId,
  robot_id: '604a3ba6561e2d1fad4eda10',
  status: 'waiting',
  parameters: [],
};

module.exports = {
  testSsot,
  testUserAccessObject,
  testUserAccessObject2,
  userId,
  user2Id,
  ssotId,
  testRpaTask1,
  testRpaTask2,
  testRpaTask3,
  testJob,
};
