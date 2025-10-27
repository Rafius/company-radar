import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw, AlertCircle } from "lucide-react"
import type { StockFormData, ApiError } from '@/types'

interface StockFormProps {
  onAddStock: (formData: StockFormData) => Promise<void>
  onRefreshAll: () => Promise<void>
  isLoading: boolean
  error: ApiError | null
}

export const StockForm: React.FC<StockFormProps> = ({ 
  onAddStock, 
  onRefreshAll, 
  isLoading, 
  error 
}) => {
  const [formData, setFormData] = React.useState<StockFormData>({
    symbol: "",
    targetPrice: ""
  })

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onAddStock(formData)
    setFormData({ symbol: "", targetPrice: "" })
  }

  const handleInputChange = (field: keyof StockFormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Añadir Nueva Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{error.message}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Símbolo (ej: AAPL)"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                className="uppercase"
                aria-label="Stock symbol"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Precio objetivo"
                value={formData.targetPrice}
                onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                step="0.01"
                aria-label="Target price"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="sm:w-auto"
              disabled={isLoading}
            >
              <Plus className="mr-2 w-4 h-4" />
              {isLoading ? 'Añadiendo...' : 'Añadir'}
            </Button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={onRefreshAll}
            variant="outline"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar Todos los Precios'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}