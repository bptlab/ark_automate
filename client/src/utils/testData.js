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

export {
  paramObject1,
  paramObject2,
  paramObjectWithLaterSpecifiedUserInput,
  paramObjectWithoutRequiredValue,
  attributeObject1,
  attributeObject2,
  attributeObjectWithEmptyApplication,
  attributeObjectWithEmptyTask,
};
