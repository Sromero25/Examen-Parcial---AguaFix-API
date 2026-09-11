import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'WATER_REPORT' })
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  address: string;

  @Column('text')
  description: string;

  @Column('text')
  severity: string;

  @Column('text')
  reporterPhone: string;

  @Column('boolean', { default: false })
  isResolved: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}