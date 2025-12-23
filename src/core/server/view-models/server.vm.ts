import { ApiPropertyType } from '@common/decorators/api-property-type.decorator';
import { User } from '@core/user/view-models/user.vm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Server {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description?: string | null;

  @Expose()
  @ApiPropertyType(User)
  members?: User[];

  @Expose()
  @ApiPropertyType(User)
  generatedBy?: User;

  @Expose()
  @ApiProperty()
  generatedAt: Date;
}
