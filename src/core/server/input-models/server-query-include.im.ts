import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ServerQueryIncludeInput {
  @ApiProperty()
  @Optional()
  members?: boolean;

  @ApiProperty()
  @Optional()
  generatedBy?: boolean;

  @ApiProperty()
  @Optional()
  channels?: boolean;
}
