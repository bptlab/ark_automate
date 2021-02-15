const jsonParser = require('../parser');
const testJson = require('../jsonForTesting');

const BROWSER_ACTIVITY_NAME = 'Browser Open Browser';
const EXCEL_ACTIVITY_NAME = 'Excel Open Workbook';
const LIBRARY_EXCEL = 'Library    RPA.Excel.Files';
const LIBRARY_BROWSER = 'Library    RPA.Browser';
const SETTING_STRING = '*** Settings ***';
const TASK_STRING = '*** Tasks ***';
const OPEN_WORKBOOK_CMD = 'Open Workbook';
const FIND_EMPTY_ROW_CMD = 'Find Empty Row';
const OPEN_BROWSER_CMD = 'Open Browser';

test('Manually pass in BPMN Json', () => {
    const parserResultString = jsonParser.parseDiagramJson(testJson.JSON_STRING);

    expect.assertions(15);
    expect(parserResultString).toMatch(SETTING_STRING);
    expect(parserResultString).toMatch(LIBRARY_EXCEL);
    expect(parserResultString).toMatch(LIBRARY_BROWSER);

    expect(parserResultString).toMatch(EXCEL_ACTIVITY_NAME);
    expect(parserResultString).toMatch(OPEN_WORKBOOK_CMD);
    expect(parserResultString).toMatch(FIND_EMPTY_ROW_CMD);

    expect(parserResultString).toMatch(BROWSER_ACTIVITY_NAME);
    expect(parserResultString).toMatch(OPEN_BROWSER_CMD);

    expect(parserResultString.indexOf(BROWSER_ACTIVITY_NAME)).toBeLessThan(
      parserResultString.lastIndexOf(OPEN_BROWSER_CMD)
    );
    expect(parserResultString.indexOf(EXCEL_ACTIVITY_NAME)).toBeLessThan(
      parserResultString.lastIndexOf(OPEN_WORKBOOK_CMD)
    );
    expect(parserResultString.indexOf(EXCEL_ACTIVITY_NAME)).toBeLessThan(
      parserResultString.indexOf(FIND_EMPTY_ROW_CMD)
    );

    expect(parserResultString.indexOf(SETTING_STRING)).toBeLessThan(
      parserResultString.indexOf(TASK_STRING)
    );
    expect(parserResultString.indexOf(LIBRARY_BROWSER)).toBeLessThan(
      parserResultString.indexOf(TASK_STRING)
    );
    expect(parserResultString.indexOf(LIBRARY_EXCEL)).toBeLessThan(
      parserResultString.indexOf(LIBRARY_BROWSER)
    );
    expect(parserResultString.indexOf(LIBRARY_EXCEL)).toBeLessThan(
      parserResultString.indexOf(TASK_STRING)
    );
});
