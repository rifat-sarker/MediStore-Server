import { UserRole } from "../user/user.interface";

export interface IAuth {
  email: string;
  phone?: string;
  password: string;
}

export interface IJwtPayload {
  userId: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
}
