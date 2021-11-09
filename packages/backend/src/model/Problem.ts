/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Column,
  OneToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Problem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 30 })
  category: string;

  @Column()
  level: number;

  @Column({ length: 30 })
  codeId: string;

  @OneToOne(type => User)
  @JoinColumn()
  author: User;
}
