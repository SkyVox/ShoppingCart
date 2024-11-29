import { UserRole } from '../enums/user-role.enum';

export interface UserPayload {
  Id: string;
  Name: string;
  Role: UserRole;
}
