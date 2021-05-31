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

import {
  parseRobotCodeToSsot,
  getLineNumberForSelector,
  getRobotCodeAsArray,
  getApplicationArray,
  getElementsArray,
  getInstructionBlocksFromTaskSection,
} from './robotCodeToSsotParsing';

const ROBOT_ID = '54ab2d30eb3cc402041ac60f';

const robotMetadata = {
  robotName: 'AwesomeTestRobot',
  robotId: '12345678',
};

sessionStorage.setItem('robotMetadata', JSON.stringify(robotMetadata));
sessionStorage.setItem(
  'availableApplications',
  '["Excel.Application","Excel.Files","HTTP","Testing"]'
);
sessionStorage.setItem(
  'taskApplicationCombinations',
  JSON.stringify(taskAndApplicationCombinations)
);

const correctRobotCode = `${correctSettingsSection}\n\n${correctTaskSection}`;
const robotCodeAsArray = getRobotCodeAsArray(correctRobotCode);
const settingsSectionAsArray = getRobotCodeAsArray(correctSettingsSection);
const taskSectionAsArray = getRobotCodeAsArray(correctTaskSection);
const declaredApplications = getApplicationArray(settingsSectionAsArray);

describe('RobotCode to SSOT Parsing Tests', () => {
  it('contains the correct robotMetadata', () => {
    sessionStorage.setItem('idCounter', '5416');
    const ssot = parseRobotCodeToSsot(correctRobotCode);
    expect(ssot).toHaveProperty('robotName', 'AwesomeTestRobot');
    expect(ssot).toHaveProperty('_id', '12345678');
    expect(ssot).toHaveProperty('starterId', 'Event_0ay5417');
  });

  it('finds the settings selector correctly', () => {
    const settingsSectionAsArrayForTest = getRobotCodeAsArray(
      `RandomOffsetLine\n${correctSettingsSection}`
    );
    expect(
      getLineNumberForSelector(settingsSectionAsArray, '*** Settings ***')
    ).toBe(0);
    expect(
      getLineNumberForSelector(
        settingsSectionAsArrayForTest,
        '*** Settings ***'
      )
    ).toEqual(1);
  });
  it("throws an error, if settings selector wasn't found", () => {
    const robotCodeWithOutSettingsSelector = robotCodeAsArray.slice(1);
    expect(
      getLineNumberForSelector(
        robotCodeWithOutSettingsSelector,
        '*** Settings ***'
      )
    ).toBe(undefined);
  });
  it('finds the tasks selector correctly', () =>
    expect(getLineNumberForSelector(robotCodeAsArray, '*** Tasks ***')).toEqual(
      3
    ));

  it('finds all applications', () =>
    expect(['Testing', 'Excel.Application']).toEqual(
      expect.arrayContaining(declaredApplications)
    ));

  it('has a correct elementsArray', () => {
    sessionStorage.setItem('idCounter', '5416');
    const elementsArray = getElementsArray(
      taskSectionAsArray,
      declaredApplications,
      ROBOT_ID
    );
    expect(elementsArray).toEqual(correctElementsArray);
  });

  it('generates correct instruction blocks', () => {
    const instructionBlocks = getInstructionBlocksFromTaskSection(
      taskSectionAsArray,
      taskAndApplicationCombinations
    );
    expect(instructionBlocks).toEqual(correctInstructionBlocks);
  });
});

describe('Error handling while parsing', () => {
  it("throws an error, if settings selector wasn't found", async () => {
    customNotification.mockImplementation((type, message) => {
      expect(type).toEqual('Error');
      expect(message).toEqual(
        'The required selector "*** Settings ***" was not found'
      );
    });

    const robotCodeWithOutSettingsSelector = robotCodeAsArray.slice(1);
    getLineNumberForSelector(
      robotCodeWithOutSettingsSelector,
      '*** Settings ***'
    );
  });

  it('handles "Library" errors', async () => {
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
    getApplicationArray(settingsSectionWithError);
  });

  it('handles "RPA."-Alias errors', async () => {
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
    getApplicationArray(settingsSectionWithError);
  });

  it('handles "RPA-Application is not defined" errors', async () => {
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
    getApplicationArray(settingsSectionWithError);
  });
});
