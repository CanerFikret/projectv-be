export class RefreshTokenPayloadDto {
  tokenId: string;
  userId: string;

  constructor(partial: Partial<RefreshTokenPayloadDto>) {
    Object.assign(this, partial);
  }
}
