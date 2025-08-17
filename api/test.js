module.exports = async (req, res) => {
    console.log('🧪 Test endpoint called');
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const testData = {
            status: 'API is working',
            timestamp: new Date().toISOString(),
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
        
        console.log('🧪 Test response:', testData);
        
        res.status(200).json(testData);
        
    } catch (error) {
        console.error('💥 Test endpoint error:', error);
        res.status(500).json({ 
            error: 'Test failed', 
            details: error.message 
        });
    }
};
