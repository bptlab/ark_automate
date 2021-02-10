# How to start a robot
Users should be able to start the Bots from a designated Interface where all that users Bots are listed. The user then should be able to pass in parameters needed for the Bot. 

## Planned functionality
Starting the Bot will be a task provided of the backend or a fully separate component in the long term. Since this communication will most likely continue our decision of using express, the communication will happen through request paths. 
Once those have been created for use from the inside of the system, it should (as of my understanding of the topic) be relatively easy to extend those paths for use from external services. 
Doing so would allow us to offer an accessible API through which 3rd party services could be able to start bots and retrieve the results.

My recommendation would therefore be to focus on the internal trigger functionality, which would allow for externat triggers based upon that, once there is a need for it.

## Where the Bots run
From a usability standpoint bots should be run in the cloud in the long run. To accomodate for the goals of the BP we should have the Bots run on the local machine of a user.
This could be accomplished by installing a light-weight client software on the users pc, which also takes care of installing python and the necessary installation of the robot framework.

My recommendation would be to create this client software as lightweight as possible, such that it needs to be set up once and from then on runs in the background once opened, so that the user can do everything through the web interface.
The user should at any point have the option to install the client software and link it, but should get a popup urging him/her to do so, once the user tries to run a Bot. A simiplar approach can i.e. be seen with the Postman web client, which only allows additional functionality, if the companion app has been installed locally on the machine.
Additionally it would be best to for now only allow users to run bots on their own machines. That way, a single user can only run one Bot at a time, but we keep the security as easy as possible and have a system that we can build upon in the future.
When switching strategies and following the local execution path for Bots longer down the road it could be a thought to use a filter mechanism which would allow the execution of mutually exclusive Bots at the same time.

I would recommend an infrastructure that would looke like the following diagram:

![](https://i.imgur.com/OV6onHa.png)
![](https://i.imgur.com/dMtsdwm.png)


# Orchestrating Bots
I will provide a list with considerations for and against taking care of the orchestration of Bots within our software.

Pro:
* Allows for more deeply integrated functionality, such as statistics
* A single user would increase productivity when running multiple Bots at the same time 

Con:
* Would require additional authentification issues related to running the Bots on the local machine of different users, such as "Who should be allowed to run a Bot on whose computer?"
* In my opinion this only makes sense **after** the foundation has been layed through the possibility of a single person running multiple Bots at the same time, which as far as my understanding and knowledge goes, would be when the Cloud is available for running the Bots in there
* Outsourcing the orchestration would allow to focus more on the core functionality and should be fairly easy to do once the APIs have been opened to external services to start Bots

My recommendation would be to not take care of the orchestration in-house, but rather let external services take care of that (for now). I can see the benefits, which would especially help the management level through statistics and extended information, but I do not think that the orchestration should be of priority because of the rabbit hole that we might fall into security-wise.