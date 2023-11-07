export interface user {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  orgId: number[];
  token?: string;
}
