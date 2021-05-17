import { getAllAttributes } from '../api/attributeRetrieval';
import { getAllParametersForRobot } from '../api/parameterRetrieval';

/**
 * @description Will return a boolean regarding the correct configuration of the given parameterObejcts belonging to a robot.
 * If a paramter has is required and not value is given and th evalue will not be specified later by the user, the paramter is not correctly configured.
 * @param {Object[]} parameterObjects array of parameterObjects that are to be checked
 * @returns {boolean} a boolean value regarding the correctness of the parameter configuration
 */
const configuredRobotParamsCorrectly = (parameterObjects) => {
  let executability = true;
  parameterObjects.forEach((parameterObject) => {
    parameterObject.rpaParameters.forEach((parameter) => {
      if (
        parameter.isRequired === true &&
        (parameter.requireUserInput === false ||
          parameter.requireUserInput === undefined) &&
        parameter.value === ''
      ) {
        console.error(
          'Required parameter not specified in parameter',
          parameter
        );
        executability = false;
      }
    });
  });
  return executability;
};

/**
 * @description Will return a boolean regarding the correct configuration regarding the given attributeObjects of a robot.
 * If an attribute has no specified application or task, the attribute is not correctly configured.
 * @param {Object[]} attributeObjects array of attributeObjects that are to be checked
 * @returns {boolean} a boolean value regarding the correctness of the attribute configuration
 */
const configuredRobotActivitesCorrectly = (attributeObjects) => {
  let executability = true;
  attributeObjects.forEach((attributeObject) => {
    if (attributeObject.rpaApplication === '') {
      console.error(
        `RPA Application of ${attributeObject.activityId} not specified`,
        attributeObject
      );
      executability = false;
    }
    if (attributeObject.rpaTask === '') {
      console.error(
        `RPA Task of ${attributeObject.activityId} not specified`,
        attributeObject
      );
      executability = false;
    }
  });
  return executability;
};

/**
 * @description Will return a boolean regarding the correct configuration of a robot.
 * If a robot has incorrectly configured attributes or parameters, then the robot is not correctly configured.
 * @param {String} robotId RobotId of the robot that is to be checked
 * @returns {boolean} a boolean value regarding the executability of the robot
 */
const isRobotExecutable = async (robotId) => {
  const attributes = await getAllAttributes(robotId);
  const activitiesAreCorrect = configuredRobotActivitesCorrectly(
    await attributes.json()
  );

  const parameters = await getAllParametersForRobot(robotId);
  const paramsAreCorrect = configuredRobotParamsCorrectly(
    await parameters.json()
  );

  if (activitiesAreCorrect && paramsAreCorrect) {
    return true;
  }
  return false;
};

export {
  isRobotExecutable,
  configuredRobotParamsCorrectly,
  configuredRobotActivitesCorrectly,
};
