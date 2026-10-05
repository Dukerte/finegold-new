import type { ButtonHTMLAttributes } from 'react';
import './GoldOrderButton.css';

export function GoldOrderButton({ className = '', ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return <button type="button" {...props} className={`gold-order-cta ${className}`}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 2 9l10 13L22 9Z" /></svg>
    <span>Захиалга өгөх</span>
  </button>;
}
