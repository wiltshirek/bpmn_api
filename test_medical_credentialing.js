const processText = (text) => {
    const mainTasks = text.split('.').filter(s => s.trim()).map(s => s.trim());
    const tasks = [];
    const subProcesses = {};
  
    mainTasks.forEach(task => {
      if (task.includes(':')) {
        const [mainTask, subTasks] = task.split(':');
        tasks.push(mainTask.trim());
        subProcesses[mainTask.trim()] = subTasks.split(',').map(st => st.trim());
      } else {
        tasks.push(task);
      }
    });
  
    const actors = ['Healthcare Provider', 'Credentialing Specialist', 'Verification Team', 'Credentialing Committee', 'Medical Board'];
    return { tasks, subProcesses, actors };
  };
  
  const generateIntermediaryNotation = (processedText) => {
    let intermediaryNotation = [];
    processedText.tasks.forEach((task, index) => {
      intermediaryNotation.push(`Task: ${task}`);
      if (processedText.subProcesses[task]) {
        intermediaryNotation.push('SubProcess:');
        processedText.subProcesses[task].forEach(subTask => {
          intermediaryNotation.push(`  SubTask: ${subTask}`);
        });
      }
      if (index
  < processedText.tasks.length - 1) {
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
    const lines = intermediaryNotation.split('\n');
    const tasks = lines.filter(line => line.startsWith('Task:')).map(line => line.replace('Task: ', ''));
    const subProcesses = {};
    let currentTask = '';
  
    lines.forEach(line => {
      if (line.startsWith('Task: ')) {
        currentTask = line.replace('Task: ', '');
      } else if (line.startsWith('  SubTask: ')) {
        if (!subProcesses[currentTask]) {
          subProcesses[currentTask] = [];
        }
        subProcesses[currentTask].push(line.replace('  SubTask: ', ''));
      }
    });
  
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  `;
  
    tasks.forEach((task, index) => {
      if (subProcesses[task]) {
        xml += `    <bpmn:subProcess id="SubProcess_${index + 1}" name="${task}">
  `;
        subProcesses[task].forEach((subTask, subIndex) => {
          xml += `      <bpmn:task id="SubTask_${index + 1}_${subIndex + 1}" name="${subTask}" />
  `;
        });
        xml += `    </bpmn:subProcess>
  `;
      } else {
        xml += `    <bpmn:task id="Task_${index + 1}" name="${task}" />
  `;
      }
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
  
    let xOffset = 200;
    tasks.forEach((task, index) => {
      if (subProcesses[task]) {
        xml += `      <bpmndi:BPMNShape id="SubProcess_${index + 1}_di" bpmnElement="SubProcess_${index + 1}">
        <dc:Bounds x="${xOffset}" y="77" width="200" height="150" />
      </bpmndi:BPMNShape>
  `;
        xOffset += 250;
      } else {
        xml += `      <bpmndi:BPMNShape id="Task_${index + 1}_di" bpmnElement="Task_${index + 1}">
        <dc:Bounds x="${xOffset}" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
  `;
        xOffset += 150;
      }
    });
  
    xml += `      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="${xOffset}" y="99" width="36" height="36" />
      </bpmndi:BPMNShape>
  `;
  
    xOffset = 200;
    tasks.forEach((task, index) => {
      const nextXOffset = subProcesses[task] ? xOffset + 250 : xOffset + 150;
      xml += `      <bpmndi:BPMNEdge id="Flow_${index + 1}_di" bpmnElement="Flow_${index + 1}">
        <di:waypoint x="${xOffset}" y="117" />
        <di:waypoint x="${nextXOffset}" y="117" />
      </bpmndi:BPMNEdge>
  `;
      xOffset = nextXOffset;
    });
  
    xml += `    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
  </bpmn:definitions>`;
  
    return xml;
  };
  
  // Sample business process description for medical credentialing
  const sampleText = "The medical credentialing process begins when a healthcare provider submits an application. The credentialing specialist reviews the application for completeness. Document verification: Check medical school diploma, Verify state medical license, Confirm board certifications, Validate work history. The verification team conducts primary source verification. The credentialing committee reviews the verified information and makes a decision. If approved, the medical board issues the credentials.";
  
  console.log("Testing Natural Language Processor for Medical Credentialing:");
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
  