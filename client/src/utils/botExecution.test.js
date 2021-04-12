import {
  configuredRobotParamsCorrectly,
  configuredRobotActivitesCorrectly,
} from './botExecution';

const paramObject1 = {
  activityId: 'Activity_0ay88v7',
  ssotId: '60618ee17e82bbf2ca91cbb6',
  rpaParameters: [
    {
      name: 'uri',
      type: 'String',
      isRequired: true,
      infoText: 'To send the GET request to',
      index: 1,
      value: 'https://localhost:3000/',
    },
    {
      name: 'headers',
      type: 'String',
      isRequired: false,
      infoText: 'A dictionary of headers to use with the request',
      index: 2,
      value: '',
    },
    {
      name: 'alias',
      type: 'String',
      isRequired: true,
      infoText:
        ' That will be used to identify the Session object in the cache',
      index: 0,
      value: 'aliasString',
    },
  ],
};

const paramObject2 = {
  activityId: 'Activity_0mgbrvu',
  ssotId: '60619b7b5d691786a44a6093',
  rpaParameters: [
    {
      name: 'path',
      type: 'String',
      isRequired: false,
      infoText:
        'Path to save to. If not given, uses path given when opened or created.',
      index: 0,
      value: 'C:/Users/daniel/Desktop/demo.xlsx',
    },
  ],
};

const paramObjectWithoutRequiredValue = {
  activityId: 'Activity_0mgbrvu',
  ssotId: '60619b7b5d691786a44a6093',
  rpaParameters: [
    {
      name: 'path',
      type: 'String',
      isRequired: true,
      infoText:
        'Path to save to. If not given, uses path given when opened or created.',
      index: 0,
      value: '',
    },
  ],
};

const paramObjectWithWrongType = {
  activityId: 'Activity_0mgbrvu',
  ssotId: '60619b7b5d691786a44a6093',
  rpaParameters: [
    {
      name: 'path',
      type: 'String',
      isRequired: true,
      infoText:
        'Path to save to. If not given, uses path given when opened or created.',
      index: 0,
      value: 0,
    },
  ],
};

const paramObjectWithLaterSpecifiedUserInput = {
  activityId: 'Activity_0mgbrvu',
  ssotId: '60619b7b5d691786a44a6093',
  rpaParameters: [
    {
      name: 'path',
      type: 'String',
      requireUserInput: true,
      isRequired: true,
      infoText:
        'Path to save to. If not given, uses path given when opened or created.',
      index: 0,
      value: '',
    },
  ],
};

const attributeObject1 = {
  activityId: 'Activity_1kwfds7',
  ssotId: '60618ee17e82bbf2ca91cbb6',
  rpaApplication: 'Excel.Application',
  rpaTask: 'Quit Excel',
};

const attributeObject2 = {
  activityId: 'Activity_0ay88v7',
  ssotId: '60618ee17e82bbf2ca91cbb6',
  rpaApplication: 'HTTP',
  rpaTask: 'Get Request',
};

const attributeObjectWithEmptyTask = {
  activityId: 'Activity_0ay88v7',
  ssotId: '60618ee17e82bbf2ca91cbb6',
  rpaApplication: 'HTTP',
  rpaTask: '',
};

const attributeObjectWithEmptyApplication = {
  activityId: 'Activity_0ay88v7',
  ssotId: '60618ee17e82bbf2ca91cbb6',
  rpaApplication: '',
  rpaTask: 'Get Request',
};

describe('Checking Bot parameters for Executability', () => {
  it('correctly assigns bot as executable', async () => {
    const correctListOfParameters = [paramObject1, paramObject2];
    const response = configuredRobotParamsCorrectly(correctListOfParameters);
    expect(response).toBe(true);
  });

  it('correctly assigns bot as not executable when required parameter is empty', () => {
    const incorrectListOfParameters = [
      paramObject1,
      paramObjectWithoutRequiredValue,
    ];
    const response = configuredRobotParamsCorrectly(incorrectListOfParameters);
    expect(response).toBe(false);
  });

  it('correctly assigns bot as not executable when parameter is of wrong type', () => {
    const incorrectListOfParameters = [paramObject1, paramObjectWithWrongType];
    const response = configuredRobotParamsCorrectly(incorrectListOfParameters);
    expect(response).toBe(false);
  });

  it('correctly recognizes a bot as executable if required paramter is empty but is specified later by user input', () => {
    const listOfParameters = [
      paramObject1,
      paramObjectWithLaterSpecifiedUserInput,
    ];
    const response = configuredRobotParamsCorrectly(listOfParameters);
    expect(response).toBe(true);
  });
});

describe('Checking Bot attributes for Executability', () => {
  it('correctly assigns bot as executable', () => {
    const correctListOfParameters = [attributeObject1, attributeObject2];
    const response = configuredRobotActivitesCorrectly(correctListOfParameters);
    expect(response).toBe(true);
  });

  it('correctly assigns bot as not executable when application is empty', () => {
    const incorrectListOfParameters = [
      attributeObject1,
      attributeObjectWithEmptyApplication,
    ];
    const response = configuredRobotActivitesCorrectly(
      incorrectListOfParameters
    );
    expect(response).toBe(false);
  });

  it('correctly assigns bot as not executable when task is empty', () => {
    const incorrectListOfParameters = [
      attributeObject1,
      attributeObjectWithEmptyTask,
    ];
    const response = configuredRobotActivitesCorrectly(
      incorrectListOfParameters
    );
    expect(response).toBe(false);
  });
});
