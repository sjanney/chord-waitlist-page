module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const config = {
        googleApiKey: process.env.GOOGLE_API_KEY,
        spreadsheetId: process.env.SPREADSHEET_ID,
        hasApiKey: !!process.env.GOOGLE_API_KEY,
        hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
        hasSupabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    };
    
    console.log('🔧 Config response:', {
        hasApiKey: config.hasApiKey,
        hasSpreadsheetId: config.hasSpreadsheetId,
        hasSupabase: config.hasSupabase,
        spreadsheetId: config.spreadsheetId ? 'Set' : 'Not set'
    });
    
    res.status(200).json(config);
};
