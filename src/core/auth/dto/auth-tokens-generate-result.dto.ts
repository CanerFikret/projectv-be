export class AuthTokensGenerateResultDto {
  refreshToken: string;
  accessToken: string;
  refreshTokenId: string;
  accessTokenId: string;

  constructor(partial: Partial<AuthTokensGenerateResultDto>) {
    Object.assign(this, partial);
  }
}
