export class UserDto {
  id: string;
  email: string;
  password: string;
  passwordSalt: string;
  nickName: string;
  name: string;
  lastName: string | null;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
