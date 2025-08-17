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
        hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
        hasSupabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    };
    
    console.log('🔧 Config response:', {
        hasApiKey: config.hasApiKey,
        hasSpreadsheetId: config.hasSpreadsheetId,
        hasSupabase: config.hasSupabase,
        spreadsheetId: config.spreadsheetId ? 'Set' : 'Not set'
    });
    
    res.json(config);
});

// Supabase waitlist submission endpoint
app.post('/api/submit-waitlist', async (req, res) => {
    console.log('📝 Waitlist submission endpoint called');
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { name, email } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ 
                error: 'Name and email are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }

        // Check if Supabase is configured
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
            console.error('❌ Supabase credentials not configured');
            return res.status(500).json({ 
                error: 'Database not configured' 
            });
        }

        // Import and initialize Supabase client
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

        // Get client information
        const ipAddress = req.headers['x-forwarded-for'] || 
                         req.connection.remoteAddress || 
                         req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Insert into Supabase
        const { data, error } = await supabase
            .from('Waitlist entries')
            .insert([
                {
                    name: name.trim(),
                    email: email.toLowerCase().trim(),
                    created_at: new Date().toISOString(),
                    ip_address: ipAddress,
                    user_agent: userAgent
                }
            ])
            .select();

        if (error) {
            console.error('❌ Supabase error:', error);
            
            // Handle duplicate email error
            if (error.code === '23505') {
                return res.status(409).json({ 
                    error: 'Email already registered' 
                });
            }
            
            return res.status(500).json({ 
                error: 'Failed to save entry' 
            });
        }

        console.log('✅ Waitlist entry saved to Supabase:', {
            id: data[0].id,
            name: data[0].name,
            email: data[0].email,
            created_at: data[0].created_at
        });

        res.status(200).json({ 
            success: true, 
            message: 'Successfully added to waitlist!',
            data: data[0]
        });

    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 iOS Simulator: http://192.168.1.119:${PORT}`);
    console.log('🔑 Environment variables:');
    console.log('   - GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'Set' : 'Not set');
    console.log('   - SPREADSHEET_ID:', process.env.SPREADSHEET_ID ? 'Set' : 'Not set');
    console.log('   - SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
    console.log('   - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');
    console.log('');
    console.log('📧 Email Section Control:');
    console.log('   - Edit SHOW_EMAIL_SECTION in script.js to control visibility');
    console.log('   - true = show email section');
    console.log('   - false = hide email section completely');
    console.log('');
    console.log('📱 iOS Simulator Testing:');
    console.log('   1. Open iOS Simulator');
    console.log('   2. Open Safari in simulator');
    console.log('   3. Navigate to: http://192.168.1.119:3000');
});
