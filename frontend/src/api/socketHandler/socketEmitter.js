/**
 * @category Frontend
 * @module
 */
import socket from '../../utils/socket/socketConnections';

/**
 * @description Emits a new event that a user joined its room
 * @param {String} userId Id of the user for which the room will be joined
 */
const joinRoomForUser = (userId) => {
  socket.emit('joinUserRoom', userId, 'webApplication');
};

/**
 * @description Emits a new event that a user wants to enqueue a robot instace for execution
 * @param {String} userId Id of the user for which the robot will be started
 * @param {String} robotId Id of the robot which will be started
 */
const startRobotForUser = (userId, robotId, parameters) => {
  socket.emit('robotExecutionJobs', { robotId, userId, parameters });
};

export { joinRoomForUser, startRobotForUser };
