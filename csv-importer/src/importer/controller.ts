import { Controller, Get } from '@nestjs/common'
import { ImporterService } from './service'

@Controller()
export class ImporterController {
  constructor(private readonly importerService: ImporterService) {}

  @Get()
  getHello(): string {
    return this.importerService.getHello()
  }
}
