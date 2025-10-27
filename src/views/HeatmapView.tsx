import React, { useState } from "react";
import { Company } from "../types/Company";
import { calculateMetrics } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import "./HeatmapView.css";

interface HeatmapViewProps {
  companies: Company[];
}

type MetricType =
  | "potentialReturn"
  | "dividendYield"
  | "revenueGrowth"
  | "profitMargin"
  | "score";

interface MetricOption {
  value: MetricType;
  label: string;
  description: string;
}

const HeatmapView: React.FC<HeatmapViewProps> = ({ companies }) => {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricType>("potentialReturn");

  const metrics: MetricOption[] = [
    {
      value: "potentialReturn",
      label: "Potencial de Retorno",
      description: "Distancia al precio objetivo"
    },
    {
      value: "dividendYield",
      label: "Dividendo Yield",
      description: "Rentabilidad por dividendo"
    },
    {
      value: "revenueGrowth",
      label: "Crecimiento",
      description: "Crecimiento de ingresos"
    },
    {
      value: "profitMargin",
      label: "Margen de Beneficio",
      description: "Margen de ganancia"
    },
    { value: "score", label: "Score Total", description: "Puntuación general" }
  ];

  const companiesWithMetrics = companies.map((company) => ({
    company,
    metrics: calculateMetrics(company)
  }));

  const getMetricValue = (
    company: Company,
    metrics: {
      distanceToTarget: number;
      potentialReturn: number;
      score: number;
    },
    metric: MetricType
  ): number => {
    if (metric === "potentialReturn" || metric === "score") {
      return metrics[metric];
    }
    return company[metric];
  };

  const chartData = companiesWithMetrics
    .map(({ company, metrics }) => ({
      name: company.ticker,
      fullName: company.name,
      value: getMetricValue(company, metrics, selectedMetric),
      sector: company.sector,
      currentPrice: company.currentPrice,
      targetPrice: company.targetPrice
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);

  const getColor = (value: number, metric: MetricType): string => {
    if (metric === "score") {
      if (value >= 70) return "#10b981";
      if (value >= 50) return "#f59e0b";
      return "#ef4444";
    }

    if (metric === "potentialReturn" || metric === "revenueGrowth") {
      if (value > 20) return "#10b981";
      if (value > 10) return "#3b82f6";
      if (value > 0) return "#f59e0b";
      return "#ef4444";
    }

    if (metric === "dividendYield") {
      if (value >= 5) return "#10b981";
      if (value >= 3) return "#3b82f6";
      if (value >= 1) return "#f59e0b";
      return "#94a3b8";
    }

    if (metric === "profitMargin") {
      if (value >= 25) return "#10b981";
      if (value >= 15) return "#3b82f6";
      if (value >= 10) return "#f59e0b";
      return "#ef4444";
    }

    return "#3b82f6";
  };

  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="heatmap-tooltip">
          <h4>{data.fullName}</h4>
          <p className="tooltip-ticker">{data.name}</p>
          <div className="tooltip-divider"></div>
          <p>
            <strong>
              {metrics.find((m) => m.value === selectedMetric)?.label}:
            </strong>{" "}
            {data.value.toFixed(2)}
            {selectedMetric === "score" ? "/100" : "%"}
          </p>
          <p>
            <strong>Sector:</strong> {data.sector}
          </p>
          <p>
            <strong>Precio:</strong> ${data.currentPrice.toFixed(2)} → $
            {data.targetPrice.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const heatmapData = companiesWithMetrics
    .map(({ company, metrics }) => ({
      company,
      metrics,
      value: getMetricValue(company, metrics, selectedMetric)
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="heatmap-view">
      <div className="view-header">
        <h2>Mapa de Calor y Comparativas</h2>
        <p>Visualización comparativa de métricas clave por empresa</p>
      </div>

      <div className="metric-selector">
        <label>Seleccionar Métrica:</label>
        <div className="metric-buttons">
          {metrics.map((metric) => (
            <button
              key={metric.value}
              className={`metric-button ${
                selectedMetric === metric.value ? "active" : ""
              }`}
              onClick={() => setSelectedMetric(metric.value)}
              title={metric.description}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-section">
        <h3>Ranking de Empresas</h3>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              stroke="#475569"
            />
            <YAxis type="number" tick={{ fill: "#cbd5e1" }} stroke="#475569" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={() =>
                metrics.find((m) => m.value === selectedMetric)?.label || ""
              }
              wrapperStyle={{ color: "#cbd5e1" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.value, selectedMetric)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="heatmap-grid-section">
        <h3>Mapa de Calor Completo</h3>
        <div className="heatmap-grid">
          {heatmapData.map(({ company, value }) => (
            <div
              key={company.id}
              className="heatmap-cell"
              style={{
                background: `linear-gradient(135deg, ${getColor(
                  value,
                  selectedMetric
                )}22, ${getColor(value, selectedMetric)}44)`,
                borderColor: getColor(value, selectedMetric)
              }}
            >
              <div className="heatmap-cell-header">
                <span className="heatmap-ticker">{company.ticker}</span>
                <span
                  className="heatmap-value"
                  style={{ color: getColor(value, selectedMetric) }}
                >
                  {value.toFixed(1)}
                  {selectedMetric === "score" ? "" : "%"}
                </span>
              </div>
              <div className="heatmap-cell-name">{company.name}</div>
              <div className="heatmap-cell-sector">{company.sector}</div>
              <div className="heatmap-cell-bar">
                <div
                  className="heatmap-cell-bar-fill"
                  style={{
                    width: `${Math.min(Math.abs(value), 100)}%`,
                    background: getColor(value, selectedMetric)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="legend-section">
        <h4>Leyenda de Colores</h4>
        <div className="color-legend">
          <div className="color-legend-item">
            <div className="color-box" style={{ background: "#10b981" }}></div>
            <span>Excelente</span>
          </div>
          <div className="color-legend-item">
            <div className="color-box" style={{ background: "#3b82f6" }}></div>
            <span>Bueno</span>
          </div>
          <div className="color-legend-item">
            <div className="color-box" style={{ background: "#f59e0b" }}></div>
            <span>Moderado</span>
          </div>
          <div className="color-legend-item">
            <div className="color-box" style={{ background: "#ef4444" }}></div>
            <span>Bajo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;
