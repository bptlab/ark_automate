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
            "arkRPA:inputVars": "{\"url\":\"TestString\",\"browser\":\"TestString\",\"alias\":\"TestString\",\"remote_url\":true,\"desired_capabilities\":\"TestString\",\"ff_profile_dir\":\"TestString\",\"options\":\"TestString\",\"service_log_path\":\"TestString\",\"executable_path\":\"TestString\"}",
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
            "id": "Activity_0a128t6_di", // TODO WOHIN GEHÖRT DAS?
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

  module.exports = { JSON_SSOT_STRING };
