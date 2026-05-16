'use client';

import React from 'react';
import styles from './Stats.module.css';
import { Card } from '@/components/ui/Card';
import { useUserContext } from '@/context/UserContext';
import { usePrayerContext } from '@/context/PrayerContext';

function IconFlame() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M20 3C20 3 28 13 28 20a8 8 0 01-16 0C12 13 16 9 16 9S13 14 13 20a7 7 0 0014 0C27 13 20 3 20 3z"
        fill="url(#statFlame)"
      />
      <defs>
        <linearGradient id="statFlame" x1="20" y1="3" x2="20" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8C97A"/>
          <stop offset="100%" stopColor="#C9A84C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function StatsPage() {
  const { user } = useUserContext();
  const { prayers } = usePrayerContext();

  const completedToday = prayers.filter(p => p.status === 'completed').length;
  const totalToday = prayers.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const weeklyData = [
    { day: 'L', value: 100, label: 'Lun' },
    { day: 'M', value: 100, label: 'Mar' },
    { day: 'M', value: 80,  label: 'Mer' },
    { day: 'J', value: 100, label: 'Jeu' },
    { day: 'V', value: 100, label: 'Ven' },
    { day: 'S', value: 60,  label: 'Sam' },
    { day: 'D', value: 100, label: 'Dim' },
  ];

  const weeklyAvg = Math.round(weeklyData.reduce((a, b) => a + b.value, 0) / weeklyData.length);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Statistiques</h1>

      {/* ── Streak Hero ── */}
      <Card className={styles.streakCard}>
        <div className={styles.streakNumber}>
          <IconFlame />
          {user.streakCount}
        </div>
        <div className={styles.streakLabel}>Jours consécutifs</div>
      </Card>

      {/* ── Stats Grid ── */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statValue}>{completedToday}/{totalToday}</div>
          <div className={styles.statLabel}>Aujourd'hui</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue}>{weeklyAvg}%</div>
          <div className={styles.statLabel}>Cette semaine</div>
        </Card>
      </div>

      {/* ── Weekly chart ── */}
      <Card>
        <h3 className={styles.sectionTitle}>Cette Semaine</h3>
        <div className={styles.chartContainer}>
          {weeklyData.map((data, index) => (
            <div key={index} className={styles.chartBarWrapper}>
              <div className={styles.chartBar}>
                <div
                  className={styles.chartFill}
                  style={{
                    height: `${data.value}%`,
                    backgroundColor: data.value === 100
                      ? 'var(--status-green)'
                      : data.value >= 80
                        ? 'var(--gold)'
                        : 'var(--status-orange)'
                  }}
                />
              </div>
              <span className={styles.chartLabel}>{data.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
