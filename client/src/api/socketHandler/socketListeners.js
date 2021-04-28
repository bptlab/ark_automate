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

export { successRoomConnection, errorRoomConnection, newClientJoined };
