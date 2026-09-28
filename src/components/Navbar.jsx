import React from 'react';

export default function Navbar({ activeTab, setActiveTab, onRefresh, isRefreshing }) {
  return (
    <header className="sticky-top shadow-sm">
      {/* Top micro-bar */}
      <div className="bg-dark text-light py-1 px-3 small border-bottom border-secondary border-opacity-25">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
              <i className="bi bi-broadcast me-1"></i> Telemetria Online
            </span>
            <span className="text-secondary d-none d-md-inline">|</span>
            <span className="text-white-50 d-none d-md-inline">
              <i className="bi bi-geo-alt me-1 text-success"></i> Estufa Central - Viveiro Bioterra
            </span>
          </div>
          <div className="d-flex align-items-center gap-2 text-white-50">
            <button
              className="btn btn-outline-light btn-sm py-0 px-2 rounded-pill font-monospace"
              style={{ fontSize: '0.72rem' }}
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Simular leitura dos sensores"
            >
              <i className={`bi bi-arrow-clockwise me-1 ${isRefreshing ? 'spin' : ''}`}></i>
              {isRefreshing ? 'Atualizando...' : 'Atualizar Telemetria'}
            </button>
            <span className="badge bg-warning text-dark font-monospace fw-semibold">
              MOCK DATA ATIVO
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-forest py-2">
        <div className="container">
          <a
            className="navbar-brand d-flex align-items-center gap-2 py-1"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
            }}
          >
            <div className="brand-icon-wrapper rounded-3 d-flex align-items-center justify-content-center bg-white text-forest shadow-sm">
              <i className="bi bi-flower1 fs-4 text-success"></i>
            </div>
            <div>
              <div className="fw-bold tracking-tight text-white fs-5 lh-1">
                Viveiro Bioterra
              </div>
              <div className="text-success-light small font-monospace" style={{ fontSize: '0.72rem' }}>
                MONITORAMENTO CLIMÁTICO INTELIGENTE • PIC-IV
              </div>
            </div>
          </a>

          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm px-3 rounded-pill fw-medium transition-all ${
                activeTab === 'home'
                  ? 'btn-light text-forest shadow-sm'
                  : 'btn-outline-light border-0'
              }`}
              onClick={() => setActiveTab('home')}
            >
              <i className="bi bi-house-door me-1"></i> Página Inicial
            </button>
            <button
              className={`btn btn-sm px-3 rounded-pill fw-medium transition-all ${
                activeTab === 'plants'
                  ? 'btn-light text-forest shadow-sm'
                  : 'btn-outline-light border-0'
              }`}
              onClick={() => setActiveTab('plants')}
            >
              <i className="bi bi-grid-fill me-1"></i> Culturas & Plantas
              <span className="badge bg-success ms-2 rounded-pill">3</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
