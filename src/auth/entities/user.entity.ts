import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'SYSTEM_USER' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password?: string;

  @Column('boolean', { default: false })
  isNotificationEnabled: boolean;
}