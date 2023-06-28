import { Status } from '../schema/eStatus';

export interface IUpdateActiveDTO {
  id: string;
  unit_id: string;
  company_id: string;
  status: Status;
  health_level: number;
  model: string;
  description: string;
}
