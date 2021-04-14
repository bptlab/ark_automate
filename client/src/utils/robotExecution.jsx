import {
  getParameterForRobotFromDB,
  getAttributesFromDB,
} from './attributeAndParamUtils';

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
  const attributes = await getAttributesFromDB(robotId);
  const activitiesAreCorrect = configuredRobotActivitesCorrectly(
    await attributes.json()
  );

  const parameters = await getParameterForRobotFromDB(robotId);
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
