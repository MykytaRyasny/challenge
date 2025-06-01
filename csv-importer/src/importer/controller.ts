import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImporterService } from './service'

@Controller()
export class ImporterController {
  constructor(private readonly importerService: ImporterService) {}

  /**
   * Endpoint to upload a CSV file.
   * The file is expected to be sent as form-data with the key 'file'.
   */
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  uploadCSV(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded')
    }
    return this.importerService.uploadCSV(file)
  }
}
