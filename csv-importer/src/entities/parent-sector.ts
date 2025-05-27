import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Sector } from './sector'

@Entity('parent_sectors')
export class ParentSector {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @OneToMany(() => Sector, (sector) => sector.parentSector)
  sectors: Sector[]
}
