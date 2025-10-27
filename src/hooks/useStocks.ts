import { useState } from 'react'
import { mockStocks } from '@/lib/stock-data'
import type { Stock, StockFormData } from '@/types'

export const useStocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([...mockStocks] as unknown as Stock[])

  const addStock = (formData: StockFormData): void => {
    if (!formData.symbol.trim()) return

    const newStock: Stock = {
      symbol: formData.symbol.toUpperCase(),
      name: `${formData.symbol.toUpperCase()} Company`,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: "0",
      marketCap: "N/A",
      pe: 0,
      trend: [0, 0, 0, 0, 0, 0, 0],
      targetPrice: formData.targetPrice ? Number.parseFloat(formData.targetPrice) : undefined,
    }

    setStocks(prevStocks => [...prevStocks, newStock])
  }

  return {
    stocks,
    addStock,
  }
}
