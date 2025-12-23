import { ApiPropertyType } from '@common/decorators/api-property-type.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { ServerQueryIncludeInput } from './server-query-include.im';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ServerQueryInput {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  identifier: string;

  @ApiPropertyType(ServerQueryIncludeInput, false)
  @IsOptional()
  include?: ServerQueryIncludeInput;
}
