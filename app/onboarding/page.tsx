'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Onboarding.module.css';
import { useUserContext } from '@/context/UserContext';
import { Toggle } from '@/components/ui/Toggle';

const APPS_TO_BLOCK = [
  { id: 'tiktok', name: 'TikTok' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'x', name: 'X (Twitter)' },
  { id: 'snapchat', name: 'Snapchat' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { user, updateUser } = useUserContext();
  const [firstName, setFirstName] = useState(user.name || '');
  const [city, setCity] = useState(user.city || '');
  const [blockedApps, setBlockedApps] = useState<string[]>(user.blockedApps || []);
  const router = useRouter();

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final save
      await updateUser({
        name: firstName,
        city: city,
        blockedApps: blockedApps,
        onboardingCompleted: true,
      });
      window.location.href = '/dashboard';
    }
  };

  const toggleApp = (appId: string) => {
    setBlockedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId) 
        : [...prev, appId]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.content}>
            <header className={styles.header}>
              <h1 className={styles.title}>Comment t'appelles-tu ?</h1>
              <p className={styles.subtitle}>On aimerait te connaître un peu mieux.</p>
            </header>
            <input 
              type="text" 
              placeholder="Ton prénom" 
              className={styles.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />
          </div>
        );
      case 2:
        return (
          <div className={styles.content}>
            <header className={styles.header}>
              <h1 className={styles.title}>Où habites-tu ?</h1>
              <p className={styles.subtitle}>Pour calculer tes horaires de prière avec précision.</p>
            </header>
            <input 
              type="text" 
              placeholder="Ta ville (ex: Paris)" 
              className={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoFocus
            />
          </div>
        );
      case 3:
        return (
          <div className={styles.content}>
            <header className={styles.header}>
              <h1 className={styles.title}>Applications à bloquer</h1>
              <p className={styles.subtitle}>Choisis les apps à verrouiller pendant les temps de prière.</p>
            </header>
            <div className={styles.appList}>
              {APPS_TO_BLOCK.map(app => (
                <div key={app.id} className={styles.appItem}>
                  <span className={styles.appName}>{app.name}</span>
                  <Toggle 
                    checked={blockedApps.includes(app.id)} 
                    onChange={() => toggleApp(app.id)} 
                  />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        {[1, 2, 3].map(s => (
          <div 
            key={s} 
            className={`${styles.dot} ${step === s ? styles.dotActive : ''}`} 
          />
        ))}
      </div>

      {renderStep()}

      <footer className={styles.footer}>
        <button 
          className={styles.nextBtn} 
          onClick={handleNext}
          disabled={step === 1 && !firstName || step === 2 && !city}
        >
          {step === 3 ? 'Terminer' : 'Suivant'}
        </button>
        {step > 1 && (
          <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
            Retour
          </button>
        )}
      </footer>
    </div>
  );
}
