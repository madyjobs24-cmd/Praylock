'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../login/Login.module.css';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✉️</div>
          <h1 className={styles.title}>Email envoyé !</h1>
          <p className={styles.subtitle}>
            Un lien de réinitialisation a été envoyé à <strong style={{ color: 'var(--gold)' }}>{email}</strong>. 
            Vérifiez votre boîte de réception et vos spams.
          </p>
        </header>

        <div className={styles.authForm}>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => setSent(false)}
          >
            Renvoyer l&apos;email
          </button>
        </div>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Vous vous souvenez du mot de passe ?
            <Link href="/auth/login" className={styles.footerLink}>
              Se connecter
            </Link>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mot de passe oublié</h1>
        <p className={styles.subtitle}>
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </header>

      <form className={styles.authForm} onSubmit={handleReset}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="forgot-password-email"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn} id="forgot-password-submit">
          {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </button>
      </form>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Vous vous souvenez du mot de passe ?
          <Link href="/auth/login" className={styles.footerLink}>
            Se connecter
          </Link>
        </p>
      </footer>
    </div>
  );
}
