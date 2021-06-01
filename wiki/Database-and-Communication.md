# Database and Communication

We are using a MongoDB database to which we connect through our backend using the Mongoose Library/Module.

## How to communicate with the database

If you plan to create a CRED operation which should be available for the frontend, please consider to create a path in the backend, which can then be called from the frontend.
In the backend please use the mongoose module to make a callout to the database in question. For most use cases our standard database should be used, which can be connected to through the MONGODB_URI environment variable in our code.

## Models

If you are planning on creating a new document type (called model from now on), please create a javascript file in the modules directory on the server side. There you can specify the schema for objects of that type and also create the model and specify, which collection should be used if not that of the name of the model that you specify.
This can be a bit confusing at first, but you could think of it like this: The schema defines what fields are of what type. The model then assigns this a name and registers it for use. Mongoose will always try to retrieve objects from the remote db from a collection which has the same name as the one specified when creating the model, but this can be overwritten as mentioned.

## Testing

To simulate a local copy of the mongodb instance, we are using the mongodb-memory-server module. That way we can have a controlled environment for our tests.
One such example can be observed on the server side in the MongoDbManager.js which creates a local database instance, populates it and then switches the environment variable, so that all requests will be made against this database mock.

For the future we should consider to refactor the MongoDbManager.js file to allow for usage with multiple test cases for any objects on the backend side.
Until then, please keep in mind to connect to a local instance the way it is done in that file. Other ways might cause the first test after setup of any testclass to fail. If you want to read up on this issue, please have a look [here](https://github.com/nodkz/mongodb-memory-server#several-mongoose-connections-simultaneously) under _Note: When you create mongoose connection manually_.

## Tutorial

For an additional tutorial on how to use Mongoose, please have a look [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose).
