# Pitch
<details><summary>What can be achieved with our software at the end of the project?
</summary><p>

**Customer view**
> Using Ark Automate users can automate business or everyday processes by simply sketching the steps of their process. By using simple flowcharts or powerful BPMN in their process outlines, users can create small software solutions using RPA that finish their tasks much faster and more reliably.


**Technical view**
> Using Ark Automate users can build their own digital coworkers by visualizing business or everyday processes and automating these using robotic process automation (RPA). The digital coworkers request files or help whilst working on their own tasks which have been taught to them through the multiple modeling notations available.
</p></details>

If you are interested in our 5-year vision, please contact us to get access to the file.
Our vision with architecture and limits is stored on [HackMD](https://hackmd.io/@toUukITjSM6oWi52UMDSkA/Bk4kOnoqw).

# Current Architecture

![Current Architecture](https://user-images.githubusercontent.com/36270527/120189142-4144db00-c217-11eb-921e-1f9954666944.png)


The **main architectural benefit** will be the modularity and interchangeability of the single components within the system.
As the main platform will be created as a single web application, all system components are accessible through a **single browser**.  

### Describing the interaction and the components
<details><summary>More detailed description</summary><p>


That way a **Low-Code RPA-Developer** can build new robots in the `Web-Browser` using the `Modelling Interface` with the mentioned multiple modeling tools.  

About our **Database-Structure:**
- The `Robot Repository` is where all created robots are stored and are available for the users to retrieve and make changes.
- The `RPA Activity Storage` stores all activities that can be automated with our software.
- The `User Data Storage` stores all the user's data, such as login details, personal settings etc., so that the user can work with the same status of the software on any device.
- The `Robot Job Storage` stores the execution information for each bot like status, user and error messages.

**Customers** can start the robots via the `Control Interface` in their `Web Browser`. There they can also view basic statistics about the individual robots. (Currently not implemented) This interface also allows the **RPA developers** to execute the robots, since they also have all the permissions of the end users.

In addition, an `API` is provided to  the robots. External companies can use this to start robots in our system. Also, in the future, our robots could be controlled via this `API` through  control and the IoT, for example.

To start robots or to get further information about executed robots, there is a communication with the `Robot Coordinator Backend`.

The `Robot Coordinator Backend` interacts with the `Local Client` and launches the bots on the local machine. In addition, the backend gets all the information it needs from the database.


</p></details>

# Using Ark Automate
Here we state how Ark Automate is supposed to be used and which individual steps happen (on an abstract layer).

### User interaction with our software: Use Case Diagram
<details><summary>See our Use Case Diagram</summary><p>

![Use Case Diagram](https://i.imgur.com/FakYLAh.png)

</p></details>

### Which steps happen in the software?
<details><summary>See list</summary><p>

- Displaying of modeling interfaces
- Getting the available RPA tasks and apps from the server
- Providing an interface to expand activities with RPA apps, tasks, and properties
- Parsing BPMN to SSOT (and back)
- Parsing other modeling notation (flowchart f.e.) to SSOT (and back)
- Parsing SSOT to .robot (and back)

</p></details>
