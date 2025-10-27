import type { Stock, SortConfig } from '@/types'

export const getPriceDifference = (currentPrice: number, targetPrice?: number): number | null => {
  if (!targetPrice || currentPrice === 0) return null
  return currentPrice - targetPrice
}

export const parseNumericValue = (value: string): number => {
  return Number.parseFloat(value.replace(/[^\d.]/g, '')) || 0
}

export const sortStocks = (stocks: Stock[], sortConfig: SortConfig): Stock[] => {
  return [...stocks].sort((a, b) => {
    let aValue: string | number | undefined
    let bValue: string | number | undefined

    switch (sortConfig.field) {
      case 'symbol':
        aValue = a.symbol
        bValue = b.symbol
        break
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'targetPrice':
        aValue = a.targetPrice ?? 0
        bValue = b.targetPrice ?? 0
        break
      case 'difference':
        aValue = getPriceDifference(a.price, a.targetPrice) ?? 0
        bValue = getPriceDifference(b.price, b.targetPrice) ?? 0
        break
      case 'change':
        aValue = a.change
        bValue = b.change
        break
      case 'volume':
        aValue = parseNumericValue(a.volume)
        bValue = parseNumericValue(b.volume)
        break
      case 'marketCap':
        aValue = parseNumericValue(a.marketCap)
        bValue = parseNumericValue(b.marketCap)
        break
      case 'pe':
        aValue = a.pe
        bValue = b.pe
        break
    }

    if (aValue === undefined) aValue = 0
    if (bValue === undefined) bValue = 0

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return sortConfig.direction === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })
}
