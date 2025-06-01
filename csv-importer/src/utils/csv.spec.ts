import { parseAndDeduplicateCSV } from './csv'

describe('parseAndDeduplicateCSV', () => {
  it('parses CSV and removes duplicate rows', () => {
    const csvContent = `Country,Sector,Parent sector,1850,1851\nUSA,Energy,,1.1,1.2\nUSA,Energy,,1.1,1.2\nCAN,Transport,,2.1,2.2\n`
    const file = { buffer: Buffer.from(csvContent) } as Express.Multer.File
    const result = parseAndDeduplicateCSV(file)
    expect(result.length).toBe(2)
    expect(result[0]['Country']).toBe('USA')
    expect(result[1]['Country']).toBe('CAN')
    expect(result[0]['1850']).toBe('1.1')
    expect(result[0]['1851']).toBe('1.2')
    expect(result[1]['1850']).toBe('2.1')
    expect(result[1]['1851']).toBe('2.2')
  })

  it('handles empty files gracefully', () => {
    const file = { buffer: Buffer.from('') } as Express.Multer.File
    const result = parseAndDeduplicateCSV(file)
    expect(result).toEqual([])
  })

  it('parses CSV with extra columns and missing values', () => {
    const csvContent = `Country,Sector,Parent sector,1850,1851,Note\nUSA,Energy,,1.1,,Important\n`
    const file = { buffer: Buffer.from(csvContent) } as Express.Multer.File
    const result = parseAndDeduplicateCSV(file)
    expect(result.length).toBe(1)
    expect(result[0]['1850']).toBe('1.1')
    expect(result[0]['1851']).toBe('')
    expect(result[0]['Note']).toBe('Important')
  })
})
