import { Status } from '@active/infra/schema/eStatus';

export interface ICreateActiveDTO {
  image: {
    data: string;
    name: string;
  };
  name: string;
  description: string;
  model: string;
  proprietary: string;
  status: Status;
  health_level: number;
  company_id: string;
  unit_id: string;
  created_at?: Date;
}
