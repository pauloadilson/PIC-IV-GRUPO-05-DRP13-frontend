import React from 'react';

export default function ForecastWidget({ forecast }) {
  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-info-subtle text-info">
              <i className="bi bi-calendar3-range fs-4"></i>
            </div>
            <div>
              <h3 className="h5 fw-bold mb-0 text-dark">
                Previsão Meteorológica Estendida (5 Dias)
              </h3>
              <p className="text-muted small mb-0">
                Projeção integrada HG Brasil para planejamento de irrigação e ventilação
              </p>
            </div>
          </div>
          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill small">
            <i className="bi bi-arrow-repeat me-1 text-primary"></i> Atualização Diária
          </span>
        </div>

        <div className="row g-2">
          {forecast.map((item, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg col-xl">
              <div className={`p-3 rounded-4 text-center border h-100 transition-card ${
                index === 0 ? 'bg-light border-primary border-2 shadow-sm' : 'bg-white'
              }`}>
                <div className="small fw-bold text-uppercase text-secondary mb-1">
                  {item.day} ({item.weekday})
                </div>
                <div className="my-2">
                  <i className={`bi ${item.icon} fs-2 ${index === 0 ? 'text-primary' : 'text-warning'}`}></i>
                </div>
                <div className="fw-bold fs-5 text-dark mb-1">
                  {item.max}° <span className="text-muted fs-6 fw-normal">/ {item.min}°</span>
                </div>
                <div className="badge bg-light text-primary border rounded-pill mb-2 small">
                  <i className="bi bi-droplet-fill me-1"></i> {item.rainProb}% ({item.rainMm} mm)
                </div>
                <div className="small text-muted text-truncate" title={item.cond}>
                  {item.cond}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
