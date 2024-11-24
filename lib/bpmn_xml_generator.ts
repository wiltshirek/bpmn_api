import { v4 as uuidv4 } from 'uuid';

export function generateBpmnXml(intermediaryNotation: string): string {
  const tasks = intermediaryNotation.split('\n')
    .filter(line => line.startsWith('Task:'))
    .map(line => line.replace('Task: ', ''));

  const processId = `Process_${uuidv4().replace(/-/g, '_')}`;
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_${uuidv4().replace(/-/g, '_')}" targetNamespace="http://bpmn.io/schema/bpmn">
<bpmn:process id="${processId}" isExecutable="false">
  <bpmn:startEvent id="StartEvent_1">
    <bpmn:outgoing>Flow_1</bpmn:outgoing>
  </bpmn:startEvent>`;

  tasks.forEach((task, index) => {
    const taskId = `Activity_${index + 1}`;
    const nextFlowId = `Flow_${index + 2}`;
    xml += `
  <bpmn:task id="${taskId}" name="${task}">
    <bpmn:incoming>Flow_${index + 1}</bpmn:incoming>
    <bpmn:outgoing>${nextFlowId}</bpmn:outgoing>
  </bpmn:task>
  <bpmn:sequenceFlow id="Flow_${index + 1}" sourceRef="${index === 0 ? 'StartEvent_1' : `Activity_${index}`}" targetRef="${taskId}" />`;
  });

  xml += `
  <bpmn:endEvent id="EndEvent_1">
    <bpmn:incoming>Flow_${tasks.length}</bpmn:incoming>
  </bpmn:endEvent>
  <bpmn:sequenceFlow id="Flow_${tasks.length}" sourceRef="Activity_${tasks.length}" targetRef="EndEvent_1" />
</bpmn:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
  <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
    <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
      <dc:Bounds x="179" y="99" width="36" height="36" />
    </bpmndi:BPMNShape>`;

  tasks.forEach((task, index) => {
    const taskId = `Activity_${index + 1}`;
    xml += `
    <bpmndi:BPMNShape id="${taskId}_di" bpmnElement="${taskId}">
      <dc:Bounds x="${240 + index * 100}" y="77" width="100" height="80" />
    </bpmndi:BPMNShape>`;
  });

  xml += `
    <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
      <dc:Bounds x="${240 + tasks.length * 100}" y="99" width="36" height="36" />
    </bpmndi:BPMNShape>`;

  tasks.forEach((task, index) => {
    const flowId = `Flow_${index + 1}`;
    const sourceRef = index === 0 ? 'StartEvent_1' : `Activity_${index}`;
    const targetRef = `Activity_${index + 1}`;
    xml += `
    <bpmndi:BPMNEdge id="${flowId}_di" bpmnElement="${flowId}">
      <di:waypoint x="${210 + index * 100}" y="117" />
      <di:waypoint x="${240 + index * 100}" y="117" />
    </bpmndi:BPMNEdge>`;
  });

  xml += `
    <bpmndi:BPMNEdge id="Flow_${tasks.length}_di" bpmnElement="Flow_${tasks.length}">
      <di:waypoint x="${240 + (tasks.length - 1) * 100}" y="117" />
      <di:waypoint x="${240 + tasks.length * 100}" y="117" />
    </bpmndi:BPMNEdge>
  </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</bpmn:definitions>`;

  return xml;
}
