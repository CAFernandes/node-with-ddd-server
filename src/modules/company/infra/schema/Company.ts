import { Entity, ObjectIdColumn, Column, OneToMany, ObjectId } from 'typeorm';
import { Unit } from '@unit/infra/schema/Unit';
import { User } from '@user/infra/schema/User';

@Entity('companies')
export class Company {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at?: Date;

  @OneToMany(() => Unit, unit => unit.company)
  units: Unit[];

  @OneToMany(() => User, user => user.company)
  users: User[];
}
