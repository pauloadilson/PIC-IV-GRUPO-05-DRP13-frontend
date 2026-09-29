import React, { useState } from 'react';
import PlantCard from '../components/PlantCard';

export default function PlantsView({ plants, onSelectPlant }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlants = plants.filter((plant) => {
    const matchesFilter = selectedFilter === 'all' || plant.id === selectedFilter;
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="plants-view">
      {/* Header da Área de Plantas */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white">
        <div className="card-body p-4">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-1">
                <div className="p-2 rounded-3 bg-success-subtle text-success">
                  <i className="bi bi-flower2 fs-4"></i>
                </div>
                <div>
                  <h1 className="h4 fw-bold mb-0 text-dark">
                    Painel Individual de Culturas
                  </h1>
                  <p className="text-muted small mb-0">
                    Monitoramento microclimático dedicado para prevenção de perdas e manejo agronômico
                  </p>
                </div>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="Buscar cultura ou variedade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
            <button
              className={`btn btn-sm rounded-pill px-3 fw-medium ${
                selectedFilter === 'all'
                  ? 'btn-forest text-white shadow-sm'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setSelectedFilter('all')}
            >
              <i className="bi bi-collection me-1"></i> Todas as Culturas ({plants.length})
            </button>
            {plants.map((p) => (
              <button
                key={p.id}
                className={`btn btn-sm rounded-pill px-3 fw-medium ${
                  selectedFilter === p.id
                    ? 'btn-forest text-white shadow-sm'
                    : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedFilter(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Cards das Plantas */}
      {filteredPlants.length > 0 ? (
        <div className="row g-4">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="col-12 col-lg-4">
              <PlantCard
                plant={plant}
                onSelectPlant={onSelectPlant}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-5 bg-white rounded-4 shadow-sm border">
          <i className="bi bi-search fs-1 text-muted"></i>
          <h4 className="mt-3 text-secondary">Nenhuma cultura encontrada</h4>
          <p className="text-muted small">Tente alterar os termos de busca ou remover o filtro selecionado.</p>
          <button
            className="btn btn-sm btn-outline-forest rounded-pill px-3"
            onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Informação Metodológica do Projeto */}
      <div className="alert alert-light border rounded-4 mt-4 p-3 d-flex align-items-center gap-3">
        <i className="bi bi-info-circle-fill text-primary fs-3"></i>
        <div className="small text-secondary">
          <strong>Critérios de Risco de Acordo com a Cultura:</strong> As faixas de tolerância hídrica, térmica e pluviométrica foram parametrizadas conforme a literatura agronômica para a <em>Alface Solaris</em> (hidroponia/queima de bordas), <em>Rosa do Deserto</em> (suscetibilidade ao apodrecimento de raízes) e <em>Salsinha</em> (sensibilidade ao encharcamento e calor).
        </div>
      </div>
    </div>
  );
}
