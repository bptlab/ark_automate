export const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
	<bpmn2:collaboration id="Collaboration_0czsqyr">
		<bpmn2:participant id="Participant_0cyhvx8" processRef="Process_1" />
	</bpmn2:collaboration>
	<bpmn2:process id="Process_1" isExecutable="false">
		<bpmn2:startEvent id="StartEvent_1" />
	</bpmn2:process>
	<bpmndi:BPMNDiagram id="BPMNDiagram_1">
		<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0czsqyr">
			<bpmndi:BPMNShape id="Participant_0cyhvx8_di" bpmnElement="Participant_0cyhvx8">
				<dc:Bounds x="130" y="220" width="600" height="250" />
			</bpmndi:BPMNShape>
			<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
				<dc:Bounds x="412" y="240" width="36" height="36" />
			</bpmndi:BPMNShape>
		</bpmndi:BPMNPlane>
	</bpmndi:BPMNDiagram>
</bpmn2:definitions>`;
