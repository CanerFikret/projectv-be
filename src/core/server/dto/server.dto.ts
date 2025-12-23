import { UserWithoutPasswordDto } from '@core/user/dto/user.dto';

export class ServerDto {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  members?: UserWithoutPasswordDto[];
  generatedBy?: UserWithoutPasswordDto;
  generatedAt: Date;

  constructor(serverDto: Partial<ServerDto>) {
    Object.assign(this, serverDto);
  }
}
