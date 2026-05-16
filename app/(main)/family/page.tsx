'use client';

import React, { useState, useEffect } from 'react';
import styles from './Family.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserContext } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

interface FamilyMember {
  id: string;
  name: string;
  streak: number;
}

function IconFlame() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1C6.5 1 9 4.5 9 7a2.5 2.5 0 01-5 0C4 4.5 5 3 5 3S3.5 5 3.5 7a3 3 0 006 0C9.5 4.5 6.5 1 6.5 1z" fill="url(#famFlame)"/>
      <defs>
        <linearGradient id="famFlame" x1="6.5" y1="1" x2="6.5" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8C97A"/>
          <stop offset="100%" stopColor="#C9A84C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconAdd() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 3v10M3 8h10"/>
    </svg>
  );
}

const RANK_LABELS = ['🥇', '🥈', '🥉'];

export default function FamilyPage() {
  const { user, supabaseUser } = useUserContext();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseUser) {
      fetchFamilyMembers();
    } else {
      setLoading(false);
    }
  }, [supabaseUser]);

  const fetchFamilyMembers = async () => {
    if (!supabaseUser) return;
    const { data: membership } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', supabaseUser.id)
      .single();

    if (membership) {
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select(`user_id, users:user_id (id, name, streak_count)`)
        .eq('family_id', membership.family_id);

      if (familyMembers) {
        const mappedMembers = familyMembers
          .map((m: any) => ({ id: m.users.id, name: m.users.name, streak: m.users.streak_count }))
          .filter((m: FamilyMember) => m.id !== supabaseUser.id)
          .sort((a: FamilyMember, b: FamilyMember) => b.streak - a.streak);
        setMembers(mappedMembers);
      }
    }
    setLoading(false);
  };

  const handleCreateFamily = async () => {
    if (!supabaseUser) return alert('Connectez-vous pour créer une famille');
    const name = prompt('Nom de votre famille ?');
    if (!name) return;
    const { data: family } = await supabase
      .from('families')
      .insert({ name, created_by: supabaseUser.id })
      .select()
      .single();
    if (family) {
      await supabase.from('family_members').insert({ family_id: family.id, user_id: supabaseUser.id });
      fetchFamilyMembers();
    }
  };

  /* Classement complet incluant l'utilisateur actuel */
  const allMembers: FamilyMember[] = [
    { id: supabaseUser?.id ?? 'me', name: `${user.name} (Moi)`, streak: user.streakCount },
    ...members
  ].sort((a, b) => b.streak - a.streak);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Famille</h1>
        <button
          className={styles.addBtn ?? ''}
          onClick={handleCreateFamily}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--gold-dim)', border: '0.5px solid var(--gold-border)',
            borderRadius: 'var(--radius-full)', padding: '8px 14px',
            color: 'var(--gold)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}
        >
          <IconAdd /> Créer
        </button>
      </div>

      <div className={styles.list}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Chargement…
          </div>
        ) : !supabaseUser ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👨‍👩‍👧‍👦</div>
            <p className={styles.emptyText}>Connectez-vous pour voir votre famille et vous motiver mutuellement.</p>
          </div>
        ) : allMembers.length > 0 ? (
          allMembers.map((member, idx) => {
            const isSelf = member.name.includes('(Moi)');
            return (
              <Card
                key={member.id}
                className={`${styles.memberCard} ${isSelf ? styles.memberCardSelf : ''}`}
              >
                <div className={`${styles.avatar} ${isSelf ? '' : styles.avatarOther}`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.info}>
                  <div className={styles.name}>{member.name}</div>
                  <div className={styles.streak}>
                    <IconFlame />
                    <span className={styles.streakNumber}>{member.streak} jours</span>
                  </div>
                </div>
                <div className={styles.rank}>
                  {idx < 3 ? RANK_LABELS[idx] : `#${idx + 1}`}
                </div>
              </Card>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🕌</div>
            <p className={styles.emptyText}>Aucun membre trouvé. Créez une famille !</p>
          </div>
        )}
      </div>
    </div>
  );
}
