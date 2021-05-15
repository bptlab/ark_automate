import { getAllParametersForRobot } from '../../../api/parameterRetrieval';

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
export { getActivityAndParameterInformation };
