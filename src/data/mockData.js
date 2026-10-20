// Mock data para o Sistema de Monitoramento Climático - Viveiro Bioterra
// Condições meteorológicas externas de referência para o viveiro em Álvares Machado/SP

export const mockGeneralWeather = {
  location: "Álvares Machado/SP (Referência externa para o Viveiro Bioterra)",
  station: "HG Brasil",
  lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  current: {
    temp: 26.5,
    tempMin: 18.0,
    tempMax: 31.0,
    humidity: 68,
    rainMm: 4.5,
    rainProbability: 60,
    condition: "Parcialmente Nublado",
    conditionIcon: "bi-cloud-sun",
    windSpeedKmH: 18,
    windDirection: "SE",
    uvIndex: 7,
    pressureHpa: 1014,
  },
  // Riscos Climáticos Gerais Monitorados (Granizo, Calor Excessivo, Precipitação Acumulada, Ventania)
  generalRisks: [
    {
      id: "risk-granizo",
      name: "Granizo",
      status: "Baixo Risco",
      level: "success",
      icon: "bi-cloud-snow",
      description: "Sem previsão de precipitação de granizo na região nas próximas 24h.",
      value: "5% de probabilidade",
    },
    {
      id: "risk-calor",
      name: "Calor Excessivo",
      status: "Atenção Moderada",
      level: "warning",
      icon: "bi-thermometer-sun",
      description: "Pico externo de 31°C previsto entre 13h e 15h. Recomenda-se atenção ao sombreamento e ventilação no viveiro.",
      value: "Máxima de 31°C hoje",
    },
    {
      id: "risk-precipitacao",
      name: "Precipitação Acumulada",
      status: "Atenção Elevada",
      level: "warning",
      icon: "bi-cloud-rain-heavy",
      description: "Acumulado externo previsto de 42mm nas próximas 48h. Atenção à drenagem e umidade ambiente.",
      value: "42 mm / 48h",
    },
    {
      id: "risk-ventania",
      name: "Ventania",
      status: "Condição Normal",
      level: "success",
      icon: "bi-wind",
      description: "Ventos externos brandos de até 22 km/h na região.",
      value: "18 km/h médio",
    },
  ],
  // Previsão para os próximos 3 dias (HG Brasil)
  forecast: [
    { day: "Hoje", weekday: "Seg", max: 31, min: 18, rainProb: 60, rainMm: 4.5, icon: "bi-cloud-sun", cond: "Sol e pancadas à tarde" },
    { day: "Amanhã", weekday: "Ter", max: 28, min: 19, rainProb: 85, rainMm: 22.0, icon: "bi-cloud-rain", cond: "Chuva moderada" },
    { day: "Quarta", weekday: "Qua", max: 25, min: 17, rainProb: 70, rainMm: 15.5, icon: "bi-cloud-drizzle", cond: "Pancadas isoladas" },
  ],
  // Previsão Horária de Aprendizado de Máquina (24h — HistGradientBoostingRegressor TU)
  mlForecast: {
    status: "success",
    is_simulated_fallback: true,
    model: {
      id: "hgb_tu_24h",
      version: "1.0.0",
      algorithm: "HistGradientBoostingRegressor",
      feature_set: "TU",
      history_hours: 24,
      forecast_hours: 24,
      targets: ["temperature_c", "humidity_pct"]
    },
    forecast: Array.from({ length: 24 }, (_, idx) => {
      const h = idx + 1;
      const refTime = new Date(Date.now() + h * 3600000);
      const hour = refTime.getHours();
      const wave = Math.sin(((hour - 9) / 24) * 2 * Math.PI);
      const temperature_c = Number((25.0 + 4.8 * wave).toFixed(1));
      const humidity_pct = Number(Math.max(38, Math.min(92, 68.0 - 15.0 * wave)).toFixed(1));
      return {
        horizon_hours: h,
        timestamp: refTime.toISOString(),
        temperature_c,
        humidity_pct
      };
    }),
    summary: {
      temperature: {
        minimum_c: 20.2,
        maximum_c: 29.8,
        mean_c: 25.0,
        minimum_at: new Date(Date.now() + 14 * 3600000).toISOString(),
        maximum_at: new Date(Date.now() + 3 * 3600000).toISOString(),
        configured_threshold_c: 30.0,
        hours_above_configured_threshold: 0,
        longest_sequence_above_threshold: 0,
        first_event_above_threshold_at: null
      },
      humidity: {
        minimum_pct: 53.0,
        maximum_pct: 83.0,
        mean_pct: 68.0,
        minimum_at: new Date(Date.now() + 3 * 3600000).toISOString(),
        maximum_at: new Date(Date.now() + 14 * 3600000).toISOString(),
        configured_threshold_pct: 75.0,
        hours_above_configured_threshold: 8,
        longest_sequence_above_threshold: 8,
        first_event_above_threshold_at: new Date(Date.now() + 10 * 3600000).toISOString()
      },
      thresholds_by_context: {
        geral_viveiro: {
          temperature_above_30c: { threshold: 30.0, direction: "above", hours_count: 0, longest_sequence_hours: 0, first_event_at: null, peak_value: 29.8 },
          humidity_above_75pct: { threshold: 75.0, direction: "above", hours_count: 8, longest_sequence_hours: 8, first_event_at: new Date(Date.now() + 10 * 3600000).toISOString(), peak_value: 83.0 }
        },
        alface_solaris: {
          temperature_above_26c: { threshold: 26.0, direction: "above", hours_count: 9, longest_sequence_hours: 9, first_event_at: new Date(Date.now() + 1 * 3600000).toISOString(), peak_value: 29.8 },
          temperature_above_28c: { threshold: 28.0, direction: "above", hours_count: 5, longest_sequence_hours: 5, first_event_at: new Date(Date.now() + 2 * 3600000).toISOString(), peak_value: 29.8 },
          humidity_above_80pct: { threshold: 80.0, direction: "above", hours_count: 4, longest_sequence_hours: 4, first_event_at: new Date(Date.now() + 12 * 3600000).toISOString(), peak_value: 83.0 }
        },
        rosa_do_deserto: {
          humidity_above_60pct: { threshold: 60.0, direction: "above", hours_count: 16, longest_sequence_hours: 14, first_event_at: new Date(Date.now() + 7 * 3600000).toISOString(), peak_value: 83.0 },
          temperature_below_14c: { threshold: 14.0, direction: "below", hours_count: 0, longest_sequence_hours: 0, first_event_at: null, peak_value: 20.2 }
        },
        salsinha: {
          humidity_above_75pct: { threshold: 75.0, direction: "above", hours_count: 8, longest_sequence_hours: 8, first_event_at: new Date(Date.now() + 10 * 3600000).toISOString(), peak_value: 83.0 },
          temperature_above_24c: { threshold: 24.0, direction: "above", hours_count: 12, longest_sequence_hours: 10, first_event_at: new Date(Date.now() + 1 * 3600000).toISOString(), peak_value: 29.8 },
          temperature_above_28c: { threshold: 28.0, direction: "above", hours_count: 5, longest_sequence_hours: 5, first_event_at: new Date(Date.now() + 2 * 3600000).toISOString(), peak_value: 29.8 }
        }
      }
    },
    indicators: {
      temperature_trend: "stable",
      humidity_trend: "rising",
      temperature_amplitude_c: 9.6,
      combined_heat_humidity_periods: []
    },
    alerts: [
      {
        code: "ALFACE_THERMAL_STRESS_26C",
        context: "alface_solaris",
        severity: "warning",
        metric: "temperature_c",
        threshold: 26.0,
        hours_above_threshold: 9,
        longest_sequence_hours: 9,
        first_event_at: new Date(Date.now() + 1 * 3600000).toISOString(),
        message: "Alface Solaris: 9h previstas acima de 26°C (maior sequência: 9h). Atenção a tipburn e ventilação."
      },
      {
        code: "ROSA_EXCESS_HUMIDITY_60PCT",
        context: "rosa_do_deserto",
        severity: "warning",
        metric: "humidity_pct",
        threshold: 60.0,
        hours_above_threshold: 16,
        longest_sequence_hours: 14,
        first_event_at: new Date(Date.now() + 7 * 3600000).toISOString(),
        message: "Rosa do Deserto: 16h previstas com umidade > 60% (maior sequência: 14h). Suspender regas e reforçar aeração."
      }
    ],
    warnings: [
      {
        code: "EXTERNAL_REFERENCE_CONDITIONS",
        message: "A previsão representa condições meteorológicas externas de referência para o viveiro."
      },
      {
        code: "SOURCE_DOMAIN_SHIFT",
        message: "O modelo foi treinado com dados históricos do INMET e recebe, na operação, observações coletadas da HG Brasil."
      }
    ]
  }
};

// Culturas foco: Alface Solaris, Salsinha e Rosa do Deserto
export const mockPlants = [
  {
    id: "alface-solaris",
    name: "Alface Solaris",
    scientificName: "Lactuca sativa var. capitata (Solaris)",
    category: "Hortaliça Folhosa",
    badge: "Atenção: Stress Térmico",
    badgeLevel: "warning",
    image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80",
    description: "Variedade selecionada para cultivo protegido, suscetível a queimaduras nas bordas foliares em períodos de alta radiação e calor.",
    metrics: {
      humidity: {
        value: 74,
        unit: "%",
        status: "Ideal",
        level: "success",
        optimalRange: "60% - 80%",
        icon: "bi-droplet-half"
      },
      temperature: {
        value: 27.2,
        unit: "°C",
        status: "Elevada",
        level: "warning",
        optimalRange: "15°C - 25°C",
        icon: "bi-thermometer-half"
      },
      rain: {
        value: 4.5,
        unit: "mm",
        status: "Referência externa",
        level: "success",
        accumulated: "12 mm (72h)",
        icon: "bi-cloud-rain"
      },
      forecast: {
        condition: "Pancadas à tarde e mormaço",
        tempMax: 31,
        tempMin: 18,
        rainProb: "60%",
        icon: "bi-cloud-sun"
      }
    },
    mlPrediction: {
      contextKey: "alface_solaris",
      status: "success",
      isSimulatedFallback: true,
      summaryTemperature: { minimum_c: 20.2, maximum_c: 29.8, mean_c: 25.0 },
      summaryHumidity: { minimum_pct: 53.0, maximum_pct: 83.0, mean_pct: 68.0 },
      indicators: { temperature_trend: "stable", humidity_trend: "rising", temperature_amplitude_c: 9.6 },
      thresholds: {
        temperature_above_26c: { threshold: 26.0, direction: "above", hours_count: 9, longest_sequence_hours: 9, first_event_at: new Date(Date.now() + 1 * 3600000).toISOString(), peak_value: 29.8 },
        temperature_above_28c: { threshold: 28.0, direction: "above", hours_count: 5, longest_sequence_hours: 5, first_event_at: new Date(Date.now() + 2 * 3600000).toISOString(), peak_value: 29.8 },
        humidity_above_80pct: { threshold: 80.0, direction: "above", hours_count: 4, longest_sequence_hours: 4, first_event_at: new Date(Date.now() + 12 * 3600000).toISOString(), peak_value: 83.0 }
      },
      alerts: [
        {
          code: "ALFACE_THERMAL_STRESS_26C",
          severity: "warning",
          message: "Alface Solaris: 9h previstas acima de 26°C (maior sequência: 9h). Atenção a tipburn e ventilação."
        }
      ]
    },
    risks: [
      {
        id: "dias-nublados",
        name: "Dias Nublados",
        status: "Moderado",
        level: "warning",
        badge: "2 dias consecutivos",
        value: "2 dias",
        description: "Nebulosidade externa moderada. Persistência de baixa luminosidade por mais de 3 dias pode induzir estiolamento.",
        icon: "bi-cloud-slash"
      },
      {
        id: "risco-stress",
        name: "Risco de Stress",
        status: "Atenção Térmica",
        level: "danger",
        badge: "Stress Térmico Alto",
        value: "Alto (T > 26°C)",
        description: "Temperatura externa de referência acima de 26°C alerta para risco de pendoamento precoce e 'tipburn' (queima de bordas).",
        icon: "bi-exclamation-triangle"
      },
      {
        id: "tempo-sem-chuva",
        name: "Tempo Sem Chuva",
        status: "Normal",
        level: "success",
        badge: "Manejo de irrigação",
        value: "1 dia seco",
        description: "Referência externa para acompanhamento da demanda evaporativa e ajuste de regas.",
        icon: "bi-calendar-check"
      }
    ],
    recommendations: [
      "Reforçar ventilação e resfriamento no viveiro quando a temperatura externa superar 26°C.",
      "Utilizar tela de sombreamento nos horários de maior insolação (11h às 15h) para mitigar tipburn.",
      "Monitorar a aeração para manter a umidade relativa na faixa de referência de 60% a 80%."
    ],
    idealConditions: {
      temp: "15°C - 25°C (tolerante até 28°C em cultivo de verão)",
      humidity: "60% - 80%",
      light: "Alta luminosidade difusa (protegida contra radiação excessiva)",
      soilMoisture: "Substrato umedecido e oxigenado"
    }
  },
  {
    id: "Rosa-do-deserto",
    name: "Rosa do Deserto",
    scientificName: "Adenium obesum",
    category: "Planta Ornamental Suculenta",
    badge: "Monitoramento de Umidade",
    badgeLevel: "info",
    image: "https://worldofsucculents.com/wp-content/uploads/2015/08/Adenium-obesum.jpg",
    description: "Planta suculenta de clima árido e caudex bulboso. Extremamente vulnerável ao apodrecimento de raízes sob umidade elevada e substrato encharcado.",
    metrics: {
      humidity: {
        value: 68,
        unit: "%",
        status: "Atenção (Alta)",
        level: "warning",
        optimalRange: "30% - 60%",
        icon: "bi-droplet-half"
      },
      temperature: {
        value: 28.5,
        unit: "°C",
        status: "Ótima",
        level: "success",
        optimalRange: "25°C - 35°C",
        icon: "bi-thermometer-sun"
      },
      rain: {
        value: 0.0,
        unit: "mm",
        status: "Referência externa",
        level: "success",
        accumulated: "0 mm (24h)",
        icon: "bi-cloud-sun"
      },
      forecast: {
        condition: "Pancadas isoladas na região",
        tempMax: 31,
        tempMin: 19,
        rainProb: "60%",
        icon: "bi-sun"
      }
    },
    mlPrediction: {
      contextKey: "rosa_do_deserto",
      status: "success",
      isSimulatedFallback: true,
      summaryTemperature: { minimum_c: 20.2, maximum_c: 29.8, mean_c: 25.0 },
      summaryHumidity: { minimum_pct: 53.0, maximum_pct: 83.0, mean_pct: 68.0 },
      indicators: { temperature_trend: "stable", humidity_trend: "rising", temperature_amplitude_c: 9.6 },
      thresholds: {
        humidity_above_60pct: { threshold: 60.0, direction: "above", hours_count: 16, longest_sequence_hours: 14, first_event_at: new Date(Date.now() + 7 * 3600000).toISOString(), peak_value: 83.0 },
        temperature_below_14c: { threshold: 14.0, direction: "below", hours_count: 0, longest_sequence_hours: 0, first_event_at: null, peak_value: 20.2 }
      },
      alerts: [
        {
          code: "ROSA_EXCESS_HUMIDITY_60PCT",
          severity: "warning",
          message: "Rosa do Deserto: 16h previstas com umidade > 60% (maior sequência: 14h). Suspender regas e reforçar aeração."
        }
      ]
    },
    risks: [
      {
        id: "risco-umidade-excessiva",
        name: "Risco de Humidade Excessiva",
        status: "Crítico / Atenção",
        level: "danger",
        badge: "Risco de Apodrecimento Radicular",
        value: "68% UR (Acima de 60%)",
        description: "Umidade relativa externa acima de 60% reduz a taxa de secagem do substrato e favorece fungos no caudex.",
        icon: "bi-water"
      },
      {
        id: "tempo-sem-chuva",
        name: "Tempo Sem Chuva",
        status: "Ideal (5 dias)",
        level: "success",
        badge: "Favorável",
        value: "5 dias sem chuva",
        description: "Período seco na região favorece a secagem adequada do substrato e o fortalecimento radicular da Adenium.",
        icon: "bi-sun-fill"
      }
    ],
    recommendations: [
      "Suspender regas até que o substrato atinja dessecação superficial completa.",
      "Favorecer a circulação de ar em períodos com umidade externa superior a 60%.",
      "Manter sombreamento moderado (tela de 35%) na formação de mudas para potencializar o caudex sem induzir estiolamento."
    ],
    idealConditions: {
      temp: "25°C - 35°C (sensível ao frio severo < 14°C)",
      humidity: "30% - 60%",
      light: "Sol pleno a sombreamento moderado (tela de 35% na fase de mudas)",
      soilMoisture: "Substrato altamente drenável, seco entre as regas"
    }
  },
  {
    id: "salsinha",
    name: "Salsinha",
    scientificName: "Petroselinum crispum",
    category: "Erva Aromática / Condimento",
    badge: "Excelente Vigor Vegetativo",
    badgeLevel: "success",
    image: "https://tse4.mm.bing.net/th/id/OIP.e72F1lheQKDZUvUEhGN87gHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Cultura herbácea de ciclo contínuo, aprecia solos ricos e úmidos, porém extremamente sensível ao abafamento por calor e ao excesso de água acumulada.",
    metrics: {
      humidity: {
        value: 78,
        unit: "%",
        status: "Atenção: Alta",
        level: "warning",
        optimalRange: "60% - 75%",
        icon: "bi-droplet-half"
      },
      temperature: {
        value: 23.4,
        unit: "°C",
        status: "Perfeita",
        level: "success",
        optimalRange: "10°C - 24°C",
        icon: "bi-thermometer-half"
      },
      rain: {
        value: 38.0,
        unit: "mm",
        status: "Precipitação Externa Alta",
        level: "warning",
        accumulated: "38 mm (últimas 48h)",
        icon: "bi-cloud-rain-heavy"
      },
      forecast: {
        condition: "Tempo úmido e ameno",
        tempMax: 27,
        tempMin: 17,
        rainProb: "75%",
        icon: "bi-cloud-drizzle"
      }
    },
    mlPrediction: {
      contextKey: "salsinha",
      status: "success",
      isSimulatedFallback: true,
      summaryTemperature: { minimum_c: 20.2, maximum_c: 29.8, mean_c: 25.0 },
      summaryHumidity: { minimum_pct: 53.0, maximum_pct: 83.0, mean_pct: 68.0 },
      indicators: { temperature_trend: "stable", humidity_trend: "rising", temperature_amplitude_c: 9.6 },
      thresholds: {
        humidity_above_75pct: { threshold: 75.0, direction: "above", hours_count: 8, longest_sequence_hours: 8, first_event_at: new Date(Date.now() + 10 * 3600000).toISOString(), peak_value: 83.0 },
        temperature_above_24c: { threshold: 24.0, direction: "above", hours_count: 12, longest_sequence_hours: 10, first_event_at: new Date(Date.now() + 1 * 3600000).toISOString(), peak_value: 29.8 },
        temperature_above_28c: { threshold: 28.0, direction: "above", hours_count: 5, longest_sequence_hours: 5, first_event_at: new Date(Date.now() + 2 * 3600000).toISOString(), peak_value: 29.8 }
      },
      alerts: []
    },
    risks: [
      {
        id: "risco-umidade-excessiva",
        name: "Risco de Humidade Excessiva",
        status: "Moderado / Alerta",
        level: "warning",
        badge: "Risco de Podridão e Míldio",
        value: "78% UR + 38mm chuva",
        description: "Alta umidade externa (acima de 75%) e chuva acumulada na região alertam para risco de fungos de solo (Pythium/Rhizoctonia) e manchas foliares (Septoria).",
        icon: "bi-droplet-fill"
      },
      {
        id: "risco-temperatura-elevada",
        name: "Risco de Temperatura Elevada",
        status: "Baixo",
        level: "success",
        badge: "Clima Ameno Adequado",
        value: "23.4°C (Máx segura)",
        description: "A temperatura externa de referência está dentro da faixa confortável (10°C a 24°C). Risco de retardo vegetativo caso supere 28°C.",
        icon: "bi-thermometer"
      }
    ],
    recommendations: [
      "Controlar rigorosamente a irrigação e a drenagem dos canteiros para prevenir encharcamento e podridões radiculares.",
      "Realizar desbaste foliar preventivo e manter aeração constante em dias de alta umidade externa.",
      "Evitar irrigação foliar no período noturno para reduzir incidência de míldio e septoriose."
    ],
    idealConditions: {
      temp: "10°C - 24°C (temperaturas > 28°C reduzem o vigor)",
      humidity: "60% - 75%",
      light: "Meia-sombra a sol moderado",
      soilMoisture: "Solo úmido com boa capacidade de campo, estritamente sem encharcamento"
    }
  }
];
