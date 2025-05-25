import { Test, TestingModule } from '@nestjs/testing'
import { ImporterService } from './service'

describe('ImporterService', () => {
  let service: ImporterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImporterService],
    }).compile()

    service = module.get<ImporterService>(ImporterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return "Hello World!"', () => {
    expect(service.getHello()).toBe('Hello World!')
  })
})
