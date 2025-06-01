import { Module } from '@nestjs/common'
import { ImporterController } from './controller'
import { ImporterService } from './service'
import { Emission } from '../entities/emission'
import { Country } from '../entities/country'
import { ParentSector } from '../entities/parent-sector'
import { Sector } from '../entities/sector'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Emission, Country, ParentSector, Sector])],
  controllers: [ImporterController],
  providers: [ImporterService],
})
export class ImporterModule {}
