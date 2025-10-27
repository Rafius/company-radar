import React from "react";
import { Company } from "../types/Company";
import { calculateMetrics } from "../data/mockData";
import "./GridView.css";

interface GridViewProps {
  companies: Company[];
}

const GridView: React.FC<GridViewProps> = ({ companies }) => {
  const companiesWithMetrics = companies
    .map((company) => ({
      company,
      metrics: calculateMetrics(company)
    }))
    .sort((a, b) => b.metrics.potentialReturn - a.metrics.potentialReturn);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="grid-view">
      <div className="view-header">
        <h2>Vista de Tarjetas Detalladas</h2>
        <p>Análisis completo de métricas financieras por empresa</p>
      </div>

      <div className="grid-cards">
        {companiesWithMetrics.map(({ company, metrics }) => (
          <div key={company.id} className="grid-card">
            <div className="grid-card-header">
              <div className="card-title-section">
                <h3>{company.name}</h3>
                <span className="ticker-badge">{company.ticker}</span>
              </div>
              <div className="sector-badge">{company.sector}</div>
            </div>

            <div className="price-section">
              <div className="price-item">
                <span className="price-label">Precio Actual</span>
                <span className="price-value">
                  ${company.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="price-arrow">→</div>
              <div className="price-item">
                <span className="price-label">Precio Objetivo</span>
                <span className="price-value target">
                  ${company.targetPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="potential-bar">
              <div
                className="potential-fill"
                style={{
                  width: `${Math.min(Math.abs(metrics.potentialReturn), 100)}%`,
                  background:
                    metrics.potentialReturn > 0
                      ? "linear-gradient(90deg, #10b981, #059669)"
                      : "linear-gradient(90deg, #ef4444, #dc2626)"
                }}
              >
                <span className="potential-text">
                  {metrics.potentialReturn > 0 ? "+" : ""}
                  {metrics.potentialReturn.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-icon">💰</div>
                <div className="metric-content">
                  <span className="metric-label">Dividendo</span>
                  <span className="metric-value">
                    {company.dividendYield.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <span className="metric-label">P/E Ratio</span>
                  <span className="metric-value">
                    {company.peRatio.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">📈</div>
                <div className="metric-content">
                  <span className="metric-label">Crecimiento</span>
                  <span
                    className={`metric-value ${
                      company.revenueGrowth > 0 ? "positive" : "negative"
                    }`}
                  >
                    {company.revenueGrowth > 0 ? "+" : ""}
                    {company.revenueGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">💹</div>
                <div className="metric-content">
                  <span className="metric-label">Margen</span>
                  <span className="metric-value">
                    {company.profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">🏢</div>
                <div className="metric-content">
                  <span className="metric-label">Market Cap</span>
                  <span className="metric-value">
                    {formatNumber(company.marketCap)}
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">📉</div>
                <div className="metric-content">
                  <span className="metric-label">EBITDA</span>
                  <span className="metric-value">
                    {formatNumber(company.ebitda)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="score-indicator">
                <span>Score de Inversión</span>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${metrics.score}%`,
                      background:
                        metrics.score >= 70
                          ? "#10b981"
                          : metrics.score >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                    }}
                  ></div>
                </div>
                <span className="score-number">
                  {Math.round(metrics.score)}/100
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridView;
