import { useEffect } from 'react';
import logo from '../assets/images/logo.svg';

export const GiftPage = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Байгууллагын бэлэг | Fine Gold Nation';
    return () => { document.title = previous; };
  }, []);
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <header className="flex h-[76px] items-center justify-between border-b border-white/10 px-5 md:px-10">
        <a href="#" aria-label="Fine Gold Nation — Нүүр"><img src={logo} alt="Fine Gold Nation" className="h-10" /></a>
        <nav className="flex items-center gap-5 text-xs md:text-sm" aria-label="Бэлгийн хуудасны цэс">
          <a href="#" className="text-white/60 hover:text-white">← Нүүр</a>
          <a href="mailto:info@finegold.mn?subject=Байгууллагын%20бэлгийн%20багц" className="rounded-full border border-[#E2B56D]/50 px-4 py-2 text-[#E2B56D]">Үнийн санал авах</a>
        </nav>
      </header>
      <main>
        <iframe src="/gift-preview/index.html" title="Байгууллагын бэлгийн багцыг 3D орчинд үзэх" className="block h-[calc(100svh-76px)] min-h-[660px] w-full border-0 max-md:h-[1120px] max-md:min-h-0" />
        <section className="mx-auto grid max-w-7xl gap-8 border-t border-white/10 px-6 py-12 md:grid-cols-3">
          <div><p className="mb-3 text-xs tracking-widest text-[#E2B56D]">01 / ҮНЭ ЦЭНЭ</p><h2 className="text-lg font-medium">Бэлгийн гол утга — алт</h2><p className="mt-3 text-sm leading-7 text-white/55">999.9 сорьцтой 0.5 г алтан гулдмай. Сувдан цагаан карт, баталгааны хамт.</p></div>
          <div><p className="mb-3 text-xs tracking-widest text-[#E2B56D]">02 / ТАНАЙ БРЭНД</p><h2 className="text-lg font-medium">Танай байгууллагад зориулан</h2><p className="mt-3 text-sm leading-7 text-white/55">Лого, мэндчилгээ болон багцын агуулгыг хамтран тохиролцоно. 3D загварт жишээ захиалгын брэндийг харуулав.</p></div>
          <div><p className="mb-3 text-xs tracking-widest text-[#E2B56D]">03 / ХОЛБОО БАРИХ</p><h2 className="text-lg font-medium">Бэлгээ хамтдаа бүтээе</h2><p className="mt-3 text-sm leading-7 text-white/55">Тоо хэмжээ, хүргүүлэх хугацаа болон хүссэн загвараа бидэнд илгээгээрэй.</p><a className="mt-4 inline-block text-sm text-[#E2B56D]" href="mailto:info@finegold.mn">info@finegold.mn ↗</a></div>
        </section>
      </main>
    </div>
  );
};
