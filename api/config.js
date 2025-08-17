module.exports = async (req, res) => {
    console.log('🔧 Config endpoint called');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const config = {
            googleApiKey: process.env.GOOGLE_API_KEY,
            spreadsheetId: process.env.SPREADSHEET_ID,
            hasApiKey: !!process.env.GOOGLE_API_KEY,
            hasSpreadsheetId: !!process.env.SPREADSHEET_ID
        };
        
        console.log('🔧 Config response:', {
            hasApiKey: config.hasApiKey,
            hasSpreadsheetId: config.hasSpreadsheetId,
            spreadsheetId: config.spreadsheetId ? 'Set' : 'Not set'
        });
        
        res.status(200).json(config);
        
    } catch (error) {
        console.error('💥 Config endpoint error:', error);
        res.status(500).json({ 
            error: 'Config failed', 
            details: error.message 
        });
    }
};
