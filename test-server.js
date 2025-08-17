const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

console.log('🔧 Starting local test server...');

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
}

// Test endpoint
app.get('/api/test', async (req, res) => {
    console.log('🧪 Test endpoint called');
    
    try {
        const testData = {
            status: 'API is working',
            timestamp: new Date().toISOString(),
            environment: {
                hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
                hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
                spreadsheetId: process.env.SPREADSHEET_ID || 'Not set',
                serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Not set'
            }
        };
        
        console.log('🧪 Test response:', testData);
        res.json(testData);
        
    } catch (error) {
        console.error('💥 Test endpoint error:', error);
        res.status(500).json({ error: 'Test failed', details: error.message });
    }
});

// Add waitlist entry endpoint
app.post('/api/add-waitlist-entry', async (req, res) => {
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] [${requestId}] 🔔 API endpoint called:`, req.method, req.url);
    console.log(`[${timestamp}] [${requestId}] 📦 Request body:`, JSON.stringify(req.body, null, 2));
    
    try {
        console.log(`[${timestamp}] [${requestId}] 🔍 Starting request processing...`);
        
        const { name, email } = req.body;
        console.log(`[${timestamp}] [${requestId}] 📝 Extracted data:`, JSON.stringify({ name, email }, null, 2));
        
        if (!name || !email) {
            console.log(`[${timestamp}] [${requestId}] ❌ Missing required fields`);
            return res.status(400).json({ error: 'Name and email are required' });
        }

        console.log(`[${timestamp}] [${requestId}] ✅ Data validation passed`);

        const entryTimestamp = new Date().toISOString();
        const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
        
        console.log(`[${timestamp}] [${requestId}] 🔑 Environment check:`);
        console.log(`[${timestamp}] [${requestId}]   - SPREADSHEET_ID exists:`, !!SPREADSHEET_ID);
        console.log(`[${timestamp}] [${requestId}]   - GOOGLE_SERVICE_ACCOUNT_KEY exists:`, !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        
        if (!SPREADSHEET_ID) {
            console.log(`[${timestamp}] [${requestId}] ❌ SPREADSHEET_ID not configured`);
            return res.status(500).json({ error: 'Spreadsheet ID not configured' });
        }
        
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
            console.log(`[${timestamp}] [${requestId}] ❌ GOOGLE_SERVICE_ACCOUNT_KEY not configured`);
            return res.status(500).json({ error: 'Google service account key not configured' });
        }
        
        console.log(`[${timestamp}] [${requestId}] 🌐 Making Google Sheets API call...`);
        console.log(`[${timestamp}] [${requestId}]   - Spreadsheet ID:`, SPREADSHEET_ID);
        console.log(`[${timestamp}] [${requestId}]   - Data to append:`, JSON.stringify([entryTimestamp, name, email], null, 2));
        
        // Add row to the sheet
        console.log(`[${timestamp}] [${requestId}] 📝 Attempting to append to Google Sheet...`);
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[entryTimestamp, name, email]]
            }
        });

        console.log(`[${timestamp}] [${requestId}] ✅ Google Sheets API response:`, JSON.stringify(response.data, null, 2));
        console.log(`[${timestamp}] [${requestId}] ✅ Entry added successfully:`, JSON.stringify({ name, email, entryTimestamp }, null, 2));
        
        res.json({ 
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
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const timestamp = new Date().toISOString();
    const requestId = Math.random().toString(36).substring(7);
    
    console.log(`[${timestamp}] [${requestId}] 🏥 Health check requested`);
    
    try {
        const healthData = {
            status: 'healthy',
            timestamp: timestamp,
            requestId: requestId,
            environment: {
                hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
                hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
                spreadsheetId: process.env.SPREADSHEET_ID || 'Not set',
                serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Not set'
            }
        };
        
        console.log(`[${timestamp}] [${requestId}] 🏥 Health check response:`, JSON.stringify(healthData, null, 2));
        
        res.json(healthData);
        
    } catch (error) {
        console.error(`[${timestamp}] [${requestId}] 💥 Health check error:`, error);
        res.status(500).json({ 
            status: 'unhealthy',
            error: 'Health check failed', 
            details: error.message,
            requestId: requestId
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`);
    console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📝 Waitlist page: http://localhost:${PORT}`);
});
