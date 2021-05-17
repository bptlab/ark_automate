import { getAllParametersForRobot } from '../../../../api/routes/robots/rpaParameterRetrieval';
import { getAllAttributes } from '../../../../api/routes/robots/rpaAttributeRetrieval';

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
 * @description For each activity of the current robot get the id, the name and all the parameters that require a user input
 * @param {String} robotId Id of the robot for which we want to get all parameters
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
