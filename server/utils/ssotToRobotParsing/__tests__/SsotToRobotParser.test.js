const parser = require('../ssotToRobotParser');
const testSsot = require('./SsotForTesting.json');
const dbHandler = require('../../testing/testDatabaseHandler');
const dbLoader = require('../../testing/databaseLoader');
const {
  testRobotId,
  testJobId,
  testRobotCode,
} = require('../../testing/testData');

const EXCEL1_ACTIVITY_NAME = 'FirstActivity';
const OPEN_WORKBOOK_CMD = 'Open Workbook';
const EXCEL1_ACTIVITY_PARAM = 'C://Users/Filepath';

const EXCEL2_ACTIVITY_NAME = 'SecondActivity';
const FIND_EMPTY_ROW_CMD = 'Find Empty Row';
const EXCEL2_ACTIVITY_PARAM = 'StonksOnlyGoUp.xls';

const BROWSER_ACTIVITY_NAME = 'ThirdActivity';
const OPEN_BROWSER_CMD = 'Open Browser';
const BROWSER_ACTIVITY_PARAM = 'http://localhost:3000';

const LIBRARY_EXCEL = 'Library    RPA.Excel.Application';
const LIBRARY_BROWSER = 'Library    RPA.Browser';
const SETTING_STRING = '*** Settings ***';
const TASK_STRING = '*** Tasks ***';

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => dbHandler.closeDatabase());

describe('ssot to robot Parsing', () => {
  it('parses all the elements of the ssot to robot correctly', async () => {
    await dbLoader.loadAttributesInDb();
    await dbLoader.loadParametersInDb();

    const parserResultString = await parser.parseSsotToRobotCode(testSsot);

    expect(parserResultString).toMatch(SETTING_STRING);
    expect(parserResultString).toMatch(LIBRARY_EXCEL);

    expect(parserResultString).toMatch(EXCEL1_ACTIVITY_NAME);
    expect(parserResultString).toMatch(OPEN_WORKBOOK_CMD);
    expect(parserResultString).toMatch(EXCEL1_ACTIVITY_PARAM);

    expect(parserResultString).toMatch(EXCEL2_ACTIVITY_NAME);
    expect(parserResultString).toMatch(FIND_EMPTY_ROW_CMD);
    expect(parserResultString).toMatch(EXCEL2_ACTIVITY_PARAM);

    expect(parserResultString).toMatch(BROWSER_ACTIVITY_NAME);
    expect(parserResultString).toMatch(OPEN_BROWSER_CMD);
    expect(parserResultString).toMatch(BROWSER_ACTIVITY_PARAM);
  });

  it('parses all the elements of the ssot to robot in the correct order', async () => {
    await dbLoader.loadAttributesInDb();
    await dbLoader.loadParametersInDb();

    const parserResultString = await parser.parseSsotToRobotCode(testSsot);

    expect(parserResultString.indexOf(SETTING_STRING)).toBeLessThan(
      parserResultString.indexOf(TASK_STRING)
    );
    expect(parserResultString.indexOf(LIBRARY_BROWSER)).toBeLessThan(
      parserResultString.indexOf(TASK_STRING)
    );
    expect(parserResultString.indexOf(LIBRARY_EXCEL)).toBeLessThan(
      parserResultString.indexOf(TASK_STRING)
    );

    expect(parserResultString.indexOf(EXCEL1_ACTIVITY_NAME)).toBeLessThan(
      parserResultString.lastIndexOf(OPEN_WORKBOOK_CMD)
    );
    expect(parserResultString.indexOf(OPEN_WORKBOOK_CMD)).toBeLessThan(
      parserResultString.lastIndexOf(EXCEL1_ACTIVITY_PARAM)
    );

    expect(parserResultString.indexOf(EXCEL2_ACTIVITY_NAME)).toBeLessThan(
      parserResultString.indexOf(FIND_EMPTY_ROW_CMD)
    );
    expect(parserResultString.indexOf(FIND_EMPTY_ROW_CMD)).toBeLessThan(
      parserResultString.indexOf(EXCEL2_ACTIVITY_PARAM)
    );

    expect(parserResultString.indexOf(BROWSER_ACTIVITY_NAME)).toBeLessThan(
      parserResultString.lastIndexOf(OPEN_BROWSER_CMD)
    );
    expect(parserResultString.indexOf(OPEN_BROWSER_CMD)).toBeLessThan(
      parserResultString.lastIndexOf(BROWSER_ACTIVITY_PARAM)
    );
  });

  it('parses all the elements of the ssot and job object correctly', async () => {
    await dbLoader.loadSsotInDb();
    await dbLoader.loadAttributesInDb();
    await dbLoader.loadParametersInDb();
    await dbLoader.loadJobInDb();
    await dbLoader.loadTasksInDb();

    const parserResultString = await parser.parseCodeForJob(
      testRobotId,
      testJobId
    );
    expect(parserResultString).not.toBeUndefined();
    expect(parserResultString).not.toBeNull();
    expect(String(parserResultString).replace(/\s/g, '')).toEqual(
      String(testRobotCode).replace(/\s/g, '')
    );
  });
});
