import { motion } from 'motion/react';
import React from 'react';
import bgDecor from '../../assets/images/background.svg';
import { useGoldRate } from '../../hooks/useGoldRate';

const growthRates = {
  1: 0.08,
  3: 0.26,
  5: 0.45,
};

const bars = [1, 2.5, 5, 10, 20, 31.1, 50, 100];

const format = (n: number) => n.toLocaleString('en-US');

export const Calculator = () => {
  const { pricePerGram, rateDate, loading } = useGoldRate();

  const [amount, setAmount] = React.useState(10000000);

  const gramsNow = pricePerGram > 0 ? amount / pricePerGram : 0;

  const future = (y: 1 | 3 | 5) => {
    const total = amount * (1 + growthRates[y]);
    return {
      total,
      profit: total - amount,
    };
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-black px-6 py-16 text-left text-white lg:py-20"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[#E2B56D]/5 blur-[130px]" />
        <div className="absolute left-[-160px] top-1/3 h-[460px] w-[460px] rounded-full bg-[#E2B56D]/4 blur-[140px]" />
        {/* Background SVG decoration */}
        <img
          src={bgDecor}
          alt=""
          className="absolute -bottom-16 -right-16 w-[480px] opacity-[0.07] pointer-events-none select-none"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.div
          className="mb-14 w-full max-w-2xl text-left lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-4 flex items-center justify-start gap-3">
            <div className="h-px w-10 bg-[#E2B56D]" />
            <span className="text-left text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
              Хөрөнгө оруулалт
            </span>
          </div>

          <h2 className="text-left text-4xl font-semibold tracking-tight text-white md:text-5xl">
            ТООЦООЛУУР
          </h2>

          <p className="mt-5 max-w-xl text-left text-base leading-relaxed text-white/55">
            Оруулах дүнгээ сонгоод өнөөдрийн ханшаар ойролцоогоор хэдэн грамм алт
            авах боломжтой болон ирээдүйн боломжит өсөлтийг харна уу.
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[48%_52%]">
          {/* LEFT — INPUT CARD */}
          <motion.div
            className="
              relative overflow-hidden rounded-[2rem]
              border border-white/8 bg-white/[0.025]
              p-6 text-left backdrop-blur-sm
              shadow-[0_24px_80px_rgba(0,0,0,0.35)]
              sm:p-8
            "
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#E2B56D]/8 blur-[90px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.035] via-transparent to-[#E2B56D]/[0.035]" />
            </div>

            <div className="relative z-10 space-y-7 text-left">
              {/* Amount input */}
              <div className="text-left">
                <p className="mb-2 text-left text-sm tracking-wide text-white/50">
                  Хөрөнгө оруулах дүн
                </p>

                <div className="relative">
                  <input
                    value={format(amount)}
                    onChange={e =>
                      setAmount(Number(e.target.value.replace(/,/g, '')) || 0)
                    }
                    className="
                      w-full rounded-2xl border border-white/10
                      bg-black/45 px-5 py-4 pr-10
                      text-left text-2xl font-semibold text-white
                      transition-colors
                      placeholder:text-white/25
                      focus:border-[#E2B56D]/50 focus:outline-none
                    "
                  />

                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm text-white/35">
                    ₮
                  </span>
                </div>
              </div>

              {/* Slider */}
              <div className="text-left">
                <input
                  type="range"
                  min={100000}
                  max={100000000}
                  step={100000}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="slider-gold w-full"
                />

                <div className="mt-3 flex items-center justify-between text-xs text-white/30">
                  <span>₮100,000</span>
                  <span>₮100,000,000</span>
                </div>
              </div>

              {/* Gold result highlight */}
              <div className="rounded-3xl border border-[#E2B56D]/20 bg-gradient-to-br from-[#E2B56D]/12 via-white/[0.025] to-transparent p-5 text-left">
                <p className="mb-3 text-left text-sm text-white/50">
                  {today}-ний ханшаар худалдан авах алт
                </p>

                <p className="bg-gradient-to-r from-[#E0B165] via-[#FFD700] to-[#E0B165] bg-clip-text text-left text-5xl font-bold tracking-tight text-transparent">
                  {loading ? (
                    <span className="animate-pulse text-white/30 text-3xl">
                      тооцоолж байна...
                    </span>
                  ) : (
                    <>
                      {gramsNow.toFixed(2)}
                      <span className="ml-2 text-2xl text-[#E2B56D]">гр</span>
                    </>
                  )}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-left text-xs leading-relaxed text-white/35">
                    {loading
                      ? 'Монголбанкны ханш татаж байна...'
                      : `1гр = ₮${format(pricePerGram)}`}
                  </p>
                  {!loading && (
                    <a
                      href="https://www.mongolbank.mn/en/gold-and-silver-price"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center rounded-full border border-[#E2B56D]/20 bg-[#E2B56D]/5 px-2.5 py-1.5 text-xs leading-none text-[#E2B56D]/70 transition hover:bg-[#E2B56D]/10"
                    >
                      Монголбанк{rateDate ? ` · ${rateDate}` : ''}
                    </a>
                  )}
                </div>
              </div>

              {/* Bar selector */}
              <div className="text-left">
                <p className="mb-3 text-left text-xs uppercase tracking-widest text-white/40">
                  FGN алтан гулдмайн сонголтууд
                </p>

                <div className="flex flex-wrap justify-start gap-2">
                  {bars.map(b => {
                    const canBuy = gramsNow >= b;

                    return (
                      <div
                        key={b}
                        className={`
                          rounded-full border px-3 py-1.5 text-xs font-medium
                          transition-all duration-300
                          ${
                            canBuy
                              ? 'border-[#E2B56D]/60 bg-[#E2B56D]/8 text-[#E2B56D] shadow-[0_0_14px_rgba(226,181,109,0.12)]'
                              : 'border-white/8 bg-transparent text-white/25'
                          }
                        `}
                      >
                        {b === 31.1 ? '1 унц' : `${b}гр`}
                      </div>
                    );
                  })}
                </div>

                <p className="mt-3 text-left text-xs text-white/25">
                  999.9 сорьц · ISO баталгаатай
                </p>

                {/* Gold bar lineup image — balanced size + hover zoom */}
                <motion.div
                  className="
                    group relative mt-6 overflow-hidden rounded-3xl
                    border border-white/8 bg-black/35
                    transition-all duration-500
                    hover:border-[#E2B56D]/35
                    hover:bg-black/45
                    hover:shadow-[0_24px_80px_rgba(226,181,109,0.10)]
                  "
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E2B56D]/12 blur-[95px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E2B56D]/8 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#E2B56D]/7 to-transparent" />
                  </div>

                  <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                    <img
                      src="/images/gold-bars-lineup.png"
                      alt="FGN алтан гулдмайн сонголтууд"
                      className="
                        relative z-10 h-full w-full object-contain
                        px-3 py-5 opacity-100
                        scale-[1.06]
                        drop-shadow-[0_24px_60px_rgba(226,181,109,0.20)]
                        transition-transform duration-700 ease-out
                        group-hover:scale-[1.16]
                      "
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — RESULTS */}
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            {/* Future returns */}
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.025] p-6 text-left backdrop-blur-sm sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="text-left">
                  <p className="text-left text-xs font-medium uppercase tracking-widest text-[#E2B56D]">
                    Ирээдүйн боломжит өгөөж
                  </p>

                  <p className="mt-2 max-w-sm text-left text-sm leading-relaxed text-white/40">
                    Өнгөрсөн хугацаан дахь алтны ханшийн өөрчлөлтөд суурилсан{' '}
                    <span className="font-medium text-[#E2B56D]">
                      төсөөллийн дүн
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[1, 3, 5].map(y => {
                  const f = future(y as 1 | 3 | 5);
                  const pct = (growthRates[y as 1 | 3 | 5] * 100).toFixed(0);

                  return (
                    <div
                      key={y}
                      className="
                        flex items-center justify-between gap-4
                        rounded-2xl border border-white/6 bg-black/25
                        px-4 py-4 text-left
                      "
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E2B56D]/30 bg-[#E2B56D]/8 text-xs font-bold text-[#E2B56D]">
                          {y}ж
                        </div>

                        <div className="text-left">
                          <p className="text-left text-sm font-medium text-white/70">
                            {y} жил
                          </p>
                          <p className="text-left text-xs text-white/32">
                            ~+{pct}%
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-semibold text-white">
                          {format(Math.round(f.total))}₮
                        </p>
                        <p className="text-xs text-[#E2B56D]">
                          +{format(Math.round(f.profit))}₮
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-left text-xs leading-relaxed text-white/30">
                Эх сурвалж:{' '}
                <a
                  href="https://www.gold.org/goldhub/data/gold-returns"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E2B56D]/80 underline-offset-4 transition hover:text-[#F5D7A1] hover:underline"
                >
                  World Gold Council Gold Returns
                </a>
                {' · '}
                <a
                  href="https://www.gold.org/goldhub/data/gold-prices"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E2B56D]/80 underline-offset-4 transition hover:text-[#F5D7A1] hover:underline"
                >
                  Gold Price Data
                </a>
              </p>
            </div>

            {/* Trust badge */}
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.025] p-6 text-left backdrop-blur-sm sm:p-7">
              <p className="mb-5 text-left text-xs font-medium uppercase tracking-widest text-[#E2B56D]">
                Баталгаа & Аюулгүй байдал
              </p>

              <div className="space-y-3">
                {[
                  {
                    label: 'ISO 9001 · 14001 · 45001',
                    desc: 'Олон улсын чанарын стандарт',
                  },
                  {
                    label: 'Бүрэн даатгагдсан алт',
                    desc: 'Давхар даатгагдсан хадгалалт',
                  },
                  {
                    label: '999.9 сорьц',
                    desc: 'Олон улсын стандарт алт',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-white/6 bg-black/25 px-4 py-4 text-left"
                  >
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2B56D] shadow-[0_0_8px_rgba(226,181,109,0.45)]" />

                    <div className="text-left">
                      <p className="text-left text-sm font-medium text-white">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-left text-xs text-white/45">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* TRUST CARDS */}
        <motion.div
          className="mt-6 grid gap-4 md:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {[
            {
              label: 'Биет эзэмшил',
              text: 'Fine Gold Nation showroom эсвэл FGN Алтны ATM-ээс алтан гулдмайг биет хэлбэрээр худалдан авч, эзэмших, хадгалах, бэлэглэх боломжтой.',
            },
            {
              label: 'Дижитал хадгалалт',
              text: 'FGN аппаар худалдан авсан таны алт хадгалалтын өрөөнд биетээр байршиж хадгалагдана. Та хөрөнгөө хүссэн үедээ гар утаснаасаа удирдах боломжтой.',
              note: 'ОУ стандарт · 100% аюулгүй · Даатгагдсан',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="
                rounded-[2rem] border border-white/8 bg-white/[0.025]
                p-6 text-left backdrop-blur-sm
                transition-all duration-300
                hover:border-[#E2B56D]/25 hover:bg-white/[0.035]
                sm:p-7
              "
            >
              <p className="mb-3 text-left text-xs font-medium uppercase tracking-widest text-[#E2B56D]">
                {card.label}
              </p>

              <p className="text-left text-sm leading-relaxed text-white/60">
                {card.text}
              </p>

              {card.note && (
                <p className="mt-3 text-left text-xs text-white/25">
                  {card.note}
                </p>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
