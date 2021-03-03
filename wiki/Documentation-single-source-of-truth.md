# Single Source of Truth

## What do we need a SSoT for?
The goal of Ark_automate is to have multiple interfaces altering/showing the same robot. For each robot, there will be a properties panel to change attributes, a view of the current .robot code and possibly multiple modeling interfaces.
The user selects the modeling language he/she prefers and starts modeling the behavior of the robot (at least for now the user has to pre-select the modeling language). At the same time, the user can view/change the .robot code of the bot and/or update attributes via the property panel.
To achieve that we need a single-source-of-truth(SSoT) for each robot. In the SSoT all necessary information is saved so that changes can be automatically applied to every interface.

### Which frontends do we want to support?
- definitely have to be implemented: BPMN editor, robot framework code editor
- optional (planned) are: Google BLOCKLY
- in the long run we are open for other modelling languages

(_We want to support all modelling languages that can be rendered into an edge and node model_)

Observation: All frontends that represent "executable program code" can be represented as a graph.

### Analysis: What can Robot Framework support?
- Linear flow (sequences)
- Branching
- Loops (For+While)
**Does not support** try-catch constructs

## How is the SSoT going to be included in the product?
The SSoT itself will be stored on the server-side of the product. It will support multiple use cases shown in the following image:
![SSoT in product](https://i.imgur.com/jViSHTQ.png)
With a change of one of the interfaces on the client-side (e.g. type in a new name in the side panel) the new data will be sent to the SSoT via HTTP and the SSoT on the server side will be updated. Once the SSoT gets updated all the other interfaces update accordingly as they are dependent on the SSoT data.


### We have agreed on the following
- **Saving the SSoT**
    - the local SSOT is pushed into the DB in certain time intervals (or trigger like "change tab")
    - the SSoT stores only the logic behind the modeling interfaces
(the visual representation is "rendered" from the graph)
- Only those features of the modelling languages are allowed that **are supported by Robot Framework**.
    - Parallelism is not supported
    - No gateways other than an XOR split are recorded in the SSOT.
( => non-interrupting events are not supported)
    - Exception handling is not supported
(=> therefore we do not support intermediate events in BPMN)
- **Front-end rendering**
    - requires extensive programming
    - may cause the programmer to see his model differently from the way he saved it
    - Hard-coded values required for frontend rendering are stored in a `config.json`


### FAQ:
1. **Do we store information about each model in the SSoT or do we "render" each model from the SSoT without having specific model information stored in the SSoT?**
    1. we render each model from our "logical graph".
    2. no modelling-interface-specific values are therefore stored.
    3. missing attributes needed to create a modelling visualisation have to be assumed or calculated with default values
2. **Do we use the XML as SSOT?**
No, we render the models from the SSOT. For e.g. BPMN we render SSOT to XML to BPMN.
3. **How do we store the edges from BPMN?**
Implicitly through the successor/predecessor relationships. The exact waypoints have to be "calculated"
4. **What are the consequences of not saving modelling attributes for our project? (BPMN specific)**
    - exact arrangement in the interface is not maintained;
however: support for adherence to the standard (automatic pretty print)
    - Logic for updating SSoT after deleting (and adding) is needed.
    - Config files with sizes, colours, symbols etc. are needed for each modelling interface

## Concept for applying the SSoT

**Note: SSoT should be closer to basic programming constructs than to a BPMN model.
Therefore: All interfaces are rendered into a graph model where the nodes are defined by the following tags: 'INSTRUCTION', 'BRANCH', 'CASE' and 'MARKER'. These tags represent the basic programming constructs that can also be used in the **Robot Framework**.


### Overview
| SSoT tag | BPMN representation | Code representation | ArkA 0.3 | ArkA 1.0 |
|:-----------:|:------------------------------:|:----------------------:|:------------------:|:------------------:|
| INSTRUCTION | Activity | "one line of code" | :heavy_check_mark: | :heavy_check_mark: |
| CASE | XOR-Gateway | Branching (IF, CASE) | :x: | :heavy_check_mark: |
| LOOP | XOR-Split & Join (Combination) | Loop (FOR, WHILE) | :x: | :heavy_check_mark: |
| MARKER | Start & End Event | - | :heavy_check_mark: | :heavy_check_mark: |
| _EXCEPTION_ | _intermediate Event_ | _TRY-CATCH_ | :x: | :x: |

**Special features for events:**
**Timers:** In the long term, timers are to be represented in BPMN as intermediate events. At the moment, a "sleep event" (to pause execution) is to be defined as an instruction with an RPA action as an example.

**Event types:** are not stored. Events therefore always appear as "empty circles". They are also not linkable with logic. For example, if an end event is to send a mail, please model this construct as 'Activity: Send Mail' and 'End Event'.
No intermediate events are currently supported.

### Overview SSOT hierarchy
![](https://i.imgur.com/7yOqDZv.png)


### Component: HEADER

User information about a robot (creator, released for etc.) is stored in an additional file in the database.

**SSoT**
``` json
{"robotMetadata":{
      "robotId":"exampleRobotId",
      "starterId":"exampleId"
   },
   "elements":[
      {/* Here start the nodes of the graph */}  
   ]
}
```

### Element: INSTRUCTION

**SSoT**
```json
{
  "type": "INSTRUCTION",
  "name": "exampleName",
  "id": "exampleId",
  "predecessorIds": ["randomId"],
  "successorIds": ["randomId"],
  "rpaApplication": "e.g. Excel.Files",
  "rpaTask": "e.g. Open Workbook",
  "rpaParameters": [
    {
      "name": "Filename",
      "value": "",
      "requireUserInput": true
    },
    {
      "name": "Path",
      "value": "C:/RPA-folder/",
      "requireUserInput": false
    }
  ],
  "outputVariable": ""
}
```

**BPMN requires:**
- id :heavy_check_mark:
- Label -> name :heavy_check_mark:
- Predecessor :heavy_check_mark:
- Successor :heavy_check_mark:
- ~~position~~ -> calculated :heavy_check_mark:
- ~~size~~ -> `config.json` :heavy_check_mark:
- _RPA-Task & Application & Parameters_ :heavy_check_mark:

### Element: CASE

**SSoT stores**
- Predecessor node, Successor node
- name, ID
- default successor node
- Conditions (for each successor node) = IF condition

```json
{
  "type": "CASE",
  "name": "",
  "id": "exampleId",
  "predecessorIds": ["randomId3"],
  "successorIds": ["randomId", "randomId2, randomId3"],
  "default_successorIds": "randomId",
  "conditions": {
      "X+1==3": "randomID",
      "X-1==3": "randomID2"
    }
}
```

**BPMN requires**
- Predecessor node :heavy_check_mark:
- Successor node :heavy_check_mark:
- Label (name) :heavy_check_mark:
- default successor node :heavy_check_mark:
- Conditions (texts at the Path to each successor node) :heavy_check_mark:

### Element: LOOP

**SSoT stores**
- ID, text (label)
- Predecessor and successor nodes of the loop
- Loop termination condition
- Predecessor node of the loop body end
- Successor node of the loop body start


```json
{
  "type": "LOOP",
  "id": "exampleId",
  "loop_condition": "X > 5",
  "predecessorIds": ["randomId"],
  "successorIds": ["randomId"],
  "loop_body_predecessorIds": ["randomId"],
  "loop_body_successorIds": ["randomId"]
}
```

### Element: MARKER
**SSoT stores**
- ID, text (label)
- predecessor node
- Successor node


```json
{
  "type": "MARKER",
  "id": "exampleId",
  "name": "Wait 5 seconds",
  "predecessorIds": ["randomId"],
  "successorIds": ["randomId"]
}
```

**BPMN requires**

- Label :heavy_check_mark:
- Event type1: Start, End :heavy_check_mark:
    - Start = Event without incoming edge
    - End = Event without outgoing edge
- Event type2: timer event, message event etc. :thought_balloon:
    - All events are always rendered as "neutral events" (empty circle).


---



## Example parsing from BPMN xml to SSOT
Modelled process
![](https://i.imgur.com/rMsmw1g.png)


<table>
<tr>
<td> BPMN Json </td> <td> SSOT </td>
</tr>
<tr>
<td>

``` json
  {
  "_declaration": {
    "_attributes": {
      "version": "1.0",
      "encoding": "UTF-8"
    }
  },
  "bpmn2:definitions": {
    "_attributes": {
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
      "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
      "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
      "xmlns:arkRPA": "http://magic",
      "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
      "id": "sample-diagram",
      "targetNamespace": "http://bpmn.io/schema/bpmn",
      "xsi:schemaLocation": "http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
    },
    "bpmn2:collaboration": {
      "_attributes": {
        "id": "Collaboration_0czsqyr"
      },
      "bpmn2:participant": {
        "_attributes": {
          "id": "Participant_0cyhvx8",
          "processRef": "Process_1"
        }
      }
    },
    "bpmn2:process": {
      "_attributes": {
        "id": "Process_1",
        "isExecutable": "false"
      },
      "bpmn2:task": [
        {
          "_attributes": {
            "id": "Activity_0a128t6",
            "name": "#+# First activity"
          },
          "bpmn2:incoming": {
            "_text": "Flow_1bewk1i"
          },
          "bpmn2:outgoing": {
            "_text": "Flow_0sg07kn"
          }
        },
        {
          "_attributes": {
            "id": "Activity_0ascvdr",
            "name": "#+#+# RPA Activity",
            "arkRPA:application": "Browser",
            "arkRPA:task": "Open Browser",
// added linebreaks for readability
            "arkRPA:inputVars": "{\"url\":\"TestString\",
\"browser\":\"TestString\",
\"alias\":\"TestString\",
\"remote_url\":true,
\"desired_capabilities\":\"TestString\",
\"ff_profile_dir\":\"TestString\",
\"options\":\"TestString\",
\"service_log_path\":\"TestString\",
\"executable_path\":\"TestString\"}",
            "arkRPA:outputVars": ""
          },
          "bpmn2:incoming": {
            "_text": "Flow_0sg07kn"
          },
          "bpmn2:outgoing": {
            "_text": "Flow_1hwcghk"
          }
        }
      ],
      "bpmn2:sequenceFlow": [
        {
          "_attributes": {
            "id": "Flow_1bewk1i",
            "sourceRef": "StartEvent_1",
            "targetRef": "Activity_0a128t6"
          }
        },
        {
          "_attributes": {
            "id": "Flow_0sg07kn",
            "sourceRef": "Activity_0a128t6",
            "targetRef": "Activity_0ascvdr"
          }
        },
        {
          "_attributes": {
            "id": "Flow_1hwcghk",
            "sourceRef": "Activity_0ascvdr",
            "targetRef": "Event_0wghmrz"
          }
        }
      ],
      "bpmn2:endEvent": {
        "_attributes": {
          "id": "Event_0wghmrz"
        },
        "bpmn2:incoming": {
          "_text": "Flow_1hwcghk"
        }
      },
      "bpmn2:startEvent": {
        "_attributes": {
          "id": "StartEvent_1"
        },
        "bpmn2:outgoing": {
          "_text": "Flow_1bewk1i"
        }
      }
    },
    "bpmndi:BPMNDiagram": {
      "_attributes": {
        "id": "BPMNDiagram_1"
      },
      "bpmndi:BPMNPlane": {
        "_attributes": {
          "id": "BPMNPlane_1",
          "bpmnElement": "Collaboration_0czsqyr"
        },
        "bpmndi:BPMNShape": [
          {
            "_attributes": {
              "id": "Participant_0cyhvx8_di",
              "bpmnElement": "Participant_0cyhvx8",
              "isHorizontal": "true"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "130",
                "y": "220",
                "width": "710",
                "height": "250"
              }
            }
          },
          {
            "_attributes": {
              "id": "Activity_0a128t6_di",
              "bpmnElement": "Activity_0a128t6"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "340",
                "y": "280",
                "width": "100",
                "height": "80"
              }
            }
          },
          {
            "_attributes": {
              "id": "Activity_0ascvdr_di",
              "bpmnElement": "Activity_0ascvdr"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "500",
                "y": "280",
                "width": "100",
                "height": "80"
              }
            }
          },
          {
            "_attributes": {
              "id": "Event_0wghmrz_di",
              "bpmnElement": "Event_0wghmrz"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "662",
                "y": "392",
                "width": "36",
                "height": "36"
              }
            }
          },
          {
            "_attributes": {
              "id": "_BPMNShape_StartEvent_2",
              "bpmnElement": "StartEvent_1"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "212",
                "y": "302",
                "width": "36",
                "height": "36"
              }
            }
          }
        ],
        "bpmndi:BPMNEdge": [
          {
            "_attributes": {
              "id": "Flow_1bewk1i_di",
              "bpmnElement": "Flow_1bewk1i"
            },
            "di:waypoint": [
              {
                "_attributes": {
                  "x": "248",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "340",
                  "y": "320"
                }
              }
            ]
          },
          {
            "_attributes": {
              "id": "Flow_0sg07kn_di",
              "bpmnElement": "Flow_0sg07kn"
            },
            "di:waypoint": [
              {
                "_attributes": {
                  "x": "440",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "500",
                  "y": "320"
                }
              }
            ]
          },
          {
            "_attributes": {
              "id": "Flow_1hwcghk_di",
              "bpmnElement": "Flow_1hwcghk"
            },
            "di:waypoint": [
              {
                "_attributes": {
                  "x": "600",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "631",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "631",
                  "y": "410"
                }
              },
              {
                "_attributes": {
                  "x": "662",
                  "y": "410"
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```


</td>
<td>

``` json
"robotMetadata": {
        "robotId": "exampleRobot",
        "starterId": "exampleID"
    },
    "elements": [
        {
            "type": "MARKER",
            "id": "StartEvent_1",
            "name": "",
            "predecessorIds": [],
            "successorIds": ["Activity_0a128t6"],
        },
        // first activity
        {
            "type": "INSTRUCTION",
            "name": "#+# First activity",
            "id": "Activity_0a128t6",
            "predecessorIds": ["StartEvent_1"],
            "successorIds": ["Activity_0ascvdr"],
            "rpaApplication": "",
            "rpaTask": "",
            "rpaParameters": [],
            "outputVariable": ""
        },
        // RPA activity
        {
            "type": "INSTRUCTION",
            "name": "#+#+# RPA Activity",
            "id": "Activity_0ascvdr",
            "predecessorIds": ["Activity_0a128t6"],
            "successorIds": ["Event_0wghmrz"],
            "rpaApplication": "Browser",
            "rpaTask": "Open Browser",
            "parameters": [
                {
                    "name": "url",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "browser",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "remote_url",
                    "value": "true",
                    "requireUserInput": true
                },
                {
                    "name": "desired_capabilities",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "ff_profile_dir",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "options",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "service_log_path",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "executable_path",
                    "value": "TestString",
                    "requireUserInput": true
                },
            ],
            "outputVariable": ""
        },
        // Endevent
        {
            "type": "MARKER",
            "id": "Event_0wghmrz",
            "name": "",
            "predecessorIds": ["Activity_0a128t6"],
            "successorIds": [],
        }
    ]
}
```

</td>
</tr>
</tr>
</table>
