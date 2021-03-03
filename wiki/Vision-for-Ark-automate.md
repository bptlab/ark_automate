# Vision until summer 2021

### Pitch
<details><summary>What can be achieved with our software at the end of the project?
</summary><p>

**Customer view**
> Using Ark_automate users can automate business or everyday processes by simply sketching the steps of their process. By using simple flowcharts or powerful BPMN in their process outlines, users can create small software solutions using RPA that finish their tasks much faster and more reliably.


**Technical view**
> Using Ark_automate users can build their own digital coworkers by visualizing business or everyday processes and automating these using robotic process automation (RPA). The digital coworkers request files or help whilst working on their own tasks which have been taught to them through the multiple modeling notations available.
</p></details>

___


### Until summer 2021 we want to implement a **first working web-app** for our use case.

<details><summary>This includes the following</summary><p>

- **user management**
    - comfortable user log-in
    - only single-user accounts, no organizations
- **different front-ends** to create bot flows
    - BPMN-editor (`bpmn.js`)
    - code-editor (edit `.robot`-code)
    - (if possible one more frontend-editor)
- many applications are supported with **RPA tasks**, only a few tasks work via an **API**
- created bots are **running locally**; for this purpose, we provide an Ark Automate **local client**
- users can **interact** with the bots by...
    - ... starting the bots via our control interface of the web app
    - ... viewing basic statistics in the control interface of the web app
    - ... by using an API (especially for external companies)

</p></details>


___

If you are interested in our 5-year vision, please contact us to get access to the file.
Our vision with architecture and limits is stored on [HackMD](https://hackmd.io/@toUukITjSM6oWi52UMDSkA/Bk4kOnoqw).

# Architecture

![2021 Architecture](https://i.imgur.com/sFWWI9L.png)

The **main architectural benefit** will be the modularity and interchangeability of the single components within the system.
As the main platform will be created as a single web application, all system components are accessible through a **single browser**.  

### Describing the interaction and the components
<details><summary>More detailed description</summary><p>


That way a **Low-Code RPA-Developer** can build new robots in the `Web-Browser` using the `Modelling Interface` with the mentioned multiple modeling tools.  

About our **Database-Structure:**
- The `Robot Repository` is where all created robots are stored and are available for the users to retrieve and make changes.
- The `RPA-Activity-Storage` stores all activities that can be automated with our software.
- The `User-Data-Storage` stores all the user's data, such as login details, personal settings etc., so that the user can work with the same status of the software on any device.

**Customers** can start the robots via the `Control-Interface` in their `Web-Browser`. There they can also view basic statistics about the individual robots. This interface also allows the **RPA developers** to execute the robots, since they also have all the permissions of the end users.

In addition, an `API` is provided to  the robots. External companies can use this to start robots in our system. Also, in the future, our robots could be controlled via this `API` through  control and the IoT, for example.

To start robots or to get further information about executed robots, there is a communication with the `Robot Coordinator Backend`.
This entire interaction is managed via a `Trigger-Interface`. This central interface ensures the modularity and expendability of the system.

The `Robot Coordinator Backend` interacts with the `Local Client` and launches the bots on the local machine. In addition, the backend gets all the information it needs from the database.


</p></details>






# Using Ark_automate
Here we state how Ark_automate is supposed to be used and which individual steps happen (on an abstract layer).

### Individual steps that occur when interacting with our software

<details><summary>See this sequence diagram regarding bot creation flow</summary><p>

![](https://i.imgur.com/cmV4nQX.png)


[Sourcecode](https://sequencediagram.org/index.html#initialData=C4S2BsFMAICEHtjQMYCdIENTwHbQGbjwDuAUKRssPKtAKIC265ADhqqMiGzkgGKpcwSDgAmrdp24ZecSgGsR4ilRAA3LDEbNtkALQA+AUKUAuAPIsR0AOqQARgGcwkFaA3Dox3ktLfhYob+ZgBKSpC0xJDgyPAMMGwA5q7Q0KKYqh4wwWLkpPAsSACqjhHQABYYjtAArqW0lLE1vKSpukGCPmKm0AAy8IkgeNS19dCN8M3AreOZml6dAcqpOaKGBrAKZgBqESD4AJ6jZWiQ6bwgGOCOM5Tu85vIirkri0oAPHp6j8+ipmHAGqoPBqPb4EDILAgXCkdJ3dQPLYvehMSCfVamADCuHBqAY0EcNWQyEgjkc+Bq4HABJAiTwQxmcLmnlW5F8pHaRje3Us1gAsvB0lBUG4ESzucpVh0TN0wmIygKhRFYRl7uKZcpyJyMZjyvB4KVoAxBdEholoDhEFCYfCsgsNeQpVyNf9wrRjUKzdBqPBrirbfNWeQiAVoCxBCSyUaTVSvZakOCcCBHOUzqQAJAFJB1MrEZOp6ojDCiUTjDj7O4zNqo6VdP7F0se004c3x614SSQfCV1KpAPquvkdNOjE1FiiebOFtQAmTVAk6DwfDe1A1YDlKtpVVi7IS8i96C+TOFY6RfOk73wcYTk+SCtUcZiMugbsPyAAD2TwBuB+1EtMpRQA+d6vtMB79ruDqbseSC2mARyAZAVBpgeqH2nW6w-GYADikCwRoIDgBg9gziEAAKACC4wsCwP5ob2EFyE8vj0b2qyfN8SJ-ACQIdgRREkTAGA0XRrFMmqMBYbk0FHsOEq1ksrryrQzjpPY7Cbge4k7uhSz7qxWantAeYpheIzIJULZCeWoHQEMNJqewj6lnBwBHMmBLREhwjiKxvaGTmZ6mYWV4WTIyTQORVHCSwmmsX+LoAMpeQ+UXUbFfngcykGDnF9Ejv+Y4Tp4U6JDOjhzguS4rmuG6ZWx8kGBsXGmLh+EYIRxEzsAVTyNU+A0OlGbpumswSUxvx5Wh7FfFJ3F4bx4z8V1MA9Y4fVTah2l2nNjqNRicrpA0y2Cd6vU3NtgZ7ptqRKNAN2LiegXGeeIUoJZEVpWt8jOZFlHpXZ1SIchvn1Si6AKWYyVAUgaUACq9Q9fbZbp7Jg6jgTOnWphFZOZrlZVMDVcAq7rkjGNrE1c2tXhS0dQJM5DCwa5huwGDxMIqD9YN33k4xu3ozNnHMbKC3AmGBrOKdTMs2wqDs3hESiZll2eALYOGQj60VFUdk4MzSBywrnPK2DBUuodZQy4bbMc2U4LRKIpvo-Vqs5Xp+n1SxmV3Q9AVjCZBaXtepbW6z8t2w0T5pTFgOeTDZy-V9vVx8DPnkwl2PQAAkvrLPJ9rYdG5HfMo6ygv7YV4549OMAVUCVXLiTtXk27FMPb79V5Z3va+Oy-tW0DtI4InDLVhDTUYolGCgnAiDk8j41Bq8GqYS10+z-YiDB89ExTLcKPq0L1PYjguL4olRKRnRbfq7oHE6jiIB4gSV+ks7flt0GShAA)
</p></details>

<details><summary>See this sequence diagram regarding bot interaction via control interface</summary><p>

### Regarding the control interface
**We agreed on the following functionalities for the control interface until Summer 2021:**
- Starting bots
- Passing of parameters
- View Logs of recent runs
    - Optionally could be enhanced statistics regarding the bots

**In the long term vision we want additional functionalities like:**
- Live interaction with bots
- Bots request files, ask for help and generate to-dos for humans
- Bots functioning as Real-Time assistants (live chat)

![](https://i.imgur.com/pd8yRXP.png)


[Sourcecode](https://sequencediagram.org/index.html#initialData=C4S2BsFMAIHVIEbQMIHsB2wBOrzQJKaRYBmAhgMYwBi4qA7gFCOXCpbQBCxwZzADmSygKIQZmjUcRdABMBQkWLITOlANaQ5C4SFHjg0ADKoKZPMnAgtwZiwqgAbmWAxuwvu94BaAHxSMVzkALgB5fi04RABnMEhGaGhWEGdXSWkg+UYAmVk-HMzggCUtWWJoekhwClQAWxhBAHN4xLLk1JoM0uZUfkMAVWjygAsyaOgAVyGOShqJzASuHjJ8rpDjVEaQdGg2SemkijmFxPaXTsDuxYLSv181Ck0QgDViEBIAT33yiixIMswIHM0UWZzSDye8kSNzkAB5vN4IaVipBgBMsDtHG8SHoXCAMMxWpAwW4NN1El4yPCYbJgmh0DisLVoNEJkdINFoiQJuA8LFGjttos2g4Uud0pdtMxKatJbTwpE0I9+GBQaKOhLcswabLcii5OUleoVbYiSTNZk7IwZf41vKIjsEKhDKEsVhHNYmOaadq7XckSEAOKo6BOwwAWVRZFkLj45oDWRp8MRZJCJTRGNDzugkd4Md4jBFTnFCd9ct1hRKBo4Yegz09heJ6vFPp6fWgg3K9BA0WGHN2qBZvGEWdNSw8FeRAGVh4Yw2ri2lW9C-fdU7SZ4pRwuxeD14sE34TGYLFYbMFNyP56dm2lj+YUGeTlx18n76frJhgvwcB6yqPoCweZAI5HlgBBM1bxgd9H0-MckwRBNv1-EB-1rICdj+VlwHA4Um0XUlHnJC1bltOVgj+asQOw3DIIIkipVKaBGG6ItdzcZZGCAA)

</p></details>

<details><summary>See this sequence diagram regarding starting a bot</summary><p>

See [here](https://github.com/bptlab/ark_automate/wiki/Starting-and-orchestrating-Bots-(Vision)#where-the-bots-run)



</p></details>

### Individual steps of the user that occur when interacting with our software
<details><summary>See our Use-Case diagram</summary><p>

![](https://i.imgur.com/FakYLAh.png)



</p></details>

### Which steps happen in the software?
<details><summary>See list</summary><p>

- Displaying of modeling interfaces
- Getting the available RPA tasks and apps from the server
- Providing an interface to expand activities with RPA apps, tasks, and properties
- Parsing BPMN to SSOT (and back)
- Parsing other modeling notation (flowchart f.e.) to SSOT (and back)
- Parsing SSOT to .robot (reverse not in scope)

</p></details>
