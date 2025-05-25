import { Injectable } from '@nestjs/common'

@Injectable()
export class ImporterService {
  getHello(): string {
    return 'Hello World!'
  }
}
