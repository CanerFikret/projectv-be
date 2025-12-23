import { ApiProperty } from '@nestjs/swagger';

export class ServerRegisterInput {
  @ApiProperty()
  serverId: string;
}
