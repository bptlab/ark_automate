const parser = require('./BpmnToSsotParsing');
const JSON_STRING = require('./JsonForTesting');
const testSsot = require('./SsotForTesting');

/*
const BROWSER_ACTIVITY_NAME = 'Browser Open Browser';
const EXCEL_ACTIVITY_NAME = 'Excel Open Workbook';
const LIBRARY_EXCEL = 'Library    RPA.Excel.Files';
const LIBRARY_BROWSER = 'Library    RPA.Browser';
const SETTING_STRING = '*** Settings ***';
const TASK_STRING = '*** Tasks ***';
const OPEN_WORKBOOK_CMD = 'Open Workbook';
const FIND_EMPTY_ROW_CMD = 'Find Empty Row';
const OPEN_BROWSER_CMD = 'Open Browser';
*/

describe('Parsing Tests', () => {


  test('bpmn fully parsed to ssot', () => {
    const parserResultString = parser.parseDiagramToSsot(JSON_STRING.JSON_SSOT_STRING);

    expect(parserResultString).toMatch(JSON.stringify(testSsot.SSOT_JSON_STRING, null, 2));
  });

  test('ssot contains instruction', () => {
    const parserResultString = parser.parseDiagramToSsot(JSON_STRING.JSON_SSOT_STRING);

    expect(parserResultString).toMatch("\"type\": \"INSTRUCTION\"",);
  })

  test('ssot contains marker', () => {
    const parserResultString = parser.parseDiagramToSsot(JSON_STRING.JSON_SSOT_STRING);

    expect(parserResultString).toMatch("\"type\": \"MARKER\"",);
  })

  test('ssot contains flow', () => {
    const parserResultString = parser.parseDiagramToSsot(JSON_STRING.JSON_SSOT_STRING);
    const ssotElements = JSON.parse(parserResultString).elements
    ssotElements.forEach((obj => {
      expect((obj.predecessorIds.length) + (obj.successorIds.length)).toBeGreaterThan(0);
    }))
  })

  /*
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
  */
});
