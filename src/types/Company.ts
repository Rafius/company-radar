export interface Company {
  id: string;
  name: string;
  ticker: string;
  currentPrice: number;
  targetPrice: number;
  dividendYield: number;
  peRatio: number;
  ebitda: number;
  marketCap: number;
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  sector: string;
}

export interface CompanyMetrics {
  company: Company;
  distanceToTarget: number;
  potentialReturn: number;
  score: number;
}

