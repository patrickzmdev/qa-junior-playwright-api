export interface IUserPayload {
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
}