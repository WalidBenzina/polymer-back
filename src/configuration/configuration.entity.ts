import { BaseEntity } from 'src/base/base.entity'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('configurations')
export class Configuration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  nomEntreprise: string

  @Column({ type: 'varchar', length: 255 })
  adresseEntreprise: string

  @Column({ type: 'varchar', length: 20 })
  telephoneEntreprise1: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephoneEntreprise2: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailEntreprise: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  siteWebEntreprise: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoEntrepriseUrl: string

  @Column({ type: 'json', nullable: true })
  identifiantsEntreprise: Record<string, string>

  @Column({ type: 'varchar', length: 255, nullable: true })
  comptesBancairesEntreprise: string

  @Column({ type: 'json', nullable: true })
  variablesEnvironnementales: Record<string, string>
}
