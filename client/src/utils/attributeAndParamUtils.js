/**
 * @category Client
 * @module
 */

/**
 * appTaskLocalStorage
 */

/**
 * @description Will retrieve the value of the input variables name from either session storage,
 * or create a new one and will save it in local session storage.
 * If an existing parameter object has been found there will be a check happening, if the signature matches
 * the one specified for that activities task and application. If not, then something must have been out of sync
 * and a new object will be created and saved to sessionStorage.
 * @param {String} robotId Id of the robot/ssot for which to retrieve the value
 * @param {String} activityId Id of the activity for which to retrieve the value for
 * @returns {Object} The parameter object the activity has
 */
const getParameterObject = (robotId, activityId) => {
  let localParameterStorage = JSON.parse(
    sessionStorage.getItem('parameterLocalStorage')
  );
  let matchingParameterObject = localParameterStorage.find(
    (element) => element.activityId === activityId
  );

  if (matchingParameterObject) {
    const localAttributeStorage = JSON.parse(
      sessionStorage.getItem('attributeLocalStorage')
    );
    const matchingAttributeObject = localAttributeStorage.find(
      (element) => element.activityId === activityId
    );
    const application = matchingAttributeObject.rpaApplication;
    const task = matchingAttributeObject.rpaTask;

    const localComboStorage = JSON.parse(
      sessionStorage.getItem('TaskApplicationCombinations')
    );
    const matchingComboObject = localComboStorage.find(
      (element) => element.Application === application && element.Task === task
    );

    if (
      matchingComboObject &&
      matchingComboObject.inputVars.length &&
      matchingParameterObject.rpaParameters.length
    ) {
      // In the future there could be a need for a more advanced signature check, but fur the current use cases this should be sufficient
      const comboParameterLength = matchingComboObject.inputVars.length;
      const parameterObjectLength =
        matchingParameterObject.rpaParameters.length;
      const comboFirstParamInfoText = matchingComboObject.inputVars.find(
        (element) => element.index === 0
      ).infoText;
      const firstParamInfoText = matchingParameterObject.rpaParameters.find(
        (element) => element.index === 0
      ).infoText;

      if (
        comboParameterLength === parameterObjectLength &&
        comboFirstParamInfoText === firstParamInfoText
      ) {
        return matchingParameterObject;
      }
    }
  }

  localParameterStorage = localParameterStorage.filter(
    (element) => element.activityId !== activityId
  );
  const localAttributeStorage = JSON.parse(
    sessionStorage.getItem('attributeLocalStorage')
  );

  const matchingAttributeObject = localAttributeStorage.find(
    (element) => element.activityId === activityId
  );

  const application =
    matchingAttributeObject !== undefined
      ? matchingAttributeObject.rpaApplication
      : undefined;
  const task =
    matchingAttributeObject !== undefined
      ? matchingAttributeObject.rpaTask
      : undefined;

  if (application && task) {
    const localComboStorage = JSON.parse(
      sessionStorage.getItem('TaskApplicationCombinations')
    );
    const matchingComboObject = localComboStorage.find(
      (element) => element.Application === application && element.Task === task
    );

    const rpaParameters = [];
    if (matchingComboObject && matchingComboObject.inputVars) {
      matchingComboObject.inputVars.forEach((element) => {
        const elementCopy = element;
        elementCopy.value = '';
        rpaParameters.push(elementCopy);
      });
    }

    matchingParameterObject = {
      activityId,
      outputVariable:
        matchingComboObject && matchingComboObject.outputValue
          ? `${activityId}_output`
          : undefined,
      rpaParameters,
      robotId,
    };

    localParameterStorage.push(matchingParameterObject);
    sessionStorage.setItem(
      'parameterLocalStorage',
      JSON.stringify(localParameterStorage)
    );
    return matchingParameterObject;
  }
  return undefined;
};

export {
  getParameterObject, // to be refactored completely seperately
};
