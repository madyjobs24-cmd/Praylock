import React from 'react';
import styles from './Toggle.module.css';
import { classNames } from '@/lib/utils';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <label className={classNames(styles.toggle, className)}>
      <input type="checkbox" className={styles.input} {...props} />
      <span className={styles.slider}></span>
    </label>
  );
}
