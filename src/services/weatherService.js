import { mockGeneralWeather, mockPlants } from '../data/mockData';

const ENV_API_URL = import.meta.env.VITE_API_URL || '';
const VERCEL_BACKEND_URLS = (import.meta.env.VITE_VERCEL_BACKEND_URLS || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);
const LOCAL_BACKEND_URL = (import.meta.env.VITE_LOCAL_BACKEND_URL || '').trim().replace(/\/$/, '');
const BACKEND_API_KEY = (import.meta.env.VITE_BACKEND_API_KEY || '').trim();

/**
 * Monta a lista de URLs do Backend a partir das variáveis de ambiente (.env / Vercel),
 * priorizando o ambiente local em localhost e as URLs de produção quando publicado.
 */
function getCandidateBackendUrls() {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const urls = [];
  if (ENV_API_URL) {
    urls.push(ENV_API_URL.trim().replace(/\/$/, ''));
  }

  if (isLocalhost) {
    if (LOCAL_BACKEND_URL) urls.push(LOCAL_BACKEND_URL);
    urls.push(...VERCEL_BACKEND_URLS);
  } else {
    urls.push(...VERCEL_BACKEND_URLS);
    if (LOCAL_BACKEND_URL) urls.push(LOCAL_BACKEND_URL);
  }

  return [...new Set(urls.filter(Boolean))];
}

/**
 * Busca dados dinâmicos do dashboard a partir da API do Backend configurada nas variáveis de ambiente.
 * Envia o cabeçalho X-API-Key quando VITE_BACKEND_API_KEY estiver configurado.
 */
export async function fetchDashboardData() {
  const candidates = getCandidateBackendUrls();
  const headers = BACKEND_API_KEY ? { 'X-API-Key': BACKEND_API_KEY } : {};

  for (const baseUrl of candidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(`${baseUrl}/api/weather/dashboard`, {
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const json = await response.json();
      if (json.success && json.generalWeather && json.plants) {
        return {
          isLive: true,
          source: json.source || 'api',
          weather: json.generalWeather,
          plants: json.plants
        };
      }
    } catch (err) {
      // Tenta a próxima URL candidata configurada no ambiente
    }
  }

  console.warn('[INFO] Backend indisponível ou variáveis de ambiente não definidas. Utilizando mockData de contingência.');
  return {
    isLive: false,
    source: 'mockData',
    weather: mockGeneralWeather,
    plants: mockPlants
  };
}
