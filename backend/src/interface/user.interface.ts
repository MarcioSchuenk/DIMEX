export interface IUser {
  login?: string | null;
  password: string;
  role?: "USER" | "ADMIN" | "MODERATOR";
}

export interface IUserLogin {
  login: string;
  password: string;
}
