// ─── NEWS DATA ────────────────────────────────────────────────────────────────
// To add a new article: copy the template at the bottom and fill in the fields.
// Images go in: public/images/news/

export interface NewsArticle {
  id: string;
  slug: string;
  category: string;
  date: string;           // e.g. '2024-03-15'
  title: string;
  summary: string;        // short teaser shown on the listing card
  coverImage: string;     // path relative to public/
  images: string[];       // all images for the article body
  body: string;           // full article text (supports \n for paragraphs)
  tags: string[];
  source?: string;        // optional external link
}

export const NEWS: NewsArticle[] = [
  {
    id: '1',
    slug: 'fgn-agis-partnership',
    category: 'Түншлэл',
    date: '2024-03-15',
    title: 'Fine Gold Nation × Агис Даатгал — Стратегийн түншлэлийн санамж бичиг байгуулав',
    summary: 'Файн Гоулд Нэйшн ХХК нь Агис Менежмент Даатгал ХХК-тай стратегийн түншлэлийн хамтын ажиллагааны санамж бичиг байгуулав. Таны алт зөвхөн үнэ цэнэтэй төдийгүй бас хамгаалагдсан.',
    coverImage: '/images/news/agis-banner.jpg',
    images: [
      '/images/news/agis-banner.jpg',
      '/images/news/agis-signing.jpg',
      '/images/news/agis-details.jpg',
    ],
    body: `Fine Gold Nation × Агис Даатгал

Файн Гоулд Нэйшн ХХК нь | Агис Менежмент Даатгал ХХК-тай Стратегийн түншлэлийн хамтын ажиллагааны санамж бичиг байгуулаа.

Энэхүү хамтын ажиллагааны хүрээнд "FGN: Fine Gold Nation" аппликейшний алтны хөрөнгө оруулалт, хадгалалт, арилжаа, системийн аюулгүй байдал түүнчлэн биет алт хадгалалтын үйлчилгээ, алтны киоск зэрэг бүтээгдэхүүн үйлчилгээнүүдэд даатгалын хамгаалалт нэвтрүүлж, хэрэглэгчдэд илүү найдвартай, аюулгүй, ил тод үйлчилгээ хүргэх нөхцөл бүрдэж байна.

Таны алт зөвхөн үнэ цэнэтэй төдийгүй бас хамгаалагдсан.`,
    tags: ['Даатгал', 'Түншлэл', 'Агис'],
    source: 'https://www.agis.mn',
  },

  {
    id: '2',
    slug: 'gold-market-weekly-review',
    category: 'Зах зээлийн тойм',
    date: '2024-06-04',
    title: 'Алтны зах зээл дараагийн их өсөлтдөө бэлтгэж байна уу?',
    summary: 'Сүүлийн нэг жилд 37%-иар түүхэн өсөлт үзүүлсэн алтны ханш энэ долоо хоногт "амсхийх" төлөвтэй байна. Уналт уу, эсвэл зах зээлийн эрүүл тогтворжилт уу?',
    coverImage: '/images/news/hansh5-1.jpg',
    images: [
      '/images/news/hansh5-1.jpg',
      '/images/news/hansh5-2.jpg',
      '/images/news/hansh5-3.jpg',
      '/images/news/hansh5-4.jpg',
      '/images/news/hansh5-5.jpg',
    ],
    body: `Алтны зах зээл дараагийн их өсөлтдөө бэлтгэж байна уу?

Сүүлийн нэг жилд 37%-иар түүхэн өсөлт үзүүлсэн алтны ханш энэ долоо хоногт бага зэргийн хэлбэлзэлтэй буюу "амсхийх" төлөвтэй байна. Энэ нь уналт уу, эсвэл зах зээлийн эрүүл тогтворжилт уу?

Одоогийн ханш, түүнд нөлөөлж буй гол хүчин зүйлс болон ухаалаг хөрөнгө оруулагчдад өгөх бидний зөвлөгөөг хүлээн авч үзээрэй.`,
    tags: ['Алтны ханш', 'Зах зээл', '7 хоногийн тойм'],
    source: 'https://www.finegold.mn',
  },

  // ─── TEMPLATE — copy & fill for next article ────────────────────────────
  // {
  //   id: '2',
  //   slug: 'article-slug-here',
  //   category: 'Мэдээ',
  //   date: '2024-06-01',
  //   title: 'Гарчиг энд',
  //   summary: 'Товч тайлбар энд...',
  //   coverImage: '/images/news/filename.jpg',
  //   images: ['/images/news/filename.jpg'],
  //   body: `Нийтлэлийн бие текст энд...`,
  //   tags: ['Tag1', 'Tag2'],
  // },
];

export const getArticleBySlug = (slug: string) =>
  NEWS.find(a => a.slug === slug);

export const getArticleById = (id: string) =>
  NEWS.find(a => a.id === id);
