export interface IAuth {
  email: string;
  password?: string;
}

export interface IJwtPayload {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}
