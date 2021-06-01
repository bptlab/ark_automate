import socketIoClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:5001';

const socket = socketIoClient(ENDPOINT);

export default socket;
