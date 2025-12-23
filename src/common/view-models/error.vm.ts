import { ErrorType } from '@common/exceptions/error-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Error {
  @Expose()
  @ApiProperty({
    required: true,
    enum: ErrorType,
  })
  code: number;

  @Expose()
  @ApiProperty({
    required: true,
  })
  message: string;
}
