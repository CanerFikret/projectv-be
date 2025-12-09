export class AuthLoginInputDto {
  email: string;
  password: string;

  constructor(partial: Partial<AuthLoginInputDto>) {
    Object.assign(this, partial);
  }
}
