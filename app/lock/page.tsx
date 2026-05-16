'use client';

import React from 'react';
import styles from './Lock.module.css';
import Link from 'next/link';
import { usePrayerContext } from '@/context/PrayerContext';

const PRAYER_ARABIC: Record<string, string> = {
  Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء'
};

function MosqueIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Dome */}
      <path d="M20 6C15 6 11 10 11 14h18C29 10 25 6 20 6z" fill="rgba(201,168,76,0.2)" stroke="currentColor"/>
      {/* Minaret left */}
      <rect x="5" y="14" width="5" height="16" rx="1"/>
      <path d="M7.5 10v4M6 12h3"/>
      {/* Main body */}
      <rect x="11" y="14" width="18" height="16" rx="2"/>
      {/* Minaret right */}
      <rect x="30" y="14" width="5" height="16" rx="1"/>
      <path d="M32.5 10v4M31 12h3"/>
      {/* Door */}
      <path d="M17 30v-6a3 3 0 016 0v6"/>
      {/* Base */}
      <line x1="3" y1="30" x2="37" y2="30"/>
    </svg>
  );
}

export default function LockScreenPage() {
  const { prayers } = usePrayerContext();
  const activeOrNextPrayer = prayers.find(p => p.status === 'active' || p.status === 'late' || p.status === 'upcoming') || prayers[0];

  return (
    <div className={styles.container}>
      <div className={styles.ornament} />
      <div className={`${styles.ornament} ${styles.ornament2}`} />

      {/* Mosque icon */}
      <div className={styles.mosqueIcon}>
        <MosqueIcon />
      </div>

      <h1 className={styles.title}>C'est l'heure</h1>
      <p className={styles.titleAr}>حان وقت الصلاة</p>

      <p className={styles.subtitle}>
        La prière de <strong>{activeOrNextPrayer?.name}</strong>{' '}
        <span style={{ fontFamily: 'Amiri, serif', color: 'var(--gold)' }}>
          {activeOrNextPrayer ? PRAYER_ARABIC[activeOrNextPrayer.name] : ''}
        </span>{' '}
        vous attend.
      </p>

      <div className={styles.timeContainer}>
        <div className={styles.timeLabel}>Heure de la prière</div>
        <div className={styles.timeValue}>{activeOrNextPrayer?.time ?? '--:--'}</div>
      </div>

      <Link href="/scan" className={styles.actionButton}>
        <button style={{
          width: '100%',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
          border: 'none',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1C1C1E',
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          boxShadow: 'var(--gold-glow-sm)',
        }}>
          Déverrouiller via Scan Tapis
        </button>
      </Link>
    </div>
  );
}
