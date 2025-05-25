import { Module } from '@nestjs/common'
import { ImporterController } from './controller'
import { ImporterService } from './service'

@Module({
  controllers: [ImporterController],
  providers: [ImporterService],
})
export class ImporterModule {}
