import { useState } from 'react'
import type { SortField, SortConfig } from '@/types'

export const useSorting = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'symbol',
    direction: 'asc'
  })

  const handleSort = (field: SortField): void => {
    setSortConfig(prevConfig => {
      if (prevConfig.field === field) {
        // Toggle direction: asc -> desc -> asc
        return {
          field,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return {
        field,
        direction: 'asc'
      }
    })
  }

  return {
    sortConfig,
    handleSort,
  }
}
