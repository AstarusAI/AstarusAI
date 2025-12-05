import { supabase } from './supabase';

export interface Space {
  id: string;
  creator_id: string;
  lut_name: string;
  name: string;
  type: 'company' | 'personal';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SpaceMember {
  id: string;
  space_id: string;
  user_id: string | null;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'pending' | 'accepted' | 'declined';
  invited_by: string;
  invited_at: string;
  accepted_at: string | null;
}

/**
 * Get all spaces for the current user (created by them or they're a member)
 */
export async function getUserSpaces(userId: string, userEmail: string): Promise<Space[]> {
  // Get spaces created by user
  const { data: createdSpaces, error: createdError } = await supabase
    .from('spaces')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (createdError) {
    throw new Error(`Failed to fetch created spaces: ${createdError.message}`);
  }

  // Get space IDs where user is a member
  const { data: memberData, error: memberError } = await supabase
    .from('space_members')
    .select('space_id')
    .or(`user_id.eq.${userId},email.eq.${userEmail}`)
    .eq('status', 'accepted');

  if (memberError) {
    throw new Error(`Failed to fetch member spaces: ${memberError.message}`);
  }

  // Get unique space IDs
  const memberSpaceIds = [...new Set((memberData || []).map(m => m.space_id))];

  // Get spaces where user is a member
  let memberSpaces: Space[] = [];
  if (memberSpaceIds.length > 0) {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .in('id', memberSpaceIds)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch member spaces: ${error.message}`);
    }
    memberSpaces = data || [];
  }

  // Combine and deduplicate
  const allSpaces: Space[] = [...(createdSpaces || [])];
  const createdSpaceIds = new Set(allSpaces.map(s => s.id));

  for (const space of memberSpaces) {
    if (!createdSpaceIds.has(space.id)) {
      allSpaces.push(space);
      createdSpaceIds.add(space.id);
    }
  }

  // Sort by created_at
  return allSpaces.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Create a new space
 */
export async function createSpace(
  creatorId: string,
  name: string,
  type: 'company' | 'personal',
  description?: string
): Promise<Space> {
  // Generate unique lut_name
  const lutName = `space-${crypto.randomUUID().slice(0, 8)}`;

  const { data, error } = await supabase
    .from('spaces')
    .insert({
      creator_id: creatorId,
      lut_name: lutName,
      name,
      type,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create space: ${error.message}`);
  }

  // Add creator as owner member
  await supabase
    .from('space_members')
    .insert({
      space_id: data.id,
      user_id: creatorId,
      email: '', // Will be filled from user
      role: 'owner',
      status: 'accepted',
      invited_by: creatorId,
      accepted_at: new Date().toISOString(),
    });

  return data;
}

/**
 * Get space by ID
 */
export async function getSpace(spaceId: string): Promise<Space | null> {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('id', spaceId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch space: ${error.message}`);
  }

  return data;
}

/**
 * Get space by lut_name
 */
export async function getSpaceByLutName(lutName: string): Promise<Space | null> {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('lut_name', lutName)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch space: ${error.message}`);
  }

  return data;
}

/**
 * Update space
 */
export async function updateSpace(
  spaceId: string,
  updates: Partial<Pick<Space, 'name' | 'description' | 'type'>>
): Promise<void> {
  const { error } = await supabase
    .from('spaces')
    .update(updates)
    .eq('id', spaceId);

  if (error) {
    throw new Error(`Failed to update space: ${error.message}`);
  }
}

/**
 * Delete space
 */
export async function deleteSpace(spaceId: string): Promise<void> {
  const { error } = await supabase
    .from('spaces')
    .delete()
    .eq('id', spaceId);

  if (error) {
    throw new Error(`Failed to delete space: ${error.message}`);
  }
}

/**
 * Invite user to space by email
 */
export async function inviteToSpace(
  spaceId: string,
  email: string,
  invitedBy: string
): Promise<SpaceMember> {
  // Try to find if user exists by checking if they have any spaces or chats
  // We'll set user_id to null initially, and update it when they accept
  const { data, error } = await supabase
    .from('space_members')
    .insert({
      space_id: spaceId,
      user_id: null, // Will be set when user accepts invitation
      email: email.toLowerCase().trim(),
      role: 'member',
      status: 'pending',
      invited_by: invitedBy,
    })
    .select()
    .single();

  if (error) {
    // If duplicate, return existing member
    if (error.code === '23505') {
      const { data: existing } = await supabase
        .from('space_members')
        .select('*')
        .eq('space_id', spaceId)
        .eq('email', email.toLowerCase().trim())
        .single();
      
      if (existing) {
        return existing as SpaceMember;
      }
    }
    throw new Error(`Failed to invite user: ${error.message}`);
  }

  return data as SpaceMember;
}

/**
 * Get members of a space
 */
export async function getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
  const { data, error } = await supabase
    .from('space_members')
    .select('*')
    .eq('space_id', spaceId)
    .order('invited_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  return data || [];
}

/**
 * Accept invitation (called when user signs up/logs in and has pending invitations)
 */
export async function acceptInvitation(spaceId: string, userId: string, userEmail: string): Promise<void> {
  const { error } = await supabase
    .from('space_members')
    .update({
      status: 'accepted',
      user_id: userId,
      accepted_at: new Date().toISOString(),
    })
    .eq('space_id', spaceId)
    .eq('email', userEmail.toLowerCase().trim())
    .eq('status', 'pending');

  if (error) {
    throw new Error(`Failed to accept invitation: ${error.message}`);
  }
}

/**
 * Get pending invitations for a user by email
 */
export async function getPendingInvitations(userEmail: string): Promise<SpaceMember[]> {
  try {
    const { data, error } = await supabase
      .from('space_members')
      .select('*')
      .eq('email', userEmail.toLowerCase().trim())
      .eq('status', 'pending')
      .order('invited_at', { ascending: false })
      .limit(10); // Add limit to prevent large queries

    if (error) {
      // If table doesn't exist, RLS issue, or infinite recursion, return empty array
      if (error.code === '42P01' || error.code === 'PGRST301' || error.message?.includes('infinite recursion')) {
        console.warn('Space members table may not exist or has policy issues:', error.message);
        return [];
      }
      // For any other error, also return empty array to prevent blocking
      console.warn('Error fetching invitations (non-blocking):', error.message);
      return [];
    }

    return data || [];
  } catch (err: any) {
    // Catch any errors and return empty array to prevent blocking
    // Don't log as error since this is expected if tables don't exist
    if (err.message?.includes('infinite recursion')) {
      console.warn('RLS policy recursion detected - please update database policies');
    }
    return [];
  }
}

/**
 * Remove member from space
 */
export async function removeMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('space_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    throw new Error(`Failed to remove member: ${error.message}`);
  }
}

