'use client';

import React, { useState, useEffect } from 'react';
import styles from './Scan.module.css';
import { useRouter } from 'next/navigation';
import { usePrayerContext } from '@/context/PrayerContext';
import { classNames } from '@/lib/utils';

export default function ScanPage() {
  const [detecting, setDetecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { prayers, markCompleted } = usePrayerContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      // Find the active or late prayer to mark as completed
      const activePrayer = prayers.find(p => p.status === 'active' || p.status === 'late');
      if (activePrayer) {
        markCompleted(activePrayer.name);
      }
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className={classNames(styles.container, mounted && styles.mounted)}>
      <div className={styles.cameraView}>
        {/* Simulating camera flux with a dark pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
          opacity: 0.8
        }} />
        
        <div className={styles.cameraPlaceholder}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
          Flux Caméra<br />
          <span style={{ fontSize: '12px', opacity: 0.5 }}>(Environnement de test)</span>
        </div>
        
        <div className={styles.scanLine} />
        
        <div className={styles.overlay}>
          <div className={`${styles.overlayCorners} ${styles.topLeft}`} />
          <div className={`${styles.overlayCorners} ${styles.topRight}`} />
          <div className={`${styles.overlayCorners} ${styles.bottomLeft}`} />
          <div className={`${styles.overlayCorners} ${styles.bottomRight}`} />
        </div>
      </div>

      <div className={styles.controls}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
          {detecting ? 'Analyse du motif...' : 'Validation par Tapis'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '15px' }}>
          {detecting ? 'Veuillez ne pas bouger' : 'Alignez votre tapis de prière'}
        </p>
        <p style={{ color: 'var(--gold)', fontSize: '12px', opacity: 0.8, fontStyle: 'italic' }}>
          La prière est le pilier de la religion
        </p>

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={() => router.back()}>
            Annuler
          </button>
          <button 
            className={styles.scanBtn}
            onClick={handleDetect}
            disabled={detecting}
          >
            {detecting ? 'Détection...' : 'Valider la Prière'}
          </button>
        </div>
      </div>
    </div>
  );
}
