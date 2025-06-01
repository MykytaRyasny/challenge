import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { Country } from '../entities/country'
import { Emission } from '../entities/emission'
import { ParentSector } from '../entities/parent-sector'
import { Sector } from '../entities/sector'
import { ImporterController } from './controller'
import { ImporterService } from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Emission, Country, ParentSector, Sector]),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              (info: { timestamp?: string; level: string; message: string }) =>
                `${info.timestamp ?? ''} [${info.level}]: ${info.message}`,
            ),
          ),
        }),
      ],
    }),
  ],
  controllers: [ImporterController],
  providers: [ImporterService],
})
export class ImporterModule {}
