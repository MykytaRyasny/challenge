import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm'
import { ParentSector } from './parent-sector'

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @ManyToOne(() => ParentSector, (parentSector) => parentSector.sectors)
  @JoinColumn({ name: 'parent_sector_id' })
  parentSector: ParentSector
}
