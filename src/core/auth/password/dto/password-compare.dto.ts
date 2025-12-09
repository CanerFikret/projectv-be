export class PasswordCompareDto {
  password: string;
  hashedSaltedPassword: string;
  passwordSalt: string;

  constructor(partial: Partial<PasswordCompareDto>) {
    Object.assign(this, partial);
  }
}
