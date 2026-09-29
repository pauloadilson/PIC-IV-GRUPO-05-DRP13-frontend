// Mock data para o Sistema de Monitoramento Climático - Viveiro Bioterra
// Conforme especificações do PIC-IV (plano_desenvolvimento.md)

export const mockGeneralWeather = {
  location: "Estufa Principal - Viveiro Bioterra (SP)",
  station: "Estação Meteorológica Integrada (BFF INMET / HG Brasil)",
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
  // Riscos Climáticos Gerais Monitorados (conforme plano: Granizo, Calor Excessivo, Precipitação Acumulada, Ventania)
  generalRisks: [
    {
      id: "risk-granizo",
      name: "Granizo",
      status: "Baixo Risco",
      level: "success",
      icon: "bi-cloud-snow",
      description: "Sem probabilidade de precipitação de pedras de gelo nas próximas 24h.",
      value: "5% de probabilidade",
    },
    {
      id: "risk-calor",
      name: "Calor Excessivo",
      status: "Atenção Moderada",
      level: "warning",
      icon: "bi-thermometer-sun",
      description: "Pico de 31°C previsto entre 13h e 15h. Recomenda-se acionar telas de sombreamento na estufa 1.",
      value: "Máxima de 31°C hoje",
    },
    {
      id: "risk-precipitacao",
      name: "Precipitação Acumulada",
      status: "Atenção Elevada",
      level: "warning",
      icon: "bi-cloud-rain-heavy",
      description: "Acumulado de 42mm previsto para as próximas 48h. Risco de saturação hídrica em canteiros expostos.",
      value: "42 mm / 48h",
    },
    {
      id: "risk-ventania",
      name: "Ventania",
      status: "Condição Normal",
      level: "success",
      icon: "bi-wind",
      description: "Rajadas brandas de até 22 km/h. Estruturas das estufas seguras e estáveis.",
      value: "18 km/h médio",
    },
  ],
  // Previsão para os próximos 5 dias (simulando HG Brasil)
  forecast: [
    { day: "Hoje", weekday: "Seg", max: 31, min: 18, rainProb: 60, rainMm: 4.5, icon: "bi-cloud-sun", cond: "Sol e pancadas à tarde" },
    { day: "Amanhã", weekday: "Ter", max: 28, min: 19, rainProb: 85, rainMm: 22.0, icon: "bi-cloud-rain", cond: "Chuva moderada" },
    { day: "Quarta", weekday: "Qua", max: 25, min: 17, rainProb: 70, rainMm: 15.5, icon: "bi-cloud-drizzle", cond: "Pancadas isoladas" },
    { day: "Quinta", weekday: "Qui", max: 27, min: 16, rainProb: 20, rainMm: 0.0, icon: "bi-sun", cond: "Predomínio de sol" },
    { day: "Sexta", weekday: "Sex", max: 30, min: 18, rainProb: 10, rainMm: 0.0, icon: "bi-brightness-high", cond: "Ensolarado e quente" },
  ]
};

// Culturas foco: Alface Solaris, Salsinha e Rosa do Deserto
export const mockPlants = [
  {
    id: "alface-solaris",
    name: "Alface Solaris",
    scientificName: "Lactuca sativa var. capitata (Solaris)",
    category: "Hortaliça Folhosa",
    greenhouse: "Estufa 01 - Hidroponia e Bancadas",
    badge: "Atenção: Stress Térmico",
    badgeLevel: "warning",
    image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80",
    description: "Variedade selecionada para cultivo protegido, muito suscetível a queimaduras nas bordas foliares em dias com alta radiação e calor.",
    metrics: {
      humidity: {
        value: 74,
        unit: "%",
        status: "Ideal",
        level: "success",
        optimalRange: "65% - 80%",
        icon: "bi-droplet-half"
      },
      temperature: {
        value: 27.2,
        unit: "°C",
        status: "Elevada",
        level: "warning",
        optimalRange: "18°C - 24°C",
        icon: "bi-thermometer-half"
      },
      rain: {
        value: 4.5,
        unit: "mm",
        status: "Sob controle (Estufa)",
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
    // Riscos específicos solicitados: Dias nublados, Risco de Stress, Tempo sem chuva
    risks: [
      {
        id: "dias-nublados",
        name: "Dias Nublados",
        status: "Moderado",
        level: "warning",
        badge: "2 dias consecutivos",
        value: "2 dias",
        description: "Luminosidade abaixo de 350 µmol/m²/s. Risco de estiolamento foliar caso persista por mais de 3 dias.",
        icon: "bi-cloud-slash"
      },
      {
        id: "risco-stress",
        name: "Risco de Stress",
        status: "Atenção Térmica",
        level: "danger",
        badge: "Stress Térmico Alto",
        value: "Alto (T > 27°C)",
        description: "Temperatura interna próxima a 28°C acarreta 'tipburn' (queima de bordas) e indução ao pendoamento precoce.",
        icon: "bi-exclamation-triangle"
      },
      {
        id: "tempo-sem-chuva",
        name: "Tempo Sem Chuva",
        status: "Normal",
        level: "success",
        badge: "Irrigação ativa",
        value: "1 dia seco",
        description: "Cultivo protegido por fertirrigação contínua. Sem impacto direto de estiagem externa.",
        icon: "bi-calendar-check"
      }
    ],
    recommendations: [
      "Ligar nebulizadores para reduzir temperatura interna na estufa.",
      "Manter o sombrite com 50% de retenção acionado das 11h às 15h.",
      "Verificar condutividade elétrica da solução nutritiva para evitar salinização."
    ],
    idealConditions: {
      temp: "18°C - 24°C",
      humidity: "65% - 80%",
      light: "Alta luminosidade difusa",
      soilMoisture: "Substrato ou solução úmida e oxigenada"
    }
  },
  {
    id: "Rosa-do-deserto",
    name: "Rosa do Deserto",
    scientificName: "Adenium obesum",
    category: "Planta Ornamental Suculenta",
    greenhouse: "Estufa 03 - Setor Árido",
    badge: "Monitoramento de Umidade",
    badgeLevel: "info",
    // image: "https://images.unsplash.com/photo-1596724807490-67d710a30b58?auto=format&fit=crop&w=600&q=80",
    image: "https://worldofsucculents.com/wp-content/uploads/2015/08/Adenium-obesum.jpg",
    description: "Planta suculenta de clima árido e caudex bulboso. Extremamente vulnerável ao apodrecimento de raízes em solos encharcados e umidade excessiva.",
    metrics: {
      humidity: {
        value: 68,
        unit: "%",
        status: "Atenção (Alta)",
        level: "warning",
        optimalRange: "40% - 60%",
        icon: "bi-droplet-half"
      },
      temperature: {
        value: 28.5,
        unit: "°C",
        status: "Ótima",
        level: "success",
        optimalRange: "24°C - 35°C",
        icon: "bi-thermometer-sun"
      },
      rain: {
        value: 0.0,
        unit: "mm",
        status: "Sem chuva direta",
        level: "success",
        accumulated: "0 mm (Protegida)",
        icon: "bi-cloud-sun"
      },
      forecast: {
        condition: "Pancadas isoladas no entorno",
        tempMax: 31,
        tempMin: 19,
        rainProb: "60%",
        icon: "bi-sun"
      }
    },
    // Riscos específicos solicitados: Risco de Humidade Excessiva, Tempo sem chuva
    risks: [
      {
        id: "risco-umidade-excessiva",
        name: "Risco de Humidade Excessiva",
        status: "Crítico / Atenção",
        level: "danger",
        badge: "Risco de Apodrecimento Radicular",
        value: "68% UR (Crítico p/ fungos)",
        description: "Umidade relativa acima de 65% combinada com substrato úmido favorece infecções fúngicas no caudex.",
        icon: "bi-water"
      },
      {
        id: "tempo-sem-chuva",
        name: "Tempo Sem Chuva",
        status: "Ideal (5 dias)",
        level: "success",
        badge: "Favorável",
        value: "5 dias sem chuva",
        description: "Período seco excelente para a secagem do substrato e fortalecimento radicular da Adenium.",
        icon: "bi-sun-fill"
      }
    ],
    recommendations: [
      "Suspender regas até que o substrato atinja dessecação superficial completa.",
      "Aumentar ventilação cruzada na estufa para baixar a umidade relativa do ar.",
      "Inspeção visual periódica na base do caudex para detectar amolecimento precoce."
    ],
    idealConditions: {
      temp: "24°C - 35°C",
      humidity: "40% - 55%",
      light: "Sol pleno (alta radiação)",
      soilMoisture: "Substrato drenável, seco entre as regas"
    }
  },
  {
    id: "salsinha",
    name: "Salsinha",
    scientificName: "Petroselinum crispum",
    category: "Erva Aromática / Condimento",
    greenhouse: "Canteiro Coberto 02 - Horta Fina",
    badge: "Excelente Vigor Vegetativo",
    badgeLevel: "success",
    // image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80",
    image: "https://tse4.mm.bing.net/th/id/OIP.e72F1lheQKDZUvUEhGN87gHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Cultura herbácea de ciclo contínuo, aprecia solos ricos e úmidos, porém sensível ao abafamento por calor e excesso de água acumulada.",
    metrics: {
      humidity: {
        value: 78,
        unit: "%",
        status: "Ideal a Alta",
        level: "success",
        optimalRange: "70% - 85%",
        icon: "bi-droplet-half"
      },
      temperature: {
        value: 23.4,
        unit: "°C",
        status: "Perfeita",
        level: "success",
        optimalRange: "15°C - 24°C",
        icon: "bi-thermometer-half"
      },
      rain: {
        value: 38.0,
        unit: "mm",
        status: "Precipitação Acumulada Alta",
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
    // Riscos específicos solicitados: Risco de Humidade Excessiva, Risco de Temperatura Elevada (com Precipitação Acumulada)
    risks: [
      {
        id: "risco-umidade-excessiva",
        name: "Risco de Humidade Excessiva",
        status: "Moderado",
        level: "warning",
        badge: "Risco de Míldio/Oídio",
        value: "78% UR + 38mm chuva",
        description: "Folhas molhadas por períodos prolongados favorecem manchas foliares (Septoria) e míldio.",
        icon: "bi-droplet-fill"
      },
      {
        id: "risco-temperatura-elevada",
        name: "Risco de Temperatura Elevada",
        status: "Baixo",
        level: "success",
        badge: "Clima Ameno Adequado",
        value: "23.4°C (Máx segura)",
        description: "A temperatura atual está dentro da faixa confortável. Risco de queima apenas se superar 28°C.",
        icon: "bi-thermometer"
      }
    ],
    recommendations: [
      "Garantir escoamento adequado das calhas para evitar encharcamento no canteiro.",
      "Realizar raleio e desbaste foliar preventivo para melhorar a aeração entre ramos.",
      "Evitar irrigação foliar no período noturno."
    ],
    idealConditions: {
      temp: "15°C - 24°C",
      humidity: "70% - 85%",
      light: "Meia-sombra a sol moderado",
      soilMoisture: "Solo fértil, úmido sem empoçamento"
    }
  }
];
