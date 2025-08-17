const { createClient } = require('@supabase/supabase-js');

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

        // Initialize Supabase client
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
};
