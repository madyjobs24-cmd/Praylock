'use client';

import React, { useState, useEffect } from 'react';
import styles from './PrayerConfig.module.css';
import { Card } from '@/components/ui/Card';
import { usePrayerContext } from '@/context/PrayerContext';
import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const PRAYER_META: Record<string, { arabic: string }> = {
  Fajr:    { arabic: 'الفجر' },
  Dhuhr:   { arabic: 'الظهر' },
  Asr:     { arabic: 'العصر' },
  Maghrib: { arabic: 'المغرب' },
  Isha:    { arabic: 'العشاء' },
};

function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l-6 6 6 6"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l4 4 8-8"/>
    </svg>
  );
}

export default function PrayerConfigPage() {
  const { times, updateTimes } = usePrayerContext();
  const { updateUser } = useUserContext();
  const router = useRouter();
  const [localTimes, setLocalTimes] = useState(times);

  useEffect(() => { setLocalTimes(times); }, [times]);

  const handleSave = () => {
    updateTimes(localTimes);
    updateUser({ lastUpdatedTimes: new Date().toISOString() });
    router.push('/dashboard');
  };

  const handleChange = (name: string, value: string) => {
    setLocalTimes((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', color: 'var(--gold)',
          fontSize: 15, fontWeight: 500, cursor: 'pointer', padding: 0,
          marginBottom: 4,
        }}
      >
        <IconArrowLeft /> Retour
      </button>

      <h1 className={styles.title}>Horaires de Prière</h1>
      <p className={styles.subtitle}>
        Saisissez vos horaires locaux. Recherchez «&nbsp;horaires prière [Ville] [Mois]&nbsp;» sur Google pour les obtenir.
      </p>

      <Card>
        {Object.keys(localTimes).map((prayerName, index) => (
          <div
            key={prayerName}
            className={styles.formGroup}
          >
            <div>
              <div className={styles.label}>{prayerName}</div>
              <div className={styles.labelAr}>{PRAYER_META[prayerName]?.arabic}</div>
            </div>
            <input
              type="time"
              className={styles.input}
              value={localTimes[prayerName as keyof typeof localTimes]}
              onChange={(e) => handleChange(prayerName, e.target.value)}
            />
          </div>
        ))}
      </Card>

      <button className={styles.saveBtn} onClick={handleSave}>
        <IconCheck />
        &nbsp; Sauvegarder les horaires
      </button>
    </div>
  );
}
