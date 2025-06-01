import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Country } from '../entities/country'
import { Emission } from '../entities/emission'
import { ParentSector } from '../entities/parent-sector'
import { Sector } from '../entities/sector'
import { ImporterService } from './service'
describe('ImporterService', () => {
  let service: ImporterService
  let countryRepository: { find: jest.Mock; save: jest.Mock }
  let parentSectorRepository: { findOne: jest.Mock; save: jest.Mock }
  let sectorRepository: { findOne: jest.Mock; save: jest.Mock; find: jest.Mock }
  let emissionRepository: { find: jest.Mock; insert: jest.Mock }

  beforeEach(async () => {
    countryRepository = { find: jest.fn(), save: jest.fn() }
    parentSectorRepository = { findOne: jest.fn(), save: jest.fn() }
    sectorRepository = { findOne: jest.fn(), save: jest.fn(), find: jest.fn() }
    emissionRepository = { find: jest.fn(), insert: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImporterService,
        { provide: getRepositoryToken(Emission), useValue: emissionRepository },
        { provide: getRepositoryToken(Country), useValue: countryRepository },
        { provide: getRepositoryToken(ParentSector), useValue: parentSectorRepository },
        { provide: getRepositoryToken(Sector), useValue: sectorRepository },
        { provide: WINSTON_MODULE_PROVIDER, useValue: { info: jest.fn(), error: jest.fn() } },
      ],
    }).compile()
    service = module.get<ImporterService>(ImporterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('insertCountries', () => {
    it('should insert only new countries (case-insensitive)', async () => {
      countryRepository.find.mockResolvedValue([{ code: 'USA' }])
      const mockRows = [{ Country: 'USA' }, { Country: 'usa' }, { Country: 'CAN' }]
      await (
        service as unknown as { insertCountries: (rows: unknown[]) => Promise<void> }
      ).insertCountries(mockRows)
      expect(countryRepository.save).toHaveBeenCalledWith([{ code: 'CAN' }])
    })
  })

  describe('insertParentSectors', () => {
    it('should insert only new parent sectors', async () => {
      parentSectorRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ name: 'Transport' })
      const mockRows = [
        { 'Parent sector': 'Energy' },
        { 'Parent sector': 'Transport' },
        { 'Parent sector': 'Energy' },
      ]
      await (
        service as unknown as { insertParentSectors: (rows: unknown[]) => Promise<void> }
      ).insertParentSectors(mockRows)
      expect(parentSectorRepository.save).toHaveBeenCalledWith({ name: 'Energy' })
      expect(parentSectorRepository.save).not.toHaveBeenCalledWith({ name: 'Transport' })
    })
  })

  describe('insertSectors', () => {
    it('should insert only new sectors with correct parent', async () => {
      parentSectorRepository.findOne
        .mockResolvedValueOnce({ name: 'Energy' })
        .mockResolvedValueOnce({ name: 'Transport' })
      sectorRepository.findOne.mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined)
      const mockRows = [
        { Sector: 'Power', 'Parent sector': 'Energy' },
        { Sector: 'Road', 'Parent sector': 'Transport' },
        { Sector: 'Power', 'Parent sector': 'Energy' },
      ]
      await (
        service as unknown as { insertSectors: (rows: unknown[]) => Promise<void> }
      ).insertSectors(mockRows)
      expect(sectorRepository.save).toHaveBeenCalledWith({
        name: 'Power',
        parentSector: { name: 'Energy' },
      })
      expect(sectorRepository.save).toHaveBeenCalledWith({
        name: 'Road',
        parentSector: { name: 'Transport' },
      })
    })
  })

  describe('insertEmissions', () => {
    it('should insert only new emissions and deduplicate', async () => {
      countryRepository.find.mockResolvedValue([{ code: 'USA', id: 1 }])
      sectorRepository.find.mockResolvedValue([
        { name: 'Power', parentSector: { name: 'Energy' }, id: 2 },
      ])
      emissionRepository.find.mockResolvedValue([])
      const mockRows = [
        {
          Country: 'USA',
          Sector: 'Power',
          'Parent sector': 'Energy',
          '2000': '1.1',
          '2001': '1.2',
        },
        {
          Country: 'USA',
          Sector: 'Power',
          'Parent sector': 'Energy',
          '2000': '1.1',
          '2001': '1.2',
        },
      ]
      await (
        service as unknown as { insertEmissions: (rows: unknown[]) => Promise<void> }
      ).insertEmissions(mockRows)
      expect(emissionRepository.insert).toHaveBeenCalled()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const inserted = emissionRepository.insert.mock.calls[0][0]
      expect(inserted).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ country_id: 1, sector_id: 2, year: 2000, emissions: 1.1 }),
          expect.objectContaining({ country_id: 1, sector_id: 2, year: 2001, emissions: 1.2 }),
        ]),
      )
    })
  })
})
