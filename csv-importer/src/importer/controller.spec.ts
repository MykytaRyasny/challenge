import { Test, TestingModule } from '@nestjs/testing'
import { ImporterController } from './controller'
import { ImporterService } from './service'

describe('ImporterController', () => {
  let importerController: ImporterController
  let importerService: ImporterService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ImporterController],
      providers: [
        {
          provide: ImporterService,
          useValue: {
            uploadCSV: jest.fn(),
          },
        },
      ],
    }).compile()

    importerController = moduleRef.get<ImporterController>(ImporterController)
    importerService = moduleRef.get<ImporterService>(ImporterService)
  })

  it('should be defined', () => {
    expect(importerController).toBeDefined()
  })

  it('should call uploadCSV on the service', async () => {
    const mockFile = { buffer: Buffer.from('Country,Sector\nUSA,Energy') } as Express.Multer.File
    // Call the controller method
    await importerController.uploadCSV(mockFile)
    // Assert using a spy on the controller's service property
    const spy = jest.spyOn(importerService, 'uploadCSV')
    expect(spy).toHaveBeenCalledWith(mockFile)
  })

  it('should throw an error if no file is uploaded', () => {
    // @ts-expect-error: testing missing file scenario
    expect(() => importerController.uploadCSV(undefined)).toThrow('No file uploaded')
  })
})
