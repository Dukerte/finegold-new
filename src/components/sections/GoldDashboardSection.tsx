import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  LineSeries,
  ColorType,
  type UTCTimestamp,
} from 'lightweight-charts';

const timeframes = ['1D', '7D', '1M', '1Y', '3Y'];

export const GoldDashboardSection = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [timeframe, setTimeframe] = useState('1D');

  // Temporary realistic demo data — later replace with real API
  const generateData = (tf: string) => {
    const now = Math.floor(Date.now() / 1000);

    let points = 80;
    let step = 60;
    let trend = 1.2;
    let wave = 16;

    if (tf === '7D') {
      step = 60 * 60 * 3;
      trend = 1.5;
      wave = 22;
    }

    if (tf === '1M') {
      step = 60 * 60 * 12;
      trend = 1.7;
      wave = 28;
    }

    if (tf === '1Y') {
      step = 60 * 60 * 24 * 7;
      trend = 2.2;
      wave = 38;
    }

    if (tf === '3Y') {
      step = 60 * 60 * 24 * 30;
      trend = 3.4;
      wave = 55;
    }

    return Array.from({ length: points }).map((_, i) => ({
      time: (now - (points - i) * step) as UTCTimestamp,
      value:
        2300 +
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
    });

    const data = generateData(timeframe);
    lineSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({
        width: container.clientWidth,
      });
      chart.timeScale().fitContent();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timeframe]);

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
              Бодит цагийн өгөгдөл
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
              {/* Soft glow */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#E2B56D]/8 blur-[90px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.035] via-transparent to-[#E2B56D]/[0.035]" />
              </div>

              {/* Chart top bar */}
              <div className="relative z-10 mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                    LIVE GOLD PRICE
                  </p>
                  <div className="mt-2 flex items-end gap-3">
                    <p className="text-3xl font-semibold tracking-tight text-white">
                      $2,320
                    </p>
                    <p className="pb-1 text-sm font-medium text-[#E2B56D]">
                      +1.2%
                    </p>
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
                  XAU/USD зах зээлийн загварчилсан хөдөлгөөн.
                </p>

                <p className="inline-flex w-fit rounded-full border border-[#E2B56D]/20 bg-[#E2B56D]/5 px-3 py-1 text-xs text-[#E2B56D]/80">
                  Demo data
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — STATS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              {
                label: 'Өнөөдрийн ханш',
                value: '$2,320',
                helper: 'XAU/USD reference',
                color: 'text-white',
              },
              {
                label: '24 цаг',
                value: '+1.2%',
                helper: 'Сүүлийн өдрийн өөрчлөлт',
                color: 'text-[#E2B56D]',
              },
              {
                label: '7 хоног',
                value: '+3.8%',
                helper: 'Долоо хоногийн өсөлт',
                color: 'text-[#E2B56D]',
              },
              {
                label: 'Тогтвортой байдал',
                value: 'Өндөр',
                helper: 'Урт хугацааны хөрөнгө',
                color: 'text-white',
              },
            ].map((item, i) => (
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
            Энэхүү хэсэг нь алтны зах зээлийн хөдөлгөөнийг хэрэглэгчдэд
            ойлгомжтой харуулах зорилготой. Бодит ханшийн API холбогдсоны дараа
            үнэ болон өөрчлөлтүүд автоматаар шинэчлэгдэнэ.
          </p>
        </div>
      </div>
    </section>
  );
};