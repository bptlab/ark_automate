import socketIoClient from 'socket.io-client';

const endpoint = 'http://localhost:5001';

const socket = socketIoClient(endpoint);

export default socket;
