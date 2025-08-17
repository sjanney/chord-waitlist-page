module.exports = async (req, res) => {
    console.log('🔧 Basic test called');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const response = {
        message: 'Basic test working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        env: {
            hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
            hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY
        }
    };

    console.log('🔧 Basic test response:', response);
    res.status(200).json(response);
};
