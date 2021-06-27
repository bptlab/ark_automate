const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require('http');
const socketio = require('socket.io');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const swaggerUi = require('swagger-ui-express');
const rpaFrameworkRouter = require('./api/routes/functionalities/functionalities');
const ssotRouter = require('./api/routes/robots/robots');
const userRouter = require('./api/routes/users/users');
const { socketManager } = require('./socket/socketManager');
const {
  swaggerSpec,
} = require('./utils/openApiDocumentation/docuGenerationHelper');

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

  mongoose.connect(process.env.MONGODB_URI || `mongodb://${process.env.MONGODB_HOST || 'localhost'}/ark`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.use(express.static(path.resolve(__dirname, 'build')));
  app.use(express.json());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/functionalities', rpaFrameworkRouter);
  app.use('/robots', ssotRouter);
  app.use('/users', userRouter);

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
