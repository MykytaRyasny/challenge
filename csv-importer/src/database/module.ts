import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Country } from '../entities/country'
import { Emission } from '../entities/emission'
import { ParentSector } from '../entities/parent-sector'
import { Sector } from '../entities/sector'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_PORT!, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'importer',
      schema: process.env.DB_SCHEMA || 'public',
      entities: [Country, ParentSector, Sector, Emission],
      synchronize: false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Country, ParentSector, Sector, Emission]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
