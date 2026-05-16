import React from 'react';
import styles from './Badge.module.css';
import { classNames } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span className={classNames(styles.badge, styles[variant], className)} {...props} />
  );
}
