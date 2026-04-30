# FGN Fine Gold Nation - Алтны Үйлчилгээний Вэбсайт

## Төслийн Тайлбар

FGN Fine Gold Nation нь алтны ATM болон хадгаламжийн үйлчилгээ санал болгодог React TypeScript вэбсайт юм. Энэ төсөл нь Англи болон Монгол хэл дэмжлэгтэй, Motion анимэйшн сан ашиглан сайхан харагдах интерфейс бүтээсэн.

## Онцлог шинж чанарууд

### 🌟 Үндсэн онцлогууд

- **Хоёр хэл дэмжлэг**: Англи болон Монгол хэл
- **Анимэйшн**: Motion сан ашиглан гүйцэтгэл сайтай анимэйшн
- **Responsive дизайн**: Бүх төхөөрөмж дээр сайхан харагдах
- **SEO оптимизаци**: Хайлтын системд сайхан илрэх
- **Accessibility**: Хүндэтгэлтэй дизайн

### 🎨 Дизайн онцлогууд

- **Алтны градиент**: Профессиональ санхүүгийн үйлчилгээний харагдах байдал
- **Floating particles**: Хөдөлгөөнт элементүүд
- **Golden swirl**: Алтны эргэлт анимэйшн
- **Parallax эффект**: Гүн гүнзгий харагдах байдал

## Технологийн стек

### Frontend

- **React 19.1.1** - Үндсэн framework
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS 4.1.12** - Styling
- **Motion 12.23.12** - Анимэйшн сан
- **Vite 7.1.2** - Build tool

### Localization

- **i18next 25.4.0** - Олон хэл дэмжлэг
- **react-i18next 15.7.0** - React integration
- **i18next-browser-languagedetector 8.2.0** - Автомат хэл илрүүлэгч

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

## Суулгах заавар

### Шаардлагатай систем

- Node.js 18+
- npm эсвэл yarn

### Суулгах алхмууд

1. **Repository clone хийх**

```bash
git clone <repository-url>
cd finegold-landing
```

2. **Dependencies суулгах**

```bash
npm install
# эсвэл
yarn install
```

3. **Development server эхлүүлэх**

```bash
npm run dev
# эсвэл
yarn dev
```

4. **Browser дээр нээх**

```
http://localhost:5173
```

## Build хийх заавар

### Development build

```bash
npm run build
npm run preview
```

### Production build

```bash
npm run build
```

## Төслийн бүтэц

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── GlobalLoading.tsx  # Single global loading indicator
│   │   ├── LoadingExample.tsx # Example usage of loading system
│   │   └── ...
│   ├── layout/          # Layout components
│   └── sections/        # Page sections
├── hooks/               # Custom React hooks
│   ├── useLoading.ts        # Easy loading management
│   └── ...
├── locales/             # Translation files
│   ├── en/
│   └── mn/
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── animations/          # Animation configurations
└── assets/              # Images, fonts, etc.
```

## Loading System

The app uses a **single global loading indicator** instead of multiple individual spinners:

### Global Loading Component

- **Single loading spinner** for the entire app
- **No progress bars** or multiple loading states
- **Simple global state management** without complex context
- **Easy to use** with simple hook functions

### Usage Examples

```typescript
import { useLoading } from './hooks/useLoading';

const MyComponent = () => {
  const { showLoading, hideLoading, withLoading } = useLoading();

  // Show loading manually
  const handleClick = () => {
    showLoading('Processing...');
    // Do something
    hideLoading();
  };

  // Wrap async function with loading
  const handleAsync = async () => {
    await withLoading(
      async () => {
        // Async operation
        await someAsyncFunction();
      },
      'Loading data...'
    );
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

### Benefits

- **Cleaner UI** with no multiple spinners
- **Better UX** with consistent loading experience
- **Easier maintenance** with centralized loading logic
- **Performance** improvement by reducing unnecessary animations
- **Simple implementation** without complex React context

## Компонентууд

### Layout Components

- **Header.tsx** - Дээд хэсгийн цэс
- **Footer.tsx** - Доод хэсгийн мэдээлэл
- **Container.tsx** - Контент хязгаарлагч
- **Section.tsx** - Хэсгийн wrapper

### Common Components

- **Button.tsx** - Товчлуурын компонент
- **Card.tsx** - Карт компонент
- **Input.tsx** - Input талбар
- **LanguageSwitcher.tsx** - Хэл сонгогч
- **FloatingParticles.tsx** - Хөдөлгөөнт хэсгүүд
- **GoldenSwirl.tsx** - Алтны эргэлт

### Section Components

- **HeroSection.tsx** - Үндсэн хэсэг
- **FeaturesSection.tsx** - Онцлогуудын хэсэг
- **FaqSection.tsx** - Түгээмэл асуултууд

## Анимэйшн систем

### Variants

- **fadeIn** - Алга болох анимэйшн
- **slideUp** - Дээш гүйлгэх
- **slideInLeft/Right** - Зүүн/баруун талаас гүйлгэх
- **scaleIn** - Томруулах
- **staggerContainer** - Дараалан харагдах
- **floating** - Хөвөх анимэйшн
- **parallax** - Parallax эффект

### Hover Effects

- **buttonHover** - Товчлуурын hover
- **cardHover** - Картын hover
- **arrowHover** - Сумны hover

## Localization систем

### Орчуулгын файлууд

- `src/locales/en/translation.json` - Англи хэл
- `src/locales/mn/translation.json` - Монгол хэл

### Хэрэглээ

```typescript
import { useLocalization } from '../hooks/useLocalization';

const { t, isMongolian } = useLocalization();
const title = t('hero.title');
```

## Хөгжүүлэлтийн заавар

### Code Style

- **TypeScript** ашиглах
- **Functional components** ашиглах
- **Tailwind CSS** ашиглах
- **Motion** анимэйшн ашиглах

### File naming

- **Components**: PascalCase (Header.tsx)
- **Utilities**: camelCase (useLocalization.ts)
- **Constants**: UPPER_SNAKE_CASE

### Performance

- **Lazy loading** ашиглах
- **React.memo** ашиглах
- **Image optimization** хийх

## Scripts

```json
{
  "dev": "vite", // Development server
  "build": "tsc -b && vite build", // Production build
  "lint": "eslint .", // Code linting
  "lint:fix": "eslint . --fix", // Auto fix linting
  "format": "prettier --write .", // Code formatting
  "preview": "vite preview" // Preview build
}
```

## Environment Variables

```env
VITE_APP_TITLE=FGN Fine Gold Nation
VITE_APP_VERSION=1.0.0
```

## Deployment

### Vercel дээр deploy хийх

1. Vercel account үүсгэх
2. GitHub repository холбох
3. Build settings тохируулах
4. Deploy хийх

### Netlify дээр deploy хийх

1. Netlify account үүсгэх
2. GitHub repository холбох
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy хийх

## Хөгжүүлэгчид

Энэ төслийг FGN Fine Gold Nation баг хөгжүүлсэн.

## License

MIT License - Дэлгэрэнгүй мэдээллийг LICENSE файлаас харна уу.

## Холбоо барих

Асуулт, санал болголт байвал issue үүсгэх эсвэл холбоо барих:

- Email: info@finegoldnation.com
- Website: https://finegoldnation.com

---

**FGN Fine Gold Nation** - Үе дамжих үнэт өв
