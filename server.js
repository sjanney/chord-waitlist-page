const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Environment variables endpoint
app.get('/api/config', (req, res) => {
    console.log('🔧 Config endpoint called');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    
    res.json(config);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('🔑 Environment variables:');
    console.log('   - GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'Set' : 'Not set');
    console.log('   - SPREADSHEET_ID:', process.env.SPREADSHEET_ID ? 'Set' : 'Not set');
    console.log('');
    console.log('📧 Email Section Control:');
    console.log('   - Edit SHOW_EMAIL_SECTION in script.js to control visibility');
    console.log('   - true = show email section');
    console.log('   - false = hide email section completely');
});
