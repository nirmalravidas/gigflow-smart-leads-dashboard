import { UserRole } from "../../../types";

export interface IUpdateUserRoleDto {
  role: UserRole;
}

export interface IUserListResponseDto {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
  }>;
  total: number;
}
