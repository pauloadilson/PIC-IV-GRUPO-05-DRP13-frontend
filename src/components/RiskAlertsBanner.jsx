import React from 'react';

export default function RiskAlertsBanner({ risks }) {
  const getBadgeClass = (level) => {
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

  const getBorderClass = (level) => {
    switch (level) {
      case 'danger':
        return 'border-danger border-opacity-50 bg-danger-subtle';
      case 'warning':
        return 'border-warning border-opacity-50 bg-warning-subtle';
      case 'info':
        return 'border-info border-opacity-50 bg-info-subtle';
      case 'success':
      default:
        return 'border-success border-opacity-25 bg-light';
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-danger-subtle text-danger">
              <i className="bi bi-shield-exclamation fs-4"></i>
            </div>
            <div>
              <h3 className="h5 fw-bold mb-0 text-dark">
                Matriz de Riscos Climáticos Gerais
              </h3>
              <p className="text-muted small mb-0">
                Monitoramento contínuo para prevenção de perdas nas estufas e canteiros
              </p>
            </div>
          </div>
          <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill small">
            <i className="bi bi-bell-fill me-1 text-warning"></i> 4 Riscos Críticos Mapeados
          </span>
        </div>

        <div className="row g-3">
          {risks.map((risk) => (
            <div key={risk.id} className="col-12 col-md-6 col-xl-3">
              <div className={`p-3 rounded-4 border h-100 transition-all ${getBorderClass(risk.level)}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <i className={`bi ${risk.icon} fs-4 text-${risk.level === 'warning' ? 'warning-emphasis' : risk.level}`}></i>
                    <span className="fw-bold text-dark">{risk.name}</span>
                  </div>
                  <span className={`badge rounded-pill fw-semibold ${getBadgeClass(risk.level)}`}>
                    {risk.status}
                  </span>
                </div>
                <div className="text-dark fw-semibold small mb-1">
                  {risk.value}
                </div>
                <p className="text-muted small mb-0 lh-sm">
                  {risk.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
