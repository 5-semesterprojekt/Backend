export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  orgId: number[];
  token?: string;
}
export interface BeforeCreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  orgId: number[];
  token?: string;
}
