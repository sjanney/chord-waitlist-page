const { google } = require('googleapis');

console.log('🔧 Initializing Google Sheets API...');

// Google Sheets setup
let auth, sheets;

try {
    console.log('🔑 Parsing service account key...');
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    console.log('✅ Service account key parsed successfully');
    console.log('📧 Service account email:', credentials.client_email);
    
    auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    console.log('✅ Google Auth initialized');
    
    sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API client created');
    
} catch (error) {
    console.error('💥 Error initializing Google Sheets API:', error);
    console.error('💥 This will cause all requests to fail');
}

module.exports = async (req, res) => {
    console.log('🔔 API endpoint called:', req.method, req.url);
    console.log('📋 Request headers:', req.headers);
    console.log('📦 Request body:', req.body);
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('✅ CORS preflight request handled');
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        console.log('❌ Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🔍 Starting request processing...');
        
        const { name, email } = req.body;
        console.log('📝 Extracted data:', { name, email });
        
        if (!name || !email) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ error: 'Name and email are required' });
        }

        console.log('✅ Data validation passed');

        const timestamp = new Date().toISOString();
        const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
        
        console.log('🔑 Environment check:');
        console.log('  - SPREADSHEET_ID exists:', !!SPREADSHEET_ID);
        console.log('  - GOOGLE_SERVICE_ACCOUNT_KEY exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        
        if (!SPREADSHEET_ID) {
            console.log('❌ SPREADSHEET_ID not configured');
            return res.status(500).json({ error: 'Spreadsheet ID not configured' });
        }
        
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
            console.log('❌ GOOGLE_SERVICE_ACCOUNT_KEY not configured');
            return res.status(500).json({ error: 'Google service account key not configured' });
        }
        
        console.log('🌐 Making Google Sheets API call...');
        console.log('  - Spreadsheet ID:', SPREADSHEET_ID);
        console.log('  - Data to append:', [timestamp, name, email]);
        
        // Add row to the sheet
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[timestamp, name, email]]
            }
        });

        console.log('✅ Google Sheets API response:', response.data);
        console.log('✅ Entry added successfully:', { name, email, timestamp });
        
        res.status(200).json({ 
            success: true, 
            message: 'Entry added successfully',
            data: { name, email, timestamp }
        });
        
    } catch (error) {
        console.error('💥 Error in API endpoint:');
        console.error('  - Error message:', error.message);
        console.error('  - Error code:', error.code);
        console.error('  - Error stack:', error.stack);
        
        res.status(500).json({ 
            error: 'Failed to add entry', 
            details: error.message,
            code: error.code
        });
    }
};
