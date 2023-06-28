import { company_user } from '../permissions/company_user';
import { Permissions } from '../types/Permissions';

export const getUserPermissions = async (): Promise<Permissions> => {
  return company_user.can;
};
