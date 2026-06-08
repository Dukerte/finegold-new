import { useEffect, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const TROY_OZ_TO_GRAM = 31.1035;

/**
 * Fallback price per gram (MNT) — update to a recent Mongolbank value.
 */
const FALLBACK_PRICE_PER_GRAM = 516_765;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GoldRateData {
  pricePerGram: number;
  pricePerTroyOz: number;
  rateDate: string;
  change24h: number | null;   // %, e.g. -0.84 means −0.84%
  change7d: number | null;
  source: 'mongolbank' | 'monxansh' | 'fallback';
  loading: boolean;
  error: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse Mongolbank's comma-formatted price string → number. */
const parseMNT = (raw: unknown): number =>
  typeof raw === 'string'
    ? parseFloat((raw as string).replace(/,/g, ''))
    : Number(raw);

/** Days between two ISO date strings (positive = d2 is later). */
const daysBetween = (d1: string, d2: string) =>
  Math.round((new Date(d2).getTime() - new Date(d1).getTime()) / 86_400_000);

// ─── Mongolbank gold price API ────────────────────────────────────────────────

/**
 * Confirmed endpoint (discovered via Chrome DevTools, 2026-06-07):
 *   POST https://www.mongolbank.mn/mn/gold-and-silver-price/data
 *        ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 *
 * Response: JSON array, sorted ASCENDING by RATE_DATE (oldest first).
 * Each item: { RATE_DATE: "2026-06-05", GOLD_BUY: "516,764.64", ... }
 *
 * In development, Vite proxies /mb-gold → mongolbank.mn (no CORS).
 * In production, set up a backend proxy (Cloudflare Worker, Vercel fn, etc.).
 */
interface MBItem {
  RATE_DATE: string;
  GOLD_BUY: string;
  [key: string]: unknown;
}

const fetchMongolbankHistory = async (): Promise<MBItem[]> => {
  const endDate   = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 14 * 86_400_000).toISOString().split('T')[0];

  // Dev: Vite proxy at /mb-gold  |  Prod: override via VITE_GOLD_PROXY_URL env
  const base = import.meta.env.VITE_GOLD_PROXY_URL ?? '/mb-gold';
  const res = await fetch(
    `${base}?startDate=${startDate}&endDate=${endDate}`,
    { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' } },
  );
  if (!res.ok) throw new Error(`Mongolbank HTTP ${res.status}`);

  const json = await res.json();
  const items: MBItem[] = Array.isArray(json)
    ? json
    : (json?.data ?? json?.result ?? json?.items ?? []);

  if (!items.length) throw new Error('Mongolbank: empty response');

  // API returns ascending — sort to be safe (most recent last)
  return [...items].sort((a, b) => a.RATE_DATE.localeCompare(b.RATE_DATE));
};

// ─── monxansh fallback ────────────────────────────────────────────────────────

const fetchMonxansh = async () => {
  const res = await fetch(
    'https://monxansh.appspot.com/xansh.json?currency=XAU',
    { cache: 'no-store' },
  );
  if (!res.ok) throw new Error(`monxansh HTTP ${res.status}`);
  const json = await res.json();
  const item = json?.[0];
  if (!item?.rate_float) throw new Error('monxansh: bad shape');

  const pricePerTroyOz: number = item.rate_float;
  const pricePerGram = Math.round(pricePerTroyOz / TROY_OZ_TO_GRAM);
  const rateDate: string = item.rate_date ?? new Date().toISOString().split('T')[0];
  return { pricePerGram, pricePerTroyOz, rateDate };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns Mongolbank's official daily gold buy rate (₮/gram).
 *
 * Priority: Mongolbank API → monxansh → hardcoded fallback.
 * 24h and 7d % changes are computed directly from the API history array
 * so they are accurate from the very first load (no localStorage warm-up needed).
 */
export const useGoldRate = (): GoldRateData => {
  const [data, setData] = useState<GoldRateData>({
    pricePerGram:    FALLBACK_PRICE_PER_GRAM,
    pricePerTroyOz:  FALLBACK_PRICE_PER_GRAM * TROY_OZ_TO_GRAM,
    rateDate:        '',
    change24h:       null,
    change7d:        null,
    source:          'fallback',
    loading:         true,
    error:           null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchRate = async () => {
      let pricePerGram    = FALLBACK_PRICE_PER_GRAM;
      let pricePerTroyOz  = FALLBACK_PRICE_PER_GRAM * TROY_OZ_TO_GRAM;
      let rateDate        = '';
      let change24h: number | null = null;
      let change7d:  number | null = null;
      let source: GoldRateData['source'] = 'fallback';
      let error: string | null = null;

      // ── 1. Mongolbank official gold buy price ──────────────────────────────
      try {
        const items = await fetchMongolbankHistory();

        // Most recent = last item (array is ascending by date)
        const latest  = items[items.length - 1];
        const latestPrice = parseMNT(latest.GOLD_BUY);
        if (!latestPrice || latestPrice < 100_000) throw new Error('Bad GOLD_BUY');

        pricePerGram   = Math.round(latestPrice);
        pricePerTroyOz = pricePerGram * TROY_OZ_TO_GRAM;
        rateDate       = latest.RATE_DATE;
        source         = 'mongolbank';

        // ── 24h change: compare with the previous business day ────────────────
        if (items.length >= 2) {
          const prev = items[items.length - 2];
          const prevPrice = parseMNT(prev.GOLD_BUY);
          if (prevPrice > 0) {
            change24h = ((latestPrice - prevPrice) / prevPrice) * 100;
          }
        }

        // ── 7-day change: find item closest to 7 business days ago ────────────
        // Walk backwards from second-to-last until we find a day ≥ 5 calendar
        // days before the latest date (handles weekends / holidays).
        for (let i = items.length - 2; i >= 0; i--) {
          const diff = daysBetween(items[i].RATE_DATE, rateDate);
          if (diff >= 5) {
            const oldPrice = parseMNT(items[i].GOLD_BUY);
            if (oldPrice > 0) {
              change7d = ((latestPrice - oldPrice) / oldPrice) * 100;
            }
            break;
          }
        }

      } catch (e1) {
        // ── 2. Fallback: monxansh XAU/MNT rate ──────────────────────────────
        console.warn('Mongolbank API failed, falling back to monxansh:', e1);
        try {
          const mx = await fetchMonxansh();
          pricePerGram   = mx.pricePerGram;
          pricePerTroyOz = mx.pricePerTroyOz;
          rateDate       = mx.rateDate;
          source         = 'monxansh';
          error = 'Монголбанкны API холболт амжилтгүй. Монхансын ханш харуулж байна.';
        } catch (e2) {
          console.error('monxansh also failed:', e2);
          source = 'fallback';
          error  = 'Ханш татахад алдаа гарлаа. Хуучин ханш ашиглаж байна.';
        }
      }

      if (!cancelled) {
        setData({
          pricePerGram,
          pricePerTroyOz,
          rateDate,
          change24h,
          change7d,
          source,
          loading: false,
          error,
        });
      }
    };

    fetchRate();

    // Refresh once per hour — rates are published once per business day
    const interval = setInterval(fetchRate, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return data;
};
