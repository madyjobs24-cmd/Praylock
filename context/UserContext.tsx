'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type ReminderFrequency = 'weekly' | 'monthly' | 'manual';

export interface UserPreferences {
  reminderFrequency: ReminderFrequency;
  notifications: boolean;
  sound: boolean;
}

export interface UserState {
  id: string | null;
  name: string;
  city: string;
  streakCount: number;
  bestStreak: number;
  preferences: UserPreferences;
  lastUpdatedTimes: string | null;
  onboardingCompleted: boolean;
  blockedApps: string[];
}

interface UserContextType {
  user: UserState;
  supabaseUser: SupabaseUser | null;
  updateUser: (updates: Partial<UserState>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultUser: UserState = {
  id: null,
  name: 'Ahmed',
  city: 'Paris',
  streakCount: 14,
  bestStreak: 14,
  preferences: {
    reminderFrequency: 'monthly',
    notifications: true,
    sound: true,
  },
  lastUpdatedTimes: null,
  onboardingCompleted: false,
  blockedApps: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultUser);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        loadFromLocalStorage();
      }
      setIsLoaded(true);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(defaultUser);
        localStorage.removeItem('praylock_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('praylock_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse user data from localStorage');
      }
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setUser({
        id: data.id,
        name: data.name || 'Ahmed',
        city: data.city || 'Paris',
        streakCount: data.streak_count || 0,
        bestStreak: data.best_streak || 0,
        preferences: {
          reminderFrequency: data.reminder_frequency as ReminderFrequency || 'monthly',
          notifications: true, // Local preference
          sound: true, // Local preference
        },
        lastUpdatedTimes: data.prayer_schedule_updated_at,
        onboardingCompleted: data.onboarding_completed || false,
        blockedApps: data.blocked_apps || [],
      });
    } else {
      // Create profile if not exists
      const newProfile = {
        id: userId,
        name: user.name,
        city: user.city,
        streak_count: user.streakCount,
        best_streak: user.bestStreak,
        reminder_frequency: user.preferences.reminderFrequency,
        onboarding_completed: false,
        blocked_apps: [],
      };
      await supabase.from('users').insert(newProfile);
      setUser(prev => ({ ...prev, id: userId }));
    }
  };

  // Sync with LocalStorage as fallback
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('praylock_user', JSON.stringify(user));
    }
  }, [user, isLoaded]);

  const updateUser = async (updates: Partial<UserState>) => {
    const newUser = { ...user, ...updates };
    setUser(newUser);

    if (supabaseUser) {
      const { error } = await supabase.from('users').update({
        name: newUser.name,
        city: newUser.city,
        streak_count: newUser.streakCount,
        best_streak: newUser.bestStreak,
        prayer_schedule_updated_at: newUser.lastUpdatedTimes,
        onboarding_completed: newUser.onboardingCompleted,
        blocked_apps: newUser.blockedApps,
      }).eq('id', supabaseUser.id);
      
      if (error) {
        console.error('Error updating user in Supabase:', error);
      }
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const newPrefs = { ...user.preferences, ...updates };
    setUser(prev => ({ ...prev, preferences: newPrefs }));

    if (supabaseUser && updates.reminderFrequency) {
      await supabase.from('users').update({
        reminder_frequency: updates.reminderFrequency
      }).eq('id', supabaseUser.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <UserContext.Provider value={{ user, supabaseUser, updateUser, updatePreferences, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

