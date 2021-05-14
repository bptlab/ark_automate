/* eslint-disable no-undef */
import {
  configuredRobotParamsCorrectly,
  configuredRobotActivitesCorrectly,
} from './robotExecution';
import {
  paramObject1,
  paramObject2,
  paramObjectWithLaterSpecifiedUserInput,
  paramObjectWithoutRequiredValue,
  attributeObject1,
  attributeObject2,
  attributeObjectWithEmptyApplication,
  attributeObjectWithEmptyTask,
} from './robotExecutionTestData';

describe('Checking robot parameters for Executability', () => {
  it('correctly assigns robot as executable', async () => {
    const correctListOfParameters = [paramObject1, paramObject2];
    const response = configuredRobotParamsCorrectly(correctListOfParameters);
    expect(response).toBe(true);
  });

  it('correctly assigns robot as not executable when required parameter is empty', () => {
    const incorrectListOfParameters = [
      paramObject1,
      paramObjectWithoutRequiredValue,
    ];
    const response = configuredRobotParamsCorrectly(incorrectListOfParameters);
    expect(response).toBe(false);
  });

  it('correctly recognizes a robot as executable if required paramter is empty but is specified later by user input', () => {
    const listOfParameters = [
      paramObject1,
      paramObjectWithLaterSpecifiedUserInput,
    ];
    const response = configuredRobotParamsCorrectly(listOfParameters);
    expect(response).toBe(true);
  });
});

describe('Checking robot attributes for Executability', () => {
  it('correctly assigns robot as executable', () => {
    const correctListOfParameters = [attributeObject1, attributeObject2];
    const response = configuredRobotActivitesCorrectly(correctListOfParameters);
    expect(response).toBe(true);
  });

  it('correctly assigns robot as not executable when application is empty', () => {
    const incorrectListOfParameters = [
      attributeObject1,
      attributeObjectWithEmptyApplication,
    ];
    const response = configuredRobotActivitesCorrectly(
      incorrectListOfParameters
    );
    expect(response).toBe(false);
  });

  it('correctly assigns robot as not executable when task is empty', () => {
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
