import { getParameterFromDB } from './attributeAndParamUtils';

const retrieveRobotInformation = async (robotId) => getParameterFromDB(robotId);

const checkParamsForExecutability = (parameterObjects) => {
  let executability = true;
  parameterObjects.forEach((parameterObject) => {
    parameterObject.rpaParameters.forEach((parameter) => {
      if (parameter.isRequired === true && parameter.value === '') {
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

const isRobotExecutable = (robotId) => {
  const response = true;
  retrieveRobotInformation(robotId).then((parametersForRobot) => {
    checkParamsForExecutability(parametersForRobot);
    // response = checkForExecutability(parametersForRobot);
  });
  return response;
};

export { isRobotExecutable, checkParamsForExecutability };
