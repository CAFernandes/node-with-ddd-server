import { Company } from '@company/infra/schema/Company';

export interface ListUserDTO {
  name: string;
  username: string;
  relation?: Company | null;
}
