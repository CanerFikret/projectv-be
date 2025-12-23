import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseStatus } from '@common/enums/response-status.enum';
import { StatusResponse } from './status-response.vm';

export class SuccessResponse extends StatusResponse {
  @Expose()
  @ApiProperty()
  status = ResponseStatus.Success;
}
