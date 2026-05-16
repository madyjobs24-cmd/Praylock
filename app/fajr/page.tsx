'use client';

import React from 'react';
import styles from './Fajr.module.css';
import Link from 'next/link';

function AlarmIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Bell body */}
      <path d="M22 4C16 4 11 9 11 16v8l-3 4h28l-3-4v-8C33 9 28 4 22 4z"/>
      {/* Clapper */}
      <path d="M18 32a4 4 0 008 0"/>
      {/* Left alarm button */}
      <path d="M7 12l-3-3"/>
      {/* Right alarm button */}
      <path d="M37 12l3-3"/>
    </svg>
  );
}

export default function FajrPage() {
  return (
    <div className={styles.container}>
      <div className={styles.pulse} />

      <div className={styles.alarmIcon}>
        <AlarmIcon />
      </div>

      <h1 className={styles.title}>Alarme Fajr</h1>
      <p className={styles.titleAr}>أذان الفجر</p>

      <p className={styles.subtitle}>
        "La prière est meilleure que le sommeil."
      </p>
      <p className={styles.subtitleAr}>الصلاة خير من النوم</p>

      <Link href="/scan" className={styles.actionButton}>
        <button style={{
          width: '100%',
          padding: '18px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
          border: 'none',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1C1C1E',
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          boxShadow: 'var(--gold-glow)',
        }}>
          Arrêter l'alarme & Scanner
        </button>
      </Link>
    </div>
  );
}
