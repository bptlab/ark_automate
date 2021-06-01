# How the approach with socket.io was implemented on our platform

**Desktop app:**
Here we implemented a CLI that reads the userId the user enters, saves the userId and uses the userId as an authentication for the communication with the web app server. Once started, the desktop app connects with the server by using a socket connection. A socket connection is this bidirectional connection that exist between every client and server. Moreover we use the userId the user entered and ask the server if this socket connection can join the room userId (we have one room for every userId). Once the socket connection was added to the userId room we wait for robots to be executed. Because we are in the userId room we receive robot execution jobs of web frontends that are connected to the same room.

**Database/Server:**
We implemented a jobs collection in MongoDB as well as a Mongoose jobs model. Every job has a robotId, a userId, a status (waiting/executing/success/failed) and an array of parameters that contains the arguments the user entered in the web frontend when starting the robot execution.

**Server:**
Sets up a server and socket instance, establishes socket connection with the web frontend and the desktop app, groups sockets by userIds (by using the room concept), reacts on robot execution commands and forwards this command to the desktop app and updates the jobs collection in MongoDB continiously.

**Web Frontend:**
Connects with the server using a socket connection. Also, like the dektop app, we join a userId specific room whenever the robot overview is rendered. Additionally, we send a robot execution job to the backend when the user clicks on the play button in the robot container.

## Why we Use Socket.io

In the end, we decided for socket.io as it is open-cource, well-supported, 'easy' to use, robust and websocket based enabling a bidirectional communication.
To get started it is recommended reading [this](https://socket.io/docs/v4/index.html) introduction to socket.io. Especially these two subpages [1](https://socket.io/docs/v4/server-socket-instance/) & [2](https://socket.io/docs/v4/client-socket-instance/) are relevant for this usecase.
