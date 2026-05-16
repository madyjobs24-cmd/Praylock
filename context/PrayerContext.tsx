'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserContext } from './UserContext';

export type PrayerStatus = 'upcoming' | 'active' | 'late' | 'missed' | 'completed';

export interface Prayer {
  name: string;
  time: string;
  status: PrayerStatus;
}

export type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

interface PrayerContextType {
  prayers: Prayer[];
  times: PrayerTimes;
  updateTimes: (newTimes: PrayerTimes) => Promise<void>;
  markCompleted: (name: string) => Promise<void>;
}

const defaultTimes: PrayerTimes = {
  Fajr: '05:30',
  Dhuhr: '13:45',
  Asr: '17:15',
  Maghrib: '20:10',
  Isha: '21:40',
};

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

function calculateStatus(timeStr: string, isCompleted: boolean): PrayerStatus {
  if (isCompleted) return 'completed';

  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const prayerTime = new Date(now);
  prayerTime.setHours(hours, minutes, 0, 0);

  const diffMs = now.getTime() - prayerTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) return 'upcoming';
  if (diffMins >= 0 && diffMins <= 30) return 'active';
  if (diffMins > 30 && diffMins <= 90) return 'late';
  return 'missed';
}

export function PrayerProvider({ children }: { children: ReactNode }) {
  const { user, supabaseUser } = useUserContext();
  const [times, setTimes] = useState<PrayerTimes>(defaultTimes);
  const [completions, setCompletions] = useState<string[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Supabase or localStorage
  useEffect(() => {
    const fetchData = async () => {
      // 1. Load from localStorage first (offline-first)
      const storedTimes = localStorage.getItem('praylock_times');
      if (storedTimes) setTimes(JSON.parse(storedTimes));

      const today = getTodayISO();
      const storedCompletions = localStorage.getItem(`praylock_completions_${today}`);
      if (storedCompletions) setCompletions(JSON.parse(storedCompletions));

      // 2. Sync from Supabase if logged in
      if (supabaseUser) {
        const { data, error } = await supabase
          .from('prayers')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .eq('date', today)
          .single();

        if (data) {
          const remoteCompletions: string[] = [];
          if (data.fajr_completed) remoteCompletions.push('Fajr');
          if (data.dhuhr_completed) remoteCompletions.push('Dhuhr');
          if (data.asr_completed) remoteCompletions.push('Asr');
          if (data.maghrib_completed) remoteCompletions.push('Maghrib');
          if (data.isha_completed) remoteCompletions.push('Isha');
          
          setCompletions(remoteCompletions);
          localStorage.setItem(`praylock_completions_${today}`, JSON.stringify(remoteCompletions));
        }
      }
      setIsLoaded(true);
    };

    fetchData();
  }, [supabaseUser]);

  const computePrayers = useCallback(() => {
    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    const updatedPrayers: Prayer[] = prayerNames.map((name) => {
      const time = times[name];
      const isCompleted = completions.includes(name);
      return {
        name,
        time,
        status: calculateStatus(time, isCompleted),
      };
    });
    setPrayers(updatedPrayers);
  }, [times, completions]);

  useEffect(() => {
    if (!isLoaded) return;
    computePrayers();
    const interval = setInterval(computePrayers, 60000);
    return () => clearInterval(interval);
  }, [isLoaded, computePrayers]);

  const updateTimes = async (newTimes: PrayerTimes) => {
    setTimes(newTimes);
    localStorage.setItem('praylock_times', JSON.stringify(newTimes));
    
    if (supabaseUser) {
      const today = getTodayISO();
      await supabase.from('prayers').upsert({
        user_id: supabaseUser.id,
        date: today,
        fajr_scheduled: newTimes.Fajr,
        dhuhr_scheduled: newTimes.Dhuhr,
        asr_scheduled: newTimes.Asr,
        maghrib_scheduled: newTimes.Maghrib,
        isha_scheduled: newTimes.Isha,
      });
    }
  };

  const markCompleted = async (name: string) => {
    const newCompletions = Array.from(new Set([...completions, name]));
    setCompletions(newCompletions);
    localStorage.setItem(`praylock_completions_${getTodayISO()}`, JSON.stringify(newCompletions));

    if (supabaseUser) {
      const today = getTodayISO();
      const column = `${name.toLowerCase()}_completed`;
      const timeColumn = `${name.toLowerCase()}_completed_at`;
      
      await supabase.from('prayers').upsert({
        user_id: supabaseUser.id,
        date: today,
        [column]: true,
        [timeColumn]: new Date().toISOString(),
      }, { onConflict: 'user_id,date' });
    }
  };

  return (
    <PrayerContext.Provider value={{ prayers, times, updateTimes, markCompleted }}>
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayerContext() {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayerContext must be used within a PrayerProvider');
  }
  return context;
}

