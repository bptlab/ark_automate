/**
 * @category Client
 * @module
 */
import socket from '../../utils/socket/socketConnections';

/**
 * @description Register listener on successful connection to a user room
 */
const successRoomConnection = () => {
  socket.on('successUserRoomConnection', (message) => message);
};

/**
 * @description Register listener on faulty connection to a user room
 */
const errorRoomConnection = () => {
  socket.on('errorUserRoomConnection', (message) => message);
};

/**
 * @description Register listener on when a new client joins the room
 */
const newClientJoined = () => {
  socket.on('newClientJoinedUserRoom', (message) => message);
};

/**
 * @description Register listener on when a new robot log update has been send
 * @param {function} logSetterMethod Method reference to update the state of log in the robotInteractionCockpit

 */
const newRobotMonitorUpdate = (logSetterMethod) => {
  socket.on('changedRobotRunLogs', (robotLogs) => {
    logSetterMethod(robotLogs);
  });
};

/**
 * @description Register listener on when a new robot status has been set
 *  * @param {function} logSetterMethod Method reference to update the status of log in the robotInteractionCockpit

 */
const newRobotStatusUpdate = (statusSetterMethod) => {
  socket.on('changedRobotStatus', (status) => statusSetterMethod(status));
};

export {
  successRoomConnection,
  errorRoomConnection,
  newClientJoined,
  newRobotMonitorUpdate,
  newRobotStatusUpdate,
};
