/**
 * @category Client
 * @module
 */

const { default: customNotification } = require('../../notificationUtils');

const FOURSPACE = '    ';

/**
 * @returns "uniqueId" which is just an increment from the counter in the local storage
 */
const getUniqueId = () => {
  const newId = JSON.parse(sessionStorage.getItem('idCounter')) + 1;
  sessionStorage.setItem('idCounter', newId);
  return newId;
};

/**
 * @returns unique Id; wrapped with the activity nomenclature
 */
const getActivityId = () => `Activity_0ay${getUniqueId()}`;

/**
 * @returns unique Id; wrapped with the event nomenclature
 */
const getEventId = () => `Event_0ay${getUniqueId()}`;

/**
 * @description Splits the robot code into an array and deletes all empty lines
 * @param {String} robotCode Code from the code editor
 * @returns Robot code without empty lines as an array
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
 * @description checks all lines of the settings section for the right syntax and returns all declared applications as an array
 * @param {Array} robotCodeSettingsSection all lines from the settings section as an array-entry (typeof string)
 * @returns Array of all declared applications or undefined if an error occures
 */
const getApplicationArray = (robotCodeSettingsSection) => {
  if (typeof robotCodeSettingsSection === 'undefined') return undefined;
  const robotCode = robotCodeSettingsSection.slice(1);
  const availableApplications = JSON.parse(
    sessionStorage.getItem('availableApplications')
  );
  let errorWasThrown;

  robotCode.forEach((line) => {
    const regexForRpaAlias = /Library +RPA[.][a-zA-Z]+/;

    const elementStartsWithLibrary = line.startsWith('Library ');
    const rpaAliasIsCorrect = regexForRpaAlias.test(line);
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
 * @description retrieves the outputValue name from the current code line
 * @param {String} currentLine current line of RPAf code
 * @returns outputValue as string
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
 * @description retrieves the rpa task from the current code line; if there are no parameters,
 * the indexOfFirstSplitPlaceholder returns -1 and therefore the function returns the whole line
 * @param {String} currentLine current line of RPAf code
 * @param {String} splitPlaceholder placeholder to split the string
 * @returns rpaTask as string
 */
const getRpaTask = (currentLine, splitPlaceholder) => {
  const indexOfFirstSplitPlaceholder = currentLine.indexOf(splitPlaceholder);
  return indexOfFirstSplitPlaceholder === -1
    ? currentLine.replace('RPA.', '')
    : currentLine.slice(0, indexOfFirstSplitPlaceholder).replace('RPA.', '');
};

/**
 * @description retrieves the rpa parameters from the current code line
 * @param {String} currentLine current line of RPAf code
 * @param {String} splitPlaceholder placeholder to split the string
 * @param {String} instructionBlocks current intruction block to get the rpaTask
 * @returns rpaParameters as array
 */
const getRpaParameters = (currentLine, splitPlaceholder) => {
  const indexOfFirstSplitPlaceholder = currentLine.indexOf(splitPlaceholder);
  const parametersWithoutRpaTask = currentLine.slice(
    indexOfFirstSplitPlaceholder + splitPlaceholder.length
  );
  return parametersWithoutRpaTask.split([splitPlaceholder]);
};

/**
 * @description deletes everything before the first occurence of '=' and then trims all emptyspace until the rpa task name to get the expected format
 * @param {String} currentLine current line of RPAf code
 * @param {String} splitPlaceholder placeholder to split the string
 * @returns the current line without the outputValueName prefix as string
 */
const currentLineWithoutOutputValueName = (
  completeLine,
  splitPlaceholder
) => {
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
 * @description counts the number of occurences of the current task in the subset
 * of all Task/Application combinations for the current robot code
 * @param {Array} allMatchingCombinations all combinations from database that match the rpaTask
 * @param {*} rpaTask paTask from current robotCode line
 * @returns number of occurrences of the rpaTask in allMatchingCombinations
 */
const numberOfOccurrencesOfTask = (allMatchingCombinations, rpaTask) => {
  let numberOfOccurrences = 0;
  allMatchingCombinations.forEach((singleObject) => {
    if (singleObject.Task === rpaTask) {
      numberOfOccurrences += 1;
    }
  });
  return numberOfOccurrences;
};

/**
 * @description this function returns the matching task object for the rpaTask or throws a notification
 * @param {String} rpaTask rpaTask from current robotCode line
 * @param {Array} allMatchingCombinations all combinations from database that match the rpaTask
 * @returns the matching task object for the rpaTask or undefined if an error occurs
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
      correctExampleText += `\n${singleCombination.Application}.${rpaTask}`;
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
 * @description "preprocesses" the code in a usable data format
 * @param {Array} robotCodeTaskSection robot code w/o empty lines as an array of Strings
 * @param {Array} taskAndApplicationCombinations all declared tasks and applications from database
 * @returns Array of Objects with the following schema:
 *      instructionBlocks = [rpaApplication:String, rpaTask:String, name:String, paramArray:Array]
 */
const getInstructionBlocksFromTaskSection = (
  robotCodeTaskSection,
  taskAndApplicationCombinations
) => {
  let errorWasThrown;
  const instructionBlocks = [];
  const regexForOutputValue = /\${(.)+} =/;
  const splitPlaceholder = '§&§';

  robotCodeTaskSection.slice(1).forEach((line) => {
    if (errorWasThrown) return;
    let currentLine = line;
    const currentLineIncludesSplitPlaceholder = currentLine.includes(
      splitPlaceholder
    );
    const currentLineDefinesOutputValue = regexForOutputValue.test(
      currentLine
    );
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

    currentLine = currentLine.trim().replace(/( {4})/g, splitPlaceholder);

    if (currentLineDefinesOutputValue) {
      const outputValueName = getOutputName(currentLine);
      instructionBlocks[
        instructionBlocks.length - 1
      ].outputName = outputValueName;

      currentLine = currentLineWithoutOutputValueName(
        currentLine,
        splitPlaceholder
      );
    }

    if (!errorWasThrown) {
      let rpaTask = getRpaTask(currentLine, splitPlaceholder);
      const allMatchingCombinations = taskAndApplicationCombinations.filter(
        (singleCombination) => {
          if (rpaTask === singleCombination.Task) return true;
          if (
            rpaTask.endsWith(singleCombination.Task) &&
            rpaTask.startsWith(singleCombination.Application)
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

      rpaTask = rpaTask.replace(`${matchingCombination.Application}.`, '');

      const rpaParameters = getRpaParameters(currentLine, splitPlaceholder);

      instructionBlocks[instructionBlocks.length - 1].rpaTask = rpaTask;
      instructionBlocks[
        instructionBlocks.length - 1
      ].paramArray = rpaParameters;
      instructionBlocks[instructionBlocks.length - 1].rpaApplication =
        matchingCombination.Application;
    }
  });
  return errorWasThrown ? undefined : instructionBlocks;
};

/**
 * @description Builds a dummy startMarker element and returns them
 * @returns dummy startMarker as JSON => currently MARKERS aren't defined
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
 * @param {Object} predecessor as an Object to get the predecessorId
 * @returns dummy endMarker as JSON => currently MARKERS aren't defined
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
 * @description builds the attributeObject for a single element
 * @param {Object} currentElement current instruction element
 * @param {Object} singleElementFromTasksSection the parsed Object from the RPAf Code
 * @param {String} robotId the id of the current robot / ssot
 * @returns attributeObject for a single attribute
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
 * @description builds the parameterObject for a single element
 * @param {Object} singleAtrributeObject the attribute Object of the current activity
 * @param {Object} singleElementFromTasksSection the parsed Object from the RPAf Code
 * @param {Array} taskAndApplicationCombinations all combinations of applications and tasks
 * @returns parameterObject for a single attribute
 */
const buildSingleParameterObject = (
  singleAtrributeObject,
  singleElementFromTasksSection,
  taskAndApplicationCombinations
) => {
  const {
    rpaApplication,
    activityId,
    rpaTask,
    robotId,
  } = singleAtrributeObject;
  const singleParamArray = singleElementFromTasksSection.paramArray;

  const combinationObject = taskAndApplicationCombinations.filter(
    (singleCombinationObject) =>
      singleCombinationObject.Application === rpaApplication &&
      singleCombinationObject.Task === rpaTask
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

      singleParameterObject.requireUserInput = currentParameterRequiresUserInput;
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
 * @description build the elementsArray of the ssot
 * @param {Array} robotCodeTaskSection robot code w/o empty lines as an array of Strings
 * @param {Array} declaredApplications all declared Aplications from ***settings*** section as Strings
 * @param {String} robotId the id of the current robot / ssot
 * @returns elementsArray with all needed properties
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
    sessionStorage.getItem('TaskApplicationCombinations')
  );
  taskAndApplicationCombinations = taskAndApplicationCombinations.filter(
    (singleCombination) =>
      declaredApplications.includes(singleCombination.Application)
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
 * @description retrieves the starterId of the robot from the elements array
 * @param {Array} elementsArray Array of all elements of the robot
 * @returns starterId as string
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
 * @description
 * @param {Array} robotCodeAsArray the complete robotCode w/o new lines as array
 * @param {String} selector the selector to get the line number for
 * @returns line number where the selector occurs
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
 * @param {String} robotCode from the code-editor
 * @returns Single source of truth as a JavaSctipt-object or undefined if an error occures
 */
const parseRobotCodeToSsot = (robotCode) => {
  const robotId = JSON.parse(sessionStorage.getItem('robotId'));
  const robotName = sessionStorage.getItem('robotName');
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
