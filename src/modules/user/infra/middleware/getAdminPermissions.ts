import { administrator } from '../permissions/administrator';
import { Permissions } from '../types/Permissions';

export const getAdminPermissions = async (): Promise<Permissions> => {
  return administrator.can;
};
