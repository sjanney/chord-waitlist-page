const https = require('https');

module.exports = async (req, res) => {
    console.log('🌐 Outbound connection test started');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const testResults = {
        timestamp: new Date().toISOString(),
        tests: {}
    };

    // Test 1: Basic HTTPS request to Google
    try {
        console.log('🧪 Test 1: Testing connection to Google...');
        const googleResult = await makeRequest('https://www.google.com');
        testResults.tests.google = {
            success: true,
            statusCode: googleResult.statusCode,
            responseTime: googleResult.responseTime
        };
        console.log('✅ Google test passed');
    } catch (error) {
        testResults.tests.google = {
            success: false,
            error: error.message
        };
        console.log('❌ Google test failed:', error.message);
    }

    // Test 2: Google Sheets API endpoint
    try {
        console.log('🧪 Test 2: Testing connection to Google Sheets API...');
        const sheetsResult = await makeRequest('https://sheets.googleapis.com/v4/spreadsheets');
        testResults.tests.googleSheets = {
            success: true,
            statusCode: sheetsResult.statusCode,
            responseTime: sheetsResult.responseTime
        };
        console.log('✅ Google Sheets API test passed');
    } catch (error) {
        testResults.tests.googleSheets = {
            success: false,
            error: error.message
        };
        console.log('❌ Google Sheets API test failed:', error.message);
    }

    // Test 3: Google OAuth endpoint
    try {
        console.log('🧪 Test 3: Testing connection to Google OAuth...');
        const oauthResult = await makeRequest('https://oauth2.googleapis.com/token');
        testResults.tests.googleOAuth = {
            success: true,
            statusCode: oauthResult.statusCode,
            responseTime: oauthResult.responseTime
        };
        console.log('✅ Google OAuth test passed');
    } catch (error) {
        testResults.tests.googleOAuth = {
            success: false,
            error: error.message
        };
        console.log('❌ Google OAuth test failed:', error.message);
    }

    console.log('🌐 Outbound connection test completed:', testResults);
    res.status(200).json(testResults);
};

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const req = https.get(url, (res) => {
            const responseTime = Date.now() - startTime;
            resolve({
                statusCode: res.statusCode,
                responseTime: responseTime
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}
