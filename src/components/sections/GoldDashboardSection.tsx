import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  LineSeries,
  ColorType,
} from 'lightweight-charts';

export const GoldDashboardSection = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [timeframe, setTimeframe] = useState('1D');

  // 🔥 Generate fake but realistic data (later replace with API)
  const generateData = (tf: string) => {
    const now = Math.floor(Date.now() / 1000);

    let points = 60;
    let step = 60;

    if (tf === '7D') step = 60 * 60 * 3;
    if (tf === '1M') step = 60 * 60 * 12;
    if (tf === '1Y') step = 60 * 60 * 24 * 7;
    if (tf === '3Y') step = 60 * 60 * 24 * 30;

    return Array.from({ length: points }).map((_, i) => ({
      time: (now - (points - i) * step) as any,
      value: 2300 + Math.sin(i / 5) * 20 + i * 1.5,
    }));
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#000' },
        textColor: '#aaa',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      width: chartRef.current.clientWidth,
      height: 420,
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.1)',
        timeVisible: true,
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#FFD700',
      lineWidth: 3,
    });

    const data = generateData(timeframe);
    lineSeries.setData(data);

    return () => chart.remove();
  }, [timeframe]);

  return (
    <section className="relative py-24 px-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90">
          АЛТНЫ ЗАХ ЗЭЭЛИЙН ХӨДӨЛГӨӨН
        </h2>

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT - CHART */}
          <div className="relative">

            {/* TIMEFRAME */}
            <div className="flex gap-3 mb-4">
              {['1D', '7D', '1M', '1Y', '3Y'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    timeframe === t
                      ? 'bg-yellow-500 text-black'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* CHART CONTAINER */}
            <div className="rounded-2xl border border-white/10 p-4 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md">
              <p className="text-xs text-white/40 mb-2">
                LIVE GOLD PRICE (XAU/USD)
              </p>

              <div ref={chartRef} />
            </div>
          </div>

          {/* RIGHT - STATS */}
          <div className="grid grid-cols-2 gap-6">

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-white/50 text-sm">Өнөөдрийн ханш</p>
              <p className="text-2xl font-semibold mt-1">$2,320</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-white/50 text-sm">24 цаг</p>
              <p className="text-2xl text-green-400 mt-1">+1.2%</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-white/50 text-sm">7 хоног</p>
              <p className="text-2xl text-yellow-400 mt-1">+3.8%</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-white/50 text-sm">Тогтвор</p>
              <p className="text-2xl mt-1">Өндөр</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};