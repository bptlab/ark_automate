import {
  getParameterForRobotFromDB,
  getAttributesFromDB,
} from './attributeAndParamUtils';

const configuredRobotParamsCorrectly = (parameterObjects) => {
  let executability = true;
  Array.prototype.forEach.call(parameterObjects, (parameterObject) => {
    Array.prototype.forEach.call(parameterObject.rpaParameters, (parameter) => {
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
      const requiredType = parameter.type.toLowerCase();
      if (requiredType !== typeof parameter.value && parameter.value !== '') {
        console.error(
          `Required parameter has not specified type. Should be ${requiredType}, but is ${typeof parameter.value}`,
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

const isRobotExecutable = (robotId) => {
  let areActivitiesCorrect;
  let areParamsCorrect;

  getAttributesFromDB(robotId)
    .then((response) => response.json())
    .then((data) => {
      areActivitiesCorrect = configuredRobotActivitesCorrectly(data);
    });

  getParameterForRobotFromDB(robotId)
    .then((response) => response.json())
    .then((data) => {
      areParamsCorrect = configuredRobotParamsCorrectly(data);
    })
    .then(() => {
      if (areActivitiesCorrect && areParamsCorrect) {
        return true;
      }

      console.log(areActivitiesCorrect, 'DAS LIEGT AN AKITIVTÄT');
      console.log(areParamsCorrect, 'DAS LIEGT AN PARAMS');
      return false;
    });
};

export {
  isRobotExecutable,
  configuredRobotParamsCorrectly,
  configuredRobotActivitesCorrectly,
};
