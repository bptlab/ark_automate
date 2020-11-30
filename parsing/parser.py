import json

# this should be mapped
def taskLib(app):
    if (app == "Excel"):
        return "RPA.Excel.Files"
    if (app == "Browser"):
        return "RPA.Browser"

with open('convertedModel.json', 'r') as modeljson:
    model = modeljson.read()

# load json as dictionary
model_dict = json.loads(model)

# open robot file - change w to x when new files should be created
robotFile = open("parsedFile.robot", "w")

bpmnTasks = model_dict["definitions"]["foo"]["process"]["task"]

# create Settings statements
robotFile.write("*** Settings ***\n")
robotFile.write("Documentation  Our first parsed RPA\n")

# collect apps being used
applicationList = []
for bpmnTask in bpmnTasks:
    rpaApp = bpmnTask["extensionElements"]["properties"]["property"][0]["_value"]
    if (rpaApp not in applicationList):
        applicationList.append(taskApp)

# import librarys needed for apps
for app in applicationList:
    robotFile.write("Library    " + taskLib(app)+"\n")
robotFile.write("\n")


robotFile.write("*** Tasks ***\n")

# print code for each task
for bpmnTask in bpmnTasks:
    # idealy we use the keyword statement for each task, currently not working out of the box
    # robotFile.write("*** Keywords ***\n")
    robotFile.write(task["_name"]+"\n")
    rpaTask = bpmnTask["extensionElements"]["properties"]["property"][1]["_value"]
    rpaTaskProps = bpmnTask["extensionElements"]["properties"]["property"]
    
    # this should be refactored to a dictonary
    if rpaTask == ("Open Browser"):
         robotFile.write("   Open Browser    "+ rpaTaskProps[2]["_value"]+"\n")
    if rpaTask == ("Open Workbook"):
        robotFile.write("   Open Workbook   "+ rpaTaskProps[2]["_value"]+"\n")
    if rpaTask == ("Set Worksheet Value"):
        robotFile.write("   Set Worksheet Value  "+rpaTaskProps[2]["_value"]+"  "+rpaTaskProps[3]["_value"]+"  "+rpaTaskProps[4]["_value"]+"\n")
        robotFile.write("   Save Workbook")
    
    robotFile.write("\n")
