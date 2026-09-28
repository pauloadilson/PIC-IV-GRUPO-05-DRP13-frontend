import React from 'react';

export default function GeneralMetrics({ weather }) {
  const { current } = weather;

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4 bg-white">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom">
          <div>
            <div className="badge bg-success-subtle text-success px-3 py-1 mb-2 rounded-pill fw-semibold">
              <i className="bi bi-clock-history me-1"></i> Atualizado às {weather.lastUpdated}
            </div>
            <h2 className="h4 fw-bold text-dark mb-1">
              Clima em Tempo Real nas Estufas
            </h2>
            <p className="text-muted small mb-0">
              <i className="bi bi-pin-map-fill text-danger me-1"></i> {weather.location} &bull; Fonte: {weather.station}
            </p>
          </div>
          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0 bg-light p-3 rounded-4 border">
            <i className={`bi ${current.conditionIcon} fs-1 text-warning`}></i>
            <div>
              <div className="display-6 fw-bold text-dark mb-0 lh-1">
                {current.temp.toFixed(1)}°C
              </div>
              <div className="text-secondary small fw-medium">
                {current.condition} &bull; Min {current.tempMin}°C / Max {current.tempMax}°C
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="row g-3">
          {/* Card 1: Umidade */}
          <div className="col-6 col-lg-3">
            <div className="p-3 rounded-4 bg-primary-subtle border border-primary-subtle h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-primary fw-semibold small text-uppercase tracking-wider">
                  Umidade Relativa
                </span>
                <i className="bi bi-droplet-half fs-4 text-primary"></i>
              </div>
              <div className="fs-3 fw-bold text-dark">{current.humidity}%</div>
              <div className="small text-muted mt-1">
                <span className="badge bg-primary text-white me-1">Moderada</span>
                Normal para estufas
              </div>
            </div>
          </div>

          {/* Card 2: Chuva e Precipitação */}
          <div className="col-6 col-lg-3">
            <div className="p-3 rounded-4 bg-info-subtle border border-info-subtle h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-info-emphasis fw-semibold small text-uppercase tracking-wider">
                  Chuva Hoje
                </span>
                <i className="bi bi-cloud-rain fs-4 text-info-emphasis"></i>
              </div>
              <div className="fs-3 fw-bold text-dark">{current.rainMm} mm</div>
              <div className="small text-muted mt-1">
                <span className="badge bg-info text-dark me-1">{current.rainProbability}% prob.</span>
                Pancadas no fim da tarde
              </div>
            </div>
          </div>

          {/* Card 3: Ventos */}
          <div className="col-6 col-lg-3">
            <div className="p-3 rounded-4 bg-secondary-subtle border border-secondary-subtle h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary fw-semibold small text-uppercase tracking-wider">
                  Velocidade do Vento
                </span>
                <i className="bi bi-wind fs-4 text-secondary"></i>
              </div>
              <div className="fs-3 fw-bold text-dark">{current.windSpeedKmH} km/h</div>
              <div className="small text-muted mt-1">
                <span className="badge bg-secondary text-white me-1">Direção {current.windDirection}</span>
                Brisa leve
              </div>
            </div>
          </div>

          {/* Card 4: Radiação & UV */}
          <div className="col-6 col-lg-3">
            <div className="p-3 rounded-4 bg-warning-subtle border border-warning-subtle h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-warning-emphasis fw-semibold small text-uppercase tracking-wider">
                  Índice UV & Pressão
                </span>
                <i className="bi bi-sun fs-4 text-warning-emphasis"></i>
              </div>
              <div className="fs-3 fw-bold text-dark">UV {current.uvIndex}</div>
              <div className="small text-muted mt-1">
                <span className="badge bg-warning text-dark me-1">Alto</span>
                {current.pressureHpa} hPa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
