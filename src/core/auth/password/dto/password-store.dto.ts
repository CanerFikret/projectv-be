export class PasswordStoreDto {
  hashedSaltedPassword: string;
  passwordSalt: string;

  constructor(partial: Partial<PasswordStoreDto>) {
    Object.assign(this, partial);
  }
}
