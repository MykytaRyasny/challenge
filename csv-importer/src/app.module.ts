import { Module } from '@nestjs/common'
import { ImporterModule } from './importer/module'

@Module({
  imports: [ImporterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
