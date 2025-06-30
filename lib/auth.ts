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
    console.log('Attempting to sign in with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    console.log('Auth successful, fetching user profile...');

    // Get user profile from our users table
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        
        // If user doesn't exist in our users table, create them
        if (profileError.code === 'PGRST116') {
          console.log('User not found in users table, creating profile...');
          
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email!,
                full_name: data.user.email!.split('@')[0], // Use email prefix as name
                role: 'member',
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error('Error creating user profile:', createError);
            throw createError;
          }

          return { user: data.user, profile: newProfile };
        }
        
        throw profileError;
      }

      console.log('User profile fetched successfully:', profile);
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
    console.log('Attempting to sign up with:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }

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
    
    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
    
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    console.log('Authenticated user found, fetching profile...');

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      
      // If user doesn't exist in our users table, create them
      if (profileError.code === 'PGRST116') {
        console.log('User not found in users table, creating profile...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email!,
              full_name: user.email!.split('@')[0],
              role: 'member',
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return null;
        }

        return newProfile;
      }
      
      return null;
    }

    console.log('User profile fetched successfully:', profile);
    return profile;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}