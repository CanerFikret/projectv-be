import { XOR } from '@prisma-client/internal/prismaNamespace';
import { IsNotEmpty } from 'class-validator';

export class ServerQueryDto {
  @IsNotEmpty()
  identifier: string;

  include?: ServerQueryIncludeDto;

  constructor(serverQueryDto?: Partial<ServerQueryDto>) {
    Object.assign(this, serverQueryDto);
  }
}

export class ServerQueryIncludeDto {
  members?: boolean;
  generatedBy?: boolean;
  channels?: boolean;

  constructor(serverQueryIncludeDto: Partial<ServerQueryIncludeDto>) {
    Object.assign(this, serverQueryIncludeDto);
  }
}
