export interface IUser {
  login?: string | null;
  password: string;
  role?: "USER" | "ADMIN" | "NOBRE";
}

export interface IUserLogin {
  login: string;
  password: string;
}
