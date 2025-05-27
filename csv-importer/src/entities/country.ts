import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Emission } from './emission'

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @OneToMany(() => Emission, (emission) => emission.country)
  emissions: Emission[]
}
