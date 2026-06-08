import React, { memo, useState } from 'react';
import logo from '../../assets/images/logo.svg';
import { TermsModal } from '../common/TermsModal';

export const Footer: React.FC = memo(() => {
  const currentYear = new Date().getFullYear();
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer id="contact" className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12 items-start">

        {/* LEFT */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img src={logo} className="w-16 h-16 object-contain" />
            <div>
              <h3 className="text-white text-left font-semibold text-lg">
                FINE GOLD NATION
              </h3>
              <p className="text-white/50 text-sm">
                ISO Certified Gold Platform
              </p>
            </div>
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap gap-3 max-w-sm mt-2">
            {[
              '999.9 сорьц алт',
              'ISO стандарт',
              'ATM сүлжээ дэд бүтэц',
              'Дижитал экосистем',
            ].map((tag, i) => (
              <div
                key={i}
                className="text-xs px-4 py-2 rounded-full border border-white/10 text-white/70 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#E2B56D] hover:text-white hover:bg-white/[0.05] hover:scale-105"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER (QR + STORES) */}
        <div className="flex items-center justify-left gap-6">
          <div className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-[#E2B56D] transition">
            <img src="/images/qr-app.png" className="w-28 h-28 object-contain" />
          </div>
          <div className="flex flex-col gap-4">
            <a href="#">
              <img src="/images/appstore.png" className="h-12 object-contain hover:scale-105 transition" />
            </a>
            <a href="#">
              <img src="/images/googleplay.png" className="h-12 object-contain hover:scale-105 transition" />
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col text-left text-white/80 text-sm max-w-xs">

          {/*
            min-height: 44px is set globally on all <a> elements (touch-target rule in index.css).
            Override it here with minHeight:'unset' so these small nav links
            don't balloon to 44px each and create huge gaps.
          */}
          <div className="flex flex-col gap-1.5">
            <a
              href="#/about"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
              className="leading-snug text-[#E2B56D] font-medium hover:opacity-75 transition-opacity duration-200"
            >
              Бидний тухай
            </a>
            <a
              href="#/medee"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
              className="leading-snug text-white/70 hover:text-white transition-colors duration-200"
            >
              Мэдээ | Мэдээлэл
            </a>
            <a
              href="#/atm"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
              className="leading-snug text-white/70 hover:text-white transition-colors duration-200"
            >
              ATM байршил харах
            </a>
          </div>

          <div className="flex flex-col gap-1.5 mt-5">
            <p className="leading-snug text-[#E2B56D] font-medium">Холбоо барих | Бүртгүүлэх</p>
            <a
              href="mailto:info@finegold.mn"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
              className="leading-snug text-white/70 hover:text-white transition-colors duration-200"
            >
              info@finegold.mn
            </a>
            <p className="leading-snug text-white/70 hover:text-white transition-colors duration-200 cursor-pointer">@finegoldnation</p>
            <a
              href="tel:+97677999999"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
              className="leading-snug text-white/70 hover:text-white transition-colors duration-200"
            >
              +976 7799 9999
            </a>
          </div>

          {/* SOCIAL */}
          <div className="flex gap-1 mt-6">
            {['facebook.png', 'messenger.png', 'instagram.png', 'youtube.png', 'whatsapp.png'].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#E2B56D] hover:scale-110 transition"
              >
                <img src={`/images/${icon}`} className="w-5 h-5" />
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 py-6 text-center text-white/40 text-sm space-y-2">
        <p>© {currentYear} Fine Gold Nation</p>
        <button
          onClick={() => setShowTerms(true)}
          className="hover:text-[#E2B56D] transition-colors cursor-pointer underline-offset-4 hover:underline"
        >
          Үйлчилгээний нөхцөл
        </button>
      </div>

      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </footer>
  );
});

Footer.displayName = 'Footer';
