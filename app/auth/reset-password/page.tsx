'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/Login.module.css';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the hash fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setSessionReady(true);
        }
      }
    );

    // Also check if we already have a session (user came from callback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      alert('Mot de passe mis à jour avec succès !');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionReady) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔄</div>
          <h1 className={styles.title}>Chargement...</h1>
          <p className={styles.subtitle}>
            Vérification de votre lien de réinitialisation en cours.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
        <h1 className={styles.title}>Nouveau mot de passe</h1>
        <p className={styles.subtitle}>
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
        </p>
      </header>

      <form className={styles.authForm} onSubmit={handleUpdatePassword}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nouveau mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            id="reset-password-new"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirmer le mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            id="reset-password-confirm"
          />
        </div>

        {error && (
          <p style={{
            color: '#ff6b6b',
            fontSize: 14,
            textAlign: 'center',
            padding: '12px 16px',
            background: 'rgba(255, 107, 107, 0.1)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 107, 107, 0.2)',
          }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={styles.submitBtn} id="reset-password-submit">
          {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    </div>
  );
}
