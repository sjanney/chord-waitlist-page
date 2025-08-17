# Google Sheets API Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: "Chord Waitlist"
   - Description: "Service account for waitlist submissions"
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Download the JSON file
6. **Rename it to `service-account-key.json`** and place it in your project root

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

## Step 5: Share the Sheet with Service Account

1. In your Google Sheet, click "Share"
2. Add your service account email (found in the JSON file under `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

## Step 6: Configure Environment Variables

1. Copy `env.example` to `.env`
2. Replace `your-spreadsheet-id-here` with your actual Spreadsheet ID

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Run the Server

```bash
npm start
```

Your waitlist page will be available at `http://localhost:3000`

## File Structure

```
chord-waitlist-page/
├── index.html
├── styles.css
├── script.js
├── server.js
├── package.json
├── service-account-key.json  # Add this file
├── .env                      # Add this file
├── assets/
│   └── background.jpg
└── SETUP.md
```

## Security Notes

- **Never commit** `service-account-key.json` or `.env` to version control
- Add them to `.gitignore`
- The service account has minimal permissions (only to your specific sheet)

## Testing

1. Open `http://localhost:3000`
2. Enter a name and email
3. Press Enter
4. Check your Google Sheet - you should see a new row with timestamp, name, and email

## Deployment

For production deployment:
1. Use a hosting service like Heroku, Railway, or Vercel
2. Set environment variables in your hosting platform
3. Upload the service account key file
4. Deploy your code

## Troubleshooting

- **"Invalid credentials"**: Check that your service account key is correct
- **"Permission denied"**: Make sure you shared the sheet with the service account email
- **"Spreadsheet not found"**: Verify your Spreadsheet ID is correct
