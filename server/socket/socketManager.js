const socketController = require('./socketController');

const users = ['80625d115100a2ee8d8e695b'];

exports.socketManager = (io, socket) => {
  console.log('Connected: ', socket.id);

  socket.on('joinUserRoom', (userId) => {
    if (users.includes(userId)) {
      socket.join(userId);
      socket.emit(
        'successUserRoomConnection',
        'You have connected to the user room ',
        userId
      );
      io.to(userId).emit(
        'newClientJoinedUserRoom',
        'New user has been connected to the ',
        userId,
        ' Room'
      );
      // eslint-disable-next-line no-else-return
    } else {
      socket.emit('errorUserRoomConnection', 'Invalid userId: ', userId);
    }
  });

  socket.on('robotExecutionJobs', ({ robotId, userId }) => {
    socketController.getRobotCode(robotId).then((robotCode) => {
      io.to(userId).emit('robotExecution', robotCode);
    });
  });
};
