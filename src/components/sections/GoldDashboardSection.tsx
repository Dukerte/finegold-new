import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  LineSeries,
  ColorType,
  type UTCTimestamp,
} from 'lightweight-charts';
import { useGoldRate } from '../../hooks/useGoldRate';

const timeframes = ['1D', '7D', '1M', '1Y', '3Y'];

const formatMNT = (n: number) => n.toLocaleString('en-US');

/** Format a % change with sign, 2 decimal places. */
const fmtPct = (v: number | null): string => {
  if (v === null) return '—';
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
};

/** Color for a % change value. */
const pctColor = (v: number | null): string => {
  if (v === null) return 'text-white/40';
  return v >= 0 ? 'text-emerald-400' : 'text-red-400';
};

/**
 * Classify stability based on the absolute 7-day (or 24h) % change.
 * Gold's typical weekly move is 1–3 %, so thresholds are calibrated accordingly.
 */
const stabilityLevel = (
  change7d: number | null,
  change24h: number | null,
): { label: string; color: string; helper: string } => {
  const ref = change7d ?? (change24h !== null ? change24h * 5 : null);

  if (ref === null) {
    return { label: 'Өндөр', color: 'text-[#E2B56D]', helper: 'Урт хугацааны хөрөнгө' };
  }

  const abs = Math.abs(ref);

  if (abs < 1.0) {
    return { label: 'Маш өндөр', color: 'text-emerald-400', helper: 'Хамгийн тогтвортой хэлбэлзэл' };
  }
  if (abs < 2.5) {
    return { label: 'Өндөр',     color: 'text-[#E2B56D]',   helper: 'Тогтвортой урт хугацааны хөрөнгө' };
  }
  if (abs < 5.0) {
    return { label: 'Дундаж',    color: 'text-amber-300',    helper: 'Хэвийн зах зээлийн хэлбэлзэл' };
  }
  if (abs < 8.0) {
    return { label: 'Хэлбэлзэлтэй', color: 'text-orange-400', helper: 'Нэмэгдсэн зах зээлийн хөдөлгөөн' };
  }
  return   { label: 'Тогтворгүй',   color: 'text-red-400',    helper: 'Өндөр хэлбэлзэлт үе' };
};

export const GoldDashboardSection = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [timeframe, setTimeframe] = useState('1D');
  const { pricePerGram, rateDate, loading, change24h, change7d, source, error } = useGoldRate();

  const stability = stabilityLevel(change7d, change24h);

  // Simulated historical data anchored at the live MNT/gram price.
  const generateData = (tf: string, basePrice: number) => {
    const now = Math.floor(Date.now() / 1000);
    const points = 80;
    let step = 60;
    let wave  = basePrice * 0.0003;
    let trend = basePrice * 0.000015;

    if (tf === '7D') { step = 60 * 60 * 3;     wave = basePrice * 0.0005;  trend = basePrice * 0.00002; }
    if (tf === '1M') { step = 60 * 60 * 12;    wave = basePrice * 0.0008;  trend = basePrice * 0.00004; }
    if (tf === '1Y') { step = 60 * 60 * 24 * 7; wave = basePrice * 0.0015; trend = basePrice * 0.0001; }
    if (tf === '3Y') { step = 60 * 60 * 24 * 30; wave = basePrice * 0.003; trend = basePrice * 0.00025; }

    const startPrice = basePrice - points * trend;

    return Array.from({ length: points }).map((_, i) => ({
      time: (now - (points - i) * step) as UTCTimestamp,
      value:
        startPrice +
        Math.sin(i / 5) * wave +
        Math.cos(i / 11) * (wave / 2) +
        i * trend,
    }));
  };

  useEffect(() => {
    if (!chartRef.current) return undefined;

    const container = chartRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255,255,255,0.48)',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.035)' },
        horzLines: { color: 'rgba(255,255,255,0.035)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(226,181,109,0.35)',
          width: 1,
          style: 3,
          labelBackgroundColor: '#E2B56D',
        },
        horzLine: {
          color: 'rgba(226,181,109,0.25)',
          width: 1,
          style: 3,
          labelBackgroundColor: '#E2B56D',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.08)',
        textColor: 'rgba(255,255,255,0.45)',
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.08)',
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
        priceFormatter: (price: number) =>
          `₮${Math.round(price).toLocaleString('en-US')}`,
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#E2B56D',
      lineWidth: 3,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: '#E2B56D',
      crosshairMarkerBackgroundColor: '#000000',
      priceLineVisible: false,
      lastValueVisible: true,
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
    });

    const data = generateData(timeframe, pricePerGram);
    lineSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
      chart.timeScale().fitContent();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timeframe, pricePerGram]);

  const stats = [
    {
      label: 'Өнөөдрийн ханш (1гр)',
      value: loading ? '...' : `₮${formatMNT(pricePerGram)}`,
      helper: 'Монголбанкны ханш · 1гр',
      color: 'text-white',
    },
    {
      label: '24 цаг',
      value: fmtPct(change24h),
      helper: change24h === null
        ? 'Дараагийн зочлолтоор харагдана'
        : 'Сүүлийн өдрийн өөрчлөлт',
      color: pctColor(change24h),
    },
    {
      label: '7 хоног',
      value: fmtPct(change7d),
      helper: change7d === null
        ? 'Долоо хоногийн дараа харагдана'
        : 'Долоо хоногийн өсөлт',
      color: pctColor(change7d),
    },
    {
      label: 'Тогтвортой байдал',
      value: stability.label,
      helper: stability.helper,
      color: stability.color,
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 text-left text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-1/3 h-[520px] w-[520px] rounded-full bg-[#E2B56D]/5 blur-[140px]" />
        <div className="absolute bottom-0 right-[-120px] h-[460px] w-[460px] rounded-full bg-[#E2B56D]/4 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 w-full max-w-3xl text-left">
          <div className="mb-4 flex items-center justify-start gap-3">
            <div className="h-px w-10 bg-[#E2B56D]" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#E2B56D]">
              Монголбанкны өдрийн ханш
            </span>
          </div>

          <h2 className="text-left text-4xl font-semibold tracking-tight text-white md:text-5xl">
            АЛТНЫ ЗАХ ЗЭЭЛИЙН{' '}
            <span className="gold-shimmer">ХӨДӨЛГӨӨН</span>
          </h2>

          <p className="mt-5 max-w-xl text-left text-base leading-relaxed text-white/55">
            Алтны ханшийн хөдөлгөөнийг ойлгомжтойгоор харуулж, хөрөнгө
            оруулалтын шийдвэр гаргахад тусална.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[62%_38%] lg:gap-10">
          {/* LEFT — CHART */}
          <div className="relative">
            <div
              className="
                relative overflow-hidden rounded-[2rem]
                border border-white/8 bg-white/[0.025]
                p-4 backdrop-blur-sm
                shadow-[0_24px_80px_rgba(0,0,0,0.45)]
                sm:p-5
              "
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#E2B56D]/8 blur-[90px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.035] via-transparent to-[#E2B56D]/[0.035]" />
              </div>

              {/* Chart top bar */}
              <div className="relative z-10 mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                    АЛТНЫ ХАНШ (MNT/гр)
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-3xl font-semibold tracking-tight text-white">
                      {loading ? (
                        <span className="animate-pulse text-white/40">₮ —</span>
                      ) : (
                        `₮${formatMNT(pricePerGram)}`
                      )}
                    </p>
                    {!loading && change24h !== null && (
                      <p className={`text-sm font-medium ${pctColor(change24h)}`}>
                        {fmtPct(change24h)}
                      </p>
                    )}
                  </div>
                </div>

                {/* TIMEFRAME */}
                <div className="flex flex-wrap gap-2">
                  {timeframes.map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`
                        rounded-full px-3 py-1.5 text-xs font-medium
                        transition-all duration-300
                        ${
                          timeframe === t
                            ? 'bg-[#E2B56D] text-black shadow-[0_0_18px_rgba(226,181,109,0.25)]'
                            : 'border border-white/8 bg-white/[0.03] text-white/45 hover:border-[#E2B56D]/35 hover:text-white'
                        }
                      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHART */}
              <div className="relative z-10 overflow-hidden rounded-2xl border border-white/5 bg-black/35">
                <div ref={chartRef} className="h-[420px] w-full" />
              </div>

              <div className="relative z-10 mt-4 flex flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-white/35">
                  {source === 'mongolbank'
                    ? 'Монголбанкны алт авах ханш (₮/гр)'
                    : source === 'monxansh'
                    ? 'Монхансын XAU/MNT ханш — Монголбанкны API-тай холбогдож байна'
                    : 'Хуучин ханш — шинэ өгөгдөл татаж чадсангүй'}
                  {rateDate && (
                    <span className="ml-1 text-white/22">· {rateDate}</span>
                  )}
                </p>

                <a
                  href="https://www.mongolbank.mn/mn/gold-and-silver-price"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 w-fit rounded-full border border-[#E2B56D]/20 bg-[#E2B56D]/5 px-3 py-1 text-xs leading-none text-[#E2B56D]/80 transition hover:bg-[#E2B56D]/10"
                >
                  {source === 'mongolbank' ? '✓ Монголбанк' : 'Монголбанк'}
                </a>
              </div>

              {/* API source warning — only shown when falling back to monxansh */}
              {error && source === 'monxansh' && (
                <div className="relative z-10 mt-2 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-2 text-left text-xs text-amber-400/70">
                  ⚠ {error}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — STATS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((item, i) => (
              <div
                key={i}
                className="
                  group relative overflow-hidden rounded-3xl
                  border border-white/8 bg-white/[0.025]
                  p-6 text-left backdrop-blur-sm
                  transition-all duration-500
                  hover:border-[#E2B56D]/30 hover:bg-white/[0.04]
                "
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[#E2B56D]/10 to-transparent blur-3xl" />
                </div>

                <div className="relative z-10">
                  <p className="mb-2 text-left text-xs font-medium uppercase tracking-widest text-white/40">
                    {item.label}
                  </p>

                  <p className={`text-left text-3xl font-semibold ${item.color}`}>
                    {item.value}
                  </p>

                  <p className="mt-2 text-left text-sm leading-relaxed text-white/35">
                    {item.helper}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust note */}
        <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.02] p-5 text-left">
          <p className="text-sm leading-relaxed text-white/45">
            Ханшийн мэдээлэл{' '}
            <a
              href="https://www.mongolbank.mn/en/gold-and-silver-price"
              target="_blank"
              rel="noreferrer"
              className="text-[#E2B56D]/70 underline-offset-2 hover:text-[#E2B56D] hover:underline"
            >
              Монголбанкны
            </a>{' '}
            алт авах өдрийн ханшид суурилна. 24 цаг болон 7 хоногийн
            өөрчлөлтийг Монголбанкны өдөр тутмын ханшаас шууд тооцоолно.
          </p>
        </div>
      </div>
    </section>
  );
};
