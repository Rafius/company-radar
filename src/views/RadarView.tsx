import React from 'react';
import { Company } from '../types/Company';
import { calculateMetrics } from '../data/mockData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import './RadarView.css';

interface RadarViewProps {
  companies: Company[];
}

const RadarView: React.FC<RadarViewProps> = ({ companies }) => {
  const topCompanies = companies
    .map(company => ({
      company,
      metrics: calculateMetrics(company)
    }))
    .filter(item => item.metrics.potentialReturn > 0)
    .sort((a, b) => b.metrics.score - a.metrics.score)
    .slice(0, 6);

  const radarData = topCompanies.map(item => ({
    name: item.company.ticker,
    fullName: item.company.name,
    score: Math.round(item.metrics.score),
    potential: Math.round(item.metrics.potentialReturn),
    dividend: item.company.dividendYield * 10,
    growth: Math.max(0, item.company.revenueGrowth * 3),
    margin: item.company.profitMargin * 3
  }));

  return (
    <div className="radar-view">
      <div className="view-header">
        <h2>Radar de Oportunidades</h2>
        <p>Empresas con mayor potencial según precio objetivo y métricas clave</p>
      </div>

      <div className="radar-container">
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
            <Radar name="Score Total" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
            <Radar name="Potencial %" dataKey="potential" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="radar-cards">
        {topCompanies.map(item => (
          <div key={item.company.id} className="radar-card">
            <div className="radar-card-header">
              <div>
                <h3>{item.company.ticker}</h3>
                <p className="company-name">{item.company.name}</p>
              </div>
              <div className="score-badge" style={{
                background: item.metrics.score >= 70 ? '#10b981' : 
                           item.metrics.score >= 50 ? '#f59e0b' : '#ef4444'
              }}>
                {Math.round(item.metrics.score)}
              </div>
            </div>
            
            <div className="radar-card-metrics">
              <div className="metric-row">
                <span>Precio Actual:</span>
                <strong>${item.company.currentPrice.toFixed(2)}</strong>
              </div>
              <div className="metric-row">
                <span>Precio Objetivo:</span>
                <strong className="target-price">${item.company.targetPrice.toFixed(2)}</strong>
              </div>
              <div className="metric-row">
                <span>Potencial:</span>
                <strong className={item.metrics.potentialReturn > 0 ? 'positive' : 'negative'}>
                  {item.metrics.potentialReturn > 0 ? '+' : ''}{item.metrics.potentialReturn.toFixed(2)}%
                </strong>
              </div>
              <div className="metric-row">
                <span>Dividendo:</span>
                <strong>{item.company.dividendYield.toFixed(2)}%</strong>
              </div>
              <div className="metric-row">
                <span>Crecimiento:</span>
                <strong className={item.company.revenueGrowth > 0 ? 'positive' : 'negative'}>
                  {item.company.revenueGrowth > 0 ? '+' : ''}{item.company.revenueGrowth.toFixed(1)}%
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarView;

