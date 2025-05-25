import { Test, TestingModule } from '@nestjs/testing'
import { ImporterController } from './controller'
import { ImporterService } from './service'

describe('ImporterController', () => {
  let importerController: ImporterController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImporterController],
      providers: [ImporterService],
    }).compile()

    importerController = app.get<ImporterController>(ImporterController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(importerController.getHello()).toBe('Hello World!')
    })
  })
})
