import { useEffect, useRef, useState, type FormEvent } from 'react';

export function GiftOrderDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const inFlight = useRef(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  useEffect(() => {
    if (open && !dialog.current?.open) { setStatus('idle'); dialog.current?.showModal(); }
    if (!open) dialog.current?.close();
  }, [open]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    inFlight.current = true; setStatus('sending');
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch('/api/gift-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ phone: data.get('phone'), quantity: Number(data.get('quantity')) }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Order not acknowledged');
      setStatus('success'); form.reset();
    } catch { setStatus('error'); }
    finally { window.clearTimeout(timer); inFlight.current = false; }
  }
  return <dialog ref={dialog} className="gift-order-dialog" aria-labelledby="gift-order-title"
    onCancel={e => { if (status === 'sending') e.preventDefault(); }} onClose={onClose}
    onClick={e => { if (e.target === dialog.current && status !== 'sending') dialog.current?.close(); }}>
    <button className="gift-order-close" type="button" aria-label="Хаах" disabled={status === 'sending'} onClick={() => dialog.current?.close()}>×</button>
    <p className="gift-order-eyebrow">FGN · SPECIAL EDITION</p>
    <h2 id="gift-order-title">{status === 'success' ? 'Баярлалаа.' : 'Захиалга өгөх'}</h2>
    {status === 'success' ? <div role="status" className="gift-order-success">
      <p>Таны захиалгын хүсэлтийг хүлээн авлаа. Манай байгууллага хариуцсан менежерүүд ажлын 2 хоногийн дотор тантай холбогдох болно.</p>
      <button type="button" className="gift-order-submit" onClick={() => dialog.current?.close()}>Хаах</button>
    </div> : <form onSubmit={submit}>
      <label htmlFor="gift-phone">Утасны дугаар</label>
      <input id="gift-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="9911 2233" required pattern="(\+976 ?)?[0-9]{4} ?[0-9]{4}" maxLength={15} title="8 оронтой утасны дугаар оруулна уу." disabled={status === 'sending'} />
      <label htmlFor="gift-quantity">Захиалгын тоо</label>
      <input id="gift-quantity" name="quantity" type="number" inputMode="numeric" min={10} max={100000} step={1} defaultValue={10} required aria-describedby="gift-minimum" disabled={status === 'sending'} />
      <p id="gift-minimum" className="gift-order-note">Хамгийн багадаа 10 ширхэг захиалах боломжтой.</p>
      {status === 'error' && <p role="alert" className="gift-order-error">Захиалга илгээгдсэнийг баталгаажуулж чадсангүй. Дахин оролдох эсвэл info@finegold.mn хаягаар холбогдоно уу.</p>}
      <button className="gift-order-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Илгээж байна…' : 'Захиалга илгээх'}</button>
    </form>}
  </dialog>;
}
