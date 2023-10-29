import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

@Entity()
export class Files {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', default: null })
  pdf: string[];

  @Column({ type: 'json', default: null })
  image: string[];

  @CreateDateColumn()
  date: Date;

  @ManyToOne((_) => Admin, (admin) => admin.files, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  admin: Admin;
}
