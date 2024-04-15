export type EXPERINCES = {
  companyDOJ?: Date;
  companyDOR: Date;
  companyName?: string;
  id?: string;
  jobPosition?: string;
};

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  PROJECT_OWNER = 'project_owner',
  PROJECT_MANAGER = 'project_manager',
  TEAM_LEADER = 'team_leader',
  EMPLOYEE = 'employee',
}

export enum DEPARTMENT_LIST {
  ADMINISTRATION = 'Administrator',
  MANAGEMENT = 'Management',
  HUMAN_RESOURCE = 'Human Resource',
  SALES_MARKETING = 'Sales & Marketing',
  WEB = 'Web',
  MOBILE = 'Mobile',
  UI_UX = 'UI/UX',
  QUALITY_ASSURANCE = 'Quality Assurance',
}

export const ValidRoles = [UserRole.ADMIN, UserRole.HR];

export enum EmployeeStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  DEACTIVATED = 'deactivated',
}

export const WorkingDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];
