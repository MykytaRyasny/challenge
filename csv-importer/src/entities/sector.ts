import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ParentSector } from './parent-sector'

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @ManyToOne(() => ParentSector, (parentSector) => parentSector.sectors)
  parentSector: ParentSector
}
