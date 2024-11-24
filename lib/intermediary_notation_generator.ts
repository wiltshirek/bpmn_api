interface ProcessedText {
    tasks: string[];
    actors: string[];
  }
  
  export function generateIntermediaryNotation(processedText: ProcessedText): string {
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
  }
  