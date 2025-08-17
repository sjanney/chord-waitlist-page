module.exports = async (req, res) => {
    console.log('🔍 Environment test endpoint called');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        const spreadsheetId = process.env.SPREADSHEET_ID;
        
        let parsedKey = null;
        let parseError = null;
        let clientEmail = null;
        
        if (serviceAccountKey) {
            try {
                parsedKey = JSON.parse(serviceAccountKey);
                clientEmail = parsedKey.client_email;
            } catch (error) {
                parseError = error.message;
            }
        }
        
        const testData = {
            status: 'Environment test',
            timestamp: new Date().toISOString(),
            environment: {
                hasSpreadsheetId: !!spreadsheetId,
                hasServiceAccountKey: !!serviceAccountKey,
                spreadsheetId: spreadsheetId || 'Not set',
                serviceAccountKeyLength: serviceAccountKey ? serviceAccountKey.length : 0,
                parsedKeySuccess: !!parsedKey,
                parseError: parseError,
                clientEmail: clientEmail
            },
            instructions: {
                message: 'If any values show as "Not set" or "false", you need to configure your environment variables in Vercel.',
                nextSteps: [
                    'Go to your Vercel dashboard',
                    'Navigate to Project Settings > Environment Variables',
                    'Add SPREADSHEET_ID and GOOGLE_SERVICE_ACCOUNT_KEY',
                    'Make sure to select all environments (Production, Preview, Development)',
                    'Redeploy your project'
                ]
            }
        };
        
        console.log('🔍 Environment test response:', testData);
        
        res.status(200).json(testData);
        
    } catch (error) {
        console.error('💥 Environment test error:', error);
        res.status(500).json({ 
            error: 'Environment test failed', 
            details: error.message 
        });
    }
};
