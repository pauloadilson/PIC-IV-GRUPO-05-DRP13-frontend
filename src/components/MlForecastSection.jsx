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

function HourlyLineChart({
  title,
  icon,
  data,
  valueKey,
  unit,
  strokeColor,
  gradientId,
  thresholdValue,
  thresholdLabel,
  clampPct = false
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return null;
  }

  const width = 620;
  const height = 240;
  const padLeft = 46;
  const padRight = 18;
  const padTop = 24;
  const padBottom = 46;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const values = data.map((d) => Number(d[valueKey]) || 0);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const spread = Math.max(rawMax - rawMin, 2);
  const margin = Math.max(spread * 0.2, 1.5);

  let yMin = Math.floor(rawMin - margin);
  let yMax = Math.ceil(rawMax + margin);

  if (clampPct) {
    yMin = Math.max(0, yMin);
    yMax = Math.min(100, Math.max(yMax, rawMax + 2));
  }
  if (yMax <= yMin) {
    yMax = yMin + 4;
  }

  const getX = (idx) =>
    padLeft + (data.length > 1 ? (idx / (data.length - 1)) * plotWidth : plotWidth / 2);
  const getY = (val) =>
    padTop + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;

  const points = data.map((pt, idx) => {
    const val = Number(pt[valueKey]) || 0;
    return {
      idx,
      x: getX(idx),
      y: getY(val),
      val,
      horizon: pt.horizon_hours,
      hourLabel: formatHourFromIso(pt.timestamp),
      isAboveThreshold: thresholdValue != null && val >= thresholdValue
    };
  });

  const linePath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padTop + plotHeight).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + plotHeight).toFixed(1)} Z`;

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = yMin + ((yMax - yMin) * i) / 4;
    return {
      val: Number(val.toFixed(1)),
      y: getY(val)
    };
  });

  const showThresholdLine =
    thresholdValue != null && thresholdValue >= yMin && thresholdValue <= yMax;
  const thresholdY = showThresholdLine ? getY(thresholdValue) : null;

  const activePoint = hoveredIndex != null ? points[hoveredIndex] : null;

  return (
    <div className="p-3 rounded-4 border bg-light h-100 d-flex flex-column justify-content-between">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <div className="d-flex align-items-center gap-2">
          <i className={`bi ${icon} fs-5`}></i>
          <div>
            <h5 className="h6 fw-bold text-dark mb-0">{title}</h5>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              Eixo X: Horário previsto (t+1h a t+24h)
            </span>
          </div>
        </div>

        {activePoint ? (
          <span className="badge bg-white text-dark border shadow-sm px-2.5 py-1.5">
            <span className="text-secondary me-1">
              {activePoint.hourLabel} (+{activePoint.horizon}h):
            </span>
            <strong style={{ color: strokeColor }}>
              {activePoint.val}
              {unit}
            </strong>
          </span>
        ) : (
          <span className="badge bg-white text-secondary border px-2.5 py-1.5" style={{ fontSize: '0.72rem' }}>
            Mín: <strong>{rawMin}{unit}</strong> &bull; Máx: <strong>{rawMax}{unit}</strong>
          </span>
        )}
      </div>

      <div className="w-100 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-100 h-auto d-block"
          style={{ minWidth: '460px' }}
          role="img"
          aria-label={`${title} de t+1h a t+24h`}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <title>{`${title} (t+1h a t+24h)`}</title>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grade Horizontal e Eixo Y */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={t.y}
                x2={width - padRight}
                y2={t.y}
                stroke="#dee2e6"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={t.y + 3}
                textAnchor="end"
                fill="#6c757d"
                fontSize="10"
              >
                { `${t.val}${unit}` }
              </text>
            </g>
          ))}

          {/* Linha de Limiar Configurado (quando estiver na escala visível) */}
          {showThresholdLine && (
            <g>
              <line
                x1={padLeft}
                y1={thresholdY}
                x2={width - padRight}
                y2={thresholdY}
                stroke="#dc3545"
                strokeDasharray="5 4"
                strokeWidth="1.2"
                opacity="0.75"
              />
              <text
                x={width - padRight - 4}
                y={thresholdY - 4}
                textAnchor="end"
                fill="#dc3545"
                fontSize="9.5"
                fontWeight="600"
              >
                {thresholdLabel}
              </text>
            </g>
          )}

          {/* Área sob a curva e Linha Principal */}
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Guia Vertical ao Passar o Mouse */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={padTop}
              x2={activePoint.x}
              y2={padTop + plotHeight}
              stroke={strokeColor}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          )}

          {/* Rótulos do Eixo X (Horas) */}
          {points.map((p, idx) => {
            const showLabel = idx % 2 === 0 || idx === points.length - 1;
            return (
              <g key={p.horizon}>
                <line
                  x1={p.x}
                  y1={padTop + plotHeight}
                  x2={p.x}
                  y2={padTop + plotHeight + (showLabel ? 5 : 3)}
                  stroke="#adb5bd"
                  strokeWidth="1"
                />
                {showLabel && (
                  <>
                    <text
                      x={p.x}
                      y={padTop + plotHeight + 16}
                      textAnchor="middle"
                      fill="#495057"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {p.hourLabel}
                    </text>
                    <text
                      x={p.x}
                      y={padTop + plotHeight + 28}
                      textAnchor="middle"
                      fill="#868e96"
                      fontSize="8.5"
                    >
                      +{p.horizon}h
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Pontos Horários e Áreas de Toque/Hover */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={p.horizon}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : p.isAboveThreshold ? 3.8 : 3}
                  fill={isHovered ? '#ffffff' : strokeColor}
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                />
                {isHovered && (
                  <g>
                    <rect
                      x={Math.min(Math.max(p.x - 30, padLeft), width - padRight - 60)}
                      y={Math.max(p.y - 26, 2)}
                      width="60"
                      height="18"
                      rx="4"
                      fill="#212529"
                      opacity="0.9"
                    />
                    <text
                      x={Math.min(Math.max(p.x, padLeft + 30), width - padRight - 30)}
                      y={Math.max(p.y - 14, 14)}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="700"
                    >
                      {`${p.val}${unit}`}
                    </text>
                  </g>
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="11"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onFocus={() => setHoveredIndex(idx)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function MlForecastSection({ mlForecast }) {
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

  const tempTrend = formatTrendLabel(indicators.temperature_trend);
  const humTrend = formatTrendLabel(indicators.humidity_trend);

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

        {/* 2. Alertas Preditivos Gerados pelo Modelo de ML */}
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
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
            <h4 className="h6 fw-bold text-dark mb-0">
              <i className="bi bi-graph-up text-primary me-1"></i>
              Trajetória Horária Prevista (t+1h a t+24h)
            </h4>
            <span className="small text-muted">
              Passe o cursor sobre os pontos para inspecionar o valor exato de cada hora
            </span>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <HourlyLineChart
                title="Temperatura Prevista (°C)"
                icon="bi-thermometer-half text-danger"
                data={forecast}
                valueKey="temperature_c"
                unit="°C"
                strokeColor="#dc3545"
                gradientId="ml-temp-line-grad"
                thresholdValue={tempSummary.configured_threshold_c ?? 30}
                thresholdLabel={`Limiar ${tempSummary.configured_threshold_c ?? 30}°C`}
              />
            </div>

            <div className="col-12 col-lg-6">
              <HourlyLineChart
                title="Umidade Relativa Prevista (%)"
                icon="bi-droplet-fill text-primary"
                data={forecast}
                valueKey="humidity_pct"
                unit="%"
                strokeColor="#0d6efd"
                gradientId="ml-hum-line-grad"
                thresholdValue={humSummary.configured_threshold_pct ?? 75}
                thresholdLabel={`Limiar ${humSummary.configured_threshold_pct ?? 75}%`}
                clampPct
              />
            </div>
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

