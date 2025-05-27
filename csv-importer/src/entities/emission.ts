import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Country } from './country'
import { Sector } from './sector'

@Entity('emissions')
export class Emission {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Country)
  country: Country

  @ManyToOne(() => Sector)
  sector: Sector

  @Column()
  year: number

  @Column('double precision')
  emissions: number
}
