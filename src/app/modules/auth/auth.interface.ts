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

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
