import { getAllParametersForRobot } from '../../../../api/routes/robots/rpaParameter';
import { getAllAttributes } from '../../../../api/routes/robots/rpaAttributes';

/**
 * @category Frontend
 * @module
 */

/**
 * @description Will return a boolean regarding the correct configuration of the given parameterObejcts belonging to a robot.
 * If a paramter is required and no value is passed and the value will not be specified later by the user, the paramter is not correctly configured.
 * @param {Object[]} parameterObjects Array of parameterObjects that will be checked
 * @returns {boolean} Boolean value regarding the correctness of the parameter configuration
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
          'Required parameter not specified in paramter',
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
 * @param {Object[]} attributeObjects Array of attributeObjects that will be checked
 * @returns {boolean} A boolean value regarding the correctness of the attribute configuration
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
 * @param {String} robotId RobotId of the robot that will be checked
 * @returns {boolean} Boolean value regarding the executability of the robot
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

/**
 * @description Get the id, the name and all the parameters for each activity of the current robot that require a user input
 * @param {String} robotId Id of the robot for which all parameters will be retrieved
 * @param {Function} setParameterList Setter function for the component state parameterList
 * @param {Object} isMounted Describes if the component is currently mounted or not
 */
const getActivityAndParameterInformation = (
  robotId,
  setParameterList,
  isMounted
) => {
  getAllParametersForRobot(robotId)
    .then((response) => response.json())
    .then((parameterObjects) => {
      if (parameterObjects.length > 0) {
        const activityInformationList = [];
        parameterObjects.forEach((parameterObject) => {
          const { activityId } = parameterObject;
          let activityName = '';
          const ssot = JSON.parse(sessionStorage.getItem('ssotLocal'));
          ssot.elements.forEach((element) => {
            if (element.id === activityId) {
              activityName = element.name;
            }
          });
          const activityParameter = [];
          parameterObject.rpaParameters.forEach((parameter) => {
            if (parameter.requireUserInput) {
              activityParameter.push(parameter);
            }
          });
          if (activityParameter.length > 0) {
            const activityInformation = {
              activityId,
              activityParameter,
              activityName,
            };
            activityInformationList.push(activityInformation);
          }
        });

        if (isMounted.current) {
          setParameterList(activityInformationList);
        }
      }
    });
};

// eslint-disable-next-line import/prefer-default-export
export {
  getActivityAndParameterInformation,
  isRobotExecutable,
  configuredRobotParamsCorrectly,
  configuredRobotActivitesCorrectly,
};
