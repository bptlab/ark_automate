const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Ark-Automate API',
    version: '1.0.0',
    description:
      '_This document describes the REST API of Ark Automate._<br>Ark Automate is a platform that allows office users and software developers to automate business or everyday processes by simply sketching the steps of their process. By using simple flowcharts or powerful BPMN in their process outlines, users can create small software solutions using RPA that finish their tasks much faster and more reliably.',
    license: {
      name: 'LICENSE (MIT)',
      url: 'https://github.com/bptlab/ark_automate/blob/main/LICENSE.md',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'RPA-Functionalities',
      description:
        'Operations about rpa supported applications, tasks and parameters',
    },
    {
      name: 'Robots',
      description: 'Operations about robots',
    },
    {
      name: 'Users',
      description: 'Operations dealing with the users access to robots',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [
    './api/controllers/*.js',
    './utils/openApiDocumentation/openApiComponents.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
