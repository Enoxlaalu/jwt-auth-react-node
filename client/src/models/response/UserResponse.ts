export interface UserResponse {
  _id: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}
