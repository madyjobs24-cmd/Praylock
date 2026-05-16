import React from 'react';
import styles from './MobileShell.module.css';

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shellContainer}>
      <div className={styles.shell}>
        {children}
      </div>
    </div>
  );
}
