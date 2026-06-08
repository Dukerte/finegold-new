import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  /**
   * MONGOLBANK GOLD API PROXY
   * ─────────────────────────────────────────────────────────────────────────
   * Mongolbank's gold price page (mongolbank.mn/mn/gold-and-silver-price) is
   * a client-rendered SPA — its actual JSON endpoint is only discoverable via
   * browser DevTools:
   *
   *   1. Open Chrome → mongolbank.mn/mn/gold-and-silver-price
   *   2. DevTools → Network tab → filter "Fetch/XHR"
   *   3. Reload the page; find the request that returns JSON with
   *      { GOLD_BUY, RATE_DATE, SILVER_BUY } fields
   *   4. Copy just the pathname (e.g. "/api/v1/goldSilver?pageSize=5")
   *   5. Paste it into VITE_MB_GOLD_PATH in .env.local
   *
   * During dev Vite proxies /mb-gold/* → mongolbank.mn/* (bypassing CORS).
   * In production you need a backend proxy (Cloudflare Worker, Vercel fn, etc.)
   * that forwards requests to Mongolbank with the correct headers.
   * ─────────────────────────────────────────────────────────────────────────
   */
  // Confirmed endpoint (discovered via Chrome DevTools on mongolbank.mn):
  //   POST /mn/gold-and-silver-price/data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  const mbGoldPath = env.VITE_MB_GOLD_PATH || '/mn/gold-and-silver-price/data';

  return {
    plugins: [react(), tailwindcss()],
    assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],

    server: {
      proxy: {
        // All requests to /mb-gold are forwarded to mongolbank.mn
        '/mb-gold': {
          target: 'https://www.mongolbank.mn',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/mb-gold/, mbGoldPath),
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && !res.headersSent) {
                res.writeHead(502);
                res.end('Mongolbank proxy error');
              }
            });
          },
        },
      },
    },
  };
});
