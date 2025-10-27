import React, { useState } from "react";
import { Company } from "../types/Company";
import { calculateMetrics } from "../data/mockData";
import "./TableView.css";

interface TableViewProps {
  companies: Company[];
  onAddCompany: (company: Company) => void;
}

interface CompanyWithMetrics {
  company: Company;
  metrics: {
    distanceToTarget: number;
    potentialReturn: number;
    score: number;
  };
}

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface HistoricalPrice {
  date: string;
  close: number;
}

type SortField =
  | "name"
  | "sector"
  | "currentPrice"
  | "targetPrice"
  | "difference"
  | "percentage";
type SortDirection = "asc" | "desc";

const TableView: React.FC<TableViewProps> = ({ companies, onAddCompany }) => {
  const [ticker, setTicker] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "error" | "success" | "info";
    text: string;
  } | null>(null);
  const [sortField, setSortField] = useState<SortField>("percentage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [loadingChart, setLoadingChart] = useState<boolean>(false);

  const API_KEY = "demo"; // Replace with your Alpha Vantage API key - Get free at: https://www.alphavantage.co/support/#api-key

  const fetchStockData = async (symbol: string): Promise<StockQuote | null> => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (data["Error Message"]) {
        throw new Error("Invalid ticker symbol");
      }

      if (data["Note"]) {
        throw new Error("API call limit reached. Please wait a minute.");
      }

      const quote = data["Global Quote"];

      if (!quote || !quote["05. price"]) {
        throw new Error("No data found for this ticker");
      }

      return {
        symbol: quote["01. symbol"],
        name: symbol,
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace("%", ""))
      };
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return null;
    }
  };

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    if (!ticker.trim()) {
      setMessage({ type: "error", text: "Please enter a ticker symbol" });
      return;
    }

    if (!targetPrice.trim() || parseFloat(targetPrice) <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid target price"
      });
      return;
    }

    setLoading(true);

    const stockData = await fetchStockData(ticker.toUpperCase());

    if (!stockData) {
      setMessage({
        type: "error",
        text: `Could not fetch data for ${ticker.toUpperCase()}. Please verify the ticker symbol.`
      });
      setLoading(false);
      return;
    }

    const newCompany: Company = {
      id: `custom-${Date.now()}`,
      name: stockData.name,
      ticker: stockData.symbol,
      currentPrice: stockData.price,
      targetPrice: parseFloat(targetPrice),
      dividendYield: 0,
      peRatio: 0,
      ebitda: 0,
      marketCap: 0,
      revenueGrowth: 0,
      profitMargin: 0,
      debtToEquity: 0,
      sector: "Custom"
    };

    onAddCompany(newCompany);
    setMessage({
      type: "success",
      text: `${
        stockData.symbol
      } added successfully at $${stockData.price.toFixed(2)}`
    });
    setTicker("");
    setTargetPrice("");
    setLoading(false);
  };

  const fetchHistoricalData = async (
    symbol: string
  ): Promise<HistoricalPrice[]> => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (data["Error Message"]) {
        throw new Error("Invalid ticker symbol");
      }

      if (data["Note"]) {
        throw new Error("API call limit reached. Please wait a minute.");
      }

      const timeSeries = data["Time Series (Daily)"];

      if (!timeSeries) {
        throw new Error("No historical data found");
      }

      const prices: HistoricalPrice[] = [];
      const dates = Object.keys(timeSeries).sort().reverse();

      // Get last 365 days
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      for (const date of dates) {
        const priceDate = new Date(date);
        if (priceDate >= oneYearAgo) {
          prices.push({
            date,
            close: parseFloat(timeSeries[date]["4. close"])
          });
        }
      }

      return prices.reverse();
    } catch (error) {
      console.error("Error fetching historical data:", error);
      return [];
    }
  };

  const handleViewChart = async (ticker: string): Promise<void> => {
    setSelectedCompany(ticker);
    setLoadingChart(true);
    const data = await fetchHistoricalData(ticker);
    setHistoricalData(data);
    setLoadingChart(false);
  };

  const closeChart = (): void => {
    setSelectedCompany(null);
    setHistoricalData([]);
  };

  const companiesWithMetrics: CompanyWithMetrics[] = companies.map(
    (company) => ({
      company,
      metrics: calculateMetrics(company)
    })
  );

  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Calculate buy opportunity percentage (current price above target = good opportunity)
  const calculateBuyOpportunity = (
    currentPrice: number,
    targetPrice: number
  ): number => {
    return ((currentPrice - targetPrice) / currentPrice) * 100;
  };

  const calculatePriceDifference = (
    currentPrice: number,
    targetPrice: number
  ): number => {
    return currentPrice - targetPrice;
  };

  const sortedCompanies = [...companiesWithMetrics].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case "name":
        aValue = a.company.name;
        bValue = b.company.name;
        break;
      case "sector":
        aValue = a.company.sector;
        bValue = b.company.sector;
        break;
      case "currentPrice":
        aValue = a.company.currentPrice;
        bValue = b.company.currentPrice;
        break;
      case "targetPrice":
        aValue = a.company.targetPrice;
        bValue = b.company.targetPrice;
        break;
      case "difference":
        aValue = calculatePriceDifference(
          a.company.currentPrice,
          a.company.targetPrice
        );
        bValue = calculatePriceDifference(
          b.company.currentPrice,
          b.company.targetPrice
        );
        break;
      case "percentage":
        aValue = calculateBuyOpportunity(
          a.company.currentPrice,
          a.company.targetPrice
        );
        bValue = calculateBuyOpportunity(
          b.company.currentPrice,
          b.company.targetPrice
        );
        break;
      default:
        aValue = 0;
        bValue = 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon">⇅</span>;
    return (
      <span className="sort-icon active">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="table-view">
      <div className="view-header">
        <h2>Radar de Compra</h2>
        <p>
          Empresas ordenadas por oportunidad de compra • Verde = Precio alto,
          esperar bajada • Rojo = Cerca del objetivo, momento de comprar
        </p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <label htmlFor="ticker">Ticker Symbol</label>
            <input
              id="ticker"
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="e.g., AAPL, MSFT, GOOGL"
              disabled={loading}
            />
          </div>
          <div className="search-input-group">
            <label htmlFor="targetPrice">Precio Objetivo de Compra ($)</label>
            <input
              id="targetPrice"
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g., 150.00"
              disabled={loading}
            />
          </div>
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? "Buscando..." : "Añadir al Radar"}
          </button>
        </form>
        {message && (
          <div className={`search-message ${message.type}`}>{message.text}</div>
        )}
      </div>

      <div className="table-container unified">
        <table className="companies-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Empresa <SortIcon field="name" />
              </th>
              <th onClick={() => handleSort("sector")}>
                Sector <SortIcon field="sector" />
              </th>
              <th onClick={() => handleSort("currentPrice")}>
                Precio Actual <SortIcon field="currentPrice" />
              </th>
              <th onClick={() => handleSort("targetPrice")}>
                Precio Objetivo <SortIcon field="targetPrice" />
              </th>
              <th onClick={() => handleSort("difference")}>
                Diferencia <SortIcon field="difference" />
              </th>
              <th onClick={() => handleSort("percentage")}>
                % Sobre Objetivo <SortIcon field="percentage" />
              </th>
              <th>Evolución</th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map(({ company }) => {
              const buyOpportunity = calculateBuyOpportunity(
                company.currentPrice,
                company.targetPrice
              );
              const priceDiff = calculatePriceDifference(
                company.currentPrice,
                company.targetPrice
              );
              const isGoodBuy = buyOpportunity < 5; // Less than 5% above target

              return (
                <tr
                  key={company.id}
                  className={isGoodBuy ? "highlight-buy" : ""}
                >
                  <td>
                    <div className="company-cell">
                      <strong>{company.name}</strong>
                      <span className="ticker">{company.ticker}</span>
                    </div>
                  </td>
                  <td>
                    <span className="sector-tag">{company.sector}</span>
                  </td>
                  <td className="price-cell">
                    ${company.currentPrice.toFixed(2)}
                  </td>
                  <td className="price-cell target">
                    ${company.targetPrice.toFixed(2)}
                  </td>
                  <td
                    className={`price-cell ${
                      priceDiff > 0 ? "far-from-target" : "near-target"
                    }`}
                  >
                    {priceDiff > 0 ? "+" : ""}${priceDiff.toFixed(2)}
                  </td>
                  <td className="percentage-cell">
                    <div className="percentage-content">
                      <span
                        className={`percentage-value ${
                          buyOpportunity > 10
                            ? "far-from-target"
                            : buyOpportunity > 5
                            ? "moderate"
                            : "near-target"
                        }`}
                      >
                        {buyOpportunity > 0 ? "+" : ""}
                        {buyOpportunity.toFixed(2)}%
                      </span>
                      <div className="percentage-bar">
                        <div
                          className="percentage-fill"
                          style={{
                            width: `${Math.min(
                              Math.abs(buyOpportunity),
                              100
                            )}%`,
                            background:
                              buyOpportunity > 10
                                ? "linear-gradient(90deg, #10b981, #059669)"
                                : buyOpportunity > 5
                                ? "linear-gradient(90deg, #f59e0b, #d97706)"
                                : "linear-gradient(90deg, #ef4444, #dc2626)"
                          }}
                        ></div>
                      </div>
                      {isGoodBuy && (
                        <span className="buy-signal">🎯 ¡COMPRAR!</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="chart-btn"
                      onClick={() => handleViewChart(company.ticker)}
                    >
                      📈 Ver Gráfica
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedCompany && (
        <div className="chart-modal" onClick={closeChart}>
          <div className="chart-content" onClick={(e) => e.stopPropagation()}>
            <div className="chart-header">
              <h3>Evolución del Precio - {selectedCompany}</h3>
              <button className="close-btn" onClick={closeChart}>
                ✕
              </button>
            </div>
            {loadingChart ? (
              <div className="chart-loading">Cargando datos...</div>
            ) : historicalData.length > 0 ? (
              <div className="chart-container-svg">
                <svg viewBox="0 0 800 400" className="price-chart">
                  <defs>
                    <linearGradient
                      id="priceGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#2563eb", stopOpacity: 0.3 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#2563eb", stopOpacity: 0 }}
                      />
                    </linearGradient>
                  </defs>

                  {(() => {
                    const prices = historicalData.map((d) => d.close);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    const priceRange = maxPrice - minPrice;
                    const padding = 40;
                    const chartHeight = 400 - padding * 2;
                    const chartWidth = 800 - padding * 2;

                    const points = historicalData
                      .map((d, i) => {
                        const x =
                          padding +
                          (i / (historicalData.length - 1)) * chartWidth;
                        const y =
                          padding +
                          chartHeight -
                          ((d.close - minPrice) / priceRange) * chartHeight;
                        return `${x},${y}`;
                      })
                      .join(" ");

                    const areaPoints = `${padding},${
                      padding + chartHeight
                    } ${points} ${padding + chartWidth},${
                      padding + chartHeight
                    }`;

                    return (
                      <>
                        <polyline
                          fill="url(#priceGradient)"
                          points={areaPoints}
                        />
                        <polyline
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          points={points}
                        />

                        <line
                          x1={padding}
                          y1={padding + chartHeight}
                          x2={padding + chartWidth}
                          y2={padding + chartHeight}
                          stroke="#475569"
                          strokeWidth="1"
                        />
                        <line
                          x1={padding}
                          y1={padding}
                          x2={padding}
                          y2={padding + chartHeight}
                          stroke="#475569"
                          strokeWidth="1"
                        />

                        <text
                          x={padding - 10}
                          y={padding}
                          fill="#94a3b8"
                          fontSize="12"
                          textAnchor="end"
                        >
                          ${maxPrice.toFixed(2)}
                        </text>
                        <text
                          x={padding - 10}
                          y={padding + chartHeight}
                          fill="#94a3b8"
                          fontSize="12"
                          textAnchor="end"
                        >
                          ${minPrice.toFixed(2)}
                        </text>

                        <text
                          x={padding}
                          y={padding + chartHeight + 25}
                          fill="#94a3b8"
                          fontSize="12"
                        >
                          {historicalData[0]?.date}
                        </text>
                        <text
                          x={padding + chartWidth}
                          y={padding + chartHeight + 25}
                          fill="#94a3b8"
                          fontSize="12"
                          textAnchor="end"
                        >
                          {historicalData[historicalData.length - 1]?.date}
                        </text>
                      </>
                    );
                  })()}
                </svg>
                <div className="chart-stats">
                  <div className="stat">
                    <span className="stat-label">Precio Actual:</span>
                    <span className="stat-value">
                      $
                      {historicalData[historicalData.length - 1]?.close.toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Máximo 1 año:</span>
                    <span className="stat-value">
                      $
                      {Math.max(...historicalData.map((d) => d.close)).toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Mínimo 1 año:</span>
                    <span className="stat-value">
                      $
                      {Math.min(...historicalData.map((d) => d.close)).toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="chart-error">
                No se pudieron cargar los datos históricos. Verifica que la API
                key esté configurada correctamente.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;
