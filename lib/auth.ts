import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'member';
  department?: string;
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile from our users table
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      return { user: data.user, profile };
    }

    return { user: data.user, profile: null };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string, fullName: string, role: 'admin' | 'manager' | 'member' = 'member') {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          },
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (!user) return null;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}