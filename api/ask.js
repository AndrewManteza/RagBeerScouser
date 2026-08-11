// Vercel Serverless Function - Proxy to Databricks REST API
const https = require('https');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  
  // Databricks credentials from environment variables
  const host = process.env.DATABRICKS_HOST.replace('https://', '');
  const token = process.env.DATABRICKS_TOKEN;
  const endpoint = process.env.ENDPOINT_NAME || 'beer-rag-chatbot-endpoint';
  
  const options = {
    hostname: host,
    port: 443,
    path: `/serving-endpoints/${endpoint}/invocations`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const payload = JSON.stringify({
    dataframe_records: [{ question }]
  });
  
  // Make request to Databricks
  const databricksReq = https.request(options, (databricksRes) => {
    let data = '';
    
    databricksRes.on('data', (chunk) => {
      data += chunk;
    });
    
    databricksRes.on('end', () => {
      try {
        const result = JSON.parse(data);
        const answer = result.predictions?.[0] || 'No answer received';
        res.status(200).json({ answer });
      } catch (error) {
        console.error('Parse error:', error);
        res.status(500).json({ error: 'Failed to parse response' });
      }
    });
  });
  
  databricksReq.on('error', (error) => {
    console.error('Request error:', error);
    res.status(500).json({ error: 'Failed to connect to Databricks' });
  });
  
  databricksReq.write(payload);
  databricksReq.end();
};
