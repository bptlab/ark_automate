const socketController = require('./socketController');

exports.socketManager = (io, socket) => {
  console.log('Connected: ', socket.id);

  socket.on('robotExecutionJobs', (robotId) => {
    socketController.getRobotCode(robotId).then((robotCode) => {
      io.emit('robotExecution', robotCode);
    });
  });
};
