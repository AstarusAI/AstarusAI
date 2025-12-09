-- Supabase Database Schema for Astarus AI
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create spaces table (must be before chats due to foreign key)
CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lut_name TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('team', 'personal')),
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create space_members table for invitations (must be before chats due to functions)
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

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  title TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  -- Ensure chat is either personal (user_id) or shared (space_id), but not both
  CONSTRAINT chats_ownership_check CHECK (
    (user_id IS NOT NULL AND space_id IS NULL) OR
    (user_id IS NULL AND space_id IS NOT NULL)
  )
);

-- Add space_id column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chats' AND column_name = 'space_id'
  ) THEN
    ALTER TABLE chats ADD COLUMN space_id UUID REFERENCES spaces(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add created_by column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chats' AND column_name = 'created_by'
  ) THEN
    -- First add as nullable
    ALTER TABLE chats ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    -- Update existing rows: set created_by to user_id (existing chats belong to user_id)
    UPDATE chats SET created_by = user_id WHERE created_by IS NULL AND user_id IS NOT NULL;
    -- Now make it NOT NULL
    ALTER TABLE chats ALTER COLUMN created_by SET NOT NULL;
  END IF;
END $$;

-- Make user_id nullable if it's not already (for existing tables)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chats' AND column_name = 'user_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE chats ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Add constraint if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'chats' AND constraint_name = 'chats_ownership_check'
  ) THEN
    ALTER TABLE chats ADD CONSTRAINT chats_ownership_check CHECK (
      (user_id IS NOT NULL AND space_id IS NULL) OR
      (user_id IS NULL AND space_id IS NOT NULL)
    );
  END IF;
END $$;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add user_id column to messages if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

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
CREATE INDEX IF NOT EXISTS idx_chats_space_id ON chats(space_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_key ON user_memory(key);

-- Function to check if user is a member of a space (bypasses RLS to avoid recursion)
-- Must be defined before RLS policies that use it
CREATE OR REPLACE FUNCTION is_space_member(space_uuid UUID, user_uuid UUID, user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM space_members sm
    WHERE sm.space_id = space_uuid
    AND sm.status = 'accepted'
    AND (sm.user_id = user_uuid OR sm.email = user_email)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has pending invitation (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION has_pending_invitation(space_uuid UUID, user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM space_members sm
    WHERE sm.space_id = space_uuid
    AND sm.email = user_email
    AND sm.status = 'pending'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS)
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own chats" ON chats;
DROP POLICY IF EXISTS "Users can create their own chats" ON chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON chats;
DROP POLICY IF EXISTS "Users can delete their own chats" ON chats;

-- Policy 1: Users can view their personal chats
CREATE POLICY "Users can view their personal chats"
  ON chats FOR SELECT
  USING (user_id = auth.uid());

-- Policy 2: Space members can view shared chats in their spaces
CREATE POLICY "Space members can view shared chats"
  ON chats FOR SELECT
  USING (
    space_id IS NOT NULL AND
    is_space_member(
      space_id,
      auth.uid(),
      (auth.jwt()->>'email')
    )
  );

-- Policy 3: Users can create personal chats
CREATE POLICY "Users can create personal chats"
  ON chats FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    space_id IS NULL AND
    created_by = auth.uid()
  );

-- Policy 4: Space members can create shared chats in their spaces
CREATE POLICY "Space members can create shared chats"
  ON chats FOR INSERT
  WITH CHECK (
    space_id IS NOT NULL AND
    user_id IS NULL AND
    created_by = auth.uid() AND
    is_space_member(
      space_id,
      auth.uid(),
      (auth.jwt()->>'email')
    )
  );

-- Policy 5: Users can update their personal chats
CREATE POLICY "Users can update their personal chats"
  ON chats FOR UPDATE
  USING (user_id = auth.uid());

-- Policy 6: Space members can update shared chats in their spaces
CREATE POLICY "Space members can update shared chats"
  ON chats FOR UPDATE
  USING (
    space_id IS NOT NULL AND
    is_space_member(
      space_id,
      auth.uid(),
      (auth.jwt()->>'email')
    )
  );

-- Policy 7: Users can delete their personal chats
CREATE POLICY "Users can delete their personal chats"
  ON chats FOR DELETE
  USING (user_id = auth.uid());

-- Policy 8: Space members can delete shared chats in their spaces
CREATE POLICY "Space members can delete shared chats"
  ON chats FOR DELETE
  USING (
    space_id IS NOT NULL AND
    is_space_member(
      space_id,
      auth.uid(),
      (auth.jwt()->>'email')
    )
  );

-- RLS Policies for messages
-- Drop old policies
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can create messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can update messages in their chats" ON messages;
DROP POLICY IF EXISTS "Users can delete messages in their chats" ON messages;

-- Policy 1: Users can view messages in their personal chats
CREATE POLICY "Users can view messages in personal chats"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- Policy 2: Space members can view messages in shared chats
CREATE POLICY "Space members can view messages in shared chats"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.space_id IS NOT NULL
      AND is_space_member(
        chats.space_id,
        auth.uid(),
        (auth.jwt()->>'email')
      )
    )
  );

-- Policy 3: Users can create messages in their personal chats
CREATE POLICY "Users can create messages in personal chats"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
    AND (messages.user_id = auth.uid() OR messages.role = 'assistant')
  );

-- Policy 4: Space members can create messages in shared chats
CREATE POLICY "Space members can create messages in shared chats"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.space_id IS NOT NULL
      AND is_space_member(
        chats.space_id,
        auth.uid(),
        (auth.jwt()->>'email')
      )
    )
    AND (messages.user_id = auth.uid() OR messages.role = 'assistant')
  );

-- Policy 5: Users can update messages in their personal chats
CREATE POLICY "Users can update messages in personal chats"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- Policy 6: Space members can update messages in shared chats (only their own or if admin)
CREATE POLICY "Space members can update messages in shared chats"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.space_id IS NOT NULL
      AND is_space_member(
        chats.space_id,
        auth.uid(),
        (auth.jwt()->>'email')
      )
    )
    AND (
      messages.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM space_members
        WHERE space_members.space_id = (
          SELECT space_id FROM chats WHERE chats.id = messages.chat_id
        )
        AND space_members.user_id = auth.uid()
        AND space_members.status = 'accepted'
        AND space_members.role IN ('owner', 'admin')
      )
    )
  );

-- Policy 7: Users can delete messages in their personal chats
CREATE POLICY "Users can delete messages in personal chats"
  ON messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- Policy 8: Space members can delete messages in shared chats (only their own or if admin)
CREATE POLICY "Space members can delete messages in shared chats"
  ON messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.space_id IS NOT NULL
      AND is_space_member(
        chats.space_id,
        auth.uid(),
        (auth.jwt()->>'email')
      )
    )
    AND (
      messages.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM space_members
        WHERE space_members.space_id = (
          SELECT space_id FROM chats WHERE chats.id = messages.chat_id
        )
        AND space_members.user_id = auth.uid()
        AND space_members.status = 'accepted'
        AND space_members.role IN ('owner', 'admin')
      )
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
      AND spaces.type = 'team'
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

