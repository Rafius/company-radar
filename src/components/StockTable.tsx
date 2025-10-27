import React from 'react'
import { SortableHeader } from './SortableHeader'
import { StockRow } from './StockRow'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sortStocks } from '@/utils/stockUtils'
import type { Stock, SortField, SortConfig } from '@/types'

interface StockTableProps {
  stocks: Stock[]
  sortConfig: SortConfig
  onSort: (field: SortField) => void
  onRefreshStock?: (symbol: string) => Promise<void>
  onUpdateTargetPrice?: (symbol: string, targetPrice: number | undefined) => Promise<void>
  isLoading?: boolean
}

export const StockTable: React.FC<StockTableProps> = ({ 
  stocks, 
  sortConfig, 
  onSort, 
  onRefreshStock,
  onUpdateTargetPrice,
  isLoading = false 
}) => {
  const sortedStocks = sortStocks(stocks, sortConfig)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Monitoreadas</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Stock prices table">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <SortableHeader
                  field="symbol"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-left p-4 font-semibold"
                >
                  Símbolo
                </SortableHeader>
                <SortableHeader
                  field="name"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-left p-4 font-semibold hidden md:table-cell"
                >
                  Empresa
                </SortableHeader>
                <SortableHeader
                  field="price"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-right p-4 font-semibold"
                >
                  <div className="flex items-center justify-end gap-2">
                    Precio Actual
                  </div>
                </SortableHeader>
                <SortableHeader
                  field="targetPrice"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-right p-4 font-semibold"
                >
                  <div className="flex items-center justify-end gap-2">
                    Precio Objetivo
                  </div>
                </SortableHeader>
                <SortableHeader
                  field="difference"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-right p-4 font-semibold"
                >
                  <div className="flex items-center justify-end gap-2">
                    Diferencia
                  </div>
                </SortableHeader>
                <SortableHeader
                  field="change"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-right p-4 font-semibold"
                >
                  <div className="flex items-center justify-end gap-2">
                    Cambio Diario
                  </div>
                </SortableHeader>
                <SortableHeader
                  field="volume"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-right p-4 font-semibold hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-2">
                    Volumen
                  </div>
                </SortableHeader>
                <SortableHeader
                  field="marketCap"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-right p-4 font-semibold hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-2">
                    Cap. Mercado
                  </div>
                </SortableHeader>
                <SortableHeader
                  field="pe"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="text-right p-4 font-semibold hidden xl:table-cell"
                >
                  <div className="flex items-center justify-end gap-2">
                    P/E
                  </div>
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock, index) => (
                <StockRow 
                  key={stock.symbol} 
                  stock={stock} 
                  index={index}
                  onRefresh={onRefreshStock}
                  onUpdateTargetPrice={onUpdateTargetPrice}
                  isLoading={isLoading}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
