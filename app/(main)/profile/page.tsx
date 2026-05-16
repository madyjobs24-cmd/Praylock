'use client';

import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useUserContext, ReminderFrequency } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { classNames } from '@/lib/utils';
import { useRouter } from 'next/navigation';

function IconUser() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function ProfilePage() {
  const { user, supabaseUser, updatePreferences, signOut } = useUserContext();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReminderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ reminderFrequency: e.target.value as ReminderFrequency });
  };

  if (!supabaseUser) {
    return (
      <div className={classNames(styles.container, mounted && styles.mounted)}>
        <h1 className={styles.userName} style={{ marginBottom: '24px' }}>Compte PrayLock</h1>
        <Card style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Connectez-vous pour synchroniser vos données.
          </p>
          <Button onClick={() => router.push('/auth/login')}>
            Se connecter
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={classNames(styles.container, mounted && styles.mounted)}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {user.name ? user.name.charAt(0).toUpperCase() : <IconUser />}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user.name || 'Utilisateur'}</div>
          <div className={styles.userCity}>📍 {user.city || 'Ville non définie'}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Préférences</div>
        <Card style={{ padding: '0 20px' }}>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Notifications Push</span>
            <Toggle checked={user.preferences.notifications} onChange={(e) => updatePreferences({ notifications: e.target.checked })} />
          </div>
          
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Rappel de mise à jour</span>
            <select 
              className={styles.select} 
              value={user.preferences.reminderFrequency}
              onChange={handleReminderChange}
            >
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
              <option value="manuel">Manuel</option>
            </select>
          </div>

          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Alarme Fajr</span>
            <Toggle checked={user.preferences.sound} onChange={(e) => updatePreferences({ sound: e.target.checked })} />
          </div>
        </Card>
      </div>

      <div className={styles.section} style={{ marginTop: '16px' }}>
        <div className={styles.sectionTitle}>Compte</div>
        <Card style={{ padding: '0 20px' }}>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Email</span>
            <span className={styles.settingValue}>{supabaseUser.email}</span>
          </div>
        </Card>
      </div>

      <button 
        className={styles.signOutButton} 
        onClick={signOut}
        style={{
          width: '100%',
          marginTop: '24px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 69, 58, 0.1)',
          border: '1px solid rgba(255, 69, 58, 0.2)',
          color: '#FF453A',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}
