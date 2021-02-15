const JSON_SSOT_STRING = {
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
      "bpmn2:process": {
        "_attributes": {
          "id": "Process_07hzxw7"
        },
        "bpmn2:startEvent": {
          "_attributes": {
            "id": "Event_0jcqjs1"
          },
          "bpmn2:outgoing": {
            "_text": "Flow_0v30d6j"
          }
        },
        "bpmn2:task": [
          {
            "_attributes": {
              "id": "Activity_1groimk",
              "name": "AAA"
            },
            "bpmn2:incoming": {
              "_text": "Flow_0v30d6j"
            },
            "bpmn2:outgoing": {
              "_text": "Flow_0rgkjwc"
            }
          },
          {
            "_attributes": {
              "id": "Activity_1vb45u8",
              "name": "BBB",
              "arkRPA:application": "Excel.Files",
              "arkRPA:task": "Set Worksheet Value",
              "arkRPA:inputVars": "{\"row\":69,\"column\":69,\"name\":\"TestString\"}",
              "arkRPA:outputVars": ""
            },
            "bpmn2:incoming": {
              "_text": "Flow_0rgkjwc"
            },
            "bpmn2:outgoing": {
              "_text": "Flow_1bmltp6"
            }
          }
        ],
        "bpmn2:sequenceFlow": [
          {
            "_attributes": {
              "id": "Flow_0v30d6j",
              "sourceRef": "Event_0jcqjs1",
              "targetRef": "Activity_1groimk"
            }
          },
          {
            "_attributes": {
              "id": "Flow_0rgkjwc",
              "sourceRef": "Activity_1groimk",
              "targetRef": "Activity_1vb45u8"
            }
          },
          {
            "_attributes": {
              "id": "Flow_1bmltp6",
              "sourceRef": "Activity_1vb45u8",
              "targetRef": "Event_0otufrj"
            }
          }
        ],
        "bpmn2:endEvent": {
          "_attributes": {
            "id": "Event_0otufrj"
          },
          "bpmn2:incoming": {
            "_text": "Flow_1bmltp6"
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
            "bpmnElement": "Process_07hzxw7"
          },
          "bpmndi:BPMNEdge": [
            {
              "_attributes": {
                "id": "Flow_0v30d6j_di",
                "bpmnElement": "Flow_0v30d6j"
              },
              "di:waypoint": [
                {
                  "_attributes": {
                    "x": "318",
                    "y": "330"
                  }
                },
                {
                  "_attributes": {
                    "x": "370",
                    "y": "330"
                  }
                }
              ]
            },
            {
              "_attributes": {
                "id": "Flow_0rgkjwc_di",
                "bpmnElement": "Flow_0rgkjwc"
              },
              "di:waypoint": [
                {
                  "_attributes": {
                    "x": "470",
                    "y": "330"
                  }
                },
                {
                  "_attributes": {
                    "x": "530",
                    "y": "330"
                  }
                }
              ]
            },
            {
              "_attributes": {
                "id": "Flow_1bmltp6_di",
                "bpmnElement": "Flow_1bmltp6"
              },
              "di:waypoint": [
                {
                  "_attributes": {
                    "x": "630",
                    "y": "330"
                  }
                },
                {
                  "_attributes": {
                    "x": "692",
                    "y": "330"
                  }
                }
              ]
            }
          ],
          "bpmndi:BPMNShape": [
            {
              "_attributes": {
                "id": "Event_0jcqjs1_di",
                "bpmnElement": "Event_0jcqjs1"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "282",
                  "y": "312",
                  "width": "36",
                  "height": "36"
                }
              }
            },
            {
              "_attributes": {
                "id": "Activity_1groimk_di",
                "bpmnElement": "Activity_1groimk"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "370",
                  "y": "290",
                  "width": "100",
                  "height": "80"
                }
              }
            },
            {
              "_attributes": {
                "id": "Activity_1vb45u8_di",
                "bpmnElement": "Activity_1vb45u8"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "530",
                  "y": "290",
                  "width": "100",
                  "height": "80"
                }
              }
            },
            {
              "_attributes": {
                "id": "Event_0otufrj_di",
                "bpmnElement": "Event_0otufrj"
              },
              "dc:Bounds": {
                "_attributes": {
                  "x": "692",
                  "y": "312",
                  "width": "36",
                  "height": "36"
                }
              }
            }
          ]
        }
      }
    }
  }

  module.exports = { JSON_SSOT_STRING };
