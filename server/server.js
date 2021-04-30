const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require('http');
const socketio = require('socket.io');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const rpaFrameworkRouter = require('./api/routes/rpaFramework');
const ssotRouter = require('./api/routes/ssot');
const { socketManager } = require('./socket/socketManager');

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Setup socket.io connection
  const { createServer } = http;
  const { Server } = socketio;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socketManager(io, socket);
  });

  httpServer.listen(Number(PORT) + 1, () => {
    console.error(`Socket server: listening on port ${Number(PORT) + 1}`);
  });

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, 'build')));
  app.use(express.json());

  app.use('/rpa-framework', rpaFrameworkRouter);
  app.use('/ssot', ssotRouter);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });

  app.listen(PORT, () => {
    console.error(
      `Node ${
        isDev ? 'dev server' : `cluster worker ${process.pid}`
      }: listening on port ${PORT}`
    );
  });
}
