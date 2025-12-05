import { supabase } from './supabase';
import type { Message } from '@/pages/Chat';

export interface Chat {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

/**
 * Create a new chat for the authenticated user
 */
export async function createChat(userId: string, title?: string): Promise<string> {
  const { data, error } = await supabase
    .from('chats')
    .insert({
      user_id: userId,
      title: title || 'New Chat',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create chat: ${error.message}`);
  }

  return data.id;
}

/**
 * Save a message to the database
 */
export async function saveMessage(
  chatId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      role,
      content,
    });

  if (error) {
    console.error('Failed to save message:', error);
    // Don't throw - allow chat to continue even if save fails
  }
}

/**
 * Update chat title
 */
export async function updateChatTitle(chatId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('chats')
    .update({ title })
    .eq('id', chatId);

  if (error) {
    console.error('Failed to update chat title:', error);
  }
}

/**
 * Get all chats for a user
 */
export async function getUserChats(userId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch chats: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all messages for a chat
 */
export async function getChatMessages(chatId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete a chat and all its messages
 */
export async function deleteChat(chatId: string): Promise<void> {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);

  if (error) {
    throw new Error(`Failed to delete chat: ${error.message}`);
  }
}

/**
 * Save user memory/data
 */
export async function saveUserMemory(userId: string, key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('user_memory')
    .upsert({
      user_id: userId,
      key,
      value,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,key',
    });

  if (error) {
    console.error('Failed to save user memory:', error);
  }
}

/**
 * Get user memory/data
 */
export async function getUserMemory(userId: string, key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_memory')
    .select('value')
    .eq('user_id', userId)
    .eq('key', key)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No row found
      return null;
    }
    console.error('Failed to get user memory:', error);
    return null;
  }

  return data?.value || null;
}

