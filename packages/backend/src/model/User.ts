import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { IUser } from '@cyfm/types';

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 30, select: false })
  oauthType: string;

  @Column({ length: 200, select: false })
  token: string;
}
