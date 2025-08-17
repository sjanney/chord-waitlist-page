# Environment Variables Setup Guide

This guide will help you set up your waitlist page with secure environment variables for Google Sheets integration.

## 🔑 **Step 1: Get Your Google API Key**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select an existing one
3. **Enable the Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create API Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key (it will look like: `AIzaSyB...`)

## 🔒 **Step 2: Configure API Key Restrictions (Important!)**

1. **Click on your newly created API key**
2. **Under "Application restrictions", select "HTTP referrers (web sites)"**
3. **Add your domain(s)**:
   - `https://your-vercel-domain.vercel.app/*`
   - `http://localhost:3000/*` (for local testing)
4. **Under "API restrictions", select "Restrict key"**
5. **Select "Google Sheets API" from the dropdown**
6. **Click "Save"**

## 📊 **Step 3: Create a Google Sheet**

1. **Go to [Google Sheets](https://sheets.google.com/)**
2. **Create a new spreadsheet**
3. **Name it "Chord Waitlist"**
4. **Add headers in the first row**:
   - A1: "Timestamp"
   - B1: "Name" 
   - C1: "Email"
5. **Copy the Spreadsheet ID from the URL**:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the long string between `/d/` and `/edit`

## 🔗 **Step 4: Share the Sheet**

1. **In your Google Sheet, click "Share"**
2. **Click "Change to anyone with the link"**
3. **Set permissions to "Editor"**
4. **Click "Done"**

## ⚙️ **Step 5: Set Environment Variables in Vercel**

### **Option A: Using Vercel Dashboard**
1. **Go to your Vercel project dashboard**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add these variables**:

**Variable 1:**
- Name: `GOOGLE_API_KEY`
- Value: Your Google API key (from Step 1)
- Environment: Production, Preview, Development

**Variable 2:**
- Name: `SPREADSHEET_ID`
- Value: Your Google Sheet ID (from Step 3)
- Environment: Production, Preview, Development

### **Option B: Using Vercel CLI**
```bash
# Set the environment variables
vercel env add GOOGLE_API_KEY
vercel env add SPREADSHEET_ID

# Deploy to production
vercel --prod
```

## 🚀 **Step 6: Deploy Your Project**

```bash
# Deploy to Vercel
npx vercel --prod
```

The build process will automatically inject your environment variables into the JavaScript file during deployment.

## 🧪 **Step 7: Test Your Setup**

1. **Visit your deployed site**
2. **Open browser developer tools** (F12)
3. **Check the console for these messages**:
   - `🚀 Initializing Google API...`
   - `✅ Google API ready for use`
4. **Enter a name and email**
5. **Press Enter**
6. **Check your Google Sheet for the new entry**

## 🔍 **Troubleshooting**

### **"Google API key not configured" error:**
- Check that `GOOGLE_API_KEY` environment variable is set in Vercel
- Make sure it's set for all environments (Production, Preview, Development)

### **"API key not valid" error:**
- Verify your API key is correct
- Check that API key restrictions allow your domain
- Make sure Google Sheets API is enabled

### **"Spreadsheet not found" error:**
- Verify your Spreadsheet ID is correct
- Make sure the sheet is shared with "anyone with the link"

### **"Permission denied" error:**
- Check that the sheet is set to "Editor" permissions
- Verify the API key has access to the sheet

## 🔒 **Security Benefits**

- ✅ **API Key is restricted** to your domain only
- ✅ **API Key is restricted** to Google Sheets API only
- ✅ **Environment variables** are secure and not exposed in code
- ✅ **Build-time injection** keeps secrets safe
- ✅ **No hardcoded secrets** in your source code

## 📁 **File Structure**

```
chord-waitlist-page/
├── index.html              # Main page with Google API scripts
├── styles.css              # Styling
├── script.js               # Frontend logic (with placeholders)
├── build.js                # Build script for environment variables
├── package.json            # Package config with build script
├── vercel.json             # Vercel configuration
├── assets/
│   └── background.jpg
└── ENVIRONMENT_SETUP.md    # This guide
```

## 🎯 **How It Works**

1. **Environment variables** are set in Vercel
2. **Build script** (`build.js`) runs during deployment
3. **Placeholders** in `script.js` are replaced with actual values
4. **Frontend** uses the injected values to call Google Sheets API
5. **Form submissions** go directly to Google Sheets
6. **No secrets exposed** in client-side code

## 🚨 **Important Notes**

- **Never commit API keys** to version control
- **Always restrict API keys** to your domain
- **Use environment variables** for all secrets
- **Test locally** before deploying
- **Monitor API usage** in Google Cloud Console

## 🎉 **You're Done!**

Your waitlist page now securely integrates with Google Sheets using environment variables. The API key and spreadsheet ID are injected at build time and kept secure.

## 📞 **Need Help?**

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Check your Google Cloud Console for API usage and errors
4. Make sure your API key restrictions allow your domain
