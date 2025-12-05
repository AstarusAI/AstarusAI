-- Quick fix for infinite recursion in space_members RLS policies
-- Run this in your Supabase SQL Editor

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view members of spaces they belong to" ON space_members;

-- Create the fixed policies (non-recursive)
CREATE POLICY "Space creators can view all members"
  ON space_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_members.space_id
      AND spaces.creator_id = auth.uid()
    )
  );

CREATE POLICY "Members can view other members"
  ON space_members FOR SELECT
  USING (
    (user_id = auth.uid() AND status = 'accepted') OR
    (email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND status = 'accepted')
  );

