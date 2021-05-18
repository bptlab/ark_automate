const MOCK_ROBOT_ID = '0123456789abc0815';
const MOCK_CURRENT_ELEMENT_ID = '123450815';
const MOCK_ROBOT_NAME = 'testRobotFromTest';
const MOCK_ROBOT_CONTENT = 'This is a test robots content';
const MOCK_XML = 'testtesttesttest';
const MOCK_PARSER_RESULT = 'parserResult123';
const MOCK_ACTIVITY_ID = '0123456789abc4711';
const MOCK_NEW_VALUE = 'I am a new value';
const MOCK_VALUE = 'cookbookApplication';
const MOCK_APPLICATION = 'cookbookApplication';
const MOCK_SELECTED_APPLICATION = 'CookbookApplication';
const MOCK_PARAMETER_OBJECT = {
  rpaParameters: [
    {
      index: 1,
      name: 'testParam1',
      type: 'Boolean',
      value: 'false',
    },
    {
      index: 0,
      name: 'testParam1',
      type: 'Boolean',
      value: 'true',
    },
  ],
  outputVariable: 'OutputVariableName',
};
const MOCK_INPUTS_RIGHT_ORDER = [
  {
    index: 0,
    name: 'testParam1',
    type: 'Boolean',
    value: 'true',
  },
  {
    index: 1,
    name: 'testParam1',
    type: 'Boolean',
    value: 'false',
  },
];
const MOCK_CURRENT_ELEMENT = {
  id: MOCK_CURRENT_ELEMENT_ID,
  businessObject: { name: 'oldTestName' },
  type: 'bpmn:Task',
};
const MOCK_SELECTED_ELEMENTS = [MOCK_CURRENT_ELEMENT];
const MOCK_ELEMENT_STATE = {
  selectedElements: MOCK_SELECTED_ELEMENTS,
  currentElement: MOCK_CURRENT_ELEMENT,
};
const MOCK_EVENT = {
  target: { value: 'newTestName' },
  newSelection: MOCK_SELECTED_ELEMENTS,
  element: MOCK_CURRENT_ELEMENT,
};
const MOCK_MODELER = {
  get: (itemToGet) => {
    expect(itemToGet).toEqual('modeling');
    return {
      updateLabel: (element, newName) => {
        expect(element).toEqual({
          id: '123450815',
          businessObject: { name: 'newTestName' },
          type: 'bpmn:Task',
        });
        expect(newName).toEqual('newTestName');
      },
    };
  },
  saveXML: async (formatObject) => {
    expect(formatObject).toEqual({ format: true });
    return MOCK_XML;
  },
};

const CONSTANTS = {
  MOCK_ROBOT_ID,
  MOCK_CURRENT_ELEMENT_ID,
  MOCK_ROBOT_NAME,
  MOCK_ROBOT_CONTENT,
  MOCK_XML,
  MOCK_PARSER_RESULT,
  MOCK_ACTIVITY_ID,
  MOCK_NEW_VALUE,
  MOCK_VALUE,
  MOCK_APPLICATION,
  MOCK_SELECTED_APPLICATION,
  MOCK_PARAMETER_OBJECT,
  MOCK_INPUTS_RIGHT_ORDER,
  MOCK_CURRENT_ELEMENT,
  MOCK_SELECTED_ELEMENTS,
  MOCK_ELEMENT_STATE,
  MOCK_EVENT,
  MOCK_MODELER,
};

export default CONSTANTS;
