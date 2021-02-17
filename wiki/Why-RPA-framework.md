# What is the RPA framework?
>"RPA Framework is a collection of open-source libraries and tools for Robotic Process Automation (RPA), and it is designed to be used with both Robot Framework and Python. The goal is to offer well-documented and actively maintained core libraries for Software Robot Developers." - Robocorp

## Already offered functionality by the RPAf
The RPAf already offeres a large suite of supported functionalities and softwares, of which we want to list some here:
* SAP
* Salesforce
* MS Office
* Email
* Pdf
* Image
* Browser
* HTTP request functionality

## Why are we using the RPA framework?
We decided to use the RPA framework (we will use RPAf as abbreviation from now on) after we discovered its platform of offering a basis for easily writable RPA code. The large focus of modularity by the developers made it a well usable library to use since that modularity allowed us to only include the needed libraries in the bots and therefore create them as lightweight as possible.
Additionally the benefit of RPAf is that it is based on python and can also be used with exactly that. This allows for fast and performant extension of the already offered libraries and components by writing code to include needed functionality.
Another benefit we saw in the RPAf was the easy to understand syntax, which was created to allow for fast understanding through the idea of having a well-structured file and a deep integration of code/robot documentation within that code.

## How are we using the RPA framework?
We as ark-auomate have created a metadata format, which we internally call our "single source of truth"(SSoT), which allows us to store information and exchange it throughout multiple modeling interfaces in almost real-time.
This SSoT can be exported into RPAf, just the way it can be used to switch between modeling interfaces. This allows for fast, reliable and error-free parsing of the metadata to create a working robot using the provided libraries of the RPAf.

# Extending the RPA framework
To understand the extensability of the RPAf and understand, how exactly to to so, please see [this link](https://robocorp.com/docs/development-guide/robot-framework/how-to-use-custom-python-libraries-in-your-robots) and the ressources linked on that web page.

## Custom Libraries
As also stated in the link above, it is possible to create custom libraries for use in the RPAf through writing them in the python programming language.
That way, the existing collection of libraries can be extended for the additional use-cases, which have not yet come up, but will eventually in the future. 

## Python code at runtime
Because RPAf allows for easy creation of individual modules and libraries, we could be able to inject python code into the RPAf at runtime.
This could be achieved by an additional parsing step, which would take the user provided code, would create a python file/library out of it and would at the same time automatically generate the keywords for use in the RPAf bot, once the custom library has been implemented and imported.

# Alternatives 
The RPAf follows a unique approach in being open-source, extensible and usable for a plethora of use-cases.
While many other platformas allow for export of the there created bots through XML, they do not offer the documentation in such detail, as RPAf is doing.
Because the goal of this project was to create an open source platform, we took into consideration options we had from teh open source spectrum of existing solutions:
* TagUI: This RPA software allows for easy bot creation using the keywords 'type' and 'click'. This approach is really easy, but would require a graphically oriented interface to display the user which options are available, which would not be optimal of use with our approach of bot-creation through a modeler.
* OpenRPA: Is more focussed on the direction of having people use the internal design tool to create bots. Additionally the documentation is very barebones, which might be caused by the fact that the company standing behind this project also offers commercial support. Overall, it seemed not as easy to work with this project.
* TaskT: When first inspecting this project, it seems like a very similar approach as the RPAf, but at the second look, it becomes clear, that the keywords used and displayed in the editor on TaskT are not only keywords, but only representations for the user to click to reveal the real underlying information. That fact, as well as the ineffective performance while testing caused us to decide against this project to use. 
* UI.Vision: Was initially created as a browser extension, but since has been extended to also allow automation on the desktop. We explicitly want to stress the fact, that it was created with web automation and scraping in mind and therefore works really well for this. For automating desktop applications we ran into problems when trying out this project.

# Feedback on our work with the RPA framework
For us RPAf was the easiest solution to work with. It is very well documented, with no intention to sell premium support, which allowed and still allows us to read into libraries ourself and educate ourself on the topic.
Additionally RPAf was created with the intention in mind of being a written skripting language, instead of being a whole application through which can be automated. This allows us to easily parse our meta model into the skript instead of parsing it into another metamodel (of the RPA software to be used) and then having to load it into that software to have it run. The approach of RPAf to simply create a CLI, create files as you want and just run any file just was way less additional development-overhead.
