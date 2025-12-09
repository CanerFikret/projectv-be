export class AuthTokenGenerateResultDto {
  token: string;
  tokenId: string;

  constructor(partial: Partial<AuthTokenGenerateResultDto>) {
    Object.assign(this, partial);
  }
}
