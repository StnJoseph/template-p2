import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TravelPlan } from '../../travel-plans/entities/travel-plan.entity';

@Entity('countries')
export class Country {
  @PrimaryColumn({ length: 3 })
  code: string; // Código alpha-3 (ej: COL, FRA)

  @Column()
  name: string;

  @Column()
  region: string;

  @Column({ nullable: true })
  subregion: string;

  @Column({ nullable: true })
  capital: string;

  @Column({ type: 'integer' })
  population: number;

  @Column()
  flag: string; // URL de la bandera

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación con Travel Plans
  @OneToMany(() => TravelPlan, travelPlan => travelPlan.country)
  travelPlans: TravelPlan[];
}