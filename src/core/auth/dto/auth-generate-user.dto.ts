export class AuthGenerateUserDto {
  name: string;
  lastName?: string | null;
  email: string;
  password: string;
  nickName?: string;

  constructor(partial: Partial<AuthGenerateUserDto>) {
    Object.assign(this, partial);
  }
}
