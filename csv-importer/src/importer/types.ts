export interface EmissionCsvRow {
  country: string
  sector: string
  parent_sector: string
  [key: string]: string
}

export interface TableAggregation {
  count: number
  min?: number | null
  max?: number | null
}

export interface TableImportStats {
  inserted: number
  timeMs: number
  aggregation: TableAggregation
}

export interface ImportStats {
  countries: TableImportStats
  parentSectors: TableImportStats
  sectors: TableImportStats
  emissions: TableImportStats
}
