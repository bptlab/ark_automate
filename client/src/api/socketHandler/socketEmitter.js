/**
 * @category Client
 * @module
 */
import socket from '../../utils/socket/socketConnections';

/**
 * @description Emits a new event that a user joined its room
 * @param {String} userId Id of the user for which room should be joined
 */
const joinRoomForUser = (userId) => {
  socket.emit('joinUserRoom', userId);
};

/**
 * @description Emits a new event that a user wants to enqueue a robot instace for execution
 * @param {String} userId Id of the user for which to start a robot for
 * @param {String} robotId Id of the robot which should be started
 */
const startRobotForUser = (userId, robotId) => {
  socket.emit('robotExecutionJobs', { robotId, userId });
};

export { joinRoomForUser, startRobotForUser };
