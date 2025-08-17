module.exports = async (req, res) => {
    const timestamp = new Date().toISOString();
    const requestId = Math.random().toString(36).substring(7);
    
    console.log(`[${timestamp}] [${requestId}] 🏥 Health check requested`);
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const healthData = {
            status: 'healthy',
            timestamp: timestamp,
            requestId: requestId,
            environment: {
                hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
                hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
                spreadsheetId: process.env.SPREADSHEET_ID ? 'Set' : 'Not set',
                serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Not set'
            },
            headers: req.headers,
            method: req.method,
            url: req.url
        };
        
        console.log(`[${timestamp}] [${requestId}] 🏥 Health check response:`, JSON.stringify(healthData, null, 2));
        
        res.status(200).json(healthData);
        
    } catch (error) {
        console.error(`[${timestamp}] [${requestId}] 💥 Health check error:`, error);
        res.status(500).json({ 
            status: 'unhealthy',
            error: 'Health check failed', 
            details: error.message,
            requestId: requestId
        });
    }
};
