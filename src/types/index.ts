export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  pe: number
  trend: number[]
  targetPrice?: number
}

export interface StockQuote {
  c: number  // current price
  d: number  // change
  dp: number // percent change
  h: number  // high price of the day
  l: number  // low price of the day
  o: number  // open price of the day
  pc: number // previous close price
  t: number  // timestamp
}

export interface CompanyProfile {
  country: string
  currency: string
  exchange: string
  finnhubIndustry: string
  ipo: string
  logo: string
  marketCapitalization: number
  name: string
  phone: string
  shareOutstanding: number
  ticker: string
  weburl: string
}

export type SortField = 'symbol' | 'name' | 'price' | 'targetPrice' | 'difference' | 'change' | 'volume' | 'marketCap' | 'pe'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export interface StockFormData {
  symbol: string
  targetPrice: string
}

export interface ApiError {
  message: string
  code?: string
}