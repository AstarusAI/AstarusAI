# Spaces Database Integration

## Overview

Spaces are now fully connected to Supabase database with invitation functionality. Users can create spaces, invite others by email, and manage members.

## Database Schema Updates

The `supabase-schema.sql` file has been updated with two new tables:

### 1. `spaces` table
- Stores space information (name, type, description, LUT name)
- Links to creator (user who created it)
- Has unique `lut_name` identifier

### 2. `space_members` table
- Stores invitations and memberships
- Tracks invitation status (pending, accepted, declined)
- Links users to spaces by email (works even if user hasn't signed up yet)
- Supports roles: owner, admin, member

## Setup Instructions

### 1. Run Updated SQL Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Open `supabase-schema.sql`
4. **IMPORTANT**: Only run the new sections (spaces and space_members tables)
   - Or run the entire file if you haven't set up the database yet
5. The schema includes:
   - Tables for spaces and space_members
   - Row Level Security (RLS) policies
   - Indexes for performance
   - Triggers for auto-updating timestamps

### 2. Features Implemented

✅ **Space Creation**
- Users can create personal or company spaces
- Each space gets a unique `lut_name` identifier
- Spaces are saved to database and persist

✅ **Space Listing**
- Users see spaces they created
- Users see spaces they're members of
- Spaces are sorted by creation date

✅ **Invitations**
- Space creators can invite users by email
- Invitations work even if user hasn't signed up yet
- When invited user signs up, invitations are auto-accepted
- Invitation status: pending → accepted/declined

✅ **Member Management**
- View all members of a space
- See invitation status
- Remove members (creators only)
- Invite new members

✅ **Space Deletion**
- Creators can delete their spaces
- All related data is cascaded (members, etc.)

## How It Works

### Creating a Space
1. User clicks "Create New Space"
2. Fills in name, type, and optional description
3. Space is created in database with unique `lut_name`
4. Creator is automatically added as "owner" member

### Inviting Users
1. Space creator clicks "Members" button
2. Enters email address
3. Invitation is created with status "pending"
4. User receives invitation (can be notified via email in future)
5. When user signs up with that email, invitation auto-accepts

### Accessing Spaces
- Users can access spaces they created
- Users can access spaces where they're accepted members
- Each space has its own chat interface at `/spaces/{lut_name}`

## API Functions

All space operations are in `src/lib/spaceService.ts`:

- `getUserSpaces()` - Get all spaces for a user
- `createSpace()` - Create a new space
- `getSpace()` - Get space by ID
- `getSpaceByLutName()` - Get space by LUT name
- `updateSpace()` - Update space details
- `deleteSpace()` - Delete a space
- `inviteToSpace()` - Invite user by email
- `getSpaceMembers()` - Get all members of a space
- `acceptInvitation()` - Accept pending invitation
- `removeMember()` - Remove member from space
- `getPendingInvitations()` - Get pending invitations for a user

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only see spaces they created or are members of
- Only space creators can invite/remove members
- Only space creators can update/delete spaces
- Invitations are tied to email addresses

## Next Steps (Optional Enhancements)

1. **Email Notifications**: Send actual emails when users are invited
2. **Invitation Links**: Generate shareable links for spaces
3. **Role Management**: Allow admins to manage members
4. **Space Settings**: Add more configuration options
5. **Activity Log**: Track space activity and changes

## Testing

After running the SQL schema:

1. Sign up/Login to your account
2. Create a new space
3. Click "Members" on the space card
4. Invite a user by email
5. Check that the invitation appears in the members list
6. The space should persist after page refresh

