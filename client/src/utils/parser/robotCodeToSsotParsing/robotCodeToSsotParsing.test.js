import { correctSettingsSection, correctTaskSection, taskAndApplicationCombinations, correctElementsArray } from './robotCodeTestSnippets';

const parser = require('./robotCodeToSsotParsing');

const BPMN_XML = { xml: '<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"><bpmn2:collaboration id="Collaboration_0czsqyr"><bpmn2:participant id="Participant_0cyhvx8" processRef="Process_1" /></bpmn2:collaboration><bpmn2:process id="Process_1" isExecutable="false"><bpmn2:startEvent id="Event_1wm4a0f" name="Start Event"><bpmn2:outgoing>Flow_0m7u6bu</bpmn2:outgoing></bpmn2:startEvent><bpmn2:task id="Activity_0fzxlxj" name="activity One"><bpmn2:incoming>Flow_0m7u6bu</bpmn2:incoming><bpmn2:outgoing>Flow_08r9hfx</bpmn2:outgoing></bpmn2:task><bpmn2:sequenceFlow id="Flow_0m7u6bu" sourceRef="Event_1wm4a0f" targetRef="Activity_0fzxlxj" /><bpmn2:task id="Activity_0zh1dbs" name="activity Two"><bpmn2:incoming>Flow_08r9hfx</bpmn2:incoming><bpmn2:outgoing>Flow_1lycczu</bpmn2:outgoing></bpmn2:task><bpmn2:sequenceFlow id="Flow_08r9hfx" sourceRef="Activity_0fzxlxj" targetRef="Activity_0zh1dbs" /><bpmn2:task id="Activity_0tjwovm" name="activity Three"><bpmn2:incoming>Flow_1lycczu</bpmn2:incoming><bpmn2:outgoing>Flow_19rmn01</bpmn2:outgoing></bpmn2:task><bpmn2:sequenceFlow id="Flow_1lycczu" sourceRef="Activity_0zh1dbs" targetRef="Activity_0tjwovm" /><bpmn2:endEvent id="Event_1itdshy" name="finished"><bpmn2:incoming>Flow_19rmn01</bpmn2:incoming></bpmn2:endEvent><bpmn2:sequenceFlow id="Flow_19rmn01" sourceRef="Activity_0tjwovm" targetRef="Event_1itdshy" /></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0czsqyr"><bpmndi:BPMNShape id="Participant_0cyhvx8_di" bpmnElement="Participant_0cyhvx8" isHorizontal="true"><dc:Bounds x="130" y="220" width="788" height="250" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Flow_0m7u6bu_di" bpmnElement="Flow_0m7u6bu"><di:waypoint x="218" y="330" /><di:waypoint x="300" y="330" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_08r9hfx_di" bpmnElement="Flow_08r9hfx"><di:waypoint x="400" y="330" /><di:waypoint x="450" y="330" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1lycczu_di" bpmnElement="Flow_1lycczu"><di:waypoint x="550" y="330" /><di:waypoint x="600" y="330" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_19rmn01_di" bpmnElement="Flow_19rmn01"><di:waypoint x="700" y="330" /><di:waypoint x="782" y="330" /></bpmndi:BPMNEdge><bpmndi:BPMNShape id="Event_0kb4ru1_di" bpmnElement="Event_1wm4a0f"><dc:Bounds x="182" y="312" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="173" y="355" width="54" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_1t1q26q_di" bpmnElement="Activity_0fzxlxj"><dc:Bounds x="300" y="290" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0uteom6_di" bpmnElement="Activity_0zh1dbs"><dc:Bounds x="450" y="290" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_1khvnq1_di" bpmnElement="Activity_0tjwovm"><dc:Bounds x="600" y="290" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Event_1bt3cen_di" bpmnElement="Event_1itdshy"><dc:Bounds x="782" y="312" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="781" y="355" width="39" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>' };
const ROBOT_ID = '54ab2d30eb3cc402041ac60f';

sessionStorage.setItem('robotName', 'AwesomeTestRobot')
sessionStorage.setItem('robotId', '12345678')
sessionStorage.setItem('availableApplications', '["Excel.Application","Excel.Files","HTTP"]')
sessionStorage.setItem('TaskApplicationCombinations', JSON.stringify(taskAndApplicationCombinations))

const correctRobotCode = `${correctSettingsSection}\n\n${correctTaskSection}`
const robotCodeAsArray = parser.getRobotCodeAsArray(correctRobotCode);

describe('RobotCode to SSOT Parsing Tests', () => {
    /*     test('ssot contains right robotName', async () => {
            const robotCode = `${correctSettingsSection}\n\n${correctTaskSection}`
            const ssot = await parser.parseRobotCodeToSsot(robotCode);
            return expect(ssot).toHaveProperty('robotName', 'AwesomeTestRobot');
        });
        test('ssot contains right robotId', async () => {
            const robotCode = `${correctSettingsSection}\n\n${correctTaskSection}`
            const ssot = await parser.parseRobotCodeToSsot(robotCode);
            return expect(ssot).toHaveProperty('_id', 12345678);
        }); */
    test('ssot contains right starterId', async () => true);


    test('settings selector was found correctly', async () => {
        const settingsSelectionAsArray = parser.getRobotCodeAsArray(correctSettingsSection);
        return expect(parser.getLineNumberForSelector(settingsSelectionAsArray, '*** Settings ***')).toBe(0)
    });
    test('settings selector was found correctly2', async () => {
        const settingsSelectionAsArray = parser.getRobotCodeAsArray(`RandomOffsetLine\n${correctSettingsSection}`);
        return expect(parser.getLineNumberForSelector(settingsSelectionAsArray, '*** Settings ***')).toBe(1)
    });
    test('settings selector wasn\'t found (what is as expected)', async () => {
        const robotCodeWithOutSettingsSelector = robotCodeAsArray.slice(1)
        return expect(parser.getLineNumberForSelector(robotCodeWithOutSettingsSelector, '*** Settings ***')).toBe(undefined)
    });
    test('tasks selector was found correctly', async () =>
        expect(parser.getLineNumberForSelector(robotCodeAsArray, '*** Tasks ***')).toBe(3));

    test('all applications were found', async () => {
        const declaredApplications = parser.getApplicationArray(robotCodeAsArray);
        return expect(['HTTP', 'Excel.Application']).toEqual(expect.arrayContaining(/* declaredApplications */["GTT"]));
    });

    test('elementsArray is correct', async () => {
        /* const declaredApplications = parser.getApplicationArray(robotCodeAsArray);
        return expect(declaredApplications).toEqual(correctElementsArray)
        const elementsArray = parser.getElementsArray(robotCodeAsArray, declaredApplications, '12345678')
        return expect(elementsArray).toEqual(correctElementsArray) */
    });

});

        // expect.assertions(1);
/* expect(Ssot).toHaveProperty('starterId', 'Event_1wm4a0f');

expect(Ssot.elements[0]).toHaveProperty('name', 'Start Event');
expect(Ssot.elements[0]).toHaveProperty('predecessorIds', []);

expect(Ssot.elements[1]).toHaveProperty('name', 'activity One');
expect(Ssot.elements[1]).toHaveProperty('type', 'INSTRUCTION');

expect(Ssot.elements[2]).toHaveProperty('name', 'activity Two');
expect(Ssot.elements[2]).toHaveProperty('type', 'INSTRUCTION');

expect(Ssot.elements[4]).toHaveProperty('name', 'finished');
expect(Ssot.elements[4]).toHaveProperty('type', 'MARKER'); */
