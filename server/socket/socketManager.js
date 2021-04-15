const socketHelperFunctions = require('./socketHelperFunctions');

exports.socketManager = (io, socket) => {
  console.log('Client connected via socket: ', socket.id);

  /*  When a client wants to join a room we check if the roomId (userId) matches any of the userIds in the database.
  Once connected we check for waiting jobs and if available send them to the client to execute */
  socket.on('joinUserRoom', (userId) => {
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
        socketHelperFunctions
          .getAllWaitingJobsForUser(userId)
          .then((jobList) => {
            if (jobList.length > 0) {
              jobList.forEach((job) => {
                const { id, robot_id } = job;
                socketHelperFunctions
                  .getRobotCode(robot_id)
                  .then((robotCode) => {
                    socketHelperFunctions.updateRobotJobStatus(id, 'executing');
                    io.to(userId).emit('robotExecution', {
                      robotCode,
                      jobId: id,
                    });
                  });
              });
            }
          });

        // eslint-disable-next-line no-else-return
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
            .getParameterObjects(robotId)
            .then((parameterObjects) => {
              console.log('parameterObjects ', parameterObjects);
              // Evtl als eigene Funktion auslagern
              Array.prototype.map.call(parameterObjects, (parameterObject) => {
                if (parameterObject.rpaParameters.length !== 0) {
                  Array.prototype.map.call(
                    parameterObject.rpaParameters,
                    (rpaParameter) => {
                      Array.prototype.map.call(parameters, (parameter) => {
                        if (
                          String(parameter.parameterId) ===
                          String(rpaParameter._id)
                        ) {
                          rpaParameter.value = parameter.value;
                        }
                      });
                    }
                  );
                }
                console.log('parameterObject ', parameterObject);
                socketHelperFunctions.updateParameterWithUserInput(
                  parameterObject
                );
              });
              socketHelperFunctions.getRobotCode(robotId).then((robotCode) => {
                console.log('robotCode ', robotCode);
                io.to(userId).emit('robotExecution', { robotCode, jobId });
              });
            });
        });
    } else {
      socketHelperFunctions
        .createJob(userId, robotId, 'waiting', parameters)
        .then((jobId) => {
          Array.prototype.forEach.call(parameters, (parameter) => {
            console.log('parameters ', parameters);
            socketHelperFunctions.updateParameterValue(
              parameter.id,
              parameter.value
            );
          });
        });
    }
  });

  socket.on('updatedRobotJobStatus', ({ jobId, status }) => {
    socketHelperFunctions.updateRobotJobStatus(jobId, status);
  });
};
