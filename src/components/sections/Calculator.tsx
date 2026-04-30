import React, { useState } from 'react';
import { motion } from 'motion/react';

const GOLD_PRICE_PER_GRAM = 250000;

const growthRates = {
  1: 0.08,
  3: 0.26,
  5: 0.45,
};

const pastDiscount = {
  1: 0.92,
  3: 0.78,
  5: 0.68,
};

const bars = [1, 2.5, 5, 10, 20, 31.1, 50, 100];

const format = (n: number) => n.toLocaleString('en-US');

export const Calculator = () => {
  const [amount, setAmount] = useState(10000000);

  const gramsNow = amount / GOLD_PRICE_PER_GRAM;

  const future = (y: 1 | 3 | 5) => {
    const total = amount * (1 + growthRates[y]);
    return { total, profit: total - amount };
  };

  const past = (y: 1 | 3 | 5) => {
    const oldPrice = GOLD_PRICE_PER_GRAM * pastDiscount[y];
    const grams = amount / oldPrice;
    return {
      grams,
      extra: grams - gramsNow,
    };
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="calculator" className="bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* TITLE */}
        <h2 className="text-4xl sm:text-4xl font-bold text-center text-white/90">
          ТООЦООЛУУР
        </h2>

        {/* GRID */}
        <div className="pt-10 grid lg:grid-cols-2 gap-10">

          {/* LEFT CARD */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">

            {/* INPUT */}
            <div>
              <p className="text-white/60 rounded-2xl mb-2">
                Хөрөнгө оруулах дүн:
              </p>

              <input
                value={format(amount)}
                onChange={(e) =>
                  setAmount(Number(e.target.value.replace(/,/g, '')))
                }
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-lg"
              />
            </div>

            {/* SLIDER */}
            <input
              type="range"
              min={100000}
              max={100000000}
              step={100000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full slider-gold"
            />

            {/* GOLD RESULT */}
            <div className="text-center pt-4">
              <p className="text-white/50 rounded-2xl">
                Худалдан авах алт: 
                ({today}-ний ханшаар)
              </p>

              <p className="text-4xl font-bold text-[#E2B56D] mt-2">
                {gramsNow.toFixed(2)} гр
              </p>
            </div>

            {/* 🔥 MOVED HERE (BARS) */}
            <div className="pt-6 text-center">

              <p className="text-white/60 text-sm mb-3">
                Танд санал болгох FGN алтан гулдмайн сонголтууд:
              </p>

              <div className="pt-3 flex flex-wrap justify-center gap-3">
                {bars.map((b) => {
                  const canBuy = gramsNow >= b;
                  return (
                    <div
                      key={b}
                      className={`
                        px-4 py-2 rounded-full text-sm border
                        ${canBuy
                          ? 'border-[#E2B56D] text-[#E2B56D]'
                          : 'border-white/10 text-white/30'}
                      `}
                    >
                      {b === 31.1 ? '1 унц' : `${b}гр`}
                    </div>
                  );
                })}
              </div>

              <p className="pt-2 text-white/30 text-xs mt-3">
                FGN алтан гулдмай: 999.9 сорьц, ISO стандартаар баталгаажсан.
              </p>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* FUTURE */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-white/60 mb-4">
                Ирээдүйн боломжит өгөөж:
              </p>

              {[1, 3, 5].map((y) => {
                const f = future(y as 1 | 3 | 5);
                return (
                  <div key={y} className="flex justify-between mb-3">
                    <span>{y} жил</span>
                    <div className="text-right">
                      <p className="text-[#E2B56D]">
                        {format(f.total)}₮
                      </p>
                      <p className="text-green-400 text-xs">
                        +{format(f.profit)}₮
                      </p>
                    </div>
                  </div>
                );
              })}

            <p className="text-white/30 text-xs mt-3">
                Сүүлийн жилүүдийн дундажаар тооцоолсон таамаглалын дүн болно.
              </p>

              <p className="text-white/30 text-xs mt-3">
                Эх сурвалж: World Gold Council
              </p>
            </div>

            {/* PAST */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-white/60 mb-4">
                Хэрэв уг дүнгээр өмнө нь авсан бол:
              </p>

              {[1, 3, 5].map((y) => {
                const p = past(y as 1 | 3 | 5);
                return (
                  <div key={y} className="flex justify-between mb-3">
                    <span>{y} жилийн өмнө</span>
                    <div className="text-right">
                      <p className="text-[#E2B56D]">
                        {p.grams.toFixed(2)} гр
                      </p>
                      <p className="text-green-400 text-xs">
                        +{p.extra.toFixed(2)} гр
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* TRUST */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-[#E2B56D] rounded-2xl mb-2">
              Биет эзэмшил
            </p>
            <p className="text-white/70 text-sm">
              Fine Gold Nation showroom, эсвэл өөрт ойр байрлах FGN Алтны ATM-ээс Алтан гулдмайг биет хэлбэрээр худалдан авч,
              эзэмших, хадгалах, бэлэглэх боломжтой.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-[#E2B56D] rounded-2xl mb-2">
              Дижитал хадгалалт
            </p>
            <p className="text-white/70 text-sm">
              FGN Мобайл Апп-аар худалдан авсан таны бүртгэл дээрх хөрөнгө, FGN алт хадгалалтын өрөөнд биет хэлбэрээр мөн байршиж хадгалагдана. Та хөрөнгөө хүссэн үедээ гар утаснаасаа удирдах боломжтой. 
            </p>
            <p className="pt-2 text-white/40 text-xs mt-2">
              FGN алт хадгалалтын өрөө: ОУ стандарт, 100% аюулгүй, Даатгагдсан. 
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};