import { Entity, ObjectIdColumn, Column, ManyToOne, ObjectId } from 'typeorm';
import { Unit } from '@unit/infra/schema/Unit';
import { Status } from './eStatus';

@Entity('actives')
export class Active {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  model: string;

  @Column()
  proprietary: string;

  @Column()
  status: Status;

  @Column({ type: 'float' })
  health_level: number;

  @Column()
  company_id: string;

  @Column()
  unit_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at?: Date;

  @Column()
  image: string;

  @ManyToOne(() => Unit, unit => unit.active)
  unit: Unit;
}
