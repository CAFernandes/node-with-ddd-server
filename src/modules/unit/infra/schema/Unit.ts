import {
  Entity,
  ObjectIdColumn,
  Column,
  ManyToOne,
  OneToMany,
  ObjectId,
} from 'typeorm';
import { Company } from '@company/infra/schema/Company';
import { Active } from '@active/infra/schema/Active';

@Entity('units')
export class Unit {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  company_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => Company, company => company.units)
  company: Company;

  @OneToMany(() => Active, active => active.unit)
  active: Active[];
}
