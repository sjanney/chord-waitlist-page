module.exports = async (req, res) => {
    console.log('🧪 Simple test endpoint called');
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const testData = {
            status: 'Simple test working',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            body: req.body,
            headers: req.headers,
            env: {
                hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
                hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
                spreadsheetId: process.env.SPREADSHEET_ID ? 'Set' : 'Not set'
            }
        };
        
        console.log('🧪 Simple test response:', testData);
        
        res.status(200).json(testData);
        
    } catch (error) {
        console.error('💥 Simple test error:', error);
        res.status(500).json({ 
            error: 'Simple test failed', 
            details: error.message 
        });
    }
};
