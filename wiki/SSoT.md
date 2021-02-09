## What do we need a SSoT for?
The goal of ark is to have multiple interfaces altering/showing the same robot. For each robot there will be a properties panel to change attributes, a view of the current .robot code and possibly multiple modeling interfaces (in the beginning just bpmn). 
The user selects the modeling language he/she prefers and starts modeling the robots behavior (at least for now the user has to pre select the modeling language). At the same time the user can view/change the .robot code of the bot and/or update attributes via the property panel. 
In order to achieve that we need a single-source-of-truth(SSoT) for each robot. In the SSoT all necessary information are saved so that changes can be automatically applied to every interface. 

## How is the SSoT going to be included in the product?
The SSoT itself will be stored on the server side of the product. It will support multiple use cases shown in the following image:
![SSoT in product](https://i.imgur.com/jViSHTQ.png)
With a change of one of the interfaces on the client side (e.g. type in a new name in the side panel) the new data will be send to the SSoT via HTTP and the SSoT on the server side will be updated. Once the SSoT gets updated all the other interfaces update accordingly as they are dependend on the SSoT data.

## How does the SSoT look like?

The SSoT is a JSON File consisting of:
### 1. robotMetadata
Here all the general information regarding the robot are being stored. These information are true regardless of the interface.
### 2. elements
Here all the Elements are being stored. One Element can have multiple representations (e.g. a RPA activity, a BPMN activity, a Flowchart activity...).
Right now the SSoT has three objects stored for each element: "generalAttributes", "rpaAttributes" and "bpmnAttributes".
* **"generalAttributes":**
In this object you find all the information that is relevant for the element independently of the interface (e.g. name). Therefore this object is never empty.
* **"rpaAttributes":**
In this object you find all the information that is relevant if the element is an rpaActivity (e.g. application, task, parameters...). Therefore this object can be empty if we have an element that is necessary for the modeling aspect but is not an rpaActivity (e.g. start event in bpmn).
* **"bpmnAttributes":**
In this object you find all the information that is relevant for the element in the bpmn model (e.g. type, position, ...). Therefore this object is never empty.
## Conventions
Please use camelCase for the naming.
## Code example
**Notes:**
* "otherModelAttributes" is just a placeholder for other modeling interfaces we might add in the future (e.g. flowcharts).
* the position of elements is calculated using the top left corner as x=0 and y=0 _

### SSoT high level:
```
{
  "robotMetadata": {
    "robotName": "exampleRobot",
    "robotCreator": "Max Mustermann",
    "robotCollaborators": ["John Doe", "Random Person"],
    "starterId": "exampleID"
  },
  "elements": [
    {
      "generalAttributes": {
        "name": "exampleName",
        "id": "exampleID",
        "predecessorIds": ["randomId"],
        "successorIds": ["randomId"]
      },
      "rpaAttributes": {
        "application": "e.g. Excel.Files",
        "task": "e.g. Open Workbook",
        "parameters": [
          {
            "name": "Filename",
            "value": "example.xlsx",
            "requireUserInput": true
          },
          {
            "name": "Path",
            "value": "C:/example/",
            "requireUserInput": true
          }
        ],
        "outputVariable": ""
      },
      "bpmnAttributes": {},
      "otherModelAttributes": {}
    }
  ]
}
```

### Different bpmnAttributes examples:

**Activity:**
```
  "bpmnAttributes": {
    "type": "Activity",
    "position": {
      "x": "400",
      "y": "200"
    },
    "size": {
      "width": "100",
      "height": "80"
    },
    "incomingFlow": [
      {
        "incomingFlowId": "Flow_04xdt22"
      }
    ],
    "outgoingFlow": [
      {
        "outgoingFlowId": "Flow_12hnz02"
      }
    ]
  }
```
**Event:**
```
  "bpmnAttributes": {
    "type": "StartEvent or EndEvent",
    "position": {
      "x": "312",
      "y": "312"
    },
    "labelDimensions": {
      "x": "312",
      "y": "312",
      "width": "36",
      "height": "36"
    },
    "size": {
      "width": "36",
      "height": "36"
    },
    "incomingFlow": [],
    "outgoingFlow": [
      {
        "outgoingFlowId": "Flow_04xdt22"
      }
    ]
  }
```
**Gateway:**
```
  "bpmnAttributes": {
    "type": "exclusiveGateway",
    "position": {
      "x": "dsfw",
      "y": "sfsdc"
    },
    "size": {
      "width": "36",
      "height": "36"
    },
    "incomingFlow": [
      {
        "incomingFlowId": "Flow_12hnz02"
      }
    ],
    "outgoingFlow": [
      {
        "outgoingFlowId": "Flow_0hmkfj0"
      },
      {
        "outgoingFlowId": "Flow_1izjv51"
      }
    ],
    "isMarkerVisible": "true",
    "inputDecidingOutgoingFlow": "testVar"
  }
```
**Flow:**
```
  "bpmnAttributes": {
    "type": "sequenceFlow",
    "sourceRef": "Gateway_1c81fku",
    "targetRef": "Activity_0t79n0s",
    "waypoints": [
      {
        "x": "580",
        "y": "355"
      },
      {
        "x": "580",
        "y": "440"
      },
      {
        "x": "660",
        "y": "440"
      }
    ]
  }
```