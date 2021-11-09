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
import { Problem } from './Problem';

@Entity()
export class SubmitLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  status: string;

  @Column()
  correctTestCount: number;

  @Column()
  wrontTestCount: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @OneToOne(type => Problem)
  @JoinColumn()
  problem: Problem;
}
