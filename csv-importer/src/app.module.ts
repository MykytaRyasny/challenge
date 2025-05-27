import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/module'
import { ImporterModule } from './importer/module'

@Module({
  imports: [DatabaseModule, ImporterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
