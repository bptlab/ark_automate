/* eslint-disable no-undef */
/* eslint-disable import/first */
import {
  correctSettingsSection,
  correctTaskSection,
  taskAndApplicationCombinations,
  correctElementsArray,
  correctInstructionBlocks,
} from './robotCodeTestData';

jest.mock('../../componentsFunctionality/notificationUtils');

import customNotification from '../../componentsFunctionality/notificationUtils';

const parser = require('./robotCodeToSsotParsing');

const ROBOT_ID = '54ab2d30eb3cc402041ac60f';

sessionStorage.setItem('robotName', 'AwesomeTestRobot');
sessionStorage.setItem('robotId', '12345678');
sessionStorage.setItem(
  'availableApplications',
  '["Excel.Application","Excel.Files","HTTP","Testing"]'
);
sessionStorage.setItem(
  'TaskApplicationCombinations',
  JSON.stringify(taskAndApplicationCombinations)
);

const correctRobotCode = `${correctSettingsSection}\n\n${correctTaskSection}`;
const robotCodeAsArray = parser.getRobotCodeAsArray(correctRobotCode);
const settingsSectionAsArray = parser.getRobotCodeAsArray(
  correctSettingsSection
);
const taskSectionAsArray = parser.getRobotCodeAsArray(correctTaskSection);
const declaredApplications = parser.getApplicationArray(settingsSectionAsArray);

describe('RobotCode to SSOT Parsing Tests', () => {
  test('ssot contains right robotMetadata', () => {
    sessionStorage.setItem('idCounter', '5416');
    const ssot = parser.parseRobotCodeToSsot(correctRobotCode);
    expect(ssot).toHaveProperty('robotName', 'AwesomeTestRobot');
    expect(ssot).toHaveProperty('_id', 12345678);
    expect(ssot).toHaveProperty('starterId', 'Event_0ay5417');
  });

  test('settings selector was found correctly', () => {
    const settingsSectionAsArrayForTest = parser.getRobotCodeAsArray(
      `RandomOffsetLine\n${correctSettingsSection}`
    );
    expect(
      parser.getLineNumberForSelector(
        settingsSectionAsArray,
        '*** Settings ***'
      )
    ).toBe(0);
    expect(
      parser.getLineNumberForSelector(
        settingsSectionAsArrayForTest,
        '*** Settings ***'
      )
    ).toEqual(1);
  });
  test("settings selector wasn't found, expected to throw error", () => {
    const robotCodeWithOutSettingsSelector = robotCodeAsArray.slice(1);
    expect(
      parser.getLineNumberForSelector(
        robotCodeWithOutSettingsSelector,
        '*** Settings ***'
      )
    ).toBe(undefined);
  });
  test('tasks selector was found correctly', () =>
    expect(
      parser.getLineNumberForSelector(robotCodeAsArray, '*** Tasks ***')
    ).toEqual(3));

  test('all applications were found', () =>
    expect(['Testing', 'Excel.Application']).toEqual(
      expect.arrayContaining(declaredApplications)
    ));

  test('elementsArray is correct', () => {
    sessionStorage.setItem('idCounter', '5416');
    const elementsArray = parser.getElementsArray(
      taskSectionAsArray,
      declaredApplications,
      ROBOT_ID
    );
    expect(elementsArray).toEqual(correctElementsArray);
  });

  test('instruction blocks are generated correct', () => {
    const instructionBlocks = parser.getInstructionBlocksFromTaskSection(
      taskSectionAsArray,
      taskAndApplicationCombinations
    );
    expect(instructionBlocks).toEqual(correctInstructionBlocks);
  });
});

describe('Error handling while parsing', () => {
  test("settings selector wasn't found (and Error was thrown)", async () => {
    customNotification.mockImplementation((type, message) => {
      expect(type).toEqual('Error');
      expect(message).toEqual(
        'The required selector "*** Settings ***" was not found'
      );
    });

    const robotCodeWithOutSettingsSelector = robotCodeAsArray.slice(1);
    parser.getLineNumberForSelector(
      robotCodeWithOutSettingsSelector,
      '*** Settings ***'
    );
  });

  test('check "Library" error handling', async () => {
    customNotification.mockImplementation((type, message) => {
      expect(type).toEqual('Error');
      expect(
        message.includes(
          `Every line of the "*** Settings ***" Section has to start with "Library"! \nError location: "`
        )
      ).toBe(true);
    });

    const settingsSectionWithError = settingsSectionAsArray.map((singleLine) =>
      singleLine.replace('Library', 'Lib')
    );
    parser.getApplicationArray(settingsSectionWithError);
  });

  test('check "RPA."-Alias error handling', async () => {
    customNotification.mockImplementation((type, message) => {
      expect(type).toEqual('Error');
      expect(
        message.includes(
          'Application has to start with "RPA." \nError location:'
        )
      ).toBe(true);
    });

    const settingsSectionWithError = settingsSectionAsArray.map((singleLine) =>
      singleLine.replace('RPA.', 'Rpa.')
    );
    parser.getApplicationArray(settingsSectionWithError);
  });

  test('check "RPA-Application is not defined" error handling', async () => {
    customNotification.mockImplementation((type, message) => {
      expect(type).toEqual('Error');
      expect(
        message.includes(
          'The Application "Word.Application" is currently not supported.'
        )
      ).toBe(true);
    });

    const settingsSectionWithError = settingsSectionAsArray.map((singleLine) =>
      singleLine.replace('Excel.Application', 'Word.Application')
    );
    parser.getApplicationArray(settingsSectionWithError);
  });
});
