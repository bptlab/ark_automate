/*
This is a generated Ssot form a Bpmn diagram. It has three activities, named according to their execution order. 
The activities were added in the following order: Second Avtivity, Third Activity and then the First activity. 
It has a linear structure aswell as Start and End Events.
*/

const SSOT_JSON_STRING = {
    "robotMetadata": {
        "robotId": "exampleRobot",
        "starterId": "exampleID"
    },
    "elements": [
        {
            "type": "INSTRUCTION",
            "name": "SecondActivity",
            "id": "Activity_0frqu31",
            "predecessorIds": [
                "Activity_02jyuh0"
            ],
            "successorIds": [
                "Activity_00ydbo0"
            ],
            "rpaApplication": "Excel.Files",
            "rpaTask": "Find Empty Row",
            "rpaParameters": [
                {
                    "name": "name",
                    "value": "TestString",
                    "requireUserInput": true
                }
            ],
            "outputVariable": ""
        },
        {
            "type": "INSTRUCTION",
            "name": "ThirdActivity",
            "id": "Activity_00ydbo0",
            "predecessorIds": [
                "Activity_0frqu31"
            ],
            "successorIds": [
                "Event_1wphn90"
            ],
            "rpaApplication": "Browser",
            "rpaTask": "Open Browser",
            "rpaParameters": [
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
                    "name": "alias",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "remote_url",
                    "value": true,
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
                }
            ],
            "outputVariable": ""
        },
        {
            "type": "MARKER",
            "name": "",
            "id": "Event_1cnr8ow",
            "predecessorIds": [],
            "successorIds": [
                "Activity_02jyuh0"
            ]
        },
        {
            "type": "INSTRUCTION",
            "name": "FirstActivity",
            "id": "Activity_02jyuh0",
            "predecessorIds": [
                "Event_1cnr8ow"
            ],
            "successorIds": [
                "Activity_0frqu31"
            ],
            "rpaApplication": "Excel.Files",
            "rpaTask": "Open Workbook",
            "rpaParameters": [
                {
                    "name": "path",
                    "value": "TestString",
                    "requireUserInput": true
                }
            ],
            "outputVariable": ""
        },
        {
            "type": "MARKER",
            "name": "",
            "id": "Event_1wphn90",
            "predecessorIds": [
                "Activity_00ydbo0"
            ],
            "successorIds": []
        }
    ]
}

module.exports = { SSOT_JSON_STRING };
