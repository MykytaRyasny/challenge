import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Country } from '../entities/country'
import { Emission } from '../entities/emission'
import { ParentSector } from '../entities/parent-sector'
import { Sector } from '../entities/sector'
import { parseAndDeduplicateCSV } from '../utils/csv'
import { EmissionCsvRow } from './types'

/**
 * Service responsible for importing and inserting data from CSV files.
 * Handles deduplication, efficient batch insertion, and foreign key resolution for countries, sectors, parent sectors, and emissions.
 */
@Injectable()
export class ImporterService {
  constructor(
    @InjectRepository(Emission)
    private readonly emissionRepository: Repository<Emission>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(ParentSector)
    private readonly parentSectorRepository: Repository<ParentSector>,
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  /**
   * Main entrypoint for CSV import. Parses, deduplicates, and inserts all data in correct order.
   * @param file - The uploaded CSV file (as received from Multer).
   */
  async uploadCSV(file: Express.Multer.File): Promise<void> {
    const rows = parseAndDeduplicateCSV(file)
    await this.insertCountries(rows)
    await this.insertParentSectors(rows)
    await this.insertSectors(rows)
    await this.insertEmissions(rows)
  }

  /**
   * Inserts unique countries from the CSV rows into the database.
   * Deduplicates by country code (case-insensitive).
   * @param rows - Array of parsed CSV rows.
   */
  private async insertCountries(rows: EmissionCsvRow[]): Promise<void> {
    const codes = Array.from(new Set(rows.map((r) => (r['Country'] || '').toUpperCase()))).filter(
      Boolean,
    )
    const existing = await this.countryRepository.find({
      where: { code: In(codes) },
      select: ['code'],
    })
    const existingSet = new Set(existing.map((c) => c.code))
    const toInsert = codes.filter((code) => !existingSet.has(code)).map((code) => ({ code }))
    if (toInsert.length) await this.countryRepository.save(toInsert)
  }

  /**
   * Inserts unique parent sectors from the CSV rows into the database.
   * Skips empty or already existing parent sector names.
   * @param rows - Array of parsed CSV rows.
   */
  private async insertParentSectors(rows: EmissionCsvRow[]): Promise<void> {
    const names = Array.from(new Set(rows.map((r) => r['Parent sector'] || '').filter(Boolean)))
    for (const name of names) {
      const exists = await this.parentSectorRepository.findOne({ where: { name } })
      if (!exists) await this.parentSectorRepository.save({ name })
    }
  }

  /**
   * Inserts unique sectors from the CSV rows into the database, linking to parent sectors.
   * Deduplicates by sector/parent sector pair. Ensures parent sector exists before linking.
   * @param rows - Array of parsed CSV rows.
   */
  private async insertSectors(rows: EmissionCsvRow[]): Promise<void> {
    const pairs = Array.from(
      new Set(rows.map((r) => `${r['Sector']}||${r['Parent sector'] || ''}`)),
    ).map((key) => {
      const [sectorName, parentSectorName] = key.split('||')
      return { sectorName, parentSectorName }
    })
    for (const { sectorName, parentSectorName } of pairs) {
      if (!sectorName.trim()) continue
      let parentSector: ParentSector | null = null
      if (parentSectorName.trim()) {
        parentSector = await this.parentSectorRepository.findOne({
          where: { name: parentSectorName },
        })
      }
      const exists = await this.sectorRepository.findOne({
        where: { name: sectorName, parentSector: parentSector ?? undefined },
      })
      if (!exists)
        await this.sectorRepository.save({
          name: sectorName,
          parentSector: parentSector ?? undefined,
        })
    }
  }

  /**
   * Inserts emission records from the CSV rows into the database, resolving foreign keys efficiently.
   * Handles wide CSV format (one row per country/sector, columns for each year).
   * Deduplicates by (country, sector, year) and inserts in chunks for performance.
   * @param rows - Array of parsed CSV rows.
   */
  private async insertEmissions(rows: EmissionCsvRow[]): Promise<void> {
    const countries = await this.countryRepository.find()
    const sectors = await this.sectorRepository.find({ relations: ['parentSector'] })
    const countryMap = new Map(countries.map((c) => [c.code.toUpperCase(), c.id]))
    const sectorMap = new Map(
      sectors.map((s) => [`${s.name}||${s.parentSector ? s.parentSector.name : ''}`, s.id]),
    )
    const existing = await this.emissionRepository.find({
      select: ['country_id', 'sector_id', 'year'],
    })
    const existingKeys = new Set(existing.map((e) => `${e.country_id}|${e.sector_id}|${e.year}`))
    const emissionsToInsert: Array<{
      country_id: number
      sector_id: number
      year: number
      emissions: number
    }> = []
    for (const row of rows) {
      const country_id = countryMap.get((row['Country'] || '').toUpperCase())
      const sector_id = sectorMap.get(`${row['Sector'] || ''}||${row['Parent sector'] || ''}`)
      if (!country_id || !sector_id) continue
      for (const key of Object.keys(row)) {
        if (/^\d{4}$/.test(key)) {
          const year = parseInt(key, 10)
          const emissions = parseFloat(row[key])
          const emissionKey = `${country_id}|${sector_id}|${year}`
          if (!isNaN(year) && !isNaN(emissions) && !existingKeys.has(emissionKey)) {
            emissionsToInsert.push({ country_id, sector_id, year, emissions })
            existingKeys.add(emissionKey)
          }
        }
      }
    }
    const chunkSize = 1000
    for (let i = 0; i < emissionsToInsert.length; i += chunkSize) {
      await this.emissionRepository.insert(emissionsToInsert.slice(i, i + chunkSize))
    }
  }
}
