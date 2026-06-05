import { motion } from 'motion/react';
import React from 'react';
import { floating, imageParallax } from '../../animations/variants';
import appImage from '../../assets/images/app.png';
import { useLocalization } from '../../hooks/useLocalization';

const features = [
  {
    label: 'Биет алт хадгалалт',
    desc: 'Таны бүртгэл дэх алт биетээр хадгалагдана',
  },
  {
    label: 'ОУ стандарт даатгал',
    desc: 'Бүрэн хамгаалагдсан алт хадгалалт',
  },
  {
    label: 'Биетээр эзэмших',
    desc: 'Хүссэн үедээ биет алтаа гартаа авах',
  },
  {
    label: 'Дижитал хамгаалалт',
    desc: 'Дээд түвшний шифрлэлт, аюулгүй байдал',
  },
];

const GoldBorderButton: React.FC<{
  label: string;
  onClick?: () => void;
}> = ({ label, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="
      group relative overflow-hidden rounded-xl
      px-6 py-3
      font-display font-semibold text-white
      sm:px-7
    "
  >
    <motion.span
      className="
        absolute inset-0 rounded-xl p-[1px]
        bg-[linear-gradient(120deg,#E0B165,#FFD700,#FFF3B0,#FFD700,#E0B165)]
        bg-[length:220%_220%]
      "
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    >
      <span className="block h-full w-full rounded-xl bg-black/95" />
    </motion.span>

    <span
      className="
        pointer-events-none absolute inset-0
        translate-x-[-120%]
        bg-gradient-to-r from-transparent via-white/15 to-transparent
        transition-transform duration-700
        group-hover:translate-x-[120%]
      "
    />

    <span className="relative z-10">{label}</span>
  </motion.button>
);

export const APPFeaturesSection: React.FC = () => {
  const { t } = useLocalization();

  return (
    <section
      id="features-app"
      className="relative overflow-hidden bg-black px-6 py-16 lg:px-12 lg:py-20"
    >
      {/* Ambient glow — left side */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[#E2B56D]/6 blur-[140px]" />
        <div className="absolute right-[-160px] bottom-0 h-[320px] w-[320px] rounded-full bg-[#E2B56D]/4 blur-[120px]" />
      </div>

      {/* App image — desktop background LEFT side */}
      <motion.div
        className="absolute bottom-0 left-0 top-0 z-0 hidden w-1/2 items-center justify-start lg:flex"
        variants={imageParallax}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.img
          src={appImage}
          alt="Mobile App"
          className="h-auto max-h-[82vh] w-full object-contain object-left pl-8 opacity-95"
          variants={floating}
          animate="visible"
        />

        {/* Fade right edge */}
        <div className="absolute inset-y-0 right-0 w-56 bg-gradient-to-l from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* LEFT — mobile image only */}
          <motion.div
            className="flex justify-center lg:hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.img
              src={appImage}
              alt="Mobile App"
              className="h-auto max-h-[56vh] w-full max-w-xs object-contain"
              variants={floating}
              animate="visible"
            />
          </motion.div>

          {/* RIGHT — content */}
          <motion.div
            className="flex max-w-2xl flex-col text-left lg:col-start-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Section label */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-[#E2B56D]" />
              <span className="text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
                FGN Аппликейшн
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {t('features3.title1')}
              </h2>

              <p
                className="
                  mt-3 inline-block
                  bg-gradient-to-r from-[#FFD700] via-[#E2B56D] to-[#FFF3B0]
                  bg-[length:200%_200%]
                  bg-clip-text text-transparent
                  text-2xl font-semibold leading-snug
                  tracking-tight
                  drop-shadow-[0_0_16px_rgba(255,215,120,0.18)]
                  animate-[goldFlow_3s_ease-in-out_infinite]
                  md:text-3xl
                "
              >
                {t('features3.title2')}
              </p>
            </div>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
              {t('features3.description')}
            </p>

            {/* Feature cards */}
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className="
                    group relative overflow-hidden rounded-2xl
                    border border-white/8 bg-white/[0.018]
                    p-4
                    transition-all duration-500
                    hover:border-[#E2B56D]/28
                    hover:bg-white/[0.028]
                    hover:shadow-[0_16px_50px_rgba(0,0,0,0.4)]
                  "
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute -inset-8 bg-gradient-to-br from-[#E2B56D]/10 to-transparent blur-3xl" />
                  </div>

                  <div className="relative z-10 flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2B56D] shadow-[0_0_10px_rgba(226,181,109,0.45)]" />

                    <div>
                      <p className="text-sm font-medium text-white">
                        {f.label}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-white/42">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <GoldBorderButton
                label={t('features3.button1')}
                onClick={() =>
                  document.getElementById('features-app')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }
              />

              <motion.button
                onClick={() =>
                  document.getElementById('calculator')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className="
                  group inline-flex items-center gap-3
                  px-2 py-3
                  text-base font-medium text-white/68
                  transition-all duration-300
                  hover:text-white
                  sm:text-lg
                "
              >
                {t('features3.button2')}
                <span className="text-[#E2B56D] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>
              </motion.button>
            </div>

            {/* Premium closing line */}
            <div className="mt-12 border-t border-white/8 pt-6">
              <div className="max-w-xl text-left">
                <p className="text-xs uppercase tracking-[0.24em] text-white/32">
                  Fine Gold Nation App
                </p>

                <p className="mt-3 text-left text-sm leading-relaxed text-white/46">
                  Алт худалдан авах, хадгалах, арилжих, удирдах боломжийг нэг
                  аппликейшнд нэгтгэсэн дижитал алтны платформ.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};