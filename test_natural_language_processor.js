const processText = (text) => {
    const tasks = text.split('.').filter(s => s.trim()).map(s => s.trim());
    const actors = ['Customer', 'Sales Department', 'Warehouse', 'Purchasing Department', 'Shipping Department', 'Finance Department'];
    return { tasks, actors };
  };
  
  const generateIntermediaryNotation = (processedText) => {
    let intermediaryNotation = [];
    processedText.tasks.forEach((task, index) => {
      intermediaryNotation.push(`Task: ${task}`);
      if (index < processedText.tasks.length - 1) {
        intermediaryNotation.push('->');
      }
    });
  
    intermediaryNotation.push('\nActor Mapping:');
    processedText.actors.forEach(actor => {
      intermediaryNotation.push(`${actor}: [${processedText.tasks.join(', ')}]`);
    });
  
    return intermediaryNotation.join('\n');
  };
  
  const generateBpmnXml = (intermediaryNotation) => {
    const tasks = intermediaryNotation.split('\n')
      .filter(line => line.startsWith('Task:'))
      .map(line => line.replace('Task: ', ''));
  
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
  <bpmn:startEvent id="StartEvent_1" />
  `;
  
    tasks.forEach((task, index) => {
      xml += `    <bpmn:task id="Task_${index + 1}" name="${task}" />
  `;
    });
  
    xml += `    <bpmn:endEvent id="EndEvent_1" />
  `;
  
    tasks.forEach((task, index) => {
      xml += `    <bpmn:sequenceFlow id="Flow_${index + 1}" sourceRef="${index === 0 ? 'StartEvent_1' : `Task_${index}`}" targetRef="${index === tasks.length - 1 ? 'EndEvent_1' : `Task_${index + 1}`}" />
  `;
    });
  
    xml += `  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
  <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
    <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
      <dc:Bounds x="179" y="99" width="36" height="36" />
    </bpmndi:BPMNShape>
  `;
  
    tasks.forEach((task, index) => {
      xml += `      <bpmndi:BPMNShape id="Task_${index + 1}_di" bpmnElement="Task_${index + 1}">
      <dc:Bounds x="${200 + (index + 1) * 100}" y="77" width="100" height="80" />
    </bpmndi:BPMNShape>
  `;
    });
  
    xml += `      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
      <dc:Bounds x="${200 + (tasks.length + 1) * 100}" y="99" width="36" height="36" />
    </bpmndi:BPMNShape>
  `;
  
    tasks.forEach((task, index) => {
      xml += `      <bpmndi:BPMNEdge id="Flow_${index + 1}_di" bpmnElement="Flow_${index + 1}">
      <di:waypoint x="${218 + index * 100}" y="117" />
      <di:waypoint x="${200 + (index + 1) * 100}" y="117" />
    </bpmndi:BPMNEdge>
  `;
    });
  
    xml += `    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
  </bpmn:definitions>`;
  
    return xml;
  };
  
  // Sample business process description
  const sampleText = "The order process begins when a customer places an order. The sales department reviews the order. If the order is approved, the warehouse prepares the shipment. The shipping department then delivers the order to the customer. Finally, the finance department issues an invoice.";
  
  console.log("Testing Natural Language Processor:");
  console.log("Sample Text:", sampleText);
  
  // Process the text
  const processedText = processText(sampleText);
  console.log("\nProcessed Text:");
  console.log(JSON.stringify(processedText, null, 2));
  
  // Generate intermediary notation
  const intermediaryNotation = generateIntermediaryNotation(processedText);
  console.log("\nIntermediary Notation:");
  console.log(intermediaryNotation);
  
  // Generate BPMN XML
  const bpmnXml = generateBpmnXml(intermediaryNotation);
  console.log("\nBPMN XML:");
  console.log(bpmnXml);
  