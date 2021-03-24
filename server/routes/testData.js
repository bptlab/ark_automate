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

module.exports = {
  testSsot,
  testUserAccessObject,
  userId,
  ssotId,
  testRpaTask1,
  testRpaTask2,
  testRpaTask3,
};
