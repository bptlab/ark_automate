const correctSettingsSection =
  '*** Settings ***\nLibrary    RPA.Excel.Application\nLibrary    RPA.HTTP';
const correctTaskSection =
  '*** Tasks ***\nactivity One\n    Open Application    %%visible%%    TestPETER';
const taskAndApplicationCombinations = [
  {
    _id: '6061d5627dee5516b3824ade',
    Application: 'Excel.Application',
    Task: 'Open Application',
    Code: 'Open Application',
    outputValue: false,
    inputVars: [
      {
        name: 'visible',
        type: 'Boolean',
        isRequired: false,
        infoText: 'Show window after opening',
        index: 0,
      },
      {
        name: 'display_alerts',
        type: 'Boolean',
        isRequired: false,
        infoText: 'Show alert popups',
        index: 1,
      },
    ],
  },
  {
    _id: '6062e52f241bffc33838f279',
    Application: 'HTTP',
    Task: 'Get Request',
    Code: 'Get Request',
    outputValue: false,
    inputVars: [
      {
        name: 'alias',
        type: 'String',
        isRequired: true,
        infoText:
          ' That will be used to identify the Session object in the cache',
        index: 0,
      },
      {
        name: 'uri',
        type: 'String',
        isRequired: true,
        infoText: 'To send the GET request to',
        index: 1,
      },
      {
        name: 'headers',
        type: 'String',
        isRequired: true,
        infoText: 'A dictionary of headers to use with the request',
        index: 2,
      },
      {
        name: 'data',
        type: 'String',
        isRequired: true,
        infoText: 'Possible value to set, defaults to None',
        index: 3,
      },
      {
        name: 'number_format',
        type: 'String',
        isRequired: true,
        infoText:
          'A dictionary of key-value pairs that will be urlencoded and sent as GET data or binary data that is sent as the raw body content',
        index: 4,
      },
      {
        name: 'json',
        type: 'String',
        isRequired: true,
        infoText:
          'A value that will be json encoded and sent as GET data if data is not specified',
        index: 5,
      },
      {
        name: 'params',
        type: 'String',
        isRequired: true,
        infoText: 'Url parameters to append to the uri',
        index: 6,
      },
      {
        name: 'allow_redirects',
        type: 'Boolean',
        isRequired: true,
        infoText:
          'Set to True if POST/PUT/DELETE redirect following is allowed.',
        index: 7,
      },
      {
        name: 'timeout',
        type: 'String',
        isRequired: true,
        infoText: 'Connection timeout',
        index: 8,
      },
    ],
  },
];
const correctElementsArray = [
  {
    successorIds: ['Activity_0ay5418'],
    id: 'Event_0ay5417',
    type: 'MARKER',
    name: 'START',
    predecessorIds: [],
  },
  {
    successorIds: ['Event_0ay5419'],
    id: 'Activity_0ay5418',
    type: 'INSTRUCTION',
    name: 'activity One',
    predecessorIds: ['Event_0ay5417'],
  },
  {
    successorIds: [],
    id: 'Event_0ay5419',
    type: 'MARKER',
    name: 'END',
    predecessorIds: ['Activity_0ay5418'],
  },
];

const correctInstructionBlocks = [
  {
    rpaApplication: 'Excel.Application',
    name: 'activity One',
    rpaTask: 'Open Application',
    paramArray: ['%%visible%%', 'TestPETER'],
  },
];

export {
  correctSettingsSection,
  correctTaskSection,
  taskAndApplicationCombinations,
  correctElementsArray,
  correctInstructionBlocks,
};
