import type { NextApiRequest, NextApiResponse } from 'next'
import { processText } from '../../lib/natural_language_processor';
import { generateIntermediaryNotation } from '../../lib/intermediary_notation_generator';
import { generateBpmnXml } from '../../lib/bpmn_xml_generator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const processedText = processText(prompt);
      const intermediaryNotation = generateIntermediaryNotation(processedText);
      const bpmnXML = generateBpmnXml(intermediaryNotation);

      const actorMapping = processedText.actors.map(actor => ({
        actor,
        tasks: processedText.tasks
      }));

      res.status(200).json({
        processedText,
        actorMapping,
        intermediaryNotation,
        bpmnXML
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error processing your request' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
