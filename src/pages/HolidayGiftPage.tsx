import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import './HolidayGiftPage.css';

export default function HolidayGiftPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'FGN 2026/7 Holiday Gift Set — Special Edition | Fine Gold Nation';
    return () => { document.title = previous; };
  }, []);
  return <div className="holiday-page">
    <Header solid />
    <main className="holiday-content">
      <p className="holiday-eyebrow">FGN 2026/7 · SPECIAL EDITION</p>
      <h1>Holiday <span>Gift Set</span></h1>
      <p className="holiday-audience">Гэр бүл, найз нөхөд, хайртай хүмүүст</p>
      <div className="holiday-coming"><span aria-hidden="true">✦</span><h2>Тун удахгүй</h2>
        <p>Шинэ жилийн бэлгийн цуглуулгын дэлгэрэнгүй мэдээллийг удахгүй танилцуулна.</p>
      </div>
      <a className="holiday-executive" href="/executive">Executive Gift Set үзэх <span aria-hidden="true">↗</span></a>
    </main>
    <footer className="holiday-footer">FINE GOLD NATION</footer>
  </div>;
}
