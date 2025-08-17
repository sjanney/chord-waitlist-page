# 🚀 Supabase Setup Guide

This guide will help you set up Supabase as your database backend for the waitlist page.

## 📋 What is Supabase?

Supabase is an open-source alternative to Firebase that provides:
- **PostgreSQL Database** - Powerful, reliable database
- **Real-time APIs** - Built-in real-time subscriptions
- **Authentication** - User management and auth
- **Storage** - File storage and management
- **Dashboard** - Beautiful admin interface
- **Free Tier** - Generous free plan

## 🎯 Why Supabase over Google Sheets?

- ✅ **Better Performance** - Faster queries and responses
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **Better Security** - Row-level security and API keys
- ✅ **Scalability** - Handles high traffic better
- ✅ **Analytics** - Built-in dashboard and insights
- ✅ **API Flexibility** - REST and GraphQL APIs

## 🛠️ Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Create a new organization (if needed)

## 🏗️ Step 2: Create New Project

1. Click "New Project"
2. Choose your organization
3. Enter project details:
   - **Name**: `chord-waitlist` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for setup to complete (2-3 minutes)

## 📊 Step 3: Create Database Table

1. Go to **Table Editor** in your Supabase dashboard
2. Click **"New table"**
3. Configure the table:

```sql
Table name: waitlist_entries
Columns:
- id (uuid, primary key, default: gen_random_uuid())
- name (text, not null)
- email (text, not null, unique)
- created_at (timestamp with time zone, default: now())
- ip_address (text)
- user_agent (text)
```

4. Click **"Save"**

## 🔑 Step 4: Get API Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## ⚙️ Step 5: Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Legacy Google Sheets (can be removed)
GOOGLE_API_KEY=your_google_api_key_here
SPREADSHEET_ID=your_spreadsheet_id_here
```

## 🧪 Step 6: Test the Setup

1. Start your local server:
   ```bash
   npm start
   ```

2. Check the server logs - you should see:
   ```
   🔑 Environment variables:
      - SUPABASE_URL: Set
      - SUPABASE_ANON_KEY: Set
   ```

3. Test the form submission:
   - Go to `http://localhost:3000`
   - Fill out the form
   - Submit and check the server logs
   - Check your Supabase dashboard → Table Editor → waitlist_entries

## 🔒 Step 7: Security Configuration (Optional)

### Row Level Security (RLS)

1. Go to **Authentication** → **Policies** in Supabase
2. Enable RLS on the `waitlist_entries` table
3. Create policies to control access:

```sql
-- Allow anyone to insert (for waitlist signups)
CREATE POLICY "Allow public inserts" ON waitlist_entries
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON waitlist_entries
FOR SELECT USING (auth.role() = 'authenticated');
```

## 📱 Step 8: Deploy to Vercel

1. Add your environment variables to Vercel:
   - Go to your Vercel project settings
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Redeploy your project

2. Test the live site:
   - Submit a test entry
   - Check your Supabase dashboard

## 🎉 Step 9: Monitor and Manage

### View Entries
- Go to **Table Editor** → **waitlist_entries**
- See all submissions in real-time
- Export data as CSV/JSON

### Analytics
- Go to **Analytics** → **Dashboard**
- View submission trends
- Monitor performance

### API Usage
- Go to **Settings** → **API**
- Monitor API calls and usage
- Check rate limits

## 🔧 Troubleshooting

### Common Issues:

1. **"Database not configured" error**
   - Check your `.env` file has correct Supabase credentials
   - Restart your server after adding environment variables

2. **"Failed to submit to database" error**
   - Check Supabase dashboard for table structure
   - Verify RLS policies allow inserts
   - Check browser console for detailed errors

3. **CORS errors**
   - Supabase handles CORS automatically
   - If issues persist, check your server configuration

### Getting Help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🚀 Next Steps

Once Supabase is working, you can:

1. **Add Authentication** - User login/signup
2. **Real-time Updates** - Live dashboard updates
3. **Email Notifications** - Auto-send welcome emails
4. **Admin Dashboard** - Manage waitlist entries
5. **Analytics** - Track conversion rates
6. **Export Data** - Download waitlist as CSV

---

**🎯 You're all set!** Your waitlist now uses a powerful PostgreSQL database instead of Google Sheets.
