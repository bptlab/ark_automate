const JSON_STRING = {
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
        "bpmn2:startEvent": {
          "_attributes": {
            "id": "StartEvent_1"
          },
          "bpmn2:outgoing": {
            "_text": "Flow_00qq0cf"
          }
        },
        "bpmn2:task": [
          {
            "_attributes": {
              "id": "Activity_01xifld",
              "name": "Excel Open Workbook",
              "arkRPA:application": "Excel.Files",
              "arkRPA:task": "Open Workbook",
              "arkRPA:inputVars": "{\"path\":\"TestString\"}",
              "arkRPA:outputVars": ""
            },
            "bpmn2:incoming": {
              "_text": "Flow_00qq0cf"
            },
            "bpmn2:outgoing": {
              "_text": "Flow_1muroii"
            }
          },
          {
            "_attributes": {
              "id": "Activity_0lvfciq",
              "name": "Excel Find Empty Row",
              "arkRPA:application": "Excel.Files",
              "arkRPA:task": "Find Empty Row",
              "arkRPA:inputVars": "{\"name\":\"TestString\"}",
              "arkRPA:outputVars": ""
            },
            "bpmn2:incoming": {
              "_text": "Flow_1muroii"
            },
            "bpmn2:outgoing": {
              "_text": "Flow_14488my"
            }
          },
          {
            "_attributes": {
              "id": "Activity_0d84lrg",
              "name": "Browser Open Browser",
              "arkRPA:application": "Browser",
              "arkRPA:task": "Open Browser",
              "arkRPA:inputVars": "{\"url\":\"TestString\",\"browser\":\"TestString\",\"alias\":\"TestString\",\"remote_url\":true,\"desired_capabilities\":\"TestString\",\"ff_profile_dir\":\"TestString\",\"options\":\"TestString\",\"service_log_path\":\"TestString\",\"executable_path\":\"TestString\"}",
              "arkRPA:outputVars": ""
            },
            "bpmn2:incoming": {
              "_text": "Flow_14488my"
            },
            "bpmn2:outgoing": {
              "_text": "Flow_1ayp4hv"
            }
          }
        ],
        "bpmn2:sequenceFlow": [
          {
            "_attributes": {
              "id": "Flow_00qq0cf",
              "sourceRef": "StartEvent_1",
              "targetRef": "Activity_01xifld"
            }
          },
          {
            "_attributes": {
              "id": "Flow_1muroii",
              "sourceRef": "Activity_01xifld",
              "targetRef": "Activity_0lvfciq"
            }
          },
          {
            "_attributes": {
              "id": "Flow_14488my",
              "sourceRef": "Activity_0lvfciq",
              "targetRef": "Activity_0d84lrg"
            }
          },
          {
            "_attributes": {
              "id": "Flow_1ayp4hv",
              "sourceRef": "Activity_0d84lrg",
              "targetRef": "Event_1ral310"
            }
          }
        ],
        "bpmn2:endEvent": {
          "_attributes": {
            "id": "Event_1ral310"
          },
          "bpmn2:incoming": {
            "_text": "Flow_1ayp4hv"
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
                  "width": "720",
                  "height": "250"
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
                  "x": "172",
                  "y": "312",
                  "width": "36",
                  "height": "36"
                }
              }
            },
            {
              "_attributes": {
                "id": "Activity_01xifld_di",
                "bpmnElement": "Activity_01xifld"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "260",
                  "y": "290",
                  "width": "100",
                  "height": "80"
                }
              }
            },
            {
              "_attributes": {
                "id": "Activity_0lvfciq_di",
                "bpmnElement": "Activity_0lvfciq"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "420",
                  "y": "290",
                  "width": "100",
                  "height": "80"
                }
              }
            },
            {
              "_attributes": {
                "id": "Activity_0d84lrg_di",
                "bpmnElement": "Activity_0d84lrg"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "580",
                  "y": "290",
                  "width": "100",
                  "height": "80"
                }
              }
            },
            {
              "_attributes": {
                "id": "Event_1ral310_di",
                "bpmnElement": "Event_1ral310"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "742",
                  "y": "312",
                  "width": "36",
                  "height": "36"
                }
              }
            }
          ],
          "bpmndi:BPMNEdge": [
            {
              "_attributes": {
                "id": "Flow_00qq0cf_di",
                "bpmnElement": "Flow_00qq0cf"
              },
              "di:waypoint": [
                {
                  "_attributes": {
                    "x": "208",
                    "y": "330"
                  }
                },
                {
                  "_attributes": {
                    "x": "260",
                    "y": "330"
                  }
                }
              ]
            },
            {
              "_attributes": {
                "id": "Flow_1muroii_di",
                "bpmnElement": "Flow_1muroii"
              },
              "di:waypoint": [
                {
                  "_attributes": {
                    "x": "360",
                    "y": "330"
                  }
                },
                {
                  "_attributes": {
                    "x": "420",
                    "y": "330"
                  }
                }
              ]
            },
            {
              "_attributes": {
                "id": "Flow_14488my_di",
                "bpmnElement": "Flow_14488my"
              },
              "di:waypoint": [
                {
                  "_attributes": {
                    "x": "520",
                    "y": "330"
                  }
                },
                {
                  "_attributes": {
                    "x": "580",
                    "y": "330"
                  }
                }
              ]
            },
            {
              "_attributes": {
                "id": "Flow_1ayp4hv_di",
                "bpmnElement": "Flow_1ayp4hv"
              },
              "di:waypoint": [
                {
                  "_attributes": {
                    "x": "680",
                    "y": "330"
                  }
                },
                {
                  "_attributes": {
                    "x": "742",
                    "y": "330"
                  }
                }
              ]
            }
          ]
        }
      }
    }
  };

module.exports = { JSON_STRING };
