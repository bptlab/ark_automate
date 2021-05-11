/* eslint-disable no-param-reassign */

/**
 * @category Client
 * @module
 */

import getParsedRobotFile from '../../api/ssot';
import downloadString from '../downloadString';
import { upsert } from '../localSsot/ssot';
import { parseBpmnToSsot } from '../parser/BpmnToSsotParsing/BpmnToSsotParsing';

/**
 * @description Gets called when the the button is pressed to save to the cloud.
 * This function will retrieve the xml from the parser, parse that xml to a ssot and write the
 * resulting ssot into the sessionStorage.
 * @param {Object} modeler the modeling object
 * @param {String} robotId id of the robot
 */
const onSaveToCloud = async (modeler, robotId) => {
  const xml = await modeler.saveXML({ format: true });
  const result = await parseBpmnToSsot(xml, robotId);
  const ssot = JSON.stringify(result);
  sessionStorage.setItem('ssotLocal', ssot);
  upsert();
};

/**
 * @description Will parse the ssot which can be found in the database correlating to the specified id
 * @param {String} robotId id of the robot
 */
const downloadRobotFile = async (robotId) => {
  const response = await (await getParsedRobotFile(robotId)).text();
  const fileName = `${sessionStorage.getItem('robotName')}.robot`;
  downloadString(response, 'text/robot', fileName);
};

export { downloadRobotFile, onSaveToCloud };
