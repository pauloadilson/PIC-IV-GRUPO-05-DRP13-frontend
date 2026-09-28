import React from 'react';

export default function PlantCard({ plant, onSelectPlant }) {
  const { metrics, risks } = plant;

  const getStatusBadge = (level) => {
    switch (level) {
      case 'danger':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-dark';
      case 'info':
        return 'bg-info text-dark';
      case 'success':
      default:
        return 'bg-success text-white';
    }
  };

  const getRiskBorder = (level) => {
    switch (level) {
      case 'danger':
        return 'border-danger border-opacity-50 bg-danger-subtle text-danger-emphasis';
      case 'warning':
        return 'border-warning border-opacity-50 bg-warning-subtle text-warning-emphasis';
      case 'success':
      default:
        return 'border-success border-opacity-25 bg-success-subtle text-success-emphasis';
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 plant-card transition-card bg-white">
      {/* Card Header with Plant Info & Image */}
      <div className="position-relative">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-100 object-fit-cover plant-image"
          style={{ height: '170px' }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 plant-gradient-overlay d-flex flex-column justify-content-between p-3 text-white">
          <div className="d-flex justify-content-between align-items-start">
            <span className="badge bg-dark bg-opacity-75 backdrop-blur px-2.5 py-1.5 rounded-pill small">
              <i className="bi bi-geo-fill me-1 text-success"></i> {plant.greenhouse}
            </span>
            <span className={`badge rounded-pill px-3 py-1.5 fw-semibold shadow-sm ${getStatusBadge(plant.badgeLevel)}`}>
              {plant.badge}
            </span>
          </div>
          <div>
            <span className="badge bg-success bg-opacity-90 rounded-pill small mb-1">
              {plant.category}
            </span>
            <h3 className="h4 fw-bold text-white mb-0 drop-shadow">
              {plant.name}
            </h3>
            <span className="small text-white-50 fst-italic">
              {plant.scientificName}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        {/* Plant Description */}
        <p className="text-secondary small mb-3">
          {plant.description}
        </p>

        {/* 1. SEÇÃO DE DADOS CLIMÁTICOS (Humidade, Temperatura, Chuva, Previsão) */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h4 className="h6 fw-bold text-dark text-uppercase tracking-wider small mb-0">
              <i className="bi bi-thermometer-sun me-1 text-primary"></i> Dados Climáticos da Cultura
            </h4>
            <span className="badge bg-light text-muted border small">Tempo Real</span>
          </div>

          <div className="row g-2">
            {/* Humidade */}
            <div className="col-6">
              <div className="p-2.5 rounded-3 bg-light border h-100">
                <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
                  <span><i className="bi bi-droplet-half text-primary me-1"></i> Umidade</span>
                  <span className={`badge px-1.5 py-0.5 ${getStatusBadge(metrics.humidity.level)}`} style={{ fontSize: '0.65rem' }}>
                    {metrics.humidity.status}
                  </span>
                </div>
                <div className="fs-5 fw-bold text-dark">
                  {metrics.humidity.value}{metrics.humidity.unit}
                </div>
                <div className="small text-muted" style={{ fontSize: '0.72rem' }}>
                  Ideal: {metrics.humidity.optimalRange}
                </div>
              </div>
            </div>

            {/* Temperatura */}
            <div className="col-6">
              <div className="p-2.5 rounded-3 bg-light border h-100">
                <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
                  <span><i className="bi bi-thermometer-half text-danger me-1"></i> Temp.</span>
                  <span className={`badge px-1.5 py-0.5 ${getStatusBadge(metrics.temperature.level)}`} style={{ fontSize: '0.65rem' }}>
                    {metrics.temperature.status}
                  </span>
                </div>
                <div className="fs-5 fw-bold text-dark">
                  {metrics.temperature.value}{metrics.temperature.unit}
                </div>
                <div className="small text-muted" style={{ fontSize: '0.72rem' }}>
                  Ideal: {metrics.temperature.optimalRange}
                </div>
              </div>
            </div>

            {/* Chuva / Precipitação Acumulada */}
            <div className="col-6">
              <div className="p-2.5 rounded-3 bg-light border h-100">
                <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
                  <span><i className="bi bi-cloud-rain text-info me-1"></i> Chuva</span>
                  <span className={`badge px-1.5 py-0.5 ${getStatusBadge(metrics.rain.level)}`} style={{ fontSize: '0.65rem' }}>
                    {metrics.rain.value > 0 ? `${metrics.rain.value} mm` : '0 mm'}
                  </span>
                </div>
                <div className="fw-bold text-dark small">
                  {metrics.rain.accumulated}
                </div>
                <div className="text-muted" style={{ fontSize: '0.70rem' }}>
                  {metrics.rain.status}
                </div>
              </div>
            </div>

            {/* Previsão do Tempo */}
            <div className="col-6">
              <div className="p-2.5 rounded-3 bg-light border h-100">
                <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
                  <span><i className="bi bi-clouds text-warning me-1"></i> Previsão</span>
                  <span className="badge bg-secondary-subtle text-secondary px-1.5 py-0.5" style={{ fontSize: '0.65rem' }}>
                    {metrics.forecast.rainProb}
                  </span>
                </div>
                <div className="fw-bold text-dark small text-truncate" title={metrics.forecast.condition}>
                  {metrics.forecast.condition}
                </div>
                <div className="text-muted" style={{ fontSize: '0.70rem' }}>
                  {metrics.forecast.tempMin}° a {metrics.forecast.tempMax}°C
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SEÇÃO DE RISCOS ESPECÍFICOS DA PLANTA */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h4 className="h6 fw-bold text-dark text-uppercase tracking-wider small mb-0">
              <i className="bi bi-shield-shaded me-1 text-danger"></i> Avaliação de Riscos
            </h4>
            <span className="badge bg-danger-subtle text-danger small">
              {risks.length} Fatores Monitorados
            </span>
          </div>

          <div className="d-flex flex-column gap-2">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className={`p-2.5 rounded-3 border ${getRiskBorder(risk.level)}`}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex align-items-center gap-1.5">
                    <i className={`bi ${risk.icon} me-1`}></i>
                    <strong className="small">{risk.name}</strong>
                  </div>
                  <span className={`badge rounded-pill ${getStatusBadge(risk.level)}`} style={{ fontSize: '0.65rem' }}>
                    {risk.status}
                  </span>
                </div>
                <div className="small fw-semibold mb-1" style={{ fontSize: '0.78rem' }}>
                  <i className="bi bi-arrow-right-short text-muted"></i> {risk.value}
                </div>
                <div className="text-muted" style={{ fontSize: '0.72rem', lineHeight: '1.25' }}>
                  {risk.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Ação / Detalhes */}
        <div className="mt-auto pt-2">
          <button
            className="btn btn-outline-forest w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            onClick={() => onSelectPlant(plant)}
          >
            <i className="bi bi-info-circle"></i>
            <span>Ver Diretrizes & Manejo da Cultura</span>
          </button>
        </div>
      </div>
    </div>
  );
}
