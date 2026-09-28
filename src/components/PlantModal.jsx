import React from 'react';

export default function PlantModal({ plant, onClose }) {
  if (!plant) return null;

  return (
    <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="modal-header bg-forest text-white py-3 px-4 border-0">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-white bg-opacity-25 rounded-circle">
                <i className="bi bi-flower1 fs-4 text-white"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">{plant.name}</h5>
                <span className="small text-white-50">{plant.scientificName} &bull; {plant.category}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Coluna da Esquerda: Resumo e Condições Ideais */}
              <div className="col-12 col-md-5">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="rounded-4 w-100 object-fit-cover shadow-sm mb-3"
                  style={{ height: '200px' }}
                />

                <div className="p-3 bg-light rounded-4 border mb-3">
                  <h6 className="fw-bold text-dark mb-2 small text-uppercase">
                    <i className="bi bi-sliders me-1 text-primary"></i> Parâmetros Agronômicos Ideais
                  </h6>
                  <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-secondary">
                    <li><strong>Temperatura:</strong> {plant.idealConditions.temp}</li>
                    <li><strong>Umidade do Ar:</strong> {plant.idealConditions.humidity}</li>
                    <li><strong>Luminosidade:</strong> {plant.idealConditions.light}</li>
                    <li><strong>Manejo Hídrico:</strong> {plant.idealConditions.soilMoisture}</li>
                  </ul>
                </div>

                <div className="badge bg-secondary-subtle text-secondary w-100 p-2 text-wrap">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i> {plant.greenhouse}
                </div>
              </div>

              {/* Coluna da Direita: Recomendações e Plano de Ação */}
              <div className="col-12 col-md-7">
                <h6 className="fw-bold text-dark mb-3 text-uppercase small">
                  <i className="bi bi-clipboard2-check me-1 text-success"></i> Recomendações Imediatas de Manejo
                </h6>
                <div className="list-group mb-4 shadow-sm">
                  {plant.recommendations.map((rec, idx) => (
                    <div key={idx} className="list-group-item list-group-item-action d-flex align-items-start gap-2 p-3 border-start-0 border-end-0">
                      <i className="bi bi-check-circle-fill text-success fs-5 mt-n1"></i>
                      <div className="small text-dark fw-medium">{rec}</div>
                    </div>
                  ))}
                </div>

                <h6 className="fw-bold text-dark mb-2 text-uppercase small">
                  <i className="bi bi-shield-exclamation me-1 text-danger"></i> Resumo de Riscos Críticos
                </h6>
                <div className="d-flex flex-column gap-2">
                  {plant.risks.map((risk) => (
                    <div key={risk.id} className="p-2.5 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                      <div className="small">
                        <strong className="text-dark d-block">{risk.name}</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{risk.description}</span>
                      </div>
                      <span className={`badge ms-2 ${
                        risk.level === 'danger' ? 'bg-danger' : risk.level === 'warning' ? 'bg-warning text-dark' : 'bg-success'
                      }`}>
                        {risk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light px-4 py-3 border-top d-flex justify-content-between">
            <span className="small text-muted font-monospace">
              ID da Cultura: {plant.id}
            </span>
            <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
