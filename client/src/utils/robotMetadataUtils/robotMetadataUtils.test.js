/* eslint-disable no-shadow */
/* eslint-disable import/first */
/* eslint-disable no-undef */

jest.mock('../../api/ssot');
jest.mock('../downloadString');
jest.mock('../attributeAndParamUtils');
jest.mock('../parser/BpmnToSsotParsing/BpmnToSsotParsing');

import { downloadRobotFile, onSaveToCloud } from './robotMetadataUtils';
import getParsedRobotFile from '../../api/ssot';
import downloadString from '../downloadString';
import { upsert } from '../attributeAndParamUtils';
import { parseBpmnToSsot } from '../parser/BpmnToSsotParsing/BpmnToSsotParsing';
import constants from '../modelerSidebarFunctionality/modelerSidebarFunctionalityTestingUtils';

describe('Robot Metadata Utilities Tests', () => {
  it('download robot file', async () => {
    sessionStorage.setItem('robotName', constants.MOCK_ROBOT_NAME);

    getParsedRobotFile.mockImplementation((robotId) => {
      expect(robotId).toEqual(constants.MOCK_ROBOT_ID);
      return {
        text: async () => constants.MOCK_ROBOT_CONTENT,
      };
    });

    downloadString.mockImplementation((robotCode, textSpecifyier, fileName) => {
      expect(robotCode).toEqual(constants.MOCK_ROBOT_CONTENT);
      expect(textSpecifyier).toEqual('text/robot');
      expect(fileName).toEqual(`${constants.MOCK_ROBOT_NAME}.robot`);
    });

    await downloadRobotFile(constants.MOCK_ROBOT_ID);
  });

  it('save to cloud', async () => {
    upsert.mockImplementation(() => {
      expect(sessionStorage.getItem('ssotLocal')).toEqual(
        JSON.stringify(constants.MOCK_PARSER_RESULT)
      );
    });

    parseBpmnToSsot.mockImplementation(async (xml, robotId) => {
      expect(xml).toEqual(constants.MOCK_XML);
      expect(robotId).toEqual(constants.MOCK_ROBOT_ID);
      return constants.MOCK_PARSER_RESULT;
    });

    await onSaveToCloud(constants.MOCK_MODELER, constants.MOCK_ROBOT_ID);
  });
});
