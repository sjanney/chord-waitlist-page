require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
    console.log('🔧 Testing Supabase connection...');
    
    // Check environment variables
    console.log('Environment variables:');
    console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
    console.log('- SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.error('❌ Missing Supabase credentials');
        return;
    }
    
    try {
        // Create Supabase client
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        
        console.log('✅ Supabase client created');
        
        // Test connection by trying to read from the table
        console.log('🔍 Testing table access...');
        const { data, error } = await supabase
            .from('Waitlist entries')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ Error reading from table:', error);
        } else {
            console.log('✅ Successfully read from table');
            console.log('📊 Current data:', data);
        }
        
        // Test inserting a record
        console.log('📝 Testing insert...');
        const { data: insertData, error: insertError } = await supabase
            .from('Waitlist entries')
            .insert([
                {
                    name: 'Test User',
                    email: 'test@example.com',
                    created_at: new Date().toISOString(),
                    ip_address: '127.0.0.1',
                    user_agent: 'Test Script'
                }
            ])
            .select();
            
        if (insertError) {
            console.error('❌ Error inserting:', insertError);
            console.error('Error details:', {
                code: insertError.code,
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint
            });
        } else {
            console.log('✅ Successfully inserted:', insertData);
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

testSupabase();
