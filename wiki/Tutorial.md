# Tutorial

> This tutorial will walk you briefly through the interface and you will build your first RPA bot using Ark-Automate.

## Preparation

To follow this tutorial, you can either [set up a local instance](https://github.com/bptlab/ark_automate#installation--setup) of Ark, or use the provided test instance at https://ark[.dot]voelker[.dot]dev.
(This instance might be reset at any time and may contain information from previous users. Also, you can only model with the test instance, but not run bots.)

If you use a local installation, go to http://localhost:3000/ to open the web interface of Ark.

## Part 1: Create a new bot

At the start page, click the orange "Go to my Robots" button to open the overview page.
Here, you can see all currently available bots.

1. Click on "Create new Robot". A new tile titled "New Robot" will appear in the list.
1. Hover over the new tile and click the _edit_ button that appears right next to "New Robot" and give your new bot an expressive name and press _enter_ to save.
1. Now, still while hovering over the tile, click the big _edit_ button located between the _play_ and _delete_ button. Now, the modeler interface should open.

## Part 2: Model the new bot

Using this modeler interface, you can now model the newly created bot.
In this case, a BPMN-like modeler is provided.

1. Start modeling by adding a new task to the workflow, either by dragging the task icon from the left bar and connecting it to the start event, or by first clicking on the start event and then on the appearing task icon.
1. Click on the newly created task and a configuration panel will appear on the right hand side.
1. Enter an activity name in the upper text field, e.g., "Open Browser". As you type you will see the name also appear as a label in the BPMN diagram.
1. Now, the actual RPA functionality must be configured for this task. For this, click on the dropdown "Actions"→"Please select application" below the text field and choose "Browser.Selenium".
1. As soon as the application to automate was selected, the lower dropdown "Please select task" becomes enabled. Click it and select "Open Chrome Browser".
1. After the task to automate in the chosen application was selected, all available configuration parameters are displayed. For now, it is sufficient to enter a value for "url", such as `https://github.com/bptlab/ark_automate`.
1. Now, click on some empty space in the model and click on the "Save changes to cloud" button on the right hand side.
1. To view the so far modeled bot in Robot Framework program code, click on "Robot Code" in the navigation bar at the top. Here, you can see that currently one task is configured (E.g., "Open Browser") and you can see the command to open the browser as well as the url you just configured. If you want, you can also edit the url here, click on "Save changes to cloud".
1. Go back to the "Modeler" view. If you have changed the url in the previous step, you should see the updated value if you click on the task.
1. Add another task and give it a name, such as "Make Screenshot".
1. Configure the task with "Browser.Selenium" and "Screenshot". Leave the value for "locator" empty and click on the small lock symbol next to the input field for "filename".
   > The lock symbol indicates that a value is not hard coded into the robot, but has to be specified by the user each time the bot is started.
1. Click on "Save changes to cloud".

## Part 3: Execute Bot

> If you are using the online test instance, you can follow this part until step 3.

1. In the top navigation bar, click on "Overview". Here you can see all available bots again, including the one you created in part one.
1. Hover over your bot and click on the _play_ button that appears. The "Robot Interaction Cockpit" will open.
1. As we have configured the last task to have a value that must be specified at start, an input field for the filename of the screenshot task appears. Enter a filename to store the taken screenshot in.
1. Now, click "Execute Robot". The cockpit will now show the progress of the tasks contained in the bot and signals as soon as all steps have been completed.
1. Check the filepath you have provided at the start of the robot!

> Now you have seen the major parts of Ark Automate. Feel free to create more complex automations, file issues for problems and ideas, or contribute to the project!
