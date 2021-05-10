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
 */
const newRobotMonitorUpdate = (logSetterMethod) => {
  socket.on('liveRobotMonitoring', (robotLogs) => {
    logSetterMethod(robotLogs);
  });
};

/**
 * @description Register listener on when a new robot status has been set
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
