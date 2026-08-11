// Vercel Serverless Function - Proxy to Databricks REST API
// Location: api/ask.js

module.exports = async (req, res) => {
  console.log('API endpoint hit:', req.method, req.url);
  
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  // Health check endpoint
  if (req.method === 'GET') {
    console.log('Health check request');
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Beer Chatbot API is running',
      timestamp: new Date().toISOString()
    });
  }
  
  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  // Validate request body
  const { question } = req.body;
  
  if (!question) {
    console.log('Missing question in request body');
    return res.status(400).json({ error: 'Question is required in request body' });
  }
  
  console.log('Processing question:', question.substring(0, 50));
  
  // Check environment variables
  if (!process.env.DATABRICKS_HOST) {
    console.error('DATABRICKS_HOST environment variable not set');
    return res.status(500).json({ 
      error: 'Server configuration error: DATABRICKS_HOST not set',
      hint: 'Add environment variables in Vercel dashboard'
    });
  }
  
  if (!process.env.DATABRICKS_TOKEN) {
    console.error('DATABRICKS_TOKEN environment variable not set');
    return res.status(500).json({ 
      error: 'Server configuration error: DATABRICKS_TOKEN not set',
      hint: 'Add environment variables in Vercel dashboard'
    });
  }
  
  try {
    // Prepare Databricks API request
    const host = process.env.DATABRICKS_HOST.replace('https://', '').replace('http://', '');
    const token = process.env.DATABRICKS_TOKEN;
    const endpoint = process.env.ENDPOINT_NAME || 'beer-rag-chatbot-endpoint';
    
    console.log('Calling Databricks endpoint:', endpoint);
    
    const https = require('https');
    
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
        console.log('Databricks response status:', databricksRes.statusCode);
        
        try {
          const result = JSON.parse(data);
          
          if (databricksRes.statusCode !== 200) {
            console.error('Databricks error:', result);
            return res.status(databricksRes.statusCode).json({ 
              error: 'Databricks API error',
              details: result
            });
          }
          
          const answer = result.predictions?.[0] || 'No answer received';
          console.log('Answer generated successfully');
          res.status(200).json({ answer });
          
        } catch (parseError) {
          console.error('Parse error:', parseError);
          console.error('Raw response:', data);
          res.status(500).json({ 
            error: 'Failed to parse Databricks response',
            raw: data.substring(0, 200)
          });
        }
      });
    });
    
    databricksReq.on('error', (error) => {
      console.error('Request error:', error);
      res.status(500).json({ 
        error: 'Failed to connect to Databricks',
        details: error.message
      });
    });
    
    databricksReq.write(payload);
    databricksReq.end();
    
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};
