const parser = require('./parsing/parser');
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
var bodyParser = require('body-parser');

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());

  app.post('/parse-xml', (req, res) => {
    //parser.parseXML(req.body);
    console.log(req.body);
    res.send(req.body);
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? 'dev server' : 'cluster worker ' + process.pid
      }: listening on port ${PORT}`
    );
  });
}
