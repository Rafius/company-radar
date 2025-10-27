import React from 'react';
import { Company } from '../types/Company';
import { calculateMetrics } from '../data/mockData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend } from 'recharts';
import './BubbleView.css';

interface BubbleViewProps {
  companies: Company[];
}

const BubbleView: React.FC<BubbleViewProps> = ({ companies }) => {
  const companiesWithMetrics = companies.map(company => ({
    company,
    metrics: calculateMetrics(company)
  }));

  const bubbleData = companiesWithMetrics.map(({ company, metrics }) => ({
    x: metrics.potentialReturn,
    y: company.dividendYield,
    z: company.marketCap / 1e9,
    name: company.ticker,
    fullName: company.name,
    score: metrics.score,
    peRatio: company.peRatio,
    growth: company.revenueGrowth,
    margin: company.profitMargin,
    sector: company.sector
  }));

  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <h4>{data.fullName} ({data.name})</h4>
          <div className="tooltip-content">
            <p><strong>Potencial:</strong> {data.x.toFixed(2)}%</p>
            <p><strong>Dividendo:</strong> {data.y.toFixed(2)}%</p>
            <p><strong>Market Cap:</strong> ${data.z.toFixed(2)}B</p>
            <p><strong>Score:</strong> {Math.round(data.score)}/100</p>
            <p><strong>P/E Ratio:</strong> {data.peRatio.toFixed(1)}</p>
            <p><strong>Sector:</strong> {data.sector}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const topOpportunities = companiesWithMetrics
    .filter(item => item.metrics.potentialReturn > 0)
    .sort((a, b) => b.metrics.score - a.metrics.score)
    .slice(0, 5);

  return (
    <div className="bubble-view">
      <div className="view-header">
        <h2>Gráfico de Burbujas</h2>
        <p>Potencial vs Dividendo (tamaño = capitalización de mercado)</p>
      </div>

      <div className="bubble-chart-container">
        <ResponsiveContainer width="100%" height={600}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 80, left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Potencial de Retorno"
              label={{ value: 'Potencial de Retorno (%)', position: 'bottom', offset: 50, fill: '#cbd5e1' }}
              tick={{ fill: '#cbd5e1' }}
              stroke="#475569"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Dividendo"
              label={{ value: 'Dividendo Yield (%)', angle: -90, position: 'left', offset: 50, fill: '#cbd5e1' }}
              tick={{ fill: '#cbd5e1' }}
              stroke="#475569"
            />
            <ZAxis type="number" dataKey="z" range={[100, 2000]} name="Market Cap" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#cbd5e1', paddingTop: '20px' }}
              formatter={() => 'Empresas'}
            />
            <Scatter 
              name="Empresas" 
              data={bubbleData} 
              fill="#2563eb"
              fillOpacity={0.7}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="bubble-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#2563eb' }}></div>
          <span>El tamaño de la burbuja representa la capitalización de mercado</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator">↗</div>
          <span>Zona superior derecha = Alto potencial + Alto dividendo</span>
        </div>
      </div>

      <div className="bubble-insights">
        <h3>Top 5 Oportunidades</h3>
        <div className="insights-grid">
          {topOpportunities.map(({ company, metrics }) => (
            <div key={company.id} className="insight-card">
              <div className="insight-header">
                <div>
                  <h4>{company.ticker}</h4>
                  <p>{company.name}</p>
                </div>
                <div className="insight-score" style={{
                  background: metrics.score >= 70 ? '#10b981' : 
                             metrics.score >= 50 ? '#f59e0b' : '#ef4444'
                }}>
                  {Math.round(metrics.score)}
                </div>
              </div>
              <div className="insight-metrics">
                <div className="insight-metric">
                  <span>Potencial</span>
                  <strong className="positive">+{metrics.potentialReturn.toFixed(1)}%</strong>
                </div>
                <div className="insight-metric">
                  <span>Dividendo</span>
                  <strong>{company.dividendYield.toFixed(2)}%</strong>
                </div>
                <div className="insight-metric">
                  <span>Crecimiento</span>
                  <strong className={company.revenueGrowth > 0 ? 'positive' : 'negative'}>
                    {company.revenueGrowth > 0 ? '+' : ''}{company.revenueGrowth.toFixed(1)}%
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BubbleView;

