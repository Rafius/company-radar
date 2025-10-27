import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, ArrowUpDown, Plus, Target, ArrowUp, ArrowDown } from "lucide-react"
import { mockStocks } from "@/lib/stock-data"
import { useState } from "react"
import type { Stock } from "@/lib/stock-data"

type SortField = 'symbol' | 'name' | 'price' | 'targetPrice' | 'difference' | 'change' | 'volume' | 'marketCap' | 'pe'
type SortDirection = 'asc' | 'desc' | 'none'

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks)
  const [newSymbol, setNewSymbol] = useState("")
  const [targetPrice, setTargetPrice] = useState("")
  const [sortField, setSortField] = useState<SortField>('symbol')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleAddStock = () => {
    if (!newSymbol.trim()) return

    const newStock: Stock = {
      symbol: newSymbol.toUpperCase(),
      name: `${newSymbol.toUpperCase()} Company`,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: "0",
      marketCap: "N/A",
      pe: 0,
      trend: [0, 0, 0, 0, 0, 0, 0],
      targetPrice: targetPrice ? Number.parseFloat(targetPrice) : undefined,
    }

    setStocks([...stocks, newStock])
    setNewSymbol("")
    setTargetPrice("")
  }

  const getPriceDifference = (currentPrice: number, targetPrice?: number) => {
    if (!targetPrice || currentPrice === 0) return null
    return currentPrice - targetPrice
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> none
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortedStocks = (): Stock[] => {
    if (sortDirection === 'none') return stocks

    return [...stocks].sort((a, b) => {
      let aValue: string | number | undefined
      let bValue: string | number | undefined

      switch (sortField) {
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
          aValue = Number.parseFloat(a.volume.replace(/[^\d.]/g, '')) || 0
          bValue = Number.parseFloat(b.volume.replace(/[^\d.]/g, '')) || 0
          break
        case 'marketCap':
          aValue = Number.parseFloat(a.marketCap.replace(/[^\d.]/g, '')) || 0
          bValue = Number.parseFloat(b.marketCap.replace(/[^\d.]/g, '')) || 0
          break
        case 'pe':
          aValue = a.pe
          bValue = b.pe
          break
      }

      if (aValue === undefined) aValue = 0
      if (bValue === undefined) bValue = 0

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4" />
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4" />
    return <ArrowUpDown className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Radar de Precios</h1>
          <p className="text-muted-foreground mt-2">Monitorea cuando alcanzar tu precio objetivo</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Añadir Nueva Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Símbolo (ej: AAPL)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddStock()}
                  className="uppercase"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Precio objetivo"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddStock()}
                  step="0.01"
                />
              </div>
              <Button onClick={handleAddStock} className="sm:w-auto">
                <Plus className="mr-2 w-4 h-4" />
                Añadir
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Monitoreadas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th 
                      className="text-left p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('symbol')}
                    >
                      <div className="flex items-center gap-2">
                        Símbolo {getSortIcon('symbol')}
                      </div>
                    </th>
                    <th 
                      className="text-left p-4 font-semibold hidden md:table-cell cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Empresa {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Precio Actual {getSortIcon('price')}
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('targetPrice')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Precio Objetivo {getSortIcon('targetPrice')}
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('difference')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Diferencia {getSortIcon('difference')}
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('change')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Cambio Diario {getSortIcon('change')}
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold hidden lg:table-cell cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('volume')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Volumen {getSortIcon('volume')}
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold hidden lg:table-cell cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('marketCap')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Cap. Mercado {getSortIcon('marketCap')}
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold hidden xl:table-cell cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort('pe')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        P/E {getSortIcon('pe')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedStocks().map((stock, index) => {
                    const priceDiff = getPriceDifference(stock.price, stock.targetPrice)
                    const isTargetReached = priceDiff !== null && priceDiff <= 0

                    return (
                      <tr
                        key={stock.symbol}
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          isTargetReached ? "bg-success/10" : index % 2 === 0 ? "bg-card" : "bg-muted/10"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-lg">{stock.symbol}</div>
                            {isTargetReached && <Target className="w-5 h-5 text-success" />}
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="text-sm text-muted-foreground max-w-[200px] truncate">{stock.name}</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-semibold text-lg">${stock.price.toFixed(2)}</div>
                        </td>
                        <td className="p-4 text-right">
                          {stock.targetPrice ? (
                            <div className="font-medium text-lg">${stock.targetPrice.toFixed(2)}</div>
                          ) : (
                            <div className="text-sm text-muted-foreground">-</div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {priceDiff !== null ? (
                            <div className="flex flex-col items-end">
                              <div
                                className={`font-semibold text-base ${
                                  isTargetReached ? "text-success" : "text-muted-foreground"
                                }`}
                              >
                                {priceDiff > 0 ? "+" : ""}${priceDiff.toFixed(2)}
                              </div>
                              {isTargetReached ? (
                                <Badge variant="default" className="mt-1 bg-success text-success-foreground">
                                  ¡COMPRAR!
                                </Badge>
                              ) : (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Faltan ${Math.abs(priceDiff).toFixed(2)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">-</div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div
                            className={`flex items-center justify-end gap-1 ${
                              stock.change >= 0 ? "text-success" : "text-destructive"
                            }`}
                          >
                            {stock.change >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <div>
                              <div className="font-medium">
                                {stock.change >= 0 ? "+" : ""}
                                {stock.change.toFixed(2)}
                              </div>
                              <div className="text-xs">
                                ({stock.changePercent >= 0 ? "+" : ""}
                                {stock.changePercent.toFixed(2)}%)
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right hidden lg:table-cell">
                          <div className="text-sm">{stock.volume}</div>
                        </td>
                        <td className="p-4 text-right hidden lg:table-cell">
                          <div className="text-sm">{stock.marketCap}</div>
                        </td>
                        <td className="p-4 text-right hidden xl:table-cell">
                          <div className="text-sm">{stock.pe}</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
