import { UserRole } from '../enums/user-role.enum';

export interface UserPayload {
  Name: string;
  Role: UserRole;
}
