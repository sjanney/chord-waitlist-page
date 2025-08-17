# Google Sheets API Setup (Client-Side)

This guide will help you set up direct Google Sheets API integration from your frontend without any server-side code.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key (you'll need this for the frontend)

## Step 3: Configure API Key Restrictions (Important!)

1. Click on your newly created API key
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s):
   - `https://your-vercel-domain.vercel.app/*`
   - `http://localhost:3000/*` (for local testing)
4. Under "API restrictions", select "Restrict key"
5. Select "Google Sheets API" from the dropdown
6. Click "Save"

## Step 4: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Chord Waitlist"
4. Add headers in the first row:
   - A1: "Timestamp"
   - B1: "Name" 
   - C1: "Email"
5. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the long string between `/d/` and `/edit`

## Step 5: Share the Sheet

1. In your Google Sheet, click "Share"
2. Click "Change to anyone with the link"
3. Set permissions to "Editor"
4. Click "Done"

## Step 6: Update Your Code

1. Open `script.js`
2. Replace these values:
   ```javascript
   const GOOGLE_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   const SPREADSHEET_ID = 'YOUR_ACTUAL_SPREADSHEET_ID_HERE';
   ```

## Step 7: Deploy

1. Deploy your updated code to Vercel:
   ```bash
   npx vercel --prod
   ```

## Step 8: Test

1. Visit your deployed site
2. Enter a name and email
3. Press Enter
4. Check your Google Sheet for the new entry

## Security Notes

- ✅ **API Key is restricted** to your domain only
- ✅ **API Key is restricted** to Google Sheets API only
- ✅ **No server-side code** needed
- ✅ **No service account keys** exposed
- ⚠️ **Sheet is publicly editable** - anyone with the link can edit

## Troubleshooting

### "API key not valid" error:
- Check that your API key is correct
- Verify the API key restrictions allow your domain
- Make sure Google Sheets API is enabled

### "Spreadsheet not found" error:
- Verify your Spreadsheet ID is correct
- Make sure the sheet is shared with "anyone with the link"

### "Permission denied" error:
- Check that the sheet is set to "Editor" permissions
- Verify the API key has access to the sheet

## Benefits of This Approach

- ✅ **No server required** - pure frontend solution
- ✅ **No environment variables** to manage
- ✅ **No deployment complexity** - just static files
- ✅ **Direct Google integration** - no middleman
- ✅ **Easy to maintain** - single codebase

## File Structure

```
chord-waitlist-page/
├── index.html          # Contains Google API scripts
├── styles.css
├── script.js           # Contains Google API integration
├── assets/
│   └── background.jpg
└── GOOGLE_API_SETUP.md
```

## API Key Security

Your API key is safe because:
1. It's restricted to your domain only
2. It's restricted to Google Sheets API only
3. It can only access sheets you explicitly share
4. It cannot access other Google services

## Next Steps

1. Get your Google API key from the Cloud Console
2. Create and share your Google Sheet
3. Update the constants in `script.js`
4. Deploy to Vercel
5. Test the form submission

That's it! Your waitlist will now work directly with Google Sheets without any server-side code.
