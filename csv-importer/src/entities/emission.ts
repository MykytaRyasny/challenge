import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Country } from './country'
import { Sector } from './sector'

@Entity('emissions')
export class Emission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'country_id' })
  country_id: number

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country

  @Column({ name: 'sector_id' })
  sector_id: number

  @ManyToOne(() => Sector)
  @JoinColumn({ name: 'sector_id' })
  sector: Sector

  @Column()
  year: number

  @Column('double precision')
  emissions: number
}
