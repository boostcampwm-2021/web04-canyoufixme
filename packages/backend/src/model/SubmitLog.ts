/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ISubmitLog } from '@cyfm/types';

import { User } from './User';
import { Problem } from './Problem';

@Entity()
export class SubmitLog extends BaseEntity implements ISubmitLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  status: string;

  @Column()
  correctTestCount: number;

  @Column()
  wrongTestCount: number;

  @Column({ length: 30 })
  codeId: string;

  @ManyToOne(type => User)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Problem)
  @JoinColumn()
  problem: Problem;
}
