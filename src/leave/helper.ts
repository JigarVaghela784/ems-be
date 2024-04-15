import { UserRole } from '../user/types/user.types';
const { ADMIN, HR, EMPLOYEE, PROJECT_MANAGER, PROJECT_OWNER, TEAM_LEADER } =
  UserRole;

export const editAccessRoles = (role: string) => {
  switch (role) {
    case ADMIN:
      return [HR, ADMIN, PROJECT_OWNER, PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE];
    case HR:
      return [HR, PROJECT_OWNER, PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE];
    case PROJECT_OWNER:
      return [PROJECT_OWNER, PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE];
    case PROJECT_MANAGER:
      return [PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE];
    case TEAM_LEADER:
      return [EMPLOYEE];
    default:
      return [];
  }
};
