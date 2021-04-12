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
  Array.prototype.forEach.call(attributeObjects, (attributeObject) => {
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
  const data1 = await getAttributesFromDB(robotId);
  const areActivitiesCorrect = configuredRobotActivitesCorrectly(
    await data1.json()
  );

  const data2 = await getParameterForRobotFromDB(robotId);
  const areParamsCorrect = configuredRobotParamsCorrectly(await data2.json());

  console.log(areActivitiesCorrect, 'DAS LIEGT AN AKITIVTÄT');
  console.log(areParamsCorrect, 'DAS LIEGT AN PARAMS');
  if (areActivitiesCorrect && areParamsCorrect) {
    return true;
  }

  return false;
};

export {
  isRobotExecutable,
  configuredRobotParamsCorrectly,
  configuredRobotActivitesCorrectly,
};
