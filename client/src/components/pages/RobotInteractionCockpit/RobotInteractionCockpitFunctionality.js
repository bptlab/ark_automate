import { getAllParametersForRobot } from '../../../api/variableRetrieval';

/**
 * @description For each activity of the current robot get the id, the name and all the parameters that require a user input
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
export { getActivityAndParameterInformation };
