import React, { useState } from 'react';

function formatHourFromIso(isoStr) {
  if (!isoStr) return 'Sem ocorrência';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoStr;
  }
}

function formatTrendLabel(trend) {
  switch (trend) {
    case 'rising':
      return { text: 'Em elevação', icon: 'bi-graph-up-arrow', badge: 'bg-warning-subtle text-warning-emphasis border-warning' };
    case 'falling':
      return { text: 'Em queda', icon: 'bi-graph-down-arrow', badge: 'bg-info-subtle text-info-emphasis border-info' };
    case 'stable':
    default:
      return { text: 'Estável', icon: 'bi-dash-lg', badge: 'bg-success-subtle text-success-emphasis border-success' };
  }
}

const CONTEXT_OPTIONS = [
  { key: 'geral_viveiro', label: 'Geral do Viveiro', icon: 'bi-house-gear' },
  { key: 'alface_solaris', label: 'Alface Solaris', icon: 'bi-flower2' },
  { key: 'rosa_do_deserto', label: 'Rosa do Deserto', icon: 'bi-sun' },
  { key: 'salsinha', label: 'Salsinha', icon: 'bi-droplet-half' }
];

const THRESHOLD_LABELS = {
  temperature_above_30c: { label: 'Calor Crítico (> 30°C)', unit: '°C', icon: 'bi-thermometer-sun', color: 'danger' },
  humidity_above_75pct: { label: 'Umidade Elevada (> 75%)', unit: '%', icon: 'bi-droplet-fill', color: 'info' },
  temperature_above_26c: { label: 'Stress Térmico Alface (> 26°C)', unit: '°C', icon: 'bi-thermometer-high', color: 'warning' },
  temperature_above_28c: { label: 'Calor Severo (> 28°C)', unit: '°C', icon: 'bi-fire', color: 'danger' },
  humidity_above_80pct: { label: 'Umidade Crítica (> 80%)', unit: '%', icon: 'bi-cloud-haze2', color: 'warning' },
  humidity_above_60pct: { label: 'Umidade Acima do Ideal (> 60%)', unit: '%', icon: 'bi-moisture', color: 'warning' },
  temperature_below_14c: { label: 'Frio Crítico (< 14°C)', unit: '°C', icon: 'bi-snow', color: 'info' },
  temperature_above_24c: { label: 'Acima da Faixa Ideal (> 24°C)', unit: '°C', icon: 'bi-thermometer-half', color: 'warning' }
};

export default function MlForecastSection({ mlForecast }) {
  const [selectedContext, setSelectedContext] = useState('geral_viveiro');
  const [showAllHours, setShowAllHours] = useState(false);

  if (!mlForecast || !mlForecast.summary) {
    return null;
  }

  const {
    model = {},
    forecast = [],
    summary = {},
    indicators = {},
    alerts = [],
    warnings = [],
    is_simulated_fallback = false
  } = mlForecast;

  const tempSummary = summary.temperature || {};
  const humSummary = summary.humidity || {};
  const contexts = summary.thresholds_by_context || {};
  const activeThresholds = contexts[selectedContext] || {};

  const tempTrend = formatTrendLabel(indicators.temperature_trend);
  const humTrend = formatTrendLabel(indicators.humidity_trend);

  const displayedHours = showAllHours ? forecast : forecast.filter((_, idx) => idx % 2 === 0 || idx === 23);

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white" id="secao-previsao-ml">
      <div className="card-body p-4">
        {/* Cabeçalho da Seção de Aprendizado de Máquina */}
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-3 bg-primary-subtle text-primary">
              <i className="bi bi-cpu-fill fs-3"></i>
            </div>
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <h3 className="h5 fw-bold mb-0 text-dark">
                  Previsão Horária por Aprendizado de Máquina (Próximas 24h)
                </h3>
                <span className={`badge rounded-pill ${
                  is_simulated_fallback
                    ? 'bg-secondary-subtle text-secondary border'
                    : 'bg-success-subtle text-success border border-success'
                }`}>
                  <i className={`bi ${is_simulated_fallback ? 'bi-hdd-network' : 'bi-lightning-charge-fill'} me-1`}></i>
                  {is_simulated_fallback ? 'Projeção Horária (Contingência)' : 'Inferência Ativa (API ML)'}
                </span>
              </div>
              <p className="text-muted small mb-0 mt-1">
                Modelo <strong>{model.algorithm || 'HistGradientBoostingRegressor'}</strong> ({model.id || 'hgb_tu_24h'}) &bull; Conjunto de atributos <strong>{model.feature_set || 'TU'}</strong> (24h histórico &rarr; 24h previstas)
              </p>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill small">
              <i className="bi bi-bullseye text-primary me-1"></i> Alvos: Temperatura (°C) e Umidade (%)
            </span>
          </div>
        </div>

        {/* 1. Cards de Métricas Preditivas Principais (24h) */}
        <div className="row g-3 mb-4">
          {/* Temperatura Máxima e Mínima Previstas */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3 rounded-4 bg-light border h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">Temp. Prevista (24h)</span>
                <i className="bi bi-thermometer-sun text-danger fs-5"></i>
              </div>
              <div className="d-flex align-items-baseline gap-2 my-1">
                <span className="fs-4 fw-bold text-dark">{tempSummary.maximum_c}°C</span>
                <span className="small text-secondary">máx</span>
                <span className="text-muted">/</span>
                <span className="fs-6 fw-semibold text-secondary">{tempSummary.minimum_c}°C mín</span>
              </div>
              <div className="small text-muted d-flex justify-content-between mt-2 pt-2 border-top">
                <span>Pico às <strong>{formatHourFromIso(tempSummary.maximum_at)}</strong></span>
                <span>Média: <strong>{tempSummary.mean_c}°C</strong></span>
              </div>
            </div>
          </div>

          {/* Umidade Máxima e Mínima Previstas */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3 rounded-4 bg-light border h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">Umidade Prevista (24h)</span>
                <i className="bi bi-droplet-half text-primary fs-5"></i>
              </div>
              <div className="d-flex align-items-baseline gap-2 my-1">
                <span className="fs-4 fw-bold text-dark">{humSummary.maximum_pct}%</span>
                <span className="small text-secondary">máx</span>
                <span className="text-muted">/</span>
                <span className="fs-6 fw-semibold text-secondary">{humSummary.minimum_pct}% mín</span>
              </div>
              <div className="small text-muted d-flex justify-content-between mt-2 pt-2 border-top">
                <span>Pico às <strong>{formatHourFromIso(humSummary.maximum_at)}</strong></span>
                <span>Média: <strong>{humSummary.mean_pct}%</strong></span>
              </div>
            </div>
          </div>

          {/* Amplitude Térmica e Tendências */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3 rounded-4 bg-light border h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">Amplitude & Tendência</span>
                <i className="bi bi-arrows-expand text-warning fs-5"></i>
              </div>
              <div className="d-flex align-items-baseline gap-2 my-1">
                <span className="fs-4 fw-bold text-dark">{indicators.temperature_amplitude_c}°C</span>
                <span className="small text-secondary">amplitude térmica</span>
              </div>
              <div className="d-flex flex-wrap gap-1.5 mt-2 pt-2 border-top">
                <span className={`badge border ${tempTrend.badge}`} style={{ fontSize: '0.7rem' }}>
                  <i className={`bi ${tempTrend.icon} me-1`}></i>Temp: {tempTrend.text}
                </span>
                <span className={`badge border ${humTrend.badge}`} style={{ fontSize: '0.7rem' }}>
                  <i className={`bi ${humTrend.icon} me-1`}></i>Umid: {humTrend.text}
                </span>
              </div>
            </div>
          </div>

          {/* Persistência Geral Acima de Limiar */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3 rounded-4 bg-light border h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-semibold text-uppercase">Eventos de Limiar (24h)</span>
                <i className="bi bi-stopwatch text-success fs-5"></i>
              </div>
              <div className="d-flex justify-content-between align-items-center my-1">
                <div>
                  <div className="small text-secondary">Calor &gt; {tempSummary.configured_threshold_c ?? 30}°C</div>
                  <strong className="fs-6 text-dark">
                    {tempSummary.hours_above_configured_threshold ?? 0}h
                  </strong>
                  <span className="text-muted small ms-1">
                    (seq: {tempSummary.longest_sequence_above_threshold ?? 0}h)
                  </span>
                </div>
                <div className="text-end">
                  <div className="small text-secondary">Umid. &gt; {humSummary.configured_threshold_pct ?? 75}%</div>
                  <strong className="fs-6 text-dark">
                    {humSummary.hours_above_configured_threshold ?? 0}h
                  </strong>
                  <span className="text-muted small ms-1">
                    (seq: {humSummary.longest_sequence_above_threshold ?? 0}h)
                  </span>
                </div>
              </div>
              <div className="small text-muted mt-2 pt-2 border-top">
                1º evento Umid.: <strong>{formatHourFromIso(humSummary.first_event_above_threshold_at)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Métricas de Limiar, Persistência e Horário Inicial por Cultura */}
        <div className="p-3 rounded-4 bg-light-subtle border mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h4 className="h6 fw-bold text-dark mb-0">
                <i className="bi bi-sliders2-vertical text-primary me-1"></i>
                Análise de Limiares Agronômicos, Persistência e Horário Inicial do Evento
              </h4>
              <span className="small text-muted">
                Quantidade de horas previstas fora da faixa ideal, maior sequência contínua e instante de início
              </span>
            </div>

            <div className="btn-group btn-group-sm flex-wrap" role="group" aria-label="Filtro de cultura ML">
              {CONTEXT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`btn ${
                    selectedContext === opt.key ? 'btn-primary fw-semibold' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setSelectedContext(opt.key)}
                >
                  <i className={`bi ${opt.icon} me-1`}></i>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-2">
            {Object.entries(activeThresholds).map(([ruleKey, item]) => {
              const meta = THRESHOLD_LABELS[ruleKey] || {
                label: ruleKey,
                unit: '',
                icon: 'bi-activity',
                color: 'secondary'
              };
              const hasEvent = item.hours_count > 0;
              return (
                <div key={ruleKey} className="col-12 col-md-4">
                  <div className={`p-3 rounded-3 border bg-white h-100 ${
                    hasEvent ? `border-${meta.color} border-opacity-50` : ''
                  }`}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold small text-dark">
                        <i className={`bi ${meta.icon} text-${meta.color} me-1`}></i>
                        {meta.label}
                      </span>
                      <span className={`badge rounded-pill ${
                        hasEvent ? `bg-${meta.color} ${meta.color === 'warning' ? 'text-dark' : 'text-white'}` : 'bg-success-subtle text-success'
                      }`}>
                        {hasEvent ? `${item.hours_count}h previstas` : '0h (Confortável)'}
                      </span>
                    </div>

                    <div className="row g-2 small text-secondary">
                      <div className="col-4">
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Horas Acima/Abaixo</div>
                        <div className="fw-semibold text-dark">{item.hours_count} h</div>
                      </div>
                      <div className="col-4">
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Maior Sequência</div>
                        <div className="fw-semibold text-dark">{item.longest_sequence_hours} h seguidas</div>
                      </div>
                      <div className="col-4">
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Início do Evento</div>
                        <div className="fw-semibold text-dark">{formatHourFromIso(item.first_event_at)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Alertas Preditivos Gerados pelo Modelo de ML */}
        {alerts.length > 0 && (
          <div className="mb-4">
            <h4 className="h6 fw-bold text-dark mb-2">
              <i className="bi bi-bell-fill text-warning me-1"></i>
              Alertas Preditivos das Próximas 24h ({alerts.length})
            </h4>
            <div className="row g-2">
              {alerts.map((alertItem, idx) => (
                <div key={idx} className="col-12 col-md-6">
                  <div className={`p-2.5 rounded-3 border d-flex align-items-start gap-2 ${
                    alertItem.severity === 'danger'
                      ? 'bg-danger-subtle border-danger text-danger-emphasis'
                      : 'bg-warning-subtle border-warning text-warning-emphasis'
                  }`}>
                    <i className={`bi ${
                      alertItem.severity === 'danger' ? 'bi-exclamation-octagon-fill' : 'bi-exclamation-triangle-fill'
                    } mt-0.5`}></i>
                    <div className="small">
                      <div className="fw-semibold">{alertItem.message}</div>
                      {alertItem.first_event_at && (
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Horário inicial previsto: <strong>{formatHourFromIso(alertItem.first_event_at)}</strong> &bull; Maior sequência: <strong>{alertItem.longest_sequence_hours}h</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Trajetória Horária Prevista (t+1 a t+24) */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="h6 fw-bold text-dark mb-0">
              <i className="bi bi-clock-history text-primary me-1"></i>
              Trajetória Horária Prevista (t+1h a t+24h)
            </h4>
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none p-0"
              onClick={() => setShowAllHours(!showAllHours)}
            >
              {showAllHours ? 'Mostrar resumo (a cada 2h)' : 'Ver todas as 24 horas'}
            </button>
          </div>

          <div className="row g-2">
            {displayedHours.map((pt) => {
              const isHot = pt.temperature_c >= 28;
              const isHumid = pt.humidity_pct >= 75;
              return (
                <div key={pt.horizon_hours} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <div className="p-2 rounded-3 border bg-light text-center h-100">
                    <div className="d-flex justify-content-between align-items-center small text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                      <span className="badge bg-white text-secondary border">+{pt.horizon_hours}h</span>
                      <span className="fw-semibold">{formatHourFromIso(pt.timestamp)}</span>
                    </div>
                    <div className={`fw-bold ${isHot ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
                      <i className="bi bi-thermometer-half text-danger me-0.5"></i>
                      {pt.temperature_c}°C
                    </div>
                    <div className={`small ${isHumid ? 'text-primary fw-semibold' : 'text-secondary'}`} style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-droplet-fill text-info me-0.5"></i>
                      {pt.humidity_pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Avisos Metodológicos (Condições Externas e Domínio INMET -> HG Brasil) */}
        {warnings.length > 0 && (
          <div className="mt-3 pt-3 border-top d-flex flex-wrap gap-2">
            {warnings.map((w, idx) => (
              <div key={idx} className="small text-muted d-flex align-items-center gap-1.5">
                <i className="bi bi-info-circle text-secondary"></i>
                <span>{w.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

