import type { ButtonHTMLAttributes } from 'react';
import './GoldOrderButton.css';

export function GoldOrderButton({ className = '', ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return <button type="button" {...props} className={`gold-order-cta ${className}`}>
    <span>Захиалга өгөх</span>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
  </button>;
}
