const fs = require('fs');

// Read the service account JSON file
const serviceAccountPath = './service-account-key.json';

try {
    if (!fs.existsSync(serviceAccountPath)) {
        console.log('❌ Service account JSON file not found at:', serviceAccountPath);
        console.log('📝 Please place your service account JSON file in the project root as "service-account-key.json"');
        process.exit(1);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    console.log('🔑 Extracted environment variables from service account:');
    console.log('');
    console.log('Add these to your Vercel environment variables:');
    console.log('');
    console.log(`GOOGLE_PROJECT_ID=${serviceAccount.project_id}`);
    console.log(`GOOGLE_PRIVATE_KEY_ID=${serviceAccount.private_key_id}`);
    console.log(`GOOGLE_PRIVATE_KEY="${serviceAccount.private_key}"`);
    console.log(`GOOGLE_CLIENT_EMAIL=${serviceAccount.client_email}`);
    console.log(`GOOGLE_CLIENT_ID=${serviceAccount.client_id}`);
    console.log(`GOOGLE_CLIENT_X509_CERT_URL=${serviceAccount.client_x509_cert_url}`);
    console.log('');
    console.log('📝 Copy and paste these into your Vercel dashboard:');
    console.log('1. Go to your Vercel project dashboard');
    console.log('2. Go to Settings > Environment Variables');
    console.log('3. Add each variable above');
    console.log('4. Make sure to select "Production", "Preview", and "Development"');
    console.log('');
    console.log('⚠️  Important: The GOOGLE_PRIVATE_KEY should be the entire private key including the "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" parts');
    
} catch (error) {
    console.error('💥 Error reading service account file:', error.message);
    process.exit(1);
}
