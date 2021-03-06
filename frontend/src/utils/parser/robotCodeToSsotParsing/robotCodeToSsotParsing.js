/**
 * @category Frontend
 * @module
 */

import {
  getRobotId,
  getRobotName,
} from '../../sessionStorage/localSsotController/ssot';

import customNotification from '../../componentsFunctionality/notificationUtils';

const FOURSPACE = '    ';

/**
 * @returns {Number} "uniqueId" which is just an increment from the counter in the local storage
 */
const getUniqueId = () => {
  const newId = JSON.parse(sessionStorage.getItem('idCounter')) + 1;
  sessionStorage.setItem('idCounter', newId);
  return newId;
};

/**
 * @returns {String} Unique Id; wrapped with the activity nomenclature
 */
const getActivityId = () => `Activity_0ay${getUniqueId()}`;

/**
 * @returns {String} Unique Id; wrapped with the event nomenclature
 */
const getEventId = () => `Event_0ay${getUniqueId()}`;

/**
 * @description Splits the robot code into an array and deletes all empty lines
 * @param {String} robotCode Code from the code editor
 * @returns {Array} Robot code without empty lines as an array
 */
const getRobotCodeAsArray = (robotCode) => {
  const robotCodeAsArray = robotCode.split('\n');
  for (let i = 0; i < robotCodeAsArray.length; i += 1) {
    if (robotCodeAsArray[i] === '') {
      robotCodeAsArray.splice(i, 1);
      i -= 1;
    }
  }
  return robotCodeAsArray;
};

/**
 * @description Checks all lines of the settings section for the right syntax and returns all declared applications as an array
 * @param {Array} robotCodeSettingsSection All lines from the settings section as an array-entry (typeof string)
 * @returns {Array} All declared applications or undefined if an error occures
 */
const getApplicationArray = (robotCodeSettingsSection) => {
  if (typeof robotCodeSettingsSection === 'undefined') return undefined;
  const robotCode = robotCodeSettingsSection.slice(1);
  const availableApplications = JSON.parse(
    sessionStorage.getItem('availableApplications')
  );
  let errorWasThrown;

  robotCode.forEach((line) => {
    const REGEX_FOR_RPA_ALIAS = /Library +RPA[.][a-zA-Z]+/;

    const elementStartsWithLibrary = line.startsWith('Library ');
    const rpaAliasIsCorrect = REGEX_FOR_RPA_ALIAS.test(line);
    const applicationIsAvailable = availableApplications.includes(
      typeof line.split('RPA.')[1] === 'undefined'
        ? ''
        : line.split('RPA.')[1].trim()
    );

    if (!elementStartsWithLibrary) {
      customNotification(
        'Error',
        `Every line of the "*** Settings ***" Section has to start with "Library"! \nError location: "${line}"`
      );
      errorWasThrown = true;
      return;
    }
    if (!rpaAliasIsCorrect) {
      customNotification(
        'Error',
        `Application has to start with "RPA." \nError location: "${line}"`
      );
      errorWasThrown = true;
      return;
    }
    if (!applicationIsAvailable) {
      customNotification(
        'Error',
        `The Application "${String(
          line.split('RPA.')[1].trim()
        )}" is currently not supported. `
      );
      errorWasThrown = true;
    }
  });

  const declaredApplications = errorWasThrown
    ? undefined
    : robotCode.map((line) => line.split('RPA.')[1].trim());

  return declaredApplications;
};

/**
 * @description Retrieves the outputVariable name from the current code line
 * @param {String} currentLine Current line of RPAf code
 * @returns {String} Name of the outputVariable
 */
const getOutputName = (currentLine) => {
  const indexOfEqualsSign = currentLine.indexOf('=');
  return currentLine
    .slice(0, indexOfEqualsSign)
    .replace('${', '')
    .replace('}', '')
    .trim();
};

/**
 * @description Retrieves the rpa task from the current code line; if there are no parameters,
 * the indexOfFirstSplitPlaceholder returns -1 and therefore the function returns the whole line
 * @param {String} currentLine Current line of RPAf code
 * @param {String} splitPlaceholder Placeholder to split the string
 * @returns {String} RpaTask for the given code line
 */
const getRpaTask = (currentLine, splitPlaceholder) => {
  const indexOfFirstSplitPlaceholder = currentLine.indexOf(splitPlaceholder);
  return indexOfFirstSplitPlaceholder === -1
    ? currentLine.replace('RPA.', '')
    : currentLine.slice(0, indexOfFirstSplitPlaceholder).replace('RPA.', '');
};

/**
 * @description Retrieves the rpa parameters from the current code line
 * @param {String} currentLine Current line of RPAf code
 * @param {String} splitPlaceholder Placeholder to split the string
 * @param {String} instructionBlocks Current intruction block to get the rpaTask
 * @returns {Array} List of parameters for the current code line
 */
const getRpaParameters = (currentLine, splitPlaceholder) => {
  const indexOfFirstSplitPlaceholder = currentLine.indexOf(splitPlaceholder);
  const parametersWithoutRpaTask = currentLine.slice(
    indexOfFirstSplitPlaceholder + splitPlaceholder.length
  );
  return parametersWithoutRpaTask.split([splitPlaceholder]);
};

/**
 * @description Deletes everything before the first occurence of '=' and then trims all emptyspace until the rpa task name to get the expected format
 * @param {String} currentLine Current line of RPAf code
 * @param {String} splitPlaceholder Placeholder to split the string
 * @returns {String} Current line without the outputVariableName prefix
 */
const currentLineWithoutOutputValueName = (completeLine, splitPlaceholder) => {
  const indexOfEqualsSign = completeLine.indexOf('=');
  let currentLine = completeLine.slice(indexOfEqualsSign + 1);
  if (currentLine.startsWith(splitPlaceholder)) {
    currentLine = currentLine.replace(splitPlaceholder, '').trim();
  } else {
    currentLine = currentLine.trim();
  }
  return currentLine;
};

/**
 * @description Counts the number of occurences of the current task in the subset
 * of all Task/Application combinations for the current robot code
 * @param {Array} allMatchingCombinations All combinations from database that match the rpaTask
 * @param {*} rpaTask RpaTask from current robotCode line
 * @returns {Number} Number of occurrences of the rpaTask in allMatchingCombinations
 */
const numberOfOccurrencesOfTask = (allMatchingCombinations, rpaTask) => {
  let numberOfOccurrences = 0;
  allMatchingCombinations.forEach((singleObject) => {
    if (singleObject.task === rpaTask) {
      numberOfOccurrences += 1;
    }
  });
  return numberOfOccurrences;
};

/**
 * @description Returns the matching task object for the rpaTask or throws a notification
 * @param {String} rpaTask RpaTask from current robotCode line
 * @param {Array} allMatchingCombinations All combinations from database that match the rpaTask
 * @returns {Object} Matching task object for the rpaTask or undefined if an error occurs
 */
const returnMatchingCombination = (rpaTask, allMatchingCombinations) => {
  const numberOfOccurrences = numberOfOccurrencesOfTask(
    allMatchingCombinations,
    rpaTask
  );

  if (allMatchingCombinations.length === 0) {
    customNotification(
      'Error',
      `The described task "${rpaTask}" could not be assigned to an application.`
    );
    return undefined;
  }
  if (numberOfOccurrences > 1) {
    let correctExampleText = '';
    allMatchingCombinations.forEach((singleCombination) => {
      correctExampleText += `\n${singleCombination.application}.${rpaTask}`;
    });
    customNotification(
      'Error',
      `Multiple Applications with task "${rpaTask}" found. Give the full name you want to use like: ${correctExampleText}`
    );
    return undefined;
  }
  return allMatchingCombinations[0];
};

/**
 * @description "Preprocesses" the code in a usable data format
 * @param {Array} robotCodeTaskSection Robot code w/o empty lines as an array of Strings
 * @param {Array} taskAndApplicationCombinations All declared tasks and applications from database
 * @returns {Array} Array of instructionBlocks with the following schema:
 *      instructionBlocks = [rpaApplication:String, rpaTask:String, name:String, paramArray:Array]
 */
const getInstructionBlocksFromTaskSection = (
  robotCodeTaskSection,
  taskAndApplicationCombinations
) => {
  let errorWasThrown;
  const instructionBlocks = [];
  const REGEX_FOR_OUTPUT_VALUE = /\${(.)+} =/;
  const SPLIT_PLACEHOLDER = '§&§';

  robotCodeTaskSection.slice(1).forEach((line) => {
    if (errorWasThrown) return;
    let currentLine = line;
    const currentLineIncludesSplitPlaceholder =
      currentLine.includes(SPLIT_PLACEHOLDER);
    const currentLineDefinesOutputValue =
      REGEX_FOR_OUTPUT_VALUE.test(currentLine);
    const currentLineStartsWithFourspace = currentLine.startsWith(FOURSPACE);

    if (!currentLineStartsWithFourspace) {
      instructionBlocks.push({ name: currentLine });
      return;
    }

    if (currentLineIncludesSplitPlaceholder) {
      customNotification(
        'Error',
        `It is not allowed to use & or § as param values \nError location: "${line}"`
      );
      errorWasThrown = true;
      return;
    }

    currentLine = currentLine.trim().replace(/( {4})/g, SPLIT_PLACEHOLDER);

    if (currentLineDefinesOutputValue) {
      const outputValueName = getOutputName(currentLine);
      instructionBlocks[instructionBlocks.length - 1].outputName =
        outputValueName;

      currentLine = currentLineWithoutOutputValueName(
        currentLine,
        SPLIT_PLACEHOLDER
      );
    }

    if (!errorWasThrown) {
      let rpaTask = getRpaTask(currentLine, SPLIT_PLACEHOLDER);
      const allMatchingCombinations = taskAndApplicationCombinations.filter(
        (singleCombination) => {
          if (rpaTask === singleCombination.task) return true;
          if (
            rpaTask.endsWith(singleCombination.task) &&
            rpaTask.startsWith(singleCombination.application)
          )
            return true;

          return false;
        }
      );

      const matchingCombination = returnMatchingCombination(
        rpaTask,
        allMatchingCombinations
      );
      if (typeof matchingCombination === 'undefined') {
        errorWasThrown = true;
        return;
      }

      rpaTask = rpaTask.replace(`${matchingCombination.application}.`, '');

      const rpaParameters = getRpaParameters(currentLine, SPLIT_PLACEHOLDER);

      instructionBlocks[instructionBlocks.length - 1].rpaTask = rpaTask;
      instructionBlocks[instructionBlocks.length - 1].paramArray =
        rpaParameters;
      instructionBlocks[instructionBlocks.length - 1].rpaApplication =
        matchingCombination.application;
    }
  });
  return errorWasThrown ? undefined : instructionBlocks;
};

/**
 * @description Builds a dummy startMarker element and returns them
 * @returns {Object} Dummy startMarker as JSON => currently MARKERS aren't defined
 * in our RPAf-Syntax and therefore there aren't implemented
 */
const buildStartMarker = () => ({
  successorIds: [],
  id: getEventId(),
  type: 'MARKER',
  name: 'START',
  predecessorIds: [],
});

/**
 * @description Builds a dummy endMarker element and returns them
 * @param {Object} predecessor As an Object to get the predecessorId
 * @returns {Object} Dummy endMarker as JSON => currently MARKERS aren't defined
 * in our RPAf-Syntax and therefore there aren't implemented
 */
const buildEndMarker = (predecessor) => ({
  successorIds: [],
  id: getEventId(),
  type: 'MARKER',
  name: 'END',
  predecessorIds: [predecessor ? predecessor.id : 'MarkerElement'],
});

/**
 * @description Builds the attributeObject for a single element
 * @param {Object} currentElement Current instruction element
 * @param {Object} singleElementFromTasksSection Parsed Object from the RPAf Code
 * @param {String} robotId Id of the current robot / ssot
 * @returns {Object} AttributeObject for a single attribute
 */
const buildSingleAttributeObject = (
  currentElement,
  singleElementFromTasksSection,
  robotId
) => {
  let { rpaTask } = singleElementFromTasksSection;
  if (!rpaTask) rpaTask = 'no Task defined';

  return {
    activityId: currentElement.id,
    rpaApplication: singleElementFromTasksSection.rpaApplication,
    rpaTask,
    robotId,
  };
};

/**
 * @description Builds the parameterObject for a single element
 * @param {Object} singleAtrributeObject Attribute Object of the current activity
 * @param {Object} singleElementFromTasksSection  Parsed Object from the RPAf Code
 * @param {Array} taskAndApplicationCombinations All combinations of applications and tasks
 * @returns {Object} ParameterObject for a single attribute
 */
const buildSingleParameterObject = (
  singleAtrributeObject,
  singleElementFromTasksSection,
  taskAndApplicationCombinations
) => {
  const { rpaApplication, activityId, rpaTask, robotId } =
    singleAtrributeObject;
  const singleParamArray = singleElementFromTasksSection.paramArray;

  const combinationObject = taskAndApplicationCombinations.filter(
    (singleCombinationObject) =>
      singleCombinationObject.application === rpaApplication &&
      singleCombinationObject.task === rpaTask
  )[0];

  const parameterArray = combinationObject.inputVars.map(
    (singleParameter, index) => {
      const currentParameterIsEmpty =
        singleParamArray[index].startsWith('%%') &&
        singleParamArray[index].endsWith('%%');
      const currentParameterRequiresUserInput =
        singleParamArray[index].startsWith('!!') &&
        singleParamArray[index].endsWith('!!');
      const currentParameterTakesOutputValue =
        singleParamArray[index].startsWith('${') &&
        singleParamArray[index].endsWith('}');
      const singleParameterObject = { ...singleParameter };

      singleParameterObject.requireUserInput =
        currentParameterRequiresUserInput;
      if (currentParameterIsEmpty || currentParameterRequiresUserInput) {
        singleParameterObject.value = '';
      } else if (currentParameterTakesOutputValue) {
        const outputValueName = singleParamArray[index]
          .slice(2)
          .slice(0, singleParamArray[index].length - 3)
          .trim();
        singleParameterObject.value = `$$${outputValueName}$$`;
      } else {
        singleParameterObject.value = singleParamArray[index];
      }
      return singleParameterObject;
    }
  );

  return {
    activityId,
    rpaParameters: parameterArray,
    robotId,
    outputValue: singleElementFromTasksSection.outputName,
  };
};

/**
 * @description Build the elementsArray of the ssot
 * @param {Array} robotCodeTaskSection Robot code w/o empty lines as an array of strings
 * @param {Array} declaredApplications All declared applications from ***settings*** section as strings
 * @param {String} robotId Id of the current robot / ssot
 * @returns {Array} elementsArray with all needed properties
 */
const getElementsArray = (
  robotCodeTaskSection,
  declaredApplications,
  robotId
) => {
  const elementsArray = [];
  const attributeArray = [];
  const parameterArray = [];

  if (
    typeof robotCodeTaskSection === 'undefined' ||
    typeof declaredApplications === 'undefined'
  )
    return undefined;

  let taskAndApplicationCombinations = JSON.parse(
    sessionStorage.getItem('taskApplicationCombinations')
  );
  taskAndApplicationCombinations = taskAndApplicationCombinations.filter(
    (singleCombination) =>
      declaredApplications.includes(singleCombination.application)
  );

  const instructionArray = getInstructionBlocksFromTaskSection(
    robotCodeTaskSection,
    taskAndApplicationCombinations
  );
  if (typeof instructionArray === 'undefined') return undefined;

  elementsArray.push(buildStartMarker());

  instructionArray.forEach((singleElement) => {
    const currentElement = {};

    currentElement.successorIds = [];
    currentElement.id = getActivityId();
    currentElement.type = 'INSTRUCTION';
    currentElement.name = singleElement.name;

    const predecessor = elementsArray[elementsArray.length - 1];
    currentElement.predecessorIds = predecessor && [predecessor.id];
    if (predecessor) predecessor.successorIds = [currentElement.id];

    elementsArray.push(currentElement);

    const singleAtrributeObject = buildSingleAttributeObject(
      currentElement,
      singleElement,
      robotId
    );
    attributeArray.push(singleAtrributeObject);

    const singleParameterObject = buildSingleParameterObject(
      singleAtrributeObject,
      singleElement,
      taskAndApplicationCombinations
    );
    parameterArray.push(singleParameterObject);
  });
  elementsArray.push(buildEndMarker(elementsArray[elementsArray.length - 1]));
  const lastElement = elementsArray[elementsArray.length - 1];
  const secontlLastElement = elementsArray[elementsArray.length - 2];
  secontlLastElement.successorIds = [lastElement.id];

  sessionStorage.removeItem('attributeLocalStorage');
  sessionStorage.setItem(
    'attributeLocalStorage',
    JSON.stringify(attributeArray)
  );
  sessionStorage.setItem(
    'parameterLocalStorage',
    JSON.stringify(parameterArray)
  );

  return elementsArray;
};

/**
 * @description Retrieves the starterId of the robot from the elements array
 * @param {Array} elementsArray Array of all elements of the robot
 * @returns {String} Id of the element that has no predecessors and is therefore the start element of the robot
 */
const getStarterId = (elementsArray) => {
  const starterElements = elementsArray.filter(
    (singleElement) =>
      singleElement.type === 'MARKER' &&
      singleElement.predecessorIds.length === 0
  );
  if (starterElements.length === 1) {
    return starterElements[0].id;
  }
  return 'no starter id found';
};

/**
 * @description Retrieves the line number for a given selector
 * @param {Array} robotCodeAsArray Complete robotCode w/o new lines as array
 * @param {String} selector Selector for which the line number will be retrieved
 * @returns {number} Line number where the selector occurs
 */
const getLineNumberForSelector = (robotCodeAsArray, selector) => {
  let lineNumber;
  robotCodeAsArray.forEach((codeLine, index) => {
    if (codeLine.trim().includes(selector)) lineNumber = index;
  });
  if (typeof lineNumber === 'undefined') {
    customNotification(
      'Error',
      `The required selector "${selector}" was not found`
    );
  }
  return lineNumber;
};

/**
 * @description Parses the RPA-Framework code from the code editor to the single source of truth
 * @param {String} robotCode Code from the code-editor
 * @returns {Object} Single source of truth as a JavaSctipt-object or undefined if an error occures
 */
const parseRobotCodeToSsot = (robotCode) => {
  const robotName = getRobotName();
  const robotId = getRobotId();
  const robotCodeAsArray = getRobotCodeAsArray(robotCode);

  const lineNumberSettingsSelector = getLineNumberForSelector(
    robotCodeAsArray,
    '*** Settings ***'
  );
  const lineNumberTasksSelector = getLineNumberForSelector(
    robotCodeAsArray,
    '*** Tasks ***'
  );

  let robotCodeSettingsSection;
  let robotCodeTaskSection;
  if (
    typeof lineNumberSettingsSelector !== 'undefined' &&
    typeof lineNumberTasksSelector !== 'undefined'
  ) {
    robotCodeSettingsSection = robotCodeAsArray.slice(
      lineNumberSettingsSelector,
      lineNumberTasksSelector
    );
    robotCodeTaskSection = robotCodeAsArray.slice(lineNumberTasksSelector);
  }

  const declaredApplications = getApplicationArray(robotCodeSettingsSection);
  const elementsArray = getElementsArray(
    robotCodeTaskSection,
    declaredApplications,
    robotId
  );

  if (typeof elementsArray !== 'undefined') {
    const ssot = {
      _id: robotId,
      starterId: getStarterId(elementsArray),
      robotName,
      elements: elementsArray,
    };
    return ssot;
  }
  return undefined;
};

export {
  parseRobotCodeToSsot,
  getLineNumberForSelector,
  getRobotCodeAsArray,
  getApplicationArray,
  getElementsArray,
  getInstructionBlocksFromTaskSection,
};
