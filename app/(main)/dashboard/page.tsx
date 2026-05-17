'use client';

import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useUserContext } from '@/context/UserContext';
import { usePrayerContext, Prayer } from '@/context/PrayerContext';
import { useRouter } from 'next/navigation';

/* ── Données bilingues par prière ── */
const PRAYER_META: Record<string, { arabic: string; icon: React.ReactNode }> = {
  Fajr:    { arabic: 'الفجر',  icon: <IconFajr /> },
  Dhuhr:   { arabic: 'الظهر',  icon: <IconDhuhr /> },
  Asr:     { arabic: 'العصر',  icon: <IconAsr /> },
  Maghrib: { arabic: 'المغرب', icon: <IconMaghrib /> },
  Isha:    { arabic: 'العشاء', icon: <IconIsha /> },
};

/* ── SVG Icons dessinées ── */
function IconFajr() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3C6.13 3 3 6.13 3 10c0 1.8.65 3.45 1.72 4.73A7.5 7.5 0 0010 17c4.14 0 7.5-3.36 7.5-7.5 0-.28-.02-.55-.05-.82A6 6 0 0110 3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M5 10h-.5M15.5 10H16M10 4.5V4M10 16.5V17M6.46 6.46l-.35-.35M13.89 13.89l-.35-.35" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconDhuhr() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.41 1.41M14.37 14.37l1.41 1.41M4.22 15.78l1.41-1.41M14.37 5.63l1.41-1.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconAsr() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3M3.93 3.93l2.12 2.12M13.95 13.95l2.12 2.12M3.93 16.07l2.12-2.12M13.95 6.05l2.12-2.12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M14 14l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconMaghrib() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16 12A7 7 0 014.07 8.07 6 6 0 1016 12z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M3 16h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconIsha() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 10.5A6 6 0 015.5 7 6 6 0 1015 10.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="15" cy="5" r="1" fill="currentColor"/>
      <circle cx="17" cy="8" r="0.75" fill="currentColor"/>
    </svg>
  );
}

/* ── Icône flamme dorée (streak) ── */
function IconFlame() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1C7 1 9.5 4 9.5 6.5a2.5 2.5 0 01-5 0C4.5 4.5 5.5 3 5.5 3S4 5 4 7a3 3 0 006 0C10 4.5 7 1 7 1z" fill="url(#flameGrad)" stroke="none"/>
      <defs>
        <linearGradient id="flameGrad" x1="7" y1="1" x2="7" y2="13" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8C97A"/>
          <stop offset="100%" stopColor="#C9A84C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Icône réglages ── */
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="9" cy="9" r="2.5"/>
      <path d="M9 1.5V3M9 15v1.5M1.5 9H3M15 9h1.5M3.4 3.4l1.06 1.06M13.54 13.54l1.06 1.06M3.4 14.6l1.06-1.06M13.54 4.46l1.06-1.06"/>
    </svg>
  );
}

/* ── Motif géométrique islamique SVG ── */
function IslamicPattern() {
  return (
    <svg
      className={styles.islamicPattern}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="octagon" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <polygon
            points="15,5 35,5 45,15 45,35 35,45 15,45 5,35 5,15"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.6"
          />
          <line x1="15" y1="5" x2="5" y2="15" stroke="#C9A84C" strokeWidth="0.4"/>
          <line x1="35" y1="5" x2="45" y2="15" stroke="#C9A84C" strokeWidth="0.4"/>
          <line x1="45" y1="35" x2="35" y2="45" stroke="#C9A84C" strokeWidth="0.4"/>
          <line x1="5" y1="35" x2="15" y2="45" stroke="#C9A84C" strokeWidth="0.4"/>
          <line x1="25" y1="5" x2="25" y2="45" stroke="#C9A84C" strokeWidth="0.25"/>
          <line x1="5" y1="25" x2="45" y2="25" stroke="#C9A84C" strokeWidth="0.25"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#octagon)"/>
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useUserContext();
  const { prayers, markCompleted } = usePrayerContext();
  const router = useRouter();

  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [showBanner, setShowBanner]         = useState(false);
  const [now, setNow]                       = useState<Date | null>(null);
  const [mounted, setMounted]               = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user.preferences.reminderFrequency === 'manual' || !user.lastUpdatedTimes) {
      setShowBanner(false);
      return;
    }
    const lastUpdated  = new Date(user.lastUpdatedTimes);
    const currentDate  = now || new Date();
    const diffDays     = (currentDate.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (user.preferences.reminderFrequency === 'weekly' && diffDays > 7)  setShowBanner(true);
    else if (user.preferences.reminderFrequency === 'monthly' && diffDays > 30) setShowBanner(true);
    else setShowBanner(false);
  }, [user, now]);

  const activeOrNextPrayer = prayers.find(p => p.status === 'active' || p.status === 'upcoming') || prayers[0];

  const completedCount = prayers.filter(p => p.status === 'completed').length;
  const totalPrayers   = prayers.length;

  const handlePrayerClick = (prayer: Prayer) => {
    if (prayer.status !== 'completed' && prayer.status !== 'upcoming') {
      setSelectedPrayer(prayer);
    }
  };

  const handleConfirmCompletion = () => {
    if (selectedPrayer) {
      markCompleted(selectedPrayer.name);
      setSelectedPrayer(null);
    }
  };

  const formatTimeLeft = (timeStr: string) => {
    if (!now) return '...';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(hours, minutes, 0, 0);
    let diffMins = Math.floor((prayerTime.getTime() - now.getTime()) / 60000);
    if (diffMins < 0) diffMins += 24 * 60;
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    if (h > 0) return `dans ${h}h ${m}m`;
    return `dans ${m}m`;
  };

  const statusLabel = (status: Prayer['status']) => {
    switch (status) {
      case 'completed': return 'Accomplie';
      case 'active':    return 'En cours';
      case 'upcoming':  return 'À venir';
      case 'late':      return 'En retard';
      default:          return 'Manquée';
    }
  };

  return (
    <div className={`${styles.container} ${mounted ? styles.mounted : ''}`}>

      {/* ── Banner update reminder ── */}
      {showBanner && (
        <div className={styles.banner}>
          <div className={styles.bannerIcon}>
            <IconSettings />
          </div>
          <p className={styles.bannerText}>
            Tes horaires datent de plus d'un mois. Pense à les vérifier.
          </p>
          <div className={styles.bannerActions}>
            <button className={styles.bannerClose} onClick={() => setShowBanner(false)}>Ignorer</button>
            <button className={styles.bannerAction} onClick={() => router.push('/prayer-config')}>Mettre à jour</button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.greeting}>السلام عليكم</p>
          <h1 className={styles.userName}>{user.name}</h1>
        </div>
        <div className={styles.headerRight}>
          {/* Streak Badge */}
          <div className={styles.streakBadge}>
            <IconFlame />
            <span className={styles.streakCount}>{user.streakCount}</span>
            <span className={styles.streakLabel}>jours</span>
          </div>
          {/* Settings button */}
          <button
            className={styles.settingsBtn}
            onClick={() => router.push('/prayer-config')}
            title="Configurer les horaires"
          >
            <IconSettings />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO CARD — Prochaine prière
          ══════════════════════════════════════ */}
      <div className={styles.heroCard}>
        {/* Pattern islamique (overlay quasi invisible) */}
        <IslamicPattern />

        {/* Dégradé vert islamique → noir */}
        <div className={styles.heroGradient} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroTopRow}>
            <span className={styles.heroLabel}>Prochaine prière</span>
            <span className={styles.heroStatus}>
              {activeOrNextPrayer?.status === 'active' ? '● En cours' : ''}
            </span>
          </div>

          <div className={styles.heroTimeRow}>
            <span className={styles.heroTime}>{activeOrNextPrayer?.time ?? '--:--'}</span>
          </div>

          <div className={styles.heroNameRow}>
            <span className={styles.heroPrayerName}>{activeOrNextPrayer?.name}</span>
            <span className={styles.heroPrayerArabic}>
              {activeOrNextPrayer ? PRAYER_META[activeOrNextPrayer.name]?.arabic : ''}
            </span>
          </div>

          <div className={styles.heroFooter}>
            <span className={styles.heroCountdown}>
              {activeOrNextPrayer?.status === 'upcoming'
                ? formatTimeLeft(activeOrNextPrayer.time)
                : activeOrNextPrayer?.status === 'active'
                  ? 'Le temps est compté…'
                  : ''}
            </span>
            {/* Progress bar journalière */}
            <div className={styles.heroDayProgress}>
              <span className={styles.heroDayProgressLabel}>{completedCount}/{totalPrayers}</span>
              <div className={styles.heroDayProgressBar}>
                <div
                  className={styles.heroDayProgressFill}
                  style={{ width: `${totalPrayers ? (completedCount / totalPrayers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section timeline ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Aujourd'hui</h2>

        <div className={styles.timeline}>
          {prayers.map((prayer, idx) => {
            const meta    = PRAYER_META[prayer.name];
            const isActive = prayer.name === activeOrNextPrayer?.name;

            return (
              <div
                key={prayer.name}
                className={`${styles.prayerRow} ${isActive ? styles.prayerRowActive : ''} ${styles[`delay${idx}`] ?? ''}`}
                data-status={prayer.status}
                onClick={() => handlePrayerClick(prayer)}
                role={prayer.status !== 'completed' && prayer.status !== 'upcoming' ? 'button' : undefined}
                tabIndex={prayer.status !== 'completed' && prayer.status !== 'upcoming' ? 0 : undefined}
              >
                {/* Indicateur gauche */}
                <div className={`${styles.statusBar} ${styles[`statusBar_${prayer.status}`]}`} />

                {/* Icône prière */}
                <div className={`${styles.prayerIcon} ${isActive ? styles.prayerIconActive : ''}`}>
                  {meta?.icon}
                </div>

                {/* Nom bilingue */}
                <div className={styles.prayerNames}>
                  <span className={styles.prayerNameFr}>{prayer.name}</span>
                  <span className={styles.prayerNameAr}>{meta?.arabic}</span>
                </div>

                {/* Heure */}
                <div className={styles.prayerTimeWrap}>
                  <span className={styles.prayerTime}>{prayer.time}</span>
                </div>

                {/* Badge statut */}
                <div className={`${styles.prayerBadge} ${styles[`badge_${prayer.status}`]}`}>
                  {prayer.status === 'completed' && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <span>{statusLabel(prayer.status)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Modal confirmation ── */}
      {selectedPrayer && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPrayer(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              {PRAYER_META[selectedPrayer.name]?.icon}
            </div>
            <h3 className={styles.modalTitle}>
              {selectedPrayer.name}
              <span className={styles.modalArabic}>
                {PRAYER_META[selectedPrayer.name]?.arabic}
              </span>
            </h3>
            <p className={styles.modalQuestion}>
              As-tu accompli ta prière ?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnSecondary} onClick={() => setSelectedPrayer(null)}>
                Non
              </button>
              <button className={styles.modalBtnPrimary} onClick={handleConfirmCompletion}>
                Oui, accomplie ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
