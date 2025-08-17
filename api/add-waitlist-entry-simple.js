const { google } = require('googleapis');

// Create credentials object from individual environment variables
const createCredentials = () => {
    return {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
    };
};

let auth, sheets;

try {
    console.log('🔑 Creating credentials from individual env vars...');
    const credentials = createCredentials();
    console.log('✅ Credentials created successfully');
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
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${requestId}] 🔔 API endpoint called:`, req.method, req.url);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        console.log(`[${timestamp}] [${requestId}] ✅ CORS preflight request handled`);
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        console.log(`[${timestamp}] [${requestId}] ❌ Invalid method:`, req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log(`[${timestamp}] [${requestId}] 🔍 Starting request processing...`);
        const { name, email } = req.body;
        console.log(`[${timestamp}] [${requestId}] 📝 Extracted data:`, { name, email });
        
        if (!name || !email) {
            console.log(`[${timestamp}] [${requestId}] ❌ Missing required fields`);
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        console.log(`[${timestamp}] [${requestId}] ✅ Data validation passed`);
        const entryTimestamp = new Date().toISOString();
        const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
        
        console.log(`[${timestamp}] [${requestId}] 🔑 Environment check:`);
        console.log(`[${timestamp}] [${requestId}]   - SPREADSHEET_ID exists:`, !!SPREADSHEET_ID);
        console.log(`[${timestamp}] [${requestId}]   - GOOGLE_CLIENT_EMAIL exists:`, !!process.env.GOOGLE_CLIENT_EMAIL);
        console.log(`[${timestamp}] [${requestId}]   - GOOGLE_PRIVATE_KEY exists:`, !!process.env.GOOGLE_PRIVATE_KEY);
        
        if (!SPREADSHEET_ID) {
            console.log(`[${timestamp}] [${requestId}] ❌ SPREADSHEET_ID not configured`);
            return res.status(500).json({ error: 'Spreadsheet ID not configured' });
        }
        
        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            console.log(`[${timestamp}] [${requestId}] ❌ Google credentials not configured`);
            return res.status(500).json({ error: 'Google credentials not configured' });
        }
        
        console.log(`[${timestamp}] [${requestId}] 🌐 Making Google Sheets API call...`);
        console.log(`[${timestamp}] [${requestId}]   - Spreadsheet ID:`, SPREADSHEET_ID);
        console.log(`[${timestamp}] [${requestId}]   - Data to append:`, [entryTimestamp, name, email]);
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: { values: [[entryTimestamp, name, email]] }
        });
        
        console.log(`[${timestamp}] [${requestId}] ✅ Google Sheets API response:`, response.data);
        console.log(`[${timestamp}] [${requestId}] ✅ Entry added successfully:`, { name, email, entryTimestamp });
        
        res.status(200).json({ 
            success: true, 
            message: 'Entry added successfully', 
            data: { name, email, entryTimestamp }, 
            requestId: requestId 
        });
        
    } catch (error) {
        console.error(`[${timestamp}] [${requestId}] 💥 Error in API endpoint:`);
        console.error(`[${timestamp}] [${requestId}]   - Error message:`, error.message);
        console.error(`[${timestamp}] [${requestId}]   - Error code:`, error.code);
        console.error(`[${timestamp}] [${requestId}]   - Error stack:`, error.stack);
        
        res.status(500).json({ 
            error: 'Failed to add entry', 
            details: error.message, 
            code: error.code, 
            requestId: requestId 
        });
    }
};
