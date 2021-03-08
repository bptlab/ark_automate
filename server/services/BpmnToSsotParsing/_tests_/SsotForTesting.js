const SSOT_JSON_STRING = {
    "robotMetadata": {
        "robotId": "exampleRobot",
        "starterId": "exampleID"
    },
    "elements": [
        {
            "type": "MARKER",
            "name": "",
            "id": "Event_0jcqjs1",
            "predecessorIds": [],
            "successorIds": ["Activity_1groimk"],
        },
        {
            "type": "INSTRUCTION",
            "name": "AAA",
            "id": "Activity_1groimk",
            "predecessorIds": ["Event_0jcqjs1"],
            "successorIds": ["Activity_1vb45u8"],
            "outputVariable": ""
        },
        {
            "type": "INSTRUCTION",
            "name": "BBB",
            "id": "Activity_1vb45u8",
            "predecessorIds": ["Activity_1groimk"],
            "successorIds": ["Event_0otufrj"],
            "rpaApplication": "Excel.Files",
            "rpaTask": "Set Worksheet Value",
            "rpaParameters": [
                {
                    "name": "row",
                    "value": 69,
                    "requireUserInput": true
                },
                {
                    "name": "column",
                    "value": 69,
                    "requireUserInput": true
                },
                {
                    "name": "name",
                    "value": "TestString",
                    "requireUserInput": true
                }
            ],
            "outputVariable": ""
        },
        {
            "type": "MARKER",
            "name": "",
            "id": "Event_0otufrj",
            "predecessorIds": ["Activity_1vb45u8"],
            "successorIds": [],
        }
    ]
}

module.exports = { SSOT_JSON_STRING };
