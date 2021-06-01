const testUserId = '604a3ba6561e2d1fad4eda60';
const user2Id = '604a3ba6561e2d1fad4eda00';

const testRobotId = '606199015d691786a44a608f';
const testJobId = '605c68a86d596e0d6bed0077';

const testSsot = {
  id: testRobotId,
  _id: testRobotId, // needed because we sometimes access the id with _id, sometimes with id
  starterId: 'Event_1wm4a0f',
  robotName: 'Sandros Testbot',
  elements: [
    {
      predecessorIds: [],
      successorIds: ['Activity_1elomab'],
      _id: '6062f0ad92ffd3044c6ee382',
      type: 'MARKER',
      name: 'Start Event',
      id: 'Event_1wm4a0f',
    },
    {
      predecessorIds: ['Event_1wm4a0f'],
      successorIds: ['Activity_175v5b5'],
      _id: '6062f0ad92ffd3044c6ee383',
      type: 'INSTRUCTION',
      name: 'FirstActivity',
      id: 'Activity_1elomab',
    },
    {
      predecessorIds: ['Activity_1elomab'],
      successorIds: ['Activity_1x8wlwh'],
      _id: '6062f0ad92ffd3044c6ee384',
      type: 'INSTRUCTION',
      name: 'SecondActivity',
      id: 'Activity_175v5b5',
    },
    {
      predecessorIds: ['Activity_175v5b5'],
      successorIds: ['Event_1cuknwt'],
      _id: '6062f0ad92ffd3044c6ee385',
      type: 'INSTRUCTION',
      name: 'ThirdActivity',
      id: 'Activity_1x8wlwh',
    },
    {
      predecessorIds: ['Activity_1x8wlwh'],
      successorIds: [],
      _id: '6062f0ad92ffd3044c6ee386',
      type: 'MARKER',
      name: 'finished',
      id: 'Event_1cuknwt',
    },
  ],
};

const testUserAccessObject = {
  accessLevel: '0',
  robotId: testRobotId,
  userId: testUserId,
};

const testUserAccessObject2 = {
  accessLevel: '0',
  robotId: '604a3ba6561e2d1fad4eda11',
  userId: user2Id,
};

const numberOfTestTasks = 5;
const testRpaTask1 = {
  application: 'Browser',
  task: 'Click Button',
  code: 'Click Button',
  outputValue: false,
  inputVars: [
    {
      name: 'path',
      type: 'String',
      isRequired: true,
      infoText: 'Path to button',
      index: 0,
    },
  ],
};

const testRpaTask2 = {
  application: 'Excel',
  task: 'Input Text',
  code: 'Input Text',
  outputValue: false,
  inputVars: [
    {
      name: 'coloumn',
      type: 'Integer',
      isRequired: true,
      infoText: 'Target Coloumn',
      index: 0,
    },
    {
      name: 'row',
      type: 'Integer',
      isRequired: true,
      infoText: 'Target row',
      index: 1,
    },
  ],
};

const testRpaTask3 = {
  application: 'Browser',
  task: 'Input Password',
  code: 'Input Password',
  outputValue: false,
  inputVars: [
    {
      name: 'password',
      type: 'String',
      isRequired: true,
      infoText: 'password',
      index: 0,
    },
  ],
};

const testRpaTask4 = {
  application: 'Excel.Application',
  task: 'Open Workbook',
  code: 'Open Workbook',
  outputValue: false,
  inputVars: [
    {
      name: 'path',
      type: 'String',
      isRequired: true,
      infoText: 'path',
      index: 0,
    },
  ],
};

const testRpaTask5 = {
  application: 'Excel.Files',
  task: 'Open Workbook',
  code: 'Open Workbook',
  outputValue: false,
  inputVars: [
    {
      name: 'path',
      type: 'String',
      isRequired: true,
      infoText: 'path',
      index: 0,
    },
  ],
};

const testJob = {
  _id: testJobId,
  __v: 0,
  userId: testUserId,
  robotId: testRobotId,
  status: 'waiting',
  parameters: [
    {
      _id: '60780432cb11ef12444785ee',
      parameterId: '6062f0ad92ffd3044c6ee387',
      value: 'TESTVALUE',
    },
  ],
  loggedErrors: [],
};

const testAttributes1 = {
  _id: '6062f0ad1abb38158c2dfa41',
  activityId: 'Activity_1elomab',
  robotId: testRobotId,
  rpaApplication: 'Excel.Application',
  rpaTask: 'Open Workbook',
  __v: 0,
};

const testAttributes2 = {
  _id: '6062f0ad1abb38158c2dfa42',
  activityId: 'Activity_175v5b5',
  robotId: testRobotId,
  rpaApplication: 'Excel.Application',
  rpaTask: 'Find Empty Row',
  __v: 0,
};

const testAttributes3 = {
  _id: '6062f0ad1abb38158c2dfa43',
  activityId: 'Activity_1x8wlwh',
  robotId: testRobotId,
  rpaApplication: 'Browser',
  rpaTask: 'Open Browser',
  __v: 0,
};

const testParameter1 = {
  _id: '6062f0ad1abb38158c2dfa69',
  __v: 0,
  activityId: 'Activity_1elomab',
  robotId: '606199015d691786a44a608f',
  rpaParameters: [
    {
      _id: '6062f0ad92ffd3044c6ee389',
      name: 'filename',
      type: 'String',
      isRequired: true,
      infoText: 'Path to filename',
      index: 0,
      value: 'C://Users/Filepath',
    },
  ],
};

const testParameter2 = {
  _id: '6062f0ad1abb38158c2dfa68',
  __v: 0,
  activityId: 'Activity_175v5b5',
  robotId: '606199015d691786a44a608f',
  rpaParameters: [
    {
      _id: '6062f0ad92ffd3044c6ee388',
      name: 'filename',
      type: 'String',
      isRequired: true,
      infoText: 'Find Empty Row',
      index: 0,
      value: 'StonksOnlyGoUp.xls',
    },
  ],
};

const testParameter3 = {
  _id: '6062f0ad1abb38158c2dfa67',
  __v: 0,
  activityId: 'Activity_1x8wlwh',
  robotId: testRobotId,
  rpaParameters: [
    {
      _id: '6062f0ad92ffd3044c6ee387',
      name: 'save_changes',
      type: 'Boolean',
      isRequired: true,
      infoText: 'Open Browser',
      index: 0,
      value: 'http://localhost:3000',
      requireUserInput: true,
    },
  ],
};

const testRobotCode =
  '*** Settings *** Library    RPA.Excel.Application Library    RPA.Browser *** Tasks *** FirstActivity RPA.Excel.Application.Open Workbook    C://Users/Filepath SecondActivity Find Empty Row    StonksOnlyGoUp.xls ThirdActivity Open Browser    TESTVALUE';

const failingRobotRunLog = {
  robotRun: {
    name: 'DanielTest2',
    activityCount: 8,
    activities: [
      {
        activityName: 'Browser1',
        tasks: [{ taskName: 'Open Chrome Browser', status: 'PASS' }],
        status: 'PASS',
        message: '',
      },
      {
        activityName: 'Say hello',
        tasks: [{ taskName: 'Open Workbook', status: 'PASS' }],
        status: 'PASS',
        message: '',
      },
      {
        activityName: 'Say Goodbye!',
        tasks: [
          { taskName: 'Set Worksheet Value', status: 'PASS' },
          { taskName: 'Set Worksheet Value', status: 'PASS' },
        ],
        status: 'PASS',
        message: '',
      },
      {
        activityName: 'Browser2',
        tasks: [{ taskName: 'Open Chrome Browser', status: 'PASS' }],
        status: 'PASS',
        message: '',
      },
      {
        activityName: 'Browser3',
        tasks: [
          { taskName: 'Open Chro Browser', status: 'FAIL' },
          { taskName: 'Set Worksheet Value', status: 'NOT RUN' },
        ],
        status: 'FAIL',
        message:
          "No keyword with name 'Open Chro Browser' found. Did you mean:\n    RPA.Browser.Selenium.Open Chrome Browser",
      },
      {
        activityName: 'Interrupt',
        tasks: [{ taskName: 'Set Worksheet Value', status: 'PASS' }],
        status: 'PASS',
        message: '',
      },
      {
        activityName: 'Browser4',
        tasks: [
          { taskName: 'Open Chrome Browser', status: 'PASS' },
          { taskName: 'Set Worksheet Value', status: 'PASS' },
        ],
        status: 'PASS',
        message: '',
      },
      {
        activityName: 'Save file',
        tasks: [{ taskName: 'Save Workbook', status: 'FAIL' }],
        status: 'FAIL',
        message: 'Test Failing Message',
      },
    ],
    status: 'FAIL',
  },
  finalMessage: 'Execution completed',
};

module.exports = {
  testSsot,
  testUserAccessObject,
  testUserAccessObject2,
  testUserId,
  user2Id,
  testRobotId,
  numberOfTestTasks,
  testRpaTask1,
  testRpaTask2,
  testRpaTask3,
  testRpaTask4,
  testRpaTask5,
  testJob,
  testJobId,
  testAttributes1,
  testAttributes2,
  testAttributes3,
  testParameter1,
  testParameter2,
  testParameter3,
  testRobotCode,
  failingRobotRunLog,
};
