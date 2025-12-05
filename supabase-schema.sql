-- Supabase Database Schema for Astarus AI
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_memory table for storing user-specific memory/data
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, key)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_key ON user_memory(key);

-- Enable Row Level Security (RLS)
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
DROP POLICY IF EXISTS "Users can view their own chats" ON chats;
CREATE POLICY "Users can view their own chats"
  ON chats FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own chats" ON chats;
CREATE POLICY "Users can create their own chats"
  ON chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own chats" ON chats;
CREATE POLICY "Users can update their own chats"
  ON chats FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own chats" ON chats;
CREATE POLICY "Users can delete their own chats"
  ON chats FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for messages
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
CREATE POLICY "Users can view messages in their chats"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create messages in their chats" ON messages;
CREATE POLICY "Users can create messages in their chats"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update messages in their chats" ON messages;
CREATE POLICY "Users can update messages in their chats"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete messages in their chats" ON messages;
CREATE POLICY "Users can delete messages in their chats"
  ON messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- RLS Policies for user_memory
DROP POLICY IF EXISTS "Users can view their own memory" ON user_memory;
CREATE POLICY "Users can view their own memory"
  ON user_memory FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own memory" ON user_memory;
CREATE POLICY "Users can create their own memory"
  ON user_memory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own memory" ON user_memory;
CREATE POLICY "Users can update their own memory"
  ON user_memory FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own memory" ON user_memory;
CREATE POLICY "Users can delete their own memory"
  ON user_memory FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is a member of a space (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION is_space_member(space_uuid UUID, user_uuid UUID, user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM space_members
    WHERE space_id = space_uuid
    AND status = 'accepted'
    AND (user_id = user_uuid OR email = user_email)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has pending invitation (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION has_pending_invitation(space_uuid UUID, user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM space_members
    WHERE space_id = space_uuid
    AND email = user_email
    AND status = 'pending'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_memory_updated_at ON user_memory;
CREATE TRIGGER update_user_memory_updated_at
  BEFORE UPDATE ON user_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lut_name TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('company', 'personal')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create space_members table for invitations
CREATE TABLE IF NOT EXISTS space_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(space_id, email)
);

-- Create indexes for spaces
CREATE INDEX IF NOT EXISTS idx_spaces_creator_id ON spaces(creator_id);
CREATE INDEX IF NOT EXISTS idx_spaces_lut_name ON spaces(lut_name);
CREATE INDEX IF NOT EXISTS idx_spaces_created_at ON spaces(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_space_members_space_id ON space_members(space_id);
CREATE INDEX IF NOT EXISTS idx_space_members_user_id ON space_members(user_id);
CREATE INDEX IF NOT EXISTS idx_space_members_email ON space_members(email);
CREATE INDEX IF NOT EXISTS idx_space_members_status ON space_members(status);

-- Enable Row Level Security for spaces
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for spaces
-- Split into two separate policies to avoid recursion
DROP POLICY IF EXISTS "Users can view spaces they created or are members of" ON spaces;
DROP POLICY IF EXISTS "Users can view spaces they created" ON spaces;
DROP POLICY IF EXISTS "Users can view spaces they are members of" ON spaces;

-- Policy 1: Users can view spaces they created (no recursion)
CREATE POLICY "Users can view spaces they created"
  ON spaces FOR SELECT
  USING (creator_id = auth.uid());

-- Policy 2: Users can view spaces where they are accepted members (use function to bypass RLS recursion)
CREATE POLICY "Users can view spaces they are members of"
  ON spaces FOR SELECT
  USING (
    is_space_member(
      spaces.id,
      auth.uid(),
      (auth.jwt()->>'email')
    )
  );

-- Policy 3: Users can view spaces where they have pending invitations (use function to avoid recursion)
DROP POLICY IF EXISTS "Users can view spaces with pending invitations" ON spaces;
CREATE POLICY "Users can view spaces with pending invitations"
  ON spaces FOR SELECT
  USING (
    has_pending_invitation(
      spaces.id,
      (auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Users can create spaces" ON spaces;
CREATE POLICY "Users can create spaces"
  ON spaces FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Space creators can update their spaces" ON spaces;
CREATE POLICY "Space creators can update their spaces"
  ON spaces FOR UPDATE
  USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Space creators can delete their spaces" ON spaces;
CREATE POLICY "Space creators can delete their spaces"
  ON spaces FOR DELETE
  USING (creator_id = auth.uid());

-- RLS Policies for space_members
-- Drop the old problematic policy if it exists
DROP POLICY IF EXISTS "Users can view members of spaces they belong to" ON space_members;

-- Allow space creators to view all members
DROP POLICY IF EXISTS "Space creators can view all members" ON space_members;
CREATE POLICY "Space creators can view all members"
  ON space_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_members.space_id
      AND spaces.creator_id = auth.uid()
    )
  );

-- Allow users to view members if they are members themselves (check directly, no recursion)
DROP POLICY IF EXISTS "Members can view other members" ON space_members;
CREATE POLICY "Members can view other members"
  ON space_members FOR SELECT
  USING (
    (user_id = auth.uid() AND status = 'accepted') OR
    (LOWER(email) = LOWER(auth.jwt()->>'email') AND status = 'accepted')
  );

-- Allow users to view their own pending invitations
DROP POLICY IF EXISTS "Users can view their pending invitations" ON space_members;
CREATE POLICY "Users can view their pending invitations"
  ON space_members FOR SELECT
  USING (
    LOWER(email) = LOWER(auth.jwt()->>'email') AND status = 'pending'
  );

DROP POLICY IF EXISTS "Space creators can invite members" ON space_members;
CREATE POLICY "Space creators can invite members"
  ON space_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_members.space_id
      AND spaces.creator_id = auth.uid()
    )
    AND invited_by = auth.uid()
  );

DROP POLICY IF EXISTS "Space creators can update member status" ON space_members;
CREATE POLICY "Space creators can update member status"
  ON space_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_members.space_id
      AND spaces.creator_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can accept invitations" ON space_members;
DROP POLICY IF EXISTS "Users can accept or decline invitations" ON space_members;
CREATE POLICY "Users can accept or decline invitations"
  ON space_members FOR UPDATE
  USING (
    LOWER(TRIM(email)) = LOWER(TRIM(auth.jwt()->>'email'))
    AND status = 'pending'
  )
  WITH CHECK (
    LOWER(TRIM(email)) = LOWER(TRIM(auth.jwt()->>'email'))
    AND (status = 'accepted' OR status = 'declined')
  );

DROP POLICY IF EXISTS "Space creators can remove members" ON space_members;
CREATE POLICY "Space creators can remove members"
  ON space_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_members.space_id
      AND spaces.creator_id = auth.uid()
    )
  );

-- Allow users to delete their own pending invitations (decline)
DROP POLICY IF EXISTS "Users can delete their pending invitations" ON space_members;
CREATE POLICY "Users can delete their pending invitations"
  ON space_members FOR DELETE
  USING (
    LOWER(TRIM(email)) = LOWER(TRIM(auth.jwt()->>'email'))
    AND status = 'pending'
  );

-- Trigger to automatically update updated_at for spaces
DROP TRIGGER IF EXISTS update_spaces_updated_at ON spaces;
CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

