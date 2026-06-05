import { motion } from 'motion/react';
import { useState } from 'react';
import logo from '../assets/images/logo.svg';
import { NEWS, type NewsArticle } from '../data/news';

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconExternal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' });

// ─── NEWS CARD ────────────────────────────────────────────────────────────────
const NewsCard = ({ article, onClick }: { article: NewsArticle; onClick: () => void }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="cursor-pointer rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden hover:border-[#E2B56D]/30 transition-all duration-300 group"
  >
    {/* Cover */}
    <div className="relative h-52 bg-white/[0.03] overflow-hidden">
      <img
        src={article.coverImage}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[#E2B56D] border border-[#E2B56D]/20">
        {article.category}
      </span>
    </div>

    {/* Body */}
    <div className="p-5">
      <div className="flex items-center gap-1.5 text-white/35 text-xs mb-3">
        <IconCalendar />
        {formatDate(article.date)}
      </div>
      <h3 className="text-white font-semibold text-base leading-snug group-hover:text-[#F5D7A1] transition-colors duration-200 line-clamp-2">
        {article.title}
      </h3>
      <p className="text-white/45 text-sm mt-2 leading-relaxed line-clamp-3">
        {article.summary}
      </p>
      <div className="flex items-center gap-1.5 mt-4 text-[#E2B56D] text-sm font-medium">
        Дэлгэрэнгүй <IconArrowRight />
      </div>
    </div>
  </motion.div>
);

// ─── ARTICLE DETAIL ───────────────────────────────────────────────────────────
const ArticleDetail = ({ article, onBack }: { article: NewsArticle; onBack: () => void }) => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto px-6 lg:px-8 py-8"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm mb-8"
      >
        <IconArrowLeft /> Буцах
      </button>

      {/* Category + date */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-[#E2B56D]/30 text-[#E2B56D]">
          {article.category}
        </span>
        <span className="flex items-center gap-1.5 text-white/35 text-xs">
          <IconCalendar /> {formatDate(article.date)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-white leading-snug mb-6">
        {article.title}
      </h1>

      {/* Main image */}
      {article.images.length > 0 && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-white/8">
          <img
            src={article.images[activeImg]}
            alt={article.title}
            className="w-full object-cover max-h-[480px]"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Thumbnail strip */}
      {article.images.length > 1 && (
        <div className="flex gap-2 mb-8">
          {article.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                activeImg === i ? 'border-[#E2B56D]/60' : 'border-white/10 opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-20 h-14 object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </button>
          ))}
        </div>
      )}

      {/* Body text */}
      <div className="space-y-4 mb-8">
        {article.body.split('\n\n').map((para, i) => (
          para.trim() ? (
            <p key={i} className={`leading-relaxed ${
              i === 0 ? 'text-white font-semibold text-lg' : 'text-white/65 text-base'
            }`}>
              {para.trim()}
            </p>
          ) : null
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {article.tags.map(tag => (
          <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40">
            #{tag}
          </span>
        ))}
      </div>

      {/* Source link */}
      {article.source && (
        <a
          href={article.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#E2B56D] hover:text-[#F5D7A1] transition-colors"
        >
          <IconExternal /> {article.source.replace('https://', '')}
        </a>
      )}
    </motion.div>
  );
};

// ─── MAIN NEWS PAGE ───────────────────────────────────────────────────────────
const CATEGORIES = [
  'Бүгд',
  'Түншлэл',
  'Зах зээлийн тойм',
  'Санхүүгийн боловсрол',
  'Танин мэдэхүй',
  'FGN Care+',
];

export const NewsPage = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filter, setFilter] = useState('Бүгд');

  const filtered = NEWS.filter(a => filter === 'Бүгд' || a.category === filter);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedArticle ? (
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
              >
                <IconArrowLeft /> Буцах
              </button>
            ) : (
              <button
                onClick={() => { window.location.hash = ''; window.scrollTo({ top: 0 }); }}
                className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
              >
                <IconArrowLeft /> Буцах
              </button>
            )}
            <div className="h-4 w-px bg-white/10" />
            <img src={logo} alt="FGN" className="h-6 w-auto object-contain" />
          </div>

          <span className="text-xs font-medium text-white/40 tracking-widest uppercase">Мэдээ & Мэдээлэл</span>

          {/* Category filters */}
          {!selectedArticle && (
            <div className="hidden sm:flex items-center gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filter === c ? 'bg-[#E2B56D] text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          {selectedArticle && <div className="w-24" />}
        </div>
      </header>

      <div className="pt-14 flex-1">
        {selectedArticle ? (
          <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
        ) : (
          <>
            {/* HERO STRIP */}
            <div className="relative overflow-hidden border-b border-white/[0.06] px-6 lg:px-8 py-10">
              <div className="absolute right-0 top-0 w-[500px] h-[180px] bg-[#E2B56D]/5 blur-[120px] pointer-events-none" />
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-px w-6 bg-[#E2B56D]" />
                    <span className="text-[#E2B56D] text-xs font-medium tracking-widest uppercase">Мэдээ мэдээлэл</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-white">Сүүлийн мэдээнүүд</h1>
                  <p className="text-white/40 text-sm mt-1">{NEWS.length} нийтлэл</p>
                </div>
              </div>
            </div>

            {/* GRID */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map(article => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      onClick={() => { setSelectedArticle(article); window.scrollTo({ top: 0 }); }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-white/25 text-sm">
                  Энэ ангилалд мэдээ алга байна
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-white/[0.05] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Fine Gold Nation ХХК</p>
          <a href="mailto:info@finegold.mn" className="text-white/20 text-xs hover:text-[#E2B56D]/60 transition-colors">
            info@finegold.mn
          </a>
        </div>
      </div>

    </div>
  );
};
