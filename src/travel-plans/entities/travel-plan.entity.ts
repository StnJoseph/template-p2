import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';

@Entity('travel_plans')
export class TravelPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3 })
  countryCode: string; // Código alpha-3 del país destino

  @Column()
  title: string; // Título del viaje

  @Column({ type: 'date' })
  startDate: Date; // Fecha de inicio

  @Column({ type: 'date' })
  endDate: Date; // Fecha de fin

  @Column({ type: 'text', nullable: true })
  notes: string; // Notas opcionales

  @CreateDateColumn()
  createdAt: Date;

  // Relación con Country (opcional pero útil)
  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'countryCode', referencedColumnName: 'code' })
  country: Country;
}