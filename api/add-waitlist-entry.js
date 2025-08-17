const { google } = require('googleapis');

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const timestamp = new Date().toISOString();
        const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
        
        if (!SPREADSHEET_ID) {
            return res.status(500).json({ error: 'Spreadsheet ID not configured' });
        }
        
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

        console.log('Entry added:', { name, email, timestamp });
        res.status(200).json({ success: true, message: 'Entry added successfully' });
        
    } catch (error) {
        console.error('Error adding entry:', error);
        res.status(500).json({ error: 'Failed to add entry', details: error.message });
    }
};
