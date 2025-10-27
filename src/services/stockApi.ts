import axios, { AxiosResponse } from 'axios'
import type { StockQuote, CompanyProfile, ApiError } from '@/types'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'
const FINNHUB_API_KEY = 'cu8bbo9r01qhqu5cjid0cu8bbo9r01qhqu5cjidg' 

class StockApiService {
  private baseURL: string
  private apiKey: string

  constructor(baseURL: string = FINNHUB_BASE_URL, apiKey: string = FINNHUB_API_KEY) {
    this.baseURL = baseURL
    this.apiKey = apiKey
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          token: this.apiKey,
          ...params
        },
        timeout: 10000
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = {
          message: error.response?.data?.error || error.message || 'API request failed',
          code: error.response?.status?.toString()
        }
        throw apiError
      }
      throw { message: 'Unknown error occurred' } as ApiError
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    return this.makeRequest<StockQuote>(`/quote`, { symbol })
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    return this.makeRequest<CompanyProfile>(`/stock/profile2`, { symbol })
  }

  async getStockData(symbol: string): Promise<{ quote: StockQuote; profile: CompanyProfile }> {
    try {
      const [quote, profile] = await Promise.all([
        this.getStockQuote(symbol),
        this.getCompanyProfile(symbol)
      ])
      return { quote, profile }
    } catch (error) {
      throw error
    }
  }
}

export const stockApiService = new StockApiService()
