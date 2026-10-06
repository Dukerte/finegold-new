export function ArrowIcon({ diagonal = false, down = false }: { diagonal?: boolean; down?: boolean }) {
  return <svg className="fgn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, transform: down ? 'rotate(90deg)' : diagonal ? 'rotate(-45deg)' : undefined }}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}
