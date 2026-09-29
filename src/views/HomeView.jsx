import React from 'react';
import GeneralMetrics from '../components/GeneralMetrics';
import RiskAlertsBanner from '../components/RiskAlertsBanner';
import ForecastWidget from '../components/ForecastWidget';

export default function HomeView({ weather, plants, onSelectPlant, onNavigateToPlants }) {
  return (
    <div className="home-view">
      {/* Hero Welcome Banner */}
      <div className="p-4 p-md-5 rounded-4 bg-forest-hero text-white mb-4 shadow-sm position-relative overflow-hidden">
        <div className="position-relative z-1">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white bg-opacity-20 backdrop-blur small fw-semibold mb-3">
            <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
            <span>Painel Operacional das Estufas & Culturas</span>
          </div>
          <h1 className="display-6 fw-bold mb-2">
            Bem-vindo ao Viveiro Bioterra
          </h1>
          <p className="lead fs-6 text-white-50 mb-4 max-w-xl">
            Solução tecnológica para mitigação de riscos climáticos e otimização do cultivo protegido de <strong>Alface Solaris</strong>, <strong>Salsinha</strong> e <strong>Rosa do Deserto</strong>.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill shadow-sm"
              onClick={onNavigateToPlants}
            >
              <i className="bi bi-grid-3x3-gap-fill me-2"></i>
              Ver Monitoramento das Plantas
            </button>
            <a
              href="#riscos"
              className="btn btn-outline-light px-4 py-2 rounded-pill"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('secao-riscos')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <i className="bi bi-shield-exclamation me-2"></i>
              Consultar Alertas Ativos
            </a>
          </div>
        </div>
      </div>

      {/* 1. Métricas Climáticas em Tempo Real */}
      <GeneralMetrics weather={weather} />

      {/* 2. Banner de Riscos Climáticos Gerais (Granizo, Calor, Precipitação, Vento) */}
      <div id="secao-riscos">
        <RiskAlertsBanner risks={weather.generalRisks} />
      </div>

      {/* 3. Atalho Rápido para as Culturas Monitoradas */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <div>
              <h3 className="h5 fw-bold mb-0 text-dark">
                Status das Culturas Monitoradas
              </h3>
              <p className="text-muted small mb-0">
                Visão rápida do estado vegetativo e impacto climático em cada lote
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline-forest rounded-pill px-3 mt-2 mt-sm-0"
              onClick={onNavigateToPlants}
            >
              Acessar Painel Detalhado <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          <div className="row g-3">
            {plants.map((plant) => (
              <div key={plant.id} className="col-12 col-md-4">
                <div
                  className="p-3 rounded-4 border h-100 bg-light-subtle d-flex flex-column justify-content-between cursor-pointer transition-card hover-lift"
                  onClick={() => onSelectPlant(plant)}
                  role="button"
                  tabIndex="0"
                >
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="rounded-circle object-fit-cover shadow-sm"
                      style={{ width: '56px', height: '56px' }}
                    />
                    <div>
                      <h4 className="h6 fw-bold mb-0 text-dark">{plant.name}</h4>
                      <span className="small text-muted fst-italic">{plant.scientificName}</span>
                    </div>
                  </div>

                  <div className="my-2">
                    <span className={`badge ${
                      plant.badgeLevel === 'danger' ? 'bg-danger' : plant.badgeLevel === 'warning' ? 'bg-warning text-dark' : 'bg-success'
                    } rounded-pill px-2.5 py-1 mb-2`}>
                      {plant.badge}
                    </span>
                    <div className="d-flex justify-content-between small text-secondary">
                      <span>Temp: <strong>{plant.metrics.temperature.value}°C</strong></span>
                      <span>Umidade: <strong>{plant.metrics.humidity.value}%</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 border-top text-forest small fw-semibold d-flex justify-content-between align-items-center">
                    <span>{plant.risks.length} riscos avaliados</span>
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Previsão HG Brasil (5 Dias) */}
      <ForecastWidget forecast={weather.forecast} />
    </div>
  );
}
