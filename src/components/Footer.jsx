import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-4 mt-5 border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <i className="bi bi-flower1 text-success fs-4"></i>
              <span className="fw-bold text-white fs-6">Viveiro Bioterra</span>
            </div>
            <p className="small mb-1">
              Projeto Integrador em Computação IV (PIC-IV) &bull; Universidade Virtual do Estado de São Paulo (UNIVESP).
            </p>
            <p className="small text-muted mb-0">
              Sistema de Monitoramento Climático e Mitigação de Riscos Agrícolas.
            </p>
          </div>

          <div className="col-12 col-md-6 text-center text-md-end">
            <div className="d-inline-flex flex-column align-items-center align-items-md-end">
              <div className="d-flex gap-2 mb-2">
                <span className="badge bg-secondary-subtle text-light border border-secondary border-opacity-50">
                  React 19 + Vite
                </span>
                <span className="badge bg-secondary-subtle text-light border border-secondary border-opacity-50">
                  Bootstrap 5.3
                </span>
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  BFF INMET & HG Brasil
                </span>
              </div>
              <span className="small text-muted">
                Culturas Alvo: Alface Solaris &bull; Salsinha &bull; Flor do Deserto
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
