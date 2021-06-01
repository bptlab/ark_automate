/* eslint-disable camelcase */
const socketHelperFunctions = require('./socketHelperFunctions');

exports.socketManager = (io, socket) => {
  // eslint-disable-next-line no-console
  console.log('Client connected via socket: ', socket.id);

  /*  When a client wants to join a room we check if the roomId (userId) matches any of the userIds in the database.
  Once connected we check for waiting jobs and if available send them to the client to execute */
  socket.on('joinUserRoom', (userId, clientType) => {
    socketHelperFunctions.getAllUserIds().then((users) => {
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
        if (clientType !== 'webApplication') {
          socketHelperFunctions
            .getAllWaitingJobsForUser(userId)
            .then((jobList) => {
              if (jobList.length > 0) {
                jobList.forEach((job) => {
                  const { id, robotId } = job;
                  socketHelperFunctions
                    .getRobotCodeForJob(robotId, id)
                    .then((robotCode) => {
                      if (robotCode) {
                        socketHelperFunctions.updateRobotJobStatus(
                          id,
                          'executing'
                        );
                        io.to(userId).emit('robotExecution', {
                          robotCode,
                          jobId: id,
                        });
                      } else {
                        socketHelperFunctions.updateRobotJobStatus(
                          id,
                          'failed'
                        );
                      }
                    });
                });
              }
            });
        }
      } else {
        socket.emit('errorUserRoomConnection', 'Invalid userId: ', userId);
      }
    });
  });

  /*  Gets triggered when the web client wants to execute a robot. We check if a desktop client is available. We either execute 
  the robot immediately and add a job to the database with status executing or we just add a job to the database with status waiting  */
  socket.on('robotExecutionJobs', ({ robotId, userId, parameters }) => {
    const clients = io.sockets.adapter.rooms.get(userId);
    const numClients = clients ? clients.size : 0;
    if (numClients > 1) {
      socketHelperFunctions
        .createJob(userId, robotId, 'executing', parameters)
        .then((jobId) => {
          socketHelperFunctions
            .getRobotCodeForJob(robotId, jobId)
            .then((robotCode) => {
              io.to(userId).emit('robotExecution', { robotCode, jobId });
            });
        });
    } else {
      socketHelperFunctions.createJob(userId, robotId, 'waiting', parameters);
    }
  });

  socket.on('updatedLiveRobotLog', ({ userId, jobId, robotLogs }) => {
    io.to(userId).emit('changedRobotStatus', 'running');
    if (robotLogs.finalMessage === 'Execution completed') {
      socketHelperFunctions.updateRobotJobStatus(
        jobId,
        robotLogs.robotRun.status === 'FAIL' ? 'failed' : 'successful'
      );
      io.to(userId).emit(
        'changedRobotStatus',
        robotLogs.robotRun.status === 'FAIL' ? 'failed' : 'successful'
      );
      if (robotLogs.robotRun.status === 'FAIL') {
        socketHelperFunctions.updateRobotJobErrors(jobId, robotLogs);
      }
    }
    io.to(userId).emit('changedRobotRunLogs', robotLogs);
  });
};
