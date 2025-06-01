import { parse } from 'csv-parse/sync'
import { EmissionCsvRow } from '../importer/types'

export function parseAndDeduplicateCSV(file: Express.Multer.File): EmissionCsvRow[] {
  const records = parse(file.buffer, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as EmissionCsvRow[]
  return Array.from(new Set(records.map((row) => JSON.stringify(row)))).map(
    (row) => JSON.parse(row) as EmissionCsvRow,
  )
}
