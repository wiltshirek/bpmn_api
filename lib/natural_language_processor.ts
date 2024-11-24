export function processText(text: string) {
    const tasks = text.split('.').filter(sentence => sentence.trim().length > 0).map(sentence => sentence.trim());
    const actors = ['Customer', 'Sales Department', 'Warehouse', 'Purchasing Department', 'Shipping Department', 'Finance Department'];
    return { tasks, actors };
  }
  