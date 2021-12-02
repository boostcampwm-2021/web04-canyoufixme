/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { IProblem } from '@cyfm/types';

import { User } from './User';

@Entity()
export class Problem extends BaseEntity implements IProblem {
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

  @ManyToOne(type => User)
  @JoinColumn()
  author: User;
}
