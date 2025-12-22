export class AccessTokenPayloadDto {
  tokenId: string;
  userId: string;
  name: string;
  lastName?: string | null;
  nickName?: string;
  email: string;

  constructor(partial: Partial<AccessTokenPayloadDto>) {
    Object.assign(this, partial);
  }
}
