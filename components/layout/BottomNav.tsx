'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

/* ── Custom SVG Icons (monochrome, drawn) ── */
const IconHome = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const IconDua = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C9 2 6.5 4 6.5 7c0 1.5.5 2.8 1.4 3.8L12 22l4.1-11.2A5.5 5.5 0 0017.5 7C17.5 4 15 2 12 2z"/>
    <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

const IconStats = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="14" width="4" height="7" rx="1"/>
    <rect x="10" y="9" width="4" height="12" rx="1"/>
    <rect x="17" y="4" width="4" height="17" rx="1"/>
  </svg>
);

const IconFamily = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3"/>
    <path d="M3 20v-1a6 6 0 0112 0v1"/>
    <circle cx="18" cy="8" r="2"/>
    <path d="M15 20v-.5a4 4 0 014-4h1"/>
  </svg>
);

const IconProfile = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const navItems = [
  { href: '/dashboard', label: 'Accueil',  Icon: IconHome },
  { href: '/duas',      label: 'Duas',     Icon: IconDua },
  { href: '/stats',     label: 'Stats',    Icon: IconStats },
  { href: '/family',    label: 'Famille',  Icon: IconFamily },
  { href: '/profile',   label: 'Profil',   Icon: IconProfile },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${active ? styles.active : ''}`}
          >
            <span className={styles.iconWrap}>
              <Icon active={active} />
              {active && <span className={styles.activeDot} />}
            </span>
            <span className={styles.label}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
