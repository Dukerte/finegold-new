import { AnimatePresence, motion } from 'motion/react';
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
const IconShare = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const IconTrend = ({ up }: { up: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {up
      ? <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>
      : <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>
    }
  </svg>
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' });

const formatMNT = (n: number) => `₮${n.toLocaleString('en-US')}`;

const pctColor = (v?: number) => {
  if (v === undefined || v === null) return 'text-white/40';
  return v >= 0 ? 'text-emerald-400' : 'text-red-400';
};
const pctSign = (v: number) => (v >= 0 ? '+' : '') + v.toFixed(2) + '%';

const outlookLabel = (o?: string) => {
  if (o === 'bullish') return { text: 'Дээшлэх хандлага', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/8' };
  if (o === 'bearish') return { text: 'Доошлох хандлага', color: 'text-red-400 border-red-400/30 bg-red-400/8' };
  return { text: 'Тэнцвэрт байдал', color: 'text-amber-300 border-amber-300/30 bg-amber-300/8' };
};

const articleUrl = (slug: string) =>
  `${window.location.origin}/#/medee/${slug}`;

// ─── GOLD STATS WIDGET ────────────────────────────────────────────────────────
const GoldStatsWidget = ({ stats }: { stats: NonNullable<NewsArticle['goldStats']> }) => {
  const outlook = outlookLabel(stats.outlook);
  return (
    <div className="rounded-2xl border border-[#E2B56D]/20 bg-[#E2B56D]/[0.04] p-5 mb-6">
      {/* Price row */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Монголбанкны ханш (₮/гр)</p>
          <p className="text-3xl font-bold text-white tracking-tight">{formatMNT(stats.pricePerGram)}</p>
        </div>
        {stats.outlook && (
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${outlook.color}`}>
            {outlook.text}
          </span>
        )}
      </div>

      {/* Change grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.change24h !== undefined && (
          <div className="rounded-xl border border-white/8 bg-black/20 p-3 text-center">
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">24 цаг</p>
            <div className={`flex items-center justify-center gap-1 font-semibold text-sm ${pctColor(stats.change24h)}`}>
              <IconTrend up={stats.change24h >= 0} />
              {pctSign(stats.change24h)}
            </div>
          </div>
        )}
        {stats.change7d !== undefined && (
          <div className="rounded-xl border border-white/8 bg-black/20 p-3 text-center">
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">7 хоног</p>
            <div className={`flex items-center justify-center gap-1 font-semibold text-sm ${pctColor(stats.change7d)}`}>
              <IconTrend up={stats.change7d >= 0} />
              {pctSign(stats.change7d)}
            </div>
          </div>
        )}
        {stats.changeMonth !== undefined && (
          <div className="rounded-xl border border-white/8 bg-black/20 p-3 text-center">
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">Сар</p>
            <div className={`flex items-center justify-center gap-1 font-semibold text-sm ${pctColor(stats.changeMonth)}`}>
              <IconTrend up={stats.changeMonth >= 0} />
              {pctSign(stats.changeMonth)}
            </div>
          </div>
        )}
      </div>

      {/* Week range */}
      {stats.weekHigh && stats.weekLow && (
        <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-white/40">
          <span>7 хоногийн хэлбэлзэл</span>
          <span className="text-white/60 font-medium">
            {formatMNT(stats.weekLow)} — {formatMNT(stats.weekHigh)}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── SHARE BAR ────────────────────────────────────────────────────────────────
const ShareBar = ({ article }: { article: NewsArticle }) => {
  const [copied, setCopied] = useState(false);
  const url = articleUrl(article.slug);

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400',
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 py-5 border-t border-b border-white/8 mb-6">
      <span className="text-xs text-white/35 uppercase tracking-widest mr-1 flex items-center gap-1.5">
        <IconShare /> Хуваалцах
      </span>

      <button
        onClick={shareToFacebook}
        className="
          inline-flex items-center gap-2 rounded-full
          bg-[#1877F2] px-4 py-2 text-xs font-semibold text-white
          transition-all duration-200 hover:brightness-110
          hover:shadow-[0_0_16px_rgba(24,119,242,0.4)]
        "
      >
        <IconFacebook /> Facebook-т хуваалцах
      </button>

      <button
        onClick={copyLink}
        className="
          inline-flex items-center gap-1.5 rounded-full
          border border-white/12 bg-white/[0.04]
          px-4 py-2 text-xs font-medium text-white/60
          transition-all duration-200 hover:border-white/25 hover:text-white/85
        "
      >
        <IconCopy />
        {copied ? 'Хуулагдлаа ✓' : 'Линк хуулах'}
      </button>
    </div>
  );
};

// ─── NEWS CARD ────────────────────────────────────────────────────────────────
const NewsCard = ({ article, onClick }: { article: NewsArticle; onClick: () => void }) => {
  const isGoldUpdate = article.category === 'Ханшийн Тойм';
  const stats = article.goldStats;

  if (isGoldUpdate && stats) {
    // Special gold update card — full-width with price widget
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="
          cursor-pointer col-span-full
          rounded-2xl border border-[#E2B56D]/25 bg-[#E2B56D]/[0.03]
          overflow-hidden
          hover:border-[#E2B56D]/50 hover:shadow-[0_16px_48px_rgba(226,181,109,0.08)]
          transition-all duration-300 group
        "
      >
        <div className="p-6 lg:p-7">
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#E2B56D]/15 text-[#E2B56D] border border-[#E2B56D]/25">
                  📊 Ханшийн Тойм
                </span>
                <span className="flex items-center gap-1 text-white/30 text-xs">
                  <IconCalendar /> {formatDate(article.date)}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg leading-snug group-hover:text-[#F5D7A1] transition-colors duration-200">
                {article.title}
              </h3>
            </div>
            {/* Live price badge */}
            <div className="shrink-0 text-right">
              <p className="text-2xl font-bold text-white">{formatMNT(stats.pricePerGram)}</p>
              {stats.change7d !== undefined && (
                <p className={`text-sm font-semibold flex items-center justify-end gap-1 ${pctColor(stats.change7d)}`}>
                  <IconTrend up={stats.change7d >= 0} /> {pctSign(stats.change7d)}
                  <span className="text-white/30 font-normal text-xs">/ 7 хоног</span>
                </p>
              )}
            </div>
          </div>

          {/* Changes strip */}
          <div className="flex items-center gap-3 mb-4">
            {stats.change24h !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-medium ${pctColor(stats.change24h)}`}>
                <IconTrend up={stats.change24h >= 0} />
                {pctSign(stats.change24h)} <span className="text-white/30 font-normal">24ц</span>
              </div>
            )}
            {stats.weekHigh && stats.weekLow && (
              <span className="text-xs text-white/30">
                Долоо хоногийн хэлбэлзэл: {formatMNT(stats.weekLow)} – {formatMNT(stats.weekHigh)}
              </span>
            )}
            {stats.outlook && (
              <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full border ${outlookLabel(stats.outlook).color}`}>
                {outlookLabel(stats.outlook).text}
              </span>
            )}
          </div>

          <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-4">{article.summary}</p>

          <div className="flex items-center gap-1.5 text-[#E2B56D] text-sm font-medium">
            Бүрэн шинжилгээ унших <IconArrowRight />
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular card
  return (
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
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-white/35 text-xs mb-3">
          <IconCalendar /> {formatDate(article.date)}
        </div>
        <h3 className="text-white font-semibold text-base leading-snug group-hover:text-[#F5D7A1] transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-white/45 text-sm mt-2 leading-relaxed line-clamp-3">{article.summary}</p>
        <div className="flex items-center gap-1.5 mt-4 text-[#E2B56D] text-sm font-medium">
          Дэлгэрэнгүй <IconArrowRight />
        </div>
      </div>
    </motion.div>
  );
};

// ─── ARTICLE DETAIL ───────────────────────────────────────────────────────────
const ArticleDetail = ({ article, onBack }: { article: NewsArticle; onBack: () => void }) => {
  const [activeImg, setActiveImg] = useState(0);

  // Parse body: **bold** lines become section headers, \n\n = paragraph break
  const renderBody = (text: string) =>
    text.split('\n\n').filter(p => p.trim()).map((para, i) => {
      const trimmed = para.trim();
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const heading = trimmed.slice(2, -2);
        return (
          <div key={i} className="flex items-center gap-3 mt-6 mb-2">
            <div className="h-px w-6 bg-[#E2B56D]/60 shrink-0" />
            <p className="text-[#E2B56D] text-xs font-semibold uppercase tracking-widest">{heading}</p>
          </div>
        );
      }
      return (
        <p key={i} className={`text-left leading-relaxed ${i === 0 ? 'text-white font-semibold text-lg' : 'text-white/65 text-base'}`}>
          {trimmed}
        </p>
      );
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto px-6 lg:px-8 py-8 text-left"
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

      {/* Gold stats widget — shown for gold update articles */}
      {article.goldStats && <GoldStatsWidget stats={article.goldStats} />}

      {/* Share bar */}
      <ShareBar article={article} />

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
              className={`rounded-xl overflow-hidden border transition-all ${
                activeImg === i ? 'border-[#E2B56D]/60' : 'border-white/10 opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-20 h-14 object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="space-y-4 mb-8">{renderBody(article.body)}</div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {article.tags.map(tag => (
          <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40">
            #{tag}
          </span>
        ))}
      </div>

      {/* Source */}
      {article.source && (
        <a
          href={article.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#E2B56D] hover:text-[#F5D7A1] transition-colors"
        >
          Эх сурвалж →
        </a>
      )}

      {/* Bottom share bar */}
      <div className="mt-10">
        <ShareBar article={article} />
      </div>
    </motion.div>
  );
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATEGORIES = ['Бүгд', 'Ханшийн Тойм', 'Түншлэл', 'Зах зээлийн тойм', 'Санхүүгийн боловсрол', 'FGN Care+'];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export const NewsPage = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filter, setFilter] = useState('Бүгд');

  // Gold updates always first, then by date desc
  const sorted = [...NEWS].sort((a, b) => {
    if (a.category === 'Ханшийн Тойм' && b.category !== 'Ханшийн Тойм') return -1;
    if (b.category === 'Ханшийн Тойм' && a.category !== 'Ханшийн Тойм') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const filtered = sorted.filter(a => filter === 'Бүгд' || a.category === filter);

  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => selectedArticle ? setSelectedArticle(null) : (() => { window.location.hash = ''; window.scrollTo({ top: 0 }); })()}
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
            >
              <IconArrowLeft />
              {selectedArticle ? 'Буцах' : 'Нүүр хуудас'}
            </button>
            <div className="h-4 w-px bg-white/10" />
            <img src={logo} alt="FGN" className="h-6 w-auto object-contain" />
          </div>

          <span className="text-xs font-medium text-white/40 tracking-widest uppercase hidden sm:block">
            Мэдээ & Мэдээлэл
          </span>

          {/* Category filters — desktop */}
          {!selectedArticle && (
            <div className="hidden md:flex items-center gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filter === c
                      ? c === 'Ханшийн Тойм'
                        ? 'bg-[#E2B56D] text-black'
                        : 'bg-white/15 text-white'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {c === 'Ханшийн Тойм' ? '📊 ' + c : c}
                </button>
              ))}
            </div>
          )}
          {selectedArticle && <div className="w-24" />}
        </div>
      </header>

      <div className="pt-14 flex-1">
        <AnimatePresence mode="wait">
          {selectedArticle ? (
            <ArticleDetail
              key="detail"
              article={selectedArticle}
              onBack={() => setSelectedArticle(null)}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* HERO STRIP */}
              <div className="relative overflow-hidden border-b border-white/[0.06] px-6 lg:px-8 py-10">
                <div className="absolute right-0 top-0 w-[500px] h-[180px] bg-[#E2B56D]/5 blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="h-px w-6 bg-[#E2B56D]" />
                        <span className="text-[#E2B56D] text-xs font-medium tracking-widest uppercase">Мэдээ мэдээлэл</span>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-semibold text-white">Сүүлийн мэдээнүүд</h1>
                      <p className="text-white/40 text-sm mt-1">{NEWS.length} нийтлэл</p>
                    </div>
                    {/* Latest gold price badge */}
                    {(() => {
                      const latestGold = NEWS.find(a => a.goldStats);
                      if (!latestGold?.goldStats) return null;
                      return (
                        <div
                          className="hidden sm:block text-right cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openArticle(latestGold)}
                        >
                          <p className="text-xs text-white/35 uppercase tracking-widest mb-0.5">Монголбанкны ханш</p>
                          <p className="text-2xl font-bold text-white">{formatMNT(latestGold.goldStats.pricePerGram)}</p>
                          {latestGold.goldStats.change7d !== undefined && (
                            <p className={`text-sm font-medium ${pctColor(latestGold.goldStats.change7d)}`}>
                              {pctSign(latestGold.goldStats.change7d)} / 7 хоног
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Mobile category pills */}
                  <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-1">
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        onClick={() => setFilter(c)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          filter === c ? 'bg-[#E2B56D] text-black' : 'border border-white/15 text-white/50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
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
                        onClick={() => openArticle(article)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-white/25 text-sm">
                    Энэ ангилалд мэдээ алга байна
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
