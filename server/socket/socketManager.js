const socketController = require('./socketController');

const users = ['80625d115100a2ee8d8e695b'];

exports.socketManager = (io, socket) => {
  console.log('Connected: ', socket.id);

  socket.on('joinUserRoom', (userId) => {
    if (users.includes(userId)) {
      socket.join(userId);
      socket.emit(
        'successUserRoomConnection',
        `You have connected to the user room ${userId}`
      );
      io.to(userId).emit(
        'newClientJoinedUserRoom',
        `New user has been connected to the room`
      );
      socketController.getAllJobsForUser(userId).then((jobList) => {
        if (jobList.length > 0) {
          jobList.forEach((job) => {
            const { id, robot_id } = job;
            socketController.getRobotCode(robot_id).then((robotCode) => {
              socketController.updateRobotJob(id, 'executing');
              io.to(userId).emit('robotExecution', { robotCode, jobId: id });
            });
          });
        }
      });

      // eslint-disable-next-line no-else-return
    } else {
      socket.emit('errorUserRoomConnection', 'Invalid userId: ', userId);
    }
  });

  socket.on('robotExecutionJobs', ({ robotId, userId }) => {
    const clients = io.sockets.adapter.rooms.get(userId);
    const numClients = clients ? clients.size : 0;
    if (numClients > 1) {
      // Save job to db with status executing and execute robot
      socketController
        .createJob(userId, robotId, 'executing', [
          {
            name: '',
            value: '',
          },
        ])
        .then((jobId) => {
          socketController.getRobotCode(robotId).then((robotCode) => {
            io.to(userId).emit('robotExecution', { robotCode, jobId });
          });
        });
    } else {
      // Save job to db with status waiting
      socketController.createJob(userId, robotId, 'waiting', [
        {
          name: '',
          value: '',
        },
      ]);
    }
  });

  socket.on('updatedRobotJob', ({ jobId, status }) => {
    socketController.updateRobotJob(jobId, status);
  });
};
