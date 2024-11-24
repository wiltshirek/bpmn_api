BPMN Generator API
==================

This project is a BPMN (Business Process Model and Notation) generator API that converts natural language descriptions of business processes into BPMN XML.

Prerequisites
-------------
- Node.js 18 or later
- npm (usually comes with Node.js)
- Docker (optional, for containerization)

Project Structure
-----------------
/
├── lib/
│   ├── natural_language_processor.ts
│   ├── intermediary_notation_generator.ts
│   └── bpmn_xml_generator.ts
├── pages/
│   └── api/
│       └── chat.ts
├── test_natural_language_processor.js
├── test_medical_credentialing.js
├── package.json
├── Dockerfile
└── README.txt (this file)

Setup and Installation
----------------------
1. Clone the repository:
   git clone https://github.com/yourusername/bpmn-generator.git
   cd bpmn-generator

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

The API will be available at http://localhost:3000 by default.

Using the API
-------------
To generate a BPMN XML from a natural language description, send a POST request to the /api/chat endpoint with a JSON payload containing the 'prompt' field.

Example using curl:

curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"prompt": "The order process begins when a customer places an order. The sales department reviews the order. If the order is approved, the warehouse prepares the shipment. The shipping department then delivers the order to the customer. Finally, the finance department issues an invoice."}'

The API will respond with a JSON object containing:
- processedText: The processed text with extracted tasks and actors.
- actorMapping: A mapping of actors to their associated tasks.
- intermediaryNotation: A structured representation of the process.
- bpmnXML: The generated BPMN XML.

Docker Deployment (Optional)
----------------------------
1. Build the Docker image:
   docker build -t bpmn-generator .

2. Run the Docker container:
   docker run -p 3000:3000 bpmn-generator

The API will be available at http://localhost:3000.

Testing
-------
To run the test scripts:

1. For the general process:
   node test_natural_language_processor.js

2. For the medical credentialing process:
   node test_medical_credentialing.js

These scripts will output the processed text, intermediary notation, and generated BPMN XML for sample inputs.

Troubleshooting
---------------
- Ensure all dependencies are installed (npm install).
- Check if the port 3000 is not being used by another application.
- For Docker deployments, ensure Docker is running on your machine.

For any other issues, please open an issue in the GitHub repository.