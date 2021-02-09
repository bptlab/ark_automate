const SSOT_JSON_STRING = {


    "robotMetadata": {
        "robotName": "exampleRobot",
        "robotCreator": "Max Mustermann",
        "robotCollaborators": ["John Doe", "Random Person"],
        "starterId": "exampleID"
    },
    "elements": [
        {
            "type": "TRIGGER",
            "id": "StartEvent_1",
            "name": "",
            "type": "",
            "trigger_condition": "",
            "predecessorIds": [],
            "successorIds": ["Activity_0a128t6"],
            "outputVariable": "",
        },
        // first activity 
        {
            "type": "SEQUENCE",
            "name": "#+# First activity",
            "id": "Activity_0a128t6",
            "predecessorIds": ["StartEvent_1"],
            "successorIds": ["Activity_0ascvdr"],
            "rpaApplication": "",
            "rpaTask": "",
            "rpaParameters": [],
            "outputVariable": "",
            "hasBoundaryEvent": ""
        },
        // RPA Aktivität
        {
            "type": "SEQUENCE",
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
            "outputVariable": "",
            "hasBoundaryEvent": ""
        },
        // Endevent
        {
            "type": "TRIGGER",
            "id": "Event_0wghmrz",
            "name": "5 Sekunden warten",
            "type": "OUTGOING",
            "trigger_condition": "",
            "predecessorIds": ["Activity_0a128t6"],
            "successorIds": [],
            "outputVariable": "",
        }
    ]
}

module.exports = { SSOT_JSON_STRING };
