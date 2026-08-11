// Vercel Serverless Function - Compare beer styles
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
  
  const { style1, style2 } = req.body;
  
  if (!style1 || !style2) {
    return res.status(400).json({ error: 'Both beer styles are required' });
  }
  
  if (style1.toLowerCase() === style2.toLowerCase()) {
    return res.status(400).json({ error: 'Please provide two different beer styles' });
  }
  
  // Databricks credentials from environment variables
  const host = process.env.DATABRICKS_HOST.replace('https://', '');
  const token = process.env.DATABRICKS_TOKEN;
  const endpoint = process.env.ENDPOINT_NAME || 'beer-rag-chatbot-endpoint';
  
  try {
    // Make two parallel requests to get info for both styles
    const question1 = `Describe the characteristics, ABV, flavor profile, and brewing process of ${style1}`;
    const question2 = `Describe the characteristics, ABV, flavor profile, and brewing process of ${style2}`;
    
    // Helper function to make a request
    const makeRequest = (question) => {
      return new Promise((resolve, reject) => {
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
        
        const databricksReq = https.request(options, (databricksRes) => {
          let data = '';
          
          databricksRes.on('data', (chunk) => {
            data += chunk;
          });
          
          databricksRes.on('end', () => {
            try {
              const result = JSON.parse(data);
              const answer = result.predictions?.[0] || 'No answer received';
              resolve(answer);
            } catch (error) {
              reject(error);
            }
          });
        });
        
        databricksReq.on('error', (error) => {
          reject(error);
        });
        
        databricksReq.write(payload);
        databricksReq.end();
      });
    };
    
    // Get both answers
    const [info1, info2] = await Promise.all([
      makeRequest(question1),
      makeRequest(question2)
    ]);
    
    // Format the comparison
    const comparison = `## 🍺 Beer Style Comparison

### ${style1}
${info1}

---

### ${style2}
${info2}

---

### Quick Comparison Summary
Both styles have unique characteristics. Compare the details above to see differences in:
- **Alcohol content (ABV)**
- **Flavor profiles** (hops, malt, sweetness, bitterness)
- **Brewing methods** (fermentation temperature, yeast type)
- **Appearance** (color, clarity, head retention)
`;
    
    res.status(200).json({ comparison });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to compare beer styles' });
  }
};
