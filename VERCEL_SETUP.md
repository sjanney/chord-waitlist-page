# Vercel Deployment Setup Guide

## Prerequisites
Complete the Google Sheets API setup from `SETUP.md` first, then follow this guide.

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Prepare Your Service Account Key
1. Open your `service-account-key.json` file
2. Copy the entire JSON content
3. You'll need this for the environment variable setup

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: chord-waitlist
# - Directory: ./
```

### Option B: Using Vercel Dashboard
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project settings

## Step 4: Set Environment Variables

### In Vercel Dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables:

**Variable 1:**
- Name: `SPREADSHEET_ID`
- Value: Your Google Sheet ID (from the URL)
- Environment: Production, Preview, Development

**Variable 2:**
- Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
- Value: The entire JSON content from your service-account-key.json file
- Environment: Production, Preview, Development

### Using Vercel CLI:
```bash
vercel env add SPREADSHEET_ID
vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
```

## Step 5: Redeploy
After setting environment variables:
```bash
vercel --prod
```

## Step 6: Test Your Deployment
1. Visit your Vercel URL (e.g., `https://chord-waitlist.vercel.app`)
2. Enter a name and email
3. Check your Google Sheet for the new entry

## File Structure for Vercel
```
chord-waitlist-page/
├── index.html
├── styles.css
├── script.js
├── vercel.json
├── package.json
├── api/
│   └── add-waitlist-entry.js
├── assets/
│   └── background.jpg
└── VERCEL_SETUP.md
```

## Custom Domain (Optional)
1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS settings as instructed

## Environment Variables Format
Make sure your `GOOGLE_SERVICE_ACCOUNT_KEY` is the complete JSON string:
```json
{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

## Troubleshooting

### "Invalid credentials" error:
- Check that `GOOGLE_SERVICE_ACCOUNT_KEY` contains the complete JSON
- Verify the service account has access to your Google Sheet

### "Spreadsheet not found" error:
- Verify `SPREADSHEET_ID` is correct
- Make sure you shared the sheet with the service account email

### Function timeout:
- Vercel functions have a 10-second timeout
- This should be plenty for Google Sheets API calls

## Benefits of Vercel Deployment
- ✅ **Free tier**: Generous limits
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Automatic HTTPS**: Secure by default
- ✅ **Custom domains**: Easy to set up
- ✅ **Serverless**: Scales automatically
- ✅ **Easy deployment**: Git integration

## Monitoring
- Check Vercel dashboard for function logs
- Monitor Google Sheets for new entries
- Set up alerts if needed
