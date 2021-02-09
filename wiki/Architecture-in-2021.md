![2021 Architecture](https://i.imgur.com/sFWWI9L.png)

The **main architectural benefit** will be the modularity and interchangability of the single components within the system. 
As the main platform will be created as a single web application, all system components are accessible through a **single browser**.  

That way a **Low-Code RPA-Developer** can build new robots in the `Web-Browser` using the `Modelling Interface` with the mentioned mutiple modeling tools.  

About our **Database-Structure:**
- The `Robot Repository` is where all created robots are stored and are available for the users to retrieve and make changes.
- The `RPA-Activity-Storage` stores all activities that can be automated with our software. 
- The `User-Data-Storage` stores all the user's data, such as login details, personal settings etc., so that the user can work with the same status of the software on any device.

**Customers** can start the robots via the `Control-Interface` in their `Web-Browser`. There they can also view basic statistics about the individual robots. This interface also allows the **RPA developers** to execute the robots, since they also have all the permissions of the end users.

In addition, an `API` is provided to  the robots. External companies can use this to start robots in our system. Also, in the future, our robots could be controlled via this `API` through  control and the IoT, for example.

To start robots or to get further information about executed robots, there is a communication with the `Robot Coordinator Backend`.
This entire interaction is managed via a `Trigger-Interface`. This central interface ensures the modularity and expandability of the system.

The `Robot Coordinator Backend` interacts with the `Local Client` and launches the bots on the local machine. In addition, the backend gets all the information it needs from the database.