import { mockGeneralWeather, mockPlants } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Busca dados dinâmicos do dashboard a partir da API do Backend.
 * Implementa resiliência total com fallback automático para mockData.js caso a API esteja offline.
 */
export async function fetchDashboardData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/weather/dashboard`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na API (${response.status})`);
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

    throw new Error('Formato inesperado na resposta da API');
  } catch (err) {
    console.warn(`[INFO] Backend indisponível (${err.message}). Utilizando mockData de contingência.`);
    return {
      isLive: false,
      source: 'mockData',
      weather: mockGeneralWeather,
      plants: mockPlants
    };
  }
}
