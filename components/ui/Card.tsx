import React from 'react';
import styles from './Card.module.css';
import { classNames } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames(styles.card, className)} {...props} />;
}
