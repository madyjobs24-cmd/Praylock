'use client';

import React, { useState, useEffect } from 'react';
import styles from './Duas.module.css';
import { Card } from '@/components/ui/Card';
import { MOCK_DUAS } from '@/lib/mock-data';
import { DUA_CATEGORIES } from '@/lib/constants';
import { classNames } from '@/lib/utils';
import { useUserContext } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

function IconBookmark({ saved }: { saved: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

export default function DuasPage() {
  const { supabaseUser } = useUserContext();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(DUA_CATEGORIES[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (supabaseUser) {
      fetchSavedDuas();
    } else {
      const stored = localStorage.getItem('praylock_saved_duas');
      if (stored) setSavedIds(JSON.parse(stored));
    }
  }, [supabaseUser]);

  const fetchSavedDuas = async () => {
    const { data } = await supabase
      .from('saved_duas')
      .select('id')
      .eq('user_id', supabaseUser?.id);
    
    if (data) setSavedIds(data.map(d => Number(d.id)));
  };

  const toggleSave = async (duaId: number) => {
    const isSaved = savedIds.includes(duaId);
    let newSavedIds: number[];

    if (isSaved) {
      newSavedIds = savedIds.filter(id => id !== duaId);
    } else {
      newSavedIds = [...savedIds, duaId];
    }

    setSavedIds(newSavedIds);
    localStorage.setItem('praylock_saved_duas', JSON.stringify(newSavedIds));

    if (supabaseUser) {
      if (isSaved) {
        await supabase.from('saved_duas').delete().eq('user_id', supabaseUser.id).eq('id', duaId);
      } else {
        const dua = MOCK_DUAS.find(d => d.id === duaId);
        if (dua) {
          await supabase.from('saved_duas').insert({
            user_id: supabaseUser.id,
            text_ar: dua.text_ar,
            transliteration: dua.transliteration,
            translation: dua.translation,
            source: 'PrayLock'
          });
        }
      }
    }
  };

  const filteredDuas = selectedCategory === 'Tous' 
    ? MOCK_DUAS 
    : MOCK_DUAS.filter(d => d.category === selectedCategory);

  return (
    <div className={classNames(styles.container, mounted && styles.mounted)}>
      <h1 className={styles.title}>Bibliothèque de Duas</h1>

      <div className={styles.categories}>
        {DUA_CATEGORIES.map((cat) => (
          <div 
            key={cat} 
            className={classNames(styles.categoryBadge, selectedCategory === cat && styles.categoryBadgeActive)}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className={styles.duaList}>
        {filteredDuas.length > 0 ? filteredDuas.map((dua, idx) => (
          <Card key={dua.id} className={classNames(styles.duaCard, styles[`delay${idx % 5}`])}>
            <div className={styles.duaHeader}>
              <div className={styles.duaTitle}>{dua.title}</div>
              <button 
                className={styles.saveBtn}
                onClick={() => toggleSave(dua.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: savedIds.includes(dua.id) ? 'var(--gold)' : 'var(--text-muted)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
              >
                <IconBookmark saved={savedIds.includes(dua.id)} />
              </button>
            </div>
            
            <div className={styles.duaArabic}>{dua.text_ar}</div>
            <div className={styles.duaTransliteration}>{dua.transliteration}</div>
            <div className={styles.duaTranslation}>{dua.translation}</div>
            {dua.source && (
              <div style={{ 
                fontSize: '11px', 
                color: 'var(--text-muted)', 
                marginTop: '12px', 
                fontStyle: 'italic',
                borderTop: '0.5px solid rgba(255,255,255,0.06)',
                paddingTop: '8px'
              }}>
                Source: {dua.source}
              </div>
            )}
          </Card>
        )) : (
          <div className={styles.emptyState}>
            Aucun dua trouvé dans cette catégorie.
          </div>
        )}
      </div>
    </div>
  );
}
