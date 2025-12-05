# Supabase Integration Setup Guide

## Overview

The Astarus AI platform now supports:
- ✅ User authentication (sign up/login) via Supabase
- ✅ Chat storage for authenticated users
- ✅ Anonymous usage (users can use the demo without signing up)
- ✅ User memory/data storage

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: Astarus AI (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose closest to your users
4. Wait for the project to be created (takes ~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 3. Set Environment Variables

Create or update your `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success" message

The schema creates:
- `chats` table - stores chat sessions
- `messages` table - stores individual messages
- `user_memory` table - stores user-specific data
- Row Level Security (RLS) policies - ensures users can only access their own data

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the app
3. Try signing up with a new account
4. Use the chat - your messages should be saved automatically
5. Log out and log back in - your chats should persist

## Features

### For Authenticated Users
- All chats are automatically saved
- Messages are stored in the database
- Chats persist across sessions
- User-specific memory can be stored

### For Anonymous Users
- Can use the demo without signing up
- Chats are not saved (session-only)
- Can sign up anytime to start saving chats

## Database Schema

### chats
- `id` - UUID primary key
- `user_id` - References auth.users
- `title` - Chat title (auto-generated from first message)
- `created_at` - Timestamp
- `updated_at` - Timestamp (auto-updated)

### messages
- `id` - UUID primary key
- `chat_id` - References chats table
- `role` - 'user' or 'assistant'
- `content` - Message text
- `created_at` - Timestamp

### user_memory
- `id` - UUID primary key
- `user_id` - References auth.users
- `key` - Memory key (unique per user)
- `value` - Memory value (JSON string)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Security

All tables have Row Level Security (RLS) enabled:
- Users can only see their own chats
- Users can only see messages in their own chats
- Users can only access their own memory data

## Troubleshooting

### "Failed to create chat" error
- Check that you've run the SQL schema
- Verify your Supabase credentials are correct
- Check browser console for detailed error messages

### Authentication not working
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check that Supabase project is active
- Ensure email confirmation is disabled in Supabase Auth settings (for testing)

### Messages not saving
- Check browser console for errors
- Verify user is authenticated (check if "Get Started" button shows user info)
- Ensure RLS policies are correctly set up

## Next Steps

To load previous chats for users, you can:
1. Update the Spaces page to fetch and display user chats
2. Add a chat history sidebar
3. Implement chat search/filtering

See `src/lib/chatService.ts` for available functions to fetch chats and messages.

