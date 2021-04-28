/* eslint-disable no-shadow */
/* eslint-disable import/first */
/* eslint-disable no-undef */

jest.mock('../attributeAndParamUtils');
jest.mock('../../api/applicationAndTaskSelection');

import {
  nameChangedHandler,
  applicationChangedHandler,
  taskChangedHandler,
  inputParameterChangeHandler,
  outputVarNameChangeHandler,
  modelerSelectionChangeHandler,
  modelerElementChangeHandler,
} from './modelerSidebarFunctionality';
import {
  setSingleParameter,
  resetRpaApplication,
  setRpaTask,
  getParameterObject,
  setOutputValueName,
} from '../attributeAndParamUtils';
import { fetchTasksFromDB } from '../../api/applicationAndTaskSelection';
import constants from './modelerSidebarFunctionalityTestingUtils';

describe('Sidebar Functionality: Small Utilities', () => {
  it('handle modeler element changed with no new selection', async () => {
    let setElementStateCallCounter = 0;
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
        setElementStateCallCounter += 1;
      },
    };

    modelerElementChangeHandler(constants.MOCK_EVENT, {}, MOCK_SETTER_OBJECT);
    expect(setElementStateCallCounter).toEqual(0);
  });

  it('handle modeler element changed with new selection', async () => {
    let setElementStateCallCounter = 0;
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
        setElementStateCallCounter += 1;
      },
    };

    modelerElementChangeHandler(
      constants.MOCK_EVENT,
      constants.MOCK_ELEMENT_STATE,
      MOCK_SETTER_OBJECT
    );
    expect(setElementStateCallCounter).toEqual(1);
  });

  it('handle output variable name change', async () => {
    setOutputValueName.mockImplementation((activityId, newValue) => {
      expect(activityId).toEqual(constants.MOCK_ACTIVITY_ID);
      expect(newValue).toEqual(constants.MOCK_NEW_VALUE);
    });

    outputVarNameChangeHandler(
      constants.MOCK_ACTIVITY_ID,
      constants.MOCK_NEW_VALUE
    );
  });

  it('handle input parameter change', async () => {
    setSingleParameter.mockImplementation((activityId, value) => {
      expect(activityId).toEqual(constants.MOCK_ACTIVITY_ID);
      expect(value).toEqual(constants.MOCK_VALUE);
    });

    inputParameterChangeHandler(
      constants.MOCK_ACTIVITY_ID,
      constants.MOCK_VALUE
    );
  });

  it('handle modeler name change', async () => {
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
      },
    };

    nameChangedHandler(
      constants.MOCK_EVENT,
      constants.MOCK_MODELER,
      constants.MOCK_ELEMENT_STATE,
      MOCK_SETTER_OBJECT
    );
  });
});

describe('Sidebar Functionality: Modeler Selection Change', () => {
  it('handle modeler selection change; element is not a task', async () => {
    const MOCK_CURRENT_ELEMENT = {
      id: constants.MOCK_CURRENT_ELEMENT_ID,
      businessObject: { name: 'oldTestName' },
      type: 'bpmn:StartEvent',
    };
    const MOCK_SELECTED_ELEMENTS = [MOCK_CURRENT_ELEMENT];
    const MOCK_ELEMENT_STATE = {
      selectedElements: MOCK_SELECTED_ELEMENTS,
      currentElement: MOCK_CURRENT_ELEMENT,
    };
    const MOCK_EVENT = {
      target: { value: 'newTestName' },
      newSelection: MOCK_SELECTED_ELEMENTS,
    };
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: MOCK_SELECTED_ELEMENTS,
          currentElement: MOCK_CURRENT_ELEMENT,
        });
      },
      setOutputVariableName: (newName) => {
        expect(newName).toBeUndefined();
      },
      setvariableList: (newVariableList) => {
        expect(newVariableList).toEqual([]);
      },
    };

    modelerSelectionChangeHandler(
      MOCK_EVENT,
      MOCK_ELEMENT_STATE,
      constants.MOCK_ROBOT_ID,
      MOCK_SETTER_OBJECT
    );
  });

  it('handle modeler selection change; element is a task and no matching attributes found; no attribute obj match found', async () => {
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
      },
      setOutputVariableName: (newName) => {
        expect(newName).toBeUndefined();
      },
      setvariableList: (newVariableList) => {
        expect(newVariableList).toEqual([]);
      },
      setDisableTaskSelection: (disabled) => {
        expect(disabled).toBeTruthy();
      },
    };

    const MOCK_TASK_TO_APPLICATION = [
      {
        activityId: 'nonMatchingId1234',
        robotId: constants.MOCK_ROBOT_ID,
        rpaApplication: constants.MOCK_APPLICATION,
        rpaTask: 'Open Application',
      },
    ];
    sessionStorage.setItem(
      'attributeLocalStorage',
      JSON.stringify(MOCK_TASK_TO_APPLICATION)
    );

    modelerSelectionChangeHandler(
      constants.MOCK_EVENT,
      constants.MOCK_ELEMENT_STATE,
      constants.MOCK_ROBOT_ID,
      MOCK_SETTER_OBJECT
    );
  });

  it('handle modeler selection change; element is a task and no matching attributes found; with attribute obj match found; application already in sessionstorage', async () => {
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
      },
      setSelectedApplication: (value) => {
        expect(value).toEqual(constants.MOCK_APPLICATION);
      },
      setOutputVariableName: (newName) => {
        expect(newName).toBeUndefined();
      },
      setvariableList: (newVariableList) => {
        expect(newVariableList).toEqual([]);
      },
      setTasksForSelectedApplication: (availableTasks) => {
        expect(availableTasks).toEqual(['TestTask']);
      },
      setDisableTaskSelection: (disabled) => {
        expect(disabled).toBeFalsy();
      },
    };

    const MOCK_TASK_TO_APPLICATION = [
      {
        activityId: constants.MOCK_CURRENT_ELEMENT_ID,
        robotId: constants.MOCK_ROBOT_ID,
        rpaApplication: constants.MOCK_APPLICATION,
        rpaTask: 'Open Application',
      },
    ];

    sessionStorage.setItem(
      'attributeLocalStorage',
      JSON.stringify(MOCK_TASK_TO_APPLICATION)
    );

    const taskToApplication = { cookbookApplication: ['TestTask'] };
    sessionStorage.setItem(
      'taskToApplicationCache',
      JSON.stringify(taskToApplication)
    );

    modelerSelectionChangeHandler(
      constants.MOCK_EVENT,
      constants.MOCK_ELEMENT_STATE,
      constants.MOCK_ROBOT_ID,
      MOCK_SETTER_OBJECT
    );
  });

  it('handle modeler selection change; element is a task and no matching attributes found; with attribute obj match found; application not yet in sessionstorage', async () => {
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
      },
      setSelectedApplication: (value) => {
        expect(value).toEqual(constants.MOCK_APPLICATION);
      },
      setOutputVariableName: (newName) => {
        expect(newName).toBeUndefined();
      },
      setvariableList: (newVariableList) => {
        expect(newVariableList).toEqual([]);
      },
      setTasksForSelectedApplication: (availableTasks) => {
        expect(availableTasks).toEqual(['TestTask']);
      },
      setDisableTaskSelection: (disabled) => {
        expect(disabled).toBeFalsy();
      },
    };

    const MOCK_TASK_TO_APPLICATION = [
      {
        activityId: constants.MOCK_CURRENT_ELEMENT_ID,
        robotId: constants.MOCK_ROBOT_ID,
        rpaApplication: constants.MOCK_APPLICATION,
        rpaTask: 'Open Application',
      },
    ];

    fetchTasksFromDB.mockImplementation(async (application) => {
      expect(application).toEqual(constants.MOCK_VALUE);
      return { json: () => ['TestTask'] };
    });

    sessionStorage.setItem(
      'attributeLocalStorage',
      JSON.stringify(MOCK_TASK_TO_APPLICATION)
    );

    const taskToApplication = { recipeApplication: ['TestTask'] };
    sessionStorage.setItem(
      'taskToApplicationCache',
      JSON.stringify(taskToApplication)
    );

    modelerSelectionChangeHandler(
      constants.MOCK_EVENT,
      constants.MOCK_ELEMENT_STATE,
      constants.MOCK_ROBOT_ID,
      MOCK_SETTER_OBJECT
    );
  });
});

describe('Sidebar Functionality: Task Change', () => {
  it('handle task change WITH parameter update', async () => {
    let setOutputVariableNameCallCounter = 0;
    let setvariableListCallCounter = 0;
    const MOCK_SETTER_OBJECT = {
      setOutputVariableName: (newName) => {
        expect(newName === undefined || newName === 'OutputVariableName').toBe(
          true
        );
        setOutputVariableNameCallCounter += 1;
      },
      setvariableList: (parametersInOrder) => {
        expect(parametersInOrder).toEqual(constants.MOCK_INPUTS_RIGHT_ORDER);
        setvariableListCallCounter += 1;
      },
    };

    setRpaTask.mockImplementation(
      (robotId, activityId, selectedApplication, value) => {
        expect(value).toEqual(constants.MOCK_VALUE);
        expect(robotId).toEqual(constants.MOCK_ROBOT_ID);
        expect(activityId).toEqual(constants.MOCK_ACTIVITY_ID);
        expect(selectedApplication).toEqual(
          constants.MOCK_SELECTED_APPLICATION
        );
      }
    );

    getParameterObject.mockImplementation((robotId, activityId) => {
      expect(robotId).toEqual(constants.MOCK_ROBOT_ID);
      expect(activityId).toEqual(constants.MOCK_ACTIVITY_ID);
      return constants.MOCK_PARAMETER_OBJECT;
    });

    taskChangedHandler(
      constants.MOCK_VALUE,
      constants.MOCK_ACTIVITY_ID,
      constants.MOCK_ROBOT_ID,
      constants.MOCK_SELECTED_APPLICATION,
      MOCK_SETTER_OBJECT
    );

    expect(setRpaTask).toHaveBeenCalledTimes(1);
    expect(getParameterObject).toHaveBeenCalledTimes(1);
    expect(setOutputVariableNameCallCounter).toEqual(2);
    expect(setvariableListCallCounter).toEqual(1);
  });

  it('handle task change WITHOUT parameter update', async () => {
    setRpaTask.mockImplementation(
      (robotId, activityId, selectedApplication, value) => {
        expect(value).toBeUndefined();
        expect(robotId).toEqual(constants.MOCK_ROBOT_ID);
        expect(activityId).toEqual(constants.MOCK_ACTIVITY_ID);
        expect(selectedApplication).toEqual(
          constants.MOCK_SELECTED_APPLICATION
        );
      }
    );

    taskChangedHandler(
      undefined,
      constants.MOCK_ACTIVITY_ID,
      constants.MOCK_ROBOT_ID,
      constants.MOCK_SELECTED_APPLICATION,
      {}
    );
    expect(setRpaTask).toHaveBeenCalledTimes(1);
  });
});

describe('Sidebar Functionality: Application Change', () => {
  it('handle application change WITH cache existing', async () => {
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
      },
      setSelectedApplication: (value) => {
        expect(value).toEqual(constants.MOCK_VALUE);
      },
      setOutputVariableName: (newName) => {
        expect(newName).toBeUndefined();
      },
      setvariableList: (newVariableList) => {
        expect(newVariableList).toEqual([]);
      },
      setTasksForSelectedApplication: (availableTasks) => {
        expect(availableTasks).toEqual(['TestTask']);
      },
      setDisableTaskSelection: (disabled) => {
        expect(disabled).toBeFalsy();
      },
    };

    const taskToApplication = { cookbookApplication: ['TestTask'] };
    sessionStorage.setItem(
      'taskToApplicationCache',
      JSON.stringify(taskToApplication)
    );

    resetRpaApplication.mockImplementation(
      (robotId, selectedElementId, value) => {
        expect(value).toEqual(constants.MOCK_VALUE);
        expect(robotId).toEqual(constants.MOCK_ROBOT_ID);
        expect(selectedElementId).toEqual(constants.MOCK_CURRENT_ELEMENT_ID);
      }
    );

    applicationChangedHandler(
      constants.MOCK_VALUE,
      constants.MOCK_ROBOT_ID,
      constants.MOCK_ELEMENT_STATE,
      MOCK_SETTER_OBJECT
    );
    expect(resetRpaApplication).toHaveBeenCalledTimes(1);
  });

  it('handle application change WITHOUT cache existing', async () => {
    const MOCK_VALUE = 'cookbookApplication';
    const MOCK_ROBOT_ID = '0123456789-4711';
    const MOCK_CURRENT_ELEMENT_ID = '123450815';
    const MOCK_CURRENT_ELEMENT = { id: constants.MOCK_CURRENT_ELEMENT_ID };
    const MOCK_SELECTED_ELEMENTS = [constants.MOCK_CURRENT_ELEMENT];
    const MOCK_ELEMENT_STATE = {
      selectedElements: constants.MOCK_SELECTED_ELEMENTS,
      currentElement: constants.MOCK_CURRENT_ELEMENT,
    };
    const MOCK_SETTER_OBJECT = {
      setElementState: (stateObject) => {
        expect(stateObject).toEqual({
          selectedElements: constants.MOCK_SELECTED_ELEMENTS,
          currentElement: constants.MOCK_CURRENT_ELEMENT,
        });
      },
      setSelectedApplication: (value) => {
        expect(value).toEqual(constants.MOCK_VALUE);
      },
      setOutputVariableName: (newName) => {
        expect(newName).toBeUndefined();
      },
      setvariableList: (newVariableList) => {
        expect(newVariableList).toEqual([]);
      },
      setTasksForSelectedApplication: (availableTasks) => {
        expect(availableTasks).toEqual(['lookupRecipe']);
      },
      setDisableTaskSelection: (disabled) => {
        expect(disabled).toBeFalsy();
      },
    };

    const taskToApplication = { recipeApplication: ['TestTask'] };
    sessionStorage.setItem(
      'taskToApplicationCache',
      JSON.stringify(taskToApplication)
    );

    resetRpaApplication.mockImplementation(
      (robotId, selectedElementId, value) => {
        expect(value).toEqual(constants.MOCK_VALUE);
        expect(robotId).toEqual(constants.MOCK_ROBOT_ID);
        expect(selectedElementId).toEqual(constants.MOCK_CURRENT_ELEMENT_ID);
      }
    );

    fetchTasksFromDB.mockImplementation(async (application) => {
      expect(application).toEqual(constants.MOCK_VALUE);
      return { json: () => ['lookupRecipe'] };
    });

    applicationChangedHandler(
      constants.MOCK_VALUE,
      constants.MOCK_ROBOT_ID,
      constants.MOCK_ELEMENT_STATE,
      MOCK_SETTER_OBJECT
    );
    expect(resetRpaApplication).toHaveBeenCalledTimes(1);
    expect(fetchTasksFromDB).toHaveBeenCalledTimes(1);
  });
});
