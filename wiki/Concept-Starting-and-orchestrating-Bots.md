# How to start a robot

Users should be able to start the Bots from a designated Interface where all that user's Bots are listed. The user then should be able to pass in parameters needed for the Bot.

## Planned functionality

Starting the Bot will be a task provided of the backend or a fully separate component in the long term. Since this communication will most likely continue our decision of using express, the communication will happen through request paths.
Once those have been created for use from the inside of the system, it should (as of my understanding of the topic) be relatively easy to extend those paths for use from external services.
Doing so would allow us to offer an accessible API through which 3rd party services could be able to start bots and retrieve the results.

My recommendation would therefore be to focus on the internal trigger functionality, which would allow for external triggers based upon that, once there is a need for it.

## Where the Bots run

From a usability standpoint, bots should be run in the cloud in the long run. To accommodate for the goals of the BP we should have the Bots run on the local machine of a user.
This could be accomplished by installing light-weight client software on the user's pc, which also takes care of installing python and the necessary installation of the robot framework.

My recommendation would be to create this client software as lightweight as possible, such that it needs to be set up once and from then on runs in the background once opened so that the user can do everything through the web interface.
The user should at any point have the option to install the client software and link it but should get a popup urging him/her to do so, once the user tries to run a Bot. A similar approach can i.e. be seen with the Postman web client, which only allows additional functionality if the companion app has been installed locally on the machine.
Additionally, it would be best to for now only allow users to run bots on their machines. That way, a single user can only run one Bot at a time, but we keep the security as easy as possible and have a system that we can build upon in the future.
When switching strategies and following the local execution path for Bots longer down the road it could be a thought to use a filter mechanism that would allow the execution of mutually exclusive Bots at the same time.

I would recommend an infrastructure that would look like the following diagram:

![](https://i.imgur.com/OV6onHa.png)
![](https://i.imgur.com/dMtsdwm.png)

# Orchestrating Bots

I will provide a list with considerations for and against taking care of the orchestration of Bots within our software.

Pro:

- Allows for more deeply integrated functionality, such as statistics
- A single user would increase productivity when running multiple Bots at the same time

Con:

- Would require additional authentification issues related to running the Bots on the local machine of different users, such as "Who should be allowed to run a Bot on whose computer?"
- In my opinion this only makes sense **after** the foundation has been laid through the possibility of a single person running multiple Bots at the same time, which as far as my understanding and knowledge goes, would be when the Cloud is available for running the Bots in there
- Outsourcing the orchestration would allow focusing more on the core functionality and should be fairly easy to do once the APIs have been opened to external services to start Bots

My recommendation would be to not take care of the orchestration in-house, but rather let external services take care of that (for now). I can see the benefits, which would especially help the management level through statistics and extended information, but I do not think that the orchestration should be of priority because of the rabbit hole that we might fall into security-wise.

# Communication with ark automate dektop app

Multiple concepts could be applied in the case of ark_automate

1. Polling and Long-Polling
2. Websockets
3. Server-sent events
4. Higher Abstraction Frameworks

### Polling and Long-Polling

Polling is an approach where the desktop app would permenantly 'ask' that there is a new robot to execute. Although it is quite easy to implement, the performance is bad.
Long Polling aims to solve the performance issue by just 'asking' one time and waiting for an answer. The desktop app would 'ask' the server again after a fixed periode of time if the server does not have any new robots to execute. In principle a great approach but it lacks support of frameworks one could use and implementing it from scratch would be too time consuming

### Websockets

When using websockets we would open a bidirectional communication channel between the server side and the client side. This is a great solution because real time communication is possible. Still, it is time consuming to implement and a successful connection is not always guaranteed as either element (proxy, firewall, …) prevent WebSocket connections between the client and the server or the browser does not support it yet.

### Server-sent events

This is an approach based on the concept of publish-subscribe. The client (desktop app) would subscribe to a 'channel' and the server would push new events (robots to be executed) on that channel. One of the main problem with SSE is the max of 6 client connections from a single host. Also, it is (subjectively) not the best approach to implement with node.js.

### Higher Abstraction Frameworks

There are some frameworks using one (or more) of these basic approaches but are one abstraction layer higher for the user. In particular, pusher and socket.io were looked at.
Pusher is based on a publish subscribe approach simular to SSE and it seems to be very easy to use. The biggest disadvantage was that it is not open-source but ultimatly one would have to pay for it. Socket.io is a highly popular (> 4 Mio. weekly npm downloads) open source framework. It is mainly based on websocket communication but is also able to seamlessly switch to a long polling approach in the background if websockets do not work.

### Decision

In the end, we decided for socket.io as it is open-cource, well-supported, 'easy' to use, robust and websocket based enabling a bidirectional communication.
To get started it is recommended reading [this](https://socket.io/docs/v4/index.html) introduction to socket.io. Especially these two subpages [1](https://socket.io/docs/v4/server-socket-instance/) & [2](https://socket.io/docs/v4/client-socket-instance/) are relevant for this usecase.

## How the new approach with socket.io was implemented in the ark automate product

**Desktop app:**
Here we implemented a CLI that reads the userId the user enters, saves the userId and uses the userId as an authentication for the communication with the web app server. Once started, the desktop app connects with the server by using a socket connection. A socket connection is this bidirectional connection that exist between every client and server. Moreover we use the userId the user entered and ask the server if this socket connection can join the room userId (we have one room for every userId). Once the socket connection was added to the userId room we wait for robots to be executed. Because we are in the userId room we receive robot execution jobs of web frontends that are connected to the same room.

**Database/Server:**
We implemented a jobs collection in MongoDB as well as a Mongoose jobs model. Every job has a robot_id, a user_id, a status (waiting/executing/success/failed) and an array of parameters that contains the arguments the user entered in the web frontend when starting the robot execution.

**Server:**
Sets up a server and socket instance, establishes socket connection with the web frontend and the desktop app, groups sockets by userIds (by using the room concept), reacts on robot execution commands and forwards this command to the desktop app and updates the jobs collection in MongoDB continiously.

**Web Frontend:**
Connects with the server using a socket connection. Also, like the dektop app, we join a userId specific room whenever the robot overview is rendered. Additionally, we send a robot execution job to the backend when the user clicks on the play button in the robot container.
